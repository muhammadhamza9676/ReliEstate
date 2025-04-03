const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true, select: false },
        phone: { type: String },
        role: { type: String, enum: ["user", "broker", "admin"], default: "user" },
        profileCompleted: { type: Boolean, default: false },

        brokerInfo: {
            experience: { type: Number },
            agencyName: { type: String },
            licenseNumber: { type: String },
            verified: { type: Boolean, default: false },
        },

        verified: { type: Boolean, default: false }, // Email verified or not
        // otp: { type: String, select: false },
        // otpExpiry: { type: Date, select: false },
        
        refreshTokens: { type: [String], default: []},

        resetPasswordToken: { type: String, select: false },
        resetPasswordExpires: { type: Date, select: false },
    },
    { timestamps: true }
);

// 🔹 Hash password before saving
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

// 🔹 Compare password method
// userSchema.methods.comparePassword = async function (password) {
//     return bcrypt.compare(password, this.password);
// };
userSchema.methods.comparePassword = async function (enteredPassword) {
    // console.log("Entered Password:", enteredPassword);
    // console.log("Stored Hashed Password:", this.password);
    
    const isMatch = await bcrypt.compare(enteredPassword, this.password);
    console.log("Password Match:", isMatch);
    return isMatch;
};

const User = mongoose.model("User", userSchema);
module.exports = User;
