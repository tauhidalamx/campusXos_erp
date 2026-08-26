'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Clock, 
  BookOpen, 
  Briefcase, 
  Sparkles, 
  ChevronRight, 
  RefreshCw, 
  ArrowUpRight, 
  ArrowDownRight, 
  Search, 
  Bell, 
  User, 
  Cpu, 
  Layers, 
  ShieldAlert, 
  Activity, 
  FileText,
  Percent,
  Play,
  Bookmark,
  Download,
  Send
} from 'lucide-react';

const mockIndices = [
  { name: 'NIFTY 50', price: 23450.80, change: 120.40, pct: 0.52, sentiment: 'Bullish (68%)' },
  { name: 'SENSEX', price: 77210.30, change: 410.90, pct: 0.53, sentiment: 'Bullish (65%)' },
  { name: 'NASDAQ', price: 17850.50, change: -180.20, pct: -1.00, sentiment: 'Bearish (54%)' },
  { name: 'S&P 500', price: 5430.20, change: -24.80, pct: -0.45, sentiment: 'Neutral (50%)' },
  { name: 'BTC/USD', price: 67420.00, change: 1420.00, pct: 2.15, sentiment: 'Bullish (76%)' },
  { name: 'GOLD (OZ)', price: 2315.40, change: 15.20, pct: 0.66, sentiment: 'Bullish (62%)' }
];

const mockWatchlists = {
  CAMPUSX: { name: 'CampusX Tech Holdings', price: 154.20, change: 3.25, volume: '1.2M', cap: '$3.1B' },
  TECH: { name: 'CampusX Incubator Index', price: 84.10, change: -2.66, volume: '840K', cap: '$1.8B' },
  EDU: { name: 'EdTech Global Corp', price: 210.50, change: 6.10, volume: '2.4M', cap: '$5.4B' },
  RES: { name: 'Quantum Lab Inc', price: 45.75, change: 0.33, volume: '410K', cap: '$980M' }
};

const agentPersonas = {
  analyst: {
    name: 'Market Analyst Agent',
    role: 'Technical & fundamental trends analyzer.',
    avatar: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=150',
    prompt: 'Query: Analyze NIFTY 50 technical trend.\nResponse: 🤖 **Analyst Agent**: NIFTY 50 is clearing key resistance at 23,400. RSI sits at 62.1 indicating positive momentum without entering overbought levels. Moving averages confirm short-term bullish continuation.'
  },
  risk: {
    name: 'Risk Analyst Agent',
    role: 'Portfolio Value-at-Risk (VaR) and drawdown auditor.',
    avatar: 'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=150',
    prompt: 'Query: Assess volatility risk index.\nResponse: 🤖 **Risk Agent**: Volatility has expanded 4.1%. VaR calculation (95% confidence) estimates potential portfolio loss at $420 over 5 days. Recommending index hedges.'
  },
  research: {
    name: 'Research Agent',
    role: 'Aggregates grant guidelines and co-author patents indices.',
    avatar: 'https://images.unsplash.com/photo-1543269865-cbf427effbad?w=150',
    prompt: 'Query: Check EdTech patent indices.\nResponse: 🤖 **Research Agent**: EDU Tech holds 14 patents in VR learning spaces. Cite Index projected +12% CIT yield. Recommended target range: $220.'
  },
  portfolio: {
    name: 'Portfolio Agent',
    role: 'Runs dynamic allocations, Sharpe ratios, and Sortino reviews.',
    avatar: 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=150',
    prompt: 'Query: Evaluate portfolio metrics.\nResponse: 🤖 **Portfolio Agent**: Current portfolio Sharpe ratio is 2.41, Sortino ratio is 3.12, maximum drawdown is -6.4%. Allocation is optimized for high yield growth.'
  },
  news: {
    name: 'News Agent',
    role: 'Scrapes financial bulletins and measures sentiment indexes.',
    avatar: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=150',
    prompt: 'Query: Check latest CampusX announcements.\nResponse: 🤖 **News Agent**: CampusX AI Incubator secured $12M in federal grant funding. Alternative sentiment indexes shifted +14% bullish on ticker CAMPUSX.'
  },
  prediction: {
    name: 'Prediction Agent',
    role: 'Hosts TensorFlow models (LSTM/Transformers) parameter fits.',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    prompt: 'Query: Provide model projection for ticker CAMPUSX.\nResponse: 🤖 **Prediction Agent**: LSTM 7-day forecast indicates a target of $162.40 with a confidence threshold score of 94.2%. Trend direction: UP.'
  }
};

