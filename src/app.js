const express = require("express");
console.log("App Loaded");
const userRoutes = require("./routes/user.routes");
const authRoutes = require("./routes/auth.routes");
const productRoutes = require("./routes/product.routes");
const categoryRoutes = require("./routes/category.routes");
const orderRoutes = require("./routes/order.routes");
const cartRoutes = require("./routes/cart.routes");
const checkoutRoutes = require("./routes/checkout.routes");
const paymentRoutes = require("./routes/payment.routes");

const app = express();
app.use(express.json());
app.use("/users", userRoutes);
app.use("/auth", authRoutes);
app.use("/products", productRoutes);
app.use("/categories", categoryRoutes);
app.use("/orders", orderRoutes);
app.use("/carts", cartRoutes);
app.use("/checkout", checkoutRoutes);
app.use("/payments", paymentRoutes);

console.log("Cart Routes Mounted");

module.exports = app;
