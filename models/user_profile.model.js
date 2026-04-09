
import mongoose from 'mongoose';

const userProfileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Make sure you have a User model defined
    required: true,
    unique: true,
  },
  firstName: {
    type: String,
    trim: true,
  },
  lastName: {
    type: String,
    trim: true,
  },
  phone : {
    type: String,
    trim: true,
  },
  profileImage: {
  type: {
    type: String,
  },
  source: {
    type: String,
  },
  originalName: {
    type: String,
  },
},
  
  
  lastUpdated: {
    type: Date,
    default: Date.now,
  },
  // for extra fields base on frontend fields
  address:{
    type:String,
  },
   isNotification: { type: Boolean, default: true }, // general notifications
  isEmail: { type: Boolean, default: true },
  isGrade: { type: Boolean, default: true },
  homeworkReminders: { type: Boolean, default: true }, // new
  reportNotifications: { type: Boolean, default: true }, // new
    security: {
    twoFactorAuth: { type: Boolean, default: false },
    sessionTimeout: { type: String, default: "60" }, // in minutes
  },

});

userProfileSchema.index({ userId: 1 });
const UserProfile = mongoose.model('UserProfile', userProfileSchema);

export default UserProfile;
