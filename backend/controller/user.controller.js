require('dotenv').config();
const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Get user profile
const userProfile = async (req, res) => {
  try {
    // Exclude the password field when fetching the user profile
    let user = await User.findById(req.user.userId).select('-password');
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

    const user = new User({ username, email, password: hashedPassword, userType });
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
      return res.status(403).json({ message: "You can only update your own profile" });
    }

    const { username, email, password } = req.body;
    const updatedData = { username, email, password };

    const user = await User.findByIdAndUpdate(id, updatedData, { new: true, runValidators: true });

    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    return res.status(200).send(user);
  } catch (error) {
    console.error(error);
    return res.status(500).send({ message: "Error updating user profile" });
  }
};

module.exports = {
  userProfile,
  userRegister,
  userLogin,
  updateProfile,
};