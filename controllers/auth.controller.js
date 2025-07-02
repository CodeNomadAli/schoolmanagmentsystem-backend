import mongoose from "mongoose";
import bcrypt from "bcrypt";
import User from "../models/user.model.js";
import generateToken from "../utils/generateToken.js";
import {
  registerValidation,
  loginValidation,
} from "../validations/auth.validation.js";
import { getClientInfo } from "../utils/clientInfo.js";
import Session from "../models/session.model.js";
import crypto from "crypto";
import { sendMail } from "./../services/sendMail.service.js";
import UserProfile from "./../models/user_profile.model.js";
import admin from "./../config/firebase.config.js";
import hashPassword from "./../utils/hashPassword.js";

// Register user
const register = async (req, res) => {
  try {
    const { error } = registerValidation.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const { password, email } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        message: "Email already in use try with different email",
        success: false,
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      ...req.body,
      password: hashedPassword,
    });

    return res.status(201).json({
      message: "Registration successful. Please verify your email.",
      success: true,
      req: req.body,
    });
  } catch (err) {
    console.error("Register error:", err);
    return res
      .status(500)
      .json({ message: "Internal server error", success: false });
  }
};
const validatedEmailToken = async (req, res) => {
  try {
    const { token } = req.params;

    if (!token || token.length < 32) {
      return res
        .status(400)
        .json({ message: "Invalid token format", success: false });
    }

    const user = await User.findOne({
      emailVerificationToken: token,
    });
    if (!user) {
      return res
        .status(400)
        .json({ message: "Invalid or expired token", token, success: false });
    }

    user.emailVerificationToken = undefined;
    user.emailVerificationExpires = undefined;
    user.emailVerified = true;
    user.lastLogin = new Date();
    user.save();

    const authToken = generateToken(user);

    res.cookie("token", authToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    // Extract client info
    const { browser, os, deviceType } = getClientInfo(
      req.headers["user-agent"]
    );

    // Log session
    await Session.create({
      userId: user._id,
      ipAddress: req.ip || req.connection.remoteAddress,
      userAgent: req.headers["user-agent"],
      deviceType,
      sessionToken: authToken,
      metadata: { browser, os },
    });
    const userHealthProfile = await UserProfile.findOne({ userId: user._id });

    let redirect = null;
    if (!userHealthProfile) {
      redirect = "/health-profile";
    } else {
      switch (user.accessLevel.trim().toLowerCase()) {
        case "admin":
          redirect = "/admin/dashboard";
          break;
        case "user":
          redirect = "/dashboard";
          break;
        default:
          redirect = "/signin";
          break;
      }
    }

    // Prepare safe user data

    const { password: _, ...userData } = user.toObject();

    return res.status(200).json({
      message: "Valid token",
      success: true,
      token: authToken,
      user: userData,
      redirect,
    });
  } catch (error) {
    console.error("Email verification error:", error);
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
      success: false,
    });
  }
};
const MAX_RESET_REQUESTS = 5;
const WINDOW_MS = 60 * 60 * 1000; // 1 hours

