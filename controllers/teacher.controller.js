import Teacher from "../models/teacher.model.js";
import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import { sendMail } from "../services/sendMail.service.js";
import { apiResponse } from "../helper.js";

// ---------------- CREATE - Add Teacher ----------------
export const addTeacher = async (req, res) => {
  try {
    const {
      fullName,
      email,
      phone,
      department,
      qualification,
      experienceYears,
      salary,
      gender,
      address,
    } = req.body;

    const school_id = req.user.school_id;
    const schoolName = req.user.school_name;

    const existingTeacher = await Teacher.findOne({ email, school_id });
    if (existingTeacher) {
      return res
        .status(409)
        .json(apiResponse(409, null, "Teacher with this email already exists."));
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json(
        apiResponse(
          409,
          null,
          `User already exists in ${existingUser.school_name} school.`
        )
      );
    }

    const generatedPassword = Math.random().toString(36).slice(-8);
    const hashedPassword = await bcrypt.hash(generatedPassword, 10);

    const newTeacher = await Teacher.create({
      fullName,
      email,
      phone,
      school_id,
      department,
      qualification,
      experienceYears,
      salary,
      gender,
      address,
      password: hashedPassword,
    });

    await User.create({
      username: fullName,
      email,
      password: hashedPassword,
      accessLevel: "teacher",
      school_id,
      school_name: schoolName,
    });

    await sendMail({
      to: email,
      subject: `Welcome to ${schoolName}`,
      html: `<h2>Hello ${fullName}</h2>
             <p> Well come as teacher Role kindly login the <br> Link ${process.env.FRONTEND_URL} </p> 
             <p>Email: ${email}</p>
             <p>Password: ${generatedPassword}</p>`,
    });

    return res.status(201).json(
      apiResponse(201, {
        teacher: newTeacher,
        password: generatedPassword,
      }, "Teacher added successfully")
    );

  } catch (err) {
    console.error("Add teacher error:", err);
    return res.status(500).json(apiResponse(500, null, "Internal server error"));
  }
};

// ---------------- READ - Get All Teachers ----------------
export const getTeachers = async (req, res) => {
  try {
    const teachers = await Teacher.find({ school_id: req.user.school_id });

    return res
      .status(200)
      .json(apiResponse(200, teachers, "Teachers fetched successfully"));
  } catch (err) {
    console.error("Get teachers error:", err);
    return res.status(500).json(apiResponse(500, null, "Internal server error"));
  }
};

// ---------------- READ - Get Single Teacher ----------------
export const getTeacherById = async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.params.id);

    if (!teacher) {
      return res.status(404).json(apiResponse(404, null, "Teacher not found"));
    }

    return res
      .status(200)
      .json(apiResponse(200, teacher, "Teacher fetched successfully"));
  } catch (err) {
    console.error("Get teacher error:", err);
    return res.status(500).json(apiResponse(500, null, "Internal server error"));
  }
};

// ---------------- UPDATE - Update Teacher ----------------
export const updateTeacher = async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.params.id);

    if (!teacher) {
      return res.status(404).json(apiResponse(404, null, "Teacher not found"));
    }

    Object.assign(teacher, req.body);
    await teacher.save();

    return res.status(200).json(
      apiResponse(200, teacher, "Teacher updated successfully")
    );
  } catch (err) {
    console.error("Update teacher error:", err);
    return res.status(500).json(apiResponse(500, null, "Internal server error"));
  }
};

// ---------------- DELETE - Remove Teacher ----------------
export const deleteTeacher = async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.params.id);

    if (!teacher) {
      return res.status(404).json(apiResponse(404, null, "Teacher not found"));
    }

    await teacher.deleteOne();
    await User.findOneAndDelete({ email: teacher.email });

    return res
      .status(200)
      .json(apiResponse(200, null, "Teacher deleted successfully"));
  } catch (err) {
    console.error("Delete teacher error:", err);
    return res.status(500).json(apiResponse(500, null, "Internal server error"));
  }
};