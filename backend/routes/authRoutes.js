const express = require("express");
const router = express.Router();
const passport = require("passport"); 
const jwt = require("jsonwebtoken");  

// Import controller functions
const {
  registerUser,
  loginUser,
  updateProfile,
  getPendingOrganizers, 
  approveOrganizer,
  rejectOrganizer,
  forgotPassword,  // 🚀 NEW: Added from our previous session
  resetPassword    // 🚀 NEW: Added from our previous session
} = require("../controllers/authController");

// Import middleware
const { isAuthenticated } = require("../middleware/authMiddleware");
const { isAdmin } = require("../middleware/roleMiddleware"); 

// 🚀 SMART ROUTING: Use an environment variable for the frontend URL, fallback to localhost for testing
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:3000";

// --- 📧 STANDARD EMAIL ROUTES ---
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/forgotpassword", forgotPassword); // 🚀 NEW: Password recovery
router.put("/resetpassword/:resettoken", resetPassword); // 🚀 NEW: Password recovery

// Profile route is protected - requires a valid JWT token
router.put("/profile", isAuthenticated, updateProfile);

// --- 🛡️ ADMIN ACTIONS (Organizer Approvals) ---
// These routes require both login (isAuthenticated) AND admin privileges (isAdmin)
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

    // 4. Bounce the user back to the React app dynamically using CLIENT_URL
    res.redirect(`${CLIENT_URL}/oauth-success?token=${token}&user=${encodedUser}`);
  }
);

module.exports = router;