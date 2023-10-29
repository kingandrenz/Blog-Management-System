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

const postComment = async (req, res) => {
    try {
        const { username, email, comment, blog_id } = req.body;
        const blog = await Blog.findByIdAndUpdate(blog_id, {
            $push: {
                comments: {
                    username,
                    email,
                    comment
                }
            }
        });

        res.status(200).send({success: true, message: 'Comment posted successfully'});
        //res.redirect(`/blogs/${blog_id}`);
    } catch (err) {
        console.log(err);
        res.status(200).send({success: false, message: err.message});
    }
}



module.exports = {
    loadBlog,
    loadBlogById,
    postComment
};