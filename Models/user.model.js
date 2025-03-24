// IMPORTING REQUIREMENTS
const mongoose = require('mongoose');

// USER SCHEMA
const userSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    number: {
        type: Number,
        required: true,
        unique: true
    },
    address: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true,
        enum: ['admin', 'user'],
        default: 'user'
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
});

// USER MODEL
const User = mongoose.model('User', userSchema);

// EXPORTING USER MODEL
module.exports = User;