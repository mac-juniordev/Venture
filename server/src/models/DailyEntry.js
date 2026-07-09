import mongoose from 'mongoose';

const dailyEntrySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    date: {
      type: String, // YYYY-MM-DD format
      required: true,
    },
    checkInTime: {
      type: Date,
      default: Date.now,
    },
    note: {
      type: String,
      maxlength: [500, 'Note cannot exceed 500 characters'],
    },
    mood: {
      type: String,
      enum: ['great', 'good', 'okay', 'struggling', ''],
      default: '',
    },
    tags: [{
      type: String,
      trim: true,
    }],
  },
  {
    timestamps: true,
  }
);

// Compound index to ensure one entry per user per day
dailyEntrySchema.index({ user: 1, date: 1 }, { unique: true });

const DailyEntry = mongoose.model('DailyEntry', dailyEntrySchema);

export default DailyEntry;