const express = require('express');
const router = express.Router();
const { getMyMatches, getItemMatches } = require('../controllers/matchController');
const { protect } = require('../middleware/authMiddleware');

// Route to get all matches related to the current user's items
router.get('/my', protect, getMyMatches);

// Route to get all matches for a specific item (either lost or found)
router.get('/item/:id', protect, getItemMatches);

module.exports = router;
