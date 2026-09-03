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
  Video
} from 'lucide-react';

// Sidebar Link Metadata - exactly the 14 links grouped logically
// Sidebar Link Metadata - exactly the 14 links grouped logically
const allSidebarLinks = [
  // CORE PORTAL
  { name: 'Overview', href: '/sports', icon: Trophy, roles: ['superadmin', 'admin', 'sports_director', 'coach', 'athlete', 'sports_parent', 'student', 'parent', 'faculty', 'medical_staff'], section: 'CORE PORTAL' },
  { name: 'Live Scores', href: '/sports/live', icon: Tv, roles: ['superadmin', 'admin', 'sports_director', 'coach', 'athlete', 'sports_parent', 'student', 'parent', 'faculty', 'medical_staff'], section: 'CORE PORTAL' },
  { name: 'Live Stream Studio', href: '/sports/live/studio', icon: Video, roles: ['superadmin', 'admin', 'sports_director', 'coach', 'athlete', 'sports_parent', 'student', 'parent', 'faculty', 'medical_staff', 'broadcast_operator'], section: 'CORE PORTAL' },
  { name: 'Matches', href: '/sports/matches', icon: Calendar, roles: ['superadmin', 'admin', 'sports_director', 'coach', 'athlete', 'sports_parent', 'student', 'parent', 'faculty', 'medical_staff'], section: 'CORE PORTAL' },
  { name: 'Teams', href: '/sports/teams', icon: Activity, roles: ['superadmin', 'admin', 'sports_director', 'coach', 'athlete', 'student', 'faculty'], section: 'CORE PORTAL' },
  { name: 'Athletes', href: '/sports/athletes', icon: Users, roles: ['superadmin', 'admin', 'sports_director', 'coach', 'medical_staff'], section: 'CORE PORTAL' },

  // PERFORMANCE & HEALTH
  { name: 'Fitness Logs', href: '/sports/fitness', icon: Heart, roles: ['superadmin', 'admin', 'sports_director', 'coach', 'athlete', 'sports_parent', 'medical_staff'], section: 'PERFORMANCE & HEALTH' },
  { name: 'Performance Analytics', href: '/sports/analytics', icon: BarChart2, roles: ['superadmin', 'admin', 'sports_director', 'coach', 'athlete', 'sports_parent'], section: 'PERFORMANCE & HEALTH' },
  { name: 'AI Highlights', href: '/sports/highlights', icon: Video, roles: ['superadmin', 'admin', 'sports_director', 'coach', 'athlete', 'sports_parent', 'student', 'parent', 'faculty'], section: 'PERFORMANCE & HEALTH' },
  { name: 'Training', href: '/sports/training', icon: Clipboard, roles: ['superadmin', 'admin', 'sports_director', 'coach', 'athlete'], section: 'PERFORMANCE & HEALTH' },
  { name: 'AI Coach', href: '/sports/ai-coach', icon: Bot, roles: ['superadmin', 'admin', 'sports_director', 'coach', 'athlete', 'student'], section: 'PERFORMANCE & HEALTH' },

  // MANAGEMENT
  { name: 'Tournaments', href: '/sports/tournaments', icon: Award, roles: ['superadmin', 'admin', 'sports_director', 'coach'], section: 'MANAGEMENT' },
  { name: 'Facilities', href: '/sports/facilities', icon: Home, roles: ['superadmin', 'admin', 'sports_director', 'coach'], section: 'MANAGEMENT' },
  { name: 'Scholarships', href: '/sports/scholarships', icon: DollarSign, roles: ['superadmin', 'admin', 'sports_director', 'athlete', 'sports_parent', 'student'], section: 'MANAGEMENT' },
  { name: 'Reports', href: '/sports/reports', icon: FileText, roles: ['superadmin', 'admin', 'sports_director'], section: 'MANAGEMENT' },
  { name: 'Settings', href: '/sports/settings', icon: Settings, roles: ['superadmin', 'admin', 'sports_director', 'coach', 'athlete'], section: 'MANAGEMENT' }
];

