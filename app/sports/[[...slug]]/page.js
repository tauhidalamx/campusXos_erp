'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  Trophy, Users, Calendar, Tv, Clipboard, Heart, 
  CheckSquare, BarChart2, Search, DollarSign, Home, 
  Sparkles, FileText, Settings, Bot, Activity, AlertCircle, 
  CheckCircle, Plus, Send, Award, Clock, ArrowRight, ShieldCheck
} from 'lucide-react';

export default function SportsPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug || [];
  const currentTab = slug[0] || 'overview';

  // Session user state
  const [currentUser, setCurrentUser] = useState(null);
  const [selectedRoleWorkspace, setSelectedRoleWorkspace] = useState('director');

  // Database states
  const [summary, setSummary] = useState({
    total_athletes: 3,
    active_teams: 3,
    upcoming_matches: 2,
    total_scholarships: 27000,
    injury_reports: 1
  });
  const [athletes, setAthletes] = useState([]);
  const [teams, setTeams] = useState([]);
  const [tournaments, setTournaments] = useState([]);
  const [matches, setMatches] = useState([]);
  const [training, setTraining] = useState([]);
  const [facilities, setFacilities] = useState([]);
  const [scholarships, setScholarships] = useState([]);
  const [scouting, setScouting] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form states
  const [newAthlete, setNewAthlete] = useState({ name: '', email: '', sport: 'Basketball', status: 'Active', medical: 'No concerns.' });
  const [newMatch, setNewMatch] = useState({ team_a: 'CampusX Titans', team_b: 'Metro Wolves', sport: 'Basketball', schedule: '2026-06-25 18:00', venue: 'Varsity Court A', status: 'Scheduled' });
  const [newTeam, setNewTeam] = useState({ name: '', sport: 'Basketball', captain_id: '' });
  const [newTournament, setNewTournament] = useState({ name: '', sport: 'Basketball', status: 'Upcoming' });

  // Share to Connect state
  const [connectContent, setConnectContent] = useState('');
  const [shareSuccess, setShareSuccess] = useState('');

  // AI Coach state
  const [aiPrompt, setAiPrompt] = useState('Generate a custom post-workout recovery plan for a basketball guard.');
  const [aiResponse, setAiResponse] = useState('');
  const [aiLoading, setAiLoading] = useState(false);

  // Blockchain credential state
  const [blockchainLogs, setBlockchainLogs] = useState([]);
  const [mintingSuccess, setMintingSuccess] = useState('');

  // Live match simulation state
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [simulatedScore, setSimulatedScore] = useState({ a: 0, b: 0 });
  const [simulatedCommentary, setSimulatedCommentary] = useState([]);

  // Load user session and fetch data
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const session = sessionStorage.getItem('campusx_erp_session');
      if (session) {
        const parsed = JSON.parse(session);
        setCurrentUser(parsed);
        // Map user role to default workspace
        if (parsed.role === 'coach') setSelectedRoleWorkspace('coach');
        else if (parsed.role === 'athlete') setSelectedRoleWorkspace('athlete');
        else if (parsed.role === 'sports_parent') setSelectedRoleWorkspace('parent');
        else if (parsed.role === 'sports_director' || parsed.role === 'superadmin' || parsed.role === 'admin') setSelectedRoleWorkspace('director');
        else setSelectedRoleWorkspace('director');
      } else {
        router.push('/login');
        return;
      }
    }

    // Initialize from local storage if available
    let localAthletes = [], localTeams = [], localTournaments = [], localMatches = [];
    if (typeof window !== 'undefined') {
      try { localAthletes = JSON.parse(localStorage.getItem('campusx_sports_athletes') || '[]'); } catch(e){}
      try { localTeams = JSON.parse(localStorage.getItem('campusx_sports_teams') || '[]'); } catch(e){}
      try { localTournaments = JSON.parse(localStorage.getItem('campusx_sports_tournaments') || '[]'); } catch(e){}
      try { localMatches = JSON.parse(localStorage.getItem('campusx_sports_matches') || '[]'); } catch(e){}
      
      if (localAthletes.length > 0) setAthletes(localAthletes);
      if (localTeams.length > 0) setTeams(localTeams);
      if (localTournaments.length > 0) setTournaments(localTournaments);
      if (localMatches.length > 0) setMatches(localMatches);
    }

    const fetchData = async () => {
      try {
        const [sumRes, athRes, teamRes, tourRes, matchRes, trainRes, facRes, scholRes, scoutRes] = await Promise.all([
          fetch('/api/sports/summary').then(r => r.json()),
          fetch('/api/sports/athletes').then(r => r.json()),
          fetch('/api/sports/teams').then(r => r.json()),
          fetch('/api/sports/tournaments').then(r => r.json()),
          fetch('/api/sports/matches').then(r => r.json()),
          fetch('/api/sports/training').then(r => r.json()),
          fetch('/api/sports/facilities').then(r => r.json()),
          fetch('/api/sports/scholarships').then(r => r.json()),
          fetch('/api/sports/scouting').then(r => r.json())
        ]);

        if (!sumRes.error) setSummary(sumRes);
        if (!athRes.error && Array.isArray(athRes)) {
          const merged = [...athRes];
          localAthletes.forEach(l => { if (!merged.some(m => m.id === l.id)) merged.unshift(l); });
          setAthletes(merged);
        }
        if (!teamRes.error && Array.isArray(teamRes)) {
          const merged = [...teamRes];
          localTeams.forEach(l => { if (!merged.some(m => m.id === l.id)) merged.unshift(l); });
          setTeams(merged);
        }
        if (!tourRes.error && Array.isArray(tourRes)) {
          const merged = [...tourRes];
          localTournaments.forEach(l => { if (!merged.some(m => m.id === l.id)) merged.unshift(l); });
          setTournaments(merged);
        }
        if (!matchRes.error && Array.isArray(matchRes)) {
          const merged = [...matchRes];
          localMatches.forEach(l => { if (!merged.some(m => m.id === l.id)) merged.unshift(l); });
          setMatches(merged);
        }
        if (!trainRes.error) setTraining(trainRes);
        if (!facRes.error) setFacilities(facRes);
        if (!scholRes.error) setScholarships(scholRes);
        if (!scoutRes.error) setScouting(scoutRes);
      } catch (err) {
        console.warn('Failed to fetch sports database. Utilizing mocked profiles.', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router]);

  // Actions
  const handleAddAthlete = async (e) => {
    e.preventDefault();
    if (!newAthlete.name || !newAthlete.email) return;

    const createdId = 'ath_' + Date.now().toString(36);
    const athleteRecord = {
      id: createdId,
      name: newAthlete.name,
      email: newAthlete.email.trim().toLowerCase(),
      sport: newAthlete.sport,
      status: newAthlete.status,
      medical_records: newAthlete.medical,
      fitness_scores: { vo2_max: 54, bmi: 21.8, endurance: 85, strength: 78, speed: 82, recovery: 92 },
      achievements: [newAthlete.sport + ' Varsity Roster'],
      ranking: athletes.length + 1,
      statistics: { matches_played: 0, points: 0 },
      avatar: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150`
    };

    setAthletes(prev => {
      const next = [athleteRecord, ...prev];
      if (typeof window !== 'undefined') localStorage.setItem('campusx_sports_athletes', JSON.stringify(next));
      return next;
    });
    setSummary(prev => ({ ...prev, total_athletes: (prev.total_athletes || 0) + 1 }));
    setNewAthlete({ name: '', email: '', sport: 'Basketball', status: 'Active', medical: 'No concerns.' });
    alert(`Athlete ${newAthlete.name} successfully registered on the CampusX Sports network!`);

    try {
      await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: 'usr_' + Date.now().toString(36),
          name: newAthlete.name,
          email: newAthlete.email.trim().toLowerCase(),
          role: 'athlete',
          avatar: athleteRecord.avatar
        })
      });
      await fetch('/api/sports/athletes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(athleteRecord)
      });
    } catch (err) {
      console.warn('Backend sync failed, preserved in local state.', err);
    }
  };

  const handleCreateTeam = async (e) => {
    e.preventDefault();
    if (!newTeam.name) return;

    const teamRecord = {
      id: 'tm_' + Date.now().toString(36),
      name: newTeam.name,
      sport: newTeam.sport,
      captain_id: newTeam.captain_id || 'CAP001',
      roster: [],
      stats: { wins: 0, losses: 0, win_rate: '100%' }
    };

    setTeams(prev => {
      const next = [teamRecord, ...prev];
      if (typeof window !== 'undefined') localStorage.setItem('campusx_sports_teams', JSON.stringify(next));
      return next;
    });
    setSummary(prev => ({ ...prev, active_teams: (prev.active_teams || 0) + 1 }));
    setNewTeam({ name: '', sport: 'Basketball', captain_id: '' });
    alert(`Team "${newTeam.name}" created successfully.`);

    try {
      await fetch('/api/sports/teams', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(teamRecord)
      });
    } catch (err) {
      console.warn('Backend sync failed, preserved in local state.', err);
    }
  };

  const handleCreateTournament = async (e) => {
    e.preventDefault();
    if (!newTournament.name) return;

    const tourRecord = {
      id: 'tr_' + Date.now().toString(36),
      name: newTournament.name,
      sport: newTournament.sport,
      status: newTournament.status,
      fixtures: [],
      standings: []
    };

    setTournaments(prev => {
      const next = [tourRecord, ...prev];
      if (typeof window !== 'undefined') localStorage.setItem('campusx_sports_tournaments', JSON.stringify(next));
      return next;
    });
    setNewTournament({ name: '', sport: 'Basketball', status: 'Upcoming' });
    alert(`Tournament "${newTournament.name}" registered.`);

    try {
      await fetch('/api/sports/tournaments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(tourRecord)
      });
    } catch (err) {
      console.warn('Backend sync failed, preserved in local state.', err);
    }
  };

  const handleScheduleMatch = async (e) => {
    e.preventDefault();
    const matchRecord = {
      id: 'mt_' + Date.now().toString(36),
      ...newMatch
    };

    setMatches(prev => {
      const next = [matchRecord, ...prev];
      if (typeof window !== 'undefined') localStorage.setItem('campusx_sports_matches', JSON.stringify(next));
      return next;
    });
    setSummary(prev => ({ ...prev, upcoming_matches: (prev.upcoming_matches || 0) + 1 }));
    alert('Match fixture scheduled.');

    try {
      await fetch('/api/sports/matches', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(matchRecord)
      });
    } catch (err) {
      console.warn('Backend sync failed, preserved in local state.', err);
    }
  };

  // Connect integration
  const handleShareToConnect = async () => {
    if (!connectContent.trim() || !currentUser) return;
    try {
      const res = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: currentUser.id,
          content: connectContent,
          type: 'text',
          category: 'sports'
        })
      }).then(r => r.json());

      if (res.success) {
        setShareSuccess('✓ Broadcasted successfully on CampusX Connect Campus Feed!');
        setConnectContent('');
        setTimeout(() => setShareSuccess(''), 3000);
      }
    } catch (err) {
      alert(err.message);
    }
  };

  // Chain integration
  const handleIssueCredential = (athleteName, achievement) => {
    setMintingSuccess('Initiating verification on CampusX Consortium network...');
    const txId = '0x' + Math.random().toString(16).substr(2, 32);
    const stateProof = '0x' + Math.random().toString(16).substr(2, 40);

    setTimeout(() => {
      setBlockchainLogs(prev => [
        `[${new Date().toLocaleTimeString()}] Anchor state proof issued for athlete "${athleteName}"`,
        `[${new Date().toLocaleTimeString()}] Tx Hash: ${txId}`,
        `[${new Date().toLocaleTimeString()}] Hyperledger Fabric Channel synchronizing state...`,
        `[${new Date().toLocaleTimeString()}] Polygon SBT Contract mapping verification: COMPLETE.`,
        ...prev
      ]);
      setMintingSuccess(`✓ Verification SBT issued for ${athleteName}! (Tx: ${txId.substr(0, 10)}...)`);
      setTimeout(() => setMintingSuccess(''), 4000);
    }, 1200);
  };

  // AI Coach recommendations
  const handleAskAICoach = () => {
    if (!aiPrompt.trim()) return;
    setAiLoading(true);
    setAiResponse('');

    setTimeout(() => {
      let resp = "";
      const p = aiPrompt.toLowerCase();
      if (p.includes('workout') || p.includes('recovery') || p.includes('training')) {
        resp = `🏀 **AI Coach Performance & Recovery Protocol**:\n\n1. **Active Stretch Block (12m)**: Hamstring, glute activation, foam rolling lower extremities.\n2. **Rehydration Ratio**: Consumes 250ml electrolyte fluid with 2:1 Sodium-Potassium ratio.\n3. **Muscle Recovery Drills**: Cold water immersion (12°C) for 8 minutes to contract lactic vectors.\n4. **Endurance Recommendations**: Focus on isometric holds to relieve stress on tendon nodes.`;
      } else if (p.includes('injury') || p.includes('prevention')) {
        resp = `🏃‍♂️ **AI Injury Risk & Prevention Advisor**:\n\n- **Flagged Biometrics**: Lower leg overload index has increased +14% due to high wearable frequency.\n- **Preventative Action**: Replace track run with zero-impact swimming drills (Olympic Pool).\n- **Joint Stability Plan**: Perform 3 sets of ankle perturbation exercises daily.`;
      } else {
        resp = `🥗 **AI Sports Nutrition Guide**:\n\n- **Target Macronutrient Ratio**: 55% Carbohydrates (complex glycogen loader), 25% Protein (asymmetric amino profile), 20% Fats (omega acids).\n- **Pre-match loading**: Carbohydrate meal (oats with bananas) 2.5 hours before whistle.\n- **Recovery fueling**: 30g whey isolate + 40g cluster dextrin within 30m of finishing workouts.`;
      }

      setAiResponse(resp);
      setAiLoading(false);
    }, 800);
  };

  // Match Simulator
  const startLiveSimulation = (match) => {
    setSelectedMatch(match);
    setSimulatedScore({ a: 0, b: 0 });
    setSimulatedCommentary(['Whistle blown! Kick-off starts.']);

    let scoreA = 0;
    let scoreB = 0;
    let counter = 0;

    const interval = setInterval(() => {
      counter++;
      const rand = Math.random();
      if (rand < 0.3) {
        scoreA += Math.random() > 0.5 ? 2 : 3; // basketball/points mock
        setSimulatedScore({ a: scoreA, b: scoreB });
        setSimulatedCommentary(prev => [`[Live ${counter}'] Scoring drive! CampusX Titans convert.`, ...prev]);
      } else if (rand < 0.5) {
        scoreB += Math.random() > 0.5 ? 2 : 3;
        setSimulatedScore({ a: scoreA, b: scoreB });
        setSimulatedCommentary(prev => [`[Live ${counter}'] Defensive slip! Metro Wolves capitalize.`, ...prev]);
      } else {
        setSimulatedCommentary(prev => [`[Live ${counter}'] Intense tactical midcourt combat. Possession contested.`, ...prev]);
      }

      if (counter >= 5) {
        clearInterval(interval);
        setSimulatedCommentary(prev => [`Full-time whistle! Match ends. final score: ${scoreA} - ${scoreB}`, ...prev]);
      }
    }, 1500);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
        <div className="w-10 h-10 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
        <span className="text-sm text-slate-400">Loading CampusX Sports Data mesh...</span>
      </div>
    );
  }

  // Dashboard role routing wrappers
  const isDirector = currentUser?.role === 'sports_director' || currentUser?.role === 'superadmin' || currentUser?.role === 'admin';
  const isCoach = currentUser?.role === 'coach';
  const isAthlete = currentUser?.role === 'athlete';
  const isParent = currentUser?.role === 'sports_parent';

  // Dispatch rendering based on tab name
  return (
    <div className="flex flex-col gap-8">
      {/* Header panel */}
      <div className="flex justify-between items-center animate-fade-in">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight font-display bg-gradient-to-r from-white via-indigo-100 to-indigo-300 bg-clip-text text-transparent">
            {currentTab === 'overview' && "Sports Executive Hub"}
            {currentTab === 'director' && "Sports Director Workspace"}
            {currentTab === 'coach' && "Coaches Command Console"}
            {currentTab === 'athlete' && "Athlete Performance Deck"}
            {currentTab === 'parent' && "Athlete Progress Locker"}
            {currentTab === 'athletes' && "Athletes Directory"}
            {currentTab === 'teams' && "Varsity Roster Management"}
            {currentTab === 'tournaments' && "Tournaments Standings & Brackets"}
            {currentTab === 'matches' && "Match Fixtures & Live Scheduling"}
            {currentTab === 'training' && "Training Programs & Attendance"}
            {currentTab === 'fitness' && "Fitness & Biometrics Ledger"}
            {currentTab === 'attendance' && "Practice Drills Verification"}
            {currentTab === 'analytics' && "TensorFlow Performance Analytics"}
            {currentTab === 'scouting' && "Recruitment & Scouting Platform"}
            {currentTab === 'scholarships' && "Sports Scholarship & Funding Desk"}
            {currentTab === 'facilities' && "Varsity Facility Calendar"}
            {currentTab === 'live' && "CampusX Live Tracker"}
            {currentTab === 'ai-coach' && "AI Tactical Coach Coordinator"}
            {currentTab === 'sports-catalog' && "Sports Disciplines Catalog"}
            {currentTab === 'events' && "Events Calendar"}
            {currentTab === 'reports' && "Sports Performance Reports"}
            {currentTab === 'settings' && "Sports Console Configurations"}
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            {currentTab === 'overview' && "Live university sports analytics, athlete biometric records, and active tournament listings."}
            {currentTab === 'director' && "Manage teams, assign coaches, allocate athletic budgets, and verify scholarships."}
            {currentTab === 'coach' && "Log practice attendance, review athlete metrics, update schedules, and file match results."}
            {currentTab === 'athlete' && "Track personal biometrics, wearable statistics, training plans, and blockchain achievements."}
            {currentTab === 'parent' && "Monitor performance progress, check scholarship renewal parameters, and review matches."}
            {currentTab === 'athletes' && "University roster list, rankings, clearances, and medical history sheets."}
            {currentTab === 'teams' && "Assign captains, construct lineups, and monitor squad win ratios."}
            {currentTab === 'tournaments' && "Brackets generator, ongoing leagues, and standings schedules."}
            {currentTab === 'matches' && "Verify lineups, schedule referees, write match reports, and trace scores."}
            {currentTab === 'training' && "Outline skill assessment indexes, manage training blocks, and audit logs."}
            {currentTab === 'fitness' && "Biometric logs, BMI calculators, VO2 Max indices, and Fitbit wearable simulation."}
            {currentTab === 'attendance' && "Log attendance files across varsity team preparation drills."}
            {currentTab === 'analytics' && "AI predictive model fitting performance trends, failure margins, and injury forecasts."}
            {currentTab === 'scouting' && "Talent tracking ledger, tryout sheets, and AI scouting reports."}
            {currentTab === 'scholarships' && "Monitor athletic grants, active disbursements, and academic grade compliance."}
            {currentTab === 'facilities' && "Verify grounds, pools, courts, and gyms utilization logs."}
            {currentTab === 'live' && "Simulate match plays, trace scores, and check live commentary logs."}
            {currentTab === 'ai-coach' && "Prompt assistant for customized workout formulations, diet, and recovery schedules."}
            {currentTab === 'sports-catalog' && "Browse sports disciplines supported inside CampusX consortium system."}
            {currentTab === 'events' && "Review key varsity sports dates, meets, and tryout matches."}
            {currentTab === 'reports' && "Compile operational stats and download varsity summaries."}
            {currentTab === 'settings' && "Manage permission hierarchies, alerts, and wearable integrations."}
          </p>
        </div>
      </div>
      {/* Overview General Dashboard Tab OR specific landing screens */}
      {currentTab === 'overview' && (
        <div className="flex flex-col gap-6 animate-fade-in">
          {/* Dashboard KPIs */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* KPI Card 1 */}
            <div className="h-[140px] rounded-[20px] p-6 bg-[#102043] border border-[rgba(255,255,255,0.08)] flex items-center justify-between shadow-lg relative overflow-hidden transition-all duration-200 hover:scale-[1.02] hover:shadow-[0_8px_24px_rgba(99,102,241,0.1)]">
              <div className="flex flex-col justify-between h-full">
                <div>
                  <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider block">Total Athletes</span>
                  <h3 className="text-2xl font-black text-white mt-1 font-mono leading-none">{summary.total_athletes}</h3>
                </div>
                <div className="flex items-center gap-1.5 text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-full w-fit mt-1">
                  <span>+8.2%</span>
                  <span className="text-[9px] text-slate-400 font-semibold uppercase font-sans tracking-wide">vs last sem</span>
                </div>
              </div>
              <div className="flex flex-col items-end justify-between h-full">
                <div className="p-3 bg-indigo-500/10 text-[#818CF8] rounded-[16px] shadow-inner">
                  <Users className="w-5 h-5 animate-pulse" />
                </div>
                <svg className="w-16 h-8 text-indigo-500/20 shrink-0" viewBox="0 0 100 30" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M0,25 Q15,5 30,20 T60,5 T90,25 T100,10" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </div>

            {/* KPI Card 2 */}
            <div className="h-[140px] rounded-[20px] p-6 bg-[#102043] border border-[rgba(255,255,255,0.08)] flex items-center justify-between shadow-lg relative overflow-hidden transition-all duration-200 hover:scale-[1.02] hover:shadow-[0_8px_24px_rgba(99,102,241,0.1)]">
              <div className="flex flex-col justify-between h-full">
                <div>
                  <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider block">Active Teams</span>
                  <h3 className="text-2xl font-black text-white mt-1 font-mono leading-none">{summary.active_teams}</h3>
                </div>
                <div className="flex items-center gap-1.5 text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-full w-fit mt-1">
                  <span>+15.0%</span>
                  <span className="text-[9px] text-slate-400 font-semibold uppercase font-sans tracking-wide">vs last sem</span>
                </div>
              </div>
              <div className="flex flex-col items-end justify-between h-full">
                <div className="p-3 bg-indigo-500/10 text-[#818CF8] rounded-[16px] shadow-inner">
                  <Activity className="w-5 h-5" />
                </div>
                <svg className="w-16 h-8 text-indigo-500/20 shrink-0" viewBox="0 0 100 30" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M0,15 Q20,28 40,8 T80,22 T100,2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </div>

            {/* KPI Card 3 */}
            <div className="h-[140px] rounded-[20px] p-6 bg-[#102043] border border-[rgba(255,255,255,0.08)] flex items-center justify-between shadow-lg relative overflow-hidden transition-all duration-200 hover:scale-[1.02] hover:shadow-[0_8px_24px_rgba(99,102,241,0.1)]">
              <div className="flex flex-col justify-between h-full">
                <div>
                  <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider block">Matches Underway</span>
                  <h3 className="text-2xl font-black text-emerald-400 mt-1 font-mono leading-none">1 Live</h3>
                </div>
                <div className="flex items-center gap-1.5 text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-full w-fit mt-1">
                  <span>+20.4%</span>
                  <span className="text-[9px] text-slate-400 font-semibold uppercase font-sans tracking-wide">vs yesterday</span>
                </div>
              </div>
              <div className="flex flex-col items-end justify-between h-full">
                <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-[16px] shadow-inner">
                  <Tv className="w-5 h-5 animate-pulse" />
                </div>
                <svg className="w-16 h-8 text-emerald-500/20 shrink-0" viewBox="0 0 100 30" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M0,20 Q10,10 30,22 T70,5 T100,18" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </div>

            {/* KPI Card 4 */}
            <div className="h-[140px] rounded-[20px] p-6 bg-[#102043] border border-[rgba(255,255,255,0.08)] flex items-center justify-between shadow-lg relative overflow-hidden transition-all duration-200 hover:scale-[1.02] hover:shadow-[0_8px_24px_rgba(99,102,241,0.1)]">
              <div className="flex flex-col justify-between h-full">
                <div>
                  <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider block">Active Funding</span>
                  <h3 className="text-2xl font-black text-[#818CF8] mt-1 font-mono leading-none">${summary.total_scholarships.toLocaleString()}</h3>
                </div>
                <div className="flex items-center gap-1.5 text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-full w-fit mt-1">
                  <span>+5.3%</span>
                  <span className="text-[9px] text-slate-400 font-semibold uppercase font-sans tracking-wide">vs last year</span>
                </div>
              </div>
              <div className="flex flex-col items-end justify-between h-full">
                <div className="p-3 bg-indigo-500/10 text-[#818CF8] rounded-[16px] shadow-inner">
                  <DollarSign className="w-5 h-5" />
                </div>
                <svg className="w-16 h-8 text-indigo-500/20 shrink-0" viewBox="0 0 100 30" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M0,28 Q30,10 60,18 T90,2 T100,10" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </div>
          </div>

          {/* Live Match Center and Role Workspace panel row */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Live Match Center */}
            <div className="lg:col-span-3 bg-[#102043] border border-[rgba(255,255,255,0.08)] rounded-[20px] p-6 flex flex-col gap-6 shadow-lg">
              <div className="flex justify-between items-center border-b border-slate-800/80 pb-3">
                <h2 className="text-sm font-bold text-white flex items-center gap-2">
                  <Tv className="w-5 h-5 text-indigo-400" />
                  Live Match Center
                </h2>
                <span className="px-2.5 py-0.5 bg-rose-500/20 text-rose-400 text-[9.5px] font-bold rounded-full uppercase tracking-wider animate-pulse border border-rose-500/30 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-rose-500 rounded-full animate-ping"></span> Live Broadcast
                </span>
              </div>

              {/* Multi-Column Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
                {/* Left: Scoreboard */}
                <div className="flex flex-col justify-center gap-4 bg-[#071126]/60 border border-slate-800/80 rounded-2xl p-4 min-h-[140px] shadow-inner">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 bg-indigo-600/10 border border-indigo-500/30 rounded-xl flex items-center justify-center font-bold text-indigo-400 text-xs shadow-md">AT</div>
                      <span className="text-xs font-bold text-white">CampusX Titans</span>
                    </div>
                    <span className="text-xl font-bold font-mono text-white">82</span>
                  </div>
                  <div className="flex items-center justify-between px-1 border-y border-slate-800/50 py-1.5">
                    <span className="text-[9px] font-semibold text-slate-500 uppercase tracking-widest">Varsity Match #4</span>
                    <span className="px-2 py-0.5 bg-emerald-500/15 text-emerald-400 text-[8.5px] font-bold rounded-full font-mono uppercase tracking-wider animate-pulse">Q4 2:14</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 bg-slate-700/10 border border-slate-600/30 rounded-xl flex items-center justify-center font-bold text-slate-400 text-xs shadow-md">MW</div>
                      <span className="text-xs font-bold text-white">Metro Wolves</span>
                    </div>
                    <span className="text-xl font-bold font-mono text-white">78</span>
                  </div>
                </div>

                {/* Center: Statistics */}
                <div className="flex flex-col justify-center gap-2.5 bg-[#071126]/40 border border-slate-800/50 rounded-2xl p-4 text-[10px] shadow-inner">
                  <div>
                    <div className="flex justify-between text-slate-400 font-bold mb-1">
                      <span>54%</span>
                      <span className="text-slate-500 text-[9px] uppercase tracking-wider">Field Goal %</span>
                      <span>48%</span>
                    </div>
                    <div className="flex items-center gap-1 h-1 bg-slate-800 rounded-full overflow-hidden">
                      <div className="bg-indigo-500 h-full rounded-l-full" style={{ width: '54%' }}></div>
                      <div className="bg-slate-700 h-full rounded-r-full" style={{ width: '48%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-slate-400 font-bold mb-1">
                      <span>34</span>
                      <span className="text-slate-500 text-[9px] uppercase tracking-wider">Rebounds</span>
                      <span>30</span>
                    </div>
                    <div className="flex items-center gap-1 h-1 bg-slate-800 rounded-full overflow-hidden">
                      <div className="bg-indigo-500 h-full rounded-l-full" style={{ width: '53%' }}></div>
                      <div className="bg-slate-700 h-full rounded-r-full" style={{ width: '47%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-slate-400 font-bold mb-1">
                      <span>18</span>
                      <span className="text-slate-500 text-[9px] uppercase tracking-wider">Assists</span>
                      <span>15</span>
                    </div>
                    <div className="flex items-center gap-1 h-1 bg-slate-800 rounded-full overflow-hidden">
                      <div className="bg-indigo-500 h-full rounded-l-full" style={{ width: '55%' }}></div>
                      <div className="bg-slate-700 h-full rounded-r-full" style={{ width: '45%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-slate-400 font-bold mb-1">
                      <span>10</span>
                      <span className="text-slate-500 text-[9px] uppercase tracking-wider">Turnovers</span>
                      <span>14</span>
                    </div>
                    <div className="flex items-center gap-1 h-1 bg-slate-800 rounded-full overflow-hidden">
                      <div className="bg-indigo-500 h-full rounded-l-full" style={{ width: '41%' }}></div>
                      <div className="bg-slate-700 h-full rounded-r-full" style={{ width: '59%' }}></div>
                    </div>
                  </div>
                </div>

                {/* Right: Players */}
                <div className="flex flex-col justify-center gap-2 bg-[#071126]/60 border border-slate-800/80 rounded-2xl p-4 text-[10px] shadow-inner">
                  <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest pb-1 border-b border-slate-800/50 block">Game Stars</span>
                  <div className="flex flex-col gap-2.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded-full bg-indigo-500/20 text-indigo-300 font-bold text-[9px] flex items-center justify-center">AN</div>
                        <span className="font-semibold text-white">A. Nakamura (G)</span>
                      </div>
                      <span className="font-mono text-indigo-400 font-bold">24 PTS, 5 AST</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded-full bg-indigo-500/20 text-indigo-300 font-bold text-[9px] flex items-center justify-center">MV</div>
                        <span className="font-semibold text-white">M. Vance (F)</span>
                      </div>
                      <span className="font-mono text-indigo-400 font-bold">18 PTS, 12 REB</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded-full bg-slate-500/20 text-slate-300 font-bold text-[9px] flex items-center justify-center">JL</div>
                        <span className="font-semibold text-white">J. Li (G)</span>
                      </div>
                      <span className="font-mono text-slate-400 font-bold">22 PTS, 6 AST</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom: Commentary */}
              <div className="border-t border-slate-800/80 pt-3.5">
                <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-2 block">Live Commentary Log</span>
                <div className="text-xs text-slate-400 flex flex-col gap-2 font-mono max-h-[72px] overflow-y-auto custom-scrollbar">
                  <div className="flex items-start gap-2 bg-[#071126]/30 p-2 rounded-xl border border-slate-800/20">
                    <span className="text-[#818CF8] font-bold shrink-0">[2:14]</span>
                    <span>Aria Nakamura drills a clutch 3-pointer from the left wing! Timeout Metro Wolves.</span>
                  </div>
                  <div className="flex items-start gap-2 bg-[#071126]/30 p-2 rounded-xl border border-slate-800/20">
                    <span className="text-[#818CF8] font-bold shrink-0">[3:02]</span>
                    <span>Steal by Aria Nakamura, leading to a fast break dunk! CampusX Titans take the lead.</span>
                  </div>
                  <div className="flex items-start gap-2 bg-[#071126]/30 p-2 rounded-xl border border-slate-800/20">
                    <span className="text-slate-500 font-bold shrink-0">[4:15]</span>
                    <span>Tyler Cruz scores inside with an offensive rebound tip-in. Wolves answer.</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Role Workspace Panel */}
            <div className="lg:col-span-1 bg-[#102043] border border-[rgba(255,255,255,0.08)] rounded-[20px] p-6 flex flex-col gap-5 shadow-lg">
              <div className="flex items-center gap-1.5 border-b border-slate-800/80 pb-3">
                <Sparkles className="w-4.5 h-4.5 text-indigo-400" />
                <h2 className="text-sm font-bold text-white">Role Workspace Panel</h2>
              </div>
              
              {/* Workspace Navigation tabs */}
              <div className="grid grid-cols-5 gap-1 bg-[#071126]/60 border border-slate-800/80 p-1 rounded-xl">
                {[
                  { id: 'director', label: 'DIR', title: 'Sports Director' },
                  { id: 'coach', label: 'COA', title: 'Coach' },
                  { id: 'athlete', label: 'ATH', title: 'Athlete' },
                  { id: 'parent', label: 'PAR', title: 'Parent' },
                  { id: 'medical', label: 'MED', title: 'Medical Staff' }
                ].map(r => (
                  <button
                    key={r.id}
                    onClick={() => setSelectedRoleWorkspace(r.id)}
                    className={`py-1 text-[9px] font-extrabold rounded-lg text-center transition-all cursor-pointer ${
                      selectedRoleWorkspace === r.id 
                        ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/25' 
                        : 'text-slate-400 hover:text-white hover:bg-slate-800/35'
                    }`}
                    title={r.title}
                  >
                    {r.label}
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              <div className="flex flex-col gap-4 flex-1">
                <div>
                  <span className="text-[9px] font-bold text-indigo-400 uppercase tracking-widest block">Active Workspace</span>
                  <h3 className="text-xs font-bold text-white mt-0.5">
                    {selectedRoleWorkspace === 'director' && 'Sports Director Console'}
                    {selectedRoleWorkspace === 'coach' && 'Head Coach Command'}
                    {selectedRoleWorkspace === 'athlete' && 'Athlete Performance Deck'}
                    {selectedRoleWorkspace === 'parent' && 'Parent Progress Locker'}
                    {selectedRoleWorkspace === 'medical' && 'Medical Health Ledger'}
                  </h3>
                </div>

                {/* Permissions */}
                <div className="bg-[#071126]/30 border border-slate-800/50 rounded-xl p-3 flex flex-col gap-1.5">
                  <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">Access Clearances</span>
                  <div className="flex flex-wrap gap-1">
                    {selectedRoleWorkspace === 'director' && (
                      <>
                        <span className="px-1.5 py-0.5 bg-indigo-500/10 text-indigo-300 text-[8px] font-bold rounded font-mono border border-indigo-500/15">BUDGET_DISBURSE</span>
                        <span className="px-1.5 py-0.5 bg-indigo-500/10 text-indigo-300 text-[8px] font-bold rounded font-mono border border-indigo-500/15">ROSTER_SIGNOFF</span>
                        <span className="px-1.5 py-0.5 bg-indigo-500/10 text-indigo-300 text-[8px] font-bold rounded font-mono border border-indigo-500/15">FACILITY_ADMIN</span>
                      </>
                    )}
                    {selectedRoleWorkspace === 'coach' && (
                      <>
                        <span className="px-1.5 py-0.5 bg-indigo-500/10 text-indigo-300 text-[8px] font-bold rounded font-mono border border-indigo-500/15">DRILL_WRITE</span>
                        <span className="px-1.5 py-0.5 bg-indigo-500/10 text-indigo-300 text-[8px] font-bold rounded font-mono border border-indigo-500/15">ATTENDANCE_LOG</span>
                        <span className="px-1.5 py-0.5 bg-indigo-500/10 text-indigo-300 text-[8px] font-bold rounded font-mono border border-indigo-500/15">MATCH_REPORT</span>
                      </>
                    )}
                    {selectedRoleWorkspace === 'athlete' && (
                      <>
                        <span className="px-1.5 py-0.5 bg-indigo-500/10 text-indigo-300 text-[8px] font-bold rounded font-mono border border-indigo-500/15">BIOMETRIC_SYNC</span>
                        <span className="px-1.5 py-0.5 bg-indigo-500/10 text-indigo-300 text-[8px] font-bold rounded font-mono border border-indigo-500/15">AI_COACH_ASK</span>
                        <span className="px-1.5 py-0.5 bg-indigo-500/10 text-indigo-300 text-[8px] font-bold rounded font-mono border border-indigo-500/15">NFT_MINT</span>
                      </>
                    )}
                    {selectedRoleWorkspace === 'parent' && (
                      <>
                        <span className="px-1.5 py-0.5 bg-indigo-500/10 text-indigo-300 text-[8px] font-bold rounded font-mono border border-indigo-500/15">BIOMETRIC_READ</span>
                        <span className="px-1.5 py-0.5 bg-indigo-500/10 text-indigo-300 text-[8px] font-bold rounded font-mono border border-indigo-500/15">SCHOLARSHIP_READ</span>
                        <span className="px-1.5 py-0.5 bg-indigo-500/10 text-indigo-300 text-[8px] font-bold rounded font-mono border border-indigo-500/15">SIGN_WAIVER</span>
                      </>
                    )}
                    {selectedRoleWorkspace === 'medical' && (
                      <>
                        <span className="px-1.5 py-0.5 bg-indigo-500/10 text-indigo-300 text-[8px] font-bold rounded font-mono border border-indigo-500/15">INJURY_WRITE</span>
                        <span className="px-1.5 py-0.5 bg-indigo-500/10 text-indigo-300 text-[8px] font-bold rounded font-mono border border-indigo-500/15">HEALTH_CLEAR</span>
                        <span className="px-1.5 py-0.5 bg-indigo-500/10 text-indigo-300 text-[8px] font-bold rounded font-mono border border-indigo-500/15">MED_RECORDS</span>
                      </>
                    )}
                  </div>
                </div>

                {/* Tasks */}
                <div className="flex flex-col gap-1.5">
                  <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">Assigned Checklist</span>
                  <div className="flex flex-col gap-1.5 text-[10px]">
                    {selectedRoleWorkspace === 'director' && (
                      <>
                        <div className="flex items-center gap-2 text-slate-300">
                          <input type="checkbox" defaultChecked className="accent-indigo-500 rounded" readOnly />
                          <span className="line-through text-slate-500">Disburse $24,000 grants</span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-300">
                          <input type="checkbox" className="accent-indigo-500 rounded" readOnly />
                          <span>Verify Court B bookings</span>
                        </div>
                      </>
                    )}
                    {selectedRoleWorkspace === 'coach' && (
                      <>
                        <div className="flex items-center gap-2 text-slate-300">
                          <input type="checkbox" className="accent-indigo-500 rounded" readOnly />
                          <span>Log morning conditioning</span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-300">
                          <input type="checkbox" className="accent-indigo-500 rounded" readOnly />
                          <span>Review athlete tactical drill</span>
                        </div>
                      </>
                    )}
                    {selectedRoleWorkspace === 'athlete' && (
                      <>
                        <div className="flex items-center gap-2 text-slate-300">
                          <input type="checkbox" className="accent-indigo-500 rounded" readOnly />
                          <span>Sync Fitbit telemetry data</span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-300">
                          <input type="checkbox" defaultChecked className="accent-indigo-500 rounded" readOnly />
                          <span className="line-through text-slate-500">Review AI recovery drill</span>
                        </div>
                      </>
                    )}
                    {selectedRoleWorkspace === 'parent' && (
                      <>
                        <div className="flex items-center gap-2 text-slate-300">
                          <input type="checkbox" className="accent-indigo-500 rounded" readOnly />
                          <span>E-sign medical waiver form</span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-300">
                          <input type="checkbox" defaultChecked className="accent-indigo-500 rounded" readOnly />
                          <span className="line-through text-slate-500">Audit compliance ledger</span>
                        </div>
                      </>
                    )}
                    {selectedRoleWorkspace === 'medical' && (
                      <>
                        <div className="flex items-center gap-2 text-slate-300">
                          <input type="checkbox" className="accent-indigo-500 rounded" readOnly />
                          <span>Re-evaluate Aria cardiac log</span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-300">
                          <input type="checkbox" className="accent-indigo-500 rounded" readOnly />
                          <span>Review Vance ankle sprain</span>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Notifications */}
                <div className="flex flex-col gap-1.5">
                  <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">Recent Activity Alerts</span>
                  <div className="bg-[#071126]/30 border border-slate-800/50 rounded-xl p-2.5 flex flex-col gap-1.5 text-[9px] text-slate-400">
                    {selectedRoleWorkspace === 'director' && (
                      <>
                        <div>• Head Coach requested additional travel funds.</div>
                        <div>• Weekly attendance compiled (94% presence).</div>
                      </>
                    )}
                    {selectedRoleWorkspace === 'coach' && (
                      <>
                        <div>• 2 athletes filed medical sprain logs.</div>
                        <div>• Live score sync feed active.</div>
                      </>
                    )}
                    {selectedRoleWorkspace === 'athlete' && (
                      <>
                        <div>• Roster cleared for CampusX Gold Cup.</div>
                        <div>• Athletic grant approved for Fall 2026.</div>
                      </>
                    )}
                    {selectedRoleWorkspace === 'parent' && (
                      <>
                        <div>• Next game: CampusX vs Metro Wolves Friday.</div>
                        <div>• Child endurance logs rose by 12%.</div>
                      </>
                    )}
                    {selectedRoleWorkspace === 'medical' && (
                      <>
                        <div>• Fitbit health alert: Heart rate anomaly.</div>
                        <div>• Wearable telemetry synced for 12 roster members.</div>
                      </>
                    )}
                  </div>
                </div>

                {/* Shortcuts */}
                <div className="flex flex-col gap-1.5 mt-auto pt-2.5 border-t border-slate-800/60">
                  <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">Quick Actions</span>
                  <div className="grid grid-cols-2 gap-2">
                    {selectedRoleWorkspace === 'director' && (
                      <>
                        <button onClick={() => router.push('/sports/tournaments')} className="py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-[9px] font-bold rounded-lg cursor-pointer transition-colors text-center truncate shadow-md shadow-indigo-600/10">Initialize Tourney</button>
                        <button onClick={() => router.push('/sports/scholarships')} className="py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-[9px] font-bold rounded-lg cursor-pointer transition-colors text-center truncate">Allocate Funding</button>
                      </>
                    )}
                    {selectedRoleWorkspace === 'coach' && (
                      <>
                        <button onClick={() => router.push('/sports/training')} className="py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-[9px] font-bold rounded-lg cursor-pointer transition-colors text-center truncate shadow-md shadow-indigo-600/10">Log Conditioning</button>
                        <button onClick={() => router.push('/sports/ai-coach')} className="py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-[9px] font-bold rounded-lg cursor-pointer transition-colors text-center truncate">AI Coach Advice</button>
                      </>
                    )}
                    {selectedRoleWorkspace === 'athlete' && (
                      <>
                        <button onClick={() => router.push('/sports/fitness')} className="py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-[9px] font-bold rounded-lg cursor-pointer transition-colors text-center truncate shadow-md shadow-indigo-600/10">Biometrics Log</button>
                        <button onClick={() => router.push('/sports/ai-coach')} className="py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-[9px] font-bold rounded-lg cursor-pointer transition-colors text-center truncate">Custom Workouts</button>
                      </>
                    )}
                    {selectedRoleWorkspace === 'parent' && (
                      <>
                        <button onClick={() => router.push('/sports/analytics')} className="py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-[9px] font-bold rounded-lg cursor-pointer transition-colors text-center truncate shadow-md shadow-indigo-600/10">Performance Deck</button>
                        <button onClick={() => router.push('/sports/live')} className="py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-[9px] font-bold rounded-lg cursor-pointer transition-colors text-center truncate">Live Tracker</button>
                      </>
                    )}
                    {selectedRoleWorkspace === 'medical' && (
                      <>
                        <button onClick={() => router.push('/sports/fitness')} className="py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-[9px] font-bold rounded-lg cursor-pointer transition-colors text-center truncate shadow-md shadow-indigo-600/10">Biometrics sync</button>
                        <button onClick={() => router.push('/sports/reports')} className="py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-[9px] font-bold rounded-lg cursor-pointer transition-colors text-center truncate">Medical Audit</button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Analytics Grid Section */}
          <div className="mt-2 border-t border-slate-800/80 pt-6">
            <h2 className="text-sm font-bold text-white flex items-center gap-2 mb-4">
              <BarChart2 className="w-5 h-5 text-indigo-400" />
              University Executive Sports Analytics
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '24px' }}>
              {/* Card 1: Performance Analytics */}
              <div className="bg-[#102043] border border-[rgba(255,255,255,0.08)] rounded-[20px] p-6 flex flex-col gap-4 shadow-lg hover:scale-[1.01] transition-transform">
                <div className="flex justify-between items-center border-b border-slate-800/60 pb-2">
                  <span className="text-xs font-bold text-white flex items-center gap-2">
                    <Trophy className="w-4 h-4 text-yellow-500" />
                    Performance Analytics
                  </span>
                  <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-full">+12.4% MoM</span>
                </div>
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>Overall Win Rate</span>
                  <span className="font-mono font-bold text-white">75%</span>
                </div>
                <div className="w-full bg-[#071126]/60 h-2 rounded-full overflow-hidden">
                  <div className="bg-indigo-500 h-full rounded-full" style={{ width: '75%' }}></div>
                </div>
                <div className="grid grid-cols-2 gap-3 text-[10px] mt-2">
                  <div className="bg-[#071126]/40 p-2.5 rounded-xl border border-slate-800/40">
                    <span className="text-slate-500 block font-semibold uppercase">Offensive Rtg</span>
                    <span className="text-xs font-extrabold text-white font-mono mt-0.5 block">112.4</span>
                  </div>
                  <div className="bg-[#071126]/40 p-2.5 rounded-xl border border-slate-800/40">
                    <span className="text-slate-500 block font-semibold uppercase">Defensive Rtg</span>
                    <span className="text-xs font-extrabold text-white font-mono mt-0.5 block">96.8</span>
                  </div>
                </div>
              </div>

              {/* Card 2: Fitness Analytics */}
              <div className="bg-[#102043] border border-[rgba(255,255,255,0.08)] rounded-[20px] p-6 flex flex-col gap-4 shadow-lg hover:scale-[1.01] transition-transform">
                <div className="flex justify-between items-center border-b border-slate-800/60 pb-2">
                  <span className="text-xs font-bold text-white flex items-center gap-2">
                    <Heart className="w-4 h-4 text-rose-500 animate-pulse" />
                    Fitness Analytics
                  </span>
                  <span className="text-[10px] text-indigo-400 font-bold bg-indigo-500/10 px-2 py-0.5 rounded-full">Wearable Sync</span>
                </div>
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>Average VO2 Max</span>
                  <span className="font-mono font-bold text-white">54.2 ml/kg</span>
                </div>
                <div className="w-full bg-[#071126]/60 h-2 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full rounded-full" style={{ width: '82%' }}></div>
                </div>
                <div className="grid grid-cols-2 gap-3 text-[10px] mt-2">
                  <div className="bg-[#071126]/40 p-2.5 rounded-xl border border-slate-800/40">
                    <span className="text-slate-500 block font-semibold uppercase">Avg Heart Rate</span>
                    <span className="text-xs font-extrabold text-white font-mono mt-0.5 block">68 bpm</span>
                  </div>
                  <div className="bg-[#071126]/40 p-2.5 rounded-xl border border-slate-800/40">
                    <span className="text-slate-500 block font-semibold uppercase">Recovery Score</span>
                    <span className="text-xs font-extrabold text-white font-mono mt-0.5 block">88%</span>
                  </div>
                </div>
              </div>

              {/* Card 3: Scholarship Analytics */}
              <div className="bg-[#102043] border border-[rgba(255,255,255,0.08)] rounded-[20px] p-6 flex flex-col gap-4 shadow-lg hover:scale-[1.01] transition-transform">
                <div className="flex justify-between items-center border-b border-slate-800/60 pb-2">
                  <span className="text-xs font-bold text-white flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-[#818CF8]" />
                    Scholarship Analytics
                  </span>
                  <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-full">Budget Safe</span>
                </div>
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>Total Disbursed Funding</span>
                  <span className="font-mono font-bold text-white">$270,000</span>
                </div>
                <div className="w-full bg-[#071126]/60 h-2 rounded-full overflow-hidden">
                  <div className="bg-indigo-500 h-full rounded-full" style={{ width: '70%' }}></div>
                </div>
                <div className="grid grid-cols-2 gap-3 text-[10px] mt-2">
                  <div className="bg-[#071126]/40 p-2.5 rounded-xl border border-slate-800/40">
                    <span className="text-slate-500 block font-semibold uppercase">Active Grants</span>
                    <span className="text-xs font-extrabold text-white font-mono mt-0.5 block">14 Athletes</span>
                  </div>
                  <div className="bg-[#071126]/40 p-2.5 rounded-xl border border-slate-800/40">
                    <span className="text-slate-500 block font-semibold uppercase">Grade Compliance</span>
                    <span className="text-xs font-extrabold text-white font-mono mt-0.5 block">100% GPA</span>
                  </div>
                </div>
              </div>

              {/* Card 4: Team Analytics */}
              <div className="bg-[#102043] border border-[rgba(255,255,255,0.08)] rounded-[20px] p-6 flex flex-col gap-4 shadow-lg hover:scale-[1.01] transition-transform">
                <div className="flex justify-between items-center border-b border-slate-800/60 pb-2">
                  <span className="text-xs font-bold text-white flex items-center gap-2">
                    <Users className="w-4 h-4 text-cyan-400" />
                    Team Analytics
                  </span>
                  <span className="text-[10px] text-cyan-400 font-bold bg-cyan-500/10 px-2 py-0.5 rounded-full">3 Active Squads</span>
                </div>
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>Roster Strength</span>
                  <span className="font-mono font-bold text-white">45 Active Rosters</span>
                </div>
                <div className="w-full bg-[#071126]/60 h-2 rounded-full overflow-hidden">
                  <div className="bg-cyan-500 h-full rounded-full" style={{ width: '85%' }}></div>
                </div>
                <div className="grid grid-cols-2 gap-3 text-[10px] mt-2">
                  <div className="bg-[#071126]/40 p-2.5 rounded-xl border border-slate-800/40">
                    <span className="text-slate-500 block font-semibold uppercase">Basketball</span>
                    <span className="text-xs font-extrabold text-white font-mono mt-0.5 block">15 Athletes</span>
                  </div>
                  <div className="bg-[#071126]/40 p-2.5 rounded-xl border border-slate-800/40">
                    <span className="text-slate-500 block font-semibold uppercase">Football</span>
                    <span className="text-xs font-extrabold text-white font-mono mt-0.5 block">22 Athletes</span>
                  </div>
                </div>
              </div>

              {/* Card 5: Attendance Analytics */}
              <div className="bg-[#102043] border border-[rgba(255,255,255,0.08)] rounded-[20px] p-6 flex flex-col gap-4 shadow-lg hover:scale-[1.01] transition-transform">
                <div className="flex justify-between items-center border-b border-slate-800/60 pb-2">
                  <span className="text-xs font-bold text-white flex items-center gap-2">
                    <CheckSquare className="w-4 h-4 text-emerald-500" />
                    Attendance Analytics
                  </span>
                  <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-full">Clearance Pass</span>
                </div>
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>Practice Turnout Rate</span>
                  <span className="font-mono font-bold text-white">94.2%</span>
                </div>
                <div className="w-full bg-[#071126]/60 h-2 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full rounded-full" style={{ width: '94.2%' }}></div>
                </div>
                <div className="grid grid-cols-2 gap-3 text-[10px] mt-2">
                  <div className="bg-[#071126]/40 p-2.5 rounded-xl border border-slate-800/40">
                    <span className="text-slate-500 block font-semibold uppercase">Excused Absences</span>
                    <span className="text-xs font-extrabold text-white font-mono mt-0.5 block">2 Logs</span>
                  </div>
                  <div className="bg-[#071126]/40 p-2.5 rounded-xl border border-slate-800/40">
                    <span className="text-slate-500 block font-semibold uppercase">Unexcused</span>
                    <span className="text-xs font-extrabold text-white font-mono mt-0.5 block">0 Logs</span>
                  </div>
                </div>
              </div>

              {/* Card 6: Injury Analytics */}
              <div className="bg-[#102043] border border-[rgba(255,255,255,0.08)] rounded-[20px] p-6 flex flex-col gap-4 shadow-lg hover:scale-[1.01] transition-transform">
                <div className="flex justify-between items-center border-b border-slate-800/60 pb-2">
                  <span className="text-xs font-bold text-white flex items-center gap-2">
                    <Activity className="w-4 h-4 text-amber-500" />
                    Injury & Medical Status
                  </span>
                  <span className="text-[10px] text-amber-400 font-bold bg-amber-500/10 px-2 py-0.5 rounded-full">1 Review</span>
                </div>
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>Roster Health Rate</span>
                  <span className="font-mono font-bold text-white">88% Healthy</span>
                </div>
                <div className="w-full bg-[#071126]/60 h-2 rounded-full overflow-hidden">
                  <div className="bg-amber-500 h-full rounded-full" style={{ width: '88%' }}></div>
                </div>
                <div className="grid grid-cols-2 gap-3 text-[10px] mt-2">
                  <div className="bg-[#071126]/40 p-2.5 rounded-xl border border-slate-800/40">
                    <span className="text-slate-500 block font-semibold uppercase">Rehab Status</span>
                    <span className="text-xs font-extrabold text-[#F59E0B] font-mono mt-0.5 block">1 Athlete</span>
                  </div>
                  <div className="bg-[#071126]/40 p-2.5 rounded-xl border border-slate-800/40">
                    <span className="text-slate-500 block font-semibold uppercase">Fully Cleared</span>
                    <span className="text-xs font-extrabold text-white font-mono mt-0.5 block">12 Athletes</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sports Director Tab */}
      {currentTab === 'director' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in">
          {/* Main Director Section */}
          <div className="md:col-span-2 flex flex-col gap-6">
            {/* Create Tournament Form */}
            <div className="card p-6 bg-[#102043] border border-slate-800 rounded-2xl shadow-lg">
              <h2 className="text-md font-bold text-white pb-3 border-b border-slate-800 flex items-center gap-2 mb-4">
                <Trophy className="w-5 h-5 text-indigo-400" />
                Initialize New Tournament Bracket
              </h2>
              <form onSubmit={handleCreateTournament} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                <div>
                  <label className="text-xs text-slate-400 font-semibold mb-1 block">Tournament Title</label>
                  <input 
                    type="text" 
                    placeholder="e.g. CampusX Gold Cup" 
                    value={newTournament.name}
                    onChange={(e) => setNewTournament({ ...newTournament, name: e.target.value })}
                    className="w-full bg-[#071126] border border-slate-800 focus:border-indigo-500 rounded-xl px-4 py-2.5 text-xs text-white outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-400 font-semibold mb-1 block">Sport Discipline</label>
                  <select 
                    value={newTournament.sport}
                    onChange={(e) => setNewTournament({ ...newTournament, sport: e.target.value })}
                    className="w-full bg-[#071126] border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white outline-none"
                  >
                    <option value="Football">Football</option>
                    <option value="Basketball">Basketball</option>
                    <option value="Esports">Esports</option>
                    <option value="Tennis">Tennis</option>
                  </select>
                </div>
                <button 
                  type="submit"
                  className="py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-indigo-600/20"
                >
                  <Plus className="w-4 h-4" /> Create Bracket
                </button>
              </form>
            </div>

            {/* Allocate Budgets & Coaches */}
            <div className="card p-6 bg-[#102043] border border-slate-800 rounded-2xl shadow-lg">
              <h2 className="text-md font-bold text-white pb-3 border-b border-slate-800 flex items-center gap-2 mb-4">
                <DollarSign className="w-5 h-5 text-indigo-400" />
                Sports Funding & Roster Controls
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-[#071126]/60 border border-slate-800 rounded-xl">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Varsity Budget Allocation</span>
                  <div className="text-xl font-bold font-mono text-white mt-1">$120,000 Total</div>
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden mt-3">
                    <div className="bg-indigo-500 h-full" style={{ width: '70%' }}></div>
                  </div>
                  <div className="flex justify-between text-[10px] text-slate-500 mt-2">
                    <span>Disbursed: $84,000 (70%)</span>
                    <span>Remaining: $36,000</span>
                  </div>
                </div>
                <div className="p-4 bg-[#071126]/60 border border-slate-800 rounded-xl flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Active Head Coaches</span>
                    <div className="text-sm font-semibold text-white mt-1">4 Registered Coaches</div>
                  </div>
                  <button 
                    onClick={() => alert('Add Coach module: Enforcing database users mapping...')}
                    className="w-full py-2 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 hover:bg-indigo-500/20 hover:text-white rounded-lg text-[10px] font-bold transition-all mt-3 cursor-pointer"
                  >
                    Add / Assign Coaches
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions Side panel */}
          <div className="flex flex-col gap-6">
            {/* Registered Teams Overview */}
            <div className="card p-5 bg-[#102043] border border-slate-800 rounded-2xl shadow-lg flex flex-col gap-3">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-800 pb-2">Teams Registry</h3>
              <div className="flex flex-col gap-2 max-h-[220px] overflow-y-auto pr-1">
                {teams.map(t => (
                  <div key={t.id} className="p-3 bg-[#071126] border border-slate-800 rounded-xl flex items-center justify-between text-xs">
                    <div>
                      <div className="font-semibold text-white">{t.name}</div>
                      <div className="text-[10px] text-slate-400 mt-0.5">{t.sport} • Win rate {t.stats.win_rate || '0%'}</div>
                    </div>
                    <button 
                      onClick={() => handleIssueCredential(t.name, 'Gold Division Standing')}
                      className="px-2.5 py-1 bg-indigo-600/10 hover:bg-indigo-600 border border-indigo-500/20 hover:border-indigo-500 text-indigo-400 hover:text-white rounded-lg text-[9px] font-bold transition-colors cursor-pointer"
                    >
                      Issue NFT Cert
                    </button>
                  </div>
                ))}
              </div>
              {mintingSuccess && (
                <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-semibold rounded-xl animate-fade-in flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 shrink-0" />
                  <span>{mintingSuccess}</span>
                </div>
              )}
            </div>

            {/* Blockchain transaction proofs */}
            <div className="card p-5 bg-[#102043] border border-slate-800 rounded-2xl shadow-lg flex flex-col gap-2">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-800 pb-2 flex items-center gap-2">
                <ShieldCheck className="w-4.5 h-4.5 text-indigo-400" />
                CampusX Chain Proof Logs
              </h3>
              <div className="h-32 bg-[#071126] border border-slate-800 rounded-xl p-3 overflow-y-auto font-mono text-[9px] text-emerald-400 flex flex-col gap-1.5 custom-scrollbar">
                {blockchainLogs.length === 0 ? (
                  <span className="text-slate-500">No recent blockchain interactions recorded. Issue a credential above.</span>
                ) : (
                  blockchainLogs.map((log, idx) => <div key={idx}>{log}</div>)
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Coach Tab */}
      {currentTab === 'coach' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in">
          {/* Matches Roster list */}
          <div className="md:col-span-2 card p-6 bg-[#102043] border border-slate-800 rounded-2xl shadow-lg">
            <div className="flex justify-between items-center pb-3 border-b border-slate-800 mb-4">
              <h2 className="text-md font-bold text-white flex items-center gap-2">
                <Tv className="w-5 h-5 text-indigo-400" />
                Squad Matches & Highlights
              </h2>
            </div>
            <div className="flex flex-col gap-3">
              {matches.map(m => (
                <div key={m.id} className="p-4 bg-[#071126] border border-slate-800 rounded-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-white">{m.team_a} vs {m.team_b}</span>
                      <span className={`px-2 py-0.5 text-[9px] font-bold rounded-full uppercase ${m.status === 'Completed' ? 'bg-slate-800 text-slate-400' : (m.status === 'Live' ? 'bg-rose-500/20 text-rose-400 animate-pulse' : 'bg-indigo-500/20 text-indigo-400')}`}>{m.status}</span>
                    </div>
                    <div className="text-[10px] text-slate-400 mt-1 font-mono">{m.schedule} • {m.venue}</div>
                  </div>
                  <div className="flex gap-2">
                    {m.status === 'Live' && (
                      <button 
                        onClick={() => startLiveSimulation(m)}
                        className="px-3 py-1.5 bg-rose-500 hover:bg-rose-600 text-white rounded-lg text-[10px] font-bold cursor-pointer transition-colors shadow-lg shadow-rose-500/20"
                      >
                        Simulate Play
                      </button>
                    )}
                    {m.status === 'Completed' && (
                      <button 
                        onClick={() => alert(`Match Report:\n\n${m.report}\n\nLineups: ${JSON.stringify(m.lineups)}`)}
                        className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-[10px] font-bold cursor-pointer transition-colors"
                      >
                        Match Report
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Live Play-by-Play Simulator Drawer */}
            {selectedMatch && (
              <div className="mt-6 p-4 bg-[#071126]/80 border border-slate-800 rounded-xl animate-fade-in flex flex-col gap-3">
                <div className="flex justify-between items-center pb-2 border-b border-slate-800">
                  <span className="text-xs font-bold text-white">Live Simulator: {selectedMatch.team_a} vs {selectedMatch.team_b}</span>
                  <span className="text-xs font-mono font-bold text-indigo-400">Score: {simulatedScore.a} - {simulatedScore.b}</span>
                </div>
                <div className="h-32 overflow-y-auto p-2 bg-[#102043]/30 rounded-lg font-mono text-[10px] text-indigo-300 flex flex-col gap-1.5 custom-scrollbar">
                  {simulatedCommentary.map((line, idx) => <div key={idx}>{line}</div>)}
                </div>
              </div>
            )}
          </div>

          {/* Practice attendance logger panel */}
          <div className="flex flex-col gap-6">
            <div className="card p-6 bg-[#102043] border border-slate-800 rounded-2xl shadow-lg flex flex-col gap-3">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-800 pb-2 flex items-center gap-1.5">
                <CheckSquare className="w-4.5 h-4.5 text-indigo-400" />
                Practice Attendance Roster
              </h3>
              <div className="flex flex-col gap-2 text-xs">
                {athletes.map(a => (
                  <div key={a.id} className="flex items-center justify-between p-2.5 bg-[#071126]/60 border border-slate-800/80 rounded-xl">
                    <div className="flex items-center gap-2">
                      <img src={a.user_avatar} alt="Avatar" className="w-6 h-6 rounded-full object-cover" />
                      <span className="font-semibold text-white">{a.user_name}</span>
                    </div>
                    <div className="flex gap-1.5">
                      <button 
                        onClick={() => alert(`Logged Present for ${a.user_name}`)}
                        className="px-2 py-1 bg-emerald-500/10 hover:bg-emerald-500 text-emerald-400 hover:text-white rounded-md text-[9px] font-bold transition-all cursor-pointer"
                      >
                        Present
                      </button>
                      <button 
                        onClick={() => alert(`Logged Absent for ${a.user_name}`)}
                        className="px-2 py-1 bg-rose-500/10 hover:bg-rose-500 text-rose-400 hover:text-white rounded-md text-[9px] font-bold transition-all cursor-pointer"
                      >
                        Absent
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Share to Connect block */}
            <div className="card p-5 bg-[#102043] border border-slate-800 rounded-2xl shadow-lg flex flex-col gap-3.5">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-800 pb-2">Broadcast to CampusX Connect</h3>
              <textarea 
                placeholder="Share a team result, drill reels, or scholarship notices directly to the campus main social feed..." 
                value={connectContent}
                onChange={(e) => setConnectContent(e.target.value)}
                className="w-full h-20 bg-[#071126] border border-slate-800 focus:border-indigo-500 rounded-xl p-3 text-xs text-white placeholder-slate-500 outline-none resize-none"
              />
              <button 
                onClick={handleShareToConnect}
                className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-lg shadow-indigo-600/20"
              >
                <Send className="w-3.5 h-3.5" /> Broadcast Post
              </button>
              {shareSuccess && (
                <div className="text-[10px] text-emerald-400 font-semibold text-center mt-1 bg-emerald-500/10 border border-emerald-500/20 py-1.5 rounded-lg animate-fade-in">
                  {shareSuccess}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Athlete Tab */}
      {currentTab === 'athlete' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in">
          {/* Left panel: biometrics & biometrics graphs */}
          <div className="md:col-span-2 flex flex-col gap-6">
            <div className="card p-6 bg-[#102043] border border-slate-800 rounded-2xl shadow-lg">
              <h2 className="text-md font-bold text-white pb-3 border-b border-slate-800 flex items-center gap-2 mb-4">
                <Heart className="w-5 h-5 text-indigo-400" />
                Live Wearable Biometrics (FitBit Streamed)
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 bg-[#071126]/60 border border-slate-800 rounded-xl text-center">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">VO2 Max</span>
                  <div className="text-2xl font-bold font-mono text-indigo-400 mt-2">52 ml/kg</div>
                  <span className="text-[9px] text-emerald-400 font-semibold mt-1 block">Excellent</span>
                </div>
                <div className="p-4 bg-[#071126]/60 border border-slate-800 rounded-xl text-center">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">BMI Index</span>
                  <div className="text-2xl font-bold font-mono text-white mt-2">21.2</div>
                  <span className="text-[9px] text-slate-400 font-semibold mt-1 block">Ideal Range</span>
                </div>
                <div className="p-4 bg-[#071126]/60 border border-slate-800 rounded-xl text-center">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Fatigue Ratio</span>
                  <div className="text-2xl font-bold font-mono text-amber-400 mt-2">38%</div>
                  <span className="text-[9px] text-amber-400 font-semibold mt-1 block">Low Risk</span>
                </div>
                <div className="p-4 bg-[#071126]/60 border border-slate-800 rounded-xl text-center">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Recovery Score</span>
                  <div className="text-2xl font-bold font-mono text-emerald-400 mt-2">87%</div>
                  <span className="text-[9px] text-emerald-400 font-semibold mt-1 block">Ready</span>
                </div>
              </div>

              {/* Graphic indicators */}
              <div className="mt-6 p-4 bg-[#071126]/30 border border-slate-800/80 rounded-xl">
                <span className="text-xs font-semibold text-slate-400 block mb-3">Weekly Cardio Load Profile</span>
                <div className="h-16 flex items-end justify-between px-6 gap-3 pt-2">
                  <div className="w-full bg-slate-800 rounded-t h-[40%]"></div>
                  <div className="w-full bg-indigo-500 rounded-t h-[65%]"></div>
                  <div className="w-full bg-indigo-500 rounded-t h-[80%]"></div>
                  <div className="w-full bg-slate-800 rounded-t h-[30%]"></div>
                  <div className="w-full bg-indigo-600 rounded-t h-[95%]"></div>
                  <div className="w-full bg-slate-800 rounded-t h-[50%]"></div>
                  <div className="w-full bg-indigo-500 rounded-t h-[75%]"></div>
                </div>
                <div className="flex justify-between text-[9px] text-slate-500 mt-2 px-1 font-mono">
                  <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
                </div>
              </div>
            </div>

            {/* Custom AI workout recommendations card */}
            <div className="card p-6 bg-[#102043] border border-slate-800 rounded-2xl shadow-lg">
              <h2 className="text-md font-bold text-white pb-3 border-b border-slate-800 flex items-center gap-2 mb-4">
                <Bot className="w-5 h-5 text-indigo-400" />
                AI Coach Integration
              </h2>
              <div className="flex flex-col gap-3">
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    value={aiPrompt}
                    onChange={(e) => setAiPrompt(e.target.value)}
                    className="flex-1 bg-[#071126] border border-slate-800 focus:border-indigo-500 rounded-xl px-4 py-2.5 text-xs text-white outline-none"
                  />
                  <button 
                    onClick={handleAskAICoach}
                    disabled={aiLoading}
                    className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 shrink-0"
                  >
                    {aiLoading ? 'Analyzing...' : 'Ask AI'}
                  </button>
                </div>
                {aiResponse && (
                  <div className="p-4 bg-[#071126] border border-slate-800 rounded-xl text-xs leading-relaxed animate-fade-in whitespace-pre-line text-slate-300">
                    {aiResponse}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right panel: Active training blocks & scholarships status */}
          <div className="flex flex-col gap-6">
            <div className="card p-5 bg-[#102043] border border-slate-800 rounded-2xl shadow-lg flex flex-col gap-3">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-800 pb-2">Assigned Training Blocks</h3>
              <div className="flex flex-col gap-2.5">
                <div className="p-3 bg-[#071126] border border-slate-800 rounded-xl text-xs">
                  <div className="font-semibold text-white">HIIT Conditioning Block</div>
                  <div className="text-[10px] text-slate-400 mt-1">Duration: 45m • Focus: VO2 Peak increase</div>
                  <div className="mt-2.5 flex items-center justify-between text-[10px] text-slate-400 border-t border-slate-800/60 pt-2">
                    <span>Due: Tomorrow</span>
                    <button className="text-indigo-400 hover:text-white font-bold cursor-pointer">View Drills</button>
                  </div>
                </div>
                <div className="p-3 bg-[#071126] border border-slate-800 rounded-xl text-xs">
                  <div className="font-semibold text-white">Core Dynamic Balancing</div>
                  <div className="text-[10px] text-slate-400 mt-1">Duration: 30m • Focus: Ankle Perturbations</div>
                  <div className="mt-2.5 flex items-center justify-between text-[10px] text-slate-400 border-t border-slate-800/60 pt-2">
                    <span>Due: June 18</span>
                    <button className="text-indigo-400 hover:text-white font-bold cursor-pointer">View Drills</button>
                  </div>
                </div>
              </div>
            </div>

            <div className="card p-5 bg-[#102043] border border-slate-800 rounded-2xl shadow-lg flex flex-col gap-3">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-800 pb-2">Scholarship Compliance</h3>
              <div className="p-3 bg-[#071126] border border-slate-800 rounded-xl text-xs flex flex-col gap-2.5">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Scholarship Value:</span>
                  <span className="font-bold text-white font-mono">$15,000 / yr</span>
                </div>
                <div className="flex justify-between items-center text-[10px] border-t border-slate-800/60 pt-2">
                  <span className="text-slate-400">Required GPA Target:</span>
                  <span className="font-bold text-emerald-400">3.00 (Current: 3.42)</span>
                </div>
                <div className="flex justify-between items-center text-[10px]">
                  <span className="text-slate-400">Practice Attendance:</span>
                  <span className="font-bold text-emerald-400">95% (Req: 90%)</span>
                </div>
                <div className="flex justify-between items-center text-[10px]">
                  <span className="text-slate-400">Scholarship Status:</span>
                  <span className="px-2 py-0.5 bg-emerald-500/15 text-emerald-400 rounded-full font-bold">Compliant</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Parent Tab */}
      {currentTab === 'parent' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in">
          {/* Child tracking card */}
          <div className="md:col-span-2 card p-6 bg-[#102043] border border-slate-800 rounded-2xl shadow-lg flex flex-col gap-4">
            <h2 className="text-md font-bold text-white pb-3 border-b border-slate-800 flex items-center gap-2 mb-2">
              <Users className="w-5 h-5 text-indigo-400" />
              Athlete Progress Dashboard
            </h2>
            <div className="p-4 bg-[#071126] border border-slate-800 rounded-xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150" alt="Athlete" className="w-12 h-12 rounded-full object-cover border border-slate-700" />
                <div>
                  <h4 className="font-semibold text-white">Aria Nakamura</h4>
                  <span className="text-[10px] text-slate-400 block mt-0.5">Basketball • CampusX Titans Captain</span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-[9px] text-slate-400 uppercase tracking-widest block">Ranking Index</span>
                <span className="text-lg font-bold font-mono text-indigo-400 mt-1 block">#1 Varsity</span>
              </div>
            </div>

            {/* Performance charts */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 mt-2">
              <div className="p-4.5 bg-[#071126]/40 border border-slate-800/80 rounded-xl text-center">
                <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">Average Points</span>
                <span className="text-xl font-bold font-mono text-white mt-1.5 block">16.8 pts</span>
              </div>
              <div className="p-4.5 bg-[#071126]/40 border border-slate-800/80 rounded-xl text-center">
                <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">Average Assists</span>
                <span className="text-xl font-bold font-mono text-white mt-1.5 block">6.2 ast</span>
              </div>
              <div className="p-4.5 bg-[#071126]/40 border border-slate-800/80 rounded-xl text-center">
                <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">Injury Status</span>
                <span className="text-xl font-bold font-mono text-emerald-400 mt-1.5 block">Cleared</span>
              </div>
            </div>
          </div>

          {/* Matches calendar & scholarship status check */}
          <div className="flex flex-col gap-6">
            <div className="card p-5 bg-[#102043] border border-slate-800 rounded-2xl shadow-lg flex flex-col gap-3">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-800 pb-2">Upcoming Match Schedule</h3>
              <div className="flex flex-col gap-2.5">
                <div className="p-3 bg-[#071126] border border-slate-800 rounded-xl text-xs">
                  <div className="font-semibold text-white">CampusX Titans vs Metro Wolves</div>
                  <div className="text-[9.5px] text-slate-500 mt-1 font-mono">June 15, 2026 • 18:00</div>
                  <div className="text-[9.5px] text-slate-400 mt-1.5">Venue: Varsity Court A</div>
                </div>
                <div className="p-3 bg-[#071126] border border-slate-800 rounded-xl text-xs">
                  <div className="font-semibold text-white">CampusX Titans vs Coast Raiders</div>
                  <div className="text-[9.5px] text-slate-500 mt-1 font-mono">June 20, 2026 • 18:00</div>
                  <div className="text-[9.5px] text-slate-400 mt-1.5">Venue: Varsity Court A</div>
                </div>
              </div>
            </div>

            <div className="card p-5 bg-[#102043] border border-slate-800 rounded-2xl shadow-lg flex flex-col gap-3">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-800 pb-2">Scholarship Security Metrics</h3>
              <div className="p-3.5 bg-[#071126] border border-slate-800 rounded-xl text-xs flex flex-col gap-2 font-semibold">
                <div className="flex justify-between">
                  <span className="text-slate-400 text-[10px]">Academic Requirement:</span>
                  <span className="text-emerald-400 text-[10px]">GPA 3.42 / 3.00 (Pass)</span>
                </div>
                <div className="flex justify-between border-t border-slate-800/60 pt-2">
                  <span className="text-slate-400 text-[10px]">Athletic Requirement:</span>
                  <span className="text-emerald-400 text-[10px]">95% / 90% (Pass)</span>
                </div>
                <div className="flex justify-between border-t border-slate-800/60 pt-2 text-[10px]">
                  <span className="text-slate-400">Renewal Status:</span>
                  <span className="text-indigo-400">Approved for Fall 2026</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sub-sections tabs (Rendered if slug matches athletes, teams, tournaments, matches, training, fitness, attendance, analytics, scouting, scholarships, facilities, live, ai-coach, settings, sports-catalog, events, reports) */}
      
      {/* 1. Athletes Tab */}
      {currentTab === 'athletes' && (
        <div className="card p-6 bg-[#102043] border border-slate-800 rounded-2xl shadow-lg animate-fade-in">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-3 border-b border-slate-800 mb-6">
            <h2 className="text-md font-bold text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-indigo-400" />
              Athlete Management Database
            </h2>
            {isDirector && (
              <form onSubmit={handleAddAthlete} className="flex flex-wrap gap-2 w-full md:w-auto">
                <input 
                  type="text" 
                  placeholder="Athlete Name" 
                  value={newAthlete.name}
                  onChange={(e) => setNewAthlete({ ...newAthlete, name: e.target.value })}
                  className="bg-[#071126] border border-slate-800 text-xs text-white rounded-lg px-3 py-1.5 outline-none"
                  required
                />
                <input 
                  type="email" 
                  placeholder="Athlete Email" 
                  value={newAthlete.email}
                  onChange={(e) => setNewAthlete({ ...newAthlete, email: e.target.value })}
                  className="bg-[#071126] border border-slate-800 text-xs text-white rounded-lg px-3 py-1.5 outline-none"
                  required
                />
                <button 
                  type="submit"
                  className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold cursor-pointer shadow-md"
                >
                  Add Athlete
                </button>
              </form>
            )}
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-bold uppercase tracking-wider">
                  <th className="p-3">Athlete</th>
                  <th className="p-3">Email</th>
                  <th className="p-3">Clearance / Status</th>
                  <th className="p-3">Medical Log</th>
                  <th className="p-3">Performance Index</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {athletes.map(a => (
                  <tr key={a.id} className="border-b border-slate-800/40 hover:bg-slate-800/10 text-white font-semibold">
                    <td className="p-3 flex items-center gap-2">
                      <img src={a.user_avatar} alt="Avatar" className="w-8 h-8 rounded-full object-cover" />
                      <div>
                        <div>{a.user_name}</div>
                        <span className="text-[10px] text-slate-400 font-medium">Rank #{a.ranking}</span>
                      </div>
                    </td>
                    <td className="p-3 font-mono text-slate-400">{a.user_email}</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${a.status === 'Active' ? 'bg-emerald-500/15 text-emerald-400' : 'bg-rose-500/15 text-rose-400'}`}>
                        {a.status}
                      </span>
                    </td>
                    <td className="p-3 text-slate-300 max-w-xs truncate">{a.medical_records}</td>
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden w-20">
                          <div className="bg-indigo-500 h-full" style={{ width: `${a.fitness_scores?.vo2_max || 50}%` }}></div>
                        </div>
                        <span className="font-mono text-[10px]">{a.fitness_scores?.vo2_max || 50} VO2</span>
                      </div>
                    </td>
                    <td className="p-3 text-right">
                      <button 
                        onClick={() => handleIssueCredential(a.user_name, 'Varsity Certification')}
                        className="px-2 py-1 bg-indigo-500/10 hover:bg-indigo-500 hover:text-white text-indigo-400 text-[9px] font-bold rounded-lg border border-indigo-500/20 cursor-pointer"
                      >
                        Issue SBT
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 2. Teams Tab */}
      {currentTab === 'teams' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in">
          {/* Teams list */}
          <div className="md:col-span-2 card p-6 bg-[#102043] border border-slate-800 rounded-2xl shadow-lg">
            <h2 className="text-md font-bold text-white pb-3 border-b border-slate-800 flex items-center gap-2 mb-4">
              <Activity className="w-5 h-5 text-indigo-400" />
              Active Squad Rosters
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {teams.map(t => (
                <div key={t.id} className="p-4 bg-[#071126] border border-slate-800 rounded-xl flex flex-col justify-between text-xs gap-3">
                  <div>
                    <h3 className="text-sm font-bold text-white">{t.name}</h3>
                    <span className="text-[10px] text-slate-400 block mt-0.5">{t.sport}</span>
                  </div>
                  <div className="border-t border-slate-800/80 pt-2 flex flex-col gap-1 text-[10px] text-slate-400 font-semibold">
                    <div>Roster: {t.roster.join(', ')}</div>
                    <div className="mt-1">Captain: {t.captain_id || 'TBD'}</div>
                  </div>
                  <div className="flex justify-between items-center mt-2.5">
                    <span className="font-mono text-emerald-400 font-bold">Win Rate: {t.stats.win_rate || '0%'}</span>
                    <button 
                      onClick={() => {
                        const cap = prompt(`Assign new Captain ID for ${t.name}:`);
                        if (cap) alert(`Captain updated.`);
                      }}
                      className="px-2 py-1 bg-indigo-500/10 hover:bg-indigo-600 text-indigo-400 hover:text-white rounded-md text-[9px] font-bold cursor-pointer transition-colors"
                    >
                      Assign Captain
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Create Team Form */}
          <div className="card p-6 bg-[#102043] border border-slate-800 rounded-2xl shadow-lg flex flex-col gap-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-800 pb-2">Register New Varsity Squad</h3>
            <form onSubmit={handleCreateTeam} className="flex flex-col gap-3.5 text-xs">
              <div>
                <label className="text-slate-400 mb-1 block">Team Name</label>
                <input 
                  type="text" 
                  value={newTeam.name}
                  onChange={(e) => setNewTeam({ ...newTeam, name: e.target.value })}
                  placeholder="e.g. CampusX Archers"
                  className="w-full bg-[#071126] border border-slate-800 focus:border-indigo-500 rounded-xl p-2.5 text-white outline-none"
                  required
                />
              </div>
              <div>
                <label className="text-slate-400 mb-1 block">Sport Discipline</label>
                <select 
                  value={newTeam.sport}
                  onChange={(e) => setNewTeam({ ...newTeam, sport: e.target.value })}
                  className="w-full bg-[#071126] border border-slate-800 rounded-xl p-2.5 text-white outline-none"
                >
                  <option value="Football">Football</option>
                  <option value="Basketball">Basketball</option>
                  <option value="Volleyball">Volleyball</option>
                  <option value="Badminton">Badminton</option>
                  <option value="Tennis">Tennis</option>
                  <option value="Esports">Esports</option>
                </select>
              </div>
              <button 
                type="submit"
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-semibold cursor-pointer transition-colors mt-2"
              >
                Register Squad
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 3. Tournaments Tab */}
      {currentTab === 'tournaments' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in">
          <div className="md:col-span-2 card p-6 bg-[#102043] border border-slate-800 rounded-2xl shadow-lg flex flex-col gap-4">
            <h2 className="text-md font-bold text-white pb-3 border-b border-slate-800 flex items-center gap-2">
              <Trophy className="w-5 h-5 text-indigo-400" />
              Tournament Brackets & Standing Tables
            </h2>
            <div className="flex flex-col gap-3">
              {tournaments.map(t => (
                <div key={t.id} className="p-4 bg-[#071126] border border-slate-800 rounded-xl text-xs flex flex-col gap-2.5">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-bold text-white text-sm">{t.name}</h4>
                      <span className="text-[10px] text-slate-400">{t.sport} Championship</span>
                    </div>
                    <span className="px-2.5 py-0.5 bg-indigo-500/20 text-indigo-400 rounded-full font-bold uppercase">{t.status}</span>
                  </div>
                  
                  {/* Standing preview */}
                  {t.standings && t.standings.length > 0 && (
                    <div className="border-t border-slate-800/80 pt-2.5">
                      <span className="text-[10px] text-slate-500 font-bold block mb-1">Standings Leaderboard</span>
                      <div className="flex flex-col gap-1 font-semibold">
                        {t.standings.slice(0, 2).map((s, idx) => (
                          <div key={idx} className="flex justify-between text-[11px] text-slate-300">
                            <span>#{s.rank} {s.team}</span>
                            <span className="font-mono">{s.points} Pts</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="card p-6 bg-[#102043] border border-slate-800 rounded-2xl shadow-lg flex flex-col gap-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-800 pb-2">Register Tournament Bracket</h3>
            <form onSubmit={handleCreateTournament} className="flex flex-col gap-3.5 text-xs">
              <div>
                <label className="text-slate-400 mb-1 block">Bracket Title</label>
                <input 
                  type="text" 
                  value={newTournament.name}
                  onChange={(e) => setNewTournament({ ...newTournament, name: e.target.value })}
                  placeholder="e.g. Consortium Gold Cup"
                  className="w-full bg-[#071126] border border-slate-800 focus:border-indigo-500 rounded-xl p-2.5 text-white outline-none"
                  required
                />
              </div>
              <div>
                <label className="text-slate-400 mb-1 block">Sport Discipline</label>
                <select 
                  value={newTournament.sport}
                  onChange={(e) => setNewTournament({ ...newTournament, sport: e.target.value })}
                  className="w-full bg-[#071126] border border-slate-800 rounded-xl p-2.5 text-white outline-none"
                >
                  <option value="Football">Football</option>
                  <option value="Basketball">Basketball</option>
                  <option value="Tennis">Tennis</option>
                  <option value="Esports">Esports</option>
                </select>
              </div>
              <button 
                type="submit"
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-semibold cursor-pointer transition-colors mt-2"
              >
                Create Tournament Bracket
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 4. Matches Tab */}
      {currentTab === 'matches' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in">
          <div className="md:col-span-2 card p-6 bg-[#102043] border border-slate-800 rounded-2xl shadow-lg flex flex-col gap-4">
            <h2 className="text-md font-bold text-white pb-3 border-b border-slate-800 flex items-center gap-2">
              <Tv className="w-5 h-5 text-indigo-400" />
              Schedules & Highlights
            </h2>
            <div className="flex flex-col gap-3">
              {matches.map(m => (
                <div key={m.id} className="p-4.5 bg-[#071126] border border-slate-800 rounded-xl flex justify-between items-center text-xs">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white">{m.team_a} vs {m.team_b}</span>
                      <span className={`px-2 py-0.5 text-[9px] font-bold rounded-full uppercase ${m.status === 'Completed' ? 'bg-slate-800 text-slate-400' : 'bg-indigo-500/10 text-indigo-400'}`}>{m.status}</span>
                    </div>
                    <div className="text-[10px] text-slate-400 mt-1 font-mono">{m.schedule} • {m.venue}</div>
                  </div>
                  {m.status === 'Completed' && (
                    <span className="font-bold font-mono text-white text-sm bg-slate-800 px-2.5 py-1 rounded-lg">
                      {m.results?.score_a || 0} - {m.results?.score_b || 0}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="card p-6 bg-[#102043] border border-slate-800 rounded-2xl shadow-lg flex flex-col gap-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-800 pb-2">Schedule Match Play</h3>
            <form onSubmit={handleScheduleMatch} className="flex flex-col gap-3.5 text-xs">
              <div>
                <label className="text-slate-400 mb-1 block">Team A</label>
                <input 
                  type="text" 
                  value={newMatch.team_a}
                  onChange={(e) => setNewMatch({ ...newMatch, team_a: e.target.value })}
                  className="w-full bg-[#071126] border border-slate-800 focus:border-indigo-500 rounded-xl p-2.5 text-white outline-none"
                  required
                />
              </div>
              <div>
                <label className="text-slate-400 mb-1 block">Team B</label>
                <input 
                  type="text" 
                  value={newMatch.team_b}
                  onChange={(e) => setNewMatch({ ...newMatch, team_b: e.target.value })}
                  className="w-full bg-[#071126] border border-slate-800 focus:border-indigo-500 rounded-xl p-2.5 text-white outline-none"
                  required
                />
              </div>
              <div>
                <label className="text-slate-400 mb-1 block">Date & Time</label>
                <input 
                  type="text" 
                  value={newMatch.schedule}
                  onChange={(e) => setNewMatch({ ...newMatch, schedule: e.target.value })}
                  className="w-full bg-[#071126] border border-slate-800 focus:border-indigo-500 rounded-xl p-2.5 text-white outline-none"
                  required
                />
              </div>
              <div>
                <label className="text-slate-400 mb-1 block">Venue</label>
                <input 
                  type="text" 
                  value={newMatch.venue}
                  onChange={(e) => setNewMatch({ ...newMatch, venue: e.target.value })}
                  className="w-full bg-[#071126] border border-slate-800 focus:border-indigo-500 rounded-xl p-2.5 text-white outline-none"
                  required
                />
              </div>
              <button 
                type="submit"
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-semibold cursor-pointer transition-colors mt-2"
              >
                Schedule Fixture
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 5. Training Tab */}
      {currentTab === 'training' && (
        <div className="card p-6 bg-[#102043] border border-slate-800 rounded-2xl shadow-lg animate-fade-in flex flex-col gap-4">
          <h2 className="text-md font-bold text-white pb-3 border-b border-slate-800 flex items-center gap-2">
            <Clipboard className="w-5 h-5 text-indigo-400" />
            Active Varsity Training Schedules
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {training.map(t => (
              <div key={t.id} className="p-4 bg-[#071126] border border-slate-800 rounded-xl text-xs flex flex-col gap-2.5">
                <div className="flex justify-between items-center">
                  <h4 className="font-bold text-white text-sm">{t.title}</h4>
                  <span className="px-2.5 py-0.5 bg-indigo-500/10 text-indigo-400 rounded-full font-bold">{t.sport}</span>
                </div>
                <div className="flex flex-col gap-1 pt-2 border-t border-slate-800/80 text-[10px] text-slate-400 font-semibold">
                  <div>Drills: {t.plans.join(', ')}</div>
                  <div className="mt-1">Active Blocks: {t.fitness_programs.join(', ')}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 6. Fitness logs Tab */}
      {currentTab === 'fitness' && (
        <div className="card p-6 bg-[#102043] border border-slate-800 rounded-2xl shadow-lg animate-fade-in flex flex-col gap-4">
          <h2 className="text-md font-bold text-white pb-3 border-b border-slate-800 flex items-center gap-2">
            <Heart className="w-5 h-5 text-indigo-400" />
            Biometric & Fitness Logs (SBT Linked)
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {athletes.map(a => (
              <div key={a.id} className="p-4 bg-[#071126] border border-slate-800 rounded-xl text-xs flex flex-col gap-2">
                <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
                  <img src={a.user_avatar} alt="Avatar" className="w-7 h-7 rounded-full object-cover" />
                  <span className="font-bold text-white">{a.user_name}</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-[10px] text-slate-400 font-semibold pt-1">
                  <div>VO2 Max: <span className="text-white font-mono">{a.fitness_scores?.vo2_max || 50} ml/kg</span></div>
                  <div>BMI Index: <span className="text-white font-mono">{a.fitness_scores?.bmi || 22}</span></div>
                  <div>Endurance: <span className="text-white font-mono">{a.fitness_scores?.endurance || 80}%</span></div>
                  <div>Speed: <span className="text-white font-mono">{a.fitness_scores?.speed || 80}%</span></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 7. Attendance Tab */}
      {currentTab === 'attendance' && (
        <div className="card p-6 bg-[#102043] border border-slate-800 rounded-2xl shadow-lg animate-fade-in flex flex-col gap-4">
          <h2 className="text-md font-bold text-white pb-3 border-b border-slate-800 flex items-center gap-2">
            <CheckSquare className="w-5 h-5 text-indigo-400" />
            Practice Attendance Registers
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-bold uppercase tracking-wider">
                  <th className="p-3">Athlete</th>
                  <th className="p-3">Team Group</th>
                  <th className="p-3">Required Target</th>
                  <th className="p-3">Current Attendance Rate</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {athletes.map(a => (
                  <tr key={a.id} className="border-b border-slate-800/40 hover:bg-slate-800/10 text-white font-semibold">
                    <td className="p-3 flex items-center gap-2">
                      <img src={a.user_avatar} alt="Avatar" className="w-8 h-8 rounded-full object-cover" />
                      <span>{a.user_name}</span>
                    </td>
                    <td className="p-3 font-mono text-slate-400">CampusX Varsity</td>
                    <td className="p-3 font-mono">90% min</td>
                    <td className="p-3 text-emerald-400 font-mono">95%</td>
                    <td className="p-3 text-right">
                      <span className="text-emerald-400">✓ Compliance Checked</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 8. Performance Analytics Tab */}
      {currentTab === 'analytics' && (
        <div className="card p-6 bg-[#102043] border border-slate-800 rounded-2xl shadow-lg animate-fade-in flex flex-col gap-4">
          <h2 className="text-md font-bold text-white pb-3 border-b border-slate-800 flex items-center gap-2">
            <BarChart2 className="w-5 h-5 text-indigo-400" />
            TensorFlow Predictive Performance & Injury Models
          </h2>
          <div className="p-4 bg-[#071126] border border-slate-800 rounded-xl text-xs leading-relaxed text-slate-300 font-mono">
            <div>[Model Initialization] Tensor fitting epochs: 50...</div>
            <div className="text-emerald-400 mt-1">✓ Accuracy: 94.2% Classifications validated.</div>
            <div className="mt-4 text-white font-sans font-semibold">AI Observations & Actions:</div>
            <ul className="list-disc pl-5 mt-2 flex flex-col gap-2 text-slate-400 font-sans font-medium">
              <li>Athlete **Aria Nakamura** is trending at +12% cardio capacity. Recommended: Increase load threshold.</li>
              <li>Athlete **Alex Rivera** has logged elevated fatigue load. Injury Risk Probability: <span className="text-amber-400 font-bold">38% (Moderate)</span>. Recommended: Reduce sprints block.</li>
            </ul>
          </div>
        </div>
      )}

      {/* 9. Scouting Tab */}
      {currentTab === 'scouting' && (
        <div className="card p-6 bg-[#102043] border border-slate-800 rounded-2xl shadow-lg animate-fade-in flex flex-col gap-4">
          <h2 className="text-md font-bold text-white pb-3 border-b border-slate-800 flex items-center gap-2">
            <Search className="w-5 h-5 text-indigo-400" />
            Recruitment Board & Tryouts Pipeline
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {scouting.map(s => (
              <div key={s.id} className="p-4 bg-[#071126] border border-slate-800 rounded-xl text-xs flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <h4 className="font-bold text-white text-sm">{s.name}</h4>
                  <span className="px-2 py-0.5 bg-indigo-500/10 text-indigo-400 rounded-full font-bold">Potential: {s.potential_score}</span>
                </div>
                <div className="text-[10px] text-slate-400 mt-1">{s.sport} • Tryouts Metrics: {s.tryouts.join(', ')}</div>
                <div className="p-2.5 bg-[#102043]/30 border border-slate-800/80 rounded-lg text-[10px] text-indigo-300 italic mt-2">
                  {s.scouting_reports.join('\n')}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 10. Scholarships Tab */}
      {currentTab === 'scholarships' && (
        <div className="card p-6 bg-[#102043] border border-slate-800 rounded-2xl shadow-lg animate-fade-in flex flex-col gap-4">
          <h2 className="text-md font-bold text-white pb-3 border-b border-slate-800 flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-indigo-400" />
            Varsity Scholarship Disbursement Ledgers
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {scholarships.map(s => (
              <div key={s.id} className="p-4 bg-[#071126] border border-slate-800 rounded-xl text-xs flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-white text-sm">{s.athlete_name}</span>
                  <span className="px-2 py-0.5 bg-emerald-500/15 text-emerald-400 rounded-full font-bold">{s.status}</span>
                </div>
                <div className="flex justify-between items-center text-[10px] text-slate-400 pt-2 border-t border-slate-800/60 font-semibold">
                  <span>Funding: ${s.funding.toLocaleString()}</span>
                  <span>Compliance Checklist: {s.requirements.join(', ')}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 11. Facilities Tab */}
      {currentTab === 'facilities' && (
        <div className="card p-6 bg-[#102043] border border-slate-800 rounded-2xl shadow-lg animate-fade-in flex flex-col gap-4">
          <h2 className="text-md font-bold text-white pb-3 border-b border-slate-800 flex items-center gap-2">
            <Home className="w-5 h-5 text-indigo-400" />
            Facility Allocation & Bookings Calendar
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {facilities.map(f => (
              <div key={f.id} className="p-4 bg-[#071126] border border-slate-800 rounded-xl text-xs flex flex-col gap-2.5">
                <h4 className="font-bold text-white text-sm">{f.name}</h4>
                <span className="text-[10px] text-indigo-400 font-semibold uppercase">{f.type}</span>
                <div className="pt-2 border-t border-slate-800/80 flex justify-between items-center text-[10px] text-slate-400 font-semibold">
                  <span>Utilization: {f.utilization?.rate || 0}%</span>
                  <span>Hours Booked: {f.utilization?.hours_booked || 0} hrs</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 12. Live Scores Tab */}
      {currentTab === 'live' && (
        <div className="flex flex-col gap-6 animate-fade-in">
          {/* Active Live Broadcasts Panel */}
          <div className="card p-6 bg-[#102043] border border-slate-800 rounded-2xl shadow-lg flex flex-col gap-4">
            <h2 className="text-md font-bold text-white pb-3 border-b border-slate-800 flex items-center gap-2">
              <Tv className="w-5 h-5 text-rose-500 animate-pulse" />
              Active Live Broadcasts
            </h2>
            
            {matches.filter(m => m.status === 'Live').length === 0 ? (
              <div className="p-4 bg-[#071126] border border-slate-800 rounded-xl text-center text-xs text-slate-500">
                No active live streams at the moment. Try starting a broadcast from the Live Stream Studio or schedule a match status as "Live".
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {matches.filter(m => m.status === 'Live').map(m => (
                  <div key={m.id} className="p-4 bg-[#071126] border border-rose-500/30 rounded-xl flex items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-white">{m.team_a} vs {m.team_b}</span>
                        <span className="px-2 py-0.5 text-[8px] font-bold rounded-full bg-rose-500/20 text-rose-400 animate-pulse uppercase">LIVE</span>
                      </div>
                      <span className="text-[10px] text-slate-400 block mt-1 font-mono">{m.venue}</span>
                    </div>
                    <button 
                      onClick={() => router.push(`/sports/live/watch/${m.id}`)}
                      className="px-4 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-lg shadow-rose-600/20"
                    >
                      Watch Stream
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Standard Simulator and Matches list */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 card p-6 bg-[#102043] border border-slate-800 rounded-2xl shadow-lg flex flex-col gap-4">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-800 pb-2">Ongoing & Scheduled Matches</h3>
              <div className="flex flex-col gap-3">
                {matches.map(m => (
                  <div key={m.id} className="p-4 bg-[#071126] border border-slate-800 rounded-xl flex justify-between items-center text-xs">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white">{m.team_a} vs {m.team_b}</span>
                        <span className={`px-2 py-0.5 text-[9px] font-bold rounded-full uppercase ${m.status === 'Completed' ? 'bg-slate-800 text-slate-400' : (m.status === 'Live' ? 'bg-rose-500/20 text-rose-400 animate-pulse' : 'bg-indigo-500/10 text-indigo-400')}`}>{m.status}</span>
                      </div>
                      <div className="text-[10px] text-slate-400 mt-1 font-mono">{m.schedule} • {m.venue}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      {m.status === 'Live' && (
                        <button 
                          onClick={() => router.push(`/sports/live/watch/${m.id}`)}
                          className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-[10px] font-bold cursor-pointer transition-colors shadow-lg shadow-rose-600/20"
                        >
                          Watch Live
                        </button>
                      )}
                      {m.status === 'Completed' && (
                        <span className="font-bold font-mono text-white text-sm bg-slate-800 px-2.5 py-1 rounded-lg">
                          {m.results?.score_a || 0} - {m.results?.score_b || 0}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="card p-6 bg-[#102043] border border-slate-800 rounded-2xl shadow-lg flex flex-col gap-4 h-fit">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-800 pb-2">Simulate Match Ticker</h3>
              <div className="flex flex-col gap-2">
                <span className="text-[11px] text-slate-400 leading-relaxed block mb-2">Simulate live text ticker stream for active match play logs.</span>
                <button 
                  onClick={() => {
                    const liveMatch = matches.find(m => m.status === 'Live') || matches[0];
                    if (liveMatch) startLiveSimulation(liveMatch);
                  }}
                  className="w-full py-2.5 bg-rose-500 hover:bg-rose-600 text-white rounded-xl text-xs font-semibold cursor-pointer shadow-lg shadow-rose-500/20 transition-colors"
                >
                  Trigger Live Play Ticker
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 13. AI Coach Tab */}
      {currentTab === 'ai-coach' && (
        <div className="card p-6 bg-[#102043] border border-slate-800 rounded-2xl shadow-lg animate-fade-in flex flex-col gap-4">
          <h2 className="text-md font-bold text-white pb-3 border-b border-slate-800 flex items-center gap-2">
            <Bot className="w-5 h-5 text-indigo-400" />
            AI Coach Coordinator (Nutrition / Drills)
          </h2>
          <div className="flex flex-col gap-4">
            <textarea 
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
              className="w-full h-24 bg-[#071126] border border-slate-800 focus:border-indigo-500 rounded-xl p-4 text-xs text-white outline-none resize-none"
            />
            <button 
              onClick={handleAskAICoach}
              disabled={aiLoading}
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {aiLoading ? 'Fitting AI parameters...' : 'Synthesize Training Recommendations'}
            </button>
            {aiResponse && (
              <div className="p-4 bg-[#071126] border border-slate-800 rounded-xl text-xs leading-relaxed text-slate-300 whitespace-pre-line font-medium">
                {aiResponse}
              </div>
            )}
          </div>
        </div>
      )}

      {/* 14. Sports Catalog Tab */}
      {currentTab === 'sports-catalog' && (
        <div className="card p-6 bg-[#102043] border border-slate-800 rounded-2xl shadow-lg animate-fade-in flex flex-col gap-4">
          <h2 className="text-md font-bold text-white pb-3 border-b border-slate-800 flex items-center gap-2">
            <Award className="w-5 h-5 text-indigo-400" />
            Varsity Sports Catalog
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {['Football', 'Cricket', 'Basketball', 'Volleyball', 'Badminton', 'Tennis', 'Swimming', 'Athletics', 'Esports'].map(sport => (
              <div key={sport} className="p-4 bg-[#071126] border border-slate-800 rounded-xl text-center font-bold text-white hover:border-indigo-500/40 cursor-pointer transition-colors">
                <span className="text-xs">{sport}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 15. Events Tab */}
      {currentTab === 'events' && (
        <div className="card p-6 bg-[#102043] border border-slate-800 rounded-2xl shadow-lg animate-fade-in flex flex-col gap-4">
          <h2 className="text-md font-bold text-white pb-3 border-b border-slate-800 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-indigo-400" />
            Varsity Sports Events Calendars
          </h2>
          <div className="flex flex-col gap-3">
            <div className="p-4 bg-[#071126] border border-slate-800 rounded-xl text-xs flex justify-between items-center">
              <div>
                <span className="font-bold text-white">Consortium Trials 2026</span>
                <span className="text-[10px] text-slate-400 block mt-1">June 18, 2026 • CampusX Athletics Arena</span>
              </div>
              <span className="text-indigo-400 font-mono font-bold">Upcoming</span>
            </div>
            <div className="p-4 bg-[#071126] border border-slate-800 rounded-xl text-xs flex justify-between items-center">
              <div>
                <span className="font-bold text-white">Annual Sports Awards Banquet</span>
                <span className="text-[10px] text-slate-400 block mt-1">June 30, 2026 • Grand Hall</span>
              </div>
              <span className="text-indigo-400 font-mono font-bold">Scheduled</span>
            </div>
          </div>
        </div>
      )}

      {/* 16. Reports Tab */}
      {currentTab === 'reports' && (
        <div className="card p-6 bg-[#102043] border border-slate-800 rounded-2xl shadow-lg animate-fade-in flex flex-col gap-4 text-center">
          <h2 className="text-md font-bold text-white pb-3 border-b border-slate-800 flex items-center gap-2 text-left">
            <FileText className="w-5 h-5 text-indigo-400" />
            Sports Performance Analytics Compiler
          </h2>
          <div className="p-8 bg-[#071126]/60 border border-slate-800 rounded-xl max-w-sm mx-auto flex flex-col gap-4">
            <span className="text-xs text-slate-400 font-medium">Export all biometrics, roster compliance ratios, and blockchain SBT proofs to a unified report.</span>
            <button 
              onClick={() => alert('Generating sports summaries... Report downloaded successfully.')}
              className="py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold cursor-pointer shadow-lg transition-all"
            >
              Compile & Export PDF
            </button>
          </div>
        </div>
      )}

      {/* 17. Settings Tab */}
      {currentTab === 'settings' && (
        <div className="card p-6 bg-[#102043] border border-slate-800 rounded-2xl shadow-lg animate-fade-in flex flex-col gap-4">
          <h2 className="text-md font-bold text-white pb-3 border-b border-slate-800 flex items-center gap-2">
            <Settings className="w-5 h-5 text-indigo-400" />
            Sports OS Configurations
          </h2>
          <div className="flex flex-col gap-4 text-xs font-semibold max-w-md">
            <div className="flex justify-between items-center p-3 bg-[#071126] border border-slate-800 rounded-xl">
              <span className="text-slate-300">Wearable Fitbit Integration:</span>
              <span className="text-emerald-400">✓ Connected</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-[#071126] border border-slate-800 rounded-xl">
              <span className="text-slate-300">Consortium Ledger Node Status:</span>
              <span className="text-emerald-400">✓ Active</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-[#071126] border border-slate-800 rounded-xl">
              <span className="text-slate-300">Predictive RAG Context Sync:</span>
              <span className="text-emerald-400">✓ Synchronized</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
