const express = require('express');
const {
  register,
  login,
  logout,
  forgotPassword,
  resetPassword,
} = require('../controllers/authController');

const router = express.Router();

// Auth Routes
router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);

// Password Reset Routes
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

module.exports = router;
