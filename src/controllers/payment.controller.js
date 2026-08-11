const Cart = require("../models/cart.model");
const razorpay = require("../config/razorpay");
const Payment = require("../models/payment.model");
const Product = require("../models/product.model");
const User = require("../models/user.model");
const { sendWhatsAppMessage } = require("../services/whatsapp.service");

const crypto = require("crypto");

const { createBuyNowOrder } = require("../services/order.service");
const { checkoutFromCart } = require("../services/checkout.service");

const createPaymentOrder = async (req, res) => {
  try {
    const { type, productId, quantity } = req.body;

    let totalAmount = 0;
    let product = null;
    let cart = null;

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // ================= BUY NOW =================
    if (type === "BUY_NOW") {
      product = await Product.findById(productId);

      if (!product) {
        return res.status(404).json({
          success: false,
          message: "Product not found",
        });
      }

      if (product.stock < quantity) {
        return res.status(400).json({
          success: false,
          message: "Insufficient stock",
        });
      }

      totalAmount = product.price * quantity;
    }

    // ================= CART =================
    else if (type === "CART") {
      cart = await Cart.findOne({
        user: req.user.id,
      }).populate("items.product");

      if (!cart || cart.items.length === 0) {
        return res.status(400).json({
          success: false,
          message: "Cart is empty",
        });
      }

      for (const item of cart.items) {
        totalAmount += item.product.price * item.quantity;
      }
    }

    // ================= INVALID TYPE =================
    else {
      return res.status(400).json({
        success: false,
        message: "Invalid payment type",
      });
    }

    console.log("totalAmount", totalAmount);

    // ================= PAYMENT LINK =================
    const paymentLink = await razorpay.paymentLink.create({
      amount: totalAmount * 100,
      currency: "INR",

      description:
        type === "BUY_NOW"
          ? `Payment for ${product.name}`
          : "Payment for Cart Items",

      customer: {
        name: user.name,
        contact: user.mobile,
        email: user.email,
      },

      notify: {
        sms: false,
        email: false,
      },

      reminder_enable: true,

      notes:
        type === "BUY_NOW"
          ? {
              orderType: "BUY_NOW",
              productName: product.name,
              productId: product._id.toString(),
              quantity: quantity.toString(),
              price: product.price.toString(),
              totalAmount: totalAmount.toString(),
            }
          : {
              orderType: "CART",
              totalItems: cart.items.length.toString(),
              totalAmount: totalAmount.toString(),
            },
    });

    // ================= SAVE PAYMENT =================
    await Payment.create({
      user: req.user.id,
      razorpayPaymentLinkId: paymentLink.id,
      paymentLinkUrl: paymentLink.short_url,
      amount: totalAmount,
      currency: "INR",
      type,
      product: type === "BUY_NOW" ? productId : undefined,
      quantity: type === "BUY_NOW" ? quantity : undefined,
      status: "PENDING",
    });

    // ================= WHATSAPP =================
    let message = "";

    if (type === "BUY_NOW") {
      message = `🛒 Hello ${user.name}

📦 Product : ${product.name}
🔢 Quantity : ${quantity}
💰 Amount : ₹${totalAmount}

💳 Complete your payment:
${paymentLink.short_url}

Thank you ❤️`;
    } else {
      const items = cart.items
        .map(
          (item) =>
            `• ${item.product.name}\n   Qty: ${item.quantity} | ₹${item.product.price}`,
        )
        .join("\n\n");

      message = `🛒 Hello ${user.name}

Your Cart

${items}

💰 Total Amount : ₹${totalAmount}

💳 Complete your payment:
${paymentLink.short_url}

Thank you ❤️`;
    }

    await sendWhatsAppMessage({
      mobile: user.mobile,
      message,
    });

    // ================= RESPONSE =================
    res.status(200).json({
      success: true,
      message: "Payment link created successfully",
      data: {
        paymentLinkId: paymentLink.id,
        paymentLink: paymentLink.short_url,
        amount: totalAmount,
        type,
      },
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// const verifyPayment = async (req, res) => {
//   try {
//     const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
//       req.body;

//     const generatedSignature = crypto
//       .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
//       .update(`${razorpay_order_id}|${razorpay_payment_id}`)
//       .digest("hex");

//     if (generatedSignature !== razorpay_signature) {
//       return res.status(400).json({
//         success: false,
//         message: "Invalid payment signature",
//       });
//     }

//     const payment = await Payment.findOne({
//       razorpayOrderId: razorpay_order_id,
//     });

//     if (!payment) {
//       return res.status(404).json({
//         success: false,
//         message: "Payment not found",
//       });
//     }

//     let result;

//     if (payment.type === "BUY_NOW") {
//       result = await createBuyNowOrder({
//         userId: payment.user,
//         productId: payment.product,
//         quantity: payment.quantity,
//       });
//     } else {
//       result = await checkoutFromCart({
//         userId: payment.user,
//       });
//     }

//     payment.status = "SUCCESS";
//     payment.razorpayPaymentId = razorpay_payment_id;

//     await payment.save();

//     res.status(200).json({
//       success: true,
//       message: "Payment verified successfully",
//       data: result,
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

const verifyPayment = async (req, res) => {
  try {
    const { paymentLinkId } = req.body;

    const paymentLink = await razorpay.paymentLink.fetch(paymentLinkId);

    if (paymentLink.status !== "paid") {
      return res.status(400).json({
        success: false,
        message: "Payment not completed",
      });
    }

    const payment = await Payment.findOne({
      razorpayPaymentLinkId: paymentLinkId,
    });

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: "Payment not found",
      });
    }

    payment.status = "SUCCESS";
    await payment.save();

    if (payment.type === "BUY_NOW") {
      await createBuyNowOrder({
        userId: payment.user,
        product: payment.product,
        quantity: payment.quantity,
      });
    } else {
      await checkoutFromCart({
        userId: payment.user,
      });
    }

    res.status(200).json({
      success: true,
      message: "Payment verified successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createPaymentOrder,
  verifyPayment,
};
