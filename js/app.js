// Main App Router and State Manager — with Auth Integration
(function() {

  // App views container registry
  window.App = {
    currentView: 'dashboard',

    init: function() {
      // ─── AUTH CHECK ──────────────────────────────────────────────
      this.checkAuth();
      this.bindEvents();
      this.loadView(this.currentView);
    },

    checkAuth: function() {
      // If AuthSystem exists and user is not logged in, redirect to auth page
      if (typeof window.AuthSystem !== 'undefined' && !window.AuthSystem.isLoggedIn()) {
        window.location.href = 'auth.html';
        return;
      }

      // If logged in, display user info in sidebar
      if (typeof window.AuthSystem !== 'undefined') {
        const user = window.AuthSystem.getCurrentUser();
        if (user) {
          const nameEl = document.getElementById('user-name-disp');
          const roleEl = document.getElementById('user-role-disp');
          if (nameEl) nameEl.textContent = user.name;
          if (roleEl) roleEl.textContent = user.role === 'admin' ? 'Administrator' : (user.role === 'faculty' ? 'Faculty Member' : 'Student');
        }
      }
    },

    bindEvents: function() {
      // Sidebar link routing
      const navLinks = document.querySelectorAll('.nav-link');
      navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
          const targetView = link.getAttribute('data-view');
          if (targetView) {
            e.preventDefault();
            this.loadView(targetView);
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
          }
        });
      });

      // Sidebar Collapse Toggle
      const menuBtn = document.getElementById('menu-toggle-btn');
      const sidebar = document.getElementById('app-sidebar');
      if (menuBtn && sidebar) {
        menuBtn.addEventListener('click', () => {
          sidebar.classList.toggle('collapsed');
        });
      }

      // Modal Close events
      const closeBtn = document.getElementById('modal-close-btn');
      const modalOverlay = document.getElementById('common-modal-overlay');
      if (closeBtn && modalOverlay) {
        closeBtn.addEventListener('click', this.closeModal);
        modalOverlay.addEventListener('click', (e) => {
          if (e.target === modalOverlay) {
            this.closeModal();
          }
        });
      }

      // Quick Actions Trigger
      const quickActionBtn = document.getElementById('quick-action-btn');
      if (quickActionBtn) {
        quickActionBtn.addEventListener('click', () => {
          this.showQuickActions();
        });
      }

      // Notifications Toggle
      const notifBtn = document.getElementById('notif-btn');
      if (notifBtn) {
        notifBtn.addEventListener('click', () => {
          this.showNotifications();
        });
      }

      // Logout Button
      const logoutBtn = document.getElementById('logout-btn');
      if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
          this.handleLogout();
        });
      }

      // Global Search input & dropdown
      const searchInput = document.getElementById('global-search-input');
      const searchDropdown = document.getElementById('global-search-dropdown');
      if (searchInput && searchDropdown) {
        // Focus opens dropdown
        searchInput.addEventListener('focus', () => {
          this.renderSearchDropdown(searchInput.value);
          searchDropdown.classList.remove('hidden');
          searchDropdown.classList.add('flex');
        });

        // Click outside closes dropdown
        document.addEventListener('click', (e) => {
          if (!searchInput.contains(e.target) && !searchDropdown.contains(e.target)) {
            searchDropdown.classList.add('hidden');
            searchDropdown.classList.remove('flex');
          }
        });

        // Input updates content
        searchInput.addEventListener('input', (e) => {
          const val = e.target.value;
          this.renderSearchDropdown(val);
          // Also run legacy filter if active view matches
          this.handleGlobalSearch(val.toLowerCase().trim());
        });
      }
    },

    loadView: function(viewName) {
      const container = document.getElementById('app-view-container');
      if (!container) return;

      container.innerHTML = '<div class="loading-spinner">Loading view...</div>';
      this.currentView = viewName;

      // Update sidebar active link highlight
      const navLinks = document.querySelectorAll('.nav-link');
      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('data-view') === viewName) {
          link.classList.add('active');
        }
      });

      const viewModule = window[viewName + 'View'];
      if (viewModule && typeof viewModule.render === 'function') {
        container.innerHTML = '';
        const viewEl = document.createElement('div');
        viewEl.className = 'page-transition';
        container.appendChild(viewEl);
        viewModule.render(viewEl);
      } else {
        // Fallback for settings or missing views
        container.innerHTML = `
          <div class="page-header">
            <div>
              <h1>${viewName.charAt(0).toUpperCase() + viewName.slice(1)}</h1>
              <p>System Preferences and System Configurations.</p>
            </div>
          </div>
          <div class="card animate-fade-in mt-6">
            <h3 class="mb-4 font-display font-bold">System Configuration Panel</h3>
            <p class="text-brand-text-muted mb-6">Manage application settings, custom credentials, user privileges, and system API configuration integrations.</p>

            <div class="grid-2">
              <div class="form-group">
                <label class="form-label">Institution Name</label>
                <input type="text" class="form-control" value="CampusX Model University">
              </div>
              <div class="form-group">
                <label class="form-label">System Time Zone</label>
                <select class="form-control">
                  <option>UTC +05:30 (Calcutta, Mumbai)</option>
                  <option>UTC +00:00 (London, GMT)</option>
                  <option>UTC -05:00 (New York, EST)</option>
                </select>
              </div>
              <div class="form-group">
                <label class="form-label">Academic Calendar Start Year</label>
                <input type="number" class="form-control" value="2026">
              </div>
              <div class="form-group">
                <label class="form-label">Enable Automated Result Processing</label>
                <select class="form-control">
                  <option>Enabled (Real-time Grade Calculation)</option>
                  <option>Disabled (Manual Batch Runs)</option>
                </select>
              </div>
            </div>
            <button class="btn btn-primary mt-4 cursor-pointer" onclick="alert('Configuration parameters persisted successfully!')">Save Preferences</button>
          </div>

          <!-- Database AI Auditor Panel -->
          <div class="card animate-fade-in mt-6 border border-brand-border bg-brand-bg-tertiary/20">
            <div class="flex justify-between items-center mb-4">
              <div>
                <h3 class="m-0 font-display text-lg font-bold">Database AI Integrity Auditor</h3>
                <p class="text-brand-text-muted text-[0.8rem] mt-1">Run the autoencoder model over student profiles to detect logical record inconsistencies or anomalous values.</p>
              </div>
              <button class="btn btn-primary btn-sm cursor-pointer" id="btn-run-integrity">Scan Database</button>
            </div>
            
            <div id="integrity-results-container" class="flex flex-col gap-3">
              <div class="text-brand-text-subtle text-xs py-2">Click Scan Database to run the in-browser anomaly detection neural network.</div>
            </div>
          </div>
        `;

        const runBtn = container.querySelector('#btn-run-integrity');
        if (runBtn) {
          runBtn.addEventListener('click', async () => {
            const resultsContainer = container.querySelector('#integrity-results-container');
            if (resultsContainer) {
              resultsContainer.innerHTML = '<div class="text-xs text-brand-primary">Auditing database records via TensorFlow...</div>';
            }
            
            if (window.UniversityDB && typeof window.UniversityDB.runIntegrityPrediction === 'function') {
              const anomalies = await window.UniversityDB.runIntegrityPrediction();
              if (resultsContainer) {
                if (anomalies.length === 0) {
                  resultsContainer.innerHTML = `
                    <div class="p-4 rounded-xl bg-brand-accent-emerald/10 border border-brand-accent-emerald/20 text-brand-accent-emerald text-xs font-semibold">
                      ✓ No profile data anomalies or integrity issues identified.
                    </div>
                  `;
                } else {
                  resultsContainer.innerHTML = anomalies.map(a => `
                    <div class="p-3.5 rounded-xl bg-brand-accent-ruby/5 border border-brand-accent-ruby/20 flex justify-between items-center text-xs">
                      <div>
                        <strong class="text-brand-text-main">${a.name} (${a.studentId})</strong>
                        <div class="text-brand-accent-ruby mt-1">${a.reason}</div>
                      </div>
                      <div class="text-right font-mono text-[0.65rem] text-brand-text-subtle">
                        Deviation: ${a.errorScore}
                      </div>
                    </div>
                  `).join('');
                }
              }
            }
          });
        }
      }
    },

    // ─── MODAL HELPERS ─────────────────────────────────────────────
    showModal: function(title, bodyHTML, footerHTML = '') {
      const modalOverlay = document.getElementById('common-modal-overlay');
      const titleEl = document.getElementById('modal-title-text');
      const bodyEl = document.getElementById('modal-body-content');
      const footerEl = document.getElementById('modal-footer-content');

      if (!modalOverlay || !titleEl || !bodyEl || !footerEl) return;

      titleEl.innerText = title;
      bodyEl.innerHTML = bodyHTML;
      footerEl.innerHTML = footerHTML;

      modalOverlay.classList.add('active');
    },

    closeModal: function() {
      const modalOverlay = document.getElementById('common-modal-overlay');
      if (modalOverlay) {
        modalOverlay.classList.remove('active');
      }
    },

    // ─── LOGOUT ────────────────────────────────────────────────────
    handleLogout: function() {
      const bodyHTML = `
        <div style="display: flex; flex-direction: column; align-items: center; text-align: center; gap: 16px; padding: 16px 0;">
          <div style="width: 48px; height: 48px; border-radius: 50%; background: rgba(244, 63, 94, 0.1); border: 1px solid rgba(244, 63, 94, 0.2); display: flex; align-items: center; justify-content: center; color: var(--accent-ruby, #f43f5e); margin-bottom: 8px; box-shadow: 0 0 15px rgba(244, 63, 94, 0.15);">
            <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
          </div>
          <p style="color: var(--text-muted, #94a3b8); font-size: 0.875rem; line-height: 1.5; margin: 0;">Are you sure you want to sign out of CampusX University ERP?</p>
        </div>
      `;
      const footerHTML = `
        <button class="btn btn-secondary px-6 py-2 rounded-xl cursor-pointer" onclick="window.App.closeModal()" style="margin-right: 8px;">Cancel</button>
        <button class="btn btn-primary px-6 py-2 rounded-xl bg-brand-accent-ruby border-brand-accent-ruby text-white cursor-pointer hover:bg-brand-accent-ruby/90" id="logout-confirm-btn">Sign Out</button>
      `;
      
      this.showModal('Sign Out', bodyHTML, footerHTML);
      
      // Bind click handler dynamically since elements are in modal
      setTimeout(() => {
        const confirmBtn = document.getElementById('logout-confirm-btn');
        if (confirmBtn) {
          confirmBtn.addEventListener('click', () => {
            sessionStorage.removeItem('campusx_erp_session');
            window.location.href = 'auth.html';
          });
        }
      }, 50);
    },

    showQuickActions: function() {
      const bodyHTML = `
        <div class="grid grid-cols-3 gap-4">
          <button class="btn btn-secondary p-5 flex flex-col items-center gap-2.5 text-center" id="qa-add-student">
            <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="16" y1="11" x2="22" y2="11"/></svg>
            <span>Add Student</span>
          </button>
          <button class="btn btn-secondary p-5 flex flex-col items-center gap-2.5 text-center" id="qa-add-announcement">
            <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
            <span>Post Notice</span>
          </button>
          <button class="btn btn-secondary p-5 flex flex-col items-center gap-2.5 text-center" id="qa-record-fee">
            <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="4" width="20" height="16" rx="2" ry="2"/><line x1="12" y1="1" x2="12" y2="23"/><line x1="2" y1="10" x2="22" y2="10"/></svg>
            <span>Record Fee</span>
          </button>
          <button class="btn btn-secondary p-5 flex flex-col items-center gap-2.5 text-center" id="qa-mark-attendance">
            <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/></svg>
            <span>Attendance</span>
          </button>
          <button class="btn btn-primary p-5 flex flex-col items-center gap-2.5 text-center" id="qa-open-connect">
            <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
            </svg>
            <span>CampusX Connect</span>
          </button>
          <button class="btn btn-primary p-5 flex flex-col items-center gap-2.5 text-center" id="qa-mint-nft">
            <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
            <span>Mint NFT</span>
          </button>
        </div>
      `;
      this.showModal('Quick Action Hub', bodyHTML, '<button class="btn btn-secondary" onclick="window.App.closeModal()">Close</button>');
 
      document.getElementById('qa-add-student').addEventListener('click', () => {
        this.closeModal();
        this.loadView('students');
        setTimeout(() => {
          if (window.studentsView && typeof window.studentsView.openAddStudentModal === 'function') {
            window.studentsView.openAddStudentModal();
          }
        }, 100);
      });
 
      document.getElementById('qa-add-announcement').addEventListener('click', () => {
        this.closeModal();
        this.loadView('announcements');
        setTimeout(() => {
          if (window.announcementsView && typeof window.announcementsView.openPostModal === 'function') {
            window.announcementsView.openPostModal();
          }
        }, 100);
      });
 
      document.getElementById('qa-record-fee').addEventListener('click', () => {
        this.closeModal();
        this.loadView('finance');
        setTimeout(() => {
          if (window.financeView && typeof window.financeView.openPaymentModal === 'function') {
            window.financeView.openPaymentModal();
          }
        }, 100);
      });
 
      document.getElementById('qa-mark-attendance').addEventListener('click', () => {
        this.closeModal();
        this.loadView('attendance');
      });
 
      document.getElementById('qa-open-connect').addEventListener('click', () => {
        this.closeModal();
        window.location.href = 'forum.html';
      });
 
      document.getElementById('qa-mint-nft').addEventListener('click', () => {
        this.closeModal();
        this.loadView('blockchain');
        setTimeout(() => {
          if (window.blockchainView && typeof window.blockchainView.openMintModal === 'function') {
            window.blockchainView.openMintModal();
          }
        }, 100);
      });
    },
 
    showNotifications: function() {
      const announcements = window.UniversityDB.getAnnouncements();
      let announcementsHtml = announcements.map(ann => `
        <div class="p-3 border-b border-brand-border flex gap-3">
          <div class="w-2 h-2 rounded-full mt-1.5 shrink-0" style="background-color: ${ann.color || 'var(--color-brand-primary)'}"></div>
          <div>
            <h5 class="m-0 font-semibold text-brand-text-main">${ann.title}</h5>
            <p class="mt-1 text-[0.8rem] text-brand-text-muted">${ann.content.slice(0, 100)}...</p>
            <span class="text-[0.7rem] text-brand-text-subtle block mt-1">Posted: ${ann.date}</span>
          </div>
        </div>
      `).join('');
 
      const bodyHTML = `
        <div style="max-height: 400px; overflow-y: auto;">
          <h4 style="margin-bottom: 12px; font-family: var(--font-display);">Recent Broadcasts & System Notices</h4>
          ${announcementsHtml}
        </div>
      `;
      this.showModal('Notifications Desk', bodyHTML, '<button class="btn btn-secondary" onclick="window.App.closeModal()">Dismiss All</button>');
    },

    handleGlobalSearch: function(val) {
      if (this.currentView === 'students' && window.studentsView && typeof window.studentsView.applyFilters === 'function') {
        const input = document.getElementById('search-name');
        if (input) {
          input.value = val;
          window.studentsView.applyFilters();
        }
      } else if (this.currentView === 'faculty' && window.facultyView && typeof window.facultyView.applySearch === 'function') {
        const input = document.getElementById('faculty-search');
        if (input) {
          input.value = val;
          window.facultyView.applySearch();
        }
      } else if (this.currentView === 'courses' && window.coursesView && typeof window.coursesView.applyFilters === 'function') {
        const input = document.getElementById('course-search');
        if (input) {
          input.value = val;
          window.coursesView.applyFilters();
        }
      }
    },

    renderSearchDropdown: function(val) {
      const dropdown = document.getElementById('global-search-dropdown');
      if (!dropdown) return;

      const query = val.toLowerCase().trim();

      // Case 1: Empty input -> Show Database sync status + Quick actions shortcuts
      if (!query) {
        const students = window.UniversityDB.getStudents();
        const faculty = window.UniversityDB.getFaculty();
        
        dropdown.innerHTML = `
          <!-- Database Sync Status -->
          <div class="p-3 bg-brand-bg-tertiary rounded-xl border border-brand-border">
            <div class="flex items-center justify-between mb-2">
              <span class="text-xs font-semibold text-brand-text-muted">SQLite Database Telemetry</span>
              <span class="badge badge-success text-[0.65rem] py-0.5">✓ Connected</span>
            </div>
            <div class="flex flex-col gap-1 text-xs text-brand-text-main">
              <div class="flex justify-between">
                <span class="text-brand-text-subtle">Synced Students:</span>
                <span class="font-bold font-mono">${students.length} accounts</span>
              </div>
              <div class="flex justify-between">
                <span class="text-brand-text-subtle">Synced Faculty:</span>
                <span class="font-bold font-mono">${faculty.length} accounts</span>
              </div>
              <div class="flex justify-between border-t border-brand-border/40 mt-1.5 pt-1.5">
                <span class="text-brand-text-subtle">Source Registry:</span>
                <span class="text-brand-primary font-mono text-[0.65rem] font-bold">authentication.txt</span>
              </div>
            </div>
          </div>

          <!-- Shortcuts -->
          <div class="flex flex-col gap-1.5">
            <span class="text-[0.65rem] font-semibold text-brand-text-subtle uppercase tracking-wider pl-1">System Shortcuts</span>
            <div class="grid grid-cols-2 gap-2">
              <button class="btn btn-secondary py-2 px-3 text-xs justify-start font-medium cursor-pointer" onclick="window.App.loadView('dashboard')">
                <span>Dashboard</span>
              </button>
              <button class="btn btn-secondary py-2 px-3 text-xs justify-start font-medium cursor-pointer" onclick="window.App.loadView('students')">
                <span>Students Registry</span>
              </button>
              <button class="btn btn-secondary py-2 px-3 text-xs justify-start font-medium cursor-pointer" onclick="window.App.loadView('finance')">
                <span>Finance Ledger</span>
              </button>
              <button class="btn btn-secondary py-2 px-3 text-xs justify-start font-medium cursor-pointer" onclick="window.App.loadView('blockchain')">
                <span>Blockchain Hub</span>
              </button>
            </div>
          </div>
        `;
        return;
      }

      // Case 2: Query contains input -> Search across students, faculty, and courses registries
      const students = window.UniversityDB.getStudents();
      const faculty = window.UniversityDB.getFaculty();
      const courses = window.UniversityDB.getCourses();

      // Search filters
      const matchedStudents = students.filter(s => s.name.toLowerCase().includes(query) || s.id.toLowerCase().includes(query)).slice(0, 4);
      const matchedFaculty = faculty.filter(f => f.name.toLowerCase().includes(query) || f.id.toLowerCase().includes(query)).slice(0, 4);
      const matchedCourses = courses.filter(c => c.title.toLowerCase().includes(query) || c.code.toLowerCase().includes(query)).slice(0, 4);

      const totalMatches = matchedStudents.length + matchedFaculty.length + matchedCourses.length;

      if (totalMatches === 0) {
        dropdown.innerHTML = `
          <div class="text-center py-4 text-brand-text-muted text-xs">
            No matching records found for "${val}"
          </div>
        `;
        return;
      }

      let html = '';

      // Render matching students
      if (matchedStudents.length > 0) {
        html += `
          <div class="flex flex-col gap-1">
            <span class="text-[0.65rem] font-semibold text-brand-text-subtle uppercase tracking-wider pl-1">Students</span>
            ${matchedStudents.map(s => `
              <div class="flex items-center justify-between p-2 hover:bg-white/[0.03] rounded-lg cursor-pointer transition-all duration-150 hover:pl-3" onclick="window.App.selectSearchResult('students', '${s.id}')">
                <div class="flex items-center gap-2 min-w-0">
                  <img src="${s.avatar}" class="w-6 h-6 rounded-full object-cover border border-brand-border shrink-0">
                  <span class="text-xs font-semibold truncate text-brand-text-main">${s.name}</span>
                </div>
                <code class="text-[0.65rem] text-brand-text-subtle font-mono">${s.id}</code>
              </div>
            `).join('')}
          </div>
        `;
      }

      // Render matching faculty
      if (matchedFaculty.length > 0) {
        html += `
          <div class="flex flex-col gap-1 ${matchedStudents.length > 0 ? 'border-t border-brand-border/40 pt-2' : ''}">
            <span class="text-[0.65rem] font-semibold text-brand-text-subtle uppercase tracking-wider pl-1">Faculty</span>
            ${matchedFaculty.map(f => `
              <div class="flex items-center justify-between p-2 hover:bg-white/[0.03] rounded-lg cursor-pointer transition-all duration-150 hover:pl-3" onclick="window.App.selectSearchResult('faculty', '${f.id}')">
                <div class="flex items-center gap-2 min-w-0">
                  <img src="${f.avatar}" class="w-6 h-6 rounded-full object-cover border border-brand-border shrink-0">
                  <span class="text-xs font-semibold truncate text-brand-text-main">${f.name}</span>
                </div>
                <code class="text-[0.65rem] text-brand-text-subtle font-mono">${f.id}</code>
              </div>
            `).join('')}
          </div>
        `;
      }

      // Render matching courses
      if (matchedCourses.length > 0) {
        html += `
          <div class="flex flex-col gap-1 ${matchedStudents.length > 0 || matchedFaculty.length > 0 ? 'border-t border-brand-border/40 pt-2' : ''}">
            <span class="text-[0.65rem] font-semibold text-brand-text-subtle uppercase tracking-wider pl-1">Courses</span>
            ${matchedCourses.map(c => `
              <div class="flex items-center justify-between p-2 hover:bg-white/[0.03] rounded-lg cursor-pointer transition-all duration-150 hover:pl-3" onclick="window.App.selectSearchResult('courses', '${c.code}')">
                <div class="min-w-0 flex flex-col">
                  <span class="text-xs font-semibold truncate text-brand-text-main">${c.title}</span>
                  <span class="text-[0.65rem] text-brand-text-muted truncate">${c.dept}</span>
                </div>
                <code class="text-[0.65rem] text-brand-primary font-mono font-bold">${c.code}</code>
              </div>
            `).join('')}
          </div>
        `;
      }

      dropdown.innerHTML = html;
    },

    selectSearchResult: function(view, id) {
      // Load target view
      this.loadView(view);

      // Highlight target nav item in sidebar
      const navLinks = document.querySelectorAll('.nav-link');
      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('data-view') === view) {
          link.classList.add('active');
        }
      });

      // Clear search input and hide suggestions dropdown
      const searchInput = document.getElementById('global-search-input');
      const searchDropdown = document.getElementById('global-search-dropdown');
      if (searchInput && searchDropdown) {
        searchInput.value = '';
        searchDropdown.classList.add('hidden');
        searchDropdown.classList.remove('flex');
      }

      // Open target detail modal/panel if appropriate
      setTimeout(() => {
        if (view === 'students' && window.studentsView && typeof window.studentsView.openStudentDetailModal === 'function') {
          window.studentsView.openStudentDetailModal(id);
        } else if (view === 'faculty' && window.facultyView && typeof window.facultyView.openAssignClassModal === 'function') {
          window.facultyView.openAssignClassModal(id);
        } else if (view === 'courses' && window.coursesView && typeof window.coursesView.openSyllabusModal === 'function') {
          window.coursesView.openSyllabusModal(id);
        }
      }, 150);
    }
  };

  // Safe launch check to prevent race conditions
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      window.App.init();
    });
  } else {
    window.App.init();
  }

})();
