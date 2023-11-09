const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const isBlog = require("./middlewares/isBlog");
let http = require('http');
let { Server } = require('socket.io');

//require routes
const adminRoute = require('./routes/adminRoute');
const userRoute = require('./routes/userRoute');
const blogRoute = require('./routes/blogRoutes');
require('dotenv').config();

// create express app
const app = express();
const Port = process.env.PORT || 3000

// create server
let httpServer = http.createServer(app);
let io = new Server(httpServer, {});


dbURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/blog';

mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true, })
  // .then(result => app.listen(Port, () => console.log(`listening on ${Port}`)))
  .then(result => httpServer.listen(Port, () => console.log(`listening on ${Port}`)))
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

// socket.io
io.on('connection', (socket) => {
  console.log('User connected');
  socket.on('new_post', (formData) => {
    console.log(formData);
    socket.broadcast.emit('new_post', formData);

  });

  socket.on("new_comment", (comment) => {
    // console.log(comment);
    io.emit("new_comment", comment);
});

});
