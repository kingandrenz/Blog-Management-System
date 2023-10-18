const express = require('express');
const admin_route = express.Router();

const admin_controller = require('../controllers/adminController');

admin_route.get('/', admin_controller.blogOne)
admin_route.get('/blogs', admin_controller.blogTwo);
admin_route.get('/blog-setup', admin_controller.blogSetup);

module.exports = admin_route;