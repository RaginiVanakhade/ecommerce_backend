const express = require("express");

const router = express.Router();

const paymentController = require("../controllers/payment.controller");
const authenticate = require("../middleware/auth.middleware");
const authorize = require("../middleware/authorize.middleware");

router.post(
  "/create-order",
  // authenticate,
  // authorize("CUSTOMER"),
  paymentController.createPaymentOrder,
);

router.post(
  "/verify",
  // authenticate,
  // authorize("CUSTOMER"),
  paymentController.verifyPayment,
);

module.exports = router;
