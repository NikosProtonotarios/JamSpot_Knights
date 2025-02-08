const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Configure Multer Storage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'musician_profiles', // Folder in Cloudinary
    allowed_formats: ['jpeg', 'png', 'jpg'], // Allowed file types
    transformation: [{ width: 500, height: 500, crop: 'limit' }] // Resize to max 500x500
  }
});

const upload = multer({ storage });

module.exports = { cloudinary, upload };