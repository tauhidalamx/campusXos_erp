'use client';

import React from 'react';
import { Trophy, Star, Award, Heart, Flame } from 'lucide-react';

export default function AchievementsView() {
  const achievements = [
    {
      id: 'a1',
      title: 'First Place - National Blockchain Hackathon 2026',
      recipient: 'Aria Nakamura & CS Engineering Cohort',
      category: 'Trophy',
      description: 'Awarded first place for designing a secure, smart-contract verified academic transcript ledger with zero-knowledge proof credentialing.',
      metric: '🏆 Gold Medal'
    },
    {
      id: 'a2',
      title: 'NSF Quantum Computing Research Grant Approval',
      recipient: 'Dr. Evelyn Sterling & CampusX Physics Group',
      category: 'Research Grant',
      description: 'Approved for $45,000 research grant to model topological qubit error mitigation profiles on standard silicon lattices.',
      metric: '🔬 $45k Grant'
    },
    {
      id: 'a3',
      title: 'Top Peer-Reviewed Citation Indicator',
      recipient: 'Prof. Alan Turing',
      category: 'Publication Milestone',
      description: 'Authored neural architecture optimization paper that crossed over 120 citations within six months of peer-reviewed publication.',
      metric: '⭐ Citation Master'
    }
  ];

  return (
    <div className="w-full min-w-0 flex flex-col gap-5 text-left">
      <div className="flex justify-between items-center px-1 border-b border-slate-200/80 pb-3.5">
        <h2 className="text-base font-bold text-slate-900 flex items-center gap-2.5">
          <div className="p-1.5 bg-amber-50 border border-amber-200 text-amber-600 rounded-xl shrink-0 shadow-2xs">
            <Trophy className="w-4.5 h-4.5 text-amber-500" />
          </div>
          <span className="tracking-tight">CampusX Campus Trophy Board</span>
        </h2>
      </div>

      <div className="flex flex-col gap-4.5 min-w-0">
        {achievements.map((item) => (
          <div 
            key={item.id}
            className="p-6 sm:p-7 bg-white border border-slate-200/90 rounded-2xl flex flex-col gap-4 hover:border-amber-300/80 shadow-[0_2px_12px_rgba(0,0,0,0.03)] transition-all duration-200 min-w-0"
          >
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 min-w-0">
              <div className="flex flex-col text-left min-w-0 flex-1">
                <span className="text-[10.5px] font-extrabold text-amber-600 uppercase tracking-widest">{item.category}</span>
                <h3 className="text-sm sm:text-base font-bold text-slate-900 mt-1 leading-snug break-words">{item.title}</h3>
                <span className="text-xs text-slate-500 mt-1.5 font-semibold break-words">Awarded to: <span className="text-slate-800 font-bold">{item.recipient}</span></span>
              </div>
              <div className="shrink-0 self-start">
                <span className="inline-flex items-center text-xs font-bold px-3.5 py-1.5 bg-amber-50/90 text-amber-900 border border-amber-200 rounded-xl whitespace-nowrap shadow-2xs">
                  {item.metric}
                </span>
              </div>
            </div>

            <div className="border-t border-slate-100 pt-3.5">
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal break-words">
                {item.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
