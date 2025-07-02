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
  age: {
    type: Number,
    min: 0,
  },
  sex: {
    type: String,
    enum: ['male', 'female', 'other',"nonbinary"],// maybe update this in future
  },
  weight: {
    type: Number,// in kg
    min: 0,
  },
  height: {
    type: Number,// in cm 
    min: 0,
  },
  bloodType: {
    type: String,
    enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'Unknown'],// maybe update this in future
    default: 'Unknown',
  },
 
  allergies: {
    type: [String],
    default: [],
  },
  chronicConditions: {
    type: [String],
    default: [],
  },
  medications: {
    type: [String],
    default: [],
  },
  familyHistory: {
    type: [String],
    default: [],
  },
  dataShareConsent: {
    type: Boolean,
    default: false,
  },
  preferredLanguage: {
    type: String,
    default: 'en',
  },
  lastUpdated: {
    type: Date,
    default: Date.now,
  },
  // for extra fields base on frontend fields
  located:{
    type:String,
  },
  ethnicity:{
    type:String
  },
  birthplace:{
    type:String,
  },
  diet:{
    type:String,
  },

});

userProfileSchema.index({ userId: 1 });
const UserProfile = mongoose.model('UserProfile', userProfileSchema);

export default UserProfile;
