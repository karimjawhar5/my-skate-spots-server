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

router.get('/saved/:id', async (req, res) => {
  try {
    const userId = req.params.id;
    //const userId = req.user;
    const posts = await SavedPost.find({user: userId});

    if (!posts) {
      return res.status(404).json({ error: 'Post not found' });
    }

    res.status(200).json(posts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/:id', async (req, res)=>{
  try{
    const userId = req.params.id
    const account = User.findById(userId)

    if (!posts) {
      return res.status(404).json({ error: 'Account not found' });
    }
    res.status(200).json(account)

  }catch(err){
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
})


module.exports = router;

