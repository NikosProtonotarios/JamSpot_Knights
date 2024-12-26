const express = require("express");
const router = express.Router();
const { authenticate, authorize } = require("../middleware/auth");

const {
   getAllMusicians,
   getMusicianById,
   addMusicianToJamNight,
   removeMusicianFromJamNight,
} = require("../controller/musician.controller");

// Get all musicians
router.get("/musicians", getAllMusicians);

// Get a specific musician by ID
router.get("/musician/:id", getMusicianById);

// Add musician to a jam night (musician chooses a role)
router.put("/musician/:id/jamnight", addMusicianToJamNight);

// Remove musician from a jam night (musician chooses to leave)
router.put("/musician/:id/jamnight/remove", removeMusicianFromJamNight);

module.exports = router;