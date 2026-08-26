'use client';

import React, { useState, useEffect } from 'react';
import { 
  DollarSign, 
  TrendingUp, 
  ArrowLeftRight,
  ShieldCheck,
  Clock,
  RefreshCw
} from 'lucide-react';

const mockWatchlists = {
  CAMPUSX: { name: 'CampusX Tech Holdings', price: 154.20 },
  INFRA: { name: 'Infrastructure Bond', price: 102.15 },
  YIELD: { name: 'Student Placement Pool', price: 342.88 },
  VAULT: { name: 'Research IP Vault NFT', price: 280.00 },
  AAPL: { name: 'Apple Inc.', price: 182.52 },
  MSFT: { name: 'Microsoft Corp.', price: 418.15 },
  NVDA: { name: 'Nvidia Corp.', price: 125.80 }
};

export default function PaperTradingPage() {
  const [user, setUser] = useState(null);
  const [cash, setCash] = useState(100000.00);
  const [holdings, setHoldings] = useState([]);
  const [transactions, setTransactions] = useState([]);

  // Form states
  const [selectedStock, setSelectedStock] = useState('CAMPUSX');
  const [tradeQty, setTradeQty] = useState(1);
  const [tradeType, setTradeType] = useState('BUY');
  const [loading, setLoading] = useState(true);

  const loadLocalTrading = () => {
    if (typeof window === 'undefined') return;
    const savedCash = localStorage.getItem('campusx_market_portfolio_cash');
    const savedHoldings = localStorage.getItem('campusx_market_portfolio_holdings');
    const savedTxs = localStorage.getItem('campusx_market_portfolio_txs');

    if (savedCash) setCash(parseFloat(savedCash));
    if (savedHoldings) {
      try { setHoldings(JSON.parse(savedHoldings)); } catch (e) {}
    } else {
      setHoldings([{ symbol: 'CAMPUSX', quantity: 10, average_price: 1380.00 }]);
    }
    if (savedTxs) {
      try { setTransactions(JSON.parse(savedTxs)); } catch (e) {}
    } else {
      const defaultTxs = [
        { id: 'tx_init', symbol: 'CAMPUSX', qty: 10, price: 1380.00, type: 'BUY', timestamp: new Date().toISOString() }
      ];
      setTransactions(defaultTxs);
      localStorage.setItem('campusx_market_portfolio_txs', JSON.stringify(defaultTxs));
    }
  };

  const fetchPortfolioData = async (userId) => {
    try {
      const res = await fetch(`/api/market/portfolio?userId=${userId}`);
      const data = await res.json();
      if (data.success && data.portfolio) {
        setCash(data.portfolio.balance || data.portfolio.cash);
        setHoldings(data.portfolio.holdings || []);
        setTransactions(data.portfolio.transactions || []);

        localStorage.setItem('campusx_market_portfolio_cash', String(data.portfolio.balance || data.portfolio.cash));
        localStorage.setItem('campusx_market_portfolio_holdings', JSON.stringify(data.portfolio.holdings || []));
        localStorage.setItem('campusx_market_portfolio_txs', JSON.stringify(data.portfolio.transactions || []));
      } else {
        loadLocalTrading();
      }
    } catch (e) {
      loadLocalTrading();
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
        fetchPortfolioData(u.id || 'usr_demo');
      } else {
        loadLocalTrading();
        setLoading(false);
      }
    }
  }, []);

  const handleExecuteTrade = async () => {
    const qty = parseFloat(tradeQty);
    if (isNaN(qty) || qty <= 0) {
      alert('Enter a valid quantity.');
      return;
    }

    const price = mockWatchlists[selectedStock]?.price || 100.00;
    const totalCost = price * qty;

    if (tradeType === 'BUY') {
      if (cash < totalCost) {
        alert('Insufficient cash balance to fulfill this buy order.');
        return;
      }

      // Update locally
      const nextCash = cash - totalCost;
      const existingHolding = holdings.find(h => h.symbol === selectedStock);
      let nextHoldings;
      if (existingHolding) {
        nextHoldings = holdings.map(h => {
          if (h.symbol === selectedStock) {
            const nextQty = h.quantity + qty;
            const nextAvg = (h.average_price * h.quantity + price * qty) / nextQty;
            return { ...h, quantity: nextQty, average_price: nextAvg };
          }
          return h;
        });
      } else {
        nextHoldings = [...holdings, { symbol: selectedStock, quantity: qty, average_price: price }];
      }

      const newTx = {
        id: 'tx_' + Date.now(),
        symbol: selectedStock,
        qty,
        price,
        type: 'BUY',
        timestamp: new Date().toISOString()
      };

      const nextTxs = [newTx, ...transactions];

      setCash(nextCash);
      setHoldings(nextHoldings);
      setTransactions(nextTxs);

      localStorage.setItem('campusx_market_portfolio_cash', String(nextCash));
      localStorage.setItem('campusx_market_portfolio_holdings', JSON.stringify(nextHoldings));
      localStorage.setItem('campusx_market_portfolio_txs', JSON.stringify(nextTxs));

      alert(`Order Filled: Bought ${qty} ${selectedStock} at $${price.toFixed(2)}`);
    } else {
      const existingHolding = holdings.find(h => h.symbol === selectedStock);
      if (!existingHolding || existingHolding.quantity < qty) {
        alert('Insufficient asset holdings to fulfill this sell order.');
        return;
      }

      const nextCash = cash + totalCost;
      const nextHoldings = holdings.map(h => {
        if (h.symbol === selectedStock) {
          return { ...h, quantity: h.quantity - qty };
        }
        return h;
      }).filter(h => h.quantity > 0);

      const newTx = {
        id: 'tx_' + Date.now(),
        symbol: selectedStock,
        qty,
        price,
        type: 'SELL',
        timestamp: new Date().toISOString()
      };

      const nextTxs = [newTx, ...transactions];

      setCash(nextCash);
      setHoldings(nextHoldings);
      setTransactions(nextTxs);

      localStorage.setItem('campusx_market_portfolio_cash', String(nextCash));
      localStorage.setItem('campusx_market_portfolio_holdings', JSON.stringify(nextHoldings));
      localStorage.setItem('campusx_market_portfolio_txs', JSON.stringify(nextTxs));

      alert(`Order Filled: Sold ${qty} ${selectedStock} at $${price.toFixed(2)}`);
    }

    // Submit to backend
    if (user) {
      try {
        await fetch('/api/market/portfolio/transaction', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: user.id || 'usr_demo',
            symbol: selectedStock,
            assetType: 'STOCK',
            type: tradeType,
            quantity: qty,
            price
          })
        });
      } catch (e) {}
    }
  };

  return (
    <div className="flex flex-col gap-6 animate-fade-in text-white">
      
      {/* Page Header */}
      <div className="flex justify-between items-center border-b border-[#0F1B3A] pb-4">
        <div>
          <h1 className="text-xl font-bold uppercase tracking-wider text-white">Paper Trading Desk</h1>
          <p className="text-[11px] text-gray-500 mt-1">SIMULATE ORDER EXECUTIONS AND VIEW HISTORICAL LEDGER ENTRIES</p>
        </div>
        <div className="text-xs font-mono bg-[#0A1128] border border-[#0F1B3A] px-3.5 py-1.5 font-semibold text-[#F59E0B]">
          Simulated Cash: ${cash.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[340px_1fr] gap-8">
        
        {/* Order Form */}
        <div className="bg-[#0A1128] border border-[#0F1B3A] p-5 flex flex-col gap-4">
          <div className="border-b border-[#0F1B3A] pb-3 text-xs font-bold text-white uppercase tracking-widest flex items-center gap-1.5">
            <ArrowLeftRight className="w-4 h-4 text-[#F59E0B]" />
            <span>Order Entry Book</span>
          </div>

          <div className="flex flex-col gap-4 text-xs font-mono">
            {/* Symbol */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[9px] text-gray-500 uppercase tracking-widest pl-0.5">Asset Ticker</label>
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

            {/* Type */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[9px] text-gray-500 uppercase tracking-widest pl-0.5">Order Action</label>
              <div className="grid grid-cols-2 gap-2">
                <button 
                  onClick={() => setTradeType('BUY')}
                  className={`py-2 rounded font-bold uppercase tracking-wider cursor-pointer border ${
                    tradeType === 'BUY' 
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' 
                      : 'bg-transparent text-gray-400 border-[#0F1B3A] hover:bg-white/[0.01]'
                  }`}
                >
                  Buy
                </button>
                <button 
                  onClick={() => setTradeType('SELL')}
                  className={`py-2 rounded font-bold uppercase tracking-wider cursor-pointer border ${
                    tradeType === 'SELL' 
                      ? 'bg-rose-500/10 text-rose-400 border-rose-500/30' 
                      : 'bg-transparent text-gray-400 border-[#0F1B3A] hover:bg-white/[0.01]'
                  }`}
                >
                  Sell
                </button>
              </div>
            </div>

            {/* Quantity */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[9px] text-gray-500 uppercase tracking-widest pl-0.5">Order Quantity</label>
              <input 
                type="number"
                min="0.01"
                step="0.01"
                value={tradeQty}
                onChange={(e) => setTradeQty(parseFloat(e.target.value) || 0)}
                className="w-full bg-[#040814] border border-[#0F1B3A] text-white p-2.5 rounded outline-none focus:border-[#F59E0B]/50 font-bold"
              />
            </div>

            <div className="bg-[#040814] border border-[#0F1B3A] p-3 text-[10px] text-gray-400 flex flex-col gap-1.5 mt-2">
              <div className="flex justify-between">
                <span>Execution Price:</span>
                <span className="font-bold text-white">${(mockWatchlists[selectedStock]?.price || 0).toFixed(2)}</span>
              </div>
              <div className="flex justify-between border-t border-[#0F1B3A]/40 pt-1.5 mt-0.5">
                <span>Est. Order Value:</span>
                <span className="font-bold text-[#F59E0B]">${( (mockWatchlists[selectedStock]?.price || 0) * tradeQty ).toFixed(2)}</span>
              </div>
            </div>

            <button 
              onClick={handleExecuteTrade}
              className={`w-full py-3 mt-4 text-black font-bold uppercase tracking-widest text-xs cursor-pointer transition-all ${
                tradeType === 'BUY' ? 'bg-emerald-400 hover:bg-emerald-500' : 'bg-rose-400 hover:bg-rose-500'
              }`}
            >
              Submit order to Book
            </button>
          </div>
        </div>

        {/* Transaction History */}
        <div className="bg-[#0A1128] border border-[#0F1B3A] p-6 flex flex-col gap-4">
          <div className="border-b border-[#0F1B3A] pb-3 text-xs font-bold text-white uppercase tracking-widest flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-gray-500" />
            <span>Order History Ledger</span>
          </div>

          <div className="overflow-y-auto max-h-[380px]">
            {transactions.length > 0 ? (
              <table className="w-full text-left text-xs font-mono">
                <thead>
                  <tr className="border-b border-[#0F1B3A] text-gray-500 font-bold uppercase text-[9px] tracking-wider">
                    <th className="pb-3">Transaction ID</th>
                    <th className="pb-3">Symbol</th>
                    <th className="pb-3">Type</th>
                    <th className="pb-3">Qty</th>
                    <th className="pb-3">Execution Price</th>
                    <th className="pb-3">Total Value</th>
                    <th className="pb-3 text-right">Date Time</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map(tx => (
                    <tr key={tx.id} className="border-b border-[#0F1B3A]/40 text-gray-300">
                      <td className="py-2.5 text-gray-500 text-[10px]"><code>{tx.id.substr(0, 10)}</code></td>
                      <td className="py-2.5 text-white font-bold"><code>{tx.symbol}</code></td>
                      <td className="py-2.5">
                        <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                          tx.type === 'BUY' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'
                        }`}>
                          {tx.type}
                        </span>
                      </td>
                      <td className="py-2.5 font-bold">{tx.qty}</td>
                      <td className="py-2.5">${tx.price.toFixed(2)}</td>
                      <td className="py-2.5 font-semibold">${(tx.price * tx.qty).toFixed(2)}</td>
                      <td className="py-2.5 text-right text-gray-500 text-[10px]">{new Date(tx.timestamp).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="text-center py-10 text-xs text-gray-500 uppercase tracking-widest border border-dashed border-[#0F1B3A]">
                No transaction ledger logs resolved.
              </div>
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
