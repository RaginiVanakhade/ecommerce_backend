const mongoose = require("mongoose");
const Wishlist = require("../models/wishlist.model");
const Product = require("../models/product.model");

const getMyWishlist = async (req, res) => {
  try {
    const wishlist = await Wishlist.findOne({ user: req.user.id }).populate({
      path: "products",
      populate: {
        path: "category",
        select: "name description",
      },
    });

    return res.status(200).json({
      success: true,
      message: wishlist ? "Wishlist fetched successfully" : "Wishlist is empty",
      data: {
        _id: wishlist?._id || null,
        products: wishlist?.products || [],
        totalItems: wishlist?.products?.length || 0,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const addToWishlist = async (req, res) => {
  try {
    const { productId } = req.body;

    if (!productId || !mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({
        success: false,
        message: "Valid Product ID is required",
      });
    }

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    let wishlist = await Wishlist.findOne({ user: req.user.id });

    if (!wishlist) {
      wishlist = await Wishlist.create({
        user: req.user.id,
        products: [productId],
      });
    } else {
      const alreadyExists = wishlist.products.some(
        (id) => id.toString() === productId,
      );

      if (alreadyExists) {
        return res.status(200).json({
          success: true,
          message: "Product is already in wishlist",
        });
      }

      wishlist.products.push(productId);
      await wishlist.save();
    }

    return res.status(201).json({
      success: true,
      message: "Product added to wishlist successfully",
      data: wishlist,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const removeFromWishlist = async (req, res) => {
  try {
    const { productId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Product ID",
      });
    }

    const wishlist = await Wishlist.findOne({ user: req.user.id });

    if (!wishlist) {
      return res.status(404).json({
        success: false,
        message: "Wishlist not found",
      });
    }

    const originalLength = wishlist.products.length;

    wishlist.products = wishlist.products.filter(
      (id) => id.toString() !== productId,
    );

    if (wishlist.products.length === originalLength) {
      return res.status(404).json({
        success: false,
        message: "Product is not in wishlist",
      });
    }

    await wishlist.save();

    return res.status(200).json({
      success: true,
      message: "Product removed from wishlist successfully",
      data: wishlist,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const clearWishlist = async (req, res) => {
  try {
    const wishlist = await Wishlist.findOneAndUpdate(
      { user: req.user.id },
      { $set: { products: [] } },
      { new: true },
    );

    return res.status(200).json({
      success: true,
      message: "Wishlist cleared successfully",
      data: {
        products: wishlist?.products || [],
        totalItems: 0,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getMyWishlist,
  addToWishlist,
  removeFromWishlist,
  clearWishlist,
};
