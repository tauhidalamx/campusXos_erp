'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { 
  ShieldAlert, 
  ShieldCheck, 
  Radio, 
  Terminal, 
  Settings, 
  Activity, 
  Plus, 
  AlertTriangle, 
  CheckCircle2, 
  X, 
  ChevronRight, 
  ArrowLeft,
  Lock,
  Unlock,
  Cpu
} from 'lucide-react';

export default function SocPage() {
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [threatLevel, setThreatLevel] = useState('Normal'); // Normal, Elevated, Critical
  const [realtimeLogs, setRealtimeLogs] = useState([
    { id: 1, time: '20:42:01', msg: 'System integrity checker: ALL NODES COMPLIANT', type: 'info' },
    { id: 2, time: '20:42:04', msg: 'Core API Gateway processed authentication payload for registrar@campusx.demo', type: 'info' },
    { id: 3, time: '20:42:08', msg: 'Port scan alert: 12 attempts blocked on firewall boundary 10.0.1.25', type: 'warn' }
  ]);
  const [firewallPorts, setFirewallPorts] = useState([
    { port: 80, name: 'HTTP', status: 'Blocked' },
    { port: 443, name: 'HTTPS', status: 'Allowed' },
    { port: 5000, name: 'Express API Gateway', status: 'Allowed' },
    { port: 3000, name: 'Next.js Web Server', status: 'Allowed' },
    { port: 22, name: 'SSH', status: 'Blocked' },
    { port: 3306, name: 'Database MySQL', status: 'Blocked' }
  ]);

  // Form states
  const [newTitle, setNewTitle] = useState('');
  const [newSeverity, setNewSeverity] = useState('Medium');
  const [newOperator, setNewOperator] = useState('SecOps Team Beta');

  const logEndRef = useRef(null);

  // Fetch incidents
  const fetchIncidents = async () => {
    try {
      const res = await fetch('/api/soc/incidents');
      if (res.ok) {
        const data = await res.json();
        setIncidents(data);
      }
    } catch (err) {
      console.error('Failed to fetch incidents', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIncidents();
  }, []);

  // Generate periodic network logs
  useEffect(() => {
    const messages = [
      { msg: 'Consortium node sync height synced successfully.', type: 'info' },
      { msg: 'Rogue packets discarded on port 80.', type: 'warn' },
      { msg: 'Active user connection pool increased to 124 concurrent connections.', type: 'info' },
      { msg: 'Failed authentication check for admin@host.net IP logged.', type: 'warn' },
      { msg: 'Database backup cron job successfully compiled ledger.', type: 'info' },
      { msg: 'SSO provider certificate verification completed.', type: 'info' },
      { msg: 'Intrusion model inference latency at 2.41ms.', type: 'info' }
    ];

    const interval = setInterval(() => {
      const randomMsg = messages[Math.floor(Math.random() * messages.length)];
      const now = new Date();
      const timeStr = now.toTimeString().split(' ')[0];
      setRealtimeLogs(prev => [
        ...prev.slice(-15),
        { id: Date.now(), time: timeStr, msg: randomMsg.msg, type: randomMsg.type }
      ]);
    }, 4500);

    return () => clearInterval(interval);
  }, []);

  // Submit Incident
  const handleSubmitIncident = async (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    try {
      const res = await fetch('/api/soc/incidents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newTitle,
          severity: newSeverity,
          operator: newOperator,
          status: 'Open'
        })
      });

      if (res.ok) {
        setNewTitle('');
        fetchIncidents();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Toggle firewall rule
  const toggleFirewall = (portNumber) => {
    setFirewallPorts(prev => prev.map(p => {
      if (p.port === portNumber) {
        return { ...p, status: p.status === 'Allowed' ? 'Blocked' : 'Allowed' };
      }
      return p;
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
              CAMPUSX Cyber Security Center (SOC)
            </h1>
            <p className="text-xs text-slate-400">Intrusion Prevention system & Live Threat Assessment Hub</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 font-mono">Status Dashboard</span>
          <div className="flex gap-2">
            {['Normal', 'Elevated', 'Under Attack'].map(lvl => (
              <button
                key={lvl}
                onClick={() => setThreatLevel(lvl)}
                className={`px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase border transition-all cursor-pointer ${
                  threatLevel === lvl
                    ? lvl === 'Normal' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.3)]'
                      : lvl === 'Elevated' ? 'bg-amber-500/20 text-amber-400 border-amber-500/50 shadow-[0_0_15px_rgba(245,158,11,0.3)]'
                      : 'bg-rose-500/20 text-rose-400 border-rose-500/50 shadow-[0_0_15px_rgba(239,68,68,0.3)] animate-pulse'
                    : 'bg-[#0B1736] border-[#102043] text-slate-500 hover:text-slate-300'
                }`}
              >
                {lvl}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Grid Layout */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left column - Live Analytics & Network Telemetry */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          
          {/* Top Panel - Network Indicators */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-5 bg-[#0B1736] border border-[#102043] rounded-2xl flex items-center justify-between">
              <div className="text-left">
                <span className="text-[9px] uppercase font-bold text-slate-500 tracking-wider">Firewall Status</span>
                <p className="text-lg font-bold text-emerald-400 mt-1 flex items-center gap-1.5">
                  <ShieldCheck className="w-5 h-5 text-emerald-400" /> Active Enclave
                </p>
                <span className="text-[9px] text-slate-400">Zero packet leakage logged</span>
              </div>
            </div>
            
            <div className="p-5 bg-[#0B1736] border border-[#102043] rounded-2xl flex items-center justify-between">
              <div className="text-left">
                <span className="text-[9px] uppercase font-bold text-slate-500 tracking-wider">Active Threats Simulated</span>
                <p className="text-lg font-bold text-white mt-1 font-mono">
                  {threatLevel === 'Normal' ? '0' : threatLevel === 'Elevated' ? '3' : '14'}
                </p>
                <span className="text-[9px] text-slate-400">Rule blocks dynamically allocated</span>
              </div>
            </div>

            <div className="p-5 bg-[#0B1736] border border-[#102043] rounded-2xl flex items-center justify-between">
              <div className="text-left">
                <span className="text-[9px] uppercase font-bold text-slate-500 tracking-wider">Telemetry Latency</span>
                <p className="text-lg font-bold text-indigo-400 mt-1 font-mono">1.19 ms</p>
                <span className="text-[9px] text-slate-400">AI Inference model synchronized</span>
              </div>
            </div>
          </div>

          {/* Core Interactive - Security Incidents Ticket Manager */}
          <div className="p-6 bg-[#0B1736] border border-[#102043] rounded-3xl flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-[#102043] pb-3">
              <div className="text-left">
                <h3 className="text-sm font-bold uppercase tracking-wider font-mono text-indigo-300">Live Security Incidents Desk</h3>
                <p className="text-xs text-slate-400">Manage, delegate, and resolve flagged threat vectors</p>
              </div>
              <Activity className="w-5 h-5 text-indigo-400 animate-pulse" />
            </div>

            {/* Form to submit a new ticket */}
            <form onSubmit={handleSubmitIncident} className="grid grid-cols-1 md:grid-cols-4 gap-3 p-4 bg-[#102043]/30 border border-[#102043] rounded-2xl">
              <div className="md:col-span-2 flex flex-col gap-1 text-left">
                <label className="text-[9px] uppercase font-bold text-slate-400">Alert Title</label>
                <input
                  type="text"
                  placeholder="e.g. DDoS reflection spikes detected"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="bg-[#0B1736] border border-[#102043] rounded-xl p-2 text-xs text-white outline-none focus:border-indigo-500"
                  required
                />
              </div>
              <div className="flex flex-col gap-1 text-left">
                <label className="text-[9px] uppercase font-bold text-slate-400">Severity</label>
                <select
                  value={newSeverity}
                  onChange={(e) => setNewSeverity(e.target.value)}
                  className="bg-[#0B1736] border border-[#102043] rounded-xl p-2 text-xs text-white outline-none"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                  <option value="Critical">Critical</option>
                </select>
              </div>
              <button
                type="submit"
                className="mt-4 md:mt-0 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-colors self-end h-9 cursor-pointer"
              >
                <Plus className="w-4 h-4" /> Open Ticket
              </button>
            </form>

            {/* Incidents Table */}
            {loading ? (
              <div className="text-center py-6 text-slate-400 text-xs">Loading threat incidents...</div>
            ) : incidents.length === 0 ? (
              <div className="text-center py-6 text-slate-400 text-xs">All systems secure. No incidents open.</div>
            ) : (
              <div className="overflow-x-auto border border-[#102043] rounded-2xl">
                <table className="w-full text-xs text-left">
                  <thead>
                    <tr className="bg-[#102043]/40 border-b border-[#102043] text-slate-400 font-bold uppercase">
                      <th className="p-3.5">ID</th>
                      <th className="p-3.5">Threat incident details</th>
                      <th className="p-3.5">Severity</th>
                      <th className="p-3.5">Operator Assigned</th>
                      <th className="p-3.5">Timestamp</th>
                    </tr>
                  </thead>
                  <tbody>
                    {incidents.map((inc) => (
                      <tr key={inc.id} className="border-b border-[#102043] hover:bg-white/[0.01] transition-all">
                        <td className="p-3.5 font-mono text-indigo-300 font-bold">{inc.id}</td>
                        <td className="p-3.5">
                          <p className="font-semibold text-slate-200">{inc.title}</p>
                        </td>
                        <td className="p-3.5">
                          <span className={`px-2 py-0.5 rounded text-[8px] font-bold border uppercase ${
                            inc.severity === 'Critical' ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' :
                            inc.severity === 'High' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                            inc.severity === 'Medium' ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' :
                            'bg-slate-500/10 text-slate-400 border-slate-500/20'
                          }`}>
                            {inc.severity}
                          </span>
                        </td>
                        <td className="p-3.5 text-slate-300 font-medium">{inc.operator}</td>
                        <td className="p-3.5 text-slate-400 font-mono text-[10px]">
                          {inc.created_at ? new Date(inc.created_at).toLocaleTimeString() : 'N/A'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Right column - Firewall ports & live telemetry scroll logs */}
        <div className="flex flex-col gap-6">
          
          {/* Firewall Rules Panel */}
          <div className="p-6 bg-[#0B1736] border border-[#102043] rounded-3xl flex flex-col gap-4 text-left">
            <span className="text-xs font-bold text-white uppercase tracking-wider font-mono">Edge Firewall Ports</span>
            <div className="flex flex-col gap-2.5">
              {firewallPorts.map((rule) => (
                <div key={rule.port} className="flex items-center justify-between p-3 bg-[#102043]/30 border border-[#102043] rounded-xl text-xs">
                  <div>
                    <span className="font-bold font-mono text-indigo-300">Port {rule.port}</span>
                    <p className="text-[10px] text-slate-400 mt-0.5">{rule.name}</p>
                  </div>
                  <button
                    onClick={() => toggleFirewall(rule.port)}
                    className={`px-3 py-1 rounded-xl text-[10px] font-bold uppercase transition-all cursor-pointer flex items-center gap-1 ${
                      rule.status === 'Allowed'
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                    }`}
                  >
                    {rule.status === 'Allowed' ? <Unlock className="w-3 h-3" /> : <Lock className="w-3 h-3" />}
                    {rule.status}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Telemetry Scroll logs */}
          <div className="p-6 bg-[#0B1736] border border-[#102043] rounded-3xl flex flex-col gap-4 text-left">
            <span className="text-xs font-bold text-white uppercase tracking-wider font-mono">SecOps Console Stream</span>
            <div className="h-56 bg-black/40 border border-[#102043] rounded-2xl p-4 font-mono text-[10px] leading-relaxed overflow-y-auto flex flex-col gap-1.5">
              {realtimeLogs.map((log) => (
                <div key={log.id} className="flex gap-2">
                  <span className="text-slate-500">[{log.time}]</span>
                  <span className={log.type === 'warn' ? 'text-amber-400' : 'text-emerald-400'}>
                    {log.type === 'warn' ? '▲' : '✓'}
                  </span>
                  <span className="text-slate-300 flex-1 break-all">{log.msg}</span>
                </div>
              ))}
              <div ref={logEndRef} />
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
