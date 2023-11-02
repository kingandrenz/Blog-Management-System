const BlogSetting = require('../models/blogSettingsModel');
const User = require('../models/userModel');
const Post = require('../models/createPostModel');
const bcrypt = require('bcrypt');


const login = async (req, res) => {

    res.render('login', { title: 'Login' });
}

const blogSetup = async (req, res) => {
    try {
        const blogSettings = await BlogSetting.find({});
        if (blogSettings.length > 0) {
            res.redirect('/login');
        } else {
            res.render('blogSetup', { title: 'Blog Setup'});
        }

    } catch (err) {
        console.log(err.message);
    }
}

const blogSetupSave = async (req, res) => {
    try {

        const blogSetting = new BlogSetting({
            ...req.body, // Spread the properties from req.body
            blog_logo: req.file.filename // Add the blog_logo property separately
        });
        await blogSetting.save();
        
        const user = new User({
            ...req.body, // Spread the properties from req.body
            is_admin: 1
        });
        await user.save();
        
        if (user) {
            res.redirect('/login');
        } else {
            res.render('blogSetup', { message: 'Blog not setup properly!', title: 'Login' });
        }

    } catch (err) {
        console.log(err.message);
    }
}



const dashboard = async (req, res) => {
    try {
        res.render('admin/dashboard', {title: 'BMS Admin'});
    } catch (err) {
        console.log(err.message);
    }
}

const createPostForm = async (req, res) => {
    try {
        res.render('createPost', {title: 'Create Post'});
    } catch (err) {
        console.log(err.message);
    }
}

const createPost = async (req, res) => {
    try {
        let image = '';
        if (req.body.image !== undefined) {
            image = req.body.image;
        }
        
        const post = new Post({
            ...req.body, // Spread the properties from req.body
            //post_image: req.file.filename // Add the blog_logo property separately
        });
        const newPost = await post.save();

        res.render('createPost', {message: 'Post created successfully!', title: 'BMS Admin'});
    } catch (err) {
        console.log(err.message);
    };
}
 
const uploadPostImage = async (req, res) => {
    try {
        let imagePath = '/images/';
        imagePath += req.file.filename;
        res.send({success: true, message: 'Post Image uploaded successfully!', image_path: imagePath});
    } catch (err) {
        res.send({success: false, message: err.message});
    }
}

module.exports = {
    login,
    blogSetupSave,
    blogSetup,
    dashboard,
    createPostForm,
    createPost,
    uploadPostImage,
}