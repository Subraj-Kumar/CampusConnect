const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const { isAuthenticated } = require("./middleware/authMiddleware");
const { isAdmin } = require("./middleware/roleMiddleware");

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
app.get("/api/admin/test", isAuthenticated, isAdmin, (req, res) => {
  res.json({
    message: "Welcome Admin",
    user: req.user
  });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});