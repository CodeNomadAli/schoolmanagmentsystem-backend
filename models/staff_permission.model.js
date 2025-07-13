import mongoose from 'mongoose';

const staffPermissionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Permission name is required'],
      unique: true,
      trim: true,
      minlength: [3, 'Permission name must be at least 3 characters long'],
    },
    slug: {
      type: String,
      required: [true, 'Permission slug is required'],
      unique: true,
      trim: true,
      lowercase: true, // Ensure slugs are lowercase for consistency
      match: [/^[a-z0-9-]+$/, 'Slug must contain only lowercase letters, numbers, and hyphens'],
    },
    description: {
      type: String,
      trim: true,
      default: '', // Provide a default empty string for optional description
    },
    groupId: {
      type: String,
      required: [true, 'Group ID is required'],
      trim: true,
    },
    groupName: {
      type: String,
      required: [true, 'Group name is required'],
      trim: true,
      minlength: [3, 'Group name must be at least 3 characters long'],
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
    toJSON: { virtuals: true }, // Include virtuals in JSON output
    toObject: { virtuals: true }, // Include virtuals in object output
  }
);

// Add index on slug for faster queries
staffPermissionSchema.index({ slug: 1 });

const StaffPermission = mongoose.model('StaffPermission', staffPermissionSchema);

export default StaffPermission;