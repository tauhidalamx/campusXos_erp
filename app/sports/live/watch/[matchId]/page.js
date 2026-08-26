'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'next/navigation';
import { 
  Tv, 
  Users, 
  MessageSquare, 
  Clock, 
  Maximize2, 
  Minimize2, 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  AlertCircle, 
  Trophy, 
  TrendingUp, 
  Activity, 
  Zap 
} from 'lucide-react';

export default function WatchLiveMatchPage() {
  const { matchId } = useParams();
  const [user, setUser] = useState(null);
  const [matchDetails, setMatchDetails] = useState(null);
  const [streamInfo, setStreamInfo] = useState(null);
  const [chatComments, setChatComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  
  // Player state
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1.0);
  const [viewerCount, setViewerCount] = useState(0);
  const [matchTimer, setMatchTimer] = useState(4365); // 72:45 in seconds

  // AI & Analytics states
  const [aiInsights, setAiInsights] = useState({
    winProbabilityA: 62.4,
    winProbabilityB: 37.6,
    xgA: 1.8,
    xgB: 1.1,
    momentumTrend: 'High Press (CampusX United)',
    summary: 'CampusX United has dominated the mid-block with a high recovery rate, while weather fatigue (humidity 65%) is starting to affect the fullback stamina.'
  });

  const playerContainerRef = useRef(null);
  const videoCanvasRef = useRef(null);
  const timerIntervalRef = useRef(null);
  const chatIntervalRef = useRef(null);
  const hiddenVideoRef = useRef(null);
  const pollStreamIntervalRef = useRef(null);

  const pollStreamInfo = async () => {
    try {
      const resStream = await fetch(`/api/sports/streams/match/${matchId}`);
      const dataStream = await resStream.json();
      if (dataStream.success && dataStream.stream) {
        setStreamInfo(dataStream.stream);
        setViewerCount(dataStream.stream.viewer_count || 12);
        
        if (dataStream.stream.stream_status === 'LIVE') {
          setIsPlaying(true);
        } else if (dataStream.stream.stream_status === 'ENDED' || dataStream.stream.stream_status === 'IDLE') {
          setIsPlaying(false);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const session = sessionStorage.getItem('campusx_erp_session');
      if (session) {
        setUser(JSON.parse(session));
      }
      fetchMatchInfo();

      // Poll stream info to dynamically detect broadcast updates/video uploads
      clearInterval(pollStreamIntervalRef.current);
      pollStreamIntervalRef.current = setInterval(pollStreamInfo, 3000);
    }

    return () => {
      clearInterval(timerIntervalRef.current);
      clearInterval(chatIntervalRef.current);
      clearInterval(pollStreamIntervalRef.current);
    };
  }, [matchId]);

  // Sync hidden video element state with player controllers
  useEffect(() => {
    const video = hiddenVideoRef.current;
    if (!video) return;
    if (isPlaying) {
      video.play().catch(err => console.log('Play interrupted', err));
    } else {
      video.pause();
    }
  }, [isPlaying, streamInfo?.metadata?.uploaded_video_url]);

  useEffect(() => {
    const video = hiddenVideoRef.current;
    if (!video) return;
    video.muted = isMuted;
  }, [isMuted]);

  useEffect(() => {
    const video = hiddenVideoRef.current;
    if (!video) return;
    video.playbackRate = playbackSpeed;
  }, [playbackSpeed]);

  const fetchMatchInfo = async () => {
    try {
      // Get fixtures details
      const resFixtures = await fetch('/api/sports/fixtures');
      const fixtures = await resFixtures.json();
      const match = fixtures.find(f => f.id === matchId) || fixtures[0];
      setMatchDetails(match);

      // Get associated stream
      const resStream = await fetch(`/api/sports/streams/match/${matchId}`);
      const dataStream = await resStream.json();
      if (dataStream.success) {
        setStreamInfo(dataStream.stream);
        setViewerCount(dataStream.stream.viewer_count || 12);
        
        fetchChat(dataStream.stream.id);
        // Poll chat comments
        clearInterval(chatIntervalRef.current);
        chatIntervalRef.current = setInterval(() => fetchChat(dataStream.stream.id), 3000);
      }
      
      // Start match timer tick
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = setInterval(() => {
        setMatchTimer(prev => prev + 1);
      }, 1000);

      // Fetch AI updates from Websocket mock endpoint
      // Simulate telemetry
      setViewerCount(prev => prev + Math.floor(Math.random() * 4) - 1);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchChat = async (sId) => {
    try {
      const res = await fetch(`/api/sports/streams/${sId}/chat`);
      const data = await res.json();
      setChatComments(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handlePostChat = async (e) => {
    e.preventDefault();
    if (!newComment.trim() || !streamInfo) return;

    try {
      const res = await fetch(`/api/sports/streams/${streamInfo.id}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user?.id || 'usr_guest',
          userName: user?.name || 'Student Parent',
          userRole: user?.role || 'student',
          comment: newComment
        })
      });
      const data = await res.json();
      if (data.success) {
        setChatComments(prev => [...prev, data.comment]);
        setNewComment('');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const toggleFullscreen = () => {
    if (!playerContainerRef.current) return;
    
    if (!isFullscreen) {
      if (playerContainerRef.current.requestFullscreen) {
        playerContainerRef.current.requestFullscreen();
      }
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
      setIsFullscreen(false);
    }
  };

  const handlePiP = async () => {
    alert('Picture-in-Picture triggered. Floating watch window initialized.');
  };

  const formatTimer = (secs) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Draw simulated frames on video player canvas
  useEffect(() => {
    const canvas = videoCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let frameId;

    const render = () => {
      if (isPlaying) {
        const w = canvas.width;
        const h = canvas.height;

        // Check if there is an uploaded video to draw
        if (hiddenVideoRef.current && hiddenVideoRef.current.readyState >= 2) {
          ctx.drawImage(hiddenVideoRef.current, 0, 0, w, h);
        } else {
          ctx.fillStyle = '#0f172a';
          ctx.fillRect(0, 0, w, h);

          // Draw pitch grass background
          ctx.fillStyle = '#1e3d22';
          ctx.fillRect(20, 20, w - 40, h - 40);

          // Draw pitch center line
          ctx.strokeStyle = 'rgba(255,255,255,0.3)';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(w / 2, 20);
          ctx.lineTo(w / 2, h - 20);
          ctx.stroke();
          ctx.beginPath();
          ctx.arc(w / 2, h / 2, 60, 0, 2 * Math.PI);
          ctx.stroke();

          // Draw simulated players dots running
          const timeVal = Date.now() * 0.001;
          
          ctx.fillStyle = '#3b82f6'; // Team A (blue)
          for (let i = 0; i < 11; i++) {
            const x = w * 0.25 + Math.sin(timeVal + i) * 30;
            const y = h * 0.2 + (i * 35) + Math.cos(timeVal + i) * 15;
            ctx.beginPath();
            ctx.arc(x, y, 6, 0, 2 * Math.PI);
            ctx.fill();
          }

          ctx.fillStyle = '#22c55e'; // Team B (green)
          for (let i = 0; i < 11; i++) {
            const x = w * 0.75 + Math.cos(timeVal - i) * 30;
            const y = h * 0.2 + (i * 35) + Math.sin(timeVal - i) * 15;
            ctx.beginPath();
            ctx.arc(x, y, 6, 0, 2 * Math.PI);
            ctx.fill();
          }

          ctx.fillStyle = '#eab308'; // Ball (yellow)
          const ballX = w * 0.5 + Math.sin(timeVal * 1.5) * 120;
          const ballY = h * 0.5 + Math.cos(timeVal * 1.2) * 80;
          ctx.beginPath();
          ctx.arc(ballX, ballY, 4, 0, 2 * Math.PI);
          ctx.fill();
        }

        // Draw CV Overlay Graphics on top of video frames or pitch simulation
        const timeVal = Date.now() * 0.001;
        ctx.save();
        
        // Draw tactical circles tracking players
        ctx.strokeStyle = 'rgba(34, 197, 94, 0.8)'; // Green circle
        ctx.lineWidth = 1.5;
        
        // Simulating player 7 tracker
        const tracker1X = w * 0.4 + Math.sin(timeVal * 0.8) * 60;
        const tracker1Y = h * 0.5 + Math.cos(timeVal * 0.8) * 40;
        ctx.beginPath();
        ctx.arc(tracker1X, tracker1Y, 15, 0, 2 * Math.PI);
        ctx.stroke();
        
        // Draw dotted lines pointing to a player
        ctx.strokeStyle = 'rgba(59, 130, 246, 0.6)'; // Blue dashed line
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        ctx.moveTo(tracker1X, tracker1Y);
        ctx.lineTo(tracker1X + 40, tracker1Y - 30);
        ctx.stroke();
        ctx.setLineDash([]);
        
        // Draw text label next to circle
        ctx.fillStyle = 'rgba(15, 23, 42, 0.75)';
        ctx.fillRect(tracker1X + 42, tracker1Y - 42, 85, 18);
        ctx.strokeStyle = 'rgba(59, 130, 246, 0.5)';
        ctx.strokeRect(tracker1X + 42, tracker1Y - 42, 85, 18);
        
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 9px monospace';
        ctx.fillText('S. Terry [MF]', tracker1X + 47, tracker1Y - 30);
        
        // Draw target reticle on ball or highlight area
        const ballX = w * 0.6 + Math.sin(timeVal * 1.2) * 50;
        const ballY = h * 0.45 + Math.cos(timeVal * 1.1) * 35;
        
        ctx.strokeStyle = '#eab308'; // Yellow reticle
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(ballX, ballY, 8, 0, 2 * Math.PI);
        ctx.stroke();
        
        ctx.beginPath();
        ctx.moveTo(ballX - 12, ballY);
        ctx.lineTo(ballX + 12, ballY);
        ctx.moveTo(ballX, ballY - 12);
        ctx.lineTo(ballX, ballY + 12);
        ctx.stroke();
        
        ctx.fillStyle = '#eab308';
        ctx.font = 'bold 8px monospace';
        ctx.fillText('BALL_TRACK', ballX + 12, ballY - 6);
        
        // Draw top header HUD
        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.fillRect(20, h - 35, w - 40, 20);
        ctx.fillStyle = 'rgba(59, 130, 246, 0.8)';
        ctx.font = 'bold 8px monospace';
        ctx.fillText('LIVE CV PROCESSOR: ACTIVE | FPS: 60 | COMPRESSION: H.264 | NOTARY PROOF VERIFIED', 30, h - 22);

        ctx.restore();
      }

      frameId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(frameId);
  }, [isPlaying]);

  return (
    <div className="flex flex-col gap-6 md:gap-8 fade-in text-white">
      {/* Scoreboard Banner */}
      <div className="card bg-gradient-to-r from-brand-primary/20 via-brand-bg-secondary to-brand-bg-tertiary border border-brand-border/60 rounded-2xl p-6 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-brand-primary/10 border border-brand-primary/30 rounded-xl text-brand-primary">
            <Tv className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold font-display">{matchDetails?.competition || 'CampusX Champions Cup'}</h2>
            <span className="text-xs text-brand-text-muted">Venue: {matchDetails?.venue || 'University Stadium Complex'}</span>
          </div>
        </div>

        {/* Live Score block */}
        <div className="flex items-center gap-6 font-mono bg-black/40 border border-white/10 px-6 py-2.5 rounded-2xl">
          <div className="text-right">
            <span className="font-bold text-sm block">{matchDetails?.home_team || 'CampusX United'}</span>
            <span className="text-[10px] text-brand-text-muted">HOME</span>
          </div>
          
          <div className="text-2xl font-bold text-brand-accent-amber flex gap-2">
            <span>{matchDetails?.score?.split('-')[0] || '2'}</span>
            <span>:</span>
            <span>{matchDetails?.score?.split('-')[1] || '1'}</span>
          </div>

          <div>
            <span className="font-bold text-sm block">{matchDetails?.away_team || 'Consortium'}</span>
            <span className="text-[10px] text-brand-text-muted">AWAY</span>
          </div>

          <div className="border-l border-white/10 pl-6 text-brand-accent-cyan flex flex-col items-center">
            <span className="text-xs flex items-center gap-1"><Clock className="w-3.5 h-3.5 animate-spin" /> {formatTimer(matchTimer)}</span>
            <span className="text-[8px] bg-brand-accent-cyan/15 px-1.5 py-0.5 rounded border border-brand-accent-cyan/30 mt-1 uppercase font-bold tracking-wider">LIVE</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Player column */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* Video Container */}
          <div 
            ref={playerContainerRef}
            className="relative w-full aspect-video bg-black rounded-2xl overflow-hidden border border-brand-border/60 group"
          >
            <canvas 
              ref={videoCanvasRef}
              width={854}
              height={480}
              className="w-full h-full object-cover"
            />

            {streamInfo?.metadata?.uploaded_video_url && (
              <video 
                ref={hiddenVideoRef}
                src={streamInfo.metadata.uploaded_video_url}
                style={{ display: 'none' }}
                loop
                muted={isMuted}
                playsInline
              />
            )}

            {((streamInfo?.stream_status || streamInfo?.streamStatus) !== 'LIVE') && (
              <div className="absolute inset-0 bg-black/85 backdrop-blur-sm flex flex-col items-center justify-center gap-3 text-center p-6 z-10">
                <Tv className="w-12 h-12 text-brand-primary opacity-60 animate-pulse" />
                <h3 className="text-lg font-bold font-display">Broadcast is Offline</h3>
                <p className="text-xs text-brand-text-muted max-w-xs">
                  The broadcaster has not started the live stream for this match yet.
                </p>
              </div>
            )}

            {/* Overlays details */}
            <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded border border-white/10 text-[9px] font-mono flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-accent-emerald animate-ping" />
              STREAM_STATUS: {streamInfo?.stream_status || streamInfo?.streamStatus || 'LIVE'} ({streamInfo?.resolution || '1080p'})
            </div>

            <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded border border-white/10 text-[9px] font-mono flex items-center gap-1.5 text-brand-text-muted">
              <span>{viewerCount} Viewers</span>
            </div>

            {/* Controls Bar */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4 flex justify-between items-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-xs">
              <div className="flex items-center gap-4">
                <button onClick={togglePlay} className="text-white hover:text-brand-primary transition-colors">
                  {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 fill-white" />}
                </button>
                <button onClick={toggleMute} className="text-white hover:text-brand-primary transition-colors">
                  {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                </button>
              </div>

              <div className="flex items-center gap-3">
                <button onClick={handlePiP} className="text-[10px] bg-white/10 hover:bg-white/20 border border-white/10 px-2 py-0.5 rounded">
                  PiP
                </button>
                
                <select 
                  className="bg-black/80 border border-white/20 rounded px-1 py-0.5 text-[10px]"
                  value={playbackSpeed}
                  onChange={(e) => setPlaybackSpeed(parseFloat(e.target.value))}
                >
                  <option value="0.5">0.5x</option>
                  <option value="1.0">1.0x</option>
                  <option value="1.5">1.5x</option>
                  <option value="2.0">2.0x</option>
                </select>

                <button onClick={toggleFullscreen} className="text-white hover:text-brand-primary transition-colors">
                  {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>

          {/* AI Insights & Performance widgets */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
            {/* AI Predictions */}
            <div className="card bg-brand-bg-secondary border border-brand-border rounded-2xl p-5 flex flex-col gap-4">
              <h3 className="text-sm font-bold font-display flex items-center gap-2 border-b border-brand-border/40 pb-2">
                <Zap className="w-4 h-4 text-brand-accent-amber" />
                CAMPUSX OS AI Match Insights
              </h3>

              <div className="flex flex-col gap-3 font-mono text-[11px]">
                <div className="flex justify-between">
                  <span className="text-brand-text-muted">Win Probability (Home)</span>
                  <span className="text-brand-accent-cyan font-bold">{aiInsights.winProbabilityA}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-brand-text-muted">Win Probability (Away)</span>
                  <span className="text-brand-accent-emerald font-bold">{aiInsights.winProbabilityB}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-brand-text-muted">Expected Goals (xG)</span>
                  <span className="text-white">{aiInsights.xgA} - {aiInsights.xgB}</span>
                </div>
                <div className="flex justify-between border-t border-brand-border/20 pt-2 text-[10px]">
                  <span className="text-brand-text-muted">Tactical Shape:</span>
                  <span className="text-white font-semibold">{aiInsights.momentumTrend}</span>
                </div>
              </div>
            </div>

            {/* Match Summary */}
            <div className="card bg-brand-bg-secondary border border-brand-border rounded-2xl p-5 flex flex-col gap-3">
              <h3 className="text-sm font-bold font-display flex items-center gap-2 border-b border-brand-border/40 pb-2">
                <TrendingUp className="w-4 h-4 text-brand-primary" />
                Momentum Summary
              </h3>
              <p className="text-brand-text-muted text-[11px] leading-relaxed">
                {aiInsights.summary}
              </p>
            </div>
          </div>
        </div>

        {/* Right chat side-drawer */}
        <div className="flex flex-col gap-6">
          {/* Lineups */}
          <div className="card bg-brand-bg-secondary border border-brand-border rounded-2xl p-5 flex flex-col gap-4 text-xs">
            <h3 className="text-sm font-bold font-display flex items-center gap-2 border-b border-brand-border/40 pb-2">
              <Users className="w-4 h-4 text-brand-primary" />
              Team Roster & Lineups
            </h3>
            
            <div className="grid grid-cols-2 gap-4 font-mono text-[10px]">
              <div>
                <span className="text-brand-accent-cyan font-bold block mb-1">CampusX United</span>
                <ul className="flex flex-col gap-1 text-brand-text-muted">
                  <li>1. J. Cole (GK)</li>
                  <li>4. M. Vance (DF)</li>
                  <li>7. S. Terry (MF)</li>
                  <li>10. R. Kross (FW)</li>
                </ul>
              </div>
              <div>
                <span className="text-brand-accent-emerald font-bold block mb-1">Consortium FC</span>
                <ul className="flex flex-col gap-1 text-brand-text-muted">
                  <li>12. P. Buffon (GK)</li>
                  <li>3. C. Maldini (DF)</li>
                  <li>8. G. Pirlo (MF)</li>
                  <li>11. Z. Ibrahim (FW)</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Interactive Chat */}
          <div className="card bg-brand-bg-secondary border border-brand-border rounded-2xl p-5 flex flex-col gap-4 text-xs flex-1 min-h-[350px]">
            <h3 className="text-sm font-bold font-display flex items-center gap-2 border-b border-brand-border/40 pb-2">
              <MessageSquare className="w-4 h-4 text-brand-primary" />
              Match Live Chat
            </h3>

            {/* Comment list */}
            <div className="flex-1 overflow-y-auto max-h-[300px] flex flex-col gap-2 pr-1">
              {chatComments.length === 0 ? (
                <div className="text-brand-text-muted text-[10px] text-center my-auto">
                  No chat comments. Be the first to cheer for the team!
                </div>
              ) : (
                chatComments.map(c => {
                  const isOperator = c.user_role === 'superadmin' || c.user_role === 'broadcast_operator';
                  return (
                    <div 
                      key={c.id} 
                      className={`p-2 rounded-lg flex flex-col gap-1 bg-brand-bg-tertiary border ${
                        isOperator ? 'border-brand-primary/30 bg-brand-primary/5' : 'border-brand-border/40'
                      }`}
                    >
                      <div className="flex justify-between items-center text-[8px]">
                        <span className={`font-bold ${isOperator ? 'text-brand-primary' : 'text-white'}`}>
                          {c.user_name} ({c.user_role.toUpperCase()})
                        </span>
                        <span className="text-brand-text-muted">{c.timestamp.substring(11, 16)}</span>
                      </div>
                      <span className="text-[10px] leading-relaxed break-words">{c.comment}</span>
                    </div>
                  );
                })
              )}
            </div>

            {/* Chat entry form */}
            <form onSubmit={handlePostChat} className="flex gap-2 border-t border-brand-border/40 pt-3">
              <input 
                type="text" 
                placeholder="Type your message to cheer..."
                className="flex-1 bg-brand-bg-tertiary border border-brand-border rounded-lg px-2.5 py-2 text-white placeholder-brand-text-muted"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
              />
              <button 
                type="submit" 
                className="px-3 bg-brand-primary hover:bg-brand-primary-hover font-bold rounded-lg text-white"
              >
                Send
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
