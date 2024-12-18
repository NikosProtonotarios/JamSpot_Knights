const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    userType: {
      type: String,
      enum: ["showRunner", "musician"],
      required: true,
    }, // User can either be a showRunner or musician
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

module.exports = User;