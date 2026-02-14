const mongoose = require("mongoose");

const registrationSchema = new mongoose.Schema(
  {
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: true
    },
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    // PHASE D: THE SNAPSHOT
    // This stores the student's data exactly as it was when they clicked 'Register'
    studentDetails: {
      name: { type: String, required: true },
      batch: { type: String, required: true },
      rollNumber: { type: String, required: true },
      branch: { type: String, required: true }
    }
  },
  { timestamps: true }
);

// Keep our professional compound index
registrationSchema.index({ event: 1, student: 1 }, { unique: true });

module.exports = mongoose.model("Registration", registrationSchema);