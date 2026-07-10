import express from 'express';
import { protect } from '../middleware/auth.js';
import {
  getPlans,
  getMySubscription,
  updateSubscription,
  cancelSubscription,
} from '../controllers/subscriptionController.js';

const router = express.Router();

router.get('/plans', getPlans);
router.get('/my', protect, getMySubscription);
router.put('/update', protect, updateSubscription);
router.post('/cancel', protect, cancelSubscription);

export default router;