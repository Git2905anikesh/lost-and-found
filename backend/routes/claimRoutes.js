const express = require('express');
const router = express.Router();
const {
  createClaim,
  getMyClaims,
  updateClaimStatus,
} = require('../controllers/claimController');
const { protect } = require('../middleware/authMiddleware');
const { admin } = require('../middleware/adminMiddleware');

// Regular user routes
router.post('/', protect, createClaim);
router.get('/my', protect, getMyClaims);

// Admin routes
// Notice we use both the 'protect' AND 'admin' middleware here
router.put('/:id/status', protect, admin, updateClaimStatus);

module.exports = router;
