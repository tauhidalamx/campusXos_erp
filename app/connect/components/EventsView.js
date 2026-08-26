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
    <div className="w-full max-w-[700px] flex flex-col gap-6 text-left">
      <div className="flex justify-between items-center px-1 border-b border-white/5 pb-3">
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <Calendar className="w-5 h-5 text-brand-primary" />
          Upcoming Campus Events
        </h2>
        <button className="flex items-center gap-1.5 px-3 py-1.5 bg-brand-primary/10 border border-brand-primary/20 text-brand-primary rounded-xl text-xs font-bold hover:bg-brand-primary hover:text-white transition-all">
          <Plus className="w-3.5 h-3.5" />
          Propose Event
        </button>
      </div>

      <div className="flex flex-col gap-4">
        {events.map((event) => (
          <div 
            key={event.id}
            className="p-5 bg-[#102043]/20 border border-white/5 rounded-[20px] flex flex-col gap-3.5 hover:border-white/10 transition-all duration-150"
          >
            <div className="flex justify-between items-start gap-3">
              <div className="flex flex-col text-left">
                <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">{event.category}</span>
                <h3 className="text-sm font-bold text-white mt-1 leading-snug hover:text-brand-primary cursor-pointer">{event.title}</h3>
                <span className="text-xs text-slate-400 mt-1 font-semibold">Hosted by: <span className="text-slate-300">{event.speaker}</span></span>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 bg-brand-primary/10 text-brand-primary rounded-md uppercase shrink-0 mt-1">
                {event.interested}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 border-t border-white/5 pt-3.5 text-xs text-slate-400 font-semibold">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-slate-500" />
                <span>{event.date}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-slate-500" />
                <span>{event.time}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-slate-500" />
                <span className="truncate">{event.location}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
