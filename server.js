const express = require("express");
const connectDB = require("./src/config/db.config");
const cors = require("cors");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const authRoutes = require("./src/routes/auth");
const purchaseRoutes = require("./src/routes/purchase");

dotenv.config();

connectDB();
const app = express();

const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/purchase", purchaseRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
