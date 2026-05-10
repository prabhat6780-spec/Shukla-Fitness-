const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("cloudinary").v2;

// Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET
});

// Storage config
const storage = new CloudinaryStorage({
  cloudinary,
 params: {
  folder: "fitness-products",
  allowed_formats: ["jpg", "png", "jpeg"]
  }
});

const mediaStorage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    const isVideo = file.mimetype.startsWith("video");

    return {
      folder: "fitness-exercises",
      resource_type: isVideo ? "video" : "image", // ✅ auto detect
      allowed_formats: ["jpg", "png", "jpeg", "webp", "gif", "mp4", "mov"]
    };
  }
});


// ✅ New — exercise thumbnails
const thumbnailStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "fitness-exercise-thumbnails",
    allowed_formats: ["jpg", "png", "jpeg", "webp"]
  }
});

const upload = multer({ storage });
const uploadMedia = multer({ storage: mediaStorage });
const uploadThumbnail = multer({ storage: thumbnailStorage });

module.exports = { upload, uploadMedia, uploadThumbnail, cloudinary };