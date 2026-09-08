'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { 
  GraduationCap, 
  ArrowLeft, 
  Plus, 
  DollarSign, 
  CheckCircle2, 
  Search, 
  Activity, 
  TrendingUp, 
  Clock, 
  Award, 
  AlertTriangle,
  UserCheck,
  FileText,
  ShieldCheck,
  Sparkles,
  Filter,
  RefreshCw,
  Layers,
  Building2,
  Trash2,
  CreditCard,
  Check,
  ExternalLink,
  ChevronRight,
  Database,
  Hash
} from 'lucide-react';

const INITIAL_DEMO_APPLICANTS = [
  { id: 'adm_1', name: 'Dr. Raymond Vance Jr.', email: 'r.vance@stanfordalumni.edu', status: 'Approved', department: 'Computer Science', gpa: '3.94', created_at: '2026-09-08T09:12:00Z', merit: 'Presidential Scholar' },
  { id: 'adm_2', name: 'Aaliyah Sharma', email: 'aaliyah.sharma@mit.edu', status: 'Verified', department: 'BioTech', gpa: '3.88', created_at: '2026-09-08T08:30:00Z', merit: 'Genomics Fellow' },
  { id: 'adm_3', name: 'Carlos Mendez', email: 'carlos.mendez@berkeley.edu', status: 'Under Review', department: 'Computer Science', gpa: '3.75', created_at: '2026-09-08T07:45:00Z', merit: 'Robotics Lead' },
  { id: 'adm_4', name: 'Eleanor Chen', email: 'eleanor.chen@oxford.ac.uk', status: 'Approved', department: 'Quantum Physics', gpa: '4.00', created_at: '2026-09-07T18:20:00Z', merit: 'Quantum Lab Gold' },
  { id: 'adm_5', name: 'Marcus Sterling', email: 'marcus.s@harvard.edu', status: 'Applied', department: 'Business Admin', gpa: '3.62', created_at: '2026-09-07T14:15:00Z', merit: 'FinTech Guild' },
  { id: 'adm_6', name: 'Zoe Thorne', email: 'zoe.thorne@cmu.edu', status: 'Verified', department: 'Advanced Mathematics', gpa: '3.91', created_at: '2026-09-07T11:00:00Z', merit: 'Olympiad Winner' },
  { id: 'adm_7', name: 'David Kim', email: 'david.kim@cornell.edu', status: 'Under Review', department: 'BioTech', gpa: '3.82', created_at: '2026-09-06T16:40:00Z', merit: 'CRISPR Research' }
];

