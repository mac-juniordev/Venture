import mongoose from 'mongoose';

const subscriptionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },
  plan: {
    type: String,
    enum: ['explorer', 'builder', 'visionary'],
    default: 'explorer',
  },
  status: {
    type: String,
    enum: ['active', 'cancelled', 'expired', 'past_due'],
    default: 'active',
  },
  billingCycle: {
    type: String,
    enum: ['monthly', 'yearly'],
    default: 'monthly',
  },
  startDate: {
    type: Date,
    default: Date.now,
  },
  endDate: Date,
  autoRenew: {
    type: Boolean,
    default: true,
  },
  paymentMethod: {
    type: String,
    enum: ['card', 'mtn_money', 'orange_money', 'none'],
    default: 'none',
  },
  paymentDetails: {
    lastFour: String,
    provider: String,
    phoneNumber: String,
  },
}, { timestamps: true });

const Subscription = mongoose.model('Subscription', subscriptionSchema);
export default Subscription;