import mongoose from "mongoose";

const parentSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    phone: { type: String, required: true },
  
    occupation: { type: String },
    relation: { type: String, enum: ["father", "mother", "guardian"] },
    emergencyContact: { type: String },
    status : { type: String,default:  "active" },
    address: { type: String },

    school_id: { type: String, required: true },

    password: { type: String, required: true },
  },
  { timestamps: true }
);

// 🔥 Unique per school
parentSchema.index({ email: 1, school_id: 1 }, { unique: true });

const Parent = mongoose.model("Parent", parentSchema);
export default Parent;