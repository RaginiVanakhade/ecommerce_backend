const express = require("express");
const router = express.Router();

const userController = require("../controllers/user.controller");
const authenticate = require("../middleware/auth.middleware");
const authorize = require("../middleware/authorize.middleware");

router.post("/register", userController.createUser);

// Logged-in user's own profile
router.get("/me/profile", authenticate, userController.getMyProfile);
router.put("/me/profile", authenticate, userController.updateMyProfile);
router.patch("/me/change-password", authenticate, userController.changePassword);

// Admin/manager user management
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
  authorize("ADMIN"),
  userController.deleteUser,
);

module.exports = router;
