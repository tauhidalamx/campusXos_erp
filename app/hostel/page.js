'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function HostelPage() {
  const [currentUser, setCurrentUser] = useState(null);
  const [activeKebabId, setActiveKebabId] = useState(null);

  const [hostelBlocks, setHostelBlocks] = useState([
    { blockName: 'Block A (Boys)', totalRooms: 50, occupiedRooms: 42, totalBeds: 100, occupiedBeds: 84 },
    { blockName: 'Block B (Girls)', totalRooms: 40, occupiedRooms: 38, totalBeds: 80, occupiedBeds: 76 },
    { blockName: 'Block C (International)', totalRooms: 20, occupiedRooms: 12, totalBeds: 40, occupiedBeds: 24 }
  ]);

  const [roomAllocations, setRoomAllocations] = useState([
    { id: 'ALC001', studentName: 'Alex Rivera', roomNo: 'Block A - 204', status: 'Allocated', feeStatus: 'Paid' },
    { id: 'ALC002', studentName: 'Rahul Sharma', roomNo: 'Block A - 108', status: 'Allocated', feeStatus: 'Pending' },
    { id: 'ALC003', studentName: 'Aria Nakamura', roomNo: 'Block B - 112', status: 'Allocated', feeStatus: 'Paid' }
  ]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const session = sessionStorage.getItem('campusx_erp_session');
      if (session) {
        setCurrentUser(JSON.parse(session));
      }
    }
  }, []);

  const handleDeallocate = (id, name) => {
    if (confirm(`Deallocate room for student ${name}?`)) {
      setRoomAllocations(prev => prev.filter(r => r.id !== id));
      alert(`Deallocated successfully.`);
    }
  };

  if (!currentUser || currentUser.role !== 'admin') {
    return (
      <div className="card p-8 text-center bg-brand-bg-secondary border border-brand-border rounded-2xl animate-fade-in my-12">
        <div className="w-16 h-16 bg-brand-accent-ruby/10 text-brand-accent-ruby rounded-full flex items-center justify-center mx-auto mb-4 border border-brand-accent-ruby/20">
          <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
        </div>
        <h2 className="text-xl font-display font-bold text-brand-text-main">Access Denied</h2>
        <p className="text-brand-text-muted text-sm mt-2 max-w-md mx-auto">You do not have the required administrative credentials to access Hostel Management.</p>
        <Link className="btn btn-secondary mt-6 cursor-pointer" href="/">Return to Home Portal</Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 md:gap-8">
      <div className="page-header animate-fade-in flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-display font-bold text-brand-text-main">Hostel Management</h1>
          <p className="text-brand-text-muted mt-1 text-sm">Oversee campus housing blocks, track occupancy, and allocate room blocks for students.</p>
        </div>
      </div>

      {/* Hostel Blocks Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in mt-2">
        {hostelBlocks.map((b, i) => {
          const occupancyRate = Math.round((b.occupiedBeds / b.totalBeds) * 100);
          return (
            <div key={i} className="card p-6 bg-brand-bg-secondary border border-brand-border rounded-2xl flex flex-col gap-4">
              <h3 className="m-0 font-display text-base font-bold text-brand-text-main">{b.blockName}</h3>
              <div className="text-[0.85rem] text-brand-text-muted flex flex-col gap-1.5">
                <div className="flex justify-between">
                  <span>Occupied Rooms:</span>
                  <strong className="text-brand-text-main">{b.occupiedRooms} / {b.totalRooms}</strong>
                </div>
                <div className="flex justify-between">
                  <span>Occupied Beds:</span>
                  <strong className="text-brand-text-main">{b.occupiedBeds} / {b.totalBeds}</strong>
                </div>
              </div>
              
              {/* Progress bar */}
              <div>
                <div className="flex justify-between text-[0.8rem] mb-1.5 text-brand-text-main">
                  <span>Occupancy rate</span>
                  <strong>{occupancyRate}%</strong>
                </div>
                <div className="h-1.5 bg-brand-bg-tertiary rounded-full overflow-hidden border border-brand-border/40">
                  <div className="bg-brand-primary h-full rounded-full transition-all duration-300" style={{ width: `${occupancyRate}%` }}></div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Room Allocations Log */}
      <div className="card p-6 bg-brand-bg-secondary border border-brand-border rounded-2xl animate-fade-in">
        <h3 className="mb-4 font-display text-lg font-bold text-brand-text-main">Active Room Allocations</h3>
        <div className="table-container overflow-x-auto relative">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-brand-border text-brand-text-subtle text-xs uppercase font-semibold">
                <th className="p-4">Student</th>
                <th className="p-4">Room No.</th>
                <th className="p-4">Status</th>
                <th className="p-4">Fee Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {roomAllocations.map(r => (
                <tr key={r.id} className="border-b border-brand-border hover:bg-white/[0.01] transition-colors text-sm text-brand-text-main">
                  <td className="p-4 font-semibold text-brand-text-main">{r.studentName}</td>
                  <td className="p-4 font-mono text-xs text-brand-text-muted">{r.roomNo}</td>
                  <td className="p-4"><span className="badge bg-brand-accent-emerald/10 text-brand-accent-emerald text-xs px-2 py-0.5 rounded">{r.status}</span></td>
                  <td className="p-4"><span className={`badge text-xs px-2 py-0.5 rounded ${r.feeStatus === 'Paid' ? 'bg-brand-accent-emerald/10 text-brand-accent-emerald' : 'bg-brand-accent-ruby/10 text-brand-accent-ruby'}`}>{r.feeStatus}</span></td>
                  <td className="p-4 text-right relative">
                    <button 
                      className="text-brand-text-muted hover:text-white p-2 rounded-lg transition-all focus:bg-brand-bg-tertiary cursor-pointer inline-flex items-center justify-center"
                      onClick={() => setActiveKebabId(activeKebabId === r.id ? null : r.id)}
                    >
                      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/></svg>
                    </button>
                    {activeKebabId === r.id && (
                      <div className="absolute right-4 top-12 bg-brand-bg-tertiary border border-brand-border rounded-xl shadow-2xl z-[100] w-36 text-left p-1.5 animate-scale-up">
                        <button 
                          className="w-full text-left px-3 py-2 text-xs font-semibold text-brand-accent-ruby hover:bg-brand-accent-ruby/10 rounded-lg cursor-pointer"
                          onClick={() => { setActiveKebabId(null); handleDeallocate(r.id, r.studentName); }}
                        >
                          Deallocate Room
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
    </div>
  );
}
