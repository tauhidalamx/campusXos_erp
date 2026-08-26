'use client';

import { useState, useEffect } from 'react';

// Zustand-like simulated presence store creator
export function createPresenceStore() {
  let listeners = new Set();
  let state = {
    presence: {
      'usr_001': { userId: 'usr_001', name: 'Dr. Raymond Park', status: 'online', channel: 'Faculty Research Group', screenSharing: false, lastSeen: 'Just now' },
      'usr_002': { userId: 'usr_002', name: 'Dr. Marcus Chen', status: 'busy', channel: null, screenSharing: false, lastSeen: '2m ago' },
      'usr_003': { userId: 'usr_003', name: 'Aria Nakamura', status: 'online', channel: 'CS202 Study Room', screenSharing: true, lastSeen: 'Just now' },
      'usr_004': { userId: 'usr_004', name: 'Alex Rivera', status: 'offline', channel: null, screenSharing: false, lastSeen: '1h ago' }
    },
    updatePresence: (userId, updates) => {
      state.presence = {
        ...state.presence,
        [userId]: { ...(state.presence[userId] || {}), ...updates }
      };
      listeners.forEach(listener => listener(state.presence));
    }
  };

  const useStore = (selector = (s) => s) => {
    const [, forceUpdate] = useState(0);
    useEffect(() => {
      const callback = () => forceUpdate(n => n + 1);
      listeners.add(callback);
      return () => listeners.delete(callback);
    }, []);
    return selector(state);
  };

  return useStore;
}

export const usePresenceStore = createPresenceStore();

// React Query-like custom query hooks simulator
export function useQuery(key, fetcher, options = {}) {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;
    setIsLoading(true);
    fetcher()
      .then(res => {
        if (active) {
          setData(res);
          setIsLoading(false);
        }
      })
      .catch(err => {
        if (active) {
          setError(err);
          setIsLoading(false);
        }
      });
    return () => {
      active = false;
    };
  }, [JSON.stringify(key)]);

  return { 
    data, 
    isLoading, 
    error, 
    refetch: () => {
      setIsLoading(true);
      fetcher()
        .then(setData)
        .catch(setError)
        .finally(() => setIsLoading(false));
    }
  };
}

// Mock fetchers and specific queries
export function useMessagesQuery(channelId) {
  return useQuery(
    ['messages', channelId],
    async () => {
      await new Promise(resolve => setTimeout(resolve, 300));
      return [
        { id: 1, text: `Hello from channel: ${channelId}!`, sender: 'System', timestamp: '10:00 AM' },
        { id: 2, text: `Active collaborative session has been started. Blockchain attestation key enabled.`, sender: 'System', timestamp: '10:02 AM' }
      ];
    }
  );
}

export function useConsensusRecordsQuery() {
  return useQuery(
    ['consensus_records'],
    async () => {
      await new Promise(resolve => setTimeout(resolve, 400));
      return [
        { hash: '0x3f1722d360674fe0be15bea1b229a532', block: 104822, status: 'verified', type: 'Remote Access Consent', timestamp: '2026-06-12 14:10:11' },
        { hash: '0x9482fa8bc7c5db0200871dcc8377da2b', block: 104825, status: 'verified', type: 'Whiteboard Version Release', timestamp: '2026-06-12 15:30:45' }
      ];
    }
  );
}

export function useDIDQuery(userId) {
  return useQuery(
    ['did', userId],
    async () => {
      await new Promise(resolve => setTimeout(resolve, 200));
      return {
        did: `did:campusx:${userId || 'unknown'}`,
        publicKey: '0x8f2d72111d4e414c9e782ba959550b07a9e992b9',
        verified: true,
        credentials: ['UniversityMember', 'AuthorizedCollaborator']
      };
    }
  );
}
