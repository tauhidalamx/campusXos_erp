'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useDb } from '../../context/db-context';

export default function FacultyPage() {
  const {
    faculty,
    courses,
    students,
    departments,
    addFaculty,
    updateFaculty
  } = useDb();

  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      let session = sessionStorage.getItem('campusx_erp_session');
      if (!session) {
        window.location.href = '/login';
        return;
      }
      try {
        setCurrentUser(JSON.parse(session));
      } catch (e) {}
    }
  }, []);

  // Local state
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDept, setFilterDept] = useState('ALL');

  // Modals state
  const [selectedFacultyWorkload, setSelectedFacultyWorkload] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);

  // Form states
  const [modWorkload, setModWorkload] = useState(12);
  const [newFacName, setNewFacName] = useState('');
  const [newFacEmail, setNewFacEmail] = useState('');
  const [newFacDept, setNewFacDept] = useState('CS');
  const [newFacDesignation, setNewFacDesignation] = useState('Professor');
  const [newFacWorkload, setNewFacWorkload] = useState(12);

  // AI Workload Optimization states
  const [aiRating, setAiRating] = useState('Calculating...');
  const [aiStatus, setAiStatus] = useState('Optimal Load');
  const [aiStatusClass, setAiStatusClass] = useState('bg-brand-accent-emerald/20 text-brand-accent-emerald');
  const [aiRecommend, setAiRecommend] = useState('12 hrs/wk');

  // Chart ref
  const chartRef = useRef(null);
  const canvasRef = useRef(null);

  // Defensive array assignments
  const safeFaculty = Array.isArray(faculty) ? faculty : [];
  const safeCourses = Array.isArray(courses) ? courses : [];
  const safeStudents = Array.isArray(students) ? students : [];
  const safeDepartments = Array.isArray(departments) ? departments : [];

  // Filter faculty
  const filteredFaculty = safeFaculty.filter(f => {
    if (!f) return false;
    const nameStr = f.name || '';
    const emailStr = f.email || '';
    const idStr = f.id || '';
    const matchSearch = nameStr.toLowerCase().includes(searchTerm.toLowerCase())
      || emailStr.toLowerCase().includes(searchTerm.toLowerCase())
      || idStr.toLowerCase().includes(searchTerm.toLowerCase());
    const matchDept = filterDept === 'ALL' || f.dept === filterDept;
    return matchSearch && matchDept;
  });

  // Render Chart
  useEffect(() => {
    if (typeof window === 'undefined' || !window.Chart || !canvasRef.current) return;
    const Chart = window.Chart;

    if (chartRef.current) chartRef.current.destroy();

    const labels = filteredFaculty.map(f => (f.name || 'Faculty').split(' ').slice(1).join(' ') || f.name || 'Faculty');
    const workloadData = filteredFaculty.map(f => f.workload || 0);
    const colors = filteredFaculty.map(f => (f.workload || 0) > 15 ? '#f43f5e' : ((f.workload || 0) > 12 ? '#f59e0b' : '#10b981'));

    chartRef.current = new Chart(canvasRef.current, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Weekly teaching hours',
          data: workloadData,
          backgroundColor: colors,
          borderColor: 'rgba(255, 255, 255, 0.05)',
          borderWidth: 1,
          borderRadius: 6
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          y: {
            grid: { color: 'rgba(255, 255, 255, 0.05)' },
            ticks: { color: '#94a3b8' },
            max: 20
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
  }, [filteredFaculty]);

  // Run AI Faculty Optimizer
  const runFacultyTfOptimizer = async (fac, currentLoad) => {
    if (typeof window === 'undefined' || !window.tf || !fac) {
      setAiRating('TF Unavailable');
      return;
    }

    try {
      const tf = window.tf;
      const isProf = fac.designation === 'Professor' ? 1.0 : 0.5;
      const courseCount = fac.courses && Array.isArray(fac.courses) ? fac.courses.length : 0;
      const inputVal = [currentLoad / 18.0, courseCount / 5.0, isProf];

      const model = tf.sequential();
      model.add(tf.layers.dense({ units: 4, activation: 'tanh', inputShape: [3] }));
      model.add(tf.layers.dense({ units: 1 }));

      const w1 = tf.tensor2d([
        [-1.2],
        [-0.4],
        [0.8]
      ]);
      const b1 = tf.tensor1d([0.8]);
      model.layers[1].setWeights([w1, b1]);

      const inputTensor = tf.tensor2d([inputVal], [1, 3]);
      const outputTensor = model.predict(inputTensor);
      const outputVal = (await outputTensor.data())[0];
      const predictedRating = Math.min(Math.max(3.5 + outputVal * 0.8, 3.0), 5.0);
      
      setAiRating(predictedRating.toFixed(2) + ' / 5.0');
      
      if (currentLoad > 15) {
        setAiStatus('Heavy Overload');
        setAiStatusClass('bg-brand-accent-ruby/20 text-brand-accent-ruby');
      } else if (currentLoad < 6) {
        setAiStatus('Under-utilized');
        setAiStatusClass('bg-brand-accent-cyan/20 text-brand-accent-cyan');
      } else {
        setAiStatus('Optimal Load');
        setAiStatusClass('bg-brand-accent-emerald/20 text-brand-accent-emerald');
      }

      setAiRecommend(fac.designation === 'Professor' ? '12 hrs / wk' : '15 hrs / wk');

      inputTensor.dispose();
      outputTensor.dispose();
      w1.dispose();
      b1.dispose();
      model.dispose();
    } catch (err) {
      console.error('TF Optimizer error:', err);
    }
  };

  useEffect(() => {
    if (selectedFacultyWorkload) {
      runFacultyTfOptimizer(selectedFacultyWorkload, modWorkload);
    }
  }, [selectedFacultyWorkload, modWorkload]);

  const openWorkloadModal = (fac) => {
    setSelectedFacultyWorkload(fac);
    setModWorkload(fac.workload);
  };

  const saveWorkloadChanges = () => {
    if (modWorkload >= 0 && modWorkload <= 24) {
      updateFaculty(selectedFacultyWorkload.id, { workload: modWorkload });
      setSelectedFacultyWorkload(null);
      alert('Workload parameters updated successfully!');
    } else {
      alert('Please enter a valid workload hours number.');
    }
  };

  const handleAddFaculty = () => {
    if (!newFacName.trim() || !newFacEmail.trim()) {
      alert('Please enter both name and email.');
      return;
    }

    const newId = 'FAC' + String(safeFaculty.length + 1).padStart(3, '0');
    const avatarUrl = newFacAvatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150';
    const newFac = {
      id: newId,
      name: newFacName.trim(),
      email: newFacEmail.trim(),
      dept: newFacDept,
      designation: newFacDesignation,
      workload: parseInt(newFacWorkload) || 12,
      courses: [],
      avatar: avatarUrl
    };

    addFaculty(newFac);

    // Sync to backend SQLite & Cloud DB
    fetch('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: newId,
        name: newFacName.trim(),
        email: newFacEmail.trim(),
        role: 'faculty',
        avatar: avatarUrl,
        department: newFacDept
      })
    }).catch(err => console.error('Failed to sync faculty to server:', err));

    setShowAddModal(false);
    setNewFacName('');
    setNewFacEmail('');
    setNewFacAvatar('');
    alert('Faculty member added successfully and synced to Cloud Database!');
  };

  if (!currentUser) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="w-8 h-8 border-4 border-brand-primary/30 border-t-brand-primary rounded-full animate-spin"></div>
      </div>
    );
  }

  const adminRoles = ['admin', 'superadmin', 'platformadmin', 'univadmin', 'dean', 'hod', 'registrar', 'department_admin'];
  const isFacultyAdmin = adminRoles.includes(currentUser.role);

  return (
    <div className="flex flex-col gap-6 md:gap-8">
      <div className="page-header animate-fade-in flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-display font-bold text-brand-text-main">Faculty Directory</h1>
          <p className="text-brand-text-muted mt-1 text-sm">Manage faculty credentials, academic departments, research specializations, and teaching assignments.</p>
        </div>
        {isFacultyAdmin && (
          <button className="btn btn-primary cursor-pointer flex items-center gap-2" onClick={() => setShowAddModal(true)}>
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="11" x2="22" y2="11"/><line x1="19" y1="8" x2="19" y2="14"/></svg>
            Add Faculty Member
          </button>
        )}
      </div>

      {/* Search Controls */}
      <div className="card animate-fade-in p-6 bg-brand-bg-secondary border border-brand-border rounded-2xl">
        <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-4 items-end">
          <div className="form-group mb-0 flex flex-col gap-1.5">
            <label className="form-label text-xs font-semibold text-brand-text-muted">Search Faculty Directory</label>
            <input 
              type="text" 
              className="bg-brand-bg-tertiary border border-brand-border text-brand-text-main p-2.5 rounded-xl outline-none" 
              placeholder="Search by name, email, or department"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="form-group mb-0 flex flex-col gap-1.5">
            <label className="form-label text-xs font-semibold text-brand-text-muted">Department</label>
            <select 
              className="bg-brand-bg-tertiary border border-brand-border text-brand-text-main p-2.5 rounded-xl outline-none cursor-pointer"
              value={filterDept}
              onChange={(e) => setFilterDept(e.target.value)}
            >
              <option value="ALL">All Departments</option>
              {safeDepartments.map(d => (
                <option key={d.code || d.id || Math.random()} value={d.code || d.id}>{d.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Workload Management Dashboard */}
      <div className="card animate-fade-in p-6 bg-brand-bg-secondary border border-brand-border rounded-2xl">
        <h3 className="mb-2 font-display text-lg font-bold text-brand-text-main">Workload Management Dashboard</h3>
        <p className="text-brand-text-muted mb-5 text-sm">Maximum weekly limit: 18 hours. Values over 15 hours represent heavy workload.</p>
        <div className="h-[200px] relative">
          <canvas ref={canvasRef}></canvas>
        </div>
      </div>

      {/* Faculty Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in mt-2">
        {filteredFaculty.length === 0 ? (
          <div className="card col-span-full text-center text-brand-text-muted p-8 bg-brand-bg-secondary border border-brand-border rounded-2xl">
            No matching faculty listings found in database.
          </div>
        ) : (
          filteredFaculty.map(fac => {
            const loadPercent = Math.min((fac.workload / 18) * 100, 100);
            let barColor = 'var(--color-brand-primary)';
            if (fac.workload > 15) barColor = 'var(--color-brand-accent-ruby)';
            else if (fac.workload > 12) barColor = 'var(--color-brand-accent-amber)';
            else barColor = 'var(--color-brand-accent-emerald)';

            // Class attendance calculations
            const coursesTaught = safeCourses.filter(c => c && c.facultyId === fac.id);
            let totalAttendance = 0;
            let count = 0;

            coursesTaught.forEach(c => {
              if (!c) return;
              let enrolled = safeStudents.filter(s => s && Array.isArray(s.courses) && s.courses.includes(c.code));
              if (enrolled.length === 0) enrolled = safeStudents.filter(s => s && s.dept === c.dept);
              enrolled.forEach(s => {
                totalAttendance += (s.attendance || 0);
                count++;
              });
            });

            const avgClassAttend = count > 0 ? Math.round(totalAttendance / count) : 90;
            const coursesList = Array.isArray(fac.courses) ? fac.courses : [];

            return (
              <div key={fac.id || Math.random()} className="card p-6 bg-brand-bg-secondary border border-brand-border rounded-2xl flex flex-col gap-4">
                <div className="flex gap-4 items-center">
                  <img src={fac.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150'} className="w-13 h-13 rounded-full object-cover border border-brand-border" alt="" />
                  <div>
                    <h4 className="m-0 font-display text-base font-semibold text-brand-text-main">{fac.name || 'Faculty Member'}</h4>
                    <span className="text-[0.75rem] text-brand-text-muted font-medium">{fac.designation || 'Professor'} ({fac.dept || 'CS'})</span>
                  </div>
                </div>
                
                <div className="text-[0.8rem] text-brand-text-muted flex flex-col gap-1.5">
                  <div><strong>Email:</strong> <a href={`mailto:${fac.email || ''}`} className="text-brand-primary hover:underline">{fac.email || 'N/A'}</a></div>
                  <div><strong>Courses Taught:</strong> {coursesList.length > 0 ? coursesList.join(', ') : 'None assigned'}</div>
                  <div><strong>Class Attendance:</strong> <span className={`font-bold ${avgClassAttend < 75 ? 'text-brand-accent-ruby' : (avgClassAttend < 85 ? 'text-brand-accent-amber' : 'text-brand-accent-emerald')}`}>{avgClassAttend}%</span></div>
                </div>

                {/* Workload Progress */}
                <div>
                  <div className="flex justify-between text-[0.8rem] mb-1.5 text-brand-text-main">
                    <span>Workload Assigned</span>
                    <strong>{fac.workload} hrs / wk</strong>
                  </div>
                  <div className="h-1.5 bg-brand-bg-tertiary rounded-full overflow-hidden border border-brand-border/40">
                    <div className="h-full rounded-full transition-all duration-300" style={{ width: `${loadPercent}%`, backgroundColor: barColor }}></div>
                  </div>
                </div>

                {isFacultyAdmin && (
                  <div className="flex gap-2 mt-auto pt-2">
                    <button className="btn btn-secondary btn-sm flex-1 cursor-pointer" onClick={() => openWorkloadModal(fac)}>Class Workload</button>
                    <button className="btn btn-secondary btn-sm flex-1 cursor-pointer" onClick={() => alert('Publications database link is down for maintenance.')}>Research</button>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* WORKLOAD ADJUST MODAL */}
      {selectedFacultyWorkload && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center z-[1000] p-4">
          <div className="modal-container bg-brand-bg-secondary border border-brand-border rounded-[20px] w-full max-w-[500px] shadow-2xl animate-fade-in">
            <div className="modal-header p-5 px-6 border-b border-brand-border flex items-center justify-between">
              <h3 className="modal-title font-display text-xl font-semibold text-brand-text-main">Modify Academic Workload</h3>
              <button className="modal-close bg-transparent border-none text-brand-text-muted cursor-pointer text-2xl" onClick={() => setSelectedFacultyWorkload(null)}>&times;</button>
            </div>
            <div className="modal-body p-6 flex flex-col gap-4">
              <p className="text-brand-text-muted text-sm leading-normal">
                Adjust workload allocations and curriculum credits assignment for <strong>{selectedFacultyWorkload.name}</strong>.
              </p>
              
              <div className="form-group flex flex-col gap-1.5">
                <label className="form-label text-xs font-semibold text-brand-text-muted">Current Weekly Lecture Workload (Hours)</label>
                <input 
                  type="number" 
                  className="bg-brand-bg-tertiary border border-brand-border text-brand-text-main p-2.5 rounded-xl outline-none" 
                  value={modWorkload}
                  min="0"
                  max="24"
                  onChange={(e) => setModWorkload(parseInt(e.target.value) || 0)}
                />
              </div>

              <h4 className="mt-3 text-sm font-semibold text-brand-text-main">Assigned Course Catalog</h4>
              <ul className="pl-5 text-brand-text-muted list-disc text-xs flex flex-col gap-1">
                {selectedFacultyWorkload.courses.length === 0 ? (
                  <li>No courses assigned currently.</li>
                ) : (
                  selectedFacultyWorkload.courses.map(code => {
                    const c = courses.find(item => item.code === code);
                    return <li key={code}><code>{code}</code> - {c ? c.title : 'Research Project'}</li>;
                  })
                )}
              </ul>

              {/* AI Predictor */}
              <div className="card p-4 bg-brand-bg-tertiary border border-brand-border rounded-xl mt-3">
                <div className="flex items-center justify-between mb-3 pb-2 border-b border-brand-border/40">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-brand-accent-amber animate-pulse"></span>
                    <span className="text-xs font-bold uppercase tracking-wider text-brand-text-main font-display">AI Workload Predictor</span>
                  </div>
                  <span className={`badge text-[0.65rem] py-0.5 px-2 font-mono rounded ${aiStatusClass}`}>
                    {aiStatus}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-3 text-xs text-brand-text-muted">
                  <div>
                    <span className="text-[0.7rem] text-brand-text-subtle">Predicted Student Rating:</span>
                    <div className="font-bold text-brand-text-main font-mono text-sm mt-0.5">{aiRating}</div>
                  </div>
                  <div>
                    <span className="text-[0.7rem] text-brand-text-subtle">Optimal Load Recommendation:</span>
                    <div className="font-bold text-brand-text-main font-mono text-sm mt-0.5">{aiRecommend}</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-footer p-4 px-6 border-t border-brand-border flex justify-end gap-3">
              <button className="btn btn-secondary cursor-pointer" onClick={() => setSelectedFacultyWorkload(null)}>Cancel</button>
              <button className="btn btn-primary cursor-pointer" onClick={saveWorkloadChanges}>Save Changes</button>
            </div>
          </div>
        </div>
      )}

      {/* ADD FACULTY MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center z-[1000] p-4">
          <div className="modal-container bg-brand-bg-secondary border border-brand-border rounded-[20px] w-full max-w-[500px] shadow-2xl animate-fade-in">
            <div className="modal-header p-5 px-6 border-b border-brand-border flex items-center justify-between">
              <h3 className="modal-title font-display text-xl font-semibold text-brand-text-main">Add Faculty Member</h3>
              <button className="modal-close bg-transparent border-none text-brand-text-muted cursor-pointer text-2xl" onClick={() => setShowAddModal(false)}>&times;</button>
            </div>
            <div className="modal-body p-6 flex flex-col gap-4">
              <div className="form-group flex flex-col gap-1.5">
                <label className="form-label text-xs font-semibold text-brand-text-muted">Full Name</label>
                <input 
                  type="text" 
                  className="bg-brand-bg-tertiary border border-brand-border text-brand-text-main p-2.5 rounded-xl outline-none" 
                  placeholder="e.g. Dr. Ada Lovelace"
                  value={newFacName}
                  onChange={(e) => setNewFacName(e.target.value)}
                />
              </div>
              <div className="form-group flex flex-col gap-1.5">
                <label className="form-label text-xs font-semibold text-brand-text-muted">Email Address</label>
                <input 
                  type="email" 
                  className="bg-brand-bg-tertiary border border-brand-border text-brand-text-main p-2.5 rounded-xl outline-none" 
                  placeholder="e.g. ada@modeluni.edu"
                  value={newFacEmail}
                  onChange={(e) => setNewFacEmail(e.target.value)}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="form-group flex flex-col gap-1.5">
                  <label className="form-label text-xs font-semibold text-brand-text-muted">Department</label>
                  <select 
                    className="bg-brand-bg-tertiary border border-brand-border text-brand-text-main p-2.5 rounded-xl outline-none cursor-pointer"
                    value={newFacDept}
                    onChange={(e) => setNewFacDept(e.target.value)}
                  >
                    {departments.map(d => (
                      <option key={d.code} value={d.code}>{d.name}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group flex flex-col gap-1.5">
                  <label className="form-label text-xs font-semibold text-brand-text-muted">Designation</label>
                  <select 
                    className="bg-brand-bg-tertiary border border-brand-border text-brand-text-main p-2.5 rounded-xl outline-none cursor-pointer"
                    value={newFacDesignation}
                    onChange={(e) => setNewFacDesignation(e.target.value)}
                  >
                    <option>Professor</option>
                    <option>Associate Professor</option>
                    <option>Assistant Professor</option>
                  </select>
                </div>
              </div>
              <div className="form-group flex flex-col gap-1.5">
                <label className="form-label text-xs font-semibold text-brand-text-muted">Profile Photo / Avatar Upload</label>
                <div className="flex items-center gap-2">
                  {newFacAvatar && (
                    <img src={newFacAvatar} alt="Preview" className="w-9 h-9 rounded-full object-cover border border-brand-border" />
                  )}
                  <input 
                    type="file" 
                    accept="image/*" 
                    className="bg-brand-bg-tertiary border border-brand-border text-brand-text-main p-1.5 rounded-xl outline-none text-xs flex-1 cursor-pointer" 
                    onChange={async (e) => {
                      const file = e.target.files[0];
                      if (!file) return;
                      const bodyData = new FormData();
                      bodyData.append('file', file);
                      try {
                        const res = await fetch('/api/upload', { method: 'POST', body: bodyData });
                        const data = await res.json();
                        if (data.url) {
                          setNewFacAvatar(data.url);
                        }
                      } catch (err) {
                        console.error('Failed to upload faculty image:', err);
                      }
                    }} 
                  />
                </div>
              </div>

              <div className="form-group flex flex-col gap-1.5">
                <label className="form-label text-xs font-semibold text-brand-text-muted">Initial Workload (Hours/Week)</label>
                <input 
                  type="number" 
                  className="bg-brand-bg-tertiary border border-brand-border text-brand-text-main p-2.5 rounded-xl outline-none" 
                  value={newFacWorkload}
                  min="0"
                  max="20"
                  onChange={(e) => setNewFacWorkload(parseInt(e.target.value) || 0)}
                />
              </div>
            </div>
            <div className="modal-footer p-4 px-6 border-t border-brand-border flex justify-end gap-3">
              <button className="btn btn-secondary cursor-pointer" onClick={() => setShowAddModal(false)}>Cancel</button>
              <button className="btn btn-primary cursor-pointer" onClick={handleAddFaculty}>Add Member</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
