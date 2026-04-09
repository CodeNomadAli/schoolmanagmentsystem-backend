import Exam from "../models/exam.model.js";
import { apiResponse } from "../helper.js";

// ---------------- CREATE - Add Exam ----------------
export const addExam = async (req, res) => {
  try {
    const {
      examTitle,
      subject,
      class: classId,
      examType = "Midterm",
      status,
      examDate,
      startTime,
      duration = 0,
      room = "",
      totalMarks = 0,
      passingMarks = 0,
      totalStudents = 0,
      teacher,
      description = "",
      instructions = "",
    } = req.body;

    const school_id = req.user?.school_id;
    if (!school_id) {
      return res.status(401).json(apiResponse(401, null, "Unauthorized"));
    }

    if (!examTitle || !subject || !classId || !examDate || !startTime || !teacher) {
      return res.status(400).json(apiResponse(400, null, "Missing required fields"));
    }

    const newExam = await Exam.create({
      examTitle,
      subject,
      class: classId,
      examType,
      examDate,
      startTime,
      duration,
      room,
      totalMarks,
      passingMarks,
      totalStudents,
      teacher,
      description,
      instructions,
      school_id,
      status
    });

    return res.status(201).json(apiResponse(201, newExam, "Exam scheduled successfully"));
  } catch (err) {
    console.error("Add exam error:", err);
    return res.status(500).json(apiResponse(500, null, "Internal server error"));
  }
};

// ---------------- READ - Get All Exams ----------------
export const getExams = async (req, res) => {
  try {
    const exams = await Exam.find({ school_id: req.user.school_id })
      .populate("teacher", "fullName email")
      .populate("subject", "name code")
      .populate("class", "className");

    return res.status(200).json(apiResponse(200, exams, "Exams fetched successfully"));
  } catch (err) {
    console.error("Get exams error:", err);
    return res.status(500).json(apiResponse(500, null, "Internal server error"));
  }
};

// ---------------- READ - Get Single Exam ----------------
export const getExamById = async (req, res) => {
  try {
    const exam = await Exam.findById(req.params.id)
      .populate("teacher", "fullName email")
      .populate("subject", "name code")
      .populate("class", "name");

    if (!exam) return res.status(404).json(apiResponse(404, null, "Exam not found"));
    return res.status(200).json(apiResponse(200, exam, "Exam fetched successfully"));
  } catch (err) {
    console.error("Get exam error:", err);
    return res.status(500).json(apiResponse(500, null, "Internal server error"));
  }
};

// ---------------- UPDATE - Update Exam ----------------
export const updateExam = async (req, res) => {
  try {
    const exam = await Exam.findById(req.params.id);
    if (!exam) return res.status(404).json(apiResponse(404, null, "Exam not found"));

    const fields = [
      "examTitle",
      "subject",
      "class",
      "examType",
      "examDate",
      "startTime",
      "duration",
      "room",
      "totalMarks",
      "passingMarks",
      "totalStudents",
      "teacher",
      "description",
      "instructions",
      "status"
    ];

    fields.forEach((field) => {
      if (req.body[field] !== undefined && req.body[field] !== "") {
        exam[field] = req.body[field];
      }
    });

    await exam.save();

    const updatedExam = await Exam.findById(req.params.id)
      .populate("teacher", "fullName email")
      .populate("subject", "name code")
      .populate("class", "name");

    return res.status(200).json(apiResponse(200, updatedExam, "Exam updated successfully"));
  } catch (err) {
    console.error("Update exam error:", err);
    return res.status(500).json(apiResponse(500, null, "Internal server error"));
  }
};

// ---------------- DELETE - Remove Exam ----------------
export const deleteExam = async (req, res) => {
  try {
    const exam = await Exam.findById(req.params.id);
    if (!exam) return res.status(404).json(apiResponse(404, null, "Exam not found"));

    await exam.remove();
    return res.status(200).json(apiResponse(200, null, "Exam deleted successfully"));
  } catch (err) {
    console.error("Delete exam error:", err);
    return res.status(500).json(apiResponse(500, null, "Internal server error"));
  }
};