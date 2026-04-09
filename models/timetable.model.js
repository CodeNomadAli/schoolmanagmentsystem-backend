import mongoose from "mongoose";

const timeSlotSchema = new mongoose.Schema(
  {
    day: { type: String, required: true },
    time: { type: String, required: true },
    duration: { type: Number, required: true },
    subject: { type: String, required: true },
    teacher: { type: mongoose.Schema.Types.ObjectId, ref: "Teacher", required: true },
    class: { type: mongoose.Schema.Types.ObjectId, ref: "Class", required: true },
    room: { type: String },
    type: { type: String, enum: ["regular", "practical", "exam", "break"], default: "regular" },
    status: { type: String, enum: ["scheduled", "completed", "cancelled"], default: "scheduled" },
  },
  { _id: true }
);

const timetableSchema = new mongoose.Schema(
  {
    classId: { type: mongoose.Schema.Types.ObjectId, ref: "Class", required: true },
    academicYear: { type: String, required: true },
    semester: { type: String, required: true },
    timeSlots: [timeSlotSchema],
    school_id: { type: String, required: true },
  },
  { timestamps: true }
);

const Timetable = mongoose.model("Timetable", timetableSchema);
export default Timetable;