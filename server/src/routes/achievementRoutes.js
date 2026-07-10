import express from 'express';
import { protect } from '../middleware/auth.js';
import {
  getAllAchievements,
  getMyAchievements,
  checkNewAchievements,
  getPublicUserAchievements,
} from '../controllers/achievementController.js';

const router = express.Router();

router.get('/', protect, getAllAchievements);
router.get('/my', protect, getMyAchievements);
router.post('/check', protect, checkNewAchievements);
router.get('/user/:userId', protect, getPublicUserAchievements);

export default router;