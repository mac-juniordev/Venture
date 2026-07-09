import DailyEntry from '../models/DailyEntry.js';
import Profile from '../models/Profile.js';

export const calculateStreak = async (userId) => {
  // Get all entries ordered by date descending
  const entries = await DailyEntry.find({ user: userId })
    .sort({ date: -1 })
    .lean();

  if (entries.length === 0) {
    return { currentStreak: 0, longestStreak: 0 };
  }

  let currentStreak = 0;
  let longestStreak = 0;
  let tempStreak = 0;
  let previousDate = null;
  const today = new Date().toISOString().split('T')[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

  // Calculate longest streak from all entries
  for (const entry of entries) {
    const entryDate = entry.date;
    
    if (!previousDate) {
      tempStreak = 1;
      previousDate = entryDate;
    } else {
      const prev = new Date(previousDate);
      const curr = new Date(entryDate);
      const diffDays = (prev - curr) / (1000 * 60 * 60 * 24);
      
      if (diffDays === 1) {
        tempStreak++;
      } else {
        tempStreak = 1;
      }
      
      previousDate = entryDate;
    }
    
    if (tempStreak > longestStreak) {
      longestStreak = tempStreak;
    }
  }

  // Calculate current streak (must include today or yesterday)
  const mostRecentEntry = entries[0].date;
  
  if (mostRecentEntry === today || mostRecentEntry === yesterday) {
    currentStreak = 1;
    let checkDate = mostRecentEntry;
    
    for (let i = 1; i < entries.length; i++) {
      const prev = new Date(checkDate);
      const curr = new Date(entries[i].date);
      const diffDays = (prev - curr) / (1000 * 60 * 60 * 24);
      
      if (diffDays === 1) {
        currentStreak++;
        checkDate = entries[i].date;
      } else {
        break;
      }
    }
  }

  // Update longest streak in profile
  await Profile.findOneAndUpdate(
    { user: userId },
    { 
      $set: { longestStreak: Math.max(longestStreak, currentStreak) },
      $inc: { totalCheckIns: 0 } // Will be updated separately
    }
  );

  return { 
    currentStreak, 
    longestStreak: Math.max(longestStreak, currentStreak) 
  };
};