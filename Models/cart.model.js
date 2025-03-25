// IMPORTING REQUIREMENTS
const mongoose = require('mongoose');

// CART SCHEMA
const cartSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    items: [{
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true,
        },
        name: {
            type: String
        },
        quantity: {
            type: Number,
            required: true
        },
        price: {
            type: Number,
            required: true
        }
    }],
    totalPrice: {
        type: Number,
        required: true
    }
});

// CART MODEL
const Cart = mongoose.model('Cart', cartSchema);

// EXPORTING THE CART MODEL
module.exports = Cart;