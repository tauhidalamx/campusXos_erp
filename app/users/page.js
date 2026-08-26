'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  LayoutDashboard, 
  Users, 
  Shield, 
  ShieldCheck, 
  ShieldAlert, 
  Key, 
  Landmark, 
  Activity, 
  User, 
  Plus, 
  Search, 
  ChevronRight, 
  Lock, 
  Unlock, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowRight, 
  Settings as SettingsIcon,
  BarChart2,
  Briefcase,
  Calendar,
  Trophy,
  FileText,
  Database,
  Code,
  Globe,
  HelpCircle,
  HardDrive,
  RefreshCw,
  Layers
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDb } from '../../context/db-context';

export default function UsersPage() {
  const { students } = useDb();
  
  // Tab states
  const [activeTab, setActiveTab] = useState('overview');
  const [currentUser, setCurrentUser] = useState(null);
  
  // Custom auth clearance switch
  const [clearanceRole, setClearanceRole] = useState('Super Admin');
  
  // User Registry State
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserRole, setNewUserRole] = useState('student');
  const [newUserTenant, setNewUserTenant] = useState('Model University Alpha');

  // Multi-tenant configuration
  const tenantsList = ['Model University Alpha', 'Consortium Campus Beta', 'Global Institute Gamma'];

  // SSO Methods & Zero Trust Settings
  const [ssoSettings, setSsoSettings] = useState({
    emailPass: true,
    googleSso: true,
    microsoftSso: false,
    githubSso: false,
    institutionSso: true,
    mfaEnabled: true,
    passkeys: false,
    biometrics: false
  });
  
  const [zeroTrustRisk, setZeroTrustRisk] = useState(12); // normal risk scoring

  // App Permission Matrix State
  const [permissionMatrix, setPermissionMatrix] = useState({
    'Global Super Admin': { erp: true, connect: true, chain: true, web3: true, market: true, ai: true, research: true },
    'Platform Admin': { erp: true, connect: true, chain: true, web3: true, market: true, ai: true, research: true },
    'University Admin': { erp: true, connect: true, chain: true, web3: true, market: true, ai: true, research: true },
    'Registrar': { erp: true, connect: false, chain: true, web3: true, market: false, ai: true, research: false },
    'Dean': { erp: true, connect: true, chain: true, web3: true, market: false, ai: true, research: true },
    'HOD': { erp: true, connect: true, chain: false, web3: true, market: false, ai: true, research: true },
    'Faculty': { erp: true, connect: true, chain: false, web3: true, market: true, ai: true, research: true },
    'Finance Manager': { erp: true, connect: false, chain: false, web3: false, market: true, ai: true, research: false },
    'Student': { erp: true, connect: true, chain: false, web3: true, market: false, ai: true, research: false },
    'Alumni': { erp: false, connect: true, chain: false, web3: true, market: false, ai: true, research: false },
    'Recruiter': { erp: false, connect: true, chain: false, web3: false, market: false, ai: true, research: false },
    'Guest': { erp: false, connect: false, chain: false, web3: false, market: false, ai: true, research: false }
  });

  // Approval Workflow Engine States
  const [approvalSteps, setApprovalSteps] = useState([
    { step: 1, name: 'Faculty Evaluator', role: 'Faculty', status: 'COMPLETED', date: '2026-06-10 10:14', hash: '0x3a4b...d2e1' },
    { step: 2, name: 'Department Head', role: 'HOD', status: 'COMPLETED', date: '2026-06-11 11:20', hash: '0x9a8b...12c4' },
    { step: 3, name: 'Dean of School', role: 'Dean', status: 'PENDING', date: 'N/A', hash: 'N/A' },
    { step: 4, name: 'Academic Office', role: 'Registrar', status: 'AWAITING_PREV', date: 'N/A', hash: 'N/A' },
    { step: 5, name: 'Consortium Chain Attestation', role: 'CampusX Chain', status: 'AWAITING_PREV', date: 'N/A', hash: 'N/A' },
    { step: 6, name: 'Verifiable Degree Issued', role: 'SBT Token', status: 'AWAITING_PREV', date: 'N/A', hash: 'N/A' }
  ]);

  // Audit logs registry
  const [auditRegistry, setAuditRegistry] = useState([
    { user: 'Dr. Evelyn Sterling', role: 'Super Admin', timestamp: '2026-06-12 21:30:14', ip: '192.168.1.42', device: 'MacBook Pro (macOS)', action: 'MINT_SOULBOUND_CREDENTIAL', result: 'SUCCESS', hash: '0xf43a7b...' },
    { user: 'Dr. Evelyn Sterling', role: 'Super Admin', timestamp: '2026-06-12 21:12:05', ip: '192.168.1.42', device: 'MacBook Pro (macOS)', action: 'UPDATE_SSO_CONFIG', result: 'SUCCESS', hash: '0xe12c9b...' },
    { user: 'registrar@demo.campusx.edu', role: 'Registrar', timestamp: '2026-06-12 18:42:12', ip: '10.0.4.11', device: 'Lenovo ThinkPad', action: 'VERIFY_DEGREE_HASH', result: 'SUCCESS', hash: '0x88ea2f...' },
    { user: 'dean@demo.campusx.edu', role: 'Dean', timestamp: '2026-06-12 16:15:30', ip: '10.0.5.2', device: 'iPad Pro', action: 'APPROVE_COURSE_CURRICULUM', result: 'SUCCESS', hash: '0x911bda...' },
    { user: 'student@demo.campusx.edu', role: 'Student', timestamp: '2026-06-12 15:10:44', ip: '172.16.8.91', device: 'iPhone 15', action: 'LOGIN_PORTAL', result: 'SUCCESS', hash: '0x32cf0b...' }
  ]);

  // Load initial users & session
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const session = sessionStorage.getItem('campusx_erp_session');
      if (session) {
        setCurrentUser(JSON.parse(session));
      }
      // Populate users from database or localStorage
      const localUsers = JSON.parse(localStorage.getItem('campusx_erp_users')) || [];
      if (localUsers.length > 0) {
        setUsers(localUsers);
      } else {
        // Mock default users
        const defaultUsers = [
          { id: 'usr_001', name: 'Dr. Evelyn Sterling', email: 'admin@campusx.edu', role: 'admin', tenant: 'Model University Alpha', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150' },
          { id: 'usr_002', name: 'Prof. Marcus Chen', email: 'faculty@campusx.edu', role: 'faculty', tenant: 'Model University Alpha', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150' },
          { id: 'usr_003', name: 'Aria Nakamura', email: 'student@campusx.edu', role: 'student', tenant: 'Model University Alpha', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150' }
        ];
        setUsers(defaultUsers);
        localStorage.setItem('campusx_erp_users', JSON.stringify(defaultUsers));
      }
    }
  }, []);

  // Action: Seed all required demo accounts
  const handleSeedDemoAccounts = () => {
    const demoAccounts = [
      { id: 'usr_demo_1', name: 'Global Super Admin', email: 'superadmin@demo.campusx.edu', role: 'admin', tenant: 'All Tenants', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150' },
      { id: 'usr_demo_2', name: 'University Admin', email: 'admin@demo.campusx.edu', role: 'admin', tenant: 'Model University Alpha', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150' },
      { id: 'usr_demo_3', name: 'Registrar Officer', email: 'registrar@demo.campusx.edu', role: 'registrar', tenant: 'Model University Alpha', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150' },
      { id: 'usr_demo_4', name: 'Dean of Faculty', email: 'dean@demo.campusx.edu', role: 'dean', tenant: 'Model University Alpha', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150' },
      { id: 'usr_demo_5', name: 'Professor Sterling', email: 'faculty@demo.campusx.edu', role: 'faculty', tenant: 'Model University Alpha', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150' },
      { id: 'usr_demo_6', name: 'Alex Rivera', email: 'student@demo.campusx.edu', role: 'student', tenant: 'Model University Alpha', avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150' },
      { id: 'usr_demo_7', name: 'Lead Recruiter', email: 'recruiter@demo.campusx.edu', role: 'recruiter', tenant: 'Model University Alpha', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150' }
    ];

    // Merge in users state & localStorage
    const merged = [...users];
    demoAccounts.forEach(demo => {
      if (!merged.some(u => u.email === demo.email)) {
        merged.push(demo);
      }
    });

    setUsers(merged);
    localStorage.setItem('campusx_erp_users', JSON.stringify(merged));
    
    // Log seeder event in audit registry
    setAuditRegistry([
      { user: 'System Seeder', role: 'Platform Admin', timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19), ip: '127.0.0.1', device: 'Consortium Orchestrator', action: 'SEED_DEMO_ACCOUNTS', result: 'SUCCESS', hash: '0x992cf8...' },
      ...auditRegistry
    ]);

    alert('Enterprise demo accounts loaded successfully! Password is "Demo@12345". Require password change on first login enabled.');
  };

  // Action: Add custom user account
  const handleRegisterUser = (e) => {
    e.preventDefault();
    if (!newUserName || !newUserEmail) return;

    const nUser = {
      id: 'usr_' + Math.random().toString(36).substr(2, 9),
      name: newUserName,
      email: newUserEmail.toLowerCase().trim(),
      role: newUserRole,
      tenant: newUserTenant,
      avatar: `https://images.unsplash.com/photo-${1500000000000 + Math.floor(Math.random()*1000000)}?w=150`
    };

    const updated = [...users, nUser];
    setUsers(updated);
    localStorage.setItem('campusx_erp_users', JSON.stringify(updated));

    // Audit logs
    setAuditRegistry([
      { user: 'Dr. Evelyn Sterling', role: clearanceRole, timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19), ip: '192.168.1.42', device: 'MacBook Pro', action: 'CREATE_USER_' + newUserRole.toUpperCase(), result: 'SUCCESS', hash: '0x' + Math.floor(Math.random()*100000000).toString(16) },
      ...auditRegistry
    ]);

    setNewUserName('');
    setNewUserEmail('');
    setShowAddModal(false);
    alert(`Registered user ${nUser.name} on tenant ${newUserTenant} successfully!`);
  };

  // Action: Delete user account
  const handleDeleteUser = (id) => {
    if (!confirm('Are you sure you want to revoke and delete this account?')) return;
    const target = users.find(u => u.id === id);
    const updated = users.filter(u => u.id !== id);
    setUsers(updated);
    localStorage.setItem('campusx_erp_users', JSON.stringify(updated));

    if (target) {
      setAuditRegistry([
        { user: 'Dr. Evelyn Sterling', role: clearanceRole, timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19), ip: '192.168.1.42', device: 'MacBook Pro', action: 'REVOKE_USER_' + target.role.toUpperCase(), result: 'SUCCESS', hash: '0x' + Math.floor(Math.random()*100000000).toString(16) },
        ...auditRegistry
      ]);
    }
  };

  // Action: Toggle App permission
  const handleTogglePermission = (role, app) => {
    setPermissionMatrix(prev => {
      const updatedRole = { ...prev[role] };
      updatedRole[app] = !updatedRole[app];
      return {
        ...prev,
        [role]: updatedRole
      };
    });
  };

  // Action: Advance Degree approval step
  const handleAuthorizeWorkflowStep = () => {
    const nextPendingIndex = approvalSteps.findIndex(s => s.status === 'PENDING' || s.status === 'AWAITING_PREV');
    if (nextPendingIndex === -1) {
      alert('All workflow stages verified and issued!');
      return;
    }

    const updated = [...approvalSteps];
    const target = updated[nextPendingIndex];

    // Complete the target step
    target.status = 'COMPLETED';
    target.date = new Date().toISOString().replace('T', ' ').slice(0, 16);
    target.hash = '0x' + Array.from({ length: 16 }, () => Math.floor(Math.random() * 16).toString(16)).join('');

    // Set next step as pending
    if (updated[nextPendingIndex + 1]) {
      updated[nextPendingIndex + 1].status = 'PENDING';
    }

    setApprovalSteps(updated);

    // Audit log
    setAuditRegistry([
      { user: target.name, role: target.role, timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19), ip: '10.0.5.2', device: 'Verification Engine', action: 'WORKFLOW_STEP_APPROVE', result: 'SUCCESS', hash: target.hash },
      ...auditRegistry
    ]);

    alert(`Evaluated and signed workflow step ${target.step}: ${target.name}`);
  };

  // Filtered users search query
  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderActiveViewport = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="flex flex-col gap-6 text-left">
            {/* Overview statistics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[
                { label: 'Platform Users registered', val: users.length, color: 'text-indigo-400', desc: 'Across 3 university tenants' },
                { label: 'Security risk threat score', val: `${zeroTrustRisk}/100`, color: 'text-emerald-400', desc: 'AI verified normal' },
                { label: 'MFA enforcement adoption', val: '85.4%', color: 'text-cyan-400', desc: 'SSO and Passkeys enforced' },
                { label: 'Pending approval flows', val: approvalSteps.filter(s => s.status === 'PENDING').length, color: 'text-amber-400', desc: 'Requires dean attestation' }
              ].map((kpi, idx) => (
                <div key={idx} className="card p-5 bg-brand-bg-secondary border border-brand-border rounded-2xl">
                  <span className="text-[10px] font-bold text-brand-text-muted uppercase tracking-widest block">{kpi.label}</span>
                  <span className={`text-2xl font-extrabold font-mono mt-2 block ${kpi.color}`}>{kpi.val}</span>
                  <span className="text-[9px] text-brand-text-subtle mt-1 block">{kpi.desc}</span>
                </div>
              ))}
            </div>

            {/* Role hierarchy tree */}
            <div className="card p-6 bg-brand-bg-secondary border border-brand-border rounded-2xl flex flex-col gap-4">
              <span className="text-xs font-bold text-white uppercase tracking-wider font-mono border-b border-brand-border pb-2">Organizational IAM Role Clearance Hierarchy</span>
              
              <div className="flex flex-col gap-3 max-h-[350px] overflow-y-auto pr-1 chat-scroll">
                {[
                  { role: 'Global Super Admin', scope: 'Entire CAMPUSX Ecosystem', capabilities: 'Manage tenants, Kubernetes infra, global SSO, blockchain nodes' },
                  { role: 'Platform Admin', scope: 'All Universities', capabilities: 'Manage plans, features, billing, analytics, integrations' },
                  { role: 'University Admin', scope: 'Single University Tenant', capabilities: 'Manage departments, faculty, students, approve ERP workflows' },
                  { role: 'Registrar', scope: 'Clearance Academic Records', capabilities: 'Attest credentials, issue Degree SBTs, access CampusX Chain services' },
                  { role: 'Dean', scope: 'School / Faculty Scope', capabilities: 'Approve courses, faculty leaves, departmental research papers' },
                  { role: 'HOD', scope: 'Department Scope', capabilities: 'Manage course allocations, lecture timetables, faculty reviews' },
                  { role: 'Faculty', scope: 'Course Scope', capabilities: 'Take attendance, upload marks, create assignments, student advising' },
                  { role: 'Finance Manager', scope: 'Finance Office', capabilities: 'Approve scholarship allocations, budgets, refund requests' },
                  { role: 'Student', scope: 'Personal Read/Submit', capabilities: 'Join communities, submit assignments, view wallet and credentials' },
                  { role: 'Alumni', scope: 'Credentials Access', capabilities: 'Verify degree SBTs, professional profiles access' },
                  { role: 'Recruiter', scope: 'Placements Access', capabilities: 'Post job offers, review resume templates, schedule interviews' },
                  { role: 'Guest', scope: 'Public Read Only', capabilities: 'Public catalog information search' }
                ].map((hier, idx) => (
                  <div key={idx} className="p-3 bg-brand-bg-tertiary border border-brand-border rounded-xl flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-[#6366F1] flex items-center justify-center font-bold">
                        {idx + 1}
                      </div>
                      <div>
                        <strong className="text-white font-sans">{hier.role}</strong>
                        <span className="text-[10px] text-slate-500 block mt-0.5">Scope: {hier.scope}</span>
                      </div>
                    </div>
                    <p className="text-[11px] text-slate-400 max-w-lg text-right truncate">{hier.capabilities}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'users':
        return (
          <div className="flex flex-col gap-6 text-left">
            {/* Header tools */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-brand-bg-secondary border border-brand-border p-5 rounded-2xl">
              <div className="flex-1 bg-brand-bg-tertiary border border-brand-border rounded-xl px-3 py-2 flex items-center gap-2 w-full md:w-80">
                <Search className="w-4.5 h-4.5 text-slate-500" />
                <input 
                  type="text" 
                  placeholder="Search user profiles by name, role or email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-transparent border-none text-xs text-white outline-none w-full"
                />
              </div>

              <div className="flex gap-2.5 w-full md:w-auto">
                <button 
                  onClick={handleSeedDemoAccounts}
                  className="px-4 py-2 bg-indigo-500/10 hover:bg-indigo-500/20 text-[#6366F1] border border-indigo-500/20 text-xs font-bold rounded-xl cursor-pointer"
                >
                  Seed Demo Accounts
                </button>
                <button 
                  onClick={() => setShowAddModal(true)}
                  className="px-4 py-2 bg-[#6366F1] text-white text-xs font-bold rounded-xl cursor-pointer hover:brightness-110"
                >
                  Register New User
                </button>
              </div>
            </div>

            {/* Users grid list */}
            <div className="table-container overflow-x-auto bg-brand-bg-secondary border border-brand-border rounded-2xl relative">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-brand-border text-brand-text-subtle text-[10px] uppercase font-bold tracking-wider">
                    <th className="p-4">User Identity</th>
                    <th className="p-4">Authorization Role</th>
                    <th className="p-4">Tenant Scope</th>
                    <th className="p-4">Email Address</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((u) => (
                    <tr key={u.id} className="border-b border-brand-border hover:bg-white/[0.01] transition-colors text-xs text-brand-text-main">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <img src={u.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150"} className="w-9 h-9 rounded-full object-cover border border-brand-border shrink-0" alt="" />
                          <div>
                            <div className="font-semibold text-white">{u.name}</div>
                            <div className="text-[10px] text-brand-text-muted font-mono">{u.id}</div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className={`px-2 py-0.5 rounded text-[8px] font-bold border uppercase ${
                          u.role === 'admin' ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' :
                          u.role === 'hod' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                          u.role === 'faculty' ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20' :
                          u.role === 'registrar' ? 'bg-indigo-500/10 text-[#6366F1] border-indigo-500/20' :
                          'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                        }`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="p-4 text-slate-300">{u.tenant || 'Model University Alpha'}</td>
                      <td className="p-4 font-mono text-[11px] text-slate-400">{u.email}</td>
                      <td className="p-4 text-right">
                        <button 
                          onClick={() => handleDeleteUser(u.id)}
                          className="px-2.5 py-1 bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 border border-rose-500/20 rounded font-bold cursor-pointer"
                        >
                          Revoke Access
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );

      case 'apps':
        return (
          <div className="glass-card p-6 text-left flex flex-col gap-4">
            <div className="border-b border-brand-border pb-2">
              <span className="text-xs font-bold text-white uppercase tracking-wider font-mono">Ecosystem App Visibility Grid Matrix</span>
              <p className="text-[10px] text-slate-500 mt-1">Define permissions for each ecosystem module. Toggling permission changes immediate visibility in client dashboards.</p>
            </div>

            <div className="overflow-x-auto border border-brand-border rounded-2xl">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="bg-brand-bg-tertiary border-b border-brand-border text-brand-text-subtle font-bold uppercase text-[9px] tracking-wider">
                    <th className="p-4">IAM Clearance Role</th>
                    <th className="p-4 text-center">ERP</th>
                    <th className="p-4 text-center">CONNECT</th>
                    <th className="p-4 text-center">CHAIN</th>
                    <th className="p-4 text-center">WEB3</th>
                    <th className="p-4 text-center">MARKET</th>
                    <th className="p-4 text-center">AI</th>
                    <th className="p-4 text-center">RESEARCH</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.keys(permissionMatrix).map((role) => (
                    <tr key={role} className="border-b border-brand-border hover:bg-white/[0.01]">
                      <td className="p-4 font-semibold text-white">{role}</td>
                      {['erp', 'connect', 'chain', 'web3', 'market', 'ai', 'research'].map((app) => {
                        const hasAccess = permissionMatrix[role][app];
                        return (
                          <td key={app} className="p-4 text-center">
                            <button
                              onClick={() => handleTogglePermission(role, app)}
                              className={`px-3 py-1.5 rounded-lg text-[10px] font-bold border transition-all cursor-pointer ${
                                hasAccess 
                                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                                  : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                              }`}
                            >
                              {hasAccess ? 'ALLOWED' : 'DENIED'}
                            </button>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );

      case 'sso':
        return (
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6 text-left">
            <div className="glass-card p-6 flex flex-col gap-6">
              <span className="text-xs font-bold text-white uppercase tracking-wider font-mono border-b border-brand-border pb-2">Single Sign-On (SSO) Gateways Integration</span>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  { key: 'emailPass', label: 'Email + Password authentication', desc: 'Secure hashed key checks' },
                  { key: 'googleSso', label: 'Google Identity OAuth Gateway', desc: 'OAuth client scopes verification' },
                  { key: 'microsoftSso', label: 'Microsoft Azure Active Directory', desc: 'OpenID Connect tenant sync' },
                  { key: 'githubSso', label: 'GitHub Developer SSO auth', desc: 'Developer workspace keys linked' },
                  { key: 'institutionSso', label: 'Local Institution SAML Gateway', desc: 'Campus intranet validation' },
                  { key: 'mfaEnabled', label: 'Multi-factor authentication (MFA)', desc: 'TOTP Google Authenticator checks' },
                  { key: 'passkeys', label: 'Passkeys FIDO2 Credential Keys', desc: 'Apple/WebAuthn secure keychains' },
                  { key: 'biometrics', label: 'Biometrics Device Verification', desc: 'TouchID & FaceID local keys sync' }
                ].map((sso) => (
                  <div key={sso.key} className="p-4 bg-brand-bg-tertiary border border-brand-border rounded-xl flex items-center justify-between text-xs">
                    <div>
                      <strong className="text-white font-sans">{sso.label}</strong>
                      <p className="text-[10px] text-slate-500 mt-1">{sso.desc}</p>
                    </div>
                    <button
                      onClick={() => setSsoSettings(prev => ({ ...prev, [sso.key]: !prev[sso.key] }))}
                      className={`px-3 py-1.5 rounded-lg text-[9px] font-bold border transition-all cursor-pointer ${
                        ssoSettings[sso.key] 
                          ? 'bg-[#6366F1] text-white border-transparent' 
                          : 'bg-transparent text-slate-500 border-brand-border'
                      }`}
                    >
                      {ssoSettings[sso.key] ? 'ENABLED' : 'DISABLED'}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Zero trust configuration */}
            <div className="glass-card p-5 flex flex-col gap-4 text-xs">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest font-mono">Zero Trust Enclave Controls</span>
              
              <div className="flex flex-col gap-3">
                <div className="p-3 bg-brand-bg-tertiary border border-brand-border rounded-xl">
                  <span className="text-[9px] text-slate-500 uppercase font-bold">Minimum Security Trust Score</span>
                  <div className="flex items-center justify-between mt-2">
                    <input 
                      type="range" 
                      min="0" 
                      max="100"
                      value={zeroTrustRisk}
                      onChange={(e) => setZeroTrustRisk(parseInt(e.target.value))}
                      className="w-full accent-[#6366F1] h-1.5 rounded-lg bg-black/40 cursor-pointer"
                    />
                    <span className="font-mono text-cyan-400 font-bold ml-3 text-sm shrink-0">{zeroTrustRisk}</span>
                  </div>
                  <span className="text-[8px] text-slate-500 mt-1 block">Inbound connections scoring above threshold trigger auto-MFA.</span>
                </div>

                <div className="p-4 bg-brand-bg-tertiary border border-brand-border rounded-xl flex flex-col gap-2 text-slate-400">
                  <span className="text-[9px] text-slate-500 uppercase font-bold text-white block">Emergency Lockdown mode</span>
                  <p className="text-[10px] leading-relaxed">Lock and terminate all active university sessions immediately in case of catalog intrusion events.</p>
                  <button 
                    onClick={() => {
                      setZeroTrustRisk(95);
                      alert('EMERGENCY LOCKDOWN INITIATED. Threat monitoring levels adjusted to high.');
                    }}
                    className="w-full py-2 bg-rose-500 text-white rounded-lg text-[10px] font-bold cursor-pointer hover:brightness-110"
                  >
                    Lock Portal Node
                  </button>
                </div>
              </div>
            </div>
          </div>
        );

      case 'workflows':
        return (
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6 text-left">
            <div className="glass-card p-6 flex flex-col gap-6">
              <div className="border-b border-brand-border pb-2 flex justify-between items-center">
                <div>
                  <span className="text-xs font-bold text-white uppercase tracking-wider font-mono">Degree Issuance Verification Pipeline</span>
                  <p className="text-[10px] text-slate-500 mt-1">Multi-step consensus path required to mint and lock student Degree certificates onto CampusX Chain.</p>
                </div>
                <button 
                  onClick={handleAuthorizeWorkflowStep}
                  className="px-4 py-2 bg-[#6366F1] text-white text-xs font-bold rounded-xl cursor-pointer hover:brightness-110 flex items-center gap-1.5"
                >
                  Authorize Step <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Progress timeline */}
              <div className="flex flex-col gap-4 relative pl-4 border-l border-brand-border">
                {approvalSteps.map((step, idx) => (
                  <div key={idx} className="relative flex items-start gap-4">
                    {/* Status marker */}
                    <div className={`absolute -left-[25px] w-[18px] h-[18px] rounded-full border-2 flex items-center justify-center bg-brand-bg-secondary ${
                      step.status === 'COMPLETED' ? 'border-emerald-500 text-emerald-400' : (step.status === 'PENDING' ? 'border-amber-500 text-amber-400' : 'border-slate-700 text-slate-600')
                    }`}>
                      {step.status === 'COMPLETED' ? '✓' : (step.status === 'PENDING' ? '●' : '')}
                    </div>

                    <div className="flex-1 p-3.5 bg-brand-bg-tertiary border border-brand-border rounded-xl flex items-center justify-between text-xs">
                      <div>
                        <strong className="text-white font-sans">Stage {step.step}: {step.name}</strong>
                        <span className="text-[10px] text-slate-500 block mt-0.5">Clearing role: {step.role}</span>
                      </div>
                      
                      <div className="text-right text-[10px] font-mono">
                        <span className={`px-2 py-0.5 rounded text-[8px] font-bold border uppercase block ${
                          step.status === 'COMPLETED' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : (step.status === 'PENDING' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20 animate-pulse' : 'bg-slate-700/10 text-slate-600 border-slate-700/20')
                        }`}>
                          {step.status}
                        </span>
                        {step.status === 'COMPLETED' && (
                          <span className="text-[8px] text-slate-500 block mt-1">Attested: {step.date}</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Active multi-sig consensus indicators */}
            <div className="glass-card p-5 flex flex-col gap-4 text-xs">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest font-mono">Consensus Audit State</span>
              <div className="p-3 bg-brand-bg-tertiary border border-brand-border rounded-xl">
                <span className="text-[9px] text-slate-500 uppercase font-bold block">Verifiable signature ledger</span>
                <div className="flex flex-col gap-2 mt-2 font-mono text-[9.5px]">
                  {approvalSteps.filter(s => s.status === 'COMPLETED').map((step, idx) => (
                    <div key={idx} className="flex justify-between border-b border-brand-border pb-1.5 last:border-transparent">
                      <span className="text-slate-400">Step {step.step} signature:</span>
                      <code className="text-cyan-400 font-bold">{step.hash}</code>
                    </div>
                  ))}
                </div>
              </div>
              <span className="text-[8.5px] text-slate-500 font-sans leading-relaxed">Attestation states sync cryptographically to CampusX Chain validation pools upon completing Step 5.</span>
            </div>
          </div>
        );

      case 'audit':
        return (
          <div className="flex flex-col gap-6 text-left">
            <div className="glass-card p-6 flex flex-col gap-4">
              <span className="text-xs font-bold text-white uppercase tracking-wider font-mono border-b border-brand-border pb-2">Global IAM Security Audit Registry</span>
              
              <div className="overflow-x-auto border border-brand-border rounded-2xl">
                <table className="w-full text-xs text-left">
                  <thead>
                    <tr className="bg-brand-bg-tertiary border-b border-brand-border text-brand-text-subtle font-bold uppercase text-[9px] tracking-wider">
                      <th className="p-4">User</th>
                      <th className="p-4">Clearance Role</th>
                      <th className="p-4">Timestamp</th>
                      <th className="p-4">IP Address</th>
                      <th className="p-4">Action Event</th>
                      <th className="p-4">Result</th>
                      <th className="p-4 font-mono">Consensus Hash</th>
                    </tr>
                  </thead>
                  <tbody>
                    {auditRegistry.map((log, idx) => (
                      <tr key={idx} className="border-b border-brand-border hover:bg-white/[0.01]">
                        <td className="p-4 font-semibold text-white">{log.user}</td>
                        <td className="p-4 font-semibold text-slate-400">{log.role}</td>
                        <td className="p-4 text-slate-400 font-mono text-[10px]">{log.timestamp}</td>
                        <td className="p-4 font-mono text-[11px] text-slate-500">{log.ip}</td>
                        <td className="p-4 font-bold text-slate-300">{log.action}</td>
                        <td className="p-4">
                          <span className={`px-2 py-0.5 rounded text-[8px] font-bold border ${
                            log.result === 'SUCCESS' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                          }`}>
                            {log.result}
                          </span>
                        </td>
                        <td className="p-4 font-mono text-cyan-400">{log.hash}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );

      case 'blueprints':
        return (
          <div className="flex flex-col gap-6 text-left">
            <span className="text-xs font-bold text-white uppercase tracking-wider font-mono border-b border-brand-border pb-2 block">CAMPUSX IAM Architectural Spec Blueprints</span>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 text-[11px] font-mono leading-relaxed">
              
              {/* Database Schemas */}
              <div className="glass-card p-5 flex flex-col gap-3">
                <span className="text-xs font-bold text-white uppercase tracking-wider font-sans">1. Database Schema specifications (PostgreSql)</span>
                <div className="bg-black/30 border border-brand-border rounded-xl p-4 text-emerald-400 overflow-x-auto max-h-[300px] web3-scroll">
                  {`CREATE TABLE iam_users (
  user_id VARCHAR(100) PRIMARY KEY,
  full_name VARCHAR(150) NOT NULL,
  email_address VARCHAR(150) UNIQUE NOT NULL,
  clearance_role VARCHAR(50) NOT NULL,
  tenant_scope VARCHAR(100) NOT NULL,
  mfa_secret VARCHAR(100),
  passkey_pubkey TEXT
);

CREATE TABLE app_permissions (
  role_name VARCHAR(50) PRIMARY KEY,
  erp_allowed BOOLEAN DEFAULT FALSE,
  connect_allowed BOOLEAN DEFAULT FALSE,
  chain_allowed BOOLEAN DEFAULT FALSE,
  web3_allowed BOOLEAN DEFAULT FALSE,
  market_allowed BOOLEAN DEFAULT FALSE,
  ai_allowed BOOLEAN DEFAULT TRUE,
  research_allowed BOOLEAN DEFAULT FALSE
);

CREATE TABLE audit_registry (
  id SERIAL PRIMARY KEY,
  user_identity VARCHAR(150) NOT NULL,
  user_role VARCHAR(50) NOT NULL,
  action_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  ip_address VARCHAR(50) NOT NULL,
  device_metadata VARCHAR(255),
  action_event VARCHAR(100) NOT NULL,
  outcome VARCHAR(20) NOT NULL,
  consensus_hash VARCHAR(255)
);`}
                </div>
              </div>

              {/* API design specs */}
              <div className="glass-card p-5 flex flex-col gap-3">
                <span className="text-xs font-bold text-white uppercase tracking-wider font-sans">2. REST API designs (Swagger schema)</span>
                <div className="bg-black/30 border border-brand-border rounded-xl p-4 text-emerald-400 overflow-x-auto max-h-[300px] web3-scroll">
                  {`POST /api/v1/iam/sso/callback
Body: { provider: "google", auth_token: "jwt" }
Headers: { "X-Device-Fingerprint": "sha256" }
Response: { success: true, session: "campusx_erp_session" }

POST /api/v1/iam/users/seed
Headers: { "X-Admin-Clearance": "Global Super Admin" }
Response: { success: true, seeded_count: 7 }

GET  /api/v1/iam/audit/registry?limit=50
Headers: { Authorization: "Bearer JWT" }
Response: { logs: [...] }`}
                </div>
              </div>

              {/* Multi-Tenant model */}
              <div className="glass-card p-5 flex flex-col gap-3">
                <span className="text-xs font-bold text-white uppercase tracking-wider font-sans">3. Multi-Tenant scope isolation architecture</span>
                <div className="bg-black/30 border border-brand-border rounded-xl p-4 text-cyan-400 overflow-x-auto max-h-[300px] web3-scroll">
                  {`# Tenancy isolation parameters
tenancy:
  isolation_mode: "Shared-Database, Row-Level-Security"
  tenant_identifier_key: "tenant_scope"
  default_tenant: "Model University Alpha"
  enforce_ssl: true
  rules:
    - role: "Super Admin"
      bypass_tenant_check: true
    - role: "University Admin"
      restrict_to_tenant: true
    - role: "Student"
      restrict_to_row: true`}
                </div>
              </div>

              {/* Production deployment specs */}
              <div className="glass-card p-5 flex flex-col gap-3">
                <span className="text-xs font-bold text-white uppercase tracking-wider font-sans">4. Production deployment plan</span>
                <div className="bg-black/30 border border-brand-border rounded-xl p-4 text-cyan-400 overflow-x-auto max-h-[300px] web3-scroll">
                  {`# deployment-manifest.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: campusx-iam-config
  namespace: campusx-security-infrastructure
data:
  SSO_PROVIDERS_ENABLED: "google,microsoft,saml"
  ZERO_TRUST_MIN_SCORE: "15"
  MFA_REQUIRED: "true"
  ENCRYPTION_SCHEME: "AES-256-GCM"
  AUDIT_ANCHOR_GATEWAY: "https://rpc.chain.campusx.edu"`}
                </div>
              </div>

            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col gap-6 md:gap-8 connect-font-inter">
      {/* 1. Page Header */}
      <div className="page-header flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-brand-border pb-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-white flex items-center gap-2">
            <Shield className="w-8 h-8 text-[#6366F1]" /> Identity & Access Management (IAM)
          </h1>
          <p className="text-brand-text-muted mt-1 text-sm">Enterprise-grade clearance levels, multi-tenant scopes, SSO integrations, and consensus audit logs.</p>
        </div>

        {/* Clearance Role switch simulator */}
        <div className="flex items-center gap-2 bg-brand-bg-secondary border border-brand-border rounded-xl p-2">
          <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider font-mono pl-1">Clearance:</span>
          <select 
            value={clearanceRole}
            onChange={(e) => {
              setClearanceRole(e.target.value);
              alert(`Security clearance context switched to: ${e.target.value}`);
            }}
            className="bg-brand-bg-tertiary border border-brand-border rounded-lg px-2.5 py-1.5 text-xs font-semibold text-white outline-none cursor-pointer"
          >
            {['Super Admin', 'Platform Admin', 'University Admin', 'Registrar', 'Dean', 'HOD', 'Faculty', 'Student'].map(role => (
              <option key={role} value={role}>{role}</option>
            ))}
          </select>
        </div>
      </div>

      {/* 2. Workspace Navigation Tabs */}
      <div className="flex gap-2 border-b border-brand-border pb-2 overflow-x-auto web3-scroll">
        {[
          { id: 'overview', label: 'Clearance & Role Hierarchy', icon: Landmark },
          { id: 'users', label: 'User Registry Control', icon: Users },
          { id: 'apps', label: 'App Permission Matrix', icon: ShieldCheck },
          { id: 'sso', label: 'SSO & Zero Trust Policy', icon: Key },
          { id: 'workflows', label: 'Approval Workflows Engine', icon: Activity },
          { id: 'audit', label: 'Audit Registry logs', icon: FileText },
          { id: 'blueprints', label: 'Architect Blueprint', icon: Database }
        ].map((tab) => {
          const TabIcon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2.5 px-4 rounded-xl flex items-center gap-2 font-bold text-xs transition-all cursor-pointer whitespace-nowrap border ${
                isActive 
                  ? 'bg-[#6366F1]/10 text-white border-[#6366F1]/20 font-extrabold shadow-sm' 
                  : 'text-slate-400 border-transparent hover:text-white hover:bg-white/[0.02]'
              }`}
            >
              <TabIcon className={`w-4.5 h-4.5 ${isActive ? 'text-[#6366F1]' : 'text-slate-500'}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* 3. Viewport Render */}
      <div className="flex-1">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {renderActiveViewport()}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Add User Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center z-[1000] p-4">
          <div className="modal-container bg-brand-bg-secondary border border-brand-border rounded-[20px] w-full max-w-[500px] shadow-2xl animate-fade-in text-left">
            <div className="modal-header p-5 px-6 border-b border-brand-border flex items-center justify-between">
              <h3 className="modal-title font-display text-lg font-bold text-white">Register IAM User</h3>
              <button className="modal-close bg-transparent border-none text-slate-500 cursor-pointer text-2xl" onClick={() => setShowAddModal(false)}>&times;</button>
            </div>
            <form onSubmit={handleRegisterUser} className="modal-body p-6 flex flex-col gap-4 text-xs">
              <div className="form-group flex flex-col gap-1.5">
                <label className="form-label text-xs font-semibold text-slate-400">Full Name</label>
                <input 
                  type="text" 
                  className="bg-brand-bg-tertiary border border-brand-border text-white p-2.5 rounded-xl outline-none" 
                  placeholder="e.g. Tony Stark"
                  value={newUserName}
                  onChange={(e) => setNewUserName(e.target.value)}
                  required
                />
              </div>
              <div className="form-group flex flex-col gap-1.5">
                <label className="form-label text-xs font-semibold text-slate-400">Email Address</label>
                <input 
                  type="email" 
                  className="bg-brand-bg-tertiary border border-brand-border text-white p-2.5 rounded-xl outline-none" 
                  placeholder="e.g. tonystark@modeluni.edu"
                  value={newUserEmail}
                  onChange={(e) => setNewUserEmail(e.target.value)}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="form-group flex flex-col gap-1.5">
                  <label className="form-label text-xs font-semibold text-slate-400">Clearance Role</label>
                  <select 
                    className="select-dark"
                    value={newUserRole}
                    onChange={(e) => setNewUserRole(e.target.value)}
                  >
                    <option value="student">Student</option>
                    <option value="faculty">Faculty Member</option>
                    <option value="hod">HOD</option>
                    <option value="dean">Dean</option>
                    <option value="registrar">Registrar</option>
                    <option value="admin">Administrator</option>
                  </select>
                </div>
                <div className="form-group flex flex-col gap-1.5">
                  <label className="form-label text-xs font-semibold text-slate-400">Tenant Campus</label>
                  <select 
                    className="select-dark"
                    value={newUserTenant}
                    onChange={(e) => setNewUserTenant(e.target.value)}
                  >
                    {tenantsList.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
              </div>
              <div className="modal-footer pt-4 border-t border-brand-border flex justify-end gap-3 mt-4">
                <button type="button" className="px-4 py-2 border border-brand-border text-slate-400 rounded-lg cursor-pointer hover:bg-white/[0.02]" onClick={() => setShowAddModal(false)}>Cancel</button>
                <button type="submit" className="px-4 py-2 bg-[#6366F1] text-white rounded-lg cursor-pointer hover:brightness-110 font-bold">Register Profile</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
