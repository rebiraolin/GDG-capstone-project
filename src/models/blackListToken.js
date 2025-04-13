const mongoose = require('mongoose');

// Blacklist schema definition
const blacklistSchema = new mongoose.Schema(
  {
    token: {
      type: String,
      required: true,
      unique: true,
    },
    expires: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt
  }
);

// Optional method to check if token is expired
blacklistSchema.methods.isExpired = function () {
  return this.expires < new Date();
};

const Blacklist = mongoose.model('blacklist', blacklistSchema); // Lowercase collection name is good

module.exports = Blacklist;
