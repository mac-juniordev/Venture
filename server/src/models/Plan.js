import mongoose from 'mongoose';

const planSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    enum: ['explorer', 'builder', 'visionary'],
    unique: true,
  },
  displayName: {
    type: String,
    required: true,
  },
  description: String,
  monthlyPrice: {
    type: Number,
    required: true,
  },
  yearlyPrice: {
    type: Number,
    required: true,
  },
  features: [{
    name: String,
    description: String,
    limit: Number, // null = unlimited
  }],
  isActive: {
    type: Boolean,
    default: true,
  },
}, { timestamps: true });

const Plan = mongoose.model('Plan', planSchema);
export default Plan;