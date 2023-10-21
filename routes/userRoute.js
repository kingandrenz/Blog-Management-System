const express = require('express');
const user_route = express(); // Use express.Router() to create a router
const path = require('path');
// require express-session
const sessionSecret = require('../config/config').sessionSecret;
const session = require('express-session');

const user_controller = require('../controllers/userController');

// Middleware
user_route.use(express.urlencoded({ extended: true }));
//set view engine
user_route.set('view engine', 'ejs');
user_route.set('views', './views');
//user_route.use(express.static(path.join(__dirname, '../public')));
user_route.use(express.static('public'));

// express-session middleware
user_route.use(session({
    secret: sessionSecret,
    resave: false,
    saveUninitialized: true
}));

user_route.get('/login', user_controller.loadLogin);
user_route.post('/login', user_controller.verifyLogin);
user_route.get('/profile', user_controller.profile);

module.exports = user_route;