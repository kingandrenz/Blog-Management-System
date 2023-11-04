const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const isBlog = require("./middlewares/isBlog");
//require routes
const adminRoute = require('./routes/adminRoute');
const userRoute = require('./routes/userRoute');
const blogRoute = require('./routes/blogRoutes');
require('dotenv').config();


const app = express();

const Port = process.env.PORT || 3000


dbURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/blog';

mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true, })
  .then(result => app.listen(Port, () => console.log(`listening on ${Port}`)))
  .catch(err => console.log(err));


// middleware
// Use express.urlencoded middleware to handle URL-encoded form data instead of using body-parser
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

app.use(isBlog.isBlog);
// for admin routes
app.use('/', adminRoute);

// for user routes
app.use('/', userRoute);

//for blog routes
app.use('/', blogRoute);
