'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useDb } from '../../../context/db-context';
import {
  GraduationCap,
  Users,
  Calendar as CalendarIcon,
  Megaphone,
  FileText,
  CheckCircle,
  XCircle,
  Clock,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Activity,
  Sliders,
  Download,
  Plus,
  Trash2,
  Building2,
  Cpu,
  ShieldCheck,
  BarChart3,
  RefreshCw,
  Search,
  Filter,
  Sparkles,
  BookOpen,
  Layers,
  AlertCircle,
  PieChart,
  BrainCircuit,
  Zap,
  Play,
  Settings,
  ChevronRight,
  Maximize2,
  CheckSquare,
  Square,
  ListTodo,
  Award,
  BookMarked,
  UserCheck,
  Briefcase,
  User
} from 'lucide-react';

export default function UniversityAdminDashboard() {
  const {
    students = [],
    faculty = [],
    departments = [],
    courses = [],
    transactions = [],
    exams = [],
    announcements = [],
    addAnnouncement,
    deleteAnnouncement
  } = useDb() || {};

  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Active Role View Selector (Admin, Faculty, Student, Dean)
  const [activeRoleView, setActiveRoleView] = useState('admin');

  // --- COMMON TASKS & CALENDAR STATE ---
  const [tasks, setTasks] = useState([
    { id: 1, text: 'Approve graduation transcripts for STU006 PATEL', priority: 'High', done: false },
    { id: 2, text: 'Audit Stripe collection batch receipts for fee payments', priority: 'Medium', done: true },
    { id: 3, text: 'Verify blockchain credential hashes for CS101 course completions', priority: 'Low', done: false }
  ]);
  const [newTaskText, setNewTaskText] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState('Medium');

  const [events, setEvents] = useState([
    { id: 1, date: '2026-06-15', title: 'Semester Term Exams start', type: 'Exam' },
    { id: 2, date: '2026-06-28', title: 'Course Registration Deadline', type: 'Academic' },
    { id: 3, date: '2026-07-01', title: 'Summer Recess begins', type: 'Holiday' }
  ]);
  const [showEventForm, setShowEventForm] = useState(false);
  const [newEvent, setNewEvent] = useState({ title: '', date: '2026-07-15', type: 'Academic' });

  // Tab State for Notices vs Audit Logs
  const [noticeLogTab, setNoticeLogTab] = useState('notices');

  // --- ADMISSIONS FLOW STATE ---
  const [admissions, setAdmissions] = useState([
    { id: 'adm_101', name: 'Alexander Wright', major: 'Computer Science & AI', gpa: 3.92, status: 'Pending Review', date: '2026-07-24' },
    { id: 'adm_102', name: 'Sophia Loren', major: 'Genetics & Biotechnology', gpa: 3.88, status: 'Accepted', date: '2026-07-23' },
    { id: 'adm_103', name: 'Robert Downey Jr.', major: 'Business Administration', gpa: 3.45, status: 'Pending Review', date: '2026-07-22' },
    { id: 'adm_104', name: 'Elena Rostova', major: 'Quantum Computing', gpa: 3.96, status: 'Waitlisted', date: '2026-07-21' },
    { id: 'adm_105', name: 'Marcus Chen', major: 'Mechanical Engineering', gpa: 3.75, status: 'Accepted', date: '2026-07-20' }
  ]);
  const [admissionFilter, setAdmissionFilter] = useState('All');
  const [admissionSearch, setAdmissionSearch] = useState('');
  const [showAddAdmissionModal, setShowAddAdmissionModal] = useState(false);
  const [newApplicant, setNewApplicant] = useState({ name: '', major: 'Computer Science', gpa: '3.80' });

  // --- ANNOUNCEMENT MODAL STATE ---
  const [showNoticeModal, setShowNoticeModal] = useState(false);
  const [newNotice, setNewNotice] = useState({ title: '', tag: 'Academic', content: '', priority: 'Normal' });

  // --- TENSORFLOW & SIMULATION PARAMETERS ---
  const [enrolmentGrowth, setEnrolmentGrowth] = useState(8);
  const [tuitionFeeChange, setTuitionFeeChange] = useState(4);
  const [tfEpochs, setTfEpochs] = useState(150);
  const [tfLearningRate, setTfLearningRate] = useState(0.05);
  const [tfHorizon, setTfHorizon] = useState(2);
  const [isTraining, setIsTraining] = useState(false);
  const [trainingProgress, setTrainingProgress] = useState(150);
  const [currentLoss, setCurrentLoss] = useState(0.00014);
  const [tfEquation, setTfEquation] = useState('y = 48.2x + 1820');
  const [showTfDiagramModal, setShowTfDiagramModal] = useState(false);

  // Hover states for charts
  const [hoverChart1, setHoverChart1] = useState(null);
  const [hoverDonut, setHoverDonut] = useState(null);

  // Telemetry real-time tick
  const [telemetry, setTelemetry] = useState({ cpu: 24, ramPercent: 64, ramUsed: '5.12', latency: 12, aiLoadText: 'Stable (~18%)', aiClass: 'text-brand-accent-emerald' });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const session = sessionStorage.getItem('campusx_erp_session');
      if (session) {
        try {
          const parsed = JSON.parse(session);
          setCurrentUser(parsed);
          if (parsed.role) {
            setActiveRoleView(parsed.role === 'superadmin' ? 'admin' : parsed.role);
          }
        } catch (e) {
          console.error(e);
        }
      } else {
        setCurrentUser({ name: 'System Administrator', role: 'admin', department: 'University Governance' });
      }
      setLoading(false);
    }

    const interval = setInterval(() => {
      const cpu = Math.floor(18 + Math.random() * 20);
      const latency = Math.floor(9 + Math.random() * 10);
      const ramP = (62 + Math.random() * 4).toFixed(1);
      const ramU = (8 * parseFloat(ramP) / 100).toFixed(2);
      
      let aiText = 'Stable (~18%)';
      let aiCls = 'text-brand-accent-emerald font-bold';
      if (cpu > 35) {
        aiText = `Elevated (~${Math.round(cpu * 1.2)}%)`;
        aiCls = 'text-brand-accent-amber font-bold';
      }

      setTelemetry({
        cpu,
        ramPercent: parseFloat(ramP),
        ramUsed: ramU,
        latency,
        aiLoadText: aiText,
        aiClass: aiCls
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // TensorFlow Retraining
  const handleTrainTensorFlow = () => {
    setIsTraining(true);
    setTrainingProgress(0);
    let step = 0;
    const interval = setInterval(() => {
      step += 10;
      setTrainingProgress(step);
      const l = +(0.08 * Math.exp(-step / (tfEpochs * 0.2)) + 0.00012).toFixed(5);
      setCurrentLoss(l);

      if (step >= tfEpochs) {
        clearInterval(interval);
        setIsTraining(false);
        setTfEquation(`y = ${(45 + Math.random() * 6).toFixed(1)}x + ${Math.round(1800 + Math.random() * 50)}`);
      }
    }, 60);
  };

  // --- TASK & CALENDAR HANDLERS ---
  const handleToggleTask = (id) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t));
  };

  const handleAddTask = (e) => {
    e.preventDefault();
    if (!newTaskText.trim()) return;
    setTasks(prev => [...prev, { id: Date.now(), text: newTaskText.trim(), priority: newTaskPriority, done: false }]);
    setNewTaskText('');
  };

  const handleDeleteTask = (id) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  const handleAddEvent = (e) => {
    e.preventDefault();
    if (!newEvent.title.trim()) return;
    setEvents(prev => [...prev, { id: Date.now(), title: newEvent.title.trim(), date: newEvent.date, type: newEvent.type }]);
    setNewEvent({ title: '', date: '2026-07-15', type: 'Academic' });
    setShowEventForm(false);
  };

  const handleDeleteEvent = (id) => {
    setEvents(prev => prev.filter(ev => ev.id !== id));
  };

  // --- ADMISSIONS HANDLERS ---
  const handleAdmissionStatusChange = (id, newStatus) => {
    setAdmissions(prev => prev.map(a => a.id === id ? { ...a, status: newStatus } : a));
  };

  const handleCreateApplicant = (e) => {
    e.preventDefault();
    if (!newApplicant.name) return;
    const created = {
      id: `adm_${Date.now()}`,
      name: newApplicant.name,
      major: newApplicant.major,
      gpa: parseFloat(newApplicant.gpa) || 3.80,
      status: 'Pending Review',
      date: new Date().toISOString().split('T')[0]
    };
    setAdmissions(prev => [created, ...prev]);
    setNewApplicant({ name: '', major: 'Computer Science', gpa: '3.80' });
    setShowAddAdmissionModal(false);
  };

  // --- ANNOUNCEMENT HANDLERS ---
  const handleCreateNotice = (e) => {
    e.preventDefault();
    if (!newNotice.title || !newNotice.content) return;
    const annObj = {
      id: `ann_${Date.now()}`,
      title: newNotice.title,
      tag: newNotice.tag.toUpperCase(),
      content: newNotice.content,
      date: new Date().toISOString().split('T')[0],
      priority: newNotice.priority,
      color: newNotice.priority === 'High' ? '#ef4444' : newNotice.tag === 'Alert' ? '#f59e0b' : '#3b82f6'
    };
    if (addAnnouncement) {
      addAnnouncement(annObj);
    }
    setNewNotice({ title: '', tag: 'Academic', content: '', priority: 'Normal' });
    setShowNoticeModal(false);
  };

  const handleDeleteNotice = (id) => {
    if (deleteAnnouncement) {
      deleteAnnouncement(id);
    }
  };

  // Filtered Admissions
  const filteredAdmissions = useMemo(() => {
    return admissions.filter(adm => {
      const matchesFilter = admissionFilter === 'All' || adm.status === admissionFilter;
      const matchesSearch = adm.name.toLowerCase().includes(admissionSearch.toLowerCase()) ||
                            adm.major.toLowerCase().includes(admissionSearch.toLowerCase());
      return matchesFilter && matchesSearch;
    });
  }, [admissions, admissionFilter, admissionSearch]);

  // --- DATA COMPUTATIONS FOR CHARTS ---
  const adminEnrollmentData = useMemo(() => {
    const baseCount = students.length > 0 ? students.length * 2 : 2450;
    return [
      { sem: '2022-A', count: Math.round(baseCount * 0.74) },
      { sem: '2022-B', count: Math.round(baseCount * 0.79) },
      { sem: '2023-A', count: Math.round(baseCount * 0.84) },
      { sem: '2023-B', count: Math.round(baseCount * 0.89) },
      { sem: '2024-A', count: Math.round(baseCount * 0.92) },
      { sem: '2024-B', count: Math.round(baseCount * 0.96) },
      { sem: '2025-A', count: Math.round(baseCount * 0.98) },
      { sem: '2025-B', count: baseCount },
      { sem: '2026-A', count: Math.round(baseCount * (1 + enrolmentGrowth / 100)) }
    ];
  }, [students, enrolmentGrowth]);

  const adminDonutData = useMemo(() => {
    if (departments.length > 0 && students.length > 0) {
      const counts = {};
      students.forEach(s => {
        const d = s.dept || 'Computer Science';
        counts[d] = (counts[d] || 0) + 1;
      });
      const colors = ['#3b82f6', '#06b6d4', '#10b981', '#f59e0b', '#a855f7', '#ec4899'];
      const entries = Object.entries(counts);
      if (entries.length > 0) {
        return entries.map(([dept, count], idx) => ({
          dept,
          count,
          color: colors[idx % colors.length]
        }));
      }
    }
    return [
      { dept: 'Computer Science', count: 840, color: '#3b82f6' },
      { dept: 'Business Admin', count: 620, color: '#06b6d4' },
      { dept: 'Genetics & Bio', count: 410, color: '#10b981' },
      { dept: 'Mechanical Eng', count: 380, color: '#f59e0b' },
      { dept: 'Quantum Computing', count: 200, color: '#a855f7' }
    ];
  }, [students, departments]);

  const facultyGradeDistribution = useMemo(() => [
    { grade: 'Grade A (3.7-4.0)', count: 68, color: '#10b981' },
    { grade: 'Grade B (3.0-3.6)', count: 84, color: '#3b82f6' },
    { grade: 'Grade C (2.0-2.9)', count: 24, color: '#f59e0b' },
    { grade: 'Grade D/F (< 2.0)', count: 8, color: '#ef4444' }
  ], []);

  const studentGpaTrend = useMemo(() => [
    { sem: 'Fall 2024', gpa: 3.65 },
    { sem: 'Spring 2025', gpa: 3.74 },
    { sem: 'Fall 2025', gpa: 3.82 },
    { sem: 'Spring 2026', gpa: 3.88 }
  ], []);

  const deanGrantDistribution = useMemo(() => [
    { field: 'AI & Quantum Lab', grant: 4.8, color: '#a855f7' },
    { field: 'Genetics & Medical', grant: 3.2, color: '#10b981' },
    { field: 'Clean Energy & IoT', grant: 2.9, color: '#06b6d4' },
    { field: 'Robotics & Automation', grant: 2.1, color: '#f59e0b' }
  ], []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3 text-brand-primary">
          <RefreshCw className="w-8 h-8 animate-spin" />
          <span className="text-sm font-semibold tracking-wide">Loading User Dashboard Portal...</span>
        </div>
      </div>
    );
  }

  // Dynamic Dashboard Title & Badge based on Active Role View
  const roleTitleMap = {
    admin: { title: 'University Admin Dashboard', badge: 'Executive Governance', icon: GraduationCap, color: 'text-brand-primary' },
    faculty: { title: 'Faculty Academic Dashboard', badge: 'Instruction & Course Control', icon: BookOpen, color: 'text-brand-accent-cyan' },
    student: { title: 'Student Academic Portal', badge: 'Learning & Progress Desk', icon: Award, color: 'text-brand-accent-emerald' },
    dean: { title: 'Dean & Institutional Governance', badge: 'Faculty & Research Leadership', icon: Building2, color: 'text-brand-accent-amber' }
  };

  const activeRoleInfo = roleTitleMap[activeRoleView] || roleTitleMap.admin;
  const RoleHeaderIcon = activeRoleInfo.icon;

  return (
    <div className="flex flex-col gap-6 md:gap-8 fade-in pb-16 font-sans">
      {/* Dynamic Header & Live Role Switcher */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-brand-border/40">
        <div className="flex items-center gap-3.5">
          <div className="p-3 bg-brand-primary/15 border border-brand-primary/30 rounded-2xl text-brand-primary shadow-lg shadow-brand-primary/10">
            <RoleHeaderIcon className={`w-8 h-8 ${activeRoleInfo.color}`} />
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-2xl md:text-3xl font-display font-bold text-white tracking-tight">
                {activeRoleInfo.title}
              </h1>
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-brand-primary/20 text-brand-primary border border-brand-primary/40">
                {activeRoleInfo.badge}
              </span>
            </div>
            <p className="text-brand-text-muted text-xs md:text-sm mt-0.5">
              Welcome back, {currentUser?.name || 'User'}. Customized analytics, performance metrics, and role operational tools.
            </p>
          </div>
        </div>

        {/* Interactive Role View Selector */}
        <div className="flex items-center gap-2 bg-brand-bg-secondary border border-brand-border p-1.5 rounded-2xl self-start lg:self-auto shadow-sm">
          <span className="text-[10px] font-mono text-brand-text-muted font-bold uppercase tracking-wider px-2 shrink-0 flex items-center gap-1">
            <User className="w-3.5 h-3.5 text-brand-primary" /> Active View:
          </span>
          {[
            { id: 'admin', label: 'Admin' },
            { id: 'faculty', label: 'Faculty' },
            { id: 'student', label: 'Student' },
            { id: 'dean', label: 'Dean' }
          ].map(r => (
            <button
              key={r.id}
              onClick={() => setActiveRoleView(r.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeRoleView === r.id
                  ? 'bg-brand-primary text-white shadow-md shadow-brand-primary/20 font-bold'
                  : 'text-brand-text-muted hover:text-white hover:bg-brand-bg-tertiary'
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 1. ADMIN ROLE VIEW */}
      {/* ========================================================================= */}
      {activeRoleView === 'admin' && (
        <div className="flex flex-col gap-6 animate-fade-in">
          {/* Top Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="card p-4 bg-brand-bg-secondary border border-brand-border rounded-2xl flex items-center justify-between">
              <div>
                <span className="text-brand-text-muted text-[11px] font-semibold uppercase tracking-wider">Active Enrollment</span>
                <span className="block text-2xl font-bold font-display text-white mt-1">
                  {(students.length > 0 ? students.length * 15 : 2450).toLocaleString()}
                </span>
                <span className="text-[10px] text-brand-accent-emerald font-medium mt-1 block">▲ +4.8% Sem Forecast</span>
              </div>
              <div className="p-3 bg-brand-primary/10 rounded-2xl text-brand-primary">
                <GraduationCap className="w-5 h-5" />
              </div>
            </div>

            <div className="card p-4 bg-brand-bg-secondary border border-brand-border rounded-2xl flex items-center justify-between">
              <div>
                <span className="text-brand-text-muted text-[11px] font-semibold uppercase tracking-wider">Faculty Roster</span>
                <span className="block text-2xl font-bold font-display text-brand-accent-cyan mt-1">
                  {faculty.length > 0 ? faculty.length * 5 : 160}
                </span>
                <span className="text-[10px] text-brand-accent-cyan font-medium mt-1 block">15:1 Student Ratio</span>
              </div>
              <div className="p-3 bg-brand-accent-cyan/10 rounded-2xl text-brand-accent-cyan">
                <Users className="w-5 h-5" />
              </div>
            </div>

            <div className="card p-4 bg-brand-bg-secondary border border-brand-border rounded-2xl flex items-center justify-between">
              <div>
                <span className="text-brand-text-muted text-[11px] font-semibold uppercase tracking-wider">Attendance Rate</span>
                <span className="block text-2xl font-bold font-display text-brand-accent-emerald mt-1">94.2%</span>
                <span className="text-[10px] text-brand-accent-emerald font-medium mt-1 block">▲ +1.2% Weekly Gain</span>
              </div>
              <div className="p-3 bg-brand-accent-emerald/10 rounded-2xl text-brand-accent-emerald">
                <ShieldCheck className="w-5 h-5" />
              </div>
            </div>

            <div className="card p-4 bg-brand-bg-secondary border border-brand-border rounded-2xl flex items-center justify-between">
              <div>
                <span className="text-brand-text-muted text-[11px] font-semibold uppercase tracking-wider">Admissions Queue</span>
                <span className="block text-2xl font-bold font-display text-brand-accent-amber mt-1">
                  {admissions.filter(a => a.status === 'Pending Review').length} Pending
                </span>
                <span className="text-[10px] text-brand-accent-amber font-medium mt-1 block">Avg response 1.4 days</span>
              </div>
              <div className="p-3 bg-brand-accent-amber/10 rounded-2xl text-brand-accent-amber">
                <FileText className="w-5 h-5" />
              </div>
            </div>

            <div className="card p-4 bg-brand-bg-secondary border border-brand-border rounded-2xl flex items-center justify-between">
              <div>
                <span className="text-brand-text-muted text-[11px] font-semibold uppercase tracking-wider">Total Collections</span>
                <span className="block text-2xl font-bold font-display text-brand-accent-emerald mt-1">$38.5M</span>
                <span className="text-[10px] text-brand-accent-emerald font-medium mt-1 block">92.3% Targeted</span>
              </div>
              <div className="p-3 bg-brand-accent-emerald/10 rounded-2xl text-brand-accent-emerald">
                <DollarSign className="w-5 h-5" />
              </div>
            </div>
          </div>

          {/* Core Analytics Grid: Enrollment Line Chart & Department Donut */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7 card bg-brand-bg-secondary border border-brand-border rounded-2xl p-5 flex flex-col gap-3 shadow-sm">
              <div className="flex justify-between items-center border-b border-brand-border/30 pb-2">
                <div>
                  <h3 className="text-sm font-bold text-white">Enrollment Growth & Multi-Year Trend</h3>
                  <p className="text-[11px] text-brand-text-muted mt-0.5">Historical semester registration analytics (2022-A to 2026-A)</p>
                </div>
                <span className="text-[10px] font-mono text-brand-primary bg-brand-primary/10 border border-brand-primary/20 px-2 py-0.5 rounded font-semibold">
                  Analytics
                </span>
              </div>

              <div className="w-full overflow-hidden">
                <svg viewBox="0 0 450 170" className="w-full h-auto">
                  <defs>
                    <linearGradient id="adminEnrolGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.35" />
                      <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>

                  {[0.25, 0.5, 0.75].map((r, i) => (
                    <line key={i} x1="35" y1={20 + r * 120} x2="425" y2={20 + r * 120} stroke="rgba(255,255,255,0.08)" strokeDasharray="3 3" />
                  ))}

                  {(() => {
                    const pts = adminEnrollmentData.map((d, i) => {
                      const x = 35 + (i / (adminEnrollmentData.length - 1)) * 390;
                      const y = 140 - ((d.count - 1500) / 1300) * 110;
                      return `${x},${y}`;
                    }).join(' ');

                    return (
                      <>
                        <polygon points={`35,140 ${pts} 425,140`} fill="url(#adminEnrolGrad)" />
                        <polyline points={pts} fill="none" stroke="#3b82f6" strokeWidth="2.5" />
                        {adminEnrollmentData.map((d, i) => {
                          const x = 35 + (i / (adminEnrollmentData.length - 1)) * 390;
                          const y = 140 - ((d.count - 1500) / 1300) * 110;
                          return (
                            <g key={i}>
                              <circle cx={x} cy={y} r="3.5" fill="#3b82f6" stroke="#1d4ed8" strokeWidth="1.5" />
                              <text x={x} y="156" fill="#94a3b8" fontSize="8" textAnchor="middle" fontFamily="monospace">
                                {d.sem}
                              </text>
                            </g>
                          );
                        })}
                      </>
                    );
                  })()}
                </svg>
              </div>

              <div className="flex justify-between items-center text-[10px] font-mono text-slate-300 pt-1 border-t border-brand-border/20">
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 bg-blue-500 rounded-full inline-block"></span> Enrolled Students</span>
                <span className="text-blue-400 font-bold">Current Total: {adminEnrollmentData[adminEnrollmentData.length - 1].count} Students</span>
              </div>
            </div>

            <div className="lg:col-span-5 card bg-brand-bg-secondary border border-brand-border rounded-2xl p-5 flex flex-col gap-3 shadow-sm">
              <div className="flex justify-between items-center border-b border-brand-border/30 pb-2">
                <div>
                  <h3 className="text-sm font-bold text-white">Department Student Distribution</h3>
                  <p className="text-[11px] text-brand-text-muted mt-0.5">Faculty major capacity breakdown</p>
                </div>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded font-semibold">
                  Distribution
                </span>
              </div>

              <div className="w-full overflow-hidden flex items-center justify-center py-1">
                <svg viewBox="0 0 450 170" className="w-full h-auto">
                  {(() => {
                    const total = adminDonutData.reduce((acc, d) => acc + d.count, 0);
                    let startAngle = 0;
                    const cx = 130;
                    const cy = 80;
                    const r = 58;
                    const rInner = 34;

                    return (
                      <g>
                        {adminDonutData.map((d, i) => {
                          const sliceAngle = (d.count / total) * 2 * Math.PI;
                          const endAngle = startAngle + sliceAngle;

                          const x1 = cx + r * Math.cos(startAngle);
                          const y1 = cy + r * Math.sin(startAngle);
                          const x2 = cx + r * Math.cos(endAngle);
                          const y2 = cy + r * Math.sin(endAngle);

                          const x1In = cx + rInner * Math.cos(startAngle);
                          const y1In = cy + rInner * Math.sin(startAngle);
                          const x2In = cx + rInner * Math.cos(endAngle);
                          const y2In = cy + rInner * Math.sin(endAngle);

                          const largeArc = sliceAngle > Math.PI ? 1 : 0;
                          const pathData = `M ${x1In} ${y1In} L ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2} L ${x2In} ${x2In} L ${x2In} ${y2In} A ${rInner} ${rInner} 0 ${largeArc} 0 ${x1In} ${y1In} Z`;

                          startAngle = endAngle;

                          return (
                            <path
                              key={i}
                              d={pathData}
                              fill={d.color}
                              stroke="#0f172a"
                              strokeWidth="1.5"
                              className="cursor-pointer hover:opacity-90 transition-all"
                            />
                          );
                        })}

                        <text x={cx} y={cy - 4} fill="#ffffff" fontSize="13" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">
                          {total.toLocaleString()}
                        </text>
                        <text x={cx} y={cy + 12} fill="#94a3b8" fontSize="8" textAnchor="middle" fontFamily="monospace">
                          STUDENTS
                        </text>

                        {adminDonutData.map((d, i) => (
                          <g key={`leg_${i}`} transform={`translate(240, ${25 + i * 26})`}>
                            <rect x="0" y="0" width="12" height="12" rx="3" fill={d.color} />
                            <text x="18" y="10" fill="#ffffff" fontSize="10" fontWeight="600" fontFamily="sans-serif">
                              {d.dept}
                            </text>
                            <text x="170" y="10" fill="#94a3b8" fontSize="10" fontFamily="monospace" textAnchor="end">
                              {d.count} ({Math.round((d.count / total) * 100)}%)
                            </text>
                          </g>
                        ))}
                      </g>
                    );
                  })()}
                </svg>
              </div>
            </div>
          </div>

          {/* TensorFlow AI Machine Learning Section */}
          <div className="card bg-brand-bg-secondary border border-brand-border rounded-2xl p-5 flex flex-col gap-4 shadow-sm">
            <div className="flex justify-between items-center border-b border-brand-border/30 pb-3">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2 m-0">
                  <BrainCircuit className="w-4 h-4 text-brand-primary" />
                  TensorFlow AI Enrollment Regression Forecasting Engine
                </h3>
                <p className="text-[11px] text-brand-text-muted mt-0.5">In-browser neural regression model for term forecast</p>
              </div>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full font-bold">
                TensorFlow.js Engine
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-center">
              <div className="lg:col-span-4 bg-brand-bg-tertiary/40 border border-brand-border/50 rounded-xl p-4 flex flex-col gap-3 text-xs">
                <div className="flex justify-between text-xs">
                  <span className="text-white font-semibold">Training Epochs</span>
                  <span className="font-mono text-brand-primary font-bold">{tfEpochs} Epochs</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="300"
                  step="50"
                  value={tfEpochs}
                  onChange={(e) => setTfEpochs(parseInt(e.target.value))}
                  className="w-full accent-brand-primary cursor-pointer h-1.5 bg-brand-bg-primary rounded-lg"
                />

                <div className="flex justify-between text-[11px] font-mono">
                  <span className="text-brand-text-muted">Loss:</span>
                  <span className="text-amber-400 font-bold">{currentLoss}</span>
                </div>

                <div className="flex justify-between text-[11px] font-mono">
                  <span className="text-brand-text-muted">Fit Equation:</span>
                  <span className="text-emerald-400 font-bold">{tfEquation}</span>
                </div>

                <button
                  onClick={handleTrainTensorFlow}
                  disabled={isTraining}
                  className="btn btn-primary w-full py-2 text-xs font-bold flex items-center justify-center gap-2 cursor-pointer shadow-md mt-1"
                >
                  {isTraining ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5 fill-white" />}
                  {isTraining ? `Training (${trainingProgress}/${tfEpochs})` : 'Run ML Projection'}
                </button>
              </div>

              <div className="lg:col-span-8 p-3 bg-brand-bg-primary/80 border border-brand-border rounded-xl">
                <div className="text-[11px] font-bold text-white mb-2 flex justify-between">
                  <span>ML Projected Enrollment Horizon</span>
                  <span className="text-amber-400 font-mono">Trained Neural Predictor</span>
                </div>
                <div className="w-full overflow-hidden">
                  <svg viewBox="0 0 480 140" className="w-full h-auto">
                    <polyline points="35,110 120,95 205,80 290,70 375,50 450,35" fill="none" stroke="#10b981" strokeWidth="2.5" />
                    <polyline points="35,115 120,98 205,82 290,68 375,48 450,30" fill="none" stroke="#f59e0b" strokeWidth="2" strokeDasharray="4 3" />
                    {['2024-A', '2024-B', '2025-A', '2025-B', '2026-A', '2026-B (Forecast)'].map((lbl, i) => (
                      <g key={i}>
                        <circle cx={35 + i * 83} cy={110 - i * 15} r="3.5" fill="#10b981" />
                        <text x={35 + i * 83} y="132" fill="#94a3b8" fontSize="7.5" textAnchor="middle" fontFamily="monospace">{lbl}</text>
                      </g>
                    ))}
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. FACULTY ROLE VIEW */}
      {/* ========================================================================= */}
      {activeRoleView === 'faculty' && (
        <div className="flex flex-col gap-6 animate-fade-in">
          {/* Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="card p-4 bg-brand-bg-secondary border border-brand-border rounded-2xl flex items-center justify-between">
              <div>
                <span className="text-brand-text-muted text-[11px] font-semibold uppercase tracking-wider">Assigned Courses</span>
                <span className="block text-2xl font-bold font-display text-white mt-1">4 Active</span>
                <span className="text-[10px] text-brand-accent-cyan font-medium mt-1 block">CS101, CS302, AI405, DS201</span>
              </div>
              <div className="p-3 bg-brand-accent-cyan/10 rounded-2xl text-brand-accent-cyan">
                <BookOpen className="w-5 h-5" />
              </div>
            </div>

            <div className="card p-4 bg-brand-bg-secondary border border-brand-border rounded-2xl flex items-center justify-between">
              <div>
                <span className="text-brand-text-muted text-[11px] font-semibold uppercase tracking-wider">Total Enrolled Students</span>
                <span className="block text-2xl font-bold font-display text-brand-primary mt-1">184 Students</span>
                <span className="text-[10px] text-brand-primary font-medium mt-1 block">4 Cohorts</span>
              </div>
              <div className="p-3 bg-brand-primary/10 rounded-2xl text-brand-primary">
                <Users className="w-5 h-5" />
              </div>
            </div>

            <div className="card p-4 bg-brand-bg-secondary border border-brand-border rounded-2xl flex items-center justify-between">
              <div>
                <span className="text-brand-text-muted text-[11px] font-semibold uppercase tracking-wider">Class Attendance Avg</span>
                <span className="block text-2xl font-bold font-display text-brand-accent-emerald mt-1">96.2%</span>
                <span className="text-[10px] text-brand-accent-emerald font-medium mt-1 block">High engagement</span>
              </div>
              <div className="p-3 bg-brand-accent-emerald/10 rounded-2xl text-brand-accent-emerald">
                <UserCheck className="w-5 h-5" />
              </div>
            </div>

            <div className="card p-4 bg-brand-bg-secondary border border-brand-border rounded-2xl flex items-center justify-between">
              <div>
                <span className="text-brand-text-muted text-[11px] font-semibold uppercase tracking-wider">Grading Queue</span>
                <span className="block text-2xl font-bold font-display text-brand-accent-amber mt-1">12 Pending</span>
                <span className="text-[10px] text-brand-accent-amber font-medium mt-1 block">Midterm Lab Reports</span>
              </div>
              <div className="p-3 bg-brand-accent-amber/10 rounded-2xl text-brand-accent-amber">
                <FileText className="w-5 h-5" />
              </div>
            </div>
          </div>

          {/* Faculty Custom Analytics Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Grade Distribution */}
            <div className="lg:col-span-7 card bg-brand-bg-secondary border border-brand-border rounded-2xl p-5 flex flex-col gap-3 shadow-sm">
              <div className="flex justify-between items-center border-b border-brand-border/30 pb-2">
                <div>
                  <h3 className="text-sm font-bold text-white">Course Grade Distribution Analytics</h3>
                  <p className="text-[11px] text-brand-text-muted mt-0.5">Aggregated student evaluation across assigned courses</p>
                </div>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded font-semibold">
                  Grades
                </span>
              </div>

              <div className="w-full overflow-hidden py-2">
                <svg viewBox="0 0 450 160" className="w-full h-auto">
                  {facultyGradeDistribution.map((d, i) => {
                    const barWidth = 60;
                    const x = 40 + i * 95;
                    const barH = (d.count / 100) * 110;
                    const y = 130 - barH;
                    return (
                      <g key={i}>
                        <rect x={x} y={y} width={barWidth} height={barH} rx="6" fill={d.color} opacity="0.85" />
                        <text x={x + barWidth / 2} y={y - 6} fill="#ffffff" fontSize="10" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
                          {d.count}
                        </text>
                        <text x={x + barWidth / 2} y="146" fill="#94a3b8" fontSize="8" textAnchor="middle" fontFamily="monospace">
                          {d.grade.split(' ')[0]} {d.grade.split(' ')[1]}
                        </text>
                      </g>
                    );
                  })}
                </svg>
              </div>
            </div>

            {/* Office Hours & Supervision */}
            <div className="lg:col-span-5 card bg-brand-bg-secondary border border-brand-border rounded-2xl p-5 flex flex-col gap-3 shadow-sm">
              <div className="flex justify-between items-center border-b border-brand-border/30 pb-2">
                <h3 className="text-sm font-bold text-white">Office Hours & Mentorship</h3>
                <span className="text-[10px] font-mono text-brand-accent-cyan bg-cyan-500/10 border border-cyan-500/20 px-2 py-0.5 rounded font-semibold">
                  Schedule
                </span>
              </div>

              <div className="flex flex-col gap-3 text-xs">
                <div className="p-3 bg-brand-bg-tertiary/50 border border-brand-border/40 rounded-xl flex justify-between items-center">
                  <div>
                    <span className="font-bold text-white block">CS405 Capstone Supervision</span>
                    <span className="text-[10px] text-brand-text-muted block mt-0.5">Tuesdays & Thursdays • 14:00 - 16:00</span>
                  </div>
                  <span className="px-2 py-1 rounded bg-brand-primary/20 text-brand-primary text-[10px] font-bold">Confirmed</span>
                </div>

                <div className="p-3 bg-brand-bg-tertiary/50 border border-brand-border/40 rounded-xl flex justify-between items-center">
                  <div>
                    <span className="font-bold text-white block">AI Lab Open Office Hours</span>
                    <span className="text-[10px] text-brand-text-muted block mt-0.5">Wednesdays • 10:00 - 12:00</span>
                  </div>
                  <span className="px-2 py-1 rounded bg-emerald-500/20 text-emerald-400 text-[10px] font-bold">Open Access</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. STUDENT ROLE VIEW */}
      {/* ========================================================================= */}
      {activeRoleView === 'student' && (
        <div className="flex flex-col gap-6 animate-fade-in">
          {/* Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="card p-4 bg-brand-bg-secondary border border-brand-border rounded-2xl flex items-center justify-between">
              <div>
                <span className="text-brand-text-muted text-[11px] font-semibold uppercase tracking-wider">Cumulative GPA</span>
                <span className="block text-2xl font-bold font-display text-brand-accent-emerald mt-1">3.88 / 4.0</span>
                <span className="text-[10px] text-brand-accent-emerald font-medium mt-1 block">Dean's Honors List</span>
              </div>
              <div className="p-3 bg-brand-accent-emerald/10 rounded-2xl text-brand-accent-emerald">
                <Award className="w-5 h-5" />
              </div>
            </div>

            <div className="card p-4 bg-brand-bg-secondary border border-brand-border rounded-2xl flex items-center justify-between">
              <div>
                <span className="text-brand-text-muted text-[11px] font-semibold uppercase tracking-wider">Enrolled Credit Hours</span>
                <span className="block text-2xl font-bold font-display text-white mt-1">16 Credits</span>
                <span className="text-[10px] text-brand-text-muted font-medium mt-1 block">5 Active Subjects</span>
              </div>
              <div className="p-3 bg-brand-primary/10 rounded-2xl text-brand-primary">
                <BookMarked className="w-5 h-5" />
              </div>
            </div>

            <div className="card p-4 bg-brand-bg-secondary border border-brand-border rounded-2xl flex items-center justify-between">
              <div>
                <span className="text-brand-text-muted text-[11px] font-semibold uppercase tracking-wider">My Attendance</span>
                <span className="block text-2xl font-bold font-display text-brand-accent-cyan mt-1">98.0%</span>
                <span className="text-[10px] text-brand-accent-cyan font-medium mt-1 block">2 Classes Missed</span>
              </div>
              <div className="p-3 bg-brand-accent-cyan/10 rounded-2xl text-brand-accent-cyan">
                <ShieldCheck className="w-5 h-5" />
              </div>
            </div>

            <div className="card p-4 bg-brand-bg-secondary border border-brand-border rounded-2xl flex items-center justify-between">
              <div>
                <span className="text-brand-text-muted text-[11px] font-semibold uppercase tracking-wider">Pending Assignments</span>
                <span className="block text-2xl font-bold font-display text-brand-accent-amber mt-1">2 Due</span>
                <span className="text-[10px] text-brand-accent-amber font-medium mt-1 block">CS302 & AI Lab</span>
              </div>
              <div className="p-3 bg-brand-accent-amber/10 rounded-2xl text-brand-accent-amber">
                <Clock className="w-5 h-5" />
              </div>
            </div>
          </div>

          {/* Student Academic GPA Curve & Subject Mastery */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7 card bg-brand-bg-secondary border border-brand-border rounded-2xl p-5 flex flex-col gap-3 shadow-sm">
              <div className="flex justify-between items-center border-b border-brand-border/30 pb-2">
                <div>
                  <h3 className="text-sm font-bold text-white">GPA Progression Curve</h3>
                  <p className="text-[11px] text-brand-text-muted mt-0.5">Semester academic performance timeline</p>
                </div>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded font-semibold">
                  GPA: 3.88
                </span>
              </div>

              <div className="w-full overflow-hidden py-2">
                <svg viewBox="0 0 450 160" className="w-full h-auto">
                  <polyline points="40,110 150,85 260,55 370,35" fill="none" stroke="#10b981" strokeWidth="3" />
                  {studentGpaTrend.map((d, i) => {
                    const x = 40 + i * 110;
                    const y = 170 - (d.gpa / 4.0) * 140;
                    return (
                      <g key={i}>
                        <circle cx={x} cy={y} r="4.5" fill="#10b981" stroke="#064e3b" strokeWidth="2" />
                        <text x={x} y={y - 8} fill="#ffffff" fontSize="9" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
                          {d.gpa}
                        </text>
                        <text x={x} y="152" fill="#94a3b8" fontSize="8" textAnchor="middle" fontFamily="monospace">
                          {d.sem}
                        </text>
                      </g>
                    );
                  })}
                </svg>
              </div>
            </div>

            <div className="lg:col-span-5 card bg-brand-bg-secondary border border-brand-border rounded-2xl p-5 flex flex-col gap-3 shadow-sm">
              <h3 className="text-sm font-bold text-white border-b border-brand-border/30 pb-2">Subject Mastery Breakdown</h3>
              <div className="flex flex-col gap-3.5 mt-1 text-xs">
                {[
                  { name: 'Computer Science & AI', score: 95, color: 'bg-brand-primary' },
                  { name: 'Quantum Mechanics', score: 92, color: 'bg-brand-accent-cyan' },
                  { name: 'Data Structures & Algorithms', score: 88, color: 'bg-brand-accent-emerald' },
                  { name: 'Linear Algebra & Calculus', score: 90, color: 'bg-brand-accent-amber' }
                ].map((s, i) => (
                  <div key={i} className="flex flex-col gap-1">
                    <div className="flex justify-between text-[11px] font-semibold">
                      <span className="text-white">{s.name}</span>
                      <span className="text-brand-text-muted font-mono">{s.score}%</span>
                    </div>
                    <div className="w-full bg-brand-bg-tertiary h-2 rounded-full overflow-hidden border border-brand-border/40">
                      <div className={`h-full ${s.color} rounded-full`} style={{ width: `${s.score}%` }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. DEAN ROLE VIEW */}
      {/* ========================================================================= */}
      {activeRoleView === 'dean' && (
        <div className="flex flex-col gap-6 animate-fade-in">
          {/* Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="card p-4 bg-brand-bg-secondary border border-brand-border rounded-2xl flex items-center justify-between">
              <div>
                <span className="text-brand-text-muted text-[11px] font-semibold uppercase tracking-wider">Total Institutional Budget</span>
                <span className="block text-2xl font-bold font-display text-brand-accent-emerald mt-1">$14.5M Allocated</span>
                <span className="text-[10px] text-brand-accent-emerald font-medium mt-1 block">82% Utilized</span>
              </div>
              <div className="p-3 bg-brand-accent-emerald/10 rounded-2xl text-brand-accent-emerald">
                <DollarSign className="w-5 h-5" />
              </div>
            </div>

            <div className="card p-4 bg-brand-bg-secondary border border-brand-border rounded-2xl flex items-center justify-between">
              <div>
                <span className="text-brand-text-muted text-[11px] font-semibold uppercase tracking-wider">Active Research Grants</span>
                <span className="block text-2xl font-bold font-display text-brand-accent-cyan mt-1">28 Active Grants</span>
                <span className="text-[10px] text-brand-accent-cyan font-medium mt-1 block">$13.0M Funded</span>
              </div>
              <div className="p-3 bg-brand-accent-cyan/10 rounded-2xl text-brand-accent-cyan">
                <Briefcase className="w-5 h-5" />
              </div>
            </div>

            <div className="card p-4 bg-brand-bg-secondary border border-brand-border rounded-2xl flex items-center justify-between">
              <div>
                <span className="text-brand-text-muted text-[11px] font-semibold uppercase tracking-wider">Faculty-to-Student Ratio</span>
                <span className="block text-2xl font-bold font-display text-white mt-1">15:1 Ratio</span>
                <span className="text-[10px] text-brand-accent-emerald font-medium mt-1 block">Optimal Target</span>
              </div>
              <div className="p-3 bg-brand-primary/10 rounded-2xl text-brand-primary">
                <Users className="w-5 h-5" />
              </div>
            </div>

            <div className="card p-4 bg-brand-bg-secondary border border-brand-border rounded-2xl flex items-center justify-between">
              <div>
                <span className="text-brand-text-muted text-[11px] font-semibold uppercase tracking-wider">Quality Compliance</span>
                <span className="block text-2xl font-bold font-display text-brand-accent-emerald mt-1">99.4% Verified</span>
                <span className="text-[10px] text-brand-accent-emerald font-medium mt-1 block">Accreditation Ready</span>
              </div>
              <div className="p-3 bg-brand-accent-emerald/10 rounded-2xl text-brand-accent-emerald">
                <ShieldCheck className="w-5 h-5" />
              </div>
            </div>
          </div>

          {/* Research Grant Distribution */}
          <div className="card bg-brand-bg-secondary border border-brand-border rounded-2xl p-5 flex flex-col gap-3 shadow-sm">
            <div className="flex justify-between items-center border-b border-brand-border/30 pb-2">
              <div>
                <h3 className="text-sm font-bold text-white">Departmental Research Grant Funding Allocation ($M)</h3>
                <p className="text-[11px] text-brand-text-muted mt-0.5">Distribution across key institutional research labs</p>
              </div>
              <span className="text-[10px] font-mono text-purple-400 bg-purple-500/10 border border-purple-500/20 px-2.5 py-1 rounded-full font-bold">
                Research Grants
              </span>
            </div>

            <div className="w-full overflow-hidden py-2">
              <svg viewBox="0 0 450 150" className="w-full h-auto">
                {deanGrantDistribution.map((d, i) => {
                  const barWidth = 65;
                  const x = 35 + i * 100;
                  const barH = (d.grant / 6.0) * 100;
                  const y = 120 - barH;
                  return (
                    <g key={i}>
                      <rect x={x} y={y} width={barWidth} height={barH} rx="5" fill={d.color} opacity="0.85" />
                      <text x={x + barWidth / 2} y={y - 6} fill="#ffffff" fontSize="9" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
                        ${d.grant}M
                      </text>
                      <text x={x + barWidth / 2} y="136" fill="#94a3b8" fontSize="7.5" textAnchor="middle" fontFamily="monospace">
                        {d.field.split(' ')[0]} {d.field.split(' ')[1]}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* COMMON OPERATIONAL MODULES (Task Checklist, Calendar & Notices) */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-2">
        {/* System Task Checklist */}
        <div className="card bg-brand-bg-secondary border border-brand-border rounded-2xl p-5 flex flex-col gap-3 shadow-sm h-[380px]">
          <h3 className="font-display text-sm font-bold text-white border-b border-brand-border/40 pb-3 flex items-center gap-2 m-0">
            <ListTodo className="w-4 h-4 text-brand-primary" />
            Operational Task Checklist
          </h3>

          <form onSubmit={handleAddTask} className="flex gap-2">
            <input
              type="text"
              placeholder="Type new task..."
              value={newTaskText}
              onChange={(e) => setNewTaskText(e.target.value)}
              className="bg-brand-bg-tertiary border border-brand-border text-white px-3 py-1.5 rounded-lg text-xs outline-none focus:border-brand-primary flex-1"
            />
            <select
              value={newTaskPriority}
              onChange={(e) => setNewTaskPriority(e.target.value)}
              className="bg-brand-bg-tertiary border border-brand-border text-white px-2 py-1.5 rounded-lg text-xs font-semibold cursor-pointer"
            >
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
            <button type="submit" className="btn btn-primary px-3 py-1.5 text-xs font-bold rounded-lg cursor-pointer">+</button>
          </form>

          <div className="flex-1 overflow-y-auto flex flex-col gap-2 pr-1">
            {tasks.length === 0 ? (
              <div className="text-center py-8 text-xs text-brand-text-muted">No pending tasks. Great job!</div>
            ) : (
              tasks.map(t => (
                <div
                  key={t.id}
                  className={`flex items-center justify-between p-2.5 border border-brand-border/50 rounded-xl bg-brand-bg-tertiary/40 hover:bg-brand-bg-tertiary/80 transition-all text-xs ${t.done ? 'opacity-55' : ''}`}
                >
                  <div className="flex items-center gap-2.5 min-w-0 flex-1">
                    <button onClick={() => handleToggleTask(t.id)} className="cursor-pointer text-brand-primary">
                      {t.done ? <CheckSquare className="w-4 h-4 text-emerald-400" /> : <Square className="w-4 h-4 text-slate-400" />}
                    </button>
                    <span className={`truncate font-medium ${t.done ? 'line-through text-brand-text-subtle' : 'text-white'}`}>{t.text}</span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0 ml-2">
                    <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                      t.priority === 'High' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' :
                      t.priority === 'Medium' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' : 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                    }`}>
                      {t.priority}
                    </span>
                    <button onClick={() => handleDeleteTask(t.id)} className="text-brand-text-subtle hover:text-rose-400 transition-colors p-0.5 cursor-pointer">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Academic Calendar Planner */}
        <div className="card bg-brand-bg-secondary border border-brand-border rounded-2xl p-5 flex flex-col gap-3 shadow-sm h-[380px]">
          <div className="flex justify-between items-center border-b border-brand-border/40 pb-3">
            <h3 className="font-display text-sm font-bold text-white flex items-center gap-2 m-0">
              <CalendarIcon className="w-4 h-4 text-brand-accent-cyan" />
              Academic Calendar & Planner
            </h3>
            <button onClick={() => setShowEventForm(!showEventForm)} className="px-2.5 py-1 text-xs font-semibold bg-brand-bg-tertiary border border-brand-border rounded-lg text-white cursor-pointer hover:border-brand-primary">
              + Planner
            </button>
          </div>

          {showEventForm && (
            <form onSubmit={handleAddEvent} className="bg-brand-bg-tertiary/60 p-3 rounded-xl border border-brand-border/50 flex flex-col gap-2 text-xs animate-fade-in">
              <div className="flex gap-2">
                <input
                  type="text"
                  required
                  placeholder="Event name..."
                  value={newEvent.title}
                  onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                  className="bg-brand-bg-primary border border-brand-border text-white px-2.5 py-1.5 rounded-lg text-xs outline-none flex-1"
                />
                <select
                  value={newEvent.type}
                  onChange={(e) => setNewEvent({ ...newEvent, type: e.target.value })}
                  className="bg-brand-bg-primary border border-brand-border text-white px-2 py-1.5 rounded-lg text-xs outline-none cursor-pointer"
                >
                  <option value="Academic">Academic</option>
                  <option value="Exam">Exam</option>
                  <option value="Holiday">Holiday</option>
                </select>
              </div>
              <div className="flex gap-2 items-center justify-between">
                <input
                  type="date"
                  required
                  value={newEvent.date}
                  onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                  className="bg-brand-bg-primary border border-brand-border text-white px-2.5 py-1.5 rounded-lg text-xs outline-none flex-1"
                />
                <button type="submit" className="btn btn-primary px-3 py-1.5 text-xs font-bold rounded-lg cursor-pointer">Save Event</button>
              </div>
            </form>
          )}

          <div className="flex-1 overflow-y-auto flex flex-col gap-2 pr-1">
            {events.length === 0 ? (
              <div className="text-center py-8 text-xs text-brand-text-muted">No upcoming events scheduled.</div>
            ) : (
              events.map(ev => (
                <div
                  key={ev.id}
                  className={`flex items-center justify-between p-2.5 border-l-4 ${
                    ev.type === 'Exam' ? 'border-l-rose-500' : ev.type === 'Holiday' ? 'border-l-amber-500' : 'border-l-cyan-500'
                  } bg-brand-bg-tertiary/40 rounded-r-xl border-y border-r border-brand-border/40 text-xs hover:bg-brand-bg-tertiary/80 transition-all`}
                >
                  <div className="min-w-0 flex-1">
                    <h4 className="font-semibold text-white truncate my-0">{ev.title}</h4>
                    <span className="text-[10px] text-brand-text-subtle font-mono">{ev.date}</span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0 ml-2">
                    <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                      ev.type === 'Exam' ? 'bg-rose-500/20 text-rose-400' : ev.type === 'Holiday' ? 'bg-amber-500/20 text-amber-400' : 'bg-cyan-500/20 text-cyan-400'
                    }`}>
                      {ev.type}
                    </span>
                    <button onClick={() => handleDeleteEvent(ev.id)} className="text-brand-text-subtle hover:text-rose-400 transition-colors p-0.5 cursor-pointer">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Notices Desk & Audit Logs */}
        <div className="card bg-brand-bg-secondary border border-brand-border rounded-2xl p-5 flex flex-col gap-3 shadow-sm h-[380px]">
          <div className="flex justify-between items-center border-b border-brand-border/40 pb-2">
            <div className="flex gap-4 text-xs">
              <button
                onClick={() => setNoticeLogTab('notices')}
                className={`font-bold font-display cursor-pointer pb-1 transition-all ${
                  noticeLogTab === 'notices' ? 'text-white border-b-2 border-brand-primary' : 'text-brand-text-muted hover:text-white'
                }`}
              >
                Notices Desk
              </button>
              <button
                onClick={() => setNoticeLogTab('audit')}
                className={`font-bold font-display cursor-pointer pb-1 transition-all ${
                  noticeLogTab === 'audit' ? 'text-white border-b-2 border-brand-primary' : 'text-brand-text-muted hover:text-white'
                }`}
              >
                Audit Trail Logs
              </button>
            </div>

            <button
              onClick={() => setShowNoticeModal(true)}
              className="p-1 bg-brand-accent-amber/20 text-brand-accent-amber hover:bg-brand-accent-amber/30 rounded-lg transition-all border border-brand-accent-amber/40 cursor-pointer"
              title="Publish Notice"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          {noticeLogTab === 'notices' ? (
            <div className="flex-1 overflow-y-auto flex flex-col gap-3 pr-1">
              {announcements.slice(0, 4).map((ann, idx) => (
                <div key={ann.id || idx} className="pl-3 border-l-2" style={{ borderColor: ann.color || '#3b82f6' }}>
                  <div className="flex justify-between items-center text-[10px]">
                    <span className="font-bold text-white uppercase font-mono">{ann.tag}</span>
                    <span className="text-brand-text-subtle font-mono">{ann.date}</span>
                  </div>
                  <h4 className="text-xs font-bold text-white my-1">{ann.title}</h4>
                  <p className="text-[11px] text-brand-text-muted leading-relaxed m-0">{ann.content}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto flex flex-col gap-2.5 text-[11px] font-mono pr-1">
              {[
                { time: '12:02:10', text: 'Stripe fee payment batch collected #8921.' },
                { time: '11:58:44', text: 'Blockchain credential hash verified for STU001.' },
                { time: '11:42:15', text: 'Faculty load updated for CS & AI department.' },
                { time: '11:20:00', text: 'SQLite database connection pool verified OK.' }
              ].map((act, i) => (
                <div key={i} className="flex items-center justify-between pb-2 border-b border-brand-border/30">
                  <div className="flex items-center gap-2 truncate">
                    <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shrink-0"></span>
                    <span className="text-slate-200 truncate">{act.text}</span>
                  </div>
                  <span className="text-slate-400 shrink-0 font-mono text-[10px] ml-2">{act.time}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* MODAL 1: ADD APPLICANT */}
      {showAddAdmissionModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-brand-bg-secondary border border-brand-border rounded-3xl p-6 w-full max-w-md flex flex-col gap-4 shadow-2xl animate-fade-in">
            <div className="flex justify-between items-center border-b border-brand-border/40 pb-3">
              <h3 className="text-lg font-bold font-display text-white flex items-center gap-2">
                <Plus className="w-5 h-5 text-brand-primary" />
                Register New Applicant
              </h3>
              <button onClick={() => setShowAddAdmissionModal(false)} className="text-brand-text-muted hover:text-white cursor-pointer">
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateApplicant} className="flex flex-col gap-4 text-xs">
              <div className="flex flex-col gap-1.5">
                <label className="text-brand-text-muted font-semibold">Candidate Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Eleanor Vance"
                  value={newApplicant.name}
                  onChange={(e) => setNewApplicant({ ...newApplicant, name: e.target.value })}
                  className="bg-brand-bg-tertiary border border-brand-border rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-brand-primary"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-brand-text-muted font-semibold">Academic Major</label>
                <select
                  value={newApplicant.major}
                  onChange={(e) => setNewApplicant({ ...newApplicant, major: e.target.value })}
                  className="bg-brand-bg-tertiary border border-brand-border rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-brand-primary cursor-pointer"
                >
                  <option value="Computer Science & AI">Computer Science & AI</option>
                  <option value="Genetics & Biotechnology">Genetics & Biotechnology</option>
                  <option value="Business Administration">Business Administration</option>
                  <option value="Quantum Computing">Quantum Computing</option>
                  <option value="Mechanical Engineering">Mechanical Engineering</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-brand-text-muted font-semibold">High School GPA / Entry Score</label>
                <input
                  type="number"
                  step="0.01"
                  min="2.0"
                  max="4.0"
                  required
                  value={newApplicant.gpa}
                  onChange={(e) => setNewApplicant({ ...newApplicant, gpa: e.target.value })}
                  className="bg-brand-bg-tertiary border border-brand-border rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-brand-primary"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-brand-border/40">
                <button
                  type="button"
                  onClick={() => setShowAddAdmissionModal(false)}
                  className="px-4 py-2 rounded-xl text-brand-text-muted hover:text-white border border-brand-border cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-brand-primary text-white font-semibold hover:bg-brand-primary/90 cursor-pointer shadow-md shadow-brand-primary/20"
                >
                  Submit Application
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: PUBLISH NOTICE */}
      {showNoticeModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-brand-bg-secondary border border-brand-border rounded-3xl p-6 w-full max-w-md flex flex-col gap-4 shadow-2xl animate-fade-in">
            <div className="flex justify-between items-center border-b border-brand-border/40 pb-3">
              <h3 className="text-lg font-bold font-display text-white flex items-center gap-2">
                <Megaphone className="w-5 h-5 text-brand-accent-amber" />
                Publish Campus Notice
              </h3>
              <button onClick={() => setShowNoticeModal(false)} className="text-brand-text-muted hover:text-white cursor-pointer">
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateNotice} className="flex flex-col gap-4 text-xs">
              <div className="flex flex-col gap-1.5">
                <label className="text-brand-text-muted font-semibold">Notice Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Fall Semester Registration Deadline"
                  value={newNotice.title}
                  onChange={(e) => setNewNotice({ ...newNotice, title: e.target.value })}
                  className="bg-brand-bg-tertiary border border-brand-border rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-brand-primary"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="text-brand-text-muted font-semibold">Category Tag</label>
                  <select
                    value={newNotice.tag}
                    onChange={(e) => setNewNotice({ ...newNotice, tag: e.target.value })}
                    className="bg-brand-bg-tertiary border border-brand-border rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-brand-primary cursor-pointer"
                  >
                    <option value="Academic">Academic</option>
                    <option value="Administrative">Administrative</option>
                    <option value="Alert">Alert</option>
                    <option value="Event">Event</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-brand-text-muted font-semibold">Priority Level</label>
                  <select
                    value={newNotice.priority}
                    onChange={(e) => setNewNotice({ ...newNotice, priority: e.target.value })}
                    className="bg-brand-bg-tertiary border border-brand-border rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-brand-primary cursor-pointer"
                  >
                    <option value="Normal">Normal</option>
                    <option value="High">High Priority</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-brand-text-muted font-semibold">Content / Notice Details</label>
                <textarea
                  rows="3"
                  required
                  placeholder="Enter detailed notice content to broadcast..."
                  value={newNotice.content}
                  onChange={(e) => setNewNotice({ ...newNotice, content: e.target.value })}
                  className="bg-brand-bg-tertiary border border-brand-border rounded-xl p-3 text-white focus:outline-none focus:border-brand-primary resize-none"
                ></textarea>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-brand-border/40">
                <button
                  type="button"
                  onClick={() => setShowNoticeModal(false)}
                  className="px-4 py-2 rounded-xl text-brand-text-muted hover:text-white border border-brand-border cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-brand-accent-amber text-black font-bold hover:bg-brand-accent-amber/90 cursor-pointer shadow-md shadow-brand-accent-amber/20"
                >
                  Publish Announcement
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
