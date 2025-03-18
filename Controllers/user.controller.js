const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const cookies = require('cookie-parser');
const User = require('../Models/user.model');
const { generateAccessToken, generateRefreshToken } = require('../Utils/generateToken.util');


const signupUser = async (req , res ) => {
    try {

        const { name , email , password , number , address , role } = req.body;

        if(!name || !email || !password || !password || !number ||!address || !role ) {
            return res.status(400).json({ message: 'All fields are required :(' });
        };

        const user = await User.findOne({ name: name, email: email, password: password})
        if (user) {
            return res.status(400).json({ message: 'User already exists :(' });
        };

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({name, email, password : hashedPassword , number, address, role});
        await newUser.save();
        res.status(201).json({ message: 'User registered successfully :)' });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error Creating User :(' });

    }}

const getAllUser = async (req , res ) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error Getting Users :(' });
    }
}
const getUserById = async (req, res) => {
    try {

        // GETTING USER BY ID FROM THE DATABASE
        const user = await User.findById(req.user);
        console.log(user);

        if (!user) {
            return res.status(404).send("User not found");
        }
        res.json(user);

    } catch (error) {   
        console.error(error);
        res.status(500).send(error.message);

    }
}

const updateUser = async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.user, req.body, { new: true });
        if (!user) {
            return res.status(404).send("User not found");
        }
        res.json({ message: "User updated successfully" });

    } catch (error) {
        console.error(error);
        res.status(500).send(error.message);
        res.json({ message: "Login and try again " });
    }
}

const softDeleteUser = async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.userId , {isDeleted : true } );

        if (!user) {
            return res.status(404).send("User not found");
        }
        res.json({ message: "User deleted successfully" });

    } catch (error) {
        console.error(error);
        res.status(500).send(error.message);

    }
}

const hardDeleteUser = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.userId);

        if (!user) {
            return res.status(404).send("User not found");
        }
        res.json({ message: "User deleted successfully" });

    } catch (error) {
        console.error(error);
        res.status(500).send(error.message);
    }
}
const restoreUser = async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.userId, { isDeleted: false }, { new: true });
        if (!user) {
            return res.status(404).send("User not found");
        }
        res.json({ message: "User restored successfully" });

    } catch (error) {
        console.error(error);
        res.status(500).send(error.message);
    }
};
const loginUser = async (req , res ) => {
    try {

        const {email , password } = req.body ;
        if(!email || !password ) {
            return res.status(400).json({ message: 'All fields are required :(' });
        };

        const user = await User.findOne({ email: email });
        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password :(' });
        };

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid email or password :(' });
        };

        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);

        user.refreshToken = refreshToken;
        await user.save();

        console.log("User After Saving Refresh Token:", await User.findOne({ email }));

        res.cookie('refreshToken', refreshToken, { httpOnly: true, secure:true });
        res.json({ message: 'User logged in successfully :)', accessToken });
        
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error Logging User In :(' , error });
    }
}

const refreshToken = async (req, res) => {
    try {
        console.log("Cookies Received:", req.cookies);

        
        if (!req.cookies || !req.cookies.refreshToken) {
            return res.status(401).json({ message: "No refresh token found" });
        }

        const refreshToken = req.cookies.refreshToken;
        console.log("Received Refresh Token:", refreshToken);

        const user = await User.findOne({ refreshToken });
        console.log("User Found in DB:", user);

        if (!user) {
            return res.status(403).json({ message: "Invalid refresh token (User not found)" });
        }


        jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET_KEY, (err, decoded) => {
            if (err) {
                console.error("JWT Verification Error:", err);
                return res.status(403).json({ message: "Invalid Refresh Token" });
            }

            const newAccessToken = generateAccessToken(user);
            res.json({ message: "Token refreshed", accessToken: newAccessToken });
        });

    } catch (error) {
        console.error("Server Error:", error);
        res.status(500).json({ message: "Server Error" });
    }
};


const forgotPassword = async (req, res) => {
    const { email } = req.body;
    
    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: "User not found" });

        
        const otp = generateOtp();
        user.otp = otp;
        user.otpExpires = Date.now() + 10 * 60 * 1000; 
        await user.save();

        await sendMail(email, "Password Reset OTP", `Your OTP is ${otp}. It expires in 10 minutes.`);

        res.json({ message: "OTP sent to your email" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}
const resetPassword = async (req, res) => {
    const { email, otp, newPassword } = req.body;
    try {
        const user = await User.findOne({ email, otp });
        if (!user || user.otpExpires < Date.now()) {
            return res.status(400).json({ message: "Invalid or expired OTP" });
        }

        user.password = await bcrypt.hash(newPassword, 10);
        user.otp = null;
        user.otpExpires = null;
        await user.save();

        await sendMail(
            user.email,
            "Password Reset Confirmation",
            `Hello ${user.name},\n\nYour password has been successfully reset. If you did not make this change, please contact support immediately.\n\nThank you!`
        );

        res.json({ message: "Password reset successful. A confirmation email has been sent." });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const logoutUser = async (req, res) => {
    try {
    
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) {
            return res.status(400).json({ message: "No refresh token provided" });
        }

        const user = await User.findOne({ refreshToken });
        console.log("User found for logout:", user);

        if (!user) {
            return res.status(400).json({ message: "Invalid refresh token (User not found)" });
        }

        user.refreshToken = null;
        await user.save();

        res.clearCookie("refreshToken", { httpOnly: true, secure: true });
        res.clearCookie("userId", { httpOnly: true, secure: true, sameSite: "Strict" });

        res.json({ message: "Logged out successfully" });

    } catch (error) {
        console.error("Logout Error:", error);
        res.status(500).json({ message: "Server error" });
    }
}

module.exports = {
    signupUser,
    getAllUser,
    getUserById,
    updateUser,
    softDeleteUser,
    hardDeleteUser,
    restoreUser,
    loginUser,
    refreshToken,
    forgotPassword,
    resetPassword,
    logoutUser,
}