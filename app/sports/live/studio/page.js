'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  Video, 
  Mic, 
  MicOff, 
  Tv, 
  Settings, 
  Play, 
  Square, 
  Volume2, 
  Clock, 
  Users, 
  MessageSquare, 
  Activity, 
  RefreshCw, 
  Check, 
  ShieldCheck, 
  AlertCircle 
} from 'lucide-react';

export default function LiveStreamStudioPage() {
  const [user, setUser] = useState(null);
  const [matches, setMatches] = useState([]);
  const [selectedMatchId, setSelectedMatchId] = useState('');
  const [streamInfo, setStreamInfo] = useState(null);
  const [isBroadcasting, setIsBroadcasting] = useState(false);
  const [micActive, setMicActive] = useState(true);
  const [streamDuration, setStreamDuration] = useState(0);
  const [viewerCount, setViewerCount] = useState(0);
  
  // Stream Source Selection & Uploads
  const [streamSource, setStreamSource] = useState('camera'); // 'camera' or 'file'
  const [uploadedVideoUrl, setUploadedVideoUrl] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  
  // Settings
  const [resolution, setResolution] = useState('1080p');
  const [fps, setFps] = useState(60);
  const [bitrate, setBitrate] = useState('6000 kbps');
  const [noiseCancellation, setNoiseCancellation] = useState(true);
  
  // Chat & Events
  const [chatComments, setChatComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [notaryHash, setNotaryHash] = useState('');
  const [notaryScore, setNotaryScore] = useState('2 - 1');

  // Media Refs
  const videoRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const animationFrameRef = useRef(null);
  const durationIntervalRef = useRef(null);
  const chatIntervalRef = useRef(null);
  const viewerIntervalRef = useRef(null);
  const [vuLevel, setVuLevel] = useState(0);

  const isBroadcaster = user ? ['superadmin', 'admin', 'sports_director', 'broadcast_operator'].includes(user.role) : false;

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const session = sessionStorage.getItem('campusx_erp_session');
      if (session) {
        const u = JSON.parse(session);
        setUser(u);
      }
      fetchMatches();
    }

    return () => {
      stopCamera();
      clearInterval(durationIntervalRef.current);
      clearInterval(chatIntervalRef.current);
      clearInterval(viewerIntervalRef.current);
      cancelAnimationFrame(animationFrameRef.current);
    };
  }, []);

  // Polling hook for non-broadcasters to fetch active stream details
  useEffect(() => {
    let pollInterval;
    if (user && !isBroadcaster && selectedMatchId) {
      const pollStream = async () => {
        try {
          const session = sessionStorage.getItem('campusx_erp_session');
          const res = await fetch(`/api/sports/streams/match/${selectedMatchId}`, {
            headers: session ? { 'x-user-session': session } : {}
          });
          const data = await res.json();
          if (data.success && data.stream) {
            setStreamInfo(data.stream);
            if (data.stream.metadata && data.stream.metadata.uploaded_video_url) {
              setUploadedVideoUrl(data.stream.metadata.uploaded_video_url);
            }
            if (data.stream.stream_status === 'LIVE') {
              setViewerCount(data.stream.viewer_count || 12);
            }
          }
        } catch (e) {
          console.error(e);
        }
      };
      
      pollStream();
      pollInterval = setInterval(pollStream, 4000);
    }
    return () => clearInterval(pollInterval);
  }, [user, isBroadcaster, selectedMatchId]);

  const fetchMatches = async () => {
    try {
      // Create a mock match if none exist in sports_matches
      const res = await fetch('/api/sports/fixtures');
      const data = await res.json();
      setMatches(data);
      if (data.length > 0) {
        setSelectedMatchId(data[0].id);
        setupStreamDetails(data[0].id);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const setupStreamDetails = async (matchId) => {
    try {
      const session = typeof window !== 'undefined' ? sessionStorage.getItem('campusx_erp_session') : null;
      const headers = session ? { 'x-user-session': session } : {};

      // Try fetching existing stream configuration
      let res = await fetch(`/api/sports/streams/match/${matchId}`, { headers });
      let data = await res.json();
      
      if (!data.success) {
        // Create new stream configs
        res = await fetch('/api/sports/streams/create', {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            ...headers
          },
          body: JSON.stringify({ matchId, resolution, fps })
        });
        data = await res.json();
      }
      
      setStreamInfo(data.stream);
      if (data.stream) {
        if (data.stream.metadata && data.stream.metadata.uploaded_video_url) {
          setUploadedVideoUrl(data.stream.metadata.uploaded_video_url);
          setStreamSource('file');
        } else {
          setUploadedVideoUrl('');
          setStreamSource('camera');
        }
      }
      if (data.stream && data.stream.id) {
        fetchChat(data.stream.id);
        // Start polling chat comments
        clearInterval(chatIntervalRef.current);
        chatIntervalRef.current = setInterval(() => fetchChat(data.stream.id), 3000);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const updateStreamVideo = async (url) => {
    if (!streamInfo) return;
    try {
      const res = await fetch(`/api/sports/streams/${streamInfo.id}/video`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ videoUrl: url })
      });
      const data = await res.json();
      if (data.success) {
        setStreamInfo(prev => ({
          ...prev,
          metadata: {
            ...prev.metadata,
            uploaded_video_url: url
          }
        }));
      }
    } catch (err) {
      console.error('Failed to save stream video url', err);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setIsUploading(true);
    
    const formData = new FormData();
    formData.append('video', file);
    
    try {
      const res = await fetch('/api/sports/streams/upload', {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      if (data.success) {
        setUploadedVideoUrl(data.videoUrl);
        await updateStreamVideo(data.videoUrl);
      } else {
        alert('Upload failed: ' + (data.error || 'Unknown error'));
      }
    } catch (err) {
      console.error(err);
      alert('Upload failed');
    } finally {
      setIsUploading(false);
    }
  };

  const handleMatchChange = (e) => {
    const mId = e.target.value;
    setSelectedMatchId(mId);
    setupStreamDetails(mId);
  };

  const handleRegenerateKeys = async () => {
    if (!streamInfo) return;
    if (confirm('Are you sure you want to rotate and regenerate the RTMP Stream Keys? Current connection will disconnect.')) {
      try {
        const res = await fetch(`/api/sports/streams/${streamInfo.id}/keys`, { method: 'POST' });
        const data = await res.json();
        if (data.success) {
          setStreamInfo(prev => ({
            ...prev,
            stream_key: data.stream_key,
            backup_stream_key: data.backup_stream_key
          }));
        }
      } catch (err) {
        console.error(err);
      }
    }
  };

  // WebRTC User Media capture
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 1280, height: 720 },
        audio: true
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      // Audio Context for VU Meter calculations
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      const audioContext = new AudioCtx();
      const source = audioContext.createMediaStreamSource(stream);
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 256;
      source.connect(analyser);
      
      audioContextRef.current = audioContext;
      analyserRef.current = analyser;
      drawVUMeter();
    } catch (err) {
      alert('Camera access denied or audio device not found. Defaulting to virtual stream mode.');
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
    }
  };

  const drawVUMeter = () => {
    if (!analyserRef.current) return;
    const array = new Uint8Array(analyserRef.current.frequencyBinCount);
    analyserRef.current.getByteFrequencyData(array);
    
    // Average volume level
    const average = array.reduce((a, b) => a + b, 0) / array.length;
    setVuLevel(average / 1.28); // Map to 0-100 gauge scale
    
    animationFrameRef.current = requestAnimationFrame(drawVUMeter);
  };

  const handleStartBroadcast = async () => {
    if (!streamInfo) return;
    setIsBroadcasting(true);
    if (streamSource === 'camera') {
      await startCamera();
    }
    
    // Toggle Status LIVE
    await fetch(`/api/sports/streams/${streamInfo.id}/status`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'LIVE' })
    });
    
    // Duration interval counter
    setStreamDuration(0);
    durationIntervalRef.current = setInterval(() => {
      setStreamDuration(prev => prev + 1);
    }, 1000);

    // Viewer count simulation
    setViewerCount(12);
    viewerIntervalRef.current = setInterval(() => {
      setViewerCount(prev => prev + Math.floor(Math.random() * 5) - 2);
    }, 5000);
  };

  const handleStopBroadcast = async () => {
    if (!streamInfo) return;
    if (confirm('Are you sure you want to stop the live broadcast and archive the recording?')) {
      setIsBroadcasting(false);
      stopCamera();
      clearInterval(durationIntervalRef.current);
      clearInterval(viewerIntervalRef.current);
      
      // Update Status ENDED
      await fetch(`/api/sports/streams/${streamInfo.id}/status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'ENDED' })
      });
      
      // Prompt Blockchain Anchor Notary block
      const score = prompt('Broadcast Ended. Enter final verified match score (e.g. 2 - 1):', notaryScore);
      if (score !== null) {
        setNotaryScore(score);
        anchorBlockchainNotary(score);
      }
    }
  };

  const anchorBlockchainNotary = async (score) => {
    try {
      const res = await fetch('/api/sports/streams/notary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          matchId: selectedMatchId,
          finalScore: score,
          recordingUrl: `s3://campusx-sports-recordings/season-2026/rec_${streamInfo.id}.mp4`,
          approver: user?.name || 'Sports Director'
        })
      });
      const data = await res.json();
      if (data.success) {
        setNotaryHash(data.txHash);
        alert(`Match verification anchored successfully to CAMPUSX CHAIN.\nTransaction Hash: ${data.txHash}\nFinal Score Hash: ${data.finalScoreHash}`);
      }
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

  const handleSendComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim() || !streamInfo) return;

    try {
      const res = await fetch(`/api/sports/streams/${streamInfo.id}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user?.id || 'usr_operator',
          userName: user?.name || 'Stream Operator',
          userRole: user?.role || 'broadcast_operator',
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

  const triggerMatchEvent = async (type) => {
    try {
      const res = await fetch('/api/sports/bookmark', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event_type: type,
          player: 'Jackson Cole',
          team_id: 1,
          match_time: formatTime(streamDuration)
        })
      });
      const data = await res.json();
      if (data.success) {
        // Emit comment about bookmark in chat
        await fetch(`/api/sports/streams/${streamInfo.id}/chat`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: 'campusx_ai',
            userName: 'CAMPUSX OS AI',
            userRole: 'referee',
            comment: `⚽ [AI EVENT DETECTED]: ${type} recorded at ${formatTime(streamDuration)}. Ledger Hash: ${data.tx_hash.substring(0, 10)}...`
          })
        });
        fetchChat(streamInfo.id);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col gap-6 md:gap-8 fade-in text-white">
      {/* Title */}
      <div className="flex justify-between items-center pb-4 border-b border-brand-border/40">
        <div>
          <h1 className="text-3xl font-display font-bold tracking-tight flex items-center gap-3">
            <Tv className="w-8 h-8 text-brand-primary" />
            CAMPUSX Sports Live Stream Studio
          </h1>
          <p className="text-brand-text-muted text-sm mt-1">
            {isBroadcaster 
              ? 'Authorized broadcaster command shell. Configure streams, preview latency, and anchor results.' 
              : 'Watch live streams, view real-time match events, and chat with other viewers.'}
          </p>
        </div>
        
        {isBroadcasting && (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-brand-accent-red/15 border border-brand-accent-red/35 text-brand-accent-red rounded-full text-xs font-semibold animate-pulse">
            <span className="w-2 h-2 rounded-full bg-brand-accent-red" />
            ON AIR
          </span>
        )}
      </div>

      {/* Grid Dashboard */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Main Viewfinder & Audio Meters */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* Viewfinder Preview */}
          <div className="card bg-brand-bg-secondary border border-brand-border rounded-2xl overflow-hidden p-1.5">
            <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-black border border-brand-border/60 flex items-center justify-center">
              {!isBroadcaster ? (
                streamInfo?.stream_status === 'LIVE' ? (
                  uploadedVideoUrl ? (
                    <video 
                      src={uploadedVideoUrl}
                      autoPlay 
                      playsInline 
                      loop
                      controls
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex flex-col items-center gap-4 text-brand-primary text-xs">
                      <div className="relative">
                        <Video className="w-16 h-16 text-brand-primary animate-pulse" />
                        <span className="absolute top-0 right-0 flex h-3 w-3">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-accent-emerald opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-3 w-3 bg-brand-accent-emerald"></span>
                        </span>
                      </div>
                      <span className="font-semibold tracking-wider uppercase text-brand-accent-cyan animate-pulse">Live Feed Active</span>
                      <span className="text-brand-text-muted text-[11px]">Broadcaster is streaming live from camera</span>
                    </div>
                  )
                ) : (
                  <div className="flex flex-col items-center gap-3 text-brand-text-muted text-xs text-center p-6">
                    <Tv className="w-16 h-16 opacity-30 animate-pulse text-brand-primary" />
                    <span className="font-bold text-sm text-white">Broadcast is Offline</span>
                    <span className="max-w-xs text-brand-text-muted">
                      The broadcaster has not started the live stream for this match yet.
                    </span>
                  </div>
                )
              ) : (
                streamSource === 'file' && uploadedVideoUrl ? (
                  <video 
                    src={uploadedVideoUrl}
                    autoPlay 
                    playsInline 
                    muted 
                    loop
                    controls={!isBroadcasting}
                    className="w-full h-full object-cover"
                  />
                ) : isBroadcasting && streamSource === 'camera' ? (
                  <video 
                    ref={videoRef} 
                    autoPlay 
                    playsInline 
                    muted 
                    className="w-full h-full object-cover transform -scale-x-100"
                  />
                ) : (
                  <div className="flex flex-col items-center gap-3 text-brand-text-muted text-xs">
                    <Video className="w-16 h-16 opacity-30" />
                    <span>
                      {streamSource === 'file' 
                        ? 'Upload a video file to preview' 
                        : 'Camera preview offline. Click "Start Live Broadcast" to initiate capturer.'}
                    </span>
                  </div>
                )
              )}

              {/* HUD Overlays */}
              {isBroadcaster ? (
                <>
                  <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-2.5 py-1.5 rounded-lg border border-white/10 text-[9px] font-mono flex flex-col gap-1.5">
                    <span className="flex items-center gap-1.5">
                      <span className={`w-1.5 h-1.5 rounded-full ${isBroadcasting ? 'bg-brand-accent-red animate-ping' : 'bg-brand-text-muted'}`} />
                      CAMERA_CAPTURE: {isBroadcasting ? 'ACTIVE' : 'STANDBY'}
                    </span>
                    <span className="text-[8px] text-brand-text-muted">RESOLUTION: {resolution} | {fps} FPS</span>
                  </div>

                  {isBroadcasting && (
                    <div className="absolute bottom-4 left-4 bg-black/70 backdrop-blur-md px-3 py-2 rounded-lg border border-white/10 text-[9px] font-mono flex flex-col gap-1 text-brand-text-muted">
                      <div className="flex justify-between gap-4">
                        <span>Bitrate:</span>
                        <span className="text-brand-accent-cyan font-bold">{bitrate}</span>
                      </div>
                      <div className="flex justify-between gap-4">
                        <span>Stream Key:</span>
                        <span className="text-brand-accent-emerald">...{streamInfo?.streamKey?.substring(10, 16)}</span>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                streamInfo?.stream_status === 'LIVE' && (
                  <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-2.5 py-1.5 rounded-lg border border-white/10 text-[9px] font-mono flex flex-col gap-1.5">
                    <span className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-brand-accent-red animate-ping" />
                      LIVE STREAM: ACTIVE
                    </span>
                    <span className="text-[8px] text-brand-text-muted">QUALITY: {streamInfo?.resolution || '1080p'} | {streamInfo?.fps || '60'} FPS</span>
                  </div>
                )
              )}
            </div>

            {/* Broadcast Controls */}
            {!isBroadcaster ? (
              <div className="flex justify-between items-center px-4 py-3 bg-brand-bg-tertiary/60 border-t border-brand-border/40 mt-1.5 rounded-xl text-xs gap-3">
                <div className="flex items-center gap-2">
                  {streamInfo?.stream_status === 'LIVE' ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-brand-accent-emerald/15 border border-brand-accent-emerald/35 text-brand-accent-emerald rounded-full text-xs font-semibold animate-pulse">
                      <span className="w-1.5 h-1.5 rounded-full bg-brand-accent-emerald" />
                      ON AIR
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-brand-bg-secondary border border-brand-border text-brand-text-muted rounded-full text-xs font-semibold">
                      <span className="w-1.5 h-1.5 rounded-full bg-brand-text-muted" />
                      OFFLINE
                    </span>
                  )}
                </div>

                {/* Status details */}
                <div className="flex gap-4 font-mono text-[10px] text-brand-text-muted">
                  {streamInfo?.stream_status === 'LIVE' && (
                    <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 animate-pulse" /> Live</span>
                  )}
                  <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" /> {viewerCount} Viewers</span>
                </div>
              </div>
            ) : (
              <div className="flex justify-between items-center px-4 py-3 bg-brand-bg-tertiary/60 border-t border-brand-border/40 mt-1.5 rounded-xl text-xs gap-3">
                <div className="flex items-center gap-2">
                  {!isBroadcasting ? (
                    <button 
                      onClick={handleStartBroadcast}
                      disabled={!selectedMatchId}
                      className="flex items-center gap-1.5 px-4 py-2 bg-brand-primary text-white hover:bg-brand-primary-hover font-bold rounded-lg transition-all"
                    >
                      <Play className="w-4 h-4 fill-white" /> Start Broadcast
                    </button>
                  ) : (
                    <button 
                      onClick={handleStopBroadcast}
                      className="flex items-center gap-1.5 px-4 py-2 bg-brand-accent-red text-white hover:bg-brand-accent-red/90 font-bold rounded-lg transition-all"
                    >
                      <Square className="w-4 h-4 fill-white" /> End & Archive
                    </button>
                  )}

                  <button 
                    onClick={() => setMicActive(!micActive)}
                    className={`p-2 rounded-lg border transition-all ${
                      micActive 
                        ? 'bg-brand-bg-secondary border-brand-border text-white' 
                        : 'bg-brand-accent-red/10 border-brand-accent-red/30 text-brand-accent-red'
                    }`}
                  >
                    {micActive ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
                  </button>
                </div>

                {/* VU Meter block */}
                {isBroadcasting && (
                  <div className="flex items-center gap-2 w-1/3">
                    <Volume2 className="w-3.5 h-3.5 text-brand-text-muted" />
                    <div className="flex-1 bg-brand-bg-tertiary h-2.5 rounded-full overflow-hidden border border-brand-border/40 p-0.5">
                      <div 
                        className="h-full rounded-full transition-all duration-75 bg-gradient-to-r from-brand-accent-emerald via-brand-accent-amber to-brand-accent-red"
                        style={{ width: `${micActive ? vuLevel : 0}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Status details */}
                <div className="flex gap-4 font-mono text-[10px] text-brand-text-muted">
                  <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {formatTime(streamDuration)}</span>
                  <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" /> {viewerCount} Viewers</span>
                </div>
              </div>
            )}
          </div>

          {/* Config stream keys panel */}
          <div className="card bg-brand-bg-secondary border border-brand-border rounded-2xl p-6 flex flex-col gap-5 text-xs">
            {isBroadcaster ? (
              <>
                <h3 className="text-lg font-bold font-display flex items-center gap-2">
                  <Settings className="w-5 h-5 text-brand-primary" />
                  Broadcaster Stream Credentials (RTMP)
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <span className="text-brand-text-muted font-semibold">Select Active Event</span>
                    <select 
                      className="bg-brand-bg-tertiary border border-brand-border rounded-lg p-2.5 text-white"
                      value={selectedMatchId}
                      onChange={handleMatchChange}
                    >
                      {matches.map(m => (
                        <option key={m.id} value={m.id}>{m.home_team} vs {m.away_team} ({m.competition})</option>
                      ))}
                    </select>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <span className="text-brand-text-muted font-semibold">Broadcast Source Mode</span>
                    <select 
                      className="bg-brand-bg-tertiary border border-brand-border rounded-lg p-2.5 text-white"
                      value={streamSource}
                      onChange={(e) => setStreamSource(e.target.value)}
                    >
                      <option value="camera">Live Camera Input (WebRTC)</option>
                      <option value="file">Pre-recorded Video File (Upload)</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <span className="text-brand-text-muted font-semibold">RTMP Ingest URL</span>
                    <input 
                      type="text" 
                      readOnly 
                      className="bg-brand-bg-tertiary border border-brand-border rounded-lg p-2.5 text-brand-text-muted font-mono select-all"
                      value={streamInfo?.ingest_url || 'rtmp://ingest.campusx.university/live'}
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <span className="text-brand-text-muted font-semibold">Stream Connection Key</span>
                    <div className="flex gap-2">
                      <input 
                        type="password" 
                        readOnly 
                        className="flex-1 bg-brand-bg-tertiary border border-brand-border rounded-lg p-2.5 text-brand-text-muted font-mono select-all"
                        value={streamInfo?.streamKey || ''}
                      />
                      <button 
                        onClick={handleRegenerateKeys}
                        className="px-3 bg-brand-bg-tertiary hover:bg-brand-bg-primary border border-brand-border rounded-lg flex items-center justify-center"
                        title="Rotate and regenerate key"
                      >
                        <RefreshCw className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <span className="text-brand-text-muted font-semibold">Backup Stream Key</span>
                    <input 
                      type="password" 
                      readOnly 
                      className="bg-brand-bg-tertiary border border-brand-border rounded-lg p-2.5 text-brand-text-muted font-mono select-all"
                      value={streamInfo?.backupStreamKey || ''}
                    />
                  </div>
                </div>

                {streamSource === 'file' && (
                  <div className="flex flex-col gap-3 p-4 bg-brand-bg-tertiary/40 border border-brand-border/60 rounded-xl">
                    <span className="text-brand-text-muted font-semibold text-[11px] uppercase tracking-wider">Video Upload Channel</span>
                    
                    {uploadedVideoUrl ? (
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center justify-between bg-brand-accent-emerald/10 border border-brand-accent-emerald/30 p-2.5 rounded-lg text-brand-accent-emerald">
                          <span className="truncate max-w-[85%] font-mono text-[10px]">{uploadedVideoUrl}</span>
                          <button 
                            onClick={() => {
                              setUploadedVideoUrl('');
                              updateStreamVideo('');
                            }}
                            className="text-xs font-bold hover:underline"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col gap-2">
                        <input 
                          type="file" 
                          accept="video/mp4,video/webm" 
                          onChange={handleFileUpload}
                          disabled={isUploading}
                          className="text-xs text-brand-text-muted file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-brand-primary file:text-white hover:file:bg-brand-primary-hover"
                        />
                        {isUploading && (
                          <div className="flex items-center gap-2 text-[10px] text-brand-accent-cyan font-mono mt-1">
                            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                            <span>Uploading pre-recorded match video...</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </>
            ) : (
              <>
                <h3 className="text-lg font-bold font-display flex items-center gap-2">
                  <Tv className="w-5 h-5 text-brand-primary" />
                  Live Event View Details
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <span className="text-brand-text-muted font-semibold">Select Event to Watch</span>
                    <select 
                      className="bg-brand-bg-tertiary border border-brand-border rounded-lg p-2.5 text-white"
                      value={selectedMatchId}
                      onChange={handleMatchChange}
                    >
                      {matches.map(m => (
                        <option key={m.id} value={m.id}>{m.home_team} vs {m.away_team} ({m.competition})</option>
                      ))}
                    </select>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <span className="text-brand-text-muted font-semibold">Stream Resolution</span>
                    <input 
                      type="text" 
                      readOnly 
                      className="bg-brand-bg-tertiary border border-brand-border rounded-lg p-2.5 text-brand-text-muted font-mono"
                      value={streamInfo?.resolution || '1080p'}
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <span className="text-brand-text-muted font-semibold">Target Frame Rate (FPS)</span>
                    <input 
                      type="text" 
                      readOnly 
                      className="bg-brand-bg-tertiary border border-brand-border rounded-lg p-2.5 text-brand-text-muted font-mono"
                      value={`${streamInfo?.fps || '60'} FPS`}
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <span className="text-brand-text-muted font-semibold">Bitrate Mode</span>
                    <input 
                      type="text" 
                      readOnly 
                      className="bg-brand-bg-tertiary border border-brand-border rounded-lg p-2.5 text-brand-text-muted font-mono"
                      value={streamInfo?.bitrate || 'ABR'}
                    />
                  </div>
                </div>
              </>
            )}

            {notaryHash && (
              <div className="p-3.5 bg-brand-accent-emerald/10 border border-brand-accent-emerald/30 rounded-xl flex gap-3 text-brand-accent-emerald leading-relaxed">
                <ShieldCheck className="w-5 h-5 flex-shrink-0" />
                <div className="flex flex-col gap-1">
                  <span className="font-bold">Match Verification Block Anchored</span>
                  <span className="font-mono text-[10px] break-all">CAMPUSX CHAIN Tx: {notaryHash}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right 1 Col: Match events, chat & telemetry */}
        <div className="flex flex-col gap-6">
          {/* Quick AI Events generator */}
          {isBroadcaster && isBroadcasting && (
            <div className="card bg-brand-bg-secondary border border-brand-border rounded-2xl p-5 flex flex-col gap-4 text-xs">
              <h3 className="text-sm font-bold font-display flex items-center gap-2 border-b border-brand-border/40 pb-2">
                <Activity className="w-4 h-4 text-brand-accent-cyan" />
                Live Match Event Logger
              </h3>

              <div className="grid grid-cols-2 gap-2">
                <button 
                  onClick={() => triggerMatchEvent('GOAL')}
                  className="p-2.5 bg-brand-accent-emerald/15 hover:bg-brand-accent-emerald/25 border border-brand-accent-emerald/35 text-brand-accent-emerald font-bold rounded-lg"
                >
                  ⚽ Trigger Goal
                </button>
                <button 
                  onClick={() => triggerMatchEvent('FOUL')}
                  className="p-2.5 bg-brand-accent-red/15 hover:bg-brand-accent-red/25 border border-brand-accent-red/35 text-brand-accent-red font-bold rounded-lg"
                >
                  ⚠️ Trigger Foul
                </button>
                <button 
                  onClick={() => triggerMatchEvent('SAVE')}
                  className="p-2.5 bg-brand-primary/15 hover:bg-brand-primary/25 border border-brand-primary/35 text-brand-primary font-bold rounded-lg"
                >
                  🧤 Trigger Save
                </button>
                <button 
                  onClick={() => triggerMatchEvent('RED_CARD')}
                  className="p-2.5 bg-brand-accent-ruby/15 hover:bg-brand-accent-ruby/25 border border-brand-accent-ruby/35 text-brand-accent-ruby font-bold rounded-lg"
                >
                  🟥 Red Card
                </button>
              </div>
            </div>
          )}

          {/* Chat box */}
          <div className="card bg-brand-bg-secondary border border-brand-border rounded-2xl p-5 flex flex-col gap-4 text-xs flex-1 min-h-[350px]">
            <h3 className="text-sm font-bold font-display flex items-center gap-2 border-b border-brand-border/40 pb-2">
              <MessageSquare className="w-4 h-4 text-brand-primary" />
              Live Viewer Chat
            </h3>

            {/* Message feed */}
            <div className="flex-1 overflow-y-auto max-h-[300px] flex flex-col gap-2.5 pr-1">
              {chatComments.length === 0 ? (
                <div className="text-brand-text-muted text-[10px] text-center my-auto">
                  Awaiting messages. Start streaming to enable interactive viewer chats.
                </div>
              ) : (
                chatComments.map(c => {
                  const isAi = c.user_id === 'campusx_ai';
                  return (
                    <div 
                      key={c.id} 
                      className={`p-2 rounded-lg flex flex-col gap-1 ${
                        isAi 
                          ? 'bg-brand-primary/10 border border-brand-primary/25' 
                          : 'bg-brand-bg-tertiary border border-brand-border/40'
                      }`}
                    >
                      <div className="flex justify-between items-center text-[8px]">
                        <span className={`font-bold ${isAi ? 'text-brand-primary' : 'text-white'}`}>
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

            {/* Input message form */}
            <form onSubmit={handleSendComment} className="flex gap-2 border-t border-brand-border/40 pt-3">
              <input 
                type="text" 
                placeholder="Broadcast a message to chat..."
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
