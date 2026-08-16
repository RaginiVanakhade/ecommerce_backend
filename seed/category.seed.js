require("dotenv").config();

const mongoose = require("mongoose");
const Category = require("../src/models/category.model");

const categories = [
  {
    name: "Electronics",
    description: "Phones, laptops, and other electronic gadgets",
  },
  {
    name: "Fashion",
    description: "Clothing, footwear, and accessories for men and women",
  },
  {
    name: "Home & Kitchen",
    description: "Furniture, appliances, and everyday home essentials",
  },
  {
    name: "Beauty & Personal Care",
    description: "Skincare, haircare, makeup, and grooming products",
  },
  {
    name: "Sports & Fitness",
    description: "Gym equipment, sportswear, and outdoor gear",
  },
  {
    name: "Books",
    description: "Fiction, non-fiction, academic, and children's books",
  },
  {
    name: "Toys & Games",
    description: "Toys, board games, and puzzles for all ages",
  },
  {
    name: "Grocery",
    description: "Daily essentials, packaged food, and beverages",
  },
  {
    name: "Mobiles & Accessories",
    description: "Smartphones, cases, chargers, and earphones",
  },
  {
    name: "Furniture",
    description: "Sofas, beds, tables, and storage furniture",
  },
  {
    name: "Health & Wellness",
    description: "Supplements, medical devices, and wellness products",
  },
  {
    name: "Automotive",
    description: "Car and bike accessories, tools, and spare parts",
  },
  {
    name: "Baby Care",
    description: "Baby food, diapers, toys, and nursery essentials",
  },
  {
    name: "Pet Supplies",
    description: "Food, toys, and accessories for pets",
  },
  {
    name: "Stationery & Office",
    description: "Office supplies, stationery, and school essentials",
  },
];

const seedCategories = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    console.log("✅ MongoDB Connected");

    for (const category of categories) {
      await Category.findOneAndUpdate({ name: category.name }, category, {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true,
      });

      console.log(`✅ ${category.name}`);
    }

    console.log("\n🎉 All 15 categories completed!");

    process.exit(0);
  } catch (error) {
    console.error("❌ Seed Error:", error);
    process.exit(1);
  }
};

seedCategories();
