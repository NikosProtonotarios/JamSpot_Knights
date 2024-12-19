const express = require("express");
const router = express.Router();

const {
  userProfile,
  userRegister,
  userLogin,
  updateProfile,
} = require("../controller/user.controller");

// CRUD operation / different routes

// Get user profile
router.get("/profile", userProfile);

// Register a new user
router.post("/register", userRegister);

// Login route
router.post("/login", userLogin);

// Update user profile (for musicians)
router.put("/profile/:id", updateProfile);

module.exports = router;
