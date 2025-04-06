const User = require("../../models/user.model");

exports.getUserById = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) return res.status(400).json({ message: "User ID is required" });

        const user = await User.findById(id).select("-password -refreshTokens"); // Exclude sensitive fields
        if (!user) return res.status(404).json({ message: "User not found" });

        res.status(200).json({
            data: user,
            message: "User fetched successfully",
        });
    } catch (error) {
        console.error("❌ Get User By ID Error:", error);
        res.status(500).json({ message: "Failed to fetch user", error: error.message });
    }
};