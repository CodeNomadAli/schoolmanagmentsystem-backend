import Staff from "../../models/staff.model.js";
import bcrypt from "bcrypt";
import generateToken from "../../utils/generateToken.js";
import { getClientInfo } from "../../utils/clientInfo.js";
import Session from "../../models/session.model.js";
import { apiResponse } from "../../helper.js";
import companyNotify from "../../helper/emailLogger.js";

export const staffLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required", success: false });
    }

    const staff = await Staff.findOne({ email })
      .populate({
        path: "staffRoleId",
        populate: { path: "permissions", model: "staff_Permission" }
      })
      .exec();

    if (!staff || !(await staff.matchPassword(password))) {
      return res.status(401).json({ message: "Invalid email or password", success: false });
    }

    staff.lastLogin = new Date();
    await staff.save();

    const token = generateToken(staff);
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    const { browser, os, deviceType } = getClientInfo(req.headers["user-agent"]);

    await Session.create({
      userId: staff._id,
      ipAddress: req.ip || req.connection.remoteAddress,
      userAgent: req.headers["user-agent"],
      deviceType,
      sessionToken: token,
      metadata: { browser, os }
    });

    const { password: _, ...staffData } = staff.toObject();
    console.log("Staff login successful:", staffData);
    await companyNotify(
          staff.email,
          "Login Notification",
          "You have successfully logged in. If this was not you, please contact support immediately."
        );
    return res.status(200).json({
      message: "Login successful",
      success: true,
      data: { user: staffData, token }
    });
  } catch (error) {
    console.error("Staff login error:", error);
    return res.status(500).json({ message: "Internal server error", success: false });
  }
};


export const createStaff = async (req, res) => {
  try {
    

    const { email, password, profileImage, ...rest } = req.body;

    const existing = await Staff.findOne({ email });
    if (existing) {
      return res.status(409).json({ message: "Email already exists", success: false });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newStaff = await Staff.create({ email, password: hashedPassword, profileImage, ...rest });

    return res.status(201).json({ message: "Staff created", success: true, data: newStaff });
  } catch (error) {
    console.error("Create staff error:", error); // 👈 log actual error
    return res.status(500).json({ message: "Internal server error", success: false });
  }
};



export const getAllStaff = async (req, res) => {
  try {


    const page = parseInt(req.query.page) > 0 ? parseInt(req.query.page) : 1;
    const limit = parseInt(req.query.limit) > 0 ? parseInt(req.query.limit) : 10;
    const skip = (page - 1) * limit;

    const [staffList,total] = await Promise.all([
      Staff.find()
        .select("-password")
        .populate("staffRoleId")
        .skip(skip)
        .limit(limit),
      Staff.countDocuments()
    ]);

    return res.json(apiResponse(200, {staffs: staffList, pagination: {
            total,
            page,
            limit,
            pages: Math.ceil(total / limit),
          }  },
        'Data fetched successfully'));
  } catch (error) {
    console.error("Get all staff error:", error);
    return res.status(500).json({ message: "Internal server error", success: false });
  }
};


export const getStaffById = async (req, res) => {
  try {
    const { id } = req.params;
    const staff = await Staff.findById(id).select("-password").populate("staffRoleId");

    if (!staff) {
      return res.status(404).json({ message: "Staff not found", success: false });
    }

    return res.status(200).json({ success: true, data: staff });
  } catch (error) {
    console.error("Get staff by ID error:", error);
    return res.status(500).json({ message: "Internal server error", success: false });
  }
};

export const updateStaff = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };

    if (updateData.password) {
      updateData.password = await bcrypt.hash(updateData.password, 10);
    }

    const updatedStaff = await Staff.findByIdAndUpdate(id, updateData, { new: true }).select("-password");

    if (!updatedStaff) {
      return res.status(404).json({ message: "Staff not found", success: false });
    }

    return res.status(200).json({ message: "Staff updated", success: true, data: updatedStaff });
  } catch (error) {
    console.error("Update staff error:", error);
    return res.status(500).json({ message: "Internal server error", success: false });
  }
};


export const deleteStaff = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Staff.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ message: "Staff not found", success: false });
    }

    return res.status(200).json({ message: "Staff deleted", success: true });
  } catch (error) {
    console.error("Delete staff error:", error);
    return res.status(500).json({ message: "Internal server error", success: false });
  }
};