export default function MarketIntelligencePage() {
  const [selectedStock, setSelectedStock] = useState('CAMPUSX');
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'predictions' | 'charts' | 'quant' | 'portfolio' | 'agents'
  
  // Custom watchlist state
  const [watchlist, setWatchlist] = useState(['CAMPUSX', 'TECH', 'EDU']);
  const [searchTicker, setSearchTicker] = useState('');
  
  // Model training configurations
  const [selectedModel, setSelectedModel] = useState('LSTM'); // 'LSTM' | 'GRU' | 'Transformer' | 'XGBoost'
  const [epochs, setEpochs] = useState(100);
  const [lr, setLr] = useState(0.05);
  const [isTraining, setIsTraining] = useState(false);
  const [trainingProgress, setTrainingProgress] = useState(0);
  const [trainingLoss, setTrainingLoss] = useState(null);
  const [fitEquation, setFitEquation] = useState('y = mx + c');
  
  // Predictions state
  const [forecastClose, setForecastClose] = useState(null);
  const [forecastPrices, setForecastPrices] = useState({
    '1d': 156.40,
    '7d': 161.80,
    '30d': 169.50,
    direction: 'UP',
    confidence: '92.4%',
    risk: 'Low Risk'
  });

  // Technical chart configuration
  const [showSMA, setShowSMA] = useState(true);
  const [showEMA, setShowEMA] = useState(false);
  const [showBollinger, setShowBollinger] = useState(false);
  const [showVWAP, setShowVWAP] = useState(false);

  // Portfolio holdings simulation
  const [portfolio, setPortfolio] = useState({
    cash: 10000,
    holdings: {
      CAMPUSX: 30,
      EDU: 10
    }
  });
  const [tradeQty, setTradeQty] = useState(1);
  const [tradeType, setTradeType] = useState('BUY');

  // Quantitative Alert creation
  const [alerts, setAlerts] = useState([
    { id: '1', symbol: 'CAMPUSX', trigger: 160.00, type: 'ABOVE', status: 'ACTIVE' }
  ]);
  const [alertPrice, setAlertPrice] = useState(160.00);
  const [alertType, setAlertType] = useState('ABOVE');

  // AI Agent Interactive chat
  const [selectedAgent, setSelectedAgent] = useState('analyst');
  const [agentInput, setAgentInput] = useState('');
  const [agentLogs, setAgentLogs] = useState([
    { sender: 'ai', text: 'Select a specialized CampusX AI Financial Agent and query them directly.' }
  ]);
  const [agentLoading, setAgentLoading] = useState(false);

  // Canvas drawing ref
  const canvasRef = useRef(null);

  // Redirect to new standalone /market route for premium sub-navigation experience
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.location.href = '/market';
    }
  }, []);

  // Draw Candlestick & Indicator overlays
  useEffect(() => {
    if (!canvasRef.current || activeTab !== 'charts') return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    canvas.width = canvas.parentElement.clientWidth;
    canvas.height = canvas.parentElement.clientHeight || 280;

    const w = canvas.width;
    const h = canvas.height;
    ctx.clearRect(0, 0, w, h);

    // Grid lines
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
    ctx.lineWidth = 1;
    for (let i = 1; i < 5; i++) {
      const y = (h / 5) * i;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();

      const x = (w / 5) * i;
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h);
      ctx.stroke();
    }

    const currentPrice = mockWatchlists[selectedStock].price;
    // Generate mock candlesticks around the stock price
    const basePrices = [
      currentPrice * 0.96,
      currentPrice * 0.98,
      currentPrice * 0.97,
      currentPrice * 0.99,
      currentPrice
    ];
    
    const maxVal = Math.max(...basePrices) * 1.02;
    const minVal = Math.min(...basePrices) * 0.98;
    const range = maxVal - minVal;

    const scaleY = (p) => h - ((p - minVal) / range) * (h - 60) - 30;
    const stepX = w / 5;

    // Render candles
    basePrices.forEach((cPrice, idx) => {
      const x = stepX * idx + stepX / 2;
      const open = cPrice * (idx % 2 === 0 ? 0.99 : 1.01);
      const close = cPrice;
      const high = Math.max(open, close) * 1.008;
      const low = Math.min(open, close) * 0.992;

      const isGreen = close >= open;
      ctx.strokeStyle = isGreen ? '#22C55E' : '#EF4444';
      ctx.fillStyle = isGreen ? '#22C55E' : '#EF4444';
      ctx.lineWidth = 2;

      // Wick
      ctx.beginPath();
      ctx.moveTo(x, scaleY(high));
      ctx.lineTo(x, scaleY(low));
      ctx.stroke();

      // Body
      const openY = scaleY(open);
      const closeY = scaleY(close);
      const bodyH = Math.max(Math.abs(closeY - openY), 4);
      const bodyY = Math.min(openY, closeY);
      ctx.fillRect(x - 12, bodyY, 24, bodyH);
    });

    // SMA Overlay
    if (showSMA) {
      ctx.strokeStyle = '#6366F1';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      basePrices.forEach((p, idx) => {
        const x = stepX * idx + stepX / 2;
        const y = scaleY(p * 0.99);
        if (idx === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.stroke();
    }

    // EMA Overlay
    if (showEMA) {
      ctx.strokeStyle = '#06b6d4';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      basePrices.forEach((p, idx) => {
        const x = stepX * idx + stepX / 2;
        const y = scaleY(p * 0.995);
        if (idx === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.stroke();
    }

    // Bollinger Bands Overlay
    if (showBollinger) {
      ctx.strokeStyle = 'rgba(245, 158, 11, 0.4)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      basePrices.forEach((p, idx) => {
        const x = stepX * idx + stepX / 2;
        const y = scaleY(p * 1.015);
        if (idx === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.stroke();

      ctx.beginPath();
      basePrices.forEach((p, idx) => {
        const x = stepX * idx + stepX / 2;
        const y = scaleY(p * 0.975);
        if (idx === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.stroke();
    }

    // VWAP Overlay
    if (showVWAP) {
      ctx.strokeStyle = '#f43f5e';
      ctx.lineWidth = 2.5;
      ctx.setLineDash([3, 3]);
      ctx.beginPath();
      basePrices.forEach((p, idx) => {
        const x = stepX * idx + stepX / 2;
        const y = scaleY(p * 0.988);
        if (idx === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.stroke();
      ctx.setLineDash([]);
    }

  }, [selectedStock, activeTab, showSMA, showEMA, showBollinger, showVWAP]);

  // Execute quantitative trade simulator
  const handleExecuteTrade = () => {
    const stockPrice = mockWatchlists[selectedStock].price;
    const totalCost = stockPrice * tradeQty;

    if (tradeType === 'BUY') {
      if (portfolio.cash < totalCost) {
        alert("Insufficient cash balance.");
        return;
      }
      setPortfolio(prev => ({
        ...prev,
        cash: prev.cash - totalCost,
        holdings: {
          ...prev.holdings,
          [selectedStock]: (prev.holdings[selectedStock] || 0) + tradeQty
        }
      }));
      alert(`Trade Success: Bought ${tradeQty} shares of ${selectedStock} for $${totalCost.toFixed(2)}.`);
    } else {
      const currentQty = portfolio.holdings[selectedStock] || 0;
      if (currentQty < tradeQty) {
        alert("Insufficient shares to fulfill this sale.");
        return;
      }
      setPortfolio(prev => ({
        ...prev,
        cash: prev.cash + totalCost,
        holdings: {
          ...prev.holdings,
          [selectedStock]: currentQty - tradeQty
        }
      }));
      alert(`Trade Success: Sold ${tradeQty} shares of ${selectedStock} for $${totalCost.toFixed(2)}.`);
    }
  };

  // Run TensorFlow model training simulation
  const trainPredictionModel = () => {
    if (isTraining) return;
    setIsTraining(true);
    setTrainingProgress(0);

    const timer = setInterval(() => {
      setTrainingProgress(prev => {
        if (prev >= 100) {
          clearInterval(timer);
          setIsTraining(false);
          setTrainingLoss(Math.random() * 0.002);
          
          const sPrice = mockWatchlists[selectedStock].price;
          // Calculate simulated fits based on model
          const mFit = selectedModel === 'LSTM' ? 1.04 : (selectedModel === 'Transformer' ? 1.08 : 1.02);
          setForecastPrices({
            '1d': Math.round(sPrice * mFit * 100) / 100,
            '7d': Math.round(sPrice * mFit * 1.03 * 100) / 100,
            '30d': Math.round(sPrice * mFit * 1.07 * 100) / 100,
            direction: mFit > 1.0 ? 'UP' : 'DOWN',
            confidence: `${Math.round(85 + Math.random() * 14)}%`,
            risk: 'Moderate Risk'
          });
          setFitEquation(`y = ${(mFit * 3).toFixed(4)}x + ${(sPrice * 0.1).toFixed(2)}`);
          return 100;
        }
        return prev + 10;
      });
    }, 150);
  };

  // AI Agent message query
  const queryAiAgent = () => {
    if (!agentInput.trim()) return;

    setAgentLogs(prev => [...prev, { sender: 'user', text: agentInput }]);
    setAgentInput('');
    setAgentLoading(true);

    setTimeout(() => {
      const prompt = agentPersonas[selectedAgent].prompt;
      // Extract response section
      const responseText = prompt.split('Response: ')[1] || 'Parsed prompt matches research index. No alerts triggered.';
      
      setAgentLogs(prev => [...prev, { sender: 'ai', text: responseText }]);
      setAgentLoading(false);
    }, 1000);
  };

  // Add symbol to Watchlist
  const addWatchlistSymbol = () => {
    const symbol = searchTicker.toUpperCase().trim();
    if (!symbol || !mockWatchlists[symbol]) {
      alert("Symbol not found in Market Index.");
      return;
    }
    if (watchlist.includes(symbol)) return;
    setWatchlist([...watchlist, symbol]);
    setSearchTicker('');
  };

  // Add dynamic Alert
  const createPriceAlert = () => {
    const newAlert = {
      id: Date.now().toString(),
      symbol: selectedStock,
      trigger: parseFloat(alertPrice),
      type: alertType,
      status: 'ACTIVE'
    };
    setAlerts([...alerts, newAlert]);
    alert(`Alert Created: Ticker ${selectedStock} price triggers when crossing ${alertType} $${alertPrice}`);
  };

  const holdingAssetsValue = Object.entries(portfolio.holdings).reduce((acc, [symbol, qty]) => {
    return acc + (mockWatchlists[symbol]?.price || 0) * qty;
  }, 0);

  const totalPortfolioValue = portfolio.cash + holdingAssetsValue;

  return (
    <div className="flex flex-col gap-6 md:gap-8 animate-fade-in text-brand-text-main">
      
      {/* Live Index Scrolling Ticker */}
      <div className="flex bg-brand-bg-secondary border border-brand-border rounded-xl p-3 items-center overflow-x-auto gap-8 shrink-0">
        <div className="flex items-center gap-1.5 shrink-0 text-xs font-semibold text-brand-text-subtle font-display">
          <Activity className="w-4 h-4 text-brand-primary" />
          <span>INDEX TICKER:</span>
        </div>
        <div className="flex gap-8 overflow-hidden items-center">
          {mockIndices.map((idx, i) => (
            <div key={i} className="flex items-center gap-2 text-xs shrink-0 font-medium">
              <span className="font-bold text-white font-mono">{idx.name}</span>
              <span className="font-mono">${idx.price.toLocaleString()}</span>
              <span className={`flex items-center font-mono font-semibold ${idx.change >= 0 ? 'text-brand-accent-emerald' : 'text-brand-accent-ruby'}`}>
                {idx.change >= 0 ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                {idx.pct.toFixed(2)}%
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Main Tab Router Switcher */}
      <div className="flex border-b border-brand-border pb-1 shrink-0 gap-3">
        {[
          { id: 'overview', name: 'Market Overview' },
          { id: 'predictions', name: 'AI Predictions' },
          { id: 'charts', name: 'Technical Charts' },
          { id: 'quant', name: 'Quant Terminal' },
          { id: 'portfolio', name: 'Portfolio & Risk' },
          { id: 'agents', name: 'AI Financial Agents' }
        ].map(tab => (
          <button 
            key={tab.id}
            onClick={() => { setActiveTab(tab.id); setForecastClose(null); }}
            className={`bg-transparent border-none font-display text-sm font-semibold pb-2.5 cursor-pointer border-b-2 transition-all ${activeTab === tab.id ? 'border-brand-primary text-brand-text-main' : 'border-transparent text-brand-text-muted hover:text-brand-text-main'}`}
            style={{ marginBottom: '-2px' }}
          >
            {tab.name}
          </button>
        ))}
      </div>

      <div className="flex-1 flex flex-col mt-2">

        {/* TAB 1: MARKET OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8">
            
            {/* Watchlist Sidebar */}
            <div className="flex flex-col gap-4">
              <div className="card p-4 bg-brand-bg-secondary border border-brand-border rounded-2xl flex flex-col gap-3">
                <span className="text-xs font-bold text-brand-text-subtle uppercase tracking-wider pl-1">Screener Watchlist</span>
                
                {/* Watchlist search */}
                <div className="search-bar flex items-center bg-brand-bg-tertiary border border-brand-border rounded-xl px-3 py-1.5 gap-2">
                  <Search className="w-3.5 h-3.5 text-brand-text-subtle" />
                  <input 
                    type="text" 
                    placeholder="Enter ticker (e.g. RES)..." 
                    value={searchTicker}
                    onChange={(e) => setSearchTicker(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') addWatchlistSymbol(); }}
                    className="bg-transparent border-none text-[10px] text-white outline-none w-full"
                  />
                </div>

                <div className="flex flex-col gap-2.5 max-h-[280px] overflow-y-auto pr-1">
                  {watchlist.map(sym => (
                    <div 
                      key={sym}
                      onClick={() => { setSelectedStock(sym); setForecastClose(null); }}
                      className={`p-3 border rounded-xl flex justify-between items-center transition-all cursor-pointer ${
                        selectedStock === sym 
                          ? 'bg-brand-primary/20 border-brand-primary/30 font-semibold' 
                          : 'bg-brand-bg-tertiary/40 border-brand-border hover:bg-white/[0.02]'
                      }`}
                    >
                      <div className="flex flex-col">
                        <span className="font-bold text-white font-mono text-xs">{sym}</span>
                        <span className="text-[9px] text-brand-text-subtle mt-0.5">{mockWatchlists[sym].name}</span>
                      </div>
                      <div className="text-right">
                        <span className="font-bold font-mono text-white text-xs">${mockWatchlists[sym].price.toFixed(2)}</span>
                        <span className={`block text-[9px] font-mono mt-0.5 ${mockWatchlists[sym].change >= 0 ? 'text-brand-accent-emerald' : 'text-brand-accent-ruby'}`}>
                          {mockWatchlists[sym].change >= 0 ? '+' : ''}{mockWatchlists[sym].change.toFixed(2)}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Overview dashboard panels */}
            <div className="flex flex-col gap-6">
              
              {/* index grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {mockIndices.slice(0, 3).map((idx, i) => (
                  <div key={i} className="card p-5 bg-brand-bg-secondary border border-brand-border rounded-2xl flex justify-between items-center">
                    <div className="flex flex-col">
                      <span className="text-[10px] text-brand-text-subtle font-bold uppercase tracking-wider">{idx.name}</span>
                      <span className="text-xl font-bold font-mono text-white mt-1.5">${idx.price.toLocaleString()}</span>
                      <span className="text-[9px] text-brand-text-muted mt-1.5 font-medium">Sentiment: <strong className="text-brand-accent-emerald">{idx.sentiment}</strong></span>
                    </div>
                    <div className={`p-3 rounded-xl ${idx.change >= 0 ? 'bg-brand-accent-emerald/10 text-brand-accent-emerald' : 'bg-brand-accent-ruby/10 text-brand-accent-ruby'}`}>
                      {idx.change >= 0 ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
                    </div>
                  </div>
                ))}
              </div>

              {/* Screener list table */}
              <div className="card p-6 bg-brand-bg-secondary border border-brand-border rounded-2xl flex flex-col gap-4">
                <span className="font-display text-sm font-bold text-white">Interactive Index Market Screener</span>
                <div className="table-container rounded-xl border border-brand-border overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-brand-border bg-brand-bg-primary/40 text-brand-text-subtle font-semibold uppercase">
                        <th className="p-3">Asset Symbol</th>
                        <th className="p-3">Description</th>
                        <th className="p-3">Close Price</th>
                        <th className="p-3">Change %</th>
                        <th className="p-3">24h Volume</th>
                        <th className="p-3">Cap Value</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.entries(mockWatchlists).map(([symbol, doc]) => (
                        <tr 
                          key={symbol} 
                          className="border-b border-brand-border hover:bg-white/[0.01] transition-colors cursor-pointer text-brand-text-main"
                          onClick={() => { setSelectedStock(symbol); setForecastClose(null); }}
                        >
                          <td className="p-3"><code>{symbol}</code></td>
                          <td className="p-3 font-semibold">{doc.name}</td>
                          <td className="p-3 font-mono">${doc.price}</td>
                          <td className={`p-3 font-semibold ${doc.change >= 0 ? 'text-brand-accent-emerald' : 'text-brand-accent-ruby'}`}>{doc.change}%</td>
                          <td className="p-3 font-mono">{doc.volume}</td>
                          <td className="p-3 font-mono text-brand-text-muted">{doc.cap}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>

          </div>
        )}

        {/* TAB 2: AI PREDICTIONS (TensorFlow neural models) */}
        {activeTab === 'predictions' && (
          <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-8">
            
            {/* Training control panel */}
            <div className="card p-5 bg-brand-bg-secondary border border-brand-border rounded-2xl flex flex-col gap-4">
              <div className="flex items-center gap-1.5 border-b border-brand-border pb-3">
                <Sparkles className="w-4 h-4 text-brand-accent-amber animate-pulse" />
                <span className="font-display text-xs font-bold text-white uppercase tracking-wider">AI Predictive Models</span>
              </div>

              <div className="flex flex-col gap-4 text-xs">
                
                {/* Model selector */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-brand-text-subtle uppercase tracking-wider pl-1">Network Architecture</label>
                  <select 
                    value={selectedModel}
                    onChange={(e) => { setSelectedModel(e.target.value); setForecastClose(null); }}
                    className="w-full bg-brand-bg-tertiary border border-brand-border text-xs text-white p-2.5 rounded-xl outline-none"
                  >
                    <option value="LSTM">Long Short-Term Memory (LSTM)</option>
                    <option value="GRU">Gated Recurrent Unit (GRU)</option>
                    <option value="Transformer">Attention Transformer Networks</option>
                  </select>
                </div>

                {/* LR */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-brand-text-subtle uppercase tracking-wider pl-1">Learning Rate</label>
                  <select 
                    value={lr}
                    onChange={(e) => setLr(parseFloat(e.target.value))}
                    className="w-full bg-brand-bg-tertiary border border-brand-border text-xs text-white p-2.5 rounded-xl outline-none"
                  >
                    <option value="0.01">0.01 (Slow & Stable)</option>
                    <option value="0.05">0.05 (Default)</option>
                    <option value="0.1">0.10 (Fast)</option>
                  </select>
                </div>

                {/* Epochs */}
                <div className="flex flex-col gap-1.5">
                  <div className="flex justify-between text-[10px] text-brand-text-subtle font-bold uppercase tracking-wider pl-1">
                    <span>Fitting Epochs</span>
                    <span className="text-white font-mono">{epochs}</span>
                  </div>
                  <input 
                    type="range"
                    min="50"
                    max="200"
                    step="50"
                    value={epochs}
                    onChange={(e) => setEpochs(parseInt(e.target.value))}
                    className="w-full accent-brand-accent-amber"
                  />
                </div>

                <button
                  onClick={trainPredictionModel}
                  disabled={isTraining}
                  className="btn btn-primary w-full justify-center flex items-center gap-2 cursor-pointer py-3 font-bold rounded-xl"
                  style={{ backgroundColor: 'var(--color-brand-accent-amber)', color: '#000000', boxShadow: '0 4px 6px rgba(245, 158, 11, 0.2)' }}
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isTraining ? 'animate-spin' : ''}`} />
                  {isTraining ? 'Fitting Tensors...' : 'Fit AI Projections'}
                </button>

                {isTraining && (
                  <div className="bg-brand-bg-tertiary p-3 rounded-xl border border-brand-border mt-2">
                    <div className="flex justify-between text-[10px] text-brand-text-subtle font-bold mb-1.5">
                      <span>Neural Fitting State...</span>
                      <span className="font-mono">{trainingProgress}%</span>
                    </div>
                    <div className="bg-brand-bg-primary h-1.5 rounded-full overflow-hidden w-full">
                      <div className="bg-brand-accent-amber h-full transition-all" style={{ width: `${trainingProgress}%` }}></div>
                    </div>
                  </div>
                )}
                
                {trainingLoss && (
                  <div className="bg-brand-bg-tertiary/60 p-3 rounded-xl border border-brand-border flex flex-col gap-1 text-[11px] text-brand-text-muted">
                    <div>Final Loss: <span className="font-mono text-brand-accent-emerald">{trainingLoss.toFixed(6)}</span></div>
                    <div>Model Fit Matrix: <code className="text-brand-accent-amber font-mono">{fitEquation}</code></div>
                  </div>
                )}

              </div>
            </div>

            {/* Forecast values and statistics */}
            <div className="flex flex-col gap-6 text-xs">
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="card p-5 bg-brand-bg-secondary border border-brand-border rounded-2xl flex flex-col">
                  <span className="text-[10px] text-brand-text-subtle font-bold uppercase tracking-wider">Next Day Prediction</span>
                  <span className="text-2xl font-bold font-mono text-white mt-1.5">${forecastPrices['1d'].toFixed(2)}</span>
                  <span className="text-[9px] text-brand-accent-emerald mt-1.5 font-semibold">Direction: {forecastPrices.direction}</span>
                </div>
                <div className="card p-5 bg-brand-bg-secondary border border-brand-border rounded-2xl flex flex-col">
                  <span className="text-[10px] text-brand-text-subtle font-bold uppercase tracking-wider">7 Day Trend Target</span>
                  <span className="text-2xl font-bold font-mono text-white mt-1.5">${forecastPrices['7d'].toFixed(2)}</span>
                  <span className="text-[9px] text-brand-accent-cyan mt-1.5 font-semibold">Confidence: {forecastPrices.confidence}</span>
                </div>
                <div className="card p-5 bg-brand-bg-secondary border border-brand-border rounded-2xl flex flex-col">
                  <span className="text-[10px] text-brand-text-subtle font-bold uppercase tracking-wider">30 Day Trend Target</span>
                  <span className="text-2xl font-bold font-mono text-white mt-1.5">${forecastPrices['30d'].toFixed(2)}</span>
                  <span className="text-[9px] text-brand-accent-amber mt-1.5 font-semibold">Risk: {forecastPrices.risk}</span>
                </div>
              </div>

              {/* Prediction History Table */}
              <div className="card p-6 bg-brand-bg-secondary border border-brand-border rounded-2xl flex flex-col gap-4">
                <span className="font-display text-sm font-bold text-white">Neural Network Forecast Validation History</span>
                <div className="table-container rounded-xl border border-brand-border overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-brand-border bg-brand-bg-primary/40 text-brand-text-subtle font-semibold uppercase">
                        <th className="p-3">Model Version</th>
                        <th className="p-3">Fitted Target</th>
                        <th className="p-3">Historical Price</th>
                        <th className="p-3">Mean Squared Error</th>
                        <th className="p-3">Confidence Ratio</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-brand-border text-brand-text-main">
                        <td className="p-3"><code>LSTM_v2.1</code></td>
                        <td className="p-3 font-mono">${(mockWatchlists[selectedStock].price * 0.98).toFixed(2)}</td>
                        <td className="p-3 font-mono">${mockWatchlists[selectedStock].price.toFixed(2)}</td>
                        <td className="p-3 text-brand-accent-emerald font-mono">0.000142</td>
                        <td className="p-3 font-semibold text-brand-accent-emerald">96.8%</td>
                      </tr>
                      <tr className="border-b border-brand-border text-brand-text-main">
                        <td className="p-3"><code>GRU_v1.8</code></td>
                        <td className="p-3 font-mono">${(mockWatchlists[selectedStock].price * 1.03).toFixed(2)}</td>
                        <td className="p-3 font-mono">${mockWatchlists[selectedStock].price.toFixed(2)}</td>
                        <td className="p-3 text-brand-accent-amber font-mono">0.000840</td>
                        <td className="p-3 font-semibold text-brand-accent-cyan">91.4%</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

            </div>

          </div>
        )}

        {/* TAB 3: TECHNICAL CHARTS */}
        {activeTab === 'charts' && (
          <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8">
            
            {/* Indicators checklist */}
            <div className="card p-4 bg-brand-bg-secondary border border-brand-border rounded-2xl flex flex-col gap-4">
              <span className="text-xs font-bold text-brand-text-subtle uppercase tracking-wider pl-1">Technical Indicators</span>
              
              <div className="flex flex-col gap-3 text-xs text-brand-text-main">
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={showSMA}
                    onChange={(e) => setShowSMA(e.target.checked)}
                    className="accent-brand-primary"
                  />
                  <span>SMA (Simple Moving Avg)</span>
                </label>
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={showEMA}
                    onChange={(e) => setShowEMA(e.target.checked)}
                    className="accent-brand-primary"
                  />
                  <span>EMA (Exponential Avg)</span>
                </label>
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={showBollinger}
                    onChange={(e) => setShowBollinger(e.target.checked)}
                    className="accent-brand-primary"
                  />
                  <span>Bollinger Bands (20, 2)</span>
                </label>
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={showVWAP}
                    onChange={(e) => setShowVWAP(e.target.checked)}
                    className="accent-brand-primary"
                  />
                  <span>VWAP (Volume Weighted Avg)</span>
                </label>
              </div>
            </div>

            {/* Interactive chart canvas */}
            <div className="card p-6 bg-brand-bg-secondary border border-brand-border rounded-2xl flex flex-col gap-4">
              <div className="flex justify-between items-center border-b border-brand-border/40 pb-3">
                <span className="font-display text-sm font-bold text-white">{selectedStock} Candlestick Graph Terminal</span>
                <span className="text-xs font-bold text-brand-accent-emerald font-mono">${mockWatchlists[selectedStock].price.toFixed(2)}</span>
              </div>

              {/* Canvas Chart viewport */}
              <div className="h-[280px] w-full relative flex items-center justify-center bg-brand-bg-primary/20 rounded-xl overflow-hidden border border-brand-border/40">
                <canvas ref={canvasRef} className="w-full h-full block" />
              </div>
            </div>

          </div>
        )}

        {/* TAB 4: QUANT RESEARCH TERMINAL */}
        {activeTab === 'quant' && (
          <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8">
            
            {/* Create Price Alerts */}
            <div className="card p-5 bg-brand-bg-secondary border border-brand-border rounded-2xl flex flex-col gap-4">
              <span className="text-xs font-bold text-brand-text-subtle uppercase tracking-wider pl-1">Create Price Alert</span>
              
              <div className="flex flex-col gap-3 text-xs">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] text-brand-text-subtle font-bold">Trigger Target Price ($)</label>
                  <input 
                    type="number"
                    value={alertPrice}
                    onChange={(e) => setAlertPrice(parseFloat(e.target.value))}
                    className="bg-brand-bg-tertiary border border-brand-border text-xs text-white p-2 rounded-xl outline-none"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] text-brand-text-subtle font-bold">Crossing Criteria</label>
                  <select 
                    value={alertType}
                    onChange={(e) => setAlertType(e.target.value)}
                    className="bg-brand-bg-tertiary border border-brand-border text-xs text-white p-2 rounded-xl outline-none cursor-pointer"
                  >
                    <option value="ABOVE">Above</option>
                    <option value="BELOW">Below</option>
                  </select>
                </div>
                <button 
                  onClick={createPriceAlert}
                  className="btn btn-primary py-2.5 rounded-xl font-bold cursor-pointer text-xs"
                >
                  Save Alert Node
                </button>
              </div>
            </div>

            {/* Quantitative Screener and logs */}
            <div className="flex flex-col gap-6 text-xs">
              
              {/* Active alerts panel */}
              <div className="card p-6 bg-brand-bg-secondary border border-brand-border rounded-2xl flex flex-col gap-4">
                <span className="font-display text-sm font-bold text-white">Active Alert Triggers</span>
                <div className="flex flex-col gap-3 max-h-[160px] overflow-y-auto pr-1">
                  {alerts.map(al => (
                    <div key={al.id} className="p-3 border border-brand-border rounded-xl bg-brand-bg-tertiary/60 flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <Bell className="w-4 h-4 text-brand-accent-amber" />
                        <span className="font-semibold text-white">{al.symbol} triggers when {al.type.toLowerCase()} ${al.trigger}</span>
                      </div>
                      <span className="badge bg-brand-accent-emerald/15 text-brand-accent-emerald text-[9px] font-bold px-2 py-0.5 rounded-full">{al.status}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Research Reports generator */}
              <div className="card p-6 bg-brand-bg-secondary border border-brand-border rounded-2xl flex flex-col gap-4">
                <span className="font-display text-sm font-bold text-white">Research Notes & Market Reports</span>
                <div className="p-4 bg-brand-bg-tertiary/60 border border-brand-border rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FileText className="w-8 h-8 text-brand-accent-cyan" />
                    <div className="flex flex-col">
                      <span className="text-xs font-semibold text-white">Q2_Market_Regime_Projections.pdf</span>
                      <span className="text-[10px] text-brand-text-subtle">Aggregates pricing vectors, factor indexes, and alerts.</span>
                    </div>
                  </div>
                  <button 
                    onClick={() => alert("Report compiled successfully and queued for local storage download.")}
                    className="p-2.5 bg-brand-primary text-white rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Compile Report
                  </button>
                </div>
              </div>

            </div>

          </div>
        )}

        {/* TAB 5: PORTFOLIO & RISK */}
        {activeTab === 'portfolio' && (
          <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-8">
            
            {/* Trade Order desk */}
            <div className="card p-5 bg-brand-bg-secondary border border-brand-border rounded-2xl flex flex-col gap-4">
              <span className="text-xs font-bold text-brand-text-subtle uppercase tracking-wider pl-1">Order Execution Desk</span>

              <div className="flex border border-brand-border rounded-xl overflow-hidden shrink-0 text-xs">
                <button 
                  onClick={() => setTradeType('BUY')}
                  className={`flex-1 py-2 font-bold cursor-pointer transition-all ${tradeType === 'BUY' ? 'bg-brand-accent-emerald text-white' : 'bg-brand-bg-tertiary text-brand-text-muted'}`}
                >
                  BUY
                </button>
                <button 
                  onClick={() => setTradeType('SELL')}
                  className={`flex-1 py-2 font-bold cursor-pointer transition-all ${tradeType === 'SELL' ? 'bg-brand-accent-ruby text-white' : 'bg-brand-bg-tertiary text-brand-text-muted'}`}
                >
                  SELL
                </button>
              </div>

              <div className="flex flex-col gap-3 text-xs">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] text-brand-text-subtle font-bold">Shares Count</label>
                  <input 
                    type="number"
                    min="1"
                    value={tradeQty}
                    onChange={(e) => setTradeQty(parseInt(e.target.value) || 1)}
                    className="bg-brand-bg-tertiary border border-brand-border text-xs text-white p-2.5 rounded-xl outline-none"
                  />
                </div>

                <div className="p-3 bg-brand-bg-tertiary border border-brand-border rounded-xl flex flex-col gap-1.5 text-[11px] text-brand-text-muted">
                  <div className="flex justify-between">
                    <span>Target Symbol:</span>
                    <strong className="text-white font-mono">{selectedStock}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Unit Price:</span>
                    <strong className="text-white font-mono">${mockWatchlists[selectedStock].price.toFixed(2)}</strong>
                  </div>
                  <div className="flex justify-between border-t border-brand-border/40 pt-1.5 mt-1 font-bold">
                    <span>Estimated Cost:</span>
                    <strong className="text-white font-mono">${(mockWatchlists[selectedStock].price * tradeQty).toFixed(2)}</strong>
                  </div>
                </div>

                <button 
                  onClick={handleExecuteTrade}
                  className={`w-full py-3 rounded-xl font-bold text-white cursor-pointer shadow-md transition-all ${
                    tradeType === 'BUY' ? 'bg-brand-accent-emerald hover:opacity-90' : 'bg-brand-accent-ruby hover:opacity-90'
                  }`}
                >
                  Submit Trade Order
                </button>
              </div>
            </div>

            {/* Risk analytics & asset holdings */}
            <div className="flex flex-col gap-6 text-xs">
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="p-4 bg-brand-bg-secondary border border-brand-border rounded-xl flex flex-col">
                  <span className="text-[9px] text-brand-text-subtle font-bold uppercase">Sharpe Ratio</span>
                  <span className="text-base font-bold font-mono text-brand-accent-emerald mt-1">2.41</span>
                </div>
                <div className="p-4 bg-brand-bg-secondary border border-brand-border rounded-xl flex flex-col">
                  <span className="text-[9px] text-brand-text-subtle font-bold uppercase">Sortino Ratio</span>
                  <span className="text-base font-bold font-mono text-brand-accent-emerald mt-1">3.12</span>
                </div>
                <div className="p-4 bg-brand-bg-secondary border border-brand-border rounded-xl flex flex-col">
                  <span className="text-[9px] text-brand-text-subtle font-bold uppercase">Max Drawdown</span>
                  <span className="text-base font-bold font-mono text-brand-accent-ruby mt-1">-6.4%</span>
                </div>
                <div className="p-4 bg-brand-bg-secondary border border-brand-border rounded-xl flex flex-col">
                  <span className="text-[9px] text-brand-text-subtle font-bold uppercase">Value at Risk (5d)</span>
                  <span className="text-base font-bold font-mono text-white mt-1">$420</span>
                </div>
              </div>

              {/* Holdings overview panel */}
              <div className="card p-6 bg-brand-bg-secondary border border-brand-border rounded-2xl flex flex-col gap-4">
                <span className="font-display text-sm font-bold text-white">Active Asset Allocation & Holdings</span>
                <div className="flex justify-between text-xs text-brand-text-muted mb-2 border-b border-brand-border pb-3">
                  <div>Cash Balance: <strong className="text-white font-mono">${portfolio.cash.toLocaleString(undefined, { minimumFractionDigits: 2 })}</strong></div>
                  <div>Total Value: <strong className="text-brand-accent-emerald font-mono">${totalPortfolioValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}</strong></div>
                </div>

                <div className="flex flex-col gap-2 max-h-[180px] overflow-y-auto pr-1">
                  {Object.entries(portfolio.holdings).map(([sym, qty]) => {
                    if (qty <= 0) return null;
                    const stockPrice = mockWatchlists[sym].price;
                    return (
                      <div key={sym} className="p-3 border border-brand-border rounded-xl bg-brand-bg-tertiary/60 flex justify-between items-center">
                        <div className="flex items-center gap-3">
                          <code className="text-brand-primary">{sym}</code>
                          <div className="flex flex-col">
                            <span className="font-semibold text-white">{mockWatchlists[sym].name}</span>
                            <span className="text-[10px] text-brand-text-subtle mt-0.5">{qty} shares held</span>
                          </div>
                        </div>
                        <span className="font-bold font-mono text-white">${(stockPrice * qty).toFixed(2)}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>

          </div>
        )}

        {/* TAB 6: AI FINANCIAL AGENTS */}
        {activeTab === 'agents' && (
          <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8">
            
            {/* Agents list select */}
            <div className="card p-4 bg-brand-bg-secondary border border-brand-border rounded-2xl flex flex-col gap-3">
              <span className="text-xs font-bold text-brand-text-subtle uppercase tracking-wider pl-1">Financial Agent Nodes</span>
              
              <div className="flex flex-col gap-2 max-h-[360px] overflow-y-auto pr-1">
                {Object.entries(agentPersonas).map(([id, info]) => (
                  <div 
                    key={id}
                    onClick={() => setSelectedAgent(id)}
                    className={`p-2.5 border rounded-xl flex items-center gap-3 cursor-pointer transition-all ${
                      selectedAgent === id 
                        ? 'bg-brand-primary/20 border-brand-primary/30' 
                        : 'bg-brand-bg-tertiary/40 border-brand-border hover:bg-white/[0.01]'
                    }`}
                  >
                    <img src={info.avatar} alt="" className="w-8 h-8 rounded-full object-cover border border-brand-border" />
                    <div className="flex flex-col min-w-0">
                      <span className="text-xs font-bold text-white truncate">{info.name}</span>
                      <span className="text-[8px] text-brand-text-subtle truncate mt-0.5">{info.role}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Agent Chat screen */}
            <div className="card bg-brand-bg-secondary border border-brand-border rounded-2xl flex flex-col h-[420px] relative overflow-hidden text-xs">
              
              {/* Header */}
              <div className="p-4 border-b border-brand-border bg-brand-bg-tertiary/40 flex items-center gap-3">
                <img src={agentPersonas[selectedAgent].avatar} alt="" className="w-9 h-9 rounded-full object-cover border border-brand-border" />
                <div className="flex flex-col">
                  <h4 className="font-bold text-white text-xs">{agentPersonas[selectedAgent].name}</h4>
                  <span className="text-[10px] text-brand-text-subtle">{agentPersonas[selectedAgent].role}</span>
                </div>
              </div>

              {/* Logs */}
              <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3.5">
                {agentLogs.map((log, i) => (
                  <div key={i} className={`flex ${log.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div 
                      className={`max-w-[85%] rounded-2xl p-3 text-xs leading-relaxed ${
                        log.sender === 'user' 
                          ? 'bg-brand-primary text-white rounded-br-none shadow-md font-medium' 
                          : 'bg-brand-bg-tertiary border border-brand-border text-brand-text-main rounded-bl-none shadow-sm'
                      }`}
                    >
                      {log.text.split('\n').map((line, idx) => (
                        <p key={idx} className={idx > 0 ? 'mt-1' : ''}>{line}</p>
                      ))}
                    </div>
                  </div>
                ))}
                {agentLoading && (
                  <div className="flex justify-start">
                    <div className="bg-brand-bg-tertiary border border-brand-border rounded-2xl rounded-bl-none p-3 text-xs flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 bg-brand-primary rounded-full animate-bounce"></span>
                      <span className="w-1.5 h-1.5 bg-brand-primary rounded-full animate-bounce [animation-delay:0.2s]"></span>
                      <span className="w-1.5 h-1.5 bg-brand-primary rounded-full animate-bounce [animation-delay:0.4s]"></span>
                    </div>
                  </div>
                )}
              </div>

              {/* Chat Input */}
              <div className="p-3 border-t border-brand-border bg-brand-bg-tertiary/20 flex gap-2 items-center">
                <input 
                  type="text" 
                  placeholder="Ask agent technical questions..."
                  value={agentInput}
                  onChange={(e) => setAgentInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') queryAiAgent(); }}
                  className="flex-1 bg-brand-bg-tertiary border border-brand-border rounded-xl text-xs text-brand-text-main placeholder-brand-text-subtle p-2.5 outline-none focus:border-brand-primary/40"
                />
                <button 
                  onClick={queryAiAgent}
                  className="p-2.5 bg-brand-primary text-white rounded-xl shadow-md cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>

          </div>
        )}

      </div>

    </div>
  );
}
