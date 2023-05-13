const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
    required: true
  },
  image: {
    type: String,
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
  },
  location: {
    type: {
      type: String,
      enum: ['Point'], // Only allow 'Point' as the location type
      required: true
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: true
    }
  },
  tags: [{
    type: String
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});


// Add a 2dsphere index to enable spatial queries on the location field
postSchema.index({ location: '2dsphere' });

const Post = mongoose.model('Post', postSchema);

module.exports = Post;
