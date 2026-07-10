import Challenge from '../models/Challenge.js';
import Profile from '../models/Profile.js';
import DailyEntry from '../models/DailyEntry.js';
import { AppError } from '../middleware/errorHandler.js';
import { createNotification } from '../services/notificationService.js';

// Create challenge (ANY USER can create)
export const createChallenge = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.body;

    // Enforce 7-day max
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const diffDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
      if (diffDays > 7) {
        throw new AppError('Challenge duration cannot exceed 7 days', 400);
      }
    }

    const challenge = await Challenge.create({
      ...req.body,
      createdBy: req.user._id,
      participants: [],
    });

    await createNotification({
      type: 'challenge_created',
      category: 'challenge',
      title: 'New Challenge Created',
      description: `${req.user.email} created "${challenge.title}"`,
      builder: req.user._id,
      builderEmail: req.user.email,
      priority: 'normal',
    });

    const populated = await Challenge.findById(challenge._id)
      .populate('createdBy', 'email')
      .lean({ virtuals: true });

    res.status(201).json({
      success: true,
      message: 'Challenge created! Time to build.',
      data: { challenge: populated },
    });
  } catch (error) {
    next(error);
  }
};

// Get all challenges (with filters)
export const getChallenges = async (req, res, next) => {
  try {
    const { category, status, difficulty, page = 1, limit = 12 } = req.query;
    const filter = {};

    if (category) filter.category = category;
    if (status) filter.status = status;
    if (difficulty) filter.difficulty = difficulty;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const challenges = await Challenge.find(filter)
      .populate('createdBy', 'email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .lean({ virtuals: true });

    const total = await Challenge.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: {
        challenges,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / parseInt(limit)),
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

// Get single challenge
export const getChallenge = async (req, res, next) => {
  try {
    const challenge = await Challenge.findById(req.params.id)
      .populate('createdBy', 'email')
      .populate('participants.user', 'email')
      .populate('winner', 'email')
      .lean({ virtuals: true });

    if (!challenge) throw new AppError('Challenge not found', 404);

    // Auto-complete if past end date
    if (challenge.status === 'active' && new Date(challenge.endDate) < new Date()) {
      await Challenge.findByIdAndUpdate(challenge._id, { status: 'completed' });
      challenge.status = 'completed';
    }

    res.status(200).json({
      success: true,
      data: { challenge },
    });
  } catch (error) {
    next(error);
  }
};

// Join challenge
export const joinChallenge = async (req, res, next) => {
  try {
    const challenge = await Challenge.findById(req.params.id);

    if (!challenge) throw new AppError('Challenge not found', 404);
    if (challenge.status === 'completed' || challenge.status === 'cancelled') {
      throw new AppError('This challenge is no longer active', 400);
    }
    if (challenge.participants.length >= challenge.maxParticipants) {
      throw new AppError('Challenge is full', 400);
    }

    const alreadyJoined = challenge.participants.find(
      p => p.user.toString() === req.user._id.toString()
    );
    if (alreadyJoined) throw new AppError('You have already joined this challenge', 400);

    challenge.participants.push({ user: req.user._id, joinedAt: new Date() });
    await challenge.save();

    await createNotification({
      type: 'challenge_joined',
      category: 'challenge',
      title: 'Builder Joined Challenge',
      description: `${req.user.email} joined "${challenge.title}"`,
      builder: req.user._id,
      builderEmail: req.user.email,
      priority: 'low',
    });

    const populated = await Challenge.findById(challenge._id)
      .populate('createdBy', 'email')
      .populate('participants.user', 'email')
      .lean({ virtuals: true });

    res.status(200).json({
      success: true,
      message: 'You\'re in! Let the challenge begin.',
      data: { challenge: populated },
    });
  } catch (error) {
    next(error);
  }
};

// Update progress (called on daily check-in during challenge)
export const updateProgress = async (req, res, next) => {
  try {
    const { challengeId } = req.params;
    const challenge = await Challenge.findById(challengeId);

    if (!challenge) throw new AppError('Challenge not found', 404);
    if (challenge.status !== 'active') throw new AppError('Challenge is not active', 400);

    const participant = challenge.participants.find(
      p => p.user.toString() === req.user._id.toString()
    );
    if (!participant) throw new AppError('You are not in this challenge', 400);

    // Calculate progress based on days elapsed
    const start = new Date(challenge.startDate);
    const end = new Date(challenge.endDate);
    const now = new Date();
    const totalDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    const daysElapsed = Math.ceil((now - start) / (1000 * 60 * 60 * 24));
    participant.progress = Math.min(100, Math.round((daysElapsed / totalDays) * 100));

    // Check daily check-ins during challenge
    const entriesDuringChallenge = await DailyEntry.countDocuments({
      user: req.user._id,
      date: {
        $gte: challenge.startDate.toISOString().split('T')[0],
        $lte: new Date().toISOString().split('T')[0],
      },
    });
    participant.streakDuringChallenge = entriesDuringChallenge;

    if (participant.progress >= 100) {
      participant.completed = true;
      participant.completedAt = new Date();
    }

    await challenge.save();

    // Auto-declare winner if challenge ended
    if (new Date() >= end && challenge.status === 'active') {
      challenge.status = 'completed';
      
      // Find winner (most check-ins during challenge)
      const sorted = challenge.participants.sort((a, b) => b.streakDuringChallenge - a.streakDuringChallenge);
      if (sorted.length > 0 && sorted[0].streakDuringChallenge > 0) {
        challenge.winner = sorted[0].user;
        await Profile.findOneAndUpdate(
          { user: sorted[0].user },
          { $inc: { challengesCompleted: 1 } }
        );
      }
      await challenge.save();

      await createNotification({
        type: 'challenge_completed',
        category: 'challenge',
        title: 'Challenge Completed',
        description: `"${challenge.title}" has ended. Winner declared!`,
        priority: 'high',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Progress updated',
      data: { participant },
    });
  } catch (error) {
    next(error);
  }
};

// Get my challenges
export const getMyChallenges = async (req, res, next) => {
  try {
    const challenges = await Challenge.find({
      $or: [
        { createdBy: req.user._id },
        { 'participants.user': req.user._id },
      ],
    })
      .populate('createdBy', 'email')
      .populate('winner', 'email')
      .sort({ createdAt: -1 })
      .lean({ virtuals: true });

    res.status(200).json({
      success: true,
      data: { challenges },
    });
  } catch (error) {
    next(error);
  }
};