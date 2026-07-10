import express from 'express';
import { protect } from '../middleware/auth.js';
import {
  createChallenge,
  getChallenges,
  getChallenge,
  joinChallenge,
  updateProgress,
  getMyChallenges,
} from '../controllers/challengeController.js';

const router = express.Router();

router.post('/', protect, createChallenge);
router.get('/', protect, getChallenges);
router.get('/my', protect, getMyChallenges);
router.get('/:id', protect, getChallenge);
router.post('/:id/join', protect, joinChallenge);
router.put('/:challengeId/progress', protect, updateProgress);

export default router;