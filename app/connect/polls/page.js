'use client';

import React from 'react';
import Sidebar from '../components/Sidebar';
import PollsView from '../components/PollsView';
import { ConnectProvider } from '../ConnectContext';
import '../connect.css';

export default function PollsPage() {
  return (
    <ConnectProvider>
      <div className="connect-app-shell select-none connect-font-inter">
        <Sidebar />
        <div className="connect-main-viewport story-tray-scrollbar">
          <main className="connect-content-grid wide-mode">
            <PollsView />
          </main>
        </div>
      </div>
    </ConnectProvider>
  );
}
