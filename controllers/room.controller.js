import Room from "../models/room.model.js";
import { apiResponse } from "../helper.js";

// ---------------- CREATE ----------------
export const addRoom = async (req, res) => {
  try {
    const { roomNumber, block, roomType, capacity, occupied, status } = req.body;
    const school_id = req.user.school_id;

    const existing = await Room.findOne({ roomNumber, block, school_id });

    if (existing) {
      return res
        .status(409)
        .json(apiResponse(409, null, "Room already exists in this block"));
    }

    const room = await Room.create({
      roomNumber,
      block,
      roomType,
      capacity,
      occupied: occupied || 0,
      status,
      school_id,
    });

    return res
      .status(201)
      .json(apiResponse(201, room, "Room added successfully"));
  } catch (err) {
    console.error("Add room error:", err);
    return res
      .status(500)
      .json(apiResponse(500, null, "Internal server error"));
  }
};

// ---------------- GET ALL ----------------
export const getRooms = async (req, res) => {
  try {
    const rooms = await Room.find({ school_id: req.user.school_id });

    return res
      .status(200)
      .json(apiResponse(200, rooms, "Rooms fetched successfully"));
  } catch (err) {
    console.error("Get rooms error:", err);
    return res
      .status(500)
      .json(apiResponse(500, null, "Internal server error"));
  }
};

// ---------------- GET ONE ----------------
export const getRoomById = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);

    if (!room) {
      return res
        .status(404)
        .json(apiResponse(404, null, "Room not found"));
    }

    return res
      .status(200)
      .json(apiResponse(200, room, "Room fetched successfully"));
  } catch (err) {
    console.error("Get room error:", err);
    return res
      .status(500)
      .json(apiResponse(500, null, "Internal server error"));
  }
};

// ---------------- UPDATE ----------------
export const updateRoom = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);

    if (!room) {
      return res
        .status(404)
        .json(apiResponse(404, null, "Room not found"));
    }

    Object.keys(req.body).forEach((key) => {
      if (req.body[key] !== undefined && req.body[key] !== "") {
        room[key] = req.body[key];
      }
    });

    // 🔥 Auto status logic
    if (room.occupied >= room.capacity) {
      room.status = "Full";
    } else if (room.occupied === 0) {
      room.status = "Available";
    } else {
      room.status = "Partial";
    }

    await room.save();

    return res
      .status(200)
      .json(apiResponse(200, room, "Room updated successfully"));
  } catch (err) {
    console.error("Update room error:", err);
    return res
      .status(500)
      .json(apiResponse(500, null, "Internal server error"));
  }
};

// ---------------- DELETE ----------------
export const deleteRoom = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);

    if (!room) {
      return res
        .status(404)
        .json(apiResponse(404, null, "Room not found"));
    }

    await room.remove();

    return res
      .status(200)
      .json(apiResponse(200, null, "Room deleted successfully"));
  } catch (err) {
    console.error("Delete room error:", err);
    return res
      .status(500)
      .json(apiResponse(500, null, "Internal server error"));
  }
};