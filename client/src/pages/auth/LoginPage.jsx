import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import PublicNavbar from '../../components/layout/PublicNavbar';

const LoginPage = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const { login } = useAuth();
  const navigate = useNavigate();

  const validate = () => {
    const newErrors = {};
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.password) newErrors.password = 'Password is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      await login(formData.email, formData.password);
      toast.success('Welcome back!');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full pl-12 pr-4 py-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-sky-400 dark:focus:border-sky-500 focus:ring-2 focus:ring-sky-100 dark:focus:ring-sky-900/30 transition-all text-base shadow-sm";

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-emerald-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300">
      <PublicNavbar />
      
      {/* Mobile */}
      <div className="lg:hidden pt-16">
        <div className="bg-gradient-to-br from-sky-400 via-sky-500 to-emerald-400 px-6 py-12 relative overflow-hidden">
          <div className="absolute inset-0 bg-white/10" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '40px 40px' }} />
          <div className="relative z-10">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <h1 className="text-5xl font-bold text-white tracking-tight mb-3 drop-shadow-lg">VENTURE</h1>
              <div className="h-0.5 w-12 bg-white/80 mb-4" />
              <p className="text-xl text-white font-bold tracking-wide">Continue Building</p>
              <p className="text-white/90 text-sm mt-2 leading-relaxed font-medium">Every day is a new opportunity to grow.</p>
            </motion.div>
          </div>
        </div>

        <div className="px-6 py-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }} className="w-full max-w-[440px] mx-auto">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Welcome Back</h2>
              <p className="text-gray-500 dark:text-gray-400">Continue your growth journey</p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input type="email" value={formData.email} onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))} placeholder="you@example.com" className={inputClass} />
                </div>
                {errors.email && <p className="mt-1.5 text-sm text-red-500">{errors.email}</p>}
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
                  <Link to="/forgot-password" className="text-sm text-sky-500 dark:text-sky-400 hover:text-sky-600 dark:hover:text-sky-300 font-medium">Forgot password?</Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input type={showPassword ? 'text' : 'password'} value={formData.password} onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))} placeholder="Enter your password" className={`${inputClass} pr-12`} />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.password && <p className="mt-1.5 text-sm text-red-500">{errors.password}</p>}
              </div>
              <button type="submit" disabled={loading} className="w-full py-3.5 bg-gradient-to-r from-sky-400 to-emerald-400 hover:from-sky-500 hover:to-emerald-500 text-white font-semibold rounded-xl transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 shadow-lg shadow-sky-200 dark:shadow-sky-900/30">
                {loading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <>Sign In <ArrowRight className="w-5 h-5" /></>}
              </button>
            </form>
            <div className="mt-8 text-center pb-8">
              <p className="text-gray-500 dark:text-gray-400">Don't have an account? <Link to="/register" className="text-sky-500 dark:text-sky-400 hover:text-sky-600 dark:hover:text-sky-300 font-semibold">Start your journey</Link></p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Desktop */}
      <div className="hidden lg:flex min-h-screen pt-16">
        <div className="w-1/2 flex items-center justify-center p-8">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }} className="w-full max-w-[440px]">
            <div className="mb-10">
              <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">Welcome Back</h2>
              <p className="text-gray-500 dark:text-gray-400 text-lg">Continue your growth journey</p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input type="email" value={formData.email} onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))} placeholder="you@example.com" className={inputClass} />
                </div>
                {errors.email && <p className="mt-2 text-sm text-red-500">{errors.email}</p>}
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
                  <Link to="/forgot-password" className="text-sm text-sky-500 dark:text-sky-400 hover:text-sky-600 dark:hover:text-sky-300 font-medium">Forgot password?</Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input type={showPassword ? 'text' : 'password'} value={formData.password} onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))} placeholder="Enter your password" className={`${inputClass} pr-12`} />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.password && <p className="mt-2 text-sm text-red-500">{errors.password}</p>}
              </div>
              <button type="submit" disabled={loading} className="w-full py-4 bg-gradient-to-r from-sky-400 to-emerald-400 hover:from-sky-500 hover:to-emerald-500 text-white font-semibold rounded-xl transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 shadow-lg shadow-sky-200 dark:shadow-sky-900/30">
                {loading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <>Sign In <ArrowRight className="w-5 h-5" /></>}
              </button>
            </form>
            <div className="mt-8 text-center">
              <p className="text-gray-500 dark:text-gray-400">Don't have an account? <Link to="/register" className="text-sky-500 dark:text-sky-400 hover:text-sky-600 dark:hover:text-sky-300 font-semibold">Start your journey</Link></p>
            </div>
          </motion.div>
        </div>
        <div className="w-1/2 bg-gradient-to-br from-sky-400 via-sky-500 to-emerald-400 flex items-center justify-center p-16 relative overflow-hidden">
          <div className="absolute inset-0 bg-white/10" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '40px 40px' }} />
          <div className="relative z-10 max-w-lg">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}>
              <h1 className="text-8xl font-bold text-white tracking-tight mb-6 drop-shadow-lg">VENTURE</h1>
              <div className="h-0.5 w-16 bg-white/80 mb-8" />
              <p className="text-3xl text-white font-bold mb-6 tracking-wide">Continue Building</p>
              <p className="text-white/90 text-xl leading-relaxed font-medium">Every day is a new opportunity to grow. Your consistency compounds into something extraordinary.</p>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;