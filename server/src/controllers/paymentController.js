import {
  processCardPayment,
  processMtnMoneyPayment,
  processOrangeMoneyPayment,
  confirmMobilePayment,
  getPaymentHistory,
} from '../services/paymentService.js';
import { AppError } from '../middleware/errorHandler.js';

// Card payment
export const payWithCard = async (req, res, next) => {
  try {
    const { amount, plan, billingCycle, stripeToken } = req.body;

    if (!amount || !plan || !billingCycle) {
      throw new AppError('Missing payment details', 400);
    }

    const result = await processCardPayment({
      userId: req.user._id,
      amount,
      plan,
      billingCycle,
      stripeToken,
    });

    res.status(200).json({
      success: true,
      message: 'Payment successful! Welcome to VENTURE.',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

// MTN Mobile Money payment
export const payWithMtnMoney = async (req, res, next) => {
  try {
    const { amount, plan, billingCycle, phoneNumber } = req.body;

    if (!amount || !plan || !phoneNumber) {
      throw new AppError('Missing payment details', 400);
    }

    const result = await processMtnMoneyPayment({
      userId: req.user._id,
      amount,
      plan,
      billingCycle,
      phoneNumber,
    });

    res.status(200).json({
      success: true,
      message: result.message,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

// Orange Money payment
export const payWithOrangeMoney = async (req, res, next) => {
  try {
    const { amount, plan, billingCycle, phoneNumber } = req.body;

    if (!amount || !plan || !phoneNumber) {
      throw new AppError('Missing payment details', 400);
    }

    const result = await processOrangeMoneyPayment({
      userId: req.user._id,
      amount,
      plan,
      billingCycle,
      phoneNumber,
    });

    res.status(200).json({
      success: true,
      message: result.message,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

// Webhook for mobile money confirmation
export const paymentWebhook = async (req, res, next) => {
  try {
    const { reference, status } = req.body;
    
    const result = await confirmMobilePayment(reference, status);

    res.status(200).json({
      success: true,
      message: 'Payment confirmed',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

// Payment history
export const paymentHistory = async (req, res, next) => {
  try {
    const history = await getPaymentHistory(req.user._id);

    res.status(200).json({
      success: true,
      data: { payments: history },
    });
  } catch (error) {
    next(error);
  }
};