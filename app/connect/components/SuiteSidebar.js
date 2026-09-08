'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  MessageSquare, 
  Video, 
  PhoneCall, 
  Layers, 
  MonitorPlay, 
  LayoutDashboard, 
  Shield, 
  TrendingUp, 
  Bot, 
  FlaskConical,
  Menu
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function SuiteSidebar() {
  const pathname = usePathname();
  const [showSwitcher, setShowSwitcher] = useState(false);
  const [dashboardUrl, setDashboardUrl] = useState('/');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const session = sessionStorage.getItem('campusx_erp_session');
      if (session) {
        const user = JSON.parse(session);
        const roleHomeMap = {
          superadmin: '/',
          platformadmin: '/',
          admin: '/',
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
          department_admin: '/',
          library_admin: '/library',
          hostel_admin: '/hostel',
          transport_admin: '/transport',
          medical_staff: '/sports',
          guest: '/',
          consultant: '/reports',
          auditor: '/reports',
          compliance_officer: '/compliance'
        };
        setDashboardUrl(roleHomeMap[user.role] || '/');
      }
    }
  }, []);

  const suiteLinks = [
    { name: 'Messaging', href: '/connect/messages', icon: MessageSquare, color: 'hover:text-indigo-400' },
    { name: 'Meetings', href: '/connect/meetings', icon: Video, color: 'hover:text-cyan-400' },
    { name: 'Workspaces', href: '/connect/workspaces', icon: Layers, color: 'hover:text-rose-400' },
    { name: 'Remote Control', href: '/connect/remote-control', icon: MonitorPlay, color: 'hover:text-amber-400' }
  ];

  const appSwitcherItems = [
    { name: 'ERP Portal', href: dashboardUrl, icon: LayoutDashboard, color: 'text-indigo-400' },
    { name: 'CampusX Connect', href: '/connect', icon: MessageSquare, color: 'text-brand-primary' },
    { name: 'CampusX Chain', href: '/blockchain', icon: Shield, color: 'text-cyan-400' },
    { name: 'CampusX Web3', href: '/web3', icon: Layers, color: 'text-brand-primary' },
    { name: 'Market Intel', href: '/stock', icon: TrendingUp, color: 'text-amber-400' },
    { name: 'AI Assistant', href: '/ai-assistant', icon: Bot, color: 'text-emerald-400' },
    { name: 'Research Console', href: '/research', icon: FlaskConical, color: 'text-rose-400' },
  ];

  return (
    <aside className="w-20 fixed top-0 bottom-0 left-0 bg-white/95 backdrop-blur-3xl border-r border-slate-200/80 flex flex-col items-center py-6 justify-between z-50 select-none shadow-[2px_0_20px_rgba(0,0,0,0.02)]">
      
      {/* Platform Initials Logo */}
      <Link href="/connect" className="flex flex-col items-center gap-1.5 cursor-pointer group">
        <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-700 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform duration-300">
          <span className="font-display font-black text-base text-white tracking-wider">CX</span>
        </div>
        <span className="text-[9px] font-extrabold text-slate-400 tracking-widest uppercase group-hover:text-indigo-600 transition-colors">SUITE</span>
      </Link>

      {/* Main Suite Toggles */}
      <nav className="flex-1 w-full flex flex-col items-center gap-4.5 mt-10 px-2">
        {suiteLinks.map((link) => {
          const LinkIcon = link.icon;
          const isActive = pathname === link.href;

          return (
            <div key={link.href} className="relative group w-full flex justify-center">
              <Link
                href={link.href}
                className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all relative border ${
                  isActive 
                    ? 'bg-indigo-50 border-indigo-200 text-indigo-600 shadow-xs' 
                    : `bg-transparent border-transparent text-slate-400 hover:text-slate-900 hover:bg-slate-100/80 hover:border-slate-200/60`
                }`}
              >
                <LinkIcon className="w-5 h-5" />
                
                {/* Active Indicator bar */}
                {isActive && (
                  <motion.div 
                    layoutId="suiteActiveIndicator"
                    className="absolute left-0 w-1.5 h-6 bg-indigo-600 rounded-r-full shadow-xs"
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
              </Link>

              {/* Tooltip */}
              <div className="absolute left-16 top-1/2 -translate-y-1/2 bg-slate-900 border border-slate-800 text-white text-xs font-semibold px-3 py-1.5 rounded-xl shadow-xl opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 pointer-events-none transition-all duration-150 z-50 whitespace-nowrap">
                {link.name}
              </div>
            </div>
          );
        })}
      </nav>

      {/* App Switcher Dropdown */}
      <div className="relative group w-full flex flex-col items-center gap-4 px-2">
        <button
          onClick={() => setShowSwitcher(!showSwitcher)}
          className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all border cursor-pointer ${
            showSwitcher 
              ? 'bg-indigo-50 border-indigo-200 text-indigo-600 shadow-xs' 
              : 'bg-transparent border-transparent text-slate-400 hover:text-slate-900 hover:bg-slate-100/80'
          }`}
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* App Switcher Dropdown Box */}
        <AnimatePresence>
          {showSwitcher && (
            <>
              <div className="fixed inset-0 z-40 bg-transparent" onClick={() => setShowSwitcher(false)} />
              
              <motion.div
                initial={{ opacity: 0, scale: 0.9, x: 20, y: 50 }}
                animate={{ opacity: 1, scale: 1, x: 0, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, x: 20, y: 50 }}
                className="absolute left-16 bottom-0 w-56 bg-white border border-slate-200 rounded-2xl shadow-2xl p-2 z-50 flex flex-col gap-1"
              >
                <div className="px-3 py-1.5 border-b border-slate-100 mb-1 text-left">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">CampusX Switcher</span>
                </div>
                {appSwitcherItems.map((app) => {
                  const AppIcon = app.icon;
                  return (
                    <Link
                      key={app.name}
                      href={app.href}
                      onClick={() => setShowSwitcher(false)}
                      className="flex items-center gap-2.5 p-2.5 hover:bg-slate-50 rounded-xl text-left cursor-pointer transition-all duration-150 group"
                    >
                      <AppIcon className="w-4 h-4 text-indigo-600 group-hover:scale-110 transition-transform" />
                      <span className="text-xs font-semibold text-slate-800">{app.name}</span>
                    </Link>
                  );
                })}
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>

    </aside>
  );
}
