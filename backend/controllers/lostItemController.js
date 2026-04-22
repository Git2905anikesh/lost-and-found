const asyncHandler = require('express-async-handler');
const LostItem = require('../models/LostItem');
const cloudinary = require('cloudinary').v2;
const fs = require('fs');

// @desc    Create a lost item
// @route   POST /api/lost
// @access  Private
const createLostItem = asyncHandler(async (req, res) => {
  const { title, description, category, color, brand, location, dateLost, contactInfo } = req.body;

  // Validate required fields
  if (!title || !description || !category || !location || !dateLost || !contactInfo) {
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
      // Remove temporary local file
      if (fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
    } catch (err) {
      console.error('Cloudinary upload error:', err);
      res.status(500);
      throw new Error('Image upload failed');
    }
  }

  const lostItem = await LostItem.create({
    user: req.user.id,
    title,
    description,
    category,
    color,
    brand,
    location,
    dateLost,
    contactInfo,
    imageUrl,
  });

  res.status(201).json(lostItem);
});

// @desc    Get all lost items
// @route   GET /api/lost
// @access  Public
const getLostItems = asyncHandler(async (req, res) => {
  const lostItems = await LostItem.find().populate('user', 'name email').sort({ createdAt: -1 });
  res.status(200).json(lostItems);
});

// @desc    Get logged in user's lost items
// @route   GET /api/lost/user/me
// @access  Private
const getMyLostItems = asyncHandler(async (req, res) => {
  const lostItems = await LostItem.find({ user: req.user.id }).sort({ createdAt: -1 });
  res.status(200).json(lostItems);
});

// @desc    Get a single lost item by ID
// @route   GET /api/lost/:id
// @access  Public
const getLostItemById = asyncHandler(async (req, res) => {
  const lostItem = await LostItem.findById(req.params.id).populate('user', 'name email');

  if (!lostItem) {
    res.status(404);
    throw new Error('Lost item not found');
  }

  res.status(200).json(lostItem);
});

// @desc    Update a lost item
// @route   PUT /api/lost/:id
// @access  Private
const updateLostItem = asyncHandler(async (req, res) => {
  const lostItem = await LostItem.findById(req.params.id);

  if (!lostItem) {
    res.status(404);
    throw new Error('Lost item not found');
  }

  // Check for user ownership
  if (lostItem.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error('User not authorized to update this item');
  }

  // Preserve existing image if no new one is uploaded
  let imageUrl = lostItem.imageUrl;
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

  const updatedLostItem = await LostItem.findByIdAndUpdate(
    req.params.id,
    updatedFields,
    { new: true } // Returns the newly updated document
  );

  res.status(200).json(updatedLostItem);
});

// @desc    Delete a lost item
// @route   DELETE /api/lost/:id
// @access  Private
const deleteLostItem = asyncHandler(async (req, res) => {
  const lostItem = await LostItem.findById(req.params.id);

  if (!lostItem) {
    res.status(404);
    throw new Error('Lost item not found');
  }

  // Check for user ownership
  if (lostItem.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error('User not authorized to delete this item');
  }

  await lostItem.deleteOne();

  res.status(200).json({ id: req.params.id, message: 'Item deleted successfully' });
});

module.exports = {
  createLostItem,
  getLostItems,
  getLostItemById,
  getMyLostItems,
  updateLostItem,
  deleteLostItem,
};
