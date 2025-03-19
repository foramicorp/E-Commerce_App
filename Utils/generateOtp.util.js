// GENERATE OTP FUNCTION
const generateOtp = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

// EXPORTING FUNCTION
module.exports = generateOtp;
