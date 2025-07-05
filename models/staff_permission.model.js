import mongoose from 'mongoose';

const staffPermissionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  slug: {
    type: String,
    trim: true,
    required: true,
    unique: true
  }
}, {
  timestamps: true
});

const staffPermission = mongoose.model('staff_Permission', staffPermissionSchema);

export default staffPermission;
