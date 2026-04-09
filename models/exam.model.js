import mongoose from "mongoose";

const examSchema = new mongoose.Schema(
  {
    examTitle: { type: String, required: true, trim: true },
    subject: { type: mongoose.Schema.Types.ObjectId, ref: "Subject", required: true },
    class: { type: mongoose.Schema.Types.ObjectId, ref: "Class", required: true },
    teacher: { type: mongoose.Schema.Types.ObjectId, ref: "Teacher", required: true },
    examType: { type: String, enum: ["Midterm", "Final", "Quiz", "Other"], default: "Midterm" },
    examDate: { type: Date, required: true },
    startTime: { type: String, required: true },
    duration: { type: Number, default: 0 }, // in minutes
    room: { type: String, trim: true },
    totalMarks: { type: Number, default: 0 },
    passingMarks: { type: Number, default: 0 },
    totalStudents: { type: Number, default: 0 },
    description: { type: String, trim: true },
    status: { type: String, trim: true },
   instructions: { type: String, trim: true },
    school_id: { type: String, required: true },
  },
  { timestamps: true }
);

const Exam = mongoose.model("Exam", examSchema);
export default Exam;