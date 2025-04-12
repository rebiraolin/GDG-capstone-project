const express = require('express');
const route = express.Router();
const {
  getPost,
  addPost,
  updatePost,
  deletePost,
} = require('../controllers/postController');
const auth = require('../middleware/authMiddleware'); // Assuming 'auth' is your authentication/authorization middleware

// Get all posts
route.get('/', getPost);

// Add a new post
route.post('/', auth, addPost);

route.put('/:id', auth, updatePost);

// Delete a post by id (requires authorization)
route.delete('/:id', auth, deletePost);

module.exports = route;
