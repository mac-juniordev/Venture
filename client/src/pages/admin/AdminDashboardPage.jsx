import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import { Users, Trophy, Award, Activity, TrendingUp, Zap } from 'lucide-react';
import Spinner from '../../components/ui/Spinner';
import { motion } from 'framer-motion';

const AdminDashboardPage = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const response = await adminService.getDashboard();
      setStats(response.data.data.stats);
      setNotifications(response.data.data.recentNotifications || []);
    } catch (error) {
      console.error('Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Spinner size="lg" />
      </div>
    );
  }

  const statCards = [
    { icon: Users, label: 'Total Builders', value: stats?.totalBuilders || 0, color: 'text-sky-400', bg: 'bg-sky-500/10 border-sky-500/20' },
    { icon: Activity, label: 'Active Builders', value: stats?.activeBuilders || 0, color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' },
    { icon: Users, label: 'New Today', value: stats?.newBuildersToday || 0, color: 'text-purple-400', bg: 'bg-purple-500/10 border-purple-500/20' },
    { icon: Trophy, label: 'Active Challenges', value: stats?.activeChallenges || 0, color: 'text-yellow-400', bg: 'bg-yellow-500/10 border-yellow-500/20' },
    { icon: Award, label: 'Achievements', value: stats?.totalAchievementsAwarded || 0, color: 'text-orange-400', bg: 'bg-orange-500/10 border-orange-500/20' },
    { icon: Zap, label: 'Today Check-ins', value: stats?.todayCheckins || 0, color: 'text-pink-400', bg: 'bg-pink-500/10 border-pink-500/20' },
  ];

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Command Center</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Welcome back, The Architect. Venture is alive.</p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {statCards.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="bg-white dark:bg-[#0a0f1a] border border-gray-200 dark:border-gray-800 rounded-2xl p-6"
          >
            <stat.icon className={`w-8 h-8 ${stat.color} mb-3`} />
            <div className="text-3xl font-bold text-gray-900 dark:text-white">{stat.value}</div>
            <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">{stat.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Recent System Pulse */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white dark:bg-[#0a0f1a] border border-gray-200 dark:border-gray-800 rounded-2xl p-6"
      >
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <Activity className="w-5 h-5 text-sky-400" />
          System Pulse
        </h2>
        {notifications.length === 0 ? (
          <p className="text-gray-400 dark:text-gray-500 text-sm">No recent activity.</p>
        ) : (
          <div className="space-y-3">
            {notifications.slice(0, 10).map((n, i) => (
              <div key={i} className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-[#060a13] rounded-xl">
                <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                  n.priority === 'critical' ? 'bg-red-400' :
                  n.priority === 'high' ? 'bg-orange-400' : 'bg-sky-400'
                }`} />
                <div>
                  <p className="text-sm text-gray-900 dark:text-white">{n.title}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{n.description}</p>
                  <p className="text-xs text-gray-400 dark:text-gray-600 mt-1">{new Date(n.createdAt).toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default AdminDashboardPage;