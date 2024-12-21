const express = require("express");
const router = express.Router();
const { authenticate, authorize } = require("../middleware/auth");

const {
  userProfile,
  userRegister,
  userLogin,
  updateProfile,
} = require("../controller/user.controller");

// Get user profile (only authenticated users)
router.get("/profile", authenticate, userProfile);

// Register a new user (public route)
router.post("/register", userRegister);

// Login route (public route)
router.post("/login", userLogin);

// Update user profile (only authenticated users, possibly musicians only)
router.put("/profile/:id", authenticate, authorize(), updateProfile);

module.exports = router;