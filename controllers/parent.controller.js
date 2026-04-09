import Parent from "../models/parent.model.js";
import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import { sendMail } from "../services/sendMail.service.js";
import { apiResponse } from "../helper.js";

// ---------------- CREATE ----------------
export const addParent = async (req, res) => {
  try {
    const {
      fullName,
      email,
      phone,
      occupation,
      relation,
      emergencyContact,
      address,
      status
    } = req.body;

    const school_id = req.user.school_id;
    const schoolName = req.user.school_name || "Your School";

    const existingParent = await Parent.findOne({ email, school_id });
    if (existingParent) {
      return res
        .status(409)
        .json(apiResponse(409, null, "Parent already exists in this school"));
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json(
        apiResponse(
          409,
          null,
          `User already exists in ${existingUser.school_name}`
        )
      );
    }

    const generatedPassword = Math.random().toString(36).slice(-8);
    const hashedPassword = await bcrypt.hash(generatedPassword, 10);

    const newParent = await Parent.create({
      fullName,
      email,
      phone,
      occupation,
      relation,
      emergencyContact,
      address,
      school_id,
      status,
      password: hashedPassword,
    });

    await User.create({
      username: fullName,
      email,
      password: hashedPassword,
      accessLevel: "parent",
      school_id,
      school_name: schoolName,
    });

    await sendMail({
      to: email,
      subject: `Welcome to ${schoolName} as a Parent`,
      html: `<h2>Hello ${fullName}</h2>
       <p> Well come as teacher Role kindly login the <br> Link ${process.env.FRONTEND_URL} </p> 
             <p>Email: ${email}</p>
             <p>Password: ${generatedPassword}</p>`,
    });

    return res.status(201).json(
      apiResponse(
        201,
        {
          parent: newParent,
          password: generatedPassword,
        },
        "Parent added successfully"
      )
    );
  } catch (err) {
    console.error("Add parent error:", err);
    return res
      .status(500)
      .json(apiResponse(500, null, "Internal server error"));
  }
};

// ---------------- GET ALL ----------------
export const getParents = async (req, res) => {
  try {
    const parents = await Parent.find({
      school_id: req.user.school_id,
    });

    return res
      .status(200)
      .json(apiResponse(200, parents, "Parents fetched successfully"));
  } catch (err) {
    console.error("Get parents error:", err);
    return res
      .status(500)
      .json(apiResponse(500, null, "Error fetching parents"));
  }
};

// ---------------- GET ONE ----------------
export const getParentById = async (req, res) => {
  try {
    const parent = await Parent.findById(req.params.id);

    if (!parent) {
      return res
        .status(404)
        .json(apiResponse(404, null, "Parent not found"));
    }

    return res
      .status(200)
      .json(apiResponse(200, parent, "Parent fetched successfully"));
  } catch (err) {
    console.error("Get parent error:", err);
    return res
      .status(500)
      .json(apiResponse(500, null, "Error fetching parent"));
  }
};

// ---------------- UPDATE ----------------
export const updateParent = async (req, res) => {
  try {
    const parent = await Parent.findById(req.params.id);

    if (!parent) {
      return res
        .status(404)
        .json(apiResponse(404, null, "Parent not found"));
    }

    Object.assign(parent, req.body);
    await parent.save();

    return res
      .status(200)
      .json(apiResponse(200, parent, "Parent updated successfully"));
  } catch (err) {
    console.error("Update parent error:", err);
    return res
      .status(500)
      .json(apiResponse(500, null, "Error updating parent"));
  }
};

// ---------------- DELETE ----------------
export const deleteParent = async (req, res) => {
  try {
    const parent = await Parent.findById(req.params.id);

    if (!parent) {
      return res
        .status(404)
        .json(apiResponse(404, null, "Parent not found"));
    }

    await parent.deleteOne();
    await User.findOneAndDelete({ email: parent.email });

    return res
      .status(200)
      .json(apiResponse(200, null, "Parent deleted successfully"));
  } catch (err) {
    console.error("Delete parent error:", err);
    return res
      .status(500)
      .json(apiResponse(500, null, "Error deleting parent"));
  }
};