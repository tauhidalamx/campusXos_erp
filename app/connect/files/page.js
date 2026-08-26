'use client';

import React from 'react';
import SuiteSidebar from '../components/SuiteSidebar';
import { ConnectProvider } from '../ConnectContext';
import { FileText, Download, HardDrive, ShieldCheck } from 'lucide-react';
import '../connect.css';

export default function FilesPage() {
  const files = [
    { name: 'Consensus_Audit_CS_Dept_2026.pdf', size: '4.2 MB', author: 'Dr. Raymond Park', date: 'August 5, 2026' },
    { name: 'University_ERP_Ledger_Schema.json', size: '1.8 MB', author: 'Platform Admin', date: 'August 4, 2026' },
    { name: 'AI_Research_Lab_Publication_Draft.docx', size: '12.6 MB', author: 'Aria Nakamura', date: 'August 2, 2026' },
    { name: 'Varsity_Sports_Schedule_Q3.pdf', size: '2.1 MB', author: 'Sports Director', date: 'July 28, 2026' }
  ];

  return (
    <ConnectProvider>
      <div className="flex h-screen bg-brand-bg-primary text-brand-text-main overflow-hidden font-sans select-none relative" style={{ paddingLeft: '80px' }}>
        <SuiteSidebar />
        <div className="flex-1 p-6 overflow-y-auto max-w-[1400px] mx-auto w-full flex flex-col gap-6">
          <div className="pb-4 border-b border-brand-border/40 flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-display font-black text-brand-text-main flex items-center gap-2">
                Cloud File Vault
                <HardDrive className="w-5 h-5 text-brand-primary" />
              </h1>
              <p className="text-xs text-brand-text-muted mt-1">Authenticated enterprise file attachments and repository uploads</p>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            {files.map((f, idx) => (
              <div key={idx} className="p-4 bg-brand-bg-secondary/60 backdrop-blur-xl border border-brand-border/60 rounded-2xl flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-3.5">
                  <div className="p-2.5 bg-brand-primary/10 rounded-xl text-brand-primary">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-brand-text-main font-mono">{f.name}</h3>
                    <p className="text-[10px] text-brand-text-muted mt-0.5">{f.author} • {f.size} • {f.date}</p>
                  </div>
                </div>
                <button className="p-2.5 bg-brand-bg-primary border border-brand-border/60 hover:bg-brand-primary/10 hover:text-brand-primary rounded-xl text-brand-text-muted transition-all cursor-pointer">
                  <Download className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </ConnectProvider>
  );
}
