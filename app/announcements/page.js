'use client';

import React, { useState, useEffect } from 'react';
import { useDb } from '../../context/db-context';

export default function AnnouncementsPage() {
  const { announcements, addAnnouncement, deleteAnnouncement, students } = useDb();

  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      let session = sessionStorage.getItem('campusx_erp_session');
      if (!session) {
        window.location.href = '/login';
        return;
      }
      try {
        setCurrentUser(JSON.parse(session));
      } catch (e) {}
    }
  }, []);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [tag, setTag] = useState('Academic');
  const [color, setColor] = useState('var(--color-brand-primary)');
  const [content, setContent] = useState('');

  // AI Reach Predictor states
  const [reachStatus, setReachStatus] = useState('Calculating...');
  const [reachPct, setReachPct] = useState('Calculating...');
  const [reachCount, setReachCount] = useState('Calculating...');

  // Compute reach using TensorFlow.js whenever form inputs change
  useEffect(() => {
    if (!isModalOpen) return;

    const runAnnounceTfInference = async () => {
      if (typeof window === 'undefined' || !window.tf) {
        setReachPct('TF Unavailable');
        return;
      }

      try {
        const tf = window.tf;
        const titleLen = title.length;
        const contentLen = content.length;

        const isAcad = tag === 'Academic' ? 1.0 : 0.4;
        const inputVal = [titleLen / 100.0, contentLen / 500.0, isAcad];

        const model = tf.sequential();
        model.add(tf.layers.dense({ units: 3, activation: 'tanh', inputShape: [3] }));
        model.add(tf.layers.dense({ units: 1, activation: 'sigmoid' }));

        const w1 = tf.tensor2d([
          [0.8],
          [-0.4],
          [0.6]
        ]);
        const b1 = tf.tensor1d([0.2]);
        model.layers[1].setWeights([w1, b1]);

        const inputTensor = tf.tensor2d([inputVal], [1, 3]);
        const outputTensor = model.predict(inputTensor);
        const outputVal = (await outputTensor.data())[0];

        inputTensor.dispose();
        outputTensor.dispose();
        w1.dispose();
        b1.dispose();
        model.dispose();

        let reachProb = outputVal;
        if (titleLen < 5 || contentLen < 10) {
          reachProb = 0.05;
        }

        const totalStudentsCount = students.length || 30;
        const reachedCountValue = Math.round(totalStudentsCount * reachProb);

        setReachPct((reachProb * 100).toFixed(1) + '%');
        setReachCount(reachedCountValue + ' students');

        if (reachProb > 0.6) {
          setReachStatus('High Engagement');
        } else if (reachProb > 0.3) {
          setReachStatus('Moderate Reach');
        } else {
          setReachStatus('Low Engagement Warning');
        }
      } catch (err) {
        console.error('TF Notice inference failed:', err);
      }
    };

    runAnnounceTfInference();
  }, [title, tag, content, isModalOpen, students.length]);

  const handlePostNotice = () => {
    if (!title.trim() || !content.trim()) {
      alert("Please enter a notice title and description brief.");
      return;
    }

    const today = new Date().toISOString().split('T')[0];
    const newAnn = {
      id: announcements.length + 1,
      title: title.trim(),
      tag,
      color,
      content: content.trim(),
      date: today
    };

    addAnnouncement(newAnn);
    setIsModalOpen(false);

    // Reset fields
    setTitle('');
    setTag('Academic');
    setColor('var(--color-brand-primary)');
    setContent('');

    alert("Notice posted on campus board!");
  };

  const handleRemoveNotice = (id) => {
    if (confirm("Are you sure you want to remove this broadcast notice?")) {
      deleteAnnouncement(id);
      alert("Broadcast notice removed.");
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
          <h1 className="text-3xl font-display font-bold text-brand-text-main">Notice Board & Campus Broadcasts</h1>
          <p className="text-brand-text-muted mt-1 text-sm">Read official academic, administrative, event, and system notices. Create new board notifications.</p>
        </div>
        {currentUser?.role !== 'student' && (
          <button className="btn btn-primary cursor-pointer flex items-center gap-2" onClick={() => setIsModalOpen(true)}>
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Post Notice
          </button>
        )}
      </div>

      {/* Notices Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in mt-2">
        {announcements.length === 0 ? (
          <div className="card col-span-full text-center text-brand-text-muted p-8 bg-brand-bg-secondary border border-brand-border rounded-2xl">
            No notices posted on notice board.
          </div>
        ) : (
          announcements.map((ann) => (
            <div 
              key={ann.id} 
              className="card p-6 bg-brand-bg-secondary border border-brand-border rounded-2xl flex flex-col gap-4" 
              style={{ borderLeft: `5px solid ${ann.color || 'var(--color-brand-primary)'}` }}
            >
              <div className="flex justify-between items-center">
                <span className="badge bg-brand-bg-tertiary text-brand-text-main font-bold text-xs px-2.5 py-0.5 rounded-full">{ann.tag}</span>
                <span className="text-xs text-brand-text-subtle font-mono">{ann.date}</span>
              </div>
              <div>
                <h3 className="font-display text-lg mb-1.5 font-semibold text-brand-text-main leading-snug">{ann.title}</h3>
                <p className="text-brand-text-muted text-sm leading-relaxed whitespace-pre-wrap">{ann.content}</p>
              </div>
              {currentUser?.role !== 'student' && (
                <div className="flex justify-end gap-2 mt-auto pt-2.5 border-t border-brand-border">
                  <button 
                    className="btn btn-secondary btn-sm edit-notice-btn text-brand-accent-ruby hover:bg-brand-accent-ruby/10 cursor-pointer font-medium" 
                    onClick={() => handleRemoveNotice(ann.id)}
                  >
                    Remove Notice
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* POST NOTICE MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center z-[1000] p-4">
          <div className="modal-container bg-brand-bg-secondary border border-brand-border rounded-[20px] w-full max-w-[550px] shadow-2xl animate-fade-in">
            <div className="modal-header p-5 px-6 border-b border-brand-border flex items-center justify-between">
              <h3 className="modal-title font-display text-xl font-semibold text-brand-text-main">Post Notice Board Broadcast</h3>
              <button className="modal-close bg-transparent border-none text-brand-text-muted cursor-pointer text-2xl" onClick={() => setIsModalOpen(false)}>&times;</button>
            </div>
            <div className="modal-body p-6 flex flex-col gap-4">
              <div className="form-group flex flex-col gap-1.5">
                <label className="form-label text-xs font-semibold text-brand-text-muted">Notice Title</label>
                <input 
                  type="text" 
                  className="bg-brand-bg-tertiary border border-brand-border text-brand-text-main p-2.5 rounded-xl outline-none" 
                  placeholder="e.g. End Semester Holiday Schedule"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="form-group flex flex-col gap-1.5">
                  <label className="form-label text-xs font-semibold text-brand-text-muted">Broadcast Tag</label>
                  <select 
                    className="bg-brand-bg-tertiary border border-brand-border text-brand-text-main p-2.5 rounded-xl outline-none" 
                    value={tag}
                    onChange={(e) => setTag(e.target.value)}
                  >
                    <option>Academic</option>
                    <option>Event</option>
                    <option>System</option>
                    <option>Administration</option>
                  </select>
                </div>
                <div className="form-group flex flex-col gap-1.5">
                  <label className="form-label text-xs font-semibold text-brand-text-muted">Color Theme Accent</label>
                  <select 
                    className="bg-brand-bg-tertiary border border-brand-border text-brand-text-main p-2.5 rounded-xl outline-none" 
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                  >
                    <option value="var(--color-brand-primary)">Indigo (Academic)</option>
                    <option value="var(--color-brand-accent-emerald)">Emerald (Event)</option>
                    <option value="var(--color-brand-accent-ruby)">Ruby (Alerts)</option>
                    <option value="var(--color-brand-accent-cyan)">Cyan (Tech)</option>
                  </select>
                </div>
              </div>
              <div className="form-group flex flex-col gap-1.5">
                <label className="form-label text-xs font-semibold text-brand-text-muted">Broadcast Content Details</label>
                <textarea 
                  className="bg-brand-bg-tertiary border border-brand-border text-brand-text-main p-2.5 rounded-xl outline-none resize-none" 
                  rows="4" 
                  placeholder="Enter notice brief descriptions..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  required
                ></textarea>
              </div>

              {/* AI Notice Engagement Reach Predictor */}
              <div className="card p-4 bg-brand-bg-tertiary border border-brand-border rounded-xl mt-2">
                <div className="flex items-center justify-between mb-3 pb-2 border-b border-brand-border/40">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-brand-primary animate-pulse"></span>
                    <span className="text-xs font-bold uppercase tracking-wider text-brand-text-main font-display">AI Notice Reach Predictor</span>
                  </div>
                  <span className={`badge text-[0.65rem] py-0.5 px-2 font-mono rounded ${
                    reachStatus.includes('High') ? 'bg-brand-accent-emerald/20 text-brand-accent-emerald' : 
                    reachStatus.includes('Moderate') ? 'bg-brand-accent-amber/20 text-brand-accent-amber' : 
                    'bg-brand-accent-ruby/20 text-brand-accent-ruby'
                  }`}>
                    {reachStatus}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-3 text-xs text-brand-text-muted">
                  <div>
                    <span className="text-[0.7rem] text-brand-text-subtle">Estimated Read Rate:</span>
                    <div className="font-bold text-brand-text-main font-mono text-sm mt-0.5">{reachPct}</div>
                  </div>
                  <div>
                    <span className="text-[0.7rem] text-brand-text-subtle">Target Audience Reach:</span>
                    <div className="font-bold text-brand-text-main font-mono text-sm mt-0.5">{reachCount}</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-footer p-4 px-6 border-t border-brand-border flex justify-end gap-3">
              <button className="btn btn-secondary cursor-pointer" onClick={() => setIsModalOpen(false)}>Cancel</button>
              <button className="btn btn-primary cursor-pointer" onClick={handlePostNotice}>Post Board Notice</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
