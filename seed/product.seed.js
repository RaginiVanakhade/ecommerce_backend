require("dotenv").config();

const mongoose = require("mongoose");
const cloudinary = require("../src/config/cloudinary");

const Product = require("../src/models/product.model");
const Category = require("../src/models/category.model");

const products = [
  // ==================== ELECTRONICS ====================
  {
    name: "iPhone 15",
    description:
      "Apple iPhone 15 with powerful performance and advanced camera system.",
    price: 69999,
    stock: 20,
    categoryName: "Electronics",
    imageUrl: "https://images.unsplash.com/photo-1696446701796-da61225697cc",
  },
  {
    name: "Dell Inspiron Laptop",
    description:
      "Powerful laptop suitable for office work, study and everyday use.",
    price: 54999,
    stock: 15,
    categoryName: "Electronics",
    imageUrl: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853",
  },
  {
    name: "Sony Wireless Headphones",
    description: "Premium wireless headphones with immersive sound quality.",
    price: 4999,
    stock: 35,
    categoryName: "Electronics",
    imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e",
  },

  // ==================== FASHION ====================
  {
    name: "Men's Casual T-Shirt",
    description:
      "Comfortable cotton casual t-shirt suitable for everyday wear.",
    price: 799,
    stock: 50,
    categoryName: "Fashion",
    imageUrl: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab",
  },
  {
    name: "Women's Denim Jacket",
    description: "Stylish denim jacket suitable for casual occasions.",
    price: 1999,
    stock: 30,
    categoryName: "Fashion",
    imageUrl: "https://images.unsplash.com/photo-1543076447-215ad9ba6923",
  },
  {
    name: "Running Sneakers",
    description: "Comfortable sneakers designed for running and everyday use.",
    price: 2499,
    stock: 40,
    categoryName: "Fashion",
    imageUrl: "https://images.unsplash.com/photo-1542291026-7eec264c27ff",
  },

  // ==================== HOME & KITCHEN ====================
  {
    name: "Non Stick Cookware Set",
    description: "Premium non-stick cookware set for everyday cooking.",
    price: 2499,
    stock: 25,
    categoryName: "Home & Kitchen",
    imageUrl: "https://images.unsplash.com/photo-1556911220-bff31c812dba",
  },
  {
    name: "Electric Coffee Maker",
    description: "Compact coffee maker for preparing fresh coffee at home.",
    price: 3499,
    stock: 20,
    categoryName: "Home & Kitchen",
    imageUrl: "https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6",
  },
  {
    name: "Modern Kitchen Blender",
    description: "Powerful kitchen blender for smoothies and food preparation.",
    price: 2299,
    stock: 25,
    categoryName: "Home & Kitchen",
    imageUrl: "https://images.unsplash.com/photo-1570222094114-d054a817e56b",
  },

  // ==================== BEAUTY ====================
  {
    name: "Vitamin C Face Serum",
    description:
      "Daily skincare serum for a fresh and healthy-looking appearance.",
    price: 599,
    stock: 100,
    categoryName: "Beauty & Personal Care",
    imageUrl: "https://images.unsplash.com/photo-1556228578-8c89e6adf883",
  },
  {
    name: "Moisturizing Face Cream",
    description: "Hydrating face cream for daily skincare routine.",
    price: 449,
    stock: 80,
    categoryName: "Beauty & Personal Care",
    imageUrl: "https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd",
  },
  {
    name: "Hair Care Shampoo",
    description: "Gentle shampoo for clean and healthy-looking hair.",
    price: 399,
    stock: 75,
    categoryName: "Beauty & Personal Care",
    imageUrl: "https://images.unsplash.com/photo-1556229010-6c3f2c9ca5f8",
  },

  // ==================== SPORTS ====================
  {
    name: "Adjustable Dumbbells",
    description: "Adjustable dumbbells suitable for home strength training.",
    price: 2999,
    stock: 30,
    categoryName: "Sports & Fitness",
    imageUrl: "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61",
  },
  {
    name: "Yoga Mat",
    description: "Comfortable non-slip yoga mat for workouts and meditation.",
    price: 899,
    stock: 60,
    categoryName: "Sports & Fitness",
    imageUrl: "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f",
  },
  {
    name: "Fitness Water Bottle",
    description:
      "Reusable water bottle suitable for gym and outdoor activities.",
    price: 499,
    stock: 80,
    categoryName: "Sports & Fitness",
    imageUrl: "https://images.unsplash.com/photo-1602143407151-7111542de6e8",
  },

  // ==================== BOOKS ====================
  {
    name: "The Alchemist",
    description: "Popular inspirational fiction novel.",
    price: 399,
    stock: 50,
    categoryName: "Books",
    imageUrl: "https://images.unsplash.com/photo-1544947950-fa07a98d237f",
  },
  {
    name: "Programming Fundamentals",
    description: "Beginner-friendly book covering programming fundamentals.",
    price: 699,
    stock: 35,
    categoryName: "Books",
    imageUrl: "https://images.unsplash.com/photo-1532012197267-da84d127e765",
  },
  {
    name: "Business Strategy Guide",
    description: "Practical guide to business strategy and management.",
    price: 599,
    stock: 30,
    categoryName: "Books",
    imageUrl: "https://images.unsplash.com/photo-1589998059171-988d887df646",
  },

  // ==================== TOYS ====================
  {
    name: "LEGO Building Blocks",
    description: "Creative building blocks for children and family activities.",
    price: 1299,
    stock: 40,
    categoryName: "Toys & Games",
    imageUrl: "https://images.unsplash.com/photo-1587654780291-39c9404d746b",
  },
  {
    name: "Wooden Puzzle Game",
    description: "Educational wooden puzzle game for kids.",
    price: 499,
    stock: 45,
    categoryName: "Toys & Games",
    imageUrl: "https://images.unsplash.com/photo-1594736797933-d0f06ba9b6e6",
  },
  {
    name: "Remote Control Car",
    description: "Fun remote control car for kids.",
    price: 999,
    stock: 30,
    categoryName: "Toys & Games",
    imageUrl: "https://images.unsplash.com/photo-1594787318286-3d835c1d207f",
  },

  // ==================== GROCERY ====================
  {
    name: "Premium Basmati Rice",
    description: "Long-grain premium basmati rice suitable for everyday meals.",
    price: 699,
    stock: 100,
    categoryName: "Grocery",
    imageUrl: "https://images.unsplash.com/photo-1586201375761-83865001e31c",
  },
  {
    name: "Organic Coffee",
    description: "Premium roasted coffee beans with rich aroma and flavor.",
    price: 499,
    stock: 80,
    categoryName: "Grocery",
    imageUrl: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085",
  },
  {
    name: "Green Tea",
    description: "Refreshing green tea suitable for daily consumption.",
    price: 299,
    stock: 100,
    categoryName: "Grocery",
    imageUrl: "https://images.unsplash.com/photo-1556881286-fc6915169721",
  },

  // ==================== MOBILES ====================
  {
    name: "Samsung Galaxy S24",
    description:
      "Premium smartphone with advanced camera and high-resolution display.",
    price: 74999,
    stock: 20,
    categoryName: "Mobiles & Accessories",
    imageUrl: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf",
  },
  {
    name: "Wireless Earbuds",
    description: "Compact wireless earbuds with clear sound and charging case.",
    price: 1999,
    stock: 50,
    categoryName: "Mobiles & Accessories",
    imageUrl: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df",
  },
  {
    name: "Fast Charging Adapter",
    description: "Fast charging adapter compatible with modern smartphones.",
    price: 799,
    stock: 75,
    categoryName: "Mobiles & Accessories",
    imageUrl: "https://images.unsplash.com/photo-1583863788434-e58a36330cf0",
  },

  // ==================== FURNITURE ====================
  {
    name: "Modern 3 Seater Sofa",
    description: "Comfortable modern sofa for living rooms.",
    price: 24999,
    stock: 10,
    categoryName: "Furniture",
    imageUrl: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc",
  },
  {
    name: "Wooden Dining Table",
    description: "Modern wooden dining table suitable for family dining.",
    price: 15999,
    stock: 12,
    categoryName: "Furniture",
    imageUrl: "https://images.unsplash.com/photo-1617098900591-3f90928e8c54",
  },
  {
    name: "Modern Office Chair",
    description: "Ergonomic office chair designed for comfortable working.",
    price: 5999,
    stock: 20,
    categoryName: "Furniture",
    imageUrl: "https://images.unsplash.com/photo-1580480055273-228ff5388ef8",
  },

  // ==================== HEALTH ====================
  {
    name: "Digital Weight Scale",
    description:
      "Digital weighing scale with accurate measurement and LCD display.",
    price: 899,
    stock: 40,
    categoryName: "Health & Wellness",
    imageUrl: "https://images.unsplash.com/photo-1576610616656-d3aa5d1f4534",
  },
  {
    name: "Digital Thermometer",
    description:
      "Digital thermometer for quick and accurate temperature measurement.",
    price: 299,
    stock: 60,
    categoryName: "Health & Wellness",
    imageUrl: "https://images.unsplash.com/photo-1584362917165-526a968579e8",
  },
  {
    name: "Fitness Resistance Bands",
    description: "Resistance bands for home workouts and fitness training.",
    price: 599,
    stock: 50,
    categoryName: "Health & Wellness",
    imageUrl: "https://images.unsplash.com/photo-1598289431512-b97b0917affc",
  },

  // ==================== AUTOMOTIVE ====================
  {
    name: "Car Phone Holder",
    description: "Adjustable phone holder for cars.",
    price: 499,
    stock: 75,
    categoryName: "Automotive",
    imageUrl: "https://images.unsplash.com/photo-1503376780353-7e6692767b70",
  },
  {
    name: "Car Cleaning Kit",
    description: "Complete cleaning kit for maintaining your car.",
    price: 899,
    stock: 40,
    categoryName: "Automotive",
    imageUrl: "https://images.unsplash.com/photo-1607860108855-64acf2078ed9",
  },
  {
    name: "Car Emergency Kit",
    description: "Useful emergency tools and accessories for vehicles.",
    price: 1499,
    stock: 25,
    categoryName: "Automotive",
    imageUrl: "https://images.unsplash.com/photo-1487754180451-c456f719a1fc",
  },

  // ==================== BABY CARE ====================
  {
    name: "Baby Feeding Bottle",
    description: "Comfortable baby feeding bottle designed for everyday use.",
    price: 399,
    stock: 60,
    categoryName: "Baby Care",
    imageUrl: "https://images.unsplash.com/photo-1519689680058-324335c77eba",
  },
  {
    name: "Baby Diaper Pack",
    description: "Soft and comfortable diapers for babies.",
    price: 899,
    stock: 50,
    categoryName: "Baby Care",
    imageUrl: "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4",
  },
  {
    name: "Baby Soft Toy",
    description: "Soft and comfortable toy suitable for babies.",
    price: 599,
    stock: 40,
    categoryName: "Baby Care",
    imageUrl: "https://images.unsplash.com/photo-1559454403-b8fb88521f11",
  },

  // ==================== PET ====================
  {
    name: "Premium Dog Food",
    description: "Balanced daily nutrition food for adult dogs.",
    price: 1299,
    stock: 50,
    categoryName: "Pet Supplies",
    imageUrl: "https://images.unsplash.com/photo-1589924691995-400dc9ecc119",
  },
  {
    name: "Dog Chew Toy",
    description: "Durable chew toy designed for dogs.",
    price: 399,
    stock: 60,
    categoryName: "Pet Supplies",
    imageUrl: "https://images.unsplash.com/photo-1535294435445-d7249524ef2e",
  },
  {
    name: "Pet Feeding Bowl",
    description: "Durable feeding bowl suitable for dogs and cats.",
    price: 299,
    stock: 70,
    categoryName: "Pet Supplies",
    imageUrl: "https://images.unsplash.com/photo-1601758125946-6ec2ef64daf8",
  },

  // ==================== STATIONERY ====================
  {
    name: "Premium Notebook",
    description:
      "Premium ruled notebook suitable for school, college and office.",
    price: 299,
    stock: 100,
    categoryName: "Stationery & Office",
    imageUrl: "https://images.unsplash.com/photo-1531346680769-a1d79b57de5b",
  },
  {
    name: "Office Pen Set",
    description: "Smooth writing pens suitable for office and school use.",
    price: 199,
    stock: 150,
    categoryName: "Stationery & Office",
    imageUrl: "https://images.unsplash.com/photo-1585336261022-680e295ce3fe",
  },
  {
    name: "Desk Organizer",
    description: "Compact organizer for keeping your desk clean and organized.",
    price: 499,
    stock: 60,
    categoryName: "Stationery & Office",
    imageUrl: "https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85",
  },
];

