// const propertyService = require("./property.service");

// exports.createProperty = async (req, res) => {
//     try {
//         // Use req.user from protect middleware instead of email
//         const user = req.user; // Set by protect
//         if (!user.verified) {
//             return res.status(403).json({ message: "Please verify your email to post properties" });
//         }
//         if (!user.profileCompleted) {
//             return res.status(400).json({ message: "Complete your profile to post properties" });
//         }

//         // Validate required fields
//         const {
//             title, description, price, purpose, type, area,
//             location, images
//         } = req.body;

//         if (!title || !description || !price || !purpose || !type || !area?.value || !area?.unit || !location?.city) {
//             return res.status(400).json({ message: "Missing required fields" });
//         }

//         // Additional numeric validations
//         if (price <= 0 || area.value <= 0) {
//             return res.status(400).json({ message: "Price and area value must be greater than 0" });
//         }

//         if (!Array.isArray(images) || images.length === 0) {
//             return res.status(400).json({ message: "At least one image is required" });
//         }

//         //Upload images to cloud
//         const uploadedImageUrls = await propertyService.uploadImages(images);
//         if (!uploadedImageUrls || uploadedImageUrls.length === 0) {
//             return res.status(500).json({ message: "Image upload failed" });
//         }

//         // Prepare data for DB entry
//         const propertyData = {
//             ...req.body,
//             images: uploadedImageUrls,
//             postedBy: user._id,
//         };

//         // Save property
//         const property = await propertyService.createProperty(propertyData);

//         res.status(201).json({ message: "Property created successfully", property });
//     } catch (error) {
//         console.error("❌ Property Creation Error:", error);
//         res.status(500).json({ message: "Property creation failed", error: error.message });
//     }
// };

// Placeholder for getAllProperties (to be implemented later)
// exports.getAllProperties = async (req, res) => {
//     res.status(501).json({ message: "Not implemented yet" });
// };

const propertyService = require("./property.service");

exports.createProperty = async (req, res) => {
    try {
        // Use req.user from protect middleware
        const user = req.user;
        if (!user.verified) {
            return res.status(403).json({ message: "Please verify your email to post properties" });
        }
        if (!user.profileCompleted) {
            return res.status(400).json({ message: "Complete your profile to post properties" });
        }

        // Validate required text fields from req.body
        const {
            title, description, price, purpose, type, area, location
        } = req.body;

        if (!title || !description || !price || !purpose || !type || !area || !location) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        // Parse nested fields (area and location come as strings, need parsing)
        let parsedArea, parsedLocation;
        try {
            parsedArea = typeof area === "string" ? JSON.parse(area) : area;
            parsedLocation = typeof location === "string" ? JSON.parse(location) : location;
        } catch (error) {
            return res.status(400).json({ message: "Invalid area or location format" });
        }

        if (!parsedArea.value || !parsedArea.unit || parsedArea.value <= 0) {
            return res.status(400).json({ message: "Area value and unit are required and must be positive" });
        }
        if (!parsedLocation.city) {
            return res.status(400).json({ message: "City is required in location" });
        }
        if (price <= 0) {
            return res.status(400).json({ message: "Price must be greater than 0" });
        }

        // Validate images from req.files
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ message: "At least one image is required" });
        }

        // Upload images to cloud
        const uploadedImageUrls = await propertyService.uploadImages(req.files);
        if (!uploadedImageUrls || uploadedImageUrls.length === 0) {
            return res.status(500).json({ message: "Image upload failed" });
        }

        // Prepare data for DB entry
        const propertyData = {
            title,
            description,
            price: Number(price), // Ensure numeric
            purpose,
            type,
            area: parsedArea,
            location: parsedLocation,
            images: uploadedImageUrls,
            postedBy: user._id,
            ...(req.body.bedrooms && { bedrooms: Number(req.body.bedrooms) }),
            ...(req.body.bathrooms && { bathrooms: Number(req.body.bathrooms) }),
            ...(req.body.features && { features: JSON.parse(req.body.features) }),
            ...(req.body.facilities && { facilities: JSON.parse(req.body.facilities) }),
            ...(req.body.furnishing && { furnishing: req.body.furnishing }),
            ...(req.body.tags && { tags: JSON.parse(req.body.tags) }),
            ...(req.body.availabilityDate && { availabilityDate: new Date(req.body.availabilityDate) }),
        };

        // Save property
        const property = await propertyService.createProperty(propertyData);

        res.status(201).json({ message: "Property created successfully", property });
    } catch (error) {
        console.error("❌ Property Creation Error:", error);
        res.status(500).json({ message: "Property creation failed", error: error.message });
    }
};

exports.getAllProperties = async (req, res) => {
    try {
        // Pagination
        const page = Math.max(1, parseInt(req.query.page) || 1); // Default to 1, ensure positive
        const limit = Math.min(50, Math.max(1, parseInt(req.query.limit) || 10)); // Default 10, max 50
        const skip = (page - 1) * limit;

        // Filters
        const filters = {};
        if (req.query.city) filters["location.city"] = req.query.city;
        if (req.query.type) filters.type = req.query.type;
        if (req.query.purpose) filters.purpose = req.query.purpose;
        if (req.query.priceMin) filters.price = { ...filters.price, $gte: Number(req.query.priceMin) };
        if (req.query.priceMax) filters.price = { ...filters.price, $lte: Number(req.query.priceMax) };

        // Sorting
        let sort = {};
        if (req.query.sort) {
            const [field, direction] = req.query.sort.split(":");
            if (["price", "createdAt"].includes(field) && ["asc", "desc"].includes(direction)) {
                sort[field] = direction === "asc" ? 1 : -1;
            } else {
                return res.status(400).json({ message: "Invalid sort format. Use 'price:asc', 'price:desc', 'createdAt:asc', or 'createdAt:desc'" });
            }
        } else {
            sort = { createdAt: -1 }; // Default: newest first
        }

        // Fetch properties
        const [properties, totalItems] = await Promise.all([
            propertyService.getProperties(filters, sort, skip, limit),
            propertyService.countProperties(filters),
        ]);

        // Metadata
        const totalPages = Math.ceil(totalItems / limit);
        const meta = {
            totalItems,
            totalPages,
            currentPage: page,
            limit,
        };

        res.status(200).json({
            data: properties,
            meta,
        });
    } catch (error) {
        console.error("❌ Get All Properties Error:", error);
        res.status(500).json({ message: "Failed to fetch properties", error: error.message });
    }
};