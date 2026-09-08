'use client';

import React, { useState } from 'react';
import { Search, Compass, Sparkles, Flame, Trophy, Quote } from 'lucide-react';
import { useConnect } from '../ConnectContext';

export default function ExploreView() {
  const { posts, setActiveView } = useConnect();
  const [query, setQuery] = useState('');

  // Filter posts with attachments to make an Instagram-style grid
  const gridPosts = posts.filter(p => p.media_url).slice(0, 6);

  const trendingCategories = [
    { name: 'Quantum Engineering', count: '14 research papers', icon: Sparkles },
    { name: 'Blockchain Hackathon', count: '32 students registered', icon: Trophy },
    { name: 'AI Fine-Tuning', count: '8 collaborations active', icon: Flame },
    { name: 'Neural Networks', count: '15 citations', icon: Quote }
  ];

  return (
    <div className="w-full min-w-0 flex flex-col gap-6 text-left">
      
      {/* Search Bar Container */}
      <div className="flex items-center bg-white border border-slate-200/90 rounded-2xl px-4 py-3.5 gap-3.5 shadow-2xs focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/10 transition-all">
        <Search className="w-5 h-5 text-slate-400 shrink-0 pointer-events-none" />
        <input 
          type="text" 
          placeholder="Search research topics, students, faculty, or tags..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-1 min-w-0 bg-transparent border-none text-xs sm:text-sm text-slate-800 outline-none placeholder-slate-400 font-semibold"
        />
      </div>

      {/* Grid Highlights Banner */}
      <div className="flex flex-col gap-3.5">
        <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest pl-1">Discover Campus Activity</span>
        
        {gridPosts.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3.5">
            {gridPosts.map((post) => (
              <div 
                key={post.id}
                onClick={() => setActiveView('home')}
                className="aspect-square bg-slate-100 border border-slate-200/90 rounded-3xl overflow-hidden relative group cursor-pointer transition-all duration-200 hover:border-indigo-500 shadow-2xs"
              >
                <img 
                  src={post.media_url} 
                  alt="" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-all duration-350" 
                />
                <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-4 transition-all duration-200">
                  <span className="text-xs font-extrabold text-white">View Post</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center bg-white border border-slate-200/90 rounded-3xl text-slate-400 text-xs font-semibold shadow-2xs">
            No media attachments found to populate the media explorer.
          </div>
        )}
      </div>

      {/* Trending Categories Section */}
      <div className="flex flex-col gap-3.5 min-w-0">
        <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest pl-1">Hot Trends Right Now</span>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 min-w-0">
          {trendingCategories.map((cat, i) => {
            const Icon = cat.icon;
            return (
              <div 
                key={i} 
                className="p-4.5 px-5 bg-white border border-slate-200/90 rounded-2xl flex items-center gap-4 hover:border-indigo-300 transition-all duration-150 cursor-pointer shadow-2xs min-w-0"
              >
                <div className="p-3 bg-indigo-50 border border-indigo-200 text-indigo-700 rounded-xl shrink-0 shadow-2xs">
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex flex-col text-left min-w-0 flex-1">
                  <span className="text-xs sm:text-[13px] font-bold text-slate-900 truncate">{cat.name}</span>
                  <span className="text-[10.5px] font-semibold text-slate-500 mt-1 truncate">{cat.count}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
