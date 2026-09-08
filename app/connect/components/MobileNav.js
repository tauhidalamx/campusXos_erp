'use client';

import React from 'react';
import { useConnect } from '../ConnectContext';
import { Home, Compass, MessageCircle, Bell, User } from 'lucide-react';

export default function MobileNav() {
  const { activeView, setActiveView, notifications, setMessengerOpen } = useConnect();

  const handleMobileNavClick = (view) => {
    setActiveView(view);
    if (view === 'messages') {
      setMessengerOpen(true);
    }
  };

  const navItems = [
    { view: 'home', icon: Home, label: 'Home' },
    { view: 'explore', icon: Compass, label: 'Explore' },
    { view: 'messages', icon: MessageCircle, label: 'Messages' },
    { view: 'notifications', icon: Bell, label: 'Alerts', badge: notifications.filter(n => n.unread).length },
    { view: 'profile', icon: User, label: 'Profile' }
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-white border-t border-slate-200 flex items-center justify-around z-[90] px-4 shadow-xl">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = activeView === item.view;

        return (
          <button
            key={item.view}
            onClick={() => handleMobileNavClick(item.view)}
            className="flex flex-col items-center justify-center relative flex-1 py-1 cursor-pointer"
          >
            <Icon 
              className={`w-5.5 h-5.5 transition-colors duration-150 ${
                isActive ? 'text-brand-primary' : 'text-slate-400 hover:text-slate-800'
              }`} 
            />
            {item.badge > 0 && (
              <span className="absolute top-1 right-6 w-4 h-4 bg-rose-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center border border-white">
                {item.badge}
              </span>
            )}
            <span className={`text-[9px] font-semibold mt-1 tracking-wide transition-colors duration-150 ${
              isActive ? 'text-brand-primary font-bold' : 'text-slate-500'
            }`}>
              {item.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
