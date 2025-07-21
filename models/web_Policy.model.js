
import mongoose from 'mongoose';


const WebPoliciesSchema = new mongoose.Schema({
  title: {
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
  description:{
    type: String,
    required: true,
      },
  createdBy:{
    type: String,
    required: true,
    trim: true,
  },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
)

export default mongoose.model('WebPolicies', WebPoliciesSchema)