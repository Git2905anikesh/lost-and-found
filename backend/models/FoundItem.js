const mongoose = require('mongoose');

const foundItemSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    color: { type: String },
    brand: { type: String },
    location: { type: String, required: true },
    dateFound: { type: Date, required: true },
    imageUrl: { type: String },
    contactInfo: { type: String, required: true },
    status: { type: String, enum: ['active', 'resolved'], default: 'active' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('FoundItem', foundItemSchema);
