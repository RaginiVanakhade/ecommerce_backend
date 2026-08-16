const express = require("express");
const router = express.Router();
const productController = require("../controllers/product.controller");
const authenticate = require("../middleware/auth.middleware");
const authorize = require("../middleware/authorize.middleware");
const upload = require("../middleware/upload.middleware");

router.post(
  "/createProduct",
  authenticate,
  authorize("ADMIN", "MANAGER"),
  upload.single("image"),
  productController.createProduct,
);

router.put(
  "/updateProduct",
  authenticate,
  authorize("ADMIN", "MANAGER"),
  upload.single("image"),
  productController.updateProduct,
);

router.delete(
  "/deleteProduct/:id",
  authenticate,
  authorize("ADMIN", "MANAGER"),
  productController.deleteProduct,
);

router.get(
  "/getCreatedAllProducts",
  authenticate,
  authorize("ADMIN", "MANAGER", "CUSTOMER"),
  productController.getAllProducts,
);

router.get("/getAllProducts", productController.getAllProducts);

module.exports = router;
