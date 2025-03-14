const express = require("express");
const router = express.Router();
const { authenticate, authorize } = require("../middleware/auth");
const multer = require('multer');
const { upload } = require('../config/cloudinary'); // Import Multer setup

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
   registerMusician,
   deleteMusicianProfile,
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

router.post("/register/musician", upload.single('photo'), registerMusician);

// Get a specific musician by ID
router.get("/musician/:id", authenticate, getMusicianById);

router.delete("/musician/:id", authenticate, authorize(["musician"]), deleteMusicianProfile);

// Route for updating musician's profile
router.put("/profile/musician/:id", authenticate, authorize(['musician']), upload.single('photo'), updateProfileMusician);

// Add musician to a jam night (musician chooses a role)
router.put("/musician/:musicianId/:jamNightId", authenticate, authorize(["musician"]), addMusicianToJamNight);

// Remove musician from a jam night (musician chooses to leave)
router.put("/jamNight/:jamNightId/remove/:musicianId", authenticate, authorize(["musician", "showRunner"]), removeMusicianFromJamNight);

module.exports = router;