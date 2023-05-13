const express = require('express');

const User = require('../models/user')
const SavedPost = require('../models/saved')

const router = express.Router()

router.post('/save-post/:userid', async (req, res) =>{
    try {
        const postId = req.body.postId;
        const userId = req.params.userid;
      //const userId = req.user;

        if(!userId){
            res.status(401).json({error: 'Unauthorized: You must be logged in to save a post'})
        }

        if(!postId){
            res.status(401).json({error: 'Unauthorized: You must be provide a post to be saved'})
        }
        
        const newSavedPost = new SavedPost({
            user: userId,
            post: postId
        })

        await newSavedPost.save()
        res.status(201).json({message: "saved post successfully", data: newSavedPost})

    }catch(error){
        console.log(error);
        res.status(500).json({error: 'An error occurred while saving post'})
    }

})

router.get('/saved/:id', async (req, res) => { //fix this
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

  router.post('/edit/:id', async (req, res) =>{ //fix this
    try {
        const userId = req.params.id
        //const userId = req.user

        const user = await User.findById(userId);
    
        user.name = req.body.name;
        user.profilePicture = req.body.profilePicture;
        user.bio = req.body.bio

    
        await user.save();
    
        res.status(200).json({ message: 'User information updated successfully' });
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
      }
  })

router.get('/:id', async (req, res)=>{ //fix this
    try {
      const userId = req.params.id;
      //const userId = req.user.id;
      const user = await User.findById(userId);
  
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      res.status(200).json({message:"user found", data:user});
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Server error' });
    }
  })

  module.exports = router;