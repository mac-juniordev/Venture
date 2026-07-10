import mongoose from 'mongoose';

const campaignSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    motto: {
      type: String,
      trim: true,
    },
    description: String,
    theme: {
      type: String,
      default: 'default',
    },
    bannerUrl: String,
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    rewards: {
      type: String,
    },
    challenges: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Challenge',
    }],
    isActive: {
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

const Campaign = mongoose.model('Campaign', campaignSchema);

export default Campaign;