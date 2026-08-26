'use client';

import React, { useState } from 'react';
import { 
  FileText, 
  Terminal, 
  Activity, 
  HelpCircle, 
  Fingerprint, 
  ShieldCheck, 
  ChevronRight,
  Code
} from 'lucide-react';

export default function ContractLogs() {
  const [selectedContract, setSelectedContract] = useState('dept_contract');

  const contractsList = [
    {
      id: 'dept_contract',
      name: 'DepartmentMeetingRegistry.sol',
      address: '0x1b790d984d720a45594efa4cbefe46df7db0e21',
      version: 'solc v0.8.20',
      gas: '42,500 Wei',
      description: 'Verifies department head signatures, logs meeting CIDs, and stores attestation records securely.',
      code: `pragma solidity ^0.8.20;

contract DepartmentMeetingRegistry {
    struct Attestation {
        bytes32 meetingHash;
        uint256 timestamp;
        address registrar;
    }

    mapping(bytes32 => Attestation) public logs;

    event MeetingAnchored(bytes32 indexed meetingHash, address indexed registrar);

    function anchorMeeting(bytes32 _meetingHash) external {
        logs[_meetingHash] = Attestation(_meetingHash, block.timestamp, msg.sender);
        emit MeetingAnchored(_meetingHash, msg.sender);
    }
}`
    },
    {
      id: 'research_contract',
      name: 'ResearchReviewRegistry.sol',
      address: '0x3cb4d720a455a1532ffeb9d22ffde46d7db0e21a',
      version: 'solc v0.8.20',
      gas: '55,200 Wei',
      description: 'Records peer review attestations, collaborator approvals, and registers grant references.',
      code: `pragma solidity ^0.8.20;

contract ResearchReviewRegistry {
    struct Review {
        bytes32 paperCID;
        address reviewer;
        bool approved;
        uint256 blockTime;
    }

    mapping(bytes32 => Review[]) public reviews;

    function submitReview(bytes32 _paperCID, bool _approved) external {
        reviews[_paperCID].push(Review(_paperCID, msg.sender, _approved, block.timestamp));
    }
}`
    },
    {
      id: 'committee_contract',
      name: 'FacultyCommitteeConsensus.sol',
      address: '0x81cf712d984efc464efb6088ffabce18ff940a01',
      version: 'solc v0.8.20',
      gas: '68,100 Wei',
      description: 'Manages multi-signature approvals for academic policy updates and board decisions.',
      code: `pragma solidity ^0.8.20;

contract FacultyCommitteeConsensus {
    address[] public committeeMembers;
    mapping(bytes32 => mapping(address => bool)) public approvals;

    function approveResolution(bytes32 _resolutionHash) external {
        approvals[_resolutionHash][msg.sender] = true;
    }
}`
    }
  ];

  const current = contractsList.find(c => c.id === selectedContract) || contractsList[0];

  return (
    <div className="w-full max-w-[900px] flex flex-col gap-6 text-left connect-font-inter">
      
      {/* Header */}
      <div className="border-b border-white/5 pb-3 mb-2 flex flex-col gap-1.5">
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <Terminal className="w-5 h-5 text-indigo-400" />
          CampusX Chain - Meeting Verification Smart Contracts
        </h2>
        <p className="text-xs text-slate-400 font-semibold">
          Review, analyze, and test cryptographic solidity rules deployed on-chain for university meetings.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-6">
        
        {/* Left Side: Contracts selection list */}
        <div className="flex flex-col gap-3">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-1">Contract Directory</span>
          <div className="flex flex-col gap-2.5">
            {contractsList.map((contract) => (
              <div 
                key={contract.id}
                onClick={() => setSelectedContract(contract.id)}
                className={`p-3.5 border rounded-2xl flex flex-col gap-1 cursor-pointer transition-all duration-150 ${
                  selectedContract === contract.id
                    ? 'bg-brand-primary/15 border-brand-primary/30 text-white'
                    : 'bg-[#102043]/20 border-white/5 text-slate-400 hover:border-white/10 hover:bg-[#102043]/30'
                }`}
              >
                <span className="text-xs font-bold text-white">{contract.name}</span>
                <code className="text-[9px] text-brand-accent-cyan font-mono mt-1.5 truncate">{contract.address}</code>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side: Details and source codes explorer */}
        <div className="bg-[#102043]/20 border border-white/5 rounded-[20px] p-6 flex flex-col gap-5">
          
          <div className="flex justify-between items-start flex-wrap gap-4 border-b border-white/5 pb-4">
            <div className="flex flex-col text-left">
              <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider">{current.version}</span>
              <h3 className="text-sm font-bold text-white mt-1 leading-snug">{current.name}</h3>
              <p className="text-xs text-slate-400 mt-2 font-medium">
                {current.description}
              </p>
            </div>
            <div className="flex items-center gap-1.5 bg-[#0B1736] px-3 py-1.5 border border-white/5 text-[10px] font-bold text-slate-400 rounded-xl">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Attested: {current.gas}</span>
            </div>
          </div>

          {/* Solidity Source code block */}
          <div className="flex flex-col gap-2">
            <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest pl-1 flex items-center gap-1.5">
              <Code className="w-3.5 h-3.5 text-slate-500" />
              Solidity Source Code
            </span>
            <pre className="p-4 bg-[#050b1a] rounded-2xl overflow-x-auto text-[10px] font-mono text-indigo-300 border border-white/5">
              {current.code}
            </pre>
          </div>

        </div>

      </div>

    </div>
  );
}
