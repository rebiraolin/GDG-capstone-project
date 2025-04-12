// src/routes/googleAuthRoutes.js
const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken'); // You might not need this here if you handle redirection

const router = express.Router();

//auth/google
router.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

//GET /auth/google/callback
router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
    // Authentication successful, req.user now contains { user: ..., token: ... }
    const token = req.user.token;

    // You can now decide how to handle this token:
    // 1. Redirect the user to a frontend route with the token as a query parameter or in local storage.
    // 2. Set the token as an HTTP-only cookie.
    // 3. Directly send the token in the response.

    // Example: Redirect with token as query parameter
    res.redirect(`/?google_token=${token}`);

    // Example: Set as HTTP-only cookie (more secure)
    // res.cookie('authToken', token, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 });
    // res.redirect('/');

    // Example: Send token in the response (for API testing)
    // res.json({ message: 'Google login successful', token });
  }
);

module.exports = router;