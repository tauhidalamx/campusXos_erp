'use client';

import React, { useState } from 'react';
import { useConnect } from '../ConnectContext';
import { 
  FileText, 
  Bookmark, 
  MessageSquare, 
  Download, 
  Award, 
  BookOpen, 
  Share2, 
  Quote, 
  Users,
  Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ResearchCard({ paper }) {
  const { 
    currentUser, 
    handleSavePost, 
    savedPostIds, 
    setMessengerOpen, 
    setActiveChatChannel 
  } = useConnect();

  const [cited, setCited] = useState(false);
  const [showCitationStyle, setShowCitationStyle] = useState(false);
  const isSaved = savedPostIds.has(paper.id);

  // Generate citation indices
  const getCitationIndex = (style) => {
    const primaryAuthor = paper.authors?.[0] || 'Unknown Author';
    const year = new Date(paper.created_at || Date.now()).getFullYear();
    const title = paper.title || 'Untitled Research Paper';
    
    switch(style) {
      case 'APA':
        return `${primaryAuthor} et al. (${year}). ${title}. CampusX Journal of Technology.`;
      case 'MLA':
        return `${primaryAuthor}, et al. "${title}." CampusX Journal of Technology, ${year}.`;
      case 'Chicago':
        return `${primaryAuthor}, et al. "${title}." CampusX Journal of Technology (${year}).`;
      default:
        return `@article{campusx_${paper.id},\n  author={${primaryAuthor} and others},\n  title={${title}},\n  journal={CampusX Journal},\n  year={${year}}\n}`;
    }
  };

  const handleCopyCitation = (style) => {
    const text = getCitationIndex(style);
    navigator.clipboard.writeText(text);
    setCited(true);
    setShowCitationStyle(false);
    setTimeout(() => setCited(false), 2000);
  };

  const handleDiscuss = () => {
    // Open Messenger with Research Chat Channel
    setActiveChatChannel('channel_general'); // Or open research chat channel
    setMessengerOpen(true);
  };

  // Color mappings based on Research Impact Score
  const getImpactColor = (score) => {
    if (score >= 90) return 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10';
    if (score >= 75) return 'text-indigo-400 border-indigo-500/30 bg-indigo-500/10';
    return 'text-amber-400 border-amber-500/30 bg-amber-500/10';
  };

  return (
    <div 
      className="w-full max-w-[650px] bg-[#102043]/40 border border-white/5 rounded-[20px] overflow-hidden flex flex-col transition-all duration-300 hover:border-white/10"
    >
      {/* Premium Header */}
      <div className="p-6 pb-4 flex justify-between items-start border-b border-white/5">
        <div className="flex gap-4 items-start min-w-0">
          <div className="p-3 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-xl shrink-0 mt-1 shadow-inner">
            <FileText className="w-6 h-6" />
          </div>
          <div className="flex flex-col text-left min-w-0">
            <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest flex items-center gap-1.5">
              <Sparkles className="w-3 h-3 text-indigo-400 animate-pulse" />
              PEER-REVIEWED PUBLICATION
            </span>
            <h3 className="text-base font-bold text-white mt-1 hover:text-brand-primary cursor-pointer leading-snug">
              {paper.title || 'Architecting Decentralized Consensus for University Ledgers'}
            </h3>
            <p className="text-xs text-slate-400 mt-2 font-medium">
              Authors: <span className="text-slate-300">{paper.authors?.join(', ') || 'Dr. Evelyn Sterling, Prof. Alan Turing'}</span>
            </p>
          </div>
        </div>
        
        {/* Saved Pin */}
        <button 
          onClick={() => handleSavePost(paper.id)}
          className={`p-2 rounded-xl transition-all border ${
            isSaved 
              ? 'bg-amber-500/10 border-amber-500/20 text-amber-500' 
              : 'bg-transparent border-transparent text-slate-400 hover:text-white hover:bg-white/[0.03]'
          }`}
        >
          <Bookmark className="w-4 h-4" />
        </button>
      </div>

      {/* Collaborators and Department Metadata */}
      <div className="px-6 py-3 bg-[#0B1736]/30 border-b border-white/5 flex items-center justify-between flex-wrap gap-2.5">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Department:</span>
          <span className="text-xs font-semibold text-slate-300">{paper.dept || 'Computer Science & AI'}</span>
        </div>
        
        {/* Collaborators Overlapping Avatars */}
        <div className="flex items-center gap-1.5">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Collaborators:</span>
          <div className="flex -space-x-2.5">
            {(paper.collaborators || [
              'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
              'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
              'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150'
            ]).map((avatar, idx) => (
              <img 
                key={idx} 
                src={avatar} 
                alt="" 
                className="w-6 h-6 rounded-full object-cover border-2 border-[#0B1736] shrink-0" 
              />
            ))}
          </div>
        </div>
      </div>

      {/* Grid of Key Paper Metrics */}
      <div className="p-6 grid grid-cols-3 gap-4 border-b border-white/5 bg-[#0B1736]/20">
        
        <div className="bg-[#102043]/30 border border-white/5 p-3 rounded-2xl flex flex-col items-center justify-center text-center">
          <Quote className="w-5 h-5 text-slate-400 mb-1" />
          <span className="text-xs font-bold text-white leading-none">{paper.citations_count || 128}</span>
          <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider mt-1">Citations</span>
        </div>

        <div className="bg-[#102043]/30 border border-white/5 p-3 rounded-2xl flex flex-col items-center justify-center text-center">
          <Download className="w-5 h-5 text-slate-400 mb-1" />
          <span className="text-xs font-bold text-white leading-none">{paper.downloads_count || 1042}</span>
          <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider mt-1">Downloads</span>
        </div>

        <div className={`border p-3 rounded-2xl flex flex-col items-center justify-center text-center ${
          getImpactColor(paper.impact_score || 94)
        }`}>
          <Award className="w-5 h-5 mb-1" />
          <span className="text-xs font-bold leading-none">{paper.impact_score || 94} / 100</span>
          <span className="text-[9px] font-bold uppercase tracking-wider mt-1">Impact Score</span>
        </div>

      </div>

      {/* Bottom Quick Actions Row */}
      <div className="px-6 py-4 flex items-center justify-between relative">
        <div className="flex items-center gap-3">
          {/* Discuss */}
          <button 
            onClick={handleDiscuss}
            className="flex items-center gap-2 bg-brand-primary/10 border border-brand-primary/20 text-brand-primary hover:bg-brand-primary hover:text-white px-3.5 py-2 rounded-xl text-xs font-bold transition-all duration-150"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Discuss</span>
          </button>
          
          {/* Cite trigger */}
          <div className="relative">
            <button 
              onClick={() => setShowCitationStyle(!showCitationStyle)}
              className="flex items-center gap-2 bg-[#102043]/60 border border-white/5 text-slate-300 hover:text-white hover:border-white/10 px-3.5 py-2 rounded-xl text-xs font-bold transition-all duration-150"
            >
              <Quote className="w-4 h-4 text-slate-400" />
              <span>Cite</span>
            </button>

            {/* Citation Formats Dropdown */}
            <AnimatePresence>
              {showCitationStyle && (
                <>
                  <div className="fixed inset-0 z-40 bg-transparent" onClick={() => setShowCitationStyle(false)} />
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 10 }}
                    className="absolute left-0 bottom-full mb-2.5 w-44 bg-[#102043] border border-white/10 rounded-2xl shadow-2xl p-2 z-50 flex flex-col gap-1 connect-glass"
                  >
                    <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest px-2.5 py-1.5 block border-b border-white/5 mb-1 text-left">Styles</span>
                    {['APA', 'MLA', 'Chicago', 'BibTeX'].map((style) => (
                      <button
                        key={style}
                        onClick={() => handleCopyCitation(style)}
                        className="text-left w-full text-xs font-semibold text-slate-300 hover:text-white hover:bg-white/[0.04] p-2 rounded-xl transition-all"
                      >
                        {style} format
                      </button>
                    ))}
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Action status notification popup */}
        <AnimatePresence>
          {cited && (
            <motion.div 
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 5 }}
              className="absolute bottom-16 right-6 bg-emerald-500/90 text-white text-[10px] font-bold py-1.5 px-3 rounded-xl shadow-2xl flex items-center gap-1.5 z-50"
            >
              <span>✓ Citation copied to clipboard!</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* View PDF */}
        <a 
          href={paper.pdf_url || '#'}
          download
          className="flex items-center gap-2 bg-[#102043]/60 border border-white/5 text-slate-300 hover:text-white hover:border-white/10 px-3.5 py-2 rounded-xl text-xs font-bold transition-all duration-150"
        >
          <Download className="w-4 h-4 text-slate-400" />
          <span>View PDF</span>
        </a>
      </div>

    </div>
  );
}
