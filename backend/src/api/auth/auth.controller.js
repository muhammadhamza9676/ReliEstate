// auth.controller.js
const User = require("../../models/user.model");
const authService = require("./auth.service");
const jwt = require("../../config/jwt");
// const { generateTokens } = require("../../config/jwt");
const { generateTokens, verifyRefreshToken } = require("../../config/jwt");

exports.register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email already registered" });
        }

        // Check if OTP process is already in progress
        const existingOTP = await authService.getOTPFromRedis(email);
        if (existingOTP) {
            return res.status(400).json({ message: "OTP already sent. Please verify or wait to resend." });
        }

        // Generate OTP and store in Redis
        await authService.sendOTP(email);

        // Temporarily store user details in Redis
        await authService.storeTempUserInRedis(email, { name, email, password });

        res.status(200).json({ message: "OTP sent for verification. Complete verification to register." });
    } catch (error) {
        console.error("Registration error:", error);
        res.status(500).json({ message: "Error initiating registration", error: error.message });
    }
};

exports.verifyOTP = async (req, res) => {
    try {
        const { email, otp } = req.body;

        // Verify OTP
        const isValid = await authService.verifyOTP(email, otp);
        if (!isValid) {
            return res.status(400).json({ message: "Invalid or expired OTP" });
        }

        // Retrieve user details from Redis
        const tempUser = await authService.getTempUserFromRedis(email);
        if (!tempUser) {
            return res.status(400).json({ message: "User registration session expired. Please sign up again." });
        }

        // Create user in MongoDB
        const newUser = new User({
            name: tempUser.name,
            email: tempUser.email,
            password: tempUser.password, // Will be hashed by pre-save hook
            verified: true
        });
        await newUser.save();

        // Clean up Redis
        await authService.clearTempUserFromRedis(email);

        res.status(201).json({
            message: "Email verified, account created successfully"
        });
    } catch (error) {
        console.error("OTP verification error:", error);
        res.status(500).json({ message: "Error verifying OTP", error: error.message });
    }
};

