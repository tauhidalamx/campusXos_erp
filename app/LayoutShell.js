'use client';

import React, { useState, useEffect, useRef } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { DbProvider, useDb } from '../context/db-context';
import { 
  LayoutDashboard, 
  GraduationCap, 
  Users, 
  BookOpen, 
  CalendarCheck, 
  Award, 
  DollarSign, 
  Book,
  Home,
  Bus,
  Bot,
  BarChart2,
  TrendingUp,
  Settings as SettingsIcon,
  Briefcase,
  FlaskConical,
  Sparkles,
  X,
  Send,
  ChevronRight,
  MessageSquare,
  Activity,
  FileCheck,
  Wallet,
  Code,
  CheckSquare,
  Fingerprint,
  Server,
  Globe,
  Key,
  Trophy
} from 'lucide-react';

const rolePermissions = {
  superadmin: {
    allowed: ['*'],
    home: '/admin/global'
  },
  platformadmin: {
    allowed: ['*'],
    home: '/admin/platform'
  },
  admin: {
    allowed: ['/', '/erp/admin', '/students', '/faculty', '/erp/faculty-allocation', '/courses', '/attendance', '/exams', '/finance', '/finance/payments', '/student/payments', '/library', '/hostel', '/transport', '/placements', '/reports', '/research', '/ai-assistant', '/connect', '/settings', '/users', '/blockchain', '/chain', '/sports', '/soc', '/studio', '/twin', '/iot', '/career', '/admissions', '/procurement', '/compliance', '/erp/results', '/erp/exams', '/erp/assignments', '/erp/registration', '/market', '/stock'],
    home: '/erp/admin'
  },
  registrar: {
    allowed: ['/', '/erp/registrar', '/students', '/courses', '/exams', '/blockchain', '/chain', '/ai-assistant', '/settings', '/erp/results', '/erp/exams', '/erp/assignments', '/erp/registration', '/erp/faculty-allocation'],
    home: '/erp/registrar'
  },
  dean: {
    allowed: ['/', '/erp/dean', '/faculty', '/courses', '/research', '/reports', '/ai-assistant', '/connect', '/settings', '/erp/results', '/erp/exams', '/erp/assignments', '/erp/registration', '/erp/faculty-allocation'],
    home: '/erp/dean'
  },
  hod: {
    allowed: ['/', '/erp/hod', '/courses', '/faculty', '/research', '/reports', '/ai-assistant', '/connect', '/settings', '/erp/results', '/erp/exams', '/erp/assignments', '/erp/registration', '/erp/faculty-allocation'],
    home: '/erp/hod'
  },
  faculty: {
    allowed: ['/', '/faculty/home', '/attendance', '/assignments', '/courses', '/exams', '/research', '/connect', '/ai-assistant', '/settings', '/sports', '/blockchain', '/chain', '/erp/results', '/erp/exams', '/erp/assignments', '/erp/registration', '/erp/faculty-allocation', '/market', '/stock'],
    home: '/faculty/home'
  },
  finance_manager: {
    allowed: ['/', '/finance/dashboard', '/finance', '/finance/payments', '/stock', '/market', '/ai-assistant', '/settings', '/erp/registration'],
    home: '/finance/dashboard'
  },
  research_coordinator: {
    allowed: ['/', '/research/dashboard', '/research', '/blockchain', '/chain', '/connect', '/ai-assistant', '/settings', '/market', '/stock'],
    home: '/research/dashboard'
  },
  placement_officer: {
    allowed: ['/', '/placement/dashboard', '/placements', '/connect', '/ai-assistant', '/settings'],
    home: '/placement/dashboard'
  },
  student: {
    allowed: ['/', '/student/home', '/courses', '/attendance', '/exams', '/connect', '/web3', '/research', '/ai-assistant', '/sports', '/settings', '/erp/results', '/erp/exams', '/erp/assignments', '/erp/registration', '/erp/faculty-allocation', '/student/payments', '/market', '/stock'],
    home: '/student/home'
  },
  parent: {
    allowed: ['/', '/parent/dashboard', '/attendance', '/exams', '/finance', '/settings', '/sports', '/erp/results', '/erp/exams', '/erp/assignments'],
    home: '/parent/dashboard'
  },
  alumni: {
    allowed: ['/', '/alumni/home', '/connect', '/web3', '/blockchain', '/chain', '/settings', '/market', '/stock'],
    home: '/alumni/home'
  },
  recruiter: {
    allowed: ['/', '/recruiter/dashboard', '/placements', '/connect', '/blockchain', '/chain', '/settings'],
    home: '/recruiter/dashboard'
  },
  sports_director: {
    allowed: ['/', '/sports', '/sports/director', '/settings', '/ai-assistant'],
    home: '/sports/director'
  },
  coach: {
    allowed: ['/', '/sports', '/sports/coach', '/settings', '/connect'],
    home: '/sports/coach'
  },
  athlete: {
    allowed: ['/', '/sports', '/sports/athlete', '/settings', '/connect'],
    home: '/sports/athlete'
  },
  sports_parent: {
    allowed: ['/', '/sports', '/sports/parent', '/settings'],
    home: '/sports/parent'
  },
  department_admin: {
    allowed: ['/', '/courses', '/students', '/faculty', '/attendance', '/exams', '/connect', '/ai-assistant', '/blockchain', '/chain', '/settings', '/research', '/erp/faculty-allocation'],
    home: '/'
  },
  library_admin: {
    allowed: ['/', '/library', '/settings', '/connect', '/ai-assistant'],
    home: '/library'
  },
  hostel_admin: {
    allowed: ['/', '/hostel', '/settings', '/connect', '/ai-assistant'],
    home: '/hostel'
  },
  transport_admin: {
    allowed: ['/', '/transport', '/settings', '/connect', '/ai-assistant'],
    home: '/transport'
  },
  medical_staff: {
    allowed: ['/', '/sports', '/connect', '/ai-assistant', '/settings'],
    home: '/sports'
  },
  guest: {
    allowed: ['/', '/connect', '/ai-assistant', '/settings', '/market', '/stock'],
    home: '/'
  },
  consultant: {
    allowed: ['/', '/reports', '/connect', '/ai-assistant', '/settings'],
    home: '/reports'
  },
  auditor: {
    allowed: ['/', '/reports', '/compliance', '/connect', '/ai-assistant', '/settings'],
    home: '/reports'
  },
  compliance_officer: {
    allowed: ['/', '/compliance', '/settings', '/connect', '/ai-assistant'],
    home: '/compliance'
  },
  course_coordinator: {
    allowed: ['/', '/erp/results', '/settings', '/connect', '/ai-assistant'],
    home: '/erp/results'
  },
  controller_of_examination: {
    allowed: ['/', '/erp/exams', '/erp/results', '/settings', '/connect', '/ai-assistant'],
    home: '/erp/exams'
  },
  market_admin: {
    allowed: ['/', '/market', '/stock', '/ai-assistant', '/settings'],
    home: '/market'
  },
  research_analyst: {
    allowed: ['/', '/market', '/stock', '/research', '/blockchain', '/chain', '/connect', '/ai-assistant', '/settings'],
    home: '/market'
  }
};

const isRouteAllowed = (role, path) => {
  if (!role) return true;
  const rules = rolePermissions[role];
  if (!rules) return true;
  if (rules.allowed.includes('*')) return true;

  const cleanPath = path.split('?')[0].split('#')[0];

  return rules.allowed.some(allowedPath => {
    if (allowedPath === cleanPath) return true;
    if (cleanPath.startsWith(allowedPath + '/')) return true;
    return false;
  });
};

