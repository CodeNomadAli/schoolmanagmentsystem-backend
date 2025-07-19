import mongoose from "mongoose";
import slugify from "../utils/slugify.js";

const AilmentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
    },
    description: {
      type: String,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    remedies: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Remedy",
      default: null,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

AilmentSchema.pre("save", function (next) {
  if (this.isModified("name")) {
    this.slug = slugify(this.name, { lower: true, strict: true });
  }
  next();
});

AilmentSchema.index({ name: 1 }, { unique: true });
AilmentSchema.index({ slug: 1 }, { unique: true });

const Ailment = mongoose.model("Ailment", AilmentSchema);
export default Ailment;
