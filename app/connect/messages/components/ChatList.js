'use client';

import React, { useState } from 'react';
import { 
  MessageSquare, 
  Search, 
  ChevronDown, 
  ChevronRight, 
  Pin, 
  Video, 
  Sparkles, 
  Users,
  Compass,
  Trophy,
  Briefcase
} from 'lucide-react';

export default function ChatList({ 
  activeChannelId, 
  setActiveChannelId, 
  onStartVideoMeeting 
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedCategories, setExpandedCategories] = useState({
    personal: true,
    academic: true,
    research: true,
    official: true
  });

  const toggleCategory = (cat) => {
    setExpandedCategories(prev => ({ ...prev, [cat]: !prev[cat] }));
  };

  // Mock list of chat channels/threads
  const chatThreads = [
    { id: 'ai_copilot', name: 'CampusX AI Copilot', category: 'personal', role: 'System Engine', dept: 'AI Lab', lastMsg: 'I calculated a +12% performance factor improvement...', unread: 0, status: 'online', type: 'ai', pinned: true },
    { id: 'usr_001', name: 'Dr. Evelyn Sterling', category: 'personal', role: 'Faculty', dept: 'Computer Science', lastMsg: 'Please submit the consensus draft review by tonight.', unread: 2, status: 'busy', type: 'user', pinned: true },
    { id: 'usr_005', name: 'Carlos Mendez', category: 'personal', role: 'Student', dept: 'Electrical Eng', lastMsg: '🎤 Voice Note (0:04)', unread: 0, status: 'online', type: 'user', typing: true },
    { id: 'usr_002', name: 'Prof. Marcus Chen', category: 'personal', role: 'Faculty', dept: 'Computer Science', lastMsg: 'The midterms scores are posted to CampusX Chain.', unread: 0, status: 'meeting', type: 'user', meetingActive: true },
    
    { id: 'dept_cs', name: 'CS Department Huddle', category: 'academic', role: 'Official Channel', dept: 'CS Department', lastMsg: 'Dr. Lovelace scheduled a consensus review meeting.', unread: 0, status: 'online', type: 'channel' },
    { id: 'class_cs202', name: 'CS202 - Data Structures', category: 'academic', role: 'Class Group', dept: 'CS Cohort', lastMsg: 'Has anyone downloaded the binary tree prep PDF?', unread: 1, status: 'online', type: 'channel' },
    { id: 'club_blockchain', name: 'Blockchain Club Hackathon', category: 'academic', role: 'Student Club', dept: 'Clubs', lastMsg: 'Gold medal results registered on trust ledger.', unread: 0, status: 'offline', type: 'channel' },

    { id: 'res_dl_models', name: 'AI Deep Learning Models', category: 'research', role: 'Research Group', dept: 'AI Research', lastMsg: 'Citation indicators optimization paper draft updated.', unread: 3, status: 'online', type: 'channel', meetingActive: true },
    { id: 'res_ledger_sync', name: 'Ledger State Synchronization', category: 'research', role: 'Project Group', dept: 'Decentralized Research', lastMsg: 'Validation proofs anchored to the Polygon testnet.', unread: 0, status: 'online', type: 'channel' },

    { id: 'placement_leads', name: 'Placement Cell - Tech Leads', category: 'official', role: 'Career Board', dept: 'Placements', lastMsg: 'Meta software intern applications closing soon.', unread: 0, status: 'online', type: 'channel' },
    { id: 'hostel_a_hall', name: 'Block A Hostel Lounge', category: 'official', role: 'Hostel Group', dept: 'Residence', lastMsg: 'The canteen dinner menu has been updated.', unread: 0, status: 'offline', type: 'channel' }
  ];

  const filteredThreads = chatThreads.filter(t => 
    t.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    t.dept.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderThreadItem = (thread) => {
    const isActive = activeChannelId === thread.id;
    
    // Status colors
    let statusBg = 'bg-slate-500';
    if (thread.status === 'online') statusBg = 'bg-emerald-500';
    else if (thread.status === 'busy') statusBg = 'bg-rose-500';
    else if (thread.status === 'meeting') statusBg = 'bg-indigo-500 animate-pulse';

    return (
      <div
        key={thread.id}
        onClick={() => setActiveChannelId(thread.id)}
        className={`flex items-start gap-3 p-3 rounded-2xl cursor-pointer transition-all duration-150 border ${
          isActive 
            ? 'bg-brand-primary/15 border-brand-primary/30 text-white' 
            : 'bg-[#102043]/10 border-transparent text-slate-300 hover:bg-white/[0.02]'
        }`}
      >
        {/* Avatar or Group Icon */}
        <div className="relative shrink-0 mt-0.5">
          {thread.type === 'ai' ? (
            <div className="w-9 h-9 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-brand-primary" />
            </div>
          ) : thread.type === 'channel' ? (
            <div className="w-9 h-9 rounded-xl bg-slate-500/10 border border-white/5 text-slate-400 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          ) : (
            <img 
              src={`https://images.unsplash.com/photo-${thread.id === 'usr_001' ? '1534528741775-53994a69daeb' : (thread.id === 'usr_005' ? '1500648767791-00dcc994a43e' : '1507003211169-0a1dd7228f2d')}?w=150`} 
              alt="" 
              className="w-9 h-9 rounded-full object-cover border border-white/10" 
            />
          )}
          
          {/* Presence Indicator Badge */}
          {thread.type !== 'channel' && (
            <span className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-[#071126] ${statusBg}`} />
          )}
        </div>

        {/* Text Details */}
        <div className="flex-1 min-w-0 text-left">
          <div className="flex justify-between items-baseline">
            <span className="text-xs font-bold text-white truncate">{thread.name}</span>
            {thread.unread > 0 && (
              <span className="bg-brand-primary text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full shrink-0">
                {thread.unread}
              </span>
            )}
          </div>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wide">{thread.role}</span>
            <span className="text-[8px] text-white/30">•</span>
            <span className="text-[9px] font-semibold text-slate-400 truncate">{thread.dept}</span>
          </div>
          
          {/* Last message / Typing state */}
          <p className={`text-[10px] truncate mt-1 leading-normal ${thread.typing ? 'text-brand-primary font-bold italic' : 'text-slate-400'}`}>
            {thread.typing ? 'Carlos is typing...' : thread.lastMsg}
          </p>
        </div>

        {/* Action icons (Pinned / Video meeting active) */}
        <div className="flex flex-col gap-1 items-end shrink-0 mt-0.5">
          {thread.pinned && <Pin className="w-3.5 h-3.5 text-slate-500 rotate-45" />}
          {thread.meetingActive && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onStartVideoMeeting(thread.name);
              }}
              className="p-1 bg-indigo-500/20 text-indigo-400 rounded-lg hover:bg-indigo-500 hover:text-white transition-all"
              title="Join active meeting"
            >
              <Video className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="w-[320px] bg-[#0B1736] border-r border-white/5 flex flex-col h-full shrink-0 left-chat-list-sidebar">
      
      {/* List Header */}
      <div className="p-4 border-b border-white/5 bg-[#102043]/30 flex flex-col gap-3">
        <div className="flex justify-between items-center">
          <h2 className="text-base font-bold text-white tracking-wide">Messaging & Rooms</h2>
        </div>
        
        {/* Search */}
        <div className="flex items-center bg-[#071126] border border-white/5 rounded-xl px-3 py-2 gap-2">
          <Search className="w-4 h-4 text-slate-500" />
          <input 
            type="text" 
            placeholder="Search rooms, staff..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent border-none text-xs text-white outline-none w-full placeholder-slate-500 font-semibold"
          />
        </div>
      </div>

      {/* Accordion Categories view */}
      <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-4 chat-scroll">
        
        {/* Category 1: Direct Personal & AI Chats */}
        <div className="flex flex-col gap-1.5">
          <button 
            onClick={() => toggleCategory('personal')}
            className="flex justify-between items-center text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-2 bg-transparent border-none outline-none cursor-pointer"
          >
            <span>Direct Messages</span>
            {expandedCategories.personal ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
          </button>
          {expandedCategories.personal && (
            <div className="flex flex-col gap-1.5">
              {filteredThreads.filter(t => t.category === 'personal').map(renderThreadItem)}
            </div>
          )}
        </div>

        {/* Category 2: Academic & Classes */}
        <div className="flex flex-col gap-1.5">
          <button 
            onClick={() => toggleCategory('academic')}
            className="flex justify-between items-center text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-2 bg-transparent border-none outline-none cursor-pointer"
          >
            <span>Academic Channels</span>
            {expandedCategories.academic ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
          </button>
          {expandedCategories.academic && (
            <div className="flex flex-col gap-1.5">
              {filteredThreads.filter(t => t.category === 'academic').map(renderThreadItem)}
            </div>
          )}
        </div>

        {/* Category 3: Research & Projects */}
        <div className="flex flex-col gap-1.5">
          <button 
            onClick={() => toggleCategory('research')}
            className="flex justify-between items-center text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-2 bg-transparent border-none outline-none cursor-pointer"
          >
            <span>Research Consortia</span>
            {expandedCategories.research ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
          </button>
          {expandedCategories.research && (
            <div className="flex flex-col gap-1.5">
              {filteredThreads.filter(t => t.category === 'research').map(renderThreadItem)}
            </div>
          )}
        </div>

        {/* Category 4: Placements & Residence */}
        <div className="flex flex-col gap-1.5">
          <button 
            onClick={() => toggleCategory('official')}
            className="flex justify-between items-center text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-2 bg-transparent border-none outline-none cursor-pointer"
          >
            <span>Official Hubs</span>
            {expandedCategories.official ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
          </button>
          {expandedCategories.official && (
            <div className="flex flex-col gap-1.5">
              {filteredThreads.filter(t => t.category === 'official').map(renderThreadItem)}
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
