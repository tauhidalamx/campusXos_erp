'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function GradesPage() {
  const [currentUser, setCurrentUser] = useState(null);

  // Grade Scale Reference
  const gradeScale = [
    { grade: 'A+', points: 10, range: '90 - 100', desc: 'Outstanding' },
    { grade: 'A', points: 9, range: '80 - 89', desc: 'Excellent' },
    { grade: 'B+', points: 8, range: '70 - 79', desc: 'Very Good' },
    { grade: 'B', points: 7, range: '60 - 69', desc: 'Good' },
    { grade: 'C+', points: 6, range: '50 - 59', desc: 'Above Average' },
    { grade: 'C', points: 5, range: '45 - 49', desc: 'Average' },
    { grade: 'D', points: 4, range: '40 - 44', desc: 'Pass' },
    { grade: 'F', points: 0, range: 'Below 40', desc: 'Fail' }
  ];

  // Interactive Calculator State
  const [calcRows, setCalcRows] = useState([
    { id: 1, course: 'Course 1', credits: 3, gradeVal: 9 },
    { id: 2, course: 'Course 2', credits: 4, gradeVal: 8 },
    { id: 3, course: 'Course 3', credits: 3, gradeVal: 10 }
  ]);
  const [calculatedSgpa, setCalculatedSgpa] = useState(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const session = sessionStorage.getItem('campusx_erp_session');
      if (session) {
        setCurrentUser(JSON.parse(session));
      }
    }
  }, []);

  const addCalcRow = () => {
    setCalcRows([...calcRows, { id: Date.now(), course: `Course ${calcRows.length + 1}`, credits: 3, gradeVal: 9 }]);
  };

  const removeCalcRow = (id) => {
    if (calcRows.length === 1) return;
    setCalcRows(calcRows.filter(r => r.id !== id));
  };

  const updateRow = (id, field, value) => {
    setCalcRows(prev => prev.map(r => r.id === id ? { ...r, [field]: value } : r));
  };

  const calculateGpa = () => {
    let totalCredits = 0;
    let weightedPoints = 0;
    calcRows.forEach(r => {
      const cred = parseFloat(r.credits) || 0;
      const pts = parseFloat(r.gradeVal) || 0;
      totalCredits += cred;
      weightedPoints += (cred * pts);
    });
    if (totalCredits === 0) {
      setCalculatedSgpa(0);
    } else {
      setCalculatedSgpa(weightedPoints / totalCredits);
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
      {/* Header */}
      <div className="page-header animate-fade-in flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-brand-text-main">Grading Schemes & Evaluation</h1>
          <p className="text-brand-text-muted mt-1 text-sm">Review absolute grade points, evaluation indices, and calculate prospective term performance.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 animate-fade-in mt-2">
        {/* Left: Grade Scale (2 columns) */}
        <div className="card p-6 bg-brand-bg-secondary border border-brand-border rounded-2xl lg:col-span-2 flex flex-col gap-4">
          <h3 className="m-0 font-display text-base font-bold text-brand-text-main">Official Grade Scale</h3>
          <p className="text-xs text-brand-text-muted mt-0 m-0">CampusX University operates on a 10-point absolute scale.</p>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-brand-border text-brand-text-subtle font-semibold">
                  <th className="pb-2">Grade</th>
                  <th className="pb-2">Grade Point</th>
                  <th className="pb-2">Percentage Range</th>
                  <th className="pb-2 text-right">Description</th>
                </tr>
              </thead>
              <tbody>
                {gradeScale.map((g, i) => (
                  <tr key={i} className="border-b border-brand-border/40">
                    <td className="py-2.5 font-bold text-brand-accent-cyan font-mono">{g.grade}</td>
                    <td className="py-2.5 font-semibold text-brand-text-main font-mono">{g.points}</td>
                    <td className="py-2.5 text-brand-text-muted font-mono">{g.range}</td>
                    <td className="py-2.5 text-brand-text-subtle text-right">{g.desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right: Interactive GPA Calculator (3 columns) */}
        <div className="card p-6 bg-brand-bg-secondary border border-brand-border rounded-2xl lg:col-span-3 flex flex-col justify-between gap-5">
          <div>
            <h3 className="m-0 font-display text-base font-bold text-brand-text-main">Interactive SGPA Calculator</h3>
            <p className="text-xs text-brand-text-muted mt-1 m-0">Input class weights and projected grades to instantly compute SGPA scores.</p>
            
            <div className="flex flex-col gap-3.5 mt-5">
              {calcRows.map((row) => (
                <div key={row.id} className="flex gap-3 items-center">
                  <input 
                    type="text"
                    value={row.course}
                    onChange={(e) => updateRow(row.id, 'course', e.target.value)}
                    className="flex-1 bg-brand-bg-tertiary border border-brand-border text-brand-text-main px-3 py-2 rounded-xl text-xs outline-none focus:border-brand-primary"
                    placeholder="Course name"
                  />
                  <select
                    value={row.credits}
                    onChange={(e) => updateRow(row.id, 'credits', parseInt(e.target.value))}
                    className="w-24 bg-brand-bg-tertiary border border-brand-border text-brand-text-main px-3 py-2 rounded-xl text-xs outline-none font-semibold cursor-pointer"
                  >
                    <option value="1">1 Credit</option>
                    <option value="2">2 Credits</option>
                    <option value="3">3 Credits</option>
                    <option value="4">4 Credits</option>
                  </select>
                  <select
                    value={row.gradeVal}
                    onChange={(e) => updateRow(row.id, 'gradeVal', parseInt(e.target.value))}
                    className="w-32 bg-brand-bg-tertiary border border-brand-border text-brand-text-main px-3 py-2 rounded-xl text-xs outline-none font-semibold cursor-pointer"
                  >
                    <option value="10">A+ (10 pts)</option>
                    <option value="9">A (9 pts)</option>
                    <option value="8">B+ (8 pts)</option>
                    <option value="7">B (7 pts)</option>
                    <option value="6">C+ (6 pts)</option>
                    <option value="5">C (5 pts)</option>
                    <option value="4">D (4 pts)</option>
                    <option value="0">F (0 pts)</option>
                  </select>
                  <button
                    onClick={() => removeCalcRow(row.id)}
                    className="text-brand-text-subtle hover:text-brand-accent-ruby p-1.5 transition-colors cursor-pointer bg-brand-bg-tertiary/40 border border-brand-border/60 rounded-xl"
                  >
                    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                  </button>
                </div>
              ))}
            </div>

            <button
              onClick={addCalcRow}
              className="btn btn-secondary text-xs mt-4 cursor-pointer inline-flex items-center gap-1.5"
            >
              <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              Add Course Row
            </button>
          </div>

          <div className="border-t border-brand-border/40 pt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <button
              onClick={calculateGpa}
              className="btn btn-primary cursor-pointer w-full sm:w-auto"
            >
              Calculate Term SGPA
            </button>
            {calculatedSgpa !== null && (
              <div className="bg-brand-bg-tertiary border border-brand-border px-5 py-2 rounded-xl flex items-center gap-3 w-full sm:w-auto justify-between">
                <span className="text-xs text-brand-text-muted">Calculated SGPA:</span>
                <span className="text-xl font-bold font-display text-brand-accent-cyan font-mono">
                  {calculatedSgpa.toFixed(2)} / 10.0
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
