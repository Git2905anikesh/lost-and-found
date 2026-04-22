const asyncHandler = require('express-async-handler');
const Match = require('../models/Match');
const LostItem = require('../models/LostItem');
const FoundItem = require('../models/FoundItem');
const calculateMatchScore = require('../utils/calculateMatchScore');

// @desc    Run match algorithm for a newly created Lost Item
// @route   N/A (Called internally from lostItemController)
const generateMatchesForLostItem = async (lostItemId) => {
  const lostItem = await LostItem.findById(lostItemId);
  if (!lostItem) return;

  // Find all active found items
  const foundItems = await FoundItem.find({ status: 'active' });

  for (let foundItem of foundItems) {
    // Check if match already exists to avoid duplicates
    const matchExists = await Match.findOne({
      lostItem: lostItem._id,
      foundItem: foundItem._id,
    });

    if (!matchExists) {
      // Use the utility function to calculate score
      const { score, summary } = calculateMatchScore(lostItem, foundItem);
      
      // Save match if score is above a certain threshold (e.g., 30 points)
      if (score >= 30) {
        await Match.create({
          lostItem: lostItem._id,
          foundItem: foundItem._id,
          score,
          summary,
        });
      }
    }
  }
};

// @desc    Run match algorithm for a newly created Found Item
// @route   N/A (Called internally from foundItemController)
const generateMatchesForFoundItem = async (foundItemId) => {
  const foundItem = await FoundItem.findById(foundItemId);
  if (!foundItem) return;

  // Find all active lost items
  const lostItems = await LostItem.find({ status: 'active' });

  for (let lostItem of lostItems) {
    // Check if match already exists to avoid duplicates
    const matchExists = await Match.findOne({
      lostItem: lostItem._id,
      foundItem: foundItem._id,
    });

    if (!matchExists) {
      // Use the utility function to calculate score
      const { score, summary } = calculateMatchScore(lostItem, foundItem);
      
      // Save match if score is above threshold (e.g., 30 points)
      if (score >= 30) {
        await Match.create({
          lostItem: lostItem._id,
          foundItem: foundItem._id,
          score,
          summary,
        });
      }
    }
  }
};

// @desc    Get all matches relevant to the logged-in user
// @route   GET /api/matches/my
// @access  Private
const getMyMatches = asyncHandler(async (req, res) => {
  // 1. Find all items created by this user
  const userLostItems = await LostItem.find({ user: req.user.id }).select('_id');
  const userFoundItems = await FoundItem.find({ user: req.user.id }).select('_id');

  const lostItemIds = userLostItems.map((item) => item._id);
  const foundItemIds = userFoundItems.map((item) => item._id);

  // 2. Find matches where either the lostItem OR foundItem belongs to the user
  const matches = await Match.find({
    $or: [
      { lostItem: { $in: lostItemIds } }, 
      { foundItem: { $in: foundItemIds } }
    ],
  })
    .populate('lostItem')
    .populate('foundItem')
    .sort({ score: -1 }); // Highest match scores first

  res.status(200).json(matches);
});

// @desc    Get matches for a specific item
// @route   GET /api/matches/item/:id
// @access  Private
const getItemMatches = asyncHandler(async (req, res) => {
  const itemId = req.params.id;

  // Search in Match collection where this ID is either the lostItem or foundItem
  const matches = await Match.find({
    $or: [{ lostItem: itemId }, { foundItem: itemId }],
  })
    .populate('lostItem')
    .populate('foundItem')
    .sort({ score: -1 }); // Highest match scores first

  res.status(200).json(matches);
});

module.exports = {
  generateMatchesForLostItem,
  generateMatchesForFoundItem,
  getMyMatches,
  getItemMatches,
};
