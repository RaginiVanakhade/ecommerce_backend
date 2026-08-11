const Order = require("../models/order.model");
const Product = require("../models/product.model");
const User = require("../models/user.model");
const { STATUS_FLOW } = require("../constants/orderStatus");
const orderService = require("../services/order.service");
const { sendOrdersNotification } = require("../services/notification.service");

const createOrder = async (req, res) => {
  try {
    const { product, quantity } = req.body;

    // Logged-in User
    const userId = req.user.id;

    console.log("userId", userId);

    const order = await orderService.createBuyNowOrder({
      userId,
      product,
      quantity,
    });

    res.status(201).json({
      success: true,
      message: "Order placed successfully",
      data: order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getOrders = async (req, res) => {
  try {
    let filter = {};

    if (req.user.role === "CUSTOMER") {
      filter.user = req.user.id;
    }

    if (["ADMIN", "MANAGER"].includes(req.user.role) && req.query.userId) {
      filter.user = req.query.userId;
    }

    const orders = await orderService.getOrders(filter, req.user.role);

    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const order = await Order.findById(req.params.id);

    const user = await User.findById(order.user);

    const foundProduct = await Product.findById(order.product);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    const allowedStatus = STATUS_FLOW[order.status];

    if (!allowedStatus.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Cannot change status from ${order.status} to ${status}`,
      });
    }

    order.status = status;

    order.statusHistory.push({
      status,
      updatedBy: req.user.id,
    });

    await order.save();

    await sendOrdersNotification({
      user,
      order,
      product: foundProduct,
      type: `ORDER_${order.status}`,
    });

    res.status(200).json({
      success: true,
      message: "Order status updated successfully",
      data: order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getOrderTimeline = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate(
      "statusHistory.updatedBy",
      "name role",
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: order.statusHistory,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
module.exports = {
  createOrder,
  getOrders,
  updateOrderStatus,
  getOrderTimeline,
};
