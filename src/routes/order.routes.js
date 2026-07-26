const express = require("express");
const router = express.Router();
const orderController = require("../controllers/order.controller");
const authenticate = require("../middleware/auth.middleware");
const authorize = require("../middleware/authorize.middleware");

router.post(
  "/createOrder",
  authenticate,
  authorize("ADMIN", "MANAGER", "CUSTOMER"),
  orderController.createOrder,
);

router.get(
  "/",
  authenticate,
  authorize("ADMIN", "MANAGER", "CUSTOMER"),
  orderController.getOrders,
);

router.patch(
  "/updateOrderStatus/:id",
  authenticate,
  authorize("ADMIN", "MANAGER"),
  orderController.updateOrderStatus,
);

router.get(
  "/:id/timeline",
  authenticate,
  authorize("ADMIN", "MANAGER", "CUSTOMER"),
  orderController.getOrderTimeline,
);

module.exports = router;
