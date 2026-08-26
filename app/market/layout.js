'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  TrendingUp, 
  Eye, 
  Activity, 
  DollarSign, 
  Search, 
  Bot, 
  Bell, 
  BookOpen, 
  Home, 
  Grid, 
  ChevronRight,
  ArrowLeft,
  X,
  User,
  LogOut
} from 'lucide-react';

const marketSidebarLinks = [
  { name: 'Market Overview', href: '/market', icon: Activity },
  { name: 'Live Watchlist', href: '/market/watchlist', icon: Eye },
  { name: 'Technical Charts', href: '/market/technical', icon: TrendingUp },
  { name: 'Paper Trading Desk', href: '/market/paper-trading', icon: DollarSign },
  { name: 'Market Scanner', href: '/market/scanner', icon: Search },
  { name: 'AI Financial Agents', href: '/market/ai-insights', icon: Bot },
  { name: 'Price Alerts', href: '/market/alerts', icon: Bell },
  { name: 'Research Ledger', href: '/market/research', icon: BookOpen }
];

const appsList = [
  { name: 'ERP Portal', href: '/', icon: <svg className="w-5 h-5 text-indigo-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5"/></svg>, desc: 'University Operations' },
  { name: 'CONNECT', href: '/connect', icon: <svg className="w-5 h-5 text-pink-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>, desc: 'Campus Social Feed' },
  { name: 'CHAIN', href: '/blockchain', icon: <svg className="w-5 h-5 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>, desc: 'Blockchain Verifications' },
  { name: 'WEB3', href: '/web3', icon: <svg className="w-5 h-5 text-cyan-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>, desc: 'Web3 Wallet Services' },
  { name: 'SPORTS OS', href: '/sports', icon: <svg className="w-5 h-5 text-sky-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6M18 9h1.5a2.5 2.5 0 0 0 0-5H18M4 22h16M10 14.66V17c0 .55-.45 1-1 1H4v2h16v-2h-5c-.55 0-1-.45-1-1v-2.34M12 2a5 5 0 0 0-5 5v3c0 2.2 1.8 4 4 4h2c2.2 0 4-1.8 4-4V7a5 5 0 0 0-5-5z"/></svg>, desc: 'Athletic Management' }
];

export default function MarketLayout({ children }) {
  const [user, setUser] = useState(null);
  const [showAppSwitcher, setShowAppSwitcher] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  // Inject Bloomberg Theme variables
  useEffect(() => {
    // Preserve existing theme properties
    const prevBgPrimary = document.documentElement.style.getPropertyValue('--bg-primary');
    const prevBgSecondary = document.documentElement.style.getPropertyValue('--bg-secondary');
    const prevBgTertiary = document.documentElement.style.getPropertyValue('--bg-tertiary');
    const prevPrimary = document.documentElement.style.getPropertyValue('--primary');
    const prevPrimaryHover = document.documentElement.style.getPropertyValue('--primary-hover');
    const prevTextMain = document.documentElement.style.getPropertyValue('--text-main');
    const prevTextMuted = document.documentElement.style.getPropertyValue('--text-muted');
    const prevTextSubtle = document.documentElement.style.getPropertyValue('--text-subtle');
    const prevBorder = document.documentElement.style.getPropertyValue('--border');
    const prevRadiusLg = document.documentElement.style.getPropertyValue('--radius-lg');

    // Apply Bloomberg styles
    document.documentElement.style.setProperty('--bg-primary', '#040814');
    document.documentElement.style.setProperty('--bg-secondary', '#0A1128');
    document.documentElement.style.setProperty('--bg-tertiary', '#0F1B3A');
    document.documentElement.style.setProperty('--primary', '#F59E0B');
    document.documentElement.style.setProperty('--primary-hover', '#D97706');
    document.documentElement.style.setProperty('--text-main', '#FFFFFF');
    document.documentElement.style.setProperty('--text-muted', '#9CA3AF');
    document.documentElement.style.setProperty('--text-subtle', '#6B7280');
    document.documentElement.style.setProperty('--border', 'rgba(255, 255, 255, 0.08)');
    document.documentElement.style.setProperty('--radius-lg', '0px'); // Square terminal style

    // Set document attribute
    document.documentElement.setAttribute('data-theme', 'dark');

    // Fetch user session
    if (typeof window !== 'undefined') {
      const session = sessionStorage.getItem('campusx_erp_session');
      if (session) {
        setUser(JSON.parse(session));
      } else {
        // Fallback for demo
        setUser({
          name: 'Dr. Evelyn Sterling',
          role: 'superadmin',
          dept: 'CS',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'
        });
      }
    }

    return () => {
      // Revert styles on leave
      document.documentElement.style.setProperty('--bg-primary', prevBgPrimary);
      document.documentElement.style.setProperty('--bg-secondary', prevBgSecondary);
      document.documentElement.style.setProperty('--bg-tertiary', prevBgTertiary);
      document.documentElement.style.setProperty('--primary', prevPrimary);
      document.documentElement.style.setProperty('--primary-hover', prevPrimaryHover);
      document.documentElement.style.setProperty('--text-main', prevTextMain);
      document.documentElement.style.setProperty('--text-muted', prevTextMuted);
      document.documentElement.style.setProperty('--text-subtle', prevTextSubtle);
      document.documentElement.style.setProperty('--border', prevBorder);
      document.documentElement.style.setProperty('--radius-lg', prevRadiusLg);
      
      const savedTheme = localStorage.getItem('campusx_theme') || 'light';
      document.documentElement.setAttribute('data-theme', savedTheme);
    };
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem('campusx_erp_session');
    window.location.href = '/login';
  };

  return (
    <div className="flex min-h-screen bg-[#040814] text-white font-mono antialiased selection:bg-[#F59E0B]/30 select-none">
      
      {/* Standalone Market Sidebar */}
      <aside className="w-[280px] bg-[#0A1128] border-r border-[#0F1B3A] flex flex-col fixed top-0 bottom-0 left-0 z-50 shrink-0">
        
        {/* Header Logo */}
        <div className="h-[70px] flex items-center px-6 border-b border-[#0F1B3A] gap-3 justify-between">
          <div className="flex items-center gap-2.5">
            <TrendingUp className="w-6 h-6 text-[#F59E0B]" />
            <span className="font-bold text-base tracking-widest text-[#F59E0B]">MARKET.X</span>
          </div>
          <span className="text-[9px] bg-[#F59E0B]/10 text-[#F59E0B] px-1.5 py-0.5 rounded font-mono uppercase tracking-wider font-semibold">Live</span>
        </div>

        {/* Sidebar Nav */}
        <nav className="flex-1 p-4 flex flex-col gap-1 overflow-y-auto">
          <div className="text-[9px] font-bold text-gray-500 uppercase tracking-widest mb-2 pl-3">
            Financial Modules
          </div>
          {marketSidebarLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link 
                key={link.href} 
                href={link.href}
                className={`flex items-center gap-3 px-4 py-2.5 rounded transition-all duration-150 border-l-2 ${
                  isActive 
                    ? 'bg-[#F59E0B]/10 text-white border-[#F59E0B] font-semibold' 
                    : 'text-gray-400 hover:text-white hover:bg-white/[0.02] border-transparent'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-[#F59E0B]' : 'text-gray-400'}`} />
                <span className="text-xs uppercase tracking-wider">{link.name}</span>
              </Link>
            );
          })}

          <div className="border-t border-[#0F1B3A]/60 my-4 pt-4"></div>
          
          <Link 
            href="/"
            className="flex items-center gap-3 px-4 py-2.5 rounded text-gray-400 hover:text-white hover:bg-white/[0.02]"
          >
            <Home className="w-4 h-4" />
            <span className="text-xs uppercase tracking-wider">Back to ERP</span>
          </Link>
        </nav>

        {/* User profile section */}
        <div className="p-4 border-t border-[#0F1B3A] flex items-center gap-3 bg-[#070E20]/60 shrink-0">
          <img src={user?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150"} alt="" className="w-9 h-9 rounded border border-[#0F1B3A] object-cover" />
          <div className="flex-1 min-w-0">
            <span className="text-xs font-semibold text-white block truncate uppercase tracking-wider">{user?.name || 'Aria Nakamura'}</span>
            <span className="text-[10px] text-gray-500 block truncate uppercase tracking-widest">{user?.role || 'student'}</span>
          </div>
        </div>
      </aside>

      {/* Main viewport area */}
      <div className="flex-1 flex flex-col pl-[280px]">
        
        {/* Navigation Bar */}
        <header className="h-[70px] bg-[#0A1128]/95 backdrop-blur border-b border-[#0F1B3A] flex items-center justify-between px-8 sticky top-0 z-40">
          <div className="flex items-center gap-4">
            <span className="text-xs uppercase tracking-widest text-[#F59E0B] font-bold">TERMINAL V2.6</span>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-3.5 relative">
            
            {/* App Switcher Trigger */}
            <button 
              className={`p-2 rounded border transition-all cursor-pointer ${
                showAppSwitcher 
                  ? 'border-[#F59E0B] text-[#F59E0B] bg-[#F59E0B]/10' 
                  : 'border-[#0F1B3A] text-gray-400 hover:text-white hover:bg-white/[0.02]'
              }`}
              onClick={() => { setShowAppSwitcher(!showAppSwitcher); setShowProfileMenu(false); }}
              title="Launch Applications"
            >
              <Grid className="w-4 h-4" />
            </button>

            {/* App Switcher Dropdown */}
            {showAppSwitcher && (
              <div className="absolute right-12 top-[45px] bg-[#0A1128] border border-[#0F1B3A] shadow-2xl p-4 w-[360px] z-[100] flex flex-col gap-3.5">
                <div className="text-[9px] font-bold text-gray-500 uppercase tracking-widest pb-1 border-b border-[#0F1B3A]">
                  CAMPUSX APPLICATIONS
                </div>
                <div className="grid grid-cols-1 gap-2">
                  {appsList.map(app => (
                    <Link 
                      key={app.name} 
                      href={app.href}
                      className="flex items-center gap-3 p-2.5 rounded bg-[#040814]/40 hover:bg-[#F59E0B]/10 border border-[#0F1B3A] hover:border-[#F59E0B]/30 text-left transition-colors"
                      onClick={() => setShowAppSwitcher(false)}
                    >
                      <div className="p-2 rounded bg-[#070E20] border border-[#0F1B3A]">
                        {app.icon}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white uppercase tracking-wider">{app.name}</div>
                        <div className="text-[9px] text-gray-500">{app.desc}</div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Profile Menu Trigger */}
            <button 
              onClick={() => { setShowProfileMenu(!showProfileMenu); setShowAppSwitcher(false); }}
              className="p-1.5 rounded border border-[#0F1B3A] text-gray-400 hover:text-white hover:bg-white/[0.02] flex items-center gap-1.5 cursor-pointer"
            >
              <img src={user?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150"} alt="" className="w-5 h-5 rounded object-cover" />
              <span className="text-[10px] uppercase font-semibold pr-1">{user?.name ? user.name.split(' ')[0] : 'User'}</span>
            </button>

            {/* Profile Dropdown */}
            {showProfileMenu && (
              <div className="absolute right-0 top-[45px] bg-[#0A1128] border border-[#0F1B3A] shadow-2xl p-2 w-[160px] z-[100] flex flex-col">
                <button 
                  onClick={handleLogout}
                  className="flex items-center gap-2 w-full p-2.5 rounded text-left hover:bg-rose-500/10 text-rose-400 text-xs font-semibold uppercase tracking-wider bg-transparent border-none cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Log Out</span>
                </button>
              </div>
            )}

          </div>
        </header>

        {/* Viewport content */}
        <main className="flex-1 p-6 overflow-y-auto">
          {children}
        </main>
      </div>

    </div>
  );
}
