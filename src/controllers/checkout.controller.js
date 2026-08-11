const Cart = require("../models/cart.model");
const Order = require("../models/order.model");
const User = require("../models/user.model");
const { STATUS_FLOW } = require("../constants/orderStatus");
const checkoutService = require("../services/checkout.service");
const { sendOrdersNotification } = require("../services/notification.service");

const checkout = async (req, res) => {
  try {
    const createdOrders = await checkoutService.checkoutFromCart({
      user: req.user.id,
      product,
      quantity,
    });

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
