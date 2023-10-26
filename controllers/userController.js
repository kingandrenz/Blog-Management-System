const e = require('express');
const User = require('../models/userModel');
const bcrypt = require('bcrypt');

const loadLogin = async (req, res) => {
    res.setHeader('Cache-Control', 'no-store'); // Disable caching
    try {
        res.render('login');
    } catch (err) {
        console.log(err);
    }
};

const verifyLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        const userData = await User.findOne({ email });
        if (userData) {
            const isMatch = await bcrypt.compare(password, userData.password);
            if (isMatch) {
                req.session.user_id = userData._id; // Store user data in the session
                req.session.is_admin = userData.is_admin; // Store user data in the session
                if (userData.is_admin == 1) {
                    res.redirect('/dashboard');
                } else {
                    res.redirect('/profile');
                }
            } else {
                console.log('Invalid email or password');
                res.render('login', { message: 'Invalid email or password' });
            }
        } else {
            console.log('Invalid email or password');
            res.render('login', { message: 'Invalid email or password' });
        }
    } catch (err) {
        console.log(err);
    }
};


const profile = async (req, res) => {
    try {
        res.render('profile');
    } catch (err) {
        console.log(err);
    }
}

const logout = async (req, res) => {
    try {
        req.session.destroy(err => {
            if (err) {
                console.log(err);
            }
            res.redirect('/login');
        });
    } catch (err) {
        console.log(err);
    }
};

module.exports = {
    loadLogin,
    verifyLogin,
    profile,
    logout
}