const User = require("../models/user.model");
const Product = require("../models/product.model");
const Cart = require("../models/cart.model");
const razorpay = require("../config/razorpay");

const createPaymentLink = async ({ userId, type, productId, quantity }) => {
  let totalAmount = 0;

  const user = await User.findById(userId);

  if (!user) {
    throw new Error("User not found");
  }

  if (type === "BUY_NOW") {
    const product = await Product.findById(productId);

    if (!product) {
      throw new Error("Product not found");
    }

    if (product.stock < quantity) {
      throw new Error("Insufficient stock");
    }

    totalAmount = product.price * quantity;
  } else if (type === "CART") {
    const cart = await Cart.findOne({
      user: userId,
    }).populate("items.product");

    if (!cart || cart.items.length === 0) {
      throw new Error("Cart is empty");
    }

    for (const item of cart.items) {
      totalAmount += item.product.price * item.quantity;
    }
  } else {
    throw new Error("Invalid payment type");
  }

  const paymentLink = await razorpay.paymentLink.create({
    amount: totalAmount * 100,
    currency: "INR",
    description: "Order Payment",

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
  });

  return paymentLink;
};

module.exports = {
  createPaymentLink,
};
