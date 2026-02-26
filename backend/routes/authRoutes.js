const express = require("express");
const router = express.Router();
const passport = require("passport"); 
const jwt = require("jsonwebtoken");  

// Import controller functions (Password routes temporarily removed for demo stability)
const {
  registerUser,
  loginUser,
  updateProfile,
  getPendingOrganizers, 
  approveOrganizer,
  rejectOrganizer
} = require("../controllers/authController");

// Import middleware
const { isAuthenticated } = require("../middleware/authMiddleware");
const { isAdmin } = require("../middleware/roleMiddleware"); 

// 🚀 FOOLPROOF FIX: Hardcoded Vercel URL for the Science Day demo!
const CLIENT_URL = "https://campus-connect-se.vercel.app";

// --- 📧 STANDARD EMAIL ROUTES ---
router.post("/register", registerUser);
router.post("/login", loginUser);

// Profile route is protected - requires a valid JWT token
router.put("/profile", isAuthenticated, updateProfile);

// --- 🛡️ ADMIN ACTIONS (Organizer Approvals) ---
router.get("/admin/organizers/pending", isAuthenticated, isAdmin, getPendingOrganizers);
router.put("/admin/organizers/:id/approve", isAuthenticated, isAdmin, approveOrganizer);
router.delete("/admin/organizers/:id/reject", isAuthenticated, isAdmin, rejectOrganizer);

// --- 🌐 GOOGLE OAUTH ROUTES ---

// Step 1: User clicks "Continue with Google" and is redirected to Google's consent screen
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// Step 2: Google redirects back here with the user's profile info
router.get(
  "/google/callback",
  passport.authenticate("google", { session: false, failureRedirect: `${CLIENT_URL}/login` }),
  (req, res) => {
    
    // 1. Generate our standard CampusConnect JWT
    const token = jwt.sign(
      { id: req.user._id, role: req.user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // 2. Package the user data to send back to React
    const userData = {
      _id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role,
      isApproved: req.user.isApproved 
    };

    // 3. Safely encode the user object into a URL string
    const encodedUser = encodeURIComponent(JSON.stringify(userData));

    // 4. Bounce the user straight to your Vercel site!
    res.redirect(`${CLIENT_URL}/oauth-success?token=${token}&user=${encodedUser}`);
  }
);

module.exports = router;