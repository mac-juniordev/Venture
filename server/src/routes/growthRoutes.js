import express from 'express';
import { protect } from '../middleware/auth.js';
import {
  checkIn,
  getTodayStatus,
  getGrowthHistory,
} from '../controllers/growthController.js';

const router = express.Router();

router.post('/check-in', protect, checkIn);
router.get('/today', protect, getTodayStatus);
router.get('/history', protect, getGrowthHistory);

export default router;