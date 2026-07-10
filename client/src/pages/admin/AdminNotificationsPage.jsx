import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import { Bell, Check, Filter } from 'lucide-react';
import Spinner from '../../components/ui/Spinner';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const AdminNotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [category, setCategory] = useState('all');

  useEffect(() => {
    fetchNotifications();
  }, [page, category]);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await adminService.getNotifications(page, category === 'all' ? null : category);
      setNotifications(response.data.data.notifications);
      setTotalPages(response.data.data.pages);
      setUnreadCount(response.data.data.unreadCount);
    } catch (error) {
      console.error('Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id) => {
    try {
      await adminService.markNotificationRead(id);
      if (id === 'all') {
        setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
        setUnreadCount(0);
        toast.success('All marked as read');
      } else {
        setNotifications(prev => prev.map(n => n._id === id ? { ...n, isRead: true } : n));
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (error) {
      toast.error('Failed');
    }
  };

  const categories = [
    { value: 'all', label: 'All' },
    { value: 'builder', label: 'Builders' },
    { value: 'growth', label: 'Growth' },
    { value: 'challenge', label: 'Challenges' },
    { value: 'achievement', label: 'Achievements' },
    { value: 'security', label: 'Security' },
    { value: 'platform', label: 'Platform' },
  ];

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'critical': return 'bg-red-400';
      case 'high': return 'bg-orange-400';
      case 'normal': return 'bg-sky-400';
      case 'low': return 'bg-gray-400';
      default: return 'bg-sky-400';
    }
  };

  if (loading && notifications.length === 0) {
    return (
      <div className="flex justify-center py-20">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">System Pulse</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
            {unreadCount} unread · {notifications.length} total
          </p>
        </motion.div>
        {unreadCount > 0 && (
          <button
            onClick={() => markAsRead('all')}
            className="px-4 py-2 bg-sky-500 hover:bg-sky-400 text-black font-medium rounded-xl text-sm flex items-center gap-2 transition-colors"
          >
            <Check className="w-4 h-4" />
            Mark All Read
          </button>
        )}
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => (
          <button
            key={cat.value}
            onClick={() => { setCategory(cat.value); setPage(1); }}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
              category === cat.value
                ? 'bg-sky-500/10 text-sky-400 border border-sky-500/20'
                : 'bg-white dark:bg-[#0a0f1a] border border-gray-200 dark:border-gray-800 text-gray-500 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-700'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      <div className="space-y-2">
        {notifications.length === 0 ? (
          <div className="bg-white dark:bg-[#0a0f1a] border border-gray-200 dark:border-gray-800 rounded-2xl p-12 text-center">
            <Bell className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
            <p className="text-gray-500 dark:text-gray-400">No notifications yet.</p>
          </div>
        ) : (
          notifications.map((n, i) => (
            <motion.div
              key={n._id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.02 }}
              className={`bg-white dark:bg-[#0a0f1a] border rounded-xl p-4 transition-colors ${
                n.isRead
                  ? 'border-gray-200 dark:border-gray-800 opacity-60'
                  : 'border-sky-500/30 dark:border-sky-500/30'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${getPriorityColor(n.priority)} ${n.isRead ? 'opacity-30' : ''}`} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{n.title}</p>
                    {!n.isRead && (
                      <button
                        onClick={() => markAsRead(n._id)}
                        className="text-xs text-sky-400 hover:text-sky-300 ml-2 flex-shrink-0"
                      >
                        Mark read
                      </button>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{n.description}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-[10px] px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 rounded capitalize">
                      {n.category}
                    </span>
                    <span className="text-[10px] text-gray-400 dark:text-gray-600">
                      {new Date(n.createdAt).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2">
          <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="px-4 py-2 text-sm text-gray-400 hover:text-white disabled:opacity-30">Previous</button>
          <span className="px-4 py-2 text-sm text-gray-500">{page} / {totalPages}</span>
          <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="px-4 py-2 text-sm text-gray-400 hover:text-white disabled:opacity-30">Next</button>
        </div>
      )}
    </div>
  );
};

export default AdminNotificationsPage;