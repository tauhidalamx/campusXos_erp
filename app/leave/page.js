'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function LeavePage() {
  const [currentUser, setCurrentUser] = useState(null);
  const [activeKebabId, setActiveKebabId] = useState(null);

  const [leaves, setLeaves] = useState([
    { id: 'LEV001', type: 'Casual Leave', startDate: '2026-06-20', endDate: '2026-06-22', reason: 'Medical Checkup', status: 'Approved' },
    { id: 'LEV002', type: 'Sick Leave', startDate: '2026-07-05', endDate: '2026-07-06', reason: 'Family Event', status: 'Pending Approval' }
  ]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const session = sessionStorage.getItem('campusx_erp_session');
      if (session) {
        setCurrentUser(JSON.parse(session));
      }
    }
  }, []);

  const handleCancelLeave = (id) => {
    if (confirm('Cancel this leave request?')) {
      setLeaves(prev => prev.filter(l => l.id !== id));
      alert('Leave request cancelled.');
    }
  };

  const handleApplyLeave = () => {
    const type = prompt('Enter Leave Type (Casual, Sick, Earned):');
    const startDate = prompt('Enter Start Date (YYYY-MM-DD):');
    const endDate = prompt('Enter End Date (YYYY-MM-DD):');
    const reason = prompt('Enter Reason:');

    if (type && startDate && endDate && reason) {
      const newLeave = {
        id: 'LEV' + String(leaves.length + 1).padStart(3, '0'),
        type,
        startDate,
        endDate,
        reason,
        status: 'Pending Approval'
      };
      setLeaves(prev => [...prev, newLeave]);
      alert('Leave application submitted to HOD.');
    }
  };

  if (!currentUser || (currentUser.role !== 'faculty' && currentUser.role !== 'admin')) {
    return (
      <div className="card p-8 text-center bg-brand-bg-secondary border border-brand-border rounded-2xl animate-fade-in my-12">
        <div className="w-16 h-16 bg-brand-accent-ruby/10 text-brand-accent-ruby rounded-full flex items-center justify-center mx-auto mb-4 border border-brand-accent-ruby/20">
          <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
        </div>
        <h2 className="text-xl font-display font-bold text-brand-text-main">Access Denied</h2>
        <p className="text-brand-text-muted text-sm mt-2 max-w-md mx-auto">You do not have the required Faculty credentials to access Leave Requests.</p>
        <Link className="btn btn-secondary mt-6 cursor-pointer" href="/">Return to Home Portal</Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 md:gap-8">
      <div className="page-header animate-fade-in flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-display font-bold text-brand-text-main">Leave Requests</h1>
          <p className="text-brand-text-muted mt-1 text-sm">Apply for leaves, check balance limits, and monitor HOD approvals.</p>
        </div>
        <button className="btn btn-primary cursor-pointer flex items-center gap-2" onClick={handleApplyLeave}>
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Apply for Leave
        </button>
      </div>

      {/* Leave balance cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 animate-fade-in mt-2">
        <div className="card p-5 bg-brand-bg-secondary border border-brand-border rounded-2xl">
          <span className="text-brand-text-muted text-xs font-semibold">Casual Leave Balance</span>
          <span className="block text-2xl font-bold font-display text-brand-text-main mt-1">8 / 12 Days</span>
        </div>
        <div className="card p-5 bg-brand-bg-secondary border border-brand-border rounded-2xl">
          <span className="text-brand-text-muted text-xs font-semibold">Sick Leave Balance</span>
          <span className="block text-2xl font-bold font-display text-brand-text-main mt-1">5 / 8 Days</span>
        </div>
        <div className="card p-5 bg-brand-bg-secondary border border-brand-border rounded-2xl">
          <span className="text-brand-text-muted text-xs font-semibold">Earned Leave Balance</span>
          <span className="block text-2xl font-bold font-display text-brand-text-main mt-1">15 / 15 Days</span>
        </div>
      </div>

      {/* Leave log table */}
      <div className="card p-6 bg-brand-bg-secondary border border-brand-border rounded-2xl animate-fade-in">
        <h3 className="mb-4 font-display text-base font-bold text-brand-text-main">Leave History</h3>
        <div className="table-container overflow-x-auto relative">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-brand-border text-brand-text-subtle text-xs uppercase font-semibold">
                <th className="p-4">Leave Type</th>
                <th className="p-4">Dates</th>
                <th className="p-4">Reason</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {leaves.map(l => (
                <tr key={l.id} className="border-b border-brand-border hover:bg-white/[0.01] transition-colors text-sm text-brand-text-main">
                  <td className="p-4 font-semibold text-brand-text-main">{l.type}</td>
                  <td className="p-4 font-mono text-xs">{l.startDate} &rarr; {l.endDate}</td>
                  <td className="p-4 text-brand-text-muted">{l.reason}</td>
                  <td className="p-4">
                    <span className={`badge text-xs px-2 py-0.5 rounded font-semibold ${
                      l.status === 'Approved' ? 'bg-brand-accent-emerald/10 text-brand-accent-emerald' : 'bg-brand-accent-amber/10 text-brand-accent-amber'
                    }`}>
                      {l.status}
                    </span>
                  </td>
                  <td className="p-4 text-right relative">
                    <button 
                      className="text-brand-text-muted hover:text-white p-2 rounded-lg transition-all focus:bg-brand-bg-tertiary cursor-pointer inline-flex items-center justify-center"
                      onClick={() => setActiveKebabId(activeKebabId === l.id ? null : l.id)}
                    >
                      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/></svg>
                    </button>
                    {activeKebabId === l.id && (
                      <div className="absolute right-4 top-12 bg-brand-bg-tertiary border border-brand-border rounded-xl shadow-2xl z-[100] w-36 text-left p-1.5 animate-scale-up">
                        {l.status === 'Pending Approval' ? (
                          <button 
                            className="w-full text-left px-3 py-2 text-xs font-semibold text-brand-accent-ruby hover:bg-brand-accent-ruby/10 rounded-lg cursor-pointer"
                            onClick={() => { setActiveKebabId(null); handleCancelLeave(l.id); }}
                          >
                            Cancel Request
                          </button>
                        ) : (
                          <span className="block px-3 py-2 text-[0.7rem] text-brand-text-muted">No Actions</span>
                        )}
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
