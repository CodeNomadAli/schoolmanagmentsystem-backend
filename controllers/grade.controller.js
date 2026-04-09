import Grade from "../models/grade.model.js";
import { apiResponse } from "../helper.js";

// ---------------- CREATE ----------------
export const addGrade = async (req, res) => {
  try {
    const { student, subject, grade, examDate, teacher } = req.body;
    const school_id = req.user?.school_id;

    if (!school_id) {
      return res.status(401).json(apiResponse(401, null, "Unauthorized"));
    }

    if (!student || !subject || !grade || !examDate || !teacher) {
      return res.status(400).json(apiResponse(400, null, "Missing required fields"));
    }

    const newGrade = await Grade.create({
      student,
      subject,
      grade,
      examDate,
      teacher,
      school_id,
    });

    return res.status(201).json(apiResponse(201, newGrade, "Grade added successfully"));
  } catch (err) {
    console.error("Add grade error:", err);
    return res.status(500).json(apiResponse(500, null, "Internal server error"));
  }
};

// ---------------- GET ALL ----------------
export const getGrades = async (req, res) => {
  try {
    const grades = await Grade.find({ school_id: req.user.school_id })
      .populate("student", "fullName rollNumber")
      .populate("subject", "name code")
      .populate("teacher", "fullName email");

    return res.status(200).json(apiResponse(200, grades, "Grades fetched successfully"));
  } catch (err) {
    console.error("Get grades error:", err);
    return res.status(500).json(apiResponse(500, null, "Internal server error"));
  }
};

// ---------------- GET ONE ----------------
export const getGradeById = async (req, res) => {
  try {
    const grade = await Grade.findById(req.params.id)
      .populate("student", "fullName rollNumber")
      .populate("subject", "name code")
      .populate("teacher", "fullName email");

    if (!grade) {
      return res.status(404).json(apiResponse(404, null, "Grade not found"));
    }

    return res.status(200).json(apiResponse(200, grade, "Grade fetched successfully"));
  } catch (err) {
    console.error("Get grade error:", err);
    return res.status(500).json(apiResponse(500, null, "Internal server error"));
  }
};

// ---------------- UPDATE ----------------
export const updateGrade = async (req, res) => {
  try {
    const gradeDoc = await Grade.findById(req.params.id);

    if (!gradeDoc) {
      return res.status(404).json(apiResponse(404, null, "Grade not found"));
    }

    const fields = ["student", "subject", "grade", "examDate", "teacher"];
    fields.forEach((field) => {
      if (req.body[field] !== undefined && req.body[field] !== "") {
        gradeDoc[field] = req.body[field];
      }
    });

    await gradeDoc.save();

    const updatedGrade = await Grade.findById(req.params.id)
      .populate("student", "fullName rollNumber")
      .populate("subject", "name code")
      .populate("teacher", "fullName email");

    return res.status(200).json(apiResponse(200, updatedGrade, "Grade updated successfully"));
  } catch (err) {
    console.error("Update grade error:", err);
    return res.status(500).json(apiResponse(500, null, "Internal server error"));
  }
};

// ---------------- DELETE ----------------
export const deleteGrade = async (req, res) => {
  try {
    const grade = await Grade.findByIdAndDelete(req.params.id);
    if (!grade) {
      return res.status(404).json(apiResponse(404, null, "Grade not found"));
    }

    // await grade.remove();
    return res.status(200).json(apiResponse(200, null, "Grade deleted successfully"));
  } catch (err) {
    console.error("Delete grade error:", err);
    return res.status(500).json(apiResponse(500, null, "Internal server error"));
  }
};