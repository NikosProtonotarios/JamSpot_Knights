const express = require("express");
const router = express.Router();

// Get all musicians
router.get("/musicians", getAllMusicians);

// Get a specific musician by ID
router.get("/musician/:id", getMusicianById);

// Add musician to a jam night (musician chooses a role)
router.put("/musician/:id/jamnight", addMusicianToJamNight);

// Remove musician from a jam night (musician chooses to leave)
router.put("/musician/:id/jamnight/remove", removeMusicianFromJamNight);