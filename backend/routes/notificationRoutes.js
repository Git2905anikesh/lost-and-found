const express = require('express');
const router = express.Router();
const {
  getNotifications,
  markAsRead,
} = require('../controllers/notificationController');
const { protect } = require('../middleware/authMiddleware');

// Get all notifications for the logged-in user
router.get('/', protect, getNotifications);

// Mark a specific notification as read
router.put('/:id/read', protect, markAsRead);

module.exports = router;
