import React, { useState } from 'react';
import { communityService } from '../../services/communityService';
import toast from 'react-hot-toast';

const reactions = [
  { type: 'fire', emoji: '🔥', label: 'Fire' },
  { type: 'muscle', emoji: '💪', label: 'Strong' },
  { type: 'party', emoji: '🎉', label: 'Celebrate' },
  { type: 'rocket', emoji: '🚀', label: 'Growth' },
  { type: 'clap', emoji: '👏', label: 'Respect' },
  { type: 'star', emoji: '⭐', label: 'Star' },
];

const ReactionPicker = ({ targetUser, targetType, targetId, existingReactions = [], onReactionAdded }) => {
  const [showPicker, setShowPicker] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleReaction = async (reactionType) => {
    setLoading(true);
    try {
      const response = await communityService.addReaction({
        targetUser,
        targetType,
        targetId,
        reaction: reactionType,
      });
      
      setShowPicker(false);
      
      if (onReactionAdded) {
        onReactionAdded(response.data.data.reaction);
      }
      
      if (response.data.data.reaction === null) {
        toast.success('Reaction removed');
      }
    } catch (error) {
      toast.error('Failed to react');
    } finally {
      setLoading(false);
    }
  };

  // Count reactions by type
  const reactionCounts = {};
  existingReactions.forEach(r => {
    reactionCounts[r.reaction] = (reactionCounts[r.reaction] || 0) + 1;
  });

  return (
    <div className="relative">
      {/* Reaction Buttons Row */}
      <div className="flex items-center gap-1">
        {reactions.map((r) => {
          const count = reactionCounts[r.type] || 0;
          if (count === 0) return null;
          return (
            <button
              key={r.type}
              onClick={() => handleReaction(r.type)}
              disabled={loading}
              className="px-2 py-1 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full text-xs transition-colors flex items-center gap-1"
            >
              <span>{r.emoji}</span>
              <span className="text-gray-500 dark:text-gray-400">{count}</span>
            </button>
          );
        })}
        
        {/* Add Reaction Button */}
        <button
          onClick={() => setShowPicker(!showPicker)}
          disabled={loading}
          className="px-2 py-1 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full text-xs transition-colors text-gray-500 dark:text-gray-400"
        >
          +
        </button>
      </div>

      {/* Reaction Picker Dropdown */}
      {showPicker && (
        <div className="absolute bottom-full left-0 mb-2 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-600 shadow-lg p-2 flex gap-1 z-50">
          {reactions.map((r) => (
            <button
              key={r.type}
              onClick={() => handleReaction(r.type)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-lg transition-colors"
              title={r.label}
            >
              {r.emoji}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReactionPicker;