
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