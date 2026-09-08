'use client';

import React from 'react';
import { Phone } from 'lucide-react';

/**
 * SidebarContactItem Component
 * Adheres to the strict 3-column architecture:
 * [Avatar (flex-shrink-0)] [Name + Subtitle (min-w-0 flex-1)] [Timestamp + Unread Badge (flex-shrink-0 text-right)]
 * Eliminates preview snippet collision against unread count badges and timestamps.
 */
export default function SidebarContactItem({ 
  thread, 
  isSelected, 
  onSelect, 
  onQuickCall 
}) {
  return (
    <div
      onClick={() => onSelect(thread.id)}
      className={`group w-full p-2.5 px-3 rounded-2xl cursor-pointer transition-all duration-150 flex items-center justify-between gap-3 min-w-0 ${
        isSelected
          ? 'bg-indigo-50 text-indigo-950 font-bold border border-indigo-200/80 shadow-xs'
          : 'hover:bg-slate-100/80 text-slate-700 border border-transparent'
      }`}
    >
      {/* 3-Column Strict Grid / Flex Container */}
      <div className="flex items-center gap-3 min-w-0 flex-1">
        
        {/* Column 1: Avatar (flex-shrink-0) */}
        <div className="relative shrink-0 w-10 h-10">
          <img 
            src={thread.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'} 
            alt={thread.name} 
            className="w-10 h-10 rounded-full object-cover shrink-0 border border-slate-200" 
          />
          <span className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-white ${
            thread.online ? 'bg-emerald-500 shadow-2xs' : 'bg-slate-300'
          }`} />
        </div>

        {/* Column 2: Name + Preview Subtitle (min-w-0 flex-1) */}
        <div className="flex-1 min-w-0 flex flex-col justify-center text-left">
          <div className="flex items-center justify-between gap-1.5 min-w-0">
            <h3 className="text-xs font-bold text-slate-900 truncate">
              {thread.name}
            </h3>
          </div>
          <p className="text-[11px] text-slate-500 truncate font-medium mt-0.5 min-w-0">
            {thread.lastMsg || 'Tap to open chat...'}
          </p>
        </div>

        {/* Column 3: Timestamp + Unread Badge (flex-shrink-0 text-right) */}
        <div className="flex flex-col items-end justify-center shrink-0 min-w-[54px] text-right pl-1">
          <span className="text-[10px] text-slate-400 font-mono font-semibold whitespace-nowrap">
            {thread.time || (thread.online ? 'Active' : 'Offline')}
          </span>
          <div className="h-4 flex items-center justify-end mt-0.5">
            {thread.unread > 0 ? (
              <span className="px-1.5 py-0.2 rounded-full bg-indigo-600 text-white text-[9.5px] font-extrabold font-mono shrink-0 shadow-2xs leading-tight">
                {thread.unread}
              </span>
            ) : null}
          </div>
        </div>

      </div>

      {/* Quick Audio Call Trigger on Hover */}
      {onQuickCall && (
        <button
          onClick={(e) => { 
            e.stopPropagation(); 
            onQuickCall(thread, 'audio'); 
          }}
          className="w-7 h-7 rounded-lg text-slate-400 opacity-0 group-hover:opacity-100 hover:bg-white hover:text-indigo-600 hover:border-slate-200 border border-transparent transition-all flex items-center justify-center cursor-pointer shrink-0 shadow-2xs"
          title="Quick Audio Call"
        >
          <Phone className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
}
