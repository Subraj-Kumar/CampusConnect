const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      required: true
    },
    category: {
      type: String,
      enum: ["Workshop", "Talk", "Hackathon", "Seminar", "Other"],
      default: "Other"
    },
    date: {
      type: Date,
      required: true
    },
    time: {
      type: String,
      required: true
    },
    venue: {
      type: String,
      required: true
    },
    organizer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    organizationName: {
      type: String // Club / Dept / Placement Cell
    },
    registrationDeadline: {
      type: Date
    },
    isApproved: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Event", eventSchema);