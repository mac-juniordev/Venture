import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { Sun, Moon, Menu, X } from 'lucide-react';
import { motion } from 'framer-motion';

const PublicNavbar = () => {
  const { isDark, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const linkClass = "text-sm text-gray-700 dark:text-gray-200 hover:text-sky-500 dark:hover:text-sky-400 font-medium transition-colors";
  const mobileLinkClass = "text-gray-700 dark:text-gray-200 hover:text-sky-500 dark:hover:text-sky-400 font-medium py-2 px-2 transition-colors";

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 shadow-sm dark:shadow-gray-900/50 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="text-xl font-bold bg-gradient-to-r from-sky-500 to-emerald-500 bg-clip-text text-transparent">
            VENTURE
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6 lg:gap-8">
            <a href="#features" className={linkClass}>
              Features
            </a>
            <a href="#pricing" className={linkClass}>
              Pricing
            </a>
            <a href="#about" className={linkClass}>
              About
            </a>
            <a href="#contact" className={linkClass}>
              Contact
            </a>
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-3">
            <Link to="/login" className={linkClass}>
              Sign In
            </Link>
            <Link 
              to="/register" 
              className="px-4 py-2 bg-gradient-to-r from-sky-400 to-emerald-400 hover:from-sky-500 hover:to-emerald-500 text-white text-sm font-semibold rounded-lg transition-all duration-200 shadow-md shadow-sky-200 dark:shadow-sky-900/30"
            >
              Start Free
            </Link>
            <button
              onClick={toggleTheme}
              className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
          </div>

          {/* Mobile: Theme Toggle + Menu Button */}
          <div className="flex items-center gap-1 md:hidden">
            <button
              onClick={toggleTheme}
              className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <button 
              className="text-gray-700 dark:text-gray-200 p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }} 
            animate={{ opacity: 1, y: 0 }}
            className="md:hidden py-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900"
          >
            <div className="flex flex-col gap-1">
              <a 
                href="#features" 
                className={mobileLinkClass}
                onClick={() => setMobileMenuOpen(false)}
              >
                Features
              </a>
              <a 
                href="#pricing" 
                className={mobileLinkClass}
                onClick={() => setMobileMenuOpen(false)}
              >
                Pricing
              </a>
              <a 
                href="#about" 
                className={mobileLinkClass}
                onClick={() => setMobileMenuOpen(false)}
              >
                About
              </a>
              <a 
                href="#contact" 
                className={mobileLinkClass}
                onClick={() => setMobileMenuOpen(false)}
              >
                Contact
              </a>
              <div className="border-t border-gray-200 dark:border-gray-700 my-2 pt-2">
                <Link 
                  to="/login" 
                  className={mobileLinkClass}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Sign In
                </Link>
                <Link 
                  to="/register" 
                  className="mt-2 px-4 py-2.5 bg-gradient-to-r from-sky-400 to-emerald-400 text-white text-sm font-semibold rounded-lg text-center shadow-md block"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Start Free
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </nav>
  );
};

export default PublicNavbar;