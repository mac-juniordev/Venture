import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import { BarChart3, TrendingUp, Users, Activity, Trophy, Flame } from 'lucide-react';
import Spinner from '../../components/ui/Spinner';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const AdminAnalyticsPage = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchAnalytics(); }, []);

  const fetchAnalytics = async () => {
    try {
      const response = await adminService.getAnalytics();
      setAnalytics(response.data.data);
    } catch (error) { toast.error('Failed to load analytics'); }
    finally { setLoading(false); }
  };

  if (loading) return <div className="flex justify-center py-20"><Spinner size="lg" /></div>;

  const statCards = [
    { icon: Users, label: 'Total Builders', value: analytics?.totalBuilders || 0, color: 'text-sky-400', bg: 'bg-sky-500/10 border-sky-500/20' },
    { icon: Activity, label: 'Active Builders', value: analytics?.activeBuilders || 0, color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' },
    { icon: Users, label: 'New This Week', value: analytics?.newBuildersThisWeek || 0, color: 'text-purple-400', bg: 'bg-purple-500/10 border-purple-500/20' },
    { icon: Trophy, label: 'Active Challenges', value: analytics?.activeChallenges || 0, color: 'text-yellow-400', bg: 'bg-yellow-500/10 border-yellow-500/20' },
    { icon: Flame, label: 'Today Check-ins', value: analytics?.todayCheckins || 0, color: 'text-orange-400', bg: 'bg-orange-500/10 border-orange-500/20' },
    { icon: Trophy, label: 'Month Check-ins', value: analytics?.monthCheckins || 0, color: 'text-pink-400', bg: 'bg-pink-500/10 border-pink-500/20' },
  ];

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-white">Analytics</h1>
        <p className="text-gray-400 text-sm mt-1">Ecosystem health & growth metrics</p>
      </motion.div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {statCards.map((stat, index) => (
          <motion.div key={index} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }}
            className={`bg-[#0a0f1a] border border-gray-800 rounded-2xl p-6`}
          >
            <stat.icon className={`w-8 h-8 ${stat.color} mb-3`} />
            <div className="text-3xl font-bold text-white">{stat.value}</div>
            <div className="text-sm text-gray-400 mt-1">{stat.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Achievement Distribution */}
      {analytics?.achievementsByTier?.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="bg-[#0a0f1a] border border-gray-800 rounded-2xl p-6"
        >
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-sky-400" />
            Achievement Distribution
          </h2>
          <div className="space-y-3">
            {analytics.achievementsByTier.map((item, i) => {
              const max = Math.max(...analytics.achievementsByTier.map(a => a.count));
              const pct = max > 0 ? (item.count / max) * 100 : 0;
              return (
                <div key={i}>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-gray-400 capitalize">{item._id}</span>
                    <span className="text-white font-bold">{item.count}</span>
                  </div>
                  <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                    <div className="h-full bg-sky-400 rounded-full" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* Summary */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
        className="bg-[#0a0f1a] border border-gray-800 rounded-2xl p-6"
      >
        <h2 className="text-lg font-bold text-white mb-4">Quick Summary</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div><span className="text-gray-500">New Today:</span> <span className="text-white font-bold">{analytics?.newBuildersToday || 0}</span></div>
          <div><span className="text-gray-500">Completed Challenges:</span> <span className="text-white font-bold">{analytics?.completedChallenges || 0}</span></div>
          <div><span className="text-gray-500">Total Achievements:</span> <span className="text-white font-bold">{analytics?.totalAchievementsAwarded || 0}</span></div>
          <div><span className="text-gray-500">Total Check-ins:</span> <span className="text-white font-bold">{analytics?.totalCheckins || 0}</span></div>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminAnalyticsPage;