'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function AlumniPage() {
  const [currentUser, setCurrentUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedYear, setSelectedYear] = useState('All');

  // Dummy Alumni Directory
  const [alumni, setAlumni] = useState([
    { id: 'ALM-201', name: 'Rohan Deshmukh', program: 'B.Tech CS', year: '2024', company: 'Google', position: 'Software Engineer', location: 'Bengaluru', email: 'rohan.d@google.com' },
    { id: 'ALM-202', name: 'Sneha Rao', program: 'M.S. Data Science', year: '2023', company: 'Meta', position: 'Data Scientist', location: 'London', email: 'sneha.rao@meta.com' },
    { id: 'ALM-203', name: 'Amit Verma', program: 'B.Tech AI', year: '2024', company: 'Nvidia', position: 'ML Researcher', location: 'Santa Clara', email: 'averma@nvidia.com' },
    { id: 'ALM-204', name: 'Karan Malhotra', program: 'B.Tech CS', year: '2022', company: 'Stripe', position: 'Systems Architect', location: 'San Francisco', email: 'karanm@stripe.com' }
  ]);

  // Dummy Job Board
  const [jobs, setJobs] = useState([
    { id: 'JOB-501', title: 'Associate Software Engineer', company: 'Google', location: 'Bengaluru (Hybrid)', referrer: 'Rohan Deshmukh', type: 'Full-Time', posted: '2026-06-05' },
    { id: 'JOB-502', title: 'Data Analyst Intern', company: 'Meta', location: 'Remote', referrer: 'Sneha Rao', type: 'Internship', posted: '2026-06-08' },
    { id: 'JOB-503', title: 'Security Consultant', company: 'Stripe', location: 'San Francisco', referrer: 'Karan Malhotra', type: 'Full-Time', posted: '2026-06-10' }
  ]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const session = sessionStorage.getItem('campusx_erp_session');
      if (session) {
        setCurrentUser(JSON.parse(session));
      }
    }
  }, []);

  if (!currentUser) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="w-8 h-8 border-4 border-brand-primary/30 border-t-brand-primary rounded-full animate-spin"></div>
      </div>
    );
  }

  const handleApplyJob = (title, company) => {
    alert(`Application successfully compiled. Dispatched profile resume data to ${company} for role: ${title}.`);
  };

  const filteredAlumni = alumni.filter(a => {
    const matchesSearch = a.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          a.company.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          a.position.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesYear = selectedYear === 'All' || a.year === selectedYear;
    return matchesSearch && matchesYear;
  });

  return (
    <div className="flex flex-col gap-6 md:gap-8">
      {/* Header */}
      <div className="page-header animate-fade-in flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-brand-text-main">Alumni Registry & Placements</h1>
          <p className="text-brand-text-muted mt-1 text-sm">Browse graduated directories, view campus hiring indices, and apply for alumni-referred vacancies.</p>
        </div>
      </div>

      {/* Placement KPI summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 animate-fade-in">
        <div className="card p-5 bg-brand-bg-secondary border border-brand-border rounded-2xl flex items-center justify-between">
          <div>
            <span className="text-brand-text-muted text-xs font-semibold">Employed Rate</span>
            <span className="block text-3xl font-bold font-display text-brand-accent-emerald mt-1">94.2%</span>
            <span className="text-[0.7rem] text-brand-accent-emerald mt-1 block">Class of 2025</span>
          </div>
          <div className="p-3.5 bg-brand-accent-emerald/10 rounded-xl text-brand-accent-emerald">
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M22 4L12 14.01l-3-3"/></svg>
          </div>
        </div>
        <div className="card p-5 bg-brand-bg-secondary border border-brand-border rounded-2xl flex items-center justify-between">
          <div>
            <span className="text-brand-text-muted text-xs font-semibold">Average Package</span>
            <span className="block text-3xl font-bold font-display text-brand-accent-cyan mt-1">$82,500</span>
            <span className="text-[0.7rem] text-brand-text-subtle mt-1 block">Top sector: Tech / AI</span>
          </div>
          <div className="p-3.5 bg-brand-accent-cyan/10 rounded-xl text-brand-accent-cyan">
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
          </div>
        </div>
        <div className="card p-5 bg-brand-bg-secondary border border-brand-border rounded-2xl flex items-center justify-between">
          <div>
            <span className="text-brand-text-muted text-xs font-semibold">Top Hiring Partner</span>
            <span className="block text-2xl font-bold font-display text-brand-text-main mt-1">Google</span>
            <span className="text-[0.7rem] text-brand-text-subtle mt-1 block">18 alumni placed</span>
          </div>
          <div className="p-3.5 bg-brand-primary/10 rounded-xl text-brand-primary">
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="5 3 19 12 5 21 5 3"/></svg>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in mt-2">
        {/* Alumni Registry Directory */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <div className="card p-6 bg-brand-bg-secondary border border-brand-border rounded-2xl">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-brand-border pb-4 mb-4">
              <h3 className="m-0 font-display text-base font-bold text-brand-text-main">Alumni Directory</h3>
              <div className="flex gap-2">
                {['All', '2024', '2023', '2022'].map(yr => (
                  <button
                    key={yr}
                    onClick={() => setSelectedYear(yr)}
                    className={`px-3 py-1 rounded text-xs font-semibold cursor-pointer transition-all ${selectedYear === yr ? 'bg-brand-primary text-white' : 'bg-brand-bg-tertiary text-brand-text-muted hover:text-brand-text-main'}`}
                  >
                    {yr}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-3 mb-4">
              <div className="relative flex-1">
                <input 
                  type="text"
                  placeholder="Search by name, company, or position..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-brand-bg-tertiary border border-brand-border text-brand-text-main px-4 py-2 pl-10 rounded-xl text-xs outline-none focus:border-brand-primary/40"
                />
                <svg className="absolute left-3 top-3 text-brand-text-subtle" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-brand-border text-brand-text-subtle font-semibold">
                    <th className="pb-2">Name</th>
                    <th className="pb-2">Program</th>
                    <th className="pb-2 font-mono">Year</th>
                    <th className="pb-2">Company</th>
                    <th className="pb-2 text-right">Role</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAlumni.map((a, i) => (
                    <tr key={i} className="border-b border-brand-border/40 hover:bg-white/[0.01] transition-all">
                      <td className="py-3 font-semibold text-brand-text-main">{a.name}</td>
                      <td className="py-3 text-brand-text-muted">{a.program}</td>
                      <td className="py-3 font-mono text-brand-text-muted">{a.year}</td>
                      <td className="py-3 font-semibold text-brand-accent-cyan">{a.company}</td>
                      <td className="py-3 text-right text-brand-text-subtle">{a.position}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Alumni-Referred Job Openings */}
        <div className="card p-6 bg-brand-bg-secondary border border-brand-border rounded-2xl flex flex-col gap-4">
          <h3 className="m-0 font-display text-base font-bold text-brand-text-main border-b border-brand-border pb-3">Alumni Jobs Board</h3>
          <div className="flex flex-col gap-4 mt-2">
            {jobs.map(job => (
              <div key={job.id} className="p-4 bg-brand-bg-tertiary/40 border border-brand-border rounded-xl flex flex-col gap-3">
                <div>
                  <div className="flex justify-between items-center text-[10px]">
                    <span className="font-mono text-brand-text-muted">{job.id}</span>
                    <span className="badge bg-brand-primary/10 text-brand-primary px-1.5 py-0.5 rounded font-bold">{job.type}</span>
                  </div>
                  <h4 className="text-sm font-bold text-brand-text-main mt-2 mb-0.5 leading-snug">{job.title}</h4>
                  <span className="text-xs text-brand-accent-cyan font-semibold block">{job.company}</span>
                </div>
                <div className="text-[11px] text-brand-text-muted border-t border-brand-border/40 pt-2 flex flex-col gap-1.5">
                  <div>Location: <span className="text-brand-text-subtle">{job.location}</span></div>
                  <div>Referrer: <strong className="text-brand-text-main font-semibold">{job.referrer}</strong></div>
                  <div className="flex justify-between items-center mt-2.5">
                    <span className="font-mono text-[9px]">Posted: {job.posted}</span>
                    <button
                      onClick={() => handleApplyJob(job.title, job.company)}
                      className="btn btn-primary text-[10px] px-3 py-1 cursor-pointer bg-brand-accent-emerald hover:bg-brand-accent-emerald/80"
                    >
                      Apply Referral
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
