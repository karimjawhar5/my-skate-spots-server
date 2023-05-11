const express = require('express');
const session = require("express-session");
const cookieParser = require("cookie-parser");
const bcrypt = require("bcryptjs");
const User = require('../models/user')
const passport = require("passport");
const bodyParser = require("body-parser");
require('dotenv').config()

const router = express.Router();

// Middlewares
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended: true}));
router.use(
    session({
        secret: "secretcode",
        resave: true,
        secure: false,
        saveUninitialized: true
    }))
router.use(cookieParser("secretcode"))
router.use(passport.initialize())
router.use(passport.session())
require('../config/passportConfig')(passport)


// Routes

router.post("/login", (req,res, next)=>{
    passport.authenticate("local", (err, user, info)=>{
        if(err) throw err;
        if (!user) {res.send("No User Exists")}
        else{
            req.logIn(user, err => {
                if (err) throw err;
                res.send('success')
                console.log(req.user)
            })
        }
    })(req, res, next)
})

router.post("/register", async (req,res)=>{
    try{

        const result = await User.findOne({username: req.body.username});
        if (result) res.send("User already exists");
        if (!result) {
            var salt = bcrypt.genSaltSync(10);
            var hashedPassword = bcrypt.hashSync(req.body.password, salt);
            const newUser = new User({
                username: req.body.username,
                password: hashedPassword,
            });
            await newUser.save()
            res.send("User Created")
        }
    }catch(err){
        if (err) throw err;
    }
})


module.exports = router;
