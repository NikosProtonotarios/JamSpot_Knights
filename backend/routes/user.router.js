const express = require("express");
const router = express.Router();

// CRUD operation / different routes

// Register a new user
router.post("/register", userRegister);

// Login route
router.post("/login", userLogin);

// Get user profile
router.get("/profile", userProfile);

// Update user profile (for musicians)
router.put("/profile", updateProfile);

module.exports = router;