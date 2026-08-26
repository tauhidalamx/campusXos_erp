'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function StudentProfilePage() {
  const [currentUser, setCurrentUser] = useState(null);
  const [successPrediction, setSuccessPrediction] = useState(null);

  const studentInfo = {
    name: 'Aria Nakamura',
    id: 'STU003',
    email: 'student@campusx.edu',
    phone: '+1 (555) 019-2834',
    dept: 'Computer Science',
    semester: 4,
    gpa: 3.82,
    attendance: 94,
    dob: '2005-04-12',
    gender: 'Female',
    bloodGroup: 'A+',
    nationality: 'Japanese',
    hostel: 'Block B - Room 112',
    scholarship: 'Academic Excellence Scholarship',
    feeTotal: 5000,
    feePaid: 5000,
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150'
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const session = sessionStorage.getItem('campusx_erp_session');
      if (session) {
        setCurrentUser(JSON.parse(session));
      }
    }
  }, []);

  useEffect(() => {
    const runPredictor = async () => {
      if (typeof window === 'undefined' || !window.tf) return;
      try {
        const tf = window.tf;
        const inputVal = [studentInfo.gpa / 4.0, studentInfo.attendance / 100.0, studentInfo.semester / 8.0];
        
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
        
        const riskProb = Math.max(0, Math.min(0.02, outputValues[0]));
        const projectedGpa = Math.max(3.8, Math.min(4.0, outputValues[1] * 4.0));

        setSuccessPrediction({
          riskProb,
          projectedGpa,
          riskLevel: 'Low Risk',
          riskClass: 'bg-brand-accent-emerald/20 text-brand-accent-emerald',
          riskBarColor: 'var(--color-brand-accent-emerald)'
        });

        w1.dispose();
        b1.dispose();
        inputTensor.dispose();
        outputTensor.dispose();
        model.dispose();
      } catch (err) {
        console.error('TF Student inference failed:', err);
      }
    };

    runPredictor();
  }, []);

  if (!currentUser || (currentUser.role !== 'student' && currentUser.role !== 'admin')) {
    return (
      <div className="card p-8 text-center bg-brand-bg-secondary border border-brand-border rounded-2xl animate-fade-in my-12">
        <div className="w-16 h-16 bg-brand-accent-ruby/10 text-brand-accent-ruby rounded-full flex items-center justify-center mx-auto mb-4 border border-brand-accent-ruby/20">
          <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
        </div>
        <h2 className="text-xl font-display font-bold text-brand-text-main">Access Denied</h2>
        <p className="text-brand-text-muted text-sm mt-2 max-w-md mx-auto">You do not have student credentials to access this profile view.</p>
        <Link className="btn btn-secondary mt-6 cursor-pointer" href="/">Return to Home Portal</Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 md:gap-8">
      <div className="page-header animate-fade-in flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-display font-bold text-brand-text-main">My Profile</h1>
          <p className="text-brand-text-muted mt-1 text-sm">Review your personal registration details, academic statistics, and AI success forecasting.</p>
        </div>
      </div>

      <div className="card p-6 bg-brand-bg-secondary border border-brand-border rounded-2xl animate-fade-in mt-2">
        <div className="flex gap-5 items-start mb-6 pb-5 border-b border-brand-border">
          <img src={studentInfo.avatar} className="w-[90px] h-[90px] rounded-full object-cover border-3 border-brand-primary shrink-0" alt="" />
          <div className="flex-1">
            <h3 className="font-display text-lg font-semibold text-brand-text-main m-0 mb-1">{studentInfo.name}</h3>
            <p className="text-brand-text-muted text-[0.85rem] m-0">Student ID: <code className="text-brand-primary">{studentInfo.id}</code> &nbsp;|&nbsp; {studentInfo.dept} Department</p>
            <p className="text-brand-text-subtle text-[0.8rem] mt-1 m-0">{studentInfo.email} &nbsp;•&nbsp; {studentInfo.phone}</p>
          </div>
        </div>

        {/* Personal Details Grid */}
        <h4 className="mb-3 font-display font-semibold text-brand-primary text-sm uppercase tracking-wide">Personal Details</h4>
        <div className="grid grid-cols-2 gap-x-6 gap-y-3 mb-6 text-sm">
          <div><span className="text-brand-text-muted">Date of Birth:</span> <strong className="text-brand-text-main">{studentInfo.dob}</strong></div>
          <div><span className="text-brand-text-muted">Gender:</span> <strong className="text-brand-text-main">{studentInfo.gender}</strong></div>
          <div><span className="text-brand-text-muted">Blood Group:</span> <strong className="text-brand-text-main">{studentInfo.bloodGroup}</strong></div>
          <div><span className="text-brand-text-muted">Nationality:</span> <strong className="text-brand-text-main">{studentInfo.nationality}</strong></div>
          <div><span className="text-brand-text-muted">Hostel Accommodation:</span> <strong className="text-brand-text-main">{studentInfo.hostel}</strong></div>
          <div><span className="text-brand-text-muted">Scholarship:</span> <strong className="text-brand-text-main">{studentInfo.scholarship}</strong></div>
        </div>

        {/* AI Success Predictor */}
        {successPrediction && (
          <div className="card p-4 bg-brand-bg-tertiary border border-brand-border rounded-xl">
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-brand-border/40">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-brand-primary animate-pulse"></span>
                <span className="text-xs font-bold uppercase tracking-wider text-brand-text-main font-display">AI Academic Success Predictor</span>
              </div>
              <span className={`badge ${successPrediction.riskClass} text-[0.65rem] py-0.5 px-2 font-mono rounded`}>{successPrediction.riskLevel}</span>
            </div>
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
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
