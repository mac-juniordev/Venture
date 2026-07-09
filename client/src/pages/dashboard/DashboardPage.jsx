import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { userService } from '../../services/userService';
import { Flame, Zap, Trophy, TrendingUp, Clock } from 'lucide-react';

const DashboardPage = () => {
  const { user } = useAuth();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [profile, setProfile] = useState(null);
  const [motivation] = useState({ message: "Time is moving. What are you building?", author: "VENTURE" });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await userService.getMyProfile();
        setProfile(response.data.data.profile);
      } catch (error) {}
    };
    fetchProfile();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

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
    { icon: Flame, label: 'Current Streak', value: '0 days', color: 'text-sky-500 dark:text-sky-400', bg: 'bg-sky-50 dark:bg-sky-900/20' },
    { icon: Zap, label: 'Total Check-ins', value: '0', color: 'text-emerald-500 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-900/20' },
    { icon: Trophy, label: 'Challenges', value: '0 Active', color: 'text-sky-500 dark:text-sky-400', bg: 'bg-sky-50 dark:bg-sky-900/20' },
    { icon: TrendingUp, label: 'Growth Score', value: '0', color: 'text-emerald-500 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-900/20' },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-6 md:p-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">{getGreeting()}, {getDisplayName()}</h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm md:text-base">{formatDate(currentTime)}</p>
      </motion.div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        {quickStats.map((stat, index) => (
          <motion.div key={index} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }} className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-4 md:p-6">
            <div className={`w-10 h-10 ${stat.bg} rounded-xl flex items-center justify-center mb-3 md:mb-4`}>
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
            </div>
            <div className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-1">{stat.value}</div>
            <div className="text-xs md:text-sm text-gray-500 dark:text-gray-400">{stat.label}</div>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-4 md:gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-6 md:p-8">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Today's Progress</h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm">Complete your daily check-in to start tracking your growth.</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-6 md:p-8">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Active Challenges</h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm">Join a challenge to compete and grow with the community.</p>
        </motion.div>
      </div>

      <div className="flex justify-end">
  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} 
    className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm px-6 py-4 flex items-center gap-5 max-w-fit"
  >
    <div className="border-r border-gray-200 dark:border-gray-600 pr-5">
      <p className="text-sm text-gray-600 dark:text-gray-300 italic leading-relaxed max-w-xs">"{motivation.message}"</p>
      <p className="text-sky-500 dark:text-sky-400 text-xs mt-1">— {motivation.author}</p>
    </div>
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 bg-sky-50 dark:bg-sky-900/20 rounded-lg flex items-center justify-center">
        <Clock className="w-5 h-5 text-sky-500 dark:text-sky-400" />
      </div>
      <div>
        <div className="text-xl font-bold text-gray-900 dark:text-white font-mono tracking-wider tabular-nums">{formatTime(currentTime)}</div>
        <p className="text-[10px] text-gray-400 dark:text-gray-500">{formatDate(currentTime)}</p>
      </div>
    </div>
  </motion.div>
    </div>
    </div>
  );
};

export default DashboardPage;