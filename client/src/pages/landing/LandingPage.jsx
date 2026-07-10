import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Zap, 
  Trophy, 
  TrendingUp, 
  Users, 
  Target, 
  BarChart3, 
  ArrowRight, 
  Sparkles,
  Shield,
  Clock,
  Heart,
  Check,
  Sprout,
  Rocket,
  Crown
} from 'lucide-react';
import PublicNavbar from '../../components/layout/PublicNavbar';
import heroImage from '../../assets/hero-developers.jpg';

const LandingPage = () => {
  const [billingCycle, setBillingCycle] = useState('monthly');

  const features = [
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Daily Check-ins",
      description: "Build consistency with daily progress tracking. Every check-in strengthens your growth streak."
    },
    {
      icon: <Trophy className="w-8 h-8" />,
      title: "Challenges",
      description: "Join technology challenges, compete with peers, and push your limits in a supportive environment."
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: "Growth Tracking",
      description: "Visualize your progress over time. See how small daily actions compound into massive results."
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Community",
      description: "Connect with fellow builders. Celebrate wins together and stay motivated through the journey."
    },
    {
      icon: <Target className="w-8 h-8" />,
      title: "Achievements",
      description: "Earn meaningful badges that reflect your dedication. From First Step to Legendary Streak."
    },
    {
      icon: <BarChart3 className="w-8 h-8" />,
      title: "Leaderboards",
      description: "Healthy competition that drives growth. See where you stand and strive for improvement."
    }
  ];

  const stats = [
    { number: "10K+", label: "Active Builders" },
    { number: "50K+", label: "Daily Check-ins" },
    { number: "1M+", label: "Streaks Maintained" },
    { number: "500+", label: "Challenges Completed" }
  ];

  const plans = [
    {
      name: "Explorer",
      icon: <Sprout className="w-7 h-7" />,
      iconBg: "bg-emerald-100 dark:bg-emerald-900/30",
      iconColor: "text-emerald-600 dark:text-emerald-400",
      description: "Start your growth journey with essential tracking tools.",
      monthlyPrice: 0,
      yearlyPrice: 0,
      cta: "Start Free",
      features: [
        { text: "Daily check-ins & streaks", included: true },
        { text: "Basic growth tracking", included: true },
        { text: "Join up to 3 challenges", included: true },
        { text: "Community reactions", included: true },
        { text: "Achievement badges", included: true },
        { text: "Leaderboard access", included: true },
        { text: "Custom challenge creation", included: false },
        { text: "Advanced analytics", included: false },
        { text: "Priority support", included: false },
        { text: "Custom branding", included: false },
      ]
    },
    {
      name: "Builder",
      icon: <Rocket className="w-7 h-7" />,
      iconBg: "bg-sky-100 dark:bg-sky-900/30",
      iconColor: "text-sky-600 dark:text-sky-400",
      description: "Unlock advanced features to accelerate your growth.",
      monthlyPrice: 9,
      yearlyPrice: 7,
      cta: "Start Building",
      popular: true,
      features: [
        { text: "Everything in Explorer", included: true },
        { text: "Unlimited challenges", included: true },
        { text: "Create custom challenges", included: true },
        { text: "Advanced analytics & insights", included: true },
        { text: "Export growth reports", included: true },
        { text: "Priority challenge access", included: true },
        { text: "Ad-free experience", included: true },
        { text: "Custom branding", included: false },
        { text: "Team challenges", included: false },
      ]
    },
    {
      name: "Visionary",
      icon: <Crown className="w-7 h-7" />,
      iconBg: "bg-purple-100 dark:bg-purple-900/30",
      iconColor: "text-purple-600 dark:text-purple-400",
      description: "For serious builders who want the complete ecosystem.",
      monthlyPrice: 19,
      yearlyPrice: 15,
      cta: "Go Visionary",
      features: [
        { text: "Everything in Builder", included: true },
        { text: "Custom branding & profile", included: true },
        { text: "Team challenges & groups", included: true },
        { text: "API access", included: true },
        { text: "Priority support 24/7", included: true },
        { text: "Early access to features", included: true },
        { text: "Exclusive Visionary badge", included: true },
        { text: "Monthly coaching calls", included: true },
        { text: "White-label options", included: true },
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-emerald-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300">
      <PublicNavbar />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center overflow-hidden pt-16">
        <div className="absolute inset-0 z-0">
          <img src={heroImage} alt="Developers collaborating" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-br from-gray-900/95 via-sky-900/90 to-emerald-900/95" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 py-32">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="max-w-3xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="px-4 py-2 bg-sky-400/20 backdrop-blur-sm rounded-full border border-sky-400/30">
                <span className="text-sky-300 font-medium text-sm flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  Powered by MacDotCom
                </span>
              </div>
            </div>

            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-8 leading-tight">
              The Journey of
              <span className="block bg-gradient-to-r from-sky-400 to-emerald-400 bg-clip-text text-transparent">Growth</span>
            </h1>

            <p className="text-xl md:text-2xl text-gray-300 mb-12 leading-relaxed max-w-2xl font-medium">
              Turn consistency into measurable growth. Join challenges, track progress, and build your legacy — one day at a time.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/register" className="px-8 py-4 bg-gradient-to-r from-sky-400 to-emerald-400 hover:from-sky-500 hover:to-emerald-500 text-white font-bold text-lg rounded-xl transition-all duration-200 shadow-2xl shadow-sky-500/30 flex items-center justify-center gap-2 group">
                Start Your Journey
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <a href="#pricing" className="px-8 py-4 bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 text-white font-semibold text-lg rounded-xl transition-all duration-200 text-center">
                View Plans
              </a>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-20">
              {stats.map((stat, index) => (
                <motion.div key={index} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}>
                  <div className="text-3xl md:text-4xl font-bold text-white mb-1">{stat.number}</div>
                  <div className="text-gray-400 text-sm">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        <motion.div animate={{ y: [0, 10, 0] }} transition={{ duration: 2, repeat: Infinity }} className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10">
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center pt-2">
            <div className="w-1.5 h-1.5 bg-white/60 rounded-full" />
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 px-6 dark:bg-gray-900 transition-colors duration-300">
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Everything You Need to
              <span className="block bg-gradient-to-r from-sky-500 to-emerald-500 bg-clip-text text-transparent">Grow Consistently</span>
            </h2>
            <p className="text-gray-500 dark:text-gray-400 text-lg max-w-2xl mx-auto">
              VENTURE provides all the tools you need to turn daily actions into lasting results.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div key={index} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group p-8 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 hover:border-sky-200 dark:hover:border-sky-700 transition-all duration-300 hover:shadow-xl hover:shadow-sky-50 dark:hover:shadow-sky-900/20"
              >
                <div className="w-14 h-14 bg-gradient-to-br from-sky-100 to-emerald-100 dark:from-sky-900/30 dark:to-emerald-900/30 rounded-xl flex items-center justify-center text-sky-500 dark:text-sky-400 mb-6 group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{feature.title}</h3>
                <p className="text-gray-500 dark:text-gray-400 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 px-6 bg-gradient-to-br from-sky-50 to-emerald-50 dark:from-gray-800 dark:to-gray-900 transition-colors duration-300">
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Choose Your
              <span className="block bg-gradient-to-r from-sky-500 to-emerald-500 bg-clip-text text-transparent">Growth Path</span>
            </h2>
            <p className="text-gray-500 dark:text-gray-400 text-lg max-w-2xl mx-auto">
              Every journey starts with a single step. Pick the plan that matches your ambition.
            </p>
          </motion.div>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center gap-4 mb-12">
            <span className={`text-sm font-medium ${billingCycle === 'monthly' ? 'text-gray-900 dark:text-white' : 'text-gray-400 dark:text-gray-500'}`}>Monthly</span>
            <button
              onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
              className="relative w-14 h-7 bg-sky-400 dark:bg-sky-500 rounded-full transition-colors"
            >
              <div className={`absolute top-0.5 w-6 h-6 bg-white rounded-full shadow transition-transform ${billingCycle === 'yearly' ? 'translate-x-7' : 'translate-x-0.5'}`} />
            </button>
            <span className={`text-sm font-medium ${billingCycle === 'yearly' ? 'text-gray-900 dark:text-white' : 'text-gray-400 dark:text-gray-500'}`}>
              Yearly
              <span className="ml-1.5 px-2 py-0.5 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 text-xs rounded-full font-bold">Save 20%</span>
            </span>
          </div>

          {/* Pricing Cards */}
          <div className="grid md:grid-cols-3 gap-6 lg:gap-8 max-w-5xl mx-auto">
            {plans.map((plan, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`relative bg-white dark:bg-gray-800 rounded-2xl border-2 p-6 md:p-8 flex flex-col ${
                  plan.popular
                    ? 'border-sky-400 dark:border-sky-500 shadow-xl shadow-sky-100 dark:shadow-sky-900/30'
                    : 'border-gray-100 dark:border-gray-700 shadow-sm'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-sky-400 to-emerald-400 text-white text-xs font-bold rounded-full shadow-lg">
                    MOST POPULAR
                  </div>
                )}

                <div className="mb-6">
                  <div className={`w-12 h-12 ${plan.iconBg} rounded-xl flex items-center justify-center ${plan.iconColor} mb-4`}>
                    {plan.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">{plan.name}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{plan.description}</p>
                </div>

                <div className="mb-6">
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold text-gray-900 dark:text-white">
                      ${billingCycle === 'monthly' ? plan.monthlyPrice : plan.yearlyPrice}
                    </span>
                    <span className="text-gray-400 dark:text-gray-500 text-sm">/month</span>
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

                <Link
                  to="/register"
                  className={`w-full py-3 rounded-xl font-semibold text-sm transition-all duration-200 mb-6 text-center ${
                    plan.popular
                      ? 'bg-gradient-to-r from-sky-400 to-emerald-400 hover:from-sky-500 hover:to-emerald-500 text-white shadow-lg shadow-sky-200 dark:shadow-sky-900/30'
                      : plan.monthlyPrice === 0
                      ? 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  {plan.cta}
                </Link>

                <div className="space-y-3 flex-1">
                  {plan.features.map((feature, i) => (
                    <div key={i} className="flex items-start gap-3">
                      {feature.included ? (
                        <Check className="w-5 h-5 text-emerald-500 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
                      ) : (
                        <span className="w-5 h-5 flex items-center justify-center text-gray-300 dark:text-gray-600 flex-shrink-0 mt-0.5 text-sm">—</span>
                      )}
                      <span className={`text-sm ${feature.included ? 'text-gray-700 dark:text-gray-300' : 'text-gray-400 dark:text-gray-500'}`}>
                        {feature.text}
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-24 px-6 dark:bg-gray-900 transition-colors duration-300">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
                The Philosophy of
                <span className="block bg-gradient-to-r from-sky-500 to-emerald-500 bg-clip-text text-transparent">Consistent Growth</span>
              </h2>
              <div className="space-y-6">
                <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed">
                  VENTURE was built on a simple truth: small, consistent actions compound into extraordinary results. We're not another task manager — we're your growth partner.
                </p>
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-sky-100 dark:bg-sky-900/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Shield className="w-5 h-5 text-sky-500 dark:text-sky-400" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 dark:text-white mb-1">Consistency First</h3>
                      <p className="text-gray-500 dark:text-gray-400">Build habits that stick. Every check-in matters.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Clock className="w-5 h-5 text-emerald-500 dark:text-emerald-400" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 dark:text-white mb-1">Time is Moving</h3>
                      <p className="text-gray-500 dark:text-gray-400">Every moment is an opportunity to build something great.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-sky-100 dark:bg-sky-900/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Heart className="w-5 h-5 text-sky-500 dark:text-sky-400" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 dark:text-white mb-1">Community Driven</h3>
                      <p className="text-gray-500 dark:text-gray-400">Grow together. Celebrate wins. Stay accountable.</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.2 }} className="relative">
              <div className="bg-gradient-to-br from-sky-400 to-emerald-400 rounded-3xl p-8 md:p-12 text-white">
                <div className="text-6xl font-bold mb-4">"</div>
                <p className="text-xl md:text-2xl font-medium leading-relaxed mb-6">
                  Consistency is the compound interest of self-improvement. Small daily improvements lead to stunning long-term results.
                </p>
                <div className="border-t border-white/20 pt-6">
                  <p className="font-bold text-lg">The VENTURE Philosophy</p>
                  <p className="text-white/70 text-sm">Consistency → Progress → Proof → Growth</p>
                </div>
              </div>
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-sky-200/50 rounded-full blur-2xl" />
              <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-emerald-200/50 rounded-full blur-2xl" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <section id="contact" className="py-24 px-6 bg-gray-900 dark:bg-black transition-colors duration-300">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
              <h2 className="text-4xl font-bold text-white mb-6">
                Ready to Start
                <span className="block bg-gradient-to-r from-sky-400 to-emerald-400 bg-clip-text text-transparent">Your Journey?</span>
              </h2>
              <p className="text-gray-400 text-lg leading-relaxed mb-8">
                Join thousands of builders who are turning consistency into growth. Your journey starts with a single step.
              </p>
              <Link to="/register" className="inline-flex px-8 py-4 bg-gradient-to-r from-sky-400 to-emerald-400 hover:from-sky-500 hover:to-emerald-500 text-white font-bold text-lg rounded-xl transition-all duration-200 shadow-2xl shadow-sky-500/20 items-center gap-2 group">
                Begin Your Journey
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.2 }}>
              <div className="grid grid-cols-2 gap-8">
                <div>
                  <h3 className="text-white font-bold mb-4">Platform</h3>
                  <div className="space-y-3">
                    <a href="#features" className="block text-gray-400 hover:text-sky-400 transition-colors">Features</a>
                    <a href="#pricing" className="block text-gray-400 hover:text-sky-400 transition-colors">Pricing</a>
                    <a href="#about" className="block text-gray-400 hover:text-sky-400 transition-colors">About</a>
                    <Link to="/register" className="block text-gray-400 hover:text-sky-400 transition-colors">Get Started</Link>
                  </div>
                </div>
                <div>
                  <h3 className="text-white font-bold mb-4">Company</h3>
                  <div className="space-y-3">
                    <a href="#" className="block text-gray-400 hover:text-sky-400 transition-colors">Privacy Policy</a>
                    <a href="#" className="block text-gray-400 hover:text-sky-400 transition-colors">Terms of Service</a>
                    <a href="#contact" className="block text-gray-400 hover:text-sky-400 transition-colors">Contact</a>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          <div className="mt-16 pt-8 border-t border-gray-800 dark:border-gray-700 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-gray-500 text-sm">© 2026 VENTURE. Powered by MacDotCom. All rights reserved.</p>
            <p className="text-gray-600 text-sm">The Journey of Growth</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;