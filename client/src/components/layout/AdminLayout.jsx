import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { adminService } from '../../services/adminService';
import {
  LayoutDashboard, Users, Trophy, Award, MessageSquare,
  Calendar, Megaphone, BarChart3, Settings, User,
  Sun, Moon, Bell, LogOut, ChevronLeft, ChevronRight
} from 'lucide-react';
import LogoutModal from '../ui/LogoutModal';

const AdminLayout = () => {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    fetchUnreadCount();
    const interval = setInterval(fetchUnreadCount, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchUnreadCount = async () => {
    try {
      const response = await adminService.getNotifications(1);
      setUnreadCount(response.data.data.unreadCount);
    } catch (error) {}
  };

  const handleLogout = async () => {
    await logout();
    navigate('/architect/login');
  };

  const navItems = [
    { path: '/architect', icon: LayoutDashboard, label: 'Command Center' },
    { path: '/architect/builders', icon: Users, label: 'Builders' },
    { path: '/architect/challenges', icon: Trophy, label: 'Challenges' },
    { path: '/architect/achievements', icon: Award, label: 'Achievements' },
    { path: '/architect/motivations', icon: MessageSquare, label: 'Motivations' },
    { path: '/architect/campaigns', icon: Calendar, label: 'Campaigns' },
    { path: '/architect/announcements', icon: Megaphone, label: 'Announcements' },
    { path: '/architect/analytics', icon: BarChart3, label: 'Analytics' },
    { path: '/architect/settings', icon: Settings, label: 'Settings' },
    { path: '/architect/profile', icon: User, label: 'Profile' },
  ];

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-[#060a13] transition-colors duration-300">
      {/* Top Bar */}
      <div className="fixed top-0 left-0 right-0 h-16 bg-white dark:bg-[#0a0f1a] border-b border-gray-200 dark:border-gray-800 z-50 flex items-center justify-between px-6 transition-colors duration-300">
        <div className="flex items-center gap-4">
          <span className="text-xl font-bold text-gray-900 dark:text-white tracking-wider">
            ARCHITECT
          </span>
          <span className="text-xs text-gray-500 dark:text-gray-500 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded transition-colors">
            CONTROL CENTER
          </span>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={toggleTheme}
            className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
          <Link
            to="/architect/notifications"
            className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-white transition-colors relative"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </Link>
          <button
            onClick={() => setLogoutModalOpen(true)}
            className="p-2 text-gray-500 dark:text-gray-400 hover:text-red-500 transition-colors"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Sidebar */}
      <div className={`fixed top-16 left-0 h-[calc(100vh-4rem)] bg-white dark:bg-[#0a0f1a] border-r border-gray-200 dark:border-gray-800 transition-all duration-300 z-40 ${collapsed ? 'w-20' : 'w-64'}`}>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-6 w-6 h-6 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-full flex items-center justify-center text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-white shadow-sm z-10 transition-colors"
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
        <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group ${
                  isActive
                    ? 'bg-sky-50 dark:bg-sky-500/10 text-sky-600 dark:text-sky-400 font-medium border border-sky-200 dark:border-sky-500/20'
                    : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-700 dark:hover:text-gray-200'
                }`}
                title={collapsed ? item.label : ''}
              >
                <item.icon className="w-5 h-5 flex-shrink-0" />
                {!collapsed && <span className="text-sm">{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="px-3 pb-8 pt-4 border-t border-gray-200 dark:border-gray-800 mt-auto transition-colors">
          <div className="flex items-center gap-3 px-3 py-2">
            <div className="w-8 h-8 bg-sky-100 dark:bg-sky-500/10 rounded-lg flex items-center justify-center">
              <User className="w-4 h-4 text-sky-600 dark:text-sky-400" />
            </div>
            {!collapsed && (
              <div>
                <p className="text-xs font-medium text-gray-700 dark:text-gray-300">The Architect</p>
                <p className="text-[10px] text-gray-500 dark:text-gray-500">{user?.email}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className={`pt-16 transition-all duration-300 ${collapsed ? 'ml-20' : 'ml-64'}`}>
        <main className="p-6">
          <Outlet />
        </main>
      </div>

      <LogoutModal isOpen={logoutModalOpen} onClose={() => setLogoutModalOpen(false)} />
    </div>
  );
};

export default AdminLayout;