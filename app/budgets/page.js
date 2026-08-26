'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function BudgetsPage() {
  const [currentUser, setCurrentUser] = useState(null);
  const [showRequestModal, setShowRequestModal] = useState(false);

  // Departmental Budgets
  const [deptBudgets, setDeptBudgets] = useState([
    { id: 'BDG-01', name: 'Computer Science Department', total: 650000, spent: 485000, color: 'from-brand-primary to-brand-accent-cyan' },
    { id: 'BDG-02', name: 'Electrical Engineering Division', total: 420000, spent: 310000, color: 'from-brand-accent-cyan to-brand-accent-emerald' },
    { id: 'BDG-03', name: 'Mechanical & Robotics Center', total: 510000, spent: 425000, color: 'from-brand-accent-emerald to-brand-accent-cyan' },
    { id: 'BDG-04', name: 'Biotech Research Laboratory', total: 800000, spent: 615000, color: 'from-brand-accent-amber to-brand-accent-ruby' }
  ]);

  // Research Grants
  const [researchGrants, setResearchGrants] = useState([
    { id: 'GRN-901', title: 'Neural Network Time-Series Forecasting', lead: 'Prof. Marcus Chen', agency: 'National Science Foundation', amount: 150000, status: 'Active' },
    { id: 'GRN-902', title: 'Quantum Cryptographic Consensus Protocols', lead: 'Dr. Raymond Park', agency: 'Defence Research Agency', amount: 280000, status: 'Active' },
    { id: 'GRN-903', title: 'Biomimetic Neural Prosthetics', lead: 'Dr. Evelyn Sterling', agency: 'Health Research Council', amount: 320000, status: 'Under Review' }
  ]);

  const [newRequest, setNewRequest] = useState({
    title: '', lead: '', agency: 'Institutional Grant', amount: 50000
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const session = sessionStorage.getItem('campusx_erp_session');
      if (session) {
        setCurrentUser(JSON.parse(session));
      }
    }
  }, []);

  if (!currentUser || (currentUser.role !== 'admin' && currentUser.role !== 'hod')) {
    return (
      <div className="card p-8 text-center bg-brand-bg-secondary border border-brand-border rounded-2xl animate-fade-in my-12">
        <div className="w-16 h-16 bg-brand-accent-ruby/10 text-brand-accent-ruby rounded-full flex items-center justify-center mx-auto mb-4 border border-brand-accent-ruby/20">
          <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
        </div>
        <h2 className="text-xl font-display font-bold text-brand-text-main">Access Denied</h2>
        <p className="text-brand-text-muted text-sm mt-2 max-w-md mx-auto">You do not have the departmental HOD or administrative credentials required to view Budget allocations.</p>
        <Link className="btn btn-secondary mt-6 cursor-pointer" href="/">Return to Home</Link>
      </div>
    );
  }

  const handleGrantRequestSubmit = (e) => {
    e.preventDefault();
    if (!newRequest.title || !newRequest.lead) {
      alert('Please fill in all required fields.');
      return;
    }
    const grant = {
      id: `GRN-${Date.now().toString().slice(-3)}`,
      title: newRequest.title,
      lead: newRequest.lead,
      agency: newRequest.agency,
      amount: parseFloat(newRequest.amount),
      status: 'Under Review'
    };
    setResearchGrants([...researchGrants, grant]);
    setNewRequest({ title: '', lead: '', agency: 'Institutional Grant', amount: 50000 });
    setShowRequestModal(false);
    alert('Research grant proposal dispatched to scientific review committee!');
  };

  const handleAuditDepartment = (name) => {
    alert(`Financial ledger audit requested for: ${name}. Reconciling transactional hashes...`);
  };

  return (
    <div className="flex flex-col gap-6 md:gap-8">
      {/* Header */}
      <div className="page-header animate-fade-in flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-brand-text-main">Division & Research Budgets</h1>
          <p className="text-brand-text-muted mt-1 text-sm">Monitor core operational expenditures, audit divisions, and oversee active research endowments.</p>
        </div>
        <button 
          onClick={() => setShowRequestModal(true)}
          className="btn btn-primary cursor-pointer flex items-center gap-1.5"
        >
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Propose Research Grant
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-2 animate-fade-in">
        {/* Left Column: Department budgets */}
        <div className="card p-6 bg-brand-bg-secondary border border-brand-border rounded-2xl flex flex-col gap-5">
          <h3 className="m-0 font-display text-base font-bold text-brand-text-main border-b border-brand-border pb-3">Divisional Operating Budgets</h3>
          <div className="flex flex-col gap-5 mt-2">
            {deptBudgets.map(dept => {
              const percent = ((dept.spent / dept.total) * 100).toFixed(1);
              return (
                <div key={dept.id} className="flex flex-col gap-2 p-4 bg-brand-bg-tertiary/40 border border-brand-border rounded-xl">
                  <div className="flex justify-between items-center text-xs">
                    <div>
                      <strong className="text-brand-text-main font-semibold">{dept.name}</strong>
                      <span className="block text-[10px] text-brand-text-muted mt-0.5 font-mono">{dept.id}</span>
                    </div>
                    <span className="font-mono text-brand-text-main font-semibold">${dept.spent.toLocaleString()} / ${dept.total.toLocaleString()} ({percent}%)</span>
                  </div>
                  <div className="bg-brand-bg-primary h-2 w-full rounded-full overflow-hidden border border-brand-border/60">
                    <div className={`bg-gradient-to-r ${dept.color} h-full rounded-full`} style={{ width: `${percent}%` }}></div>
                  </div>
                  <div className="flex justify-end mt-1.5">
                    <button
                      onClick={() => handleAuditDepartment(dept.name)}
                      className="text-[10px] font-semibold text-brand-accent-cyan bg-transparent border-none cursor-pointer hover:underline"
                    >
                      Audit Operations
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Research Grants */}
        <div className="card p-6 bg-brand-bg-secondary border border-brand-border rounded-2xl flex flex-col gap-5">
          <h3 className="m-0 font-display text-base font-bold text-brand-text-main border-b border-brand-border pb-3">Active Scientific Research Grants</h3>
          <div className="flex flex-col gap-4 mt-2">
            {researchGrants.map(grant => (
              <div key={grant.id} className="p-4 bg-brand-bg-tertiary/40 border border-brand-border rounded-xl flex flex-col gap-2">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-xs font-bold text-brand-text-main m-0 leading-normal">{grant.title}</h4>
                    <span className="text-[10px] text-brand-text-muted font-semibold mt-1 block">Lead Investigator: {grant.lead}</span>
                  </div>
                  <span className={`badge text-[9px] px-2 py-0.5 rounded-full font-bold ${grant.status === 'Active' ? 'bg-brand-accent-emerald/10 text-brand-accent-emerald border border-brand-accent-emerald/20' : 'bg-brand-accent-amber/10 text-brand-accent-amber border border-brand-accent-amber/20'}`}>
                    {grant.status}
                  </span>
                </div>
                <div className="border-t border-brand-border/40 pt-2.5 mt-1 flex justify-between items-center text-[11px] text-brand-text-muted">
                  <span>Funding Body: <strong className="text-brand-text-subtle font-semibold">{grant.agency}</strong></span>
                  <span className="font-mono text-brand-accent-emerald font-bold">${grant.amount.toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Propose Grant Modal */}
      {showRequestModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-[999] p-4">
          <div className="bg-brand-bg-secondary border border-brand-border rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-scale-up">
            <div className="flex justify-between items-center px-6 py-4 border-b border-brand-border">
              <h3 className="font-display text-base font-bold text-brand-text-main m-0">Propose Research Grant</h3>
              <button 
                onClick={() => setShowRequestModal(false)}
                className="text-brand-text-muted hover:text-white cursor-pointer"
              >
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>
            <form onSubmit={handleGrantRequestSubmit} className="p-6 flex flex-col gap-4 text-sm">
              <div>
                <label className="block text-xs font-semibold text-brand-text-subtle mb-1.5">Project Research Title *</label>
                <input 
                  type="text"
                  required
                  value={newRequest.title}
                  onChange={(e) => setNewRequest({...newRequest, title: e.target.value})}
                  className="w-full bg-brand-bg-tertiary border border-brand-border text-brand-text-main p-2.5 rounded-xl outline-none focus:border-brand-primary"
                  placeholder="e.g. Distributed Consensus Systems"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-brand-text-subtle mb-1.5">Lead Faculty Investigator *</label>
                <input 
                  type="text"
                  required
                  value={newRequest.lead}
                  onChange={(e) => setNewRequest({...newRequest, lead: e.target.value})}
                  className="w-full bg-brand-bg-tertiary border border-brand-border text-brand-text-main p-2.5 rounded-xl outline-none focus:border-brand-primary"
                  placeholder="Dr. Sterling"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-brand-text-subtle mb-1.5">Funding Agency</label>
                  <input 
                    type="text"
                    value={newRequest.agency}
                    onChange={(e) => setNewRequest({...newRequest, agency: e.target.value})}
                    className="w-full bg-brand-bg-tertiary border border-brand-border text-brand-text-main p-2.5 rounded-xl outline-none focus:border-brand-primary"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-brand-text-subtle mb-1.5">Requested Capital ($)</label>
                  <input 
                    type="number"
                    value={newRequest.amount}
                    onChange={(e) => setNewRequest({...newRequest, amount: e.target.value})}
                    className="w-full bg-brand-bg-tertiary border border-brand-border text-brand-text-main p-2.5 rounded-xl outline-none focus:border-brand-primary font-mono"
                  />
                </div>
              </div>
              <div className="flex gap-3 justify-end mt-4">
                <button 
                  type="button" 
                  onClick={() => setShowRequestModal(false)}
                  className="btn btn-secondary cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn btn-primary cursor-pointer"
                >
                  Submit Proposal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
