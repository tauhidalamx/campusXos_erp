'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function ResultsPage() {
  const [currentUser, setCurrentUser] = useState(null);
  const [selectedSem, setSelectedSem] = useState('All');
  const [selectedStudent, setSelectedStudent] = useState('STU001');
  const [searchQuery, setSearchQuery] = useState('');

  // Sample student result databases
  const studentResults = {
    STU001: {
      studentName: 'Aarav Mehta',
      rollNo: 'STU001',
      dept: 'Computer Science',
      cgpa: 8.95,
      sgpa: 9.12,
      grades: [
        { sem: 'Semester 1', code: 'CS101', name: 'Intro to Programming', credits: 3, grade: 'A', status: 'Pass' },
        { sem: 'Semester 1', code: 'MATH101', name: 'Calculus I', credits: 4, grade: 'A-', status: 'Pass' },
        { sem: 'Semester 1', code: 'PHYS101', name: 'Engineering Physics', credits: 4, grade: 'B+', status: 'Pass' },
        { sem: 'Semester 2', code: 'CS202', name: 'Data Structures', credits: 4, grade: 'A', status: 'Pass' },
        { sem: 'Semester 2', code: 'CS204', name: 'Digital Electronics', credits: 3, grade: 'B', status: 'Pass' },
        { sem: 'Semester 2', code: 'MATH202', name: 'Linear Algebra', credits: 3, grade: 'A', status: 'Pass' }
      ]
    },
    STU002: {
      studentName: 'Priya Nair',
      rollNo: 'STU002',
      dept: 'Computer Science',
      cgpa: 9.42,
      sgpa: 9.60,
      grades: [
        { sem: 'Semester 1', code: 'CS101', name: 'Intro to Programming', credits: 3, grade: 'A+', status: 'Pass' },
        { sem: 'Semester 1', code: 'MATH101', name: 'Calculus I', credits: 4, grade: 'A', status: 'Pass' },
        { sem: 'Semester 1', code: 'PHYS101', name: 'Engineering Physics', credits: 4, grade: 'A', status: 'Pass' },
        { sem: 'Semester 2', code: 'CS202', name: 'Data Structures', credits: 4, grade: 'A+', status: 'Pass' },
        { sem: 'Semester 2', code: 'CS204', name: 'Digital Electronics', credits: 3, grade: 'A', status: 'Pass' },
        { sem: 'Semester 2', code: 'MATH202', name: 'Linear Algebra', credits: 3, grade: 'A', status: 'Pass' }
      ]
    },
    STU003: {
      studentName: 'Kabir Sen',
      rollNo: 'STU003',
      dept: 'Electrical Engineering',
      cgpa: 7.82,
      sgpa: 8.10,
      grades: [
        { sem: 'Semester 1', code: 'EE101', name: 'Basic Electrical Eng', credits: 3, grade: 'B', status: 'Pass' },
        { sem: 'Semester 1', code: 'MATH101', name: 'Calculus I', credits: 4, grade: 'C+', status: 'Pass' },
        { sem: 'Semester 1', code: 'PHYS101', name: 'Engineering Physics', credits: 4, grade: 'B-', status: 'Pass' },
        { sem: 'Semester 2', code: 'EE202', name: 'Network Analysis', credits: 4, grade: 'B+', status: 'Pass' },
        { sem: 'Semester 2', code: 'EE204', name: 'Electromagnetics', credits: 3, grade: 'C', status: 'Pass' },
        { sem: 'Semester 2', code: 'MATH202', name: 'Linear Algebra', credits: 3, grade: 'B', status: 'Pass' }
      ]
    }
  };

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

  // Determine which student details to view
  // If role is student, they can only view STU001 or their own result (mocked STU001 or STU002 based on session).
  const viewStudentId = currentUser.role === 'student' ? 'STU001' : selectedStudent;
  const currentResult = studentResults[viewStudentId] || studentResults['STU001'];

  const filteredGrades = currentResult.grades.filter(g => selectedSem === 'All' || g.sem === selectedSem);

  return (
    <div className="flex flex-col gap-6 md:gap-8">
      {/* Header */}
      <div className="page-header animate-fade-in flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-brand-text-main">Term Results & Transcripts</h1>
          <p className="text-brand-text-muted mt-1 text-sm">View semester grades, cumulative performance indexes, and official academic records.</p>
        </div>
        <button 
          onClick={() => alert('Official PDF Transcript signature requested from registrar blockchain ledger.')}
          className="btn btn-primary cursor-pointer flex items-center gap-1.5"
        >
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
          Export Official Record
        </button>
      </div>

      {/* Role specific control panel */}
      {currentUser.role !== 'student' && (
        <div className="card p-5 bg-brand-bg-secondary border border-brand-border rounded-2xl flex flex-col sm:flex-row gap-4 justify-between items-center animate-fade-in">
          <div>
            <h3 className="m-0 text-sm font-semibold text-brand-text-main">Administrative View Controls</h3>
            <p className="text-xs text-brand-text-muted mt-0.5 m-0">Select a student registry card to audit grade values.</p>
          </div>
          <div className="flex gap-3 w-full sm:w-auto">
            <select
              value={selectedStudent}
              onChange={(e) => setSelectedStudent(e.target.value)}
              className="bg-brand-bg-tertiary border border-brand-border text-brand-text-main px-4 py-2.5 rounded-xl text-xs outline-none font-semibold cursor-pointer w-full sm:w-60"
            >
              <option value="STU001">STU001 - Aarav Mehta (CS)</option>
              <option value="STU002">STU002 - Priya Nair (CS)</option>
              <option value="STU003">STU003 - Kabir Sen (EE)</option>
            </select>
          </div>
        </div>
      )}

      {/* Overview stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 animate-fade-in">
        <div className="card p-5 bg-brand-bg-secondary border border-brand-border rounded-2xl flex items-center justify-between">
          <div>
            <span className="text-brand-text-muted text-xs font-semibold">Student Name</span>
            <span className="block text-xl font-bold font-display text-brand-text-main mt-1">{currentResult.studentName}</span>
            <span className="text-[0.7rem] text-brand-text-subtle mt-1 block">ID: {currentResult.rollNo} • {currentResult.dept}</span>
          </div>
          <div className="p-3.5 bg-brand-primary/10 rounded-xl text-brand-primary">
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          </div>
        </div>
        <div className="card p-5 bg-brand-bg-secondary border border-brand-border rounded-2xl flex items-center justify-between">
          <div>
            <span className="text-brand-text-muted text-xs font-semibold">Cumulative CGPA</span>
            <span className="block text-3xl font-bold font-display text-brand-accent-emerald mt-1">{currentResult.cgpa.toFixed(2)}</span>
            <span className="text-[0.7rem] text-brand-accent-emerald mt-1 block">First Class Distinction</span>
          </div>
          <div className="p-3.5 bg-brand-accent-emerald/10 rounded-xl text-brand-accent-emerald">
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M22 4L12 14.01l-3-3"/></svg>
          </div>
        </div>
        <div className="card p-5 bg-brand-bg-secondary border border-brand-border rounded-2xl flex items-center justify-between">
          <div>
            <span className="text-brand-text-muted text-xs font-semibold">Current Semester SGPA</span>
            <span className="block text-3xl font-bold font-display text-brand-accent-cyan mt-1">{currentResult.sgpa.toFixed(2)}</span>
            <span className="text-[0.7rem] text-brand-text-subtle mt-1 block">Based on Sem 2 performance</span>
          </div>
          <div className="p-3.5 bg-brand-accent-cyan/10 rounded-xl text-brand-accent-cyan">
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
          </div>
        </div>
      </div>

      {/* Filters and Semester list */}
      <div className="card p-6 bg-brand-bg-secondary border border-brand-border rounded-2xl flex flex-col gap-6 animate-fade-in">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-brand-border pb-4">
          <h3 className="m-0 font-display text-base font-bold text-brand-text-main">Subject Grade Details</h3>
          <div className="flex gap-2">
            {['All', 'Semester 1', 'Semester 2'].map(sem => (
              <button
                key={sem}
                onClick={() => setSelectedSem(sem)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all ${selectedSem === sem ? 'bg-brand-primary text-white' : 'bg-brand-bg-tertiary text-brand-text-muted hover:text-brand-text-main'}`}
              >
                {sem}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-brand-border text-brand-text-subtle font-semibold">
                <th className="pb-3">Course Code</th>
                <th className="pb-3">Course Name</th>
                <th className="pb-3">Credits</th>
                <th className="pb-3">Term Semester</th>
                <th className="pb-3">Acquired Grade</th>
                <th className="pb-3 text-right">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredGrades.map((g, i) => (
                <tr key={i} className="border-b border-brand-border/40 hover:bg-white/[0.01] transition-all">
                  <td className="py-4 font-mono font-semibold text-brand-accent-cyan">{g.code}</td>
                  <td className="py-4 font-semibold text-brand-text-main">{g.name}</td>
                  <td className="py-4 font-mono text-brand-text-muted">{g.credits} Credits</td>
                  <td className="py-4 text-brand-text-muted">{g.sem}</td>
                  <td className="py-4">
                    <span className="font-display font-bold text-sm bg-brand-bg-tertiary border border-brand-border/60 px-2.5 py-1 rounded text-white font-mono">
                      {g.grade}
                    </span>
                  </td>
                  <td className="py-4 text-right">
                    <span className="badge bg-brand-accent-emerald/10 text-brand-accent-emerald font-semibold px-2 py-0.5 rounded">
                      {g.status}
                    </span>
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
