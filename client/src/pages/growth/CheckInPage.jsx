import React, { useState, useEffect } from 'react';
import { growthService } from '../../services/growthService';
import { achievementService } from '../../services/achievementService';
import { 
  CheckCircle, 
  Flame, 
  Zap, 
  Smile, 
  Meh, 
  Frown,
  Star,
  Calendar
} from 'lucide-react';
import Spinner from '../../components/ui/Spinner';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';

const CheckInPage = () => {
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [hasCheckedIn, setHasCheckedIn] = useState(false);
  const [todayEntry, setTodayEntry] = useState(null);
  const [streaks, setStreaks] = useState({ currentStreak: 0, longestStreak: 0 });
  const [note, setNote] = useState('');
  const [mood, setMood] = useState('');

  useEffect(() => {
    fetchTodayStatus();
  }, []);

  const fetchTodayStatus = async () => {
    try {
      const response = await growthService.getTodayStatus();
      const data = response.data.data;
      setHasCheckedIn(data.hasCheckedIn);
      setTodayEntry(data.entry);
      setStreaks(data.streaks);
    } catch (error) {
      toast.error('Failed to load status');
    } finally {
      setLoading(false);
    }
  };

  const handleCheckIn = async () => {
    setSubmitting(true);
    try {
      const response = await growthService.checkIn({ note, mood });
      const data = response.data.data;
      setHasCheckedIn(true);
      setTodayEntry(data.entry);
      setStreaks(data.streaks);
      setNote('');
      setMood('');
      
      // Celebrate!
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#7dd3fc', '#34d399', '#fbbf24', '#f472b6'],
      });
      
      // Check for new achievements
      if (data.newlyUnlocked && data.newlyUnlocked.length > 0) {
        // Bigger confetti for achievements
        setTimeout(() => {
          confetti({
            particleCount: 200,
            spread: 100,
            origin: { y: 0.6 },
            colors: ['#fbbf24', '#a78bfa', '#34d399', '#7dd3fc', '#f472b6'],
          });
        }, 500);
        
        const achievementNames = data.newlyUnlocked.map(a => a.title).join(', ');
        toast.success(`🎉 Achievements unlocked: ${achievementNames}!`, { duration: 5000 });
      } else {
        toast.success('Check-in recorded! 🔥');
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Check-in failed';
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  const moods = [
    { value: 'great', icon: Star, label: 'Great', color: 'text-yellow-500', bg: 'bg-yellow-50 dark:bg-yellow-900/20' },
    { value: 'good', icon: Smile, label: 'Good', color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-900/20' },
    { value: 'okay', icon: Meh, label: 'Okay', color: 'text-sky-500', bg: 'bg-sky-50 dark:bg-sky-900/20' },
    { value: 'struggling', icon: Frown, label: 'Struggling', color: 'text-orange-500', bg: 'bg-orange-50 dark:bg-orange-900/20' },
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Streak Display */}
      <div className="grid grid-cols-2 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-6 text-center"
        >
          <Flame className="w-8 h-8 text-orange-500 mx-auto mb-2" />
          <div className="text-3xl font-bold text-gray-900 dark:text-white">{streaks.currentStreak}</div>
          <div className="text-sm text-gray-500 dark:text-gray-400">Current Streak</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-6 text-center"
        >
          <Zap className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
          <div className="text-3xl font-bold text-gray-900 dark:text-white">{streaks.longestStreak}</div>
          <div className="text-sm text-gray-500 dark:text-gray-400">Longest Streak</div>
        </motion.div>
      </div>

      {/* Check-in Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-6 md:p-8"
      >
        <div className="flex items-center gap-3 mb-6">
          <Calendar className="w-6 h-6 text-sky-500 dark:text-sky-400" />
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            {hasCheckedIn ? "Today's Check-in ✅" : 'Daily Check-in'}
          </h2>
        </div>

        {hasCheckedIn ? (
          <div className="text-center py-8">
            <div className="w-20 h-20 bg-emerald-50 dark:bg-emerald-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-10 h-10 text-emerald-500" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">You're done for today!</h3>
            <p className="text-gray-500 dark:text-gray-400">Come back tomorrow to keep your streak alive.</p>
            {todayEntry?.note && (
              <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl max-w-md mx-auto">
                <p className="text-sm text-gray-600 dark:text-gray-300 italic">"{todayEntry.note}"</p>
              </div>
            )}
            {todayEntry?.mood && (
              <div className="mt-3">
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Mood: {todayEntry.mood}
                </span>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-5">
            {/* Mood Selector */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                How are you feeling today?
              </label>
              <div className="grid grid-cols-4 gap-2">
                {moods.map((m) => (
                  <button
                    key={m.value}
                    type="button"
                    onClick={() => setMood(mood === m.value ? '' : m.value)}
                    className={`p-3 rounded-xl border-2 transition-all duration-200 flex flex-col items-center gap-1 ${
                      mood === m.value
                        ? 'border-sky-400 bg-sky-50 dark:bg-sky-900/20'
                        : 'border-gray-100 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                    }`}
                  >
                    <m.icon className={`w-6 h-6 ${m.color}`} />
                    <span className="text-xs text-gray-600 dark:text-gray-300">{m.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Note */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Today's Note (optional)
              </label>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="What did you work on today? What progress did you make?"
                rows={4}
                maxLength={500}
                className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-sky-400 dark:focus:border-sky-500 focus:ring-2 focus:ring-sky-100 dark:focus:ring-sky-900/30 transition-all text-sm resize-none"
              />
              <p className="text-xs text-gray-400 mt-1">{note.length}/500</p>
            </div>

            {/* Submit */}
            <button
              onClick={handleCheckIn}
              disabled={submitting}
              className="w-full py-4 bg-gradient-to-r from-sky-400 to-emerald-400 hover:from-sky-500 hover:to-emerald-500 text-white font-semibold rounded-xl transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 shadow-lg shadow-sky-200 dark:shadow-sky-900/30"
            >
              {submitting ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <CheckCircle className="w-5 h-5" />
                  Complete Check-in
                </>
              )}
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default CheckInPage;