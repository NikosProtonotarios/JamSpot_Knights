const JamNight = require("../models/jamKnight");

const createJamNight = async (req, res) => {
    try {
        const newJamNight = new JamNight(req.body);

        const savedJamNight = await newJamNight.save();

        res.status(201).json(savedJamNight);
    } catch (error) {
        console.error(error);
        res.status(400).json({ message: "Error creating jam night", error: error.message });
    }
};

const getAllJamNights = async (req, res) => {
    try {
        const jamNights = await JamNight.find();

        if (!jamNights || jamNights.length === 0) {
            return res.status(404).json({message: "No jam nights found"});
        }

        return res.status(200).json(jamNights);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error fetching jam nights" });
    }
};

const getJamNightById = async (req, res) => {
    try {

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error fetching jam night" });
    }
};

const updateJamNight = async (req, res) => {
    try {

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error updating jam night" });
    }
};

const deleteJamNight = async (req, res) => {
    try {

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error deleting jam night" });
    }
};

const confirmJamNight = async (req, res) => {
    try {

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error confirming jam night" });
    }
};

const confirmMusicianForJamNight = async (req, res) => {
    try {

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error confirming musician for jam night" });
    }
};

module.exports = {
    createJamNight,
    getAllJamNights,
    getJamNightById,
    updateJamNight,
    deleteJamNight,
    confirmJamNight,
    confirmMusicianForJamNight,
}