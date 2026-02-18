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
  checkRegistrationStatus, // Added Day 17
  getEventAttendees        // Added Day 19
} = require("../controllers/eventController");

// Import middleware
const { isAuthenticated } = require("../middleware/authMiddleware");
const { isOrganizer } = require("../middleware/roleMiddleware");
const upload = require("../middleware/uploadMiddleware"); // Added Day 21

// --- 1. SPECIFIC AUTHENTICATED ROUTES (Always Before Generic :id) ---

/**
 * @desc Check if a specific student is registered for an event
 * @route GET /api/events/:id/registration-status
 */
router.get("/:id/registration-status", isAuthenticated, checkRegistrationStatus);

/**
 * @desc Get full attendee list for an event (Organizer Only)
 * @route GET /api/events/:id/attendees
 */
router.get("/:id/attendees", isAuthenticated, isOrganizer, getEventAttendees);

/**
 * @desc View personal registrations (Student Only)
 */
router.get("/my/registrations", isAuthenticated, getMyRegistrations);

/**
 * @desc View created events with analytics (Organizer Only)
 */
router.get("/my/events", isAuthenticated, isOrganizer, getMyEvents);


// --- 2. PARAMETERIZED ROUTES (With :id) ---

/**
 * @desc Student registers for an event
 * @route POST /api/events/:id/register
 */
router.post("/:id/register", isAuthenticated, registerForEvent);

/**
 * @desc Get details of a single event
 * @route GET /api/events/:id
 */
router.get("/:id", getEventById);


// --- 3. GENERAL / BASE ROUTES ---

/**
 * @desc Create a new event with poster upload
 * @route POST /api/events
 * Logic: 'upload.single("poster")' looks for a file field named "poster" in the request
 */
router.post(
  "/",
  isAuthenticated,
  isOrganizer,
  upload.single("poster"), // Added for Day 21
  createEvent
);

/**
 * @desc List all approved events (supports search/filter)
 */
router.get("/", getApprovedEvents);

module.exports = router;