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
      default: 'Glory & XP',
      maxlength: [500, 'Reward cannot exceed 500 characters'],
    },
    penalty: {
      type: String,
      default: 'Lose 1 streak day',
      maxlength: [500, 'Penalty cannot exceed 500 characters'],
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
      default: 20,
      min: 2,
      max: 100,
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
    winner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
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
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

challengeSchema.virtual('participantCount').get(function () {
  return this.participants.length;
});

// Auto-set endDate to max 7 days from startDate
challengeSchema.pre('save', function (next) {
  if (this.isModified('startDate')) {
    const maxEnd = new Date(this.startDate);
    maxEnd.setDate(maxEnd.getDate() + 7);
    if (!this.endDate || this.endDate > maxEnd) {
      this.endDate = maxEnd;
    }
  }
  next();
});

const Challenge = mongoose.model('Challenge', challengeSchema);

export default Challenge;