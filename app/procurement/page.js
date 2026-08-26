'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  ShoppingBag, 
  ArrowLeft, 
  Plus, 
  DollarSign, 
  Users, 
  CheckCircle, 
  Clock, 
  AlertTriangle, 
  Activity, 
  TrendingUp, 
  Award,
  Trash2
} from 'lucide-react';

export default function ProcurementPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Active Vendors list with rating details
  const [vendors, setVendors] = useState([
    { name: 'Consortium Hardware Solutions', category: 'Computing & Nodes', rating: '98%', status: 'Preferred' },
    { name: 'Apex Logistics Services', category: 'Campus Transit & Shuttles', rating: '94%', status: 'Verified' },
    { name: 'Pioneer Office & Lab Supplies', category: 'General Consumables', rating: '88%', status: 'Standard' }
  ]);

  // Form states for new purchase ticket creation
  const [item, setItem] = useState('');
  const [qty, setQty] = useState('1');
  const [price, setPrice] = useState('150');
  const [vendor, setVendor] = useState('Consortium Hardware Solutions');

  // Fetch orders
  const fetchOrders = async () => {
    try {
      const res = await fetch('/api/procurement/orders');
      if (res.ok) {
        const data = await res.json();
        setOrders(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Submit purchase order ticket
  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    if (!item.trim()) return;

    try {
      const res = await fetch('/api/procurement/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          item,
          qty: parseInt(qty),
          price: parseFloat(price),
          vendor,
          status: 'Pending'
        })
      });

      if (res.ok) {
        setItem('');
        setQty('1');
        setPrice('150');
        fetchOrders();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Action: approve order status
  const handleApproveOrder = (orderId) => {
    setOrders(prev => prev.map(order => {
      if (order.id === orderId) {
        return { ...order, status: 'Approved' };
      }
      return order;
    }));
    alert(`Order approved. Disbursing budget allocation rules.`);
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
              CAMPUSX Procurement Portal
            </h1>
            <p className="text-xs text-slate-400">Purchase orders directory, vendor metrics tracker & ticketing system</p>
          </div>
        </div>

        <div className="flex gap-4 text-xs font-mono text-slate-400">
          <div className="flex items-center gap-1.5">
            <Activity className="w-4 h-4 text-indigo-400" /> Active Registry: <span className="font-bold text-white">Consortium Checked</span>
          </div>
        </div>
      </div>

      {/* Main Grid Workdesk */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column - purchase orders table (2 columns) */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          
          {/* Purchase orders list */}
          <div className="p-6 bg-[#0B1736] border border-[#102043] rounded-3xl flex flex-col gap-4 text-left">
            <span className="text-xs font-bold text-white uppercase tracking-wider font-mono">Purchase Order Ledger</span>
            
            {loading ? (
              <div className="text-center py-6 text-slate-400 text-xs">Loading purchase logs...</div>
            ) : orders.length === 0 ? (
              <div className="text-center py-6 text-slate-400 text-xs">No active purchase tickets.</div>
            ) : (
              <div className="overflow-x-auto border border-[#102043] rounded-2xl">
                <table className="w-full text-xs text-left">
                  <thead>
                    <tr className="bg-[#102043]/40 border-b border-[#102043] text-slate-400 font-bold uppercase font-mono">
                      <th className="p-3.5">ID</th>
                      <th className="p-3.5">Billable Item details</th>
                      <th className="p-3.5">Units & Value</th>
                      <th className="p-3.5">Vendor</th>
                      <th className="p-3.5">Approval</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((ord) => (
                      <tr key={ord.id} className="border-b border-[#102043] hover:bg-white/[0.01] transition-all">
                        <td className="p-3.5 font-mono text-indigo-300 font-bold">{ord.id}</td>
                        <td className="p-3.5 font-semibold text-slate-200">{ord.item}</td>
                        <td className="p-3.5">
                          <span className="font-semibold text-white font-mono">{ord.qty}</span> x 
                          <span className="text-emerald-400 font-bold font-mono pl-1">${ord.price}</span>
                        </td>
                        <td className="p-3.5 text-slate-300 font-medium">{ord.vendor}</td>
                        <td className="p-3.5 flex items-center gap-2">
                          <span className={`px-2 py-0.5 rounded text-[8px] font-bold border uppercase ${
                            ord.status === 'Approved' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border-amber-500/20 animate-pulse'
                          }`}>
                            {ord.status}
                          </span>
                          {ord.status === 'Pending' && (
                            <button
                              onClick={() => handleApproveOrder(ord.id)}
                              className="px-2 py-0.5 bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600/30 border border-emerald-600/30 rounded text-[9px] font-bold cursor-pointer"
                            >
                              Approve
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

        </div>

        {/* Right Column - Create ticket form & Vendor roster */}
        <div className="flex flex-col gap-6 text-left">
          
          {/* Purchase ticketing form */}
          <div className="p-6 bg-[#0B1736] border border-[#102043] rounded-3xl flex flex-col gap-4">
            <span className="text-xs font-bold text-white uppercase tracking-wider font-mono">Create Purchase Ticket</span>
            
            <form onSubmit={handleSubmitOrder} className="flex flex-col gap-3 text-xs">
              <div className="flex flex-col gap-1.5">
                <label className="text-[9px] uppercase font-bold text-slate-400">Order Item</label>
                <input
                  type="text"
                  placeholder="e.g. NVIDIA H100 GPU Core Node"
                  value={item}
                  onChange={(e) => setItem(e.target.value)}
                  className="bg-[#102043] border border-[#1a2e5d] rounded-xl p-2.5 text-white outline-none focus:border-indigo-500"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] uppercase font-bold text-slate-400">Quantity</label>
                  <input
                    type="number"
                    value={qty}
                    onChange={(e) => setQty(e.target.value)}
                    className="bg-[#102043] border border-[#1a2e5d] rounded-xl p-2.5 text-white outline-none focus:border-indigo-500 font-mono"
                    required
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] uppercase font-bold text-slate-400">Unit Price ($)</label>
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="bg-[#102043] border border-[#1a2e5d] rounded-xl p-2.5 text-white outline-none focus:border-indigo-500 font-mono"
                    required
                  />
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[9px] uppercase font-bold text-slate-400">Target Vendor</label>
                <select
                  value={vendor}
                  onChange={(e) => setVendor(e.target.value)}
                  className="bg-[#102043] border border-[#1a2e5d] rounded-xl p-2.5 text-white outline-none"
                >
                  {vendors.map(v => <option key={v.name} value={v.name}>{v.name}</option>)}
                </select>
              </div>
              <button
                type="submit"
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-md"
              >
                <Plus className="w-4 h-4" /> Create Ticket
              </button>
            </form>
          </div>

          {/* Active Vendor roster */}
          <div className="p-6 bg-[#0B1736] border border-[#102043] rounded-3xl flex flex-col gap-4">
            <span className="text-xs font-bold text-white uppercase tracking-wider font-mono">Consortium Checked Vendors</span>
            
            <div className="flex flex-col gap-3">
              {vendors.map((v, i) => (
                <div key={i} className="p-3 bg-[#102043]/30 border border-[#102043] rounded-xl text-xs flex justify-between items-center">
                  <div>
                    <span className="font-bold text-slate-200">{v.name}</span>
                    <p className="text-[10px] text-slate-400 mt-0.5">{v.category}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-bold text-indigo-400 block">{v.rating} Score</span>
                    <span className="px-1.5 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded text-[7px] uppercase font-mono font-bold mt-1 inline-block">
                      {v.status}
                    </span>
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
