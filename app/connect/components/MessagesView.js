'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, 
  Mic, 
  MicOff, 
  Send, 
  Video, 
  VideoOff, 
  Phone, 
  PhoneOff, 
  Info, 
  Sparkles, 
  X, 
  Paperclip, 
  ShieldCheck, 
  ChevronDown, 
  ChevronRight, 
  Trash2, 
  Copy, 
  Pin, 
  Check 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useConnect } from '../ConnectContext';
import SidebarContactItem from './SidebarContactItem';
import ChatHeader from './ChatHeader';

// Default Sectioned Threads with Accurate Online Status
const defaultThreads = [
  // 1. PINNED & AI ASSISTANT
  { 
    id: 'ai_chat', 
    name: 'CampusX AI Copilot', 
    role: 'AI System Assistant', 
    dept: 'AI Research Lab', 
    avatar: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=150', 
    online: true, 
    status: 'System Online', 
    category: 'ai', 
    sectionId: 'pinned',
    sectionTitle: '📌 PINNED & AI',
    unread: 0, 
    lastMsg: 'Hello! I am your AI Copilot. Let me know if you need assistance.', 
    time: 'Just now' 
  },

  // 2. DIRECT MESSAGES
  { 
    id: 'usr_001', 
    name: 'Dr. Raymond Park', 
    role: 'Faculty HOD', 
    dept: 'Computer Science', 
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150', 
    online: true, 
    status: 'Active Now', 
    category: 'faculty', 
    sectionId: 'direct',
    sectionTitle: '💬 DIRECT MESSAGES',
    unread: 2, 
    lastMsg: 'Please submit the draft review by tonight.', 
    time: '10:30 AM' 
  },
  { 
    id: 'usr_002', 
    name: 'Dr. Evelyn Sterling', 
    role: 'Professor & Lead Researcher', 
    dept: 'Computer Science', 
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150', 
    online: false, 
    status: 'Offline', 
    category: 'faculty', 
    sectionId: 'direct',
    sectionTitle: '💬 DIRECT MESSAGES',
    unread: 0, 
    lastMsg: 'The midterm scores are posted.', 
    time: 'Yesterday' 
  },
  { 
    id: 'usr_005', 
    name: 'Carlos Mendez', 
    role: 'Student Representative', 
    dept: 'Electrical Eng', 
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150', 
    online: false, 
    status: 'Active 2h ago', 
    category: 'students', 
    sectionId: 'direct',
    sectionTitle: '💬 DIRECT MESSAGES',
    unread: 1, 
    lastMsg: 'Ready for the lab project discussion?', 
    time: '9:15 AM' 
  },

  // 3. CHANNELS & GROUPS
  { 
    id: 'channel_general', 
    name: 'General Campus Channel', 
    role: 'Official Broadcast', 
    dept: 'University Wide', 
    avatar: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=150', 
    online: true, 
    status: 'Campus Broadcast', 
    category: 'departments', 
    sectionId: 'channels',
    sectionTitle: '👥 CHANNELS & GROUPS',
    unread: 0, 
    lastMsg: 'Welcome to the campus main channel.', 
    time: '10:15 AM' 
  },

  // 4. RESEARCH LABS
  { 
    id: 'res_dl_models', 
    name: 'AI Deep Learning Lab', 
    role: 'Research Group', 
    dept: 'AI Research', 
    avatar: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=150', 
    online: false, 
    status: 'Lab Offline', 
    category: 'research', 
    sectionId: 'research',
    sectionTitle: '🔬 RESEARCH & LABS',
    unread: 0, 
    lastMsg: 'Research paper draft updated.', 
    time: 'June 10' 
  }
];

const sectionsList = [
  { id: 'pinned', title: '📌 PINNED & AI' },
  { id: 'direct', title: '💬 DIRECT MESSAGES' },
  { id: 'channels', title: '👥 CHANNELS & GROUPS' },
  { id: 'research', title: '🔬 RESEARCH & LABS' }
];

const quickEmojis = ['👍', '❤️', '🔥', '🙌', '🤖'];

