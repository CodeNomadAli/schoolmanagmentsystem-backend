import mongoose from "mongoose";

const roomSchema = new mongoose.Schema(
  {
    roomNumber: { type: String, required: true, trim: true },

    block: { type: String, required: true, trim: true },

    roomType: {
      type: String,
      enum: ["Single", "Double", "Lab", "Classroom", "Other","Triple"],
      default: "Single",
    },

    capacity: { type: Number, required: true },

    occupied: { type: Number, default: 0 },

    status: {
      type: String,
      enum: ["Available", "Full", "Maintenance","Partial"],
      default: "Available",
    },

    school_id: { type: String, required: true },
  },
  { timestamps: true }
);

// 🔥 Unique room per school
roomSchema.index(
  { roomNumber: 1, block: 1, school_id: 1 },
  { unique: true }
);

const Room = mongoose.model("Room", roomSchema);
export default Room;