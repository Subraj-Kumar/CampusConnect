const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();

const connectDB = require("./config/db");

const app = express();

// Connect DB
connectDB();

// Middlewares
app.use(cors());
app.use(express.json());
app.use("/api/auth", require("./routes/authRoutes"));

// Test Route
app.get("/health", (req, res) => {
  res.json({ status: "OK", message: "CampusConnect backend running" });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});