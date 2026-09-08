'use client';

import React from 'react';
import { useConnect } from '../ConnectContext';
import Stories from './Stories';
import PostCard from './PostCard';
import ResearchCard from './ResearchCard';

export default function Feed() {
  const { posts, activeSubFeed, setActiveSubFeed } = useConnect();

  // Categories metadata
  const subFeedsList = [
    { id: 'all', label: 'All' },
    { id: 'student', label: 'Student Feed' },
    { id: 'faculty', label: 'Faculty Feed' },
    { id: 'research', label: 'Research' },
    { id: 'campus', label: 'Campus Updates' },
    { id: 'placement', label: 'Placement Info' },
    { id: 'club', label: 'Club boards' },
    { id: 'achievement', label: 'Trophy Board' }
  ];

  // Filter posts based on active category selection
  const filteredPosts = posts.filter(post => {
    if (activeSubFeed === 'all') return true;
    return post.category === activeSubFeed;
  });

  return (
    <div className="w-full min-w-0 flex flex-col gap-6 text-left">
      
      {/* Horizontal Stories bar */}
      <div className="w-full min-w-0 bg-white border border-slate-200/90 rounded-3xl p-4 shadow-xs">
        <Stories />
      </div>

      {/* Sub-feed selection navigation category bar */}
      <div className="w-full flex gap-2 overflow-x-auto py-1 px-0.5 story-tray-scrollbar">
        {subFeedsList.map((sub) => (
          <button
            key={sub.id}
            onClick={() => setActiveSubFeed(sub.id)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap border cursor-pointer shrink-0 ${
              activeSubFeed === sub.id
                ? 'bg-indigo-600 border-indigo-600 text-white font-extrabold shadow-sm'
                : 'bg-white border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            {sub.label}
          </button>
        ))}
      </div>

      {/* Posts streams */}
      <div className="flex flex-col gap-6 items-center w-full min-w-0">
        {filteredPosts.length > 0 ? (
          filteredPosts.map((post) => {
            // Render specific peer-reviewed ResearchCard or normal PostCard
            if (post.category === 'research') {
              return <ResearchCard key={post.id} paper={post} />;
            }
            return <PostCard key={post.id} post={post} />;
          })
        ) : (
          <div className="w-full max-w-[650px] p-16 text-center bg-white border border-slate-200/90 rounded-3xl text-slate-400 text-xs font-semibold shadow-xs">
            No updates or posts found under this feed category.
          </div>
        )}
      </div>

    </div>
  );
}
