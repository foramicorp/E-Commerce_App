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
    softDeleteUser,
    restoreUser,
    hardDeleteUser } = require('../Controllers/user.controller');

const isToken = require('../Middlewares/auth.middleware');

const userRouter = Router();

userRouter.get('/get-alluser', getAllUser);
userRouter.get('/get-userbyid', isToken, getUserById);
userRouter.post('/signup-user', signupUser);
userRouter.post('/login-user', loginUser);
userRouter.post('/refresh-token', refreshToken);
userRouter.post('/forgot-password', forgotPassword);
userRouter.post('/reset-password', resetPassword);
userRouter.post('/logout-user',  logoutUser);
userRouter.put('/update-user', isToken ,updateUser);
userRouter.put('delete-user', isToken ,softDeleteUser);
userRouter.put('/restore-user', restoreUser);
userRouter.delete('/hard-delete-user', hardDeleteUser);

module.exports = userRouter;
