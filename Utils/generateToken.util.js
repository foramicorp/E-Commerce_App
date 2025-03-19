// IMPORTING REQUIREMENTS
const jwt = require("jsonwebtoken");
require("dotenv").config();

// FUNCTION TO GENERATE ACCESS TOKENS
const generateAccessToken = (user) => {
    return jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET_KEY, { expiresIn: "1h" });
}

// FUNCTION TO GENERATE REFRESH TOKENS
const generateRefreshToken = (user) => {
    const refreshToken = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_REFRESH_SECRET_KEY, { expiresIn: "7d" });
    return refreshToken;
}

// EXPORTING THE FUNCTIONS 
module.exports = {
    generateAccessToken,
    generateRefreshToken
}