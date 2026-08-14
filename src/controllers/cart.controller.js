const Cart = require("../models/cart.model");
const Product = require("../models/product.model");

const getMyCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id }).populate({
      path: "items.product",
      select: "name price image stock category",
    });

    if (!cart || cart.items.length === 0) {
      return res.status(200).json({
        success: true,
        message: "Cart is empty",
        data: {
          items: [],
          totalItems: 0,
          totalAmount: 0,
        },
      });
    }

    const totalItems = cart.items.reduce(
      (total, item) => total + item.quantity,
      0,
    );

    const totalAmount = cart.items.reduce(
      (total, item) => total + item.product.price * item.quantity,
      0,
    );

    res.status(200).json({
      success: true,
      message: "Cart fetched successfully",
      data: {
        ...cart.toObject(),
        totalItems,
        totalAmount,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const addToCart = async (req, res) => {
  console.log("Add To Cart API Hit");
  try {
    const { productId, quantity } = req.body;

    console.log("req.user.id", req.user.id);

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    let cart = await Cart.findOne({ user: req.user.id });

    if (!cart) {
      cart = new Cart({
        user: req.user.id,
        items: [
          {
            product: productId,
            quantity,
          },
        ],
      });
    } else {
      const existingProduct = cart.items.find(
        (item) => item.product.toString() === productId,
      );

      if (existingProduct) {
        existingProduct.quantity += quantity;
      } else {
        cart.items.push({
          product: productId,
          quantity,
        });
      }
    }

    await cart.save();

    res.status(201).json({
      success: true,
      message: "Product added to cart successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const updateCartQuantity = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    const cart = await Cart.findOne({ user: req.user.id });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    const cartItem = cart.items.find(
      (item) => item.product.toString() === productId,
    );

    if (!cartItem) {
      return res.status(404).json({
        success: false,
        message: "Product not found in cart",
      });
    }

    if (quantity <= 0) {
      cart.items = cart.items.filter(
        (item) => item.product.toString() !== productId,
      );
    } else {
      cartItem.quantity = quantity;
    }

    await cart.save();

    res.status(200).json({
      success: true,
      message: "Cart updated successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params;

    const cart = await Cart.findOne({ user: req.user.id });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    const productExists = cart.items.some(
      (item) => item.product.toString() === productId,
    );

    if (!productExists) {
      return res.status(404).json({
        success: false,
        message: "Product not found in cart",
      });
    }

    cart.items = cart.items.filter(
      (item) => item.product.toString() !== productId,
    );

    await cart.save();

    res.status(200).json({
      success: true,
      message: "Product removed from cart successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getMyCart,
  addToCart,
  updateCartQuantity,
  removeFromCart,
};
