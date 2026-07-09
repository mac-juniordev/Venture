import React, { useState, useEffect } from 'react';
import { leaderboardService } from '../../services/leaderboardService';
import { useAuth } from '../../context/AuthContext';
import { 
  Trophy, 
  Medal, 
  Flame, 
  Zap, 
  TrendingUp,
  Crown,
  Star,
  ChevronUp
} from 'lucide-react';
import Spinner from '../../components/ui/Spinner';
import Avatar from '../../components/ui/Avatar';
import { motion } from 'framer-motion';

const LeaderboardPage = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [leaderboard, setLeaderboard] = useState([]);
  const [userRank, setUserRank] = useState(null);
  const [activeTab, setActiveTab] = useState('streak');

  useEffect(() => {
    fetchLeaderboard();
  }, [activeTab]);

  const fetchLeaderboard = async () => {
    try {
      setLoading(true);
      const type = activeTab === 'streak' ? 'streak' : 'checkins';
      const response = await leaderboardService.getGlobalLeaderboard(type);
      setLeaderboard(response.data.data.leaderboard);
      setUserRank(response.data.data.userRank);
    } catch (error) {
      console.error('Failed to load leaderboard');
    } finally {
      setLoading(false);
    }
  };

  const getRankIcon = (rank) => {
    switch (rank) {
      case 1: return <Crown className="w-5 h-5 text-yellow-500" />;
      case 2: return <Medal className="w-5 h-5 text-gray-400" />;
      case 3: return <Medal className="w-5 h-5 text-orange-400" />;
      default: return <span className="text-sm font-bold text-gray-400">{rank}</span>;
    }
  };

  const getRankBg = (rank) => {
    switch (rank) {
      case 1: return 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800';
      case 2: return 'bg-gray-50 dark:bg-gray-700/30 border-gray-200 dark:border-gray-600';
      case 3: return 'bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800';
      default: return '';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-4 md:space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">Leaderboard</h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Healthy competition. Builders ranked by consistency.</p>
      </motion.div>

      {/* User's Rank Card */}
      {userRank && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-r from-sky-400 to-emerald-400 rounded-2xl shadow-lg p-5 md:p-6 text-white"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/80 text-sm font-medium">Your Rank</p>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl md:text-5xl font-bold">#{userRank.rank}</span>
                <span className="text-white/70 text-sm">of {userRank.totalParticipants}</span>
              </div>
              <p className="text-white/80 text-sm mt-1">
                Top {userRank.percentile}% of all builders
              </p>
            </div>
            <div className="w-14 h-14 md:w-16 md:h-16 bg-white/20 rounded-2xl flex items-center justify-center">
              <Trophy className="w-8 h-8 md:w-9 md:h-9" />
            </div>
          </div>
        </motion.div>
      )}

      {/* Tabs */}
      <div className="flex bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-1">
        <button
          onClick={() => setActiveTab('streak')}
          className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-all flex items-center justify-center gap-2 ${
            activeTab === 'streak'
              ? 'bg-sky-50 dark:bg-sky-900/30 text-sky-600 dark:text-sky-400 shadow-sm'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
          }`}
        >
          <Flame className="w-4 h-4" />
          By Streak
        </button>
        <button
          onClick={() => setActiveTab('checkins')}
          className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-all flex items-center justify-center gap-2 ${
            activeTab === 'checkins'
              ? 'bg-sky-50 dark:bg-sky-900/30 text-sky-600 dark:text-sky-400 shadow-sm'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
          }`}
        >
          <Zap className="w-4 h-4" />
          By Check-ins
        </button>
      </div>

      {/* Leaderboard List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden"
      >
        {/* Top 3 Podium */}
        {leaderboard.length >= 3 && (
          <div className="p-6 md:p-8 bg-gradient-to-b from-gray-50 to-white dark:from-gray-700/30 dark:to-gray-800 border-b border-gray-100 dark:border-gray-700">
            <div className="flex items-end justify-center gap-3 md:gap-6">
              {/* 2nd Place */}
              <div className="text-center">
                <Avatar size="lg" alt={leaderboard[1]?.user?.displayName || leaderboard[1]?.user?.email} />
                <div className="mt-2 px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-lg">
                  <Medal className="w-5 h-5 text-gray-400 mx-auto" />
                  <p className="text-xs font-bold text-gray-600 dark:text-gray-300 mt-0.5">2nd</p>
                </div>
                <p className="text-xs font-medium text-gray-900 dark:text-white mt-1 truncate max-w-[80px]">
                  {leaderboard[1]?.user?.displayName || leaderboard[1]?.user?.email?.split('@')[0]}
                </p>
              </div>

              {/* 1st Place */}
              <div className="text-center -mt-4">
                <Avatar size="xl" alt={leaderboard[0]?.user?.displayName || leaderboard[0]?.user?.email} />
                <div className="mt-2 px-4 py-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-xl">
                  <Crown className="w-6 h-6 text-yellow-500 mx-auto" />
                  <p className="text-sm font-bold text-yellow-700 dark:text-yellow-400 mt-0.5">1st</p>
                </div>
                <p className="text-sm font-bold text-gray-900 dark:text-white mt-1 truncate max-w-[100px]">
                  {leaderboard[0]?.user?.displayName || leaderboard[0]?.user?.email?.split('@')[0]}
                </p>
              </div>

              {/* 3rd Place */}
              <div className="text-center">
                <Avatar size="lg" alt={leaderboard[2]?.user?.displayName || leaderboard[2]?.user?.email} />
                <div className="mt-2 px-3 py-1 bg-orange-100 dark:bg-orange-900/20 rounded-lg">
                  <Medal className="w-5 h-5 text-orange-400 mx-auto" />
                  <p className="text-xs font-bold text-orange-600 dark:text-orange-300 mt-0.5">3rd</p>
                </div>
                <p className="text-xs font-medium text-gray-900 dark:text-white mt-1 truncate max-w-[80px]">
                  {leaderboard[2]?.user?.displayName || leaderboard[2]?.user?.email?.split('@')[0]}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Full List */}
        <div className="divide-y divide-gray-100 dark:divide-gray-700">
          {leaderboard.map((entry, index) => {
            const isCurrentUser = entry.user?._id === user?._id;
            
            return (
              <div
                key={index}
                className={`flex items-center gap-4 p-4 md:p-5 transition-colors ${
                  isCurrentUser
                    ? 'bg-sky-50 dark:bg-sky-900/10 border-l-4 border-sky-400'
                    : 'hover:bg-gray-50 dark:hover:bg-gray-700/30'
                } ${getRankBg(entry.rank)}`}
              >
                {/* Rank */}
                <div className="w-10 flex-shrink-0 flex justify-center">
                  {getRankIcon(entry.rank)}
                </div>

                {/* Avatar */}
                <Avatar
                  size="md"
                  src={entry.user?.avatar ? `http://localhost:5000${entry.user.avatar}` : null}
                  alt={entry.user?.displayName || entry.user?.email}
                />

                {/* User Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-gray-900 dark:text-white truncate">
                    {entry.user?.displayName || entry.user?.email?.split('@')[0]}
                    {isCurrentUser && (
                      <span className="ml-2 text-xs text-sky-500 dark:text-sky-400 font-medium">(You)</span>
                    )}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {entry.user?.username ? `@${entry.user.username}` : entry.user?.email}
                  </p>
                </div>

                {/* Stats */}
                <div className="flex items-center gap-4 md:gap-6 flex-shrink-0">
                  <div className="text-center">
                    <div className="flex items-center gap-1 text-orange-500">
                      <Flame className="w-4 h-4" />
                      <span className="text-sm font-bold">{entry.longestStreak || 0}</span>
                    </div>
                    <p className="text-[10px] text-gray-400">streak</p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center gap-1 text-sky-500">
                      <Zap className="w-4 h-4" />
                      <span className="text-sm font-bold">{entry.totalCheckIns || 0}</span>
                    </div>
                    <p className="text-[10px] text-gray-400">checks</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {leaderboard.length === 0 && (
          <div className="p-12 text-center">
            <Trophy className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
            <p className="text-gray-500 dark:text-gray-400">No data yet. Start building to appear here!</p>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default LeaderboardPage;