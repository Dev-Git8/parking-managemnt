const cloudinary = require('cloudinary').v2;
require('dotenv').config();

// The SDK automatically uses CLOUDINARY_URL if present in process.env
// But we can explicitly verify or configure it if needed
if (!process.env.CLOUDINARY_URL) {
    console.error('CLOUDINARY_URL is missing from environment variables');
}

module.exports = cloudinary;
