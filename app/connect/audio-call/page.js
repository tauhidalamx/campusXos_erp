'use client';

import React from 'react';
import SuiteSidebar from '../components/SuiteSidebar';
import { ConnectProvider } from '../ConnectContext';
import { Phone, Mic, MicOff, PhoneOff, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import '../connect.css';

export default function AudioCallPage() {
  return (
    <ConnectProvider>
      <div className="flex h-screen bg-brand-bg-primary text-brand-text-main overflow-hidden font-sans select-none relative" style={{ paddingLeft: '80px' }}>
        <SuiteSidebar />
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
          <div className="w-32 h-32 rounded-full bg-brand-primary/20 border-4 border-brand-primary/40 flex items-center justify-center animate-pulse mb-6 shadow-2xl">
            <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=250" alt="" className="w-28 h-28 rounded-full object-cover" />
          </div>
          <h1 className="text-xl font-bold text-brand-text-main font-display">Dr. Raymond Park</h1>
          <p className="text-xs text-emerald-400 font-mono font-bold mt-1 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            256-bit Encrypted Voice Stream • 02:45
          </p>

          <div className="flex items-center gap-4 mt-8">
            <button className="p-4 rounded-2xl bg-brand-bg-secondary border border-brand-border/60 text-brand-text-main hover:bg-brand-primary/10 transition-all shadow-md">
              <Mic className="w-5 h-5" />
            </button>
            <Link href="/connect/messages" className="px-8 py-4 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-2xl shadow-xl transition-all flex items-center gap-2 text-xs">
              <PhoneOff className="w-4 h-4" />
              <span>End Call</span>
            </Link>
          </div>
        </div>
      </div>
    </ConnectProvider>
  );
}
