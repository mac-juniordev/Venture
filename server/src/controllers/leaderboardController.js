import {
  getGlobalLeaderboard,
  getCheckInLeaderboard,
  getChallengeLeaderboard,
  getUserRank,
} from '../services/leaderboardService.js';
import { AppError } from '../middleware/errorHandler.js';

// Global leaderboard
export const globalLeaderboard = async (req, res, next) => {
  try {
    const { type = 'streak', limit = 20 } = req.query;
    
    let leaderboard;
    if (type === 'checkins') {
      leaderboard = await getCheckInLeaderboard(parseInt(limit));
    } else {
      leaderboard = await getGlobalLeaderboard(parseInt(limit));
    }

    const userRank = await getUserRank(req.user._id);

    res.status(200).json({
      success: true,
      data: {
        leaderboard,
        userRank,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Challenge leaderboard
export const challengeLeaderboard = async (req, res, next) => {
  try {
    const { challengeId } = req.params;
    
    const leaderboard = await getChallengeLeaderboard(challengeId);

    res.status(200).json({
      success: true,
      data: { leaderboard },
    });
  } catch (error) {
    next(error);
  }
};