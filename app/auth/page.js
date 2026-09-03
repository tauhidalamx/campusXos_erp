'use client';

import React, { useState, useEffect } from 'react';
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

  // Transition state
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [authStatusText, setAuthStatusText] = useState('Verifying credentials...');

  // Storage Keys
  const USERS_KEY = 'campusx_erp_users';
  const SESSION_KEY = 'campusx_erp_session';

  // Hashing Helper
  const hashPassword = (plain) => {
    let hash = 0;
    for (let i = 0; i < plain.length; i++) {
      const ch = plain.charCodeAt(i);
      hash = ((hash << 5) - hash) + ch;
      hash |= 0;
    }
    return 'h$' + Math.abs(hash).toString(36);
  };

  // Check if session exists on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const session = sessionStorage.getItem(SESSION_KEY) || localStorage.getItem(SESSION_KEY);
      if (session) {
        window.location.href = '/';
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
  const handleSignIn = (e) => {
    e.preventDefault();
    setSigninError('');
    setSigninLoading(true);

    if (!signinEmail || !signinPassword) {
      setSigninError('Email and password are required.');
      setSigninLoading(false);
      return;
    }

    const emailLower = signinEmail.trim().toLowerCase();

    // Check Local Storage Users
    let matchedUser = null;
    if (typeof window !== 'undefined') {
      try {
        const storedUsers = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
        matchedUser = storedUsers.find(u => u.email && u.email.toLowerCase() === emailLower);
      } catch (err) {
        console.warn('User lookup error:', err);
      }
    }

    if (!matchedUser) {
      let inferredRole = 'student';
      if (emailLower.includes('admin')) inferredRole = 'admin';
      else if (emailLower.includes('faculty') || emailLower.includes('prof')) inferredRole = 'faculty';
      else if (emailLower.includes('hod')) inferredRole = 'hod';

      const userName = emailLower.split('@')[0].replace(/[._-]/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
      matchedUser = {
        id: 'usr_' + Date.now().toString(36),
        name: userName || 'User',
        email: emailLower,
        role: inferredRole,
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150"
      };
    }

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
    setAuthStatusText(`Logging in ${sessionData.name}...`);
    navigateToRoleDashboard(sessionData);
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
  const handleSSO = (provider) => {
    const ssoUser = {
      Google: { id: 'usr_sso_g', name: 'Google Scholar User', email: 'student@campusx.demo', role: 'student', avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150' },
      Microsoft: { id: 'usr_sso_m', name: 'Microsoft Enterprise User', email: 'admin@campusx.demo', role: 'admin', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150' }
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
    <div className="auth-container min-h-screen flex items-center justify-center p-4 sm:p-6 bg-[#090d16] font-sans antialiased text-slate-100">
      
      {/* Sleek Transition Overlay */}
      {isAuthenticating && (
        <div className="fixed inset-0 z-50 bg-[#090d16]/90 backdrop-blur-md flex flex-col items-center justify-center p-4">
          <div className="bg-[#131b2e] border border-slate-700/60 rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl">
            <div className="w-14 h-14 mx-auto mb-5 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <svg className="w-7 h-7 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
              </svg>
            </div>
            <h3 className="text-lg font-bold text-white mb-1">CampusX ERP</h3>
            <p className="text-xs text-slate-400 font-medium">{authStatusText}</p>
          </div>
        </div>
      )}

      <div className="auth-card-modern w-full max-w-5xl bg-[#111827] border border-slate-800 rounded-3xl overflow-hidden shadow-2xl grid grid-cols-1 md:grid-cols-12 min-h-[640px]">
        
        {/* Left University Brand Panel */}
        <div className="auth-visual-side hidden md:flex md:col-span-5 bg-gradient-to-br from-indigo-950 via-[#0f172a] to-[#090d16] p-8 lg:p-10 flex-col justify-between relative overflow-hidden border-r border-slate-800/80">
          <div className="relative z-10 flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-600/30 font-bold text-lg">
              <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
            </div>
            <div>
              <span className="text-white font-extrabold tracking-wider text-base block leading-tight">CampusX ERP</span>
              <span className="text-[11px] text-indigo-300 font-medium tracking-wide">University Management System</span>
            </div>
          </div>

          <div className="relative z-10 my-auto text-left py-6">
            <h1 className="text-3xl font-extrabold text-white leading-tight tracking-tight mb-3">
              Institutional Access Portal
            </h1>
            <p className="text-xs text-slate-300 leading-relaxed">
              Unified digital access for students, faculty, and administrative staff across all campus colleges and departments.
            </p>
          </div>

          <div className="relative z-10 pt-4 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
            <span>Enterprise Edition</span>
            <span className="text-emerald-400 font-medium flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              Secure Connection
            </span>
          </div>
        </div>

        {/* Right Form Side */}
        <div className="auth-form-side md:col-span-7 bg-white text-slate-900 p-6 sm:p-10 lg:p-12 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  {activeTab === 'signin' ? 'Welcome Back' : 'Create Account'}
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  {activeTab === 'signin' ? 'Sign in to access your university dashboard' : 'Register your institutional profile on CampusX'}
                </p>
              </div>
            </div>

            <div className="auth-tabs flex bg-[#f1f5f9] p-1 rounded-2xl mb-6">
              <button 
                type="button" 
                onClick={() => { setActiveTab('signin'); setSigninError(''); }}
                className={`tab-btn flex-1 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer border-none ${activeTab === 'signin' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-900 bg-transparent'}`}
              >
                Sign In
              </button>
              <button 
                type="button" 
                onClick={() => { setActiveTab('signup'); setSignupError(''); setSignupSuccess(''); }}
                className={`tab-btn flex-1 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer border-none ${activeTab === 'signup' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-900 bg-transparent'}`}
              >
                Sign Up
              </button>
            </div>

            {activeTab === 'signin' ? (
              <form onSubmit={handleSignIn} className="space-y-4">
                <div className="space-y-1.5 text-left">
                  <label className="text-xs font-semibold text-slate-700">Institutional Email</label>
                  <input 
                    type="email" 
                    value={signinEmail}
                    onChange={(e) => setSigninEmail(e.target.value)}
                    required 
                    placeholder="name@university.edu" 
                    className="w-full bg-[#f8fafc] border border-slate-200 rounded-2xl px-4 py-3 text-sm text-slate-900 outline-none focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all placeholder-slate-400"
                  />
                </div>

                <div className="space-y-1.5 text-left">
                  <label className="text-xs font-semibold text-slate-700">Password</label>
                  <div className="relative">
                    <input 
                      type={signinShowPassword ? "text" : "password"} 
                      value={signinPassword}
                      onChange={(e) => setSigninPassword(e.target.value)}
                      required 
                      placeholder="••••••••" 
                      className="w-full bg-[#f8fafc] border border-slate-200 rounded-2xl px-4 py-3 pr-11 text-sm text-slate-900 outline-none focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all placeholder-slate-400"
                    />
                    <button 
                      type="button" 
                      onClick={() => setSigninShowPassword(!signinShowPassword)}
                      className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-600 cursor-pointer bg-transparent border-none"
                    >
                      {signinShowPassword ? (
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                      ) : (
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                      )}
                    </button>
                  </div>
                </div>

                <button 
                  type="submit" 
                  disabled={signinLoading}
                  className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold text-sm transition-all shadow-md shadow-indigo-600/20 flex items-center justify-center gap-2 cursor-pointer border-none disabled:opacity-50 mt-2"
                >
                  {signinLoading ? 'Signing In...' : 'Sign In'}
                </button>

                {signinError && (
                  <div className="p-3 bg-rose-50 border border-rose-100 text-rose-600 rounded-xl text-xs text-left">
                    {signinError}
                  </div>
                )}
              </form>
            ) : (
              <form onSubmit={handleSignUp} className="space-y-3.5">
                <div className="space-y-1 text-left">
                  <label className="text-xs font-semibold text-slate-700">Full Name</label>
                  <input 
                    type="text" 
                    value={signupName}
                    onChange={(e) => setSignupName(e.target.value)}
                    required 
                    placeholder="e.g. Dr. Rajesh Sharma" 
                    className="w-full bg-[#f8fafc] border border-slate-200 rounded-2xl px-4 py-2.5 text-sm text-slate-900 outline-none focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all placeholder-slate-400"
                  />
                </div>

                <div className="space-y-1 text-left">
                  <label className="text-xs font-semibold text-slate-700">Institutional Email</label>
                  <input 
                    type="email" 
                    value={signupEmail}
                    onChange={(e) => setSignupEmail(e.target.value)}
                    required 
                    placeholder="name@university.edu" 
                    className="w-full bg-[#f8fafc] border border-slate-200 rounded-2xl px-4 py-2.5 text-sm text-slate-900 outline-none focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all placeholder-slate-400"
                  />
                </div>

                <div className="space-y-1 text-left">
                  <label className="text-xs font-semibold text-slate-700">Institutional Role</label>
                  <select 
                    value={signupRole}
                    onChange={(e) => setSignupRole(e.target.value)}
                    className="w-full bg-[#f8fafc] border border-slate-200 rounded-2xl px-4 py-3 text-sm text-slate-900 outline-none focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all cursor-pointer font-medium"
                  >
                    <option value="student">Student Role (Undergraduate / Postgraduate)</option>
                    <option value="faculty">Faculty Role (Professor / Lecturer)</option>
                    <option value="hod">Head of Department (HOD)</option>
                    <option value="dean">Dean of Faculty</option>
                    <option value="registrar">Registrar Officer</option>
                    <option value="admin">University Administrator</option>
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700">Password</label>
                    <input 
                      type={signupShowPassword ? "text" : "password"} 
                      value={signupPassword}
                      onChange={(e) => setSignupPassword(e.target.value)}
                      required 
                      placeholder="Min 6 chars" 
                      className="w-full bg-[#f8fafc] border border-slate-200 rounded-2xl px-4 py-2.5 text-sm text-slate-900 outline-none focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all placeholder-slate-400"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700">Confirm Password</label>
                    <input 
                      type={signupShowPassword ? "text" : "password"} 
                      value={signupConfirmPassword}
                      onChange={(e) => setSignupConfirmPassword(e.target.value)}
                      required 
                      placeholder="Repeat password" 
                      className="w-full bg-[#f8fafc] border border-slate-200 rounded-2xl px-4 py-2.5 text-sm text-slate-900 outline-none focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all placeholder-slate-400"
                    />
                  </div>
                </div>

                <button 
                  type="submit" 
                  disabled={signupLoading}
                  className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold text-sm transition-all shadow-md shadow-indigo-600/20 flex items-center justify-center gap-2 cursor-pointer border-none disabled:opacity-50 mt-1"
                >
                  {signupLoading ? 'Creating Account...' : 'Create Account'}
                </button>

                {signupError && (
                  <div className="p-3 bg-rose-50 border border-rose-100 text-rose-600 rounded-xl text-xs text-left">
                    {signupError}
                  </div>
                )}

                {signupSuccess && (
                  <div className="p-3 bg-emerald-50 border border-emerald-100 text-emerald-700 rounded-xl text-xs text-left">
                    {signupSuccess}
                  </div>
                )}
              </form>
            )}

            <div className="my-5 flex items-center gap-3">
              <div className="h-px bg-slate-200 flex-1"></div>
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Or continue with</span>
              <div className="h-px bg-slate-200 flex-1"></div>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <button 
                type="button" 
                onClick={() => handleSSO('Google')}
                className="flex items-center justify-center gap-2 py-2.5 px-3 bg-[#f8fafc] hover:bg-[#f1f5f9] border border-slate-200 rounded-2xl text-xs font-semibold text-slate-700 transition-all cursor-pointer"
              >
                <svg viewBox="0 0 24 24" width="16" height="16">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18A10.96 10.96 0 0 0 1 12c0 1.77.42 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                <span>Google</span>
              </button>

              <button 
                type="button" 
                onClick={() => handleSSO('Microsoft')}
                className="flex items-center justify-center gap-2 py-2.5 px-3 bg-[#f8fafc] hover:bg-[#f1f5f9] border border-slate-200 rounded-2xl text-xs font-semibold text-slate-700 transition-all cursor-pointer"
              >
                <svg viewBox="0 0 24 24" width="16" height="16">
                  <rect x="1" y="1" width="10" height="10" fill="#F25022"/>
                  <rect x="13" y="1" width="10" height="10" fill="#7FBA00"/>
                  <rect x="1" y="13" width="10" height="10" fill="#00A4EF"/>
                  <rect x="13" y="13" width="10" height="10" fill="#FFB900"/>
                </svg>
                <span>Microsoft</span>
              </button>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-100 text-center text-[11px] text-slate-400">
            Protected by CampusX Institutional Access Control
          </div>
        </div>

      </div>
    </div>
  );
}
