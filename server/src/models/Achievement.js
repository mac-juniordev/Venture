import mongoose from 'mongoose';

const achievementSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Achievement title is required'],
      unique: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      maxlength: [300, 'Description too long'],
    },
    icon: {
      type: String,
      required: true,
      enum: [
        'flame', 'star', 'trophy', 'crown', 'zap', 'target',
        'shield', 'gem', 'rocket', 'heart', 'bolt', 'moon',
        'sun', 'compass', 'diamond', 'fire', 'leaf', 'wave', 'sword'
      ],
    },
    category: {
      type: String,
      required: true,
      enum: ['streak', 'checkin', 'challenge', 'social', 'special', 'milestone'],
    },
    tier: {
      type: String,
      required: true,
      enum: ['bronze', 'silver', 'gold', 'platinum', 'legendary'],
      default: 'bronze',
    },
    requirement: {
      type: {
        type: String,
        enum: ['streak_days', 'total_checkins', 'challenges_completed', 'challenges_won', 'reactions_received', 'profile_complete', 'custom'],
        required: true,
      },
      value: {
        type: Number,
        required: true,
      },
    },
    xpReward: {
      type: Number,
      default: 50,
      min: 10,
      max: 10000,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isHidden: {
      type: Boolean,
      default: false,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

// Virtual for full tier name
achievementSchema.virtual('tierName').get(function () {
  const names = {
    bronze: '🥉 Bronze',
    silver: '🥈 Silver',
    gold: '🥇 Gold',
    platinum: '💎 Platinum',
    legendary: '👑 Legendary',
  };
  return names[this.tier] || this.tier;
});

achievementSchema.set('toJSON', { virtuals: true });
achievementSchema.set('toObject', { virtuals: true });

const Achievement = mongoose.model('Achievement', achievementSchema);

export default Achievement;