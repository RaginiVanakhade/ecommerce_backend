const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const authenticate = require("../middleware/auth.middleware");
const authorize = require("../middleware/authorize.middleware");

router.post("/register", userController.createUser);

router.get(
  "/",
  authenticate,
  authorize("ADMIN", "MANAGER"),
  userController.getAllUsers,
);

router.get(
  "/:id",
  authenticate,
  authorize("ADMIN", "MANAGER"),
  userController.getUserById,
);

router.put(
  "/:id",
  authenticate,
  authorize("ADMIN", "MANAGER"),
  userController.updateUser,
);

router.delete(
  "/:id",
  authenticate,
  authorize("ADMIN", "MANAGER"),
  userController.deleteUser,
);

module.exports = router;
