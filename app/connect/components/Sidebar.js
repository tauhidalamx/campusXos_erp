'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
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
  LayoutDashboard, 
  CheckSquare, 
  BarChart2, 
  Video, 
  LogOut,
  ArrowLeft
} from 'lucide-react';

export default function Sidebar() {
  const { activeView, setActiveView, notifications, currentUser } = useConnect();
  const [dashboardUrl, setDashboardUrl] = useState('/');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const session = sessionStorage.getItem('campusx_erp_session') || localStorage.getItem('campusx_erp_session');
      if (session) {
        try {
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
            department_admin: '/'
          };
          setDashboardUrl(roleHomeMap[user.role] || '/');
        } catch (e) {}
      }
    }
  }, []);

  const unreadCount = notifications.filter(n => n.unread).length;

  const navItems = [
    { 
      view: 'home', 
      label: 'Feed Stream', 
      icon: Home, 
      color: 'text-indigo-700', 
      bgActive: 'bg-indigo-50 text-indigo-950 border-indigo-300 shadow-[0_2px_8px_rgba(79,70,229,0.14)] font-bold', 
      hoverBg: 'hover:bg-indigo-50/80 hover:text-indigo-700 hover:border-indigo-200/90',
      iconActive: 'text-indigo-600',
      iconDefault: 'text-indigo-500 group-hover:text-indigo-600',
      indicator: 'bg-indigo-600'
    },
    { 
      view: 'explore', 
      label: 'Explore', 
      icon: Compass, 
      color: 'text-sky-700', 
      bgActive: 'bg-sky-50 text-sky-950 border-sky-300 shadow-[0_2px_8px_rgba(14,165,233,0.14)] font-bold', 
      hoverBg: 'hover:bg-sky-50/80 hover:text-sky-700 hover:border-sky-200/90',
      iconActive: 'text-sky-600',
      iconDefault: 'text-sky-500 group-hover:text-sky-600',
      indicator: 'bg-sky-600'
    },
    { 
      view: 'messages', 
      label: 'Direct Chat', 
      icon: MessageCircle, 
      color: 'text-violet-700', 
      bgActive: 'bg-violet-50 text-violet-950 border-violet-300 shadow-[0_2px_8px_rgba(139,92,246,0.14)] font-bold', 
      hoverBg: 'hover:bg-violet-50/80 hover:text-violet-700 hover:border-violet-200/90',
      iconActive: 'text-violet-600',
      iconDefault: 'text-violet-500 group-hover:text-violet-600',
      indicator: 'bg-violet-600'
    },
    { 
      view: 'tasks', 
      label: 'Task Matrix', 
      icon: CheckSquare, 
      color: 'text-emerald-700', 
      bgActive: 'bg-emerald-50 text-emerald-950 border-emerald-300 shadow-[0_2px_8px_rgba(16,185,129,0.14)] font-bold', 
      hoverBg: 'hover:bg-emerald-50/80 hover:text-emerald-700 hover:border-emerald-200/90',
      iconActive: 'text-emerald-600',
      iconDefault: 'text-emerald-500 group-hover:text-emerald-600',
      indicator: 'bg-emerald-600'
    },
    { 
      view: 'polls', 
      label: 'Campus Polls', 
      icon: BarChart2, 
      color: 'text-amber-700', 
      bgActive: 'bg-amber-50 text-amber-950 border-amber-300 shadow-[0_2px_8px_rgba(245,158,11,0.14)] font-bold', 
      hoverBg: 'hover:bg-amber-50/80 hover:text-amber-700 hover:border-amber-200/90',
      iconActive: 'text-amber-600',
      iconDefault: 'text-amber-500 group-hover:text-amber-600',
      indicator: 'bg-amber-600'
    },
    { 
      view: 'research', 
      label: 'Research Hub', 
      icon: FlaskConical, 
      color: 'text-blue-700', 
      bgActive: 'bg-blue-50 text-blue-950 border-blue-300 shadow-[0_2px_8px_rgba(37,99,235,0.14)] font-bold', 
      hoverBg: 'hover:bg-blue-50/80 hover:text-blue-700 hover:border-blue-200/90',
      iconActive: 'text-blue-600',
      iconDefault: 'text-blue-500 group-hover:text-blue-600',
      indicator: 'bg-blue-600'
    },
    { 
      view: 'communities', 
      label: 'Communities', 
      icon: Users, 
      color: 'text-teal-700', 
      bgActive: 'bg-teal-50 text-teal-950 border-teal-300 shadow-[0_2px_8px_rgba(20,184,166,0.14)] font-bold', 
      hoverBg: 'hover:bg-teal-50/80 hover:text-teal-700 hover:border-teal-200/90',
      iconActive: 'text-teal-600',
      iconDefault: 'text-teal-500 group-hover:text-teal-600',
      indicator: 'bg-teal-600'
    },
    { 
      view: 'events', 
      label: 'Events', 
      icon: Calendar, 
      color: 'text-orange-700', 
      bgActive: 'bg-orange-50 text-orange-950 border-orange-300 shadow-[0_2px_8px_rgba(249,115,22,0.14)] font-bold', 
      hoverBg: 'hover:bg-orange-50/80 hover:text-orange-700 hover:border-orange-200/90',
      iconActive: 'text-orange-600',
      iconDefault: 'text-orange-500 group-hover:text-orange-600',
      indicator: 'bg-orange-600'
    },
    { 
      view: 'achievements', 
      label: 'Trophy Board', 
      icon: Trophy, 
      color: 'text-yellow-700', 
      bgActive: 'bg-yellow-50 text-yellow-950 border-yellow-300 shadow-[0_2px_8px_rgba(234,179,8,0.14)] font-bold', 
      hoverBg: 'hover:bg-yellow-50/80 hover:text-yellow-700 hover:border-yellow-200/90',
      iconActive: 'text-yellow-600',
      iconDefault: 'text-yellow-500 group-hover:text-yellow-600',
      indicator: 'bg-yellow-600'
    },
    { 
      view: 'bookmarks', 
      label: 'Bookmarks', 
      icon: Bookmark, 
      color: 'text-fuchsia-700', 
      bgActive: 'bg-fuchsia-50 text-fuchsia-950 border-fuchsia-300 shadow-[0_2px_8px_rgba(217,70,239,0.14)] font-bold', 
      hoverBg: 'hover:bg-fuchsia-50/80 hover:text-fuchsia-700 hover:border-fuchsia-200/90',
      iconActive: 'text-fuchsia-600',
      iconDefault: 'text-fuchsia-500 group-hover:text-fuchsia-600',
      indicator: 'bg-fuchsia-600'
    },
    { 
      view: 'notifications', 
      label: 'Notifications', 
      icon: Bell, 
      badge: unreadCount, 
      color: 'text-rose-700', 
      bgActive: 'bg-rose-50 text-rose-950 border-rose-300 shadow-[0_2px_8px_rgba(244,63,94,0.14)] font-bold', 
      hoverBg: 'hover:bg-rose-50/80 hover:text-rose-700 hover:border-rose-200/90',
      iconActive: 'text-rose-600',
      iconDefault: 'text-rose-500 group-hover:text-rose-600',
      indicator: 'bg-rose-600'
    },
    { 
      view: 'profile', 
      label: 'Profile Matrix', 
      icon: User, 
      color: 'text-purple-700', 
      bgActive: 'bg-purple-50 text-purple-950 border-purple-300 shadow-[0_2px_8px_rgba(168,85,247,0.14)] font-bold', 
      hoverBg: 'hover:bg-purple-50/80 hover:text-purple-700 hover:border-purple-200/90',
      iconActive: 'text-purple-600',
      iconDefault: 'text-purple-500 group-hover:text-purple-600',
      indicator: 'bg-purple-600'
    },
  ];

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('campusx_erp_session');
      localStorage.removeItem('campusx_erp_session');
      window.location.href = '/login';
    }
  };

  return (
    <aside className="connect-sidebar-container select-none flex flex-col h-full bg-white border-r border-slate-200/80 shadow-xs shrink-0 overflow-hidden">
      
      {/* Top Header Section - Snug brand fit */}
      <div className="p-3 px-3.5 border-b border-slate-100 flex items-center justify-between gap-2.5 shrink-0 bg-white">
        <div 
          className="flex items-center gap-2.5 cursor-pointer group flex-1 min-w-0 sidebar-collapsed-center" 
          onClick={() => setActiveView('home')}
          title="CampusX Connect"
        >
          <div className="w-8.5 h-8.5 rounded-xl bg-gradient-to-br from-indigo-600 to-indigo-700 flex items-center justify-center shadow-sm shrink-0 group-hover:scale-105 transition-transform">
            <span className="font-display font-black text-xs text-white tracking-wider">CX</span>
          </div>

          <div className="flex flex-col text-left sidebar-full-only min-w-0 flex-1">
            <span className="font-black text-[14.5px] text-slate-900 tracking-tight leading-none group-hover:text-indigo-600 transition-colors truncate">
              CampusX Connect
            </span>
            <div className="flex items-center gap-1.5 mt-1 min-w-0">
              <span className="text-[9.5px] text-slate-400 font-extrabold tracking-wider uppercase truncate">
                Social Matrix
              </span>
              <span className="text-slate-300 text-[9px] font-bold">•</span>
              <Link
                href={dashboardUrl}
                onClick={(e) => e.stopPropagation()}
                className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-indigo-50 hover:bg-indigo-100 text-indigo-600 border border-indigo-200/80 text-[9px] font-black uppercase tracking-wider transition-all shadow-2xs hover:scale-105"
                title="Return to ERP Portal"
              >
                <ArrowLeft className="w-2.5 h-2.5 stroke-[2.5]" />
                <span>ERP</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation List - Fits text with optimal font size, boxes & animations */}
      <nav className="flex-1 min-h-0 px-3 py-3 overflow-y-auto flex flex-col justify-start gap-1.5 story-tray-scrollbar bg-white">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.view;

          return (
            <button
              key={item.view}
              onClick={() => setActiveView(item.view)}
              title={item.label}
              className={`w-full h-10 min-h-[40px] relative flex items-center justify-between px-3.5 rounded-xl text-left transition-all duration-200 cursor-pointer sidebar-collapsed-center group min-w-0 border ${
                isActive 
                  ? `${item.bgActive} scale-[1.01]` 
                  : `border-slate-200/70 bg-slate-50/60 text-slate-700 ${item.hoverBg} hover:scale-[1.015] hover:shadow-xs font-medium`
              }`}
            >
              <div className="flex items-center gap-3 min-w-0 flex-1">
                {/* Active Indicator Bar */}
                {isActive && (
                  <span className={`absolute left-1.5 top-1/2 -translate-y-1/2 w-1.5 h-5 rounded-full ${item.indicator} sidebar-full-only shadow-xs`} />
                )}

                <Icon className={`w-5 h-5 shrink-0 transition-transform duration-200 group-hover:scale-110 group-hover:rotate-[-4deg] ${
                  isActive ? item.iconActive : item.iconDefault
                }`} />

                <span className={`text-[14px] tracking-tight truncate sidebar-full-only transition-colors duration-150 min-w-0 flex-1 text-left pl-0.5 ${
                  isActive ? `${item.color} font-black` : 'text-slate-800 font-bold group-hover:text-slate-900'
                }`}>
                  {item.label}
                </span>
              </div>

              {item.badge > 0 && (
                <span className="px-2 py-0.5 bg-rose-500 text-white text-[10px] font-black rounded-full font-mono shrink-0 ml-1.5 sidebar-full-only shadow-xs animate-pulse">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Bottom Profile Bar - Boxed Profile Matrix styling with bold readable text */}
      <div className="p-3 px-3.5 border-t border-slate-100 bg-white shrink-0">
        <div className="p-2.5 px-3 flex items-center justify-between gap-2.5 bg-slate-50/80 border border-slate-200/90 hover:border-indigo-300 hover:bg-indigo-50/50 rounded-2xl transition-all shadow-2xs min-w-0">
          
          <div 
            onClick={() => setActiveView('profile')}
            className="flex items-center gap-3 min-w-0 flex-1 cursor-pointer sidebar-collapsed-center group"
            title={`${currentUser?.name || 'Global Super Admin'} (${currentUser?.role || 'Admin'})`}
          >
            <div className="relative shrink-0">
              <img
                src={currentUser?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150"}
                alt="Profile"
                className="w-9 h-9 rounded-full object-cover border border-slate-200 shrink-0 group-hover:ring-2 group-hover:ring-indigo-400 transition-all shadow-2xs"
              />
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white" />
            </div>

            <div className="flex flex-col min-w-0 text-left sidebar-full-only">
              <span className="text-[13.5px] font-black text-slate-900 truncate group-hover:text-indigo-600 transition-colors leading-snug">
                {currentUser?.name || 'Global Super Admin'}
              </span>
              <span className="text-[10px] text-indigo-600 uppercase font-extrabold tracking-wider truncate">
                {currentUser?.role || 'ADMIN'} • Matrix
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1 shrink-0 sidebar-full-only">
            <Link
              href={dashboardUrl}
              className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-white border border-transparent hover:border-slate-200 transition-all shadow-2xs"
              title="Back to ERP"
            >
              <LayoutDashboard className="w-4 h-4" />
            </Link>

            <button
              onClick={handleLogout}
              className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-white border border-transparent hover:border-slate-200 transition-all cursor-pointer bg-transparent shadow-2xs"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>

        </div>
      </div>

    </aside>
  );
}
