const mongoose = require('mongoose');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    }
}, { timestamps: true });

/* Simple hash using Node's built-in crypto (no extra deps) */
userSchema.statics.hashPassword = function (password) {
    return crypto.createHash('sha256').update(password).digest('hex');
};

userSchema.statics.verifyPassword = function (plain, hashed) {
    return crypto.createHash('sha256').update(plain).digest('hex') === hashed;
};

module.exports = mongoose.model('User', userSchema);
