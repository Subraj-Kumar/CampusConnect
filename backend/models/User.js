const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true
    },
    password: {
      type: String,
      required: true,
      minlength: 6
    },
    role: {
      type: String,
      enum: ["student", "organizer", "admin"],
      default: "student"
    },
    organization: {
      type: String // club / placement cell name (optional)
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);