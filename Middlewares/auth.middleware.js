// IMPORTING REQUIREMENTS
const jwt = require("jsonwebtoken");
const cookies = require("cookie-parser");
const User = require("../Models/user.model");
require("dotenv").config();

// MIDDLEWARE FUNCTION TO CHECK IF USER IS AUTHENTICATED AND HAS VALID JWT TOKENS
const isToken = async (req, res, next) => {

    const token = req.cookies.refreshToken
    if (!token) return res.status(401).json({ message: "No token, authorization denied" });
    try {
        const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET_KEY);
        req.user = await User.findById(decoded.id);
        next();
    } catch (err) {
        res.status(401).json({ message: "Invalid token" });
    }
};

// EXPORTING THE MIDDLEWARE FUNCTION
module.exports = isToken;
