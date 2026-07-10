import Notification from '../models/Notification.js';
import User from '../models/User.js';
import Challenge from '../models/Challenge.js';
import DailyEntry from '../models/DailyEntry.js';
import UserAchievement from '../models/UserAchievement.js';

export const createNotification = async (data) => {
  return await Notification.create({
    type: data.type,
    category: data.category,
    title: data.title,
    description: data.description || '',
    builder: data.builder || null,
    builderEmail: data.builderEmail || '',
    metadata: data.metadata || {},
    priority: data.priority || 'normal',
  });
};

export const getUnreadCount = async () => {
  return await Notification.countDocuments({ isRead: false });
};

export const getNotifications = async (page = 1, limit = 20, category = null) => {
  const filter = {};
  if (category && category !== 'all') filter.category = category;

  const total = await Notification.countDocuments(filter);
  const notifications = await Notification.find(filter)
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit)
    .lean();

  return { notifications, total, page: parseInt(page), pages: Math.ceil(total / limit) };
};

export const markAsRead = async (id) => {
  if (id === 'all') {
    await Notification.updateMany({ isRead: false }, { isRead: true });
    return;
  }
  await Notification.findByIdAndUpdate(id, { isRead: true });
};

export const getDashboardStats = async () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [
    totalBuilders,
    activeBuilders,
    newToday,
    activeChallenges,
    completedChallenges,
    totalAchievementsAwarded,
    todayCheckins,
    totalCheckins,
  ] = await Promise.all([
    User.countDocuments({ role: 'user' }),
    User.countDocuments({ role: 'user', accountStatus: 'active' }),
    User.countDocuments({ role: 'user', createdAt: { $gte: today } }),
    Challenge.countDocuments({ status: 'active' }),
    Challenge.countDocuments({ status: 'completed' }),
    UserAchievement.countDocuments(),
    DailyEntry.countDocuments({ date: today.toISOString().split('T')[0] }),
    DailyEntry.countDocuments(),
  ]);

  return {
    totalBuilders,
    activeBuilders,
    newBuildersToday: newToday,
    activeChallenges,
    completedChallenges,
    totalAchievementsAwarded,
    todayCheckins,
    totalCheckins,
  };
};