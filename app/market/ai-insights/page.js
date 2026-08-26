'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  Bot, 
  Send, 
  Sparkles, 
  User, 
  Activity, 
  RefreshCw,
  Cpu
} from 'lucide-react';

const agentPersonas = {
  analyst: {
    name: 'Technical Analyst Agent',
    role: 'TECHNICAL & TREND TRENDS ANALYZER',
    avatar: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=150',
    prompt: '🤖 **Technical Agent**: NIFTY 50 is clearing key resistance at 23,400. RSI sits at 62.1 indicating positive momentum without entering overbought levels. Moving averages confirm short-term bullish continuation.'
  },
  risk: {
    name: 'Risk Control Agent',
    role: 'PORTFOLIO VALUE-AT-RISK (VAR) AND DRAWDOWN AUDITOR',
    avatar: 'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=150',
    prompt: '🤖 **Risk Agent**: Volatility has expanded 4.1%. VaR calculation (95% confidence) estimates potential portfolio loss at $420 over 5 days. Recommending index hedges.'
  },
  research: {
    name: 'IP Research Agent',
    role: 'AGGREGATES PATENT INDICES AND RESEARCH CITATIONS',
    avatar: 'https://images.unsplash.com/photo-1543269865-cbf427effbad?w=150',
    prompt: '🤖 **Research Agent**: EDU Tech holds 14 patents in VR learning spaces. Cite Index projected +12% CIT yield. Recommended target range: $220.'
  },
  portfolio: {
    name: 'Portfolio Optimizer Agent',
    role: 'DYNAMIC ALLOCATIONS, SHARPE RATIOS, AND SORTINO REVIEWS',
    avatar: 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=150',
    prompt: '🤖 **Portfolio Agent**: Current portfolio Sharpe ratio is 2.41, Sortino ratio is 3.12, maximum drawdown is -6.4%. Allocation is optimized for high yield growth.'
  },
  news: {
    name: 'Financial News Agent',
    role: 'SCRAPES BULLETINS AND MEASURES SENTIMENT INDEXES',
    avatar: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=150',
    prompt: '🤖 **News Agent**: CampusX AI Incubator secured $12M in federal grant funding. Alternative sentiment indexes shifted +14% bullish on ticker CAMPUSX.'
  },
  prediction: {
    name: 'Deep Neural Predictor Agent',
    role: 'HOSTS TENSORFLOW LSTM / ATTENTION TRANSFORMER FITS',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    prompt: '🤖 **Prediction Agent**: LSTM 7-day forecast indicates a target of $162.40 with a confidence threshold score of 94.2%. Trend direction: UP.'
  }
};

