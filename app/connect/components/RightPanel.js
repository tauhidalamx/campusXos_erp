'use client';

import React from 'react';
import { useConnect } from '../ConnectContext';
import { 
  Users, 
  TrendingUp, 
  Plus
} from 'lucide-react';

export default function RightPanel() {
  const { currentUser, users, setActiveView, setActiveCommunityId, setActiveChatChannel, setMessengerOpen } = useConnect();

  const fallbackFaculty = [
    { id: 'usr_001', name: 'Dr. Raymond Park', role: 'Faculty HOD', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150' },
    { id: 'usr_002', name: 'Dr. Evelyn Sterling', role: 'Professor', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150' }
  ];

  const fallbackStudents = [
    { id: 'usr_005', name: 'Carlos Mendez', role: 'Student Rep', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150' },
    { id: 'usr_006', name: 'Aria Nakamura', role: 'CS Cohort', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150' }
  ];

  const loadedFaculty = (users || []).filter(u => u.role === 'faculty');
  const loadedStudents = (users || []).filter(u => u.role === 'student' && u.id !== currentUser?.id);

  const suggestedFaculty = (loadedFaculty.length > 0 ? loadedFaculty : fallbackFaculty).slice(0, 2);
  const suggestedStudents = (loadedStudents.length > 0 ? loadedStudents : fallbackStudents).slice(0, 2);

  const handleOpenDirectChat = (userId) => {
    setActiveChatChannel(userId);
    setMessengerOpen(true);
  };

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

  const handleCommunityClick = (commId) => {
    setActiveCommunityId(commId);
    setActiveView('communities');
  };

  return (
    <div className="connect-right-panel flex flex-col gap-5 select-none text-left min-w-0">
      
      {/* Current User profile card */}
      {currentUser && (
        <div className="flex items-center gap-3.5 p-4.5 px-5 bg-white border border-slate-200/90 rounded-2xl shadow-xs min-w-0">
          <img 
            src={currentUser.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'} 
            alt={currentUser.name} 
            className="w-11 h-11 rounded-full object-cover border border-slate-200 shrink-0" 
          />
          <div className="flex flex-col min-w-0 flex-1 text-left">
            <span className="text-sm font-bold text-slate-900 truncate">{currentUser.name}</span>
            <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest mt-0.5 truncate">{currentUser.role}</span>
            <span className="text-[11px] font-medium text-slate-400 truncate mt-0.5">{currentUser.dept || 'CampusX Operating Layer'}</span>
          </div>
        </div>
      )}

      {/* Suggested Communities list */}
      <div className="flex flex-col gap-3.5 p-5 bg-white border border-slate-200/90 rounded-2xl shadow-xs min-w-0">
        <div className="flex justify-between items-center px-1">
          <span className="text-[11px] font-black text-slate-400 uppercase tracking-wider">Suggested Communities</span>
          <button 
            onClick={() => setActiveView('communities')}
            className="text-xs font-bold text-indigo-600 hover:text-indigo-800 hover:underline cursor-pointer"
          >
            See All
          </button>
        </div>
        
        <div className="flex flex-col gap-1 min-w-0">
          {suggestedCommunities.map((comm) => (
            <div 
              key={comm.id} 
              className="flex justify-between items-center p-2 px-2.5 rounded-xl hover:bg-slate-50 transition-all duration-150 cursor-pointer group gap-3 min-w-0"
              onClick={() => handleCommunityClick(comm.id)}
            >
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <div className="p-2 bg-indigo-50 text-indigo-700 rounded-xl shrink-0">
                  <Users className="w-3.5 h-3.5" />
                </div>
                <div className="flex flex-col min-w-0 flex-1 text-left">
                  <span className="text-xs font-bold text-slate-800 group-hover:text-indigo-600 transition-colors truncate">{comm.name}</span>
                  <span className="text-[10.5px] font-medium text-slate-400 mt-0.5 truncate">{comm.members}</span>
                </div>
              </div>
              <button className="p-1.5 hover:bg-indigo-50 rounded-lg text-slate-400 hover:text-indigo-600 transition-all shrink-0">
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Suggested Contacts */}
      <div className="flex flex-col gap-3.5 p-5 bg-white border border-slate-200/90 rounded-2xl shadow-xs min-w-0">
        <div className="flex justify-between items-center px-1">
          <span className="text-[11px] font-black text-slate-400 uppercase tracking-wider">Suggested Contacts</span>
        </div>

        <div className="flex flex-col gap-1 min-w-0">
          {suggestedFaculty.map((fac) => (
            <div key={fac.id} className="flex justify-between items-center p-2 px-2.5 hover:bg-slate-50 rounded-xl transition-all gap-2.5 min-w-0">
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <img src={fac.avatar} alt="" className="w-8 h-8 rounded-full object-cover shrink-0" />
                <div className="flex flex-col text-left min-w-0 flex-1">
                  <span className="text-xs font-bold text-slate-800 truncate">{fac.name}</span>
                  <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider truncate">{fac.role}</span>
                </div>
              </div>
              <button 
                onClick={() => handleOpenDirectChat(fac.id)}
                className="text-xs font-bold text-indigo-600 hover:text-indigo-800 px-2.5 py-1 hover:bg-indigo-50 rounded-lg transition-all cursor-pointer shrink-0"
              >
                Chat
              </button>
            </div>
          ))}

          {suggestedStudents.map((stud) => (
            <div key={stud.id} className="flex justify-between items-center p-2 px-2.5 hover:bg-slate-50 rounded-xl transition-all gap-2.5 min-w-0">
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <img src={stud.avatar} alt="" className="w-8 h-8 rounded-full object-cover shrink-0" />
                <div className="flex flex-col text-left min-w-0 flex-1">
                  <span className="text-xs font-bold text-slate-800 truncate">{stud.name}</span>
                  <span className="text-[10px] font-bold text-cyan-700 uppercase tracking-wider truncate">{stud.role}</span>
                </div>
              </div>
              <button 
                onClick={() => handleOpenDirectChat(stud.id)}
                className="text-xs font-bold text-indigo-600 hover:text-indigo-800 px-2.5 py-1 hover:bg-indigo-50 rounded-lg transition-all cursor-pointer shrink-0"
              >
                Chat
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Trending Topics */}
      <div className="flex flex-col gap-3.5 p-5 bg-white border border-slate-200/90 rounded-2xl shadow-xs min-w-0">
        <div className="flex items-center gap-2 text-slate-400 px-1 border-b border-slate-100 pb-2.5">
          <TrendingUp className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
          <span className="text-[11px] font-black uppercase tracking-wider text-slate-900">Trending Topics</span>
        </div>
        <div className="flex flex-col gap-1 min-w-0">
          {trendingTopics.map((topic, i) => (
            <div key={i} className="flex justify-between items-center text-xs group cursor-pointer p-2 px-2.5 rounded-lg hover:bg-slate-50 gap-2 min-w-0">
              <span className="font-bold text-slate-800 group-hover:text-indigo-600 transition-colors truncate min-w-0 flex-1">{topic.tag}</span>
              <span className="text-[10.5px] text-slate-400 font-semibold shrink-0 pl-1.5 whitespace-nowrap">{topic.posts}</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
