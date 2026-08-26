'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function TimetablePage() {
  const [currentUser, setCurrentUser] = useState(null);

  const [timetable, setTimetable] = useState([
    { day: 'Monday', slots: ['09:00 - 10:30: CS101 (Room 302)', '11:00 - 12:30: CS102 (Room 405)', '14:00 - 15:30: Free Period'] },
    { day: 'Tuesday', slots: ['09:00 - 10:30: CS104 (Room 302)', '11:00 - 12:30: Free Period', '14:00 - 15:30: CS101 (Room 302)'] },
    { day: 'Wednesday', slots: ['09:00 - 10:30: CS102 (Room 405)', '11:00 - 12:30: CS104 (Room 405)', '14:00 - 15:30: Lab Assignment'] },
    { day: 'Thursday', slots: ['09:00 - 10:30: CS101 (Room 302)', '11:00 - 12:30: CS102 (Room 405)', '14:00 - 15:30: Free Period'] },
    { day: 'Friday', slots: ['09:00 - 10:30: CS104 (Room 302)', '11:00 - 12:30: Free Period', '14:00 - 15:30: Weekly Seminar'] }
  ]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const session = sessionStorage.getItem('campusx_erp_session');
      if (session) {
        setCurrentUser(JSON.parse(session));
      }
    }
  }, []);

  if (!currentUser) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="w-8 h-8 border-4 border-brand-primary/30 border-t-brand-primary rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 md:gap-8">
      <div className="page-header animate-fade-in flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-display font-bold text-brand-text-main">Timetable & Schedule</h1>
          <p className="text-brand-text-muted mt-1 text-sm">View weekly class schedules, lecture halls, and academic timings.</p>
        </div>
      </div>

      {/* Grid view */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6 animate-fade-in mt-2">
        {timetable.map((t, i) => (
          <div key={i} className="card p-5 bg-brand-bg-secondary border border-brand-border rounded-2xl flex flex-col gap-4">
            <h3 className="m-0 font-display text-sm font-bold text-brand-primary border-b border-brand-border pb-2 uppercase tracking-wider">{t.day}</h3>
            <div className="flex flex-col gap-3">
              {t.slots.map((s, idx) => {
                const isFree = s.includes('Free Period');
                return (
                  <div key={idx} className={`p-3 border border-brand-border rounded-xl text-xs font-semibold ${isFree ? 'bg-brand-bg-secondary/40 text-brand-text-muted/60' : 'bg-brand-bg-tertiary text-brand-text-main border-brand-primary/20 shadow-sm'}`}>
                    {s}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
