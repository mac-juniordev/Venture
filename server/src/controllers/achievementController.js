import Achievement from '../models/Achievement.js';
import { getUserAchievements, checkAchievements } from '../services/achievementService.js';
import { AppError } from '../middleware/errorHandler.js';

// Get all achievements (admin can see hidden ones)
export const getAllAchievements = async (req, res, next) => {
  try {
    const filter = { isActive: true };
    if (req.user.role !== 'admin') {
      filter.isHidden = false;
    }

    const achievements = await Achievement.find(filter).sort({ tier: 1, category: 1 });

    res.status(200).json({
      success: true,
      data: { achievements },
    });
  } catch (error) {
    next(error);
  }
};

// Get user's achievements
export const getMyAchievements = async (req, res, next) => {
  try {
    const data = await getUserAchievements(req.user._id);

    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
};

// Check for new achievements (called after check-in, challenge completion, etc.)
export const checkNewAchievements = async (req, res, next) => {
  try {
    const newlyUnlocked = await checkAchievements(req.user._id);

    res.status(200).json({
      success: true,
      message: newlyUnlocked.length > 0 
        ? `🎉 You unlocked ${newlyUnlocked.length} new achievement(s)!` 
        : 'No new achievements',
      data: { newlyUnlocked },
    });
  } catch (error) {
    next(error);
  }
};

// Get public user achievements
export const getPublicUserAchievements = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const data = await getUserAchievements(userId);

    res.status(200).json({
      success: true,
      data: {
        unlocked: data.unlocked,
        totalUnlocked: data.totalUnlocked,
        totalAvailable: data.totalAvailable,
      },
    });
  } catch (error) {
    next(error);
  }
};