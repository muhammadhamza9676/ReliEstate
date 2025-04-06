// const Property = require("../../models/property.model");
// const imgbbUpload = require("../../utils/imgbb");

// exports.createProperty = async (data) => {
//     try {
//         return await Property.create(data);
//     } catch (error) {
//         throw new Error(`Failed to create property: ${error.message}`);
//     }
// };

// exports.uploadImages = async (images) => {
//     try {
//         if (!Array.isArray(images) || images.length === 0) {
//             throw new Error("Images must be a non-empty array");
//         }

//         const uploaded = await Promise.all(
//             images.map(async (img, index) => {
//                 if (typeof img !== "string") {
//                     throw new Error(`Image at index ${index} must be a string (base64 or path)`);
//                 }
//                 const url = await imgbbUpload(img); // Assumes img is base64 or path
//                 if (!url) throw new Error(`Upload failed for image at index ${index}`);
//                 return url;
//             })
//         );

//         return uploaded;
//     } catch (error) {
//         console.error("❌ Image upload failed:", error);
//         throw new Error(`Image upload failed: ${error.message}`);
//     }
// };

const Property = require("../../models/property.model");
const imgbbUpload = require("../../utils/imgbb");

exports.createProperty = async (data) => {
    try {
        return await Property.create(data);
    } catch (error) {
        throw new Error(`Failed to create property: ${error.message}`);
    }
};

exports.uploadImages = async (files) => {
    try {
        if (!Array.isArray(files) || files.length === 0) {
            throw new Error("No images provided");
        }

        const uploaded = await Promise.all(
            files.map(async (file, index) => {
                const url = await imgbbUpload(file.buffer); // Assumes imgbbUpload accepts buffer
                if (!url) throw new Error(`Upload failed for image at index ${index}`);
                return url;
            })
        );

        return uploaded;
    } catch (error) {
        console.error("❌ Image upload failed:", error);
        throw new Error(`Image upload failed: ${error.message}`);
    }
};

exports.getProperties = async (filters, sort, skip, limit) => {
    try {
        return await Property.find(filters)
            .sort(sort)
            .skip(skip)
            .limit(limit)
            .select("-postedBy"); // Exclude full postedBy details for public access
    } catch (error) {
        throw new Error(`Failed to fetch properties: ${error.message}`);
    }
};

exports.countProperties = async (filters) => {
    try {
        return await Property.countDocuments(filters);
    } catch (error) {
        throw new Error(`Failed to count properties: ${error.message}`);
    }
};