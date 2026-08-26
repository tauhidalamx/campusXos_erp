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
  MessageSquare, 
  Users, 
  Volume2, 
  Paperclip, 
  Sparkles,
  CheckCheck,
  X,
  FileText,
  ShieldCheck,
  ChevronDown,
  ChevronRight,
  Pin,
  FlaskConical,
  Smile,
  Trash2,
  Copy,
  MoreVertical,
  Check
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ConnectProvider, useConnect } from '../ConnectContext';
import SuiteSidebar from '../components/SuiteSidebar';
import '../connect.css';
import './messages.css';

// Initial Sectioned Threads with Data Sanitization
const initialThreads = [
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
    lastMsg: 'Hello! I am your research assistant. Ask me anything...', 
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
    lastMsg: 'Please submit the consensus draft review by tonight.', 
    time: '10:30 AM' 
  },
  { 
    id: 'usr_002', 
    name: 'Dr. Evelyn Sterling', 
    role: 'Professor & Lead Researcher', 
    dept: 'Computer Science', 
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150', 
    online: true, 
    status: 'Online', 
    category: 'faculty', 
    sectionId: 'direct',
    sectionTitle: '💬 DIRECT MESSAGES',
    unread: 0, 
    lastMsg: 'The midterm scores are posted to CampusX Chain.', 
    time: 'Yesterday' 
  },
  { 
    id: 'usr_005', 
    name: 'Carlos Mendez', 
    role: 'Student Representative', 
    dept: 'Electrical Eng', 
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150', 
    online: true, 
    status: 'Active 5m ago', 
    category: 'students', 
    sectionId: 'direct',
    sectionTitle: '💬 DIRECT MESSAGES',
    unread: 1, 
    lastMsg: 'Ready for the AI lab project discussion?', 
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
    status: 'Official Channel', 
    category: 'departments', 
    sectionId: 'channels',
    sectionTitle: '👥 CHANNELS & GROUPS',
    unread: 0, 
    lastMsg: 'Welcome to CampusX Connect central channel.', 
    time: '10:15 AM' 
  },
  { 
    id: 'class_cs202', 
    name: 'CS202 - Data Structures', 
    role: 'Course Cohort', 
    dept: 'CS Department', 
    avatar: 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=150', 
    online: true, 
    status: '34 Members', 
    category: 'students', 
    sectionId: 'channels',
    sectionTitle: '👥 CHANNELS & GROUPS',
    unread: 3, 
    lastMsg: 'Has anyone downloaded the binary tree prep PDF?', 
    time: 'June 11' 
  },

  // 4. RESEARCH LABS
  { 
    id: 'res_dl_models', 
    name: 'AI Deep Learning Lab', 
    role: 'Research Group', 
    dept: 'AI Research', 
    avatar: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=150', 
    online: true, 
    status: 'Active Research', 
    category: 'research', 
    sectionId: 'research',
    sectionTitle: '🔬 RESEARCH & LABS',
    unread: 0, 
    lastMsg: 'Citation indicators paper draft updated.', 
    time: 'June 10' 
  },

  // 5. VOICE STAGES
  { 
    id: 'lounge_voice', 
    name: 'CampusX Stage Lounge', 
    role: 'Voice Stage', 
    dept: 'Lounge', 
    avatar: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=150', 
    online: true, 
    status: 'Live Audio Stage', 
    category: 'voice', 
    sectionId: 'voice',
    sectionTitle: '🔊 VOICE STAGES',
    unread: 0, 
    lastMsg: 'Dr. Raymond started live stage stream.', 
    time: 'June 08' 
  }
];

const sectionsList = [
  { id: 'pinned', title: '📌 PINNED & AI', icon: Pin },
  { id: 'direct', title: '💬 DIRECT MESSAGES', icon: MessageSquare },
  { id: 'channels', title: '👥 CHANNELS & GROUPS', icon: Users },
  { id: 'research', title: '🔬 RESEARCH & LABS', icon: FlaskConical },
  { id: 'voice', title: '🔊 VOICE STAGES', icon: Volume2 }
];

