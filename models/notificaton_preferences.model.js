import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true }, // e.g., "Fee Payment Reminder – Term 2"
    shortCode: { type: String, trim: true }, // e.g., "AC" for Accounts, "PR" for Principal
    postedBy: { type: String, trim: true }, // e.g., "Accounts Dept", "Principal"
    department: { type: String, trim: true }, // e.g., "Finance", "Administration"
    message: { type: String, required: true, trim: true }, // full notification text
    type: { type: String, enum: ["info", "urgent", "reminder", "event"], default: "info" },
    targetAudience: { type: String, enum: ["All", "Students", "Teachers", "Parents"], default: "All" }, // optional
    school_id: { type: String, required: true }, // for multi-school setup
    readBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // track who read it
  },
  { timestamps: true } // automatically adds createdAt and updatedAt
);

// Optional: index by school_id and createdAt for quick retrieval


const Notification = mongoose.model("Notification", notificationSchema);
export default Notification;