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
    },
    photo: { type: String }, 
    bio: { type: String },
    instruments: [{ type: String }], 
    jamNightsParticipated: [
      { type: mongoose.Schema.Types.ObjectId, ref: "JamKnight" },
    ],
    roles: [{ type: String }],
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
