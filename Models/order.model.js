// IMPORTING REQUIREMENTS
const mongoose = require('mongoose');

// ORDER SCHEMA
const orderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    items: {
        type: [{
            productId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product'
            },
            quantity: Number
        }]
    },
    totalAmount: Number,
    status: {
        type: String,
        enum: ['Pending', 'Delivered']
    }
}, { timestamps: true });

// ORDER MODEL 
const Order = mongoose.model('Order', orderSchema);

// EXPORTING ORDER MODEL

module.exports = Order;