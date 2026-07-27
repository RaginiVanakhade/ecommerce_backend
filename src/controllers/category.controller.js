const Category = require("../models/category.model");

const createCategory = async (req, res) => {
  try {
    const category = new Category(req.body);

    await category.save();

    res.status(201).json({
      success: true,
      message: "Category created successfully",
      data: category,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Category already exists",
      });
    }

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getAllCategory = async (req, res) => {
  try {
    const categorys = await Category.find();

    res.status(200).json({
      success: true,
      data: categorys,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createCategory,
  getAllCategory,
};
