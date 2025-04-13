const jwt = require('jsonwebtoken');
const blacklist = require('../models/blackListToken');

const authorization = async (req, res, next) => {
  const authHeader = req.headers['authorization'];

  console.log('Authorization Header:', authHeader); // Debugging log

  if (!authHeader) {
    console.log('Empty token');
    return res.status(401).json({ message: 'Token not provided' });
  }

  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    console.log('Invalid token format');
    return res.status(403).json({ message: 'Invalid token format' });
  }

  const token = parts[1];

  if (!token) {
    console.log('Token is empty after Bearer');
    return res.status(403).json({ message: 'Invalid token format' });
  }

  try {
    // Check if the token is blacklisted
    const blackListed = await blacklist.findOne({ token });

    if (blackListed) {
      console.log('Token is blacklisted');
      return res.status(400).json({ message: 'Blacklisted token' });
    }

    // Verify token if it's not blacklisted
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        console.log('Token verification failed:', err.message);
        return res.status(401).json({ message: 'Unauthorized' });
      }

      console.log('Decoded Token Payload:', decoded); // Debugging log

      // Assuming your user ID is stored under a key like 'userId' or '_id' in the payload
      req.user = { _id: decoded.userId || decoded._id }; // Try both common keys
      console.log('Authenticated user:', req.user);
      next();
    });
  } catch (err) {
    console.log('Error while checking blacklisted token:', err.message);
    return res.status(500).json({ message: 'Server error' });
  }
};

module.exports = authorization;
