const Event = require("../models/Event");
const Registration = require("../models/Registration");
const User = require("../models/User");

// ==========================================
// 1. ORGANIZER ACTIONS
// ==========================================

// @desc    Create a new event (Pending Admin Approval)
// @route   POST /api/events
exports.createEvent = async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      date,
      time,
      venue,
      registrationDeadline
    } = req.body;

    const event = await Event.create({
      title,
      description,
      category,
      date,
      time,
      venue,
      registrationDeadline,
      organizer: req.user._id, // Tied to authenticated user
      organizationName: req.user.organization
    });

    res.status(201).json(event);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all events created by the logged-in organizer
// @route   GET /api/events/my/events
exports.getMyEvents = async (req, res) => {
  try {
    const events = await Event.find({ organizer: req.user._id });
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ==========================================
// 2. STUDENT & PUBLIC ACTIONS
// ==========================================

// @desc    Get all approved events (Search, Filter, Sort)
// @route   GET /api/events
exports.getApprovedEvents = async (req, res) => {
  try {
    const { search, category, sort } = req.query;

    let query = { isApproved: true };

    // Regex search for partial title matches
    if (search) {
      query.title = { $regex: search, $options: "i" };
    }

    if (category && category !== "All") {
      query.category = category;
    }

    let eventsQuery = Event.find(query).populate(
      "organizer",
      "name email organization"
    );

    // Dynamic sorting
    if (sort === "asc") {
      eventsQuery = eventsQuery.sort({ date: 1 });
    } else if (sort === "desc") {
      eventsQuery = eventsQuery.sort({ date: -1 });
    }

    const events = await eventsQuery;
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single event by ID (with security check)
// @route   GET /api/events/:id
exports.getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate("organizer", "name email organization");

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // Security: Students cannot see unapproved events via direct link
    if (!event.isApproved && req.user?.role === "student") {
      return res.status(403).json({ message: "Access denied: Event not approved yet" });
    }

    res.json(event);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Register a student for an event (with profile snapshot)
// @route   POST /api/events/:id/register
exports.registerForEvent = async (req, res) => {
  try {
    if (req.user.role !== "student") {
      return res.status(403).json({ message: "Only students can register for events" });
    }

    const event = await Event.findById(req.params.id);
    if (!event || !event.isApproved) {
      return res.status(404).json({ message: "Event not available for registration" });
    }

    const studentProfile = await User.findById(req.user._id);

    // Profile Completion Validation
    if (!studentProfile.batch || !studentProfile.rollNumber || !studentProfile.branch) {
      return res.status(400).json({ 
        message: "Please complete your Academic Profile (Batch, Roll No, Branch) before registering." 
      });
    }

    // Create registration with current profile details snapshot
    const registration = await Registration.create({
      event: event._id,
      student: studentProfile._id,
      studentDetails: {
        name: studentProfile.name,
        batch: studentProfile.batch,
        rollNumber: studentProfile.rollNumber,
        branch: studentProfile.branch
      }
    });

    res.status(201).json({
      message: "Successfully registered for the event!",
      registration
    });

  } catch (error) {
    // 11000 is the MongoDB code for Duplicate Key (Unique Index Failure)
    if (error.code === 11000) {
      return res.status(400).json({ message: "You are already registered for this event" });
    }
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all registrations for the logged-in student
// @route   GET /api/events/my/registrations
exports.getMyRegistrations = async (req, res) => {
  try {
    const registrations = await Registration.find({
      student: req.user._id
    }).populate("event");

    res.json(registrations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ==========================================
// 3. ADMIN MODERATION ACTIONS
// ==========================================

// @desc    Get all unapproved events
// @route   GET /api/admin/pending
exports.getPendingEvents = async (req, res) => {
  try {
    const events = await Event.find({ isApproved: false })
      .populate("organizer", "name email organization");

    res.json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Approve a pending event
// @route   PUT /api/admin/approve/:id
exports.approveEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    event.isApproved = true;
    await event.save();

    res.json({ message: "Event approved successfully", event });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Reject and delete an event
// @route   DELETE /api/admin/reject/:id
exports.rejectEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    await event.deleteOne();
    res.json({ message: "Event rejected and permanently removed" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};