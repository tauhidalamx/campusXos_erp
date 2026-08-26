'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useDb } from '../../../context/db-context';
import { 
  BookOpen, 
  Users, 
  Calendar, 
  FileText, 
  CheckCircle, 
  GraduationCap, 
  MapPin, 
  UserPlus, 
  Settings, 
  Search, 
  Activity, 
  Layers,
  Edit
} from 'lucide-react';

export default function HodDashboard() {
  const { 
    students, 
    faculty, 
    courses, 
    exams, 
    departments,
    updateStudent,
    updateFaculty, 
    updateCourse, 
    updateExam 
  } = useDb();

  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedDept, setSelectedDept] = useState('CS');
  const [activeTab, setActiveTab] = useState('overview');

  // Search filter
  const [studentSearch, setStudentSearch] = useState('');

  // Allocation forms state
  const [allocFacId, setAllocFacId] = useState('');
  const [allocCourseCode, setAllocCourseCode] = useState('');

  // Course update form state
  const [editCourseCode, setEditCourseCode] = useState('');
  const [editCourseTitle, setEditCourseTitle] = useState('');
  const [editCourseCredits, setEditCourseCredits] = useState('3');
  const [editCourseMaxEnroll, setEditCourseMaxEnroll] = useState('100');
  const [editCourseStatus, setEditCourseStatus] = useState('Active');

  // Exam hall allocation form state
  const [allocExamCode, setAllocExamCode] = useState('');
  const [allocHall, setAllocHall] = useState('Hall A');

  // Edit modals state
  const [editingStudent, setEditingStudent] = useState(null);
  const [editingFaculty, setEditingFaculty] = useState(null);

  // Student Edit Form State
  const [stuEditName, setStuEditName] = useState('');
  const [stuEditEmail, setStuEditEmail] = useState('');
  const [stuEditSemester, setStuEditSemester] = useState('1');
  const [stuEditGpa, setStuEditGpa] = useState('3.0');
  const [stuEditAttendance, setStuEditAttendance] = useState('90');
  const [stuEditStatus, setStuEditStatus] = useState('Active');

  // Faculty Edit Form State
  const [facEditName, setFacEditName] = useState('');
  const [facEditEmail, setFacEditEmail] = useState('');
  const [facEditDesignation, setFacEditDesignation] = useState('Professor');

  // Syllabus progress tracking
  const [syllabusProgress, setSyllabusProgress] = useState([
    { code: 'CS101', subject: 'Intro to Programming', progress: 78, status: 'On Track' },
    { code: 'CS202', subject: 'Data Structures', progress: 85, status: 'On Track' },
    { code: 'CS301', subject: 'Database Systems', progress: 60, status: 'Behind Schedule' },
    { code: 'EE101', subject: 'Basic Electrical Sciences', progress: 90, status: 'On Track' },
    { code: 'EE201', subject: 'Signals and Systems', progress: 45, status: 'Behind Schedule' },
    { code: 'ME102', subject: 'Thermodynamics & Heat', progress: 82, status: 'On Track' },
    { code: 'BI101', subject: 'Intro to Bioinformatics', progress: 50, status: 'Behind Schedule' },
    { code: 'BA201', subject: 'Organizational Behavior', progress: 95, status: 'On Track' }
  ]);

  const canvasRef = useRef(null);
  const chartRef = useRef(null);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.Chart || !canvasRef.current || activeTab !== 'overview') return;
    const Chart = window.Chart;

    if (chartRef.current) chartRef.current.destroy();

    const currentDeptSyllabus = syllabusProgress.filter(s => 
      courses.find(c => c.code === s.code && c.dept === selectedDept)
    );

    const labels = currentDeptSyllabus.map(s => s.code);
    const progressData = currentDeptSyllabus.map(s => s.progress);
    const attendanceData = currentDeptSyllabus.map((_, idx) => Math.round(82 + (idx * 2.3) % 15));

    chartRef.current = new Chart(canvasRef.current, {
      type: 'bar',
      data: {
        labels: labels.length > 0 ? labels : ['CS101', 'CS202', 'CS301', 'EE101', 'EE201'],
        datasets: [
          {
            label: 'Syllabus Completion %',
            data: progressData.length > 0 ? progressData : [78, 85, 60, 90, 45],
            backgroundColor: '#6366f1',
            borderRadius: 6
          },
          {
            label: 'Average Attendance %',
            data: attendanceData.length > 0 ? attendanceData : [88, 92, 85, 90, 82],
            backgroundColor: '#06b6d4',
            borderRadius: 6
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true,
            labels: { color: '#94a3b8', font: { family: 'Inter', size: 11 } }
          }
        },
        scales: {
          y: {
            grid: { color: 'rgba(255, 255, 255, 0.05)' },
            ticks: { color: '#94a3b8' },
            min: 0,
            max: 100
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
  }, [activeTab, selectedDept, syllabusProgress, courses]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const session = sessionStorage.getItem('campusx_erp_session');
      if (session) {
        setCurrentUser(JSON.parse(session));
      }
      setLoading(false);
    }
  }, []);

  // Sync allocation form dropdown items when selected department changes
  useEffect(() => {
    const deptFac = faculty.filter(f => f.dept === selectedDept);
    const deptCourses = courses.filter(c => c.dept === selectedDept);

    if (deptFac.length > 0) setAllocFacId(deptFac[0].id);
    else setAllocFacId('');

    if (deptCourses.length > 0) {
      setAllocCourseCode(deptCourses[0].code);
      handleSelectCourseToEdit(deptCourses[0].code);
    } else {
      setAllocCourseCode('');
      setEditCourseCode('');
      setEditCourseTitle('');
      setEditCourseCredits('3');
      setEditCourseMaxEnroll('100');
      setEditCourseStatus('Active');
    }

    const deptExams = exams.filter(e => {
      const c = courses.find(course => course.code === e.code);
      return c && c.dept === selectedDept;
    });
    if (deptExams.length > 0) setAllocExamCode(deptExams[0].code);
    else setAllocExamCode('');
  }, [selectedDept, faculty, courses, exams]);

  const handleSelectCourseToEdit = (code) => {
    const c = courses.find(course => course.code === code);
    if (c) {
      setEditCourseCode(c.code);
      setEditCourseTitle(c.title);
      setEditCourseCredits(c.credits.toString());
      setEditCourseMaxEnroll(c.maxEnrollment.toString());
      setEditCourseStatus(c.status);
    }
  };

  const handleAccelerateSubject = (code) => {
    setSyllabusProgress(prev => 
      prev.map(s => s.code === code ? { ...s, progress: Math.min(s.progress + 10, 100), status: 'On Track' } : s)
    );
    alert(`Instruction sent to course coordinator for ${code} to accelerate schedule.`);
  };

  // Perform Faculty course allocation
  const handleAllocateFaculty = (e) => {
    e.preventDefault();
    if (!allocFacId || !allocCourseCode) {
      alert('Please select both faculty member and course code.');
      return;
    }

    const targetFaculty = faculty.find(f => f.id === allocFacId);
    const targetCourse = courses.find(c => c.code === allocCourseCode);
    if (!targetFaculty || !targetCourse) return;

    // Update Course pointer
    updateCourse(allocCourseCode, { facultyId: allocFacId });

    // Update Faculty member workloads and teaching schedules
    faculty.forEach(f => {
      if (f.id !== allocFacId && f.courses.includes(allocCourseCode)) {
        // Remove course from former instructor
        const updatedCourses = f.courses.filter(code => code !== allocCourseCode);
        updateFaculty(f.id, { 
          courses: updatedCourses,
          workload: Math.max(0, f.workload - targetCourse.credits * 3)
        });
      }
    });

    if (!targetFaculty.courses.includes(allocCourseCode)) {
      // Add course to new instructor
      const updatedCourses = [...targetFaculty.courses, allocCourseCode];
      updateFaculty(allocFacId, {
        courses: updatedCourses,
        workload: targetFaculty.workload + targetCourse.credits * 3
      });
    }

    alert(`Successfully allocated Course ${allocCourseCode} to ${targetFaculty.name}. Workload adjusted dynamically.`);
  };

  // Modify Course Parameter allocations
  const handleUpdateCourseParams = (e) => {
    e.preventDefault();
    if (!editCourseCode) {
      alert('Please select a course to update.');
      return;
    }

    updateCourse(editCourseCode, {
      title: editCourseTitle,
      credits: parseInt(editCourseCredits) || 3,
      maxEnrollment: parseInt(editCourseMaxEnroll) || 100,
      status: editCourseStatus
    });

    alert(`Course parameters for ${editCourseCode} updated successfully.`);
  };

  // Perform Hall venue allocation
  const handleAllocateHall = (e) => {
    e.preventDefault();
    if (!allocExamCode || !allocHall) {
      alert('Please select both exam and hall venue.');
      return;
    }

    updateExam(allocExamCode, { venue: allocHall });
    alert(`Successfully allocated ${allocHall} for the ${allocExamCode} exam session.`);
  };

  // Edit Student Form launcher
  const handleOpenEditStudent = (stu) => {
    setEditingStudent(stu);
    setStuEditName(stu.name);
    setStuEditEmail(stu.email);
    setStuEditSemester(stu.semester.toString());
    setStuEditGpa(stu.gpa.toString());
    setStuEditAttendance(stu.attendance.toString());
    setStuEditStatus(stu.status);
  };

  // Save Student Modifications
  const handleSaveStudentEdit = (e) => {
    e.preventDefault();
    if (!editingStudent) return;

    updateStudent(editingStudent.id, {
      name: stuEditName,
      email: stuEditEmail,
      semester: parseInt(stuEditSemester) || 1,
      gpa: parseFloat(stuEditGpa) || 0.0,
      attendance: parseInt(stuEditAttendance) || 0,
      status: stuEditStatus
    });

    alert(`Student profile for ${stuEditName} (${editingStudent.id}) modified successfully.`);
    setEditingStudent(null);
  };

  // Edit Faculty Form launcher
  const handleOpenEditFaculty = (fac) => {
    setEditingFaculty(fac);
    setFacEditName(fac.name);
    setFacEditEmail(fac.email);
    setFacEditDesignation(fac.designation);
  };

  // Save Faculty Modifications
  const handleSaveFacultyEdit = (e) => {
    e.preventDefault();
    if (!editingFaculty) return;

    updateFaculty(editingFaculty.id, {
      name: facEditName,
      email: facEditEmail,
      designation: facEditDesignation
    });

    alert(`Faculty profile for ${facEditName} (${editingFaculty.id}) modified successfully.`);
    setEditingFaculty(null);
  };

  // Filter listings based on department
  const filteredFaculty = faculty.filter(f => f.dept === selectedDept);
  const filteredCourses = courses.filter(c => c.dept === selectedDept);
  const filteredStudents = students.filter(s => s.dept === selectedDept).filter(s => 
    s.name.toLowerCase().includes(studentSearch.toLowerCase()) ||
    s.id.toLowerCase().includes(studentSearch.toLowerCase()) ||
    s.email.toLowerCase().includes(studentSearch.toLowerCase())
  );
  
  const filteredExams = exams.filter(e => {
    const c = courses.find(course => course.code === e.code);
    return c && c.dept === selectedDept;
  });

  const activeSyllabusAlerts = syllabusProgress.filter(s => 
    s.status === 'Behind Schedule' && 
    courses.find(c => c.code === s.code)?.dept === selectedDept
  ).length;

  if (loading) return null;

  return (
    <div className="flex flex-col gap-6 md:gap-8 fade-in text-white">
      {/* Header with Department Selector */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center pb-4 border-b border-brand-border/40 gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-white tracking-tight flex items-center gap-3">
            <BookOpen className="w-8 h-8 text-brand-primary" />
            Department Operations Portal
          </h1>
          <p className="text-brand-text-muted text-sm mt-1">
            Welcome back, {currentUser?.name || 'Department Admin'}. Manage syllabus schedules, course workloads, student lists, and exam venues.
          </p>
        </div>

        {/* Department Switcher */}
        <div className="flex items-center gap-2 self-start sm:self-center bg-brand-bg-secondary p-1.5 rounded-xl border border-brand-border/60">
          <span className="text-[10px] text-brand-text-muted font-bold uppercase tracking-wider pl-2.5 pr-1.5">Dept:</span>
          <select 
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            className="bg-brand-bg-tertiary border border-brand-border rounded-lg py-1 px-3 text-xs font-semibold text-white focus:outline-none focus:border-brand-primary"
          >
            {departments.map(d => (
              <option key={d.code} value={d.code}>{d.name} ({d.code})</option>
            ))}
          </select>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex gap-2 border-b border-brand-border/20 pb-px overflow-x-auto custom-scrollbar">
        {[
          { id: 'overview', name: 'Overview', icon: Layers },
          { id: 'students', name: 'Students Directory', icon: GraduationCap },
          { id: 'faculty', name: 'Faculty & Allocation', icon: Users },
          { id: 'courses', name: 'Courses & Allocation', icon: BookOpen },
          { id: 'exams', name: 'Exams & Halls', icon: Calendar }
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-3 text-xs font-bold tracking-wider uppercase border-b-2 transition-all whitespace-nowrap ${
                activeTab === tab.id 
                  ? 'border-brand-primary text-white bg-brand-primary/10' 
                  : 'border-transparent text-brand-text-muted hover:text-white hover:bg-white/5'
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              {tab.name}
            </button>
          );
        })}
      </div>

      {/* Tab Contents */}
      {activeTab === 'overview' && (
        <div className="flex flex-col gap-6 md:gap-8">
          {/* Quick Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="card p-5 bg-brand-bg-secondary border border-brand-border rounded-2xl flex items-center justify-between">
              <div>
                <span className="text-brand-text-muted text-xs font-semibold">Active Faculty</span>
                <span className="block text-2xl font-bold font-display text-brand-primary mt-1">{filteredFaculty.length} Members</span>
                <span className="text-[10px] text-brand-accent-emerald mt-1 block">Assigned to {selectedDept}</span>
              </div>
              <div className="p-3 bg-brand-primary/10 rounded-xl text-brand-primary">
                <Users className="w-6 h-6" />
              </div>
            </div>

            <div className="card p-5 bg-brand-bg-secondary border border-brand-border rounded-2xl flex items-center justify-between">
              <div>
                <span className="text-brand-text-muted text-xs font-semibold">Courses Offered</span>
                <span className="block text-2xl font-bold font-display text-brand-accent-cyan mt-1">{filteredCourses.length} Subjects</span>
                <span className="text-[10px] text-brand-accent-cyan mt-1 block">Curriculum Syllabus Enabled</span>
              </div>
              <div className="p-3 bg-brand-accent-cyan/10 rounded-xl text-brand-accent-cyan">
                <BookOpen className="w-6 h-6" />
              </div>
            </div>

            <div className="card p-5 bg-brand-bg-secondary border border-brand-border rounded-2xl flex items-center justify-between">
              <div>
                <span className="text-brand-text-muted text-xs font-semibold">Behind Progress</span>
                <span className="block text-2xl font-bold font-display text-brand-accent-ruby mt-1">
                  {activeSyllabusAlerts} Alerts
                </span>
                <span className="text-[10px] text-brand-accent-ruby mt-1 block">Attention Required</span>
              </div>
              <div className="p-3 bg-brand-accent-ruby/10 rounded-xl text-brand-accent-ruby animate-pulse">
                <FileText className="w-6 h-6" />
              </div>
            </div>
          </div>

          {/* Curriculum audit */}
          <div className="card bg-brand-bg-secondary border border-brand-border rounded-2xl p-6 flex flex-col gap-4">
            <h3 className="text-lg font-bold font-display text-white border-b border-brand-border/40 pb-3 flex items-center gap-2">
              <FileText className="w-5 h-5 text-brand-accent-cyan" />
              Curriculum Audit & Syllabus Completion Telemetry
            </h3>
            <div className="flex flex-col gap-4">
              {syllabusProgress.filter(s => filteredCourses.find(c => c.code === s.code)).length === 0 ? (
                <div className="text-center py-6 text-brand-text-muted text-xs">
                  No syllabus tracking records found for this department.
                </div>
              ) : (
                syllabusProgress.filter(s => filteredCourses.find(c => c.code === s.code)).map(subj => (
                  <div key={subj.code} className="p-4 bg-brand-bg-tertiary/60 border border-brand-border/40 rounded-2xl text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-bold text-white text-sm">{subj.code} - {subj.subject}</span>
                        <span className="font-mono text-brand-accent-cyan font-bold">{subj.progress}% Completed</span>
                      </div>
                      <div className="w-full bg-brand-bg-secondary h-2 rounded-full overflow-hidden border border-brand-border/40">
                        <div className="h-full bg-brand-primary rounded-full transition-all duration-300" style={{ width: `${subj.progress}%` }}></div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <span className={`badge text-[10px] px-2.5 py-0.5 rounded font-semibold ${
                        subj.status === 'On Track' ? 'bg-brand-accent-emerald/20 text-brand-accent-emerald' : 'bg-brand-accent-ruby/20 text-brand-accent-ruby animate-pulse'
                      }`}>
                        {subj.status}
                      </span>
                      {subj.status === 'Behind Schedule' && (
                        <button 
                          onClick={() => handleAccelerateSubject(subj.code)} 
                          className="btn btn-primary btn-sm flex items-center gap-1.5 cursor-pointer text-xs py-1 px-3"
                        >
                          <CheckCircle className="w-3.5 h-3.5" />
                          Issue Speed Alert
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Department Performance Trend Chart */}
          <div className="card bg-brand-bg-secondary border border-brand-border rounded-2xl p-6 flex flex-col h-[380px]">
            <h3 className="text-lg font-bold font-display text-white border-b border-brand-border/40 pb-3 flex items-center gap-2">
              <Activity className="w-5 h-5 text-brand-primary" />
              Syllabus Completion & Student Attendance Trends
            </h3>
            <div className="flex-1 relative min-h-0 mt-4">
              <canvas ref={canvasRef}></canvas>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'students' && (
        <div className="card bg-brand-bg-secondary border border-brand-border rounded-2xl p-6 flex flex-col gap-6">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 border-b border-brand-border/40 pb-4">
            <h3 className="text-lg font-bold font-display text-white flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-brand-primary" />
              Department Students Roster
            </h3>

            {/* Search */}
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-3 w-4 h-4 text-brand-text-muted" />
              <input 
                type="text"
                placeholder="Search students by name, ID or email..."
                value={studentSearch}
                onChange={(e) => setStudentSearch(e.target.value)}
                className="bg-brand-bg-tertiary border border-brand-border rounded-lg pl-9 pr-4 py-2.5 text-xs text-white placeholder-brand-text-muted w-full focus:outline-none focus:border-brand-primary"
              />
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-brand-border/60 text-brand-text-muted font-bold text-[10px] uppercase tracking-wider">
                  <th className="py-3 px-4">Student ID</th>
                  <th className="py-3 px-4">Name</th>
                  <th className="py-3 px-4">Email</th>
                  <th className="py-3 px-4">Semester</th>
                  <th className="py-3 px-4">GPA</th>
                  <th className="py-3 px-4">Attendance</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Modify</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-border/30">
                {filteredStudents.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="text-center py-6 text-brand-text-muted">
                      No matching student profiles found in this department.
                    </td>
                  </tr>
                ) : (
                  filteredStudents.map(student => (
                    <tr key={student.id} className="hover:bg-white/5 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-brand-accent-cyan">{student.id}</td>
                      <td className="py-3 px-4 font-semibold text-white">{student.name}</td>
                      <td className="py-3 px-4 text-brand-text-muted">{student.email}</td>
                      <td className="py-3 px-4 font-medium">Sem {student.semester}</td>
                      <td className="py-3 px-4 font-mono text-brand-accent-amber font-semibold">{student.gpa.toFixed(2)}</td>
                      <td className="py-3 px-4 font-mono">{student.attendance}%</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          student.status === 'Active' ? 'bg-brand-accent-emerald/25 text-brand-accent-emerald' : 
                          student.status === 'Probation' ? 'bg-brand-accent-amber/25 text-brand-accent-amber' : 
                          student.status === 'Suspended' ? 'bg-brand-accent-ruby/25 text-brand-accent-ruby' :
                          'bg-brand-text-muted/25 text-brand-text-muted'
                        }`}>
                          {student.status}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <button 
                          onClick={() => handleOpenEditStudent(student)} 
                          className="p-1.5 text-brand-accent-cyan hover:bg-brand-accent-cyan/15 rounded-lg cursor-pointer transition-colors"
                          title="Edit Student Details"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'faculty' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Faculty list */}
          <div className="lg:col-span-2 card bg-brand-bg-secondary border border-brand-border rounded-2xl p-6 flex flex-col gap-4">
            <h3 className="text-lg font-bold font-display text-white border-b border-brand-border/40 pb-3 flex items-center gap-2">
              <Users className="w-5 h-5 text-brand-primary" />
              Faculty Members
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredFaculty.map(fac => (
                <div key={fac.id} className="p-4 bg-brand-bg-tertiary/60 border border-brand-border/40 rounded-2xl flex items-start gap-4 relative">
                  <img src={fac.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150'} alt={fac.name} className="w-12 h-12 rounded-full object-cover border border-brand-border/80" />
                  <div className="flex-1 min-w-0 text-xs">
                    <div className="flex justify-between items-start gap-2">
                      <h4 className="font-bold text-sm text-white truncate">{fac.name}</h4>
                      <button 
                        onClick={() => handleOpenEditFaculty(fac)} 
                        className="p-1 text-brand-accent-cyan hover:bg-brand-accent-cyan/15 rounded cursor-pointer transition-colors"
                        title="Edit Faculty Details"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <span className="text-[10px] text-brand-accent-cyan font-semibold">{fac.designation}</span>
                    <p className="text-brand-text-muted truncate mt-1">{fac.email}</p>
                    
                    <div className="flex justify-between items-center mt-3 border-t border-brand-border/20 pt-2 font-semibold">
                      <span className="text-[10px] text-brand-text-muted uppercase">Workload:</span>
                      <span className={`font-mono text-[11px] ${fac.workload > 15 ? 'text-brand-accent-ruby font-bold animate-pulse' : 'text-brand-accent-emerald'}`}>
                        {fac.workload} Hrs/Wk
                      </span>
                    </div>

                    <div className="mt-2 flex flex-wrap gap-1">
                      {fac.courses.length === 0 ? (
                        <span className="text-[9px] text-brand-text-muted italic">No classes allocated</span>
                      ) : (
                        fac.courses.map(code => (
                          <span key={code} className="text-[9px] px-1.5 py-0.5 bg-brand-primary/20 border border-brand-primary/45 rounded font-mono text-brand-primary font-bold">{code}</span>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Allocation form */}
          <div className="card bg-brand-bg-secondary border border-brand-border rounded-2xl p-6 flex flex-col gap-5">
            <h3 className="text-lg font-bold font-display text-white border-b border-brand-border/40 pb-3 flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-brand-accent-emerald" />
              Faculty Course Allocation
            </h3>
            
            <p className="text-brand-text-muted text-xs leading-relaxed">
              Allocate courses/subjects to faculty teaching rosters. This updates the workload calculations automatically.
            </p>

            <form onSubmit={handleAllocateFaculty} className="flex flex-col gap-4 text-xs">
              <div className="flex flex-col gap-1.5">
                <span className="text-brand-text-muted font-bold uppercase tracking-wider text-[10px]">Select Faculty Member</span>
                <select 
                  value={allocFacId}
                  onChange={(e) => setAllocFacId(e.target.value)}
                  className="bg-brand-bg-tertiary border border-brand-border rounded-lg p-2.5 text-white"
                >
                  {filteredFaculty.map(f => (
                    <option key={f.id} value={f.id}>{f.name} ({f.designation})</option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <span className="text-brand-text-muted font-bold uppercase tracking-wider text-[10px]">Select Course Code</span>
                <select 
                  value={allocCourseCode}
                  onChange={(e) => setAllocCourseCode(e.target.value)}
                  className="bg-brand-bg-tertiary border border-brand-border rounded-lg p-2.5 text-white"
                >
                  {filteredCourses.map(c => (
                    <option key={c.code} value={c.code}>{c.code} - {c.title}</option>
                  ))}
                </select>
              </div>

              <button 
                type="submit" 
                className="btn btn-primary w-full py-2.5 font-bold uppercase tracking-wider mt-2 cursor-pointer flex items-center justify-center gap-2 text-xs"
              >
                <UserPlus className="w-4 h-4" /> Allocate Course Load
              </button>
            </form>
          </div>
        </div>
      )}

      {activeTab === 'courses' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Courses list */}
          <div className="lg:col-span-2 card bg-brand-bg-secondary border border-brand-border rounded-2xl p-6 flex flex-col gap-4">
            <h3 className="text-lg font-bold font-display text-white border-b border-brand-border/40 pb-3 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-brand-primary" />
              Course Catalog
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-brand-border/60 text-brand-text-muted font-bold text-[10px] uppercase tracking-wider">
                    <th className="py-3 px-4">Code</th>
                    <th className="py-3 px-4">Course Title</th>
                    <th className="py-3 px-4">Credits</th>
                    <th className="py-3 px-4">Instructor</th>
                    <th className="py-3 px-4">Enrolled Capacity</th>
                    <th className="py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-border/30">
                  {filteredCourses.map(course => {
                    const inst = faculty.find(f => f.id === course.facultyId);
                    return (
                      <tr key={course.code} className="hover:bg-white/5 transition-colors">
                        <td className="py-3 px-4 font-mono font-bold text-brand-accent-cyan">{course.code}</td>
                        <td className="py-3 px-4 font-semibold text-white">{course.title}</td>
                        <td className="py-3 px-4 font-mono">{course.credits} Credits</td>
                        <td className="py-3 px-4 text-brand-text-muted font-medium">{inst ? inst.name : 'Not Assigned'}</td>
                        <td className="py-3 px-4 font-mono">{course.enrolledCount} / {course.maxEnrollment}</td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            course.status === 'Active' ? 'bg-brand-accent-emerald/25 text-brand-accent-emerald' : 'bg-brand-accent-ruby/25 text-brand-accent-ruby'
                          }`}>
                            {course.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Allocation modifier form */}
          <div className="card bg-brand-bg-secondary border border-brand-border rounded-2xl p-6 flex flex-col gap-5">
            <h3 className="text-lg font-bold font-display text-white border-b border-brand-border/40 pb-3 flex items-center gap-2">
              <Settings className="w-5 h-5 text-brand-accent-cyan" />
              Modify Course Allocation
            </h3>
            
            <p className="text-brand-text-muted text-xs leading-relaxed">
              Select a course in your department to customize capabilities, enrollment thresholds, and active status.
            </p>

            <form onSubmit={handleUpdateCourseParams} className="flex flex-col gap-4 text-xs">
              <div className="flex flex-col gap-1.5">
                <span className="text-brand-text-muted font-bold uppercase tracking-wider text-[10px]">Select Target Course</span>
                <select 
                  value={editCourseCode}
                  onChange={(e) => handleSelectCourseToEdit(e.target.value)}
                  className="bg-brand-bg-tertiary border border-brand-border rounded-lg p-2.5 text-white"
                >
                  {filteredCourses.map(c => (
                    <option key={c.code} value={c.code}>{c.code} - {c.title}</option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <span className="text-brand-text-muted font-bold uppercase tracking-wider text-[10px]">Title Name</span>
                <input 
                  type="text" 
                  value={editCourseTitle}
                  onChange={(e) => setEditCourseTitle(e.target.value)}
                  className="bg-brand-bg-tertiary border border-brand-border rounded-lg p-2.5 text-white"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <span className="text-brand-text-muted font-bold uppercase tracking-wider text-[10px]">Credits Weight</span>
                <select 
                  value={editCourseCredits}
                  onChange={(e) => setEditCourseCredits(e.target.value)}
                  className="bg-brand-bg-tertiary border border-brand-border rounded-lg p-2.5 text-white"
                >
                  <option value="1">1 Credit</option>
                  <option value="2">2 Credits</option>
                  <option value="3">3 Credits</option>
                  <option value="4">4 Credits</option>
                  <option value="5">5 Credits</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <span className="text-brand-text-muted font-bold uppercase tracking-wider text-[10px]">Max Enrollment Cap</span>
                <input 
                  type="number" 
                  value={editCourseMaxEnroll}
                  onChange={(e) => setEditCourseMaxEnroll(e.target.value)}
                  className="bg-brand-bg-tertiary border border-brand-border rounded-lg p-2.5 text-white font-mono"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <span className="text-brand-text-muted font-bold uppercase tracking-wider text-[10px]">Enrollment Status</span>
                <select 
                  value={editCourseStatus}
                  onChange={(e) => setEditCourseStatus(e.target.value)}
                  className="bg-brand-bg-tertiary border border-brand-border rounded-lg p-2.5 text-white"
                >
                  <option value="Active">Active / Enrolling</option>
                  <option value="Inactive">Inactive / Suspended</option>
                </select>
              </div>

              <button 
                type="submit" 
                className="btn btn-primary w-full py-2.5 font-bold uppercase tracking-wider mt-2 cursor-pointer flex items-center justify-center gap-2 text-xs"
              >
                <Settings className="w-4 h-4" /> Save Course Allocation
              </button>
            </form>
          </div>
        </div>
      )}

      {activeTab === 'exams' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Exams schedule */}
          <div className="lg:col-span-2 card bg-brand-bg-secondary border border-brand-border rounded-2xl p-6 flex flex-col gap-4">
            <h3 className="text-lg font-bold font-display text-white border-b border-brand-border/40 pb-3 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-brand-primary" />
              Exam Schedules & Hall Allocations
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-brand-border/60 text-brand-text-muted font-bold text-[10px] uppercase tracking-wider">
                    <th className="py-3 px-4">Subject Code</th>
                    <th className="py-3 px-4">Exam Details</th>
                    <th className="py-3 px-4">Date</th>
                    <th className="py-3 px-4">Time Slot</th>
                    <th className="py-3 px-4">Allocated Hall Venue</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-border/30">
                  {filteredExams.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="text-center py-6 text-brand-text-muted">
                        No scheduled exams found for this department.
                      </td>
                    </tr>
                  ) : (
                    filteredExams.map(exam => (
                      <tr key={exam.code} className="hover:bg-white/5 transition-colors">
                        <td className="py-3 px-4 font-mono font-bold text-brand-accent-cyan">{exam.code}</td>
                        <td className="py-3 px-4 font-semibold text-white">{exam.name}</td>
                        <td className="py-3 px-4 font-mono">{exam.date}</td>
                        <td className="py-3 px-4 font-mono">{exam.time}</td>
                        <td className="py-3 px-4 font-medium text-brand-accent-amber flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5" />
                          {exam.venue || 'TBD (Not Assigned)'}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Hall allocation form */}
          <div className="card bg-brand-bg-secondary border border-brand-border rounded-2xl p-6 flex flex-col gap-5">
            <h3 className="text-lg font-bold font-display text-white border-b border-brand-border/40 pb-3 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-brand-accent-amber" />
              Exam Venue / Hall Allocation
            </h3>
            
            <p className="text-brand-text-muted text-xs leading-relaxed">
              Allocate a specific physical room or exam hall venue for scheduled department exams.
            </p>

            <form onSubmit={handleAllocateHall} className="flex flex-col gap-4 text-xs">
              <div className="flex flex-col gap-1.5">
                <span className="text-brand-text-muted font-bold uppercase tracking-wider text-[10px]">Select Scheduled Exam</span>
                {filteredExams.length === 0 ? (
                  <select disabled className="bg-brand-bg-tertiary border border-brand-border rounded-lg p-2.5 text-brand-text-muted">
                    <option>No exams scheduled</option>
                  </select>
                ) : (
                  <select 
                    value={allocExamCode}
                    onChange={(e) => setAllocExamCode(e.target.value)}
                    className="bg-brand-bg-tertiary border border-brand-border rounded-lg p-2.5 text-white"
                  >
                    {filteredExams.map(e => (
                      <option key={e.code} value={e.code}>{e.code} - {e.name}</option>
                    ))}
                  </select>
                )}
              </div>

              <div className="flex flex-col gap-1.5">
                <span className="text-brand-text-muted font-bold uppercase tracking-wider text-[10px]">Select Exam Hall Venue</span>
                <select 
                  value={allocHall}
                  onChange={(e) => setAllocHall(e.target.value)}
                  className="bg-brand-bg-tertiary border border-brand-border rounded-lg p-2.5 text-white"
                >
                  <option value="Hall A">Hall A (Main Block)</option>
                  <option value="Hall B">Hall B (Science Annex)</option>
                  <option value="Hall C">Hall C (Engineering Building)</option>
                  <option value="Lab 1">Computer Science Lab 1</option>
                  <option value="Lab 2">Electronics Lab 2</option>
                  <option value="Lab 3">Bioinformatics Lab 3</option>
                  <option value="Seminar Room">Seminar Room A</option>
                  <option value="Auditorium">Main Auditorium</option>
                </select>
              </div>

              <button 
                type="submit" 
                disabled={filteredExams.length === 0}
                className="btn btn-primary w-full py-2.5 font-bold uppercase tracking-wider mt-2 cursor-pointer flex items-center justify-center gap-2 text-xs disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <MapPin className="w-4 h-4" /> Allocate Exam Venue
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Edit Student Modal */}
      {editingStudent && (
        <div className="fixed inset-0 bg-[#071126]/85 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="card bg-brand-bg-secondary border border-brand-border rounded-2xl p-6 w-full max-w-md flex flex-col gap-4 text-xs animate-scale-up">
            <div className="flex justify-between items-center border-b border-brand-border/40 pb-3">
              <h3 className="text-base font-bold font-display text-white flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-brand-primary" />
                Modify Student Profile
              </h3>
              <button 
                onClick={() => setEditingStudent(null)} 
                className="text-brand-text-muted hover:text-white font-bold text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveStudentEdit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <span className="text-brand-text-muted font-bold uppercase tracking-wider text-[10px]">Student Name</span>
                <input 
                  type="text" 
                  value={stuEditName} 
                  onChange={(e) => setStuEditName(e.target.value)} 
                  required
                  className="bg-brand-bg-tertiary border border-brand-border rounded-lg p-2.5 text-white"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <span className="text-brand-text-muted font-bold uppercase tracking-wider text-[10px]">Email Address</span>
                <input 
                  type="email" 
                  value={stuEditEmail} 
                  onChange={(e) => setStuEditEmail(e.target.value)} 
                  required
                  className="bg-brand-bg-tertiary border border-brand-border rounded-lg p-2.5 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <span className="text-brand-text-muted font-bold uppercase tracking-wider text-[10px]">Semester</span>
                  <select 
                    value={stuEditSemester} 
                    onChange={(e) => setStuEditSemester(e.target.value)} 
                    className="bg-brand-bg-tertiary border border-brand-border rounded-lg p-2.5 text-white"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8].map(s => (
                      <option key={s} value={s.toString()}>Semester {s}</option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <span className="text-brand-text-muted font-bold uppercase tracking-wider text-[10px]">GPA</span>
                  <input 
                    type="number" 
                    step="0.01" 
                    min="0" 
                    max="4" 
                    value={stuEditGpa} 
                    onChange={(e) => setStuEditGpa(e.target.value)} 
                    required
                    className="bg-brand-bg-tertiary border border-brand-border rounded-lg p-2.5 text-white font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <span className="text-brand-text-muted font-bold uppercase tracking-wider text-[10px]">Attendance %</span>
                  <input 
                    type="number" 
                    min="0" 
                    max="100" 
                    value={stuEditAttendance} 
                    onChange={(e) => setStuEditAttendance(e.target.value)} 
                    required
                    className="bg-brand-bg-tertiary border border-brand-border rounded-lg p-2.5 text-white font-mono"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <span className="text-brand-text-muted font-bold uppercase tracking-wider text-[10px]">Status</span>
                  <select 
                    value={stuEditStatus} 
                    onChange={(e) => setStuEditStatus(e.target.value)} 
                    className="bg-brand-bg-tertiary border border-brand-border rounded-lg p-2.5 text-white"
                  >
                    <option value="Active">Active</option>
                    <option value="Probation">Probation</option>
                    <option value="Suspended">Suspended</option>
                    <option value="Graduated">Graduated</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-3 border-t border-brand-border/40 pt-4 mt-2">
                <button 
                  type="button" 
                  onClick={() => setEditingStudent(null)} 
                  className="px-4 py-2 border border-brand-border rounded-lg font-bold text-brand-text-muted hover:text-white"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-4 py-2 bg-brand-primary hover:bg-brand-primary-hover text-white font-bold rounded-lg"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Faculty Modal */}
      {editingFaculty && (
        <div className="fixed inset-0 bg-[#071126]/85 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="card bg-brand-bg-secondary border border-brand-border rounded-2xl p-6 w-full max-w-md flex flex-col gap-4 text-xs animate-scale-up">
            <div className="flex justify-between items-center border-b border-brand-border/40 pb-3">
              <h3 className="text-base font-bold font-display text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-brand-primary" />
                Modify Faculty Profile
              </h3>
              <button 
                onClick={() => setEditingFaculty(null)} 
                className="text-brand-text-muted hover:text-white font-bold text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveFacultyEdit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <span className="text-brand-text-muted font-bold uppercase tracking-wider text-[10px]">Faculty Name</span>
                <input 
                  type="text" 
                  value={facEditName} 
                  onChange={(e) => setFacEditName(e.target.value)} 
                  required
                  className="bg-brand-bg-tertiary border border-brand-border rounded-lg p-2.5 text-white"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <span className="text-brand-text-muted font-bold uppercase tracking-wider text-[10px]">Email Address</span>
                <input 
                  type="email" 
                  value={facEditEmail} 
                  onChange={(e) => setFacEditEmail(e.target.value)} 
                  required
                  className="bg-brand-bg-tertiary border border-brand-border rounded-lg p-2.5 text-white"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <span className="text-brand-text-muted font-bold uppercase tracking-wider text-[10px]">Designation</span>
                <select 
                  value={facEditDesignation} 
                  onChange={(e) => setFacEditDesignation(e.target.value)} 
                  className="bg-brand-bg-tertiary border border-brand-border rounded-lg p-2.5 text-white"
                >
                  <option value="Professor">Professor</option>
                  <option value="Associate Professor">Associate Professor</option>
                  <option value="Assistant Professor">Assistant Professor</option>
                  <option value="Lecturer">Lecturer</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 border-t border-brand-border/40 pt-4 mt-2">
                <button 
                  type="button" 
                  onClick={() => setEditingFaculty(null)} 
                  className="px-4 py-2 border border-brand-border rounded-lg font-bold text-brand-text-muted hover:text-white"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-4 py-2 bg-brand-primary hover:bg-brand-primary-hover text-white font-bold rounded-lg"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
