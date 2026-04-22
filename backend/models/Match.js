const mongoose = require('mongoose');

const matchSchema = new mongoose.Schema(
  {
    lostItem: { type: mongoose.Schema.Types.ObjectId, ref: 'LostItem', required: true },
    foundItem: { type: mongoose.Schema.Types.ObjectId, ref: 'FoundItem', required: true },
    score: { type: Number, required: true },
    summary: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Match', matchSchema);
