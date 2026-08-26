'use client';

import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  ArrowUpRight, 
  ArrowDownRight, 
  Activity, 
  Layers, 
  RefreshCw,
  Search
} from 'lucide-react';

const fallbackIndices = [
  { symbol: 'NIFTY 50', name: 'Nifty 50 Index', price: 23450.80, change: 120.40, pct: 0.52 },
  { symbol: 'SENSEX', name: 'BSE Sensex Index', price: 77210.30, change: 410.90, pct: 0.53 },
  { symbol: 'NASDAQ', name: 'Nasdaq Composite', price: 17850.50, change: -180.20, pct: -1.00 },
  { symbol: 'S&P 500', name: 'S&P 500 Index', price: 5430.20, change: -24.80, pct: -0.45 }
];

const fallbackSectors = [
  { name: 'Technology', change: 1.85, sentiment: 'Highly Bullish', count: 12 },
  { name: 'Financials', change: 0.42, sentiment: 'Neutral', count: 8 },
  { name: 'Energy', change: -0.75, sentiment: 'Bearish', count: 6 },
  { name: 'Healthcare', change: 0.95, sentiment: 'Bullish', count: 9 }
];

const fallbackQuotes = {
  CAMPUSX: { name: 'CampusX Academic Token', price: 1450.22, change: 3.25, volume: '1.2M', cap: '$3.1B', assetType: 'STOCK' },
  INFRA: { name: 'Infrastructure Bond', price: 102.15, change: -2.66, volume: '840K', cap: '$1.8B', assetType: 'STOCK' },
  YIELD: { name: 'Student Placement Pool', price: 342.88, change: 6.10, volume: '2.4M', cap: '$5.4B', assetType: 'STOCK' },
  VAULT: { name: 'Research IP Vault NFT', price: 280.00, change: 0.33, volume: '410K', cap: '$980M', assetType: 'STOCK' }
};

