'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useDb } from '../../../context/db-context';
import { 
  Layers, 
  FileText, 
  CheckCircle, 
  RefreshCw, 
  BarChart2, 
  ShieldAlert, 
  Users, 
  TrendingUp, 
  Settings, 
  Activity, 
  Edit,
  DollarSign,
  Search,
  CheckCircle2,
  Calendar,
  Briefcase
} from 'lucide-react';

export default function DeanDashboard() {
  const { faculty, students, courses, updateFaculty } = useDb();
  
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedDept, setSelectedDept] = useState('ALL');
  const [facultySearch, setFacultySearch] = useState('');

  // Local state for research grant proposals
  const [researchProjects, setResearchProjects] = useState([
    { id: 'res_1', title: 'Federated Learning on Campus Mesh Networks', lead: 'Prof. Marcus Chen', budget: 45000, dept: 'CS', status: 'Pending Dean Review' },
    { id: 'res_2', title: 'Post-Quantum Encryption Ledger Architecture', lead: 'Dr. Evelyn Sterling', budget: 65000, dept: 'CS', status: 'Approved' },
    { id: 'res_3', title: 'Automated Timetable Scheduling using TensorFlow.js', lead: 'Prof. Sarah Connor', budget: 20000, dept: 'CS', status: 'Pending Dean Review' },
    { id: 'res_4', title: 'High-Throughput Nano-Sensors for IoT Integration', lead: 'Dr. Raymond Park', budget: 55000, dept: 'EE', status: 'Pending Dean Review' },
    { id: 'res_5', title: 'Bioinformatics Database Alignment Acceleration', lead: 'Dr. Helena Rostova', budget: 40000, dept: 'BI', status: 'Approved' }
  ]);

  // AI Forecasting state parameters (TensorFlow.js)
  const [lr, setLr] = useState(0.05);
  const [epochs, setEpochs] = useState(150);
  const [horizon, setHorizon] = useState(2);
  const [tfTraining, setTfTraining] = useState(false);
  const [tfProgress, setTfProgress] = useState(0);
  const [tfEpochDisp, setTfEpochDisp] = useState('0/150');
  const [tfLossDisp, setTfLossDisp] = useState('0.000000');
  const [tfStatus, setTfStatus] = useState('Untrained');
  const [tfEquation, setTfEquation] = useState('y = mx + c');

  // Editing faculty state variables
  const [editingFaculty, setEditingFaculty] = useState(null);
  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editDesignation, setEditDesignation] = useState('Lecturer');
  const [editDept, setEditDept] = useState('CS');
  const [editSalary, setEditSalary] = useState('80000');
  const [editWorkload, setEditWorkload] = useState('12');

  // Chart Canvas references
  const workloadCanvasRef = useRef(null);
  const workloadChartRef = useRef(null);
  const forecastCanvasRef = useRef(null);
  const forecastChartRef = useRef(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const session = sessionStorage.getItem('campusx_erp_session');
      if (session) {
        setCurrentUser(JSON.parse(session));
      }
      setLoading(false);
    }
  }, []);

  // Initialize and Render Chart.js
  useEffect(() => {
    if (typeof window === 'undefined' || !window.Chart) return;
    const Chart = window.Chart;

    // 1. Workload Chart (Academic Metrics Tab)
    if (workloadCanvasRef.current && activeTab === 'metrics') {
      if (workloadChartRef.current) workloadChartRef.current.destroy();

      const deptFac = selectedDept === 'ALL' ? faculty : faculty.filter(f => f.dept === selectedDept);
      const labels = deptFac.map(f => f.name.split(' ').slice(1).join(' ')); // last names
      const data = deptFac.map(f => f.workload || 0);
      const colors = deptFac.map(f => (f.workload || 0) > 15 ? '#f43f5e' : ((f.workload || 0) > 12 ? '#f59e0b' : '#10b981'));

      workloadChartRef.current = new Chart(workloadCanvasRef.current, {
        type: 'bar',
        data: {
          labels: labels.length > 0 ? labels : ['Chen', 'Sterling', 'Connor', 'Park'],
          datasets: [{
            label: 'Weekly Teaching Hours',
            data: data.length > 0 ? data : [12, 16, 8, 14],
            backgroundColor: colors,
            borderColor: 'rgba(255, 255, 255, 0.05)',
            borderWidth: 1,
            borderRadius: 6
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: {
            y: {
              grid: { color: 'rgba(255, 255, 255, 0.05)' },
              ticks: { color: '#94a3b8' },
              min: 0,
              max: 20
            },
            x: {
              grid: { display: false },
              ticks: { color: '#94a3b8' }
            }
          }
        }
      });
    }

    // 2. Forecast Chart (Research Grants Tab)
    if (forecastCanvasRef.current && activeTab === 'grants') {
      if (forecastChartRef.current) forecastChartRef.current.destroy();

      forecastChartRef.current = new Chart(forecastCanvasRef.current, {
        type: 'line',
        data: {
          labels: ['2022-A', '2022-B', '2023-A', '2023-B', '2024-A', '2024-B', '2025-A', '2025-B', '2026-A'],
          datasets: [
            {
              label: 'Historical budget Allocated ($)',
              data: [25000, 30000, 38000, 45000, 52000, 68000, 85000, 110000, 130000],
              borderColor: 'rgba(99, 102, 241, 0.4)',
              backgroundColor: 'transparent',
              pointBackgroundColor: '#6366f1',
              pointRadius: 6,
              borderWidth: 2,
              showLine: true
            },
            {
              label: 'Model Prediction ($)',
              data: [],
              borderColor: '#f59e0b',
              backgroundColor: 'transparent',
              borderWidth: 3,
              borderDash: [5, 5],
              pointRadius: 0
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: true,
              labels: { color: '#94a3b8' }
            }
          },
          scales: {
            y: {
              grid: { color: 'rgba(255, 255, 255, 0.05)' },
              ticks: { color: '#94a3b8' }
            },
            x: {
              grid: { display: false },
              ticks: { color: '#94a3b8' }
            }
          }
        }
      });
    }

    return () => {
      if (workloadChartRef.current) workloadChartRef.current.destroy();
      if (forecastChartRef.current) forecastChartRef.current.destroy();
    };
  }, [activeTab, selectedDept, faculty, researchProjects, currentUser]);

  const handleApproveProject = (id) => {
    setResearchProjects(prev => prev.map(p => p.id === id ? { ...p, status: 'Approved' } : p));
    alert('Research grant proposal has been officially approved by Dean. Budget reserved.');
  };

  // TensorFlow training execution
  const runTfTraining = async () => {
    if (tfTraining) return;
    if (typeof window === 'undefined' || !window.tf) {
      alert('TensorFlow.js is currently loading or unavailable.');
      return;
    }

    setTfTraining(true);
    setTfStatus('Training...');
    setTfProgress(0);

    const tf = window.tf;
    const xVal = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    const yVal = [25000, 30000, 38000, 45000, 52000, 68000, 85000, 110000, 130000];

    const xMax = 9;
    const yMax = 150000;

    const xs = tf.tensor2d(xVal.map(x => [x / xMax]));
    const ys = tf.tensor2d(yVal.map(y => [y / yMax]));

    const model = tf.sequential();
    model.add(tf.layers.dense({ units: 1, inputShape: [1] }));

    model.compile({
      optimizer: tf.train.adam(lr),
      loss: 'meanSquaredError'
    });

    try {
      await model.fit(xs, ys, {
        epochs: epochs,
        callbacks: {
          onEpochEnd: (epoch, logs) => {
            const progress = ((epoch + 1) / epochs) * 100;
            setTfProgress(progress);
            setTfEpochDisp(`${epoch + 1}/${epochs}`);
            setTfLossDisp(logs.loss.toFixed(6));
          }
        }
      });

      const w = model.layers[0].getWeights()[0].dataSync()[0];
      const b = model.layers[0].getWeights()[1].dataSync()[0];

      const mVal = (w * yMax) / xMax;
      const cVal = b * yMax;

      setTfStatus('Trained');
      setTfEquation(`y = ${mVal.toFixed(2)}x + ${cVal.toFixed(2)}`);

      const historicalLabels = ['2022-A', '2022-B', '2023-A', '2023-B', '2024-A', '2024-B', '2025-A', '2025-B', '2026-A'];
      const allLabels = [...historicalLabels];
      const fitAndPredictData = [];

      for (let i = 1; i <= 9 + horizon; i++) {
        const pred = mVal * i + cVal;
        fitAndPredictData.push(Math.round(pred));
        if (i > 9) {
          const year = Math.floor(2026 + (i - 9) / 2);
          const term = (i - 9) % 2 === 1 ? 'B' : 'A';
          allLabels.push(`${year}-${term}`);
        }
      }

      if (forecastChartRef.current) {
        forecastChartRef.current.data.labels = allLabels;
        forecastChartRef.current.data.datasets[1].data = fitAndPredictData;
        forecastChartRef.current.update();
      }

    } catch (err) {
      console.error(err);
      setTfStatus('Error');
    } finally {
      xs.dispose();
      ys.dispose();
      model.dispose();
      setTfTraining(false);
    }
  };

  // Faculty edit handers
  const startEditFaculty = (fac) => {
    setEditingFaculty(fac);
    setEditName(fac.name);
    setEditEmail(fac.email);
    setEditDesignation(fac.designation || 'Lecturer');
    setEditDept(fac.dept || 'CS');
    setEditSalary((fac.salary || 80000).toString());
    setEditWorkload((fac.workload || 12).toString());
  };

  const handleSaveFaculty = (e) => {
    e.preventDefault();
    if (!editingFaculty) return;

    updateFaculty(editingFaculty.id, {
      name: editName,
      email: editEmail,
      designation: editDesignation,
      dept: editDept,
      salary: parseInt(editSalary) || 80000,
      workload: parseInt(editWorkload) || 12
    });

    setEditingFaculty(null);
    alert('Faculty profile parameters and workloads updated successfully.');
  };

  const filteredFaculty = faculty.filter(f => {
    const matchesDept = selectedDept === 'ALL' || f.dept === selectedDept;
    const matchesSearch = f.name.toLowerCase().includes(facultySearch.toLowerCase()) || 
                          f.email.toLowerCase().includes(facultySearch.toLowerCase());
    return matchesDept && matchesSearch;
  });

  const totalResearchBudget = researchProjects.reduce((acc, p) => acc + p.budget, 0);

  if (loading) return null;

  return (
    <div className="flex flex-col gap-6 md:gap-8 fade-in">
      
      {/* Header Panel */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-4 border-b border-brand-border/40">
        <div>
          <h1 className="text-3xl font-display font-bold text-white tracking-tight flex items-center gap-3">
            <span className="p-2.5 bg-brand-primary/10 rounded-xl text-brand-primary">
              <Layers className="w-7 h-7" />
            </span>
            Academic Deanery Platform
          </h1>
          <p className="text-brand-text-muted text-sm mt-1">
            Welcome back, {currentUser?.name || 'Dean of Faculty'}. Oversee divisions, track research project pipelines, audit faculty workloads, and optimize budgets.
          </p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => alert('Exporting Global Academic Review...')}
            className="btn btn-secondary btn-sm flex items-center gap-1.5 cursor-pointer"
          >
            <FileText className="w-4 h-4" />
            Export Registry
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-brand-border/40 gap-6 overflow-x-auto shrink-0 pb-1">
        {[
          { id: 'overview', label: 'Deanery Overview', icon: Layers },
          { id: 'faculty', label: 'Faculty & Workloads', icon: Users },
          { id: 'grants', label: 'Research & Funding Forecast', icon: DollarSign },
          { id: 'metrics', label: 'Academic Analytics', icon: BarChart2 }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 pb-3.5 text-sm font-semibold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === tab.id 
                ? 'border-brand-primary text-brand-primary' 
                : 'border-transparent text-brand-text-muted hover:text-brand-text-main'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB 1: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="flex flex-col gap-6">
          {/* KPI summaries */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="card p-5 bg-brand-bg-secondary border border-brand-border rounded-2xl flex items-center justify-between">
              <div>
                <span className="text-brand-text-muted text-xs font-semibold">Total Faculty Members</span>
                <span className="block text-2xl font-bold font-display text-white mt-1">{faculty.length} Staff</span>
                <span className="text-[10px] text-brand-accent-emerald mt-1 block">Full academic roster</span>
              </div>
              <div className="p-3 bg-brand-primary/10 rounded-xl text-brand-primary">
                <Users className="w-6 h-6" />
              </div>
            </div>

            <div className="card p-5 bg-brand-bg-secondary border border-brand-border rounded-2xl flex items-center justify-between">
              <div>
                <span className="text-brand-text-muted text-xs font-semibold">Division Students</span>
                <span className="block text-2xl font-bold font-display text-brand-accent-cyan mt-1">{students.length} Enrolled</span>
                <span className="text-[10px] text-brand-accent-emerald mt-1 block">All registered departments</span>
              </div>
              <div className="p-3 bg-brand-accent-cyan/10 rounded-xl text-brand-accent-cyan">
                <Layers className="w-6 h-6" />
              </div>
            </div>

            <div className="card p-5 bg-brand-bg-secondary border border-brand-border rounded-2xl flex items-center justify-between">
              <div>
                <span className="text-brand-text-muted text-xs font-semibold">Research Grants Allocated</span>
                <span className="block text-2xl font-bold font-display text-brand-accent-emerald mt-1">${totalResearchBudget.toLocaleString()}</span>
                <span className="text-[10px] text-brand-accent-emerald mt-1 block">5 Active & pending projects</span>
              </div>
              <div className="p-3 bg-brand-accent-emerald/10 rounded-xl text-brand-accent-emerald">
                <DollarSign className="w-6 h-6" />
              </div>
            </div>

            <div className="card p-5 bg-brand-bg-secondary border border-brand-border rounded-2xl flex items-center justify-between">
              <div>
                <span className="text-brand-text-muted text-xs font-semibold">Pending Dean Approvals</span>
                <span className="block text-2xl font-bold font-display text-brand-accent-amber mt-1">
                  {researchProjects.filter(p => p.status === 'Pending Dean Review').length} proposals
                </span>
                <span className="text-[10px] text-brand-accent-amber mt-1 block">Requires manual audit</span>
              </div>
              <div className="p-3 bg-brand-accent-amber/10 rounded-xl text-brand-accent-amber">
                <FileText className="w-6 h-6" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Timetable and Faculty Roster summary */}
            <div className="lg:col-span-2 card bg-brand-bg-secondary border border-brand-border rounded-2xl p-6 flex flex-col gap-4">
              <h3 className="text-base font-bold font-display text-white border-b border-brand-border/40 pb-3 flex items-center justify-between">
                <span>Recent Curriculum & Faculty Assignments</span>
                <span className="text-xs text-brand-text-muted">CS & EE Divisions</span>
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-brand-border/60 text-brand-text-subtle font-semibold">
                      <th className="pb-2.5">Faculty Member</th>
                      <th className="pb-2.5">Department</th>
                      <th className="pb-2.5">Weekly Workload</th>
                      <th className="pb-2.5">Active Courses</th>
                      <th className="pb-2.5 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {faculty.slice(0, 4).map(f => (
                      <tr key={f.id} className="border-b border-brand-border/30 hover:bg-white/[0.01] transition-all">
                        <td className="py-3 font-semibold text-white">{f.name}</td>
                        <td className="py-3 text-brand-text-muted font-mono">{f.dept}</td>
                        <td className="py-3 text-brand-text-muted font-mono">{f.workload || 12} hrs / wk</td>
                        <td className="py-3 text-brand-text-muted">{f.courses ? f.courses.join(', ') : 'None'}</td>
                        <td className="py-3 text-right">
                          <span className={`badge text-[9px] px-2 py-0.5 rounded font-mono ${
                            (f.workload || 0) > 15 ? 'bg-brand-accent-ruby/20 text-brand-accent-ruby' : 'bg-brand-accent-emerald/20 text-brand-accent-emerald'
                          }`}>
                            {(f.workload || 0) > 15 ? 'Heavy workload' : 'Balanced'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Dean Alerts Panel */}
            <div className="card bg-brand-bg-secondary border border-brand-border rounded-2xl p-6 flex flex-col gap-4">
              <h3 className="text-base font-bold font-display text-white border-b border-brand-border/40 pb-3 flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-brand-accent-ruby animate-pulse" />
                Deanery Notifications Hub
              </h3>
              <div className="flex flex-col gap-3.5 mt-2">
                <div className="p-3 bg-brand-bg-tertiary/40 border-l-2 border-brand-accent-ruby rounded-r-xl flex gap-3 text-xs leading-normal">
                  <div className="text-brand-accent-ruby font-bold shrink-0">CRITICAL</div>
                  <div>Syllabus completion rate in CS301 (Connor) is currently 60% compared to average target benchmarks.</div>
                </div>
                <div className="p-3 bg-brand-bg-tertiary/40 border-l-2 border-brand-accent-amber rounded-r-xl flex gap-3 text-xs leading-normal">
                  <div className="text-brand-accent-amber font-bold shrink-0">WARNING</div>
                  <div>EE201 Signals and Systems is behind schedule with only 45% completion rate.</div>
                </div>
                <div className="p-3 bg-brand-bg-tertiary/40 border-l-2 border-brand-primary rounded-r-xl flex gap-3 text-xs leading-normal">
                  <div className="text-brand-primary font-bold shrink-0">INFO</div>
                  <div>TensorFlow timetable optimizer neural network successfully initialized and training sandbox synced.</div>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* TAB 2: FACULTY & WORKLOADS */}
      {activeTab === 'faculty' && (
        <div className="card bg-brand-bg-secondary border border-brand-border rounded-2xl p-6 flex flex-col gap-6">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 border-b border-brand-border/40 pb-4">
            <h3 className="text-lg font-bold font-display text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-brand-primary" />
              University Faculty Registry
            </h3>

            <div className="flex flex-col sm:flex-row gap-3">
              {/* Department Filter */}
              <select 
                value={selectedDept}
                onChange={(e) => setSelectedDept(e.target.value)}
                className="bg-brand-bg-tertiary border border-brand-border rounded-xl text-white text-xs p-2.5 cursor-pointer outline-none focus:border-brand-primary"
              >
                <option value="ALL">All Academic Departments</option>
                <option value="CS">Computer Science (CS)</option>
                <option value="EE">Electrical Engineering (EE)</option>
                <option value="ME">Mechanical Engineering (ME)</option>
                <option value="BA">Business Administration (BA)</option>
              </select>

              {/* Search */}
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-3 w-4 h-4 text-brand-text-muted" />
                <input 
                  type="text"
                  placeholder="Search faculty..."
                  value={facultySearch}
                  onChange={(e) => setFacultySearch(e.target.value)}
                  className="bg-brand-bg-tertiary border border-brand-border rounded-xl pl-9 pr-4 py-2.5 text-xs text-white placeholder-brand-text-muted w-full focus:outline-none focus:border-brand-primary"
                />
              </div>
            </div>
          </div>

          {/* Faculty list */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredFaculty.map(fac => (
              <div key={fac.id} className="p-5 bg-brand-bg-tertiary border border-brand-border rounded-2xl flex flex-col justify-between transition-all hover:border-brand-primary/30">
                <div className="flex gap-4">
                  <img 
                    src={fac.avatar || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150"} 
                    alt={fac.name} 
                    className="w-12 h-12 rounded-xl object-cover border border-brand-border shrink-0" 
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex justify-between items-start">
                      <h4 className="text-sm font-bold text-white truncate m-0">{fac.name}</h4>
                      <span className="text-[10px] font-mono bg-brand-bg-secondary px-2 py-0.5 rounded font-bold border border-brand-border text-brand-primary">{fac.dept} Dept</span>
                    </div>
                    <span className="text-xs text-brand-accent-cyan block font-semibold mt-1">{fac.designation || 'Faculty Member'}</span>
                    <span className="text-[10px] text-brand-text-muted font-mono mt-0.5 block truncate">{fac.email}</span>
                  </div>
                </div>

                <div className="flex justify-between items-center mt-5 pt-3.5 border-t border-brand-border/40 text-xs">
                  <div className="flex gap-4">
                    <div>
                      <span className="text-brand-text-subtle text-[10px] block uppercase font-bold tracking-wide">Workload</span>
                      <span className="font-mono text-white font-bold">{fac.workload || 12} hrs / wk</span>
                    </div>
                    <div>
                      <span className="text-brand-text-subtle text-[10px] block uppercase font-bold tracking-wide">Salary Target</span>
                      <span className="font-mono text-brand-accent-emerald font-bold">${(fac.salary || 85000).toLocaleString()}</span>
                    </div>
                  </div>
                  <button 
                    onClick={() => startEditFaculty(fac)}
                    className="btn btn-secondary btn-xs cursor-pointer flex items-center gap-1"
                  >
                    <Edit className="w-3 h-3" />
                    Modify
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Edit Faculty Modal Overlay */}
          {editingFaculty && (
            <div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center z-[1000] p-4">
              <div className="bg-brand-bg-secondary border border-brand-border rounded-[20px] w-full max-w-[500px] p-6 flex flex-col gap-4 animate-scale-up">
                <div className="flex justify-between items-center border-b border-brand-border pb-3">
                  <h3 className="modal-title font-display text-lg font-bold text-white">Modify Faculty & Workloads</h3>
                  <button onClick={() => setEditingFaculty(null)} className="text-2xl text-brand-text-muted hover:text-white bg-transparent border-none cursor-pointer">&times;</button>
                </div>
                
                <form onSubmit={handleSaveFaculty} className="flex flex-col gap-4 text-xs">
                  <div className="form-group">
                    <label className="form-label text-brand-text-muted mb-1 block">Full Name</label>
                    <input 
                      type="text" 
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="form-control w-full bg-brand-bg-tertiary border border-brand-border rounded-xl p-2.5 text-white"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label text-brand-text-muted mb-1 block">Email ID</label>
                    <input 
                      type="email" 
                      value={editEmail}
                      onChange={(e) => setEditEmail(e.target.value)}
                      className="form-control w-full bg-brand-bg-tertiary border border-brand-border rounded-xl p-2.5 text-white"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="form-group">
                      <label className="form-label text-brand-text-muted mb-1 block">Academic Designation</label>
                      <select 
                        value={editDesignation}
                        onChange={(e) => setEditDesignation(e.target.value)}
                        className="form-control w-full bg-brand-bg-tertiary border border-brand-border rounded-xl p-2.5 text-white cursor-pointer"
                      >
                        <option value="Professor">Professor</option>
                        <option value="Associate Professor">Associate Professor</option>
                        <option value="Assistant Professor">Assistant Professor</option>
                        <option value="Lecturer">Lecturer</option>
                        <option value="Adviser">Adviser</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label className="form-label text-brand-text-muted mb-1 block">Department</label>
                      <select 
                        value={editDept}
                        onChange={(e) => setEditDept(e.target.value)}
                        className="form-control w-full bg-brand-bg-tertiary border border-brand-border rounded-xl p-2.5 text-white cursor-pointer"
                      >
                        <option value="CS">Computer Science</option>
                        <option value="EE">Electrical Engineering</option>
                        <option value="ME">Mechanical Engineering</option>
                        <option value="BA">Business Administration</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="form-group">
                      <label className="form-label text-brand-text-muted mb-1 block">Teaching Hours (Workload)</label>
                      <input 
                        type="number" 
                        min="0"
                        max="24"
                        value={editWorkload}
                        onChange={(e) => setEditWorkload(e.target.value)}
                        className="form-control w-full bg-brand-bg-tertiary border border-brand-border rounded-xl p-2.5 text-white"
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label text-brand-text-muted mb-1 block">Operating Salary ($)</label>
                      <input 
                        type="number" 
                        min="20000"
                        value={editSalary}
                        onChange={(e) => setEditSalary(e.target.value)}
                        className="form-control w-full bg-brand-bg-tertiary border border-brand-border rounded-xl p-2.5 text-white"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 border-t border-brand-border pt-4 mt-2">
                    <button type="button" onClick={() => setEditingFaculty(null)} className="btn btn-secondary cursor-pointer">Cancel</button>
                    <button type="submit" className="btn btn-primary cursor-pointer">Save Changes</button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: RESEARCH & GRANTS */}
      {activeTab === 'grants' && (
        <div className="flex flex-col gap-6">
          
          {/* Grant approval desk */}
          <div className="card bg-brand-bg-secondary border border-brand-border rounded-2xl p-6 flex flex-col gap-4">
            <h3 className="text-lg font-bold font-display text-white border-b border-brand-border/40 pb-3 flex items-center gap-2">
              <FileText className="w-5 h-5 text-brand-accent-cyan" />
              Research Project Grant Clearances
            </h3>
            <div className="flex flex-col gap-3.5">
              {researchProjects.map(proj => (
                <div key={proj.id} className="flex justify-between items-center p-4 bg-brand-bg-tertiary/60 border border-brand-border/40 rounded-xl text-xs">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-sm">{proj.title}</span>
                      <span className="badge text-[9px] px-2 py-0.5 rounded font-mono border border-brand-border text-brand-primary">{proj.dept}</span>
                    </div>
                    <span className="text-brand-text-muted">
                      Lead Investigator: <strong className="text-white font-medium">{proj.lead}</strong> | Budget Requested: <strong className="text-brand-accent-cyan font-mono font-bold">${proj.budget.toLocaleString()}</strong>
                    </span>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className={`badge text-[10px] px-2.5 py-0.5 rounded font-semibold ${
                      proj.status === 'Approved' ? 'bg-brand-accent-emerald/20 text-brand-accent-emerald' : 'bg-brand-accent-amber/20 text-brand-accent-amber animate-pulse'
                    }`}>
                      {proj.status}
                    </span>
                    {proj.status === 'Pending Dean Review' && (
                      <button 
                        onClick={() => handleApproveProject(proj.id)} 
                        className="btn btn-primary btn-sm flex items-center gap-1.5 cursor-pointer text-xs py-1 px-3"
                      >
                        <CheckCircle className="w-3.5 h-3.5" />
                        Approve Grant
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* AI Grants Projections */}
          <div className="card bg-brand-bg-secondary border border-brand-border rounded-2xl p-6">
            <div className="flex justify-between items-center border-b border-brand-border/40 pb-4 mb-5">
              <div>
                <h3 className="font-display flex items-center gap-2 m-0 text-lg font-bold text-white">
                  <TrendingUp className="w-5 h-5 text-brand-primary" />
                  AI Research Funding demand Projections (TF.js)
                </h3>
                <p className="text-xs text-brand-text-muted mt-1 m-0">
                  Run client-side linear regression weights to predict academic grant applications load.
                </p>
              </div>
              <span className="badge bg-brand-primary/10 text-brand-primary font-semibold text-xs py-1 px-3">TensorFlow.js Engine</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-8">
              {/* Controls */}
              <div className="flex flex-col gap-4 border-r border-brand-border pr-8 max-md:border-r-0 max-md:pr-0 text-xs">
                <div>
                  <label className="text-[10px] font-bold text-brand-text-muted uppercase tracking-wider block">Learning Rate</label>
                  <select
                    value={lr}
                    onChange={(e) => setLr(parseFloat(e.target.value))}
                    className="w-full bg-brand-bg-tertiary border border-brand-border rounded-xl text-white text-xs p-2.5 mt-1 cursor-pointer focus:outline-none focus:border-brand-primary"
                  >
                    <option value="0.01">0.01 (Slow)</option>
                    <option value="0.05">0.05 (Default)</option>
                    <option value="0.1">0.10 (Fast)</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-brand-text-muted uppercase tracking-wider block">Training Epochs</label>
                  <select
                    value={epochs}
                    onChange={(e) => setEpochs(parseInt(e.target.value))}
                    className="w-full bg-brand-bg-tertiary border border-brand-border rounded-xl text-white text-xs p-2.5 mt-1 cursor-pointer focus:outline-none focus:border-brand-primary"
                  >
                    <option value="50">50 Epochs</option>
                    <option value="150">150 Epochs</option>
                    <option value="300">300 Epochs</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-brand-text-muted uppercase tracking-wider block">Forecast Horizon</label>
                  <select
                    value={horizon}
                    onChange={(e) => setHorizon(parseInt(e.target.value))}
                    className="w-full bg-brand-bg-tertiary border border-brand-border rounded-xl text-white text-xs p-2.5 mt-1 cursor-pointer focus:outline-none focus:border-brand-primary"
                  >
                    <option value="1">1 Term (2026-B)</option>
                    <option value="2">2 Terms (2026-B & 2027-A)</option>
                    <option value="3">3 Terms (Up to 2027-B)</option>
                  </select>
                </div>

                <button
                  onClick={runTfTraining}
                  disabled={tfTraining}
                  className="btn btn-primary w-full cursor-pointer flex items-center justify-center gap-2 mt-2"
                >
                  <RefreshCw className={`w-4 h-4 ${tfTraining ? 'animate-spin' : ''}`} />
                  {tfTraining ? 'Training AI...' : 'Run Projections'}
                </button>

                <div className="p-3 bg-brand-bg-tertiary border border-brand-border rounded-xl flex flex-col gap-1.5 mt-2 text-[11px]">
                  <div className="flex justify-between"><span className="text-brand-text-muted">Status:</span><span className="font-bold text-white">{tfStatus}</span></div>
                  <div className="flex justify-between"><span className="text-brand-text-muted">Regression Formula:</span><span className="font-mono text-brand-accent-amber font-bold">{tfEquation}</span></div>
                  {tfTraining && (
                    <div className="mt-2">
                      <div className="flex justify-between text-[10px] text-brand-text-muted"><span>Loss: {tfLossDisp}</span><span>Epoch: {tfEpochDisp}</span></div>
                      <div className="w-full bg-brand-bg-secondary h-1 rounded-full mt-1 overflow-hidden">
                        <div className="bg-brand-primary h-full transition-[width] duration-100" style={{ width: `${tfProgress}%` }}></div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Chart container */}
              <div className="flex flex-col h-[350px]">
                <h4 className="text-sm font-semibold text-white m-0 mb-3 flex justify-between">
                  <span>Funding Trend Projection</span>
                  <span className="text-[10px] text-brand-text-subtle font-mono uppercase">Sepolia Sandbox Proof</span>
                </h4>
                <div className="flex-1 relative min-h-0">
                  <canvas ref={forecastCanvasRef}></canvas>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* TAB 4: ACADEMIC METRICS */}
      {activeTab === 'metrics' && (
        <div className="flex flex-col gap-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Faculty Workload Chart */}
            <div className="lg:col-span-2 card p-6 bg-brand-bg-secondary border border-brand-border rounded-2xl flex flex-col h-[380px]">
              <h3 className="mb-4 font-display text-base font-bold text-white border-b border-brand-border/40 pb-3 flex justify-between items-center">
                <span>Faculty Division Workloads</span>
                <select 
                  value={selectedDept}
                  onChange={(e) => setSelectedDept(e.target.value)}
                  className="bg-brand-bg-tertiary border border-brand-border rounded-xl text-white text-[10px] font-bold p-1 px-2.5 outline-none cursor-pointer"
                >
                  <option value="ALL">All Depts</option>
                  <option value="CS">CS</option>
                  <option value="EE">EE</option>
                  <option value="ME">ME</option>
                  <option value="BA">BA</option>
                </select>
              </h3>
              <div className="flex-1 relative min-h-0">
                <canvas ref={workloadCanvasRef}></canvas>
              </div>
            </div>

            {/* Department budgets target metrics */}
            <div className="card p-6 bg-brand-bg-secondary border border-brand-border rounded-2xl flex flex-col gap-4">
              <h3 className="m-0 font-display text-base font-bold text-white border-b border-brand-border/40 pb-3">Division Allocation Budgets</h3>
              <div className="flex flex-col gap-4 mt-2 text-xs">
                <div>
                  <div className="flex justify-between font-semibold mb-1 text-brand-text-muted">
                    <span>Computer Science (CS)</span>
                    <span className="font-mono text-white">$450,000 / $600,000 (75%)</span>
                  </div>
                  <div className="bg-brand-bg-primary h-2 rounded-full overflow-hidden w-full border border-brand-border">
                    <div className="bg-brand-primary h-full rounded-full" style={{ width: '75%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between font-semibold mb-1 text-brand-text-muted">
                    <span>Electrical Engineering (EE)</span>
                    <span className="font-mono text-white">$320,000 / $450,000 (71.1%)</span>
                  </div>
                  <div className="bg-brand-bg-primary h-2 rounded-full overflow-hidden w-full border border-brand-border">
                    <div className="bg-brand-accent-cyan h-full rounded-full" style={{ width: '71.1%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between font-semibold mb-1 text-brand-text-muted">
                    <span>Mechanical Engineering (ME)</span>
                    <span className="font-mono text-white">$210,000 / $350,000 (60%)</span>
                  </div>
                  <div className="bg-brand-bg-primary h-2 rounded-full overflow-hidden w-full border border-brand-border">
                    <div className="bg-brand-accent-emerald h-full rounded-full" style={{ width: '60%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between font-semibold mb-1 text-brand-text-muted">
                    <span>Business Administration (BA)</span>
                    <span className="font-mono text-white">$150,000 / $250,000 (60%)</span>
                  </div>
                  <div className="bg-brand-bg-primary h-2 rounded-full overflow-hidden w-full border border-brand-border">
                    <div className="bg-brand-accent-amber h-full rounded-full" style={{ width: '60%' }}></div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