const sendEmailVerification = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ message: "User not found", success: false });
    }
    if (user.emailVerified) {
      return res
        .status(400)
        .json({ message: "Your email already verified", success: false });
    }

    const now = Date.now();

    if (
      user.emailVerificationTimestamp &&
      now - user.emailVerificationTimestamp < WINDOW_MS
    ) {
      if (user.emailVerificationRequestCount >= MAX_RESET_REQUESTS) {
        return res.status(429).json({
          success: false,
          message: "Too many requests. Try again after  1 hour",
        });
      }
      user.emailVerificationRequestCount += 1;
    } else {
      user.emailVerificationRequestCount = 1;
      user.emailVerificationTimestamp = now;
    }
    const emailToken = crypto.randomBytes(32).toString("hex");
    const emailTokenHash = crypto
      .createHash("sha256")
      .update(emailToken)
      .digest("hex");

    const verifyLink = `${process.env.FRONTEND_URL}/verify-email/${emailTokenHash}`;
    user.emailVerificationToken = emailTokenHash;
    user.emailVerificationExpires = Date.now() + 30 * 60 * 1000;
    await user.save();

    await sendMail({
      to: user.email,
      subject: "Verify Your Email",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #333; margin-bottom: 20px;">Welcome to Our Platform!</h2>
          <p style="color: #666; line-height: 1.6;">Hello ${user.username},</p>
          <p style="color: #666; line-height: 1.6;">Thank you for registering with us. To complete your registration and access all features, please verify your email address by clicking the button below:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${verifyLink}" style="background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">Verify Email Address</a>
          </div>
          <p style="color: #666; line-height: 1.6;"><strong>Important:</strong> This verification link will expire in 30 minutes.</p>
         
        </div>
      `,
    });

    return res.status(200).json({
      message: "Email verification send successfully",
      success: true,
    });
  } catch (error) {
    console.error("Send email verification error:", error);
    return res
      .status(500)
      .json({ message: "Internal server error", success: false });
  }
};

const login = async (req, res) => {
  try {
    // Validate request body
    const { error } = loginValidation.validate(req.body);
    if (error) {
      return res.status(400).json({
        message: "Validation failed",
        error: error.details[0].message,
        success: false,
      });
    }

    const { email, password, rememberMe } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({
        message: "Invalid email or password",
        success: false,
      });
    }

    // Update last login timestamp
    user.lastLogin = new Date();
    await user.save();

    // Generate authentication token
    const token = generateToken(user);

    // Set secure cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: rememberMe ? 7 * 24 * 60 * 60 * 1000 : undefined,
    });

    // Extract client info
    const { browser, os, deviceType } = getClientInfo(
      req.headers["user-agent"]
    );

    // Log session
    await Session.create({
      userId: user._id,
      ipAddress: req.ip || req.connection.remoteAddress,
      userAgent: req.headers["user-agent"],
      deviceType,
      sessionToken: token,
      metadata: { browser, os },
    });

    // Check if user has filled health profile
    const userHealthProfile = await UserProfile.findOne({ userId: user._id });

    let redirect = null;
    // Check if email is verified
    if (!user.emailVerified) {
      redirect = "/verify-email";
    } else if (!userHealthProfile) {
      redirect = "/health-profile";
    } else {
      switch (user.accessLevel.trim().toLowerCase()) {
        case "admin":
          redirect = "/admin/dashboard";
          break;
        case "user":
          redirect = "/dashboard";
          break;
        case "writer":
          redirect = "/writer/dashboard";
          break;
        case "moderator":
          redirect = "/moderator/dashboard";
          break;

      }
    }

    // Prepare safe user data

    const { password: _, ...userData } = user.toObject();

    return res.status(200).json({
      message: "Login successful",
      user: userData,
      token,
      success: true,
      redirect,
    });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({
      message: "Internal server error",
      error: err.message,
      success: false,
    });
  }
};

const logout = async (req, res) => {
  try {
    const token = req.token;
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });
    // Invalidate session in DB
    await Session.updateOne(
      { sessionToken: token, isActive: true },
      {
        isActive: false,
        logoutTime: new Date(),
      }
    );

    return res.status(200).json({ message: "Logout successful" });
  } catch (err) {
    console.error("Logout error:", err);
    return res.status(500).json({
      message: "Internal server error",
      error: err.message,
    });
  }
};

const verifyAuth = async (req, res) => {
  try {
    // The user information is already attached to req.user by the auth middleware
    const user = req.user;

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid or expired token",
      });
    }
    const userData = await User.findById(user.id).select("-password");

    // Return the user information
    return res.status(200).json({
      success: true,
      user: userData,
    });
  } catch (error) {
    console.error("Token verification error:", error);
    return res.status(401).json({
      success: false,
      message: "Token verification failed",
    });
  }
};

// Get all users with pagination
const getAllUsers = async (req, res) => {
  try {
    const limit = Math.min(Math.max(parseInt(req.query.l) || 10, 1), 100);
    const page = Math.max(parseInt(req.query.p) || 1, 1);
    const skip = (page - 1) * limit;

    const [users, totalUsers] = await Promise.all([
      User.find({}, "-password").skip(skip).limit(limit),
      User.countDocuments(),
    ]);

    return res.status(200).json({
      message: "Successfully fetched users",
      page,
      limit,
      totalUsers,
      totalPages: Math.ceil(totalUsers / limit),
      users,
    });
  } catch (error) {
    console.error("Get all users error:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Get user by ID
const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid user ID format" });
    }

    const user = await User.findById(id, "-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({
      message: "Successfully fetched user",
      user,
    });
  } catch (error) {
    console.error("Get user by ID error:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

const resetPasswordSendMail = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res
        .status(400)
        .json({ message: "Email is required", success: false });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(200)
        .json({ message: "user not found", success: false });
    }
    const now = Date.now();
    if (
      user.resetRequestTimestamp &&
      now - user.resetRequestTimestamp < WINDOW_MS
    ) {
      if (user.resetRequestCount >= MAX_RESET_REQUESTS) {
        return res.status(429).json({
          success: false,
          message: "Too many password reset requests. Try again after  1 hour",
        });
      }
      user.resetRequestCount += 1;
    } else {
      user.resetRequestCount = 1;
      user.resetRequestTimestamp = now;
    }

    // Create reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenHash = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    user.resetPasswordToken = resetTokenHash;
    user.resetPasswordExpires = now + 30 * 60 * 1000; // 30m

    await user.save();

    const resetLink = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

    await sendMail({
      to: user.email,
      subject: "Password Reset Request",
      html: `
        <h2>Reset Your Password</h2>
        <p>Hello ${user.username || "User"},</p>
        <p>Click the link below to reset your password. This link will expire in 1 hour.</p>
        <a href="${resetLink}" style="padding: 10px 20px; background-color: #007bff; color: white; text-decoration: none;">Reset Password</a>
        <p>If you did not request this, you can safely ignore this email.</p>
      `,
    });

    return res.status(200).json({
      success: true,
      message:
        "If an account exists, a reset link has been sent to your email.",
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
      success: false,
    });
  }
};

const resetPasswordVerifyResetToken = async (req, res) => {
  try {
    const { token } = req.params;

    if (!token || token.length < 32) {
      return res
        .status(400)
        .json({ message: "Invalid token format", success: false });
    }

    const resetTokenHash = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    const user = await User.findOne({
      resetPasswordToken: resetTokenHash,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res
        .status(400)
        .json({ message: "Invalid or expired reset token", success: false });
    }

    return res.status(200).json({
      success: true,
      message: "Reset token is valid",
    });
  } catch (error) {
    console.error("Verify reset token error:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
      success: false,
    });
  }
};

const resetPasswordChangePassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({
        message: "Token and new password are required",
      });
    }
    if (!token || token.length < 32) {
      return res.status(400).json({ message: "Invalid token format" });
    }

    const resetTokenHash = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    const user = await User.findOne({
      resetPasswordToken: resetTokenHash,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Password reset token is invalid or has expired",
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update user's password and clear reset token fields
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    await Session.deleteMany({ userId: user._id, isActive: true });

    return res.status(200).json({
      message: "Password has been reset successfully",
      success: true,
    });
  } catch (error) {
    console.error("Password reset error:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
      success: false,
    });
  }
};

const socialAuth = async (req, res) => {
  const { token: idToken } = req.body;
  if (!idToken) {
    return res.status(400).json({ message: "Missing ID token" });
  }
  try {
    const decoded = await admin.auth().verifyIdToken(idToken);

    const {
      email,
      name,
      uid,
      email_verified,
      firebase: { sign_in_provider } = {},
    } = decoded;

    if (!email) {
      return res
        .status(400)
        .json({ message: "No email found in Firebase token." });
    }
    let user = await User.findOne({ email });
    if (!user) {
      user = new User({
        email,
        emailVerified: email_verified,
        isActive: true,
        username: name || email.split("@")[0],
        password: await hashPassword(uid),
        geographicRegion: "global",
      });

      await user.save();
    }
    const token = generateToken(user);
    user.lastLogin = new Date();
    await user.save();

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: "strict",
    });

    const { browser, os, deviceType } = getClientInfo(
      req.headers["user-agent"]
    );

    await Session.create({
      userId: user._id,
      ipAddress: req.ip || req.connection.remoteAddress,
      userAgent: req.headers["user-agent"],
      deviceType,
      sessionToken: token,
      metadata: { browser, os },
    });

    const { password: _, ...userData } = user.toObject();

    let redirect = null;

    switch (user.accessLevel.trim().toLowerCase()) {
      case "admin":
        redirect = "/admin/dashboard";
        break;
      case "user":
        redirect = "/dashboard";
        break;
      default:
        redirect = "/signin";
        break;
    }

    return res.status(200).json({
      message: "Login successful",
      user: user,
      token,
      success: true,
      redirect,
    });
  } catch (error) {
    console.error("Social auth failed:", error);

    return res.status(401).json({
      message: "Social authentication failed",
      error: error.message || "Unable to verify identity",
    });
  }
};

export {
  register,
  login,
  getAllUsers,
  getUserById,
  logout,
  resetPasswordSendMail,
  resetPasswordVerifyResetToken,
  resetPasswordChangePassword,
  validatedEmailToken,
  sendEmailVerification,
  socialAuth,
  verifyAuth,
};

/**
 * Paste one or more documents here
 */
// {
//   "username": "Aliyan siddiqui",
//   "email": "aliyansiddiqui555@gmail.com",
//   "password": "$2b$10$a36oJi6DOCzvfBhDMP21buln.yz58SehdwX68Xp.LDcsgArdX5Wnq",
//   "accessLevel": "admin",
//   "geographicRegion": "global",
//   "isActive": true,
//   "emailVerified": true,
//   "twoFactorStatus": "disabled",
//   "profileImage": "/user/default.png",
//   "emailVerificationRequestCount": 0,
//   "emailVerificationTimestamp": null,
//   "resetRequestCount": 0,
//   "resetRequestTimestamp": null,
//   "createdAt": {
//     "$date": "2025-05-27T09:14:08.173Z"
//   },
//   "updatedAt": {
//     "$date": "2025-05-29T16:50:28.938Z"
//   },
//   "__v": 0,
//   "lastLogin": {
//     "$date": "2025-05-29T16:50:28.938Z"
//   },
//   "status": "active"
// }
