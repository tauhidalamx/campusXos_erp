'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Search, 
  RefreshCw,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
  Database
} from 'lucide-react';

const fallbackScannerData = {
  stocks: [
    { symbol: 'CAMPUSX', name: 'CampusX Academic Token', price: 1450.22, change: 3.25, pct: 0.22, cap: '$3.1B', volume: '1.2M', pe: 24.5 },
    { symbol: 'INFRA', name: 'Infrastructure Bond', price: 102.15, change: -2.66, pct: -2.54, cap: '$1.8B', volume: '840K', pe: 12.1 },
    { symbol: 'AAPL', name: 'Apple Inc.', price: 182.52, change: 1.15, pct: 0.63, cap: '$2.8T', volume: '45M', pe: 28.4 },
    { symbol: 'MSFT', name: 'Microsoft Corp.', price: 418.15, change: -0.85, pct: -0.20, cap: '$3.1T', volume: '22M', pe: 34.2 }
  ],
  etfs: [
    { symbol: 'SPY', name: 'SPDR S&P 500 ETF Trust', price: 541.22, change: -2.44, pct: -0.45, cap: '$510B', volume: '62M', pe: 22.1 },
    { symbol: 'QQQ', name: 'Invesco QQQ Trust Series 1', price: 462.80, change: -4.50, pct: -0.96, cap: '$240B', volume: '38M', pe: 35.8 }
  ],
  crypto: [
    { symbol: 'BTC', name: 'Bitcoin / US Dollar', price: 67420.00, change: 1420.00, pct: 2.15, cap: '$1.3T', volume: '28B', pe: null },
    { symbol: 'ETH', name: 'Ethereum / US Dollar', price: 3480.50, change: 95.80, pct: 2.83, cap: '$418B', volume: '15B', pe: null }
  ],
  mutualFunds: [
    { symbol: 'AGAFX', name: 'CampusX Growth Allocation Fund', price: 42.15, change: 0.35, pct: 0.84, cap: '$1.2B', volume: '12K', pe: 18.4 },
    { symbol: 'AIFXX', name: 'CampusX Income Fund Institutional', price: 10.05, change: 0.00, pct: 0.00, cap: '$3.5B', volume: '0', pe: 12.1 }
  ]
};

