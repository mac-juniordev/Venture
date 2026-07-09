import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { challengeService } from '../../services/challengeService';
import { 
  Trophy, 
  Target, 
  Zap, 
  Flame, 
  Swords, 
  Gift, 
  AlertTriangle, 
  Star,
  ArrowLeft,
  Sparkles,
  Crown,
  Skull,
  Gem
} from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import confetti from 'canvas-confetti';

const CreateChallengePage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'coding',
    rules: '',
    reward: '',
    penalty: '',
    bonus: '',
    difficulty: 'medium',
    maxParticipants: 50,
    startDate: '',
    endDate: '',
    tags: '',
  });

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        ...formData,
        tags: formData.tags ? formData.tags.split(',').map(t => t.trim()) : [],
        maxParticipants: parseInt(formData.maxParticipants),
      };

      await challengeService.createChallenge(payload);
      
      confetti({
        particleCount: 150,
        spread: 100,
        origin: { y: 0.6 },
        colors: ['#7dd3fc', '#34d399', '#fbbf24', '#a78bfa', '#f472b6'],
      });

      toast.success('Challenge created! Let the games begin! ⚔️');
      navigate('/challenges');
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to create challenge';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    { value: 'coding', label: 'Coding', icon: Zap, desc: 'Build something with code' },
    { value: 'design', label: 'Design', icon: Target, desc: 'Create stunning designs' },
    { value: 'reading', label: 'Reading', icon: Flame, desc: 'Expand your knowledge' },
    { value: 'fitness', label: 'Fitness', icon: Swords, desc: 'Push your physical limits' },
    { value: 'business', label: 'Business', icon: Crown, desc: 'Build and grow' },
    { value: 'writing', label: 'Writing', icon: Sparkles, desc: 'Express through words' },
  ];

  const difficulties = [
    { value: 'easy', label: 'Easy', icon: Star, color: 'from-emerald-400 to-emerald-500' },
    { value: 'medium', label: 'Medium', icon: Flame, color: 'from-sky-400 to-sky-500' },
    { value: 'hard', label: 'Hard', icon: Skull, color: 'from-orange-400 to-orange-500' },
    { value: 'legendary', label: 'Legendary', icon: Crown, color: 'from-purple-400 to-purple-500' },
  ];

  const inputClass = "w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-sky-400 dark:focus:border-sky-500 focus:ring-2 focus:ring-sky-100 dark:focus:ring-sky-900/30 transition-all text-sm";
  const labelClass = "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2";

  return (
    <div className="max-w-3xl mx-auto">
      {/* Back Button */}
      <button
        onClick={() => navigate('/challenges')}
        className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-sky-500 dark:hover:text-sky-400 font-medium mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Challenges
      </button>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden"
      >
        {/* Header */}
        <div className="p-6 md:p-8 border-b border-gray-100 dark:border-gray-700 bg-gradient-to-r from-sky-50 to-emerald-50 dark:from-sky-900/10 dark:to-emerald-900/10">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-gradient-to-br from-sky-400 to-emerald-400 rounded-xl flex items-center justify-center">
              <Swords className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Create Challenge</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">Forge a challenge and inspire others to grow</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6">
          {/* Category */}
          <div>
            <label className={labelClass}>Category</label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {categories.map((cat) => (
                <button
                  key={cat.value}
                  type="button"
                  onClick={() => handleChange('category', cat.value)}
                  className={`p-3 rounded-xl border-2 transition-all duration-200 flex flex-col items-center gap-1 ${
                    formData.category === cat.value
                      ? 'border-sky-400 bg-sky-50 dark:bg-sky-900/20'
                      : 'border-gray-100 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                  }`}
                >
                  <cat.icon className={`w-5 h-5 ${formData.category === cat.value ? 'text-sky-500' : 'text-gray-400'}`} />
                  <span className="text-xs font-medium text-gray-700 dark:text-gray-300">{cat.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Title */}
          <div>
            <label className={labelClass}>Challenge Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              placeholder="e.g., 30-Day React Native Challenge"
              className={inputClass}
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className={labelClass}>Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="What is this challenge about? Get people excited!"
              rows={3}
              className={`${inputClass} resize-none`}
              required
            />
          </div>

          {/* Difficulty */}
          <div>
            <label className={labelClass}>Difficulty</label>
            <div className="grid grid-cols-4 gap-2">
              {difficulties.map((diff) => (
                <button
                  key={diff.value}
                  type="button"
                  onClick={() => handleChange('difficulty', diff.value)}
                  className={`p-3 rounded-xl border-2 transition-all duration-200 flex flex-col items-center gap-1 ${
                    formData.difficulty === diff.value
                      ? `border-current bg-gradient-to-r ${diff.color} text-white`
                      : 'border-gray-100 dark:border-gray-600 hover:border-gray-300'
                  }`}
                >
                  <diff.icon className="w-5 h-5" />
                  <span className="text-xs font-bold">{diff.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Rules */}
          <div>
            <label className={labelClass}>
              <Target className="w-4 h-4 inline mr-1" />
              Rules
            </label>
            <textarea
              value={formData.rules}
              onChange={(e) => handleChange('rules', e.target.value)}
              placeholder="What must participants do daily/weekly?"
              rows={4}
              className={`${inputClass} resize-none`}
              required
            />
          </div>

          {/* Reward / Glory */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>
                <Trophy className="w-4 h-4 inline mr-1 text-yellow-500" />
                Reward / Glory
              </label>
              <input
                type="text"
                value={formData.reward}
                onChange={(e) => handleChange('reward', e.target.value)}
                placeholder="e.g., $50 Prize, Recognition"
                className={inputClass}
                required
              />
            </div>
            <div>
              <label className={labelClass}>
                <AlertTriangle className="w-4 h-4 inline mr-1 text-red-500" />
                Penalty
              </label>
              <input
                type="text"
                value={formData.penalty}
                onChange={(e) => handleChange('penalty', e.target.value)}
                placeholder="e.g., Lose 1 streak day"
                className={inputClass}
              />
            </div>
          </div>

          {/* Bonus */}
          <div>
            <label className={labelClass}>
              <Gem className="w-4 h-4 inline mr-1 text-purple-500" />
              Bonus (optional)
            </label>
            <input
              type="text"
              value={formData.bonus}
              onChange={(e) => handleChange('bonus', e.target.value)}
              placeholder="e.g., Extra points for completing before deadline"
              className={inputClass}
            />
          </div>

          {/* Dates & Max Participants */}
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className={labelClass}>Start Date</label>
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) => handleChange('startDate', e.target.value)}
                className={inputClass}
                required
              />
            </div>
            <div>
              <label className={labelClass}>End Date</label>
              <input
                type="date"
                value={formData.endDate}
                onChange={(e) => handleChange('endDate', e.target.value)}
                className={inputClass}
                required
              />
            </div>
            <div>
              <label className={labelClass}>Max Participants</label>
              <input
                type="number"
                value={formData.maxParticipants}
                onChange={(e) => handleChange('maxParticipants', e.target.value)}
                min={2}
                max={500}
                className={inputClass}
              />
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className={labelClass}>Tags (comma separated)</label>
            <input
              type="text"
              value={formData.tags}
              onChange={(e) => handleChange('tags', e.target.value)}
              placeholder="e.g., react, javascript, frontend"
              className={inputClass}
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-gradient-to-r from-sky-400 to-emerald-400 hover:from-sky-500 hover:to-emerald-500 text-white font-bold text-lg rounded-xl transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 shadow-xl shadow-sky-200 dark:shadow-sky-900/30"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <Swords className="w-5 h-5" />
                Forge Challenge
              </>
            )}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default CreateChallengePage;