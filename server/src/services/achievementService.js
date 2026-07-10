import Achievement from '../models/Achievement.js';
import UserAchievement from '../models/UserAchievement.js';
import Profile from '../models/Profile.js';

// Check and unlock achievements for a user
export const checkAchievements = async (userId) => {
  const profile = await Profile.findOne({ user: userId }).lean();
  if (!profile) return [];

  const allAchievements = await Achievement.find({ isActive: true });
  const unlocked = await UserAchievement.find({ user: userId }).select('achievement');
  const unlockedIds = unlocked.map(u => u.achievement.toString());

  const newlyUnlocked = [];

  for (const achievement of allAchievements) {
    if (unlockedIds.includes(achievement._id.toString())) continue;

    let meetsRequirement = false;

    switch (achievement.requirement.type) {
      case 'streak_days':
        meetsRequirement = (profile.longestStreak || 0) >= achievement.requirement.value;
        break;
      case 'total_checkins':
        meetsRequirement = (profile.totalCheckIns || 0) >= achievement.requirement.value;
        break;
      case 'challenges_completed':
        meetsRequirement = (profile.challengesCompleted || 0) >= achievement.requirement.value;
        break;
      case 'profile_complete':
        meetsRequirement = !!(profile.displayName && profile.bio && profile.username);
        break;
      default:
        meetsRequirement = false;
    }

    if (meetsRequirement) {
      await UserAchievement.create({
        user: userId,
        achievement: achievement._id,
        unlockedAt: new Date(),
        progress: 100,
      });

      newlyUnlocked.push(achievement);
    }
  }

  return newlyUnlocked;
};

// Get user's achievements
export const getUserAchievements = async (userId) => {
  const userAchievements = await UserAchievement.find({ user: userId })
    .populate('achievement')
    .sort({ unlockedAt: -1 })
    .lean();

  const allAchievements = await Achievement.find({ isActive: true, isHidden: false }).lean();

  return {
    unlocked: userAchievements.map(ua => ({
      ...ua.achievement,
      unlockedAt: ua.unlockedAt,
    })),
    locked: allAchievements.filter(
      a => !userAchievements.find(ua => ua.achievement._id.toString() === a._id.toString())
    ),
    totalXP: userAchievements.reduce((sum, ua) => sum + (ua.achievement?.xpReward || 0), 0),
    totalUnlocked: userAchievements.length,
    totalAvailable: allAchievements.length,
  };
};