import React, { useState, useEffect } from 'react';
import { achievementService } from '../../services/achievementService';
import { 
  Trophy, Star, Flame, Crown, Sparkles, Lock
} from 'lucide-react';
import Spinner from '../../components/ui/Spinner';
import AchievementBadge from '../../components/shared/AchievementBadge';
import { motion } from 'framer-motion';

const AchievementsPage = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchAchievements();
  }, []);

  const fetchAchievements = async () => {
    try {
      const response = await achievementService.getMyAchievements();
      setData(response.data.data);
    } catch (error) {
      console.error('Failed to load achievements');
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    { value: 'all', label: 'All', icon: Trophy },
    { value: 'streak', label: 'Streaks', icon: Flame },
    { value: 'checkin', label: 'Check-ins', icon: Star },
    { value: 'challenge', label: 'Challenges', icon: Trophy },
    { value: 'special', label: 'Special', icon: Sparkles },
  ];

  const tiers = ['legendary', 'platinum', 'gold', 'silver', 'bronze'];

  const filteredUnlocked = data?.unlocked?.filter(a => filter === 'all' || a.category === filter) || [];
  const filteredLocked = data?.locked?.filter(a => filter === 'all' || a.category === filter) || [];

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">Achievements</h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
          {data?.totalUnlocked || 0} of {data?.totalAvailable || 0} unlocked · {data?.totalXP || 0} XP earned
        </p>
      </motion.div>

      {/* XP Progress Bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-5 md:p-6"
      >
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            🎯 Completion Progress
          </span>
          <span className="text-sm font-bold text-sky-500">
            {Math.round((data?.totalUnlocked / data?.totalAvailable) * 100) || 0}%
          </span>
        </div>
        <div className="h-3 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${(data?.totalUnlocked / data?.totalAvailable) * 100 || 0}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className="h-full bg-gradient-to-r from-sky-400 to-emerald-400 rounded-full"
          />
        </div>
      </motion.div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => (
          <button
            key={cat.value}
            onClick={() => setFilter(cat.value)}
            className={`px-4 py-2 text-sm font-medium rounded-xl transition-all flex items-center gap-2 ${
              filter === cat.value
                ? 'bg-sky-50 dark:bg-sky-900/30 text-sky-600 dark:text-sky-400 shadow-sm'
                : 'bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:border-gray-300'
            }`}
          >
            <cat.icon className="w-4 h-4" />
            {cat.label}
          </button>
        ))}
      </div>

      {/* Unlocked Achievements */}
      {filteredUnlocked.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-5 md:p-8"
        >
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
            <Crown className="w-5 h-5 text-yellow-500" />
            Unlocked ({filteredUnlocked.length})
          </h2>

          {tiers.map(tier => {
            const tierAchievements = filteredUnlocked.filter(a => a.tier === tier);
            if (tierAchievements.length === 0) return null;

            return (
              <div key={tier} className="mb-6 last:mb-0">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 capitalize">
                  {tier}
                </h3>
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
                  {tierAchievements.map((achievement) => (
                    <div key={achievement._id} className="flex flex-col items-center gap-1">
                      <AchievementBadge
                        achievement={achievement}
                        unlocked={true}
                        unlockedAt={achievement.unlockedAt}
                        size="lg"
                      />
                      <span className="text-[10px] text-gray-600 dark:text-gray-300 text-center leading-tight">
                        {achievement.title}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </motion.div>
      )}

      {/* Locked Achievements */}
      {filteredLocked.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-5 md:p-8"
        >
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
            <Lock className="w-5 h-5 text-gray-400" />
            Locked ({filteredLocked.length})
          </h2>

          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
            {filteredLocked.map((achievement) => (
              <div key={achievement._id} className="flex flex-col items-center gap-1">
                <AchievementBadge
                  achievement={achievement}
                  unlocked={false}
                  size="lg"
                />
                <span className="text-[10px] text-gray-400 dark:text-gray-500 text-center leading-tight">
                  ???
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {filteredUnlocked.length === 0 && filteredLocked.length === 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-12 text-center">
          <Trophy className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">No achievements in this category yet.</p>
        </div>
      )}
    </div>
  );
};

export default AchievementsPage;