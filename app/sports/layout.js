'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  Trophy, 
  Users, 
  Award, 
  Activity, 
  Calendar, 
  Clipboard, 
  Heart, 
  CheckSquare, 
  BarChart2, 
  Search, 
  DollarSign, 
  Home, 
  Tv, 
  Sparkles, 
  FileText, 
  Settings, 
  LogOut,
  ChevronRight,
  Bot,
  Video,
  Menu,
  X,
  Radio,
  Flame,
  ShieldCheck,
  Zap,
  ChevronLeft
} from 'lucide-react';

// Sidebar Link Metadata grouped logically
const allSidebarLinks = [
  // CORE PORTAL
  { name: 'Overview', href: '/sports', icon: Trophy, roles: ['superadmin', 'admin', 'sports_director', 'coach', 'athlete', 'sports_parent', 'student', 'parent', 'faculty', 'medical_staff'], section: 'CORE PORTAL', badge: null },
  { name: 'Live Scores', href: '/sports/live', icon: Tv, roles: ['superadmin', 'admin', 'sports_director', 'coach', 'athlete', 'sports_parent', 'student', 'parent', 'faculty', 'medical_staff'], section: 'CORE PORTAL', badge: 'LIVE' },
  { name: 'Live Studio', href: '/sports/live/studio', icon: Video, roles: ['superadmin', 'admin', 'sports_director', 'coach', 'athlete', 'sports_parent', 'student', 'parent', 'faculty', 'medical_staff', 'broadcast_operator'], section: 'CORE PORTAL', badge: null },
  { name: 'Matches & Fixtures', href: '/sports/matches', icon: Calendar, roles: ['superadmin', 'admin', 'sports_director', 'coach', 'athlete', 'sports_parent', 'student', 'parent', 'faculty', 'medical_staff'], section: 'CORE PORTAL', badge: null },
  { name: 'Teams & Rosters', href: '/sports/teams', icon: Activity, roles: ['superadmin', 'admin', 'sports_director', 'coach', 'athlete', 'student', 'faculty'], section: 'CORE PORTAL', badge: null },
  { name: 'Athletes Hub', href: '/sports/athletes', icon: Users, roles: ['superadmin', 'admin', 'sports_director', 'coach', 'medical_staff'], section: 'CORE PORTAL', badge: null },

  // PERFORMANCE & HEALTH
  { name: 'Fitness & Vitals', href: '/sports/fitness', icon: Heart, roles: ['superadmin', 'admin', 'sports_director', 'coach', 'athlete', 'sports_parent', 'medical_staff'], section: 'PERFORMANCE & HEALTH', badge: null },
  { name: 'Performance Analytics', href: '/sports/analytics', icon: BarChart2, roles: ['superadmin', 'admin', 'sports_director', 'coach', 'athlete', 'sports_parent'], section: 'PERFORMANCE & HEALTH', badge: 'PRO' },
  { name: 'AI Highlights', href: '/sports/highlights', icon: Sparkles, roles: ['superadmin', 'admin', 'sports_director', 'coach', 'athlete', 'sports_parent', 'student', 'parent', 'faculty'], section: 'PERFORMANCE & HEALTH', badge: 'AI' },
  { name: 'Training Plans', href: '/sports/training', icon: Clipboard, roles: ['superadmin', 'admin', 'sports_director', 'coach', 'athlete'], section: 'PERFORMANCE & HEALTH', badge: null },
  { name: 'AI Coach Copilot', href: '/sports/ai-coach', icon: Bot, roles: ['superadmin', 'admin', 'sports_director', 'coach', 'athlete', 'student'], section: 'PERFORMANCE & HEALTH', badge: 'GPT' },

  // MANAGEMENT
  { name: 'Tournaments', href: '/sports/tournaments', icon: Award, roles: ['superadmin', 'admin', 'sports_director', 'coach'], section: 'MANAGEMENT', badge: null },
  { name: 'Facilities & Courts', href: '/sports/facilities', icon: Home, roles: ['superadmin', 'admin', 'sports_director', 'coach'], section: 'MANAGEMENT', badge: null },
  { name: 'Scholarships & Grants', href: '/sports/scholarships', icon: DollarSign, roles: ['superadmin', 'admin', 'sports_director', 'athlete', 'sports_parent', 'student'], section: 'MANAGEMENT', badge: null },
  { name: 'Reports & Audits', href: '/sports/reports', icon: FileText, roles: ['superadmin', 'admin', 'sports_director'], section: 'MANAGEMENT', badge: null },
  { name: 'Settings & Integrations', href: '/sports/settings', icon: Settings, roles: ['superadmin', 'admin', 'sports_director', 'coach', 'athlete'], section: 'MANAGEMENT', badge: null }
];

