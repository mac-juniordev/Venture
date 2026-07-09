import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { userService } from '../../services/userService';
import { 
  MapPin, 
  Globe, 
  Code, 
  AtSign, 
  Award,
  Zap,
  Calendar,
  Flame,
  ArrowLeft
} from 'lucide-react';
import Avatar from '../../components/ui/Avatar';
import Spinner from '../../components/ui/Spinner';
import { motion } from 'framer-motion';

const PublicProfilePage = () => {
  const { username } = useParams();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPublicProfile();
  }, [username]);

  const fetchPublicProfile = async () => {
    try {
      setLoading(true);
      const response = await userService.getPublicProfile(username);
      setProfile(response.data.data.profile);
    } catch (error) {
      setError('Profile not found');
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

  if (error || !profile) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-12 text-center">
          <div className="w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-6">
            <Award className="w-10 h-10 text-gray-400 dark:text-gray-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Profile Not Found</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-6">This user doesn't exist or hasn't set up their profile yet.</p>
          <Link 
            to="/dashboard" 
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-sky-400 to-emerald-400 text-white font-semibold rounded-xl"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Back Button */}
      <Link 
        to="/community" 
        className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-sky-500 dark:hover:text-sky-400 font-medium mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Community
      </Link>

      {/* Profile Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden"
      >
        {/* Cover */}
        <div className="h-32 bg-gradient-to-r from-sky-400 via-sky-500 to-emerald-400" />
        
        {/* Profile Info */}
        <div className="px-8 pb-8">
          <div className="flex flex-col sm:flex-row items-start gap-6 -mt-12">
            <Avatar 
              size="xl" 
              src={profile?.avatar ? `http://localhost:5000${profile.avatar}` : null}
              alt={profile?.displayName || profile?.username || 'User'} 
            />
            
            <div className="flex-1 pt-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {profile?.displayName || profile?.username || 'Anonymous Builder'}
                </h1>
                {profile?.username && (
                  <p className="text-gray-500 dark:text-gray-400 text-lg">@{profile.username}</p>
                )}
              </div>

              {profile?.bio && (
                <p className="text-gray-600 dark:text-gray-300 mt-4 leading-relaxed">{profile.bio}</p>
              )}

              {/* Social Links */}
              {(profile?.location || profile?.website || profile?.github || profile?.twitter) && (
                <div className="flex flex-wrap items-center gap-4 mt-4">
                  {profile?.location && (
                    <span className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
                      <MapPin className="w-4 h-4" />
                      {profile.location}
                    </span>
                  )}
                  {profile?.website && (
                    <a 
                      href={profile.website.startsWith('http') ? profile.website : `https://${profile.website}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-sm text-sky-500 dark:text-sky-400 hover:text-sky-600 dark:hover:text-sky-300 transition-colors"
                    >
                      <Globe className="w-4 h-4" />
                      Website
                    </a>
                  )}
                  {profile?.github && (
                    <a 
                      href={`https://github.com/${profile.github}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
                    >
                      <Code className="w-4 h-4" />
                      @{profile.github}
                    </a>
                  )}
                  {profile?.twitter && (
                    <a 
                      href={`https://twitter.com/${profile.twitter}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
                    >
                      <AtSign className="w-4 h-4" />
                      @{profile.twitter}
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
            <div className="bg-sky-50 dark:bg-sky-900/20 rounded-xl p-4 text-center">
              <Flame className="w-5 h-5 text-sky-500 dark:text-sky-400 mx-auto mb-1" />
              <div className="text-2xl font-bold text-gray-900 dark:text-white">{profile?.longestStreak || 0}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Longest Streak</div>
            </div>
            <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-xl p-4 text-center">
              <Zap className="w-5 h-5 text-emerald-500 dark:text-emerald-400 mx-auto mb-1" />
              <div className="text-2xl font-bold text-gray-900 dark:text-white">{profile?.totalCheckIns || 0}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Check-ins</div>
            </div>
            <div className="bg-sky-50 dark:bg-sky-900/20 rounded-xl p-4 text-center">
              <Award className="w-5 h-5 text-sky-500 dark:text-sky-400 mx-auto mb-1" />
              <div className="text-2xl font-bold text-gray-900 dark:text-white">{profile?.challengesCompleted || 0}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Challenges</div>
            </div>
            <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-xl p-4 text-center">
              <Calendar className="w-5 h-5 text-emerald-500 dark:text-emerald-400 mx-auto mb-1" />
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {profile?.joinedDate 
                  ? new Date(profile.joinedDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
                  : 'New'}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Joined</div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Growth Journey Placeholder */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mt-6 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-8 text-center"
      >
        <div className="w-16 h-16 bg-sky-50 dark:bg-sky-900/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Zap className="w-8 h-8 text-sky-500 dark:text-sky-400" />
        </div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Growth Journey</h2>
        <p className="text-gray-500 dark:text-gray-400">
          {profile?.displayName || 'This builder'}'s full growth timeline and achievements will be displayed here.
        </p>
      </motion.div>
    </div>
  );
};

export default PublicProfilePage;