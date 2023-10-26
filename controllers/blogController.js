const Blog = require("../models/createPostModel");

const loadBlog = async (req, res) => {
    const blogs = await Blog.find(req.params.id);
    res.render("blog", { blogs });

};

module.exports = {
    loadBlog,
};