require("dotenv").config();
const path = require("path");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const JamKnight = require("../models/jamKnight");
const fs = require("fs");

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
    // console.log("Request body:", req.body);
    const { username, email, password, userType } = req.body;

    // Check if userType is valid
    const validUserTypes = ["showRunner", "musician"];
    if (!validUserTypes.includes(userType)) {
      return res.status(400).send({
        message: "Invalid userType. Must be 'showRunner' or 'musician'",
      });
    }

    // Check if the email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).send({ message: "Email already in use" });
    }

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

const registerMusician = async (req, res) => {
  try {
    const { username, email, password, bio, instruments } = req.body;

    // Ensure the user type is 'musician'
    const userType = "musician";

    // Check if the email already exists in the database
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).send({ message: "Email already in use" });
    }

    // Hash the password before saving
    const saltRounds = parseInt(process.env.SALT);
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Handle the photo upload (if provided)
    let photoPath = null;
    if (req.file) {
      // Define the uploads directory
      const uploadDir = path.join(__dirname, "../uploads");

      // Ensure the upload directory exists, create if it doesn't
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true }); // Create directories recursively
      }

      // Create a unique filename with a timestamp
      const photoFilename = `${Date.now()}_${req.file.originalname}`;
      photoPath = `/uploads/${photoFilename}`; // This is the path you can send back for frontend access

      // Move the uploaded file to the final upload directory
      fs.renameSync(req.file.path, path.join(uploadDir, photoFilename));
    }

    // Create a new user with the role 'musician'
    const newMusician = new User({
      username,
      email,
      password: hashedPassword,
      userType, // Automatically set to 'musician'
      bio,
      instruments: instruments.split(",").map((inst) => inst.trim()), // Convert comma-separated instruments to array
      photo: photoPath, // Save the file path or null if no photo was uploaded
    });

    // Save the new musician user in the database
    await newMusician.save();

    return res
      .status(201)
      .send({ message: "Musician registered successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ message: "Error registering musician" });
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
    console.log("User ID:", user._id);
    return res.send({
      message: "User logged in successfully",
      token,
      userId: user._id,
    });
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

    const { username, password } = req.body;

    // Prepare the updated data
    const updatedData = {};

    if (username) updatedData.username = username;
    if (password) {
      // Hash the password before updating
      const hashedPassword = await bcrypt.hash(password, 10);
      updatedData.password = hashedPassword;
    }

    const user = await User.findByIdAndUpdate(id, updatedData, {
      new: true,
      runValidators: true,
    });

    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    // If password is updated, generate a new token
    if (password) {
      const token = jwt.sign(
        { userId: user._id, userType: user.userType },
        process.env.SECRET_KEY
      );
      return res
        .status(200)
        .json({ message: "Profile updated successfully", token });
    }

    return res
      .status(200)
      .json({ message: "Profile updated successfully", user });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ message: "Error updating user profile" });
  }
};

const updateProfileMusician = async (req, res) => {
  try {
    const { id } = req.params;

    // Ensure the user is updating their own profile
    if (req.user.userId !== id) {
      return res
        .status(403)
        .json({ message: "You can only update your own profile" });
    }

    // Log the request body to see what data is being sent
    console.log("Request Body:", req.body);

    const { username, bio, instruments } = req.body;
    // const { username, bio, photo, instruments, roles, password } = req.body;

    const updatedData = {};

    // Check if fields are present and assign them to the updatedData object
    if (username) updatedData.username = username;
    if (bio) updatedData.bio = bio;
    // if (photo) updatedData.photo = photo;

    // Validate instruments and roles arrays
    if (instruments && instruments.length > 0)
      updatedData.instruments = instruments;
    // if (roles && roles.length > 0) updatedData.roles = roles;

    // If password is updated, hash it before saving
    // if (password) {
    //   const salt = await bcrypt.genSalt(10);
    //   const hashedPassword = await bcrypt.hash(password, salt);
    //   updatedData.password = hashedPassword;  // Update password with hashed value
    // }

    // Check if there is any field to update
    if (Object.keys(updatedData).length === 0) {
      return res.status(400).json({ message: "No valid fields to update" });
    }

    // Log the updatedData object before updating the user
    console.log("Updated Data:", updatedData);

    // Update the musician's profile
    const user = await User.findByIdAndUpdate(id, updatedData, {
      new: true,
      runValidators: true,
    });
    console.log(user);

    // Check if the user was found and updated
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    // If password is updated, generate a new JWT token
    // if (password) {
    //   const token = jwt.sign(
    //     { userId: user._id, userType: user.userType },
    //     process.env.SECRET_KEY,
    //     { expiresIn: "1h" }  // Token expiration (adjust as needed)
    //   );
    //   return res.status(200).json({
    //     message: "Profile updated successfully",
    //     user,
    //     token,  // Send the new token to the user
    //   });
    // }

    // Return the updated user data without generating a new token
    return res
      .status(200)
      .json({ message: "Profile updated successfully", user });
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
    const { jamNightId, musicianId } = req.params;
    console.log(jamNightId);
    const { title, instrument } = req.body;
    console.log("title", title);
    // Find the user by their musicianId and check if the userType is "musician"
    const user = await User.findById(musicianId);
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
    console.log(jamNight.songs);
    // Find the song in the jam night by its title
    const song = jamNight.songs.find(
      (song) => song.title.toLowerCase() === title.toLowerCase()
    );

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

    // Assign the musician (user) to the role
    role.musician = musicianId; // Set musicianId to the role
    await jamNight.save();
    console.log(role.musician);
    res.status(200).json({
      message: "Musician assigned to role, awaiting confirmation",
      musician: role.musician,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error adding musician to jam night", error });
  }
};

const removeMusicianFromJamNight = async (req, res) => {
  try {
    const { jamNightId, musicianId } = req.params;
    const jamNight = await JamKnight.findById(jamNightId);
    const user = await User.findById(musicianId);

    if (!jamNight) {
      return res.status(404).json({ message: "JamNight not found" });
    }

    if (!user || user.userType !== "musician") {
      return res.status(404).json({ message: "Musician not found" });
    }

    // ShowRunner can remove any musician, but a musician can only remove themselves
    if (
      req.user.userId !== jamNight.owner.toString() &&
      req.user.userId !== musicianId
    ) {
      return res
        .status(403)
        .json({ message: "You are not authorized to remove this musician" });
    }

    // Remove the musician from the confirmedMusicians array
    jamNight.confirmedMusicians.pull(musicianId);
    await jamNight.save();

    res.status(200).json({ message: "Musician removed from the jam night" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error removing musician from jam night" });
  }
};

const deleteMusicianProfile = async (req, res) => {
  try {
    const musicianId = req.params.id;

    if (req.user.userId !== musicianId) {
      return res
        .status(403)
        .json({ message: "You can only delete your own profile!" });
    }

    await User.findByIdAndDelete(musicianId);

    return res.json({ message: "Profile deleted successfully." });
  } catch (error) {
    return res.status(500).json({ message: "Error deleting profile.", error });
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
  updateProfileMusician,
  registerMusician,
  deleteMusicianProfile,
};
