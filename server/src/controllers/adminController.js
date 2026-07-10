import User from '../models/User.js';
import Profile from '../models/Profile.js';
import Challenge from '../models/Challenge.js';
import Achievement from '../models/Achievement.js';
import MotivationMessage from '../models/MotivationMessage.js';
import Notification from '../models/Notification.js';
import DailyEntry from '../models/DailyEntry.js';
import Campaign from '../models/Campaign.js';
import Announcement from '../models/Announcement.js';
import UserAchievement from '../models/UserAchievement.js';
import { AppError } from '../middleware/errorHandler.js';
import { getDashboardStats, getNotifications, getUnreadCount, markAsRead, createNotification } from '../services/notificationService.js';

// ============================================
// DASHBOARD
// ============================================
export const getDashboard = async (req, res, next) => {
  try {
    const stats = await getDashboardStats();
    const unreadCount = await getUnreadCount();
    const recentNotifications = await getNotifications(1, 10);

    res.status(200).json({
      success: true,
      data: { stats, unreadCount, recentNotifications: recentNotifications.notifications },
    });
  } catch (error) {
    next(error);
  }
};

// ============================================
// NOTIFICATIONS (SYSTEM PULSE)
// ============================================
export const getNotificationsList = async (req, res, next) => {
  try {
    const { page = 1, category = null } = req.query;
    const data = await getNotifications(parseInt(page), 20, category);
    const unreadCount = await getUnreadCount();

    res.status(200).json({
      success: true,
      data: { ...data, unreadCount },
    });
  } catch (error) {
    next(error);
  }
};

export const markNotificationRead = async (req, res, next) => {
  try {
    await markAsRead(req.params.id);
    const unreadCount = await getUnreadCount();
    res.status(200).json({ success: true, unreadCount });
  } catch (error) {
    next(error);
  }
};

