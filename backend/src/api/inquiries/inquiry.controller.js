// api/inquiries/inquiry.controller.js
const Inquiry = require("../../models/inquiry.model");
const Property = require("../../models/property.model");

exports.createInquiry = async (req, res) => {
    try {
        const { name, phone, inquiry, propertyId } = req.body;
        const sender = req.user._id;

        if (!name || !phone || !inquiry || !propertyId) {
            return res.status(400).json({ message: "Name, phone, inquiry, and propertyId are required" });
        }

        const property = await Property.findById(propertyId);
        if (!property) return res.status(404).json({ message: "Property not found" });

        const inquiryData = {
            sender,
            broker: property.postedBy,
            property: propertyId,
            name,
            phone,
            inquiry,
        };

        const newInquiry = await Inquiry.create(inquiryData);

        res.status(201).json({
            message: "Inquiry sent successfully",
            data: newInquiry,
        });
    } catch (error) {
        console.error("❌ Create Inquiry Error:", error);
        res.status(500).json({ message: "Failed to send inquiry", error: error.message });
    }
};

exports.getMyInquiries = async (req, res) => {
    try {
        const brokerId = req.user._id;

        const page = Math.max(1, parseInt(req.query.page) || 1);
        const limit = Math.min(50, Math.max(1, parseInt(req.query.limit) || 10));
        const skip = (page - 1) * limit;

        const [inquiries, totalItems] = await Promise.all([
            Inquiry.find({ broker: brokerId })
                .skip(skip)
                .limit(limit)
                .populate("property", "title slug") // Optional: include property title
                .lean(),
            Inquiry.countDocuments({ broker: brokerId }),
        ]);

        const totalPages = Math.ceil(totalItems / limit);
        const meta = {
            totalItems,
            totalPages,
            currentPage: page,
            limit,
        };

        res.status(200).json({
            data: inquiries,
            meta,
            message: "Inquiries fetched successfully",
        });
    } catch (error) {
        console.error("❌ Get My Inquiries Error:", error);
        res.status(500).json({ message: "Failed to fetch inquiries", error: error.message });
    }
};