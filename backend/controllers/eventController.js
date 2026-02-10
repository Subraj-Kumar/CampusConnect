const Event = require("../models/Event");

// CREATE EVENT (Organizer)
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
      organizer: req.user._id,
      organizationName: req.user.organization
    });

    res.status(201).json(event);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET ALL APPROVED EVENTS (Students)
exports.getApprovedEvents = async (req, res) => {
  try {
    const events = await Event.find({ isApproved: true })
      .populate("organizer", "name email organization")
      .sort({ date: 1 });

    res.json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET SINGLE EVENT
exports.getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate("organizer", "name email organization");

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    res.json(event);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET ORGANIZER EVENTS
exports.getMyEvents = async (req, res) => {
  try {
    const events = await Event.find({ organizer: req.user._id });
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET PENDING EVENTS (Admin)
exports.getPendingEvents = async (req, res) => {
  try {
    const events = await Event.find({ isApproved: false })
      .populate("organizer", "name email organization");

    res.json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// APPROVE EVENT (Admin)
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

// DELETE / REJECT EVENT (Admin)
exports.rejectEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    await event.deleteOne();

    res.json({ message: "Event rejected and removed" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
