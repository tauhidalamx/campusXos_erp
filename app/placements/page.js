'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function PlacementsPage() {
  const [currentUser, setCurrentUser] = useState(null);
  const [activeKebabId, setActiveKebabId] = useState(null);

  const [partners, setPartners] = useState([
    { name: 'Google', recruitedCount: 8, package: '$180,000', industry: 'Technology' },
    { name: 'Nvidia', recruitedCount: 5, package: '$195,000', industry: 'Hardware/AI' },
    { name: 'Stripe', recruitedCount: 12, package: '$160,000', industry: 'Fintech' },
    { name: 'Microsoft', recruitedCount: 15, package: '$150,000', industry: 'Enterprise' }
  ]);

  const [selections, setSelections] = useState([
    { id: 'PLC001', studentName: 'Alex Rivera', company: 'Nvidia', role: 'Machine Learning Engineer', package: '$195,000', status: 'Offer Accepted' },
    { id: 'PLC002', studentName: 'Rahul Sharma', company: 'Google', role: 'Software Engineer', package: '$180,000', status: 'Offer Pending' },
    { id: 'PLC003', studentName: 'Aria Nakamura', company: 'Stripe', role: 'Frontend Engineer', package: '$160,000', status: 'Offer Accepted' }
  ]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const session = sessionStorage.getItem('campusx_erp_session');
      if (session) {
        setCurrentUser(JSON.parse(session));
      }
    }
  }, []);

  const handleUpdateStatus = (id, newStatus) => {
    setSelections(prev => prev.map(s => s.id === id ? { ...s, status: newStatus } : s));
    alert(`Status updated to: ${newStatus}`);
  };

  if (!currentUser || currentUser.role !== 'admin') {
    return (
      <div className="card p-8 text-center bg-brand-bg-secondary border border-brand-border rounded-2xl animate-fade-in my-12">
        <div className="w-16 h-16 bg-brand-accent-ruby/10 text-brand-accent-ruby rounded-full flex items-center justify-center mx-auto mb-4 border border-brand-accent-ruby/20">
          <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
        </div>
        <h2 className="text-xl font-display font-bold text-brand-text-main">Access Denied</h2>
        <p className="text-brand-text-muted text-sm mt-2 max-w-md mx-auto">You do not have the required administrative credentials to access Placement Management.</p>
        <Link className="btn btn-secondary mt-6 cursor-pointer" href="/">Return to Home Portal</Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 md:gap-8">
      <div className="page-header animate-fade-in flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-display font-bold text-brand-text-main">Placement Management</h1>
          <p className="text-brand-text-muted mt-1 text-sm">Monitor campus recruiting pipelines, partner companies, salary statistics, and student placements.</p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 animate-fade-in mt-2">
        <div className="card p-6 bg-brand-bg-secondary border border-brand-border rounded-2xl flex items-center justify-between">
          <div>
            <span className="text-brand-text-muted text-xs font-semibold">Highest Package</span>
            <span className="block text-2xl font-bold font-display text-brand-accent-emerald mt-1">$195,000</span>
            <span className="text-[0.7rem] text-brand-text-subtle mt-1 block">Nvidia, ML Engineer</span>
          </div>
          <div className="p-3 bg-brand-accent-emerald/10 rounded-xl text-brand-accent-emerald">
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
          </div>
        </div>
        <div className="card p-6 bg-brand-bg-secondary border border-brand-border rounded-2xl flex items-center justify-between">
          <div>
            <span className="text-brand-text-muted text-xs font-semibold">Placement Rate</span>
            <span className="block text-2xl font-bold font-display text-brand-primary mt-1">94.8%</span>
            <span className="text-[0.7rem] text-brand-primary mt-1 block">Recruiting Cohort 2026</span>
          </div>
          <div className="p-3 bg-brand-primary/10 rounded-xl text-brand-primary">
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
          </div>
        </div>
        <div className="card p-6 bg-brand-bg-secondary border border-brand-border rounded-2xl flex items-center justify-between">
          <div>
            <span className="text-brand-text-muted text-xs font-semibold">Recruiting Partners</span>
            <span className="block text-2xl font-bold font-display text-brand-accent-cyan mt-1">32 Companies</span>
            <span className="text-[0.7rem] text-brand-accent-cyan mt-1 block">Global Corporate Partners</span>
          </div>
          <div className="p-3 bg-brand-accent-cyan/10 rounded-xl text-brand-accent-cyan">
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
          </div>
        </div>
      </div>

      {/* Recruiter stats and selection roster */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.4fr] gap-6 animate-fade-in">
        {/* Recruiter partner card */}
        <div className="card p-6 bg-brand-bg-secondary border border-brand-border rounded-2xl flex flex-col gap-4">
          <h3 className="m-0 font-display text-base font-bold text-brand-text-main">Hiring Partner Overview</h3>
          <div className="flex flex-col gap-3">
            {partners.map((p, i) => (
              <div key={i} className="p-3 bg-brand-bg-tertiary border border-brand-border rounded-xl flex items-center justify-between text-sm">
                <div>
                  <strong className="text-brand-text-main block">{p.name}</strong>
                  <span className="text-xs text-brand-text-subtle">{p.industry}</span>
                </div>
                <div className="text-right">
                  <div className="font-bold text-brand-primary">{p.recruitedCount} Placed</div>
                  <div className="text-[0.7rem] text-brand-text-muted font-mono">{p.package} Avg</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Student placement table */}
        <div className="card p-6 bg-brand-bg-secondary border border-brand-border rounded-2xl flex flex-col">
          <h3 className="mb-4 font-display text-base font-bold text-brand-text-main">Student Placements Registry</h3>
          <div className="table-container overflow-x-auto relative">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-brand-border text-brand-text-subtle text-xs uppercase font-semibold">
                  <th className="p-3">Student Name</th>
                  <th className="p-3">Company / Role</th>
                  <th className="p-3">Package</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {selections.map(s => (
                  <tr key={s.id} className="border-b border-brand-border hover:bg-white/[0.01] transition-colors text-sm text-brand-text-main">
                    <td className="p-3 font-semibold text-brand-text-main">{s.studentName}</td>
                    <td className="p-3">
                      <div className="font-bold text-brand-text-main">{s.company}</div>
                      <div className="text-xs text-brand-text-muted">{s.role}</div>
                    </td>
                    <td className="p-3 font-mono text-xs font-semibold text-brand-accent-emerald">{s.package}</td>
                    <td className="p-3">
                      <span className={`badge text-xs px-2 py-0.5 rounded font-semibold ${
                        s.status === 'Offer Accepted' ? 'bg-brand-accent-emerald/10 text-brand-accent-emerald' : 'bg-brand-accent-amber/10 text-brand-accent-amber'
                      }`}>
                        {s.status}
                      </span>
                    </td>
                    <td className="p-3 text-right relative">
                      <button 
                        className="text-brand-text-muted hover:text-white p-2 rounded-lg transition-all focus:bg-brand-bg-tertiary cursor-pointer inline-flex items-center justify-center"
                        onClick={() => setActiveKebabId(activeKebabId === s.id ? null : s.id)}
                      >
                        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/></svg>
                      </button>
                      {activeKebabId === s.id && (
                        <div className="absolute right-4 top-12 bg-brand-bg-tertiary border border-brand-border rounded-xl shadow-2xl z-[100] w-36 text-left p-1.5 animate-scale-up">
                          <button 
                            className="w-full text-left px-3 py-2 text-xs font-semibold text-brand-text-main hover:bg-white/[0.05] rounded-lg cursor-pointer"
                            onClick={() => { setActiveKebabId(null); handleUpdateStatus(s.id, 'Offer Accepted'); }}
                          >
                            Mark Accepted
                          </button>
                          <button 
                            className="w-full text-left px-3 py-2 text-xs font-semibold text-brand-text-main hover:bg-white/[0.05] rounded-lg cursor-pointer"
                            onClick={() => { setActiveKebabId(null); handleUpdateStatus(s.id, 'Offer Rejected'); }}
                          >
                            Mark Rejected
                          </button>
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
    </div>
  );
}
