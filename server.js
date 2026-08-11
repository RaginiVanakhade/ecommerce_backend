require("dotenv").config();
const app = require("./src/app");
const connectDB = require("./src/config/db");
const cors = require("cors");

connectDB();

app.use(cors());
app.listen(5000, () => {
  console.log("Server is running on port 5000");
});
