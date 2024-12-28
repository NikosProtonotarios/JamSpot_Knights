const mongoose = require("mongoose");
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    userType: {
      type: String,
      enum: ["showRunner", "musician"],
      required: true,
    }, // User can either be showRunner or musician
    photo: { type: String }, // Path to the user's profile picture (optional)
    bio: { type: String }, // Short biography (optional)
    instruments: [{ type: String }], // Instruments the user plays (musicians only)
    jamNightsParticipated: [
      { type: mongoose.Schema.Types.ObjectId, ref: "JamKnight" },
    ], // Jam nights the user participated in (musicians only)
    roles: [{ type: String }], // Roles played in different events (musicians only)
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
