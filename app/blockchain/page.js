'use client';

import React, { useState, useEffect, useRef, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useDb } from '../../context/db-context';
import { 
  LayoutDashboard, 
  Award, 
  FileCheck, 
  Sparkles, 
  Wallet, 
  Code, 
  FlaskConical, 
  CheckSquare, 
  Fingerprint, 
  Server, 
  Globe, 
  Activity, 
  Settings as SettingsIcon,
  ChevronRight,
  Search, 
  ArrowUpRight, 
  ArrowDownRight, 
  Bell, 
  User, 
  Cpu, 
  Layers, 
  ShieldAlert, 
  Play, 
  Download, 
  Send, 
  Share2, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  Lock, 
  Unlock, 
  RefreshCw, 
  Plus, 
  Trash2,
  MessageSquare
} from 'lucide-react';

function BlockchainPageContent() {
  const { students, transactions } = useDb();
  const [currentUser, setCurrentUser] = useState(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeTab = searchParams.get('tab') || 'overview';

  // Load user session
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const session = sessionStorage.getItem('campusx_erp_session');
      if (session) {
        setCurrentUser(JSON.parse(session));
      }
    }
  }, []);

  // Update query param when tab changes
  const handleTabChange = (tabId) => {
    router.push(`/blockchain?tab=${tabId}`);
  };

  // State definitions
  const [blocks, setBlocks] = useState([]);
  const [credentials, setCredentials] = useState([]);
  const [degreeList, setDegreeList] = useState([]);
  const [governanceProposals, setGovernanceProposals] = useState([]);
  const [researchRecords, setResearchRecords] = useState([]);
  const [networkLogs, setNetworkLogs] = useState([]);
  
  // Wallet states
  const [selectedWalletUser, setSelectedWalletUser] = useState('STU001');
  const [customKeySeed, setCustomKeySeed] = useState('campusx mnemonic private seed phrase academic trust credentials key');
  const [derivedAddress, setDerivedAddress] = useState('0x1b790d984d720a45594efa4cbefe46df7db0e21');
  const [signingPayload, setSigningPayload] = useState('Recruiter Challenge Token #9401');
  const [signatureOutput, setSignatureOutput] = useState('');

  // Form states
  const [newDegree, setNewDegree] = useState({ studentId: 'STU001', degreeName: 'Bachelor of Science', major: 'Computer Science', classification: 'First Class with Distinction' });
  const [newCert, setNewCert] = useState({ studentId: 'STU001', certType: 'Course Completion', courseCode: 'CS202', title: 'Data Structures & Algorithms', grade: 'A+' });
  const [newResearch, setNewResearch] = useState({ title: 'Autonomous Agentic Mesh Systems', leadResearcher: 'Dr. Evelyn Carter', coAuthors: 'Aria Nakamura, Devon Miller', abstract: 'A framework for off-grid federated agent nodes using hybrid execution pipelines.', ipfsHash: 'QmYwAPJjh34dHnKpeP1GvD22xJ8Pq5n9' });
  const [newProposal, setNewProposal] = useState({ description: 'Fund Student VR Classroom Infrastructure Expansion', duration: 604800 });
  const [verifyHashQuery, setVerifyHashQuery] = useState('');
  const [verificationOutcome, setVerificationOutcome] = useState(null);
  const [explorerQuery, setExplorerQuery] = useState('');
  const [explorerResult, setExplorerResult] = useState(null);

  // Dynamic status parameters
  const [tps, setTps] = useState(12);
  const [blockTime, setBlockTime] = useState(1.2);
  const [gasPrice, setGasPrice] = useState(15);
  const [activeNodesCount, setActiveNodesCount] = useState(8);

  // Initial seeding
  useEffect(() => {
    if (students.length === 0) return;

    // Seeding mock Blocks
    const initialBlocks = [
      { index: 0, hash: '0x0000000000000000000000000000000000000000', prevHash: '0x0000000000000000000000000000000000000000', type: 'GENESIS', timestamp: '2026-01-01 00:00', data: 'CampusX Genesis' },
      { index: 1, hash: '0x81cf712d984efc464efb6088ffabce18ff940a01', prevHash: '0x0000000000000000000000000000000000000000', type: 'IDENTITY_REGISTER', timestamp: '2026-01-05 10:14', data: 'Authorized Registrar Nodes' },
      { index: 2, hash: '0x3cb4d720a455a1532ffeb9d22ffde46d7db0e21a', prevHash: '0x81cf712d984efc464efb6088ffabce18ff940a01', type: 'CONTRACT_DEPLOY', timestamp: '2026-01-10 11:30', data: 'CertificateSBT Contract Deployed' }
    ];

    // Seeding mock Degrees
    const initialDegrees = [
      { id: '1', studentId: 'STU001', studentName: 'Alex Rivera', degreeName: 'Bachelor of Science', major: 'Computer Science', date: '2026-05-15', hash: '0x9320e4da2b7a94ef88decf823abf26d7f021e05a', status: 'VERIFIED' },
      { id: '2', studentId: 'STU002', studentName: 'Zoe Chen', degreeName: 'Bachelor of Engineering', major: 'Robotics', date: '2026-05-20', hash: '0xf43ca7b58d9e2ba41b088ffd2a81cb9f26e08ba1', status: 'VERIFIED' },
      { id: '3', studentId: 'STU006', studentName: 'Sophia Patel', degreeName: 'Doctor of Philosophy', major: 'Artificial Intelligence', date: '2026-06-01', hash: '0xe12a78bf60d8ef459c009d2efc7db0e21bcda8ff', status: 'VERIFIED' }
    ];

    // Seeding mock Certificates
    const initialCerts = [
      { id: '101', studentId: 'STU001', certType: 'Course Completion', title: 'Intro to Machine Learning', grade: 'A+', hash: '0x88f2be58daef271cb0f438da1cf4d88e001f78ea', status: 'VERIFIED' },
      { id: '102', studentId: 'STU009', certType: 'Merit Award', title: 'Gold Medal in Microprocessors', grade: 'Honorary', hash: '0x321f00a52df09a5b32f1ea30cff1a2b0e9a7dfb2', status: 'VERIFIED' }
    ];

    // Seeding mock Proposals
    const initialProposals = [
      { id: 1, description: 'Establish Academic Research Grant Funding Protocol for GenAI Projects', votesFor: 184, votesAgainst: 32, status: 'PASSED', endTime: '2026-05-10', executed: true },
      { id: 2, description: 'Adopt Quad-Node Hybrid Validator Scheme for Multi-Campus Ledger Sync', votesFor: 92, votesAgainst: 8, status: 'PASSED', endTime: '2026-05-25', executed: true },
      { id: 3, description: 'Extend Student Senate Governance Smart Contract Voting Powers', votesFor: 142, votesAgainst: 138, status: 'ACTIVE', endTime: '2026-06-20', executed: false }
    ];

    // Seeding mock Research Records
    const initialResearch = [
      { id: '1', title: 'Zero-Knowledge Proofs for Verifiable Grade Reports', leadResearcher: 'Dr. Evelyn Carter', coAuthors: 'Alex Rivera', abstract: 'A protocol for students to prove grade eligibility without revealing absolute score metrics.', ipfsHash: 'QmYwAPJjh34dHnKpeP1GvD22xJ8Pq5n9', timestamp: '2026-02-14 14:20' },
      { id: '2', title: 'Federated Ledger Nodes on Energy Constrained IoT Platforms', leadResearcher: 'Prof. Marcus Vance', coAuthors: 'Devon Miller', abstract: 'Analysis of low-power node synchronization algorithms on decentralized mesh networks.', ipfsHash: 'QmRz1aB5dfg817cffb022aa29910dffeab01cf4bda', timestamp: '2026-04-18 09:12' }
    ];

    setBlocks(initialBlocks);
    setDegreeList(initialDegrees);
    setCredentials(initialCerts);
    setGovernanceProposals(initialProposals);
    setResearchRecords(initialResearch);

    setNetworkLogs([
      { type: 'INFO', msg: 'Validator Node 1 [Main Campus] synchronized state root.' },
      { type: 'WARN', msg: 'Validator Node 4 [Hostel Subnet] latency spikes: 140ms.' },
      { type: 'SUCCESS', msg: 'Decentralized Identity registry synced with Polygon anchor.' }
    ]);
  }, [students]);

  // Periodic metrics changes
  useEffect(() => {
    const interval = setInterval(() => {
      setTps(Math.round(8 + Math.random() * 8));
      setGasPrice(Math.round(12 + Math.random() * 6));
      setBlockTime(parseFloat((1.0 + Math.random() * 0.4).toFixed(2)));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Action methods
  const handleIssueDegree = () => {
    const student = students.find(s => s.id === newDegree.studentId);
    if (!student) return;

    const degreeHash = '0x' + Math.floor(Math.random() * 0xFFFFFFFF).toString(16) + Math.floor(Math.random() * 0xFFFFFFFF).toString(16);
    const degree = {
      id: (degreeList.length + 1).toString(),
      studentId: newDegree.studentId,
      studentName: student.name,
      degreeName: newDegree.degreeName,
      major: newDegree.major,
      date: new Date().toISOString().split('T')[0],
      hash: degreeHash,
      status: 'VERIFIED'
    };

    setDegreeList(prev => [...prev, degree]);

    // Push new block
    const block = {
      index: blocks.length,
      hash: degreeHash,
      prevHash: blocks[blocks.length - 1].hash,
      type: 'DEGREE_ISSUE',
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
      data: `Issued ${newDegree.degreeName} to ${student.name}`
    };
    setBlocks(prev => [...prev, block]);

    alert(`Degree Issued Successfully! Cryptographic Hash Anchored: ${degreeHash}`);
  };

  const handleRevokeDegree = (hash) => {
    if (confirm('Are you sure you want to revoke this degree credential? This will submit a revocation block onto the chain.')) {
      setDegreeList(prev => prev.map(d => d.hash === hash ? { ...d, status: 'REVOKED' } : d));
      
      const block = {
        index: blocks.length,
        hash: '0x' + Math.floor(Math.random() * 0xFFFFFFFF).toString(16),
        prevHash: blocks[blocks.length - 1].hash,
        type: 'CREDENTIAL_REVOKE',
        timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
        data: `Revoked credential hash: ${hash}`
      };
      setBlocks(prev => [...prev, block]);
    }
  };

  const handleIssueCertificate = () => {
    const student = students.find(s => s.id === newCert.studentId);
    if (!student) return;

    const certHash = '0x' + Math.floor(Math.random() * 0xFFFFFFFF).toString(16) + Math.floor(Math.random() * 0xFFFFFFFF).toString(16);
    const cert = {
      id: (credentials.length + 101).toString(),
      studentId: newCert.studentId,
      studentName: student.name,
      certType: newCert.certType,
      title: newCert.title,
      grade: newCert.grade,
      hash: certHash,
      status: 'VERIFIED'
    };

    setCredentials(prev => [...prev, cert]);

    const block = {
      index: blocks.length,
      hash: certHash,
      prevHash: blocks[blocks.length - 1].hash,
      type: 'CERT_ISSUE',
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
      data: `Issued certificate ${newCert.title} to ${student.name}`
    };
    setBlocks(prev => [...prev, block]);

    alert(`Certificate SBT Minted successfully! Verification hash: ${certHash}`);
  };

  const handleVerifyQuery = () => {
    const query = verifyHashQuery.toLowerCase().trim();
    if (!query) return;

    const degree = degreeList.find(d => d.hash.toLowerCase() === query || d.studentId.toLowerCase() === query);
    const cert = credentials.find(c => c.hash.toLowerCase() === query || c.studentId.toLowerCase() === query);

    if (degree) {
      setVerificationOutcome({ type: 'DEGREE', data: degree });
    } else if (cert) {
      setVerificationOutcome({ type: 'CERTIFICATE', data: cert });
    } else {
      setVerificationOutcome({ type: 'NOT_FOUND' });
    }
  };

  const handleSignPayload = () => {
    if (!derivedAddress) return;
    const mockSig = '0x' + Array.from({ length: 65 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
    setSignatureOutput(mockSig);
  };

  const handleLogResearch = () => {
    const record = {
      id: (researchRecords.length + 1).toString(),
      title: newResearch.title,
      leadResearcher: newResearch.leadResearcher,
      coAuthors: newResearch.coAuthors,
      abstract: newResearch.abstract,
      ipfsHash: newResearch.ipfsHash,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16)
    };

    setResearchRecords(prev => [...prev, record]);

    const block = {
      index: blocks.length,
      hash: '0x' + Math.floor(Math.random() * 0xFFFFFFFF).toString(16),
      prevHash: blocks[blocks.length - 1].hash,
      type: 'RESEARCH_PROVENANCE',
      timestamp: record.timestamp,
      data: `Provenance logged: ${newResearch.title}`
    };
    setBlocks(prev => [...prev, block]);

    alert(`Research Provenance Hash registered on blockchain! IPFS CID: ${newResearch.ipfsHash}`);
  };

  const handleCreateProposal = () => {
    const proposal = {
      id: governanceProposals.length + 1,
      description: newProposal.description,
      votesFor: 0,
      votesAgainst: 0,
      status: 'ACTIVE',
      endTime: new Date(Date.now() + newProposal.duration * 1000).toISOString().split('T')[0],
      executed: false
    };

    setGovernanceProposals(prev => [...prev, proposal]);

    const block = {
      index: blocks.length,
      hash: '0x' + Math.floor(Math.random() * 0xFFFFFFFF).toString(16),
      prevHash: blocks[blocks.length - 1].hash,
      type: 'GOV_PROPOSAL',
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
      data: `Proposal created: ${newProposal.description}`
    };
    setBlocks(prev => [...prev, block]);

    alert('Proposal Broadcasted to CAMPUSX DAO Governance Ledger.');
  };

  const handleCastVote = (proposalId, support, weight) => {
    setGovernanceProposals(prev => prev.map(p => {
      if (p.id === proposalId) {
        return {
          ...p,
          votesFor: support ? p.votesFor + weight : p.votesFor,
          votesAgainst: !support ? p.votesAgainst + weight : p.votesAgainst
        };
      }
      return p;
    }));
    alert(`Vote cast successfully with Quadratic Weight: ${weight}!`);
  };

  const handleExplorerSearch = () => {
    const query = explorerQuery.toLowerCase().trim();
    if (!query) return;

    const blockMatch = blocks.find(b => b.index.toString() === query || b.hash.toLowerCase() === query);
    const recordMatch = degreeList.find(d => d.hash.toLowerCase() === query) || credentials.find(c => c.hash.toLowerCase() === query);

    if (blockMatch) {
      setExplorerResult({ type: 'BLOCK', data: blockMatch });
    } else if (recordMatch) {
      setExplorerResult({ type: 'CREDENTIAL', data: recordMatch });
    } else {
      setExplorerResult({ type: 'NOT_FOUND' });
    }
  };

  return (
    <div className="flex flex-col gap-6 md:gap-8 animate-fade-in text-brand-text-main">
      
      {/* Page Header */}
      <div className="page-header flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-brand-text-main">CampusX Chain</h1>
          <p className="text-brand-text-muted mt-1 text-sm font-medium">Decentralized credential verification, digital certificate minting, on-chain ledger, and student wallet management.</p>
        </div>
        <div className="flex items-center gap-4 flex-wrap">
          {/* Mode Switcher Buttons */}
          <div className="flex bg-brand-bg-tertiary/60 border border-brand-border rounded-xl p-1 gap-1.5 text-xs font-semibold">
            <Link 
              href="/"
              className="px-3 py-1.5 hover:bg-white/[0.03] text-brand-text-muted hover:text-white rounded-lg transition-all flex items-center gap-1.5"
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span>ERP PORTAL</span>
            </Link>
            <Link 
              href="/connect"
              className="px-3 py-1.5 hover:bg-white/[0.03] text-brand-text-muted hover:text-white rounded-lg transition-all flex items-center gap-1.5"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>CAMPUSX CONNECT</span>
            </Link>
            <Link 
              href="/blockchain?tab=overview"
              className="px-3 py-1.5 bg-brand-primary/20 border border-brand-primary/10 text-brand-text-main rounded-lg flex items-center gap-1.5"
            >
              <svg className="w-3.5 h-3.5 text-brand-primary shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
              <span>CAMPUSX CHAIN</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Network Health Header */}
      <div className="grid grid-cols-2 md:grid-cols-5 bg-brand-bg-secondary border border-brand-border rounded-2xl p-4 gap-4 items-center shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-brand-accent-emerald animate-pulse"></div>
          <div>
            <span className="text-[10px] text-brand-text-subtle font-bold block uppercase font-display">Consortium Network</span>
            <span className="text-xs font-bold text-white">ONLINE</span>
          </div>
        </div>
        <div>
          <span className="text-[10px] text-brand-text-subtle font-bold block uppercase">Chain Height</span>
          <span className="text-xs font-mono font-bold text-white">Block #{blocks.length}</span>
        </div>
        <div>
          <span className="text-[10px] text-brand-text-subtle font-bold block uppercase">Throughput</span>
          <span className="text-xs font-mono font-bold text-white">{tps} Transactions/s</span>
        </div>
        <div>
          <span className="text-[10px] text-brand-text-subtle font-bold block uppercase">Avg Block Time</span>
          <span className="text-xs font-mono font-bold text-white">{blockTime} seconds</span>
        </div>
        <div className="col-span-2 md:col-span-1">
          <span className="text-[10px] text-brand-text-subtle font-bold block uppercase">Optimal Gas Limit</span>
          <span className="text-xs font-mono font-bold text-brand-accent-cyan">{gasPrice} Gwei</span>
        </div>
      </div>

      {/* Main viewport area */}
      <div className="flex-1 flex flex-col min-h-[480px]">
        
        {/* VIEW 1: OVERVIEW DASHBOARD */}
        {activeTab === 'overview' && (
          <div className="flex flex-col gap-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* KPIs */}
              <div className="card p-5 bg-brand-bg-secondary border border-brand-border rounded-2xl flex justify-between items-center">
                <div className="flex flex-col">
                  <span className="text-[10px] text-brand-text-subtle font-bold uppercase tracking-wider">Verifiable Credentials</span>
                  <span className="text-2xl font-bold font-mono text-white mt-1.5">{degreeList.length + credentials.length}</span>
                  <span className="text-[9px] text-brand-accent-emerald mt-1 font-semibold">100% Integrity</span>
                </div>
                <div className="p-3 rounded-xl bg-brand-accent-emerald/10 text-brand-accent-emerald">
                  <Award className="w-5 h-5" />
                </div>
              </div>

              <div className="card p-5 bg-brand-bg-secondary border border-brand-border rounded-2xl flex justify-between items-center">
                <div className="flex flex-col">
                  <span className="text-[10px] text-brand-text-subtle font-bold uppercase tracking-wider">Active Consortium Nodes</span>
                  <span className="text-2xl font-bold font-mono text-white mt-1.5">{activeNodesCount}/8</span>
                  <span className="text-[9px] text-brand-accent-cyan mt-1 font-semibold">All campuses synced</span>
                </div>
                <div className="p-3 rounded-xl bg-brand-accent-cyan/10 text-brand-accent-cyan">
                  <Server className="w-5 h-5" />
                </div>
              </div>

              <div className="card p-5 bg-brand-bg-secondary border border-brand-border rounded-2xl flex justify-between items-center">
                <div className="flex flex-col">
                  <span className="text-[10px] text-brand-text-subtle font-bold uppercase tracking-wider">Provenance Logs</span>
                  <span className="text-2xl font-bold font-mono text-white mt-1.5">{researchRecords.length} Research Hashes</span>
                  <span className="text-[9px] text-brand-accent-amber mt-1 font-semibold">IPFS CIDs verified</span>
                </div>
                <div className="p-3 rounded-xl bg-brand-accent-amber/10 text-brand-accent-amber">
                  <FlaskConical className="w-5 h-5" />
                </div>
              </div>

            </div>

            {/* Realtime activities feeds */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              <div className="card p-6 bg-brand-bg-secondary border border-brand-border rounded-2xl flex flex-col gap-4">
                <span className="font-display text-sm font-bold text-white">Recent Transactions Ledger</span>
                <div className="flex flex-col gap-3 max-h-[300px] overflow-y-auto pr-1">
                  {blocks.slice().reverse().map((b, i) => (
                    <div key={i} className="p-3 border border-brand-border rounded-xl bg-brand-bg-tertiary/60 flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <Activity className="w-4 h-4 text-brand-primary" />
                        <div className="flex flex-col">
                          <span className="text-xs font-semibold text-white">{b.type}</span>
                          <span className="text-[9px] text-brand-text-subtle mt-0.5">{b.data}</span>
                        </div>
                      </div>
                      <div className="text-right flex flex-col">
                        <code className="text-[9px] text-brand-accent-cyan font-mono">{b.hash.slice(0, 14)}...</code>
                        <span className="text-[8px] text-brand-text-subtle mt-0.5">{b.timestamp}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="card p-6 bg-brand-bg-secondary border border-brand-border rounded-2xl flex flex-col gap-4">
                <span className="font-display text-sm font-bold text-white">Verifications Activity Feed</span>
                <div className="flex flex-col gap-3 max-h-[300px] overflow-y-auto pr-1">
                  <div className="p-3 border border-brand-border rounded-xl bg-brand-bg-tertiary/60 flex items-center gap-3">
                    <CheckCircle2 className="w-4 h-4 text-brand-accent-emerald" />
                    <div className="flex-1">
                      <span className="text-xs font-semibold text-white block">Employer Verification Request Verified</span>
                      <span className="text-[9px] text-brand-text-subtle block mt-0.5">Degree hash checked: 0x9320e4da... (Alex Rivera)</span>
                    </div>
                  </div>
                  <div className="p-3 border border-brand-border rounded-xl bg-brand-bg-tertiary/60 flex items-center gap-3">
                    <CheckCircle2 className="w-4 h-4 text-brand-accent-emerald" />
                    <div className="flex-1">
                      <span className="text-xs font-semibold text-white block">SBT Token Lock Status Audit</span>
                      <span className="text-[9px] text-brand-text-subtle block mt-0.5">ERC-5192 degree locks confirm 100% compliance.</span>
                    </div>
                  </div>
                  <div className="p-3 border border-brand-border rounded-xl bg-brand-bg-tertiary/60 flex items-center gap-3">
                    <AlertTriangle className="w-4 h-4 text-brand-accent-ruby" />
                    <div className="flex-1">
                      <span className="text-xs font-semibold text-white block">Consortium Sync Alert</span>
                      <span className="text-[9px] text-brand-text-subtle block mt-0.5">State sync lag identified in secondary campus peer validator. Autoresolved.</span>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* VIEW 2: DEGREE VERIFICATION */}
        {activeTab === 'degree' && (
          <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-8">
            <div className="card p-5 bg-brand-bg-secondary border border-brand-border rounded-2xl flex flex-col gap-4">
              <span className="text-xs font-bold text-brand-text-subtle uppercase tracking-wider pl-1 border-b border-brand-border pb-2">Issue Degree (Registrar)</span>
              <div className="flex flex-col gap-3 text-xs">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] text-brand-text-subtle font-bold">Student Wallet ID</label>
                  <select 
                    value={newDegree.studentId}
                    onChange={(e) => setNewDegree({ ...newDegree, studentId: e.target.value })}
                    className="w-full bg-brand-bg-tertiary border border-brand-border text-xs text-white p-2.5 rounded-xl outline-none"
                  >
                    {students.map(s => <option key={s.id} value={s.id}>{s.name} ({s.id})</option>)}
                  </select>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] text-brand-text-subtle font-bold">Degree Title</label>
                  <input 
                    type="text" 
                    value={newDegree.degreeName}
                    onChange={(e) => setNewDegree({ ...newDegree, degreeName: e.target.value })}
                    className="w-full bg-brand-bg-tertiary border border-brand-border text-xs text-white p-2.5 rounded-xl outline-none"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] text-brand-text-subtle font-bold">Major</label>
                  <input 
                    type="text" 
                    value={newDegree.major}
                    onChange={(e) => setNewDegree({ ...newDegree, major: e.target.value })}
                    className="w-full bg-brand-bg-tertiary border border-brand-border text-xs text-white p-2.5 rounded-xl outline-none"
                  />
                </div>
                <button 
                  onClick={handleIssueDegree}
                  className="btn btn-primary w-full py-3 rounded-xl font-bold cursor-pointer"
                >
                  Issue Verifiable Degree
                </button>
              </div>
            </div>

            <div className="card p-6 bg-brand-bg-secondary border border-brand-border rounded-2xl flex flex-col gap-4">
              <span className="font-display text-sm font-bold text-white">Issued Verifiable Degrees</span>
              <div className="table-container rounded-xl border border-brand-border overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-brand-border bg-brand-bg-primary/40 text-brand-text-subtle font-semibold uppercase">
                      <th className="p-3">Student</th>
                      <th className="p-3">Degree Name</th>
                      <th className="p-3">Major</th>
                      <th className="p-3">Issue Date</th>
                      <th className="p-3">Verification Hash</th>
                      <th className="p-3">Status</th>
                      <th className="p-3 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {degreeList.map((d) => (
                      <tr key={d.id} className="border-b border-brand-border hover:bg-white/[0.01]">
                        <td className="p-3 font-semibold">{d.studentName}</td>
                        <td className="p-3">{d.degreeName}</td>
                        <td className="p-3">{d.major}</td>
                        <td className="p-3 font-mono">{d.date}</td>
                        <td className="p-3"><code className="text-[10px] text-brand-accent-cyan font-mono">{d.hash.slice(0, 18)}...</code></td>
                        <td className="p-3">
                          <span className={`badge text-[9px] px-2 py-0.5 rounded-full font-bold ${
                            d.status === 'VERIFIED' ? 'bg-brand-accent-emerald/10 text-brand-accent-emerald' : 'bg-brand-accent-ruby/10 text-brand-accent-ruby'
                          }`}>
                            {d.status}
                          </span>
                        </td>
                        <td className="p-3 text-center">
                          {d.status === 'VERIFIED' ? (
                            <button 
                              onClick={() => handleRevokeDegree(d.hash)}
                              className="p-1 hover:text-brand-accent-ruby text-brand-text-muted cursor-pointer"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          ) : (
                            <span className="text-[10px] text-brand-text-muted">-</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* VIEW 3: CERTIFICATE VERIFICATION */}
        {activeTab === 'certificate' && (
          <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-8">
            <div className="card p-5 bg-brand-bg-secondary border border-brand-border rounded-2xl flex flex-col gap-4">
              <span className="text-xs font-bold text-brand-text-subtle uppercase tracking-wider pl-1 border-b border-brand-border pb-2">Issue Course Certificate</span>
              <div className="flex flex-col gap-3 text-xs">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] text-brand-text-subtle font-bold">Student Wallet</label>
                  <select 
                    value={newCert.studentId}
                    onChange={(e) => setNewCert({ ...newCert, studentId: e.target.value })}
                    className="w-full bg-brand-bg-tertiary border border-brand-border text-xs text-white p-2.5 rounded-xl outline-none"
                  >
                    {students.map(s => <option key={s.id} value={s.id}>{s.name} ({s.id})</option>)}
                  </select>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] text-brand-text-subtle font-bold">Course Title</label>
                  <input 
                    type="text" 
                    value={newCert.title}
                    onChange={(e) => setNewCert({ ...newCert, title: e.target.value })}
                    className="w-full bg-brand-bg-tertiary border border-brand-border text-xs text-white p-2.5 rounded-xl outline-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] text-brand-text-subtle font-bold">Course Code</label>
                    <input 
                      type="text" 
                      value={newCert.courseCode}
                      onChange={(e) => setNewCert({ ...newCert, courseCode: e.target.value })}
                      className="w-full bg-brand-bg-tertiary border border-brand-border text-xs text-white p-2.5 rounded-xl outline-none"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] text-brand-text-subtle font-bold">Grade</label>
                    <input 
                      type="text" 
                      value={newCert.grade}
                      onChange={(e) => setNewCert({ ...newCert, grade: e.target.value })}
                      className="w-full bg-brand-bg-tertiary border border-brand-border text-xs text-white p-2.5 rounded-xl outline-none"
                    />
                  </div>
                </div>
                <button 
                  onClick={handleIssueCertificate}
                  className="btn btn-primary w-full py-3 rounded-xl font-bold cursor-pointer"
                >
                  Anchor SBT Certificate
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-6">
              
              {/* Verification Search Bar */}
              <div className="card p-6 bg-brand-bg-secondary border border-brand-border rounded-2xl flex flex-col gap-4">
                <span className="font-display text-sm font-bold text-white">Trust Ledger Verification Portal</span>
                <div className="flex gap-3">
                  <div className="flex-1 flex items-center bg-brand-bg-tertiary border border-brand-border rounded-xl px-4 py-2 gap-2">
                    <Search className="w-4 h-4 text-brand-text-subtle" />
                    <input 
                      type="text" 
                      placeholder="Input Certificate Verification Hash or Student ID..." 
                      value={verifyHashQuery}
                      onChange={(e) => setVerifyHashQuery(e.target.value)}
                      className="bg-transparent border-none text-brand-text-main outline-none w-full text-xs"
                    />
                  </div>
                  <button 
                    onClick={handleVerifyQuery}
                    className="p-3.5 bg-brand-primary text-white rounded-xl text-xs font-bold cursor-pointer"
                  >
                    Verify Authenticity
                  </button>
                </div>

                {verificationOutcome && (
                  <div className="mt-4 p-4 rounded-xl border border-brand-border bg-brand-bg-tertiary/60">
                    {verificationOutcome.type === 'NOT_FOUND' ? (
                      <div className="flex items-center gap-2.5 text-brand-accent-ruby font-semibold">
                        <AlertTriangle className="w-5 h-5" />
                        <span>No verifiable record matched. Credential status is non-existent or tampered.</span>
                      </div>
                    ) : (
                      <div className="flex flex-col gap-3">
                        <div className="flex items-center gap-2 text-brand-accent-emerald font-semibold">
                          <CheckCircle2 className="w-5 h-5" />
                          <span>Verification Match Found — Cryptographically Anchored</span>
                        </div>
                        <div className="grid grid-cols-2 gap-3 text-xs text-brand-text-muted">
                          <div>Record Type: <strong className="text-white">{verificationOutcome.type}</strong></div>
                          <div>Student Name: <strong className="text-white">{verificationOutcome.data.studentName}</strong></div>
                          <div>Detail: <strong className="text-white">{verificationOutcome.data.degreeName || verificationOutcome.data.title}</strong></div>
                          <div>Status: <strong className="text-brand-accent-emerald">{verificationOutcome.data.status}</strong></div>
                        </div>
                        <code className="p-2 bg-brand-bg-primary rounded border border-brand-border text-[9px] text-brand-accent-cyan break-all font-mono">HASH: {verificationOutcome.data.hash}</code>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* List */}
              <div className="card p-6 bg-brand-bg-secondary border border-brand-border rounded-2xl flex flex-col gap-4">
                <span className="font-display text-sm font-bold text-white">Issued Course SBTs</span>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {credentials.map((c, i) => (
                    <div key={i} className="p-4 border border-brand-border rounded-xl bg-brand-bg-tertiary/40 flex justify-between items-center">
                      <div className="flex flex-col gap-1 min-w-0">
                        <span className="text-xs font-bold text-white truncate">{c.studentName}</span>
                        <span className="text-[10px] text-brand-text-subtle truncate">{c.title} ({c.grade})</span>
                        <code className="text-[9px] text-brand-accent-cyan font-mono mt-1">{c.hash.slice(0, 24)}...</code>
                      </div>
                      <span className="badge bg-brand-accent-emerald/15 text-brand-accent-emerald text-[9px] font-bold px-2 py-0.5 rounded-full">VERIFIED</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        )}

        {/* VIEW 4: NFT CREDENTIALS */}
        {activeTab === 'nft' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {degreeList.map((d, i) => (
              <div key={i} className="card bg-brand-bg-secondary border border-brand-border rounded-2xl p-5 flex flex-col justify-between h-[280px] relative overflow-hidden group hover:border-brand-primary/40 transition-all">
                {/* Background glow */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-brand-primary/10 rounded-full blur-2xl group-hover:bg-brand-primary/20 transition-all"></div>
                
                <div className="flex justify-between items-start">
                  <div className="p-2.5 bg-brand-primary/10 text-brand-primary rounded-xl">
                    <Award className="w-6 h-6 text-brand-primary" />
                  </div>
                  <div className="flex items-center gap-1 bg-brand-bg-tertiary px-2 py-0.5 rounded border border-brand-border text-[9px] font-bold text-brand-accent-amber uppercase">
                    <Lock className="w-3 h-3 text-brand-accent-amber" />
                    <span>Soulbound SBT</span>
                  </div>
                </div>

                <div className="flex flex-col mt-4">
                  <span className="text-xs text-brand-text-subtle font-bold uppercase tracking-wider">{d.degreeName}</span>
                  <span className="text-lg font-bold text-white mt-1 leading-tight">{d.studentName}</span>
                  <span className="text-xs text-brand-text-muted mt-1">{d.major}</span>
                </div>

                <div className="border-t border-brand-border/40 pt-3 mt-4 flex justify-between items-center text-[10px] text-brand-text-muted">
                  <code className="font-mono text-brand-accent-cyan">{d.hash.slice(0, 16)}...</code>
                  <span>Issued {d.date}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* VIEW 5: ACADEMIC WALLET */}
        {activeTab === 'wallet' && (
          <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8">
            <div className="card p-4 bg-brand-bg-secondary border border-brand-border rounded-2xl flex flex-col gap-3">
              <span className="text-xs font-bold text-brand-text-subtle uppercase tracking-wider pl-1">Wallet Accounts</span>
              <div className="flex flex-col gap-2 max-h-[300px] overflow-y-auto pr-1">
                {students.map(s => (
                  <div 
                    key={s.id}
                    onClick={() => setSelectedWalletUser(s.id)}
                    className={`p-3 border rounded-xl flex items-center justify-between cursor-pointer transition-all ${
                      selectedWalletUser === s.id 
                        ? 'bg-brand-primary/20 border-brand-primary/30' 
                        : 'bg-brand-bg-tertiary/40 border-brand-border hover:bg-white/[0.01]'
                    }`}
                  >
                    <div className="flex flex-col min-w-0">
                      <span className="text-xs font-bold text-white truncate">{s.name}</span>
                      <span className="text-[9px] text-brand-text-subtle truncate mt-0.5">{s.id}</span>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-brand-text-subtle" />
                  </div>
                ))}
              </div>
            </div>

            {/* Wallet details */}
            <div className="card p-6 bg-brand-bg-secondary border border-brand-border rounded-2xl flex flex-col gap-6">
              <div className="flex justify-between items-center border-b border-brand-border pb-4">
                <div className="flex items-center gap-3">
                  <Wallet className="w-6 h-6 text-brand-primary" />
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-white">Student Academic Wallet Portal</span>
                    <span className="text-[10px] text-brand-text-subtle">Decentralized credentials storage</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="badge bg-brand-accent-emerald/20 text-brand-accent-emerald text-[10px] font-bold px-2 py-0.5 rounded-full">Secured by Secure Enclave</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-3">
                  <div className="p-4 bg-brand-bg-tertiary rounded-xl border border-brand-border flex flex-col">
                    <span className="text-[9px] text-brand-text-subtle font-bold uppercase">Public Derivation Address</span>
                    <code className="text-xs text-brand-accent-cyan font-mono break-all mt-1">{derivedAddress}</code>
                  </div>
                  <div className="p-4 bg-brand-bg-tertiary rounded-xl border border-brand-border flex flex-col">
                    <span className="text-[9px] text-brand-text-subtle font-bold uppercase">Mnemonic seed derived status</span>
                    <p className="text-xs text-white mt-1 leading-relaxed italic">"derived using BIP-39 mnemonic seed phrases against HD wallet derivations paths"</p>
                  </div>
                </div>

                <div className="p-4 bg-brand-bg-tertiary rounded-xl border border-brand-border flex flex-col gap-4">
                  <span className="text-[10px] text-brand-text-subtle font-bold uppercase">Credentials List</span>
                  <div className="flex flex-col gap-2 max-h-[160px] overflow-y-auto">
                    {degreeList.filter(d => d.studentId === selectedWalletUser).map((d, idx) => (
                      <div key={idx} className="p-2 border border-brand-border bg-brand-bg-primary/40 rounded flex justify-between items-center text-xs">
                        <span>🎓 {d.degreeName} ({d.major})</span>
                        <span className="text-[9px] text-brand-accent-emerald font-bold">VERIFIED</span>
                      </div>
                    ))}
                    {credentials.filter(c => c.studentId === selectedWalletUser).map((c, idx) => (
                      <div key={idx} className="p-2 border border-brand-border bg-brand-bg-primary/40 rounded flex justify-between items-center text-xs">
                        <span>🏅 {c.title} ({c.grade})</span>
                        <span className="text-[9px] text-brand-accent-emerald font-bold">VERIFIED</span>
                      </div>
                    ))}
                    {degreeList.filter(d => d.studentId === selectedWalletUser).length === 0 && credentials.filter(c => c.studentId === selectedWalletUser).length === 0 && (
                      <span className="text-xs text-brand-text-muted">No verifiable certificates logged inside this wallet yet.</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* VIEW 6: SMART CONTRACTS */}
        {activeTab === 'contracts' && (() => {
          const allSmartContracts = [
            { name: 'Degree Contract', address: '0x3cb4d720a455a1532ffeb9d22ffde46d7db0e21a', status: 'ACTIVE', gas: '2,410,500', version: 'v2.1.0', roles: ['registrar', 'superadmin'] },
            { name: 'Certificate Contract', address: '0x1b790d984d720a45594efa4cbefe46df7db0e21', status: 'ACTIVE', gas: '1,824,000', version: 'v1.0.4', roles: ['registrar', 'superadmin'] },
            { name: 'Transcript Contract', address: '0x5de6a7b58d9e2ba41b088ffd2a81cb9f26e08ba1', status: 'ACTIVE', gas: '1,250,000', version: 'v1.1.2', roles: ['registrar', 'superadmin'] },
            { name: 'Research Approval Contract', address: '0x81cf712d984efc464efb6088ffabce18ff940a01', status: 'ACTIVE', gas: '3,892,100', version: 'v1.2.0', roles: ['dean', 'superadmin'] },
            { name: 'Grant Contract', address: '0x9cda8ff60d8ef459c009d2efc7db0e21bcda8ff2', status: 'ACTIVE', gas: '2,950,000', version: 'v1.0.0', roles: ['dean', 'superadmin'] },
            { name: 'Department Approval Contract', address: '0x43ca7b58d9e2ba41b088ffd2a81cb9f26e08ba11', status: 'ACTIVE', gas: '1,120,000', version: 'v1.0.1', roles: ['hod', 'superadmin'] },
            { name: 'Research Review Contract', address: '0x3cb4d720a455a1532ffeb9d22ffde46d7db0e212', status: 'ACTIVE', gas: '1,740,000', version: 'v1.1.0', roles: ['hod', 'superadmin'] },
            { name: 'Scholarship Contract', address: '0x88f2be58daef271cb0f438da1cf4d88e001f78ea2', status: 'ACTIVE', gas: '2,150,000', version: 'v2.0.1', roles: ['finance_manager', 'superadmin'] },
            { name: 'Funding Contract', address: '0x321f00a52df09a5b32f1ea30cff1a2b0e9a7dfb22', status: 'ACTIVE', gas: '3,100,000', version: 'v1.3.1', roles: ['finance_manager', 'superadmin'] },
            { name: 'Sports Achievement NFT Contract', address: '0x9320e4da2b7a94ef88decf823abf26d7f021e052', status: 'ACTIVE', gas: '1,980,000', version: 'v1.0.2', roles: ['sports_director', 'superadmin'] },
            { name: 'Scholarship NFT Contract', address: '0xe12a78bf60d8ef459c009d2efc7db0e21bcda8ff2', status: 'ACTIVE', gas: '2,320,000', version: 'v1.1.0', roles: ['sports_director', 'superadmin'] },
            { name: 'Research NFT Contract', address: '0xf43ca7b58d9e2ba41b088ffd2a81cb9f26e08ba12', status: 'ACTIVE', gas: '2,490,000', version: 'v2.0.0', roles: ['research_coordinator', 'superadmin'] },
            { name: 'Patent Contract', address: '0x88f2be58daef271cb0f438da1cf4d88e001f78ea33', status: 'ACTIVE', gas: '4,200,000', version: 'v1.0.5', roles: ['research_coordinator', 'superadmin'] }
          ];

          const permittedContracts = allSmartContracts.filter(c => {
            if (currentUser?.role === 'superadmin') return true;
            return c.roles.includes(currentUser?.role);
          });

          return (
            <div className="flex flex-col gap-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="p-4 bg-brand-bg-secondary border border-brand-border rounded-xl flex flex-col">
                  <span className="text-[9px] text-brand-text-subtle font-bold uppercase">Permitted Deployments</span>
                  <span className="text-lg font-bold text-white mt-1 font-mono">{permittedContracts.length} Contracts</span>
                </div>
                <div className="p-4 bg-brand-bg-secondary border border-brand-border rounded-xl flex flex-col">
                  <span className="text-[9px] text-brand-text-subtle font-bold uppercase">System Gas (Avg)</span>
                  <span className="text-lg font-bold text-brand-accent-emerald mt-1 font-mono">42,500 Wei</span>
                </div>
                <div className="p-4 bg-brand-bg-secondary border border-brand-border rounded-xl flex flex-col">
                  <span className="text-[9px] text-brand-text-subtle font-bold uppercase">Contract Checks</span>
                  <span className="text-lg font-bold text-brand-accent-emerald mt-1 font-mono">100% SUCCESS</span>
                </div>
                <div className="p-4 bg-brand-bg-secondary border border-brand-border rounded-xl flex flex-col">
                  <span className="text-[9px] text-brand-text-subtle font-bold uppercase">Ledger Network</span>
                  <span className="text-lg font-bold text-brand-accent-cyan mt-1 font-mono">Polygon Subnet</span>
                </div>
              </div>

              {permittedContracts.length === 0 ? (
                <div className="card p-8 bg-brand-bg-secondary border border-brand-accent-ruby/20 rounded-2xl flex flex-col items-center justify-center text-center gap-4 py-12">
                  <div className="w-12 h-12 rounded-full bg-brand-accent-ruby/10 border border-brand-accent-ruby/20 flex items-center justify-center text-brand-accent-ruby shadow-[0_0_15px_rgba(239,68,68,0.1)]">
                    <Lock className="w-5 h-5" />
                  </div>
                  <span className="font-display font-bold text-base text-white">No Smart Contracts Permitted</span>
                  <p className="text-xs text-brand-text-muted max-w-sm leading-relaxed">
                    Your current role (<strong className="text-brand-accent-ruby font-semibold uppercase">{currentUser?.role || 'Guest'}</strong>) is not granted security clearance to view or interact with any deployed smart contracts on the CampusX Chain validator network.
                  </p>
                </div>
              ) : (
                <div className="card p-6 bg-brand-bg-secondary border border-brand-border rounded-2xl flex flex-col gap-4">
                  <span className="font-display text-sm font-bold text-white">Interactive Smart Contract Ledger</span>
                  <div className="table-container rounded-xl border border-brand-border overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="border-b border-brand-border bg-brand-bg-primary/40 text-brand-text-subtle font-semibold uppercase">
                          <th className="p-3">Contract Name</th>
                          <th className="p-3">On-Chain Address</th>
                          <th className="p-3">Status</th>
                          <th className="p-3">Cumulative Gas Limit</th>
                          <th className="p-3">Version</th>
                        </tr>
                      </thead>
                      <tbody>
                        {permittedContracts.map((c, i) => (
                          <tr key={i} className="border-b border-brand-border hover:bg-white/[0.01]">
                            <td className="p-3 font-semibold">{c.name}</td>
                            <td className="p-3"><code className="text-brand-accent-cyan font-mono">{c.address}</code></td>
                            <td className="p-3"><span className="badge bg-brand-accent-emerald/15 text-brand-accent-emerald text-[9px] px-1.5 py-0.5 rounded font-bold">{c.status}</span></td>
                            <td className="p-3 font-mono">{c.gas}</td>
                            <td className="p-3 font-mono">{c.version}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          );
        })()}

        {/* VIEW 7: RESEARCH LEDGER */}
        {activeTab === 'research' && (
          <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-8">
            <div className="card p-5 bg-brand-bg-secondary border border-brand-border rounded-2xl flex flex-col gap-4">
              <span className="text-xs font-bold text-brand-text-subtle uppercase tracking-wider pl-1 border-b border-brand-border pb-2">Log Research Provenance</span>
              <div className="flex flex-col gap-3 text-xs">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] text-brand-text-subtle font-bold">Paper Title</label>
                  <input 
                    type="text" 
                    value={newResearch.title}
                    onChange={(e) => setNewResearch({ ...newResearch, title: e.target.value })}
                    className="w-full bg-brand-bg-tertiary border border-brand-border text-xs text-white p-2.5 rounded-xl outline-none"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] text-brand-text-subtle font-bold">Lead Researcher</label>
                  <input 
                    type="text" 
                    value={newResearch.leadResearcher}
                    onChange={(e) => setNewResearch({ ...newResearch, leadResearcher: e.target.value })}
                    className="w-full bg-brand-bg-tertiary border border-brand-border text-xs text-white p-2.5 rounded-xl outline-none"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] text-brand-text-subtle font-bold">Abstract</label>
                  <textarea 
                    value={newResearch.abstract}
                    onChange={(e) => setNewResearch({ ...newResearch, abstract: e.target.value })}
                    rows="3"
                    className="w-full bg-brand-bg-tertiary border border-brand-border text-xs text-white p-2.5 rounded-xl outline-none resize-none"
                  />
                </div>
                <button 
                  onClick={handleLogResearch}
                  className="btn btn-primary w-full py-3 rounded-xl font-bold cursor-pointer"
                >
                  Log Research Provenance
                </button>
              </div>
            </div>

            <div className="card p-6 bg-brand-bg-secondary border border-brand-border rounded-2xl flex flex-col gap-4">
              <span className="font-display text-sm font-bold text-white">Registered Research Provenance Records</span>
              <div className="flex flex-col gap-4">
                {researchRecords.map((r, i) => (
                  <div key={i} className="p-4 border border-brand-border rounded-xl bg-brand-bg-tertiary/60 flex flex-col gap-2">
                    <div className="flex justify-between items-start">
                      <h4 className="text-sm font-bold text-white">{r.title}</h4>
                      <span className="badge bg-brand-accent-cyan/15 text-brand-accent-cyan text-[9px] font-bold px-2 py-0.5 rounded-full font-mono">IPFS SECURED</span>
                    </div>
                    <p className="text-xs text-brand-text-muted mt-1 leading-relaxed">{r.abstract}</p>
                    <div className="flex flex-wrap gap-4 mt-2 text-[10px] text-brand-text-subtle border-t border-brand-border/40 pt-2.5">
                      <div>Lead: <strong className="text-white">{r.leadResearcher}</strong></div>
                      <div>CIDs: <code className="text-brand-accent-cyan font-mono">{r.ipfsHash}</code></div>
                      <div>Logged: <span className="font-mono">{r.timestamp}</span></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* VIEW 8: TRANSCRIPT VERIFICATION */}
        {activeTab === 'transcript' && (
          <div className="card p-6 bg-brand-bg-secondary border border-brand-border rounded-2xl flex flex-col gap-4">
            <span className="font-display text-sm font-bold text-white">Student Verifiable Transcripts Grid</span>
            <p className="text-brand-text-muted text-xs">These transcripts represent consolidated academic credits and semester grades verified across Multi-Campus nodes.</p>
            
            <div className="table-container rounded-xl border border-brand-border overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-brand-border bg-brand-bg-primary/40 text-brand-text-subtle font-semibold uppercase">
                    <th className="p-3">Student Name</th>
                    <th className="p-3">Course Code</th>
                    <th className="p-3">Course Title</th>
                    <th className="p-3">Credits</th>
                    <th className="p-3 font-mono">Grade</th>
                    <th className="p-3 font-mono">Validation Proof Hash</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-brand-border hover:bg-white/[0.01]">
                    <td className="p-3 font-semibold">Alex Rivera</td>
                    <td className="p-3 font-mono">CS101</td>
                    <td className="p-3">Intro to Programming</td>
                    <td className="p-3">4 Credits</td>
                    <td className="p-3 font-bold text-brand-accent-emerald">A+</td>
                    <td className="p-3"><code className="text-[10px] text-brand-accent-cyan font-mono">0x88f2be58daef271cb0f438da1cf4d88e001f78ea</code></td>
                  </tr>
                  <tr className="border-b border-brand-border hover:bg-white/[0.01]">
                    <td className="p-3 font-semibold">Zoe Chen</td>
                    <td className="p-3 font-mono">CS202</td>
                    <td className="p-3">Data Structures</td>
                    <td className="p-3">4 Credits</td>
                    <td className="p-3 font-bold text-brand-accent-emerald">A</td>
                    <td className="p-3"><code className="text-[10px] text-brand-accent-cyan font-mono">0x3cb4d720a455a1532ffeb9d22ffde46d7db0e21a</code></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* VIEW 9: DIGITAL IDENTITY */}
        {activeTab === 'identity' && (
          <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-8 font-display">
            <div className="card p-5 bg-brand-bg-secondary border border-brand-border rounded-2xl flex flex-col gap-4 text-xs">
              <span className="text-xs font-bold text-brand-text-subtle uppercase tracking-wider pl-1 border-b border-brand-border pb-2">Identity Keys</span>
              
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] text-brand-text-subtle font-bold">Mnemonic Private Seed</label>
                  <textarea 
                    value={customKeySeed}
                    onChange={(e) => setCustomKeySeed(e.target.value)}
                    rows="3"
                    className="w-full bg-brand-bg-tertiary border border-brand-border text-xs text-white p-2.5 rounded-xl outline-none resize-none font-mono"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] text-brand-text-subtle font-bold">Derived DID Namespace:</span>
                  <code className="text-[10px] text-brand-accent-cyan font-mono mt-1 break-all bg-brand-bg-tertiary/60 p-2.5 rounded border border-brand-border">did:campusx:sol:{derivedAddress}</code>
                </div>
              </div>
            </div>

            <div className="card p-6 bg-brand-bg-secondary border border-brand-border rounded-2xl flex flex-col gap-4">
              <span className="text-sm font-bold text-white">Cryptographic Signature Authenticator</span>
              <p className="text-brand-text-muted text-xs">Sign verification challenge payloads using private key derivation algorithms for zero-trust authorization logins.</p>
              
              <div className="flex flex-col gap-4 text-xs">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] text-brand-text-subtle font-bold">Verification Challenge Payload</label>
                  <input 
                    type="text" 
                    value={signingPayload}
                    onChange={(e) => setSigningPayload(e.target.value)}
                    className="w-full bg-brand-bg-tertiary border border-brand-border text-xs text-white p-2.5 rounded-xl outline-none"
                  />
                </div>
                <button 
                  onClick={handleSignPayload}
                  className="btn btn-primary self-start px-6 py-2.5 rounded-xl font-bold cursor-pointer"
                >
                  Generate Digital Signature
                </button>

                {signatureOutput && (
                  <div className="flex flex-col gap-2 mt-2 bg-brand-bg-tertiary/60 p-4 rounded-xl border border-brand-border">
                    <span className="text-[9px] text-brand-text-subtle font-bold uppercase">Signed Signature Hash (Ed25519)</span>
                    <code className="p-2.5 bg-brand-bg-primary rounded text-[10px] text-brand-accent-emerald font-mono break-all leading-normal">{signatureOutput}</code>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* VIEW 10: DAO GOVERNANCE */}
        {activeTab === 'governance' && (
          <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-8">
            <div className="card p-5 bg-brand-bg-secondary border border-brand-border rounded-2xl flex flex-col gap-4">
              <span className="text-xs font-bold text-brand-text-subtle uppercase tracking-wider pl-1 border-b border-brand-border pb-2">Draft Proposal</span>
              
              <div className="flex flex-col gap-3 text-xs">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] text-brand-text-subtle font-bold">Proposal Description</label>
                  <textarea 
                    value={newProposal.description}
                    onChange={(e) => setNewProposal({ ...newProposal, description: e.target.value })}
                    rows="4"
                    placeholder="Enter initiative description..."
                    className="w-full bg-brand-bg-tertiary border border-brand-border text-xs text-white p-2.5 rounded-xl outline-none resize-none"
                  />
                </div>
                <button 
                  onClick={handleCreateProposal}
                  className="btn btn-primary w-full py-3 rounded-xl font-bold cursor-pointer"
                >
                  Broadcast Proposal Node
                </button>
              </div>
            </div>

            <div className="card p-6 bg-brand-bg-secondary border border-brand-border rounded-2xl flex flex-col gap-4">
              <span className="font-display text-sm font-bold text-white">Active DAO Governance Proposals</span>
              <div className="flex flex-col gap-4">
                {governanceProposals.map((p) => (
                  <div key={p.id} className="p-4 border border-brand-border rounded-xl bg-brand-bg-tertiary/60 flex flex-col gap-3">
                    <div className="flex justify-between items-center">
                      <span className="badge bg-brand-primary/10 text-brand-primary text-[10px] font-bold px-2 py-0.5 rounded font-mono">Proposal #{p.id}</span>
                      <span className={`badge text-[9px] px-2 py-0.5 rounded font-bold ${
                        p.status === 'ACTIVE' ? 'bg-brand-accent-amber/10 text-brand-accent-amber animate-pulse' : 'bg-brand-accent-emerald/10 text-brand-accent-emerald'
                      }`}>{p.status}</span>
                    </div>
                    <p className="text-xs font-semibold text-white leading-relaxed">{p.description}</p>
                    <div className="flex justify-between items-center border-t border-brand-border/40 pt-3 text-xs text-brand-text-subtle">
                      <div className="flex gap-4">
                        <div>Votes For: <strong className="text-brand-accent-emerald font-mono">{p.votesFor}</strong></div>
                        <div>Votes Against: <strong className="text-brand-accent-ruby font-mono">{p.votesAgainst}</strong></div>
                      </div>
                      
                      {p.status === 'ACTIVE' ? (
                        <div className="flex gap-2">
                          <button 
                            onClick={() => handleCastVote(p.id, true, 4)} // Simulating 4 credits = 2 voting power
                            className="px-3 py-1 bg-brand-accent-emerald/20 text-brand-accent-emerald hover:bg-brand-accent-emerald/30 border border-brand-accent-emerald/10 rounded font-semibold cursor-pointer"
                          >
                            Support (2)
                          </button>
                          <button 
                            onClick={() => handleCastVote(p.id, false, 4)}
                            className="px-3 py-1 bg-brand-accent-ruby/20 text-brand-accent-ruby hover:bg-brand-accent-ruby/30 border border-brand-accent-ruby/10 rounded font-semibold cursor-pointer"
                          >
                            Oppose (2)
                          </button>
                        </div>
                      ) : (
                        <span>Voting Ended: {p.endTime}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* VIEW 11: BLOCKCHAIN ANALYTICS */}
        {activeTab === 'analytics' && (
          <div className="flex flex-col gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 bg-brand-bg-secondary border border-brand-border rounded-xl flex flex-col">
                <span className="text-[9px] text-brand-text-subtle font-bold uppercase">Success Rate</span>
                <span className="text-lg font-bold text-brand-accent-emerald mt-1 font-mono">100.00%</span>
              </div>
              <div className="p-4 bg-brand-bg-secondary border border-brand-border rounded-xl flex flex-col">
                <span className="text-[9px] text-brand-text-subtle font-bold uppercase">Average Latency</span>
                <span className="text-lg font-bold text-white mt-1 font-mono">1.18 sec</span>
              </div>
              <div className="p-4 bg-brand-bg-secondary border border-brand-border rounded-xl flex flex-col">
                <span className="text-[9px] text-brand-text-subtle font-bold uppercase">Total Verifications</span>
                <span className="text-lg font-bold text-white mt-1 font-mono">14,824 Lookups</span>
              </div>
              <div className="p-4 bg-brand-bg-secondary border border-brand-border rounded-xl flex flex-col">
                <span className="text-[9px] text-brand-text-subtle font-bold uppercase">Gas Saved (Avg)</span>
                <span className="text-lg font-bold text-brand-accent-cyan mt-1 font-mono">22.4% Optimal</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="card p-6 bg-brand-bg-secondary border border-brand-border rounded-2xl flex flex-col gap-4">
                <span className="font-display text-sm font-bold text-white">Daily Verification Request Frequencies</span>
                <div className="h-[220px] bg-brand-bg-tertiary/40 border border-brand-border rounded-xl flex items-end justify-between p-4 gap-2">
                  {[40, 68, 52, 90, 110, 84, 130].map((h, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                      <div className="bg-brand-primary w-full rounded-t-lg transition-all" style={{ height: `${h}%` }}></div>
                      <span className="text-[9px] text-brand-text-subtle font-mono">Day {i+1}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="card p-6 bg-brand-bg-secondary border border-brand-border rounded-2xl flex flex-col gap-4">
                <span className="font-display text-sm font-bold text-white">Credential Class Distribution</span>
                <div className="flex flex-col gap-3 mt-2 text-xs">
                  <div className="flex flex-col gap-1">
                    <div className="flex justify-between font-semibold">
                      <span>Degrees SBTs</span>
                      <span className="font-mono">42.5%</span>
                    </div>
                    <div className="bg-brand-bg-tertiary h-2 rounded-full overflow-hidden w-full">
                      <div className="bg-brand-primary h-full" style={{ width: '42.5%' }}></div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1">
                    <div className="flex justify-between font-semibold">
                      <span>Course Completion Certificates</span>
                      <span className="font-mono">48.0%</span>
                    </div>
                    <div className="bg-brand-bg-tertiary h-2 rounded-full overflow-hidden w-full">
                      <div className="bg-brand-accent-cyan h-full" style={{ width: '48.0%' }}></div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1">
                    <div className="flex justify-between font-semibold">
                      <span>Research Provenance Hashes</span>
                      <span className="font-mono">9.5%</span>
                    </div>
                    <div className="bg-brand-bg-tertiary h-2 rounded-full overflow-hidden w-full">
                      <div className="bg-brand-accent-amber h-full" style={{ width: '9.5%' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* VIEW 12: NODE MONITORING */}
        {activeTab === 'nodes' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="card p-5 bg-brand-bg-secondary border border-brand-border rounded-2xl flex flex-col gap-3">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-white font-display">Registrar Node 1</span>
                <span className="badge bg-brand-accent-emerald/20 text-brand-accent-emerald text-[9px] px-2 py-0.5 rounded font-bold">ONLINE</span>
              </div>
              <div className="flex flex-col gap-1.5 text-xs text-brand-text-muted mt-2">
                <div>Latency: <span className="font-mono text-white">12ms</span></div>
                <div>Storage: <span className="font-mono text-white">41.8 GB / 100 GB</span></div>
                <div>Peer Counts: <span className="font-mono text-white">7 peers</span></div>
              </div>
            </div>

            <div className="card p-5 bg-brand-bg-secondary border border-brand-border rounded-2xl flex flex-col gap-3">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-white font-display">Faculty Node 2</span>
                <span className="badge bg-brand-accent-emerald/20 text-brand-accent-emerald text-[9px] px-2 py-0.5 rounded font-bold">ONLINE</span>
              </div>
              <div className="flex flex-col gap-1.5 text-xs text-brand-text-muted mt-2">
                <div>Latency: <span className="font-mono text-white">24ms</span></div>
                <div>Storage: <span className="font-mono text-white">18.5 GB / 100 GB</span></div>
                <div>Peer Counts: <span className="font-mono text-white">7 peers</span></div>
              </div>
            </div>

            <div className="card p-5 bg-brand-bg-secondary border border-brand-border rounded-2xl flex flex-col gap-3">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-white font-display">Research Center Node 3</span>
                <span className="badge bg-brand-accent-emerald/20 text-brand-accent-emerald text-[9px] px-2 py-0.5 rounded font-bold">ONLINE</span>
              </div>
              <div className="flex flex-col gap-1.5 text-xs text-brand-text-muted mt-2">
                <div>Latency: <span className="font-mono text-white">16ms</span></div>
                <div>Storage: <span className="font-mono text-white">62.0 GB / 200 GB</span></div>
                <div>Peer Counts: <span className="font-mono text-white">7 peers</span></div>
              </div>
            </div>

            <div className="card p-5 bg-brand-bg-secondary border border-brand-border rounded-2xl flex flex-col gap-3">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-white font-display">Secondary Campus Node 4</span>
                <span className="badge bg-brand-accent-emerald/20 text-brand-accent-emerald text-[9px] px-2 py-0.5 rounded font-bold">ONLINE</span>
              </div>
              <div className="flex flex-col gap-1.5 text-xs text-brand-text-muted mt-2">
                <div>Latency: <span className="font-mono text-white">42ms</span></div>
                <div>Storage: <span className="font-mono text-white">12.1 GB / 100 GB</span></div>
                <div>Peer Counts: <span className="font-mono text-white">7 peers</span></div>
              </div>
            </div>
          </div>
        )}

        {/* VIEW 13: EXPLORER */}
        {activeTab === 'explorer' && (
          <div className="flex flex-col gap-6">
            <div className="card p-6 bg-brand-bg-secondary border border-brand-border rounded-2xl flex flex-col gap-4">
              <span className="font-display text-sm font-bold text-white">CampusX Chain Internal Block Explorer</span>
              <div className="flex gap-3">
                <div className="flex-1 flex items-center bg-brand-bg-tertiary border border-brand-border rounded-xl px-4 py-2 gap-2">
                  <Search className="w-4 h-4 text-brand-text-subtle" />
                  <input 
                    type="text" 
                    placeholder="Search by Block Index or Transaction/Credential Hash..." 
                    value={explorerQuery}
                    onChange={(e) => setExplorerQuery(e.target.value)}
                    className="bg-transparent border-none text-brand-text-main outline-none w-full text-xs"
                  />
                </div>
                <button 
                  onClick={handleExplorerSearch}
                  className="p-3.5 bg-brand-primary text-white rounded-xl text-xs font-bold cursor-pointer"
                >
                  Lookup Blockchain
                </button>
              </div>

              {explorerResult && (
                <div className="mt-4 p-5 rounded-xl border border-brand-border bg-brand-bg-tertiary/60">
                  {explorerResult.type === 'NOT_FOUND' ? (
                    <span className="text-brand-accent-ruby font-semibold text-xs">No matching block or credential transaction located.</span>
                  ) : explorerResult.type === 'BLOCK' ? (
                    <div className="flex flex-col gap-3 text-xs leading-relaxed">
                      <div className="font-semibold text-brand-accent-cyan text-sm">Block #{explorerResult.data.index} Telemetry Data</div>
                      <div>Timestamp: <strong className="text-white font-mono">{explorerResult.data.timestamp}</strong></div>
                      <div>Block Type: <strong className="text-white font-mono">{explorerResult.data.type}</strong></div>
                      <div>Prev State Hash: <code className="text-brand-text-subtle font-mono">{explorerResult.data.prevHash}</code></div>
                      <div>Payload: <pre className="p-3 bg-brand-bg-primary border border-brand-border rounded-lg mt-1 font-mono text-brand-accent-emerald whitespace-pre-wrap">{JSON.stringify(explorerResult.data.data, null, 2)}</pre></div>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-3 text-xs leading-relaxed">
                      <div className="font-semibold text-brand-accent-emerald text-sm">Verifiable Credential Node</div>
                      <div>Student Wallet: <strong className="text-white">{explorerResult.data.studentName} ({explorerResult.data.studentId})</strong></div>
                      <div>Detail Payload: <strong className="text-white">{explorerResult.data.degreeName || explorerResult.data.title}</strong></div>
                      <div>Verification Anchor: <code className="text-brand-accent-cyan font-mono">{explorerResult.data.hash}</code></div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* General Block overview */}
            <div className="card p-6 bg-brand-bg-secondary border border-brand-border rounded-2xl flex flex-col gap-4">
              <span className="font-display text-sm font-bold text-white">Block Logs History</span>
              <div className="table-container rounded-xl border border-brand-border overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-brand-border bg-brand-bg-primary/40 text-brand-text-subtle font-semibold uppercase">
                      <th className="p-3">Block Index</th>
                      <th className="p-3">Timestamp</th>
                      <th className="p-3 font-mono">Previous Root Hash</th>
                      <th className="p-3 font-mono">Current State Hash</th>
                      <th className="p-3">Payload Descriptor</th>
                    </tr>
                  </thead>
                  <tbody>
                    {blocks.slice().reverse().map((b) => (
                      <tr key={b.index} className="border-b border-brand-border hover:bg-white/[0.01]">
                        <td className="p-3 font-bold text-brand-primary font-mono">#{b.index}</td>
                        <td className="p-3 font-mono">{b.timestamp}</td>
                        <td className="p-3 font-mono text-brand-text-muted">{b.prevHash.slice(0, 18)}...</td>
                        <td className="p-3 font-mono text-brand-accent-cyan">{b.hash.slice(0, 18)}...</td>
                        <td className="p-3 truncate max-w-[200px]">{b.type} ({b.data})</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* VIEW 14: BLOCKCHAIN SETTINGS */}
        {activeTab === 'settings' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="card p-6 bg-brand-bg-secondary border border-brand-border rounded-2xl flex flex-col gap-4">
              <span className="text-sm font-bold text-white font-display">Multi-Sig Administrators Desk</span>
              <p className="text-brand-text-muted text-xs">Master actions and key rotations require 3-of-5 administrator wallet confirmation signs.</p>
              
              <div className="flex flex-col gap-2.5 text-xs text-brand-text-main mt-1">
                <div className="p-2 border border-brand-border rounded-lg bg-brand-bg-tertiary/60 flex justify-between">
                  <span>Trustee Member Wallet 1</span>
                  <code className="text-brand-accent-cyan font-mono">0x71c...a01f</code>
                </div>
                <div className="p-2 border border-brand-border rounded-lg bg-brand-bg-tertiary/60 flex justify-between">
                  <span>University Registrar Dean</span>
                  <code className="text-brand-accent-cyan font-mono">0x1b7...d21a</code>
                </div>
                <div className="p-2 border border-brand-border rounded-lg bg-brand-bg-tertiary/60 flex justify-between">
                  <span>IT Operations Lead Admin</span>
                  <code className="text-brand-accent-cyan font-mono">0x3cb...7db0</code>
                </div>
              </div>
            </div>

            <div className="card p-6 bg-brand-bg-secondary border border-brand-border rounded-2xl flex flex-col gap-4">
              <span className="text-sm font-bold text-white font-display">Ledger Config Rules</span>
              
              <div className="flex flex-col gap-3 text-xs">
                <div className="flex justify-between items-center">
                  <span>Enable Zero-Trust Identity Auth Check:</span>
                  <span className="text-brand-accent-emerald font-semibold">ENABLED</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Consortium Consensus Scheme:</span>
                  <span className="font-mono text-white">Raft-Sync</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>IPFS Pinning provider service:</span>
                  <span className="font-mono text-white">Pinata Gateway</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Public anchor interval period:</span>
                  <span className="font-mono text-white">Every 3600 sec</span>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default function BlockchainPage() {
  return (
    <Suspense fallback={<div className="text-white text-center py-10">Loading Blockchain Console...</div>}>
      <BlockchainPageContent />
    </Suspense>
  );
}


