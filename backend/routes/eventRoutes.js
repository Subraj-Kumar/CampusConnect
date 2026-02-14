const express = require("express");
const router = express.Router();

const {
  createEvent,
  getApprovedEvents,
  getEventById,
  getMyEvents,
  registerForEvent,
  getMyRegistrations
} = require("../controllers/eventController");

const { isAuthenticated } = require("../middleware/authMiddleware");
const { isOrganizer } = require("../middleware/roleMiddleware");

// --- 1. SPECIFIC AUTHENTICATED ROUTES (No :id) ---
// These must come first so "my" isn't treated as an :id

// Student: View their own registrations
router.get("/my/registrations", isAuthenticated, getMyRegistrations); // Fixed typo: registraions -> registrations

// Organizer: View their own created events
router.get("/my/events", isAuthenticated, isOrganizer, getMyEvents);


// --- 2. PARAMETERIZED ROUTES (With :id) ---
// These catch any string after the slash, so they must be below specific routes

// Student: Register for a specific event
router.post("/:id/register", isAuthenticated, registerForEvent);

// Public/Student: Get single event details
router.get("/:id", getEventById);


// --- 3. GENERAL / BASE ROUTES ---
// These handle the root path of the resource

// Organizer: Create a new event
router.post("/", isAuthenticated, isOrganizer, createEvent);

// Public/Student: List all approved events (with search/filter)
router.get("/", getApprovedEvents);

module.exports = router;