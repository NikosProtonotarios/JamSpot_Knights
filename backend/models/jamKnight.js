const mongoose = require("mongoose");

const jamKnightSchema = new mongoose.Schema(
  {
    title: { type: String, required: true }, // Title of the jam night (e.g., 80s Night)
    location: { type: String, required: true }, // Location of the jam night
    date: { type: Date, required: true }, // Date and time of the jam night
    summary: { type: String }, // Short description of the event
    songs: [
      {
        title: { type: String, required: true }, // Title of the song
        roles: [
          {
            instrument: { type: String, required: true }, // e.g., Guitar, Drums
            musician: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Musician taking the role
          },
        ],
      },
    ],
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    }, // Reference to the showRunner (owner)
    isConfirmed: { type: Boolean, default: false }, // If the event is confirmed by the owner
    confirmedMusicians: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // Musicians confirmed for the jam
  },
  { timestamps: true }
);

const JamKnight = mongoose.model("JamKnight", jamKnightSchema);

module.exports = JamKnight;