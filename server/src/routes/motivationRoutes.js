import express from 'express';
import { protect } from '../middleware/auth.js';
import {
  getDailyMotivation,
  getMotivations,
} from '../controllers/motivationController.js';

const router = express.Router();

router.get('/daily', protect, getDailyMotivation);
router.get('/', protect, getMotivations);

export default router;