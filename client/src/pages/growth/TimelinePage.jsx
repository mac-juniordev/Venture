import React, { useState, useEffect } from 'react';
import { growthService } from '../../services/growthService';
import { 
  Calendar, 
  ChevronLeft, 
  ChevronRight,
  Star,
  Smile,
  Meh,
  Frown,
  Clock,
  Flame,
  Sparkles
} from 'lucide-react';
import Spinner from '../../components/ui/Spinner';
import { motion, AnimatePresence } from 'framer-motion';

const TimelinePage = () => {
  const [loading, setLoading] = useState(true);
  const [entries, setEntries] = useState([]);
  const [calendar, setCalendar] = useState({ month: 0, year: 0, checkedInDates: [] });
  const [streaks, setStreaks] = useState({ currentStreak: 0, longestStreak: 0 });
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [activeTab, setActiveTab] = useState('timeline'); // 'timeline' or 'calendar'

  useEffect(() => {
    fetchHistory();
  }, [page]);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const response = await growthService.getGrowthHistory(page);
      const data = response.data.data;
      setEntries(data.entries);
      setCalendar(data.calendar);
      setStreaks(data.streaks);
      setPagination(data.pagination);
    } catch (error) {
      console.error('Failed to load history');
    } finally {
      setLoading(false);
    }
  };

  const handleDateClick = (day) => {
    if (!day || !day.checkedIn) return;
    
    setSelectedDate(day.date);
    // Find the entry for this date
    const entry = entries.find(e => e.date === day.date);
    setSelectedEntry(entry || null);
  };

  const getMoodIcon = (mood, size = 'w-4 h-4') => {
    const icons = {
      great: <Star className={`${size} text-yellow-500`} />,
      good: <Smile className={`${size} text-emerald-500`} />,
      okay: <Meh className={`${size} text-sky-500`} />,
      struggling: <Frown className={`${size} text-orange-500`} />,
    };
    return icons[mood] || null;
  };

  const getMoodLabel = (mood) => {
    const labels = {
      great: 'Amazing day! 🌟',
      good: 'Productive day 👍',
      okay: 'Steady progress 📍',
      struggling: 'Tough but showed up 💪',
    };
    return labels[mood] || '';
  };

  // Generate calendar days for current month
  const generateCalendarDays = () => {
    const { month, year, checkedInDates } = calendar;
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const today = new Date().toISOString().split('T')[0];
    
    const days = [];
    
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(null);
    }
    
    for (let i = 1; i <= daysInMonth; i++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
      const isCheckedIn = checkedInDates.includes(dateStr);
      const isToday = today === dateStr;
      const isFuture = dateStr > today;
      const isSelected = selectedDate === dateStr;
      
      days.push({
        day: i,
        date: dateStr,
        checkedIn: isCheckedIn,
        isToday,
        isFuture,
        isSelected,
      });
    }
    
    return days;
  };

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  if (loading && entries.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-4 md:space-y-6">
      {/* Streak Summary */}
      <div className="grid grid-cols-2 gap-3 md:gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-5 md:p-6 text-center"
        >
          <Flame className="w-8 h-8 md:w-10 md:h-10 text-orange-500 mx-auto mb-2" />
          <div className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">{streaks.currentStreak}</div>
          <div className="text-sm text-gray-500 dark:text-gray-400">Current Streak</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-5 md:p-6 text-center"
        >
          <Sparkles className="w-8 h-8 md:w-10 md:h-10 text-yellow-500 mx-auto mb-2" />
          <div className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">{streaks.longestStreak}</div>
          <div className="text-sm text-gray-500 dark:text-gray-400">Longest Streak</div>
        </motion.div>
      </div>

      {/* Tab Switcher */}
      <div className="flex bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-1">
        <button
          onClick={() => setActiveTab('timeline')}
          className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-all ${
            activeTab === 'timeline'
              ? 'bg-sky-50 dark:bg-sky-900/30 text-sky-600 dark:text-sky-400 shadow-sm'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
          }`}
        >
          <Clock className="w-4 h-4 inline mr-1.5" />
          Timeline
        </button>
        <button
          onClick={() => setActiveTab('calendar')}
          className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-all ${
            activeTab === 'calendar'
              ? 'bg-sky-50 dark:bg-sky-900/30 text-sky-600 dark:text-sky-400 shadow-sm'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
          }`}
        >
          <Calendar className="w-4 h-4 inline mr-1.5" />
          Calendar
        </button>
      </div>

      {/* Timeline View */}
      {activeTab === 'timeline' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-5 md:p-8"
        >
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
            <Clock className="w-5 h-5 text-sky-500" />
            Growth History
          </h2>

          {entries.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="w-12 h-12 md:w-16 md:h-16 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
              <p className="text-gray-500 dark:text-gray-400">No check-ins yet. Start your journey today!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {entries.map((entry, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex gap-4 p-4 bg-gray-50 dark:bg-gray-700/30 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors cursor-pointer"
                  onClick={() => {
                    setSelectedDate(entry.date);
                    setSelectedEntry(entry);
                  }}
                >
                  <div className="flex-shrink-0 text-center min-w-[50px]">
                    <div className="text-xs text-gray-400 dark:text-gray-500 uppercase">
                      {new Date(entry.date + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'short' })}
                    </div>
                    <div className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
                      {new Date(entry.date + 'T00:00:00').getDate()}
                    </div>
                    <div className="text-xs text-gray-400 dark:text-gray-500">
                      {new Date(entry.date + 'T00:00:00').toLocaleDateString('en-US', { month: 'short' })}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      {getMoodIcon(entry.mood)}
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {new Date(entry.checkInTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    {entry.note ? (
                      <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-2">{entry.note}</p>
                    ) : (
                      <p className="text-sm text-gray-400 dark:text-gray-500 italic">No note for today</p>
                    )}
                    {entry.tags && entry.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {entry.tags.map((tag, i) => (
                          <span key={i} className="px-2 py-0.5 bg-sky-50 dark:bg-sky-900/20 text-sky-600 dark:text-sky-400 text-xs rounded-full">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {pagination && pagination.pages > 1 && (
            <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-100 dark:border-gray-700">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400 hover:text-sky-500 disabled:opacity-30 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </button>
              <span className="text-sm text-gray-400">
                {page} / {pagination.pages}
              </span>
              <button
                onClick={() => setPage(p => Math.min(pagination.pages, p + 1))}
                disabled={page === pagination.pages}
                className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400 hover:text-sky-500 disabled:opacity-30 transition-colors"
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </motion.div>
      )}

      {/* Calendar View */}
      {activeTab === 'calendar' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          {/* Calendar Card */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-5 md:p-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                {monthNames[calendar.month]} {calendar.year}
              </h3>
              <div className="flex gap-1">
                <button className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-7 gap-1 md:gap-2">
              {dayNames.map(day => (
                <div key={day} className="text-center text-xs font-medium text-gray-400 dark:text-gray-500 py-2">
                  <span className="hidden md:inline">{day}</span>
                  <span className="md:hidden">{day.charAt(0)}</span>
                </div>
              ))}
              
              {generateCalendarDays().map((day, index) => (
                <div key={index} className="aspect-square flex items-center justify-center">
                  {day ? (
                    <button
                      onClick={() => handleDateClick(day)}
                      disabled={!day.checkedIn || day.isFuture}
                      className={`w-8 h-8 md:w-10 md:h-10 rounded-xl flex items-center justify-center text-sm transition-all relative ${
                        day.isFuture
                          ? 'text-gray-300 dark:text-gray-600 cursor-not-allowed'
                          : day.checkedIn
                          ? day.isSelected
                            ? 'bg-sky-400 text-white font-bold shadow-lg shadow-sky-200 scale-110'
                            : 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 font-bold hover:bg-emerald-200 dark:hover:bg-emerald-900/50 cursor-pointer'
                          : day.isToday
                          ? 'bg-sky-50 dark:bg-sky-900/20 text-sky-600 dark:text-sky-400 font-bold ring-2 ring-sky-400'
                          : 'text-gray-500 dark:text-gray-400'
                      }`}
                    >
                      {day.day}
                      {day.checkedIn && day.isSelected && (
                        <Flame className="absolute -top-1 -right-1 w-3 h-3 md:w-4 md:h-4 text-orange-500 fill-orange-500" />
                      )}
                    </button>
                  ) : (
                    <div />
                  )}
                </div>
              ))}
            </div>

            <div className="flex items-center gap-4 mt-6 text-xs text-gray-500 dark:text-gray-400">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 bg-emerald-100 dark:bg-emerald-900/30 rounded" />
                Checked in
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 bg-sky-50 dark:bg-sky-900/20 rounded ring-1 ring-sky-400" />
                Today
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 bg-sky-400 rounded" />
                Selected
              </div>
            </div>
          </div>

          {/* Selected Day Entry */}
          <AnimatePresence>
            {selectedDate && selectedEntry && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-5 md:p-8"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-sky-50 dark:bg-sky-900/20 rounded-xl flex items-center justify-center">
                      <Flame className="w-5 h-5 text-orange-500" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 dark:text-white">
                        {new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-US', { 
                          weekday: 'long', 
                          month: 'long', 
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {new Date(selectedEntry.checkInTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => { setSelectedDate(null); setSelectedEntry(null); }}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 text-sm"
                  >
                    Close ✕
                  </button>
                </div>

                {selectedEntry.mood && (
                  <div className="flex items-center gap-2 mb-4 p-3 bg-gray-50 dark:bg-gray-700/30 rounded-xl">
                    {getMoodIcon(selectedEntry.mood, 'w-5 h-5')}
                    <span className="text-sm text-gray-700 dark:text-gray-300">{getMoodLabel(selectedEntry.mood)}</span>
                  </div>
                )}

                {selectedEntry.note ? (
                  <div className="p-4 bg-gray-50 dark:bg-gray-700/30 rounded-xl">
                    <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{selectedEntry.note}</p>
                  </div>
                ) : (
                  <div className="p-4 bg-gray-50 dark:bg-gray-700/30 rounded-xl text-center">
                    <p className="text-sm text-gray-400 dark:text-gray-500 italic">No notes for this day</p>
                  </div>
                )}

                {selectedEntry.tags && selectedEntry.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-4">
                    {selectedEntry.tags.map((tag, i) => (
                      <span key={i} className="px-3 py-1 bg-sky-50 dark:bg-sky-900/20 text-sky-600 dark:text-sky-400 text-xs rounded-full font-medium">
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
};

export default TimelinePage;