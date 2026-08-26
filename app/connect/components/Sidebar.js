'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useConnect } from '../ConnectContext';
import { 
  Home, 
  Compass, 
  Users, 
  FlaskConical, 
  MessageCircle, 
  Bell, 
  Bookmark, 
  Calendar, 
  Trophy, 
  User, 
  Menu,
  LayoutDashboard,
  Shield,
  TrendingUp,
  Bot
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Sidebar() {
  const router = useRouter();
  const { activeView, setActiveView, notifications, setMessengerOpen } = useConnect();
  const [showSwitcher, setShowSwitcher] = useState(false);
  const [dashboardUrl, setDashboardUrl] = useState('/');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const session = sessionStorage.getItem('campusx_erp_session');
      if (session) {
        const user = JSON.parse(session);
        const roleHomeMap = {
          superadmin: '/admin/global',
          platformadmin: '/admin/platform',
          admin: '/erp/admin',
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
          department_admin: '/'
        };
        setDashboardUrl(roleHomeMap[user.role] || '/');
      }
    }
  }, []);
  
  const navItems = [
    { view: 'home', label: 'Home', icon: Home, href: '/connect' },
    { view: 'explore', label: 'Explore', icon: Compass },
    { view: 'communities', label: 'Communities', icon: Users, href: '/connect/channels' },
    { view: 'research', label: 'Research', icon: FlaskConical },
    { view: 'messages', label: 'Messages', icon: MessageCircle, href: '/connect/messages' },
    { view: 'notifications', label: 'Notifications', icon: Bell, badge: notifications.filter(n => n.unread).length, href: '/connect/notifications' },
    { view: 'bookmarks', label: 'Bookmarks', icon: Bookmark },
    { view: 'events', label: 'Events', icon: Calendar, href: '/connect/calendar' },
    { view: 'achievements', label: 'Achievements', icon: Trophy },
    { view: 'profile', label: 'Profile', icon: User, href: '/connect/profile' },
  ];

  const appSwitcherItems = [
    { name: 'ERP Portal', href: dashboardUrl, icon: LayoutDashboard, color: 'text-indigo-400' },
    { name: 'CampusX Connect', href: '/connect', icon: MessageCircle, color: 'text-brand-primary' },
    { name: 'CampusX Chain', href: '/blockchain', icon: Shield, color: 'text-cyan-400' },
    { name: 'CampusX Web3', href: '/web3', icon: Home, color: 'text-indigo-400' },
    { name: 'Market Intel', href: '/stock', icon: TrendingUp, color: 'text-amber-400' },
    { name: 'AI Assistant', href: '/ai-assistant', icon: Bot, color: 'text-emerald-400' },
    { name: 'Research Console', href: '/research', icon: FlaskConical, color: 'text-rose-400' },
  ];

  const handleNavClick = (item) => {
    setActiveView(item.view);
    if (item.view === 'messages' || item.href) {
      setMessengerOpen(true);
      if (item.href) {
        router.push(item.href);
      }
    }
  };

  return (
    <aside className="w-20 md:w-20 fixed top-0 bottom-0 left-0 bg-brand-bg-secondary/90 backdrop-blur-3xl border-r border-brand-border/60 flex flex-col items-center py-6 justify-between z-50 shadow-xl">
      
      {/* Top Left Logo Display */}
      <div className="flex flex-col items-center gap-1.5 cursor-pointer group" onClick={() => setActiveView('home')}>
        <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-brand-primary via-indigo-600 to-brand-accent-cyan flex items-center justify-center shadow-[0_0_20px_rgba(99,102,241,0.4)] group-hover:scale-105 transition-transform duration-300">
          <span className="font-display font-black text-base text-white tracking-wider">CX</span>
        </div>
        <span className="text-[9px] font-extrabold text-brand-text-muted tracking-widest uppercase group-hover:text-brand-primary transition-colors">CONNECT</span>
      </div>

      {/* Sidebar Navigation - Icons Only */}
      <nav className="flex-1 w-full flex flex-col items-center gap-3.5 mt-8 px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.view;
          
          return (
            <div key={item.view} className="relative group w-full flex justify-center">
              <button
                onClick={() => handleNavClick(item)}
                className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all relative border ${
                  isActive 
                    ? 'bg-brand-primary/10 border-brand-primary/20 text-brand-primary' 
                    : 'bg-transparent border-transparent text-slate-400 hover:text-white hover:bg-white/[0.03]'
                }`}
              >
                <Icon className="w-5.5 h-5.5" />
                
                {/* Notification Badge */}
                {item.badge > 0 && (
                  <span className="absolute top-2.5 right-2.5 w-4 h-4 bg-rose-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center border border-[#0B1736]">
                    {item.badge}
                  </span>
                )}
                
                {/* Active side indicator */}
                {isActive && (
                  <motion.div 
                    layoutId="activeIndicator"
                    className="absolute left-0 w-1 h-6 bg-brand-primary rounded-r-md"
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
              </button>

              {/* Spacing Tooltip */}
              <div className="absolute left-16 top-1/2 -translate-y-1/2 bg-[#102043] border border-white/5 text-white text-xs font-semibold px-2.5 py-1.5 rounded-lg shadow-xl opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 pointer-events-none transition-all duration-150 z-50 whitespace-nowrap">
                {item.label}
              </div>
            </div>
          );
        })}
      </nav>

      {/* Bottom Switcher Menu Trigger */}
      <div className="relative group w-full flex flex-col items-center gap-4 px-2">
        <button
          onClick={() => setShowSwitcher(!showSwitcher)}
          className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all border ${
            showSwitcher 
              ? 'bg-brand-primary/10 border-brand-primary/20 text-brand-primary' 
              : 'bg-transparent border-transparent text-slate-400 hover:text-white hover:bg-white/[0.03]'
          }`}
        >
          <Menu className="w-5.5 h-5.5" />
        </button>

        {/* App Switcher Tooltip */}
        {!showSwitcher && (
          <div className="absolute left-16 bottom-6 bg-[#102043] border border-white/5 text-white text-xs font-semibold px-2.5 py-1.5 rounded-lg shadow-xl opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 pointer-events-none transition-all duration-150 z-50 whitespace-nowrap">
            App Switcher
          </div>
        )}

        {/* Switcher Dropdown (Framer Motion) */}
        <AnimatePresence>
          {showSwitcher && (
            <>
              {/* Overlay Backdrop to close switcher */}
              <div className="fixed inset-0 z-40 bg-transparent" onClick={() => setShowSwitcher(false)} />
              
              <motion.div
                initial={{ opacity: 0, scale: 0.9, x: 20, y: 50 }}
                animate={{ opacity: 1, scale: 1, x: 0, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, x: 20, y: 50 }}
                className="absolute left-16 bottom-0 w-56 bg-[#102043] border border-white/5 rounded-2xl shadow-2xl p-2 z-50 flex flex-col gap-1 connect-glass"
              >
                <div className="px-3 py-1.5 border-b border-white/5 mb-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">CampusX Switcher</span>
                </div>
                {appSwitcherItems.map((app) => {
                  const AppIcon = app.icon;
                  return (
                    <Link
                      key={app.name}
                      href={app.href}
                      onClick={() => setShowSwitcher(false)}
                      className="flex items-center gap-2.5 p-2 hover:bg-white/[0.04] rounded-xl text-left cursor-pointer transition-all duration-150"
                    >
                      <AppIcon className={`w-4 h-4 ${app.color}`} />
                      <span className="text-xs font-semibold text-white">{app.name}</span>
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
