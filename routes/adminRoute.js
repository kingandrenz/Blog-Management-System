const express = require('express');
const admin_route = express(); // Use express.Router() to create a router
const session = require('express-session');
const multer = require('multer');
const path = require('path');

const admin_controller = require('../controllers/adminController');
const sessionSecret = require('../config/config').sessionSecret;
const adminLoginAuth = require('../middlewares/adminLoginAuth');

// Middleware
admin_route.use(express.urlencoded({ extended: true }));
//set view engine
admin_route.set('view engine', 'ejs');
admin_route.set('views', './views');
//admin_route.use(express.static(path.join(__dirname, '../public')));
admin_route.use(express.static('public'));

// express-session middleware
admin_route.use(session({
    secret: sessionSecret,
    resave: true,
    saveUninitialized: true
}));


// Multer photo upload settings
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../public/images'));
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage });

admin_route.get('/login', admin_controller.login);
//admin_route.get('/blogs', admin_controller.blogTwo);
admin_route.get('/blog-setup', admin_controller.blogSetup);
admin_route.post('/blog-setup', upload.single('blog_logo'), admin_controller.blogSetupSave);
admin_route.get('/dashboard', adminLoginAuth.isLogin, admin_controller.dashboard);
admin_route.get('/create-post', adminLoginAuth.isLogin, admin_controller.createPostForm);
admin_route.post('/create-post', adminLoginAuth.isLogin, admin_controller.createPost);

module.exports = admin_route;
