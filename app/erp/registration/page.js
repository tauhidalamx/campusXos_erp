'use client';

import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Calendar, 
  Award, 
  CheckCircle, 
  AlertTriangle, 
  CreditCard, 
  ChevronRight, 
  ChevronLeft, 
  Download, 
  Shield, 
  Loader2, 
  Check, 
  X,
  FileCheck,
  Building,
  UserCheck
} from 'lucide-react';

// Predefined credits for courses
const COURSE_CREDITS = {
  'CS101': 3,
  'CS202': 4,
  'CS302': 4,
  'CS305': 3,
  'EE101': 4
};

export default function SemesterRegistrationPage() {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sessionWindow, setSessionWindow] = useState(null);
  
  // Student flow state
  const [currentStep, setCurrentStep] = useState(1);
  const [clearanceChecks, setClearanceChecks] = useState(null);
  const [offerings, setOfferings] = useState([]);
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [timetableSlots, setTimetableSlots] = useState([]);
  const [timetableConflicts, setTimetableConflicts] = useState([]);
  const [invoice, setInvoice] = useState(null);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [registrationSlip, setRegistrationSlip] = useState(null);

  // Administrative / Approvals state
  const [analyticsData, setAnalyticsData] = useState(null);
  const [activeTab, setActiveTab] = useState('windows'); // 'windows', 'approvals'
  const [pendingApprovals, setPendingApprovals] = useState([]);
  const [approvalLoading, setApprovalLoading] = useState({});
  const [approvalComments, setApprovalComments] = useState({});

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const session = sessionStorage.getItem('campusx_erp_session');
      if (session) {
        const user = JSON.parse(session);
        setCurrentUser(user);
        
        // Fetch session window info
        fetchWindows();

        // Check if user is a student or staff
        if (user.role === 'student') {
          fetchStudentStatus(user.id || 'STU001');
          fetchOfferings();
        } else {
          fetchAnalytics();
        }
      } else {
        setLoading(false);
      }
    }
  }, []);

  const fetchWindows = async () => {
    try {
      const res = await fetch('/api/registration/windows');
      const data = await res.json();
      const activeWindow = data.find(w => w.session === 'Spring 2026') || data[0];
      setSessionWindow(activeWindow);
    } catch (err) {
      console.error('Error fetching registration windows:', err);
    }
  };

  const fetchStudentStatus = async (studentId) => {
    try {
      const res = await fetch(`/api/registration/status?student_id=${studentId}`);
      const data = await res.json();
      setClearanceChecks(data.checks || {});
      if (data.registration) {
        setRegistrationSlip(data.registration);
        // Pre-fill selected courses if student has already submitted
        fetchTimetable(studentId);
      }
      setLoading(false);
    } catch (err) {
      console.error('Error fetching student registration status:', err);
      setLoading(false);
    }
  };

  const fetchOfferings = async () => {
    try {
      const res = await fetch('/api/registration/offerings');
      const data = await res.json();
      setOfferings(data);
    } catch (err) {
      console.error('Error fetching course offerings:', err);
    }
  };

  const fetchTimetable = async (studentId) => {
    try {
      const res = await fetch(`/api/registration/timetable?student_id=${studentId}`);
      const data = await res.json();
      setTimetableSlots(data);
    } catch (err) {
      console.error('Error fetching timetable slots:', err);
    }
  };

  const fetchAnalytics = async () => {
    try {
      const res = await fetch('/api/registration/analytics');
      const data = await res.json();
      setAnalyticsData(data);
      if (data.registrations) {
        setPendingApprovals(data.registrations);
      }
      setLoading(false);
    } catch (err) {
      console.error('Error fetching registration analytics:', err);
      setLoading(false);
    }
  };

  const toggleWindow = async () => {
    if (!sessionWindow) return;
    const nextState = sessionWindow.is_open === 1 ? 0 : 1;
    try {
      const res = await fetch('/api/registration/windows/toggle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ session: sessionWindow.session, is_open: nextState })
      });
      const data = await res.json();
      if (data.success) {
        setSessionWindow({ ...sessionWindow, is_open: nextState });
      }
    } catch (err) {
      console.error('Error toggling registration window:', err);
    }
  };

  // Stepper calculations & courses validation
  const handleCourseSelect = (courseCode) => {
    const isSelected = selectedCourses.includes(courseCode);
    let nextSelection = [];
    if (isSelected) {
      nextSelection = selectedCourses.filter(c => c !== courseCode);
    } else {
      nextSelection = [...selectedCourses, courseCode];
    }
    
    setSelectedCourses(nextSelection);
    checkTimetableConflicts(nextSelection);
  };

  const checkTimetableConflicts = async (courses) => {
    if (courses.length === 0) {
      setTimetableConflicts([]);
      return;
    }

    try {
      const conflicts = [];
      
      const mockTimetables = [
        { course_code: 'CS101', day_of_week: 'Monday', start_time: '09:00', end_time: '10:30' },
        { course_code: 'CS101', day_of_week: 'Wednesday', start_time: '09:00', end_time: '10:30' },
        { course_code: 'CS202', day_of_week: 'Tuesday', start_time: '11:00', end_time: '12:30' },
        { course_code: 'CS202', day_of_week: 'Thursday', start_time: '11:00', end_time: '12:30' },
        { course_code: 'CS302', day_of_week: 'Monday', start_time: '11:00', end_time: '12:30' },
        { course_code: 'CS302', day_of_week: 'Wednesday', start_time: '11:00', end_time: '12:30' },
        { course_code: 'CS305', day_of_week: 'Tuesday', start_time: '09:00', end_time: '10:30' }
      ];

      const activeSlots = mockTimetables.filter(slot => courses.includes(slot.course_code));

      // Match overlaps
      for (let i = 0; i < activeSlots.length; i++) {
        for (let j = i + 1; j < activeSlots.length; j++) {
          const s1 = activeSlots[i];
          const s2 = activeSlots[j];
          if (s1.day_of_week === s2.day_of_week) {
            // Overlap check
            const start1 = parseInt(s1.start_time.replace(':', ''));
            const end1 = parseInt(s1.end_time.replace(':', ''));
            const start2 = parseInt(s2.start_time.replace(':', ''));
            const end2 = parseInt(s2.end_time.replace(':', ''));

            if ((start1 < end2 && start2 < end1)) {
              conflicts.push(`Conflict: ${s1.course_code} overlaps with ${s2.course_code} on ${s1.day_of_week} at ${s1.start_time}`);
            }
          }
        }
      }
      setTimetableConflicts(conflicts);
    } catch (err) {
      console.error('Error calculating timetable conflicts:', err);
    }
  };

  const calculateTotalCredits = () => {
    return selectedCourses.reduce((sum, code) => sum + (COURSE_CREDITS[code] || 3), 0);
  };

  const proceedToCheckout = () => {
    const credits = calculateTotalCredits();
    if (credits < 12 || credits > 21) {
      alert(`Invalid Credit Range. You selected ${credits} credits. Term Registration requires a minimum of 12 credits and maximum of 21 credits.`);
      return;
    }
    if (timetableConflicts.length > 0) {
      alert('You have timetable schedule conflicts. Please resolve them before proceeding.');
      return;
    }

    // Prepare Invoice
    const baseTuition = 4000.00;
    const courseAddon = selectedCourses.length * 150.00;
    const examFee = 250.00;
    const labFee = 150.00;
    const subtotal = baseTuition + courseAddon + examFee + labFee;
    
    // Check if scholarship applies (e.g. STU001 gets 20%)
    const discountPercent = clearanceChecks?.scholarshipPercent || 0;
    const discountAmt = subtotal * (discountPercent / 100);
    const totalPayable = subtotal - discountAmt;

    setInvoice({
      baseTuition,
      courseAddon,
      examFee,
      labFee,
      discountPercent,
      discountAmt,
      totalPayable
    });
    setCurrentStep(3);
  };

  const executeFeePayment = async () => {
    setPaymentLoading(true);
    try {
      const studentId = currentUser?.id || 'STU001';
      const res = await fetch('/api/registration/pay', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          student_id: studentId,
          invoice_id: 'inv_101',
          amount: invoice.totalPayable,
          fee_type: 'TUITION',
          payment_method: 'WALLETMOCK'
        })
      });
      const data = await res.json();
      if (data.success) {
        alert(`Payment successful! Transaction Hash: ${data.tx_hash}. Clearance is registered on the ledger.`);
        await fetchStudentStatus(studentId);
        setCurrentStep(4);
      }
    } catch (err) {
      console.error('Error executing fee payment:', err);
    } finally {
      setPaymentLoading(false);
    }
  };

  const submitRegistration = async () => {
    setSubmitLoading(true);
    try {
      const studentId = currentUser?.id || 'STU001';
      const res = await fetch('/api/registration/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          student_id: studentId,
          session: 'Spring 2026',
          courses: selectedCourses
        })
      });
      const data = await res.json();
      if (data.success) {
        alert('Course registration submitted for advisor review!');
        await fetchStudentStatus(studentId);
        setCurrentStep(4);
      }
    } catch (err) {
      console.error('Error submitting registration:', err);
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleApprovalAction = async (studentId, step, action) => {
    setApprovalLoading(prev => ({ ...prev, [studentId]: true }));
    try {
      const comments = approvalComments[studentId] || 'Approved through management desk';
      const approverName = currentUser?.name || 'Academic Administrator';
      
      const res = await fetch('/api/registration/approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          student_id: studentId,
          session: 'Spring 2026',
          step,
          approver: approverName,
          comments,
          action
        })
      });
      const data = await res.json();
      if (data.success) {
        alert(`Registration ${action.toLowerCase()}d successfully for student ${studentId}.`);
        fetchAnalytics(); // reload roster
      }
    } catch (err) {
      console.error('Error submitting approval signature:', err);
    } finally {
      setApprovalLoading(prev => ({ ...prev, [studentId]: false }));
    }
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="w-10 h-10 text-brand-primary animate-spin" />
      </div>
    );
  }

  if (currentUser && currentUser.role !== 'student') {
    return (
      <div className="flex flex-col gap-6 md:gap-8 fade-in text-white">
        <div className="flex justify-between items-center pb-4 border-b border-brand-border/40">
          <div>
            <h1 className="text-3xl font-display font-bold tracking-tight flex items-center gap-3">
              <Shield className="w-8 h-8 text-brand-primary" />
              Academic Office Control Portal
            </h1>
            <p className="text-brand-text-muted text-sm mt-1">
              Semester registrations, clearance validation, approval workflows, and audit trail.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="card p-5 bg-brand-bg-secondary border border-brand-border rounded-2xl">
            <span className="text-brand-text-muted text-xs font-semibold uppercase">Total Applications</span>
            <span className="block text-3xl font-bold font-display text-white mt-1">
              {analyticsData?.registrations?.length || 0}
            </span>
          </div>
          <div className="card p-5 bg-brand-bg-secondary border border-brand-border rounded-2xl">
            <span className="text-brand-text-muted text-xs font-semibold uppercase">Approved Enrolments</span>
            <span className="block text-3xl font-bold font-display text-brand-accent-emerald mt-1">
              {analyticsData?.registrations?.filter(r => r.status === 'APPROVED').length || 0}
            </span>
          </div>
          <div className="card p-5 bg-brand-bg-secondary border border-brand-border rounded-2xl">
            <span className="text-brand-text-muted text-xs font-semibold uppercase">Pending Approvals</span>
            <span className="block text-3xl font-bold font-display text-brand-accent-cyan mt-1">
              {analyticsData?.registrations?.filter(r => r.status === 'PENDING').length || 0}
            </span>
          </div>
          <div className="card p-5 bg-brand-bg-secondary border border-brand-border rounded-2xl">
            <span className="text-brand-text-muted text-xs font-semibold uppercase">Active Window</span>
            <span className={`block text-lg font-bold font-display mt-2 ${sessionWindow?.is_open ? 'text-brand-accent-emerald' : 'text-brand-accent-red'}`}>
              {sessionWindow ? `${sessionWindow.session} (${sessionWindow.is_open ? 'Open' : 'Closed'})` : 'No Active Session'}
            </span>
          </div>
        </div>

        <div className="flex gap-4 border-b border-brand-border/40 pb-2">
          <button 
            onClick={() => setActiveTab('windows')}
            className={`px-4 py-2 font-display text-sm font-semibold rounded-lg transition-all ${activeTab === 'windows' ? 'bg-brand-primary text-white' : 'text-brand-text-muted hover:text-white'}`}
          >
            Session Settings & Windows
          </button>
          <button 
            onClick={() => setActiveTab('approvals')}
            className={`px-4 py-2 font-display text-sm font-semibold rounded-lg transition-all ${activeTab === 'approvals' ? 'bg-brand-primary text-white' : 'text-brand-text-muted hover:text-white'}`}
          >
            Pending Student Approvals ({pendingApprovals.filter(r => r.status === 'PENDING').length})
          </button>
        </div>

        {activeTab === 'windows' && (
          <div className="card bg-brand-bg-secondary border border-brand-border rounded-2xl p-6 flex flex-col gap-6">
            <h3 className="text-lg font-bold font-display flex items-center gap-2">
              <Calendar className="w-5 h-5 text-brand-primary" />
              Registration Window Configuration
            </h3>

            <div className="p-4 bg-brand-bg-tertiary border border-brand-border/60 rounded-xl flex items-center justify-between">
              <div>
                <span className="block font-bold text-white text-base">Academic Session: Spring 2026</span>
                <span className="text-xs text-brand-text-muted mt-1 block">
                  Timeline: {sessionWindow?.start_date} to {sessionWindow?.end_date}
                </span>
              </div>
              <button 
                onClick={toggleWindow}
                className={`px-5 py-2.5 rounded-xl font-bold font-display text-sm transition-all ${sessionWindow?.is_open ? 'bg-brand-accent-red hover:bg-brand-accent-red-hover text-white' : 'bg-brand-accent-emerald hover:bg-brand-accent-emerald-hover text-black'}`}
              >
                {sessionWindow?.is_open ? 'Close Registration Window' : 'Open Registration Window'}
              </button>
            </div>
          </div>
        )}

        {activeTab === 'approvals' && (
          <div className="card bg-brand-bg-secondary border border-brand-border rounded-2xl p-6 flex flex-col gap-6">
            <h3 className="text-lg font-bold font-display flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-brand-accent-cyan" />
              Workflow Action Items
            </h3>

            <div className="flex flex-col gap-4">
              {pendingApprovals.length === 0 ? (
                <div className="p-6 text-center text-brand-text-muted">
                  No student registrations found.
                </div>
              ) : (
                pendingApprovals.map(reg => {
                  let nextStep = '';
                  let currentStepLabel = '';
                  if (!reg.advisor_approved) { nextStep = 'ADVISOR'; currentStepLabel = 'Advisor Sign-off'; }
                  else if (!reg.hod_approved) { nextStep = 'HOD'; currentStepLabel = 'Department HOD'; }
                  else if (!reg.dean_approved) { nextStep = 'DEAN'; currentStepLabel = 'Dean Academics'; }
                  else if (!reg.registrar_approved) { nextStep = 'REGISTRAR'; currentStepLabel = 'Office Registrar'; }

                  return (
                    <div key={reg.id} className="p-5 bg-brand-bg-tertiary border border-brand-border rounded-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-xs">
                      <div className="flex flex-col gap-1.5 max-w-md">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white text-sm">{reg.student_name}</span>
                          <span className="text-[10px] bg-brand-primary/10 border border-brand-primary/30 text-brand-primary px-2 py-0.5 rounded-full">{reg.student_id}</span>
                        </div>
                        <span className="text-brand-text-muted font-semibold">Department: {reg.department} | Session: {reg.session}</span>
                        <div className="flex flex-col gap-1 mt-1 font-mono text-[10px] text-brand-text-muted">
                          <div>Advisor: {reg.advisor_approved ? '✓ Approved' : '⏳ Pending'}</div>
                          <div>HOD: {reg.hod_approved ? '✓ Approved' : '⏳ Pending'}</div>
                          <div>Dean: {reg.dean_approved ? '✓ Approved' : '⏳ Pending'}</div>
                          <div>Registrar: {reg.registrar_approved ? '✓ Approved' : '⏳ Pending'}</div>
                          <div>Fee Status: <span className={reg.fee_status === 'CLEARED' ? 'text-brand-accent-emerald' : 'text-brand-accent-red'}>{reg.fee_status}</span></div>
                        </div>
                      </div>

                      {reg.status !== 'APPROVED' ? (
                        <div className="flex flex-col gap-2 w-full md:w-auto">
                          <input 
                            type="text" 
                            placeholder="Add approval comment..."
                            className="bg-brand-bg-secondary border border-brand-border rounded-lg p-2 text-xs text-white placeholder-brand-text-muted w-full md:w-64"
                            value={approvalComments[reg.student_id] || ''}
                            onChange={(e) => setApprovalComments({ ...approvalComments, [reg.student_id]: e.target.value })}
                          />
                          <div className="flex gap-2">
                            <button
                              disabled={approvalLoading[reg.student_id]}
                              onClick={() => handleApprovalAction(reg.student_id, nextStep, 'APPROVE')}
                              className="px-4 py-2 bg-brand-accent-emerald text-black font-semibold font-display text-[11px] rounded-lg hover:bg-brand-accent-emerald-hover flex items-center gap-1.5"
                            >
                              {approvalLoading[reg.student_id] && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                              Approve ({currentStepLabel})
                            </button>
                            <button
                              disabled={approvalLoading[reg.student_id]}
                              onClick={() => handleApprovalAction(reg.student_id, nextStep, 'REJECT')}
                              className="px-4 py-2 bg-brand-accent-red text-white font-semibold font-display text-[11px] rounded-lg hover:bg-brand-accent-red-hover flex items-center gap-1.5"
                            >
                              Reject
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-col items-end gap-1">
                          <span className="text-brand-accent-emerald font-bold text-sm flex items-center gap-1">
                            <CheckCircle className="w-4 h-4" /> Registration Completed
                          </span>
                          {reg.tx_hash && (
                            <span className="text-[10px] text-brand-text-muted font-mono max-w-[200px] truncate">
                              TX: {reg.tx_hash}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 md:gap-8 fade-in text-white">
      <div className="flex justify-between items-center pb-4 border-b border-brand-border/40">
        <div>
          <h1 className="text-3xl font-display font-bold tracking-tight flex items-center gap-3">
            <BookOpen className="w-8 h-8 text-brand-primary" />
            Semester Course Registration
          </h1>
          <p className="text-brand-text-muted text-sm mt-1">
            Student: {currentUser?.name || 'CampusX Scholar'} ({currentUser?.id || 'STU001'})
          </p>
        </div>
        {sessionWindow && (
          <div className="text-right">
            <span className={`inline-flex items-center gap-1 text-xs font-semibold px-3 py-1 rounded-full border ${sessionWindow.is_open ? 'bg-brand-accent-emerald/10 border-brand-accent-emerald/30 text-brand-accent-emerald' : 'bg-brand-accent-red/10 border-brand-accent-red/30 text-brand-accent-red'}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${sessionWindow.is_open ? 'bg-brand-accent-emerald' : 'bg-brand-accent-red'}`}></span>
              Window: {sessionWindow.session} {sessionWindow.is_open ? 'Open' : 'Closed'}
            </span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-4 gap-4 p-3.5 bg-brand-bg-secondary border border-brand-border rounded-xl text-center text-xs font-semibold">
        <div className={`p-2 rounded-lg transition-all ${currentStep >= 1 ? 'bg-brand-primary/20 text-brand-primary border border-brand-primary/30' : 'text-brand-text-muted'}`}>
          1. Clearances Check
        </div>
        <div className={`p-2 rounded-lg transition-all ${currentStep >= 2 ? 'bg-brand-primary/20 text-brand-primary border border-brand-primary/30' : 'text-brand-text-muted'}`}>
          2. Course Selector
        </div>
        <div className={`p-2 rounded-lg transition-all ${currentStep >= 3 ? 'bg-brand-primary/20 text-brand-primary border border-brand-primary/30' : 'text-brand-text-muted'}`}>
          3. Fee Calculation
        </div>
        <div className={`p-2 rounded-lg transition-all ${currentStep >= 4 ? 'bg-brand-primary/20 text-brand-primary border border-brand-primary/30' : 'text-brand-text-muted'}`}>
          4. Approval Board
        </div>
      </div>

      {sessionWindow && sessionWindow.is_open === 0 && (
        <div className="card p-6 bg-brand-accent-red/10 border border-brand-accent-red/30 rounded-2xl flex flex-col gap-2 items-center justify-center text-center">
          <AlertTriangle className="w-12 h-12 text-brand-accent-red animate-bounce" />
          <h3 className="text-lg font-bold font-display text-white mt-2">Registration Window is Closed</h3>
          <p className="text-xs text-brand-text-muted max-w-md">
            The registration window for Spring 2026 is currently inactive. Please check with your HOD or the Registrar Office.
          </p>
        </div>
      )}

      {sessionWindow && sessionWindow.is_open === 1 && (
        <div className="flex flex-col gap-6">
          {currentStep === 1 && (
            <div className="card bg-brand-bg-secondary border border-brand-border rounded-2xl p-6 flex flex-col gap-6">
              <h3 className="text-xl font-bold font-display flex items-center gap-2">
                <Shield className="w-6 h-6 text-brand-primary" />
                Step 1: Academic & Account Clearances
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-brand-bg-tertiary border border-brand-border rounded-xl flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="font-bold text-white text-sm">Identity & Profile Verification</span>
                    <span className="text-[10px] text-brand-text-muted mt-0.5">Biometrics & DID checked on CAMPUSX CHAIN</span>
                  </div>
                  <span className="p-1 bg-brand-accent-emerald/20 text-brand-accent-emerald rounded-full">
                    <Check className="w-4 h-4" />
                  </span>
                </div>

                <div className="p-4 bg-brand-bg-tertiary border border-brand-border rounded-xl flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="font-bold text-white text-sm">Prerequisite & CGPA Check</span>
                    <span className="text-[10px] text-brand-text-muted mt-0.5">Prior Term GPA: {clearanceChecks?.previousCgpa || '3.2'}</span>
                  </div>
                  {clearanceChecks?.hasBacklogs ? (
                    <span className="px-2.5 py-1 bg-brand-accent-red/20 text-brand-accent-red rounded-lg font-bold text-[10px] flex items-center gap-1">
                      <AlertTriangle className="w-3.5 h-3.5" /> {clearanceChecks.backlogCount} Backlog
                    </span>
                  ) : (
                    <span className="p-1 bg-brand-accent-emerald/20 text-brand-accent-emerald rounded-full">
                      <Check className="w-4 h-4" />
                    </span>
                  )}
                </div>

                <div className="p-4 bg-brand-bg-tertiary border border-brand-border rounded-xl flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="font-bold text-white text-sm">Library Dues Clearance</span>
                    <span className="text-[10px] text-brand-text-muted mt-0.5">Outstanding Fine: ${clearanceChecks?.libraryFine || '0.00'}</span>
                  </div>
                  {clearanceChecks?.libraryFine > 0 ? (
                    <span className="px-2 py-0.5 bg-brand-accent-red/10 border border-brand-accent-red/30 text-brand-accent-red rounded text-[10px] font-bold">
                      Blocked
                    </span>
                  ) : (
                    <span className="p-1 bg-brand-accent-emerald/20 text-brand-accent-emerald rounded-full">
                      <Check className="w-4 h-4" />
                    </span>
                  )}
                </div>

                <div className="p-4 bg-brand-bg-tertiary border border-brand-border rounded-xl flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="font-bold text-white text-sm">Hostel Management Clearance</span>
                    <span className="text-[10px] text-brand-text-muted mt-0.5">Outstanding Hostel Dues: ${clearanceChecks?.hostelDues || '0.00'}</span>
                  </div>
                  {clearanceChecks?.hostelDues > 0 ? (
                    <span className="px-2 py-0.5 bg-brand-accent-red/10 border border-brand-accent-red/30 text-brand-accent-red rounded text-[10px] font-bold">
                      Blocked
                    </span>
                  ) : (
                    <span className="p-1 bg-brand-accent-emerald/20 text-brand-accent-emerald rounded-full">
                      <Check className="w-4 h-4" />
                    </span>
                  )}
                </div>
              </div>

              {(clearanceChecks?.libraryFine > 0 || clearanceChecks?.hostelDues > 0) ? (
                <div className="p-4 bg-brand-accent-red/10 border border-brand-accent-red/30 rounded-xl text-xs text-brand-text-muted leading-relaxed">
                  <strong>Clearance Hold Active:</strong> You have outstanding dues on library or hostel accounts. Please reconcile dues at the respective admin desks before course registration.
                </div>
              ) : (
                <div className="flex justify-end mt-4">
                  <button 
                    onClick={() => setCurrentStep(2)}
                    className="px-5 py-2.5 bg-brand-primary hover:bg-brand-primary-hover font-bold font-display text-sm rounded-xl flex items-center gap-1.5 transition-all text-white"
                  >
                    Proceed to Course Selector
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          )}

          {currentStep === 2 && (
            <div className="card bg-brand-bg-secondary border border-brand-border rounded-2xl p-6 flex flex-col gap-6">
              <div className="flex justify-between items-center border-b border-brand-border/40 pb-3">
                <h3 className="text-xl font-bold font-display flex items-center gap-2">
                  <BookOpen className="w-6 h-6 text-brand-accent-cyan" />
                  Step 2: Course Selector & Timetable Conflict System
                </h3>
                <div className="text-right">
                  <span className="text-xs text-brand-text-muted block">Selected Credits</span>
                  <span className="text-lg font-bold font-display text-brand-accent-cyan">{calculateTotalCredits()} / 21 Credits</span>
                </div>
              </div>

              {timetableConflicts.length > 0 && (
                <div className="p-4 bg-brand-accent-red/10 border border-brand-accent-red/30 rounded-xl flex flex-col gap-1.5 text-xs text-white">
                  <span className="font-bold flex items-center gap-1.5 text-brand-accent-red">
                    <AlertTriangle className="w-4 h-4" /> Timetable Scheduler Conflict Detected!
                  </span>
                  {timetableConflicts.map((conf, idx) => (
                    <div key={idx} className="text-brand-text-muted font-mono">{conf}</div>
                  ))}
                </div>
              )}

              <div className="flex flex-col gap-4">
                <span className="text-xs font-bold text-white uppercase tracking-wider block">Available Course Offerings</span>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {offerings.map(course => {
                    const isSelected = selectedCourses.includes(course.course_code);
                    const credits = COURSE_CREDITS[course.course_code] || 3;
                    return (
                      <div 
                        key={course.id}
                        onClick={() => handleCourseSelect(course.course_code)}
                        className={`p-4 rounded-xl border transition-all cursor-pointer flex justify-between items-center ${isSelected ? 'bg-brand-primary/20 border-brand-primary' : 'bg-brand-bg-tertiary border-brand-border/60 hover:bg-brand-bg-tertiary/80'}`}
                      >
                        <div className="flex flex-col gap-1">
                          <span className="font-bold text-white text-sm">{course.title}</span>
                          <span className="text-[10px] text-brand-text-muted font-semibold">
                            Code: {course.course_code} | Credits: {credits} | Dept: {course.department}
                          </span>
                          <span className="text-[10px] text-brand-text-muted font-mono">
                            Section {course.section} | Capacity: {course.registered_count} / {course.max_capacity}
                          </span>
                        </div>
                        <div className={`w-5 h-5 rounded border flex items-center justify-center transition-all ${isSelected ? 'bg-brand-primary border-brand-primary text-white' : 'border-brand-border'}`}>
                          {isSelected && <Check className="w-3.5 h-3.5" />}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="flex justify-between items-center border-t border-brand-border/40 pt-4">
                <button 
                  onClick={() => setCurrentStep(1)}
                  className="px-4 py-2 border border-brand-border hover:bg-brand-bg-tertiary text-xs rounded-xl font-bold font-display text-white flex items-center gap-1"
                >
                  <ChevronLeft className="w-4 h-4" /> Back
                </button>

                <button 
                  onClick={proceedToCheckout}
                  className="px-5 py-2.5 bg-brand-primary hover:bg-brand-primary-hover font-bold font-display text-sm rounded-xl flex items-center gap-1.5 transition-all text-white"
                >
                  Proceed to Invoice
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {currentStep === 3 && invoice && (
            <div className="card bg-brand-bg-secondary border border-brand-border rounded-2xl p-6 flex flex-col gap-6">
              <h3 className="text-xl font-bold font-display flex items-center gap-2 border-b border-brand-border/40 pb-3">
                <CreditCard className="w-6 h-6 text-brand-primary" />
                Step 3: Itemized Fee Invoice & Clearance Reconcile
              </h3>

              <div className="flex flex-col gap-4 font-mono text-xs">
                <div className="flex justify-between py-2 border-b border-brand-border/20 text-brand-text-muted">
                  <span>Base Tuition Fee</span>
                  <span>${invoice.baseTuition.toFixed(2)}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-brand-border/20 text-brand-text-muted">
                  <span>Course Load Addon ({selectedCourses.length} courses)</span>
                  <span>${invoice.courseAddon.toFixed(2)}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-brand-border/20 text-brand-text-muted">
                  <span>Examinations Levy</span>
                  <span>${invoice.examFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-brand-border/20 text-brand-text-muted">
                  <span>Syllabus Laboratories Levy</span>
                  <span>${invoice.labFee.toFixed(2)}</span>
                </div>
                {invoice.discountAmt > 0 && (
                  <div className="flex justify-between py-2 border-b border-brand-border/20 text-brand-accent-emerald font-bold">
                    <span>Scholarship Deduction ({invoice.discountPercent}%)</span>
                    <span>-${invoice.discountAmt.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between py-3 border-t border-brand-border text-white font-bold text-sm">
                  <span>TOTAL PAYABLE</span>
                  <span>${invoice.totalPayable.toFixed(2)}</span>
                </div>
              </div>

              <div className="flex justify-between items-center border-t border-brand-border/40 pt-4">
                <button 
                  onClick={() => setCurrentStep(2)}
                  className="px-4 py-2 border border-brand-border hover:bg-brand-bg-tertiary text-xs rounded-xl font-bold font-display text-white flex items-center gap-1"
                >
                  <ChevronLeft className="w-4 h-4" /> Back
                </button>

                {registrationSlip?.fee_status === 'CLEARED' ? (
                  <button 
                    onClick={submitRegistration}
                    disabled={submitLoading}
                    className="px-5 py-2.5 bg-brand-accent-emerald hover:bg-brand-accent-emerald-hover text-black font-bold font-display text-sm rounded-xl flex items-center gap-1.5 transition-all"
                  >
                    {submitLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                    Submit Course Registration
                  </button>
                ) : (
                  <button 
                    onClick={executeFeePayment}
                    disabled={paymentLoading}
                    className="px-5 py-2.5 bg-brand-primary hover:bg-brand-primary-hover font-bold font-display text-sm rounded-xl flex items-center gap-1.5 transition-all text-white"
                  >
                    {paymentLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                    Pay Term Fees via Wallet
                  </button>
                )}
              </div>
            </div>
          )}

          {currentStep === 4 && (
            <div className="card bg-brand-bg-secondary border border-brand-border rounded-2xl p-6 flex flex-col gap-6">
              <h3 className="text-xl font-bold font-display flex items-center gap-2 border-b border-brand-border/40 pb-3">
                <FileCheck className="w-6 h-6 text-brand-accent-emerald" />
                Step 4: Academic Registration Board & Tracking
              </h3>

              <div className="p-5 bg-brand-bg-tertiary border border-brand-border rounded-xl flex flex-col gap-4 text-xs">
                <div className="flex justify-between items-center border-b border-brand-border/40 pb-2">
                  <span className="font-bold text-white text-base">Registration Request for Spring 2026</span>
                  <span className={`px-3 py-1 rounded-full font-bold uppercase tracking-wider text-[10px] ${registrationSlip?.status === 'APPROVED' ? 'bg-brand-accent-emerald/20 text-brand-accent-emerald' : 'bg-brand-primary/20 text-brand-primary'}`}>
                    Status: {registrationSlip?.status || 'PENDING'}
                  </span>
                </div>

                <div className="flex flex-col gap-3 font-mono text-[11px] text-brand-text-muted mt-2">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-white">
                      <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${registrationSlip?.advisor_approved ? 'bg-brand-accent-emerald text-black' : 'bg-brand-bg-secondary text-brand-text-muted border border-brand-border'}`}>
                        {registrationSlip?.advisor_approved ? '✓' : '1'}
                      </span>
                      Faculty Advisor Approval
                    </span>
                    <span className={registrationSlip?.advisor_approved ? 'text-brand-accent-emerald' : 'text-brand-text-muted'}>
                      {registrationSlip?.advisor_approved ? 'Approved' : 'Awaiting Review'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-white">
                      <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${registrationSlip?.hod_approved ? 'bg-brand-accent-emerald text-black' : 'bg-brand-bg-secondary text-brand-text-muted border border-brand-border'}`}>
                        {registrationSlip?.hod_approved ? '✓' : '2'}
                      </span>
                      Department HOD Approval
                    </span>
                    <span className={registrationSlip?.hod_approved ? 'text-brand-accent-emerald' : 'text-brand-text-muted'}>
                      {registrationSlip?.hod_approved ? 'Approved' : 'Awaiting Review'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-white">
                      <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${registrationSlip?.dean_approved ? 'bg-brand-accent-emerald text-black' : 'bg-brand-bg-secondary text-brand-text-muted border border-brand-border'}`}>
                        {registrationSlip?.dean_approved ? '✓' : '3'}
                      </span>
                      Dean of Academics Approval
                    </span>
                    <span className={registrationSlip?.dean_approved ? 'text-brand-accent-emerald' : 'text-brand-text-muted'}>
                      {registrationSlip?.dean_approved ? 'Approved' : 'Awaiting Review'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-white">
                      <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${registrationSlip?.registrar_approved ? 'bg-brand-accent-emerald text-black' : 'bg-brand-bg-secondary text-brand-text-muted border border-brand-border'}`}>
                        {registrationSlip?.registrar_approved ? '✓' : '4'}
                      </span>
                      Office Registrar Verification
                    </span>
                    <span className={registrationSlip?.registrar_approved ? 'text-brand-accent-emerald' : 'text-brand-text-muted'}>
                      {registrationSlip?.registrar_approved ? 'Approved' : 'Awaiting Review'}
                    </span>
                  </div>
                </div>
              </div>

              {registrationSlip?.tx_hash && (
                <div className="p-4 bg-brand-primary/10 border border-brand-primary/30 rounded-xl flex items-center gap-3">
                  <Shield className="w-8 h-8 text-brand-primary shrink-0" />
                  <div className="flex flex-col gap-0.5 text-xs text-white">
                    <span className="font-bold">Ledger Notary Checksum Anchored</span>
                    <span className="text-[10px] text-brand-text-muted font-mono truncate max-w-lg">
                      TX Block: {registrationSlip.tx_hash}
                    </span>
                  </div>
                </div>
              )}

              <div className="flex justify-between items-center border-t border-brand-border/40 pt-4">
                <button 
                  onClick={() => setCurrentStep(3)}
                  className="px-4 py-2 border border-brand-border hover:bg-brand-bg-tertiary text-xs rounded-xl font-bold font-display text-white flex items-center gap-1"
                >
                  <ChevronLeft className="w-4 h-4" /> Back to Fee Invoice
                </button>

                <button 
                  onClick={() => window.print()}
                  className="px-5 py-2.5 bg-brand-primary hover:bg-brand-primary-hover font-bold font-display text-sm rounded-xl flex items-center gap-1.5 transition-all text-white"
                >
                  <Download className="w-4 h-4" /> Download Registration Slip
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
