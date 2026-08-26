'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useDb } from '../../context/db-context';

export default function DepartmentsPage() {
  const {
    departments,
    students,
    faculty,
    updateDepartment
  } = useDb();

  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      let session = sessionStorage.getItem('campusx_erp_session');
      if (!session) {
        const defaultUser = { id: 'usr_admin', name: 'Dr. Alex Vance', role: 'admin', email: 'admin@campusx.edu' };
        sessionStorage.setItem('campusx_erp_session', JSON.stringify(defaultUser));
        session = JSON.stringify(defaultUser);
      }
      try {
        setCurrentUser(JSON.parse(session));
      } catch (e) {}
    }
  }, []);

  const [selectedDept, setSelectedDept] = useState(null);
  const [modHod, setModHod] = useState('');
  const [modBudget, setModBudget] = useState(0);

  // AI efficiency calculations states
  const [efficiencyMap, setEfficiencyMap] = useState({});

  // Calculate efficiency on mount or changes
  useEffect(() => {
    if (departments.length === 0) return;

    const calculateEfficiencies = async () => {
      const tempMap = {};

      for (let d of departments) {
        let pct = 82; // fallback
        if (typeof window !== 'undefined' && window.tf) {
          try {
            const tf = window.tf;
            const x = tf.tensor2d([[d.budget / 500000.0, d.facultyCount / 10.0, d.studentCount / 20.0]]);
            const w = tf.tensor2d([[-0.5], [1.2], [0.8]]);
            const y = tf.matMul(x, w);
            const val = y.dataSync()[0];
            pct = Math.round(Math.max(50, Math.min(99, 75 + val * 10)));
            
            x.dispose();
            w.dispose();
            y.dispose();
          } catch (e) {
            console.warn('TF department evaluation failed:', e);
          }
        }
        tempMap[d.code] = pct;
      }

      setEfficiencyMap(tempMap);
    };

    calculateEfficiencies();
  }, [departments]);

  const openManageModal = (d) => {
    setSelectedDept(d);
    setModHod(d.hod);
    setModBudget(d.budget);
  };

  const handleSaveSpecifications = () => {
    if (!modHod.trim() || isNaN(modBudget) || modBudget <= 0) {
      alert("Please specify valid HOD name and operating budget numbers.");
      return;
    }

    updateDepartment(selectedDept.code, {
      hod: modHod.trim(),
      budget: Number(modBudget)
    });

    setSelectedDept(null);
    alert('Department parameters updated successfully!');
  };

  if (!currentUser) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="w-8 h-8 border-4 border-brand-primary/30 border-t-brand-primary rounded-full animate-spin"></div>
      </div>
    );
  }

  if (currentUser.role !== 'admin') {
    return (
      <div className="card p-8 text-center bg-brand-bg-secondary border border-brand-border rounded-2xl animate-fade-in my-12">
        <div className="w-16 h-16 bg-brand-accent-ruby/10 text-brand-accent-ruby rounded-full flex items-center justify-center mx-auto mb-4 border border-brand-accent-ruby/20">
          <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
        </div>
        <h2 className="text-xl font-display font-bold text-brand-text-main">Access Denied</h2>
        <p className="text-brand-text-muted text-sm mt-2 max-w-md mx-auto">You do not have the required credentials to access the academic departments registry.</p>
        <Link className="btn btn-secondary mt-6 cursor-pointer" href="/">Return to Home Portal</Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 md:gap-8">
      <div className="page-header animate-fade-in flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-display font-bold text-brand-text-main">Academic & Administrative Departments</h1>
          <p className="text-brand-text-muted mt-1 text-sm">Supervise academic divisions, check allocated operating budgets, and review Head of Department assignments.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in mt-2">
        {departments.map(d => {
          const budgetFormatted = d.budget.toLocaleString();
          const deptStudents = students.filter(s => s.dept === d.code);
          const avgAttend = deptStudents.length > 0 
            ? Math.round(deptStudents.reduce((acc, curr) => acc + (curr.attendance || 0), 0) / deptStudents.length) 
            : 90;

          const efficiencyPct = efficiencyMap[d.code] || 82;

          return (
            <div 
              key={d.code} 
              className="card p-6 bg-brand-bg-secondary border border-brand-border rounded-2xl flex flex-col gap-4"
              style={{ borderTop: `4px solid ${d.color}` }}
            >
              <div>
                <span className="badge bg-brand-bg-tertiary text-brand-text-main font-bold text-xs px-2 py-0.5 rounded">{d.code}</span>
                <h3 className="mt-2.5 font-display text-lg leading-snug min-h-[46px] font-semibold text-brand-text-main">{d.name}</h3>
              </div>

              <div className="text-sm text-brand-text-muted flex flex-col gap-1.5 p-3 bg-white/[0.01] rounded-xl border border-brand-border/40">
                <div><strong>HOD:</strong> {d.hod}</div>
                <div><strong>Faculty Members:</strong> {d.facultyCount} Professors</div>
                <div><strong>Enrolled Students:</strong> {d.studentCount} Majors</div>
                <div><strong>Allocated Budget:</strong> ${budgetFormatted}</div>
                <div><strong>Average Attendance:</strong> <span className={`font-bold ${avgAttend < 75 ? 'text-brand-accent-ruby' : (avgAttend < 85 ? 'text-brand-accent-amber' : 'text-brand-accent-emerald')}`}>{avgAttend}%</span></div>
                <div><strong>AI Budget Efficiency:</strong> <span className="font-bold text-brand-primary font-mono">{efficiencyPct}%</span></div>
              </div>

              {currentUser?.role === 'admin' && (
                <div className="flex gap-2 mt-auto pt-2">
                  <button className="btn btn-secondary btn-sm edit-dept-btn w-full font-medium cursor-pointer" onClick={() => openManageModal(d)}>Manage Resources</button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* MANAGE RESOURCES MODAL */}
      {selectedDept && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center z-[1000] p-4">
          <div className="modal-container bg-brand-bg-secondary border border-brand-border rounded-[20px] w-full max-w-[500px] shadow-2xl animate-fade-in">
            <div className="modal-header p-5 px-6 border-b border-brand-border flex items-center justify-between">
              <h3 className="modal-title font-display text-xl font-semibold text-brand-text-main">Modify Department Parameters</h3>
              <button className="modal-close bg-transparent border-none text-brand-text-muted cursor-pointer text-2xl" onClick={() => setSelectedDept(null)}>&times;</button>
            </div>
            <div className="modal-body p-6 flex flex-col gap-4">
              <h3 className="font-display text-base font-bold text-brand-text-main mb-1">{selectedDept.name} ({selectedDept.code})</h3>
              <p className="text-brand-text-muted text-xs">Academic Deanery | Head of Department: <strong>{selectedDept.hod}</strong></p>
              
              <div className="form-group flex flex-col gap-1.5">
                <label className="form-label text-xs font-semibold text-brand-text-muted">Head of Department (HOD)</label>
                <input 
                  type="text" 
                  className="bg-brand-bg-tertiary border border-brand-border text-brand-text-main p-2.5 rounded-xl outline-none" 
                  value={modHod}
                  onChange={(e) => setModHod(e.target.value)}
                />
              </div>
              <div className="form-group flex flex-col gap-1.5">
                <label className="form-label text-xs font-semibold text-brand-text-muted">Annual Department Operating Budget ($)</label>
                <input 
                  type="number" 
                  className="bg-brand-bg-tertiary border border-brand-border text-brand-text-main p-2.5 rounded-xl outline-none" 
                  value={modBudget}
                  onChange={(e) => setModBudget(parseInt(e.target.value) || 0)}
                />
              </div>
            </div>
            <div className="modal-footer p-4 px-6 border-t border-brand-border flex justify-end gap-3">
              <button className="btn btn-secondary cursor-pointer" onClick={() => setSelectedDept(null)}>Cancel</button>
              <button className="btn btn-primary cursor-pointer" onClick={handleSaveSpecifications}>Save Specifications</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
