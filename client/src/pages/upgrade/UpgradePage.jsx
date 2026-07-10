import React, { useState, useEffect } from 'react';
import { subscriptionService } from '../../services/subscriptionService';
import { Check, Sprout, Rocket, Crown } from 'lucide-react';
import Spinner from '../../components/ui/Spinner';
import PaymentModal from '../../components/payment/PaymentModal';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import confetti from 'canvas-confetti';

const UpgradePage = () => {
  const [loading, setLoading] = useState(true);
  const [plans, setPlans] = useState([]);
  const [currentPlan, setCurrentPlan] = useState(null);
  const [billingCycle, setBillingCycle] = useState('monthly');
  const [upgrading, setUpgrading] = useState(false);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [plansRes, subRes] = await Promise.all([
        subscriptionService.getPlans(),
        subscriptionService.getMySubscription(),
      ]);
      setPlans(plansRes.data.data.plans);
      setCurrentPlan(subRes.data.data.subscription);
    } catch (error) {
      console.error('Failed to load plans');
      toast.error('Failed to load plans');
    } finally {
      setLoading(false);
    }
  };

  const handleUpgradeClick = (plan) => {
    if (plan.name === 'explorer') {
      // Downgrade to free
      handleDowngrade();
      return;
    }
    setSelectedPlan({
      name: plan.name,
      displayName: plan.displayName,
      amount: billingCycle === 'monthly' ? plan.monthlyPrice : plan.yearlyPrice,
    });
    setPaymentModalOpen(true);
  };

  const handleDowngrade = async () => {
    setUpgrading(true);
    try {
      await subscriptionService.cancelSubscription();
      toast.success('Downgraded to Explorer plan');
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to downgrade');
    } finally {
      setUpgrading(false);
    }
  };

  const handlePaymentSuccess = () => {
    confetti({
      particleCount: 200,
      spread: 120,
      origin: { y: 0.6 },
      colors: ['#7dd3fc', '#34d399', '#fbbf24', '#a78bfa', '#f472b6'],
    });
    toast.success('Welcome to your new plan! 🚀');
    fetchData();
  };

  const getIcon = (name) => {
    const icons = {
      explorer: <Sprout className="w-7 h-7" />,
      builder: <Rocket className="w-7 h-7" />,
      visionary: <Crown className="w-7 h-7" />,
    };
    return icons[name] || <Sprout className="w-7 h-7" />;
  };

  const getIconBg = (name) => {
    const bgs = {
      explorer: 'bg-emerald-100 dark:bg-emerald-900/30',
      builder: 'bg-sky-100 dark:bg-sky-900/30',
      visionary: 'bg-purple-100 dark:bg-purple-900/30',
    };
    return bgs[name] || bgs.explorer;
  };

  const getIconColor = (name) => {
    const colors = {
      explorer: 'text-emerald-600 dark:text-emerald-400',
      builder: 'text-sky-600 dark:text-sky-400',
      visionary: 'text-purple-600 dark:text-purple-400',
    };
    return colors[name] || colors.explorer;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-8">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
          Choose Your Growth Path
        </h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
          Current plan:{' '}
          <span className="font-bold text-sky-500 dark:text-sky-400 capitalize">
            {currentPlan?.plan || 'explorer'}
          </span>
          {currentPlan?.billingCycle && (
            <span className="text-gray-400 dark:text-gray-500"> · {currentPlan.billingCycle}</span>
          )}
        </p>
      </motion.div>

      {/* Billing Toggle */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex items-center justify-center gap-4"
      >
        <span className={`text-sm font-medium transition-colors ${
          billingCycle === 'monthly' ? 'text-gray-900 dark:text-white' : 'text-gray-400 dark:text-gray-500'
        }`}>
          Monthly
        </span>
        <button
          onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
          className="relative w-14 h-7 bg-sky-400 dark:bg-sky-500 rounded-full transition-colors"
        >
          <div className={`absolute top-0.5 w-6 h-6 bg-white rounded-full shadow transition-transform duration-200 ${
            billingCycle === 'yearly' ? 'translate-x-7' : 'translate-x-0.5'
          }`} />
        </button>
        <span className={`text-sm font-medium transition-colors ${
          billingCycle === 'yearly' ? 'text-gray-900 dark:text-white' : 'text-gray-400 dark:text-gray-500'
        }`}>
          Yearly
          <span className="ml-1.5 px-2 py-0.5 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 text-xs rounded-full font-bold">
            Save 20%
          </span>
        </span>
      </motion.div>

      {/* Pricing Cards */}
      <div className="grid md:grid-cols-3 gap-6 lg:gap-8 max-w-5xl mx-auto">
        {plans.map((plan, index) => {
          const isCurrentPlan = currentPlan?.plan === plan.name;
          const isPopular = plan.name === 'builder';

          return (
            <motion.div
              key={plan._id || index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + index * 0.1 }}
              className={`relative bg-white dark:bg-gray-800 rounded-2xl border-2 p-6 md:p-8 flex flex-col ${
                isPopular
                  ? 'border-sky-400 dark:border-sky-500 shadow-xl shadow-sky-100 dark:shadow-sky-900/30'
                  : isCurrentPlan
                  ? 'border-emerald-400 dark:border-emerald-500 shadow-md'
                  : 'border-gray-100 dark:border-gray-700 shadow-sm'
              }`}
            >
              {/* Popular Badge */}
              {isPopular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-sky-400 to-emerald-400 text-white text-xs font-bold rounded-full shadow-lg">
                  MOST POPULAR
                </div>
              )}

              {/* Current Plan Badge */}
              {isCurrentPlan && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 bg-emerald-400 text-white text-xs font-bold rounded-full shadow-lg">
                  CURRENT PLAN
                </div>
              )}

              {/* Plan Icon & Name */}
              <div className="mb-6">
                <div className={`w-12 h-12 ${getIconBg(plan.name)} rounded-xl flex items-center justify-center ${getIconColor(plan.name)} mb-4`}>
                  {getIcon(plan.name)}
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                  {plan.displayName || plan.name}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {plan.description || 'Growth plan'}
                </p>
              </div>

              {/* Price */}
              <div className="mb-6">
                <div className="flex items-baseline gap-1">
                  {billingCycle === 'monthly' ? (
                    <>
                      <span className="text-4xl font-bold text-gray-900 dark:text-white">
                        {plan.monthlyPrice === 0 ? 'Free' : `$${plan.monthlyPrice}`}
                      </span>
                      {plan.monthlyPrice > 0 && (
                        <span className="text-gray-400 dark:text-gray-500 text-sm">/month</span>
                      )}
                    </>
                  ) : (
                    <>
                      <span className="text-4xl font-bold text-gray-900 dark:text-white">
                        {plan.yearlyPrice === 0 ? 'Free' : `$${plan.yearlyPrice}`}
                      </span>
                      {plan.yearlyPrice > 0 && (
                        <span className="text-gray-400 dark:text-gray-500 text-sm">/month</span>
                      )}
                    </>
                  )}
                </div>
                {billingCycle === 'yearly' && plan.yearlyPrice > 0 && (
                  <p className="text-xs text-emerald-500 dark:text-emerald-400 mt-1">
                    Save ${plan.monthlyPrice * 12 - plan.yearlyPrice * 12} yearly
                  </p>
                )}
                {plan.monthlyPrice === 0 && (
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">No credit card required</p>
                )}
              </div>

              {/* CTA Button */}
              <button
                onClick={() => handleUpgradeClick(plan)}
                disabled={isCurrentPlan || upgrading}
                className={`w-full py-3 rounded-xl font-semibold text-sm transition-all duration-200 mb-6 ${
                  isCurrentPlan
                    ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 cursor-default'
                    : plan.name === 'explorer'
                    ? 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                    : isPopular
                    ? 'bg-gradient-to-r from-sky-400 to-emerald-400 hover:from-sky-500 hover:to-emerald-500 text-white shadow-lg shadow-sky-200 dark:shadow-sky-900/30'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                {isCurrentPlan ? 'Current Plan' : plan.name === 'explorer' ? 'Free Forever' : `Upgrade to ${plan.displayName}`}
              </button>

              {/* Features List */}
              <div className="space-y-3 flex-1">
                {plan.features?.map((feature, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-emerald-500 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        {feature.name || feature}
                      </span>
                      {feature.limit && (
                        <span className="text-xs text-gray-400 dark:text-gray-500 ml-1">
                          (Up to {feature.limit})
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Payment Modal */}
      {selectedPlan && (
        <PaymentModal
          isOpen={paymentModalOpen}
          onClose={() => {
            setPaymentModalOpen(false);
            setSelectedPlan(null);
          }}
          plan={selectedPlan.name}
          billingCycle={billingCycle}
          amount={selectedPlan.amount}
          onSuccess={handlePaymentSuccess}
        />
      )}
    </div>
  );
};

export default UpgradePage;