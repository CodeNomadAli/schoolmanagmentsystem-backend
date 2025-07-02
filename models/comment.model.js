import mongoose, { Schema } from 'mongoose';

const commentSchema = new mongoose.Schema({
  content: {
    type: String,
    required: [true, 'Comment content is required'],
    trim: true,
    maxLength: [1000, 'Comment cannot exceed 1000 characters']
  },
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  remedyId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Remedy',
  },
  parentCommentId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Comment',
},
  level: {
    type: Number,
    default: 0,
    min: [0, 'Level cannot be negative']
  },
  upvotes: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  upvoteCount: {
    type: Number,
    default: 0,
    min: 0
  },
  status: {
    type: String,
    enum:  ['pending', 'approved', 'rejected'],
    
    default: 'pending'
  },
}, {
  timestamps: true,
});


const Comment = mongoose.model('Comment', commentSchema);
export default Comment;
