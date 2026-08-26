'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function SubjectsPage() {
  const [currentUser, setCurrentUser] = useState(null);
  const [activeKebabId, setActiveKebabId] = useState(null);

  const [subjects, setSubjects] = useState([
    { code: 'CS101', name: 'Computer Architecture', credits: 4, allocatedTo: 'Prof. Marcus Chen', syllabusCoverage: 75 },
    { code: 'CS102', name: 'Advanced Machine Learning', credits: 4, allocatedTo: 'Dr. Evelyn Sterling', syllabusCoverage: 60 },
    { code: 'CS103', name: 'Database Systems Design', credits: 3, allocatedTo: 'TBD', syllabusCoverage: 0 },
    { code: 'CS104', name: 'Algorithms Analysis', credits: 4, allocatedTo: 'Prof. Marcus Chen', syllabusCoverage: 90 }
  ]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const session = sessionStorage.getItem('campusx_erp_session');
      if (session) {
        setCurrentUser(JSON.parse(session));
      }
    }
  }, []);

  const handleAllocate = (code) => {
    const instructor = prompt('Enter Faculty Name to allocate:');
    if (instructor) {
      setSubjects(prev => prev.map(s => s.code === code ? { ...s, allocatedTo: instructor } : s));
      alert(`Allocated successfully.`);
    }
  };

  if (!currentUser || (currentUser.role !== 'hod' && currentUser.role !== 'admin')) {
    return (
      <div className="card p-8 text-center bg-brand-bg-secondary border border-brand-border rounded-2xl animate-fade-in my-12">
        <div className="w-16 h-16 bg-brand-accent-ruby/10 text-brand-accent-ruby rounded-full flex items-center justify-center mx-auto mb-4 border border-brand-accent-ruby/20">
          <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
        </div>
        <h2 className="text-xl font-display font-bold text-brand-text-main">Access Denied</h2>
        <p className="text-brand-text-muted text-sm mt-2 max-w-md mx-auto">You do not have the required Department Head (HOD) credentials to access Subject Management.</p>
        <Link className="btn btn-secondary mt-6 cursor-pointer" href="/">Return to Home Portal</Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 md:gap-8">
      <div className="page-header animate-fade-in flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-display font-bold text-brand-text-main">Subject Allocation</h1>
          <p className="text-brand-text-muted mt-1 text-sm">Assign faculty members to departmental subjects and trace curriculum progress indexes.</p>
        </div>
      </div>

      {/* Subjects Catalog */}
      <div className="table-container animate-fade-in overflow-x-auto bg-brand-bg-secondary border border-brand-border rounded-2xl relative mt-2">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-brand-border text-brand-text-subtle text-xs uppercase font-semibold">
              <th className="p-4">Subject</th>
              <th className="p-4">Credits</th>
              <th className="p-4">Instructor</th>
              <th className="p-4">Syllabus Progress</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {subjects.map(s => (
              <tr key={s.code} className="border-b border-brand-border hover:bg-white/[0.01] transition-colors text-sm text-brand-text-main">
                <td className="p-4">
                  <div className="font-semibold text-brand-text-main">{s.name}</div>
                  <code className="text-[0.65rem] text-brand-text-muted font-mono">{s.code}</code>
                </td>
                <td className="p-4 font-semibold text-brand-text-muted">{s.credits} Credits</td>
                <td className="p-4">
                  <span className={`font-semibold ${s.allocatedTo === 'TBD' ? 'text-brand-accent-ruby' : 'text-brand-text-main'}`}>
                    {s.allocatedTo}
                  </span>
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-3 w-40">
                    <div className="h-1.5 bg-brand-bg-tertiary rounded-full overflow-hidden border border-brand-border/40 flex-1">
                      <div className="bg-brand-primary h-full rounded-full transition-all duration-300" style={{ width: `${s.syllabusCoverage}%` }}></div>
                    </div>
                    <span className="font-mono text-xs font-bold">{s.syllabusCoverage}%</span>
                  </div>
                </td>
                <td className="p-4 text-right relative">
                  <button 
                    className="text-brand-text-muted hover:text-white p-2 rounded-lg transition-all focus:bg-brand-bg-tertiary cursor-pointer inline-flex items-center justify-center"
                    onClick={() => setActiveKebabId(activeKebabId === s.code ? null : s.code)}
                  >
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/></svg>
                  </button>
                  {activeKebabId === s.code && (
                    <div className="absolute right-4 top-12 bg-brand-bg-tertiary border border-brand-border rounded-xl shadow-2xl z-[100] w-36 text-left p-1.5 animate-scale-up">
                      <button 
                        className="w-full text-left px-3 py-2 text-xs font-semibold text-brand-text-main hover:bg-white/[0.05] rounded-lg cursor-pointer"
                        onClick={() => { setActiveKebabId(null); handleAllocate(s.code); }}
                      >
                        Allocate Faculty
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
  );
}
