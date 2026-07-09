import mongoose from 'mongoose';

const challengeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Challenge title is required'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    description: {
      type: String,
      required: [true, 'Challenge description is required'],
      maxlength: [1000, 'Description cannot exceed 1000 characters'],
    },
    category: {
      type: String,
      required: true,
      enum: ['coding', 'design', 'reading', 'fitness', 'business', 'writing', 'other'],
    },
    rules: {
      type: String,
      required: [true, 'Challenge rules are required'],
      maxlength: [2000, 'Rules cannot exceed 2000 characters'],
    },
    reward: {
      type: String,
      required: [true, 'Reward/Glory is required'],
      maxlength: [500, 'Reward cannot exceed 500 characters'],
    },
    penalty: {
      type: String,
      default: 'Lose 1 streak day',
      maxlength: [500, 'Penalty cannot exceed 500 characters'],
    },
    bonus: {
      type: String,
      default: '',
      maxlength: [500, 'Bonus cannot exceed 500 characters'],
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    difficulty: {
      type: String,
      enum: ['easy', 'medium', 'hard', 'legendary'],
      default: 'medium',
    },
    maxParticipants: {
      type: Number,
      default: 50,
      min: 2,
      max: 500,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    status: {
      type: String,
      enum: ['upcoming', 'active', 'completed', 'cancelled'],
      default: 'upcoming',
    },
    participants: [{
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
      joinedAt: {
        type: Date,
        default: Date.now,
      },
      progress: {
        type: Number,
        default: 0,
        min: 0,
        max: 100,
      },
      completed: {
        type: Boolean,
        default: false,
      },
      completedAt: Date,
      streakDuringChallenge: {
        type: Number,
        default: 0,
      },
    }],
    tags: [String],
  },
  {
    timestamps: true,
  }
);

challengeSchema.virtual('participantCount').get(function () {
  return this.participants.length;
});

challengeSchema.set('toJSON', { virtuals: true });
challengeSchema.set('toObject', { virtuals: true });

const Challenge = mongoose.model('Challenge', challengeSchema);

export default Challenge;