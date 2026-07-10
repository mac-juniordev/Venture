import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { userService } from '../../services/userService';
import { adminService } from '../../services/adminService';
import { Shield, Mail, Lock, Save, Eye, EyeOff, Key } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const AdminProfilePage = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Email change
  const [email, setEmail] = useState('');
  const [emailPassword, setEmailPassword] = useState('');

  // Password change
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await userService.getMyProfile();
      setProfile(response.data.data.profile);
      setEmail(response.data.data.profile?.user?.email || '');
    } catch (error) {
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateEmail = async () => {
    if (!emailPassword) {
      toast.error('Password is required to change email');
      return;
    }
    setSaving(true);
    try {
      await userService.updateSettings({
        email: email !== user?.email ? email : undefined,
        currentPassword: emailPassword,
      });
      toast.success('Email updated successfully');
      setEmailPassword('');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update email');
    } finally {
      setSaving(false);
    }
  };

  const handleUpdatePassword = async () => {
    if (!currentPassword || !newPassword) {
      toast.error('All password fields are required');
      return;
    }
    if (newPassword.length < 8) {
      toast.error('New password must be at least 8 characters');
      return;
    }
    if (newPassword !== confirmNewPassword) {
      toast.error('New passwords do not match');
      return;
    }
    setSaving(true);
    try {
      await userService.updateSettings({
        currentPassword,
        newPassword,
      });
      toast.success('Password updated successfully');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update password');
    } finally {
      setSaving(false);
    }
  };

  const inputClass = "w-full px-4 py-3 bg-[#060a13] dark:bg-[#060a13] border border-gray-700 dark:border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-sky-500 transition-colors";
  const labelClass = "block text-sm font-medium text-gray-400 mb-2";

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-white">Architect Profile</h1>
        <p className="text-gray-400 text-sm mt-1">Manage your control center credentials</p>
      </motion.div>

      {/* Profile Info Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-[#0a0f1a] border border-gray-800 rounded-2xl p-6 md:p-8"
      >
        <div className="flex items-center gap-4 mb-6">
          <div className="w-14 h-14 bg-sky-500/10 border border-sky-500/30 rounded-2xl flex items-center justify-center">
            <Shield className="w-7 h-7 text-sky-400" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">The Architect</h2>
            <p className="text-gray-400 text-sm">{user?.email}</p>
            <p className="text-xs text-sky-400 mt-0.5">System Administrator</p>
          </div>
        </div>
      </motion.div>

      {/* Change Email */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="bg-[#0a0f1a] border border-gray-800 rounded-2xl p-6 md:p-8"
      >
        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <Mail className="w-5 h-5 text-sky-400" />
          Change Email
        </h3>
        <div className="space-y-4">
          <div>
            <label className={labelClass}>New Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="architect@venture.com"
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Current Password (to confirm)</label>
            <input
              type="password"
              value={emailPassword}
              onChange={(e) => setEmailPassword(e.target.value)}
              placeholder="Enter current password"
              className={inputClass}
            />
          </div>
          <button
            onClick={handleUpdateEmail}
            disabled={saving}
            className="px-6 py-2.5 bg-sky-500 hover:bg-sky-400 text-black font-medium rounded-xl transition-all flex items-center gap-2 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Saving...' : 'Update Email'}
          </button>
        </div>
      </motion.div>

      {/* Change Password */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-[#0a0f1a] border border-gray-800 rounded-2xl p-6 md:p-8"
      >
        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <Key className="w-5 h-5 text-sky-400" />
          Change Passphrase
        </h3>
        <div className="space-y-4">
          <div>
            <label className={labelClass}>Current Passphrase</label>
            <div className="relative">
              <input
                type={showCurrentPassword ? 'text' : 'password'}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Enter current passphrase"
                className={`${inputClass} pr-12`}
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
              >
                {showCurrentPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>
          <div>
            <label className={labelClass}>New Passphrase</label>
            <div className="relative">
              <input
                type={showNewPassword ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Min. 8 characters"
                className={`${inputClass} pr-12`}
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
              >
                {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>
          <div>
            <label className={labelClass}>Confirm New Passphrase</label>
            <input
              type="password"
              value={confirmNewPassword}
              onChange={(e) => setConfirmNewPassword(e.target.value)}
              placeholder="Re-enter new passphrase"
              className={inputClass}
            />
          </div>
          <button
            onClick={handleUpdatePassword}
            disabled={saving}
            className="px-6 py-2.5 bg-sky-500 hover:bg-sky-400 text-black font-medium rounded-xl transition-all flex items-center gap-2 disabled:opacity-50"
          >
            <Lock className="w-4 h-4" />
            {saving ? 'Updating...' : 'Update Passphrase'}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminProfilePage;