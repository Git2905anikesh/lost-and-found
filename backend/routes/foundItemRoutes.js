const express = require('express');
const router = express.Router();
const {
  createFoundItem,
  getFoundItems,
  getFoundItemById,
  getMyFoundItems,
  updateFoundItem,
  deleteFoundItem,
} = require('../controllers/foundItemController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

// Public routes
router.get('/', getFoundItems);

// Protected route for fetching current user's items
// NOTE: This must come BEFORE '/:id' to avoid "user" being treated as an ID
router.get('/user/me', protect, getMyFoundItems);

// Public route for single item
router.get('/:id', getFoundItemById);

// Protected routes (Creation, Updating, Deletion)
router.post('/', protect, upload.single('image'), createFoundItem);
router.put('/:id', protect, upload.single('image'), updateFoundItem);
router.delete('/:id', protect, deleteFoundItem);

module.exports = router;
