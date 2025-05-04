// api/properties/property.controller.js
const Property = require("../../models/property.model");
const User = require("../../models/user.model");
const propertyService = require("./property.service");

exports.createProperty = async (req, res) => {
    try {
        const user = req.user;
        if (!user.verified) {
            return res.status(403).json({ message: "Please verify your email to post properties" });
        }
        if (!user.profileCompleted) {
            return res.status(400).json({ message: "Complete your profile to post properties" });
        }

        const { title, description, price, purpose, type, area, location } = req.body;

        if (!title || !description || !price || !purpose || !type || !area || !location) {
            return res.status(400).json({ message: "Missing required fields" });
        }

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

        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ message: "At least one image is required" });
        }

        const uploadedImageUrls = await propertyService.uploadImages(req.files);
        if (!uploadedImageUrls || uploadedImageUrls.length === 0) {
            return res.status(500).json({ message: "Image upload failed" });
        }

        const propertyData = {
            title,
            description,
            price: Number(price),
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

        const property = await propertyService.createProperty(propertyData);

        res.status(201).json({ message: "Property created successfully", property });
    } catch (error) {
        console.error("❌ Property Creation Error:", error);
        res.status(500).json({ message: "Property creation failed", error: error.message });
    }
};

exports.getAllProperties = async (req, res) => {
    try {
        const page = Math.max(1, parseInt(req.query.page) || 1);
        const limit = Math.min(50, Math.max(1, parseInt(req.query.limit) || 10));
        const skip = (page - 1) * limit;

        const filters = {};
        if (req.query.city) filters["location.city"] = req.query.city;
        if (req.query.type) filters.type = req.query.type;
        if (req.query.purpose) filters.purpose = req.query.purpose;
        if (req.query.priceMin) filters.price = { ...filters.price, $gte: Number(req.query.priceMin) };
        if (req.query.priceMax) filters.price = { ...filters.price, $lte: Number(req.query.priceMax) };

        let sort = {};
        if (req.query.sort) {
            const [field, direction] = req.query.sort.split(":");
            if (["price", "createdAt"].includes(field) && ["asc", "desc"].includes(direction)) {
                sort[field] = direction === "asc" ? 1 : -1;
            } else {
                return res.status(400).json({ message: "Invalid sort format. Use 'price:asc', 'price:desc', 'createdAt:asc', or 'createdAt:desc'" });
            }
        } else {
            sort = { createdAt: -1 };
        }

        const [properties, totalItems] = await Promise.all([
            propertyService.getProperties(
                filters,
                sort,
                skip,
                limit,
                "title price type purpose location.city slug images bedrooms bathrooms area" // Select only needed fields
            ),
            propertyService.countProperties(filters),
        ]);

        // Transform to include only first image
        const transformedProperties = properties.map(property => ({
            title: property.title,
            price: property.price,
            type: property.type,
            purpose: property.purpose,
            city: property.location.city,
            slug: property.slug,
            image: property.images[0] || null, // First image or null if empty
            bedrooms: property.bedrooms,
            bathrooms: property.bathrooms,
            area: property.area,
        }));

        const totalPages = Math.ceil(totalItems / limit);
        const meta = {
            totalItems,
            totalPages,
            currentPage: page,
            limit,
        };

        res.status(200).json({
            data: transformedProperties,
            meta,
        });
    } catch (error) {
        console.error("❌ Get All Properties Error:", error);
        res.status(500).json({ message: "Failed to fetch properties", error: error.message });
    }
};

exports.getPropertyBySlug = async (req, res) => {
    try {
        const { slug } = req.params;
        if (!slug) return res.status(400).json({ message: "Slug is required" });

        const property = await propertyService.getPropertyBySlug(slug);
        if (!property) return res.status(404).json({ message: "Property not found" });

        res.status(200).json({
            data: property,
            message: "Property fetched successfully",
        });
    } catch (error) {
        console.error("❌ Get Property By Slug Error:", error);
        res.status(500).json({ message: "Failed to fetch property", error: error.message });
    }
};

