const express = require('express');
const admin_route = express.Router(); // Use express.Router() to create a router
const multer = require('multer');
const path = require('path');

const admin_controller = require('../controllers/adminController');

// Middleware
admin_route.use(express.urlencoded({ extended: true }));
//set view engine
admin_route.set('view engine', 'ejs');
admin_route.set('views', './views');
//admin_route.use(express.static(path.join(__dirname, '../public')));
admin_route.use(express.static('public'));

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

admin_route.get('/', admin_controller.login);
admin_route.get('/blogs', admin_controller.blogTwo);
admin_route.get('/blog-setup', admin_controller.blogSetup);
admin_route.post('/blog-setup', upload.single('blog_logo'), admin_controller.blogSetupSave);

module.exports = admin_route;
