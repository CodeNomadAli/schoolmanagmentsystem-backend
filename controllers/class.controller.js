import Class from "../models/class.model.js";
import Teacher from "../models/teacher.model.js";
import { apiResponse } from "../helper.js";

// ---------------- CREATE ----------------
export const addClass = async (req, res) => {
  try {
    const {
      className,
      section,
      grade,
      room,
      capacity,
      classTeacherId,
      description,
    } = req.body;

    const school_id = req.user.school_id;

    const existingClass = await Class.findOne({
      className,
      section,
      school_id,
    });

    if (existingClass) {
      return res
        .status(409)
        .json(apiResponse(409, null, "Class already exists"));
    }

    let teacher = null;
    if (classTeacherId) {
      teacher = await Teacher.findById(classTeacherId);
      if (!teacher) {
        return res
          .status(404)
          .json(apiResponse(404, null, "Teacher not found"));
      }
    }

    const newClass = await Class.create({
      className,
      section,
      grade,
      room,
      capacity,
      classTeacher: teacher?._id || null,
      description,
      school_id,
    });

    return res
      .status(201)
      .json(apiResponse(201, newClass, "Class created successfully"));
  } catch (err) {
    console.error("Add class error:", err);
    return res
      .status(500)
      .json(apiResponse(500, null, "Internal server error"));
  }
};

// ---------------- GET ALL ----------------
export const getClasses = async (req, res) => {
  try {
    const classes = await Class.find({
      school_id: req.user.school_id,
    }).populate("classTeacher", "fullName email");

    return res
      .status(200)
      .json(apiResponse(200, classes, "Classes fetched successfully"));
  } catch (err) {
    console.error("Get classes error:", err);
    return res
      .status(500)
      .json(apiResponse(500, null, "Error fetching classes"));
  }
};

// ---------------- GET ONE ----------------
export const getClassById = async (req, res) => {
  try {
    const classData = await Class.findById(req.params.id).populate(
      "classTeacher",
      "fullName email"
    );

    if (!classData) {
      return res
        .status(404)
        .json(apiResponse(404, null, "Class not found"));
    }

    return res
      .status(200)
      .json(apiResponse(200, classData, "Class fetched successfully"));
  } catch (err) {
    console.error("Get class error:", err);
    return res
      .status(500)
      .json(apiResponse(500, null, "Error fetching class"));
  }
};

// ---------------- UPDATE ----------------
export const updateClass = async (req, res) => {
  try {
    const classData = await Class.findById(req.params.id);

    if (!classData) {
      return res
        .status(404)
        .json(apiResponse(404, null, "Class not found"));
    }

    if (req.body.classTeacherId) {
      const teacher = await Teacher.findById(req.body.classTeacherId);
      if (!teacher) {
        return res
          .status(404)
          .json(apiResponse(404, null, "Teacher not found"));
      }
      req.body.classTeacher = teacher._id;
      delete req.body.classTeacherId;
    }

    Object.assign(classData, req.body);
    await classData.save();

    return res
      .status(200)
      .json(apiResponse(200, classData, "Class updated successfully"));
  } catch (err) {
    console.error("Update class error:", err);
    return res
      .status(500)
      .json(apiResponse(500, null, "Error updating class"));
  }
};

// ---------------- DELETE ----------------
export const deleteClass = async (req, res) => {
  try {
    const classData = await Class.findByIdAndDelete(req.params.id);

    if (!classData) {
      return res
        .status(404)
        .json(apiResponse(404, null, "Class not found"));
    }

    return res
      .status(200)
      .json(apiResponse(200, null, "Class deleted successfully"));
  } catch (err) {
    console.error("Delete class error:", err);
    return res
      .status(500)
      .json(apiResponse(500, null, "Error deleting class"));
  }
};