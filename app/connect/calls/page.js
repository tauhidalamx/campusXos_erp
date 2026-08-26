'use client';

import React, { useState, useEffect } from 'react';
import SuiteSidebar from '../components/SuiteSidebar';
import { 
  Phone, 
  PhoneOff, 
  Video, 
  VideoOff, 
  Mic, 
  MicOff, 
  ShieldCheck, 
  Sparkles, 
  Activity, 
  UserPlus, 
  VolumeX, 
  Volume2, 
  Clock, 
  Search,
  Settings,
  Tv
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useConnect, ConnectProvider } from '../ConnectContext';
import '../connect.css';
import '../messages/messages.css';

function CallsPageContent() {
  const { currentUser } = useConnect();
  
  // Call Session states
  const [activeCall, setActiveCall] = useState(null); // contact object or null
  const [callStatus, setCallStatus] = useState('Disconnected'); // 'Ringing' | 'Connected' | 'Disconnected'
  const [callTimer, setCallTimer] = useState(0);

  // Media Settings
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);
  const [bgBlurLevel, setBgBlurLevel] = useState('none'); // 'none' | 'low' | 'high'
  const [noiseCancellation, setNoiseCancellation] = useState(true);
  const [volume, setVolume] = useState(80);

  // Search Contacts
  const [searchQuery, setSearchQuery] = useState('');

  // Sample contacts to call (Faculty & Students)
  const contacts = [
    { id: 'usr_001', name: 'Dr. Raymond Park', role: 'Faculty HOD', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150', online: true },
    { id: 'usr_002', name: 'Dr. Marcus Chen', role: 'Professor', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150', online: true },
    { id: 'usr_004', name: 'Alex Rivera', role: 'Student Union HOD', avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150', online: false },
    { id: 'usr_005', name: 'Sophia Sterling', role: 'Researcher Lead', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150', online: true },
    { id: 'usr_006', name: 'Liam Thorne', role: 'Lab Assistant', avatar: 'https://images.unsplash.com/photo-1500048993953-d23a436266cf?w=150', online: false }
  ];

  // Call Logs (history)
  const [callLogs, setCallLogs] = useState([
    { id: 1, name: 'Dr. Raymond Park', type: 'incoming', duration: '12:45', date: 'Today, 10:30 AM', missed: false },
    { id: 2, name: 'Alex Rivera', type: 'outgoing', duration: '05:12', date: 'Yesterday, 3:15 PM', missed: false },
    { id: 3, name: 'Dr. Marcus Chen', type: 'incoming', duration: '00:00', date: 'Yesterday, 9:00 AM', missed: true },
    { id: 4, name: 'Sophia Sterling', type: 'outgoing', duration: '22:18', date: 'June 10, 4:20 PM', missed: false }
  ]);

  // Handle active timer in call
  useEffect(() => {
    let interval = null;
    if (callStatus === 'Connected') {
      interval = setInterval(() => {
        setCallTimer((prev) => prev + 1);
      }, 1000);
    } else {
      setCallTimer(0);
    }
    return () => clearInterval(interval);
  }, [callStatus]);

  const formatCallTimer = (sec) => {
    const mins = Math.floor(sec / 60);
    const secs = sec % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  // Dial out simulation
  const initiateCall = (contact) => {
    setActiveCall(contact);
    setCallStatus('Ringing');
    
    // Simulate ring delay
    setTimeout(() => {
      setCallStatus('Connected');
      // Add entry to call logs
      const now = new Date();
      const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      setCallLogs(prev => [
        {
          id: Date.now(),
          name: contact.name,
          type: 'outgoing',
          duration: '00:00',
          date: `Today, ${timeStr}`,
          missed: false
        },
        ...prev
      ]);
    }, 2500);
  };

  const endActiveCall = () => {
    setCallStatus('Disconnected');
    // Save final duration back to last log item
    if (activeCall) {
      setCallLogs(prev => {
        const copy = [...prev];
        if (copy.length > 0) {
          copy[0].duration = formatCallTimer(callTimer);
        }
        return copy;
      });
    }
    setActiveCall(null);
  };

  const filteredContacts = contacts.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    c.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex h-screen bg-brand-bg-primary text-brand-text-main overflow-hidden font-sans select-none relative" style={{ paddingLeft: '80px' }}>
      {/* 1. Global Suite Sidebar */}
      <SuiteSidebar />

      {/* 2. Left sidebar: Call History & Direct Directory Dial */}
      <div className="w-80 lg:w-90 border-r border-brand-border/40 bg-brand-bg-secondary/50 backdrop-blur-3xl flex flex-col shrink-0 h-full overflow-hidden">
        <div className="p-4 border-b border-white/5 flex flex-col gap-3 shrink-0">
          <h2 className="text-sm font-extrabold text-white tracking-wide">Direct Voice & Video</h2>
          
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Search contacts..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#102043]/50 border border-white/5 rounded-xl py-2 pl-9 pr-4 text-xs text-white placeholder-slate-400 outline-none focus:border-brand-primary/40"
            />
          </div>
        </div>

        {/* Directory list */}
        <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-3 chat-scroll">
          <div>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider pl-1.5 block mb-2">Available Contacts</span>
            <div className="flex flex-col gap-1">
              {filteredContacts.map(contact => (
                <div 
                  key={contact.id} 
                  className="p-2.5 rounded-xl hover:bg-white/[0.03] transition-all flex items-center justify-between border border-transparent hover:border-white/5"
                >
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <img src={contact.avatar} alt="Avatar" className="w-9 h-9 rounded-full object-cover" />
                      {contact.online && (
                        <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-[#0B1736]"></span>
                      )}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white leading-tight">{contact.name}</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">{contact.role}</p>
                    </div>
                  </div>

                  <div className="flex gap-1">
                    <button 
                      onClick={() => initiateCall(contact)}
                      disabled={callStatus !== 'Disconnected'}
                      className="p-2 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 transition-colors disabled:opacity-20 cursor-pointer"
                      title="Start Call"
                    >
                      <Phone className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <span className="w-full h-[1px] bg-white/5 my-2"></span>

          <div>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider pl-1.5 block mb-2">Recent Call Logs</span>
            <div className="flex flex-col gap-1.5">
              {callLogs.map(log => (
                <div key={log.id} className="p-2.5 bg-[#102043]/10 border border-white/5 rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className={`p-1.5 rounded-lg ${log.missed ? 'bg-rose-500/10 text-rose-400' : 'bg-slate-500/10 text-slate-400'}`}>
                      <Clock className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <p className="text-[11px] font-bold text-slate-200 leading-tight">{log.name}</p>
                      <p className="text-[9px] text-slate-400 mt-0.5">{log.date}</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-[9px] font-mono text-slate-500 uppercase font-semibold">
                      {log.missed ? 'Missed' : log.duration}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 3. Middle Area: Call display */}
      <div className="flex-1 flex flex-col h-full overflow-hidden bg-[#071126] relative">
        <AnimatePresence mode="wait">
          {callStatus === 'Disconnected' ? (
            // Idle screen
            <motion.div 
              key="idle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex-1 flex flex-col items-center justify-center p-8 text-center"
            >
              <div className="w-16 h-16 rounded-3xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mb-4 text-indigo-400">
                <Video className="w-8 h-8" />
              </div>
              <h3 className="text-sm font-bold text-white">Call Interface Offline</h3>
              <p className="text-xs text-slate-400 mt-2 max-w-xs leading-relaxed">
                Initiate a call using the contact selector list on the left to start a 1-to-1 WebRTC peer stream with CampusX Identity verification.
              </p>
            </motion.div>
          ) : callStatus === 'Ringing' ? (
            // Ringing dial out overlay
            <motion.div 
              key="ringing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex-1 flex flex-col items-center justify-center gap-6"
            >
              <div className="relative">
                <img 
                  src={activeCall.avatar} 
                  alt={activeCall.name} 
                  className="w-24 h-24 rounded-full border-4 border-indigo-500 object-cover pulse-call-button" 
                />
                <span className="absolute bottom-1 right-1 w-4 h-4 bg-yellow-500 rounded-full border-2 border-[#071126] animate-ping"></span>
              </div>
              <div className="text-center">
                <h3 className="text-base font-extrabold text-white">{activeCall.name}</h3>
                <p className="text-xs text-indigo-400 font-semibold uppercase tracking-wider mt-1 animate-pulse">DIALING VERIFIED ID...</p>
              </div>

              <button 
                onClick={endActiveCall}
                className="w-12 h-12 rounded-full bg-rose-600 hover:bg-rose-700 text-white flex items-center justify-center shadow-lg transition-transform hover:scale-105 cursor-pointer"
              >
                <PhoneOff className="w-5 h-5" />
              </button>
            </motion.div>
          ) : (
            // Active 1-to-1 Call view
            <motion.div 
              key="connected"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="flex-1 flex flex-col relative"
            >
              {/* Full screen remote camera frame */}
              <div className="flex-1 relative bg-[#050b1a] overflow-hidden">
                
                {/* Apply blur css conditionally */}
                <div className={`w-full h-full object-cover transition-all duration-300 ${
                  bgBlurLevel === 'low' ? 'blur-sm brightness-90' : bgBlurLevel === 'high' ? 'blur-xl brightness-75' : ''
                }`}>
                  <img src={activeCall.avatar} alt="Remote user stream" className="w-full h-full object-cover opacity-70" />
                </div>

                {/* Floating Self Camera View (Picture in Picture) */}
                <div className="absolute top-4 right-4 w-36 aspect-video rounded-xl bg-black border-2 border-white/10 overflow-hidden shadow-2xl z-10">
                  {isCameraOff ? (
                    <div className="w-full h-full bg-[#102043] flex flex-col items-center justify-center">
                      <VideoOff className="w-4 h-4 text-slate-400" />
                      <span className="text-[8px] text-slate-500 font-mono mt-1">Camera Off</span>
                    </div>
                  ) : (
                    <div className="w-full h-full relative">
                      <img 
                        src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150" 
                        alt="Aria Nakamura (Self)" 
                        className="w-full h-full object-cover opacity-80"
                      />
                      <span className="absolute bottom-1.5 left-1.5 text-[8px] bg-black/40 text-slate-200 px-1 py-0.5 rounded font-mono">Self (You)</span>
                    </div>
                  )}
                </div>

                {/* Telemetry info overlay in corner */}
                <div className="absolute bottom-4 left-4 bg-black/50 backdrop-blur-md border border-white/10 p-3 rounded-2xl flex flex-col gap-1 max-w-[200px] z-10">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">WebRTC Peer Health</span>
                  <div className="flex flex-col gap-0.5 text-[10px] font-mono text-slate-300">
                    <p className="flex justify-between gap-4">Latency: <span className="text-emerald-400">12ms</span></p>
                    <p className="flex justify-between gap-4">Resolution: <span className="text-emerald-400">1920x1080</span></p>
                    <p className="flex justify-between gap-4">Bitrate: <span className="text-emerald-400">4.2 Mbps</span></p>
                  </div>
                </div>

                {/* Center Audio waveform (if muted/audio only) */}
                {isCameraOff && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-0">
                    <div className="flex gap-1.5 items-center">
                      <span className="waveform-bar h-12 bg-indigo-500"></span>
                      <span className="waveform-bar h-16 bg-indigo-500"></span>
                      <span className="waveform-bar h-10 bg-indigo-500"></span>
                      <span className="waveform-bar h-14 bg-indigo-500"></span>
                      <span className="waveform-bar h-8 bg-indigo-500"></span>
                    </div>
                  </div>
                )}
              </div>

              {/* Call Control Footer */}
              <div className="h-[80px] border-t border-white/5 bg-[#0B1736]/60 flex items-center justify-between px-8 z-10 shrink-0">
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => setIsMuted(!isMuted)}
                    className={`w-11 h-11 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                      isMuted ? 'bg-rose-500 text-white hover:bg-rose-600' : 'bg-[#102043] text-slate-300 hover:bg-[#1c3979]'
                    }`}
                  >
                    {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                  </button>
                  <button 
                    onClick={() => setIsCameraOff(!isCameraOff)}
                    className={`w-11 h-11 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                      isCameraOff ? 'bg-rose-500 text-white hover:bg-rose-600' : 'bg-[#102043] text-slate-300 hover:bg-[#1c3979]'
                    }`}
                  >
                    {isCameraOff ? <VideoOff className="w-5 h-5" /> : <Video className="w-5 h-5" />}
                  </button>
                </div>

                {/* Timer Display */}
                <div className="text-center bg-[#102043] border border-white/5 rounded-2xl px-5 py-2">
                  <span className="text-xs font-bold text-slate-400 font-mono uppercase tracking-wider block text-[9px]">Active Session</span>
                  <span className="text-sm font-extrabold text-white font-mono">{formatCallTimer(callTimer)}</span>
                </div>

                <div className="flex items-center gap-3">
                  <button 
                    onClick={endActiveCall}
                    className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-extrabold flex items-center gap-1.5 shadow-lg shadow-rose-900/30 cursor-pointer"
                  >
                    <PhoneOff className="w-4 h-4" /> Disconnect
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 4. Right panel: Media Settings & Attestations */}
      <aside className="w-[380px] bg-[#0B1736] border-l border-white/5 flex flex-col h-full overflow-hidden shrink-0">
        <div className="p-4 border-b border-white/5 shrink-0 flex items-center justify-between">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider">Audio / Video Telemetry</h3>
          <Settings className="w-4 h-4 text-slate-400" />
        </div>

        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 chat-scroll">
          
          {/* Identity validation */}
          <div className="bg-[#102043]/30 border border-white/5 rounded-2xl p-4 flex flex-col gap-3">
            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" /> CampusX Identity Audit
            </h4>
            <p className="text-[10px] text-slate-400 leading-relaxed">
              Verifying active participant certificates using the distributed credential ledger hashes to confirm remote session integrity.
            </p>
            <div className="flex flex-col gap-1.5 text-[10px] font-mono bg-black/30 p-2.5 rounded-xl border border-white/5 text-slate-300">
              <p className="truncate">Local ID: did:campusx:usr_003</p>
              <p className="truncate">Remote ID: {activeCall ? `did:campusx:${activeCall.id}` : 'None connected'}</p>
              <p className="truncate text-emerald-400">Attestation: CONFIRMED_SECURE_HASH</p>
            </div>
          </div>

          {/* Media filters & noise suppression */}
          <div className="bg-[#102043]/30 border border-white/5 rounded-2xl p-4 flex flex-col gap-4">
            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" /> Camera Background Filter
            </h4>

            {/* Background blur radio selection */}
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'none', label: 'No Blur' },
                { id: 'low', label: 'Low Blur' },
                { id: 'high', label: 'High Blur' }
              ].map((blur) => (
                <button
                  key={blur.id}
                  onClick={() => setBgBlurLevel(blur.id)}
                  className={`py-1.5 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                    bgBlurLevel === blur.id 
                      ? 'bg-brand-primary text-white border border-transparent' 
                      : 'text-slate-400 hover:text-white bg-white/5 border border-white/5'
                  }`}
                >
                  {blur.label}
                </button>
              ))}
            </div>

            <span className="w-full h-[1px] bg-white/5"></span>

            <div className="flex items-center justify-between">
              <div>
                <h5 className="text-xs font-bold text-white">Active Noise Cancellation</h5>
                <p className="text-[9px] text-slate-500 mt-0.5">Filter out typing and click echoes.</p>
              </div>
              <input 
                type="checkbox" 
                checked={noiseCancellation}
                onChange={() => setNoiseCancellation(!noiseCancellation)}
                className="w-4 h-4 accent-brand-primary cursor-pointer"
              />
            </div>
          </div>

          {/* Volume controls */}
          <div className="bg-[#102043]/30 border border-white/5 rounded-2xl p-4 flex flex-col gap-3">
            <div className="flex justify-between items-center text-xs text-slate-200">
              <span className="flex items-center gap-1.5">
                <Volume2 className="w-4 h-4 text-slate-400" /> Output Volume
              </span>
              <span className="font-mono text-[10px]">{volume}%</span>
            </div>
            <input 
              type="range" 
              min="0" 
              max="100" 
              value={volume}
              onChange={(e) => setVolume(parseInt(e.target.value))}
              className="w-full accent-brand-primary cursor-pointer"
            />
          </div>

          {/* Call Telemetry graphs simulated */}
          <div className="bg-[#102043]/30 border border-white/5 rounded-2xl p-4 flex flex-col gap-2">
            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-cyan-400" /> Jitter & Packet Telemetry
            </h4>
            <div className="h-16 flex items-end gap-1 px-1 bg-black/20 rounded-xl border border-white/5 pt-2">
              {[20, 30, 25, 40, 15, 20, 25, 30, 22, 28, 35, 10, 15, 20, 24, 32, 18, 12, 16, 20].map((h, i) => (
                <div 
                  key={i} 
                  className="flex-1 bg-cyan-400/80 rounded-t" 
                  style={{ height: `${h}%` }}
                />
              ))}
            </div>
            <div className="flex justify-between text-[8px] font-mono text-slate-500 mt-1">
              <span>Jitter: 1.4ms</span>
              <span>Loss: 0.00%</span>
            </div>
          </div>

        </div>
      </aside>
    </div>
  );
}

export default function CallsPage() {
  return (
    <ConnectProvider>
      <CallsPageContent />
    </ConnectProvider>
  );
}
