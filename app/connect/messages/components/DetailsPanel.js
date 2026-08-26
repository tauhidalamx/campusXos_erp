'use client';

import React, { useState } from 'react';
import { 
  FileText, 
  Search, 
  ExternalLink, 
  ShieldCheck, 
  Users, 
  Download, 
  Calendar,
  Lock,
  ChevronDown,
  ChevronRight,
  Fingerprint
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function DetailsPanel({ channelId }) {
  const [activeCategory, setActiveCategory] = useState('files'); // 'files' | 'blockchain' | 'members'
  
  // Simulated blockchain hash logs for active channel meetings
  const [ledgerProof, setLedgerProof] = useState({
    hash: '0x9320e4da88f2be58daef271cb0f438da1cf4d88e001f78ea',
    attestationCode: '0xsig_did_campusx_sol_88f2be58daef27',
    blockNumber: '1,492,084',
    txFee: '0.00042 ETH',
    gasUnits: '42,500 Wei',
    derivedDid: 'did:campusx:sol:0x1b790d984d720a45594efa4c',
    timestamp: 'June 12, 2026 at 20:45 PM'
  });

  const sharedFiles = [
    { name: 'Syllabus_CS202_Draft.pdf', size: '1.2 MB', date: 'June 10', type: 'pdf' },
    { name: 'DecentralizedLedgerArchitecture.pdf', size: '4.8 MB', date: 'June 09', type: 'pdf' },
    { name: 'Optimizations.sol', size: '4.8 KB', date: 'June 12', type: 'code' }
  ];

  const channelMembers = [
    { name: 'Dr. Evelyn Sterling', role: 'Faculty', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150', status: 'online' },
    { name: 'Prof. Marcus Chen', role: 'Faculty', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150', status: 'meeting' },
    { name: 'Aria Nakamura', role: 'Student', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150', status: 'online' },
    { name: 'Carlos Mendez', role: 'Student', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150', status: 'online' }
  ];

  return (
    <div className="w-[380px] bg-[#0B1736] border-l border-white/5 flex flex-col h-full shrink-0 details-panel-sidebar select-none text-left">
      
      {/* Panel Title */}
      <div className="p-4 border-b border-white/5 bg-[#102043]/30">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">Workspace Details</span>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-white/5 p-2 bg-[#102043]/10">
        {[
          { id: 'files', label: 'Shared Files' },
          { id: 'blockchain', label: 'CampusX Trust Proof' },
          { id: 'members', label: 'Room Members' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveCategory(tab.id)}
            className={`flex-1 py-2 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
              activeCategory === tab.id
                ? 'bg-brand-primary/10 text-brand-primary'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Viewport Content */}
      <div className="flex-1 overflow-y-auto p-4 chat-scroll">
        
        {/* VIEW 1: SHARED FILES */}
        {activeCategory === 'files' && (
          <div className="flex flex-col gap-3">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-1 mb-1">Shared Attachments</span>
            {sharedFiles.map((file, i) => (
              <div 
                key={i} 
                className="p-3 bg-[#102043]/20 border border-white/5 rounded-2xl flex items-center justify-between hover:border-white/10 transition-all"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="p-2.5 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-xl">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div className="flex flex-col min-w-0 text-left">
                    <span className="text-xs font-bold text-white truncate max-w-[180px]">{file.name}</span>
                    <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider mt-0.5">{file.size} • {file.date}</span>
                  </div>
                </div>
                <button className="p-2 bg-[#0B1736] border border-white/5 text-slate-400 hover:text-white rounded-lg">
                  <Download className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* VIEW 2: BLOCKCHAIN TRUST PROOF */}
        {activeCategory === 'blockchain' && (
          <div className="flex flex-col gap-4">
            <div className="p-4 bg-brand-primary/5 border border-brand-primary/20 rounded-2xl flex flex-col items-center text-center gap-2">
              <ShieldCheck className="w-8 h-8 text-brand-primary animate-pulse" />
              <div className="flex flex-col">
                <span className="text-xs font-bold text-white">Trust Attestation Ledger</span>
                <span className="text-[9px] text-slate-400 mt-1">Immutable cryptographic anchors synced with Polygon Subnet nodes</span>
              </div>
            </div>

            <div className="flex flex-col gap-3.5 text-xs text-slate-300">
              
              <div className="flex flex-col bg-[#102043]/20 border border-white/5 p-3 rounded-2xl">
                <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider flex items-center gap-1.5 mb-1.5">
                  <Fingerprint className="w-3.5 h-3.5" />
                  Room Transaction Hash
                </span>
                <code className="text-[9px] text-brand-accent-cyan font-mono break-all bg-black/30 p-2 rounded border border-white/5 leading-normal">
                  {ledgerProof.hash}
                </code>
              </div>

              <div className="flex flex-col bg-[#102043]/20 border border-white/5 p-3 rounded-2xl">
                <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider mb-1">Attendance DID Attestation</span>
                <code className="text-[9px] text-brand-accent-emerald font-mono break-all">
                  {ledgerProof.attestationCode}
                </code>
              </div>

              <div className="grid grid-cols-2 gap-3.5">
                <div className="flex flex-col bg-[#102043]/20 border border-white/5 p-3 rounded-2xl">
                  <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider mb-0.5">Block Anchored</span>
                  <span className="font-bold text-white font-mono">{ledgerProof.blockNumber}</span>
                </div>
                <div className="flex flex-col bg-[#102043]/20 border border-white/5 p-3 rounded-2xl">
                  <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider mb-0.5">Anchored Fee</span>
                  <span className="font-bold text-white font-mono">{ledgerProof.txFee}</span>
                </div>
              </div>

              <div className="flex flex-col bg-[#102043]/20 border border-white/5 p-3 rounded-2xl">
                <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider mb-1">Verified signature (ED25519)</span>
                <span className="text-[10px] text-slate-400 font-medium italic leading-normal">
                  "attendance list verification signature computed from bip39 mnemonic paths against Secp256k1"
                </span>
              </div>

            </div>
          </div>
        )}

        {/* VIEW 3: CHANNEL MEMBERS */}
        {activeCategory === 'members' && (
          <div className="flex flex-col gap-3">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-1 mb-1">Participants Directory</span>
            {channelMembers.map((member, i) => (
              <div 
                key={i} 
                className="p-2.5 bg-[#102043]/10 border border-transparent hover:border-white/5 hover:bg-[#102043]/20 rounded-2xl flex items-center justify-between transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <img src={member.avatar} alt="" className="w-8 h-8 rounded-full object-cover border border-white/10" />
                    <span className={`absolute bottom-0 right-0 w-2 h-2 rounded-full border border-[#0B1736] ${
                      member.status === 'online' ? 'bg-emerald-500' : 'bg-indigo-500 animate-pulse'
                    }`} />
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="text-xs font-bold text-white">{member.name}</span>
                    <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider mt-0.5">{member.role}</span>
                  </div>
                </div>
                <span className="text-[9px] font-mono text-slate-500 font-bold">did:sol:{member.name.split(' ')[0]}</span>
              </div>
            ))}
          </div>
        )}

      </div>

    </div>
  );
}
