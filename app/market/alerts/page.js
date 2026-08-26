'use client';

import React, { useState, useEffect } from 'react';
import { 
  Bell, 
  Plus, 
  Trash2, 
  Activity, 
  RefreshCw,
  TrendingUp,
  AlertTriangle
} from 'lucide-react';

const mockWatchlists = {
  CAMPUSX: { name: 'CampusX Tech Holdings', price: 154.20 },
  INFRA: { name: 'Infrastructure Bond', price: 102.15 },
  YIELD: { name: 'Student Placement Pool', price: 342.88 },
  VAULT: { name: 'Research IP Vault NFT', price: 280.00 }
};

export default function AlertsPage() {
  const [user, setUser] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [selectedStock, setSelectedStock] = useState('CAMPUSX');
  const [alertPrice, setAlertPrice] = useState(150);
  const [alertType, setAlertType] = useState('ABOVE');
  const [loading, setLoading] = useState(true);

  const loadLocalAlerts = () => {
    if (typeof window === 'undefined') return;
    const saved = localStorage.getItem('campusx_market_alerts');
    if (saved) {
      try { setAlerts(JSON.parse(saved)); } catch (e) {}
    } else {
      const defaultAlerts = [
        { id: 'al_1', symbol: 'CAMPUSX', targetPrice: 160.00, direction: 'ABOVE', timestamp: new Date().toISOString() },
        { id: 'al_2', symbol: 'INFRA', targetPrice: 98.00, direction: 'BELOW', timestamp: new Date().toISOString() }
      ];
      setAlerts(defaultAlerts);
      localStorage.setItem('campusx_market_alerts', JSON.stringify(defaultAlerts));
    }
  };

  const fetchAlerts = async (userId) => {
    try {
      const res = await fetch(`/api/market/alerts?userId=${userId}`);
      const data = await res.json();
      if (data.success && data.alerts) {
        setAlerts(data.alerts);
        localStorage.setItem('campusx_market_alerts', JSON.stringify(data.alerts));
      } else {
        loadLocalAlerts();
      }
    } catch (e) {
      loadLocalAlerts();
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
        fetchAlerts(u.id || 'usr_demo');
      } else {
        loadLocalAlerts();
        setLoading(false);
      }
    }
  }, []);

  const handleCreateAlert = async () => {
    const price = parseFloat(alertPrice);
    if (isNaN(price) || price <= 0) {
      alert('Enter a valid trigger price.');
      return;
    }

    const newAlert = {
      id: 'al_' + Date.now(),
      symbol: selectedStock,
      targetPrice: price,
      direction: alertType,
      timestamp: new Date().toISOString()
    };

    const nextAlerts = [newAlert, ...alerts];
    setAlerts(nextAlerts);
    localStorage.setItem('campusx_market_alerts', JSON.stringify(nextAlerts));
    setAlertPrice(150);

    alert(`Price Alert Set: Trigger when ${selectedStock} goes ${alertType} $${price.toFixed(2)}`);

    if (user) {
      try {
        await fetch('/api/market/alerts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: user.id || 'usr_demo',
            symbol: selectedStock,
            targetPrice: price,
            direction: alertType
          })
        });
      } catch (e) {}
    }
  };

  const handleDeleteAlert = async (id) => {
    const nextAlerts = alerts.filter(al => al.id !== id);
    setAlerts(nextAlerts);
    localStorage.setItem('campusx_market_alerts', JSON.stringify(nextAlerts));

    if (user && !String(id).startsWith('al_')) {
      try {
        await fetch(`/api/market/alerts/${id}`, {
          method: 'DELETE'
        });
      } catch (e) {}
    }
  };

  return (
    <div className="flex flex-col gap-6 animate-fade-in text-white">
      
      {/* Page Header */}
      <div className="flex justify-between items-center border-b border-[#0F1B3A] pb-4">
        <div>
          <h1 className="text-xl font-bold uppercase tracking-wider text-white">Price Trigger Alerts</h1>
          <p className="text-[11px] text-gray-500 mt-1">CONFIGURE THRESHOLD MONITORS WITH SYSTEM SOUND NOTIFICATIONS</p>
        </div>
        <button 
          onClick={() => user && fetchAlerts(user.id)}
          className="p-2 border border-[#0F1B3A] text-gray-400 hover:text-[#F59E0B] hover:border-[#F59E0B] transition-all bg-transparent cursor-pointer"
          title="Refresh Alerts"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-8">
        
        {/* Create Alert Panel */}
        <div className="bg-[#0A1128] border border-[#0F1B3A] p-5 flex flex-col gap-4">
          <div className="border-b border-[#0F1B3A] pb-3 text-xs font-bold text-white uppercase tracking-widest flex items-center gap-1.5">
            <Plus className="w-4 h-4 text-[#F59E0B]" />
            <span>Configure Monitor</span>
          </div>

          <div className="flex flex-col gap-4 text-xs font-mono">
            {/* Symbol */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[9px] text-gray-500 uppercase tracking-widest pl-0.5">Asset Symbol</label>
              <select 
                value={selectedStock}
                onChange={(e) => setSelectedStock(e.target.value)}
                className="w-full bg-[#040814] border border-[#0F1B3A] text-white p-2.5 rounded outline-none uppercase font-bold"
              >
                {Object.keys(mockWatchlists).map(sym => (
                  <option key={sym} value={sym}>{sym} (${mockWatchlists[sym].price.toFixed(2)})</option>
                ))}
              </select>
            </div>

            {/* Condition */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[9px] text-gray-500 uppercase tracking-widest pl-0.5">Alert Condition</label>
              <select 
                value={alertType}
                onChange={(e) => setAlertType(e.target.value)}
                className="w-full bg-[#040814] border border-[#0F1B3A] text-white p-2.5 rounded outline-none font-bold"
              >
                <option value="ABOVE">PRICE CROSSES ABOVE (&gt;)</option>
                <option value="BELOW">PRICE CROSSES BELOW (&lt;)</option>
              </select>
            </div>

            {/* Price value */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[9px] text-gray-500 uppercase tracking-widest pl-0.5">Trigger Price Value</label>
              <input 
                type="number"
                step="0.01"
                value={alertPrice}
                onChange={(e) => setAlertPrice(parseFloat(e.target.value) || 0)}
                className="w-full bg-[#040814] border border-[#0F1B3A] text-white p-2.5 rounded outline-none focus:border-[#F59E0B]/50 font-bold"
              />
            </div>

            <button 
              onClick={handleCreateAlert}
              className="w-full py-3 mt-4 bg-[#F59E0B] hover:bg-[#D97706] text-black font-bold uppercase tracking-widest text-xs cursor-pointer transition-all"
            >
              Set price monitor
            </button>
          </div>
        </div>

        {/* Active Alerts List */}
        <div className="bg-[#0A1128] border border-[#0F1B3A] p-6 flex flex-col gap-4">
          <div className="border-b border-[#0F1B3A] pb-3 text-xs font-bold text-white uppercase tracking-widest flex items-center gap-1.5">
            <Bell className="w-4 h-4 text-gray-500 animate-swing" />
            <span>Active Trigger Monitors</span>
          </div>

          <div className="overflow-y-auto max-h-[380px]">
            {alerts.length > 0 ? (
              <table className="w-full text-left text-xs font-mono">
                <thead>
                  <tr className="border-b border-[#0F1B3A] text-gray-500 font-bold uppercase text-[9px] tracking-wider">
                    <th className="pb-3">Alert ID</th>
                    <th className="pb-3">Symbol</th>
                    <th className="pb-3">Trigger Condition</th>
                    <th className="pb-3">Trigger Price</th>
                    <th className="pb-3">Current Price</th>
                    <th className="pb-3 text-right font-bold text-[#EF4444]">Deactivate</th>
                  </tr>
                </thead>
                <tbody>
                  {alerts.map(al => {
                    const curPrice = mockWatchlists[al.symbol]?.price || 0;
                    return (
                      <tr key={al.id} className="border-b border-[#0F1B3A]/40 text-gray-300">
                        <td className="py-2.5 text-gray-500 text-[10px]"><code>{al.id.substr(0, 10)}</code></td>
                        <td className="py-2.5 text-white font-bold"><code>{al.symbol}</code></td>
                        <td className="py-2.5">
                          <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold ${
                            al.direction === 'ABOVE' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'
                          }`}>
                            CROSSES {al.direction}
                          </span>
                        </td>
                        <td className="py-2.5 font-bold">${al.targetPrice.toFixed(2)}</td>
                        <td className="py-2.5 font-semibold text-gray-400">${curPrice.toFixed(2)}</td>
                        <td className="py-2.5 text-right">
                          <button 
                            onClick={() => handleDeleteAlert(al.id)}
                            className="p-1 border border-transparent hover:border-rose-500/20 hover:bg-rose-500/10 text-rose-400 transition-all cursor-pointer rounded"
                            title="Deactivate Trigger"
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
                No active threshold triggers configured.
              </div>
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
