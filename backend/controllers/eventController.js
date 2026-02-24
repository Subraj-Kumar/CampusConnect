const Event = require("../models/Event");
const Registration = require("../models/Registration");
const User = require("../models/User");
const sendEmail = require("../utils/sendEmail"); // Added for Day 20
const cloudinary = require("../config/cloudinary"); // For cloudinary multer


// ==========================================
// Check Registration Status
// ==========================================

// @desc    Get events happening within the next 7 days for the Hero Slider
// @route   GET /api/events/upcoming/slider
exports.getUpcomingSliderEvents = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0,0,0,0);
    const nextWeek = new Date();
    nextWeek.setDate(today.getDate() + 7);
    nextWeek.setHours(23,59,59,999) // 7-day window

    const events = await Event.find({
      isApproved: true,
      date: { $gte: today, $lte: nextWeek }
    }).sort({ date: 1 }); // Soonest events first

    res.json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get events for a specific month for the calendar widget
// @route   GET /api/events/calendar/month
exports.getCalendarEvents = async (req, res) => {
  try {
    const { year, month } = req.query;

    if (!year || !month) {
      return res.status(400).json({ message: "Year and month are required" });
    }

    // Define the boundaries of the month
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59);

    const events = await Event.find({
      isApproved: true,
      date: { $gte: startDate, $lte: endDate }
    }).select("title date organizationName"); // Optimize: select only necessary fields

    res.json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

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

// @desc    Create a new event (Pending Admin Approval) with optional poster upload
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

    let posterUrl = "";

    // If poster file exists, upload to Cloudinary
    if (req.file) {
      const uploadFromBuffer = () =>
        new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { folder: "campusconnect_events" },
            (error, result) => {
              if (error) return reject(error);
              resolve(result);
            }
          );
          stream.end(req.file.buffer);
        });

      const result = await uploadFromBuffer();
      posterUrl = result.secure_url;
    }

    const event = await Event.create({
      title,
      description,
      category,
      date,
      time,
      venue,
      registrationDeadline,
      organizer: req.user._id,
      organizationName: req.user.organization,
      poster: posterUrl
    });

    res.status(201).json(event);

  } catch (error) {
    console.error("Create Event Error:", error.message);
    res.status(500).json({ message: "Failed to create event" });
  }
};


// @desc    Get all events created by the logged-in organizer with registration counts
// @route   GET /api/events/my/events
exports.getMyEvents = async (req, res) => {
  try {
    const events = await Event.find({ organizer: req.user._id });

    // Map through events and attach registration counts concurrently
    const eventsWithCounts = await Promise.all(
      events.map(async (event) => {
        const count = await Registration.countDocuments({
          event: event._id
        });

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

// @desc    Get all attendees for a specific event (Organizer Only)
// @route   GET /api/events/:id/attendees
exports.getEventAttendees = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    if (event.organizer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to view this attendee list" });
    }

    const registrations = await Registration.find({
      event: req.params.id
    }).sort({ createdAt: -1 });

    res.json(registrations);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ==========================================
// 2. STUDENT & PUBLIC ACTIONS
// ==========================================

// @desc    Get all approved events
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

// @desc    Get single event by ID
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

// @desc    Register for event and trigger email confirmation
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

    // 1. Create the database registration entry
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

    // 2. Trigger Email Notification
    // Wrapped in a separate try/catch so email failure doesn't cancel the DB success
    try {
      await sendEmail(
        req.user.email,
        "Registration Confirmed! 🚀",
        `Hi ${req.user.name},

You have successfully registered for "${event.title}".

Event Details:
📅 Date: ${new Date(event.date).toLocaleDateString()}
📍 Venue: ${event.venue}

Thank you for using CampusConnect!`
      );
    } catch (err) {
      console.error("Email Service Error:", err.message);
      // We still return 201 because the database record was successful
    }

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