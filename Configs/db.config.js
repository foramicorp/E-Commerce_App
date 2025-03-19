// IMPORTING REQUIREMENTS
const mongoose = require('mongoose');
require('dotenv').config();

// FUNCTION TO CONNECT TO THE DATABASE
const dbConnect = async (req , res ) => {
    await mongoose.connect(process.env.DB_URL);
    console.log('Connected to MongoDB');
}

// EXPORTING THE FUNCTION
module.exports = dbConnect;