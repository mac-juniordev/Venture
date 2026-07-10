import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: true,
      enum: [
        'builder_registered', 'builder_deleted', 'profile_updated',
        'checkin_completed', 'streak_milestone',
        'challenge_created', 'challenge_joined', 'challenge_completed',
        'achievement_unlocked',
        'password_reset', 'password_changed', 'login_activity',
        'campaign_started', 'announcement_published',
      ],
    },
    category: {
      type: String,
      required: true,
      enum: ['builder', 'growth', 'challenge', 'achievement', 'security', 'platform'],
    },
    title: {
      type: String,
      required: true,
    },
    description: String,
    builder: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    builderEmail: String,
    metadata: mongoose.Schema.Types.Mixed,
    isRead: {
      type: Boolean,
      default: false,
    },
    priority: {
      type: String,
      enum: ['low', 'normal', 'high', 'critical'],
      default: 'normal',
    },
  },
  {
    timestamps: true,
  }
);

notificationSchema.index({ isRead: 1, createdAt: -1 });
notificationSchema.index({ category: 1 });

const Notification = mongoose.model('Notification', notificationSchema);

export default Notification;