// Futuristic AI Holographic Visualizer: Cybernetic Rabbit Mascot + Quantum Glowing Butterflies
function AiRabbitButterflyVisualizer() {
  return (
    <div className="relative w-full h-full flex items-center justify-center bg-gradient-to-b from-[#080D1A] via-[#0D1527] to-[#060913] overflow-hidden select-none">
      
      {/* Background Quantum Grid & Nebula Particles */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgba(99,102,241,0.2),transparent_70%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:28px_28px] opacity-40" />

      {/* Floating Glowing Quantum Butterflies */}
      {/* Butterfly 1 (Cyan / Sky) */}
      <motion.div
        animate={{
          x: [0, 50, -30, 40, 0],
          y: [0, -40, 20, -30, 0],
          rotate: [0, 15, -12, 10, 0]
        }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-10 left-12 sm:left-20 z-20 pointer-events-none"
      >
        <div className="relative flex items-center justify-center">
          <div className="flex items-center gap-0.5 filter drop-shadow-[0_0_14px_rgba(56,189,248,0.9)]">
            {/* Left Wing */}
            <motion.div
              animate={{ rotateY: [0, 68, 0] }}
              transition={{ duration: 0.26, repeat: Infinity, ease: "easeInOut" }}
              className="w-7 h-8 bg-gradient-to-br from-cyan-300 via-sky-400 to-indigo-500 rounded-tl-[90%] rounded-bl-[60%] rounded-tr-[30%] opacity-90 border border-white/50"
            />
            {/* Body */}
            <div className="w-1.5 h-6 bg-slate-950 rounded-full border border-cyan-300 shadow-[0_0_10px_#38bdf8]" />
            {/* Right Wing */}
            <motion.div
              animate={{ rotateY: [0, -68, 0] }}
              transition={{ duration: 0.26, repeat: Infinity, ease: "easeInOut" }}
              className="w-7 h-8 bg-gradient-to-bl from-cyan-300 via-sky-400 to-indigo-500 rounded-tr-[90%] rounded-br-[60%] rounded-tl-[30%] opacity-90 border border-white/50"
            />
          </div>
          <span className="absolute -bottom-2 w-2 h-2 rounded-full bg-cyan-300 animate-ping opacity-70" />
        </div>
      </motion.div>

      {/* Butterfly 2 (Glowing Magenta / Pink) */}
      <motion.div
        animate={{
          x: [0, -40, 30, -25, 0],
          y: [0, 35, -30, 25, 0],
          rotate: [0, -14, 12, -10, 0]
        }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute top-14 right-14 sm:right-24 z-20 pointer-events-none"
      >
        <div className="relative flex items-center justify-center">
          <div className="flex items-center gap-0.5 filter drop-shadow-[0_0_16px_rgba(244,114,182,0.9)]">
            <motion.div
              animate={{ rotateY: [0, 68, 0] }}
              transition={{ duration: 0.22, repeat: Infinity, ease: "easeInOut" }}
              className="w-6 h-7 bg-gradient-to-br from-pink-300 via-rose-400 to-purple-500 rounded-tl-[90%] rounded-bl-[60%] rounded-tr-[30%] opacity-90 border border-white/50"
            />
            <div className="w-1.5 h-5 bg-slate-950 rounded-full border border-pink-300 shadow-[0_0_10px_#f472b6]" />
            <motion.div
              animate={{ rotateY: [0, -68, 0] }}
              transition={{ duration: 0.22, repeat: Infinity, ease: "easeInOut" }}
              className="w-6 h-7 bg-gradient-to-bl from-pink-300 via-rose-400 to-purple-500 rounded-tr-[90%] rounded-br-[60%] rounded-tl-[30%] opacity-90 border border-white/50"
            />
          </div>
          <span className="absolute -bottom-2 w-2 h-2 rounded-full bg-pink-300 animate-ping opacity-70" />
        </div>
      </motion.div>

      {/* Butterfly 3 (Amber / Emerald) */}
      <motion.div
        animate={{
          x: [0, 30, -20, 25, 0],
          y: [0, -25, 25, -15, 0],
          rotate: [0, 12, -10, 8, 0]
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        className="absolute bottom-14 left-16 sm:left-28 z-20 pointer-events-none hidden sm:block"
      >
        <div className="relative flex items-center justify-center">
          <div className="flex items-center gap-0.5 filter drop-shadow-[0_0_14px_rgba(251,191,36,0.85)]">
            <motion.div
              animate={{ rotateY: [0, 68, 0] }}
              transition={{ duration: 0.28, repeat: Infinity, ease: "easeInOut" }}
              className="w-5 h-6 bg-gradient-to-br from-amber-300 via-yellow-300 to-emerald-400 rounded-tl-[90%] rounded-bl-[60%] opacity-90 border border-white/40"
            />
            <div className="w-1 h-4 bg-slate-950 rounded-full border border-amber-300" />
            <motion.div
              animate={{ rotateY: [0, -68, 0] }}
              transition={{ duration: 0.28, repeat: Infinity, ease: "easeInOut" }}
              className="w-5 h-6 bg-gradient-to-bl from-amber-300 via-yellow-300 to-emerald-400 rounded-tr-[90%] rounded-br-[60%] opacity-90 border border-white/40"
            />
          </div>
        </div>
      </motion.div>

      {/* Center Cybernetic Mascot Rabbit Hologram */}
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
        className="relative z-10 flex flex-col items-center justify-center"
      >
        {/* Hologram Aura Halo */}
        <div className="absolute -inset-8 rounded-full bg-gradient-to-tr from-indigo-500/25 via-purple-500/25 to-cyan-500/25 blur-xl animate-pulse" />
        
        {/* Cyber Rabbit Mascot SVG Artwork */}
        <div className="relative w-44 h-44 sm:w-52 sm:h-52 filter drop-shadow-[0_0_28px_rgba(99,102,241,0.65)]">
          <svg viewBox="0 0 200 200" className="w-full h-full overflow-visible">
            {/* Ambient Tech Rings */}
            <circle cx="100" cy="100" r="92" fill="none" stroke="rgba(99,102,241,0.3)" strokeWidth="1.5" strokeDasharray="6 4" />
            <circle cx="100" cy="100" r="82" fill="none" stroke="rgba(56,189,248,0.35)" strokeWidth="1" />

            {/* Left Ear */}
            <g className="origin-bottom transform transition-transform">
              <path
                d="M 68 100 C 45 40, 50 5, 68 15 C 82 25, 85 60, 78 100 Z"
                fill="url(#rabbitBodyGrad)"
                stroke="#6366f1"
                strokeWidth="2.5"
              />
              <path
                d="M 68 85 C 55 45, 58 20, 68 25 C 76 30, 78 55, 74 85 Z"
                fill="url(#earInnerGrad)"
                opacity="0.85"
              />
            </g>

            {/* Right Ear */}
            <g className="origin-bottom transform transition-transform">
              <path
                d="M 132 100 C 155 40, 150 5, 132 15 C 118 25, 115 60, 122 100 Z"
                fill="url(#rabbitBodyGrad)"
                stroke="#6366f1"
                strokeWidth="2.5"
              />
              <path
                d="M 132 85 C 145 45, 142 20, 132 25 C 124 30, 122 55, 126 85 Z"
                fill="url(#earInnerGrad)"
                opacity="0.85"
              />
            </g>

            {/* Head */}
            <ellipse
              cx="100"
              cy="125"
              rx="52"
              ry="45"
              fill="url(#rabbitBodyGrad)"
              stroke="#818cf8"
              strokeWidth="2.5"
            />

            {/* Tech Sensor Forehead */}
            <polygon points="100,92 106,102 94,102" fill="#38bdf8" />
            <circle cx="100" cy="99" r="2.5" fill="#ffffff" className="animate-ping" />

            {/* Left Glowing Cyber Eye */}
            <ellipse cx="80" cy="122" rx="7.5" ry="9" fill="#030712" stroke="#38bdf8" strokeWidth="2" />
            <circle cx="82" cy="120" r="3.5" fill="#38bdf8" />
            <circle cx="84" cy="118" r="1.5" fill="#ffffff" />

            {/* Right Glowing Cyber Eye */}
            <ellipse cx="120" cy="122" rx="7.5" ry="9" fill="#030712" stroke="#38bdf8" strokeWidth="2" />
            <circle cx="122" cy="120" r="3.5" fill="#38bdf8" />
            <circle cx="124" cy="118" r="1.5" fill="#ffffff" />

            {/* Nose & Mouth */}
            <polygon points="100,133 104,129 96,129" fill="#f472b6" />
            <path d="M 96 137 Q 100 142 100 135 Q 100 142 104 137" fill="none" stroke="#e0e7ff" strokeWidth="2" strokeLinecap="round" />

            {/* Whiskers */}
            <line x1="62" y1="128" x2="42" y2="124" stroke="#818cf8" strokeWidth="1.5" strokeLinecap="round" opacity="0.85" />
            <line x1="60" y1="134" x2="40" y2="136" stroke="#818cf8" strokeWidth="1.5" strokeLinecap="round" opacity="0.85" />
            <line x1="138" y1="128" x2="158" y2="124" stroke="#818cf8" strokeWidth="1.5" strokeLinecap="round" opacity="0.85" />
            <line x1="140" y1="134" x2="160" y2="136" stroke="#818cf8" strokeWidth="1.5" strokeLinecap="round" opacity="0.85" />

            {/* Cheeks Glow */}
            <ellipse cx="68" cy="132" rx="7" ry="4" fill="#f472b6" opacity="0.45" />
            <ellipse cx="132" cy="132" rx="7" ry="4" fill="#f472b6" opacity="0.45" />

            {/* Gradients */}
            <defs>
              <linearGradient id="rabbitBodyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#1e1b4b" />
                <stop offset="50%" stopColor="#312e81" />
                <stop offset="100%" stopColor="#0f172a" />
              </linearGradient>
              <linearGradient id="earInnerGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#f472b6" />
                <stop offset="100%" stopColor="#818cf8" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* AI Audio Waveform Visualizer Bars */}
        <div className="flex items-center gap-1.5 mt-2 bg-black/50 backdrop-blur-md px-4 py-1.5 rounded-full border border-indigo-500/40 shadow-xl">
          <span className="text-[11px] font-mono font-bold text-cyan-400 mr-2 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-pink-400" />
            Neural AI Synced
          </span>
          {[8, 16, 24, 14, 28, 18, 12, 22, 10, 20, 14, 8].map((height, i) => (
            <motion.div
              key={i}
              animate={{ height: [height * 0.35, height, height * 0.35] }}
              transition={{ duration: 0.6 + (i % 4) * 0.15, repeat: Infinity, ease: "easeInOut" }}
              className="w-1 bg-gradient-to-t from-indigo-500 via-cyan-400 to-pink-400 rounded-full"
              style={{ height: `${height}px` }}
            />
          ))}
        </div>
      </motion.div>

      {/* Floating Header Banner */}
      <div className="absolute top-4 left-6 z-20 flex items-center gap-2">
        <span className="px-3.5 py-1 rounded-full bg-indigo-950/70 border border-indigo-400/40 text-indigo-200 text-xs font-mono font-semibold flex items-center gap-1.5 backdrop-blur-md shadow-lg">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          CampusX Neural Visual Feed (HD 1080p)
        </span>
      </div>

    </div>
  );
}

export default function MessagesView() {
  const { 
    currentUser, 
    users,
    chatMessages, 
    handleChatSend, 
    handleToggleReaction,
    handleDeleteMessage,
    handlePinMessage,
    activeChatChannel, 
    setActiveChatChannel,
    startCall,
    endCall,
    simulateAnswerCall,
    activeCallUser,
    callStatus,
    isMuted,
    setIsMuted,
    isCamOff,
    setIsCamOff
  } = useConnect();

  const [threads, setThreads] = useState(defaultThreads);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [collapsedSections, setCollapsedSections] = useState({});
  const [inputText, setInputText] = useState('');
  const [attachedFile, setAttachedFile] = useState(null);
  const [attachedPreview, setAttachedPreview] = useState(null);
  const [isRecordingVoice, setIsRecordingVoice] = useState(false);
  const [voiceTimer, setVoiceTimer] = useState(0);
  const [callTimer, setCallTimer] = useState(0);
  const [showDetails, setShowDetails] = useState(true);
  const [hoveredMsgId, setHoveredMsgId] = useState(null);
  const [copiedMsgId, setCopiedMsgId] = useState(null);

  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const localVideoRef = useRef(null);
  const localStreamRef = useRef(null);

  // Sync users dynamically into direct message threads - ONLY show online when actually online
  useEffect(() => {
    if (users && users.length > 0) {
      const isUserOnline = (u) => {
        if (u.online === true) return true;
        if (typeof u.status === 'string' && (u.status.toLowerCase().includes('active now') || u.status.toLowerCase() === 'online')) return true;
        return false;
      };

      const userThreads = users
        .filter(u => !currentUser || u.id !== currentUser.id)
        .map(u => {
          const isOnline = isUserOnline(u);
          return {
            id: u.id,
            name: u.name,
            role: u.role === 'faculty' ? 'Faculty Professor' : u.role === 'student' ? 'Student' : (u.role || 'Campus Member'),
            dept: u.department || u.dept || 'CampusX University',
            avatar: u.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
            online: isOnline,
            status: u.status || (isOnline ? 'Active Now' : 'Offline'),
            category: u.role === 'faculty' ? 'faculty' : 'students',
            sectionId: 'direct',
            sectionTitle: '💬 DIRECT MESSAGES',
            unread: 0,
            lastMsg: 'Tap to chat directly...',
            time: isOnline ? 'Active' : 'Offline'
          };
        });

      const combined = [
        ...defaultThreads.filter(t => t.id === 'ai_chat' || t.id.startsWith('channel_') || t.id.startsWith('res_')),
        ...userThreads.filter(ut => !defaultThreads.some(dt => dt.id === ut.id))
      ];
      setThreads(combined);
    }
  }, [users, currentUser]);

  const selectedThread = threads.find(t => t.id === activeChatChannel) || threads[0];

  const toggleSection = (secId) => {
    setCollapsedSections(prev => ({
      ...prev,
      [secId]: !prev[secId]
    }));
  };

  // Auto scroll
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages, activeChatChannel]);

  // Voice recording timer
  useEffect(() => {
    let interval = null;
    if (isRecordingVoice) {
      interval = setInterval(() => setVoiceTimer(prev => prev + 1), 1000);
    } else {
      setVoiceTimer(0);
    }
    return () => clearInterval(interval);
  }, [isRecordingVoice]);

  // Call timer
  useEffect(() => {
    let interval = null;
    if (callStatus === 'Connected') {
      interval = setInterval(() => setCallTimer(prev => prev + 1), 1000);
    } else {
      setCallTimer(0);
    }
    return () => clearInterval(interval);
  }, [callStatus]);

  // Local camera stream for video call
  useEffect(() => {
    if (activeCallUser && activeCallUser.callMode === 'video') {
      navigator.mediaDevices?.getUserMedia({ video: true, audio: true })
        .then(stream => {
          localStreamRef.current = stream;
          if (localVideoRef.current) {
            localVideoRef.current.srcObject = stream;
          }
        })
        .catch(err => {
          console.warn('Webcam fallback:', err.message);
        });
    }

    return () => {
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, [activeCallUser]);

  const formatTimer = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const filteredThreads = threads.filter(t => {
    const matchSearch = t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        t.dept.toLowerCase().includes(searchQuery.toLowerCase());
    const matchCat = activeCategory === 'all' || t.category === activeCategory;
    return matchSearch && matchCat;
  });

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setAttachedFile(file);
    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      setAttachedPreview(uploadEvent.target.result);
    };
    reader.readAsDataURL(file);
  };

  const onSendMessage = (e) => {
    if (e) e.preventDefault();
    if (!inputText.trim() && !attachedFile && !attachedPreview) return;

    let mediaType = null;
    let mediaUrl = attachedPreview;
    let fileName = attachedFile ? attachedFile.name : null;

    if (attachedFile) {
      if (attachedFile.type.startsWith('image/')) mediaType = 'image';
      else if (attachedFile.type.includes('pdf')) mediaType = 'pdf';
      else if (attachedFile.type.startsWith('video/')) mediaType = 'video';
      else mediaType = 'file';
    } else if (attachedPreview) {
      if (typeof attachedPreview === 'string' && attachedPreview.startsWith('data:image/')) mediaType = 'image';
      else if (typeof attachedPreview === 'string' && attachedPreview.startsWith('data:application/pdf')) mediaType = 'pdf';
      else mediaType = 'file';
    }

    handleChatSend(inputText.trim(), mediaUrl, mediaType, fileName);
    setInputText('');
    setAttachedFile(null);
    setAttachedPreview(null);
  };

  const toggleVoiceRecording = () => {
    if (isRecordingVoice) {
      setIsRecordingVoice(false);
      handleChatSend(`🎤 Voice Note (${formatTimer(voiceTimer)})`, null, 'audio');
    } else {
      setIsRecordingVoice(true);
    }
  };

  const copyToClipboard = (text, id) => {
    navigator.clipboard?.writeText(text);
    setCopiedMsgId(id);
    setTimeout(() => setCopiedMsgId(null), 1500);
  };

  const currentMessages = chatMessages[activeChatChannel] || [];

  return (
    <div className="w-full h-[calc(100vh-6.5rem)] min-h-[580px] max-h-[calc(100vh-6.5rem)] max-w-full bg-white border border-slate-200/80 rounded-3xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex relative select-none">
      
      {/* 1. Section-Wise Direct Messaging Contacts Sidebar (350px - 380px) */}
      <div className="w-88 lg:w-96 border-r border-slate-200/80 flex flex-col shrink-0 bg-slate-50/70 h-full">
        
        {/* Header */}
        <div className="p-4 border-b border-slate-200/80 relative flex items-center justify-center bg-white text-center shrink-0">
          <div className="flex flex-col items-center justify-center">
            <h2 className="text-base font-display font-bold text-slate-900 flex items-center justify-center gap-2">
              Messenger
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.4)]" />
            </h2>
            <p className="text-[11px] text-slate-500 font-medium text-center">Campus Messages & Chat</p>
          </div>
          <button 
            onClick={() => setActiveChatChannel('ai_chat')}
            className="absolute right-4 p-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 rounded-xl border border-indigo-200 transition-all cursor-pointer shadow-sm"
            title="CampusX AI Copilot"
          >
            <Sparkles className="w-4 h-4" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="p-3 border-b border-slate-200/80 bg-white shrink-0">
          <div className="flex items-center bg-slate-50 border border-slate-200 rounded-2xl px-3.5 py-2.5 gap-2.5 shadow-sm focus-within:border-indigo-500 focus-within:bg-white focus-within:ring-2 focus-within:ring-indigo-500/10 transition-all">
            <Search className="w-4 h-4 text-slate-400 shrink-0 pointer-events-none" />
            <input 
              type="text"
              placeholder="Search contacts, departments..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 min-w-0 bg-transparent border-none text-xs text-slate-800 outline-none placeholder-slate-400 font-medium"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="text-slate-400 hover:text-slate-700 shrink-0 cursor-pointer">
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Category Pills */}
        <div className="px-3 py-2.5 border-b border-slate-200/80 flex gap-2 overflow-x-auto no-scrollbar bg-slate-50 shrink-0">
          {['all', 'faculty', 'students', 'ai'].map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold capitalize transition-all cursor-pointer whitespace-nowrap ${
                activeCategory === cat
                  ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-md shadow-indigo-500/20'
                  : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200 shadow-sm'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Section-Wise Accordion List - Smooth Scrolling */}
        <div className="flex-1 min-h-0 overflow-y-auto p-2.5 sm:p-3 space-y-3 custom-chat-scrollbar overscroll-contain">
          {sectionsList.map(sec => {
            const secThreads = filteredThreads.filter(t => t.sectionId === sec.id);
            if (secThreads.length === 0) return null;
            const isCollapsed = collapsedSections[sec.id];

            return (
              <div key={sec.id} className="space-y-1">
                {/* Section Header */}
                <div 
                  onClick={() => toggleSection(sec.id)}
                  className="flex items-center justify-between px-3 py-2 w-full cursor-pointer select-none text-slate-500 hover:text-slate-900 group rounded-xl hover:bg-slate-200/50 transition-all"
                >
                  <span className="text-[10px] font-extrabold uppercase tracking-wider flex items-center gap-1.5 truncate">
                    {isCollapsed ? <ChevronRight className="w-3.5 h-3.5 shrink-0" /> : <ChevronDown className="w-3.5 h-3.5 shrink-0" />}
                    <span className="truncate">{sec.title}</span>
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-white border border-slate-200 text-[10px] font-mono font-bold text-slate-600 shadow-xs shrink-0 ml-2">
                    {secThreads.length}
                  </span>
                </div>

                {/* Threads using standardized 3-column SidebarContactItem */}
                {!isCollapsed && (
                  <div className="space-y-1">
                    {secThreads.map(t => (
                      <SidebarContactItem
                        key={t.id}
                        thread={t}
                        isSelected={activeChatChannel === t.id}
                        onSelect={setActiveChatChannel}
                        onQuickCall={startCall}
                      />
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. Main Direct Chat Conversation Canvas */}
      <div className="flex-1 min-w-0 h-full flex flex-col bg-[#F8FAFC] relative overflow-hidden">
        
        {/* Chat Header adhering to standardized specs */}
        <div className="shrink-0">
          <ChatHeader
            thread={selectedThread}
            onStartCall={startCall}
            onToggleDetails={() => setShowDetails(!showDetails)}
            showDetails={showDetails}
          />
        </div>

        {/* Message Stream */}
        <div className="flex-1 min-h-0 overflow-y-auto p-5 space-y-4 custom-chat-scrollbar overscroll-contain">
          {currentMessages.map((msg) => {
            const isSelf = msg.senderId === currentUser?.id || msg.senderName === currentUser?.name || msg.senderId === 'usr_me';
            const isHovered = hoveredMsgId === msg.id;

            return (
              <div
                key={msg.id}
                onMouseEnter={() => setHoveredMsgId(msg.id)}
                onMouseLeave={() => setHoveredMsgId(null)}
                className={`flex items-end gap-2.5 ${isSelf ? 'flex-row-reverse' : 'flex-row'} relative`}
              >
                {!isSelf && (
                  <img src={msg.senderAvatar || selectedThread.avatar || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150'} alt="" className="w-7 h-7 rounded-full object-cover mb-1 shrink-0 border border-slate-200 shadow-xs" />
                )}
                <div className={`flex flex-col max-w-[70%] ${isSelf ? 'items-end' : 'items-start'}`}>
                  <span className="text-[10px] text-slate-400 mb-1 px-1 flex items-center gap-1 font-medium">
                    <span>{isSelf ? 'You' : msg.senderName}</span>
                    <span>•</span>
                    <span>{msg.time}</span>
                    {msg.pinned && <Pin className="w-3 h-3 text-amber-500 rotate-45" />}
                  </span>
                  <div
                    className={`p-3.5 rounded-2xl text-xs leading-relaxed border ${
                      isSelf
                        ? 'bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-600 text-white rounded-br-xs shadow-md shadow-indigo-500/10 border-indigo-600'
                        : 'bg-white border-slate-200/90 text-slate-800 rounded-bl-xs shadow-xs'
                    }`}
                  >
                    {msg.mediaUrl && (
                      (msg.mediaType === 'image' || (!msg.mediaType && (typeof msg.mediaUrl === 'string' && (msg.mediaUrl.match(/\.(jpeg|jpg|gif|png|webp)/i) || msg.mediaUrl.startsWith('data:image/'))))) ? (
                        <img src={msg.mediaUrl} alt={msg.fileName || "attachment"} className="max-h-52 w-full object-cover rounded-xl mb-2 shadow-xs border border-white/20" />
                      ) : msg.mediaType === 'video' ? (
                        <video src={msg.mediaUrl} controls className="max-h-52 w-full rounded-xl mb-2 shadow-xs" />
                      ) : (
                        <a 
                          href={msg.mediaUrl} 
                          download={msg.fileName || "document"} 
                          target="_blank" 
                          rel="noreferrer"
                          className={`flex items-center gap-2 p-2.5 rounded-xl mb-2 transition-all cursor-pointer ${
                            isSelf ? 'bg-white/20 hover:bg-white/30 text-white' : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                          }`}
                        >
                          <Paperclip className="w-4 h-4 shrink-0" />
                          <span className="text-xs font-semibold truncate flex-1">{msg.fileName || 'Attached Document'}</span>
                          <span className="text-[10px] uppercase font-bold opacity-80 shrink-0">Download</span>
                        </a>
                      )
                    )}
                    {msg.text && <p className="whitespace-pre-wrap font-medium">{msg.text}</p>}

                    {/* Reactions Badges */}
                    {msg.reactions && Object.keys(msg.reactions).length > 0 && (
                      <div className="flex gap-1 mt-2 flex-wrap">
                        {Object.entries(msg.reactions).map(([emoji, count]) => (
                          <button
                            key={emoji}
                            onClick={() => handleToggleReaction(activeChatChannel, msg.id, emoji)}
                            className="px-2 py-0.5 rounded-full bg-slate-50 border border-slate-200 text-[10px] flex items-center gap-1 cursor-pointer text-slate-700 shadow-2xs"
                          >
                            <span>{emoji}</span>
                            <span className="font-bold">{count}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Hover Reaction Toolbar */}
                {isHovered && (
                  <div className={`absolute top-0 ${isSelf ? 'right-full mr-2' : 'left-full ml-2'} bg-white border border-slate-200 rounded-2xl p-1.5 shadow-xl flex items-center gap-1 z-20`}>
                    {quickEmojis.map(emoji => (
                      <button
                        key={emoji}
                        onClick={() => handleToggleReaction(activeChatChannel, msg.id, emoji)}
                        className="p-1 hover:bg-slate-100 rounded-lg text-xs transition-all cursor-pointer hover:scale-125"
                      >
                        {emoji}
                      </button>
                    ))}
                    <div className="w-px h-3 bg-slate-200 mx-0.5" />
                    <button
                      onClick={() => handlePinMessage(activeChatChannel, msg.id)}
                      className="p-1 hover:bg-amber-50 rounded-lg text-slate-400 hover:text-amber-500 transition-all cursor-pointer"
                    >
                      <Pin className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => copyToClipboard(msg.text, msg.id)}
                      className="p-1 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-800 transition-all cursor-pointer"
                    >
                      {copiedMsgId === msg.id ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                    {isSelf && (
                      <button
                        onClick={() => handleDeleteMessage(activeChatChannel, msg.id)}
                        className="p-1 hover:bg-rose-50 rounded-lg text-slate-400 hover:text-rose-600 transition-all cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                )}
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* Attachment preview */}
        {attachedPreview && (
          <div className="px-4 py-2 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <img src={attachedPreview} alt="" className="w-10 h-10 rounded-xl object-cover border border-slate-200 shadow-xs" />
              <span className="text-xs font-semibold text-slate-700">Attachment ready to send</span>
            </div>
            <button onClick={() => { setAttachedFile(null); setAttachedPreview(null); }} className="text-slate-400 hover:text-slate-700 p-1">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Composer Form - Locked & Stable */}
        <form onSubmit={onSendMessage} className="shrink-0 sticky bottom-0 z-20 p-3.5 px-4 border-t border-slate-200/80 bg-white/95 backdrop-blur-xl flex items-center gap-2.5">
          <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*,video/*,application/pdf" />

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="p-2.5 bg-slate-50 border border-slate-200 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all cursor-pointer shadow-2xs"
          >
            <Paperclip className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={toggleVoiceRecording}
            className={`p-2.5 rounded-xl border transition-all cursor-pointer shadow-2xs ${
              isRecordingVoice ? 'bg-rose-500 border-rose-600 text-white animate-pulse' : 'bg-slate-50 border-slate-200 text-slate-500 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Mic className="w-4 h-4" />
          </button>

          {isRecordingVoice ? (
            <div className="flex-1 bg-rose-50 border border-rose-200 rounded-2xl px-4 py-2.5 flex items-center justify-between text-xs font-bold text-rose-600">
              <span className="animate-pulse">Recording Voice Note... {formatTimer(voiceTimer)}</span>
              <button type="button" onClick={toggleVoiceRecording} className="underline cursor-pointer">Send</button>
            </div>
          ) : (
            <input
              type="text"
              placeholder={`Message ${selectedThread.name}...`}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="flex-1 min-w-0 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-xs text-slate-800 outline-none focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-500/10 transition-all placeholder-slate-400 shadow-inner font-medium"
            />
          )}

          <button
            type="submit"
            disabled={!inputText.trim() && !attachedFile && !attachedPreview}
            className="p-2.5 px-3.5 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:brightness-105 disabled:opacity-40 text-white rounded-xl shadow-md shadow-indigo-500/20 transition-all cursor-pointer shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>

      {/* 3. Right Profile Details Sidebar (320px - 360px) */}
      {showDetails && (
        <div className="w-80 lg:w-90 border-l border-slate-200/80 bg-slate-50/70 p-6 hidden xl:flex flex-col gap-6 shrink-0 h-full overflow-y-auto custom-chat-scrollbar">
          {/* User Profile Card Header */}
          <div className="flex flex-col items-center text-center pb-5 border-b border-slate-200/80">
            <div className="relative mb-3">
              <img src={selectedThread.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'} alt="" className="w-20 h-20 rounded-full object-cover border-2 border-indigo-200 shadow-md" />
              <span className={`absolute bottom-0.5 right-0.5 w-4 h-4 rounded-full border-2 border-white shadow-xs ${selectedThread.online ? 'bg-emerald-500' : 'bg-slate-400'}`} />
            </div>
            <h3 className="text-sm font-extrabold text-slate-900 font-display">{selectedThread.name}</h3>
            <span className="text-[11px] font-bold text-indigo-700 bg-indigo-50 px-3 py-1 rounded-full mt-1.5 border border-indigo-200 shadow-2xs">{selectedThread.role || 'Member'}</span>
            <p className="text-[11px] font-medium text-slate-500 mt-1">{selectedThread.dept || 'CampusX Enterprise'}</p>
          </div>

          {/* Action Call Buttons */}
          <div className="grid grid-cols-2 gap-3.5">
            <button onClick={() => startCall(selectedThread, 'audio')} className="p-3.5 bg-white border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/50 rounded-2xl text-center cursor-pointer shadow-2xs transition-all group">
              <Phone className="w-4 h-4 text-indigo-600 mx-auto mb-1 group-hover:scale-110 transition-transform" />
              <span className="text-xs font-bold text-slate-800 block">Audio Call</span>
            </button>
            <button onClick={() => startCall(selectedThread, 'video')} className="p-3.5 bg-white border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/50 rounded-2xl text-center cursor-pointer shadow-2xs transition-all group">
              <Video className="w-4 h-4 text-indigo-600 mx-auto mb-1 group-hover:scale-110 transition-transform" />
              <span className="text-xs font-bold text-slate-800 block">Video Call</span>
            </button>
          </div>

          {/* Security & Info Cards */}
          <div className="flex flex-col gap-3.5">
            <div className="p-4 bg-white border border-slate-200/80 rounded-2xl flex flex-col gap-1 shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Security Clearance</span>
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
              </div>
              <span className="text-xs font-bold text-slate-900 font-mono">256-bit P2P Encrypted</span>
            </div>

            <div className="p-4 bg-white border border-slate-200/80 rounded-2xl flex flex-col gap-1 shadow-2xs">
              <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Status Protocol</span>
              <span className="text-xs font-semibold text-slate-800">{selectedThread.status || 'Active Now'}</span>
            </div>
          </div>
        </div>
      )}

      {/* 4. Active Audio / Video Call Modal - Stable Realistic Ringing & AI Mascot */}
      <AnimatePresence>
        {activeCallUser && (
          <div className="fixed inset-0 z-[500] bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 select-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.2 }}
              className="w-full max-w-3xl bg-[#090E1A] border border-slate-700/80 shadow-2xl rounded-3xl overflow-hidden flex flex-col relative aspect-video max-h-[88vh]"
            >
              {/* Call Header Banner */}
              <div className="px-5 py-3.5 bg-slate-900/90 border-b border-slate-800 flex justify-between items-center shrink-0 z-30">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="relative shrink-0 w-8 h-8">
                    <img 
                      src={activeCallUser.avatar || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150'} 
                      alt="" 
                      className="w-8 h-8 rounded-full border border-slate-700 object-cover" 
                    />
                  </div>
                  <div className="min-w-0 text-left">
                    <h3 className="text-xs font-bold text-white tracking-wide truncate">
                      {activeCallUser.name}
                    </h3>
                    <p className="text-[10px] text-emerald-400 font-mono font-semibold truncate flex items-center gap-1.5 mt-0.5">
                      <span className={`w-1.5 h-1.5 rounded-full ${callStatus === 'Connected' ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400 animate-ping'}`} />
                      {callStatus === 'Connected' ? `Live • ${formatTimer(callTimer)}` : 'Ringing...'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-full bg-indigo-500/20 border border-indigo-500/40 text-indigo-300 font-mono text-[10px] font-bold uppercase tracking-wider">
                    {activeCallUser.id === 'ai_chat' ? '🤖 AI Neural Feed' : activeCallUser.callMode === 'video' ? 'WebRTC Video' : 'P2P Audio'}
                  </span>
                </div>
              </div>

              {/* Main Viewport */}
              {activeCallUser.id === 'ai_chat' || activeCallUser.category === 'ai' || (activeCallUser.name && activeCallUser.name.toLowerCase().includes('copilot')) ? (
                // CampusX AI Copilot Video Feed with Animated Rabbit and Butterflies
                <div className="flex-1 relative overflow-hidden flex items-center justify-center">
                  <AiRabbitButterflyVisualizer />

                  {/* Local Webcam PiP (Top-Right) */}
                  <div className="absolute top-4 right-4 w-32 sm:w-36 aspect-video bg-black/80 rounded-2xl overflow-hidden border border-slate-600/80 shadow-2xl z-30">
                    <video ref={localVideoRef} autoPlay playsInline muted className={`w-full h-full object-cover ${isCamOff ? 'hidden' : 'block'}`} />
                    {isCamOff && (
                      <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 gap-1 text-[9.5px]">
                        <VideoOff className="w-4 h-4 text-rose-400" />
                        <span>Cam Off</span>
                      </div>
                    )}
                    <span className="absolute bottom-1 left-2 text-[8px] font-bold text-white bg-black/60 px-1.5 py-0.5 rounded">You</span>
                  </div>
                </div>
              ) : callStatus === 'Ringing' ? (
                // Realistic Peer Ringing Stage (Does not auto-connect)
                <div className="flex-1 relative bg-gradient-to-b from-[#0A1020] via-[#101935] to-[#0A1020] flex flex-col items-center justify-center p-6 text-center">
                  <div className="relative mb-4">
                    <div className="absolute -inset-4 rounded-full bg-indigo-500/20 animate-ping" />
                    <div className="absolute -inset-8 rounded-full bg-indigo-500/10 animate-pulse" />
                    <img
                      src={activeCallUser.avatar || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150'}
                      alt=""
                      className="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover border-4 border-indigo-500 shadow-2xl relative z-10"
                    />
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">{activeCallUser.name}</h3>
                  <p className="text-xs text-indigo-300 animate-pulse mt-1">
                    {activeCallUser.callMode === 'video' ? 'Calling with HD Video...' : 'Calling with Encrypted Audio...'}
                  </p>
                  <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                    Ringing... Waiting for {activeCallUser.name} to accept...
                  </p>

                  {/* Ringing Action Buttons */}
                  <div className="flex items-center gap-3 mt-6 z-20">
                    <button
                      onClick={endCall}
                      className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-mono text-xs font-bold rounded-xl shadow-lg transition-all flex items-center gap-2 cursor-pointer hover:scale-105 active:scale-95"
                    >
                      <PhoneOff className="w-4 h-4" /> Cancel Call
                    </button>
                    <button
                      onClick={simulateAnswerCall}
                      className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-mono text-xs font-bold rounded-xl shadow-lg transition-all flex items-center gap-2 cursor-pointer hover:scale-105 active:scale-95"
                      title="Simulate Peer Answering"
                    >
                      <Phone className="w-4 h-4" /> Simulate Answer
                    </button>
                  </div>
                </div>
              ) : (
                // Connected Human Peer Stage
                <div className="flex-1 relative bg-slate-950 flex items-center justify-center overflow-hidden">
                  {activeCallUser.callMode === 'video' ? (
                    <>
                      <div className="absolute inset-0 z-0 overflow-hidden">
                        <img src={activeCallUser.avatar || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150'} alt="" className="w-full h-full object-cover filter blur-xs brightness-75 scale-105" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-black/60" />
                      </div>
                      
                      {/* Center Peer Focus */}
                      <div className="relative z-10 flex flex-col items-center gap-2">
                        <div className="p-1 rounded-full ring-4 ring-emerald-500/40 bg-emerald-500/20">
                          <img src={activeCallUser.avatar || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150'} alt="" className="w-20 h-20 rounded-full object-cover border-2 border-white shadow-2xl" />
                        </div>
                        <span className="text-base font-bold text-white">{activeCallUser.name}</span>
                        <span className="text-xs text-emerald-400 font-mono flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /> Connected ({formatTimer(callTimer)})
                        </span>
                      </div>

                      {/* Local Webcam PiP */}
                      <div className="absolute right-4 bottom-4 w-32 sm:w-36 aspect-video bg-black/90 border border-slate-700 rounded-xl overflow-hidden shadow-2xl z-20">
                        <video ref={localVideoRef} autoPlay playsInline muted className={`w-full h-full object-cover ${isCamOff ? 'hidden' : 'block'}`} />
                        {isCamOff && (
                          <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 gap-1 text-[9.5px]">
                            <VideoOff className="w-4 h-4 text-rose-400" />
                            <span>Cam Off</span>
                          </div>
                        )}
                        <span className="absolute bottom-1 left-2 text-[8px] font-bold text-white bg-black/60 px-1.5 py-0.5 rounded">You</span>
                      </div>
                    </>
                  ) : (
                    <div className="flex flex-col items-center text-center p-6">
                      <div className="w-20 h-20 rounded-2xl bg-indigo-950 border border-indigo-700 flex items-center justify-center mb-3 shadow-xl">
                        <img src={activeCallUser.avatar || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150'} alt="" className="w-16 h-16 rounded-xl object-cover" />
                      </div>
                      <h3 className="text-base font-bold text-white tracking-wide mb-1">{activeCallUser.name}</h3>
                      <p className="text-xs text-emerald-400 font-mono">256-bit Encrypted Audio Stream</p>
                    </div>
                  )}
                </div>
              )}

              {/* Call Controls Footer */}
              <div className="px-5 py-3.5 bg-slate-900/95 border-t border-slate-800 flex justify-center items-center gap-3 shrink-0 z-30">
                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-center ${
                    isMuted ? 'bg-rose-500/20 border-rose-500 text-rose-400' : 'bg-slate-800 border-slate-700 text-white hover:bg-slate-700'
                  }`}
                  title={isMuted ? "Unmute Mic" : "Mute Mic"}
                >
                  {isMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                </button>
                {activeCallUser.callMode === 'video' && (
                  <button
                    onClick={() => setIsCamOff(!isCamOff)}
                    className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-center ${
                      isCamOff ? 'bg-rose-500/20 border-rose-500 text-rose-400' : 'bg-slate-800 border-slate-700 text-white hover:bg-slate-700'
                    }`}
                    title={isCamOff ? "Turn Cam On" : "Turn Cam Off"}
                  >
                    {isCamOff ? <VideoOff className="w-4 h-4" /> : <Video className="w-4 h-4" />}
                  </button>
                )}
                <button
                  onClick={endCall}
                  className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-mono text-xs font-bold rounded-xl shadow-lg transition-all flex items-center gap-2 cursor-pointer hover:scale-105 active:scale-95"
                >
                  <PhoneOff className="w-4 h-4" />
                  <span>End Call</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
