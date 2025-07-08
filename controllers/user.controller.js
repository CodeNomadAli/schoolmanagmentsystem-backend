import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";


const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, email: user.email, role: user.accessLevel },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};


export const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields are required", success: false });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({ message: "Email already registered", success: false });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    const { password: _, ...userData } = newUser.toObject();

    return res.status(201).json({
      message: "User registered",
      success: true,
      user: userData,
      token: generateToken(newUser),
    });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ message: "Internal server error", success: false });
  }
};


export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: "Email and password required", success: false });

    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: "Invalid email or password", success: false });
    }

    user.lastLogin = new Date();
    await user.save();

    const token = generateToken(user);
    const { password: _, ...userData } = user.toObject();

    res.status(200).json({
      message: "Login successful",
      success: true,
      user: userData,
      token,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Internal server error", success: false });
  }
};

// @desc Get all users (with pagination)
export const getAllUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
      User.find().select("-password").skip(skip).limit(limit),
      User.countDocuments(),
    ]);

    res.status(200).json({
      success: true,
      data: users,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Get users error:", error);
    res.status(500).json({ message: "Internal server error", success: false });
  }
};

// @desc Get user by ID
export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found", success: false });

    res.json({ success: true, user });
  } catch (error) {
    console.error("Get user by ID error:", error);
    res.status(500).json({ message: "Internal server error", success: false });
  }
};

// @desc Update user
export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const update = { ...req.body };

    if (update.password) {
      update.password = await bcrypt.hash(update.password, 10);
    }

    const updated = await User.findByIdAndUpdate(id, update, {
      new: true,
    }).select("-password");

    if (!updated) return res.status(404).json({ message: "User not found", success: false });

    res.json({ message: "User updated", success: true, user: updated });
  } catch (error) {
    console.error("Update user error:", error);
    res.status(500).json({ message: "Internal server error", success: false });
  }
};

// @desc Delete user
export const deleteUser = async (req, res) => {
  try {
    const deleted = await User.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "User not found", success: false });

    res.json({ message: "User deleted", success: true });
  } catch (error) {
    console.error("Delete user error:", error);
    res.status(500).json({ message: "Internal server error", success: false });
  }
};

// @desc Suspend user
export const suspendUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { message } = req.body;

    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: "User not found", success: false });

    user.status = "suspended";
    user.suspendedBy = req.user?.id || null;
    user.suspendedMessage = message;
    user.suspendedAt = new Date();

    await user.save();

    res.json({ message: "User suspended", success: true });
  } catch (error) {
    console.error("Suspend user error:", error);
    res.status(500).json({ message: "Internal server error", success: false });
  }
};

// @desc Warn user
export const warnUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { message } = req.body;

    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: "User not found", success: false });

    user.status = "warning";
    user.warningBy = req.user?.id || null;
    user.warningMessage = message;
    user.warningAt = new Date();

    await user.save();

    res.json({ message: "User warned", success: true });
  } catch (error) {
    console.error("Warn user error:", error);
    res.status(500).json({ message: "Internal server error", success: false });
  }
};


 export const createUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields are required", success: false });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "Email already registered", success: false });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    return res.status(201).json({
      message: "User created successfully",
      success: true,
      user: newUser,
    });
  } catch (error) {
    console.error("Create user error:", error);
    return res.status(500).json({ message: "Internal server error", success: false });
  }
};

export default {
  createUser,
  getUserById,
  updateUser,
  deleteUser,
  suspendUser,
  warnUser,
};
