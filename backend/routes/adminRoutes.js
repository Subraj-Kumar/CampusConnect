const express = require("express");
const router = express.Router();

const {
  getPendingEvents,
  approveEvent,
  rejectEvent
} = require("../controllers/eventController");

const { isAuthenticated } = require("../middleware/authMiddleware");
const { isAdmin } = require("../middleware/roleMiddleware");

router.get("/events/pending", isAuthenticated, isAdmin, getPendingEvents);

router.put("/events/:id/approve", isAuthenticated, isAdmin, approveEvent);

router.delete("/events/:id/reject", isAuthenticated, isAdmin, rejectEvent);

module.exports = router;