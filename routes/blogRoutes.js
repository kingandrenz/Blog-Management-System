const express = require('express');
const blogController = require('../controllers/blogController');
const blog_route = express();



//set view engine
blog_route.set('view engine', 'ejs');
blog_route.set('views', './views');

blog_route.use(express.static('public'));

//blog routes
blog_route.get('/', (req, res) => {
    res.redirect('/blogs');
  });

blog_route.get('/blogs', blogController.loadBlog);

blog_route.get('/blogs/:id', blogController.loadBlogById);

blog_route.post('/comment', blogController.postComment);
blog_route.post('/reply', blogController.postReply);

blog_route.get('/get-posts/:start/:limit', blogController.getNextPosts);

module.exports = blog_route;