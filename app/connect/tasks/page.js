'use client';

import React from 'react';
import Sidebar from '../components/Sidebar';
import TasksView from '../components/TasksView';
import { ConnectProvider } from '../ConnectContext';
import '../connect.css';

export default function TasksPage() {
  return (
    <ConnectProvider>
      <div className="connect-app-shell select-none connect-font-inter">
        <Sidebar />
        <div className="connect-main-viewport story-tray-scrollbar">
          <main className="connect-content-grid wide-mode">
            <TasksView />
          </main>
        </div>
      </div>
    </ConnectProvider>
  );
}
