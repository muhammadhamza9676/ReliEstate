const express = require("express");
const { rateLimit } = require("../../utils/rateLimiter");
const authController = require("./auth.controller");

const router = express.Router();

// Public Routes
router.post("/register", authController.register);
router.post("/verify-otp", authController.verifyOTP);
router.post("/login", rateLimit, authController.login);
router.post("/refresh-token", authController.refreshToken);
router.post("/logout", authController.logout);
router.post("/forget-password", authController.forgetPassword);
router.post("/reset-password", authController.resetPassword);
router.post("/resend-otp", authController.resendOTP);


module.exports = router;
