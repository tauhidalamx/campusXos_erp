'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function ScholarshipsPage() {
  const [currentUser, setCurrentUser] = useState(null);
  const [selectedScheme, setSelectedScheme] = useState('All');
  const [showApplyModal, setShowApplyModal] = useState(false);

  // Available Schemes
  const schemes = [
    { id: 'SCH-01', name: 'CampusX Academic Merit Fellowship', amount: '$5,000 / Sem', eligibility: 'CGPA > 9.50', deadline: '2026-07-15', status: 'Open' },
    { id: 'SCH-02', name: 'STEM Excellence Scholarship', amount: '$3,500 / Sem', eligibility: 'CS / Eng Majors only', deadline: '2026-08-01', status: 'Open' },
    { id: 'SCH-03', name: 'Need-based Tuition Subsidy', amount: 'Up to 100% tuition', eligibility: 'Annual Income < $50k', deadline: '2026-07-20', status: 'Open' },
    { id: 'SCH-04', name: 'Dean Research Fellowship Grant', amount: '$4,000 / Sem', eligibility: 'Publications active', deadline: '2026-06-30', status: 'Closing Soon' }
  ];

  // Dummy Application Database
  const [applications, setApplications] = useState([
    { id: 'APP-101', studentName: 'Aarav Mehta', scheme: 'CampusX Academic Merit Fellowship', appliedDate: '2026-06-08', amount: '$5,000 / Sem', status: 'Approved' },
    { id: 'APP-102', studentName: 'Priya Nair', scheme: 'STEM Excellence Scholarship', appliedDate: '2026-06-09', amount: '$3,500 / Sem', status: 'Pending' },
    { id: 'APP-103', studentName: 'Kabir Sen', scheme: 'Need-based Tuition Subsidy', appliedDate: '2026-06-10', amount: 'Up to 100% tuition', status: 'Pending' }
  ]);

  const [newApplication, setNewApplication] = useState({
    scheme: 'CampusX Academic Merit Fellowship', statement: ''
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const session = sessionStorage.getItem('campusx_erp_session');
      if (session) {
        setCurrentUser(JSON.parse(session));
      }
    }
  }, []);

  if (!currentUser || (currentUser.role !== 'admin' && currentUser.role !== 'hod' && currentUser.role !== 'student')) {
    return (
      <div className="card p-8 text-center bg-brand-bg-secondary border border-brand-border rounded-2xl animate-fade-in my-12">
        <div className="w-16 h-16 bg-brand-accent-ruby/10 text-brand-accent-ruby rounded-full flex items-center justify-center mx-auto mb-4 border border-brand-accent-ruby/20">
          <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
        </div>
        <h2 className="text-xl font-display font-bold text-brand-text-main">Access Denied</h2>
        <p className="text-brand-text-muted text-sm mt-2 max-w-md mx-auto">You do not have the required student or finance coordinator credentials to view Scholarships.</p>
        <Link className="btn btn-secondary mt-6 cursor-pointer" href="/">Return to Home</Link>
      </div>
    );
  }

  const handleApplySubmit = (e) => {
    e.preventDefault();
    const app = {
      id: `APP-${Date.now().toString().slice(-3)}`,
      studentName: currentUser.name || 'Anonymous Student',
      scheme: newApplication.scheme,
      appliedDate: new Date().toISOString().split('T')[0],
      amount: schemes.find(s => s.name === newApplication.scheme)?.amount || '$3,000 / Sem',
      status: 'Pending'
    };
    setApplications([app, ...applications]);
    setNewApplication({ scheme: 'CampusX Academic Merit Fellowship', statement: '' });
    setShowApplyModal(false);
    alert('Scholarship application submitted to financial office registry!');
  };

  const handleUpdateStatus = (id, newStatus) => {
    setApplications(prev => prev.map(a => a.id === id ? { ...a, status: newStatus } : a));
    alert(`Application status updated to ${newStatus}.`);
  };

  return (
    <div className="flex flex-col gap-6 md:gap-8">
      {/* Header */}
      <div className="page-header animate-fade-in flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-brand-text-main">Grants & Scholarships</h1>
          <p className="text-brand-text-muted mt-1 text-sm">Review available endowments, submit scholarship statements, and approve tuition waivers.</p>
        </div>
        {currentUser.role === 'student' && (
          <button 
            onClick={() => setShowApplyModal(true)}
            className="btn btn-primary cursor-pointer flex items-center gap-1.5"
          >
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Apply for Scholarship
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-2 animate-fade-in">
        {/* Schemes Registry (All see this) */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <div className="card p-6 bg-brand-bg-secondary border border-brand-border rounded-2xl">
            <h3 className="mb-4 font-display text-base font-bold text-brand-text-main border-b border-brand-border pb-3">Available Scholarship Endowments</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {schemes.map(sch => (
                <div key={sch.id} className="p-4 bg-brand-bg-tertiary/60 border border-brand-border rounded-xl flex flex-col justify-between gap-3">
                  <div>
                    <div className="flex justify-between items-center text-[10px]">
                      <span className="font-mono text-brand-text-muted">{sch.id}</span>
                      <span className={`badge px-1.5 py-0.5 rounded font-bold ${sch.status === 'Open' ? 'bg-brand-accent-emerald/10 text-brand-accent-emerald' : 'bg-brand-accent-amber/10 text-brand-accent-amber'}`}>{sch.status}</span>
                    </div>
                    <h4 className="text-sm font-bold text-brand-text-main mt-2 mb-1">{sch.name}</h4>
                    <span className="text-xs text-brand-accent-cyan font-mono font-semibold">{sch.amount}</span>
                  </div>
                  <div className="text-[11px] text-brand-text-muted border-t border-brand-border/40 pt-2 flex flex-col gap-1">
                    <div>Eligibility: <strong className="text-brand-text-subtle font-semibold">{sch.eligibility}</strong></div>
                    <div>Deadline: <span className="font-mono">{sch.deadline}</span></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Applications Hub (Restricted actions based on role) */}
        <div className="flex flex-col gap-6">
          <div className="card p-6 bg-brand-bg-secondary border border-brand-border rounded-2xl flex flex-col gap-4">
            <h3 className="m-0 font-display text-base font-bold text-brand-text-main border-b border-brand-border pb-3">
              {currentUser.role === 'student' ? 'My Submitted Applications' : 'Waiver Approvals Ledger'}
            </h3>
            
            <div className="flex flex-col gap-4">
              {applications
                .filter(a => currentUser.role !== 'student' || a.studentName === currentUser.name || a.studentName === 'Aarav Mehta')
                .map(app => (
                  <div key={app.id} className="p-4 bg-brand-bg-tertiary/40 border border-brand-border rounded-xl flex flex-col gap-3">
                    <div className="flex justify-between items-start text-xs">
                      <div>
                        <strong className="text-brand-text-main font-semibold block">{app.scheme}</strong>
                        <span className="text-[10px] text-brand-text-muted block mt-0.5 font-mono">App ID: {app.id} • Candidate: {app.studentName}</span>
                      </div>
                      <span className={`badge text-[10px] px-2 py-0.5 rounded-full font-bold ${app.status === 'Approved' ? 'bg-brand-accent-emerald/10 text-brand-accent-emerald' : (app.status === 'Rejected' ? 'bg-brand-accent-ruby/10 text-brand-accent-ruby' : 'bg-brand-accent-amber/10 text-brand-accent-amber')}`}>
                        {app.status}
                      </span>
                    </div>

                    {currentUser.role !== 'student' && app.status === 'Pending' && (
                      <div className="flex gap-2 border-t border-brand-border/40 pt-2 text-xs">
                        <button
                          onClick={() => handleUpdateStatus(app.id, 'Rejected')}
                          className="btn btn-secondary text-xs flex-1 py-1 cursor-pointer"
                        >
                          Reject
                        </button>
                        <button
                          onClick={() => handleUpdateStatus(app.id, 'Approved')}
                          className="btn btn-primary text-xs flex-1 py-1 cursor-pointer bg-brand-accent-emerald hover:bg-brand-accent-emerald/80"
                        >
                          Approve
                        </button>
                      </div>
                    )}
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>

      {/* Apply Modal */}
      {showApplyModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-[999] p-4">
          <div className="bg-brand-bg-secondary border border-brand-border rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-scale-up">
            <div className="flex justify-between items-center px-6 py-4 border-b border-brand-border">
              <h3 className="font-display text-base font-bold text-brand-text-main m-0">Apply for Scholarship</h3>
              <button 
                onClick={() => setShowApplyModal(false)}
                className="text-brand-text-muted hover:text-white cursor-pointer"
              >
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>
            <form onSubmit={handleApplySubmit} className="p-6 flex flex-col gap-4 text-sm">
              <div>
                <label className="block text-xs font-semibold text-brand-text-subtle mb-1.5">Select Program Scheme *</label>
                <select 
                  value={newApplication.scheme}
                  onChange={(e) => setNewApplication({...newApplication, scheme: e.target.value})}
                  className="w-full bg-brand-bg-tertiary border border-brand-border text-brand-text-main p-2.5 rounded-xl outline-none font-semibold cursor-pointer"
                >
                  {schemes.map(s => (
                    <option key={s.id} value={s.name}>{s.name} ({s.amount})</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-brand-text-subtle mb-1.5">Statement of Purpose / Eligibility Claim *</label>
                <textarea 
                  required
                  rows="4"
                  value={newApplication.statement}
                  onChange={(e) => setNewApplication({...newApplication, statement: e.target.value})}
                  className="w-full bg-brand-bg-tertiary border border-brand-border text-brand-text-main p-2.5 rounded-xl outline-none focus:border-brand-primary"
                  placeholder="Explain why you meet the scholarship criteria..."
                />
              </div>
              <div className="flex gap-3 justify-end mt-4">
                <button 
                  type="button" 
                  onClick={() => setShowApplyModal(false)}
                  className="btn btn-secondary cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn btn-primary cursor-pointer"
                >
                  Submit Application
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
