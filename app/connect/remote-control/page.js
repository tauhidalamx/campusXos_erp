'use client';

import React, { useState, useEffect, useRef } from 'react';
import SuiteSidebar from '../components/SuiteSidebar';
import { 
  Monitor, 
  Cpu, 
  ShieldCheck, 
  Terminal, 
  Play, 
  Square, 
  Keyboard, 
  Clipboard, 
  UploadCloud, 
  UserCheck, 
  Settings, 
  RefreshCw, 
  ArrowRight,
  HardDrive,
  MousePointer,
  HelpCircle,
  FileCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useConnect, ConnectProvider } from '../ConnectContext';
import '../connect.css';
import '../messages/messages.css';

function RemoteControlContent() {
  const { currentUser } = useConnect();
  
  // Connection states
  const [deviceAddress, setDeviceAddress] = useState('482-991-052');
  const [targetAddress, setTargetAddress] = useState('');
  const [connectionState, setConnectionState] = useState('Disconnected'); // 'Disconnected' | 'Connecting' | 'Connected'
  const [connectionTime, setConnectionTime] = useState(0);
  
  // Controls & permissions
  const [keyboardLocked, setKeyboardLocked] = useState(false);
  const [clipboardSync, setClipboardSync] = useState(true);
  const [mouseSyncEvents, setMouseSyncEvents] = useState([]);
  
  // Permission Checklist
  const [permissions, setPermissions] = useState({
    keyboard: true,
    mouse: true,
    clipboard: true,
    fileTransfer: true
  });

  // Consent modal
  const [showConsentModal, setShowConsentModal] = useState(false);
  const [incomingRequestUser, setIncomingRequestUser] = useState(null);

  // File Drop Simulation
  const [dragActive, setDragActive] = useState(false);
  const [transferredFiles, setTransferredFiles] = useState([
    { name: 'consensus_config.json', size: '2.4 KB', progress: 100, status: 'completed' }
  ]);
  const [isUploading, setIsUploading] = useState(false);

  // Session Logs
  const [sessionLogs, setSessionLogs] = useState([
    { id: 1, type: 'info', text: 'Local WebRTC signaling socket initialized.' },
    { id: 2, type: 'info', text: 'Ready for client remote control requests.' }
  ]);

  // Handle active session timer
  useEffect(() => {
    let interval = null;
    if (connectionState === 'Connected') {
      interval = setInterval(() => {
        setConnectionTime((prev) => prev + 1);
      }, 1000);
    } else {
      setConnectionTime(0);
    }
    return () => clearInterval(interval);
  }, [connectionState]);

  const formatTimer = (sec) => {
    const mins = Math.floor(sec / 60);
    const secs = sec % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  // Connect handler
  const handleConnect = () => {
    if (!targetAddress.trim()) return;
    setConnectionState('Connecting');
    setSessionLogs(prev => [...prev, { type: 'info', text: `Initiating peer signaling handshake with device: ${targetAddress}` }]);

    setTimeout(() => {
      setConnectionState('Connected');
      setSessionLogs(prev => [
        ...prev,
        { type: 'success', text: `Peer connection established with target Address: ${targetAddress}` },
        { type: 'success', text: 'WebRTC Data Channels opened successfully for Mouse/Keyboard events.' },
        { type: 'info', text: 'Consensus trust certification verified on block #104845.' }
      ]);
    }, 2000);
  };

  const handleDisconnect = () => {
    setConnectionState('Disconnected');
    setSessionLogs(prev => [...prev, { type: 'info', text: 'Remote connection terminated by local administrator.' }]);
    setTargetAddress('');
  };

  // Mouse coordinate sync simulation
  const handleMouseMoveOverScreen = (e) => {
    if (connectionState !== 'Connected') return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.round(e.clientX - rect.left);
    const y = Math.round(e.clientY - rect.top);

    // Save coordinate and cap length of trail
    setMouseSyncEvents((prev) => {
      const next = [...prev, { x, y, id: Date.now() }];
      if (next.length > 5) next.shift();
      return next;
    });
  };

  // File drop handler simulation
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      simulateFileUpload(file.name, `${(file.size / 1024).toFixed(1)} KB`);
    }
  };

  const simulateFileUpload = (name, size) => {
    setIsUploading(true);
    const newFile = { name, size, progress: 0, status: 'uploading' };
    setTransferredFiles(prev => [newFile, ...prev]);

    let prog = 0;
    const interval = setInterval(() => {
      prog += 20;
      setTransferredFiles(prev => prev.map(f => f.name === name ? { ...f, progress: prog } : f));
      if (prog >= 100) {
        clearInterval(interval);
        setIsUploading(false);
        setTransferredFiles(prev => prev.map(f => f.name === name ? { ...f, status: 'completed' } : f));
        setSessionLogs(prev => [
          ...prev,
          { type: 'success', text: `Shared file "${name}" synchronized and registered in ledger logs.` }
        ]);
      }
    }, 400);
  };

  const triggerIncomingRequest = () => {
    setIncomingRequestUser({
      name: 'Dr. Raymond Park',
      did: 'did:campusx:usr_001',
      role: 'Faculty Supervisor'
    });
    setShowConsentModal(true);
  };

  const acceptConsent = () => {
    setShowConsentModal(false);
    setTargetAddress('482-001-999');
    setConnectionState('Connected');
    setSessionLogs(prev => [
      ...prev,
      { type: 'success', text: `Granted administrator remote control permission to Dr. Raymond Park.` },
      { type: 'success', text: `WebRTC signaling session established successfully.` }
    ]);
  };

  return (
    <div className="messages-main-container select-none connect-font-inter">
      {/* 1. Global Suite Sidebar */}
      <SuiteSidebar />

      {/* 2. Left panel: Connection management */}
      <div className="w-[320px] bg-[#0B1736] border-r border-white/5 flex flex-col h-full overflow-hidden shrink-0">
        <div className="p-4 border-b border-white/5 flex flex-col gap-4 shrink-0">
          <h2 className="text-sm font-extrabold text-white tracking-wide">Remote Access Nodes</h2>

          {/* Local device code */}
          <div className="p-3 bg-[#102043]/30 border border-white/5 rounded-2xl flex flex-col gap-1">
            <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">Your Device ID Address</span>
            <div className="flex items-center justify-between">
              <span className="text-sm font-extrabold font-mono text-cyan-400">{deviceAddress}</span>
              <span className="text-[8px] bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/20 px-2 py-0.5 rounded">
                Active Node
              </span>
            </div>
          </div>

          {/* Connection key input box */}
          <div className="flex flex-col gap-2">
            <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider pl-0.5">Control Remote Node</span>
            <div className="flex gap-2">
              <input 
                type="text" 
                placeholder="Enter device address..." 
                value={targetAddress}
                onChange={(e) => setTargetAddress(e.target.value)}
                disabled={connectionState !== 'Disconnected'}
                className="flex-1 bg-[#102043]/50 border border-white/5 rounded-xl py-2 px-3 text-xs text-white placeholder-slate-500 outline-none font-mono focus:border-brand-primary/40 disabled:opacity-50"
              />
              
              {connectionState === 'Disconnected' ? (
                <button 
                  onClick={handleConnect}
                  className="px-3 py-2 bg-brand-primary text-white rounded-xl text-xs font-bold flex items-center justify-center cursor-pointer shadow-md"
                >
                  Connect
                </button>
              ) : (
                <button 
                  onClick={handleDisconnect}
                  className="px-3 py-2 bg-rose-600 text-white rounded-xl text-xs font-bold flex items-center justify-center cursor-pointer shadow-md"
                >
                  Stop
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Console Log Panel */}
        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3.5 chat-scroll border-b border-white/5">
          <div>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider pl-1 block mb-2 font-mono">Consensus Audit logs</span>
            <div className="flex flex-col gap-2 font-mono text-[9px] leading-relaxed text-slate-400">
              {sessionLogs.map((log, i) => (
                <div 
                  key={i} 
                  className={`p-2 rounded-lg bg-[#102043]/10 border border-white/5 flex gap-1.5 ${
                    log.type === 'success' ? 'text-emerald-400 border-emerald-500/10' : 'text-slate-400'
                  }`}
                >
                  <span>&gt;</span>
                  <p className="flex-1">{log.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Consent trigger button for simulation */}
        <div className="p-4 bg-[#102043]/10 shrink-0">
          <button 
            onClick={triggerIncomingRequest}
            className="w-full py-2 border border-dashed border-white/10 hover:border-brand-primary/40 text-[10px] text-slate-400 hover:text-white rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <UserCheck className="w-3.5 h-3.5" /> Simulate Incoming Request
          </button>
        </div>
      </div>

      {/* 3. Middle Area: Virtual Desktop Stream Viewport */}
      <div className="flex-1 flex flex-col h-full overflow-hidden bg-[#071126]">
        
        {/* Viewport Top Header */}
        <header className="h-[50px] border-b border-white/5 bg-[#0B1736]/40 px-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <Monitor className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-bold text-slate-200">
              {connectionState === 'Connected' ? `Remote Host Node: ${targetAddress}` : 'Remote Screen Stream'}
            </span>
          </div>

          <div className="flex items-center gap-2.5">
            <button 
              onClick={() => setKeyboardLocked(!keyboardLocked)}
              className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                keyboardLocked ? 'bg-indigo-500/20 border-indigo-400 text-indigo-400' : 'bg-transparent border-transparent text-slate-400 hover:text-white'
              }`}
              title="Lock Keyboard Sync"
            >
              <Keyboard className="w-4 h-4" />
            </button>
            <button 
              onClick={() => setClipboardSync(!clipboardSync)}
              className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                clipboardSync ? 'bg-indigo-500/20 border-indigo-400 text-indigo-400' : 'bg-transparent border-transparent text-slate-400 hover:text-white'
              }`}
              title="Sync Clipboard State"
            >
              <Clipboard className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* Simulated Remote Screen */}
        <div className="flex-1 p-4 overflow-hidden relative flex flex-col justify-between">
          
          {connectionState === 'Disconnected' ? (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-[#050b1a] rounded-2xl border border-white/5">
              <Monitor className="w-12 h-12 text-slate-600 mb-3" />
              <h3 className="text-xs font-bold text-white">No Target Node Active</h3>
              <p className="text-[11px] text-slate-500 mt-1 max-w-xs leading-relaxed">
                Connect to a target device or approve incoming requests on the left to initialize virtual display frames.
              </p>
            </div>
          ) : connectionState === 'Connecting' ? (
            <div className="flex-1 flex flex-col items-center justify-center gap-3 bg-[#050b1a] rounded-2xl border border-white/5">
              <RefreshCw className="w-8 h-8 text-indigo-400 animate-spin" />
              <p className="text-xs text-slate-300 font-semibold uppercase tracking-wider">Configuring WebRTC Signaling...</p>
            </div>
          ) : (
            // Remote screen simulation active
            <div 
              onMouseMove={handleMouseMoveOverScreen}
              className="flex-1 rounded-2xl border border-white/10 bg-[#0c1222] relative overflow-hidden flex flex-col justify-between shadow-2xl"
              style={{ cursor: 'crosshair' }}
            >
              {/* Screen wallpaper mock/contents */}
              <div className="absolute inset-0 bg-[#050B1B]/90 flex flex-col justify-between p-4 z-0">
                {/* Admin terminal mock */}
                <div className="bg-black/40 border border-white/5 rounded-xl p-4 font-mono text-[10px] text-emerald-400 leading-relaxed max-w-[450px]">
                  <p className="text-slate-500"># CampusX Operating System Terminal v6.2</p>
                  <p>&gt; client_connect --handshake secure_key_attestation</p>
                  <p className="text-cyan-400">&gt; Status: SUCCESS [Attestation verified]</p>
                  <p>&gt; telemetry --track mouse_sync keyboard_sync</p>
                  <p>&gt; Listening WebRTC Data Channels event frames...</p>
                </div>

                {/* Database Metrics chart mock */}
                <div className="self-end bg-black/40 border border-white/5 rounded-xl p-3 w-56 font-mono text-[9px] flex flex-col gap-1.5 text-slate-300">
                  <span className="font-bold text-indigo-400">Node Performance Data</span>
                  <div className="flex justify-between">
                    <span>CPU Core:</span>
                    <span>12%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Mem Heap:</span>
                    <span>1.2 GB / 8 GB</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Network:</span>
                    <span>124 Kb/s</span>
                  </div>
                </div>
              </div>

              {/* Status Header overlay */}
              <div className="bg-black/50 backdrop-blur border-b border-white/5 p-2 px-3 text-[10px] font-bold text-slate-200 flex justify-between items-center z-10 shrink-0">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span>Session Active: remote_desktop_482-991-052</span>
                </div>
                <span className="font-mono text-[9px] text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
                  Duration: {formatTimer(connectionTime)}
                </span>
              </div>

              {/* Display Mouse Coordinates sync trail overlays */}
              <div className="absolute inset-0 pointer-events-none z-20">
                {mouseSyncEvents.map((dot) => (
                  <div 
                    key={dot.id}
                    className="absolute w-2 h-2 bg-cyan-400 rounded-full -translate-x-1/2 -translate-y-1/2 flex items-center justify-center"
                    style={{ left: dot.x, top: dot.y }}
                  >
                    <span className="absolute w-6 h-6 bg-cyan-400/20 rounded-full animate-ping"></span>
                    <span className="absolute left-3 top-0 bg-black/60 text-[8px] font-mono text-cyan-300 px-1 py-0.2 rounded border border-cyan-400/20 whitespace-nowrap">
                      X:{dot.x} Y:{dot.y} [WebRTC sync]
                    </span>
                  </div>
                ))}
              </div>

              {/* Drag-and-drop file upload target area */}
              <div 
                onDragEnter={handleDrag}
                onDragOver={handleDrag}
                onDragLeave={handleDrag}
                onDrop={handleDrop}
                className={`z-10 m-4 p-4 border-2 border-dashed rounded-xl flex items-center justify-center gap-2.5 transition-all text-xs font-bold ${
                  dragActive 
                    ? 'border-indigo-400 bg-indigo-500/10 text-white' 
                    : 'border-white/5 bg-black/20 text-slate-400 hover:border-white/15'
                }`}
              >
                <UploadCloud className="w-5 h-5 text-indigo-400" />
                <span>Drag files here to simulate WebRTC data transfer</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 4. Right Panel: Active Session Permissions & Approvals (380px) */}
      <aside className="w-[380px] bg-[#0B1736] border-l border-white/5 flex flex-col h-full overflow-hidden shrink-0">
        <div className="p-4 border-b border-white/5 flex items-center justify-between shrink-0">
          <span className="text-xs font-bold text-white uppercase tracking-wider">Control Settings</span>
          <Settings className="w-4 h-4 text-slate-400" />
        </div>

        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 chat-scroll">
          
          {/* Permissions Toggle checklists */}
          <div className="bg-[#102043]/30 border border-white/5 rounded-2xl p-4 flex flex-col gap-3.5">
            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">Channel Privileges</h4>
            
            <div className="flex flex-col gap-3">
              {[
                { id: 'keyboard', label: 'Synchronize Keyboard Inputs', desc: 'Allows keystroke signals forwarding.' },
                { id: 'mouse', label: 'Synchronize Mouse Inputs', desc: 'Allows dragging coordinates transfer.' },
                { id: 'clipboard', label: 'Synchronize Clipboard Buffer', desc: 'Allows textual copy-paste buffers.' },
                { id: 'fileTransfer', label: 'Allow File Handshake Transfer', desc: 'Allows drag-and-drop file packets.' }
              ].map((perm) => (
                <div key={perm.id} className="flex items-start justify-between gap-3">
                  <div>
                    <h5 className="text-xs font-bold text-slate-200">{perm.label}</h5>
                    <p className="text-[9px] text-slate-500 mt-0.5 leading-normal">{perm.desc}</p>
                  </div>
                  <input 
                    type="checkbox" 
                    checked={permissions[perm.id]}
                    onChange={() => setPermissions({ ...permissions, [perm.id]: !permissions[perm.id] })}
                    className="w-4 h-4 accent-brand-primary cursor-pointer shrink-0 mt-0.5"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Transferred Files log */}
          <div className="bg-[#102043]/30 border border-white/5 rounded-2xl p-4 flex flex-col gap-3">
            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">Shared sandbox files</h4>
            <div className="flex flex-col gap-2">
              {transferredFiles.map((file, i) => (
                <div key={i} className="p-3 bg-black/20 border border-white/5 rounded-xl flex flex-col gap-1.5 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-slate-200 flex items-center gap-1.5">
                      <FileCheck className="w-3.5 h-3.5 text-indigo-400" /> {file.name}
                    </span>
                    <span className="text-[9px] text-slate-500">{file.size}</span>
                  </div>

                  {file.status === 'uploading' ? (
                    <div className="w-full flex items-center gap-2">
                      <div className="flex-1 bg-white/5 rounded-full h-1.5 overflow-hidden">
                        <div className="bg-indigo-500 h-full transition-all" style={{ width: `${file.progress}%` }}></div>
                      </div>
                      <span className="text-[8px] font-mono text-slate-400">{file.progress}%</span>
                    </div>
                  ) : (
                    <span className="text-[9px] text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 w-fit">
                      Consensus Anchored
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </aside>

      {/* 5. Simulated Incoming Consent Modal Drawer */}
      <AnimatePresence>
        {showConsentModal && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[1000] p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="bg-[#0B1736] border border-white/10 rounded-[20px] p-6 max-w-sm w-full shadow-2xl flex flex-col gap-4"
            >
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-6 h-6 text-yellow-400 animate-pulse" />
                <h3 className="text-sm font-extrabold text-white">Remote Consent Handshake</h3>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                An incoming WebRTC peer request from HOD <strong>{incomingRequestUser?.name}</strong> (DID: <code>{incomingRequestUser?.did}</code>) has been received. This grants full mouse, keyboard, and file transfer control to your local client.
              </p>

              <div className="flex gap-2.5 mt-2">
                <button 
                  onClick={() => setShowConsentModal(false)}
                  className="flex-1 py-2 rounded-xl text-xs font-bold bg-white/5 border border-white/5 hover:bg-white/10 text-slate-400 hover:text-white cursor-pointer"
                >
                  Reject
                </button>
                <button 
                  onClick={acceptConsent}
                  className="flex-1 py-2 rounded-xl text-xs font-extrabold bg-brand-primary hover:opacity-90 text-white cursor-pointer"
                >
                  Approve Control
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function RemoteControlPage() {
  return (
    <ConnectProvider>
      <RemoteControlContent />
    </ConnectProvider>
  );
}
