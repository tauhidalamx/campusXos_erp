'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function MarksPage() {
  const [currentUser, setCurrentUser] = useState(null);
  const [activeKebabId, setActiveKebabId] = useState(null);

  // Student Marks View
  const [studentGrades, setStudentGrades] = useState([
    { courseCode: 'CS101', courseName: 'Computer Architecture', credits: 4, internal: 27, external: 55, total: 82, grade: 'A' },
    { courseCode: 'CS102', courseName: 'Advanced Machine Learning', credits: 4, internal: 24, external: 52, total: 76, grade: 'B+' },
    { courseCode: 'CS104', courseName: 'Algorithms Analysis', credits: 4, internal: 29, external: 58, total: 87, grade: 'A+' }
  ]);

  // Faculty Student Grading List
  const [studentsList, setStudentsList] = useState([
    { id: 'STU001', name: 'Alex Rivera', currentMarks: 82, grade: 'A' },
    { id: 'STU002', name: 'Rahul Sharma', currentMarks: 76, grade: 'B+' },
    { id: 'STU003', name: 'Aria Nakamura', currentMarks: 87, grade: 'A+' }
  ]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const session = sessionStorage.getItem('campusx_erp_session');
      if (session) {
        setCurrentUser(JSON.parse(session));
      }
    }
  }, []);

  const handleEditMarks = (id, currentMarks) => {
    const newMarks = parseInt(prompt(`Enter new marks for student:`, currentMarks));
    if (!isNaN(newMarks) && newMarks >= 0 && newMarks <= 100) {
      let grade = 'F';
      if (newMarks >= 90) grade = 'A+';
      else if (newMarks >= 80) grade = 'A';
      else if (newMarks >= 70) grade = 'B+';
      else if (newMarks >= 60) grade = 'B';
      else if (newMarks >= 50) grade = 'C';
      
      setStudentsList(prev => prev.map(s => s.id === id ? { ...s, currentMarks: newMarks, grade } : s));
      alert('Marks updated successfully.');
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
          <h1 className="text-3xl font-display font-bold text-brand-text-main">Academic Marks</h1>
          <p className="text-brand-text-muted mt-1 text-sm">
            {currentUser.role === 'faculty' ? 'Input semester grades, internal assessment marks, and exam evaluations.' : 'View semester report cards, internal marks, and transcript summaries.'}
          </p>
        </div>
      </div>

      {currentUser.role === 'faculty' ? (
        /* Faculty Marks Entry View */
        <div className="card p-6 bg-brand-bg-secondary border border-brand-border rounded-2xl animate-fade-in mt-2">
          <h3 className="mb-4 font-display text-base font-bold text-brand-text-main">Student Class Grading (CS101)</h3>
          <div className="table-container overflow-x-auto relative">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-brand-border text-brand-text-subtle text-xs uppercase font-semibold">
                  <th className="p-4">Student Name</th>
                  <th className="p-4">ID</th>
                  <th className="p-4">Current Marks</th>
                  <th className="p-4">Grade Assigned</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {studentsList.map(s => (
                  <tr key={s.id} className="border-b border-brand-border hover:bg-white/[0.01] transition-colors text-sm text-brand-text-main">
                    <td className="p-4 font-semibold text-brand-text-main">{s.name}</td>
                    <td className="p-4"><code className="font-mono text-xs text-brand-text-muted">{s.id}</code></td>
                    <td className="p-4 font-mono font-bold">{s.currentMarks} / 100</td>
                    <td className="p-4"><span className="badge bg-brand-primary/20 text-brand-primary text-xs px-2 py-0.5 rounded font-semibold">{s.grade}</span></td>
                    <td className="p-4 text-right relative">
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
                            onClick={() => { setActiveKebabId(null); handleEditMarks(s.id, s.currentMarks); }}
                          >
                            Update Grades
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
      ) : (
        /* Student Transcript / Report Card View */
        <div className="card p-6 bg-brand-bg-secondary border border-brand-border rounded-2xl animate-fade-in mt-2">
          <h3 className="mb-4 font-display text-base font-bold text-brand-text-main">Current Semester Transcript</h3>
          <div className="table-container overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-brand-border text-brand-text-subtle text-xs uppercase font-semibold">
                  <th className="p-4">Subject</th>
                  <th className="p-4">Credits</th>
                  <th className="p-4">Internal (30)</th>
                  <th className="p-4">External (70)</th>
                  <th className="p-4">Total (100)</th>
                  <th className="p-4">Letter Grade</th>
                </tr>
              </thead>
              <tbody>
                {studentGrades.map((g, i) => (
                  <tr key={i} className="border-b border-brand-border hover:bg-white/[0.01] transition-colors text-sm text-brand-text-main">
                    <td className="p-4">
                      <div className="font-semibold text-brand-text-main">{g.courseName}</div>
                      <code className="text-[0.65rem] text-brand-text-muted font-mono">{g.courseCode}</code>
                    </td>
                    <td className="p-4 text-brand-text-muted">{g.credits}</td>
                    <td className="p-4 font-mono text-xs">{g.internal}</td>
                    <td className="p-4 font-mono text-xs">{g.external}</td>
                    <td className="p-4 font-mono text-xs font-bold text-brand-primary">{g.total}</td>
                    <td className="p-4"><span className="badge bg-brand-accent-emerald/20 text-brand-accent-emerald text-xs px-2 py-0.5 rounded font-semibold">{g.grade}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
