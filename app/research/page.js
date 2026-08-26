'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function ResearchPage() {
  const [currentUser, setCurrentUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTopic, setSelectedTopic] = useState('All');
  const [showAddModal, setShowAddModal] = useState(false);

  // Sample Publications
  const [publications, setPublications] = useState([
    { id: 'PUB-101', title: 'Deep Learning Models for Decoupled Neural Prosthetics', lead: 'Dr. Evelyn Sterling', journal: 'Nature Machine Intelligence', citations: 142, date: '2024-11-12', topic: 'Artificial Intelligence' },
    { id: 'PUB-102', title: 'Quantum Telemetry Consensus in Smart-Grid Topologies', lead: 'Dr. Raymond Park', journal: 'IEEE Transactions on Smart Grid', citations: 88, date: '2025-03-01', topic: 'Smart Systems' },
    { id: 'PUB-103', title: 'Real-time Syllabus Coverage Modelling using LSTM Regressions', lead: 'Prof. Marcus Chen', journal: 'ACM Transactions on Computing Education', citations: 56, date: '2025-05-18', topic: 'Artificial Intelligence' },
    { id: 'PUB-104', title: 'Cryptographic Verification of Graduation Ledgers', lead: 'Prof. Sarah Connor', journal: 'International Journal of Blockchains', citations: 104, date: '2024-08-25', topic: 'Blockchain' }
  ]);

  const [newPub, setNewPub] = useState({
    title: '', lead: '', journal: '', topic: 'Artificial Intelligence'
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const session = sessionStorage.getItem('campusx_erp_session');
      if (session) {
        setCurrentUser(JSON.parse(session));
      }
    }
  }, []);

  if (!currentUser || (currentUser.role !== 'admin' && currentUser.role !== 'hod' && currentUser.role !== 'faculty')) {
    return (
      <div className="card p-8 text-center bg-brand-bg-secondary border border-brand-border rounded-2xl animate-fade-in my-12">
        <div className="w-16 h-16 bg-brand-accent-ruby/10 text-brand-accent-ruby rounded-full flex items-center justify-center mx-auto mb-4 border border-brand-accent-ruby/20">
          <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
        </div>
        <h2 className="text-xl font-display font-bold text-brand-text-main">Access Denied</h2>
        <p className="text-brand-text-muted text-sm mt-2 max-w-md mx-auto">You do not have the faculty or administrative credentials required to view the Research Catalog.</p>
        <Link className="btn btn-secondary mt-6 cursor-pointer" href="/">Return to Home</Link>
      </div>
    );
  }

  const handleAddPubSubmit = (e) => {
    e.preventDefault();
    if (!newPub.title || !newPub.lead || !newPub.journal) {
      alert('Please fill in all required fields.');
      return;
    }
    const pub = {
      id: `PUB-${Date.now().toString().slice(-3)}`,
      title: newPub.title,
      lead: newPub.lead,
      journal: newPub.journal,
      citations: 0,
      date: new Date().toISOString().split('T')[0],
      topic: newPub.topic
    };
    setPublications([pub, ...publications]);
    setNewPub({ title: '', lead: '', journal: '', topic: 'Artificial Intelligence' });
    setShowAddModal(false);
    alert('Research publication logged successfully into CampusX Academic Index!');
  };

  const handleCitationIncrement = (id) => {
    setPublications(prev => prev.map(p => p.id === id ? { ...p, citations: p.citations + 1 } : p));
  };

  const filteredPubs = publications.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.lead.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.journal.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTopic = selectedTopic === 'All' || p.topic === selectedTopic;
    return matchesSearch && matchesTopic;
  });

  const totalCitations = publications.reduce((acc, curr) => acc + curr.citations, 0);

  return (
    <div className="flex flex-col gap-6 md:gap-8">
      {/* Header */}
      <div className="page-header animate-fade-in flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-brand-text-main">Research Catalog & Citations</h1>
          <p className="text-brand-text-muted mt-1 text-sm">Track university scientific contributions, monitor publication metrics, and register new articles.</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="btn btn-primary cursor-pointer flex items-center gap-1.5"
        >
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Register Publication
        </button>
      </div>

      {/* Citations Metric Card */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 animate-fade-in">
        <div className="card p-5 bg-brand-bg-secondary border border-brand-border rounded-2xl flex items-center justify-between">
          <div>
            <span className="text-brand-text-muted text-xs font-semibold">Total Indexed Publications</span>
            <span className="block text-3xl font-bold font-display text-brand-primary mt-1">{publications.length} Papers</span>
            <span className="text-[0.7rem] text-brand-text-subtle mt-1 block">CrossRef & Scopus Verified</span>
          </div>
          <div className="p-3.5 bg-brand-primary/10 rounded-xl text-brand-primary">
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2zM22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
          </div>
        </div>
        <div className="card p-5 bg-brand-bg-secondary border border-brand-border rounded-2xl flex items-center justify-between">
          <div>
            <span className="text-brand-text-muted text-xs font-semibold">Cumulative Citations</span>
            <span className="block text-3xl font-bold font-display text-brand-accent-emerald mt-1">{totalCitations} Citations</span>
            <span className="text-[0.7rem] text-brand-accent-emerald mt-1 block">+12 this month</span>
          </div>
          <div className="p-3.5 bg-brand-accent-emerald/10 rounded-xl text-brand-accent-emerald">
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 16l4-4-4-4M8 12h8"/></svg>
          </div>
        </div>
        <div className="card p-5 bg-brand-bg-secondary border border-brand-border rounded-2xl flex items-center justify-between">
          <div>
            <span className="text-brand-text-muted text-xs font-semibold">University h-index</span>
            <span className="block text-3xl font-bold font-display text-brand-accent-cyan mt-1">12</span>
            <span className="text-[0.7rem] text-brand-text-subtle mt-1 block">Impact factor indicator</span>
          </div>
          <div className="p-3.5 bg-brand-accent-cyan/10 rounded-xl text-brand-accent-cyan">
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
          </div>
        </div>
      </div>

      {/* Filter Options */}
      <div className="card p-4 bg-brand-bg-secondary border border-brand-border rounded-2xl flex flex-col md:flex-row gap-4 justify-between items-center animate-fade-in">
        <div className="w-full md:w-80 relative">
          <input 
            type="text"
            placeholder="Search by title, author, or journal..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-brand-bg-tertiary border border-brand-border text-brand-text-main px-4 py-2.5 pl-10 rounded-xl text-sm outline-none focus:border-brand-primary/40"
          />
          <svg className="absolute left-3.5 top-3.5 text-brand-text-subtle" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        </div>
        <div className="flex gap-2 w-full md:w-auto justify-end overflow-x-auto pb-1 md:pb-0">
          {['All', 'Artificial Intelligence', 'Smart Systems', 'Blockchain'].map(topic => (
            <button
              key={topic}
              onClick={() => setSelectedTopic(topic)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap cursor-pointer transition-all ${selectedTopic === topic ? 'bg-brand-primary text-white' : 'bg-brand-bg-tertiary text-brand-text-muted hover:text-brand-text-main'}`}
            >
              {topic}
            </button>
          ))}
        </div>
      </div>

      {/* Publications List */}
      <div className="card p-6 bg-brand-bg-secondary border border-brand-border rounded-2xl flex flex-col gap-4 animate-fade-in">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-brand-border text-brand-text-subtle font-semibold">
                <th className="pb-3">Doc ID</th>
                <th className="pb-3">Publication Title</th>
                <th className="pb-3">Lead Author</th>
                <th className="pb-3">Journal / Conference</th>
                <th className="pb-3">Subject Domain</th>
                <th className="pb-3 font-mono">Citations</th>
                <th className="pb-3 text-right">Published Date</th>
              </tr>
            </thead>
            <tbody>
              {filteredPubs.map((p, i) => (
                <tr key={i} className="border-b border-brand-border/40 hover:bg-white/[0.01] transition-all">
                  <td className="py-4 font-mono text-brand-text-subtle">{p.id}</td>
                  <td className="py-4 font-semibold text-brand-text-main leading-normal max-w-xs">{p.title}</td>
                  <td className="py-4 text-brand-text-muted">{p.lead}</td>
                  <td className="py-4 text-brand-text-muted italic">{p.journal}</td>
                  <td className="py-4">
                    <span className="badge bg-brand-primary/10 text-brand-primary font-semibold px-2 py-0.5 rounded">
                      {p.topic}
                    </span>
                  </td>
                  <td className="py-4 font-mono font-bold text-brand-accent-emerald">
                    <button
                      onClick={() => handleCitationIncrement(p.id)}
                      className="bg-brand-bg-tertiary hover:bg-brand-primary/20 border border-brand-border text-brand-accent-emerald text-xs font-mono font-bold px-2 py-1 rounded cursor-pointer mr-2 transition-all"
                      title="Register Citation Record"
                    >
                      +
                    </button>
                    {p.citations}
                  </td>
                  <td className="py-4 text-right font-mono text-brand-text-muted">{p.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Register Pub Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-[999] p-4">
          <div className="bg-brand-bg-secondary border border-brand-border rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-scale-up">
            <div className="flex justify-between items-center px-6 py-4 border-b border-brand-border">
              <h3 className="font-display text-base font-bold text-brand-text-main m-0">Register Research Publication</h3>
              <button 
                onClick={() => setShowAddModal(false)}
                className="text-brand-text-muted hover:text-white cursor-pointer"
              >
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>
            <form onSubmit={handleAddPubSubmit} className="p-6 flex flex-col gap-4 text-sm">
              <div>
                <label className="block text-xs font-semibold text-brand-text-subtle mb-1.5">Article Title *</label>
                <input 
                  type="text"
                  required
                  value={newPub.title}
                  onChange={(e) => setNewPub({...newPub, title: e.target.value})}
                  className="w-full bg-brand-bg-tertiary border border-brand-border text-brand-text-main p-2.5 rounded-xl outline-none focus:border-brand-primary"
                  placeholder="e.g. Robust Quantum Consensus"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-brand-text-subtle mb-1.5">Lead Investigator / Professor *</label>
                <input 
                  type="text"
                  required
                  value={newPub.lead}
                  onChange={(e) => setNewPub({...newPub, lead: e.target.value})}
                  className="w-full bg-brand-bg-tertiary border border-brand-border text-brand-text-main p-2.5 rounded-xl outline-none focus:border-brand-primary"
                  placeholder="Dr. Sterling"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-brand-text-subtle mb-1.5">Journal / Conference Proceedings *</label>
                <input 
                  type="text"
                  required
                  value={newPub.journal}
                  onChange={(e) => setNewPub({...newPub, journal: e.target.value})}
                  className="w-full bg-brand-bg-tertiary border border-brand-border text-brand-text-main p-2.5 rounded-xl outline-none focus:border-brand-primary"
                  placeholder="e.g. IEEE Transactions on Smart Grid"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-brand-text-subtle mb-1.5">Research Domain *</label>
                <select 
                  value={newPub.topic}
                  onChange={(e) => setNewPub({...newPub, topic: e.target.value})}
                  className="w-full bg-brand-bg-tertiary border border-brand-border text-brand-text-main p-2.5 rounded-xl outline-none font-semibold cursor-pointer"
                >
                  <option value="Artificial Intelligence">Artificial Intelligence</option>
                  <option value="Smart Systems">Smart Systems</option>
                  <option value="Blockchain">Blockchain</option>
                </select>
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
                  Register Document
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
