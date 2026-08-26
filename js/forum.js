/* ========================================================================
   CampusX Connect — Instagram-Style Forum App Logic
   ======================================================================== */

function initForum() {
  'use strict';

  // 1. Session & Auth Check
  const SESSION_KEY = 'campusx_erp_session';
  let currentUser = null;

  try {
    const sessionData = sessionStorage.getItem(SESSION_KEY);
    if (!sessionData) {
      // Redirect to login page if no session exists
      window.location.href = 'auth.html';
      return;
    }
    currentUser = JSON.parse(sessionData);
  } catch (e) {
    window.location.href = 'auth.html';
    return;
  }

  // Populate user profile info in the sidebar and panels
  document.getElementById('sidebar-name').textContent = currentUser.name;
  document.getElementById('sidebar-role').textContent = currentUser.role.toUpperCase();
  if (currentUser.avatar) {
    document.getElementById('sidebar-avatar').src = currentUser.avatar;
    document.getElementById('right-panel-avatar').src = currentUser.avatar;
  }
  document.getElementById('right-panel-name').textContent = currentUser.name;
  document.getElementById('right-panel-email').textContent = currentUser.email;

  // Logout Handler
  document.getElementById('forum-logout-btn').addEventListener('click', () => {
    const modalHtml = `
      <div id="custom-logout-modal" style="position: fixed; inset: 0; background: rgba(0,0,0,0.4); backdrop-filter: blur(4px); display: flex; align-items: center; justify-content: center; z-index: 10000; font-family: var(--font-sans, sans-serif);">
        <div style="background: var(--bg-secondary, #ffffff); border: 1.5px solid var(--border, rgba(0,0,0,0.08)); border-radius: 20px; width: 400px; padding: 24px; text-align: center; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.15); position: relative; overflow: hidden; display: flex; flex-direction: column; gap: 20px;">
          <div style="position: absolute; top: 0; left: 0; right: 0; height: 3px; background: linear-gradient(90deg, var(--primary, #4F46E5) 0%, var(--accent-ruby, #E11D48) 100%);"></div>
          <div style="width: 48px; height: 48px; border-radius: 50%; background: rgba(225, 29, 72, 0.1); border: 1px solid rgba(225, 29, 72, 0.2); display: flex; align-items: center; justify-content: center; color: var(--accent-ruby, #E11D48); margin: 0 auto; box-shadow: 0 0 15px rgba(225, 29, 72, 0.15);">
            <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
          </div>
          <div style="display: flex; flex-direction: column; gap: 8px;">
            <h3 style="color: var(--text-main, #0F172A); font-size: 1.25rem; font-weight: 600; margin: 0;">Sign Out</h3>
            <p style="color: var(--text-muted, #475569); font-size: 0.875rem; line-height: 1.5; margin: 0;">Are you sure you want to sign out from the CampusX Forum?</p>
          </div>
          <div style="display: flex; gap: 12px; margin-top: 4px;">
            <button id="custom-logout-cancel" style="flex: 1; padding: 10px; border-radius: 12px; background: var(--bg-tertiary, #F1F5F9); border: 1px solid var(--border, rgba(0,0,0,0.08)); color: var(--text-main, #0F172A); font-weight: 600; cursor: pointer; transition: all 0.2s;">Cancel</button>
            <button id="custom-logout-confirm" style="flex: 1; padding: 10px; border-radius: 12px; background: var(--accent-ruby, #E11D48); border: none; color: white; font-weight: 600; cursor: pointer; transition: all 0.2s;">Sign Out</button>
          </div>
        </div>
      </div>
    `;
    
    const wrapper = document.createElement('div');
    wrapper.id = 'custom-logout-modal-wrapper';
    wrapper.innerHTML = modalHtml;
    document.body.appendChild(wrapper);

    // Cancel action
    document.getElementById('custom-logout-cancel').addEventListener('click', () => {
      wrapper.remove();
    });

    // Confirm action
    document.getElementById('custom-logout-confirm').addEventListener('click', () => {
      sessionStorage.removeItem(SESSION_KEY);
      window.location.href = 'auth.html';
    });
  });

  // 2. View Navigation (Tabs)
  const menuItems = document.querySelectorAll('.menu-item[data-tab]');
  const viewports = document.querySelectorAll('.viewport-section');

  menuItems.forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const tab = item.getAttribute('data-tab');
      
      // Update sidebar active class
      menuItems.forEach(mi => mi.classList.remove('active'));
      item.classList.add('active');

      // Update viewport active class
      viewports.forEach(vp => vp.classList.remove('active'));
      const activeViewport = document.getElementById(`view-${tab}`);
      if (activeViewport) {
        activeViewport.classList.add('active');
      }

      // Initialize/Reload tab data
      if (tab === 'feed') loadFeed();
      if (tab === 'tasks') loadTasks();
      if (tab === 'polls') loadPolls();
      if (tab === 'calls') loadCallingPanel();
    });
  });

  // 3. Creation Modal Management
  const creationModal = document.getElementById('creation-modal');
  const createTriggers = document.querySelectorAll('.create-btn-trigger');
  const closeTrigger = document.getElementById('modal-close-trigger');
  const modalTabs = document.querySelectorAll('.modal-tab');
  const formPanes = document.querySelectorAll('.modal-form-pane');

  createTriggers.forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      creationModal.classList.add('active');
    });
  });

  closeTrigger.addEventListener('click', () => {
    creationModal.classList.remove('active');
  });

  // Switch tabs inside modal
  modalTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const targetType = tab.getAttribute('data-type');
      
      modalTabs.forEach(mt => mt.classList.remove('active'));
      tab.classList.add('active');

      formPanes.forEach(pane => {
        pane.classList.remove('active');
        if (pane.id === `form-create-${targetType}`) {
          pane.classList.add('active');
        }
      });
    });
  });

  // File drag-and-drop feedback
  const fileZone = document.getElementById('file-drag-zone');
  const fileInput = document.getElementById('post-media-file');
  const fileIndicator = document.getElementById('file-name-indicator');

  fileZone.addEventListener('click', () => fileInput.click());
  fileInput.addEventListener('change', () => {
    if (fileInput.files.length > 0) {
      fileIndicator.textContent = `Selected: ${fileInput.files[0].name}`;
    }
  });

  fileZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    fileZone.style.borderColor = 'var(--color-brand-primary)';
  });
  fileZone.addEventListener('dragleave', () => {
    fileZone.style.borderColor = 'var(--color-brand-border)';
  });
  fileZone.addEventListener('drop', (e) => {
    e.preventDefault();
    fileZone.style.borderColor = 'var(--color-brand-border)';
    if (e.dataTransfer.files.length > 0) {
      fileInput.files = e.dataTransfer.files;
      fileIndicator.textContent = `Dropped: ${fileInput.files[0].name}`;
    }
  });

  // Add Dynamic Poll Option Input fields
  const addOptionBtn = document.getElementById('add-poll-option-field-btn');
  const pollOptionsContainer = document.getElementById('poll-options-inputs');

  addOptionBtn.addEventListener('click', () => {
    const optionCount = pollOptionsContainer.querySelectorAll('.poll-option-field').length;
    const newInput = document.createElement('input');
    newInput.type = 'text';
    newInput.className = 'poll-option-field';
    newInput.placeholder = `Option ${optionCount + 1}`;
    newInput.required = true;
    pollOptionsContainer.appendChild(newInput);
  });

  // -------------------------------------------------------------
  // DATA SERVICES & API HANDLERS
  // -------------------------------------------------------------
  let allUsers = [];

  // Initial Load users list to populate options
  async function fetchUsers() {
    try {
      const res = await fetch('/api/users');
      allUsers = await res.json();
      populateAssignees();
      populateStories();
      populateActiveContacts();
    } catch (e) {
      console.error('Error fetching users:', e);
    }
  }

  function populateActiveContacts() {
    const listContainer = document.getElementById('active-contacts-list');
    if (!listContainer) return;
    listContainer.innerHTML = '';
    
    // Pick other users for the sidebar contacts
    const otherUsers = allUsers.filter(u => u.id !== currentUser.id).slice(0, 8);
    
    otherUsers.forEach((user, index) => {
      const isOnline = index % 3 !== 0; // Simulate some offline users
      const row = document.createElement('div');
      row.className = 'contact-row';
      row.innerHTML = `
        <div class="contact-row-left">
          <img src="${user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}" alt="${user.name}">
          <div class="contact-details">
            <span>${user.name}</span>
            <small>${user.role.toUpperCase()}</small>
          </div>
        </div>
        <span class="status-dot ${isOnline ? '' : 'offline'}"></span>
      `;
      listContainer.appendChild(row);
    });
  }

  function populateAssignees() {
    const select = document.getElementById('task-assignee');
    select.innerHTML = '<option value="">Select Assignee</option>';
    allUsers.forEach(user => {
      const option = document.createElement('option');
      option.value = user.id;
      option.textContent = `${user.name} (${user.role})`;
      select.appendChild(option);
    });
  }

  function populateStories() {
    const tray = document.getElementById('story-tray-list');
    tray.innerHTML = '';

    // Create current user story first
    const selfStory = document.createElement('div');
    selfStory.className = 'story-circle';
    selfStory.innerHTML = `
      <div class="avatar-ring">
        <img src="${currentUser.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}" alt="Self">
      </div>
      <span class="story-username">Your Story</span>
    `;
    tray.appendChild(selfStory);

    // Pick top 10 users for visual tray
    allUsers.slice(0, 10).forEach((user) => {
      if (user.id === currentUser.id) return;
      const isOnline = Math.random() > 0.3; // Simulate online status
      const story = document.createElement('div');
      story.className = `story-circle ${isOnline ? 'online' : 'offline'}`;
      story.innerHTML = `
        <div class="avatar-ring">
          <img src="${user.avatar}" alt="${user.name}">
        </div>
        <span class="story-username">${user.name.split(' ')[0]}</span>
      `;
      tray.appendChild(story);
    });
  }

  // A. FEED MANAGEMENT
  async function loadFeed() {
    const postsList = document.getElementById('feed-posts-list');
    postsList.innerHTML = '<div class="text-brand-text-muted">Loading feed...</div>';

    try {
      const res = await fetch('/api/posts');
      const posts = await res.json();

      postsList.innerHTML = '';
      if (posts.length === 0) {
        postsList.innerHTML = '<div class="text-brand-text-muted">No posts published yet. Be the first!</div>';
        return;
      }

      posts.forEach(post => {
        const isLiked = post.likes.includes(currentUser.id);
        const card = document.createElement('div');
        card.className = 'post-card';
        card.id = `card-${post.id}`;

        let mediaElement = '';
        if (post.type === 'image' && post.media_url) {
          mediaElement = `
            <div class="post-media-content">
              <img src="${post.media_url}" alt="Post Media">
            </div>`;
        } else if (post.type === 'video' && post.media_url) {
          mediaElement = `
            <div class="post-media-content">
              <video src="${post.media_url}" controls></video>
            </div>`;
        }

        const commentsHTML = post.comments.map(c => `
          <div class="comment-card">
            <img src="${c.user_avatar}" alt="${c.user_name}">
            <div class="comment-text-wrapper">
              <strong>${c.user_name}</strong>
              <span>${c.content}</span>
            </div>
          </div>
        `).join('');

        card.innerHTML = `
          <div class="post-header">
            <div class="post-creator-info">
              <img src="${post.user_avatar}" alt="${post.user_name}">
              <div class="post-creator-meta">
                <span class="creator-name">${post.user_name}</span>
                <span class="creator-role-badge">${post.user_role.toUpperCase()}</span>
              </div>
            </div>
            <span class="post-timestamp">${formatTime(post.created_at)}</span>
          </div>

          <div class="post-content-body">
            <p>${post.content}</p>
          </div>

          ${mediaElement}

          <div class="post-actions-row">
            <button class="like-button-action ${isLiked ? 'liked' : ''}" data-id="${post.id}">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
              </svg>
              <span>Like</span>
            </button>
          </div>

          <div class="likes-counter-text">
            <span>${post.likes_count} likes</span>
          </div>

          <div class="post-comments-wrapper">
            <div class="comments-scroller">
              ${commentsHTML}
            </div>
            <form class="add-comment-input-form" data-id="${post.id}">
              <input type="text" placeholder="Add a comment..." required>
              <button type="submit">Post</button>
            </form>
          </div>
        `;

        // Attach Like and Comment Event Listeners
        const likeBtn = card.querySelector('.like-button-action');
        likeBtn.addEventListener('click', () => toggleLike(post.id));

        const commentForm = card.querySelector('.add-comment-input-form');
        commentForm.addEventListener('submit', async (e) => {
          e.preventDefault();
          const input = commentForm.querySelector('input');
          
          // TensorFlow.js Moderation check
          const isToxic = await checkToxicity(input.value);
          if (isToxic) {
            showTfToast();
            return;
          }
          
          submitComment(post.id, input.value);
          input.value = '';
        });

        postsList.appendChild(card);
      });
    } catch (e) {
      console.error(e);
      postsList.innerHTML = '<div class="text-brand-accent-ruby">Failed to load feed posts.</div>';
    }
  }

  async function toggleLike(postId) {
    try {
      const res = await fetch(`/api/posts/${postId}/like`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: currentUser.id })
      });
      const data = await res.json();
      loadFeed(); // Reload feed to update states
    } catch (e) {
      console.error(e);
    }
  }

  async function submitComment(postId, content) {
    try {
      await fetch(`/api/posts/${postId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: currentUser.id, content })
      });
      loadFeed();
    } catch (e) {
      console.error(e);
    }
  }

  // B. TASK BOARD MANAGEMENT
  async function loadTasks() {
    const todoList = document.getElementById('todo-list');
    const inProgressList = document.getElementById('in_progress-list');
    const doneList = document.getElementById('done-list');

    todoList.innerHTML = '';
    inProgressList.innerHTML = '';
    doneList.innerHTML = '';

    try {
      const res = await fetch('/api/tasks');
      const tasks = await res.json();

      let todoCount = 0;
      let inProgressCount = 0;
      let doneCount = 0;

      tasks.forEach(task => {
        const card = document.createElement('div');
        card.className = 'task-card';

        let buttonText = 'Start Task';
        let nextStatus = 'in_progress';
        if (task.status === 'in_progress') {
          buttonText = 'Complete';
          nextStatus = 'done';
        } else if (task.status === 'done') {
          buttonText = 'Reopen';
          nextStatus = 'todo';
        }

        const assigneeAvatar = task.assignee_avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150';
        const assigneeName = task.assignee_name || 'Unassigned';

        card.innerHTML = `
          <div class="task-card-header">${task.title}</div>
          <div class="task-card-desc">${task.description || 'No description provided.'}</div>
          <div class="task-card-footer">
            <div class="task-assignee-avatar-row">
              <img src="${assigneeAvatar}" alt="Assignee">
              <span>${assigneeName}</span>
            </div>
            <button class="task-status-control-btn">${buttonText}</button>
          </div>
        `;

        card.querySelector('.task-status-control-btn').addEventListener('click', () => {
          updateTaskStatus(task.id, nextStatus);
        });

        if (task.status === 'todo') {
          todoList.appendChild(card);
          todoCount++;
        } else if (task.status === 'in_progress') {
          inProgressList.appendChild(card);
          inProgressCount++;
        } else {
          doneList.appendChild(card);
          doneCount++;
        }
      });

      document.getElementById('todo-count').textContent = todoCount;
      document.getElementById('in-progress-count').textContent = inProgressCount;
      document.getElementById('done-count').textContent = doneCount;

    } catch (e) {
      console.error(e);
    }
  }

  async function updateTaskStatus(taskId, status) {
    try {
      await fetch(`/api/tasks/${taskId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      loadTasks();
    } catch (e) {
      console.error(e);
    }
  }

  // C. CAMPUS POLLS
  async function loadPolls() {
    const list = document.getElementById('polls-list');
    list.innerHTML = '<div class="text-brand-text-muted">Loading polls...</div>';

    try {
      const res = await fetch('/api/polls');
      const polls = await res.json();

      list.innerHTML = '';
      if (polls.length === 0) {
        list.innerHTML = '<div class="text-brand-text-muted">No active campus polls available.</div>';
        return;
      }

      polls.forEach(poll => {
        const hasVoted = poll.voted_users.includes(currentUser.id);
        const card = document.createElement('div');
        card.className = `poll-card ${hasVoted ? 'voted' : ''}`;

        // Calculate total votes
        let totalVotes = 0;
        Object.values(poll.votes).forEach(v => totalVotes += v);

        let optionsHTML = '';
        poll.options.forEach((opt, idx) => {
          const voteCount = poll.votes[idx] || 0;
          const percent = totalVotes > 0 ? Math.round((voteCount / totalVotes) * 100) : 0;

          optionsHTML += `
            <div class="poll-option-row" data-index="${idx}">
              <div class="poll-fill-percentage-bar" style="width: ${hasVoted ? percent : 0}%"></div>
              <span class="poll-option-text">${opt}</span>
              <span class="poll-option-stats-percent">${percent}% (${voteCount})</span>
            </div>
          `;
        });

        card.innerHTML = `
          <h3 class="poll-question-title">${poll.question}</h3>
          <div class="poll-options-wrapper">
            ${optionsHTML}
          </div>
          <div class="poll-card-footer">
            <span>Total: ${totalVotes} votes</span>
            <span>Created ${formatTime(poll.created_at)}</span>
          </div>
        `;

        if (!hasVoted) {
          card.querySelectorAll('.poll-option-row').forEach(row => {
            row.addEventListener('click', () => {
              const optIndex = parseInt(row.getAttribute('data-index'));
              submitVote(poll.id, optIndex);
            });
          });
        }

        list.appendChild(card);
      });
    } catch (e) {
      console.error(e);
    }
  }

  async function submitVote(pollId, optionIndex) {
    try {
      await fetch(`/api/polls/${pollId}/vote`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: currentUser.id, option_index: optionIndex })
      });
      loadPolls();
    } catch (e) {
      console.error(e);
    }
  }

  // D. SIMULATED VIDEO CALLING
  let localStream = null;
  let simulatedTimer = null;

  function loadCallingPanel() {
    const list = document.getElementById('calling-contacts-list');
    list.innerHTML = '';

    allUsers.forEach(user => {
      if (user.id === currentUser.id) return;
      const row = document.createElement('div');
      row.className = 'call-contact-row';
      row.innerHTML = `
        <div class="call-contact-meta">
          <img src="${user.avatar}" alt="Avatar">
          <span>${user.name}</span>
        </div>
        <button class="call-action-trigger-btn">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M23 7a2 2 0 0 0-2.45-1.45L16 7V5a2 2 0 0 0-2-2H2a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2l4.55 1.45A2 2 0 0 0 23 17V7z"></path></svg>
        </button>
      `;

      row.addEventListener('click', () => initiateCall(user));
      list.appendChild(row);
    });
  }

  async function initiateCall(user) {
    // Show calling overlay
    const overlay = document.getElementById('call-status-overlay');
    const avatar = document.getElementById('calling-recipient-avatar');
    const name = document.getElementById('calling-recipient-name');
    const statusText = document.getElementById('calling-status-text');
    const localVideo = document.getElementById('local-video');
    const remoteVideo = document.getElementById('remote-video');

    avatar.src = user.avatar;
    name.textContent = user.name;
    statusText.textContent = 'Ringing...';
    overlay.style.display = 'flex';

    // Access local webcam
    try {
      localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      localVideo.srcObject = localStream;
      localVideo.style.display = 'block';
    } catch (err) {
      console.warn('Could not access camera/mic:', err.message);
      statusText.textContent = 'Camera blocked (Call preview mode)';
    }

    // Simulate connection delay
    simulatedTimer = setTimeout(() => {
      statusText.textContent = 'Connecting...';
      
      setTimeout(() => {
        overlay.style.display = 'none'; // Hide ringing screen
        remoteVideo.style.display = 'block';

        // Direct local loopback to remote to simulate dual stream easily!
        if (localStream) {
          remoteVideo.srcObject = localStream;
        } else {
          // Placeholder fallback video
          remoteVideo.src = 'https://www.w3schools.com/html/mov_bbb.mp4';
          remoteVideo.loop = true;
          remoteVideo.play();
        }
      }, 1500);

    }, 3000);
  }

  // Hangup call
  document.getElementById('hangup-action-btn').addEventListener('click', () => {
    hangupCall();
  });

  function hangupCall() {
    clearTimeout(simulatedTimer);

    if (localStream) {
      localStream.getTracks().forEach(track => track.stop());
    }

    const localVideo = document.getElementById('local-video');
    const remoteVideo = document.getElementById('remote-video');
    const overlay = document.getElementById('call-status-overlay');
    const statusText = document.getElementById('calling-status-text');

    localVideo.srcObject = null;
    localVideo.style.display = 'none';
    
    remoteVideo.srcObject = null;
    remoteVideo.src = '';
    remoteVideo.style.display = 'none';

    statusText.textContent = 'Disconnected';
    overlay.style.display = 'flex';
  }

  // -------------------------------------------------------------
  // FORM CREATION SUBMISSIONS
  // -------------------------------------------------------------

  // 1. Post Submission
  const createPostForm = document.getElementById('form-create-post');
  createPostForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const content = document.getElementById('post-textarea').value;
    
    // TensorFlow.js Moderation check
    const isToxic = await checkToxicity(content);
    if (isToxic) {
      showTfToast();
      return;
    }

    const mediaFile = fileInput.files[0];
    let type = 'text';
    if (mediaFile) {
      type = mediaFile.type.startsWith('video/') ? 'video' : 'image';
    }

    const formData = new FormData();
    formData.append('user_id', currentUser.id);
    formData.append('content', content);
    formData.append('type', type);
    if (mediaFile) {
      formData.append('media', mediaFile);
    }

    try {
      const res = await fetch('/api/posts', {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      if (data.success) {
        creationModal.classList.remove('active');
        createPostForm.reset();
        fileIndicator.textContent = 'No file selected';
        loadFeed();
      }
    } catch (err) {
      console.error(err);
    }
  });

  // 2. Task Submission
  const createTaskForm = document.getElementById('form-create-task');
  createTaskForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const title = document.getElementById('task-title').value;
    const description = document.getElementById('task-desc').value;
    const assignee_id = document.getElementById('task-assignee').value;

    try {
      const res = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description, assignee_id })
      });
      const data = await res.json();
      if (data.success) {
        creationModal.classList.remove('active');
        createTaskForm.reset();
        loadTasks();
      }
    } catch (err) {
      console.error(err);
    }
  });

  // 3. Poll Submission
  const createPollForm = document.getElementById('form-create-poll');
  createPollForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const question = document.getElementById('poll-question').value;
    const optionFields = pollOptionsContainer.querySelectorAll('.poll-option-field');
    const options = Array.from(optionFields).map(f => f.value).filter(val => val.trim() !== '');

    try {
      const res = await fetch('/api/polls', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question, options })
      });
      const data = await res.json();
      if (data.success) {
        creationModal.classList.remove('active');
        createPollForm.reset();
        // Reset dynamic options back to 2
        pollOptionsContainer.innerHTML = `
          <label>Poll Options</label>
          <input type="text" class="poll-option-field" required placeholder="Option 1">
          <input type="text" class="poll-option-field" required placeholder="Option 2">
        `;
        loadPolls();
      }
    } catch (err) {
      console.error(err);
    }
  });

  // Helper: Format Time Strings
  function formatTime(isoString) {
    const date = new Date(isoString);
    const now = new Date();
    const diffMs = now - date;
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHr = Math.floor(diffMin / 60);

    if (diffSec < 60) return 'Just now';
    if (diffMin < 60) return `${diffMin}m ago`;
    if (diffHr < 24) return `${diffHr}h ago`;
    return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  }

  // ── TensorFlow Sentiment Analysis Model ──
  const toxicWords = ['hate', 'bad', 'stupid', 'spam', 'trash', 'kill', 'dumb', 'horrible', 'worst', 'useless', 'fake'];
  
  async function checkToxicity(text) {
    if (!window.tf) return false;
    
    const words = text.toLowerCase().split(/\s+/);
    const vector = toxicWords.map(word => words.includes(word) ? 1.0 : 0.0);
    
    // Convert to Tensor
    const inputTensor = tf.tensor1d(vector);
    
    // Dot product using TF
    const weights = tf.onesLike(inputTensor);
    const multiplication = tf.mul(inputTensor, weights);
    const sumTensor = tf.sum(multiplication);
    const sumValue = (await sumTensor.data())[0];
    
    // Memory release
    inputTensor.dispose();
    weights.dispose();
    multiplication.dispose();
    sumTensor.dispose();
    
    return sumValue >= 1;
  }

  function showTfToast() {
    const toast = document.getElementById('tf-moderation-toast');
    if (toast) {
      toast.classList.add('active');
      setTimeout(() => {
        toast.classList.remove('active');
      }, 4000);
    }
  }

  // 4. Run Initial Feeds
  fetchUsers();
  loadFeed();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initForum);
} else {
  initForum();
}
