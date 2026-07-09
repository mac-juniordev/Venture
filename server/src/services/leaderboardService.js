import Profile from '../models/Profile.js';
import DailyEntry from '../models/DailyEntry.js';
import Challenge from '../models/Challenge.js';

// Global leaderboard by streaks
export const getGlobalLeaderboard = async (limit = 20) => {
  const profiles = await Profile.find()
    .populate('user', 'email')
    .sort({ longestStreak: -1, totalCheckIns: -1 })
    .limit(limit)
    .lean();

  return profiles.map((profile, index) => ({
    rank: index + 1,
    user: {
      _id: profile.user?._id,
      email: profile.user?.email,
      displayName: profile.displayName,
      username: profile.username,
      avatar: profile.avatar,
    },
    longestStreak: profile.longestStreak,
    totalCheckIns: profile.totalCheckIns,
    challengesCompleted: profile.challengesCompleted,
  }));
};

// Leaderboard by most check-ins
export const getCheckInLeaderboard = async (limit = 20) => {
  const profiles = await Profile.find()
    .populate('user', 'email')
    .sort({ totalCheckIns: -1, longestStreak: -1 })
    .limit(limit)
    .lean();

  return profiles.map((profile, index) => ({
    rank: index + 1,
    user: {
      _id: profile.user?._id,
      email: profile.user?.email,
      displayName: profile.displayName,
      username: profile.username,
      avatar: profile.avatar,
    },
    totalCheckIns: profile.totalCheckIns,
    longestStreak: profile.longestStreak,
  }));
};

// Challenge-specific leaderboard
export const getChallengeLeaderboard = async (challengeId) => {
  const challenge = await Challenge.findById(challengeId)
    .populate('participants.user', 'email')
    .lean({ virtuals: true });

  if (!challenge) return [];

  const participants = challenge.participants
    .sort((a, b) => b.progress - a.progress || b.streakDuringChallenge - a.streakDuringChallenge)
    .map((p, index) => ({
      rank: index + 1,
      user: {
        _id: p.user?._id,
        email: p.user?.email,
      },
      progress: p.progress,
      streakDuringChallenge: p.streakDuringChallenge,
      completed: p.completed,
      joinedAt: p.joinedAt,
    }));

  return participants;
};

// Get user's rank
export const getUserRank = async (userId) => {
  const allProfiles = await Profile.find()
    .sort({ longestStreak: -1, totalCheckIns: -1 })
    .lean();

  const rank = allProfiles.findIndex(
    p => p.user?.toString() === userId.toString()
  ) + 1;

  const userProfile = allProfiles[rank - 1];

  return {
    rank,
    totalParticipants: allProfiles.length,
    percentile: Math.round(((allProfiles.length - rank) / allProfiles.length) * 100),
    profile: userProfile,
  };
};