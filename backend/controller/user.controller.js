require("dotenv").config();
const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Get user profile
const userProfile = async (req, res) => {
  try {
    // Exclude the password field when fetching the user profile
    let user = await User.findById(req.user.userId).select("-password");
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }
    return res.status(200).send(user);
  } catch (error) {
    console.error(error);
    return res.status(500).send({ message: "Error fetching user profile" });
  }
};

// Register a new user
const userRegister = async (req, res) => {
  try {
    const { username, email, password, userType } = req.body;

    // Hash the password before saving
    const saltRounds = parseInt(process.env.SALT);
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const user = new User({
      username,
      email,
      password: hashedPassword,
      userType,
    });
    await user.save();
    return res.status(201).send({ message: "User created successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ message: "Error registering user" });
  }
};

// User login
const userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).send({ message: "Invalid email or password" });
    }

    // Compare provided password with hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).send({ message: "Invalid email or password" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, userType: user.userType },
      process.env.SECRET_KEY
    );

    return res.send({ message: "User logged in successfully", token });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ message: "Error logging in user" });
  }
};

// Update user profile
const updateProfile = async (req, res) => {
  try {
    const { id } = req.params;
    // Check if the user is updating their own profile
    if (req.user.userId !== id) {
      return res
        .status(403)
        .json({ message: "You can only update your own profile" });
    }

    const { username, email, password } = req.body;
    const updatedData = { username, email, password };

    const user = await User.findByIdAndUpdate(id, updatedData, {
      new: true,
      runValidators: true,
    });

    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    return res.status(200).send(user);
  } catch (error) {
    console.error(error);
    return res.status(500).send({ message: "Error updating user profile" });
  }
};

// Musician controllers

const getAllMusicians = async (req, res) => {
  try {
    const musicians = await User.find({ userType: "musician" });

    if (!musicians || musicians.length === 0) {
      return res.status(404).json({ message: "No musicians found" });
    }

    return res.status(200).json(musicians);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching musicians" });
  }
};

const getMusicianById = async (req, res) => {
  try {
    const { id } = req.params;

    const musician = await User.findById(id);

    if (!musician) {
      return res.status(404).json({ message: "Musician not found" });
    }

    if (musician.userType !== "musician") {
      return res.status(403).json({ message: "This user is not a musician" });
    }

    return res.status(200).json(musician);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching musician" });
  }
};

const addMusicianToJamNight = async (req, res) => {
  try {
    const { jamNightId, userId } = req.params; // Now using userId instead of musicianId
    const { title, instrument } = req.body;

    // Find the user by their userId and check if the userType is "musician"
    const user = await User.findById(userId);

    if (!user || user.userType !== "musician") {
      return res
        .status(404)
        .json({ message: "Musician not found or user is not a musician" });
    }

    // Find the JamNight by its ID
    const jamNight = await JamKnight.findById(jamNightId);
    if (!jamNight) {
      return res.status(404).json({ message: "JamNight not found" });
    }

    // Find the song in the jam night by its title
    const song = jamNight.songs.find((song) => song.title === title);
    if (!song) {
      return res.status(404).json({ message: "Song not found" });
    }

    // Find the role based on the instrument in the song
    const role = song.roles.find((role) => role.instrument === instrument);
    if (!role) {
      return res.status(404).json({ message: "Instrument role not found" });
    }

    // Check if the role is already taken by another musician
    if (role.musician) {
      return res.status(400).json({ message: "This role is already taken" });
    }

    // Assign the user (musician) to the role (not confirmed yet)
    role.musician = userId; // Now using userId here
    await jamNight.save();

    res
      .status(200)
      .json({ message: "Musician assigned to role, awaiting confirmation" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error adding musician to jam night" });
  }
};

const removeMusicianFromJamNight = async (req, res) => {
  try {
    const { jamNightId, userId } = req.params; // Change musicianId to userId
    const jamNight = await JamKnight.findById(jamNightId);
    const user = await User.findById(userId);

    if (!jamNight) {
      return res.status(404).json({ message: "JamNight not found" });
    }

    if (!user || user.userType !== "musician") {
      return res.status(404).json({ message: "Musician not found" });
    }

    // If you have an array of confirmed musicians in the JamNight model, remove the user from it
    jamNight.confirmedMusicians.pull(userId);
    await jamNight.save();

    res.status(200).json({ message: "Musician removed from the jam night" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error removing musician from jam night" });
  }
};

module.exports = {
  userProfile,
  userRegister,
  userLogin,
  updateProfile,
  getAllMusicians,
  getMusicianById,
  addMusicianToJamNight,
  removeMusicianFromJamNight,
};
