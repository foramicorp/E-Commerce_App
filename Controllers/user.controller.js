// IMPPORTING REQUIREMENTS
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const cookies = require('cookie-parser');
const User = require('../Models/user.model');
const { generateAccessToken, generateRefreshToken } = require('../Utils/generateToken.util');
const generateOtp = require('../Utils/generateOtp.util');
const sendMail = require('../Configs/mailer.config');

// SIGNUP USER CONTROLLER
const signupUser = async (req, res) => {
    try {

        // GETTING DATA FROM REQ.BODY
        const { name, email, password, number, address, role } = req.body;

        // VALIDATING DATA
        if (!name || !email || !password || !password || !number || !address || !role) {
            return res.status(400).json({ message: 'All fields are required :(' });
        };

        // CHECKING IF USER ALREADY EXISTS IN THE DATABASE
        const user = await User.findOne({ name: name, email: email, password: password })
        if (user) {
            return res.status(400).json({ message: 'User already exists :(' });
        };

        // HASHING THE PASSWORD
        const hashedPassword = await bcrypt.hash(password, 10);

        // CREATING NEW USER AND SAVING TO THE DB
        const newUser = new User({ name, email, password: hashedPassword, number, address, role });
        await newUser.save();
        res.status(201).json({ message: 'User registered successfully :)' });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error Creating User :(' });

    }
}

// GET ALL USER CONTROLLER
const getAllUser = async (req, res) => {
    try {
        const users = await User.find().select('-password -otp -__v -updatedAt -isDeleted')
        ;
        res.json(users);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error Getting Users :(' });
    }
}

// GET USER BY ID CONTROLLER
const getUserById = async (req, res) => {
    try {

        // GETTING USER BY ID FROM THE DATABASE
        const user = await User.findById(req.user).select('-password -otp -__v -updatedAt -isDeleted')

        // const users = await User.find({isDeleted:false}).select("-otp")

        // for(const user of users) {
        //      await User.updateOne(
        //         {
        //             _id:user._id
        //         },
        //         {
        //             $set:{
        //                 "isDeleted":false
        //             }
        //         }
        //     )
            

        // }

        // const userIds = users.map((i)=>i._id)

        // console.log("userIds", userIds);
        





        // await User.updateMany(
        //     {
        //         _id:{$in:userIds}
        //     },
        //     {
        //         $set:{
        //             "isDeleted":false
        //         }
        //     }
        // )









        // const user = await User.updateOne(
        //     {
        //         _id:req.user
        //     },
        //     {
        //         $set:{
        //             "isDeleted":true
        //         }
        //     }
        // )

        // const user = await User.deleteOne({_id:req.user})



        if (!user) {
            return res.status(404).send("User not found");
        }
        res.status(200).json({
            success:true,
            data:user
        })

    } catch (error) {
        console.error(error);
        res.status(500).send(error.message);

    }
}

// UPDATE USER CONTROLLER
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

// DELETE USER CONTROLLER
const deleteUser = async (req, res) => {
    try {
        const userId = req.user.id
        const user = await User.findByIdAndUpdate(userId, { isDeleted: true });

        if (!user) {
            return res.status(404).send("User not found");
        }
        res.json({ message: "User deleted successfully" });

    } catch (error) {
        console.error(error);
        res.status(500).send(error.message);

    }
}
// RESTORE DELETED USER CONTROLLER
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

// LOGIN USER CONTROLLER
const loginUser = async (req, res) => {
    try {

        // GETTING DATA FROM REQ.BODY
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: 'All fields are required :(' });
        };

        // CHECKING IF USER EXISTS IN THE DATABASE
        const user = await User.findOne({ email: email });
        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password :(' });
        };

        // CHECKING IF PASSWORD IS CORRECT
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid email or password :(' });
        };

        // GENERATING ACCESS TOKEN AND REFRESH TOKEN
        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);

        // UPDATING USER WITH TOKEN AND SAVING TOKEN TO DB 
        user.refreshToken = refreshToken;

        res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: true });
        res.json({ message: 'User logged in successfully :)', accessToken });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error Logging User In :(', error });
    }
}

// REFRESH TOKEN CONTROLLER
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

// FORGOT PASSWORD CONTROLLER
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

// RESET PASSWORD CONTROLLER
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

// LOGOUT USER CONTROLLER
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

// EXPORTING CONTROLLERS
module.exports = {
    signupUser,
    getAllUser,
    getUserById,
    updateUser,
    deleteUser,
    restoreUser,
    loginUser,
    refreshToken,
    forgotPassword,
    resetPassword,
    logoutUser,
}