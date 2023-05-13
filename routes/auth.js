const express = require('express');
const bcrypt = require("bcryptjs");
const passport = require("passport");

//DB schemas
const User = require('../models/user')

const router = express.Router();

// Middlewares
router.use(passport.initialize())
router.use(passport.session())

require('../config/passportConfig')(passport)

// Endpoinst

router.post("/register", async (req, res) => {
    try {
      const existingUser = await User.findOne({ username: req.body.username });
  
      if (existingUser) {
        return res.status(409).json({ error: "Username Already Exists" });
      }
  
      const salt = bcrypt.genSaltSync(10);
      const hashedPassword = bcrypt.hashSync(req.body.password, salt);
  
      const newUser = new User({
        username: req.body.username,
        email: req.body.email,
        password: hashedPassword,
        name: req.body.name
      });
  
      await newUser.save();
  
      return res.status(200).json({ message: "User registered successfully" });
    } catch (error) {
      console.error("Failed to register user", error);
      return res.status(500).json({ error: "Failed to register user" });
    }
  });  

router.post("/login", (req, res, next)=>{
    passport.authenticate("local", (err, user, info)=>{
        if(err) {
            return res.status(500).json({ error: "Failed to login user" });
        }

        if (!user) {res.status(401).json({error:info})}

        req.logIn( user, (err) => {
            if(err) {
                return res.status(500).json({ error: "Failed to login user" });
            }
            res.status(200).json({ message: "User logged in successfully"})
        })
    })(req, res, next)
})

router.get("/logout", (req, res) => {
    req.logOut((err) => {
        if(err) {
            return res.status(500).json({ error: "Failed to logout user" });
        }
        
        res.status(200).json({message: "User logged out successfully"});
    });
  });


module.exports = router;
