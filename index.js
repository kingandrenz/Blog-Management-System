const express = require('express');
const mongoose = require('mongoose');
const isBlog = require("./middlewares/isBlog");
//require routes
const adminRoute = require('./routes/adminRoute');
const userRoute = require('./routes/userRoute');


const app = express();


dbURI = 'mongodb+srv://Andrenz:Akaka1na5@flextech-blog.m0d8jso.mongodb.net/BMS?retryWrites=true&w=majority';

mongoose.connect(dbURI);


// middleware
// Use express.urlencoded middleware to handle URL-encoded form data instead of using body-parser
//app.use(express.urlencoded({ extended: true }));

app.use(isBlog.isBlog);
// for admin routes
app.use('/', adminRoute);

// for user routes
app.use('/', userRoute);

app.listen(3000, () => {
    console.log("app is listening on port 3000");
});
