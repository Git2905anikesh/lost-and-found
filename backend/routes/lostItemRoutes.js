const express = require('express');
const router = express.Router();
const {
  createLostItem,
  getLostItems,
  getLostItemById,
  getMyLostItems,
  updateLostItem,
  deleteLostItem,
} = require('../controllers/lostItemController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

// Public routes
router.get('/', getLostItems);

// Protected route for fetching current user's items
// NOTE: This must come BEFORE '/:id' to avoid "user" being treated as an ID
router.get('/user/me', protect, getMyLostItems);

// Public route for single item
router.get('/:id', getLostItemById);

// Protected routes (Creation, Updating, Deletion)
// Use the upload middleware to look for a file field named 'image'
router.post('/', protect, upload.single('image'), createLostItem);
router.put('/:id', protect, upload.single('image'), updateLostItem);
router.delete('/:id', protect, deleteLostItem);

module.exports = router;
