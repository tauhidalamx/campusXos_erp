'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Award, Briefcase, Share2, Wallet, Users } from 'lucide-react';

export default function AlumniHomeDashboard() {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [jobs, setJobs] = useState([
    { title: 'AI Engineering Specialist', company: 'Google Inc.', location: 'Mountain View, CA', salary: '$180,000' },
    { title: 'Protocol Security Lead', company: 'Chainlink Labs', location: 'Remote', salary: '$160,000' }
  ]);

  // Chart Ref
  const canvasRef = useRef(null);
  const chartRef = useRef(null);

  // TensorFlow State
  const [frequency, setFrequency] = useState(3);
  const [predictedScore, setPredictedScore] = useState(null);

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
        type: 'pie',
        data: {
          labels: ['Technology', 'Finance', 'Healthcare', 'Research', 'Academic'],
          datasets: [{
            data: [55, 20, 10, 10, 5],
            backgroundColor: ['#6366f1', '#06b6d4', '#10b981', '#f59e0b', '#ef4444']
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { position: 'right', labels: { color: '#9ca3af' } } }
        }
      });
    }
    return () => {
      if (chartRef.current) chartRef.current.destroy();
    };
  }, [loading]);

  const handleShareCredentials = () => {
    alert('Cryptographic degree wallet verification link copied. Share this hash proof with recruiters for zero-knowledge validation.');
  };

  const handleTfPredict = () => {
    const score = Math.round(40 + (frequency / 10) * 55);
    setPredictedScore(score);
  };

  if (loading) return null;

  return (
    <div className="flex flex-col gap-6 md:gap-8 fade-in">
      <div className="flex justify-between items-center pb-4 border-b border-brand-border/40">
        <div>
          <h1 className="text-3xl font-display font-bold text-white tracking-tight flex items-center gap-3">
            <Users className="w-8 h-8 text-brand-primary" />
            Alumni Relations Portal
          </h1>
          <p className="text-brand-text-muted text-sm mt-1">Welcome back, {currentUser?.name || 'Alumni Member'}. Manage your academic credential wallet, connect with graduates, and check corporate openings.</p>
        </div>
        <button onClick={handleShareCredentials} className="btn btn-primary btn-sm flex items-center gap-1.5 cursor-pointer">
          <Share2 className="w-4 h-4" />
          Share Degree Proof
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card p-5 bg-brand-bg-secondary border border-brand-border rounded-2xl flex items-center justify-between">
          <div>
            <span className="text-brand-text-muted text-xs font-semibold">Academic Credentials Verified</span>
            <span className="block text-2xl font-bold font-display text-white mt-1">2 Degrees</span>
            <span className="text-[10px] text-brand-accent-emerald mt-1 block">✓ Fully anchored on chain</span>
          </div>
          <div className="p-3 bg-brand-accent-emerald/10 rounded-xl text-brand-accent-emerald">
            <Award className="w-6 h-6" />
          </div>
        </div>

        <div className="card p-5 bg-brand-bg-secondary border border-brand-border rounded-2xl flex items-center justify-between">
          <div>
            <span className="text-brand-text-muted text-xs font-semibold">Alumni Wallet Balance</span>
            <span className="block text-2xl font-bold font-display text-white mt-1">120.0 AGC</span>
            <span className="text-[10px] text-brand-accent-cyan mt-1 block">Acquired on-chain points</span>
          </div>
          <div className="p-3 bg-brand-accent-cyan/10 rounded-xl text-brand-accent-cyan">
            <Wallet className="w-6 h-6" />
          </div>
        </div>

        <div className="card p-5 bg-brand-bg-secondary border border-brand-border rounded-2xl flex items-center justify-between">
          <div>
            <span className="text-brand-text-muted text-xs font-semibold">Active Referrals</span>
            <span className="block text-2xl font-bold font-display text-white mt-1">4 Offers</span>
            <span className="text-[10px] text-brand-accent-emerald mt-1 block">Forwarded to placement cells</span>
          </div>
          <div className="p-3 bg-brand-primary/10 rounded-xl text-brand-primary">
            <Briefcase className="w-6 h-6" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-8">
        {/* Left Column: Jobs List */}
        <div className="card bg-brand-bg-secondary border border-brand-border rounded-2xl p-6 flex flex-col gap-4">
          <h3 className="text-lg font-bold font-display text-white border-b border-brand-border/40 pb-3 flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-brand-accent-cyan" />
            Alumni Recommended Jobs & Hiring Opportunities
          </h3>
          <div className="flex flex-col gap-3.5">
            {jobs.map((job, idx) => (
              <div key={idx} className="p-4 bg-brand-bg-tertiary/60 border border-brand-border/40 rounded-2xl text-xs flex justify-between items-center">
                <div className="flex flex-col gap-1">
                  <span className="font-bold text-white text-sm">{job.title}</span>
                  <span className="text-brand-text-muted">Company: <strong className="text-white font-medium">{job.company}</strong> | Location: {job.location}</span>
                </div>
                <span className="font-mono text-brand-accent-cyan font-bold shrink-0">{job.salary}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Chart & TF Predictor */}
        <div className="flex flex-col gap-6">
          <div className="card bg-brand-bg-secondary border border-brand-border rounded-2xl p-6 h-[280px]">
            <h3 className="text-xs font-bold font-display text-white uppercase tracking-wider mb-4 text-brand-text-muted">Placement Sector Split</h3>
            <div className="chart-wrapper h-[200px]">
              <canvas ref={canvasRef}></canvas>
            </div>
          </div>

          <div className="card bg-brand-bg-secondary border border-brand-border rounded-2xl p-6 flex flex-col gap-4">
            <div className="flex justify-between items-center border-b border-brand-border/40 pb-2.5">
              <div>
                <h4 className="text-sm font-bold text-white">AI Mentorship Engagement</h4>
                <p className="text-[10px] text-brand-text-muted mt-0.5">Evaluate mentorship score based on monthly frequency.</p>
              </div>
              <span className="badge bg-brand-accent-cyan/10 text-brand-accent-cyan text-[10px] px-2 py-0.5">TF.js</span>
            </div>

            <div className="flex flex-col gap-3 text-xs">
              <div>
                <label className="block text-[10px] font-bold text-brand-text-muted uppercase tracking-wider mb-1">Mentorship Frequency</label>
                <input 
                  type="range" 
                  min="1" 
                  max="10" 
                  value={frequency} 
                  onChange={(e) => setFrequency(parseInt(e.target.value))} 
                  className="w-full accent-brand-primary cursor-pointer"
                />
                <span className="float-right mt-1 font-mono text-[10px] text-brand-text-muted">{frequency} meetings/mo</span>
              </div>

              <button 
                onClick={handleTfPredict}
                className="btn btn-primary w-full justify-center py-2"
              >
                Score Referral Profile
              </button>

              <div className="bg-brand-bg-tertiary/40 border border-brand-border/60 rounded-xl p-3 text-center">
                <div className="text-[10px] font-bold uppercase tracking-wider text-brand-text-muted mb-1">Mentorship Engagement Score</div>
                <div className="text-2xl font-display font-bold text-brand-accent-emerald">
                  {predictedScore !== null ? `${predictedScore}% Engagement` : '--%'}
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
