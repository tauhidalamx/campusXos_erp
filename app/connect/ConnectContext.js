'use client';

import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { db, isFirebaseConfigured } from '../../lib/firebase';
import { collection, onSnapshot, query, where, doc, setDoc, updateDoc } from 'firebase/firestore';

const ConnectContext = createContext(null);

// Helper to compute canonical conversation ID between two users
export function getCanonicalChannelKey(currentUserId, targetChannelId) {
  if (!currentUserId || !targetChannelId) return targetChannelId || 'general';
  if (targetChannelId.startsWith('channel_') || targetChannelId === 'ai_chat') {
    return targetChannelId;
  }
  return [String(currentUserId), String(targetChannelId)].sort().join('__');
}

function getConnectCache(key, fallback = []) {
  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      const stored = window.localStorage.getItem('campusx_connect_' + key);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
  }
  return fallback;
}

function saveConnectCache(key, data) {
  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      window.localStorage.setItem('campusx_connect_' + key, JSON.stringify(data));
    } catch (e) {}
  }
}

export function ConnectProvider({ children }) {
  const defaultMockUser = {
    id: 'usr_me',
    name: 'Global Super Admin',
    role: 'ADMIN',
    email: 'admin@campusx.edu',
    dept: 'CampusX Operating Layer',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'
  };

  const defaultMockUsers = [
    {
      id: 'usr_001',
      name: 'Dr. Raymond Park',
      role: 'faculty',
      dept: 'Computer Science',
      email: 'raymond.park@campusx.edu',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
      online: true,
      status: 'Active Now',
      category: 'faculty',
      bio: 'Head of Department, Computer Science & Distributed Systems.',
      posts_count: 38,
      followers_count: 890,
      following_count: 142
    },
    {
      id: 'usr_002',
      name: 'Dr. Evelyn Sterling',
      role: 'faculty',
      dept: 'Physics & Quantum Lab',
      email: 'evelyn.sterling@campusx.edu',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      online: true,
      status: 'Online',
      category: 'faculty',
      bio: 'Lead Researcher in Quantum Computing and Cryptography.',
      posts_count: 52,
      followers_count: 1240,
      following_count: 98
    },
    {
      id: 'usr_003',
      name: 'Prof. Alan Turing',
      role: 'faculty',
      dept: 'AI Research Group',
      email: 'alan.turing@campusx.edu',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
      online: true,
      status: 'In Deep Work',
      category: 'faculty',
      bio: 'Machine Intelligence & Algorithmic Complexity Professor.',
      posts_count: 64,
      followers_count: 2150,
      following_count: 65
    },
    {
      id: 'usr_004',
      name: 'Dr. Marcus Chen',
      role: 'faculty',
      dept: 'Robotics & Automation',
      email: 'marcus.chen@campusx.edu',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
      online: false,
      status: 'In Lab',
      category: 'faculty',
      bio: 'Autonomous Drone Navigation & Robotics Hardware Specialist.',
      posts_count: 29,
      followers_count: 670,
      following_count: 110
    },
    {
      id: 'usr_005',
      name: 'Carlos Mendez',
      role: 'student',
      dept: 'Electrical Eng',
      email: 'carlos.mendez@campusx.edu',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
      online: true,
      status: 'Active 5m ago',
      category: 'students',
      bio: 'Student Representative, Senior Year Electrical Engineering.',
      posts_count: 19,
      followers_count: 420,
      following_count: 280
    },
    {
      id: 'usr_006',
      name: 'Aria Nakamura',
      role: 'student',
      dept: 'Computer Science',
      email: 'aria.nakamura@campusx.edu',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
      online: true,
      status: 'Online',
      category: 'students',
      bio: 'CS Cohort 2026 | Full-Stack Builder & UI Architect.',
      posts_count: 45,
      followers_count: 980,
      following_count: 310
    },
    {
      id: 'usr_007',
      name: 'Alex Rivera',
      role: 'student',
      dept: 'Computer Science',
      email: 'alex.rivera@campusx.edu',
      avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150',
      online: true,
      status: 'Coding',
      category: 'students',
      bio: 'Open Source Contributor & Blockchain ERP Enthusiast.',
      posts_count: 31,
      followers_count: 610,
      following_count: 245
    },
    {
      id: 'usr_008',
      name: 'Sarah Jenkins',
      role: 'admin',
      dept: 'Registrar & Student Affairs',
      email: 'sarah.jenkins@campusx.edu',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
      online: true,
      status: 'Registrar Desk',
      category: 'admin',
      bio: 'University Registrar Coordinator & Academic Secretariat.',
      posts_count: 22,
      followers_count: 1450,
      following_count: 85
    }
  ];

  const defaultMockStories = [
    { userId: 's1', userName: 'Dr. Evelyn Sterling', userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150', mediaUrl: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=600', type: 'Faculty Story', timestamp: '2h ago' },
    { userId: 's2', userName: 'Aria Nakamura', userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150', mediaUrl: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=600', type: 'Student Story', timestamp: '4h ago' },
    { userId: 's3', userName: 'Prof. Alan Turing', userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150', mediaUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600', type: 'Research Story', timestamp: '6h ago' }
  ];

  const defaultMockPosts = [
    {
      id: 'post_01',
      user_id: 'usr_002',
      user_name: 'Dr. Evelyn Sterling',
      user_avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      user_role: 'Professor',
      dept: 'Physics & Quantum Lab',
      content: 'We are thrilled to announce the completion of our quantum qubit error mitigation model. The paper is officially published and open for peer review!',
      type: 'text',
      category: 'research',
      created_at: new Date(Date.now() - 3600000).toISOString(),
      likes_count: 24,
      comments_count: 5,
      likes: [],
      comments: [
        { user_name: 'Carlos Mendez', user_avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150', content: 'Remarkable progress! Looking forward to the seminar.' }
      ]
    },
    {
      id: 'post_02',
      user_id: 'usr_001',
      user_name: 'Dr. Raymond Park',
      user_avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
      user_role: 'Faculty HOD',
      dept: 'Computer Science',
      content: 'Reminder to all CS cohorts: The Hackathon registrations close this Friday at 11:59 PM. Make sure your project repositories are connected to the ERP ledger.',
      type: 'text',
      category: 'campus',
      created_at: new Date(Date.now() - 7200000).toISOString(),
      likes_count: 42,
      comments_count: 8,
      likes: [],
      comments: []
    }
  ];

  const [currentUser, setCurrentUser] = useState(defaultMockUser);
  const [activeView, setActiveView] = useState('home'); // 'home' | 'explore' | 'communities' | 'research' | 'messages' | 'notifications' | 'bookmarks' | 'events' | 'achievements' | 'profile' | 'video-call'
  
  // Database States with 0ms Instant Cache Hydration
  const [users, setUsers] = useState(() => getConnectCache('users', defaultMockUsers));
  const [posts, setPosts] = useState(() => getConnectCache('posts', defaultMockPosts));
  const [tasks, setTasks] = useState(() => getConnectCache('tasks', []));
  const [polls, setPolls] = useState(() => getConnectCache('polls', []));
  
  // Sub-feed tab
  const [activeSubFeed, setActiveSubFeed] = useState('all'); // 'all' | 'student' | 'faculty' | 'research' | 'campus' | 'placement' | 'club' | 'achievement'

  // Social Bookmarks
  const [savedPostIds, setSavedPostIds] = useState(new Set());

  // AI Summary States
  const [aiSummaries, setAiSummaries] = useState({});
  const [summarizingPostId, setSummarizingPostId] = useState(null);

  // Sharing states
  const [sharingPostId, setSharingPostId] = useState(null);

  // Communities
  const [activeCommunityId, setActiveCommunityId] = useState('dept_cs');
  const [activeCommunityTab, setActiveCommunityTab] = useState('chat');
  const [activeCommunityChannel, setActiveCommunityChannel] = useState('general');

  // Notifications
  const [notifications, setNotifications] = useState([
    { id: 'n1', type: 'like', text: 'Alex Rivera liked your research proposal.', userAvatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150', time: '10m ago', unread: true },
    { id: 'n2', type: 'cite', text: 'Your paper on Blockchain ERP was cited by Dr. Raymond Park.', userAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150', time: '1h ago', unread: true },
    { id: 'n3', type: 'mention', text: 'Prof. Marcus Chen mentioned you in cs202-data-structures.', userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150', time: '3h ago', unread: false },
    { id: 'n4', type: 'invite', text: 'You have been invited to join the AI Research Community.', userAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150', time: 'Yesterday', unread: false },
    { id: 'n5', type: 'placement', text: 'Placement Cell uploaded a new opportunity at Meta.', userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150', time: '2 days ago', unread: false }
  ]);

  // Floating Messenger & Real-Time Direct Messaging
  const [messengerOpen, setMessengerOpen] = useState(false);
  const [activeChatChannel, setActiveChatChannel] = useState('usr_001'); // Contact user ID or channel ID
  const [chatSearchQuery, setChatSearchQuery] = useState('');
  const [chatInput, setChatInput] = useState('');

  // Default Mock Chat Messages
  const defaultMockChatMessages = {
    'channel_general': [
      { id: 'm1', senderId: 'usr_001', senderName: 'Dr. Raymond Park', senderAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150', text: 'Welcome to the CampusX Connect central communications channel.', time: '10:15 AM', timestamp: new Date(Date.now() - 3600000).toISOString(), reactions: { '👍': 4, '🔥': 2 }, read: true },
      { id: 'm2', senderId: 'usr_003', senderName: 'Aria Nakamura', senderAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150', text: 'Has anyone downloaded the CS202 guidelines?', time: '10:18 AM', timestamp: new Date(Date.now() - 3400000).toISOString(), reactions: { '🙌': 2 }, read: true }
    ],
    'ai_chat': [
      { id: 'aim1', senderId: 'ai_bot', senderName: 'CampusX AI Bot', senderAvatar: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=150', text: 'Hello! I am your research copilot. Ask me anything about university ledgers, course guidelines, or citation details.', time: 'Just now', timestamp: new Date().toISOString(), read: true }
    ]
  };

  // Helper to cleanly merge local and remote channel messages without duplicates
  const mergeChannelMessages = (existing = [], incoming = []) => {
    if (!Array.isArray(existing)) existing = [];
    if (!Array.isArray(incoming)) incoming = [];
    const map = new Map();
    existing.forEach(m => {
      if (m && m.id) map.set(String(m.id), m);
    });
    incoming.forEach(m => {
      if (m && m.id) {
        const prev = map.get(String(m.id));
        map.set(String(m.id), prev ? { ...prev, ...m } : m);
      }
    });
    return Array.from(map.values()).sort((a, b) => {
      const timeA = a.timestamp || a.time || '';
      const timeB = b.timestamp || b.time || '';
      return timeA.localeCompare(timeB);
    });
  };

  // Real-time Chat Logs with Local Storage Persistence & Multi-Channel Indexing
  const [chatMessages, setChatMessages] = useState(() => {
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        const cached = window.localStorage.getItem('campusx_connect_chatMessages');
        if (cached) {
          const parsed = JSON.parse(cached);
          if (parsed && typeof parsed === 'object' && Object.keys(parsed).length > 0) {
            return parsed;
          }
        }
      } catch (e) {}
    }
    return defaultMockChatMessages;
  });

  // Always keep localStorage synchronized with chatMessages
  useEffect(() => {
    if (typeof window !== 'undefined' && window.localStorage && chatMessages) {
      try {
        window.localStorage.setItem('campusx_connect_chatMessages', JSON.stringify(chatMessages));
      } catch (e) {}
    }
  }, [chatMessages]);

  // Call & Signaling States
  const [activeCallUser, setActiveCallUser] = useState(null);
  const [callStatus, setCallStatus] = useState('Disconnected'); // 'Disconnected' | 'Ringing' | 'Connecting' | 'Connected'
  const [isMuted, setIsMuted] = useState(false);
  const [isCamOff, setIsCamOff] = useState(false);
  const [incomingCall, setIncomingCall] = useState(null); // { id, callerId, callerName, callerAvatar, offer }

  // Modals & Stories
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTab, setModalTab] = useState('post'); // 'post' | 'task' | 'poll'
  const [allStories, setAllStories] = useState(defaultMockStories);
  const [activeStoryIndex, setActiveStoryIndex] = useState(null);
  const [storyProgress, setStoryProgress] = useState(0);

  // Load & Synchronize Session User with Entire Directory
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const session = sessionStorage.getItem('campusx_erp_session') || localStorage.getItem('campusx_erp_session');
      if (session) {
        try {
          const parsedUser = JSON.parse(session);
          setCurrentUser(parsedUser);

          // Synchronize logged in user into the users directory
          setUsers(prevUsers => {
            const list = Array.isArray(prevUsers) && prevUsers.length > 0 ? prevUsers : defaultMockUsers;
            const exists = list.some(u => u.id === parsedUser.id || u.email === parsedUser.email);
            if (!exists) {
              const updated = [
                {
                  id: parsedUser.id || 'usr_me',
                  name: parsedUser.name || 'Campus User',
                  role: parsedUser.role || 'student',
                  dept: parsedUser.dept || 'CampusX Operating Layer',
                  email: parsedUser.email || 'user@campusx.edu',
                  avatar: parsedUser.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
                  online: true,
                  status: 'Active Now',
                  category: parsedUser.role === 'faculty' ? 'faculty' : 'students',
                  bio: parsedUser.bio || `CampusX ${parsedUser.role ? parsedUser.role.toUpperCase() : 'MEMBER'}`
                },
                ...list
              ];
              saveConnectCache('users', updated);
              return updated;
            }
            return list;
          });
        } catch (e) {
          setCurrentUser(defaultMockUser);
        }
      } else {
        setCurrentUser(defaultMockUser);
      }
    }
  }, []);

  // Parallel Fast Non-Blocking Initial Load with SWR & Fallbacks
  const loadInitialData = async () => {
    try {
      const [usersRes, postsRes, tasksRes, pollsRes] = await Promise.allSettled([
        fetch('/api/users').then(r => r.json()),
        fetch('/api/posts').then(r => r.json()),
        fetch('/api/tasks').then(r => r.json()),
        fetch('/api/polls').then(r => r.json())
      ]);
      if (usersRes.status === 'fulfilled' && Array.isArray(usersRes.value) && usersRes.value.length > 0) {
        setUsers(usersRes.value);
        saveConnectCache('users', usersRes.value);
      } else {
        setUsers(prev => (Array.isArray(prev) && prev.length > 0 ? prev : defaultMockUsers));
      }
      if (postsRes.status === 'fulfilled' && Array.isArray(postsRes.value) && postsRes.value.length > 0) {
        setPosts(postsRes.value);
        saveConnectCache('posts', postsRes.value);
      }
      if (tasksRes.status === 'fulfilled' && Array.isArray(tasksRes.value)) {
        setTasks(tasksRes.value);
        saveConnectCache('tasks', tasksRes.value);
      }
      if (pollsRes.status === 'fulfilled' && Array.isArray(pollsRes.value)) {
        setPolls(pollsRes.value);
        saveConnectCache('polls', pollsRes.value);
      }
    } catch (e) {
      console.error('Error loading initial data:', e);
      setUsers(prev => (Array.isArray(prev) && prev.length > 0 ? prev : defaultMockUsers));
    }
  };

  const loadFeed = async () => {
    try {
      const res = await fetch('/api/posts');
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        setPosts(data);
        saveConnectCache('posts', data);
      }
    } catch (e) {
      console.error('Error fetching posts:', e);
    }
  };

  const loadUsers = async () => {
    try {
      const res = await fetch('/api/users');
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        setUsers(data);
        saveConnectCache('users', data);
      } else {
        setUsers(defaultMockUsers);
        saveConnectCache('users', defaultMockUsers);
      }
    } catch (e) {
      console.error('Error fetching users:', e);
      setUsers(defaultMockUsers);
    }
  };

  const loadTasks = async () => {
    try {
      const res = await fetch('/api/tasks');
      const data = await res.json();
      if (Array.isArray(data)) {
        setTasks(data);
        saveConnectCache('tasks', data);
      }
    } catch (e) {
      console.error('Error fetching tasks:', e);
    }
  };

  const loadPolls = async () => {
    try {
      const res = await fetch('/api/polls');
      const data = await res.json();
      if (Array.isArray(data)) {
        setPolls(data);
        saveConnectCache('polls', data);
      }
    } catch (e) {
      console.error('Error fetching polls:', e);
    }
  };

  useEffect(() => {
    loadInitialData();

    // Real-time Firestore subscriptions for Users, Posts, Tasks, and Polls
    if (isFirebaseConfigured && db) {
      let unsubUsers = () => {};
      let unsubPosts = () => {};
      let unsubTasks = () => {};
      let unsubPolls = () => {};

      try {
        unsubUsers = onSnapshot(collection(db, 'users'), (snapshot) => {
          if (!snapshot.empty) {
            const fetched = [];
            snapshot.forEach(docSnap => {
              fetched.push({ id: docSnap.id, ...docSnap.data() });
            });
            setUsers(fetched);
            saveConnectCache('users', fetched);
          }
        }, () => {});

        unsubPosts = onSnapshot(collection(db, 'posts'), (snapshot) => {
          if (!snapshot.empty) {
            const fetched = [];
            snapshot.forEach(docSnap => {
              fetched.push({ id: docSnap.id, ...docSnap.data() });
            });
            fetched.sort((a, b) => (b.created_at || '').localeCompare(a.created_at || ''));
            setPosts(fetched);
            saveConnectCache('posts', fetched);
          }
        }, () => {});

        unsubTasks = onSnapshot(collection(db, 'tasks'), (snapshot) => {
          if (!snapshot.empty) {
            const fetched = [];
            snapshot.forEach(docSnap => {
              fetched.push({ id: docSnap.id, ...docSnap.data() });
            });
            fetched.sort((a, b) => (b.created_at || '').localeCompare(a.created_at || ''));
            setTasks(fetched);
            saveConnectCache('tasks', fetched);
          }
        }, () => {});

        unsubPolls = onSnapshot(collection(db, 'polls'), (snapshot) => {
          if (!snapshot.empty) {
            const fetched = [];
            snapshot.forEach(docSnap => {
              fetched.push({ id: docSnap.id, ...docSnap.data() });
            });
            fetched.sort((a, b) => (b.created_at || '').localeCompare(a.created_at || ''));
            setPolls(fetched);
            saveConnectCache('polls', fetched);
          }
        }, () => {});
      } catch (e) {}

      return () => {
        unsubUsers();
        unsubPosts();
        unsubTasks();
        unsubPolls();
      };
    }
  }, []);

  // Real-time direct messages synchronization (LocalStorage + SQLite REST + Firestore Real-Time)
  useEffect(() => {
    if (!activeChatChannel) return;
    const myId = currentUser ? currentUser.id : 'usr_me';
    const canonicalKey = getCanonicalChannelKey(myId, activeChatChannel);

    // 1. Initial REST fetch for local/offline persistence from SQLite
    fetch(`/api/messages/${canonicalKey}`)
      .then(res => {
        if (!res.ok) return null;
        return res.json();
      })
      .then(msgs => {
        if (Array.isArray(msgs) && msgs.length > 0) {
          setChatMessages(prev => {
            const currentList = prev[activeChatChannel] || [];
            const merged = mergeChannelMessages(currentList, msgs);
            const updated = {
              ...prev,
              [activeChatChannel]: merged
            };
            saveConnectCache('chatMessages', updated);
            return updated;
          });
        }
      })
      .catch(() => {});

    // 2. Real-time Firestore subscription (when configured)
    if (isFirebaseConfigured && db) {
      try {
        const msgsCol = collection(db, 'direct_messages', canonicalKey, 'messages');
        const unsub = onSnapshot(msgsCol, (snapshot) => {
          if (!snapshot.empty) {
            const fetched = [];
            snapshot.forEach(docSnap => {
              fetched.push({ id: docSnap.id, ...docSnap.data() });
            });
            setChatMessages(prev => {
              const currentList = prev[activeChatChannel] || [];
              const merged = mergeChannelMessages(currentList, fetched);
              const updated = {
                ...prev,
                [activeChatChannel]: merged
              };
              saveConnectCache('chatMessages', updated);
              return updated;
            });
          }
        }, () => {});
        return () => unsub();
      } catch (e) {}
    }
  }, [activeChatChannel, currentUser?.id]);

  // Real-time Incoming Call Listener for logged in user (Optimized non-blocking polling)
  useEffect(() => {
    if (!currentUser || !currentUser.id) return;

    let interval = null;
    // Only use REST polling fallback if Firebase client is not active
    if (!isFirebaseConfigured || !db) {
      interval = setInterval(() => {
        fetch(`/api/calls/incoming/${currentUser.id}`)
          .then(res => {
            if (!res.ok) return null;
            return res.json();
          })
          .then(call => {
            if (call && call.status === 'ringing') {
              setIncomingCall(call);
            } else if (!call && incomingCall && incomingCall.calleeId === currentUser.id) {
              setIncomingCall(null);
            }
          })
          .catch(() => {});
      }, 4000);
    }

    // 2. Firestore real-time call listener (instant push when configured)
    let unsubFirestore = () => {};
    if (isFirebaseConfigured && db) {
      try {
        const callsCol = collection(db, 'calls');
        const q = query(callsCol, where('calleeId', '==', currentUser.id), where('status', '==', 'ringing'));
        unsubFirestore = onSnapshot(q, (snapshot) => {
          if (!snapshot.empty) {
            const callDoc = snapshot.docs[0].data();
            setIncomingCall({ id: snapshot.docs[0].id, ...callDoc });
          } else {
            setIncomingCall(prev => (prev && prev.calleeId === currentUser.id ? null : prev));
          }
        }, () => {});
      } catch (e) {}
    }

    return () => {
      if (interval) clearInterval(interval);
      unsubFirestore();
    };
  }, [currentUser?.id]);

  // Handle Like
  const handleLike = async (postId) => {
    if (!currentUser) return;
    try {
      await fetch(`/api/posts/${postId}/like`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: currentUser.id })
      });
      setPosts(prev => prev.map(post => {
        if (post.id === postId) {
          const hasLiked = post.likes && post.likes.includes(currentUser.id);
          const newLikes = hasLiked
            ? post.likes.filter(id => id !== currentUser.id)
            : [...(post.likes || []), currentUser.id];
          return {
            ...post,
            likes: newLikes,
            likes_count: hasLiked ? Math.max(0, post.likes_count - 1) : post.likes_count + 1
          };
        }
        return post;
      }));
    } catch (e) {
      console.error('Like failed:', e);
    }
  };

  // Add Comment
  const handleCommentSubmit = async (postId, content) => {
    if (!currentUser || !content.trim()) return;
    try {
      await fetch(`/api/posts/${postId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: currentUser.id, content })
      });
      loadFeed();
    } catch (e) {
      console.error('Comment failed:', e);
    }
  };

  // Save Bookmarks
  const handleSavePost = (postId) => {
    setSavedPostIds(prev => {
      const next = new Set(prev);
      if (next.has(postId)) {
        next.delete(postId);
      } else {
        next.add(postId);
      }
      return next;
    });
  };

  // AI Summary Generator
  const runAiSummary = (postId) => {
    if (summarizingPostId) return;
    setSummarizingPostId(postId);

    setTimeout(() => {
      const summaryContent = `🤖 **CampusX AI Research Summary**:\n\n` +
        `• **Context**: Highlights core developments of university network parameters.\n` +
        `• **Action Item**: Immediate updates to collaborative channels are recommended.\n` +
        `• **Metric Projections**: Calculations indicate a potential +12% efficiency index increase.`;
      
      setAiSummaries(prev => ({
        ...prev,
        [postId]: summaryContent
      }));
      setSummarizingPostId(null);
    }, 1200);
  };

  // Human-to-Human Direct Message Dispatcher (Both text and media/file attachments saved locally & synced online)
  const handleChatSend = (customText = null, mediaUrl = null, mediaType = null, fileName = null) => {
    const textToSend = customText !== null ? customText : chatInput;
    if ((!textToSend || !textToSend.trim()) && !mediaUrl) return;
    if (!currentUser) return;

    const myId = currentUser.id || 'usr_me';
    const canonicalKey = getCanonicalChannelKey(myId, activeChatChannel);
    const msgId = 'm_' + Date.now();
    const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const newMsg = {
      id: msgId,
      senderId: myId,
      receiverId: activeChatChannel,
      channelKey: canonicalKey,
      senderName: currentUser.name || 'You',
      senderAvatar: currentUser.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      text: textToSend ? textToSend.trim() : '',
      mediaUrl: mediaUrl || null,
      mediaType: mediaType || null,
      fileName: fileName || null,
      time: nowStr,
      timestamp: new Date().toISOString(),
      reactions: {},
      read: false,
      status: 'sent'
    };

    // Update local chat messages and localStorage immediately
    setChatMessages(prev => {
      const channelMsgs = prev[activeChatChannel] || [];
      const updatedList = [...channelMsgs, newMsg];
      const updatedAll = {
        ...prev,
        [activeChatChannel]: updatedList
      };
      saveConnectCache('chatMessages', updatedAll);
      return updatedAll;
    });
    
    if (customText === null) {
      setChatInput('');
    }

    // Dual-write to /api/messages (SQLite disk database + Firestore + SSE)
    fetch('/api/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ channelId: canonicalKey, message: newMsg })
    }).catch(() => {});

    // If and ONLY IF user is talking to the designated AI Copilot ('ai_chat'), generate assistant reply
    if (activeChatChannel === 'ai_chat') {
      setTimeout(() => {
        const replyMsg = {
          id: 'aim_' + Date.now(),
          senderId: 'ai_bot',
          receiverId: myId,
          channelKey: 'ai_chat',
          senderName: 'CampusX AI Bot',
          senderAvatar: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=150',
          text: `🤖 **CampusX AI Copilot**:\nProcessed your inquiry: "${textToSend || 'attachment'}". All university records and academic ledgers are synced.`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          timestamp: new Date().toISOString(),
          reactions: {},
          read: true,
          status: 'delivered'
        };

        setChatMessages(prev => {
          const updated = {
            ...prev,
            ai_chat: [...(prev.ai_chat || []), replyMsg]
          };
          saveConnectCache('chatMessages', updated);
          return updated;
        });

        fetch('/api/messages', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ channelId: 'ai_chat', message: replyMsg })
        }).catch(() => {});
      }, 1000);
    }
  };

  const handleToggleReaction = (channelId, msgId, emoji) => {
    setChatMessages(prev => {
      const channelMsgs = prev[channelId] || [];
      let updatedMsg = null;
      const updated = channelMsgs.map(m => {
        if (m.id === msgId) {
          const currentCount = (m.reactions && m.reactions[emoji]) || 0;
          const newReactions = { ...(m.reactions || {}) };
          if (currentCount > 0) {
            delete newReactions[emoji];
          } else {
            newReactions[emoji] = 1;
          }
          updatedMsg = { ...m, reactions: newReactions };
          return updatedMsg;
        }
        return m;
      });
      const updatedAll = { ...prev, [channelId]: updated };
      saveConnectCache('chatMessages', updatedAll);

      if (updatedMsg) {
        const myId = currentUser ? currentUser.id : 'usr_me';
        const canonicalKey = getCanonicalChannelKey(myId, channelId);
        fetch('/api/messages', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ channelId: canonicalKey, message: updatedMsg })
        }).catch(() => {});
      }

      return updatedAll;
    });
  };

  const handleDeleteMessage = (channelId, msgId) => {
    setChatMessages(prev => {
      const filtered = (prev[channelId] || []).filter(m => m.id !== msgId);
      const updated = {
        ...prev,
        [channelId]: filtered
      };
      saveConnectCache('chatMessages', updated);
      return updated;
    });

    const myId = currentUser ? currentUser.id : 'usr_me';
    const canonicalKey = getCanonicalChannelKey(myId, channelId);
    fetch(`/api/messages/${canonicalKey}/${msgId}`, { method: 'DELETE' }).catch(() => {});
  };

  const handlePinMessage = (channelId, msgId) => {
    setChatMessages(prev => {
      const channelMsgs = prev[channelId] || [];
      let updatedMsg = null;
      const updated = channelMsgs.map(m => {
        if (m.id === msgId) {
          updatedMsg = { ...m, pinned: !m.pinned };
          return updatedMsg;
        }
        return m;
      });
      const updatedAll = { ...prev, [channelId]: updated };
      saveConnectCache('chatMessages', updatedAll);

      if (updatedMsg) {
        const myId = currentUser ? currentUser.id : 'usr_me';
        const canonicalKey = getCanonicalChannelKey(myId, channelId);
        fetch('/api/messages', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ channelId: canonicalKey, message: updatedMsg })
        }).catch(() => {});
      }

      return updatedAll;
    });
  };

  const addPost = (post) => {
    setPosts(prev => [post, ...prev]);
  };

  const addTask = (task) => {
    setTasks(prev => [task, ...prev]);
  };

  const updateTaskStatus = async (taskId, newStatus) => {
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: newStatus } : t));
    try {
      await fetch(`/api/tasks/${taskId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
    } catch (err) {
      console.error('Failed to update task status:', err);
    }
  };

  const addPoll = (poll) => {
    setPolls(prev => [poll, ...prev]);
  };

  const votePoll = async (pollId, optionIndex) => {
    if (!currentUser) return;
    setPolls(prev => prev.map(p => {
      if (p.id === pollId) {
        const votes = { ...(p.votes || {}) };
        votes[optionIndex] = (Number(votes[optionIndex]) || 0) + 1;
        const votedUsers = [...(p.voted_users || []), currentUser.id];
        return { ...p, votes, voted_users: votedUsers };
      }
      return p;
    }));

    try {
      await fetch(`/api/polls/${pollId}/vote`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: currentUser.id, option_index: optionIndex })
      });
      loadPolls();
    } catch (err) {
      console.error('Failed to vote in poll:', err);
    }
  };

  const addStory = (story) => {
    setAllStories(prev => [story, ...prev]);
  };

  const startCall = (user, mode = 'video') => {
    setActiveCallUser({ ...user, callMode: mode });
    setCallStatus('Ringing');

    // If calling AI Copilot, automatically connect to AI stream
    const isAi = user.id === 'ai_chat' || user.category === 'ai' || (user.name && user.name.toLowerCase().includes('copilot'));
    if (isAi) {
      setTimeout(() => {
        setCallStatus('Connected');
      }, 700);
    }
  };

  const simulateAnswerCall = () => {
    setCallStatus('Connected');
  };

  const acceptIncomingCall = () => {
    if (!incomingCall) return;
    const callerContact = {
      id: incomingCall.callerId,
      name: incomingCall.callerName,
      avatar: incomingCall.callerAvatar,
      callMode: incomingCall.callMode || 'video'
    };
    setActiveCallUser(callerContact);
    setCallStatus('Connected');
    setIncomingCall(null);
  };

  const declineIncomingCall = () => {
    if (!incomingCall) return;
    const callId = incomingCall.id;
    fetch('/api/calls/status', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ callId, status: 'rejected' })
    }).catch(() => {});
    if (db) {
      const callDocRef = doc(db, 'calls', callId);
      updateDoc(callDocRef, { status: 'rejected', endedAt: new Date().toISOString() }).catch(() => {});
    }
    setIncomingCall(null);
  };

  const endCall = () => {
    setCallStatus('Disconnected');
    setActiveCallUser(null);
  };

  return (
    <ConnectContext.Provider value={{
      currentUser,
      setCurrentUser,
      activeView,
      setActiveView,
      
      users,
      setUsers,
      posts,
      tasks,
      polls,
      addPost,
      addTask,
      updateTaskStatus,
      addPoll,
      votePoll,
      addStory,
      loadFeed,
      loadUsers,
      loadTasks,
      loadPolls,
      startCall,
      endCall,
      
      incomingCall,
      acceptIncomingCall,
      declineIncomingCall,
      
      activeSubFeed,
      setActiveSubFeed,
      
      savedPostIds,
      handleLike,
      handleCommentSubmit,
      handleSavePost,
      
      aiSummaries,
      summarizingPostId,
      runAiSummary,
      
      sharingPostId,
      setSharingPostId,

      activeCommunityId,
      setActiveCommunityId,
      activeCommunityTab,
      setActiveCommunityTab,
      activeCommunityChannel,
      setActiveCommunityChannel,
      
      notifications,
      setNotifications,
      
      messengerOpen,
      setMessengerOpen,
      activeChatChannel,
      setActiveChatChannel,
      chatSearchQuery,
      setChatSearchQuery,
      chatInput,
      setChatInput,
      chatMessages,
      setChatMessages,
      handleChatSend,
      handleToggleReaction,
      handleDeleteMessage,
      handlePinMessage,
      
      activeCallUser,
      setActiveCallUser,
      callStatus,
      setCallStatus,
      startCall,
      endCall,
      simulateAnswerCall,
      acceptIncomingCall,
      declineIncomingCall,
      isMuted,
      setIsMuted,
      isCamOff,
      setIsCamOff,
      
      isModalOpen,
      setIsModalOpen,
      modalTab,
      setModalTab,
      
      allStories,
      activeStoryIndex,
      setActiveStoryIndex,
      storyProgress,
      setStoryProgress
    }}>
      {children}
    </ConnectContext.Provider>
  );
}

export function useConnect() {
  return useContext(ConnectContext);
}
