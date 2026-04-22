const mongoose = require('mongoose');

const claimSchema = new mongoose.Schema(
  {
    itemType: { type: String, enum: ['LostItem', 'FoundItem'], required: true },
    itemId: { type: mongoose.Schema.Types.ObjectId, required: true, refPath: 'itemType' },
    claimedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    message: { type: String, required: true },
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
    reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Claim', claimSchema);
