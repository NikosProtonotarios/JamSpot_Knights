const mongoose = require("mongoose");

const jamKnightSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    location: { type: String, required: true },
    date: { type: Date, required: true },
    summary: { type: String },
    songs: [
      {
        title: { type: String, required: true },
        roles: [
          {
            instrument: { type: String, required: true },
            musician: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
          },
        ],
      },
    ],
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    }, // Reference to the showRunner (owner)
    isConfirmed: { type: Boolean, default: false },
    confirmedMusicians: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

const JamKnight = mongoose.model("JamKnight", jamKnightSchema);

module.exports = JamKnight;