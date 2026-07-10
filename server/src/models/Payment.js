import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    subscription: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Subscription',
    },
    amount: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      default: 'XAF', // Central African CFA Franc
      enum: ['XAF', 'USD', 'EUR'],
    },
    method: {
      type: String,
      required: true,
      enum: ['card', 'mtn_money', 'orange_money'],
    },
    status: {
      type: String,
      enum: ['pending', 'processing', 'completed', 'failed', 'refunded', 'cancelled'],
      default: 'pending',
    },
    provider: {
      type: String,
      // 'stripe' for cards, 'mtn_cm' for MTN, 'orange_cm' for Orange
      enum: ['stripe', 'mtn_cm', 'orange_cm', 'manual'],
    },
    providerReference: String, // Transaction ID from provider
    providerData: mongoose.Schema.Types.Mixed, // Raw response from provider
    plan: {
      type: String,
      enum: ['builder', 'visionary'],
    },
    billingCycle: {
      type: String,
      enum: ['monthly', 'yearly'],
    },
    phoneNumber: String, // For mobile money
    description: String,
    metadata: mongoose.Schema.Types.Mixed,
    paidAt: Date,
    refundedAt: Date,
    failureReason: String,
  },
  {
    timestamps: true,
  }
);

paymentSchema.index({ user: 1, createdAt: -1 });
paymentSchema.index({ providerReference: 1 });
paymentSchema.index({ status: 1 });

const Payment = mongoose.model('Payment', paymentSchema);

export default Payment;