'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useDb } from '../../context/db-context';

export default function StudentsPage() {
  const {
    students,
    courses,
    faculty,
    departments,
    addStudent,
    updateStudent,
    deleteStudent
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

  // Search/Filters states
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDept, setFilterDept] = useState('ALL');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [filterGender, setFilterGender] = useState('ALL');

  // Modal control states
  const [activeStudent, setActiveStudent] = useState(null); // Full Profile modal
  const [editingStudent, setEditingStudent] = useState(null); // Edit modal
  const [showAddModal, setShowAddModal] = useState(false); // Add modal
  const [activeKebabId, setActiveKebabId] = useState(null);

  // Form states (Add/Edit)
  const [formData, setFormData] = useState({});

  // Anomaly/Success Predictor stats
  const [successPrediction, setSuccessPrediction] = useState(null);

  // Apply filters to students list
  const filteredStudents = students.filter(s => {
    const matchSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase())
      || s.id.toLowerCase().includes(searchTerm.toLowerCase())
      || (s.phone && s.phone.includes(searchTerm))
      || s.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchDept = filterDept === 'ALL' || s.dept === filterDept;
    const matchStatus = filterStatus === 'ALL' || s.status === filterStatus;
    const matchGender = filterGender === 'ALL' || s.gender === filterGender;
    return matchSearch && matchDept && matchStatus && matchGender;
  });

  // Run StudentSuccess/Dropout Prediction via TensorFlow
  const runSuccessPredictor = async (stu) => {
    if (typeof window === 'undefined' || !window.tf) {
      setSuccessPrediction({ error: 'TensorFlow Unavailable' });
      return;
    }

    try {
      const tf = window.tf;
      const inputVal = [stu.gpa / 4.0, stu.attendance / 100.0, stu.semester / 8.0];
      const model = tf.sequential();
      model.add(tf.layers.dense({ units: 4, activation: 'sigmoid', inputShape: [3] }));
      model.add(tf.layers.dense({ units: 2 }));
      
      const w1 = tf.tensor2d([
        [-2.0, 3.5],
        [-3.0, 2.5],
        [0.5, -0.5]
      ]);
      const b1 = tf.tensor1d([1.5, 0.5]);
      model.layers[1].setWeights([w1, b1]);
      
      const inputTensor = tf.tensor2d([inputVal], [1, 3]);
      const outputTensor = model.predict(inputTensor);
      const outputValues = await outputTensor.data();
      
      let riskProb = Math.max(0, Math.min(1, outputValues[0]));
      let projectedGpa = Math.max(1.0, Math.min(4.0, outputValues[1] * 4.0));
      
      if (stu.attendance < 70) {
        riskProb = Math.max(riskProb, 0.65);
      }
      if (stu.gpa < 2.0) {
        riskProb = Math.max(riskProb, 0.75);
      }
      if (stu.gpa >= 3.8 && stu.attendance >= 90) {
        riskProb = Math.min(riskProb, 0.02);
      }

      let riskLevel = 'Low Risk';
      let riskClass = 'bg-brand-accent-emerald/20 text-brand-accent-emerald';
      let riskBarColor = 'var(--color-brand-accent-emerald)';

      if (riskProb >= 0.45) {
        riskLevel = 'Critical Risk';
        riskClass = 'bg-brand-accent-ruby/20 text-brand-accent-ruby';
        riskBarColor = 'var(--color-brand-accent-ruby)';
      } else if (riskProb >= 0.15) {
        riskLevel = 'Moderate Risk';
        riskClass = 'bg-brand-accent-amber/20 text-brand-accent-amber';
        riskBarColor = 'var(--color-brand-accent-amber)';
      }

      setSuccessPrediction({
        riskProb,
        projectedGpa,
        riskLevel,
        riskClass,
        riskBarColor
      });

      w1.dispose();
      b1.dispose();
      inputTensor.dispose();
      outputTensor.dispose();
      model.dispose();
    } catch (err) {
      console.error('TF inference failed:', err);
      setSuccessPrediction({ error: 'Predictor Error' });
    }
  };

  useEffect(() => {
    if (activeStudent) {
      runSuccessPredictor(activeStudent);
    } else {
      setSuccessPrediction(null);
    }
  }, [activeStudent]);

  // Open Edit student Modal
  const openEditModal = (stu) => {
    setActiveStudent(null);
    setEditingStudent(stu);
    setFormData({ ...stu });
  };

  // Open Add student Modal
  const openAddModalForm = () => {
    setShowAddModal(true);
    setFormData({
      name: '',
      email: '',
      dept: departments[0]?.code || 'CS',
      semester: 1,
      gpa: 3.5,
      admissionDate: new Date().toISOString().split('T')[0],
      dob: '',
      gender: 'Male',
      phone: '',
      bloodGroup: 'O+',
      nationality: 'American',
      category: 'General',
      address: '',
      aadhar: '',
      guardianName: '',
      guardianRelation: 'Father',
      guardianPhone: '',
      previousSchool: '',
      enrollmentType: 'Regular',
      hostel: 'Day Scholar',
      scholarship: 'None',
      feeTotal: 4500,
      feePaid: 0,
      avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150'
    });
  };

  // Form input changes handler
  const handleFormChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  // Submit Changes (Edit)
  const saveEditChanges = () => {
    if (!formData.name || !formData.email) {
      alert("Name and Email are mandatory fields.");
      return;
    }
    
    const id = editingStudent.id;
    updateStudent(id, formData);

    // Sync to SQLite database
    fetch(`/api/users/usr_${id.toLowerCase()}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: formData.name,
        email: formData.email,
        avatar: formData.avatar
      })
    }).catch(err => console.error('Failed to sync student update to backend:', err));

    setEditingStudent(null);
    alert('Student profile updated successfully!');
  };

  // Delete Student Profile
  const deleteStudentProfile = () => {
    const id = editingStudent.id;
    if (confirm(`Permanently delete student ${editingStudent.name} (${id})?`)) {
      deleteStudent(id);

      // Sync delete to SQLite
      fetch(`/api/users/usr_${id.toLowerCase()}`, {
        method: 'DELETE'
      }).catch(err => console.error('Failed to sync student deletion to backend:', err));

      setEditingStudent(null);
      alert('Student record deleted.');
    }
  };

  // Submit Enrollment (Add)
  const saveNewStudent = () => {
    if (!formData.name || !formData.email) {
      alert("Full Name and Email are mandatory fields.");
      return;
    }

    const newId = 'STU' + String(students.length + 1).padStart(3, '0');
    const newStudent = {
      ...formData,
      id: newId,
      status: 'Active',
      attendance: 100,
      courses: []
    };

    addStudent(newStudent);

    // Register student account in backend SQLite database
    fetch('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: `usr_${newStudent.id.toLowerCase()}`,
        name: newStudent.name,
        email: newStudent.email,
        role: 'student',
        password: `${newStudent.name.split(' ')[0]}@${newStudent.id}`,
        avatar: newStudent.avatar
      })
    }).catch(err => console.error('Failed to sync student to backend:', err));

    setShowAddModal(false);
    alert(`Student ${newStudent.name} enrolled successfully!\nStudent ID: ${newId}`);
  };

  if (!currentUser) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="w-8 h-8 border-4 border-brand-primary/30 border-t-brand-primary rounded-full animate-spin"></div>
      </div>
    );
  }

  if (currentUser.role !== 'admin' && currentUser.role !== 'hod' && currentUser.role !== 'faculty') {
    return (
      <div className="card p-8 text-center bg-brand-bg-secondary border border-brand-border rounded-2xl animate-fade-in my-12">
        <div className="w-16 h-16 bg-brand-accent-ruby/10 text-brand-accent-ruby rounded-full flex items-center justify-center mx-auto mb-4 border border-brand-accent-ruby/20">
          <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
        </div>
        <h2 className="text-xl font-display font-bold text-brand-text-main">Access Denied</h2>
        <p className="text-brand-text-muted text-sm mt-2 max-w-md mx-auto">You do not have the required credentials to access this student registry.</p>
        <Link className="btn btn-secondary mt-6 cursor-pointer" href="/">Return to Home Portal</Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 md:gap-8">
      <div className="page-header animate-fade-in flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-display font-bold text-brand-text-main">Student Registry</h1>
          <p className="text-brand-text-muted mt-1 text-sm">Complete student lifecycle management — admissions, profiles, academics, and records.</p>
        </div>
        {currentUser?.role === 'admin' && (
          <button className="btn btn-primary cursor-pointer flex items-center gap-2" onClick={openAddModalForm}>
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="16" y1="11" x2="22" y2="11"/></svg>
            Enroll Student
          </button>
        )}
      </div>

      {/* Filters & Controls */}
      <div className="card animate-fade-in p-6 bg-brand-bg-secondary border border-brand-border rounded-2xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <div className="form-group mb-0 flex flex-col gap-1.5">
            <label className="form-label text-xs text-brand-text-muted font-semibold">Search Name / ID / Phone</label>
            <input 
              type="text" 
              className="bg-brand-bg-tertiary border border-brand-border text-brand-text-main p-2.5 rounded-xl outline-none"
              placeholder="e.g. Alex Rivera, STU001" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="form-group mb-0 flex flex-col gap-1.5">
            <label className="form-label text-xs text-brand-text-muted font-semibold">Department</label>
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
          <div className="form-group mb-0 flex flex-col gap-1.5">
            <label className="form-label text-xs text-brand-text-muted font-semibold">Status</label>
            <select 
              className="bg-brand-bg-tertiary border border-brand-border text-brand-text-main p-2.5 rounded-xl outline-none cursor-pointer"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="ALL">All Statuses</option>
              <option value="Active">Active</option>
              <option value="On Leave">On Leave</option>
              <option value="Graduated">Graduated</option>
            </select>
          </div>
          <div className="form-group mb-0 flex flex-col gap-1.5">
            <label className="form-label text-xs text-brand-text-muted font-semibold">Gender</label>
            <select 
              className="bg-brand-bg-tertiary border border-brand-border text-brand-text-main p-2.5 rounded-xl outline-none cursor-pointer"
              value={filterGender}
              onChange={(e) => setFilterGender(e.target.value)}
            >
              <option value="ALL">All</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>
      </div>

      {/* Student Table */}
      <div className="table-container animate-fade-in mt-2 overflow-x-auto bg-brand-bg-secondary border border-brand-border rounded-2xl">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-brand-border text-brand-text-subtle text-xs uppercase font-semibold">
              <th className="p-4">Student</th>
              <th className="p-4">ID</th>
              <th className="p-4">Dept</th>
              <th className="p-4">Sem</th>
              <th className="p-4">GPA</th>
              <th className="p-4">Attend.</th>
              <th className="p-4">Phone</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.length === 0 ? (
              <tr>
                <td colSpan="9" className="text-center text-brand-text-muted p-8 text-sm">No matching student profiles found.</td>
              </tr>
            ) : (
              filteredStudents.map(stu => {
                let statusClass = 'bg-brand-accent-emerald/10 text-brand-accent-emerald';
                if (stu.status === 'On Leave') statusClass = 'bg-brand-accent-amber/10 text-brand-accent-amber';
                if (stu.status === 'Graduated') statusClass = 'bg-brand-accent-cyan/10 text-brand-accent-cyan';

                let attendClass = 'text-brand-accent-emerald';
                if (stu.attendance < 85) attendClass = 'text-brand-accent-amber';
                if (stu.attendance < 75) attendClass = 'text-brand-accent-ruby';

                return (
                  <tr key={stu.id} className="border-b border-brand-border hover:bg-white/[0.01] transition-colors text-sm text-brand-text-main">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img src={stu.avatar} className="w-9 h-9 rounded-full object-cover border border-brand-border shrink-0" alt="" />
                        <div>
                          <div className="font-semibold">{stu.name}</div>
                          <div className="text-[0.7rem] text-brand-text-muted">{stu.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4"><code className="font-mono text-xs text-brand-text-muted">{stu.id}</code></td>
                    <td className="p-4">{stu.dept}</td>
                    <td className="p-4">Sem {stu.semester}</td>
                    <td className="p-4 font-semibold">{stu.gpa.toFixed(2)}</td>
                    <td className={`p-4 ${attendClass} font-semibold`}>{stu.attendance}%</td>
                    <td className="p-4 text-[0.8rem] text-brand-text-muted">{stu.phone || '—'}</td>
                    <td className="p-4"><span className={`badge ${statusClass} text-xs px-2 py-0.5 rounded`}>{stu.status}</span></td>
                    <td className="p-4 text-right relative">
                      {/* Vertical Kebab Menu */}
                      <button 
                        className="text-brand-text-muted hover:text-white p-2 rounded-lg transition-all focus:bg-brand-bg-tertiary cursor-pointer inline-flex items-center justify-center font-semibold"
                        onClick={() => setActiveKebabId(activeKebabId === stu.id ? null : stu.id)}
                      >
                        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/></svg>
                      </button>
                      {activeKebabId === stu.id && (
                        <div className="absolute right-4 top-12 bg-brand-bg-tertiary border border-brand-border rounded-xl shadow-2xl z-[100] w-36 text-left p-1.5 animate-scale-up">
                          <button 
                            className="w-full text-left px-3 py-2 text-xs font-semibold text-brand-text-main hover:bg-white/[0.05] rounded-lg cursor-pointer flex items-center gap-2"
                            onClick={() => { setActiveKebabId(null); setActiveStudent(stu); }}
                          >
                            View Profile
                          </button>
                          {currentUser?.role === 'admin' && (
                            <button 
                              className="w-full text-left px-3 py-2 text-xs font-semibold text-brand-primary hover:bg-brand-primary/10 rounded-lg cursor-pointer flex items-center gap-2"
                              onClick={() => { setActiveKebabId(null); openEditModal(stu); }}
                            >
                              Edit Profile
                            </button>
                          )}
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* DETAIL MODAL OVERLAY */}
      {activeStudent && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center z-[1000] p-4">
          <div className="modal-container bg-brand-bg-secondary border border-brand-border rounded-[20px] w-full max-w-[650px] max-h-[90vh] flex flex-col shadow-2xl animate-fade-in">
            <div className="modal-header p-5 px-6 border-b border-brand-border flex items-center justify-between">
              <h3 className="modal-title font-display text-xl font-semibold text-brand-text-main">Student Full Profile</h3>
              <button className="modal-close bg-transparent border-none text-brand-text-muted cursor-pointer text-2xl" onClick={() => setActiveStudent(null)}>&times;</button>
            </div>
            
            <div className="modal-body p-6 overflow-y-auto flex-1">
              <div className="flex gap-5 items-start mb-6 pb-5 border-b border-brand-border">
                <img src={activeStudent.avatar} className="w-[90px] h-[90px] rounded-full object-cover border-3 border-brand-primary shrink-0" alt="" />
                <div className="flex-1">
                  <h3 className="font-display text-lg font-semibold text-brand-text-main m-0 mb-1">{activeStudent.name}</h3>
                  <p className="text-brand-text-muted text-[0.85rem] m-0">Student ID: <code className="text-brand-primary">{activeStudent.id}</code> &nbsp;|&nbsp; {activeStudent.dept} Department</p>
                  <p className="text-brand-text-subtle text-[0.8rem] mt-1 m-0">{activeStudent.email} &nbsp;•&nbsp; {activeStudent.phone || 'No phone'}</p>
                  <div className="mt-2 flex gap-2">
                    <span className={`badge px-2 py-0.5 rounded text-xs ${activeStudent.status === 'Active' ? 'bg-brand-accent-emerald/10 text-brand-accent-emerald' : (activeStudent.status === 'On Leave' ? 'bg-brand-accent-amber/10 text-brand-accent-amber' : 'bg-brand-accent-cyan/10 text-brand-accent-cyan')}`}>{activeStudent.status}</span>
                    <span className="badge bg-brand-bg-tertiary text-brand-text-main text-xs px-2 py-0.5 rounded">Sem {activeStudent.semester}</span>
                    {activeStudent.scholarship && activeStudent.scholarship !== 'None' && <span className="badge bg-brand-primary/10 text-brand-primary text-xs px-2 py-0.5 rounded">{activeStudent.scholarship}</span>}
                  </div>
                </div>
              </div>

              {/* Personal Information Grid */}
              <h4 className="mb-3 font-display font-semibold text-brand-primary text-sm uppercase tracking-wide">Personal Information</h4>
              <div className="grid grid-cols-2 gap-x-6 gap-y-3 mb-6 text-sm">
                <div><span className="text-brand-text-muted">Date of Birth:</span> <strong className="text-brand-text-main">{activeStudent.dob || '—'}</strong></div>
                <div><span className="text-brand-text-muted">Gender:</span> <strong className="text-brand-text-main">{activeStudent.gender || '—'}</strong></div>
                <div><span className="text-brand-text-muted">Blood Group:</span> <strong className="text-brand-text-main">{activeStudent.bloodGroup || '—'}</strong></div>
                <div><span className="text-brand-text-muted">Nationality:</span> <strong className="text-brand-text-main">{activeStudent.nationality || '—'}</strong></div>
                <div><span className="text-brand-text-muted">Category:</span> <strong className="text-brand-text-main">{activeStudent.category || '—'}</strong></div>
                <div><span className="text-brand-text-muted">National ID:</span> <strong className="text-brand-text-main">{activeStudent.aadhar || '—'}</strong></div>
                <div className="col-span-2"><span className="text-brand-text-muted">Address:</span> <strong className="text-brand-text-main">{activeStudent.address || '—'}</strong></div>
              </div>

              {/* Guardian Information */}
              <h4 className="mb-3 font-display font-semibold text-brand-accent-cyan text-sm uppercase tracking-wide">Guardian & Admissions</h4>
              <div className="grid grid-cols-2 gap-x-6 gap-y-3 mb-6 text-sm">
                <div><span className="text-brand-text-muted">Guardian Name:</span> <strong className="text-brand-text-main">{activeStudent.guardianName || '—'}</strong></div>
                <div><span className="text-brand-text-muted">Relation:</span> <strong className="text-brand-text-main">{activeStudent.guardianRelation || '—'}</strong></div>
                <div><span className="text-brand-text-muted">Guardian Phone:</span> <strong className="text-brand-text-main">{activeStudent.guardianPhone || '—'}</strong></div>
                <div><span className="text-brand-text-muted">Previous School:</span> <strong className="text-brand-text-main">{activeStudent.previousSchool || '—'}</strong></div>
              </div>

              {/* Academic & Financial Summary */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="card p-4 bg-brand-bg-tertiary border border-brand-border rounded-xl">
                  <h4 className="mb-2.5 text-[0.9rem] font-semibold text-brand-accent-emerald flex items-center gap-1.5">📚 Academic Record</h4>
                  <div className="text-[0.85rem] flex flex-col gap-1.5 text-brand-text-muted">
                    <div>CGPA: <strong className="text-brand-text-main">{activeStudent.gpa.toFixed(2)}</strong></div>
                    <div>Attendance: <strong className={activeStudent.attendance < 75 ? 'text-brand-accent-ruby' : (activeStudent.attendance < 85 ? 'text-brand-accent-amber' : 'text-brand-accent-emerald')}>{activeStudent.attendance}%</strong></div>
                    <div>Admission Date: <strong className="text-brand-text-main">{activeStudent.admissionDate || '—'}</strong></div>
                    <div>Enrollment Type: <strong className="text-brand-text-main">{activeStudent.enrollmentType || 'Regular'}</strong></div>
                  </div>
                </div>
                <div className="card p-4 bg-brand-bg-tertiary border border-brand-border rounded-xl">
                  <h4 className="mb-2.5 text-[0.9rem] font-semibold text-brand-accent-amber flex items-center gap-1.5">💰 Financial Summary</h4>
                  <div className="text-[0.85rem] flex flex-col gap-1.5 text-brand-text-muted">
                    <div>Total Fees: <strong className="text-brand-text-main">${activeStudent.feeTotal.toLocaleString()}</strong></div>
                    <div>Paid: <strong className="text-brand-accent-emerald">${activeStudent.feePaid.toLocaleString()}</strong></div>
                    <div>Balance: <strong className={activeStudent.feeTotal - activeStudent.feePaid > 0 ? 'text-brand-accent-ruby' : 'text-brand-accent-emerald'}>${(activeStudent.feeTotal - activeStudent.feePaid).toLocaleString()}</strong></div>
                    <div>Hostel: <strong className="text-brand-text-main">{activeStudent.hostel || 'Day Scholar'}</strong></div>
                  </div>
                </div>
              </div>

              {/* Enrolled Courses */}
              <h4 className="mb-3 font-display font-semibold text-brand-primary text-sm uppercase tracking-wide">Course Enrollments</h4>
              <div className="table-container bg-brand-bg-tertiary rounded-xl border border-brand-border overflow-hidden mb-6">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-brand-border bg-brand-bg-secondary text-brand-text-subtle font-semibold">
                      <th className="p-2">Code</th><th>Title</th><th>Credits</th><th>Instructor</th>
                    </tr>
                  </thead>
                  <tbody>
                    {activeStudent.courses.length === 0 ? (
                      <tr><td colSpan="4" className="text-center p-4 text-brand-text-subtle">No active course enrollments.</td></tr>
                    ) : (
                      activeStudent.courses.map(code => {
                        const c = courses.find(item => item.code === code);
                        const fac = c ? faculty.find(f => f.id === c.facultyId) : null;
                        return (
                          <tr key={code} className="border-b border-brand-border text-brand-text-main">
                            <td className="p-2"><code>{code}</code></td>
                            <td className="p-2">{c ? c.title : 'External Course'}</td>
                            <td className="p-2">{c ? c.credits : '—'}</td>
                            <td className="p-2">{fac ? fac.name : 'TBD'}</td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>

              {/* AI SUCCESS PREDICTOR */}
              {successPrediction && (
                <div className="card p-4 bg-brand-bg-tertiary border border-brand-border rounded-xl">
                  <div className="flex items-center justify-between mb-3 pb-2 border-b border-brand-border/40">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-brand-primary animate-pulse"></span>
                      <span className="text-xs font-bold uppercase tracking-wider text-brand-text-main font-display">AI Academic Success Predictor</span>
                    </div>
                    {successPrediction.error ? (
                      <span className="badge bg-brand-accent-ruby/20 text-brand-accent-ruby text-[0.65rem] py-0.5 px-2 font-mono rounded">{successPrediction.error}</span>
                    ) : (
                      <span className={`badge ${successPrediction.riskClass} text-[0.65rem] py-0.5 px-2 font-mono rounded`}>{successPrediction.riskLevel}</span>
                    )}
                  </div>
                  {!successPrediction.error && (
                    <div className="grid grid-cols-2 gap-4 text-xs text-brand-text-muted">
                      <div>
                        <span className="text-[0.7rem] text-brand-text-subtle">Dropout Risk Probability:</span>
                        <div className="font-bold text-brand-text-main font-mono text-sm mt-1">{(successPrediction.riskProb * 100).toFixed(1)}%</div>
                      </div>
                      <div>
                        <span className="text-[0.7rem] text-brand-text-subtle">Projected Final GPA:</span>
                        <div className="font-bold text-brand-text-main font-mono text-sm mt-1">{successPrediction.projectedGpa.toFixed(2)} CGPA</div>
                      </div>
                      <div className="col-span-2">
                        <div className="w-full bg-brand-bg-secondary h-2.5 rounded-full overflow-hidden mt-1 relative border border-brand-border/40">
                          <div className="h-full rounded-full transition-all duration-300" style={{ width: `${successPrediction.riskProb * 100}%`, backgroundColor: successPrediction.riskBarColor }}></div>
                        </div>
                        <p className="text-[0.65rem] text-brand-text-subtle mt-2">
                          Neural network evaluating student CGPA ({activeStudent.gpa.toFixed(2)}), attendance ({activeStudent.attendance}%), and enrollment semester relative to graduation probability.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="modal-footer p-4 px-6 border-t border-brand-border flex justify-end gap-3 shrink-0">
              <button className="btn btn-secondary cursor-pointer" onClick={() => setActiveStudent(null)}>Close</button>
              <button className="btn btn-primary cursor-pointer" onClick={() => openEditModal(activeStudent)}>Edit Profile</button>
            </div>
          </div>
        </div>
      )}

      {/* EDIT MODAL OVERLAY */}
      {editingStudent && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center z-[1000] p-4">
          <div className="modal-container bg-brand-bg-secondary border border-brand-border rounded-[20px] w-full max-w-[600px] max-h-[90vh] flex flex-col shadow-2xl animate-fade-in">
            <div className="modal-header p-5 px-6 border-b border-brand-border flex items-center justify-between">
              <h3 className="modal-title font-display text-xl font-semibold text-brand-text-main">Edit Student — {editingStudent.id}</h3>
              <button className="modal-close bg-transparent border-none text-brand-text-muted cursor-pointer text-2xl" onClick={() => setEditingStudent(null)}>&times;</button>
            </div>

            <div className="modal-body p-6 overflow-y-auto flex-1">
              <form onSubmit={(e) => e.preventDefault()} className="flex flex-col gap-4">
                <h4 className="mb-1 font-display font-semibold text-brand-primary text-sm uppercase">Basic Info</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="form-group flex flex-col gap-1">
                    <label className="form-label text-xs font-semibold text-brand-text-muted">Full Name</label>
                    <input type="text" className="bg-brand-bg-tertiary border border-brand-border text-brand-text-main p-2 rounded-xl outline-none" id="name" value={formData.name || ''} onChange={handleFormChange} />
                  </div>
                  <div className="form-group flex flex-col gap-1">
                    <label className="form-label text-xs font-semibold text-brand-text-muted">Email</label>
                    <input type="email" className="bg-brand-bg-tertiary border border-brand-border text-brand-text-main p-2 rounded-xl outline-none" id="email" value={formData.email || ''} onChange={handleFormChange} />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="form-group flex flex-col gap-1">
                    <label className="form-label text-xs font-semibold text-brand-text-muted">Department</label>
                    <select className="bg-brand-bg-tertiary border border-brand-border text-brand-text-main p-2 rounded-xl outline-none" id="dept" value={formData.dept || 'CS'} onChange={handleFormChange}>
                      {departments.map(d => (
                        <option key={d.code} value={d.code}>{d.name} ({d.code})</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group flex flex-col gap-1">
                    <label className="form-label text-xs font-semibold text-brand-text-muted">Semester</label>
                    <input type="number" className="bg-brand-bg-tertiary border border-brand-border text-brand-text-main p-2 rounded-xl outline-none" id="semester" min="1" max="8" value={formData.semester || 1} onChange={handleFormChange} />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="form-group flex flex-col gap-1">
                    <label className="form-label text-xs font-semibold text-brand-text-muted">GPA</label>
                    <input type="number" className="bg-brand-bg-tertiary border border-brand-border text-brand-text-main p-2 rounded-xl outline-none" id="gpa" min="0" max="4" step="0.01" value={formData.gpa || 3.5} onChange={handleFormChange} />
                  </div>
                  <div className="form-group flex flex-col gap-1">
                    <label className="form-label text-xs font-semibold text-brand-text-muted">Status</label>
                    <select className="bg-brand-bg-tertiary border border-brand-border text-brand-text-main p-2 rounded-xl outline-none" id="status" value={formData.status || 'Active'} onChange={handleFormChange}>
                      <option>Active</option>
                      <option>On Leave</option>
                      <option>Graduated</option>
                    </select>
                  </div>
                </div>

                <h4 className="mt-4 mb-1 font-display font-semibold text-brand-accent-cyan text-sm uppercase">Personal Details</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="form-group flex flex-col gap-1">
                    <label className="form-label text-xs font-semibold text-brand-text-muted">Date of Birth</label>
                    <input type="date" className="bg-brand-bg-tertiary border border-brand-border text-brand-text-main p-2 rounded-xl outline-none" id="dob" value={formData.dob || ''} onChange={handleFormChange} />
                  </div>
                  <div className="form-group flex flex-col gap-1">
                    <label className="form-label text-xs font-semibold text-brand-text-muted">Gender</label>
                    <select className="bg-brand-bg-tertiary border border-brand-border text-brand-text-main p-2 rounded-xl outline-none" id="gender" value={formData.gender || 'Male'} onChange={handleFormChange}>
                      <option>Male</option>
                      <option>Female</option>
                      <option>Other</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="form-group flex flex-col gap-1">
                    <label className="form-label text-xs font-semibold text-brand-text-muted">Phone</label>
                    <input type="text" className="bg-brand-bg-tertiary border border-brand-border text-brand-text-main p-2 rounded-xl outline-none" id="phone" value={formData.phone || ''} onChange={handleFormChange} />
                  </div>
                  <div className="form-group flex flex-col gap-1">
                    <label className="form-label text-xs font-semibold text-brand-text-muted">Blood Group</label>
                    <select className="bg-brand-bg-tertiary border border-brand-border text-brand-text-main p-2 rounded-xl outline-none" id="bloodGroup" value={formData.bloodGroup || 'O+'} onChange={handleFormChange}>
                      {['A+','A-','B+','B-','AB+','AB-','O+','O-'].map(bg => <option key={bg}>{bg}</option>)}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="form-group flex flex-col gap-1">
                    <label className="form-label text-xs font-semibold text-brand-text-muted">Nationality</label>
                    <input type="text" className="bg-brand-bg-tertiary border border-brand-border text-brand-text-main p-2 rounded-xl outline-none" id="nationality" value={formData.nationality || ''} onChange={handleFormChange} />
                  </div>
                  <div className="form-group flex flex-col gap-1">
                    <label className="form-label text-xs font-semibold text-brand-text-muted">Category</label>
                    <select className="bg-brand-bg-tertiary border border-brand-border text-brand-text-main p-2 rounded-xl outline-none" id="category" value={formData.category || 'General'} onChange={handleFormChange}>
                      {['General','OBC','SC','ST','International','Other'].map(c => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                </div>

                <div className="form-group flex flex-col gap-1">
                  <label className="form-label text-xs font-semibold text-brand-text-muted">Address</label>
                  <textarea className="bg-brand-bg-tertiary border border-brand-border text-brand-text-main p-2 rounded-xl outline-none" id="address" rows="2" value={formData.address || ''} onChange={handleFormChange}></textarea>
                </div>
                <div className="form-group flex flex-col gap-1">
                  <label className="form-label text-xs font-semibold text-brand-text-muted">National ID / Aadhar</label>
                  <input type="text" className="bg-brand-bg-tertiary border border-brand-border text-brand-text-main p-2 rounded-xl outline-none" id="aadhar" value={formData.aadhar || ''} onChange={handleFormChange} />
                </div>

                <h4 className="mt-4 mb-1 font-display font-semibold text-brand-accent-emerald text-sm uppercase">Guardian Info</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="form-group flex flex-col gap-1">
                    <label className="form-label text-xs font-semibold text-brand-text-muted">Guardian Name</label>
                    <input type="text" className="bg-brand-bg-tertiary border border-brand-border text-brand-text-main p-2 rounded-xl outline-none" id="guardianName" value={formData.guardianName || ''} onChange={handleFormChange} />
                  </div>
                  <div className="form-group flex flex-col gap-1">
                    <label className="form-label text-xs font-semibold text-brand-text-muted">Relation</label>
                    <select className="bg-brand-bg-tertiary border border-brand-border text-brand-text-main p-2 rounded-xl outline-none" id="guardianRelation" value={formData.guardianRelation || 'Father'} onChange={handleFormChange}>
                      {['Father','Mother','Uncle','Aunt','Sibling','Guardian','Other'].map(r => <option key={r}>{r}</option>)}
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="form-group flex flex-col gap-1">
                    <label className="form-label text-xs font-semibold text-brand-text-muted">Guardian Phone</label>
                    <input type="text" className="bg-brand-bg-tertiary border border-brand-border text-brand-text-main p-2 rounded-xl outline-none" id="guardianPhone" value={formData.guardianPhone || ''} onChange={handleFormChange} />
                  </div>
                  <div className="form-group flex flex-col gap-1">
                    <label className="form-label text-xs font-semibold text-brand-text-muted">Previous School</label>
                    <input type="text" className="bg-brand-bg-tertiary border border-brand-border text-brand-text-main p-2 rounded-xl outline-none" id="previousSchool" value={formData.previousSchool || ''} onChange={handleFormChange} />
                  </div>
                </div>

                <h4 className="mt-4 mb-1 font-display font-semibold text-brand-accent-amber text-sm uppercase">Campus & Financial</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="form-group flex flex-col gap-1">
                    <label className="form-label text-xs font-semibold text-brand-text-muted">Enrollment Type</label>
                    <select className="bg-brand-bg-tertiary border border-brand-border text-brand-text-main p-2 rounded-xl outline-none" id="enrollmentType" value={formData.enrollmentType || 'Regular'} onChange={handleFormChange}>
                      {['Regular','Lateral Entry','Transfer','International Exchange'].map(t => <option key={t}>{t}</option>)}
                    </select>
                  </div>
                  <div className="form-group flex flex-col gap-1">
                    <label className="form-label text-xs font-semibold text-brand-text-muted">Admission Date</label>
                    <input type="date" className="bg-brand-bg-tertiary border border-brand-border text-brand-text-main p-2 rounded-xl outline-none" id="admissionDate" value={formData.admissionDate || ''} onChange={handleFormChange} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="form-group flex flex-col gap-1">
                    <label className="form-label text-xs font-semibold text-brand-text-muted">Hostel</label>
                    <input type="text" className="bg-brand-bg-tertiary border border-brand-border text-brand-text-main p-2 rounded-xl outline-none" id="hostel" value={formData.hostel || ''} onChange={handleFormChange} />
                  </div>
                  <div className="form-group flex flex-col gap-1">
                    <label className="form-label text-xs font-semibold text-brand-text-muted">Scholarship</label>
                    <input type="text" className="bg-brand-bg-tertiary border border-brand-border text-brand-text-main p-2 rounded-xl outline-none" id="scholarship" value={formData.scholarship || ''} onChange={handleFormChange} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="form-group flex flex-col gap-1">
                    <label className="form-label text-xs font-semibold text-brand-text-muted">Total Fee ($)</label>
                    <input type="number" className="bg-brand-bg-tertiary border border-brand-border text-brand-text-main p-2 rounded-xl outline-none" id="feeTotal" value={formData.feeTotal || 4500} onChange={handleFormChange} />
                  </div>
                  <div className="form-group flex flex-col gap-1">
                    <label className="form-label text-xs font-semibold text-brand-text-muted">Paid Fee ($)</label>
                    <input type="number" className="bg-brand-bg-tertiary border border-brand-border text-brand-text-main p-2 rounded-xl outline-none" id="feePaid" value={formData.feePaid || 0} onChange={handleFormChange} />
                  </div>
                </div>
                <div className="form-group flex flex-col gap-1">
                  <label className="form-label text-xs font-semibold text-brand-text-muted">Profile Image URL</label>
                  <input type="text" className="bg-brand-bg-tertiary border border-brand-border text-brand-text-main p-2 rounded-xl outline-none" id="avatar" value={formData.avatar || ''} onChange={handleFormChange} />
                </div>
              </form>
            </div>

            <div className="modal-footer p-4 px-6 border-t border-brand-border flex justify-between gap-3 shrink-0">
              <button className="btn bg-brand-accent-ruby text-white hover:bg-brand-accent-ruby/80 px-4 py-2 rounded-xl cursor-pointer text-xs" onClick={deleteStudentProfile}>Delete Profile</button>
              <div className="flex gap-2">
                <button className="btn btn-secondary cursor-pointer" onClick={() => setEditingStudent(null)}>Cancel</button>
                <button className="btn btn-primary cursor-pointer" onClick={saveEditChanges}>Save All Changes</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ADD MODAL OVERLAY */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center z-[1000] p-4">
          <div className="modal-container bg-brand-bg-secondary border border-brand-border rounded-[20px] w-full max-w-[600px] max-h-[90vh] flex flex-col shadow-2xl animate-fade-in">
            <div className="modal-header p-5 px-6 border-b border-brand-border flex items-center justify-between">
              <h3 className="modal-title font-display text-xl font-semibold text-brand-text-main">Enroll New Student</h3>
              <button className="modal-close bg-transparent border-none text-brand-text-muted cursor-pointer text-2xl" onClick={() => setShowAddModal(false)}>&times;</button>
            </div>

            <div className="modal-body p-6 overflow-y-auto flex-1">
              <form onSubmit={(e) => e.preventDefault()} className="flex flex-col gap-4">
                <h4 className="mb-1 font-display font-semibold text-brand-primary text-sm uppercase">Basic Info</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="form-group flex flex-col gap-1">
                    <label className="form-label text-xs font-semibold text-brand-text-muted">Full Name *</label>
                    <input type="text" className="bg-brand-bg-tertiary border border-brand-border text-brand-text-main p-2 rounded-xl outline-none" id="name" placeholder="e.g. Rahul Sharma" value={formData.name || ''} onChange={handleFormChange} />
                  </div>
                  <div className="form-group flex flex-col gap-1">
                    <label className="form-label text-xs font-semibold text-brand-text-muted">Email *</label>
                    <input type="email" className="bg-brand-bg-tertiary border border-brand-border text-brand-text-main p-2 rounded-xl outline-none" id="email" placeholder="e.g. rahul@modeluni.edu" value={formData.email || ''} onChange={handleFormChange} />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="form-group flex flex-col gap-1">
                    <label className="form-label text-xs font-semibold text-brand-text-muted">Department *</label>
                    <select className="bg-brand-bg-tertiary border border-brand-border text-brand-text-main p-2 rounded-xl outline-none" id="dept" value={formData.dept || 'CS'} onChange={handleFormChange}>
                      {departments.map(d => (
                        <option key={d.code} value={d.code}>{d.name} ({d.code})</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group flex flex-col gap-1">
                    <label className="form-label text-xs font-semibold text-brand-text-muted">Semester</label>
                    <input type="number" className="bg-brand-bg-tertiary border border-brand-border text-brand-text-main p-2 rounded-xl outline-none" id="semester" min="1" max="8" value={formData.semester || 1} onChange={handleFormChange} />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="form-group flex flex-col gap-1">
                    <label className="form-label text-xs font-semibold text-brand-text-muted">GPA</label>
                    <input type="number" className="bg-brand-bg-tertiary border border-brand-border text-brand-text-main p-2 rounded-xl outline-none" id="gpa" min="0" max="4" step="0.01" value={formData.gpa || 3.5} onChange={handleFormChange} />
                  </div>
                  <div className="form-group flex flex-col gap-1">
                    <label className="form-label text-xs font-semibold text-brand-text-muted">Admission Date</label>
                    <input type="date" className="bg-brand-bg-tertiary border border-brand-border text-brand-text-main p-2 rounded-xl outline-none" id="admissionDate" value={formData.admissionDate || ''} onChange={handleFormChange} />
                  </div>
                </div>

                <h4 className="mt-4 mb-1 font-display font-semibold text-brand-accent-cyan text-sm uppercase">Personal Details</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="form-group flex flex-col gap-1">
                    <label className="form-label text-xs font-semibold text-brand-text-muted">Date of Birth</label>
                    <input type="date" className="bg-brand-bg-tertiary border border-brand-border text-brand-text-main p-2 rounded-xl outline-none" id="dob" value={formData.dob || ''} onChange={handleFormChange} />
                  </div>
                  <div className="form-group flex flex-col gap-1">
                    <label className="form-label text-xs font-semibold text-brand-text-muted">Gender</label>
                    <select className="bg-brand-bg-tertiary border border-brand-border text-brand-text-main p-2 rounded-xl outline-none" id="gender" value={formData.gender || 'Male'} onChange={handleFormChange}>
                      <option>Male</option>
                      <option>Female</option>
                      <option>Other</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="form-group flex flex-col gap-1">
                    <label className="form-label text-xs font-semibold text-brand-text-muted">Phone</label>
                    <input type="text" className="bg-brand-bg-tertiary border border-brand-border text-brand-text-main p-2 rounded-xl outline-none" id="phone" placeholder="+91-xxxxx-xxxxx" value={formData.phone || ''} onChange={handleFormChange} />
                  </div>
                  <div className="form-group flex flex-col gap-1">
                    <label className="form-label text-xs font-semibold text-brand-text-muted">Blood Group</label>
                    <select className="bg-brand-bg-tertiary border border-brand-border text-brand-text-main p-2 rounded-xl outline-none" id="bloodGroup" value={formData.bloodGroup || 'O+'} onChange={handleFormChange}>
                      {['A+','A-','B+','B-','AB+','AB-','O+','O-'].map(bg => <option key={bg}>{bg}</option>)}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="form-group flex flex-col gap-1">
                    <label className="form-label text-xs font-semibold text-brand-text-muted">Nationality</label>
                    <input type="text" className="bg-brand-bg-tertiary border border-brand-border text-brand-text-main p-2 rounded-xl outline-none" id="nationality" value={formData.nationality || 'American'} onChange={handleFormChange} />
                  </div>
                  <div className="form-group flex flex-col gap-1">
                    <label className="form-label text-xs font-semibold text-brand-text-muted">Category</label>
                    <select className="bg-brand-bg-tertiary border border-brand-border text-brand-text-main p-2 rounded-xl outline-none" id="category" value={formData.category || 'General'} onChange={handleFormChange}>
                      {['General','OBC','SC','ST','International','Other'].map(c => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                </div>

                <div className="form-group flex flex-col gap-1">
                  <label className="form-label text-xs font-semibold text-brand-text-muted">Address</label>
                  <textarea className="bg-brand-bg-tertiary border border-brand-border text-brand-text-main p-2 rounded-xl outline-none" id="address" rows="2" value={formData.address || ''} onChange={handleFormChange}></textarea>
                </div>
                <div className="form-group flex flex-col gap-1">
                  <label className="form-label text-xs font-semibold text-brand-text-muted">National ID / Aadhar</label>
                  <input type="text" className="bg-brand-bg-tertiary border border-brand-border text-brand-text-main p-2 rounded-xl outline-none" id="aadhar" placeholder="XXXX-XXXX-XXXX" value={formData.aadhar || ''} onChange={handleFormChange} />
                </div>

                <h4 className="mt-4 mb-1 font-display font-semibold text-brand-accent-emerald text-sm uppercase">Guardian Info</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="form-group flex flex-col gap-1">
                    <label className="form-label text-xs font-semibold text-brand-text-muted">Guardian Name</label>
                    <input type="text" className="bg-brand-bg-tertiary border border-brand-border text-brand-text-main p-2 rounded-xl outline-none" id="guardianName" value={formData.guardianName || ''} onChange={handleFormChange} />
                  </div>
                  <div className="form-group flex flex-col gap-1">
                    <label className="form-label text-xs font-semibold text-brand-text-muted">Relation</label>
                    <select className="bg-brand-bg-tertiary border border-brand-border text-brand-text-main p-2 rounded-xl outline-none" id="guardianRelation" value={formData.guardianRelation || 'Father'} onChange={handleFormChange}>
                      {['Father','Mother','Uncle','Aunt','Sibling','Guardian','Other'].map(r => <option key={r}>{r}</option>)}
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="form-group flex flex-col gap-1">
                    <label className="form-label text-xs font-semibold text-brand-text-muted">Guardian Phone</label>
                    <input type="text" className="bg-brand-bg-tertiary border border-brand-border text-brand-text-main p-2 rounded-xl outline-none" id="guardianPhone" value={formData.guardianPhone || ''} onChange={handleFormChange} />
                  </div>
                  <div className="form-group flex flex-col gap-1">
                    <label className="form-label text-xs font-semibold text-brand-text-muted">Previous School</label>
                    <input type="text" className="bg-brand-bg-tertiary border border-brand-border text-brand-text-main p-2 rounded-xl outline-none" id="previousSchool" value={formData.previousSchool || ''} onChange={handleFormChange} />
                  </div>
                </div>

                <h4 className="mt-4 mb-1 font-display font-semibold text-brand-accent-amber text-sm uppercase">Campus & Financial</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="form-group flex flex-col gap-1">
                    <label className="form-label text-xs font-semibold text-brand-text-muted">Enrollment Type</label>
                    <select className="bg-brand-bg-tertiary border border-brand-border text-brand-text-main p-2 rounded-xl outline-none" id="enrollmentType" value={formData.enrollmentType || 'Regular'} onChange={handleFormChange}>
                      {['Regular','Lateral Entry','Transfer','International Exchange'].map(t => <option key={t}>{t}</option>)}
                    </select>
                  </div>
                  <div className="form-group flex flex-col gap-1">
                    <label className="form-label text-xs font-semibold text-brand-text-muted">Hostel</label>
                    <input type="text" className="bg-brand-bg-tertiary border border-brand-border text-brand-text-main p-2 rounded-xl outline-none" id="hostel" placeholder="Day Scholar" value={formData.hostel || ''} onChange={handleFormChange} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="form-group flex flex-col gap-1">
                    <label className="form-label text-xs font-semibold text-brand-text-muted">Scholarship</label>
                    <input type="text" className="bg-brand-bg-tertiary border border-brand-border text-brand-text-main p-2 rounded-xl outline-none" id="scholarship" value={formData.scholarship || ''} onChange={handleFormChange} />
                  </div>
                  <div className="form-group flex flex-col gap-1">
                    <label className="form-label text-xs font-semibold text-brand-text-muted">Total Fee ($)</label>
                    <input type="number" className="bg-brand-bg-tertiary border border-brand-border text-brand-text-main p-2 rounded-xl outline-none" id="feeTotal" value={formData.feeTotal || 4500} onChange={handleFormChange} />
                  </div>
                </div>
                <div className="form-group flex flex-col gap-1">
                  <label className="form-label text-xs font-semibold text-brand-text-muted">Profile Image URL</label>
                  <input type="text" className="bg-brand-bg-tertiary border border-brand-border text-brand-text-main p-2 rounded-xl outline-none" id="avatar" value={formData.avatar || ''} onChange={handleFormChange} />
                </div>
              </form>
            </div>

            <div className="modal-footer p-4 px-6 border-t border-brand-border flex justify-end gap-3 shrink-0">
              <button className="btn btn-secondary cursor-pointer" onClick={() => setShowAddModal(false)}>Cancel</button>
              <button className="btn btn-primary cursor-pointer" onClick={saveNewStudent}>Complete Enrollment</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
