import express from "express";
import auth from "./../middleware/auth.middleware.js";
import {
  
  getAllUsers,
  getUserById,
  login,
  logout,
  register,
  resetPasswordChangePassword,
  resetPasswordSendMail,
  resetPasswordVerifyResetToken,
  sendEmailVerification,
  socialAuth,
  validatedEmailToken,
  verifyAuth,
} from "../controllers/auth.controller.js";

const authRouter = express.Router();

// user registration route ⬇️
authRouter.post("/register", register);
// user login route ⬇️
authRouter.post("/login", login);
//logout route
authRouter.post("/logout", auth, logout);
// forget password route 
authRouter.post("/reset-password",resetPasswordSendMail);
// verify email 
authRouter.post('/verify-email/:token',validatedEmailToken),
// send email verification
authRouter.post('/verify-email',sendEmailVerification),
// verify reset token
authRouter.get("/reset-password/:token",resetPasswordVerifyResetToken);
// verify token and change password
authRouter.post("/reset-password/:token",resetPasswordChangePassword);
// Verify token route
authRouter.get('/verify', auth, verifyAuth); 
// get all users ⬇️
authRouter.get("/users", getAllUsers);
// get user by id
authRouter.get("/users/:id", getUserById);
// social auth
authRouter.post("/social/:uid",socialAuth)
export default authRouter;
