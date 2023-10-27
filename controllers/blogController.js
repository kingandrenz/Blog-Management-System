const Blog = require("../models/createPostModel");

const loadBlog = async (req, res) => {
    try {
        const blogs = await Blog.find().sort({ createdAt: -1 });
        res.render("blog", { blogs });
    } catch (err) {
        console.log(err);
    }

};

const loadBlogById = async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);
        res.render("blogDetails", { blog });
    } catch (err) {
        console.log(err);
    }
}

module.exports = {
    loadBlog,
    loadBlogById,
};