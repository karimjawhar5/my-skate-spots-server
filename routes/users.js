const express = require('express');


//DB schemas
const Post = require('../models/post')
const User = require('../models/user')
const SavedPost = require('../models/saved')

const router = express.Router();

//middlewares

//endpoints
router.get('/posts/:id', async (req, res) => {
    try {
      const userId = req.params.id;
      const posts = await Post.find({user: userId});
  
      if (!posts) {
        return res.status(404).json({ error: 'Post not found' });
      }
  
      res.status(200).json(posts);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Server error' });
    }
});

router.get('/:username', async (req, res)=>{
  try {
    const userId = req.params.username;
    const user = await User.find({username:userId});

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json({message:"user found", data:user});
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
})

//account edit profile


module.exports = router;

