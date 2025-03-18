const mongoose = require('mongoose');
require('dotenv').config();

const dbConnect = async (req , res ) => {
    await mongoose.connect(process.env.DB_URL);
    console.log('Connected to MongoDB');
}

module.exports = dbConnect;