'use client';

import React, { useState, useEffect } from 'react';
import SuiteSidebar from '../components/SuiteSidebar';
import { 
  Folder, 
  FolderOpen, 
  File, 
  Play, 
  Save, 
  Users, 
  Terminal, 
  GitBranch, 
  ChevronRight, 
  ChevronDown, 
  Plus, 
  CheckCircle,
  FileCode,
  ShieldAlert,
  Loader,
  Code
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useConnect, ConnectProvider } from '../ConnectContext';
import '../connect.css';
import '../messages/messages.css';

function WorkspacesPageContent() {
  const { currentUser } = useConnect();
  
  // File System State
  const [fileSystem, setFileSystem] = useState([
    {
      name: 'contracts',
      isFolder: true,
      open: true,
      children: [
        { name: 'CampusXConsensus.sol', isFolder: false, content: `// SPDX-License-Identifier: MIT\npragma solidity ^0.8.20;\n\ncontract CampusXConsensus {\n    address public owner;\n    mapping(address => bool) public verifiers;\n    \n    event VerificationAnchored(bytes32 indexed blockHash, uint256 timestamp);\n\n    constructor() {\n        owner = msg.sender;\n        verifiers[msg.sender] = true;\n    }\n\n    function anchorVerification(bytes32 hash) public {\n        require(verifiers[msg.sender], "Not authorized verifier");\n        emit VerificationAnchored(hash, block.timestamp);\n    }\n}` },
        { name: 'IdentityRegistry.sol', isFolder: false, content: `// SPDX-License-Identifier: MIT\npragma solidity ^0.8.20;\n\ncontract IdentityRegistry {\n    struct User {\n        string did;\n        bool active;\n    }\n    mapping(address => User) public registry;\n}` }
      ]
    },
    {
      name: 'src',
      isFolder: true,
      open: false,
      children: [
        { name: 'telemetry.js', isFolder: false, content: `export function logSessionMetrics(sessionId) {\n  const metrics = {\n    lossRate: 0.00,\n    fps: 60,\n    jitterMs: 1.4\n  };\n  console.log(\`Logging telemetry metrics for session: \${sessionId}\`);\n}` },
        { name: 'webrtc.js', isFolder: false, content: `export function initializePeerConnection(config) {\n  return new RTCPeerConnection(config);\n}` }
      ]
    },
    { name: 'package.json', isFolder: false, content: `{\n  "name": "campusx-workspaces",\n  "version": "1.0.0",\n  "dependencies": {\n    "ethers": "^6.0.0"\n  }\n}` },
    { name: 'README.md', isFolder: false, content: `# CampusX Connect Workspaces\nCollaborate on smart contracts and telemetry scripts directly in a secure ledger-backed sandbox.` }
  ]);

  // Selected File details
  const [selectedFile, setSelectedFile] = useState(null);
  const [editorContent, setEditorContent] = useState('');
  
  // Build and console states
  const [consoleLogs, setConsoleLogs] = useState([
    { type: 'info', text: 'Initializing CampusX Ledger Compiler engine...' },
    { type: 'success', text: 'Secured workspace connection: sandbox_usr_003 active.' }
  ]);
  const [isCompiling, setIsCompiling] = useState(false);

  // Active collaborators
  const collaborators = [
    { name: 'Dr. Raymond Park', line: 12, color: 'border-cyan-400 bg-cyan-500/20 text-cyan-300' },
    { name: 'Dr. Marcus Chen', line: 4, color: 'border-pink-400 bg-pink-500/20 text-pink-300' }
  ];

  // Load first file initially
  useEffect(() => {
    const defaultFile = fileSystem[0].children[0];
    setSelectedFile(defaultFile);
    setEditorContent(defaultFile.content);
  }, []);

  const handleToggleFolder = (folderName) => {
    setFileSystem(fileSystem.map(item => {
      if (item.name === folderName && item.isFolder) {
        return { ...item, open: !item.open };
      }
      return item;
    }));
  };

  const handleSelectFile = (file) => {
    setSelectedFile(file);
    setEditorContent(file.content);
  };

  // Compile smart contract simulation
  const runCompileBuild = () => {
    if (isCompiling) return;
    setIsCompiling(true);
    setConsoleLogs(prev => [...prev, { type: 'info', text: `Compiling ${selectedFile?.name || 'file'}...` }]);

    setTimeout(() => {
      setIsCompiling(false);
      const randHash = '0x' + Array.from({ length: 32 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
      setConsoleLogs(prev => [
        ...prev,
        { type: 'success', text: 'Compilation completed successfully. Solidity v0.8.20 target matched.' },
        { type: 'success', text: `CampusX Chain Deployment transaction broadcast: ${randHash.substring(0, 16)}...` },
        { type: 'info', text: `Block confirm received: block #${104800 + Math.floor(Math.random() * 50)} verified.` }
      ]);
    }, 1800);
  };

  return (
    <div className="messages-main-container select-none connect-font-inter">
      {/* 1. Global Suite Sidebar */}
      <SuiteSidebar />

      {/* 2. Left File System Tree Panel (260px) */}
      <div className="w-[260px] bg-[#0B1736] border-r border-white/5 flex flex-col h-full overflow-hidden shrink-0">
        <div className="p-4 border-b border-white/5 flex items-center justify-between shrink-0">
          <span className="text-xs font-extrabold text-white uppercase tracking-wider flex items-center gap-1.5">
            <GitBranch className="w-4 h-4 text-brand-primary" /> Workspace Explorer
          </span>
          <button className="p-1 rounded bg-white/5 hover:bg-white/10 text-slate-300 transition-all cursor-pointer">
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Directory File Node list */}
        <div className="flex-1 overflow-y-auto p-2.5 flex flex-col gap-1 chat-scroll text-xs">
          {fileSystem.map((node) => {
            if (node.isFolder) {
              return (
                <div key={node.name} className="flex flex-col gap-1">
                  <button 
                    onClick={() => handleToggleFolder(node.name)}
                    className="w-full flex items-center justify-between p-1.5 hover:bg-white/[0.03] rounded-lg text-slate-300 font-semibold cursor-pointer text-left"
                  >
                    <div className="flex items-center gap-2">
                      {node.open ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                      {node.open ? <FolderOpen className="w-4 h-4 text-amber-400" /> : <Folder className="w-4 h-4 text-amber-400" />}
                      <span>{node.name}</span>
                    </div>
                  </button>

                  {/* Folder Children rendering */}
                  {node.open && (
                    <div className="pl-4 flex flex-col gap-1 border-l border-white/5 ml-3.5 mt-0.5">
                      {node.children.map((child) => (
                        <button
                          key={child.name}
                          onClick={() => handleSelectFile(child)}
                          className={`w-full flex items-center gap-2 p-1.5 rounded-lg text-left cursor-pointer transition-all ${
                            selectedFile?.name === child.name 
                              ? 'bg-brand-primary/10 border border-brand-primary/20 text-brand-primary font-bold' 
                              : 'text-slate-400 hover:text-white border border-transparent'
                          }`}
                        >
                          <FileCode className="w-3.5 h-3.5" />
                          <span className="truncate">{child.name}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            }

            return (
              <button
                key={node.name}
                onClick={() => handleSelectFile(node)}
                className={`w-full flex items-center gap-2 p-1.5 rounded-lg text-left cursor-pointer transition-all ${
                  selectedFile?.name === node.name 
                    ? 'bg-brand-primary/10 border border-brand-primary/20 text-brand-primary font-bold' 
                    : 'text-slate-400 hover:text-white border border-transparent'
                }`}
              >
                <File className="w-4 h-4 text-slate-400" />
                <span>{node.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Middle Area: Collaborative Code Editor */}
      <div className="flex-1 flex flex-col h-full overflow-hidden bg-[#071126] border-r border-white/5 relative">
        {/* Editor tab header */}
        <header className="h-[50px] border-b border-white/5 bg-[#0B1736]/40 px-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <Code className="w-4 h-4 text-indigo-400" />
            <span className="text-xs font-bold text-slate-200">{selectedFile?.name || 'editor'}</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" title="Saved to Local Sandbox"></span>
          </div>

          <div className="flex items-center gap-2">
            <button 
              onClick={() => alert("Code workspace changes saved in decentralized storage nodes.")}
              className="p-1.5 bg-white/5 hover:bg-white/10 rounded-lg text-slate-300 cursor-pointer"
              title="Save Sandbox File"
            >
              <Save className="w-4 h-4" />
            </button>
            <button 
              onClick={runCompileBuild}
              disabled={isCompiling}
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-md transition-opacity"
            >
              {isCompiling ? <Loader className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5" />}
              <span>Compile & Anchor</span>
            </button>
          </div>
        </header>

        {/* Editor Screen & Collaborator indicators */}
        <div className="flex-1 relative flex overflow-hidden">
          {/* Editor Area with Line numbers */}
          <div className="flex-1 flex bg-[#050b1a] overflow-auto chat-scroll font-mono text-xs">
            <div className="p-4 text-slate-600 bg-black/10 text-right select-none border-r border-white/5 shrink-0 flex flex-col gap-1 min-w-[40px]">
              {Array.from({ length: editorContent.split('\n').length || 1 }, (_, i) => (
                <span key={i}>{i + 1}</span>
              ))}
            </div>
            
            <div className="flex-1 p-4 relative min-w-[400px]">
              <textarea
                value={editorContent}
                onChange={(e) => setEditorContent(e.target.value)}
                className="absolute inset-4 bg-transparent border-none outline-none resize-none font-mono text-xs leading-relaxed text-slate-200 w-[calc(100%-32px)] h-[calc(100%-32px)] overflow-hidden"
              />

              {/* Simulated active collaborators' cursors rendering on screen */}
              {collaborators.map((col, idx) => (
                <div 
                  key={idx}
                  className="absolute left-4 w-fit px-1.5 py-0.5 rounded border pointer-events-none text-[8px] font-sans font-bold flex items-center gap-1 z-10 transition-all"
                  style={{ top: `${col.line * 20}px` }}
                >
                  <span className="w-1.5 h-1.5 bg-current rounded-full"></span>
                  <span className={`px-1 rounded-sm ${col.color}`}>{col.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Console logs output drawer (200px high) */}
        <div className="h-[220px] border-t border-white/5 bg-[#0A1020] flex flex-col overflow-hidden shrink-0">
          <div className="h-9 border-b border-white/5 bg-black/10 px-4 flex items-center justify-between shrink-0">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Terminal className="w-3.5 h-3.5" /> Output Logs Console
            </span>
            <button 
              onClick={() => setConsoleLogs([])}
              className="text-[9px] text-slate-500 hover:text-slate-300 font-bold"
            >
              Clear Logs
            </button>
          </div>

          <div className="flex-1 p-3.5 overflow-y-auto font-mono text-[10.5px] leading-relaxed flex flex-col gap-1.5 chat-scroll">
            {consoleLogs.map((log, i) => (
              <div 
                key={i} 
                className={`flex gap-1.5 ${
                  log.type === 'success' ? 'text-emerald-400' : log.type === 'error' ? 'text-rose-400' : 'text-slate-400'
                }`}
              >
                <span>&gt;</span>
                <p className="flex-1">{log.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 4. Right Panel: Active Session details (380px) */}
      <aside className="w-[380px] bg-[#0B1736] flex flex-col h-full overflow-hidden shrink-0">
        <div className="p-4 border-b border-white/5 flex items-center justify-between shrink-0">
          <span className="text-xs font-bold text-white uppercase tracking-wider">Workspace Sessions</span>
          <Users className="w-4 h-4 text-slate-400" />
        </div>

        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 chat-scroll">
          
          {/* Active users card */}
          <div className="bg-[#102043]/30 border border-white/5 rounded-2xl p-4 flex flex-col gap-3">
            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">Workspace Members (3)</h4>
            <div className="flex flex-col gap-2">
              {[
                { name: 'Aria Nakamura', role: 'Student (You)', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150', typing: false },
                { name: 'Dr. Raymond Park', role: 'Faculty Leader', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150', typing: true },
                { name: 'Dr. Marcus Chen', role: 'Professor', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150', typing: false }
              ].map((member, i) => (
                <div key={i} className="flex items-center justify-between bg-black/10 p-2.5 rounded-xl border border-white/5">
                  <div className="flex items-center gap-2.5">
                    <img src={member.avatar} alt="avatar" className="w-8 h-8 rounded-full object-cover" />
                    <div>
                      <p className="text-xs font-bold text-white">{member.name}</p>
                      <p className="text-[9px] text-slate-400 mt-0.5">{member.role}</p>
                    </div>
                  </div>

                  {member.typing && (
                    <span className="text-[9px] text-cyan-400 font-bold bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20 animate-pulse">
                      Typing...
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Repository/Consensus audit trail details */}
          <div className="bg-[#102043]/30 border border-white/5 rounded-2xl p-4 flex flex-col gap-3.5">
            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">Ledger History logs</h4>
            <div className="flex flex-col gap-3">
              {[
                { actor: 'Dr. Raymond Park', action: 'Committed Solidity v0.8.20 consensus verification block anchor', time: '10 mins ago', hash: '0x9482fa8bc7c5db02' },
                { actor: 'Aria Nakamura', action: 'Created project structure file system trees', time: '1 hour ago', hash: '0x21dcc8377da2ba98' },
                { actor: 'Aria Nakamura', action: 'Synchronized WebRTC peer connection telemetry logs', time: '2 hours ago', hash: '0x8f2d72111d4e414c' }
              ].map((log, i) => (
                <div key={i} className="text-xs border-b border-white/5 pb-2.5 last:border-transparent">
                  <div className="flex justify-between items-center text-[10px] font-bold">
                    <span className="text-indigo-400">{log.actor}</span>
                    <span className="text-slate-500 font-mono">{log.time}</span>
                  </div>
                  <p className="text-slate-300 mt-1 leading-relaxed">{log.action}</p>
                  <code className="text-[9px] text-slate-500 mt-1 block font-mono bg-black/20 px-1.5 py-0.5 rounded w-fit">{log.hash}</code>
                </div>
              ))}
            </div>
          </div>

        </div>
      </aside>
    </div>
  );
}

export default function WorkspacesPage() {
  return (
    <ConnectProvider>
      <WorkspacesPageContent />
    </ConnectProvider>
  );
}
