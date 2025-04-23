const jwt = require("../config/jwt");
const User = require("../models/user.model");

exports.protect = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) return res.status(401).json({ message: "Access Denied" });

        const decoded = jwt.verifyAccessToken(token);
        req.user = await User.findById(decoded.id).select("-password");
        if (!req.user) return res.status(401).json({ message: "User not found" });

        next();
    } catch (error) {
        res.status(401).json({ message: "Invalid or expired token" });
    }
};

exports.restrictTo = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ message: "Permission denied" });
        }
        next();
    };
};