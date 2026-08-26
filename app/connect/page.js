'use client';

import React, { useState } from 'react';
import { ConnectProvider, useConnect } from './ConnectContext';
import Sidebar from './components/Sidebar';
import Feed from './components/Feed';
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
import { Plus, X, FileText, Image, Film, HelpCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import './connect.css';

function ConnectPageContent() {
  const { 
    activeView, 
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

  const handlePostSubmit = async (e) => {
    e.preventDefault();
    if (!currentUser || !postText.trim()) return;

    let type = 'text';
    let mediaUrl = null;
    if (postFile) {
      if (postFile.type === 'application/pdf' || postFile.name.endsWith('.pdf')) {
        type = 'pdf';
      } else if (postFile.type.startsWith('video/')) {
        type = 'video';
      } else {
        type = 'image';
      }
      mediaUrl = URL.createObjectURL(postFile);
    }

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
      media_url: mediaUrl,
      created_at: 'Just now',
      likes_count: 0,
      comments_count: 0,
      likes: [],
      comments: []
    };

    addPost(newPost);
    setIsModalOpen(false);
    setPostText('');
    setPostFile(null);

    try {
      const formData = new FormData();
      formData.append('user_id', currentUser.id);
      formData.append('content', postText);
      formData.append('type', type);
      formData.append('category', postCategory);
      if (postFile) {
        formData.append('media', postFile);
      }
      await fetch('/api/posts', { method: 'POST', body: formData });
      loadFeed();
    } catch (err) {
      console.error('Failed to sync post to backend:', err);
    }
  };

  const handleTaskSubmit = async (e) => {
    e.preventDefault();
    if (!taskTitle.trim()) return;

    const newTask = {
      id: 'tsk_' + Date.now().toString(36),
      title: taskTitle,
      description: taskDesc,
      assignee_id: taskAssignee || null,
      status: 'pending',
      created_at: 'Just now'
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

    const newPoll = {
      id: 'poll_' + Date.now().toString(36),
      question: pollQuestion,
      options: cleanOptions.map(opt => ({ text: opt, votes: 0 })),
      total_votes: 0,
      created_at: 'Just now'
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

  return (
    <div className="min-h-screen bg-brand-bg-primary text-brand-text-main flex select-none connect-font-inter">
      
      {/* 80px Left Sidebar Navigation */}
      <Sidebar />

      {/* Main Container Wrapper - Offset by 80px to clear fixed left sidebar */}
      <div className="flex-1 ml-20 flex flex-col pb-16 md:pb-0 h-screen overflow-hidden">
        
        {/* Core Layout Shell - Side-by-Side Flex Panels */}
        <main className={`w-full mx-auto flex justify-center ${activeView === 'messages' ? 'max-w-full p-2 h-full overflow-hidden' : 'max-w-[1440px] px-4 py-6 md:py-8 min-h-screen gap-8'}`}>
          
          {/* Central Feed/Active tab Workspace */}
          <div className={`flex-1 flex justify-center min-w-0 ${activeView === 'messages' ? 'w-full max-w-full h-full' : 'max-w-[700px]'}`}>
            <AnimatePresence mode="wait">
              <motion.div
                key={activeView}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.25, ease: 'easeInOut' }}
                className="w-full h-full flex justify-center min-w-0"
              >
                {renderActiveView()}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Right suggested widgets panel (Desktop only, hidden in profile/communities/explore/messages) */}
          {activeView !== 'communities' && activeView !== 'profile' && activeView !== 'messages' && (
            <RightPanel />
          )}

        </main>
      </div>

      {/* Floating Messenger overlays (Hidden when in full messages view) */}
      {activeView !== 'messages' && <FloatingMessenger />}

      {/* Bottom mobile Nav Bar */}
      <MobileNav />

      {/* Floating Creation FAB overlay (Quick Add Node) */}
      <div className="fixed bottom-24 right-6 md:bottom-6 md:right-8 z-50">
        <button
          onClick={() => {
            setModalTab('post');
            setIsModalOpen(true);
          }}
          className="w-14 h-14 bg-gradient-to-tr from-brand-primary to-indigo-500 text-white rounded-full flex items-center justify-center shadow-2xl hover:scale-105 active:scale-95 transition-all glow-accent"
        >
          <Plus className="w-6 h-6 text-white" />
        </button>
      </div>

      {/* Universal Node Creation Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <>
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[100]"
              onClick={() => setIsModalOpen(false)}
            />

            {/* Modal Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[500px] bg-[#0B1736] border border-white/10 rounded-[28px] shadow-2xl p-6 z-[101] overflow-hidden text-left"
            >
              <div className="flex justify-between items-center border-b border-white/5 pb-4 mb-4">
                <div className="flex gap-2 font-bold text-sm bg-[#102043]/40 p-1 rounded-xl">
                  {['post', 'task', 'poll'].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setModalTab(tab)}
                      className={`px-3 py-1.5 rounded-lg capitalize text-xs transition-all ${
                        modalTab === tab 
                          ? 'bg-brand-primary text-white font-extrabold shadow' 
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="p-1.5 hover:bg-white/10 rounded-full transition-all text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Form Views */}
              <div className="mt-2">
                
                {/* 1. Post creation form */}
                {modalTab === 'post' && (
                  <form onSubmit={handlePostSubmit} className="flex flex-col gap-4">
                    <div className="flex flex-col gap-1">
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-1">Category</span>
                      <select
                        value={postCategory}
                        onChange={(e) => setPostCategory(e.target.value)}
                        className="bg-[#102043] border border-white/5 text-xs text-white p-3 rounded-xl outline-none"
                      >
                        <option value="student">Student Feed</option>
                        <option value="faculty">Faculty Feed</option>
                        <option value="research">Research Feed</option>
                        <option value="campus">Campus Updates</option>
                        <option value="placement">Placement Cell</option>
                        <option value="club">Club Boards</option>
                        <option value="achievement">Achievement Trophy</option>
                      </select>
                    </div>

                    <div className="flex flex-col gap-1">
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-1">Content</span>
                      <textarea
                        required
                        placeholder="Share updates, research attachments, or syllabus details..."
                        value={postText}
                        onChange={(e) => setPostText(e.target.value)}
                        className="bg-[#102043] border border-white/5 text-xs text-white p-3.5 rounded-xl h-28 outline-none focus:border-brand-primary/30"
                      />
                    </div>

                    {/* Drag and Drop area */}
                    <div className="flex flex-col gap-1.5">
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-1">Media Files</span>
                      <label className="border border-dashed border-white/10 rounded-2xl p-6 text-center flex flex-col items-center gap-2 cursor-pointer hover:border-white/20 transition-all">
                        <input 
                          type="file" 
                          accept="image/*,video/*,application/pdf"
                          className="hidden"
                          onChange={(e) => setPostFile(e.target.files[0])}
                        />
                        <Image className="w-6 h-6 text-brand-primary" />
                        <span className="text-xs text-slate-300 font-semibold">Upload Image, Video, or PDF</span>
                        <span className="text-[10px] text-slate-500 font-medium">
                          {postFile ? `Selected: ${postFile.name}` : 'File size up to 10MB'}
                        </span>
                      </label>
                    </div>

                    <button 
                      type="submit" 
                      className="w-full bg-brand-primary hover:bg-brand-primary-hover text-white py-3 rounded-xl text-xs font-bold transition-all shadow-lg mt-2"
                    >
                      Publish Post
                    </button>
                  </form>
                )}

                {/* 2. Task creation form */}
                {modalTab === 'task' && (
                  <form onSubmit={handleTaskSubmit} className="flex flex-col gap-4">
                    <div className="flex flex-col gap-1">
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-1">Task Name</span>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Present Research Draft"
                        value={taskTitle}
                        onChange={(e) => setTaskTitle(e.target.value)}
                        className="bg-[#102043] border border-white/5 text-xs text-white p-3 rounded-xl outline-none"
                      />
                    </div>

                    <div className="flex flex-col gap-1">
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-1">Description</span>
                      <textarea
                        placeholder="Task details, milestones, or goals..."
                        value={taskDesc}
                        onChange={(e) => setTaskDesc(e.target.value)}
                        className="bg-[#102043] border border-white/5 text-xs text-white p-3 rounded-xl h-20 outline-none"
                      />
                    </div>

                    <div className="flex flex-col gap-1">
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-1">Assignee</span>
                      <select
                        value={taskAssignee}
                        onChange={(e) => setTaskAssignee(e.target.value)}
                        className="bg-[#102043] border border-white/5 text-xs text-white p-3 rounded-xl outline-none"
                      >
                        <option value="">Unassigned</option>
                        {users.map(u => (
                          <option key={u.id} value={u.id}>{u.name} ({u.role.toUpperCase()})</option>
                        ))}
                      </select>
                    </div>

                    <button 
                      type="submit" 
                      className="w-full bg-brand-primary hover:bg-brand-primary-hover text-white py-3 rounded-xl text-xs font-bold transition-all shadow-lg mt-2"
                    >
                      Create Task
                    </button>
                  </form>
                )}

                {/* 3. Poll creation form */}
                {modalTab === 'poll' && (
                  <form onSubmit={handlePollSubmit} className="flex flex-col gap-4">
                    <div className="flex flex-col gap-1">
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-1">Question</span>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Schedule review for Friday?"
                        value={pollQuestion}
                        onChange={(e) => setPollQuestion(e.target.value)}
                        className="bg-[#102043] border border-white/5 text-xs text-white p-3 rounded-xl outline-none"
                      />
                    </div>

                    <div className="flex flex-col gap-2">
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-1">Options</span>
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
                          className="bg-[#102043] border border-white/5 text-xs text-white p-2.5 rounded-xl outline-none"
                        />
                      ))}
                      <button
                        type="button"
                        onClick={() => setPollOptions([...pollOptions, ''])}
                        className="text-[10px] font-bold text-brand-primary hover:underline text-left self-start mt-1 bg-transparent border-none outline-none"
                      >
                        + Add Option
                      </button>
                    </div>

                    <button 
                      type="submit" 
                      className="w-full bg-brand-primary hover:bg-brand-primary-hover text-white py-3 rounded-xl text-xs font-bold transition-all shadow-lg mt-2"
                    >
                      Post Poll
                    </button>
                  </form>
                )}

              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

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
