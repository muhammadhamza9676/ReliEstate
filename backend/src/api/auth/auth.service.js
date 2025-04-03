// // const crypto = require("crypto");
// // const User = require("../../models/user.model");
// // const jwt = require("../../config/jwt");
// // const emailService = require("../../utils/email");
// // const redisClient = require("../../config/redis");

// const crypto = require("crypto");
// const User = require("../../models/user.model");
// const jwt = require("../../config/jwt");
// const emailService = require("../../utils/email");
// // const redisClient = require("../../config/redis");
// const { getRedisClient } = require('../../config/redis');

// exports.sendOTP = async (email) => {
//     try {
//         const redisClient = await getRedisClient();
//         const otp = Math.floor(100000 + Math.random() * 900000).toString();
//         await redisClient.set(`otp:${email}`, otp, { EX: 600 });
        
//         await emailService.sendEmail({
//             to: email,
//             subject: "Your ReliEstate OTP",
//             text: `Your OTP for verification is ${otp}. It expires in 10 minutes.`,
//         });
//     } catch (error) {
//         throw new Error(`Failed to send OTP: ${error.message}`);
//     }
// };

// exports.verifyOTP = async (email, otp) => {
//     try {
//         const storedOTP = await redisClient.get(`otp:${email}`);
//         if (!storedOTP || storedOTP !== otp) return false;
        
//         await redisClient.del(`otp:${email}`);
//         return true;
//     } catch (error) {
//         throw new Error(`OTP verification failed: ${error.message}`);
//     }
// };

// exports.getOTPFromRedis = async (email) => {
//     return await redisClient.get(`otp:${email}`);
// };

// // exports.sendOTP = async (user) => {
// //     // Generate 6-digit OTP
// //     const otp = Math.floor(100000 + Math.random() * 900000).toString();
// //     user.otp = otp;
// //     user.otpExpiry = Date.now() + 10 * 60 * 1000; // 10 minutes expiry
// //     await user.save();

// //     // Send OTP via email
// //     await emailService.sendEmail({
// //         to: user.email,
// //         subject: "Your ReliEstate OTP",
// //         text: `Your OTP for verification is ${otp}. It expires in 10 minutes.`,
// //     });
// // };
// // exports.sendOTP = async (email) => {
// //     // Generate 6-digit OTP
// //     const otp = Math.floor(100000 + Math.random() * 900000).toString();

// //     // Store OTP in Redis with a 10-minute expiry
// //     await redisClient.set(`otp:${email}`, otp, { EX: 600 });

// //     // Send OTP via email
// //     await emailService.sendEmail({
// //         to: email,
// //         subject: "Your ReliEstate OTP",
// //         text: `Your OTP for verification is ${otp}. It expires in 10 minutes.`,
// //     });
// // };

// // exports.verifyOTP = async (user, otp) => {
// //     console.log(user,otp);
// //     if (!user.otp || user.otpExpiry < Date.now()) return false;
// //     return user.otp === otp;
// // };
// // exports.verifyOTP = async (email, otp) => {
// //     const storedOTP = await redisClient.get(`otp:${email}`);

// //     if (!storedOTP || storedOTP !== otp) return false;

// //     // OTP verified, remove from Redis
// //     await redisClient.del(`otp:${email}`);
// //     return true;
// // };


// exports.sendResetPasswordEmail = async (email, token) => {
//     const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;

//     await emailService.sendEmail({
//         to: email,
//         subject: "Reset Your Password",
//         text: `Click this link to reset your password: ${resetLink}. This link expires in 15 minutes.`,
//     });
// };

// exports.storeTempUserInRedis = async (email, userData) => {
//     await redisClient.set(`tempUser:${email}`, JSON.stringify(userData), { EX: 600 });
// };

// exports.getTempUserFromRedis = async (email) => {
//     const userData = await redisClient.get(`tempUser:${email}`);
//     return userData ? JSON.parse(userData) : null;
// };

// exports.clearTempUserFromRedis = async (email) => {
//     await redisClient.del(`tempUser:${email}`);
// };

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