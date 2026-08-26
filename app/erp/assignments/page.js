'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useDb } from '../../../context/db-context';
import { 
  BookOpen, 
  Upload, 
  Sparkles, 
  FileText, 
  Clock, 
  CheckSquare, 
  Fingerprint, 
  AlertTriangle,
  FolderOpen,
  Send,
  User,
  Trash2,
  X,
  Check
} from 'lucide-react';

export default function AssignmentsDashboard() {
  const { students, courses } = useDb();
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Assignments registry
  const [assignments, setAssignments] = useState([
    { id: 'ASN001', course: 'CS202', title: 'Balanced AVL Trees Implementation', dueDate: '2026-06-28', status: 'Published', weight: 15, rubric: 'Code: 50%, Logic: 50%' },
    { id: 'ASN002', course: 'CS202', title: 'Red-Black Trees Analysis', dueDate: '2026-07-02', status: 'Draft', weight: 10, rubric: 'Written: 100%' }
  ]);

  // Submissions list
  const [submissions, setSubmissions] = useState([
    { id: 'sub_101', assignmentId: 'ASN001', student: 'Alex Rivera', file: 'avl_trees_final.zip', date: '2026-06-22 14:10', score: null, feedback: '', integrityScore: 98, status: 'Submitted', txHash: '0x3f5c7a1b41d2e92d' }
  ]);

  // Form states
  const [newAsn, setNewAsn] = useState({ title: '', courseCode: 'CS202', dueDate: '2026-07-05', weight: 10, rubric: 'Completeness: 100%' });
  const [selectedSubmissionId, setSelectedSubmissionId] = useState('');
  const [selectedAssignmentId, setSelectedAssignmentId] = useState('ASN001');
  const [selectedFile, setSelectedFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);
  
  // AI assistant states
  const [aiGenerating, setAiGenerating] = useState(false);
  const [evalScore, setEvalScore] = useState(85);
  const [evalFeedback, setEvalFeedback] = useState('Satisfactory code structure. Good comments.');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const session = sessionStorage.getItem('campusx_erp_session');
      if (session) {
        setCurrentUser(JSON.parse(session));
      }
      setLoading(false);
    }
  }, []);

  const handleCreateAssignment = (e) => {
    e.preventDefault();
    if (!newAsn.title.trim()) return;

    const newObj = {
      id: 'ASN' + String(assignments.length + 1).padStart(3, '0'),
      course: newAsn.courseCode,
      title: newAsn.title,
      dueDate: newAsn.dueDate,
      status: 'Published',
      weight: newAsn.weight,
      rubric: newAsn.rubric
    };

    setAssignments(prev => [newObj, ...prev]);
    setNewAsn(prev => ({ ...prev, title: '' }));
    alert('Assignment created successfully and broadcasted to students.');
  };

  // AI Rubric Generator
  const runAiRubricGenerator = () => {
    setAiGenerating(true);
    setTimeout(() => {
      setNewAsn(prev => ({
        ...prev,
        rubric: 'Logic Completeness (40%), Unit Test Coverage (30%), Code Style & Optimization (30%)'
      }));
      setAiGenerating(false);
      alert('AI Rubric parameters successfully calibrated for Advanced Algorithms syllabus constraints.');
    }, 800);
  };

  const handleGradeSubmission = (subId) => {
    setSubmissions(prev => prev.map(s => s.id === subId ? { ...s, score: evalScore, feedback: evalFeedback, status: 'Evaluated' } : s));
    alert('Student submission evaluated. Signature logged on-chain.');
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setSelectedFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleSubmitHomework = () => {
    if (!selectedFile) {
      alert('Please upload a file before submitting.');
      return;
    }
    
    const targetAsn = assignments.find(a => a.id === selectedAssignmentId) || assignments[0];
    const generatedTx = '0x' + Math.random().toString(16).substring(2, 10) + Math.random().toString(16).substring(2, 10);
    
    const newSubmission = {
      id: 'sub_' + (submissions.length + 101),
      assignmentId: targetAsn.id,
      student: currentUser.name || currentUser.email,
      file: selectedFile.name,
      date: new Date().toISOString().replace('T', ' ').substring(0, 16),
      score: null,
      feedback: '',
      integrityScore: Math.floor(Math.random() * 10) + 90, // mock 90-99%
      status: 'Submitted',
      txHash: generatedTx
    };

    setSubmissions(prev => [newSubmission, ...prev]);
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    alert(`Assignment submission file "${selectedFile.name}" successfully anchored to blockchain state registry.\nTransaction Hash: ${generatedTx}`);
  };

  const activeSubmission = submissions.find(s => s.id === selectedSubmissionId);

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
            <BookOpen className="w-8 h-8 text-brand-primary" />
            Coursework Assignments & Faculty Review
          </h1>
          <p className="text-brand-text-muted text-sm mt-1">Design graded student assignments, auto-generate evaluation rubrics, and run academic integrity checks.</p>
        </div>
      </div>

      {/* Main Grid Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Columns: Assignment Roster & Review Module (2 Columns) */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          
          {/* Create Assignment Form */}
          {currentUser.role === 'faculty' && (
            <div className="card p-6 bg-brand-bg-secondary border border-brand-border rounded-2xl flex flex-col gap-4">
              <span className="font-display text-sm font-bold text-white uppercase tracking-wider">Publish Graded Coursework</span>
              
              <form onSubmit={handleCreateAssignment} className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-left">
                <div className="flex flex-col gap-1.5 md:col-span-2">
                  <label className="font-bold text-brand-text-subtle">Assignment Title</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Balanced Tree Rotations" 
                    value={newAsn.title}
                    onChange={(e) => setNewAsn({ ...newAsn, title: e.target.value })}
                    className="bg-brand-bg-tertiary border border-brand-border rounded-xl p-2.5 text-white outline-none focus:border-brand-primary"
                    required
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="font-bold text-brand-text-subtle">Course Selection</label>
                  <select 
                    value={newAsn.courseCode}
                    onChange={(e) => setNewAsn({ ...newAsn, courseCode: e.target.value })}
                    className="bg-brand-bg-tertiary border border-brand-border rounded-xl p-2.5 text-white outline-none cursor-pointer"
                  >
                    <option value="CS202">CS202 - Data Structures</option>
                    <option value="CS302">CS302 - Database Systems</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="font-bold text-brand-text-subtle">Due Date</label>
                  <input 
                    type="date" 
                    value={newAsn.dueDate}
                    onChange={(e) => setNewAsn({ ...newAsn, dueDate: e.target.value })}
                    className="bg-brand-bg-tertiary border border-brand-border rounded-xl p-2.5 text-white outline-none"
                  />
                </div>

                <div className="flex flex-col gap-1.5 md:col-span-2">
                  <div className="flex justify-between items-center mb-1">
                    <label className="font-bold text-brand-text-subtle">Grading Rubric Specifications</label>
                    <button 
                      type="button" 
                      onClick={runAiRubricGenerator}
                      className="text-brand-primary text-[10px] hover:underline flex items-center gap-1 cursor-pointer font-semibold"
                    >
                      <Sparkles className="w-3 h-3 text-brand-primary" /> AI Generate Rubric Parameters
                    </button>
                  </div>
                  <input 
                    type="text" 
                    value={newAsn.rubric}
                    onChange={(e) => setNewAsn({ ...newAsn, rubric: e.target.value })}
                    className="bg-brand-bg-tertiary border border-brand-border rounded-xl p-2.5 text-white outline-none"
                  />
                </div>

                <button 
                  type="submit" 
                  className="btn btn-primary md:col-span-2 py-3 rounded-xl font-bold mt-2"
                >
                  Publish Assignment
                </button>
              </form>
            </div>
          )}

          {/* Assignments roster list */}
          <div className="card p-6 bg-brand-bg-secondary border border-brand-border rounded-2xl flex flex-col gap-4">
            <span className="font-display text-sm font-bold text-white uppercase tracking-wider">Active Course Assignments</span>
            <div className="flex flex-col gap-3">
              {assignments.map((a, i) => (
                <div key={i} className="p-4 bg-brand-bg-tertiary/60 border border-brand-border/40 rounded-xl text-xs flex justify-between items-center">
                  <div className="flex flex-col text-left">
                    <span className="font-bold text-white text-sm">{a.title}</span>
                    <span className="text-[10px] text-brand-text-muted mt-1">Course: {a.course} • Rubric: {a.rubric}</span>
                  </div>
                  <div className="flex flex-col items-end gap-1.5">
                    <span className="badge bg-brand-accent-amber/10 text-brand-accent-amber font-bold px-2 py-0.5 rounded">Due: {a.dueDate}</span>
                    <span className="text-[10px] text-brand-text-subtle font-mono">Weight: {a.weight}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column: AI review panels and student submission forms */}
        <div className="flex flex-col gap-6 text-left">
          
          {/* Submission and AI Grading Review Panel */}
          {currentUser.role === 'faculty' && (
            <div className="card p-6 bg-brand-bg-secondary border border-brand-border rounded-2xl flex flex-col gap-4">
              <span className="font-display text-sm font-bold text-white uppercase tracking-wider">Faculty Evaluation Review Center</span>
              
              <div className="flex flex-col gap-3 text-xs">
                <div className="flex flex-col gap-1.5">
                  <label className="font-bold text-brand-text-subtle">Select Pending Submission</label>
                  <select 
                    value={selectedSubmissionId}
                    onChange={(e) => setSelectedSubmissionId(e.target.value)}
                    className="w-full bg-brand-bg-tertiary border border-brand-border p-2.5 rounded-xl outline-none cursor-pointer"
                  >
                    <option value="">-- Choose Submission --</option>
                    {submissions.map(s => <option key={s.id} value={s.id}>{s.student} ({s.file})</option>)}
                  </select>
                </div>

                {activeSubmission ? (
                  <div className="p-4 bg-brand-bg-tertiary border border-brand-border rounded-xl flex flex-col gap-4">
                    <div className="flex justify-between items-start border-b border-brand-border/40 pb-2">
                      <div>
                        <span className="text-[9px] text-brand-text-subtle font-bold block uppercase">Plagiarism/Integrity Rating</span>
                        <strong className="text-brand-accent-emerald font-mono">{activeSubmission.integrityScore}% Original</strong>
                      </div>
                      <span className="badge bg-brand-primary/10 text-brand-primary font-bold px-2 py-0.5 rounded">{activeSubmission.status}</span>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="font-bold text-brand-text-subtle">Score Entry (0-100)</label>
                      <input 
                        type="number" 
                        value={evalScore}
                        onChange={(e) => setEvalScore(parseInt(e.target.value) || 0)}
                        className="bg-brand-bg-secondary border border-brand-border p-2 rounded-lg text-white"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="font-bold text-brand-text-subtle">Evaluation Comments</label>
                      <textarea 
                        value={evalFeedback}
                        onChange={(e) => setEvalFeedback(e.target.value)}
                        className="bg-brand-bg-secondary border border-brand-border p-2 rounded-lg text-white h-20 resize-none"
                      />
                    </div>

                    <button 
                      onClick={() => handleGradeSubmission(activeSubmission.id)}
                      className="btn btn-primary w-full py-2 text-xs font-bold"
                    >
                      Lock Grade Assessment
                    </button>
                  </div>
                ) : (
                  <div className="p-4 border border-dashed border-brand-border rounded-xl bg-white/[0.01] text-brand-text-muted text-center">
                    Select a student submission from the list to initiate grading review.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Student Upload Form */}
          {currentUser.role === 'student' && (
            <div className="flex flex-col gap-6">
              <div className="card p-6 bg-brand-bg-secondary border border-brand-border rounded-2xl flex flex-col gap-4">
                <div className="flex items-center gap-2 border-b border-brand-border pb-3">
                  <Upload className="w-5 h-5 text-brand-primary" />
                  <span className="font-display text-sm font-bold text-white">Upload Homework Submission</span>
                </div>

                <div className="flex flex-col gap-3.5 text-xs text-left">
                  <div className="flex flex-col gap-1.5">
                    <label className="font-bold text-brand-text-subtle">Target Assignment</label>
                    <select 
                      value={selectedAssignmentId}
                      onChange={(e) => setSelectedAssignmentId(e.target.value)}
                      className="w-full bg-brand-bg-tertiary border border-brand-border p-2.5 rounded-xl outline-none cursor-pointer text-white"
                    >
                      {assignments.map(a => <option key={a.id} value={a.id}>{a.title}</option>)}
                    </select>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="font-bold text-brand-text-subtle">Upload Notebook/ZIP Archive</label>
                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      onChange={handleFileChange} 
                      className="hidden" 
                      accept=".zip,.ipynb,.tar.gz,.rar,.pdf" 
                    />
                    <div 
                      onClick={() => fileInputRef.current?.click()}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                      className={`border border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
                        isDragging 
                          ? 'border-brand-primary bg-brand-primary/10' 
                          : selectedFile 
                            ? 'border-brand-accent-emerald bg-brand-accent-emerald/5' 
                            : 'border-brand-border bg-brand-bg-tertiary/40 hover:bg-brand-primary/5'
                      }`}
                    >
                      {selectedFile ? (
                        <div className="flex flex-col items-center gap-1">
                          <Check className="w-8 h-8 text-brand-accent-emerald mb-2 animate-bounce" />
                          <span className="text-white font-bold max-w-full truncate block">{selectedFile.name}</span>
                          <span className="text-[10px] text-brand-text-muted">{(selectedFile.size / 1024).toFixed(1)} KB</span>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedFile(null);
                              if (fileInputRef.current) fileInputRef.current.value = '';
                            }}
                            className="mt-3 text-brand-accent-ruby hover:underline font-semibold flex items-center gap-1 text-[10px] mx-auto"
                          >
                            <Trash2 className="w-3.5 h-3.5" /> Remove File
                          </button>
                        </div>
                      ) : (
                        <>
                          <FileText className="w-8 h-8 text-brand-text-muted mx-auto mb-2" />
                          <span className="text-[10px] text-brand-text-subtle block">Drag and drop file here, or click to browse</span>
                          <span className="text-[9px] text-brand-text-muted block mt-1">Supports ZIP, IPYNB (Max 50MB)</span>
                        </>
                      )}
                    </div>
                  </div>

                  <button 
                    onClick={handleSubmitHomework}
                    className="btn btn-primary w-full py-2.5 text-xs font-bold"
                  >
                    Submit Graded Homework
                  </button>
                </div>
              </div>

              {/* Your Submissions Registry */}
              <div className="card p-6 bg-brand-bg-secondary border border-brand-border rounded-2xl flex flex-col gap-4">
                <div className="flex items-center gap-2 border-b border-brand-border pb-3">
                  <CheckSquare className="w-5 h-5 text-brand-accent-emerald" />
                  <span className="font-display text-sm font-bold text-white">Your Submissions Registry</span>
                </div>
                
                <div className="flex flex-col gap-3">
                  {submissions.filter(s => {
                    const userBase = (currentUser.name || '').toLowerCase().replace(' (student)', '');
                    const subBase = (s.student || '').toLowerCase().replace(' (student)', '');
                    return subBase.includes(userBase) || userBase.includes(subBase);
                  }).length === 0 ? (
                    <div className="text-center py-6 text-brand-text-muted text-xs">
                      No submissions logged in this registry yet.
                    </div>
                  ) : (
                    submissions.filter(s => {
                      const userBase = (currentUser.name || '').toLowerCase().replace(' (student)', '');
                      const subBase = (s.student || '').toLowerCase().replace(' (student)', '');
                      return subBase.includes(userBase) || userBase.includes(subBase);
                    }).map(sub => {
                      const asn = assignments.find(a => a.id === sub.assignmentId) || { title: 'Unknown Assignment' };
                      return (
                        <div key={sub.id} className="p-3 bg-brand-bg-tertiary border border-brand-border/40 rounded-xl text-xs flex flex-col gap-2">
                          <div className="flex justify-between items-start">
                            <div className="flex flex-col text-left">
                              <span className="font-bold text-white">{asn.title}</span>
                              <span className="text-[10px] text-brand-text-muted font-mono mt-0.5">{sub.file}</span>
                            </div>
                            <span className={`badge px-2 py-0.5 rounded font-bold ${
                              sub.status === 'Evaluated'
                                ? 'bg-brand-accent-emerald/10 text-brand-accent-emerald'
                                : 'bg-brand-primary/10 text-brand-primary'
                            }`}>
                              {sub.status}
                            </span>
                          </div>
                          
                          <div className="flex justify-between items-center text-[10px] text-brand-text-subtle border-t border-brand-border/20 pt-2 font-mono">
                            <span>Date: {sub.date}</span>
                            {sub.score !== null ? (
                              <span className="text-brand-accent-emerald font-bold">Grade: {sub.score}/100</span>
                            ) : (
                              <span className="text-brand-text-muted">Awaiting Review</span>
                            )}
                          </div>
                          
                          {sub.feedback && (
                            <div className="text-[10px] bg-brand-bg-secondary p-2 rounded border border-brand-border text-brand-text-muted italic">
                              Faculty: "{sub.feedback}"
                            </div>
                          )}

                          {sub.txHash && (
                            <div className="text-[8px] text-brand-text-muted flex items-center gap-1 mt-1 opacity-70">
                              <Fingerprint className="w-3 h-3 text-brand-primary" />
                              <span>Blockchain Proof Secured: {sub.txHash}</span>
                            </div>
                          )}
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
