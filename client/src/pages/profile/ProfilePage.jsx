import React, { useState, useEffect } from 'react';
import { userService } from '../../services/userService';
import { useAuth } from '../../context/AuthContext';
import { 
  MapPin, 
  Globe, 
  Code, 
  AtSign, 
  Edit3, 
  Save, 
  X,
  Award,
  Zap,
  Calendar,
  Flame
} from 'lucide-react';
import Avatar from '../../components/ui/Avatar';
import Spinner from '../../components/ui/Spinner';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

const ProfilePage = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    displayName: '',
    bio: '',
    location: '',
    website: '',
    github: '',
    twitter: '',
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await userService.getMyProfile();
      const profileData = response.data.data.profile;
      setProfile(profileData);
      setFormData({
        username: profileData.username || '',
        displayName: profileData.displayName || '',
        bio: profileData.bio || '',
        location: profileData.location || '',
        website: profileData.website || '',
        github: profileData.github || '',
        twitter: profileData.twitter || '',
      });
    } catch (error) {
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await userService.updateProfile(formData);
      setProfile(response.data.data.profile);
      setEditing(false);
      toast.success('Profile updated!');
    } catch (error) {
      const message = error.response?.data?.message || 'Update failed';
      toast.error(message);
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be less than 5MB');
      return;
    }

    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('Only .jpeg, .jpg, .png and .webp files are allowed');
      return;
    }

    const formDataUpload = new FormData();
    formDataUpload.append('avatar', file);

    try {
      const response = await userService.uploadAvatar(formDataUpload);
      setProfile(response.data.data.profile);
      toast.success('Profile picture updated!');
    } catch (error) {
      const message = error.response?.data?.message || 'Upload failed';
      toast.error(message);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Spinner size="lg" />
      </div>
    );
  }

  const inputClass = "w-full px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-sky-400 dark:focus:border-sky-500 focus:ring-2 focus:ring-sky-100 dark:focus:ring-sky-900/30 transition-all text-sm";

  return (
    <div className="max-w-4xl mx-auto">
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
            <div className="relative group cursor-pointer">
              <Avatar 
                size="xl" 
                src={profile?.avatar ? `http://localhost:5000${profile.avatar}` : null}
                alt={profile?.displayName || user?.email} 
              />
              <label className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                <Edit3 className="w-6 h-6 text-white" />
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleAvatarUpload}
                  className="hidden"
                />
              </label>
            </div>
            
            <div className="flex-1 pt-4">
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {profile?.displayName || 'Set your name'}
                  </h1>
                  {profile?.username && (
                    <p className="text-gray-500 dark:text-gray-400">@{profile.username}</p>
                  )}
                  <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">{user?.email}</p>
                </div>
                
                <button
                  onClick={() => setEditing(!editing)}
                  className={`p-2 rounded-lg transition-colors ${
                    editing 
                      ? 'bg-red-50 dark:bg-red-900/20 text-red-500 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30' 
                      : 'bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-600'
                  }`}
                >
                  {editing ? <X className="w-5 h-5" /> : <Edit3 className="w-5 h-5" />}
                </button>
              </div>

              {profile?.bio && !editing && (
                <p className="text-gray-600 dark:text-gray-300 mt-3">{profile.bio}</p>
              )}

              {/* Social Links */}
              {!editing && (
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
                      className="flex items-center gap-1 text-sm text-sky-500 dark:text-sky-400 hover:text-sky-600 dark:hover:text-sky-300"
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
                      className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
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
                      className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
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

      {/* Edit Form */}
      {editing && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-8"
        >
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Edit Profile</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Username</label>
              <input
                type="text"
                value={formData.username}
                onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
                placeholder="your_username"
                className={inputClass}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Display Name</label>
              <input
                type="text"
                value={formData.displayName}
                onChange={(e) => setFormData(prev => ({ ...prev, displayName: e.target.value }))}
                placeholder="Your name"
                className={inputClass}
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Bio</label>
              <textarea
                value={formData.bio}
                onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                placeholder="Tell us about your growth journey..."
                rows={3}
                maxLength={300}
                className={`${inputClass} resize-none`}
              />
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{formData.bio.length}/300</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <MapPin className="w-4 h-4 inline mr-1" />
                Location
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                placeholder="City, Country"
                className={inputClass}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <Globe className="w-4 h-4 inline mr-1" />
                Website
              </label>
              <input
                type="url"
                value={formData.website}
                onChange={(e) => setFormData(prev => ({ ...prev, website: e.target.value }))}
                placeholder="https://your-site.com"
                className={inputClass}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <Code className="w-4 h-4 inline mr-1" />
                GitHub
              </label>
              <input
                type="text"
                value={formData.github}
                onChange={(e) => setFormData(prev => ({ ...prev, github: e.target.value }))}
                placeholder="username"
                className={inputClass}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <AtSign className="w-4 h-4 inline mr-1" />
                Twitter
              </label>
              <input
                type="text"
                value={formData.twitter}
                onChange={(e) => setFormData(prev => ({ ...prev, twitter: e.target.value }))}
                placeholder="username"
                className={inputClass}
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-8">
            <button
              onClick={() => setEditing(false)}
              className="px-6 py-2.5 border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 font-medium rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-6 py-2.5 bg-gradient-to-r from-sky-400 to-emerald-400 hover:from-sky-500 hover:to-emerald-500 text-white font-medium rounded-xl transition-all duration-200 flex items-center gap-2 disabled:opacity-50 shadow-lg shadow-sky-200 dark:shadow-sky-900/30"
            >
              {saving ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              Save Changes
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default ProfilePage;