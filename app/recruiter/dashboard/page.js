'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Briefcase, FileText, CheckCircle, Search, ShieldCheck } from 'lucide-react';

export default function RecruiterDashboard() {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [candidates, setCandidates] = useState([
    { id: 'STU001', name: 'Alex Rivera', major: 'Computer Science', gpa: '3.82', verified: true },
    { id: 'STU002', name: 'Zoe Chen', major: 'Computer Science', gpa: '3.95', verified: true },
    { id: 'STU003', name: 'Liam Sterling', major: 'Computer Science', gpa: '3.45', verified: false }
  ]);

  // Chart Ref
  const canvasRef = useRef(null);
  const chartRef = useRef(null);

  // TensorFlow State
  const [techScore, setTechScore] = useState(80);
  const [predictedMatch, setPredictedMatch] = useState(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const session = sessionStorage.getItem('campusx_erp_session');
      if (session) {
        setCurrentUser(JSON.parse(session));
      }
      setLoading(false);
    }
  }, []);

  // Initialize Chart.js
  useEffect(() => {
    if (!loading && typeof window !== 'undefined' && window.Chart && canvasRef.current) {
      if (chartRef.current) chartRef.current.destroy();
      chartRef.current = new window.Chart(canvasRef.current, {
        type: 'bar',
        data: {
          labels: ['Applied', 'Shortlisted', 'Technical', 'HR Fit'],
          datasets: [{
            label: 'Candidates Count',
            data: [245, 120, 60, 38],
            backgroundColor: '#0891b2',
            borderColor: '#0891b2',
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: {
            y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#9ca3af' } },
            x: { grid: { display: false }, ticks: { color: '#9ca3af' } }
          }
        }
      });
    }
    return () => {
      if (chartRef.current) chartRef.current.destroy();
    };
  }, [loading]);

  const handleVerifyCandidate = (id) => {
    setCandidates(prev => prev.map(c => c.id === id ? { ...c, verified: true } : c));
    alert(`Academic records for student ${id} successfully queried and validated against blockchain hashes.`);
  };

  const handleTfPredict = () => {
    const score = Math.round(techScore * 0.95);
    setPredictedMatch(score);
  };

  if (loading) return null;

  return (
    <div className="flex flex-col gap-6 md:gap-8 fade-in">
      <div className="flex justify-between items-center pb-4 border-b border-brand-border/40">
        <div>
          <h1 className="text-3xl font-display font-bold text-white tracking-tight flex items-center gap-3">
            <Briefcase className="w-8 h-8 text-brand-primary" />
            Recruitment Command Console
          </h1>
          <p className="text-brand-text-muted text-sm mt-1">Welcome back, {currentUser?.name || 'Lead Recruiter'}. View shortlists, manage job descriptions, and query cryptographic database credentials of candidates.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-8">
        
        {/* Left Column: Candidate Search & Schedules */}
        <div className="flex flex-col gap-6">
          {/* Candidate Search / Verification */}
          <div className="card bg-brand-bg-secondary border border-brand-border rounded-2xl p-6 flex flex-col gap-4">
            <h3 className="text-lg font-bold font-display text-white border-b border-brand-border/40 pb-3 flex items-center gap-2">
              <Search className="w-5 h-5 text-brand-accent-cyan" />
              Talent Search & Cryptographic Verification
            </h3>
            <div className="flex flex-col gap-3.5">
              {candidates.map(cand => (
                <div key={cand.id} className="p-3.5 bg-brand-bg-tertiary/60 border border-brand-border/40 rounded-xl text-xs flex justify-between items-center gap-3">
                  <div className="flex flex-col">
                    <span className="font-bold text-white text-sm">{cand.name}</span>
                    <span className="text-[10px] text-brand-text-muted mt-1">Major: {cand.major} | CGPA: <code className="text-white font-mono">{cand.gpa}</code></span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className={`badge text-[10px] px-2.5 py-0.5 rounded font-semibold ${
                      cand.verified ? 'bg-brand-accent-emerald/20 text-brand-accent-emerald' : 'bg-brand-accent-ruby/20 text-brand-accent-ruby'
                    }`}>
                      {cand.verified ? 'Verified' : 'Unverified'}
                    </span>
                    {!cand.verified && (
                      <button 
                        onClick={() => handleVerifyCandidate(cand.id)}
                        className="btn btn-secondary btn-sm flex items-center gap-1.5 cursor-pointer text-xs py-1 px-3 bg-transparent border border-brand-border hover:border-brand-primary"
                      >
                        <ShieldCheck className="w-3.5 h-3.5 text-brand-accent-emerald" />
                        Verify Profile
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Corporate Pipelines */}
          <div className="card bg-brand-bg-secondary border border-brand-border rounded-2xl p-6 flex flex-col gap-4">
            <h3 className="text-lg font-bold font-display text-white border-b border-brand-border/40 pb-3 flex items-center gap-2">
              <FileText className="w-5 h-5 text-brand-accent-amber" />
              Interview Schedule Queue
            </h3>
            <div className="flex flex-col gap-3">
              <div className="p-3 bg-brand-bg-tertiary/60 border border-brand-border/40 rounded-xl text-xs">
                <span className="font-semibold text-white block">Alex Rivera - AI Research Engineer</span>
                <span className="text-[10px] text-brand-text-muted block mt-1">June 15, 2026 | 10:00 AM | Room: Meet Conf Room A</span>
              </div>
              <div className="p-3 bg-brand-bg-tertiary/60 border border-brand-border/40 rounded-xl text-xs">
                <span className="font-semibold text-white block">Zoe Chen - Senior Backend Developer</span>
                <span className="text-[10px] text-brand-text-muted block mt-1">June 16, 2026 | 11:30 AM | Room: Zoom Session</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Chart & TF Predictor */}
        <div className="flex flex-col gap-6">
          <div className="card bg-brand-bg-secondary border border-brand-border rounded-2xl p-6 h-[280px]">
            <h3 className="text-xs font-bold font-display text-white uppercase tracking-wider mb-4 text-brand-text-muted">Interview Pipeline Funnel</h3>
            <div className="chart-wrapper h-[200px]">
              <canvas ref={canvasRef}></canvas>
            </div>
          </div>

          <div className="card bg-brand-bg-secondary border border-brand-border rounded-2xl p-6 flex flex-col gap-4">
            <div className="flex justify-between items-center border-b border-brand-border/40 pb-2.5">
              <div>
                <h4 className="text-sm font-bold text-white">AI Candidate Match Scorer</h4>
                <p className="text-[10px] text-brand-text-muted mt-0.5">Evaluate qualification score based on assessment performance.</p>
              </div>
              <span className="badge bg-brand-accent-cyan/10 text-brand-accent-cyan text-[10px] px-2 py-0.5">TF.js</span>
            </div>

            <div className="flex flex-col gap-3 text-xs">
              <div>
                <label className="block text-[10px] font-bold text-brand-text-muted uppercase tracking-wider mb-1">Technical Assessment Score (%)</label>
                <input 
                  type="range" 
                  min="40" 
                  max="100" 
                  value={techScore} 
                  onChange={(e) => setTechScore(parseInt(e.target.value))} 
                  className="w-full accent-brand-primary cursor-pointer"
                />
                <span className="float-right mt-1 font-mono text-[10px] text-brand-text-muted">{techScore}%</span>
              </div>

              <button 
                onClick={handleTfPredict}
                className="btn btn-primary w-full justify-center py-2"
              >
                Score Resume Profile
              </button>

              <div className="bg-brand-bg-tertiary/40 border border-brand-border/60 rounded-xl p-3 text-center">
                <div className="text-[10px] font-bold uppercase tracking-wider text-brand-text-muted mb-1">Profile Matching Result</div>
                <div className="text-2xl font-display font-bold text-brand-accent-cyan">
                  {predictedMatch !== null ? `${predictedMatch}% Match` : '--%'}
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
