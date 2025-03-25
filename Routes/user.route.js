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
const isAdmin = require('../Middlewares/role.middleware');

// INITIALIZATION
const userRouter = Router();

// USER ROUTING
userRouter.get('/get-alluser', isToken, isAdmin, getAllUser);
userRouter.get('/get-userbyid', isToken, getUserById);
userRouter.post('/signup-user', signupUser);
userRouter.post('/login-user', loginUser);
userRouter.post('/refresh-token', refreshToken);
userRouter.post('/forgot-password', isToken, forgotPassword);
userRouter.post('/reset-password', isToken, resetPassword);
userRouter.post('/logout-user', isToken, logoutUser);
userRouter.put('/update-user', isToken, updateUser);
userRouter.put('/delete-user', isToken, deleteUser);
userRouter.put('/restore-user', restoreUser);

// EXPORTING USER ROUTER
module.exports = userRouter;