export default function ScannerPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'stocks' | 'etfs' | 'crypto' | 'funds'
  const [searchQuery, setSearchQuery] = useState('');
  const [data, setData] = useState(fallbackScannerData);
  const [loading, setLoading] = useState(true);

  const fetchScannerData = async () => {
    try {
      const res = await fetch('/api/market/scanner');
      const json = await res.json();
      if (json.success && json.scanner) {
        setData(json.scanner);
      }
    } catch (e) {
      console.warn('Fallback quotes loaded');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchScannerData();
  }, []);

  const getFilteredAssets = () => {
    let list = [];
    if (activeTab === 'all' || activeTab === 'stocks') list = [...list, ...(data.stocks || [])];
    if (activeTab === 'all' || activeTab === 'etfs') list = [...list, ...(data.etfs || [])];
    if (activeTab === 'all' || activeTab === 'crypto') list = [...list, ...(data.crypto || [])];
    if (activeTab === 'all' || activeTab === 'funds') list = [...list, ...(data.mutualFunds || [])];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(item => 
        item.symbol.toLowerCase().includes(q) || 
        item.name.toLowerCase().includes(q)
      );
    }
    return list;
  };

  const filteredAssets = getFilteredAssets();

  return (
    <div className="flex flex-col gap-6 animate-fade-in text-white">
      
      {/* Page Header */}
      <div className="flex justify-between items-center border-b border-[#0F1B3A] pb-4">
        <div>
          <h1 className="text-xl font-bold uppercase tracking-wider text-white">Market Scanner</h1>
          <p className="text-[11px] text-gray-500 mt-1">QUERY AND SCAN DIGITAL ASSETS, ETFS, CRYPTOCURRENCIES, AND UNIVERSITY MUTUAL FUNDS</p>
        </div>
        <button 
          onClick={fetchScannerData}
          className="p-2 border border-[#0F1B3A] text-gray-400 hover:text-[#F59E0B] hover:border-[#F59E0B] transition-all bg-transparent cursor-pointer"
          title="Refresh Scanner"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Tabs and Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#0F1B3A] pb-2">
        <div className="flex gap-2">
          {[
            { id: 'all', name: 'ALL INSTRUMENTS' },
            { id: 'stocks', name: 'STOCKS' },
            { id: 'etfs', name: 'ETFS' },
            { id: 'crypto', name: 'CRYPTO' },
            { id: 'funds', name: 'MUTUAL FUNDS' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-1.5 border text-[10px] font-bold tracking-wider transition-all cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-[#F59E0B]/10 border-[#F59E0B] text-[#F59E0B]'
                  : 'bg-transparent border-transparent text-gray-400 hover:text-white'
              }`}
            >
              {tab.name}
            </button>
          ))}
        </div>

        <div className="search-bar flex items-center bg-[#0A1128] border border-[#0F1B3A] rounded px-3 py-1.5 gap-2 w-72 focus-within:border-[#F59E0B]/40">
          <Search className="w-4 h-4 text-gray-500" />
          <input 
            type="text" 
            placeholder="FILTER BY TICKER OR NAME..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent border-none text-xs text-white outline-none w-full font-mono placeholder:text-gray-600 uppercase"
          />
        </div>
      </div>

      {/* Screener list */}
      <div className="bg-[#0A1128] border border-[#0F1B3A] p-6 flex flex-col gap-4">
        <div className="overflow-x-auto">
          {filteredAssets.length > 0 ? (
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-[#0F1B3A] text-gray-500 font-bold uppercase text-[9px] tracking-wider">
                  <th className="pb-3">Symbol</th>
                  <th className="pb-3">Asset Classification</th>
                  <th className="pb-3">Security Name</th>
                  <th className="pb-3">Price Rate</th>
                  <th className="pb-3">Change %</th>
                  <th className="pb-3">Market Cap</th>
                  <th className="pb-3">24h Volume</th>
                  <th className="pb-3 text-right">P/E Ratio</th>
                </tr>
              </thead>
              <tbody>
                {filteredAssets.map(item => {
                  const pctVal = item.pct || 0;
                  const isChangePos = item.change >= 0;
                  return (
                    <tr 
                      key={item.symbol} 
                      className="border-b border-[#0F1B3A]/40 hover:bg-white/[0.01] transition-colors cursor-pointer text-gray-300"
                      onClick={() => router.push(`/market/technical?symbol=${item.symbol}`)}
                    >
                      <td className="py-3.5 text-white font-bold"><code>{item.symbol}</code></td>
                      <td className="py-3.5 text-[9px]">
                        <span className="bg-[#040814] px-1.5 py-0.5 border border-[#0F1B3A] text-gray-400 rounded uppercase font-semibold">
                          {item.assetType || 'ASSET'}
                        </span>
                      </td>
                      <td className="py-3.5 font-sans font-semibold text-white">{item.name}</td>
                      <td className="py-3.5 font-bold">${item.price.toFixed(2)}</td>
                      <td className={`py-3.5 font-bold ${isChangePos ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {isChangePos ? '+' : ''}{pctVal.toFixed(2)}%
                      </td>
                      <td className="py-3.5 text-gray-400">{item.cap}</td>
                      <td className="py-3.5 text-gray-500">{item.volume}</td>
                      <td className="py-3.5 text-right font-bold text-white">{item.pe ? `${item.pe}x` : '--'}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          ) : (
            <div className="text-center py-12 text-xs text-gray-500 uppercase tracking-widest border border-dashed border-[#0F1B3A]">
              No financial assets matched the query parameters.
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
