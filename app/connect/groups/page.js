'use client';

import React from 'react';
import SuiteSidebar from '../components/SuiteSidebar';
import { ConnectProvider } from '../ConnectContext';
import { Users, Shield, Award, MessageSquare } from 'lucide-react';
import Link from 'next/link';
import '../connect.css';

export default function GroupsPage() {
  const groups = [
    { id: 'g1', name: 'Computer Science Faculty HOD Council', role: 'Faculty & HOD', members: 42, active: 'Active Now' },
    { id: 'g2', name: 'Academic Senate & Curriculum Review', role: 'Deans & Officers', members: 28, active: 'Meeting Today' },
    { id: 'g3', name: 'Varsity AI Research Group', role: 'Research Staff', members: 64, active: '3 new papers' },
    { id: 'g4', name: 'Student Placement Committee', role: 'Students & Officers', members: 110, active: 'Active Now' }
  ];

  return (
    <ConnectProvider>
      <div className="flex h-screen bg-brand-bg-primary text-brand-text-main overflow-hidden font-sans select-none relative" style={{ paddingLeft: '80px' }}>
        <SuiteSidebar />
        <div className="flex-1 p-6 overflow-y-auto max-w-[1600px] mx-auto w-full flex flex-col gap-6">
          <div className="flex justify-between items-center pb-4 border-b border-brand-border/40">
            <div>
              <h1 className="text-2xl font-display font-black text-brand-text-main flex items-center gap-2">
                Collaboration Groups
                <Users className="w-5 h-5 text-brand-primary" />
              </h1>
              <p className="text-xs text-brand-text-muted mt-1">Authenticated user working groups and academic committees</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {groups.map(g => (
              <div key={g.id} className="p-5 bg-brand-bg-secondary/60 backdrop-blur-xl border border-brand-border/60 rounded-2xl flex justify-between items-center shadow-sm">
                <div>
                  <h3 className="text-sm font-bold text-brand-text-main font-display">{g.name}</h3>
                  <p className="text-xs text-brand-text-muted mt-1">{g.role} • {g.members} members</p>
                  <span className="inline-block mt-2 text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                    {g.active}
                  </span>
                </div>
                <Link href="/connect/messages" className="p-2.5 bg-brand-primary text-white rounded-xl shadow-md hover:brightness-110 transition-all">
                  <MessageSquare className="w-4 h-4" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </ConnectProvider>
  );
}
