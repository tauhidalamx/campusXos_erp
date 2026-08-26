'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Wifi, 
  Cpu, 
  Map, 
  Search, 
  ArrowLeft, 
  CheckCircle, 
  User, 
  Clock, 
  BookOpen, 
  Car,
  ToggleLeft,
  ToggleRight,
  RefreshCw,
  Activity
} from 'lucide-react';

export default function IotPage() {
  // Parking slot states
  const [parkingSlots, setParkingSlots] = useState([
    { id: 'p1', label: 'Slot A1 (Staff)', occupied: true },
    { id: 'p2', label: 'Slot A2 (Staff)', occupied: false },
    { id: 'p3', label: 'Slot B1 (Student)', occupied: true },
    { id: 'p4', label: 'Slot B2 (Student)', occupied: false },
    { id: 'p5', label: 'Slot B3 (Student)', occupied: true },
    { id: 'p6', label: 'Slot B4 (Student)', occupied: false },
    { id: 'p7', label: 'EV Charger 1', occupied: true },
    { id: 'p8', label: 'EV Charger 2', occupied: false }
  ]);

  // Attendance RFID Logs state
  const [rfidLogs, setRfidLogs] = useState([
    { id: 'rf_1', cardId: '0x8f2d91a2', userName: 'John Doe', location: 'AI Lab Entrance', time: '20:42:01', status: 'Authorized' },
    { id: 'rf_2', cardId: '0x4c2b98f5', userName: 'Alice Smith', location: 'BioTech Lab 2', time: '20:41:45', status: 'Authorized' }
  ]);

  // Library Capacity stats
  const [libCapacity, setLibCapacity] = useState({ current: 68, max: 120 });
  const [hardwareRegistry, setHardwareRegistry] = useState([
    { id: 'hw_1', name: 'RFID Scanner Gate A', status: 'Online', ip: '10.0.4.12' },
    { id: 'hw_2', name: 'Computer Vision Camera 1', status: 'Online', ip: '10.0.4.24' },
    { id: 'hw_3', name: 'NFC Door Lock CS Seminar', status: 'Online', ip: '10.0.5.8' }
  ]);

  // Live IoT data updates
  useEffect(() => {
    const rfidUsers = [
      { name: 'Bob Johnson', card: '0x1a8f9c2d', location: 'Consortium Data Center' },
      { name: 'Dr. Evelyn Sterling', card: '0x7e2b8a1c', location: 'AI Lab Entrance' },
      { name: 'Zoe Chen', card: '0x9d3f4b5a', location: 'Main Library Gate' }
    ];

    const interval = setInterval(() => {
      // Toggle a random parking spot occupation
      setParkingSlots(prev => prev.map(s => {
        if (Math.random() > 0.7) {
          return { ...s, occupied: !s.occupied };
        }
        return s;
      }));

      // Simulate Library fluctuations
      setLibCapacity(prev => {
        const delta = Math.random() > 0.5 ? 1 : -1;
        const next = Math.max(20, Math.min(prev.max, prev.current + delta));
        return { ...prev, current: next };
      });

      // Add fresh RFID scan log
      const pickUser = rfidUsers[Math.floor(Math.random() * rfidUsers.length)];
      const now = new Date();
      const timeStr = now.toTimeString().split(' ')[0];
      setRfidLogs(prev => [
        {
          id: 'rf_' + Date.now(),
          cardId: pickUser.card,
          userName: pickUser.name,
          location: pickUser.location,
          time: timeStr,
          status: 'Authorized'
        },
        ...prev.slice(0, 7)
      ]);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const toggleParkingSlot = (id) => {
    setParkingSlots(prev => prev.map(s => s.id === id ? { ...s, occupied: !s.occupied } : s));
  };

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
              CAMPUSX Smart Campus IoT Hub
            </h1>
            <p className="text-xs text-slate-400">RFID Attendance Registry, Computer Vision Counters & Parking Node Telemetry</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3.5 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-bold rounded-full flex items-center gap-1.5 font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span> Live Sensors Synced
          </span>
        </div>
      </div>

      {/* Main Grid Workdesk */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column - RFID attendance telemetry stream */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          
          <div className="p-6 bg-[#0B1736] border border-[#102043] rounded-3xl flex flex-col gap-4 text-left">
            <div className="flex items-center justify-between border-b border-[#102043] pb-3">
              <span className="text-xs font-bold text-white uppercase tracking-wider font-mono">NFC / RFID Live Swipes</span>
              <Activity className="w-4.5 h-4.5 text-indigo-400 animate-pulse" />
            </div>

            <div className="overflow-x-auto border border-[#102043] rounded-2xl">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="bg-[#102043]/40 border-b border-[#102043] text-slate-400 font-bold uppercase font-mono">
                    <th className="p-3.5">Card Token</th>
                    <th className="p-3.5">User Identity</th>
                    <th className="p-3.5">Sensor Location</th>
                    <th className="p-3.5">Timestamp</th>
                    <th className="p-3.5">IAM Clearance</th>
                  </tr>
                </thead>
                <tbody>
                  {rfidLogs.map((log) => (
                    <tr key={log.id} className="border-b border-[#102043] hover:bg-white/[0.01] transition-all">
                      <td className="p-3.5 font-mono text-indigo-300 font-bold">{log.cardId}</td>
                      <td className="p-3.5 font-semibold text-slate-200">{log.userName}</td>
                      <td className="p-3.5 text-slate-300">{log.location}</td>
                      <td className="p-3.5 text-slate-400 font-mono">{log.time}</td>
                      <td className="p-3.5">
                        <span className="px-2 py-0.5 rounded text-[8px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          {log.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Computer Vision library stats */}
          <div className="p-6 bg-[#0B1736] border border-[#102043] rounded-3xl grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            <div className="md:col-span-2 flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold text-white uppercase tracking-wider font-mono">Library Capacity Model</span>
                <p className="text-xs text-slate-400 mt-1">Computer vision inference counting active study desks</p>
              </div>

              <div className="flex gap-8 items-end mt-4">
                <div>
                  <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Occupied desks</span>
                  <p className="text-3xl font-extrabold font-mono text-white mt-1">{libCapacity.current} / {libCapacity.max}</p>
                </div>
                <div className="flex-1 pb-1">
                  <div className="w-full h-3 bg-[#102043] border border-[#1a2e5d] rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-indigo-500 to-indigo-300 rounded-full transition-all" 
                      style={{ width: `${(libCapacity.current / libCapacity.max) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 bg-[#102043]/30 border border-[#102043] rounded-2xl flex flex-col justify-between items-center text-center">
              <BookOpen className="w-8 h-8 text-indigo-400 animate-bounce" />
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold">Density Index</span>
                <p className="text-sm font-bold text-white mt-1">
                  {((libCapacity.current / libCapacity.max) * 100).toFixed(0)}% Utilized
                </p>
              </div>
            </div>
          </div>

        </div>

        {/* Right Column - Smart Parking Slot Map & Hardware Registry */}
        <div className="flex flex-col gap-6 text-left">
          
          {/* Smart Parking slots */}
          <div className="p-6 bg-[#0B1736] border border-[#102043] rounded-3xl flex flex-col gap-4">
            <span className="text-xs font-bold text-white uppercase tracking-wider font-mono flex items-center gap-1.5">
              <Car className="w-4 h-4 text-indigo-400" /> Smart Parking Grid
            </span>
            <p className="text-[10px] text-slate-400 -mt-2">Click any grid slot to simulate hardware state change</p>
            
            <div className="grid grid-cols-2 gap-3">
              {parkingSlots.map((slot) => (
                <button
                  key={slot.id}
                  onClick={() => toggleParkingSlot(slot.id)}
                  className={`p-3 border rounded-xl flex flex-col justify-between text-left cursor-pointer transition-all ${
                    slot.occupied 
                      ? 'bg-rose-500/10 border-rose-500/20 text-rose-400 hover:bg-rose-500/15' 
                      : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/15'
                  }`}
                >
                  <span className="text-xs font-bold">{slot.label}</span>
                  <span className="text-[9px] font-mono mt-1 uppercase font-bold tracking-wider">
                    {slot.occupied ? 'Occupied' : 'Vacant'}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Active Hardware Registry */}
          <div className="p-6 bg-[#0B1736] border border-[#102043] rounded-3xl flex flex-col gap-4">
            <span className="text-xs font-bold text-white uppercase tracking-wider font-mono">Hardware Edge Devices</span>
            <div className="flex flex-col gap-2.5">
              {hardwareRegistry.map((hw) => (
                <div key={hw.id} className="p-3 bg-[#102043]/30 border border-[#102043] rounded-xl text-xs flex justify-between items-center">
                  <div>
                    <span className="font-bold text-slate-200">{hw.name}</span>
                    <code className="text-[9px] text-slate-500 block font-mono mt-0.5">IP: {hw.ip}</code>
                  </div>
                  <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded font-mono text-[8px] font-bold">
                    {hw.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
