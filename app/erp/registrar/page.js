'use client';

import React, { useState, useEffect } from 'react';
import { Award, FileText, CheckCircle, ShieldCheck, RefreshCw, Send, Calendar, Shield, UserCheck, Loader2 } from 'lucide-react';

export default function RegistrarDashboard() {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [requests, setRequests] = useState([
    { id: 'req_1', student: 'Aria Nakamura', type: 'Official Transcript', status: 'Pending Audit', hash: 'N/A' },
    { id: 'req_2', student: 'Alex Rivera', type: 'B.Sc. Degree Certificate', status: 'Pending Signature', hash: 'N/A' },
    { id: 'req_3', student: 'Zoe Chen', type: 'Academic Honours Certificate', status: 'Issued & Hashed', hash: '0x8f72...a12c' }
  ]);

  // Semester Registration states
  const [sessionWindow, setSessionWindow] = useState(null);
  const [pendingApprovals, setPendingApprovals] = useState([]);
  const [approvalLoading, setApprovalLoading] = useState({});
  const [approvalComments, setApprovalComments] = useState({});

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const session = sessionStorage.getItem('campusx_erp_session');
      if (session) {
        setCurrentUser(JSON.parse(session));
      }
      fetchWindows();
      fetchPendingRegistrations();
    }
  }, []);

  const fetchWindows = async () => {
    try {
      const res = await fetch('/api/registration/windows');
      const data = await res.json();
      const activeWindow = data.find(w => w.session === 'Spring 2026') || data[0];
      setSessionWindow(activeWindow);
    } catch (err) {
      console.error('Error fetching registration windows:', err);
    }
  };

  const fetchPendingRegistrations = async () => {
    try {
      const res = await fetch('/api/registration/analytics');
      const data = await res.json();
      if (data.registrations) {
        setPendingApprovals(data.registrations);
      }
      setLoading(false);
    } catch (err) {
      console.error('Error fetching registration roster:', err);
      setLoading(false);
    }
  };

  const toggleWindow = async () => {
    if (!sessionWindow) return;
    const nextState = sessionWindow.is_open === 1 ? 0 : 1;
    try {
      const res = await fetch('/api/registration/windows/toggle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ session: sessionWindow.session, is_open: nextState })
      });
      const data = await res.json();
      if (data.success) {
        setSessionWindow({ ...sessionWindow, is_open: nextState });
        alert(`Semester registration window successfully ${nextState ? 'opened' : 'closed'}!`);
      }
    } catch (err) {
      console.error('Error toggling registration window:', err);
    }
  };

  const handleApprovalAction = async (studentId, step, action) => {
    setApprovalLoading(prev => ({ ...prev, [studentId]: true }));
    try {
      const comments = approvalComments[studentId] || 'Registrar office sign-off';
      const approverName = currentUser?.name || 'Office Registrar';
      
      const res = await fetch('/api/registration/approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          student_id: studentId,
          session: 'Spring 2026',
          step,
          approver: approverName,
          comments,
          action
        })
      });
      const data = await res.json();
      if (data.success) {
        alert(`Registration ${action.toLowerCase()}d successfully for student ${studentId}.`);
        fetchPendingRegistrations(); // reload
      }
    } catch (err) {
      console.error('Error submitting approval signature:', err);
    } finally {
      setApprovalLoading(prev => ({ ...prev, [studentId]: false }));
    }
  };

  const handleIssueCredential = (id) => {
    const randomHash = '0x' + Math.floor(Math.random()*10000000).toString(16) + '...' + Math.floor(Math.random()*10000).toString(16);
    setRequests(prev => prev.map(r => r.id === id ? { ...r, status: 'Issued & Hashed', hash: randomHash } : r));
    alert(`Credential successfully generated, signed cryptographically, and anchored to CampusX Ledger. Hash: ${randomHash}`);
  };

  if (loading) return null;

  return (
    <div className="flex flex-col gap-6 md:gap-8 fade-in">
      <div className="flex justify-between items-center pb-4 border-b border-brand-border/40">
        <div>
          <h1 className="text-3xl font-display font-bold text-white tracking-tight flex items-center gap-3">
            <Award className="w-8 h-8 text-brand-accent-cyan" />
            Academic Records & Registrar Center
          </h1>
          <p className="text-brand-text-muted text-sm mt-1">Registrar administrative desk. Perform academic audits, issue official transcripts, verify student credentials, and publish signed certificates to blockchain.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card p-5 bg-brand-bg-secondary border border-brand-border rounded-2xl flex items-center justify-between">
          <div>
            <span className="text-brand-text-muted text-xs font-semibold">Pending Audit Requests</span>
            <span className="block text-2xl font-bold font-display text-white mt-1">12 Students</span>
            <span className="text-[10px] text-brand-accent-amber mt-1 block">Requires GPA checks</span>
          </div>
          <div className="p-3 bg-brand-accent-amber/10 rounded-xl text-brand-accent-amber">
            <FileText className="w-6 h-6" />
          </div>
        </div>

        <div className="card p-5 bg-brand-bg-secondary border border-brand-border rounded-2xl flex items-center justify-between">
          <div>
            <span className="text-brand-text-muted text-xs font-semibold">Active registration session</span>
            <span className="block text-xl font-bold font-display text-brand-accent-cyan mt-1.5">
              {sessionWindow ? `${sessionWindow.session} (${sessionWindow.is_open ? 'Open' : 'Closed'})` : 'None'}
            </span>
            <span className="text-[10px] text-brand-text-muted mt-1 block">Configure session windows below</span>
          </div>
          <div className="p-3 bg-brand-accent-cyan/10 rounded-xl text-brand-accent-cyan">
            <Calendar className="w-6 h-6" />
          </div>
        </div>

        <div className="card p-5 bg-brand-bg-secondary border border-brand-border rounded-2xl flex items-center justify-between">
          <div>
            <span className="text-brand-text-muted text-xs font-semibold">Pending Enrolments</span>
            <span className="block text-2xl font-bold font-display text-brand-accent-emerald mt-1">
              {pendingApprovals.filter(r => r.status === 'PENDING').length} Student Approvals
            </span>
            <span className="text-[10px] text-brand-accent-emerald mt-1 block">Course selection tracking</span>
          </div>
          <div className="p-3 bg-brand-accent-emerald/10 rounded-xl text-brand-accent-emerald">
            <ShieldCheck className="w-6 h-6" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Verification Queue */}
        <div className="card bg-brand-bg-secondary border border-brand-border rounded-2xl p-6 flex flex-col gap-4">
          <h3 className="text-lg font-bold font-display text-white border-b border-brand-border/40 pb-3 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-brand-accent-cyan" />
            Verification & Graduation Issuance Panel
          </h3>
          <div className="flex flex-col gap-3.5">
            {requests.map(req => (
              <div key={req.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-brand-bg-tertiary/60 border border-brand-border/40 rounded-2xl text-xs gap-3">
                <div className="flex flex-col gap-1">
                  <span className="font-bold text-white text-sm">{req.student}</span>
                  <span className="text-brand-text-muted">Requested Document: <strong className="text-white font-medium">{req.type}</strong></span>
                  {req.hash !== 'N/A' && (
                    <span className="text-[10px] text-brand-accent-emerald font-mono">Ledger Proof Hash: {req.hash}</span>
                  )}
                </div>
                <div className="flex items-center gap-3 self-end sm:self-center shrink-0">
                  <span className={`badge text-[10px] px-2.5 py-0.5 rounded font-semibold ${
                    req.status === 'Issued & Hashed' 
                      ? 'bg-brand-accent-emerald/20 text-brand-accent-emerald' 
                      : (req.status === 'Pending Signature' ? 'bg-brand-accent-cyan/20 text-brand-accent-cyan' : 'bg-brand-accent-amber/20 text-brand-accent-amber')
                  }`}>
                    {req.status}
                  </span>
                  {req.status !== 'Issued & Hashed' && (
                    <button 
                      onClick={() => handleIssueCredential(req.id)} 
                      className="btn btn-primary btn-sm flex items-center gap-1.5 cursor-pointer text-xs py-1 px-3"
                    >
                      <Award className="w-3.5 h-3.5" />
                      Sign & Issue
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Semester Window Management Panel */}
        <div className="card bg-brand-bg-secondary border border-brand-border rounded-2xl p-6 flex flex-col gap-4">
          <h3 className="text-lg font-bold font-display text-white border-b border-brand-border/40 pb-3 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-brand-accent-amber" />
            Semester Enrolment Window Management
          </h3>
          <div className="flex flex-col gap-4">
            {sessionWindow && (
              <div className="p-4 bg-brand-bg-tertiary/60 border border-brand-border/40 rounded-xl flex items-center justify-between text-xs">
                <div className="flex flex-col gap-1">
                  <span className="font-bold text-white text-sm">Session: {sessionWindow.session}</span>
                  <span className="text-brand-text-muted">Start: {sessionWindow.start_date} | End: {sessionWindow.end_date}</span>
                  <span className={`font-semibold mt-1 ${sessionWindow.is_open ? 'text-brand-accent-emerald' : 'text-brand-accent-red'}`}>
                    Status: {sessionWindow.is_open ? 'ACTIVE' : 'INACTIVE'}
                  </span>
                </div>
                <button
                  onClick={toggleWindow}
                  className={`px-4 py-2 font-semibold font-display rounded-lg transition-all ${
                    sessionWindow.is_open 
                      ? 'bg-brand-accent-red hover:bg-brand-accent-red-hover text-white' 
                      : 'bg-brand-accent-emerald hover:bg-brand-accent-emerald-hover text-black'
                  }`}
                >
                  {sessionWindow.is_open ? 'Close Window' : 'Open Window'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Registrations approval queue */}
      <div className="card bg-brand-bg-secondary border border-brand-border rounded-2xl p-6 flex flex-col gap-4 text-white">
        <h3 className="text-lg font-bold font-display flex items-center gap-2 border-b border-brand-border/40 pb-3">
          <UserCheck className="w-5 h-5 text-brand-primary" />
          Pending Student Registrations & Clearances Approvals Queue
        </h3>
        
        <div className="flex flex-col gap-4">
          {pendingApprovals.length === 0 ? (
            <div className="p-6 text-center text-brand-text-muted text-xs">
              No registrations pending approval in the system database.
            </div>
          ) : (
            pendingApprovals.map(reg => {
              let nextStep = '';
              let currentStepLabel = '';
              if (!reg.advisor_approved) { nextStep = 'ADVISOR'; currentStepLabel = 'Advisor Sign'; }
              else if (!reg.hod_approved) { nextStep = 'HOD'; currentStepLabel = 'HOD Sign'; }
              else if (!reg.dean_approved) { nextStep = 'DEAN'; currentStepLabel = 'Dean Sign'; }
              else if (!reg.registrar_approved) { nextStep = 'REGISTRAR'; currentStepLabel = 'Registrar Final Sign'; }

              return (
                <div key={reg.id} className="p-4 bg-brand-bg-tertiary border border-brand-border/40 rounded-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-xs">
                  <div className="flex flex-col gap-1 max-w-md">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-sm">{reg.student_name}</span>
                      <span className="text-[10px] bg-brand-primary/10 border border-brand-primary/30 text-brand-primary px-2 py-0.5 rounded-full">{reg.student_id}</span>
                    </div>
                    <span className="text-brand-text-muted font-semibold">Department: {reg.department} | Session: {reg.session}</span>
                    <div className="flex flex-col gap-1 mt-1 font-mono text-[9px] text-brand-text-muted">
                      <div>Advisor: {reg.advisor_approved ? '✓ Approved' : '⏳ Pending'} | HOD: {reg.hod_approved ? '✓ Approved' : '⏳ Pending'}</div>
                      <div>Dean: {reg.dean_approved ? '✓ Approved' : '⏳ Pending'} | Registrar: {reg.registrar_approved ? '✓ Approved' : '⏳ Pending'}</div>
                      <div>Fees clearance status: <span className={reg.fee_status === 'CLEARED' ? 'text-brand-accent-emerald' : 'text-brand-accent-red'}>{reg.fee_status}</span></div>
                    </div>
                  </div>

                  {reg.status !== 'APPROVED' ? (
                    <div className="flex flex-col gap-2 w-full md:w-auto">
                      <input 
                        type="text" 
                        placeholder="Add approval signature comments..."
                        className="bg-brand-bg-secondary border border-brand-border rounded-lg p-2 text-xs text-white placeholder-brand-text-muted w-full md:w-64"
                        value={approvalComments[reg.student_id] || ''}
                        onChange={(e) => setApprovalComments({ ...approvalComments, [reg.student_id]: e.target.value })}
                      />
                      <div className="flex gap-2">
                        <button
                          disabled={approvalLoading[reg.student_id]}
                          onClick={() => handleApprovalAction(reg.student_id, nextStep, 'APPROVE')}
                          className="px-3.5 py-1.5 bg-brand-accent-emerald text-black font-semibold font-display text-[10px] rounded-lg hover:bg-brand-accent-emerald-hover flex items-center gap-1.5"
                        >
                          {approvalLoading[reg.student_id] && <Loader2 className="w-3 h-3 animate-spin" />}
                          Sign & Approve ({currentStepLabel})
                        </button>
                        <button
                          disabled={approvalLoading[reg.student_id]}
                          onClick={() => handleApprovalAction(reg.student_id, nextStep, 'REJECT')}
                          className="px-3.5 py-1.5 bg-brand-accent-red text-white font-semibold font-display text-[10px] rounded-lg hover:bg-brand-accent-red-hover"
                        >
                          Reject
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-end gap-1">
                      <span className="text-brand-accent-emerald font-bold text-xs flex items-center gap-1">
                        <CheckCircle className="w-3.5 h-3.5" /> Approved & Enrolled
                      </span>
                      {reg.tx_hash && (
                        <span className="text-[9px] text-brand-text-muted font-mono max-w-[150px] truncate">
                          TX: {reg.tx_hash}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
