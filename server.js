const express = require('express')
const cors = require('cors');
const bodyParser = require("body-parser");
const session = require("express-session");
const cookieParser = require("cookie-parser");
require('dotenv').config()
require('./config/db');


const app = express();

//middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cors({
    origin: "http://localhost:3000", //next js app
    credentials: true,
    methods: ["GET", "POST"], // Add the necessary methods used in your API
    allowedHeaders: ["Content-Type", "credentials"], // Add the necessary headers used in your API
}))
app.use(cookieParser("secretcode"))
app.use(
    session({
        secret: "secretcode",
        resave: true,
        secure: false,
        saveUninitialized: true,
    }))

// Routers
const authRoutes = require('./routes/auth');
app.use('/auth', authRoutes);

// routes
app.get("/test", (req, res)=>{
    res.json("works")
})

//Start Server
app.listen(4000, ()=>{
    console.log("server started on port 4000")
})