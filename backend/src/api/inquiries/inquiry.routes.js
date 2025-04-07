// api/inquiries/inquiry.routes.js
const express = require("express");
const inquiryController = require("./inquiry.controller");
const { protect } = require("../../middleware/authGuard.middleware");

const router = express.Router();

router.post("/", protect, inquiryController.createInquiry);
router.get("/me", protect, inquiryController.getMyInquiries);

module.exports = router;