
const express = require("express");
const propertyController = require("./property.controller");
const { protect } = require("../../middleware/authGuard.middleware");
const { uploadImages } = require("./property.middleware");

const router = express.Router();

router.post("/add", protect, uploadImages, propertyController.createProperty);
router.get("/", propertyController.getAllProperties);
router.get("/user", protect, propertyController.getUserProperties);
router.get("/:slug", propertyController.getPropertyBySlug);
router.put("/update/:id", protect, uploadImages, propertyController.updateProperty); // Updated
router.delete("/delete/:id", protect, propertyController.deleteProperty);

module.exports = router;