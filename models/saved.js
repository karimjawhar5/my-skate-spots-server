const mongoose = require('mongoose')

const savedPostSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    post: { type: mongoose.Schema.Types.ObjectId, ref: 'Post' },
    savedAt: { type: Date, default: Date.now },
  });

  const SavedPost = mongoose.model('SavedPost', savedPostSchema);

  module.exports = SavedPost;