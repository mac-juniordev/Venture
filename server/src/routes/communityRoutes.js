import express from 'express';
import { protect } from '../middleware/auth.js';
import {
  getCommunityFeed,
  addReaction,
  getReactions,
  addComment,
  getComments,
  deleteComment,
} from '../controllers/communityController.js';

const router = express.Router();

router.get('/feed', protect, getCommunityFeed);
router.post('/react', protect, addReaction);
router.get('/reactions/:targetType/:targetId', protect, getReactions);
router.post('/comment', protect, addComment);
router.get('/comments/:targetType/:targetId', protect, getComments);
router.delete('/comment/:id', protect, deleteComment);

export default router;