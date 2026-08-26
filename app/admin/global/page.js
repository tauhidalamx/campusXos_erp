'use client';

import React, { useState, useEffect } from 'react';
import { Activity, ShieldAlert, Cpu, HardDrive, Cpu as Gpu, Terminal, RefreshCw, Layers } from 'lucide-react';

export default function GlobalSuperAdminDashboard() {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [k8sPods, setK8sPods] = useState([
    { name: 'campusx-core-api-84f5d', status: 'Running', cpu: '12%', ram: '256MB', restarts: 0 },
    { name: 'campusx-connect-webrtc-8a7e3', status: 'Running', cpu: '48%', ram: '812MB', restarts: 2 },
    { name: 'campusx-chain-validator-01', status: 'Active', cpu: '8%', ram: '512MB', restarts: 0 },
    { name: 'campusx-ai-copilot-model-c7b99', status: 'Running', cpu: '94%', ram: '2.4GB', restarts: 1 },
    { name: 'campusx-postgresql-primary-0', status: 'Online', cpu: '15%', ram: '1.2GB', restarts: 0 }
  ]);
  const [auditLogs, setAuditLogs] = useState([
    { id: 'log_9081', user: 'superadmin@campusx.demo', action: 'K8s Cluster Scale Up', target: 'campusx-connect-webrtc', ip: '10.244.0.1', timestamp: 'Just now' },
    { id: 'log_9078', user: 'registrar@campusx.demo', action: 'Degree Certificate Signed', target: 'STU006 PATEL', ip: '192.168.12.44', timestamp: '5 mins ago' },
    { id: 'log_9075', user: 'admin@campusx.demo', action: 'New Faculty Enrolled', target: 'Dr. Helen Vance', ip: '192.168.1.10', timestamp: '12 mins ago' }
  ]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const session = sessionStorage.getItem('campusx_erp_session');
      if (session) {
        setCurrentUser(JSON.parse(session));
      }
      setLoading(false);
    }
  }, []);

  const handleRefreshTele = () => {
    setK8sPods(pods => pods.map(p => ({
      ...p,
      cpu: `${Math.floor(Math.random() * 80) + 10}%`,
      ram: p.ram.includes('GB') ? `${(Math.random() * 1.5 + 1.5).toFixed(1)}GB` : `${Math.floor(Math.random() * 400) + 200}MB`
    })));
  };

  if (loading) return null;

  return (
    <div className="flex flex-col gap-6 md:gap-8 fade-in">
      {/* Dashboard Title */}
      <div className="flex justify-between items-center pb-4 border-b border-brand-border/40">
        <div>
          <h1 className="text-3xl font-display font-bold text-brand-text-main tracking-tight flex items-center gap-3">
            <Layers className="w-8 h-8 text-brand-accent-ruby" />
            Global Operations Command Center
          </h1>
          <p className="text-brand-text-muted text-sm mt-1">Global Super Admin console. Platform-wide telemetry, Kubernetes mesh, AI inference servers, and distributed ledgers.</p>
        </div>
        <button onClick={handleRefreshTele} className="btn btn-secondary btn-sm flex items-center gap-1.5 cursor-pointer">
          <RefreshCw className="w-4 h-4 animate-spin-hover" />
          Poll Telemetry
        </button>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card p-5 bg-brand-bg-secondary border border-brand-border rounded-2xl flex items-center justify-between">
          <div>
            <span className="text-brand-text-muted text-xs font-semibold">Active Tenants</span>
            <span className="block text-2xl font-bold font-display text-brand-text-main mt-1">12 Universities</span>
            <span className="text-[10px] text-brand-accent-emerald mt-1 block">✓ All nodes synchronized</span>
          </div>
          <div className="p-3 bg-brand-accent-emerald/10 rounded-xl text-brand-accent-emerald">
            <Activity className="w-6 h-6" />
          </div>
        </div>
        
        <div className="card p-5 bg-brand-bg-secondary border border-brand-border rounded-2xl flex items-center justify-between">
          <div>
            <span className="text-brand-text-muted text-xs font-semibold">Kubernetes Node Status</span>
            <span className="block text-2xl font-bold font-display text-brand-accent-cyan mt-1">Healthy</span>
            <span className="text-[10px] text-brand-accent-cyan mt-1 block">5 Active namespaces</span>
          </div>
          <div className="p-3 bg-brand-accent-cyan/10 rounded-xl text-brand-accent-cyan">
            <Cpu className="w-6 h-6" />
          </div>
        </div>

        <div className="card p-5 bg-brand-bg-secondary border border-brand-border rounded-2xl flex items-center justify-between">
          <div>
            <span className="text-brand-text-muted text-xs font-semibold">Global AI Inference Load</span>
            <span className="block text-2xl font-bold font-display text-brand-accent-amber mt-1">84% Capacity</span>
            <span className="text-[10px] text-brand-accent-amber mt-1 block">Active fine-tuning worker</span>
          </div>
          <div className="p-3 bg-brand-accent-amber/10 rounded-xl text-brand-accent-amber">
            <Gpu className="w-6 h-6" />
          </div>
        </div>

        <div className="card p-5 bg-brand-bg-secondary border border-brand-border rounded-2xl flex items-center justify-between">
          <div>
            <span className="text-brand-text-muted text-xs font-semibold">Security Alert Status</span>
            <span className="block text-2xl font-bold font-display text-brand-accent-ruby mt-1">0 Incidents</span>
            <span className="text-[10px] text-brand-accent-emerald mt-1 block">Shield Active (WAF Mode)</span>
          </div>
          <div className="p-3 bg-brand-accent-ruby/10 rounded-xl text-brand-accent-ruby animate-pulse">
            <ShieldAlert className="w-6 h-6" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Kubernetes Pod Monitoring */}
        <div className="card bg-brand-bg-secondary border border-brand-border rounded-2xl p-6 flex flex-col gap-4">
          <h3 className="text-lg font-bold font-display text-brand-text-main border-b border-brand-border/40 pb-3 flex items-center gap-2">
            <Cpu className="w-5 h-5 text-brand-accent-cyan" />
            Kubernetes Pod Orchestrator
          </h3>
          <div className="flex flex-col gap-3.5">
            {k8sPods.map(pod => (
              <div key={pod.name} className="flex justify-between items-center p-3 bg-brand-bg-tertiary/60 border border-brand-border/40 rounded-xl">
                <div className="flex flex-col min-w-0">
                  <span className="text-xs font-bold text-brand-text-main truncate font-mono">{pod.name}</span>
                  <span className="text-[10px] text-brand-text-muted mt-1">CPU: {pod.cpu} | Memory: {pod.ram}</span>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-[10px] font-semibold text-brand-text-subtle font-mono">Restarts: {pod.restarts}</span>
                  <span className="badge text-[10px] px-2 py-0.5 rounded bg-brand-accent-emerald/20 text-brand-accent-emerald">
                    {pod.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Global Security Audit Registry */}
        <div className="card bg-brand-bg-secondary border border-brand-border rounded-2xl p-6 flex flex-col gap-4">
          <h3 className="text-lg font-bold font-display text-brand-text-main border-b border-brand-border/40 pb-3 flex items-center gap-2">
            <Terminal className="w-5 h-5 text-brand-accent-ruby" />
            System Audit Log Register
          </h3>
          <div className="flex flex-col gap-3.5 overflow-y-auto max-h-[300px] chat-scroll">
            {auditLogs.map(log => (
              <div key={log.id} className="flex items-start justify-between p-3 border-b border-brand-border/20 text-xs">
                <div className="flex flex-col gap-1 text-xs">
                  <span className="font-bold text-brand-text-main">{log.action}</span>
                  <span className="text-brand-text-muted">Target: <code className="text-brand-accent-cyan font-mono text-[10px]">{log.target}</code></span>
                  <span className="text-[10px] text-brand-text-subtle">Operator: {log.user} | IP: {log.ip}</span>
                </div>
                <span className="text-[10px] text-brand-text-subtle shrink-0">{log.timestamp}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
