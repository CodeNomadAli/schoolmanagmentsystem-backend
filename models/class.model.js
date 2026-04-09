import mongoose from "mongoose";

const classSchema = new mongoose.Schema(
  {
    className: { type: String, required: true, trim: true },
    section: { type: String, required: true },

    grade: { type: String, required: true },

    room: { type: String },
    capacity: { type: Number, default: 0 },

   classTeacher: { type: mongoose.Schema.Types.ObjectId, ref: "Teacher" },


    description: { type: String },

    school_id: { type: String, required: true },
  },
  { timestamps: true }
);



const Class = mongoose.model("Class", classSchema);
export default Class;