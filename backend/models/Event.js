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
      enum: ["Workshop", "Talk", "Hackathon", "Seminar", "Sports", "Technical", "Recreational", "Cultural", "Event", "Other"],
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
    poster: {
      type: String,
      default: "" // Cloudinary URL stored here
    },
    organizer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    organizationName: {
      type: String
    },
    registrationDeadline: {
      type: Date
    },
    isApproved: {
      type: Boolean,
      default: false
    },
    // 🚀 ANALYTICS TRACKING
    registrationCount: {
      type: Number,
      default: 0
    },
    // 🔗 GOOGLE FORM / EXTERNAL LINK
    externalFormUrl: {
      type: String,
      default: ""
    },
    // 🍕 AMENITIES TOGGLE
    hasRefreshments: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Event", eventSchema);