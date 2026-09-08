'use client';

import React, { useState } from 'react';
import { useConnect } from '../ConnectContext';
import { 
  CheckSquare, 
  Clock, 
  User, 
  Plus, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle, 
  Search,
  Filter,
  Layers,
  ChevronDown
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function TasksView() {
  const { tasks, updateTaskStatus, setIsModalOpen, setModalTab, users, currentUser } = useConnect();
  const [searchQuery, setSearchQuery] = useState('');
  const [assigneeFilter, setAssigneeFilter] = useState('');

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = !searchQuery || 
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      (task.description && task.description.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesAssignee = !assigneeFilter || task.assignee_id === assigneeFilter;
    return matchesSearch && matchesAssignee;
  });

  const todoTasks = filteredTasks.filter(t => t.status === 'todo' || t.status === 'pending');
  const inProgressTasks = filteredTasks.filter(t => t.status === 'in_progress');
  const doneTasks = filteredTasks.filter(t => t.status === 'done' || t.status === 'completed');

  const getAssigneeInfo = (assigneeId) => {
    return users.find(u => u.id === assigneeId) || null;
  };

  const renderTaskCard = (task) => {
    const assignee = getAssigneeInfo(task.assignee_id);
    const createdDate = task.created_at ? new Date(task.created_at).toLocaleDateString([], { month: 'short', day: 'numeric' }) : 'Recent';
    const isDone = task.status === 'done' || task.status === 'completed';
    const isInProgress = task.status === 'in_progress';

    return (
      <motion.div
        layout
        key={task.id}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="p-4 rounded-xl bg-white border border-slate-100 shadow-sm hover:shadow-md transition-shadow mb-3 text-left font-sans"
      >
        {/* Card Header */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <h4 className="text-sm font-semibold text-slate-800 leading-snug break-words flex-1">
            {task.title}
          </h4>
          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider flex-shrink-0 ${
            isDone
              ? 'bg-emerald-50 text-emerald-600'
              : isInProgress
                ? 'bg-blue-50 text-blue-600'
                : 'bg-amber-50 text-amber-600'
          }`}>
            {isDone ? 'Done' : isInProgress ? 'In Progress' : 'To Do'}
          </span>
        </div>

        {/* Task Body */}
        {task.description ? (
          <p className="text-xs text-slate-500 mb-3 font-mono leading-relaxed line-clamp-2">
            {task.description}
          </p>
        ) : (
          <div className="text-xs text-slate-400 mb-3 font-mono">
            {`#task_${task.id.slice(-6)}`}
          </div>
        )}

        {/* Card Action Footer */}
        <div className="flex items-center justify-between gap-2 mt-2 pt-2.5 border-t border-slate-100 text-xs">
          <div className="flex items-center gap-1.5 text-slate-400 min-w-0 flex-1 truncate">
            {assignee ? (
              <div className="flex items-center gap-1.5 min-w-0 truncate" title={`Assigned to ${assignee.name}`}>
                <img 
                  src={assignee.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'} 
                  alt={assignee.name} 
                  className="w-5 h-5 rounded-full object-cover border border-slate-200 shrink-0" 
                />
                <span className="font-medium text-slate-700 truncate text-[11px]">{assignee.name.split(' ')[0]}</span>
              </div>
            ) : (
              <div className="flex items-center gap-1 text-slate-400 shrink-0 text-[11px]">
                <User className="w-3.5 h-3.5" />
                <span>Unassigned</span>
              </div>
            )}
            <span className="text-[10px] text-slate-400 shrink-0">• {createdDate}</span>
          </div>

          {/* Action Links */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {task.status !== 'todo' && task.status !== 'pending' && (
              <button
                onClick={() => updateTaskStatus(task.id, 'todo')}
                className="px-2.5 py-1 rounded-md text-slate-600 hover:bg-slate-100 font-medium cursor-pointer transition-colors text-[11px]"
                title="Move to To Do"
              >
                To Do
              </button>
            )}
            {task.status !== 'in_progress' && (
              <button
                onClick={() => updateTaskStatus(task.id, 'in_progress')}
                className="px-2.5 py-1 rounded-md text-blue-600 hover:bg-blue-50 font-medium cursor-pointer transition-colors text-[11px]"
                title="Move to In Progress"
              >
                Start
              </button>
            )}
            {task.status !== 'done' && task.status !== 'completed' && (
              <button
                onClick={() => updateTaskStatus(task.id, 'done')}
                className="px-2.5 py-1 rounded-md text-emerald-600 hover:bg-emerald-50 font-medium cursor-pointer transition-colors text-[11px]"
                title="Mark Completed"
              >
                Done
              </button>
            )}
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="w-full flex flex-col bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden text-left font-sans">
      
      {/* 2. Header & Action Row */}
      <div className="px-6 sm:px-8 pt-6 pb-4 border-b border-slate-100/80 bg-white flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <CheckSquare className="w-6 h-6 text-emerald-600 flex-shrink-0" />
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">Campus Task Matrix</h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Collaborate on department deliverables, research milestones, and academic task boards.
          </p>
        </div>

        <button
          onClick={() => {
            setModalTab('task');
            setIsModalOpen(true);
          }}
          className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all flex-shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Create Task
        </button>
      </div>

      {/* 3. Search & Assignee Filter Controls */}
      <div className="px-6 sm:px-8 py-4 flex items-center gap-4 bg-white border-b border-slate-100">
        {/* Task Search Field - Distinct separated icon and text */}
        <div className="flex-1 flex items-center bg-slate-50 border border-slate-200/80 rounded-xl px-3.5 py-2.5 gap-2.5 focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500 focus-within:bg-white transition-all">
          <Search className="w-4 h-4 text-slate-400 shrink-0 pointer-events-none" />
          <input
            type="text"
            placeholder="Search tasks by title or details..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 bg-transparent border-none outline-none text-xs sm:text-sm text-slate-700 placeholder:text-slate-400 p-0 font-medium min-w-0"
          />
        </div>

        {/* Assignee Dropdown */}
        <div className="relative">
          <select
            value={assigneeFilter}
            onChange={(e) => setAssigneeFilter(e.target.value)}
            className="h-[42px] px-4 py-2 pr-8 bg-slate-50 border border-slate-200/80 rounded-xl text-xs sm:text-sm text-slate-700 font-medium flex items-center justify-between gap-3 min-w-[160px] cursor-pointer hover:bg-slate-100/70 transition-colors appearance-none outline-none focus:border-blue-500"
          >
            <option value="">All Assignees</option>
            {users.map(u => (
              <option key={u.id} value={u.id}>{u.name} ({u.role.toUpperCase()})</option>
            ))}
          </select>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
      </div>

      {/* 4. Kanban Columns & Board Layout */}
      <div className="px-8 py-6 grid grid-cols-1 md:grid-cols-3 gap-6 items-start min-h-[calc(100vh-14rem)] pb-32">
        
        {/* Column 1: To Do */}
        <div className="bg-slate-50/70 rounded-2xl p-4 border border-slate-200/60 min-h-[520px] flex flex-col">
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-200/60">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-600">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 flex-shrink-0" />
              <span>To Do</span>
            </div>
            <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-white border border-slate-200 text-slate-500">
              {todoTasks.length}
            </span>
          </div>

          <div className="flex-1 flex flex-col">
            {todoTasks.length > 0 ? (
              todoTasks.map(renderTaskCard)
            ) : (
              <div className="flex-1 border-2 border-dashed border-slate-200 rounded-xl flex items-center justify-center p-6 text-slate-400 text-xs font-medium">
                No tasks to do
              </div>
            )}
          </div>
        </div>

        {/* Column 2: In Progress */}
        <div className="bg-slate-50/70 rounded-2xl p-4 border border-slate-200/60 min-h-[520px] flex flex-col">
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-200/60">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-600">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500 flex-shrink-0" />
              <span>In Progress</span>
            </div>
            <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-white border border-slate-200 text-slate-500">
              {inProgressTasks.length}
            </span>
          </div>

          <div className="flex-1 flex flex-col">
            {inProgressTasks.length > 0 ? (
              inProgressTasks.map(renderTaskCard)
            ) : (
              <div className="flex-1 border-2 border-dashed border-slate-200 rounded-xl flex items-center justify-center p-6 text-slate-400 text-xs font-medium">
                No tasks in progress
              </div>
            )}
          </div>
        </div>

        {/* Column 3: Completed */}
        <div className="bg-slate-50/70 rounded-2xl p-4 border border-slate-200/60 min-h-[520px] flex flex-col">
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-200/60">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-600">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 flex-shrink-0" />
              <span>Completed</span>
            </div>
            <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-white border border-slate-200 text-slate-500">
              {doneTasks.length}
            </span>
          </div>

          <div className="flex-1 flex flex-col">
            {doneTasks.length > 0 ? (
              doneTasks.map(renderTaskCard)
            ) : (
              <div className="flex-1 border-2 border-dashed border-slate-200 rounded-xl flex items-center justify-center p-6 text-slate-400 text-xs font-medium">
                No completed tasks
              </div>
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
