'use client';

import React, { useState } from 'react';
import { 
  Volume2, 
  Mic, 
  MicOff, 
  PhoneOff, 
  Sparkles, 
  Users, 
  Radio,
  Plus
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function VoiceChannels() {
  const [activeVoiceRoom, setActiveVoiceRoom] = useState(null); // roomId or null
  const [muted, setMuted] = useState(false);

  const voiceRooms = [
    { id: 'v_faculty', name: 'Faculty Committee Huddle', category: 'FACULTY', users: ['Dr. Evelyn Sterling', 'Prof. Marcus Chen'], limit: 6 },
    { id: 'v_research', name: 'AI Deep Learning Lounge', category: 'RESEARCH', users: ['Prof. Alan Turing'], limit: 12 },
    { id: 'v_class', name: 'CS202 Study Session B', category: 'STUDENT', users: ['Carlos Mendez', 'Zoe Chen', 'Alex Rivera'], limit: 20 },
    { id: 'v_lounge', name: 'General Student Lounge', category: 'CAMPUS', users: [], limit: 30 },
    { id: 'v_stage', name: 'CampusX Chain Consortium Panel', category: 'STAGE', users: ['Dr. Ada Lovelace'], limit: 100, isStage: true }
  ];

  const handleJoinVoice = (roomId) => {
    if (activeVoiceRoom === roomId) {
      setActiveVoiceRoom(null);
    } else {
      setActiveVoiceRoom(roomId);
    }
  };

  const handleLeaveVoice = () => {
    setActiveVoiceRoom(null);
  };

  return (
    <div className="w-full max-w-[700px] flex flex-col gap-6 text-left connect-font-inter">
      
      {/* Header */}
      <div className="flex justify-between items-center px-1 border-b border-white/5 pb-3">
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <Volume2 className="w-5 h-5 text-brand-primary" />
          CampusX Voice Space
        </h2>
        <button className="flex items-center gap-1.5 px-3 py-1.5 bg-brand-primary/10 border border-brand-primary/20 text-brand-primary rounded-xl text-xs font-bold hover:bg-brand-primary hover:text-white transition-all">
          <Plus className="w-3.5 h-3.5" />
          Create Room
        </button>
      </div>

      {/* Voice grid container */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {voiceRooms.map((room) => {
          const isJoined = activeVoiceRoom === room.id;
          const userCount = room.users.length + (isJoined ? 1 : 0);
          
          return (
            <div 
              key={room.id}
              className={`p-5 bg-[#102043]/20 border rounded-[20px] flex flex-col justify-between h-[180px] hover:border-white/10 transition-all ${
                isJoined ? 'border-brand-primary/40 shadow-xl bg-brand-primary/5' : 'border-white/5'
              }`}
            >
              
              <div className="flex justify-between items-start">
                <div className="flex flex-col text-left">
                  <span className="text-[9px] font-bold text-indigo-400 uppercase tracking-widest">{room.category}</span>
                  <h3 className="text-sm font-bold text-white mt-1 leading-snug truncate max-w-[180px]">{room.name}</h3>
                </div>
                <div className="flex items-center gap-1.5 bg-[#0B1736] px-2.5 py-1 rounded-lg border border-white/5 text-[10px] font-bold text-slate-400">
                  {room.isStage ? <Radio className="w-3.5 h-3.5 text-rose-500 shrink-0" /> : <Users className="w-3.5 h-3.5 text-slate-400 shrink-0" />}
                  <span>{userCount} / {room.limit}</span>
                </div>
              </div>

              {/* Joined participants avatars list */}
              <div className="flex flex-col gap-2.5 mt-2">
                <div className="flex -space-x-2.5 overflow-hidden">
                  {/* Local user avatar if joined */}
                  {isJoined && (
                    <div className="relative">
                      <img 
                        src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150" 
                        alt="" 
                        className="w-6.5 h-6.5 rounded-full object-cover border-2 border-[#0B1736] shrink-0 speaking-glow" 
                      />
                      {!muted && <span className="absolute bottom-0 right-0 w-2 h-2 bg-emerald-500 rounded-full border border-[#0B1736] animate-ping" />}
                    </div>
                  )}
                  {room.users.map((user, idx) => (
                    <img 
                      key={idx}
                      src={`https://images.unsplash.com/photo-${idx === 0 ? '1534528741775-53994a69daeb' : (idx === 1 ? '1507003211169-0a1dd7228f2d' : '1500648767791-00dcc994a43e')}?w=150`} 
                      alt="" 
                      className="w-6.5 h-6.5 rounded-full object-cover border-2 border-[#0B1736] shrink-0" 
                    />
                  ))}
                  {userCount === 0 && (
                    <span className="text-[10px] font-semibold text-slate-500 pl-2">Channel is currently empty.</span>
                  )}
                </div>

                <div className="flex justify-between items-center border-t border-white/5 pt-3 mt-1">
                  <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">
                    {room.isStage ? 'LIVE STAGE' : 'VOICE ROOM'}
                  </span>
                  
                  <button 
                    onClick={() => handleJoinVoice(room.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                      isJoined 
                        ? 'bg-rose-500/10 border-rose-500/20 text-rose-500 hover:bg-rose-500 hover:text-white' 
                        : 'bg-brand-primary/10 border-brand-primary/20 text-brand-primary hover:bg-brand-primary hover:text-white'
                    }`}
                  >
                    {isJoined ? 'Disconnect' : 'Join Voice'}
                  </button>
                </div>
              </div>

            </div>
          );
        })}
      </div>

      {/* Floating Status card overlay when inside room */}
      <AnimatePresence>
        {activeVoiceRoom && (
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            className="fixed bottom-20 left-1/2 -translate-x-1/2 bg-[#0B1736] border border-white/10 p-4 rounded-2xl flex items-center justify-between gap-6 shadow-2xl z-50 glass-overlay"
          >
            <div className="flex items-center gap-3">
              <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-ping" />
              <div className="flex flex-col text-left">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Voice Connected</span>
                <span className="text-xs font-bold text-white">
                  {voiceRooms.find(r => r.id === activeVoiceRoom)?.name}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2.5 border-l border-white/10 pl-5">
              <button 
                onClick={() => setMuted(!muted)}
                className={`p-2 rounded-xl transition-all border ${
                  muted 
                    ? 'bg-rose-500/20 border-rose-500/30 text-rose-500' 
                    : 'bg-[#102043] border-white/5 text-slate-400 hover:text-white'
                }`}
                title="Mute microphone"
              >
                {muted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </button>
              <button 
                onClick={handleLeaveVoice}
                className="px-3 py-2 bg-rose-500 hover:bg-rose-600 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-md"
              >
                <PhoneOff className="w-4 h-4" />
                <span>Disconnect</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
