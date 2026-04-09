import Subject from "../models/subject.model.js";

import { apiResponse } from "../helper.js";
// ✅ CREATE SUBJECT
export const createSubject = async (req, res) => {
  try {
    const data = req.body;

    const subject = await Subject.create({
      ...data,
      school_id: req.user.school_id,
    });

    const populated = await Subject.findById(subject._id)
      .populate("teachers", "fullName email");

    res.status(201).json(
      apiResponse(201, populated, "Subject created successfully")
    );
  } catch (error) {
    res.status(500).json(apiResponse(500, null, error.message));
  }
};


// ✅ GET ALL SUBJECTS
export const getSubjects = async (req, res) => {
  try {
    const subjects = await Subject.find({
      school_id: req.user.school_id,
    })
      .populate("teachers", "fullName email")
      .sort({ createdAt: -1 });

    res.status(200).json(
      apiResponse(200, subjects, "Subjects fetched successfully")
    );
  } catch (error) {
    res.status(500).json(apiResponse(500, null, error.message));
  }
};


// ✅ GET SINGLE SUBJECT
export const getSubjectById = async (req, res) => {
  try {
    const subject = await Subject.findOne({
      _id: req.params.id,
      school_id: req.user.school_id,
    }).populate("teachers", "fullName email");

    if (!subject) {
      return res
        .status(404)
        .json(apiResponse(404, null, "Subject not found"));
    }

    res.status(200).json(
      apiResponse(200, subject, "Subject fetched successfully")
    );
  } catch (error) {
    res.status(500).json(apiResponse(500, null, error.message));
  }
};


// ✅ UPDATE SUBJECT
export const updateSubject = async (req, res) => {
  try {
    const subject = await Subject.findOneAndUpdate(
      {
        _id: req.params.id,
        school_id: req.user.school_id,
      },
      req.body,
      { new: true }
    ).populate("teachers", "fullName email");

    if (!subject) {
      return res
        .status(404)
        .json(apiResponse(404, null, "Subject not found"));
    }

    res.status(200).json(
      apiResponse(200, subject, "Subject updated successfully")
    );
  } catch (error) {
    res.status(500).json(apiResponse(500, null, error.message));
  }
};


// ✅ DELETE SUBJECT
export const deleteSubject = async (req, res) => {
  try {
    const subject = await Subject.findOneAndDelete({
      _id: req.params.id,
      school_id: req.user.school_id,
    });

    if (!subject) {
      return res
        .status(404)
        .json(apiResponse(404, null, "Subject not found"));
    }

    res.status(200).json(
      apiResponse(200, null, "Subject deleted successfully")
    );
  } catch (error) {
    res.status(500).json(apiResponse(500, null, error.message));
  }
};

export const addTeacherToSubject = async (req, res) => {
  try {
    const { subjectId, teacherId } = req.body;

    const subject = await Subject.findOneAndUpdate(
      { _id: subjectId, school_id: req.user.school_id },
      { $addToSet: { teachers: teacherId } }, // avoid duplicates
      { new: true }
    ).populate("teachers", "fullName email");

    if (!subject) {
      return res.status(404).json(apiResponse(404, null, "Subject not found"));
    }

    res.status(200).json(apiResponse(200, subject, "Teacher added"));
  } catch (error) {
    res.status(500).json(apiResponse(500, null, error.message));
  }
};

export const removeTeacherFromSubject = async (req, res) => {
  try {
    const { subjectId, teacherId } = req.body;

    const subject = await Subject.findOneAndUpdate(
      { _id: subjectId, school_id: req.user.school_id },
      { $pull: { teachers: teacherId } },
      { new: true }
    ).populate("teachers", "fullName email");

    if (!subject) {
      return res.status(404).json(apiResponse(404, null, "Subject not found"));
    }

    res.status(200).json(apiResponse(200, subject, "Teacher removed"));
  } catch (error) {
    res.status(500).json(apiResponse(500, null, error.message));
  }
};