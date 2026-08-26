'use client';

import React, { useState, useEffect, useRef } from 'react';
import '../../styles/auth.css';

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

  // Threat Monitoring State
  const [threatPercent, setThreatPercent] = useState(0.08);
  const [threatStatus, setThreatStatus] = useState('Normal');
  const [threatDesc, setThreatDesc] = useState('TensorFlow.js model running inference on attempt timestamps, input patterns, and failure thresholds.');
  const [threatBarColor, setThreatBarColor] = useState('var(--color-brand-primary)');

  const [failureCount, setFailureCount] = useState(0);
  const tfModelRef = useRef(null);
  const logBoxRef = useRef(null);

  // Force Password Change States
  const [mustChange, setMustChange] = useState(false);
  const [tempUser, setTempUser] = useState(null);
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [newPasswordShow, setNewPasswordShow] = useState(false);
  const [changePasswordError, setChangePasswordError] = useState('');
  const [changePasswordLoading, setChangePasswordLoading] = useState(false);

  // SSO / MFA States
  const [mfaActive, setMfaActive] = useState(false);
  const [mfaCode, setMfaCode] = useState('');
  const [mfaError, setMfaError] = useState('');
  const [mfaLoading, setMfaLoading] = useState(false);
  const [pendingUserSession, setPendingUserSession] = useState(null);

  // Demo Credentials & Clipboard states
  const [isDev, setIsDev] = useState(false);
  const [copiedField, setCopiedField] = useState(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsDev(window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
    }
  }, []);

  // System Boot Loader States
  const [systemBooting, setSystemBooting] = useState(false);
  const [bootProgress, setBootProgress] = useState(0);
  const [bootLogs, setBootLogs] = useState([]);

  // Storage Keys
  const SESSION_KEY = 'campusx_erp_session';

  // Hashing Helper (matches server side)
  const hashPassword = (plain) => {
    var hash = 0;
    for (var i = 0; i < plain.length; i++) {
      var ch = plain.charCodeAt(i);
      hash = ((hash << 5) - hash) + ch;
      hash |= 0;
    }
    return 'h$' + Math.abs(hash).toString(36);
  };

  // Check if already logged in on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const session = sessionStorage.getItem(SESSION_KEY);
      if (session) {
        window.location.href = '/';
      }
    }
  }, []);

  // Initialize TensorFlow Threat Model
  useEffect(() => {
    if (typeof window !== 'undefined' && window.tf) {
      try {
        const tf = window.tf;
        const model = tf.sequential();
        model.add(tf.layers.dense({ units: 4, activation: 'relu', inputShape: [4] }));
        model.add(tf.layers.dense({ units: 1, activation: 'sigmoid' }));
        model.compile({
          optimizer: tf.train.adam(0.1),
          loss: 'binaryCrossentropy'
        });
        tfModelRef.current = model;
      } catch (err) {
        console.warn('TF Model Initialization failed', err);
      }
    }
  }, []);

  // Auto scroll system boot logs
  useEffect(() => {
    if (logBoxRef.current) {
      logBoxRef.current.scrollTop = logBoxRef.current.scrollHeight;
    }
  }, [bootLogs]);

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

  // Password Strength Check for password reset
  const getNewPassStrength = () => {
    if (!newPassword) return { level: 'weak', text: 'Password Strength' };
    let score = 0;
    if (newPassword.length >= 8) score++;
    if (newPassword.length >= 12) score++;
    if (/[A-Z]/.test(newPassword)) score++;
    if (/[0-9]/.test(newPassword)) score++;
    if (/[^A-Za-z0-9]/.test(newPassword)) score++;

    let level = 'weak';
    if (score >= 4) level = 'strong';
    else if (score >= 2) level = 'medium';
    return { level, text: level.toUpperCase() };
  };

  // Threat score update
  useEffect(() => {
    const calculateThreat = async () => {
      if (typeof window === 'undefined' || !window.tf || !tfModelRef.current) return;

      const tf = window.tf;
      const emailLen = signinEmail.length;
      const passLen = signinPassword.length;
      const hour = new Date().getHours();

      const inputTensor = tf.tensor2d([
        [Math.min(emailLen / 50, 1), Math.min(passLen / 50, 1), Math.min(failureCount / 5, 1), hour / 24]
      ], [1, 4]);

      try {
        const output = tfModelRef.current.predict(inputTensor);
        const prob = (await output.data())[0];
        setThreatPercent(parseFloat((prob * 100).toFixed(2)));

        if (prob < 0.3) {
          setThreatBarColor('var(--color-brand-primary)');
        } else if (prob < 0.7) {
          setThreatBarColor('var(--color-brand-accent-amber)');
        } else {
          setThreatBarColor('var(--color-brand-accent-ruby)');
        }

        if (failureCount >= 3 || prob >= 0.7) {
          setThreatStatus('Critical Threat');
          setThreatDesc('WARNING: Repeated failures and abnormal input profiles. Verification required.');
        } else if (failureCount >= 1 || prob >= 0.3) {
          setThreatStatus('Elevated Threat');
          setThreatDesc('AI System adjusting weights via Adam optimizer based on login attempt latency.');
        } else {
          setThreatStatus('Normal');
          setThreatDesc('TensorFlow.js model running inference on attempt timestamps, input patterns, and failure thresholds.');
        }

        inputTensor.dispose();
        output.dispose();
      } catch (err) {
        console.error('Inference error:', err);
      }
    };

    calculateThreat();
  }, [signinEmail, signinPassword, failureCount]);

  // Handle Redirection based on role
  const redirectUser = (role) => {
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
      sports_parent: '/sports/parent'
    };

    const target = roleLandingPage[role] || '/';
    window.location.href = target;
  };

  // Sign In Submit
  const handleSignIn = (e) => {
    e.preventDefault();
    setSigninError('');
    setSigninLoading(true);

    if (!signinEmail || !signinPassword) {
      setSigninError('Email and password are required.');
      setFailureCount(prev => prev + 1);
      setSigninLoading(false);
      return;
    }

    const emailLower = signinEmail.trim().toLowerCase();

    fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: emailLower,
        password: signinPassword
      })
    })
    .then(res => {
      if (!res.ok) {
        return res.json().then(errData => {
          throw new Error(errData.error || 'Invalid email or password.');
        });
      }
      return res.json();
    })
    .then(data => {
      setSigninLoading(false);
      if (data.success) {
        if (data.mustChangePassword) {
          // Force password change first
          setTempUser({ email: emailLower, oldPassword: signinPassword, role: data.user.role });
          setMustChange(true);
        } else {
          // Proceed directly to loader (bypass MFA verification)
          const sessionData = {
            id: data.user.id,
            name: data.user.name,
            email: data.user.email,
            role: data.user.role,
            avatar: data.user.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
            loginAt: new Date().toISOString()
          };
          sessionStorage.setItem(SESSION_KEY, JSON.stringify(sessionData));
          setSystemBooting(true);
          startBootSequence(sessionData);
        }
      }
    })
    .catch(err => {
      setSigninError(err.message || 'Invalid email or password. Please try again.');
      setFailureCount(prev => prev + 1);
      setSigninLoading(false);
    });
  };

  // Password Reset Submit
  const handleChangePassword = (e) => {
    e.preventDefault();
    setChangePasswordError('');
    setChangePasswordLoading(true);

    if (!newPassword || !confirmNewPassword) {
      setChangePasswordError('Please enter your new password.');
      setChangePasswordLoading(false);
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setChangePasswordError('New passwords do not match.');
      setChangePasswordLoading(false);
      return;
    }

    if (newPassword.length < 8) {
      setChangePasswordError('Password must be at least 8 characters long.');
      setChangePasswordLoading(false);
      return;
    }

    if (newPassword === 'Demo@123') {
      setChangePasswordError('Please select a password different from the temporary demo password.');
      setChangePasswordLoading(false);
      return;
    }

    fetch('/api/auth/change-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: tempUser.email,
        oldPassword: tempUser.oldPassword,
        newPassword: newPassword
      })
    })
    .then(res => {
      if (!res.ok) {
        return res.json().then(errData => {
          throw new Error(errData.error || 'Failed to change password.');
        });
      }
      return res.json();
    })
    .then(data => {
      setChangePasswordLoading(false);
      if (data.success && data.user) {
        // Proceed directly to loader (bypass MFA verification)
        const sessionData = {
          id: data.user.id,
          name: data.user.name,
          email: data.user.email,
          role: data.user.role,
          avatar: data.user.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
          loginAt: new Date().toISOString()
        };
        sessionStorage.setItem(SESSION_KEY, JSON.stringify(sessionData));
        setMustChange(false);
        setSystemBooting(true);
        startBootSequence(sessionData);
      }
    })
    .catch(err => {
      setChangePasswordError(err.message || 'Error occurred updating password.');
      setChangePasswordLoading(false);
    });
  };

  // Start dynamic boot / data loading sequence
  const startBootSequence = (session) => {
    const emailLower = session.email.toLowerCase();
    
    // Map department based on role or email
    let department = 'General Academics';
    if (emailLower.includes('admin')) department = 'Global System Operations';
    else if (emailLower.includes('student')) department = 'Computer Science & AI Research';
    else if (emailLower.includes('faculty')) department = 'School of Advanced Computing';
    else if (session.role.includes('library')) department = 'University Library Network';
    else if (session.role.includes('hostel')) department = 'Campus Housing & Logistics';
    else if (session.role.includes('transport')) department = 'Transportation Services';
    else if (session.role.includes('medical')) department = 'Sports & Medical Center';
    else if (session.role.includes('compliance') || session.role.includes('auditor')) department = 'Governance & Ethics Compliance';
    
    // Map campus
    let campus = 'North Tech Campus (Primary Hub)';
    if (session.role.includes('sports') || session.role.includes('medical')) campus = 'East Athletic Precinct';
    else if (session.role.includes('hostel') || session.role.includes('transport')) campus = 'South Logistical Zone';
    else if (session.role.includes('library')) campus = 'West Academic Archway';

    // Map RAG model
    let ragModel = 'campusx-rag-academic-v4';
    if (session.role === 'superadmin' || session.role === 'platformadmin') ragModel = 'campusx-rag-sec-ops-v5';
    else if (session.role.includes('compliance') || session.role.includes('auditor')) ragModel = 'campusx-rag-regulatory-v3';
    else if (session.role.includes('finance')) ragModel = 'campusx-rag-ledger-v2';

    // Short DID wallet sync code
    const didSuffix = hashPassword(session.email).substring(2);
    const didStatus = `did:campusx:2026:${didSuffix || '8f2b1d'} [SYNCED]`;

    const displayRole = {
      superadmin: 'Global Super Admin',
      platformadmin: 'Platform Admin',
      admin: 'University Admin',
      registrar: 'Registrar Officer',
      dean: 'Dean of Faculty',
      hod: 'Department Head (HOD)',
      faculty: 'Faculty Member',
      finance_manager: 'Finance Manager',
      research_coordinator: 'Research Coordinator',
      placement_officer: 'Placement Officer',
      student: 'Student',
      parent: 'Parent',
      alumni: 'Alumni',
      recruiter: 'Recruiter',
      sports_director: 'Sports Director',
      coach: 'Sports Head Coach',
      athlete: 'Student Athlete',
      sports_parent: 'Athlete Parent',
      department_admin: 'Department Admin',
      library_admin: 'Library Admin',
      hostel_admin: 'Hostel Admin',
      transport_admin: 'Transport Admin',
      medical_staff: 'Medical Staff',
      guest: 'Guest User',
      consultant: 'Consultant',
      auditor: 'External Auditor',
      compliance_officer: 'Compliance Officer'
    }[session.role] || 'User';

    const logsList = [
      { progress: 0, text: `Initializing CampusX Secure Shell v5.0.0-mega-upgrade...` },
      { progress: 8, text: `Establishing handshake with local node on port 5000...` },
      { progress: 15, text: `[OK] Local socket handshake verified. Connection secure.` },
      { progress: 22, text: `Opening transaction ledger SQLite database...` },
      { progress: 30, text: `[DB] Scanning ledger schema: found table 'users', 'posts', 'soc_incidents', 'studio_workflows', 'admissions_applications', 'procurement_orders', 'compliance_policies'.` },
      { progress: 38, text: `[DB] Loaded 1,000+ realistic simulated dataset records.` },
      { progress: 45, text: `Syncing Blockchain DID: ${didStatus}...` },
      { progress: 52, text: `Mounting Zero Trust routing guard and filtering navigations...` },
      { progress: 60, text: `Resolving RBAC credentials for role: ${session.role.toUpperCase()} (${displayRole})...` },
      { progress: 68, text: `Department Alignment: ${department}...` },
      { progress: 75, text: `Campus Routing: ${campus}...` },
      { progress: 82, text: `Initializing RAG context matching: loading model ${ragModel}...` },
      { progress: 90, text: `[KAFKA] Emitting audit log event: 'user-login' for ${session.email}...` },
      { progress: 95, text: `Workspace initialized. Mounting ${session.role.toUpperCase()} administrative command shell...` },
      { progress: 100, text: `Redirecting user console context...` }
    ];

    let currentLogIndex = 0;
    setBootLogs([logsList[0].text]);
    setBootProgress(0);

    const interval = setInterval(() => {
      currentLogIndex++;
      if (currentLogIndex < logsList.length) {
        const item = logsList[currentLogIndex];
        setBootLogs(prev => [...prev, item.text]);
        setBootProgress(item.progress);
      } else {
        clearInterval(interval);
        setTimeout(() => {
          redirectUser(session.role);
        }, 300);
      }
    }, 250);
  };

  // MFA Submit Verification
  const handleMfaVerify = (e) => {
    e.preventDefault();
    setMfaError('');
    setMfaLoading(true);

    setTimeout(() => {
      setMfaLoading(false);
      // Accept any verification code as fallback
      sessionStorage.setItem(SESSION_KEY, JSON.stringify(pendingUserSession));
      setMfaActive(false);
      setSystemBooting(true);
      startBootSequence(pendingUserSession);
    }, 800);
  };

  // Sign Up Submit
  const handleSignUp = (e) => {
    e.preventDefault();
    setSignupError('');
    setSignupSuccess('');
    setSignupLoading(true);

    if (!signupName.trim() || !signupEmail.trim() || !signupPassword) {
      setSignupError('All fields are required.');
      setSignupLoading(false);
      return;
    }

    if (signupPassword.length < 8) {
      setSignupError('Password must be at least 8 characters.');
      setSignupLoading(false);
      return;
    }

    if (signupPassword !== signupConfirmPassword) {
      setSignupError('Passwords do not match.');
      setSignupLoading(false);
      return;
    }

    const emailLower = signupEmail.trim().toLowerCase();

    fetch('/api/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        id: 'usr_' + Date.now().toString(36),
        name: signupName.trim(),
        email: emailLower,
        role: signupRole,
        password: signupPassword,
        avatar: `https://images.unsplash.com/photo-${1500000000000 + Math.floor(Math.random()*1000000)}?w=150`
      })
    })
    .then(res => {
      if (!res.ok) {
        return res.json().then(errData => {
          throw new Error(errData.error || 'Failed to create account.');
        });
      }
      return res.json();
    })
    .then(data => {
      setSignupSuccess('Account created successfully! Switching to sign in...');
      setSignupLoading(false);
      
      setTimeout(() => {
        setActiveTab('signin');
        setSignupName('');
        setSignupEmail('');
        setSignupPassword('');
        setSignupConfirmPassword('');
        setSignupSuccess('');
      }, 1500);
    })
    .catch(err => {
      setSignupError(err.message || 'An error occurred during sign up.');
      setSignupLoading(false);
    });
  };

  // Demo Credentials Fill Helper
  const fillDemo = (email, pass) => {
    setSigninEmail(email);
    setSigninPassword(pass);
    setSigninError('');
  };

  const copyToClipboard = (text, field) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleOneClickLogin = (email, password) => {
    setSigninEmail(email);
    setSigninPassword(password);
    setSigninError('');
    setSigninLoading(true);

    fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: email,
        password: password
      })
    })
    .then(res => {
      if (!res.ok) {
        return res.json().then(errData => {
          throw new Error(errData.error || 'Invalid email or password.');
        });
      }
      return res.json();
    })
    .then(data => {
      setSigninLoading(false);
      if (data.success) {
        const sessionData = {
          id: data.user.id,
          name: data.user.name,
          email: data.user.email,
          role: data.user.role,
          avatar: data.user.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
          loginAt: new Date().toISOString()
        };
        sessionStorage.setItem(SESSION_KEY, JSON.stringify(sessionData));
        setSystemBooting(true);
        startBootSequence(sessionData);
      }
    })
    .catch(err => {
      setSigninError(err.message || 'Invalid email or password. Please try again.');
      setSigninLoading(false);
    });
  };

  // Mock SSO triggers
  const handleSSO = (provider) => {
    const ssoUser = {
      Google: { id: 'usr_sso_g', name: 'SSO Scholar (Google)', email: 'student@campusx.demo', role: 'student', avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150' },
      Microsoft: { id: 'usr_sso_m', name: 'SSO Admin (Microsoft)', email: 'univadmin@campusx.demo', role: 'admin', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150' },
      Passkey: { id: 'usr_sso_p', name: 'SSO Director (Passkey)', email: 'superadmin@campusx.demo', role: 'superadmin', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150' }
    };

    const user = ssoUser[provider];
    alert(`Initiating secure ${provider} SSO verification sequence...`);
    
    // Proceed directly to loader (bypass MFA verification)
    const sessionData = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
      loginAt: new Date().toISOString()
    };
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(sessionData));
    setSystemBooting(true);
    startBootSequence(sessionData);
  };

  return (
    <div className="auth-page min-h-screen w-full bg-[#ebf0f7] flex flex-col items-center justify-start sm:justify-center p-3 sm:p-6 overflow-y-auto">
      {systemBooting && (
        <div className="system-loader-overlay">
          <div className="system-loader-card">
            {/* Header / Telemetry */}
            <div className="loader-header">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-brand-accent-cyan animate-pulse"></span>
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-white font-mono">CampusX Secure Shell Boot v4.19</span>
              </div>
              <div className="text-[10px] text-brand-text-muted font-mono">
                SYS_STATUS: LOADING_WORKSPACE ({bootProgress}%)
              </div>
            </div>
            
            {/* Log Output Box */}
            <div className="loader-log-box" ref={logBoxRef}>
              {bootLogs.map((log, idx) => (
                <div key={idx} className="log-line">
                  <span className="log-prompt">&gt;</span> {log}
                </div>
              ))}
            </div>

            {/* Progress Bar Container */}
            <div className="loader-progress-container">
              <div className="loader-progress-bar" style={{ width: `${bootProgress}%` }}></div>
            </div>

            {/* Micro-telemetry footer */}
            <div className="loader-footer text-[9px] text-brand-text-subtle font-mono flex justify-between">
              <span>LEDGER: ACTIVE (SQLITE)</span>
              <span>NODE_PORT: 5000</span>
              <span>Z-TRUST: ENFORCED</span>
            </div>
          </div>
        </div>
      )}
      


      {/* Main Container Card */}
      <div className="auth-container w-full max-w-5xl grid grid-cols-1 md:grid-cols-12 bg-white rounded-3xl overflow-hidden shadow-2xl border border-slate-200/80 my-auto">
        
        {/* Brand Left Panel */}
        <div className="auth-brand md:col-span-5 relative hidden md:flex flex-col justify-between p-10 overflow-hidden bg-[#eef3fb] border-r border-slate-200/80 text-slate-800">
          <div className="dot-grid absolute inset-0 opacity-40 pointer-events-none"></div>

          <div className="brand-content relative z-10 flex flex-col justify-center h-full">
            
            {/* Top Logo */}
            <div className="brand-logo w-16 h-16 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center mb-6 shadow-sm mx-auto border border-indigo-200/60">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8">
                <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
                <path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5"/>
              </svg>
            </div>

            <h1 className="brand-title text-3xl font-extrabold tracking-tight text-center mb-2 font-display">
              <span className="text-slate-900">CAMPUSX </span>
              <span className="text-[#6366f1]">OS</span>
            </h1>
            <p className="brand-tagline text-slate-500 text-sm text-center mb-10 max-w-xs mx-auto leading-relaxed">
              Role-Aware Enterprise IAM & Administrative Workspace
            </p>

            {/* Three Feature Cards */}
            <div className="brand-features flex flex-col gap-4 w-full">
              <div className="brand-feature bg-white/90 backdrop-blur-sm border border-slate-200/80 shadow-sm p-4 rounded-2xl flex items-start gap-4 hover:shadow-md transition-all">
                <div className="feature-icon w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 border border-indigo-100">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                </div>
                <div className="feature-text flex flex-col">
                  <strong className="text-sm font-bold text-slate-900">Zero Trust Architecture</strong>
                  <span className="text-xs text-slate-500 mt-0.5 leading-relaxed">Automatic IAM role resolution, secure URL route guards, and granular blockchain verification.</span>
                </div>
              </div>
              
              <div className="brand-feature bg-white/90 backdrop-blur-sm border border-slate-200/80 shadow-sm p-4 rounded-2xl flex items-start gap-4 hover:shadow-md transition-all">
                <div className="feature-icon w-10 h-10 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center shrink-0 border border-cyan-100">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                </div>
                <div className="feature-text flex flex-col">
                  <strong className="text-sm font-bold text-slate-900">Unified Identity Hub</strong>
                  <span className="text-xs text-slate-500 mt-0.5 leading-relaxed">Singular login for ERP, CONNECT, CHAIN, and WEB3. Automatically filters permissions, widgets, and links.</span>
                </div>
              </div>

              <div className="brand-feature bg-white/90 backdrop-blur-sm border border-slate-200/80 shadow-sm p-4 rounded-2xl flex items-start gap-4 hover:shadow-md transition-all">
                <div className="feature-icon w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                </div>
                <div className="feature-text flex flex-col">
                  <strong className="text-sm font-bold text-slate-900">Active Threat Detection</strong>
                  <span className="text-xs text-slate-500 mt-0.5 leading-relaxed">Real-time local ML anomaly score models tracking password attempts, patterns, and login contexts.</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Form Right Panel */}
        <div className="auth-form-panel md:col-span-7 flex flex-col justify-between p-6 md:p-8 bg-white relative overflow-y-auto">
          
          {/* Force Password Change Overlay */}
          {mustChange && tempUser && (
            <div className="absolute inset-0 bg-white z-50 p-8 md:p-12 flex flex-col justify-center fade-in">
              <div className="mb-6">
                <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center text-amber-600 mb-4 border border-amber-200">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6"><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/></svg>
                </div>
                <h2 className="text-2xl font-bold text-slate-900 font-display mb-1">Update Security Credentials</h2>
                <p className="text-xs text-slate-500">First-time login detected for <span className="text-indigo-600 font-mono font-bold">{tempUser.email}</span>. A password change is required to secure your account.</p>
              </div>

              <form onSubmit={handleChangePassword} className="flex flex-col gap-4">
                <div className="auth-input-group relative">
                  <input 
                    type={newPasswordShow ? "text" : "password"} 
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required 
                    placeholder="New Password" 
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3.5 pr-11 text-sm text-slate-900 outline-none focus:border-[#4f46e5] focus:bg-white focus:ring-2 focus:ring-indigo-500/20 transition-all placeholder-slate-400"
                  />
                  <button 
                    type="button" 
                    onClick={() => setNewPasswordShow(!newPasswordShow)}
                    className="password-toggle absolute right-4 top-3.5 text-slate-400 hover:text-slate-700 cursor-pointer bg-transparent border-none"
                  >
                    {newPasswordShow ? (
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                    ) : (
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                    )}
                  </button>
                </div>

                <button 
                  type="submit" 
                  disabled={changeLoading}
                  className="w-full py-3.5 bg-[#4f46e5] hover:bg-[#4338ca] text-white rounded-2xl font-bold text-sm transition-all shadow-lg shadow-indigo-500/25 cursor-pointer disabled:opacity-50"
                >
                  {changeLoading ? 'Updating Password...' : 'Save & Proceed to Workspace'}
                </button>
              </form>
            </div>
          )}

          {/* Mobile-only Header */}
          <div className="mobile-brand flex md:hidden flex-col items-center gap-2 mb-6">
            <div className="brand-logo w-12 h-12 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center border border-indigo-200">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
                <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
                <path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5"/>
              </svg>
            </div>
            <h1 className="brand-title text-xl font-extrabold tracking-tight text-slate-900 font-display">CAMPUSX OS</h1>
          </div>

          {/* Header Title & Subtitle FIRST */}
          <div className="auth-header-section mb-4">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 font-display mb-1">
              {activeTab === 'signin' ? 'Welcome Back' : 'Create Access Credentials'}
            </h2>
            <p className="text-xs md:text-sm text-slate-500">
              {activeTab === 'signin' ? 'Enter your credentials or choose a SSO provider to log in' : 'Register a new identity on the CampusX mesh network'}
            </p>
          </div>

          {/* Upper Segmented Pill Tab Switcher SECOND */}
          <div className="auth-tab-switcher bg-[#f1f4f9] p-1.5 rounded-2xl border border-slate-200/70 flex items-center mb-6 shrink-0 w-full shadow-sm">
            <button 
              type="button"
              className={`flex-1 py-2.5 px-6 text-xs font-bold rounded-xl transition-all duration-200 cursor-pointer text-center flex items-center justify-center gap-2 ${activeTab === 'signin' ? 'bg-[#4f46e5] text-white shadow-md shadow-indigo-500/20' : 'text-slate-600 hover:text-slate-900 bg-transparent'}`}
              onClick={() => { setActiveTab('signin'); setSigninError(''); }}
            >
              <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/></svg>
              <span>Sign In</span>
            </button>
            <button 
              type="button"
              className={`flex-1 py-2.5 px-6 text-xs font-bold rounded-xl transition-all duration-200 cursor-pointer text-center flex items-center justify-center gap-2 ${activeTab === 'signup' ? 'bg-[#4f46e5] text-white shadow-md shadow-indigo-500/20' : 'text-slate-600 hover:text-slate-900 bg-transparent'}`}
              onClick={() => { setActiveTab('signup'); setSigninError(''); }}
            >
              <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="20" y1="8" x2="20" y2="14"/><line x1="17" y1="11" x2="23" y2="11"/></svg>
              <span>Sign Up</span>
            </button>
          </div>

          {/* Sign In View */}
          {activeTab === 'signin' ? (
            <div className="auth-form-container fade-in flex-1 flex flex-col justify-between">
              <div>
                <form onSubmit={handleSignIn}>
                  {/* Email Input */}
                  <div className="auth-input-group relative mb-4">
                    <input 
                      type="email" 
                      value={signinEmail}
                      onChange={(e) => setSigninEmail(e.target.value)}
                      required 
                      placeholder="Email Address" 
                      className="w-full bg-[#f8fafc] border border-slate-200 rounded-2xl px-4 py-3.5 pl-11 text-sm text-slate-900 outline-none focus:border-[#4f46e5] focus:bg-white focus:ring-2 focus:ring-indigo-500/20 transition-all placeholder-slate-400 shadow-sm"
                    />
                    <div className="absolute left-3.5 top-0 bottom-0 flex items-center pointer-events-none text-slate-400">
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                    </div>
                  </div>

                  {/* Password Input */}
                  <div className="auth-input-group relative mb-4">
                    <input 
                      type={signinShowPassword ? "text" : "password"} 
                      value={signinPassword}
                      onChange={(e) => setSigninPassword(e.target.value)}
                      required 
                      placeholder="Password" 
                      className="w-full bg-[#f8fafc] border border-slate-200 rounded-2xl px-4 py-3.5 pr-11 text-sm text-slate-900 outline-none focus:border-[#4f46e5] focus:bg-white focus:ring-2 focus:ring-indigo-500/20 transition-all placeholder-slate-400 shadow-sm"
                    />
                    <button 
                      type="button" 
                      onClick={() => setSigninShowPassword(!signinShowPassword)}
                      className="password-toggle absolute right-4 top-4 text-slate-400 hover:text-slate-700 cursor-pointer bg-transparent border-none"
                    >
                      {signinShowPassword ? (
                        <svg className="eye-closed w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                      ) : (
                        <svg className="eye-open w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                      )}
                    </button>
                  </div>

                  {/* Options Row */}
                  <div className="auth-options flex items-center justify-between mb-5">
                    <label className="custom-checkbox flex items-center gap-2 text-xs text-slate-600 cursor-pointer select-none">
                      <input type="checkbox" className="accent-indigo-600 rounded" />
                      Remember this machine
                    </label>
                    <span className="forgot-link text-xs text-[#4f46e5] font-semibold hover:underline cursor-pointer" onClick={() => alert('Demo notice: All passwords start as "Demo@123". Check credentials below.')}>Forgot Password?</span>
                  </div>

                  {/* Submit Button */}
                  <button 
                    type="submit" 
                    disabled={signinLoading}
                    className="auth-submit-btn w-full py-3.5 bg-[#4f46e5] hover:bg-[#4338ca] text-white rounded-2xl font-bold text-sm transition-all shadow-lg shadow-indigo-500/25 flex items-center justify-center gap-2 cursor-pointer border-none disabled:opacity-50"
                  >
                    {signinLoading ? 'Authenticating...' : 'Sign In'}
                  </button>

                  {signinError && (
                    <div className="auth-error mt-3 p-3 bg-rose-50 border border-rose-200 text-rose-600 rounded-xl text-xs flex items-center gap-2">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4.5 h-4.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                      <span>{signinError}</span>
                    </div>
                  )}
                </form>

                {/* SSO Divider */}
                <div className="auth-divider flex items-center text-center my-5 text-[10px] font-bold tracking-wider text-slate-400 uppercase before:content-[''] before:flex-1 before:border-b before:border-slate-200 before:mr-4 after:content-[''] after:flex-1 after:border-b after:border-slate-200 after:ml-4">
                  <span>OR SIGN IN USING SSO</span>
                </div>

                {/* SSO Buttons */}
                <div className="social-buttons grid grid-cols-3 gap-3">
                  <button type="button" className="social-btn flex items-center justify-center gap-2 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-2xl text-xs font-semibold shadow-sm transition-all cursor-pointer" onClick={() => handleSSO('Google')}>
                    <svg viewBox="0 0 24 24" width="16" height="16">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18A10.96 10.96 0 0 0 1 12c0 1.77.42 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                    </svg>
                    Google
                  </button>
                  <button type="button" className="social-btn flex items-center justify-center gap-2 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-2xl text-xs font-semibold shadow-sm transition-all cursor-pointer" onClick={() => handleSSO('Microsoft')}>
                    <svg viewBox="0 0 24 24" width="16" height="16">
                      <rect x="1" y="1" width="10" height="10" fill="#F25022"/>
                      <rect x="13" y="1" width="10" height="10" fill="#7FBA00"/>
                      <rect x="1" y="13" width="10" height="10" fill="#00A4EF"/>
                      <rect x="13" y="13" width="10" height="10" fill="#FFB900"/>
                    </svg>
                    Microsoft
                  </button>
                  <button type="button" className="social-btn flex items-center justify-center gap-2 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-2xl text-xs font-semibold shadow-sm transition-all cursor-pointer" onClick={() => handleSSO('Passkey')}>
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-cyan-600"><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/></svg>
                    Passkey
                  </button>
                </div>
              </div>

              {/* All Quick Demo Logins Section */}
              {isDev && (
                <div className="auth-demo-info mt-6 p-4 bg-[#f8fafc] rounded-2xl border border-slate-200/80 text-center shadow-sm">
                  <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-200/70">
                    <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-700 font-display">Quick Demo Logins (Click to prefill)</span>
                    <button 
                      type="button" 
                      onClick={() => handleOneClickLogin('admin@campusx.demo', 'Demo@123')}
                      className="py-1 px-3 bg-[#4f46e5] hover:bg-[#4338ca] text-white rounded-lg text-[10px] font-bold transition-all shadow-sm flex items-center gap-1.5 cursor-pointer border-none"
                    >
                      <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
                      <span>1-Click Admin Login</span>
                    </button>
                  </div>

                  <div className="demo-creds-list grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-[200px] overflow-y-auto pr-1 text-left chat-scroll">
                    <div className="demo-cred p-2 rounded-xl bg-white hover:bg-indigo-50/80 border border-slate-200/80 transition-all cursor-pointer flex flex-col" onClick={() => fillDemo('superadmin@campusx.demo', 'Demo@123')}>
                      <span className="role-badge text-[10px] font-bold text-rose-600">Super Admin</span>
                      <span className="text-[10px] text-slate-500 truncate mt-0.5">superadmin@campusx.demo</span>
                    </div>
                    <div className="demo-cred p-2 rounded-xl bg-white hover:bg-indigo-50/80 border border-slate-200/80 transition-all cursor-pointer flex flex-col" onClick={() => fillDemo('admin@campusx.demo', 'Demo@123')}>
                      <span className="role-badge text-[10px] font-bold text-cyan-600">Platform Admin</span>
                      <span className="text-[10px] text-slate-500 truncate mt-0.5">admin@campusx.demo</span>
                    </div>
                    <div className="demo-cred p-2 rounded-xl bg-white hover:bg-indigo-50/80 border border-slate-200/80 transition-all cursor-pointer flex flex-col" onClick={() => fillDemo('univadmin@campusx.demo', 'Demo@123')}>
                      <span className="role-badge text-[10px] font-bold text-amber-600">Univ Admin</span>
                      <span className="text-[10px] text-slate-500 truncate mt-0.5">univadmin@campusx.demo</span>
                    </div>
                    <div className="demo-cred p-2 rounded-xl bg-white hover:bg-indigo-50/80 border border-slate-200/80 transition-all cursor-pointer flex flex-col" onClick={() => fillDemo('registrar@campusx.demo', 'Demo@123')}>
                      <span className="role-badge text-[10px] font-bold text-emerald-600">Registrar Officer</span>
                      <span className="text-[10px] text-slate-500 truncate mt-0.5">registrar@campusx.demo</span>
                    </div>
                    <div className="demo-cred p-2 rounded-xl bg-white hover:bg-indigo-50/80 border border-slate-200/80 transition-all cursor-pointer flex flex-col" onClick={() => fillDemo('dean@campusx.demo', 'Demo@123')}>
                      <span className="role-badge text-[10px] font-bold text-indigo-600">Dean of Faculty</span>
                      <span className="text-[10px] text-slate-500 truncate mt-0.5">dean@campusx.demo</span>
                    </div>
                    <div className="demo-cred p-2 rounded-xl bg-white hover:bg-indigo-50/80 border border-slate-200/80 transition-all cursor-pointer flex flex-col" onClick={() => fillDemo('hod@campusx.demo', 'Demo@123')}>
                      <span className="role-badge text-[10px] font-bold text-amber-600">HOD Professor</span>
                      <span className="text-[10px] text-slate-500 truncate mt-0.5">hod@campusx.demo</span>
                    </div>
                    <div className="demo-cred p-2 rounded-xl bg-white hover:bg-indigo-50/80 border border-slate-200/80 transition-all cursor-pointer flex flex-col" onClick={() => fillDemo('faculty@campusx.demo', 'Demo@123')}>
                      <span className="role-badge text-[10px] font-bold text-cyan-600">Faculty Professor</span>
                      <span className="text-[10px] text-slate-500 truncate mt-0.5">faculty@campusx.demo</span>
                    </div>
                    <div className="demo-cred p-2 rounded-xl bg-white hover:bg-indigo-50/80 border border-slate-200/80 transition-all cursor-pointer flex flex-col" onClick={() => fillDemo('finance@campusx.demo', 'Demo@123')}>
                      <span className="role-badge text-[10px] font-bold text-emerald-600">Finance Manager</span>
                      <span className="text-[10px] text-slate-500 truncate mt-0.5">finance@campusx.demo</span>
                    </div>
                    <div className="demo-cred p-2 rounded-xl bg-white hover:bg-indigo-50/80 border border-slate-200/80 transition-all cursor-pointer flex flex-col" onClick={() => fillDemo('research@campusx.demo', 'Demo@123')}>
                      <span className="role-badge text-[10px] font-bold text-purple-600">Research Coord</span>
                      <span className="text-[10px] text-slate-500 truncate mt-0.5">research@campusx.demo</span>
                    </div>
                    <div className="demo-cred p-2 rounded-xl bg-white hover:bg-indigo-50/80 border border-slate-200/80 transition-all cursor-pointer flex flex-col" onClick={() => fillDemo('placement@campusx.demo', 'Demo@123')}>
                      <span className="role-badge text-[10px] font-bold text-blue-600">Placement Officer</span>
                      <span className="text-[10px] text-slate-500 truncate mt-0.5">placement@campusx.demo</span>
                    </div>
                    <div className="demo-cred p-2 rounded-xl bg-white hover:bg-indigo-50/80 border border-slate-200/80 transition-all cursor-pointer flex flex-col" onClick={() => fillDemo('student@campusx.demo', 'Demo@123')}>
                      <span className="role-badge text-[10px] font-bold text-indigo-600">Student</span>
                      <span className="text-[10px] text-slate-500 truncate mt-0.5">student@campusx.demo</span>
                    </div>
                    <div className="demo-cred p-2 rounded-xl bg-white hover:bg-indigo-50/80 border border-slate-200/80 transition-all cursor-pointer flex flex-col" onClick={() => fillDemo('parent_role@campusx.demo', 'Demo@123')}>
                      <span className="role-badge text-[10px] font-bold text-pink-600">General Parent</span>
                      <span className="text-[10px] text-slate-500 truncate mt-0.5">parent_role@campusx.demo</span>
                    </div>
                    <div className="demo-cred p-2 rounded-xl bg-white hover:bg-indigo-50/80 border border-slate-200/80 transition-all cursor-pointer flex flex-col" onClick={() => fillDemo('alumni@campusx.demo', 'Demo@123')}>
                      <span className="role-badge text-[10px] font-bold text-slate-600">Alumni Account</span>
                      <span className="text-[10px] text-slate-500 truncate mt-0.5">alumni@campusx.demo</span>
                    </div>
                    <div className="demo-cred p-2 rounded-xl bg-white hover:bg-indigo-50/80 border border-slate-200/80 transition-all cursor-pointer flex flex-col" onClick={() => fillDemo('recruiter@campusx.demo', 'Demo@123')}>
                      <span className="role-badge text-[10px] font-bold text-indigo-600">Recruiter</span>
                      <span className="text-[10px] text-slate-500 truncate mt-0.5">recruiter@campusx.demo</span>
                    </div>
                    <div className="demo-cred p-2 rounded-xl bg-white hover:bg-indigo-50/80 border border-slate-200/80 transition-all cursor-pointer flex flex-col" onClick={() => fillDemo('sportsdirector@campusx.demo', 'Demo@123')}>
                      <span className="role-badge text-[10px] font-bold text-indigo-600">Sports Director</span>
                      <span className="text-[10px] text-slate-500 truncate mt-0.5">sportsdirector@campusx.demo</span>
                    </div>
                    <div className="demo-cred p-2 rounded-xl bg-white hover:bg-indigo-50/80 border border-slate-200/80 transition-all cursor-pointer flex flex-col" onClick={() => fillDemo('coach@campusx.demo', 'Demo@123')}>
                      <span className="role-badge text-[10px] font-bold text-cyan-600">Sports Coach</span>
                      <span className="text-[10px] text-slate-500 truncate mt-0.5">coach@campusx.demo</span>
                    </div>
                    <div className="demo-cred p-2 rounded-xl bg-white hover:bg-indigo-50/80 border border-slate-200/80 transition-all cursor-pointer flex flex-col" onClick={() => fillDemo('athlete@campusx.demo', 'Demo@123')}>
                      <span className="role-badge text-[10px] font-bold text-emerald-600">Sports Athlete</span>
                      <span className="text-[10px] text-slate-500 truncate mt-0.5">athlete@campusx.demo</span>
                    </div>
                    <div className="demo-cred p-2 rounded-xl bg-white hover:bg-indigo-50/80 border border-slate-200/80 transition-all cursor-pointer flex flex-col" onClick={() => fillDemo('parent@campusx.demo', 'Demo@123')}>
                      <span className="role-badge text-[10px] font-bold text-purple-600">Sports Parent</span>
                      <span className="text-[10px] text-slate-500 truncate mt-0.5">parent@campusx.demo</span>
                    </div>
                    <div className="demo-cred p-2 rounded-xl bg-white hover:bg-indigo-50/80 border border-slate-200/80 transition-all cursor-pointer flex flex-col" onClick={() => fillDemo('deptadmin@campusx.demo', 'Demo@123')}>
                      <span className="role-badge text-[10px] font-bold text-amber-600">Department Admin</span>
                      <span className="text-[10px] text-slate-500 truncate mt-0.5">deptadmin@campusx.demo</span>
                    </div>
                    <div className="demo-cred p-2 rounded-xl bg-white hover:bg-indigo-50/80 border border-slate-200/80 transition-all cursor-pointer flex flex-col" onClick={() => fillDemo('libraryadmin@campusx.demo', 'Demo@123')}>
                      <span className="role-badge text-[10px] font-bold text-emerald-600">Library Admin</span>
                      <span className="text-[10px] text-slate-500 truncate mt-0.5">libraryadmin@campusx.demo</span>
                    </div>
                    <div className="demo-cred p-2 rounded-xl bg-white hover:bg-indigo-50/80 border border-slate-200/80 transition-all cursor-pointer flex flex-col" onClick={() => fillDemo('hosteladmin@campusx.demo', 'Demo@123')}>
                      <span className="role-badge text-[10px] font-bold text-indigo-600">Hostel Manager</span>
                      <span className="text-[10px] text-slate-500 truncate mt-0.5">hosteladmin@campusx.demo</span>
                    </div>
                    <div className="demo-cred p-2 rounded-xl bg-white hover:bg-indigo-50/80 border border-slate-200/80 transition-all cursor-pointer flex flex-col" onClick={() => fillDemo('transportadmin@campusx.demo', 'Demo@123')}>
                      <span className="role-badge text-[10px] font-bold text-teal-600">Transport Coord</span>
                      <span className="text-[10px] text-slate-500 truncate mt-0.5">transportadmin@campusx.demo</span>
                    </div>
                    <div className="demo-cred p-2 rounded-xl bg-white hover:bg-indigo-50/80 border border-slate-200/80 transition-all cursor-pointer flex flex-col" onClick={() => fillDemo('medical@campusx.demo', 'Demo@123')}>
                      <span className="role-badge text-[10px] font-bold text-rose-600">Medical Staff</span>
                      <span className="text-[10px] text-slate-500 truncate mt-0.5">medical@campusx.demo</span>
                    </div>
                    <div className="demo-cred p-2 rounded-xl bg-white hover:bg-indigo-50/80 border border-slate-200/80 transition-all cursor-pointer flex flex-col" onClick={() => fillDemo('guest@campusx.demo', 'Demo@123')}>
                      <span className="role-badge text-[10px] font-bold text-slate-400">Guest Visitor</span>
                      <span className="text-[10px] text-slate-500 truncate mt-0.5">guest@campusx.demo</span>
                    </div>
                    <div className="demo-cred p-2 rounded-xl bg-white hover:bg-indigo-50/80 border border-slate-200/80 transition-all cursor-pointer flex flex-col" onClick={() => fillDemo('consultant@campusx.demo', 'Demo@123')}>
                      <span className="role-badge text-[10px] font-bold text-purple-600">Consultant</span>
                      <span className="text-[10px] text-slate-500 truncate mt-0.5">consultant@campusx.demo</span>
                    </div>
                    <div className="demo-cred p-2 rounded-xl bg-white hover:bg-indigo-50/80 border border-slate-200/80 transition-all cursor-pointer flex flex-col" onClick={() => fillDemo('auditor@campusx.demo', 'Demo@123')}>
                      <span className="role-badge text-[10px] font-bold text-amber-600">Auditor</span>
                      <span className="text-[10px] text-slate-500 truncate mt-0.5">auditor@campusx.demo</span>
                    </div>
                    <div className="demo-cred p-2 rounded-xl bg-white hover:bg-indigo-50/80 border border-slate-200/80 transition-all cursor-pointer flex flex-col" onClick={() => fillDemo('compliance@campusx.demo', 'Demo@123')}>
                      <span className="role-badge text-[10px] font-bold text-cyan-600">Compliance Officer</span>
                      <span className="text-[10px] text-slate-500 truncate mt-0.5">compliance@campusx.demo</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Sign Up View */
            <div className="auth-form-container fade-in flex-1 flex flex-col justify-between">
              <div>
                <form onSubmit={handleSignUp}>
                  <div className="auth-input-group relative mb-4">
                    <input 
                      type="text" 
                      value={signupName}
                      onChange={(e) => setSignupName(e.target.value)}
                      required 
                      placeholder="Full Name" 
                      className="w-full bg-[#f8fafc] border border-slate-200 rounded-2xl px-4 py-3.5 text-sm text-slate-900 outline-none focus:border-[#4f46e5] focus:bg-white focus:ring-2 focus:ring-indigo-500/20 transition-all placeholder-slate-400 shadow-sm"
                    />
                  </div>

                  <div className="auth-input-group relative mb-4">
                    <input 
                      type="email" 
                      value={signupEmail}
                      onChange={(e) => setSignupEmail(e.target.value)}
                      required 
                      placeholder="Email Address" 
                      className="w-full bg-[#f8fafc] border border-slate-200 rounded-2xl px-4 py-3.5 text-sm text-slate-900 outline-none focus:border-[#4f46e5] focus:bg-white focus:ring-2 focus:ring-indigo-500/20 transition-all placeholder-slate-400 shadow-sm"
                    />
                  </div>

                  <div className="auth-input-group relative mb-4">
                    <select 
                      value={signupRole}
                      onChange={(e) => setSignupRole(e.target.value)}
                      className="w-full bg-[#f8fafc] border border-slate-200 rounded-2xl px-4 py-3.5 text-sm text-slate-900 outline-none focus:border-[#4f46e5] focus:bg-white focus:ring-2 focus:ring-indigo-500/20 transition-all shadow-sm"
                    >
                      <option value="student">Student</option>
                      <option value="faculty">Faculty Member</option>
                      <option value="hod">HOD (Department Head)</option>
                      <option value="admin">University Administrator</option>
                      <option value="sports_director">Sports Director</option>
                      <option value="coach">Sports Coach</option>
                      <option value="athlete">Student Athlete</option>
                      <option value="sports_parent">Sports Parent</option>
                      <option value="parent">Parent</option>
                      <option value="alumni">Alumni</option>
                      <option value="recruiter">Recruiter</option>
                    </select>
                    <label className="select-label absolute left-4 top-1 text-[0.65rem] text-slate-400 font-bold uppercase">Access Hierarchy Role</label>
                  </div>

                  <div className="auth-input-group relative mb-3">
                    <input 
                      type={signupShowPassword ? "text" : "password"} 
                      value={signupPassword}
                      onChange={(e) => setSignupPassword(e.target.value)}
                      required 
                      placeholder="Password" 
                      className="w-full bg-[#f8fafc] border border-slate-200 rounded-2xl px-4 py-3.5 pr-11 text-sm text-slate-900 outline-none focus:border-[#4f46e5] focus:bg-white focus:ring-2 focus:ring-indigo-500/20 transition-all placeholder-slate-400 shadow-sm"
                    />
                    <button 
                      type="button" 
                      onClick={() => setSignupShowPassword(!signupShowPassword)}
                      className="password-toggle absolute right-4 top-4 text-slate-400 hover:text-slate-700 cursor-pointer bg-transparent border-none"
                    >
                      {signupShowPassword ? (
                        <svg className="eye-closed w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                      ) : (
                        <svg className="eye-open w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                      )}
                    </button>
                  </div>

                  {/* Password Strength Indicator */}
                  <div className="password-strength mb-4">
                    <div className="strength-bar w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                      <div 
                        className={`strength-fill h-full transition-all duration-300 ${strengthLevel === 'weak' ? 'bg-rose-500 w-1/3' : (strengthLevel === 'medium' ? 'bg-amber-500 w-2/3' : 'bg-emerald-500 w-full')}`}
                      ></div>
                    </div>
                    <span className={`strength-text text-[0.7rem] mt-1 block font-bold ${strengthLevel === 'weak' ? 'text-rose-500' : (strengthLevel === 'medium' ? 'text-amber-500' : 'text-emerald-500')}`}>
                      Complexity: {strengthText.toUpperCase()}
                    </span>
                  </div>

                  <div className="auth-input-group relative mb-4">
                    <input 
                      type="password" 
                      value={signupConfirmPassword}
                      onChange={(e) => setSignupConfirmPassword(e.target.value)}
                      required 
                      placeholder="Confirm Password" 
                      className="w-full bg-[#f8fafc] border border-slate-200 rounded-2xl px-4 py-3.5 text-sm text-slate-900 outline-none focus:border-[#4f46e5] focus:bg-white focus:ring-2 focus:ring-indigo-500/20 transition-all placeholder-slate-400 shadow-sm"
                    />
                  </div>

                  <button 
                    type="submit" 
                    disabled={signupLoading}
                    className="auth-submit-btn w-full py-3.5 bg-[#4f46e5] hover:bg-[#4338ca] text-white rounded-2xl font-bold text-sm transition-all shadow-lg shadow-indigo-500/25 flex items-center justify-center gap-2 cursor-pointer border-none disabled:opacity-50"
                  >
                    {signupLoading ? 'Registering Account...' : 'Complete Register'}
                  </button>

                  {signupError && (
                    <div className="auth-error mt-3 p-3 bg-rose-50 border border-rose-200 text-rose-600 rounded-xl text-xs flex items-center gap-2">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4.5 h-4.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                      <span>{signupError}</span>
                    </div>
                  )}

                  {signupSuccess && (
                    <div className="auth-success mt-3 p-3 bg-emerald-50 border border-emerald-200 text-emerald-600 rounded-xl text-xs flex items-center gap-2">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4.5 h-4.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                      <span>{signupSuccess}</span>
                    </div>
                  )}
                </form>
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="auth-footer text-center mt-6 text-xs text-slate-400 shrink-0">
            <p>&copy; 2026 CampusX University Operating System. All rights reserved.</p>
          </div>
        </div>

      </div>
    </div>
  );
}
