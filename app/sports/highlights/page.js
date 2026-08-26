'use client';

import React, { useState, useEffect } from 'react';
import { Video, Award, Clock, ArrowRight, Play, Download, Trash, RefreshCw } from 'lucide-react';

export default function HighlightsViewerPage() {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [highlights, setHighlights] = useState([]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const session = sessionStorage.getItem('campusx_erp_session');
      if (session) {
        setCurrentUser(JSON.parse(session));
      }
      fetchHighlights();
    }
  }, []);

  const fetchHighlights = async () => {
    try {
      const res = await fetch('/api/sports/highlights');
      const data = await res.json();
      setHighlights(data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching highlights:', err);
      setLoading(false);
    }
  };

  const handlePlayClip = (h) => {
    alert(`Streaming highlight clip from storage: ${h.clip_url || 'Mock Video Stream'}`);
  };

  if (loading) return null;

  return (
    <div className="flex flex-col gap-6 md:gap-8 fade-in text-white">
      {/* Page Title */}
      <div className="flex justify-between items-center pb-4 border-b border-brand-border/40">
        <div>
          <h1 className="text-3xl font-display font-bold tracking-tight flex items-center gap-3">
            <Video className="w-8 h-8 text-brand-primary" />
            AI Highlight Reels Library
          </h1>
          <p className="text-brand-text-muted text-sm mt-1">
            Automated event-triggered recordings and manual bookmarks anchored to the CampusX Notary Ledger.
          </p>
        </div>
        <button 
          onClick={fetchHighlights}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-brand-bg-secondary border border-brand-border hover:bg-brand-bg-tertiary rounded-lg text-xs font-semibold"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Refresh Library
        </button>
      </div>

      {/* Grid Library */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {highlights.length === 0 ? (
          <div className="col-span-3 card p-8 bg-brand-bg-secondary border border-brand-border rounded-2xl flex flex-col gap-2 items-center justify-center text-center text-brand-text-muted text-xs">
            <Video className="w-12 h-12 text-brand-text-muted mb-2 animate-pulse" />
            <span>No video clips or highlights generated in this session yet.</span>
            <span>Trigger highlights from the Performance Analytics console.</span>
          </div>
        ) : (
          highlights.map(h => (
            <div key={h.id} className="card bg-brand-bg-secondary border border-brand-border rounded-2xl overflow-hidden flex flex-col justify-between group">
              <div className="relative aspect-video w-full bg-brand-bg-tertiary/80 border-b border-brand-border/40 flex items-center justify-center group-hover:opacity-90 transition-all">
                <Play className="w-12 h-12 text-brand-primary opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all cursor-pointer" onClick={() => handlePlayClip(h)} />
                <span className="absolute bottom-2 right-2 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded font-mono text-[9px]">
                  {h.match_time}
                </span>
                <span className="absolute top-2 left-2 bg-brand-primary/10 border border-brand-primary/30 text-brand-primary px-2 py-0.5 rounded text-[8px] font-mono">
                  {h.event}
                </span>
              </div>
              <div className="p-4 flex flex-col gap-2 text-xs">
                <div className="flex justify-between items-start">
                  <span className="font-bold text-white text-sm">{h.event} Event Reel</span>
                  <span className="text-[9px] text-brand-text-muted">{h.system_time}</span>
                </div>
                <span className="text-brand-text-muted">Target classification player signature: <strong className="text-white font-medium">{h.player}</strong></span>
                {h.id.startsWith("bmark_") && (
                  <span className="text-[9px] text-brand-accent-emerald font-mono overflow-hidden truncate block max-w-xs mt-1">
                    Ledger Proof: 0xsports_hash_{h.id.replace("bmark_","")}
                  </span>
                )}
                
                <div className="flex justify-between gap-3 mt-3 border-t border-brand-border/40 pt-3">
                  <button 
                    onClick={() => handlePlayClip(h)}
                    className="flex items-center gap-1 text-[10px] text-brand-primary font-bold hover:underline"
                  >
                    Play Clip
                  </button>
                  <button 
                    onClick={() => alert(`Downloading clip to client: ${h.clip_url}`)}
                    className="flex items-center gap-1 text-[10px] text-brand-text-muted hover:text-white"
                  >
                    <Download className="w-3.5 h-3.5" /> Download
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
