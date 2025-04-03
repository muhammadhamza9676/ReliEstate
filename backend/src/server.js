// const dotenv = require("dotenv");
// const connectDB = require("./config/db");
// const app = require("./app");

// dotenv.config();
// connectDB(); // Connect to DB

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// const dotenv = require("dotenv");
// const connectDB = require("./config/db");
// const app = require("./app");
// const { connectRedis } = require("./config/redis");

// // Load environment variables
// dotenv.config();

// // Connect to MongoDB
// connectDB();

// // Connect to Redis
// connectRedis();

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const app = require("./app");
const { connectRedis } = require("./config/redis");

// Load environment variables
dotenv.config();

const startServer = async () => {
    try {
        // Connect to MongoDB
        await connectDB();
        
        // Connect to Redis
        await connectRedis();

        const PORT = process.env.PORT || 5000;
        app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
    } catch (error) {
        console.error('Server startup failed:', error);
        process.exit(1);
    }
};

startServer();