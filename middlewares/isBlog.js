const blogSetting = require('../models/blogSettingsModel.');

const isBlog = async (req, res, next) => {
    try{
        const blogSettings = await blogSetting.find({});
        if (blogSettings.length === 0 && req.originalUrl !== '/blog-setup') {
            res.redirect('/blog-setup');
        } else {
            next();
        }

    } catch (err) {
        console.log(err.message);
    }
}

module.exports = {
    isBlog,
}