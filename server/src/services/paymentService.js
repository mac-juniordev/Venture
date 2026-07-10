import Payment from '../models/Payment.js';
import Subscription from '../models/Subscription.js';
import { AppError } from '../middleware/errorHandler.js';

// ============================================
// CARD PAYMENT (Stripe Integration Ready)
// ============================================
export const processCardPayment = async ({ userId, amount, plan, billingCycle, stripeToken }) => {
  // Create pending payment
  const payment = await Payment.create({
    user: userId,
    amount,
    currency: 'XAF',
    method: 'card',
    status: 'pending',
    provider: 'stripe',
    plan,
    billingCycle,
    description: `${plan} plan - ${billingCycle}`,
  });

  try {
    // TODO: Integrate Stripe SDK
    // const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
    // const charge = await stripe.charges.create({
    //   amount: amount * 100, // Convert to cents
    //   currency: 'xaf',
    //   source: stripeToken,
    //   description: `VENTURE ${plan} plan`,
    // });

    // For now, simulate successful payment
    const simulatedResponse = {
      id: `stripe_${Date.now()}`,
      status: 'succeeded',
      amount: amount * 100,
      currency: 'xaf',
    };

    payment.status = 'completed';
    payment.providerReference = simulatedResponse.id;
    payment.providerData = simulatedResponse;
    payment.paidAt = new Date();
    await payment.save();

    // Activate subscription
    await activateSubscription(userId, plan, billingCycle, 'card');

    return { success: true, payment };
  } catch (error) {
    payment.status = 'failed';
    payment.failureReason = error.message;
    await payment.save();
    throw new AppError('Card payment failed. Please try again.', 400);
  }
};

// ============================================
// MTN MOBILE MONEY (Cameroon)
// ============================================
export const processMtnMoneyPayment = async ({ userId, amount, plan, billingCycle, phoneNumber }) => {
  // Validate Cameroon MTN number (starts with 67, 68, 69)
  const mtnRegex = /^(237)?6[7-9][0-9]{7}$/;
  const cleanNumber = phoneNumber.replace(/\s+/g, '').replace('+', '');
  
  if (!mtnRegex.test(cleanNumber)) {
    throw new AppError('Invalid MTN Mobile Money number. Must be a valid Cameroon MTN number.', 400);
  }

  const payment = await Payment.create({
    user: userId,
    amount,
    currency: 'XAF',
    method: 'mtn_money',
    status: 'pending',
    provider: 'mtn_cm',
    plan,
    billingCycle,
    phoneNumber: cleanNumber,
    description: `${plan} plan - MTN Money`,
  });

  try {
    // TODO: Integrate MTN Mobile Money API
    // const mtnResponse = await mtnMomoApi.requestPayment({
    //   amount,
    //   currency: 'XAF',
    //   phoneNumber: cleanNumber,
    //   reference: payment._id.toString(),
    // });

    // Simulated response
    const simulatedResponse = {
      referenceId: `mtn_${Date.now()}`,
      status: 'PENDING',
      message: 'Payment request sent. Check your phone to confirm.',
    };

    payment.status = 'processing';
    payment.providerReference = simulatedResponse.referenceId;
    payment.providerData = simulatedResponse;
    await payment.save();

    return { 
      success: true, 
      payment,
      message: 'Check your MTN Mobile Money phone to confirm payment.',
      requiresConfirmation: true,
    };
  } catch (error) {
    payment.status = 'failed';
    payment.failureReason = error.message;
    await payment.save();
    throw new AppError('MTN Money payment failed. Please try again.', 400);
  }
};

// ============================================
// ORANGE MONEY (Cameroon)
// ============================================
export const processOrangeMoneyPayment = async ({ userId, amount, plan, billingCycle, phoneNumber }) => {
  // Validate Cameroon Orange number (starts with 69, 65, 66)
  const orangeRegex = /^(237)?6[5-6|9][0-9]{7}$/;
  const cleanNumber = phoneNumber.replace(/\s+/g, '').replace('+', '');
  
  if (!orangeRegex.test(cleanNumber)) {
    throw new AppError('Invalid Orange Money number. Must be a valid Cameroon Orange number.', 400);
  }

  const payment = await Payment.create({
    user: userId,
    amount,
    currency: 'XAF',
    method: 'orange_money',
    status: 'pending',
    provider: 'orange_cm',
    plan,
    billingCycle,
    phoneNumber: cleanNumber,
    description: `${plan} plan - Orange Money`,
  });

  try {
    // TODO: Integrate Orange Money API
    // const orangeResponse = await orangeMoneyApi.requestPayment({
    //   amount,
    //   phoneNumber: cleanNumber,
    //   reference: payment._id.toString(),
    // });

    const simulatedResponse = {
      referenceId: `orange_${Date.now()}`,
      status: 'PENDING',
      message: 'Payment request sent. Dial #150# to confirm.',
    };

    payment.status = 'processing';
    payment.providerReference = simulatedResponse.referenceId;
    payment.providerData = simulatedResponse;
    await payment.save();

    return { 
      success: true, 
      payment,
      message: 'Dial #150# on your Orange line to confirm payment.',
      requiresConfirmation: true,
    };
  } catch (error) {
    payment.status = 'failed';
    payment.failureReason = error.message;
    await payment.save();
    throw new AppError('Orange Money payment failed. Please try again.', 400);
  }
};

// ============================================
// CONFIRM MOBILE MONEY PAYMENT (Webhook)
// ============================================
export const confirmMobilePayment = async (providerReference, providerStatus) => {
  const payment = await Payment.findOne({ providerReference });
  
  if (!payment) {
    throw new AppError('Payment not found', 404);
  }

  if (providerStatus === 'SUCCESSFUL') {
    payment.status = 'completed';
    payment.paidAt = new Date();
    await payment.save();

    await activateSubscription(
      payment.user, 
      payment.plan, 
      payment.billingCycle, 
      payment.method
    );
  } else if (providerStatus === 'FAILED') {
    payment.status = 'failed';
    payment.failureReason = 'Payment was not completed';
    await payment.save();
  }

  return payment;
};

// ============================================
// ACTIVATE SUBSCRIPTION
// ============================================
const activateSubscription = async (userId, plan, billingCycle, paymentMethod) => {
  const endDate = new Date();
  if (billingCycle === 'monthly') {
    endDate.setMonth(endDate.getMonth() + 1);
  } else {
    endDate.setFullYear(endDate.getFullYear() + 1);
  }

  await Subscription.findOneAndUpdate(
    { user: userId },
    {
      plan,
      billingCycle,
      status: 'active',
      startDate: new Date(),
      endDate,
      paymentMethod,
      autoRenew: true,
    },
    { upsert: true, new: true }
  );
};

// Get payment history
export const getPaymentHistory = async (userId) => {
  return await Payment.find({ user: userId })
    .sort({ createdAt: -1 })
    .limit(20)
    .lean();
};