const uploadImageToCloudinary = async (imageUrl, productName) => {
  const publicId = productName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");

  const result = await cloudinary.uploader.upload(imageUrl, {
    folder: "ecommerce/products",
    public_id: publicId,
    overwrite: true,
    resource_type: "image",
  });

  return {
    image: result.secure_url,
    imagePublicId: result.public_id,
  };
};

const seedProducts = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    console.log("✅ MongoDB Connected\n");

    let created = 0;
    let skipped = 0;

    for (const product of products) {
      try {
        const category = await Category.findOne({
          name: product.categoryName,
        });

        if (!category) {
          console.log(`❌ Category not found: ${product.categoryName}`);
          continue;
        }

        // Prevent duplicate products
        const existingProduct = await Product.findOne({
          name: product.name,
        });

        if (existingProduct) {
          console.log(`⏭️ Already exists: ${product.name}`);
          skipped++;
          continue;
        }

        console.log(`⬆️ Uploading: ${product.name}`);

        const cloudinaryImage = await uploadImageToCloudinary(
          product.imageUrl,
          product.name,
        );

        await Product.create({
          name: product.name,
          description: product.description,
          price: product.price,
          stock: product.stock,
          category: category._id,
          image: cloudinaryImage.image,
          imagePublicId: cloudinaryImage.imagePublicId,
        });

        console.log(`✅ Added: ${product.name}`);
        created++;
      } catch (error) {
        console.log(`❌ Failed: ${product.name}`);
        console.log(error.message);
      }
    }

    console.log("\n==============================");
    console.log("🎉 PRODUCT SEED COMPLETED");
    console.log("==============================");
    console.log(`✅ Created: ${created}`);
    console.log(`⏭️ Skipped: ${skipped}`);
    console.log(`📦 Total Products: ${products.length}`);

    process.exit(0);
  } catch (error) {
    console.error("❌ Seed Error:", error);
    process.exit(1);
  }
};

seedProducts();
