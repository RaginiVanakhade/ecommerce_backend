const Product = require("../models/product.model");
const Category = require("../models/category.model");
const mongoose = require("mongoose");

const createProduct = async (req, res) => {
  try {
    const { name, description, price, stock, category, image } = req.body;

    if (!mongoose.Types.ObjectId.isValid(category)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Category ID",
      });
    }

    const isCategory = await Category.findById(category);
    if (!isCategory) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    const product = new Product({
      name,
      description,
      price,
      stock,
      category,
      image,
    });

    await product.save();
    res.status(201).json({
      success: true,
      message: "Product created successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().populate(
      "category",
      "name description",
    );

    res.status(200).json({
      success: true,
      data: products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createProduct,
  getAllProducts,
};
