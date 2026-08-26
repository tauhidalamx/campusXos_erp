'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ToggleLeft, Key, Settings, BarChart2, ShieldCheck, CreditCard, Users, Landmark, Plus, Trash2, ShieldAlert } from 'lucide-react';

function PlatformAdminDashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeTab = searchParams.get('tab') || 'overview';

  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initial State Data
  const [keys, setKeys] = useState([
    { id: 'key_1', client: 'Model University (ERP Portal)', key: 'campusx_pk_live_f843g...', type: 'Publishable', status: 'Active' },
    { id: 'key_2', client: 'CampusX Web3 Validator Node', key: 'campusx_sk_live_29kd9...', type: 'Secret', status: 'Active' },
    { id: 'key_3', client: 'CampusX Connect WebRTC Service', key: 'campusx_sk_live_83jc1...', type: 'Secret', status: 'Active' }
  ]);
  const [integrations, setIntegrations] = useState([
    { id: 'int_1', name: 'Google SSO Authentication', type: 'OAuth 2.0', status: 'Enabled' },
    { id: 'int_2', name: 'Microsoft SSO Authentication', type: 'SAML 2.0', status: 'Enabled' },
    { id: 'int_3', name: 'Stripe Payment Gateway', type: 'REST Webhook', status: 'Enabled' },
    { id: 'int_4', name: 'Ethereum/Polygon RPC Node', type: 'JSON-RPC WebSockets', status: 'Disabled' }
  ]);
  const [tenants, setTenants] = useState([
    { id: 'ten_1', name: 'Model University', domain: 'model.campusx.edu', plan: 'Enterprise Suite', status: 'Active', members: 4200, billingCycle: 'Monthly' },
    { id: 'ten_2', name: 'CampusX Sports Academy', domain: 'sports.campusx.edu', plan: 'Sports Custom', status: 'Active', members: 850, billingCycle: 'Annual' },
    { id: 'ten_3', name: 'CampusX Medical School', domain: 'med.campusx.edu', plan: 'Enterprise Suite', status: 'Active', members: 1200, billingCycle: 'Monthly' },
    { id: 'ten_4', name: 'CampusX Web3 Consortium', domain: 'web3.campusx.edu', plan: 'Core Dev Platform', status: 'Active', members: 310, billingCycle: 'Annual' },
    { id: 'ten_5', name: 'CampusX Engineering Institute', domain: 'eng.campusx.edu', plan: 'Pro Tier', status: 'Pending Setup', members: 0, billingCycle: 'Monthly' }
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

  const isAdmin = currentUser && (currentUser.role === 'admin' || currentUser.role === 'superadmin' || currentUser.role === 'platformadmin');

  const handleToggleIntegration = (id) => {
    if (!isAdmin) {
      alert('Action unauthorized: admin credentials required.');
      return;
    }
    setIntegrations(prev => prev.map(int => int.id === id ? { ...int, status: int.status === 'Enabled' ? 'Disabled' : 'Enabled' } : int));
  };

  const handleRollKey = (id) => {
    if (!isAdmin) {
      alert('Action unauthorized: admin credentials required.');
      return;
    }
    setKeys(prev => prev.map(k => k.id === id ? { ...k, key: k.key.replace('live_', 'live_rolled_') } : k));
    alert('API key successfully rolled. All instances must migrate to the new secret key within 24 hours.');
  };

  const handleToggleTenantStatus = (id) => {
    if (!isAdmin) {
      alert('Action unauthorized: admin credentials required.');
      return;
    }
    setTenants(prev => prev.map(t => t.id === id ? { ...t, status: t.status === 'Active' ? 'Suspended' : 'Active' } : t));
  };

  if (loading) return null;

  return (
    <div className="flex flex-col gap-6 md:gap-8 fade-in">
      {/* Page Header */}
      <div className="flex justify-between items-center pb-4 border-b border-brand-border/40">
        <div>
          <h1 className="text-3xl font-display font-bold text-white tracking-tight flex items-center gap-3">
            <Settings className="w-8 h-8 text-brand-accent-amber" />
            Platform Control Center
          </h1>
          <p className="text-brand-text-muted text-sm mt-1">Tenant subscription management, API gateway permissions, integration controllers, and support registries.</p>
        </div>
        <div className="text-xs text-brand-text-muted bg-brand-bg-secondary border border-brand-border px-3 py-1.5 rounded-xl">
          Active Tab: <span className="text-brand-accent-amber font-mono font-bold capitalize">{activeTab}</span>
        </div>
      </div>

      {!isAdmin && (
        <div className="p-4 bg-brand-primary/10 border border-brand-primary/30 rounded-2xl flex items-center gap-3 text-brand-primary text-xs mt-2">
          <ShieldAlert className="w-5.5 h-5.5 text-brand-accent-amber shrink-0 animate-pulse" />
          <div>
            <span className="font-bold text-white block">Institutional Platform Hub (Read-Only)</span>
            <span className="text-brand-text-muted mt-0.5 block">Your account role ({currentUser?.role?.toUpperCase()}) has read-only access to inspect current university domain nodes, active gateway telemetry, and platform integrations.</span>
          </div>
        </div>
      )}

      {/* KPI Info cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div 
          onClick={() => router.push('/admin/platform?tab=subscriptions')}
          className={`card p-5 bg-brand-bg-secondary border rounded-2xl flex items-center justify-between cursor-pointer transition-all hover:border-brand-primary/60 ${activeTab === 'subscriptions' ? 'border-brand-primary/80 shadow-md shadow-brand-primary/10' : 'border-brand-border'}`}
        >
          <div>
            <span className="text-brand-text-muted text-xs font-semibold">Active Subscriptions</span>
            <span className="block text-2xl font-bold font-display text-white mt-1">{tenants.filter(t => t.status === 'Active').length} Tenants</span>
            <span className="text-[10px] text-brand-accent-emerald mt-1 block">Enterprise Level Support</span>
          </div>
          <div className="p-3 bg-brand-accent-emerald/10 rounded-xl text-brand-accent-emerald">
            <CreditCard className="w-6 h-6" />
          </div>
        </div>

        <div 
          onClick={() => router.push('/admin/platform?tab=gateway')}
          className={`card p-5 bg-brand-bg-secondary border rounded-2xl flex items-center justify-between cursor-pointer transition-all hover:border-brand-primary/60 ${activeTab === 'gateway' ? 'border-brand-primary/80 shadow-md shadow-brand-primary/10' : 'border-brand-border'}`}
        >
          <div>
            <span className="text-brand-text-muted text-xs font-semibold">Total API Calls (24h)</span>
            <span className="block text-2xl font-bold font-display text-brand-accent-cyan mt-1">842,901 Requests</span>
            <span className="text-[10px] text-brand-accent-cyan mt-1 block">Avg latency: 12ms</span>
          </div>
          <div className="p-3 bg-brand-accent-cyan/10 rounded-xl text-brand-accent-cyan">
            <BarChart2 className="w-6 h-6" />
          </div>
        </div>

        <div 
          onClick={() => router.push('/admin/platform?tab=integrations')}
          className={`card p-5 bg-brand-bg-secondary border rounded-2xl flex items-center justify-between cursor-pointer transition-all hover:border-brand-primary/60 ${activeTab === 'integrations' ? 'border-brand-primary/80 shadow-md shadow-brand-primary/10' : 'border-brand-border'}`}
        >
          <div>
            <span className="text-brand-text-muted text-xs font-semibold">Gateway Status</span>
            <span className="block text-2xl font-bold font-display text-brand-accent-emerald mt-1">100% Operational</span>
            <span className="text-[10px] text-brand-accent-emerald mt-1 block">Zero route drops</span>
          </div>
          <div className="p-3 bg-brand-accent-emerald/10 rounded-xl text-brand-accent-emerald">
            <ShieldCheck className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* VIEW: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="card bg-brand-bg-secondary border border-brand-border rounded-2xl p-6 flex flex-col gap-4">
            <h3 className="text-lg font-bold font-display text-white border-b border-brand-border/40 pb-3 flex items-center gap-2">
              <Landmark className="w-5 h-5 text-brand-accent-emerald" />
              Tenant Directory Summary
            </h3>
            <div className="flex flex-col gap-3">
              {tenants.map(t => (
                <div key={t.id} className="p-3 bg-brand-bg-tertiary/60 border border-brand-border/40 rounded-xl flex justify-between items-center text-xs">
                  <div className="flex flex-col">
                    <span className="font-bold text-white">{t.name}</span>
                    <span className="text-brand-text-muted font-mono mt-0.5">{t.domain}</span>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                    t.status === 'Active' ? 'bg-brand-accent-emerald/20 text-brand-accent-emerald' : 'bg-brand-accent-amber/20 text-brand-accent-amber'
                  }`}>
                    {t.status}
                  </span>
                </div>
              ))}
              <button onClick={() => router.push('/admin/platform?tab=subscriptions')} className="btn btn-secondary w-full py-2.5 text-xs text-center border border-brand-border hover:border-brand-primary text-white bg-transparent rounded-xl mt-2 cursor-pointer">
                {isAdmin ? 'Manage Tenant Subscriptions' : 'View Tenant Subscriptions'}
              </button>
            </div>
          </div>

          <div className="card bg-brand-bg-secondary border border-brand-border rounded-2xl p-6 flex flex-col gap-4">
            <h3 className="text-lg font-bold font-display text-white border-b border-brand-border/40 pb-3 flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-brand-accent-ruby" />
              Platform Diagnostics
            </h3>
            <div className="flex flex-col gap-3.5 text-xs">
              <div className="flex justify-between items-center border-b border-brand-border/20 pb-2.5">
                <span className="text-brand-text-muted">Database Connection Status:</span>
                <span className="text-brand-accent-emerald font-bold font-mono">CONNECTED</span>
              </div>
              <div className="flex justify-between items-center border-b border-brand-border/20 pb-2.5">
                <span className="text-brand-text-muted">SSO Identity Broker Ping:</span>
                <span className="text-brand-accent-emerald font-bold font-mono">OK (42ms)</span>
              </div>
              <div className="flex justify-between items-center border-b border-brand-border/20 pb-2.5">
                <span className="text-brand-text-muted">Kafka Event Pipeline Latency:</span>
                <span className="text-brand-accent-cyan font-bold font-mono">1.8ms</span>
              </div>
              <div className="flex justify-between items-center pb-1">
                <span className="text-brand-text-muted">Active Platform Version:</span>
                <span className="text-brand-text-main font-mono">v4.12.0-Production</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW: TENANT SUBSCRIPTIONS */}
      {activeTab === 'subscriptions' && (
        <div className="card bg-brand-bg-secondary border border-brand-border rounded-2xl p-6 flex flex-col gap-4">
          <div className="flex justify-between items-center border-b border-brand-border/40 pb-3">
            <h3 className="text-lg font-bold font-display text-white flex items-center gap-2">
              <Landmark className="w-5 h-5 text-brand-accent-emerald" />
              Tenant Subscription Console
            </h3>
            {isAdmin ? (
              <button onClick={() => alert('Add Tenant wizard initialized.')} className="btn btn-primary btn-sm flex items-center gap-1.5 cursor-pointer px-3.5 py-1.5 text-xs text-white rounded-lg">
                <Plus className="w-4 h-4" /> Add Tenant
              </button>
            ) : (
              <span className="text-xs text-brand-text-subtle font-mono border border-brand-border px-2.5 py-1.5 rounded-lg bg-brand-bg-tertiary">
                Tenant Operations Restricted
              </span>
            )}
          </div>
          <div className="table-container rounded-xl border border-brand-border overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-brand-border bg-brand-bg-primary/40 text-brand-text-subtle font-semibold uppercase">
                  <th className="p-3">Tenant Name</th>
                  <th className="p-3">Domain</th>
                  <th className="p-3">Subscription Plan</th>
                  <th className="p-3">Active Members</th>
                  <th className="p-3">Billing</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {tenants.map(t => (
                  <tr key={t.id} className="border-b border-brand-border hover:bg-white/[0.01]">
                    <td className="p-3 font-bold text-white">{t.name}</td>
                    <td className="p-3 font-mono text-brand-text-muted">{t.domain}</td>
                    <td className="p-3 font-semibold text-brand-accent-cyan">{t.plan}</td>
                    <td className="p-3 text-brand-text-main">{t.members.toLocaleString()} users</td>
                    <td className="p-3 text-brand-text-muted">{t.billingCycle}</td>
                    <td className="p-3 text-right">
                      <div className="flex gap-2 justify-end">
                        {isAdmin ? (
                          <button 
                            onClick={() => handleToggleTenantStatus(t.id)} 
                            className={`btn btn-xs py-1 px-2.5 rounded-lg cursor-pointer ${
                              t.status === 'Active' 
                                ? 'bg-brand-accent-amber/20 text-brand-accent-amber hover:bg-brand-accent-amber/30 border border-brand-accent-amber/30' 
                                : 'bg-brand-accent-emerald/20 text-brand-accent-emerald hover:bg-brand-accent-emerald/30 border border-brand-accent-emerald/30'
                            }`}
                          >
                            {t.status === 'Active' ? 'Suspend' : 'Activate'}
                          </button>
                        ) : (
                          <span className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${
                            t.status === 'Active' 
                              ? 'border-brand-accent-emerald/30 text-brand-accent-emerald bg-brand-accent-emerald/10' 
                              : 'border-brand-accent-amber/30 text-brand-accent-amber bg-brand-accent-amber/10'
                          }`}>
                            {t.status}
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* VIEW: API KEY GATEWAY */}
      {activeTab === 'gateway' && (
        <div className="card bg-brand-bg-secondary border border-brand-border rounded-2xl p-6 flex flex-col gap-4">
          <h3 className="text-lg font-bold font-display text-white border-b border-brand-border/40 pb-3 flex items-center gap-2">
            <Key className="w-5 h-5 text-brand-accent-cyan" />
            API Key Gateway
          </h3>
          <div className="flex flex-col gap-4">
            {keys.map(k => (
              <div key={k.id} className="p-4 bg-brand-bg-tertiary/60 border border-brand-border/40 rounded-xl flex justify-between items-center text-xs">
                <div className="flex flex-col">
                  <span className="font-bold text-white text-sm">{k.client}</span>
                  <code className="text-[11px] text-brand-accent-cyan font-mono mt-1.5">{k.key}</code>
                  <div className="flex gap-4 text-[10px] text-brand-text-muted mt-2 font-mono">
                    <span>Key Type: {k.type}</span>
                    <span>Status: <strong className="text-brand-accent-emerald font-semibold">{k.status}</strong></span>
                  </div>
                </div>
                {isAdmin ? (
                  <button onClick={() => handleRollKey(k.id)} className="btn btn-secondary btn-sm cursor-pointer px-4.5 py-2 bg-transparent border border-brand-border/80 hover:border-brand-primary text-xs shrink-0 text-white rounded-lg font-semibold">
                    Roll Secret Key
                  </button>
                ) : (
                  <span className="text-[10px] text-brand-text-subtle border border-brand-border/40 px-2.5 py-1.5 rounded-lg bg-brand-bg-tertiary font-mono">
                    Rollover Restricted
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VIEW: INTEGRATIONS */}
      {activeTab === 'integrations' && (
        <div className="card bg-brand-bg-secondary border border-brand-border rounded-2xl p-6 flex flex-col gap-4">
          <h3 className="text-lg font-bold font-display text-white border-b border-brand-border/40 pb-3 flex items-center gap-2">
            <ToggleLeft className="w-5 h-5 text-brand-accent-amber" />
            Global Platform Integrations
          </h3>
          <div className="flex flex-col gap-3.5">
            {integrations.map(int => (
              <div key={int.id} className="flex items-center justify-between p-4 border-b border-brand-border/20 text-xs hover:bg-white/[0.01] rounded-xl transition-all">
                <div className="flex flex-col">
                  <span className="font-bold text-white text-sm">{int.name}</span>
                  <span className="text-[10px] text-brand-text-muted mt-1 font-mono">Integration Protocol: {int.type}</span>
                </div>
                {isAdmin ? (
                  <button 
                    onClick={() => handleToggleIntegration(int.id)} 
                    className={`btn text-xs font-semibold py-1.5 px-4.5 rounded-lg cursor-pointer ${
                      int.status === 'Enabled' 
                        ? 'bg-brand-accent-emerald/20 text-brand-accent-emerald hover:bg-brand-accent-emerald/30 border border-brand-accent-emerald/30' 
                        : 'bg-brand-accent-ruby/20 text-brand-accent-ruby hover:bg-brand-accent-ruby/30 border border-brand-accent-ruby/30'
                    }`}
                  >
                    {int.status}
                  </button>
                ) : (
                  <span className={`text-xs font-semibold py-1.5 px-4.5 rounded-lg border ${
                    int.status === 'Enabled' 
                      ? 'border-brand-accent-emerald/30 text-brand-accent-emerald bg-brand-accent-emerald/10' 
                      : 'border-brand-accent-ruby/30 text-brand-accent-ruby bg-brand-accent-ruby/10'
                  }`}>
                    {int.status}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function PlatformAdminDashboard() {
  return (
    <Suspense fallback={<div className="text-white text-center py-10">Loading Platform Dashboard...</div>}>
      <PlatformAdminDashboardContent />
    </Suspense>
  );
}
