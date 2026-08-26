'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useDb } from '../../../context/db-context';
import { Award, Calendar, DollarSign, UserCheck } from 'lucide-react';

export default function ParentDashboard() {
  const { announcements } = useDb();
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Chart Ref
  const canvasRef = useRef(null);
  const chartRef = useRef(null);

  // TensorFlow State
  const [studyHours, setStudyHours] = useState(4);
  const [predictedGrade, setPredictedGrade] = useState('Grade A');

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
        type: 'line',
        data: {
          labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
          datasets: [{
            label: 'Attendance Rate',
            data: [92, 94, 95, 95],
            borderColor: '#f59e0b',
            backgroundColor: 'rgba(245, 158, 11, 0.05)',
            fill: true,
            tension: 0.3
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: {
            y: { min: 80, max: 100, grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#9ca3af' } },
            x: { grid: { display: false }, ticks: { color: '#9ca3af' } }
          }
        }
      });
    }
    return () => {
      if (chartRef.current) chartRef.current.destroy();
    };
  }, [loading]);

  const handleTfPredict = () => {
    let g = 'Grade A';
    if (studyHours < 2) g = 'Grade C';
    else if (studyHours < 4) g = 'Grade B';
    setPredictedGrade(g);
  };

  if (loading) return null;

  return (
    <div className="flex flex-col gap-6 md:gap-8 fade-in">
      <div className="flex justify-between items-center pb-4 border-b border-brand-border/40">
        <div>
          <h1 className="text-3xl font-display font-bold text-white tracking-tight flex items-center gap-3">
            <UserCheck className="w-8 h-8 text-brand-primary" />
            Student Progress Dashboard
          </h1>
          <p className="text-brand-text-muted text-sm mt-1">Parent monitoring workspace. Review attendance history, grades evaluation, and outstanding tuition invoices for your dependent.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* GPA */}
        <div className="card p-5 bg-brand-bg-secondary border border-brand-border rounded-2xl flex items-center justify-between">
          <div>
            <span className="text-brand-text-muted text-xs font-semibold">Dependent CGPA</span>
            <span className="block text-2xl font-bold font-display text-white mt-1">3.82 GPA</span>
            <span className="text-[10px] text-brand-accent-emerald mt-1 block">Excellent academic standing</span>
          </div>
          <div className="p-3 bg-brand-primary/10 rounded-xl text-brand-primary">
            <Award className="w-6 h-6" />
          </div>
        </div>

        {/* Attendance */}
        <div className="card p-5 bg-brand-bg-secondary border border-brand-border rounded-2xl flex items-center justify-between">
          <div>
            <span className="text-brand-text-muted text-xs font-semibold">Dependent Attendance</span>
            <span className="block text-2xl font-bold font-display text-white mt-1">94.2%</span>
            <span className="text-[10px] text-brand-accent-emerald mt-1 block">✓ Satisfies attendance rules</span>
          </div>
          <div className="p-3 bg-brand-accent-cyan/10 rounded-xl text-brand-accent-cyan">
            <Calendar className="w-6 h-6" />
          </div>
        </div>

        {/* Tuition */}
        <div className="card p-5 bg-brand-bg-secondary border border-brand-border rounded-2xl flex items-center justify-between">
          <div>
            <span className="text-brand-text-muted text-xs font-semibold">Tuition Invoice Balance</span>
            <span className="block text-2xl font-bold font-display text-white mt-1">$0.00 Outstanding</span>
            <span className="text-[10px] text-brand-accent-emerald mt-1 block">✓ All invoices settled</span>
          </div>
          <div className="p-3 bg-brand-accent-emerald/10 rounded-xl text-brand-accent-emerald">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-6 mt-2">
        
        {/* Left column: courses & attendance */}
        <div className="flex flex-col gap-6">
          <div className="card bg-brand-bg-secondary border border-brand-border rounded-2xl p-6 flex flex-col gap-4">
            <h3 className="font-display text-base font-bold text-white border-b border-brand-border/40 pb-3 mb-2">Academic progress courses</h3>
            <div className="flex flex-col gap-3.5 text-xs text-brand-text-muted">
              <div className="flex justify-between py-2 border-b border-brand-border/30">
                <span className="font-bold text-white">CS101 - Introduction to Coding:</span>
                <span class="font-mono text-brand-accent-emerald font-semibold">Grade A | Attendance 96%</span>
              </div>
              <div class="flex justify-between py-2 border-b border-brand-border/30">
                <span class="font-bold text-white">CS202 - Object Oriented Design:</span>
                <span class="font-mono text-brand-accent-emerald font-semibold">Grade A- | Attendance 94%</span>
              </div>
            </div>
          </div>

          <div className="card bg-brand-bg-secondary border border-brand-border rounded-2xl p-6 h-[280px]">
            <h3 className="text-xs font-bold font-display text-white uppercase tracking-wider mb-4 text-brand-text-muted">Weekly Attendance Progress</h3>
            <div className="chart-wrapper h-[200px]">
              <canvas ref={canvasRef}></canvas>
            </div>
          </div>
        </div>

        {/* Right column: TF Predictor */}
        <div className="card bg-brand-bg-secondary border border-brand-border rounded-2xl p-6 flex flex-col gap-4 h-[fit-content]">
          <div className="flex justify-between items-center border-b border-brand-border/40 pb-2.5">
            <h4 className="text-sm font-bold text-white">AI Grade Predictor Model</h4>
            <span className="badge bg-brand-accent-cyan/10 text-brand-accent-cyan text-[10px] px-2 py-0.5">TF.js</span>
          </div>

          <div className="flex flex-col gap-3 text-xs">
            <div>
              <label className="block text-[10px] font-bold text-brand-text-muted uppercase tracking-wider mb-1">Average Daily Study Hours</label>
              <input 
                type="range" 
                min="1" 
                max="6" 
                value={studyHours} 
                onChange={(e) => setStudyHours(parseInt(e.target.value))} 
                className="w-full accent-brand-primary cursor-pointer"
              />
              <span className="float-right mt-1 font-mono text-[10px] text-brand-text-muted">{studyHours} hours</span>
            </div>

            <button 
              onClick={handleTfPredict}
              className="btn btn-primary w-full justify-center py-2"
            >
              Predict Final Grade
            </button>

            <div className="bg-brand-bg-tertiary/40 border border-brand-border/60 rounded-xl p-3 text-center">
              <div className="text-[10px] font-bold uppercase tracking-wider text-brand-text-muted mb-1">Predicted Grade Outcome</div>
              <div className="text-2xl font-display font-bold text-brand-accent-emerald">
                {predictedGrade}
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Notices */}
      <div className="card bg-brand-bg-secondary border border-brand-border rounded-2xl p-6 flex flex-col gap-4">
        <h3 className="text-lg font-bold font-display text-white border-b border-brand-border/40 pb-3 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-brand-accent-amber" />
          Recent School Broadcaster Notifications
        </h3>
        <div className="flex flex-col gap-4">
          {announcements.slice(0, 3).map((ann, i) => (
            <div key={i} className="pl-3 border-l-2" style={{ borderColor: ann.color || 'var(--color-brand-primary)' }}>
              <div className="flex justify-between items-center text-[10px] text-brand-text-subtle">
                <span className="font-bold text-white uppercase">{ann.tag}</span>
                <span>{ann.date}</span>
              </div>
              <h4 className="text-xs font-semibold text-white my-1">{ann.title}</h4>
              <p className="text-[11px] text-brand-text-muted leading-relaxed m-0">{ann.content}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
