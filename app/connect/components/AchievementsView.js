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
    <div className="w-full max-w-[700px] flex flex-col gap-6 text-left">
      <div className="flex justify-between items-center px-1 border-b border-white/5 pb-3">
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <Trophy className="w-5 h-5 text-amber-500" />
          CampusX Campus Trophy Board
        </h2>
      </div>

      <div className="flex flex-col gap-4">
        {achievements.map((item) => (
          <div 
            key={item.id}
            className="p-5 bg-[#102043]/20 border border-white/5 rounded-[20px] flex flex-col gap-3.5 hover:border-white/10 transition-all duration-150"
          >
            <div className="flex justify-between items-start gap-3">
              <div className="flex flex-col text-left">
                <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest">{item.category}</span>
                <h3 className="text-sm font-bold text-white mt-1 leading-snug">{item.title}</h3>
                <span className="text-xs text-slate-400 mt-1 font-semibold">Awarded to: <span className="text-slate-300 font-bold">{item.recipient}</span></span>
              </div>
              <span className="text-[10px] font-bold px-2.5 py-1 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-xl shrink-0 mt-1">
                {item.metric}
              </span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed font-medium">
              {item.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
