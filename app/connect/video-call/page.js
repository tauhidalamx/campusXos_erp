'use client';

import React from 'react';
import SuiteSidebar from '../components/SuiteSidebar';
import { ConnectProvider } from '../ConnectContext';
import { Video, Mic, VideoOff, PhoneOff, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import '../connect.css';

export default function VideoCallPage() {
  return (
    <ConnectProvider>
      <div className="flex h-screen bg-brand-bg-primary text-brand-text-main overflow-hidden font-sans select-none relative" style={{ paddingLeft: '80px' }}>
        <SuiteSidebar />
        <div className="flex-1 flex flex-col p-4">
          <div className="flex-1 relative bg-slate-950 rounded-3xl overflow-hidden shadow-2xl border border-brand-border/60 flex items-center justify-center">
            <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=1200" alt="" className="w-full h-full object-cover filter brightness-90" />
            <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-xl px-4 py-2 rounded-2xl border border-white/10 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-bold text-white font-mono">Dr. Evelyn Sterling • HD 1080p</span>
            </div>

            <div className="absolute bottom-6 flex items-center gap-4 bg-black/70 backdrop-blur-2xl px-6 py-3 rounded-2xl border border-white/15 shadow-2xl">
              <button className="p-3 bg-white/10 text-white rounded-xl hover:bg-white/20 transition-all">
                <Mic className="w-4 h-4" />
              </button>
              <button className="p-3 bg-white/10 text-white rounded-xl hover:bg-white/20 transition-all">
                <Video className="w-4 h-4" />
              </button>
              <Link href="/connect/messages" className="px-6 py-3 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl shadow-lg transition-all flex items-center gap-2 text-xs">
                <PhoneOff className="w-4 h-4" />
                <span>Leave</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </ConnectProvider>
  );
}
