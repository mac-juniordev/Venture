import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { challengeService } from '../../services/challengeService';
import { Trophy, Users, Clock, Plus, Swords } from 'lucide-react';
import Spinner from '../../components/ui/Spinner';
import { motion } from 'framer-motion';

const MyChallengesPage = () => {
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyChallenges();
  }, []);

  const fetchMyChallenges = async () => {
    try {
      const response = await challengeService.getMyChallenges();
      setChallenges(response.data.data.challenges);
    } catch (error) {
      console.error('Failed to load challenges');
    } finally {
      setLoading(false);
    }
  };

  const getDifficultyColor = (d) => {
    const colors = {
      easy: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400',
      medium: 'bg-sky-100 dark:bg-sky-900/30 text-sky-700 dark:text-sky-400',
      hard: 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400',
      legendary: 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400',
    };
    return colors[d] || colors.medium;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]"><Spinner size="lg" /></div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">My Challenges</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Your active battles</p>
        </div>
        <Link to="/challenges/create" className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-sky-400 to-emerald-400 text-white font-semibold rounded-xl text-sm">
          <Plus className="w-4 h-4" /> New
        </Link>
      </div>

      {challenges.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-12 text-center">
          <Swords className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">No Challenges Yet</h3>
          <p className="text-gray-500 dark:text-gray-400 mb-6">Join or create your first challenge!</p>
          <Link to="/challenges" className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-sky-400 to-emerald-400 text-white font-semibold rounded-xl">
            Browse Challenges
          </Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {challenges.map((challenge, index) => (
            <motion.div key={challenge._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }}>
              <Link to={`/challenges/${challenge._id}`} className="block bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-5 hover:shadow-md transition-all h-full">
                <div className="flex items-start justify-between mb-3">
                  <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${getDifficultyColor(challenge.difficulty)}`}>
                    {challenge.difficulty.toUpperCase()}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 line-clamp-2">{challenge.title}</h3>
                <div className="flex items-center gap-4 text-xs text-gray-500">
                  <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" /> {challenge.participantCount || 0}</span>
                  <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {new Date(challenge.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyChallengesPage;