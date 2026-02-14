const express = require("express");
const router = express.Router();

// Import controller functions
const {
  registerUser,
  loginUser,
  updateProfile
} = require("../controllers/authController");

// Import middleware
const { isAuthenticated } = require("../middleware/authMiddleware");

// Routes
router.post("/register", registerUser);
router.post("/login", loginUser);

// Profile route is protected - requires a valid JWT token
router.put("/profile", isAuthenticated, updateProfile);

module.exports = router;