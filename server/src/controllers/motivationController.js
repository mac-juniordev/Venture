import MotivationMessage from '../models/MotivationMessage.js';
import { AppError } from '../middleware/errorHandler.js';

// Get today's/daily motivation message (PUBLIC - used on dashboard)
export const getDailyMotivation = async (req, res, next) => {
  try {
    const message = await MotivationMessage.getRandomMessage();

    res.status(200).json({
      success: true,
      data: { message },
    });
  } catch (error) {
    next(error);
  }
};

// Get all active messages by category (for browsing)
export const getMotivations = async (req, res, next) => {
  try {
    const { category } = req.query;
    
    let messages;
    if (category) {
      messages = await MotivationMessage.getByCategory(category);
    } else {
      messages = await MotivationMessage.find({ isActive: true })
        .sort({ category: 1, priority: -1 });
    }

    res.status(200).json({
      success: true,
      data: { messages },
    });
  } catch (error) {
    next(error);
  }
};