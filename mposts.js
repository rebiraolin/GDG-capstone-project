
const mongoose = require('mongoose');

const postSchema = new mongoose.Schema(
  {
    title: { type: String, required: true }, // Corrected 'string' to 'String'
    content: { type: String, required: true }, // Corrected 'string' to 'String'
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'users',
      required: true,
    },
  },
  { timestamps: true } // Fixed 'timestamp' to 'timestamps'
);

const Post = mongoose.model('posts', postSchema);

module.exports = Post;  