// ============================================
// BUILDER MANAGEMENT
// ============================================
export const getBuilders = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, search = '', status = '' } = req.query;
    const filter = { role: 'user' };

    if (search) {
      filter.$or = [{ email: { $regex: search, $options: 'i' } }];
    }
    if (status) filter.accountStatus = status;

    const total = await User.countDocuments(filter);
    const builders = await User.find(filter)
      .select('-password -securityQuestions')
      .sort({ createdAt: -1 })
      .skip((parseInt(page) - 1) * parseInt(limit))
      .limit(parseInt(limit))
      .lean();

    const builderIds = builders.map(b => b._id);
    const profiles = await Profile.find({ user: { $in: builderIds } }).lean();
    const profileMap = {};
    profiles.forEach(p => { profileMap[p.user.toString()] = p; });

    const enriched = builders.map(b => ({
      ...b,
      profile: profileMap[b._id.toString()] || null,
    }));

    res.status(200).json({
      success: true,
      data: {
        builders: enriched,
        total,
        page: parseInt(page),
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getBuilderDetail = async (req, res, next) => {
  try {
    const builder = await User.findById(req.params.id).select('-password -securityQuestions').lean();
    if (!builder) throw new AppError('Builder not found', 404);

    const profile = await Profile.findOne({ user: builder._id }).lean();
    const totalCheckins = await DailyEntry.countDocuments({ user: builder._id });
    const challengesJoined = await Challenge.countDocuments({ 'participants.user': builder._id });
    const recentEntries = await DailyEntry.find({ user: builder._id }).sort({ date: -1 }).limit(10).lean();

    res.status(200).json({
      success: true,
      data: { builder, profile, stats: { totalCheckins, challengesJoined }, recentEntries },
    });
  } catch (error) {
    next(error);
  }
};

export const suspendBuilder = async (req, res, next) => {
  try {
    const builder = await User.findById(req.params.id);
    if (!builder) throw new AppError('Builder not found', 404);
    if (builder.role === 'admin') throw new AppError('Cannot suspend the Architect', 400);

    builder.accountStatus = 'suspended';
    builder.suspensionReason = 'admin_action';
    builder.deactivatedAt = new Date();
    await builder.save();

    await createNotification({
      type: 'builder_registered',
      category: 'builder',
      title: 'Builder Suspended',
      description: `${builder.email} has been suspended`,
      builder: builder._id,
      builderEmail: builder.email,
      priority: 'high',
    });

    res.status(200).json({ success: true, message: 'Builder suspended successfully' });
  } catch (error) {
    next(error);
  }
};

export const restoreBuilder = async (req, res, next) => {
  try {
    const builder = await User.findById(req.params.id);
    if (!builder) throw new AppError('Builder not found', 404);

    builder.accountStatus = 'active';
    builder.suspensionReason = null;
    builder.suspensionEndDate = null;
    builder.deactivatedAt = null;
    await builder.save();

    await createNotification({
      type: 'builder_registered',
      category: 'builder',
      title: 'Builder Restored',
      description: `${builder.email} has been restored`,
      builder: builder._id,
      builderEmail: builder.email,
      priority: 'normal',
    });

    res.status(200).json({ success: true, message: 'Builder restored successfully' });
  } catch (error) {
    next(error);
  }
};

export const deleteBuilder = async (req, res, next) => {
  try {
    const builder = await User.findById(req.params.id);
    if (!builder) throw new AppError('Builder not found', 404);
    if (builder.role === 'admin') throw new AppError('Cannot delete the Architect', 400);

    const email = builder.email;
    await Promise.all([
      Profile.deleteOne({ user: builder._id }),
      DailyEntry.deleteMany({ user: builder._id }),
      User.findByIdAndDelete(builder._id),
    ]);

    await createNotification({
      type: 'builder_deleted',
      category: 'builder',
      title: 'Builder Deleted',
      description: `${email} has been permanently deleted`,
      builderEmail: email,
      priority: 'critical',
    });

    res.status(200).json({ success: true, message: 'Builder deleted permanently' });
  } catch (error) {
    next(error);
  }
};

// ============================================
// CHALLENGE MANAGEMENT
// ============================================
export const adminGetChallenges = async (req, res, next) => {
  try {
    const challenges = await Challenge.find().populate('createdBy', 'email').sort({ createdAt: -1 }).lean({ virtuals: true });
    res.status(200).json({ success: true, data: { challenges } });
  } catch (error) {
    next(error);
  }
};

export const adminCreateChallenge = async (req, res, next) => {
  try {
    const challenge = await Challenge.create({ ...req.body, createdBy: req.user._id });
    await createNotification({
      type: 'challenge_created',
      category: 'challenge',
      title: 'New Challenge Created',
      description: `"${challenge.title}" has been created and advertised`,
      priority: 'normal',
    });
    const populated = await Challenge.findById(challenge._id).populate('createdBy', 'email').lean({ virtuals: true });
    res.status(201).json({ success: true, data: { challenge: populated } });
  } catch (error) {
    next(error);
  }
};

export const adminUpdateChallenge = async (req, res, next) => {
  try {
    const challenge = await Challenge.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true }).populate('createdBy', 'email').lean({ virtuals: true });
    if (!challenge) throw new AppError('Challenge not found', 404);
    res.status(200).json({ success: true, data: { challenge } });
  } catch (error) {
    next(error);
  }
};

export const adminDeleteChallenge = async (req, res, next) => {
  try {
    const challenge = await Challenge.findByIdAndDelete(req.params.id);
    if (!challenge) throw new AppError('Challenge not found', 404);
    await createNotification({
      type: 'challenge_completed',
      category: 'challenge',
      title: 'Challenge Deleted',
      description: `"${challenge.title}" has been removed`,
      priority: 'high',
    });
    res.status(200).json({ success: true, message: 'Challenge deleted' });
  } catch (error) {
    next(error);
  }
};

// ============================================
// ACHIEVEMENT MANAGEMENT
// ============================================
export const adminGetAchievements = async (req, res, next) => {
  try {
    const achievements = await Achievement.find().sort({ tier: 1, category: 1 });
    res.status(200).json({ success: true, data: { achievements } });
  } catch (error) {
    next(error);
  }
};

export const adminCreateAchievement = async (req, res, next) => {
  try {
    const achievement = await Achievement.create({ ...req.body, createdBy: req.user._id });
    await createNotification({
      type: 'achievement_unlocked',
      category: 'achievement',
      title: 'New Achievement Created',
      description: `"${achievement.title}" is now available`,
      priority: 'normal',
    });
    res.status(201).json({ success: true, data: { achievement } });
  } catch (error) {
    next(error);
  }
};

export const adminUpdateAchievement = async (req, res, next) => {
  try {
    const achievement = await Achievement.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!achievement) throw new AppError('Achievement not found', 404);
    res.status(200).json({ success: true, data: { achievement } });
  } catch (error) {
    next(error);
  }
};

export const adminDeleteAchievement = async (req, res, next) => {
  try {
    const achievement = await Achievement.findByIdAndDelete(req.params.id);
    if (!achievement) throw new AppError('Achievement not found', 404);
    await createNotification({
      type: 'achievement_unlocked',
      category: 'achievement',
      title: 'Achievement Deleted',
      description: `"${achievement.title}" has been removed`,
      priority: 'high',
    });
    res.status(200).json({ success: true, message: 'Achievement deleted' });
  } catch (error) {
    next(error);
  }
};

