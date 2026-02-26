const express = require("express");
const router = express.Router();

// Import all controller functions
const {
  createEvent,
  getApprovedEvents,
  getEventById,
  getMyEvents,
  registerForEvent,
  getMyRegistrations,
  checkRegistrationStatus,
  getEventAttendees,
  getUpcomingSliderEvents,
  getCalendarEvents,
  updateEvent,
  deleteEvent,
  getPendingEvents, // 🚀 NEW: Admin functions imported here
  approveEvent,
  rejectEvent
} = require("../controllers/eventController");

// Import middleware
const { isAuthenticated } = require("../middleware/authMiddleware");
const { isOrganizer, isAdmin } = require("../middleware/roleMiddleware"); // 🚀 NEW: Added isAdmin
const upload = require("../middleware/uploadMiddleware");

// --- 1. PRODUCT HOME ROUTES ---
router.get("/upcoming/slider", getUpcomingSliderEvents);
router.get("/calendar/month", getCalendarEvents);

// --- 2. 🛡️ ADMIN MODERATION ROUTES (Must be before :id routes) ---
// Frontend calls: /api/events/admin/pending
router.get("/admin/pending", isAuthenticated, isAdmin, getPendingEvents);
router.put("/:id/approve", isAuthenticated, isAdmin, approveEvent);
router.delete("/:id/reject", isAuthenticated, isAdmin, rejectEvent);

// --- 3. STATIC AUTHENTICATED ROUTES ---
router.get("/my/registrations", isAuthenticated, getMyRegistrations);
router.get("/my/events", isAuthenticated, isOrganizer, getMyEvents);

// --- 4. PARAMETERIZED ROUTES (With :id) ---
router.get("/:id/registration-status", isAuthenticated, checkRegistrationStatus);
router.get("/:id/attendees", isAuthenticated, isOrganizer, getEventAttendees);
router.post("/:id/register", isAuthenticated, registerForEvent);
router.put("/:id", isAuthenticated, upload.single("poster"), updateEvent);
router.delete("/:id", isAuthenticated, isOrganizer, deleteEvent);
router.get("/:id", getEventById);

// --- 5. GENERAL / BASE ROUTES ---
router.post("/", isAuthenticated, isOrganizer, upload.single("poster"), createEvent);
router.get("/", getApprovedEvents);

module.exports = router;