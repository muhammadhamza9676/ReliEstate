// api/properties/property.middleware.js
const multer = require("multer");

const uploadImages = multer({
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit per file
  fileFilter: (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only JPEG, PNG, and GIF images are allowed"));
    }
  },
}).array("images", 10); // Max 10 images under "images" field

module.exports = { uploadImages };