const BlogSetting = require('../models/blogSettingsModel');
const User = require('../models/userModel');
const bcrypt = require('bcrypt');


const login = async (req, res) => {

    res.render('login');
}

const blogSetup = async (req, res) => {
    try {
        const blogSettings = await BlogSetting.find({});
        if (blogSettings.length > 0) {
            res.redirect('/login');
        } else {
            res.render('blogSetup');
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
            res.render('blogSetup', { message: 'Blog not setup properly!' });
        }

    } catch (err) {
        console.log(err.message);
    }
}



const dashboard = async (req, res) => {
    try {
        res.render('admin/dashboard');
    } catch (err) {
        console.log(err.message);
    }
}
 

module.exports = {
    login,
    blogSetupSave,
    blogSetup,
    dashboard
}

