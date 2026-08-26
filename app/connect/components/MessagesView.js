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
  Copy
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useConnect } from '../ConnectContext';

// Default Sectioned Threads
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
    lastMsg: 'Hello! How can I help you today?', 
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
    online: true, 
    status: 'Online', 
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
    online: true, 
    status: 'Active 5m ago', 
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
    status: 'Official Channel', 
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
    online: true, 
    status: 'Active Research', 
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

export default function MessagesView() {
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
    if (file.type.startsWith('image/')) {
      setAttachedPreview(URL.createObjectURL(file));
    }
  };

  const onSendMessage = (e) => {
    if (e) e.preventDefault();
    if (!inputText.trim() && !attachedFile && !attachedPreview) return;

    let mediaType = null;
    let mediaUrl = attachedPreview;

    if (attachedFile) {
      if (attachedFile.type.startsWith('image/')) mediaType = 'image';
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
    <div className="w-full h-full max-w-full bg-brand-bg-secondary/60 backdrop-blur-3xl border border-brand-border/60 rounded-3xl overflow-hidden shadow-2xl flex relative select-none">
      
      {/* 1. Section-Wise Direct Messaging Contacts Sidebar (350px - 380px) */}
      <div className="w-88 lg:w-96 border-r border-brand-border/40 flex flex-col shrink-0 bg-brand-bg-secondary/50 backdrop-blur-3xl">
        
        {/* Header */}
        <div className="p-4 border-b border-brand-border/40 flex justify-between items-center">
          <div>
            <h2 className="text-base font-display font-bold text-brand-text-main flex items-center gap-2">
              Messenger
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.6)]" />
            </h2>
            <p className="text-[11px] text-brand-text-muted">Campus Messages & Chat</p>
          </div>
          <button 
            onClick={() => setActiveChatChannel('ai_chat')}
            className="p-2 bg-brand-primary/10 hover:bg-brand-primary/20 text-brand-primary rounded-xl border border-brand-primary/20 transition-all cursor-pointer shadow-sm"
          >
            <Sparkles className="w-4 h-4" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="p-3 border-b border-brand-border/30">
          <div className="flex items-center bg-brand-bg-primary/60 border border-brand-border/60 rounded-xl px-3.5 py-2 gap-2.5 shadow-inner focus-within:border-brand-primary/60 transition-all">
            <Search className="w-4 h-4 text-brand-text-muted shrink-0" />
            <input 
              type="text"
              placeholder="Search contacts, departments..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent border-none text-xs text-brand-text-main outline-none w-full placeholder-brand-text-muted font-medium"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="text-brand-text-muted hover:text-brand-text-main">
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Category Pills */}
        <div className="px-3 py-2 border-b border-brand-border/30 flex gap-2 overflow-x-auto no-scrollbar">
          {['all', 'faculty', 'students', 'ai'].map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1 rounded-full text-xs font-bold capitalize transition-all cursor-pointer whitespace-nowrap ${
                activeCategory === cat
                  ? 'bg-gradient-to-r from-brand-primary to-indigo-600 text-white shadow-md'
                  : 'bg-brand-bg-primary/40 text-brand-text-muted hover:text-brand-text-main border border-brand-border/40'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Section-Wise Accordion List */}
        <div className="flex-1 overflow-y-auto p-2.5 space-y-3">
          {sectionsList.map(sec => {
            const secThreads = filteredThreads.filter(t => t.sectionId === sec.id);
            if (secThreads.length === 0) return null;
            const isCollapsed = collapsedSections[sec.id];

            return (
              <div key={sec.id} className="space-y-1.5">
                {/* Section Header */}
                <div 
                  onClick={() => toggleSection(sec.id)}
                  className="flex justify-between items-center px-2 py-1.5 cursor-pointer select-none text-brand-text-muted hover:text-brand-text-main group rounded-lg hover:bg-brand-bg-primary/30 transition-all"
                >
                  <span className="text-[10px] font-extrabold uppercase tracking-wider flex items-center gap-1.5">
                    {isCollapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    {sec.title}
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-brand-bg-primary/60 border border-brand-border/40 text-[10px] font-mono font-bold">
                    {secThreads.length}
                  </span>
                </div>

                {/* Threads */}
                {!isCollapsed && (
                  <div className="space-y-1 pl-1">
                    {secThreads.map(t => {
                      const isSelected = activeChatChannel === t.id;
                      return (
                        <div
                          key={t.id}
                          onClick={() => setActiveChatChannel(t.id)}
                          className={`p-3 rounded-2xl cursor-pointer transition-all flex items-center justify-between gap-3 border group ${
                            isSelected
                              ? 'bg-brand-primary/15 border-brand-primary/30 text-brand-text-main shadow-sm'
                              : 'border-transparent hover:bg-brand-bg-primary/30 text-brand-text-muted hover:text-brand-text-main'
                          }`}
                        >
                          <div className="flex items-center gap-3 min-w-0 flex-1">
                            <div className="relative shrink-0">
                              <img src={t.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'} alt={t.name} className="w-10 h-10 rounded-full object-cover border border-brand-border/40" />
                              {t.online && (
                                <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 border-2 border-brand-bg-primary" />
                              )}
                            </div>

                            <div className="flex-1 min-w-0">
                              <div className="flex justify-between items-baseline mb-0.5">
                                <h3 className="text-xs font-bold text-brand-text-main truncate pr-1">{t.name}</h3>
                                <span className="text-[10px] text-brand-text-muted font-mono shrink-0">{t.time}</span>
                              </div>
                              <div className="flex items-center justify-between gap-1">
                                <p className="text-[11px] text-brand-text-muted truncate flex-1">{t.lastMsg}</p>
                                {t.unread > 0 && (
                                  <span className="px-1.5 py-0.5 rounded-full bg-brand-primary text-white text-[9px] font-bold shrink-0">
                                    {t.unread}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Quick Audio Call Button */}
                          <button
                            onClick={(e) => { e.stopPropagation(); startCall(t, 'audio'); }}
                            className="p-1.5 rounded-lg border border-brand-border/40 opacity-0 group-hover:opacity-100 hover:bg-brand-primary/10 hover:text-brand-primary transition-all cursor-pointer shrink-0"
                            title="Quick Call"
                          >
                            <Phone className="w-3.5 h-3.5" />
                          </button>
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

      {/* 2. Main Direct Chat Conversation Canvas */}
      <div className="flex-1 flex flex-col bg-brand-bg-primary/30 relative overflow-hidden">
        
        {/* Chat Header */}
        <div className="px-5 py-3 border-b border-brand-border/40 bg-brand-bg-secondary/40 backdrop-blur-xl flex justify-between items-center shadow-sm">
          <div className="flex items-center gap-3">
            <div className="relative">
              <img src={selectedThread.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'} alt="" className="w-9 h-9 rounded-full object-cover border border-brand-border/40" />
              {selectedThread.online && (
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-brand-bg-primary" />
              )}
            </div>
            <div>
              <h2 className="text-xs font-bold text-brand-text-main flex items-center gap-1">
                {selectedThread.name}
                <ShieldCheck className="w-3.5 h-3.5 text-brand-primary" />
              </h2>
              <p className="text-[10px] text-brand-text-muted flex items-center gap-1.5">
                <span>{selectedThread.role}</span>
                <span className="w-1 h-1 rounded-full bg-emerald-500" />
                <span className="text-emerald-500 font-semibold">{selectedThread.status}</span>
              </p>
            </div>
          </div>

          {/* Action Calling Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => startCall(selectedThread, 'audio')}
              className="p-2 bg-brand-bg-primary border border-brand-border/60 hover:bg-brand-primary/10 hover:border-brand-primary/30 text-brand-text-muted hover:text-brand-primary rounded-xl transition-all cursor-pointer shadow-sm"
              title="Start Audio Call"
            >
              <Phone className="w-4 h-4" />
            </button>

            <button
              onClick={() => startCall(selectedThread, 'video')}
              className="px-3 py-2 bg-gradient-to-r from-brand-primary to-indigo-600 text-white hover:brightness-110 rounded-xl transition-all cursor-pointer shadow-sm flex items-center gap-1.5 text-xs font-bold"
              title="Start Video Call"
            >
              <Video className="w-4 h-4" />
              <span>Video Call</span>
            </button>

            <button
              onClick={() => setShowDetails(!showDetails)}
              className="p-2 bg-brand-bg-primary border border-brand-border/60 hover:bg-brand-primary/10 text-brand-text-muted hover:text-brand-text-main rounded-xl transition-all cursor-pointer ml-1"
            >
              <Info className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Message Stream */}
        <div className="flex-1 overflow-y-auto p-5 space-y-3.5">
          {currentMessages.map((msg) => {
            const isSelf = msg.senderId === currentUser?.id || msg.senderName === currentUser?.name || msg.senderId === 'usr_me';
            const isHovered = hoveredMsgId === msg.id;

            return (
              <div
                key={msg.id}
                onMouseEnter={() => setHoveredMsgId(msg.id)}
                onMouseLeave={() => setHoveredMsgId(null)}
                className={`flex items-end gap-2 ${isSelf ? 'flex-row-reverse' : 'flex-row'} relative`}
              >
                {!isSelf && (
                  <img src={msg.senderAvatar || selectedThread.avatar || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150'} alt="" className="w-6 h-6 rounded-full object-cover mb-1 shrink-0 shadow-sm" />
                )}
                <div className={`flex flex-col max-w-[70%] ${isSelf ? 'items-end' : 'items-start'}`}>
                  <span className="text-[9px] text-brand-text-muted mb-0.5 px-1 flex items-center gap-1">
                    <span>{isSelf ? 'You' : msg.senderName}</span>
                    <span>•</span>
                    <span>{msg.time}</span>
                    {msg.pinned && <Pin className="w-2.5 h-2.5 text-amber-400 rotate-45" />}
                  </span>
                  <div
                    className={`p-3 rounded-2xl text-xs leading-relaxed border ${
                      isSelf
                        ? 'bg-gradient-to-r from-brand-primary via-indigo-600 to-purple-600 text-white rounded-br-xs shadow-md border-white/10'
                        : 'bg-brand-bg-secondary/80 backdrop-blur-md border-brand-border/60 text-brand-text-main rounded-bl-xs shadow-sm'
                    }`}
                  >
                    {msg.mediaUrl && (
                      <img src={msg.mediaUrl} alt="" className="max-h-48 w-full object-cover rounded-lg mb-2 shadow-sm" />
                    )}
                    {msg.text && <p className="whitespace-pre-wrap">{msg.text}</p>}

                    {/* Reactions Badges */}
                    {msg.reactions && Object.keys(msg.reactions).length > 0 && (
                      <div className="flex gap-1 mt-1.5 flex-wrap">
                        {Object.entries(msg.reactions).map(([emoji, count]) => (
                          <button
                            key={emoji}
                            onClick={() => handleToggleReaction(activeChatChannel, msg.id, emoji)}
                            className="px-1.5 py-0.5 rounded-full bg-brand-bg-primary/80 border border-brand-border/40 text-[10px] flex items-center gap-0.5 cursor-pointer"
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
                  <div className={`absolute top-0 ${isSelf ? 'right-full mr-2' : 'left-full ml-2'} bg-brand-bg-secondary/90 border border-brand-border/60 backdrop-blur-xl rounded-xl p-1 shadow-lg flex items-center gap-1 z-20`}>
                    {quickEmojis.map(emoji => (
                      <button
                        key={emoji}
                        onClick={() => handleToggleReaction(activeChatChannel, msg.id, emoji)}
                        className="p-1 hover:bg-brand-bg-primary/60 rounded-md text-xs transition-all cursor-pointer hover:scale-125"
                      >
                        {emoji}
                      </button>
                    ))}
                    <div className="w-px h-3 bg-brand-border/40 mx-0.5" />
                    <button
                      onClick={() => handlePinMessage(activeChatChannel, msg.id)}
                      className="p-1 hover:bg-brand-bg-primary/60 rounded-md text-brand-text-muted hover:text-amber-400 transition-all cursor-pointer"
                    >
                      <Pin className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => copyToClipboard(msg.text, msg.id)}
                      className="p-1 hover:bg-brand-bg-primary/60 rounded-md text-brand-text-muted hover:text-brand-text-main transition-all cursor-pointer"
                    >
                      {copiedMsgId === msg.id ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    </button>
                    {isSelf && (
                      <button
                        onClick={() => handleDeleteMessage(activeChatChannel, msg.id)}
                        className="p-1 hover:bg-brand-bg-primary/60 rounded-md text-brand-text-muted hover:text-rose-500 transition-all cursor-pointer"
                      >
                        <Trash2 className="w-3 h-3" />
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
          <div className="px-4 py-2 bg-brand-bg-secondary/80 border-t border-brand-border/40 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <img src={attachedPreview} alt="" className="w-8 h-8 rounded-lg object-cover" />
              <span className="text-xs text-brand-text-muted">Image attached</span>
            </div>
            <button onClick={() => { setAttachedFile(null); setAttachedPreview(null); }} className="text-brand-text-muted hover:text-brand-text-main">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Composer Form */}
        <form onSubmit={onSendMessage} className="p-3 border-t border-brand-border/40 bg-brand-bg-secondary/40 backdrop-blur-xl flex items-center gap-2">
          <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*,video/*,application/pdf" />

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="p-2 bg-brand-bg-primary border border-brand-border/60 text-brand-text-muted hover:text-brand-text-main rounded-xl transition-all cursor-pointer"
          >
            <Paperclip className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={toggleVoiceRecording}
            className={`p-2 rounded-xl border transition-all cursor-pointer ${
              isRecordingVoice ? 'bg-rose-500 border-rose-600 text-white animate-pulse' : 'bg-brand-bg-primary border border-brand-border/60 text-brand-text-muted hover:text-brand-text-main'
            }`}
          >
            <Mic className="w-4 h-4" />
          </button>

          {isRecordingVoice ? (
            <div className="flex-1 bg-rose-500/10 border border-rose-500/20 rounded-xl px-3 py-1.5 flex items-center justify-between text-xs font-bold text-rose-500">
              <span className="animate-pulse">Recording Voice Note... {formatTimer(voiceTimer)}</span>
              <button type="button" onClick={toggleVoiceRecording} className="underline cursor-pointer">Send</button>
            </div>
          ) : (
            <input
              type="text"
              placeholder={`Message ${selectedThread.name}...`}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="flex-1 bg-brand-bg-primary/80 border border-brand-border/60 rounded-xl px-3.5 py-2 text-xs text-brand-text-main outline-none focus:border-brand-primary/50 transition-all placeholder-brand-text-muted shadow-inner"
            />
          )}

          <button
            type="submit"
            disabled={!inputText.trim() && !attachedFile && !attachedPreview}
            className="p-2 bg-gradient-to-r from-brand-primary to-indigo-600 hover:brightness-110 disabled:opacity-50 text-white rounded-xl shadow-md transition-all cursor-pointer shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>

      {/* 3. Right Profile Details Sidebar (320px - 360px) */}
      {showDetails && (
        <div className="w-80 lg:w-90 border-l border-brand-border/40 bg-brand-bg-secondary/50 backdrop-blur-3xl p-5 hidden xl:flex flex-col gap-5 shrink-0 overflow-y-auto">
          {/* User Profile Card Header */}
          <div className="flex flex-col items-center text-center pb-4 border-b border-brand-border/30">
            <div className="relative mb-3">
              <img src={selectedThread.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'} alt="" className="w-20 h-20 rounded-full object-cover border-2 border-brand-primary/40 shadow-xl" />
              <span className={`absolute bottom-0.5 right-0.5 w-4 h-4 rounded-full border-2 border-brand-bg-secondary ${selectedThread.online ? 'bg-emerald-500' : 'bg-slate-400'}`} />
            </div>
            <h3 className="text-sm font-extrabold text-brand-text-main font-display">{selectedThread.name}</h3>
            <span className="text-[11px] font-semibold text-brand-primary bg-brand-primary/15 px-2.5 py-0.5 rounded-full mt-1 border border-brand-primary/20">{selectedThread.role || 'Member'}</span>
            <p className="text-[10px] text-brand-text-muted mt-1">{selectedThread.dept || 'CampusX Enterprise'}</p>
          </div>

          {/* Action Call Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <button onClick={() => startCall(selectedThread, 'audio')} className="p-3 bg-brand-bg-tertiary border border-brand-border/60 hover:border-brand-primary/40 hover:bg-brand-primary/10 rounded-2xl text-center cursor-pointer shadow-sm transition-all group">
              <Phone className="w-4 h-4 text-brand-primary mx-auto mb-1 group-hover:scale-110 transition-transform" />
              <span className="text-xs font-bold text-brand-text-main block">Audio Call</span>
            </button>
            <button onClick={() => startCall(selectedThread, 'video')} className="p-3 bg-brand-bg-tertiary border border-brand-border/60 hover:border-brand-primary/40 hover:bg-brand-primary/10 rounded-2xl text-center cursor-pointer shadow-sm transition-all group">
              <Video className="w-4 h-4 text-brand-primary mx-auto mb-1 group-hover:scale-110 transition-transform" />
              <span className="text-xs font-bold text-brand-text-main block">Video Call</span>
            </button>
          </div>

          {/* Security & Info Cards */}
          <div className="flex flex-col gap-3">
            <div className="p-3.5 bg-brand-bg-tertiary/80 border border-brand-border/60 rounded-2xl flex flex-col gap-1.5 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-brand-text-muted uppercase tracking-wider">Security Clearance</span>
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              </div>
              <span className="text-xs font-bold text-brand-text-main font-mono">256-bit P2P Encrypted</span>
            </div>

            <div className="p-3.5 bg-brand-bg-tertiary/80 border border-brand-border/60 rounded-2xl flex flex-col gap-1.5 shadow-sm">
              <span className="text-[10px] font-bold text-brand-text-muted uppercase tracking-wider">Status Protocol</span>
              <span className="text-xs font-semibold text-brand-text-main">{selectedThread.status || 'Active Now'}</span>
            </div>
          </div>
        </div>
      )}

      {/* 4. Active Audio / Video Call Modal */}
      <AnimatePresence>
        {activeCallUser && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-2xl flex items-center justify-center p-4"
          >
            <div className="w-full max-w-3xl bg-brand-bg-secondary/90 border border-white/10 rounded-3xl overflow-hidden shadow-2xl flex flex-col relative aspect-video">
              {/* Header */}
              <div className="p-4 bg-black/40 border-b border-white/10 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <img src={activeCallUser.avatar || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150'} alt="" className="w-8 h-8 rounded-full object-cover" />
                  <div>
                    <h3 className="text-xs font-bold text-white">{activeCallUser.name}</h3>
                    <p className="text-[9px] text-emerald-400 font-mono font-bold">{callStatus} • {formatTimer(callTimer)}</p>
                  </div>
                </div>
              </div>

              {/* Viewport */}
              <div className="flex-1 relative bg-slate-950 flex items-center justify-center overflow-hidden">
                {activeCallUser.callMode === 'video' ? (
                  <>
                    <img src={activeCallUser.avatar || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150'} alt="" className="w-full h-full object-cover filter brightness-90" />
                    <div className="absolute right-4 bottom-4 w-36 aspect-video bg-black/80 border border-white/20 rounded-xl overflow-hidden shadow-2xl">
                      <video ref={localVideoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center text-center p-6">
                    <div className="w-24 h-24 rounded-full bg-brand-primary/20 border-2 border-brand-primary/40 flex items-center justify-center animate-pulse mb-4">
                      <img src={activeCallUser.avatar || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150'} alt="" className="w-20 h-20 rounded-full object-cover" />
                    </div>
                    <h3 className="text-lg font-bold text-white mb-1">{activeCallUser.name}</h3>
                    <p className="text-[10px] text-slate-400 font-mono mb-4">Encrypted Voice Call</p>
                  </div>
                )}
              </div>

              {/* Controls */}
              <div className="p-3 bg-black/60 border-t border-white/10 flex justify-center items-center gap-3">
                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className={`p-3 rounded-xl border transition-all cursor-pointer ${isMuted ? 'bg-rose-500/20 border-rose-500 text-rose-500' : 'bg-white/10 border-white/10 text-white'}`}
                >
                  {isMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                </button>
                {activeCallUser.callMode === 'video' && (
                  <button
                    onClick={() => setIsCamOff(!isCamOff)}
                    className={`p-3 rounded-xl border transition-all cursor-pointer ${isCamOff ? 'bg-rose-500/20 border-rose-500 text-rose-500' : 'bg-white/10 border-white/10 text-white'}`}
                  >
                    {isCamOff ? <VideoOff className="w-4 h-4" /> : <Video className="w-4 h-4" />}
                  </button>
                )}
                <button
                  onClick={endCall}
                  className="px-6 py-3 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl shadow-lg transition-all cursor-pointer flex items-center gap-2 text-xs"
                >
                  <PhoneOff className="w-4 h-4" />
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
