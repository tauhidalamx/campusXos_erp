'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useConnect } from '../ConnectContext';
import { db, isFirebaseConfigured } from '../../../lib/firebase';
import { collection, onSnapshot, doc, setDoc } from 'firebase/firestore';
import { 
  Hash, 
  Users, 
  Send, 
  Paperclip,
  X,
  FileText
} from 'lucide-react';
import { motion } from 'framer-motion';

const defaultMockCommunityConversations = {
  'dept_cs_general': [
    { id: 'c1', senderName: 'Dr. Evelyn Sterling', senderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150', role: 'faculty', text: 'Welcome Computer Science cohort! The midterm lab assignments are open for submission.', time: 'Yesterday at 3:12 PM', timestamp: new Date(Date.now() - 86400000).toISOString() },
    { id: 'c2', senderName: 'Alex Rivera', senderAvatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150', role: 'student', text: 'Is there a specific template we should use for the database design schemas?', time: 'Yesterday at 4:05 PM', timestamp: new Date(Date.now() - 82000000).toISOString() },
    { id: 'c3', senderName: 'Dr. Evelyn Sterling', senderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150', role: 'faculty', text: 'Yes Alex, refer to the pdf guides pinned in the resources tab.', time: 'Yesterday at 4:15 PM', timestamp: new Date(Date.now() - 80000000).toISOString() }
  ],
  'ai_res_general': [
    { id: 'ca1', senderName: 'Prof. Alan Turing', senderAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150', role: 'faculty', text: 'Welcome to the AI Research Lab. We will review co-author draft updates here.', time: '2 days ago', timestamp: new Date(Date.now() - 172800000).toISOString() }
  ]
};

function getCommunityCache() {
  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      const stored = window.localStorage.getItem('campusx_connect_communityConversations');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && typeof parsed === 'object' && Object.keys(parsed).length > 0) {
          return parsed;
        }
      }
    } catch (e) {}
  }
  return defaultMockCommunityConversations;
}