exports.resendOTP = async (req, res) => {
    try {
        const { email } = req.body;

        // Check if user already exists in MongoDB
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email already registered. Please log in." });
        }

        // Check if temp user exists in Redis
        const tempUser = await authService.getTempUserFromRedis(email);
        if (!tempUser) {
            return res.status(400).json({ message: "No registration in progress. Please sign up first." });
        }

        // Check cooldown period (3 minutes = 180 seconds)
        const lastSent = await authService.getLastOTPSentTime(email);
        const now = Date.now() / 1000; // Current time in seconds
        const cooldownPeriod = 180; // 3 minutes in seconds

        if (lastSent && (now - lastSent < cooldownPeriod)) {
            const timeLeft = Math.ceil(cooldownPeriod - (now - lastSent));
            return res.status(429).json({ 
                message: `Please wait ${timeLeft} seconds before requesting a new OTP.` 
            });
        }

        // Resend OTP (old OTP is deleted in sendOTP) and update last sent time
        await authService.sendOTP(email);
        await authService.setLastOTPSentTime(email);

        res.status(200).json({ message: "OTP resent successfully" });
    } catch (error) {
        console.error("Resend OTP error:", error);
        res.status(500).json({ message: "Error resending OTP", error: error.message });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Basic input validation
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        // Find user and include password
        const user = await User.findOne({ email }).select("+password");
        if (!user) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        // Check password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        // Check email verification
        if (!user.verified) {
            return res.status(403).json({ message: "Please verify your email first" });
        }

        // Generate tokens
        const { accessToken, refreshToken } = generateTokens(user._id);

        // Manage refresh tokens (limit to 5, remove oldest if exceeding)
        if (!user.refreshTokens) user.refreshTokens = [];
        if (user.refreshTokens.length >= 5) {
            user.refreshTokens.shift(); // Remove oldest token
        }
        user.refreshTokens.push(refreshToken);
        await user.save();

        // Send response with tokens and user details
        res.status(200).json({
            message: "Login successful",
            accessToken,
            refreshToken,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        console.error("❌ Login Error:", error);
        res.status(500).json({ message: "Error logging in", error: error.message });
    }
};

exports.refreshToken = async (req, res) => {
    try {
        const { refreshToken } = req.body;
        if (!refreshToken) {
            return res.status(400).json({ message: "Refresh token is required" }); // 400 for bad request
        }

        // Verify refresh token
        let decoded;
        try {
            decoded = verifyRefreshToken(refreshToken); // Use exported function
        } catch (error) {
            return res.status(401).json({ message: "Invalid or expired refresh token" }); // 401 for unauthorized
        }

        // Find user and validate refresh token
        const user = await User.findById(decoded.id);
        if (!user || !user.refreshTokens.includes(refreshToken)) {
            return res.status(401).json({ message: "Invalid refresh token" });
        }

        // Generate new tokens
        const { accessToken, refreshToken: newRefreshToken } = generateTokens(user._id);

        // Update refresh tokens in DB: remove old, add new
        user.refreshTokens = user.refreshTokens.filter(token => token !== refreshToken);
        user.refreshTokens.push(newRefreshToken);
        await user.save();

        // Send new tokens
        res.status(200).json({
            message: "Tokens refreshed successfully",
            accessToken,
            refreshToken: newRefreshToken
        });
    } catch (error) {
        console.error("❌ Refresh Token Error:", error);
        res.status(500).json({ message: "Error refreshing token", error: error.message });
    }
};

exports.logout = async (req, res) => {
    try {
        const { refreshToken } = req.body;
        if (!refreshToken) {
            return res.status(400).json({ message: "Refresh token is required" });
        }

        //Verify the refresh token (optional but adds security)
        let decoded;
        try {
            decoded = verifyRefreshToken(refreshToken);
        } catch (error) {
            return res.status(401).json({ message: "Invalid or expired refresh token" });
        }

        // Find and update user
        const user = await User.findOneAndUpdate(
            { _id: decoded.id, refreshTokens: refreshToken }, // Match by user ID and token
            { $pull: { refreshTokens: refreshToken } },
            { new: true }
        );

        if (!user) {
            return res.status(401).json({ message: "Refresh token not found or already invalidated" });
        }

        console.log(`User ${user.email} logged out successfully`);
        res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
        console.error("❌ Logout Error:", error);
        res.status(500).json({ message: "Error logging out", error: error.message });
    }
};

exports.forgetPassword = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) return res.status(400).json({ message: "Email is required" });

        // Check if user exists (but don’t reveal if not, for security)
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(200).json({ message: "Invalid Email" });
        }

        // Check cooldown (3 minutes = 180 seconds)
        const lastSent = await authService.getResetOTPSentTime(email);
        const now = Date.now() / 1000;
        const cooldownPeriod = 180;
        if (lastSent && (now - lastSent < cooldownPeriod)) {
            const timeLeft = Math.ceil(cooldownPeriod - (now - lastSent));
            return res.status(429).json({ message: `Please wait ${timeLeft} seconds before requesting a new OTP` });
        }

        // Send OTP
        await authService.sendResetOTP(email);
        await authService.setResetOTPSentTime(email);

        res.status(200).json({ message: "If this email is registered, an OTP will be sent" });
    } catch (error) {
        console.error("❌ Forget Password Error:", error);
        res.status(500).json({ message: "Something went wrong, try again later", error: error.message });
    }
};

exports.resetPassword = async (req, res) => {
    try {
        const { email, otp, newPassword } = req.body;
        if (!email || !otp || !newPassword) {
            return res.status(400).json({ message: "Invalid request" });
        }

        // First, check if OTP matches
        const storedOTP = await authService.getResetOTP(email);
        if (!storedOTP) {
            return res.status(400).json({ message: "OTP not found or expired. Please request a new one" });
        }
        if (storedOTP !== otp) {
            return res.status(400).json({ message: "Invalid OTP" });
        }

        // OTP matches, proceed with reset
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid email or OTP" }); // Vague for security
        }

        // Update password
        user.password = newPassword; // Will be hashed by pre-save hook
        await user.save();

        // Clean up Redis
        await authService.clearResetOTP(email);

        res.status(200).json({ message: "Password reset successfully" });
    } catch (error) {
        console.error("❌ Reset Password Error:", error);
        res.status(500).json({ message: "Something went wrong, try again later", error: error.message });
    }
};