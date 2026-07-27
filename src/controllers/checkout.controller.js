const Cart = require("../models/cart.model");
const Order = require("../models/order.model");
const User = require("../models/user.model");
const { STATUS_FLOW } = require("../constants/orderStatus");
const orderService = require("../services/order.service");
const { sendOrdersNotification } = require("../services/notification.service");

const checkout = async (req, res) => {
  try {
    const cart = await Cart.findOne({
      user: req.user.id,
    }).populate("items.product");

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Cart is empty",
      });
    }

    const user = await User.findById(req.user.id);

    const createdOrders = [];

    for (const item of cart.items) {
      if (item.product.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `${item.product.name} is out of stock`,
        });
      }
    }
    for (const item of cart.items) {
      const order = await Order.create({
        user: req.user.id,
        product: item.product._id,
        quantity: item.quantity,
        totalAmount: item.product.price * item.quantity,
      });

      createdOrders.push(order);

      item.product.stock -= item.quantity;

      await item.product.save();

      await sendOrdersNotification({
        user,
        order,
        product: item.product,
        type: `ORDER_${order.status}`,
      });
    }

    cart.items = [];

    await cart.save();

    console.log("Cart Found");

    res.status(201).json({
      success: true,
      message: "Checkout completed successfully",
      data: createdOrders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  checkout,
};
