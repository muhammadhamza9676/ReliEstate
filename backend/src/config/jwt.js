const jwt = require("jsonwebtoken");

exports.generateTokens = (userId) => {
    const accessToken = jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: "45m" });
    const refreshToken = jwt.sign({ id: userId }, process.env.JWT_REFRESH_SECRET, { expiresIn: "7d" });

    return { accessToken, refreshToken };
};

exports.verifyAccessToken = (token) => {
    return jwt.verify(token, process.env.JWT_SECRET);
};

exports.verifyRefreshToken = (token) => {
    return jwt.verify(token, process.env.JWT_REFRESH_SECRET);
};

exports.generateResetToken = (userId) => {
    return jwt.sign({ id: userId }, process.env.JWT_RESET_SECRET, { expiresIn: "15m" });
};
