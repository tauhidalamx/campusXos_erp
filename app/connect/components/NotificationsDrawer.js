'use client';

import React from 'react';
import { useConnect } from '../ConnectContext';
import { Bell, Heart, Quote, MessageSquare, Briefcase, Plus, X } from 'lucide-react';

export default function NotificationsDrawer() {
  const { notifications, setNotifications } = useConnect();

  const handleClearAll = () => {
    setNotifications([]);
  };

  const getNotifIcon = (type) => {
    switch(type) {
      case 'like':
        return <Heart className="w-4 h-4 text-rose-500 fill-current" />;
      case 'cite':
        return <Quote className="w-4 h-4 text-indigo-600" />;
      case 'mention':
        return <MessageSquare className="w-4 h-4 text-cyan-600" />;
      case 'invite':
        return <Plus className="w-4 h-4 text-emerald-600" />;
      case 'placement':
        return <Briefcase className="w-4 h-4 text-amber-600" />;
      default:
        return <Bell className="w-4 h-4 text-slate-400" />;
    }
  };

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
  };

  return (
    <div className="w-full min-w-0 max-w-[720px] bg-white border border-slate-200/90 rounded-[20px] p-6 text-left shadow-sm">
      <div className="flex justify-between items-center border-b border-slate-200 pb-4 mb-4">
        <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <Bell className="w-5 h-5 text-brand-primary" />
          Social Notifications Desk
        </h2>
        <div className="flex gap-3">
          <button 
            onClick={markAllRead}
            className="text-xs font-bold text-brand-primary hover:underline bg-transparent border-none outline-none cursor-pointer"
          >
            Mark all read
          </button>
          <button 
            onClick={handleClearAll}
            className="text-xs font-bold text-slate-400 hover:text-slate-800 bg-transparent border-none outline-none cursor-pointer"
          >
            Clear all
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-3.5 max-h-[500px] overflow-y-auto pr-1 story-tray-scrollbar">
        {notifications.length > 0 ? (
          notifications.map((notif) => (
            <div 
              key={notif.id} 
              className={`p-3.5 px-4 rounded-2xl flex items-start justify-between gap-4 transition-all duration-150 ${
                notif.unread ? 'bg-indigo-50/70' : 'hover:bg-slate-50'
              }`}
            >
              <div className="flex items-start gap-3.5 min-w-0 flex-1">
                <div className="relative shrink-0">
                  <img 
                    src={notif.userAvatar} 
                    alt="" 
                    className="w-9 h-9 rounded-full object-cover border border-slate-200 shadow-2xs" 
                  />
                  <div className="absolute -bottom-1 -right-1 p-1 bg-white rounded-full border border-slate-200 flex items-center justify-center shadow-xs">
                    {getNotifIcon(notif.type)}
                  </div>
                </div>
                <div className="flex flex-col text-left min-w-0 flex-1 mt-0.5">
                  <p className="text-xs sm:text-[13px] font-bold text-slate-800 leading-snug break-words">
                    {notif.text}
                  </p>
                  <span className="text-[10px] font-semibold text-slate-400 mt-1">{notif.time}</span>
                </div>
              </div>

              {notif.unread && (
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-600 shrink-0 mt-1.5 shadow-2xs" />
              )}
            </div>
          ))
        ) : (
          <div className="text-center py-12 text-slate-400 flex flex-col items-center gap-3 font-medium">
            <Bell className="w-10 h-10 text-slate-300" />
            <span className="text-xs font-semibold text-slate-600">Your Notification center is currently empty.</span>
          </div>
        )}
      </div>

    </div>
  );
}
