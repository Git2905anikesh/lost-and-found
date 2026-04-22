const express = require('express');
const router = express.Router();
const {
  getAllUsers,
  getAllLostItems,
  getAllFoundItems,
  getAllClaims,
  deleteLostItemAdmin,
  deleteFoundItemAdmin,
} = require('../controllers/adminController');
const { protect } = require('../middleware/authMiddleware');
const { admin } = require('../middleware/adminMiddleware');

// All routes inside this file require a valid JWT token AND the 'admin' role
router.get('/users', protect, admin, getAllUsers);
router.get('/lost-items', protect, admin, getAllLostItems);
router.get('/found-items', protect, admin, getAllFoundItems);
router.get('/claims', protect, admin, getAllClaims);

router.delete('/lost-items/:id', protect, admin, deleteLostItemAdmin);
router.delete('/found-items/:id', protect, admin, deleteFoundItemAdmin);

module.exports = router;
