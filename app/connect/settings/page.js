'use client';

import React from 'react';
import SuiteSidebar from '../components/SuiteSidebar';
import { ConnectProvider } from '../ConnectContext';
import { Settings, Bell, Shield, Moon, Volume2 } from 'lucide-react';
import '../connect.css';

export default function SettingsPage() {
  return (
    <ConnectProvider>
      <div className="flex h-screen bg-brand-bg-primary text-brand-text-main overflow-hidden font-sans select-none relative" style={{ paddingLeft: '80px' }}>
        <SuiteSidebar />
        <div className="flex-1 p-6 overflow-y-auto max-w-[1400px] mx-auto w-full flex flex-col gap-6">
          <div className="pb-4 border-b border-brand-border/40">
            <h1 className="text-2xl font-display font-black text-brand-text-main flex items-center gap-2">
              Connect Preferences
              <Settings className="w-5 h-5 text-brand-primary" />
            </h1>
            <p className="text-xs text-brand-text-muted mt-1">Configure real-time messaging, privacy protocols, and notification channels</p>
          </div>

          <div className="flex flex-col gap-4">
            {[
              { icon: Bell, title: 'Real-Time Desktop Push Notifications', desc: 'Instant browser alerts for peer DMs, mentions, and urgent meeting invites', enabled: true },
              { icon: Shield, title: '256-Bit Cryptographic P2P Encryption', desc: 'Enforce end-to-end payload signature verification for direct messaging', enabled: true },
              { icon: Volume2, title: 'Audio Ringtone & Chime Feedback', desc: 'Play notification chime when incoming calls or messages are received', enabled: true }
            ].map((s, idx) => {
              const Icon = s.icon;
              return (
                <div key={idx} className="p-5 bg-brand-bg-secondary/60 backdrop-blur-xl border border-brand-border/60 rounded-2xl flex justify-between items-center shadow-sm">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-brand-primary/10 rounded-xl text-brand-primary">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-brand-text-main font-display">{s.title}</h3>
                      <p className="text-xs text-brand-text-muted mt-0.5">{s.desc}</p>
                    </div>
                  </div>
                  <div className="w-12 h-6 bg-brand-primary rounded-full p-1 cursor-pointer flex items-center justify-end shadow-inner">
                    <div className="w-4 h-4 rounded-full bg-white shadow-md" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </ConnectProvider>
  );
}
