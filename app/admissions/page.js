'use client';

import React, { useState, useEffect } from 'react';
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
  AlertTriangle 
} from 'lucide-react';

export default function AdmissionsPage() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  // Statistics
  const [funnelData, setFunnelData] = useState({
    applied: 124,
    underReview: 48,
    verified: 32,
    approved: 19
  });

  // Form states for new application submission
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newDept, setNewDept] = useState('Computer Science');

  // Fees Gateway Simulator states
  const [paymentAmount, setPaymentAmount] = useState('2500');
  const [paymentStatus, setPaymentStatus] = useState('');
  const [paymentLoading, setPaymentLoading] = useState(false);

  // Fetch applications
  const fetchApplications = async () => {
    try {
      const res = await fetch('/api/admissions/applications');
      if (res.ok) {
        const data = await res.json();
        setApplications(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  // Submit new application
  const handleSubmitApplication = async (e) => {
    e.preventDefault();
    if (!newName.trim() || !newEmail.trim()) return;

    try {
      const res = await fetch('/api/admissions/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newName,
          email: newEmail,
          department: newDept,
          status: 'Applied'
        })
      });

      if (res.ok) {
        setNewName('');
        setNewEmail('');
        fetchApplications();
        setFunnelData(prev => ({ ...prev, applied: prev.applied + 1 }));
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Action: update status (issue DID / Verify)
  const handleUpdateStatus = (appId, nextStatus) => {
    setApplications(prev => prev.map(app => {
      if (app.id === appId) {
        return { ...app, status: nextStatus };
      }
      return app;
    }));
    alert(`Applicant status updated: ${nextStatus}. Anchorage root synchronization triggered.`);
  };

  // Action: Simulate Tuition Deposit Gateway
  const handleSimulatePayment = (e) => {
    e.preventDefault();
    setPaymentLoading(true);
    setPaymentStatus('');

    setTimeout(() => {
      setPaymentLoading(false);
      setPaymentStatus('Tuition payment of $' + paymentAmount + ' processed successfully via CampusX Merchant Nodes!');
    }, 1800);
  };

  return (
    <div className="min-h-screen bg-[#071126] text-white p-6 font-sans">
      {/* Top Banner Navigation */}
      <div className="max-w-7xl mx-auto flex items-center justify-between mb-8 pb-4 border-b border-[#102043]">
        <div className="flex items-center gap-3">
          <Link href="/" className="p-2 bg-[#102043] rounded-xl hover:bg-[#1a2e5d] transition-all text-indigo-400">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-white via-indigo-200 to-indigo-400 bg-clip-text text-transparent">
              CAMPUSX Admissions Platform
            </h1>
            <p className="text-xs text-slate-400">Student Enrollment funnels, document verification desk & billing node gateway</p>
          </div>
        </div>

        <div className="flex gap-4 text-xs font-mono text-slate-400">
          <div className="flex items-center gap-1.5">
            <Activity className="w-4 h-4 text-indigo-400" /> Pipeline: <span className="font-bold text-white">94% Capacity</span>
          </div>
        </div>
      </div>

      {/* Main Grid Workdesk */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column - funnel stats & applications table (2 columns) */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          
          {/* Top Panel - Funnel indicators */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Total Applied', val: funnelData.applied, color: 'text-indigo-400' },
              { label: 'Under Review', val: funnelData.underReview, color: 'text-cyan-400' },
              { label: 'Verified SBTs', val: funnelData.verified, color: 'text-emerald-400' },
              { label: 'Approved DIDs', val: funnelData.approved, color: 'text-amber-400' }
            ].map((kpi, idx) => (
              <div key={idx} className="p-5 bg-[#0B1736] border border-[#102043] rounded-2xl text-left">
                <span className="text-[9px] uppercase font-bold text-slate-500 tracking-wider">{kpi.label}</span>
                <p className={`text-2xl font-extrabold font-mono mt-1 ${kpi.color}`}>{kpi.val}</p>
              </div>
            ))}
          </div>

          {/* Core Interactive - Applications roster */}
          <div className="p-6 bg-[#0B1736] border border-[#102043] rounded-3xl flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-[#102043] pb-3">
              <div className="text-left">
                <span className="text-xs font-bold text-white uppercase tracking-wider font-mono">Student Application Roster</span>
                <p className="text-[10px] text-slate-400 mt-0.5">Manage, review, and issue academic DID records</p>
              </div>
            </div>

            {loading ? (
              <div className="text-center py-6 text-slate-400 text-xs">Loading application records...</div>
            ) : applications.length === 0 ? (
              <div className="text-center py-6 text-slate-400 text-xs">No active applications found.</div>
            ) : (
              <div className="overflow-x-auto border border-[#102043] rounded-2xl">
                <table className="w-full text-xs text-left">
                  <thead>
                    <tr className="bg-[#102043]/40 border-b border-[#102043] text-slate-400 font-bold uppercase font-mono">
                      <th className="p-3.5">Applicant details</th>
                      <th className="p-3.5">Target Department</th>
                      <th className="p-3.5">Review Status</th>
                      <th className="p-3.5 text-center">Administrative Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {applications.map((app) => (
                      <tr key={app.id} className="border-b border-[#102043] hover:bg-white/[0.01] transition-all">
                        <td className="p-3.5">
                          <p className="font-bold text-slate-200">{app.name}</p>
                          <span className="text-[10px] text-slate-500 font-mono mt-0.5">{app.email}</span>
                        </td>
                        <td className="p-3.5 text-slate-300 font-medium">{app.department}</td>
                        <td className="p-3.5">
                          <span className={`px-2 py-0.5 rounded text-[8px] font-bold border uppercase ${
                            app.status === 'Approved' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                            app.status === 'Verified' ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' :
                            app.status === 'Under Review' ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20' :
                            'bg-slate-500/10 text-slate-400 border-slate-500/20'
                          }`}>
                            {app.status}
                          </span>
                        </td>
                        <td className="p-3.5 text-center flex items-center justify-center gap-2">
                          {app.status === 'Applied' && (
                            <button
                              onClick={() => handleUpdateStatus(app.id, 'Under Review')}
                              className="px-2 py-1 bg-cyan-600/20 text-cyan-400 hover:bg-cyan-600/30 border border-cyan-600/30 rounded text-[9px] font-bold cursor-pointer"
                            >
                              Review Portfolio
                            </button>
                          )}
                          {app.status === 'Under Review' && (
                            <button
                              onClick={() => handleUpdateStatus(app.id, 'Verified')}
                              className="px-2 py-1 bg-indigo-600/20 text-indigo-400 hover:bg-indigo-600/30 border border-indigo-600/30 rounded text-[9px] font-bold cursor-pointer"
                            >
                              Verify credentials
                            </button>
                          )}
                          {app.status === 'Verified' && (
                            <button
                              onClick={() => handleUpdateStatus(app.id, 'Approved')}
                              className="px-2 py-1 bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600/30 border border-emerald-600/30 rounded text-[9px] font-bold cursor-pointer"
                            >
                              Issue DID Accept
                            </button>
                          )}
                          {app.status === 'Approved' && (
                            <span className="text-slate-500 text-[10px] italic">DID Anchor Active</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

        </div>

        {/* Right Column - Submission Form & Tuition Fee gateway simulator */}
        <div className="flex flex-col gap-6 text-left">
          
          {/* Form to submit a new student application */}
          <div className="p-6 bg-[#0B1736] border border-[#102043] rounded-3xl flex flex-col gap-4">
            <span className="text-xs font-bold text-white uppercase tracking-wider font-mono">Submit Applicant Portfolio</span>
            
            <form onSubmit={handleSubmitApplication} className="flex flex-col gap-3 text-xs">
              <div className="flex flex-col gap-1.5">
                <label className="text-[9px] uppercase font-bold text-slate-400">Applicant Name</label>
                <input
                  type="text"
                  placeholder="John Doe"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="bg-[#102043] border border-[#1a2e5d] rounded-xl p-2.5 text-white outline-none focus:border-indigo-500"
                  required
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[9px] uppercase font-bold text-slate-400">Email Address</label>
                <input
                  type="email"
                  placeholder="johndoe@gmail.com"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className="bg-[#102043] border border-[#1a2e5d] rounded-xl p-2.5 text-white outline-none focus:border-indigo-500"
                  required
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[9px] uppercase font-bold text-slate-400">Department</label>
                <select
                  value={newDept}
                  onChange={(e) => setNewDept(e.target.value)}
                  className="bg-[#102043] border border-[#1a2e5d] rounded-xl p-2.5 text-white outline-none"
                >
                  <option value="Computer Science">Computer Science</option>
                  <option value="BioTech">BioTech</option>
                  <option value="Business Admin">Business Admin</option>
                  <option value="Advanced Mathematics">Advanced Mathematics</option>
                </select>
              </div>
              <button
                type="submit"
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-md"
              >
                <Plus className="w-4 h-4" /> Add Applicant
              </button>
            </form>
          </div>

          {/* Billing Gateway Simulator */}
          <div className="p-6 bg-[#0B1736] border border-[#102043] rounded-3xl flex flex-col gap-4">
            <span className="text-xs font-bold text-white uppercase tracking-wider font-mono flex items-center gap-1.5">
              <DollarSign className="w-4 h-4 text-indigo-400" /> Tuition Fee Gateway
            </span>
            <p className="text-[10px] text-slate-400 -mt-2">Simulate student tuition billing and accounting entries</p>

            <form onSubmit={handleSimulatePayment} className="flex flex-col gap-3.5 text-xs">
              <div className="flex flex-col gap-1.5">
                <label className="text-[9px] uppercase font-bold text-slate-400">Billable Amount ($)</label>
                <input
                  type="number"
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(e.target.value)}
                  className="bg-[#102043] border border-[#1a2e5d] rounded-xl p-2.5 text-white outline-none focus:border-indigo-500 font-mono"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={paymentLoading}
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-md"
              >
                {paymentLoading ? 'Anchoring Transaction...' : 'Process Billing Payment'}
              </button>

              {paymentStatus && (
                <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl text-[10px] leading-relaxed">
                  {paymentStatus}
                </div>
              )}
            </form>
          </div>

        </div>

      </div>
    </div>
  );
}
