const Order = require("../models/order.model");

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

module.exports = {
  getOrders,
};
