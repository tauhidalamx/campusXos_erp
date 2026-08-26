'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function StaffPage() {
  const [currentUser, setCurrentUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState('All');
  const [showAddModal, setShowAddModal] = useState(false);
  
  // Dummy staff data
  const [staff, setStaff] = useState([
    { id: 'STF001', name: 'Alok Sharma', role: 'Registrar', dept: 'Administration', email: 'registrar@campusx.edu', phone: '+91 98765 43210', status: 'Active', shift: 'General' },
    { id: 'STF002', name: 'Bhavna Joshi', role: 'Chief Librarian', dept: 'Library Services', email: 'librarian@campusx.edu', phone: '+91 98765 43211', status: 'Active', shift: 'General' },
    { id: 'STF003', name: 'Major Vikram Singh', role: 'Chief Warden', dept: 'Hostel Operations', email: 'warden@campusx.edu', phone: '+91 98765 43212', status: 'Active', shift: 'Night' },
    { id: 'STF004', name: 'Devendra Patil', role: 'Security Coordinator', dept: 'Campus Security', email: 'security@campusx.edu', phone: '+91 98765 43213', status: 'Active', shift: 'Rotational' },
    { id: 'STF005', name: 'Anjali Desai', role: 'IT Support Engineer', dept: 'Information Technology', email: 'itsupport@campusx.edu', phone: '+91 98765 43214', status: 'Active', shift: 'General' },
    { id: 'STF006', name: 'Ramesh Chawla', role: 'Assistant Warden', dept: 'Hostel Operations', email: 'asstwarden@campusx.edu', phone: '+91 98765 43215', status: 'On Leave', shift: 'Day' },
    { id: 'STF007', name: 'Sanjay Kumar', role: 'System Administrator', dept: 'Information Technology', email: 'sysadmin@campusx.edu', phone: '+91 98765 43216', status: 'Active', shift: 'Rotational' }
  ]);

  const [newStaff, setNewStaff] = useState({
    name: '', role: '', dept: 'Administration', email: '', phone: '', shift: 'General'
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const session = sessionStorage.getItem('campusx_erp_session');
      if (session) {
        setCurrentUser(JSON.parse(session));
      }
    }
  }, []);

  if (!currentUser || currentUser.role !== 'admin') {
    return (
      <div className="card p-8 text-center bg-brand-bg-secondary border border-brand-border rounded-2xl animate-fade-in my-12">
        <div className="w-16 h-16 bg-brand-accent-ruby/10 text-brand-accent-ruby rounded-full flex items-center justify-center mx-auto mb-4 border border-brand-accent-ruby/20">
          <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
        </div>
        <h2 className="text-xl font-display font-bold text-brand-text-main">Access Denied</h2>
        <p className="text-brand-text-muted text-sm mt-2 max-w-md mx-auto">You do not have the administrative privileges required to view the Staff Directory.</p>
        <Link className="btn btn-secondary mt-6 cursor-pointer" href="/">Return to Dashboard</Link>
      </div>
    );
  }

  const handleAddStaffSubmit = (e) => {
    e.preventDefault();
    if (!newStaff.name || !newStaff.role || !newStaff.email) {
      alert('Please fill in all required fields.');
      return;
    }
    const staffMember = {
      id: `STF0${staff.length + 1}`,
      name: newStaff.name,
      role: newStaff.role,
      dept: newStaff.dept,
      email: newStaff.email,
      phone: newStaff.phone || 'N/A',
      status: 'Active',
      shift: newStaff.shift
    };
    setStaff([...staff, staffMember]);
    setNewStaff({ name: '', role: '', dept: 'Administration', email: '', phone: '', shift: 'General' });
    setShowAddModal(false);
    alert('New staff member added successfully!');
  };

  const toggleStatus = (id) => {
    setStaff(prev => prev.map(s => s.id === id ? { ...s, status: s.status === 'Active' ? 'Inactive' : 'Active' } : s));
  };

  const changeShift = (id, newShift) => {
    setStaff(prev => prev.map(s => s.id === id ? { ...s, shift: newShift } : s));
    alert(`Shift successfully updated.`);
  };

  const filteredStaff = staff.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          s.role.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          s.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDept = selectedDept === 'All' || s.dept === selectedDept;
    return matchesSearch && matchesDept;
  });

  return (
    <div className="flex flex-col gap-6 md:gap-8">
      {/* Header */}
      <div className="page-header animate-fade-in flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-brand-text-main">Staff Directory</h1>
          <p className="text-brand-text-muted mt-1 text-sm">Manage non-academic campus staff divisions, roles, shifts, and system directories.</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="btn btn-primary cursor-pointer flex items-center gap-1.5"
        >
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Add Staff Member
        </button>
      </div>

      {/* Filters Area */}
      <div className="card p-4 bg-brand-bg-secondary border border-brand-border rounded-2xl flex flex-col md:flex-row gap-4 justify-between items-center animate-fade-in">
        <div className="w-full md:w-80 relative">
          <input 
            type="text"
            placeholder="Search by name, ID, or title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-brand-bg-tertiary border border-brand-border text-brand-text-main px-4 py-2.5 pl-10 rounded-xl text-sm outline-none focus:border-brand-primary/40"
          />
          <svg className="absolute left-3.5 top-3.5 text-brand-text-subtle" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        </div>
        <div className="flex gap-2 w-full md:w-auto justify-end overflow-x-auto pb-1 md:pb-0">
          {['All', 'Administration', 'Library Services', 'Hostel Operations', 'Campus Security', 'Information Technology'].map(dept => (
            <button
              key={dept}
              onClick={() => setSelectedDept(dept)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap cursor-pointer transition-all ${selectedDept === dept ? 'bg-brand-primary text-white' : 'bg-brand-bg-tertiary text-brand-text-muted hover:text-brand-text-main'}`}
            >
              {dept}
            </button>
          ))}
        </div>
      </div>

      {/* Staff Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
        {filteredStaff.map(s => (
          <div key={s.id} className="card p-5 bg-brand-bg-secondary border border-brand-border rounded-2xl flex flex-col gap-4">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] font-mono bg-brand-bg-tertiary text-brand-text-muted px-2 py-0.5 rounded border border-brand-border/40">{s.id}</span>
                <h3 className="text-base font-semibold text-brand-text-main mt-1.5 mb-0.5">{s.name}</h3>
                <span className="text-xs text-brand-accent-cyan font-medium">{s.role}</span>
              </div>
              <span className={`badge text-[10px] px-2 py-0.5 rounded-full font-bold ${s.status === 'Active' ? 'bg-brand-accent-emerald/10 text-brand-accent-emerald border border-brand-accent-emerald/20' : 'bg-brand-accent-amber/10 text-brand-accent-amber border border-brand-accent-amber/20'}`}>
                {s.status}
              </span>
            </div>

            <div className="flex flex-col gap-2 border-t border-brand-border/40 pt-3 text-xs text-brand-text-muted">
              <div className="flex justify-between">
                <span>Department:</span>
                <strong className="text-brand-text-main font-semibold">{s.dept}</strong>
              </div>
              <div className="flex justify-between">
                <span>Email:</span>
                <span className="font-mono text-brand-text-subtle">{s.email}</span>
              </div>
              <div className="flex justify-between">
                <span>Phone:</span>
                <span className="font-mono">{s.phone}</span>
              </div>
              <div className="flex justify-between items-center mt-1">
                <span>Shift Status:</span>
                <select
                  value={s.shift}
                  onChange={(e) => changeShift(s.id, e.target.value)}
                  className="bg-brand-bg-tertiary border border-brand-border text-brand-text-main p-1 rounded text-[11px] outline-none font-semibold cursor-pointer"
                >
                  <option value="General">General (9AM-5PM)</option>
                  <option value="Day">Day Shift</option>
                  <option value="Night">Night Shift</option>
                  <option value="Rotational">Rotational</option>
                </select>
              </div>
            </div>

            <div className="flex gap-2 mt-2 border-t border-brand-border/40 pt-3">
              <button 
                onClick={() => toggleStatus(s.id)}
                className="btn btn-secondary text-xs flex-1 py-1.5 cursor-pointer hover:border-brand-primary/40"
              >
                {s.status === 'Active' ? 'Deactivate' : 'Activate'}
              </button>
              <a 
                href={`mailto:${s.email}`}
                className="btn btn-primary text-xs flex-1 py-1.5 text-center items-center justify-center cursor-pointer"
              >
                Send Email
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Add Staff Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-[999] p-4">
          <div className="bg-brand-bg-secondary border border-brand-border rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-scale-up">
            <div className="flex justify-between items-center px-6 py-4 border-b border-brand-border">
              <h3 className="font-display text-base font-bold text-brand-text-main m-0">Add New Staff Member</h3>
              <button 
                onClick={() => setShowAddModal(false)}
                className="text-brand-text-muted hover:text-white cursor-pointer"
              >
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>
            <form onSubmit={handleAddStaffSubmit} className="p-6 flex flex-col gap-4 text-sm">
              <div>
                <label className="block text-xs font-semibold text-brand-text-subtle mb-1.5">Full Name *</label>
                <input 
                  type="text"
                  required
                  value={newStaff.name}
                  onChange={(e) => setNewStaff({...newStaff, name: e.target.value})}
                  className="w-full bg-brand-bg-tertiary border border-brand-border text-brand-text-main p-2.5 rounded-xl outline-none focus:border-brand-primary"
                  placeholder="e.g. Ramesh Kumar"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-brand-text-subtle mb-1.5">System Role / Designation *</label>
                <input 
                  type="text"
                  required
                  value={newStaff.role}
                  onChange={(e) => setNewStaff({...newStaff, role: e.target.value})}
                  className="w-full bg-brand-bg-tertiary border border-brand-border text-brand-text-main p-2.5 rounded-xl outline-none focus:border-brand-primary"
                  placeholder="e.g. Security Officer"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-brand-text-subtle mb-1.5">Division *</label>
                  <select 
                    value={newStaff.dept}
                    onChange={(e) => setNewStaff({...newStaff, dept: e.target.value})}
                    className="w-full bg-brand-bg-tertiary border border-brand-border text-brand-text-main p-2.5 rounded-xl outline-none font-semibold cursor-pointer"
                  >
                    <option value="Administration">Administration</option>
                    <option value="Library Services">Library Services</option>
                    <option value="Hostel Operations">Hostel Operations</option>
                    <option value="Campus Security">Campus Security</option>
                    <option value="Information Technology">Information Technology</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-brand-text-subtle mb-1.5">Shift Type</label>
                  <select 
                    value={newStaff.shift}
                    onChange={(e) => setNewStaff({...newStaff, shift: e.target.value})}
                    className="w-full bg-brand-bg-tertiary border border-brand-border text-brand-text-main p-2.5 rounded-xl outline-none font-semibold cursor-pointer"
                  >
                    <option value="General">General</option>
                    <option value="Day">Day Shift</option>
                    <option value="Night">Night Shift</option>
                    <option value="Rotational">Rotational</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-brand-text-subtle mb-1.5">Official Email *</label>
                <input 
                  type="email"
                  required
                  value={newStaff.email}
                  onChange={(e) => setNewStaff({...newStaff, email: e.target.value})}
                  className="w-full bg-brand-bg-tertiary border border-brand-border text-brand-text-main p-2.5 rounded-xl outline-none focus:border-brand-primary font-mono"
                  placeholder="name@campusx.edu"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-brand-text-subtle mb-1.5">Contact Number</label>
                <input 
                  type="text"
                  value={newStaff.phone}
                  onChange={(e) => setNewStaff({...newStaff, phone: e.target.value})}
                  className="w-full bg-brand-bg-tertiary border border-brand-border text-brand-text-main p-2.5 rounded-xl outline-none focus:border-brand-primary font-mono"
                  placeholder="+91 99999 99999"
                />
              </div>
              <div className="flex gap-3 justify-end mt-4">
                <button 
                  type="button" 
                  onClick={() => setShowAddModal(false)}
                  className="btn btn-secondary cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn btn-primary cursor-pointer"
                >
                  Save Member
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
