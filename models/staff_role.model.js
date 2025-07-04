// server/models/userModel.js
import mongoose from "mongoose";


const staffRoleSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
      },
  {
    timestamps: true,
  }
);


// index for frequent lookups
staffRoleSchema.index({ email: 1 });
const User = mongoose.model("staff_roles", staffRoleSchema);
export default User;
