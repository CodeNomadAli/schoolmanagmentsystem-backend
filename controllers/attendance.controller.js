import Attendance from "../models/attendance.model.js";
import { apiResponse } from "../helper.js";

// ---------------- CREATE ----------------
export const addAttendance = async (req, res) => {
  try {
    const { student, studentName, date, status = "Present", class: classId, teacher } = req.body;
    const school_id = req.user?.school_id;

    if (!school_id) return res.status(401).json(apiResponse(401, null, "Unauthorized"));
    if (!student || !classId || !date || !teacher) {
      return res.status(400).json(apiResponse(400, null, "Missing required fields"));
    }

    // Prevent duplicate attendance for the same student, date, and class
    const existing = await Attendance.findOne({ student, date, class: classId, school_id });
    if (existing) {
      return res.status(409).json(apiResponse(409, null, "Attendance already marked for this student on this date"));
    }

    const attendance = await Attendance.create({
      student,
      studentName,
      date,
      status,
      class: classId,
      teacher,
      school_id,
    });

    return res.status(201).json(apiResponse(201, attendance, "Attendance added successfully"));
  } catch (err) {
    console.error("Add attendance error:", err);
    return res.status(500).json(apiResponse(500, null, "Internal server error"));
  }
};

// ---------------- GET ALL ----------------
export const getAttendance = async (req, res) => {
  try {
    const records = await Attendance.find({ school_id: req.user.school_id })
      .populate("student", "fullName rollNumber")
      .populate("class", "className")
      .populate("teacher", "fullName email");

    return res.status(200).json(apiResponse(200, records, "Attendance fetched successfully"));
  } catch (err) {
    console.error("Get attendance error:", err);
    return res.status(500).json(apiResponse(500, null, "Internal server error"));
  }
};

// ---------------- GET BY ID ----------------
export const getAttendanceById = async (req, res) => {
  try {
    const record = await Attendance.findById(req.params.id)
      .populate("student", "fullName rollNumber")
      .populate("class", "name")
      .populate("teacher", "fullName email");

    if (!record) return res.status(404).json(apiResponse(404, null, "Attendance not found"));
    return res.status(200).json(apiResponse(200, record, "Attendance fetched successfully"));
  } catch (err) {
    console.error("Get attendance error:", err);
    return res.status(500).json(apiResponse(500, null, "Internal server error"));
  }
};

// ---------------- UPDATE ----------------
export const updateAttendance = async (req, res) => {
  try {
    const record = await Attendance.findById(req.params.id);
    if (!record) return res.status(404).json(apiResponse(404, null, "Attendance not found"));

    const fields = ["student", "studentName", "date", "status", "class", "teacher"];
    fields.forEach((field) => {
      if (req.body[field] !== undefined && req.body[field] !== "") {
        record[field] = req.body[field];
      }
    });

    await record.save();

    const updated = await Attendance.findById(req.params.id)
      .populate("student", "fullName rollNumber")
      .populate("class", "name")
      .populate("teacher", "fullName email");

    return res.status(200).json(apiResponse(200, updated, "Attendance updated successfully"));
  } catch (err) {
    console.error("Update attendance error:", err);
    return res.status(500).json(apiResponse(500, null, "Internal server error"));
  }
};

// ---------------- DELETE ----------------
export const deleteAttendance = async (req, res) => {
  try {
    const record = await Attendance.findById(req.params.id);
    if (!record) return res.status(404).json(apiResponse(404, null, "Attendance not found"));

    await record.remove();
    return res.status(200).json(apiResponse(200, null, "Attendance deleted successfully"));
  } catch (err) {
    console.error("Delete attendance error:", err);
    return res.status(500).json(apiResponse(500, null, "Internal server error"));
  }
};