const mongoose = require('mongoose');
const express = require('express')
const cors = require('cors');
const passport = require("passport");
const passportLocal = require("passport-local").Strategy
const cookieParser = require("cookie-parser");
const bcrypt = require("bcryptjs");
const session = require("express-session");
const bodyParser = require("body-parser");
const User = require('./user')

require('dotenv').config()


mongoose.connect(process.env.DATABASE_URI, {
    useNewUrlParser: true,
    UseUnifiedTopology: true
}).then(
    () => {console.log("mongoose connected to database")},
    (error) => {console.log("Mongoose Connection failed: "+error)}
)


const app = express();

//middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cors({
    origin: "http://localhost:3000", //next js app
    credentials: true
}))
app.use(
session({
    secret: "secretcode",
    resave: true,
    saveUninitialized: true
}))
app.use(cookieParser("secretcode"))
app.use(passport.initialize())
app.use(passport.session())
require('./passportConfig')(passport)


//routes
app.post("/login", (req,res, next)=>{
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

app.post("/register", async (req,res)=>{
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

app.get("/account", (req,res)=>{ 
    res.send(req.user)
})

//Start Server
app.listen(4000, ()=>{
    console.log("server started on port 4000")
})