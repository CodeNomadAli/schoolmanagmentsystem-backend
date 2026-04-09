import mongoose from "mongoose";

const transportSchema = new mongoose.Schema(
  {
    routeName: { type: String, required: true, trim: true },

    vehicleNo: { type: String, required: true, trim: true },

    driverName: { type: String, required: true, trim: true },

    capacity: { type: Number, required: true },

    assignedStudents: { type: Number, default: 0 },

    status: {
      type: String,
      enum: ["Active", "Inactive", "Full","Partial"],
      default: "Active",
    },

    school_id: { type: String, required: true },
  },
  { timestamps: true }
);

// 🔥 Unique vehicle per school
transportSchema.index(
  { vehicleNo: 1, school_id: 1 },
  { unique: true }
);

const Transport = mongoose.model("Transport", transportSchema);
export default Transport;