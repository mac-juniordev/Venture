import Reaction from '../models/Reaction.js';
import Comment from '../models/Comment.js';
import DailyEntry from '../models/DailyEntry.js';
import Profile from '../models/Profile.js';
import { AppError } from '../middleware/errorHandler.js';

// Get community feed (recent check-ins from others)
export const getCommunityFeed = async (req, res, next) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Get recent check-ins with notes (not empty)
    const entries = await DailyEntry.find({
      user: { $ne: req.user._id },
      $or: [
        { note: { $exists: true, $ne: '' } },
        { mood: { $exists: true, $ne: '' } },
      ],
    })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .populate('user', 'email')
      .lean();

    // Get profiles for these users
    const userIds = entries.map(e => e.user._id);
    const profiles = await Profile.find({ user: { $in: userIds } })
      .select('user displayName username avatar')
      .lean();

    const profileMap = {};
    profiles.forEach(p => {
      profileMap[p.user.toString()] = p;
    });

    // Get reactions for these entries
    const entryIds = entries.map(e => e._id);
    const reactions = await Reaction.find({
      targetType: 'checkin',
      targetId: { $in: entryIds },
    }).lean();

    // Group reactions by target
    const reactionMap = {};
    reactions.forEach(r => {
      const key = r.targetId.toString();
      if (!reactionMap[key]) reactionMap[key] = [];
      reactionMap[key].push(r);
    });

    // Get comment counts
    const comments = await Comment.find({
      targetType: 'checkin',
      targetId: { $in: entryIds },
    }).lean();

    const commentCountMap = {};
    comments.forEach(c => {
      const key = c.targetId.toString();
      commentCountMap[key] = (commentCountMap[key] || 0) + 1;
    });

    const feed = entries.map(entry => ({
      _id: entry._id,
      user: {
        _id: entry.user._id,
        email: entry.user.email,
        displayName: profileMap[entry.user._id.toString()]?.displayName,
        username: profileMap[entry.user._id.toString()]?.username,
        avatar: profileMap[entry.user._id.toString()]?.avatar,
      },
      date: entry.date,
      note: entry.note,
      mood: entry.mood,
      checkInTime: entry.checkInTime,
      reactions: reactionMap[entry._id.toString()] || [],
      reactionCount: (reactionMap[entry._id.toString()] || []).length,
      commentCount: commentCountMap[entry._id.toString()] || 0,
    }));

    const total = await DailyEntry.countDocuments({
      user: { $ne: req.user._id },
      $or: [
        { note: { $exists: true, $ne: '' } },
        { mood: { $exists: true, $ne: '' } },
      ],
    });

    res.status(200).json({
      success: true,
      data: {
        feed,
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

// Add reaction
export const addReaction = async (req, res, next) => {
  try {
    const { targetUser, targetType, targetId, reaction, message } = req.body;

    if (!targetUser || !targetType || !targetId || !reaction) {
      throw new AppError('Missing required fields', 400);
    }

    // Check if already reacted
    const existing = await Reaction.findOne({
      user: req.user._id,
      targetType,
      targetId,
    });

    if (existing) {
      // Remove reaction (toggle off)
      await Reaction.findByIdAndDelete(existing._id);
      return res.status(200).json({
        success: true,
        message: 'Reaction removed',
        data: { reaction: null },
      });
    }

    const newReaction = await Reaction.create({
      user: req.user._id,
      targetUser,
      targetType,
      targetId,
      reaction,
      message: message || '',
    });

    const populated = await Reaction.findById(newReaction._id)
      .populate('user', 'email')
      .lean();

    res.status(201).json({
      success: true,
      message: 'Reaction added!',
      data: { reaction: populated },
    });
  } catch (error) {
    next(error);
  }
};

// Get reactions for a specific target
export const getReactions = async (req, res, next) => {
  try {
    const { targetType, targetId } = req.params;

    const reactions = await Reaction.find({ targetType, targetId })
      .populate('user', 'email')
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json({
      success: true,
      data: { reactions },
    });
  } catch (error) {
    next(error);
  }
};

// Add comment
export const addComment = async (req, res, next) => {
  try {
    const { targetType, targetId, content } = req.body;

    if (!content || !content.trim()) {
      throw new AppError('Comment cannot be empty', 400);
    }

    if (content.length > 280) {
      throw new AppError('Comment must be under 280 characters', 400);
    }

    // Check if user already commented on this target
    const existing = await Comment.findOne({
      user: req.user._id,
      targetType,
      targetId,
    });

    if (existing) {
      // Update existing comment
      existing.content = content;
      await existing.save();
      
      const populated = await Comment.findById(existing._id)
        .populate('user', 'email')
        .lean();

      return res.status(200).json({
        success: true,
        message: 'Comment updated',
        data: { comment: populated },
      });
    }

    const comment = await Comment.create({
      user: req.user._id,
      targetType,
      targetId,
      content,
    });

    const populated = await Comment.findById(comment._id)
      .populate('user', 'email')
      .lean();

    res.status(201).json({
      success: true,
      message: 'Comment added',
      data: { comment: populated },
    });
  } catch (error) {
    next(error);
  }
};

// Get comments for a target
export const getComments = async (req, res, next) => {
  try {
    const { targetType, targetId } = req.params;

    const comments = await Comment.find({ targetType, targetId })
      .populate('user', 'email')
      .sort({ createdAt: -1 })
      .limit(20)
      .lean();

    // Get profiles
    const userIds = comments.map(c => c.user._id);
    const profiles = await Profile.find({ user: { $in: userIds } })
      .select('user displayName username avatar')
      .lean();

    const profileMap = {};
    profiles.forEach(p => {
      profileMap[p.user.toString()] = p;
    });

    const enriched = comments.map(c => ({
      ...c,
      user: {
        ...c.user,
        displayName: profileMap[c.user._id.toString()]?.displayName,
        username: profileMap[c.user._id.toString()]?.username,
        avatar: profileMap[c.user._id.toString()]?.avatar,
      },
    }));

    res.status(200).json({
      success: true,
      data: { comments: enriched },
    });
  } catch (error) {
    next(error);
  }
};

// Delete own comment
export const deleteComment = async (req, res, next) => {
  try {
    const comment = await Comment.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!comment) {
      throw new AppError('Comment not found or unauthorized', 404);
    }

    res.status(200).json({
      success: true,
      message: 'Comment deleted',
    });
  } catch (error) {
    next(error);
  }
};