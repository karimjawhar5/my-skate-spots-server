const express = require('express');


//DB schemas
const Post = require('../models/post')

const router = express.Router();

//middlewares

//endpoints
router.post('/create', async (req, res) => {
    try{
        const { user, image, title, description, location, tags } = req.body;

        //const userId = req.user.id;

        const post = new Post({
            user: user,
            image,
            title,
            description,
            location,
            tags
        })

        await post.save();

        res.status(201).json({ message:"created post successfully", data: post });
    }catch(error){
        console.log(error);
        res.status(500).json({error: 'An error occurred while creating the post'})
    }
});

router.get('/nearby', async (req, res) => {
    try {
        const { latitude, longitude, radius } = req.query;
        const posts = await Post.find({
            location: {
              $near: {
                $maxDistance: radius,
                $geometry: {
                  type: 'Point',
                  coordinates: [parseFloat(latitude), parseFloat(longitude)],
                }
              }
            }
          });
          res.status(200).json({message:"retreived posts successfully", data: posts});
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Server error finding posts nearby' });
          }
});

router.get('/:id', async (req, res) => {
    try {
      const postId = req.params.id;
      const post = await Post.findById(postId);
  
      if (!post) {
        return res.status(404).json({ error: 'Post not found' });
      }
  
      res.status(200).json(post);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Server error' });
    }
});


module.exports = router;

