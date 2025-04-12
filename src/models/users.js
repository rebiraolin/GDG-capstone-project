const mongoose = require('mongoose');

// Regular expression for email validation
const emailRegex = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      unique: true,
      sparse: true, // Allows multiple nulls for Google-auth users
    },
    email: {
      type: String,
      unique: true,
      sparse: true,
      match: emailRegex,
    },
    password: {
      type: String,
      // Not required for users registered with Google OAuth
    },
    googleId: {
      type: String,
      unique: true,
      sparse: true, // Allows coexistence of regular and Google-auth users
    },
  },
  { timestamps: true }
);

const User = mongoose.model('users', userSchema);
module.exports = User;
