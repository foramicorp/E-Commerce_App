// IMPORTING REQUIREMENTS
const Router = require('express');
const { getAllUser,
    getUserById,
    signupUser,
    loginUser,
    refreshToken,
    forgotPassword,
    resetPassword,
    logoutUser,
    updateUser,
    restoreUser,
    deleteUser } = require('../Controllers/user.controller');
const isToken = require('../Middlewares/auth.middleware');

// INITIALIZATION
const userRouter = Router();

// USER ROUTING
userRouter.get('/get-alluser', getAllUser);
userRouter.get('/get-userbyid', isToken, getUserById);
userRouter.post('/signup-user', signupUser);
userRouter.post('/login-user', loginUser);
userRouter.post('/refresh-token', refreshToken);
userRouter.post('/forgot-password', forgotPassword);
userRouter.post('/reset-password', resetPassword);
userRouter.post('/logout-user', isToken, logoutUser);
userRouter.put('/update-user', isToken, updateUser);
userRouter.put('/delete-user', isToken, deleteUser);
userRouter.put('/restore-user', restoreUser);

// EXPORTING USER ROUTER
module.exports = userRouter;
