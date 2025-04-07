// const express = require("express");
// const cors = require("cors");

// const app = express();

// // Middlewares
// app.use(cors());
// app.use(express.json());

// // Routes
// const authRoutes = require("./api/auth/auth.routes");
// app.use("/api/auth", authRoutes);

// app.get("/", (req, res) => {
//     res.send("API is running...");
// });

// module.exports = app;

const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");

// Import Routes
const authRoutes = require("./api/auth/auth.routes");
const userRoutes = require("./api/users/user.routes");
const propertyRoutes = require("./api/properties/property.routes");
const inquiryRoutes = require("./api/inquiries/inquiry.routes");

// Load environment variables
dotenv.config();

// Create Express app
const app = express();

// Middleware
app.use(cors({ credentials: true, origin: true }));
app.use(morgan("dev")); // Logging
app.use(express.json()); // JSON parser
app.use(cookieParser()); // Parse cookies

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/properties", propertyRoutes);
app.use("/api/inquiries", inquiryRoutes);

// Health check
app.get("/", (req, res) => {
    res.status(200).json({ message: "API is running!" });
});

// Error Handling Middleware
app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
});

module.exports = app;
