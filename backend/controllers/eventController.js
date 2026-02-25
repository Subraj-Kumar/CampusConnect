const Event = require("../models/Event");
const Registration = require("../models/Registration");
const User = require("../models/User");
const sendEmail = require("../utils/sendEmail"); 
const cloudinary = require("../config/cloudinary"); 

// ==========================================
// Check Registration Status & Discovery
// ==========================================

exports.getUpcomingSliderEvents = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0,0,0,0);
    const nextWeek = new Date();
    nextWeek.setDate(today.getDate() + 7);
    nextWeek.setHours(23,59,59,999); 

    const events = await Event.find({
      isApproved: true,
      date: { $gte: today, $lte: nextWeek }
    }).sort({ date: 1 }); 

    res.json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getCalendarEvents = async (req, res) => {
  try {
    const { year, month } = req.query;

    if (!year || !month) {
      return res.status(400).json({ message: "Year and month are required" });
    }

    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59);

    const events = await Event.find({
      isApproved: true,
      date: { $gte: startDate, $lte: endDate }
    }).select("title date organizationName"); 

    res.json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.checkRegistrationStatus = async (req, res) => {
  try {
    const registration = await Registration.findOne({
      event: req.params.id,
      student: req.user._id
    });

    res.json({ registered: !!registration }); 
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ==========================================
// 1. ORGANIZER ACTIONS
// ==========================================

exports.createEvent = async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      date,
      time,
      venue,
      registrationDeadline,
      externalFormUrl, 
      hasRefreshments  
    } = req.body;

    let posterUrl = "";

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
      externalFormUrl, 
      hasRefreshments: hasRefreshments === "true" || hasRefreshments === true, 
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

exports.updateEvent = async (req, res) => {
  try {
    let event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });

    // Check ownership
    if (event.organizer.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized to edit this event" });
    }

    let posterUrl = event.poster;
    
    // 🚀 NEW LOGIC: If a new file is uploaded, upload it AND delete the old one
    if (req.file) {
      // 1. Upload the NEW poster
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

      // 2. Clean up the OLD poster from Cloudinary (if it existed)
      if (event.poster) {
        try {
          // Extract the public_id from the old URL
          const oldPublicId = event.poster.split('/').pop().split('.')[0];
          await cloudinary.uploader.destroy(`campusconnect_events/${oldPublicId}`);
          console.log(`🗑️ Successfully deleted old poster: ${oldPublicId}`);
        } catch (imgError) {
          console.warn("⚠️ Could not delete old image from Cloudinary:", imgError.message);
        }
      }
    }

    const { hasRefreshments, ...rest } = req.body;

    const updatedData = {
      ...rest,
      poster: posterUrl,
      hasRefreshments: hasRefreshments === "true" || hasRefreshments === true,
      isApproved: false // Requires re-approval if modified
    };

    event = await Event.findByIdAndUpdate(req.params.id, updatedData, { new: true });
    res.json(event);
  } catch (error) {
    console.error("Update Event Error:", error.message);
    res.status(500).json({ message: "Update failed" });
  }
};

// 🚀 NEW: Organizer Delete Function
exports.deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });

    // 🚀 NEW: CLOUDINARY CLEANUP
    if (event.poster) {
      try {
        // Extract public_id from the Cloudinary URL
        // Example URL: .../campusconnect_events/sample_id.jpg
        const publicId = event.poster.split('/').pop().split('.')[0];
        await cloudinary.uploader.destroy(`campusconnect_events/${publicId}`);
      } catch (imgError) {
        console.warn("Could not delete image from Cloudinary:", imgError.message);
      }
    }

    await event.deleteOne();
    await Registration.deleteMany({ event: req.params.id });

    res.json({ message: "Event and associated media deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getMyEvents = async (req, res) => {
  try {
    const events = await Event.find({ organizer: req.user._id });

    const eventsWithCounts = await Promise.all(
      events.map(async (event) => {
        // Fallback calculation in case the counter ever goes out of sync
        const count = await Registration.countDocuments({
          event: event._id
        });

        return {
          ...event._doc,
          registrationCount: Math.max(event.registrationCount, count)
        };
      })
    );

    res.json(eventsWithCounts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

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

exports.getApprovedEvents = async (req, res) => {
  try {
    const { search, category, sort } = req.query;

    const today = new Date();
    today.setHours(0, 0, 0, 0); 
    
    const twoWeeksAgo = new Date();
    twoWeeksAgo.setDate(today.getDate() - 14);

    let query = {
      isApproved: true,
      date: { $gte: twoWeeksAgo } 
    };

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

    const enhancedEvents = events.map((event) => {
      const eventDate = new Date(event.date);
      eventDate.setHours(0, 0, 0, 0); 
      const diff = eventDate - today;
      const daysLeft = Math.ceil(diff / (1000 * 60 * 60 * 24));

      return {
        ...event._doc,
        daysLeft
      };
    });

    res.json(enhancedEvents);
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

    // 🚀 THE COUNTER FIX: Increment the total registrations in the Event document
    await Event.findByIdAndUpdate(req.params.id, { $inc: { registrationCount: 1 } });

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