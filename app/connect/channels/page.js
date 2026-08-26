'use client';

import React, { useState } from 'react';
import SuiteSidebar from '../components/SuiteSidebar';
import { ConnectProvider, useConnect } from '../ConnectContext';
import { Hash, Lock, Users, Plus, ShieldCheck, Search, MessageSquare } from 'lucide-react';
import Link from 'next/link';
import '../connect.css';

function ChannelsContent() {
  const { currentUser } = useConnect();
  const [search, setSearch] = useState('');

  const channels = [
    { id: 'ch_gen', name: 'general-campus', desc: 'Central university discussion & campus notices', members: 1528, isPrivate: false, category: 'Campus' },
    { id: 'ch_cs', name: 'cs-dept-forum', desc: 'Computer Science department faculty & student announcements', members: 480, isPrivate: false, category: 'Academic' },
    { id: 'ch_res', name: 'ai-research-lab', desc: 'Advanced AI & Quantum computing research publications', members: 86, isPrivate: true, category: 'Research' },
    { id: 'ch_place', name: 'placement-opportunities', desc: 'Corporate career drives, internships & recruitment notices', members: 920, isPrivate: false, category: 'Career' },
    { id: 'ch_sports', name: 'varsity-athletics', desc: 'Inter-university sports tournaments & athletic schedules', members: 310, isPrivate: false, category: 'Sports' }
  ];

  const filtered = channels.filter(c => c.name.toLowerCase().includes(search.toLowerCase()) || c.desc.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="flex-1 flex flex-col p-6 overflow-y-auto max-w-[1600px] mx-auto w-full gap-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-brand-border/40">
        <div>
          <h1 className="text-2xl font-display font-black text-brand-text-main flex items-center gap-2">
            Enterprise Channels
            <ShieldCheck className="w-5 h-5 text-emerald-500" />
          </h1>
          <p className="text-xs text-brand-text-muted mt-1">Official authenticated department & community discussion spaces</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-brand-bg-secondary border border-brand-border/60 rounded-xl px-3.5 py-2 gap-2 shadow-sm focus-within:border-brand-primary">
            <Search className="w-4 h-4 text-brand-text-muted" />
            <input 
              type="text" 
              placeholder="Search channels..." 
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="bg-transparent border-none text-xs text-brand-text-main outline-none w-48 placeholder-brand-text-muted"
            />
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map(ch => (
          <div key={ch.id} className="p-5 bg-brand-bg-secondary/60 backdrop-blur-xl border border-brand-border/60 rounded-2xl flex flex-col justify-between gap-4 hover:border-brand-primary/40 transition-all shadow-sm group">
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2 text-brand-primary font-bold text-sm font-mono">
                  {ch.isPrivate ? <Lock className="w-4 h-4 text-rose-400" /> : <Hash className="w-4 h-4" />}
                  <span>{ch.name}</span>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-brand-primary/10 text-brand-primary border border-brand-primary/20">
                  {ch.category}
                </span>
              </div>
              <p className="text-xs text-brand-text-muted line-clamp-2">{ch.desc}</p>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-brand-border/30 text-xs">
              <span className="text-[11px] text-brand-text-muted flex items-center gap-1 font-mono">
                <Users className="w-3.5 h-3.5" />
                {ch.members} members
              </span>
              <Link 
                href="/connect/messages"
                className="px-3 py-1.5 bg-brand-primary/10 hover:bg-brand-primary hover:text-white text-brand-primary rounded-xl font-bold transition-all text-xs flex items-center gap-1.5"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                Open Channel
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ChannelsPage() {
  return (
    <ConnectProvider>
      <div className="flex h-screen bg-brand-bg-primary text-brand-text-main overflow-hidden font-sans select-none relative" style={{ paddingLeft: '80px' }}>
        <SuiteSidebar />
        <ChannelsContent />
      </div>
    </ConnectProvider>
  );
}
