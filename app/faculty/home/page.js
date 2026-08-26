'use client';

import React, { useState, useEffect, useRef } from 'react';
import { BookOpen, Calendar, HelpCircle, CheckCircle, FileText } from 'lucide-react';

export default function FacultyHomeDashboard() {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [schedule, setSchedule] = useState([
    { time: '09:00 AM - 10:30 AM', subject: 'CS101 - Intro to Programming', room: 'Hall A' },
    { time: '11:00 AM - 12:30 PM', subject: 'CS202 - Data Structures', room: 'Lab 3' }
  ]);
  const [advisingQueue, setAdvisingQueue] = useState([
    { id: 'adv_1', student: 'Alex Rivera', issue: 'Syllabus exemption check', status: 'Pending Approval' },
    { id: 'adv_2', student: 'Zoe Chen', issue: 'Internship authorization signoff', status: 'Approved' }
  ]);

  // Chart Ref
  const canvasRef = useRef(null);
  const chartRef = useRef(null);

  // TensorFlow State
  const [absences, setAbsences] = useState(2);
  const [predictedRisk, setPredictedRisk] = useState('Low Risk');

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
          labels: ['A', 'B', 'C', 'D', 'F'],
          datasets: [{
            label: 'Students Count',
            data: [65, 80, 25, 10, 5],
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

  const handleApproveAdvising = (id) => {
    setAdvisingQueue(prev => prev.map(a => a.id === id ? { ...a, status: 'Approved' } : a));
    alert('Advising ticket signed off successfully.');
  };

  const handleTfPredict = () => {
    let risk = 'Low Risk';
    if (absences > 4) {
      risk = 'High Risk (At-Risk)';
    } else if (absences >= 2) {
      risk = 'Moderate Risk';
    }
    setPredictedRisk(risk);
  };

  if (loading) return null;

  return (
    <div className="flex flex-col gap-6 md:gap-8 fade-in">
      <div className="flex justify-between items-center pb-4 border-b border-brand-border/40">
        <div>
          <h1 className="text-3xl font-display font-bold text-white tracking-tight flex items-center gap-3">
            <BookOpen className="w-8 h-8 text-brand-primary" />
            Faculty Control Panel
          </h1>
          <p className="text-brand-text-muted text-sm mt-1">Welcome back, {currentUser?.name || 'Faculty Member'}. View lecture schedules, student advising threads, and research grant logs.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-8">
        
        {/* Left Side: Schedule & Advising */}
        <div className="flex flex-col gap-6">
          {/* Lecture Schedule */}
          <div className="card bg-brand-bg-secondary border border-brand-border rounded-2xl p-6 flex flex-col gap-4">
            <h3 className="text-lg font-bold font-display text-white border-b border-brand-border/40 pb-3 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-brand-accent-cyan" />
              Today's Teaching Schedule
            </h3>
            <div className="flex flex-col gap-3.5">
              {schedule.map((sch, i) => (
                <div key={i} className="p-3.5 bg-brand-bg-tertiary/60 border border-brand-border/40 rounded-xl text-xs flex justify-between items-center">
                  <div className="flex flex-col">
                    <span className="font-bold text-white text-sm">{sch.subject}</span>
                    <span className="text-[10px] text-brand-text-muted mt-1">{sch.time}</span>
                  </div>
                  <span className="badge text-[10px] px-2.5 py-0.5 rounded bg-brand-primary/20 text-brand-primary font-bold">
                    {sch.room}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Student Advising Panel */}
          <div className="card bg-brand-bg-secondary border border-brand-border rounded-2xl p-6 flex flex-col gap-4">
            <h3 className="text-lg font-bold font-display text-white border-b border-brand-border/40 pb-3 flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-brand-accent-amber" />
              Student Advising Queue
            </h3>
            <div className="flex flex-col gap-3.5">
              {advisingQueue.map(adv => (
                <div key={adv.id} className="p-3 bg-brand-bg-tertiary/60 border border-brand-border/40 rounded-xl text-xs flex justify-between items-center">
                  <div className="flex flex-col">
                    <span className="font-bold text-white">{adv.student}</span>
                    <span className="text-[10px] text-brand-text-muted mt-0.5">{adv.issue}</span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className={`badge text-[10px] px-2 py-0.5 rounded ${adv.status === 'Approved' ? 'bg-brand-accent-emerald/20 text-brand-accent-emerald' : 'bg-brand-accent-amber/20 text-brand-accent-amber'}`}>
                      {adv.status}
                    </span>
                    {adv.status === 'Pending Approval' && (
                      <button onClick={() => handleApproveAdvising(adv.id)} className="p-1 text-brand-accent-emerald hover:text-white hover:bg-brand-accent-emerald/20 rounded-lg cursor-pointer transition-all">
                        <CheckCircle className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side: Charts & Predictors */}
        <div className="flex flex-col gap-6">
          <div className="card bg-brand-bg-secondary border border-brand-border rounded-2xl p-6 h-[280px]">
            <h3 className="text-xs font-bold font-display text-white uppercase tracking-wider mb-4 text-brand-text-muted">Grade Distribution Chart</h3>
            <div className="chart-wrapper h-[200px]">
              <canvas ref={canvasRef}></canvas>
            </div>
          </div>

          <div className="card bg-brand-bg-secondary border border-brand-border rounded-2xl p-6 flex flex-col gap-4">
            <div className="flex justify-between items-center border-b border-brand-border/40 pb-2.5">
              <div>
                <h4 className="text-sm font-bold text-white">AI Student Risk Evaluator</h4>
                <p className="text-[10px] text-brand-text-muted mt-0.5">Evaluate student risk level based on absences.</p>
              </div>
              <span className="badge bg-brand-accent-cyan/10 text-brand-accent-cyan text-[10px] px-2 py-0.5">TF.js</span>
            </div>

            <div className="flex flex-col gap-3 text-xs">
              <div>
                <label className="block text-[10px] font-bold text-brand-text-muted uppercase tracking-wider mb-1">Weekly Absences Limit</label>
                <input 
                  type="range" 
                  min="0" 
                  max="6" 
                  value={absences} 
                  onChange={(e) => setAbsences(parseInt(e.target.value))} 
                  className="w-full accent-brand-primary cursor-pointer"
                />
                <span className="float-right mt-1 font-mono text-[10px] text-brand-text-muted">{absences} days</span>
              </div>

              <button 
                onClick={handleTfPredict}
                className="btn btn-primary w-full justify-center py-2"
              >
                Evaluate Risk Index
              </button>

              <div className="bg-brand-bg-tertiary/40 border border-brand-border/60 rounded-xl p-3 text-center">
                <div className="text-[10px] font-bold uppercase tracking-wider text-brand-text-muted mb-1">Calculated Status</div>
                <div className={`text-xl font-display font-bold ${predictedRisk.includes('High') ? 'text-brand-accent-ruby' : predictedRisk.includes('Moderate') ? 'text-brand-accent-amber' : 'text-brand-accent-emerald'}`}>
                  {predictedRisk}
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