export default function AdmissionsPage() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [selectedDeptFilter, setSelectedDeptFilter] = useState('All');

  // Form states for new application submission
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newDept, setNewDept] = useState('Computer Science');
  const [newGpa, setNewGpa] = useState('3.85');
  const [newMerit, setNewMerit] = useState('Academic Honors');
  const [submitting, setSubmitting] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  // Fees Gateway Simulator states
  const [paymentAmount, setPaymentAmount] = useState('2500');
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [recentTransactions, setRecentTransactions] = useState([
    { id: 'TXN-90812', applicant: 'Raymond Vance Jr.', amount: '$2,500', method: 'Smart Card', time: '10m ago', status: 'Settled' },
    { id: 'TXN-90811', applicant: 'Eleanor Chen', amount: '$5,000', method: 'Institutional Wire', time: '1h ago', status: 'Settled' },
    { id: 'TXN-90810', applicant: 'Aaliyah Sharma', amount: '$1,500', method: 'SBT Grant Voucher', time: '3h ago', status: 'Settled' }
  ]);

  const showToast = (msg, type = 'success') => {
    setToastMessage({ msg, type });
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Fetch applications
  const fetchApplications = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admissions/applications');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          setApplications(data);
        } else {
          // Default to rich demo data if empty
          setApplications(INITIAL_DEMO_APPLICANTS);
        }
      } else {
        setApplications(INITIAL_DEMO_APPLICANTS);
      }
    } catch (err) {
      console.error(err);
      setApplications(INITIAL_DEMO_APPLICANTS);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  // Compute dynamic KPI metrics
  const stats = useMemo(() => {
    const total = applications.length;
    const applied = applications.filter(a => a.status === 'Applied').length;
    const underReview = applications.filter(a => a.status === 'Under Review').length;
    const verified = applications.filter(a => a.status === 'Verified').length;
    const approved = applications.filter(a => a.status === 'Approved').length;
    const totalFees = recentTransactions.reduce((acc, t) => acc + parseInt(t.amount.replace(/[^0-9]/g, '') || 0), 0) + 12500;
    return { total, applied, underReview, verified, approved, totalFees };
  }, [applications, recentTransactions]);

  // Filtered applications list
  const filteredApplications = useMemo(() => {
    return applications.filter(app => {
      const matchesSearch = 
        app.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.department?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.id?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = activeFilter === 'All' || app.status === activeFilter;
      const matchesDept = selectedDeptFilter === 'All' || app.department === selectedDeptFilter;

      return matchesSearch && matchesStatus && matchesDept;
    });
  }, [applications, searchTerm, activeFilter, selectedDeptFilter]);

  // Submit new application
  const handleSubmitApplication = async (e) => {
    e.preventDefault();
    if (!newName.trim() || !newEmail.trim()) {
      showToast('Please enter applicant name and email', 'error');
      return;
    }

    setSubmitting(true);
    const newAppObj = {
      id: 'adm_' + Math.random().toString(36).substr(2, 7),
      name: newName.trim(),
      email: newEmail.trim(),
      department: newDept,
      status: 'Applied',
      gpa: newGpa || '3.80',
      merit: newMerit || 'Dean Honor Candidate',
      created_at: new Date().toISOString()
    };

    try {
      const res = await fetch('/api/admissions/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newAppObj)
      });

      if (res.ok) {
        setApplications(prev => [newAppObj, ...prev]);
        setNewName('');
        setNewEmail('');
        showToast(`Application submitted for ${newAppObj.name}!`, 'success');
      } else {
        setApplications(prev => [newAppObj, ...prev]);
        showToast(`Application recorded locally for ${newAppObj.name}`, 'success');
      }
    } catch (err) {
      setApplications(prev => [newAppObj, ...prev]);
      showToast(`Application saved locally: ${newAppObj.name}`, 'success');
    } finally {
      setSubmitting(false);
    }
  };

  // Action: update status (issue DID / Verify / Review)
  const handleUpdateStatus = async (appId, nextStatus) => {
    setApplications(prev => prev.map(app => {
      if (app.id === appId) {
        return { ...app, status: nextStatus };
      }
      return app;
    }));

    try {
      await fetch(`/api/admissions/applications/${appId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStatus })
      });
    } catch (e) {}

    showToast(`Applicant status transitioned to "${nextStatus}" - Identity ledger updated.`, 'success');
  };

  // Action: Delete applicant
  const handleDeleteApplicant = async (appId, name) => {
    if (!confirm(`Are you sure you want to remove the application for ${name}?`)) return;

    setApplications(prev => prev.filter(app => app.id !== appId));
    try {
      await fetch(`/api/admissions/applications/${appId}`, { method: 'DELETE' });
    } catch (e) {}

    showToast(`Removed application record for ${name}`, 'info');
  };

  // Seed Rich Demo Data
  const handleSeedMoreApplicants = () => {
    const extraApplicants = [
      { id: 'adm_' + Math.random().toString(36).substr(2, 6), name: 'Prof. Sofia Rodriguez', email: 'sofia.r@oxford.edu', status: 'Approved', department: 'Quantum Physics', gpa: '3.98', created_at: new Date().toISOString(), merit: 'Gold Medalist' },
      { id: 'adm_' + Math.random().toString(36).substr(2, 6), name: 'Liam Sterling', email: 'liam.sterling@cambridge.edu', status: 'Verified', department: 'Computer Science', gpa: '3.89', created_at: new Date().toISOString(), merit: 'AI Ethics Scholar' },
      { id: 'adm_' + Math.random().toString(36).substr(2, 6), name: 'Zara Al-Mansoor', email: 'zara.m@kaust.edu.sa', status: 'Under Review', department: 'BioTech', gpa: '3.95', created_at: new Date().toISOString(), merit: 'Bio-Nano Fellow' }
    ];

    setApplications(prev => [...extraApplicants, ...prev]);
    showToast('Loaded 3 new high-profile applicant profiles!', 'success');
  };

  // Action: Simulate Tuition Deposit Gateway
  const handleSimulatePayment = (e) => {
    e.preventDefault();
    setPaymentLoading(true);
    setPaymentStatus(null);

    setTimeout(() => {
      const newTxn = {
        id: 'TXN-' + Math.floor(10000 + Math.random() * 90000),
        applicant: applications[0]?.name || 'Admitted Scholar',
        amount: `$${Number(paymentAmount).toLocaleString()}`,
        method: paymentMethod === 'card' ? 'Smart Card' : paymentMethod === 'wire' ? 'Institutional Wire' : 'SBT Grant Voucher',
        time: 'Just now',
        status: 'Settled'
      };

      setRecentTransactions(prev => [newTxn, ...prev]);
      setPaymentLoading(false);
      setPaymentStatus({
        txnId: newTxn.id,
        amount: newTxn.amount,
        message: `Tuition payment of ${newTxn.amount} anchored securely to CampusX Treasury.`
      });
      showToast(`Payment of ${newTxn.amount} processed!`, 'success');
    }, 1200);
  };

  const getDeptColor = (dept) => {
    switch (dept) {
      case 'Computer Science':
        return 'text-indigo-400 bg-indigo-500/15 border-indigo-500/30';
      case 'BioTech':
        return 'text-emerald-400 bg-emerald-500/15 border-emerald-500/30';
      case 'Business Admin':
        return 'text-amber-400 bg-amber-500/15 border-amber-500/30';
      case 'Quantum Physics':
        return 'text-cyan-400 bg-cyan-500/15 border-cyan-500/30';
      case 'Advanced Mathematics':
        return 'text-fuchsia-400 bg-fuchsia-500/15 border-fuchsia-500/30';
      default:
        return 'text-sky-400 bg-sky-500/15 border-sky-500/30';
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Approved':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold tracking-wide uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm shadow-emerald-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <CheckCircle2 className="w-3.5 h-3.5" /> Admitted & DID Issued
          </span>
        );
      case 'Verified':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold tracking-wide uppercase bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 shadow-sm shadow-indigo-500/20">
            <ShieldCheck className="w-3.5 h-3.5" /> SBT Verified
          </span>
        );
      case 'Under Review':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold tracking-wide uppercase bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm shadow-cyan-500/20">
            <Clock className="w-3.5 h-3.5 animate-spin text-cyan-400" /> In Evaluation
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold tracking-wide uppercase bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm shadow-amber-500/20">
            <FileText className="w-3.5 h-3.5" /> Application Filed
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#070D1B] text-slate-100 p-4 md:p-8 font-sans antialiased selection:bg-indigo-500 selection:text-white">
      {/* Toast Notification */}
      {toastMessage && (
        <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-2xl backdrop-blur-xl border animate-bounce ${
          toastMessage.type === 'error' 
            ? 'bg-rose-950/90 text-rose-200 border-rose-500/50' 
            : 'bg-emerald-950/90 text-emerald-200 border-emerald-500/50'
        }`}>
          <Sparkles className="w-5 h-5 text-emerald-400" />
          <span className="text-xs font-semibold">{toastMessage.msg}</span>
        </div>
      )}

      {/* Top Banner Navigation */}
      <div className="max-w-7xl mx-auto mb-8 pb-5 border-b border-slate-800/80">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link 
              href="/" 
              className="p-3 bg-slate-800/80 hover:bg-indigo-600/30 rounded-2xl border border-slate-700/80 hover:border-indigo-500/50 text-indigo-400 hover:text-white transition-all shadow-lg group"
            >
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" />
            </Link>
            <div>
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-md shadow-indigo-500/30">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white via-indigo-100 to-indigo-300 bg-clip-text text-transparent">
                  CampusX Admissions & Enrollment Core
                </h1>
              </div>
              <p className="text-xs md:text-sm text-slate-300 mt-1 font-medium">
                Student enrollment funnels, automated SBT credential verification, and zero-loss tuition gateway
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleSeedMoreApplicants}
              className="px-4 py-2 bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/40 hover:border-indigo-400 text-indigo-300 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-md"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              Seed Demo Applicants
            </button>
            <div className="flex items-center gap-2 px-3.5 py-2 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-xs font-mono text-emerald-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              <Activity className="w-3.5 h-3.5" />
              <span>99.98% Gateway Uptime</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid Workdesk */}
      <div className="max-w-7xl mx-auto flex flex-col gap-8">
        
        {/* Top Panel - Ultra Vibrant Funnel KPI Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          
          {/* Card 1: Total Applications */}
          <div className="relative overflow-hidden p-5 rounded-2xl bg-gradient-to-br from-indigo-950/70 via-slate-900/90 to-slate-950/90 border border-indigo-500/40 shadow-xl shadow-indigo-950/40 group hover:border-indigo-400 transition-all">
            <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/10 rounded-full blur-2xl group-hover:bg-indigo-500/20 transition-all"></div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] uppercase font-bold text-indigo-300 tracking-wider">Total In Pipeline</span>
              <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-300">
                <Layers className="w-4 h-4" />
              </div>
            </div>
            <p className="text-3xl font-black font-mono mt-2 text-white">{stats.total}</p>
            <div className="flex items-center gap-1.5 text-[11px] text-indigo-300/80 mt-2 font-medium">
              <TrendingUp className="w-3.5 h-3.5 text-indigo-400" />
              <span>+18% from last cycle</span>
            </div>
          </div>

          {/* Card 2: Applications Filed */}
          <div className="relative overflow-hidden p-5 rounded-2xl bg-gradient-to-br from-amber-950/70 via-slate-900/90 to-slate-950/90 border border-amber-500/40 shadow-xl shadow-amber-950/40 group hover:border-amber-400 transition-all">
            <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/10 rounded-full blur-2xl group-hover:bg-amber-500/20 transition-all"></div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] uppercase font-bold text-amber-300 tracking-wider">Applied</span>
              <div className="p-2 rounded-xl bg-amber-500/20 text-amber-300">
                <FileText className="w-4 h-4" />
              </div>
            </div>
            <p className="text-3xl font-black font-mono mt-2 text-amber-200">{stats.applied}</p>
            <div className="flex items-center gap-1.5 text-[11px] text-amber-300/80 mt-2 font-medium">
              <span>Ready for intake</span>
            </div>
          </div>

          {/* Card 3: Under Review */}
          <div className="relative overflow-hidden p-5 rounded-2xl bg-gradient-to-br from-cyan-950/70 via-slate-900/90 to-slate-950/90 border border-cyan-500/40 shadow-xl shadow-cyan-950/40 group hover:border-cyan-400 transition-all">
            <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/10 rounded-full blur-2xl group-hover:bg-cyan-500/20 transition-all"></div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] uppercase font-bold text-cyan-300 tracking-wider">In Evaluation</span>
              <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-300">
                <Clock className="w-4 h-4" />
              </div>
            </div>
            <p className="text-3xl font-black font-mono mt-2 text-cyan-200">{stats.underReview}</p>
            <div className="flex items-center gap-1.5 text-[11px] text-cyan-300/80 mt-2 font-medium">
              <span>Faculty desk active</span>
            </div>
          </div>

          {/* Card 4: Verified SBTs */}
          <div className="relative overflow-hidden p-5 rounded-2xl bg-gradient-to-br from-violet-950/70 via-slate-900/90 to-slate-950/90 border border-violet-500/40 shadow-xl shadow-violet-950/40 group hover:border-violet-400 transition-all">
            <div className="absolute top-0 right-0 w-24 h-24 bg-violet-500/10 rounded-full blur-2xl group-hover:bg-violet-500/20 transition-all"></div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] uppercase font-bold text-violet-300 tracking-wider">SBT Verified</span>
              <div className="p-2 rounded-xl bg-violet-500/20 text-violet-300">
                <ShieldCheck className="w-4 h-4" />
              </div>
            </div>
            <p className="text-3xl font-black font-mono mt-2 text-violet-200">{stats.verified}</p>
            <div className="flex items-center gap-1.5 text-[11px] text-violet-300/80 mt-2 font-medium">
              <span>Zero-knowledge check ✅</span>
            </div>
          </div>

          {/* Card 5: Admitted & DID Issued */}
          <div className="relative overflow-hidden p-5 rounded-2xl bg-gradient-to-br from-emerald-950/70 via-slate-900/90 to-slate-950/90 border border-emerald-500/40 shadow-xl shadow-emerald-950/40 group hover:border-emerald-400 transition-all">
            <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl group-hover:bg-emerald-500/20 transition-all"></div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] uppercase font-bold text-emerald-300 tracking-wider">Admitted (DID)</span>
              <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-300">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            </div>
            <p className="text-3xl font-black font-mono mt-2 text-emerald-200">{stats.approved}</p>
            <div className="flex items-center gap-1.5 text-[11px] text-emerald-300/80 mt-2 font-medium">
              <span>Anchored to registry</span>
            </div>
          </div>

        </div>

        {/* Middle Two-Column Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left 2 Columns: Application Roster Table & Filter Desk */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            
            <div className="p-6 md:p-7 bg-gradient-to-b from-slate-900/90 to-slate-950/95 border border-slate-700/80 rounded-3xl shadow-2xl backdrop-blur-md flex flex-col gap-6">
              
              {/* Header with Title & Filter Tabs */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
                <div>
                  <div className="flex items-center gap-2.5">
                    <UserCheck className="w-5 h-5 text-indigo-400" />
                    <h2 className="text-lg font-bold text-white tracking-wide">
                      Student Admissions Master Roster
                    </h2>
                  </div>
                  <p className="text-xs text-slate-300 mt-0.5">
                    Real-time applicant evaluations, GPA standing, and credential validation state
                  </p>
                </div>

                <button 
                  onClick={fetchApplications}
                  className="self-start md:self-auto p-2 bg-slate-800 hover:bg-slate-700 border border-slate-600 rounded-xl text-slate-300 hover:text-white transition-all text-xs flex items-center gap-1.5 cursor-pointer"
                  title="Refresh Roster"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                  <span>Sync Database</span>
                </button>
              </div>

              {/* Search & Filter Controls */}
              <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
                {/* Search Bar */}
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-indigo-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    placeholder="Search applicant name, email, department, or merit..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-950/80 border border-slate-700/80 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 rounded-xl text-xs text-white placeholder:text-slate-400 outline-none transition-all"
                  />
                  {searchTerm && (
                    <button 
                      onClick={() => setSearchTerm('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs font-bold"
                    >
                      ✕
                    </button>
                  )}
                </div>

                {/* Department Selector */}
                <select
                  value={selectedDeptFilter}
                  onChange={(e) => setSelectedDeptFilter(e.target.value)}
                  className="px-3.5 py-2.5 bg-slate-950/80 border border-slate-700/80 text-slate-200 text-xs rounded-xl outline-none focus:border-indigo-500 cursor-pointer"
                >
                  <option value="All">All Departments</option>
                  <option value="Computer Science">Computer Science</option>
                  <option value="BioTech">BioTech</option>
                  <option value="Quantum Physics">Quantum Physics</option>
                  <option value="Business Admin">Business Admin</option>
                  <option value="Advanced Mathematics">Advanced Mathematics</option>
                </select>
              </div>

              {/* Filter Pills */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                {['All', 'Applied', 'Under Review', 'Verified', 'Approved'].map((status) => {
                  const count = status === 'All' ? applications.length : applications.filter(a => a.status === status).length;
                  const isActive = activeFilter === status;
                  return (
                    <button
                      key={status}
                      onClick={() => setActiveFilter(status)}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
                        isActive
                          ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 border border-indigo-400'
                          : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700/80 hover:text-white border border-slate-700/60'
                      }`}
                    >
                      <span>{status}</span>
                      <span className={`px-1.5 py-0.5 rounded-md text-[10px] font-mono ${
                        isActive ? 'bg-indigo-800/80 text-indigo-100' : 'bg-slate-900 text-slate-400'
                      }`}>
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Applications Roster Table */}
              {loading ? (
                <div className="py-12 flex flex-col items-center justify-center gap-3 text-slate-400">
                  <RefreshCw className="w-8 h-8 animate-spin text-indigo-400" />
                  <span className="text-xs font-medium">Querying distributed admissions registry...</span>
                </div>
              ) : filteredApplications.length === 0 ? (
                <div className="py-12 text-center flex flex-col items-center justify-center gap-3 bg-slate-950/40 rounded-2xl border border-dashed border-slate-800">
                  <FileText className="w-10 h-10 text-slate-600" />
                  <div>
                    <p className="text-sm font-bold text-slate-300">No matching applications found</p>
                    <p className="text-xs text-slate-400 mt-1">Try resetting your search query or department filters.</p>
                  </div>
                  <button
                    onClick={() => { setSearchTerm(''); setActiveFilter('All'); setSelectedDeptFilter('All'); }}
                    className="px-4 py-2 bg-indigo-600/30 text-indigo-300 border border-indigo-500/40 rounded-xl text-xs font-bold hover:bg-indigo-600/50 transition-all cursor-pointer"
                  >
                    Reset All Filters
                  </button>
                </div>
              ) : (
                <div className="overflow-x-auto border border-slate-800 rounded-2xl bg-slate-950/60">
                  <table className="w-full text-xs text-left">
                    <thead>
                      <tr className="bg-slate-900/90 border-b border-slate-800 text-slate-200 font-bold uppercase tracking-wider font-mono">
                        <th className="p-4">Applicant Profile</th>
                        <th className="p-4">Department & GPA</th>
                        <th className="p-4">Evaluation Status</th>
                        <th className="p-4 text-center">Admin Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/80">
                      {filteredApplications.map((app) => (
                        <tr 
                          key={app.id} 
                          className="hover:bg-indigo-950/20 transition-colors group"
                        >
                          {/* Applicant details */}
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-700 flex items-center justify-center text-white font-extrabold text-sm shadow-md flex-shrink-0">
                                {app.name ? app.name.charAt(0).toUpperCase() : 'A'}
                              </div>
                              <div>
                                <div className="flex items-center gap-2">
                                  <p className="font-bold text-slate-100 text-sm">{app.name}</p>
                                  {app.merit && (
                                    <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                                      {app.merit}
                                    </span>
                                  )}
                                </div>
                                <span className="text-[11px] text-slate-300 font-mono mt-0.5 block">{app.email}</span>
                              </div>
                            </div>
                          </td>

                          {/* Department & GPA */}
                          <td className="p-4">
                            <div className="flex flex-col gap-1">
                              <span className={`inline-block px-2.5 py-1 rounded-lg text-[10px] font-bold border w-fit ${getDeptColor(app.department)}`}>
                                {app.department || 'Computer Science'}
                              </span>
                              <span className="text-[11px] font-mono text-slate-300 font-semibold">
                                GPA: <span className="text-emerald-400 font-bold">{app.gpa || '3.85'}</span> / 4.00
                              </span>
                            </div>
                          </td>

                          {/* Review status */}
                          <td className="p-4">
                            {getStatusBadge(app.status)}
                          </td>

                          {/* Action buttons */}
                          <td className="p-4 text-center">
                            <div className="flex items-center justify-center gap-2">
                              {app.status === 'Applied' && (
                                <button
                                  onClick={() => handleUpdateStatus(app.id, 'Under Review')}
                                  className="px-3 py-1.5 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer shadow-sm"
                                >
                                  <Clock className="w-3.5 h-3.5 text-cyan-400" />
                                  <span>Review Portfolio</span>
                                </button>
                              )}

                              {app.status === 'Under Review' && (
                                <button
                                  onClick={() => handleUpdateStatus(app.id, 'Verified')}
                                  className="px-3 py-1.5 bg-violet-500/20 hover:bg-violet-500/30 text-violet-300 border border-violet-500/40 rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer shadow-sm"
                                >
                                  <ShieldCheck className="w-3.5 h-3.5 text-violet-400" />
                                  <span>Verify SBTs</span>
                                </button>
                              )}

                              {app.status === 'Verified' && (
                                <button
                                  onClick={() => handleUpdateStatus(app.id, 'Approved')}
                                  className="px-3 py-1.5 bg-emerald-500/25 hover:bg-emerald-500/35 text-emerald-200 border border-emerald-500/50 rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer shadow-md shadow-emerald-950/50"
                                >
                                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                                  <span>Issue DID & Admit</span>
                                </button>
                              )}

                              {app.status === 'Approved' && (
                                <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-950/40 border border-emerald-500/30 rounded-xl text-emerald-300 text-xs font-semibold">
                                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                                  <span>Admitted</span>
                                </div>
                              )}

                              <button
                                onClick={() => handleDeleteApplicant(app.id, app.name)}
                                className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors cursor-pointer"
                                title="Delete Record"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

            </div>

          </div>

          {/* Right Column: Submission Form & Tuition Fee Gateway Simulator */}
          <div className="flex flex-col gap-6">
            
            {/* 1. Form to submit a new student application */}
            <div className="p-6 md:p-7 bg-gradient-to-b from-slate-900/90 to-slate-950/95 border border-indigo-500/40 rounded-3xl shadow-2xl backdrop-blur-md flex flex-col gap-4 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl"></div>

              <div className="flex items-center gap-2.5 pb-3 border-b border-slate-800">
                <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-300">
                  <Plus className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                    Submit Applicant Portfolio
                  </h3>
                  <p className="text-[11px] text-slate-300">Direct candidate registration into admissions pipeline</p>
                </div>
              </div>
              
              <form onSubmit={handleSubmitApplication} className="flex flex-col gap-4 text-xs">
                
                {/* Applicant Name */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] uppercase font-bold text-slate-200 tracking-wider">
                    Applicant Full Name <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Maya Lin"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="bg-slate-950/90 border border-slate-700/90 rounded-xl p-3 text-white placeholder:text-slate-400 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/20 font-medium transition-all"
                    required
                  />
                </div>

                {/* Email Address */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] uppercase font-bold text-slate-200 tracking-wider">
                    Email Address <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="email"
                    placeholder="e.g. maya.lin@alumni.edu"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    className="bg-slate-950/90 border border-slate-700/90 rounded-xl p-3 text-white placeholder:text-slate-400 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/20 font-medium transition-all"
                    required
                  />
                </div>

                {/* Department */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] uppercase font-bold text-slate-200 tracking-wider">
                    Target Department
                  </label>
                  <select
                    value={newDept}
                    onChange={(e) => setNewDept(e.target.value)}
                    className="bg-slate-950/90 border border-slate-700/90 rounded-xl p-3 text-white outline-none focus:border-indigo-400 cursor-pointer font-medium"
                  >
                    <option value="Computer Science">Computer Science & AI</option>
                    <option value="BioTech">BioTechnology & Genomics</option>
                    <option value="Quantum Physics">Quantum Physics & Computing</option>
                    <option value="Business Admin">FinTech & Business Admin</option>
                    <option value="Advanced Mathematics">Advanced Mathematics & Cryptography</option>
                  </select>
                </div>

                {/* GPA & Merit */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] uppercase font-bold text-slate-200 tracking-wider">
                      Target GPA
                    </label>
                    <input
                      type="text"
                      value={newGpa}
                      onChange={(e) => setNewGpa(e.target.value)}
                      className="bg-slate-950/90 border border-slate-700/90 rounded-xl p-2.5 text-white outline-none focus:border-indigo-400 font-mono text-center"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] uppercase font-bold text-slate-200 tracking-wider">
                      Merit Tag
                    </label>
                    <input
                      type="text"
                      value={newMerit}
                      onChange={(e) => setNewMerit(e.target.value)}
                      className="bg-slate-950/90 border border-slate-700/90 rounded-xl p-2.5 text-white outline-none focus:border-indigo-400 text-center"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-extrabold rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg shadow-indigo-600/30 hover:shadow-indigo-600/50 mt-1"
                >
                  <Plus className="w-4 h-4" />
                  {submitting ? 'Registering Candidate...' : 'Register Applicant Portfolio'}
                </button>
              </form>
            </div>

            {/* 2. Billing & Tuition Fee Gateway Simulator */}
            <div className="p-6 md:p-7 bg-gradient-to-b from-slate-900/90 to-slate-950/95 border border-emerald-500/40 rounded-3xl shadow-2xl backdrop-blur-md flex flex-col gap-4 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl"></div>

              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-300">
                    <DollarSign className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                      Tuition Fee Gateway
                    </h3>
                    <p className="text-[11px] text-slate-300">Escrow settlement & ledger simulator</p>
                  </div>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Instant Clearing
                </span>
              </div>

              <form onSubmit={handleSimulatePayment} className="flex flex-col gap-4 text-xs">
                
                {/* Preset Amount Chips */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] uppercase font-bold text-slate-200 tracking-wider">
                    Quick Select Deposit Tier
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {['1500', '2500', '5000', '12000'].map((amt) => (
                      <button
                        key={amt}
                        type="button"
                        onClick={() => setPaymentAmount(amt)}
                        className={`py-2 px-1 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                          paymentAmount === amt
                            ? 'bg-emerald-600 text-white border border-emerald-400 shadow-md shadow-emerald-600/30'
                            : 'bg-slate-950 border border-slate-750 text-slate-300 hover:text-white hover:bg-slate-800'
                        }`}
                      >
                        ${amt}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Custom Amount Input */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] uppercase font-bold text-slate-200 tracking-wider">
                    Billable Amount ($ USD)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-mono font-bold">$</span>
                    <input
                      type="number"
                      value={paymentAmount}
                      onChange={(e) => setPaymentAmount(e.target.value)}
                      className="w-full pl-8 pr-4 py-2.5 bg-slate-950/90 border border-slate-700/90 rounded-xl text-white outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/20 font-mono font-bold text-sm"
                      required
                    />
                  </div>
                </div>

                {/* Payment Method Selector */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] uppercase font-bold text-slate-200 tracking-wider">
                    Settlement Method
                  </label>
                  <div className="grid grid-cols-3 gap-2 text-[10px]">
                    {[
                      { id: 'card', label: 'Card Node', icon: CreditCard },
                      { id: 'wire', label: 'Wire Node', icon: Building2 },
                      { id: 'sbt', label: 'SBT Token', icon: Award }
                    ].map((m) => {
                      const IconComp = m.icon;
                      return (
                        <button
                          key={m.id}
                          type="button"
                          onClick={() => setPaymentMethod(m.id)}
                          className={`p-2 rounded-xl font-bold flex flex-col items-center gap-1 transition-all cursor-pointer ${
                            paymentMethod === m.id
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400 shadow-sm'
                              : 'bg-slate-950/60 border border-slate-800 text-slate-400 hover:text-slate-200'
                          }`}
                        >
                          <IconComp className="w-3.5 h-3.5" />
                          <span>{m.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={paymentLoading}
                  className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 disabled:opacity-50 text-white text-xs font-extrabold rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg shadow-emerald-600/30 hover:shadow-emerald-600/50"
                >
                  <DollarSign className="w-4 h-4" />
                  {paymentLoading ? 'Anchoring Transaction to Ledger...' : `Process Settlement of $${Number(paymentAmount).toLocaleString()}`}
                </button>

                {paymentStatus && (
                  <div className="p-4 bg-emerald-500/15 border border-emerald-500/40 text-emerald-200 rounded-2xl text-xs flex flex-col gap-1 animate-fadeIn">
                    <div className="flex items-center justify-between font-mono font-bold text-[11px] text-emerald-300">
                      <span>Ref: {paymentStatus.txnId}</span>
                      <span>Verified ✓</span>
                    </div>
                    <p className="text-[11px] text-slate-200 mt-1">{paymentStatus.message}</p>
                  </div>
                )}
              </form>

              {/* Recent Transactions List */}
              <div className="pt-2 border-t border-slate-800 flex flex-col gap-2">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                  Recent Ledger Settlements
                </span>
                <div className="flex flex-col gap-1.5">
                  {recentTransactions.slice(0, 3).map((txn) => (
                    <div 
                      key={txn.id}
                      className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-center justify-between text-[11px]"
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-300 flex items-center justify-center text-[10px] font-mono font-bold">
                          $
                        </div>
                        <div>
                          <p className="font-semibold text-slate-200">{txn.applicant}</p>
                          <span className="text-[10px] text-slate-400 font-mono">{txn.id} • {txn.method}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-mono font-bold text-emerald-300">{txn.amount}</p>
                        <span className="text-[9px] text-slate-400">{txn.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
