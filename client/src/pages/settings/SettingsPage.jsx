import React, { useState, useEffect } from 'react';
import { userService } from '../../services/userService';
import { useAuth } from '../../context/AuthContext';
import { 
  Mail, 
  Lock, 
  Shield, 
  Save, 
  Eye, 
  EyeOff,
  AlertTriangle,
  CheckCircle,
  HelpCircle
} from 'lucide-react';
import Spinner from '../../components/ui/Spinner';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

const SettingsPage = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('account');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);

  // Account Settings
  const [email, setEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');

  // Security Questions
  const [securityQuestions, setSecurityQuestions] = useState([
    { question: '', answer: '' },
    { question: '', answer: '' },
    { question: '', answer: '' },
  ]);
  const [showAnswers, setShowAnswers] = useState([false, false, false]);

  const questionOptions = [
    "What was the name of your first pet?",
    "What is your mother's maiden name?",
    "What city were you born in?",
    "What was the name of your first school?",
    "What is your favorite book?",
    "What was your childhood nickname?",
    "What is the name of your best childhood friend?",
    "What was your dream job as a child?",
    "What is your favorite movie?",
    "Who was your childhood hero?"
  ];

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await userService.getMyProfile();
      const profile = response.data.data.profile;
      setEmail(profile?.user?.email || '');
    } catch (error) {
      toast.error('Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveAccount = async () => {
    if (!currentPassword) {
      toast.error('Current password is required to make changes');
      return;
    }

    setSaving(true);
    try {
      await userService.updateSettings({
        email: email !== user?.email ? email : undefined,
        currentPassword,
      });
      toast.success('Account settings updated!');
      setCurrentPassword('');
    } catch (error) {
      const message = error.response?.data?.message || 'Update failed';
      toast.error(message);
    } finally {
      setSaving(false);
    }
  };

  const handleSaveSecurityQuestions = async () => {
    // Validate all questions and answers are filled
    const isValid = securityQuestions.every(sq => sq.question && sq.answer);
    if (!isValid) {
      toast.error('Please fill in all security questions and answers');
      return;
    }

    if (!currentPassword) {
      toast.error('Current password is required to update security questions');
      return;
    }

    setSaving(true);
    try {
      await userService.updateSettings({
        securityQuestions,
        currentPassword,
      });
      toast.success('Security questions updated!');
      // Clear answers after saving
      setSecurityQuestions([
        { question: '', answer: '' },
        { question: '', answer: '' },
        { question: '', answer: '' },
      ]);
      setCurrentPassword('');
    } catch (error) {
      const message = error.response?.data?.message || 'Update failed';
      toast.error(message);
    } finally {
      setSaving(false);
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
  const selectClass = "w-full px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:border-sky-400 dark:focus:border-sky-500 focus:ring-2 focus:ring-sky-100 dark:focus:ring-sky-900/30 transition-all text-sm";

  return (
    <div className="max-w-3xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden"
      >
        {/* Header */}
        <div className="p-6 md:p-8 border-b border-gray-100 dark:border-gray-700">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Settings</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Manage your account and security preferences</p>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-100 dark:border-gray-700">
          <button
            onClick={() => setActiveTab('account')}
            className={`flex-1 py-4 text-sm font-medium transition-colors relative ${
              activeTab === 'account'
                ? 'text-sky-500 dark:text-sky-400'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            <Mail className="w-4 h-4 inline mr-2" />
            Account
            {activeTab === 'account' && (
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-16 h-0.5 bg-sky-500 rounded-full" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('security')}
            className={`flex-1 py-4 text-sm font-medium transition-colors relative ${
              activeTab === 'security'
                ? 'text-sky-500 dark:text-sky-400'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            <Shield className="w-4 h-4 inline mr-2" />
            Security
            {activeTab === 'security' && (
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-16 h-0.5 bg-sky-500 rounded-full" />
            )}
          </button>
        </div>

        {/* Account Tab */}
        {activeTab === 'account' && (
          <div className="p-6 md:p-8 space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className={`${inputClass} pl-12`}
                />
              </div>
              {email !== user?.email && (
                <p className="mt-2 text-xs text-amber-500 dark:text-amber-400 flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" />
                  Email change will require re-verification
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Current Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showCurrentPassword ? 'text' : 'password'}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter current password to confirm changes"
                  className={`${inputClass} pl-12 pr-12`}
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  {showCurrentPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              <p className="mt-2 text-xs text-gray-400 dark:text-gray-500">
                Required to save any changes
              </p>
            </div>

            <div className="flex justify-end pt-4">
              <button
                onClick={handleSaveAccount}
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
          </div>
        )}

        {/* Security Tab */}
        {activeTab === 'security' && (
          <div className="p-6 md:p-8 space-y-6">
            <div className="bg-sky-50 dark:bg-sky-900/20 rounded-xl p-4 border border-sky-100 dark:border-sky-800">
              <div className="flex items-start gap-3">
                <HelpCircle className="w-5 h-5 text-sky-500 dark:text-sky-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-1">Security Questions</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                    These questions help verify your identity when requesting password resets. 
                    Choose questions only you can answer. Answers are encrypted and never shown to anyone, including admins.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-5">
              {securityQuestions.map((sq, index) => (
                <div key={index} className="p-5 bg-gray-50 dark:bg-gray-700/50 rounded-xl border border-gray-100 dark:border-gray-600">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-6 h-6 bg-sky-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                      {index + 1}
                    </div>
                    <h4 className="text-sm font-bold text-gray-900 dark:text-white">
                      Security Question {index + 1}
                    </h4>
                  </div>
                  
                  <div className="space-y-3">
                    <select
                      value={sq.question}
                      onChange={(e) => {
                        const updated = [...securityQuestions];
                        updated[index].question = e.target.value;
                        setSecurityQuestions(updated);
                      }}
                      className={selectClass}
                    >
                      <option value="">Select a question...</option>
                      {questionOptions.map((q, i) => (
                        <option key={i} value={q}>{q}</option>
                      ))}
                    </select>

                    <div className="relative">
                      <input
                        type={showAnswers[index] ? 'text' : 'password'}
                        value={sq.answer}
                        onChange={(e) => {
                          const updated = [...securityQuestions];
                          updated[index].answer = e.target.value;
                          setSecurityQuestions(updated);
                        }}
                        placeholder="Your answer"
                        className={`${inputClass} pr-12`}
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const updated = [...showAnswers];
                          updated[index] = !updated[index];
                          setShowAnswers(updated);
                        }}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                      >
                        {showAnswers[index] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Current Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter current password to confirm changes"
                  className={`${inputClass} pl-12`}
                />
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <button
                onClick={handleSaveSecurityQuestions}
                disabled={saving}
                className="px-6 py-2.5 bg-gradient-to-r from-sky-400 to-emerald-400 hover:from-sky-500 hover:to-emerald-500 text-white font-medium rounded-xl transition-all duration-200 flex items-center gap-2 disabled:opacity-50 shadow-lg shadow-sky-200 dark:shadow-sky-900/30"
              >
                {saving ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Shield className="w-4 h-4" />
                    Save Security Questions
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default SettingsPage;