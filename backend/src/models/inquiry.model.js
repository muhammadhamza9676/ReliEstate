// models/inquiry.model.js
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const inquirySchema = new Schema({
    sender: { type: Schema.Types.ObjectId, ref: "User", required: true }, // Who sent it
    broker: { type: Schema.Types.ObjectId, ref: "User", required: true }, // Who listed the property
    property: { type: Schema.Types.ObjectId, ref: "Property", required: true }, // Related property
    name: { type: String, required: true, trim: true }, // Sender’s name
    phone: { type: String, required: true, trim: true }, // Sender’s phone
    inquiry: { type: String, required: true, trim: true }, // Message content
    status: { type: String, enum: ["pending", "responded"], default: "pending" }, // Inquiry status
}, { timestamps: true });

inquirySchema.index({ broker: 1 }); // For fast broker queries
inquirySchema.index({ property: 1 }); // For property-based lookups

module.exports = mongoose.model("Inquiry", inquirySchema);