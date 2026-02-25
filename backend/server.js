const express = require("express");
const dotenv = require("dotenv");

// 🟢 CRITICAL FIX: Load environment variables BEFORE importing anything else!
dotenv.config();

const cors = require("cors");
const connectDB = require("./config/db");

// Import Routes
const authRoutes = require("./routes/authRoutes");
const eventRoutes = require("./routes/eventRoutes");
const adminRoutes = require("./routes/adminRoutes");

// Import Utilities
const startCleanupJob = require("./utils/cleanupOldEvents"); // Phase D Cleanup

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- 📡 API Routes ---
app.use("/api/auth", authRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/admin", adminRoutes);

// Health Check
app.get("/", (req, res) => {
  res.send("CampusConnect API is running...");
});

// --- 🏗️ Server Initialization ---
const PORT = process.env.PORT || 5000;

// Connect to MongoDB and then start services
connectDB().then(() => {
  console.log("🚀 Database Connected Successfully");

  // 🧹 Start the Automated Cleanup System (Cron Job)
  // This handles 30-day data retention and Cloudinary image purging
  startCleanupJob(); 

  app.listen(PORT, () => {
    console.log(`🔥 Server running on http://localhost:${PORT}`);
    console.log(`🕒 Cron System: Active and scheduled for daily maintenance`);
  });
}).catch((err) => {
  console.error("❌ Database Connection Failed:", err.message);
  process.exit(1);
});