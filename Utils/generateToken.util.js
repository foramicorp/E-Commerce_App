
const jwt = require("jsonwebtoken");
require("dotenv").config();

const generateAccessToken = (user) => {
    return jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET_KEY, { expiresIn: "1h" });
}

const generateRefreshToken = (user) => {
    const refreshToken = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_REFRESH_SECRET_KEY, { expiresIn: "7d" });
    return refreshToken;
}

module.exports = {
    generateAccessToken,
    generateRefreshToken
}