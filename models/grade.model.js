import mongoose from "mongoose";

const gradeSchema = new mongoose.Schema(
  {
    student: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true },
    subject: { type: mongoose.Schema.Types.ObjectId, ref: "Subject", required: true },

    grade: { type: String, required: true }, // A, B, C OR marks
    examDate: { type: Date, required: true },
    teacher: { type: mongoose.Schema.Types.ObjectId, ref: "Teacher", required: true },
    

    school_id: { type: String, required: true },
  },
  { timestamps: true }
);

const Grade = mongoose.model("Grade", gradeSchema);
export default Grade;