// db.js
const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.DATABASE_URI, {
    dbName: 'my-skate-spots-db',
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(
    () => { console.log("mongoose connected to database"); },
    (error) => { console.log("Mongoose Connection failed: " + error); }
);
