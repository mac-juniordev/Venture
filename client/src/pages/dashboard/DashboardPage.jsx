import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { userService } from '../../services/userService';
import { growthService } from '../../services/growthService';
import { motivationService } from '../../services/motivationService';
import { Flame, Zap, Trophy, TrendingUp, Clock, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const DashboardPage = () => {
  const { user } = useAuth();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [profile, setProfile] = useState(null);
  const [growthData, setGrowthData] = useState(null);
  const [motivation, setMotivation] = useState({ 
    message: "Time is moving. What are you building?", 
    author: "VENTURE" 
  });

  useEffect(() => {
    fetchProfile();
    fetchGrowthData();
    fetchMotivation();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await userService.getMyProfile();
      setProfile(response.data.data.profile);
    } catch (error) {}
  };

  const fetchGrowthData = async () => {
    try {
      const response = await growthService.getTodayStatus();
      setGrowthData(response.data.data);
    } catch (error) {}
  };

  const fetchMotivation = async () => {
    try {
      const response = await motivationService.getDailyMotivation();
      setMotivation(response.data.data.message);
    } catch (error) {}
  };

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const getDisplayName = () => {
    if (profile?.displayName) return profile.displayName;
    if (profile?.username) return profile.username;
    return user?.email?.split('@')[0] || 'Builder';
  };

  const formatTime = (date) => date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true });
  const formatDate = (date) => date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  const quickStats = [
    { 
      icon: Flame, 
      label: 'Current Streak', 
      value: growthData?.streaks?.currentStreak || 0,
      suffix: 'days',
      color: 'text-orange-500 dark:text-orange-400', 
      bg: 'bg-orange-50 dark:bg-orange-900/20' 
    },
    { 
      icon: Zap, 
      label: 'Total Check-ins', 
      value: profile?.totalCheckIns || 0,
      suffix: '',
      color: 'text-emerald-500 dark:text-emerald-400', 
      bg: 'bg-emerald-50 dark:bg-emerald-900/20' 
    },
    { 
      icon: Trophy, 
      label: 'Challenges', 
      value: profile?.challengesCompleted || 0,
      suffix: 'Completed',
      color: 'text-sky-500 dark:text-sky-400', 
      bg: 'bg-sky-50 dark:bg-sky-900/20' 
    },
    { 
      icon: TrendingUp, 
      label: 'Longest Streak', 
      value: growthData?.streaks?.longestStreak || profile?.longestStreak || 0,
      suffix: 'days',
      color: 'text-yellow-500 dark:text-yellow-400', 
      bg: 'bg-yellow-50 dark:bg-yellow-900/20' 
    },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-4 md:space-y-6 pb-6 md:pb-8">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-5 md:p-8"
      >
        <h1 className="text-xl md:text-3xl font-bold text-gray-900 dark:text-white mb-1 md:mb-2">
          {getGreeting()}, {getDisplayName()}
        </h1>
        <p className="text-gray-500 dark:text-gray-400 text-xs md:text-base">{formatDate(currentTime)}</p>
      </motion.div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 md:gap-4">
        {quickStats.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-4 md:p-6"
          >
            <div className={`w-9 h-9 md:w-10 md:h-10 ${stat.bg} rounded-xl flex items-center justify-center mb-3 md:mb-4`}>
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
            </div>
            <div className="flex items-baseline gap-1">
              <div className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</div>
              {stat.suffix && <div className="text-xs md:text-sm text-gray-500 dark:text-gray-400">{stat.suffix}</div>}
            </div>
            <div className="text-xs md:text-sm text-gray-500 dark:text-gray-400 mt-0.5">{stat.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Main Content Area */}
      <div className="grid lg:grid-cols-2 gap-3 md:gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-5 md:p-8"
        >
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Today's Check-in</h2>
          {growthData?.hasCheckedIn ? (
            <div className="text-center py-4">
              <div className="w-14 h-14 md:w-16 md:h-16 bg-emerald-50 dark:bg-emerald-900/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <Zap className="w-7 h-7 md:w-8 md:h-8 text-emerald-500 dark:text-emerald-400" />
              </div>
              <p className="text-gray-900 dark:text-white font-medium">Done for today! 🎉</p>
              <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Come back tomorrow.</p>
            </div>
          ) : (
            <div className="text-center py-4">
              <div className="w-14 h-14 md:w-16 md:h-16 bg-sky-50 dark:bg-sky-900/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <Flame className="w-7 h-7 md:w-8 md:h-8 text-sky-500 dark:text-sky-400" />
              </div>
              <p className="text-gray-900 dark:text-white font-medium">Ready to build today?</p>
              <p className="text-gray-500 dark:text-gray-400 text-sm mt-1 mb-4">Don't break your streak!</p>
              <Link
                to="/check-in"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-sky-400 to-emerald-400 hover:from-sky-500 hover:to-emerald-500 text-white text-sm font-semibold rounded-xl transition-all duration-200 shadow-lg shadow-sky-200 dark:shadow-sky-900/30"
              >
                Check In Now
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-5 md:p-8"
        >
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Growth Timeline</h2>
          <div className="text-center py-4">
            <div className="w-14 h-14 md:w-16 md:h-16 bg-emerald-50 dark:bg-emerald-900/20 rounded-full flex items-center justify-center mx-auto mb-3">
              <TrendingUp className="w-7 h-7 md:w-8 md:h-8 text-emerald-500 dark:text-emerald-400" />
            </div>
            <p className="text-gray-900 dark:text-white font-medium">Track your progress</p>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1 mb-4">See your growth over time.</p>
            <Link
              to="/timeline"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-sky-400 to-emerald-400 hover:from-sky-500 hover:to-emerald-500 text-white text-sm font-semibold rounded-xl transition-all duration-200 shadow-lg shadow-sky-200 dark:shadow-sky-900/30"
            >
              View Timeline
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Live Clock & Motivation - Compact card at bottom right */}
      <div className="flex justify-end">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="w-full sm:w-auto bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm px-5 py-4 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-5"
        >
          {/* Motivation */}
          <div className="sm:border-r border-gray-200 dark:border-gray-600 sm:pr-5">
            <p className="text-sm text-gray-600 dark:text-gray-300 italic leading-relaxed">
              "{motivation.message}"
            </p>
            <p className="text-sky-500 dark:text-sky-400 text-xs mt-1">— {motivation.author}</p>
          </div>

          {/* Separator for mobile */}
          <div className="sm:hidden w-full h-px bg-gray-200 dark:bg-gray-600" />

          {/* Clock */}
          <div className="flex items-center gap-3 flex-shrink-0">
            <div className="w-10 h-10 bg-sky-50 dark:bg-sky-900/20 rounded-lg flex items-center justify-center">
              <Clock className="w-5 h-5 text-sky-500 dark:text-sky-400" />
            </div>
            <div>
              <div className="text-xl font-bold text-gray-900 dark:text-white font-mono tracking-wider tabular-nums">
                {formatTime(currentTime)}
              </div>
              <p className="text-[10px] text-gray-400 dark:text-gray-500">{formatDate(currentTime)}</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default DashboardPage;