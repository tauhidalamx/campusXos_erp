'use client';

import React from 'react';
import Feed from '../components/Feed';
import SuiteSidebar from '../components/SuiteSidebar';
import { ConnectProvider } from '../ConnectContext';
import '../connect.css';

export default function CommunityPage() {
  return (
    <ConnectProvider>
      <div className="flex h-screen bg-brand-bg-primary text-brand-text-main overflow-hidden font-sans select-none relative" style={{ paddingLeft: '80px' }}>
        <SuiteSidebar />
        <div className="flex-1 flex overflow-hidden w-full h-full">
          <Feed />
        </div>
      </div>
    </ConnectProvider>
  );
}
