import Plan from '../models/Plan.js';
import Subscription from '../models/Subscription.js';
import { AppError } from '../middleware/errorHandler.js';

// Get all plans
export const getPlans = async (req, res, next) => {
  try {
    const plans = await Plan.find({ isActive: true }).sort({ monthlyPrice: 1 });
    res.status(200).json({ success: true, data: { plans } });
  } catch (error) {
    next(error);
  }
};

// Get current user subscription
export const getMySubscription = async (req, res, next) => {
  try {
    let subscription = await Subscription.findOne({ user: req.user._id });
    
    if (!subscription) {
      subscription = await Subscription.create({
        user: req.user._id,
        plan: 'explorer',
        status: 'active',
      });
    }

    const plan = await Plan.findOne({ name: subscription.plan });

    res.status(200).json({
      success: true,
      data: { subscription, plan },
    });
  } catch (error) {
    next(error);
  }
};

// Upgrade/downgrade subscription
export const updateSubscription = async (req, res, next) => {
  try {
    const { plan, billingCycle } = req.body;

    const planDoc = await Plan.findOne({ name: plan });
    if (!planDoc) {
      throw new AppError('Invalid plan selected', 400);
    }

    const subscription = await Subscription.findOneAndUpdate(
      { user: req.user._id },
      {
        plan,
        billingCycle: billingCycle || 'monthly',
        status: 'active',
        startDate: new Date(),
        paymentMethod: 'card', // Will be set by actual payment
      },
      { new: true, upsert: true }
    );

    res.status(200).json({
      success: true,
      message: `Successfully upgraded to ${planDoc.displayName}!`,
      data: { subscription, plan: planDoc },
    });
  } catch (error) {
    next(error);
  }
};

// Cancel subscription
export const cancelSubscription = async (req, res, next) => {
  try {
    const subscription = await Subscription.findOne({ user: req.user._id });
    
    if (!subscription || subscription.plan === 'explorer') {
      throw new AppError('No active paid subscription to cancel', 400);
    }

    subscription.status = 'cancelled';
    subscription.plan = 'explorer';
    await subscription.save();

    res.status(200).json({
      success: true,
      message: 'Subscription cancelled. You\'re now on the Explorer plan.',
    });
  } catch (error) {
    next(error);
  }
};