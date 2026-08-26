'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useDb } from '../../context/db-context';

export default function FinancePage() {
  const {
    students,
    transactions,
    addTransaction,
    updateStudent
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

  // Admin page states
  const [showPayModal, setShowPayModal] = useState(false);
  const [payStudentId, setPayStudentId] = useState('');
  const [payAmount, setPayAmount] = useState(1000);
  const [payMethod, setPayMethod] = useState('Stripe');

  // Student page states
  const [studentPayAmount, setStudentPayAmount] = useState(1000);
  const [studentPayMethod, setStudentPayMethod] = useState('Stripe Card');

  // TF Admin projection states
  const [lr, setLr] = useState(0.05);
  const [epochs, setEpochs] = useState(150);
  const [horizon, setHorizon] = useState(2);
  const [tfTraining, setTfTraining] = useState(false);
  const [tfProgress, setTfProgress] = useState(0);
  const [tfEpochDisp, setTfEpochDisp] = useState('0/150');
  const [tfLossDisp, setTfLossDisp] = useState('0.000000');
  const [tfStatus, setTfStatus] = useState('Untrained');
  const [tfEquation, setTfEquation] = useState('y = mx + c');

  // TF Student default states
  const [studentDelayPct, setStudentDelayPct] = useState('Calculating...');
  const [studentDelayStatus, setStudentDelayStatus] = useState('Low Risk');
  const [studentDelayClass, setStudentDelayClass] = useState('bg-brand-accent-emerald/20 text-brand-accent-emerald');
  const [studentDelayDate, setStudentDelayDate] = useState('On time');

  // Chart refs
  const forecastChartRef = useRef(null);
  const canvasRef = useRef(null);

  // Fetch Session User
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const session = sessionStorage.getItem('campusx_erp_session');
      if (session) {
        setCurrentUser(JSON.parse(session));
      } else {
        // Fallback admin for testing
        setCurrentUser({ name: 'Dr. Evelyn Sterling', role: 'admin' });
      }
    }
  }, []);

  // Set default student select on load
  useEffect(() => {
    if (students.length > 0 && !payStudentId) {
      setPayStudentId(students[0].id);
    }
  }, [students]);

  // Admin KPI metrics
  const totalDue = students.reduce((acc, curr) => acc + (curr.feeTotal - curr.feePaid), 0);
  const collected = transactions.reduce((acc, curr) => acc + curr.amount, 0);
  const overdueCount = students.filter(s => (s.feeTotal - s.feePaid) > 2000).length;

  // Resolve current student details (student view)
  const resolvedStudent = students.find(s => s.email.toLowerCase() === currentUser?.email?.toLowerCase()) || {
    id: 'STU038',
    name: currentUser?.name || 'Aria Nakamura',
    email: currentUser?.email || 'student@campusx.edu',
    dept: 'CS',
    gpa: 3.75,
    semester: 4,
    feeTotal: 4500,
    feePaid: 3500,
    avatar: currentUser?.avatar || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150",
    attendance: 95,
    courses: ['CS101', 'CS202']
  };
  const outstanding = resolvedStudent.feeTotal - resolvedStudent.feePaid;
  const clearanceProgress = Math.min((resolvedStudent.feePaid / resolvedStudent.feeTotal) * 100, 100);
  const studentTransactions = transactions.filter(t => t.studentId === resolvedStudent.id);

  // Initialize Admin Forecast Chart
  useEffect(() => {
    if (typeof window === 'undefined' || !window.Chart || !canvasRef.current || currentUser?.role === 'student') return;
    const Chart = window.Chart;

    if (forecastChartRef.current) forecastChartRef.current.destroy();

    const historicalLabels = ['2022-A', '2022-B', '2023-A', '2023-B', '2024-A', '2024-B', '2025-A', '2025-B', '2026-A'];
    const historicalData = [65000, 72000, 78000, 85000, 92000, 102000, 108000, 118000, collected];

    forecastChartRef.current = new Chart(canvasRef.current, {
      type: 'line',
      data: {
        labels: historicalLabels,
        datasets: [
          {
            label: 'Historical Revenue ($)',
            data: historicalData,
            borderColor: 'rgba(16, 185, 129, 0.4)',
            backgroundColor: 'transparent',
            pointBackgroundColor: '#10b981',
            pointRadius: 6,
            borderWidth: 2,
            showLine: true
          },
          {
            label: 'Model Fit & Prediction',
            data: [],
            borderColor: '#f59e0b',
            backgroundColor: 'transparent',
            borderWidth: 3,
            borderDash: [5, 5],
            pointRadius: 0
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true,
            labels: { color: '#94a3b8' }
          }
        },
        scales: {
          y: {
            grid: { color: 'rgba(255, 255, 255, 0.05)' },
            ticks: { color: '#94a3b8' }
          },
          x: {
            grid: { display: false },
            ticks: { color: '#94a3b8' }
          }
        }
      }
    });

    return () => {
      if (forecastChartRef.current) forecastChartRef.current.destroy();
    };
  }, [currentUser, collected]);

  // Run TensorFlow Student Default Risk Predictor
  const runFinanceTfInference = async (student, outBalance) => {
    if (typeof window === 'undefined' || !window.tf) {
      setStudentDelayPct('TF Unavailable');
      return;
    }

    try {
      const tf = window.tf;
      const inputVal = [outBalance / (student.feeTotal || 5000), student.gpa / 4.0, student.attendance / 100.0];

      const model = tf.sequential();
      model.add(tf.layers.dense({ units: 3, activation: 'tanh', inputShape: [3] }));
      model.add(tf.layers.dense({ units: 1, activation: 'sigmoid' }));

      const w1 = tf.tensor2d([
        [1.5],
        [-0.5],
        [-0.8]
      ]);
      const b1 = tf.tensor1d([0.1]);
      model.layers[1].setWeights([w1, b1]);

      const inputTensor = tf.tensor2d([inputVal], [1, 3]);
      const outputTensor = model.predict(inputTensor);
      const outputVal = (await outputTensor.data())[0];

      let delayProb = outputVal;
      if (outBalance === 0) {
        delayProb = 0.0;
      }

      setStudentDelayPct((delayProb * 100).toFixed(1) + '%');

      if (delayProb > 0.4) {
        setStudentDelayStatus('Elevated Default Risk');
        setStudentDelayClass('bg-brand-accent-ruby/20 text-brand-accent-ruby');
        setStudentDelayDate('Delayed (> 30 days)');
      } else if (delayProb > 0.1) {
        setStudentDelayStatus('Grace Period Predict');
        setStudentDelayClass('bg-brand-accent-amber/20 text-brand-accent-amber');
        setStudentDelayDate('Within 15 days');
      } else {
        setStudentDelayStatus('Low Risk Statement');
        setStudentDelayClass('bg-brand-accent-emerald/20 text-brand-accent-emerald');
        setStudentDelayDate('On time');
      }

      inputTensor.dispose();
      outputTensor.dispose();
      w1.dispose();
      b1.dispose();
      model.dispose();
    } catch (err) {
      console.error('TF Student finance inference failed:', err);
    }
  };

  useEffect(() => {
    if (currentUser?.role === 'student' && resolvedStudent) {
      runFinanceTfInference(resolvedStudent, outstanding);
    }
  }, [currentUser, resolvedStudent, outstanding]);

  // Run Revenue TF Training (Admin View)
  const runRevenueTfTraining = async () => {
    if (tfTraining) return;
    if (typeof window === 'undefined' || !window.tf) {
      alert('TensorFlow.js is currently loading or unavailable.');
      return;
    }

    setTfTraining(true);
    setTfStatus('Training...');
    setTfProgress(0);

    const tf = window.tf;
    const xVal = [0, 1, 2, 3, 4, 5, 6, 7, 8];
    const yVal = [65000, 72000, 78000, 85000, 92000, 102000, 108000, 118000, collected];

    // Normalize: X / 8, Y / 150000
    const xs = tf.tensor2d(xVal.map(x => x / 8), [9, 1]);
    const ys = tf.tensor2d(yVal.map(y => y / 150000), [9, 1]);

    const model = tf.sequential();
    model.add(tf.layers.dense({ units: 1, inputShape: [1] }));

    model.compile({
      optimizer: tf.train.adam(lr),
      loss: 'meanSquaredError'
    });

    try {
      await model.fit(xs, ys, {
        epochs: epochs,
        callbacks: {
          onEpochEnd: (epoch, logs) => {
            const progress = ((epoch + 1) / epochs) * 100;
            setTfProgress(progress);
            setTfEpochDisp(`${epoch + 1}/${epochs}`);
            setTfLossDisp(logs.loss.toFixed(6));
          }
        }
      });

      const weights = model.layers[0].getWeights();
      const w = weights[0].dataSync()[0];
      const b = weights[1].dataSync()[0];

      // De-normalize: y = (150000 * w / 8) * x + 150000 * b
      const m = (150000 * w) / 8;
      const c = 150000 * b;

      setTfStatus('Trained successfully');
      setTfEquation(`y = ${m.toFixed(2)}x + ${c.toFixed(2)}`);

      // Generate projection data labels
      const totalTerms = 9 + horizon;
      const allLabels = ['2022-A', '2022-B', '2023-A', '2023-B', '2024-A', '2024-B', '2025-A', '2025-B', '2026-A'];
      const years = [2026, 2027, 2028];
      let currentYearIndex = 0;
      let currentTermLetter = 'B';
      for (let i = 0; i < horizon; i++) {
        allLabels.push(`${years[currentYearIndex]}-${currentTermLetter}`);
        if (currentTermLetter === 'B') {
          currentTermLetter = 'A';
          currentYearIndex++;
        } else {
          currentTermLetter = 'B';
        }
      }

      const fitAndPredictData = [];
      for (let i = 0; i < totalTerms; i++) {
        const val = m * i + c;
        fitAndPredictData.push(Math.round(val));
      }

      if (forecastChartRef.current) {
        forecastChartRef.current.data.labels = allLabels;
        const paddedHistorical = [...yVal];
        while (paddedHistorical.length < totalTerms) {
          paddedHistorical.push(null);
        }
        forecastChartRef.current.data.datasets[0].data = paddedHistorical;
        forecastChartRef.current.data.datasets[1].data = fitAndPredictData;
        forecastChartRef.current.update();
      }

    } catch (err) {
      console.error('Revenue training failed:', err);
      alert('Error: ' + err.message);
    } finally {
      xs.dispose();
      ys.dispose();
      model.dispose();
      setTfTraining(false);
    }
  };

  // Submit Admin payment record
  const submitAdminPayment = () => {
    const amt = parseInt(payAmount);
    if (isNaN(amt) || amt <= 0) {
      alert("Please enter a valid billing transaction amount.");
      return;
    }

    const targetStudent = students.find(s => s.id === payStudentId);
    if (!targetStudent) {
      alert("Student record validation failed.");
      return;
    }

    const txId = 'TXN' + Math.floor(1000 + Math.random() * 9000);
    const today = new Date().toISOString().split('T')[0];

    const txn = {
      txId: txId,
      studentId: payStudentId,
      studentName: targetStudent.name,
      amount: amt,
      date: today,
      status: 'Paid',
      method: payMethod
    };

    addTransaction(txn);
    updateStudent(payStudentId, { feePaid: Math.min(targetStudent.feeTotal, targetStudent.feePaid + amt) });

    setShowPayModal(false);
    alert(`Payment of $${amt} logged successfully for ${targetStudent.name}.\nReceipt Reference ID: ${txId}`);
  };

  // Submit student self payment
  const submitStudentPayment = () => {
    const amt = parseInt(studentPayAmount);
    if (isNaN(amt) || amt <= 0 || amt > outstanding) {
      alert(`Please enter a valid amount between $1 and $${outstanding}.`);
      return;
    }

    const txId = 'TXN' + Math.floor(1000 + Math.random() * 9000);
    const today = new Date().toISOString().split('T')[0];

    const txn = {
      txId: txId,
      studentId: resolvedStudent.id,
      studentName: resolvedStudent.name,
      amount: amt,
      date: today,
      status: 'Paid',
      method: studentPayMethod
    };

    addTransaction(txn);
    updateStudent(resolvedStudent.id, { feePaid: Math.min(resolvedStudent.feeTotal, resolvedStudent.feePaid + amt) });

    alert(`✅ Payment of $${amt} processed successfully!\nTransaction ID: ${txId}`);
  };

  if (!currentUser) return <div className="text-center text-brand-text-muted p-8">Loading finance console...</div>;

  if (currentUser.role === 'faculty') {
    return (
      <div className="card p-8 text-center bg-brand-bg-secondary border border-brand-border rounded-2xl animate-fade-in my-12">
        <div className="w-16 h-16 bg-brand-accent-ruby/10 text-brand-accent-ruby rounded-full flex items-center justify-center mx-auto mb-4 border border-brand-accent-ruby/20">
          <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
        </div>
        <h2 className="text-xl font-display font-bold text-brand-text-main">Access Denied</h2>
        <p className="text-brand-text-muted text-sm mt-2 max-w-md mx-auto">You do not have the required credentials to access the finance and tuition portal.</p>
        <Link className="btn btn-secondary mt-6 cursor-pointer" href="/">Return to Home Portal</Link>
      </div>
    );
  }

  const isStudent = currentUser.role === 'student';

  return (
    <div className="flex flex-col gap-6 md:gap-8">
      {/* HEADER */}
      <div className="page-header animate-fade-in flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-display font-bold text-brand-text-main">
            {isStudent ? 'My Student Fee Statement' : 'Finance & Collections'}
          </h1>
          <p className="text-brand-text-muted mt-1 text-sm">
            {isStudent 
              ? 'Verify outstanding tuition dues, download invoices, and execute simulated payments.' 
              : 'Track scholarship distribution, audit recent transactions, check student balances, and issue invoices.'
            }
          </p>
        </div>
        {!isStudent && (
          <button className="btn btn-primary cursor-pointer flex items-center gap-2" onClick={() => setShowPayModal(true)}>
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="4" width="20" height="16" rx="2" ry="2"/><line x1="12" y1="1" x2="12" y2="23"/><line x1="2" y1="10" x2="22" y2="10"/></svg>
            Record Fee Payment
          </button>
        )}
      </div>

      {/* STUDENT VIEW */}
      {isStudent && resolvedStudent && (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fade-in">
            {/* Student dues card */}
            <div className="card p-6 bg-brand-bg-secondary border border-brand-border rounded-2xl flex flex-col gap-5">
              <div className="flex items-center gap-4 border-b border-brand-border pb-4">
                <img src={resolvedStudent.avatar} className="w-16 h-16 rounded-full object-cover border border-brand-border" alt="" />
                <div>
                  <h3 className="m-0 font-display text-lg font-bold text-brand-text-main">{resolvedStudent.name}</h3>
                  <span className="text-xs text-brand-text-muted">Student ID: <code className="text-brand-primary">{resolvedStudent.id}</code> | Dept: {resolvedStudent.dept}</span>
                </div>
              </div>
              
              <div className="flex flex-col gap-3 text-sm text-brand-text-muted">
                <div className="flex justify-between">
                  <span>Registration Semester:</span>
                  <strong className="text-brand-text-main">Semester {resolvedStudent.semester}</strong>
                </div>
                <div className="flex justify-between">
                  <span>Academic Scholarship:</span>
                  <strong className="text-brand-accent-cyan">{resolvedStudent.scholarship || 'None'}</strong>
                </div>
                <div className="flex justify-between border-t border-brand-border/40 pt-3">
                  <span>Total Semester Tuition Fee:</span>
                  <strong className="text-brand-text-main">${resolvedStudent.feeTotal.toLocaleString()}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-brand-accent-emerald">Total Fee Paid:</span>
                  <strong className="text-brand-accent-emerald">${resolvedStudent.feePaid.toLocaleString()}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-brand-accent-ruby">Outstanding Balance:</span>
                  <strong className="text-brand-accent-ruby">${outstanding.toLocaleString()}</strong>
                </div>
              </div>

              {/* Progress bar */}
              <div>
                <div className="flex justify-between text-xs font-semibold mb-1 text-brand-text-main">
                  <span>Tuition Clearance Progress</span>
                  <span>{clearanceProgress.toFixed(1)}%</span>
                </div>
                <div className="bg-brand-bg-primary h-2 rounded-full overflow-hidden w-full border border-brand-border">
                  <div className="bg-gradient-to-r from-brand-accent-emerald to-brand-primary h-full rounded-full transition-all duration-300" style={{ width: `${clearanceProgress}%` }}></div>
                </div>
              </div>
            </div>

            {/* Online payment simulator */}
            <div className="card p-6 bg-brand-bg-secondary border border-brand-border rounded-2xl flex flex-col gap-4">
              <h3 className="mb-1 font-display text-base font-bold text-brand-text-main border-b border-brand-border pb-3">Pay Tuition Online</h3>
              <p className="text-xs text-brand-text-muted">Execute a simulated billing payment to clear your outstanding student dues.</p>
              
              <div className="flex flex-col gap-4">
                <div className="form-group flex flex-col gap-1.5">
                  <label className="form-label text-xs font-semibold text-brand-text-muted">Payment Amount ($)</label>
                  <input 
                    type="number" 
                    className="bg-brand-bg-tertiary border border-brand-border text-brand-text-main p-2.5 rounded-xl outline-none"
                    min="1" 
                    max={outstanding}
                    value={studentPayAmount}
                    onChange={(e) => setStudentPayAmount(parseInt(e.target.value) || 0)}
                    disabled={outstanding === 0}
                  />
                </div>
                <div className="form-group flex flex-col gap-1.5">
                  <label className="form-label text-xs font-semibold text-brand-text-muted">Select Payment Gateway</label>
                  <select 
                    className="bg-brand-bg-tertiary border border-brand-border text-brand-text-main p-2.5 rounded-xl outline-none cursor-pointer"
                    value={studentPayMethod}
                    onChange={(e) => setStudentPayMethod(e.target.value)}
                    disabled={outstanding === 0}
                  >
                    <option>Stripe Card</option>
                    <option>PayPal</option>
                    <option>Bank Direct Transfer</option>
                  </select>
                </div>
                <button 
                  onClick={submitStudentPayment}
                  disabled={outstanding === 0}
                  className="btn btn-primary w-full justify-center flex items-center gap-2 mt-2 cursor-pointer py-3 disabled:opacity-50"
                >
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="4" width="20" height="16" rx="2" ry="2"/><line x1="12" y1="1" x2="12" y2="23"/><line x1="2" y1="10" x2="22" y2="10"/></svg>
                  {outstanding === 0 ? 'Tuition Balance Cleared' : 'Process Payment'}
                </button>
              </div>
            </div>
          </div>

          {/* AI Tuition Default Risk Estimator */}
          <div className="card p-4 bg-brand-bg-tertiary border border-brand-border rounded-xl">
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-brand-border/40">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-brand-accent-amber animate-pulse"></span>
                <span className="text-xs font-bold uppercase tracking-wider text-brand-text-main font-display">AI Payment Delay & Tuition Default Predictor</span>
              </div>
              <span className={`badge text-[0.65rem] py-0.5 px-2 font-mono rounded ${studentDelayClass}`}>
                {studentDelayStatus}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-3 text-xs text-brand-text-muted">
              <div>
                <span className="text-[0.7rem] text-brand-text-subtle">Predicted Delay Probability:</span>
                <div className="font-bold text-brand-text-main font-mono text-sm mt-0.5">{studentDelayPct}</div>
              </div>
              <div>
                <span className="text-[0.7rem] text-brand-text-subtle">Projected Clearance Date:</span>
                <div className="font-bold text-brand-text-main font-mono text-sm mt-0.5">{studentDelayDate}</div>
              </div>
            </div>
          </div>

          {/* Billing Transaction History */}
          <div className="card p-6 bg-brand-bg-secondary border border-brand-border rounded-2xl flex flex-col gap-4">
            <h3 className="mb-1 font-display text-base font-bold text-brand-text-main border-b border-brand-border pb-3">My Billing Transaction History</h3>
            
            <div className="flex flex-col gap-3 max-h-[300px] overflow-y-auto pr-1">
              {studentTransactions.length === 0 ? (
                <div className="text-center py-6 text-brand-text-muted text-xs">No prior transaction receipts found.</div>
              ) : (
                studentTransactions.map(txn => (
                  <div key={txn.txId} className="p-3 border border-brand-border rounded-xl bg-brand-bg-tertiary flex justify-between items-center transition-all duration-200 hover:translate-x-1 hover:border-brand-accent-emerald/30 hover:bg-brand-bg-tertiary/60">
                    <div>
                      <strong className="text-brand-accent-emerald text-base">+${txn.amount}</strong>
                      <span className="text-xs text-brand-text-subtle ml-3">{txn.date} via {txn.method}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <code className="text-xs bg-white/[0.03] px-2 py-1 rounded border border-brand-border/40 font-mono text-brand-text-muted">{txn.txId}</code>
                      <span className="badge bg-brand-accent-emerald/10 text-brand-accent-emerald text-[0.65rem] py-0.5 px-2 rounded">Success</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </>
      )}

      {/* ADMIN VIEW */}
      {!isStudent && (
        <>
          {/* Financial KPI Metrics */}
          <div className="kpi-grid animate-fade-in">
            <div className="card kpi-card flex justify-between items-center p-6 bg-brand-bg-secondary border border-brand-border rounded-2xl">
              <div className="kpi-details flex flex-col">
                <span className="kpi-label text-xs text-brand-text-subtle font-semibold uppercase tracking-wider">Cumulative Collections</span>
                <span className="kpi-value text-2xl font-bold font-display text-brand-text-main mt-1.5">${collected.toLocaleString()}</span>
                <span className="kpi-growth text-brand-accent-emerald text-xs mt-1.5 flex items-center gap-1 font-medium">Audited Fiscal Year</span>
              </div>
              <div className="kpi-icon p-3.5 bg-brand-accent-emerald/10 rounded-xl text-brand-accent-emerald">
                <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
              </div>
            </div>

            <div className="card kpi-card flex justify-between items-center p-6 bg-brand-bg-secondary border border-brand-border rounded-2xl">
              <div className="kpi-details flex flex-col">
                <span className="kpi-label text-xs text-brand-text-subtle font-semibold uppercase tracking-wider">Outstanding Receivables</span>
                <span className="kpi-value text-2xl font-bold font-display text-brand-text-main mt-1.5">${totalDue.toLocaleString()}</span>
                <span className="kpi-growth text-brand-accent-ruby text-xs mt-1.5 flex items-center gap-1 font-medium">Pending Invoices</span>
              </div>
              <div className="kpi-icon p-3.5 bg-brand-accent-ruby/10 rounded-xl text-brand-accent-ruby">
                <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
              </div>
            </div>

            <div className="card kpi-card flex justify-between items-center p-6 bg-brand-bg-secondary border border-brand-border rounded-2xl">
              <div className="kpi-details flex flex-col">
                <span className="kpi-label text-xs text-brand-text-subtle font-semibold uppercase tracking-wider">Overdue Accounts</span>
                <span className="kpi-value text-2xl font-bold font-display text-brand-text-main mt-1.5">{overdueCount} Students</span>
                <span className="kpi-growth text-brand-accent-amber text-xs mt-1.5 flex items-center gap-1 font-medium">Balances &gt; $2,000</span>
              </div>
              <div className="kpi-icon p-3.5 bg-brand-accent-amber/10 rounded-xl text-brand-accent-amber">
                <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
              </div>
            </div>
          </div>

          {/* Balance Sheets & Ledger lists */}
          <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-6 mt-2">
            
            {/* Student Accounts Balance Sheet */}
            <div className="card p-6 bg-brand-bg-secondary border border-brand-border rounded-2xl flex flex-col gap-4">
              <h3 className="font-display text-lg font-semibold text-brand-text-main">Student Accounts Balance Sheet</h3>
              <div className="table-container max-h-[420px] overflow-y-auto rounded-xl border border-brand-border">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-brand-border bg-brand-bg-primary text-brand-text-subtle text-xs font-semibold uppercase">
                      <th className="p-3">Student ID</th>
                      <th className="p-3">Name</th>
                      <th className="p-3">Total Due</th>
                      <th className="p-3">Paid</th>
                      <th className="p-3">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.map(s => {
                      const balance = s.feeTotal - s.feePaid;
                      let badgeClass = 'bg-brand-accent-emerald/10 text-brand-accent-emerald';
                      let statusText = 'Fully Paid';
                      if (balance > 2500) {
                        badgeClass = 'bg-brand-accent-ruby/10 text-brand-accent-ruby';
                        statusText = 'Delinquent';
                      } else if (balance > 0) {
                        badgeClass = 'bg-brand-accent-amber/10 text-brand-accent-amber';
                        statusText = 'Partial';
                      }

                      return (
                        <tr key={s.id} className="border-b border-brand-border hover:bg-white/[0.01] transition-colors text-brand-text-main">
                          <td className="p-3"><code>{s.id}</code></td>
                          <td className="p-3 font-semibold">{s.name}</td>
                          <td className="p-3">${s.feeTotal}</td>
                          <td className="p-3">${s.feePaid}</td>
                          <td className="p-3"><span className={`badge ${badgeClass} text-xs px-2 py-0.5 rounded`}>{statusText}</span></td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Recent Audit Receipts */}
            <div className="card p-6 bg-brand-bg-secondary border border-brand-border rounded-2xl flex flex-col gap-4">
              <h3 className="font-display text-lg font-semibold text-brand-text-main">Recent Audit Receipts</h3>
              <div className="flex flex-col gap-4 max-h-[420px] overflow-y-auto pr-1">
                {transactions.map((txn, index) => (
                  <div key={txn.txId || index} className="p-3 border border-brand-border rounded-xl bg-brand-bg-tertiary flex justify-between items-center transition-all duration-200 hover:translate-x-1 hover:border-brand-accent-emerald/30 hover:bg-brand-bg-tertiary/60">
                    <div>
                      <strong className="text-brand-accent-emerald text-base">+${txn.amount}</strong>
                      <div className="text-[0.8rem] font-semibold text-brand-text-main mt-0.5">{txn.studentName}</div>
                      <span className="text-xs text-brand-text-subtle">{txn.date} via {txn.method}</span>
                    </div>
                    <code className="text-xs bg-white/[0.03] px-2 py-1 rounded font-mono text-brand-text-muted border border-brand-border/40">{txn.txId}</code>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* AI Collections Forecast */}
          <div className="card p-6 bg-brand-bg-secondary border border-brand-border rounded-2xl flex flex-col gap-4">
            <div className="flex justify-between items-center border-b border-brand-border pb-4 mb-1">
              <div>
                <h3 className="font-display flex items-center gap-2 m-0 text-lg font-bold text-brand-text-main">
                  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" className="text-brand-accent-emerald" strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                  AI Fee Collections Forecasting
                </h3>
                <p className="text-[0.85rem] text-brand-text-muted mt-1 m-0">Train an in-browser neural network on historical fee collection trends using TensorFlow.js.</p>
              </div>
              <span className="badge bg-brand-accent-emerald/10 text-brand-accent-emerald font-semibold text-xs px-2.5 py-1 rounded">Powered by TensorFlow.js</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] gap-8">
              {/* Controls Panel */}
              <div className="flex flex-col gap-5 border-r border-brand-border pr-8 max-md:border-r-0 max-md:pr-0">
                <div>
                  <label className="block text-[0.825rem] text-brand-text-subtle mb-2">Optimizer Learning Rate</label>
                  <select 
                    className="w-full bg-brand-bg-tertiary border border-brand-border text-brand-text-main p-2.5 rounded-xl outline-none"
                    value={lr}
                    onChange={(e) => setLr(parseFloat(e.target.value))}
                  >
                    <option value="0.01">0.01 (Slow & Stable)</option>
                    <option value="0.05">0.05 (Default)</option>
                    <option value="0.1">0.10 (Fast)</option>
                  </select>
                </div>

                <div>
                  <div className="flex justify-between text-[0.825rem] mb-2">
                    <span className="text-brand-text-subtle">Training Epochs</span>
                    <span className="text-brand-text-muted">{epochs} epochs</span>
                  </div>
                  <input 
                    type="range" 
                    min="50" 
                    max="300" 
                    step="50" 
                    value={epochs} 
                    onChange={(e) => setEpochs(parseInt(e.target.value))}
                    className="w-full accent-brand-accent-emerald cursor-pointer"
                  />
                </div>

                <div>
                  <label className="block text-[0.825rem] text-brand-text-subtle mb-2">Forecast Horizon</label>
                  <select 
                    className="w-full bg-brand-bg-tertiary border border-brand-border text-brand-text-main p-2.5 rounded-xl outline-none"
                    value={horizon}
                    onChange={(e) => setHorizon(parseInt(e.target.value))}
                  >
                    <option value="1">1 Term (2026-B)</option>
                    <option value="2">2 Terms (2026-B & 2027-A)</option>
                    <option value="3">3 Terms (Up to 2027-B)</option>
                  </select>
                </div>

                <button 
                  onClick={runRevenueTfTraining}
                  disabled={tfTraining}
                  className="btn btn-primary w-full justify-center flex items-center gap-2 cursor-pointer py-3 disabled:opacity-50"
                  style={{ backgroundColor: 'var(--color-brand-accent-emerald)', boxShadow: '0 4px 6px -1px rgba(16, 185, 129, 0.2)' }}
                >
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                  {tfTraining ? 'Training Model...' : 'Run Revenue Projection'}
                </button>

                {/* Live Status */}
                {tfTraining && (
                  <div className="bg-brand-bg-tertiary p-3 rounded-xl border border-brand-border">
                    <div className="flex justify-between text-[0.8rem] mb-1.5">
                      <span className="text-brand-text-subtle">Epoch:</span>
                      <span className="font-semibold text-brand-text-main">{tfEpochDisp}</span>
                    </div>
                    <div className="flex justify-between text-[0.8rem] mb-3">
                      <span className="text-brand-text-subtle">Training Loss:</span>
                      <span className="font-mono text-brand-accent-amber">{tfLossDisp}</span>
                    </div>
                    {/* Progress Bar */}
                    <div className="bg-brand-bg-primary rounded-full h-1.5 overflow-hidden w-full">
                      <div className="bg-brand-accent-emerald h-full transition-[width] duration-100" style={{ width: `${tfProgress}%` }}></div>
                    </div>
                  </div>
                )}
                
                <div className="bg-brand-bg-tertiary p-3.5 rounded-xl border border-brand-border text-[0.825rem] leading-normal">
                  <div className="text-brand-text-main font-semibold mb-1">Last Projection Metrics:</div>
                  <div>Status: <span className={tfStatus === 'Untrained' ? 'text-brand-accent-cyan font-bold' : 'text-brand-accent-emerald font-bold'}>{tfStatus}</span></div>
                  <div>Equation Fit: <span className="text-brand-text-muted font-mono">{tfEquation}</span></div>
                </div>
              </div>

              {/* Forecast Chart */}
              <div className="flex flex-col h-[350px]">
                <div className="flex justify-between mb-3 items-center">
                  <h4 className="text-[0.95rem] font-semibold text-brand-text-main m-0">Revenue Projection Curve</h4>
                  <span className="text-[0.75rem] text-brand-text-muted">Historical fee revenues vs Model Fit</span>
                </div>
                <div className="chart-wrapper flex-1 relative">
                  <canvas ref={canvasRef}></canvas>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* RECORD PAYMENT MODAL (ADMIN) */}
      {showPayModal && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center z-[1000] p-4">
          <div className="modal-container bg-brand-bg-secondary border border-brand-border rounded-[20px] w-full max-w-[500px] shadow-2xl animate-fade-in">
            <div className="modal-header p-5 px-6 border-b border-brand-border flex items-center justify-between">
              <h3 className="modal-title font-display text-xl font-semibold text-brand-text-main">Record Fee Payment Receipt</h3>
              <button className="modal-close bg-transparent border-none text-brand-text-muted cursor-pointer text-2xl" onClick={() => setShowPayModal(false)}>&times;</button>
            </div>
            <div className="modal-body p-6 flex flex-col gap-4">
              <div className="form-group flex flex-col gap-1.5">
                <label className="form-label text-xs font-semibold text-brand-text-muted">Select Student Account</label>
                <select 
                  className="bg-brand-bg-tertiary border border-brand-border text-brand-text-main p-2.5 rounded-xl outline-none cursor-pointer"
                  value={payStudentId}
                  onChange={(e) => setPayStudentId(e.target.value)}
                >
                  {students.map(s => (
                    <option key={s.id} value={s.id}>{s.name} ({s.id})</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="form-group flex flex-col gap-1.5">
                  <label className="form-label text-xs font-semibold text-brand-text-muted">Receipt Amount ($)</label>
                  <input 
                    type="number" 
                    className="bg-brand-bg-tertiary border border-brand-border text-brand-text-main p-2.5 rounded-xl outline-none" 
                    min="1"
                    max="10000"
                    value={payAmount}
                    onChange={(e) => setPayAmount(parseInt(e.target.value) || 0)}
                  />
                </div>
                <div className="form-group flex flex-col gap-1.5">
                  <label className="form-label text-xs font-semibold text-brand-text-muted">Payment Gateway / Method</label>
                  <select 
                    className="bg-brand-bg-tertiary border border-brand-border text-brand-text-main p-2.5 rounded-xl outline-none cursor-pointer"
                    value={payMethod}
                    onChange={(e) => setPayMethod(e.target.value)}
                  >
                    <option>Stripe</option>
                    <option>Credit Card</option>
                    <option>Bank Transfer</option>
                    <option>PayPal</option>
                    <option>Scholarship Voucher</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="modal-footer p-4 px-6 border-t border-brand-border flex justify-end gap-3">
              <button className="btn btn-secondary cursor-pointer" onClick={() => setShowPayModal(false)}>Cancel</button>
              <button className="btn btn-primary cursor-pointer" onClick={submitAdminPayment}>Complete Transaction</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
