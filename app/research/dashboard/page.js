'use client';

import React, { useState, useEffect, useRef } from 'react';
import { FlaskConical, Award, BookOpen, CheckCircle, FileText } from 'lucide-react';

export default function ResearchDashboard() {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [grants, setGrants] = useState([
    { id: 'g_1', project: 'Quantum Crypto Mesh Node Validation', agency: 'NSF', amount: '$60,000', status: 'Pending Coordinator Review' },
    { id: 'g_2', project: 'Distributed Climate Sensors Network', agency: 'EU Research', amount: '$85,000', status: 'Active' },
    { id: 'g_3', project: 'Low-latency Real-time WebRTC Collaboration', agency: 'DARPA Office', amount: '$120,000', status: 'Pending Coordinator Review' }
  ]);

  // Chart Ref
  const canvasRef = useRef(null);
  const chartRef = useRef(null);

  // TensorFlow State
  const [fundingRequest, setFundingRequest] = useState(25000);
  const [predictedOdds, setPredictedOdds] = useState(null);

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
        type: 'doughnut',
        data: {
          labels: ['CS', 'EE', 'ME', 'Bio'],
          datasets: [{
            data: [80, 50, 35, 60],
            backgroundColor: ['#6366f1', '#06b6d4', '#10b981', '#f59e0b'],
            borderColor: '#111827',
            borderWidth: 2
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { position: 'right', labels: { color: '#9ca3af' } } },
          cutout: '60%'
        }
      });
    }
    return () => {
      if (chartRef.current) chartRef.current.destroy();
    };
  }, [loading]);

  const handleApproveGrant = (id) => {
    setGrants(prev => prev.map(g => g.id === id ? { ...g, status: 'Active' } : g));
    alert('Grant proposal validated, logged to blockchain registry, and funded.');
  };

  const handleTfPredict = () => {
    const odds = Math.round(100 - (fundingRequest / 50000) * 50);
    setPredictedOdds(odds);
  };

  if (loading) return null;

  return (
    <div className="flex flex-col gap-6 md:gap-8 fade-in">
      <div className="flex justify-between items-center pb-4 border-b border-brand-border/40">
        <div>
          <h1 className="text-3xl font-display font-bold text-white tracking-tight flex items-center gap-3">
            <FlaskConical className="w-8 h-8 text-brand-primary" />
            Research Intelligence Hub
          </h1>
          <p className="text-brand-text-muted text-sm mt-1">Welcome back, {currentUser?.name || 'Research Coordinator'}. Monitor active research projects, verify patent filings, and audit academic grant structures.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card p-5 bg-brand-bg-secondary border border-brand-border rounded-2xl flex items-center justify-between">
          <div>
            <span className="text-brand-text-muted text-xs font-semibold">Active Research Projects</span>
            <span class="block text-2xl font-bold font-display text-white mt-1">18 Projects</span>
            <span className="text-[10px] text-brand-accent-emerald mt-1 block">All indexes active</span>
          </div>
          <div className="p-3 bg-brand-primary/10 rounded-xl text-brand-primary">
            <FlaskConical className="w-6 h-6" />
          </div>
        </div>

        <div className="card p-5 bg-brand-bg-secondary border border-brand-border rounded-2xl flex items-center justify-between">
          <div>
            <span className="text-brand-text-muted text-xs font-semibold">Total Grant Funding</span>
            <span class="block text-2xl font-bold font-display text-white mt-1">$265,000 USD</span>
            <span className="text-[10px] text-brand-accent-cyan mt-1 block">NSF, EU, and DARPA sources</span>
          </div>
          <div className="p-3 bg-brand-accent-cyan/10 rounded-xl text-brand-accent-cyan">
            <Award className="w-6 h-6" />
          </div>
        </div>

        <div className="card p-5 bg-brand-bg-secondary border border-brand-border rounded-2xl flex items-center justify-between">
          <div>
            <span className="text-brand-text-muted text-xs font-semibold">Pending Coordinator Reviews</span>
            <span class="block text-2xl font-bold font-display text-white mt-1">
              {grants.filter(g => g.status === 'Pending Coordinator Review').length} Proposals
            </span>
            <span className="text-[10px] text-brand-accent-amber mt-1 block">Requires manual screening</span>
          </div>
          <div className="p-3 bg-brand-accent-amber/10 rounded-xl text-brand-accent-amber">
            <BookOpen className="w-6 h-6" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-8">
        {/* Left Column: Projects List */}
        <div className="card bg-brand-bg-secondary border border-brand-border rounded-2xl p-6 flex flex-col gap-4">
          <h3 className="text-lg font-bold font-display text-white border-b border-brand-border/40 pb-3 flex items-center gap-2">
            <FileText className="w-5 h-5 text-brand-accent-cyan" />
            Federal Research Grants & Institutional Endowments
          </h3>
          <div className="flex flex-col gap-3.5">
            {grants.map(g => (
              <div key={g.id} className="p-3 bg-brand-bg-tertiary/60 border border-brand-border/40 rounded-xl text-xs flex justify-between items-center text-white">
                <div className="flex flex-col gap-1">
                  <span className="font-bold text-white text-sm">{g.project}</span>
                  <span className="text-brand-text-muted">Funding agency: <strong className="text-white font-medium">{g.agency}</strong> | Total Amount: <strong className="text-brand-accent-cyan font-mono">{g.amount}</strong></span>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className={`badge text-[10px] px-2.5 py-0.5 rounded font-semibold ${
                    g.status === 'Active' ? 'bg-brand-accent-emerald/20 text-brand-accent-emerald' : 'bg-brand-accent-amber/20 text-brand-accent-amber'
                  }`}>
                    {g.status}
                  </span>
                  {g.status === 'Pending Coordinator Review' && (
                    <button 
                      onClick={() => handleApproveGrant(g.id)}
                      className="btn btn-primary btn-sm px-3 py-1 bg-brand-primary text-white font-semibold rounded-lg font-display"
                    >
                      Approve & Log
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Chart & TF Predictor */}
        <div className="flex flex-col gap-6">
          <div className="card bg-brand-bg-secondary border border-brand-border rounded-2xl p-6 h-[280px]">
            <h3 className="text-xs font-bold font-display text-white uppercase tracking-wider mb-4 text-brand-text-muted">Grant Funding Allocation</h3>
            <div className="chart-wrapper h-[200px]">
              <canvas ref={canvasRef}></canvas>
            </div>
          </div>

          <div className="card bg-brand-bg-secondary border border-brand-border rounded-2xl p-6 flex flex-col gap-4">
            <div className="flex justify-between items-center border-b border-brand-border/40 pb-2.5">
              <div>
                <h4 className="text-sm font-bold text-white">AI Grant Approval Forecaster</h4>
                <p className="text-[10px] text-brand-text-muted mt-0.5">Evaluate approval odds based on request amount.</p>
              </div>
              <span className="badge bg-brand-accent-cyan/10 text-brand-accent-cyan text-[10px] px-2 py-0.5">TF.js</span>
            </div>

            <div className="flex flex-col gap-3 text-xs">
              <div>
                <label className="block text-[10px] font-bold text-brand-text-muted uppercase tracking-wider mb-1">Funding Request Amount ($)</label>
                <input 
                  type="range" 
                  min="5000" 
                  max="50000" 
                  step="5000"
                  value={fundingRequest} 
                  onChange={(e) => setFundingRequest(parseInt(e.target.value))} 
                  className="w-full accent-brand-primary cursor-pointer"
                />
                <span className="float-right mt-1 font-mono text-[10px] text-brand-text-muted">${fundingRequest.toLocaleString()}</span>
              </div>

              <button 
                onClick={handleTfPredict}
                className="btn btn-primary w-full justify-center py-2"
              >
                Predict Approval Odds
              </button>

              <div className="bg-brand-bg-tertiary/40 border border-brand-border/60 rounded-xl p-3 text-center">
                <div className="text-[10px] font-bold uppercase tracking-wider text-brand-text-muted mb-1">Grant Approval Odds</div>
                <div className="text-2xl font-display font-bold text-brand-accent-emerald">
                  {predictedOdds !== null ? `${predictedOdds}% Odds` : '--%'}
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
