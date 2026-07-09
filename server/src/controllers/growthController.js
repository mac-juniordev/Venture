import DailyEntry from '../models/DailyEntry.js';
import Profile from '../models/Profile.js';
import { AppError } from '../middleware/errorHandler.js';
import { calculateStreak } from '../services/streakService.js';

// Daily check-in
export const checkIn = async (req, res, next) => {
  try {
    const { note, mood, tags } = req.body;
    const today = new Date().toISOString().split('T')[0];

    // Check if already checked in today
    const existingEntry = await DailyEntry.findOne({
      user: req.user._id,
      date: today,
    });

    if (existingEntry) {
      throw new AppError('You have already checked in today', 400);
    }

    // Create daily entry
    const entry = await DailyEntry.create({
      user: req.user._id,
      date: today,
      note,
      mood: mood || '',
      tags: tags || [],
    });

    // Update profile total check-ins
    await Profile.findOneAndUpdate(
      { user: req.user._id },
      { $inc: { totalCheckIns: 1 } },
      { upsert: true }
    );

    // Calculate streaks
    const streaks = await calculateStreak(req.user._id);

    res.status(201).json({
      success: true,
      message: 'Check-in recorded! Keep the streak alive.',
      data: {
        entry,
        streaks,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Get today's check-in status
export const getTodayStatus = async (req, res, next) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    
    const entry = await DailyEntry.findOne({
      user: req.user._id,
      date: today,
    });

    const streaks = await calculateStreak(req.user._id);

    res.status(200).json({
      success: true,
      data: {
        hasCheckedIn: !!entry,
        entry: entry || null,
        streaks,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Get growth history
export const getGrowthHistory = async (req, res, next) => {
  try {
    const { page = 1, limit = 30 } = req.query;
    const skip = (page - 1) * limit;

    const entries = await DailyEntry.find({ user: req.user._id })
      .sort({ date: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    const total = await DailyEntry.countDocuments({ user: req.user._id });
    const streaks = await calculateStreak(req.user._id);

    // Get calendar data for current month
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split('T')[0];

    const monthEntries = await DailyEntry.find({
      user: req.user._id,
      date: { $gte: startOfMonth, $lte: endOfMonth },
    }).select('date').lean();

    const checkedInDates = monthEntries.map(e => e.date);

    res.status(200).json({
      success: true,
      data: {
        entries,
        streaks,
        calendar: {
          month: now.getMonth(),
          year: now.getFullYear(),
          checkedInDates,
        },
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    next(error);
  }
};