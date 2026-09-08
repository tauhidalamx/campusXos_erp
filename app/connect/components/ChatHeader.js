'use client';

import React from 'react';
import { Phone, Video, Info, ShieldCheck } from 'lucide-react';

/**
 * ChatHeader Component
 * Fixes action button overlap and contact collision.
 * Enforces min-w-0 and truncate across contact titles and status indicators.
 */
export default function ChatHeader({ 
  thread, 
  onStartCall, 
  onToggleDetails, 
  showDetails 
}) {
  if (!thread) return null;

  return (
    <div className="px-5 py-3.5 border-b border-slate-200/90 bg-white/95 backdrop-blur-xl flex justify-between items-center gap-4 min-w-0 shadow-2xs shrink-0">
      
      {/* Contact Profile Info Container with flex-1 min-w-0 */}
      <div className="flex items-center gap-3.5 min-w-0 flex-1">
        <div className="relative shrink-0 w-10 h-10">
          <img 
            src={thread.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'} 
            alt={thread.name} 
            className="w-10 h-10 rounded-full object-cover border border-slate-200 shrink-0" 
          />
          <span className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-white ${
            thread.online ? 'bg-emerald-500 shadow-2xs' : 'bg-slate-300'
          }`} />
        </div>

        <div className="flex flex-col min-w-0 flex-1 text-left">
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-1.5 truncate">
            <span className="truncate">{thread.name}</span>
            <ShieldCheck className="w-4 h-4 text-indigo-600 shrink-0" />
          </h2>
          <div className="flex items-center gap-1.5 text-xs text-slate-500 min-w-0 mt-0.5">
            <span className="truncate max-w-[140px] sm:max-w-[200px] font-medium">
              {thread.role || 'Member'}
            </span>
            <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${
              thread.online ? 'bg-emerald-500' : 'bg-slate-300'
            }`} />
            <span className={`font-bold truncate shrink-0 ${
              thread.online ? 'text-emerald-600' : 'text-slate-400'
            }`}>
              {thread.status || (thread.online ? 'Active Now' : 'Offline')}
            </span>
          </div>
        </div>
      </div>

      {/* Action Calling Group with Standardized Touch Targets */}
      <div className="flex items-center gap-2 shrink-0">
        {/* Audio Call Button */}
        <button
          onClick={() => onStartCall(thread, 'audio')}
          className="h-10 w-10 bg-slate-50 border border-slate-200/90 hover:bg-indigo-50 hover:border-indigo-200 text-slate-700 hover:text-indigo-600 rounded-xl transition-all flex items-center justify-center cursor-pointer shadow-xs"
          title="Start Audio Call"
        >
          <Phone className="w-4 h-4 shrink-0" />
        </button>

        {/* Video Call Button with Explicit Sizing */}
        <button
          onClick={() => onStartCall(thread, 'video')}
          className="h-10 px-3.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition-all cursor-pointer shadow-sm shadow-indigo-500/20 flex items-center gap-2 text-xs font-bold shrink-0 whitespace-nowrap"
          title="Start Video Call"
        >
          <Video className="w-4 h-4 shrink-0" />
          <span className="hidden sm:inline">Video Call</span>
        </button>

        {/* Detail Panel Toggle */}
        <button
          onClick={onToggleDetails}
          className={`h-10 w-10 border rounded-xl transition-all flex items-center justify-center cursor-pointer shadow-xs shrink-0 ${
            showDetails 
              ? 'bg-indigo-50 border-indigo-200 text-indigo-600' 
              : 'bg-slate-50 border-slate-200/90 text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`}
          title="Toggle conversation details"
        >
          <Info className="w-4 h-4 shrink-0" />
        </button>
      </div>

    </div>
  );
}
