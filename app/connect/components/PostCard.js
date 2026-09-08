'use client';

import React, { useState } from 'react';
import { useConnect } from '../ConnectContext';
import { 
  Heart, 
  MessageSquare, 
  Share2, 
  Bookmark, 
  FileText, 
  Download,
  Send
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function PostCard({ post }) {
  const { 
    currentUser, 
    handleLike, 
    handleCommentSubmit, 
    handleSavePost, 
    savedPostIds
  } = useConnect();

  const [showComments, setShowComments] = useState(false);
  const [commentInput, setCommentInput] = useState('');
  const [shared, setShared] = useState(false);

  const isLiked = post.likes?.includes(currentUser?.id);
  const isSaved = savedPostIds.has(post.id);

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

  const authorName = post.user_name || post.userName || 'CampusX Member';
  const authorAvatar = post.user_avatar || post.userAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150';
  const authorRole = post.user_role || post.userRole || 'Member';
  const authorDept = post.dept || post.userDept || 'Academic';

  return (
    <div 
      id={`post-${post.id}`}
      className="w-full min-w-0 bg-white border border-slate-200/90 rounded-3xl overflow-hidden flex flex-col transition-all duration-200 hover:border-slate-300 shadow-xs"
    >
      
      {/* Post Header */}
      <div className="p-5 pb-4 flex justify-between items-center border-b border-slate-100 min-w-0 gap-3">
        <div className="flex items-center gap-3.5 min-w-0 flex-1">
          <img 
            src={authorAvatar} 
            alt={authorName} 
            className="w-10 h-10 rounded-full object-cover border border-slate-100 shrink-0" 
          />
          <div className="flex flex-col text-left min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap min-w-0">
              <span className="text-sm font-bold text-slate-900 hover:text-indigo-600 transition-colors cursor-pointer truncate">
                {authorName}
              </span>
              <span className="text-[10px] text-slate-300">•</span>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-indigo-600 shrink-0">
                {post.category || 'campus'}
              </span>
            </div>
            <div className="flex items-center gap-1.5 mt-0.5 flex-wrap min-w-0">
              <span className="text-xs font-semibold text-slate-500 capitalize truncate">
                {authorRole}
              </span>
              <span className="text-[10px] text-slate-300">•</span>
              <span className="text-xs font-medium text-slate-400 truncate">
                {authorDept}
              </span>
            </div>
          </div>
        </div>
        <span className="text-xs font-mono text-slate-400 font-semibold shrink-0 pl-2 whitespace-nowrap">
          {formatTime(post.created_at)}
        </span>
      </div>

      {/* Post Content */}
      <div className="p-5 pt-4 text-left min-w-0">
        <p className="text-[14.5px] text-slate-800 leading-relaxed font-normal whitespace-pre-wrap break-words">
          {post.content}
        </p>
      </div>

      {/* Post Image/Video Rendering */}
      {post.media_url && (post.media_url.startsWith('http') || post.media_url.startsWith('data:') || post.media_url.startsWith('/')) && (
        <div className="w-full bg-slate-50 border-y border-slate-100 overflow-hidden flex items-center justify-center">
          {post.type === 'image' || post.media_url.match(/\.(jpeg|jpg|gif|png|webp)/i) ? (
            <img 
              src={post.media_url} 
              alt="Attachment" 
              className="w-full max-h-[420px] object-cover" 
              onError={(e) => { e.currentTarget.parentElement.style.display = 'none'; }}
            />
          ) : (
            <video 
              src={post.media_url} 
              controls 
              className="w-full max-h-[420px]" 
              onError={(e) => { e.currentTarget.parentElement.style.display = 'none'; }}
            />
          )}
        </div>
      )}

      {/* PDF Attachment Renderer */}
      {post.type === 'pdf' && post.pdf_url && (
        <div className="mx-5 mb-4 p-3 bg-slate-50 border border-slate-200/80 rounded-2xl flex items-center justify-between gap-3 min-w-0">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <div className="p-2 bg-rose-50 text-rose-600 rounded-xl shrink-0">
              <FileText className="w-5 h-5" />
            </div>
            <div className="flex flex-col text-left min-w-0 flex-1">
              <span className="text-xs font-bold text-slate-900 truncate">
                {post.pdf_url.split('/').pop()}
              </span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">PDF Document</span>
            </div>
          </div>
          <a 
            href={post.pdf_url} 
            download 
            className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all shrink-0"
          >
            <Download className="w-4 h-4" />
          </a>
        </div>
      )}

      {/* Action Buttons row - Clean, simple, uncluttered */}
      <div className="px-5 py-3 border-t border-slate-100 flex items-center justify-between gap-3 bg-white min-w-0">
        <div className="flex items-center gap-4 min-w-0">
          <button 
            onClick={() => handleLike(post.id)}
            className={`flex items-center gap-1.5 text-xs font-bold transition-all cursor-pointer shrink-0 ${
              isLiked 
                ? 'text-rose-600' 
                : 'text-slate-500 hover:text-rose-600'
            }`}
          >
            <Heart className={`w-4 h-4 shrink-0 ${isLiked ? 'fill-current text-rose-600' : ''}`} />
            <span>{post.likes_count || post.likes?.length || 0}</span>
          </button>

          <button 
            onClick={() => setShowComments(!showComments)}
            className={`flex items-center gap-1.5 text-xs font-bold transition-all cursor-pointer shrink-0 ${
              showComments 
                ? 'text-indigo-600' 
                : 'text-slate-500 hover:text-indigo-600'
            }`}
          >
            <MessageSquare className="w-4 h-4 text-slate-400 shrink-0" />
            <span>{post.comments?.length || 0}</span>
          </button>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {/* Share button */}
          <div className="relative shrink-0">
            <button 
              onClick={handleShare}
              className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-slate-50 rounded-lg transition-all cursor-pointer shrink-0"
              title="Share Link"
            >
              <Share2 className="w-4 h-4 shrink-0" />
            </button>
            <AnimatePresence>
              {shared && (
                <motion.span 
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 5 }}
                  className="absolute bottom-full mb-2 right-0 bg-slate-900 text-white text-[10px] font-bold py-1.5 px-3 rounded-lg whitespace-nowrap z-50 shadow-lg"
                >
                  Link Copied!
                </motion.span>
              )}
            </AnimatePresence>
          </div>

          <button 
            onClick={() => handleSavePost(post.id)}
            className={`p-1.5 rounded-lg transition-all cursor-pointer shrink-0 ${
              isSaved 
                ? 'text-amber-600' 
                : 'text-slate-400 hover:text-amber-600 hover:bg-slate-50'
            }`}
            title="Save Bookmark"
          >
            <Bookmark className={`w-4 h-4 shrink-0 ${isSaved ? 'fill-current' : ''}`} />
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
            className="border-t border-slate-100 bg-slate-50/50 overflow-hidden"
          >
            <div className="p-5 flex flex-col gap-4">
              
              {/* Comments Scroller */}
              <div className="flex flex-col gap-3 max-h-[220px] overflow-y-auto pr-1 story-tray-scrollbar">
                {post.comments && post.comments.length > 0 ? (
                  post.comments.map((comment, index) => (
                    <div key={index} className="flex items-start gap-3 text-left">
                      <img 
                        src={comment.user_avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'} 
                        alt="" 
                        className="w-7 h-7 rounded-full object-cover shrink-0 mt-0.5 border border-slate-200" 
                      />
                      <div className="flex-1 bg-white border border-slate-200/80 p-3 rounded-2xl min-w-0 shadow-2xs">
                        <span className="text-xs font-bold text-slate-900 block">{comment.user_name || 'Member'}</span>
                        <p className="text-xs text-slate-600 mt-1 leading-normal font-normal">
                          {comment.content}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <span className="text-slate-400 text-xs py-2 block text-center font-medium">No comments yet. Be the first to reply!</span>
                )}
              </div>

              {/* Input Form */}
              <form onSubmit={handleCommentFormSubmit} className="flex gap-2 items-center mt-1">
                <input 
                  type="text" 
                  placeholder="Write a comment..."
                  value={commentInput}
                  onChange={(e) => setCommentInput(e.target.value)}
                  className="flex-1 min-w-0 bg-white border border-slate-200 text-xs text-slate-800 placeholder-slate-400 p-2.5 px-3.5 rounded-xl outline-none focus:border-indigo-600 transition-all font-sans"
                />
                <button 
                  type="submit" 
                  className="bg-indigo-600 hover:bg-indigo-700 text-white p-2.5 px-3.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center shrink-0 cursor-pointer"
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
