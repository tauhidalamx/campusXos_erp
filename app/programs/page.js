'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function ProgramsPage() {
  const [currentUser, setCurrentUser] = useState(null);
  const [selectedLevel, setSelectedLevel] = useState('All');
  const [showAddModal, setShowAddModal] = useState(false);

  const [programs, setPrograms] = useState([
    { code: 'BTECH-CS', name: 'Bachelor of Technology in Computer Science', level: 'Undergraduate', duration: '4 Years', semesters: 8, credits: 160, coordinator: 'Dr. Raymond Park', intake: 120, status: 'Active' },
    { code: 'MSC-DS', name: 'Master of Science in Data Science', level: 'Postgraduate', duration: '2 Years', semesters: 4, credits: 80, coordinator: 'Dr. Evelyn Sterling', intake: 45, status: 'Active' },
    { code: 'PHD-CS', name: 'Doctor of Philosophy in Computer Science', level: 'Doctoral', duration: '3-5 Years', semesters: 6, credits: 36, coordinator: 'Prof. Sarah Connor', intake: 15, status: 'Active' },
    { code: 'BTECH-AI', name: 'Bachelor of Technology in Artificial Intelligence', level: 'Undergraduate', duration: '4 Years', semesters: 8, credits: 164, coordinator: 'Prof. Marcus Chen', intake: 60, status: 'Active' },
    { code: 'MSC-CY', name: 'Master of Science in Cybersecurity', level: 'Postgraduate', duration: '2 Years', semesters: 4, credits: 78, coordinator: 'Dr. Evelyn Sterling', intake: 30, status: 'Inactive' }
  ]);

  const [newProgram, setNewProgram] = useState({
    code: '', name: '', level: 'Undergraduate', duration: '4 Years', semesters: 8, credits: 160, coordinator: '', intake: 60
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
        <p className="text-brand-text-muted text-sm mt-2 max-w-md mx-auto">You do not have the HOD or Administrator credentials required to edit the Curricula Registry.</p>
        <Link className="btn btn-secondary mt-6 cursor-pointer" href="/">Return to Home</Link>
      </div>
    );
  }

  const handleAddProgramSubmit = (e) => {
    e.preventDefault();
    if (!newProgram.code || !newProgram.name || !newProgram.coordinator) {
      alert('Please fill in all required fields.');
      return;
    }
    const programMember = {
      code: newProgram.code.toUpperCase(),
      name: newProgram.name,
      level: newProgram.level,
      duration: newProgram.duration,
      semesters: parseInt(newProgram.semesters),
      credits: parseInt(newProgram.credits),
      coordinator: newProgram.coordinator,
      intake: parseInt(newProgram.intake),
      status: 'Active'
    };
    setPrograms([...programs, programMember]);
    setNewProgram({ code: '', name: '', level: 'Undergraduate', duration: '4 Years', semesters: 8, credits: 160, coordinator: '', intake: 60 });
    setShowAddModal(false);
    alert('Degree program registered successfully!');
  };

  const toggleProgramStatus = (code) => {
    setPrograms(prev => prev.map(p => p.code === code ? { ...p, status: p.status === 'Active' ? 'Inactive' : 'Active' } : p));
  };

  const filteredPrograms = programs.filter(p => selectedLevel === 'All' || p.level === selectedLevel);

  return (
    <div className="flex flex-col gap-6 md:gap-8">
      {/* Header */}
      <div className="page-header animate-fade-in flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-brand-text-main">Degree Programs & Curricula</h1>
          <p className="text-brand-text-muted mt-1 text-sm">Register degree programs, manage credit evaluation schemes, and monitor academic coordinators.</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="btn btn-primary cursor-pointer flex items-center gap-1.5"
        >
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Add Program
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-brand-border/30 pb-3 overflow-x-auto">
        {['All', 'Undergraduate', 'Postgraduate', 'Doctoral'].map(lvl => (
          <button
            key={lvl}
            onClick={() => setSelectedLevel(lvl)}
            className={`px-4 py-2 text-xs font-bold whitespace-nowrap bg-transparent border-none cursor-pointer border-b-2 transition-all ${selectedLevel === lvl ? 'border-brand-primary text-brand-text-main' : 'border-transparent text-brand-text-muted hover:text-brand-text-main'}`}
          >
            {lvl} Programs
          </button>
        ))}
      </div>

      {/* Program Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 animate-fade-in">
        {filteredPrograms.map(p => (
          <div key={p.code} className="card p-6 bg-brand-bg-secondary border border-brand-border rounded-2xl flex flex-col justify-between gap-5">
            <div>
              <div className="flex justify-between items-start">
                <span className="text-xs font-semibold text-brand-accent-cyan tracking-wider font-mono">{p.code}</span>
                <span className={`badge text-[10px] px-2 py-0.5 rounded-full font-bold ${p.status === 'Active' ? 'bg-brand-accent-emerald/10 text-brand-accent-emerald border border-brand-accent-emerald/20' : 'bg-brand-accent-amber/10 text-brand-accent-amber border border-brand-accent-amber/20'}`}>
                  {p.status}
                </span>
              </div>
              <h3 className="text-lg font-bold text-brand-text-main mt-2 mb-1">{p.name}</h3>
              <p className="text-xs text-brand-text-muted m-0">Level: <strong className="text-brand-text-subtle font-semibold">{p.level}</strong></p>
            </div>

            <div className="grid grid-cols-3 gap-4 border-y border-brand-border/40 py-3 text-center">
              <div>
                <span className="text-[10px] text-brand-text-muted block uppercase tracking-wider">Duration</span>
                <span className="text-sm font-semibold text-brand-text-main font-mono mt-0.5 block">{p.duration}</span>
              </div>
              <div>
                <span className="text-[10px] text-brand-text-muted block uppercase tracking-wider">Credits</span>
                <span className="text-sm font-semibold text-brand-accent-cyan font-mono mt-0.5 block">{p.credits} Credits</span>
              </div>
              <div>
                <span className="text-[10px] text-brand-text-muted block uppercase tracking-wider">Semesters</span>
                <span className="text-sm font-semibold text-brand-text-main font-mono mt-0.5 block">{p.semesters} Sem</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 text-xs text-brand-text-muted">
              <div>
                <span>Coordinator:</span>
                <strong className="text-brand-text-main block sm:inline sm:ml-1 font-semibold">{p.coordinator}</strong>
              </div>
              <div>
                <span>Annual Intake:</span>
                <strong className="text-brand-text-main ml-1 font-semibold">{p.intake} seats</strong>
              </div>
            </div>

            <div className="flex gap-2 mt-1">
              <button
                onClick={() => toggleProgramStatus(p.code)}
                className="btn btn-secondary text-xs py-1.5 cursor-pointer flex-1"
              >
                {p.status === 'Active' ? 'Archive Program' : 'Activate Program'}
              </button>
              <button
                onClick={() => alert(`Curriculum Audit details and course outline downloaded for ${p.code}.`)}
                className="btn btn-primary text-xs py-1.5 cursor-pointer flex-1"
              >
                Audits Curriculum
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Program Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-[999] p-4">
          <div className="bg-brand-bg-secondary border border-brand-border rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-scale-up">
            <div className="flex justify-between items-center px-6 py-4 border-b border-brand-border">
              <h3 className="font-display text-base font-bold text-brand-text-main m-0">Register New Program</h3>
              <button 
                onClick={() => setShowAddModal(false)}
                className="text-brand-text-muted hover:text-white cursor-pointer"
              >
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>
            <form onSubmit={handleAddProgramSubmit} className="p-6 flex flex-col gap-4 text-sm">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-brand-text-subtle mb-1.5">Program Code *</label>
                  <input 
                    type="text"
                    required
                    value={newProgram.code}
                    onChange={(e) => setNewProgram({...newProgram, code: e.target.value})}
                    className="w-full bg-brand-bg-tertiary border border-brand-border text-brand-text-main p-2.5 rounded-xl outline-none focus:border-brand-primary font-mono"
                    placeholder="e.g. BTECH-CS"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-brand-text-subtle mb-1.5">Level *</label>
                  <select 
                    value={newProgram.level}
                    onChange={(e) => setNewProgram({...newProgram, level: e.target.value})}
                    className="w-full bg-brand-bg-tertiary border border-brand-border text-brand-text-main p-2.5 rounded-xl outline-none font-semibold cursor-pointer"
                  >
                    <option value="Undergraduate">Undergraduate</option>
                    <option value="Postgraduate">Postgraduate</option>
                    <option value="Doctoral">Doctoral</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-brand-text-subtle mb-1.5">Full Program Name *</label>
                <input 
                  type="text"
                  required
                  value={newProgram.name}
                  onChange={(e) => setNewProgram({...newProgram, name: e.target.value})}
                  className="w-full bg-brand-bg-tertiary border border-brand-border text-brand-text-main p-2.5 rounded-xl outline-none focus:border-brand-primary"
                  placeholder="e.g. Master of Business Administration"
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-brand-text-subtle mb-1.5">Semesters</label>
                  <input 
                    type="number"
                    value={newProgram.semesters}
                    onChange={(e) => setNewProgram({...newProgram, semesters: e.target.value})}
                    className="w-full bg-brand-bg-tertiary border border-brand-border text-brand-text-main p-2.5 rounded-xl outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-brand-text-subtle mb-1.5">Credits Required</label>
                  <input 
                    type="number"
                    value={newProgram.credits}
                    onChange={(e) => setNewProgram({...newProgram, credits: e.target.value})}
                    className="w-full bg-brand-bg-tertiary border border-brand-border text-brand-text-main p-2.5 rounded-xl outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-brand-text-subtle mb-1.5">Intake Seats</label>
                  <input 
                    type="number"
                    value={newProgram.intake}
                    onChange={(e) => setNewProgram({...newProgram, intake: e.target.value})}
                    className="w-full bg-brand-bg-tertiary border border-brand-border text-brand-text-main p-2.5 rounded-xl outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-brand-text-subtle mb-1.5">Coordinator Professor *</label>
                <input 
                  type="text"
                  required
                  value={newProgram.coordinator}
                  onChange={(e) => setNewProgram({...newProgram, coordinator: e.target.value})}
                  className="w-full bg-brand-bg-tertiary border border-brand-border text-brand-text-main p-2.5 rounded-xl outline-none focus:border-brand-primary"
                  placeholder="e.g. Dr. Jane Foster"
                />
              </div>
              <div className="flex gap-3 justify-end mt-4">
                <button 
                  type="button" 
                  onClick={() => setShowAddModal(false)}
                  className="btn btn-secondary cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn btn-primary cursor-pointer"
                >
                  Add Program
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
