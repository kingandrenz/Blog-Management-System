const e = require('express');
const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const config = require('../config/config');
const nodemailer = require('nodemailer');
const randomstring = require('randomstring');

// Send email: nodemailer
const sendResetPasswordEmail = (name, email, resetLink) => {
    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false, // SSL
        requireTLS: true,
        auth: {
            user: config.emailUser,
            pass: config.emailPassword
        }
    });

    const mailOptions = {
        from: config.emailUser,
        to: email,
        subject: 'Reset password',
        html: `
            <p>Hi ${name},</p>
            <p>You have requested a password reset. Click the following link to reset your password:</p>
            <a href="${resetLink}">Reset Password</a>
            <p>If you didn't request this, please ignore this email.</p>
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

};


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

const forgotPassword = async (req, res) => {
    try {
        res.render('forgot-password');
    } catch (err) {
        console.log(err);
    }
}

const forgotPasswordpost = async (req, res) => {
    try {
        const { email } = req.body;
        const userData = await User.findOne({ email });

        if (userData) {
            const token = randomstring.generate();
            await User.updateOne({ email }, { $set: { token } });

            const resetLink = `${process.env.APP_URL}/reset-password/${token}`;
            sendResetPasswordEmail(userData.name, userData.email, resetLink);
            res.render('forgot-password', { message: 'Please check your email to reset password' });
            
        } else {
            console.log('Email not found');
            res.render('forgot-password', { message: 'Email not found' });
        }

    } catch (err) {
        console.log(err);
    }  
};

/* const resetPassword = async (req, res) => {
    try {
        const { token } = req.params;
        const userToken = await User.findOne({ token });

        if (userToken) {
            res.render('reset-password', { token });
        } else {
            res.render('404', { message: 'Invalid token' });
        }

    } catch (err) {
        console.log(err);
    } */

    const resetPassword = async (req, res) => {
        const { token } = req.params;
        try {
            res.render('reset-password', { token, message: '' });

        } catch (err) {
            console.log(err);
        }

    };

    const postResetPassword = async (req, res) => {
        try {
            const { token, password, confirmPassword } = req.body;
    
            // Check if the password and confirmPassword match
            if (password !== confirmPassword) {
                return res.render('reset-password', { message: 'Passwords do not match' });
            }
    
            // Find the user with the provided token
            const user = await User.findOne({ token });
    
            if (!user) {
                res.render('404', { message: 'Invalid token' });
            }
    
            // Hash the new password
            const hashedPassword = await bcrypt.hash(password, 10);
    
            // Update the user's password and remove the token
            await User.updateOne(
                { token },
                { $set: { password: hashedPassword, token: null } }
            );
    
            res.redirect('/login'); // Redirect the user to the login page after successful password reset
        } catch (err) {
            console.log(err);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    };
    
    const error404 = async (req, res) => {
        try {
            res.render('404');
        } catch (err) {
            console.log(err);
        }
    };



module.exports = {
    loadLogin,
    verifyLogin,
    profile,
    logout,
    forgotPassword,
    forgotPasswordpost,
    resetPassword,
    postResetPassword,
    error404,
}