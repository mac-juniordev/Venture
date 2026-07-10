import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { Shield, Eye, EyeOff, Sun, Moon } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const ArchitectLoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await login(email, password);
      if (response.data.data.user.role !== 'admin') {
        toast.error('Access denied. Architect only.');
        return;
      }
      toast.success('Welcome back, Architect.');
      navigate('/architect');
    } catch (error) {
      toast.error('Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#060a13] flex items-center justify-center p-6 relative transition-colors duration-300">
      {/* Theme Toggle - Top Right */}
      <button
        onClick={toggleTheme}
        className="absolute top-6 right-6 p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-gray-800 rounded-lg transition-colors"
        title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      >
        {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
      </button>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        {/* Logo & Title */}
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-sky-100 dark:bg-sky-500/10 border border-sky-300 dark:border-sky-500/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-sky-600 dark:text-sky-400" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-wider">
            ARCHITECT
          </h1>
          <p className="text-gray-500 dark:text-gray-500 text-sm mt-2">
            Control Center Access
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="bg-white dark:bg-[#0a0f1a] border border-gray-200 dark:border-gray-800 rounded-2xl p-8 space-y-5 shadow-xl dark:shadow-none">
          <div>
            <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
              Architect Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="architect@venture.com"
              className="w-full px-4 py-3 bg-gray-50 dark:bg-[#060a13] border border-gray-300 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-sky-500 dark:focus:border-sky-500 transition-colors"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
              Passphrase
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 bg-gray-50 dark:bg-[#060a13] border border-gray-300 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-sky-500 dark:focus:border-sky-500 transition-colors pr-12"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-sky-500 hover:bg-sky-600 dark:hover:bg-sky-400 text-white dark:text-black font-bold rounded-xl transition-all duration-200 disabled:opacity-50 shadow-lg shadow-sky-200 dark:shadow-sky-500/20"
          >
            {loading ? 'Verifying...' : 'Enter Control Center'}
          </button>
        </form>

        {/* Footer */}
        <p className="text-center text-gray-400 dark:text-gray-600 text-xs mt-6">
          VENTURE Architect Control Center · Restricted Access
        </p>
      </motion.div>
    </div>
  );
};

export default ArchitectLoginPage;