const allApps = {
  ERP: { name: 'ERP', href: '/', icon: <svg className="w-5 h-5 text-brand-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5"/></svg>, color: 'brand-primary' },
  CONNECT: { name: 'CONNECT', href: '/connect', icon: <svg className="w-5 h-5 text-brand-accent-cyan" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>, color: 'cyan' },
  CHAIN: { name: 'CHAIN', href: '/blockchain', icon: <svg className="w-5 h-5 text-brand-accent-emerald" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>, color: 'emerald' },
  WEB3: { name: 'WEB3', href: '/web3', icon: <svg className="w-5 h-5 text-brand-accent-cyan" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>, color: 'cyan' },
  MARKET: { name: 'MARKET', href: '/stock', icon: <svg className="w-5 h-5 text-brand-accent-amber" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>, color: 'amber' },
  AI: { name: 'AI', href: '/ai-assistant', icon: <svg className="w-5 h-5 text-brand-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M12 2v2M8 5a4 4 0 0 1 8 0M16 11V7a4 4 0 0 0-8 0v4"/></svg>, color: 'brand-primary' },
  RESEARCH: { name: 'RESEARCH', href: '/research', icon: <svg className="w-5 h-5 text-brand-accent-cyan" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 22h20M12 2v20M2 12h20M6 12l6-6 6 6"/></svg>, color: 'cyan' },
  SYSTEM_ADMIN: { name: 'SYSTEM ADMIN', href: '/admin/global', icon: <svg className="w-5 h-5 text-brand-accent-ruby" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>, color: 'ruby' },
  SPORTS: { name: 'SPORTS', href: '/sports', icon: <svg className="w-5 h-5 text-brand-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6M18 9h1.5a2.5 2.5 0 0 0 0-5H18M4 22h16M10 14.66V17c0 .55-.45 1-1 1H4v2h16v-2h-5c-.55 0-1-.45-1-1v-2.34M12 2a5 5 0 0 0-5 5v3c0 2.2 1.8 4 4 4h2c2.2 0 4-1.8 4-4V7a5 5 0 0 0-5-5z"/></svg>, color: 'brand-primary' },
  SOC: { name: 'SOC SECURITY', href: '/soc', icon: <svg className="w-5 h-5 text-brand-accent-ruby" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>, color: 'ruby' },
  STUDIO: { name: 'STUDIO BUILDER', href: '/studio', icon: <svg className="w-5 h-5 text-brand-accent-cyan" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 20h9M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>, color: 'cyan' },
  TWIN: { name: 'CAMPUS TWIN', href: '/twin', icon: <svg className="w-5 h-5 text-brand-accent-emerald" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>, color: 'emerald' },
  IOT: { name: 'IOT SENSORS', href: '/iot', icon: <svg className="w-5 h-5 text-brand-accent-amber" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/><path d="M2 12h20"/></svg>, color: 'amber' },
  CAREER: { name: 'CAREER PATHS', href: '/career', icon: <svg className="w-5 h-5 text-brand-accent-emerald" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>, color: 'emerald' },
  ADMISSIONS: { name: 'ADMISSIONS', href: '/admissions', icon: <svg className="w-5 h-5 text-brand-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z"/><path d="M6 6h10M6 10h10"/></svg>, color: 'brand-primary' },
  PROCUREMENT: { name: 'PROCUREMENT', href: '/procurement', icon: <svg className="w-5 h-5 text-brand-accent-amber" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>, color: 'amber' },
  COMPLIANCE: { name: 'COMPLIANCE', href: '/compliance', icon: <svg className="w-5 h-5 text-brand-accent-emerald" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></svg>, color: 'emerald' },
  LIBRARY: { name: 'LIBRARY', href: '/library', icon: <svg className="w-5 h-5 text-brand-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z"/><path d="M6 6h10M6 10h10"/></svg>, color: 'brand-primary' },
  HOSTEL: { name: 'HOSTEL', href: '/hostel', icon: <svg className="w-5 h-5 text-brand-accent-amber" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>, color: 'amber' },
  TRANSPORT: { name: 'TRANSPORT', href: '/transport', icon: <svg className="w-5 h-5 text-brand-accent-emerald" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="1" y="3" width="22" height="13" rx="2" ry="2"/><line x1="12" y1="16" x2="12" y2="21"/><line x1="8" y1="21" x2="16" y2="21"/></svg>, color: 'emerald' },
  PLACEMENT: { name: 'PLACEMENT', href: '/placements', icon: <svg className="w-5 h-5 text-brand-accent-cyan" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>, color: 'cyan' }
};

const getVisibleAppsForRole = (role) => {
  if (!role) return [];
  const mapping = {
    superadmin: ['ERP', 'CONNECT', 'CHAIN', 'WEB3', 'MARKET', 'AI', 'RESEARCH', 'SYSTEM_ADMIN', 'SPORTS', 'SOC', 'STUDIO', 'TWIN', 'IOT', 'CAREER', 'ADMISSIONS', 'PROCUREMENT', 'COMPLIANCE', 'LIBRARY', 'HOSTEL', 'TRANSPORT', 'PLACEMENT'],
    platformadmin: ['ERP', 'CONNECT', 'CHAIN', 'WEB3', 'MARKET', 'AI', 'RESEARCH', 'SYSTEM_ADMIN', 'SPORTS', 'SOC', 'STUDIO', 'TWIN', 'IOT', 'CAREER', 'ADMISSIONS', 'PROCUREMENT', 'COMPLIANCE', 'LIBRARY', 'HOSTEL', 'TRANSPORT', 'PLACEMENT'],
    admin: ['ERP', 'CONNECT', 'CHAIN', 'AI', 'RESEARCH', 'SPORTS', 'SOC', 'STUDIO', 'TWIN', 'IOT', 'CAREER', 'ADMISSIONS', 'PROCUREMENT', 'COMPLIANCE', 'LIBRARY', 'HOSTEL', 'TRANSPORT', 'PLACEMENT'],
    registrar: ['ERP', 'CHAIN', 'AI'],
    dean: ['ERP', 'CONNECT', 'AI', 'RESEARCH'],
    hod: ['ERP', 'CONNECT', 'AI', 'RESEARCH'],
    faculty: ['ERP', 'CONNECT', 'AI', 'RESEARCH', 'SPORTS', 'CHAIN'],
    finance_manager: ['ERP', 'MARKET', 'AI'],
    research_coordinator: ['RESEARCH', 'CHAIN', 'AI', 'CONNECT'],
    placement_officer: ['PLACEMENT', 'CONNECT', 'AI'],
    student: ['ERP', 'CONNECT', 'WEB3', 'AI', 'SPORTS', 'RESEARCH'],
    parent: ['ERP', 'SPORTS'],
    alumni: ['CONNECT', 'WEB3', 'CHAIN'],
    recruiter: ['PLACEMENT', 'CONNECT', 'CHAIN'],
    sports_director: ['SPORTS', 'ERP', 'AI'],
    coach: ['SPORTS', 'CONNECT'],
    athlete: ['SPORTS', 'CONNECT'],
    sports_parent: ['SPORTS'],
    department_admin: ['ERP', 'CONNECT', 'AI', 'RESEARCH', 'CHAIN'],
    library_admin: ['ERP', 'CONNECT', 'AI'],
    hostel_admin: ['ERP', 'CONNECT', 'AI'],
    transport_admin: ['ERP', 'CONNECT', 'AI'],
    medical_staff: ['SPORTS', 'CONNECT', 'AI'],
    guest: ['ERP', 'CONNECT', 'AI'],
    consultant: ['ERP', 'CONNECT', 'AI'],
    auditor: ['ERP', 'CONNECT', 'AI', 'COMPLIANCE'],
    compliance_officer: ['ERP', 'CONNECT', 'AI', 'COMPLIANCE']
  };
  const apps = mapping[role] || ['ERP'];
  return apps.map(appName => allApps[appName]).filter(Boolean);
};

const getErpHomeForRole = (role) => {
  if (!role) return '/';
  if (role === 'superadmin' || role === 'platformadmin' || role === 'admin') {
    return '/erp/admin';
  }
  const homes = {
    registrar: '/erp/registrar',
    dean: '/erp/dean',
    hod: '/erp/hod',
    faculty: '/faculty/home',
    finance_manager: '/finance/dashboard',
    research_coordinator: '/research/dashboard',
    placement_officer: '/placement/dashboard',
    student: '/student/home',
    parent: '/parent/dashboard',
    alumni: '/alumni/home',
    recruiter: '/recruiter/dashboard',
    sports_director: '/sports/director',
    coach: '/sports/coach',
    athlete: '/sports/athlete',
    sports_parent: '/sports/parent',
    library_admin: '/library',
    hostel_admin: '/hostel',
    transport_admin: '/transport',
    medical_staff: '/sports',
    consultant: '/reports',
    auditor: '/reports',
    compliance_officer: '/compliance',
    course_coordinator: '/erp/results',
    controller_of_examination: '/erp/exams'
  };
  return homes[role] || '/';
};


const iconMap = {
  Dashboard: LayoutDashboard,
  Students: GraduationCap,
  Faculty: Users,
  Courses: BookOpen,
  Attendance: CalendarCheck,
  Exams: Award,
  Finance: DollarSign,
  Library: Book,
  Hostel: Home,
  Transport: Bus,
  Placement: Briefcase,
  Analytics: BarChart2,
  Research: FlaskConical,
  AIAssistant: Bot,
  Connect: MessageSquare,
  Stock: TrendingUp,
  Settings: SettingsIcon,
  Trophy: Trophy,
  // CampusX Chain sub-link icons
  Overview: Activity,
  Degree: Award,
  Certificate: FileCheck,
  NFT: Sparkles,
  Wallet: Wallet,
  Contracts: Code,
  ResearchLink: FlaskConical,
  Transcript: CheckSquare,
  Identity: Fingerprint,
  Governance: GraduationCap,
  AnalyticsLink: BarChart2,
  Nodes: Server,
  Explorer: Globe,
  SettingsLink: SettingsIcon,
  Key: Key
};

const platformLinks = [
  { name: 'Control Overview', tab: 'overview', icon: 'Overview' },
  { name: 'Tenant Subscriptions', tab: 'subscriptions', icon: 'Finance' },
  { name: 'API Key Gateway', tab: 'gateway', icon: 'Key' },
  { name: 'Platform Integrations', tab: 'integrations', icon: 'SettingsLink' }
];

const erpLinks = [
  { name: 'Admissions', href: '/admissions', icon: 'Students' },
  { name: 'Students', href: '/students', icon: 'Students' },
  { name: 'Faculty Directory', href: '/faculty', icon: 'Faculty' },
  { name: 'Faculty Allocations', href: '/erp/faculty-allocation', icon: 'Faculty' },
  { name: 'Attendance', href: '/attendance', icon: 'Attendance' },
  { name: 'Examinations', href: '/exams', icon: 'Exams' },
  { name: 'Departments', href: '/departments', icon: 'Courses' },
  { name: 'Finance & Fees', href: '/finance', icon: 'Finance' },
  { name: 'Manual Payments (Admin)', href: '/finance/payments', icon: 'Finance' },
  { name: 'Student Payments', href: '/student/payments', icon: 'Wallet' },
  { name: 'Library', href: '/library', icon: 'Library' },
  { name: 'Hostel Management', href: '/hostel', icon: 'Hostel' },
  { name: 'Transportation', href: '/transport', icon: 'Transport' },
  { name: 'Research', href: '/research', icon: 'Research' },
  { name: 'Analytics', href: '/reports', icon: 'Analytics' },
  { name: 'AI Reports', href: '/ai-assistant', icon: 'AIAssistant' },
  { name: 'Workflow Center', href: '/users', icon: 'Placement' },
  { name: 'Assignments Hub', href: '/erp/assignments', icon: 'Certificate' },
  { name: 'Exams Allocation', href: '/erp/exams', icon: 'Exams' },
  { name: 'Results Hub', href: '/erp/results', icon: 'Degree' },
  { name: 'Semester Registration', href: '/erp/registration', icon: 'Certificate' }
];

const blockchainLinks = [
  { name: 'Academic Wallet', tab: 'wallet', icon: 'Wallet' },
  { name: 'Credentials', tab: 'degree', icon: 'Degree' },
  { name: 'NFT Degrees', tab: 'degree', icon: 'Degree' },
  { name: 'NFT Certificates', tab: 'certificate', icon: 'Certificate' },
  { name: 'Research Ledger', tab: 'research', icon: 'ResearchLink' },
  { name: 'Governance', tab: 'governance', icon: 'Governance' },
  { name: 'Explorer', tab: 'explorer', icon: 'Explorer' },
  { name: 'Node Monitoring', tab: 'nodes', icon: 'Nodes' },
  { name: 'Analytics', tab: 'analytics', icon: 'AnalyticsLink' },
  { name: 'Smart Contracts', tab: 'contracts', icon: 'Contracts' }
];

const sportsLinks = [
  { name: 'Athletes', href: '/sports/athletes', icon: 'Students' },
  { name: 'Teams', href: '/sports/teams', icon: 'Faculty' },
  { name: 'Matches', href: '/sports/matches', icon: 'Attendance' },
  { name: 'Tournaments', href: '/sports/tournaments', icon: 'Exams' },
  { name: 'Training', href: '/sports/training', icon: 'Courses' },
  { name: 'Scholarships', href: '/sports/scholarships', icon: 'Finance' },
  { name: 'Performance Analytics', href: '/sports/analytics', icon: 'Analytics' },
  { name: 'AI Coach', href: '/sports/ai-coach', icon: 'AIAssistant' },
  { name: 'Live Scores', href: '/sports/live', icon: 'Overview' },
  { name: 'Facilities', href: '/sports/facilities', icon: 'Hostel' },
  { name: 'Sports NFTs', href: '/sports/nfts', icon: 'NFT' }
];

const settingsLink = { name: 'Settings', href: '/settings', icon: 'Settings' };

function renderIcon(iconKey) {
  const IconComponent = iconMap[iconKey] || LayoutDashboard;
  return <IconComponent className="w-5 h-5 min-w-[20px] shrink-0" />;
}

const isSportsLinkAllowed = (role, linkName) => {
  const rolesMap = {
    'Overview': ['superadmin', 'admin', 'sports_director', 'coach', 'athlete', 'sports_parent', 'student', 'parent', 'faculty', 'medical_staff'],
    'Live Scores': ['superadmin', 'admin', 'sports_director', 'coach', 'athlete', 'sports_parent', 'student', 'parent', 'faculty', 'medical_staff'],
    'Matches': ['superadmin', 'admin', 'sports_director', 'coach', 'athlete', 'sports_parent', 'student', 'parent', 'faculty', 'medical_staff'],
    'Teams': ['superadmin', 'admin', 'sports_director', 'coach', 'athlete', 'student', 'faculty'],
    'Athletes': ['superadmin', 'admin', 'sports_director', 'coach', 'medical_staff'],
    'Fitness Logs': ['superadmin', 'admin', 'sports_director', 'coach', 'athlete', 'sports_parent', 'medical_staff'],
    'Performance Analytics': ['superadmin', 'admin', 'sports_director', 'coach', 'athlete', 'sports_parent'],
    'Training': ['superadmin', 'admin', 'sports_director', 'coach', 'athlete'],
    'AI Coach': ['superadmin', 'admin', 'sports_director', 'coach', 'athlete', 'student'],
    'Tournaments': ['superadmin', 'admin', 'sports_director', 'coach'],
    'Facilities': ['superadmin', 'admin', 'sports_director', 'coach'],
    'Scholarships': ['superadmin', 'admin', 'sports_director', 'athlete', 'sports_parent', 'student'],
    'Sports NFTs': ['superadmin', 'admin', 'sports_director', 'coach', 'athlete', 'sports_parent', 'student'],
    'Reports': ['superadmin', 'admin', 'sports_director'],
    'Settings': ['superadmin', 'admin', 'sports_director', 'coach', 'athlete']
  };
  const allowedRoles = rolesMap[linkName] || ['superadmin', 'admin'];
  return allowedRoles.includes(role);
};

function LayoutContent({ children, collapsed, setCollapsed, user, displayRole, handleLogout }) {
  const { students, faculty, courses, announcements } = useDb();
  const [searchFocused, setSearchFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifModal, setShowNotifModal] = useState(false);
  const [showQuickModal, setShowQuickModal] = useState(false);
  const [showAppSwitcher, setShowAppSwitcher] = useState(false);
  const [appSearch, setAppSearch] = useState('');
  const [starredApps, setStarredApps] = useState([]);
  const [recentApps, setRecentApps] = useState([]);
  const router = useRouter();
  const searchParams = useSearchParams();

  const [showFontSettingsModal, setShowFontSettingsModal] = useState(false);
  const [fontSettings, setFontSettings] = useState({
    fontSize: '14px',
    fontFamily: "'Inter', sans-serif",
    textColor: '#F9FAFB',
    accentColor: '#6366f1'
  });

  const applyFontSettings = (settings) => {
    if (typeof document === 'undefined') return;
    const root = document.documentElement;
    if (settings.fontSize) root.style.fontSize = settings.fontSize;
    if (settings.fontFamily) root.style.setProperty('--font-sans', settings.fontFamily);
    if (settings.textColor) root.style.setProperty('--text-main', settings.textColor);
    if (settings.accentColor) {
      root.style.setProperty('--primary', settings.accentColor);
      root.style.setProperty('--color-brand-primary', settings.accentColor);
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('campusx_font_settings');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          setFontSettings(parsed);
          applyFontSettings(parsed);
        } catch (e) {
          console.error(e);
        }
      }
    }
  }, []);

  const handleUpdateFontSettings = (newSettings) => {
    const updated = { ...fontSettings, ...newSettings };
    setFontSettings(updated);
    applyFontSettings(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem('campusx_font_settings', JSON.stringify(updated));
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const starred = localStorage.getItem('campusx_starred_apps');
      if (starred) {
        try { setStarredApps(JSON.parse(starred)); } catch (e) {}
      }
      const recents = localStorage.getItem('campusx_recent_apps');
      if (recents) {
        try { setRecentApps(JSON.parse(recents)); } catch (e) {}
      }
      
      const applySavedTheme = () => {
        const savedTheme = localStorage.getItem('campusx_theme') || 'light';
        document.documentElement.setAttribute('data-theme', savedTheme);
      };
      applySavedTheme();
      window.addEventListener('theme-changed', applySavedTheme);
      return () => window.removeEventListener('theme-changed', applySavedTheme);
    }
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      const isCmdK = (e.metaKey || e.ctrlKey) && e.key === 'k';
      const isCmdShiftS = (e.metaKey || e.ctrlKey) && e.shiftKey && e.key.toLowerCase() === 's';
      if (isCmdK || isCmdShiftS) {
        e.preventDefault();
        setShowAppSwitcher(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const toggleStarApp = (appName, e) => {
    e.stopPropagation();
    let updated;
    if (starredApps.includes(appName)) {
      updated = starredApps.filter(name => name !== appName);
    } else {
      updated = [...starredApps, appName];
    }
    setStarredApps(updated);
    localStorage.setItem('campusx_starred_apps', JSON.stringify(updated));
  };

  const handleLaunchApp = (app) => {
    let updated = [app.name, ...recentApps.filter(name => name !== app.name)].slice(0, 5);
    setRecentApps(updated);
    localStorage.setItem('campusx_recent_apps', JSON.stringify(updated));
    setShowAppSwitcher(false);
    window.location.href = app.href;
  };
  const [expandedMenus, setExpandedMenus] = useState({
    'User Management': true,
    'Academic': true,
    'Examination': false,
    'Finance': false
  });
  const [showFloatMenu, setShowFloatMenu] = useState(false);
  const [blockchainExpanded, setBlockchainExpanded] = useState(false);
  const [platformExpanded, setPlatformExpanded] = useState(false);
  const [erpExpanded, setErpExpanded] = useState(false);
  const [sportsExpanded, setSportsExpanded] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    if (pathname && pathname.startsWith('/blockchain')) {
      setBlockchainExpanded(true);
    }
    if (pathname && pathname.startsWith('/admin/platform')) {
      setPlatformExpanded(true);
    }
    if (pathname && (pathname === '/' || erpLinks.some(link => pathname === link.href || pathname.startsWith(link.href + '/')))) {
      setErpExpanded(true);
    }
    if (pathname && pathname.startsWith('/sports')) {
      setSportsExpanded(true);
    }
  }, [pathname]);

  // AI Copilot States
  const [showAiDrawer, setShowAiDrawer] = useState(false);
  const [aiInput, setAiInput] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiMessages, setAiMessages] = useState([
    { sender: 'ai', text: 'Hello! I am your persistent **CampusX AI Copilot**. How can I help you analyze attendance, forecast placement rates, or search research documentation today?' }
  ]);
  const messagesEndRef = useRef(null);

  const toggleMenu = (menuName) => {
    setExpandedMenus(prev => ({
      ...prev,
      [menuName]: !prev[menuName]
    }));
  };

  // Auto scroll AI drawer
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [aiMessages]);

  const handleAiSend = (textToSend) => {
    const promptText = textToSend || aiInput;
    if (!promptText.trim()) return;

    setAiMessages(prev => [...prev, { sender: 'user', text: promptText }]);
    if (!textToSend) setAiInput('');
    setAiLoading(true);

    setTimeout(() => {
      let response = "I've processed your natural language request against the university data mesh.";
      const query = promptText.toLowerCase();

      if (query.includes('attendance')) {
        response = `🤖 **Attendance Predictive Analysis**:\n- **Current Campus Attendance**: 87.4% average.\n- **Risk Factor Threshold**: Course CS202 is at 72.1% (Critical Alert).\n- **ML Forecast**: 4 students are currently predicted to fail attendance minimums by term end if interventions are not issued.`;
      } else if (query.includes('exam') || query.includes('performance') || query.includes('gpa')) {
        response = `🤖 **Academic Cohort Analysis**:\n- **Cohort CGPA Mean**: 3.28 GPA.\n- **Top Performer**: Aria Nakamura (CS) at 3.75 GPA.\n- **Academic Probation Alert**: 3 profiles identified below 2.0 GPA.\n- **Recommendation**: Trigger active tutoring alerts via CampusX Connect class groups.`;
      } else if (query.includes('placement') || query.includes('career')) {
        response = `🤖 **Placement Odds Model (TensorFlow)**:\n- **Current Placement rate forecast**: 88.5%\n- **Highest Probability major**: CS (94.2% placement odds).\n- **Critical Action items**: 5 students flagged with low internship scores. Recommended focus: Resume counseling module.`;
      } else if (query.includes('research') || query.includes('grant')) {
        response = `🤖 **Research Intelligence Engine**:\n- **Citations Index**: +12.4% year-over-year citation growth.\n- **Current Grants allocation**: $45,000 across ML and Energy projects.\n- **Recommended co-authoring groups**: CampusX Research feed co-authors.`;
      } else if (query.includes('finance') || query.includes('fee')) {
        response = `🤖 **Financial Insights Ledger**:\n- **Revenue Cleared**: 84.1% collected ($118,000).\n- **Tuition Default Risk**: 4.1% delay risk.\n- **Default Projections**: collections are trending +3% ahead of target.`;
      } else {
        response = `I searched the CampusX Connect RAG indexes. I found 4 matching references related to "${promptText}" across student directories and announcements. The semantic matching score is 94%. Let me know if I should compile a PDF report for this data!`;
      }

      setAiMessages(prev => [...prev, { sender: 'ai', text: response }]);
      setAiLoading(false);
    }, 1000);
  };

  // Search filter lists
  const query = searchQuery.toLowerCase().trim();
  const matchedStudents = query ? students.filter(s => s.name.toLowerCase().includes(query) || s.id.toLowerCase().includes(query)).slice(0, 4) : [];
  const matchedFaculty = query ? faculty.filter(f => f.name.toLowerCase().includes(query) || f.id.toLowerCase().includes(query)).slice(0, 4) : [];
  const matchedCourses = query ? courses.filter(c => c.title.toLowerCase().includes(query) || c.code.toLowerCase().includes(query)).slice(0, 4) : [];
  const totalMatches = matchedStudents.length + matchedFaculty.length + matchedCourses.length;

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest('.search-bar-container')) {
        setSearchFocused(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const handleSearchResultClick = (type, targetId) => {
    setSearchQuery('');
    setSearchFocused(false);
    if (type === 'students') {
      router.push('/students');
    } else if (type === 'faculty') {
      router.push('/faculty');
    } else if (type === 'courses') {
      router.push('/courses');
    }
  };

  const getLinkClass = (href) => {
    const targetHref = href === '/' ? (rolePermissions[user?.role]?.home || '/') : href;
    const active = targetHref === '/' ? pathname === '/' : pathname === targetHref || (targetHref !== '/' && pathname.startsWith(targetHref));
    return `nav-link flex items-center gap-3 p-3 rounded-xl transition-all cursor-pointer font-medium text-[0.925rem] ${
      active 
        ? 'bg-brand-primary/20 text-brand-text-main border border-brand-border/10 shadow-sm font-semibold' 
        : 'text-brand-text-muted hover:text-brand-text-main hover:bg-brand-primary/15'
    }`;
  };

  return (
    <div className="app-container flex min-h-screen bg-brand-bg-primary text-brand-text-main font-sans relative overflow-hidden">
      {/* Ambient Liquid Mesh Glowing Background */}
      <div className="liquid-mesh-bg">
        <div className="liquid-orb liquid-orb-cyan liquid-orb-1"></div>
        <div className="liquid-orb liquid-orb-indigo liquid-orb-2"></div>
        <div className="liquid-orb liquid-orb-violet liquid-orb-3"></div>
      </div>

      <aside 
        className="sidebar w-[280px] bg-brand-bg-secondary border-r border-brand-border flex flex-col fixed top-0 bottom-0 left-0 z-50 transition-[width] duration-300 backdrop-blur-xl"
        id="app-sidebar"
      >
        <div className="sidebar-logo h-[70px] flex items-center px-6 border-b border-brand-border gap-3 overflow-hidden">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="min-w-[32px] h-8 text-brand-primary">
            <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
            <path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5"/>
          </svg>
          <span className="font-display font-bold text-xl tracking-tight bg-gradient-to-br from-white to-brand-primary bg-clip-text text-transparent whitespace-nowrap">
            CAMPUSX CONNECT
          </span>
        </div>
        
        <nav className="sidebar-nav flex-1 p-6 px-4 overflow-y-auto flex flex-col gap-1.5 font-medium">
          {/* Dynamic Dashboard link (flat) */}
          <Link className={getLinkClass('/')} href={rolePermissions[user?.role]?.home || '/'} title="Dashboard">
            {renderIcon('Dashboard')}
            <span>Dashboard</span>
          </Link>

          {/* ERP PORTAL Collapsible Menu */}
          {erpLinks.some(link => isRouteAllowed(user?.role, link.href)) && (
            <>
              <div className="border-t border-brand-border/40 my-2 pt-2 text-[10px] font-bold text-brand-text-subtle uppercase tracking-wider pl-3">
                ERP Portal
              </div>
              <div className="flex flex-col gap-1">
                <button 
                  onClick={() => setErpExpanded(!erpExpanded)}
                  className="flex items-center justify-between p-3 rounded-xl hover:bg-brand-primary/15 text-brand-text-muted hover:text-brand-text-main font-semibold text-[0.925rem] cursor-pointer bg-transparent border-none text-left w-full outline-none"
                >
                  <div className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-brand-primary shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5"/></svg>
                    <span>ERP PORTAL</span>
                  </div>
                  <ChevronRight className={`w-4 h-4 text-brand-text-muted transition-transform duration-200 ${erpExpanded ? 'rotate-90' : ''}`} />
                </button>
                
                {erpExpanded && (
                  <div className="flex flex-col gap-1 pl-2 border-l border-brand-border/40 ml-5 mt-1 transition-all">
                    {(() => {
                      const erpHome = getErpHomeForRole(user?.role);
                      if (!isRouteAllowed(user?.role, erpHome)) return null;
                      const isActive = pathname === erpHome;
                      return (
                        <Link 
                          href={erpHome}
                          className={`flex items-center gap-2.5 p-2 rounded-lg transition-all cursor-pointer text-xs ${
                            isActive 
                              ? 'bg-brand-primary/20 text-brand-text-main font-semibold' 
                              : 'text-brand-text-muted hover:text-brand-text-main hover:bg-white/[0.02]'
                          }`}
                          title="Dashboard Index"
                        >
                          {renderIcon('Dashboard')}
                          <span className="truncate">Dashboard Index</span>
                        </Link>
                      );
                    })()}
                    {erpLinks.filter(link => isRouteAllowed(user?.role, link.href)).map((subLink) => {
                      const isActive = pathname === subLink.href || pathname.startsWith(subLink.href + '/');
                      
                      return (
                        <Link 
                          key={subLink.href}
                          href={subLink.href}
                          className={`flex items-center gap-2.5 p-2 rounded-lg transition-all cursor-pointer text-xs ${
                            isActive 
                              ? 'bg-brand-primary/20 text-brand-text-main font-semibold' 
                              : 'text-brand-text-muted hover:text-brand-text-main hover:bg-white/[0.02]'
                          }`}
                          title={subLink.name}
                        >
                          {renderIcon(subLink.icon)}
                          <span className="truncate">{subLink.name}</span>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            </>
          )}

          {/* CAMPUSX CHAIN Collapsible Menu */}
          {isRouteAllowed(user?.role, '/blockchain') && (
            <>
              <div className="border-t border-brand-border/40 my-2 pt-2 text-[10px] font-bold text-brand-text-subtle uppercase tracking-wider pl-3">
                Web3 Operating Layer
              </div>

              <div className="flex flex-col gap-1">
                <button 
                  onClick={() => setBlockchainExpanded(!blockchainExpanded)}
                  className="flex items-center justify-between p-3 rounded-xl hover:bg-brand-primary/15 text-brand-text-muted hover:text-brand-text-main font-semibold text-[0.925rem] cursor-pointer bg-transparent border-none text-left w-full outline-none"
                >
                  <div className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-brand-primary shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                    <span>CAMPUSX CHAIN</span>
                  </div>
                  <ChevronRight className={`w-4 h-4 text-brand-text-muted transition-transform duration-200 ${blockchainExpanded ? 'rotate-90' : ''}`} />
                </button>
                
                {blockchainExpanded && (
                  <div className="flex flex-col gap-1 pl-2 border-l border-brand-border/40 ml-5 mt-1 transition-all">
                    {blockchainLinks.map((subLink) => {
                      const activeTab = searchParams.get('tab') || 'overview';
                      const isActive = pathname === '/blockchain' && activeTab === subLink.tab;
                      
                      return (
                        <Link 
                          key={subLink.tab}
                          href={`/blockchain?tab=${subLink.tab}`}
                          className={`flex items-center gap-2.5 p-2 rounded-lg transition-all cursor-pointer text-xs ${
                            isActive 
                              ? 'bg-brand-primary/20 text-brand-text-main font-semibold' 
                              : 'text-brand-text-muted hover:text-brand-text-main hover:bg-white/[0.02]'
                          }`}
                          title={subLink.name}
                        >
                          {renderIcon(subLink.icon)}
                          <span className="truncate">{subLink.name}</span>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            </>
          )}

          {/* PLATFORM CONTROL CENTER Collapsible Menu */}
          {isRouteAllowed(user?.role, '/admin/platform') && (
            <>
              <div className="border-t border-brand-border/40 my-2 pt-2 text-[10px] font-bold text-brand-text-subtle uppercase tracking-wider pl-3">
                Platform Control
              </div>

              <div className="flex flex-col gap-1">
                <button 
                  onClick={() => setPlatformExpanded(!platformExpanded)}
                  className="flex items-center justify-between p-3 rounded-xl hover:bg-brand-primary/15 text-brand-text-muted hover:text-brand-text-main font-semibold text-[0.925rem] cursor-pointer bg-transparent border-none text-left w-full outline-none"
                >
                  <div className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-brand-accent-amber shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="9" y1="3" x2="9" y2="21"/><line x1="15" y1="3" x2="15" y2="21"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="3" y1="15" x2="21" y2="15"/></svg>
                    <span>PLATFORM CONTROL</span>
                  </div>
                  <ChevronRight className={`w-4 h-4 text-brand-text-muted transition-transform duration-200 ${platformExpanded ? 'rotate-90' : ''}`} />
                </button>
                
                {platformExpanded && (
                  <div className="flex flex-col gap-1 pl-2 border-l border-brand-border/40 ml-5 mt-1 transition-all">
                    {platformLinks.map((subLink) => {
                      const activeTab = searchParams.get('tab') || 'overview';
                      const isActive = pathname === '/admin/platform' && activeTab === subLink.tab;
                      
                      return (
                        <Link 
                          key={subLink.tab}
                          href={`/admin/platform?tab=${subLink.tab}`}
                          className={`flex items-center gap-2.5 p-2 rounded-lg transition-all cursor-pointer text-xs ${
                            isActive 
                              ? 'bg-brand-primary/20 text-brand-text-main font-semibold' 
                              : 'text-brand-text-muted hover:text-brand-text-main hover:bg-white/[0.02]'
                          }`}
                          title={subLink.name}
                        >
                          {renderIcon(subLink.icon)}
                          <span className="truncate">{subLink.name}</span>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            </>
          )}

          {/* SPORTS OS Collapsible Menu */}
          {isRouteAllowed(user?.role, '/sports') && (
            <>
              <div className="border-t border-brand-border/40 my-2 pt-2 text-[10px] font-bold text-brand-text-subtle uppercase tracking-wider pl-3">
                Sports OS
              </div>

              <div className="flex flex-col gap-1">
                <button 
                  onClick={() => setSportsExpanded(!sportsExpanded)}
                  className="flex items-center justify-between p-3 rounded-xl hover:bg-brand-primary/15 text-brand-text-muted hover:text-brand-text-main font-semibold text-[0.925rem] cursor-pointer bg-transparent border-none text-left w-full outline-none"
                >
                  <div className="flex items-center gap-3">
                    <Trophy className="w-5 h-5 text-brand-primary shrink-0" />
                    <span>SPORTS OS</span>
                  </div>
                  <ChevronRight className={`w-4 h-4 text-brand-text-muted transition-transform duration-200 ${sportsExpanded ? 'rotate-90' : ''}`} />
                </button>
                
                {sportsExpanded && (
                  <div className="flex flex-col gap-1 pl-2 border-l border-brand-border/40 ml-5 mt-1 transition-all">
                    {sportsLinks.filter(subLink => isSportsLinkAllowed(user?.role, subLink.name)).map((subLink) => {
                      const isActive = pathname === subLink.href || pathname.startsWith(subLink.href + '/');
                      
                      return (
                        <Link 
                          key={subLink.href}
                          href={subLink.href}
                          className={`flex items-center gap-2.5 p-2 rounded-lg transition-all cursor-pointer text-xs ${
                            isActive 
                              ? 'bg-brand-primary/20 text-brand-text-main font-semibold' 
                              : 'text-brand-text-muted hover:text-brand-text-main hover:bg-white/[0.02]'
                          }`}
                          title={subLink.name}
                        >
                          {renderIcon(subLink.icon)}
                          <span className="truncate">{subLink.name}</span>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            </>
          )}

          {/* Separator / Settings */}
          <div className="border-t border-brand-border/40 my-2 pt-2"></div>

          <Link className={getLinkClass(settingsLink.href)} href={settingsLink.href} title={settingsLink.name}>
            {renderIcon(settingsLink.icon)}
            <span>{settingsLink.name}</span>
          </Link>
        </nav>
        
        <div className="sidebar-user p-4 border-t border-brand-border flex items-center gap-3 overflow-hidden shrink-0">
          <div className="relative shrink-0">
            <img src={user?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150"} alt="Profile" className="w-10 h-10 rounded-full border-2 border-brand-border object-cover" />
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-brand-accent-emerald rounded-full border-2 border-brand-bg-secondary"></span>
          </div>
          <div className="user-info flex flex-col min-w-0">
            <span className="name font-semibold text-sm text-brand-text-main whitespace-nowrap truncate">{user?.name || 'Aria Nakamura'}</span>
            <span className="role text-[0.7rem] text-brand-text-muted font-medium truncate">{displayRole}</span>
            <span className="dept text-[0.65rem] text-brand-text-subtle truncate">{user?.dept || 'Computer Science'}</span>
          </div>
        </div>
      </aside>

      <main className="main-content main-wrapper flex-1 flex flex-col min-w-0">
        <header className="navbar h-[70px] bg-brand-bg-secondary/80 backdrop-blur-md border-b border-brand-border flex items-center justify-between px-8 sticky top-0 z-40">
          <div className="nav-left flex items-center gap-4">

            {/* Figma-style global search bar */}
            <div className="search-bar-container relative">
              <div className="search-bar flex items-center bg-brand-bg-tertiary border border-brand-border rounded-xl px-4 py-2 gap-2 w-80 focus-within:border-brand-primary/40 transition-all">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" className="text-brand-text-subtle"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                <input 
                  type="text" 
                  placeholder="Search students, faculty..." 
                  className="bg-transparent border-none text-brand-text-main outline-none w-full text-sm placeholder-brand-subtle"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setSearchFocused(true)}
                />
              </div>

              {searchFocused && (
                <div className="absolute left-0 right-0 top-full mt-2 bg-brand-bg-secondary border border-brand-border rounded-2xl shadow-2xl z-50 p-4 max-h-[380px] overflow-y-auto flex flex-col gap-3 text-left">
                  {!searchQuery ? (
                    <>
                      {/* Database telemetry */}
                      <div className="p-3 bg-brand-bg-tertiary rounded-xl border border-brand-border">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-semibold text-brand-text-muted font-display">Database Telemetry</span>
                          <span className="badge badge-success text-[0.65rem] py-0.5 text-brand-accent-emerald">✓ Online</span>
                        </div>
                        <div className="flex flex-col gap-1 text-xs text-brand-text-main">
                          <div className="flex justify-between">
                            <span className="text-brand-text-subtle">Students Loaded:</span>
                            <span className="font-bold font-mono">{students.length}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-brand-text-subtle">Faculty Members:</span>
                            <span className="font-bold font-mono">{faculty.length}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <span className="text-[0.65rem] font-semibold text-brand-text-subtle uppercase tracking-wider pl-1">Shortcuts</span>
                        <div className="grid grid-cols-2 gap-2">
                          <button className="btn btn-secondary py-2 px-3 text-xs justify-start font-medium cursor-pointer" onClick={() => { setSearchFocused(false); router.push('/'); }}>Dashboard</button>
                          <button className="btn btn-secondary py-2 px-3 text-xs justify-start font-medium cursor-pointer" onClick={() => { setSearchFocused(false); router.push('/students'); }}>Students</button>
                        </div>
                      </div>
                    </>
                  ) : totalMatches === 0 ? (
                    <div className="text-center py-4 text-brand-text-muted text-xs">No matching records found for "{searchQuery}"</div>
                  ) : (
                    <>
                      {matchedStudents.length > 0 && (
                        <div className="flex flex-col gap-1">
                          <span className="text-[0.65rem] font-semibold text-brand-text-subtle uppercase tracking-wider pl-1">Students</span>
                          {matchedStudents.map(s => (
                            <div key={s.id} className="flex items-center justify-between p-2 hover:bg-white/[0.03] rounded-lg cursor-pointer transition-all duration-150" onClick={() => handleSearchResultClick('students', s.id)}>
                              <span className="text-xs font-semibold text-brand-text-main">{s.name}</span>
                              <code className="text-[0.65rem] text-brand-text-subtle font-mono">{s.id}</code>
                            </div>
                          ))}
                        </div>
                      )}
                      {matchedFaculty.length > 0 && (
                        <div className="flex flex-col gap-1 border-t border-brand-border/40 pt-2">
                          <span className="text-[0.65rem] font-semibold text-brand-text-subtle uppercase tracking-wider pl-1">Faculty</span>
                          {matchedFaculty.map(f => (
                            <div key={f.id} className="flex items-center justify-between p-2 hover:bg-white/[0.03] rounded-lg cursor-pointer transition-all duration-150" onClick={() => handleSearchResultClick('faculty', f.id)}>
                              <span className="text-xs font-semibold text-brand-text-main">{f.name}</span>
                              <code className="text-[0.65rem] text-brand-text-subtle font-mono">{f.id}</code>
                            </div>
                          ))}
                        </div>
                      )}
                    </>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="nav-right flex items-center gap-5 relative">
            {/* App Switcher Toggle */}
            <button 
              className={`nav-action-btn border text-brand-text-muted w-10 h-10 rounded-full flex items-center justify-center relative hover:bg-brand-bg-tertiary hover:text-brand-text-main cursor-pointer transition-all ${showAppSwitcher ? 'border-brand-primary text-brand-primary bg-brand-primary/10 shadow-[0_0_15px_rgba(99,102,241,0.2)]' : 'border-brand-border'}`}
              onClick={() => setShowAppSwitcher(!showAppSwitcher)}
              title="App Switcher"
            >
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
            </button>

            {/* App Switcher Dropdown */}
            {showAppSwitcher && (
              <div className="absolute right-0 top-[55px] bg-brand-bg-secondary border border-brand-border rounded-2xl shadow-2xl p-4 w-[420px] z-[100] animate-fade-in flex flex-col gap-4">
                <div className="text-[10px] font-bold text-brand-text-subtle uppercase tracking-wider pb-1 border-b border-brand-border/40 flex items-center justify-between">
                  <span>CAMPUSX App Switcher 2.0</span>
                  <span className="text-[9px] lowercase font-normal opacity-60">cmd+k / cmd+shift+s</span>
                </div>

                {/* Search Bar */}
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search apps..."
                    value={appSearch}
                    onChange={(e) => setAppSearch(e.target.value)}
                    className="w-full bg-brand-bg-tertiary border border-brand-border rounded-xl text-xs text-brand-text-main placeholder-brand-text-subtle p-2.5 pl-8 outline-none focus:border-brand-primary/50 transition-all font-semibold"
                  />
                  <svg className="w-4 h-4 text-brand-text-subtle absolute left-2.5 top-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                  </svg>
                  {appSearch && (
                    <button onClick={() => setAppSearch('')} className="absolute right-2.5 top-2.5 text-brand-text-subtle hover:text-white bg-transparent border-none outline-none cursor-pointer">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* AI Recommendation Card */}
                {!appSearch && (() => {
                  const getAiRec = (role) => {
                    if (!role) return null;
                    const r = role.toLowerCase();
                    if (r === 'compliance_officer' || r === 'auditor') {
                      return {
                        app: allApps.COMPLIANCE,
                        reason: 'Security standard logs detect 3 unreviewed regulatory directives.'
                      };
                    }
                    if (r === 'superadmin' || r === 'platformadmin' || r === 'admin') {
                      return {
                        app: allApps.SOC,
                        reason: 'Enterprise security alert: intrusion logs are processing live telemetry.'
                      };
                    }
                    if (r === 'student' || r === 'placement_officer' || r === 'alumni') {
                      return {
                        app: allApps.CAREER,
                        reason: 'AI Path recommendations are updated for recruitment eligibility cycles.'
                      };
                    }
                    if (r === 'registrar') {
                      return {
                        app: allApps.ADMISSIONS,
                        reason: 'Pending portfolios: verify new student enrollment packets.'
                      };
                    }
                    return {
                      app: allApps.CONNECT,
                      reason: 'Connect desk: join current administrative channels.'
                    };
                  };
                  const rec = getAiRec(user?.role);
                  if (!rec) return null;
                  return (
                    <div className="p-3 rounded-xl bg-gradient-to-br from-brand-primary/10 via-brand-accent-cyan/5 to-transparent border border-brand-primary/20 relative overflow-hidden">
                      <div className="absolute top-0 right-0 px-2 py-0.5 bg-brand-primary/20 text-brand-primary rounded-bl-lg text-[8px] font-bold tracking-wider uppercase">
                        AI Recommended
                      </div>
                      <div className="flex items-start gap-2.5">
                        <div className="p-2 rounded-xl bg-brand-bg-tertiary border border-brand-border flex items-center justify-center shrink-0">
                          {rec.app.icon}
                        </div>
                        <div className="flex-1 min-w-0 text-left">
                          <div className="text-xs font-bold text-white flex items-center gap-1.5">
                            {rec.app.name}
                          </div>
                          <p className="text-[10px] text-brand-text-muted mt-1 leading-normal font-medium">
                            {rec.reason}
                          </p>
                          <button 
                            onClick={() => handleLaunchApp(rec.app)}
                            className="mt-2 text-[10px] font-semibold text-brand-accent-cyan hover:text-brand-accent-cyan/80 flex items-center gap-1 cursor-pointer bg-transparent border-none p-0 outline-none"
                          >
                            Launch Now <ChevronRight className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })()}

                {/* Starred / Favorites Apps */}
                {!appSearch && starredApps.length > 0 && (
                  <div className="text-left">
                    <div className="text-[10px] font-bold text-brand-text-subtle uppercase tracking-wider mb-2 flex items-center gap-1">
                      <svg className="w-3 h-3 text-brand-accent-amber fill-brand-accent-amber" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                      Favorites
                    </div>
                    <div className="grid grid-cols-4 gap-2">
                      {starredApps.map(name => {
                        const app = allApps[name];
                        if (!app) return null;
                        return (
                          <button 
                            key={name}
                            onClick={() => handleLaunchApp(app)}
                            className="flex flex-col items-center gap-1.5 p-1.5 rounded-xl hover:bg-brand-primary/10 border border-transparent text-center cursor-pointer transition-all group relative"
                          >
                            <div className="p-2 rounded-xl bg-brand-bg-tertiary border border-brand-border group-hover:border-brand-primary/30 flex items-center justify-center transition-all">
                              {app.icon}
                            </div>
                            <span className="text-[9px] font-bold text-brand-text-main truncate w-full">{app.name}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Recent Applications */}
                {!appSearch && recentApps.length > 0 && (
                  <div className="text-left">
                    <div className="text-[10px] font-bold text-brand-text-subtle uppercase tracking-wider mb-2 flex items-center gap-1">
                      <svg className="w-3 h-3 text-brand-text-subtle" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                      Recent Launchpad
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {recentApps.map(name => {
                        const app = allApps[name];
                        if (!app) return null;
                        return (
                          <button 
                            key={name}
                            onClick={() => handleLaunchApp(app)}
                            className="px-2.5 py-1 rounded-lg bg-brand-bg-tertiary border border-brand-border hover:border-brand-primary/30 text-[10px] text-brand-text-muted hover:text-white transition-all cursor-pointer flex items-center gap-1"
                          >
                            <span className="scale-75 shrink-0">{app.icon}</span>
                            <span>{app.name}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* All / Search Filtered Modules */}
                <div className="text-left">
                  <div className="text-[10px] font-bold text-brand-text-subtle uppercase tracking-wider mb-2">
                    {appSearch ? 'Filtered Modules' : 'All Workspace Applications'}
                  </div>
                  {(() => {
                    const apps = getVisibleAppsForRole(user?.role);
                    const filtered = apps.filter(a => a.name.toLowerCase().includes(appSearch.toLowerCase()));
                    if (filtered.length === 0) {
                      return <div className="text-center py-4 text-xs text-brand-text-muted font-medium">No matching modules found</div>;
                    }
                    return (
                      <div className="grid grid-cols-3 gap-2.5 max-h-[220px] overflow-y-auto pr-1">
                        {filtered.map(app => {
                          const isStarred = starredApps.includes(app.name);
                          return (
                            <div 
                              key={app.name} 
                              onClick={() => handleLaunchApp(app)}
                              className="flex flex-col items-center gap-1.5 p-2 rounded-xl hover:bg-brand-primary/10 border border-transparent text-center cursor-pointer transition-all group relative"
                            >
                              <button 
                                onClick={(e) => toggleStarApp(app.name, e)}
                                className="absolute top-1 right-1 p-0.5 rounded bg-brand-bg-secondary border border-brand-border text-brand-text-subtle hover:text-brand-accent-amber hover:border-brand-accent-amber/50 cursor-pointer z-10 transition-all opacity-0 group-hover:opacity-100"
                              >
                                <svg className={`w-2.5 h-2.5 ${isStarred ? 'text-brand-accent-amber fill-brand-accent-amber' : ''}`} viewBox="0 0 24 24" fill={isStarred ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
                                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                                </svg>
                              </button>
                              <div className="p-2.5 rounded-xl bg-brand-bg-tertiary border border-brand-border group-hover:border-brand-primary/30 flex items-center justify-center transition-all">
                                {app.icon}
                              </div>
                              <span className="text-[10px] font-bold text-brand-text-main truncate w-full">{app.name}</span>
                            </div>
                          );
                        })}
                      </div>
                    );
                  })()}
                </div>
              </div>
            )}

            {/* Notifications Toggle */}
            <button className="nav-action-btn border border-brand-border text-brand-text-muted w-10 h-10 rounded-full flex items-center justify-center relative hover:bg-brand-bg-tertiary hover:text-brand-text-main cursor-pointer transition-all" onClick={() => setShowNotifModal(true)}>
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
              <span className="badge-dot absolute top-1 right-1 w-2 h-2 bg-brand-accent-ruby rounded-full border-2 border-brand-bg-secondary"></span>
            </button>

            {/* Quick Actions Toggle */}
            <button className="nav-action-btn border border-brand-border text-brand-text-muted w-10 h-10 rounded-full flex items-center justify-center relative hover:bg-brand-bg-tertiary hover:text-brand-text-main cursor-pointer transition-all" onClick={() => setShowQuickModal(true)}>
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            </button>

            {/* Font & Appearance Settings Toggle */}
            <button 
              className="nav-action-btn border border-brand-border text-brand-text-muted w-10 h-10 rounded-full flex items-center justify-center relative hover:bg-brand-bg-tertiary hover:text-brand-text-main cursor-pointer transition-all" 
              onClick={() => setShowFontSettingsModal(true)}
              title="Font & Appearance Settings"
            >
              <SettingsIcon className="w-5 h-5 text-brand-primary" />
            </button>

            {/* Logout Toggle */}
            <button className="nav-action-btn border border-brand-border text-brand-text-muted w-10 h-10 rounded-full flex items-center justify-center relative hover:bg-brand-bg-tertiary hover:text-brand-text-main cursor-pointer" onClick={handleLogout} title="Sign Out">
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
            </button>
          </div>
        </header>

        <div className="page-content p-4 md:p-8 flex-1 flex flex-col gap-6 md:gap-8">
          {children}
        </div>

        <footer className="footer mt-auto py-6 px-8 border-t border-brand-border flex items-center justify-between text-sm text-brand-text-subtle">
          <span>© 2026 CampusX University Operating System</span>
          <span>Version 6.0.0-react</span>
        </footer>
      </main>

      {/* Persistent AI Copilot FAB */}
      <div className="fixed bottom-6 right-6 z-[1000]">
        <button 
          onClick={() => setShowAiDrawer(!showAiDrawer)}
          className="w-14 h-14 bg-gradient-to-tr from-brand-primary to-brand-accent-cyan text-white hover:opacity-90 shadow-lg rounded-full flex items-center justify-center cursor-pointer transition-all duration-300 transform hover:scale-105 active:scale-95"
          style={{ boxShadow: '0 0 25px rgba(99, 102, 241, 0.5)' }}
        >
          {showAiDrawer ? <X className="w-6 h-6" /> : <Bot className="w-6 h-6 animate-pulse" />}
        </button>
      </div>

      {/* Floating Action Hub (Admin Quick Actions FAB shifted to the left) */}
      {user?.role === 'admin' && (
        <div className="fixed bottom-6 right-24 z-50">
          <button 
            onClick={() => setShowFloatMenu(!showFloatMenu)}
            className="w-14 h-14 bg-brand-bg-tertiary border border-brand-border text-white hover:bg-brand-bg-secondary shadow-lg rounded-full flex items-center justify-center cursor-pointer transition-all duration-300 transform hover:scale-105"
          >
            <svg 
              className={`w-6 h-6 transition-transform duration-300 ${showFloatMenu ? 'rotate-45' : ''}`} 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2.5" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <line x1="12" y1="5" x2="12" y2="19"/>
              <line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
          </button>
          
          {showFloatMenu && (
            <div className="absolute bottom-16 right-0 bg-brand-bg-secondary border border-brand-border rounded-2xl shadow-2xl p-2 w-48 flex flex-col gap-1 animate-scale-up">
              <button 
                onClick={() => { setShowFloatMenu(false); router.push('/students'); }}
                className="flex items-center gap-2.5 p-2.5 rounded-xl hover:bg-white/[0.04] text-xs font-semibold text-brand-text-main text-left cursor-pointer transition-all"
              >
                <svg className="w-4 h-4 text-brand-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="16" y1="11" x2="22" y2="11"/></svg>
                Add Student
              </button>
              <button 
                onClick={() => { setShowFloatMenu(false); router.push('/faculty'); }}
                className="flex items-center gap-2.5 p-2.5 rounded-xl hover:bg-white/[0.04] text-xs font-semibold text-brand-text-main text-left cursor-pointer transition-all"
              >
                <svg className="w-4 h-4 text-brand-accent-cyan" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="11" x2="22" y2="11"/><line x1="19" y1="8" x2="19" y2="14"/></svg>
                Add Faculty
              </button>
              <button 
                onClick={() => { setShowFloatMenu(false); router.push('/courses'); }}
                className="flex items-center gap-2.5 p-2.5 rounded-xl hover:bg-white/[0.04] text-xs font-semibold text-brand-text-main text-left cursor-pointer transition-all"
              >
                <svg className="w-4 h-4 text-brand-accent-emerald" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M4 4.5A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5v-15z"/></svg>
                Add Course
              </button>
              <button 
                onClick={() => { setShowFloatMenu(false); router.push('/announcements'); }}
                className="flex items-center gap-2.5 p-2.5 rounded-xl hover:bg-white/[0.04] text-xs font-semibold text-brand-text-main text-left cursor-pointer transition-all"
              >
                <svg className="w-4 h-4 text-brand-accent-amber" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
                Send Notice
              </button>
              <button 
                onClick={() => { setShowFloatMenu(false); router.push('/reports'); }}
                className="flex items-center gap-2.5 p-2.5 rounded-xl hover:bg-brand-accent-ruby/10 hover:text-brand-accent-ruby text-xs font-semibold text-brand-text-main text-left cursor-pointer transition-all"
              >
                <svg className="w-4 h-4 text-brand-accent-ruby" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="9" y1="3" x2="9" y2="21"/><line x1="15" y1="3" x2="15" y2="21"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="3" y1="15" x2="21" y2="15"/></svg>
                Generate Report
              </button>
            </div>
          )}
        </div>
      )}

      {/* Sliding AI Copilot Drawer */}
      <AnimatePresence>
        {showAiDrawer && (
          <motion.div 
            initial={{ x: 380, opacity: 0.95 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 380, opacity: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-[380px] bg-brand-bg-secondary border-l border-brand-border shadow-2xl z-[1010] flex flex-col"
            style={{ borderLeftColor: 'rgba(99,102,241,0.2)' }}
          >
            {/* Drawer Header */}
            <div className="p-4 border-b border-brand-border flex items-center justify-between bg-brand-bg-tertiary/40">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-brand-primary/20 text-brand-primary rounded-lg">
                  <Sparkles className="w-5 h-5 text-brand-primary" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-sm text-brand-text-main">CampusX AI Copilot</h3>
                  <span className="text-[10px] text-brand-text-muted font-medium">Enterprise Assistant Desk</span>
                </div>
              </div>
              <button 
                onClick={() => setShowAiDrawer(false)}
                className="p-1.5 hover:bg-white/[0.04] text-brand-text-muted hover:text-white rounded-lg cursor-pointer transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Prompt Shortcuts Grid */}
            <div className="p-4 bg-brand-bg-primary/30 border-b border-brand-border flex flex-col gap-2">
              <span className="text-[9px] font-bold text-brand-text-subtle uppercase tracking-wider pl-1">Quick Predictive Actions</span>
              <div className="grid grid-cols-2 gap-2">
                <button 
                  onClick={() => handleAiSend("Run Attendance Risk Analysis")}
                  className="p-2 bg-brand-bg-tertiary border border-brand-border rounded-xl text-[10px] font-semibold text-brand-text-main hover:border-brand-primary/40 text-left transition-all flex items-center justify-between cursor-pointer"
                >
                  <span>Attendance Analysis</span>
                  <ChevronRight className="w-3 h-3 text-brand-primary shrink-0" />
                </button>
                <button 
                  onClick={() => handleAiSend("Forecast Student Grade Risks")}
                  className="p-2 bg-brand-bg-tertiary border border-brand-border rounded-xl text-[10px] font-semibold text-brand-text-main hover:border-brand-primary/40 text-left transition-all flex items-center justify-between cursor-pointer"
                >
                  <span>Academic Predictor</span>
                  <ChevronRight className="w-3 h-3 text-brand-accent-cyan shrink-0" />
                </button>
                <button 
                  onClick={() => handleAiSend("Check Placement Probability Rates")}
                  className="p-2 bg-brand-bg-tertiary border border-brand-border rounded-xl text-[10px] font-semibold text-brand-text-main hover:border-brand-primary/40 text-left transition-all flex items-center justify-between cursor-pointer"
                >
                  <span>Placement Odds</span>
                  <ChevronRight className="w-3 h-3 text-brand-accent-emerald shrink-0" />
                </button>
                <button 
                  onClick={() => handleAiSend("Generate Financial Ledger Insights")}
                  className="p-2 bg-brand-bg-tertiary border border-brand-border rounded-xl text-[10px] font-semibold text-brand-text-main hover:border-brand-primary/40 text-left transition-all flex items-center justify-between cursor-pointer"
                >
                  <span>Financial Insights</span>
                  <ChevronRight className="w-3 h-3 text-brand-accent-amber shrink-0" />
                </button>
              </div>
            </div>

            {/* Chat Messages viewport */}
            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3.5 bg-brand-bg-primary/10">
              {aiMessages.map((msg, i) => (
                <div key={i} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div 
                    className={`max-w-[85%] rounded-2xl p-3 text-xs leading-relaxed ${
                      msg.sender === 'user' 
                        ? 'bg-brand-primary text-white rounded-br-none shadow-md font-medium' 
                        : 'bg-brand-bg-tertiary border border-brand-border text-brand-text-main rounded-bl-none shadow-sm'
                    }`}
                  >
                    {/* Basic markdown renderer */}
                    {msg.text.split('\n').map((line, idx) => {
                      let text = line;
                      if (text.startsWith('- ')) {
                        return <li key={idx} className="ml-3 mt-1 list-disc text-brand-text-main">{text.replace('- ', '')}</li>;
                      }
                      if (text.startsWith('🤖 ') || text.startsWith('**')) {
                        // bold headings
                        const clean = text.replace(/\*\*/g, '');
                        return <strong key={idx} className="block font-semibold mt-1 mb-0.5 text-brand-primary">{clean}</strong>;
                      }
                      return <p key={idx} className={idx > 0 ? 'mt-1' : ''}>{text}</p>;
                    })}
                  </div>
                </div>
              ))}
              {aiLoading && (
                <div className="flex justify-start">
                  <div className="bg-brand-bg-tertiary border border-brand-border rounded-2xl rounded-bl-none p-3 text-xs flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-brand-primary rounded-full animate-bounce"></span>
                    <span className="w-1.5 h-1.5 bg-brand-primary rounded-full animate-bounce [animation-delay:0.2s]"></span>
                    <span className="w-1.5 h-1.5 bg-brand-primary rounded-full animate-bounce [animation-delay:0.4s]"></span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <form 
              onSubmit={(e) => { e.preventDefault(); handleAiSend(); }}
              className="p-3 border-t border-brand-border bg-brand-bg-tertiary/20 flex gap-2 items-center"
            >
              <input 
                type="text" 
                placeholder="Ask Copilot anything..."
                value={aiInput}
                onChange={(e) => setAiInput(e.target.value)}
                className="flex-1 bg-brand-bg-tertiary border border-brand-border rounded-xl text-xs text-brand-text-main placeholder-brand-text-subtle p-2.5 outline-none focus:border-brand-primary/40 text-brand-text-main"
              />
              <button 
                type="submit"
                className="p-2.5 bg-brand-primary hover:bg-brand-primary-hover text-white rounded-xl cursor-pointer transition-colors shadow-sm"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Notifications Desk Modal */}
      {showNotifModal && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center z-[1000] p-4">
          <div className="modal-container bg-brand-bg-secondary border border-brand-border rounded-[20px] w-[90%] max-w-[600px] max-h-[85vh] flex flex-col shadow-2xl animate-fade-in">
            <div className="modal-header p-5 px-6 border-b border-brand-border flex items-center justify-between">
              <h3 className="modal-title font-display text-xl font-semibold text-brand-text-main">Notifications Desk</h3>
              <button className="modal-close bg-transparent border-none text-brand-text-muted cursor-pointer text-2xl" onClick={() => setShowNotifModal(false)}>&times;</button>
            </div>
            <div className="modal-body p-6 overflow-y-auto flex-1 flex flex-col gap-3">
              <h4 className="text-brand-text-main font-display font-semibold mb-2">Recent Broadcasts & System Notices</h4>
              {announcements.length === 0 ? (
                <div className="text-brand-text-muted text-sm py-4">No active broadcasts.</div>
              ) : (
                announcements.map((ann, idx) => (
                  <div key={ann.id || idx} className="p-3 border-b border-brand-border flex gap-3 text-sm">
                    <div className="w-2.5 h-2.5 rounded-full mt-1.5 shrink-0" style={{ backgroundColor: ann.color || 'var(--color-brand-primary)' }}></div>
                    <div>
                      <h5 className="m-0 font-semibold text-brand-text-main">{ann.title}</h5>
                      <p className="mt-1 text-xs text-brand-text-muted">{ann.content}</p>
                      <span className="text-[0.7rem] text-brand-text-subtle block mt-1">Posted: {ann.date}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
            <div className="modal-footer p-4 px-6 border-t border-brand-border flex justify-end">
              <button className="btn btn-secondary cursor-pointer" onClick={() => setShowNotifModal(false)}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Quick Actions Modal */}
      {showQuickModal && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center z-[1000] p-4">
          <div className="modal-container bg-brand-bg-secondary border border-brand-border rounded-[20px] w-[90%] max-w-[600px] flex flex-col shadow-2xl animate-fade-in">
            <div className="modal-header p-5 px-6 border-b border-brand-border flex items-center justify-between">
              <h3 className="modal-title font-display text-xl font-semibold text-brand-text-main">Quick Action Hub</h3>
              <button className="modal-close bg-transparent border-none text-brand-text-muted cursor-pointer text-2xl" onClick={() => setShowQuickModal(false)}>&times;</button>
            </div>
            <div className="modal-body p-6">
              <div className="grid grid-cols-3 gap-4">
                <button className="btn btn-secondary p-5 flex flex-col items-center gap-2.5 text-center cursor-pointer" onClick={() => { setShowQuickModal(false); router.push('/students'); }}>
                  <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="16" y1="11" x2="22" y2="11"/></svg>
                  <span className="text-xs font-semibold">Add Student</span>
                </button>
                <button className="btn btn-secondary p-5 flex flex-col items-center gap-2.5 text-center cursor-pointer" onClick={() => { setShowQuickModal(false); router.push('/announcements'); }}>
                  <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
                  <span className="text-xs font-semibold">Post Notice</span>
                </button>
                <button className="btn btn-secondary p-5 flex flex-col items-center gap-2.5 text-center cursor-pointer" onClick={() => { setShowQuickModal(false); router.push('/finance'); }}>
                  <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="4" width="20" height="16" rx="2" ry="2"/><line x1="12" y1="1" x2="12" y2="23"/><line x1="2" y1="10" x2="22" y2="10"/></svg>
                  <span className="text-xs font-semibold">Record Fee</span>
                </button>
                <button className="btn btn-secondary p-5 flex flex-col items-center gap-2.5 text-center cursor-pointer" onClick={() => { setShowQuickModal(false); router.push('/attendance'); }}>
                  <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/></svg>
                  <span className="text-xs font-semibold">Attendance</span>
                </button>
                <button className="btn btn-primary p-5 flex flex-col items-center gap-2.5 text-center cursor-pointer" onClick={() => { setShowQuickModal(false); router.push('/connect'); }}>
                  <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                  </svg>
                  <span className="text-xs font-semibold text-white">CampusX Connect</span>
                </button>
                <button className="btn btn-primary p-5 flex flex-col items-center gap-2.5 text-center cursor-pointer" onClick={() => { setShowQuickModal(false); router.push('/blockchain'); }}>
                  <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                  <span className="text-xs font-semibold text-white">CampusX Chain</span>
                </button>
                <button className="btn btn-primary p-5 flex flex-col items-center gap-2.5 text-center cursor-pointer" onClick={() => { setShowQuickModal(false); router.push('/web3'); }}>
                  <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>
                  <span className="text-xs font-semibold text-white">CampusX Web3</span>
                </button>
              </div>
            </div>
            <div className="modal-footer p-4 px-6 border-t border-brand-border flex justify-end">
              <button className="btn btn-secondary cursor-pointer" onClick={() => setShowQuickModal(false)}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Font & Appearance Settings Modal */}
      {showFontSettingsModal && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/70 backdrop-blur-md animate-fade-in p-4">
          <div className="w-full max-w-lg bg-[#0c1424] border border-white/10 rounded-3xl p-6 shadow-2xl flex flex-col gap-6 relative overflow-hidden text-left animate-scale-up">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-brand-primary via-brand-accent-cyan to-brand-accent-emerald animate-pulse"></div>
            
            {/* Modal Header */}
            <div className="flex justify-between items-center border-b border-brand-border/40 pb-3.5">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-brand-primary/15 border border-brand-primary/30 rounded-xl text-brand-primary">
                  <SettingsIcon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold font-display text-white">Font & Appearance Settings</h3>
                  <p className="text-[11px] text-brand-text-muted">Customize font size, family, and color for all users</p>
                </div>
              </div>
              <button 
                onClick={() => setShowFontSettingsModal(false)}
                className="p-1.5 rounded-xl border border-white/10 text-slate-400 hover:text-white hover:bg-white/5 transition-all cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* 1. Base Font Size Control */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-white uppercase tracking-wider">Base Font Size</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { label: 'Small (12px)', size: '12px' },
                  { label: 'Standard (14px)', size: '14px' },
                  { label: 'Large (16px)', size: '16px' },
                  { label: 'Extra (18px)', size: '18px' }
                ].map((s) => (
                  <button
                    key={s.size}
                    onClick={() => handleUpdateFontSettings({ fontSize: s.size })}
                    className={`py-2 px-2 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                      fontSettings.fontSize === s.size
                        ? 'bg-gradient-to-r from-brand-primary to-indigo-600 text-white border-brand-primary shadow-md'
                        : 'bg-brand-bg-tertiary text-brand-text-muted hover:text-white border-brand-border/60'
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Font Family Control */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-white uppercase tracking-wider">Font Family</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {[
                  { label: 'Inter (Modern)', font: "'Inter', sans-serif" },
                  { label: 'Space Grotesk (Tech)', font: "'Space Grotesk', sans-serif" },
                  { label: 'Roboto Mono (Code)', font: "'Roboto Mono', monospace" },
                  { label: 'Outfit (Geometric)', font: "'Outfit', sans-serif" },
                  { label: 'System (Default)', font: "-apple-system, BlinkMacSystemFont, sans-serif" }
                ].map((f) => (
                  <button
                    key={f.font}
                    onClick={() => handleUpdateFontSettings({ fontFamily: f.font })}
                    className={`py-2 px-2.5 rounded-xl text-xs font-semibold transition-all border cursor-pointer truncate ${
                      fontSettings.fontFamily === f.font
                        ? 'bg-gradient-to-r from-brand-primary to-indigo-600 text-white border-brand-primary shadow-md'
                        : 'bg-brand-bg-tertiary text-brand-text-muted hover:text-white border-brand-border/60'
                    }`}
                    style={{ fontFamily: f.font }}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 3. Font & Accent Color Control */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-white uppercase tracking-wider">Font & Accent Color Tone</label>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                {[
                  { label: 'Indigo', accent: '#6366f1', text: '#F9FAFB' },
                  { label: 'Cyan', accent: '#06b6d4', text: '#06B6D4' },
                  { label: 'Emerald', accent: '#10b981', text: '#34D399' },
                  { label: 'Rose', accent: '#f43f5e', text: '#FB7185' },
                  { label: 'Amber', accent: '#f59e0b', text: '#FBBF24' },
                  { label: 'Crystal', accent: '#ffffff', text: '#FFFFFF' }
                ].map((c) => (
                  <button
                    key={c.label}
                    onClick={() => handleUpdateFontSettings({ accentColor: c.accent, textColor: c.text })}
                    className={`p-2 rounded-xl border flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                      fontSettings.accentColor === c.accent
                        ? 'border-white bg-white/10 shadow-md scale-105'
                        : 'border-white/10 bg-brand-bg-tertiary hover:border-white/30'
                    }`}
                  >
                    <div className="w-5 h-5 rounded-full border border-white/20 shadow-sm" style={{ backgroundColor: c.accent }} />
                    <span className="text-[10px] font-bold text-white">{c.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Live Typography Preview Box */}
            <div className="p-3.5 bg-brand-bg-tertiary/80 border border-brand-border/60 rounded-2xl flex flex-col gap-1">
              <span className="text-[10px] font-mono text-brand-accent-cyan font-bold uppercase tracking-wider">Live Typography Preview</span>
              <p className="text-sm font-semibold text-white truncate" style={{ fontFamily: fontSettings.fontFamily, fontSize: fontSettings.fontSize }}>
                CampusX University OS — Next-Generation Academic Portal
              </p>
            </div>

            {/* Save / Close Button */}
            <div className="flex justify-end pt-2 border-t border-white/10">
              <button
                onClick={() => setShowFontSettingsModal(false)}
                className="btn btn-primary px-6 py-2 rounded-xl text-xs font-bold cursor-pointer"
              >
                Apply & Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function LayoutShell({ children }) {
  const [collapsed, setCollapsed] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.triggerLogout = () => {
        setShowLogoutModal(true);
      };
    }
    return () => {
      if (typeof window !== 'undefined') {
        delete window.triggerLogout;
      }
    };
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      let session = sessionStorage.getItem('campusx_erp_session');
      if (!session && pathname !== '/login' && pathname !== '/auth') {
        setUser(null);
        setLoading(false);
        router.push('/login');
        return;
      }

      if (session) {
        try {
          const parsedUser = JSON.parse(session);
          setUser(parsedUser);
        } catch (err) {
          console.error('Failed to parse session:', err);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    }
  }, [pathname, router]);

  const handleLogout = () => {
    setShowLogoutModal(true);
  };

  if (loading) {
    return (
      <div className="bg-brand-bg-primary text-brand-text-main font-sans min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-brand-primary/30 border-t-brand-primary rounded-full animate-spin"></div>
          <span className="text-sm font-semibold text-brand-text-muted">Loading CampusX Portal...</span>
        </div>
      </div>
    );
  }

  if (pathname === '/login' || pathname === '/auth') {
    return <>{children}</>;
  }

  // Zero-Trust Route Guard: verify if role has clearance for this path
  const logoutModalElement = showLogoutModal && (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="w-[400px] p-6 bg-[#0c1424] border border-white/10 rounded-2xl shadow-2xl flex flex-col gap-5 text-center relative overflow-hidden animate-scale-up">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-rose-500 via-amber-500 to-rose-500 animate-pulse"></div>
        <div className="w-12 h-12 rounded-full bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-500 mx-auto shadow-[0_0_15px_rgba(244,63,94,0.15)]">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
        </div>
        <div className="flex flex-col gap-2">
          <h3 className="text-xl font-bold text-white font-display">Sign Out</h3>
          <p className="text-sm text-slate-400 leading-relaxed font-sans">Are you sure you want to sign out of CampusX University ERP?</p>
        </div>
        <div className="flex gap-4">
          <button className="px-4 py-2.5 rounded-xl border border-white/10 text-white hover:bg-white/5 flex-1 transition-all cursor-pointer font-medium text-sm" onClick={() => setShowLogoutModal(false)}>
            Cancel
          </button>
          <button className="px-4 py-2.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white flex-1 transition-all cursor-pointer font-medium text-sm" onClick={() => {
            sessionStorage.removeItem('campusx_erp_session');
            window.location.href = '/login';
          }}>
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );

  if (user && !isRouteAllowed(user.role, pathname)) {
    return (
      <div className="bg-[#050b18] text-brand-text-main font-sans min-h-screen flex items-center justify-center p-6 relative overflow-hidden">
        <div className="orb orb-1 opacity-40"></div>
        <div className="orb orb-2 opacity-30"></div>
        <div className="card max-w-lg w-full p-8 bg-brand-bg-secondary/60 backdrop-blur-md border border-brand-accent-ruby/20 rounded-3xl shadow-2xl relative overflow-hidden text-center flex flex-col items-center gap-6 z-10">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-brand-accent-ruby via-brand-accent-amber to-brand-accent-ruby animate-pulse"></div>
          <div className="w-16 h-16 rounded-full bg-brand-accent-ruby/10 border border-brand-accent-ruby/20 flex items-center justify-center text-brand-accent-ruby mb-2 shadow-[0_0_15px_rgba(239,68,68,0.2)]">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-8 h-8"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
          </div>
          <h2 className="text-2xl font-bold font-display text-white">403 Access Denied</h2>
          <p className="text-sm text-brand-text-muted leading-relaxed">
            Your role (<strong className="text-brand-accent-ruby font-semibold uppercase">{user.role}</strong>) does not have authorization clearance to access the path <code className="text-brand-accent-cyan bg-brand-bg-tertiary/80 px-1.5 py-0.5 rounded font-mono text-xs">{pathname}</code>.
          </p>
          <div className="flex gap-4 w-full mt-2">
            <button className="btn btn-secondary flex-1 cursor-pointer" onClick={() => setShowLogoutModal(true)}>
              Sign Out
            </button>
            <button className="btn btn-primary flex-1 cursor-pointer" onClick={() => { window.location.href = rolePermissions[user.role]?.home || '/'; }}>
              Go to Workspace
            </button>
          </div>
        </div>
        {logoutModalElement}
      </div>
    );
  }

  if (
    pathname === '/connect' || pathname.startsWith('/connect/') ||
    pathname === '/web3' || pathname.startsWith('/web3/') ||
    pathname === '/sports' || pathname.startsWith('/sports/') ||
    pathname === '/chain' || pathname.startsWith('/chain/') ||
    pathname === '/soc' || pathname.startsWith('/soc/') ||
    pathname === '/studio' || pathname.startsWith('/studio/') ||
    pathname === '/twin' || pathname.startsWith('/twin/') ||
    pathname === '/iot' || pathname.startsWith('/iot/') ||
    pathname === '/career' || pathname.startsWith('/career/') ||
    pathname === '/admissions' || pathname.startsWith('/admissions/') ||
    pathname === '/procurement' || pathname.startsWith('/procurement/') ||
    pathname === '/compliance' || pathname.startsWith('/compliance/') ||
    pathname === '/market' || pathname.startsWith('/market/') ||
    pathname === '/stock' || pathname.startsWith('/stock/')
  ) {
    return (
      <DbProvider>
        {children}
        {logoutModalElement}
      </DbProvider>
    );
  }

  const displayRoleMap = {
    superadmin: 'Global Super Admin',
    platformadmin: 'Platform Admin',
    admin: 'University Admin',
    registrar: 'Registrar Officer',
    dean: 'Dean of Faculty',
    hod: 'Department Head (HOD)',
    faculty: 'Faculty Member',
    finance_manager: 'Finance Manager',
    research_coordinator: 'Research Coordinator',
    placement_officer: 'Placement Officer',
    student: 'Student',
    parent: 'Parent',
    alumni: 'Alumni',
    recruiter: 'Recruiter',
    sports_director: 'Sports Director',
    coach: 'Sports Head Coach',
    athlete: 'Student Athlete',
    sports_parent: 'Athlete Parent',
    department_admin: 'Department Admin',
    library_admin: 'Library Admin',
    hostel_admin: 'Hostel Admin',
    transport_admin: 'Transport Admin',
    medical_staff: 'Medical Staff',
    guest: 'Guest User',
    consultant: 'Consultant',
    auditor: 'External Auditor',
    compliance_officer: 'Compliance Officer',
    course_coordinator: 'Course Coordinator',
    controller_of_examination: 'Controller of Examination'
  };
  const displayRole = displayRoleMap[user?.role] || 'User';

  return (
    <DbProvider>
      <LayoutContent 
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        user={user}
        displayRole={displayRole}
        handleLogout={handleLogout}
      >
        {children}
      </LayoutContent>
      {logoutModalElement}
    </DbProvider>
  );
}
