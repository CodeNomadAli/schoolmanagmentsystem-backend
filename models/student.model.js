import mongoose from "mongoose";

const studentSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    phone: { type: String, required: true },
    
    rollNumber: { type: String, required: true },

    class: { type: mongoose.Schema.Types.ObjectId, ref: "Class", required: true },

    section: { type: String, required: true },

    dateOfBirth: { type: Date },
    gender: { type: String, enum: ["male", "female", "other"] },
    bloodGroup: { type: String },

    parent: { type: mongoose.Schema.Types.ObjectId, ref: "Parent" },

    address: { type: String },

    school_id: { type: String, required: true },

    password: { type: String, required: true },
  },
  { timestamps: true }
);

// 🔥 Unique per school (VERY IMPORTANT)


const Student = mongoose.model("Student", studentSchema);
export default Student;