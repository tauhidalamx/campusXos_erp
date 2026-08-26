'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Building2, 
  Thermometer, 
  MapPin, 
  Navigation, 
  Cpu, 
  Activity, 
  ArrowLeft, 
  Compass, 
  Zap, 
  TrendingDown, 
  TrendingUp,
  RotateCw
} from 'lucide-react';

export default function TwinPage() {
  // Building Twin States
  const [buildings, setBuildings] = useState([
    { id: 'b1', name: 'Advanced AI Lab Block', rooms: 12, occupancy: 82, hvacTemp: 22.5, consumption: 48 },
    { id: 'b2', name: 'Main Library Dome', rooms: 24, occupancy: 58, hvacTemp: 21.0, consumption: 92 },
    { id: 'b3', name: 'Consortium Data Center', rooms: 8, occupancy: 12, hvacTemp: 18.0, consumption: 145 },
    { id: 'b4', name: 'Student Residential Quad', rooms: 120, occupancy: 94, hvacTemp: 23.0, consumption: 74 }
  ]);

  const [activeBuildingId, setActiveBuildingId] = useState('b1');

  // Shuttle Fleet Tracker
  const [shuttles, setShuttles] = useState([
    { id: 'sh_1', name: 'Shuttle Alpha', speed: 22, nextStop: 'Science Center', coords: '42.3601° N, 71.0589° W', status: 'Transit' },
    { id: 'sh_2', name: 'Shuttle Beta', speed: 0, nextStop: 'Residential Quad', coords: '42.3615° N, 71.0601° W', status: 'Stationary' }
  ]);

  // Live Metrics (simulation)
  const [gridLoad, setGridLoad] = useState(359);
  const [solarGeneration, setSolarGeneration] = useState(45);

  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate energy load fluctuation
      setGridLoad(prev => Math.round(prev + (Math.random() * 8 - 4)));
      setSolarGeneration(prev => Math.round(Math.max(30, Math.min(80, prev + (Math.random() * 4 - 2)))));

      // Simulate shuttle movements
      setShuttles(prev => prev.map(sh => {
        if (sh.status === 'Transit') {
          const lat = 42.3601 + (Math.random() * 0.002 - 0.001);
          const lng = -71.0589 + (Math.random() * 0.002 - 0.001);
          return {
            ...sh,
            speed: Math.round(15 + Math.random() * 10),
            coords: `${lat.toFixed(4)}° N, ${lng.toFixed(4)}° W`
          };
        }
        return sh;
      }));
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const handleTempChange = (buildingId, val) => {
    setBuildings(prev => prev.map(b => b.id === buildingId ? { ...b, hvacTemp: parseFloat(val) } : b));
  };

  const activeBuilding = buildings.find(b => b.id === activeBuildingId);

  return (
    <div className="min-h-screen bg-[#071126] text-white p-6 font-sans">
      {/* Top Banner Navigation */}
      <div className="max-w-7xl mx-auto flex items-center justify-between mb-8 pb-4 border-b border-[#102043]">
        <div className="flex items-center gap-3">
          <Link href="/" className="p-2 bg-[#102043] rounded-xl hover:bg-[#1a2e5d] transition-all text-indigo-400">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-white via-indigo-200 to-indigo-400 bg-clip-text text-transparent">
              CAMPUSX Digital Campus Twin
            </h1>
            <p className="text-xs text-slate-400">Real-Time HVAC Telemetry & Transit Fleet Tracker</p>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs font-mono">
          <div className="flex items-center gap-1.5 text-slate-400">
            <Zap className="w-4 h-4 text-indigo-400 animate-pulse" /> Grid: <span className="font-bold text-white">{gridLoad} kW</span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-400">
            <Zap className="w-4 h-4 text-emerald-400" /> Solar: <span className="font-bold text-white">{solarGeneration} kW</span>
          </div>
        </div>
      </div>

      {/* Main Grid Workdesk */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column - Building list schematics */}
        <div className="flex flex-col gap-6 text-left">
          <div className="p-6 bg-[#0B1736] border border-[#102043] rounded-3xl flex flex-col gap-4">
            <span className="text-xs font-bold text-white uppercase tracking-wider font-mono">Simulated Building Nodes</span>
            <div className="flex flex-col gap-3">
              {buildings.map((b) => (
                <button
                  key={b.id}
                  onClick={() => setActiveBuildingId(b.id)}
                  className={`w-full p-4 border rounded-2xl flex items-center justify-between cursor-pointer transition-all ${
                    activeBuildingId === b.id 
                      ? 'bg-indigo-600/20 border-indigo-400/50 text-white' 
                      : 'bg-[#102043]/30 border-[#102043] text-slate-400 hover:text-white'
                  }`}
                >
                  <div className="text-left min-w-0">
                    <span className="text-xs font-bold block truncate">{b.name}</span>
                    <span className="text-[10px] text-slate-500 font-mono mt-1 block">Rooms: {b.rooms} | Occupancy: {b.occupancy}%</span>
                  </div>
                  <ChevronRightIcon className="w-4 h-4 text-slate-500" />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Center Column - Building Inspector / HVAC sliders */}
        <div className="flex flex-col gap-6 text-left">
          <div className="p-6 bg-[#0B1736] border border-[#102043] rounded-3xl flex flex-col gap-5 h-full">
            <div className="flex items-center justify-between border-b border-[#102043] pb-3">
              <span className="text-xs font-bold text-white uppercase tracking-wider font-mono">HVAC Controller</span>
              <Building2 className="w-5 h-5 text-indigo-400" />
            </div>

            {activeBuilding ? (
              <div className="flex-1 flex flex-col justify-between gap-6">
                <div>
                  <h3 className="text-sm font-extrabold text-white">{activeBuilding.name}</h3>
                  <p className="text-xs text-slate-400 mt-1">Real-time digital twin variables matching sensor index</p>
                </div>

                {/* Occupancy Indicator */}
                <div className="p-4 bg-black/30 border border-[#102043] rounded-2xl">
                  <div className="flex justify-between items-center text-xs mb-1.5">
                    <span className="text-slate-400 font-medium">Occupancy Capacity</span>
                    <span className="font-bold text-indigo-300">{activeBuilding.occupancy}%</span>
                  </div>
                  <div className="w-full h-2 bg-[#102043] rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-500 rounded-full transition-all" style={{ width: `${activeBuilding.occupancy}%` }}></div>
                  </div>
                </div>

                {/* Energy Consumption Indicator */}
                <div className="p-4 bg-black/30 border border-[#102043] rounded-2xl">
                  <div className="flex justify-between items-center text-xs mb-1.5">
                    <span className="text-slate-400 font-medium">Current Power Load</span>
                    <span className="font-bold text-amber-400 font-mono">{activeBuilding.consumption} kW</span>
                  </div>
                  <div className="w-full h-2 bg-[#102043] rounded-full overflow-hidden">
                    <div className="h-full bg-amber-500 rounded-full transition-all" style={{ width: `${Math.min(100, activeBuilding.consumption / 1.5)}%` }}></div>
                  </div>
                </div>

                {/* HVAC Temp Slider */}
                <div className="p-4 bg-[#102043]/30 border border-[#102043] rounded-2xl">
                  <div className="flex justify-between items-center text-xs mb-2">
                    <span className="text-slate-400 font-medium flex items-center gap-1"><Thermometer className="w-4 h-4 text-rose-400" /> Target Air Temp</span>
                    <span className="font-bold text-white font-mono text-sm">{activeBuilding.hvacTemp.toFixed(1)}°C</span>
                  </div>
                  <input
                    type="range"
                    min="16"
                    max="28"
                    step="0.5"
                    value={activeBuilding.hvacTemp}
                    onChange={(e) => handleTempChange(activeBuilding.id, e.target.value)}
                    className="w-full accent-indigo-500 cursor-pointer h-1 bg-black/40 rounded-lg outline-none"
                  />
                  <div className="flex justify-between text-[8px] text-slate-500 mt-1.5 font-mono">
                    <span>16°C (Cool)</span>
                    <span>28°C (Warm)</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-500 text-xs py-8">
                Select a building node to view HVAC variables.
              </div>
            )}
          </div>
        </div>

        {/* Right Column - Shuttle Transit Tracker */}
        <div className="flex flex-col gap-6 text-left">
          <div className="p-6 bg-[#0B1736] border border-[#102043] rounded-3xl flex flex-col gap-4">
            <span className="text-xs font-bold text-white uppercase tracking-wider font-mono">Campus Shuttle Fleet</span>
            
            <div className="flex flex-col gap-4">
              {shuttles.map((sh) => (
                <div key={sh.id} className="p-4 bg-black/30 border border-[#102043] rounded-2xl flex flex-col gap-3 text-xs">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 bg-indigo-500/10 text-indigo-400 rounded-lg">
                        <Navigation className="w-4 h-4 rotate-45" />
                      </div>
                      <span className="font-bold text-slate-200">{sh.name}</span>
                    </div>
                    <span className={`px-2 py-0.5 rounded text-[8px] font-bold border ${
                      sh.status === 'Transit' ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' : 'bg-slate-500/10 text-slate-400 border-slate-500/20'
                    }`}>
                      {sh.status}
                    </span>
                  </div>

                  <div className="flex flex-col gap-1.5 text-[10px] text-slate-400">
                    <div className="flex justify-between">
                      <span>Coordinates:</span>
                      <span className="font-mono text-slate-200">{sh.coords}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Speed:</span>
                      <span className="font-mono text-slate-200">{sh.speed} km/h</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Next Depot:</span>
                      <span className="font-semibold text-indigo-300">{sh.nextStop}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

// Small helper Chevron Icon
function ChevronRightIcon(props) {
  return (
    <svg 
      className={props.className} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
}
