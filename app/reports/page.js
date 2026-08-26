'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

export default function ReportsPage() {
  const [currentUser, setCurrentUser] = useState(null);
  
  const chartRef1 = useRef(null);
  const chartRef2 = useRef(null);
  const canvasRef1 = useRef(null);
  const canvasRef2 = useRef(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const session = sessionStorage.getItem('campusx_erp_session');
      if (session) {
        setCurrentUser(JSON.parse(session));
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.Chart || !canvasRef1.current || !canvasRef2.current) return;
    const Chart = window.Chart;

    if (chartRef1.current) chartRef1.current.destroy();
    if (chartRef2.current) chartRef2.current.destroy();

    // Chart 1: Enrollment Trends
    chartRef1.current = new Chart(canvasRef1.current, {
      type: 'line',
      data: {
        labels: ['2022', '2023', '2024', '2025', '2026'],
        datasets: [{
          label: 'Total Enrollments',
          data: [1100, 1250, 1380, 1450, 1528],
          borderColor: '#6366f1',
          backgroundColor: 'rgba(99, 102, 241, 0.1)',
          fill: true,
          tension: 0.4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          y: { grid: { color: 'rgba(255, 255, 255, 0.05)' }, ticks: { color: '#94a3b8' } },
          x: { grid: { display: false }, ticks: { color: '#94a3b8' } }
        }
      }
    });

    // Chart 2: Revenue vs Expenses
    chartRef2.current = new Chart(canvasRef2.current, {
      type: 'bar',
      data: {
        labels: ['Q1', 'Q2', 'Q3', 'Q4'],
        datasets: [
          {
            label: 'Revenue',
            data: [450000, 520000, 610000, 580000],
            backgroundColor: '#10b981',
            borderRadius: 4
          },
          {
            label: 'Expenses',
            data: [320000, 380000, 420000, 390000],
            backgroundColor: '#f43f5e',
            borderRadius: 4
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: { grid: { color: 'rgba(255, 255, 255, 0.05)' }, ticks: { color: '#94a3b8' } },
          x: { grid: { display: false }, ticks: { color: '#94a3b8' } }
        }
      }
    });

    return () => {
      if (chartRef1.current) chartRef1.current.destroy();
      if (chartRef2.current) chartRef2.current.destroy();
    };
  }, [currentUser]);

  if (!currentUser || currentUser.role !== 'admin') {
    return (
      <div className="card p-8 text-center bg-brand-bg-secondary border border-brand-border rounded-2xl animate-fade-in my-12">
        <div className="w-16 h-16 bg-brand-accent-ruby/10 text-brand-accent-ruby rounded-full flex items-center justify-center mx-auto mb-4 border border-brand-accent-ruby/20">
          <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
        </div>
        <h2 className="text-xl font-display font-bold text-brand-text-main">Access Denied</h2>
        <p className="text-brand-text-muted text-sm mt-2 max-w-md mx-auto">You do not have the required administrative credentials to access Reports & Analytics.</p>
        <Link className="btn btn-secondary mt-6 cursor-pointer" href="/">Return to Home Portal</Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 md:gap-8">
      <div className="page-header animate-fade-in flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-display font-bold text-brand-text-main">Reports & Analytics</h1>
          <p className="text-brand-text-muted mt-1 text-sm">Generate academic charts, review financial metrics, and monitor ERP performance parameters.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in mt-2">
        {/* Enrollment Chart Card */}
        <div className="card p-6 bg-brand-bg-secondary border border-brand-border rounded-2xl flex flex-col gap-4">
          <h3 className="m-0 font-display text-base font-bold text-brand-text-main">Enrollment Growth (Historical)</h3>
          <div className="h-[240px] relative">
            <canvas ref={canvasRef1}></canvas>
          </div>
        </div>

        {/* Financial Revenue/Expense Card */}
        <div className="card p-6 bg-brand-bg-secondary border border-brand-border rounded-2xl flex flex-col gap-4">
          <h3 className="m-0 font-display text-base font-bold text-brand-text-main">ERP Budget Flow</h3>
          <div className="h-[240px] relative">
            <canvas ref={canvasRef2}></canvas>
          </div>
        </div>
      </div>
    </div>
  );
}
