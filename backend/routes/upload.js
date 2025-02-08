const express = require("express");
const multer = require("multer");
const cloudinary = require("../config/cloudinary"); // Make sure the path is correct
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const User = require("../models/user"); // Import your User model

const router = express.Router();

// Configure CloudinaryStorage for Multer
// const storage = new CloudinaryStorage({
//   cloudinary: cloudinary,
//   params: {
//     folder: "JamSpotImages", // Cloudinary folder name
//     allowedFormats: ["jpg", "png", "jpeg"],
//   },
// });

const storage = new multer.memoryStorage();
const upload = multer({
  storage,
});

async function handleUpload(file) {
  const res = await cloudinary.uploader.upload(file, {
    resource_type: "auto",
  });
  return res;
}

// const upload = multer({ storage: storage });

// Upload route
router.post("/upload", upload.single("image"), async (req, res) => {
  // try {
  //   // Get the Cloudinary URL from the uploaded file
  //   const imageUrl = req.file.path; // This gives you the local path, change it to get Cloudinary URL
    
  //   // Save the image URL to the user's profile in the database
  //   const userId = req.user.id; // Replace with however you get the user's ID in your app (e.g., JWT)
    
  //   // Update user's profile with the image URL
  //   const updatedUser = await User.findByIdAndUpdate(userId, { profileImage: imageUrl }, { new: true });
    
  //   // Return the updated user with the new profile image
  //   res.json({
  //     message: "Image uploaded successfully!",
  //     imageUrl,
  //     user: updatedUser
  //   });
  // } catch (error) {
  //   console.error(error);
  //   res.status(500).json({ error: "Failed to upload image" });
  // }

  try {
    const b64 = Buffer.from(req.file.buffer).toString("base64");
    let dataURI = "data:" + req.file.mimetype + ";base64," + b64;
    const cldRes = await handleUpload(dataURI);
    res.json(cldRes);
    console.log(res.json(cldRes));
  } catch (error) {
    console.log(error);
    res.send({
      message: error.message,
    });
  }
});

module.exports = router;
