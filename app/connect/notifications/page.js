'use client';

import React from 'react';
import SuiteSidebar from '../components/SuiteSidebar';
import { ConnectProvider, useConnect } from '../ConnectContext';
import { Bell, ShieldCheck, Check } from 'lucide-react';
import '../connect.css';

function NotificationsContent() {
  const { notifications } = useConnect();

  return (
    <div className="flex-1 p-6 overflow-y-auto max-w-[1400px] mx-auto w-full flex flex-col gap-6">
      <div className="pb-4 border-b border-brand-border/40">
        <h1 className="text-2xl font-display font-black text-brand-text-main flex items-center gap-2">
          Notifications Stream
          <Bell className="w-5 h-5 text-brand-primary" />
        </h1>
        <p className="text-xs text-brand-text-muted mt-1">Authenticated system events, mentions, research citations, and meeting alerts</p>
      </div>

      <div className="flex flex-col gap-3">
        {notifications.map(n => (
          <div key={n.id} className="p-4 bg-brand-bg-secondary/60 backdrop-blur-xl border border-brand-border/60 rounded-2xl flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-3.5">
              <img src={n.userAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'} alt="" className="w-10 h-10 rounded-full object-cover border border-brand-border/40" />
              <div>
                <p className="text-xs font-bold text-brand-text-main">{n.text}</p>
                <span className="text-[10px] text-brand-text-muted font-mono">{n.time}</span>
              </div>
            </div>
            {n.unread && <span className="w-2.5 h-2.5 rounded-full bg-brand-primary animate-pulse" />}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function NotificationsPage() {
  return (
    <ConnectProvider>
      <div className="flex h-screen bg-brand-bg-primary text-brand-text-main overflow-hidden font-sans select-none relative" style={{ paddingLeft: '80px' }}>
        <SuiteSidebar />
        <NotificationsContent />
      </div>
    </ConnectProvider>
  );
}
