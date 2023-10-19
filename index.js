const express = require('express');
const mongoose = require('mongoose');
const isBlog = require("./middlewares/isBlog");



const app = express();
const admin_route = require('./routes/adminRoute');

dbURI = 'mongodb://localhost:27017/BMS';

mongoose.connect(dbURI);


// middleware
// Use express.urlencoded middleware to handle URL-encoded form data instead of using body-parser
app.use(express.urlencoded({ extended: true }));

app.use(isBlog.isBlog);
// for admin routes
app.use('/', admin_route);

app.listen(3000, () => {
    console.log("app is listening on port 3000");
});
