require("dotenv").config();
const path = require("path");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const JamKnight = require("../models/jamKnight");
const fs = require("fs");
const { response } = require("express");
const { cloudinary, upload } = require('../config/cloudinary');

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

    // Handle the photo upload (if provided) and upload it to Cloudinary
    let photoUrl = null;
    if (req.file) {
      // Cloudinary stores the URL and other details after uploading
      photoUrl = req.file.path;  // This should be the URL provided by Cloudinary
    }

    // Create a new user with the role 'musician'
    const newMusician = new User({
      username,
      email,
      password: hashedPassword,
      userType, // Automatically set to 'musician'
      bio,
      instruments: instruments.split(",").map((inst) => inst.trim()), // Convert comma-separated instruments to array
      photo: photoUrl, // Save the Cloudinary URL
    });

    // Save the new musician user in the database
    await newMusician.save();

    return res
      .status(201)
      .send({ message: "Musician registered successfully", photo: photoUrl }); // Corrected here
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
    // Handle the photo upload (if provided) and upload it to Cloudinary
    let musician = await User.findById(id)
    if (!musician) {
      return res.status(404).json({ message: "Musician not found" });
    }
    let photoUrl = musician.photo;
    
    if (req.file) {
      // Cloudinary stores the URL and other details after uploading
      if (photoUrl) {
        const publicId = photoUrl.split("/").pop().split('.')[0];
        console.log(photoUrl);
        await cloudinary.uploader.destroy(`musician_profiles/${publicId}`);
      }
      photoUrl = req.file.path;  // This should be the URL provided by Cloudinary
    }
    updatedData.photo = photoUrl;
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
    const { currentSongTitle, instrument } = req.body;
    const jamNight = await JamKnight.findById(jamNightId);
    // console.log(jamNight);

    if (!jamNight) {
     return res.send({message: "JamNight not found"});
    }
      const musician = await User.findById(musicianId);

      if (!musician) {
        return res.status(404).json({ message: "Musician not found" });
      } 

      let songs = jamNight.songs;
      // console.log(songs);

      let currentSong = songs.find(song => song.title.toLowerCase() === currentSongTitle.toLowerCase());
      console.log(currentSong);

      let roles = currentSong.roles;
      
      let currentRole = roles.find(role => role.instrument.toLowerCase() === instrument.toLowerCase());
      
      if (currentRole.instrument === instrument) {
        currentRole.musician = musicianId;
        await jamNight.save();
        return res.send({message: "Musician added to jam night"});
      }

  } catch (error) {
    console.error(error);
  }
};

//     // Find the user by their musicianId and check if the userType is "musician"
//     const user = await User.findById(musicianId);
//     if (!user || user.userType !== "musician") {
//       return res
//         .status(404)
//         .json({ message: "Musician not found or user is not a musician" });
//     }

//     // Find the JamNight by its ID
    // const jamNight = await JamKnight.findById(jamNightId);
//     if (!jamNight) {
//       return res.status(404).json({ message: "JamNight not found" });
//     }
//     console.log(jamNight.songs);
//     // Find the song in the jam night by its title
//     const song = jamNight.songs.find(
//       (song) => song.title.toLowerCase() === title.toLowerCase()
//     );

//     if (!song) {
//       return res.status(404).json({ message: "Song not found" });
//     }

//     // Find the role based on the instrument in the song
//     const role = song.roles.find((role) => role.instrument === instrument);
//     if (!role) {
//       return res.status(404).json({ message: "Instrument role not found" });
//     }

//     // Check if the role is already taken by another musician
//     if (role.musician) {
//       return res.status(400).json({ message: "This role is already taken" });
//     }

//     // Assign the musician (user) to the role
//     role.musician = musicianId; // Set musicianId to the role
//     await jamNight.save();
//     console.log(role.musician);
//     res.status(200).json({
//       message: "Musician assigned to role, awaiting confirmation",
//       musician: role.musician,
//     });
//   } catch (error) {
//     console.error(error);
//     res
//       .status(500)
//       .json({ message: "Error adding musician to jam night", error });
//   }
// };


const removeMusicianFromJamNight = async (req, res) => {
  try {
    const { jamNightId, musicianId } = req.params;
    const jamNight = await JamKnight.findById(jamNightId);

    if (!jamNight) {
      return res.status(404).json({ message: "JamNight not found" });
    }

    const user = await User.findById(musicianId);
    if (!user || user.userType !== "musician") {
      return res.status(404).json({ message: "Musician not found" });
    }

    // Only the owner of the event (ShowRunner) or the musician themselves can remove the musician
    if (
      (req.user.userType === "showRunner" && req.user.userId === jamNight.owner.toString()) ||
      req.user.userId === musicianId
    ) {
      // Loop through the songs and roles to find where the musician is assigned
      let musicianRemoved = false;
      jamNight.songs.forEach((song) => {
        song.roles.forEach((role) => {
          if (role.musician && role.musician.toString() === musicianId) {
            role.musician = null; // Set musician to null (remove the musician from the role)
            musicianRemoved = true;
          }
        });
      });

      if (!musicianRemoved) {
        return res.status(404).json({ message: "Musician is not assigned to any role" });
      }

      await jamNight.save();
      return res.status(200).json({ message: "Musician removed from the role in the jam night" });
    }

    return res.status(403).json({ message: "You are not authorized to remove this musician" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error removing musician from the role" });
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
