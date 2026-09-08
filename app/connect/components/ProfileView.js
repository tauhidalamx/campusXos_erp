'use client';

import React from 'react';
import { useConnect } from '../ConnectContext';
import { Award, BookOpen, Quote, Sparkles, MessageSquare, Bookmark, Layers } from 'lucide-react';

export default function ProfileView() {
  const { currentUser, posts } = useConnect();

  // Filter posts published by current user
  const userPosts = posts.filter(p => p.user_name === currentUser?.name);

  const stats = [
    { label: 'Publications', value: '4 papers', icon: BookOpen },
    { label: 'Citations', value: '18 citations', icon: Quote },
    { label: 'Social Nodes', value: `${userPosts.length} posts`, icon: Sparkles },
    { label: 'Communities', value: '6 joined', icon: Layers }
  ];

  return (
    <div className="w-full min-w-0 flex flex-col gap-6 text-left">
      
      {/* Profile Header Card */}
      {currentUser && (
        <div className="p-6 sm:p-7 bg-white border border-slate-200/90 rounded-3xl flex flex-col md:flex-row gap-6 items-center shadow-2xs min-w-0">
          <img 
            src={currentUser.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'} 
            alt={currentUser.name} 
            className="w-20 h-20 rounded-full object-cover border-2 border-indigo-600 shadow-md shrink-0" 
          />
          <div className="flex-1 flex flex-col text-center md:text-left min-w-0">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 truncate">{currentUser.name}</h2>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mt-1 min-w-0">
              <span className="text-xs font-semibold text-slate-500 truncate">{currentUser.email}</span>
              <span className="text-slate-300">•</span>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-0.5 rounded-full uppercase tracking-wide shrink-0 shadow-2xs">{currentUser.role}</span>
            </div>
            <p className="text-xs text-slate-600 mt-2 font-medium truncate">
              Department of <span className="text-slate-900 font-bold">{currentUser.dept || 'Computer Science & AI'}</span>
            </p>
          </div>
        </div>
      )}

      {/* Grid of Achievements and Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 min-w-0">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div 
              key={i} 
              className="bg-white border border-slate-200/90 p-5 rounded-2xl flex flex-col items-center justify-center text-center shadow-2xs min-w-0"
            >
              <Icon className="w-5 h-5 text-indigo-600 mb-2 shrink-0" />
              <span className="text-sm sm:text-base font-bold text-slate-900 leading-none truncate">{stat.value}</span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1.5 truncate">{stat.label}</span>
            </div>
          );
        })}
      </div>

      {/* Personal Node Streams (Posts Grid) */}
      <div className="flex flex-col gap-3">
        <span className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-1">Your Social Stream</span>
        
        {userPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {userPosts.map((post) => (
              <div 
                key={post.id}
                className="p-4 bg-white border border-slate-200/90 rounded-2xl flex flex-col text-left justify-between shadow-sm hover:border-brand-primary/40 transition-all"
              >
                <div>
                  <div className="flex justify-between items-center text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-2">
                    <span>{post.category || 'general'}</span>
                    <span>{new Date(post.created_at).toLocaleDateString()}</span>
                  </div>
                  <p className="text-xs font-semibold text-slate-800 line-clamp-3 leading-relaxed">
                    {post.content}
                  </p>
                </div>
                
                {/* Stats indicators */}
                <div className="flex gap-4 mt-4 text-[11px] text-slate-500 font-bold">
                  <span className="flex items-center gap-1 text-slate-500">
                    <Heart className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                    <span>{post.likes_count || 0}</span>
                  </span>
                  <span className="flex items-center gap-1 text-slate-500">
                    <MessageSquare className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                    <span>{post.comments?.length || 0}</span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center bg-white border border-slate-200 rounded-2xl text-slate-500 text-xs font-semibold shadow-sm">
            You haven't posted anything to CampusX Connect yet.
          </div>
        )}
      </div>

    </div>
  );
}
