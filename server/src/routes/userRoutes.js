import express from 'express';
import { protect } from '../middleware/auth.js';
import { uploadAvatar as uploadAvatarMiddleware } from '../middleware/upload.js';
import {
  getMyProfile,
  updateProfile,
  getPublicProfile,
  updateSettings,
  uploadAvatar,
  getAccountStatus,
  suspendAccount,
  reactivateAccount,
  deleteAccount,
} from '../controllers/userController.js';

const router = express.Router();

// Profile routes
router.get('/profile', protect, getMyProfile);
router.put('/profile', protect, updateProfile);
router.get('/profile/:username', getPublicProfile);

// Settings routes
router.put('/settings', protect, updateSettings);

// Avatar upload
router.post('/avatar', protect, uploadAvatarMiddleware, uploadAvatar);

// Account management routes
router.get('/account/status', protect, getAccountStatus);
router.post('/account/suspend', protect, suspendAccount);
router.post('/account/reactivate', protect, reactivateAccount);
router.delete('/account/delete', protect, deleteAccount);

export default router;