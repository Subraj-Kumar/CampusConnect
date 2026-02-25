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
  deleteEvent // 🚀 NEW: Import the delete function
} = require("../controllers/eventController");

// Import middleware
const { isAuthenticated } = require("../middleware/authMiddleware");
const { isOrganizer } = require("../middleware/roleMiddleware");
const upload = require("../middleware/uploadMiddleware");

// --- 1. PRODUCT HOME ROUTES ---
// Static public routes come first.
router.get("/upcoming/slider", getUpcomingSliderEvents);
router.get("/calendar/month", getCalendarEvents);


// --- 2. STATIC AUTHENTICATED ROUTES ---
// Must be declared before any :id routes to prevent route hijacking.
router.get("/my/registrations", isAuthenticated, getMyRegistrations);
router.get("/my/events", isAuthenticated, isOrganizer, getMyEvents);


// --- 3. PARAMETERIZED ROUTES (With :id) ---

/*
 * @desc Check registration status for a specific event
 */
router.get("/:id/registration-status", isAuthenticated, checkRegistrationStatus);

/*
 * @desc Get attendee list (Organizer Only)
 */
router.get("/:id/attendees", isAuthenticated, isOrganizer, getEventAttendees);

/*
 * @desc Student registers for an event
 */
router.post("/:id/register", isAuthenticated, registerForEvent);

/*
 * @desc Update an existing event (Organizer Only)
 */
router.put("/:id", isAuthenticated, upload.single("poster"), updateEvent);

/*
 * @desc Delete an event (Organizer Only) 🚀 NEW
 */
router.delete("/:id", isAuthenticated, isOrganizer, deleteEvent);

/*
 * @desc Get details of a single event
 */
router.get("/:id", getEventById);


// --- 4. GENERAL / BASE ROUTES ---

/*
 * @desc Create a new event
 */
router.post(
  "/",
  isAuthenticated,
  isOrganizer,
  upload.single("poster"),
  createEvent
);

/*
 * @desc List all approved events
 */
router.get("/", getApprovedEvents);

module.exports = router;