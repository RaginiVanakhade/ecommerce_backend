const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/category.controller");
const authenticate = require("../middleware/auth.middleware");
const authorize = require("../middleware/authorize.middleware");

router.post(
  "/createCategory",
  authenticate,
  authorize("ADMIN", "MANAGER"),
  categoryController.createCategory,
);

module.exports = router;
