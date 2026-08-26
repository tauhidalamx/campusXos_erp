'use client';

import React, { useState } from 'react';
import { useConnect } from '../ConnectContext';
import { 
  Heart, 
  MessageSquare, 
  Share2, 
  Bookmark, 
  Sparkles, 
  FileText, 
  Download,
  Calendar,
  Send,
  Trophy,
  ExternalLink
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function PostCard({ post }) {
  const { 
    currentUser, 
    handleLike, 
    handleCommentSubmit, 
    handleSavePost, 
    savedPostIds, 
    aiSummaries, 
    summarizingPostId, 
    runAiSummary 
  } = useConnect();

  const [showComments, setShowComments] = useState(false);
  const [commentInput, setCommentInput] = useState('');
  const [shared, setShared] = useState(false);

  const isLiked = post.likes?.includes(currentUser?.id);
  const isSaved = savedPostIds.has(post.id);
  const hasSummary = !!aiSummaries[post.id];
  const isSummarizing = summarizingPostId === post.id;

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(`${window.location.origin}/connect#post-${post.id}`);
      setShared(true);
      setTimeout(() => setShared(false), 2000);
    }
  };

  const formatTime = (isoString) => {
    if (!isoString) return 'Just now';
    const date = new Date(isoString);
    const now = new Date();
    const diffMs = now - date;
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHr = Math.floor(diffMin / 60);

    if (diffSec < 60) return 'Just now';
    if (diffMin < 60) return `${diffMin}m ago`;
    if (diffHr < 24) return `${diffHr}h ago`;
    return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  };

  const handleCommentFormSubmit = (e) => {
    e.preventDefault();
    if (!commentInput.trim()) return;
    handleCommentSubmit(post.id, commentInput);
    setCommentInput('');
  };

  // Get specific styles/badges per post type
  const getBadgeStyle = (category) => {
    switch(category) {
      case 'faculty':
        return 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20';
      case 'research':
        return 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20';
      case 'placement':
        return 'bg-amber-500/10 text-amber-400 border border-amber-500/20';
      case 'club':
        return 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20';
      case 'achievement':
        return 'bg-rose-500/10 text-rose-400 border border-rose-500/20';
      default:
        return 'bg-slate-500/10 text-slate-400 border border-slate-500/20';
    }
  };

  return (
    <div 
      id={`post-${post.id}`}
      className="w-full max-w-[650px] bg-[#102043]/40 border border-white/5 rounded-[20px] overflow-hidden flex flex-col transition-all duration-300 hover:border-white/10"
    >
      
      {/* Post Header */}
      <div className="p-6 pb-4 flex justify-between items-center border-b border-white/5">
        <div className="flex items-center gap-3.5">
          <img 
            src={post.user_avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'} 
            alt={post.user_name} 
            className="w-10 h-10 rounded-full object-cover border border-white/10" 
          />
          <div className="flex flex-col text-left">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-bold text-white hover:underline cursor-pointer">{post.user_name}</span>
              <span className="text-[10px] text-white/40">•</span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider ${getBadgeStyle(post.category)}`}>
                {post.category || 'campus'}
              </span>
            </div>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="text-[11px] font-semibold text-slate-400">{post.user_role}</span>
              <span className="text-[10px] text-white/30">•</span>
              <span className="text-[11px] font-medium text-slate-500">{post.dept || 'Academic'}</span>
            </div>
          </div>
        </div>
        <span className="text-[11px] font-mono text-slate-500 font-semibold">{formatTime(post.created_at)}</span>
      </div>

      {/* Post Content */}
      <div className="p-6 pt-4 text-left">
        <p className="text-[15px] text-white/90 leading-relaxed font-normal whitespace-pre-wrap">
          {post.content}
        </p>
      </div>

      {/* Post Image/Video Rendering */}
      {post.media_url && (
        <div className="w-full bg-black/30 border-y border-white/5 overflow-hidden flex items-center justify-center">
          {post.type === 'image' || post.media_url.match(/\.(jpeg|jpg|gif|png)/i) ? (
            <img 
              src={post.media_url} 
              alt="Attachment" 
              className="w-full max-h-[360px] object-cover" 
            />
          ) : (
            <video 
              src={post.media_url} 
              controls 
              className="w-full max-h-[360px]" 
            />
          )}
        </div>
      )}

      {/* PDF Attachment Renderer */}
      {post.type === 'pdf' && post.pdf_url && (
        <div className="mx-6 mb-5 p-4 bg-[#0B1736]/60 border border-white/5 rounded-2xl flex items-center justify-between">
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="p-2.5 bg-rose-500/10 border border-rose-500/20 text-rose-500 rounded-xl">
              <FileText className="w-6 h-6" />
            </div>
            <div className="flex flex-col text-left min-w-0">
              <span className="text-xs font-bold text-white truncate max-w-[240px] md:max-w-[320px]">
                {post.pdf_url.split('/').pop()}
              </span>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mt-0.5">PDF Document</span>
            </div>
          </div>
          <a 
            href={post.pdf_url} 
            download 
            className="p-2.5 bg-[#102043] border border-white/5 text-slate-400 hover:text-white rounded-xl transition-all"
          >
            <Download className="w-4 h-4" />
          </a>
        </div>
      )}

      {/* Accordion AI Summary drawer inside card */}
      <AnimatePresence>
        {hasSummary && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="mx-6 mb-5 overflow-hidden"
          >
            <div className="p-4 bg-brand-primary/5 border border-brand-primary/20 rounded-2xl text-left">
              <div className="flex items-center gap-2 mb-2 text-brand-primary">
                <Sparkles className="w-4 h-4 text-brand-primary" />
                <span className="text-[11px] font-bold uppercase tracking-wider">CampusX AI Digest</span>
              </div>
              <div className="text-xs text-white/80 leading-relaxed whitespace-pre-wrap font-medium">
                {aiSummaries[post.id]}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Action Buttons row */}
      <div className="px-6 py-4 border-t border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => handleLike(post.id)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
              isLiked 
                ? 'bg-rose-500/10 border-rose-500/20 text-rose-500' 
                : 'bg-transparent border-transparent text-slate-400 hover:text-white hover:bg-white/[0.03]'
            }`}
          >
            <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
            <span>{post.likes_count || 0}</span>
          </button>

          <button 
            onClick={() => setShowComments(!showComments)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
              showComments 
                ? 'bg-brand-primary/10 border-brand-primary/20 text-brand-primary' 
                : 'bg-transparent border-transparent text-slate-400 hover:text-white hover:bg-white/[0.03]'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>{post.comments?.length || 0}</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          {/* AI Summary toggle */}
          <button
            onClick={() => runAiSummary(post.id)}
            disabled={isSummarizing}
            className={`px-3 py-1.5 bg-brand-primary/10 border border-brand-primary/20 text-brand-primary hover:bg-brand-primary hover:text-white transition-all text-xs font-bold rounded-xl flex items-center gap-1.5 ${
              isSummarizing ? 'animate-pulse' : ''
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isSummarizing ? 'Analyzing...' : 'AI Summary'}</span>
          </button>

          {/* Share copied to clipboard pop */}
          <div className="relative">
            <button 
              onClick={handleShare}
              className="p-2 text-slate-400 hover:text-white hover:bg-white/[0.03] rounded-xl transition-all border border-transparent"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <AnimatePresence>
              {shared && (
                <motion.span 
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 5 }}
                  className="absolute bottom-full mb-2 right-0 bg-[#071126] text-white border border-white/10 text-[9px] font-bold py-1 px-2.5 rounded-lg whitespace-nowrap z-50 shadow-2xl"
                >
                  Link Copied!
                </motion.span>
              )}
            </AnimatePresence>
          </div>

          <button 
            onClick={() => handleSavePost(post.id)}
            className={`p-2 rounded-xl transition-all border ${
              isSaved 
                ? 'bg-amber-500/10 border-amber-500/20 text-amber-500' 
                : 'bg-transparent border-transparent text-slate-400 hover:text-white hover:bg-white/[0.03]'
            }`}
          >
            <Bookmark className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Nested Comments section */}
      <AnimatePresence>
        {showComments && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t border-white/5 bg-[#0B1736]/30 overflow-hidden"
          >
            <div className="p-6 flex flex-col gap-4">
              
              {/* Comments Scroller */}
              <div className="flex flex-col gap-3.5 max-h-[200px] overflow-y-auto pr-1">
                {post.comments && post.comments.length > 0 ? (
                  post.comments.map((comment, index) => (
                    <div key={index} className="flex items-start gap-3 text-left">
                      <img 
                        src={comment.user_avatar} 
                        alt="" 
                        className="w-7.5 h-7.5 rounded-full object-cover shrink-0 mt-0.5 border border-white/10" 
                      />
                      <div className="flex-1 bg-[#102043]/30 border border-white/5 p-3 rounded-2xl min-w-0">
                        <span className="text-xs font-bold text-white block">{comment.user_name}</span>
                        <p className="text-xs text-slate-300 mt-1 leading-normal font-normal">
                          {comment.content}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <span className="text-slate-500 text-xs py-3 block text-center font-semibold">No comments yet. Be the first to reply!</span>
                )}
              </div>

              {/* Input Form */}
              <form onSubmit={handleCommentFormSubmit} className="flex gap-2.5 items-center mt-2">
                <input 
                  type="text" 
                  placeholder="Add a comment..."
                  value={commentInput}
                  onChange={(e) => setCommentInput(e.target.value)}
                  className="flex-1 bg-[#0B1736] border border-white/5 text-xs text-white placeholder-slate-500 p-3 rounded-xl outline-none focus:border-brand-primary/40"
                />
                <button 
                  type="submit" 
                  className="bg-brand-primary hover:bg-brand-primary-hover text-white py-3 px-4 rounded-xl text-xs font-bold transition-all shadow-md flex items-center justify-center shrink-0"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>

            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
