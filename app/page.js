'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useDb } from '../context/db-context';

export default function Dashboard() {
  const {
    students,
    faculty,
    courses,
    departments,
    announcements,
    activities,
    transactions,
    exams
  } = useDb();

  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      let session = sessionStorage.getItem('campusx_erp_session');
      if (!session) {
        const defaultUser = {
          id: 'usr_admin',
          name: 'Dr. Rajesh Sharma',
          email: 'admin@campusx.edu',
          role: 'admin',
          dept: 'Computer Science',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'
        };
        sessionStorage.setItem('campusx_erp_session', JSON.stringify(defaultUser));
        session = JSON.stringify(defaultUser);
      }

      try {
        const parsed = JSON.parse(session);
        setCurrentUser(parsed);
        const roleLandingPage = {
          superadmin: '/admin/global',
          platformadmin: '/admin/platform',
          admin: '/erp/admin',
          registrar: '/erp/registrar',
          dean: '/erp/dean',
          hod: '/erp/hod',
          faculty: '/faculty/home',
          finance_manager: '/finance/dashboard',
          research_coordinator: '/research/dashboard',
          placement_officer: '/placement/dashboard',
          student: '/student/home',
          parent: '/parent/dashboard',
          alumni: '/alumni/home',
          recruiter: '/recruiter/dashboard',
          sports_director: '/sports/director',
          coach: '/sports/coach',
          athlete: '/sports/athlete',
          sports_parent: '/sports/parent',
          department_admin: '/',
          library_admin: '/library',
          hostel_admin: '/hostel',
          transport_admin: '/transport',
          medical_staff: '/sports',
          guest: '/',
          consultant: '/reports',
          auditor: '/reports',
          compliance_officer: '/compliance'
        };
        const home = roleLandingPage[parsed?.role || 'admin'] || '/erp/admin';
        if (home && home !== '/' && window.location.pathname === '/') {
          window.location.href = home;
        }
      } catch (e) {
        console.error('Failed parsing session:', e);
      }
    }
  }, []);

  // HOD specific states
  const [hodKebabId, setHodKebabId] = useState(null);
  const [hodAllocations, setHodAllocations] = useState([
    { id: 'alloc_1', subject: 'CS101 - Intro to Programming', faculty: 'Prof. Marcus Chen', hours: 4, syllabus: '78%' },
    { id: 'alloc_2', subject: 'CS202 - Data Structures', faculty: 'Dr. Raymond Park', hours: 4, syllabus: '85%' },
    { id: 'alloc_3', subject: 'CS301 - Database Systems', faculty: 'Dr. Evelyn Sterling', hours: 3, syllabus: '60%' },
    { id: 'alloc_4', subject: 'CS401 - Artificial Intelligence', faculty: 'Prof. Sarah Connor', hours: 3, syllabus: '45%' },
  ]);
  const [hodPendingApprovals, setHodPendingApprovals] = useState([
    { id: 'appr_1', subject: 'CS101 Midterm Grades', faculty: 'Prof. Marcus Chen', status: 'Pending' },
    { id: 'appr_2', subject: 'CS202 Final Transcript', faculty: 'Dr. Raymond Park', status: 'Pending' },
    { id: 'appr_3', subject: 'CS301 Assignment 3 Grades', faculty: 'Dr. Evelyn Sterling', status: 'Pending' }
  ]);

  const hodForecastChartRef = useRef(null);
  const hodCanvasForecastRef = useRef(null);

  const [hodLr, setHodLr] = useState(0.05);
  const [hodEpochs, setHodEpochs] = useState(150);
  const [hodHorizon, setHodHorizon] = useState(2);
  const [hodTfTraining, setHodTfTraining] = useState(false);
  const [hodTfProgress, setHodTfProgress] = useState(0);
  const [hodTfEpochDisp, setHodTfEpochDisp] = useState('0/150');
  const [hodTfLossDisp, setHodTfLossDisp] = useState('0.000000');
  const [hodTfStatus, setHodTfStatus] = useState('Untrained');
  const [hodTfEquation, setHodTfEquation] = useState('y = mx + c');
  const [hodForecastMetric, setHodForecastMetric] = useState('CGPA');

  // Department Admin specific states
  const [deptAllocations, setDeptAllocations] = useState([
    { id: 'd_alloc_1', subject: 'CS101 - Intro to Programming', faculty: 'Prof. Marcus Chen', classroom: 'LH-101', syllabus: '78%' },
    { id: 'd_alloc_2', subject: 'CS202 - Data Structures', faculty: 'Dr. Raymond Park', classroom: 'LH-102', syllabus: '85%' },
    { id: 'd_alloc_3', subject: 'CS302 - Operating Systems', faculty: 'Dr. Ada Lovelace', classroom: 'LH-203', syllabus: '92%' },
    { id: 'd_alloc_4', subject: 'CS401 - Artificial Intelligence', faculty: 'Prof. Sarah Connor', classroom: 'Lab-4', syllabus: '45%' },
  ]);
  const [deptAudits, setDeptAudits] = useState([
    { id: 'd_audit_1', subject: 'CS101 Syllabus Audit', faculty: 'Prof. Marcus Chen', progress: '78%', status: 'Pending' },
    { id: 'd_audit_2', subject: 'CS202 Lab Infrastructure', faculty: 'Dr. Raymond Park', progress: '85%', status: 'Pending' },
    { id: 'd_audit_3', subject: 'CS302 Term Work Sign-off', faculty: 'Dr. Ada Lovelace', progress: '92%', status: 'Pending' }
  ]);

  const deptForecastChartRef = useRef(null);
  const deptCanvasForecastRef = useRef(null);

  const [deptLr, setDeptLr] = useState(0.05);
  const [deptEpochs, setDeptEpochs] = useState(150);
  const [deptHorizon, setDeptHorizon] = useState(2);
  const [deptTfTraining, setDeptTfTraining] = useState(false);
  const [deptTfProgress, setDeptTfProgress] = useState(0);
  const [deptTfEpochDisp, setDeptTfEpochDisp] = useState('0/150');
  const [deptTfLossDisp, setDeptTfLossDisp] = useState('0.000000');
  const [deptTfStatus, setDeptTfStatus] = useState('Untrained');
  const [deptTfEquation, setDeptTfEquation] = useState('y = mx + c');
  const [deptForecastMetric, setDeptForecastMetric] = useState('Enrollment');

  // Local state for Tasks
  const [tasks, setTasks] = useState([]);
  const [newTaskText, setNewTaskText] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState('Medium');

  // Local state for Events
  const [events, setEvents] = useState([]);
  const [showEventForm, setShowEventForm] = useState(false);
  const [newEventTitle, setNewEventTitle] = useState('');
  const [newEventType, setNewEventType] = useState('Academic');
  const [newEventDate, setNewEventDate] = useState('');

  // Active tab: 'notices' or 'activities'
  const [activeTab, setActiveTab] = useState('notices');

  // Telemetry state
  const [cpu, setCpu] = useState(24);
  const [ramPercent, setRamPercent] = useState(64.2);
  const [latency, setLatency] = useState(12);
  const [aiLoadText, setAiLoadText] = useState('Stable');
  const [aiLoadClass, setAiLoadClass] = useState('text-brand-accent-emerald');

  // TensorFlow parameters
  const [lr, setLr] = useState(0.05);
  const [epochs, setEpochs] = useState(150);
  const [horizon, setHorizon] = useState(2);
  const [tfTraining, setTfTraining] = useState(false);
  const [tfProgress, setTfProgress] = useState(0);
  const [tfEpochDisp, setTfEpochDisp] = useState('0/150');
  const [tfLossDisp, setTfLossDisp] = useState('0.000000');
  const [tfStatus, setTfStatus] = useState('Untrained');
  const [tfEquation, setTfEquation] = useState('y = mx + c');

  // Chart References
  const enrollmentChartRef = useRef(null);
  const deptChartRef = useRef(null);
  const forecastChartRef = useRef(null);
  const placementChartRef = useRef(null);
  const attendanceChartRef = useRef(null);
  const courseEnrollChartRef = useRef(null);

  const canvasEnrollmentRef = useRef(null);
  const canvasDeptRef = useRef(null);
  const canvasForecastRef = useRef(null);
  const canvasPlacementRef = useRef(null);
  const canvasAttendanceRef = useRef(null);
  const canvasCourseEnrollRef = useRef(null);

  // Calculations
  const activeStudents = students.filter(s => s.status === 'Active').length;
  const totalFaculty = faculty.length;
  const activeCourses = courses.filter(c => c.status === 'Active').length;
  const totalRevenue = transactions.reduce((acc, curr) => acc + curr.amount, 0);
  const totalDue = students.reduce((acc, curr) => acc + (curr.feeTotal - curr.feePaid), 0);
  const avgAttendance = students.length > 0 
    ? Math.round(students.reduce((acc, curr) => acc + (curr.attendance || 0), 0) / students.length)
    : 0;

  // Initialize Tasks and Events from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const defaultTasks = [
        { id: 1, text: "Approve graduation transcripts for STU006 PATEL", priority: "High", done: false },
        { id: 2, text: "Audit Stripe collection batch receipts for fee payments", priority: "Medium", done: true },
        { id: 3, text: "Verify blockchain credential hashes for CS101 course completions", priority: "Low", done: false }
      ];
      const savedTasks = localStorage.getItem('campusx_admin_tasks');
      setTasks(savedTasks ? JSON.parse(savedTasks) : defaultTasks);

      const defaultEvents = [
        { id: 1, date: "2026-06-15", title: "Semester Term Exams start", type: "Exam" },
        { id: 2, date: "2026-06-28", title: "Course Registration Deadline", type: "Academic" },
        { id: 3, date: "2026-07-01", title: "Summer Recess begins", type: "Holiday" }
      ];
      const savedEvents = localStorage.getItem('campusx_academic_events');
      setEvents(savedEvents ? JSON.parse(savedEvents) : defaultEvents);

      setNewEventDate(new Date().toISOString().split('T')[0]);
    }
  }, []);

  // Sync tasks to localStorage
  const saveTasks = (updatedTasks) => {
    setTasks(updatedTasks);
    localStorage.setItem('campusx_admin_tasks', JSON.stringify(updatedTasks));
  };

  // Sync events to localStorage
  const saveEvents = (updatedEvents) => {
    setEvents(updatedEvents);
    localStorage.setItem('campusx_academic_events', JSON.stringify(updatedEvents));
  };

  // Task Handlers
  const handleAddTask = () => {
    if (!newTaskText.trim()) return;
    const newTask = {
      id: Date.now(),
      text: newTaskText.trim(),
      priority: newTaskPriority,
      done: false
    };
    saveTasks([...tasks, newTask]);
    setNewTaskText('');
  };

  const handleToggleTask = (id) => {
    const updated = tasks.map(t => t.id === id ? { ...t, done: !t.done } : t);
    saveTasks(updated);
  };

  const handleDeleteTask = (id) => {
    const updated = tasks.filter(t => t.id !== id);
    saveTasks(updated);
  };

  // Event Handlers
  const handleAddEvent = () => {
    if (!newEventTitle.trim() || !newEventDate) {
      alert('Please enter both event name and date.');
      return;
    }
    const newEvent = {
      id: Date.now(),
      title: newEventTitle.trim(),
      date: newEventDate,
      type: newEventType
    };
    saveEvents([...events, newEvent]);
    setNewEventTitle('');
    setShowEventForm(false);
  };

  const handleDeleteEvent = (id) => {
    const updated = events.filter(ev => ev.id !== id);
    saveEvents(updated);
  };

  // Telemetry fluctuation effect
  useEffect(() => {
    const interval = setInterval(() => {
      const currentCpu = Math.floor(15 + Math.random() * 30);
      setCpu(currentCpu);

      const currentLatency = Math.floor(8 + Math.random() * 15);
      setLatency(currentLatency);

      const currentRamPercent = parseFloat((63 + Math.random() * 3).toFixed(1));
      setRamPercent(currentRamPercent);

      // Perform matrix multiplication using TensorFlow if loaded
      if (typeof window !== 'undefined' && window.tf) {
        try {
          const tf = window.tf;
          const x = tf.tensor2d([[currentCpu / 100.0, currentRamPercent / 100.0, currentLatency / 50.0]]);
          const w = tf.tensor2d([[1.2], [0.6], [0.4]]);
          const y = tf.matMul(x, w);
          const val = y.dataSync()[0];
          const loadVal = val * 50;

          if (loadVal > 40) {
            setAiLoadText(`Heavy Load (~${Math.round(loadVal)}%)`);
            setAiLoadClass('text-brand-accent-ruby font-bold');
          } else if (loadVal > 25) {
            setAiLoadText(`Elevated (~${Math.round(loadVal)}%)`);
            setAiLoadClass('text-brand-accent-amber font-bold');
          } else {
            setAiLoadText(`Stable (~${Math.round(loadVal)}%)`);
            setAiLoadClass('text-brand-accent-emerald font-bold');
          }

          x.dispose();
          w.dispose();
          y.dispose();
        } catch (e) {
          console.warn('TF evaluation warning:', e);
        }
      }
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  // Render Chart.js charts
  useEffect(() => {
    if (typeof window === 'undefined' || !window.Chart) return;
    const Chart = window.Chart;

    // 1. Student Growth Chart (Line Chart)
    if (canvasEnrollmentRef.current) {
      if (enrollmentChartRef.current) enrollmentChartRef.current.destroy();
      enrollmentChartRef.current = new Chart(canvasEnrollmentRef.current, {
        type: 'line',
        data: {
          labels: ['2022-A', '2022-B', '2023-A', '2023-B', '2024-A', '2024-B', '2025-A', '2025-B', '2026-A'],
          datasets: [{
            label: 'Student Growth',
            data: [350, 480, 620, 780, 950, 1100, 1250, 1390, 1528],
            borderColor: '#6366f1',
            backgroundColor: 'rgba(99, 102, 241, 0.08)',
            borderWidth: 3,
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
    }

    // 2. Attendance Trend Chart (Line Chart)
    if (canvasAttendanceRef.current) {
      if (attendanceChartRef.current) attendanceChartRef.current.destroy();
      attendanceChartRef.current = new Chart(canvasAttendanceRef.current, {
        type: 'line',
        data: {
          labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
          datasets: [{
            label: 'Daily Attendance (%)',
            data: [92.4, 94.1, 95.8, 93.2, 91.5],
            borderColor: '#06b6d4',
            backgroundColor: 'rgba(6, 182, 212, 0.08)',
            borderWidth: 3,
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
    }

    // 3. Faculty Distribution Doughnut Chart
    if (canvasDeptRef.current && faculty.length > 0 && departments.length > 0) {
      if (deptChartRef.current) deptChartRef.current.destroy();

      const deptCounts = {};
      departments.forEach(d => {
        deptCounts[d.code] = { count: 0, name: d.name, color: d.color };
      });
      faculty.forEach(f => {
        const deptCode = f.dept || 'CS';
        if (deptCounts[deptCode]) {
          deptCounts[deptCode].count++;
        }
      });

      const labels = Object.keys(deptCounts);
      const data = Object.values(deptCounts).map(d => d.count);
      const backgroundColors = Object.values(deptCounts).map(d => d.color);

      deptChartRef.current = new Chart(canvasDeptRef.current, {
        type: 'doughnut',
        data: {
          labels: labels,
          datasets: [{
            data: data,
            backgroundColor: backgroundColors,
            borderColor: '#121829',
            borderWidth: 3
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'right',
              labels: {
                color: '#94a3b8',
                font: { family: 'Inter', size: 11 }
              }
            }
          },
          cutout: '65%'
        }
      });
    }

    // 4. Course Enrollment Analytics Bar Chart
    if (canvasCourseEnrollRef.current && courses.length > 0) {
      if (courseEnrollChartRef.current) courseEnrollChartRef.current.destroy();

      const courseCounts = {};
      courses.forEach(c => {
        courseCounts[c.code] = { title: c.title, count: 0 };
      });
      students.forEach(s => {
        if (s.courses) {
          s.courses.forEach(code => {
            if (courseCounts[code]) {
              courseCounts[code].count++;
            }
          });
        }
      });

      const courseEntries = Object.entries(courseCounts)
        .map(([code, item]) => ({ code, title: item.title, count: item.count }))
        .slice(0, 6);

      const courseLabels = courseEntries.map(c => c.code);
      const courseData = courseEntries.map(c => c.count);

      courseEnrollChartRef.current = new Chart(canvasCourseEnrollRef.current, {
        type: 'bar',
        data: {
          labels: courseLabels,
          datasets: [{
            label: 'Enrolled Students',
            data: courseData,
            backgroundColor: '#10b981',
            borderRadius: 6,
            borderWidth: 0
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: {
            y: {
              grid: { color: 'rgba(255, 255, 255, 0.05)' },
              ticks: { color: '#94a3b8', stepSize: 1 }
            },
            x: {
              grid: { display: false },
              ticks: { color: '#94a3b8' }
            }
          }
        }
      });
    }

    // 5. TF Forecast Chart Shell
    if (canvasForecastRef.current) {
      if (forecastChartRef.current) forecastChartRef.current.destroy();
      forecastChartRef.current = new Chart(canvasForecastRef.current, {
        type: 'line',
        data: {
          labels: ['2022-A', '2022-B', '2023-A', '2023-B', '2024-A', '2024-B', '2025-A', '2025-B', '2026-A'],
          datasets: [
            {
              label: 'Historical Enrollment',
              data: [350, 480, 620, 780, 950, 1100, 1250, 1390, 1528],
              borderColor: 'rgba(99, 102, 241, 0.4)',
              backgroundColor: 'transparent',
              pointBackgroundColor: '#6366f1',
              pointRadius: 6,
              borderWidth: 2,
              showLine: true
            },
            {
              label: 'Model Fit & Prediction',
              data: [],
              borderColor: '#f59e0b',
              backgroundColor: 'transparent',
              borderWidth: 3,
              borderDash: [5, 5],
              pointRadius: 0
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: true,
              labels: { color: '#94a3b8' }
            }
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
    }

    return () => {
      if (enrollmentChartRef.current) enrollmentChartRef.current.destroy();
      if (deptChartRef.current) deptChartRef.current.destroy();
      if (placementChartRef.current) placementChartRef.current.destroy();
      if (attendanceChartRef.current) attendanceChartRef.current.destroy();
      if (forecastChartRef.current) forecastChartRef.current.destroy();
      if (courseEnrollChartRef.current) courseEnrollChartRef.current.destroy();
    };
  }, [students, departments, activeStudents, faculty, courses, currentUser]);

  // TensorFlow training execution
  const runTfTraining = async () => {
    if (tfTraining) return;
    if (typeof window === 'undefined' || !window.tf) {
      alert('TensorFlow.js is currently loading or unavailable.');
      return;
    }

    setTfTraining(true);
    setTfStatus('Training...');
    setTfProgress(0);

    const tf = window.tf;
    const xVal = [0, 1, 2, 3, 4, 5, 6, 7, 8];
    const yVal = [350, 390, 420, 480, 510, 560, 620, 680, activeStudents || 715];

    // Normalize: X / 8, Y / 1000
    const xs = tf.tensor2d(xVal.map(x => x / 8), [9, 1]);
    const ys = tf.tensor2d(yVal.map(y => y / 1000), [9, 1]);

    const model = tf.sequential();
    model.add(tf.layers.dense({ units: 1, inputShape: [1] }));

    model.compile({
      optimizer: tf.train.adam(lr),
      loss: 'meanSquaredError'
    });

    try {
      await model.fit(xs, ys, {
        epochs: epochs,
        callbacks: {
          onEpochEnd: (epoch, logs) => {
            const progress = ((epoch + 1) / epochs) * 100;
            setTfProgress(progress);
            setTfEpochDisp(`${epoch + 1}/${epochs}`);
            setTfLossDisp(logs.loss.toFixed(6));
          }
        }
      });

      // Retrieve model weights
      const weights = model.layers[0].getWeights();
      const w = weights[0].dataSync()[0];
      const b = weights[1].dataSync()[0];

      // De-normalize: y = (1000 * w / 8) * x + 1000 * b
      const m = (1000 * w) / 8;
      const c = 1000 * b;

      setTfStatus('Trained successfully');
      setTfEquation(`y = ${m.toFixed(2)}x + ${c.toFixed(2)}`);

      // Projection data creation
      const totalTerms = 9 + horizon;
      const allLabels = ['2022-A', '2022-B', '2023-A', '2023-B', '2024-A', '2024-B', '2025-A', '2025-B', '2026-A'];
      
      const years = [2026, 2027, 2028];
      let currentYearIndex = 0;
      let currentTermLetter = 'B';
      for (let i = 0; i < horizon; i++) {
        allLabels.push(`${years[currentYearIndex]}-${currentTermLetter}`);
        if (currentTermLetter === 'B') {
          currentTermLetter = 'A';
          currentYearIndex++;
        } else {
          currentTermLetter = 'B';
        }
      }

      const fitAndPredictData = [];
      for (let i = 0; i < totalTerms; i++) {
        const val = m * i + c;
        fitAndPredictData.push(Math.round(val));
      }

      // Update Chart data
      if (forecastChartRef.current) {
        forecastChartRef.current.data.labels = allLabels;
        const paddedHistorical = [...yVal];
        while (paddedHistorical.length < totalTerms) {
          paddedHistorical.push(null);
        }
        forecastChartRef.current.data.datasets[0].data = paddedHistorical;
        forecastChartRef.current.data.datasets[1].data = fitAndPredictData;
        forecastChartRef.current.update();
      }

    } catch (err) {
      console.error('Error during TensorFlow training:', err);
      alert('Error during TensorFlow training: ' + err.message);
      setTfStatus('Error');
    } finally {
      xs.dispose();
      ys.dispose();
      model.dispose();
      setTfTraining(false);
    }
  };

  // HOD Chart Initialization useEffect
  useEffect(() => {
    if (typeof window === 'undefined' || !window.Chart || currentUser?.role !== 'hod' || !hodCanvasForecastRef.current) return;
    const Chart = window.Chart;

    if (hodForecastChartRef.current) hodForecastChartRef.current.destroy();
    hodForecastChartRef.current = new Chart(hodCanvasForecastRef.current, {
      type: 'line',
      data: {
        labels: ['2022-A', '2022-B', '2023-A', '2023-B', '2024-A', '2024-B', '2025-A', '2025-B', '2026-A'],
        datasets: [
          {
            label: `Historical ${hodForecastMetric}`,
            data: hodForecastMetric === 'CGPA' 
              ? [3.12, 3.18, 3.22, 3.28, 3.31, 3.35, 3.38, 3.40, 3.42] 
              : [35, 42, 48, 52, 58, 62, 65, 68, 72],
            borderColor: 'rgba(99, 102, 241, 0.4)',
            backgroundColor: 'transparent',
            pointBackgroundColor: '#6366f1',
            pointRadius: 6,
            borderWidth: 2,
            showLine: true
          },
          {
            label: 'Model Fit & Prediction',
            data: [],
            borderColor: '#f59e0b',
            backgroundColor: 'transparent',
            borderWidth: 3,
            borderDash: [5, 5],
            pointRadius: 0
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true,
            labels: { color: '#94a3b8' }
          }
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
      if (hodForecastChartRef.current) hodForecastChartRef.current.destroy();
    };
  }, [currentUser, hodCanvasForecastRef.current, hodForecastMetric]);

  // Department Admin Chart Initialization useEffect
  useEffect(() => {
    const isDeptAdmin = currentUser?.role === 'department_admin' || currentUser?.role === 'deptadmin';
    if (typeof window === 'undefined' || !window.Chart || !isDeptAdmin || !deptCanvasForecastRef.current) return;
    const Chart = window.Chart;

    if (deptForecastChartRef.current) deptForecastChartRef.current.destroy();
    deptForecastChartRef.current = new Chart(deptCanvasForecastRef.current, {
      type: 'line',
      data: {
        labels: ['2022-A', '2022-B', '2023-A', '2023-B', '2024-A', '2024-B', '2025-A', '2025-B', '2026-A'],
        datasets: [
          {
            label: `Historical ${deptForecastMetric}`,
            data: deptForecastMetric === 'Enrollment' 
              ? [120, 128, 135, 142, 148, 155, 162, 168, 175] 
              : [82, 84, 85, 87, 88, 89, 91, 93, 94],
            borderColor: 'rgba(6, 182, 212, 0.4)',
            backgroundColor: 'transparent',
            pointBackgroundColor: '#06b6d4',
            pointRadius: 6,
            borderWidth: 2,
            showLine: true
          },
          {
            label: 'Model Fit & Prediction',
            data: [],
            borderColor: '#f59e0b',
            backgroundColor: 'transparent',
            borderWidth: 3,
            borderDash: [5, 5],
            pointRadius: 0
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true,
            labels: { color: '#94a3b8' }
          }
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
      if (deptForecastChartRef.current) deptForecastChartRef.current.destroy();
    };
  }, [currentUser, deptCanvasForecastRef.current, deptForecastMetric]);

  // Department Admin TensorFlow Training
  const runDeptTfTraining = async () => {
    if (deptTfTraining) return;
    if (typeof window === 'undefined' || !window.tf) {
      alert('TensorFlow.js is currently loading or unavailable.');
      return;
    }

    setDeptTfTraining(true);
    setDeptTfStatus('Training...');
    setDeptTfProgress(0);

    const tf = window.tf;
    const xVal = [0, 1, 2, 3, 4, 5, 6, 7, 8];
    const yVal = deptForecastMetric === 'Enrollment' 
      ? [120, 128, 135, 142, 148, 155, 162, 168, 175] 
      : [82, 84, 85, 87, 88, 89, 91, 93, 94];

    const maxVal = deptForecastMetric === 'Enrollment' ? 200.0 : 100.0;

    const xs = tf.tensor2d(xVal.map(x => x / 8), [9, 1]);
    const ys = tf.tensor2d(yVal.map(y => y / maxVal), [9, 1]);

    const model = tf.sequential();
    model.add(tf.layers.dense({ units: 1, inputShape: [1] }));

    model.compile({
      optimizer: tf.train.adam(deptLr),
      loss: 'meanSquaredError'
    });

    try {
      await model.fit(xs, ys, {
        epochs: deptEpochs,
        callbacks: {
          onEpochEnd: (epoch, logs) => {
            const progress = ((epoch + 1) / deptEpochs) * 100;
            setDeptTfProgress(progress);
            setDeptTfEpochDisp(`${epoch + 1}/${deptEpochs}`);
            setDeptTfLossDisp(logs.loss.toFixed(6));
          }
        }
      });

      const weights = model.layers[0].getWeights();
      const w = weights[0].dataSync()[0];
      const b = weights[1].dataSync()[0];

      const m = (maxVal * w) / 8;
      const c = maxVal * b;

      setDeptTfStatus('Trained successfully');
      setDeptTfEquation(`y = ${m.toFixed(3)}x + ${c.toFixed(3)}`);

      const totalTerms = 9 + deptHorizon;
      const allLabels = ['2022-A', '2022-B', '2023-A', '2023-B', '2024-A', '2024-B', '2025-A', '2025-B', '2026-A'];
      
      const years = [2026, 2027, 2028];
      let currentYearIndex = 0;
      let currentTermLetter = 'B';
      for (let i = 0; i < deptHorizon; i++) {
        allLabels.push(`${years[currentYearIndex]}-${currentTermLetter}`);
        if (currentTermLetter === 'B') {
          currentTermLetter = 'A';
          currentYearIndex++;
        } else {
          currentTermLetter = 'B';
        }
      }

      const fitAndPredictData = [];
      for (let i = 0; i < totalTerms; i++) {
        const val = m * i + c;
        fitAndPredictData.push(parseFloat(val.toFixed(2)));
      }

      if (deptForecastChartRef.current) {
        deptForecastChartRef.current.data.labels = allLabels;
        const paddedHistorical = [...yVal];
        while (paddedHistorical.length < totalTerms) {
          paddedHistorical.push(null);
        }
        deptForecastChartRef.current.data.datasets[0].label = `Historical ${deptForecastMetric}`;
        deptForecastChartRef.current.data.datasets[0].data = paddedHistorical;
        deptForecastChartRef.current.data.datasets[1].data = fitAndPredictData;
        deptForecastChartRef.current.update();
      }

    } catch (err) {
      console.error('Error during Department Admin TF training:', err);
      alert('Error during training: ' + err.message);
      setDeptTfStatus('Error');
    } finally {
      xs.dispose();
      ys.dispose();
      model.dispose();
      setDeptTfTraining(false);
    }
  };

  // HOD TensorFlow Training
  const runHodTfTraining = async () => {
    if (hodTfTraining) return;
    if (typeof window === 'undefined' || !window.tf) {
      alert('TensorFlow.js is currently loading or unavailable.');
      return;
    }

    setHodTfTraining(true);
    setHodTfStatus('Training...');
    setHodTfProgress(0);

    const tf = window.tf;
    const xVal = [0, 1, 2, 3, 4, 5, 6, 7, 8];
    const yVal = hodForecastMetric === 'CGPA' 
      ? [3.12, 3.18, 3.22, 3.28, 3.31, 3.35, 3.38, 3.40, 3.42] 
      : [35, 42, 48, 52, 58, 62, 65, 68, 72];

    const maxVal = hodForecastMetric === 'CGPA' ? 4.0 : 100.0;

    const xs = tf.tensor2d(xVal.map(x => x / 8), [9, 1]);
    const ys = tf.tensor2d(yVal.map(y => y / maxVal), [9, 1]);

    const model = tf.sequential();
    model.add(tf.layers.dense({ units: 1, inputShape: [1] }));

    model.compile({
      optimizer: tf.train.adam(hodLr),
      loss: 'meanSquaredError'
    });

    try {
      await model.fit(xs, ys, {
        epochs: hodEpochs,
        callbacks: {
          onEpochEnd: (epoch, logs) => {
            const progress = ((epoch + 1) / hodEpochs) * 100;
            setHodTfProgress(progress);
            setHodTfEpochDisp(`${epoch + 1}/${hodEpochs}`);
            setHodTfLossDisp(logs.loss.toFixed(6));
          }
        }
      });

      const weights = model.layers[0].getWeights();
      const w = weights[0].dataSync()[0];
      const b = weights[1].dataSync()[0];

      const m = (maxVal * w) / 8;
      const c = maxVal * b;

      setHodTfStatus('Trained successfully');
      setHodTfEquation(`y = ${m.toFixed(3)}x + ${c.toFixed(3)}`);

      const totalTerms = 9 + hodHorizon;
      const allLabels = ['2022-A', '2022-B', '2023-A', '2023-B', '2024-A', '2024-B', '2025-A', '2025-B', '2026-A'];
      
      const years = [2026, 2027, 2028];
      let currentYearIndex = 0;
      let currentTermLetter = 'B';
      for (let i = 0; i < hodHorizon; i++) {
        allLabels.push(`${years[currentYearIndex]}-${currentTermLetter}`);
        if (currentTermLetter === 'B') {
          currentTermLetter = 'A';
          currentYearIndex++;
        } else {
          currentTermLetter = 'B';
        }
      }

      const fitAndPredictData = [];
      for (let i = 0; i < totalTerms; i++) {
        const val = m * i + c;
        fitAndPredictData.push(parseFloat(val.toFixed(2)));
      }

      if (hodForecastChartRef.current) {
        hodForecastChartRef.current.data.labels = allLabels;
        const paddedHistorical = [...yVal];
        while (paddedHistorical.length < totalTerms) {
          paddedHistorical.push(null);
        }
        hodForecastChartRef.current.data.datasets[0].label = `Historical ${hodForecastMetric}`;
        hodForecastChartRef.current.data.datasets[0].data = paddedHistorical;
        hodForecastChartRef.current.data.datasets[1].data = fitAndPredictData;
        hodForecastChartRef.current.update();
      }

    } catch (err) {
      console.error('Error during HOD TF training:', err);
      alert('Error during training: ' + err.message);
      setHodTfStatus('Error');
    } finally {
      xs.dispose();
      ys.dispose();
      model.dispose();
      setHodTfTraining(false);
    }
  };

  if (!currentUser) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="w-8 h-8 border-4 border-brand-primary/30 border-t-brand-primary rounded-full animate-spin"></div>
      </div>
    );
  }

    if (currentUser.role === 'department_admin' || currentUser.role === 'deptadmin') {
    const handleApproveAudit = (id) => {
      setDeptAudits(prev => prev.map(a => a.id === id ? { ...a, status: 'Approved' } : a));
      alert('Syllabus Audit progression locked & committed to Consortium Ledger.');
    };

    const handleClassroomChange = (id, newClassroom) => {
      setDeptAllocations(prev => prev.map(a => a.id === id ? { ...a, classroom: newClassroom } : a));
      alert(`Classroom resource reallocated successfully: CS Department room updated to ${newClassroom}`);
    };

    return (
      <div className="flex flex-col gap-6 md:gap-8">
        {/* Welcome Section */}
        <div className="page-header animate-fade-in flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-display font-bold text-brand-text-main flex items-center gap-3">
              <span className="p-2 bg-brand-primary/10 text-brand-primary rounded-xl">
                <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
              </span>
              Department Admin Operations
            </h1>
            <p className="text-brand-text-muted mt-1 text-sm">
              Welcome back, {currentUser.name}. Manage departmental curricula, course rosters, classroom allocations, and syllabus reviews.
            </p>
          </div>
          <div className="flex gap-2">
            <Link className="btn btn-secondary btn-sm cursor-pointer flex items-center gap-1.5" href="/courses">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M4 4.5A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5v-15z"/></svg>
              Course Registry
            </Link>
            <Link className="btn btn-primary btn-sm cursor-pointer flex items-center gap-1.5" href="/attendance">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
              Attendance Desk
            </Link>
          </div>
        </div>

        {/* Dashboard KPIs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-fade-in mt-2">
          <div className="card p-5 bg-brand-bg-secondary border border-brand-border rounded-2xl flex items-center justify-between">
            <div>
              <span className="text-brand-text-muted text-xs font-semibold">Active CS Students</span>
              <span className="block text-2xl font-bold font-display text-brand-primary mt-1">10 Enrolled</span>
              <span className="text-[0.7rem] text-brand-accent-emerald mt-1 block">Full Department Roster</span>
            </div>
            <div className="p-3 bg-brand-primary/10 rounded-xl text-brand-primary">
              <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>
            </div>
          </div>
          <div className="card p-5 bg-brand-bg-secondary border border-brand-border rounded-2xl flex items-center justify-between">
            <div>
              <span className="text-brand-text-muted text-xs font-semibold">Faculty Workloads</span>
              <span className="block text-2xl font-bold font-display text-brand-accent-cyan mt-1">7 Staff Members</span>
              <span className="text-[0.7rem] text-brand-text-subtle mt-1 block">CS Department</span>
            </div>
            <div className="p-3 bg-brand-accent-cyan/10 rounded-xl text-brand-accent-cyan">
              <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            </div>
          </div>
          <div className="card p-5 bg-brand-bg-secondary border border-brand-border rounded-2xl flex items-center justify-between">
            <div>
              <span className="text-brand-text-muted text-xs font-semibold">CS Courses Offered</span>
              <span className="block text-2xl font-bold font-display text-brand-accent-emerald mt-1">4 Active Curricula</span>
              <span className="text-[0.7rem] text-brand-accent-emerald mt-1 block">Syllabus progression active</span>
            </div>
            <div className="p-3 bg-brand-accent-emerald/10 rounded-xl text-brand-accent-emerald">
              <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
            </div>
          </div>
          <div className="card p-5 bg-brand-bg-secondary border border-brand-border rounded-2xl flex items-center justify-between">
            <div>
              <span className="text-brand-text-muted text-xs font-semibold">CS Budget Utilization</span>
              <span className="block text-2xl font-bold font-display text-brand-accent-amber mt-1">$450,000</span>
              <span className="text-[0.7rem] text-brand-accent-emerald mt-1 block">68% Utilized ($306k)</span>
            </div>
            <div className="p-3 bg-brand-accent-amber/10 rounded-xl text-brand-accent-amber">
              <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
            </div>
          </div>
        </div>

        {/* Dynamic Interactive Rows */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-2">
          {/* Classroom Resource Allocation */}
          <div className="card p-6 bg-brand-bg-secondary border border-brand-border rounded-2xl flex flex-col justify-between">
            <div>
              <h3 className="mb-4 font-display text-lg font-bold text-brand-text-main border-b border-brand-border pb-3 flex items-center gap-2">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" className="text-brand-primary"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
                Classroom Resource Allocations
              </h3>
              <div className="flex flex-col gap-3.5">
                {deptAllocations.map(alloc => (
                  <div key={alloc.id} className="p-3.5 bg-brand-bg-tertiary border border-brand-border rounded-xl flex justify-between items-center transition-all duration-200 hover:border-brand-primary/20">
                    <div>
                      <strong className="text-sm text-brand-text-main block">{alloc.subject}</strong>
                      <span className="text-[11px] text-brand-text-muted mt-0.5 block">Instructor: {alloc.faculty} • Progress: {alloc.syllabus}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-brand-text-subtle">Room:</span>
                      <select 
                        value={alloc.classroom}
                        onChange={(e) => handleClassroomChange(alloc.id, e.target.value)}
                        className="bg-brand-bg-secondary border border-brand-border rounded-lg text-brand-text-main text-[11px] font-bold p-1 px-2 focus:outline-none focus:border-brand-primary cursor-pointer"
                      >
                        <option value="LH-101">LH-101</option>
                        <option value="LH-102">LH-102</option>
                        <option value="LH-203">LH-203</option>
                        <option value="Lab-4">Lab-4</option>
                        <option value="Aud-A">Aud-A</option>
                      </select>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Syllabus Audit Board */}
          <div className="card p-6 bg-brand-bg-secondary border border-brand-border rounded-2xl flex flex-col justify-between">
            <div>
              <h3 className="mb-4 font-display text-lg font-bold text-brand-text-main border-b border-brand-border pb-3 flex items-center gap-2">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" className="text-brand-accent-cyan"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
                Course Syllabus Auditing Desk
              </h3>
              <div className="flex flex-col gap-3.5">
                {deptAudits.map(audit => (
                  <div key={audit.id} className="p-3.5 bg-brand-bg-tertiary border border-brand-border rounded-xl flex justify-between items-center transition-all duration-200 hover:border-brand-primary/20">
                    <div>
                      <strong className="text-sm text-brand-text-main block">{audit.subject}</strong>
                      <span className="text-[11px] text-brand-text-muted mt-0.5 block">Faculty: {audit.faculty} • Syllabus Completed: {audit.progress}</span>
                    </div>
                    {audit.status === 'Approved' ? (
                      <span className="badge bg-brand-accent-emerald/10 text-brand-accent-emerald text-[10px] font-bold px-2.5 py-1 rounded-lg flex items-center gap-1">
                        <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                        Audited
                      </span>
                    ) : (
                      <button 
                        onClick={() => handleApproveAudit(audit.id)}
                        className="btn btn-secondary btn-xs cursor-pointer text-[10px] py-1 px-3"
                      >
                        Sign & Audit
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* AI Projection Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* TF.js Control Center Card */}
          <div className="card p-6 bg-brand-bg-secondary border border-brand-border rounded-2xl flex flex-col justify-between">
            <div>
              <h3 className="mb-4 font-display text-base font-bold text-brand-text-main border-b border-brand-border pb-3 flex items-center gap-2">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" className="text-brand-accent-amber"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
                AI Enrollment Projections (TF.js)
              </h3>
              <p className="text-xs text-brand-text-subtle leading-relaxed">
                Run in-browser Linear Regression to forecast student registrations and syllabus completion ratios for next term.
              </p>
              
              <div className="flex flex-col gap-3 mt-4">
                <div>
                  <label className="text-[10px] font-bold text-brand-text-muted uppercase tracking-wider block">Target Forecast Metric</label>
                  <select
                    value={deptForecastMetric}
                    onChange={(e) => setDeptForecastMetric(e.target.value)}
                    className="w-full bg-brand-bg-tertiary border border-brand-border rounded-xl text-brand-text-main text-xs p-2.5 mt-1 cursor-pointer focus:outline-none focus:border-brand-primary"
                  >
                    <option value="Enrollment">Student Registrations Count</option>
                    <option value="Syllabus">Average Syllabus Completion %</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] font-bold text-brand-text-muted uppercase tracking-wider block">Learning Rate</label>
                    <select
                      value={deptLr}
                      onChange={(e) => setDeptLr(parseFloat(e.target.value))}
                      className="w-full bg-brand-bg-tertiary border border-brand-border rounded-xl text-brand-text-main text-xs p-2 mt-1 cursor-pointer focus:outline-none focus:border-brand-primary"
                    >
                      <option value="0.01">0.01 (Slow)</option>
                      <option value="0.05">0.05 (Default)</option>
                      <option value="0.1">0.10 (Fast)</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-brand-text-muted uppercase tracking-wider block">Training Epochs</label>
                    <select
                      value={deptEpochs}
                      onChange={(e) => setDeptEpochs(parseInt(e.target.value))}
                      className="w-full bg-brand-bg-tertiary border border-brand-border rounded-xl text-brand-text-main text-xs p-2 mt-1 cursor-pointer focus:outline-none focus:border-brand-primary"
                    >
                      <option value="50">50 Epochs</option>
                      <option value="150">150 Epochs</option>
                      <option value="300">300 Epochs</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 border-t border-brand-border/40 pt-4 flex flex-col gap-3">
              <button
                onClick={runDeptTfTraining}
                disabled={deptTfTraining}
                className="btn btn-primary w-full cursor-pointer flex items-center justify-center gap-2"
              >
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={deptTfTraining ? 'animate-spin' : ''}><path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"/></svg>
                {deptTfTraining ? 'Training AI Model...' : 'Train Projection Model'}
              </button>

              <div className="p-3 bg-brand-bg-tertiary border border-brand-border rounded-xl flex flex-col gap-1 text-[11px]">
                <div className="flex justify-between"><span className="text-brand-text-muted">Status:</span><span className="font-bold text-white">{deptTfStatus}</span></div>
                <div className="flex justify-between"><span className="text-brand-text-muted">Regression Formula:</span><span className="font-mono text-brand-accent-amber font-bold">{deptTfEquation}</span></div>
                {deptTfTraining && (
                  <div className="mt-2">
                    <div className="flex justify-between text-[10px] text-brand-text-muted"><span>Loss: {deptTfLossDisp}</span><span>Progress: {deptTfEpochDisp}</span></div>
                    <div className="w-full bg-brand-bg-secondary h-1.5 rounded-full mt-1 overflow-hidden"><div className="bg-brand-primary h-full transition-all duration-100" style={{ width: `${deptTfProgress}%` }}></div></div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Chart Display (takes 2 columns) */}
          <div className="card p-6 bg-brand-bg-secondary border border-brand-border rounded-2xl flex flex-col lg:col-span-2 h-[380px]">
            <h3 className="mb-4 font-display text-base font-bold text-brand-text-main border-b border-brand-border pb-3 shrink-0 flex items-center justify-between">
              <span>Projection Trend Chart</span>
              <span className="text-[10px] text-brand-text-subtle font-mono uppercase">Sepolia Sandbox Consortium Proof</span>
            </h3>
            <div className="flex-1 relative min-h-0">
              <canvas ref={deptCanvasForecastRef}></canvas>
            </div>
          </div>
        </div>

        {/* MODEL UNIVERSITY OVERALL METRICS SECTION (MERGED PREVIOUS DASHBOARD GRAPHICS) */}
        <div className="border-t border-brand-border/40 pt-8 mt-4">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="text-2xl font-display font-bold text-white">Model University Overall Analytics</h2>
              <p className="text-xs text-brand-text-muted mt-0.5">Overall university records, charts, telemetry, and notice boards.</p>
            </div>
          </div>
        </div>

        {/* Telemetry row */}
        <div className="kpi-grid mt-2 animate-fade-in">
          {/* KPI 1: Total Students */}
          <div className="card kpi-card flex justify-between items-center p-6 bg-brand-bg-secondary border border-brand-border rounded-2xl">
            <div className="kpi-details flex flex-col">
              <span className="kpi-label text-xs text-brand-text-subtle font-semibold uppercase tracking-wider">Total Students</span>
              <span className="kpi-value text-2xl font-bold font-display text-brand-text-main mt-1.5">1,528</span>
              <span className="kpi-growth text-brand-accent-emerald text-xs mt-1.5 flex items-center gap-1 font-medium">
                <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="18 15 12 9 6 15"/></svg>
                Active Enrollment
              </span>
            </div>
            <div className="kpi-icon p-3.5 bg-brand-primary/10 rounded-xl text-brand-primary">
              <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>
            </div>
          </div>

          {/* KPI 2: Active Faculty */}
          <div className="card kpi-card flex justify-between items-center p-6 bg-brand-bg-secondary border border-brand-border rounded-2xl">
            <div className="kpi-details flex flex-col">
              <span className="kpi-label text-xs text-brand-text-subtle font-semibold uppercase tracking-wider">Active Faculty</span>
              <span className="kpi-value text-2xl font-bold font-display text-brand-text-main mt-1.5">27</span>
              <span className="kpi-growth text-brand-accent-cyan text-xs mt-1.5 flex items-center gap-1 font-medium">
                Full department roster
              </span>
            </div>
            <div className="kpi-icon p-3.5 bg-brand-accent-cyan/10 rounded-xl text-brand-accent-cyan">
              <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            </div>
          </div>

          {/* KPI 3: Departments */}
          <div className="card kpi-card flex justify-between items-center p-6 bg-brand-bg-secondary border border-brand-border rounded-2xl">
            <div className="kpi-details flex flex-col">
              <span className="kpi-label text-xs text-brand-text-subtle font-semibold uppercase tracking-wider">Departments</span>
              <span className="kpi-value text-2xl font-bold font-display text-brand-text-main mt-1.5">5 Divisions</span>
              <span className="kpi-growth text-brand-accent-emerald text-xs mt-1.5 flex items-center gap-1 font-medium">
                Academics & Research
              </span>
            </div>
            <div className="kpi-icon p-3.5 bg-brand-accent-emerald/10 rounded-xl text-brand-accent-emerald">
              <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
            </div>
          </div>

          {/* KPI 4: Pending Admissions */}
          <div className="card kpi-card flex justify-between items-center p-6 bg-brand-bg-secondary border border-brand-border rounded-2xl">
            <div className="kpi-details flex flex-col">
              <span className="kpi-label text-xs text-brand-text-subtle font-semibold uppercase tracking-wider">Pending Admissions</span>
              <span className="kpi-value text-2xl font-bold font-display text-brand-text-main mt-1.5">142</span>
              <span className="kpi-growth text-brand-accent-amber text-xs mt-1.5 flex items-center gap-1 font-medium">
                Applications review
              </span>
            </div>
            <div className="kpi-icon p-3.5 bg-brand-accent-amber/10 rounded-xl text-brand-accent-amber">
              <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 9l3 3-3 3"/><path d="M15 12h7"/></svg>
            </div>
          </div>

          {/* KPI 5: Revenue */}
          <div className="card kpi-card flex justify-between items-center p-6 bg-brand-bg-secondary border border-brand-border rounded-2xl">
            <div className="kpi-details flex flex-col">
              <span className="kpi-label text-xs text-brand-text-subtle font-semibold uppercase tracking-wider">Revenue</span>
              <span className="kpi-value text-2xl font-bold font-display text-brand-text-main mt-1.5">$2.16M</span>
              <span className="kpi-growth text-brand-accent-emerald text-xs mt-1.5 flex items-center gap-1 font-medium">
                Current fiscal year
              </span>
            </div>
            <div className="kpi-icon p-3.5 bg-brand-accent-ruby/10 rounded-xl text-brand-accent-ruby">
              <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
            </div>
          </div>

          {/* KPI 6: Scholarships */}
          <div className="card kpi-card flex justify-between items-center p-6 bg-brand-bg-secondary border border-brand-border rounded-2xl">
            <div className="kpi-details flex flex-col">
              <span className="kpi-label text-xs text-brand-text-subtle font-semibold uppercase tracking-wider">Scholarships</span>
              <span className="kpi-value text-2xl font-bold font-display text-brand-text-main mt-1.5">$180k</span>
              <span className="kpi-growth text-brand-primary text-xs mt-1.5 flex items-center gap-1 font-medium">
                Allocated grants
              </span>
            </div>
            <div className="kpi-icon p-3.5 bg-brand-primary/10 rounded-xl text-brand-primary">
              <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="8" r="7"/><path d="M8.21 13.89L7 23l5-3 5 3-1.21-9.12"/></svg>
            </div>
          </div>

          {/* KPI 7: Placement Rate */}
          <div className="card kpi-card flex justify-between items-center p-6 bg-brand-bg-secondary border border-brand-border rounded-2xl">
            <div className="kpi-details flex flex-col">
              <span className="kpi-label text-xs text-brand-text-subtle font-semibold uppercase tracking-wider">Placement Rate</span>
              <span className="kpi-value text-2xl font-bold font-display text-brand-text-main mt-1.5">94.2%</span>
              <span className="kpi-growth text-brand-accent-emerald text-xs mt-1.5 flex items-center gap-1 font-medium">
                Senior graduating class
              </span>
            </div>
            <div className="kpi-icon p-3.5 bg-brand-accent-emerald/10 rounded-xl text-brand-accent-emerald">
              <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5"/></svg>
            </div>
          </div>

          {/* KPI 8: Library Usage */}
          <div className="card kpi-card flex justify-between items-center p-6 bg-brand-bg-secondary border border-brand-border rounded-2xl">
            <div className="kpi-details flex flex-col">
              <span className="kpi-label text-xs text-brand-text-subtle font-semibold uppercase tracking-wider">Library Usage</span>
              <span className="kpi-value text-2xl font-bold font-display text-brand-text-main mt-1.5">88%</span>
              <span className="kpi-growth text-brand-accent-cyan text-xs mt-1.5 flex items-center gap-1 font-medium">
                Resource utilization
              </span>
            </div>
            <div className="kpi-icon p-3.5 bg-brand-accent-cyan/10 rounded-xl text-brand-accent-cyan">
              <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2zM22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
            </div>
          </div>

          {/* KPI 9: Hostel Occupancy */}
          <div className="card kpi-card flex justify-between items-center p-6 bg-brand-bg-secondary border border-brand-border rounded-2xl">
            <div className="kpi-details flex flex-col">
              <span className="kpi-label text-xs text-brand-text-subtle font-semibold uppercase tracking-wider">Hostel Occupancy</span>
              <span className="kpi-value text-2xl font-bold font-display text-brand-text-main mt-1.5">85%</span>
              <span className="kpi-growth text-brand-accent-amber text-xs mt-1.5 flex items-center gap-1 font-medium">
                Resident capacity
              </span>
            </div>
            <div className="kpi-icon p-3.5 bg-brand-accent-amber/10 rounded-xl text-brand-accent-amber">
              <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
            </div>
          </div>
        </div>

        {/* Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-2">
          <div className="card p-6 bg-brand-bg-secondary border border-brand-border rounded-2xl flex flex-col h-[380px]">
            <h3 className="mb-4 font-display text-lg font-bold text-brand-text-main shrink-0">Student Growth</h3>
            <div className="flex-1 relative min-h-0">
              <canvas ref={canvasEnrollmentRef}></canvas>
            </div>
          </div>
          
          <div className="card p-6 bg-brand-bg-secondary border border-brand-border rounded-2xl flex flex-col h-[380px]">
            <h3 className="mb-4 font-display text-lg font-bold text-brand-text-main shrink-0">Attendance Trend Chart</h3>
            <div className="flex-1 relative min-h-0">
              <canvas ref={canvasAttendanceRef}></canvas>
            </div>
          </div>
        </div>

        {/* Row 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="card p-6 bg-brand-bg-secondary border border-brand-border rounded-2xl flex flex-col h-[380px]">
            <h3 className="mb-4 font-display text-lg font-bold text-brand-text-main shrink-0">Faculty Distribution</h3>
            <div className="flex-1 relative min-h-0">
              <canvas ref={canvasDeptRef}></canvas>
            </div>
          </div>
          
          <div className="card p-6 bg-brand-bg-secondary border border-brand-border rounded-2xl flex flex-col h-[380px]">
            <h3 className="mb-4 font-display text-lg font-bold text-brand-text-main shrink-0">Course Enrollment Analytics</h3>
            <div className="flex-1 relative min-h-0">
              <canvas ref={canvasCourseEnrollRef}></canvas>
            </div>
          </div>
        </div>

        {/* Row 3 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Notices */}
          <div className="card p-6 bg-brand-bg-secondary border border-brand-border rounded-2xl flex flex-col h-[380px]">
            <h3 className="mb-4 font-display text-base font-bold m-0 border-b border-brand-border pb-3 shrink-0 text-brand-text-main flex justify-between items-center">
              <span>Recent Notices</span>
              <Link href="/announcements" className="text-xs text-brand-primary hover:text-brand-primary-hover font-semibold">View All</Link>
            </h3>
            <div className="flex-1 overflow-y-auto flex flex-col gap-4 pr-1 min-h-0 mt-3">
              {announcements.slice(0, 3).map((ann, i) => (
                <div key={ann.id || i} className="pl-3 border-l-2" style={{ borderColor: ann.color || 'var(--color-brand-primary)' }}>
                  <div className="flex justify-between items-center text-[0.7rem] text-brand-text-subtle">
                    <span className="badge bg-brand-bg-tertiary text-brand-text-main text-[0.65rem] px-1.5 py-0.5 rounded">{ann.tag}</span>
                    <span className="text-[0.65rem] text-brand-text-subtle">{ann.date}</span>
                  </div>
                  <h4 className="my-1 text-xs font-semibold text-brand-text-main">{ann.title}</h4>
                  <p className="text-[0.75rem] text-brand-text-muted leading-relaxed m-0 truncate">{ann.content}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming Exams */}
          <div className="card p-6 bg-brand-bg-secondary border border-brand-border rounded-2xl flex flex-col h-[380px]">
            <h3 className="mb-4 font-display text-base font-bold m-0 border-b border-brand-border pb-3 shrink-0 text-brand-text-main flex justify-between items-center">
              <span>Upcoming Exams</span>
              <Link href="/exams" className="text-xs text-brand-primary hover:text-brand-primary-hover font-semibold">View All</Link>
            </h3>
            <div className="flex-1 overflow-y-auto flex flex-col gap-3 pr-1 min-h-0 mt-3">
              {exams.slice(0, 3).map((ex, idx) => (
                <div key={idx} className="p-3 border border-brand-border rounded-xl bg-brand-bg-tertiary flex justify-between items-center transition-all duration-200 hover:border-brand-primary/30">
                  <div>
                    <code className="text-brand-primary font-mono font-bold text-xs">{ex.code}</code>
                    <h4 className="mt-1 mb-0.5 font-display font-medium text-brand-text-main text-xs">{ex.name}</h4>
                    <span className="text-[10px] text-brand-text-muted">{ex.date}</span>
                  </div>
                  <span className="badge bg-brand-accent-cyan/10 text-brand-accent-cyan text-[0.7rem] px-2 py-0.5 rounded font-semibold">{ex.venue}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Admissions */}
          <div className="card p-6 bg-brand-bg-secondary border border-brand-border rounded-2xl flex flex-col h-[380px]">
            <h3 className="mb-4 font-display text-base font-bold m-0 border-b border-brand-border pb-3 shrink-0 text-brand-text-main flex justify-between items-center">
              <span>Recent Admissions</span>
              <Link href="/students" className="text-xs text-brand-primary hover:text-brand-primary-hover font-semibold">View Registry</Link>
            </h3>
            <div className="flex-1 overflow-y-auto flex flex-col gap-3 pr-1 min-h-0 mt-3">
              {students.slice(-4).reverse().map((s, idx) => (
                <div key={idx} className="p-2.5 bg-brand-bg-tertiary border border-brand-border rounded-xl flex items-center gap-3">
                  <img src={s.avatar} className="w-8 h-8 rounded-full object-cover border border-brand-border shrink-0" alt="" />
                  <div className="min-w-0 flex-1">
                    <strong className="text-xs text-brand-text-main block truncate font-semibold">{s.name}</strong>
                    <span className="text-[10px] text-brand-text-muted block truncate">{s.dept} Dept • GPA {s.gpa.toFixed(2)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (currentUser.role === 'hod') {
    const handleApproveGrade = (id) => {
      setHodPendingApprovals(prev => prev.map(a => a.id === id ? { ...a, status: 'Approved' } : a));
      alert('Grade package has been officially signed and synchronized to ledger.');
    };

    const handleReallocate = (id, newFaculty) => {
      setHodAllocations(prev => prev.map(a => a.id === id ? { ...a, faculty: newFaculty } : a));
      alert(`Subject allocation updated: Assigned to ${newFaculty}`);
    };

    return (
      <div className="flex flex-col gap-6 md:gap-8">
        {/* Welcome Section */}
        <div className="page-header animate-fade-in flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-display font-bold text-brand-text-main">HOD Control Center</h1>
            <p className="text-brand-text-muted mt-1 text-sm">Welcome back, {currentUser.name}. Manage department faculty, students, subject allocations, and grade approvals.</p>
          </div>
          <div className="flex gap-2">
            <Link className="btn btn-secondary btn-sm cursor-pointer flex items-center gap-1.5" href="/subjects">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
              Manage Subjects
            </Link>
            <Link className="btn btn-primary btn-sm cursor-pointer flex items-center gap-1.5" href="/department-reports">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="21" y1="12" x2="3" y2="12"/><line x1="12" y1="3" x2="12" y2="21"/></svg>
              View Reports
            </Link>
          </div>
        </div>

        {/* Dashboard KPIs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-fade-in mt-2">
          <div className="card p-5 bg-brand-bg-secondary border border-brand-border rounded-2xl flex items-center justify-between">
            <div>
              <span className="text-brand-text-muted text-xs font-semibold">Active Faculty</span>
              <span className="block text-2xl font-bold font-display text-brand-primary mt-1">{faculty.length} Members</span>
              <span className="text-[0.7rem] text-brand-accent-emerald mt-1 block">Full Department Roster</span>
            </div>
            <div className="p-3 bg-brand-primary/10 rounded-xl text-brand-primary">
              <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>
            </div>
          </div>
          <div className="card p-5 bg-brand-bg-secondary border border-brand-border rounded-2xl flex items-center justify-between">
            <div>
              <span className="text-brand-text-muted text-xs font-semibold">Department Students</span>
              <span className="block text-2xl font-bold font-display text-brand-accent-cyan mt-1">{students.length} Enrolled</span>
              <span className="text-[0.7rem] text-brand-accent-emerald mt-1 block">94% Attendance Rate</span>
            </div>
            <div className="p-3 bg-brand-accent-cyan/10 rounded-xl text-brand-accent-cyan">
              <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
            </div>
          </div>
          <div className="card p-5 bg-brand-bg-secondary border border-brand-border rounded-2xl flex items-center justify-between">
            <div>
              <span className="text-brand-text-muted text-xs font-semibold">Allocated Classes</span>
              <span className="block text-2xl font-bold font-display text-brand-accent-emerald mt-1">{hodAllocations.length} Subjects</span>
              <span className="text-[0.7rem] text-brand-text-subtle mt-1 block">100% Curricular Coverage</span>
            </div>
            <div className="p-3 bg-brand-accent-emerald/10 rounded-xl text-brand-accent-emerald">
              <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M4 4.5A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5v-15z"/></svg>
            </div>
          </div>
          <div className="card p-5 bg-brand-bg-secondary border border-brand-border rounded-2xl flex items-center justify-between">
            <div>
              <span className="text-brand-text-muted text-xs font-semibold">Pending Grade Approvals</span>
              <span className="block text-2xl font-bold font-display text-brand-accent-ruby mt-1">
                {hodPendingApprovals.filter(a => a.status === 'Pending').length} Pending
              </span>
              <span className="text-[0.7rem] text-brand-accent-amber mt-1 block">Requires Signature</span>
            </div>
            <div className="p-3 bg-brand-accent-ruby/10 rounded-xl text-brand-accent-ruby">
              <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
            </div>
          </div>
        </div>

        {/* Dashboard Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-2 animate-fade-in">
          
          {/* Left Column: Subject Allocations & Faculty Workload */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            
            {/* Subject Allocation */}
            <div className="card p-6 bg-brand-bg-secondary border border-brand-border rounded-2xl flex flex-col">
              <div className="flex justify-between items-center border-b border-brand-border pb-3 mb-4">
                <h3 className="font-display text-base font-bold text-brand-text-main m-0">Subject & Faculty Allocation</h3>
                <span className="text-xs text-brand-text-muted">CS Department</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-brand-border text-brand-text-subtle font-semibold">
                      <th className="pb-2">Subject Name</th>
                      <th className="pb-2">Assigned Professor</th>
                      <th className="pb-2">Weekly Hours</th>
                      <th className="pb-2">Syllabus Covered</th>
                      <th className="pb-2 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {hodAllocations.map((alloc) => (
                      <tr key={alloc.id} className="border-b border-brand-border/40 hover:bg-white/[0.01] transition-all">
                        <td className="py-3 font-semibold text-brand-text-main">{alloc.subject}</td>
                        <td className="py-3 text-brand-text-muted">{alloc.faculty}</td>
                        <td className="py-3 text-brand-text-muted font-mono">{alloc.hours} hrs</td>
                        <td className="py-3">
                          <div className="flex items-center gap-2">
                            <div className="bg-brand-bg-primary h-1.5 w-16 rounded-full overflow-hidden border border-brand-border/50">
                              <div className="bg-brand-primary h-full rounded-full" style={{ width: alloc.syllabus }}></div>
                            </div>
                            <span className="font-mono text-[10px] text-brand-text-main">{alloc.syllabus}</span>
                          </div>
                        </td>
                        <td className="py-3 text-right relative">
                          <button 
                            className="text-brand-text-muted hover:text-white p-1.5 rounded-lg transition-all focus:bg-brand-bg-tertiary cursor-pointer inline-flex items-center justify-center"
                            onClick={() => setHodKebabId(hodKebabId === alloc.id ? null : alloc.id)}
                          >
                            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/></svg>
                          </button>
                          {hodKebabId === alloc.id && (
                            <div className="absolute right-0 top-9 bg-brand-bg-tertiary border border-brand-border rounded-xl shadow-2xl z-[100] w-40 text-left p-1.5 animate-scale-up">
                              <button 
                                className="w-full text-left px-3 py-1.5 text-xs font-semibold text-brand-text-main hover:bg-white/[0.05] rounded-lg cursor-pointer"
                                onClick={() => { setHodKebabId(null); handleReallocate(alloc.id, 'Prof. Evelyn Sterling'); }}
                              >
                                Reassign to Sterling
                              </button>
                              <button 
                                className="w-full text-left px-3 py-1.5 text-xs font-semibold text-brand-text-main hover:bg-white/[0.05] rounded-lg cursor-pointer"
                                onClick={() => { setHodKebabId(null); handleReallocate(alloc.id, 'Prof. Marcus Chen'); }}
                              >
                                Reassign to Chen
                              </button>
                              <button 
                                className="w-full text-left px-3 py-1.5 text-xs font-semibold text-brand-accent-cyan hover:bg-brand-accent-cyan/15 rounded-lg cursor-pointer"
                                onClick={() => { setHodKebabId(null); alert(`CS Department Audit completed for: ${alloc.subject}`); }}
                              >
                                Audit Syllabus
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Department Faculty Overview */}
            <div className="card p-6 bg-brand-bg-secondary border border-brand-border rounded-2xl flex flex-col">
              <div className="flex justify-between items-center border-b border-brand-border pb-3 mb-4">
                <h3 className="font-display text-base font-bold text-brand-text-main m-0">Departmental Faculty Overview</h3>
                <Link href="/faculty" className="text-xs text-brand-primary hover:text-brand-primary-hover font-semibold">View All Faculty &rarr;</Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {faculty.slice(0, 4).map((f) => (
                  <div key={f.id} className="p-3 bg-brand-bg-tertiary border border-brand-border rounded-xl flex items-center gap-3">
                    <img src={f.avatar || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150"} alt="" className="w-10 h-10 rounded-full border border-brand-border object-cover shrink-0" />
                    <div className="min-w-0 flex-1">
                      <strong className="text-xs text-brand-text-main block truncate font-semibold">{f.name}</strong>
                      <span className="text-[10px] text-brand-text-muted block truncate">Designation: {f.designation || 'Lecturer'}</span>
                      <span className="text-[10px] text-brand-accent-cyan block font-mono mt-0.5 truncate">{f.email}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Right Column: Grade Approvals & Department Bulletins */}
          <div className="flex flex-col gap-6">
            
            {/* Grade Approval Queue */}
            <div className="card p-6 bg-brand-bg-secondary border border-brand-border rounded-2xl flex flex-col">
              <div className="flex justify-between items-center border-b border-brand-border pb-3 mb-4">
                <h3 className="font-display text-base font-bold text-brand-text-main m-0">Grade Approval Queue</h3>
                <Link href="/marks-approval" className="text-xs text-brand-primary hover:text-brand-primary-hover font-semibold">View Detail &rarr;</Link>
              </div>
              <div className="flex flex-col gap-3">
                {hodPendingApprovals.map((appr) => (
                  <div key={appr.id} className="p-3.5 bg-brand-bg-tertiary border border-brand-border rounded-xl flex flex-col gap-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <strong className="text-xs text-brand-text-main block font-semibold">{appr.subject}</strong>
                        <span className="text-[10px] text-brand-text-subtle">By: {appr.faculty}</span>
                      </div>
                      <span className={`badge text-[9px] px-1.5 py-0.5 rounded font-mono ${
                        appr.status === 'Approved' 
                          ? 'bg-brand-accent-emerald/20 text-brand-accent-emerald' 
                          : 'bg-brand-accent-amber/20 text-brand-accent-amber'
                      }`}>
                        {appr.status}
                      </span>
                    </div>
                    {appr.status === 'Pending' && (
                      <button 
                        onClick={() => handleApproveGrade(appr.id)}
                        className="btn btn-primary btn-sm justify-center py-1 mt-1 text-[10px] cursor-pointer"
                      >
                        Approve Grades & Sign
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Department Reports Quick Stats */}
            <div className="card p-6 bg-brand-bg-secondary border border-brand-border rounded-2xl flex flex-col gap-4">
              <h3 className="m-0 font-display text-base font-bold text-brand-text-main border-b border-brand-border pb-3">Department Summary</h3>
              <div className="flex flex-col gap-3">
                <div>
                  <div className="flex justify-between text-[10px] font-semibold mb-1 text-brand-text-muted">
                    <span>Syllabus Covered (CS Department)</span>
                    <span>72%</span>
                  </div>
                  <div className="bg-brand-bg-primary h-2 rounded-full overflow-hidden w-full border border-brand-border">
                    <div className="bg-brand-primary h-full rounded-full" style={{ width: '72%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-[10px] font-semibold mb-1 text-brand-text-muted">
                    <span>Attendance Rate Average</span>
                    <span>88%</span>
                  </div>
                  <div className="bg-brand-bg-primary h-2 rounded-full overflow-hidden w-full border border-brand-border">
                    <div className="bg-brand-accent-cyan h-full rounded-full" style={{ width: '88%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-[10px] font-semibold mb-1 text-brand-text-muted">
                    <span>Student Pass Rate Indicator</span>
                    <span>94%</span>
                  </div>
                  <div className="bg-brand-bg-primary h-2 rounded-full overflow-hidden w-full border border-brand-border">
                    <div className="bg-brand-accent-emerald h-full rounded-full" style={{ width: '94%' }}></div>
                  </div>
                </div>
              </div>
            </div>

          </div>

        </div>

        {/* HOD TensorFlow Forecasting */}
        <div className="card p-6 bg-brand-bg-secondary border border-brand-border rounded-2xl animate-fade-in">
          <div className="flex justify-between items-center border-b border-brand-border pb-4 mb-5">
            <div>
              <h3 className="font-display flex items-center gap-2 m-0 text-lg font-bold text-brand-text-main">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" className="text-brand-primary" strokeWidth="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                AI Department Performance & CGPA Forecasting
              </h3>
              <p className="text-[0.85rem] text-brand-text-muted mt-1 m-0">Train a neural network model to forecast department CGPA and Syllabus Coverage parameters using TensorFlow.js.</p>
            </div>
            <span className="badge bg-brand-primary/10 text-brand-primary font-semibold text-xs px-2.5 py-1 rounded">TensorFlow.js Enabled</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] gap-8">
            <div className="flex flex-col gap-5 border-r border-brand-border pr-8 max-md:border-r-0 max-md:pr-0">
              
              <div>
                <label className="block text-[0.825rem] text-brand-text-subtle mb-2">Forecast Target Metric</label>
                <select 
                  value={hodForecastMetric} 
                  onChange={(e) => setHodForecastMetric(e.target.value)}
                  className="w-full bg-brand-bg-tertiary border border-brand-border text-brand-text-main p-2.5 rounded-xl outline-none cursor-pointer text-xs"
                >
                  <option value="CGPA">Average CGPA (3.0 - 4.0)</option>
                  <option value="Syllabus">Curricular Coverage Rate (0% - 100%)</option>
                </select>
              </div>

              <div>
                <label className="block text-[0.825rem] text-brand-text-subtle mb-2">Optimizer Learning Rate</label>
                <select 
                  value={hodLr} 
                  onChange={(e) => setHodLr(parseFloat(e.target.value))}
                  className="w-full bg-brand-bg-tertiary border border-brand-border text-brand-text-main p-2.5 rounded-xl outline-none cursor-pointer text-xs"
                >
                  <option value="0.01">0.01 (Slow & Stable)</option>
                  <option value="0.05">0.05 (Default)</option>
                  <option value="0.1">0.10 (Fast)</option>
                </select>
              </div>

              <div>
                <div className="flex justify-between text-[0.825rem] mb-2">
                  <span className="text-brand-text-subtle">Training Epochs</span>
                  <span className="text-brand-text-muted">{hodEpochs} epochs</span>
                </div>
                <input 
                  type="range" 
                  min="50" 
                  max="300" 
                  step="50" 
                  value={hodEpochs} 
                  onChange={(e) => setHodEpochs(parseInt(e.target.value))}
                  className="w-full accent-brand-primary cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-[0.825rem] text-brand-text-subtle mb-2">Forecast Horizon</label>
                <select 
                  value={hodHorizon}
                  onChange={(e) => setHodHorizon(parseInt(e.target.value))}
                  className="w-full bg-brand-bg-tertiary border border-brand-border text-brand-text-main p-2.5 rounded-xl outline-none cursor-pointer text-xs"
                >
                  <option value="1">1 Term (2026-B)</option>
                  <option value="2">2 Terms (2026-B & 2027-A)</option>
                  <option value="3">3 Terms (Up to 2027-B)</option>
                </select>
              </div>

              <button 
                onClick={runHodTfTraining}
                disabled={hodTfTraining}
                className="btn btn-primary w-full justify-center flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                {hodTfTraining ? 'Training Model...' : 'Run TF Analytics'}
              </button>

              {hodTfTraining && (
                <div className="bg-brand-bg-tertiary p-3 rounded-xl border border-brand-border">
                  <div className="flex justify-between text-[0.8rem] mb-1.5">
                    <span className="text-brand-text-subtle">Epoch:</span>
                    <span className="font-semibold text-brand-text-main">{hodTfEpochDisp}</span>
                  </div>
                  <div className="flex justify-between text-[0.8rem] mb-3">
                    <span className="text-brand-text-subtle">Training Loss:</span>
                    <span className="font-mono text-brand-accent-amber">{hodTfLossDisp}</span>
                  </div>
                  <div className="bg-brand-bg-primary rounded-full h-1.5 overflow-hidden w-full">
                    <div className="bg-brand-primary h-full transition-[width] duration-100" style={{ width: `${hodTfProgress}%` }}></div>
                  </div>
                </div>
              )}
              
              <div className="bg-brand-bg-tertiary p-3.5 rounded-xl border border-brand-border text-[0.825rem] leading-normal">
                <div className="text-brand-text-main font-semibold mb-1">Last Projection Metrics:</div>
                <div>Status: <span className={hodTfStatus === 'Untrained' ? 'text-brand-accent-cyan font-bold' : 'text-brand-accent-emerald font-bold'}>{hodTfStatus}</span></div>
                <div>Equation Fit: <span className="text-brand-text-muted font-mono">{hodTfEquation}</span></div>
              </div>
            </div>

            <div className="flex flex-col h-[350px]">
              <div className="flex justify-between mb-3 items-center">
                <h4 className="text-[0.95rem] font-semibold text-brand-text-main m-0">Projection Curve</h4>
                <span className="text-[0.75rem] text-brand-text-muted">Historical index vs AI Projection</span>
              </div>
              <div className="chart-wrapper flex-1 relative">
                <canvas ref={hodCanvasForecastRef}></canvas>
              </div>
            </div>
          </div>
        </div>

      </div>
    );
  }

  if (currentUser.role === 'student') {
    const s = students.find(item => item.email.toLowerCase() === currentUser.email.toLowerCase()) || {
      name: currentUser.name,
      id: 'STU038',
      dept: 'CS',
      gpa: 3.75,
      attendance: 95,
      semester: 4,
      feeTotal: 4500,
      feePaid: 3500,
      courses: ['CS101', 'CS202']
    };
    const balance = s.feeTotal - s.feePaid;
    return (
      <div className="flex flex-col gap-6 md:gap-8">
        <div className="page-header animate-fade-in flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-display font-bold text-brand-text-main">Student Portal</h1>
            <p className="text-brand-text-muted mt-1 text-sm">Welcome back, {s.name}. Review your academic records, schedules, and statements.</p>
          </div>
          <Link className="btn btn-secondary btn-sm cursor-pointer flex items-center gap-1.5" href="/finance">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
            Pay Tuition Fees
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-fade-in mt-2">
          <div className="card p-5 bg-brand-bg-secondary border border-brand-border rounded-2xl flex items-center justify-between">
            <div>
              <span className="text-brand-text-muted text-xs font-semibold">Current CGPA</span>
              <span className="block text-2xl font-bold font-display text-brand-primary mt-1">{s.gpa.toFixed(2)} / 4.00</span>
              <span className="text-[0.7rem] text-brand-accent-emerald mt-1 block">Excellent Performance</span>
            </div>
            <div className="p-3 bg-brand-primary/10 rounded-xl text-brand-primary">
              <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5"/></svg>
            </div>
          </div>
          <div className="card p-5 bg-brand-bg-secondary border border-brand-border rounded-2xl flex items-center justify-between">
            <div>
              <span className="text-brand-text-muted text-xs font-semibold">Attendance Rate</span>
              <span className="block text-2xl font-bold font-display text-brand-accent-emerald mt-1">{s.attendance}%</span>
              <span className="text-[0.7rem] text-brand-accent-emerald mt-1 block">Good Standings</span>
            </div>
            <div className="p-3 bg-brand-accent-emerald/10 rounded-xl text-brand-accent-emerald">
              <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            </div>
          </div>
          <div className="card p-5 bg-brand-bg-secondary border border-brand-border rounded-2xl flex items-center justify-between">
            <div>
              <span className="text-brand-text-muted text-xs font-semibold">Enrolled Classes</span>
              <span className="block text-2xl font-bold font-display text-brand-accent-cyan mt-1">{s.courses?.length || 0} Subjects</span>
              <span className="text-[0.7rem] text-brand-text-subtle mt-1 block">Semester {s.semester} Registry</span>
            </div>
            <div className="p-3 bg-brand-accent-cyan/10 rounded-xl text-brand-accent-cyan">
              <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M4 4.5A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5v-15z"/></svg>
            </div>
          </div>
          <div className="card p-5 bg-brand-bg-secondary border border-brand-border rounded-2xl flex items-center justify-between">
            <div>
              <span className="text-brand-text-muted text-xs font-semibold">Remaining Fees Due</span>
              <span className="block text-2xl font-bold font-display mt-1 text-brand-accent-amber">${balance.toLocaleString()}</span>
              <span className={`text-[0.7rem] mt-1 block ${balance > 0 ? 'text-brand-accent-ruby font-semibold' : 'text-brand-accent-emerald font-semibold'}`}>{balance > 0 ? 'Pending Payment' : 'Fees Paid'}</span>
            </div>
            <div className="p-3 bg-brand-accent-amber/10 rounded-xl text-brand-accent-amber">
              <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-2 animate-fade-in">
          <div className="card p-6 bg-brand-bg-secondary border border-brand-border rounded-2xl">
            <h3 className="mb-4 font-display text-lg font-bold text-brand-text-main border-b border-brand-border pb-3">My Academic Timetable</h3>
            <div className="flex flex-col gap-3">
              {(!s.courses || s.courses.length === 0) ? (
                <p className="text-brand-text-muted text-xs text-center py-6">No enrolled courses identified.</p>
              ) : (
                s.courses.map(code => {
                  const c = courses.find(item => item.code === code);
                  const fac = c ? faculty.find(f => f.id === c.facultyId) : null;
                  return (
                    <div key={code} className="p-4 bg-brand-bg-tertiary border border-brand-border rounded-xl flex justify-between items-center gap-3">
                      <div>
                        <strong className="text-sm text-brand-text-main block">{c ? c.title : 'Course Details'}</strong>
                        <span className="text-xs text-brand-text-muted">{c ? `${c.code} • ${c.credits} Credits` : code}</span>
                      </div>
                      <div className="text-right">
                        <span className="badge bg-brand-primary/10 text-brand-primary text-xs px-2 py-0.5 rounded font-mono">{fac ? fac.name : 'TBD'}</span>
                        <div className="text-[0.7rem] text-brand-text-subtle mt-1">Mon/Wed 10:00 AM</div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          <div className="card p-6 bg-brand-bg-secondary border border-brand-border rounded-2xl">
            <h3 className="mb-4 font-display text-lg font-bold text-brand-text-main border-b border-brand-border pb-3">Campus Notices</h3>
            <div className="flex flex-col gap-4">
              {announcements.slice(0, 3).map((ann, i) => (
                <div key={i} className="pl-3 border-l-2" style={{ borderColor: ann.color || 'var(--color-brand-primary)' }}>
                  <div className="flex justify-between items-center text-[0.7rem] text-brand-text-subtle">
                    <span className="font-bold text-brand-text-main">{ann.tag}</span>
                    <span>{ann.date}</span>
                  </div>
                  <h4 className="text-xs font-semibold text-brand-text-main my-1">{ann.title}</h4>
                  <p className="text-[0.75rem] text-brand-text-muted leading-relaxed m-0 truncate">{ann.content}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (currentUser.role === 'faculty') {
    return (
      <div className="flex flex-col gap-6 md:gap-8">
        <div className="page-header animate-fade-in flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-display font-bold text-brand-text-main">Faculty Portal</h1>
            <p className="text-brand-text-muted mt-1 text-sm">Welcome back, {currentUser.name}. Manage class registers, syllabus metrics, and course rosters.</p>
          </div>
          <Link className="btn btn-secondary btn-sm cursor-pointer flex items-center gap-1.5" href="/attendance">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
            Mark Attendance
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-fade-in mt-2">
          <div className="card p-5 bg-brand-bg-secondary border border-brand-border rounded-2xl flex items-center justify-between">
            <div>
              <span className="text-brand-text-muted text-xs font-semibold">Active Classes</span>
              <span className="block text-2xl font-bold font-display text-brand-primary mt-1">3 Subjects</span>
              <span className="text-[0.7rem] text-brand-text-subtle mt-1 block">Teaching Workload</span>
            </div>
            <div className="p-3 bg-brand-primary/10 rounded-xl text-brand-primary">
              <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M4 4.5A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5v-15z"/></svg>
            </div>
          </div>
          <div className="card p-5 bg-brand-bg-secondary border border-brand-border rounded-2xl flex items-center justify-between">
            <div>
              <span className="text-brand-text-muted text-xs font-semibold">Assigned Majors</span>
              <span className="block text-2xl font-bold font-display text-brand-accent-cyan mt-1">{students.length} Majors</span>
              <span className="text-[0.7rem] text-brand-accent-emerald mt-1 block">Full Roster</span>
            </div>
            <div className="p-3 bg-brand-accent-cyan/10 rounded-xl text-brand-accent-cyan">
              <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>
            </div>
          </div>
          <div className="card p-5 bg-brand-bg-secondary border border-brand-border rounded-2xl flex items-center justify-between">
            <div>
              <span className="text-brand-text-muted text-xs font-semibold">Average Attendance</span>
              <span className="block text-2xl font-bold font-display text-brand-accent-emerald mt-1">{avgAttendance}%</span>
              <span className="text-[0.7rem] text-brand-accent-emerald mt-1 block">Stable Lecture Rates</span>
            </div>
            <div className="p-3 bg-brand-accent-emerald/10 rounded-xl text-brand-accent-emerald">
              <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            </div>
          </div>
          <div className="card p-5 bg-brand-bg-secondary border border-brand-border rounded-2xl flex items-center justify-between">
            <div>
              <span className="text-brand-text-muted text-xs font-semibold">Notice Reach</span>
              <span className="block text-2xl font-bold font-display text-brand-accent-amber mt-1">High (84%)</span>
              <span className="text-[0.7rem] text-brand-text-subtle mt-1 block">Official Notice Broadcasts</span>
            </div>
            <div className="p-3 bg-brand-accent-amber/10 rounded-xl text-brand-accent-amber">
              <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-2 animate-fade-in">
          <div className="card p-6 bg-brand-bg-secondary border border-brand-border rounded-2xl">
            <h3 className="mb-4 font-display text-lg font-bold text-brand-text-main border-b border-brand-border pb-3">My Classes & Rosters</h3>
            <div className="flex flex-col gap-3">
              <div className="p-4 bg-brand-bg-tertiary border border-brand-border rounded-xl flex justify-between items-center">
                <div>
                  <strong className="text-sm text-brand-text-main block">CS101 - Intro to Programming</strong>
                  <span className="text-xs text-brand-text-muted">CS Department • Credit hours: 3</span>
                </div>
                <Link className="btn btn-secondary btn-sm" href="/exams">Enter Grades</Link>
              </div>
              <div className="p-4 bg-brand-bg-tertiary border border-brand-border rounded-xl flex justify-between items-center">
                <div>
                  <strong className="text-sm text-brand-text-main block">CS202 - Data Structures</strong>
                  <span className="text-xs text-brand-text-muted">CS Department • Credit hours: 4</span>
                </div>
                <Link className="btn btn-secondary btn-sm" href="/exams">Enter Grades</Link>
              </div>
            </div>
          </div>

          <div className="card p-6 bg-brand-bg-secondary border border-brand-border rounded-2xl">
            <h3 className="mb-4 font-display text-lg font-bold text-brand-text-main border-b border-brand-border pb-3">Department Bulletins</h3>
            <div className="flex flex-col gap-4">
              {announcements.slice(0, 3).map((ann, i) => (
                <div key={i} className="pl-3 border-l-2" style={{ borderColor: ann.color || 'var(--color-brand-primary)' }}>
                  <div className="flex justify-between items-center text-[0.7rem] text-brand-text-subtle">
                    <span className="font-bold text-brand-text-main">{ann.tag}</span>
                    <span>{ann.date}</span>
                  </div>
                  <h4 className="text-xs font-semibold text-brand-text-main my-1">{ann.title}</h4>
                  <p className="text-[0.75rem] text-brand-text-muted leading-relaxed m-0 truncate">{ann.content}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Admin Dashboard Render (Default)
  return (
    <div className="flex flex-col gap-6 md:gap-8">
      <div className="page-header animate-fade-in flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-display font-bold text-brand-text-main">Administrative Dashboard</h1>
          <p className="text-brand-text-muted mt-1 text-sm">Model University overall metrics, trends, and recent campus activities.</p>
        </div>
        <div className="btn-group flex gap-2">
          <button className="btn btn-secondary btn-sm flex items-center gap-1.5 cursor-pointer" onClick={() => alert('Exporting Report...')}>
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            Export Sheet
          </button>
          <button className="btn btn-primary btn-sm flex items-center gap-1.5 cursor-pointer" onClick={() => window.location.reload()}>
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>
            Reload View
          </button>
        </div>
      </div>

      <div className="kpi-grid animate-fade-in mt-2">
        {/* KPI 1: Total Students */}
        <div className="card kpi-card flex justify-between items-center p-6 bg-brand-bg-secondary border border-brand-border rounded-2xl">
          <div className="kpi-details flex flex-col">
            <span className="kpi-label text-xs text-brand-text-subtle font-semibold uppercase tracking-wider">Total Students</span>
            <span className="kpi-value text-2xl font-bold font-display text-brand-text-main mt-1.5">1,528</span>
            <span className="kpi-growth text-brand-accent-emerald text-xs mt-1.5 flex items-center gap-1 font-medium">
              <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="18 15 12 9 6 15"/></svg>
              Active Enrollment
            </span>
          </div>
          <div className="kpi-icon p-3.5 bg-brand-primary/10 rounded-xl text-brand-primary">
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>
          </div>
        </div>

        {/* KPI 2: Active Faculty */}
        <div className="card kpi-card flex justify-between items-center p-6 bg-brand-bg-secondary border border-brand-border rounded-2xl">
          <div className="kpi-details flex flex-col">
            <span className="kpi-label text-xs text-brand-text-subtle font-semibold uppercase tracking-wider">Active Faculty</span>
            <span className="kpi-value text-2xl font-bold font-display text-brand-text-main mt-1.5">27</span>
            <span className="kpi-growth text-brand-accent-cyan text-xs mt-1.5 flex items-center gap-1 font-medium">
              Full department roster
            </span>
          </div>
          <div className="kpi-icon p-3.5 bg-brand-accent-cyan/10 rounded-xl text-brand-accent-cyan">
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          </div>
        </div>

        {/* KPI 3: Departments */}
        <div className="card kpi-card flex justify-between items-center p-6 bg-brand-bg-secondary border border-brand-border rounded-2xl">
          <div className="kpi-details flex flex-col">
            <span className="kpi-label text-xs text-brand-text-subtle font-semibold uppercase tracking-wider">Departments</span>
            <span className="kpi-value text-2xl font-bold font-display text-brand-text-main mt-1.5">5 Divisions</span>
            <span className="kpi-growth text-brand-accent-emerald text-xs mt-1.5 flex items-center gap-1 font-medium">
              Academics & Research
            </span>
          </div>
          <div className="kpi-icon p-3.5 bg-brand-accent-emerald/10 rounded-xl text-brand-accent-emerald">
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
          </div>
        </div>

        {/* KPI 4: Pending Admissions */}
        <div className="card kpi-card flex justify-between items-center p-6 bg-brand-bg-secondary border border-brand-border rounded-2xl">
          <div className="kpi-details flex flex-col">
            <span className="kpi-label text-xs text-brand-text-subtle font-semibold uppercase tracking-wider">Pending Admissions</span>
            <span className="kpi-value text-2xl font-bold font-display text-brand-text-main mt-1.5">142</span>
            <span className="kpi-growth text-brand-accent-amber text-xs mt-1.5 flex items-center gap-1 font-medium">
              Applications review
            </span>
          </div>
          <div className="kpi-icon p-3.5 bg-brand-accent-amber/10 rounded-xl text-brand-accent-amber">
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 9l3 3-3 3"/><path d="M15 12h7"/></svg>
          </div>
        </div>

        {/* KPI 5: Revenue */}
        <div className="card kpi-card flex justify-between items-center p-6 bg-brand-bg-secondary border border-brand-border rounded-2xl">
          <div className="kpi-details flex flex-col">
            <span className="kpi-label text-xs text-brand-text-subtle font-semibold uppercase tracking-wider">Revenue</span>
            <span className="kpi-value text-2xl font-bold font-display text-brand-text-main mt-1.5">$2.16M</span>
            <span className="kpi-growth text-brand-accent-emerald text-xs mt-1.5 flex items-center gap-1 font-medium">
              Current fiscal year
            </span>
          </div>
          <div className="kpi-icon p-3.5 bg-brand-accent-ruby/10 rounded-xl text-brand-accent-ruby">
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
          </div>
        </div>

        {/* KPI 6: Scholarships */}
        <div className="card kpi-card flex justify-between items-center p-6 bg-brand-bg-secondary border border-brand-border rounded-2xl">
          <div className="kpi-details flex flex-col">
            <span className="kpi-label text-xs text-brand-text-subtle font-semibold uppercase tracking-wider">Scholarships</span>
            <span className="kpi-value text-2xl font-bold font-display text-brand-text-main mt-1.5">$180k</span>
            <span className="kpi-growth text-brand-primary text-xs mt-1.5 flex items-center gap-1 font-medium">
              Allocated grants
            </span>
          </div>
          <div className="kpi-icon p-3.5 bg-brand-primary/10 rounded-xl text-brand-primary">
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="8" r="7"/><path d="M8.21 13.89L7 23l5-3 5 3-1.21-9.12"/></svg>
          </div>
        </div>

        {/* KPI 7: Placement Rate */}
        <div className="card kpi-card flex justify-between items-center p-6 bg-brand-bg-secondary border border-brand-border rounded-2xl">
          <div className="kpi-details flex flex-col">
            <span className="kpi-label text-xs text-brand-text-subtle font-semibold uppercase tracking-wider">Placement Rate</span>
            <span className="kpi-value text-2xl font-bold font-display text-brand-text-main mt-1.5">94.2%</span>
            <span className="kpi-growth text-brand-accent-emerald text-xs mt-1.5 flex items-center gap-1 font-medium">
              Senior graduating class
            </span>
          </div>
          <div className="kpi-icon p-3.5 bg-brand-accent-emerald/10 rounded-xl text-brand-accent-emerald">
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5"/></svg>
          </div>
        </div>

        {/* KPI 8: Library Usage */}
        <div className="card kpi-card flex justify-between items-center p-6 bg-brand-bg-secondary border border-brand-border rounded-2xl">
          <div className="kpi-details flex flex-col">
            <span className="kpi-label text-xs text-brand-text-subtle font-semibold uppercase tracking-wider">Library Usage</span>
            <span className="kpi-value text-2xl font-bold font-display text-brand-text-main mt-1.5">88%</span>
            <span className="kpi-growth text-brand-accent-cyan text-xs mt-1.5 flex items-center gap-1 font-medium">
              Resource utilization
            </span>
          </div>
          <div className="kpi-icon p-3.5 bg-brand-accent-cyan/10 rounded-xl text-brand-accent-cyan">
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2zM22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
          </div>
        </div>

        {/* KPI 9: Hostel Occupancy */}
        <div className="card kpi-card flex justify-between items-center p-6 bg-brand-bg-secondary border border-brand-border rounded-2xl">
          <div className="kpi-details flex flex-col">
            <span className="kpi-label text-xs text-brand-text-subtle font-semibold uppercase tracking-wider">Hostel Occupancy</span>
            <span className="kpi-value text-2xl font-bold font-display text-brand-text-main mt-1.5">85%</span>
            <span className="kpi-growth text-brand-accent-amber text-xs mt-1.5 flex items-center gap-1 font-medium">
              Resident capacity
            </span>
          </div>
          <div className="kpi-icon p-3.5 bg-brand-accent-amber/10 rounded-xl text-brand-accent-amber">
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
          </div>
        </div>
      </div>

      {/* Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-2">
        <div className="card p-6 bg-brand-bg-secondary border border-brand-border rounded-2xl flex flex-col h-[380px]">
          <h3 className="mb-4 font-display text-lg font-bold text-brand-text-main shrink-0">Student Growth</h3>
          <div className="flex-1 relative min-h-0">
            <canvas ref={canvasEnrollmentRef}></canvas>
          </div>
        </div>
        
        <div className="card p-6 bg-brand-bg-secondary border border-brand-border rounded-2xl flex flex-col h-[380px]">
          <h3 className="mb-4 font-display text-lg font-bold text-brand-text-main shrink-0">Attendance Trend Chart</h3>
          <div className="flex-1 relative min-h-0">
            <canvas ref={canvasAttendanceRef}></canvas>
          </div>
        </div>
      </div>

      {/* Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card p-6 bg-brand-bg-secondary border border-brand-border rounded-2xl flex flex-col h-[380px]">
          <h3 className="mb-4 font-display text-lg font-bold text-brand-text-main shrink-0">Faculty Distribution</h3>
          <div className="flex-1 relative min-h-0">
            <canvas ref={canvasDeptRef}></canvas>
          </div>
        </div>
        
        <div className="card p-6 bg-brand-bg-secondary border border-brand-border rounded-2xl flex flex-col h-[380px]">
          <h3 className="mb-4 font-display text-lg font-bold text-brand-text-main shrink-0">Course Enrollment Analytics</h3>
          <div className="flex-1 relative min-h-0">
            <canvas ref={canvasCourseEnrollRef}></canvas>
          </div>
        </div>
      </div>

      {/* Row 3 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Notices */}
        <div className="card p-6 bg-brand-bg-secondary border border-brand-border rounded-2xl flex flex-col h-[380px]">
          <h3 className="mb-4 font-display text-base font-bold m-0 border-b border-brand-border pb-3 shrink-0 text-brand-text-main flex justify-between items-center">
            <span>Recent Notices</span>
            <Link href="/announcements" className="text-xs text-brand-primary hover:text-brand-primary-hover font-semibold">View All</Link>
          </h3>
          <div className="flex-1 overflow-y-auto flex flex-col gap-4 pr-1 min-h-0 mt-3">
            {announcements.slice(0, 3).map((ann, i) => (
              <div key={ann.id || i} className="pl-3 border-l-2" style={{ borderColor: ann.color || 'var(--color-brand-primary)' }}>
                <div className="flex justify-between items-center text-[0.7rem] text-brand-text-subtle">
                  <span className="badge bg-brand-bg-tertiary text-brand-text-main text-[0.65rem] px-1.5 py-0.5 rounded">{ann.tag}</span>
                  <span className="text-[0.65rem] text-brand-text-subtle">{ann.date}</span>
                </div>
                <h4 className="my-1 text-xs font-semibold text-brand-text-main">{ann.title}</h4>
                <p className="text-[0.75rem] text-brand-text-muted leading-relaxed m-0 truncate">{ann.content}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Exams */}
        <div className="card p-6 bg-brand-bg-secondary border border-brand-border rounded-2xl flex flex-col h-[380px]">
          <h3 className="mb-4 font-display text-base font-bold m-0 border-b border-brand-border pb-3 shrink-0 text-brand-text-main flex justify-between items-center">
            <span>Upcoming Exams</span>
            <Link href="/exams" className="text-xs text-brand-primary hover:text-brand-primary-hover font-semibold">View All</Link>
          </h3>
          <div className="flex-1 overflow-y-auto flex flex-col gap-3 pr-1 min-h-0 mt-3">
            {exams.slice(0, 3).map((ex, idx) => (
              <div key={idx} className="p-3 border border-brand-border rounded-xl bg-brand-bg-tertiary flex justify-between items-center transition-all duration-200 hover:border-brand-primary/30">
                <div>
                  <code className="text-brand-primary font-mono font-bold text-xs">{ex.code}</code>
                  <h4 className="mt-1 mb-0.5 font-display font-medium text-brand-text-main text-xs">{ex.name}</h4>
                  <span className="text-[10px] text-brand-text-muted">{ex.date}</span>
                </div>
                <span className="badge bg-brand-accent-cyan/10 text-brand-accent-cyan text-[0.7rem] px-2 py-0.5 rounded font-semibold">{ex.venue}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Admissions */}
        <div className="card p-6 bg-brand-bg-secondary border border-brand-border rounded-2xl flex flex-col h-[380px]">
          <h3 className="mb-4 font-display text-base font-bold m-0 border-b border-brand-border pb-3 shrink-0 text-brand-text-main flex justify-between items-center">
            <span>Recent Admissions</span>
            <Link href="/students" className="text-xs text-brand-primary hover:text-brand-primary-hover font-semibold">View Registry</Link>
          </h3>
          <div className="flex-1 overflow-y-auto flex flex-col gap-3 pr-1 min-h-0 mt-3">
            {students.slice(-4).reverse().map((s, idx) => (
              <div key={idx} className="p-2.5 bg-brand-bg-tertiary border border-brand-border rounded-xl flex items-center gap-3">
                <img src={s.avatar} className="w-8 h-8 rounded-full object-cover border border-brand-border shrink-0" alt="" />
                <div className="min-w-0 flex-1">
                  <strong className="text-xs text-brand-text-main block truncate font-semibold">{s.name}</strong>
                  <span className="text-[10px] text-brand-text-muted block truncate">{s.dept} Dept • GPA {s.gpa.toFixed(2)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
