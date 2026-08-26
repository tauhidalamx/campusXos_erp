'use client';

import React, { useState, useEffect } from 'react';
import { 
  Bot, 
  Sparkles, 
  Search, 
  FileText, 
  Upload, 
  TrendingUp, 
  AlertTriangle, 
  Cpu, 
  Layers, 
  FileSearch,
  CheckCircle,
  BarChart3
} from 'lucide-react';

export default function AIAssistantPage() {
  const [currentUser, setCurrentUser] = useState(null);
  
  // Document Chat & RAG States
  const [uploadedDocs, setUploadedDocs] = useState([
    { name: 'CS202_Syllabus_Outline.txt', size: '24 KB', date: 'June 10, 2026', chunks: 12 },
    { name: 'Campus_Housing_Policy_2026.pdf', size: '142 KB', date: 'June 05, 2026', chunks: 54 }
  ]);
  const [ragQuery, setRagQuery] = useState('');
  const [isRaging, setIsRaging] = useState(false);
  const [ragResults, setRagResults] = useState(null);

  // ML Predictor coefficients & inputs (interactive)
  const [customGpa, setCustomGpa] = useState(3.4);
  const [customAttendance, setCustomAttendance] = useState(85);
  const [calculatedPlacement, setCalculatedPlacement] = useState(null);
  const [calculatedDropout, setCalculatedDropout] = useState(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const session = sessionStorage.getItem('campusx_erp_session');
      if (session) {
        setCurrentUser(JSON.parse(session));
      }
    }
  }, []);

  // Recalculate ML Risk indicators
  useEffect(() => {
    // Simple mock weights based on logistic regressions
    const gpaFactor = (customGpa / 4.0) * 10;
    const attFactor = (customAttendance / 100.0) * 10;
    
    // Placement odds: high GPA & high attendance = high odds
    const placementOdds = Math.min(Math.round((gpaFactor * 0.7 + attFactor * 0.3) * 10), 100);
    setCalculatedPlacement(placementOdds);

    // Dropout risk: low attendance & low GPA = high risk
    const baseRisk = 100 - (gpaFactor * 0.5 + attFactor * 0.5) * 10;
    setCalculatedDropout(Math.max(Math.min(Math.round(baseRisk), 100), 0));
  }, [customGpa, customAttendance]);

  // Execute RAG matching search
  const executeRagSearch = () => {
    if (!ragQuery.trim()) return;
    setIsRaging(true);
    setRagResults(null);

    setTimeout(() => {
      let answer = "";
      let sourceDocs = [];
      const lower = ragQuery.toLowerCase();

      if (lower.includes('syllabus') || lower.includes('cs202')) {
        answer = "Based on `CS202_Syllabus_Outline.txt`, the course covers Data Structures (Trees, Graphs, Hash Maps) and Algorithms (Sorting, Search, Dynamic Programming). Grading weights: 30% Midterms, 40% Final Exam, 20% Assignments, 10% Class Attendance.";
        sourceDocs = [{ doc: 'CS202_Syllabus_Outline.txt', similarity: 0.94, snippet: "CS202 Grade weighting: Exams constitute 70% of total score..." }];
      } else if (lower.includes('housing') || lower.includes('policy') || lower.includes('hostel')) {
        answer = "According to the `Campus_Housing_Policy_2026.pdf`, hostel clearance is mandatory before each term end. Quiet hours are enforced starting at 10 PM. Overnight guest requests must be logged 24 hours in advance through the Hostel tab.";
        sourceDocs = [{ doc: 'Campus_Housing_Policy_2026.pdf', similarity: 0.91, snippet: "Hostel residents must observe quiet hours starting 22:00..." }];
      } else {
        answer = "I searched the vector database indexes but found no specific document chunks matching that topic. Returning a general campus answer: Please check the announcements portal or the library directories for corresponding physical manuals.";
        sourceDocs = [];
      }

      setRagResults({ answer, sourceDocs });
      setIsRaging(false);
    }, 1200);
  };

  // Upload new doc simulation
  const simulateDocUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const newDoc = {
        name: file.name,
        size: `${Math.round(file.size / 1024)} KB`,
        date: new Date().toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }),
        chunks: Math.round(Math.random() * 20) + 5
      };
      setUploadedDocs(prev => [newDoc, ...prev]);
      alert(`✅ RAG indexing complete!\nUploaded and vectorized: ${file.name}`);
    }
  };

  return (
    <div className="flex flex-col gap-6 md:gap-8 animate-fade-in text-brand-text-main">
      
      {/* Analytics widgets dashboard grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        <div className="card p-5 bg-brand-bg-secondary border border-brand-border rounded-2xl flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[10px] text-brand-text-subtle font-bold uppercase tracking-wider">Cohort Dropout Risk</span>
            <span className="text-xl font-bold font-mono mt-1.5">4.2%</span>
            <span className="text-[10px] text-brand-accent-emerald mt-1.5 font-semibold">✓ Safe Range</span>
          </div>
          <div className="p-3 bg-brand-accent-emerald/10 text-brand-accent-emerald rounded-xl">
            <AlertTriangle className="w-5 h-5" />
          </div>
        </div>

        <div className="card p-5 bg-brand-bg-secondary border border-brand-border rounded-2xl flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[10px] text-brand-text-subtle font-bold uppercase tracking-wider">Avg Placement Odds</span>
            <span className="text-xl font-bold font-mono mt-1.5">88.5%</span>
            <span className="text-[10px] text-brand-primary mt-1.5 font-semibold">Stable Forecast</span>
          </div>
          <div className="p-3 bg-brand-primary/10 text-brand-primary rounded-xl">
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>

        <div className="card p-5 bg-brand-bg-secondary border border-brand-border rounded-2xl flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[10px] text-brand-text-subtle font-bold uppercase tracking-wider">Research citation index</span>
            <span className="text-xl font-bold font-mono mt-1.5">+14.2%</span>
            <span className="text-[10px] text-brand-accent-cyan mt-1.5 font-semibold">Strong growth</span>
          </div>
          <div className="p-3 bg-brand-accent-cyan/10 text-brand-accent-cyan rounded-xl">
            <Cpu className="w-5 h-5" />
          </div>
        </div>

        <div className="card p-5 bg-brand-bg-secondary border border-brand-border rounded-2xl flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[10px] text-brand-text-subtle font-bold uppercase tracking-wider">Revenue Clearance</span>
            <span className="text-xl font-bold font-mono mt-1.5">84.1%</span>
            <span className="text-[10px] text-brand-accent-amber mt-1.5 font-semibold">On target</span>
          </div>
          <div className="p-3 bg-brand-accent-amber/10 text-brand-accent-amber rounded-xl">
            <Layers className="w-5 h-5" />
          </div>
        </div>

      </div>

      {/* Main workspace section split */}
      <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-8">
        
        {/* RAG search window console */}
        <div className="flex flex-col gap-6">
          <div className="card p-6 bg-brand-bg-secondary border border-brand-border rounded-2xl flex flex-col gap-4">
            
            <div className="flex justify-between items-center border-b border-brand-border pb-4">
              <div className="flex items-center gap-2">
                <Bot className="w-5 h-5 text-brand-primary animate-pulse" />
                <h3 className="font-display text-base font-bold text-white">RAG Document Chat & Semantic Vector Search</h3>
              </div>
              <span className="text-[9px] bg-brand-primary/20 text-brand-primary px-2.5 py-1 rounded-lg font-bold">DeepSeek-RAG v3</span>
            </div>

            <div className="flex gap-2">
              <div className="flex-1 search-bar flex items-center bg-brand-bg-tertiary border border-brand-border rounded-xl px-4 py-2.5 gap-2">
                <Search className="w-4 h-4 text-brand-text-subtle" />
                <input 
                  type="text" 
                  placeholder="Ask a question about syllabus, housing policies..." 
                  className="bg-transparent border-none text-xs text-white outline-none w-full placeholder-brand-text-subtle"
                  value={ragQuery}
                  onChange={(e) => setRagQuery(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') executeRagSearch(); }}
                />
              </div>
              <button 
                onClick={executeRagSearch}
                className="btn btn-primary cursor-pointer text-xs font-semibold py-3 px-5 rounded-xl shadow-md"
              >
                Query Vector DB
              </button>
            </div>

            {/* Answer display viewport */}
            <div className="min-h-[220px] bg-brand-bg-primary/20 border border-brand-border/60 rounded-xl p-5 flex flex-col gap-4 text-xs leading-relaxed">
              {isRaging ? (
                <div className="flex-1 flex flex-col items-center justify-center gap-3 py-12">
                  <div className="w-8 h-8 border-2 border-brand-primary/20 border-t-brand-primary rounded-full animate-spin"></div>
                  <span className="text-xs text-brand-text-subtle font-semibold">Running cosine semantic lookup and summarization...</span>
                </div>
              ) : ragResults ? (
                <div className="flex flex-col gap-4 animate-fade-in">
                  
                  {/* Text Answer */}
                  <div className="flex flex-col gap-1.5">
                    <span className="text-[9px] font-bold text-brand-primary uppercase tracking-wider">AI Answer Synthesis</span>
                    <div className="p-3 bg-brand-bg-tertiary border border-brand-border rounded-xl text-white font-medium">
                      {ragResults.answer}
                    </div>
                  </div>

                  {/* Document Sources Cited */}
                  {ragResults.sourceDocs.length > 0 && (
                    <div className="flex flex-col gap-2">
                      <span className="text-[9px] font-bold text-brand-text-subtle uppercase tracking-wider">Sources Cited</span>
                      {ragResults.sourceDocs.map((src, sidx) => (
                        <div key={sidx} className="p-3 bg-brand-bg-tertiary/40 border border-brand-border rounded-xl flex flex-col gap-1">
                          <div className="flex justify-between items-center text-[10px] font-semibold text-brand-accent-emerald">
                            <span className="flex items-center gap-1">
                              <FileText className="w-3.5 h-3.5" />
                              {src.doc}
                            </span>
                            <span className="font-mono">Match: {(src.similarity * 100).toFixed(0)}%</span>
                          </div>
                          <p className="text-[10px] text-brand-text-muted mt-1 leading-normal italic">"{src.snippet}"</p>
                        </div>
                      ))}
                    </div>
                  )}

                </div>
              ) : (
                <div className="flex-grow flex flex-col items-center justify-center gap-3 text-center py-12 text-brand-text-muted">
                  <FileSearch className="w-10 h-10 text-brand-text-subtle" />
                  <div>
                    <h4 className="font-bold text-white text-sm">Query Vector Ledger</h4>
                    <p className="text-[11px] text-brand-text-subtle mt-1.5 max-w-xs leading-normal">Enter a question above. The engine will retrieve relevant chunks from matching files in the vector database.</p>
                  </div>
                </div>
              )}
            </div>

          </div>

          {/* AI Recommended Interventions */}
          <div className="card p-6 bg-brand-bg-secondary border border-brand-border rounded-2xl flex flex-col gap-4">
            <h3 className="font-display text-sm font-bold text-white border-b border-brand-border pb-3">AI Recommended Interventions</h3>
            
            <div className="flex flex-col gap-3.5">
              <div className="p-3.5 bg-brand-accent-ruby/5 border border-brand-accent-ruby/25 rounded-xl flex items-start gap-3 text-xs leading-relaxed">
                <AlertTriangle className="w-4 h-4 text-brand-accent-ruby shrink-0 mt-0.5" />
                <div className="flex flex-col">
                  <strong className="text-brand-accent-ruby font-semibold">Low Attendance Risk: CS202</strong>
                  <p className="text-brand-text-muted mt-1">CS202 Data Structures holds a cohort average attendance of 72.1%. Recommended: issue automated notifications to students below 75% threshold immediately.</p>
                </div>
              </div>
              
              <div className="p-3.5 bg-brand-accent-amber/5 border border-brand-accent-amber/25 rounded-xl flex items-start gap-3 text-xs leading-relaxed">
                <AlertTriangle className="w-4 h-4 text-brand-accent-amber shrink-0 mt-0.5" />
                <div className="flex flex-col">
                  <strong className="text-brand-accent-amber font-semibold">Career Placement Odds Alert</strong>
                  <p className="text-brand-text-muted mt-1">5 students identified in their 4th semester with zero internship credits, decreasing their estimated placement probability by 34%. Recommended: schedule auto-reminders for career counseling.</p>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Right column: Document Indexes & Interactive ML simulation */}
        <div className="flex flex-col gap-6">
          
          {/* Document upload side drawer */}
          <div className="card p-6 bg-brand-bg-secondary border border-brand-border rounded-2xl flex flex-col gap-4">
            <div className="flex justify-between items-center border-b border-brand-border pb-3">
              <h3 className="font-display text-sm font-bold text-white">Indexed Documents</h3>
              <label className="p-1.5 bg-brand-primary/10 border border-brand-primary/20 text-brand-primary hover:bg-brand-primary hover:text-white rounded-lg transition-all cursor-pointer flex items-center gap-1 text-[10px] font-bold">
                <Upload className="w-3.5 h-3.5" />
                Upload Doc
                <input 
                  type="file" 
                  accept=".txt,.pdf" 
                  style={{ display: 'none' }} 
                  onChange={simulateDocUpload}
                />
              </label>
            </div>

            <div className="flex flex-col gap-3 max-h-[180px] overflow-y-auto pr-1">
              {uploadedDocs.map((doc, idx) => (
                <div key={idx} className="p-3 border border-brand-border rounded-xl bg-brand-bg-tertiary/60 flex justify-between items-center text-xs">
                  <div className="flex items-center gap-2 min-w-0">
                    <FileText className="w-5 h-5 text-brand-accent-cyan shrink-0" />
                    <div className="flex flex-col min-w-0">
                      <strong className="text-white truncate max-w-[120px]">{doc.name}</strong>
                      <span className="text-[9px] text-brand-text-subtle mt-0.5">{doc.chunks} vector chunks</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="badge bg-brand-accent-emerald/10 text-brand-accent-emerald text-[9px] py-0.5 px-2 rounded-full font-bold">Indexed</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Interactive ML Simulator playground */}
          <div className="card p-6 bg-brand-bg-secondary border border-brand-border rounded-2xl flex flex-col gap-4">
            <h3 className="font-display text-sm font-bold text-white border-b border-brand-border pb-3">Interactive TensorFlow Predictor</h3>
            
            <p className="text-xs text-brand-text-muted leading-relaxed">Adjust input criteria to evaluate immediate cohort placement probabilities and dropout risks in real-time.</p>
            
            <div className="flex flex-col gap-4">
              <div>
                <div className="flex justify-between text-xs mb-2">
                  <span className="text-brand-text-subtle font-semibold">Simulated GPA Target</span>
                  <span className="text-white font-bold font-mono">{customGpa} GPA</span>
                </div>
                <input 
                  type="range" 
                  min="1.0" 
                  max="4.0" 
                  step="0.1" 
                  value={customGpa} 
                  onChange={(e) => setCustomGpa(parseFloat(e.target.value))}
                  className="w-full accent-brand-primary cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs mb-2">
                  <span className="text-brand-text-subtle font-semibold">Simulated Attendance rate</span>
                  <span className="text-white font-bold font-mono">{customAttendance}%</span>
                </div>
                <input 
                  type="range" 
                  min="40" 
                  max="100" 
                  step="5" 
                  value={customAttendance} 
                  onChange={(e) => setCustomAttendance(parseInt(e.target.value))}
                  className="w-full accent-brand-primary cursor-pointer"
                />
              </div>

              <div className="grid grid-cols-2 gap-4 border-t border-brand-border/40 pt-4 mt-1 text-xs">
                <div className="p-3 bg-brand-bg-tertiary/60 border border-brand-border rounded-xl">
                  <span className="text-brand-text-subtle text-[10px] uppercase font-bold block">Placement Odds</span>
                  <span className="text-base font-bold font-mono text-brand-accent-emerald mt-1 block">{calculatedPlacement}%</span>
                </div>
                <div className="p-3 bg-brand-bg-tertiary/60 border border-brand-border rounded-xl">
                  <span className="text-brand-text-subtle text-[10px] uppercase font-bold block">Dropout Risk</span>
                  <span className={`text-base font-bold font-mono mt-1 block ${calculatedDropout > 40 ? 'text-brand-accent-ruby' : 'text-white'}`}>{calculatedDropout}%</span>
                </div>
              </div>
            </div>
          </div>

          {/* AI recommendations charts mock graphic */}
          <div className="card p-5 bg-brand-bg-secondary border border-brand-border rounded-2xl flex flex-col gap-3">
            <h4 className="text-xs font-bold text-brand-text-subtle uppercase tracking-wider">Placement Probability Curve</h4>
            <div className="h-28 flex items-end gap-1.5 bg-brand-bg-primary/20 p-2.5 rounded-xl border border-brand-border/40">
              {[20, 32, 45, 58, 72, 85, 94].map((h, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <div className="w-full bg-gradient-to-t from-brand-primary to-brand-accent-cyan rounded-t-sm transition-all duration-300" style={{ height: `${h}px` }}></div>
                  <span className="text-[8px] font-mono text-brand-text-subtle">{i + 1}.5</span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
