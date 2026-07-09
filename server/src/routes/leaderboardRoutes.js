import express from 'express';
import { protect } from '../middleware/auth.js';
import {
  globalLeaderboard,
  challengeLeaderboard,
} from '../controllers/leaderboardController.js';

const router = express.Router();

router.get('/', protect, globalLeaderboard);
router.get('/challenge/:challengeId', protect, challengeLeaderboard);

export default router;