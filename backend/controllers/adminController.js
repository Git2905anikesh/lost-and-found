const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const LostItem = require('../models/LostItem');
const FoundItem = require('../models/FoundItem');
const Claim = require('../models/Claim');

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find({}).select('-password');
  res.status(200).json(users);
});

// @desc    Get all lost items
// @route   GET /api/admin/lost-items
// @access  Private/Admin
const getAllLostItems = asyncHandler(async (req, res) => {
  const lostItems = await LostItem.find({}).populate('user', 'name email');
  res.status(200).json(lostItems);
});

// @desc    Get all found items
// @route   GET /api/admin/found-items
// @access  Private/Admin
const getAllFoundItems = asyncHandler(async (req, res) => {
  const foundItems = await FoundItem.find({}).populate('user', 'name email');
  res.status(200).json(foundItems);
});

// @desc    Get all claims
// @route   GET /api/admin/claims
// @access  Private/Admin
const getAllClaims = asyncHandler(async (req, res) => {
  const claims = await Claim.find({})
    .populate('claimedBy', 'name email')
    .populate('itemId');
  res.status(200).json(claims);
});

// @desc    Delete a lost item (Admin overriding ownership)
// @route   DELETE /api/admin/lost-items/:id
// @access  Private/Admin
const deleteLostItemAdmin = asyncHandler(async (req, res) => {
  const lostItem = await LostItem.findById(req.params.id);

  if (!lostItem) {
    res.status(404);
    throw new Error('Lost item not found');
  }

  await lostItem.deleteOne();
  res.status(200).json({ id: req.params.id, message: 'Lost item forcefully deleted by admin' });
});

// @desc    Delete a found item (Admin overriding ownership)
// @route   DELETE /api/admin/found-items/:id
// @access  Private/Admin
const deleteFoundItemAdmin = asyncHandler(async (req, res) => {
  const foundItem = await FoundItem.findById(req.params.id);

  if (!foundItem) {
    res.status(404);
    throw new Error('Found item not found');
  }

  await foundItem.deleteOne();
  res.status(200).json({ id: req.params.id, message: 'Found item forcefully deleted by admin' });
});

module.exports = {
  getAllUsers,
  getAllLostItems,
  getAllFoundItems,
  getAllClaims,
  deleteLostItemAdmin,
  deleteFoundItemAdmin,
};
