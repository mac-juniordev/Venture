import Profile from '../models/Profile.js';
import User from '../models/User.js';
import { AppError } from '../middleware/errorHandler.js';
import bcrypt from 'bcryptjs';

// Get own profile
export const getMyProfile = async (req, res, next) => {
  try {
    let profile = await Profile.findOne({ user: req.user._id })
      .populate('user', 'email role createdAt');

    if (!profile) {
      // Auto-create profile if it doesn't exist
      profile = await Profile.create({
        user: req.user._id,
        displayName: req.user.email.split('@')[0],
        joinedDate: req.user.createdAt,
      });
      profile = await profile.populate('user', 'email role createdAt');
    }

    res.status(200).json({
      success: true,
      data: {
        profile,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Update own profile
export const updateProfile = async (req, res, next) => {
  try {
    const {
      username,
      displayName,
      bio,
      avatar,
      location,
      website,
      github,
      twitter,
    } = req.body;

    // Check if username is taken
    if (username) {
      const existingProfile = await Profile.findOne({
        username: username.toLowerCase(),
        user: { $ne: req.user._id },
      });

      if (existingProfile) {
        throw new AppError('Username is already taken', 400);
      }
    }

    const updateFields = {};
    if (username !== undefined) updateFields.username = username;
    if (displayName !== undefined) updateFields.displayName = displayName;
    if (bio !== undefined) updateFields.bio = bio;
    if (avatar !== undefined) updateFields.avatar = avatar;
    if (location !== undefined) updateFields.location = location;
    if (website !== undefined) updateFields.website = website;
    if (github !== undefined) updateFields.github = github;
    if (twitter !== undefined) updateFields.twitter = twitter;

    let profile = await Profile.findOneAndUpdate(
      { user: req.user._id },
      { $set: updateFields },
      { new: true, runValidators: true, upsert: true }
    ).populate('user', 'email role createdAt');

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        profile,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Get public profile by username
export const getPublicProfile = async (req, res, next) => {
  try {
    const { username } = req.params;

    const profile = await Profile.findOne({
      username: username.toLowerCase(),
    }).populate('user', 'email createdAt');

    if (!profile) {
      throw new AppError('Profile not found', 404);
    }

    res.status(200).json({
      success: true,
      data: {
        profile,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Update user settings (email, security questions)
export const updateSettings = async (req, res, next) => {
  try {
    const { email, securityQuestions, currentPassword } = req.body;

    const user = await User.findById(req.user._id).select('+password');

    // If changing email or security questions, require current password
    if ((email || securityQuestions) && !currentPassword) {
      throw new AppError('Current password is required to change these settings', 400);
    }

    if (currentPassword) {
      const isMatch = await user.comparePassword(currentPassword);
      if (!isMatch) {
        throw new AppError('Current password is incorrect', 401);
      }
    }

    // Update email
    if (email) {
      const existingUser = await User.findOne({ email, _id: { $ne: user._id } });
      if (existingUser) {
        throw new AppError('Email already in use', 400);
      }
      user.email = email;
    }

    // Update security questions
    if (securityQuestions && Array.isArray(securityQuestions)) {
      if (securityQuestions.length !== 3) {
        throw new AppError('You must set exactly 3 security questions', 400);
      }

      const hashedQuestions = await Promise.all(
        securityQuestions.map(async (sq) => {
          const salt = await bcrypt.genSalt(12);
          const answerHash = await bcrypt.hash(sq.answer.toLowerCase().trim(), salt);
          return {
            question: sq.question,
            answerHash,
          };
        })
      );

      user.securityQuestions = hashedQuestions;
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Settings updated successfully',
      data: {
        user: {
          email: user.email,
          hasSecurityQuestions: user.securityQuestions.length > 0,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

// Upload avatar
export const uploadAvatar = async (req, res, next) => {
  try {
    if (!req.file) {
      throw new AppError('Please upload an image file', 400);
    }

    const avatarUrl = `/uploads/avatars/${req.file.filename}`;

    const profile = await Profile.findOneAndUpdate(
      { user: req.user._id },
      { $set: { avatar: avatarUrl } },
      { new: true, upsert: true }
    ).populate('user', 'email role createdAt');

    res.status(200).json({
      success: true,
      message: 'Avatar uploaded successfully',
      data: {
        profile,
      },
    });
  } catch (error) {
    next(error);
  }
};