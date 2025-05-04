// auth.service.js
const emailService = require('../../utils/email');
const { getRedisClient } = require('../../config/redis');

exports.sendOTP = async (email) => {
    try {
        const redisClient = await getRedisClient();
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        
        // Delete any existing OTP before setting a new one
        await redisClient.del(`otp:${email}`);
        await redisClient.set(`otp:${email}`, otp, { EX: 600 }); // OTP expires in 10 minutes
        
        await emailService.sendEmail({
            to: email,
            subject: "Your ReliEstate OTP",
            text: `Your OTP for verification is ${otp}. It expires in 10 minutes.`,
        });
    } catch (error) {
        throw new Error(`Failed to send OTP: ${error.message}`);
    }
};

exports.verifyOTP = async (email, otp) => {
    try {
        const redisClient = await getRedisClient();
        const storedOTP = await redisClient.get(`otp:${email}`);
        if (!storedOTP || storedOTP !== otp) return false;
        
        await redisClient.del(`otp:${email}`);
        return true;
    } catch (error) {
        throw new Error(`OTP verification failed: ${error.message}`);
    }
};

exports.getOTPFromRedis = async (email) => {
    try {
        const redisClient = await getRedisClient();
        return await redisClient.get(`otp:${email}`);
    } catch (error) {
        throw new Error(`Failed to get OTP from Redis: ${error.message}`);
    }
};

exports.storeTempUserInRedis = async (email, userData) => {
    try {
        const redisClient = await getRedisClient();
        await redisClient.set(`tempUser:${email}`, JSON.stringify(userData), { EX: 600 });
    } catch (error) {
        throw new Error(`Failed to store temp user: ${error.message}`);
    }
};

exports.getTempUserFromRedis = async (email) => {
    try {
        const redisClient = await getRedisClient();
        const userData = await redisClient.get(`tempUser:${email}`);
        return userData ? JSON.parse(userData) : null;
    } catch (error) {
        throw new Error(`Failed to get temp user: ${error.message}`);
    }
};

exports.clearTempUserFromRedis = async (email) => {
    try {
        const redisClient = await getRedisClient();
        await redisClient.del(`tempUser:${email}`);
    } catch (error) {
        throw new Error(`Failed to clear temp user: ${error.message}`);
    }
};

exports.setLastOTPSentTime = async (email) => {
    try {
        const redisClient = await getRedisClient();
        await redisClient.set(`otpLastSent:${email}`, Math.floor(Date.now() / 1000), { EX: 600 });
    } catch (error) {
        throw new Error(`Failed to set OTP sent time: ${error.message}`);
    }
};

exports.getLastOTPSentTime = async (email) => {
    try {
        const redisClient = await getRedisClient();
        const lastSent = await redisClient.get(`otpLastSent:${email}`);
        return lastSent ? parseInt(lastSent, 10) : null;
    } catch (error) {
        throw new Error(`Failed to get OTP sent time: ${error.message}`);
    }
};

// Reset Password Helpers
exports.sendResetOTP = async (email) => {
    try {
        const redisClient = await getRedisClient();
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        
        // Delete any existing reset OTP before setting a new one
        await redisClient.del(`resetOtp:${email}`);
        await redisClient.set(`resetOtp:${email}`, otp, { EX: 600 }); // 10-minute expiry
        
        await emailService.sendEmail({
            to: email,
            subject: "ReliEstate Password Reset OTP",
            text: `Your OTP to reset your password is ${otp}. It expires in 10 minutes.`,
        });
    } catch (error) {
        throw new Error(`Failed to send reset OTP: ${error.message}`);
    }
};

exports.getResetOTP = async (email) => {
    try {
        const redisClient = await getRedisClient();
        return await redisClient.get(`resetOtp:${email}`);
    } catch (error) {
        throw new Error(`Failed to get reset OTP from Redis: ${error.message}`);
    }
};

exports.getResetOTPSentTime = async (email) => {
    try {
        const redisClient = await getRedisClient();
        const lastSent = await redisClient.get(`resetOtpLastSent:${email}`);
        return lastSent ? parseInt(lastSent, 10) : null;
    } catch (error) {
        throw new Error(`Failed to get reset OTP sent time: ${error.message}`);
    }
};

exports.setResetOTPSentTime = async (email) => {
    try {
        const redisClient = await getRedisClient();
        await redisClient.set(`resetOtpLastSent:${email}`, Math.floor(Date.now() / 1000), { EX: 600 });
    } catch (error) {
        throw new Error(`Failed to set reset OTP sent time: ${error.message}`);
    }
};

exports.clearResetOTP = async (email) => {
    try {
        const redisClient = await getRedisClient();
        await redisClient.del(`resetOtp:${email}`);
    } catch (error) {
        throw new Error(`Failed to clear reset OTP: ${error.message}`);
    }
};