export default function CommunitiesView() {
  const { 
    currentUser, 
    users, 
    activeCommunityId, 
    setActiveCommunityId, 
    activeCommunityChannel, 
    setActiveCommunityChannel 
  } = useConnect();

  const [messageText, setMessageText] = useState('');
  const [attachedFile, setAttachedFile] = useState(null);
  const [attachedPreview, setAttachedPreview] = useState(null);
  const fileInputRef = useRef(null);
  const messagesEndRef = useRef(null);
  
  // Local list of channel message logs with instant cache hydration
  const [channelConversations, setChannelConversations] = useState(getCommunityCache);

  // Sync to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined' && window.localStorage && channelConversations) {
      try {
        window.localStorage.setItem('campusx_connect_communityConversations', JSON.stringify(channelConversations));
      } catch (e) {}
    }
  }, [channelConversations]);

  const communities = [
    { id: 'dept_cs', name: 'Computer Science', category: 'ACADEMIC', channels: ['general', 'labs', 'announcements', 'projects'] },
    { id: 'ai_res', name: 'AI Research Group', category: 'RESEARCH', channels: ['general', 'papers', 'grants', 'ml-gpu-queue'] },
    { id: 'blockchain', name: 'Blockchain Club', category: 'CLUBS', channels: ['general', 'hackathons', 'nodes', 'governance'] },
    { id: 'placement_cell', name: 'Placement Cell', category: 'OFFICIAL', channels: ['general', 'meta-leads', 'stripe-updates', 'resume-tips'] },
    { id: 'hostel', name: 'Hostel Community', category: 'CAMPUS', channels: ['general', 'maintenance', 'canteen-menu'] },
    { id: 'alumni', name: 'Alumni Network', category: 'CAMPUS', channels: ['general', 'referrals', 'events'] }
  ];

  const currentComm = communities.find(c => c.id === activeCommunityId) || communities[0];
  const activeChatKey = `${currentComm.id}_${activeCommunityChannel}`;

  // Helper to cleanly merge local and remote channel messages
  const mergeMessages = (existing = [], incoming = []) => {
    const map = new Map();
    (existing || []).forEach(m => { if (m && m.id) map.set(String(m.id), m); });
    (incoming || []).forEach(m => {
      if (m && m.id) {
        const prev = map.get(String(m.id));
        map.set(String(m.id), prev ? { ...prev, ...m } : m);
      }
    });
    return Array.from(map.values()).sort((a, b) => (a.timestamp || a.time || '').localeCompare(b.timestamp || b.time || ''));
  };

  // Sync with SQLite backend & Firebase Firestore
  useEffect(() => {
    if (!activeChatKey) return;

    // 1. Initial REST fetch for local/offline persistence from SQLite
    fetch(`/api/community-messages/${activeChatKey}`)
      .then(r => {
        if (!r.ok) return null;
        return r.json();
      })
      .then(msgs => {
        if (Array.isArray(msgs) && msgs.length > 0) {
          setChannelConversations(prev => {
            const currentList = prev[activeChatKey] || [];
            const merged = mergeMessages(currentList, msgs);
            return { ...prev, [activeChatKey]: merged };
          });
        }
      })
      .catch(() => {});

    // 2. Real-time Firebase Firestore listener
    if (isFirebaseConfigured && db) {
      try {
        const msgsCol = collection(db, 'community_messages', activeChatKey, 'messages');
        const unsub = onSnapshot(msgsCol, (snapshot) => {
          if (!snapshot.empty) {
            const fetched = [];
            snapshot.forEach(docSnap => {
              fetched.push({ id: docSnap.id, ...docSnap.data() });
            });
            setChannelConversations(prev => {
              const currentList = prev[activeChatKey] || [];
              const merged = mergeMessages(currentList, fetched);
              return { ...prev, [activeChatKey]: merged };
            });
          }
        }, () => {});
        return () => unsub();
      } catch (e) {}
    }
  }, [activeChatKey]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [channelConversations[activeChatKey]]);

  const messages = channelConversations[activeChatKey] || [
    { id: 'empty', senderName: 'System Node', senderAvatar: '', role: 'system', text: `Welcome to the start of # ${activeCommunityChannel}! Send a message below to start the conversation.`, time: 'Just now' }
  ];

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

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!messageText.trim() && !attachedFile && !attachedPreview) return;

    const msgId = 'cmsg_' + Date.now();
    const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const timestampStr = new Date().toISOString();

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

    const newMsg = {
      id: msgId,
      channelKey: activeChatKey,
      senderId: currentUser?.id || 'usr_me',
      senderName: currentUser?.name || 'You',
      senderAvatar: currentUser?.avatar || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
      role: currentUser?.role || 'student',
      text: messageText ? messageText.trim() : '',
      mediaUrl: mediaUrl || null,
      mediaType: mediaType || null,
      fileName: fileName || null,
      time: nowStr,
      timestamp: timestampStr,
      reactions: {}
    };

    // 1. Instant local update & localStorage sync
    setChannelConversations(prev => {
      const currentList = prev[activeChatKey] || [];
      const updatedList = [...currentList, newMsg];
      const updatedAll = { ...prev, [activeChatKey]: updatedList };
      if (typeof window !== 'undefined' && window.localStorage) {
        try {
          window.localStorage.setItem('campusx_connect_communityConversations', JSON.stringify(updatedAll));
        } catch (e) {}
      }
      return updatedAll;
    });

    setMessageText('');
    setAttachedFile(null);
    setAttachedPreview(null);

    // 2. Dual-write to SQLite backend on disk
    fetch('/api/community-messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ channelKey: activeChatKey, message: newMsg })
    }).catch(() => {});

    // 3. Direct write to Cloud Firestore if client configured
    if (isFirebaseConfigured && db) {
      try {
        const msgDocRef = doc(db, 'community_messages', activeChatKey, 'messages', msgId);
        setDoc(msgDocRef, newMsg).catch(() => {});
      } catch (e) {}
    }
  };

  return (
    <div className="w-full min-w-0 flex-1 flex flex-col md:flex-row bg-white border border-slate-200/90 rounded-3xl overflow-hidden min-h-[680px] select-none text-left shadow-2xs">
      
      {/* 1. Left Sidebar: Communities and Channel categories */}
      <div className="w-64 bg-slate-50/80 border-r border-slate-200/80 flex flex-col shrink-0">
        <div className="p-3.5 px-4 border-b border-slate-200/80 flex items-center justify-center bg-white text-center">
          <div className="flex items-center justify-center gap-2">
            <Users className="w-4 h-4 text-indigo-600 shrink-0" />
            <span className="text-sm font-bold text-slate-900 tracking-tight">Communities</span>
            <span className="text-[9.5px] bg-indigo-50 text-indigo-700 border border-indigo-200 px-2 py-0.5 rounded-lg font-mono font-extrabold shadow-2xs">CAMPUS</span>
          </div>
        </div>

        {/* Communities selector list */}
        <div className="flex-1 overflow-y-auto p-3.5 flex flex-col gap-4 story-tray-scrollbar">
          
          <div className="flex flex-col gap-1.5">
            <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest text-center block">Select Server</span>
            <div className="flex flex-col gap-1">
              {communities.map((comm) => (
                <button
                  key={comm.id}
                  onClick={() => {
                    setActiveCommunityId(comm.id);
                    setActiveCommunityChannel('general');
                  }}
                  className={`w-full flex items-center gap-3 p-2.5 px-3 rounded-xl text-xs font-bold cursor-pointer transition-all min-w-0 ${
                    activeCommunityId === comm.id
                      ? 'bg-indigo-50 text-indigo-700 font-bold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
                  }`}
                >
                  <Users className="w-4 h-4 shrink-0 text-indigo-600" />
                  <span className="truncate flex-1 text-left">{comm.name}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="border-t border-slate-200/80 my-0.5" />

          {/* Current Community channels list */}
          <div className="flex flex-col gap-1.5">
            <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest text-center block">CHANNELS</span>
            <div className="flex flex-col gap-1">
              {currentComm.channels.map((chan) => (
                <button
                  key={chan}
                  onClick={() => setActiveCommunityChannel(chan)}
                  className={`w-full flex items-center gap-3 p-2.5 px-3 rounded-xl text-xs font-semibold cursor-pointer transition-all min-w-0 ${
                    activeCommunityChannel === chan
                      ? 'bg-white text-slate-900 font-bold shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/40'
                  }`}
                >
                  <Hash className="w-4 h-4 shrink-0 text-slate-400" />
                  <span className="truncate flex-1 text-left">{chan}</span>
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Current user card at bottom */}
        {currentUser && (
          <div className="p-3.5 px-4 border-t border-slate-200/80 bg-white flex items-center gap-3">
            <img src={currentUser.avatar} alt="" className="w-8 h-8 rounded-full object-cover border border-slate-200 shrink-0 shadow-2xs" />
            <div className="flex flex-col text-left min-w-0 flex-1">
              <span className="text-xs font-bold text-slate-800 truncate">{currentUser.name}</span>
              <span className="text-[9.5px] font-bold text-slate-400 truncate uppercase mt-0.5">{currentUser.role}</span>
            </div>
          </div>
        )}
      </div>

      {/* 2. Middle Panel: Messages workspace */}
      <div className="flex-1 flex flex-col bg-white overflow-hidden relative">
        
        {/* Chat Window Header */}
        <div className="p-4 px-5 border-b border-slate-200/80 bg-white flex items-center justify-between z-10 shadow-2xs">
          <div className="flex items-center gap-2.5 min-w-0">
            <Hash className="w-5 h-5 text-slate-400 shrink-0" />
            <span className="font-extrabold text-sm text-slate-900 truncate">
              {activeCommunityChannel}
            </span>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <div className="text-[9.5px] font-extrabold text-slate-600 uppercase tracking-widest bg-slate-100 border border-slate-200 px-3 py-1 rounded-lg shadow-2xs">
              {currentComm.category}
            </div>
          </div>
        </div>

        {/* Messages viewport */}
        <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-4 bg-slate-50/30 story-tray-scrollbar">
          {messages.map((msg, i) => (
            <div key={msg.id || i} className="flex gap-3 text-xs leading-normal">
              {msg.senderAvatar ? (
                <img src={msg.senderAvatar} alt="" className="w-8 h-8 rounded-full object-cover shrink-0 border border-slate-200 mt-0.5 shadow-2xs" />
              ) : (
                <div className="w-8 h-8 rounded-full bg-indigo-50 border border-indigo-200 flex items-center justify-center shrink-0 text-indigo-700 font-bold text-xs">S</div>
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-2">
                  <span className="font-bold text-slate-900 hover:underline cursor-pointer">{msg.senderName}</span>
                  {msg.role && msg.role !== 'student' && (
                    <span className="text-[8.5px] font-bold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded border border-emerald-200 uppercase tracking-wider">
                      {msg.role}
                    </span>
                  )}
                  <span className="text-[9.5px] font-mono text-slate-400 font-medium">{msg.time}</span>
                </div>
                
                {/* Message Attachments */}
                {msg.mediaUrl && (
                  <div className="mt-2">
                    {(msg.mediaType === 'image' || (!msg.mediaType && (typeof msg.mediaUrl === 'string' && (msg.mediaUrl.match(/\.(jpeg|jpg|gif|png|webp)/i) || msg.mediaUrl.startsWith('data:image/'))))) ? (
                      <img src={msg.mediaUrl} alt={msg.fileName || "Attachment"} className="max-h-56 max-w-sm object-cover rounded-xl border border-slate-200 shadow-xs" />
                    ) : msg.mediaType === 'video' ? (
                      <video src={msg.mediaUrl} controls className="max-h-56 max-w-sm rounded-xl border border-slate-200 shadow-xs" />
                    ) : (
                      <a 
                        href={msg.mediaUrl} 
                        download={msg.fileName || "document"} 
                        target="_blank" 
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 p-2.5 px-3.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl border border-slate-200 transition-all cursor-pointer shadow-2xs"
                      >
                        <FileText className="w-4 h-4 text-indigo-600 shrink-0" />
                        <span className="text-xs font-semibold truncate max-w-xs">{msg.fileName || 'Attached Document'}</span>
                        <span className="text-[9.5px] uppercase font-bold text-indigo-600 shrink-0">Download</span>
                      </a>
                    )}
                  </div>
                )}

                {msg.text && (
                  <p className="text-slate-700 mt-1 font-medium leading-relaxed break-words">
                    {msg.text}
                  </p>
                )}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Attachment preview */}
        {attachedPreview && (
          <div className="px-4 py-2 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <img src={attachedPreview} alt="" className="w-9 h-9 rounded-lg object-cover border border-slate-200 shadow-xs" />
              <span className="text-xs font-semibold text-slate-700 truncate max-w-xs">{attachedFile?.name || 'File ready to send'}</span>
            </div>
            <button onClick={() => { setAttachedFile(null); setAttachedPreview(null); }} className="text-slate-400 hover:text-slate-700 p-1">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Chat input box */}
        <form onSubmit={handleSendMessage} className="p-3.5 px-4 border-t border-slate-200/80 bg-white flex gap-2.5 items-center">
          <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*,video/*,application/pdf" />

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="p-2.5 bg-slate-50 border border-slate-200 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all cursor-pointer shadow-2xs shrink-0"
            title="Attach file or media"
          >
            <Paperclip className="w-4 h-4" />
          </button>

          <input 
            type="text" 
            placeholder={`Message # ${activeCommunityChannel}`}
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            className="flex-1 min-w-0 bg-slate-50 border border-slate-200 text-xs text-slate-800 placeholder-slate-400 p-3 px-4 rounded-xl outline-none focus:border-indigo-600 focus:bg-white transition-all shadow-inner font-medium"
          />
          <button type="submit" disabled={!messageText.trim() && !attachedFile && !attachedPreview} className="p-3 px-4 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:brightness-105 disabled:opacity-40 text-white rounded-xl shadow-md shadow-indigo-500/20 shrink-0 cursor-pointer">
            <Send className="w-4 h-4" />
          </button>
        </form>

      </div>

      {/* 3. Right Sidebar: Server Members Directory */}
      <div className="w-56 bg-slate-50/80 border-l border-slate-200/80 flex flex-col shrink-0 hidden md:flex">
        <div className="p-3.5 px-4 border-b border-slate-200/80 bg-white text-center flex items-center justify-center">
          <span className="text-xs font-extrabold text-slate-500 uppercase tracking-widest">Members</span>
        </div>
        
        <div className="flex-1 overflow-y-auto p-3.5 flex flex-col gap-4 text-left story-tray-scrollbar">
          {/* Online Faculty Category */}
          <div className="flex flex-col gap-1.5">
            <span className="text-[9.5px] font-extrabold text-slate-400 uppercase tracking-widest pl-1">FACULTY — 2</span>
            {users.filter(u => u.role === 'faculty').slice(0, 2).map((fac) => (
              <div key={fac.id} className="flex items-center gap-2.5 p-2 hover:bg-white rounded-xl cursor-pointer transition-all border border-transparent hover:border-slate-200 shadow-2xs">
                <div className="relative shrink-0">
                  <img src={fac.avatar} alt="" className="w-6.5 h-6.5 rounded-full object-cover border border-slate-200" />
                  <span className="absolute bottom-0 right-0 w-2 h-2 bg-emerald-500 rounded-full border border-white" />
                </div>
                <span className="text-xs text-slate-700 font-bold truncate">{fac.name}</span>
              </div>
            ))}
          </div>

          {/* Online Students Category */}
          <div className="flex flex-col gap-1.5">
            <span className="text-[9.5px] font-extrabold text-slate-400 uppercase tracking-widest pl-1">STUDENTS — 4</span>
            {users.filter(u => u.role === 'student').slice(0, 4).map((stud) => (
              <div key={stud.id} className="flex items-center gap-2.5 p-2 hover:bg-white rounded-xl cursor-pointer transition-all border border-transparent hover:border-slate-200 shadow-2xs">
                <div className="relative shrink-0">
                  <img src={stud.avatar} alt="" className="w-6.5 h-6.5 rounded-full object-cover border border-slate-200" />
                  <span className="absolute bottom-0 right-0 w-2 h-2 bg-emerald-500 rounded-full border border-white" />
                </div>
                <span className="text-xs text-slate-700 font-bold truncate">{stud.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}
