'use client';

import React from 'react';
import { useConnect } from '../ConnectContext';
import { 
  Users, 
  TrendingUp, 
  Calendar, 
  Briefcase, 
  FlaskConical, 
  Plus,
  Sparkles,
  ChevronRight
} from 'lucide-react';

export default function RightPanel() {
  const { currentUser, users, setActiveView, setActiveCommunityId } = useConnect();

  // Pick suggestions from loaded users
  const suggestedFaculty = users.filter(u => u.role === 'faculty').slice(0, 3);
  const suggestedStudents = users.filter(u => u.role === 'student' && u.id !== currentUser?.id).slice(0, 3);

  const suggestedCommunities = [
    { id: 'dept_cs', name: 'Computer Science', members: '142 members', type: 'Academic' },
    { id: 'ai_res', name: 'AI Research Group', members: '84 members', type: 'Research' },
    { id: 'blockchain', name: 'Blockchain Club', members: '65 members', type: 'Student Club' },
    { id: 'placement_cell', name: 'Placement Cell', members: '210 members', type: 'Official' }
  ];

  const trendingTopics = [
    { tag: '#CampusXConnect', posts: '4.5k posts' },
    { tag: '#BlockchainERP', posts: '1.2k posts' },
    { tag: '#QuantumComputing', posts: '890 posts' },
    { tag: '#ThesisPresentation', posts: '540 posts' }
  ];

  const careerOpportunities = [
    { title: 'Research Intern - Deep Learning', company: 'CampusX AI Lab', type: 'Paid' },
    { title: 'Associate Software Engineer', company: 'Stripe API Group', type: 'Full-time' }
  ];

  const handleCommunityClick = (commId) => {
    setActiveCommunityId(commId);
    setActiveView('communities');
  };

  return (
    <div className="w-[350px] shrink-0 hidden lg:flex flex-col gap-6 select-none text-left">
      
      {/* Current User profile card */}
      {currentUser && (
        <div className="flex items-center gap-3.5 p-4 bg-[#102043]/30 border border-white/5 rounded-2xl">
          <img 
            src={currentUser.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'} 
            alt={currentUser.name} 
            className="w-12 h-12 rounded-full object-cover border-2 border-brand-primary" 
          />
          <div className="flex flex-col min-w-0">
            <span className="text-sm font-bold text-white truncate">{currentUser.name}</span>
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mt-0.5">{currentUser.role}</span>
            <span className="text-[10px] font-medium text-slate-400 truncate mt-0.5">{currentUser.dept || 'CampusX University'}</span>
          </div>
        </div>
      )}

      {/* Suggested Communities list */}
      <div className="flex flex-col gap-3">
        <div className="flex justify-between items-center px-1">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Suggested Communities</span>
          <button 
            onClick={() => setActiveView('communities')}
            className="text-[10px] font-bold text-brand-primary hover:underline"
          >
            See All
          </button>
        </div>
        
        <div className="flex flex-col gap-2.5">
          {suggestedCommunities.map((comm) => (
            <div 
              key={comm.id} 
              className="flex justify-between items-center p-2.5 bg-[#102043]/20 border border-white/5 rounded-xl hover:border-white/10 transition-all duration-150 cursor-pointer"
              onClick={() => handleCommunityClick(comm.id)}
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="p-2 bg-indigo-500/10 text-indigo-400 rounded-lg">
                  <Users className="w-4 h-4" />
                </div>
                <div className="flex flex-col min-w-0 text-left">
                  <span className="text-xs font-bold text-white truncate">{comm.name}</span>
                  <span className="text-[9px] font-medium text-slate-400 mt-0.5">{comm.members} • {comm.type}</span>
                </div>
              </div>
              <button className="p-1 hover:bg-white/[0.04] rounded-lg text-slate-400 hover:text-white transition-all">
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Suggested Faculty & Students */}
      <div className="flex flex-col gap-3">
        <div className="flex justify-between items-center px-1">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Suggested Contacts</span>
        </div>

        <div className="flex flex-col gap-2.5">
          {/* Faculty recommendations */}
          {suggestedFaculty.map((fac) => (
            <div key={fac.id} className="flex justify-between items-center p-2 bg-[#102043]/10 border border-transparent hover:border-white/5 hover:bg-[#102043]/20 rounded-xl transition-all">
              <div className="flex items-center gap-3">
                <img src={fac.avatar} alt="" className="w-8 h-8 rounded-full object-cover border border-white/10" />
                <div className="flex flex-col text-left">
                  <span className="text-xs font-bold text-white">{fac.name}</span>
                  <span className="text-[9px] font-medium text-emerald-400 uppercase tracking-wider mt-0.5">Faculty • {fac.id}</span>
                </div>
              </div>
              <button 
                onClick={() => setActiveView('messages')}
                className="text-[10px] font-bold text-brand-primary hover:underline px-2.5 py-1 hover:bg-brand-primary/10 rounded-lg transition-all"
              >
                Chat
              </button>
            </div>
          ))}

          {/* Student recommendations */}
          {suggestedStudents.map((stud) => (
            <div key={stud.id} className="flex justify-between items-center p-2 bg-[#102043]/10 border border-transparent hover:border-white/5 hover:bg-[#102043]/20 rounded-xl transition-all">
              <div className="flex items-center gap-3">
                <img src={stud.avatar} alt="" className="w-8 h-8 rounded-full object-cover border border-white/10" />
                <div className="flex flex-col text-left">
                  <span className="text-xs font-bold text-white">{stud.name}</span>
                  <span className="text-[9px] font-medium text-slate-400 uppercase tracking-wider mt-0.5">Student • {stud.id}</span>
                </div>
              </div>
              <button 
                onClick={() => setActiveView('messages')}
                className="text-[10px] font-bold text-brand-primary hover:underline px-2.5 py-1 hover:bg-brand-primary/10 rounded-lg transition-all"
              >
                Chat
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Trending Topics & Career Links */}
      <div className="flex flex-col gap-4 p-4 bg-[#102043]/20 border border-white/5 rounded-2xl">
        
        {/* Trending research / tags */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2 text-slate-400 border-b border-white/5 pb-2">
            <TrendingUp className="w-4 h-4 text-slate-400" />
            <span className="text-[11px] font-bold uppercase tracking-wider">Trending Research Topics</span>
          </div>
          <div className="flex flex-col gap-2">
            {trendingTopics.map((topic, i) => (
              <div key={i} className="flex justify-between items-center text-xs">
                <span className="font-bold text-white hover:underline cursor-pointer">{topic.tag}</span>
                <span className="text-[10px] text-slate-400 font-semibold">{topic.posts}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Placement Opportunities */}
        <div className="flex flex-col gap-3 border-t border-white/5 pt-3">
          <div className="flex items-center gap-2 text-slate-400 pb-1">
            <Briefcase className="w-4 h-4 text-slate-400" />
            <span className="text-[11px] font-bold uppercase tracking-wider">Placement Offers</span>
          </div>
          <div className="flex flex-col gap-2.5">
            {careerOpportunities.map((op, i) => (
              <div key={i} className="flex flex-col text-left bg-[#102043]/30 p-2 border border-white/5 rounded-xl">
                <span className="text-xs font-bold text-white truncate">{op.title}</span>
                <div className="flex justify-between items-center mt-1">
                  <span className="text-[9px] font-semibold text-slate-400">{op.company}</span>
                  <span className="text-[9px] font-bold px-1.5 py-0.5 bg-brand-primary/10 text-brand-primary rounded">{op.type}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Mini footer credits */}
      <div className="px-1 text-[10px] text-slate-500 font-semibold flex flex-wrap gap-x-2 gap-y-1">
        <span>About</span>
        <span>Help</span>
        <span>Press</span>
        <span>API</span>
        <span>Jobs</span>
        <span>Privacy</span>
        <span>Terms</span>
        <span className="block w-full mt-1.5 font-bold">© 2026 CAMPUSX CONNECT OPERATING LAYER</span>
      </div>

    </div>
  );
}
