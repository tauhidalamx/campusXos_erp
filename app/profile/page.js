'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  User, 
  Mail, 
  Shield, 
  Key, 
  Phone, 
  Building, 
  CheckCircle, 
  Save, 
  Camera, 
  Clock, 
  Sparkles,
  Award,
  AlertCircle
} from 'lucide-react';
import { db, doc, setDoc, isFirebaseConfigured } from '../../lib/firebase';

const SESSION_KEY = 'campusx_erp_session';
const USERS_KEY = 'campusx_erp_users';

const roleDisplayMap = {
  superadmin: 'Global Super Administrator',
  platformadmin: 'Platform Administrator',
  admin: 'University Administrator',
  registrar: 'Registrar Officer',
  dean: 'Dean of Faculty',
  hod: 'Head of Department (HOD)',
  faculty: 'Faculty Professor / Lecturer',
  student: 'Student (Undergraduate / Postgraduate)',
  finance_manager: 'Finance & Accounts Manager',
  placement_officer: 'Placement Officer',
  recruiter: 'Corporate Recruiter',
  alumni: 'Alumni Member',
  parent: 'Parent / Guardian'
};

export default function AccountProfilePage() {
  const [currentUser, setCurrentUser] = useState(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('student');
  const [phone, setPhone] = useState('+1 (555) 234-5678');
  const [dept, setDept] = useState('Computer Science & Engineering');
  const [bio, setBio] = useState('CampusX OS verified university member.');
  const [avatar, setAvatar] = useState('');
  
  // Security
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [saveSuccess, setSaveSuccess] = useState('');
  const [saveError, setSaveError] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const sessionStr = sessionStorage.getItem(SESSION_KEY) || localStorage.getItem(SESSION_KEY);
      if (sessionStr) {
        try {
          const user = JSON.parse(sessionStr);
          setCurrentUser(user);
          setName(user.name || 'Campus User');
          setEmail(user.email || 'user@campusx.edu');
          setRole(user.role || 'student');
          setAvatar(user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150');
        } catch (e) {
          console.error('Session parse error:', e);
        }
      }
    }
  }, []);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setSaveError('');
    setSaveSuccess('');
    setIsSaving(true);

    if (!name.trim() || !email.trim()) {
      setSaveError('Name and email are required.');
      setIsSaving(false);
      return;
    }

    if (newPassword && newPassword.length < 6) {
      setSaveError('New password must be at least 6 characters.');
      setIsSaving(false);
      return;
    }

    if (newPassword && newPassword !== confirmPassword) {
      setSaveError('Passwords do not match.');
      setIsSaving(false);
      return;
    }

    const updatedUser = {
      ...currentUser,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      role: role,
      phone: phone.trim(),
      dept: dept.trim(),
      bio: bio.trim(),
      avatar: avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      updatedAt: new Date().toISOString()
    };

    // 1. Sync session in localStorage and sessionStorage
    if (typeof window !== 'undefined') {
      sessionStorage.setItem(SESSION_KEY, JSON.stringify(updatedUser));
      localStorage.setItem(SESSION_KEY, JSON.stringify(updatedUser));

      // Sync in user registry
      try {
        const storedUsers = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
        const filtered = storedUsers.filter(u => u.email !== updatedUser.email && u.id !== updatedUser.id);
        filtered.push(updatedUser);
        localStorage.setItem(USERS_KEY, JSON.stringify(filtered));
      } catch (err) {
        console.warn('Local storage sync error:', err);
      }
    }

    // 2. Sync in Firestore if Firebase is configured
    if (isFirebaseConfigured && updatedUser.id) {
      try {
        await setDoc(doc(db, 'users', updatedUser.id), updatedUser, { merge: true });
      } catch (fbErr) {
        console.warn('Firestore profile sync note:', fbErr.message);
      }
    }

    setCurrentUser(updatedUser);
    setIsSaving(false);
    setSaveSuccess('Account profile updated successfully!');
    setNewPassword('');
    setConfirmPassword('');

    setTimeout(() => {
      setSaveSuccess('');
    }, 4000);
  };

  const avatarPresets = [
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
    'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150'
  ];

  if (!currentUser) {
    return (
      <div className="min-h-[500px] flex items-center justify-center p-6">
        <div className="card max-w-md w-full p-8 text-center bg-brand-bg-secondary border border-brand-border rounded-3xl">
          <div className="w-12 h-12 rounded-full bg-brand-primary/10 border border-brand-primary/20 text-brand-primary flex items-center justify-center mx-auto mb-4">
            <User className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-display font-bold text-brand-text-main">No Active Session</h2>
          <p className="text-sm text-brand-text-muted mt-2">Please sign in to access your institutional profile settings.</p>
          <Link href="/login" className="btn btn-primary mt-6 inline-block w-full text-center">
            Sign In to Account
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 md:gap-8 max-w-5xl mx-auto w-full pb-12">
      {/* Header Banner */}
      <div className="page-header flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 sm:p-8 bg-gradient-to-r from-indigo-950/40 via-brand-bg-secondary to-indigo-950/30 border border-brand-border rounded-3xl backdrop-blur-xl relative overflow-hidden">
        <div className="flex items-center gap-5 relative z-10">
          <div className="relative group">
            <img 
              src={avatar} 
              alt={name} 
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border-2 border-brand-primary shadow-xl"
            />
            <div className="absolute inset-0 bg-black/40 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
              <Camera className="w-6 h-6" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-2xl sm:text-3xl font-display font-bold text-brand-text-main">{name}</h1>
              <span className="badge py-1 px-3 bg-brand-primary/15 text-brand-primary border border-brand-primary/30 rounded-full text-xs font-semibold">
                {roleDisplayMap[role] || role.toUpperCase()}
              </span>
            </div>
            <p className="text-brand-text-muted text-xs sm:text-sm mt-1 flex items-center gap-3">
              <span>{email}</span>
              <span>•</span>
              <span className="text-brand-accent-emerald font-medium flex items-center gap-1">
                <CheckCircle className="w-3.5 h-3.5" /> Verified Account
              </span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 relative z-10">
          <Link href="/settings" className="btn btn-secondary text-xs sm:text-sm">
            Preferences
          </Link>
        </div>
      </div>

      {/* Save Success / Error Alerts */}
      {saveSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-sm flex items-center gap-3 animate-fade-in">
          <CheckCircle className="w-5 h-5 shrink-0" />
          <span>{saveSuccess}</span>
        </div>
      )}

      {saveError && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/25 text-rose-400 text-sm flex items-center gap-3 animate-fade-in">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{saveError}</span>
        </div>
      )}

      {/* Main Account Edit Form */}
      <form onSubmit={handleUpdateProfile} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Profile & Contact Details */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <div className="card p-6 sm:p-8 bg-brand-bg-secondary border border-brand-border rounded-3xl flex flex-col gap-6">
            <div className="border-b border-brand-border/40 pb-4">
              <h3 className="text-lg font-bold font-display text-brand-text-main flex items-center gap-2">
                <User className="w-5 h-5 text-brand-primary" />
                Personal & Institutional Information
              </h3>
              <p className="text-xs text-brand-text-muted mt-1">Manage your identity, department affiliation, and contact records.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-brand-text-muted">Full Name</label>
                <input 
                  type="text" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-brand-bg-tertiary border border-brand-border rounded-xl px-4 py-2.5 text-sm text-brand-text-main outline-none focus:border-brand-primary transition-all"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-brand-text-muted">Institutional Email</label>
                <input 
                  type="email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-brand-bg-tertiary border border-brand-border rounded-xl px-4 py-2.5 text-sm text-brand-text-main outline-none focus:border-brand-primary transition-all"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-brand-text-muted">Contact Phone</label>
                <input 
                  type="text" 
                  value={phone} 
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-brand-bg-tertiary border border-brand-border rounded-xl px-4 py-2.5 text-sm text-brand-text-main outline-none focus:border-brand-primary transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-brand-text-muted">Department / Faculty</label>
                <input 
                  type="text" 
                  value={dept} 
                  onChange={(e) => setDept(e.target.value)}
                  className="w-full bg-brand-bg-tertiary border border-brand-border rounded-xl px-4 py-2.5 text-sm text-brand-text-main outline-none focus:border-brand-primary transition-all"
                />
              </div>

              <div className="col-span-1 sm:col-span-2 space-y-1.5">
                <label className="text-xs font-semibold text-brand-text-muted">Bio / Academic Note</label>
                <textarea 
                  value={bio} 
                  onChange={(e) => setBio(e.target.value)}
                  rows={3}
                  className="w-full bg-brand-bg-tertiary border border-brand-border rounded-xl px-4 py-2.5 text-sm text-brand-text-main outline-none focus:border-brand-primary transition-all resize-none"
                />
              </div>
            </div>

            {/* Avatar Preset Chooser */}
            <div className="space-y-2 pt-2 border-t border-brand-border/40">
              <label className="text-xs font-semibold text-brand-text-muted">Choose Profile Avatar</label>
              <div className="flex flex-wrap gap-3 items-center">
                {avatarPresets.map((p, idx) => (
                  <button
                    type="button"
                    key={idx}
                    onClick={() => setAvatar(p)}
                    className={`w-11 h-11 rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${avatar === p ? 'border-brand-primary scale-105 shadow-md' : 'border-brand-border opacity-70 hover:opacity-100'}`}
                  >
                    <img src={p} alt="Preset" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Security & Password Card */}
          <div className="card p-6 sm:p-8 bg-brand-bg-secondary border border-brand-border rounded-3xl flex flex-col gap-6">
            <div className="border-b border-brand-border/40 pb-4">
              <h3 className="text-lg font-bold font-display text-brand-text-main flex items-center gap-2">
                <Key className="w-5 h-5 text-brand-accent-amber" />
                Security & Password Update
              </h3>
              <p className="text-xs text-brand-text-muted mt-1">Change your account security password or reset authentication tokens.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-brand-text-muted">New Password (optional)</label>
                <input 
                  type="password" 
                  value={newPassword} 
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Leave blank to keep unchanged"
                  className="w-full bg-brand-bg-tertiary border border-brand-border rounded-xl px-4 py-2.5 text-sm text-brand-text-main outline-none focus:border-brand-primary transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-brand-text-muted">Confirm New Password</label>
                <input 
                  type="password" 
                  value={confirmPassword} 
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repeat new password"
                  className="w-full bg-brand-bg-tertiary border border-brand-border rounded-xl px-4 py-2.5 text-sm text-brand-text-main outline-none focus:border-brand-primary transition-all"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right 1 Col: Session & Clearance Overview */}
        <div className="flex flex-col gap-6">
          <div className="card p-6 bg-brand-bg-secondary border border-brand-border rounded-3xl flex flex-col gap-5">
            <h3 className="text-base font-bold font-display text-brand-text-main flex items-center gap-2 border-b border-brand-border/40 pb-3">
              <Shield className="w-4 h-4 text-brand-accent-cyan" />
              Institutional Clearance
            </h3>

            <div className="flex flex-col gap-3 text-xs">
              <div className="flex justify-between items-center py-1.5 border-b border-brand-border/20">
                <span className="text-brand-text-muted">Account ID:</span>
                <code className="text-brand-primary font-mono text-xs">{currentUser.id || 'usr_001'}</code>
              </div>
              <div className="flex justify-between items-center py-1.5 border-b border-brand-border/20">
                <span className="text-brand-text-muted">Assigned Role:</span>
                <span className="font-bold text-brand-text-main">{role.toUpperCase()}</span>
              </div>
              <div className="flex justify-between items-center py-1.5 border-b border-brand-border/20">
                <span className="text-brand-text-muted">Auth Engine:</span>
                <span className="text-brand-accent-emerald font-semibold">{isFirebaseConfigured ? 'Firebase Cloud' : 'Local Enterprise Engine'}</span>
              </div>
              <div className="flex justify-between items-center py-1.5">
                <span className="text-brand-text-muted">Session Status:</span>
                <span className="text-brand-accent-emerald font-bold flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-brand-accent-emerald animate-pulse"></span>
                  Active
                </span>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={isSaving}
              className="btn btn-primary w-full py-3 mt-2 flex items-center justify-center gap-2 font-semibold shadow-lg shadow-indigo-600/30 cursor-pointer text-sm rounded-xl"
            >
              <Save className="w-4 h-4" />
              <span>{isSaving ? 'Updating Account...' : 'Save Account Changes'}</span>
            </button>
          </div>

          {/* Quick Actions Card */}
          <div className="card p-6 bg-brand-bg-secondary border border-brand-border rounded-3xl flex flex-col gap-3 text-xs text-brand-text-muted">
            <h4 className="font-bold text-brand-text-main text-sm flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-brand-primary" />
              Quick Navigation
            </h4>
            <Link href="/" className="p-2.5 rounded-xl bg-brand-bg-tertiary hover:bg-brand-bg-tertiary/80 text-brand-text-main font-medium flex justify-between items-center transition-all">
              <span>Go to Main Dashboard</span>
              <span>→</span>
            </Link>
            <Link href="/login" className="p-2.5 rounded-xl bg-brand-bg-tertiary hover:bg-brand-bg-tertiary/80 text-brand-text-main font-medium flex justify-between items-center transition-all">
              <span>Switch Active Account</span>
              <span>→</span>
            </Link>
          </div>
        </div>

      </form>
    </div>
  );
}
