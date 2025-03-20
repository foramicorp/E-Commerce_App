// IMPORTING REQUIREMENTS
const mongoose = require("mongoose");

// CATEGORY SCHEMA
const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
});

// CATEGORY MODELS
const Category = mongoose.model("Category" , categorySchema);

// EXPORTING CATEGORY MODEL
module.exports = Category;