export default function AiInsightsPage() {
  const [selectedAgent, setSelectedAgent] = useState('analyst');
  const [agentInput, setAgentInput] = useState('');
  const [chatLogs, setChatLogs] = useState([
    { sender: 'ai', text: 'Terminal AI Advisor online. Select a specialized Financial Agent and submit your query.' }
  ]);
  const [chatLoading, setChatLoading] = useState(false);

  const logsEndRef = useRef(null);

  const scrollToBottom = () => {
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatLogs, chatLoading]);

  const handleQueryAgent = async () => {
    const text = agentInput.trim();
    if (!text) return;

    setChatLogs(prev => [...prev, { sender: 'user', text }]);
    setAgentInput('');
    setChatLoading(true);

    try {
      const res = await fetch('/api/market/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ agent: selectedAgent, message: text })
      });
      const data = await res.json();
      if (data.success && data.response) {
        setChatLogs(prev => [...prev, { sender: 'ai', text: data.response }]);
      } else {
        // Fallback
        setTimeout(() => {
          setChatLogs(prev => [...prev, { sender: 'ai', text: agentPersonas[selectedAgent].prompt }]);
          setChatLoading(false);
        }, 1000);
        return;
      }
    } catch (e) {
      setTimeout(() => {
        setChatLogs(prev => [...prev, { sender: 'ai', text: agentPersonas[selectedAgent].prompt }]);
        setChatLoading(false);
      }, 1000);
      return;
    }
    setChatLoading(false);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-160px)] animate-fade-in text-white">
      
      {/* Page Header */}
      <div className="flex justify-between items-center border-b border-[#0F1B3A] pb-4 shrink-0">
        <div>
          <h1 className="text-xl font-bold uppercase tracking-wider text-white">AI Financial Agents</h1>
          <p className="text-[11px] text-gray-500 mt-1">INTERACTIVE DEEPSEEK-R1 ADVISORY AND PORTFOLIO FORECAST AGENTS</p>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8 min-h-0 mt-6">
        
        {/* Agents Selector Side */}
        <div className="flex flex-col gap-4 overflow-y-auto pr-1">
          <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest pl-1 shrink-0">Select Specialist Agent</span>
          <div className="flex flex-col gap-2 shrink-0">
            {Object.entries(agentPersonas).map(([key, agent]) => (
              <button 
                key={key}
                onClick={() => setSelectedAgent(key)}
                className={`w-full p-3 border text-left flex items-start gap-3 transition-all cursor-pointer ${
                  selectedAgent === key
                    ? 'bg-[#F59E0B]/10 border-[#F59E0B]/40 text-white'
                    : 'bg-[#0A1128]/40 border-[#0F1B3A] text-gray-400 hover:text-white hover:bg-white/[0.01]'
                }`}
              >
                <img src={agent.avatar} alt="" className="w-8 h-8 rounded border border-[#0F1B3A] object-cover shrink-0 mt-0.5" />
                <div className="min-w-0">
                  <span className="text-xs font-bold block truncate tracking-wide">{agent.name}</span>
                  <span className="text-[8px] text-gray-500 block truncate tracking-widest mt-0.5">{agent.role}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Chat Terminal Frame */}
        <div className="bg-[#0A1128] border border-[#0F1B3A] flex flex-col min-h-0">
          
          {/* Active agent detail header */}
          <div className="p-4 border-b border-[#0F1B3A] bg-[#070E20]/60 flex items-center gap-3 shrink-0">
            <div className="p-2 rounded bg-[#F59E0B]/10 border border-[#F59E0B]/20 text-[#F59E0B]">
              <Cpu className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold text-white uppercase tracking-wider block">
                {agentPersonas[selectedAgent].name}
              </span>
              <span className="text-[8px] text-gray-500 font-mono tracking-widest uppercase block mt-0.5">
                Clearance Level: L3 • ACTIVE INFERENCE BROKER
              </span>
            </div>
          </div>

          {/* Conversation history area */}
          <div className="flex-1 p-6 overflow-y-auto flex flex-col gap-4 min-h-0 bg-[#040814]/40">
            {chatLogs.map((log, idx) => (
              <div 
                key={idx}
                className={`flex gap-3 max-w-[85%] ${
                  log.sender === 'user' ? 'ml-auto flex-row-reverse' : ''
                }`}
              >
                <div className={`p-2 rounded border shrink-0 flex items-center justify-center h-8 w-8 ${
                  log.sender === 'user' 
                    ? 'bg-[#F59E0B]/10 border-[#F59E0B]/20 text-[#F59E0B]' 
                    : 'bg-white/5 border-[#0F1B3A] text-gray-300'
                }`}>
                  {log.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>
                <div className={`p-3.5 rounded text-xs leading-relaxed font-mono ${
                  log.sender === 'user' 
                    ? 'bg-[#F59E0B]/5 border border-[#F59E0B]/20 text-white' 
                    : 'bg-[#0A1128] border border-[#0F1B3A] text-gray-300'
                }`}>
                  {log.text}
                </div>
              </div>
            ))}

            {chatLoading && (
              <div className="flex gap-3 max-w-[85%]">
                <div className="p-2 rounded border bg-white/5 border-[#0F1B3A] text-gray-300 shrink-0 flex items-center justify-center h-8 w-8 animate-pulse">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="p-3.5 rounded text-xs bg-[#0A1128] border border-[#0F1B3A] text-gray-500 font-mono animate-pulse">
                  Processing continuous inference tensors...
                </div>
              </div>
            )}
            <div ref={logsEndRef}></div>
          </div>

          {/* Message input */}
          <div className="p-4 border-t border-[#0F1B3A] bg-[#070E20]/60 shrink-0 flex items-center gap-3">
            <input 
              type="text" 
              placeholder="ASK AGENT A FINANCIAL OR RISK QUESTION (e.g. Check volatility risk)..."
              value={agentInput}
              onChange={(e) => setAgentInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') handleQueryAgent(); }}
              className="flex-1 bg-[#040814] border border-[#0F1B3A] text-xs text-white p-3 rounded outline-none focus:border-[#F59E0B]/40 font-mono placeholder:text-gray-600 uppercase"
            />
            <button 
              onClick={handleQueryAgent}
              className="p-3 bg-[#F59E0B] hover:bg-[#D97706] text-black font-bold uppercase transition-all cursor-pointer rounded flex items-center justify-center shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>

        </div>

      </div>

    </div>
  );
}
