const express = require("express");
const userController = require("./user.controller");
const { protect } = require("../../middleware/authGuard.middleware");

const router = express.Router();

router.get("/:id", protect, userController.getUserById);
router.post("/:id/reviews", protect, userController.addReview); // New route
router.get("/:id/reviews", protect, userController.getUserReviews); // Updated route
module.exports = router;