export default function SportsLayout({ children }) {
  const [user, setUser] = useState({
    id: 'usr_director',
    name: 'Coach Marcus Sterling',
    role: 'superadmin',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    dept: 'Athletics & Varsity Sports'
  });
  const [loading, setLoading] = useState(false);
  const [showAppSwitcher, setShowAppSwitcher] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeStreams, setActiveStreams] = useState([]);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const session = sessionStorage.getItem('campusx_erp_session') || localStorage.getItem('campusx_user') || localStorage.getItem('campusx_erp_session');
        if (session) {
          const parsed = JSON.parse(session);
          if (parsed && parsed.name) {
            setUser(prev => ({
              ...prev,
              ...parsed,
              role: parsed.role || 'superadmin'
            }));
          }
        }
      } catch (e) {
        console.warn('Session reading note:', e);
      }
    }
  }, []);

  useEffect(() => {
    let interval;
    const fetchActiveStreams = async () => {
      try {
        const res = await fetch('/api/sports/streams/live-active');
        if (res.ok) {
          const data = await res.json();
          if (data.success) {
            setActiveStreams(data.streams || []);
          }
        }
      } catch (e) {}
    };
    
    fetchActiveStreams();
    interval = setInterval(fetchActiveStreams, 8000);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    if (typeof window !== 'undefined' && window.triggerLogout) {
      window.triggerLogout();
    } else {
      if (confirm('Are you sure you want to sign out from CampusX Sports?')) {
        sessionStorage.removeItem('campusx_erp_session');
        localStorage.removeItem('campusx_erp_session');
        window.location.href = '/login';
      }
    }
  };

  const getVisibleLinksBySection = () => {
    const userRole = user?.role || 'superadmin';
    const visible = allSidebarLinks.filter(link => 
      !link.roles || userRole === 'superadmin' || userRole === 'admin' || link.roles.includes(userRole)
    );
    
    const sections = {};
    visible.forEach(link => {
      if (!sections[link.section]) {
        sections[link.section] = [];
      }
      sections[link.section].push(link);
    });
    return sections;
  };

  const getActiveSectionName = () => {
    const activeLink = allSidebarLinks.find(link => 
      link.href === '/sports' ? pathname === '/sports' : pathname.startsWith(link.href)
    );
    return activeLink ? activeLink.name : 'Athletics Portal';
  };

  const roleLabels = {
    superadmin: 'Global Super Admin',
    admin: 'Athletics Administrator',
    sports_director: 'Sports Director',
    coach: 'Varsity Head Coach',
    athlete: 'Student Athlete',
    sports_parent: 'Athlete Parent',
    medical_staff: 'Sports Medicine Doctor'
  };

  return (
    <div className="min-h-screen bg-[#060B18] text-slate-100 font-sans flex overflow-hidden antialiased">
      {/* Mobile Drawer Backdrop */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 md:hidden transition-opacity"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar Component */}
      <aside 
        className={`
          fixed md:relative inset-y-0 left-0 z-50 flex flex-col h-screen bg-[#091124] border-r border-slate-800/80 shadow-2xl transition-all duration-300 shrink-0
          ${isMobileOpen ? 'translate-x-0 w-72' : '-translate-x-full md:translate-x-0'}
          ${isCollapsed ? 'md:w-20' : 'md:w-64 lg:w-72'}
        `}
      >
        {/* Branding header */}
        <div className="h-[72px] border-b border-slate-800/80 flex items-center justify-between px-4 lg:px-5 shrink-0 bg-gradient-to-r from-slate-900/60 to-[#091124]">
          <Link 
            href="/sports" 
            className="flex items-center gap-3 overflow-hidden group cursor-pointer"
            onClick={() => setIsMobileOpen(false)}
          >
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-600 to-indigo-700 flex items-center justify-center text-white shadow-lg shadow-indigo-600/30 shrink-0 group-hover:scale-105 transition-transform">
              <Trophy className="w-5 h-5 text-amber-300" />
            </div>
            {(!isCollapsed || isMobileOpen) && (
              <div className="flex flex-col min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-sm tracking-wider bg-gradient-to-r from-white via-indigo-200 to-indigo-400 bg-clip-text text-transparent">
                    CAMPUSX SPORTS
                  </span>
                  <span className="px-1.5 py-0.5 rounded text-[8px] font-black bg-amber-500/20 text-amber-300 border border-amber-500/30 uppercase">
                    PRO
                  </span>
                </div>
                <span className="text-[10px] text-slate-400 font-medium truncate">
                  Varsity Athletics & League OS
                </span>
              </div>
            )}
          </Link>

          {/* Desktop collapse toggle */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden md:flex p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors"
            title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            <ChevronLeft className={`w-4 h-4 transition-transform duration-300 ${isCollapsed ? 'rotate-180' : ''}`} />
          </button>

          {/* Mobile Close Button */}
          <button
            onClick={() => setIsMobileOpen(false)}
            className="md:hidden p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sidebar Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 flex flex-col gap-5 text-xs custom-scrollbar">
          {Object.entries(getVisibleLinksBySection()).map(([sectionName, links]) => (
            <div key={sectionName} className="flex flex-col gap-1">
              {/* Section Label */}
              {(!isCollapsed || isMobileOpen) ? (
                <div className="text-[10px] font-extrabold text-indigo-400/70 uppercase tracking-widest px-3 mb-1.5 flex items-center justify-between">
                  <span>{sectionName}</span>
                </div>
              ) : (
                <div className="border-t border-slate-800/80 my-1 mx-2" title={sectionName}></div>
              )}
              
              {links.map((link) => {
                const isActive = link.href === '/sports' ? pathname === '/sports' : pathname.startsWith(link.href);
                const Icon = link.icon;
                return (
                  <Link 
                    key={link.name} 
                    href={link.href}
                    title={isCollapsed && !isMobileOpen ? link.name : undefined}
                    className={`
                      flex items-center ${isCollapsed && !isMobileOpen ? 'justify-center px-2' : 'justify-between px-3'} py-2.5 rounded-xl transition-all duration-200 group cursor-pointer relative
                      ${isActive 
                        ? 'bg-gradient-to-r from-indigo-600/30 to-purple-600/20 text-white font-bold border border-indigo-500/40 shadow-md shadow-indigo-950/50' 
                        : 'text-slate-400 hover:text-white hover:bg-slate-800/50 border border-transparent'}
                    `}
                    onClick={() => setIsMobileOpen(false)}
                  >
                    {/* Active vertical pill */}
                    {isActive && (
                      <span className="absolute left-0 top-1.5 bottom-1.5 w-1 bg-indigo-500 rounded-r-full shadow-sm shadow-indigo-400"></span>
                    )}

                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`p-1.5 rounded-lg transition-colors ${
                        isActive ? 'bg-indigo-500/20 text-indigo-300' : 'text-slate-400 group-hover:text-indigo-400 group-hover:bg-slate-800'
                      }`}>
                        <Icon className="w-4 h-4 transition-transform group-hover:scale-110 shrink-0" />
                      </div>
                      {(!isCollapsed || isMobileOpen) && (
                        <span className="text-xs font-semibold tracking-wide truncate">
                          {link.name}
                        </span>
                      )}
                    </div>

                    {(!isCollapsed || isMobileOpen) && (
                      <div className="flex items-center gap-1.5">
                        {link.badge && (
                          <span className={`px-1.5 py-0.5 rounded text-[9px] font-black ${
                            link.badge === 'LIVE' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 animate-pulse' :
                            link.badge === 'PRO' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' :
                            link.badge === 'AI' ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40' :
                            'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40'
                          }`}>
                            {link.badge}
                          </span>
                        )}
                        <ChevronRight className={`w-3.5 h-3.5 transition-transform ${
                          isActive ? 'text-indigo-400 translate-x-0.5' : 'text-slate-600 opacity-0 group-hover:opacity-100'
                        }`} />
                      </div>
                    )}
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>

        {/* User Footer Profile Card */}
        <div className="p-3.5 border-t border-slate-800/80 bg-slate-950/60 flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3 overflow-hidden min-w-0">
            <div className="relative shrink-0">
              <img 
                src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'} 
                alt="User Avatar" 
                className="w-9 h-9 rounded-xl object-cover border border-indigo-500/40 shadow-sm" 
              />
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-[#091124]"></span>
            </div>
            {(!isCollapsed || isMobileOpen) && (
              <div className="flex flex-col min-w-0 text-left">
                <span className="text-xs font-bold text-white truncate">{user.name}</span>
                <span className="text-[10px] text-indigo-300/80 font-medium truncate">{roleLabels[user.role] || user.dept || 'Athletics Staff'}</span>
              </div>
            )}
          </div>

          {(!isCollapsed || isMobileOpen) && (
            <button 
              onClick={handleLogout}
              className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition-colors cursor-pointer shrink-0"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          )}
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-screen min-w-0 overflow-hidden bg-[#060B18]">
        {/* Top Navbar */}
        <header className="h-[72px] bg-[#091124]/90 backdrop-blur-xl border-b border-slate-800/80 px-4 md:px-7 flex items-center justify-between shrink-0 z-30">
          {/* Left: Mobile hamburger & Section badge */}
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsMobileOpen(true)}
              className="p-2.5 -ml-2 text-slate-400 hover:text-white md:hidden rounded-xl hover:bg-slate-800/60 cursor-pointer"
              title="Open Navigation"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2.5 text-xs font-medium">
              <Link href="/sports" className="text-slate-400 hover:text-white font-bold tracking-wider uppercase text-[11px] hidden sm:inline">
                CampusX Sports
              </Link>
              <span className="text-slate-600 hidden sm:inline">/</span>
              <span className="text-indigo-300 text-xs font-bold bg-indigo-500/15 border border-indigo-500/30 px-3 py-1 rounded-full tracking-wide flex items-center gap-1.5 shadow-sm">
                <Activity className="w-3.5 h-3.5 text-indigo-400" />
                {getActiveSectionName()}
              </span>
            </div>
          </div>

          {/* Right: Live indicator, search, quick action, app switcher */}
          <div className="flex items-center gap-3 relative">
            {/* Search Bar */}
            <div className="hidden lg:flex items-center gap-2.5 bg-slate-950/80 border border-slate-800 focus-within:border-indigo-500/60 rounded-xl px-3.5 py-2 w-60 transition-all shadow-inner">
              <Search className="w-4 h-4 text-indigo-400/80" />
              <input 
                type="text" 
                placeholder="Search athletes, matches, stats..." 
                className="bg-transparent border-none outline-none text-xs text-white placeholder-slate-400 w-full"
              />
            </div>

            {/* Quick Action Button */}
            <button 
              onClick={() => {
                if (user?.role === 'coach') router.push('/sports/training');
                else if (user?.role === 'athlete') router.push('/sports/fitness');
                else router.push('/sports/live');
              }}
              className="hidden sm:flex items-center gap-2 px-3.5 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-lg shadow-indigo-600/25 hover:shadow-indigo-600/40"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Quick Action</span>
            </button>

            {/* Live Indicator */}
            <Link 
              href="/sports/live"
              className="flex items-center gap-2 px-3 py-1.5 bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/30 text-rose-300 rounded-xl text-xs font-bold transition-all cursor-pointer"
            >
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
              <span className="hidden sm:inline">Live Center</span>
            </Link>

            {/* App Switcher button */}
            <button 
              className={`w-9 h-9 rounded-xl border border-slate-800 hover:bg-slate-800 flex items-center justify-center text-slate-300 hover:text-white transition-all cursor-pointer relative ${
                showAppSwitcher ? 'border-indigo-500 text-indigo-400 bg-indigo-500/15' : ''
              }`}
              onClick={() => setShowAppSwitcher(!showAppSwitcher)}
              title="Switch CampusX Applications"
            >
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="7" height="7"/>
                <rect x="14" y="3" width="7" height="7"/>
                <rect x="14" y="14" width="7" height="7"/>
                <rect x="3" y="14" width="7" height="7"/>
              </svg>
            </button>

            {/* App Switcher Dropdown */}
            {showAppSwitcher && (
              <div className="absolute right-0 top-[48px] bg-[#091124] border border-slate-700/80 rounded-2xl shadow-2xl p-4 w-72 z-50 animate-fadeIn backdrop-blur-2xl">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 pb-1 border-b border-slate-800">
                  CampusX Operating Suite
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <Link 
                    href="/" 
                    className="flex flex-col items-center gap-1.5 p-2 rounded-xl hover:bg-indigo-500/15 border border-transparent hover:border-indigo-500/30 text-center cursor-pointer transition-all group"
                    onClick={() => setShowAppSwitcher(false)}
                  >
                    <div className="w-8 h-8 rounded-lg bg-slate-950 border border-slate-800 group-hover:border-indigo-500/40 flex items-center justify-center text-indigo-400 transition-all">
                      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5"/></svg>
                    </div>
                    <span className="text-[10px] font-bold text-white truncate w-full">ERP Core</span>
                  </Link>

                  <Link 
                    href="/connect" 
                    className="flex flex-col items-center gap-1.5 p-2 rounded-xl hover:bg-indigo-500/15 border border-transparent hover:border-indigo-500/30 text-center cursor-pointer transition-all group"
                    onClick={() => setShowAppSwitcher(false)}
                  >
                    <div className="w-8 h-8 rounded-lg bg-slate-950 border border-slate-800 group-hover:border-indigo-500/40 flex items-center justify-center text-cyan-400 transition-all">
                      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                    </div>
                    <span className="text-[10px] font-bold text-white truncate w-full">Connect</span>
                  </Link>

                  <Link 
                    href="/admissions" 
                    className="flex flex-col items-center gap-1.5 p-2 rounded-xl hover:bg-indigo-500/15 border border-transparent hover:border-indigo-500/30 text-center cursor-pointer transition-all group"
                    onClick={() => setShowAppSwitcher(false)}
                  >
                    <div className="w-8 h-8 rounded-lg bg-slate-950 border border-slate-800 group-hover:border-indigo-500/40 flex items-center justify-center text-emerald-400 transition-all">
                      <Trophy className="w-4 h-4" />
                    </div>
                    <span className="text-[10px] font-bold text-white truncate w-full">Admissions</span>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </header>

        {/* Dynamic Page body viewport */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar relative bg-[#060B18]">
          {activeStreams.length > 0 && (
            <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-rose-500/15 via-indigo-500/15 to-[#091124] border border-rose-500/30 flex items-center justify-between shadow-xl">
              <div className="flex items-center gap-3">
                <span className="flex h-3 w-3 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500"></span>
                </span>
                <div>
                  <span className="text-[10px] font-bold text-rose-400 uppercase tracking-widest block">Live Match Broadcast Active</span>
                  <span className="text-xs font-semibold text-white">
                    {activeStreams[0].sport}: {activeStreams[0].team_a || 'Titans'} vs {activeStreams[0].team_b || 'Opponent'}
                  </span>
                </div>
              </div>
              <Link 
                href={`/sports/live/watch/${activeStreams[0].match_id}`}
                className="px-4 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-rose-600/20 cursor-pointer"
              >
                Watch Live Stream
              </Link>
            </div>
          )}
          {children}
        </main>
      </div>
    </div>
  );
}
