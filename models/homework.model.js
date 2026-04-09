import mongoose from "mongoose";

const homeworkSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },

    description: {
      type: String,
    },

    subject: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subject",
      required: true,
    },

    class: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Class", // make sure you have Class model
      required: true,
    },

    teacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Teacher",
      required: true,
    },

    assignedDate: {
      type: Date,
      default: Date.now,
    },

    dueDate: {
      type: Date,
      required: true,
    },

    status: {
      type: String,
      enum: ["assigned", "submitted", "graded", "overdue"],
      default: "assigned",
    },

    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },

    totalStudents: {
      type: Number,
      default: 0,
    },

    submittedCount: {
      type: Number,
      default: 0,
    },

    gradedCount: {
      type: Number,
      default: 0,
    },

    attachments: [
      {
        type: String, // file URLs
      },
    ],

    instructions: {
      type: String,
    },

    maxMarks: {
      type: Number,
      default: 100,
    },

    averageScore: {
      type: Number,
    },

    school_id: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Homework", homeworkSchema);