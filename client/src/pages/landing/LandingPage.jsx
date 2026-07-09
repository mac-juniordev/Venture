import React, { useState, useEffect } from 'react';
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
  Menu, 
  X,
  Sparkles,
  Shield,
  Clock,
  Heart
} from 'lucide-react';
import heroImage from '../../assets/hero-developers.jpg';

const LandingPage = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-emerald-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300">
      {/* Navbar */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/95 dark:bg-gray-900/95 backdrop-blur-md shadow-lg shadow-sky-100/50 dark:shadow-gray-900/50' 
          : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-20">
            <Link to="/" className="flex items-center gap-2">
              <span className="text-2xl font-bold bg-gradient-to-r from-sky-500 to-emerald-500 bg-clip-text text-transparent">
                VENTURE
              </span>
            </Link>

            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-gray-600 dark:text-gray-300 hover:text-sky-500 dark:hover:text-sky-400 font-medium transition-colors">
                Features
              </a>
              <a href="#about" className="text-gray-600 dark:text-gray-300 hover:text-sky-500 dark:hover:text-sky-400 font-medium transition-colors">
                About
              </a>
              <a href="#contact" className="text-gray-600 dark:text-gray-300 hover:text-sky-500 dark:hover:text-sky-400 font-medium transition-colors">
                Contact
              </a>
              <Link to="/login" className="text-gray-600 dark:text-gray-300 hover:text-sky-500 dark:hover:text-sky-400 font-medium transition-colors">
                Sign In
              </Link>
              <Link to="/register" className="px-6 py-2.5 bg-gradient-to-r from-sky-400 to-emerald-400 hover:from-sky-500 hover:to-emerald-500 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg shadow-sky-200 dark:shadow-sky-900/30">
                Start Building
              </Link>
            </div>

            <button className="md:hidden text-gray-600 dark:text-gray-300" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {mobileMenuOpen && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="md:hidden py-4 border-t border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-900">
              <div className="flex flex-col gap-4">
                <a href="#features" className="text-gray-600 dark:text-gray-300 hover:text-sky-500 font-medium py-2" onClick={() => setMobileMenuOpen(false)}>Features</a>
                <a href="#about" className="text-gray-600 dark:text-gray-300 hover:text-sky-500 font-medium py-2" onClick={() => setMobileMenuOpen(false)}>About</a>
                <a href="#contact" className="text-gray-600 dark:text-gray-300 hover:text-sky-500 font-medium py-2" onClick={() => setMobileMenuOpen(false)}>Contact</a>
                <Link to="/login" className="text-gray-600 dark:text-gray-300 hover:text-sky-500 font-medium py-2" onClick={() => setMobileMenuOpen(false)}>Sign In</Link>
                <Link to="/register" className="px-6 py-3 bg-gradient-to-r from-sky-400 to-emerald-400 text-white font-semibold rounded-xl text-center shadow-lg shadow-sky-200" onClick={() => setMobileMenuOpen(false)}>Start Building</Link>
              </div>
            </motion.div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
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
                  Powered by Consistency
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
              <a href="#features" className="px-8 py-4 bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 text-white font-semibold text-lg rounded-xl transition-all duration-200 text-center">
                Explore Features
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

      {/* About Section */}
      <section id="about" className="py-24 px-6 bg-gradient-to-br from-sky-50 to-emerald-50 dark:from-gray-800 dark:to-gray-900 transition-colors duration-300">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
                The Philosophy of
                <span className="block bg-gradient-to-r from-sky-500 to-emerald-500 bg-clip-text text-transparent">Consistent Growth</span>
              </h2>
              <div className="space-y-6">
                <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed">
                  VENTURE was built on a simple truth: small, consistent actions compound into extraordinary results.
                </p>
                <div className="space-y-4">
                  {[
                    { icon: Shield, color: 'sky', title: 'Consistency First', desc: 'Build habits that stick. Every check-in matters.' },
                    { icon: Clock, color: 'emerald', title: 'Time is Moving', desc: 'Every moment is an opportunity to build something great.' },
                    { icon: Heart, color: 'sky', title: 'Community Driven', desc: 'Grow together. Celebrate wins. Stay accountable.' }
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-4">
                      <div className={`w-10 h-10 bg-${item.color === 'sky' ? 'sky' : 'emerald'}-100 dark:bg-${item.color === 'sky' ? 'sky' : 'emerald'}-900/20 rounded-lg flex items-center justify-center flex-shrink-0`}>
                        <item.icon className={`w-5 h-5 text-${item.color === 'sky' ? 'sky' : 'emerald'}-500`} />
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900 dark:text-white mb-1">{item.title}</h3>
                        <p className="text-gray-500 dark:text-gray-400">{item.desc}</p>
                      </div>
                    </div>
                  ))}
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