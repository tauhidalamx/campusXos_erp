'use client';

import React, { useState, useRef, useEffect } from 'react';
import { 
  Video, 
  VideoOff, 
  Mic, 
  MicOff, 
  PhoneOff, 
  Monitor, 
  Edit, 
  FileText, 
  Users, 
  MessageSquare, 
  Sparkles,
  Link as LinkIcon,
  Play,
  RotateCcw,
  ShieldCheck,
  CheckCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function VideoMeet({ roomName, onLeaveMeeting }) {
  const [micActive, setMicActive] = useState(true);
  const [camActive, setCamActive] = useState(true);
  const [screenSharing, setScreenSharing] = useState(false);
  const [activeTool, setActiveTool] = useState('video'); // 'video' | 'whiteboard' | 'transcripts'
  
  // Whiteboard drawing tools
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  
  // Realtime caption streaming
  const [captionIndex, setCaptionIndex] = useState(0);
  const captionsList = [
    "Dr. Sterling: Welcome everyone. Today we are signing the department consensus review.",
    "Dr. Sterling: Let's make sure the transcript validations are verified.",
    "Prof. Chen: I verified the BIP-39 HD keys for all students in the class group.",
    "Aria Nakamura: I synced the CS202 binary trees and pushed logs to the consortium node.",
    "Dr. Sterling: Excellent. I will finalize and sign this session on the CampusX Chain."
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCaptionIndex(prev => (prev + 1) % captionsList.length);
    }, 4500);
    return () => clearInterval(interval);
  }, []);

  // Transcription logs
  const [transcripts, setTranscripts] = useState([
    { name: 'Dr. Evelyn Sterling', text: 'Welcome everyone. Today we are signing the department consensus review.', time: '14:02' },
    { name: 'Prof. Marcus Chen', text: 'I verified the BIP-39 HD keys for all students in the class group.', time: '14:03' }
  ]);

  const [aiNotes, setAiNotes] = useState([
    '• **Decision**: CS department logs to use ED25519 signing.',
    '• **Action Item**: Alex to check Polygon subnet block latency.',
    '• **Milestone**: Next governance review scheduled for Monday.'
  ]);

  // Blockchain attestations
  const [blockchainLoading, setBlockchainLoading] = useState(false);
  const [blockchainResult, setBlockchainResult] = useState(null);

  const triggerBlockchainSync = () => {
    setBlockchainLoading(true);
    setTimeout(() => {
      const attestation = {
        hash: '0x' + Array.from({ length: 40 }).map(() => Math.floor(Math.random() * 16).toString(16)).join(''),
        timestamp: new Date().toLocaleTimeString(),
        proofCode: '0xsbt_attendance_verification_proof_secp256k1'
      };
      setBlockchainResult(attestation);
      setBlockchainLoading(false);
    }, 1500);
  };

  // Canvas Drawing handlers
  useEffect(() => {
    if (activeTool === 'whiteboard' && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      ctx.strokeStyle = '#6366F1';
      ctx.lineWidth = 3;
      ctx.lineCap = 'round';
    }
  }, [activeTool]);

  const startDrawing = (e) => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    ctx.beginPath();
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
    setIsDrawing(true);
  };

  const draw = (e) => {
    if (!isDrawing || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  const handleShareScreen = () => {
    setScreenSharing(!screenSharing);
  };

  return (
    <div className="w-full flex-1 flex flex-col bg-[#050b1a] border border-white/5 rounded-3xl overflow-hidden h-[720px] max-w-[1100px] select-none text-left">
      
      {/* 1. Meeting Header toolbar */}
      <div className="p-4 bg-[#0B1736] border-b border-white/5 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 bg-rose-500 rounded-full animate-ping shrink-0" />
          <h2 className="text-sm font-bold text-white tracking-wide">Meeting Workspace: {roomName || 'Consensus Panel'}</h2>
        </div>

        {/* Workspace views tab toggles */}
        <div className="flex gap-1.5 bg-[#102043]/50 p-1 rounded-xl">
          {[
            { id: 'video', label: 'Video Grid', icon: Video },
            { id: 'whiteboard', label: 'Interactive Board', icon: Edit },
            { id: 'transcripts', label: 'AI Notes & Transcript', icon: FileText }
          ].map((tool) => {
            const Icon = tool.icon;
            return (
              <button
                key={tool.id}
                onClick={() => setActiveTool(tool.id)}
                className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 text-xs font-bold transition-all ${
                  activeTool === tool.id 
                    ? 'bg-brand-primary text-white font-extrabold shadow' 
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tool.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Main Content Split Viewport */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Left Side: Dynamic Workspace depending on activeTool */}
        <div className="flex-1 overflow-y-auto p-4 flex flex-col justify-center relative">
          
          {/* VIEW A: Video conferencing grid */}
          {activeTool === 'video' && (
            <div className="w-full flex flex-col gap-4">
              
              {/* Responsive participant blocks grid */}
              <div className="video-meeting-grid">
                {/* Local user camera */}
                {camActive ? (
                  <div className="video-grid-card speaking">
                    <img 
                      src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600" 
                      alt="" 
                      className="w-full h-full object-cover" 
                    />
                    <div className="absolute bottom-3 left-3 bg-[#071126]/80 px-2 py-0.5 rounded text-[10px] font-bold">
                      Aria Nakamura (You)
                    </div>
                  </div>
                ) : (
                  <div className="video-grid-card flex items-center justify-center">
                    <VideoOff className="w-8 h-8 text-slate-500" />
                    <span className="absolute bottom-3 left-3 bg-[#071126]/80 px-2 py-0.5 rounded text-[10px] font-bold">Aria Nakamura (Muted Camera)</span>
                  </div>
                )}

                {/* Speaker 2 */}
                <div className="video-grid-card">
                  <img 
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600" 
                    alt="" 
                    className="w-full h-full object-cover" 
                  />
                  <div className="absolute bottom-3 left-3 bg-[#071126]/80 px-2 py-0.5 rounded text-[10px] font-bold">Dr. Evelyn Sterling</div>
                </div>

                {/* Speaker 3 */}
                <div className="video-grid-card">
                  <img 
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600" 
                    alt="" 
                    className="w-full h-full object-cover" 
                  />
                  <div className="absolute bottom-3 left-3 bg-[#071126]/80 px-2 py-0.5 rounded text-[10px] font-bold">Prof. Marcus Chen</div>
                </div>

                {/* Speaker 4: Screen Sharing feed simulator */}
                {screenSharing && (
                  <div className="video-grid-card">
                    <div className="w-full h-full bg-[#050b1a] flex flex-col items-center justify-center p-4">
                      <Monitor className="w-10 h-10 text-brand-primary animate-pulse mb-2" />
                      <span className="text-xs font-bold text-indigo-400">Desktop Stream Sharing Active</span>
                      <span className="text-[10px] text-slate-500 font-semibold mt-1">1080p @ 30FPS</span>
                    </div>
                    <div className="absolute bottom-3 left-3 bg-[#071126]/80 px-2 py-0.5 rounded text-[10px] font-bold">Sharing Screen - Aria Nakamura</div>
                  </div>
                )}
              </div>

              {/* Sub-window: Live Caption overlays */}
              <div className="p-3 bg-[#102043]/30 border border-white/5 rounded-xl text-center">
                <span className="text-xs font-bold text-slate-300 italic">
                  {captionsList[captionIndex]}
                </span>
              </div>

            </div>
          )}

          {/* VIEW B: Interactive whiteboard canvas */}
          {activeTool === 'whiteboard' && (
            <div className="w-full h-full flex flex-col gap-4">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-slate-400">Meeting Canvas Sketchpad</span>
                <button 
                  onClick={clearCanvas}
                  className="px-2.5 py-1.5 bg-rose-500/10 border border-rose-500/20 text-rose-500 rounded-xl text-xs font-bold flex items-center gap-1.5 hover:bg-rose-500 hover:text-white transition-all"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Clear Board</span>
                </button>
              </div>

              <canvas
                ref={canvasRef}
                width={680}
                height={380}
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                className="w-full h-[380px] bg-white whiteboard-canvas-container"
              />
            </div>
          )}

          {/* VIEW C: Transcripts & AI Assistant */}
          {activeTool === 'transcripts' && (
            <div className="w-full flex flex-col gap-5 h-full">
              
              {/* Transcripts Stream logs */}
              <div className="flex flex-col gap-3.5 max-h-[220px] overflow-y-auto pr-1">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-1">Live Meeting Transcript Logs</span>
                {transcripts.map((log, i) => (
                  <div key={i} className="flex gap-2.5 text-xs text-left leading-normal">
                    <strong className="text-white hover:underline cursor-pointer shrink-0">{log.name}:</strong>
                    <span className="text-slate-300 font-semibold">{log.text}</span>
                  </div>
                ))}
              </div>

              {/* AI Assistant Notes Drawer */}
              <div className="p-4 bg-brand-primary/5 border border-brand-primary/20 rounded-2xl flex flex-col gap-2">
                <div className="flex items-center gap-2 text-brand-primary">
                  <Sparkles className="w-4 h-4 text-brand-primary animate-pulse" />
                  <span className="text-[10px] font-bold uppercase tracking-widest">AI meeting note assistant</span>
                </div>
                <div className="flex flex-col gap-1 text-left text-xs font-medium text-slate-300 leading-normal">
                  {aiNotes.map((note, i) => <p key={i}>{note}</p>)}
                </div>
              </div>

            </div>
          )}

        </div>

        {/* Right Side: Meeting Attendees & Cryptographic verification desk */}
        <div className="w-72 bg-[#0B1736] border-l border-white/5 flex flex-col justify-between shrink-0">
          
          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-6">
            
            {/* Participants list */}
            <div className="flex flex-col gap-3">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-1">In Attendance</span>
              <div className="flex flex-col gap-2.5">
                {[
                  { name: 'Aria Nakamura', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150', isMuted: false, role: 'Student' },
                  { name: 'Dr. Evelyn Sterling', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150', isMuted: true, role: 'Faculty' },
                  { name: 'Prof. Marcus Chen', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150', isMuted: false, role: 'Faculty' }
                ].map((att, i) => (
                  <div key={i} className="flex justify-between items-center bg-[#102043]/30 p-2 border border-white/5 rounded-xl">
                    <div className="flex items-center gap-2">
                      <img src={att.avatar} alt="" className="w-6.5 h-6.5 rounded-full object-cover border border-white/10 shrink-0" />
                      <div className="flex flex-col text-left">
                        <span className="text-[11px] font-bold text-white truncate max-w-[120px]">{att.name}</span>
                        <span className="text-[8px] font-bold text-slate-500 uppercase mt-0.5">{att.role}</span>
                      </div>
                    </div>
                    {att.isMuted ? <MicOff className="w-3.5 h-3.5 text-rose-500" /> : <Mic className="w-3.5 h-3.5 text-slate-400" />}
                  </div>
                ))}
              </div>
            </div>

            {/* Blockchain Attestation module */}
            <div className="flex flex-col gap-3 border-t border-white/5 pt-4">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-1">Consortium Verification Proof</span>
              
              {!blockchainResult ? (
                <button
                  disabled={blockchainLoading}
                  onClick={triggerBlockchainSync}
                  className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all shadow-md flex items-center justify-center gap-1.5 border bg-indigo-500/10 border-indigo-500/20 text-indigo-400 hover:bg-indigo-500 hover:text-white ${
                    blockchainLoading ? 'animate-pulse' : ''
                  }`}
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>{blockchainLoading ? 'Signing Ledger...' : 'Verify on CampusX Chain'}</span>
                </button>
              ) : (
                <div className="p-3 bg-emerald-500/5 border border-emerald-500/20 rounded-2xl flex flex-col gap-2 text-left">
                  <div className="flex items-center gap-1.5 text-emerald-400 text-[10px] font-bold">
                    <CheckCircle className="w-4 h-4 text-emerald-400" />
                    <span>PROOF VERIFIED & ANCHORED</span>
                  </div>
                  <div className="flex flex-col gap-1 text-[9px] font-semibold text-slate-300">
                    <div>Attestation code:</div>
                    <code className="text-brand-accent-cyan break-all font-mono bg-black/40 p-1.5 rounded mt-0.5 leading-normal">{blockchainResult.hash}</code>
                    <div className="mt-1">Metadata Proof:</div>
                    <span className="text-slate-400 italic">{blockchainResult.proofCode}</span>
                  </div>
                </div>
              )}
            </div>

          </div>

          {/* Controls Footer */}
          <div className="p-4 border-t border-white/5 bg-[#102043]/30 flex justify-center gap-3">
            <button 
              onClick={() => setMicActive(!micActive)}
              className={`p-2 rounded-xl transition-all border ${
                !micActive 
                  ? 'bg-rose-500/20 border-rose-500/30 text-rose-500' 
                  : 'bg-[#0B1736] border-white/5 text-slate-400 hover:text-white'
              }`}
            >
              {micActive ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
            </button>
            <button 
              onClick={() => setCamActive(!camActive)}
              className={`p-2 rounded-xl transition-all border ${
                !camActive 
                  ? 'bg-rose-500/20 border-rose-500/30 text-rose-500' 
                  : 'bg-[#0B1736] border-white/5 text-slate-400 hover:text-white'
              }`}
            >
              {camActive ? <Video className="w-4 h-4" /> : <VideoOff className="w-4 h-4" />}
            </button>
            <button 
              onClick={handleShareScreen}
              className={`p-2 rounded-xl transition-all border ${
                screenSharing 
                  ? 'bg-brand-primary/20 border-brand-primary text-brand-primary' 
                  : 'bg-[#0B1736] border-white/5 text-slate-400 hover:text-white'
              }`}
            >
              <Monitor className="w-4 h-4" />
            </button>
            <button 
              onClick={onLeaveMeeting}
              className="p-2 bg-rose-500 text-white rounded-xl hover:bg-rose-600 transition-all shadow"
            >
              <PhoneOff className="w-4 h-4" />
            </button>
          </div>

        </div>

      </div>

    </div>
  );
}
