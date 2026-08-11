const Order = require("../models/order.model");
const Product = require("../models/product.model");
const User = require("../models/user.model");

const { sendOrdersNotification } = require("../services/notification.service");

const getOrders = async (filter, role) => {
  let query = Order.find(filter);

  if (role === "CUSTOMER") {
    query.populate({
      path: "product",
      select: "name price image",
      populate: {
        path: "category",
        select: "name",
      },
    });
  } else {
    query.populate("user", "name email").populate({
      path: "product",
      select: "name price image",
      populate: {
        path: "category",
        select: "name",
      },
    });
  }

  return await query.sort({ createdAt: -1 });
};

const createBuyNowOrder = async ({ userId, product, quantity }) => {
  // Find User
  const user = await User.findById(userId);

  // Find Product
  const foundProduct = await Product.findById(product);

  if (!foundProduct) {
    throw new Error("Product not found");
  }

  // Check Stock
  if (foundProduct.stock < quantity) {
    throw new Error("Insufficient stock");
  }

  // Calculate Total
  const totalAmount = foundProduct.price * quantity;

  // Create Order
  const order = new Order({
    user: userId,
    product,
    quantity,
    totalAmount,
    status: "PENDING",
    statusHistory: [
      {
        status: "PENDING",
        updatedBy: userId,
      },
    ],
  });

  await order.save();

  // Reduce Stock
  foundProduct.stock -= quantity;

  await foundProduct.save();

  await sendOrdersNotification({
    user,
    order,
    product: foundProduct,
    type: `ORDER_${order.status}`,
  });

  return order;
};

module.exports = {
  getOrders,
  createBuyNowOrder,
};