// ============================================
// MOTIVATION MANAGEMENT
// ============================================
export const adminGetMotivations = async (req, res, next) => {
  try {
    const messages = await MotivationMessage.find().sort({ category: 1, priority: -1 });
    res.status(200).json({ success: true, data: { messages } });
  } catch (error) {
    next(error);
  }
};

export const adminCreateMotivation = async (req, res, next) => {
  try {
    const message = await MotivationMessage.create({ ...req.body, createdBy: req.user._id });
    res.status(201).json({ success: true, data: { message } });
  } catch (error) {
    next(error);
  }
};

export const adminUpdateMotivation = async (req, res, next) => {
  try {
    const message = await MotivationMessage.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!message) throw new AppError('Message not found', 404);
    res.status(200).json({ success: true, data: { message } });
  } catch (error) {
    next(error);
  }
};

export const adminDeleteMotivation = async (req, res, next) => {
  try {
    await MotivationMessage.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'Message deleted' });
  } catch (error) {
    next(error);
  }
};

// ============================================
// CAMPAIGN MANAGEMENT
// ============================================
export const adminGetCampaigns = async (req, res, next) => {
  try {
    const campaigns = await Campaign.find().populate('challenges').sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: { campaigns } });
  } catch (error) {
    next(error);
  }
};

export const adminCreateCampaign = async (req, res, next) => {
  try {
    const campaign = await Campaign.create({ ...req.body, createdBy: req.user._id });
    await createNotification({
      type: 'campaign_started',
      category: 'platform',
      title: 'Campaign Created',
      description: `"${campaign.title}" campaign has been created`,
      priority: 'normal',
    });
    res.status(201).json({ success: true, data: { campaign } });
  } catch (error) {
    next(error);
  }
};

export const adminUpdateCampaign = async (req, res, next) => {
  try {
    const campaign = await Campaign.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!campaign) throw new AppError('Campaign not found', 404);
    res.status(200).json({ success: true, data: { campaign } });
  } catch (error) {
    next(error);
  }
};

export const adminDeleteCampaign = async (req, res, next) => {
  try {
    await Campaign.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'Campaign deleted' });
  } catch (error) {
    next(error);
  }
};

// ============================================
// ANNOUNCEMENT MANAGEMENT
// ============================================
export const adminGetAnnouncements = async (req, res, next) => {
  try {
    const announcements = await Announcement.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: { announcements } });
  } catch (error) {
    next(error);
  }
};

export const adminCreateAnnouncement = async (req, res, next) => {
  try {
    const announcement = await Announcement.create({ ...req.body, createdBy: req.user._id });
    await createNotification({
      type: 'announcement_published',
      category: 'platform',
      title: 'Announcement Created',
      description: `"${announcement.title}" has been created`,
      priority: 'normal',
    });
    res.status(201).json({ success: true, data: { announcement } });
  } catch (error) {
    next(error);
  }
};

export const adminUpdateAnnouncement = async (req, res, next) => {
  try {
    const announcement = await Announcement.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!announcement) throw new AppError('Announcement not found', 404);
    res.status(200).json({ success: true, data: { announcement } });
  } catch (error) {
    next(error);
  }
};

export const adminDeleteAnnouncement = async (req, res, next) => {
  try {
    await Announcement.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'Announcement deleted' });
  } catch (error) {
    next(error);
  }
};

// ============================================
// ANALYTICS
// ============================================
export const getAnalytics = async (req, res, next) => {
  try {
    const stats = await getDashboardStats();

    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const newThisWeek = await User.countDocuments({ role: 'user', createdAt: { $gte: weekAgo } });

    const monthStart = new Date();
    monthStart.setDate(1);
    monthStart.setHours(0, 0, 0, 0);
    const monthCheckins = await DailyEntry.countDocuments({ date: { $gte: monthStart.toISOString().split('T')[0] } });

    const achievementsByTier = await UserAchievement.aggregate([
      { $lookup: { from: 'achievements', localField: 'achievement', foreignField: '_id', as: 'achievement' } },
      { $unwind: '$achievement' },
      { $group: { _id: '$achievement.tier', count: { $sum: 1 } } },
    ]);

    res.status(200).json({
      success: true,
      data: {
        ...stats,
        newBuildersThisWeek: newThisWeek,
        monthCheckins,
        achievementsByTier,
      },
    });
  } catch (error) {
    next(error);
  }
};