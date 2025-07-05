import mongoose from "mongoose";

import "./staff_permission.model.js"; // Import to register staff_Permission model

const staffRoleSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    permissions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "staff_Permission", // Ensure this matches the Permission model name
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Remove invalid email index since email field doesn't exist
// staffRoleSchema.index({ email: 1 }); // Removed

const StaffRole = mongoose.model("staff_roles", staffRoleSchema);
export default StaffRole;