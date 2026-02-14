const Event = require("../models/Event");
const Registration = require("../models/Registration");
const User = require("../models/User");

// ==========================================
// Check Registration Status
// ==========================================

// @desc    Check if a student is already registered for an event
// @route   GET /api/events/:id/registration-status
exports.checkRegistrationStatus = async (req, res) => {
  try {
    const registration = await Registration.findOne({
      event: req.params.id,
      student: req.user._id
    });

    // Returns true if registration exists, otherwise false
    res.json({ registered: !!registration }); 
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ==========================================
// 1. ORGANIZER ACTIONS
// ==========================================

// @desc    Create a new event (Pending Admin Approval)
exports.createEvent = async (req, res) => {
  try {
    const {
      title, description, category, date, time, venue, registrationDeadline
    } = req.body;

    const event = await Event.create({
      title,
      description,
      category,
      date,
      time,
      venue,
      registrationDeadline,
      organizer: req.user._id,
      organizationName: req.user.organization
    });

    res.status(201).json(event);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all events created by the logged-in organizer with registration counts
// @route   GET /api/events/my/events
exports.getMyEvents = async (req, res) => {
  try {
    // 1. Fetch all events belonging to the organizer
    const events = await Event.find({ organizer: req.user._id });

    // 2. Map through events and attach registration counts concurrently
    const eventsWithCounts = await Promise.all(
      events.map(async (event) => {
        const count = await Registration.countDocuments({
          event: event._id
        });

        // Use ._doc to access raw data and merge with our new virtual field
        return {
          ...event._doc,
          registrationCount: count
        };
      })
    );

    res.json(eventsWithCounts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET ATTENDEES FOR AN EVENT (Organizer)
// @desc    Get all attendees for a specific event (Organizer Only)
// @route   GET /api/events/:id/attendees
exports.getEventAttendees = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // AUTH CHECK: Ensure only the creator of the event can see the list
    if (event.organizer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to view this attendee list" });
    }

    // Find all registrations for this event
    const registrations = await Registration.find({
      event: req.params.id
    }).sort({ createdAt: -1 }); // Show newest registrations first

    res.json(registrations);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ==========================================
// 2. STUDENT & PUBLIC ACTIONS
// ==========================================

exports.getApprovedEvents = async (req, res) => {
  try {
    const { search, category, sort } = req.query;
    let query = { isApproved: true };

    if (search) {
      query.title = { $regex: search, $options: "i" };
    }

    if (category && category !== "All") {
      query.category = category;
    }

    let eventsQuery = Event.find(query).populate("organizer", "name email organization");

    if (sort === "asc") eventsQuery = eventsQuery.sort({ date: 1 });
    else if (sort === "desc") eventsQuery = eventsQuery.sort({ date: -1 });

    const events = await eventsQuery;
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).populate("organizer", "name email organization");

    if (!event) return res.status(404).json({ message: "Event not found" });

    if (!event.isApproved && req.user?.role === "student") {
      return res.status(403).json({ message: "Access denied: Event not approved yet" });
    }

    res.json(event);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

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

    if (!studentProfile.batch || !studentProfile.rollNumber || !studentProfile.branch) {
      return res.status(400).json({ 
        message: "Please complete your Academic Profile (Batch, Roll No, Branch) before registering." 
      });
    }

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

    res.status(201).json({ message: "Successfully registered!", registration });
  } catch (error) {
    if (error.code === 11000) return res.status(400).json({ message: "Already registered" });
    res.status(500).json({ message: error.message });
  }
};

exports.getMyRegistrations = async (req, res) => {
  try {
    const registrations = await Registration.find({ student: req.user._id }).populate("event");
    res.json(registrations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ==========================================
// 3. ADMIN MODERATION ACTIONS
// ==========================================

exports.getPendingEvents = async (req, res) => {
  try {
    const events = await Event.find({ isApproved: false }).populate("organizer", "name email organization");
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.approveEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });
    event.isApproved = true;
    await event.save();
    res.json({ message: "Event approved successfully", event });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.rejectEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });
    await event.deleteOne();
    res.json({ message: "Event rejected" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};