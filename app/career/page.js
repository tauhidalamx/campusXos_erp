'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Briefcase, 
  ArrowLeft, 
  Sparkles, 
  ChevronRight, 
  Code, 
  Compass, 
  Cpu, 
  CheckSquare, 
  Plus, 
  FileText, 
  Send,
  MessageSquare,
  Award
} from 'lucide-react';

export default function CareerPage() {
  // Resume state
  const [resume, setResume] = useState({
    name: 'Aria Nakamura',
    education: 'B.Tech in Computer Science',
    skills: 'React, Node.js, Python, TensorFlow, Solidity',
    experience: 'Software Engineering Intern at CampusX Labs'
  });

  const [careerType, setCareerType] = useState('CS'); // CS, Engineering, Finance
  const [skillsMatrix, setSkillsMatrix] = useState([
    { skill: 'React / Next.js', current: 90, required: 85, status: 'Matching' },
    { skill: 'Solidity / SBT Smart Contracts', current: 75, required: 90, status: 'Gap Identified' },
    { skill: 'Python / ML Modeling', current: 80, required: 80, status: 'Matching' },
    { skill: 'System Design & Scalability', current: 60, required: 85, status: 'Gap Identified' }
  ]);

  // AI Career recommendations based on toggle
  const getCareerRecommendations = () => {
    if (careerType === 'CS') {
      return [
        { role: 'AI Applications Engineer', path: 'Computer Science -> Neural Network Inference -> Next.js integration', confidence: '94%' },
        { role: 'Blockchain Core Protocol Architect', path: 'Computer Science -> Soulbound Token Structuring -> Solidity Contracts', confidence: '88%' }
      ];
    } else if (careerType === 'Engineering') {
      return [
        { role: 'IoT Systems Automation Engineer', path: 'Robotics Engineering -> RFID Sensor Array -> Hardware Node Sync', confidence: '91%' },
        { role: 'HVAC Smart Grid Modeler', path: 'Electrical Engineering -> Campus Twin Telemetry -> HVAC Control Sliders', confidence: '82%' }
      ];
    } else {
      return [
        { role: 'Consortium Finance Controller', path: 'Business Admin -> Ledger Accounting -> Escrow Release Contracts', confidence: '87%' },
        { role: 'Quantitative Risk Analyst', path: 'Applied Mathematics -> Transaction Logs Analysis -> TensorFlow Inference', confidence: '85%' }
      ];
    }
  };

  // Mock Interview Drawer States
  const [showInterview, setShowInterview] = useState(false);
  const [chatLogs, setChatLogs] = useState([
    { sender: 'interviewer', text: 'Welcome Aria. Let\'s begin. Can you explain the difference between a Soulbound Token (SBT) and a standard ERC-721 NFT in a decentralized identity system?' }
  ]);
  const [studentReply, setStudentReply] = useState('');
  const [interviewLoading, setInterviewLoading] = useState(false);

  const handleSendReply = (e) => {
    e.preventDefault();
    if (!studentReply.trim()) return;

    setChatLogs(prev => [...prev, { sender: 'student', text: studentReply }]);
    const reply = studentReply;
    setStudentReply('');
    setInterviewLoading(true);

    setTimeout(() => {
      let aiFeedback = '';
      if (reply.toLowerCase().includes('soulbound') || reply.toLowerCase().includes('transfer') || reply.toLowerCase().includes('non-transferable')) {
        aiFeedback = 'Excellent answer! You correctly highlighted that Soulbound Tokens are non-transferable and permanently bound to a specific DID wallet, unlike standard ERC-721 NFTs which can be traded on open marketplaces.';
      } else {
        aiFeedback = 'Good attempt. However, be sure to emphasize that Soulbound Tokens are non-transferable, making them ideal for credential verification, whereas standard NFTs can be bought and sold freely.';
      }

      setChatLogs(prev => [
        ...prev,
        { sender: 'interviewer', text: aiFeedback + ' Next question: how do you optimize a Next.js application for fast load times?' }
      ]);
      setInterviewLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#071126] text-white p-6 font-sans relative overflow-hidden">
      {/* Top Banner Navigation */}
      <div className="max-w-7xl mx-auto flex items-center justify-between mb-8 pb-4 border-b border-[#102043]">
        <div className="flex items-center gap-3">
          <Link href="/" className="p-2 bg-[#102043] rounded-xl hover:bg-[#1a2e5d] transition-all text-indigo-400">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-white via-indigo-200 to-indigo-400 bg-clip-text text-transparent">
              CAMPUSX Career Pathfinder Desk
            </h1>
            <p className="text-xs text-slate-400">AI Resume Diagnostics, Skills Gap Assessment & Live Interview Simulator</p>
          </div>
        </div>

        <button
          onClick={() => setShowInterview(true)}
          className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all cursor-pointer shadow-md"
        >
          <MessageSquare className="w-4 h-4" /> Start Interview Prep
        </button>
      </div>

      {/* Main Grid Workdesk */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column - Resume builder & Skills tracker */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          
          {/* Resume builder */}
          <div className="p-6 bg-[#0B1736] border border-[#102043] rounded-3xl flex flex-col gap-4 text-left">
            <span className="text-xs font-bold text-white uppercase tracking-wider font-mono flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-indigo-400" /> Professional Credentials Roster
            </span>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="flex flex-col gap-1.5">
                <label className="text-[9px] uppercase font-bold text-slate-400">Full Name</label>
                <input
                  type="text"
                  value={resume.name}
                  onChange={(e) => setResume({ ...resume, name: e.target.value })}
                  className="bg-[#102043] border border-[#1a2e5d] rounded-xl p-2.5 text-white outline-none focus:border-indigo-500"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[9px] uppercase font-bold text-slate-400">Academic Background</label>
                <input
                  type="text"
                  value={resume.education}
                  onChange={(e) => setResume({ ...resume, education: e.target.value })}
                  className="bg-[#102043] border border-[#1a2e5d] rounded-xl p-2.5 text-white outline-none focus:border-indigo-500"
                />
              </div>
              <div className="md:col-span-2 flex flex-col gap-1.5">
                <label className="text-[9px] uppercase font-bold text-slate-400">Skills Matrix</label>
                <input
                  type="text"
                  value={resume.skills}
                  onChange={(e) => setResume({ ...resume, skills: e.target.value })}
                  className="bg-[#102043] border border-[#1a2e5d] rounded-xl p-2.5 text-white outline-none focus:border-indigo-500"
                />
              </div>
              <div className="md:col-span-2 flex flex-col gap-1.5">
                <label className="text-[9px] uppercase font-bold text-slate-400">Internship/Work Experience</label>
                <textarea
                  value={resume.experience}
                  onChange={(e) => setResume({ ...resume, experience: e.target.value })}
                  className="bg-[#102043] border border-[#1a2e5d] rounded-xl p-2.5 text-white outline-none focus:border-indigo-500 h-20 resize-none"
                />
              </div>
            </div>
          </div>

          {/* Skills Gap Tracker */}
          <div className="p-6 bg-[#0B1736] border border-[#102043] rounded-3xl flex flex-col gap-4 text-left">
            <span className="text-xs font-bold text-white uppercase tracking-wider font-mono">Market Demand Skills Gap Analyzer</span>
            <div className="flex flex-col gap-3">
              {skillsMatrix.map((item, idx) => (
                <div key={idx} className="p-3.5 bg-black/30 border border-[#102043] rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
                  <div className="text-left min-w-[150px]">
                    <span className="font-bold text-slate-200">{item.skill}</span>
                  </div>
                  <div className="flex-1 flex gap-4 items-center">
                    <div className="flex-1">
                      <div className="flex justify-between text-[8px] text-slate-500 mb-1 font-mono">
                        <span>Current: {item.current}%</span>
                        <span>Required: {item.required}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-[#102043] rounded-full overflow-hidden relative">
                        <div className="absolute top-0 bottom-0 left-0 bg-indigo-500 rounded-full transition-all" style={{ width: `${item.current}%` }}></div>
                        <div className="absolute top-0 bottom-0 w-0.5 bg-rose-500" style={{ left: `${item.required}%` }}></div>
                      </div>
                    </div>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[8px] font-bold border uppercase text-center min-w-[100px] shrink-0 ${
                    item.status === 'Matching' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border-rose-500/20 animate-pulse'
                  }`}>
                    {item.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column - Career Recommendations */}
        <div className="flex flex-col gap-6 text-left">
          
          {/* AI Career Path Recommender */}
          <div className="p-6 bg-[#0B1736] border border-[#102043] rounded-3xl flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-[#102043] pb-3">
              <span className="text-xs font-bold text-white uppercase tracking-wider font-mono">AI Pathway Guidance</span>
              <Sparkles className="w-4.5 h-4.5 text-indigo-400" />
            </div>

            <div className="flex gap-2">
              {['CS', 'Engineering', 'Finance'].map((type) => (
                <button
                  key={type}
                  onClick={() => setCareerType(type)}
                  className={`flex-1 py-1.5 rounded-xl text-[10px] font-bold tracking-wider uppercase border transition-all cursor-pointer ${
                    careerType === type
                      ? 'bg-indigo-500/20 text-indigo-400 border-indigo-500/50 shadow-sm'
                      : 'bg-black/10 border-[#102043] text-slate-500 hover:text-slate-300'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>

            <div className="flex flex-col gap-3">
              {getCareerRecommendations().map((rec, idx) => (
                <div key={idx} className="p-4 bg-black/30 border border-[#102043] rounded-2xl flex flex-col gap-2 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-white leading-tight">{rec.role}</span>
                    <span className="text-[9px] px-1.5 bg-indigo-500/20 text-indigo-400 rounded-full font-mono">{rec.confidence} Match</span>
                  </div>
                  <p className="text-[10px] text-slate-400 leading-relaxed bg-[#102043]/30 p-2 rounded-xl border border-[#102043] font-mono">
                    {rec.path}
                  </p>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

      {/* Mock Interview Drawer Overlay */}
      {showInterview && (
        <div className="fixed inset-y-0 right-0 w-[420px] bg-[#0B1736] border-l border-[#102043] shadow-2xl z-[1000] flex flex-col justify-between animate-slide-in">
          
          {/* Drawer Header */}
          <div className="p-4 border-b border-[#102043] flex items-center justify-between bg-black/20">
            <div className="flex items-center gap-2 text-left">
              <div className="p-1.5 bg-indigo-500/20 text-indigo-400 rounded-lg">
                <Cpu className="w-5 h-5 text-indigo-400" />
              </div>
              <div>
                <h3 className="font-display font-bold text-sm text-white">AI Interview Prep Agent</h3>
                <span className="text-[10px] text-slate-500">Live Diagnostics Interview Drawer</span>
              </div>
            </div>
            <button 
              onClick={() => setShowInterview(false)}
              className="p-1.5 hover:bg-white/[0.04] text-slate-400 hover:text-white rounded-lg cursor-pointer bg-transparent border-none outline-none"
            >
              <XIcon className="w-4 h-4" />
            </button>
          </div>

          {/* Chat Logs Screen */}
          <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-3.5 bg-black/10">
            {chatLogs.map((log, idx) => (
              <div 
                key={idx} 
                className={`flex flex-col max-w-[85%] text-xs p-3 rounded-2xl ${
                  log.sender === 'interviewer'
                    ? 'bg-[#102043] border border-[#1a2e5d] text-slate-200 self-start rounded-bl-none text-left'
                    : 'bg-indigo-600 text-white self-end rounded-br-none text-left'
                }`}
              >
                <span className="text-[9px] uppercase tracking-wider font-bold text-slate-400 mb-1 font-mono">
                  {log.sender === 'interviewer' ? 'AI Recruiter Interviewer' : 'Aria Nakamura'}
                </span>
                <p className="leading-relaxed font-medium">{log.text}</p>
              </div>
            ))}
            
            {interviewLoading && (
              <div className="bg-[#102043] border border-[#1a2e5d] rounded-2xl rounded-bl-none p-3 text-xs self-start flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce"></span>
                <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce [animation-delay:0.4s]"></span>
              </div>
            )}
          </div>

          {/* Input Chat Area */}
          <form 
            onSubmit={handleSendReply}
            className="p-3 border-t border-[#102043] bg-black/20 flex gap-2 items-center"
          >
            <input 
              type="text" 
              placeholder="Type your response answer..."
              value={studentReply}
              onChange={(e) => setStudentReply(e.target.value)}
              className="flex-1 bg-[#102043] border border-[#1a2e5d] rounded-xl text-xs text-white placeholder-slate-500 p-2.5 outline-none focus:border-indigo-500 font-semibold"
            />
            <button 
              type="submit"
              className="p-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl cursor-pointer transition-colors"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>

        </div>
      )}

    </div>
  );
}

// Small X icon helper
function XIcon(props) {
  return (
    <svg 
      className={props.className} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}