const quickEmojis = ['👍', '❤️', '🔥', '🙌', '🤖'];

function DirectMessengerContent() {
  const { 
    currentUser, 
    chatMessages, 
    handleChatSend, 
    handleToggleReaction,
    handleDeleteMessage,
    handlePinMessage,
    activeChatChannel, 
    setActiveChatChannel,
    startCall,
    endCall,
    activeCallUser,
    callStatus,
    isMuted,
    setIsMuted,
    isCamOff,
    setIsCamOff
  } = useConnect();

  // Local State
  const [threads, setThreads] = useState(initialThreads);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [collapsedSections, setCollapsedSections] = useState({});
  const [inputText, setInputText] = useState('');
  const [attachedFile, setAttachedFile] = useState(null);
  const [attachedPreview, setAttachedPreview] = useState(null);
  const [isRecordingVoice, setIsRecordingVoice] = useState(false);
  const [voiceTimer, setVoiceTimer] = useState(0);
  const [showRightPanel, setShowRightPanel] = useState(true);
  const [callTimer, setCallTimer] = useState(0);
  const [copiedMsgId, setCopiedMsgId] = useState(null);
  const [hoveredMsgId, setHoveredMsgId] = useState(null);

  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const localVideoRef = useRef(null);
  const localStreamRef = useRef(null);

  const selectedThread = threads.find(t => t.id === activeChatChannel) || threads[0];

  const toggleSection = (sectionId) => {
    setCollapsedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  // Auto-scroll messages
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

  // Active call timer
  useEffect(() => {
    let interval = null;
    if (callStatus === 'Connected') {
      interval = setInterval(() => setCallTimer(prev => prev + 1), 1000);
    } else {
      setCallTimer(0);
    }
    return () => clearInterval(interval);
  }, [callStatus]);

  // Webcam initialization for video call
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
          console.warn('Local camera fallback:', err.message);
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

  // Filter threads safely
  const filteredThreads = threads.filter(t => {
    const query = searchQuery.toLowerCase().trim();
    const matchSearch = !query || 
                        (t.name && t.name.toLowerCase().includes(query)) || 
                        (t.dept && t.dept.toLowerCase().includes(query)) ||
                        (t.role && t.role.toLowerCase().includes(query));
    const matchCategory = activeCategory === 'all' || 
                          (activeCategory === 'dm' && t.sectionId === 'direct') ||
                          t.category === activeCategory;
    return matchSearch && matchCategory;
  });

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setAttachedFile(file);
    if (file.type.startsWith('image/')) {
      setAttachedPreview(URL.createObjectURL(file));
    } else {
      setAttachedPreview(null);
    }
  };

  const onSendMessage = (e) => {
    if (e) e.preventDefault();
    if (!inputText.trim() && !attachedFile && !attachedPreview) return;

    let mediaType = null;
    let mediaUrl = attachedPreview;

    if (attachedFile) {
      if (attachedFile.type.startsWith('image/')) mediaType = 'image';
      else if (attachedFile.type.startsWith('video/')) mediaType = 'video';
      else mediaType = 'file';
    }

    handleChatSend(inputText.trim(), mediaUrl, mediaType);
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
    <div className="flex h-screen bg-brand-bg-primary text-brand-text-main overflow-hidden font-sans select-none relative" style={{ paddingLeft: '80px' }}>
      {/* Left Global App Suite Sidebar */}
      <SuiteSidebar />

      {/* Main Container Layout */}
      <div className="flex-1 flex overflow-hidden w-full h-full">
        
        {/* ================= 1. SECTION-WISE CONTACTS & CHANNELS SIDEBAR (320px - 360px) ================= */}
        <div className="w-80 lg:w-90 border-r border-brand-border/40 bg-brand-bg-secondary/50 backdrop-blur-3xl flex flex-col shrink-0">
          
          {/* Header */}
          <div className="p-4 border-b border-brand-border/40 flex justify-between items-center">
            <div>
              <h1 className="text-xl font-display font-black tracking-tight text-brand-text-main flex items-center gap-2">
                Messenger
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_12px_rgba(16,185,129,0.6)]" />
              </h1>
              <p className="text-[11px] font-semibold text-brand-text-muted mt-0.5">Liquid Glass 2.0 Section-Wise Messaging</p>
            </div>
            <button 
              onClick={() => setActiveChatChannel('ai_chat')}
              className="p-2 bg-brand-primary/10 hover:bg-brand-primary/20 text-brand-primary rounded-xl border border-brand-primary/20 transition-all cursor-pointer shadow-sm"
              title="Start Direct AI Session"
            >
              <Sparkles className="w-4 h-4" />
            </button>
          </div>

          {/* Search Contacts Bar */}
          <div className="p-3 border-b border-brand-border/30">
            <div className="flex items-center bg-brand-bg-primary/70 border border-brand-border/60 rounded-2xl px-3.5 py-2 gap-2 focus-within:border-brand-primary/60 transition-all shadow-inner">
              <Search className="w-4 h-4 text-brand-text-muted shrink-0" />
              <input 
                type="text"
                placeholder="Search messages, peers, channels..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent border-none text-xs text-brand-text-main outline-none w-full placeholder-brand-text-muted"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="text-brand-text-muted hover:text-brand-text-main cursor-pointer">
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Active Peer Stories & Online Status Bar */}
          <div className="p-3 border-b border-brand-border/30 overflow-x-auto flex gap-3.5 no-scrollbar">
            {threads.slice(0, 7).map(t => (
              <div 
                key={t.id} 
                onClick={() => setActiveChatChannel(t.id)} 
                className="flex flex-col items-center gap-1.5 cursor-pointer shrink-0 group"
              >
                <div className="relative p-0.5 rounded-full bg-gradient-to-tr from-amber-400 via-rose-500 to-indigo-600 group-hover:scale-105 transition-all shadow-sm">
                  <img src={t.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'} alt={t.name} className="w-11 h-11 rounded-full object-cover border-2 border-brand-bg-primary" />
                  {t.online && (
                    <span className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-brand-bg-primary shadow-sm" />
                  )}
                </div>
                <span className="text-[10px] font-bold text-brand-text-muted group-hover:text-brand-text-main truncate max-w-[56px]">{t.name.split(' ')[0]}</span>
              </div>
            ))}
          </div>

          {/* Category Filter Pills */}
          <div className="px-3 py-2 border-b border-brand-border/30 flex gap-1.5 overflow-x-auto no-scrollbar">
            {[
              { id: 'all', label: 'All Sections' },
              { id: 'dm', label: 'Direct DMs' },
              { id: 'faculty', label: 'Faculty' },
              { id: 'students', label: 'Students' },
              { id: 'ai', label: 'AI Assistant' }
            ].map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-3 py-1 rounded-full text-[10px] font-bold transition-all cursor-pointer whitespace-nowrap ${
                  activeCategory === cat.id
                    ? 'bg-gradient-to-r from-brand-primary to-indigo-600 text-white shadow-md'
                    : 'bg-brand-bg-primary/50 text-brand-text-muted hover:text-brand-text-main border border-brand-border/40'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Section-Wise Accordion List */}
          <div className="flex-1 overflow-y-auto p-2.5 space-y-4">
            {sectionsList.map(sec => {
              const secThreads = filteredThreads.filter(t => t.sectionId === sec.id);
              if (secThreads.length === 0) return null;
              const isCollapsed = collapsedSections[sec.id];

              return (
                <div key={sec.id} className="space-y-1.5">
                  {/* Section Header */}
                  <div 
                    onClick={() => toggleSection(sec.id)}
                    className="flex justify-between items-center px-2.5 py-1 cursor-pointer select-none text-brand-text-muted hover:text-brand-text-main group"
                  >
                    <span className="text-[10px] font-extrabold uppercase tracking-wider flex items-center gap-1.5">
                      {isCollapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                      {sec.title}
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-brand-bg-primary/70 border border-brand-border/40 text-[9px] font-mono font-bold">
                      {secThreads.length}
                    </span>
                  </div>

                  {/* Threads inside Section */}
                  {!isCollapsed && (
                    <div className="space-y-1 pl-1">
                      {secThreads.map(t => {
                        const isSelected = activeChatChannel === t.id;
                        return (
                          <div
                            key={t.id}
                            onClick={() => setActiveChatChannel(t.id)}
                            className={`p-2.5 rounded-2xl cursor-pointer transition-all flex items-center gap-3 border ${
                              isSelected
                                ? 'bg-gradient-to-r from-brand-primary/15 to-indigo-600/15 border-brand-primary/40 text-brand-text-main shadow-md'
                                : 'border-transparent hover:bg-brand-bg-primary/40 text-brand-text-muted hover:text-brand-text-main'
                            }`}
                          >
                            <div className="relative shrink-0">
                              <img src={t.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'} alt={t.name} className="w-10 h-10 rounded-full object-cover border border-brand-border/40" />
                              {t.online && (
                                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-brand-bg-primary shadow-sm" />
                              )}
                            </div>

                            <div className="flex-1 min-w-0">
                              <div className="flex justify-between items-baseline mb-0.5">
                                <h3 className="text-xs font-bold text-brand-text-main truncate">{t.name}</h3>
                                <span className="text-[10px] text-brand-text-muted font-mono shrink-0 ml-2">{t.time}</span>
                              </div>
                              <p className="text-[11px] text-brand-text-muted truncate">{t.lastMsg}</p>
                            </div>

                            {t.unread > 0 && (
                              <span className="w-4 h-4 rounded-full bg-brand-primary text-white text-[9px] font-bold flex items-center justify-center shrink-0 shadow-md animate-pulse">
                                {t.unread}
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* ================= 2. MAIN DIRECT MESSAGING CONVERSATION WINDOW ================= */}
        <div className="flex-1 flex flex-col bg-brand-bg-primary/40 relative overflow-hidden">
          
          {/* Direct Chat Header */}
          <div className="px-6 py-4 border-b border-brand-border/40 bg-brand-bg-secondary/50 backdrop-blur-3xl flex justify-between items-center z-10 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="relative">
                <img src={selectedThread.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'} alt={selectedThread.name} className="w-10 h-10 rounded-full object-cover border border-brand-border/40 shadow-sm" />
                {selectedThread.online && (
                  <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 border-2 border-brand-bg-primary shadow-sm" />
                )}
              </div>
              <div>
                <h2 className="text-sm font-display font-bold text-brand-text-main flex items-center gap-1.5">
                  {selectedThread.name}
                  <ShieldCheck className="w-3.5 h-3.5 text-brand-primary" />
                </h2>
                <p className="text-[11px] text-brand-text-muted flex items-center gap-2">
                  <span>{selectedThread.role} • {selectedThread.dept}</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <span className="text-emerald-500 font-semibold">{selectedThread.status}</span>
                </p>
              </div>
            </div>

            {/* Direct Calling & Details Toolbar */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => startCall(selectedThread, 'audio')}
                className="p-2.5 bg-brand-bg-primary border border-brand-border/60 hover:bg-brand-primary/10 hover:border-brand-primary/30 text-brand-text-muted hover:text-brand-primary rounded-xl transition-all cursor-pointer shadow-sm"
                title="Start Audio Call"
              >
                <Phone className="w-4 h-4" />
              </button>

              <button
                onClick={() => startCall(selectedThread, 'video')}
                className="p-2.5 bg-brand-primary text-white hover:brightness-110 rounded-xl transition-all cursor-pointer shadow-md flex items-center gap-1.5 text-xs font-bold"
                title="Start HD Video Call"
              >
                <Video className="w-4 h-4" />
                <span className="hidden sm:inline">Video Call</span>
              </button>

              <button
                onClick={() => setShowRightPanel(!showRightPanel)}
                className="p-2.5 bg-brand-bg-primary border border-brand-border/60 hover:bg-brand-primary/10 text-brand-text-muted hover:text-brand-text-main rounded-xl transition-all cursor-pointer ml-1"
                title="Toggle Contact Details"
              >
                <Info className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages Stream Body */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            <div className="flex justify-center my-2">
              <span className="px-3 py-1 bg-brand-bg-secondary/70 border border-brand-border/40 rounded-full text-[10px] font-bold text-brand-text-muted uppercase tracking-wider shadow-sm">
                Today • Encrypted Channel
              </span>
            </div>

            {currentMessages.map((msg) => {
              const isSelf = msg.senderId === currentUser?.id || msg.senderName === currentUser?.name || msg.senderId === 'usr_me';
              const isHovered = hoveredMsgId === msg.id;

              return (
                <div
                  key={msg.id}
                  onMouseEnter={() => setHoveredMsgId(msg.id)}
                  onMouseLeave={() => setHoveredMsgId(null)}
                  className={`flex items-end gap-2.5 group ${isSelf ? 'flex-row-reverse' : 'flex-row'} relative`}
                >
                  {!isSelf && (
                    <img
                      src={msg.senderAvatar || selectedThread.avatar || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150'}
                      alt=""
                      className="w-7 h-7 rounded-full object-cover border border-brand-border/40 mb-1 shrink-0 shadow-sm"
                    />
                  )}

                  <div className={`flex flex-col max-w-[75%] md:max-w-[65%] ${isSelf ? 'items-end' : 'items-start'}`}>
                    <span className="text-[10px] font-medium text-brand-text-muted mb-1 px-1 flex items-center gap-1.5">
                      <span>{isSelf ? 'You' : msg.senderName}</span>
                      <span>•</span>
                      <span>{msg.time}</span>
                      {msg.pinned && <Pin className="w-3 h-3 text-amber-400 rotate-45" />}
                    </span>

                    {/* Chat Bubble Container */}
                    <div
                      className={`p-3.5 rounded-2xl text-xs leading-relaxed relative transition-all ${
                        isSelf
                          ? 'bg-gradient-to-r from-brand-primary via-indigo-600 to-purple-600 text-white rounded-br-xs shadow-md font-medium border border-white/10'
                          : 'bg-brand-bg-secondary/80 backdrop-blur-2xl border border-brand-border/60 text-brand-text-main rounded-bl-xs shadow-sm'
                      }`}
                    >
                      {/* Media Image Attachment */}
                      {msg.mediaUrl && (
                        <div className="mb-2 rounded-xl overflow-hidden border border-white/20 shadow-sm">
                          <img src={msg.mediaUrl} alt="Attachment" className="max-h-60 w-full object-cover" />
                        </div>
                      )}

                      {/* Text content */}
                      {msg.text && <p className="whitespace-pre-wrap">{msg.text}</p>}

                      {/* Reactions Badges */}
                      {msg.reactions && Object.keys(msg.reactions).length > 0 && (
                        <div className="flex gap-1 mt-2 flex-wrap">
                          {Object.entries(msg.reactions).map(([emoji, count]) => (
                            <button
                              key={emoji}
                              onClick={() => handleToggleReaction(activeChatChannel, msg.id, emoji)}
                              className="px-2 py-0.5 rounded-full bg-brand-bg-primary/80 border border-brand-border/40 text-[11px] flex items-center gap-1 hover:scale-105 transition-all cursor-pointer"
                            >
                              <span>{emoji}</span>
                              <span className="font-bold">{count}</span>
                            </button>
                          ))}
                        </div>
                      )}

                      {/* Read status checkmarks */}
                      {isSelf && (
                        <div className="flex justify-end mt-1 text-white/80">
                          <CheckCheck className="w-3.5 h-3.5 text-emerald-300" />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Hover Quick Reaction & Actions Toolbar */}
                  {isHovered && (
                    <div className={`absolute top-0 ${isSelf ? 'right-full mr-2' : 'left-full ml-2'} bg-brand-bg-secondary/90 border border-brand-border/60 backdrop-blur-xl rounded-2xl p-1 shadow-xl flex items-center gap-1 z-30`}>
                      {quickEmojis.map(emoji => (
                        <button
                          key={emoji}
                          onClick={() => handleToggleReaction(activeChatChannel, msg.id, emoji)}
                          className="p-1 hover:bg-brand-bg-primary/60 rounded-lg text-sm transition-all cursor-pointer hover:scale-125"
                        >
                          {emoji}
                        </button>
                      ))}

                      <div className="w-px h-4 bg-brand-border/40 mx-0.5" />

                      <button
                        onClick={() => handlePinMessage(activeChatChannel, msg.id)}
                        className="p-1 hover:bg-brand-bg-primary/60 rounded-lg text-brand-text-muted hover:text-amber-400 transition-all cursor-pointer"
                        title="Pin Message"
                      >
                        <Pin className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => copyToClipboard(msg.text, msg.id)}
                        className="p-1 hover:bg-brand-bg-primary/60 rounded-lg text-brand-text-muted hover:text-brand-text-main transition-all cursor-pointer"
                        title="Copy text"
                      >
                        {copiedMsgId === msg.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>

                      {isSelf && (
                        <button
                          onClick={() => handleDeleteMessage(activeChatChannel, msg.id)}
                          className="p-1 hover:bg-brand-bg-primary/60 rounded-lg text-brand-text-muted hover:text-rose-500 transition-all cursor-pointer"
                          title="Delete message"
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

          {/* Attachment Preview Drawer */}
          {attachedPreview && (
            <div className="px-6 py-2 bg-brand-bg-secondary/80 border-t border-brand-border/40 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img src={attachedPreview} alt="Preview" className="w-10 h-10 rounded-lg object-cover border border-brand-border/60" />
                <span className="text-xs text-brand-text-muted font-medium">Image attached</span>
              </div>
              <button onClick={() => { setAttachedFile(null); setAttachedPreview(null); }} className="p-1 text-brand-text-muted hover:text-brand-text-main cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Message Input Composer */}
          <form onSubmit={onSendMessage} className="p-4 border-t border-brand-border/40 bg-brand-bg-secondary/50 backdrop-blur-3xl flex items-center gap-3">
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileSelect} 
              className="hidden" 
              accept="image/*,video/*,application/pdf" 
            />

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="p-2.5 bg-brand-bg-primary border border-brand-border/60 hover:bg-brand-primary/10 text-brand-text-muted hover:text-brand-text-main rounded-xl transition-all cursor-pointer"
              title="Attach media or document"
            >
              <Paperclip className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={toggleVoiceRecording}
              className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                isRecordingVoice
                  ? 'bg-rose-500 border-rose-600 text-white animate-pulse'
                  : 'bg-brand-bg-primary border border-brand-border/60 hover:bg-brand-primary/10 text-brand-text-muted hover:text-brand-text-main'
              }`}
              title={isRecordingVoice ? 'Stop and send voice note' : 'Record voice note'}
            >
              <Mic className="w-4 h-4" />
            </button>

            {isRecordingVoice ? (
              <div className="flex-1 bg-rose-500/10 border border-rose-500/20 rounded-xl px-4 py-2 flex items-center justify-between">
                <span className="text-xs font-bold text-rose-500 animate-pulse flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-rose-500" />
                  Recording Voice Note... {formatTimer(voiceTimer)}
                </span>
                <button type="button" onClick={toggleVoiceRecording} className="text-xs text-rose-500 font-bold underline cursor-pointer">
                  Send
                </button>
              </div>
            ) : (
              <input
                type="text"
                placeholder={`Message ${selectedThread.name}...`}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                className="flex-1 bg-brand-bg-primary/80 border border-brand-border/60 rounded-xl px-4 py-2.5 text-xs text-brand-text-main outline-none focus:border-brand-primary/60 transition-all placeholder-brand-text-muted shadow-inner"
              />
            )}

            <button
              type="submit"
              disabled={!inputText.trim() && !attachedFile && !attachedPreview}
              className="p-2.5 bg-gradient-to-r from-brand-primary to-indigo-600 hover:brightness-110 disabled:opacity-50 text-white rounded-xl shadow-md transition-all cursor-pointer shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>

        {/* ================= 3. RIGHT CONTACT DETAILS & SHARED MEDIA SIDEBAR (320px - 360px) ================= */}
        {showRightPanel && (
          <div className="w-80 lg:w-90 border-l border-brand-border/40 bg-brand-bg-secondary/50 backdrop-blur-3xl p-6 hidden lg:flex flex-col gap-6 overflow-y-auto shrink-0">
            <div className="flex flex-col items-center text-center">
              <div className="relative mb-3">
                <img src={selectedThread.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'} alt={selectedThread.name} className="w-20 h-20 rounded-full object-cover border-2 border-brand-primary/40 shadow-xl" />
                {selectedThread.online && (
                  <span className="absolute bottom-1 right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-brand-bg-primary shadow-sm" />
                )}
              </div>
              <h3 className="text-sm font-display font-bold text-brand-text-main flex items-center gap-1">
                {selectedThread.name}
                <ShieldCheck className="w-4 h-4 text-brand-primary" />
              </h3>
              <p className="text-xs text-brand-text-muted mt-0.5">{selectedThread.role}</p>
              <span className="mt-2 px-3 py-1 bg-brand-primary/10 border border-brand-primary/20 text-brand-primary rounded-full text-[10px] font-bold">
                {selectedThread.dept}
              </span>
            </div>

            {/* Action Shortcuts */}
            <div className="grid grid-cols-2 gap-2">
              <button 
                onClick={() => startCall(selectedThread, 'audio')}
                className="p-3 bg-brand-bg-primary border border-brand-border/60 hover:border-brand-primary/40 rounded-2xl text-center transition-all cursor-pointer shadow-sm"
              >
                <Phone className="w-4 h-4 text-brand-primary mx-auto mb-1" />
                <span className="text-[11px] font-bold text-brand-text-main block">Audio Call</span>
              </button>
              <button 
                onClick={() => startCall(selectedThread, 'video')}
                className="p-3 bg-brand-bg-primary border border-brand-border/60 hover:border-brand-primary/40 rounded-2xl text-center transition-all cursor-pointer shadow-sm"
              >
                <Video className="w-4 h-4 text-brand-primary mx-auto mb-1" />
                <span className="text-[11px] font-bold text-brand-text-main block">Video Call</span>
              </button>
            </div>

            {/* Shared Media Gallery */}
            <div>
              <h4 className="text-xs font-bold text-brand-text-main mb-3 uppercase tracking-wider">Shared Media</h4>
              <div className="grid grid-cols-3 gap-2">
                {[
                  "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=300",
                  "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=300",
                  "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=300"
                ].map((url, idx) => (
                  <img key={idx} src={url} alt="" className="w-full aspect-square rounded-xl object-cover border border-brand-border/40 hover:scale-105 transition-all cursor-pointer shadow-sm" />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ================= 4. REAL-TIME AUDIO & VIDEO CALL OVERLAY MODAL ================= */}
      <AnimatePresence>
        {activeCallUser && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-3xl flex items-center justify-center p-4"
          >
            <div className="w-full max-w-4xl bg-brand-bg-secondary/90 border border-white/10 rounded-3xl overflow-hidden shadow-2xl flex flex-col relative aspect-video">
              
              {/* Header Info */}
              <div className="p-4 bg-black/50 border-b border-white/10 flex justify-between items-center z-20">
                <div className="flex items-center gap-3">
                  <img src={activeCallUser.avatar || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150'} alt="" className="w-9 h-9 rounded-full object-cover border border-white/20" />
                  <div>
                    <h3 className="text-sm font-bold text-white">{activeCallUser.name}</h3>
                    <p className="text-[10px] text-emerald-400 font-mono font-bold flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                      {callStatus} • {formatTimer(callTimer)}
                    </p>
                  </div>
                </div>
                <span className="px-3 py-1 bg-white/10 border border-white/10 rounded-full text-xs font-bold text-white uppercase tracking-wider">
                  {activeCallUser.callMode === 'video' ? 'HD Video Call' : 'Encrypted Voice Call'}
                </span>
              </div>

              {/* Call Stream Viewport */}
              <div className="flex-1 relative bg-slate-950 flex items-center justify-center overflow-hidden">
                {activeCallUser.callMode === 'video' ? (
                  <>
                    <img 
                      src={activeCallUser.avatar || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150'} 
                      alt="" 
                      className="w-full h-full object-cover filter brightness-90"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40" />

                    <div className="absolute right-6 bottom-6 w-44 aspect-video bg-black/80 border-2 border-white/20 rounded-2xl overflow-hidden shadow-2xl z-20">
                      <video ref={localVideoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center text-center p-8">
                    <div className="relative mb-6">
                      <div className="w-32 h-32 rounded-full bg-brand-primary/20 border-4 border-brand-primary/40 flex items-center justify-center animate-pulse shadow-[0_0_50px_rgba(79,70,229,0.4)]">
                        <img src={activeCallUser.avatar || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150'} alt="" className="w-28 h-28 rounded-full object-cover" />
                      </div>
                    </div>
                    <h2 className="text-2xl font-display font-bold text-white mb-2">{activeCallUser.name}</h2>
                    <p className="text-xs text-slate-400 mb-6 font-mono">End-to-End Encrypted Audio Stream</p>
                    
                    <div className="flex gap-1.5 items-center h-8">
                      {[40, 70, 30, 90, 60, 100, 50, 80, 30, 60].map((h, i) => (
                        <span key={i} style={{ height: `${h}%` }} className="w-1.5 bg-brand-primary rounded-full animate-bounce" />
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Call Controls Bar */}
              <div className="p-4 bg-black/70 border-t border-white/10 flex justify-center items-center gap-4 z-20">
                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                    isMuted ? 'bg-rose-500/20 border-rose-500 text-rose-500' : 'bg-white/10 border-white/10 text-white hover:bg-white/20'
                  }`}
                >
                  {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                </button>

                {activeCallUser.callMode === 'video' && (
                  <button
                    onClick={() => setIsCamOff(!isCamOff)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                      isCamOff ? 'bg-rose-500/20 border-rose-500 text-rose-500' : 'bg-white/10 border-white/10 text-white hover:bg-white/20'
                    }`}
                  >
                    {isCamOff ? <VideoOff className="w-5 h-5" /> : <Video className="w-5 h-5" />}
                  </button>
                )}

                <button
                  onClick={endCall}
                  className="px-8 py-4 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-2xl shadow-lg transition-all cursor-pointer flex items-center gap-2 text-sm"
                >
                  <PhoneOff className="w-5 h-5" />
                  <span>End Call</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function MessagesIndexPage() {
  return (
    <ConnectProvider>
      <DirectMessengerContent />
    </ConnectProvider>
  );
}
