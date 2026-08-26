'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useDb } from '../../context/db-context';

export default function CoursesPage() {
  const {
    courses,
    faculty,
    students,
    departments,
    addCourse
  } = useDb();

  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      let session = sessionStorage.getItem('campusx_erp_session');
      if (!session) {
        const defaultUser = { id: 'usr_admin', name: 'Dr. Alex Vance', role: 'admin', email: 'admin@campusx.edu' };
        sessionStorage.setItem('campusx_erp_session', JSON.stringify(defaultUser));
        session = JSON.stringify(defaultUser);
      }
      try {
        setCurrentUser(JSON.parse(session));
      } catch (e) {}
    }
  }, []);

  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDept, setFilterDept] = useState('ALL');

  // Modals state
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);

  // Add course form state
  const [newTitle, setNewTitle] = useState('');
  const [newCode, setNewCode] = useState('');
  const [newCredits, setNewCredits] = useState(3);
  const [newDept, setNewDept] = useState('CS');
  const [newInstructor, setNewInstructor] = useState('');
  const [newMaxSeats, setNewMaxSeats] = useState(60);

  // AI Demand Estimation state
  const [aiDemandText, setAiDemandText] = useState('Calculating...');
  const [aiDemandClass, setAiDemandClass] = useState('bg-brand-accent-emerald/20 text-brand-accent-emerald');

  // Filter courses
  const filteredCourses = courses.filter(c => {
    const instructor = faculty.find(f => f.id === c.facultyId);
    const instructorName = instructor ? instructor.name.toLowerCase() : '';
    const matchSearch = c.code.toLowerCase().includes(searchTerm.toLowerCase())
      || c.title.toLowerCase().includes(searchTerm.toLowerCase())
      || instructorName.includes(searchTerm.toLowerCase());
    const matchDept = filterDept === 'ALL' || c.dept === filterDept;
    return matchSearch && matchDept;
  });

  // Run Course Registration Demand Estimator (TensorFlow)
  const runCourseTfInference = async (c) => {
    if (typeof window === 'undefined' || !window.tf) {
      setAiDemandText('TF Unavailable');
      return;
    }

    try {
      const tf = window.tf;
      const isCs = c.dept === 'CS' ? 1.0 : 0.5;
      const inputVal = [c.credits / 5.0, c.enrolledCount / c.maxEnrollment, isCs];

      const model = tf.sequential();
      model.add(tf.layers.dense({ units: 3, activation: 'sigmoid', inputShape: [3] }));
      model.add(tf.layers.dense({ units: 1 }));

      const w1 = tf.tensor2d([
        [0.5],
        [1.5],
        [0.8]
      ]);
      const b1 = tf.tensor1d([0.2]);
      model.layers[1].setWeights([w1, b1]);

      const inputTensor = tf.tensor2d([inputVal], [1, 3]);
      const outputTensor = model.predict(inputTensor);
      const outputVal = (await outputTensor.data())[0];

      let predictedSeats = Math.round(c.maxEnrollment * (0.6 + outputVal * 0.6));
      predictedSeats = Math.max(10, Math.min(120, predictedSeats));

      setAiDemandText(`${predictedSeats} students projected`);

      if (predictedSeats >= c.maxEnrollment * 0.9) {
        setAiDemandClass('bg-brand-accent-ruby/20 text-brand-accent-ruby');
      } else if (predictedSeats >= c.maxEnrollment * 0.6) {
        setAiDemandClass('bg-brand-accent-emerald/20 text-brand-accent-emerald');
      } else {
        setAiDemandClass('bg-brand-accent-amber/20 text-brand-accent-amber');
      }

      inputTensor.dispose();
      outputTensor.dispose();
      w1.dispose();
      b1.dispose();
      model.dispose();
    } catch (err) {
      console.error('TF Course inference failed:', err);
    }
  };

  useEffect(() => {
    if (selectedCourse) {
      runCourseTfInference(selectedCourse);
    }
  }, [selectedCourse]);

  // Set default instructor on load or change
  useEffect(() => {
    if (faculty.length > 0 && !newInstructor) {
      setNewInstructor(faculty[0].id);
    }
  }, [faculty]);

  // Add Course Submit
  const handleAddCourse = () => {
    if (!newTitle.trim() || !newCode.trim()) {
      alert("Please provide course title and course code details.");
      return;
    }

    const codeUpper = newCode.toUpperCase().trim();
    if (courses.some(c => c.code.toUpperCase() === codeUpper)) {
      alert(`Course code ${codeUpper} already exists in the registry.`);
      return;
    }

    const newCourse = {
      code: codeUpper,
      title: newTitle.trim(),
      dept: newDept,
      credits: parseInt(newCredits) || 3,
      facultyId: newInstructor || (faculty[0]?.id || 'Unassigned'),
      maxEnrollment: parseInt(newMaxSeats) || 60,
      enrolledCount: 0,
      status: 'Active'
    };

    addCourse(newCourse);
    setShowAddModal(false);
    setNewTitle('');
    setNewCode('');
    alert(`Course "${newCourse.title}" created successfully!`);
  };

  if (!currentUser) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="w-8 h-8 border-4 border-brand-primary/30 border-t-brand-primary rounded-full animate-spin"></div>
      </div>
    );
  }

  if (currentUser.role !== 'admin') {
    return (
      <div className="card p-8 text-center bg-brand-bg-secondary border border-brand-border rounded-2xl animate-fade-in my-12">
        <div className="w-16 h-16 bg-brand-accent-ruby/10 text-brand-accent-ruby rounded-full flex items-center justify-center mx-auto mb-4 border border-brand-accent-ruby/20">
          <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
        </div>
        <h2 className="text-xl font-display font-bold text-brand-text-main">Access Denied</h2>
        <p className="text-brand-text-muted text-sm mt-2 max-w-md mx-auto">You do not have the required credentials to access Course Management.</p>
        <Link className="btn btn-secondary mt-6 cursor-pointer" href="/">Return to Home Portal</Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 md:gap-8">
      <div className="page-header animate-fade-in flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-display font-bold text-brand-text-main">Course Catalog</h1>
          <p className="text-brand-text-muted mt-1 text-sm">Browse semester curricula, assign credits, verify course capacities, and check active sections.</p>
        </div>
        {currentUser?.role === 'admin' && (
          <button className="btn btn-primary cursor-pointer flex items-center gap-2" onClick={() => setShowAddModal(true)}>
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14M5 12h14"/></svg>
            Create New Course
          </button>
        )}
      </div>

      {/* Search Filters */}
      <div className="card animate-fade-in p-6 bg-brand-bg-secondary border border-brand-border rounded-2xl">
        <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-4 items-end">
          <div className="form-group mb-0 flex flex-col gap-1.5">
            <label className="form-label text-xs font-semibold text-brand-text-muted">Search Courses</label>
            <input 
              type="text" 
              className="bg-brand-bg-tertiary border border-brand-border text-brand-text-main p-2.5 rounded-xl outline-none" 
              placeholder="Search by course code, title, or instructor..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="form-group mb-0 flex flex-col gap-1.5">
            <label className="form-label text-xs font-semibold text-brand-text-muted">Department Stream</label>
            <select 
              className="bg-brand-bg-tertiary border border-brand-border text-brand-text-main p-2.5 rounded-xl outline-none cursor-pointer"
              value={filterDept}
              onChange={(e) => setFilterDept(e.target.value)}
            >
              <option value="ALL">All Departments</option>
              {departments.map(d => (
                <option key={d.code} value={d.code}>{d.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Course Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in mt-2">
        {filteredCourses.length === 0 ? (
          <div className="card col-span-full text-center text-brand-text-muted p-8 bg-brand-bg-secondary border border-brand-border rounded-2xl">
            No matching courses found in the current academic calendar catalog.
          </div>
        ) : (
          filteredCourses.map(c => {
            const instructor = faculty.find(f => f.id === c.facultyId);
            const instructorName = instructor ? instructor.name : 'Unassigned';
            const fillPercentage = Math.min((c.enrolledCount / c.maxEnrollment) * 100, 100);
            
            let fillClass = 'text-brand-accent-emerald';
            if (fillPercentage > 90) fillClass = 'text-brand-accent-ruby';
            else if (fillPercentage > 75) fillClass = 'text-brand-accent-amber';

            // Calculate class average attendance dynamically
            let enrolled = students.filter(s => s.courses.includes(c.code));
            if (enrolled.length === 0) enrolled = students.filter(s => s.dept === c.dept);
            const avgAttend = enrolled.length > 0 ? Math.round(enrolled.reduce((a, b) => a + (b.attendance || 0), 0) / enrolled.length) : 90;

            return (
              <div key={c.code} className="card p-6 bg-brand-bg-secondary border border-brand-border rounded-2xl flex flex-col gap-4">
                <div className="flex justify-between items-start">
                  <code className="text-lg text-brand-primary font-mono font-bold">{c.code}</code>
                  <span className="badge bg-brand-primary/10 text-brand-primary text-xs px-2 py-0.5 rounded font-semibold">{c.credits} Credits</span>
                </div>
                
                <div>
                  <h4 className="m-0 mb-1.5 font-display text-lg font-bold text-brand-text-main">{c.title}</h4>
                  <span className="text-[0.75rem] text-brand-text-muted">Instructor: <strong>{instructorName}</strong></span>
                </div>

                {/* Enrollment Seats */}
                <div>
                  <div className="flex justify-between text-[0.8rem] mb-1.5 text-brand-text-main">
                    <span>Enrolled Seats</span>
                    <strong className={fillClass}>{c.enrolledCount} / {c.maxEnrollment}</strong>
                  </div>
                  <div className="h-1.5 bg-brand-bg-tertiary rounded-full overflow-hidden border border-brand-border/40">
                    <div className="h-full bg-brand-primary rounded-full transition-all duration-300" style={{ width: `${fillPercentage}%` }}></div>
                  </div>
                </div>

                {/* Attendance */}
                <div>
                  <div className="flex justify-between text-[0.8rem] mb-1.5 text-brand-text-main">
                    <span>Avg Class Attendance</span>
                    <strong className={avgAttend < 75 ? 'text-brand-accent-ruby' : (avgAttend < 85 ? 'text-brand-accent-amber' : 'text-brand-accent-emerald')}>{avgAttend}%</strong>
                  </div>
                  <div className="h-1.5 bg-brand-bg-tertiary rounded-full overflow-hidden border border-brand-border/40">
                    <div className="h-full bg-brand-accent-cyan rounded-full transition-all duration-300" style={{ width: `${avgAttend}%` }}></div>
                  </div>
                </div>

                <div className="flex justify-between items-center mt-auto pt-4 border-t border-brand-border">
                  <span className="text-xs text-brand-text-subtle">Department: {c.dept}</span>
                  <button className="btn btn-secondary btn-sm cursor-pointer" onClick={() => setSelectedCourse(c)}>Syllabus</button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* SYLLABUS MODAL */}
      {selectedCourse && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center z-[1000] p-4">
          <div className="modal-container bg-brand-bg-secondary border border-brand-border rounded-[20px] w-full max-w-[500px] shadow-2xl animate-fade-in">
            <div className="modal-header p-5 px-6 border-b border-brand-border flex items-center justify-between">
              <h3 className="modal-title font-display text-xl font-semibold text-brand-text-main">Academic Course Syllabus</h3>
              <button className="modal-close bg-transparent border-none text-brand-text-muted cursor-pointer text-2xl" onClick={() => setSelectedCourse(null)}>&times;</button>
            </div>
            <div className="modal-body p-6 flex flex-col gap-4">
              <h3 className="font-display text-lg font-bold text-brand-text-main mb-1">{selectedCourse.title}</h3>
              <p className="text-brand-text-muted text-[0.875rem] m-0">
                Code: <code className="text-brand-primary">{selectedCourse.code}</code> | Dept: {selectedCourse.dept} | Credits: {selectedCourse.credits}
              </p>
              
              <h4 className="mt-2 text-sm font-semibold text-brand-text-main">Course Description</h4>
              <p className="text-brand-text-muted text-xs leading-relaxed">
                This academic course covers modern concepts of {selectedCourse.title.toLowerCase()} inside the college syllabus. Students will understand core practices, theoretical bounds, build assignments, and review real-world implementations led by {faculty.find(f => f.id === selectedCourse.facultyId)?.name || 'TBD'}.
              </p>

              <h4 className="mt-2 text-sm font-semibold text-brand-text-main">Weekly Syllabus Outline</h4>
              <div className="flex flex-col gap-2">
                <div className="p-3 bg-brand-bg-tertiary rounded-xl border border-brand-border text-xs text-brand-text-muted">
                  <strong className="text-brand-text-main">Weeks 1-4:</strong> Fundamental Theories & Systems Overview.
                </div>
                <div className="p-3 bg-brand-bg-tertiary rounded-xl border border-brand-border text-xs text-brand-text-muted">
                  <strong className="text-brand-text-main">Weeks 5-8:</strong> Core Architectural Implementations & Lab Projects.
                </div>
                <div className="p-3 bg-brand-bg-tertiary rounded-xl border border-brand-border text-xs text-brand-text-muted">
                  <strong className="text-brand-text-main">Weeks 9-12:</strong> Advanced Topics, Integrations & Final Seminar Review.
                </div>
              </div>

              {/* AI Predictor */}
              <div className="card p-4 bg-brand-bg-tertiary border border-brand-border rounded-xl mt-3">
                <div className="flex items-center justify-between mb-3 pb-2 border-b border-brand-border/40">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-brand-primary animate-pulse"></span>
                    <span className="text-xs font-bold uppercase tracking-wider text-brand-text-main font-display">AI Registration Demand Predictor</span>
                  </div>
                  <span className={`badge text-[0.65rem] py-0.5 px-2 font-mono rounded ${aiDemandClass}`}>
                    {aiDemandText.includes('projections') ? 'Stable Demand' : (aiDemandClass.includes('ruby') ? 'High Demand Alert' : 'Normal Demand')}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-3 text-xs text-brand-text-muted">
                  <div>
                    <span className="text-[0.7rem] text-brand-text-subtle">Predicted Registration Demand:</span>
                    <div className="font-bold text-brand-text-main font-mono text-sm mt-0.5">{aiDemandText}</div>
                  </div>
                  <div>
                    <span className="text-[0.7rem] text-brand-text-subtle">Target Semester Seat Cap:</span>
                    <div className="font-bold text-brand-text-main font-mono text-sm mt-0.5">{selectedCourse.maxEnrollment} seats</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-footer p-4 px-6 border-t border-brand-border flex justify-end">
              <button className="btn btn-secondary cursor-pointer" onClick={() => setSelectedCourse(null)}>Close Window</button>
            </div>
          </div>
        </div>
      )}

      {/* CREATE NEW COURSE MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center z-[1000] p-4">
          <div className="modal-container bg-brand-bg-secondary border border-brand-border rounded-[20px] w-full max-w-[500px] shadow-2xl animate-fade-in">
            <div className="modal-header p-5 px-6 border-b border-brand-border flex items-center justify-between">
              <h3 className="modal-title font-display text-xl font-semibold text-brand-text-main">Create Academic Course</h3>
              <button className="modal-close bg-transparent border-none text-brand-text-muted cursor-pointer text-2xl" onClick={() => setShowAddModal(false)}>&times;</button>
            </div>
            <div className="modal-body p-6 flex flex-col gap-4">
              <div className="form-group flex flex-col gap-1.5">
                <label className="form-label text-xs font-semibold text-brand-text-muted">Course Title</label>
                <input 
                  type="text" 
                  className="bg-brand-bg-tertiary border border-brand-border text-brand-text-main p-2.5 rounded-xl outline-none" 
                  placeholder="e.g. Distributed Operating Systems"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="form-group flex flex-col gap-1.5">
                  <label className="form-label text-xs font-semibold text-brand-text-muted">Course Code</label>
                  <input 
                    type="text" 
                    className="bg-brand-bg-tertiary border border-brand-border text-brand-text-main p-2.5 rounded-xl outline-none" 
                    placeholder="e.g. CS420"
                    value={newCode}
                    onChange={(e) => setNewCode(e.target.value)}
                  />
                </div>
                <div className="form-group flex flex-col gap-1.5">
                  <label className="form-label text-xs font-semibold text-brand-text-muted">Credits</label>
                  <input 
                    type="number" 
                    className="bg-brand-bg-tertiary border border-brand-border text-brand-text-main p-2.5 rounded-xl outline-none" 
                    min="1"
                    max="5"
                    value={newCredits}
                    onChange={(e) => setNewCredits(parseInt(e.target.value) || 3)}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="form-group flex flex-col gap-1.5">
                  <label className="form-label text-xs font-semibold text-brand-text-muted">Department Stream</label>
                  <select 
                    className="bg-brand-bg-tertiary border border-brand-border text-brand-text-main p-2.5 rounded-xl outline-none cursor-pointer"
                    value={newDept}
                    onChange={(e) => setNewDept(e.target.value)}
                  >
                    {departments.map(d => (
                      <option key={d.code} value={d.code}>{d.name}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group flex flex-col gap-1.5">
                  <label className="form-label text-xs font-semibold text-brand-text-muted">Instructor</label>
                  <select 
                    className="bg-brand-bg-tertiary border border-brand-border text-brand-text-main p-2.5 rounded-xl outline-none cursor-pointer"
                    value={newInstructor}
                    onChange={(e) => setNewInstructor(e.target.value)}
                  >
                    {faculty.map(f => (
                      <option key={f.id} value={f.id}>{f.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="form-group flex flex-col gap-1.5">
                <label className="form-label text-xs font-semibold text-brand-text-muted">Maximum Class Intake (Seats)</label>
                <input 
                  type="number" 
                  className="bg-brand-bg-tertiary border border-brand-border text-brand-text-main p-2.5 rounded-xl outline-none" 
                  min="10"
                  max="150"
                  value={newMaxSeats}
                  onChange={(e) => setNewMaxSeats(parseInt(e.target.value) || 60)}
                />
              </div>
            </div>
            <div className="modal-footer p-4 px-6 border-t border-brand-border flex justify-end gap-3">
              <button className="btn btn-secondary cursor-pointer" onClick={() => setShowAddModal(false)}>Cancel</button>
              <button className="btn btn-primary cursor-pointer" onClick={handleAddCourse}>Publish Course</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
