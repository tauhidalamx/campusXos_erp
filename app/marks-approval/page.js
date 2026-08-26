'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function MarksApprovalPage() {
  const [currentUser, setCurrentUser] = useState(null);
  const [submissions, setSubmissions] = useState([
    { id: 'SUB001', course: 'Computer Architecture (CS101)', submittedBy: 'Prof. Marcus Chen', date: '2026-06-08', status: 'Pending Approval' },
    { id: 'SUB002', course: 'Advanced Machine Learning (CS102)', submittedBy: 'Dr. Evelyn Sterling', date: '2026-06-09', status: 'Pending Approval' }
  ]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const session = sessionStorage.getItem('campusx_erp_session');
      if (session) {
        setCurrentUser(JSON.parse(session));
      }
    }
  }, []);

  const handleApprove = (id, course) => {
    setSubmissions(prev => prev.map(s => s.id === id ? { ...s, status: 'Approved' } : s));
    alert(`Grades for "${course}" have been approved and synced to student transcripts.`);
  };

  const handleReject = (id, course) => {
    const reason = prompt('Enter rejection feedback for instructor:');
    if (reason) {
      setSubmissions(prev => prev.map(s => s.id === id ? { ...s, status: `Rejected: ${reason}` } : s));
      alert(`Grades for "${course}" rejected. Feedback sent to faculty.`);
    }
  };

  if (!currentUser || (currentUser.role !== 'hod' && currentUser.role !== 'admin')) {
    return (
      <div className="card p-8 text-center bg-brand-bg-secondary border border-brand-border rounded-2xl animate-fade-in my-12">
        <div className="w-16 h-16 bg-brand-accent-ruby/10 text-brand-accent-ruby rounded-full flex items-center justify-center mx-auto mb-4 border border-brand-accent-ruby/20">
          <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
        </div>
        <h2 className="text-xl font-display font-bold text-brand-text-main">Access Denied</h2>
        <p className="text-brand-text-muted text-sm mt-2 max-w-md mx-auto">You do not have the required HOD credentials to access Marks Approval.</p>
        <Link className="btn btn-secondary mt-6 cursor-pointer" href="/">Return to Home Portal</Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 md:gap-8">
      <div className="page-header animate-fade-in flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-display font-bold text-brand-text-main">Internal Marks Approval</h1>
          <p className="text-brand-text-muted mt-1 text-sm">Review, verify, and approve class grade listings submitted by departmental faculty.</p>
        </div>
      </div>

      {/* Grade submissions table */}
      <div className="card p-6 bg-brand-bg-secondary border border-brand-border rounded-2xl animate-fade-in mt-2">
        <h3 className="mb-4 font-display text-base font-bold text-brand-text-main">Pending Marks Submissions</h3>
        <div className="table-container overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-brand-border text-brand-text-subtle text-xs uppercase font-semibold">
                <th className="p-4">Course</th>
                <th className="p-4">Submitted By</th>
                <th className="p-4">Submission Date</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {submissions.map(s => (
                <tr key={s.id} className="border-b border-brand-border hover:bg-white/[0.01] transition-colors text-sm text-brand-text-main">
                  <td className="p-4 font-semibold text-brand-text-main">{s.course}</td>
                  <td className="p-4 text-brand-text-muted">{s.submittedBy}</td>
                  <td className="p-4 font-mono text-xs">{s.date}</td>
                  <td className="p-4">
                    <span className={`badge text-xs px-2 py-0.5 rounded font-semibold ${
                      s.status === 'Approved' ? 'bg-brand-accent-emerald/10 text-brand-accent-emerald' : 
                      s.status.startsWith('Rejected') ? 'bg-brand-accent-ruby/10 text-brand-accent-ruby' :
                      'bg-brand-accent-amber/10 text-brand-accent-amber'
                    }`}>
                      {s.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    {s.status === 'Pending Approval' ? (
                      <div className="flex gap-2 justify-end">
                        <button className="btn btn-secondary btn-sm cursor-pointer" onClick={() => handleReject(s.id, s.course)}>Reject</button>
                        <button className="btn btn-primary btn-sm cursor-pointer" onClick={() => handleApprove(s.id, s.course)}>Approve</button>
                      </div>
                    ) : (
                      <span className="text-xs text-brand-text-subtle font-medium">No actions</span>
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
