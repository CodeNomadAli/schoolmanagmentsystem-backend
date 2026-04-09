import Timetable from "../models/timetable.model.js";
import Teacher from "../models/teacher.model.js";
import Class from "../models/class.model.js";
import { apiResponse } from "../helper.js";

// GET all timetables
export const getAllTimetables = async (req, res) => {
  try {
    const timetables = await Timetable.find({ school_id: req.user.school_id })
      .populate("timeSlots.teacher", "fullName email")
      .populate("timeSlots.class", "className grade section")
      .populate("classId", "className grade section");

    res.status(200).json(apiResponse(200, timetables));
  } catch (error) {
    res.status(500).json(apiResponse(500, null, error.message));
  }
};



export const addTimeSlot = async (req, res) => {
  try {
    const { classId, academicYear, semester, timeSlots } = req.body;

    if (!classId || !academicYear || !semester || !timeSlots?.length) {
      return res
        .status(400)
        .json(apiResponse(400, null, "Missing required fields or empty timeSlots"));
    }

    // Find or create timetable
    let timetable = await Timetable.findOne({ classId, academicYear, semester });

    if (!timetable) {
      timetable = new Timetable({
        classId,
        academicYear,
        semester,
        school_id: req.user.school_id,
        timeSlots: [],
      });
    }

    // Add new time slots
    timeSlots.forEach((slot) => {
      timetable.timeSlots.push({
        ...slot,
        class: classId, // required by schema
      });
    });

    await timetable.save();

    // Populate references correctly
    const populated = await Timetable.findById(timetable._id)
      .populate("timeSlots.teacher", "fullName email")
      .populate("timeSlots.class", "className grade section");

    res
      .status(201)
      .json(apiResponse(201, populated, "Time slot(s) added successfully"));
  } catch (error) {
    res.status(500).json(apiResponse(500, null, error.message));
  }
};

// DELETE a time slot
// DELETE a time slot
export const deleteTimeSlot = async (req, res) => {
  try {
    const { timetableId, slotId } = req.params;

    // 1️⃣ Find the timetable by ID
    const timetable = await Timetable.findById(timetableId);
    if (!timetable) {
      return res.status(404).json(apiResponse(404, null, "Timetable not found"));
    }
   
    
    // 2️⃣ Find the time slot inside timetable
    const slot = timetable.timeSlots.id(slotId);
    

    if (!slot) {
      return res.status(404).json(apiResponse(404, null, "Time slot not found"));
    }

    // 3️⃣ Remove the slot
      slot.deleteOne()

    // 4️⃣ Save the timetable
    await timetable.save();

    res.status(200).json(apiResponse(200, null, "Time slot deleted successfully"));
  } catch (error) {
    res.status(500).json(apiResponse(500, null, error.message));
  }
};