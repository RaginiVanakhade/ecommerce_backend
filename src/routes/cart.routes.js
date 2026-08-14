const express = require("express");

const router = express.Router();
const cartController = require("../controllers/cart.controller");
const authenticate = require("../middleware/auth.middleware");
const authorize = require("../middleware/authorize.middleware");

router.get(
  "/",
  // authenticate,
  // authorize("CUSTOMER"),
  cartController.getMyCart,
);

router.post(
  "/addToCart",
  // authenticate,
  // authorize("CUSTOMER"),
  cartController.addToCart,
);

router.patch(
  "/updateCartQuantity",
  // authenticate,
  // authorize("CUSTOMER"),
  cartController.updateCartQuantity,
);

router.delete(
  "/:productId",
  // authenticate,
  // authorize("CUSTOMER"),
  cartController.removeFromCart,
);

module.exports = router;
