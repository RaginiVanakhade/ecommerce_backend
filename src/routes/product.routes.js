const express = require("express");
const router = express.Router();
const productController = require("../controllers/product.controller");
const authenticate = require("../middleware/auth.middleware");
const authorize = require("../middleware/authorize.middleware");

router.post(
  "/createProduct",
  authenticate,
  authorize("ADMIN", "MANAGER"),
  productController.createProduct,
);

router.get(
  "/getAllProducts",
  authenticate,
  authorize("ADMIN", "MANAGER", "CUSTOMER"),
  productController.getAllProducts,
);

module.exports = router;
