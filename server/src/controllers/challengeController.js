import Challenge from '../models/Challenge.js';
import Profile from '../models/Profile.js';
import { AppError } from '../middleware/errorHandler.js';

// Create challenge (ADMIN ONLY)
export const createChallenge = async (req, res, next) => {
  try {
    // Only admins can create challenges
    if (req.user.role !== 'admin') {
      throw new AppError('Only admins can create challenges', 403);
    }

    const challenge = await Challenge.create({
      ...req.body,
      createdBy: req.user._id,
      participants: [],
    });

    const populated = await Challenge.findById(challenge._id)
      .populate('createdBy', 'email')
      .populate('participants.user', 'email');

    res.status(201).json({
      success: true,
      message: 'Challenge created and advertised to the community!',
      data: { challenge: populated },
    });
  } catch (error) {
    next(error);
  }
};

// Get all challenges (PUBLIC - for community browsing)
export const getChallenges = async (req, res, next) => {
  try {
    const { category, status, difficulty, page = 1, limit = 12 } = req.query;
    const filter = {};

    if (category) filter.category = category;
    if (status) filter.status = status;
    if (difficulty) filter.difficulty = difficulty;

    const skip = (page - 1) * limit;

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
          pages: Math.ceil(total / limit),
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
      .lean({ virtuals: true });

    if (!challenge) {
      throw new AppError('Challenge not found', 404);
    }

    res.status(200).json({
      success: true,
      data: { challenge },
    });
  } catch (error) {
    next(error);
  }
};

// Join challenge (AUTHENTICATED USERS)
export const joinChallenge = async (req, res, next) => {
  try {
    const challenge = await Challenge.findById(req.params.id);

    if (!challenge) {
      throw new AppError('Challenge not found', 404);
    }

    if (challenge.status === 'completed' || challenge.status === 'cancelled') {
      throw new AppError('This challenge is no longer active', 400);
    }

    if (challenge.participants.length >= challenge.maxParticipants) {
      throw new AppError('Challenge is full', 400);
    }

    const alreadyJoined = challenge.participants.find(
      p => p.user.toString() === req.user._id.toString()
    );

    if (alreadyJoined) {
      throw new AppError('You have already joined this challenge', 400);
    }

    challenge.participants.push({
      user: req.user._id,
      joinedAt: new Date(),
    });

    await challenge.save();

    // Update profile challenges count
    await Profile.findOneAndUpdate(
      { user: req.user._id },
      { $inc: { challengesCompleted: 0 } }
    );

    const populated = await Challenge.findById(challenge._id)
      .populate('createdBy', 'email')
      .populate('participants.user', 'email')
      .lean({ virtuals: true });

    res.status(200).json({
      success: true,
      message: 'You\'re in! Let the challenge begin. ⚔️',
      data: { challenge: populated },
    });
  } catch (error) {
    next(error);
  }
};

// Get my challenges (AUTHENTICATED USERS)
export const getMyChallenges = async (req, res, next) => {
  try {
    const challenges = await Challenge.find({
      $or: [
        { createdBy: req.user._id },
        { 'participants.user': req.user._id },
      ],
    })
      .populate('createdBy', 'email')
      .populate('participants.user', 'email')
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