const Blog = require("../models/createPostModel");
const Settings = require("../models/settingsModel");
const { ObjectId } = require('mongoose').Types;
 //const { ObjectId } = require('mongodb');
const transporter = require('../nodemailer');
const config = require('../config/config');

 const sendCommentEmail = async (name, email, comment, blog_id) => {
    
        try {
            const mailOptions = {
                from: 'Gistflex Blog',
                to: email,
                subject: 'New comment',
                html: `
                    <p>Hi ${name},</p>
                    <p>` +name+`, commentend on your blog:</p>
                    <p>${comment}</p>
                    <a href="${config.domain}/blogs/${blog_id}">View blog</a>
                    <!-- <a> href="${process.env.APP_URL}/blogs/${blog_id}">View blog</a> -->
                    <p>Thank you</p>   
                    `
            }
        
            transporter.sendMail(mailOptions, (err, info) => {
                if (err) {
                    console.log(err);
                } else {
                    console.log('Email sent: ' + info.response);
                }
            });

        } catch (err) {
            console.log(err);
        }
    };


    const loadBlog = async (req, res) => {
        try {
            const settings = await Settings.findOne({});
            // let limit = settings ? settings.post_limit : 0; // Check if settings is not null
            let limit = settings.post_limit;
            const blogs = await Blog.find().sort({ createdAt: -1 }).limit(limit);
            res.render("blog", { 
                blogs,
                postLimit: limit 
            });
        } catch (err) {
            console.error(err);
            // Handle the error appropriately, such as sending an error response to the client
            res.status(500).send({ success: false, message: 'Internal Server Error' });
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

        let comment_id = new ObjectId();
        let _id = comment_id;
        const blog = await Blog.findByIdAndUpdate(blog_id, {
            $push: {
                comments: {
                    _id,
                    username,
                    email,
                    comment
                }
            }
        });

        res.status(200).send({success: true, message: 'Comment posted successfully', _id: comment_id });
        //res.redirect(`/blogs/${blog_id}`);
    } catch (err) {
        console.log(err);
        res.status(200).send({success: false, message: err.message});
    }
}

const postReply = async (req, res) => {
    try {
        let reply_id = new ObjectId();

        await Blog.updateOne({
            "_id": new ObjectId(req.body.blog_id),
            "comments._id": new ObjectId(req.body.comment_id)
        }, {
            $push: {
                "comments.$.replies": {
                    _id: reply_id,
                    username: req.body.username,
                    reply: req.body.reply
                }
            }
        });

        sendCommentEmail(req.body.username, req.body.comment_email, req.body.reply, req.body.blog_id);
        res.status(200).send({ success: true, message: 'Reply posted successfully', _id: reply_id });

    } catch (err) {
        console.log(err);
    }
}

// const getNextPosts = async (req, res) => {
//     try {
        
//         const limit = settings ? settings.post_limit : 0; // Check if settings is not null
//         const blogs = await Blog.find().sort({ createdAt: -1 }).skip(parseInt(req.params.start)).limit(parseInt(req.params.limit));
//         res.send(blogs);
//     } catch (err) {
//         console.error(err);
//         // Handle the error appropriately, such as sending an error response to the client
//         res.status(500).send({ success: false, message: 'Internal Server Error' });
//     }

// }

const getNextPosts = async (req, res) => {
    try {
        
        const blogs = await Blog.find().skip(req.params.start).limit(req.params.limit).sort({ createdAt: -1 });
        res.send(blogs);
    } catch (err) {
        console.error(err);
        // Handle the error appropriately, such as sending an error response to the client
        res.status(500).send({ success: false, message: 'Internal Server Error' });
    }
}

module.exports = {
    loadBlog,
    loadBlogById,
    postComment,
    postReply,
    getNextPosts,
};