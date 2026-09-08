'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useConnect } from '../ConnectContext';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Heart, Flame, Sparkles, Trophy } from 'lucide-react';

export default function Stories() {
  const { 
    currentUser,
    allStories, 
    activeStoryIndex, 
    setActiveStoryIndex,
    storyProgress, 
    setStoryProgress
  } = useConnect();

  const [storyUploaded, setStoryUploaded] = useState(false);
  const [userStory, setUserStory] = useState(null);
  const [floatingEmojis, setFloatingEmojis] = useState([]);
  const [replyText, setReplyText] = useState('');
  const [isPaused, setIsPaused] = useState(false);

  // Combine user story and other stories
  const displayStories = userStory ? [userStory, ...allStories] : allStories;

  // Story progression logic
  useEffect(() => {
    let timer;
    if (activeStoryIndex !== null && !isPaused) {
      timer = setInterval(() => {
        setStoryProgress(prev => {
          if (prev >= 100) {
            // Next story or close
            if (activeStoryIndex < displayStories.length - 1) {
              setActiveStoryIndex(activeStoryIndex + 1);
            } else {
              setActiveStoryIndex(null);
            }
            return 0;
          }
          return prev + 1.25;
        });
      }, 40);
    }
    return () => clearInterval(timer);
  }, [activeStoryIndex, isPaused, displayStories.length]);

  const handleStoryUpload = (e) => {
    const file = e.target.files[0];
    if (file && currentUser) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUserStory({
          userId: currentUser.id,
          userName: 'Your Story',
          userAvatar: currentUser.avatar,
          mediaUrl: reader.result,
          type: 'Personal Story',
          timestamp: 'Just now'
        });
        setStoryUploaded(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEmojiReaction = (emoji) => {
    // Generate particle positions
    const particles = Array.from({ length: 10 }).map((_, i) => ({
      id: `${Date.now()}-${i}-${Math.random()}`,
      emoji,
      left: Math.random() * 60 + 20,
      scale: Math.random() * 0.6 + 0.8,
      duration: Math.random() * 1.5 + 1.0,
      delay: Math.random() * 0.3
    }));

    setFloatingEmojis(prev => [...prev, ...particles]);
    
    // Clear particles
    setTimeout(() => {
      setFloatingEmojis(prev => prev.filter(p => !particles.find(pt => pt.id === p.id)));
    }, 2500);
  };

  const handleReplySubmit = (e) => {
    e.preventDefault();
    if (!replyText.trim()) return;
    setReplyText('');
    setIsPaused(false);
    
    // Quick success flash
    const triggerMsg = `Reply sent to ${displayStories[activeStoryIndex]?.userName}!`;
    alert(triggerMsg);
  };

  // Get gradient ring depending on story category
  const getGradientClass = (storyType) => {
    if (!storyType) return 'gradient-story-ring';
    if (storyType.includes('Faculty')) return 'gradient-story-ring-faculty';
    if (storyType.includes('Research')) return 'gradient-story-ring-research';
    return 'gradient-story-ring';
  };

  return (
    <div className="w-full">
      {/* Stories list slider */}
      <div className="flex gap-6 overflow-x-auto py-2 px-1 story-tray-scrollbar overflow-y-visible items-start">
        
        {/* Your Story button */}
        <div className="flex flex-col items-center shrink-0 w-[74px] cursor-pointer group">
          <label className="relative cursor-pointer group overflow-visible flex flex-col items-center">
            <input 
              type="file" 
              accept="image/*" 
              className="hidden" 
              onChange={handleStoryUpload} 
            />
            <div className={`story-avatar-circle transition-transform duration-200 group-hover:scale-105 overflow-visible ${
              userStory ? 'gradient-story-ring-active' : 'bg-slate-100'
            }`}>
              <div className="w-full h-full bg-white rounded-full p-[2px] relative overflow-hidden flex items-center justify-center shrink-0">
                <img 
                  src={currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'} 
                  alt="You" 
                  className="w-full h-full rounded-full object-cover shrink-0" 
                />
              </div>
              {!userStory && (
                <span className="absolute bottom-0 right-0 w-5 h-5 bg-indigo-600 text-white text-xs font-black rounded-full flex items-center justify-center border-2 border-white shadow-xs z-10 shrink-0">
                  +
                </span>
              )}
            </div>
            <div className="w-full mt-2 text-center">
              <span className="text-[11px] font-bold text-slate-700 block text-center line-clamp-2 break-words leading-tight">
                Your Story
              </span>
            </div>
          </label>
        </div>

        {/* Other users' stories */}
        {allStories.map((story, idx) => {
          const indexToSet = userStory ? idx + 1 : idx;
          const authorName = story.userName || story.user_name || 'Member';
          
          return (
            <button
              key={story.userId || idx}
              onClick={() => {
                setActiveStoryIndex(indexToSet);
                setStoryProgress(0);
              }}
              className="flex flex-col items-center shrink-0 w-[74px] bg-transparent border-none outline-none cursor-pointer group"
            >
              <div className={`story-avatar-circle transition-transform duration-200 group-hover:scale-105 shadow-2xs ${
                getGradientClass(story.type)
              }`}>
                <div className="w-full h-full bg-white rounded-full p-[2px] overflow-hidden flex items-center justify-center shrink-0">
                  <img 
                    src={story.userAvatar || story.user_avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'} 
                    alt={authorName} 
                    className="w-full h-full rounded-full object-cover shrink-0" 
                  />
                </div>
              </div>
              <div className="w-full mt-2 text-center">
                <span className="text-[11px] font-bold text-slate-600 group-hover:text-indigo-600 transition-colors block text-center line-clamp-2 break-words leading-tight">
                  {authorName}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Story Viewer Overlay Portal */}
      <AnimatePresence>
        {activeStoryIndex !== null && displayStories[activeStoryIndex] && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 backdrop-blur-xl flex items-center justify-center z-[100] p-0 md:p-6"
            onClick={(e) => {
              if (e.target.classList.contains('fixed')) {
                setActiveStoryIndex(null);
              }
            }}
          >
            <div className="relative w-full max-w-[420px] h-full md:h-[85vh] bg-[#071126] md:rounded-3xl overflow-hidden border border-white/5 shadow-2xl flex flex-col justify-between p-4">
              
              {/* Story Timer Progress Bars */}
              <div className="absolute top-3 left-3 right-3 flex gap-1 z-30">
                {displayStories.map((_, idx) => (
                  <div key={idx} className="h-1 flex-1 bg-white/20 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-brand-primary transition-all duration-75"
                      style={{ 
                        width: idx === activeStoryIndex 
                          ? `${storyProgress}%` 
                          : idx < activeStoryIndex 
                            ? '100%' 
                            : '0%' 
                      }}
                    />
                  </div>
                ))}
              </div>

              {/* Story Header */}
              <div className="flex justify-between items-center z-30 mt-4 px-2">
                <div className="flex items-center gap-3">
                  <img 
                    src={displayStories[activeStoryIndex].userAvatar} 
                    alt="" 
                    className="w-9 h-9 rounded-full object-cover border-2 border-brand-primary" 
                  />
                  <div className="flex flex-col text-left">
                    <span className="text-xs font-bold text-white">{displayStories[activeStoryIndex].userName}</span>
                    <span className="text-[9px] text-white/50">{displayStories[activeStoryIndex].type} • {displayStories[activeStoryIndex].timestamp}</span>
                  </div>
                </div>
                <button 
                  onClick={() => setActiveStoryIndex(null)}
                  className="text-white/80 hover:text-white hover:bg-white/10 p-1.5 rounded-full transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Floating Emoji Particles Layer */}
              <div className="absolute inset-0 pointer-events-none z-40 overflow-hidden">
                {floatingEmojis.map((particle) => (
                  <span
                    key={particle.id}
                    className="absolute text-3xl animate-float-up pointer-events-none select-none"
                    style={{
                      left: `${particle.left}%`,
                      bottom: '15%',
                      animationDuration: `${particle.duration}s`,
                      animationDelay: `${particle.delay}s`,
                      transform: `scale(${particle.scale})`
                    }}
                  >
                    {particle.emoji}
                  </span>
                ))}
              </div>

              {/* Media Body */}
              <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/40">
                <img 
                  src={displayStories[activeStoryIndex].mediaUrl} 
                  alt="Story content" 
                  className="w-full h-full object-cover" 
                />

                {/* Left touch navigation zone */}
                <button 
                  className="absolute left-0 top-16 bottom-24 w-1/4 z-20 cursor-pointer bg-transparent border-none outline-none"
                  onClick={() => {
                    if (activeStoryIndex > 0) {
                      setActiveStoryIndex(activeStoryIndex - 1);
                      setStoryProgress(0);
                    }
                  }}
                />
                
                {/* Right touch navigation zone */}
                <button 
                  className="absolute right-0 top-16 bottom-24 w-1/4 z-20 cursor-pointer bg-transparent border-none outline-none"
                  onClick={() => {
                    if (activeStoryIndex < displayStories.length - 1) {
                      setActiveStoryIndex(activeStoryIndex + 1);
                      setStoryProgress(0);
                    } else {
                      setActiveStoryIndex(null);
                    }
                  }}
                />
              </div>

              {/* Footer: Quick Reactions & Message input */}
              <div className="z-30 w-full flex flex-col gap-3 px-2 mb-4">
                
                {/* Quick Emoji Toggles */}
                <div className="flex justify-around items-center bg-black/50 backdrop-blur-md py-2 px-3 rounded-2xl border border-white/5">
                  {['❤️', '🙌', '😂', '😮', '😢', '🔥', '👏', '🎉'].map((emoji) => (
                    <button
                      key={emoji}
                      onClick={() => handleEmojiReaction(emoji)}
                      className="text-xl hover:scale-135 transition-all p-1 bg-transparent border-none cursor-pointer"
                    >
                      {emoji}
                    </button>
                  ))}
                </div>

                {/* Reply Form */}
                <form 
                  onSubmit={handleReplySubmit}
                  className="flex gap-2 items-center bg-black/50 backdrop-blur-md p-2 rounded-2xl border border-white/5"
                >
                  <input 
                    type="text" 
                    placeholder={`Reply to ${displayStories[activeStoryIndex].userName.split(' ')[0]}...`}
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    onFocus={() => setIsPaused(true)}
                    onBlur={() => setIsPaused(false)}
                    className="flex-1 min-w-0 bg-transparent border-none text-white outline-none text-xs placeholder-white/50 px-2 py-1 font-sans"
                  />
                  <button 
                    type="submit" 
                    className="text-brand-primary hover:text-white font-bold text-xs px-2.5 py-1 transition-all shrink-0 cursor-pointer"
                  >
                    Send
                  </button>
                </form>
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
