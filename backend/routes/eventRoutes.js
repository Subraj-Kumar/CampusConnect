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
  getCalendarEvents
} = require("../controllers/eventController");

// Import middleware
const { isAuthenticated } = require("../middleware/authMiddleware");
const { isOrganizer } = require("../middleware/roleMiddleware");
const upload = require("../middleware/uploadMiddleware");

// --- 1. NEW: PRODUCT HOME ROUTES (Must be before :id routes) ---

/*
 * @desc Get events happening within next 7 days for Hero Slider
 * @route GET /api/events/upcoming/slider
*/
router.get("/upcoming/slider", getUpcomingSliderEvents);
router.get("/calendar/month", getCalendarEvents);

// --- 2. SPECIFIC AUTHENTICATED ROUTES ---

/*
 * @desc Check if a specific student is registered for an event
 * @route GET /api/events/:id/registration-status
 */
router.get("/:id/registration-status", isAuthenticated, checkRegistrationStatus);

/*
 * @desc Get full attendee list for an event (Organizer Only)
 * @route GET /api/events/:id/attendees
 */
router.get("/:id/attendees", isAuthenticated, isOrganizer, getEventAttendees);

/*
 * @desc View personal registrations (Student Only)
 */
router.get("/my/registrations", isAuthenticated, getMyRegistrations);

/*
 * @desc View created events with analytics (Organizer Only)
 */
router.get("/my/events", isAuthenticated, isOrganizer, getMyEvents);


// --- 3. PARAMETERIZED ROUTES (With :id) ---

/*
 * @desc Student registers for an event
 * @route POST /api/events/:id/register
 */
router.post("/:id/register", isAuthenticated, registerForEvent);

/*
 * @desc Get details of a single event
 * @route GET /api/events/:id
 */
router.get("/:id", getEventById);


// --- 4. GENERAL / BASE ROUTES ---

/*
 * @desc Create a new event with poster upload
 * @route POST /api/events
 */
router.post(
  "/",
  isAuthenticated,
  isOrganizer,
  upload.single("poster"),
  createEvent
);

/*
 * @desc List all approved events (supports search/filter)
 */
router.get("/", getApprovedEvents);

module.exports = router;