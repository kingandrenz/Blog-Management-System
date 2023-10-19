const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema =  mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    is_admin: {
        type: String,
        required: true
    },
    token: {
        type: String,
        default: ''
    }
})

UserSchema.pre('save', function (next) {
    const user = this; // 'this' refers to the current user being saved
    if (!user.isModified('password')) {
        // If the password field hasn't changed, we don't need to rehash it
        return next();
    }
    // Hash the password here (e.g., using bcrypt)
    bcrypt.hash(user.password, 10, (err, hash) => {
        if (err) {
            return next(err);
        }
        user.password = hash;
        next();
    });
});
// Add a method to the user schema to compare passwords
UserSchema.methods.comparePassword = function (candidatePassword) {
    const user = this;
    return new Promise((resolve, reject) => {
        // Use bcrypt.compare to compare the candidate password to the user's password
        bcrypt.compare(candidatePassword, user.password, (err, isMatch) => {
            if (err) {
                return reject(err);
            }
            if (!isMatch) {
                return reject(false);
            }
            resolve(true);
        });
    });
};

module.exports = mongoose.model('User', userSchema );