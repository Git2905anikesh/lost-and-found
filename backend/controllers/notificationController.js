const asyncHandler = require('express-async-handler');
const Notification = require('../models/Notification');

// @desc    Get user notifications
// @route   GET /api/notifications
// @access  Private
const getNotifications = asyncHandler(async (req, res) => {
  // Fetch notifications for the currently logged-in user, newest first
  const notifications = await Notification.find({ user: req.user.id })
    .sort({ createdAt: -1 });

  res.status(200).json(notifications);
});

// @desc    Mark notification as read
// @route   PUT /api/notifications/:id/read
// @access  Private
const markAsRead = asyncHandler(async (req, res) => {
  const notification = await Notification.findById(req.params.id);

  if (!notification) {
    res.status(404);
    throw new Error('Notification not found');
  }

  // Security check: Ensure user actually owns this notification
  if (notification.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error('User not authorized');
  }

  // Mark as read and save
  notification.isRead = true;
  const updatedNotification = await notification.save();

  res.status(200).json(updatedNotification);
});

module.exports = {
  getNotifications,
  markAsRead,
};
