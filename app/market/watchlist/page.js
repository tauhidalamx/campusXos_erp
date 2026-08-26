'use client';

import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Trash2, 
  Search, 
  Eye, 
  RefreshCw,
  TrendingUp,
  TrendingDown
} from 'lucide-react';

const mockAllQuotes = {
  CAMPUSX: { name: 'CampusX Academic Token', price: 1450.22, change: 3.25, volume: '1.2M', assetType: 'STOCK' },
  INFRA: { name: 'Infrastructure Bond', price: 102.15, change: -2.66, volume: '840K', assetType: 'STOCK' },
  YIELD: { name: 'Student Placement Pool', price: 342.88, change: 6.10, volume: '2.4M', assetType: 'STOCK' },
  VAULT: { name: 'Research IP Vault NFT', price: 280.00, change: 0.33, volume: '410K', assetType: 'STOCK' },
  AAPL: { name: 'Apple Inc.', price: 182.52, change: 1.15, volume: '45M', assetType: 'STOCK' },
  MSFT: { name: 'Microsoft Corp.', price: 418.15, change: -0.85, volume: '22M', assetType: 'STOCK' },
  NVDA: { name: 'Nvidia Corp.', price: 125.80, change: 4.88, volume: '90M', assetType: 'STOCK' }
};