export default function MarketOverview() {
  const [indices, setIndices] = useState(fallbackIndices);
  const [sectors, setSectors] = useState(fallbackSectors);
  const [quotes, setQuotes] = useState(fallbackQuotes);
  const [loading, setLoading] = useState(true);

  const fetchMarketData = async () => {
    try {
      const [resInd, resSec, resQuotes] = await Promise.all([
        fetch('/api/market/indices'),
        fetch('/api/market/sectors'),
        fetch('/api/market/quotes')
      ]);

      const dataInd = await resInd.json();
      const dataSec = await resSec.json();
      const dataQuotes = await resQuotes.json();

      if (dataInd.success) setIndices(dataInd.indices);
      if (dataSec.success) setSectors(dataSec.sectors);
      if (dataQuotes.success && dataQuotes.quotes) {
        setQuotes(dataQuotes.quotes);
      }
    } catch (e) {
      console.warn('Backend offline, using fallback mock variables');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMarketData();
    const interval = setInterval(fetchMarketData, 8000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      
      {/* Page Header */}
      <div className="flex justify-between items-center border-b border-[#0F1B3A] pb-4">
        <div>
          <h1 className="text-xl font-bold uppercase tracking-wider text-white">Global Markets Overview</h1>
          <p className="text-[11px] text-gray-500 mt-1">REAL-TIME MULTIVARIATE FINANCIAL INDICES AND TICKER MONITORING</p>
        </div>
        <button 
          onClick={fetchMarketData}
          className="p-2 border border-[#0F1B3A] text-gray-400 hover:text-[#F59E0B] hover:border-[#F59E0B] transition-all bg-transparent cursor-pointer"
          title="Refresh Data"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Index scrolling ticker */}
      <div className="flex bg-[#0A1128] border border-[#0F1B3A] p-3 items-center overflow-x-auto gap-8 shrink-0">
        <div className="flex items-center gap-1.5 shrink-0 text-[10px] font-bold text-gray-500 font-mono tracking-widest uppercase">
          <Activity className="w-4 h-4 text-[#F59E0B]" />
          <span>INDEX TICKER:</span>
        </div>
        <div className="flex gap-8 overflow-hidden items-center">
          {indices.map((idx, i) => (
            <div key={i} className="flex items-center gap-2 text-xs shrink-0 font-medium font-mono">
              <span className="font-bold text-white">{idx.symbol || idx.name}</span>
              <span className="text-gray-300">${idx.price.toLocaleString()}</span>
              <span className={`flex items-center font-semibold ${idx.change >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                {idx.change >= 0 ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                {idx.pct.toFixed(2)}%
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Major Indices Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {indices.slice(0, 3).map((idx, i) => (
          <div key={i} className="bg-[#0A1128] border border-[#0F1B3A] p-5 flex justify-between items-center transition-all hover:border-[#F59E0B]/30">
            <div className="flex flex-col">
              <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{idx.symbol || idx.name}</span>
              <span className="text-xl font-bold font-mono text-white mt-1.5">${idx.price.toLocaleString()}</span>
              <span className={`text-[10px] font-mono mt-2 font-semibold flex items-center gap-1 ${idx.change >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                {idx.change >= 0 ? '+' : ''}{idx.change.toFixed(2)} ({idx.pct.toFixed(2)}%)
              </span>
            </div>
            <div className={`p-3 rounded ${idx.change >= 0 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
              {idx.change >= 0 ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Market Screener Table */}
        <div className="bg-[#0A1128] border border-[#0F1B3A] p-6 lg:col-span-2 flex flex-col gap-4">
          <div className="flex justify-between items-center border-b border-[#0F1B3A] pb-3">
            <span className="text-xs font-bold text-white uppercase tracking-widest">Active Index Market Screener</span>
            <Link href="/market/scanner" className="text-[10px] text-[#F59E0B] hover:text-[#D97706] font-semibold uppercase tracking-wider">Advanced Screener &rarr;</Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-[#0F1B3A] text-gray-500 font-bold uppercase text-[9px] tracking-wider">
                  <th className="pb-3">Symbol</th>
                  <th className="pb-3">Company/Asset Name</th>
                  <th className="pb-3">Price</th>
                  <th className="pb-3">Change %</th>
                  <th className="pb-3">Volume</th>
                  <th className="pb-3">Cap</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(quotes).map(([symbol, doc]) => (
                  <tr 
                    key={symbol} 
                    className="border-b border-[#0F1B3A]/40 hover:bg-white/[0.01] transition-colors cursor-pointer text-gray-300"
                    onClick={() => router.push(`/market/technical?symbol=${symbol}`)}
                  >
                    <td className="py-3 text-white font-bold"><code>{symbol}</code></td>
                    <td className="py-3">{doc.name}</td>
                    <td className="py-3">${doc.price.toFixed(2)}</td>
                    <td className={`py-3 font-semibold ${doc.change >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {doc.change >= 0 ? '+' : ''}{doc.change.toFixed(2)}%
                    </td>
                    <td className="py-3">{doc.volume || '0'}</td>
                    <td className="py-3 text-gray-500">{doc.cap || 'N/A'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Sector Performance */}
        <div className="bg-[#0A1128] border border-[#0F1B3A] p-6 flex flex-col gap-4">
          <div className="border-b border-[#0F1B3A] pb-3">
            <span className="text-xs font-bold text-white uppercase tracking-widest">Sector Heat Rating</span>
          </div>
          <div className="flex flex-col gap-3.5">
            {sectors.map((sec, idx) => (
              <div key={idx} className="flex justify-between items-center border-b border-[#0F1B3A]/30 pb-2 text-xs">
                <div>
                  <span className="font-semibold text-gray-200 block">{sec.name}</span>
                  <span className="text-[9px] text-gray-500 uppercase tracking-widest">{sec.count} Assets listed</span>
                </div>
                <div className="text-right">
                  <span className={`font-bold font-mono ${sec.change >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {sec.change >= 0 ? '+' : ''}{sec.change.toFixed(2)}%
                  </span>
                  <span className="text-[9px] text-gray-400 block font-semibold">{sec.sentiment}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
