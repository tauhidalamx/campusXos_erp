'use client';

import React from 'react';
import SuiteSidebar from '../components/SuiteSidebar';
import { ConnectProvider } from '../ConnectContext';
import { Calendar as CalendarIcon, Clock, Users, Video } from 'lucide-react';
import Link from 'next/link';
import '../connect.css';

export default function CalendarPage() {
  const events = [
    { title: 'CS Department Academic Review', time: '10:00 AM - 11:30 AM', location: 'Virtual Room A / Conference Hall 2', host: 'Dr. Raymond Park' },
    { title: 'Varsity AI Research Symposium', time: '02:00 PM - 04:00 PM', location: 'AI Research Lab', host: 'Aria Nakamura' },
    { title: 'Midterm Grading Consensus Verification', time: '04:30 PM - 05:30 PM', location: 'CampusX Chain Portal', host: 'Dr. Evelyn Sterling' }
  ];

  return (
    <ConnectProvider>
      <div className="flex h-screen bg-brand-bg-primary text-brand-text-main overflow-hidden font-sans select-none relative" style={{ paddingLeft: '80px' }}>
        <SuiteSidebar />
        <div className="flex-1 p-6 overflow-y-auto max-w-[1400px] mx-auto w-full flex flex-col gap-6">
          <div className="pb-4 border-b border-brand-border/40">
            <h1 className="text-2xl font-display font-black text-brand-text-main flex items-center gap-2">
              Academic & Event Calendar
              <CalendarIcon className="w-5 h-5 text-brand-primary" />
            </h1>
            <p className="text-xs text-brand-text-muted mt-1">Authenticated user schedule, department hearings, and virtual meetings</p>
          </div>

          <div className="flex flex-col gap-4">
            {events.map((ev, idx) => (
              <div key={idx} className="p-5 bg-brand-bg-secondary/60 backdrop-blur-xl border border-brand-border/60 rounded-2xl flex items-center justify-between shadow-sm">
                <div>
                  <h3 className="text-sm font-bold text-brand-text-main font-display">{ev.title}</h3>
                  <div className="mt-2 flex flex-wrap gap-4 text-xs text-brand-text-muted font-mono">
                    <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-brand-primary" /> {ev.time}</span>
                    <span className="flex items-center gap-1.5"><Users className="w-3.5 h-3.5 text-brand-primary" /> {ev.host}</span>
                  </div>
                  <p className="text-[11px] text-brand-text-subtle mt-1">{ev.location}</p>
                </div>
                <Link href="/connect/meetings" className="px-4 py-2 bg-brand-primary/10 text-brand-primary hover:bg-brand-primary hover:text-white rounded-xl font-bold transition-all text-xs flex items-center gap-1.5">
                  <Video className="w-3.5 h-3.5" />
                  Join Room
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </ConnectProvider>
  );
}
