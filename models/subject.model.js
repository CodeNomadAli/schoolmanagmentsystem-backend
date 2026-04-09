import mongoose from "mongoose";

const scheduleSchema = new mongoose.Schema({
  day: { type: String, required: true },
  time: { type: String, required: true },
  duration: { type: Number, required: true },
  room: { type: String },
});

const subjectSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    code: { type: String, required: true,  },
    description: { type: String },

    department: { type: String, required: true },
    credits: { type: Number, default: 3 },

    type: {
      type: String,
      enum: ["core", "elective", "practical"],
      default: "core",
    },

    grades: [{ type: String }],

    teachers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Teacher", // your teacher model
      },
    ],

    schedule: [scheduleSchema],

    totalClasses: { type: Number, default: 0 },
    completedClasses: { type: Number, default: 0 },

    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },

    syllabus: { type: String },

    school_id: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model("Subject", subjectSchema);