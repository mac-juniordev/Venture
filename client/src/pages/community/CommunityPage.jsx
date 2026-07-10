import React, { useState, useEffect } from 'react';
import { communityService } from '../../services/communityService';
import { 
  Users, 
  Code, 
  Palette, 
  Zap,
  Sparkles,
  Globe,
  Smartphone,
  Database,
  Cloud,
  Lock,
  MessageSquare
} from 'lucide-react';
import Spinner from '../../components/ui/Spinner';
import Avatar from '../../components/ui/Avatar';
import ReactionPicker from '../../components/shared/ReactionPicker';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

// Comment Section Component
const CommentSection = ({ targetType, targetId }) => {
  const [comments, setComments] = useState([]);
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (showComments) {
      fetchComments();
    }
  }, [showComments]);

  const fetchComments = async () => {
    try {
      const response = await communityService.getComments(targetType, targetId);
      setComments(response.data.data.comments);
    } catch (error) {}
  };

  const handleAddComment = async () => {
    if (!commentText.trim()) return;
    setSubmitting(true);
    try {
      const response = await communityService.addComment({
        targetType,
        targetId,
        content: commentText,
      });
      
      const newComment = response.data.data.comment;
      
      // Check if updating existing or adding new
      setComments(prev => {
        const existing = prev.findIndex(c => c._id === newComment._id);
        if (existing > -1) {
          const updated = [...prev];
          updated[existing] = newComment;
          return updated;
        }
        return [newComment, ...prev];
      });
      
      setCommentText('');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add comment');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await communityService.deleteComment(commentId);
      setComments(prev => prev.filter(c => c._id !== commentId));
      toast.success('Comment removed');
    } catch (error) {
      toast.error('Failed to delete');
    }
  };

  return (
    <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
      {/* Toggle Comments */}
      <button
        onClick={() => setShowComments(!showComments)}
        className="text-xs text-gray-500 dark:text-gray-400 hover:text-sky-500 dark:hover:text-sky-400 transition-colors flex items-center gap-1"
      >
        <MessageSquare className="w-3.5 h-3.5" />
        {comments.length > 0 ? `${comments.length} comment${comments.length !== 1 ? 's' : ''}` : 'Comment'}
      </button>

      {/* Comments List & Input */}
      {showComments && (
        <div className="mt-3 space-y-3">
          {/* Comment Input */}
          <div className="flex gap-2">
            <input
              type="text"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Encourage this builder..."
              maxLength={280}
              className="flex-1 px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-sky-400 dark:focus:border-sky-500 transition-colors"
              onKeyDown={(e) => e.key === 'Enter' && handleAddComment()}
            />
            <button
              onClick={handleAddComment}
              disabled={submitting || !commentText.trim()}
              className="px-3 py-2 bg-sky-400 hover:bg-sky-500 dark:bg-sky-500 dark:hover:bg-sky-600 text-white text-xs font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? '...' : 'Post'}
            </button>
          </div>
          <p className="text-[10px] text-gray-400 dark:text-gray-500">{commentText.length}/280</p>

          {/* Comments List */}
          {comments.length > 0 ? (
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {comments.map((comment) => (
                <div key={comment._id} className="flex gap-2 group">
                  <Avatar 
                    size="sm" 
                    src={comment.user?.avatar ? `http://localhost:5000${comment.user.avatar}` : null} 
                    alt={comment.user?.displayName || comment.user?.email} 
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <div className="flex items-baseline gap-2">
                        <span className="text-xs font-bold text-gray-900 dark:text-white">
                          {comment.user?.displayName || comment.user?.email?.split('@')[0]}
                        </span>
                        <span className="text-[10px] text-gray-400 dark:text-gray-500">
                          {new Date(comment.createdAt).toLocaleDateString('en-US', { 
                            month: 'short', day: 'numeric' 
                          })}
                        </span>
                      </div>
                      <button
                        onClick={() => handleDeleteComment(comment._id)}
                        className="text-gray-300 dark:text-gray-600 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all text-[10px]"
                      >
                        ✕
                      </button>
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-300 mt-0.5 break-words">
                      {comment.content}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-gray-400 dark:text-gray-500 italic py-2">
              No comments yet. Be the first to encourage this builder!
            </p>
          )}
        </div>
      )}
    </div>
  );
};

const CommunityPage = () => {
  const [loading, setLoading] = useState(true);
  const [feed, setFeed] = useState([]);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(null);

  useEffect(() => {
    fetchFeed();
  }, [page]);

  const fetchFeed = async () => {
    try {
      setLoading(true);
      const response = await communityService.getFeed(page);
      setFeed(response.data.data.feed);
      setPagination(response.data.data.pagination);
    } catch (error) {
      console.error('Failed to load feed');
    } finally {
      setLoading(false);
    }
  };

  const handleReactionAdded = (entryId, reaction) => {
    setFeed(prev => prev.map(entry => {
      if (entry._id === entryId) {
        const updatedReactions = reaction === null 
          ? entry.reactions.filter(r => r.user !== reaction?.user)
          : [...entry.reactions.filter(r => r.user !== reaction?.user), reaction];
        return { ...entry, reactions: updatedReactions, reactionCount: updatedReactions.length };
      }
      return entry;
    }));
  };

  const getMoodEmoji = (mood) => {
    const emojis = { great: '🌟', good: '👍', okay: '📍', struggling: '💪' };
    return emojis[mood] || '';
  };

  const getTechCategory = (note) => {
    if (!note) return null;
    const lower = note.toLowerCase();
    if (lower.includes('react') || lower.includes('vue') || lower.includes('angular') || lower.includes('frontend') || lower.includes('ui') || lower.includes('css') || lower.includes('html') || lower.includes('javascript')) return { icon: Code, label: 'Frontend', color: 'text-sky-500 dark:text-sky-400' };
    if (lower.includes('api') || lower.includes('backend') || lower.includes('node') || lower.includes('express') || lower.includes('database') || lower.includes('sql') || lower.includes('mongodb') || lower.includes('server')) return { icon: Database, label: 'Backend', color: 'text-emerald-500 dark:text-emerald-400' };
    if (lower.includes('design') || lower.includes('figma') || lower.includes('ux') || lower.includes('ui/ux') || lower.includes('prototype') || lower.includes('sketch')) return { icon: Palette, label: 'Design', color: 'text-purple-500 dark:text-purple-400' };
    if (lower.includes('mobile') || lower.includes('ios') || lower.includes('android') || lower.includes('flutter') || lower.includes('react native') || lower.includes('swift')) return { icon: Smartphone, label: 'Mobile', color: 'text-orange-500 dark:text-orange-400' };
    if (lower.includes('devops') || lower.includes('cloud') || lower.includes('aws') || lower.includes('deploy') || lower.includes('docker') || lower.includes('ci/cd')) return { icon: Cloud, label: 'DevOps', color: 'text-yellow-500 dark:text-yellow-400' };
    if (lower.includes('security') || lower.includes('auth') || lower.includes('encrypt')) return { icon: Lock, label: 'Security', color: 'text-red-500 dark:text-red-400' };
    return { icon: Code, label: 'Tech', color: 'text-gray-500 dark:text-gray-400' };
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">Builder Feed</h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
              See what builders are shipping. No idle chatter.
            </p>
          </div>
          <Link
            to="/check-in"
            className="px-4 py-2 bg-gradient-to-r from-sky-400 to-emerald-400 hover:from-sky-500 hover:to-emerald-500 text-white text-sm font-semibold rounded-xl transition-all duration-200 shadow-md"
          >
            Share Update
          </Link>
        </div>
      </motion.div>

      {/* Community Rules Banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-gradient-to-r from-sky-50 to-emerald-50 dark:from-sky-900/20 dark:to-emerald-900/20 rounded-2xl border border-sky-100 dark:border-sky-800 p-4 md:p-5"
      >
        <div className="flex items-start gap-3">
          <Sparkles className="w-5 h-5 text-sky-500 dark:text-sky-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-bold text-gray-900 dark:text-white mb-1">This is a builder's space.</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
              Share what you're building. Celebrate progress. Encourage fellow builders. 
              No memes, no idle chatter, no doom scrolling — just shipping and growth.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Feed */}
      {feed.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-12 text-center"
        >
          <div className="w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <Globe className="w-10 h-10 text-gray-400 dark:text-gray-500" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">The Feed is Quiet</h3>
          <p className="text-gray-500 dark:text-gray-400 text-sm mb-6 max-w-sm mx-auto">
            Nobody has shared an update yet. Be the first builder to ship and inspire the community!
          </p>
          <Link
            to="/check-in"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-sky-400 to-emerald-400 text-white font-semibold rounded-xl shadow-lg shadow-sky-200 dark:shadow-sky-900/30"
          >
            <Zap className="w-4 h-4" />
            Share Your Progress
          </Link>
        </motion.div>
      ) : (
        <div className="space-y-4">
          {feed.map((entry, index) => {
            const techCategory = getTechCategory(entry.note);
            const TechIcon = techCategory?.icon || Code;

            return (
              <motion.div
                key={entry._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-5 md:p-6 hover:border-sky-200 dark:hover:border-sky-700 transition-colors"
              >
                {/* Tech Category Badge */}
                {techCategory && entry.note && (
                  <div className="flex items-center gap-2 mb-3">
                    <TechIcon className={`w-4 h-4 ${techCategory.color}`} />
                    <span className={`text-xs font-medium ${techCategory.color}`}>
                      {techCategory.label}
                    </span>
                  </div>
                )}

                {/* User Info Row */}
                <div className="flex items-center gap-3 mb-3">
                  <Avatar
                    size="md"
                    src={entry.user?.avatar ? `http://localhost:5000${entry.user.avatar}` : null}
                    alt={entry.user?.displayName || entry.user?.email}
                  />
                  <div className="flex-1">
                    <p className="text-sm font-bold text-gray-900 dark:text-white">
                      {entry.user?.displayName || entry.user?.email?.split('@')[0]}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {new Date(entry.checkInTime).toLocaleDateString('en-US', { 
                        month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' 
                      })}
                      {entry.mood && <span className="ml-1.5">{getMoodEmoji(entry.mood)}</span>}
                    </p>
                  </div>
                </div>

                {/* Build Update */}
                {entry.note && (
                  <div className="mb-4 p-4 bg-gray-50 dark:bg-gray-700/30 rounded-xl">
                    <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                      {entry.note}
                    </p>
                  </div>
                )}

                {/* Reaction Bar */}
                <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-700">
                  <ReactionPicker
                    targetUser={entry.user._id}
                    targetType="checkin"
                    targetId={entry._id}
                    existingReactions={entry.reactions || []}
                    onReactionAdded={(reaction) => handleReactionAdded(entry._id, reaction)}
                  />
                </div>

                {/* Comments */}
                <CommentSection targetType="checkin" targetId={entry._id} />
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      {pagination && pagination.pages > 1 && (
        <div className="flex justify-center gap-2 pb-8">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-4 py-2 text-sm text-gray-500 dark:text-gray-400 hover:text-sky-500 disabled:opacity-30 transition-colors"
          >
            Previous
          </button>
          <span className="px-4 py-2 text-sm text-gray-400">{page} / {pagination.pages}</span>
          <button
            onClick={() => setPage(p => Math.min(pagination.pages, p + 1))}
            disabled={page === pagination.pages}
            className="px-4 py-2 text-sm text-gray-500 dark:text-gray-400 hover:text-sky-500 disabled:opacity-30 transition-colors"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default CommunityPage;