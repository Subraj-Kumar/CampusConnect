const express = require("express");
const router = express.Router();

const {
  createEvent,
  getApprovedEvents,
  getEventById,
  getMyEvents
} = require("../controllers/eventController");

const { isAuthenticated } = require("../middleware/authMiddleware");
const { isOrganizer } = require("../middleware/roleMiddleware");

// Organizer creates event
router.post("/", isAuthenticated, isOrganizer, createEvent);

// Students view approved events
router.get("/", getApprovedEvents);

// Get single event
router.get("/:id", getEventById);

// Organizer dashboard
router.get("/my/events", isAuthenticated, isOrganizer, getMyEvents);

module.exports = router;