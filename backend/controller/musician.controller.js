require("dotenv").config();
const User = require("../models/user");
const JamNight = require("../models/jamKnight");
const Musician = require("../models/musician");

const getAllMusicians = async (req, res) => {
    try {
        const musicians = await Musician.find().populate("user");
        
        if (!musicians || musicians.length === 0) {
            return res.status(404).json({ message: "No musicians found" });
        }

        return res.status(200).json(musicians);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error fetching musicians" });
    }
};

const getMusicianById = async (req, res) => {
    try {
        const {id} = req.params;
        const musician = await Musician.findById(id).populate("user");

        if (!musician) {
            return res.status(404).json({ message: "Musician not found" });
        }

        if (musician.musicianInfo.userType !== 'musician') {
            return res.status(403).json({ message: "This user is not a musician" });
        }

        return res.status(200).json(musician);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error fetching musician" });
    }
};

const addMusicianToJamNight = async (req, res) => {
    try {
        const {jamNightId, musicianId} = req.params;
        const jamNight = await JamNight.findById(jamNightId);
        const musician = await Musician.findById(musicianId);

        if (!jamNight) {
            return res.status(404).json({message: "JamNight not found"});
        }

        if (!musician) {
            return res.status(404).json({message: "Musician not found"});
        }

        jamNight.confirmedMusicians.push(musicianId);
        await jamNight.save();

        res.status(200).json({message: "musician confirmed"});
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error adding musician to jam night" });
    }
} ;

const removeMusicianFromJamNight = async (req, res) => {
    try {
        const {jamNightId, musicianId} = req.params;
        const jamNight = await JamNight.findById(jamNightId);
        const musician = await Musician.findById(musicianId);

        if (!jamNight) {
            return res.status(404).json({message: "JamNight not found"});
        }

        if (!musician) {
            return res.status(404).json({message: "Musician not found"});
        }
        jamNight.confirmedMusicians.pull(musicianId);
        await jamNight.save();
        res.status(200).json({message: "musician removed"});

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error removing musician from jam night" });
    }
};

module.exports = {
    getAllMusicians,
    getMusicianById,
    addMusicianToJamNight,
    removeMusicianFromJamNight,
};