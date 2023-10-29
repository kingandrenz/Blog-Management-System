const express = require('express');
const user_route = express(); // Use express.Router() to create a router
const path = require('path');
// require express-session
const sessionSecret = require('../config/config').sessionSecret;
const session = require('express-session');

const user_controller = require('../controllers/userController');
const adminLoginAuth = require('../middlewares/adminLoginAuth');

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
    resave: true,
    saveUninitialized: true
}));

user_route.get('/login', adminLoginAuth.isLogout, user_controller.loadLogin);
user_route.post('/login', user_controller.verifyLogin);
user_route.get('/logout', adminLoginAuth.isLogin, user_controller.logout);
user_route.get('/profile', user_controller.profile);
user_route.get('/forgot-password', adminLoginAuth.isLogout, user_controller.forgotPassword);
user_route.post('/forgot-password', user_controller.forgotPasswordpost);
user_route.get('/reset-password/:token', adminLoginAuth.isLogout, user_controller.resetPassword);
user_route.post('/reset-password', user_controller.postResetPassword);
user_route.get('/404', user_controller.error404);

module.exports = user_route;