import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    targetType: {
      type: String,
      enum: ['checkin'],
      required: true,
    },
    targetId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    content: {
      type: String,
      required: [true, 'Comment cannot be empty'],
      maxlength: [280, 'Comment must be under 280 characters'],
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// One comment per user per target
commentSchema.index({ user: 1, targetType: 1, targetId: 1 }, { unique: true });

const Comment = mongoose.model('Comment', commentSchema);

export default Comment;