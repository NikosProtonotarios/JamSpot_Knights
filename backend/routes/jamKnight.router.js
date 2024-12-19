const express = require("express");
const router = express.Router();

const {
    createJamNight,
    getAllJamNights,
    getJamNightById,
    updateJamNight,
    deleteJamNight,
    confirmJamNight,
    confirmMusicianForJamNight,
} = require("../controller/jamKnight.controller");

// Create a new jam night (owner can create)
router.post("/jamnight", createJamNight);

// Get all jam nights
router.get("/jamnights", getAllJamNights);

// Get a specific jam night by ID
router.get("/jamnight/:id", getJamNightById);

// Update a jam night (owner can edit event)
router.put("/jamnight/:id", updateJamNight);

// Delete a jam night (owner can delete event)
router.delete("/jamnight/:id", deleteJamNight);

// Confirm a jam night (owner confirms the event)
router.put("/jamnight/:id/confirm", confirmJamNight);

// Confirm musicians for a jam night (owner confirms musicians)
router.put("/jamnight/:id/confirmMusician", confirmMusicianForJamNight);

module.exports = router;