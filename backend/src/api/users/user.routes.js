const express = require("express");
const userController = require("./user.controller");
const { protect } = require("../../middleware/authGuard.middleware");

const router = express.Router();

router.get("/:id", protect, userController.getUserById);

module.exports = router;