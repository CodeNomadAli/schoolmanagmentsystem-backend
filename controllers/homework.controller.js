import Homework from "../models/homework.model.js";

import { apiResponse } from "../helper.js";

// ✅ CREATE
export const createHomework = async (req, res) => {
  try {
    const {
      title,
      description,
      subject,
      teacher,
      class: classId,
      assignedDate,
      dueDate,
      priority = "medium",
      maxMarks = 100,
      instructions = "",
    } = req.body;

    if (!req.user?.school_id) {
      return res
        .status(401)
        .json(apiResponse(401, null, "Unauthorized: school ID missing"));
    }

    // Validate required fields
    if (!title || !subject || !teacher || !classId || !assignedDate || !dueDate) {
      return res
        .status(400)
        .json(apiResponse(400, null, "Missing required fields"));
    }

    const homeworkData = {
      title,
      description,
      subject,
      teacher,
      class: classId,
      assignedDate,
      dueDate,
      priority,
      maxMarks,
      instructions,
      school_id: req.user.school_id,
      totalStudents: 0,      // default, can update later
      submittedCount: 0,     // default
      gradedCount: 0,        // default
      status: "assigned",    // default
    };

    const homework = await Homework.create(homeworkData);

    return res
      .status(201)
      .json(apiResponse(201, homework, "Homework created successfully"));
  } catch (error) {
    console.error("Create Homework Error:", error);
    return res
      .status(500)
      .json(apiResponse(500, null, "Failed to create homework"));
  }
};


// ✅ GET ALL
export const getAllHomework = async (req, res) => {
  try {
    const homework = await Homework.find()
      .populate("teacher", "fullName email")
      .populate("subject", "name code")
      .populate("class", "className");

    return res.status(200).json(
      apiResponse(200, homework, "Homework fetched successfully")
    );
  } catch (error) {
    return res.status(500).json(
      apiResponse(500, null, "Failed to fetch homework")
    );
  }
};


// ✅ GET SINGLE
export const getHomeworkById = async (req, res) => {
  try {
    const { id } = req.params;

    const homework = await Homework.findById(id)
      .populate("teacher")
      .populate("subject")
      .populate("class");

    if (!homework) {
      return res.status(404).json(
        apiResponse(404, null, "Homework not found")
      );
    }

    return res.status(200).json(
      apiResponse(200, homework, "Homework fetched")
    );
  } catch (error) {
    return res.status(500).json(
      apiResponse(500, null, "Error fetching homework")
    );
  }
};


// ✅ UPDATE
export const updateHomework = async (req, res) => {
  try {
    const { id } = req.params;
    const homework = await Homework.findById(id);

    if (!homework) {
      return res.status(404).json(apiResponse(404, null, "Homework not found"));
    }

    // List of fields to update
    const fields = [
      "title",
      "description",
      "subject",
      "teacher",
      "class",
      "assignedDate",
      "dueDate",
      "priority",
      "maxMarks",
      "instructions",
      "status"
    ];

    fields.forEach(field => {
      // Only update if field exists AND is not empty string
      if (req.body[field] !== undefined && req.body[field] !== "") {
        homework[field] = req.body[field];
      }
    });

    await homework.save();

    const updatedHomework = await Homework.findById(id)
      .populate("teacher", "fullName email")
      .populate("subject", "name code")
      .populate("class", "name");

    return res.status(200).json(apiResponse(200, updatedHomework, "Homework updated"));
  } catch (error) {
    console.error("Update Homework Error:", error);
    return res.status(500).json(apiResponse(500, null, "Failed to update homework"));
  }
};

// ✅ DELETE
export const deleteHomework = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await Homework.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json(
        apiResponse(404, null, "Homework not found")
      );
    }

    return res.status(200).json(
      apiResponse(200, null, "Homework deleted")
    );
  } catch (error) {
    return res.status(500).json(
      apiResponse(500, null, "Failed to delete")
    );
  }
};