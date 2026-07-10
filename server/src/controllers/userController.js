import Profile from '../models/Profile.js';
import User from '../models/User.js';
import DailyEntry from '../models/DailyEntry.js';
import { AppError } from '../middleware/errorHandler.js';
import { processSuspensions } from '../services/accountService.js';
import bcrypt from 'bcryptjs';

// Get own profile
export const getMyProfile = async (req, res, next) => {
  try {
    let profile = await Profile.findOne({ user: req.user._id })
      .populate('user', 'email role createdAt accountStatus');

    if (!profile) {
      profile = await Profile.create({
        user: req.user._id,
        displayName: req.user.email.split('@')[0],
        joinedDate: req.user.createdAt,
      });
      profile = await profile.populate('user', 'email role createdAt accountStatus');
    }

    res.status(200).json({
      success: true,
      data: { profile },
    });
  } catch (error) {
    next(error);
  }
};

// Update own profile
export const updateProfile = async (req, res, next) => {
  try {
    const {
      username, displayName, bio, avatar,
      location, website, github, twitter,
    } = req.body;

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
    ).populate('user', 'email role createdAt accountStatus');

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: { profile },
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
      data: { profile },
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

    if ((email || securityQuestions) && !currentPassword) {
      throw new AppError('Current password is required to change these settings', 400);
    }

    if (currentPassword) {
      const isMatch = await user.comparePassword(currentPassword);
      if (!isMatch) {
        throw new AppError('Current password is incorrect', 401);
      }
    }

    if (email) {
      const existingUser = await User.findOne({ email, _id: { $ne: user._id } });
      if (existingUser) {
        throw new AppError('Email already in use', 400);
      }
      user.email = email;
    }

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
    ).populate('user', 'email role createdAt accountStatus');

    res.status(200).json({
      success: true,
      message: 'Avatar uploaded successfully',
      data: { profile },
    });
  } catch (error) {
    next(error);
  }
};

// Get account status
export const getAccountStatus = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select(
      'accountStatus suspensionEndDate deactivatedAt suspensionReason'
    );

    if (!user) {
      throw new AppError('User not found', 404);
    }

    // If accountStatus field doesn't exist yet (legacy users), set it
    if (!user.accountStatus) {
      user.accountStatus = 'active';
      await user.save();
    }

    // Check if suspension expired
    if (user.accountStatus === 'suspended' && user.suspensionEndDate && user.suspensionEndDate < new Date()) {
      await processSuspensions();
      const updated = await User.findById(req.user._id).select(
        'accountStatus suspensionEndDate deactivatedAt suspensionReason'
      );
      return res.status(200).json({
        success: true,
        data: { account: updated },
      });
    }

    res.status(200).json({
      success: true,
      data: { account: user },
    });
  } catch (error) {
    next(error);
  }
};

// Suspend own account
export const suspendAccount = async (req, res, next) => {
  try {
    const { duration, password } = req.body;

    if (!password) {
      throw new AppError('Password is required to suspend your account', 400);
    }

    if (!duration) {
      throw new AppError('Please select a suspension duration', 400);
    }

    const user = await User.findById(req.user._id).select('+password');
    
    if (!user) {
      throw new AppError('User not found', 404);
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      throw new AppError('Password is incorrect', 401);
    }

    if (user.accountStatus === 'suspended') {
      throw new AppError('Your account is already suspended', 400);
    }

    if (user.accountStatus === 'archived') {
      throw new AppError('Archived accounts cannot be suspended. Contact support.', 400);
    }

    const durationMap = {
      '7days': 7,
      '14days': 14,
      '30days': 30,
      '90days': 90,
      '6months': 180,
      '1year': 365,
    };

    const days = durationMap[duration];
    if (!days) {
      throw new AppError('Invalid duration selected', 400);
    }

    const endDate = new Date();
    endDate.setDate(endDate.getDate() + days);

    user.accountStatus = 'suspended';
    user.suspensionEndDate = endDate;
    user.suspensionReason = 'user_requested';
    user.deactivatedAt = new Date();

    await user.save();

    res.status(200).json({
      success: true,
      message: `Your account has been suspended until ${endDate.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })}. You can reactivate anytime before then by logging in.`,
      data: {
        suspensionEndDate: endDate,
        daysRemaining: days,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Reactivate account
export const reactivateAccount = async (req, res, next) => {
  try {
    const { password } = req.body;

    if (!password) {
      throw new AppError('Password is required to reactivate your account', 400);
    }

    const user = await User.findById(req.user._id).select('+password');

    if (!user) {
      throw new AppError('User not found', 404);
    }

    if (user.accountStatus !== 'suspended') {
      throw new AppError('Your account is not currently suspended', 400);
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      throw new AppError('Password is incorrect', 401);
    }

    user.accountStatus = 'active';
    user.suspensionEndDate = null;
    user.suspensionReason = null;
    user.deactivatedAt = null;

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Welcome back! Your account has been reactivated. Continue your growth journey.',
    });
  } catch (error) {
    next(error);
  }
};

// Delete account permanently
export const deleteAccount = async (req, res, next) => {
  try {
    const { password, confirmation } = req.body;

    if (!password) {
      throw new AppError('Password is required to delete your account', 400);
    }

    if (confirmation !== 'DELETE MY ACCOUNT') {
      throw new AppError('Please type "DELETE MY ACCOUNT" to confirm', 400);
    }

    const user = await User.findById(req.user._id).select('+password');
    if (!user) {
      throw new AppError('User not found', 404);
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      throw new AppError('Password is incorrect', 401);
    }

    // Delete all user data
    await Promise.all([
      Profile.deleteOne({ user: req.user._id }),
      DailyEntry.deleteMany({ user: req.user._id }),
      User.findByIdAndDelete(req.user._id),
    ]);

    res.status(200).json({
      success: true,
      message: 'Your account has been permanently deleted. We\'re sad to see you go. Keep building.',
    });
  } catch (error) {
    next(error);
  }
};