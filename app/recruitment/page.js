'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function RecruitmentPage() {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const session = sessionStorage.getItem('campusx_erp_session');
      if (session) {
        setCurrentUser(JSON.parse(session));
      }
    }
  }, []);

  const [pipeline, setPipeline] = useState([
    { name: 'Marcus Sterling', program: 'Computer Science', gpa: 3.8, sat: 1450, interview: 9.0, status: 'Review' },
    { name: 'Aaliyah Jones', program: 'Bioinformatics', gpa: 3.5, sat: 1320, interview: 8.5, status: 'Review' },
    { name: 'Hiroshi Sato', program: 'Electrical Eng', gpa: 3.9, sat: 1510, interview: 9.5, status: 'Approved' },
    { name: 'Clara Oswald', program: 'Business Admin', gpa: 3.2, sat: 1240, interview: 7.0, status: 'Review' },
    { name: 'Bruce Banner', program: 'Mechanical Eng', gpa: 3.7, sat: 1400, interview: 8.0, status: 'Review' }
  ]);

  // Roster suitability rates state
  const [suitabilityRates, setSuitabilityRates] = useState({});

  // Evaluator state inputs
  const [evalGpa, setEvalGpa] = useState(3.6);
  const [evalSat, setEvalSat] = useState(1350);
  const [evalInterview, setEvalInterview] = useState(8.0);
  const [learningRate, setLearningRate] = useState(0.05);
  const [epochs, setEpochs] = useState(25);

  // Model training display states
  const [isTraining, setIsTraining] = useState(false);
  const [currentEpoch, setCurrentEpoch] = useState(0);
  const [currentLoss, setCurrentLoss] = useState(0);
  const [trainingProgress, setTrainingProgress] = useState(0);

  // Main KPI conversion rate
  const [aiTargetConversion, setAiTargetConversion] = useState('78.5%');

  // Load and pre-calculate direct suitability rates for roster on mount
  useEffect(() => {
    const calculateInitialSuitability = async () => {
      if (typeof window === 'undefined' || !window.tf) return;
      try {
        const tf = window.tf;
        const rates = {};
        for (const item of pipeline) {
          const gpaNormalized = item.gpa / 4.0;
          const satNormalized = (item.sat - 800) / 800.0;
          const intNormalized = item.interview / 10.0;

          const model = tf.sequential();
          model.add(tf.layers.dense({ units: 3, activation: 'sigmoid', inputShape: [3] }));
          model.add(tf.layers.dense({ units: 1, activation: 'sigmoid' }));

          const w1 = tf.tensor2d([
            [1.2],
            [1.8],
            [1.5]
          ]);
          const b1 = tf.tensor1d([0.1]);
          model.layers[1].setWeights([w1, b1]);

          const input = tf.tensor2d([[gpaNormalized, satNormalized, intNormalized]], [1, 3]);
          const output = model.predict(input);
          const val = (await output.data())[0];

          input.dispose();
          output.dispose();
          w1.dispose();
          b1.dispose();
          model.dispose();

          rates[item.name] = (val * 100).toFixed(1) + '%';
        }
        setSuitabilityRates(rates);
      } catch (err) {
        console.error('TF Roster pre-calculate failed:', err);
      }
    };

    calculateInitialSuitability();
  }, [pipeline]);

  const runAdmissionsTfTraining = async () => {
    if (typeof window === 'undefined' || !window.tf) {
      alert('TensorFlow.js is currently loading or unavailable.');
      return;
    }

    if (isNaN(evalGpa) || isNaN(evalSat) || isNaN(evalInterview)) {
      alert('Please input valid numeric assessment details.');
      return;
    }

    setIsTraining(true);
    setCurrentEpoch(0);
    setCurrentLoss(0);
    setTrainingProgress(0);

    const tf = window.tf;

    // Normalize prospective inputs
    const gpaN = evalGpa / 4.0;
    const satN = (evalSat - 800) / 800.0;
    const intN = evalInterview / 10.0;

    // Train regression sequential model
    const trainX = tf.tensor2d([
      [3.8 / 4.0, (1450 - 800)/800, 9/10],
      [3.5 / 4.0, (1320 - 800)/800, 8.5/10],
      [3.9 / 4.0, (1510 - 800)/800, 9.5/10],
      [3.2 / 4.0, (1240 - 800)/800, 7/10],
      [3.7 / 4.0, (1400 - 800)/800, 8/10]
    ], [5, 3]);

    const trainY = tf.tensor2d([
      [0.85],
      [0.65],
      [0.98],
      [0.28],
      [0.72]
    ], [5, 1]);

    const model = tf.sequential();
    model.add(tf.layers.dense({ units: 3, activation: 'sigmoid', inputShape: [3] }));
    model.add(tf.layers.dense({ units: 1, activation: 'sigmoid' }));

    model.compile({
      optimizer: tf.train.adam(learningRate),
      loss: 'meanSquaredError'
    });

    try {
      await model.fit(trainX, trainY, {
        epochs: epochs,
        callbacks: {
          onEpochEnd: (epoch, logs) => {
            const p = ((epoch + 1) / epochs) * 100;
            setCurrentEpoch(epoch + 1);
            setCurrentLoss(logs.loss);
            setTrainingProgress(p);
          }
        }
      });

      // Predict target value
      const queryTensor = tf.tensor2d([[gpaN, satN, intN]], [1, 3]);
      const prediction = model.predict(queryTensor);
      const predictionVal = (await prediction.data())[0];

      queryTensor.dispose();
      prediction.dispose();

      setAiTargetConversion((predictionVal * 100).toFixed(1) + '%');

      alert(`AI Projection Completed!\nPredicted application conversion likelihood: ${(predictionVal * 100).toFixed(1)}%`);

    } catch (err) {
      console.error('TF Recruitment training error:', err);
    } finally {
      trainX.dispose();
      trainY.dispose();
      model.dispose();
      setIsTraining(false);
    }
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
        <p className="text-brand-text-muted text-sm mt-2 max-w-md mx-auto">You do not have the required credentials to access the recruitment pipeline and candidate evaluators.</p>
        <Link className="btn btn-secondary mt-6 cursor-pointer" href="/">Return to Home Portal</Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 md:gap-8">
      <div className="page-header animate-fade-in flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-display font-bold text-brand-text-main">Recruitment & Admissions Converter</h1>
          <p className="text-brand-text-muted mt-1 text-sm">Analyze prospective student acceptance parameters, evaluate faculty candidates, and run neural suitability metrics.</p>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 animate-fade-in mt-2">
        <div className="card p-6 bg-brand-bg-secondary border border-brand-border rounded-2xl flex items-center justify-between">
          <div className="kpi-details">
            <span className="text-brand-text-muted text-xs font-semibold">Active Applications</span>
            <span className="block text-2xl font-bold font-display text-brand-text-main mt-1">{pipeline.length} Candidates</span>
            <span className="text-[0.7rem] text-brand-primary mt-1 block">Fall Intake 2026</span>
          </div>
          <div className="p-3 bg-brand-primary/10 rounded-xl text-brand-primary">
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
            </svg>
          </div>
        </div>
        <div className="card p-6 bg-brand-bg-secondary border border-brand-border rounded-2xl flex items-center justify-between">
          <div className="kpi-details">
            <span className="text-brand-text-muted text-xs font-semibold">AI Target Conversion Rate</span>
            <span className="block text-2xl font-bold font-display text-brand-accent-emerald mt-1">{aiTargetConversion}</span>
            <span className="text-[0.7rem] text-brand-accent-emerald mt-1 block">Optimized Cap</span>
          </div>
          <div className="p-3 bg-brand-accent-emerald/10 rounded-xl text-brand-accent-emerald">
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="1" x2="12" y2="23" />
              <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          </div>
        </div>
      </div>

      {/* Roster & Evaluator grid */}
      <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-6 animate-fade-in mt-2">
        {/* Candidates Table */}
        <div className="card p-6 bg-brand-bg-secondary border border-brand-border rounded-2xl flex flex-col">
          <h3 className="mb-4 font-display text-lg font-bold text-brand-text-main">Admissions Pipeline Roster</h3>
          <div className="table-container overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="border-b border-brand-border">
                  <th className="p-3 text-xs font-semibold text-brand-text-muted">Applicant Name</th>
                  <th className="p-3 text-xs font-semibold text-brand-text-muted">Target Program</th>
                  <th className="p-3 text-xs font-semibold text-brand-text-muted">GPA / SAT</th>
                  <th className="p-3 text-xs font-semibold text-brand-text-muted">Interview</th>
                  <th className="p-3 text-xs font-semibold text-brand-text-muted text-right">AI Conversion Rate</th>
                </tr>
              </thead>
              <tbody>
                {pipeline.map((item, i) => {
                  const rate = suitabilityRates[item.name] || 'Calculating...';
                  const rateFloat = parseFloat(rate) / 100;
                  
                  let badgeColor = 'text-brand-accent-emerald';
                  if (rateFloat < 0.4) badgeColor = 'text-brand-accent-ruby';
                  else if (rateFloat < 0.7) badgeColor = 'text-brand-accent-amber';

                  return (
                    <tr key={i} className="border-b border-brand-border/40 last:border-b-0">
                      <td className="p-3 text-sm text-brand-text-main font-semibold">{item.name}</td>
                      <td className="p-3 text-sm text-brand-text-muted">{item.program}</td>
                      <td className="p-3 text-sm text-brand-text-muted font-mono">GPA {item.gpa.toFixed(2)} / SAT {item.sat}</td>
                      <td className="p-3 text-sm text-brand-text-muted font-mono">{item.interview.toFixed(1)} / 10.0</td>
                      <td className={`p-3 text-sm font-bold text-right font-mono ${badgeColor}`}>{rate}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Interactive AI Evaluator Card */}
        <div className="card p-6 bg-brand-bg-secondary border border-brand-border rounded-2xl flex flex-col gap-4">
          <h3 className="font-display text-lg font-bold text-brand-text-main border-b border-brand-border pb-3">Interactive Admission Evaluator</h3>
          <p className="text-xs text-brand-text-muted">Input prospective scores to predict conversion likelihood using in-browser classification networks.</p>

          <div className="flex flex-col gap-4">
            <div className="form-group flex flex-col gap-1.5">
              <label className="form-label text-xs font-semibold text-brand-text-muted">Applicant GPA (1.0 - 4.0)</label>
              <input 
                type="number" 
                className="bg-brand-bg-tertiary border border-brand-border text-brand-text-main p-2.5 rounded-xl outline-none" 
                min="1.0" 
                max="4.0" 
                step="0.1" 
                value={evalGpa}
                onChange={(e) => setEvalGpa(parseFloat(e.target.value) || 0)}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="form-group flex flex-col gap-1.5">
                <label className="form-label text-xs font-semibold text-brand-text-muted">SAT Score (800-1600)</label>
                <input 
                  type="number" 
                  className="bg-brand-bg-tertiary border border-brand-border text-brand-text-main p-2.5 rounded-xl outline-none font-mono" 
                  min="800" 
                  max="1600" 
                  step="10" 
                  value={evalSat}
                  onChange={(e) => setEvalSat(parseInt(e.target.value) || 0)}
                />
              </div>
              <div className="form-group flex flex-col gap-1.5">
                <label className="form-label text-xs font-semibold text-brand-text-muted">Interview Score (1-10)</label>
                <input 
                  type="number" 
                  className="bg-brand-bg-tertiary border border-brand-border text-brand-text-main p-2.5 rounded-xl outline-none font-mono" 
                  min="1" 
                  max="10" 
                  step="0.5" 
                  value={evalInterview}
                  onChange={(e) => setEvalInterview(parseFloat(e.target.value) || 0)}
                />
              </div>
            </div>

            {/* Optimizer training configs */}
            <div className="grid grid-cols-2 gap-4 p-3.5 bg-brand-bg-tertiary border border-brand-border rounded-xl">
              <div className="form-group flex flex-col gap-1">
                <label className="form-label text-[0.65rem] font-bold uppercase tracking-wider text-brand-text-muted">Learning Rate</label>
                <select 
                  className="bg-brand-bg-secondary border border-brand-border text-brand-text-main p-1.5 rounded-lg outline-none text-xs" 
                  value={learningRate}
                  onChange={(e) => setLearningRate(parseFloat(e.target.value))}
                >
                  <option value={0.1}>0.10 (Fast)</option>
                  <option value={0.05}>0.05 (Balanced)</option>
                  <option value={0.01}>0.01 (Slow)</option>
                </select>
              </div>
              <div className="form-group flex flex-col gap-1">
                <label className="form-label text-[0.65rem] font-bold uppercase tracking-wider text-brand-text-muted">Training Epochs</label>
                <input 
                  type="number" 
                  className="bg-brand-bg-secondary border border-brand-border text-brand-text-main p-1 rounded-lg outline-none text-xs px-2 font-mono" 
                  value={epochs} 
                  min="5" 
                  max="100"
                  onChange={(e) => setEpochs(parseInt(e.target.value) || 5)}
                />
              </div>
            </div>

            {/* Training progress indicator */}
            {isTraining && (
              <div className="p-3 bg-brand-bg-primary rounded-xl border border-brand-border/40 text-xs flex flex-col gap-2 animate-fade-in">
                <div className="flex justify-between items-center">
                  <span className="text-brand-text-main font-semibold">Model Tuning...</span>
                  <span className="font-mono font-bold text-brand-primary">{currentEpoch}/{epochs}</span>
                </div>
                <div className="flex justify-between items-center text-[0.65rem] text-brand-text-subtle font-mono">
                  <span>Mean Squared Error (Loss):</span>
                  <span className="font-bold text-brand-accent-amber">{currentLoss.toFixed(6)}</span>
                </div>
                <div className="w-full bg-brand-bg-secondary h-2 rounded-full overflow-hidden border border-brand-border/40">
                  <div className="bg-brand-primary h-full rounded-full transition-all duration-150" style={{ width: `${trainingProgress}%` }}></div>
                </div>
              </div>
            )}

            <button 
              className="btn btn-primary w-full justify-center flex items-center gap-2 mt-2 cursor-pointer font-semibold py-2.5 rounded-xl shadow-md" 
              onClick={runAdmissionsTfTraining}
              disabled={isTraining}
            >
              {isTraining ? 'Running Optimizers...' : 'Project Converter Score'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
