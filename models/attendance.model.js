import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema(
  {
    student: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true },

    date: { type: Date, required: true },

    status: {
      type: String,
      enum: ["Present", "Absent", "Late"],
      default: "Present",
    },

    class:  { type: mongoose.Schema.Types.ObjectId, ref: "Class", required: true },

    teacher:  { type: mongoose.Schema.Types.ObjectId, ref: "Teacher", required: true },

    school_id: { type: String, required: true },
  },
  { timestamps: true }
);



const Attendance = mongoose.model("Attendance", attendanceSchema);
export default Attendance;