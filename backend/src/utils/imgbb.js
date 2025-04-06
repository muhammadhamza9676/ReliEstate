// const axios = require("axios");

// const API_KEY = process.env.IMGBB_API_KEY;

// const imgbbUpload = async (base64Image) => {
//     try {
//         const response = await axios.post("https://api.imgbb.com/1/upload", null, {
//             params: {
//                 key: API_KEY,
//                 image: base64Image,
//             },
//         });

//         return response.data?.data?.url;
//     } catch (error) {
//         console.error("❌ Imgbb Upload Error:", error.response?.data || error.message);
//         throw new Error("Failed to upload image to ImgBB");
//     }
// };

// module.exports = imgbbUpload;
const axios = require("axios");
const FormData = require("form-data");

const imgbbUpload = async (buffer) => {
    try {
        const form = new FormData();
        form.append("image", buffer, { filename: "property.jpg" });
        const response = await axios.post(
            `https://api.imgbb.com/1/upload?key=${process.env.IMGBB_API_KEY}`,
            form,
            { headers: form.getHeaders() }
        );
        return response.data.data.url;
    } catch (error) {
        throw new Error(`ImgBB upload failed: ${error.message}`);
    }
};

module.exports = imgbbUpload;