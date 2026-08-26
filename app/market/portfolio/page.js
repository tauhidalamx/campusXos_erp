'use client';

import React, { useState, useEffect } from 'react';
import { 
  DollarSign, 
  TrendingUp, 
  ShieldAlert, 
  Activity,
  RefreshCw,
  Award
} from 'lucide-react';

const mockPrices = {
  CAMPUSX: 1450.22,
  INFRA: 102.15,
  YIELD: 342.88,
  VAULT: 280.00
};

export default function PortfolioPage() {
  const [user, setUser] = useState(null);
  const [cash, setCash] = useState(100000.00);
  const [holdings, setHoldings] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadLocalPortfolio = () => {
    if (typeof window === 'undefined') return;
    const savedCash = localStorage.getItem('campusx_market_portfolio_cash');
    const savedHoldings = localStorage.getItem('campusx_market_portfolio_holdings');
    
    if (savedCash) setCash(parseFloat(savedCash));
    else {
      setCash(85420.00);
      localStorage.setItem('campusx_market_portfolio_cash', '85420.00');
    }

    if (savedHoldings) {
      try { setHoldings(JSON.parse(savedHoldings)); } catch (e) {}
    } else {
      const defaultHoldings = [
        { symbol: 'CAMPUSX', quantity: 10, average_price: 1380.00 },
        { symbol: 'INFRA', quantity: 15, average_price: 100.50 }
      ];
      setHoldings(defaultHoldings);
      localStorage.setItem('campusx_market_portfolio_holdings', JSON.stringify(defaultHoldings));
    }
  };

  const fetchPortfolio = async (userId) => {
    try {
      const res = await fetch(`/api/market/portfolio?userId=${userId}`);
      const data = await res.json();
      if (data.success && data.portfolio) {
        setCash(data.portfolio.balance || data.portfolio.cash);
        setHoldings(data.portfolio.holdings || []);
        setTransactions(data.portfolio.transactions || []);
        
        localStorage.setItem('campusx_market_portfolio_cash', String(data.portfolio.balance || data.portfolio.cash));
        localStorage.setItem('campusx_market_portfolio_holdings', JSON.stringify(data.portfolio.holdings || []));
      } else {
        loadLocalPortfolio();
      }
    } catch (e) {
      loadLocalPortfolio();
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
        fetchPortfolio(u.id || 'usr_demo');
      } else {
        loadLocalPortfolio();
        setLoading(false);
      }
    }
  }, []);

  const totalHoldingsValue = holdings.reduce((acc, h) => {
    const currentPrice = mockPrices[h.symbol] || h.average_price;
    return acc + currentPrice * h.quantity;
  }, 0);

  const totalPortfolioValue = cash + totalHoldingsValue;

  return (
    <div className="flex flex-col gap-6 animate-fade-in text-white">
      
      {/* Page Header */}
      <div className="flex justify-between items-center border-b border-[#0F1B3A] pb-4">
        <div>
          <h1 className="text-xl font-bold uppercase tracking-wider text-white">Portfolio holdings & Risk</h1>
          <p className="text-[11px] text-gray-500 mt-1">DASHBOARD OF CASH ACCOUNT, DIGITAL ASSETS, AND PORTFOLIO DIVERSIFICATION STATS</p>
        </div>
        <button 
          onClick={() => user && fetchPortfolio(user.id)}
          className="p-2 border border-[#0F1B3A] text-gray-400 hover:text-[#F59E0B] hover:border-[#F59E0B] transition-all bg-transparent cursor-pointer"
          title="Refresh Portfolio"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#0A1128] border border-[#0F1B3A] p-5 flex flex-col">
          <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Total Account Value</span>
          <span className="text-xl font-bold font-mono text-white mt-2">${totalPortfolioValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
          <span className="text-[9px] text-emerald-400 mt-2 font-mono font-semibold flex items-center gap-0.5">
            <TrendingUp className="w-3.5 h-3.5" /> +4.2% overall gains
          </span>
        </div>
        <div className="bg-[#0A1128] border border-[#0F1B3A] p-5 flex flex-col">
          <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Cash Account Balance</span>
          <span className="text-xl font-bold font-mono text-white mt-2">${cash.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
          <span className="text-[9px] text-gray-500 mt-2 font-mono uppercase tracking-widest">Available Cash reserves</span>
        </div>
        <div className="bg-[#0A1128] border border-[#0F1B3A] p-5 flex flex-col">
          <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Asset Value</span>
          <span className="text-xl font-bold font-mono text-white mt-2">${totalHoldingsValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
          <span className="text-[9px] text-[#F59E0B] mt-2 font-mono uppercase tracking-widest">Active digital holdings</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Holdings Table */}
        <div className="bg-[#0A1128] border border-[#0F1B3A] p-6 lg:col-span-2 flex flex-col gap-4">
          <div className="border-b border-[#0F1B3A] pb-3">
            <span className="text-xs font-bold text-white uppercase tracking-widest">Active Asset Holdings</span>
          </div>
          <div className="overflow-x-auto">
            {holdings.length > 0 ? (
              <table className="w-full text-left text-xs font-mono">
                <thead>
                  <tr className="border-b border-[#0F1B3A] text-gray-500 font-bold uppercase text-[9px] tracking-wider">
                    <th className="pb-3">Symbol</th>
                    <th className="pb-3">Quantity</th>
                    <th className="pb-3">Avg Purchase Price</th>
                    <th className="pb-3">Current Price</th>
                    <th className="pb-3">Current Value</th>
                    <th className="pb-3">Unrealized P&L</th>
                  </tr>
                </thead>
                <tbody>
                  {holdings.map(h => {
                    const currentPrice = mockPrices[h.symbol] || h.average_price;
                    const currentValue = currentPrice * h.quantity;
                    const costBasis = h.average_price * h.quantity;
                    const profitLoss = currentValue - costBasis;
                    const profitLossPct = costBasis > 0 ? (profitLoss / costBasis) * 100 : 0;
                    return (
                      <tr key={h.symbol} className="border-b border-[#0F1B3A]/40 text-gray-300">
                        <td className="py-3 text-white font-bold"><code>{h.symbol}</code></td>
                        <td className="py-3">{h.quantity}</td>
                        <td className="py-3">${h.average_price.toFixed(2)}</td>
                        <td className="py-3">${currentPrice.toFixed(2)}</td>
                        <td className="py-3 font-semibold">${currentValue.toFixed(2)}</td>
                        <td className={`py-3 font-bold ${profitLoss >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                          ${profitLoss.toFixed(2)} ({profitLossPct.toFixed(2)}%)
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            ) : (
              <div className="text-center py-10 text-xs text-gray-500 uppercase tracking-widest border border-dashed border-[#0F1B3A]">
                No holdings currently active. Purchase assets on the order desk.
              </div>
            )}
          </div>
        </div>

        {/* Risk Metrics */}
        <div className="bg-[#0A1128] border border-[#0F1B3A] p-6 flex flex-col gap-4">
          <div className="border-b border-[#0F1B3A] pb-3">
            <span className="text-xs font-bold text-white uppercase tracking-widest">Risk Analytics</span>
          </div>
          <div className="flex flex-col gap-4 text-xs font-mono">
            <div className="flex justify-between border-b border-[#0F1B3A]/30 pb-2">
              <span className="text-gray-400">Sharpe Ratio</span>
              <span className="text-emerald-400 font-bold">2.41 (High Yield)</span>
            </div>
            <div className="flex justify-between border-b border-[#0F1B3A]/30 pb-2">
              <span className="text-gray-400">Sortino Ratio</span>
              <span className="text-emerald-400 font-bold">3.12 (Low Downside)</span>
            </div>
            <div className="flex justify-between border-b border-[#0F1B3A]/30 pb-2">
              <span className="text-gray-400">Maximum Drawdown</span>
              <span className="text-rose-400 font-bold">-6.4%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Value-at-Risk (5d 95%)</span>
              <span className="text-[#F59E0B] font-bold">$420.00 USD</span>
            </div>

            <div className="bg-[#040814] border border-[#0F1B3A] p-4 text-[10px] text-gray-500 leading-relaxed mt-4">
              <div className="flex gap-1.5 items-center mb-1 text-gray-400 font-bold">
                <ShieldAlert className="w-3.5 h-3.5 text-[#F59E0B]" />
                <span>RISK DISCLAIMER</span>
              </div>
              PORTFOLIO METRICS RUN ON CAUSAL PARAMETERS CORRESPONDING TO SIMULATED LIQUIDITY BOOKS.
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
