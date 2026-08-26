'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Globe, 
  Wallet, 
  Fingerprint, 
  User, 
  Sparkles, 
  Users, 
  Coins, 
  Activity, 
  Layers, 
  TrendingUp, 
  ShoppingBag, 
  Code, 
  Cpu, 
  Database, 
  ShieldAlert, 
  Search, 
  Plus, 
  ArrowRight, 
  CheckCircle2, 
  AlertTriangle, 
  LogOut, 
  Menu,
  ShieldCheck,
  Compass,
  ArrowUpRight,
  HardDrive,
  Check,
  HelpCircle,
  LayoutGrid,
  ChevronRight,
  Lock,
  Unlock,
  RefreshCw,
  Send,
  Download,
  Award,
  FileText,
  Briefcase,
  BookOpen,
  Key,
  Landmark,
  Percent,
  Shield,
  History,
  Settings as SettingsIcon,
  LineChart
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDb, DbProvider } from '../../context/db-context';
import './web3.css';

// Custom theme color mappings
const bgDark = '#071126';
const surfaceDark = '#0B1736';
const cardDark = '#102043';
const primaryColor = '#6366F1';
const successColor = '#22C55E';
const warningColor = '#F59E0B';
const dangerColor = '#EF4444';

function Web3PageContent() {
  const { students } = useDb();

  // Navigation states
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedNetwork, setSelectedNetwork] = useState('Polygon'); // Ethereum, Polygon, Base, Arbitrum, Optimism
  const [isConnected, setIsConnected] = useState(true);
  const [connectedAddress, setConnectedAddress] = useState('0x6366f1fc9a7d21a221befdb881e3a9c7db0e21a');
  
  // BIP-39 & Identity Enclave States
  const [mnemonicPhrase, setMnemonicPhrase] = useState('campusx mnemonic private seed phrase academic trust credentials key secure system');
  const [derivedKey, setDerivedKey] = useState('0x9d2efc7db0e21bcda8ff9320e4da2b7a94ef88decf823abf26d7f021e05a');
  const [clearanceRole, setClearanceRole] = useState('Registrar'); // Super Admin, Registrar, Dean, Faculty, Student

  // Simulated Telemetry (Fluctuating counters)
  const [blocksHeight, setBlocksHeight] = useState(104828);
  const [gasPrice, setGasPrice] = useState(15);
  const [tpsRate, setTpsRate] = useState(14);
  const [treasuryBalance, setTreasuryBalance] = useState(4500.00);

  // SBT & Credentials Registries
  const [sbtCertificates, setSbtCertificates] = useState([
    { id: 'SBT-8891', studentId: 'STU001', recipient: 'Alex Rivera', title: 'Dean\'s Honour List', type: 'Degree NFT', hash: '0x9320e4da2b7a94ef88decf823abf26d7f021e05a', date: '2026-05-15', status: 'VERIFIED' },
    { id: 'SBT-9042', studentId: 'STU002', recipient: 'Zoe Chen', title: 'Data Structures A+', type: 'Certificate NFT', hash: '0xf43ca7b58d9e2ba41b088ffd2a81cb9f26e08ba1', date: '2026-05-20', status: 'VERIFIED' },
    { id: 'SBT-9112', studentId: 'STU006', recipient: 'Sophia Patel', title: 'PhD AI Fellowship', type: 'Research NFT', hash: '0xe12a78bf60d8ef459c009d2efc7db0e21bcda8ff', date: '2026-06-01', status: 'VERIFIED' }
  ]);

  // Token Hub state
  const [tokenBalances, setTokenBalances] = useState([
    { symbol: 'ACAD', name: 'Academic Token', balance: 1250, type: 'Utility', desc: 'Used for course materials & library allocations' },
    { symbol: 'REWD', name: 'Reward Token', balance: 420, type: 'Reward', desc: 'Issued for campus leadership actions' },
    { symbol: 'RES', name: 'Research Token', balance: 85, type: 'IP Funding', desc: 'Enables access to restricted AI catalogs' },
    { symbol: 'INNV', name: 'Innovation Token', balance: 310, type: 'Patent Share', desc: 'Earned through verified project subnets' },
    { symbol: 'REP', name: 'Reputation Token (SBT)', balance: 750, type: 'Soulbound Weight', desc: 'Determines consensus proposal voting weight' },
    { symbol: 'COMM', name: 'Community Token', balance: 980, type: 'Governance', desc: 'Powers campus council votes' }
  ]);

  // IPFS Patent Marketplace
  const [marketplaceItems, setMarketplaceItems] = useState([
    { id: 1, title: 'Zero-Knowledge Proofs for Verifiable Grade Reports', author: 'Dr. Evelyn Carter', type: 'Patent Licence', price: 2.5, bid: 1.8, hash: 'QmYwAPJjh34dHnKpeP1GvD22xJ8Pq5n9' },
    { id: 2, title: 'Federated Ledger Nodes on Energy Constrained IoT Platforms', author: 'Prof. Marcus Vance', type: 'Research Asset', price: 1.2, bid: 0.9, hash: 'QmRz1aB5dfg817cffb022aa29910dffeab01cf4bda' },
    { id: 3, title: 'Privacy Preserving Multi-Tenant Registrar Systems', author: 'Zoe Chen', type: 'Collaboration Code', price: 0.8, bid: 0.5, hash: 'QmXb9aF7dfg127cffb022aa29910dffeab01cf4bda' }
  ]);

  // DAO Governance Proposals
  const [daoProposals, setDaoProposals] = useState([
    { id: 'DAO-01', title: 'Allocate 15 ETH for Blockchain Hackathon Grants Pool', status: 'ACTIVE', category: 'Research', votesFor: 232, votesAgainst: 12, creator: 'Dr. Evelyn Carter', endBlock: 104899 },
    { id: 'DAO-02', title: 'Upgrade soulbound credential contract gas compiler target', status: 'PASSED', category: 'Infrastructure', votesFor: 180, votesAgainst: 4, creator: 'Registrar Node 1', endBlock: 104812 },
    { id: 'DAO-03', title: 'Establish Student-Led Innovation Fund for VR Lab Development', status: 'ACTIVE', category: 'Student', votesFor: 95, votesAgainst: 78, creator: 'Alex Rivera', endBlock: 105200 }
  ]);

  // Smart Contracts catalogue
  const [contractRoster, setContractRoster] = useState([
    { name: 'DegreeRegistry.sol', address: '0x1b790d984d720a45594efa4cbefe46df7db0e21', status: 'ACTIVE', compiler: 'v0.8.20', gas: '1,824,000', audit: 'SECURE' },
    { name: 'ResearchEscrow.sol', address: '0x3cb4d720a455a1532ffeb9d22ffde46d7db0e21a', status: 'ACTIVE', compiler: 'v0.8.20', gas: '2,410,500', audit: 'SECURE' },
    { name: 'ScholarshipPool.sol', address: '0x81cf712d984efc464efb6088ffabce18ff940a01', status: 'ACTIVE', compiler: 'v0.8.24', gas: '3,112,000', audit: 'SECURE' },
    { name: 'ConsensusDAO.sol', address: '0x71c5db0200871dccf438da1cf4d88e001f78ea', status: 'ACTIVE', compiler: 'v0.8.24', gas: '4,502,300', audit: 'SECURE' }
  ]);

  // Transaction history ledger logs
  const [transactions, setTransactions] = useState([
    { tx: '0x88f2be58daef271cb0f438da1cf4d88e001f78ea', type: 'MINT_SBT_DEGREE', status: 'Success', gas: '45,200', block: 104825, date: 'Just now' },
    { tx: '0x321f00a52df09a5b32f1ea30cff1a2b0e9a7dfb2', type: 'DAO_QUAD_VOTE', status: 'Success', gas: '21,000', block: 104819, date: '10 mins ago' },
    { tx: '0x71c5db0200871dccf438da1cf4d88e001f78ea', type: 'DEPLOY_CONTRACT', status: 'Success', gas: '1,824,000', block: 104790, date: '1 hour ago' },
    { tx: '0xf43ca7b58d9e2ba41b088ffd2a81cb9f26e08ba1', type: 'STAKE_REP_TOKENS', status: 'Success', gas: '68,400', block: 104750, date: '4 hours ago' }
  ]);

  // Form State parameters
  const [explorerQuery, setExplorerQuery] = useState('');
  const [explorerResult, setExplorerResult] = useState(null);
  const [newSbtRecipient, setNewSbtRecipient] = useState('STU001');
  const [newSbtTitle, setNewSbtTitle] = useState('');
  const [newSbtType, setNewSbtType] = useState('Degree NFT');
  
  const [newProposalText, setNewProposalText] = useState('');
  const [newProposalCategory, setNewProposalCategory] = useState('Research');

  const [patentTitle, setPatentTitle] = useState('');
  const [patentPrice, setPatentPrice] = useState('');
  const [patentAuthor, setPatentAuthor] = useState('');
  
  const [stakeAmount, setStakeAmount] = useState('');
  const [stakedBalance, setStakedBalance] = useState(250);

  const [vaultPassword, setVaultPassword] = useState('');
  const [vaultUnlocked, setVaultUnlocked] = useState(false);

  const [mintTokenSymbol, setMintTokenSymbol] = useState('ACAD');
  const [mintTokenAmount, setMintTokenAmount] = useState('');

  // Simulated Web3 Node live changes
  useEffect(() => {
    const interval = setInterval(() => {
      setBlocksHeight(prev => prev + 1);
      setGasPrice(Math.round(12 + Math.random() * 6));
      setTpsRate(Math.round(10 + Math.random() * 8));
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  const handleWalletConnect = () => {
    if (isConnected) {
      setIsConnected(false);
      setConnectedAddress('');
    } else {
      setIsConnected(true);
      setConnectedAddress('0x6366f1fc9a7d21a221befdb881e3a9c7db0e21a');
    }
  };

  // Action: Issue verifiable SBT credential
  const handleMintSbt = () => {
    if (!newSbtTitle) {
      alert('Please fill in the credential title.');
      return;
    }
    const studentObj = students?.find(s => s.id === newSbtRecipient) || { name: 'Demo Student' };
    const certHash = '0x' + Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
    const newCert = {
      id: 'SBT-' + Math.floor(1000 + Math.random() * 9000),
      studentId: newSbtRecipient,
      recipient: studentObj.name,
      title: newSbtTitle,
      type: newSbtType,
      hash: certHash,
      date: new Date().toISOString().split('T')[0],
      status: 'VERIFIED'
    };

    setSbtCertificates([newCert, ...sbtCertificates]);
    
    // Log tx block
    setTransactions([{
      tx: certHash,
      type: 'MINT_SBT_' + newSbtType.toUpperCase().replace(' ', '_'),
      status: 'Success',
      gas: '45,200',
      block: blocksHeight + 1,
      date: 'Just now'
    }, ...transactions]);

    setNewSbtTitle('');
    alert(`Verifiable SBT degree token successfully minted onto ${selectedNetwork} consortium subnet!`);
  };

  // Action: Cast DAO quadratically weighted votes
  const handleDaoVote = (propId, support) => {
    setDaoProposals(daoProposals.map(p => {
      if (p.id === propId) {
        // Quadratic weight formulation based on REP token balance
        const repToken = tokenBalances.find(tok => tok.symbol === 'REP');
        const votingPower = repToken ? Math.floor(Math.sqrt(repToken.balance)) : 10;
        return {
          ...p,
          votesFor: support ? p.votesFor + votingPower : p.votesFor,
          votesAgainst: !support ? p.votesAgainst + votingPower : p.votesAgainst
        };
      }
      return p;
    }));
    alert(`Quadratically signed governance block confirming vote choice.`);
  };

  // Action: Broadcast DAO Proposal
  const handleCreateProposal = () => {
    if (!newProposalText.trim()) return;
    const newProp = {
      id: 'DAO-' + (daoProposals.length + 1).toString().padStart(2, '0'),
      title: newProposalText,
      status: 'ACTIVE',
      category: newProposalCategory,
      votesFor: 0,
      votesAgainst: 0,
      creator: 'Registrar Node 1',
      endBlock: blocksHeight + 4000
    };
    setDaoProposals([newProp, ...daoProposals]);
    setNewProposalText('');
    alert('Decentralized consensus proposal successfully broadcasted onto network nodes.');
  };

  // Action: List patent in marketplace
  const handleListPatent = () => {
    if (!patentTitle || !patentPrice) return;
    const itemHash = 'Qm' + Array.from({ length: 44 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
    const newItem = {
      id: marketplaceItems.length + 1,
      title: patentTitle,
      author: patentAuthor || 'Principal Researcher',
      type: 'Patent Licence',
      price: parseFloat(patentPrice),
      bid: 0,
      hash: itemHash
    };
    setMarketplaceItems([newItem, ...marketplaceItems]);
    setPatentTitle('');
    setPatentPrice('');
    setPatentAuthor('');
    alert(`Patent intellectual property listed on decentralized IPFS network.`);
  };

  // Action: Bid on marketplace item
  const handlePlaceBid = (id, bidAmount) => {
    setMarketplaceItems(marketplaceItems.map(item => {
      if (item.id === id) {
        return { ...item, bid: parseFloat(bidAmount) };
      }
      return item;
    }));
    alert(`Bidding signature linked to consensus mempool.`);
  };

  // Action: Stake tokens
  const handleStake = () => {
    const amt = parseFloat(stakeAmount);
    if (!amt || isNaN(amt)) return;
    setStakedBalance(prev => prev + amt);
    
    // Deduct from Reputation Token
    setTokenBalances(tokenBalances.map(t => {
      if (t.symbol === 'REP') {
        return { ...t, balance: t.balance - amt };
      }
      return t;
    }));

    setStakeAmount('');
    alert(`Staked ${amt} REP tokens into Validator consensus nodes pool.`);
  };

  // Action: Mint/Collect utility tokens
  const handleMintTokens = () => {
    const amt = parseFloat(mintTokenAmount);
    if (!amt || isNaN(amt)) return;

    setTokenBalances(tokenBalances.map(t => {
      if (t.symbol === mintTokenSymbol) {
        return { ...t, balance: t.balance + amt };
      }
      return t;
    }));

    setMintTokenAmount('');
    alert(`Minted ${amt} ${mintTokenSymbol} tokens into connected secure wallet.`);
  };

  // Action: Block lookup in Explorer
  const handleExplorerLookup = () => {
    const query = explorerQuery.toLowerCase().trim();
    if (!query) return;

    const sbtMatch = sbtCertificates.find(c => c.hash.toLowerCase() === query || c.studentId.toLowerCase() === query || c.id.toLowerCase() === query);
    const txMatch = transactions.find(t => t.tx.toLowerCase().includes(query));
    const contractMatch = contractRoster.find(c => c.address.toLowerCase() === query || c.name.toLowerCase().includes(query));

    if (sbtMatch) {
      setExplorerResult({ type: 'SOULBOUND_CREDENTIAL', data: sbtMatch });
    } else if (txMatch) {
      setExplorerResult({ type: 'TRANSACTION', data: txMatch });
    } else if (contractMatch) {
      setExplorerResult({ type: 'SMART_CONTRACT', data: contractMatch });
    } else {
      setExplorerResult({ type: 'NOT_FOUND' });
    }
  };

  // Action: Unlock Credential Vault
  const handleUnlockVault = () => {
    if (vaultPassword === 'secure123') {
      setVaultUnlocked(true);
    } else {
      alert('Invalid secure vault password key.');
    }
  };

  const renderActiveViewport = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="flex flex-col gap-6">
            {/* Overview KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { label: 'Connected Account Address', val: isConnected ? connectedAddress.substring(0, 18) + '...' : 'Disconnected', note: 'Secure Enclave Auth', color: 'text-indigo-400' },
                { label: 'Academic Certificates (SBT)', val: sbtCertificates.length, note: 'Soulbound Non-transferable', color: 'text-cyan-400' },
                { label: 'Consortium Treasury Balance', val: `${treasuryBalance} ETH`, note: 'Multi-sig locked pool', color: 'text-emerald-400' }
              ].map((k, i) => (
                <div key={i} className="glass-card p-5 text-left">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">{k.label}</span>
                  <span className="text-xl font-extrabold font-mono text-white mt-2 block">{k.val}</span>
                  <span className="text-[9px] text-slate-400 font-semibold mt-1 block">{k.note}</span>
                </div>
              ))}
            </div>

            {/* Smart contracts / Live feeds */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 text-left">
              
              {/* Transactions log */}
              <div className="glass-card p-6 flex flex-col gap-4">
                <span className="text-xs font-bold text-white uppercase tracking-wider font-mono border-b border-white/5 pb-2">Consortium Blockchain Tx Registry</span>
                <div className="flex flex-col gap-3 max-h-[300px] overflow-y-auto pr-1 web3-scroll">
                  {transactions.map((tx, idx) => (
                    <div key={idx} className="p-3 bg-black/20 border border-white/5 rounded-xl flex items-center justify-between text-xs font-mono">
                      <div>
                        <p className="font-bold text-slate-200">{tx.type}</p>
                        <span className="text-[9px] text-slate-500">Block #{tx.block} • {tx.date}</span>
                      </div>
                      <div className="text-right">
                        <code className="text-[10px] text-cyan-400">{tx.tx.substring(0, 16)}...</code>
                        <span className="text-[8px] text-emerald-400 block mt-0.5">Gas: {tx.gas} Gwei</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Active contracts */}
              <div className="glass-card p-6 flex flex-col gap-4">
                <span className="text-xs font-bold text-white uppercase tracking-wider font-mono border-b border-white/5 pb-2">Active Smart Contracts Catalogue</span>
                <div className="flex flex-col gap-3">
                  {contractRoster.map((con, idx) => (
                    <div key={idx} className="p-3 bg-black/20 border border-white/5 rounded-xl flex justify-between items-center text-xs">
                      <div className="min-w-0">
                        <h4 className="font-bold text-white truncate">{con.name}</h4>
                        <code className="text-[9px] text-slate-500 font-mono truncate block mt-0.5">{con.address}</code>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[8px] font-bold rounded">
                          {con.audit}
                        </span>
                        <span className="px-2 py-0.5 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-[8px] font-bold rounded">
                          {con.compiler}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        );

      case 'wallet':
        return (
          <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-6 text-left">
            <div className="glass-card p-5 flex flex-col gap-4">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest border-b border-white/5 pb-2 font-mono">Academic Wallet Manager</span>
              
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-1 text-xs">
                  <span className="text-[9px] text-slate-400 font-bold uppercase font-mono">Derivation Public Address</span>
                  <code className="text-[10px] text-cyan-400 font-mono bg-black/30 p-2.5 rounded border border-white/5 mt-1 break-all select-all">
                    {isConnected ? connectedAddress : 'No wallet connected'}
                  </code>
                </div>

                <div className="flex flex-col gap-1 text-xs">
                  <span className="text-[9px] text-slate-400 font-bold uppercase font-mono">Consortium Subnet Network</span>
                  <select 
                    value={selectedNetwork}
                    onChange={(e) => setSelectedNetwork(e.target.value)}
                    className="select-dark mt-1"
                  >
                    {['Polygon', 'Ethereum', 'Base', 'Arbitrum', 'Optimism'].map(net => (
                      <option key={net} value={net}>{net}</option>
                    ))}
                  </select>
                </div>

                <button 
                  onClick={handleWalletConnect}
                  className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    isConnected ? 'bg-rose-500/20 border border-rose-500/30 text-rose-400 hover:bg-rose-500/30' : 'bg-[#6366F1] text-white hover:brightness-110'
                  }`}
                >
                  {isConnected ? 'Disconnect Wallet' : 'Connect Wallet'}
                </button>
              </div>
            </div>

            <div className="glass-card p-6 flex flex-col gap-4">
              <span className="text-xs font-bold text-white uppercase tracking-wider font-mono border-b border-white/5 pb-2">Academic Token Allocations</span>
              
              {isConnected ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {tokenBalances.map((tok, idx) => (
                    <div key={idx} className="p-4 bg-black/20 border border-white/5 rounded-xl flex justify-between items-center">
                      <div className="text-left min-w-0 pr-2">
                        <p className="font-bold text-white">{tok.name} ({tok.symbol})</p>
                        <p className="text-[9px] text-slate-500 mt-1 leading-normal truncate">{tok.desc}</p>
                      </div>
                      <span className="font-mono text-cyan-400 font-bold shrink-0 pl-2 text-sm">{tok.balance}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <span className="text-xs text-slate-500 italic">Please connect your academic wallet to retrieve token metrics.</span>
              )}
            </div>
          </div>
        );

      case 'identity':
        return (
          <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-6 text-left">
            <div className="glass-card p-5 flex flex-col gap-4">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest border-b border-white/5 pb-2 font-mono">DID Identity Creator</span>
              <div className="flex flex-col gap-3 text-xs">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] text-slate-400 font-bold uppercase">Target Authorization Role</label>
                  <select 
                    value={clearanceRole}
                    onChange={(e) => setClearanceRole(e.target.value)}
                    className="select-dark"
                  >
                    {['Super Admin', 'Registrar', 'Dean', 'Faculty', 'Student', 'Alumni', 'Employer'].map(r => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] text-slate-400 font-bold uppercase">BIP-39 Mnemonic Seed</label>
                  <textarea 
                    value={mnemonicPhrase}
                    onChange={(e) => setMnemonicPhrase(e.target.value)}
                    rows="3"
                    className="w-full bg-[#102043] border border-white/5 p-2 rounded-xl text-white outline-none resize-none font-mono text-[10px]"
                  />
                </div>

                <button 
                  onClick={() => {
                    const r = '0x' + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
                    setDerivedKey(r);
                    alert(`Private key derived securely from mnemonic!`);
                  }}
                  className="w-full py-2.5 bg-brand-primary text-white rounded-xl text-xs font-bold hover:brightness-110 cursor-pointer"
                >
                  Generate DID & Key
                </button>
              </div>
            </div>

            <div className="glass-card p-6 flex flex-col gap-4">
              <span className="text-xs font-bold text-white uppercase tracking-wider font-mono border-b border-white/5 pb-2">Active Verifiable Credentials (DID Framework)</span>
              <div className="flex flex-col gap-4">
                {[
                  { role: 'Student Identity', did: 'did:campusx:edu:student:STU001', verified: true, date: '2026-01-05' },
                  { role: 'Faculty Identity', did: 'did:campusx:edu:faculty:FAC042', verified: true, date: '2026-02-12' },
                  { role: 'Research Identity', did: 'did:campusx:edu:research:RES882', verified: true, date: '2026-03-24' },
                  { role: 'Alumni Identity', did: 'did:campusx:edu:alumni:ALU902', verified: false, date: 'N/A' },
                  { role: 'Employer Identity', did: 'did:campusx:edu:employer:EMP112', verified: false, date: 'N/A' }
                ].map((idCard, i) => (
                  <div key={i} className="p-4 bg-black/20 border border-white/5 rounded-xl flex items-center justify-between text-xs font-mono">
                    <div>
                      <p className="font-bold text-white font-sans">{idCard.role}</p>
                      <code className="text-[10px] text-slate-400 mt-1 block">{idCard.did}</code>
                    </div>
                    <div className="text-right">
                      {idCard.verified ? (
                        <span className="px-2.5 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[8px] font-bold rounded">
                          VERIFIED
                        </span>
                      ) : (
                        <span className="px-2.5 py-0.5 bg-rose-500/10 text-rose-400 border border-rose-500/20 text-[8px] font-bold rounded">
                          UNSYNCED
                        </span>
                      )}
                      <span className="block text-[8px] text-slate-500 mt-1">Issued: {idCard.date}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'profiles':
        return (
          <div className="glass-card p-6 flex flex-col gap-5 text-left">
            <div className="border-b border-white/5 pb-3 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">CampusX Connect Synced Profile Preview</h3>
                <p className="text-[10px] text-slate-500 mt-0.5 font-sans">This preview represents the credentials display on the CAMPUSX CONNECT social network.</p>
              </div>
              <span className="px-2.5 py-0.5 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-[8px] font-bold rounded">CONNECT INTEGRATION: LIVE</span>
            </div>

            <div className="flex flex-col md:flex-row gap-6 items-start">
              {/* Profile Card */}
              <div className="p-5 bg-black/20 border border-white/5 rounded-2xl w-full md:w-64 flex flex-col items-center text-center gap-3">
                <div className="w-16 h-16 rounded-full bg-slate-700 flex items-center justify-center border border-white/10 font-bold text-xl text-white">
                  AN
                </div>
                <div>
                  <h4 className="text-sm font-extrabold text-white">Aria Nakamura</h4>
                  <p className="text-[9px] text-slate-400 mt-0.5">Student Delegate • CS Department</p>
                </div>

                <div className="w-full border-t border-white/5 pt-3 flex flex-col gap-2 text-[10px] text-left">
                  <p className="flex justify-between">Academic Reputation: <strong className="text-emerald-400">750 credits</strong></p>
                  <p className="flex justify-between">NFT Badges Showcased: <strong className="text-indigo-400">3 verified</strong></p>
                  <p className="flex justify-between">Wallet Sync Address: <strong className="text-slate-300 font-mono">0x6366...d21a</strong></p>
                </div>
              </div>

              {/* Showcase badges grid */}
              <div className="flex-1 flex flex-col gap-3 w-full">
                <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest font-mono">Showcased NFT Credentials (3)</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {sbtCertificates.map((cert) => (
                    <div key={cert.id} className="p-4 bg-[#102043]/50 border border-white/5 rounded-xl text-xs flex flex-col gap-2 justify-between h-[130px]">
                      <div className="p-1.5 bg-indigo-500/10 text-indigo-400 rounded-lg w-fit">
                        <Sparkles className="w-4.5 h-4.5" />
                      </div>
                      <div className="text-left">
                        <p className="font-bold text-white leading-snug">{cert.title}</p>
                        <p className="text-[9px] text-slate-500 mt-0.5 leading-normal">{cert.type}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case 'nft':
        return (
          <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-6 text-left">
            <div className="glass-card p-5 flex flex-col gap-4">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest border-b border-white/5 pb-2 font-mono">Mint SBT Degree / Badge</span>
              <div className="flex flex-col gap-3 text-xs">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] text-slate-400 font-bold uppercase">Recipient Student</label>
                  <select 
                    value={newSbtRecipient}
                    onChange={(e) => setNewSbtRecipient(e.target.value)}
                    className="select-dark"
                  >
                    {students?.map(s => (
                      <option key={s.id} value={s.id}>{s.name} ({s.id})</option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] text-slate-400 font-bold uppercase">Credential Name</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Master of Computer Science" 
                    value={newSbtTitle}
                    onChange={(e) => setNewSbtTitle(e.target.value)}
                    className="w-full bg-[#102043] border border-white/5 p-2 rounded-xl text-white outline-none"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] text-slate-400 font-bold uppercase">Asset Type</label>
                  <select 
                    value={newSbtType}
                    onChange={(e) => setNewSbtType(e.target.value)}
                    className="select-dark"
                  >
                    {['Degree NFT', 'Certificate NFT', 'Research NFT', 'Achievement NFT', 'Event NFT', 'Soulbound Token'].map(t => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>

                <button 
                  onClick={handleMintSbt}
                  className="w-full py-2.5 bg-brand-primary text-white rounded-xl text-xs font-bold hover:brightness-110 cursor-pointer shadow-md"
                >
                  Mint Soulbound SBT
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-6">
              {/* NFT list */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {sbtCertificates.map((cert) => (
                  <div key={cert.id} className="glass-card p-5 relative overflow-hidden flex flex-col justify-between h-[190px]">
                    <div className="flex justify-between items-start">
                      <div className="p-2 bg-indigo-500/10 text-indigo-400 rounded-xl">
                        <Award className="w-5 h-5" />
                      </div>
                      <span className="badge-web3 badge-success">SOULBOUND</span>
                    </div>

                    <div className="mt-2">
                      <span className="text-[9px] text-slate-500 uppercase tracking-widest font-mono block">{cert.type}</span>
                      <h4 className="text-sm font-extrabold text-white leading-tight mt-1">{cert.recipient}</h4>
                      <p className="text-xs text-indigo-400 font-semibold mt-0.5">{cert.title}</p>
                    </div>

                    <div className="border-t border-white/5 pt-2 mt-3 flex justify-between items-center text-[9px] text-slate-500 font-mono">
                      <span>{cert.hash.substring(0, 16)}...</span>
                      <span>Issued {cert.date}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'dao':
        return (
          <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-6 text-left">
            <div className="glass-card p-5 flex flex-col gap-4 text-xs">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest border-b border-white/5 pb-2 font-mono">Create Consensus Proposal</span>
              
              <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] text-slate-500 font-bold uppercase">Proposal Initiative Statement</label>
                  <textarea 
                    value={newProposalText}
                    onChange={(e) => setNewProposalText(e.target.value)}
                    rows="5"
                    className="w-full bg-[#102043] border border-white/5 p-2 rounded-xl text-white outline-none resize-none font-semibold"
                    placeholder="Enter initiative description..."
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] text-slate-500 font-bold uppercase">Category Sub-committee</label>
                  <select 
                    value={newProposalCategory}
                    onChange={(e) => setNewProposalCategory(e.target.value)}
                    className="select-dark"
                  >
                    {['Research', 'Department', 'Student Council', 'Faculty Senate', 'Treasury'].map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <button 
                  onClick={handleCreateProposal}
                  className="w-full py-2.5 bg-brand-primary text-white rounded-xl text-xs font-bold hover:brightness-110 cursor-pointer shadow-md"
                >
                  Broadcast Proposal
                </button>
              </div>
            </div>

            {/* Active proposals list */}
            <div className="glass-card p-6 flex flex-col gap-4">
              <span className="text-xs font-bold text-white uppercase tracking-wider font-mono border-b border-white/5 pb-2">Consortium DAO Committee Proposals</span>
              
              <div className="flex flex-col gap-3">
                {daoProposals.map((prop) => (
                  <div key={prop.id} className="p-4 bg-black/20 border border-white/5 rounded-xl flex flex-col gap-3">
                    <div className="flex justify-between items-center">
                      <span className="text-[9px] text-indigo-400 font-bold bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20 font-mono">{prop.id}</span>
                      <span className={`px-2 py-0.5 rounded text-[8px] font-bold ${
                        prop.status === 'ACTIVE' ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 animate-pulse' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      }`}>{prop.status}</span>
                    </div>

                    <p className="text-xs text-slate-200 font-semibold leading-relaxed">{prop.title}</p>
                    <span className="text-[9px] text-slate-500">Initiated by: {prop.creator} • Committee: {prop.category}</span>

                    <div className="flex items-center justify-between border-t border-white/5 pt-2 text-[10px] text-slate-500">
                      <div className="flex gap-4 font-mono font-semibold">
                        <span>For (Quadratic): <strong className="text-emerald-400">{prop.votesFor}</strong></span>
                        <span>Against: <strong className="text-rose-400">{prop.votesAgainst}</strong></span>
                      </div>

                      {prop.status === 'ACTIVE' ? (
                        <div className="flex gap-1.5">
                          <button 
                            onClick={() => handleDaoVote(prop.id, true)}
                            className="px-2.5 py-1 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 rounded border border-emerald-500/20 font-bold cursor-pointer"
                          >
                            Support
                          </button>
                          <button 
                            onClick={() => handleDaoVote(prop.id, false)}
                            className="px-2.5 py-1 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 rounded border border-rose-500/20 font-bold cursor-pointer"
                          >
                            Oppose
                          </button>
                        </div>
                      ) : (
                        <span>End Block: {prop.endBlock}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'tokens':
        return (
          <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-6 text-left">
            <div className="glass-card p-5 flex flex-col gap-4 text-xs">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest border-b border-white/5 pb-2 font-mono">Simulate Token Mint / Claim</span>
              <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] text-slate-400 font-bold uppercase">Token Pool Class</label>
                  <select 
                    value={mintTokenSymbol}
                    onChange={(e) => setMintTokenSymbol(e.target.value)}
                    className="select-dark"
                  >
                    {tokenBalances.map(t => (
                      <option key={t.symbol} value={t.symbol}>{t.name} ({t.symbol})</option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] text-slate-400 font-bold uppercase">Amount</label>
                  <input 
                    type="number" 
                    placeholder="e.g. 150" 
                    value={mintTokenAmount}
                    onChange={(e) => setMintTokenAmount(e.target.value)}
                    className="w-full bg-[#102043] border border-white/5 p-2 rounded-xl text-white outline-none font-semibold"
                  />
                </div>

                <button 
                  onClick={handleMintTokens}
                  className="w-full py-2.5 bg-brand-primary text-white rounded-xl text-xs font-bold hover:brightness-110 cursor-pointer shadow-md"
                >
                  Mint utility tokens
                </button>
              </div>
            </div>

            <div className="glass-card p-6 flex flex-col gap-4">
              <span className="text-xs font-bold text-white uppercase tracking-wider font-mono border-b border-white/5 pb-2">Academic Reward Token Roster</span>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {tokenBalances.map((tok, idx) => (
                  <div key={idx} className="p-4 bg-black/20 border border-white/5 rounded-xl flex justify-between items-center text-xs">
                    <div className="text-left pr-2">
                      <p className="font-bold text-white">{tok.name} ({tok.symbol})</p>
                      <p className="text-[9px] text-slate-500 mt-1 leading-normal">{tok.desc}</p>
                    </div>
                    <span className="font-mono text-cyan-400 font-bold shrink-0">{tok.balance}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'defi':
        return (
          <div className="flex flex-col gap-6 text-left">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { label: 'Scholarship Allocation Pools', val: '1,200 ETH', desc: 'Auto-distributed to verified GPA SBT holds' },
                { label: 'Active Grant Funding', val: '850 ETH', desc: 'Approved peer review nodes research' },
                { label: 'Yield Farm APY %', val: '4.85%', desc: 'Secured via Polygon validator node delegation' }
              ].map((metric, i) => (
                <div key={i} className="glass-card p-5">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block font-mono">{metric.label}</span>
                  <span className="text-xl font-extrabold text-white mt-1.5 block font-mono">{metric.val}</span>
                  <span className="text-[9px] text-slate-400 mt-1 block font-sans">{metric.desc}</span>
                </div>
              ))}
            </div>

            <div className="glass-card p-6 flex flex-col gap-4">
              <span className="text-xs font-bold text-white uppercase tracking-wider font-mono border-b border-white/5 pb-2">Verifiable Research Grant Allocations</span>
              <div className="overflow-x-auto border border-white/5 rounded-xl">
                <table className="web3-table">
                  <thead>
                    <tr>
                      <th>Proposal ID</th>
                      <th>Project Title</th>
                      <th>Grant Sum</th>
                      <th>Consensus Signatures</th>
                      <th>Escrow Lock Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { id: 'GRT-402', project: 'ZKP Grade Registry', sum: '4.2 ETH', signs: '5/7 Multi-sig', status: 'ACTIVE LOCKED' },
                      { id: 'GRT-403', project: 'Energy Constrained Mesh Validators', sum: '8.5 ETH', signs: '6/7 Multi-sig', status: 'RELEASED' },
                      { id: 'GRT-404', project: 'Federated Regulators Hub', sum: '3.0 ETH', signs: '3/7 Multi-sig', status: 'PENDING VOTES' }
                    ].map((row, idx) => (
                      <tr key={idx}>
                        <td className="font-mono text-cyan-400">{row.id}</td>
                        <td className="font-semibold text-slate-200">{row.project}</td>
                        <td className="font-mono">{row.sum}</td>
                        <td className="font-mono text-slate-400">{row.signs}</td>
                        <td>
                          <span className={`badge-web3 ${row.status === 'RELEASED' ? 'badge-success' : (row.status === 'ACTIVE LOCKED' ? 'badge-primary' : 'badge-warning')}`}>
                            {row.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );

      case 'staking':
        return (
          <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-6 text-left">
            <div className="glass-card p-5 flex flex-col gap-4 text-xs">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest border-b border-white/5 pb-2 font-mono">Consortium Staking Deck</span>
              
              <div className="flex flex-col gap-3">
                <div className="p-3 bg-black/20 border border-white/5 rounded-xl flex justify-between">
                  <span>Delegated Balance:</span>
                  <span className="font-mono font-bold text-cyan-400">{stakedBalance} REP</span>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] text-slate-400 font-bold uppercase">Reputation (REP) Amount to Stake</label>
                  <input 
                    type="number" 
                    placeholder="REP tokens..." 
                    value={stakeAmount}
                    onChange={(e) => setStakeAmount(e.target.value)}
                    className="w-full bg-[#102043] border border-white/5 p-2 rounded-xl text-white outline-none font-semibold font-mono"
                  />
                </div>

                <button 
                  onClick={handleStake}
                  className="w-full py-2.5 bg-brand-primary text-white rounded-xl text-xs font-bold hover:brightness-110 cursor-pointer shadow-md"
                >
                  Delegate to Validator Nodes
                </button>
              </div>
            </div>

            <div className="glass-card p-6 flex flex-col gap-4">
              <span className="text-xs font-bold text-white uppercase tracking-wider font-mono border-b border-white/5 pb-2">Delegated Staking Performance Telemetry</span>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { pool: 'Polygon Validation Node Pool 1', state: 'ACTIVE', rate: '5.20% APY', earned: '14.8 REP accrued' },
                  { pool: 'Arbitrum Rollup Aggregator Deck', state: 'ACTIVE', rate: '4.15% APY', earned: '8.2 REP accrued' }
                ].map((pool, idx) => (
                  <div key={idx} className="p-4 bg-black/20 border border-white/5 rounded-xl text-xs flex justify-between items-center">
                    <div className="text-left">
                      <p className="font-bold text-white leading-normal">{pool.pool}</p>
                      <span className="text-[10px] text-slate-500 mt-1 block font-mono">{pool.earned}</span>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[8px] font-bold rounded">
                        {pool.state}
                      </span>
                      <p className="font-mono text-cyan-400 font-bold mt-1 text-[10px]">{pool.rate}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'treasury':
        return (
          <div className="flex flex-col gap-6 text-left">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {[
                { label: 'DAO Multi-sig locked pool', val: '4,500 ETH' },
                { label: 'Pending Allocations Sum', val: '235.40 ETH' },
                { label: 'Authorized Signatures Required', val: '5 of 7 nodes' },
                { label: 'Active Multisig Guardians', val: '7 Validators' }
              ].map((t, idx) => (
                <div key={idx} className="glass-card p-4 flex flex-col">
                  <span className="text-[9px] text-slate-500 uppercase tracking-widest font-bold font-mono">{t.label}</span>
                  <span className="text-base font-extrabold text-white mt-1.5 font-mono">{t.val}</span>
                </div>
              ))}
            </div>

            <div className="glass-card p-6 flex flex-col gap-4">
              <span className="text-xs font-bold text-white uppercase tracking-wider font-mono border-b border-white/5 pb-2">Multi-signature Treasury Transactions Ledger</span>
              <div className="overflow-x-auto border border-white/5 rounded-xl">
                <table className="web3-table">
                  <thead>
                    <tr>
                      <th>Tx Hash Namespace</th>
                      <th>Beneficiary Node</th>
                      <th>Allocation Purpose</th>
                      <th>Amount</th>
                      <th>Approvals Signatures</th>
                      <th>Status State</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { hash: '0x1b790d984d720a45594e...', dest: '0x81cf712d984efc464ef...', purpose: 'Research Grant Release', amount: '15 ETH', approvals: '5/7 Signs', status: 'EXECUTED' },
                      { hash: '0x3cb4d720a455a1532ffe...', dest: '0x71c5db0200871dccf43...', purpose: 'SBT Registration upgrade', amount: '8 ETH', approvals: '6/7 Signs', status: 'EXECUTED' },
                      { hash: '0x81cf712d984efc464ef...', dest: '0x3cb4d720a455a1532ff...', purpose: 'VR Lab Hackathon Rewards', sum: '12 ETH', approvals: '4/7 Signs', status: 'AWAITING_SIGNS' }
                    ].map((row, idx) => (
                      <tr key={idx}>
                        <td className="font-mono text-cyan-400">{row.hash.substring(0, 16)}...</td>
                        <td className="font-mono text-slate-400">{row.dest.substring(0, 16)}...</td>
                        <td className="font-semibold text-slate-200">{row.purpose}</td>
                        <td className="font-mono">{row.amount || row.sum}</td>
                        <td className="font-mono text-slate-400">{row.approvals}</td>
                        <td>
                          <span className={`badge-web3 ${row.status === 'EXECUTED' ? 'badge-success' : 'badge-warning'}`}>
                            {row.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );

      case 'marketplace':
        return (
          <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-6 text-left">
            <div className="glass-card p-5 flex flex-col gap-4 text-xs">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest border-b border-white/5 pb-2 font-mono">Mint Patent License Asset</span>
              <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] text-slate-400 font-bold uppercase">Patent Title</label>
                  <input 
                    type="text" 
                    placeholder="e.g. ZKP Identity Verification Scheme" 
                    value={patentTitle}
                    onChange={(e) => setPatentTitle(e.target.value)}
                    className="w-full bg-[#102043] border border-white/5 p-2 rounded-xl text-white outline-none"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] text-slate-400 font-bold uppercase">Lead Investigator</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Dr. Evelyn Carter" 
                    value={patentAuthor}
                    onChange={(e) => setPatentAuthor(e.target.value)}
                    className="w-full bg-[#102043] border border-white/5 p-2 rounded-xl text-white outline-none"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] text-slate-400 font-bold uppercase">Reserve Price Valuation (ETH)</label>
                  <input 
                    type="number" 
                    placeholder="e.g. 2.5" 
                    value={patentPrice}
                    onChange={(e) => setPatentPrice(e.target.value)}
                    className="w-full bg-[#102043] border border-white/5 p-2 rounded-xl text-white outline-none font-semibold font-mono"
                  />
                </div>

                <button 
                  onClick={handleListPatent}
                  className="w-full py-2.5 bg-brand-primary text-white rounded-xl text-xs font-bold hover:brightness-110 cursor-pointer shadow-md"
                >
                  List Research NFT
                </button>
              </div>
            </div>

            <div className="glass-card p-6 flex flex-col gap-4">
              <span className="text-xs font-bold text-white uppercase tracking-wider font-mono border-b border-white/5 pb-2">Academic IPFS Innovation Marketplace</span>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {marketplaceItems.map((item) => (
                  <div key={item.id} className="p-4 bg-black/20 border border-white/5 rounded-xl flex flex-col justify-between h-[180px]">
                    <div className="flex justify-between items-start">
                      <div className="min-w-0 pr-2">
                        <h4 className="text-xs font-bold text-white truncate leading-tight">{item.title}</h4>
                        <span className="text-[9px] text-slate-500 mt-1 block">Lead Author: {item.author}</span>
                      </div>
                      <span className="badge-web3 badge-info shrink-0">IPFS CID</span>
                    </div>

                    <div className="flex justify-between items-center border-t border-white/5 pt-2 mt-4 text-xs font-mono">
                      <div>
                        <span className="text-[8px] text-slate-500 uppercase tracking-wider block font-sans">Valuation</span>
                        <span className="font-bold text-white">{item.price} ETH</span>
                      </div>
                      
                      <div>
                        <span className="text-[8px] text-slate-500 uppercase tracking-wider block font-sans">Top Bid</span>
                        <span className="font-bold text-cyan-400">{item.bid || '-'} ETH</span>
                      </div>

                      <button 
                        onClick={() => {
                          const bid = prompt('Enter bidding price in ETH:');
                          if (bid) handlePlaceBid(item.id, bid);
                        }}
                        className="px-3 py-1.5 bg-brand-primary hover:brightness-110 text-white rounded-lg text-[10px] font-bold cursor-pointer transition-all"
                      >
                        Place Bid
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'contracts':
        return (
          <div className="flex flex-col gap-6 text-left">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: 'Smart Contracts Deployed', val: contractRoster.length },
                { label: 'Cumulative Gas Consumed', val: '11,848,800 Gwei' },
                { label: 'Solc compiler target', val: 'v0.8.24' },
                { label: 'Audit report checks', val: '100% SECURE' }
              ].map((c, i) => (
                <div key={i} className="glass-card p-4">
                  <span className="text-[9px] text-slate-500 uppercase tracking-wider font-bold block">{c.label}</span>
                  <span className="text-base font-extrabold mt-1.5 font-mono block text-white">{c.val}</span>
                </div>
              ))}
            </div>

            <div className="glass-card p-6 flex flex-col gap-4">
              <span className="text-xs font-bold text-white uppercase tracking-wider font-mono border-b border-white/5 pb-2">Solidity smart contract compiler / compiler outputs</span>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  'CampusXDegreeRegistry.sol',
                  'ResearchPatentEscrow.sol',
                  'ScholarshipPoolManager.sol',
                  'QuadraticVotingDAO.sol'
                ].map((conName) => (
                  <button
                    key={conName}
                    onClick={() => {
                      const randAddr = '0x' + Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
                      setContractRoster([...contractRoster, {
                        name: conName,
                        address: randAddr,
                        status: 'ACTIVE',
                        compiler: 'v0.8.24',
                        gas: '1,850,000',
                        audit: 'SECURE'
                      }]);
                      alert(`Successfully compiled and deployed Solidity contract at address: ${randAddr}`);
                    }}
                    className="p-3 bg-[#102043] hover:bg-white/[0.04] border border-white/5 rounded-xl text-[10px] font-bold text-slate-300 flex items-center justify-between transition-all cursor-pointer"
                  >
                    <span>Compile {conName}</span>
                    <Plus className="w-3.5 h-3.5 text-indigo-400" />
                  </button>
                ))}
              </div>

              <div className="overflow-x-auto border border-white/5 rounded-xl mt-4">
                <table className="web3-table">
                  <thead>
                    <tr>
                      <th>Contract Name</th>
                      <th>Address Namespace</th>
                      <th>Compiler version</th>
                      <th>Audit check</th>
                    </tr>
                  </thead>
                  <tbody>
                    {contractRoster.map((con, idx) => (
                      <tr key={idx}>
                        <td className="font-semibold text-slate-200">{con.name}</td>
                        <td><code className="text-cyan-400 font-mono">{con.address}</code></td>
                        <td className="font-mono text-slate-400">{con.compiler}</td>
                        <td>
                          <span className="px-2 py-0.5 rounded text-[8px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            VERIFIED SUCCESS
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );

      case 'dapps':
        return (
          <div className="flex flex-col gap-6 text-left">
            <span className="text-xs font-bold text-white uppercase tracking-wider font-mono border-b border-white/5 pb-2 block">Standalone Web3 Operating Layer Sandboxes</span>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { title: 'CampusX Chain Platform', link: '/blockchain', desc: 'Enterprise credential registry & BIP-39 mnemonic wallet key derivations portal.', icon: Layers },
                { title: 'CampusX Connect Messages', link: '/connect/messages', desc: 'Secure Web3 peer-to-peer social discussions and multi-sig council debates.', icon: Globe },
                { title: 'Verifiable Credentials Sandbox', link: '/blockchain', desc: 'Credential validator tools and degree revoke registries.', icon: ShieldCheck }
              ].map((dapp, idx) => (
                <div key={idx} className="glass-card p-5 flex flex-col justify-between h-[180px]">
                  <div>
                    <div className="p-2 bg-indigo-500/10 text-indigo-400 rounded-xl w-fit">
                      <dapp.icon className="w-5.5 h-5.5" />
                    </div>
                    <h4 className="text-sm font-extrabold text-white mt-3 leading-snug">{dapp.title}</h4>
                    <p className="text-[10px] text-slate-400 mt-1 leading-normal">{dapp.desc}</p>
                  </div>
                  
                  <Link 
                    href={dapp.link}
                    className="flex items-center gap-1 text-[10px] font-bold text-[#6366F1] hover:underline mt-4 cursor-pointer"
                  >
                    Launch DApp <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        );

      case 'research':
        return (
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6 text-left">
            <div className="glass-card p-6 flex flex-col gap-4">
              <span className="text-xs font-bold text-white uppercase tracking-wider font-mono border-b border-white/5 pb-2">IPFS & Arweave Research Provenance Registry</span>
              
              <div className="flex flex-col gap-4">
                {[
                  { id: 'RES-901', title: 'Zero-Knowledge Proofs for Verifiable Grade Reports', ipfs: 'QmYwAPJjh34dHnKpeP1GvD22xJ8Pq5n9', storage: 'IPFS pinned', date: '2026-02-14' },
                  { id: 'RES-902', title: 'Federated Ledger Nodes on Energy Constrained IoT Platforms', arweave: 'A-b5dfg817cffb022aa29910dff', storage: 'Arweave Permanent', date: '2026-04-18' }
                ].map((res, idx) => (
                  <div key={idx} className="p-4 bg-black/20 border border-white/5 rounded-xl flex flex-col gap-2">
                    <div className="flex justify-between items-center text-xs">
                      <h4 className="font-bold text-white leading-snug">{res.title}</h4>
                      <span className="badge-web3 badge-info shrink-0">{res.storage}</span>
                    </div>
                    <div className="flex justify-between items-center text-[10px] font-mono text-slate-500">
                      <span>CID: <strong className="text-cyan-400">{res.ipfs || res.arweave}</strong></span>
                      <span>Synced: {res.date}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Knowledge graph preview */}
            <div className="glass-card p-5 flex flex-col gap-3">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest font-mono">Consortium Knowledge Graph Node</span>
              
              <div className="w-full h-[220px] rounded-xl bg-black/30 border border-white/5 relative flex items-center justify-center overflow-hidden network-grid-svg">
                {/* Visual nodes representation */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center text-white font-bold text-xs glow-primary">IPFS</div>
                  <div className="flex gap-12 text-[9px] font-mono">
                    <div className="p-1.5 bg-slate-800 border border-white/10 rounded">ZKP Grade</div>
                    <div className="p-1.5 bg-slate-800 border border-white/10 rounded">Federated IoT</div>
                  </div>
                </div>
                {/* Simulated connector line */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none">
                  <line x1="160" y1="110" x2="100" y2="160" stroke="rgba(99, 102, 241, 0.4)" strokeWidth="1.5" />
                  <line x1="160" y1="110" x2="220" y2="160" stroke="rgba(99, 102, 241, 0.4)" strokeWidth="1.5" />
                </svg>
              </div>
              <span className="text-[9px] text-slate-500 font-sans mt-1">Simulates live connection mappings between research credentials and registered student authors.</span>
            </div>
          </div>
        );

      case 'vault':
        return (
          <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-6 text-left">
            <div className="glass-card p-5 flex flex-col gap-4 text-xs">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest border-b border-white/5 pb-2 font-mono">Unlock Decryption Vault</span>
              
              <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] text-slate-400 font-bold uppercase">Decryption Password Key</label>
                  <input 
                    type="password" 
                    placeholder="Enter password key..." 
                    value={vaultPassword}
                    onChange={(e) => setVaultPassword(e.target.value)}
                    className="w-full bg-[#102043] border border-white/5 p-2 rounded-xl text-white outline-none"
                  />
                  <span className="text-[8px] text-slate-500 mt-1 block">Developer demo password: <code className="text-cyan-400 font-mono">secure123</code></span>
                </div>

                <button 
                  onClick={handleUnlockVault}
                  className="w-full py-2.5 bg-brand-primary text-white rounded-xl text-xs font-bold hover:brightness-110 cursor-pointer shadow-md"
                >
                  Decrypt Vault Secrets
                </button>
              </div>
            </div>

            <div className="glass-card p-6 flex flex-col gap-4">
              <span className="text-xs font-bold text-white uppercase tracking-wider font-mono border-b border-white/5 pb-2">Verifiable Credential Decryption Enclave</span>
              
              {vaultUnlocked ? (
                <div className="flex flex-col gap-3">
                  {[
                    { id: 'SBT-8891', raw: '{"GPA": 3.95, "GPA_Proof": "0x88ea30...", "Clearance": "High"}' },
                    { id: 'SBT-9042', raw: '{"DataStructures": "A+", "Exam_Hash": "0x32cf2b...", "Rank": "1st"}' }
                  ].map((rawText, idx) => (
                    <div key={idx} className="p-3 bg-black/40 border border-emerald-500/20 rounded-xl font-mono text-[10px] text-emerald-400">
                      <span className="text-[9px] text-slate-500 uppercase font-sans font-bold block mb-1">Decrypted Metadata ({rawText.id})</span>
                      <code>{rawText.raw}</code>
                    </div>
                  ))}
                  <button 
                    onClick={() => setVaultUnlocked(false)}
                    className="px-3 py-1.5 bg-rose-500/20 border border-rose-500/30 text-rose-400 rounded-lg text-[10px] font-bold cursor-pointer w-fit mt-2"
                  >
                    Lock Vault Secrets
                  </button>
                </div>
              ) : (
                <span className="text-xs text-slate-500 italic">Vault credentials metadata is encrypted locally. Please input your secure password key to decrypt.</span>
              )}
            </div>
          </div>
        );

      case 'community':
        return (
          <div className="flex flex-col gap-6 text-left">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { title: 'Student Council Elections', votes: '182 votes cast', status: 'ACTIVE' },
                { title: 'Faculty Senate Consensus', votes: '42 votes cast', status: 'ACTIVE' },
                { title: 'Departmental Reps Council', votes: '68 votes cast', status: 'ACTIVE' }
              ].map((council, idx) => (
                <div key={idx} className="glass-card p-5 flex flex-col justify-between h-[130px]">
                  <div>
                    <span className="badge-web3 badge-primary">{council.status}</span>
                    <h4 className="text-xs font-extrabold text-white mt-2 leading-snug">{council.title}</h4>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400 mt-2 block">{council.votes}</span>
                </div>
              ))}
            </div>

            <div className="glass-card p-6 flex flex-col gap-4">
              <span className="text-xs font-bold text-white uppercase tracking-wider font-mono border-b border-white/5 pb-2">Transparency Expenditures Ledger</span>
              <div className="overflow-x-auto border border-white/5 rounded-xl">
                <table className="web3-table">
                  <thead>
                    <tr>
                      <th>Tx Hash</th>
                      <th>Source Council</th>
                      <th>Expenditure target</th>
                      <th>Consortium Vote link</th>
                      <th>Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { hash: '0x321f00a52df09a5b...', council: 'Student Council', target: 'Hackathon Supplies', voteLink: 'DAO-01', val: '4.50 ETH' },
                      { hash: '0x71c5db0200871dcc...', council: 'Faculty Senate', target: 'Server Node Hosting', voteLink: 'DAO-02', val: '3.20 ETH' }
                    ].map((row, idx) => (
                      <tr key={idx}>
                        <td className="font-mono text-cyan-400">{row.hash.substring(0, 16)}...</td>
                        <td className="font-semibold text-slate-200">{row.council}</td>
                        <td className="text-slate-300">{row.target}</td>
                        <td className="font-mono text-indigo-400">{row.voteLink}</td>
                        <td className="font-mono text-emerald-400 font-bold">{row.val}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );

      case 'analytics':
        return (
          <div className="flex flex-col gap-6 text-left">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {[
                { label: 'Wallet Registry Growth', val: '+24.50% this week', desc: '14 new student nodes' },
                { label: 'SBT Issuance Growth', val: '+12.30% this week', desc: '8 new degree credentials' },
                { label: 'DAO Participation Rate', val: '88.40% active', desc: 'Average 1.4 proposals cast' },
                { label: 'Treasury Pool Flow', val: '+142.50 ETH', desc: 'Net academic deposits' }
              ].map((stat, idx) => (
                <div key={idx} className="glass-card p-4">
                  <span className="text-[9px] text-slate-500 uppercase tracking-widest font-bold font-mono">{stat.label}</span>
                  <span className="text-sm font-extrabold text-emerald-400 mt-1.5 block">{stat.val}</span>
                  <span className="text-[9px] text-slate-400 mt-0.5 block">{stat.desc}</span>
                </div>
              ))}
            </div>

            <div className="glass-card p-6 flex flex-col gap-4">
              <span className="text-xs font-bold text-white uppercase tracking-wider font-mono border-b border-white/5 pb-2">Validator Consensus Performance Timeline</span>
              <div className="flex flex-col gap-3">
                {[
                  { label: 'Mined Blocks per hour', graph: '▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰ 100%' },
                  { label: 'Consortium node uptime', graph: '▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰ 100%' },
                  { label: 'Consensus Latency Response', graph: '▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▱▱▱ 85%' }
                ].map((item, idx) => (
                  <div key={idx} className="text-xs leading-normal font-mono">
                    <p className="font-semibold text-slate-300">{item.label}</p>
                    <span className="text-cyan-400 mt-1 block tracking-wider">{item.graph}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'explorer':
        return (
          <div className="flex flex-col gap-6 text-left">
            <div className="glass-card p-6 flex flex-col gap-4">
              <span className="text-xs font-bold text-white uppercase tracking-wider font-mono border-b border-white/5 pb-2">Academic Blockchain Explorer Query Hub</span>
              <div className="flex gap-2">
                <div className="flex-1 bg-[#102043] border border-white/5 rounded-xl px-3 py-2 flex items-center gap-2">
                  <Search className="w-4.5 h-4.5 text-slate-500" />
                  <input 
                    type="text" 
                    placeholder="Search query (e.g. hash '0x88f2be5...', ID 'SBT-8891', or address '0x1b790d...')" 
                    value={explorerQuery}
                    onChange={(e) => setExplorerQuery(e.target.value)}
                    className="bg-transparent border-none text-xs text-white outline-none w-full placeholder-slate-500"
                  />
                </div>
                <button 
                  onClick={handleExplorerLookup}
                  className="px-4 py-2 bg-brand-primary text-white text-xs font-bold rounded-xl cursor-pointer"
                >
                  Lookup Block
                </button>
              </div>

              {explorerResult && (
                <div className="p-4 bg-black/20 border border-white/5 rounded-xl text-xs leading-relaxed">
                  {explorerResult.type === 'NOT_FOUND' ? (
                    <span className="text-rose-400 font-bold flex items-center gap-1.5"><ShieldAlert className="w-4.5 h-4.5" /> No matching block logs found.</span>
                  ) : explorerResult.type === 'SOULBOUND_CREDENTIAL' ? (
                    <div className="flex flex-col gap-2">
                      <span className="text-emerald-400 font-bold">Verifiable Soulbound SBT Found</span>
                      <p>Recipient Name: <strong>{explorerResult.data.recipient}</strong></p>
                      <p>Credential Description: <strong>{explorerResult.data.title}</strong></p>
                      <code className="text-[10px] text-cyan-400 font-mono mt-1 bg-black/30 p-2 rounded border border-white/5 break-all">{explorerResult.data.hash}</code>
                    </div>
                  ) : explorerResult.type === 'TRANSACTION' ? (
                    <div className="flex flex-col gap-2">
                      <span className="text-indigo-400 font-bold">Transaction Record Located</span>
                      <p>Type: <strong>{explorerResult.data.type}</strong></p>
                      <p>Execution Block: <strong>{explorerResult.data.block}</strong></p>
                      <code className="text-[10px] text-cyan-400 font-mono mt-1 bg-black/30 p-2 rounded border border-white/5 break-all">{explorerResult.data.tx}</code>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-2">
                      <span className="text-cyan-400 font-bold">Smart Contract Located</span>
                      <p>Name: <strong>{explorerResult.data.name}</strong></p>
                      <p>Solidity version: <strong>{explorerResult.data.compiler}</strong></p>
                      <code className="text-[10px] text-cyan-400 font-mono mt-1 bg-black/30 p-2 rounded border border-white/5 break-all">{explorerResult.data.address}</code>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        );

      case 'settings':
        return (
          <div className="glass-card p-6 text-left flex flex-col gap-5">
            <span className="text-xs font-bold text-white uppercase tracking-wider font-mono border-b border-white/5 pb-2">Consortium Operating Layer Preferences</span>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
              <div className="flex flex-col gap-1.5">
                <label className="text-[9px] text-slate-400 font-bold uppercase">RPC Gateway Connection Endpoint</label>
                <input 
                  type="text" 
                  defaultValue="https://polygon-mainnet.g.alchemy.com/v2/campusx-key"
                  className="w-full bg-[#102043] border border-white/5 p-2 rounded-xl text-white outline-none font-mono"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[9px] text-slate-400 font-bold uppercase">IPFS Node Provider Gateway</label>
                <input 
                  type="text" 
                  defaultValue="https://gateway.pinata.cloud/ipfs/"
                  className="w-full bg-[#102043] border border-white/5 p-2 rounded-xl text-white outline-none font-mono"
                />
              </div>
            </div>
            
            <div className="border-t border-white/5 pt-4 mt-2">
              <button 
                onClick={() => alert('Operating layer settings saved successfully.')}
                className="px-4 py-2 bg-brand-primary text-white text-xs font-bold rounded-xl cursor-pointer"
              >
                Save Preferences
              </button>
            </div>
          </div>
        );

      case 'devdesk':
        return (
          <div className="flex flex-col gap-6 text-left">
            <span className="text-xs font-bold text-white uppercase tracking-wider font-mono border-b border-white/5 pb-2 block">CAMPUSX WEB3 Architectural Blueprint Console</span>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 text-[11px] font-mono leading-relaxed">
              
              {/* Database Schema */}
              <div className="glass-card p-5 flex flex-col gap-3">
                <span className="text-xs font-bold text-white uppercase tracking-wider font-sans">1. Database Schema specs (PostgreSql)</span>
                <div className="compiler-console max-h-[300px] overflow-y-auto web3-scroll">
                  {`CREATE TABLE did_metadata (
  id SERIAL PRIMARY KEY,
  did_address VARCHAR(255) UNIQUE NOT NULL,
  cleareance_role VARCHAR(50) NOT NULL,
  public_key TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE verifiable_credentials (
  credential_id VARCHAR(100) PRIMARY KEY,
  recipient_name VARCHAR(150) NOT NULL,
  credential_title TEXT NOT NULL,
  credential_type VARCHAR(100) NOT NULL,
  signature_hash VARCHAR(255) UNIQUE NOT NULL,
  issued_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE token_transfers (
  id SERIAL PRIMARY KEY,
  tx_hash VARCHAR(255) UNIQUE NOT NULL,
  sender_address VARCHAR(255) NOT NULL,
  token_symbol VARCHAR(20) NOT NULL,
  token_value DECIMAL(18,4) NOT NULL
);`}
                </div>
              </div>

              {/* API Design */}
              <div className="glass-card p-5 flex flex-col gap-3">
                <span className="text-xs font-bold text-white uppercase tracking-wider font-sans">2. REST API endpoints catalog (Swagger specs)</span>
                <div className="compiler-console max-h-[300px] overflow-y-auto web3-scroll">
                  {`GET  /api/v1/web3/identity/did/:address
Headers: { Authorization: "Bearer JWT" }
Response: { status: "success", did: "did:campusx:edu:student" }

POST /api/v1/web3/credentials/mint
Body: { recipient: "STU001", title: "Dean Honour", type: "Degree" }
Response: { status: "success", hash: "0x88f2be..." }

POST /api/v1/web3/dao/vote
Body: { proposal_id: "DAO-01", support: true }
Response: { status: "success", votes_power: 25 }`}
                </div>
              </div>

              {/* Kubernetes Helm Chart */}
              <div className="glass-card p-5 flex flex-col gap-3">
                <span className="text-xs font-bold text-white uppercase tracking-wider font-sans">3. Helm values chart & Ingress spec</span>
                <div className="compiler-console max-h-[300px] overflow-y-auto web3-scroll">
                  {`# helm-values.yaml
replicaCount: 3
image:
  repository: gcr.io/campusx-mesh/web3-operating-layer
  tag: v1.2.0
ingress:
  enabled: true
  className: nginx
  hosts:
    - host: erp.campusx.edu
      paths:
        - path: /app/web3
          pathType: Prefix
resources:
  limits:
    cpu: 1000m
    memory: 1024Mi`}
                </div>
              </div>

              {/* Production Dockerfile */}
              <div className="glass-card p-5 flex flex-col gap-3">
                <span className="text-xs font-bold text-white uppercase tracking-wider font-sans">4. Dockerfile compilation specs</span>
                <div className="compiler-console max-h-[300px] overflow-y-auto web3-scroll">
                  {`# Multi-stage production build
FROM node:22-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:22-alpine AS runner
WORKDIR /app
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules
ENV NODE_ENV=production
EXPOSE 3000
CMD ["npm", "start"]`}
                </div>
              </div>

            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="messages-main-container select-none connect-font-inter web3-terminal-body">
      {/* 1. LEFT SIDEBAR (320px) - Fixed Position */}
      <aside className="w-[320px] bg-[#071126] border-r border-white/5 flex flex-col justify-between h-full fixed top-0 bottom-0 left-0 z-50 py-6 px-4">
        <div className="flex flex-col gap-6">
          
          {/* Logo Branding */}
          <div className="flex items-center gap-3 mb-2 px-2">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-[#6366F1] to-emerald-500 flex items-center justify-center glow-primary">
              <Globe className="w-6 h-6 text-white" />
            </div>
            <div className="text-left">
              <span className="text-xl font-bold tracking-tight text-white uppercase block">
                CAMPUSX WEB3
              </span>
              <span className="text-[7.5px] font-bold text-slate-400 uppercase tracking-widest block mt-0.5 whitespace-nowrap">
                Decentralized Academic OS Layer
              </span>
            </div>
          </div>

          {/* Navigation link roster */}
          <nav className="flex flex-col gap-1 overflow-y-auto max-h-[70vh] pr-1 web3-scroll text-xs">
            {[
              { id: 'overview', label: 'Overview', icon: Globe },
              { id: 'wallet', label: 'Wallet Hub', icon: Wallet },
              { id: 'identity', label: 'Digital Identity', icon: Fingerprint },
              { id: 'profiles', label: 'Web3 Profiles', icon: User },
              { id: 'nft', label: 'NFT Center', icon: Sparkles },
              { id: 'dao', label: 'DAO Governance', icon: Users },
              { id: 'tokens', label: 'Token Hub', icon: Coins },
              { id: 'defi', label: 'DeFi Dashboard', icon: Landmark },
              { id: 'staking', label: 'Staking', icon: Percent },
              { id: 'treasury', label: 'Treasury', icon: Landmark },
              { id: 'marketplace', label: 'Marketplace', icon: ShoppingBag },
              { id: 'contracts', label: 'Smart Contracts', icon: Code },
              { id: 'dapps', label: 'DApps Sandbox', icon: Compass },
              { id: 'research', label: 'Research Assets', icon: HardDrive },
              { id: 'vault', label: 'Credential Vault', icon: Key },
              { id: 'community', label: 'Community Governance', icon: Shield },
              { id: 'analytics', label: 'Analytics', icon: LineChart },
              { id: 'explorer', label: 'Explorer', icon: Search },
              { id: 'settings', label: 'Settings', icon: SettingsIcon },
              { id: 'devdesk', label: 'Architect Blueprint', icon: Cpu }
            ].map((link) => {
              const LinkIcon = link.icon;
              const isActive = activeTab === link.id;

              return (
                <button
                  key={link.id}
                  onClick={() => setActiveTab(link.id)}
                  className={`w-full py-2.5 px-4 rounded-[20px] flex items-center gap-3 transition-all relative font-bold text-left cursor-pointer border border-transparent nav-rail-item ${
                    isActive 
                      ? 'active text-white font-extrabold shadow-sm' 
                      : 'text-slate-400 hover:text-white hover:bg-white/[0.02]'
                  }`}
                >
                  <LinkIcon className={`w-4.5 h-4.5 shrink-0 ${isActive ? 'text-[#6366F1]' : 'text-slate-400'}`} />
                  <span className="truncate">{link.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Back Link bottom switcher docked */}
        <div className="border-t border-white/5 pt-4 mt-auto">
          <Link 
            href="/"
            className="w-full py-2.5 px-4 rounded-[20px] flex items-center gap-3 text-slate-400 hover:text-white hover:bg-white/[0.02] font-bold text-xs cursor-pointer border border-transparent"
          >
            <LayoutGrid className="w-5 h-5 shrink-0 text-slate-500" />
            <span>App Switcher Portal</span>
          </Link>
        </div>
      </aside>

      {/* 2. MIDDLE MAIN TERMINAL WORKSPACE AREA (Flexible 1fr) */}
      <main 
        className="flex-1 flex flex-col h-full min-h-screen overflow-hidden bg-[#071126]/60 relative border-r border-white/5"
        style={{ marginLeft: '320px', marginRight: '360px' }} // Offsets fixed sidebars
      >
        {/* Top Header metrics bar */}
        <header className="h-[70px] border-b border-white/5 bg-[#0B1736]/40 px-6 flex items-center justify-between shrink-0 z-10">
          <div className="flex items-center gap-3 text-left">
            <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse pulse-glow-success"></span>
            <div>
              <h2 className="text-xs font-bold text-white uppercase tracking-wider">Consortium Web3 Operations Layer</h2>
              <div className="flex gap-3 text-[9px] font-mono text-slate-400 mt-0.5">
                <span>Blocks: #{blocksHeight}</span>
                <span>TPS: {tpsRate} TX/s</span>
                <span>Active Gas: {gasPrice} Gwei</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider font-mono">Role Clearance:</span>
            <select 
              value={clearanceRole}
              onChange={(e) => {
                setClearanceRole(e.target.value);
                alert(`Web3 security clearance role switched to: ${e.target.value}`);
              }}
              className="bg-[#102043] border border-white/5 rounded-xl px-2.5 py-1.5 text-xs font-semibold text-white outline-none cursor-pointer"
            >
              {['Super Admin', 'Registrar', 'Dean', 'Faculty', 'Student'].map(role => (
                <option key={role} value={role}>{role}</option>
              ))}
            </select>
          </div>
        </header>

        {/* Viewport content router */}
        <div className="flex-1 overflow-y-auto p-6 web3-scroll max-h-[calc(100vh-70px)]">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {renderActiveViewport()}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* 3. RIGHT SIDEBAR (360px): Telemetry & Activity Feed */}
      <aside className="w-[360px] bg-[#0B1736] border-l border-white/5 flex flex-col h-full fixed top-0 bottom-0 right-0 z-50">
        <div className="p-4 border-b border-white/5 flex items-center justify-between shrink-0 h-[70px]">
          <span className="text-xs font-bold text-white uppercase tracking-wider">Node Telemetry Feed</span>
          <Activity className="w-4.5 h-4.5 text-slate-400" />
        </div>

        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 web3-scroll text-left">
          
          {/* Network Health KPI card */}
          <div className="bg-[#102043]/30 border border-white/5 rounded-[20px] p-4 flex flex-col gap-3">
            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono flex items-center gap-1.5">
              <Cpu className="w-4 h-4 text-cyan-400 animate-pulse" /> Gas Forecast Target
            </h4>
            <div className="flex flex-col gap-1.5 text-[10px] font-mono text-slate-300">
              <div className="flex justify-between">
                <span>Ethereum Mainnet:</span>
                <span className="text-slate-400">14.2 Gwei</span>
              </div>
              <div className="flex justify-between">
                <span>Polygon Consortium:</span>
                <span className="text-emerald-400 font-bold">{gasPrice} Gwei [Optimal]</span>
              </div>
              <div className="flex justify-between">
                <span>Base Gateway Limit:</span>
                <span className="text-slate-400">0.8 Gwei</span>
              </div>
            </div>
          </div>

          {/* Recent verifications lookup */}
          <div className="bg-[#102043]/30 border border-white/5 rounded-[20px] p-4 flex flex-col gap-3">
            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">Consensus State roots</h4>
            <div className="flex flex-col gap-2.5">
              {[
                { detail: 'Degree SBT signature verification node success', time: '1 min ago' },
                { detail: 'Research Patent IPFS listing synchronized', time: '15 mins ago' },
                { detail: 'Consensus proposal quadratic voting recorded', time: '1 hour ago' },
                { detail: 'Validator staking contract state verified', time: '4 hours ago' }
              ].map((act, i) => (
                <div key={i} className="text-[11px] border-b border-white/5 pb-2 last:border-transparent">
                  <div className="flex justify-between text-[8px] text-slate-500 font-mono mb-1">
                    <span>STATE SYNCED</span>
                    <span>{act.time}</span>
                  </div>
                  <p className="text-slate-300 leading-snug">{act.detail}</p>
                </div>
              ))}
            </div>
          </div>

          {/* AI recommendations desk */}
          <div className="bg-[#102043]/30 border border-white/5 rounded-[20px] p-4 flex flex-col gap-2.5">
            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono flex items-center gap-1.5">
              <Database className="w-3.5 h-3.5 text-indigo-400" /> AI Storage Optimization
            </h4>
            <p className="text-[10px] text-slate-400 leading-relaxed">
              Consortium storage nodes are processing 12.4 GB of IPFS uploads daily. Pinata cluster garbage collection scheduled for block #106000.
            </p>
          </div>

        </div>
      </aside>
    </div>
  );
}

export default function StandaloneWeb3Page() {
  return (
    <DbProvider>
      <Web3PageContent />
    </DbProvider>
  );
}
