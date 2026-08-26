'use client';

import React from 'react';
import SuiteSidebar from '../components/SuiteSidebar';
import { ConnectProvider, useConnect } from '../ConnectContext';
import { User, ShieldCheck, Mail, Building, Key, Check } from 'lucide-react';
import '../connect.css';

function ProfileContent() {
  const { currentUser } = useConnect();
  const user = currentUser || { name: 'Authenticated User', role: 'Faculty HOD', dept: 'Computer Science', email: 'user@campusx.edu' };

  return (
    <div className="flex-1 p-6 overflow-y-auto max-w-[1400px] mx-auto w-full flex flex-col gap-6">
      <div className="pb-4 border-b border-brand-border/40">
        <h1 className="text-2xl font-display font-black text-brand-text-main flex items-center gap-2">
          User Security Profile
          <ShieldCheck className="w-5 h-5 text-emerald-500" />
        </h1>
        <p className="text-xs text-brand-text-muted mt-1">Authenticated session identity & cryptographic permission clearance</p>
      </div>

      <div className="p-6 bg-brand-bg-secondary/60 backdrop-blur-xl border border-brand-border/60 rounded-3xl shadow-xl flex flex-col md:flex-row items-center gap-6">
        <img src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=250'} alt="" className="w-24 h-24 rounded-full object-cover border-4 border-brand-primary/40 shadow-xl" />
        <div className="flex-1 text-center md:text-left">
          <h2 className="text-xl font-bold text-brand-text-main font-display">{user.name}</h2>
          <span className="inline-block mt-1 px-3 py-0.5 rounded-full bg-brand-primary/15 text-brand-primary text-xs font-bold border border-brand-primary/20">
            {user.role}
          </span>
          <div className="mt-3 flex flex-wrap justify-center md:justify-start gap-4 text-xs text-brand-text-muted font-mono">
            <span className="flex items-center gap-1.5"><Building className="w-4 h-4 text-brand-primary" /> {user.dept}</span>
            <span className="flex items-center gap-1.5"><Mail className="w-4 h-4 text-brand-primary" /> {user.email}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProfilePage() {
  return (
    <ConnectProvider>
      <div className="flex h-screen bg-brand-bg-primary text-brand-text-main overflow-hidden font-sans select-none relative" style={{ paddingLeft: '80px' }}>
        <SuiteSidebar />
        <ProfileContent />
      </div>
    </ConnectProvider>
  );
}
