'use client';

import React, { useState, useEffect } from 'react';
import { useDb } from '../../../context/db-context';
import { 
  Award, 
  FileCheck, 
  ShieldCheck, 
  Search, 
  TrendingUp, 
  Download, 
  Fingerprint, 
  Clock, 
  UserCheck, 
  AlertTriangle,
  Building,
  RefreshCw,
  Cpu
} from 'lucide-react';

export default function ResultsHub() {
  const { students, courses, transactions } = useDb();
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Selection states
  const [selectedStudent, setSelectedStudent] = useState('STU001');
  const [selectedSem, setSelectedSem] = useState('Semester 2');
  const [selectedCourse, setSelectedCourse] = useState('CS202');
  
  // State for search and audit logs
  const [explorerQuery, setExplorerQuery] = useState('');
  const [explorerResult, setExplorerResult] = useState(null);
  
  // Status lists
  const [marksApprovalList, setMarksApprovalList] = useState([
    { id: 'appr_01', course: 'CS202', student: 'Jackson Cole', score: '88%', status: 'Pending Coordinator' },
    { id: 'appr_02', course: 'CS202', student: 'Maya Lin', score: '92%', status: 'Approved' },
    { id: 'appr_03', course: 'CS302', student: 'Ravi Kumar', score: '74%', status: 'Pending Coordinator' }
  ]);
  
  const [blockchainRecords, setBlockchainRecords] = useState([
    { tx: '0x8f2d5c412f17ab8e92d7cbefe46df7db0e21a812', type: 'GRADE_LOCKED', data: 'CS202 Grade Lock [STU001]', date: '2026-06-23 10:14' },
    { tx: '0x9320e4da2b7a94ef88decf823abf26d7f021e05a', type: 'RESULT_APPROVED', data: 'Semester 1 Merit Roster Anchor', date: '2026-06-22 15:45' }
  ]);

  // AI Insights state
  const [aiRiskResult, setAiRiskResult] = useState(null);
  const [aiRiskLoading, setAiRiskLoading] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const session = sessionStorage.getItem('campusx_erp_session');
      if (session) {
        const parsed = JSON.parse(session);
        setCurrentUser(parsed);
      }
      setLoading(false);
    }
  }, []);

  // Compute stats
  const activeStudentId = currentUser?.role === 'student' ? 'STU001' : selectedStudent;
  
  const studentDatabase = {
    STU001: { name: 'Alex Rivera', dept: 'Computer Science', cgpa: 3.85, sgpa: 3.92, status: 'Distinction' },
    STU002: { name: 'Priya Nair', dept: 'Computer Science', cgpa: 3.94, sgpa: 3.98, status: 'First Class' },
    STU003: { name: 'Kabir Sen', dept: 'Electrical Eng', cgpa: 3.24, sgpa: 3.32, status: 'Second Class' }
  };

  const currentStudentData = studentDatabase[activeStudentId] || studentDatabase['STU001'];

  const mockTermResults = [
    { code: 'CS202', name: 'Data Structures & Algorithms', credits: 4, internal: 27, external: 58, practical: 9, total: 94, grade: 'A+', status: 'Passed' },
    { code: 'CS302', name: 'Database Management Systems', credits: 3, internal: 24, external: 51, practical: 8, total: 83, grade: 'A', status: 'Passed' },
    { code: 'CS305', name: 'Software Engineering', credits: 3, internal: 21, external: 44, practical: 9, total: 74, grade: 'B+', status: 'Passed' }
  ];

  // Actions
  const handleApproveMarks = (id) => {
    setMarksApprovalList(prev => prev.map(m => m.id === id ? { ...m, status: 'Approved' } : m));
    // Add to blockchain transaction log simulator
    const mockTx = '0x' + Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
    setBlockchainRecords(prev => [
      { tx: mockTx, type: 'MARKS_APPROVED', data: `Coordinator marks validation #${id}`, date: new Date().toISOString().replace('T', ' ').slice(0, 16) },
      ...prev
    ]);
    alert(`Marks approved successfully!\nCryptographic transaction anchored: ${mockTx}`);
  };

  const handleModerateGrades = () => {
    const mockTx = '0x' + Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
    setBlockchainRecords(prev => [
      { tx: mockTx, type: 'GRADE_MODERATION', data: 'HOD moderated grading scale constraints', date: new Date().toISOString().replace('T', ' ').slice(0, 16) },
      ...prev
    ]);
    alert(`Grading curve moderated and scales locked under contract.\nAudit transaction hash: ${mockTx}`);
  };

  const handlePublishResults = () => {
    const mockTx = '0x' + Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
    setBlockchainRecords(prev => [
      { tx: mockTx, type: 'RESULTS_PUBLISHED', data: 'Registrar published Semester 2 term index', date: new Date().toISOString().replace('T', ' ').slice(0, 16) },
      ...prev
    ]);
    alert(`Semester Results successfully published to student portal and registered on-chain.\nTx Hash: ${mockTx}`);
  };

  const handleIssueDegree = () => {
    const mockTx = '0x' + Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
    setBlockchainRecords(prev => [
      { tx: mockTx, type: 'DEGREE_ISSUED', data: `Soulbound SBT minted to student wallet #${activeStudentId}`, date: new Date().toISOString().replace('T', ' ').slice(0, 16) },
      ...prev
    ]);
    alert(`Degree SBT Minted successfully for ${currentStudentData.name}!\nConsortium tx verification: ${mockTx}`);
  };

  const handleVerifyExplorer = () => {
    const q = explorerQuery.trim().toLowerCase();
    if (!q) return;

    const matchedTx = blockchainRecords.find(r => r.tx.toLowerCase() === q);
    if (matchedTx) {
      setExplorerResult({ type: 'TX', data: matchedTx });
    } else if (q.includes('stu')) {
      setExplorerResult({ type: 'STUDENT', data: currentStudentData });
    } else {
      setExplorerResult({ type: 'NOT_FOUND' });
    }
  };

  // Run AI Advisor
  const runAiAdvisor = () => {
    setAiRiskLoading(true);
    setTimeout(() => {
      setAiRiskResult({
        predictedCgpa: (currentStudentData.cgpa * 1.01).toFixed(2),
        riskLevel: currentStudentData.cgpa < 3.5 ? 'Moderate Risk' : 'Low Academic Risk',
        riskDetails: 'Based on stable attendance of 94.2% and consistent mid-term grading curves, this student is predicted to complete the semester in the top 10% bracket.'
      });
      setAiRiskLoading(false);
    }, 1000);
  };

  if (loading || !currentUser) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="w-8 h-8 border-4 border-brand-primary/30 border-t-brand-primary rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 md:gap-8 text-brand-text-main">
      
      {/* Page Header */}
      <div className="flex justify-between items-center pb-4 border-b border-brand-border/40">
        <div>
          <h1 className="text-3xl font-display font-bold text-white tracking-tight flex items-center gap-3">
            <Award className="w-8 h-8 text-brand-primary" />
            Decentralized Results & Transcripts Hub
          </h1>
          <p className="text-brand-text-muted text-sm mt-1">Configure examinations metrics, approve grading distributions, verify Soulbound Token (SBT) degrees, and view records.</p>
        </div>
      </div>

      {/* Role specific control panel */}
      {currentUser.role !== 'student' && (
        <div className="card p-5 bg-brand-bg-secondary border border-brand-border rounded-2xl flex flex-col sm:flex-row gap-4 justify-between items-center">
          <div>
            <h3 className="m-0 text-sm font-semibold text-brand-text-main">Global Administrative Portal</h3>
            <p className="text-xs text-brand-text-muted mt-0.5 m-0">Audit specific student rosters, generate transcripts, and authorize actions.</p>
          </div>
          <div className="flex gap-3 w-full sm:w-auto">
            <select
              value={selectedStudent}
              onChange={(e) => setSelectedStudent(e.target.value)}
              className="bg-brand-bg-tertiary border border-brand-border text-brand-text-main px-4 py-2.5 rounded-xl text-xs outline-none font-semibold cursor-pointer w-full sm:w-60"
            >
              <option value="STU001">STU001 - Alex Rivera (CS)</option>
              <option value="STU002">STU002 - Priya Nair (CS)</option>
              <option value="STU003">STU003 - Kabir Sen (EE)</option>
            </select>
          </div>
        </div>
      )}

      {/* Basic Metrics Panels */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="card p-5 bg-brand-bg-secondary border border-brand-border rounded-2xl flex items-center justify-between">
          <div>
            <span className="text-brand-text-muted text-xs font-semibold">Active Student Profile</span>
            <span className="block text-xl font-bold font-display text-white mt-1">{currentStudentData.name}</span>
            <span className="text-[10px] text-brand-text-subtle mt-1 block">ID: {activeStudentId} • {currentStudentData.dept}</span>
          </div>
          <div className="p-3 bg-brand-primary/10 rounded-xl text-brand-primary">
            <UserCheck className="w-6 h-6" />
          </div>
        </div>

        <div className="card p-5 bg-brand-bg-secondary border border-brand-border rounded-2xl flex items-center justify-between">
          <div>
            <span className="text-brand-text-muted text-xs font-semibold">Cumulative GPA</span>
            <span className="block text-2xl font-bold font-display text-brand-accent-emerald mt-1">{currentStudentData.cgpa.toFixed(2)} CGPA</span>
            <span className="text-[10px] text-brand-accent-emerald mt-1 block">Status: {currentStudentData.status}</span>
          </div>
          <div className="p-3 bg-brand-accent-emerald/10 rounded-xl text-brand-accent-emerald">
            <ShieldCheck className="w-6 h-6" />
          </div>
        </div>

        <div className="card p-5 bg-brand-bg-secondary border border-brand-border rounded-2xl flex items-center justify-between">
          <div>
            <span className="text-brand-text-muted text-xs font-semibold">Semester GPA</span>
            <span className="block text-2xl font-bold font-display text-brand-accent-cyan mt-1">{currentStudentData.sgpa.toFixed(2)} SGPA</span>
            <span className="text-[10px] text-brand-text-subtle mt-1 block">Based on Sem 2 performance</span>
          </div>
          <div className="p-3 bg-brand-accent-cyan/10 rounded-xl text-brand-accent-cyan">
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Main Grid View */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Grade Roster & Workflows (2 Columns) */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          
          {/* Term Report card */}
          <div className="card p-6 bg-brand-bg-secondary border border-brand-border rounded-2xl flex flex-col gap-4">
            <div className="flex justify-between items-center border-b border-brand-border/40 pb-3">
              <h3 className="m-0 font-display text-base font-bold text-white">Subject Evaluation Details</h3>
              <div className="flex gap-2">
                {['Semester 1', 'Semester 2'].map(sem => (
                  <button
                    key={sem}
                    onClick={() => setSelectedSem(sem)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all ${selectedSem === sem ? 'bg-brand-primary text-white' : 'bg-brand-bg-tertiary text-brand-text-muted hover:text-brand-text-main'}`}
                  >
                    {sem}
                  </button>
                ))}
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-brand-border text-brand-text-subtle font-semibold">
                    <th className="pb-3">Code</th>
                    <th className="pb-3">Subject Name</th>
                    <th className="pb-3">Internal</th>
                    <th className="pb-3">External</th>
                    <th className="pb-3">Practical</th>
                    <th className="pb-3">Grade</th>
                    <th className="pb-3 text-right">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {mockTermResults.map((g, i) => (
                    <tr key={i} className="border-b border-brand-border/40 hover:bg-white/[0.01] transition-all">
                      <td className="py-4 font-mono font-semibold text-brand-accent-cyan">{g.code}</td>
                      <td className="py-4 font-semibold text-white">{g.name}</td>
                      <td className="py-4 font-mono text-brand-text-muted">{g.internal}/30</td>
                      <td className="py-4 font-mono text-brand-text-muted">{g.external}/60</td>
                      <td className="py-4 font-mono text-brand-text-muted">{g.practical}/10</td>
                      <td className="py-4">
                        <span className="font-display font-bold text-xs bg-brand-bg-tertiary border border-brand-border/60 px-2 py-0.5 rounded text-white font-mono">
                          {g.grade}
                        </span>
                      </td>
                      <td className="py-4 text-right">
                        <span className="badge bg-brand-accent-emerald/10 text-brand-accent-emerald font-semibold px-2 py-0.5 rounded">
                          {g.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Transcript Actions */}
            <div className="flex gap-4 justify-end mt-4 border-t border-brand-border/40 pt-4">
              <button 
                onClick={() => alert(`Official signed Transcript downloaded for student ID ${activeStudentId}`)}
                className="btn btn-secondary cursor-pointer text-xs flex items-center gap-1.5 py-2 px-4"
              >
                <Download className="w-4 h-4" /> Export Signed Transcript PDF
              </button>
              {currentUser.role === 'registrar' && (
                <button 
                  onClick={handleIssueDegree}
                  className="btn btn-primary cursor-pointer text-xs flex items-center gap-1.5 py-2 px-4"
                >
                  <Fingerprint className="w-4 h-4 text-white" /> Issue Soulbound Degree
                </button>
              )}
            </div>
          </div>

          {/* Workflow approval module for Course Coordinator & HOD */}
          {(currentUser.role === 'course_coordinator' || currentUser.role === 'hod' || currentUser.role === 'registrar') && (
            <div className="card p-6 bg-brand-bg-secondary border border-brand-border rounded-2xl flex flex-col gap-4">
              <span className="font-display text-sm font-bold text-white uppercase tracking-wider">Active Moderation & Approvals Workflow</span>
              
              <div className="flex flex-col gap-3">
                {currentUser.role === 'course_coordinator' && (
                  <div className="flex flex-col gap-3">
                    <span className="text-xs text-brand-text-muted">You have pending marks roster evaluations requiring signature:</span>
                    {marksApprovalList.map((m) => (
                      <div key={m.id} className="p-3 bg-brand-bg-tertiary/60 border border-brand-border/40 rounded-xl text-xs flex justify-between items-center">
                        <div className="flex flex-col text-left">
                          <span className="font-bold text-white">{m.student} ({m.course})</span>
                          <span className="text-[10px] text-brand-text-muted mt-1">Raw Score: {m.score}</span>
                        </div>
                        <div className="flex gap-2">
                          {m.status === 'Approved' ? (
                            <span className="badge bg-brand-accent-emerald/10 text-brand-accent-emerald px-2.5 py-0.5 rounded font-bold">Approved</span>
                          ) : (
                            <button 
                              onClick={() => handleApproveMarks(m.id)}
                              className="btn btn-primary btn-sm text-xs py-1 px-3"
                            >
                              Approve Marks
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {currentUser.role === 'hod' && (
                  <div className="flex flex-col gap-3 items-start">
                    <span className="text-xs text-brand-text-muted">Moderate course grade distributions for the Department of Computer Science:</span>
                    <div className="p-4 bg-brand-bg-tertiary/60 border border-brand-border/40 rounded-xl text-xs text-left w-full flex justify-between items-center">
                      <div>
                        <span className="font-bold text-white block">Course grading curves (CS202)</span>
                        <span className="text-[10px] text-brand-text-muted mt-1 block">Current curve factor: 1.0 (Absolute). Moderate to lock on-chain.</span>
                      </div>
                      <button 
                        onClick={handleModerateGrades}
                        className="btn btn-primary py-2 px-4 text-xs font-semibold"
                      >
                        Moderate & Lock Grades
                      </button>
                    </div>
                  </div>
                )}

                {currentUser.role === 'registrar' && (
                  <div className="flex flex-col gap-3 items-start">
                    <span className="text-xs text-brand-text-muted">Consortium publication ledger operations:</span>
                    <button 
                      onClick={handlePublishResults}
                      className="btn btn-primary py-2 px-5 text-xs font-bold"
                    >
                      Publish Semester Results
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: AI Advisors and Blockchain Explorer */}
        <div className="flex flex-col gap-6 text-left">
          
          {/* AI Advisory Panel */}
          <div className="card p-6 bg-brand-bg-secondary border border-brand-border rounded-2xl flex flex-col gap-4">
            <div className="flex items-center gap-2 border-b border-brand-border pb-3">
              <Cpu className="w-5 h-5 text-brand-primary" />
              <span className="font-display text-sm font-bold text-white">AI Academic Advisory Advisor</span>
            </div>
            
            <p className="text-xs text-brand-text-muted">Predict outcomes, evaluate credit failure risk coefficients, and run gradient descent calculations on attendance scores.</p>
            
            <button 
              onClick={runAiAdvisor}
              className="btn btn-primary w-full py-2.5 text-xs font-bold"
              disabled={aiRiskLoading}
            >
              {aiRiskLoading ? 'Calculating Predictions...' : 'Generate Academic Risk Insights'}
            </button>

            {aiRiskResult && (
              <div className="p-4 rounded-xl border border-brand-border bg-brand-bg-tertiary/60 text-xs flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-white">Risk Status:</span>
                  <span className="badge bg-brand-accent-emerald/20 text-brand-accent-emerald font-bold rounded px-2 py-0.5">{aiRiskResult.riskLevel}</span>
                </div>
                <div>Predicted CGPA Point: <strong className="text-white font-mono text-sm">{aiRiskResult.predictedCgpa}</strong></div>
                <p className="text-[10px] text-brand-text-muted leading-relaxed m-0 mt-1 border-t border-white/5 pt-1.5">{aiRiskResult.riskDetails}</p>
              </div>
            )}
          </div>

          {/* Blockchain Registry Explorer */}
          <div className="card p-6 bg-brand-bg-secondary border border-brand-border rounded-2xl flex flex-col gap-4">
            <div className="flex items-center gap-2 border-b border-brand-border pb-3">
              <Fingerprint className="w-5 h-5 text-brand-accent-cyan" />
              <span className="font-display text-sm font-bold text-white">CampusX Chain Explorer</span>
            </div>

            <p className="text-xs text-brand-text-muted">Validate cryptographic degrees and transcript hashes stored on-chain.</p>

            <div className="flex flex-col gap-2 text-xs">
              <input 
                type="text" 
                placeholder="Enter Student ID or Block Hash..." 
                value={explorerQuery}
                onChange={(e) => setExplorerQuery(e.target.value)}
                className="bg-brand-bg-tertiary border border-brand-border rounded-xl p-2.5 text-white outline-none focus:border-brand-primary"
              />
              <button 
                onClick={handleVerifyExplorer}
                className="btn btn-secondary py-2 font-semibold"
              >
                Query Ledger
              </button>
            </div>

            {explorerResult && (
              <div className="p-3 bg-brand-bg-tertiary/60 border border-brand-border/40 rounded-xl text-xs flex flex-col gap-1.5">
                {explorerResult.type === 'NOT_FOUND' ? (
                  <span className="text-brand-accent-ruby font-semibold">No blockchain records matched.</span>
                ) : explorerResult.type === 'TX' ? (
                  <div className="flex flex-col gap-1.5">
                    <span className="text-brand-accent-emerald font-semibold flex items-center gap-1">✓ Transaction Valid</span>
                    <div>Type: <strong className="text-white font-mono">{explorerResult.data.type}</strong></div>
                    <div>Metadata: <strong className="text-white">{explorerResult.data.data}</strong></div>
                    <code className="text-[9px] text-brand-accent-cyan break-all font-mono">TX: {explorerResult.data.tx}</code>
                  </div>
                ) : (
                  <div className="flex flex-col gap-1.5">
                    <span className="text-brand-accent-emerald font-semibold">✓ Student ID Found</span>
                    <div>Name: <strong className="text-white">{explorerResult.data.name}</strong></div>
                    <div>Department: <strong className="text-white">{explorerResult.data.dept}</strong></div>
                    <div>CGPA Index: <strong className="text-white">{explorerResult.data.cgpa}</strong></div>
                  </div>
                )}
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
