require("dotenv").config();
const JamKnight = require("../models/jamKnight");
const Musician = require("../models/musician");
const { authenticate, authorize } = require("../middleware/auth");

const createJamNight = async (req, res) => {
  try {
    const { title, date, songs, location } = req.body;

    // Ensure that the owner is set to the authenticated user
    const owner = req.user.userId; // Assuming you're using JWT for authentication

    // Create the JamNight with roles where 'musician' is initially null
    const jamNight = new JamKnight({
      title,
      location, // Add the location here
      date,
      songs: songs.map((song) => ({
        title: song.title,
        roles: song.roles.map((role) => ({
          instrument: role.instrument,
          musician: null, // Initially no musician assigned
        })),
      })),
      owner, // Set the owner as the authenticated user
    });

    await jamNight.save();
    res.status(201).json({ message: "JamNight created successfully", jamNight });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creating jam night", error });
  }
};

const getAllJamNights = async (req, res) => {
  try {
    const jamNights = await JamKnight.find();

    if (!jamNights || jamNights.length === 0) {
      return res.status(404).json({ message: "No jam nights found" });
    }

    return res.status(200).json(jamNights);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching jam nights" });
  }
};

const getJamNightById = async (req, res) => {
  try {
    const { id } = req.params;
    const jamNight = await JamKnight.findById(id);

    if (!jamNight) {
      return res.status(404).json({ message: "Jam night not found" });
    }

    return res.status(200).json(jamNight);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching jam night" });
  }
};

const updateJamNight = async (req, res) => {
  try {
    const { id } = req.params;
    const jamNight = await JamKnight.findById(id);

    if (!jamNight) {
      return res.status(404).json({ message: "Jam night not found" });
    }

    // Check if the logged-in user is the creator
    if (jamNight.owner.toString() !== req.user.userId) {
      return res
        .status(403)
        .json({ message: "You do not have permission to update this event" });
    }

    // Proceed with the update
    const updatedJamNight = await JamKnight.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    return res.status(200).json(updatedJamNight);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating jam night" });
  }
};

const deleteJamNight = async (req, res) => {
  try {
    const { id } = req.params;
    const jamNight = await JamKnight.findById(id);

    if (!jamNight) {
      return res.status(404).json({ message: "Jam night not found" });
    }

    // Check if the logged-in user is the creator
    if (jamNight.owner.toString() !== req.user.userId) {
      return res
        .status(403)
        .json({ message: "You do not have permission to delete this event" });
    }

    await JamKnight.findByIdAndDelete(id);
    return res.status(200).json({ message: "Jam night deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error deleting jam night" });
  }
};

const confirmJamNight = async (req, res) => {
  try {
    const { id } = req.params;

    const updatedJamNight = await JamKnight.findByIdAndUpdate(
      id,
      { isConfirmed: true }, // explicitly setting isConfirmed to true
      { new: true }
    );

    if (!updatedJamNight) {
      return res.status(404).json({ message: "Jam night not found" });
    }

    return res.status(200).json(updatedJamNight);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error confirming jam night" });
  }
};

const confirmMusicianForJamNight = async (req, res) => {
  try {
    const { id } = req.params; // Jam night ID
    const { musicianId } = req.body; // Musician ID to confirm

    // Check if the musician exists
    const musician = await Musician.findById(musicianId);
    if (!musician) {
      return res.status(404).json({ message: "Musician not found" });
    }

    // Find the jam night by ID
    const jamNight = await JamKnight.findById(id);

    if (!jamNight) {
      return res.status(404).json({ message: "Jam night not found" });
    }

    // Check if the musician is already confirmed
    if (jamNight.confirmedMusicians.includes(musicianId)) {
      return res.status(400).json({ message: "Musician is already confirmed" });
    }

    // Add the musician to the confirmedMusicians array
    jamNight.confirmedMusicians.push(musicianId);

    // Update the jam night
    const updatedJamNight = await jamNight.save();

    return res.status(200).json(updatedJamNight);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error confirming musician for jam night" });
  }
};

module.exports = {
  createJamNight,
  getAllJamNights,
  getJamNightById,
  updateJamNight,
  deleteJamNight,
  confirmJamNight,
  confirmMusicianForJamNight,
};
