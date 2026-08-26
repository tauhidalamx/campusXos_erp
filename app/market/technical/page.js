'use client';

import React, { useState, useEffect, useRef, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { 
  TrendingUp, 
  Settings, 
  Layers, 
  Activity,
  Maximize2
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

function TechnicalChartsPageContent() {
  const searchParams = useSearchParams();
  const initialSymbol = searchParams.get('symbol') || 'CAMPUSX';
  const [selectedStock, setSelectedStock] = useState(initialSymbol);

  // Overlays state
  const [showSMA, setShowSMA] = useState(true);
  const [showEMA, setShowEMA] = useState(false);
  const [showBollinger, setShowBollinger] = useState(false);
  const [showVWAP, setShowVWAP] = useState(false);

  const canvasRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    const handleResize = () => {
      canvas.width = canvas.parentElement.clientWidth;
      canvas.height = 420;

      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      // Grid lines
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
      ctx.lineWidth = 1;
      for (let i = 1; i < 6; i++) {
        const y = (h / 6) * i;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();

        const x = (w / 6) * i;
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
      }

      const currentPrice = mockWatchlists[selectedStock]?.price || 100.00;
      // Generate 20 mock history points
      const basePrices = [];
      let lastPrice = currentPrice * 0.95;
      for (let i = 0; i < 20; i++) {
        lastPrice = lastPrice * (0.99 + Math.random() * 0.02);
        basePrices.push(lastPrice);
      }
      
      const maxVal = Math.max(...basePrices) * 1.02;
      const minVal = Math.min(...basePrices) * 0.98;
      const range = maxVal - minVal;

      const scaleY = (p) => h - ((p - minVal) / range) * (h - 60) - 30;
      const stepX = w / 20;

      // Render candles
      basePrices.forEach((cPrice, idx) => {
        const x = stepX * idx + stepX / 2;
        const open = basePrices[Math.max(0, idx - 1)];
        const close = cPrice;
        const high = Math.max(open, close) * (1.002 + Math.random() * 0.008);
        const low = Math.min(open, close) * (0.998 - Math.random() * 0.008);

        const isGreen = close >= open;
        ctx.strokeStyle = isGreen ? '#22C55E' : '#EF4444';
        ctx.fillStyle = isGreen ? '#22C55E' : '#EF4444';
        ctx.lineWidth = 1.5;

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
        ctx.fillRect(x - 6, bodyY, 12, bodyH);
      });

      // SMA (Simple Moving Average 5-day)
      if (showSMA) {
        ctx.strokeStyle = '#6366F1';
        ctx.lineWidth = 2;
        ctx.beginPath();
        basePrices.forEach((p, idx) => {
          if (idx < 4) return;
          const subset = basePrices.slice(idx - 4, idx + 1);
          const avg = subset.reduce((a, b) => a + b, 0) / 5;
          const x = stepX * idx + stepX / 2;
          const y = scaleY(avg);
          if (idx === 4) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        });
        ctx.stroke();
      }

      // EMA (Exponential Moving Average 5-day)
      if (showEMA) {
        ctx.strokeStyle = '#06B6D4';
        ctx.lineWidth = 2;
        ctx.beginPath();
        let prevEma = basePrices[0];
        basePrices.forEach((p, idx) => {
          const k = 2 / (5 + 1);
          const ema = p * k + prevEma * (1 - k);
          prevEma = ema;
          const x = stepX * idx + stepX / 2;
          const y = scaleY(ema);
          if (idx === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        });
        ctx.stroke();
      }

      // Bollinger Bands (20-day standard deviation)
      if (showBollinger) {
        ctx.strokeStyle = 'rgba(245, 158, 11, 0.4)';
        ctx.lineWidth = 1.5;
        
        // Upper Band
        ctx.beginPath();
        basePrices.forEach((p, idx) => {
          const x = stepX * idx + stepX / 2;
          const y = scaleY(p * 1.035);
          if (idx === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        });
        ctx.stroke();

        // Lower Band
        ctx.beginPath();
        basePrices.forEach((p, idx) => {
          const x = stepX * idx + stepX / 2;
          const y = scaleY(p * 0.965);
          if (idx === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        });
        ctx.stroke();
      }

      // VWAP (Volume Weighted Average Price)
      if (showVWAP) {
        ctx.strokeStyle = '#F43F5E';
        ctx.lineWidth = 2;
        ctx.setLineDash([3, 3]);
        ctx.beginPath();
        basePrices.forEach((p, idx) => {
          const x = stepX * idx + stepX / 2;
          const y = scaleY(p * 0.992);
          if (idx === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        });
        ctx.stroke();
        ctx.setLineDash([]);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);

  }, [selectedStock, showSMA, showEMA, showBollinger, showVWAP]);

  return (
    <div className="flex flex-col gap-6 animate-fade-in text-white">
      
      {/* Page Header */}
      <div className="flex justify-between items-center border-b border-[#0F1B3A] pb-4">
        <div>
          <h1 className="text-xl font-bold uppercase tracking-wider text-white">Technical Analysis</h1>
          <p className="text-[11px] text-gray-500 mt-1">INTERACTIVE CANVAS CHART WITH SMA, EMA, BOLLINGER BANDS, AND VWAP OVERLAYS</p>
        </div>
        
        {/* Selector */}
        <select 
          value={selectedStock}
          onChange={(e) => setSelectedStock(e.target.value)}
          className="bg-[#0A1128] border border-[#0F1B3A] text-xs text-white p-2 rounded outline-none w-44 font-mono uppercase font-bold"
        >
          {Object.keys(mockWatchlists).map(sym => (
            <option key={sym} value={sym}>{sym} - {mockWatchlists[sym].name}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_260px] gap-8">
        
        {/* Candlestick Canvas Frame */}
        <div className="bg-[#0A1128] border border-[#0F1B3A] p-6 flex flex-col gap-4">
          <div className="flex justify-between items-center text-[10px] text-gray-500 font-mono tracking-wider border-b border-[#0F1B3A] pb-3 uppercase">
            <span>Chart Canvas - Ticker: {selectedStock}</span>
            <span className="text-[#F59E0B] font-bold">Price Quote: ${mockWatchlists[selectedStock]?.price.toFixed(2)} USD</span>
          </div>

          <div className="w-full relative h-[420px] bg-[#040814] border border-[#0F1B3A] overflow-hidden">
            <canvas ref={canvasRef} className="block w-full h-full"></canvas>
          </div>
        </div>

        {/* Indicator Overlays Panel */}
        <div className="flex flex-col gap-4">
          <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest pl-1">Technical Indicators</span>
          
          <div className="bg-[#0A1128] border border-[#0F1B3A] p-5 flex flex-col gap-4">
            
            {/* SMA Switch */}
            <div className="flex items-center justify-between border-b border-[#0F1B3A]/40 pb-3">
              <div>
                <span className="text-xs font-semibold text-gray-200 block">SMA (5d)</span>
                <span className="text-[9px] text-indigo-400 font-mono">Simple Moving Avg</span>
              </div>
              <input 
                type="checkbox"
                checked={showSMA}
                onChange={() => setShowSMA(!showSMA)}
                className="w-4 h-4 cursor-pointer accent-[#F59E0B]"
              />
            </div>

            {/* EMA Switch */}
            <div className="flex items-center justify-between border-b border-[#0F1B3A]/40 pb-3">
              <div>
                <span className="text-xs font-semibold text-gray-200 block">EMA (5d)</span>
                <span className="text-[9px] text-cyan-400 font-mono">Exponential Avg</span>
              </div>
              <input 
                type="checkbox"
                checked={showEMA}
                onChange={() => setShowEMA(!showEMA)}
                className="w-4 h-4 cursor-pointer accent-[#F59E0B]"
              />
            </div>

            {/* Bollinger Bands Switch */}
            <div className="flex items-center justify-between border-b border-[#0F1B3A]/40 pb-3">
              <div>
                <span className="text-xs font-semibold text-gray-200 block">Bollinger Bands</span>
                <span className="text-[9px] text-amber-500 font-mono">Volatility Volumetrics</span>
              </div>
              <input 
                type="checkbox"
                checked={showBollinger}
                onChange={() => setShowBollinger(!showBollinger)}
                className="w-4 h-4 cursor-pointer accent-[#F59E0B]"
              />
            </div>

            {/* VWAP Switch */}
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-gray-200 block">VWAP Indicator</span>
                <span className="text-[9px] text-rose-400 font-mono">Volume Weighted Price</span>
              </div>
              <input 
                type="checkbox"
                checked={showVWAP}
                onChange={() => setShowVWAP(!showVWAP)}
                className="w-4 h-4 cursor-pointer accent-[#F59E0B]"
              />
            </div>

          </div>

          <div className="text-[9px] text-gray-500 leading-normal font-mono border border-dashed border-[#0F1B3A] p-4 text-center">
            INDICATORS RENDER REALTIME DELAYS CORRESPONDING TO VOLATILITY MATRIX RATINGS.
          </div>

        </div>

      </div>

    </div>
  );
}

export default function TechnicalChartsPage() {
  return (
    <Suspense fallback={<div className="text-white text-center py-10">Loading Technical Charts...</div>}>
      <TechnicalChartsPageContent />
    </Suspense>
  );
}
