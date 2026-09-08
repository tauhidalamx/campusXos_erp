'use client';

import React, { useState } from 'react';
import { ConnectProvider, useConnect } from './ConnectContext';
import Sidebar from './components/Sidebar';
import Feed from './components/Feed';
import TasksView from './components/TasksView';
import PollsView from './components/PollsView';
import RightPanel from './components/RightPanel';
import FloatingMessenger from './components/FloatingMessenger';
import CommunitiesView from './components/CommunitiesView';
import NotificationsDrawer from './components/NotificationsDrawer';
import ExploreView from './components/ExploreView';
import ProfileView from './components/ProfileView';
import EventsView from './components/EventsView';
import AchievementsView from './components/AchievementsView';
import BookmarksView from './components/BookmarksView';
import MessagesView from './components/MessagesView';
import MobileNav from './components/MobileNav';
import IncomingCallModal from './components/IncomingCallModal';
import CubicDialog from './components/CubicDialog';
import { Plus, X, FileText, Image, Film, HelpCircle, AlertTriangle, Sparkles, CheckSquare, BarChart2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import './connect.css';

function ConnectPageContent() {
  const { 
    activeView, 
    setActiveView,
    isModalOpen, 
    setIsModalOpen, 
    modalTab, 
    setModalTab,
    currentUser,
    loadFeed,
    loadTasks,
    loadPolls,
    addPost,
    addTask,
    addPoll,
    users
  } = useConnect();

  // Create form states
  const [postCategory, setPostCategory] = useState('campus');
  const [postText, setPostText] = useState('');
  const [postFile, setPostFile] = useState(null);
  
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDesc, setTaskDesc] = useState('');
  const [taskAssignee, setTaskAssignee] = useState('');

  const [pollQuestion, setPollQuestion] = useState('');
  const [pollOptions, setPollOptions] = useState(['', '']);

  // TensorFlow / AI Sentiment Moderation Toast
  const [showModerationToast, setShowModerationToast] = useState(false);
  const [moderationMessage, setModerationMessage] = useState('');

  // Client-side AI moderation analysis (matches TensorFlow.js sentiment check in forum.html)
  const checkSentimentModeration = (text) => {
    const toxicKeywords = ['hate', 'kill', 'stupid', 'idiot', 'scam', 'fraud', 'abusive', 'terrible', 'worst'];
    const lower = text.toLowerCase();
    const hasToxic = toxicKeywords.some(w => lower.includes(w));
    if (hasToxic) {
      setModerationMessage('Warning: Content exhibits elevated negative sentiment flags. Please review before public release.');
      setShowModerationToast(true);
      setTimeout(() => setShowModerationToast(false), 5000);
      return false;
    }
    return true;
  };

  const handlePostSubmit = async (e) => {
    e.preventDefault();
    if (!currentUser || !postText.trim()) return;

    // Run AI Moderation check
    checkSentimentModeration(postText);

    let type = 'text';
    if (postFile) {
      if (postFile.type === 'application/pdf' || postFile.name.endsWith('.pdf')) {
        type = 'pdf';
      } else if (postFile.type.startsWith('video/')) {
        type = 'video';
      } else {
        type = 'image';
      }
    }

    const submitPostWithMedia = async (dataUrl) => {
      const newPost = {
        id: 'post_' + Date.now().toString(36),
        user_id: currentUser.id,
        userName: currentUser.name,
        userAvatar: currentUser.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
        userRole: currentUser.role,
        userDept: currentUser.dept || 'CampusX',
        content: postText,
        type: type,
        category: postCategory,
        media_url: dataUrl,
        created_at: new Date().toISOString(),
        likes_count: 0,
        comments_count: 0,
        likes: [],
        comments: []
      };

      addPost(newPost);
      setIsModalOpen(false);
      const textToPost = postText;
      const fileToPost = postFile;
      setPostText('');
      setPostFile(null);

      try {
        const formData = new FormData();
        formData.append('user_id', currentUser.id);
        formData.append('content', textToPost);
        formData.append('type', type);
        formData.append('category', postCategory);
        if (fileToPost) {
          formData.append('media', fileToPost);
        }
        await fetch('/api/posts', { method: 'POST', body: formData });
        loadFeed();
      } catch (err) {
        console.error('Failed to sync post to backend:', err);
      }
    };

    if (postFile) {
      const reader = new FileReader();
      reader.onload = (uploadEvt) => {
        submitPostWithMedia(uploadEvt.target.result);
      };
      reader.readAsDataURL(postFile);
    } else {
      submitPostWithMedia(null);
    }
  };

  const handleTaskSubmit = async (e) => {
    e.preventDefault();
    if (!taskTitle.trim()) return;

    const newTask = {
      id: 'task_' + Date.now().toString(36),
      title: taskTitle,
      description: taskDesc,
      assignee_id: taskAssignee || null,
      status: 'todo',
      created_at: new Date().toISOString()
    };

    addTask(newTask);
    setIsModalOpen(false);
    setTaskTitle('');
    setTaskDesc('');
    setTaskAssignee('');

    try {
      await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          title: taskTitle, 
          description: taskDesc, 
          assignee_id: taskAssignee || null 
        })
      });
      loadTasks();
    } catch (err) {
      console.error('Failed to sync task to backend:', err);
    }
  };

  const handlePollSubmit = async (e) => {
    e.preventDefault();
    const cleanOptions = pollOptions.filter(opt => opt.trim() !== '');
    if (!pollQuestion.trim() || cleanOptions.length < 2) return;

    const initialVotes = {};
    cleanOptions.forEach((_, i) => { initialVotes[i] = 0; });

    const newPoll = {
      id: 'poll_' + Date.now().toString(36),
      question: pollQuestion,
      options: cleanOptions,
      votes: initialVotes,
      voted_users: [],
      created_at: new Date().toISOString()
    };

    addPoll(newPoll);
    setIsModalOpen(false);
    setPollQuestion('');
    setPollOptions(['', '']);

    try {
      await fetch('/api/polls', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          question: pollQuestion, 
          options: cleanOptions 
        })
      });
      loadPolls();
    } catch (err) {
      console.error('Failed to sync poll to backend:', err);
    }
  };

  const renderActiveView = () => {
    switch(activeView) {
      case 'home':
        return <Feed />;
      case 'tasks':
        return <TasksView />;
      case 'polls':
        return <PollsView />;
      case 'explore':
        return <ExploreView />;
      case 'communities':
        return <CommunitiesView />;
      case 'research':
        return <Feed />; // Feed component handles filtering category='research'
      case 'messages':
        return <MessagesView />;
      case 'notifications':
        return <NotificationsDrawer />;
      case 'bookmarks':
        return <BookmarksView />;
      case 'events':
        return <EventsView />;
      case 'achievements':
        return <AchievementsView />;
      case 'profile':
        return <ProfileView />;
      default:
        return <Feed />;
    }
  };

  const isWideLayout = ['tasks', 'polls', 'calls', 'video-call', 'communities', 'profile', 'messages'].includes(activeView);

  return (
    <div className="connect-app-shell select-none connect-font-inter">
      
      {/* 270px Dedicated Sidebar Column */}
      <Sidebar />

      {/* Main Viewport Column */}
      <div className="connect-main-viewport story-tray-scrollbar">
        
        {/* Core Content Grid Shell */}
        <main className={`connect-content-grid ${isWideLayout || activeView === 'messages' ? 'wide-mode' : ''}`}>
          
          {/* Central Feed / Active Tab Workspace */}
          <div className="w-full min-w-0 flex flex-col">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeView}
                initial={{ opacity: 1 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.12 }}
                className="w-full min-w-0"
              >
                {renderActiveView()}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Right suggested widgets panel (Desktop only >=1200px, hidden in wide views / messages) */}
          {!isWideLayout && activeView !== 'messages' && (
            <RightPanel />
          )}

        </main>
      </div>

      {/* Global Incoming Call Ringing Modal */}
      <IncomingCallModal />

      {/* Floating Messenger overlays (Hidden when in full messages view or direct calls) */}
      {activeView !== 'messages' && activeView !== 'calls' && activeView !== 'video-call' && <FloatingMessenger />}

      {/* Bottom mobile Nav Bar */}
      <MobileNav />

      {/* Floating Creation FAB overlay (Stacked above chat dock to avoid overlap) */}
      <div className="fixed bottom-16 right-6 z-50">
        <button
          onClick={() => {
            setModalTab('post');
            setIsModalOpen(true);
          }}
          className="w-12 h-12 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white shadow-xl shadow-blue-500/20 flex items-center justify-center hover:scale-105 active:scale-95 transition-all cursor-pointer"
          title="Create New Post, Task, or Poll"
        >
          <Plus className="w-6 h-6 text-white" />
        </button>
      </div>

      {/* TensorFlow AI Content Moderation Toast */}
      <AnimatePresence>
        {showModerationToast && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-6 right-6 z-[600] max-w-sm p-4 bg-white border-2 border-slate-900 shadow-[4px_4px_0px_0px_#0f172a] rounded-none flex items-start gap-3 text-left font-mono select-none"
          >
            <div className="p-1.5 bg-amber-100 text-amber-900 border border-slate-900 rounded-none shrink-0">
              <AlertTriangle className="w-4 h-4 stroke-[2.5]" />
            </div>
            <div className="flex flex-col gap-1 min-w-0">
              <span className="text-xs font-black uppercase text-slate-900 flex items-center gap-1.5 tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                AI Moderation Notice
              </span>
              <p className="text-[11px] text-slate-700 font-sans font-medium leading-relaxed">
                {moderationMessage}
              </p>
            </div>
            <button
              onClick={() => setShowModerationToast(false)}
              className="text-slate-500 hover:text-slate-900 p-1 cursor-pointer shrink-0"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Universal Node Creation Modal - Cubic Specification */}
      <CubicDialog
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create Node"
        subtitle="Post • Task • Poll Matrix"
        maxWidth="max-w-xl"
      >
        {/* Modal Tabs */}
        <div className="grid grid-cols-3 gap-2 p-1 bg-slate-100 border-2 border-slate-900 mb-5">
          {[
            { id: 'post', label: 'New Post', icon: FileText },
            { id: 'task', label: 'New Task', icon: CheckSquare },
            { id: 'poll', label: 'New Poll', icon: BarChart2 }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setModalTab(tab.id)}
              className={`py-2 px-2 text-xs font-mono uppercase font-black tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer truncate ${
                modalTab === tab.id 
                  ? 'bg-indigo-600 text-white border border-slate-900 shadow-[2px_2px_0px_0px_#0f172a]' 
                  : 'text-slate-700 hover:text-slate-900 hover:bg-white/80'
              }`}
            >
              <tab.icon className="w-3.5 h-3.5 shrink-0 stroke-[2.5]" />
              <span className="truncate">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Form Views */}
        <div className="mt-1 font-sans">
          
          {/* 1. Post creation form */}
          {modalTab === 'post' && (
            <form onSubmit={handlePostSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <span className="text-[11px] font-mono font-black text-slate-700 uppercase tracking-wider pl-0.5">Category</span>
                <select
                  value={postCategory}
                  onChange={(e) => setPostCategory(e.target.value)}
                  className="w-full bg-slate-50 border-2 border-slate-900 text-xs sm:text-sm text-slate-900 p-2.5 px-3 rounded-none outline-none cursor-pointer focus:bg-white font-medium"
                >
                  <option value="campus">Campus Updates & Announcements</option>
                  <option value="student">Student Feed</option>
                  <option value="faculty">Faculty Feed</option>
                  <option value="research">Peer-Reviewed Research Feed</option>
                  <option value="placement">Placement Cell & Job Board</option>
                  <option value="club">Student Club Boards</option>
                  <option value="achievement">Achievement & Trophy Board</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <span className="text-[11px] font-mono font-black text-slate-700 uppercase tracking-wider pl-0.5">Content</span>
                <textarea
                  required
                  placeholder="Share university updates, thesis findings, syllabus details, or event announcements..."
                  value={postText}
                  onChange={(e) => setPostText(e.target.value)}
                  className="w-full bg-slate-50 border-2 border-slate-900 text-xs sm:text-sm text-slate-900 p-3 rounded-none min-h-[110px] outline-none focus:bg-white resize-none font-sans leading-relaxed"
                />
              </div>

              {/* Drag and Drop area */}
              <div className="flex flex-col gap-1.5">
                <span className="text-[11px] font-mono font-black text-slate-700 uppercase tracking-wider pl-0.5">Media Attachment</span>
                <label className="w-full border-2 border-dashed border-slate-900 hover:bg-slate-100/70 rounded-none p-5 text-center flex flex-col items-center justify-center gap-2 cursor-pointer bg-slate-50 transition-all">
                  <input 
                    type="file" 
                    accept="image/*,video/*,application/pdf"
                    className="hidden"
                    onChange={(e) => setPostFile(e.target.files[0])}
                  />
                  <Image className="w-6 h-6 text-indigo-600 shrink-0" />
                  <span className="text-xs sm:text-sm text-slate-900 font-bold truncate max-w-full px-2">
                    {postFile ? `Selected: ${postFile.name}` : 'Attach Image, Video, or PDF'}
                  </span>
                  <span className="text-[10.5px] text-slate-500 font-mono">
                    {postFile ? 'Click to change attachment' : 'Drag & drop or click to browse (up to 10MB)'}
                  </span>
                </label>
              </div>

              <button 
                type="submit" 
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 px-4 rounded-none font-mono uppercase tracking-wider font-black text-xs sm:text-sm border-2 border-slate-900 shadow-[3px_3px_0px_0px_#0f172a] hover:translate-x-[-1px] hover:translate-y-[-1px] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-transform mt-2 cursor-pointer"
              >
                Publish Post to Network
              </button>
            </form>
          )}

          {/* 2. Task creation form */}
          {modalTab === 'task' && (
            <form onSubmit={handleTaskSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <span className="text-[11px] font-mono font-black text-slate-700 uppercase tracking-wider pl-0.5">Task Name</span>
                <input
                  type="text"
                  required
                  placeholder="e.g. CS202 Midterm Exam Question Consensus"
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  className="w-full bg-slate-50 border-2 border-slate-900 text-xs sm:text-sm text-slate-900 p-2.5 px-3 rounded-none outline-none focus:bg-white font-sans"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <span className="text-[11px] font-mono font-black text-slate-700 uppercase tracking-wider pl-0.5">Description</span>
                <textarea
                  placeholder="Task details, milestones, or deliverables..."
                  value={taskDesc}
                  onChange={(e) => setTaskDesc(e.target.value)}
                  className="w-full bg-slate-50 border-2 border-slate-900 text-xs sm:text-sm text-slate-900 p-3 rounded-none min-h-[90px] outline-none focus:bg-white resize-none font-sans leading-relaxed"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <span className="text-[11px] font-mono font-black text-slate-700 uppercase tracking-wider pl-0.5">Assignee</span>
                <select
                  value={taskAssignee}
                  onChange={(e) => setTaskAssignee(e.target.value)}
                  className="w-full bg-slate-50 border-2 border-slate-900 text-xs sm:text-sm text-slate-900 p-2.5 px-3 rounded-none outline-none cursor-pointer focus:bg-white font-sans"
                >
                  <option value="">Select Assignee (Optional)</option>
                  {users.map(u => (
                    <option key={u.id} value={u.id}>{u.name} ({u.role.toUpperCase()})</option>
                  ))}
                </select>
              </div>

              <button 
                type="submit" 
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 px-4 rounded-none font-mono uppercase tracking-wider font-black text-xs sm:text-sm border-2 border-slate-900 shadow-[3px_3px_0px_0px_#0f172a] hover:translate-x-[-1px] hover:translate-y-[-1px] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-transform mt-2 cursor-pointer"
              >
                Create Task in Matrix
              </button>
            </form>
          )}

          {/* 3. Poll creation form */}
          {modalTab === 'poll' && (
            <form onSubmit={handlePollSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <span className="text-[11px] font-mono font-black text-slate-700 uppercase tracking-wider pl-0.5">Poll Question</span>
                <input
                  type="text"
                  required
                  placeholder="e.g. Should the semester cultural fest date be moved to October?"
                  value={pollQuestion}
                  onChange={(e) => setPollQuestion(e.target.value)}
                  className="w-full bg-slate-50 border-2 border-slate-900 text-xs sm:text-sm text-slate-900 p-2.5 px-3 rounded-none outline-none focus:bg-white font-sans"
                />
              </div>

              <div className="flex flex-col gap-2">
                <span className="text-[11px] font-mono font-black text-slate-700 uppercase tracking-wider pl-0.5">Options</span>
                {pollOptions.map((opt, i) => (
                  <input 
                    key={i}
                    type="text"
                    required={i < 2}
                    placeholder={`Option ${i + 1}`}
                    value={opt}
                    onChange={(e) => {
                      const newOpts = [...pollOptions];
                      newOpts[i] = e.target.value;
                      setPollOptions(newOpts);
                    }}
                    className="w-full bg-slate-50 border-2 border-slate-900 text-xs sm:text-sm text-slate-900 p-2.5 px-3 rounded-none outline-none focus:bg-white font-sans"
                  />
                ))}
                <button
                  type="button"
                  onClick={() => setPollOptions([...pollOptions, ''])}
                  className="text-xs font-mono font-black uppercase text-indigo-600 hover:underline text-left self-start mt-1 cursor-pointer"
                >
                  + Add Option
                </button>
              </div>

              <button 
                type="submit" 
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 px-4 rounded-none font-mono uppercase tracking-wider font-black text-xs sm:text-sm border-2 border-slate-900 shadow-[3px_3px_0px_0px_#0f172a] hover:translate-x-[-1px] hover:translate-y-[-1px] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-transform mt-2 cursor-pointer"
              >
                Launch Consensus Poll
              </button>
            </form>
          )}

        </div>
      </CubicDialog>

    </div>
  );
}

export default function ConnectPage() {
  return (
    <ConnectProvider>
      <ConnectPageContent />
    </ConnectProvider>
  );
}
