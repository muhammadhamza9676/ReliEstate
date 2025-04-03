const rateLimit = require("express-rate-limit");

exports.rateLimit = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 5, // Limit each IP to 5 requests per minute
    message: "Too many requests, please try again later.",
});
