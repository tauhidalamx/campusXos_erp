'use client';

import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  Paperclip, 
  Smile, 
  Video, 
  Mic, 
  Sparkles, 
  CheckCheck,
  Pin,
  Bookmark,
  Reply,
  Globe,
  Trash2,
  Edit2,
  Calendar,
  Vote,
  CheckSquare,
  FileText,
  Download,
  Terminal,
  Code
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ConversationArea({ channelId, onStartCall }) {
  const [messages, setMessages] = useState([]);
  const [textInput, setTextInput] = useState('');
  const [replyTarget, setReplyTarget] = useState(null);
  const [pinnedMessages, setPinnedMessages] = useState([]);
  const [showEmojiMenu, setShowEmojiMenu] = useState(null);
  
  // Translation state
  const [translations, setTranslations] = useState({});
  const [translatingId, setTranslatingId] = useState(null);

  // Poll Vote states
  const [votedPolls, setVotedPolls] = useState({});

  // Message refs
  const messagesEndRef = useRef(null);

  // Pre-load dummy conversations based on channelId
  useEffect(() => {
    const defaultData = {
      'ai_copilot': [
        { id: 'm_ai1', sender: 'CampusX AI Copilot', avatar: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=150', text: 'Greeting! I parsed the cs202 grading parameters on the trust ledger. I recommend starting a study session.', time: '10:00 AM', isSystem: false, reactions: {} }
      ],
      'usr_001': [
        { id: 'm_str1', sender: 'Dr. Evelyn Sterling', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150', text: 'I uploaded the peer review guidelines draft for the consensus algorithm.', time: 'Yesterday at 3:12 PM', isSystem: false, reactions: { '👍': 2 } },
        { id: 'm_str2', sender: 'Dr. Evelyn Sterling', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150', time: 'Yesterday at 3:15 PM', text: 'Please review the Solidity deployment gas optimizations in the attached file.', time: 'Yesterday at 3:15 PM', file: { name: 'Optimizations.sol', size: '4.8 KB', type: 'code' }, isSystem: false, reactions: {} }
      ],
      'dept_cs': [
        { id: 'm_cs1', sender: 'Dr. Evelyn Sterling', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150', text: 'Welcome to the Computer Science Department messaging space.', time: '2 days ago', isSystem: true, reactions: {} },
        { id: 'm_cs2', sender: 'Prof. Marcus Chen', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150', text: 'Should we set the next faculty committee review date?', time: 'Yesterday', isSystem: false, reactions: {} },
        { id: 'm_cs3', sender: 'Dr. Ada Lovelace', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150', time: '10:30 AM', text: 'Let’s launch a poll to decide the date.', time: '10:30 AM', poll: { id: 'p_cs1', question: 'Select Faculty Committee Date', options: ['Friday at 14:00', 'Monday at 10:00'], votes: { 0: 4, 1: 2 } }, isSystem: false, reactions: {} }
      ],
      'res_dl_models': [
        { id: 'm_res1', sender: 'Prof. Alan Turing', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150', text: 'We need to verify the deep learning citation scores.', time: '2h ago', isSystem: false, reactions: { '🔥': 4 } },
        { id: 'm_res2', sender: 'Dr. Grace Hopper', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150', text: 'I am assigning tasks to complete the audit trail requirements.', time: '1h ago', task: { title: 'Compile citation validation ledger CIDs', assignee: 'Alex Rivera', status: 'todo' }, isSystem: false, reactions: {} }
      ]
    };

    setMessages(defaultData[channelId] || [
      { id: 'm_gen1', sender: 'System Node', avatar: '', text: `Welcome to the start of direct discussions. Send messages below.`, time: 'Just now', isSystem: true, reactions: {} }
    ]);
  }, [channelId]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSend = () => {
    if (!textInput.trim()) return;

    const newMsg = {
      id: 'msg_' + Date.now(),
      sender: 'Aria Nakamura',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
      text: textInput,
      time: 'Just now',
      isSystem: false,
      reactions: {},
      replyTo: replyTarget ? { sender: replyTarget.sender, text: replyTarget.text } : null
    };

    setMessages(prev => [...prev, newMsg]);
    setTextInput('');
    setReplyTarget(null);

    // AI simulated response in copilot
    if (channelId === 'ai_copilot') {
      setTimeout(() => {
        const aiMsg = {
          id: 'msg_ai_' + Date.now(),
          sender: 'CampusX AI Copilot',
          avatar: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=150',
          text: '🤖 **AI Copilot Analysis**:\nI parsed your ledger query. I verified that your thesis presentation has successfully been indexed on the Polygon Subnet under transaction verification code 0x982a... Action recommended: Prepare slide outlines.',
          time: 'Just now',
          isSystem: false,
          reactions: {}
        };
        setMessages(prev => [...prev, aiMsg]);
      }, 1200);
    }
  };

  const handleTranslate = (msgId, text) => {
    if (translations[msgId]) {
      // Toggle off
      setTranslations(prev => {
        const next = { ...prev };
        delete next[msgId];
        return next;
      });
      return;
    }

    setTranslatingId(msgId);
    setTimeout(() => {
      setTranslations(prev => ({
        ...prev,
        [msgId]: `Translated (ES): "Entendido. He verificado los parámetros de la blockchain en la red de CampusX."`
      }));
      setTranslatingId(null);
    }, 800);
  };

  const handleVote = (pollId, optIdx) => {
    if (votedPolls[pollId] !== undefined) return; // Voted
    setVotedPolls(prev => ({ ...prev, [pollId]: optIdx }));
    setMessages(prev => prev.map(msg => {
      if (msg.poll && msg.poll.id === pollId) {
        const newVotes = { ...msg.poll.votes };
        newVotes[optIdx] = (newVotes[optIdx] || 0) + 1;
        return {
          ...msg,
          poll: { ...msg.poll, votes: newVotes }
        };
      }
      return msg;
    }));
  };

  const handleTogglePin = (msg) => {
    if (pinnedMessages.find(p => p.id === msg.id)) {
      setPinnedMessages(prev => prev.filter(p => p.id !== msg.id));
    } else {
      setPinnedMessages(prev => [...prev, msg]);
    }
  };

  const handleReact = (msgId, emoji) => {
    setMessages(prev => prev.map(msg => {
      if (msg.id === msgId) {
        const reactions = { ...msg.reactions };
        reactions[emoji] = (reactions[emoji] || 0) + 1;
        return { ...msg, reactions };
      }
      return msg;
    }));
    setShowEmojiMenu(null);
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#071126]/30 overflow-hidden relative text-left">
      
      {/* 1. Header Toolbar */}
      <div className="p-4 border-b border-white/5 bg-[#0B1736]/40 flex justify-between items-center z-10">
        <div className="flex items-center gap-2.5">
          <span className="font-bold text-white text-sm"># {channelId}</span>
        </div>
        
        <div className="flex items-center gap-3">
          {/* Quick Call */}
          <button 
            onClick={onStartCall}
            className="p-2 bg-brand-primary/10 border border-brand-primary/20 text-brand-primary hover:bg-brand-primary hover:text-white rounded-xl transition-all flex items-center gap-1.5 text-xs font-bold"
          >
            <Video className="w-4 h-4" />
            <span>Meet Now</span>
          </button>
        </div>
      </div>

      {/* 2. Messages viewport */}
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 chat-scroll">
        {messages.map((msg) => {
          const hasReply = !!msg.replyTo;
          const isBookmarked = false;
          
          return (
            <div key={msg.id} className="flex gap-3 text-xs leading-normal relative group">
              {/* Avatar */}
              {msg.avatar ? (
                <img src={msg.avatar} alt="" className="w-8 h-8 rounded-full object-cover shrink-0 border border-white/10 mt-0.5" />
              ) : (
                <div className="w-8 h-8 rounded-full bg-[#102043] border border-white/5 flex items-center justify-center text-slate-400 font-bold shrink-0">S</div>
              )}

              {/* Message Details */}
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-2">
                  <span className="font-bold text-white hover:underline cursor-pointer">{msg.sender}</span>
                  <span className="text-[9px] font-mono text-slate-500 font-semibold">{msg.time}</span>
                  {msg.isSystem && (
                    <span className="text-[8px] font-bold bg-[#102043] border border-white/5 px-1 py-0.5 rounded text-slate-400">SYSTEM</span>
                  )}
                </div>

                {/* Reply Context tag */}
                {hasReply && (
                  <div className="mt-1 p-2 bg-[#102043]/30 border-l-2 border-l-brand-primary rounded-r-lg text-slate-400 text-[10px] italic">
                    Reply to <strong>{msg.replyTo.sender}</strong>: {msg.replyTo.text.slice(0, 50)}...
                  </div>
                )}

                {/* Text Bubble */}
                <div className="mt-1 font-semibold text-slate-200">
                  {msg.text.split('\n').map((line, lidx) => (
                    <p key={lidx} className={lidx > 0 ? 'mt-1' : ''}>{line}</p>
                  ))}
                </div>

                {/* Attachment: Poll Card */}
                {msg.poll && (
                  <div className="mt-3 p-4 bg-[#102043]/30 border border-white/5 rounded-2xl max-w-sm">
                    <span className="text-[9px] font-bold text-indigo-400 uppercase tracking-widest flex items-center gap-1.5 mb-2">
                      <Vote className="w-3.5 h-3.5" />
                      Active Campus Poll
                    </span>
                    <h4 className="text-xs font-bold text-white mb-3">{msg.poll.question}</h4>
                    <div className="flex flex-col gap-2.5">
                      {msg.poll.options.map((opt, idx) => {
                        const count = msg.poll.votes[idx] || 0;
                        const hasVoted = votedPolls[msg.poll.id] !== undefined;
                        const isVotedChoice = votedPolls[msg.poll.id] === idx;
                        
                        return (
                          <button
                            key={idx}
                            disabled={hasVoted}
                            onClick={() => handleVote(msg.poll.id, idx)}
                            className={`w-full p-2.5 rounded-xl border text-xs font-semibold flex justify-between items-center transition-all ${
                              isVotedChoice 
                                ? 'bg-brand-primary/10 border-brand-primary text-white' 
                                : 'bg-[#0B1736] border-white/5 text-slate-300 hover:border-white/10'
                            }`}
                          >
                            <span>{opt}</span>
                            {hasVoted && <span className="text-[10px] font-mono text-slate-500">{count} votes</span>}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Attachment: Task Card */}
                {msg.task && (
                  <div className="mt-3 p-4 bg-[#102043]/30 border border-white/5 rounded-2xl max-w-sm flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-lg">
                        <CheckSquare className="w-4 h-4" />
                      </div>
                      <div className="flex flex-col text-left">
                        <span className="text-xs font-bold text-white">{msg.task.title}</span>
                        <span className="text-[9px] text-slate-400 mt-0.5">Assignee: {msg.task.assignee}</span>
                      </div>
                    </div>
                    <span className="text-[8px] font-bold bg-emerald-500/15 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/20 uppercase">
                      {msg.task.status}
                    </span>
                  </div>
                )}

                {/* Attachment: Code File Snippet */}
                {msg.file && msg.file.type === 'code' && (
                  <div className="mt-3 bg-[#050b1a] border border-white/5 rounded-2xl overflow-hidden max-w-md">
                    <div className="px-4 py-2 bg-[#102043]/30 border-b border-white/5 flex justify-between items-center">
                      <div className="flex items-center gap-2 text-indigo-400 font-bold text-[10px] uppercase">
                        <Terminal className="w-3.5 h-3.5" />
                        <span>{msg.file.name}</span>
                      </div>
                      <span className="text-[9px] text-slate-500 font-semibold">{msg.file.size}</span>
                    </div>
                    <pre className="p-4 overflow-x-auto text-[10px] font-mono text-indigo-300 text-left bg-[#050b1a]">
{`pragma solidity ^0.8.0;

contract CampusXMeetingRegistry {
    // Gas optimized registry hashes
    mapping(bytes32 => bool) public verifiedLogs;
}`}
                    </pre>
                  </div>
                )}

                {/* Dynamic Translation view */}
                {translations[msg.id] && (
                  <div className="mt-1 text-[11px] text-indigo-400 font-medium italic">
                    {translations[msg.id]}
                  </div>
                )}

                {/* Reactions list */}
                {msg.reactions && Object.keys(msg.reactions).length > 0 && (
                  <div className="flex gap-1.5 mt-2 flex-wrap">
                    {Object.entries(msg.reactions).map(([emoji, count]) => (
                      <span key={emoji} className="bg-[#102043]/50 border border-white/5 px-2 py-0.5 rounded-full text-[9px] font-bold font-mono text-slate-400">
                        {emoji} {count}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Message Quick Controls (Visible on hover) */}
              <div className="absolute right-2 top-0 bg-[#0B1736] border border-white/10 rounded-xl p-1 z-30 shadow-xl opacity-0 group-hover:opacity-100 transition-all flex gap-1 items-center">
                
                {/* React trigger */}
                <div className="relative">
                  <button 
                    onClick={() => setShowEmojiMenu(msg.id)}
                    className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/[0.03]"
                    title="Add reaction"
                  >
                    <Smile className="w-3.5 h-3.5" />
                  </button>

                  <AnimatePresence>
                    {showEmojiMenu === msg.id && (
                      <>
                        <div className="fixed inset-0 z-40 bg-transparent" onClick={() => setShowEmojiMenu(null)} />
                        <motion.div
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0.8, opacity: 0 }}
                          className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 bg-[#102043] border border-white/10 rounded-full p-1 z-50 flex gap-1 shadow-2xl"
                        >
                          {['👍', '❤️', '🔥', '👏', '🎉'].map(emoji => (
                            <button
                              key={emoji}
                              onClick={() => handleReact(msg.id, emoji)}
                              className="text-xs hover:scale-130 transition-all bg-transparent border-none cursor-pointer p-0.5"
                            >
                              {emoji}
                            </button>
                          ))}
                        </motion.div>
                      </>
                    )}
                  </AnimatePresence>
                </div>

                <button 
                  onClick={() => setReplyTarget(msg)}
                  className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/[0.03]"
                  title="Reply thread"
                >
                  <Reply className="w-3.5 h-3.5" />
                </button>
                <button 
                  onClick={() => handleTranslate(msg.id, msg.text)}
                  className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/[0.03]"
                  title="Translate to Spanish"
                >
                  <Globe className="w-3.5 h-3.5" />
                </button>
                <button 
                  onClick={() => handleTogglePin(msg)}
                  className={`p-1.5 rounded-lg hover:bg-white/[0.03] ${
                    pinnedMessages.find(p => p.id === msg.id) ? 'text-indigo-400' : 'text-slate-400 hover:text-white'
                  }`}
                  title="Pin message"
                >
                  <Pin className="w-3.5 h-3.5 rotate-45" />
                </button>
              </div>

            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* 3. Reply Target banner alert */}
      <AnimatePresence>
        {replyTarget && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="px-4 py-2 bg-brand-primary/10 border-t border-white/5 flex justify-between items-center text-xs text-slate-300 font-semibold"
          >
            <span>Replying to <strong>{replyTarget.sender}</strong>: {replyTarget.text.slice(0, 40)}...</span>
            <button onClick={() => setReplyTarget(null)} className="text-slate-400 hover:text-white bg-transparent border-none">
              &times;
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 4. Text Input box bar */}
      <div className="p-4 border-t border-white/5 bg-[#0B1736]/40 flex gap-2 items-center">
        <button className="p-2.5 text-slate-400 hover:text-white hover:bg-white/[0.02] border border-white/5 rounded-xl transition-all">
          <Paperclip className="w-4 h-4" />
        </button>
        <input 
          type="text" 
          placeholder="Message room..."
          value={textInput}
          onChange={(e) => setTextInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') handleSend(); }}
          className="flex-1 bg-[#071126] border border-white/5 text-xs text-white p-3 rounded-xl outline-none placeholder-slate-500 focus:border-brand-primary/30"
        />
        <button 
          onClick={handleSend}
          className="p-3 bg-brand-primary hover:bg-brand-primary-hover text-white rounded-xl shadow-md shrink-0 transition-colors"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
}
