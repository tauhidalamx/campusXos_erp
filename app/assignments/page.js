'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function AssignmentsPage() {
  const [currentUser, setCurrentUser] = useState(null);
  const [activeKebabId, setActiveKebabId] = useState(null);

  const [assignments, setAssignments] = useState([
    { id: 'ASN001', title: 'Kernel Optimization Project', course: 'Computer Architecture (CS101)', dueDate: '2026-06-18', status: 'Pending Upload', submission: null },
    { id: 'ASN002', title: 'Convolutional Nets Lab', course: 'Advanced Machine Learning (CS102)', dueDate: '2026-06-25', status: 'Submitted', submission: 'cnn_lab_v2.ipynb' }
  ]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const session = sessionStorage.getItem('campusx_erp_session');
      if (session) {
        setCurrentUser(JSON.parse(session));
      }
    }
  }, []);

  const handleUploadAssignment = (id) => {
    const fileName = prompt('Enter name of file to submit (e.g. project.zip):');
    if (fileName) {
      setAssignments(prev => prev.map(a => a.id === id ? { ...a, status: 'Submitted', submission: fileName } : a));
      alert('Assignment uploaded successfully!');
    }
  };

  const handleCreateAssignment = () => {
    const title = prompt('Enter Assignment Title:');
    const course = prompt('Enter Course Name:');
    const dueDate = prompt('Enter Due Date (YYYY-MM-DD):');
    
    if (title && course && dueDate) {
      const newAsn = {
        id: 'ASN' + String(assignments.length + 1).padStart(3, '0'),
        title,
        course,
        dueDate,
        status: 'Pending Upload',
        submission: null
      };
      setAssignments(prev => [...prev, newAsn]);
      alert('New assignment published successfully.');
    }
  };

  if (!currentUser) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="w-8 h-8 border-4 border-brand-primary/30 border-t-brand-primary rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 md:gap-8">
      <div className="page-header animate-fade-in flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-display font-bold text-brand-text-main">Course Assignments</h1>
          <p className="text-brand-text-muted mt-1 text-sm">
            {currentUser.role === 'faculty' ? 'Publish and grade homework tasks, labs, and term projects.' : 'Check assignments, view deadlines, and submit notebooks/reports.'}
          </p>
        </div>
        {currentUser.role === 'faculty' && (
          <button className="btn btn-primary cursor-pointer flex items-center gap-2" onClick={handleCreateAssignment}>
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Publish Assignment
          </button>
        )}
      </div>

      {/* Assignments list */}
      <div className="card p-6 bg-brand-bg-secondary border border-brand-border rounded-2xl animate-fade-in mt-2">
        <h3 className="mb-4 font-display text-base font-bold text-brand-text-main">Assignments Roster</h3>
        <div className="table-container overflow-x-auto relative">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-brand-border text-brand-text-subtle text-xs uppercase font-semibold">
                <th className="p-4">Assignment</th>
                <th className="p-4">Course</th>
                <th className="p-4">Due Date</th>
                <th className="p-4">Submission</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {assignments.map(a => (
                <tr key={a.id} className="border-b border-brand-border hover:bg-white/[0.01] transition-colors text-sm text-brand-text-main">
                  <td className="p-4">
                    <div className="font-semibold text-brand-text-main">{a.title}</div>
                    <code className="text-[0.65rem] text-brand-text-muted font-mono">{a.id}</code>
                  </td>
                  <td className="p-4 text-brand-text-muted">{a.course}</td>
                  <td className="p-4 font-mono text-xs text-brand-accent-amber">{a.dueDate}</td>
                  <td className="p-4 font-mono text-xs text-brand-text-subtle">{a.submission || '—'}</td>
                  <td className="p-4 text-right relative">
                    <button 
                      className="text-brand-text-muted hover:text-white p-2 rounded-lg transition-all focus:bg-brand-bg-tertiary cursor-pointer inline-flex items-center justify-center"
                      onClick={() => setActiveKebabId(activeKebabId === a.id ? null : a.id)}
                    >
                      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/></svg>
                    </button>
                    {activeKebabId === a.id && (
                      <div className="absolute right-4 top-12 bg-brand-bg-tertiary border border-brand-border rounded-xl shadow-2xl z-[100] w-36 text-left p-1.5 animate-scale-up">
                        {currentUser.role === 'student' && a.status === 'Pending Upload' ? (
                          <button 
                            className="w-full text-left px-3 py-2 text-xs font-semibold text-brand-text-main hover:bg-white/[0.05] rounded-lg cursor-pointer"
                            onClick={() => { setActiveKebabId(null); handleUploadAssignment(a.id); }}
                          >
                            Upload File
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
