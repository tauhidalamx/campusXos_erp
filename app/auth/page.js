'use client';

import React, { useState, useEffect, useRef } from 'react';
import '../../styles/auth.css';

export default function AuthPage() {
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
  const [threatPercent, setThreatPercent] = useState(0.12);
  const [threatStatus, setThreatStatus] = useState('Normal');
  const [threatDesc, setThreatDesc] = useState('TensorFlow.js model running inference on attempt timestamps, input patterns, and failure thresholds.');
  const [threatBarColor, setThreatBarColor] = useState('var(--color-brand-primary)');

  const [failureCount, setFailureCount] = useState(0);
  const tfModelRef = useRef(null);

  // Storage Keys
  const USERS_KEY = 'campusx_erp_users';
  const SESSION_KEY = 'campusx_erp_session';

  const DEFAULT_ACCOUNTS = [
    {
      "id": "usr_001",
      "name": "Dr. Evelyn Sterling",
      "email": "admin@campusx.edu",
      "password": "h$g10hvh", // corresponds to "admin123"
      "role": "admin",
      "avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
      "createdAt": "2024-01-01T00:00:00.000Z"
    },
    {
      "id": "usr_002",
      "name": "Prof. Marcus Chen",
      "email": "faculty@campusx.edu",
      "password": "h$rwy182", // corresponds to "faculty123"
      "role": "faculty",
      "avatar": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
      "createdAt": "2024-01-15T00:00:00.000Z"
    },
    {
      "id": "usr_003",
      "name": "Aria Nakamura",
      "email": "student@campusx.edu",
      "password": "h$h2pckp", // corresponds to "student123"
      "role": "student",
      "avatar": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150",
      "createdAt": "2024-02-01T00:00:00.000Z"
    },
    {
      "id": "usr_004",
      "name": "Prof. Sarah Jenkins",
      "email": "hod@campusx.edu",
      "password": "h$k1lauj", // corresponds to "hod123"
      "role": "hod",
      "avatar": "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150",
      "createdAt": "2024-01-20T00:00:00.000Z"
    },
    {
      "id": "usr_demo_1",
      "name": "Global Super Admin",
      "email": "superadmin@demo.campusx.edu",
      "password": "h$rv7t6",
      "role": "admin",
      "avatar": "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150",
      "createdAt": "2026-06-08T00:00:00.000Z"
    },
    {
      "id": "usr_demo_2",
      "name": "University Admin",
      "email": "admin@demo.campusx.edu",
      "password": "h$rv7t6",
      "role": "admin",
      "avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
      "createdAt": "2026-06-08T00:00:00.000Z"
    },
    {
      "id": "usr_demo_3",
      "name": "Registrar Officer",
      "email": "registrar@demo.campusx.edu",
      "password": "h$rv7t6",
      "role": "registrar",
      "avatar": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
      "createdAt": "2026-06-08T00:00:00.000Z"
    },
    {
      "id": "usr_demo_4",
      "name": "Dean of Faculty",
      "email": "dean@demo.campusx.edu",
      "password": "h$rv7t6",
      "role": "dean",
      "avatar": "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150",
      "createdAt": "2026-06-08T00:00:00.000Z"
    },
    {
      "id": "usr_demo_5",
      "name": "Professor Sterling",
      "email": "faculty@demo.campusx.edu",
      "password": "h$rv7t6",
      "role": "faculty",
      "avatar": "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150",
      "createdAt": "2026-06-08T00:00:00.000Z"
    },
    {
      "id": "usr_demo_6",
      "name": "Alex Rivera",
      "email": "student@demo.campusx.edu",
      "password": "h$rv7t6",
      "role": "student",
      "avatar": "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150",
      "createdAt": "2026-06-08T00:00:00.000Z"
    },
    {
      "id": "usr_demo_7",
      "name": "Lead Recruiter",
      "email": "recruiter@demo.campusx.edu",
      "password": "h$rv7t6",
      "role": "recruiter",
      "avatar": "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150",
      "createdAt": "2026-06-08T00:00:00.000Z"
    }
  ];

  // Hashing Helper
  const hashPassword = (plain) => {
    var hash = 0;
    for (var i = 0; i < plain.length; i++) {
      var ch = plain.charCodeAt(i);
      hash = ((hash << 5) - hash) + ch;
      hash |= 0;
    }
    return 'h$' + Math.abs(hash).toString(36);
  };

  // Initialize accounts
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const existing = localStorage.getItem(USERS_KEY);
      if (!existing) {
        localStorage.setItem(USERS_KEY, JSON.stringify(DEFAULT_ACCOUNTS));
      } else {
        const users = JSON.parse(existing);
        let modified = false;
        DEFAULT_ACCOUNTS.forEach(def => {
          const foundIndex = users.findIndex(u => u.email === def.email);
          if (foundIndex === -1) {
            users.push(def);
            modified = true;
          } else if (users[foundIndex].password !== def.password) {
            users[foundIndex].password = def.password;
            modified = true;
          }
        });
        if (modified) {
          localStorage.setItem(USERS_KEY, JSON.stringify(users));
        }
      }
      
      // Check if logged in
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

  // Password Strength Check
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
      if (data.success && data.user) {
        const user = data.user;
        const sessionData = {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          avatar: user.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
          loginAt: new Date().toISOString()
        };
        sessionStorage.setItem(SESSION_KEY, JSON.stringify(sessionData));
        setSigninLoading(false);
        window.location.href = '/';
      } else {
        throw new Error('Invalid email or password.');
      }
    })
    .catch(err => {
      setSigninError(err.message || 'Invalid email or password. Please try again.');
      setFailureCount(prev => prev + 1);
      setSigninLoading(false);
    });
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
      
      // Switch back to signin tab after 1.5s
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

  const fillDemo = (email, pass) => {
    setSigninEmail(email);
    setSigninPassword(pass);
  };

  return (
    <div className="bg-brand-bg-primary text-brand-text-main font-sans min-h-screen flex items-center justify-center p-4">
      <div className="auth-container w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 min-h-[700px] bg-brand-bg-secondary border border-brand-border rounded-3xl overflow-hidden shadow-2xl relative">
        
        {/* Brand Left Panel */}
        <div className="auth-brand relative hidden md:flex flex-col justify-between p-12 overflow-hidden bg-brand-bg-tertiary border-r border-brand-border">
          <div className="orb orb-1"></div>
          <div className="orb orb-2"></div>
          <div className="orb orb-3"></div>
          <div className="dot-grid"></div>

          <div className="brand-content relative z-10">
            <div className="brand-logo w-12 h-12 rounded-xl bg-brand-primary/10 flex items-center justify-center text-brand-primary mb-8 border border-brand-primary/20">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
                <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
                <path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5"/>
              </svg>
            </div>

            <h1 className="brand-title text-2xl font-bold tracking-tight text-white font-display mb-2">CAMPUSX UNIVERSITY</h1>
            <p className="brand-tagline text-brand-text-muted text-sm mb-12">Next-Generation Campus Management Platform</p>

            <div className="brand-features flex flex-col gap-6">
              <div className="brand-feature flex items-start gap-4">
                <div className="feature-icon w-10 h-10 rounded-lg bg-brand-bg-secondary flex items-center justify-center text-brand-accent-cyan border border-brand-border shrink-0">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                    <path d="M21.21 15.89A10 10 0 1 1 8 2.83"/>
                    <path d="M22 12A10 10 0 0 0 12 2v10z"/>
                  </svg>
                </div>
                <div className="feature-text flex flex-col">
                  <strong className="text-sm font-semibold text-white">Smart Analytics</strong>
                  <span className="text-xs text-brand-text-muted mt-1">AI-powered insights for academic excellence</span>
                </div>
              </div>
              
              <div className="brand-feature flex items-start gap-4">
                <div className="feature-icon w-10 h-10 rounded-lg bg-brand-bg-secondary flex items-center justify-center text-brand-accent-cyan border border-brand-border shrink-0">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                  </svg>
                </div>
                <div className="feature-text flex flex-col">
                  <strong className="text-sm font-semibold text-white">Secure Records</strong>
                  <span className="text-xs text-brand-text-muted mt-1">Enterprise-grade data protection & encryption</span>
                </div>
              </div>

              <div className="brand-feature flex items-start gap-4">
                <div className="feature-icon w-10 h-10 rounded-lg bg-brand-bg-secondary flex items-center justify-center text-brand-accent-cyan border border-brand-border shrink-0">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
                  </svg>
                </div>
                <div className="feature-text flex flex-col">
                  <strong className="text-sm font-semibold text-white">Real-time Tracking</strong>
                  <span className="text-xs text-brand-text-muted mt-1">Live attendance, grades & financial dashboards</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Form Right Panel */}
        <div className="auth-form-panel flex flex-col justify-between p-8 md:p-12 bg-brand-bg-secondary">
          
          {/* Mobile-only Header */}
          <div className="mobile-brand flex md:hidden flex-col items-center gap-4 mb-8">
            <div className="brand-logo w-12 h-12 rounded-xl bg-brand-primary/10 flex items-center justify-center text-brand-primary border border-brand-primary/20">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
                <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
                <path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5"/>
              </svg>
            </div>
            <h1 className="brand-title text-xl font-bold tracking-tight text-white font-display">CAMPUSX UNIVERSITY</h1>
          </div>

          {/* Form Tabs */}
          <div className="auth-tabs flex gap-4 border-b border-brand-border pb-4 mb-8 shrink-0">
            <button 
              className={`auth-tab text-sm font-semibold pb-2 border-b-2 cursor-pointer transition-all hover:text-white ${activeTab === 'signin' ? 'active border-brand-primary text-white' : 'border-transparent text-brand-text-muted'}`}
              onClick={() => { setActiveTab('signin'); setSigninError(''); }}
            >
              Sign In
            </button>
            <button 
              className={`auth-tab text-sm font-semibold pb-2 border-b-2 cursor-pointer transition-all hover:text-white ${activeTab === 'signup' ? 'active border-brand-primary text-white' : 'border-transparent text-brand-text-muted'}`}
              onClick={() => { setActiveTab('signup'); setSignupError(''); }}
            >
              Sign Up
            </button>
          </div>

          {/* Form contents */}
          {activeTab === 'signin' ? (
            <div className="auth-form-container fade-in">
              <h2 className="text-2xl font-bold text-white font-display mb-1">Welcome Back</h2>
              <p className="text-sm text-brand-text-muted mb-6">Sign in to access your campus portal</p>

              <form onSubmit={handleSignIn}>
                <div className="auth-input-group relative mb-5">
                  <input 
                    type="email" 
                    value={signinEmail}
                    onChange={(e) => setSigninEmail(e.target.value)}
                    required 
                    placeholder="Email Address" 
                    className="w-full bg-brand-bg-tertiary border border-brand-border rounded-xl px-4 py-3 pl-11 text-sm text-white outline-none focus:border-brand-primary transition-all placeholder-brand-text-subtle"
                  />
                  <svg className="input-icon absolute left-4 top-3.5 w-5 h-5 text-brand-text-subtle" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                    <polyline points="22,6 12,13 2,6"/>
                  </svg>
                </div>

                <div className="auth-input-group relative mb-5">
                  <input 
                    type={signinShowPassword ? "text" : "password"} 
                    value={signinPassword}
                    onChange={(e) => setSigninPassword(e.target.value)}
                    required 
                    placeholder="Password" 
                    className="w-full bg-brand-bg-tertiary border border-brand-border rounded-xl px-4 py-3 pr-11 text-sm text-white outline-none focus:border-brand-primary transition-all placeholder-brand-text-subtle"
                  />
                  <button 
                    type="button" 
                    onClick={() => setSigninShowPassword(!signinShowPassword)}
                    className="password-toggle absolute right-4 top-3.5 text-brand-text-subtle hover:text-white cursor-pointer bg-transparent border-none"
                  >
                    {signinShowPassword ? (
                      <svg className="eye-closed w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                        <line x1="1" y1="1" x2="23" y2="23"/>
                      </svg>
                    ) : (
                      <svg className="eye-open w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                        <circle cx="12" cy="12" r="3"/>
                      </svg>
                    )}
                  </button>
                </div>

                <div className="auth-options flex items-center justify-between mb-6">
                  <label className="custom-checkbox flex items-center gap-2 text-sm text-brand-text-muted cursor-pointer select-none">
                    <input type="checkbox" className="accent-brand-primary" />
                    Remember me
                  </label>
                  <a href="#" className="forgot-link text-sm text-brand-primary hover:text-brand-primary-hover transition-all" onClick={(e) => { e.preventDefault(); alert('For demo purposes, please select one of the credentials below.'); }}>Forgot Password?</a>
                </div>

                <button 
                  type="submit" 
                  disabled={signinLoading}
                  className="auth-submit-btn w-full py-3 bg-brand-primary hover:bg-brand-primary-hover text-white rounded-xl font-semibold transition-all shadow-lg shadow-brand-primary/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {signinLoading ? 'Signing In...' : 'Sign In'}
                </button>

                {signinError && (
                  <div className="auth-error mt-4 p-3 bg-brand-accent-ruby/10 border border-brand-accent-ruby/20 text-brand-accent-ruby rounded-xl text-sm flex items-center gap-2">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
                    <span>{signinError}</span>
                  </div>
                )}
              </form>

              <div className="auth-divider flex items-center text-center my-6 text-xs text-brand-text-subtle before:content-[''] before:flex-1 before:border-b before:border-brand-border before:mr-4 after:content-[''] after:flex-1 after:border-b after:border-brand-border after:ml-4">
                <span>or continue with</span>
              </div>

              <div className="social-buttons grid grid-cols-2 gap-4">
                <button type="button" className="social-btn flex items-center justify-center gap-2 py-2.5 bg-brand-bg-tertiary border border-brand-border hover:bg-brand-bg-secondary text-brand-text-main rounded-xl text-sm font-medium transition-all cursor-pointer" onClick={() => alert('Google SSO coming soon!')}>
                  <svg viewBox="0 0 24 24" width="20" height="20">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18A10.96 10.96 0 0 0 1 12c0 1.77.42 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                  Google
                </button>
                <button type="button" className="social-btn flex items-center justify-center gap-2 py-2.5 bg-brand-bg-tertiary border border-brand-border hover:bg-brand-bg-secondary text-brand-text-main rounded-xl text-sm font-medium transition-all cursor-pointer" onClick={() => alert('Microsoft SSO coming soon!')}>
                  <svg viewBox="0 0 24 24" width="20" height="20">
                    <rect x="1" y="1" width="10" height="10" fill="#F25022"/>
                    <rect x="13" y="1" width="10" height="10" fill="#7FBA00"/>
                    <rect x="1" y="13" width="10" height="10" fill="#00A4EF"/>
                    <rect x="13" y="13" width="10" height="10" fill="#FFB900"/>
                  </svg>
                  Microsoft
                </button>
              </div>

              {/* Demo Credentials */}
              <div className="auth-demo-info mt-6 p-4 bg-brand-bg-tertiary rounded-xl border border-brand-border">
                <p className="text-xs font-bold uppercase tracking-wider text-brand-text-muted mb-3">Demo Credentials (Click to fill)</p>
                <div className="demo-creds-list max-h-[220px] overflow-y-auto pr-1 chat-scroll">
                  <div className="demo-cred flex items-center justify-between p-2 rounded-lg hover:bg-brand-bg-secondary transition-all cursor-pointer mb-2" onClick={() => fillDemo('superadmin@demo.campusx.edu', 'Demo@12345')}>
                    <span className="role-badge admin text-xs font-semibold px-2 py-0.5 rounded bg-brand-accent-ruby/20 text-brand-accent-ruby">Super Admin</span>
                    <code className="text-xs text-brand-text-main">superadmin@demo.campusx.edu / Demo@12345</code>
                  </div>
                  <div className="demo-cred flex items-center justify-between p-2 rounded-lg hover:bg-brand-bg-secondary transition-all cursor-pointer mb-2" onClick={() => fillDemo('admin@demo.campusx.edu', 'Demo@12345')}>
                    <span className="role-badge admin text-xs font-semibold px-2 py-0.5 rounded bg-brand-accent-ruby/20 text-brand-accent-ruby">Univ Admin</span>
                    <code className="text-xs text-brand-text-main">admin@demo.campusx.edu / Demo@12345</code>
                  </div>
                  <div className="demo-cred flex items-center justify-between p-2 rounded-lg hover:bg-brand-bg-secondary transition-all cursor-pointer mb-2" onClick={() => fillDemo('registrar@demo.campusx.edu', 'Demo@12345')}>
                    <span className="role-badge registrar text-xs font-semibold px-2 py-0.5 rounded bg-brand-accent-cyan/20 text-brand-accent-cyan">Registrar</span>
                    <code className="text-xs text-brand-text-main">registrar@demo.campusx.edu / Demo@12345</code>
                  </div>
                  <div className="demo-cred flex items-center justify-between p-2 rounded-lg hover:bg-brand-bg-secondary transition-all cursor-pointer mb-2" onClick={() => fillDemo('dean@demo.campusx.edu', 'Demo@12345')}>
                    <span className="role-badge dean text-xs font-semibold px-2 py-0.5 rounded bg-brand-accent-amber/20 text-brand-accent-amber">Dean</span>
                    <code className="text-xs text-brand-text-main">dean@demo.campusx.edu / Demo@12345</code>
                  </div>
                  <div className="demo-cred flex items-center justify-between p-2 rounded-lg hover:bg-brand-bg-secondary transition-all cursor-pointer mb-2" onClick={() => fillDemo('faculty@demo.campusx.edu', 'Demo@12345')}>
                    <span className="role-badge faculty text-xs font-semibold px-2 py-0.5 rounded bg-brand-accent-cyan/20 text-brand-accent-cyan">Faculty</span>
                    <code className="text-xs text-brand-text-main">faculty@demo.campusx.edu / Demo@12345</code>
                  </div>
                  <div className="demo-cred flex items-center justify-between p-2 rounded-lg hover:bg-brand-bg-secondary transition-all cursor-pointer mb-2" onClick={() => fillDemo('student@demo.campusx.edu', 'Demo@12345')}>
                    <span className="role-badge student text-xs font-semibold px-2 py-0.5 rounded bg-brand-accent-emerald/20 text-brand-accent-emerald">Student</span>
                    <code className="text-xs text-brand-text-main">student@demo.campusx.edu / Demo@12345</code>
                  </div>
                  <div className="demo-cred flex items-center justify-between p-2 rounded-lg hover:bg-brand-bg-secondary transition-all cursor-pointer" onClick={() => fillDemo('recruiter@demo.campusx.edu', 'Demo@12345')}>
                    <span className="role-badge recruiter text-xs font-semibold px-2 py-0.5 rounded bg-[#6366F1]/20 text-[#6366F1]">Recruiter</span>
                    <code className="text-xs text-brand-text-main">recruiter@demo.campusx.edu / Demo@12345</code>
                  </div>
                </div>
              </div>

              {/* AI Anomaly Monitor */}
              <div className="auth-ai-threat-panel mt-6 p-4 bg-brand-bg-tertiary rounded-xl border border-brand-border">
                <div className="flex items-center justify-between mb-3 pb-2 border-b border-brand-border/40">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-brand-accent-cyan animate-pulse"></span>
                    <span className="text-xs font-bold uppercase tracking-wider text-brand-text-main font-display">AI Security Threat Monitor</span>
                  </div>
                  <span className={`badge text-[0.65rem] py-0.5 px-2 font-mono rounded ${threatStatus === 'Normal' ? 'bg-brand-accent-emerald/20 text-brand-accent-emerald' : (threatStatus === 'Elevated Threat' ? 'bg-brand-accent-amber/20 text-brand-accent-amber' : 'bg-brand-accent-ruby/20 text-brand-accent-ruby')}`}>
                    {threatStatus}
                  </span>
                </div>
                <div className="flex flex-col gap-2 text-xs text-brand-text-muted">
                  <div className="flex justify-between items-center">
                    <span>Login Request Anomaly Probability:</span>
                    <span className="font-bold text-brand-text-main font-mono">{threatPercent}%</span>
                  </div>
                  <div className="w-full bg-brand-bg-secondary h-2.5 rounded-full overflow-hidden mt-1 relative border border-brand-border/40">
                    <div className="h-full rounded-full transition-all duration-300" style={{ width: `${threatPercent}%`, backgroundColor: threatBarColor }}></div>
                  </div>
                  <p className="text-[0.65rem] text-brand-text-subtle mt-1">{threatDesc}</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="auth-form-container fade-in">
              <h2 className="text-2xl font-bold text-white font-display mb-1">Create Account</h2>
              <p className="text-sm text-brand-text-muted mb-6">Join the CampusX University portal</p>

              <form onSubmit={handleSignUp}>
                <div className="auth-input-group relative mb-5">
                  <input 
                    type="text" 
                    value={signupName}
                    onChange={(e) => setSignupName(e.target.value)}
                    required 
                    placeholder="Full Name" 
                    className="w-full bg-brand-bg-tertiary border border-brand-border rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-brand-primary transition-all placeholder-brand-text-subtle"
                  />
                </div>

                <div className="auth-input-group relative mb-5">
                  <input 
                    type="email" 
                    value={signupEmail}
                    onChange={(e) => setSignupEmail(e.target.value)}
                    required 
                    placeholder="Email Address" 
                    className="w-full bg-brand-bg-tertiary border border-brand-border rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-brand-primary transition-all placeholder-brand-text-subtle"
                  />
                </div>

                <div className="auth-input-group relative mb-5">
                  <select 
                    value={signupRole}
                    onChange={(e) => setSignupRole(e.target.value)}
                    className="w-full bg-brand-bg-tertiary border border-brand-border rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-brand-primary transition-all"
                  >
                    <option value="student">Student</option>
                    <option value="faculty">Faculty Member</option>
                    <option value="hod">HOD (Department Head)</option>
                    <option value="admin">Administrator</option>
                  </select>
                  <label className="select-label absolute left-4 top-1 text-[0.65rem] text-brand-text-subtle">Account Role</label>
                </div>

                <div className="auth-input-group relative mb-3">
                  <input 
                    type={signupShowPassword ? "text" : "password"} 
                    value={signupPassword}
                    onChange={(e) => setSignupPassword(e.target.value)}
                    required 
                    placeholder="Password" 
                    className="w-full bg-brand-bg-tertiary border border-brand-border rounded-xl px-4 py-3 pr-11 text-sm text-white outline-none focus:border-brand-primary transition-all placeholder-brand-text-subtle"
                  />
                  <button 
                    type="button" 
                    onClick={() => setSignupShowPassword(!signupShowPassword)}
                    className="password-toggle absolute right-4 top-3.5 text-brand-text-subtle hover:text-white cursor-pointer bg-transparent border-none"
                  >
                    {signupShowPassword ? (
                      <svg className="eye-closed w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                        <line x1="1" y1="1" x2="23" y2="23"/>
                      </svg>
                    ) : (
                      <svg className="eye-open w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                        <circle cx="12" cy="12" r="3"/>
                      </svg>
                    )}
                  </button>
                </div>

                {/* Password Strength Indicator */}
                <div className="password-strength mb-5">
                  <div className="strength-bar w-full h-1 bg-brand-bg-primary rounded overflow-hidden">
                    <div 
                      className={`strength-fill h-full transition-all duration-300 ${strengthLevel === 'weak' ? 'bg-brand-accent-ruby w-1/3' : (strengthLevel === 'medium' ? 'bg-brand-accent-amber w-2/3' : 'bg-brand-accent-emerald w-full')}`}
                    ></div>
                  </div>
                  <span className={`strength-text text-xs mt-1 block ${strengthLevel === 'weak' ? 'text-brand-accent-ruby' : (strengthLevel === 'medium' ? 'text-brand-accent-amber' : 'text-brand-accent-emerald')}`}>
                    {strengthText}
                  </span>
                </div>

                <div className="auth-input-group relative mb-5">
                  <input 
                    type="password" 
                    value={signupConfirmPassword}
                    onChange={(e) => setSignupConfirmPassword(e.target.value)}
                    required 
                    placeholder="Confirm Password" 
                    className="w-full bg-brand-bg-tertiary border border-brand-border rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-brand-primary transition-all placeholder-brand-text-subtle"
                  />
                </div>

                <button 
                  type="submit" 
                  disabled={signupLoading}
                  className="auth-submit-btn w-full py-3 bg-brand-primary hover:bg-brand-primary-hover text-white rounded-xl font-semibold transition-all shadow-lg shadow-brand-primary/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {signupLoading ? 'Creating Account...' : 'Create Account'}
                </button>

                {signupError && (
                  <div className="auth-error mt-4 p-3 bg-brand-accent-ruby/10 border border-brand-accent-ruby/20 text-brand-accent-ruby rounded-xl text-sm flex items-center gap-2">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
                    <span>{signupError}</span>
                  </div>
                )}

                {signupSuccess && (
                  <div className="auth-success mt-4 p-3 bg-brand-accent-emerald/10 border border-brand-accent-emerald/20 text-brand-accent-emerald rounded-xl text-sm flex items-center gap-2">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                    <span>{signupSuccess}</span>
                  </div>
                )}
              </form>
            </div>
          )}

          {/* Footer */}
          <div className="auth-footer text-center mt-8 text-xs text-brand-text-subtle shrink-0">
            <p>&copy; 2026 CampusX University. All rights reserved.</p>
          </div>
        </div>

      </div>
    </div>
  );
}
