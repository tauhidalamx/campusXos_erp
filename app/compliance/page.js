'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  FileCheck, 
  ArrowLeft, 
  Plus, 
  Activity, 
  AlertTriangle, 
  CheckCircle2, 
  User, 
  ShieldAlert, 
  Scale, 
  TrendingUp,
  Bookmark,
  Send,
  Sparkles
} from 'lucide-react';

export default function CompliancePage() {
  const [policies, setPolicies] = useState([]);
  const [loading, setLoading] = useState(true);

  // Compliance checklist states
  const [checklist, setChecklist] = useState([
    { id: 1, task: 'Verify multi-sig administrative ledger keys rotating cycle', checked: true, note: 'Rotated on June 10.' },
    { id: 2, task: 'Confirm all student DIDs backed by Soulbound Credentials SBT', checked: true, note: 'Anchored to consortium block #92.' },
    { id: 3, task: 'Evaluate perimeter firewall audit logs for GDPR guidelines', checked: false, note: 'Awaiting auditor remarks.' },
    { id: 4, task: 'Verify tuition ledger sync matches financial billing nodes', checked: false, note: 'Pending reconciliation.' }
  ]);

  // Form states for adding new regulatory policies
  const [policyName, setPolicyName] = useState('');
  const [policyType, setPolicyType] = useState('Data Privacy');
  const [auditorName, setAuditorName] = useState('Compliance Officer');

  // Load policies
  const fetchPolicies = async () => {
    try {
      const res = await fetch('/api/compliance/policies');
      if (res.ok) {
        const data = await res.json();
        setPolicies(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPolicies();
  }, []);

  // Submit new policy
  const handleSubmitPolicy = async (e) => {
    e.preventDefault();
    if (!policyName.trim()) return;

    try {
      const res = await fetch('/api/compliance/policies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: policyName,
          type: policyType,
          auditor: auditorName,
          status: 'Compliant'
        })
      });

      if (res.ok) {
        setPolicyName('');
        fetchPolicies();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Toggle checklist task
  const toggleChecklistTask = (taskId) => {
    setChecklist(prev => prev.map(item => {
      if (item.id === taskId) {
        return { ...item, checked: !item.checked };
      }
      return item;
    }));
  };

  // Update auditor comment notes on checklist
  const updateChecklistNote = (taskId, text) => {
    setChecklist(prev => prev.map(item => {
      if (item.id === taskId) {
        return { ...item, note: text };
      }
      return item;
    }));
  };

  return (
    <div className="min-h-screen bg-[#071126] text-white p-6 font-sans">
      {/* Top Banner Navigation */}
      <div className="max-w-7xl mx-auto flex items-center justify-between mb-8 pb-4 border-b border-[#102043]">
        <div className="flex items-center gap-3">
          <Link href="/" className="p-2 bg-[#102043] rounded-xl hover:bg-[#1a2e5d] transition-all text-indigo-400">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-white via-indigo-200 to-indigo-400 bg-clip-text text-transparent">
              CAMPUSX Governance & Compliance Console
            </h1>
            <p className="text-xs text-slate-400">Regulatory policies database, active compliance audits & ethics checklists</p>
          </div>
        </div>

        <div className="flex gap-4 text-xs font-mono text-slate-400">
          <div className="flex items-center gap-1.5">
            <Scale className="w-4 h-4 text-indigo-400" /> Audit Rating: <span className="font-bold text-white">100% Compliant</span>
          </div>
        </div>
      </div>

      {/* Main Grid Workdesk */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column - checklist and comments manager (2 columns) */}
        <div className="lg:col-span-2 flex flex-col gap-6 text-left">
          
          {/* Active Checklist list */}
          <div className="p-6 bg-[#0B1736] border border-[#102043] rounded-3xl flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-[#102043] pb-3">
              <span className="text-xs font-bold text-white uppercase tracking-wider font-mono">Internal Compliance Checklist</span>
              <span className="text-[10px] text-slate-500">Tick items to toggling state and update remarks</span>
            </div>

            <div className="flex flex-col gap-3.5">
              {checklist.map((item) => (
                <div key={item.id} className="p-4 bg-black/30 border border-[#102043] rounded-2xl flex flex-col gap-3 text-xs transition-all hover:border-indigo-500/20">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-2.5">
                      <input
                        type="checkbox"
                        checked={item.checked}
                        onChange={() => toggleChecklistTask(item.id)}
                        className="mt-1 accent-indigo-500 cursor-pointer w-4 h-4"
                      />
                      <span className={`font-semibold leading-relaxed ${item.checked ? 'text-slate-400 line-through' : 'text-slate-200'}`}>
                        {item.task}
                      </span>
                    </div>
                    <span className={`px-2 py-0.5 rounded text-[8px] font-bold border uppercase shrink-0 ${
                      item.checked ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border-amber-500/20 animate-pulse'
                    }`}>
                      {item.checked ? 'Completed' : 'Pending Review'}
                    </span>
                  </div>

                  <div className="flex flex-col gap-1 text-[10px] text-slate-400">
                    <label className="uppercase font-bold text-slate-500 tracking-wider">Auditor Remarks</label>
                    <input
                      type="text"
                      value={item.note}
                      onChange={(e) => updateChecklistNote(item.id, e.target.value)}
                      placeholder="Input auditor remarks comments..."
                      className="bg-[#102043]/50 border border-[#102043] rounded-lg p-2 text-xs text-white outline-none focus:border-indigo-500 w-full"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column - Create policy form & policy listing directory */}
        <div className="flex flex-col gap-6 text-left">
          
          {/* Policy creation form */}
          <div className="p-6 bg-[#0B1736] border border-[#102043] rounded-3xl flex flex-col gap-4">
            <span className="text-xs font-bold text-white uppercase tracking-wider font-mono">Register Governance Policy</span>
            
            <form onSubmit={handleSubmitPolicy} className="flex flex-col gap-3 text-xs">
              <div className="flex flex-col gap-1.5">
                <label className="text-[9px] uppercase font-bold text-slate-400">Policy Name</label>
                <input
                  type="text"
                  placeholder="e.g. Identity SBT Escrow Lock rule"
                  value={policyName}
                  onChange={(e) => setPolicyName(e.target.value)}
                  className="bg-[#102043] border border-[#1a2e5d] rounded-xl p-2.5 text-white outline-none focus:border-indigo-500"
                  required
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[9px] uppercase font-bold text-slate-400">Policy Category</label>
                <select
                  value={policyType}
                  onChange={(e) => setPolicyType(e.target.value)}
                  className="bg-[#102043] border border-[#1a2e5d] rounded-xl p-2.5 text-white outline-none"
                >
                  <option value="Data Privacy">Data Privacy</option>
                  <option value="Academic Integrity">Academic Integrity</option>
                  <option value="Ledger Governance">Ledger Governance</option>
                  <option value="Financial Auditing">Financial Auditing</option>
                </select>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[9px] uppercase font-bold text-slate-400">Lead Auditor</label>
                <input
                  type="text"
                  value={auditorName}
                  onChange={(e) => setAuditorName(e.target.value)}
                  className="bg-[#102043] border border-[#1a2e5d] rounded-xl p-2.5 text-white outline-none focus:border-indigo-500"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-md"
              >
                <Plus className="w-4 h-4" /> Add Policy Document
              </button>
            </form>
          </div>

          {/* Active Policies directory list */}
          <div className="p-6 bg-[#0B1736] border border-[#102043] rounded-3xl flex flex-col gap-4">
            <span className="text-xs font-bold text-white uppercase tracking-wider font-mono">Registered Policies Index</span>
            
            {loading ? (
              <div className="text-xs text-slate-400 py-6 text-center">Loading policies...</div>
            ) : policies.length === 0 ? (
              <div className="text-xs text-slate-400 py-6 text-center">No policies indexed.</div>
            ) : (
              <div className="flex flex-col gap-3 max-h-[300px] overflow-y-auto pr-1">
                {policies.map((pol) => (
                  <div key={pol.id} className="p-3 bg-[#102043]/30 border border-[#102043] rounded-xl flex flex-col gap-1.5 text-xs">
                    <div className="flex justify-between items-start">
                      <span className="font-bold text-slate-200 leading-snug">{pol.name}</span>
                      <span className="px-1.5 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded text-[7px] font-bold font-mono">
                        {pol.status}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-[8.5px] text-slate-500 font-mono mt-1 border-t border-white/5 pt-1.5">
                      <span>Type: {pol.type}</span>
                      <span>Auditor: {pol.auditor}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
