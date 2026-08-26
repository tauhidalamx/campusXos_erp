'use client';

import React, { useState, useEffect } from 'react';
import { useDb } from '../../context/db-context';

export default function ExamsPage() {
  const {
    exams,
    students,
    courses,
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

  const studentObject = students.find(s => s.email.toLowerCase() === currentUser?.email.toLowerCase());
  const allowedExams = currentUser?.role === 'student'
    ? exams.filter(ex => studentObject?.courses?.includes(ex.code))
    : exams;

  // Selection states
  const [selectedTranscriptStudentId, setSelectedTranscriptStudentId] = useState('');
  const [selectedGradeCourseCode, setSelectedGradeCourseCode] = useState('');
  const [selectedGradeStudentId, setSelectedGradeStudentId] = useState('');
  const [gradeScore, setGradeScore] = useState(85);

  // AI states
  const [aiGrade, setAiGrade] = useState('Calculating...');
  const [aiFailPct, setAiFailPct] = useState('Calculating...');
  const [aiStatus, setAiStatus] = useState('Calculating...');
  const [aiStatusClass, setAiStatusClass] = useState('bg-brand-accent-emerald/20 text-brand-accent-emerald');

  // Initialize dropdowns
  useEffect(() => {
    if (!currentUser) return;
    if (currentUser.role === 'student') {
      const s = students.find(item => item.email.toLowerCase() === currentUser.email.toLowerCase());
      if (s) {
        setSelectedTranscriptStudentId(s.id);
      }
    } else {
      if (students.length > 0) {
        if (!selectedTranscriptStudentId) setSelectedTranscriptStudentId(students[0].id);
        if (!selectedGradeStudentId) setSelectedGradeStudentId(students[0].id);
      }
    }
    if (courses.length > 0 && !selectedGradeCourseCode) {
      setSelectedGradeCourseCode(courses[0].code);
    }
  }, [students, courses, currentUser]);

  // Selected student details for transcript
  const transcriptStudent = students.find(s => s.id === selectedTranscriptStudentId);

  // Enrolled course grades (mock)
  const getTranscriptGrades = (stu) => {
    if (!stu) return [];
    return [
      { code: stu.courses[0] || 'CS101', title: 'Intro Programming', grade: 'A', credits: 4 },
      { code: stu.courses[1] || 'CS302', title: 'Database Systems', grade: 'A+', credits: 3 },
      { code: stu.courses[2] || 'CS305', title: 'Software Engineering', grade: 'B', credits: 3 }
    ];
  };

  const transcriptGrades = getTranscriptGrades(transcriptStudent);

  // Run TensorFlow Grade Outcome Predictor
  const runExamTfInference = async (stu) => {
    if (typeof window === 'undefined' || !window.tf) {
      setAiGrade('TF Unavailable');
      return;
    }

    try {
      const tf = window.tf;
      const inputVal = [stu.gpa / 4.0, stu.attendance / 100.0, stu.semester / 8.0];
      const model = tf.sequential();
      model.add(tf.layers.dense({ units: 3, activation: 'sigmoid', inputShape: [3] }));
      model.add(tf.layers.dense({ units: 2 }));

      const w1 = tf.tensor2d([
        [2.0, 1.5],
        [1.5, 2.0],
        [-0.5, -0.2]
      ]);
      const b1 = tf.tensor1d([0.5, 0.2]);
      model.layers[1].setWeights([w1, b1]);

      const inputTensor = tf.tensor2d([inputVal], [1, 3]);
      const outputTensor = model.predict(inputTensor);
      const outputVal = await outputTensor.data();

      const passScore = outputVal[0];
      const gradeScoreVal = outputVal[1];

      let failProb = Math.max(0.01, Math.min(0.99, 1.0 - (1.0 / (1.0 + Math.exp(-passScore)))));
      let gradeIndex = Math.max(0, Math.min(4, Math.floor(gradeScoreVal * 5)));
      const gradeBands = ['F', 'C', 'B', 'A', 'A+'];
      let predictedGrade = gradeBands[gradeIndex];

      if (stu.gpa < 2.0) {
        predictedGrade = 'D';
        failProb = Math.max(failProb, 0.45);
      }
      if (stu.attendance < 65) {
        predictedGrade = 'F';
        failProb = Math.max(failProb, 0.85);
      }
      if (stu.gpa >= 3.7) {
        predictedGrade = 'A+';
        failProb = 0.01;
      }

      setAiGrade(predictedGrade);
      setAiFailPct((failProb * 100).toFixed(1) + '%');

      if (failProb > 0.4) {
        setAiStatus('High Academic Risk');
        setAiStatusClass('bg-brand-accent-ruby/20 text-brand-accent-ruby');
      } else if (failProb > 0.1) {
        setAiStatus('Passing (Review Required)');
        setAiStatusClass('bg-brand-accent-amber/20 text-brand-accent-amber');
      } else {
        setAiStatus('Excellent Standing');
        setAiStatusClass('bg-brand-accent-emerald/20 text-brand-accent-emerald');
      }

      inputTensor.dispose();
      outputTensor.dispose();
      w1.dispose();
      b1.dispose();
      model.dispose();
    } catch (err) {
      console.error('TF Exam inference failed:', err);
    }
  };

  useEffect(() => {
    if (transcriptStudent) {
      runExamTfInference(transcriptStudent);
    }
  }, [transcriptStudent]);

  // Submit dynamic grade entry
  const handleSubmitGrade = () => {
    const scoreVal = parseInt(gradeScore);
    if (isNaN(scoreVal) || scoreVal < 0 || scoreVal > 100) {
      alert("Please enter a valid final assessment score between 0 and 100.");
      return;
    }

    let grade = 'F';
    let gpaDelta = 0.0;
    if (scoreVal >= 90) { grade = 'A+'; gpaDelta = 4.0; }
    else if (scoreVal >= 80) { grade = 'A'; gpaDelta = 3.7; }
    else if (scoreVal >= 70) { grade = 'B'; gpaDelta = 3.0; }
    else if (scoreVal >= 60) { grade = 'C'; gpaDelta = 2.0; }
    else if (scoreVal >= 50) { grade = 'D'; gpaDelta = 1.0; }

    const stu = students.find(s => s.id === selectedGradeStudentId);
    if (stu) {
      const newGpa = Math.min(4.0, parseFloat(((stu.gpa * 0.8) + (gpaDelta * 0.2)).toFixed(2)));
      updateStudent(stu.id, { gpa: newGpa });
      alert(`Grade updated for ${stu.name}!\nCourse: ${selectedGradeCourseCode} | Score: ${scoreVal}% | Grade: ${grade}.\nNew cumulative GPA computed: ${newGpa}`);
    }
  };

  if (!currentUser) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="w-8 h-8 border-4 border-brand-primary/30 border-t-brand-primary rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 md:gap-8">
      <div className="page-header animate-fade-in flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-display font-bold text-brand-text-main">Exams & Academic Grading</h1>
          <p className="text-brand-text-muted mt-1 text-sm">Schedule term exams, verify student transcripts, calculate GPAs, and input course evaluations.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-2">
        {/* Upcoming Exams Schedule */}
        <div className="card p-6 bg-brand-bg-secondary border border-brand-border rounded-2xl flex flex-col gap-4">
          <h3 className="font-display text-lg font-semibold text-brand-text-main">Upcoming Exams</h3>
          <div className="flex flex-col gap-3">
            {allowedExams.map((ex, idx) => {
              const c = courses.find(course => course.code === ex.code);
              return (
                <div key={idx} className="p-4 border border-brand-border rounded-xl bg-brand-bg-tertiary flex justify-between items-center transition-all duration-200 hover:translate-x-1 hover:border-brand-primary/30 hover:bg-brand-primary/5">
                  <div>
                    <code className="text-brand-primary font-mono font-bold text-base">{ex.code}</code>
                    <h4 className="mt-1 mb-0.5 font-display font-medium text-brand-text-main text-sm">{ex.name}</h4>
                    <span className="text-xs text-brand-text-muted">{ex.date} @ {ex.time}</span>
                  </div>
                  <div className="text-right">
                    <span className="badge bg-brand-accent-cyan/10 text-brand-accent-cyan text-[0.75rem] px-2 py-0.5 rounded font-semibold">{ex.venue}</span>
                    <div className="text-[0.75rem] text-brand-text-subtle mt-1">{c ? c.credits : 3} Credits</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Transcript Workspace Panel */}
        <div className="card p-6 bg-brand-bg-secondary border border-brand-border rounded-2xl flex flex-col gap-4">
          <h3 className="font-display text-lg font-semibold text-brand-text-main">Academic Transcript Generator</h3>
          <p className="text-brand-text-muted text-xs">Retrieve official term grade reports for enrolled students.</p>
          
          {currentUser?.role !== 'student' && (
            <div className="form-group flex flex-col gap-1.5">
              <label className="form-label text-xs font-semibold text-brand-text-muted">Search Student Profile (Select ID)</label>
              <select 
                className="bg-brand-bg-tertiary border border-brand-border text-brand-text-main p-2.5 rounded-xl outline-none cursor-pointer"
                value={selectedTranscriptStudentId}
                onChange={(e) => setSelectedTranscriptStudentId(e.target.value)}
              >
                {students.map(s => (
                  <option key={s.id} value={s.id}>{s.id} - {s.name} ({s.dept})</option>
                ))}
              </select>
            </div>
          )}

          {transcriptStudent ? (
            <div className="p-4 border border-dashed border-brand-border rounded-xl bg-white/[0.01] flex flex-col gap-4 mt-2">
              <div className="flex justify-between items-center">
                <span className="font-semibold font-display text-brand-text-main text-sm">{transcriptStudent.name}</span>
                <code className="text-xs text-brand-text-muted font-mono">CGPA: {transcriptStudent.gpa.toFixed(2)}</code>
              </div>
              <table className="w-full border-collapse text-[0.825rem] text-left">
                <thead>
                  <tr className="border-b border-brand-border text-brand-text-subtle">
                    <th className="py-2">Subject</th>
                    <th className="py-2 text-center">Credits</th>
                    <th className="py-2 text-right">Grade</th>
                  </tr>
                </thead>
                <tbody>
                  {transcriptGrades.map((g, i) => (
                    <tr key={i} className="border-b border-dashed border-brand-border/40 text-brand-text-main font-medium">
                      <td className="py-2.5"><code>{g.code}</code> - {g.title}</td>
                      <td className="py-2.5 text-center">{g.credits}</td>
                      <td className="py-2.5 text-right font-semibold text-brand-primary">{g.grade}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="text-right">
                <button className="btn btn-secondary btn-sm cursor-pointer" onClick={() => alert('Sending digital transcript via Secure email...')}>Email Transcript PDF</button>
              </div>

              {/* AI Grade Outcome Predictor */}
              {currentUser?.role === 'admin' && (
                <div className="card p-4 bg-brand-bg-tertiary border border-brand-border rounded-xl mt-2">
                  <div className="flex items-center justify-between mb-3 pb-2 border-b border-brand-border/40">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-brand-accent-cyan animate-pulse"></span>
                      <span className="text-xs font-bold uppercase tracking-wider text-brand-text-main font-display">AI Grade Predictor</span>
                    </div>
                    <span className={`badge text-[0.65rem] py-0.5 px-2 font-mono rounded ${aiStatusClass}`}>
                      {aiStatus}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-xs text-brand-text-muted">
                    <div>
                      <span className="text-[0.7rem] text-brand-text-subtle">Predicted Final Grade:</span>
                      <div className="font-bold text-brand-text-main font-mono text-sm mt-0.5">{aiGrade}</div>
                    </div>
                    <div>
                      <span className="text-[0.7rem] text-brand-text-subtle">Graduation Fail Probability:</span>
                      <div className="font-bold text-brand-text-main font-mono text-sm mt-0.5">{aiFailPct}</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="p-4 border border-dashed border-brand-border rounded-xl bg-white/[0.01] text-brand-text-muted text-center text-xs mt-2">
              Select a valid student profile ID.
            </div>
          )}
        </div>
      </div>

      {/* Quick Grade Entry System Card */}
      {currentUser?.role !== 'student' && (
        <div className="card p-6 bg-brand-bg-secondary border border-brand-border rounded-2xl flex flex-col gap-4">
          <h3 className="font-display text-lg font-semibold text-brand-text-main">Interactive Term Grade Entry</h3>
          <p className="text-brand-text-muted text-xs">Enter raw final assessment scores (0-100) to automate grade and GPA logs.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
            <div className="form-group flex flex-col gap-1.5">
              <label className="form-label text-xs font-semibold text-brand-text-muted">Subject Code</label>
              <select 
                className="bg-brand-bg-tertiary border border-brand-border text-brand-text-main p-2.5 rounded-xl outline-none cursor-pointer"
                value={selectedGradeCourseCode}
                onChange={(e) => setSelectedGradeCourseCode(e.target.value)}
              >
                {courses.map(c => (
                  <option key={c.code} value={c.code}>{c.code} - {c.title}</option>
                ))}
              </select>
            </div>
            <div className="form-group flex flex-col gap-1.5">
              <label className="form-label text-xs font-semibold text-brand-text-muted">Selected Student</label>
              <select 
                className="bg-brand-bg-tertiary border border-brand-border text-brand-text-main p-2.5 rounded-xl outline-none cursor-pointer"
                value={selectedGradeStudentId}
                onChange={(e) => setSelectedGradeStudentId(e.target.value)}
              >
                {students.map(s => (
                  <option key={s.id} value={s.id}>{s.name} ({s.id})</option>
                ))}
              </select>
            </div>
            <div className="form-group flex gap-2">
              <div className="flex-1 flex flex-col gap-1.5">
                <label className="form-label text-xs font-semibold text-brand-text-muted">Term Score</label>
                <input 
                  type="number" 
                  className="bg-brand-bg-tertiary border border-brand-border text-brand-text-main p-2.5 rounded-xl outline-none" 
                  min="0" 
                  max="100" 
                  value={gradeScore}
                  onChange={(e) => setGradeScore(parseInt(e.target.value) || 0)}
                />
              </div>
              <button className="btn btn-primary cursor-pointer py-3 h-fit mt-auto shrink-0 px-5" onClick={handleSubmitGrade}>Submit Grade</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
