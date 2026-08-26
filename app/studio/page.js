'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  GitBranch, 
  Play, 
  Settings, 
  Plus, 
  Trash2, 
  Sparkles, 
  ArrowLeft, 
  Save, 
  Cpu, 
  Zap, 
  Code,
  LayoutGrid,
  CheckCircle2
} from 'lucide-react';

export default function StudioPage() {
  const [workflows, setWorkflows] = useState([]);
  const [loading, setLoading] = useState(true);

  // Studio Builder states
  const [activeNodes, setActiveNodes] = useState([
    { id: '1', type: 'Trigger', label: 'Student Graduation Verified', pos: { x: 50, y: 120 } },
    { id: '2', type: 'Action', label: 'Verify Minimum GPA 2.0', pos: { x: 300, y: 120 } },
    { id: '3', type: 'Action', label: 'Mint Soulbound Degree Token (SBT)', pos: { x: 550, y: 120 } }
  ]);
  const [selectedNode, setSelectedNode] = useState(null);

  // Form states
  const [flowTitle, setFlowTitle] = useState('');
  const [flowTrigger, setFlowTrigger] = useState('student.graduated');

  // Load workflows
  const fetchWorkflows = async () => {
    try {
      const res = await fetch('/api/studio/workflows');
      if (res.ok) {
        const data = await res.json();
        setWorkflows(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkflows();
  }, []);

  // Save workflow
  const handleSaveWorkflow = async (e) => {
    e.preventDefault();
    if (!flowTitle.trim()) return;

    try {
      const res = await fetch('/api/studio/workflows', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: flowTitle,
          trigger: flowTrigger,
          nodes: activeNodes
        })
      });

      if (res.ok) {
        setFlowTitle('');
        fetchWorkflows();
        alert('Workflow automation template saved successfully to ledger!');
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Add Action Node
  const handleAddNode = () => {
    const newId = String(activeNodes.length + 1);
    const lastNode = activeNodes[activeNodes.length - 1];
    const newX = lastNode ? lastNode.pos.x + 200 : 100;
    const newY = lastNode ? lastNode.pos.y : 120;
    
    setActiveNodes([
      ...activeNodes,
      {
        id: newId,
        type: 'Action',
        label: `Custom Action Node ${newId}`,
        pos: { x: newX, y: newY }
      }
    ]);
  };

  // Delete node
  const handleDeleteNode = (id) => {
    setActiveNodes(activeNodes.filter(n => n.id !== id));
    if (selectedNode?.id === id) {
      setSelectedNode(null);
    }
  };

  // Update selected node properties
  const updateNodeLabel = (newVal) => {
    if (!selectedNode) return;
    setActiveNodes(activeNodes.map(n => n.id === selectedNode.id ? { ...n, label: newVal } : n));
    setSelectedNode({ ...selectedNode, label: newVal });
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
              CAMPUSX Studio Automation Builder
            </h1>
            <p className="text-xs text-slate-400">Low-Code Event-Trigger Node Canvas Workspace</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleAddNode}
            className="px-3.5 py-1.5 bg-[#102043] border border-[#1a2e5d] hover:bg-[#1a2e5d] text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Add Action Node
          </button>
        </div>
      </div>

      {/* Main Grid Workdesk */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Node Designer Canvas (Takes 3 columns) */}
        <div className="lg:col-span-3 flex flex-col gap-6">
          <div className="p-6 bg-[#0B1736] border border-[#102043] rounded-3xl flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-[#102043] pb-3">
              <span className="text-xs font-bold text-white uppercase tracking-wider font-mono">Interactive Flow Canvas</span>
              <span className="text-[10px] text-slate-500">Click a node to configure or update its parameters</span>
            </div>

            {/* Virtual Node Editor Canvas Area */}
            <div className="relative min-h-[380px] bg-black/40 border border-[#102043] rounded-2xl p-6 overflow-hidden flex items-center justify-start gap-4">
              <div className="absolute inset-0 bg-[radial-gradient(#102043_1px,transparent_1px)] [background-size:16px_16px] opacity-60"></div>
              
              {/* Nodes Stack */}
              <div className="relative z-10 w-full flex flex-wrap items-center justify-center gap-12 lg:gap-16">
                {activeNodes.map((node, idx) => (
                  <div key={node.id} className="relative flex items-center">
                    
                    {/* Node block */}
                    <div 
                      onClick={() => setSelectedNode(node)}
                      className={`p-4 rounded-2xl w-44 border transition-all cursor-pointer ${
                        selectedNode?.id === node.id 
                          ? 'bg-indigo-600/30 border-indigo-400 shadow-[0_0_15px_rgba(99,102,241,0.3)]' 
                          : 'bg-[#0B1736] border-[#102043] hover:border-indigo-500/50'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <span className={`text-[8px] px-1.5 py-0.5 rounded font-bold uppercase ${
                          node.type === 'Trigger' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/20' : 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/20'
                        }`}>
                          {node.type}
                        </span>
                        {node.type !== 'Trigger' && (
                          <button 
                            onClick={(e) => { e.stopPropagation(); handleDeleteNode(node.id); }}
                            className="text-slate-500 hover:text-rose-400 p-0.5 rounded transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                      <p className="text-xs font-semibold text-slate-200 mt-1 leading-snug">{node.label}</p>
                    </div>

                    {/* Connection Arrow */}
                    {idx < activeNodes.length - 1 && (
                      <div className="absolute left-full w-12 lg:w-16 h-0.5 bg-gradient-to-r from-indigo-500/50 to-indigo-500/20 flex items-center justify-end -mr-12 lg:-mr-16">
                        <Zap className="w-3 h-3 text-indigo-400 -mr-1.5 bg-[#071126] rounded-full p-0.5" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Config & Add Form details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-3">
              
              {/* Save automation event template */}
              <div className="p-4 bg-[#102043]/30 border border-[#102043] rounded-2xl text-left">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">Anchor Flow Template</span>
                <form onSubmit={handleSaveWorkflow} className="flex flex-col gap-3 mt-3">
                  <div className="flex flex-col gap-1 text-xs">
                    <label className="text-[9px] uppercase font-bold text-slate-400">Workflow Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Issue soulbound cert"
                      value={flowTitle}
                      onChange={(e) => setFlowTitle(e.target.value)}
                      className="bg-[#0B1736] border border-[#102043] rounded-xl p-2 text-xs text-white outline-none focus:border-indigo-500"
                      required
                    />
                  </div>
                  <div className="flex flex-col gap-1 text-xs">
                    <label className="text-[9px] uppercase font-bold text-slate-400">Trigger Event</label>
                    <select
                      value={flowTrigger}
                      onChange={(e) => setFlowTrigger(e.target.value)}
                      className="bg-[#0B1736] border border-[#102043] rounded-xl p-2 text-xs text-white outline-none"
                    >
                      <option value="student.graduated">student.graduated</option>
                      <option value="research.milestone_approved">research.milestone_approved</option>
                      <option value="user.sso_authenticated">user.sso_authenticated</option>
                      <option value="library.book_overdue">library.book_overdue</option>
                    </select>
                  </div>
                  <button
                    type="submit"
                    className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-md"
                  >
                    <Save className="w-4 h-4" /> Save Template
                  </button>
                </form>
              </div>

              {/* Dynamic properties inspector */}
              <div className="p-4 bg-[#102043]/30 border border-[#102043] rounded-2xl text-left">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono font-semibold">Node Inspector</span>
                {selectedNode ? (
                  <div className="flex flex-col gap-3 mt-3">
                    <div className="flex flex-col gap-1 text-xs">
                      <label className="text-[9px] uppercase font-bold text-slate-400">Selected Node Type</label>
                      <p className="text-xs font-bold text-indigo-400">{selectedNode.type}</p>
                    </div>
                    <div className="flex flex-col gap-1 text-xs">
                      <label className="text-[9px] uppercase font-bold text-slate-400">Label Text</label>
                      <input
                        type="text"
                        value={selectedNode.label}
                        onChange={(e) => updateNodeLabel(e.target.value)}
                        className="bg-[#0B1736] border border-[#102043] rounded-xl p-2 text-xs text-white outline-none focus:border-indigo-500"
                      />
                    </div>
                    <div className="text-[9px] text-slate-400 italic">
                      Positions are anchoring dynamically in order to support flow ledger.
                    </div>
                  </div>
                ) : (
                  <div className="h-full flex items-center justify-center text-slate-500 text-xs py-8">
                    Select a node on the canvas to configure properties.
                  </div>
                )}
              </div>

            </div>
          </div>
        </div>

        {/* Saved Templates directory list */}
        <div className="flex flex-col gap-6 text-left">
          <div className="p-6 bg-[#0B1736] border border-[#102043] rounded-3xl flex flex-col gap-4">
            <span className="text-xs font-bold text-white uppercase tracking-wider font-mono">Active Flow Templates</span>
            
            {loading ? (
              <div className="text-xs text-slate-400 py-6 text-center">Loading templates...</div>
            ) : workflows.length === 0 ? (
              <div className="text-xs text-slate-400 py-6 text-center">No active templates found.</div>
            ) : (
              <div className="flex flex-col gap-3 max-h-[460px] overflow-y-auto pr-1">
                {workflows.map((flow) => (
                  <div key={flow.id} className="p-3 bg-[#102043]/30 border border-[#102043] rounded-xl flex flex-col gap-1.5 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white leading-tight">{flow.title}</span>
                      <span className="px-2 py-0.5 rounded text-[8px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold uppercase">{flow.status}</span>
                    </div>
                    <p className="text-[10px] text-slate-400 font-mono mt-0.5 bg-black/20 p-1 px-1.5 rounded">{flow.trigger}</p>
                    <div className="flex justify-between items-center text-[9px] text-slate-500 font-mono mt-1 border-t border-white/5 pt-2">
                      <span>Nodes: {flow.nodes ? flow.nodes.length : 0}</span>
                      <span>{flow.id}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
