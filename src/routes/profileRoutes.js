const express = require('express');
const { getUserProfile, updateUserProfile } = require('../controllers/profileController');
const auth = require('../middleware/authMiddleware');

const router = express.Router();

// Get user profile (requires authorization)
router.get('/', auth, getUserProfile);  

// Update user profile (requires authorization)
router.put('/', auth, updateUserProfile);

module.exports = router;  // Corrected module.exports
