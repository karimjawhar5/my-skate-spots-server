const express = require('express');
const router = express.Router();
const multer = require('multer');
const { s3Uploadv2 } = require('../config/s3service');

const storage = multer.memoryStorage()

const fileFilter = (req, file, cb) =>{
    if(file.mimetype.split('/')[0] === "image"){
        cb(null, true);
    }else{
        cb(new multer.MulterError("LIMIT_UNEXPECTED_FILE"), false)
    }
}

const upload = multer({
    storage,
    fileFilter,
    limits: {fileSize: 5 * 1024 * 1024, files: 3}
})

// Handle image uploads
router.post('/', upload.array('files'), async (req, res) => {
    try{
        if(!req.files){
            res.status(401).json({error:"No Files Detected"})
        }
        const results = await s3Uploadv2(req.files)
        console.log(results)
        res.status(200).json({message:"Files Upload to S3", data: results});
    }catch(error){
        console.log(error);
        res.status(500).json({error:"Server Error uploading files"})
    }
    
});

router.use((error, req, res, next) => {
    if (error instanceof multer.MulterError){
        if (error.code === "LIMIT FILE SIZE") {
            return res.status (400). json({ message: "file is too large" });
        }
    }
})

module.exports = router;
