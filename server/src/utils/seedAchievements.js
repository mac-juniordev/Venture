import Achievement from '../models/Achievement.js';

export const seedAchievements = async () => {
  const count = await Achievement.countDocuments();
  if (count > 0) return;

  const achievements = [
    // Streak Achievements
    { title: 'First Spark', description: 'Hit a 3-day streak', icon: 'flame', category: 'streak', tier: 'bronze', requirement: { type: 'streak_days', value: 3 }, xpReward: 50 },
    { title: 'Warming Up', description: 'Hit a 7-day streak', icon: 'flame', category: 'streak', tier: 'bronze', requirement: { type: 'streak_days', value: 7 }, xpReward: 100 },
    { title: 'On Fire', description: 'Hit a 14-day streak', icon: 'fire', category: 'streak', tier: 'silver', requirement: { type: 'streak_days', value: 14 }, xpReward: 200 },
    { title: 'Inferno', description: 'Hit a 30-day streak', icon: 'fire', category: 'streak', tier: 'gold', requirement: { type: 'streak_days', value: 30 }, xpReward: 500 },
    { title: 'Unstoppable', description: 'Hit a 60-day streak', icon: 'diamond', category: 'streak', tier: 'platinum', requirement: { type: 'streak_days', value: 60 }, xpReward: 1000 },
    { title: 'Legendary Streak', description: 'Hit a 100-day streak', icon: 'crown', category: 'streak', tier: 'legendary', requirement: { type: 'streak_days', value: 100 }, xpReward: 2500 },

    // Check-in Achievements
    { title: 'First Step', description: 'Complete your first check-in', icon: 'star', category: 'checkin', tier: 'bronze', requirement: { type: 'total_checkins', value: 1 }, xpReward: 25 },
    { title: 'Consistent Builder', description: 'Complete 10 check-ins', icon: 'zap', category: 'checkin', tier: 'bronze', requirement: { type: 'total_checkins', value: 10 }, xpReward: 75 },
    { title: 'Dedicated', description: 'Complete 50 check-ins', icon: 'target', category: 'checkin', tier: 'silver', requirement: { type: 'total_checkins', value: 50 }, xpReward: 200 },
    { title: 'Grinder', description: 'Complete 100 check-ins', icon: 'bolt', category: 'checkin', tier: 'gold', requirement: { type: 'total_checkins', value: 100 }, xpReward: 500 },
    { title: 'Machine', description: 'Complete 365 check-ins', icon: 'rocket', category: 'checkin', tier: 'platinum', requirement: { type: 'total_checkins', value: 365 }, xpReward: 2000 },

    // Challenge Achievements
    { title: 'Challenger', description: 'Join your first challenge', icon: 'shield', category: 'challenge', tier: 'bronze', requirement: { type: 'challenges_completed', value: 1 }, xpReward: 50 },
    { title: 'Warrior', description: 'Complete 5 challenges', icon: 'shield', category: 'challenge', tier: 'silver', requirement: { type: 'challenges_completed', value: 5 }, xpReward: 200 },
    { title: 'Gladiator', description: 'Complete 10 challenges', icon: 'trophy', category: 'challenge', tier: 'gold', requirement: { type: 'challenges_completed', value: 10 }, xpReward: 500 },
    { title: 'Champion', description: 'Complete 25 challenges', icon: 'crown', category: 'challenge', tier: 'platinum', requirement: { type: 'challenges_completed', value: 25 }, xpReward: 1500 },

    // Profile Achievements
    { title: 'Identity Created', description: 'Complete your profile', icon: 'gem', category: 'special', tier: 'bronze', requirement: { type: 'profile_complete', value: 1 }, xpReward: 50 },
    { title: 'Builder Mode', description: 'Set a profile picture and bio', icon: 'star', category: 'special', tier: 'silver', requirement: { type: 'profile_complete', value: 1 }, xpReward: 100 },

    // Milestone Achievements (Hidden)
    { title: 'Early Bird', description: 'Check in before 8 AM consistently', icon: 'sun', category: 'milestone', tier: 'bronze', requirement: { type: 'total_checkins', value: 5 }, xpReward: 50, isHidden: true },
    { title: 'Night Owl', description: 'Check in after 10 PM consistently', icon: 'moon', category: 'milestone', tier: 'bronze', requirement: { type: 'total_checkins', value: 5 }, xpReward: 50, isHidden: true },
  ];

  await Achievement.insertMany(achievements);
  console.log('Achievements seeded successfully');
};