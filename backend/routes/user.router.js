const express = require("express");
const router = express.Router();
const { authenticate, authorize } = require("../middleware/auth");

const {
  userProfile,
  userRegister,
  userLogin,
  updateProfile,
  getAllMusicians,
   getMusicianById,
   addMusicianToJamNight,
   removeMusicianFromJamNight,
   updateProfileMusician,
} = require("../controller/user.controller");

// ShowRunners

// Get user profile (only authenticated users)
router.get("/profile", authenticate, userProfile);

// Register a new user (public route)
router.post("/register", userRegister);

// Login route (public route)
router.post("/login", userLogin);

// Update user profile (only authenticated users, possibly musicians only)
router.put("/profile/:id", authenticate, authorize(), updateProfile);

// Musicians

// Get all musicians
router.get("/musicians", getAllMusicians);

// Get a specific musician by ID
router.get("/musician/:id", authenticate, getMusicianById);

// Route for updating musician's profile
router.put("/profile/musician/:id", authenticate, authorize(['musician']), updateProfileMusician);

// Add musician to a jam night (musician chooses a role)
router.put("/musician/:musicianId/:jamNightId", authenticate, authorize(["musician"]), addMusicianToJamNight);

// Remove musician from a jam night (musician chooses to leave)
router.put("/jamNight/:jamNightId/remove/:musicianId", authenticate, authorize(["musician", "showRunner"]), removeMusicianFromJamNight);

module.exports = router;