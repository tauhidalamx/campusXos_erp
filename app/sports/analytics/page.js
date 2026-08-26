'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  Tv, 
  Activity, 
  Settings, 
  Play, 
  Pause, 
  SkipForward, 
  Clock, 
  AlertCircle, 
  CheckCircle, 
  Video, 
  Trophy, 
  TrendingUp, 
  Sliders, 
  Download, 
  RefreshCw 
} from 'lucide-react';

export default function SportsAnalyticsPage() {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Video Source Configuration
  const [videoSource, setVideoSource] = useState('local_mp4');
  const [customUrl, setCustomUrl] = useState('');
  
  // Real-time telemetry frames
  const [frameData, setFrameData] = useState(null);
  const [wsStatus, setWsStatus] = useState('DISCONNECTED');
  const [highlights, setHighlights] = useState([]);
  
  // Replay controls
  const [isPlaying, setIsPlaying] = useState(true);
  const [playbackSpeed, setPlaybackSpeed] = useState(1.0);
  const [activeAnalysisOverlay, setActiveAnalysisOverlay] = useState('offside'); // 'offside', 'heatmap', 'pass_network'

  // Canvas Refs
  const canvasRef = useRef(null);
  const radarRef = useRef(null);
  const wsRef = useRef(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const session = sessionStorage.getItem('campusx_erp_session');
      if (session) {
        setCurrentUser(JSON.parse(session));
      }
      setLoading(false);
      fetchHighlights();
    }
    
    // Connect WebSocket
    connectWebSocket();

    return () => {
      if (wsRef.current) wsRef.current.close();
    };
  }, []);

  const connectWebSocket = () => {
    setWsStatus('CONNECTING');
    const wsUrl = `ws://${window.location.hostname}:8000/ws/analytics`;
    
    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;

    ws.onopen = () => {
      setWsStatus('CONNECTED');
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setFrameData(data);
      
      // Update canvas drawings
      drawFrameOverlays(data);
      draw2DRadar(data);
    };

    ws.onerror = () => {
      setWsStatus('DISCONNECTED');
    };

    ws.onclose = () => {
      setWsStatus('DISCONNECTED');
      // Attempt auto reconnection every 5 seconds
      setTimeout(() => {
        if (wsRef.current && wsRef.current.readyState === WebSocket.CLOSED) {
          connectWebSocket();
        }
      }, 5000);
    };
  };

  const fetchHighlights = async () => {
    try {
      const res = await fetch('/api/sports/highlights');
      const data = await res.json();
      setHighlights(data);
    } catch (err) {
      console.error('Error fetching highlights:', err);
    }
  };

  const triggerBookmark = async (eventType, player = "Jackson Cole", teamId = 1) => {
    try {
      const res = await fetch('/api/sports/bookmark', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event_type: eventType,
          player,
          team_id: teamId,
          match_time: frameData?.analysis?.match_time || "72:45"
        })
      });
      const data = await res.json();
      if (data.success) {
        alert(`Event '${eventType}' successfully registered on Ledger. Transaction Hash: ${data.tx_hash}`);
        fetchHighlights();
      }
    } catch (err) {
      console.error('Error triggering highlight bookmark:', err);
    }
  };

  // OpenCV Frame Canvas Overlays Renderer
  const drawFrameOverlays = (data) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const w = canvas.width;
    const h = canvas.height;

    // Draw field background representing broadcast camera frame
    ctx.fillStyle = '#1e3d22';
    ctx.fillRect(0, 0, w, h);

    // Draw penalty box outlines
    ctx.strokeStyle = 'rgba(255,255,255,0.4)';
    ctx.lineWidth = 2;
    ctx.strokeRect(100, 200, 1720, 680);
    ctx.strokeRect(100, 350, 300, 380);
    ctx.strokeRect(1520, 350, 300, 380);

    // Draw center circle
    ctx.beginPath();
    ctx.arc(w / 2, h / 2, 120, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(w / 2, 200);
    ctx.lineTo(w / 2, 880);
    ctx.stroke();

    // Draw offside line if selected
    if (activeAnalysisOverlay === 'offside' && data.offside_line) {
      const defX = data.offside_line.defender_x_pixel;
      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 3;
      ctx.setLineDash([6, 6]);
      ctx.beginPath();
      ctx.moveTo(defX, 200);
      ctx.lineTo(defX, 880);
      ctx.stroke();
      ctx.setLineDash([]);
      
      ctx.fillStyle = '#ef4444';
      ctx.font = '10px monospace';
      ctx.fillText(`OFFSIDE LINE (DEFENDER)`, defX + 8, 220);
    }

    // Draw Heatmap overlays if selected
    if (activeAnalysisOverlay === 'heatmap') {
      ctx.fillStyle = 'rgba(239, 68, 68, 0.15)';
      ctx.beginPath();
      ctx.arc(w * 0.45, h * 0.52, 150, 0, 2 * Math.PI);
      ctx.fill();
      ctx.fillStyle = 'rgba(59, 130, 246, 0.15)';
      ctx.beginPath();
      ctx.arc(w * 0.65, h * 0.48, 120, 0, 2 * Math.PI);
      ctx.fill();
    }

    // Draw tracking targets bounding boxes
    if (data.tracks) {
      data.tracks.forEach(track => {
        const [x1, y1, x2, y2] = track.bbox;
        // Scale simulated coordinates mapping to canvas size
        const scaleX = w / 1920;
        const scaleY = h / 1080;
        
        const cx1 = x1 * scaleX;
        const cy1 = y1 * scaleY;
        const cx2 = x2 * scaleX;
        const cy2 = y2 * scaleY;

        if (track.class_id === 2) {
          // Ball tracking: highlight circle
          ctx.strokeStyle = '#eab308';
          ctx.fillStyle = '#eab308';
          ctx.beginPath();
          ctx.arc(cx1 + 5, cy1 + 5, 8, 0, 2 * Math.PI);
          ctx.fill();
          ctx.stroke();
        } else if (track.class_id === 1) {
          // Referee tracking: magenta box
          ctx.strokeStyle = '#ec4899';
          ctx.lineWidth = 1.5;
          ctx.strokeRect(cx1, cy1, cx2 - cx1, cy2 - cy1);
          ctx.fillStyle = '#ec4899';
          ctx.font = '8px sans-serif';
          ctx.fillText(`REF ID:${track.track_id}`, cx1, cy1 - 4);
        } else {
          // Player tracking: blue or red depending on team
          const isTeamA = track.team_id === 1;
          ctx.strokeStyle = isTeamA ? '#3b82f6' : '#22c55e';
          ctx.lineWidth = 1.5;
          ctx.strokeRect(cx1, cy1, cx2 - cx1, cy2 - cy1);
          
          // Draw tracking label anchor
          ctx.fillStyle = isTeamA ? '#3b82f6' : '#22c55e';
          ctx.font = '8px monospace';
          ctx.fillText(`PL ID:${track.track_id} (T${track.team_id})`, cx1, cy1 - 4);
        }
      });
    }
  };

  // 2D Tactical Radar view
  const draw2DRadar = (data) => {
    const radar = radarRef.current;
    if (!radar) return;
    const ctx = radar.getContext('2d');
    const w = radar.width;
    const h = radar.height;

    // Clear background
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, w, h);

    // Draw field boundary outline
    ctx.strokeStyle = 'rgba(255,255,255,0.15)';
    ctx.lineWidth = 2;
    ctx.strokeRect(20, 20, w - 40, h - 40);
    ctx.beginPath();
    ctx.moveTo(w / 2, 20);
    ctx.lineTo(w / 2, h - 20);
    ctx.stroke();
    
    ctx.beginPath();
    ctx.arc(w / 2, h / 2, 40, 0, 2 * Math.PI);
    ctx.stroke();

    // Plot players centroid circles
    if (data.analysis && data.analysis.centroids) {
      const centA = data.analysis.centroids.team_a;
      const centB = data.analysis.centroids.team_b;

      // Scale points from 105x68 meters grid to radar canvas size
      const scaleX = (w - 40) / 105.0;
      const scaleY = (h - 40) / 68.0;

      // Team A Centroid (Blue)
      ctx.fillStyle = 'rgba(59, 130, 246, 0.4)';
      ctx.beginPath();
      ctx.arc(20 + centA[0] * scaleX, 20 + centA[1] * scaleY, 15, 0, 2 * Math.PI);
      ctx.fill();

      // Team B Centroid (Green)
      ctx.fillStyle = 'rgba(34, 197, 94, 0.4)';
      ctx.beginPath();
      ctx.arc(20 + centB[0] * scaleX, 20 + centB[1] * scaleY, 15, 0, 2 * Math.PI);
      ctx.fill();
    }

    // Plot individual player dots
    if (data.tracks) {
      data.tracks.forEach(track => {
        if (track.class_id === 0) {
          const isTeamA = track.team_id === 1;
          // Simulated position conversion
          const x = isTeamA ? 30.0 + (track.track_id * 5) % 40 : 60.0 + (track.track_id * 5) % 40;
          const y = 10.0 + (track.track_id * 8) % 50;

          const scaleX = (w - 40) / 105.0;
          const scaleY = (h - 40) / 68.0;

          ctx.fillStyle = isTeamA ? '#3b82f6' : '#22c55e';
          ctx.beginPath();
          ctx.arc(20 + x * scaleX, 20 + y * scaleY, 5, 0, 2 * Math.PI);
          ctx.fill();
        }
      });
    }
  };

  if (loading) return null;

  return (
    <div className="flex flex-col gap-6 md:gap-8 fade-in text-white">
      {/* Page Title */}
      <div className="flex justify-between items-center pb-4 border-b border-brand-border/40">
        <div>
          <h1 className="text-3xl font-display font-bold tracking-tight flex items-center gap-3">
            <Tv className="w-8 h-8 text-brand-primary" />
            CampusX AI Football Analytics OS
          </h1>
          <p className="text-brand-text-muted text-sm mt-1">
            Real-time YOLOv11 target classification, homography perspective projection, and tactical event notary system.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${
            wsStatus === 'CONNECTED' 
              ? 'bg-brand-accent-emerald/10 border-brand-accent-emerald/30 text-brand-accent-emerald' 
              : 'bg-brand-accent-red/10 border-brand-accent-red/30 text-brand-accent-red animate-pulse'
          }`}>
            <span className={`w-2 h-2 rounded-full ${wsStatus === 'CONNECTED' ? 'bg-brand-accent-emerald' : 'bg-brand-accent-red'}`} />
            CV Engine: {wsStatus}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Columns: Video Feed & Overlay Controls */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* Main Video/Overlay Screen */}
          <div className="card bg-brand-bg-secondary border border-brand-border rounded-2xl overflow-hidden p-1.5">
            <div className="relative aspect-video w-full rounded-xl overflow-hidden border border-brand-border/60">
              <canvas 
                ref={canvasRef} 
                width={854} 
                height={480} 
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10 text-[10px] font-mono flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-brand-accent-cyan rounded-full animate-ping" />
                CAM_MAIN: BROADCAST PERSPECTIVE (1080P)
              </div>
              <div className="absolute top-4 right-4 bg-black/70 backdrop-blur-md px-3 py-2 rounded-lg border border-white/10 text-[9px] font-mono flex flex-col gap-1 text-brand-text-muted">
                <div className="flex justify-between gap-4">
                  <span>Processing FPS:</span>
                  <span className="text-brand-accent-emerald font-bold">{frameData?.telemetry?.fps || 60} FPS</span>
                </div>
                <div className="flex justify-between gap-4">
                  <span>CV Latency:</span>
                  <span className="text-brand-accent-cyan font-bold">{frameData?.telemetry?.latency_ms || 12.4} ms</span>
                </div>
                <div className="flex justify-between gap-4">
                  <span>GPU / CPU:</span>
                  <span className="text-white">{frameData?.telemetry?.gpu_load || 40}% / {frameData?.telemetry?.cpu_load || 20}%</span>
                </div>
                <div className="flex justify-between gap-4">
                  <span>VRAM:</span>
                  <span className="text-white">{frameData?.telemetry?.vram_used_gb || 3.4} GB</span>
                </div>
              </div>
            </div>
            
            {/* Overlay View Controls */}
            <div className="flex justify-between items-center px-4 py-3 bg-brand-bg-tertiary/60 border-t border-brand-border/40 mt-1.5 rounded-xl text-xs gap-3">
              <div className="flex gap-2">
                <button 
                  onClick={() => setActiveAnalysisOverlay('offside')}
                  className={`px-3 py-1.5 rounded-lg font-bold transition-all ${activeAnalysisOverlay === 'offside' ? 'bg-brand-primary text-white' : 'hover:bg-brand-bg-secondary text-brand-text-muted'}`}
                >
                  3D Offside Line
                </button>
                <button 
                  onClick={() => setActiveAnalysisOverlay('heatmap')}
                  className={`px-3 py-1.5 rounded-lg font-bold transition-all ${activeAnalysisOverlay === 'heatmap' ? 'bg-brand-primary text-white' : 'hover:bg-brand-bg-secondary text-brand-text-muted'}`}
                >
                  Possession Heatmap
                </button>
              </div>

              {/* Player Timeline Bar */}
              <div className="flex items-center gap-3">
                <button className="p-2 hover:bg-brand-bg-secondary rounded-lg text-brand-text-muted">
                  <Pause className="w-4 h-4 text-white" />
                </button>
                <span className="font-mono text-brand-text-muted">72:45 / 90:00</span>
                <span className="text-[10px] bg-brand-bg-secondary border border-brand-border px-2 py-0.5 rounded font-mono text-brand-accent-cyan">
                  {playbackSpeed}x Speed
                </span>
              </div>
            </div>
          </div>

          {/* Configuration / Source Selection Panel */}
          <div className="card bg-brand-bg-secondary border border-brand-border rounded-2xl p-6 flex flex-col gap-4">
            <h3 className="text-lg font-bold font-display flex items-center gap-2">
              <Sliders className="w-5 h-5 text-brand-primary" />
              Stream Ingestion Configuration
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="flex flex-col gap-1.5">
                <span className="text-brand-text-muted font-semibold">Video Input Source</span>
                <select 
                  className="bg-brand-bg-tertiary border border-brand-border rounded-lg p-2.5 text-white"
                  value={videoSource}
                  onChange={(e) => setVideoSource(e.target.value)}
                >
                  <option value="local_mp4">Local MP4 files</option>
                  <option value="rtsp">RTSP Camera Stream</option>
                  <option value="hls">HLS Broadcast URL</option>
                  <option value="webcam">USB Stadium Feed</option>
                </select>
              </div>

              <div className="sm:col-span-2 flex flex-col gap-1.5">
                <span className="text-brand-text-muted font-semibold">Source URL / Path</span>
                <input 
                  type="text" 
                  placeholder="rtsp://admin:secret@10.0.0.45:554/live or /uploads/match.mp4" 
                  className="bg-brand-bg-tertiary border border-brand-border rounded-lg p-2 text-white"
                  value={customUrl}
                  onChange={(e) => setCustomUrl(e.target.value)}
                />
              </div>
            </div>
            
            <div className="text-[10px] text-brand-text-muted leading-relaxed">
              {"Note: The system pipeline supports custom RTSP/HLS stream addresses. The homography matrix will dynamically calibrate coordinates when a new broadcast camera perspective is supplied."}
            </div>
          </div>
        </div>

        {/* Right 1 Column: Tactical Radar, Predictions & Highlights */}
        <div className="flex flex-col gap-6">
          {/* 2D Tactical Radar Card */}
          <div className="card bg-brand-bg-secondary border border-brand-border rounded-2xl p-5 flex flex-col gap-4">
            <h3 className="text-sm font-bold font-display flex items-center gap-2 border-b border-brand-border/40 pb-2">
              <Activity className="w-4 h-4 text-brand-accent-cyan" />
              2D Pitch Radar Centroids
            </h3>
            <canvas 
              ref={radarRef} 
              width={300} 
              height={200} 
              className="w-full aspect-[1.5] rounded-xl overflow-hidden border border-brand-border/60"
            />
          </div>

          {/* AI Tactical predictions */}
          <div className="card bg-brand-bg-secondary border border-brand-border rounded-2xl p-5 flex flex-col gap-4 text-xs">
            <h3 className="text-sm font-bold font-display flex items-center gap-2 border-b border-brand-border/40 pb-2">
              <Trophy className="w-4 h-4 text-brand-accent-amber" />
              AI Match Forecast Projections (Multi-Model Temporal)
            </h3>

            {/* Model Selector / Framework Indicator */}
            <div className="flex justify-between items-center bg-brand-bg-tertiary px-2.5 py-1.5 rounded border border-brand-border/40 text-[9px] font-mono mb-1">
              <span className="text-brand-text-muted">Framework:</span>
              <span className="text-brand-accent-cyan font-bold">{frameData?.predictions_comparison?.framework || 'NumPy (CPU-bound)'}</span>
            </div>

            <div className="grid grid-cols-2 gap-4 border-b border-brand-border/30 pb-3 mb-2 font-mono text-[10px]">
              {/* LSTM column */}
              <div className="flex flex-col gap-2 p-2 bg-brand-bg-tertiary/40 rounded border border-brand-border/20">
                <span className="text-brand-accent-cyan font-bold text-[9px] uppercase tracking-wider">RNN/LSTM Model</span>
                <div className="flex justify-between">
                  <span className="text-brand-text-muted">Win A:</span>
                  <span className="text-white font-bold">{frameData?.predictions_comparison?.lstm_projection?.win_probability_a ?? '45.0'}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-brand-text-muted">Win B:</span>
                  <span className="text-white font-bold">{frameData?.predictions_comparison?.lstm_projection?.win_probability_b ?? '45.0'}%</span>
                </div>
                <div className="flex justify-between border-t border-brand-border/20 pt-1 text-[8px]">
                  <span className="text-brand-text-muted">Latency:</span>
                  <span className="text-brand-accent-emerald font-bold">{frameData?.predictions_comparison?.lstm_projection?.latency_ms ?? '0.12'} ms</span>
                </div>
              </div>

              {/* Transformer column */}
              <div className="flex flex-col gap-2 p-2 bg-brand-bg-tertiary/40 rounded border border-brand-border/20">
                <span className="text-brand-accent-amber font-bold text-[9px] uppercase tracking-wider">Transformer</span>
                <div className="flex justify-between">
                  <span className="text-brand-text-muted">Win A:</span>
                  <span className="text-white font-bold">{frameData?.predictions_comparison?.transformer_projection?.win_probability_a ?? '46.0'}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-brand-text-muted">Win B:</span>
                  <span className="text-white font-bold">{frameData?.predictions_comparison?.transformer_projection?.win_probability_b ?? '44.0'}%</span>
                </div>
                <div className="flex justify-between border-t border-brand-border/20 pt-1 text-[8px]">
                  <span className="text-brand-text-muted">Latency:</span>
                  <span className="text-brand-accent-emerald font-bold">{frameData?.predictions_comparison?.transformer_projection?.latency_ms ?? '0.45'} ms</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2.5 font-mono text-[11px]">
              <div className="flex justify-between">
                <span className="text-brand-text-muted">Expected Goals (xG)</span>
                <span className="text-white">
                  {frameData?.analysis?.predictions?.expected_goals_a || '1.2'} - {frameData?.analysis?.predictions?.expected_goals_b || '1.1'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-brand-text-muted">Possession Leader</span>
                <span className="text-brand-accent-cyan font-bold">
                  Team {frameData?.analysis?.possession_team || 'A'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-brand-text-muted">Tactical Shape (Team A)</span>
                <span className="text-white">
                  {frameData?.analysis?.tactics?.team_a || 'Mid Block'}
                </span>
              </div>
            </div>
          </div>

          {/* Weather Intelligence panel */}
          <div className="card bg-brand-bg-secondary border border-brand-border rounded-2xl p-5 flex flex-col gap-4 text-xs">
            <h3 className="text-sm font-bold font-display flex items-center gap-2 border-b border-brand-border/40 pb-2">
              <Activity className="w-4 h-4 text-brand-accent-cyan" />
              Stadium Weather Intelligence
            </h3>
            
            <div className="grid grid-cols-2 gap-3 font-mono text-[10px]">
              <div className="flex flex-col gap-0.5">
                <span className="text-brand-text-muted">Temperature</span>
                <span className="text-white font-bold text-xs">{frameData?.weather?.current?.temperature ?? '22.4'} °C</span>
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-brand-text-muted">Wind Speed / Angle</span>
                <span className="text-white font-bold text-xs">
                  {frameData?.weather?.current?.wind_speed ?? '3.2'} m/s ({frameData?.weather?.current?.wind_deg ?? '180'}°)
                </span>
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-brand-text-muted">Humidity</span>
                <span className="text-white font-bold text-xs">{frameData?.weather?.current?.humidity ?? '55'} %</span>
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-brand-text-muted">Rain level (1h)</span>
                <span className="text-white font-bold text-xs">{frameData?.weather?.current?.rain_1h ?? '0.0'} mm</span>
              </div>
            </div>

            {/* Tactical Impacts mapping */}
            <div className="bg-brand-bg-tertiary/60 border border-brand-border/40 rounded-xl p-3 flex flex-col gap-2 font-mono text-[10px] mt-1">
              <span className="text-brand-accent-cyan font-bold text-[9px] uppercase tracking-wider">AI Tactical Impact Calculations</span>
              
              <div className="flex justify-between">
                <span className="text-brand-text-muted">Fatigue rate factor:</span>
                <span className="text-brand-accent-orange font-bold">x{frameData?.weather?.impact?.fatigue_drain_multiplier ?? '1.000'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-brand-text-muted">Passing accuracy factor:</span>
                <span className="text-brand-accent-emerald font-bold">x{frameData?.weather?.impact?.passing_accuracy_multiplier ?? '1.000'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-brand-text-muted">Pitch surface friction:</span>
                <span className="text-white">{frameData?.weather?.impact?.pitch_surface_friction ?? '0.90'}</span>
              </div>
              <div className="flex justify-between border-t border-brand-border/20 pt-1 text-[8px]">
                <span className="text-brand-text-muted">Wind trajectory drift:</span>
                <span className="text-brand-accent-cyan font-semibold border border-brand-border/10 p-0.5 rounded">
                  ({frameData?.weather?.impact?.ball_acceleration_drift?.x_m_s2 ?? '0.00'}, {frameData?.weather?.impact?.ball_acceleration_drift?.y_m_s2 ?? '0.00'}) m/s²
                </span>
              </div>
            </div>

            <div className="text-[9px] text-brand-text-muted italic text-center">
              Source: {frameData?.weather?.current?.provider || 'OpenWeatherMap'} (Stadium Location API)
            </div>
          </div>

          {/* Instantly trigger Bookmarks */}
          <div className="card bg-brand-bg-secondary border border-brand-border rounded-2xl p-5 flex flex-col gap-4 text-xs">
            <h3 className="text-sm font-bold font-display flex items-center gap-2 border-b border-brand-border/40 pb-2">
              <Video className="w-4 h-4 text-brand-primary" />
              Real-time Highlight Triggers
            </h3>
            
            <div className="grid grid-cols-2 gap-2">
              <button 
                onClick={() => triggerBookmark('GOAL')}
                className="p-2.5 bg-brand-accent-emerald/10 border border-brand-accent-emerald/30 hover:bg-brand-accent-emerald/20 text-brand-accent-emerald font-bold rounded-lg transition-all"
              >
                ⚽ Goal Bookmark
              </button>
              <button 
                onClick={() => triggerBookmark('FOUL')}
                className="p-2.5 bg-brand-accent-red/10 border border-brand-accent-red/30 hover:bg-brand-accent-red/20 text-brand-accent-red font-bold rounded-lg transition-all"
              >
                ⚠️ Foul Bookmark
              </button>
              <button 
                onClick={() => triggerBookmark('SAVE')}
                className="p-2.5 bg-brand-primary/10 border border-brand-primary/30 hover:bg-brand-primary/20 text-brand-primary font-bold rounded-lg transition-all"
              >
                🧤 Save Bookmark
              </button>
              <button 
                onClick={() => triggerBookmark('RED_CARD')}
                className="p-2.5 bg-brand-accent-ruby/10 border border-brand-accent-ruby/30 hover:bg-brand-accent-ruby/20 text-brand-accent-ruby font-bold rounded-lg transition-all"
              >
                🟥 Red Card
              </button>
            </div>

            {/* Event Alignment Feed */}
            <div className="flex flex-col gap-2 mt-4">
              <span className="text-brand-text-muted font-bold uppercase tracking-wider text-[10px] block">Ecosystem Event Alignment Log</span>
              <div className="max-h-[220px] overflow-y-auto flex flex-col gap-1.5">
                {!frameData?.aligned_events || frameData.aligned_events.length === 0 ? (
                  <span className="text-brand-text-muted text-[10px]">Awaiting event triggers...</span>
                ) : (
                  frameData.aligned_events.map((item, idx) => {
                    const status = item.status;
                    const reason = item.reason;
                    const ev = item.cv_event || item.api_event;
                    
                    let statusColor = 'text-brand-accent-emerald bg-brand-accent-emerald/10 border-brand-accent-emerald/30';
                    let statusLabel = 'ALIGNED';
                    if (status === 'ALIGNED_WITH_DISCREPANCY') {
                      statusColor = 'text-brand-accent-amber bg-brand-accent-amber/10 border-brand-accent-amber/30';
                      statusLabel = 'DISCREPANCY';
                    } else if (status === 'MISMATCHED_CV_ONLY') {
                      statusColor = 'text-brand-accent-orange bg-brand-accent-orange/10 border-brand-accent-orange/30';
                      statusLabel = 'AI GHOST EVENT';
                    } else if (status === 'MISMATCHED_API_ONLY') {
                      statusColor = 'text-brand-accent-red bg-brand-accent-red/10 border-brand-accent-red/30';
                      statusLabel = 'MISSED EVENT';
                    }

                    return (
                      <div key={idx} className="p-2.5 bg-brand-bg-tertiary border border-brand-border/40 rounded-lg flex flex-col gap-1.5 text-[10px]">
                        <div className="flex justify-between items-center">
                          <span className="font-bold text-white">{ev?.event || ev?.type} ({ev?.match_time || ev?.time})</span>
                          <span className={`px-2 py-0.5 rounded text-[8px] border font-bold ${statusColor}`}>{statusLabel}</span>
                        </div>
                        <span className="text-brand-text-muted font-semibold">Player: {ev?.player || "Unknown Player"}</span>
                        {status !== 'ALIGNED' && (
                          <span className="text-brand-accent-amber font-mono text-[8px] bg-brand-accent-amber/5 p-1 rounded border border-brand-accent-amber/20 mt-0.5">
                            CAMPUSX OS Flag: {reason}
                          </span>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
