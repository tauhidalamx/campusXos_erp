'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

const ConnectContext = createContext(null);

export function ConnectProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [activeView, setActiveView] = useState('home'); // 'home' | 'explore' | 'communities' | 'research' | 'messages' | 'notifications' | 'bookmarks' | 'events' | 'achievements' | 'profile'
  
  // Database States
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [polls, setPolls] = useState([]);
  
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
  const [activeChatChannel, setActiveChatChannel] = useState('usr_001'); // 'usr_001', 'usr_002', 'usr_005', 'ai_chat', 'channel_general'
  const [chatSearchQuery, setChatSearchQuery] = useState('');
  const [chatInput, setChatInput] = useState('');
  
  // Real-time Chat Logs per Peer Channel with explicit senderId & status
  const [chatMessages, setChatMessages] = useState({
    'channel_general': [
      { id: 'm1', senderId: 'usr_001', senderName: 'Dr. Raymond Park', senderAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150', text: 'Welcome to the CampusX Connect central communications channel.', time: '10:15 AM', reactions: { '👍': 4, '🔥': 2 }, read: true },
      { id: 'm2', senderId: 'usr_003', senderName: 'Aria Nakamura', senderAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150', text: 'Has anyone downloaded the CS202 guidelines?', time: '10:18 AM', reactions: { '🙌': 2 }, read: true }
    ],
    'ai_chat': [
      { id: 'aim1', senderId: 'ai_bot', senderName: 'CampusX AI Bot', senderAvatar: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=150', text: 'Hello! I am your research assistant. Ask me anything about university ledgers or citation details.', time: 'Just now', read: true }
    ],
    'usr_001': [
      { id: 'p1_1', senderId: 'usr_001', senderName: 'Dr. Raymond Park', senderAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150', text: 'Hi! Let me know when you review the consensus audit draft for the CS department.', time: '10:00 AM', read: true },
      { id: 'p1_2', senderId: 'usr_001', senderName: 'Dr. Raymond Park', senderAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150', text: 'Please submit the final review by tonight.', time: '10:30 AM', read: true }
    ],
    'usr_002': [
      { id: 'p2_1', senderId: 'usr_002', senderName: 'Dr. Evelyn Sterling', senderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150', text: 'The midterm scores are posted to CampusX Chain ledger.', time: 'Yesterday', read: true }
    ],
    'usr_005': [
      { id: 'p5_1', senderId: 'usr_005', senderName: 'Carlos Mendez', senderAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150', text: 'Hey! Ready for the AI lab project discussion?', time: '9:15 AM', read: true }
    ]
  });

  // Call states
  const [activeCallUser, setActiveCallUser] = useState(null);
  const [callStatus, setCallStatus] = useState('Disconnected'); // 'Ringing' | 'Connecting' | 'Connected' | 'Disconnected'
  const [isMuted, setIsMuted] = useState(false);
  const [isCamOff, setIsCamOff] = useState(false);

  // Modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTab, setModalTab] = useState('post'); // 'post' | 'task' | 'poll'

  // Stories
  const [allStories, setAllStories] = useState([]);
  const [activeStoryIndex, setActiveStoryIndex] = useState(null);
  const [storyProgress, setStoryProgress] = useState(0);

  // Load Session User
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const session = sessionStorage.getItem('campusx_erp_session');
      if (session) {
        setCurrentUser(JSON.parse(session));
      } else {
        const defaultUser = {
          id: 'usr_admin',
          name: 'Dr. Alex Vance',
          role: 'admin',
          email: 'admin@campusx.edu',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
          dept: 'Computer Science'
        };
        sessionStorage.setItem('campusx_erp_session', JSON.stringify(defaultUser));
        setCurrentUser(defaultUser);
      }
    }
  }, []);

  // Fetch API Database
  const loadFeed = async () => {
    try {
      const res = await fetch('/api/posts');
      const data = await res.json();
      setPosts(data);
    } catch (e) {
      console.error('Error fetching posts:', e);
    }
  };

  const loadUsers = async () => {
    try {
      const res = await fetch('/api/users');
      const data = await res.json();
      setUsers(data);
    } catch (e) {
      console.error('Error fetching users:', e);
    }
  };

  const loadTasks = async () => {
    try {
      const res = await fetch('/api/tasks');
      const data = await res.json();
      setTasks(data);
    } catch (e) {
      console.error('Error fetching tasks:', e);
    }
  };

  const loadPolls = async () => {
    try {
      const res = await fetch('/api/polls');
      const data = await res.json();
      setPolls(data);
    } catch (e) {
      console.error('Error fetching polls:', e);
    }
  };

  useEffect(() => {
    loadUsers();
    loadFeed();
    loadTasks();
    loadPolls();
  }, []);

  // Sync Stories
  useEffect(() => {
    if (users.length > 0 && currentUser) {
      const images = [
        "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=600",
        "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600",
        "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=600",
        "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=600",
        "https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=600",
        "https://images.unsplash.com/photo-1498243691581-b148c3761a46?w=600"
      ];
      
      const storyTypes = ['Student', 'Faculty', 'Department', 'Research', 'Club', 'Event'];
      
      const mockStories = users
        .filter(u => u.id !== currentUser.id)
        .slice(0, 10)
        .map((u, index) => ({
          userId: u.id,
          userName: u.name,
          userAvatar: u.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
          mediaUrl: images[index % images.length],
          type: storyTypes[index % storyTypes.length] + ' Story',
          timestamp: `${(index + 1) * 2}h ago`
        }));
      setAllStories(mockStories);
    }
  }, [users, currentUser]);

  // Handle Post Likes
  const handleLike = async (postId) => {
    if (!currentUser) return;
    try {
      const res = await fetch(`/api/posts/${postId}/like`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: currentUser.id })
      });
      const data = await res.json();
      
      setPosts(prev => prev.map(post => {
        if (post.id === postId) {
          const currentLikes = post.likes || [];
          const updatedLikes = currentLikes.includes(currentUser.id)
            ? currentLikes.filter(uid => uid !== currentUser.id)
            : [...currentLikes, currentUser.id];
          return {
            ...post,
            likes: updatedLikes,
            likes_count: data.liked ? (post.likes_count + 1) : Math.max(0, post.likes_count - 1)
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

  // Dynamic peer replies dictionary
  const peerReplies = {
    'usr_001': "Received! I am reviewing your message and updating the consensus record on CampusX Chain right now.",
    'usr_002': "Thanks for reaching out. I'll inspect the lab report parameters and get back to you shortly.",
    'usr_005': "Awesome! Let's connect on the real-time video call whenever you are ready.",
    'ai_chat': "🤖 **CampusX AI Copilot**:\nProcessed your query. The parameters have been verified against university records with +12% efficiency.",
    'default': "Got it! Thanks for connecting. I'll reply to your message in a moment."
  };

  const handleChatSend = (customText = null, mediaUrl = null, mediaType = null) => {
    const textToSend = customText || chatInput;
    if ((!textToSend || !textToSend.trim()) && !mediaUrl) return;
    if (!currentUser) return;

    const myId = currentUser.id || 'usr_me';
    const msgId = 'm_' + Date.now();
    const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const newMsg = {
      id: msgId,
      senderId: myId,
      receiverId: activeChatChannel,
      senderName: currentUser.name || 'You',
      senderAvatar: currentUser.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      text: textToSend ? textToSend.trim() : '',
      mediaUrl: mediaUrl,
      mediaType: mediaType,
      time: nowStr,
      reactions: {},
      read: true,
      status: 'sent'
    };

    setChatMessages(prev => ({
      ...prev,
      [activeChatChannel]: [...(prev[activeChatChannel] || []), newMsg]
    }));
    
    if (!customText) {
      setChatInput('');
    }

    // Trigger realistic real-time response from target peer
    const peerChannel = activeChatChannel;
    setTimeout(() => {
      let replyText = peerReplies[peerChannel] || peerReplies['default'];
      let replySenderName = 'Peer';
      let replyAvatar = 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150';

      if (peerChannel === 'usr_001') {
        replySenderName = 'Dr. Raymond Park';
        replyAvatar = 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150';
      } else if (peerChannel === 'usr_002') {
        replySenderName = 'Dr. Evelyn Sterling';
        replyAvatar = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150';
      } else if (peerChannel === 'usr_005') {
        replySenderName = 'Carlos Mendez';
        replyAvatar = 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150';
      } else if (peerChannel === 'ai_chat') {
        replySenderName = 'CampusX AI Bot';
        replyAvatar = 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=150';
      }

      const replyMsg = {
        id: 'reply_' + Date.now(),
        senderId: peerChannel,
        receiverId: myId,
        senderName: replySenderName,
        senderAvatar: replyAvatar,
        text: replyText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        reactions: {},
        read: true,
        status: 'delivered'
      };

      setChatMessages(prev => ({
        ...prev,
        [peerChannel]: [...(prev[peerChannel] || []), replyMsg]
      }));
    }, 1200);
  };

  const handleToggleReaction = (channelId, msgId, emoji) => {
    setChatMessages(prev => {
      const channelMsgs = prev[channelId] || [];
      const updated = channelMsgs.map(m => {
        if (m.id === msgId) {
          const currentCount = (m.reactions && m.reactions[emoji]) || 0;
          const newReactions = { ...(m.reactions || {}) };
          if (currentCount > 0) {
            delete newReactions[emoji];
          } else {
            newReactions[emoji] = 1;
          }
          return { ...m, reactions: newReactions };
        }
        return m;
      });
      return { ...prev, [channelId]: updated };
    });
  };

  const handleDeleteMessage = (channelId, msgId) => {
    setChatMessages(prev => ({
      ...prev,
      [channelId]: (prev[channelId] || []).filter(m => m.id !== msgId)
    }));
  };

  const handlePinMessage = (channelId, msgId) => {
    setChatMessages(prev => {
      const channelMsgs = prev[channelId] || [];
      const updated = channelMsgs.map(m => {
        if (m.id === msgId) {
          return { ...m, pinned: !m.pinned };
        }
        return m;
      });
      return { ...prev, [channelId]: updated };
    });
  };

  const addPost = (post) => {
    setPosts(prev => [post, ...prev]);
  };

  const addTask = (task) => {
    setTasks(prev => [task, ...prev]);
  };

  const addPoll = (poll) => {
    setPolls(prev => [poll, ...prev]);
  };

  const addStory = (story) => {
    setAllStories(prev => [story, ...prev]);
  };

  const startCall = (user, mode = 'video') => {
    setActiveCallUser({ ...user, callMode: mode });
    setCallStatus('Ringing');
    setTimeout(() => {
      setCallStatus('Connected');
    }, 1500);
  };

  const endCall = () => {
    setCallStatus('Disconnected');
    setActiveCallUser(null);
  };

  return (
    <ConnectContext.Provider value={{
      currentUser,
      activeView,
      setActiveView,
      
      users,
      posts,
      tasks,
      polls,
      addPost,
      addTask,
      addPoll,
      addStory,
      loadFeed,
      loadUsers,
      loadTasks,
      loadPolls,
      startCall,
      endCall,
      
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
