'use client';

import React from 'react';
import SuiteSidebar from '../components/SuiteSidebar';
import { ConnectProvider, useConnect } from '../ConnectContext';
import { CheckSquare, Clock, AlertCircle } from 'lucide-react';
import '../connect.css';

function TasksContent() {
  const { tasks } = useConnect();
  const taskList = tasks.length > 0 ? tasks : [
    { id: 't1', title: 'Submit CS Department Consensus Audit Report', due: 'Today, 5:00 PM', priority: 'High', status: 'In Progress' },
    { id: 't2', title: 'Review Midterm Grade Ledger Submissions', due: 'Tomorrow', priority: 'Medium', status: 'Pending' },
    { id: 't3', title: 'Approve Placement Cell Drive Schedule for Meta & Google', due: 'August 10', priority: 'High', status: 'Pending' }
  ];

  return (
    <div className="flex-1 p-6 overflow-y-auto max-w-[1400px] mx-auto w-full flex flex-col gap-6">
      <div className="pb-4 border-b border-brand-border/40">
        <h1 className="text-2xl font-display font-black text-brand-text-main flex items-center gap-2">
          Enterprise Task Board
          <CheckSquare className="w-5 h-5 text-brand-primary" />
        </h1>
        <p className="text-xs text-brand-text-muted mt-1">Authenticated user action items, department deadlines, and audit tasks</p>
      </div>

      <div className="flex flex-col gap-3">
        {taskList.map(t => (
          <div key={t.id} className="p-4 bg-brand-bg-secondary/60 backdrop-blur-xl border border-brand-border/60 rounded-2xl flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-3.5">
              <input type="checkbox" className="w-4 h-4 rounded border-brand-border text-brand-primary focus:ring-brand-primary cursor-pointer" />
              <div>
                <h3 className="text-xs font-bold text-brand-text-main">{t.title}</h3>
                <span className="text-[10px] text-brand-text-muted font-mono flex items-center gap-1 mt-0.5">
                  <Clock className="w-3 h-3 text-brand-primary" /> Due: {t.due}
                </span>
              </div>
            </div>
            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${t.priority === 'High' ? 'bg-rose-500/10 text-rose-500 border-rose-500/20' : 'bg-amber-500/10 text-amber-500 border-amber-500/20'}`}>
              {t.priority}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function TasksPage() {
  return (
    <ConnectProvider>
      <div className="flex h-screen bg-brand-bg-primary text-brand-text-main overflow-hidden font-sans select-none relative" style={{ paddingLeft: '80px' }}>
        <SuiteSidebar />
        <TasksContent />
      </div>
    </ConnectProvider>
  );
}
