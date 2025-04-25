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

exports.addReview = async (req, res) => {
    try {
        const { id } = req.params; // ID of the user receiving the review
        const { rating, comment } = req.body; // Rating and comment from request body
        const sender = req.user._id; // Sender ID from token

        if (!id) return res.status(400).json({ message: "User ID is required" });
        if (!rating || !comment) return res.status(400).json({ message: "Rating and comment are required" });
        if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
            return res.status(400).json({ message: "Rating must be an integer between 1 and 5" });
        }

        const user = await User.findById(id);
        if (!user) return res.status(404).json({ message: "User not found" });

        // Prevent self-review (optional, based on your needs)
        if (user._id.toString() === sender.toString()) {
            return res.status(400).json({ message: "You cannot review yourself" });
        }

        // Add review to the user's reviews array
        const review = {
            sender,
            rating,
            comment,
        };
        user.reviews.push(review);
        await user.save();

        res.status(201).json({
            message: "Review added successfully",
            review,
        });
    } catch (error) {
        console.error("❌ Add Review Error:", error);
        res.status(500).json({ message: "Failed to add review", error: error.message });
    }
};

// exports.getMyReviews = async (req, res) => {
//     try {
//         const userId = req.user._id; // Authenticated user’s ID from token

//         const page = Math.max(1, parseInt(req.query.page) || 1);
//         const limit = Math.min(50, Math.max(1, parseInt(req.query.limit) || 10));
//         const skip = (page - 1) * limit;

//         const user = await User.findById(userId);
//         if (!user) return res.status(404).json({ message: "User not found" }); // Shouldn’t happen with valid token

//         const totalItems = user.reviews.length;
//         const reviews = user.reviews
//             .slice(skip, skip + limit) // Paginate reviews array
//             .map(review => ({
//                 sender: review.sender,
//                 rating: review.rating,
//                 comment: review.comment,
//                 createdAt: review.createdAt,
//             }));

//         const totalPages = Math.ceil(totalItems / limit);
//         const meta = {
//             totalItems,
//             totalPages,
//             currentPage: page,
//             limit,
//         };

//         res.status(200).json({
//             data: reviews,
//             meta,
//             message: "Reviews fetched successfully",
//         });
//     } catch (error) {
//         console.error("❌ Get My Reviews Error:", error);
//         res.status(500).json({ message: "Failed to fetch reviews", error: error.message });
//     }
// };

exports.getUserReviews = async (req, res) => {
    try {
        const { id } = req.params; // User ID from path
        if (!id) return res.status(400).json({ message: "User ID is required" });

        const page = Math.max(1, parseInt(req.query.page) || 1);
        const limit = Math.min(50, Math.max(1, parseInt(req.query.limit) || 10));
        const skip = (page - 1) * limit;

        const user = await User.findById(id);
        if (!user) return res.status(404).json({ message: "User not found" });

        const totalItems = user.reviews.length;
        const reviews = user.reviews
            .slice(skip, skip + limit)
            .map(review => ({
                sender: review.sender,
                rating: review.rating,
                comment: review.comment,
                createdAt: review.createdAt,
            }));

        const totalPages = Math.ceil(totalItems / limit);
        const meta = {
            totalItems,
            totalPages,
            currentPage: page,
            limit,
        };

        res.status(200).json({
            data: reviews,
            meta,
            message: "Reviews fetched successfully",
        });
    } catch (error) {
        console.error("❌ Get User Reviews Error:", error);
        res.status(500).json({ message: "Failed to fetch reviews", error: error.message });
    }
};

exports.updateProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select("+password");
        if (!user) return res.status(404).json({ message: "User not found" });
        if (!user.verified) return res.status(403).json({ message: "Please verify your email to update your profile" });

        const { name, password, phone, brokerInfo } = req.body;

        // Ignore email if sent
        const updatedData = {};
        if (name) updatedData.name = name;
        if (password) updatedData.password = password; // Will be hashed by schema pre-save
        if (phone) updatedData.phone = phone;
        if (brokerInfo) {
            updatedData.brokerInfo = {
                ...user.brokerInfo,
                experience: brokerInfo.experience || user.brokerInfo.experience,
                agencyName: brokerInfo.agencyName || user.brokerInfo.agencyName,
                licenseNumber: brokerInfo.licenseNumber || user.brokerInfo.licenseNumber,
            };
        }

        // Update user
        Object.assign(user, updatedData);
        await user.save();

        // Check profile completion
        if (user.name && user.email && user.password && user.phone) {
            user.profileCompleted = true;
            await user.save();
        }

        // Return updated user, excluding sensitive fields
        const updatedUser = await User.findById(user._id).select("-password -refreshTokens -resetPasswordToken -resetPasswordExpires");
        res.status(200).json({
            message: "Profile updated successfully",
            data: updatedUser,
        });
    } catch (error) {
        console.error("❌ Update Profile Error:", error);
        res.status(500).json({ message: "Failed to update profile", error: error.message });
    }
};