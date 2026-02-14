const express = require("express");
const router = express.Router();

const {
  createEvent,
  getApprovedEvents,
  getEventById,
  getMyEvents,
  registerForEvent,
  getMyRegistrations,
  checkRegistrationStatus // Added for Day 17
} = require("../controllers/eventController");

const { isAuthenticated } = require("../middleware/authMiddleware");
const { isOrganizer } = require("../middleware/roleMiddleware");

// --- 1. SPECIFIC AUTHENTICATED ROUTES (No :id or before :id) ---

// Student: Check if already registered (DAY 17)
// Must be above /:id to avoid collision
router.get("/:id/registration-status", isAuthenticated, checkRegistrationStatus);

// Student: View their own registrations
router.get("/my/registrations", isAuthenticated, getMyRegistrations);

// Organizer: View their own created events
router.get("/my/events", isAuthenticated, isOrganizer, getMyEvents);


// --- 2. PARAMETERIZED ROUTES (With :id) ---

// Student: Register for a specific event
router.post("/:id/register", isAuthenticated, registerForEvent);

// Public/Student: Get single event details
router.get("/:id", getEventById);


// --- 3. GENERAL / BASE ROUTES ---

// Organizer: Create a new event
router.post("/", isAuthenticated, isOrganizer, createEvent);

// Public/Student: List all approved events (with search/filter)
router.get("/", getApprovedEvents);

module.exports = router;