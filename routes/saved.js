const express = require('express')

const router = express.Router();

const SavedPost = require('../models/saved')

router.post('/save-post', async (req, res) =>{
    try {
        const {UserId, PostId} = req.body;

        // const UserId = req.user.id;
        // const PostId = req.body.postId;

        if(!UserId){
            res.status(401).json({error: 'Unauthorized: You must be logged in to save a post'})
        }

        if(!PostId){
            res.status(401).json({error: 'Unauthorized: You must be provide a post to be saved'})
        }
        
        const newSavedPost = new SavedPost({
            user: UserId,
            post: PostId
        })

        await newSavedPost.save()
        res.status(201).json({newSavedPost})

    }catch(error){
        console.log(error);
        res.status(500).json({error: 'An error occurred while saving post'})
    }

})

module.exports = router;