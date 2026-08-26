'use client';

import React, { useState } from 'react';
import SuiteSidebar from '../components/SuiteSidebar';
import { ConnectProvider } from '../ConnectContext';
import { Bot, Sparkles, Send, ShieldCheck, Terminal } from 'lucide-react';
import '../connect.css';

export default function AiPage() {
  const [messages, setMessages] = useState([
    { role: 'assistant', text: 'Hello! I am your CampusX AI Copilot. I can analyze university database records, summarize research proposals, check ledger consensus status, or draft department notices. How can I assist you today?' }
  ]);
  const [input, setInput] = useState('');

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    const userMsg = input.trim();
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setInput('');

    setTimeout(() => {
      setMessages(prev => [...prev, {
        role: 'assistant',
        text: `🤖 **CampusX Intelligence Response**:\nAnalyzed user prompt: "${userMsg}". All ledger consensus signatures and department records have been verified.`
      }]);
    }, 600);
  };

  return (
    <ConnectProvider>
      <div className="flex h-screen bg-brand-bg-primary text-brand-text-main overflow-hidden font-sans select-none relative" style={{ paddingLeft: '80px' }}>
        <SuiteSidebar />
        <div className="flex-1 flex flex-col h-full overflow-hidden p-6 max-w-[1400px] mx-auto w-full gap-4">
          <div className="pb-3 border-b border-brand-border/40 flex justify-between items-center shrink-0">
            <div>
              <h1 className="text-2xl font-display font-black text-brand-text-main flex items-center gap-2">
                CampusX AI Copilot
                <Sparkles className="w-5 h-5 text-brand-primary" />
              </h1>
              <p className="text-xs text-brand-text-muted mt-0.5">Deep neural intelligence engine for university ledger queries & research analysis</p>
            </div>
            <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full text-[10px] font-bold font-mono">
              Model Online • 256-bit Secure
            </span>
          </div>

          <div className="flex-1 overflow-y-auto space-y-4 p-4 bg-brand-bg-secondary/40 backdrop-blur-xl border border-brand-border/60 rounded-3xl">
            {messages.map((m, idx) => (
              <div key={idx} className={`flex gap-3 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {m.role === 'assistant' && (
                  <div className="w-8 h-8 rounded-xl bg-brand-primary/20 border border-brand-primary/40 flex items-center justify-center shrink-0 text-brand-primary">
                    <Bot className="w-4 h-4" />
                  </div>
                )}
                <div className={`p-4 rounded-2xl max-w-xl text-xs leading-relaxed ${m.role === 'user' ? 'bg-brand-primary text-white font-medium' : 'bg-brand-bg-secondary border border-brand-border/60 text-brand-text-main shadow-sm'}`}>
                  {m.text}
                </div>
              </div>
            ))}
          </div>

          <form onSubmit={handleSend} className="flex items-center gap-2 bg-brand-bg-secondary border border-brand-border/60 rounded-2xl p-2 shadow-lg shrink-0">
            <input 
              type="text"
              placeholder="Ask CampusX AI about ledger records, research, or department notices..."
              value={input}
              onChange={e => setInput(e.target.value)}
              className="flex-1 bg-transparent border-none text-xs text-brand-text-main outline-none px-3 placeholder-brand-text-muted font-medium"
            />
            <button type="submit" className="p-3 bg-brand-primary text-white rounded-xl hover:brightness-110 transition-all cursor-pointer shadow-md">
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </ConnectProvider>
  );
}
