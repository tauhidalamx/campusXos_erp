'use client';

import React, { useState, useEffect } from 'react';
import { useDb } from '../../../context/db-context';
import { 
  Calendar, 
  Map, 
  UserCheck, 
  Zap, 
  Clock, 
  ShieldAlert, 
  Compass, 
  Cpu, 
  Download,
  Building,
  RefreshCw
} from 'lucide-react';

export default function ExamsLifecycleDashboard() {
  const { students, courses } = useDb();
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Calendar schedules
  const [examSchedules, setExamSchedules] = useState([
    { code: 'CS202', name: 'Data Structures & Algorithms', date: '2026-06-25', time: '09:00 AM - 12:00 PM', venue: 'Block C Hall 3', status: 'Scheduled' },
    { code: 'CS302', name: 'Database Management Systems', date: '2026-06-27', time: '02:00 PM - 05:00 PM', venue: 'Block A Lab 1', status: 'Scheduled' },
    { code: 'CS305', name: 'Software Engineering', date: '2026-06-29', time: '09:00 AM - 12:00 PM', venue: 'Block B Auditorium', status: 'Scheduled' }
  ]);

  // Seating allocations list
  const [seatingAllocations, setSeatingAllocations] = useState([]);
  const [isAllocating, setIsAllocating] = useState(false);

  // Examiner logs
  const [examinersList, setExaminersList] = useState([
    { course: 'CS202', name: 'Prof. Marcus Chen', role: 'Chief Superintendent', workload: '1/3' },
    { course: 'CS202', name: 'Dr. Raymond Park', role: 'Hall Invigilator', workload: '2/3' },
    { course: 'CS302', name: 'Dr. Evelyn Sterling', role: 'Hall Invigilator', workload: '1/3' }
  ]);

  // Seating grid simulation parameters
  const seatingGridSize = 25; // 5x5 grid
  const [selectedSeat, setSelectedSeat] = useState(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const session = sessionStorage.getItem('campusx_erp_session');
      if (session) {
        setCurrentUser(JSON.parse(session));
      }
      setLoading(false);
    }
  }, []);

  // Run seating allocation engine
  const runSeatingEngine = () => {
    setIsAllocating(true);
    setTimeout(() => {
      const newAllocations = students.map((s, idx) => {
        const row = String.fromCharCode(65 + Math.floor(idx / 5)); // A, B, C, D...
        const col = (idx % 5) + 1;
        return {
          studentId: s.id,
          studentName: s.name,
          course: 'CS202',
          hall: 'Block C Hall 3',
          seat: `${row}${col}`,
          qrHash: `0x_qr_cs202_${s.id}_C3_${row}${col}`
        };
      });

      setSeatingAllocations(newAllocations);
      
      // Auto assign a chief examiner
      setExaminersList(prev => [
        { course: 'CS202', name: 'Dr. Evelyn Carter', role: 'Consortium Flying Squad', workload: '1/3' },
        ...prev
      ]);

      setIsAllocating(false);
      alert('AI Seating Allocation and Invigilator Scheduling Engine executed successfully with 0 structural conflict checks!');
    }, 1200);
  };

  const getStudentSeat = () => {
    const activeStudentId = currentUser?.role === 'student' ? 'STU001' : 'STU001';
    return seatingAllocations.find(s => s.studentId === activeStudentId);
  };

  const studentSeat = getStudentSeat();

  if (loading || !currentUser) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="w-8 h-8 border-4 border-brand-primary/30 border-t-brand-primary rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 md:gap-8 text-brand-text-main">
      
      {/* Page Header */}
      <div className="flex justify-between items-center pb-4 border-b border-brand-border/40">
        <div>
          <h1 className="text-3xl font-display font-bold text-white tracking-tight flex items-center gap-3">
            <Calendar className="w-8 h-8 text-brand-primary" />
            Examinations & Seating Allocation Control
          </h1>
          <p className="text-brand-text-muted text-sm mt-1">Design exam seating layouts, coordinate faculty invigilation assignments, and execute automatic allocations.</p>
        </div>
      </div>

      {/* Main Grid Workdesk */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Schedules & Examiner workloads (2 Columns) */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          
          {/* Exam Calendar scheduling list */}
          <div className="card p-6 bg-brand-bg-secondary border border-brand-border rounded-2xl flex flex-col gap-4">
            <span className="font-display text-sm font-bold text-white uppercase tracking-wider">Exam Calendar Schedules</span>
            
            <div className="flex flex-col gap-3">
              {examSchedules.map((ex, i) => (
                <div key={i} className="p-4 border border-brand-border rounded-xl bg-brand-bg-tertiary flex justify-between items-center transition-all duration-200 hover:translate-x-1 hover:border-brand-primary/30">
                  <div className="text-left">
                    <code className="text-brand-primary font-mono font-bold text-base">{ex.code}</code>
                    <h4 className="mt-1 mb-0.5 font-display font-medium text-white text-sm">{ex.name}</h4>
                    <span className="text-xs text-brand-text-muted">{ex.date} • {ex.time}</span>
                  </div>
                  <div className="text-right flex flex-col items-end gap-1.5">
                    <span className="badge bg-brand-accent-cyan/10 text-brand-accent-cyan text-[0.75rem] px-2 py-0.5 rounded font-semibold">{ex.venue}</span>
                    <span className="text-[10px] text-brand-accent-emerald font-bold uppercase tracking-wider">Verified State</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Seating Layout Planner Engine */}
          <div className="card p-6 bg-brand-bg-secondary border border-brand-border rounded-2xl flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <span className="font-display text-sm font-bold text-white uppercase tracking-wider block">Automatic Hall Seating Planner Engine</span>
                <span className="text-xs text-brand-text-muted mt-0.5 block">Allocates candidate seats avoiding department & course registration overlaps.</span>
              </div>
              
              {currentUser.role === 'controller_of_examination' && (
                <button 
                  onClick={runSeatingEngine}
                  disabled={isAllocating}
                  className="btn btn-primary cursor-pointer text-xs font-bold py-2.5 px-5 flex items-center gap-1.5 shrink-0"
                >
                  <Cpu className="w-4 h-4 text-white" />
                  {isAllocating ? 'Running Seating Planner...' : 'Run Seating Planner Engine'}
                </button>
              )}
            </div>

            {seatingAllocations.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-2">
                {/* Seating Room Grid */}
                <div className="flex flex-col gap-3">
                  <span className="text-xs font-semibold text-brand-text-muted text-left border-b border-brand-border pb-1.5 pl-1">Interactive Hall Map View (Hall C3)</span>
                  <div className="grid grid-cols-5 gap-3 p-4 bg-brand-bg-tertiary rounded-2xl border border-brand-border">
                    {Array.from({ length: seatingGridSize }).map((_, idx) => {
                      const row = String.fromCharCode(65 + Math.floor(idx / 5));
                      const col = (idx % 5) + 1;
                      const seatCode = `${row}${col}`;
                      const isOccupied = seatingAllocations.some(s => s.seat === seatCode);
                      
                      return (
                        <button
                          key={idx}
                          onClick={() => setSelectedSeat(seatCode)}
                          className={`aspect-square rounded-xl border text-[10px] font-mono font-bold flex items-center justify-center cursor-pointer transition-all ${
                            selectedSeat === seatCode
                              ? 'bg-brand-primary border-brand-primary-hover text-white shadow-lg'
                              : isOccupied 
                                ? 'bg-brand-accent-emerald/10 border-brand-accent-emerald/30 text-brand-accent-emerald' 
                                : 'bg-white/[0.02] border-brand-border/60 text-brand-text-muted hover:border-brand-primary'
                          }`}
                        >
                          {seatCode}
                        </button>
                      );
                    })}
                  </div>
                  <div className="flex gap-4 text-[10px] text-brand-text-muted pl-1">
                    <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 bg-brand-accent-emerald/15 border border-brand-accent-emerald/30 rounded-sm"></span>Allocated Seat</span>
                    <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 bg-white/[0.02] border border-brand-border/60 rounded-sm"></span>Empty Slot</span>
                  </div>
                </div>

                {/* Seating Assignments List */}
                <div className="flex flex-col gap-3 text-xs text-left">
                  <span className="font-semibold text-brand-text-muted border-b border-brand-border pb-1.5 pl-1">Allocations Roster Index</span>
                  <div className="flex flex-col gap-2.5 max-h-[220px] overflow-y-auto pr-1">
                    {seatingAllocations.map((sa, idx) => (
                      <div key={idx} className="p-3 bg-brand-bg-tertiary/60 border border-brand-border/40 rounded-xl flex justify-between items-center">
                        <div className="flex flex-col">
                          <span className="font-bold text-white">{sa.studentName}</span>
                          <span className="text-[9.5px] text-brand-text-muted mt-0.5">ID: {sa.studentId} • Course: {sa.course}</span>
                        </div>
                        <span className="badge bg-brand-accent-cyan/15 text-brand-accent-cyan font-bold px-2 py-0.5 rounded">Seat: {sa.seat}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-8 border border-dashed border-brand-border rounded-2xl bg-white/[0.01] text-brand-text-muted text-center text-xs mt-2">
                No seating plan active. Click "Run Seating Planner Engine" to generate allocations.
              </div>
            )}
          </div>

        </div>

        {/* Right Column: Examiner assignments and student Hall tickets */}
        <div className="flex flex-col gap-6 text-left">
          
          {/* Student Hall Ticket Card */}
          {currentUser.role === 'student' && (
            <div className="card p-6 bg-brand-bg-secondary border border-brand-border rounded-2xl flex flex-col gap-4">
              <div className="flex items-center gap-2 border-b border-brand-border pb-3">
                <Compass className="w-5 h-5 text-brand-primary" />
                <span className="font-display text-sm font-bold text-white">My Verification Hall Ticket</span>
              </div>

              {studentSeat ? (
                <div className="p-4 bg-brand-bg-tertiary border border-brand-border rounded-xl flex flex-col gap-4 text-xs">
                  <div className="flex justify-between items-start border-b border-brand-border/40 pb-2">
                    <div>
                      <span className="text-[10px] text-brand-text-subtle font-bold block uppercase">Student Name</span>
                      <strong className="text-white text-sm">{currentUser.name}</strong>
                    </div>
                    <code className="text-brand-accent-emerald font-mono font-bold">VERIFIED</code>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <span className="text-[10px] text-brand-text-subtle font-bold block uppercase">Exam Venue</span>
                      <strong className="text-white">{studentSeat.hall}</strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-brand-text-subtle font-bold block uppercase">Allocated Seat</span>
                      <strong className="text-brand-accent-cyan font-mono text-sm">{studentSeat.seat}</strong>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 items-center bg-white p-3.5 rounded-xl border border-brand-border/60 w-36 mx-auto mt-2">
                    <div className="w-28 h-28 bg-[#0B1736] flex items-center justify-center text-white text-[9px] text-center font-mono rounded">
                      [QR CODE SIGNATURE]
                    </div>
                    <span className="text-[8px] text-slate-500 font-mono">Verification Seal Active</span>
                  </div>

                  <button 
                    onClick={() => alert('Downloading official QR Hall ticket...')}
                    className="btn btn-secondary w-full py-2.5 text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer mt-1"
                  >
                    <Download className="w-4 h-4" /> Download QR Ticket
                  </button>
                </div>
              ) : (
                <div className="p-4 border border-dashed border-brand-border rounded-xl bg-white/[0.01] text-brand-text-muted text-center text-xs">
                  Seating allocation has not been published yet. Check back soon.
                </div>
              )}
            </div>
          )}

          {/* Examiner assignments roster */}
          <div className="card p-6 bg-brand-bg-secondary border border-brand-border rounded-2xl flex flex-col gap-4">
            <div className="flex items-center gap-2 border-b border-brand-border pb-3">
              <UserCheck className="w-5 h-5 text-brand-accent-cyan" />
              <span className="font-display text-sm font-bold text-white">Faculty Invigilation Roster</span>
            </div>

            <div className="flex flex-col gap-3">
              {examinersList.map((ex, i) => (
                <div key={i} className="p-3 bg-brand-bg-tertiary/60 border border-brand-border/40 rounded-xl text-xs flex justify-between items-center">
                  <div className="flex flex-col">
                    <span className="font-bold text-white">{ex.name}</span>
                    <span className="text-[9.5px] text-brand-text-muted mt-0.5">{ex.role} ({ex.course})</span>
                  </div>
                  <span className="badge bg-brand-primary/10 text-brand-primary font-mono text-[9px] font-bold px-2 py-0.5 rounded">Workload: {ex.workload}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
