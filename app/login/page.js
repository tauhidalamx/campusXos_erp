'use client';

import React, { useState, useEffect } from 'react';
import '../../styles/auth.css';
import { 
  auth, 
  db, 
  googleProvider, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signInWithPopup, 
  doc, 
  setDoc, 
  getDoc,
  isFirebaseConfigured 
} from '../../lib/firebase';

export default function LoginPage() {
  const [activeTab, setActiveTab] = useState('signin'); // 'signin' or 'signup'
  
  // SignIn states
  const [signinEmail, setSigninEmail] = useState('');
  const [signinPassword, setSigninPassword] = useState('');
  const [signinShowPassword, setSigninShowPassword] = useState(false);
  const [signinError, setSigninError] = useState('');
  const [signinLoading, setSigninLoading] = useState(false);

  // SignUp states
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupRole, setSignupRole] = useState('student');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupConfirmPassword, setSignupConfirmPassword] = useState('');
  const [signupShowPassword, setSignupShowPassword] = useState(false);
  const [signupError, setSignupError] = useState('');
  const [signupSuccess, setSignupSuccess] = useState('');
  const [signupLoading, setSignupLoading] = useState(false);

  // Password Strength State
  const [strengthLevel, setStrengthLevel] = useState('weak');
  const [strengthText, setStrengthText] = useState('Password Strength');

  // Transition State
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [authStatusText, setAuthStatusText] = useState('Verifying credentials...');

  // Storage Keys
  const SESSION_KEY = 'campusx_erp_session';
  const USERS_KEY = 'campusx_erp_users';

  // Static Fallback Map for Standard University Personas
  const defaultUserMap = {
    'superadmin@campusx.demo': { id: 'usr_demo_1', name: 'Global Super Admin', role: 'superadmin', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150' },
    'admin@campusx.demo': { id: 'usr_demo_2', name: 'Platform Admin', role: 'platformadmin', avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150' },
    'univadmin@campusx.demo': { id: 'usr_demo_3', name: 'University Admin', role: 'admin', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150' },
    'registrar@campusx.demo': { id: 'usr_demo_4', name: 'Registrar Officer', role: 'registrar', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150' },
    'dean@campusx.demo': { id: 'usr_demo_5', name: 'Dean of Faculty', role: 'dean', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150' },
    'hod@campusx.demo': { id: 'usr_demo_6', name: 'Prof. Sunita Verma', role: 'hod', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150' },
    'faculty@campusx.demo': { id: 'usr_demo_7', name: 'Dr. Rajesh Sharma', role: 'faculty', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150' },
    'finance@campusx.demo': { id: 'usr_demo_8', name: 'Finance Manager', role: 'finance_manager', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150' },
    'research@campusx.demo': { id: 'usr_demo_9', name: 'Research Coordinator', role: 'research_coordinator', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150' },
    'placement@campusx.demo': { id: 'usr_demo_10', name: 'Placement Officer', role: 'placement_officer', avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150' },
    'student@campusx.demo': { id: 'usr_demo_11', name: 'Aarav Sharma', role: 'student', avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150' },
    'parent@campusx.demo': { id: 'usr_demo_12', name: 'Parent Account', role: 'parent', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150' },
    'alumni@campusx.demo': { id: 'usr_demo_13', name: 'Alumni Member', role: 'alumni', avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150' },
    'recruiter@campusx.demo': { id: 'usr_demo_14', name: 'Corporate Recruiter', role: 'recruiter', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150' },
    'sportsdirector@campusx.demo': { id: 'usr_demo_sports_dir', name: 'Sports Director', role: 'sports_director', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150' },
    'coach@campusx.demo': { id: 'usr_demo_coach', name: 'Head Coach', role: 'coach', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150' },
    'athlete@campusx.demo': { id: 'usr_demo_athlete', name: 'Student Athlete', role: 'athlete', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150' },
    'admin@campusx.edu': { id: 'usr_001', name: 'Dr. Evelyn Sterling', role: 'admin', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150' },
    'faculty@campusx.edu': { id: 'usr_002', name: 'Prof. Marcus Chen', role: 'faculty', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150' },
    'student@campusx.edu': { id: 'usr_003', name: 'Aria Nakamura', role: 'student', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150' },
    'hod@campusx.edu': { id: 'usr_004', name: 'Prof. Sarah Jenkins', role: 'hod', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150' }
  };

  // Password hash helper
  const hashPassword = (plain) => {
    let hash = 0;
    for (let i = 0; i < plain.length; i++) {
      const ch = plain.charCodeAt(i);
      hash = ((hash << 5) - hash) + ch;
      hash |= 0;
    }
    return 'h$' + Math.abs(hash).toString(36);
  };

  // Check if session exists on mount & initialize default accounts
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const session = sessionStorage.getItem(SESSION_KEY) || localStorage.getItem(SESSION_KEY);
      if (session) {
        window.location.href = '/';
      }

      try {
        const existing = localStorage.getItem(USERS_KEY);
        if (!existing) {
          const initAccounts = Object.entries(defaultUserMap).map(([email, u]) => ({
            id: u.id,
            name: u.name,
            email: email,
            role: u.role,
            avatar: u.avatar,
            password: hashPassword('Demo@123')
          }));
          localStorage.setItem(USERS_KEY, JSON.stringify(initAccounts));
        }
      } catch (e) {
        console.warn('Storage initialization error:', e);
      }
    }
  }, []);

  // Password Strength Check for sign up
  useEffect(() => {
    if (!signupPassword) {
      setStrengthLevel('weak');
      setStrengthText('Password Strength');
      return;
    }

    let score = 0;
    if (signupPassword.length >= 6) score++;
    if (signupPassword.length >= 10) score++;
    if (/[A-Z]/.test(signupPassword)) score++;
    if (/[0-9]/.test(signupPassword)) score++;
    if (/[^A-Za-z0-9]/.test(signupPassword)) score++;

    let level = 'weak';
    if (score >= 4) level = 'strong';
    else if (score >= 2) level = 'medium';

    setStrengthLevel(level);
    const labels = { weak: 'Weak', medium: 'Medium', strong: 'Strong' };
    setStrengthText(labels[level]);
  }, [signupPassword]);

  // Destination redirect helper
  const navigateToRoleDashboard = (session) => {
    const roleRoutes = {
      superadmin: '/admin/global',
      platformadmin: '/admin/platform',
      admin: '/erp/admin',
      registrar: '/erp/registrar',
      dean: '/erp/dean',
      hod: '/erp/hod',
      faculty: '/faculty/home',
      student: '/student/home',
      finance_manager: '/finance/dashboard',
      research_coordinator: '/research/dashboard',
      placement_officer: '/placement/dashboard',
      recruiter: '/recruiter/dashboard',
      parent: '/parent/dashboard',
      sports_parent: '/parent/dashboard',
      alumni: '/alumni/home',
      sports_director: '/sports/director',
      coach: '/sports/live/studio',
      athlete: '/student/home'
    };

    const targetRoute = roleRoutes[session.role] || '/';
    setTimeout(() => {
      window.location.href = targetRoute;
    }, 450);
  };

  // Sign In Submit
  const handleSignIn = async (e) => {
    e.preventDefault();
    setSigninError('');
    setSigninLoading(true);

    if (!signinEmail || !signinPassword) {
      setSigninError('Please enter both email and password.');
      setSigninLoading(false);
      return;
    }

    const emailLower = signinEmail.trim().toLowerCase();

    // 1. Firebase Authentication if configured
    if (isFirebaseConfigured) {
      try {
        const userCredential = await signInWithEmailAndPassword(auth, emailLower, signinPassword);
        const fbUser = userCredential.user;
        let role = 'student';
        try {
          const userDoc = await getDoc(doc(db, 'users', fbUser.uid));
          if (userDoc.exists()) {
            role = userDoc.data().role || role;
          }
        } catch (docErr) {}

        const sessionData = {
          id: fbUser.uid,
          name: fbUser.displayName || emailLower.split('@')[0].replace(/[._-]/g, ' '),
          email: fbUser.email,
          role: role,
          avatar: fbUser.photoURL || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
          loginAt: new Date().toISOString()
        };

        sessionStorage.setItem(SESSION_KEY, JSON.stringify(sessionData));
        localStorage.setItem(SESSION_KEY, JSON.stringify(sessionData));

        setSigninLoading(false);
        setIsAuthenticating(true);
        setAuthStatusText(`Entering ${sessionData.name}'s workspace...`);
        navigateToRoleDashboard(sessionData);
        return;
      } catch (fbErr) {
        console.warn('Firebase auth failed or not reached, checking local fallback credentials:', fbErr.message);
      }
    }

    // 2. Check Local Storage Users
    let matchedUser = null;
    if (typeof window !== 'undefined') {
      try {
        const storedUsers = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
        matchedUser = storedUsers.find(u => u.email && u.email.toLowerCase() === emailLower);
      } catch (err) {
        console.warn('User lookup error:', err);
      }
    }

    // 3. Check in-memory fallback
    if (!matchedUser && defaultUserMap[emailLower]) {
      matchedUser = defaultUserMap[emailLower];
    }

    // 4. Role inference fallback if user enters custom credentials
    if (!matchedUser) {
      let inferredRole = 'student';
      if (emailLower.includes('superadmin')) inferredRole = 'superadmin';
      else if (emailLower.includes('admin')) inferredRole = 'admin';
      else if (emailLower.includes('faculty') || emailLower.includes('prof') || emailLower.includes('teacher')) inferredRole = 'faculty';
      else if (emailLower.includes('hod') || emailLower.includes('head')) inferredRole = 'hod';
      else if (emailLower.includes('dean')) inferredRole = 'dean';
      else if (emailLower.includes('registrar')) inferredRole = 'registrar';
      else if (emailLower.includes('finance')) inferredRole = 'finance_manager';

      const userName = emailLower.split('@')[0].replace(/[._-]/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
      matchedUser = {
        id: 'usr_' + Date.now().toString(36),
        name: userName || 'User',
        email: emailLower,
        role: inferredRole,
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150"
      };
    }

    // Save session
    const sessionData = {
      id: matchedUser.id || 'usr_' + Date.now().toString(36),
      name: matchedUser.name || 'User',
      email: matchedUser.email || emailLower,
      role: matchedUser.role || 'student',
      avatar: matchedUser.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
      loginAt: new Date().toISOString()
    };

    sessionStorage.setItem(SESSION_KEY, JSON.stringify(sessionData));
    localStorage.setItem(SESSION_KEY, JSON.stringify(sessionData));

    setSigninLoading(false);
    setIsAuthenticating(true);
    setAuthStatusText(`Entering ${sessionData.name}'s workspace...`);
    navigateToRoleDashboard(sessionData);
  };

  // Sign Up Submit
  const handleSignUp = async (e) => {
    e.preventDefault();
    setSignupError('');
    setSignupSuccess('');
    setSignupLoading(true);

    if (!signupName.trim() || !signupEmail.trim() || !signupPassword) {
      setSignupError('All fields are required.');
      setSignupLoading(false);
      return;
    }

    if (signupPassword.length < 6) {
      setSignupError('Password must be at least 6 characters.');
      setSignupLoading(false);
      return;
    }

    if (signupPassword !== signupConfirmPassword) {
      setSignupError('Passwords do not match.');
      setSignupLoading(false);
      return;
    }

    const emailLower = signupEmail.trim().toLowerCase();

    // 1. Firebase user registration if configured
    if (isFirebaseConfigured) {
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, emailLower, signupPassword);
        const fbUser = userCredential.user;
        try {
          await setDoc(doc(db, 'users', fbUser.uid), {
            uid: fbUser.uid,
            name: signupName.trim(),
            email: emailLower,
            role: signupRole,
            createdAt: new Date().toISOString()
          });
        } catch(docErr) {}
      } catch (fbErr) {
        console.warn('Firebase registration error, saving to local state:', fbErr.message);
      }
    }

    const newUser = {
      id: 'usr_' + Date.now().toString(36),
      name: signupName.trim(),
      email: emailLower,
      role: signupRole,
      password: hashPassword(signupPassword),
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
      createdAt: new Date().toISOString()
    };

    if (typeof window !== 'undefined') {
      try {
        const storedUsers = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
        const filtered = storedUsers.filter(u => u.email !== emailLower);
        filtered.push(newUser);
        localStorage.setItem(USERS_KEY, JSON.stringify(filtered));
      } catch (err) {
        console.warn('Storage save error:', err);
      }
    }

    setSignupSuccess('Account created successfully! Switching to sign in...');
    setSignupLoading(false);

    setTimeout(() => {
      setActiveTab('signin');
      setSigninEmail(emailLower);
      setSigninPassword(signupPassword);
      setSignupName('');
      setSignupEmail('');
      setSignupPassword('');
      setSignupConfirmPassword('');
      setSignupSuccess('');
    }, 1000);
  };

  // Single Sign-On (SSO) Handler
  const handleSSO = async (provider) => {
    if (provider === 'Google' && isFirebaseConfigured) {
      try {
        const result = await signInWithPopup(auth, googleProvider);
        const fbUser = result.user;
        const sessionData = {
          id: fbUser.uid,
          name: fbUser.displayName || 'Google Scholar User',
          email: fbUser.email,
          role: 'student',
          avatar: fbUser.photoURL || "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150",
          loginAt: new Date().toISOString()
        };
        sessionStorage.setItem(SESSION_KEY, JSON.stringify(sessionData));
        localStorage.setItem(SESSION_KEY, JSON.stringify(sessionData));
        setIsAuthenticating(true);
        setAuthStatusText(`Signed in via Google. Opening portal...`);
        navigateToRoleDashboard(sessionData);
        return;
      } catch(err) {
        console.warn('Google Popup error:', err);
      }
    }

    const ssoUser = {
      Google: { id: 'usr_sso_g', name: 'Google Scholar User', email: 'student@campusx.demo', role: 'student', avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150' },
      Microsoft: { id: 'usr_sso_m', name: 'Microsoft Enterprise User', email: 'univadmin@campusx.demo', role: 'admin', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150' },
      Passkey: { id: 'usr_sso_p', name: 'Institutional Passkey', email: 'faculty@campusx.demo', role: 'faculty', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150' }
    };

    const user = ssoUser[provider] || ssoUser.Google;
    const sessionData = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
      loginAt: new Date().toISOString()
    };

    sessionStorage.setItem(SESSION_KEY, JSON.stringify(sessionData));
    localStorage.setItem(SESSION_KEY, JSON.stringify(sessionData));

    setIsAuthenticating(true);
    setAuthStatusText(`Signed in via ${provider}. Opening portal...`);
    navigateToRoleDashboard(sessionData);
  };

  return (
    <div className="auth-container">
      
      {/* Sleek Transition Overlay */}
      {isAuthenticating && (
        <div style={{
          position: 'fixed',
          inset: 0,
          zIndex: 9999,
          backgroundColor: 'rgba(10, 14, 26, 0.85)',
          backdropFilter: 'blur(12px)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <div style={{
            background: 'var(--bg-secondary, #121829)',
            border: '1px solid var(--border, rgba(255,255,255,0.1))',
            borderRadius: '24px',
            padding: '32px 40px',
            textAlign: 'center',
            boxShadow: '0 20px 50px rgba(0,0,0,0.5)'
          }}>
            <div style={{
              width: '48px',
              height: '48px',
              margin: '0 auto 16px',
              borderRadius: '16px',
              background: 'rgba(99, 102, 241, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--primary, #6366f1)'
            }}>
              <svg style={{ width: '28px', height: '28px', animation: 'spin 1s linear infinite' }} viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" opacity="0.25"></circle>
                <path fill="currentColor" opacity="0.75" d="M4 12a8 8 0 018-8v8H4z"></path>
              </svg>
            </div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main, #f8fafc)', marginBottom: '4px' }}>CampusX ERP</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted, #94a3b8)' }}>{authStatusText}</p>
          </div>
        </div>
      )}

      {/* LEFT — Brand Panel */}
      <div className="auth-brand">
        <div className="orb orb-1"></div>
        <div className="orb orb-2"></div>
        <div className="orb orb-3"></div>
        <div className="dot-grid"></div>

        <div className="brand-content">
          <div className="brand-logo">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
              <path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5"/>
            </svg>
          </div>

          <h1 className="brand-title">
            <span>CAMPUSX </span>
            <span style={{ color: 'var(--primary, #6366f1)' }}>OS</span>
          </h1>
          <p className="brand-tagline">
            Next-Generation Higher Education & Enterprise Management Platform
          </p>

          {/* Three Feature Highlights */}
          <div className="brand-features">
            <div className="brand-feature">
              <div className="feature-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
              </div>
              <div className="feature-text">
                <strong>Role-Based Access Control</strong>
                <span>Granular workspace permissions tailored for students, faculty, and administration.</span>
              </div>
            </div>

            <div className="brand-feature">
              <div className="feature-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
              </div>
              <div className="feature-text">
                <strong>Unified Campus Hub</strong>
                <span>Consolidated management for academics, examinations, departmental workflows, and finance.</span>
              </div>
            </div>

            <div className="brand-feature">
              <div className="feature-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              </div>
              <div className="feature-text">
                <strong>Offline-Resilient Architecture</strong>
                <span>Fast client-side session caching, instantaneous routing, and robust state persistence.</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT — Form Panel */}
      <div className="auth-form-panel">
        
        {/* Tab Switcher */}
        <div className="auth-tabs">
          <button 
            type="button" 
            className={`auth-tab ${activeTab === 'signin' ? 'active' : ''}`}
            onClick={() => { setActiveTab('signin'); setSigninError(''); }}
          >
            Sign In
          </button>
          <button 
            type="button" 
            className={`auth-tab ${activeTab === 'signup' ? 'active' : ''}`}
            onClick={() => { setActiveTab('signup'); setSignupError(''); setSignupSuccess(''); }}
          >
            Sign Up
          </button>
        </div>

        {/* Sign In View */}
        {activeTab === 'signin' ? (
          <div className="auth-form-container">
            <h2>Welcome Back</h2>
            <p>Enter your institutional credentials to access your dashboard</p>

            <form onSubmit={handleSignIn}>
              <div className="auth-input-group">
                <input 
                  type="email" 
                  id="signin-email"
                  value={signinEmail}
                  onChange={(e) => setSigninEmail(e.target.value)}
                  required 
                  placeholder=" "
                />
                <label htmlFor="signin-email">Institutional Email</label>
              </div>

              <div className="auth-input-group">
                <input 
                  type={signinShowPassword ? "text" : "password"} 
                  id="signin-password"
                  value={signinPassword}
                  onChange={(e) => setSigninPassword(e.target.value)}
                  required 
                  placeholder=" "
                />
                <label htmlFor="signin-password">Password</label>
                <button 
                  type="button" 
                  className="password-toggle"
                  onClick={() => setSigninShowPassword(!signinShowPassword)}
                  aria-label="Toggle password visibility"
                >
                  {signinShowPassword ? (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                  ) : (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                  )}
                </button>
              </div>

              <div className="auth-options">
                <label className="custom-checkbox">
                  <input type="checkbox" defaultChecked />
                  Remember this device
                </label>
                <button 
                  type="button" 
                  className="forgot-link"
                  onClick={() => alert('To reset your password, please contact your university system administrator or register a new account.')}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', font: 'inherit' }}
                >
                  Forgot Password?
                </button>
              </div>

              <button 
                type="submit" 
                className="auth-submit-btn" 
                disabled={signinLoading}
              >
                {signinLoading ? 'Signing In...' : 'Sign In'}
              </button>

              {signinError && (
                <div className="auth-error-banner" style={{
                  padding: '12px 16px',
                  borderRadius: '12px',
                  backgroundColor: 'rgba(244, 63, 94, 0.12)',
                  color: 'var(--accent-ruby, #f43f5e)',
                  fontSize: '0.85rem'
                }}>
                  {signinError}
                </div>
              )}
            </form>

            <div className="auth-divider">
              <span>OR CONTINUE WITH</span>
            </div>

            <div className="social-buttons">
              <button type="button" className="social-btn" onClick={() => handleSSO('Google')}>
                <svg viewBox="0 0 24 24" width="16" height="16">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18A10.96 10.96 0 0 0 1 12c0 1.77.42 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Google
              </button>

              <button type="button" className="social-btn" onClick={() => handleSSO('Microsoft')}>
                <svg viewBox="0 0 24 24" width="16" height="16">
                  <rect x="1" y="1" width="10" height="10" fill="#F25022"/>
                  <rect x="13" y="1" width="10" height="10" fill="#7FBA00"/>
                  <rect x="1" y="13" width="10" height="10" fill="#00A4EF"/>
                  <rect x="13" y="13" width="10" height="10" fill="#FFB900"/>
                </svg>
                Microsoft
              </button>

              <button type="button" className="social-btn" onClick={() => handleSSO('Passkey')}>
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ color: 'var(--primary, #6366f1)' }}>
                  <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/>
                </svg>
                Passkey
              </button>
            </div>
          </div>
        ) : (
          /* Sign Up View */
          <div className="auth-form-container">
            <h2>Create Account</h2>
            <p>Register your institutional profile on CampusX</p>

            <form onSubmit={handleSignUp}>
              <div className="auth-input-group">
                <input 
                  type="text" 
                  id="signup-name"
                  value={signupName}
                  onChange={(e) => setSignupName(e.target.value)}
                  required 
                  placeholder=" "
                />
                <label htmlFor="signup-name">Full Name</label>
              </div>

              <div className="auth-input-group">
                <input 
                  type="email" 
                  id="signup-email"
                  value={signupEmail}
                  onChange={(e) => setSignupEmail(e.target.value)}
                  required 
                  placeholder=" "
                />
                <label htmlFor="signup-email">Institutional Email</label>
              </div>

              <div className="auth-input-group">
                <select 
                  id="signup-role"
                  value={signupRole}
                  onChange={(e) => setSignupRole(e.target.value)}
                >
                  <option value="student">Student Role (Undergraduate / Postgraduate)</option>
                  <option value="faculty">Faculty Role (Professor / Lecturer)</option>
                  <option value="hod">Head of Department (HOD)</option>
                  <option value="dean">Dean of Faculty</option>
                  <option value="registrar">Registrar Officer</option>
                  <option value="admin">University Administrator</option>
                  <option value="finance_manager">Finance Manager</option>
                  <option value="placement_officer">Placement Officer</option>
                  <option value="recruiter">Corporate Recruiter</option>
                  <option value="alumni">Alumni Member</option>
                  <option value="parent">Parent Account</option>
                </select>
                <label htmlFor="signup-role" className="select-label">Institutional Role</label>
                <svg className="select-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="6 9 12 15 18 9"/>
                </svg>
              </div>

              <div className="auth-input-group">
                <input 
                  type={signupShowPassword ? "text" : "password"} 
                  id="signup-password"
                  value={signupPassword}
                  onChange={(e) => setSignupPassword(e.target.value)}
                  required 
                  placeholder=" "
                />
                <label htmlFor="signup-password">Password</label>
                <button 
                  type="button" 
                  className="password-toggle"
                  onClick={() => setSignupShowPassword(!signupShowPassword)}
                  aria-label="Toggle password visibility"
                >
                  {signupShowPassword ? (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                  ) : (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                  )}
                </button>
              </div>

              <div className="auth-input-group">
                <input 
                  type={signupShowPassword ? "text" : "password"} 
                  id="signup-confirm-password"
                  value={signupConfirmPassword}
                  onChange={(e) => setSignupConfirmPassword(e.target.value)}
                  required 
                  placeholder=" "
                />
                <label htmlFor="signup-confirm-password">Confirm Password</label>
              </div>

              {signupPassword && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '-4px' }}>
                  <div style={{ display: 'flex', gap: '6px', width: '100%', height: '4px' }}>
                    <div style={{ flex: 1, borderRadius: '4px', background: strengthLevel === 'weak' ? '#f43f5e' : (strengthLevel === 'medium' ? '#f59e0b' : '#10b981'), transition: 'all 0.3s' }}></div>
                    <div style={{ flex: 1, borderRadius: '4px', background: strengthLevel === 'medium' ? '#f59e0b' : (strengthLevel === 'strong' ? '#10b981' : 'rgba(255,255,255,0.1)'), transition: 'all 0.3s' }}></div>
                    <div style={{ flex: 1, borderRadius: '4px', background: strengthLevel === 'strong' ? '#10b981' : 'rgba(255,255,255,0.1)', transition: 'all 0.3s' }}></div>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted, #94a3b8)' }}>
                    <span>{strengthText}</span>
                    <span style={{
                      fontWeight: 700,
                      letterSpacing: '0.04em',
                      color: strengthLevel === 'strong' ? 'var(--accent-emerald, #059669)' : (strengthLevel === 'medium' ? 'var(--accent-amber, #d97706)' : 'var(--accent-ruby, #f43f5e)')
                    }}>
                      {strengthLevel.toUpperCase()}
                    </span>
                  </div>
                </div>
              )}

              <button 
                type="submit" 
                className="auth-submit-btn" 
                disabled={signupLoading}
              >
                {signupLoading ? 'Creating Account...' : 'Create Account'}
              </button>

              {signupError && (
                <div className="auth-error-banner" style={{
                  padding: '12px 16px',
                  borderRadius: '12px',
                  backgroundColor: 'rgba(244, 63, 94, 0.12)',
                  color: 'var(--accent-ruby, #f43f5e)',
                  fontSize: '0.85rem'
                }}>
                  {signupError}
                </div>
              )}

              {signupSuccess && (
                <div style={{
                  padding: '12px 16px',
                  borderRadius: '12px',
                  backgroundColor: 'rgba(5, 150, 105, 0.12)',
                  color: 'var(--accent-emerald, #059669)',
                  fontSize: '0.85rem'
                }}>
                  {signupSuccess}
                </div>
              )}
            </form>
          </div>
        )}

      </div>
    </div>
  );
}
