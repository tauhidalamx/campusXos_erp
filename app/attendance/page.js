'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useDb } from '../../context/db-context';
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
  Check,
  ShieldAlert,
  Calendar,
  CheckCircle2,
  XCircle,
  Search,
  Download,
  HelpCircle,
  RefreshCw,
  Award,
  Layers,
  MapPin,
  Lock,
  Unlock,
  ChevronRight
} from 'lucide-react';

export default function AttendancePage() {
  const {
    students,
    courses,
    faculty,
    updateStudent
  } = useDb();

  // ERP Role Simulation state
  const [currentUser, setCurrentUser] = useState(null);
  const [sessionUser, setSessionUser] = useState(null);
  const [simulatedRole, setSimulatedRole] = useState('faculty'); // Default simulation role

  // Selection states
  const [selectedCourseCode, setSelectedCourseCode] = useState('');
  const [sessionDate, setSessionDate] = useState('2026-06-24');
  const [attendanceMethod, setAttendanceMethod] = useState('MANUAL');
  const [filterSection, setFilterSection] = useState('A');
  const [filterBatch, setFilterBatch] = useState('2023');
  const [filterRosterMode, setFilterRosterMode] = useState('daily'); // daily, weekly, monthly, semester, academic_year

  // Roster lists & states
  const [enrolledStudents, setEnrolledStudents] = useState([]);
  const [attendanceMap, setAttendanceMap] = useState({}); // studentId -> status (PRESENT, ABSENT, LATE, etc.)
  const [sessionNotes, setSessionNotes] = useState('');
  const [sessionDraftStatus, setSessionDraftStatus] = useState('DRAFT'); // DRAFT, LOCKED, PUBLISHED
  
  // Correction states
  const [corrections, setCorrections] = useState([]);
  const [selectedCorrAsn, setSelectedCorrAsn] = useState('');
  const [corrReqStatus, setCorrReqStatus] = useState('PRESENT');
  const [corrReqReason, setCorrReqReason] = useState('');

  // AI Insights states
  const [aiPeak, setAiPeak] = useState('Calculating...');
  const [aiDip, setAiDip] = useState('Calculating...');
  const [aiAvg, setAiAvg] = useState('Calculating...');
  const [aiProjecting, setAiProjecting] = useState(false);
  const [dropoutRiskAlerts, setDropoutRiskAlerts] = useState([]);

  // Audit Logs & Blockchain states
  const [auditLogs, setAuditLogs] = useState([]);
  const [blockchainProofStream, setBlockchainProofStream] = useState([]);

  // Dashboard tab state
  const [activeTab, setActiveTab] = useState('roster'); // roster, corrections, analytics, schedule, blockchain

  // Canvas Ref for AI chart
  const canvasRef = useRef(null);
  const chartRef = useRef(null);
  const fileInputRef = useRef(null);

  const handleFileDropSim = (e) => {
    e.preventDefault();
    alert('Mock Ingestion: File "roster_attendance_export.xlsx" received. Extracted 5 student check-in logs and updated draft register.');
  };

  const handleFileSelectSim = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Simulated Roles configurations
  const simulationRoles = [
    { label: 'Super Admin', role: 'superadmin', email: 'superadmin@campusx.demo', name: 'Dr. Evelyn Sterling' },
    { label: 'Platform Admin', role: 'admin', email: 'univadmin@campusx.demo', name: 'SSO Admin' },
    { label: 'University Admin', role: 'univadmin', email: 'univadmin@campusx.demo', name: 'Admin Director' },
    { label: 'Registrar', role: 'registrar', email: 'registrar@campusx.demo', name: 'Registrar General' },
    { label: 'Dean', role: 'dean', email: 'dean@campusx.demo', name: 'Dean of Faculty' },
    { label: 'HOD', role: 'hod', email: 'hod@campusx.demo', name: 'Prof. Sarah Jenkins' },
    { label: 'Department Admin', role: 'deptadmin', email: 'deptadmin@campusx.demo', name: 'Dept Coordinator' },
    { label: 'Faculty', role: 'faculty', email: 'faculty@campusx.demo', name: 'Prof. Marcus Chen' },
    { label: 'Student', role: 'student', email: 'student@campusx.demo', name: 'Alex Rivera' },
    { label: 'Parent', role: 'parent', email: 'parent@campusx.demo', name: 'Aria\'s Parent' },
    { label: 'Sports Director', role: 'sportsdirector', email: 'sportsdirector@campusx.demo', name: 'Coach Sullivan' },
    { label: 'Coach', role: 'coach', email: 'coach@campusx.demo', name: 'Team Head Coach' },
    { label: 'Hostel Manager', role: 'hostelmanager', email: 'hostel@campusx.demo', name: 'Warden Fillius' }
  ];

  // Initialize simulated user session
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const session = sessionStorage.getItem('campusx_erp_session');
      if (session) {
        const parsed = JSON.parse(session);
        setCurrentUser(parsed);
        setSessionUser(parsed);
        setSimulatedRole(parsed.role);
        
        if (parsed.role === 'student' || parsed.role === 'athlete') {
          setActiveTab('student_dashboard');
        } else if (parsed.role === 'parent' || parsed.role === 'sports_parent') {
          setActiveTab('parent_dashboard');
        } else {
          setActiveTab('roster');
        }
      } else {
        // Fallback default
        const defRole = simulationRoles.find(r => r.role === simulatedRole);
        setCurrentUser(defRole);
        setActiveTab('roster');
      }
    }
  }, []);

  // Handle switching simulated roles
  const handleRoleChange = (roleKey) => {
    setSimulatedRole(roleKey);
    const target = simulationRoles.find(r => r.role === roleKey) || simulationRoles[4];
    setCurrentUser(target);
    if (roleKey === 'student' || roleKey === 'athlete') {
      setActiveTab('student_dashboard');
    } else if (roleKey === 'parent' || roleKey === 'sports_parent') {
      setActiveTab('parent_dashboard');
    } else {
      setActiveTab('roster');
    }
  };

  const isStudent = currentUser?.role === 'student' || currentUser?.role === 'athlete';
  const isParent = currentUser?.role === 'parent' || currentUser?.role === 'sports_parent';
  const isFacultyOrAdmin = !isStudent && !isParent;
  const isStudentOrParent = isStudent || isParent || currentUser?.role === 'guest';

  // Get active tabs based on simulated role
  const getTabs = () => {
    if (isStudent) {
      return [
        { id: 'student_dashboard', label: 'My Attendance Card' },
        { id: 'corrections', label: 'Correction Requests' },
        { id: 'schedule', label: 'My Timetable' }
      ];
    } else if (isParent) {
      return [
        { id: 'parent_dashboard', label: 'Child Overview' },
        { id: 'corrections', label: 'Correction Requests' },
        { id: 'schedule', label: 'Child Timetable' }
      ];
    } else {
      return [
        { id: 'roster', label: 'Daily Roster' },
        { id: 'corrections', label: 'Corrections Desk' },
        { id: 'analytics', label: 'AI Forecasting' },
        { id: 'schedule', label: 'Timetables' },
        { id: 'blockchain', label: 'On-Chain Logs' }
      ];
    }
  };

  const activeTabsList = getTabs();

  const showSimConsole = true;

  const activeCourses = courses.filter(c => c.status === 'Active');
  const allowedCourses = currentUser?.role === 'superadmin' || currentUser?.role === 'admin' || currentUser?.role === 'registrar' || currentUser?.role === 'hod'
    ? activeCourses 
    : activeCourses.filter(c => c.facultyId === 'FAC006' || c.facultyId === 'FAC001');

  // Load defaults
  useEffect(() => {
    if (allowedCourses.length > 0 && !selectedCourseCode) {
      setSelectedCourseCode(allowedCourses[0].code);
    }
  }, [allowedCourses, selectedCourseCode]);

  // Set default correction course selection
  useEffect(() => {
    if (allowedCourses.length > 0 && !selectedCorrAsn) {
      setSelectedCorrAsn(allowedCourses[0].code);
    }
  }, [allowedCourses]);

  // Load local/mock data for audits, corrections, and dropout risk alerts
  useEffect(() => {
    // Generate initial corrections
    setCorrections([
      { id: 'corr_101', sessionDate: '2026-06-20', courseCode: 'CS202', student: 'Alex Rivera', currentStatus: 'ABSENT', requestedStatus: 'PRESENT', reason: 'Medical checkup appointment, submitted certificate.', status: 'PENDING', txHash: null },
      { id: 'corr_102', sessionDate: '2026-06-18', courseCode: 'CS101', student: 'Zoe Chen', currentStatus: 'ABSENT', requestedStatus: 'EXCUSED', reason: 'Participating in university programming hackathon.', status: 'APPROVED', txHash: '0x9b32c...5ef1' }
    ]);

    // Generate initial audits
    setAuditLogs([
      { id: 'aud_901', operator: 'Prof. Marcus Chen', action: 'LOCK_ATTENDANCE', details: 'Locked attendance session for CS202 on 2026-06-22', timestamp: '2026-06-22 16:30', ip: '192.168.10.45', txHash: '0xf832c...ee12' },
      { id: 'aud_902', operator: 'Prof. Sarah Jenkins (HOD)', action: 'APPROVE_CORRECTION', details: 'Approved Zoe Chen correction request for CS101', timestamp: '2026-06-19 11:15', ip: '192.168.12.89', txHash: '0x9b32c...5ef1' }
    ]);

    // Generate initial blockchain proofs
    setBlockchainProofStream([
      { height: 142095, method: 'LOCK_ATTENDANCE', hash: '0xf832ca181977cfcd83e10034a74288b8e2b265ee12', time: '2026-06-22 16:30', signatures: ['0xmarcus_chen_sig', '0xhod_approval_sig'] },
      { height: 142012, method: 'APPROVE_CORRECTION', hash: '0x9b32cd5826ac09efcafc18e38d7bf4f2ff80775ef1', time: '2026-06-19 11:15', signatures: ['0xhod_approval_sig'] }
    ]);

    // Generate initial AI Dropout alerts
    setDropoutRiskAlerts([
      { studentId: 'STU003', name: 'Liam Sterling', attendanceRate: 64, trend: 'Downward', riskLevel: 'High', recommendation: 'Trigger automated notification alert to sports director and parent, schedule counseling.' },
      { studentId: 'STU005', name: 'Carlos Mendez', attendanceRate: 72, trend: 'Unstable', riskLevel: 'Medium', recommendation: 'Initiate faculty follow-up review for morning session tardiness.' }
    ]);
  }, []);

  // Filter students based on selection
  useEffect(() => {
    if (!selectedCourseCode) return;

    const course = activeCourses.find(c => c.code === selectedCourseCode);
    if (!course) return;

    let list = students.filter(s => s.courses?.includes(selectedCourseCode));
    if (list.length === 0) {
      list = students.filter(s => s.dept === course.dept);
    }

    // Role-based visibility filtering (Isolate student/parent rows)
    if (isStudent) {
      const studentId = currentUser?.id || 'STU002';
      list = list.filter(s => s.id === studentId);
    } else if (isParent) {
      list = list.filter(s => s.id === 'STU002'); // Child Aria/Alex Rivera ID
    }

    setEnrolledStudents(list);

    // Initial default mapping
    const initialMap = {};
    list.forEach(s => {
      initialMap[s.id] = 'PRESENT';
    });
    setAttendanceMap(initialMap);
  }, [selectedCourseCode, students, currentUser, isStudent, isParent]);

  // Handle single attendance option toggle
  const handleStatusSelect = (studentId, statusValue) => {
    setAttendanceMap(prev => ({
      ...prev,
      [studentId]: statusValue
    }));
  };

  // Bulk set all students to a status
  const handleBulkSetStatus = (statusValue) => {
    const updated = {};
    enrolledStudents.forEach(s => {
      updated[s.id] = statusValue;
    });
    setAttendanceMap(updated);
  };

  // Save Draft Attendance
  const handleSaveDraft = () => {
    if (isStudentOrParent) {
      alert('Access Denied: Students and parents cannot save drafts.');
      return;
    }
    setSessionDraftStatus('DRAFT');
    alert(`Roster draft saved locally for ${sessionDate}. Total students: ${enrolledStudents.length}.`);
  };

  // Commit / Lock Attendance session (emits to backend & anchors to blockchain)
  const handleCommitAttendance = async () => {
    if (isStudentOrParent) {
      alert('Access Denied: Students and parents cannot submit or lock attendance.');
      return;
    }
    if (sessionDraftStatus === 'LOCKED') {
      alert('This session has already been finalized and locked on-chain.');
      return;
    }

    const records = Object.keys(attendanceMap).map(id => ({
      student_id: id,
      status: attendanceMap[id]
    }));

    const body = {
      course_code: selectedCourseCode,
      date: sessionDate,
      records,
      marked_by: currentUser?.name || 'FACULTY_USER',
      method: attendanceMethod
    };

    try {
      const res = await fetch('/api/attendance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      const data = await res.json();
      
      const txHash = data.tx_hash || '0x' + Math.random().toString(16).substring(2, 10) + '...';
      const auditId = data.audit_id || 'aud_' + Math.random().toString(36).substr(2, 9);

      // Lock session
      await fetch('/api/attendance/lock', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ course_code: selectedCourseCode, date: sessionDate, operator: currentUser?.name })
      });

      setSessionDraftStatus('LOCKED');

      // Update student overall averages locally as a fallback
      enrolledStudents.forEach(s => {
        const status = attendanceMap[s.id];
        let currentAttend = s.attendance || 85;
        let newAttend = currentAttend;
        if (status === 'PRESENT' || status === 'ONLINE_PRESENT') {
          newAttend = Math.min(100, Math.round(currentAttend + (100 - currentAttend) * 0.05));
        } else if (status === 'ABSENT') {
          newAttend = Math.max(0, Math.round(currentAttend - currentAttend * 0.05));
        }
        if (newAttend !== currentAttend) {
          updateStudent(s.id, { attendance: newAttend });
        }
      });

      // Add to audit logs list
      const newAudit = {
        id: auditId,
        operator: currentUser?.name || 'Faculty User',
        action: 'LOCK_ATTENDANCE',
        details: `Finalized and locked attendance for ${selectedCourseCode} on ${sessionDate} via method ${attendanceMethod}`,
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
        ip: '127.0.0.1',
        txHash
      };
      setAuditLogs(prev => [newAudit, ...prev]);

      // Add to block list
      const newBlock = {
        height: blockchainProofStream[0] ? blockchainProofStream[0].height + 1 : 142096,
        method: 'LOCK_ATTENDANCE',
        hash: txHash,
        time: new Date().toISOString().replace('T', ' ').substring(0, 16),
        signatures: [currentUser?.name || 'Faculty Member', 'HOD Signature Locked']
      };
      setBlockchainProofStream(prev => [newBlock, ...prev]);

      alert(`Attendance recorded and finalized on-chain!\nTransaction Hash: ${txHash}`);
    } catch (err) {
      console.warn('API connection refused. Simulating local fallback.');
      // Simulating success locally
      const mockTx = '0x' + Math.random().toString(16).substring(2, 10) + '48c9df4';
      setSessionDraftStatus('LOCKED');
      
      const newAudit = {
        id: 'aud_' + Math.random().toString(36).substr(2, 9),
        operator: currentUser?.name || 'Faculty User',
        action: 'LOCK_ATTENDANCE',
        details: `Simulated locked attendance for ${selectedCourseCode} on ${sessionDate}`,
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
        ip: '127.0.0.1',
        txHash: mockTx
      };
      setAuditLogs(prev => [newAudit, ...prev]);

      alert(`[Simulation Mode] Attendance successfully locked on-chain!\nTransaction Hash: ${mockTx}`);
    }
  };

  // Submit Correction Request (Student)
  const handleSubmitCorrection = async () => {
    if (!corrReqReason.trim()) {
      alert('Please state the reason for the correction request.');
      return;
    }

    const body = {
      attendance_id: 'att_mock_1',
      student_id: currentUser?.id || 'STU001',
      requested_status: corrReqStatus,
      reason: corrReqReason
    };

    try {
      const res = await fetch('/api/attendance/corrections', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      const data = await res.json();
      
      const newCorr = {
        id: data.id || 'corr_' + Math.random().toString(36).substr(2, 9),
        sessionDate: '2026-06-22',
        courseCode: selectedCorrAsn,
        student: currentUser?.name || 'Alex Rivera',
        currentStatus: 'ABSENT',
        requestedStatus: corrReqStatus,
        reason: corrReqReason,
        status: 'PENDING',
        txHash: null
      };

      setCorrections(prev => [newCorr, ...prev]);
      setCorrReqReason('');
      alert('Correction request submitted and logged in the queue.');
    } catch (err) {
      const mockId = 'corr_' + Math.random().toString(36).substr(2, 9);
      const newCorr = {
        id: mockId,
        sessionDate: '2026-06-22',
        courseCode: selectedCorrAsn,
        student: currentUser?.name || 'Alex Rivera',
        currentStatus: 'ABSENT',
        requestedStatus: corrReqStatus,
        reason: corrReqReason,
        status: 'PENDING',
        txHash: null
      };
      setCorrections(prev => [newCorr, ...prev]);
      setCorrReqReason('');
      alert('[Simulation Mode] Correction request submitted and queued locally.');
    }
  };

  // Approve / Reject Correction Request (Faculty / HOD)
  const handleReviewCorrection = async (corrId, approveStatus) => {
    if (isStudentOrParent) {
      alert('Access Denied: Only faculty and administrators can review correction requests.');
      return;
    }
    const body = {
      correction_id: corrId,
      status: approveStatus ? 'APPROVED' : 'REJECTED',
      reviewed_by: currentUser?.name || 'Faculty reviewer',
      comments: 'Processed under university policy regulations.'
    };

    try {
      const res = await fetch('/api/attendance/corrections/review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      const data = await res.json();
      const txHash = data.tx_hash || '0x' + Math.random().toString(16).substring(2, 10) + '...';

      setCorrections(prev => prev.map(c => c.id === corrId ? { ...c, status: body.status, txHash } : c));
      
      // Log audit
      const newAudit = {
        id: data.audit_id || 'aud_' + Math.random().toString(36).substr(2, 9),
        operator: currentUser?.name || 'Faculty HOD',
        action: 'REVIEW_CORRECTION',
        details: `Reviewed correction ${corrId} to status: ${body.status}`,
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
        ip: '127.0.0.1',
        txHash
      };
      setAuditLogs(prev => [newAudit, ...prev]);

      alert(`Correction reviewed successfully on-chain!\nReceipt signature: ${txHash}`);
    } catch (err) {
      const mockTx = '0x' + Math.random().toString(16).substring(2, 10) + 'f12c98a';
      setCorrections(prev => prev.map(c => c.id === corrId ? { ...c, status: body.status, txHash: mockTx } : c));
      
      const newAudit = {
        id: 'aud_' + Math.random().toString(36).substr(2, 9),
        operator: currentUser?.name || 'Faculty HOD',
        action: 'REVIEW_CORRECTION',
        details: `Simulated reviewed correction ${corrId} to status: ${body.status}`,
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
        ip: '127.0.0.1',
        txHash: mockTx
      };
      setAuditLogs(prev => [newAudit, ...prev]);

      alert(`[Simulation Mode] Correction reviewed successfully!\nMock Tx Hash: ${mockTx}`);
    }
  };

  // Run TensorFlow Projection (Simulated or TF runtime)
  const runAttendanceProjection = async () => {
    if (typeof window === 'undefined' || !canvasRef.current) return;
    setAiProjecting(true);

    try {
      // Fetch or simulate time series values
      setTimeout(() => {
        const Chart = window.Chart;
        if (!Chart) {
          setAiProjecting(false);
          return;
        }

        const xVal = [0, 1, 2, 3, 4, 5, 6, 7];
        const yVal = [0.88, 0.92, 0.94, 0.85, 0.78, 0.89, 0.91, 0.95];

        // Simulate training weights dynamically
        const projectedY = [89, 93, 91, 84, 76, 88, 92];
        const avg = Math.round(projectedY.reduce((a,b) => a+b, 0) / projectedY.length);
        const max = Math.max(...projectedY);
        const min = Math.min(...projectedY);

        setAiPeak(max + '%');
        setAiDip(min + '%');
        setAiAvg(avg + '%');

        if (chartRef.current) chartRef.current.destroy();

        chartRef.current = new Chart(canvasRef.current, {
          type: 'line',
          data: {
            labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
            datasets: [{
              label: 'AI Projected Participation (%)',
              data: projectedY,
              borderColor: '#10b981',
              backgroundColor: 'rgba(16, 185, 129, 0.05)',
              borderWidth: 2.5,
              fill: true,
              tension: 0.4
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
              y: {
                grid: { color: 'rgba(255, 255, 255, 0.03)' },
                ticks: { color: '#94a3b8', font: { size: 10 } },
                min: 50,
                max: 100
              },
              x: {
                grid: { display: false },
                ticks: { color: '#94a3b8', font: { size: 10 } }
              }
            }
          }
        });

        setAiProjecting(false);
      }, 700);
    } catch (err) {
      console.error(err);
      setAiProjecting(false);
    }
  };

  // Run AI Projection on mount
  useEffect(() => {
    const timer = setTimeout(runAttendanceProjection, 600);
    return () => clearTimeout(timer);
  }, [activeTab]);

  return (
    <div className="flex flex-col gap-6 text-brand-text-main text-left">
      
      {/* Simulation Controller Topbar (Only visible to admin sessions or in standalone mode) */}
      {showSimConsole && (
        <div className="card p-4.5 bg-brand-bg-secondary/40 border border-brand-border/60 rounded-2xl flex flex-col gap-3 animate-fade-in">
          <div className="flex items-center justify-between border-b border-brand-border/20 pb-2">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-brand-primary" />
              <span className="text-xs font-bold text-white uppercase tracking-wider">CampusX ERP Simulation Console</span>
            </div>
            <span className="text-[10px] text-brand-text-muted">Select simulated user role below to test RBAC components</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {simulationRoles.map(roleObj => {
              const fullAccessRoles = ['superadmin', 'admin', 'univadmin', 'registrar', 'dean', 'hod', 'deptadmin', 'faculty'];
              const hasFullAccess = fullAccessRoles.includes(currentUser?.role);
              const getNormalizedRole = (role) => {
                if (role === 'athlete') return 'student';
                if (role === 'sports_parent') return 'parent';
                return role;
              };
              const userRole = getNormalizedRole(currentUser?.role);
              const isButtonDisabled = !hasFullAccess && getNormalizedRole(roleObj.role) !== userRole;

              return (
                <button
                  key={roleObj.role}
                  onClick={() => {
                    if (!isButtonDisabled) {
                      handleRoleChange(roleObj.role);
                    }
                  }}
                  disabled={isButtonDisabled}
                  className={`px-3 py-1.5 rounded-xl text-[10px] font-bold transition-all flex items-center gap-1.5 ${
                    isButtonDisabled
                      ? 'opacity-40 cursor-not-allowed bg-brand-bg-tertiary/40 border border-brand-border/20 text-brand-text-muted'
                      : simulatedRole === roleObj.role
                        ? 'bg-brand-primary text-white border border-brand-primary cursor-pointer'
                        : 'bg-brand-bg-tertiary/60 border border-brand-border/40 text-brand-text-subtle hover:bg-brand-primary/10 cursor-pointer'
                  }`}
                >
                  <User className="w-3.5 h-3.5" />
                  {roleObj.label}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Main Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center pb-4 border-b border-brand-border/30 gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-display font-bold text-white tracking-tight flex items-center gap-3">
            <CheckSquare className="w-8 h-8 text-brand-primary" />
            Enterprise Attendance Hub
          </h1>
          <p className="text-brand-text-muted text-[11px] md:text-xs mt-1">
            Manage manual, QR code, and biometric check-ins with AI dropout forecasting and CampusX Chain cryptographic proofs.
          </p>
        </div>
        
        {/* Navigation tabs - Role-Specific Viewports */}
        <div className="flex bg-brand-bg-tertiary/60 p-1 rounded-xl border border-brand-border/50 text-[10px] font-bold">
          {activeTabsList.map(tab => (
            <button 
              key={tab.id}
              onClick={() => setActiveTab(tab.id)} 
              className={`px-3.5 py-2 rounded-lg cursor-pointer transition-all ${
                activeTab === tab.id 
                  ? 'bg-brand-primary text-white' 
                  : 'text-brand-text-subtle hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Primary Tab Panels */}
      
      {/* 1. Daily Roster tab */}
      {activeTab === 'roster' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Main Attendance register (2 Columns) */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            
            {/* Filter and settings bar */}
            <div className="card p-6 bg-brand-bg-secondary border border-brand-border rounded-2xl flex flex-col gap-4">
              <span className="font-display text-sm font-bold text-white uppercase tracking-wider"> Roster Configuration</span>
              
              <div className="grid grid-cols-1 md:grid-cols-6 gap-3.5 text-xs">
                <div className="flex flex-col gap-1.5">
                  <label className="font-semibold text-brand-text-subtle">Course selection</label>
                  <select 
                    value={selectedCourseCode}
                    onChange={(e) => setSelectedCourseCode(e.target.value)}
                    className="bg-brand-bg-tertiary border border-brand-border p-2.5 rounded-xl outline-none text-white cursor-pointer"
                  >
                    {allowedCourses.map(c => (
                      <option key={c.code} value={c.code}>{c.code} - {c.title}</option>
                    ))}
                  </select>
                </div>
                
                <div className="flex flex-col gap-1.5">
                  <label className="font-semibold text-brand-text-subtle">Session date</label>
                  <input 
                    type="date" 
                    value={sessionDate}
                    onChange={(e) => setSessionDate(e.target.value)}
                    className="bg-brand-bg-tertiary border border-brand-border p-2.5 rounded-xl outline-none text-white"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="font-semibold text-brand-text-subtle">Roster Mode</label>
                  <select 
                    value={filterRosterMode}
                    onChange={(e) => setFilterRosterMode(e.target.value)}
                    className="bg-brand-bg-tertiary border border-brand-border p-2.5 rounded-xl outline-none text-white cursor-pointer"
                  >
                    <option value="daily">Daily Attendance</option>
                    <option value="weekly">Weekly Attendance</option>
                    <option value="monthly">Monthly Attendance</option>
                    <option value="semester">Semester Overview</option>
                    <option value="academic_year">Academic Year</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="font-semibold text-brand-text-subtle">Roster section</label>
                  <select 
                    value={filterSection}
                    onChange={(e) => setFilterSection(e.target.value)}
                    disabled={isStudentOrParent}
                    className="bg-brand-bg-tertiary border border-brand-border p-2.5 rounded-xl outline-none text-white cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    <option value="A">Section A</option>
                    <option value="B">Section B</option>
                    <option value="C">Section C</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="font-semibold text-brand-text-subtle">Student Batch</label>
                  <select 
                    value={filterBatch}
                    onChange={(e) => setFilterBatch(e.target.value)}
                    disabled={isStudentOrParent}
                    className="bg-brand-bg-tertiary border border-brand-border p-2.5 rounded-xl outline-none text-white cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    <option value="2023">Batch 2023</option>
                    <option value="2024">Batch 2024</option>
                    <option value="2025">Batch 2025</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="font-semibold text-brand-text-subtle">Check-in method</label>
                  <select 
                    value={attendanceMethod}
                    onChange={(e) => setAttendanceMethod(e.target.value)}
                    disabled={isStudentOrParent}
                    className="bg-brand-bg-tertiary border border-brand-border p-2.5 rounded-xl outline-none text-white cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    <option value="MANUAL">Manual register</option>
                    <option value="QR_CODE">QR code scan</option>
                    <option value="RFID">RFID sensor card</option>
                    <option value="NFC">NFC smart tap</option>
                    <option value="BIOMETRIC">Biometric touch</option>
                    <option value="FACE_RECOGNITION">AI face camera</option>
                    <option value="GPS">GPS mobile geofence</option>
                    <option value="MOBILE">Mobile App check-in</option>
                    <option value="WEB">Web Portal log</option>
                    <option value="CLASSROOM">Classroom scanner</option>
                    <option value="LABORATORY">Laboratory terminal</option>
                    <option value="SPORTS">Sports arena gate</option>
                    <option value="EXAMINATION">Exam Hall desk QR</option>
                    <option value="EVENT">Event attendance</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Attendance Roster Table */}
            <div className="card p-6 bg-brand-bg-secondary border border-brand-border rounded-2xl flex flex-col gap-4">
              <div className="flex justify-between items-center border-b border-brand-border/20 pb-3">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-brand-primary" />
                  <span className="font-display text-sm font-bold text-white">Student Enrollment Sheet</span>
                </div>
                {/* Bulk tools for Faculty/Admins */}
                {!isStudentOrParent && (
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleBulkSetStatus('PRESENT')} 
                      className="px-2.5 py-1 text-[9px] font-bold bg-brand-accent-emerald/10 text-brand-accent-emerald rounded-lg border border-brand-accent-emerald/20 hover:bg-brand-accent-emerald/20 transition-all cursor-pointer"
                    >
                      All Present
                    </button>
                    <button 
                      onClick={() => handleBulkSetStatus('ABSENT')} 
                      className="px-2.5 py-1 text-[9px] font-bold bg-brand-accent-ruby/10 text-brand-accent-ruby rounded-lg border border-brand-accent-ruby/20 hover:bg-brand-accent-ruby/20 transition-all cursor-pointer"
                    >
                      All Absent
                    </button>
                  </div>
                )}
              </div>

               {/* Roster table */}
              <div className="max-h-[500px] overflow-y-auto border border-brand-border/40 rounded-xl bg-brand-bg-primary/20">
                <table className="w-full border-collapse text-left">
                  <thead>
                    <tr className="border-b border-brand-border text-brand-text-subtle text-[10px] uppercase font-bold tracking-wider">
                      <th className="p-3">Student Name</th>
                      {filterRosterMode === 'daily' && <th className="p-3 text-center">Status</th>}
                      {filterRosterMode === 'weekly' && <th className="p-3 text-center">Mon - Fri Logs</th>}
                      {filterRosterMode === 'monthly' && <th className="p-3 text-center">Monthly Metrics (Attended/Held)</th>}
                      {(filterRosterMode === 'semester' || filterRosterMode === 'academic_year') && <th className="p-3 text-center">Admissibility Status</th>}
                      <th className="p-3 text-right">Averages</th>
                    </tr>
                  </thead>
                  <tbody>
                    {enrolledStudents.length === 0 ? (
                      <tr>
                        <td colSpan="3" className="text-center text-brand-text-muted py-8 text-xs">
                          No students found for this filter criteria.
                        </td>
                      </tr>
                    ) : (
                      enrolledStudents.map(s => {
                        const status = attendanceMap[s.id] || 'PRESENT';
                        const overall = s.attendance || 85;
                        const present = Math.round(overall * 0.2);
                        const absent = 20 - present;
                        const compliance = overall >= 75;
                        return (
                          <tr key={s.id} className="border-b border-brand-border/30 text-xs text-brand-text-main hover:bg-white/[0.01] transition-all">
                            <td className="p-3">
                              <div className="flex items-center gap-3">
                                <img src={s.avatar} className="w-8 h-8 rounded-xl object-cover border border-brand-border/60 shrink-0" alt="" />
                                <div className="flex flex-col">
                                  <strong className="text-white text-xs">{s.name}</strong>
                                  <span className="text-[9px] text-brand-text-muted font-mono mt-0.5">{s.id}</span>
                                </div>
                              </div>
                            </td>
                            
                            {filterRosterMode === 'daily' && (
                              <td className="p-3 text-center">
                                {!isStudentOrParent ? (
                                  <select 
                                    value={status}
                                    onChange={(e) => handleStatusSelect(s.id, e.target.value)}
                                    className={`p-1.5 rounded-lg font-bold text-[10px] outline-none border cursor-pointer ${
                                      status === 'PRESENT' || status === 'ONLINE_PRESENT'
                                        ? 'bg-brand-accent-emerald/10 text-brand-accent-emerald border-brand-accent-emerald/20'
                                        : status === 'ABSENT'
                                          ? 'bg-brand-accent-ruby/10 text-brand-accent-ruby border-brand-accent-ruby/20'
                                          : status === 'HOLIDAY'
                                            ? 'bg-brand-bg-tertiary text-brand-text-subtle border-brand-border/40'
                                            : 'bg-brand-accent-amber/10 text-brand-accent-amber border-brand-accent-amber/20'
                                    }`}
                                  >
                                    <option value="PRESENT">Present</option>
                                    <option value="ABSENT">Absent</option>
                                    <option value="LATE">Late</option>
                                    <option value="EXCUSED">Excused</option>
                                    <option value="MEDICAL_LEAVE">Medical Leave</option>
                                    <option value="DUTY_LEAVE">Duty Leave</option>
                                    <option value="ONLINE_PRESENT">Online Present</option>
                                    <option value="HOLIDAY">Holiday</option>
                                  </select>
                                ) : (
                                  <span className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                                    status === 'PRESENT' || status === 'ONLINE_PRESENT'
                                      ? 'bg-brand-accent-emerald/10 text-brand-accent-emerald'
                                      : status === 'ABSENT'
                                        ? 'bg-brand-accent-ruby/10 text-brand-accent-ruby'
                                        : 'bg-brand-accent-amber/10 text-brand-accent-amber'
                                  }`}>
                                    {status}
                                  </span>
                                )}
                              </td>
                            )}

                            {filterRosterMode === 'weekly' && (
                              <td className="p-3 text-center">
                                <div className="flex justify-center gap-1.5">
                                  <span className="w-2.5 h-2.5 rounded-full bg-brand-accent-emerald" title="Monday: Present"></span>
                                  <span className="w-2.5 h-2.5 rounded-full bg-brand-accent-emerald" title="Tuesday: Present"></span>
                                  <span className={`w-2.5 h-2.5 rounded-full ${overall < 80 ? 'bg-brand-accent-ruby' : 'bg-brand-accent-emerald'}`} title="Wednesday"></span>
                                  <span className="w-2.5 h-2.5 rounded-full bg-brand-accent-emerald" title="Thursday: Present"></span>
                                  <span className={`w-2.5 h-2.5 rounded-full ${overall < 75 ? 'bg-brand-accent-ruby' : 'bg-brand-accent-amber'}`} title="Friday"></span>
                                </div>
                              </td>
                            )}

                            {filterRosterMode === 'monthly' && (
                              <td className="p-3 text-center font-mono text-brand-text-subtle">
                                Attended: <strong className="text-brand-accent-emerald">{present}</strong> / Held: <strong className="text-white">20</strong>
                              </td>
                            )}

                            {(filterRosterMode === 'semester' || filterRosterMode === 'academic_year') && (
                              <td className="p-3 text-center">
                                {compliance ? (
                                  <span className="px-2.5 py-0.5 bg-brand-accent-emerald/15 text-brand-accent-emerald text-[9px] rounded font-bold uppercase tracking-wider">Admissible</span>
                                ) : (
                                  <span className="px-2.5 py-0.5 bg-brand-accent-ruby/15 text-brand-accent-ruby text-[9px] rounded font-bold uppercase tracking-wider animate-pulse">Warning: Inadmissible</span>
                                )}
                              </td>
                            )}

                            <td className="p-3 text-right">
                              <span className={`font-mono font-bold ${compliance ? 'text-brand-accent-emerald' : 'text-brand-accent-ruby'}`}>
                                {overall}%
                              </span>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>

              {/* Roster Controls */}
              <div className="flex justify-between items-center pt-2 gap-4">
                <div className="flex items-center gap-2 text-[10px] text-brand-text-muted">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Status: <strong className="text-white uppercase">{sessionDraftStatus}</strong></span>
                </div>
                <div className="flex gap-2 text-xs font-bold">
                  {sessionDraftStatus === 'LOCKED' && currentUser?.role === 'superadmin' && (
                    <button 
                      onClick={() => {
                        setSessionDraftStatus('DRAFT');
                        alert('Super Admin Override Privilege: Session successfully unlocked and reverted to DRAFT.');
                      }}
                      className="px-4 py-2 bg-brand-accent-cyan text-black rounded-xl hover:bg-brand-accent-cyan/80 transition-all cursor-pointer flex items-center gap-1"
                    >
                      <Unlock className="w-3.5 h-3.5 text-black" /> Force Unlock
                    </button>
                  )}
                  {!isStudentOrParent && sessionDraftStatus !== 'LOCKED' && (
                    <>
                      <button 
                        onClick={handleSaveDraft}
                        className="px-4 py-2 border border-brand-border rounded-xl bg-brand-bg-tertiary text-white hover:bg-brand-bg-tertiary/80 transition-all cursor-pointer"
                      >
                        Save Draft
                      </button>
                      <button 
                        onClick={handleCommitAttendance}
                        className="px-5 py-2.5 bg-brand-primary text-white rounded-xl hover:bg-brand-primary/80 transition-all cursor-pointer"
                      >
                        Commit & Lock Session
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>

          </div>

          {/* Side control panels: Roster imports & statistics (1 Column) */}
          <div className="flex flex-col gap-6 text-xs text-left">
            
            {/* Template imports */}
            {!isStudentOrParent && (
              <div className="card p-6 bg-brand-bg-secondary border border-brand-border rounded-2xl flex flex-col gap-4">
                <span className="font-display text-sm font-bold text-white uppercase tracking-wider">Bulk Import / Templates</span>
                <p className="text-brand-text-muted text-[10px]">
                  Faculty can drag and drop class rosters to populate attendance sheets in bulk.
                </p>
                
                <div 
                  onClick={handleFileSelectSim}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={handleFileDropSim}
                  className="border border-dashed border-brand-border bg-brand-bg-tertiary/40 rounded-xl p-5 text-center cursor-pointer hover:bg-brand-primary/5 transition-all"
                >
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={() => alert('Mock Ingestion: "class_roster_upload.csv" parsed successfully. Attendance sheet populated.')}
                    className="hidden" 
                  />
                  <Upload className="w-6 h-6 text-brand-text-muted mx-auto mb-2" />
                  <span className="text-[10px] text-brand-text-subtle block">Drag CSV / Excel list here</span>
                  <span className="text-[8px] text-brand-text-muted block mt-0.5">Templates support: StudentID, Date, Status</span>
                </div>

                <div className="flex justify-between gap-2 pt-1 font-bold text-[10px]">
                  <button 
                    onClick={() => alert('Downloaded template CSV (StudentID, Date, Status)')}
                    className="px-3 py-1.5 border border-brand-border rounded-lg bg-brand-bg-tertiary text-white flex items-center gap-1 cursor-pointer hover:bg-brand-primary/10 transition-all"
                  >
                    <Download className="w-3 h-3" /> Template
                  </button>
                  <button 
                    onClick={() => alert(`Exporting active attendance roster for ${selectedCourseCode} (CSV)`)}
                    className="px-3 py-1.5 border border-brand-border rounded-lg bg-brand-bg-tertiary text-white flex items-center gap-1 cursor-pointer hover:bg-brand-primary/10 transition-all"
                  >
                    <Download className="w-3 h-3" /> Export CSV
                  </button>
                </div>
              </div>
            )}

            {/* Quick stats / GPS verification */}
            <div className="card p-6 bg-brand-bg-secondary border border-brand-border rounded-2xl flex flex-col gap-4">
              <span className="font-display text-sm font-bold text-white uppercase tracking-wider">Device Check-in Verification</span>
              
              <div className="flex flex-col gap-2 font-mono text-[10px] text-brand-text-muted">
                <div className="flex justify-between items-center border-b border-brand-border/20 py-1.5">
                  <span>GPS Geofence:</span>
                  <span className="text-brand-accent-emerald font-bold">ACTIVE (Radius 50m)</span>
                </div>
                <div className="flex justify-between items-center border-b border-brand-border/20 py-1.5">
                  <span>Bluetooth Beacon:</span>
                  <span className="text-brand-accent-emerald font-bold">CONNECTED</span>
                </div>
                <div className="flex justify-between items-center py-1.5">
                  <span>Classroom Scanner:</span>
                  <span className="text-brand-accent-amber font-bold">STANDBY</span>
                </div>
              </div>

              {/* Student specific scan simulation (Disabled for students/parents in read-only mode) */}
              {false && (
                <div className="mt-2 bg-brand-primary/5 p-3 rounded-xl border border-brand-primary/10 flex flex-col gap-2.5">
                  <span className="font-bold text-white text-[11px] flex items-center gap-1">
                    <Award className="w-3.5 h-3.5 text-brand-primary" /> Simulate Student Check-In
                  </span>
                  <p className="text-[9px] text-brand-text-muted">
                    Scan the classroom QR code display to automatically log your attendance for CS202.
                  </p>
                  <button 
                    onClick={() => alert('Simulating QR Scanner: Scanning... QR signature verified on-chain. Marked Present for CS202.')}
                    className="w-full py-1.5 bg-brand-primary text-white rounded-lg text-[9px] font-bold hover:bg-brand-primary/80 transition-all cursor-pointer"
                  >
                    Scan Classroom QR Code
                  </button>
                </div>
              )}
            </div>

            {/* low attendance warnings */}
            <div className="card p-6 bg-brand-bg-secondary border border-brand-border rounded-2xl flex flex-col gap-4">
              <span className="font-display text-sm font-bold text-white uppercase tracking-wider">Integrity Alert System</span>
              
              <div className="flex flex-col gap-3">
                <div className="p-3 bg-brand-accent-ruby/5 border border-brand-accent-ruby/10 rounded-xl flex items-start gap-2.5">
                  <ShieldAlert className="w-4 h-4 text-brand-accent-ruby shrink-0 mt-0.5" />
                  <div className="flex flex-col">
                    <strong className="text-white text-[10px]">Low Attendance Warnings Issued</strong>
                    <span className="text-[9px] text-brand-text-muted mt-0.5">3 students currently do not satisfy the 75% attendance threshold requirements.</span>
                  </div>
                </div>
              </div>
            </div>

          </div>

        </div>
      )}

      {/* My Attendance Card (Student Dashboard) */}
      {activeTab === 'student_dashboard' && (
        <div className="flex flex-col gap-6 text-left">
          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="card p-5 bg-brand-bg-secondary border border-brand-border rounded-2xl flex flex-col gap-1.5">
              <span className="text-[10px] text-brand-text-muted uppercase tracking-wider font-semibold">Overall Attendance</span>
              <strong className="text-2xl text-brand-accent-emerald font-display">86.4%</strong>
              <span className="text-[9px] text-brand-accent-emerald font-medium">✓ Meets 75% requirement</span>
            </div>
            <div className="card p-5 bg-brand-bg-secondary border border-brand-border rounded-2xl flex flex-col gap-1.5">
              <span className="text-[10px] text-brand-text-muted uppercase tracking-wider font-semibold">Total Lectures Held</span>
              <strong className="text-2xl text-white font-display">120</strong>
              <span className="text-[9px] text-brand-text-muted">Across 5 active courses</span>
            </div>
            <div className="card p-5 bg-brand-bg-secondary border border-brand-border rounded-2xl flex flex-col gap-1.5">
              <span className="text-[10px] text-brand-text-muted uppercase tracking-wider font-semibold">Classes Attended</span>
              <strong className="text-2xl text-white font-display">104</strong>
              <span className="text-[9px] text-brand-text-muted">95 present, 9 late/excused</span>
            </div>
            <div className="card p-5 bg-brand-bg-secondary border border-brand-border rounded-2xl flex flex-col gap-1.5">
              <span className="text-[10px] text-brand-text-muted uppercase tracking-wider font-semibold">Absences Recorded</span>
              <strong className="text-2xl text-brand-accent-ruby font-display">8</strong>
              <span className="text-[9px] text-brand-text-muted font-medium">8 unexcused absences</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Subject-Wise Table (2 Columns) */}
            <div className="lg:col-span-2 card p-6 bg-brand-bg-secondary border border-brand-border rounded-2xl flex flex-col gap-4">
              <div className="flex justify-between items-center border-b border-brand-border/20 pb-3">
                <span className="font-display text-sm font-bold text-white uppercase tracking-wider">Subject-Wise Breakdown</span>
                <button 
                  onClick={() => alert('Downloading official subject-wise attendance report (PDF). Cryptographic audit proof: 0x82f913d...')}
                  className="px-3 py-1.5 bg-brand-bg-tertiary border border-brand-border text-white text-[10px] font-bold rounded-lg flex items-center gap-1.5 cursor-pointer hover:bg-brand-primary/10 transition-all"
                >
                  <Download className="w-3.5 h-3.5" /> Download Report
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-left text-xs">
                  <thead>
                    <tr className="border-b border-brand-border text-brand-text-subtle text-[10px] uppercase font-bold tracking-wider">
                      <th className="p-3">Course Code & Title</th>
                      <th className="p-3 text-center">Attended / Held</th>
                      <th className="p-3 text-center">Percentage</th>
                      <th className="p-3 text-center">Status</th>
                      <th className="p-3 text-right">Correction</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-brand-border/30 text-brand-text-main">
                      <td className="p-3 font-semibold text-white">CS101 - Intro Programming</td>
                      <td className="p-3 text-center font-mono">22 / 24</td>
                      <td className="p-3 text-center font-mono font-bold text-brand-accent-emerald">91.6%</td>
                      <td className="p-3 text-center"><span className="px-1.5 py-0.5 bg-brand-accent-emerald/10 text-brand-accent-emerald text-[9px] rounded font-bold">Good</span></td>
                      <td className="p-3 text-right"><button onClick={() => { setSelectedCorrAsn('CS101'); alert('Selected CS101. Please use the Correction Request Form on the right.'); }} className="text-brand-primary hover:underline font-bold text-[10px] cursor-pointer">Request</button></td>
                    </tr>
                    <tr className="border-b border-brand-border/30 text-brand-text-main">
                      <td className="p-3 font-semibold text-white">EE201 - Signals & Systems</td>
                      <td className="p-3 text-center font-mono">20 / 24</td>
                      <td className="p-3 text-center font-mono font-bold text-brand-accent-emerald">83.3%</td>
                      <td className="p-3 text-center"><span className="px-1.5 py-0.5 bg-brand-accent-emerald/10 text-brand-accent-emerald text-[9px] rounded font-bold">Good</span></td>
                      <td className="p-3 text-right"><button onClick={() => { setSelectedCorrAsn('EE201'); alert('Selected EE201. Please use the Correction Request Form on the right.'); }} className="text-brand-primary hover:underline font-bold text-[10px] cursor-pointer">Request</button></td>
                    </tr>
                    <tr className="border-b border-brand-border/30 text-brand-text-main">
                      <td className="p-3 font-semibold text-white text-brand-accent-ruby">ME102 - Engineering Thermodynamics</td>
                      <td className="p-3 text-center font-mono">16 / 24</td>
                      <td className="p-3 text-center font-mono font-bold text-brand-accent-ruby">66.7%</td>
                      <td className="p-3 text-center"><span className="px-1.5 py-0.5 bg-brand-accent-ruby/10 text-brand-accent-ruby text-[9px] rounded font-bold">Critical Warning</span></td>
                      <td className="p-3 text-right"><button onClick={() => { setSelectedCorrAsn('ME102'); alert('Selected ME102. Please use the Correction Request Form on the right.'); }} className="text-brand-primary hover:underline font-bold text-[10px] cursor-pointer">Request</button></td>
                    </tr>
                    <tr className="border-b border-brand-border/30 text-brand-text-main">
                      <td className="p-3 font-semibold text-white">CS202 - Data Structures</td>
                      <td className="p-3 text-center font-mono">23 / 24</td>
                      <td className="p-3 text-center font-mono font-bold text-brand-accent-emerald">95.8%</td>
                      <td className="p-3 text-center"><span className="px-1.5 py-0.5 bg-brand-accent-emerald/10 text-brand-accent-emerald text-[9px] rounded font-bold">Excellent</span></td>
                      <td className="p-3 text-right"><button onClick={() => { setSelectedCorrAsn('CS202'); alert('Selected CS202. Please use the Correction Request Form on the right.'); }} className="text-brand-primary hover:underline font-bold text-[10px] cursor-pointer">Request</button></td>
                    </tr>
                    <tr className="border-b border-brand-border/30 text-brand-text-main">
                      <td className="p-3 font-semibold text-white">BI101 - Biotechnology Basics</td>
                      <td className="p-3 text-center font-mono">23 / 24</td>
                      <td className="p-3 text-center font-mono font-bold text-brand-accent-emerald">95.8%</td>
                      <td className="p-3 text-center"><span className="px-1.5 py-0.5 bg-brand-accent-emerald/10 text-brand-accent-emerald text-[9px] rounded font-bold">Excellent</span></td>
                      <td className="p-3 text-right"><button onClick={() => { setSelectedCorrAsn('BI101'); alert('Selected BI101. Please use the Correction Request Form on the right.'); }} className="text-brand-primary hover:underline font-bold text-[10px] cursor-pointer">Request</button></td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Dynamic Calendar Widget (June 2026) */}
              <div className="border-t border-brand-border/20 pt-4 mt-2">
                <span className="font-display text-[11px] font-bold text-white uppercase tracking-wider block mb-3">Attendance Calendar (June 2026)</span>
                <div className="grid grid-cols-7 gap-2 text-center text-[10px] font-mono">
                  <div className="font-bold text-brand-text-muted">Sun</div>
                  <div className="font-bold text-brand-text-muted">Mon</div>
                  <div className="font-bold text-brand-text-muted">Tue</div>
                  <div className="font-bold text-brand-text-muted">Wed</div>
                  <div className="font-bold text-brand-text-muted">Thu</div>
                  <div className="font-bold text-brand-text-muted">Fri</div>
                  <div className="font-bold text-brand-text-muted">Sat</div>
                  
                  {/* Days */}
                  <div className="p-2 border border-brand-border/20 rounded bg-brand-bg-tertiary/20 text-brand-text-muted">31</div>
                  <div className="p-2 border border-brand-border/20 rounded bg-brand-accent-emerald/10 text-brand-accent-emerald font-bold hover:bg-brand-accent-emerald/20 cursor-pointer">1</div>
                  <div className="p-2 border border-brand-border/20 rounded bg-brand-accent-emerald/10 text-brand-accent-emerald font-bold hover:bg-brand-accent-emerald/20 cursor-pointer">2</div>
                  <div className="p-2 border border-brand-border/20 rounded bg-brand-accent-emerald/10 text-brand-accent-emerald font-bold hover:bg-brand-accent-emerald/20 cursor-pointer">3</div>
                  <div className="p-2 border border-brand-border/20 rounded bg-brand-accent-ruby/10 text-brand-accent-ruby font-bold hover:bg-brand-accent-ruby/20 cursor-pointer">4</div>
                  <div className="p-2 border border-brand-border/20 rounded bg-brand-accent-emerald/10 text-brand-accent-emerald font-bold hover:bg-brand-accent-emerald/20 cursor-pointer">5</div>
                  <div className="p-2 border border-brand-border/20 rounded bg-brand-bg-tertiary/20 text-brand-text-muted">6</div>

                  <div className="p-2 border border-brand-border/20 rounded bg-brand-bg-tertiary/20 text-brand-text-muted">7</div>
                  <div className="p-2 border border-brand-border/20 rounded bg-brand-accent-emerald/10 text-brand-accent-emerald font-bold hover:bg-brand-accent-emerald/20 cursor-pointer">8</div>
                  <div className="p-2 border border-brand-border/20 rounded bg-brand-accent-emerald/10 text-brand-accent-emerald font-bold hover:bg-brand-accent-emerald/20 cursor-pointer">9</div>
                  <div className="p-2 border border-brand-border/20 rounded bg-brand-accent-emerald/10 text-brand-accent-emerald font-bold hover:bg-brand-accent-emerald/20 cursor-pointer">10</div>
                  <div className="p-2 border border-brand-border/20 rounded bg-brand-accent-amber/10 text-brand-accent-amber font-bold hover:bg-brand-accent-amber/20 cursor-pointer">11</div>
                  <div className="p-2 border border-brand-border/20 rounded bg-brand-accent-emerald/10 text-brand-accent-emerald font-bold hover:bg-brand-accent-emerald/20 cursor-pointer">12</div>
                  <div className="p-2 border border-brand-border/20 rounded bg-brand-bg-tertiary/20 text-brand-text-muted">13</div>

                  <div className="p-2 border border-brand-border/20 rounded bg-brand-bg-tertiary/20 text-brand-text-muted">14</div>
                  <div className="p-2 border border-brand-border/20 rounded bg-brand-accent-emerald/10 text-brand-accent-emerald font-bold hover:bg-brand-accent-emerald/20 cursor-pointer">15</div>
                  <div className="p-2 border border-brand-border/20 rounded bg-brand-accent-emerald/10 text-brand-accent-emerald font-bold hover:bg-brand-accent-emerald/20 cursor-pointer">16</div>
                  <div className="p-2 border border-brand-border/20 rounded bg-brand-accent-emerald/10 text-brand-accent-emerald font-bold hover:bg-brand-accent-emerald/20 cursor-pointer">17</div>
                  <div className="p-2 border border-brand-border/20 rounded bg-brand-accent-emerald/10 text-brand-accent-emerald font-bold hover:bg-brand-accent-emerald/20 cursor-pointer">18</div>
                  <div className="p-2 border border-brand-border/20 rounded bg-brand-accent-ruby/10 text-brand-accent-ruby font-bold hover:bg-brand-accent-ruby/20 cursor-pointer">19</div>
                  <div className="p-2 border border-brand-border/20 rounded bg-brand-bg-tertiary/20 text-brand-text-muted">20</div>

                  <div className="p-2 border border-brand-border/20 rounded bg-brand-bg-tertiary/20 text-brand-text-muted">21</div>
                  <div className="p-2 border border-brand-border/20 rounded bg-brand-accent-emerald/10 text-brand-accent-emerald font-bold hover:bg-brand-accent-emerald/20 cursor-pointer">22</div>
                  <div className="p-2 border border-brand-border/20 rounded bg-brand-accent-emerald/10 text-brand-accent-emerald font-bold hover:bg-brand-accent-emerald/20 cursor-pointer">23</div>
                  <div className="p-2 border border-brand-border/20 rounded bg-brand-accent-emerald/10 text-brand-accent-emerald font-bold hover:bg-brand-accent-emerald/20 cursor-pointer bg-brand-primary/10 border-brand-primary">24</div>
                  <div className="p-2 border border-brand-border/20 rounded bg-brand-bg-tertiary/30 text-brand-text-muted hover:bg-brand-primary/5 cursor-pointer">25</div>
                  <div className="p-2 border border-brand-border/20 rounded bg-brand-bg-tertiary/30 text-brand-text-muted hover:bg-brand-primary/5 cursor-pointer">26</div>
                  <div className="p-2 border border-brand-border/20 rounded bg-brand-bg-tertiary/20 text-brand-text-muted">27</div>
                </div>
              </div>
            </div>

            {/* Right Form: Submit Request & History (1 Column) */}
            <div className="flex flex-col gap-6 text-xs text-left">
              <div className="card p-6 bg-brand-bg-secondary border border-brand-border rounded-2xl flex flex-col gap-4">
                <span className="font-display text-sm font-bold text-white uppercase tracking-wider">Submit Correction Request</span>
                <p className="text-brand-text-muted text-[10px]">
                  Submit an attendance correction to your faculty coordinator for review.
                </p>

                <div className="flex flex-col gap-3 text-xs">
                  <div className="flex flex-col gap-1.5">
                    <label className="font-semibold text-brand-text-subtle">Target Course</label>
                    <select 
                      value={selectedCorrAsn}
                      onChange={(e) => setSelectedCorrAsn(e.target.value)}
                      className="bg-brand-bg-tertiary border border-brand-border p-2.5 rounded-xl outline-none text-white cursor-pointer"
                    >
                      {allowedCourses.map(c => (
                        <option key={c.code} value={c.code}>{c.code} - {c.title}</option>
                      ))}
                    </select>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="font-semibold text-brand-text-subtle">Requested Status</label>
                    <select 
                      value={corrReqStatus}
                      onChange={(e) => setCorrReqStatus(e.target.value)}
                      className="bg-brand-bg-tertiary border border-brand-border p-2.5 rounded-xl outline-none text-white cursor-pointer"
                    >
                      <option value="PRESENT">Present</option>
                      <option value="EXCUSED">Excused</option>
                      <option value="MEDICAL_LEAVE">Medical Leave</option>
                      <option value="DUTY_LEAVE">Duty Leave</option>
                      <option value="ONLINE_PRESENT">Online Present</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="font-semibold text-brand-text-subtle">Justification / Reason</label>
                    <textarea 
                      value={corrReqReason}
                      onChange={(e) => setCorrReqReason(e.target.value)}
                      placeholder="e.g. Attended conference, submitted certificate..."
                      className="bg-brand-bg-tertiary border border-brand-border p-2.5 rounded-xl outline-none text-white h-20 resize-none"
                    />
                  </div>

                  <button 
                    onClick={handleSubmitCorrection}
                    className="btn btn-primary w-full py-2.5 font-bold"
                  >
                    Send Request to Faculty
                  </button>
                </div>
              </div>

              {/* In-App Notifications Feed */}
              <div className="card p-6 bg-brand-bg-secondary border border-brand-border rounded-2xl flex flex-col gap-4">
                <span className="font-display text-sm font-bold text-white uppercase tracking-wider">Attendance Notifications</span>
                <div className="flex flex-col gap-3">
                  <div className="p-3 bg-brand-primary/5 border border-brand-primary/10 rounded-xl text-[10px] text-brand-text-muted flex gap-2">
                    <CheckCircle2 className="w-4 h-4 text-brand-primary shrink-0" />
                    <div>
                      <strong>Attendance locked on-chain</strong>
                      <p className="mt-0.5">CS202 session locked by Prof. Marcus Chen. Tx: 0xda23...</p>
                    </div>
                  </div>
                  <div className="p-3 bg-brand-accent-emerald/5 border border-brand-accent-emerald/10 rounded-xl text-[10px] text-brand-text-muted flex gap-2">
                    <CheckCircle2 className="w-4 h-4 text-brand-accent-emerald shrink-0" />
                    <div>
                      <strong>Correction Request Approved</strong>
                      <p className="mt-0.5">Your correction for ME102 on 2026-06-15 was approved by HOD Jenkins.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Child Overview (Parent Dashboard) */}
      {activeTab === 'parent_dashboard' && (
        <div className="flex flex-col gap-6 text-left">
          {/* Child Selection Header */}
          <div className="card p-6 bg-brand-bg-secondary border border-brand-border rounded-2xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-brand-primary/10 border border-brand-primary/20 flex items-center justify-center font-display font-bold text-brand-primary text-xl">
                AR
              </div>
              <div className="flex flex-col">
                <strong className="text-white text-base">Alex Rivera</strong>
                <span className="text-xs text-brand-text-muted">Enrollment ID: <strong>STU002</strong> | Semester: <strong>IV (B.Tech CSE)</strong></span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-brand-text-muted uppercase font-bold block">Overall Attendance</span>
              <strong className="text-2xl text-brand-accent-emerald font-display block mt-1">86.4%</strong>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Subject cards list (2 Columns) */}
            <div className="lg:col-span-2 flex flex-col gap-4">
              <span className="font-display text-sm font-bold text-white uppercase tracking-wider block mb-1">Academic Attendance Roster</span>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="card p-5 bg-brand-bg-secondary border border-brand-border rounded-2xl flex justify-between items-start">
                  <div className="flex flex-col gap-1">
                    <strong className="text-white text-sm">CS101 - Intro Programming</strong>
                    <span className="text-xs text-brand-text-muted">Classes: 22 / 24</span>
                  </div>
                  <strong className="text-base text-brand-accent-emerald font-mono font-bold">91.6%</strong>
                </div>

                <div className="card p-5 bg-brand-bg-secondary border border-brand-border rounded-2xl flex justify-between items-start">
                  <div className="flex flex-col gap-1">
                    <strong className="text-white text-sm">EE201 - Signals & Systems</strong>
                    <span className="text-xs text-brand-text-muted">Classes: 20 / 24</span>
                  </div>
                  <strong className="text-base text-brand-accent-emerald font-mono font-bold">83.3%</strong>
                </div>

                <div className="card p-5 bg-brand-bg-secondary border border-brand-accent-ruby/20 border rounded-2xl flex justify-between items-start bg-brand-accent-ruby/5">
                  <div className="flex flex-col gap-1">
                    <strong className="text-white text-sm text-brand-accent-ruby">ME102 - Thermodynamics</strong>
                    <span className="text-xs text-brand-text-muted">Classes: 16 / 24</span>
                  </div>
                  <strong className="text-base text-brand-accent-ruby font-mono font-bold">66.7%</strong>
                </div>

                <div className="card p-5 bg-brand-bg-secondary border border-brand-border rounded-2xl flex justify-between items-start">
                  <div className="flex flex-col gap-1">
                    <strong className="text-white text-sm">CS202 - Data Structures</strong>
                    <span className="text-xs text-brand-text-muted">Classes: 23 / 24</span>
                  </div>
                  <strong className="text-base text-brand-accent-emerald font-mono font-bold">95.8%</strong>
                </div>
              </div>
            </div>

            {/* Notifications and low attendance alerts (1 Column) */}
            <div className="flex flex-col gap-6 text-xs">
              <div className="card p-6 bg-brand-bg-secondary border border-brand-border rounded-2xl flex flex-col gap-4">
                <span className="font-display text-sm font-bold text-white uppercase tracking-wider">Parent Alert Center</span>
                
                <div className="flex flex-col gap-3">
                  <div className="p-3.5 bg-brand-accent-ruby/5 border border-brand-accent-ruby/15 rounded-xl flex items-start gap-2.5">
                    <ShieldAlert className="w-4 h-4 text-brand-accent-ruby shrink-0 mt-0.5" />
                    <div className="flex flex-col">
                      <strong className="text-white text-[10px]">Critical Low Attendance Warning</strong>
                      <span className="text-brand-text-muted text-[9px] mt-0.5">Thermodynamics (ME102) is currently at 66.7% (minimum is 75%).</span>
                    </div>
                  </div>

                  <div className="p-3.5 bg-brand-accent-amber/5 border border-brand-accent-amber/15 rounded-xl flex items-start gap-2.5">
                    <AlertTriangle className="w-4 h-4 text-brand-accent-amber shrink-0 mt-0.5" />
                    <div className="flex flex-col">
                      <strong className="text-white text-[10px]">Absence Notification Alert</strong>
                      <span className="text-brand-text-muted text-[9px] mt-0.5">Alex was marked Absent for EE201 on 2026-06-19.</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="card p-6 bg-brand-bg-secondary border border-brand-border rounded-2xl flex flex-col gap-4">
                <span className="font-display text-sm font-bold text-white uppercase tracking-wider">Communication Channel</span>
                <p className="text-[10px] text-brand-text-muted">
                  Direct communication bridge with the department head (HOD Jenkins).
                </p>
                <button 
                  onClick={() => alert('Opening direct message interface with HOD Jenkins...')}
                  className="btn btn-primary w-full py-2 font-bold cursor-pointer"
                >
                  Message HOD
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. Corrections & Workflows tab */}
      {activeTab === 'corrections' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Main List of Corrections (2 Columns) */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            
            <div className="card p-6 bg-brand-bg-secondary border border-brand-border rounded-2xl flex flex-col gap-4">
              <span className="font-display text-sm font-bold text-white uppercase tracking-wider">Corrections Review Desk</span>
              <p className="text-brand-text-muted text-xs">
                Process student correction requests. Approved updates recalculate student overall averages and anchor transaction hashes.
              </p>

              <div className="flex flex-col gap-3.5">
                {corrections.filter(corr => {
                  if (!isStudentOrParent) return true;
                  if (currentUser?.role === 'student' || currentUser?.role === 'athlete') {
                    return corr.student === currentUser?.name;
                  }
                  if (currentUser?.role === 'parent' || currentUser?.role === 'sports_parent') {
                    return corr.student === 'Alex Rivera' || corr.student === 'Aria Nakamura';
                  }
                  return false;
                }).map(corr => (
                  <div key={corr.id} className="p-4 bg-brand-bg-tertiary/60 border border-brand-border/40 rounded-xl text-xs flex flex-col gap-3">
                    
                    <div className="flex justify-between items-start border-b border-brand-border/20 pb-2.5">
                      <div className="flex flex-col">
                        <span className="font-bold text-white text-sm">{corr.student}</span>
                        <span className="text-[10px] text-brand-text-muted font-mono mt-0.5">Course: {corr.courseCode} • Date: {corr.sessionDate}</span>
                      </div>
                      <span className={`badge px-2 py-0.5 rounded font-bold text-[10px] ${
                        corr.status === 'PENDING'
                          ? 'bg-brand-accent-amber/10 text-brand-accent-amber'
                          : corr.status === 'APPROVED'
                            ? 'bg-brand-accent-emerald/10 text-brand-accent-emerald'
                            : 'bg-brand-accent-ruby/10 text-brand-accent-ruby'
                      }`}>
                        {corr.status}
                      </span>
                    </div>

                    <div className="flex flex-col gap-1">
                      <span className="font-semibold text-brand-text-subtle">Request Description:</span>
                      <p className="text-brand-text-muted italic">"{corr.reason}"</p>
                    </div>

                    <div className="flex justify-between items-center text-[10px] text-brand-text-subtle font-mono mt-1">
                      <span>Status Shift: <strong>{corr.currentStatus}</strong> → <strong className="text-brand-accent-emerald">{corr.requestedStatus}</strong></span>
                      {corr.txHash && (
                        <span className="text-brand-primary">Receipt Signature: {corr.txHash}</span>
                      )}
                    </div>

                    {/* Faculty Actions */}
                    {(!isStudentOrParent && corr.status === 'PENDING') && (
                      <div className="flex justify-end gap-2 pt-2 border-t border-brand-border/20">
                        <button 
                          onClick={() => handleReviewCorrection(corr.id, false)}
                          className="px-3.5 py-1.5 border border-brand-border rounded-lg bg-brand-accent-ruby/10 text-brand-accent-ruby hover:bg-brand-accent-ruby/20 transition-all font-bold cursor-pointer"
                        >
                          Reject
                        </button>
                        <button 
                          onClick={() => handleReviewCorrection(corr.id, true)}
                          className="px-3.5 py-1.5 border border-brand-border rounded-lg bg-brand-accent-emerald/10 text-brand-accent-emerald hover:bg-brand-accent-emerald/20 transition-all font-bold cursor-pointer"
                        >
                          Approve Shift
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Student request panel (1 Column) */}
          <div className="flex flex-col gap-6 text-xs text-left">
            
            {/* Student/Parent Request Form */}
            {isStudentOrParent && (
              <div className="card p-6 bg-brand-bg-secondary border border-brand-border rounded-2xl flex flex-col gap-4">
                <span className="font-display text-sm font-bold text-white uppercase tracking-wider">Submit Correction Request</span>
                <p className="text-brand-text-muted text-[10px]">
                  Submit an attendance correction to your faculty coordinator for review.
                </p>

                <div className="flex flex-col gap-3 text-xs">
                  <div className="flex flex-col gap-1.5">
                    <label className="font-semibold text-brand-text-subtle">Target Course</label>
                    <select 
                      value={selectedCorrAsn}
                      onChange={(e) => setSelectedCorrAsn(e.target.value)}
                      className="bg-brand-bg-tertiary border border-brand-border p-2.5 rounded-xl outline-none text-white cursor-pointer"
                    >
                      {allowedCourses.map(c => (
                        <option key={c.code} value={c.code}>{c.code} - {c.title}</option>
                      ))}
                    </select>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="font-semibold text-brand-text-subtle">Requested Status</label>
                    <select 
                      value={corrReqStatus}
                      onChange={(e) => setCorrReqStatus(e.target.value)}
                      className="bg-brand-bg-tertiary border border-brand-border p-2.5 rounded-xl outline-none text-white cursor-pointer"
                    >
                      <option value="PRESENT">Present</option>
                      <option value="EXCUSED">Excused</option>
                      <option value="MEDICAL_LEAVE">Medical Leave</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="font-semibold text-brand-text-subtle">Justification / Reason</label>
                    <textarea 
                      value={corrReqReason}
                      onChange={(e) => setCorrReqReason(e.target.value)}
                      placeholder="e.g. Attended conference, submitted certificate..."
                      className="bg-brand-bg-tertiary border border-brand-border p-2.5 rounded-xl outline-none text-white h-20 resize-none"
                    />
                  </div>

                  <button 
                    onClick={handleSubmitCorrection}
                    className="btn btn-primary w-full py-2.5 font-bold"
                  >
                    Send Request to Faculty
                  </button>
                </div>
              </div>
            )}

            {/* Policy requirements */}
            <div className="card p-6 bg-brand-bg-secondary border border-brand-border rounded-2xl flex flex-col gap-3.5">
              <span className="font-display text-sm font-bold text-white uppercase tracking-wider">Attendance Policies</span>
              <ul className="list-disc pl-4 text-[10px] text-brand-text-muted flex flex-col gap-1.5">
                <li>Minimum required attendance rate for credit exam admissibility is <strong>75%</strong>.</li>
                <li>Corrections must be requested within <strong>14 days</strong> of the session date.</li>
                <li>Unjustified absences do not qualify for correction revisions.</li>
              </ul>
            </div>

          </div>

        </div>
      )}

      {/* 3. AI Forecasting tab */}
      {activeTab === 'analytics' && (
        <div className="flex flex-col gap-6">
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Forecast Chart Panel */}
            <div className="lg:col-span-2 card p-6 bg-brand-bg-secondary border border-brand-border rounded-2xl flex flex-col gap-4">
              <h3 className="font-display text-lg font-bold text-brand-text-main">AI Weekly Attendance Forecast</h3>
              <p className="text-brand-text-muted text-xs">
                Uses historical check-in records to project expected attendance rates for the upcoming week using sequence modeling.
              </p>

              <div className="h-[260px] relative mt-2">
                <canvas ref={canvasRef}></canvas>
              </div>
            </div>

            {/* Projection Summary Cards */}
            <div className="card p-6 bg-brand-bg-secondary border border-brand-border rounded-2xl flex flex-col gap-4">
              <span className="font-display text-sm font-bold text-white uppercase tracking-wider">AI Forecast Metrics</span>
              
              <div className="flex flex-col gap-4 p-4 rounded-xl border border-brand-border bg-brand-bg-tertiary">
                <div className="text-xs text-brand-text-muted flex flex-col gap-2.5">
                  <div className="flex justify-between items-center">
                    <span>Projected Weekly Average:</span>
                    <strong className="text-brand-primary font-mono text-base">{aiAvg}</strong>
                  </div>
                  <div className="flex justify-between items-center border-t border-brand-border/20 pt-2.5">
                    <span>Mid-week Peak Projection:</span>
                    <strong className="text-brand-accent-emerald font-mono text-sm">{aiPeak}</strong>
                  </div>
                  <div className="flex justify-between items-center border-t border-brand-border/20 pt-2.5">
                    <span>Weekend Dip Projection:</span>
                    <strong className="text-brand-accent-ruby font-mono text-sm">{aiDip}</strong>
                  </div>
                </div>
                
                {!isStudentOrParent && (
                  <button 
                    onClick={runAttendanceProjection}
                    disabled={aiProjecting}
                    className="btn btn-secondary btn-sm mt-3 w-full cursor-pointer disabled:opacity-50"
                  >
                    {aiProjecting ? 'Projecting...' : 'Recalibrate AI Forecast'}
                  </button>
                )}
              </div>

              {/* Integrity summary */}
              <div className="p-3 bg-brand-accent-emerald/5 border border-brand-emerald/10 rounded-xl text-[10px] text-brand-text-muted flex items-start gap-2.5">
                <Sparkles className="w-4 h-4 text-brand-accent-emerald shrink-0 mt-0.5" />
                <div className="flex flex-col">
                  <strong>AI Predictive Accuracy: 94.6%</strong>
                  <span className="mt-0.5">Slight attendance drop projected for Friday morning due to upcoming examination schedule blocks.</span>
                </div>
              </div>
            </div>

          </div>

          {/* AI Dropout Risk alerts */}
          <div className="card p-6 bg-brand-bg-secondary border border-brand-border rounded-2xl flex flex-col gap-4">
            <span className="font-display text-sm font-bold text-white uppercase tracking-wider">Student Academic & Dropout Risk Alerts</span>
            <p className="text-brand-text-muted text-xs">
              AI-driven detection monitoring student class participation trends to identify drop-out risk.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {dropoutRiskAlerts.map(alertObj => (
                <div key={alertObj.studentId} className="p-4 rounded-xl border border-brand-border/50 bg-brand-bg-tertiary/40 flex justify-between items-start gap-4">
                  <div className="flex flex-col gap-1.5 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white">{alertObj.name} ({alertObj.studentId})</span>
                      <span className={`px-2 py-0.5 rounded text-[8px] font-bold ${
                        alertObj.riskLevel === 'High' 
                          ? 'bg-brand-accent-ruby/10 text-brand-accent-ruby' 
                          : 'bg-brand-accent-amber/10 text-brand-accent-amber'
                      }`}>
                        {alertObj.riskLevel} Risk
                      </span>
                    </div>
                    <span className="text-[10px] text-brand-text-muted">Recommendation: {alertObj.recommendation}</span>
                  </div>
                  <div className="text-right shrink-0 flex flex-col items-end">
                    <span className="text-[9px] text-brand-text-muted uppercase">Attendance</span>
                    <strong className="text-brand-accent-ruby font-mono text-sm mt-0.5">{alertObj.attendanceRate}%</strong>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* 4. Timetable & Master Schedule tab */}
      {activeTab === 'schedule' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-xs">
          
          {/* Master Schedule lists (2 Columns) */}
          <div className="lg:col-span-2 card p-6 bg-brand-bg-secondary border border-brand-border rounded-2xl flex flex-col gap-4">
            <span className="font-display text-sm font-bold text-white uppercase tracking-wider">Timetables & Working Hours</span>
            <p className="text-brand-text-muted text-xs">
              Weekly class check-ins scheduled across departments, sports training structures, and hostels.
            </p>

            <div className="flex flex-col gap-3">
              <div className="p-4 border border-brand-border rounded-xl bg-brand-bg-tertiary/60 flex justify-between items-center" style={{ borderLeft: '4px solid var(--color-brand-primary)' }}>
                <div className="flex flex-col">
                  <span className="font-bold text-white text-sm">CS101 - Introduction to Programming</span>
                  <span className="text-[10px] text-brand-text-muted mt-1">Academic Class • Monday 09:00 AM - 11:00 AM • Classroom Hall A</span>
                </div>
                <span className="badge bg-brand-primary/10 text-brand-primary font-bold px-2 py-0.5 rounded text-[10px]">Active</span>
              </div>

              <div className="p-4 border border-brand-border rounded-xl bg-brand-bg-tertiary/60 flex justify-between items-center" style={{ borderLeft: '4px solid var(--color-brand-accent-cyan)' }}>
                <div className="flex flex-col">
                  <span className="font-bold text-white text-sm">EE201 - Signals and Systems</span>
                  <span className="text-[10px] text-brand-text-muted mt-1">Academic Class • Tuesday 11:30 AM - 01:30 PM • Classroom Hall B</span>
                </div>
                <span className="badge bg-brand-accent-cyan/10 text-brand-accent-cyan font-bold px-2 py-0.5 rounded text-[10px]">Active</span>
              </div>

              <div className="p-4 border border-brand-border rounded-xl bg-brand-bg-tertiary/60 flex justify-between items-center" style={{ borderLeft: '4px solid var(--color-brand-accent-amber)' }}>
                <div className="flex flex-col">
                  <span className="font-bold text-white text-sm">Athletic Conditioning Roster</span>
                  <span className="text-[10px] text-brand-text-muted mt-1">Sports Training • Wednesday 04:00 PM - 06:00 PM • Campus Stadium</span>
                </div>
                <span className="badge bg-brand-accent-amber/10 text-brand-accent-amber font-bold px-2 py-0.5 rounded text-[10px]">Active</span>
              </div>

              <div className="p-4 border border-brand-border rounded-xl bg-brand-bg-tertiary/60 flex justify-between items-center" style={{ borderLeft: '4px solid var(--color-brand-accent-emerald)' }}>
                <div className="flex flex-col">
                  <span className="font-bold text-white text-sm">Hostel Night Roll Call</span>
                  <span className="text-[10px] text-brand-text-muted mt-1">Hostel Attendance • Daily 09:30 PM • Block A Lounge</span>
                </div>
                <span className="badge bg-brand-accent-emerald/10 text-brand-accent-emerald font-bold px-2 py-0.5 rounded text-[10px]">Active</span>
              </div>
            </div>
          </div>

          {/* Details sidebar (1 Column) */}
          <div className="flex flex-col gap-6 text-xs text-left">
            <div className="card p-6 bg-brand-bg-secondary border border-brand-border rounded-2xl flex flex-col gap-3">
              <span className="font-display text-sm font-bold text-white uppercase tracking-wider">Calendar Summary</span>
              <p className="text-brand-text-muted text-[10px]">
                Semester academic schedule runs 16 consecutive weeks, ending 2026-07-20.
              </p>
              <div className="bg-brand-bg-tertiary p-3.5 rounded-xl border border-brand-border flex items-center gap-3">
                <Calendar className="w-5 h-5 text-brand-primary" />
                <div className="flex flex-col">
                  <strong className="text-white text-xs">Current Week: 12</strong>
                  <span className="text-[9px] text-brand-text-muted mt-0.5">Classes running smoothly</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* 5. Blockchain Audit Logs tab */}
      {activeTab === 'blockchain' && (
        <div className="flex flex-col gap-6 text-xs text-left">
          
          {/* Live Blockchain Stream */}
          <div className="card p-6 bg-brand-bg-secondary border border-brand-border rounded-2xl flex flex-col gap-4">
            <div className="flex justify-between items-center border-b border-brand-border/20 pb-3">
              <div className="flex items-center gap-2">
                <Fingerprint className="w-5 h-5 text-brand-primary" />
                <span className="font-display text-sm font-bold text-white">Consortium Blockchain Ledger Explorer</span>
              </div>
              <span className="badge bg-brand-primary/10 text-brand-primary font-bold px-2 py-0.5 rounded font-mono text-[9px]">CampusX Chain Active</span>
            </div>

            <p className="text-brand-text-muted">
              Live block verification showing transaction signatures and cryptographic proof hashes for finalized attendance sessions.
            </p>

            <div className="flex flex-col gap-4.5 mt-2">
              {blockchainProofStream.map((blockObj, idx) => (
                <div key={idx} className="p-4 rounded-xl border border-brand-border/60 bg-brand-bg-tertiary/40 flex justify-between items-start gap-4 hover:border-brand-primary/30 transition-all duration-200">
                  <div className="flex flex-col gap-2 font-mono text-[10px]">
                    <div className="flex items-center gap-2 text-xs">
                      <span className="badge bg-brand-accent-emerald/10 text-brand-accent-emerald font-bold px-2 py-0.5 rounded">Block #{blockObj.height}</span>
                      <strong className="text-white font-sans">{blockObj.method}</strong>
                    </div>
                    <div className="text-[10px] text-brand-text-muted mt-1 flex flex-col gap-1">
                      <span>Transaction Hash: <strong className="text-brand-text-subtle font-mono">{blockObj.hash}</strong></span>
                      <span>Signatures: <code className="text-brand-primary font-semibold font-mono">{JSON.stringify(blockObj.signatures)}</code></span>
                    </div>
                  </div>
                  <div className="text-right text-[10px] text-brand-text-muted font-mono shrink-0">
                    <span>{blockObj.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Audit trail list */}
          <div className="card p-6 bg-brand-bg-secondary border border-brand-border rounded-2xl flex flex-col gap-4">
            <span className="font-display text-sm font-bold text-white uppercase tracking-wider">CampusX Audit Log Registry</span>
            <p className="text-brand-text-muted text-xs">
              Chronological ledger tracking local database state operations.
            </p>

            <div className="max-h-[300px] overflow-y-auto border border-brand-border/60 rounded-xl bg-brand-bg-primary/20">
              <table className="w-full border-collapse text-left text-xs font-mono">
                <thead>
                  <tr className="border-b border-brand-border text-brand-text-subtle text-[9px] uppercase font-bold tracking-wider">
                    <th className="p-3">Operator</th>
                    <th className="p-3">Action</th>
                    <th className="p-3">Details</th>
                    <th className="p-3 text-right">Time</th>
                  </tr>
                </thead>
                <tbody>
                  {auditLogs.map(log => (
                    <tr key={log.id} className="border-b border-brand-border/30 text-brand-text-muted hover:bg-white/[0.01] transition-all">
                      <td className="p-3 text-white font-semibold">{log.operator}</td>
                      <td className="p-3">
                        <span className="badge bg-brand-primary/10 text-brand-primary px-2 py-0.5 rounded font-bold text-[9px]">
                          {log.action}
                        </span>
                      </td>
                      <td className="p-3 text-brand-text-subtle">{log.details}</td>
                      <td className="p-3 text-right text-[10px] font-mono shrink-0">{log.timestamp}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
