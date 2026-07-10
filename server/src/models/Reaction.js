import mongoose from 'mongoose';

const reactionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    targetUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    targetType: {
      type: String,
      enum: ['checkin', 'achievement', 'challenge_completion', 'streak_milestone'],
      required: true,
    },
    targetId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    reaction: {
      type: String,
      enum: ['fire', 'muscle', 'party', 'rocket', 'clap', 'star'],
      required: true,
    },
    message: {
      type: String,
      maxlength: [200, 'Message cannot exceed 200 characters'],
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate reactions from same user on same target
reactionSchema.index({ user: 1, targetType: 1, targetId: 1 }, { unique: true });

const Reaction = mongoose.model('Reaction', reactionSchema);

export default Reaction;