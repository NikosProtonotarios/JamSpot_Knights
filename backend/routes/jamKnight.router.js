const express = require("express");
const router = express.Router();
const { authenticate, authorize } = require("../middleware/auth");

const {
    createJamNight,
    getAllJamNights,
    getJamNightById,
    updateJamNight,
    deleteJamNight,
    confirmJamNight,
    confirmMusicianForJamNight,
} = require("../controller/jamKnight.controller");

// Create a new jam night (only authenticated users, ShowRunner role)
router.post("/jamnight", authenticate, authorize(['ShowRunner']), createJamNight);

// Get all jam nights (public, no auth needed)
router.get("/jamnights", getAllJamNights);

// Get a specific jam night by ID (public, no auth needed)
router.get("/jamnight/:id", getJamNightById);

// Update a jam night (only authenticated users, ShowRunner role)
router.put("/jamnight/:id", authenticate, authorize(['ShowRunner']), updateJamNight);

// Delete a jam night (only authenticated users, ShowRunner role)
router.delete("/jamnight/:id", authenticate, authorize(['ShowRunner']), deleteJamNight);

// Confirm a jam night (only authenticated users, ShowRunner role)
router.put("/jamnight/:id/confirm", authenticate, authorize(['ShowRunner']), confirmJamNight);

// Confirm musicians for a jam night (only authenticated users, ShowRunner role)
router.put("/jamnight/:id/confirmMusician", authenticate, authorize(['ShowRunner']), confirmMusicianForJamNight);

module.exports = router;
