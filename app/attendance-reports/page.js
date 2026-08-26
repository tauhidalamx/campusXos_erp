'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function AttendanceReportsPage() {
  const [currentUser, setCurrentUser] = useState(null);

  const [alerts, setAlerts] = useState([
    { id: 'STU004', name: 'John Doe', dept: 'CS', attendance: 71.5, email: 'john@campusx.edu' },
    { id: 'STU009', name: 'Aaliyah Jones', dept: 'CS', attendance: 68.2, email: 'aaliyah@campusx.edu' }
  ]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const session = sessionStorage.getItem('campusx_erp_session');
      if (session) {
        setCurrentUser(JSON.parse(session));
      }
    }
  }, []);

  const handleSendWarning = (email, name) => {
    alert(`Warning email successfully dispatched to ${name} (${email}) for low attendance status.`);
  };

  if (!currentUser || (currentUser.role !== 'hod' && currentUser.role !== 'admin')) {
    return (
      <div className="card p-8 text-center bg-brand-bg-secondary border border-brand-border rounded-2xl animate-fade-in my-12">
        <div className="w-16 h-16 bg-brand-accent-ruby/10 text-brand-accent-ruby rounded-full flex items-center justify-center mx-auto mb-4 border border-brand-accent-ruby/20">
          <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
        </div>
        <h2 className="text-xl font-display font-bold text-brand-text-main">Access Denied</h2>
        <p className="text-brand-text-muted text-sm mt-2 max-w-md mx-auto">You do not have the required HOD credentials to view Attendance Reports.</p>
        <Link className="btn btn-secondary mt-6 cursor-pointer" href="/">Return to Home Portal</Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 md:gap-8">
      <div className="page-header animate-fade-in flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-display font-bold text-brand-text-main">Attendance Reports</h1>
          <p className="text-brand-text-muted mt-1 text-sm">Review student attendance aggregates and run low attendance warning triggers.</p>
        </div>
      </div>

      {/* Low Attendance Alerts list */}
      <div className="card p-6 bg-brand-bg-secondary border border-brand-border rounded-2xl animate-fade-in mt-2">
        <h3 className="mb-4 font-display text-base font-bold text-brand-accent-ruby flex items-center gap-2">
          ⚠️ Low Attendance Alerts (&lt; 75%)
        </h3>
        <div className="table-container overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-brand-border text-brand-text-subtle text-xs uppercase font-semibold">
                <th className="p-4">Student</th>
                <th className="p-4">ID</th>
                <th className="p-4">Department</th>
                <th className="p-4">Attendance Percentage</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {alerts.map(a => (
                <tr key={a.id} className="border-b border-brand-border hover:bg-white/[0.01] transition-colors text-sm text-brand-text-main">
                  <td className="p-4 font-semibold text-brand-text-main">{a.name}</td>
                  <td className="p-4"><code className="font-mono text-xs text-brand-text-muted">{a.id}</code></td>
                  <td className="p-4">{a.dept}</td>
                  <td className="p-4 font-mono font-bold text-brand-accent-ruby">{a.attendance}%</td>
                  <td className="p-4 text-right">
                    <button 
                      className="btn bg-brand-accent-ruby/20 text-brand-accent-ruby border border-brand-accent-ruby/30 hover:bg-brand-accent-ruby/30 btn-sm cursor-pointer"
                      onClick={() => handleSendWarning(a.email, a.name)}
                    >
                      Send Notice
                    </button>
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
