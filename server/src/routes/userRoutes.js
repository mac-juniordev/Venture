import express from 'express';
import { protect } from '../middleware/auth.js';
import { uploadAvatar as uploadAvatarMiddleware } from '../middleware/upload.js';
import {
  getMyProfile,
  updateProfile,
  getPublicProfile,
  updateSettings,
  uploadAvatar,
} from '../controllers/userController.js';

const router = express.Router();

router.get('/profile', protect, getMyProfile);
router.put('/profile', protect, updateProfile);
router.get('/profile/:username', getPublicProfile);
router.put('/settings', protect, updateSettings);
router.post('/avatar', protect, uploadAvatarMiddleware, uploadAvatar);

export default router;