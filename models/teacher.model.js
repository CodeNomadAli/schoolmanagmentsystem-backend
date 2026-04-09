import mongoose from "mongoose";

const teacherSchema = new mongoose.Schema(
    {
        fullName: { type: String, required: true, trim: true },
        email: { type: String, required: true, unique: true, lowercase: true },
        phone: { type: String, required: true },
        school_id: { type: String, required: true, },
        department: { type: String, required: true },
        qualification: { type: String },
        experienceYears: { type: Number, default: 0 },
        salary: { type: Number, default: 0 },
        gender: { type: String, enum: ["male", "female", "other"] },
        address: { type: String },
        
        password: { type: String, required: true }, // auto-generated
    },
    { timestamps: true }
);

const Teacher = mongoose.model("Teacher", teacherSchema);
export default Teacher;