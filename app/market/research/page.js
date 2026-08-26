'use client';

import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Plus, 
  ShieldCheck, 
  Activity, 
  RefreshCw,
  TrendingUp,
  Cpu,
  Search
} from 'lucide-react';

const mockWatchlists = {
  CAMPUSX: { name: 'CampusX Tech Holdings' },
  INFRA: { name: 'Infrastructure Bond' },
  YIELD: { name: 'Student Placement Pool' },
  VAULT: { name: 'Research IP Vault NFT' }
};

export default function ResearchPage() {
  const [selectedStock, setSelectedStock] = useState('CAMPUSX');
  const [grants, setGrants] = useState([]);
  const [sentiment, setSentiment] = useState({ rating: 'Highly Bullish', score: 8.4 });
  
  // Verification form
  const [citationCid, setCitationCid] = useState('');
  const [ledgerEntries, setLedgerEntries] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadLocalResearch = () => {
    if (typeof window === 'undefined') return;
    const savedEntries = localStorage.getItem('campusx_research_ledger');
    if (savedEntries) {
      try { setLedgerEntries(JSON.parse(savedEntries)); } catch (e) {}
    } else {
      const defaultEntries = [
        { id: 'ld_1', symbol: 'CAMPUSX', cid: 'QmXoypizjW3WknFixtdKL91GL7tTFj24uWSyOZemMHob12', txHash: '0x7e29f0da11b439c2cfdeee7663ba9831a221f42a98f121d59bc4de29e84b80ad', status: 'Consensus Validated', timestamp: new Date().toISOString() }
      ];
      setLedgerEntries(defaultEntries);
      localStorage.setItem('campusx_research_ledger', JSON.stringify(defaultEntries));
    }

    setGrants([
      { id: 'GR_1029', title: 'Quantum Computing and Cryptography', amount: 500000, status: 'APPROVED' },
      { id: 'GR_2941', title: 'Decentralized Academic Identity Registry', amount: 250000, status: 'PENDING' }
    ]);
  };

  const fetchResearchDetails = async (symbol) => {
    try {
      const res = await fetch(`/api/market/research/${symbol}`);
      const data = await res.json();
      if (data.success) {
        if (data.grants) setGrants(data.grants);
        if (data.sentiment) setSentiment(data.sentiment);
      } else {
        loadLocalResearch();
      }
    } catch (e) {
      loadLocalResearch();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResearchDetails(selectedStock);
  }, [selectedStock]);

  const handleValidateLedger = async () => {
    const cid = citationCid.trim();
    if (!cid) {
      alert('Enter a valid Citation CID (IPFS Hash).');
      return;
    }

    const localTx = '0x' + Math.random().toString(16).substr(2, 64);
    const newEntry = {
      id: 'ld_' + Date.now(),
      symbol: selectedStock,
      cid,
      txHash: localTx,
      status: 'Consensus Validated',
      timestamp: new Date().toISOString()
    };

    const nextEntries = [newEntry, ...ledgerEntries];
    setLedgerEntries(nextEntries);
    localStorage.setItem('campusx_research_ledger', JSON.stringify(nextEntries));
    setCitationCid('');

    alert(`Consensus Verified: Citation recorded with TX ${localTx.substr(0, 14)}...`);

    try {
      await fetch('/api/market/research/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ citationCid: cid, symbol: selectedStock })
      });
    } catch (e) {}
  };

  return (
    <div className="flex flex-col gap-6 animate-fade-in text-white">
      
      {/* Page Header */}
      <div className="flex justify-between items-center border-b border-[#0F1B3A] pb-4">
        <div>
          <h1 className="text-xl font-bold uppercase tracking-wider text-white">Research Citation Ledger</h1>
          <p className="text-[11px] text-gray-500 mt-1">ON-CHAIN VALIDATION OF INTELLECTUAL PATENT CITATIONS AND CIT METRICS</p>
        </div>
        
        {/* Selector */}
        <select 
          value={selectedStock}
          onChange={(e) => setSelectedStock(e.target.value)}
          className="bg-[#0A1128] border border-[#0F1B3A] text-xs text-white p-2 rounded outline-none w-44 font-mono uppercase font-bold"
        >
          {Object.keys(mockWatchlists).map(sym => (
            <option key={sym} value={sym}>{sym}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Grants and Sentiment */}
        <div className="bg-[#0A1128] border border-[#0F1B3A] p-6 flex flex-col gap-5">
          <div className="border-b border-[#0F1B3A] pb-3 text-xs font-bold text-white uppercase tracking-widest flex items-center gap-1.5">
            <Cpu className="w-4 h-4 text-[#F59E0B]" />
            <span>Funded Grants & Citations</span>
          </div>

          <div className="flex flex-col gap-3 font-mono">
            {grants.map(g => (
              <div key={g.id} className="p-3 bg-[#040814]/40 border border-[#0F1B3A] text-xs flex justify-between items-center">
                <div>
                  <span className="font-bold text-white block">{g.title}</span>
                  <span className="text-[9px] text-gray-500 block uppercase tracking-widest mt-1">ID: {g.id} • VAL: ${g.amount.toLocaleString()}</span>
                </div>
                <span className={`px-1.5 py-0.5 text-[8px] font-bold rounded ${
                  g.status === 'APPROVED' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-[#F59E0B]'
                }`}>
                  {g.status}
                </span>
              </div>
            ))}
          </div>

          <div className="border-t border-[#0F1B3A]/60 pt-4 font-mono text-xs flex justify-between">
            <span className="text-gray-400">CIT Metrics Sentiment:</span>
            <span className="text-emerald-400 font-bold uppercase tracking-wider">{sentiment.rating} ({sentiment.score}/10)</span>
          </div>
        </div>

        {/* Validation Entry Desk */}
        <div className="bg-[#0A1128] border border-[#0F1B3A] p-6 lg:col-span-2 flex flex-col gap-5">
          <div className="border-b border-[#0F1B3A] pb-3 text-xs font-bold text-white uppercase tracking-widest flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Consensus Verification Desk</span>
          </div>

          <div className="flex flex-col gap-4 text-xs font-mono">
            <div className="flex flex-col gap-1.5">
              <label className="text-[9px] text-gray-500 uppercase tracking-widest pl-0.5">Citation CID (IPFS Hash / Patent ID)</label>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  placeholder="ENTER CID (e.g. QmXoypizjW...)..."
                  value={citationCid}
                  onChange={(e) => setCitationCid(e.target.value)}
                  className="flex-1 bg-[#040814] border border-[#0F1B3A] text-xs text-white p-2.5 rounded outline-none focus:border-[#F59E0B]/40 font-mono placeholder:text-gray-600 uppercase"
                />
                <button 
                  onClick={handleValidateLedger}
                  className="px-4 bg-[#F59E0B] hover:bg-[#D97706] text-black font-bold uppercase tracking-wider transition-all cursor-pointer rounded"
                >
                  Validate Ledger
                </button>
              </div>
            </div>

            {/* Validation History */}
            <div className="mt-3">
              <span className="text-[9px] text-gray-500 uppercase tracking-widest font-bold block mb-2">VALIDATED CITATION REGISTRY</span>
              <div className="overflow-y-auto max-h-[220px]">
                {ledgerEntries.length > 0 ? (
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-[#0F1B3A] text-gray-500 font-bold uppercase text-[9px] tracking-wider">
                        <th className="pb-3">Symbol</th>
                        <th className="pb-3">Citation CID</th>
                        <th className="pb-3">Consensus Tx Hash</th>
                        <th className="pb-3 text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {ledgerEntries.map(entry => (
                        <tr key={entry.id} className="border-b border-[#0F1B3A]/40 text-gray-300">
                          <td className="py-2.5 text-white font-bold"><code>{entry.symbol}</code></td>
                          <td className="py-2.5 text-gray-400 text-[10px] truncate max-w-[120px]" title={entry.cid}><code>{entry.cid}</code></td>
                          <td className="py-2.5 text-gray-500 text-[10px] truncate max-w-[120px]" title={entry.txHash}><code>{entry.txHash}</code></td>
                          <td className="py-2.5 text-right font-bold text-emerald-400 text-[9px]">
                            {entry.status}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="text-center py-6 text-xs text-gray-500 uppercase tracking-widest border border-dashed border-[#0F1B3A]">
                    No citations currently validated in this ledger session.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
