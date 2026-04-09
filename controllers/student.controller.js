import Student from "../models/student.model.js";
import Parent from "../models/parent.model.js";
import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import { sendMail } from "../services/sendMail.service.js";
import { apiResponse } from "../helper.js"; // API helper

// ---------------- CREATE ----------------
export const addStudent = async (req, res) => {
try {
  const {
    fullName,
    email,
    phone,
    rollNumber,
    class: studentClass,
    section,
    dateOfBirth,
    gender,
    bloodGroup,
    parentId, // 🔥 Reference to parent
    address,
  } = req.body;

  const school_id = req.user.school_id;
  const schoolName = req.user.school_name || "Your School";

  // Check duplicate student in same school
  const existingStudent = await Student.findOne({
    $or: [{ email, school_id }, { rollNumber, school_id }],
  });
  if (existingStudent) {
    return res
      .status(409)
      .json(apiResponse(409, null, "Student with this email or roll number already exists"));
  }

  // Validate parent if provided
  let parent = null;
  if (parentId) {
    parent = await Parent.findById(parentId);
    if (!parent) {
      return res.status(404).json(apiResponse(404, null, "Parent not found"));
    }
  }

  // Check if a user exists with the same email
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res
      .status(409)
      .json(apiResponse(409, null, `User already exists in ${existingUser.school_name}`));
  }

  // Generate password
  const generatedPassword = Math.random().toString(36).slice(-8);
  const hashedPassword = await bcrypt.hash(generatedPassword, 10);

  // Create student
  const newStudent = await Student.create({
    fullName,
    email,
    phone,
    rollNumber,
    class: studentClass,
    section,
    dateOfBirth,
    gender,
    bloodGroup,
    parent: parent?._id || null, // 🔥 reference parent
    address,
    school_id,
    password: hashedPassword,
  });

  // Create login user
  await User.create({
    username: fullName,
    email,
    password: hashedPassword,
    accessLevel: "student",
    school_id,
    school_name: schoolName,
  });

  // Send email to student
  await sendMail({
    to: email,
    subject: `Welcome to ${schoolName} as a Student`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #333; margin-bottom: 20px;">Hello ${fullName}!</h2>
        <p style="color: #666; line-height: 1.6;">
          You have been added as a student in <strong>${schoolName}</strong>.
        </p>
        <p style="color: #666; line-height: 1.6;">
          Here are your login details:
        </p>
        <ul style="color: #666; line-height: 1.6;">
          <li>Email: <strong>${email}</strong></li>
          <li>Password: <strong>${generatedPassword}</strong></li>
        </ul>
        <p style="color: #666; line-height: 1.6;">
          Please log in using these credentials and change your password after first login.
        </p>
        <p style="color: #666; line-height: 1.6;">
          <strong>Note:</strong> Keep your password secure.
        </p>
      </div>
    `,
  });

  return res
    .status(201)
    .json(apiResponse(201, { student: newStudent, password: generatedPassword }, "Student added successfully"));
} catch (err) {
  console.error("Add student error:", err);
  return res.status(500).json(apiResponse(500, null, "Internal server error"));
}
};

// ---------------- GET ALL ----------------
export const getStudents = async (req, res) => {
  try {
    const students = await Student.find({ school_id: req.user.school_id })
      .populate("parent", "fullName email phone")
      .populate("class", "className section grade"); // populate class info

    return res.status(200).json(
      apiResponse(200, { students }, "Students fetched successfully")
    );
  } catch (err) {
    console.error("Get students error:", err);
    return res.status(500).json(apiResponse(500, null, "Internal server error"));
  }
};

// ---------------- GET ONE ----------------
export const getStudentById = async (req, res) => {
try {
  const student = await Student.findById(req.params.id).populate("parent", "fullName email phone");
  if (!student) return res.status(404).json(apiResponse(404, null, "Student not found"));

  return res.json(apiResponse(200, { student }, "Student fetched successfully"));
} catch (err) {
  console.error(err);
  return res.status(500).json(apiResponse(500, null, "Error fetching student"));
}
};

// ---------------- UPDATE ----------------
export const updateStudent = async (req, res) => {
try {
  const student = await Student.findById(req.params.id);
  if (!student) return res.status(404).json(apiResponse(404, null, "Student not found"));

  // If updating parent
  if (req.body.parentId) {
    const parent = await Parent.findById(req.body.parentId);
    if (!parent) return res.status(404).json(apiResponse(404, null, "Parent not found"));
    student.parent = parent._id;
    delete req.body.parentId;
  }

  Object.keys(req.body).forEach((key) => {
    student[key] = req.body[key];
  });

  await student.save();
  return res.json(apiResponse(200, { student }, "Student updated successfully"));
} catch (err) {
  console.error(err);
  return res.status(500).json(apiResponse(500, null, "Error updating student"));
}
};

// ---------------- DELETE ----------------
export const deleteStudent = async (req, res) => {
try {
  const student = await Student.findById(req.params.id);
  if (!student) return res.status(404).json(apiResponse(404, null, "Student not found"));

  await student.remove();
  await User.findOneAndDelete({ email: student.email });

  return res.json(apiResponse(200, null, "Student deleted successfully"));
} catch (err) {
  console.error(err);
  return res.status(500).json(apiResponse(500, null, "Error deleting student"));
}
};