require("dotenv").config();
const User = require("../models/user");
const JamKnight = require("../models/jamKnight");
const Musician = require("../models/musician");
const { authenticate, authorize } = require("../middleware/auth");

const getAllMusicians = async (req, res) => {
    try {
        const musicians = await User.find({userType: "musician"});
        
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

        const musician = await User.findById(id);

        if (!musician) {
            return res.status(404).json({ message: "Musician not found" });
        }

        if (musician.userType !== 'musician') {
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
        const { jamNightId, musicianId } = req.params;
        const { title, instrument } = req.body;

        const jamNight = await JamKnight.findById(jamNightId);
        const musician = await Musician.findById(musicianId);

        if (!jamNight) {
            return res.status(404).json({ message: "JamNight not found" });
        }

        if (!musician) {
            return res.status(404).json({ message: "Musician not found" });
        }

        // Find the song and role
        const song = jamNight.songs.find(song => song.title === title);
        if (!song) {
            return res.status(404).json({ message: "Song not found" });
        }

        const role = song.roles.find(role => role.instrument === instrument);
        if (!role) {
            return res.status(404).json({ message: "Instrument role not found" });
        }

        // Check if the role is already taken
        if (role.musician) {
            return res.status(400).json({ message: "This role is already taken" });
        }

        // Assign the musician to the role (not confirmed yet)
        role.musician = musicianId;
        await jamNight.save();

        res.status(200).json({ message: "Musician assigned to role, awaiting confirmation" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error adding musician to jam night" });
    }
};

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