import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { challengeService } from '../../services/challengeService';
import { 
  Trophy, Users, Clock, Zap, Flame, Target, Swords, Search, Plus
} from 'lucide-react';
import Spinner from '../../components/ui/Spinner';
import { motion } from 'framer-motion';

const ChallengesPage = () => {
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [category, setCategory] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchChallenges();
  }, [filter, category]);

  const fetchChallenges = async () => {
    try {
      setLoading(true);
      const params = {};
      if (filter !== 'all') params.status = filter;
      if (category) params.category = category;
      const response = await challengeService.getChallenges(params);
      setChallenges(response.data.data.challenges);
    } catch (error) {
      console.error('Failed to load challenges');
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    { value: '', label: 'All', icon: Target },
    { value: 'coding', label: 'Coding', icon: Zap },
    { value: 'design', label: 'Design', icon: Target },
    { value: 'reading', label: 'Reading', icon: Flame },
    { value: 'fitness', label: 'Fitness', icon: Swords },
    { value: 'business', label: 'Business', icon: Trophy },
    { value: 'writing', label: 'Writing', icon: Target },
  ];

  const filters = [
    { value: 'all', label: 'All' },
    { value: 'active', label: 'Active' },
    { value: 'upcoming', label: 'Upcoming' },
    { value: 'completed', label: 'Completed' },
  ];

  const getDifficultyColor = (difficulty) => {
    const colors = {
      easy: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400',
      medium: 'bg-sky-100 dark:bg-sky-900/30 text-sky-700 dark:text-sky-400',
      hard: 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400',
      legendary: 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400',
    };
    return colors[difficulty] || colors.medium;
  };

  const getStatusBadge = (status) => {
    const badges = {
      active: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400',
      upcoming: 'bg-sky-100 dark:bg-sky-900/30 text-sky-700 dark:text-sky-400',
      completed: 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400',
      cancelled: 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400',
    };
    return badges[status] || badges.upcoming;
  };

  const filteredChallenges = challenges.filter(challenge => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      challenge.title.toLowerCase().includes(term) ||
      challenge.description.toLowerCase().includes(term) ||
      challenge.category.toLowerCase().includes(term)
    );
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-4 md:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">Challenges</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
            Compete, grow, and claim your glory. 7 days max.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/my-challenges" className="inline-flex items-center gap-2 px-5 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 font-medium rounded-xl transition-all text-sm shadow-sm">
            <Swords className="w-4 h-4" /> My Challenges
          </Link>
          <Link to="/challenges/create" className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-sky-400 to-emerald-400 hover:from-sky-500 hover:to-emerald-500 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg shadow-sky-200 dark:shadow-sky-900/30 text-sm">
            <Plus className="w-4 h-4" /> Create Challenge
          </Link>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search challenges..." className="w-full pl-11 pr-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-xl text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-sky-400 dark:focus:border-sky-500 focus:ring-2 focus:ring-sky-100 dark:focus:ring-sky-900/30 transition-all" />
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-1">
            {filters.map((f) => (
              <button key={f.value} onClick={() => setFilter(f.value)}
                className={`px-3 md:px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                  filter === f.value ? 'bg-sky-50 dark:bg-sky-900/30 text-sky-600 dark:text-sky-400 shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >{f.label}</button>
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button key={cat.value} onClick={() => setCategory(cat.value)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all flex items-center gap-1.5 ${
                  category === cat.value ? 'bg-sky-50 dark:bg-sky-900/30 text-sky-600 dark:text-sky-400' : 'bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
              ><cat.icon className="w-3 h-3" />{cat.label}</button>
            ))}
          </div>
        </div>
      </div>

      {/* Challenge Grid */}
      {filteredChallenges.length === 0 ? (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-8 md:p-12 text-center"
        >
          <div className="w-16 h-16 md:w-20 md:h-20 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <Trophy className="w-8 h-8 md:w-10 md:h-10 text-gray-400 dark:text-gray-500" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">No Challenges Found</h3>
          <p className="text-gray-500 dark:text-gray-400 text-sm mb-6 max-w-md mx-auto">
            {searchTerm ? 'No challenges match your search.' : 'Be the first to create one!'}
          </p>
          <Link to="/challenges/create" className="px-6 py-2.5 bg-gradient-to-r from-sky-400 to-emerald-400 text-white font-semibold rounded-xl inline-flex items-center gap-2 shadow-lg">
            <Plus className="w-4 h-4" /> Create Challenge
          </Link>
        </motion.div>
      ) : (
        <>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredChallenges.map((challenge, index) => (
              <motion.div key={challenge._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }}>
                <Link to={`/challenges/${challenge._id}`}
                  className="block bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-5 hover:shadow-md hover:border-sky-200 dark:hover:border-sky-700 transition-all duration-200 h-full group"
                >
                  <div className="flex items-start justify-between mb-3">
                    <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${getDifficultyColor(challenge.difficulty)}`}>{challenge.difficulty.toUpperCase()}</span>
                    <span className={`px-2.5 py-1 rounded-lg text-xs font-medium ${getStatusBadge(challenge.status)}`}>{challenge.status}</span>
                  </div>
                  <div className="flex items-center gap-1.5 mb-2">
                    <span className="text-xs text-sky-500 dark:text-sky-400 font-medium capitalize">{challenge.category}</span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 line-clamp-2 group-hover:text-sky-500 dark:group-hover:text-sky-400 transition-colors">{challenge.title}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 line-clamp-2">{challenge.description}</p>
                  <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 pt-3 border-t border-gray-100 dark:border-gray-700">
                    <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" />{challenge.participantCount || 0}/{challenge.maxParticipants}</span>
                    <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{challenge.status === 'upcoming' ? 'Starts' : 'Ends'} {challenge.status === 'upcoming' ? new Date(challenge.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : new Date(challenge.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
          <p className="text-center text-xs text-gray-400 dark:text-gray-500">Showing {filteredChallenges.length} challenge{filteredChallenges.length !== 1 ? 's' : ''}</p>
        </>
      )}
    </div>
  );
};

export default ChallengesPage;