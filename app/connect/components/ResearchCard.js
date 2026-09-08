'use client';

import React from 'react';
import { useConnect } from '../ConnectContext';
import { 
  FileText, 
  Bookmark, 
  Download, 
  Quote, 
  Award
} from 'lucide-react';

export default function ResearchCard({ paper }) {
  const { 
    handleSavePost, 
    savedPostIds
  } = useConnect();

  const isSaved = savedPostIds.has(paper.id);

  return (
    <div 
      className="w-full min-w-0 bg-white border border-slate-200/90 rounded-3xl overflow-hidden flex flex-col transition-all duration-200 hover:border-slate-300 shadow-xs"
    >
      {/* Header */}
      <div className="p-6 pb-4 flex justify-between items-start border-b border-slate-100 gap-3 min-w-0">
        <div className="flex gap-4 items-start min-w-0 flex-1">
          <div className="p-3 bg-indigo-50 text-indigo-700 rounded-2xl shrink-0">
            <FileText className="w-6 h-6" />
          </div>
          <div className="flex flex-col text-left min-w-0 flex-1">
            <span className="text-[10px] font-extrabold text-indigo-600 uppercase tracking-wider">
              Peer-Reviewed Publication
            </span>
            <h3 className="text-base font-bold text-slate-900 mt-1 leading-snug break-words">
              {paper.title || 'Architecting Decentralized Consensus for University Ledgers'}
            </h3>
            <p className="text-xs text-slate-500 mt-1.5 font-medium break-words">
              Authors: <span className="text-slate-700">{paper.authors?.join(', ') || 'Dr. Evelyn Sterling, Prof. Alan Turing'}</span>
            </p>
          </div>
        </div>
        
        {/* Saved Pin */}
        <button 
          onClick={() => handleSavePost(paper.id)}
          className={`p-2 rounded-xl transition-all cursor-pointer shrink-0 ${
            isSaved 
              ? 'text-amber-600 bg-amber-50' 
              : 'text-slate-400 hover:text-amber-600 hover:bg-slate-50'
          }`}
          title={isSaved ? "Saved" : "Save Paper"}
        >
          <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
        </button>
      </div>

      {/* Metrics */}
      <div className="p-4 px-6 flex items-center justify-between border-t border-slate-100 bg-slate-50/50 flex-wrap gap-4 min-w-0">
        <div className="flex items-center gap-2 min-w-0">
          <Quote className="w-4 h-4 text-indigo-600 shrink-0" />
          <span className="text-xs font-bold text-slate-800">{paper.citations_count || 128} Citations</span>
        </div>

        <div className="flex items-center gap-2 min-w-0">
          <Download className="w-4 h-4 text-indigo-600 shrink-0" />
          <span className="text-xs font-bold text-slate-800">{paper.downloads_count || 1042} Downloads</span>
        </div>

        <div className="flex items-center gap-2 min-w-0">
          <Award className="w-4 h-4 text-emerald-600 shrink-0" />
          <span className="text-xs font-bold text-emerald-700">{paper.impact_score || 94}/100 Impact</span>
        </div>

        <a 
          href={paper.pdf_url || '#'}
          download
          className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shadow-xs shrink-0"
        >
          <Download className="w-3.5 h-3.5 text-white shrink-0" />
          <span>View PDF</span>
        </a>
      </div>

    </div>
  );
}
