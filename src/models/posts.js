const mongoose = require('mongoose');

const postSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'users',
      required: true,
    },
    category: {
      type: String,
      required: true,
      enum: ['tech', 'health', 'lifestyle', 'education'],
    },
  },
  { timestamps: true }
);

// Add indexes for better performance (optional, depending on your query usage)
postSchema.index({ author: 1 });
postSchema.index({ category: 1 });

const Post = mongoose.model('posts', postSchema);
module.exports = Post;
