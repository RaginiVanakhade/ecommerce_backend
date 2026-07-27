const express = require("express");

const router = express.Router();

const checkoutController = require("../controllers/checkout.controller");
const authenticate = require("../middleware/auth.middleware");
const authorize = require("../middleware/authorize.middleware");

router.post(
  "/",
  authenticate,
  authorize("CUSTOMER"),
  checkoutController.checkout,
);

module.exports = router;
