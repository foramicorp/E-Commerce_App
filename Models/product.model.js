// IMPORTING REQUIREMENTS
const mongoose = require('mongoose');

// PRODUCT SCHEMA
const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    category: {
       type: mongoose.Schema.Types.ObjectId,
       ref: 'Category'
    },
    addedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }
});

// PRODUCT MODEL 
const Product = mongoose.model('Product', productSchema);

// EXPORTING PRODUCT MODEL
module.exports = Product;