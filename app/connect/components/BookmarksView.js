'use client';

import React from 'react';
import { useConnect } from '../ConnectContext';
import PostCard from './PostCard';
import ResearchCard from './ResearchCard';
import { Bookmark, Sparkles } from 'lucide-react';

export default function BookmarksView() {
  const { posts, savedPostIds } = useConnect();

  // Filter posts that are saved by the current user
  const bookmarkedPosts = posts.filter(post => savedPostIds.has(post.id));

  return (
    <div className="w-full min-w-0 flex flex-col gap-6 text-left">
      <div className="flex justify-between items-center px-1 border-b border-slate-200 pb-3 mb-2">
        <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <Bookmark className="w-5 h-5 text-amber-500 fill-current" />
          Saved Social Nodes & Research
        </h2>
        <span className="text-[10px] font-bold px-2 py-0.5 bg-amber-50 text-amber-700 border border-amber-200 rounded-md font-mono">
          {bookmarkedPosts.length} saved
        </span>
      </div>

      <div className="flex flex-col gap-6 items-center">
        {bookmarkedPosts.length > 0 ? (
          bookmarkedPosts.map((post) => {
            // Render specific ResearchCard or standard PostCard
            if (post.category === 'research') {
              return <ResearchCard key={post.id} paper={post} />;
            }
            return <PostCard key={post.id} post={post} />;
          })
        ) : (
          <div className="text-center py-16 text-slate-500 flex flex-col items-center gap-3">
            <Bookmark className="w-12 h-12 text-slate-300" />
            <div>
              <span className="text-xs font-semibold block text-slate-700">Your Bookmarks folder is empty.</span>
              <span className="text-[10px] text-slate-400 font-medium mt-1.5 block">Pin postings, notes, or peer research articles to access them quickly here.</span>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
