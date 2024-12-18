const mongoose = require("mongoose");

const musicianSchema = new mongoose.Schema(
  {
    musicianInfo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    }, // Links to the User
    photo: { type: String }, // Path to the musician's profile picture
    bio: { type: String }, // Short biography
    instruments: [{ type: String }], // Instruments the musician plays
    jamNightsParticipated: [
      { type: mongoose.Schema.Types.ObjectId, ref: "JamKnight" },
    ], // Jam nights the musician participated in
    roles: [{ type: String }], // Roles played in different events, e.g., Guitar, Drums
  },
  { timestamps: true }
);

const Musician = mongoose.model("Musician", musicianSchema);

module.exports = Musician;