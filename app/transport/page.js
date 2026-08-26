'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function TransportPage() {
  const [currentUser, setCurrentUser] = useState(null);
  const [selectedRoute, setSelectedRoute] = useState('All');
  const [showPassModal, setShowPassModal] = useState(false);

  // University Bus Routes
  const busRoutes = [
    { code: 'RT-A', source: 'North Suburbs Metro Terminal', stops: 5, timing: '07:30 AM / 05:30 PM', driver: 'Madan Lal', contact: '+91 91234 56780', activeBuses: 2 },
    { code: 'RT-B', source: 'South City Extension Mall', stops: 8, timing: '07:15 AM / 06:00 PM', driver: 'Satish Gowda', contact: '+91 91234 56781', activeBuses: 3 },
    { code: 'RT-C', source: 'East Campus Residency Towers', stops: 4, timing: '07:45 AM / 05:15 PM', driver: 'Harpreet Singh', contact: '+91 91234 56782', activeBuses: 1 },
    { code: 'RT-D', source: 'Downtown Railway Junction', stops: 6, timing: '07:00 AM / 06:30 PM', driver: 'Anthony Gonsalves', contact: '+91 91234 56783', activeBuses: 2 }
  ];

  // Pass registry database
  const [passes, setPasses] = useState([
    { passId: 'PSS-771', studentName: 'Aarav Mehta', route: 'RT-A', type: 'Semester Pass', status: 'Active' },
    { passId: 'PSS-772', studentName: 'Priya Nair', route: 'RT-B', type: 'Monthly Pass', status: 'Pending Approval' }
  ]);

  const [newPass, setNewPass] = useState({
    route: 'RT-A', type: 'Semester Pass'
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
        <p className="text-brand-text-muted text-sm mt-2 max-w-md mx-auto">You do not have the student or administrative credentials required to view Transport routes.</p>
        <Link className="btn btn-secondary mt-6 cursor-pointer" href="/">Return to Home</Link>
      </div>
    );
  }

  const handleRequestPassSubmit = (e) => {
    e.preventDefault();
    const pass = {
      passId: `PSS-${Date.now().toString().slice(-3)}`,
      studentName: currentUser.name || 'Anonymous Student',
      route: newPass.route,
      type: newPass.type,
      status: 'Pending Approval'
    };
    setPasses([pass, ...passes]);
    setShowPassModal(false);
    alert('Bus Pass request submitted to campus transit office.');
  };

  const handleApprovePass = (passId) => {
    setPasses(prev => prev.map(p => p.passId === passId ? { ...p, status: 'Active' } : p));
    alert(`Pass activated successfully.`);
  };

  return (
    <div className="flex flex-col gap-6 md:gap-8">
      {/* Header */}
      <div className="page-header animate-fade-in flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-brand-text-main">Transport & Bus Routes</h1>
          <p className="text-brand-text-muted mt-1 text-sm">Review absolute routes, real-time schedule timetables, monthly pass fares, and coordinate driver rosters.</p>
        </div>
        {currentUser.role === 'student' && (
          <button 
            onClick={() => setShowPassModal(true)}
            className="btn btn-primary cursor-pointer flex items-center gap-1.5"
          >
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Request Bus Pass
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-2 animate-fade-in">
        {/* Left Column: Routes Registry */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <div className="card p-6 bg-brand-bg-secondary border border-brand-border rounded-2xl">
            <h3 className="mb-4 font-display text-base font-bold text-brand-text-main border-b border-brand-border pb-3">Operational Transit Routes</h3>
            <div className="flex flex-col gap-4">
              {busRoutes.map(route => (
                <div key={route.code} className="p-4 bg-brand-bg-tertiary/60 border border-brand-border rounded-xl flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold bg-brand-primary/10 text-brand-primary px-2.5 py-0.5 rounded border border-brand-primary/20">{route.code}</span>
                      <strong className="text-sm text-brand-text-main font-semibold">{route.source}</strong>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-3 text-xs text-brand-text-muted">
                      <div>Stops: <strong className="text-brand-text-subtle font-semibold">{route.stops} points</strong></div>
                      <div>Buses Active: <strong className="text-brand-accent-cyan font-mono">{route.activeBuses} Units</strong></div>
                      <div className="col-span-2">Hours: <span className="font-mono text-brand-text-subtle">{route.timing}</span></div>
                    </div>
                  </div>
                  <div className="border-t sm:border-t-0 sm:border-l border-brand-border/40 pt-3 sm:pt-0 sm:pl-6 text-xs text-brand-text-muted flex flex-col gap-1 min-w-[150px]">
                    <div>Driver: <strong className="text-brand-text-main font-semibold">{route.driver}</strong></div>
                    <div>Call: <span className="font-mono text-brand-text-subtle">{route.contact}</span></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Pass Requests */}
        <div className="flex flex-col gap-6">
          <div className="card p-6 bg-brand-bg-secondary border border-brand-border rounded-2xl flex flex-col gap-4">
            <h3 className="m-0 font-display text-base font-bold text-brand-text-main border-b border-brand-border pb-3">
              {currentUser.role === 'student' ? 'My Bus Passes' : 'Active Pass Applications'}
            </h3>
            
            <div className="flex flex-col gap-4">
              {passes
                .filter(p => currentUser.role !== 'student' || p.studentName === currentUser.name || p.studentName === 'Aarav Mehta')
                .map(pass => (
                  <div key={pass.passId} className="p-4 bg-brand-bg-tertiary/40 border border-brand-border rounded-xl flex flex-col gap-3">
                    <div className="flex justify-between items-start text-xs">
                      <div>
                        <strong className="text-brand-text-main font-semibold block">Route {pass.route} ({pass.type})</strong>
                        <span className="text-[10px] text-brand-text-muted block mt-0.5 font-mono">Pass ID: {pass.passId} • Candidate: {pass.studentName}</span>
                      </div>
                      <span className={`badge text-[10px] px-2 py-0.5 rounded-full font-bold ${pass.status === 'Active' ? 'bg-brand-accent-emerald/10 text-brand-accent-emerald border border-brand-accent-emerald/20' : 'bg-brand-accent-amber/10 text-brand-accent-amber border border-brand-accent-amber/20'}`}>
                        {pass.status}
                      </span>
                    </div>

                    {currentUser.role !== 'student' && pass.status === 'Pending Approval' && (
                      <button
                        onClick={() => handleApprovePass(pass.passId)}
                        className="btn btn-primary text-xs py-1.5 cursor-pointer bg-brand-accent-emerald hover:bg-brand-accent-emerald/80 mt-1"
                      >
                        Approve & Issue Pass
                      </button>
                    )}
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>

      {/* Request Pass Modal */}
      {showPassModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-[999] p-4">
          <div className="bg-brand-bg-secondary border border-brand-border rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-scale-up">
            <div className="flex justify-between items-center px-6 py-4 border-b border-brand-border">
              <h3 className="font-display text-base font-bold text-brand-text-main m-0">Apply for Transport Pass</h3>
              <button 
                onClick={() => setShowPassModal(false)}
                className="text-brand-text-muted hover:text-white cursor-pointer"
              >
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>
            <form onSubmit={handleRequestPassSubmit} className="p-6 flex flex-col gap-4 text-sm">
              <div>
                <label className="block text-xs font-semibold text-brand-text-subtle mb-1.5">Select Route Code *</label>
                <select 
                  value={newPass.route}
                  onChange={(e) => setNewPass({...newPass, route: e.target.value})}
                  className="w-full bg-brand-bg-tertiary border border-brand-border text-brand-text-main p-2.5 rounded-xl outline-none font-semibold cursor-pointer"
                >
                  {busRoutes.map(r => (
                    <option key={r.code} value={r.code}>{r.code} - {r.source}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-brand-text-subtle mb-1.5">Pass Validity Duration *</label>
                <select 
                  value={newPass.type}
                  onChange={(e) => setNewPass({...newPass, type: e.target.value})}
                  className="w-full bg-brand-bg-tertiary border border-brand-border text-brand-text-main p-2.5 rounded-xl outline-none font-semibold cursor-pointer"
                >
                  <option value="Monthly Pass">Monthly Pass ($45)</option>
                  <option value="Semester Pass">Semester Pass ($160)</option>
                  <option value="Annual Pass">Annual Pass ($300)</option>
                </select>
              </div>
              <div className="flex gap-3 justify-end mt-4">
                <button 
                  type="button" 
                  onClick={() => setShowPassModal(false)}
                  className="btn btn-secondary cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn btn-primary cursor-pointer"
                >
                  Request Transit Pass
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
