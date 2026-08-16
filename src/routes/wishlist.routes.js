const express = require("express");
const router = express.Router();

const wishlistController = require("../controllers/wishlist.controller");
const authenticate = require("../middleware/auth.middleware");

router.get("/", authenticate, wishlistController.getMyWishlist);
router.post("/add", authenticate, wishlistController.addToWishlist);
router.delete(
  "/remove/:productId",
  authenticate,
  wishlistController.removeFromWishlist,
);
router.delete("/clear", authenticate, wishlistController.clearWishlist);

module.exports = router;
