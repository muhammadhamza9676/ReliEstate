// api/admin/admin.controller.js
const User = require("../../models/user.model");
const Property = require("../../models/property.model");
const Inquiry = require("../../models/inquiry.model");

exports.getDashboard = async (req, res) => {
    try {
        // Overview Metrics
        const totalUsers = await User.countDocuments();
        const userRoles = await User.aggregate([{ $group: { _id: "$role", count: { $sum: 1 } } }]);
        const totalProperties = await Property.countDocuments();
        const propertyStatus = await Property.aggregate([{ $group: { _id: "$status", count: { $sum: 1 } } }]);
        const unverifiedProperties = await Property.countDocuments({ isVerified: false });
        const totalInquiries = await Inquiry.countDocuments();
        const pendingInquiries = await Inquiry.countDocuments({ status: "pending" });

        // User Insights
        const recentUsers = await User.find()
            .sort({ createdAt: -1 })
            .limit(10)
            .select("name email role verified createdAt");
        const topBrokers = await User.aggregate([
            { $match: { role: "broker" } },
            { $unwind: "$reviews" },
            { $group: { _id: "$_id", name: { $first: "$name" }, avgRating: { $avg: "$reviews.rating" }, reviewCount: { $sum: 1 } } },
            { $sort: { avgRating: -1 } },
            { $limit: 5 },
        ]);
        const unverifiedBrokers = await User.countDocuments({ role: "broker", "brokerInfo.verified": false });

        // Property Insights
        const recentProperties = await Property.find()
            .sort({ createdAt: -1 })
            .limit(10)
            .select("title postedBy status isVerified createdAt")
            .populate("postedBy", "name");
        const mostViewedProperties = await Property.find()
            .sort({ views: -1 })
            .limit(5)
            .select("title views postedBy")
            .populate("postedBy", "name");
        const propertiesByCity = await Property.aggregate([
            { $group: { _id: "$location.city", count: { $sum: 1 } } },
            { $sort: { count: -1 } },
        ]);

        // Inquiry Insights
        const recentInquiries = await Inquiry.find()
            .sort({ createdAt: -1 })
            .limit(10)
            .select("name phone property broker status createdAt")
            .populate("property", "title")
            .populate("broker", "name");
        const inquiriesByStatus = await Inquiry.aggregate([{ $group: { _id: "$status", count: { $sum: 1 } } }]);
        const topBrokersByInquiries = await Inquiry.aggregate([
            { $group: { _id: "$broker", count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 5 },
            { $lookup: { from: "users", localField: "_id", foreignField: "_id", as: "broker" } },
            { $project: { "broker.name": 1, count: 1 } },
        ]);

        const dashboardData = {
            overview: {
                totalUsers,
                userRoles: Object.fromEntries(userRoles.map(r => [r._id, r.count])),
                totalProperties,
                propertyStatus: Object.fromEntries(propertyStatus.map(s => [s._id, s.count])),
                unverifiedProperties,
                totalInquiries,
                pendingInquiries,
            },
            users: {
                recentUsers,
                topBrokers,
                unverifiedBrokers,
            },
            properties: {
                recentProperties,
                mostViewedProperties,
                propertiesByCity,
            },
            inquiries: {
                recentInquiries,
                inquiriesByStatus: Object.fromEntries(inquiriesByStatus.map(s => [s._id, s.count])),
                topBrokersByInquiries,
            },
        };

        res.status(200).json({
            data: dashboardData,
            message: "Admin dashboard data fetched successfully",
        });
    } catch (error) {
        console.error("❌ Get Dashboard Error:", error);
        res.status(500).json({ message: "Failed to fetch dashboard data", error: error.message });
    }
};