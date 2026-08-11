const Order = require("../models/order.model");
const Cart = require("../models/cart.model");
const User = require("../models/user.model");

const { sendOrdersNotification } = require("../services/notification.service");

const checkoutFromCart = async ({ userId }) => {
  // Find Cart
  const cart = await Cart.findOne({
    user: userId,
  }).populate("items.product");

  if (!cart || cart.items.length === 0) {
    throw new Error("Cart is empty");
  }

  // Find User
  const user = await User.findById(userId);

  const createdOrders = [];

  // Check Products & Stock
  for (const item of cart.items) {
    if (!item.product) {
      throw new Error("Product not found");
    }

    if (item.product.stock < item.quantity) {
      throw new Error(`${item.product.name} is out of stock`);
    }
  }

  // Create Orders
  for (const item of cart.items) {
    const order = await Order.create({
      user: userId,
      product: item.product._id,
      quantity: item.quantity,
      totalAmount: item.product.price * item.quantity,
      status: "PENDING",
      statusHistory: [
        {
          status: "PENDING",
          updatedBy: userId,
        },
      ],
    });

    createdOrders.push(order);

    // Reduce Stock
    item.product.stock -= item.quantity;
    await item.product.save();

    // Send WhatsApp Notification
    await sendOrdersNotification({
      user,
      order,
      product: item.product,
      type: `ORDER_${order.status}`,
    });
  }

  // Clear Cart
  cart.items = [];
  await cart.save();

  return createdOrders;
};

module.exports = {
  checkoutFromCart,
};
