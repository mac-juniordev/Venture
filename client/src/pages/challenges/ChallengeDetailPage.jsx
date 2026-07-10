import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { challengeService } from '../../services/challengeService';
import { useAuth } from '../../context/AuthContext';
import {
  Trophy, Users, Clock, Zap, Target, Swords, Crown,
  ArrowLeft, Gift, AlertTriangle, Star, Flame, CheckCircle,
  Gem, Skull, Calendar
} from 'lucide-react';
import Spinner from '../../components/ui/Spinner';
import Avatar from '../../components/ui/Avatar';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import confetti from 'canvas-confetti';

const ChallengeDetailPage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [challenge, setChallenge] = useState(null);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);

  const fetchChallenge = async () => {
    try {
      const response = await challengeService.getChallenge(id);
      setChallenge(response.data.data.challenge);
    } catch (error) {
      toast.error('Challenge not found');
      navigate('/challenges');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChallenge();
  }, [id]);

  const handleJoin = async () => {
    setJoining(true);
    try {
      const response = await challengeService.joinChallenge(id);
      setChallenge(response.data.data.challenge);
      
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#7dd3fc', '#34d399', '#fbbf24'],
      });
      
      toast.success('You\'re in! ⚔️');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to join');
    } finally {
      setJoining(false);
    }
  };

  const isParticipant = challenge?.participants?.some(
    p => p.user?._id === user?._id
  );

  const isCreator = challenge?.createdBy?._id === user?._id;

  const getDifficultyColor = (d) => {
    const colors = {
      easy: 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800',
      medium: 'bg-sky-50 dark:bg-sky-900/20 text-sky-700 dark:text-sky-400 border-sky-200 dark:border-sky-800',
      hard: 'bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-400 border-orange-200 dark:border-orange-800',
      legendary: 'bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400 border-purple-200 dark:border-purple-800',
    };
    return colors[d] || colors.medium;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!challenge) return null;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Link to="/challenges" className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-sky-500 dark:hover:text-sky-400 font-medium transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Challenges
      </Link>

      {/* Hero Card */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden"
      >
        <div className="h-2 bg-gradient-to-r from-sky-400 via-emerald-400 to-purple-400" />
        <div className="p-6 md:p-8">
          <div className="flex flex-wrap gap-2 mb-4">
            <span className={`px-3 py-1 rounded-lg text-xs font-bold border ${getDifficultyColor(challenge.difficulty)}`}>
              {challenge.difficulty.toUpperCase()}
            </span>
            <span className="px-3 py-1 bg-sky-50 dark:bg-sky-900/20 text-sky-700 dark:text-sky-400 rounded-lg text-xs font-medium">
              {challenge.category}
            </span>
          </div>

          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-3">{challenge.title}</h1>
          <p className="text-gray-500 dark:text-gray-400 mb-6">{challenge.description}</p>

          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-6">
            <span className="flex items-center gap-1"><Users className="w-4 h-4" /> {challenge.participantCount}/{challenge.maxParticipants} participants</span>
            <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> {new Date(challenge.startDate).toLocaleDateString()} - {new Date(challenge.endDate).toLocaleDateString()}</span>
          </div>

          <div className="flex items-center gap-3 mb-6">
            <Avatar size="sm" alt={challenge.createdBy?.email} />
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">Instigator</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{challenge.createdBy?.email}</p>
            </div>
          </div>

          {!isParticipant && !isCreator && challenge.status !== 'completed' && (
            <button
              onClick={handleJoin}
              disabled={joining}
              className="w-full py-3.5 bg-gradient-to-r from-sky-400 to-emerald-400 hover:from-sky-500 hover:to-emerald-500 text-white font-bold rounded-xl transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 shadow-lg"
            >
              {joining ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Swords className="w-5 h-5" />}
              Join Challenge
            </button>
          )}

          {isParticipant && (
            <div className="w-full py-3.5 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 font-bold rounded-xl flex items-center justify-center gap-2">
              <CheckCircle className="w-5 h-5" /> You're in this challenge!
            </div>
          )}
        </div>
      </motion.div>

      {/* Details Grid */}
      <div className="grid md:grid-cols-2 gap-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-6"
        >
          <h3 className="font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2"><Target className="w-5 h-5 text-sky-500" /> Rules</h3>
          <p className="text-sm text-gray-600 dark:text-gray-300 whitespace-pre-wrap">{challenge.rules}</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
          className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-6"
        >
          <h3 className="font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2"><Trophy className="w-5 h-5 text-yellow-500" /> Reward & Glory</h3>
          <p className="text-sm text-gray-600 dark:text-gray-300">{challenge.reward}</p>
          {challenge.penalty && (
            <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1 flex items-center gap-1"><AlertTriangle className="w-3 h-3 text-red-500" /> Penalty</p>
              <p className="text-sm text-red-600 dark:text-red-400">{challenge.penalty}</p>
            </div>
          )}
          {challenge.bonus && (
            <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1 flex items-center gap-1"><Gem className="w-3 h-3 text-purple-500" /> Bonus</p>
              <p className="text-sm text-purple-600 dark:text-purple-400">{challenge.bonus}</p>
            </div>
          )}
        </motion.div>
      </div>

      {/* Participants */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
        className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-6"
      >
        <h3 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2"><Crown className="w-5 h-5 text-yellow-500" /> Warriors ({challenge.participantCount})</h3>
        {challenge.participants.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400 text-sm">No warriors yet. Be the first!</p>
        ) : (
          <div className="space-y-3">
            {challenge.participants.map((p, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/30 rounded-xl">
                <div className="flex items-center gap-3">
                  <Avatar size="sm" alt={p.user?.email} />
                  <span className="text-sm font-medium text-gray-900 dark:text-white">{p.user?.email?.split('@')[0]}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-24 h-2 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-sky-400 to-emerald-400 rounded-full" style={{ width: `${p.progress}%` }} />
                  </div>
                  <span className="text-xs text-gray-500 dark:text-gray-400">{p.progress}%</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default ChallengeDetailPage;