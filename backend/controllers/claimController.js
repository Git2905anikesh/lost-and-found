const asyncHandler = require('express-async-handler');
const Claim = require('../models/Claim');
const LostItem = require('../models/LostItem');
const FoundItem = require('../models/FoundItem');

// @desc    Submit a new claim
// @route   POST /api/claims
// @access  Private
const createClaim = asyncHandler(async (req, res) => {
  const { itemType, itemId, message } = req.body;

  // Validate inputs
  if (!itemType || !itemId || !message) {
    res.status(400);
    throw new Error('Please provide itemType, itemId, and a proof message');
  }

  // Ensure itemType is valid
  if (itemType !== 'LostItem' && itemType !== 'FoundItem') {
    res.status(400);
    throw new Error('Invalid itemType. Must be LostItem or FoundItem');
  }

  // Check if item actually exists
  let itemExists;
  if (itemType === 'LostItem') {
    itemExists = await LostItem.findById(itemId);
  } else {
    itemExists = await FoundItem.findById(itemId);
  }

  if (!itemExists) {
    res.status(404);
    throw new Error(`${itemType} not found`);
  }

  // Prevent user from claiming their own item
  if (itemExists.user.toString() === req.user.id) {
    res.status(400);
    throw new Error('You cannot claim an item you reported');
  }

  // Check if user already submitted a pending claim for this item
  const existingClaim = await Claim.findOne({
    itemId,
    claimedBy: req.user.id,
    status: 'pending'
  });

  if (existingClaim) {
    res.status(400);
    throw new Error('You already have a pending claim for this item');
  }

  // Create claim
  const claim = await Claim.create({
    itemType,
    itemId,
    claimedBy: req.user.id,
    message,
    status: 'pending'
  });

  res.status(201).json(claim);
});

// @desc    Get logged in user's claims
// @route   GET /api/claims/my
// @access  Private
const getMyClaims = asyncHandler(async (req, res) => {
  // .populate('itemId') works magically here because Mongoose uses the 'itemType' field 
  // via the refPath we set up in the Claim schema!
  const claims = await Claim.find({ claimedBy: req.user.id })
    .populate('itemId')
    .sort({ createdAt: -1 });

  res.status(200).json(claims);
});

// @desc    Update claim status
// @route   PUT /api/claims/:id/status
// @access  Private/Admin
const updateClaimStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;

  // Validate status
  if (!['approved', 'rejected', 'pending'].includes(status)) {
    res.status(400);
    throw new Error('Invalid status');
  }

  const claim = await Claim.findById(req.params.id);

  if (!claim) {
    res.status(404);
    throw new Error('Claim not found');
  }

  // Update claim
  claim.status = status;
  claim.reviewedBy = req.user.id;
  
  const updatedClaim = await claim.save();

  // If approved, automatically mark the underlying item as 'resolved'
  if (status === 'approved') {
    if (claim.itemType === 'LostItem') {
      await LostItem.findByIdAndUpdate(claim.itemId, { status: 'resolved' });
    } else {
      await FoundItem.findByIdAndUpdate(claim.itemId, { status: 'resolved' });
    }
  }

  res.status(200).json(updatedClaim);
});

module.exports = {
  createClaim,
  getMyClaims,
  updateClaimStatus,
};
