'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useConnect } from '../ConnectContext';
import { 
  MessageSquare, 
  ChevronDown, 
  ChevronUp, 
  Search, 
  Send, 
  Video, 
  Mic, 
  MicOff, 
  Camera, 
  CameraOff, 
  PhoneOff,
  Sparkles,
  Paperclip,
  CheckCheck,
  X,
  Volume2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function FloatingMessenger() {
  const { 
    currentUser,
    users,
    messengerOpen, 
    setMessengerOpen,
    activeChatChannel, 
    setActiveChatChannel,
    chatSearchQuery, 
    setChatSearchQuery,
    chatInput, 
    setChatInput,
    chatMessages,
    handleChatSend,
    activeCallUser,
    setActiveCallUser,
    callStatus,
    setCallStatus,
    isMuted,
    setIsMuted,
    isCamOff,
    setIsCamOff
  } = useConnect();

  const [minimized, setMinimized] = useState(true);
  const [voiceRecording, setVoiceRecording] = useState(false);
  const [showEmojiReaction, setShowEmojiReaction] = useState(null);
  
  const messagesEndRef = useRef(null);
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const localStreamRef = useRef(null);
  const callTimerRef = useRef(null);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages, activeChatChannel, minimized]);

  const activeMessages = chatMessages[activeChatChannel] || [];

  // Dynamic list of conversation channels combining standard channels + all active users
  const defaultChannels = [
    { id: 'channel_general', name: 'General Announcements', type: 'channel', unread: false },
    { id: 'ai_chat', name: 'CampusX AI Copilot', type: 'ai', unread: true }
  ];

  const userChannels = (users || [])
    .filter(u => u.id !== currentUser?.id)
    .map(u => ({
      id: u.id,
      name: u.name,
      type: u.role === 'faculty' ? 'faculty' : u.role === 'student' ? 'student' : 'member',
      avatar: u.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      unread: false
    }));

  const allConversationChannels = [
    ...defaultChannels,
    ...userChannels.filter(uc => !defaultChannels.some(dc => dc.id === uc.id))
  ];

  const filteredChannels = allConversationChannels.filter(ch => {
    if (!chatSearchQuery.trim()) return true;
    const q = chatSearchQuery.toLowerCase();
    return ch.name.toLowerCase().includes(q) || ch.type.toLowerCase().includes(q);
  });

  const handleChannelSelect = (channelId) => {
    setActiveChatChannel(channelId);
    setMessengerOpen(true);
    setMinimized(false);
  };

  const handleVoiceRecord = () => {
    if (voiceRecording) {
      // Simulate sending voice note
      setVoiceRecording(false);
      const newMsg = {
        id: 'voice_' + Date.now(),
        senderName: currentUser.name,
        senderAvatar: currentUser.avatar,
        text: '🎤 Voice Note (0:04)',
        time: 'Just now',
        reactions: {},
        read: false
      };
      
      // Append local chat state
      chatMessages[activeChatChannel] = [...activeMessages, newMsg];
      setChatInput('');
    } else {
      setVoiceRecording(true);
    }
  };

  // Video call triggers
  const startVideoCall = async (user) => {
    setActiveCallUser(user);
    setCallStatus('Ringing');

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      localStreamRef.current = stream;
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.warn('Camera blocked:', err.message);
      setCallStatus('Call preview mode (Camera Blocked)');
    }

    callTimerRef.current = setTimeout(() => {
      setCallStatus('Connecting');
      
      callTimerRef.current = setTimeout(() => {
        setCallStatus('Connected');
        if (remoteVideoRef.current) {
          if (localStreamRef.current) {
            remoteVideoRef.current.srcObject = localStreamRef.current;
          } else {
            remoteVideoRef.current.src = 'https://www.w3schools.com/html/mov_bbb.mp4';
            remoteVideoRef.current.loop = true;
            remoteVideoRef.current.play().catch(err => console.log(err));
          }
        }
      }, 1500);

    }, 3000);
  };

  const endCall = () => {
    if (callTimerRef.current) clearTimeout(callTimerRef.current);
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => track.stop());
    }
    localStreamRef.current = null;
    if (localVideoRef.current) localVideoRef.current.srcObject = null;
    if (remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = null;
      remoteVideoRef.current.src = '';
    }
    setActiveCallUser(null);
    setCallStatus('Disconnected');
  };

  const handleMessageReact = (msgId, emoji) => {
    // Apply local updates
    const updatedMessages = activeMessages.map(msg => {
      if (msg.id === msgId) {
        const reactions = { ...msg.reactions };
        reactions[emoji] = (reactions[emoji] || 0) + 1;
        return { ...msg, reactions };
      }
      return msg;
    });

    chatMessages[activeChatChannel] = updatedMessages;
    setShowEmojiReaction(null);
  };

  return (
    <div className="chat-widget-dock flex flex-col items-end connect-font-inter">
      
      {/* Real-time Video Call Overlay Popup */}
      <AnimatePresence>
        {activeCallUser && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 50 }}
            className="fixed inset-0 z-[100] bg-black/85 backdrop-blur-md flex items-center justify-center p-4"
          >
            <div className="w-full max-w-[640px] aspect-video bg-[#0B1736] border border-white/10 rounded-3xl overflow-hidden relative shadow-2xl flex flex-col">
              
              {/* Call overlay state overlay */}
              {(callStatus === 'Ringing' || callStatus.includes('Blocked')) && (
                <div className="absolute inset-0 bg-[#071126]/95 z-20 flex flex-col items-center justify-center p-6 text-center">
                  <div className="w-20 h-20 bg-brand-primary/10 border-2 border-brand-primary/20 rounded-full flex items-center justify-center animate-pulse shadow-inner mb-4">
                    <img src={activeCallUser.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150'} alt="" className="w-16 h-16 rounded-full object-cover" />
                  </div>
                  <h3 className="text-lg font-bold text-white">{activeCallUser.name}</h3>
                  <span className="text-brand-primary text-xs font-mono font-bold uppercase tracking-wider animate-bounce mt-1.5">{callStatus}...</span>
                </div>
              )}

              {/* Videos */}
              <div className="w-full h-full relative bg-black">
                {/* Remote Video Stream */}
                <video ref={remoteVideoRef} className="w-full h-full object-cover" autoPlay playsInline />
                
                {/* Local Camera stream overlay */}
                <div className="absolute right-4 bottom-20 w-32 aspect-video bg-[#071126] border border-white/10 rounded-xl overflow-hidden shadow-2xl z-10">
                  <video ref={localVideoRef} className="w-full h-full object-cover" autoPlay playsInline muted />
                </div>

                {/* Calling controls toolbar overlay */}
                <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-4 z-10">
                  <button 
                    onClick={() => setIsMuted(!isMuted)} 
                    className={`p-3.5 rounded-full border transition-all ${
                      isMuted 
                        ? 'bg-rose-500/20 border-rose-500/30 text-rose-500' 
                        : 'bg-[#102043]/80 border-white/5 text-white hover:bg-white/10'
                    }`}
                  >
                    {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                  </button>
                  <button 
                    onClick={() => setIsCamOff(!isCamOff)} 
                    className={`p-3.5 rounded-full border transition-all ${
                      isCamOff 
                        ? 'bg-rose-500/20 border-rose-500/30 text-rose-500' 
                        : 'bg-[#102043]/80 border-white/5 text-white hover:bg-white/10'
                    }`}
                  >
                    {isCamOff ? <CameraOff className="w-5 h-5" /> : <Camera className="w-5 h-5" />}
                  </button>
                  <button 
                    onClick={endCall} 
                    className="p-3.5 bg-rose-500 hover:bg-rose-600 text-white rounded-full transition-all shadow-lg pulse-call-button"
                  >
                    <PhoneOff className="w-5 h-5" />
                  </button>
                </div>
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main messenger collapsible card overlay */}
      <div 
        className={`messenger-container fixed bottom-0 right-6 z-40 w-80 rounded-t-2xl shadow-xl border border-slate-200 bg-white flex flex-col overflow-hidden transition-all duration-200 ${
          minimized ? 'h-13' : 'h-[480px]'
        }`}
      >
        
        {/* Messenger Header bar */}
        <div 
          onClick={() => setMinimized(!minimized)}
          className="px-4 py-3 bg-white border-b border-slate-100 flex items-center justify-between cursor-pointer select-none"
        >
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-ping shrink-0" />
            <span className="text-xs font-bold text-slate-900 tracking-wide">CampusX Direct Chat</span>
          </div>
          <div className="flex items-center">
            {/* Unread count badge */}
            <span className="px-2 py-0.5 text-xs rounded-full bg-blue-600 text-white font-medium mr-3">3 unread</span>
            {minimized ? <ChevronUp className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
          </div>
        </div>

        {/* Messaging Body content */}
        {!minimized && (
          <div className="flex-1 flex overflow-hidden">
            
            {/* Left panels view: Conversations list */}
            {messengerOpen === false ? (
              <div className="w-full flex flex-col overflow-hidden">
                {/* Search Bar */}
                <div className="p-3.5 px-4 border-b border-slate-200 bg-white">
                  <div className="flex items-center bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 gap-2 shadow-2xs focus-within:border-indigo-500 focus-within:bg-white transition-all">
                    <Search className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <input 
                      type="text" 
                      placeholder="Search channels, people..." 
                      value={chatSearchQuery}
                      onChange={(e) => setChatSearchQuery(e.target.value)}
                      className="bg-transparent border-none text-xs text-slate-800 outline-none w-full placeholder-slate-400 font-medium"
                    />
                    {chatSearchQuery && (
                      <button onClick={() => setChatSearchQuery('')} className="text-slate-400 hover:text-slate-700 cursor-pointer">
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Channel & People List */}
                <div className="flex-1 overflow-y-auto p-2.5 flex flex-col gap-1.5 text-left story-tray-scrollbar">
                  {filteredChannels.length > 0 ? (
                    filteredChannels.map((ch) => (
                      <div 
                        key={ch.id}
                        onClick={() => handleChannelSelect(ch.id)}
                        className={`flex justify-between items-center p-2.5 px-3 rounded-xl cursor-pointer transition-all duration-150 gap-2.5 min-w-0 ${
                          activeChatChannel === ch.id 
                            ? 'bg-indigo-50 text-indigo-700 font-bold' 
                            : 'hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0 flex-1">
                          {ch.avatar ? (
                            <img src={ch.avatar} alt="" className="w-8 h-8 rounded-full object-cover shrink-0" />
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-indigo-50 text-indigo-700 flex items-center justify-center shrink-0">
                              {ch.type === 'ai' ? <Sparkles className="w-4 h-4 text-indigo-600" /> : <MessageSquare className="w-4 h-4" />}
                            </div>
                          )}
                          <div className="flex flex-col min-w-0 text-left flex-1">
                            <span className="text-xs font-bold text-slate-900 truncate">{ch.name}</span>
                            <span className="text-[10px] font-medium text-slate-500 mt-0.5 capitalize truncate">{ch.type} chat</span>
                          </div>
                        </div>
                        
                        {ch.unread && (
                          <span className="w-2.5 h-2.5 rounded-full bg-indigo-600 shrink-0 shadow-2xs" />
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="p-6 text-center text-xs text-slate-400 font-medium">
                      No contacts or channels found matching "{chatSearchQuery}".
                    </div>
                  )}
                </div>
              </div>
            ) : (
              
              /* Right panels view: Active Chat window */
              <div className="w-full flex flex-col overflow-hidden relative bg-white">
                
                {/* Chat window Header */}
                <div className="p-3 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <button 
                      onClick={() => setMessengerOpen(false)}
                      className="text-xs font-bold text-slate-500 hover:text-slate-900 mr-1 shrink-0 cursor-pointer"
                      title="Back to Contacts"
                    >
                      ← Back
                    </button>
                    {allConversationChannels.find(ch => ch.id === activeChatChannel)?.avatar && (
                      <img 
                        src={allConversationChannels.find(ch => ch.id === activeChatChannel)?.avatar} 
                        alt="" 
                        className="w-6 h-6 rounded-full object-cover border border-slate-200 shrink-0" 
                      />
                    )}
                    <span className="text-xs font-bold text-slate-900 truncate max-w-[140px]">
                      {allConversationChannels.find(ch => ch.id === activeChatChannel)?.name || (users || []).find(u => u.id === activeChatChannel)?.name || 'Direct Channel'}
                    </span>
                  </div>
                  
                  {/* Video Call trigger */}
                  {activeChatChannel !== 'channel_general' && activeChatChannel !== 'ai_chat' && (
                    <button 
                      onClick={() => {
                        const rec = (users || []).find(u => u.id === activeChatChannel) || allConversationChannels.find(ch => ch.id === activeChatChannel) || { name: 'CampusX Node', avatar: '' };
                        startVideoCall(rec);
                      }}
                      title="Start Video Call"
                      className="p-1.5 bg-indigo-50 border border-indigo-200 text-indigo-700 hover:bg-brand-primary hover:text-white rounded-xl transition-all cursor-pointer"
                    >
                      <Video className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Messages scroller viewport */}
                <div className="flex-1 overflow-y-auto p-4 px-4.5 flex flex-col gap-3.5 story-tray-scrollbar bg-slate-50/40">
                  {activeMessages.length === 0 && (
                    <div className="flex-1 flex flex-col items-center justify-center text-center p-6 text-slate-400 my-auto">
                      <div className="w-10 h-10 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 flex items-center justify-center mb-2 shadow-2xs">
                        <MessageSquare className="w-5 h-5" />
                      </div>
                      <span className="text-xs font-bold text-slate-800">Direct Chat</span>
                      <span className="text-[10.5px] text-slate-500 mt-1 font-medium">Send a message below to start the conversation!</span>
                    </div>
                  )}
                  {activeMessages.map((msg) => {
                    const isSelf = msg.senderName === currentUser?.name;
                    return (
                      <div key={msg.id} className={`flex items-start gap-2.5 ${isSelf ? 'flex-row-reverse text-right' : 'text-left'}`}>
                        <img 
                          src={msg.senderAvatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150'} 
                          alt="" 
                          className="w-7 h-7 rounded-full object-cover border border-slate-200 mt-0.5 shrink-0 shadow-2xs" 
                        />
                        <div className="flex flex-col min-w-0 max-w-[75%]">
                          <div className={`flex items-baseline gap-1.5 mb-1 px-1 ${isSelf ? 'flex-row-reverse' : ''}`}>
                            <span className="text-[10.5px] font-bold text-slate-600">{msg.senderName.split(' ')[0]}</span>
                            <span className="text-[8.5px] font-mono text-slate-400">{msg.time}</span>
                          </div>
                          
                          {/* Chat bubble */}
                          <div 
                            className={`p-3.5 px-4 rounded-2xl text-xs leading-relaxed font-medium relative group shadow-2xs break-words ${
                              isSelf ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-br-xs' : 'bg-white text-slate-800 border border-slate-200 rounded-bl-xs'
                            }`}
                            onDoubleClick={() => setShowEmojiReaction(msg.id)}
                          >
                            <p className="whitespace-pre-wrap">{msg.text}</p>
                            
                            {/* Double tap reactions selector overlay */}
                            <AnimatePresence>
                              {showEmojiReaction === msg.id && (
                                <>
                                  <div className="fixed inset-0 z-40" onClick={() => setShowEmojiReaction(null)} />
                                  <motion.div 
                                    initial={{ scale: 0.8, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    className="absolute -top-10 left-0 bg-white border border-slate-200 rounded-full p-1 z-50 flex gap-1.5 shadow-xl"
                                  >
                                    {['👍', '❤️', '🔥', '👏'].map(emoji => (
                                      <button 
                                        key={emoji}
                                        onClick={() => handleMessageReact(msg.id, emoji)}
                                        className="text-xs hover:scale-130 transition-all cursor-pointer bg-transparent border-none"
                                      >
                                        {emoji}
                                      </button>
                                    ))}
                                  </motion.div>
                                </>
                              )}
                            </AnimatePresence>
                          </div>

                          {/* Render reactions indices */}
                          {msg.reactions && Object.keys(msg.reactions).length > 0 && (
                            <div className={`flex gap-1 mt-1.5 ${isSelf ? 'justify-end' : ''}`}>
                              {Object.entries(msg.reactions).map(([emoji, count]) => (
                                <span key={emoji} className="bg-white border border-slate-200 px-2 py-0.5 rounded-full text-[9.5px] font-bold font-mono text-slate-600 shadow-2xs">
                                  {emoji} {count}
                                </span>
                              ))}
                            </div>
                          )}

                        </div>
                      </div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </div>

                {/* Message input tray */}
                <div className="p-3 px-3.5 border-t border-slate-200 bg-white flex gap-2 items-center">
                  <button className="p-2 text-slate-400 hover:text-slate-800 rounded-xl cursor-pointer shrink-0">
                    <Paperclip className="w-4 h-4" />
                  </button>
                  <input 
                    type="text" 
                    placeholder={voiceRecording ? 'Recording audio...' : 'Type message...'}
                    disabled={voiceRecording}
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') handleChatSend(); }}
                    className="flex-1 min-w-0 bg-slate-50 border border-slate-200 text-xs text-slate-800 p-2.5 px-3.5 rounded-xl outline-none placeholder-slate-400 focus:border-indigo-600 focus:bg-white transition-all shadow-inner font-medium"
                  />
                  
                  {/* Voice Note button */}
                  <button 
                    onClick={handleVoiceRecord}
                    className={`p-2.5 rounded-xl transition-all border cursor-pointer shrink-0 ${
                      voiceRecording 
                        ? 'bg-rose-500 border-rose-500 text-white animate-pulse' 
                        : 'bg-slate-50 border-slate-200 text-slate-500 hover:text-slate-900'
                    }`}
                  >
                    <Mic className="w-4 h-4" />
                  </button>
                  
                  <button 
                    onClick={handleChatSend}
                    className="p-2.5 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-xl hover:brightness-105 shadow-md shadow-indigo-500/20 shrink-0 cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>

              </div>
            )}

          </div>
        )}

      </div>

    </div>
  );
}
