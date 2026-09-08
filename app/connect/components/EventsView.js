'use client';

import React from 'react';
import { Calendar, MapPin, Clock, Star, Plus } from 'lucide-react';

export default function EventsView() {
  const events = [
    {
      id: 'e1',
      title: 'Decentralized Consensus & Academic Registry Workshop',
      category: 'Research Seminar',
      date: 'June 18, 2026',
      time: '14:00 - 16:30',
      location: 'Auditorium C / Online stream',
      speaker: 'Dr. Evelyn Sterling & Dr. Ada Lovelace',
      interested: '48 registered'
    },
    {
      id: 'e2',
      title: 'Venture Capital Hackathon & Demo Day',
      category: 'Club Event',
      date: 'June 22, 2026',
      time: '09:00 - 18:00',
      location: 'Interactive Engineering Lab',
      speaker: 'Sponsored by CampusX Finance Society',
      interested: '112 registered'
    },
    {
      id: 'e3',
      title: 'Meta Recruitment & Interview Preparation',
      category: 'Placement Drive',
      date: 'June 25, 2026',
      time: '11:00 - 12:30',
      location: 'Seminar Hall B',
      speaker: 'Meta Recruitment Cell Huddle',
      interested: '85 registered'
    }
  ];

  return (
    <div className="w-full min-w-0 flex flex-col gap-6 text-left">
      <div className="flex justify-between items-center px-1 border-b border-slate-200 pb-3">
        <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-brand-primary" />
          Upcoming Campus Events
        </h2>
        <button className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 border border-indigo-200 text-indigo-700 rounded-xl text-xs font-bold hover:bg-brand-primary hover:text-white transition-all cursor-pointer">
          <Plus className="w-3.5 h-3.5" />
          Propose Event
        </button>
      </div>

      <div className="flex flex-col gap-4 min-w-0">
        {events.map((event) => (
          <div 
            key={event.id}
            className="p-5 sm:p-6 bg-white border border-slate-200/90 rounded-3xl flex flex-col gap-4 hover:border-indigo-300 shadow-2xs transition-all duration-150 min-w-0"
          >
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3.5 min-w-0">
              <div className="flex flex-col text-left min-w-0 flex-1">
                <span className="text-[10px] font-extrabold text-indigo-600 uppercase tracking-widest">{event.category}</span>
                <h3 className="text-sm sm:text-base font-bold text-slate-900 mt-1 leading-snug hover:text-indigo-600 cursor-pointer break-words">{event.title}</h3>
                <span className="text-xs text-slate-500 mt-1 font-semibold break-words">Hosted by: <span className="text-slate-800 font-bold">{event.speaker}</span></span>
              </div>
              <span className="text-[10px] font-extrabold px-3 py-1 bg-indigo-50 text-indigo-700 border border-indigo-200 rounded-xl uppercase shrink-0 self-start whitespace-nowrap shadow-2xs">
                {event.interested}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 border-t border-slate-100 pt-4 text-xs text-slate-600 font-semibold min-w-0">
              <div className="flex items-center gap-2 min-w-0">
                <Calendar className="w-4 h-4 text-indigo-500 shrink-0" />
                <span className="truncate">{event.date}</span>
              </div>
              <div className="flex items-center gap-2 min-w-0">
                <Clock className="w-4 h-4 text-indigo-500 shrink-0" />
                <span className="truncate">{event.time}</span>
              </div>
              <div className="flex items-center gap-2 min-w-0">
                <MapPin className="w-4 h-4 text-indigo-500 shrink-0" />
                <span className="truncate">{event.location}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
