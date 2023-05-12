const express = require('express');
const bcrypt = require("bcryptjs");
const User = require('../models/user')
const passport = require("passport");

const router = express.Router();

// Middlewares
router.use(passport.initialize())
router.use(passport.session())
require('../config/passportConfig')(passport)

// Routes

router.post("/login", (req,res, next)=>{
    passport.authenticate("local", (err, user, info)=>{
        if(err) throw err;
        if (!user) {res.json("No User Exists")}
        else{
            req.logIn(user, err => {
                if (err) throw err;
                res.json('success')
                console.log(req.session)
            })
        }
    })(req, res, next)
})

router.post("/register", async (req,res)=>{
    try{

        const result = await User.findOne({username: req.body.username});
        if (result) res.json("User already exists");
        if (!result) {
            var salt = bcrypt.genSaltSync(10);
            var hashedPassword = bcrypt.hashSync(req.body.password, salt);
            const newUser = new User({
                username: req.body.username,
                password: hashedPassword,
            });
            await newUser.save()
            res.json("User Created")
        }
    }catch(err){
        if (err) throw err;
    }
})

router.get("/account", (req,res)=>{ 
    console.log(req.user)
    res.json(req.user)
})


module.exports = router;