export default function WatchlistPage() {
  const [user, setUser] = useState(null);
  const [watchlists, setWatchlists] = useState([]);
  const [activeWatchlistId, setActiveWatchlistId] = useState('');
  const [newWatchlistName, setNewWatchlistName] = useState('');
  const [symbolQuery, setSymbolQuery] = useState('');
  const [loading, setLoading] = useState(true);

  // Fallback lists in localStorage
  const loadLocalWatchlists = () => {
    if (typeof window === 'undefined') return;
    const saved = localStorage.getItem('campusx_market_watchlists');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setWatchlists(parsed);
        if (parsed.length > 0) setActiveWatchlistId(parsed[0].id);
      } catch (e) {}
    } else {
      const defaultWl = [
        {
          id: 'wl_default',
          name: 'Core Watchlist',
          items: [
            { symbol: 'CAMPUSX', asset_type: 'STOCK' },
            { symbol: 'INFRA', asset_type: 'STOCK' },
            { symbol: 'NVDA', asset_type: 'STOCK' }
          ]
        }
      ];
      setWatchlists(defaultWl);
      setActiveWatchlistId('wl_default');
      localStorage.setItem('campusx_market_watchlists', JSON.stringify(defaultWl));
    }
  };

  const fetchWatchlists = async (userId) => {
    try {
      const res = await fetch(`/api/market/watchlists?userId=${userId}`);
      const data = await res.json();
      if (data.success && data.watchlists && data.watchlists.length > 0) {
        setWatchlists(data.watchlists);
        setActiveWatchlistId(data.watchlists[0].id);
        localStorage.setItem('campusx_market_watchlists', JSON.stringify(data.watchlists));
      } else {
        loadLocalWatchlists();
      }
    } catch (e) {
      loadLocalWatchlists();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const session = sessionStorage.getItem('campusx_erp_session');
      if (session) {
        const u = JSON.parse(session);
        setUser(u);
        fetchWatchlists(u.id || 'usr_demo');
      } else {
        loadLocalWatchlists();
        setLoading(false);
      }
    }
  }, []);

  const handleCreateWatchlist = async () => {
    const name = newWatchlistName.trim();
    if (!name) return;

    const localId = 'wl_' + Math.random().toString(36).substr(2, 9);
    const newWl = { id: localId, name, items: [] };

    setWatchlists(prev => {
      const next = [...prev, newWl];
      localStorage.setItem('campusx_market_watchlists', JSON.stringify(next));
      return next;
    });
    setActiveWatchlistId(localId);
    setNewWatchlistName('');

    if (user) {
      try {
        await fetch('/api/market/watchlists', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: user.id || 'usr_demo', name })
        });
      } catch (e) {}
    }
  };

  const handleAddSymbol = async () => {
    const symbol = symbolQuery.toUpperCase().trim();
    if (!symbol || !mockAllQuotes[symbol]) {
      alert('Asset symbol not found in Terminal database.');
      return;
    }

    const currentWl = watchlists.find(wl => wl.id === activeWatchlistId);
    if (!currentWl) return;

    if (currentWl.items.some(item => item.symbol === symbol)) {
      alert('Symbol already in active watchlist.');
      return;
    }

    const updatedWatchlists = watchlists.map(wl => {
      if (wl.id === activeWatchlistId) {
        return {
          ...wl,
          items: [...wl.items, { symbol, asset_type: mockAllQuotes[symbol].assetType }]
        };
      }
      return wl;
    });

    setWatchlists(updatedWatchlists);
    localStorage.setItem('campusx_market_watchlists', JSON.stringify(updatedWatchlists));
    setSymbolQuery('');

    if (user && activeWatchlistId !== 'wl_default') {
      try {
        await fetch(`/api/market/watchlists/${activeWatchlistId}/symbols`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ symbol, assetType: mockAllQuotes[symbol].assetType })
        });
      } catch (e) {}
    }
  };

  const handleRemoveSymbol = async (symbol) => {
    const updatedWatchlists = watchlists.map(wl => {
      if (wl.id === activeWatchlistId) {
        return {
          ...wl,
          items: wl.items.filter(item => item.symbol !== symbol)
        };
      }
      return wl;
    });

    setWatchlists(updatedWatchlists);
    localStorage.setItem('campusx_market_watchlists', JSON.stringify(updatedWatchlists));

    if (user && activeWatchlistId !== 'wl_default') {
      try {
        await fetch(`/api/market/watchlists/${activeWatchlistId}/symbols/${symbol}`, {
          method: 'DELETE'
        });
      } catch (e) {}
    }
  };

  const activeWatchlist = watchlists.find(wl => wl.id === activeWatchlistId);

  return (
    <div className="flex flex-col gap-6 animate-fade-in text-white">
      
      {/* Page Header */}
      <div className="flex justify-between items-center border-b border-[#0F1B3A] pb-4">
        <div>
          <h1 className="text-xl font-bold uppercase tracking-wider text-white">Market Watchlists</h1>
          <p className="text-[11px] text-gray-500 mt-1">DYNAMIC WATCHLIST MANAGEMENT AND LIVE INDEX TICKER SYMBOLS</p>
        </div>
        <div className="flex items-center gap-3">
          <input 
            type="text" 
            placeholder="New Watchlist Name..."
            value={newWatchlistName}
            onChange={(e) => setNewWatchlistName(e.target.value)}
            className="bg-[#040814] border border-[#0F1B3A] text-xs text-white p-2 rounded outline-none w-44 focus:border-[#F59E0B]/50 font-mono"
          />
          <button 
            onClick={handleCreateWatchlist}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-[#F59E0B] hover:bg-[#D97706] text-black font-semibold text-xs uppercase tracking-wider transition-all cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create List</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-8">
        
        {/* Watchlists Sidebar */}
        <div className="flex flex-col gap-4">
          <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest pl-1">Your Watchlists</span>
          <div className="flex flex-col gap-2">
            {watchlists.map(wl => (
              <button 
                key={wl.id}
                onClick={() => setActiveWatchlistId(wl.id)}
                className={`w-full p-3.5 border text-left flex justify-between items-center transition-all cursor-pointer ${
                  activeWatchlistId === wl.id
                    ? 'bg-[#F59E0B]/10 border-[#F59E0B]/40 text-[#F59E0B] font-semibold'
                    : 'bg-[#0A1128]/40 border-[#0F1B3A] text-gray-400 hover:text-white hover:bg-white/[0.01]'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Eye className="w-3.5 h-3.5" />
                  <span className="text-xs font-mono uppercase tracking-wider">{wl.name}</span>
                </div>
                <span className="text-[9px] bg-white/5 text-gray-400 px-1.5 py-0.5 rounded font-mono">
                  {wl.items?.length || 0}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Watchlist Detail & Symbols Table */}
        <div className="bg-[#0A1128] border border-[#0F1B3A] p-6 flex flex-col gap-4">
          
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-3 border-b border-[#0F1B3A] pb-4">
            <div>
              <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                {activeWatchlist ? activeWatchlist.name : 'No Watchlist Selected'}
              </h2>
              <span className="text-[9px] text-gray-500 font-mono mt-1 block">
                ID: {activeWatchlist?.id} • {activeWatchlist?.items?.length || 0} ASSETS MONITORING
              </span>
            </div>
            
            {/* Search Symbol to add */}
            <div className="flex items-center gap-2">
              <div className="search-bar flex items-center bg-[#040814] border border-[#0F1B3A] rounded px-3 py-1.5 gap-2 w-56 focus-within:border-[#F59E0B]/40">
                <Search className="w-3.5 h-3.5 text-gray-500" />
                <input 
                  type="text" 
                  placeholder="ADD SYMBOL (e.g. AAPL)..."
                  value={symbolQuery}
                  onChange={(e) => setSymbolQuery(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') handleAddSymbol(); }}
                  className="bg-transparent border-none text-xs text-white outline-none w-full font-mono placeholder:text-gray-600 uppercase"
                />
              </div>
              <button 
                onClick={handleAddSymbol}
                className="px-3.5 py-1.5 bg-[#F59E0B]/10 hover:bg-[#F59E0B]/20 text-[#F59E0B] border border-[#F59E0B]/30 font-semibold text-xs uppercase tracking-wider transition-all cursor-pointer"
              >
                Add
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto mt-2">
            {activeWatchlist && activeWatchlist.items?.length > 0 ? (
              <table className="w-full text-left text-xs font-mono">
                <thead>
                  <tr className="border-b border-[#0F1B3A] text-gray-500 font-bold uppercase text-[9px] tracking-wider">
                    <th className="pb-3">Ticker Symbol</th>
                    <th className="pb-3">Asset Name</th>
                    <th className="pb-3">Price</th>
                    <th className="pb-3">Change %</th>
                    <th className="pb-3">Volume</th>
                    <th className="pb-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {activeWatchlist.items.map(item => {
                    const quote = mockAllQuotes[item.symbol] || { name: 'Unknown Asset', price: 0.00, change: 0.00, volume: 'N/A' };
                    return (
                      <tr 
                        key={item.symbol} 
                        className="border-b border-[#0F1B3A]/40 hover:bg-white/[0.01] transition-colors text-gray-300"
                      >
                        <td className="py-3 text-white font-bold"><code>{item.symbol}</code></td>
                        <td className="py-3">{quote.name}</td>
                        <td className="py-3 font-semibold">${quote.price.toFixed(2)}</td>
                        <td className={`py-3 font-semibold ${quote.change >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                          {quote.change >= 0 ? '+' : ''}{quote.change.toFixed(2)}%
                        </td>
                        <td className="py-3 text-gray-400">{quote.volume}</td>
                        <td className="py-3 text-right">
                          <button 
                            onClick={() => handleRemoveSymbol(item.symbol)}
                            className="p-1 border border-transparent hover:border-rose-500/20 hover:bg-rose-500/10 text-rose-400 transition-all cursor-pointer rounded"
                            title="Remove from Watchlist"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            ) : (
              <div className="text-center py-10 text-xs text-gray-500 uppercase tracking-widest border border-dashed border-[#0F1B3A]">
                No Ticker symbols found in this watchlist. Add a symbol above.
              </div>
            )}
          </div>

        </div>

      </div>

    </div>
  );
}
