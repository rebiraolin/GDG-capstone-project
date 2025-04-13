const Post = require('../models/posts'); // Import the Post model

// Get all posts
const getPost = async (req, res) => {
  try {
    const allPosts = await Post.find().populate('author', 'username');
    res.status(200).json({ allPosts }); // Corrected status code to 200 for successful retrieval
    console.log('Posts retrieved successfully');
  } catch (err) {
    res
      .status(500)
      .json({ message: 'Error while getting posts', error: err.message });
    console.error('Error while getting posts:', err);
  }
};

// Add new post
const addPost = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const { title, content, category } = req.body;
    if (!title || !content || !category) {
      return res
        .status(400)
        .json({ message: 'Title, content, and category are required' });
    }

    const newPost = new Post({
      title,
      content,
      category,
      author: req.user._id, // Assuming user ID is available as _id
    });

    await newPost.save();

    res
      .status(201)
      .json({ message: 'Post created successfully', post: newPost });
  } catch (error) {
    console.error('Error while creating post:', error);
    res
      .status(500)
      .json({ message: 'Error while creating post', error: error.message });
  }
};

// Update post
const updatePost = async (req, res) => {
  const userId = req.user._id; // Assuming user ID is available as _id
  const postId = req.params.id;

  try {
    const post = await Post.findById(postId);
    if (!post) {
      console.log('Post not found');
      return res.status(404).json({ message: 'Post doesn’t exist' });
    }

    // Check if the user is the author of the post
    if (post.author.toString() !== userId.toString()) {
      console.log('User is forbidden to update');
      return res.status(403).json({ message: 'Action is forbidden' });
    }

    const { title, content, category } = req.body;
    // Update only the fields that are provided
    if (title !== undefined) post.title = title;
    if (content !== undefined) post.content = content;
    if (category !== undefined) post.category = category;

    const updatedPost = await post.save();
    res.status(200).json({ post: updatedPost });
    console.log('Post updated successfully');
  } catch (err) {
    res
      .status(500)
      .json({ message: 'Error while updating post', error: err.message });
    console.error('Error while updating post:', err);
  }
};

// Delete post
const deletePost = async (req, res) => {
  const userId = req.user._id; // Assuming user ID is available as _id
  const postId = req.params.id;

  try {
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Ensure the user is the author of the post
    if (userId.toString() !== post.author.toString()) {
      console.log('User is forbidden');
      return res.status(403).json({ message: 'Forbidden' });
    }

    await Post.findByIdAndDelete(postId); // Using findByIdAndDelete
    res.status(200).json({ message: 'Post deleted successfully' }); // Corrected status code to 200
    console.log('Post deleted successfully');
  } catch (err) {
    res.status(500).json({ message: 'Server Error', error: err.message });
    console.error('Error while deleting post:', err);
  }
};

module.exports = { getPost, addPost, updatePost, deletePost };
