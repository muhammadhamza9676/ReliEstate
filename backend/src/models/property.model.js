const mongoose = require("mongoose");
const { Schema, Types } = mongoose;
const slugify = require("slugify"); // Install: npm install slugify

const propertySchema = new Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true, trim: true },
  price: { type: Number, required: true, min: 0 },

  purpose: { type: String, enum: ["sale", "rent"], required: true },
  type: { type: String, enum: ["plot", "house", "apartment", "commercial"], required: true },

  area: {
    value: { type: Number, required: true, min: 0 },
    unit: { type: String, enum: ["sqft", "marla", "kanal", "sqm"], required: true },
  },

  bedrooms: { type: Number, min: 0 },
  bathrooms: { type: Number, min: 0 },

  features: { type: Map, of: Number },
  facilities: { type: Map, of: Boolean },

  location: {
    address: { type: String, trim: true },
    city: { type: String, required: true, trim: true }, // Made required
    state: { type: String, trim: true },
    country: { type: String, trim: true },
    coordinates: {
      lat: { type: Number },
      lng: { type: Number },
    },
  },

  images: [{ type: String }], // Default not needed since it's optional
  isVerified: { type: Boolean, default: false },
  status: { type: String, enum: ["active", "sold", "rented", "draft"], default: "active" },

  slug: { type: String, unique: true, lowercase: true },
  views: { type: Number, default: 0, min: 0 },
  availabilityDate: { type: Date },

  furnishing: { type: String, enum: ["unfurnished", "semi-furnished", "fully-furnished"] },
  tags: [{ type: String, trim: true }],

  postedBy: {
    type: Types.ObjectId,
    ref: "User",
    required: true,
  },
}, { timestamps: true });

// Auto-generate slug before saving
propertySchema.pre("save", function (next) {
  if (this.isModified("title") || !this.slug) {
    this.slug = slugify(`${this.title}-${Date.now()}`, { lower: true, strict: true });
  }
  next();
});

// Indexes for performance
propertySchema.index({ postedBy: 1 });
propertySchema.index({ "location.city": 1 });
propertySchema.index({ status: 1 });
propertySchema.index({ type: 1 });
// propertySchema.index({ slug: 1 }, { unique: true });

const Property = mongoose.model("Property", propertySchema);
module.exports = Property;