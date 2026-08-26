'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useDb } from '../../../context/db-context';
import { BookOpen, Wallet, Calendar, Award, GraduationCap, CheckCircle, AlertTriangle, Clock } from 'lucide-react';
import Link from 'next/link';

export default function StudentHomeDashboard() {
  const { announcements } = useDb();
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [regStatus, setRegStatus] = useState(null);
  const [timetable, setTimetable] = useState([]);
  
  const [courseSchedule, setCourseSchedule] = useState([
    { code: 'CS202', title: 'Data Structures & Algorithms', progress: 85, grade: 'A' },
    { code: 'CS302', title: 'Database Management Systems', progress: 92, grade: 'A-' },
    { code: 'CS305', title: 'Software Engineering', progress: 75, grade: 'B+' }
  ]);

  // Chart Ref
  const canvasRef = useRef(null);
  const chartRef = useRef(null);

  // TensorFlow State
  const [studyHours, setStudyHours] = useState(15);
  const [tfLoss, setTfLoss] = useState(null);
  const [tfProgress, setTfProgress] = useState(0);
  const [tfStatus, setTfStatus] = useState('Untrained');
  const [tfTraining, setTfTraining] = useState(false);
  const [predictedOdds, setPredictedOdds] = useState(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const session = sessionStorage.getItem('campusx_erp_session');
      if (session) {
        const user = JSON.parse(session);
        setCurrentUser(user);
        fetchRegistrationStatus(user.id || 'STU001');
      } else {
        setLoading(false);
      }
    }
  }, []);

  // Initialize Chart.js
  useEffect(() => {
    if (!loading && typeof window !== 'undefined' && window.Chart && canvasRef.current) {
      if (chartRef.current) chartRef.current.destroy();
      chartRef.current = new window.Chart(canvasRef.current, {
        type: 'line',
        data: {
          labels: ['Sem 1', 'Sem 2', 'Sem 3', 'Sem 4'],
          datasets: [{
            label: 'GPA Score',
            data: [3.55, 3.68, 3.82, 3.82],
            borderColor: '#10b981',
            backgroundColor: 'rgba(16, 185, 129, 0.05)',
            fill: true,
            tension: 0.3
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: {
            y: { min: 2.5, max: 4.0, grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#9ca3af' } },
            x: { grid: { display: false }, ticks: { color: '#9ca3af' } }
          }
        }
      });
    }
    return () => {
      if (chartRef.current) chartRef.current.destroy();
    };
  }, [loading]);

  const fetchRegistrationStatus = async (studentId) => {
    try {
      const res = await fetch(`/api/registration/status?student_id=${studentId}`);
      const data = await res.json();
      setRegStatus(data.registration);
      
      const timeRes = await fetch(`/api/registration/timetable?student_id=${studentId}`);
      const timeData = await timeRes.json();
      setTimetable(timeData);
      
      setLoading(false);
    } catch (err) {
      console.error('Error fetching student dashboard stats:', err);
      setLoading(false);
    }
  };

  const handleTfPredict = async () => {
    if (typeof window === 'undefined' || !window.tf) return alert('TensorFlow.js loading...');
    setTfTraining(true);
    setTfStatus('Training...');
    
    const tf = window.tf;
    const model = tf.sequential();
    model.add(tf.layers.dense({ units: 1, inputShape: [2] }));
    model.compile({ optimizer: tf.train.adam(0.1), loss: 'meanSquaredError' });
    
    const trainX = tf.tensor2d([[10, 80], [15, 90], [20, 95], [5, 60]], [4, 2]);
    const trainY = tf.tensor2d([[70], [85], [96], [40]], [4, 1]);
    
    try {
      await model.fit(trainX, trainY, {
        epochs: 50,
        callbacks: {
          onEpochEnd: (epoch, logs) => {
            setTfLoss(logs.loss.toFixed(5));
            setTfProgress(Math.round(((epoch + 1) / 50) * 100));
          }
        }
      });
      
      const testX = tf.tensor2d([[parseFloat(studyHours), 94.2]], [1, 2]);
      const pred = model.predict(testX);
      const val = Math.min(Math.max(Math.round((await pred.data())[0]), 30), 100);
      setPredictedOdds(val);
      setTfStatus('Trained');
      
      testX.dispose();
      pred.dispose();
    } catch (e) {
      console.error(e);
    } finally {
      trainX.dispose();
      trainY.dispose();
      model.dispose();
      setTfTraining(false);
    }
  };

  if (loading) return null;

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const timeSlots = ['09:00 - 10:30', '11:00 - 12:30', '14:00 - 15:30'];

  const getSlotCourse = (day, timeRange) => {
    const start = timeRange.split(' - ')[0];
    return timetable.find(slot => slot.day_of_week === day && slot.start_time === start);
  };

  return (
    <div className="flex flex-col gap-6 md:gap-8 fade-in">
      {/* Page Title */}
      <div className="flex justify-between items-center pb-4 border-b border-brand-border/40">
        <div>
          <h1 className="text-3xl font-display font-bold text-white tracking-tight flex items-center gap-3">
            <GraduationCap className="w-8 h-8 text-brand-primary" />
            My Academic Workspace
          </h1>
          <p className="text-brand-text-muted text-sm mt-1">Student portal for {currentUser?.name || 'Student'}. Tracks term grades, syllabus progress, and Web3 credentials.</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
        <div className="card p-5 bg-brand-bg-secondary border border-brand-border rounded-2xl flex items-center justify-between">
          <div>
            <span className="text-brand-text-muted text-xs font-semibold">Cumulative GPA</span>
            <span className="block text-2xl font-bold font-display text-white mt-1">3.82 CGPA</span>
            <span className="text-[10px] text-brand-accent-emerald mt-1 block">Top 5% of Cohort</span>
          </div>
          <div className="p-3 bg-brand-primary/10 rounded-xl text-brand-primary">
            <Award className="w-6 h-6" />
          </div>
        </div>

        <div className="card p-5 bg-brand-bg-secondary border border-brand-border rounded-2xl flex items-center justify-between">
          <div>
            <span className="text-brand-text-muted text-xs font-semibold">Term Attendance</span>
            <span className="block text-2xl font-bold font-display text-white mt-1">94.2%</span>
            <span className="text-[10px] text-brand-accent-emerald mt-1 block">✓ Satisfies attendance minimums</span>
          </div>
          <div className="p-3 bg-brand-accent-cyan/10 rounded-xl text-brand-accent-cyan">
            <Calendar className="w-6 h-6" />
          </div>
        </div>

        <div className="card p-5 bg-brand-bg-secondary border border-brand-border rounded-2xl flex items-center justify-between">
          <div>
            <span className="text-brand-text-muted text-xs font-semibold">Academic Wallet Balance</span>
            <span className="block text-2xl font-bold font-display text-brand-accent-cyan mt-1">45.0 AGC</span>
            <span className="text-[10px] text-brand-accent-cyan mt-1 block">3 NFT Credentials verified</span>
          </div>
          <div className="p-3 bg-brand-accent-emerald/10 rounded-xl text-brand-accent-emerald">
            <Wallet className="w-6 h-6" />
          </div>
        </div>

        <div className="card p-5 bg-brand-bg-secondary border border-brand-border rounded-2xl flex items-center justify-between">
          <div>
            <span className="text-brand-text-muted text-xs font-semibold">Semester Enrolment</span>
            {regStatus ? (
              <span className={`block text-lg font-bold font-display mt-1 ${regStatus.status === 'APPROVED' ? 'text-brand-accent-emerald' : 'text-brand-accent-amber'}`}>
                {regStatus.status === 'APPROVED' ? '✓ Registered' : '⏳ Pending Approval'}
              </span>
            ) : (
              <span className="block text-lg font-bold font-display text-brand-accent-red mt-1">
                ⏳ Unregistered
              </span>
            )}
            <Link 
              href="/erp/registration"
              className="text-[10px] text-brand-primary font-bold hover:underline mt-1 block"
            >
              Configure Semester Registration →
            </Link>
          </div>
          <div className="p-3 bg-brand-primary/10 rounded-xl text-brand-primary">
            <BookOpen className="w-6 h-6" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-8">
        
        {/* Left column: registered courses, announcements, timetable */}
        <div className="flex flex-col gap-6">
          <div className="card bg-brand-bg-secondary border border-brand-border rounded-2xl p-6 flex flex-col gap-4">
            <h3 className="text-lg font-bold font-display text-white border-b border-brand-border/40 pb-3 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-brand-accent-cyan" />
              Registered Courses & Term Progress
            </h3>
            <div className="flex flex-col gap-4">
              {courseSchedule.map(course => (
                <div key={course.code} className="p-3.5 bg-brand-bg-tertiary/60 border border-brand-border/40 rounded-xl text-xs flex flex-col gap-2">
                  <div className="flex justify-between items-center">
                    <div className="flex flex-col">
                      <span className="font-bold text-white text-sm">{course.title}</span>
                      <span className="text-[10px] text-brand-text-muted mt-0.5">Subject Code: {course.code}</span>
                    </div>
                    <span className="text-sm font-bold text-brand-accent-cyan">Grade: {course.grade}</span>
                  </div>
                  <div className="w-full bg-brand-bg-secondary h-2 rounded-full overflow-hidden border border-brand-border/40 mt-1">
                    <div className="h-full bg-brand-primary rounded-full transition-all duration-300" style={{ width: `${course.progress}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="card bg-brand-bg-secondary border border-brand-border rounded-2xl p-6 flex flex-col gap-4">
            <h3 className="text-lg font-bold font-display text-white border-b border-brand-border/40 pb-3 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-brand-accent-amber" />
              Active Announcements
            </h3>
            <div className="flex flex-col gap-4">
              {announcements.slice(0, 3).map((ann, i) => (
                <div key={i} className="pl-3 border-l-2" style={{ borderColor: ann.color || 'var(--color-brand-primary)' }}>
                  <div className="flex justify-between items-center text-[10px] text-brand-text-subtle">
                    <span className="font-bold text-white uppercase">{ann.tag}</span>
                    <span>{ann.date}</span>
                  </div>
                  <h4 className="text-xs font-semibold text-white my-1">{ann.title}</h4>
                  <p className="text-[11px] text-brand-text-muted leading-relaxed m-0 truncate">{ann.content}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right column: performance chart & tf predictor */}
        <div className="flex flex-col gap-6">
          <div className="card bg-brand-bg-secondary border border-brand-border rounded-2xl p-6 h-[280px]">
            <h3 className="text-xs font-bold font-display text-white uppercase tracking-wider mb-4 text-brand-text-muted">GPA Semester Progress Chart</h3>
            <div className="chart-wrapper h-[200px]">
              <canvas ref={canvasRef}></canvas>
            </div>
          </div>

          <div className="card bg-brand-bg-secondary border border-brand-border rounded-2xl p-6 flex flex-col gap-4">
            <div className="flex justify-between items-center border-b border-brand-border/40 pb-2.5">
              <div>
                <h4 className="text-sm font-bold text-white">AI Placement Odds Forecaster</h4>
                <p className="text-[10px] text-brand-text-muted mt-0.5">Evaluate post-grad industry placement odds.</p>
              </div>
              <span className="badge bg-brand-accent-cyan/10 text-brand-accent-cyan text-[10px] px-2 py-0.5">TF.js</span>
            </div>

            <div className="flex flex-col gap-3 text-xs">
              <div>
                <label className="block text-[10px] font-bold text-brand-text-muted uppercase tracking-wider mb-1">Weekly Study Hours</label>
                <input 
                  type="range" 
                  min="5" 
                  max="25" 
                  value={studyHours} 
                  onChange={(e) => setStudyHours(parseInt(e.target.value))} 
                  className="w-full accent-brand-primary cursor-pointer"
                />
                <span className="float-right mt-1 font-mono text-[10px] text-brand-text-muted">{studyHours} hrs</span>
              </div>

              <button 
                onClick={handleTfPredict} 
                disabled={tfTraining}
                className="btn btn-primary w-full justify-center py-2"
              >
                {tfTraining ? 'Training...' : 'Predict Placement Odds'}
              </button>

              {tfTraining && (
                <div className="bg-brand-bg-tertiary p-2.5 rounded-xl border border-brand-border/40 text-[10px]">
                  <div className="flex justify-between font-mono mb-1">
                    <span className="text-brand-text-muted">Loss Score:</span>
                    <span className="text-brand-accent-amber">{tfLoss || '0.00000'}</span>
                  </div>
                  <div className="w-full bg-brand-bg-secondary h-1 rounded-full overflow-hidden">
                    <div className="bg-brand-primary h-full transition-all" style={{ width: `${tfProgress}%` }}></div>
                  </div>
                </div>
              )}

              <div className="bg-brand-bg-tertiary/40 border border-brand-border/60 rounded-xl p-3 text-center">
                <div className="text-[10px] font-bold uppercase tracking-wider text-brand-text-muted mb-1">Career Success Index</div>
                <div className="text-2xl font-display font-bold text-brand-accent-emerald">
                  {predictedOdds !== null ? `${predictedOdds}% Odds` : '--%'}
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Timetable matrix view */}
      {timetable.length > 0 && (
        <div className="card bg-brand-bg-secondary border border-brand-border rounded-2xl p-6 flex flex-col gap-4 text-white">
          <h3 className="text-lg font-bold font-display flex items-center gap-2 border-b border-brand-border/40 pb-3">
            <Clock className="w-5 h-5 text-brand-primary" />
            My Weekly Academic Timetable Matrix
          </h3>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-brand-border">
                  <th className="p-3 text-brand-text-muted font-bold font-display">Time Slot</th>
                  {days.map(d => (
                    <th key={d} className="p-3 text-brand-text-muted font-bold font-display">{d}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {timeSlots.map(timeRange => (
                  <tr key={timeRange} className="border-b border-brand-border/60 hover:bg-brand-bg-tertiary/20">
                    <td className="p-3 font-semibold text-brand-accent-cyan font-mono">{timeRange}</td>
                    {days.map(day => {
                      const course = getSlotCourse(day, timeRange);
                      return (
                        <td key={day} className="p-3">
                          {course ? (
                            <div className="p-2 bg-brand-primary/10 border border-brand-primary/30 rounded-lg">
                              <span className="font-bold block text-white">{course.course_code}</span>
                              <span className="text-[9px] text-brand-text-muted mt-0.5 block">{course.room}</span>
                            </div>
                          ) : (
                            <span className="text-[10px] text-brand-text-muted font-mono">-</span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
