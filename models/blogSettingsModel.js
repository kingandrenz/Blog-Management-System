const mongoose = require('mongoose');

const blogSettingSchema = new mongoose.Schema({
    blog_title: {
        type: String,
        required: true
    },
    blog_logo: {
        type: String,
        required: true
    },
    blog_description: {
        type: String,
        required: true
    }
})

const BlogSetting = mongoose.model('BlogSetting', blogSettingSchema );

module.exports = BlogSetting; 