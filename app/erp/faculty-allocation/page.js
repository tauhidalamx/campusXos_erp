'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useDb } from '../../../context/db-context';

export default function FacultyAllocationPage() {
  const { faculty, courses, departments } = useDb();

  // Role Simulation state
  const [currentUser, setCurrentUser] = useState(null);
  const [simulatedRole, setSimulatedRole] = useState('admin');

  // Database/Local States
  const [offerings, setOfferings] = useState([]);
  const [sections, setSections] = useState([]);
  const [allocations, setAllocations] = useState([]);
  const [profiles, setProfiles] = useState([]);
  const [analytics, setAnalytics] = useState(null);

  // Form inputs
  const [activeTab, setActiveTab] = useState('offerings'); // offerings, sections, allocations, workflow, analytics
  const [selectedDept, setSelectedDept] = useState('ALL');
  const [selectedSession, setSelectedSession] = useState('Spring 2026');

  // Create Offering form
  const [offCode, setOffCode] = useState('');
  const [offName, setOffName] = useState('');
  const [offCredits, setOffCredits] = useState(3);
  const [offTheory, setOffTheory] = useState(3);
  const [offLab, setOffLab] = useState(0);
  const [offTutorial, setOffTutorial] = useState(0);
  const [offDept, setOffDept] = useState('CS');
  const [offSemester, setOffSemester] = useState('Semester 1');
  const [offProgram, setOffProgram] = useState('B.Tech CSE');
  const [offCapacity, setOffCapacity] = useState(60);
  const [offClassroom, setOffClassroom] = useState('LH-101');
  const [offLabReq, setOffLabReq] = useState('None');

  // Create Section form
  const [secName, setSecName] = useState('');
  const [secBatch, setSecBatch] = useState('2024');
  const [secStudents, setSecStudents] = useState(40);
  const [secMentor, setSecMentor] = useState('FAC001');
  const [secCourse, setSecCourse] = useState('');
  const [secTheoryFac, setSecTheoryFac] = useState('FAC001');
  const [secLabFac, setSecLabFac] = useState('FAC007');
  const [secClassroom, setSecClassroom] = useState('LH-101');
  const [secLabClassroom, setSecLabClassroom] = useState('Lab-1');

  // Create Allocation form
  const [allocCourse, setAllocCourse] = useState('');
  const [allocFaculty, setAllocFaculty] = useState('FAC001');
  const [allocSection, setAllocSection] = useState('A');
  const [allocHours, setAllocHours] = useState(3);
  const [allocRole, setAllocRole] = useState('LECTURER');

  // AI recommendations
  const [aiRecs, setAiRecs] = useState([]);
  const [loadingAi, setLoadingAi] = useState(false);
  const [recCourse, setRecCourse] = useState('');

  // Workflow feedback
  const [workflowComment, setWorkflowComment] = useState('');
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishMessage, setPublishMessage] = useState('');

  // Chart ref
  const chartRef = useRef(null);
  const canvasRef = useRef(null);

  // Initialize simulated user
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const session = sessionStorage.getItem('campusx_erp_session');
      if (session) {
        const parsed = JSON.parse(session);
        setCurrentUser(parsed);
        setSimulatedRole(parsed.role);
      } else {
        setCurrentUser({ name: 'SSO Administrator', role: 'admin', email: 'admin@campusx.demo' });
      }
    }
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [resOff, resSec, resAlloc, resProf, resAnalytics] = await Promise.all([
        fetch('/api/faculty-allocation/offerings').then(r => r.json()),
        fetch('/api/faculty-allocation/sections').then(r => r.json()),
        fetch('/api/faculty-allocation/allocations').then(r => r.json()),
        fetch('/api/faculty-allocation/faculty-profiles').then(r => r.json()),
        fetch('/api/faculty-allocation/analytics').then(r => r.json())
      ]);

      if (resOff.success) setOfferings(resOff.offerings);
      if (resSec.success) setSections(resSec.sections);
      if (resAlloc.success) setAllocations(resAlloc.allocations);
      if (resProf.success) setProfiles(resProf.profiles);
      if (resAnalytics.success) setAnalytics(resAnalytics);
    } catch (err) {
      console.error('Failed to fetch allocation system data:', err);
    }
  };

  // Sync simulated role change
  const handleRoleChange = (role) => {
    setSimulatedRole(role);
    const mockUser = {
      role,
      name: role === 'admin' ? 'University Admin' : 
            role === 'hod' ? 'Prof. Sarah Jenkins (HOD)' : 
            role === 'dean' ? 'Dean of Faculty' : 
            role === 'registrar' ? 'Registrar Officer' : 
            role === 'faculty' ? 'Dr. Evelyn Sterling' : 
            role === 'student' ? 'Aria Nakamura' : 'Department Admin',
      email: `${role}@campusx.demo`
    };
    setCurrentUser(mockUser);
    if (role === 'student') {
      setActiveTab('student_view');
    } else if (role === 'faculty') {
      setActiveTab('faculty_inbox');
    } else {
      setActiveTab('offerings');
    }
  };

  // Load AI suggestions
  const loadAiSuggestions = async (courseCode) => {
    if (!courseCode) return;
    setLoadingAi(true);
    setRecCourse(courseCode);
    try {
      const res = await fetch(`/api/faculty-allocation/ai-recommendations?courseCode=${courseCode}`);
      const data = await res.json();
      if (data.success) {
        setAiRecs(data.recommendations);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingAi(false);
    }
  };

  // Submit Offering
  const handleCreateOffering = async (e) => {
    e.preventDefault();
    if (!offCode || !offName) {
      alert('Please fill out course code and course name.');
      return;
    }
    try {
      const res = await fetch('/api/faculty-allocation/offerings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          course_code: offCode.toUpperCase(),
          course_name: offName,
          credits: offCredits,
          theory_hours: offTheory,
          lab_hours: offLab,
          tutorial_hours: offTutorial,
          department: offDept,
          semester: offSemester,
          program: offProgram,
          academic_session: selectedSession,
          max_students: offCapacity,
          classroom_req: offClassroom,
          lab_req: offLabReq
        })
      });
      const data = await res.json();
      if (data.success) {
        alert('Course offering created successfully!');
        setOffCode('');
        setOffName('');
        fetchData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Submit Section
  const handleCreateSection = async (e) => {
    e.preventDefault();
    if (!secName || !secCourse) {
      alert('Section name and Course code are required.');
      return;
    }
    try {
      const res = await fetch('/api/faculty-allocation/sections', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          section_name: secName.toUpperCase(),
          batch: secBatch,
          student_count: secStudents,
          mentor_id: secMentor,
          course_code: secCourse,
          theory_faculty_id: secTheoryFac,
          lab_faculty_id: secLabFac,
          classroom: secClassroom,
          lab_classroom: secLabClassroom,
          academic_session: selectedSession
        })
      });
      const data = await res.json();
      if (data.success) {
        alert('Section created and allocated successfully!');
        setSecName('');
        fetchData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Submit Allocation
  const handleCreateAllocation = async (e) => {
    e.preventDefault();
    if (!allocCourse) {
      alert('Please select a course code.');
      return;
    }
    try {
      const res = await fetch('/api/faculty-allocation/allocations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          course_code: allocCourse,
          faculty_id: allocFaculty,
          section_name: allocSection,
          assigned_hours: allocHours,
          role: allocRole,
          status: 'PENDING'
        })
      });
      const data = await res.json();
      if (data.success) {
        if (data.overloaded) {
          alert(`Warning: Allocation created, but this pushes Faculty ${allocFaculty} over their weekly teaching limit! (Assigned Load: ${data.currentLoad} hrs/wk, Limit: ${data.limit} hrs/wk)`);
        } else {
          alert('Faculty teaching allocation submitted to HOD workflow approval pipeline!');
        }
        fetchData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Approve Step
  const handleApproveStep = async (allocId, decision) => {
    try {
      const res = await fetch('/api/faculty-allocation/approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: allocId,
          role: simulatedRole,
          action: decision,
          comments: workflowComment
        })
      });
      const data = await res.json();
      if (data.success) {
        alert(`Allocation successfully ${decision === 'APPROVE' ? 'Approved' : 'Declined'}`);
        setWorkflowComment('');
        fetchData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Publish Allocations
  const handlePublish = async () => {
    setIsPublishing(true);
    setPublishMessage('Running timetable conflict resolution and compile...');
    try {
      const res = await fetch('/api/faculty-allocation/publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ academic_session: selectedSession })
      });
      const data = await res.json();
      if (data.success) {
        setPublishMessage(`Successfully certified and published allocations! Registered notary transaction hash proofs on CAMPUSX CHAIN.`);
        setTimeout(() => setPublishMessage(''), 8000);
        fetchData();
      } else {
        setPublishMessage('Failed to publish allocations.');
      }
    } catch (err) {
      console.error(err);
      setPublishMessage('Error publishing allocations.');
    } finally {
      setIsPublishing(false);
    }
  };

  // Accept/Decline assignment for faculty
  const handleFacultyAction = async (allocId, action) => {
    try {
      const res = await fetch('/api/faculty-allocation/approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: allocId,
          role: 'department_admin', // updates legacy values
          action: action === 'ACCEPT' ? 'APPROVE' : 'DECLINE'
        })
      });
      const data = await res.json();
      if (data.success) {
        alert(`You have ${action.toLowerCase()}ed the course allocation.`);
        fetchData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Render analytics chart
  useEffect(() => {
    if (activeTab !== 'analytics' || !analytics || !canvasRef.current || typeof window === 'undefined' || !window.Chart) return;

    const Chart = window.Chart;
    if (chartRef.current) chartRef.current.destroy();

    const depts = analytics.departmentOfferings.map(d => d.department);
    const counts = analytics.departmentOfferings.map(d => d.count);

    chartRef.current = new Chart(canvasRef.current, {
      type: 'bar',
      data: {
        labels: depts,
        datasets: [{
          label: 'Active Course Offerings',
          data: counts,
          backgroundColor: '#0ea5e9',
          borderRadius: 8,
          borderWidth: 0
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false }
        },
        scales: {
          y: {
            grid: { color: 'rgba(255, 255, 255, 0.05)' },
            ticks: { color: '#94a3b8' }
          },
          x: {
            grid: { display: false },
            ticks: { color: '#94a3b8' }
          }
        }
      }
    });

    return () => {
      if (chartRef.current) chartRef.current.destroy();
    };
  }, [activeTab, analytics]);

  // Calculations for UI metrics
  const totalFacultyCount = faculty.length;
  const activeOfferingsCount = offerings.length;
  const totalSectionsCount = sections.length;
  const pendingAllocationsCount = allocations.filter(a => a.status === 'PENDING').length;

  // Timetable conflicts mapping
  const roomBookings = {};
  const facultySchedules = {};
  let conflictAlertsCount = 0;

  sections.forEach(sec => {
    // room clash check
    if (sec.classroom && sec.classroom !== 'None') {
      roomBookings[sec.classroom] = (roomBookings[sec.classroom] || 0) + 1;
      if (roomBookings[sec.classroom] > 1) conflictAlertsCount++;
    }
    // faculty double booking checking
    if (sec.theory_faculty_id) {
      facultySchedules[sec.theory_faculty_id] = (facultySchedules[sec.theory_faculty_id] || 0) + 1;
      if (facultySchedules[sec.theory_faculty_id] > 2) conflictAlertsCount++;
    }
  });

  return (
    <div className="flex flex-col gap-6 md:gap-8 pb-12">
      {/* HEADER SECTION */}
      <div className="page-header animate-fade-in flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-brand-text-main">CampusX Course & Faculty Allocator</h1>
          <p className="text-brand-text-muted mt-1 text-sm">
            Interactive university matrix for class sections, multi-faculty academic workloads, and blockchain notarized timetables.
          </p>
        </div>
        <div className="flex items-center gap-2 bg-brand-bg-secondary border border-brand-border p-1.5 rounded-xl text-xs">
          <span className="font-semibold text-brand-text-muted px-2">Simulate Role:</span>
          <select 
            className="bg-brand-bg-tertiary border border-brand-border text-brand-text-main rounded p-1 outline-none cursor-pointer"
            value={simulatedRole}
            onChange={(e) => handleRoleChange(e.target.value)}
          >
            <option value="admin">University Admin</option>
            <option value="department_admin">Dept Admin</option>
            <option value="hod">HOD</option>
            <option value="dean">Dean</option>
            <option value="registrar">Registrar</option>
            <option value="faculty">Faculty Member</option>
            <option value="student">Student</option>
          </select>
        </div>
      </div>

      {/* METRIC CARD WIDGETS */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 md:gap-6 animate-fade-in">
        <div className="card p-4 md:p-5 bg-brand-bg-secondary border border-brand-border rounded-2xl flex flex-col justify-between">
          <span className="text-xs text-brand-text-muted font-medium uppercase tracking-wider">Active Faculty</span>
          <div className="text-2xl font-bold font-mono text-white mt-2">{totalFacultyCount} Staff</div>
        </div>
        <div className="card p-4 md:p-5 bg-brand-bg-secondary border border-brand-border rounded-2xl flex flex-col justify-between">
          <span className="text-xs text-brand-text-muted font-medium uppercase tracking-wider">Active Offerings</span>
          <div className="text-2xl font-bold font-mono text-brand-primary mt-2">{activeOfferingsCount} Courses</div>
        </div>
        <div className="card p-4 md:p-5 bg-brand-bg-secondary border border-brand-border rounded-2xl flex flex-col justify-between">
          <span className="text-xs text-brand-text-muted font-medium uppercase tracking-wider">Active Sections</span>
          <div className="text-2xl font-bold font-mono text-brand-accent-cyan mt-2">{totalSectionsCount} Sections</div>
        </div>
        <div className="card p-4 md:p-5 bg-brand-bg-secondary border border-brand-border rounded-2xl flex flex-col justify-between">
          <span className="text-xs text-brand-text-muted font-medium uppercase tracking-wider">Workflow Pending</span>
          <div className="text-2xl font-bold font-mono text-brand-accent-amber mt-2">{pendingAllocationsCount} Alloc</div>
        </div>
        <div className="card p-4 md:p-5 bg-brand-bg-secondary border border-brand-border rounded-2xl flex flex-col justify-between">
          <span className="text-xs text-brand-text-muted font-medium uppercase tracking-wider">Schedule Conflicts</span>
          <div className={`text-2xl font-bold font-mono mt-2 ${conflictAlertsCount > 0 ? 'text-brand-accent-ruby animate-pulse' : 'text-brand-accent-emerald'}`}>
            {conflictAlertsCount} Clashes
          </div>
        </div>
      </div>

      {/* CORE WORKSPACE PANELS */}
      {simulatedRole === 'student' ? (
        /* STUDENT READ-ONLY VIEWPORT */
        <div className="card p-6 md:p-8 bg-brand-bg-secondary border border-brand-border rounded-3xl animate-scale-up">
          <h2 className="text-xl font-display font-bold text-brand-text-main mb-2">My Semester Allocations</h2>
          <p className="text-brand-text-muted text-xs mb-6">Read-only transparency view from CAMPUSX CHAIN academic block registry.</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {sections.length === 0 ? (
              <div className="col-span-full p-8 text-center text-brand-text-muted border border-brand-border rounded-xl">
                No section allocations found for your student profile.
              </div>
            ) : (
              sections.map(sec => {
                const facObj = faculty.find(f => f.id === sec.theory_faculty_id);
                const labFacObj = faculty.find(f => f.id === sec.lab_faculty_id);
                return (
                  <div key={sec.id} className="card p-5 bg-brand-bg-tertiary border border-brand-border rounded-2xl flex flex-col gap-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="badge badge-primary text-[0.65rem] px-2 py-0.5 font-bold mb-1.5 uppercase font-mono">{sec.course_code}</span>
                        <h4 className="text-base font-semibold text-white font-display font-display">Section {sec.section_name}</h4>
                      </div>
                      <span className="text-[0.7rem] text-brand-text-muted font-semibold bg-brand-bg-secondary px-2 py-1 rounded">Batch {sec.batch}</span>
                    </div>

                    <div className="text-xs text-brand-text-muted flex flex-col gap-2 pt-2 border-t border-brand-border/40">
                      <div>
                        <strong className="text-brand-text-main">Lecturer:</strong> {facObj ? facObj.name : 'Unassigned'}
                        <div className="text-[10px] text-brand-text-subtle font-mono">{facObj?.email}</div>
                      </div>
                      {labFacObj && (
                        <div>
                          <strong className="text-brand-text-main">Lab Instructor:</strong> {labFacObj.name}
                        </div>
                      )}
                      <div>
                        <strong className="text-brand-text-main">Classroom:</strong> {sec.classroom || 'LH-101'}
                      </div>
                      {sec.lab_classroom && sec.lab_classroom !== 'None' && (
                        <div>
                          <strong className="text-brand-text-main">Lab Venue:</strong> {sec.lab_classroom}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      ) : simulatedRole === 'faculty' ? (
        /* FACULTY INBOX VIEWPORT */
        <div className="card p-6 md:p-8 bg-brand-bg-secondary border border-brand-border rounded-3xl animate-scale-up">
          <h2 className="text-xl font-display font-bold text-brand-text-main mb-2">My Teaching Assignments Inbox</h2>
          <p className="text-brand-text-muted text-xs mb-6">Review pending section load offers and submit digital acceptances.</p>

          <div className="flex flex-col gap-4">
            {allocations.filter(a => a.faculty_id === 'FAC001').length === 0 ? (
              <div className="p-8 text-center text-brand-text-muted border border-brand-border rounded-xl">
                No teaching assignments pending for your profile.
              </div>
            ) : (
              allocations.filter(a => a.faculty_id === 'FAC001').map(alloc => (
                <div key={alloc.id} className="p-5 bg-brand-bg-tertiary border border-brand-border rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <span className="badge bg-brand-primary/20 text-brand-primary font-mono text-[0.65rem] px-2 py-0.5 rounded mr-2 uppercase">
                      {alloc.course_code}
                    </span>
                    <strong className="text-white text-sm">Section {alloc.section_name}</strong>
                    <div className="text-xs text-brand-text-muted mt-1">
                      Assigned Load: <span className="text-white font-mono">{alloc.assigned_hours} hrs/wk</span> | Role: <span className="text-white uppercase font-mono">{alloc.role}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {alloc.status === 'PENDING' ? (
                      <>
                        <button className="btn btn-primary btn-sm cursor-pointer" onClick={() => handleFacultyAction(alloc.id, 'ACCEPT')}>Accept</button>
                        <button className="btn btn-secondary btn-sm cursor-pointer text-brand-accent-ruby border-brand-accent-ruby/30" onClick={() => handleFacultyAction(alloc.id, 'DECLINE')}>Decline</button>
                      </>
                    ) : (
                      <span className={`badge text-[0.65rem] font-bold px-2.5 py-1 rounded font-mono ${
                        alloc.status === 'PUBLISHED' || alloc.status === 'APPROVED' ? 'bg-brand-accent-emerald/20 text-brand-accent-emerald' : 'bg-brand-accent-ruby/20 text-brand-accent-ruby'
                      }`}>
                        {alloc.status}
                      </span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      ) : (
        /* ADMIISTRATIVE ALLOCATION SYSTEM */
        <div className="grid grid-cols-1 lg:grid-cols-[250px_1fr] gap-6 md:gap-8 items-start animate-fade-in">
          {/* SIDEBAR TABS */}
          <div className="flex lg:flex-col gap-2 overflow-x-auto pb-2 lg:pb-0 border-b lg:border-b-0 lg:border-r border-brand-border/40 pr-0 lg:pr-6">
            <button 
              className={`text-left text-xs font-semibold px-4 py-3 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'offerings' ? 'bg-brand-primary text-white shadow-lg' : 'text-brand-text-muted hover:bg-white/[0.03]'
              }`}
              onClick={() => setActiveTab('offerings')}
            >
              Course Offerings
            </button>
            <button 
              className={`text-left text-xs font-semibold px-4 py-3 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'sections' ? 'bg-brand-primary text-white shadow-lg' : 'text-brand-text-muted hover:bg-white/[0.03]'
              }`}
              onClick={() => setActiveTab('sections')}
            >
              Sections Allocator
            </button>
            <button 
              className={`text-left text-xs font-semibold px-4 py-3 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'allocations' ? 'bg-brand-primary text-white shadow-lg' : 'text-brand-text-muted hover:bg-white/[0.03]'
              }`}
              onClick={() => setActiveTab('allocations')}
            >
              Faculty Workloads
            </button>
            <button 
              className={`text-left text-xs font-semibold px-4 py-3 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'workflow' ? 'bg-brand-primary text-white shadow-lg' : 'text-brand-text-muted hover:bg-white/[0.03]'
              }`}
              onClick={() => setActiveTab('workflow')}
            >
              Signoff Pipeline
            </button>
            <button 
              className={`text-left text-xs font-semibold px-4 py-3 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'analytics' ? 'bg-brand-primary text-white shadow-lg' : 'text-brand-text-muted hover:bg-white/[0.03]'
              }`}
              onClick={() => setActiveTab('analytics')}
            >
              Analytics Matrix
            </button>
          </div>

          {/* TAB CONTENTS CONTAINER */}
          <div className="card p-6 md:p-8 bg-brand-bg-secondary border border-brand-border rounded-3xl min-h-[450px]">
            
            {/* TAB 1: COURSE OFFERINGS */}
            {activeTab === 'offerings' && (
              <div className="flex flex-col gap-6 animate-fade-in">
                <div className="flex justify-between items-center border-b border-brand-border/40 pb-4">
                  <h3 className="text-lg font-display font-bold text-white">Course Offerings Setup</h3>
                  <span className="text-xs text-brand-text-muted">Spring 2026 Session</span>
                </div>

                {/* CREATE OFFERING FORM */}
                {simulatedRole === 'admin' || simulatedRole === 'department_admin' ? (
                  <form onSubmit={handleCreateOffering} className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-brand-bg-tertiary/40 border border-brand-border/40 p-5 rounded-2xl">
                    <h4 className="col-span-full text-xs font-bold text-brand-primary uppercase tracking-wider mb-2 font-display">Create New Course Offering</h4>
                    <div className="form-group flex flex-col gap-1 text-xs">
                      <label className="form-label text-brand-text-muted font-semibold">Course Code</label>
                      <input 
                        type="text" 
                        placeholder="e.g. CS415" 
                        className="bg-brand-bg-tertiary border border-brand-border text-brand-text-main p-2 rounded-xl outline-none"
                        value={offCode}
                        onChange={(e) => setOffCode(e.target.value)}
                      />
                    </div>
                    <div className="form-group flex flex-col gap-1 text-xs">
                      <label className="form-label text-brand-text-muted font-semibold">Course Name</label>
                      <input 
                        type="text" 
                        placeholder="e.g. Cloud Computing" 
                        className="bg-brand-bg-tertiary border border-brand-border text-brand-text-main p-2 rounded-xl outline-none"
                        value={offName}
                        onChange={(e) => setOffName(e.target.value)}
                      />
                    </div>
                    <div className="form-group flex flex-col gap-1 text-xs">
                      <label className="form-label text-brand-text-muted font-semibold">Department</label>
                      <select 
                        className="bg-brand-bg-tertiary border border-brand-border text-brand-text-main p-2 rounded-xl outline-none cursor-pointer"
                        value={offDept}
                        onChange={(e) => setOffDept(e.target.value)}
                      >
                        {departments.map(d => (
                          <option key={d.code} value={d.code}>{d.name}</option>
                        ))}
                      </select>
                    </div>
                    <div className="form-group flex flex-col gap-1 text-xs">
                      <label className="form-label text-brand-text-muted font-semibold">Credits</label>
                      <input 
                        type="number" 
                        className="bg-brand-bg-tertiary border border-brand-border text-brand-text-main p-2 rounded-xl outline-none"
                        value={offCredits}
                        min="1"
                        max="5"
                        onChange={(e) => setOffCredits(parseInt(e.target.value) || 3)}
                      />
                    </div>
                    <div className="form-group flex flex-col gap-1 text-xs">
                      <label className="form-label text-brand-text-muted font-semibold">Theory Hours</label>
                      <input 
                        type="number" 
                        className="bg-brand-bg-tertiary border border-brand-border text-brand-text-main p-2 rounded-xl outline-none"
                        value={offTheory}
                        onChange={(e) => setOffTheory(parseInt(e.target.value) || 0)}
                      />
                    </div>
                    <div className="form-group flex flex-col gap-1 text-xs">
                      <label className="form-label text-brand-text-muted font-semibold">Lab Hours</label>
                      <input 
                        type="number" 
                        className="bg-brand-bg-tertiary border border-brand-border text-brand-text-main p-2 rounded-xl outline-none"
                        value={offLab}
                        onChange={(e) => setOffLab(parseInt(e.target.value) || 0)}
                      />
                    </div>
                    <div className="form-group flex flex-col gap-1 text-xs">
                      <label className="form-label text-brand-text-muted font-semibold">Max Capacity</label>
                      <input 
                        type="number" 
                        className="bg-brand-bg-tertiary border border-brand-border text-brand-text-main p-2 rounded-xl outline-none"
                        value={offCapacity}
                        onChange={(e) => setOffCapacity(parseInt(e.target.value) || 0)}
                      />
                    </div>
                    <div className="form-group flex flex-col gap-1 text-xs">
                      <label className="form-label text-brand-text-muted font-semibold">Classroom Requirement</label>
                      <input 
                        type="text" 
                        placeholder="e.g. LH-101" 
                        className="bg-brand-bg-tertiary border border-brand-border text-brand-text-main p-2 rounded-xl outline-none"
                        value={offClassroom}
                        onChange={(e) => setOffClassroom(e.target.value)}
                      />
                    </div>
                    <div className="form-group flex flex-col gap-1 text-xs">
                      <label className="form-label text-brand-text-muted font-semibold">Lab Requirement</label>
                      <input 
                        type="text" 
                        placeholder="e.g. Lab-1" 
                        className="bg-brand-bg-tertiary border border-brand-border text-brand-text-main p-2 rounded-xl outline-none"
                        value={offLabReq}
                        onChange={(e) => setOffLabReq(e.target.value)}
                      />
                    </div>
                    <div className="col-span-full flex justify-end mt-2">
                      <button type="submit" className="btn btn-primary cursor-pointer">Submit Offering</button>
                    </div>
                  </form>
                ) : null}

                {/* OFFERINGS TABLE */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-brand-border text-brand-text-muted uppercase text-[10px] tracking-wider font-semibold font-display">
                        <th className="pb-3 pl-2">Course Code</th>
                        <th className="pb-3">Course Title</th>
                        <th className="pb-3">Credits</th>
                        <th className="pb-3">Theory/Lab/Tut</th>
                        <th className="pb-3">Department</th>
                        <th className="pb-3">Capacity</th>
                        <th className="pb-3 pr-2 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {offerings.map(off => (
                        <tr key={off.id} className="border-b border-brand-border/40 hover:bg-white/[0.01]">
                          <td className="py-3.5 pl-2 font-mono font-bold text-white">{off.course_code}</td>
                          <td className="py-3.5 text-white font-medium">{off.course_name}</td>
                          <td className="py-3.5 text-brand-text-muted font-mono">{off.credits} Credits</td>
                          <td className="py-3.5 text-brand-text-muted font-mono">{off.theory_hours}L / {off.lab_hours}P / {off.tutorial_hours}T</td>
                          <td className="py-3.5 text-brand-text-muted font-bold font-mono">{off.department}</td>
                          <td className="py-3.5 text-brand-text-muted font-mono">{off.max_students} Seats</td>
                          <td className="py-3.5 pr-2 text-right">
                            <button 
                              className="btn btn-secondary btn-sm cursor-pointer animate-pulse"
                              onClick={() => loadAiSuggestions(off.course_code)}
                            >
                              AI Advisor
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* AI ADVISOR MODAL DRAWER */}
                {recCourse && (
                  <div className="card p-5 bg-brand-bg-tertiary border border-brand-border/60 rounded-2xl flex flex-col gap-4 mt-2">
                    <div className="flex justify-between items-center pb-2 border-b border-brand-border/40">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-brand-accent-amber rounded-full animate-ping"></span>
                        <strong className="text-xs uppercase tracking-wider text-white">AI Allocation Advisor for {recCourse}</strong>
                      </div>
                      <button className="text-brand-text-muted hover:text-white cursor-pointer border-none bg-transparent" onClick={() => setRecCourse('')}>&times;</button>
                    </div>

                    {loadingAi ? (
                      <div className="flex items-center justify-center p-6 text-xs text-brand-text-muted">
                        Calculating neural expertise matrix...
                      </div>
                    ) : (
                      <div className="flex flex-col gap-3">
                        {aiRecs.map(rec => (
                          <div key={rec.facultyId} className="p-3 bg-brand-bg-secondary border border-brand-border rounded-xl flex items-center justify-between gap-4">
                            <div>
                              <div className="font-semibold text-white text-xs">{rec.name} ({rec.facultyId})</div>
                              <div className="text-[10px] text-brand-text-muted mt-0.5">Specialization: {rec.specialization || 'N/A'} | Experience: {rec.teaching_experience || 8} yrs</div>
                              <div className="text-[10px] text-brand-primary mt-1">Match Reason: {rec.reason}</div>
                            </div>
                            <div className="text-right flex flex-col items-end gap-2">
                              <span className="badge bg-brand-accent-emerald/20 text-brand-accent-emerald text-[0.65rem] font-bold font-mono px-2 py-0.5 rounded">
                                AI Confidence: {Math.round(rec.confidenceScore * 100)}%
                              </span>
                              <button 
                                className="btn btn-primary btn-sm text-[10px] py-1 px-2 cursor-pointer"
                                onClick={() => {
                                  setAllocCourse(recCourse);
                                  setAllocFaculty(rec.facultyId);
                                  setAllocHours(3);
                                  setActiveTab('allocations');
                                }}
                              >
                                Pre-Fill Allocation
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* TAB 2: SECTIONS ALLOCATOR */}
            {activeTab === 'sections' && (
              <div className="flex flex-col gap-6 animate-fade-in">
                <div className="flex justify-between items-center border-b border-brand-border/40 pb-4">
                  <h3 className="text-lg font-display font-bold text-white">Sections & Classroom Schedulers</h3>
                  <span className="text-xs text-brand-text-muted">Spring 2026 Batch Division</span>
                </div>

                {/* CREATE SECTION FORM */}
                {simulatedRole === 'admin' || simulatedRole === 'hod' ? (
                  <form onSubmit={handleCreateSection} className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-brand-bg-tertiary/40 border border-brand-border/40 p-5 rounded-2xl">
                    <h4 className="col-span-full text-xs font-bold text-brand-primary uppercase tracking-wider mb-2 font-display">Create and Link Section</h4>
                    <div className="form-group flex flex-col gap-1 text-xs">
                      <label className="form-label text-brand-text-muted font-semibold">Section Name</label>
                      <input 
                        type="text" 
                        placeholder="e.g. A" 
                        className="bg-brand-bg-tertiary border border-brand-border text-brand-text-main p-2 rounded-xl outline-none"
                        value={secName}
                        onChange={(e) => setSecName(e.target.value)}
                      />
                    </div>
                    <div className="form-group flex flex-col gap-1 text-xs">
                      <label className="form-label text-brand-text-muted font-semibold">Batch Year</label>
                      <input 
                        type="text" 
                        placeholder="e.g. 2024" 
                        className="bg-brand-bg-tertiary border border-brand-border text-brand-text-main p-2 rounded-xl outline-none"
                        value={secBatch}
                        onChange={(e) => setSecBatch(e.target.value)}
                      />
                    </div>
                    <div className="form-group flex flex-col gap-1 text-xs">
                      <label className="form-label text-brand-text-muted font-semibold">Student Count</label>
                      <input 
                        type="number" 
                        className="bg-brand-bg-tertiary border border-brand-border text-brand-text-main p-2 rounded-xl outline-none"
                        value={secStudents}
                        onChange={(e) => setSecStudents(parseInt(e.target.value) || 0)}
                      />
                    </div>
                    <div className="form-group flex flex-col gap-1 text-xs">
                      <label className="form-label text-brand-text-muted font-semibold">Associated Course</label>
                      <select 
                        className="bg-brand-bg-tertiary border border-brand-border text-brand-text-main p-2 rounded-xl outline-none cursor-pointer"
                        value={secCourse}
                        onChange={(e) => setSecCourse(e.target.value)}
                      >
                        <option value="">Select offering...</option>
                        {offerings.map(o => (
                          <option key={o.course_code} value={o.course_code}>{o.course_code} - {o.course_name}</option>
                        ))}
                      </select>
                    </div>
                    <div className="form-group flex flex-col gap-1 text-xs">
                      <label className="form-label text-brand-text-muted font-semibold">Theory Faculty</label>
                      <select 
                        className="bg-brand-bg-tertiary border border-brand-border text-brand-text-main p-2 rounded-xl outline-none cursor-pointer"
                        value={secTheoryFac}
                        onChange={(e) => setSecTheoryFac(e.target.value)}
                      >
                        {faculty.map(f => (
                          <option key={f.id} value={f.id}>{f.name} ({f.dept})</option>
                        ))}
                      </select>
                    </div>
                    <div className="form-group flex flex-col gap-1 text-xs">
                      <label className="form-label text-brand-text-muted font-semibold">Lab Faculty</label>
                      <select 
                        className="bg-brand-bg-tertiary border border-brand-border text-brand-text-main p-2 rounded-xl outline-none cursor-pointer"
                        value={secLabFac}
                        onChange={(e) => setSecLabFac(e.target.value)}
                      >
                        {faculty.map(f => (
                          <option key={f.id} value={f.id}>{f.name} ({f.dept})</option>
                        ))}
                      </select>
                    </div>
                    <div className="form-group flex flex-col gap-1 text-xs">
                      <label className="form-label text-brand-text-muted font-semibold">Classroom</label>
                      <input 
                        type="text" 
                        placeholder="e.g. LH-101" 
                        className="bg-brand-bg-tertiary border border-brand-border text-brand-text-main p-2 rounded-xl outline-none"
                        value={secClassroom}
                        onChange={(e) => setSecClassroom(e.target.value)}
                      />
                    </div>
                    <div className="form-group flex flex-col gap-1 text-xs">
                      <label className="form-label text-brand-text-muted font-semibold">Lab Classroom</label>
                      <input 
                        type="text" 
                        placeholder="e.g. Lab-1" 
                        className="bg-brand-bg-tertiary border border-brand-border text-brand-text-main p-2 rounded-xl outline-none"
                        value={secLabClassroom}
                        onChange={(e) => setSecLabClassroom(e.target.value)}
                      />
                    </div>
                    <div className="form-group flex flex-col gap-1 text-xs">
                      <label className="form-label text-brand-text-muted font-semibold">Mentor / Advisor</label>
                      <select 
                        className="bg-brand-bg-tertiary border border-brand-border text-brand-text-main p-2 rounded-xl outline-none cursor-pointer"
                        value={secMentor}
                        onChange={(e) => setSecMentor(e.target.value)}
                      >
                        {faculty.map(f => (
                          <option key={f.id} value={f.id}>{f.name}</option>
                        ))}
                      </select>
                    </div>
                    <div className="col-span-full flex justify-end mt-2">
                      <button type="submit" className="btn btn-primary cursor-pointer">Submit Section Allocation</button>
                    </div>
                  </form>
                ) : null}

                {/* SECTIONS GRID LISTING */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {sections.map(sec => {
                    const mentorObj = faculty.find(f => f.id === sec.mentor_id);
                    const theoryObj = faculty.find(f => f.id === sec.theory_faculty_id);
                    const labObj = faculty.find(f => f.id === sec.lab_faculty_id);
                    return (
                      <div key={sec.id} className="card p-5 bg-brand-bg-tertiary border border-brand-border rounded-xl flex flex-col gap-3">
                        <div className="flex justify-between items-center border-b border-brand-border/40 pb-2">
                          <div>
                            <strong className="text-white font-display text-sm">Section {sec.section_name}</strong>
                            <div className="text-[10px] text-brand-text-muted mt-0.5">Course Code: {sec.course_code} | Batch {sec.batch}</div>
                          </div>
                          <span className="badge bg-brand-accent-cyan/15 text-brand-accent-cyan font-mono text-[0.65rem] px-2 py-0.5 rounded">
                            {sec.student_count} Students
                          </span>
                        </div>

                        <div className="text-xs flex flex-col gap-1 text-brand-text-muted">
                          <div><strong className="text-brand-text-main">Lecturer:</strong> {theoryObj ? theoryObj.name : 'Unallocated'}</div>
                          <div><strong className="text-brand-text-main">Lab Instructor:</strong> {labObj ? labObj.name : 'Unallocated'}</div>
                          <div><strong className="text-brand-text-main">Classroom:</strong> {sec.classroom} | <strong className="text-brand-text-main">Lab Room:</strong> {sec.lab_classroom}</div>
                          <div><strong className="text-brand-text-main">Mentor:</strong> {mentorObj ? mentorObj.name : 'Unassigned'}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* TAB 3: WORKLOADS ALLOCATOR */}
            {activeTab === 'allocations' && (
              <div className="flex flex-col gap-6 animate-fade-in">
                <div className="flex justify-between items-center border-b border-brand-border/40 pb-4">
                  <h3 className="text-lg font-display font-bold text-white">Faculty Course Allocations & Load Analyzer</h3>
                  <span className="text-xs text-brand-text-muted">Maximum Limit: 18 hours/week</span>
                </div>

                {/* SUBMIT ALLOCATION FORM */}
                {simulatedRole === 'admin' || simulatedRole === 'hod' ? (
                  <form onSubmit={handleCreateAllocation} className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-brand-bg-tertiary/40 border border-brand-border/40 p-5 rounded-2xl">
                    <h4 className="col-span-full text-xs font-bold text-brand-primary uppercase tracking-wider mb-2 font-display">Create Faculty Assignment</h4>
                    <div className="form-group flex flex-col gap-1 text-xs">
                      <label className="form-label text-brand-text-muted font-semibold">Course Code</label>
                      <select 
                        className="bg-brand-bg-tertiary border border-brand-border text-brand-text-main p-2 rounded-xl outline-none cursor-pointer"
                        value={allocCourse}
                        onChange={(e) => setAllocCourse(e.target.value)}
                      >
                        <option value="">Select course...</option>
                        {offerings.map(o => (
                          <option key={o.id} value={o.course_code}>{o.course_code} - {o.course_name}</option>
                        ))}
                      </select>
                    </div>
                    <div className="form-group flex flex-col gap-1 text-xs">
                      <label className="form-label text-brand-text-muted font-semibold">Faculty Member</label>
                      <select 
                        className="bg-brand-bg-tertiary border border-brand-border text-brand-text-main p-2 rounded-xl outline-none cursor-pointer"
                        value={allocFaculty}
                        onChange={(e) => setAllocFaculty(e.target.value)}
                      >
                        {faculty.map(f => (
                          <option key={f.id} value={f.id}>{f.name} ({f.dept})</option>
                        ))}
                      </select>
                    </div>
                    <div className="form-group flex flex-col gap-1 text-xs">
                      <label className="form-label text-brand-text-muted font-semibold">Section</label>
                      <input 
                        type="text" 
                        placeholder="e.g. A" 
                        className="bg-brand-bg-tertiary border border-brand-border text-brand-text-main p-2 rounded-xl outline-none"
                        value={allocSection}
                        onChange={(e) => setAllocSection(e.target.value)}
                      />
                    </div>
                    <div className="form-group flex flex-col gap-1 text-xs">
                      <label className="form-label text-brand-text-muted font-semibold">Weekly Hours</label>
                      <input 
                        type="number" 
                        className="bg-brand-bg-tertiary border border-brand-border text-brand-text-main p-2 rounded-xl outline-none"
                        value={allocHours}
                        min="1"
                        max="18"
                        onChange={(e) => setAllocHours(parseInt(e.target.value) || 0)}
                      />
                    </div>
                    <div className="form-group flex flex-col gap-1 text-xs col-span-2">
                      <label className="form-label text-brand-text-muted font-semibold">Role Designation</label>
                      <select 
                        className="bg-brand-bg-tertiary border border-brand-border text-brand-text-main p-2 rounded-xl outline-none cursor-pointer"
                        value={allocRole}
                        onChange={(e) => setAllocRole(e.target.value)}
                      >
                        <option value="LECTURER">Lecturer (Theory Class)</option>
                        <option value="CO_TEACHER">Co-Teacher (Theory Class)</option>
                        <option value="GUEST">Guest Faculty</option>
                        <option value="VISITING">Visiting Faculty</option>
                        <option value="LAB_INSTRUCTOR">Lab Instructor (Practical Class)</option>
                        <option value="TUTORIAL_INSTRUCTOR">Tutorial Instructor</option>
                      </select>
                    </div>
                    <div className="col-span-full md:col-span-2 flex justify-end items-end pb-1.5">
                      <button type="submit" className="btn btn-primary cursor-pointer w-full md:w-auto">Submit Load</button>
                    </div>
                  </form>
                ) : null}

                {/* WORKLOAD BAR GAUGES */}
                <h4 className="text-xs font-bold text-white uppercase tracking-wider mt-4 font-display">Faculty Workload limit alarms</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-1">
                  {faculty.slice(0, 8).map(fac => {
                    const loadedHours = allocations
                      .filter(a => a.faculty_id === fac.id && a.status !== 'DECLINED')
                      .reduce((sum, current) => sum + (current.assigned_hours || 0), 0);
                    const profDetail = profiles.find(p => p.id === fac.id);
                    const limit = profDetail ? profDetail.weekly_teaching_limit : 18;
                    const percent = Math.min((loadedHours / limit) * 100, 100);

                    let barColor = 'bg-brand-accent-emerald';
                    if (loadedHours > limit) barColor = 'bg-brand-accent-ruby animate-pulse';
                    else if (loadedHours > limit - 3) barColor = 'bg-brand-accent-amber';

                    return (
                      <div key={fac.id} className="p-4 bg-brand-bg-tertiary border border-brand-border rounded-xl">
                        <div className="flex justify-between items-center mb-1 text-xs">
                          <strong className="text-white">{fac.name}</strong>
                          <span className="font-mono text-brand-text-muted">{loadedHours} / {limit} hrs/wk</span>
                        </div>
                        <div className="h-2 bg-brand-bg-secondary rounded-full overflow-hidden border border-brand-border/40">
                          <div className={`h-full rounded-full transition-all duration-300 ${barColor}`} style={{ width: `${percent}%` }}></div>
                        </div>
                        {loadedHours > limit && (
                          <div className="text-[10px] text-brand-accent-ruby font-bold mt-1 animate-pulse">
                            🚨 OVERLOAD WARNING: Limit exceeded!
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* TAB 4: SIGN-OFF WORKFLOW PIPELINE */}
            {activeTab === 'workflow' && (
              <div className="flex flex-col gap-6 animate-fade-in">
                <div className="flex justify-between items-center border-b border-brand-border/40 pb-4">
                  <h3 className="text-lg font-display font-bold text-white">Signoff & Approval Workflows</h3>
                  <span className="text-xs text-brand-text-muted">Role signatures registry</span>
                </div>

                {/* PUBLISH ACTION PANEL */}
                {simulatedRole === 'registrar' && (
                  <div className="p-5 bg-brand-primary/10 border border-brand-primary/20 rounded-2xl">
                    <h4 className="text-sm font-semibold text-white mb-2">Publish Matrix & Notarize</h4>
                    <p className="text-brand-text-muted text-xs mb-4">
                      Final step for registrar. Publishes approved teaching plans, resolves student-class allocations, updates timetables, and notarizes certifications to the blockchain ledger.
                    </p>
                    <button 
                      className="btn btn-primary cursor-pointer flex items-center gap-2"
                      onClick={handlePublish}
                      disabled={isPublishing}
                    >
                      {isPublishing ? 'Certifying Matrix...' : 'Publish & Notarize Allocations'}
                    </button>
                    {publishMessage && (
                      <div className="text-xs text-brand-accent-emerald mt-3 font-mono leading-normal bg-brand-accent-emerald/10 p-3 rounded-lg border border-brand-accent-emerald/20 animate-fade-in">
                        {publishMessage}
                      </div>
                    )}
                  </div>
                )}

                {/* ALLOCATIONS STATUS TABLE */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-brand-border text-brand-text-muted uppercase text-[10px] tracking-wider font-semibold font-display">
                        <th className="pb-3 pl-2">Faculty Member</th>
                        <th className="pb-3">Course / Sec</th>
                        <th className="pb-3">HOD Status</th>
                        <th className="pb-3">Dean Status</th>
                        <th className="pb-3">Registrar Status</th>
                        <th className="pb-3">Status</th>
                        <th className="pb-3 pr-2 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {allocations.map(alloc => {
                        const facObj = faculty.find(f => f.id === alloc.faculty_id);
                        return (
                          <tr key={alloc.id} className="border-b border-brand-border/40 hover:bg-white/[0.01]">
                            <td className="py-3.5 pl-2 text-white font-medium">{facObj ? facObj.name : 'Unknown Faculty'}</td>
                            <td className="py-3.5 text-brand-text-muted font-mono">{alloc.course_code} - Sec {alloc.section_name}</td>
                            <td className="py-3.5 font-bold">
                              <span className={alloc.hod_approved === 1 ? 'text-brand-accent-emerald' : (alloc.hod_approved === -1 ? 'text-brand-accent-ruby' : 'text-brand-text-muted')}>
                                {alloc.hod_approved === 1 ? 'Signed' : (alloc.hod_approved === -1 ? 'Declined' : 'Pending')}
                              </span>
                            </td>
                            <td className="py-3.5 font-bold">
                              <span className={alloc.dean_approved === 1 ? 'text-brand-accent-emerald' : (alloc.dean_approved === -1 ? 'text-brand-accent-ruby' : 'text-brand-text-muted')}>
                                {alloc.dean_approved === 1 ? 'Signed' : (alloc.dean_approved === -1 ? 'Declined' : 'Pending')}
                              </span>
                            </td>
                            <td className="py-3.5 font-bold">
                              <span className={alloc.registrar_approved === 1 ? 'text-brand-accent-emerald' : (alloc.registrar_approved === -1 ? 'text-brand-accent-ruby' : 'text-brand-text-muted')}>
                                {alloc.registrar_approved === 1 ? 'Signed' : (alloc.registrar_approved === -1 ? 'Declined' : 'Pending')}
                              </span>
                            </td>
                            <td className="py-3.5">
                              <span className={`badge text-[0.65rem] px-2 py-0.5 rounded font-mono ${
                                alloc.status === 'PUBLISHED' ? 'bg-brand-accent-emerald/20 text-brand-accent-emerald' : 'bg-brand-accent-amber/20 text-brand-accent-amber'
                              }`}>
                                {alloc.status}
                              </span>
                            </td>
                            <td className="py-3.5 pr-2 text-right">
                              {alloc.status === 'PENDING' && (
                                <div className="flex gap-1 justify-end">
                                  {simulatedRole === 'hod' && alloc.hod_approved === 0 && (
                                    <>
                                      <button className="btn btn-primary btn-sm py-1 px-2 cursor-pointer text-[10px]" onClick={() => handleApproveStep(alloc.id, 'APPROVE')}>Sign HOD</button>
                                      <button className="btn btn-secondary btn-sm py-1 px-2 cursor-pointer text-[10px] text-brand-accent-ruby" onClick={() => handleApproveStep(alloc.id, 'DECLINE')}>Reject</button>
                                    </>
                                  )}
                                  {simulatedRole === 'dean' && alloc.hod_approved === 1 && alloc.dean_approved === 0 && (
                                    <>
                                      <button className="btn btn-primary btn-sm py-1 px-2 cursor-pointer text-[10px]" onClick={() => handleApproveStep(alloc.id, 'APPROVE')}>Sign Dean</button>
                                      <button className="btn btn-secondary btn-sm py-1 px-2 cursor-pointer text-[10px] text-brand-accent-ruby" onClick={() => handleApproveStep(alloc.id, 'DECLINE')}>Reject</button>
                                    </>
                                  )}
                                  {simulatedRole === 'registrar' && alloc.dean_approved === 1 && alloc.registrar_approved === 0 && (
                                    <>
                                      <button className="btn btn-primary btn-sm py-1 px-2 cursor-pointer text-[10px]" onClick={() => handleApproveStep(alloc.id, 'APPROVE')}>Sign Reg</button>
                                      <button className="btn btn-secondary btn-sm py-1 px-2 cursor-pointer text-[10px] text-brand-accent-ruby" onClick={() => handleApproveStep(alloc.id, 'DECLINE')}>Reject</button>
                                    </>
                                  )}
                                </div>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* TAB 5: ANALYTICS MATRICES */}
            {activeTab === 'analytics' && (
              <div className="flex flex-col gap-6 animate-fade-in">
                <div className="flex justify-between items-center border-b border-brand-border/40 pb-4">
                  <h3 className="text-lg font-display font-bold text-white">Academic Analytics & Resource Tracking</h3>
                  <span className="text-xs text-brand-text-muted">Utilization charts</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* CHART WIDGET */}
                  <div className="card p-5 bg-brand-bg-tertiary border border-brand-border rounded-2xl flex flex-col gap-3">
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider font-display">Active Offerings per Department</h4>
                    <div className="h-[250px] relative">
                      <canvas ref={canvasRef}></canvas>
                    </div>
                  </div>

                  {/* ROOM ALLOCATION HUDS */}
                  <div className="card p-5 bg-brand-bg-tertiary border border-brand-border rounded-2xl flex flex-col gap-3">
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider font-display">Classroom Utilization Rates</h4>
                    <div className="flex flex-col gap-3 text-xs">
                      {['LH-101', 'LH-102', 'LH-203', 'LH-204'].map((room, idx) => {
                        const usage = sections.filter(s => s.classroom === room).length;
                        const score = Math.min((usage / 6) * 100, 100);
                        return (
                          <div key={room}>
                            <div className="flex justify-between text-brand-text-muted mb-1">
                              <strong>{room}</strong>
                              <span>{usage} / 6 slots booked ({Math.round(score)}%)</span>
                            </div>
                            <div className="h-1.5 bg-brand-bg-secondary rounded-full overflow-hidden">
                              <div className="h-full bg-brand-accent-cyan rounded-full" style={{ width: `${score}%` }}></div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>
      )}
    </div>
  );
}
