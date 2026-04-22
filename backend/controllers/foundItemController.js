const asyncHandler = require('express-async-handler');
const FoundItem = require('../models/FoundItem');
const cloudinary = require('cloudinary').v2;
const fs = require('fs');

// @desc    Create a found item
// @route   POST /api/found
// @access  Private
const createFoundItem = asyncHandler(async (req, res) => {
  const { title, description, category, color, brand, location, dateFound, contactInfo } = req.body;

  // Validate required fields
  if (!title || !description || !category || !location || !dateFound || !contactInfo) {
    res.status(400);
    throw new Error('Please add all required fields');
  }

  // Handle image upload (Multer places file in req.file)
  let imageUrl = '';
  if (req.file) {
    try {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'lost_and_found',
        width: 800,
        crop: 'limit',
        quality: 'auto'
      });
      imageUrl = result.secure_url;
      if (fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
    } catch (err) {
      console.error('Cloudinary upload error:', err);
      res.status(500);
      throw new Error('Image upload failed');
    }
  }

  const foundItem = await FoundItem.create({
    user: req.user.id,
    title,
    description,
    category,
    color,
    brand,
    location,
    dateFound,
    contactInfo,
    imageUrl,
  });

  res.status(201).json(foundItem);
});

// @desc    Get all found items
// @route   GET /api/found
// @access  Public
const getFoundItems = asyncHandler(async (req, res) => {
  const foundItems = await FoundItem.find().populate('user', 'name email').sort({ createdAt: -1 });
  res.status(200).json(foundItems);
});

// @desc    Get logged in user's found items
// @route   GET /api/found/user/me
// @access  Private
const getMyFoundItems = asyncHandler(async (req, res) => {
  const foundItems = await FoundItem.find({ user: req.user.id }).sort({ createdAt: -1 });
  res.status(200).json(foundItems);
});

// @desc    Get a single found item by ID
// @route   GET /api/found/:id
// @access  Public
const getFoundItemById = asyncHandler(async (req, res) => {
  const foundItem = await FoundItem.findById(req.params.id).populate('user', 'name email');

  if (!foundItem) {
    res.status(404);
    throw new Error('Found item not found');
  }

  res.status(200).json(foundItem);
});

// @desc    Update a found item
// @route   PUT /api/found/:id
// @access  Private
const updateFoundItem = asyncHandler(async (req, res) => {
  const foundItem = await FoundItem.findById(req.params.id);

  if (!foundItem) {
    res.status(404);
    throw new Error('Found item not found');
  }

  // Check for user ownership
  if (foundItem.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error('User not authorized to update this item');
  }

  // Preserve existing image if no new one is uploaded
  let imageUrl = foundItem.imageUrl;
  if (req.file) {
    try {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'lost_and_found',
        width: 800,
        crop: 'limit',
        quality: 'auto'
      });
      imageUrl = result.secure_url;
      if (fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
    } catch (err) {
      console.error('Cloudinary upload error:', err);
      res.status(500);
      throw new Error('Image upload failed');
    }
  }

  const updatedFields = {
    ...req.body,
    imageUrl
  };

  const updatedFoundItem = await FoundItem.findByIdAndUpdate(
    req.params.id,
    updatedFields,
    { new: true } // Returns the newly updated document
  );

  res.status(200).json(updatedFoundItem);
});

// @desc    Delete a found item
// @route   DELETE /api/found/:id
// @access  Private
const deleteFoundItem = asyncHandler(async (req, res) => {
  const foundItem = await FoundItem.findById(req.params.id);

  if (!foundItem) {
    res.status(404);
    throw new Error('Found item not found');
  }

  // Check for user ownership
  if (foundItem.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error('User not authorized to delete this item');
  }

  await foundItem.deleteOne();

  res.status(200).json({ id: req.params.id, message: 'Item deleted successfully' });
});

module.exports = {
  createFoundItem,
  getFoundItems,
  getFoundItemById,
  getMyFoundItems,
  updateFoundItem,
  deleteFoundItem,
};
