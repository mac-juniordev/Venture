import mongoose from 'mongoose';

const userAchievementSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    achievement: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Achievement',
      required: true,
    },
    unlockedAt: {
      type: Date,
      default: Date.now,
    },
    progress: {
      type: Number,
      default: 0,
    },
    isNotified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for unique user-achievement pair
userAchievementSchema.index({ user: 1, achievement: 1 }, { unique: true });

const UserAchievement = mongoose.model('UserAchievement', userAchievementSchema);

export default UserAchievement;