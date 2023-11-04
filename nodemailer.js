const nodemailer = require('nodemailer');
const config = require('./config/config');


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

module.exports = transporter;