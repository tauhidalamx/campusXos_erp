'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

export default function DepartmentReportsPage() {
  const [currentUser, setCurrentUser] = useState(null);
  
  const chartRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const session = sessionStorage.getItem('campusx_erp_session');
      if (session) {
        setCurrentUser(JSON.parse(session));
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.Chart || !canvasRef.current) return;
    const Chart = window.Chart;

    if (chartRef.current) chartRef.current.destroy();

    // Chart: Subject Wise Averages
    chartRef.current = new Chart(canvasRef.current, {
      type: 'radar',
      data: {
        labels: ['Syllabus Covered', 'Avg Attendance', 'Student Pass Rate', 'Faculty Workload Rate', 'Assignment Submissions'],
        datasets: [{
          label: 'Computer Science Department Indice',
          data: [78, 86, 92, 65, 89],
          borderColor: '#6366f1',
          backgroundColor: 'rgba(99, 102, 241, 0.2)',
          borderWidth: 2
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          r: {
            grid: { color: 'rgba(255, 255, 255, 0.08)' },
            angleLines: { color: 'rgba(255, 255, 255, 0.08)' },
            pointLabels: { color: '#94a3b8', font: { size: 10 } },
            ticks: { display: false }
          }
        }
      }
    });

    return () => {
      if (chartRef.current) chartRef.current.destroy();
    };
  }, [currentUser]);

  if (!currentUser || (currentUser.role !== 'hod' && currentUser.role !== 'admin')) {
    return (
      <div className="card p-8 text-center bg-brand-bg-secondary border border-brand-border rounded-2xl animate-fade-in my-12">
        <div className="w-16 h-16 bg-brand-accent-ruby/10 text-brand-accent-ruby rounded-full flex items-center justify-center mx-auto mb-4 border border-brand-accent-ruby/20">
          <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
        </div>
        <h2 className="text-xl font-display font-bold text-brand-text-main">Access Denied</h2>
        <p className="text-brand-text-muted text-sm mt-2 max-w-md mx-auto">You do not have the required HOD credentials to view Department Reports.</p>
        <Link className="btn btn-secondary mt-6 cursor-pointer" href="/">Return to Home Portal</Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 md:gap-8">
      <div className="page-header animate-fade-in flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-display font-bold text-brand-text-main">Department Reports</h1>
          <p className="text-brand-text-muted mt-1 text-sm">Analyze departmental performance indices, budget tracking sheets, and academic coverage models.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[1.2fr_1fr] gap-6 animate-fade-in mt-2">
        {/* Radar Performance Index Card */}
        <div className="card p-6 bg-brand-bg-secondary border border-brand-border rounded-2xl flex flex-col gap-4">
          <h3 className="m-0 font-display text-base font-bold text-brand-text-main">CS Department Performance Index</h3>
          <div className="h-[260px] relative">
            <canvas ref={canvasRef}></canvas>
          </div>
        </div>

        {/* Financial and Summary Card */}
        <div className="card p-6 bg-brand-bg-secondary border border-brand-border rounded-2xl flex flex-col gap-4">
          <h3 className="m-0 font-display text-base font-bold text-brand-text-main">CS Department Allocation Summary</h3>
          <div className="flex flex-col gap-3.5 mt-2">
            <div className="flex justify-between items-center border-b border-brand-border pb-2.5">
              <span className="text-sm text-brand-text-muted">Assigned Budget</span>
              <strong className="text-sm text-brand-accent-emerald font-mono">$450,000 / Year</strong>
            </div>
            <div className="flex justify-between items-center border-b border-brand-border pb-2.5">
              <span className="text-sm text-brand-text-muted">Utilized Budget</span>
              <strong className="text-sm text-brand-text-main font-mono">$380,000</strong>
            </div>
            <div className="flex justify-between items-center border-b border-brand-border pb-2.5">
              <span className="text-sm text-brand-text-muted">Total Registered Students</span>
              <strong className="text-sm text-brand-primary font-mono">1,420 Students</strong>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-brand-text-muted">Average Student GPA</span>
              <strong className="text-sm text-brand-accent-cyan font-mono">3.42 CGPA</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
