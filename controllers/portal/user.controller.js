import User from "../../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import userValidations from "../../validations/user.validations.js";
import { apiResponse } from "../../helper.js";

const { createUserSchema, loginUserSchema,updateUserSchema } = userValidations;


const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, email: user.email, role: user.accessLevel },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};


export const registerUser = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { error } = createUserSchema.validate(req.body);
    if (error) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ message: error.details[0].message });
    }

    const { username, email, password, profileImage } = req.body;

    const existing = await User.findOne({ email }).session(session);
    if (existing) {
      await session.abortTransaction();
      session.endSession();
      return res.status(409).json({ message: "Email already registered", success: false });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create([{
      username,
      email,
      password: hashedPassword,
      profileImage
    }], { session });

    await session.commitTransaction();
    session.endSession();

    const { password: _, ...userData } = newUser[0].toObject();

    return res.status(201).json({
      message: "User registered",
      success: true,
      user: userData,
      token: generateToken(newUser[0]),
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error("Register error:", error);
    return res.status(500).json({ message: "Internal server error", success: false });
  }
};


export const loginUser = async (req, res) => {
  try {
     const { error, value } = loginUserSchema.validate(req.body);

  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
    const { email, password } = req.body;
  

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
  let response;
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
      User.find().select("-password").skip(skip).limit(limit),
      User.countDocuments(),
    ]);
    

    response = apiResponse(200, { users, pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      }  },
    'User fetched successfully')

    res.status(200).json(response);
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

    res.json(apiResponse(200, user, 'Data fetched successfully!'));
  } catch (error) {
    console.error("Get user by ID error:", error);
    res.status(500).json({ message: "Internal server error", success: false });
  }
};

// @desc Update user
export const updateUser = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { id } = req.params;

    const { error } = updateUserSchema.validate(req.body);
    if (error) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ message: error.details[0].message });
    }

    const updated = await User.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
      session
    });

    if (!updated) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ message: "User not found", success: false });
    }

    await session.commitTransaction();
    session.endSession();

    return res.status(200).json({
      message: "User updated",
      success: true,
      user: updated
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error("Update error:", error);
    return res.status(500).json({ message: "Internal server error", success: false });
  }
};



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
      const { error, value } = createUserSchema.validate(req.body);

  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
    const { username, email, password, profileImage } = req.body;

  
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "Email already registered", success: false });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
      profileImage
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
