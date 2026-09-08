/**
 * CampusX WebRTC Peer-to-Peer (P2P) Video & Audio Communication Engine
 * Supports STUN-assisted NAT traversal, Firestore/REST signaling, and camera/mic track management.
 */

import { db } from './firebase';
import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc, 
  onSnapshot, 
  addDoc 
} from 'firebase/firestore';

const ICE_SERVERS = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
    { urls: 'stun:stun2.l.google.com:19302' },
    { urls: 'stun:stun3.l.google.com:19302' },
    { urls: 'stun:stun4.l.google.com:19302' }
  ]
};

export class P2PCallSession {
  constructor({ onRemoteStream, onConnectionStateChange, onCallEnded }) {
    this.peerConnection = null;
    this.localStream = null;
    this.remoteStream = null;
    this.callId = null;
    this.isCaller = false;
    this.unsubCall = null;
    this.unsubCandidates = null;
    this.onRemoteStream = onRemoteStream;
    this.onConnectionStateChange = onConnectionStateChange;
    this.onCallEnded = onCallEnded;
  }

  // 1. Initialize local media stream
  async getLocalMedia({ video = true, audio = true } = {}) {
    try {
      if (typeof navigator !== 'undefined' && navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: video ? { width: { ideal: 1280 }, height: { ideal: 720 } } : false, 
          audio: audio ? { echoCancellation: true, noiseSuppression: true } : false 
        });
        this.localStream = stream;
        return stream;
      }
    } catch (err) {
      console.warn('Camera/Mic permission note:', err.message);
      // Create fallback synthetic stream for environments without physical webcams
      return this.createFallbackStream();
    }
  }

  createFallbackStream() {
    if (typeof document === 'undefined') return null;
    const canvas = document.createElement('canvas');
    canvas.width = 640;
    canvas.height = 360;
    const ctx = canvas.getContext('2d');
    
    // Draw animated canvas placeholder
    const draw = () => {
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#6366f1';
      ctx.font = '24px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('CampusX Secure Video Stream', canvas.width / 2, canvas.height / 2 - 20);
      ctx.fillStyle = '#94a3b8';
      ctx.font = '14px Inter, sans-serif';
      ctx.fillText('P2P WebRTC Encrypted Channel Active', canvas.width / 2, canvas.height / 2 + 20);
    };
    draw();

    try {
      const stream = canvas.captureStream(15);
      this.localStream = stream;
      return stream;
    } catch (e) {
      return null;
    }
  }

  // 2. Setup RTCPeerConnection
  initPeerConnection() {
    if (typeof window === 'undefined' || !window.RTCPeerConnection) return null;

    this.peerConnection = new RTCPeerConnection(ICE_SERVERS);
    this.remoteStream = new MediaStream();

    // Attach local tracks
    if (this.localStream) {
      this.localStream.getTracks().forEach(track => {
        this.peerConnection.addTrack(track, this.localStream);
      });
    }

    // Handle incoming remote tracks
    this.peerConnection.ontrack = (event) => {
      event.streams[0].getTracks().forEach(track => {
        this.remoteStream.addTrack(track);
      });
      if (this.onRemoteStream) {
        this.onRemoteStream(this.remoteStream);
      }
    };

    // Monitor connection states
    this.peerConnection.onconnectionstatechange = () => {
      const state = this.peerConnection.connectionState;
      if (this.onConnectionStateChange) {
        this.onConnectionStateChange(state);
      }
      if (state === 'disconnected' || state === 'failed' || state === 'closed') {
        this.endCall();
      }
    };

    return this.peerConnection;
  }

  // 3. Caller Initiates Call
  async startCall(callerUser, calleeUser) {
    this.isCaller = true;
    this.callId = `call_${callerUser.id}_${calleeUser.id}_${Date.now()}`;
    this.initPeerConnection();

    // Listen for local ICE candidates and post to Firestore / server
    this.peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        this.sendIceCandidate(this.callId, event.candidate.toJSON(), 'caller');
      }
    };

    // Create SDP Offer
    const offerDescription = await this.peerConnection.createOffer();
    await this.peerConnection.setLocalDescription(offerDescription);

    const offerPayload = {
      sdp: offerDescription.sdp,
      type: offerDescription.type
    };

    const callDocData = {
      id: this.callId,
      callerId: callerUser.id,
      callerName: callerUser.name,
      callerAvatar: callerUser.avatar,
      calleeId: calleeUser.id,
      calleeName: calleeUser.name,
      calleeAvatar: calleeUser.avatar,
      offer: offerPayload,
      status: 'ringing',
      createdAt: new Date().toISOString()
    };

    // Write to Firestore & Local signaling API
    try {
      if (db) {
        const callDocRef = doc(db, 'calls', this.callId);
        await setDoc(callDocRef, callDocData);

        // Listen for Answer
        this.unsubCall = onSnapshot(callDocRef, (snapshot) => {
          const data = snapshot.data();
          if (data && !this.peerConnection.currentRemoteDescription && data.answer) {
            const answerDescription = new RTCSessionDescription(data.answer);
            this.peerConnection.setRemoteDescription(answerDescription);
          }
          if (data && data.status === 'ended') {
            this.endCall();
          }
        });

        // Listen for Callee ICE candidates
        const calleeCandidatesCol = collection(db, 'calls', this.callId, 'calleeCandidates');
        this.unsubCandidates = onSnapshot(calleeCandidatesCol, (snapshot) => {
          snapshot.docChanges().forEach((change) => {
            if (change.type === 'added') {
              const candidate = new RTCIceCandidate(change.doc.data());
              this.peerConnection.addIceCandidate(candidate).catch(() => {});
            }
          });
        });
      }
    } catch (e) {
      console.warn('Firestore signaling note:', e.message);
    }

    // Backup REST signaling
    fetch('/api/calls/offer', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(callDocData)
    }).catch(() => {});

    return this.callId;
  }

  // 4. Callee Answers Call
  async answerCall(callId, callData) {
    this.isCaller = false;
    this.callId = callId;
    this.initPeerConnection();

    // Listen for local ICE candidates
    this.peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        this.sendIceCandidate(callId, event.candidate.toJSON(), 'callee');
      }
    };

    // Set Remote Offer
    const offerDescription = callData.offer;
    await this.peerConnection.setRemoteDescription(new RTCSessionDescription(offerDescription));

    // Create SDP Answer
    const answerDescription = await this.peerConnection.createAnswer();
    await this.peerConnection.setLocalDescription(answerDescription);

    const answerPayload = {
      sdp: answerDescription.sdp,
      type: answerDescription.type
    };

    // Update Firestore call doc
    try {
      if (db) {
        const callDocRef = doc(db, 'calls', callId);
        await updateDoc(callDocRef, {
          answer: answerPayload,
          status: 'connected',
          answeredAt: new Date().toISOString()
        });

        // Listen for Caller ICE Candidates
        const callerCandidatesCol = collection(db, 'calls', callId, 'callerCandidates');
        this.unsubCandidates = onSnapshot(callerCandidatesCol, (snapshot) => {
          snapshot.docChanges().forEach((change) => {
            if (change.type === 'added') {
              const candidate = new RTCIceCandidate(change.doc.data());
              this.peerConnection.addIceCandidate(candidate).catch(() => {});
            }
          });
        });
      }
    } catch (e) {
      console.warn('Firestore answer error:', e.message);
    }

    // Backup REST signaling
    fetch('/api/calls/answer', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ callId, answer: answerPayload })
    }).catch(() => {});
  }

  // 5. Candidate Exchange
  async sendIceCandidate(callId, candidate, role) {
    const subColName = role === 'caller' ? 'callerCandidates' : 'calleeCandidates';
    try {
      if (db) {
        const candidatesCol = collection(db, 'calls', callId, subColName);
        await addDoc(candidatesCol, candidate);
      }
    } catch (e) {}

    fetch('/api/calls/candidate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ callId, candidate, role })
    }).catch(() => {});
  }

  // 6. Audio/Video Track Controls
  toggleAudio(enabled) {
    if (this.localStream) {
      this.localStream.getAudioTracks().forEach(track => {
        track.enabled = enabled !== undefined ? enabled : !track.enabled;
      });
    }
  }

  toggleVideo(enabled) {
    if (this.localStream) {
      this.localStream.getVideoTracks().forEach(track => {
        track.enabled = enabled !== undefined ? enabled : !track.enabled;
      });
    }
  }

  // 7. End Call
  async endCall() {
    if (this.unsubCall) {
      this.unsubCall();
      this.unsubCall = null;
    }
    if (this.unsubCandidates) {
      this.unsubCandidates();
      this.unsubCandidates = null;
    }
    if (this.localStream) {
      this.localStream.getTracks().forEach(track => track.stop());
      this.localStream = null;
    }
    if (this.peerConnection) {
      this.peerConnection.close();
      this.peerConnection = null;
    }

    if (this.callId) {
      try {
        if (db) {
          const callDocRef = doc(db, 'calls', this.callId);
          await updateDoc(callDocRef, { status: 'ended', endedAt: new Date().toISOString() }).catch(() => {});
        }
      } catch (e) {}
      fetch('/api/calls/status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ callId: this.callId, status: 'ended' })
      }).catch(() => {});
    }

    if (this.onCallEnded) {
      this.onCallEnded();
    }
  }
}
