// const express = require("express");
// const propertyController = require("./property.controller");
// const { protect } = require("../../middleware/authGuard.middleware"); // Updated path

// const router = express.Router();

// router.post("/add", protect, propertyController.createProperty); // Only authenticated users
// router.get("/", propertyController.getAllProperties); // Public for now, add protect later if needed

// module.exports = router;

const express = require("express");
const propertyController = require("./property.controller");
const { protect } = require("../../middleware/authGuard.middleware");
const { uploadImages } = require("./property.middleware");

const router = express.Router();

router.post("/add", protect, uploadImages, propertyController.createProperty);
router.get("/", propertyController.getAllProperties);

module.exports = router;