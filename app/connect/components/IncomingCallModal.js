'use client';

import React from 'react';
import { useConnect } from '../ConnectContext';
import { Video, PhoneCall, PhoneOff, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function IncomingCallModal() {
  const { incomingCall, acceptIncomingCall, declineIncomingCall } = useConnect();

  if (!incomingCall) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[500] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs select-none">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.15 }}
          className="w-full max-w-sm bg-white border-2 border-slate-900 shadow-[6px_6px_0px_0px_#0f172a] rounded-none p-6 text-center relative overflow-hidden flex flex-col items-center"
        >
          {/* Cubic Header Band */}
          <div className="w-full pb-3 mb-4 border-b-2 border-slate-900 flex items-center justify-between">
            <span className="text-xs font-mono font-black uppercase tracking-wider text-slate-900">
              Incoming WebRTC Stream
            </span>
            <span className="px-2 py-0.5 border border-slate-900 bg-emerald-100 text-emerald-900 font-mono text-[9px] font-bold uppercase animate-pulse">
              Live Ringing
            </span>
          </div>

          {/* Caller Avatar with Cubic Frame */}
          <div className="relative my-2">
            <div className="w-24 h-24 rounded-none border-2 border-slate-900 shadow-[4px_4px_0px_0px_#0f172a] overflow-hidden bg-slate-100">
              <img
                src={incomingCall.callerAvatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150'}
                alt={incomingCall.callerName}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Caller Info */}
          <h3 className="text-base font-mono font-black uppercase tracking-wide text-slate-900 mt-3 truncate max-w-full">
            {incomingCall.callerName || 'Campus Peer'}
          </h3>
          <p className="text-[11px] text-slate-500 font-mono mt-1 flex items-center justify-center gap-1.5 font-semibold">
            <Video className="w-3.5 h-3.5 text-emerald-600 animate-pulse shrink-0" />
            <span>P2P Direct Video Stream</span>
          </p>

          <div className="mt-3 px-3 py-1.5 bg-slate-50 border border-slate-900 rounded-none flex items-center gap-1.5 text-[10.5px] font-mono text-slate-700 font-bold">
            <ShieldCheck className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
            <span>256-bit Hardware Encrypted</span>
          </div>

          {/* Action Buttons: Accept & Decline in Cubic Style */}
          <div className="grid grid-cols-2 gap-3 mt-6 w-full">
            {/* Decline */}
            <button
              onClick={declineIncomingCall}
              className="py-2.5 px-3 bg-white hover:bg-rose-50 text-rose-600 font-mono uppercase tracking-wider text-xs font-black rounded-none border-2 border-slate-900 shadow-[3px_3px_0px_0px_#0f172a] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-transform flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <PhoneOff className="w-4 h-4 shrink-0" />
              <span>Decline</span>
            </button>

            {/* Accept */}
            <button
              onClick={acceptIncomingCall}
              className="py-2.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white font-mono uppercase tracking-wider text-xs font-black rounded-none border-2 border-slate-900 shadow-[3px_3px_0px_0px_#0f172a] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-transform flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <PhoneCall className="w-4 h-4 shrink-0" />
              <span>Accept</span>
            </button>
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
}

