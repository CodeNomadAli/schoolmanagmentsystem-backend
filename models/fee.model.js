import mongoose from "mongoose";

const feeSchema = new mongoose.Schema(
  {
    student: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true },

    feeType: {
      type: String,
      enum: ["Tuition", "Transport", "Library", "Exam", "Other"],
      default: "Tuition",
    },

    amount: { type: Number, required: true },

    dueDate: { type: Date, required: true },

    status: {
      type: String,
      enum: ["Pending", "Paid", "Overdue"],
      default: "Pending",
    },

    school_id: { type: String, required: true },
  },
  { timestamps: true }
);

const Fee = mongoose.model("Fee", feeSchema);
export default Fee;