'use client';

import React, { useState, useEffect, useRef } from 'react';
import SuiteSidebar from '../components/SuiteSidebar';
import { 
  Video, 
  VideoOff, 
  Mic, 
  MicOff, 
  Monitor, 
  Share2, 
  Grid, 
  MessageSquare, 
  Users, 
  Sparkles, 
  PhoneOff, 
  Maximize2, 
  Edit3, 
  Trash2, 
  Download, 
  History, 
  Plus, 
  ArrowRight, 
  Cpu, 
  ShieldCheck, 
  FileText,
  Square,
  Circle,
  Type
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useConnect, ConnectProvider } from '../ConnectContext';
import { usePresenceStore, useConsensusRecordsQuery } from '../components/StoreBlueprints';
import '../connect.css';
import '../messages/messages.css';

function MeetingsPageContent() {
  const { currentUser } = useConnect();
  const presence = usePresenceStore(state => state.presence);
  
  // Tab states for meetings layout
  const [meetingMode, setMeetingMode] = useState('grid'); // 'grid' | 'whiteboard'
  const [rightPanelTab, setRightPanelTab] = useState('ai'); // 'ai' | 'breakout' | 'participants'
  
  // Call controls
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);
  const [isSharingScreen, setIsSharingScreen] = useState(false);
  const [bgBlur, setBgBlur] = useState(false);
  const [timer, setTimer] = useState('00:14:35');

  // Video Grid Participants (simulated)
  const [participants, setParticipants] = useState([
    { id: 'usr_001', name: 'Dr. Raymond Park', role: 'Faculty', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150', isSpeaking: true, camera: true, muted: false },
    { id: 'usr_002', name: 'Dr. Marcus Chen', role: 'Faculty HOD', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150', isSpeaking: false, camera: true, muted: true },
    { id: 'usr_003', name: 'Aria Nakamura', role: 'Student (You)', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150', isSpeaking: false, camera: true, muted: false },
    { id: 'usr_004', name: 'Alex Rivera', role: 'Student Delegate', avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150', isSpeaking: false, camera: false, muted: false },
    { id: 'usr_005', name: 'Sophia Sterling', role: 'Research Associate', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150', isSpeaking: false, camera: true, muted: false }
  ]);

  // Whiteboard Canvas states
  const canvasRef = useRef(null);
  const [canvasColor, setCanvasColor] = useState('#000000');
  const [canvasBrushSize, setCanvasBrushSize] = useState(4);
  const [canvasTool, setCanvasTool] = useState('pencil'); // 'pencil' | 'eraser' | 'rect' | 'circle'
  const [canvasHistory, setCanvasHistory] = useState([]);
  const [historyPointer, setHistoryPointer] = useState(-1);
  const isDrawing = useRef(false);
  const startX = useRef(0);
  const startY = useRef(0);
  const snapshot = useRef(null);

  // Sticky notes array
  const [stickyNotes, setStickyNotes] = useState([
    { id: 1, text: 'Confirm WebRTC data channels throughput criteria', color: '#FEF08A', x: 80, y: 60 },
    { id: 2, text: 'Ledger anchoring: block confirmation target < 3s', color: '#BFDBFE', x: 260, y: 180 }
  ]);

  // Breakout Rooms states
  const [breakoutRooms, setBreakoutRooms] = useState([
    { id: 'br_1', name: 'Breakout Room 1 - Consensus Protocol', members: ['usr_001', 'usr_003'] },
    { id: 'br_2', name: 'Breakout Room 2 - Telemetry Audit', members: ['usr_002', 'usr_004'] }
  ]);
  const [newRoomName, setNewRoomName] = useState('');

  // AI assistant transcription states
  const [transcripts, setTranscripts] = useState([
    { sender: 'Dr. Raymond Park', time: '14:30', text: 'Let us confirm the verification speeds on the CampusX blockchain nodes.' },
    { sender: 'Aria Nakamura', time: '14:31', text: 'I am preparing a draft protocol for checking consensus latency under high traffic load.' },
    { sender: 'Dr. Marcus Chen', time: '14:33', text: 'That sounds solid. Let us make sure that we keep remote desktop control security top of mind.' }
  ]);
  const [newTranscriptInput, setNewTranscriptInput] = useState('');
  const [aiActions, setAiActions] = useState([
    { id: 1, text: 'Aria to deploy testing script on blockchain testnet node', assignee: 'Aria Nakamura', done: false },
    { id: 2, text: 'Dr. Raymond to approve remote administration credentials', assignee: 'Dr. Raymond Park', done: true }
  ]);
  const [blockchainHash, setBlockchainHash] = useState('0x3f1722d360674fe0be15bea1b229a532');
  const [blockNumber, setBlockNumber] = useState(104822);
  const [isVerifying, setIsVerifying] = useState(false);

  // Timer simulation
  useEffect(() => {
    const interval = setInterval(() => {
      const parts = timer.split(':');
      let hrs = parseInt(parts[0]);
      let mins = parseInt(parts[1]);
      let secs = parseInt(parts[2]);

      secs++;
      if (secs >= 60) {
        secs = 0;
        mins++;
        if (mins >= 60) {
          mins = 0;
          hrs++;
        }
      }

      const format = (val) => String(val).padStart(2, '0');
      setTimer(`${format(hrs)}:${format(mins)}:${format(secs)}`);
    }, 1000);
    return () => clearInterval(interval);
  }, [timer]);

  // Speaker simulation
  useEffect(() => {
    const speakInterval = setInterval(() => {
      setParticipants(prev => {
        const speakingIdx = Math.floor(Math.random() * prev.length);
        return prev.map((p, idx) => ({
          ...p,
          isSpeaking: idx === speakingIdx && !p.muted
        }));
      });
    }, 4500);
    return () => clearInterval(speakInterval);
  }, []);

  // Initialize Canvas & redraw sticky notes
  useEffect(() => {
    if (meetingMode === 'whiteboard' && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Save initial state to history
      const initialData = canvas.toDataURL();
      setCanvasHistory([initialData]);
      setHistoryPointer(0);
    }
  }, [meetingMode]);

  // Whiteboard drawing event handlers
  const startDrawing = (e) => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    
    isDrawing.current = true;
    startX.current = e.clientX - rect.left;
    startY.current = e.clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(startX.current, startY.current);
    ctx.strokeStyle = canvasTool === 'eraser' ? '#FFFFFF' : canvasColor;
    ctx.lineWidth = canvasBrushSize;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    // Save snapshot for shapes preview
    snapshot.current = ctx.getImageData(0, 0, canvas.width, canvas.height);
  };

  const draw = (e) => {
    if (!isDrawing.current || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const currentX = e.clientX - rect.left;
    const currentY = e.clientY - rect.top;

    if (canvasTool === 'pencil' || canvasTool === 'eraser') {
      ctx.lineTo(currentX, currentY);
      ctx.stroke();
    } else {
      // Restore snapshot to avoid trail artifacts
      ctx.putImageData(snapshot.current, 0, 0);

      ctx.beginPath();
      ctx.strokeStyle = canvasColor;
      ctx.lineWidth = canvasBrushSize;

      if (canvasTool === 'rect') {
        const width = currentX - startX.current;
        const height = currentY - startY.current;
        ctx.strokeRect(startX.current, startY.current, width, height);
      } else if (canvasTool === 'circle') {
        const radius = Math.sqrt(Math.pow(currentX - startX.current, 2) + Math.pow(currentY - startY.current, 2));
        ctx.arc(startX.current, startY.current, radius, 0, 2 * Math.PI);
        ctx.stroke();
      }
    }
  };

  const stopDrawing = () => {
    if (!isDrawing.current || !canvasRef.current) return;
    isDrawing.current = false;
    
    // Save to history
    const canvas = canvasRef.current;
    const currentData = canvas.toDataURL();
    
    const newHistory = canvasHistory.slice(0, historyPointer + 1);
    setCanvasHistory([...newHistory, currentData]);
    setHistoryPointer(newHistory.length);
  };

  const undoCanvas = () => {
    if (historyPointer > 0 && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      const img = new Image();
      img.src = canvasHistory[historyPointer - 1];
      img.onload = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
        setHistoryPointer(historyPointer - 1);
      };
    }
  };

  const clearCanvas = () => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      const newHistory = canvasHistory.slice(0, historyPointer + 1);
      const clearedData = canvas.toDataURL();
      setCanvasHistory([...newHistory, clearedData]);
      setHistoryPointer(newHistory.length);
    }
  };

  // Sticky notes additions
  const addStickyNote = () => {
    const newNote = {
      id: Date.now(),
      text: 'Double click to edit note content',
      color: ['#FEF08A', '#BFDBFE', '#BBF7D0', '#FBCFE8'][Math.floor(Math.random() * 4)],
      x: 150 + Math.random() * 100,
      y: 100 + Math.random() * 100
    };
    setStickyNotes([...stickyNotes, newNote]);
  };

  const handleNoteTextChange = (id, newText) => {
    setStickyNotes(stickyNotes.map(n => n.id === id ? { ...n, text: newText } : n));
  };

  const deleteStickyNote = (id) => {
    setStickyNotes(stickyNotes.filter(n => n.id !== id));
  };

  // Breakout rooms handlers
  const createBreakoutRoom = () => {
    if (!newRoomName.trim()) return;
    const newRoom = {
      id: 'br_' + Date.now(),
      name: newRoomName,
      members: []
    };
    setBreakoutRooms([...breakoutRooms, newRoom]);
    setNewRoomName('');
  };

  const moveParticipant = (partId, roomId) => {
    setBreakoutRooms(breakoutRooms.map(room => {
      // Remove from other rooms, add to targeted room
      const withRemoved = room.members.filter(id => id !== partId);
      if (room.id === roomId) {
        return { ...room, members: [...withRemoved, partId] };
      }
      return { ...room, members: withRemoved };
    }));
  };

  // Transcripts handlers
  const postTranscript = () => {
    if (!newTranscriptInput.trim()) return;
    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    const newLog = {
      sender: currentUser?.name || 'Aria Nakamura',
      time: timeStr,
      text: newTranscriptInput
    };
    setTranscripts([...transcripts, newLog]);
    setNewTranscriptInput('');
  };

  // Anchoring verification event logs to CampusX Chain
  const anchorMeetingToChain = () => {
    setIsVerifying(true);
    setTimeout(() => {
      const newHash = '0x' + Array.from({ length: 32 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
      setBlockchainHash(newHash);
      setBlockNumber(blockNumber + Math.floor(Math.random() * 5) + 1);
      setIsVerifying(false);
      // Auto add confirmation message
      const transcriptConfirm = {
        sender: 'CampusX System Ledger',
        time: 'Ledger Confirm',
        text: `Anchored meeting consensus audit log to block #${blockNumber + 3}. Certificate Hash: ${newHash.substring(0, 10)}...`
      };
      setTranscripts(prev => [...prev, transcriptConfirm]);
    }, 1200);
  };

  return (
    <div className="flex h-screen bg-brand-bg-primary text-brand-text-main overflow-hidden font-sans select-none relative" style={{ paddingLeft: '80px' }}>
      {/* 1. Global Suite Sidebar */}
      <SuiteSidebar />

      {/* 2. Middle Collaborative Meeting Space */}
      <div className="flex-1 flex flex-col h-full overflow-hidden bg-[#071126] w-full">
        {/* Top Header of Room */}
        <header className="h-[70px] border-b border-white/5 bg-[#0B1736]/40 px-6 flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            <div className="w-3.5 h-3.5 rounded-full bg-cyan-400 animate-pulse glow-accent"></div>
            <div>
              <h1 className="text-sm font-extrabold text-white">Consensus & Telemetry Working Group</h1>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-[10px] text-slate-400 font-mono bg-[#102043] px-2 py-0.5 rounded border border-white/5">
                  Duration: {timer}
                </span>
                <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" /> WebRTC Secure Session
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button 
              onClick={() => setMeetingMode('grid')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                meetingMode === 'grid' 
                  ? 'bg-brand-primary text-white' 
                  : 'text-slate-400 hover:text-white bg-white/5 border border-white/5'
              }`}
            >
              <Grid className="w-3.5 h-3.5" /> Video Grid
            </button>
            <button 
              onClick={() => setMeetingMode('whiteboard')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                meetingMode === 'whiteboard' 
                  ? 'bg-brand-primary text-white' 
                  : 'text-slate-400 hover:text-white bg-white/5 border border-white/5'
              }`}
            >
              <Edit3 className="w-3.5 h-3.5" /> Interactive Whiteboard
            </button>
          </div>
        </header>

        {/* Workspace Display Area */}
        <div className="flex-1 overflow-hidden relative p-4 flex flex-col">
          <AnimatePresence mode="wait">
            {meetingMode === 'grid' ? (
              <motion.div 
                key="grid-view"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex-1 grid grid-cols-2 md:grid-cols-3 gap-4 overflow-y-auto"
              >
                {participants.map((part) => (
                  <div 
                    key={part.id} 
                    className={`relative rounded-2xl bg-[#102043]/50 border-2 overflow-hidden flex flex-col items-center justify-center transition-all ${
                      part.isSpeaking 
                        ? 'border-cyan-400 ring-2 ring-cyan-400/20' 
                        : 'border-white/5'
                    }`}
                  >
                    {/* User profile / Avatar if Camera is off */}
                    {!part.camera || (part.id === 'usr_003' && isCameraOff) ? (
                      <div className="absolute inset-0 bg-[#0B1736] flex flex-col items-center justify-center gap-3">
                        <img 
                          src={part.avatar} 
                          alt={part.name} 
                          className="w-20 h-20 rounded-full border-2 border-white/10 object-cover"
                        />
                        <span className="text-xs font-bold text-slate-300">{part.name}</span>
                        <span className="text-[10px] text-slate-500 font-mono uppercase bg-white/5 px-2 py-0.5 rounded">Camera Off</span>
                      </div>
                    ) : (
                      // Simulated Live Stream Viewport
                      <div className="w-full h-full relative bg-[#090f1d]">
                        <div className={`w-full h-full ${bgBlur && part.id === 'usr_003' ? 'blur-md' : ''} bg-[#0A1020] flex items-center justify-center relative overflow-hidden`}>
                          <img src={part.avatar} alt="feed stream" className="w-full h-full object-cover opacity-80" />
                          <div className="absolute top-2 right-2 bg-black/40 px-2 py-0.5 rounded text-[9px] font-bold text-slate-300">
                            1080p • 60 FPS
                          </div>
                        </div>

                        {/* Speaking audio wave indicator */}
                        {part.isSpeaking && (
                          <div className="absolute bottom-12 left-4 flex gap-1 items-center bg-cyan-500/20 px-2 py-1 rounded-lg border border-cyan-400/30">
                            <span className="waveform-bar"></span>
                            <span className="waveform-bar"></span>
                            <span className="waveform-bar"></span>
                            <span className="waveform-bar"></span>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Participant Labels */}
                    <div className="absolute bottom-3 right-3 left-3 bg-black/60 backdrop-blur-md border border-white/10 rounded-xl p-2 flex items-center justify-between z-10">
                      <div className="text-[11px]">
                        <p className="font-extrabold text-white truncate max-w-[120px]">{part.name}</p>
                        <p className="text-[9px] text-slate-400">{part.role}</p>
                      </div>
                      <div className="flex items-center gap-1.5">
                        {part.muted || (part.id === 'usr_003' && isMuted) ? (
                          <span className="p-1 rounded-lg bg-rose-500/20 border border-rose-500/30 text-rose-400">
                            <MicOff className="w-3 h-3" />
                          </span>
                        ) : (
                          <span className="p-1 rounded-lg bg-emerald-500/20 border border-emerald-500/30 text-emerald-400">
                            <Mic className="w-3 h-3" />
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}

                {/* Simulated Screen share Box (if enabled) */}
                {isSharingScreen && (
                  <div className="relative rounded-2xl bg-indigo-950/40 border-2 border-indigo-500 ring-2 ring-indigo-500/20 overflow-hidden flex flex-col items-center justify-center">
                    <div className="absolute inset-0 bg-[#050B1B] flex flex-col items-center justify-center gap-2">
                      <Monitor className="w-12 h-12 text-indigo-400 animate-pulse" />
                      <h3 className="text-xs font-bold text-white">Sharing Screen</h3>
                      <p className="text-[10px] text-slate-400 font-mono">Presenting: System Ledger Metrics.xml</p>
                    </div>
                  </div>
                )}
              </motion.div>
            ) : (
              <motion.div 
                key="whiteboard-view"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex-1 flex flex-col gap-3 h-full overflow-hidden"
              >
                {/* Whiteboard Canvas Panel Toolbar */}
                <div className="bg-[#102043] border border-white/5 rounded-xl p-2 flex items-center justify-between shrink-0">
                  <div className="flex items-center gap-1.5">
                    {/* Tool Selectors */}
                    {[
                      { id: 'pencil', label: 'Draw', icon: Edit3 },
                      { id: 'rect', label: 'Rectangle', icon: Square },
                      { id: 'circle', label: 'Circle', icon: Circle },
                      { id: 'eraser', label: 'Eraser', icon: Trash2 }
                    ].map((tool) => {
                      const ToolIcon = tool.icon;
                      return (
                        <button
                          key={tool.id}
                          onClick={() => setCanvasTool(tool.id)}
                          className={`p-2 rounded-lg transition-colors cursor-pointer text-xs font-bold flex items-center gap-1 ${
                            canvasTool === tool.id 
                              ? 'bg-brand-primary text-white' 
                              : 'text-slate-400 hover:text-white hover:bg-white/5'
                          }`}
                          title={tool.label}
                        >
                          <ToolIcon className="w-4 h-4" />
                        </button>
                      );
                    })}

                    <span className="w-[1px] h-6 bg-white/10 mx-1"></span>

                    {/* Color picker */}
                    <div className="flex items-center gap-1">
                      {['#000000', '#D97706', '#2563EB', '#DC2626', '#16A34A'].map((color) => (
                        <button
                          key={color}
                          onClick={() => {
                            setCanvasColor(color);
                            if (canvasTool === 'eraser') setCanvasTool('pencil');
                          }}
                          className={`w-5 h-5 rounded-full border cursor-pointer transition-all ${
                            canvasColor === color && canvasTool !== 'eraser' ? 'border-white scale-110 shadow-lg' : 'border-transparent'
                          }`}
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>

                    <span className="w-[1px] h-6 bg-white/10 mx-1"></span>

                    {/* Brush Size */}
                    <div className="flex items-center gap-2 text-xs text-slate-300">
                      <span>Stroke:</span>
                      <input 
                        type="range" 
                        min="2" 
                        max="15" 
                        value={canvasBrushSize} 
                        onChange={(e) => setCanvasBrushSize(parseInt(e.target.value))}
                        className="w-16 accent-brand-primary cursor-pointer"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button 
                      onClick={addStickyNote}
                      className="px-2.5 py-1 bg-white/5 hover:bg-white/10 border border-white/5 rounded-lg text-[10px] font-bold text-slate-300 flex items-center gap-1 transition-all cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" /> Add Sticky Note
                    </button>
                    <button 
                      onClick={undoCanvas}
                      disabled={historyPointer <= 0}
                      className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
                      title="Undo Action"
                    >
                      <History className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={clearCanvas}
                      className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 cursor-pointer"
                      title="Clear Whiteboard"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => alert("Simulated PNG Export: Canvas snapshot saved to meetings archive in CampusX Ledger.")}
                      className="p-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 cursor-pointer"
                      title="Export Whiteboard PNG"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Canvas viewport & Sticky Notes */}
                <div className="flex-1 rounded-2xl bg-white border border-white/10 relative overflow-hidden shadow-inner min-h-[350px]">
                  <canvas
                    ref={canvasRef}
                    width={800}
                    height={500}
                    onMouseDown={startDrawing}
                    onMouseMove={draw}
                    onMouseUp={stopDrawing}
                    onMouseLeave={stopDrawing}
                    className="w-full h-full block whiteboard-canvas-container"
                  />

                  {/* Render Draggable Sticky Notes */}
                  {stickyNotes.map((note) => (
                    <div
                      key={note.id}
                      className="absolute p-3 rounded-lg shadow-xl border border-black/10 select-none text-slate-800"
                      style={{ 
                        backgroundColor: note.color, 
                        left: note.x, 
                        top: note.y,
                        width: '160px',
                        cursor: 'move'
                      }}
                    >
                      <div className="flex justify-between items-center mb-1 pb-1 border-b border-black/5">
                        <span className="text-[8px] font-bold uppercase tracking-wider text-slate-500">Note</span>
                        <button 
                          onClick={() => deleteStickyNote(note.id)}
                          className="text-slate-600 hover:text-slate-900 font-extrabold text-[10px]"
                        >
                          &times;
                        </button>
                      </div>
                      <textarea
                        value={note.text}
                        onChange={(e) => handleNoteTextChange(note.id, e.target.value)}
                        className="w-full bg-transparent border-none text-[11px] font-medium text-slate-800 leading-tight focus:outline-none resize-none h-[60px]"
                      />
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Bottom Meeting Controls Bar */}
        <footer className="h-[80px] border-t border-white/5 bg-[#0B1736]/60 flex items-center justify-between px-8 z-10 shrink-0">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsMuted(!isMuted)}
              className={`w-11 h-11 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                isMuted 
                  ? 'bg-rose-500 hover:bg-rose-600 text-white' 
                  : 'bg-[#102043] hover:bg-[#183167] text-slate-200'
              }`}
            >
              {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </button>
            <button 
              onClick={() => setIsCameraOff(!isCameraOff)}
              className={`w-11 h-11 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                isCameraOff 
                  ? 'bg-rose-500 hover:bg-rose-600 text-white' 
                  : 'bg-[#102043] hover:bg-[#183167] text-slate-200'
              }`}
            >
              {isCameraOff ? <VideoOff className="w-5 h-5" /> : <Video className="w-5 h-5" />}
            </button>
          </div>

          <div className="flex items-center gap-3">
            <button 
              onClick={() => setBgBlur(!bgBlur)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                bgBlur 
                  ? 'bg-cyan-500/20 border-cyan-400 text-cyan-400' 
                  : 'bg-[#102043] border-transparent text-slate-300 hover:bg-[#183167]'
              }`}
            >
              Background Blur
            </button>
            <button 
              onClick={() => setIsSharingScreen(!isSharingScreen)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer flex items-center gap-1.5 ${
                isSharingScreen 
                  ? 'bg-indigo-500/20 border-indigo-400 text-indigo-400' 
                  : 'bg-[#102043] border-transparent text-slate-300 hover:bg-[#183167]'
              }`}
            >
              <Monitor className="w-4 h-4" /> Share Screen
            </button>
          </div>

          <div className="flex items-center gap-3">
            <button 
              onClick={() => alert("Simulation Leave Session: Transiting back to Connect messages.")}
              className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-extrabold flex items-center gap-1.5 shadow-lg shadow-rose-900/30 cursor-pointer"
            >
              <PhoneOff className="w-4 h-4" /> End Call
            </button>
          </div>
        </footer>
      </div>

      {/* 3. Right Panel: Collaboration & Breakouts (380px) */}
      <aside className="w-[380px] bg-[#0B1736] border-l border-white/5 flex flex-col h-full overflow-hidden shrink-0">
        {/* Toggle Right panel tabs */}
        <div className="flex border-b border-white/5 p-2 bg-[#102043]/20 shrink-0">
          {[
            { id: 'ai', label: 'AI Notes & Audit', icon: Sparkles },
            { id: 'breakout', label: 'Breakouts', icon: Share2 }
          ].map((tab) => {
            const TabIcon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setRightPanelTab(tab.id)}
                className={`flex-1 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  rightPanelTab === tab.id
                    ? 'bg-brand-primary text-white font-extrabold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <TabIcon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab contents */}
        <div className="flex-1 overflow-y-auto p-4 chat-scroll">
          <AnimatePresence mode="wait">
            {rightPanelTab === 'ai' ? (
              <motion.div 
                key="ai-notes"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col gap-4 h-full"
              >
                {/* Consensus Block status */}
                <div className="bg-[#102043]/40 border border-white/5 rounded-2xl p-4 flex flex-col gap-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wide flex items-center gap-1">
                      <Cpu className="w-3.5 h-3.5 text-cyan-400 animate-spin" /> CampusX Chain Anchoring
                    </span>
                    <span className="text-[9px] text-slate-500 font-mono">Block #{blockNumber}</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-black/40 border border-white/5 font-mono text-[9.5px] text-slate-300 break-all select-all">
                    {blockchainHash}
                  </div>
                  <button
                    onClick={anchorMeetingToChain}
                    disabled={isVerifying}
                    className="w-full py-2 bg-gradient-to-tr from-brand-primary to-indigo-600 hover:opacity-90 disabled:opacity-50 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 cursor-pointer shadow-md transition-opacity"
                  >
                    {isVerifying ? (
                      <>
                        <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        Anchoring to Node ledger...
                      </>
                    ) : (
                      <>
                        <ShieldCheck className="w-4 h-4" /> Anchor Consensus Audit
                      </>
                    )}
                  </button>
                </div>

                {/* AI Assistant meeting summary notes */}
                <div className="flex flex-col gap-2">
                  <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider pl-1">AI Action Items Tracker</h4>
                  <div className="flex flex-col gap-2">
                    {aiActions.map((act) => (
                      <div 
                        key={act.id} 
                        className={`p-3 rounded-xl border flex items-start gap-2.5 transition-all ${
                          act.done 
                            ? 'bg-emerald-500/5 border-emerald-500/10 text-slate-400 line-through' 
                            : 'bg-[#102043]/30 border-white/5 text-slate-200'
                        }`}
                      >
                        <input 
                          type="checkbox" 
                          checked={act.done}
                          onChange={() => setAiActions(aiActions.map(a => a.id === act.id ? { ...a, done: !a.done } : a))}
                          className="mt-0.5 accent-brand-primary cursor-pointer w-3.5 h-3.5 shrink-0"
                        />
                        <div className="text-xs">
                          <p>{act.text}</p>
                          <span className="text-[9px] text-indigo-400 font-medium">Assignee: {act.assignee}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Live Real-time Transcripts */}
                <div className="flex flex-col gap-2 mt-2">
                  <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider pl-1">Live Meeting Notes</h4>
                  <div className="flex flex-col gap-3 max-h-[200px] overflow-y-auto pr-1">
                    {transcripts.map((log, i) => (
                      <div key={i} className="text-xs">
                        <div className="flex justify-between items-center text-[10px] text-slate-500 font-bold">
                          <span>{log.sender}</span>
                          <span>{log.time}</span>
                        </div>
                        <p className="text-slate-300 mt-0.5 leading-relaxed">{log.text}</p>
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-1.5 mt-2 bg-[#102043]/30 border border-white/5 p-1.5 rounded-xl">
                    <input 
                      type="text" 
                      placeholder="Add consensus point..."
                      value={newTranscriptInput}
                      onChange={(e) => setNewTranscriptInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && postTranscript()}
                      className="flex-1 bg-transparent border-none outline-none text-xs text-white placeholder-slate-500 px-2"
                    />
                    <button 
                      onClick={postTranscript}
                      className="p-2 bg-brand-primary hover:bg-brand-primary/80 rounded-lg text-white cursor-pointer"
                    >
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ) : (
              // Breakout Rooms Panel
              <motion.div 
                key="breakout-view"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col gap-4"
              >
                <div className="bg-[#102043]/30 border border-white/5 rounded-2xl p-4 flex flex-col gap-3">
                  <h4 className="text-xs font-bold text-white">Create Breakout Drawer</h4>
                  <p className="text-[10px] text-slate-400 leading-normal">
                    Spawn temporary consensus subnet sessions. Participants will be routed dynamically using direct signaling.
                  </p>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      placeholder="Room name..."
                      value={newRoomName}
                      onChange={(e) => setNewRoomName(e.target.value)}
                      className="flex-1 bg-[#102043] border border-white/5 p-2 rounded-xl text-xs text-white outline-none"
                    />
                    <button 
                      onClick={createBreakoutRoom}
                      className="p-2 bg-brand-primary rounded-xl text-white cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider pl-1 font-mono">Subnet Rooms</h4>
                  {breakoutRooms.map((room) => (
                    <div key={room.id} className="p-3 bg-[#102043]/30 border border-white/5 rounded-2xl flex flex-col gap-2.5">
                      <div className="flex items-center justify-between border-b border-white/5 pb-1.5">
                        <span className="text-xs font-bold text-white">{room.name}</span>
                        <span className="text-[9px] text-slate-400 font-mono">{room.members.length} Members</span>
                      </div>

                      {/* Display members in room */}
                      {room.members.length === 0 ? (
                        <span className="text-[10px] text-slate-500 italic py-1">No participants assigned.</span>
                      ) : (
                        <div className="flex flex-col gap-1.5">
                          {room.members.map((memId) => {
                            const pObj = participants.find(p => p.id === memId);
                            if (!pObj) return null;
                            return (
                              <div key={memId} className="flex items-center justify-between bg-black/20 p-2 rounded-lg">
                                <div className="flex items-center gap-2">
                                  <img src={pObj.avatar} alt="avatar" className="w-5 h-5 rounded-full object-cover" />
                                  <span className="text-[11px] text-slate-300">{pObj.name}</span>
                                </div>
                                <button 
                                  onClick={() => moveParticipant(memId, null)}
                                  className="text-[9px] text-rose-400 hover:text-rose-300 font-semibold"
                                >
                                  Remove
                                </button>
                              </div>
                            );
                          })}
                        </div>
                      )}

                      {/* Dropdown/Select to assign others */}
                      <div className="flex items-center gap-2 border-t border-white/5 pt-2">
                        <span className="text-[9px] text-slate-400 font-semibold">Move:</span>
                        <select 
                          onChange={(e) => {
                            if (e.target.value) {
                              moveParticipant(e.target.value, room.id);
                              e.target.value = '';
                            }
                          }}
                          className="flex-1 bg-[#102043] border border-white/5 p-1 rounded text-[10px] text-slate-300 focus:outline-none"
                        >
                          <option value="">Choose participant...</option>
                          {participants
                            .filter(p => !room.members.includes(p.id))
                            .map(p => (
                              <option key={p.id} value={p.id}>{p.name}</option>
                            ))
                          }
                        </select>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </aside>
    </div>
  );
}

export default function MeetingsPage() {
  return (
    <ConnectProvider>
      <MeetingsPageContent />
    </ConnectProvider>
  );
}