exports.getUserProperties = async (req, res) => {
    try {
        const { userId } = req.query;
        if (!userId) return res.status(400).json({ message: "User ID is required" });

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: "User not found" });

        const page = Math.max(1, parseInt(req.query.page) || 1);
        const limit = Math.min(50, Math.max(1, parseInt(req.query.limit) || 10));
        const skip = (page - 1) * limit;

        const filters = { postedBy: userId };

        const [properties, totalItems] = await Promise.all([
            propertyService.getProperties(
                filters,
                { createdAt: -1 },
                skip,
                limit,
                "title price type purpose location.city slug images"
            ),
            propertyService.countProperties(filters),
        ]);
        
        const transformedProperties = properties.map(property => ({
            id: property.id,
            title: property.title,
            price: property.price,
            type: property.type,
            purpose: property.purpose,
            city: property.location.city,
            slug: property.slug,
            image: property.images[0] || null,
        }));

        const totalPages = Math.ceil(totalItems / limit);
        const meta = {
            totalItems,
            totalPages,
            currentPage: page,
            limit,
        };

        res.status(200).json({
            data: transformedProperties,
            meta,
        });
    } catch (error) {
        console.error("❌ Get User Properties Error:", error);
        res.status(500).json({ message: "Failed to fetch user properties", error: error.message });
    }
};

exports.updateProperty = async (req, res) => {
    try {
        const { id } = req.params;
        const user = req.user;
        if (!id) return res.status(400).json({ message: "Property ID is required" });
        const property = await Property.findById(id);
        if (!property) return res.status(404).json({ message: "Property not found" });
        if (property.postedBy.toString() !== user._id.toString()) {
            return res.status(403).json({ message: "You can only update your own properties" });
        }

        const { title, description, price, purpose, type, area, location, bedrooms, bathrooms, features, facilities, furnishing, tags, availabilityDate } = req.body;

        const updatedData = {};
        if (title) updatedData.title = title;
        if (description) updatedData.description = description;
        if (price) {
            if (price <= 0) return res.status(400).json({ message: "Price must be greater than 0" });
            updatedData.price = Number(price);
        }
        if (purpose) updatedData.purpose = purpose;
        if (type) updatedData.type = type;
        if (area) {
            let parsedArea;
            try {
                parsedArea = typeof area === "string" ? JSON.parse(area) : area;
                if (!parsedArea.value || !parsedArea.unit || parsedArea.value <= 0) {
                    return res.status(400).json({ message: "Area value and unit are required and must be positive" });
                }
                updatedData.area = parsedArea;
            } catch (error) {
                return res.status(400).json({ message: "Invalid area format" });
            }
        }
        if (location) {
            let parsedLocation;
            try {
                parsedLocation = typeof location === "string" ? JSON.parse(location) : location;
                if (!parsedLocation.city) {
                    return res.status(400).json({ message: "City is required in location" });
                }
                updatedData.location = parsedLocation;
            } catch (error) {
                return res.status(400).json({ message: "Invalid location format" });
            }
        }
        if (bedrooms) updatedData.bedrooms = Number(bedrooms);
        if (bathrooms) updatedData.bathrooms = Number(bathrooms);
        if (features) updatedData.features = JSON.parse(features);
        if (facilities) updatedData.facilities = JSON.parse(facilities);
        if (furnishing) updatedData.furnishing = furnishing;
        if (tags) updatedData.tags = JSON.parse(tags);
        if (availabilityDate) updatedData.availabilityDate = new Date(availabilityDate);

        if (req.files && req.files.length > 0) {
            const uploadedImageUrls = await propertyService.uploadImages(req.files);
            if (!uploadedImageUrls || uploadedImageUrls.length === 0) {
                return res.status(500).json({ message: "Image upload failed" });
            }
            updatedData.images = uploadedImageUrls;
        }
        console.log("2")
        const updatedProperty = await Property.findByIdAndUpdate(id, { $set: updatedData }, { new: true });
        res.status(200).json({
            message: "Property updated successfully",
            property: updatedProperty,
        });
    } catch (error) {
        console.error("❌ Update Property Error:", error);
        res.status(500).json({ message: "Failed to update property", error: error.message });
    }
};

exports.deleteProperty = async (req, res) => {
    try {
        const { id } = req.params;
        const user = req.user;
        if (!id) return res.status(400).json({ message: "Property ID is required" });

        const property = await Property.findById(id);
        if (!property) return res.status(404).json({ message: "Property not found" });

        if (property.postedBy.toString() !== user._id.toString()) {
            return res.status(403).json({ message: "You can only delete your own properties" });
        }

        await Property.findByIdAndDelete(id);
        res.status(200).json({ message: "Property deleted successfully" });
    } catch (error) {
        console.error("❌ Delete Property Error:", error);
        res.status(500).json({ message: "Failed to delete property", error: error.message });
    }
};