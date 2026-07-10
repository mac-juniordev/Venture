import express from 'express';
import { protect } from '../middleware/auth.js';
import {
  payWithCard,
  payWithMtnMoney,
  payWithOrangeMoney,
  paymentWebhook,
  paymentHistory,
} from '../controllers/paymentController.js';

const router = express.Router();

router.post('/card', protect, payWithCard);
router.post('/mtn-money', protect, payWithMtnMoney);
router.post('/orange-money', protect, payWithOrangeMoney);
router.post('/webhook', paymentWebhook); // Public webhook from providers
router.get('/history', protect, paymentHistory);

export default router;