export default function SportsLayout({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAppSwitcher, setShowAppSwitcher] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [activeStreams, setActiveStreams] = useState([]);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const session = sessionStorage.getItem('campusx_erp_session');
      if (session) {
        setUser(JSON.parse(session));
        setLoading(false);
      } else {
        router.push('/login');
      }
    }
  }, [router]);

  useEffect(() => {
    let interval;
    if (user) {
      const fetchActiveStreams = async () => {
        try {
          const res = await fetch('/api/sports/streams/live-active');
          const data = await res.json();
          if (data.success) {
            setActiveStreams(data.streams || []);
          }
        } catch (e) {
          console.error(e);
        }
      };
      
      fetchActiveStreams();
      interval = setInterval(fetchActiveStreams, 5000);
    }
    return () => clearInterval(interval);
  }, [user]);

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
    if (!user) return {};
    const visible = allSidebarLinks.filter(link => link.roles.includes(user.role));
    
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
    return activeLink ? activeLink.name : 'Overview';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#071126] text-white flex items-center justify-center font-sans">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin"></div>
          <span className="text-sm font-semibold text-slate-400">Booting CampusX Sports OS...</span>
        </div>
      </div>
    );
  }

  const roleLabels = {
    superadmin: 'Global Super Admin',
    admin: 'University Admin',
    sports_director: 'Sports Director',
    coach: 'Sports Head Coach',
    athlete: 'Student Athlete',
    sports_parent: 'Athlete Parent'
  };

  return (
    <div className="min-h-screen bg-[#071126] text-white font-sans flex overflow-hidden">
      {/* Mobile Drawer Backdrop */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-[#071126]/60 backdrop-blur-sm z-45 md:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`fixed inset-y-0 left-0 z-50 flex flex-col h-screen bg-[#0B1736] border-r border-slate-800 sports-sidebar ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Branding header */}
        <div className="h-[72px] border-b border-slate-800 flex flex-col justify-center lg:items-start md:items-center items-start lg:px-6 md:px-2 px-6 gap-0.5 shrink-0">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-indigo-500 animate-pulse shrink-0" />
            <span className="font-extrabold text-base tracking-wider bg-gradient-to-r from-white via-indigo-200 to-indigo-400 bg-clip-text text-transparent lg:block md:hidden block">
              CAMPUSX SPORTS
            </span>
          </div>
          <span className="text-[9px] text-slate-400 font-semibold truncate lg:block md:hidden block w-full">
            University Sports & Athlete Management
          </span>
        </div>

        {/* Sidebar Navigation */}
        <nav className="flex-1 overflow-y-auto px-4 py-5 flex flex-col gap-4 text-[0.875rem] custom-scrollbar">
          {Object.entries(getVisibleLinksBySection()).map(([sectionName, links]) => (
            <div key={sectionName} className="flex flex-col gap-1">
              {/* Section Label */}
              <div className="lg:block md:hidden block text-[10px] font-bold text-slate-500 uppercase tracking-widest px-4 mb-2">
                {sectionName}
              </div>
              {/* Divider in tablet mode */}
              <div className="hidden md:block lg:hidden border-t border-slate-800/80 my-1 mx-2"></div>
              
              {links.map((link) => {
                const isActive = link.href === '/sports' ? pathname === '/sports' : pathname.startsWith(link.href);
                const Icon = link.icon;
                return (
                  <Link 
                    key={link.name} 
                    href={link.href}
                    style={isActive ? {
                      borderLeft: '4px solid #6366F1',
                      backgroundColor: 'rgba(99,102,241,0.15)',
                      boxShadow: '0 0 20px rgba(99,102,241,0.2)',
                      color: '#FFFFFF'
                    } : {
                      borderLeft: '4px solid transparent'
                    }}
                    className={`flex items-center lg:justify-between md:justify-center justify-between py-2 transition-all duration-200 group cursor-pointer rounded-xl ${
                      isActive 
                        ? 'text-white font-semibold' 
                        : 'text-slate-400 hover:text-white hover:bg-slate-800/30'
                    } lg:pl-3 lg:pr-3 md:px-2 pl-3 pr-3`}
                    onClick={() => setIsMobileOpen(false)}
                  >
                    <div className="flex items-center lg:gap-3.5 md:gap-0 gap-3.5">
                      <Icon className={`w-4.5 h-4.5 transition-transform group-hover:scale-110 ${
                        isActive ? 'text-[#818CF8] drop-shadow-[0_0_8px_rgba(99,102,241,0.5)]' : 'text-slate-400'
                      }`} />
                      <span className="lg:block md:hidden block text-xs tracking-wide">{link.name}</span>
                    </div>
                    <ChevronRight className={`w-3.5 h-3.5 text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity lg:block md:hidden block ${
                      isActive ? 'text-[#818CF8] opacity-100' : ''
                    }`} />
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>

        {/* User Card */}
        <div className="p-4 border-t border-slate-800 bg-[#071126]/30 flex lg:flex-row md:flex-col flex-row items-center justify-between gap-3 shrink-0">
          <div className="flex lg:flex-row md:flex-col flex-row items-center gap-3 overflow-hidden">
            <img src={user.avatar} alt="User Avatar" className="w-9 h-9 rounded-full object-cover border border-slate-700 shrink-0" />
            <div className="flex flex-col min-w-0 lg:block md:hidden block text-left">
              <span className="text-xs font-semibold text-white truncate block">{user.name}</span>
              <span className="text-[10px] text-slate-400 font-medium truncate block">{roleLabels[user.role] || 'Member'}</span>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors cursor-pointer"
            title="Log Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </aside>

      {/* Main Content Pane */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden sports-main-content">
        {/* Main Navbar */}
        <header className="h-[72px] bg-[#0B1736]/90 backdrop-blur-md border-b border-slate-800 px-6 flex items-center justify-between shrink-0 z-40">
          {/* Left: Hamburger + Breadcrumbs */}
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsMobileOpen(!isMobileOpen)}
              className="p-2 -ml-2 text-slate-400 hover:text-white md:hidden cursor-pointer"
              title="Toggle Sidebar"
            >
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            </button>
            <div className="flex items-center gap-2 text-sm font-medium">
              <span className="text-slate-400 font-bold tracking-wide text-xs">CAMPUSX SPORTS</span>
              <span className="text-slate-600">/</span>
              <span className="text-white text-[10px] font-bold bg-indigo-500/10 border border-indigo-500/20 px-2.5 py-1 rounded-full uppercase tracking-wider">
                {getActiveSectionName()}
              </span>
            </div>
          </div>

          {/* Right: Search, Notifications, Action, Profile, App Switcher */}
          <div className="flex items-center gap-4 relative">
            {/* Search Bar */}
            <div className="hidden sm:flex items-center gap-2 bg-[#071126] border border-slate-800 focus-within:border-indigo-500/50 rounded-xl px-3 py-1.5 w-48 lg:w-64 transition-all">
              <Search className="w-4 h-4 text-slate-500" />
              <input 
                type="text" 
                placeholder="Search stats, athletes..." 
                className="bg-transparent border-none outline-none text-xs text-white placeholder-slate-500 w-full"
              />
            </div>

            {/* Quick Action Button */}
            <button 
              onClick={() => {
                if (user?.role === 'coach') router.push('/sports/training');
                else if (user?.role === 'athlete') router.push('/sports/fitness');
                else router.push('/sports/live');
              }}
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold transition-all cursor-pointer shadow-lg shadow-indigo-600/15"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Quick Action</span>
            </button>

            {/* Notifications */}
            <button className="relative w-9 h-9 rounded-xl border border-slate-800 hover:bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white transition-all cursor-pointer">
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-indigo-500 rounded-full animate-ping"></span>
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-indigo-500 rounded-full"></span>
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                <path d="M13.73 21a2 2 0 0 1-3.46 0" />
              </svg>
            </button>

            {/* Profile Info */}
            <div className="flex items-center gap-3 border-l border-slate-800 pl-4">
              <img src={user.avatar} alt="Profile" className="w-8 h-8 rounded-full border border-indigo-500/30 object-cover" />
              <div className="hidden xl:flex flex-col text-left">
                <span className="text-xs font-bold text-white leading-tight">{user.name}</span>
                <span className="text-[9px] text-slate-400 font-semibold uppercase tracking-wider">{roleLabels[user.role]}</span>
              </div>
            </div>

            {/* App Switcher button */}
            <button 
              className={`w-9 h-9 rounded-xl border border-slate-800 hover:bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white transition-all cursor-pointer relative ${
                showAppSwitcher ? 'border-indigo-500 text-indigo-400 bg-indigo-500/10' : ''
              }`}
              onClick={() => setShowAppSwitcher(!showAppSwitcher)}
              title="CAMPUSX Applications"
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
              <div className="absolute right-0 top-[48px] bg-[#0B1736] border border-slate-800 rounded-2xl shadow-2xl p-4 w-72 z-50 animate-fade-in">
                <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-3 pb-1 border-b border-slate-800/80">
                  CAMPUSX OS Switcher
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <Link 
                    href="/" 
                    className="flex flex-col items-center gap-1.5 p-2 rounded-xl hover:bg-indigo-500/10 border border-transparent hover:border-indigo-500/20 text-center cursor-pointer transition-all group"
                    onClick={() => setShowAppSwitcher(false)}
                  >
                    <div className="w-8 h-8 rounded-lg bg-[#071126] border border-slate-800 group-hover:border-indigo-500/30 flex items-center justify-center text-indigo-400 transition-all">
                      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5"/></svg>
                    </div>
                    <span className="text-[9px] font-bold text-white truncate w-full">Univ ERP</span>
                  </Link>

                  <Link 
                    href="/connect" 
                    className="flex flex-col items-center gap-1.5 p-2 rounded-xl hover:bg-indigo-500/10 border border-transparent hover:border-indigo-500/20 text-center cursor-pointer transition-all group"
                    onClick={() => setShowAppSwitcher(false)}
                  >
                    <div className="w-8 h-8 rounded-lg bg-[#071126] border border-slate-800 group-hover:border-indigo-500/30 flex items-center justify-center text-cyan-400 transition-all">
                      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                    </div>
                    <span className="text-[9px] font-bold text-white truncate w-full">Connect</span>
                  </Link>

                  <Link 
                    href="/blockchain" 
                    className="flex flex-col items-center gap-1.5 p-2 rounded-xl hover:bg-indigo-500/10 border border-transparent hover:border-indigo-500/20 text-center cursor-pointer transition-all group"
                    onClick={() => setShowAppSwitcher(false)}
                  >
                    <div className="w-8 h-8 rounded-lg bg-[#071126] border border-slate-800 group-hover:border-indigo-500/30 flex items-center justify-center text-emerald-400 transition-all">
                      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                    </div>
                    <span className="text-[9px] font-bold text-white truncate w-full">Chain</span>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </header>

        {/* Dynamic Page body viewport */}
        <main className="flex-1 overflow-y-auto p-6 custom-scrollbar relative bg-[#071126] max-w-none">
          {activeStreams.length > 0 && (
            <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-rose-500/10 via-indigo-500/10 to-[#0B1736] border border-rose-500/30 flex items-center justify-between animate-pulse">
              <div className="flex items-center gap-3">
                <span className="flex h-2.5 w-2.5 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500"></span>
                </span>
                <div>
                  <span className="text-[10px] font-bold text-rose-400 uppercase tracking-widest block">Live Broadcast Underway</span>
                  <span className="text-xs font-semibold text-white">
                    {activeStreams[0].sport}: {activeStreams[0].team_a || 'Home Team'} vs {activeStreams[0].team_b || 'Away Team'}
                  </span>
                </div>
              </div>
              <Link 
                href={`/sports/live/watch/${activeStreams[0].match_id}`}
                className="px-4 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-rose-600/20"
              >
                Watch Stream
              </Link>
            </div>
          )}
          {children}
        </main>
      </div>
    </div>
  );
}
