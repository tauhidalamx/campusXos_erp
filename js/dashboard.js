// Dashboard Module - Role-Based ERP Console
window.dashboardView = (function() {
  
  // Chart instances for garbage collection
  let activeCharts = [];
  let telemetryInterval = null;

  // Cleanup helper
  function cleanupDashboard() {
    if (telemetryInterval) {
      clearInterval(telemetryInterval);
      telemetryInterval = null;
    }
    activeCharts.forEach(chart => {
      try { chart.destroy(); } catch (e) { console.warn(e); }
    });
    activeCharts = [];
  }

  // Local storage helpers for tasks
  function getTasks() {
    const defaultTasks = [
      { id: 1, text: "Approve graduation transcripts for STU006 PATEL", priority: "High", done: false },
      { id: 2, text: "Audit Stripe collection batch receipts for fee payments", priority: "Medium", done: true },
      { id: 3, text: "Verify blockchain credential hashes for CS101 course completions", priority: "Low", done: false }
    ];
    const saved = localStorage.getItem('campusx_admin_tasks');
    return saved ? JSON.parse(saved) : defaultTasks;
  }

  // Local storage helpers for calendar events
  function getEvents() {
    const defaultEvents = [
      { id: 1, date: "2026-06-15", title: "Semester Term Exams start", type: "Exam" },
      { id: 2, date: "2026-06-28", title: "Course Registration Deadline", type: "Academic" },
      { id: 3, date: "2026-07-01", title: "Summer Recess begins", type: "Holiday" }
    ];
    const saved = localStorage.getItem('campusx_academic_events');
    return saved ? JSON.parse(saved) : defaultEvents;
  }

  function saveTasks(tasks) {
    localStorage.setItem('campusx_admin_tasks', JSON.stringify(tasks));
  }

  function saveEvents(events) {
    localStorage.setItem('campusx_academic_events', JSON.stringify(events));
  }

  function updateTasksUI(container) {
    const listContainer = container.querySelector('#tasks-list-container');
    if (!listContainer) return;
    const tasks = getTasks();

    listContainer.innerHTML = tasks.length === 0 ? `
      <div class="text-center py-6 text-brand-text-muted text-xs">No pending tasks. Great job!</div>
    ` : tasks.map(t => {
      let priorityClass = 'bg-brand-primary/10 text-brand-primary';
      if (t.priority === 'High') priorityClass = 'bg-brand-accent-ruby/10 text-brand-accent-ruby';
      else if (t.priority === 'Medium') priorityClass = 'bg-brand-accent-amber/10 text-brand-accent-amber';
      else if (t.priority === 'Low') priorityClass = 'bg-brand-accent-cyan/10 text-brand-accent-cyan';

      return `
        <div class="flex items-center justify-between p-2.5 border border-brand-border rounded-xl bg-brand-bg-tertiary/30 hover:bg-brand-bg-tertiary/50 transition-all duration-200 ${t.done ? 'opacity-55' : ''}">
          <div class="flex items-center gap-2.5 min-w-0 flex-1">
            <input type="checkbox" class="task-checkbox accent-brand-primary cursor-pointer w-4 h-4 shrink-0" data-id="${t.id}" ${t.done ? 'checked' : ''}>
            <span class="text-xs font-medium text-brand-text-main truncate ${t.done ? 'line-through text-brand-text-subtle' : ''}">${t.text}</span>
          </div>
          <div class="flex items-center gap-1.5 shrink-0 ml-2">
            <span class="badge ${priorityClass} text-[0.6rem] px-1.5 py-0.5">${t.priority}</span>
            <button class="delete-task-btn text-brand-text-subtle hover:text-brand-accent-ruby p-1 transition-colors bg-transparent border-none cursor-pointer" data-id="${t.id}" title="Delete Task">
              <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
            </button>
          </div>
        </div>
      `;
    }).join('');

    // Bind events
    listContainer.querySelectorAll('.task-checkbox').forEach(chk => {
      chk.addEventListener('change', (e) => {
        const id = parseInt(e.target.getAttribute('data-id'));
        const tasks = getTasks();
        const t = tasks.find(item => item.id === id);
        if (t) {
          t.done = e.target.checked;
          saveTasks(tasks);
          updateTasksUI(container);
        }
      });
    });

    listContainer.querySelectorAll('.delete-task-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = parseInt(e.currentTarget.getAttribute('data-id'));
        let tasks = getTasks();
        tasks = tasks.filter(item => item.id !== id);
        saveTasks(tasks);
        updateTasksUI(container);
      });
    });
  }

  function updateEventsUI(container) {
    const eventContainer = container.querySelector('#events-list-container');
    if (!eventContainer) return;
    const events = getEvents();

    events.sort((a, b) => new Date(a.date) - new Date(b.date));

    eventContainer.innerHTML = events.length === 0 ? `
      <div class="text-center py-6 text-brand-text-muted text-xs">No upcoming events scheduled.</div>
    ` : events.map(ev => {
      let typeColor = 'border-brand-primary';
      let typeBadge = 'bg-brand-primary/10 text-brand-primary';
      if (ev.type === 'Exam') {
        typeColor = 'border-brand-accent-ruby';
        typeBadge = 'bg-brand-accent-ruby/10 text-brand-accent-ruby';
      } else if (ev.type === 'Holiday') {
        typeColor = 'border-brand-accent-amber';
        typeBadge = 'bg-brand-accent-amber/10 text-brand-accent-amber';
      } else if (ev.type === 'Academic') {
        typeColor = 'border-brand-accent-cyan';
        typeBadge = 'bg-brand-accent-cyan/10 text-brand-accent-cyan';
      }

      const dateObj = new Date(ev.date);
      const formattedDate = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

      return `
        <div class="flex items-center justify-between p-2.5 border-l-4 ${typeColor} bg-brand-bg-tertiary/30 rounded-r-xl border border-y-brand-border border-r-brand-border hover:bg-brand-bg-tertiary/50 transition-all duration-200">
          <div class="min-w-0 flex-1">
            <h4 class="text-xs font-semibold text-brand-text-main mt-0 mb-0.5 truncate">${ev.title}</h4>
            <span class="text-[0.65rem] text-brand-text-subtle">${formattedDate}</span>
          </div>
          <div class="flex items-center gap-2 shrink-0 ml-2">
            <span class="badge ${typeBadge} text-[0.6rem] px-1.5 py-0.5">${ev.type}</span>
            <button class="delete-event-btn text-brand-text-subtle hover:text-brand-accent-ruby p-1 transition-colors bg-transparent border-none cursor-pointer" data-id="${ev.id}" title="Remove Event">
              <svg viewBox="0 0 24 24" width="11" height="11" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>
        </div>
      `;
    }).join('');

    eventContainer.querySelectorAll('.delete-event-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = parseInt(e.currentTarget.getAttribute('data-id'));
        let events = getEvents();
        events = events.filter(item => item.id !== id);
        saveEvents(events);
        updateEventsUI(container);
      });
    });
  }

  // --- RENDERING ROUTER ---
  function render(container) {
    cleanupDashboard();

    const user = window.AuthSystem.getCurrentUser() || { role: 'admin', name: 'Dr. Evelyn Sterling' };
    
    // Inject active view wrapper class
    container.className = "page-transition flex flex-col gap-6 md:gap-8";

    // Branch to specific role dashboard
    if (user.role === 'student') {
      renderStudentDashboard(container, user);
    } else if (user.role === 'faculty') {
      renderFacultyDashboard(container, user);
    } else if (user.role === 'parent') {
      renderParentDashboard(container, user);
    } else if (user.role === 'alumni') {
      renderAlumniDashboard(container, user);
    } else if (user.role === 'recruiter') {
      renderRecruiterDashboard(container, user);
    } else if (user.role === 'finance_manager' || user.role === 'finance') {
      renderFinanceDashboard(container, user);
    } else if (user.role === 'placement_officer' || user.role === 'placement') {
      renderPlacementDashboard(container, user);
    } else if (user.role === 'research_coordinator' || user.role === 'research') {
      renderResearchDashboard(container, user);
    } else {
      renderAdminDashboard(container, user); // default to Admin/HOD
    }
  }

  // 1. ADMIN DASHBOARD
  function renderAdminDashboard(container, user) {
    const students = window.UniversityDB.getStudents();
    const faculty = window.UniversityDB.getFaculty();
    const courses = window.UniversityDB.getCourses();
    const depts = window.UniversityDB.getDepartments();
    const activities = window.UniversityDB.getActivities();
    const announcements = window.UniversityDB.getAnnouncements();
    const transactions = window.UniversityDB.getTransactions();

    // Calculations
    const activeStudents = students.filter(s => s.status === 'Active').length;
    const totalFaculty = faculty.length;
    const activeCourses = courses.filter(c => c.status === 'Active').length;
    const totalRevenue = transactions.reduce((acc, curr) => acc + curr.amount, 0);
    const totalDue = students.reduce((acc, curr) => acc + (curr.feeTotal - curr.feePaid), 0);
    const avgAttendance = Math.round(students.reduce((acc, curr) => acc + (curr.attendance || 0), 0) / (students.length || 1));

    container.innerHTML = `
      <div class="page-header animate-fade-in flex items-center justify-between border-b border-brand-border/30 pb-4 mb-2">
        <div>
          <h1 class="text-3xl font-bold font-display tracking-tight bg-gradient-to-r from-white via-slate-100 to-brand-primary bg-clip-text text-transparent">Administrative Console</h1>
          <p class="text-sm text-brand-text-muted mt-1">Global platform metrics, system nodes telemetry, and forecasting.</p>
        </div>
        <div class="btn-group flex gap-3">
          <button class="btn btn-secondary btn-sm flex items-center gap-2" onclick="alert('Registry report exported successfully!')">
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            <span>Export Report</span>
          </button>
          <button class="btn btn-primary btn-sm flex items-center gap-2" id="dashboard-refresh-btn">
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>
            <span>Sync Stats</span>
          </button>
        </div>
      </div>

      <!-- KPI Summary Cards -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5 animate-fade-in delay-1">
        <div class="card bg-brand-bg-secondary/40 backdrop-blur-md border border-brand-border/50 p-5 rounded-2xl flex justify-between items-start transition-all hover:border-brand-primary/45">
          <div>
            <span class="text-xs font-bold text-brand-text-muted uppercase tracking-wider">Active Enrollment</span>
            <span class="block text-2xl font-display font-bold text-brand-text-main mt-1.5">${activeStudents}</span>
            <span class="text-[0.7rem] text-brand-accent-emerald font-semibold flex items-center gap-0.5 mt-2">
              ▲ +4.8% sem forecast
            </span>
          </div>
          <div class="w-10 h-10 rounded-xl bg-brand-primary/10 border border-brand-primary/20 flex items-center justify-center text-brand-primary">🎓</div>
        </div>
        <div class="card bg-brand-bg-secondary/40 backdrop-blur-md border border-brand-border/50 p-5 rounded-2xl flex justify-between items-start transition-all hover:border-brand-primary/45">
          <div>
            <span class="text-xs font-bold text-brand-text-muted uppercase tracking-wider">Total Faculty</span>
            <span class="block text-2xl font-display font-bold text-brand-text-main mt-1.5">${totalFaculty}</span>
            <span class="text-[0.7rem] text-brand-accent-cyan font-semibold flex items-center gap-0.5 mt-2">
              ● 100% Active Staff
            </span>
          </div>
          <div class="w-10 h-10 rounded-xl bg-brand-accent-cyan/10 border border-brand-accent-cyan/20 flex items-center justify-center text-brand-accent-cyan">👨‍🏫</div>
        </div>
        <div class="card bg-brand-bg-secondary/40 backdrop-blur-md border border-brand-border/50 p-5 rounded-2xl flex justify-between items-start transition-all hover:border-brand-primary/45">
          <div>
            <span class="text-xs font-bold text-brand-text-muted uppercase tracking-wider">Active Catalog</span>
            <span class="block text-2xl font-display font-bold text-brand-text-main mt-1.5">${activeCourses}</span>
            <span class="text-[0.7rem] text-brand-accent-emerald font-semibold flex items-center gap-0.5 mt-2">
              ▲ +3 New syllabus
            </span>
          </div>
          <div class="w-10 h-10 rounded-xl bg-brand-accent-emerald/10 border border-brand-accent-emerald/20 flex items-center justify-center text-brand-accent-emerald">📚</div>
        </div>
        <div class="card bg-brand-bg-secondary/40 backdrop-blur-md border border-brand-border/50 p-5 rounded-2xl flex justify-between items-start transition-all hover:border-brand-primary/45">
          <div>
            <span class="text-xs font-bold text-brand-text-muted uppercase tracking-wider">Attendance Rate</span>
            <span class="block text-2xl font-display font-bold text-brand-text-main mt-1.5">${avgAttendance}%</span>
            <span class="text-[0.7rem] text-brand-accent-emerald font-semibold flex items-center gap-0.5 mt-2">
              ▲ +1.2% weekly gain
            </span>
          </div>
          <div class="w-10 h-10 rounded-xl bg-brand-accent-amber/10 border border-brand-accent-amber/20 flex items-center justify-center text-brand-accent-amber">🛡️</div>
        </div>
        <div class="card bg-brand-bg-secondary/40 backdrop-blur-md border border-brand-border/50 p-5 rounded-2xl flex justify-between items-start transition-all hover:border-brand-primary/45">
          <div>
            <span class="text-xs font-bold text-brand-text-muted uppercase tracking-wider">Collections</span>
            <span class="block text-2xl font-display font-bold text-brand-text-main mt-1.5">$${Math.round(totalRevenue/1000)}k</span>
            <span class="text-[0.7rem] text-brand-accent-emerald font-semibold flex items-center gap-0.5 mt-2">
              ▲ 92.3% targeted
            </span>
          </div>
          <div class="w-10 h-10 rounded-xl bg-brand-accent-cyan/10 border border-brand-accent-cyan/20 flex items-center justify-center text-brand-accent-cyan">💰</div>
        </div>
      </div>

      <!-- Infrastructure & Budget Allocations -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-2 animate-fade-in delay-2">
        <!-- Telemetry Monitor -->
        <div class="card bg-brand-bg-secondary/40 backdrop-blur-md border border-brand-border/50 p-6 rounded-2xl">
          <div class="flex items-center justify-between border-b border-brand-border/30 pb-3 mb-4">
            <h3 class="font-display text-base font-bold flex items-center gap-2 m-0 text-brand-text-main">
              🖥️ Infrastructure Node Telemetry
            </h3>
            <div class="flex items-center gap-2 bg-brand-accent-emerald/10 border border-brand-accent-emerald/20 px-2.5 py-1 rounded-full">
              <span class="relative flex h-2 w-2">
                <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-accent-emerald opacity-75"></span>
                <span class="relative inline-flex rounded-full h-2 w-2 bg-brand-accent-emerald"></span>
              </span>
              <span class="text-[0.65rem] font-bold text-brand-accent-emerald uppercase tracking-wider">Online</span>
            </div>
          </div>
          <div class="flex flex-col gap-4 text-xs">
            <div class="flex justify-between items-center">
              <span class="text-brand-text-muted font-medium">Core CPU utilization:</span>
              <div class="flex items-center gap-3 w-44">
                <div class="bg-brand-bg-primary h-2 rounded-full overflow-hidden flex-1 border border-brand-border/40">
                  <div id="telemetry-cpu-bar" class="bg-brand-primary h-full rounded-full transition-all duration-300" style="width: 24%"></div>
                </div>
                <span id="telemetry-cpu-val" class="font-mono font-bold w-12 text-right text-brand-text-main">24%</span>
              </div>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-brand-text-muted font-medium">Memory Allocation:</span>
              <div class="flex items-center gap-3 w-44">
                <div class="bg-brand-bg-primary h-2 rounded-full overflow-hidden flex-1 border border-brand-border/40">
                  <div id="telemetry-ram-bar" class="bg-brand-accent-cyan h-full rounded-full transition-all duration-300" style="width: 64%"></div>
                </div>
                <span id="telemetry-ram-val" class="font-mono font-bold w-12 text-right text-brand-text-main">64%</span>
              </div>
            </div>
            <div class="flex justify-between">
              <span class="text-brand-text-muted font-medium">Core API Latency:</span>
              <span id="telemetry-latency-val" class="font-mono font-bold text-brand-accent-emerald">12ms</span>
            </div>
            <div class="flex justify-between">
              <span class="text-brand-text-muted font-medium">Local Database Engine:</span>
              <span class="font-mono font-bold text-brand-text-main">SQLite 3.45.1 (1.2 MB)</span>
            </div>
            <div class="flex justify-between">
              <span class="text-brand-text-muted font-medium">EduChain Node Connection:</span>
              <span class="font-mono font-bold text-brand-accent-cyan">Synced • Block #254</span>
            </div>
            <div class="flex justify-between border-t border-brand-border/30 pt-3">
              <span class="text-brand-text-muted font-medium">AI Telemetry Forecast (1hr):</span>
              <span id="telemetry-ai-forecast" class="font-mono font-bold text-brand-primary">Stable</span>
            </div>
          </div>
        </div>

        <!-- Budget Allocations -->
        <div class="card bg-brand-bg-secondary/40 backdrop-blur-md border border-brand-border/50 p-6 rounded-2xl">
          <h3 class="mb-4 font-display text-base font-bold m-0 border-b border-brand-border/30 pb-3 text-brand-text-main">Funding & Budget Allocations</h3>
          <div class="flex flex-col gap-4 mt-2">
            <div>
              <div class="flex justify-between text-[0.7rem] font-bold mb-1.5 uppercase tracking-wider text-brand-text-muted">
                <span>Core Operating Budget</span>
                <span class="text-brand-text-main font-mono">$1,450,000 / $1,800,000 (80.5%)</span>
              </div>
              <div class="bg-brand-bg-primary h-2 rounded-full overflow-hidden w-full border border-brand-border/40">
                <div class="bg-gradient-to-r from-brand-primary to-brand-accent-cyan h-full rounded-full" style="width: 80.5%"></div>
              </div>
            </div>
            <div>
              <div class="flex justify-between text-[0.7rem] font-bold mb-1.5 uppercase tracking-wider text-brand-text-muted">
                <span>Scholarship & Research Allocations</span>
                <span class="text-brand-text-main font-mono">$85,000 / $120,000 (70.8%)</span>
              </div>
              <div class="bg-brand-bg-primary h-2 rounded-full overflow-hidden w-full border border-brand-border/40">
                <div class="bg-gradient-to-r from-brand-accent-emerald to-brand-accent-cyan h-full rounded-full" style="width: 70.8%"></div>
              </div>
            </div>
            <div>
              <div class="flex justify-between text-[0.7rem] font-bold mb-1.5 uppercase tracking-wider text-brand-text-muted">
                <span>Fee Invoice Collections Target</span>
                <span class="text-brand-text-main font-mono">$${totalRevenue.toLocaleString()} / $${(totalRevenue + totalDue).toLocaleString()} (${((totalRevenue / (totalRevenue + totalDue || 1)) * 100).toFixed(1)}%)</span>
              </div>
              <div class="bg-brand-bg-primary h-2 rounded-full overflow-hidden w-full border border-brand-border/40">
                <div class="bg-gradient-to-r from-brand-accent-amber to-brand-accent-ruby h-full rounded-full" style="width: ${((totalRevenue / (totalRevenue + totalDue || 1)) * 100).toFixed(1)}%"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Charts Section -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-2 animate-fade-in delay-2">
        <div class="card bg-brand-bg-secondary/40 backdrop-blur-md border border-brand-border/50 p-6 rounded-2xl h-[330px]">
          <h3 class="mb-3 font-display text-base font-bold text-brand-text-main">Enrollment Trends</h3>
          <div class="chart-wrapper h-[240px]">
            <canvas id="enrollment-line-chart"></canvas>
          </div>
        </div>
        
        <div class="card bg-brand-bg-secondary/40 backdrop-blur-md border border-brand-border/50 p-6 rounded-2xl h-[330px]">
          <h3 class="mb-3 font-display text-base font-bold text-brand-text-main">Department Distribution</h3>
          <div class="chart-wrapper h-[240px]">
            <canvas id="dept-donut-chart"></canvas>
          </div>
        </div>
      </div>

      <!-- TensorFlow Forecasting Section -->
      <div class="card bg-brand-bg-secondary/40 backdrop-blur-md border border-brand-border/50 p-6 rounded-2xl animate-fade-in delay-3">
        <div class="flex justify-between items-center border-b border-brand-border/30 pb-4 mb-5">
          <div>
            <h3 class="font-display flex items-center gap-2 m-0 text-base font-bold text-brand-text-main">
              📈 AI Enrollment Forecasting
            </h3>
            <p class="text-[0.85rem] text-brand-text-muted mt-1 m-0">In-browser regression neural network trained on registration logs using TensorFlow.js.</p>
          </div>
          <span class="badge bg-brand-primary/10 border-brand-primary/20 text-brand-primary font-semibold text-xs py-1 px-3">TensorFlow.js Engine</span>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-6">
          <div class="flex flex-col gap-4 border-r border-brand-border/30 pr-6 max-md:border-r-0 max-md:pr-0">
            <div>
              <label class="block text-[0.65rem] font-bold text-brand-text-muted uppercase tracking-wider mb-1.5 pl-0.5">Optimizer Learning Rate</label>
              <select id="tf-lr-select" class="w-full bg-brand-bg-tertiary border border-brand-border text-brand-text-main p-2 rounded-lg text-xs outline-none focus:border-brand-primary/50">
                <option value="0.01">0.01 (Slow & Stable)</option>
                <option value="0.05" selected>0.05 (Default)</option>
                <option value="0.1">0.10 (Fast)</option>
              </select>
            </div>
            <div>
              <label class="block text-[0.65rem] font-bold text-brand-text-muted uppercase tracking-wider mb-1.5 pl-0.5">Training Epochs</label>
              <input type="range" id="tf-epochs-range" min="50" max="300" step="50" value="150" class="w-full accent-brand-primary cursor-pointer">
              <span id="tf-epochs-val" class="text-[0.75rem] text-brand-text-muted float-right mt-1 font-mono font-medium">150 epochs</span>
            </div>
            <div>
              <label class="block text-[0.65rem] font-bold text-brand-text-muted uppercase tracking-wider mb-1.5 pl-0.5">Forecast Horizon</label>
              <select id="tf-horizon-select" class="w-full bg-brand-bg-tertiary border border-brand-border text-brand-text-main p-2 rounded-lg text-xs outline-none focus:border-brand-primary/50">
                <option value="1">1 Term (2026-B)</option>
                <option value="2" selected>2 Terms (2026-B & 2027-A)</option>
                <option value="3">3 Terms (Up to 2027-B)</option>
              </select>
            </div>
            <button class="btn btn-primary w-full justify-center flex items-center gap-2 py-2" id="tf-train-btn">
              <span>Run ML Projection</span>
            </button>
            <div id="tf-status-card" class="bg-brand-bg-tertiary/60 p-3 rounded-xl border border-brand-border/40" style="display:none;">
              <div class="flex justify-between text-xs mb-1">
                <span class="text-brand-text-subtle">Epoch:</span>
                <span id="tf-epoch-disp" class="font-semibold text-brand-text-main font-mono">0/150</span>
              </div>
              <div class="flex justify-between text-xs mb-2">
                <span class="text-brand-text-subtle">Loss:</span>
                <span id="tf-loss-disp" class="font-mono text-brand-accent-amber">0.00000</span>
              </div>
              <div class="bg-brand-bg-primary rounded-full h-1.5 overflow-hidden w-full border border-brand-border/30">
                <div id="tf-progress-bar" class="bg-brand-primary h-full w-0 transition-all duration-100"></div>
              </div>
            </div>
            <div id="tf-metrics-card" class="bg-brand-bg-tertiary/40 p-3 rounded-xl border border-brand-border/40 text-[0.75rem] flex flex-col gap-1.5">
              <div>Telemetry Status: <span id="tf-status-text" class="text-brand-accent-cyan font-bold uppercase">Untrained</span></div>
              <div class="font-mono text-brand-text-subtle">Fit: <span id="tf-equation-fit">y = mx + c</span></div>
            </div>
          </div>

          <div class="flex flex-col h-[300px]">
            <h4 class="text-xs font-semibold text-brand-text-main m-0 mb-3">Model Prediction Curve</h4>
            <div class="chart-wrapper flex-1 h-[250px]">
              <canvas id="tf-forecast-chart"></canvas>
            </div>
          </div>
        </div>
      </div>

      <!-- Task Lists & Notices -->
      <div class="grid grid-cols-1 xl:grid-cols-3 gap-6 animate-fade-in delay-3">
        <!-- Task Checklist -->
        <div class="card bg-brand-bg-secondary/40 backdrop-blur-md border border-brand-border/50 p-6 rounded-2xl flex flex-col h-[380px]">
          <h3 class="mb-3 font-display text-base font-bold m-0 border-b border-brand-border/30 pb-3 text-brand-text-main">System Task Checklist</h3>
          <div class="flex gap-2 mb-3">
            <input type="text" id="new-task-input" placeholder="Type new task..." class="bg-brand-bg-tertiary border border-brand-border text-brand-text-main px-3 py-1.5 rounded-lg text-xs outline-none focus:border-brand-primary/50 flex-1">
            <select id="new-task-priority" class="bg-brand-bg-tertiary border border-brand-border text-brand-text-main px-2 py-1.5 rounded-lg text-xs outline-none focus:border-brand-primary/50 font-semibold cursor-pointer">
              <option value="High">High</option>
              <option value="Medium" selected>Medium</option>
              <option value="Low">Low</option>
            </select>
            <button class="btn btn-primary btn-sm flex items-center justify-center w-8 h-8 rounded-lg font-bold" id="add-task-btn">+</button>
          </div>
          <div id="tasks-list-container" class="flex-1 overflow-y-auto flex flex-col gap-2"></div>
        </div>

        <!-- Academic Planner -->
        <div class="card bg-brand-bg-secondary/40 backdrop-blur-md border border-brand-border/50 p-6 rounded-2xl flex flex-col h-[380px]">
          <div class="flex justify-between items-center mb-3 border-b border-brand-border/30 pb-3">
            <h3 class="font-display text-base font-bold m-0 text-brand-text-main">Academic Calendar</h3>
            <button class="btn btn-secondary btn-sm px-2.5 py-1 text-xs font-semibold" id="toggle-event-form-btn">+ Planner</button>
          </div>
          <div id="add-event-panel" class="hidden bg-brand-bg-tertiary/40 p-3 rounded-xl border border-brand-border/40 mb-3">
            <div class="flex flex-col gap-2">
              <div class="flex gap-2">
                <input type="text" id="new-event-title" placeholder="Event name..." class="bg-brand-bg-tertiary border border-brand-border text-brand-text-main px-2.5 py-1.5 rounded-lg text-xs outline-none flex-1">
                <select id="new-event-type" class="bg-brand-bg-tertiary border border-brand-border text-brand-text-main px-1.5 py-1 rounded-lg text-xs outline-none cursor-pointer">
                  <option value="Academic">Academic</option>
                  <option value="Exam">Exam</option>
                  <option value="Holiday">Holiday</option>
                </select>
              </div>
              <div class="flex gap-2 items-center justify-between">
                <input type="date" id="new-event-date" class="bg-brand-bg-tertiary border border-brand-border text-brand-text-main px-2.5 py-1.5 rounded-lg text-xs outline-none flex-1">
                <button class="btn btn-primary btn-sm px-4 py-1.5" id="save-event-btn">Add</button>
              </div>
            </div>
          </div>
          <div id="events-list-container" class="flex-1 overflow-y-auto flex flex-col gap-2"></div>
        </div>

        <!-- Notices Board & Log Audit Trail -->
        <div class="card bg-brand-bg-secondary/40 backdrop-blur-md border border-brand-border/50 p-6 rounded-2xl flex flex-col h-[380px]">
          <div class="flex border-b border-brand-border/30 pb-1.5 mb-3 gap-4">
            <button id="tab-notices" class="bg-transparent border-none text-brand-text-main font-display text-base font-bold pb-2 cursor-pointer border-b-2 border-brand-primary" style="margin-bottom: -8px;">
              Notices Desk
            </button>
            <button id="tab-activities" class="bg-transparent border-none text-brand-text-muted font-display text-base font-semibold pb-2 cursor-pointer border-b-2 border-transparent hover:text-brand-text-main" style="margin-bottom: -8px;">
              Audit Logs
            </button>
          </div>

          <div id="notices-tab-content" class="flex-1 overflow-y-auto flex flex-col gap-3.5">
            ${announcements.slice(0, 3).map(ann => `
              <div class="pl-3 border-l-2" style="border-color: ${ann.color || '#6366f1'}">
                <div class="flex justify-between items-center">
                  <span class="badge bg-brand-bg-tertiary text-brand-text-main text-[0.65rem] px-2 py-0.5 rounded border border-brand-border/40 font-semibold uppercase tracking-wider">${ann.tag}</span>
                  <span class="text-[0.65rem] text-brand-text-subtle font-mono">${ann.date}</span>
                </div>
                <h4 class="my-1 text-xs font-bold text-brand-text-main">${ann.title}</h4>
                <p class="text-xs text-brand-text-muted leading-relaxed m-0">${ann.content}</p>
              </div>
            `).join('')}
            <div class="mt-auto pt-2">
              <button class="btn btn-secondary btn-sm w-full font-bold" id="view-notices-btn">Open Notice Board</button>
            </div>
          </div>

          <div id="activities-tab-content" class="hidden flex-1 overflow-y-auto flex flex-col gap-3">
            ${activities.map(act => `
              <div class="flex items-center justify-between pb-2 border-b border-brand-border/40">
                <div class="flex items-center gap-2.5 min-w-0 flex-1">
                  <div class="w-2.5 h-2.5 rounded-full bg-brand-accent-cyan shrink-0 animate-pulse"></div>
                  <span class="text-xs text-brand-text-main truncate">${act.text}</span>
                </div>
                <span class="text-[0.65rem] text-brand-text-subtle font-mono shrink-0 ml-2">${act.time || 'recent'}</span>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;

    // Event Bindings for Admin
    const refreshBtn = container.querySelector('#dashboard-refresh-btn');
    if (refreshBtn) refreshBtn.addEventListener('click', () => render(container));

    const noticesBtn = container.querySelector('#view-notices-btn');
    if (noticesBtn) noticesBtn.addEventListener('click', () => window.App.loadView('announcements'));

    const epochsRange = container.querySelector('#tf-epochs-range');
    const epochsVal = container.querySelector('#tf-epochs-val');
    if (epochsRange && epochsVal) {
      epochsRange.addEventListener('input', (e) => {
        epochsVal.innerText = `${e.target.value} epochs`;
      });
    }

    const trainBtn = container.querySelector('#tf-train-btn');
    if (trainBtn) {
      trainBtn.addEventListener('click', () => {
        runTfTraining(container, students);
      });
    }

    // Load sub-modules
    updateTasksUI(container);
    updateEventsUI(container);

    const addTaskBtn = container.querySelector('#add-task-btn');
    const newTaskInput = container.querySelector('#new-task-input');
    const newTaskPriority = container.querySelector('#new-task-priority');
    if (addTaskBtn && newTaskInput && newTaskPriority) {
      addTaskBtn.addEventListener('click', () => {
        const text = newTaskInput.value.trim();
        if (!text) return;
        const priority = newTaskPriority.value;
        const tasks = getTasks();
        tasks.push({ id: Date.now(), text, priority, done: false });
        saveTasks(tasks);
        newTaskInput.value = '';
        updateTasksUI(container);
      });
    }

    const toggleEventFormBtn = container.querySelector('#toggle-event-form-btn');
    const addEventPanel = container.querySelector('#add-event-panel');
    const saveEventBtn = container.querySelector('#save-event-btn');
    const newEventTitle = container.querySelector('#new-event-title');
    const newEventType = container.querySelector('#new-event-type');
    const newEventDate = container.querySelector('#new-event-date');

    if (toggleEventFormBtn && addEventPanel) {
      toggleEventFormBtn.addEventListener('click', () => {
        addEventPanel.classList.toggle('hidden');
        if (newEventDate && !newEventDate.value) {
          newEventDate.value = new Date().toISOString().split('T')[0];
        }
      });
    }

    if (saveEventBtn && newEventTitle && newEventDate && newEventType) {
      saveEventBtn.addEventListener('click', () => {
        const title = newEventTitle.value.trim();
        const date = newEventDate.value;
        const type = newEventType.value;
        if (!title || !date) return alert('Fill title and date');
        const events = getEvents();
        events.push({ id: Date.now(), title, date, type });
        saveEvents(events);
        newEventTitle.value = '';
        addEventPanel.classList.add('hidden');
        updateEventsUI(container);
      });
    }

    // Tabs notices/activities
    const tabNotices = container.querySelector('#tab-notices');
    const tabActivities = container.querySelector('#tab-activities');
    const noticesContent = container.querySelector('#notices-tab-content');
    const activitiesContent = container.querySelector('#activities-tab-content');

    if (tabNotices && tabActivities && noticesContent && activitiesContent) {
      tabNotices.addEventListener('click', () => {
        tabNotices.className = "bg-transparent border-none text-brand-text-main font-display text-base font-bold pb-2 cursor-pointer border-b-2 border-brand-primary";
        tabActivities.className = "bg-transparent border-none text-brand-text-muted font-display text-base font-semibold pb-2 cursor-pointer border-b-2 border-transparent hover:text-brand-text-main";
        noticesContent.classList.remove('hidden');
        activitiesContent.classList.add('hidden');
      });

      tabActivities.addEventListener('click', () => {
        tabActivities.className = "bg-transparent border-none text-brand-text-main font-display text-base font-bold pb-2 cursor-pointer border-b-2 border-brand-primary";
        tabNotices.className = "bg-transparent border-none text-brand-text-muted font-display text-base font-semibold pb-2 cursor-pointer border-b-2 border-transparent hover:text-brand-text-main";
        activitiesContent.classList.remove('hidden');
        noticesContent.classList.add('hidden');
      });
    }

    // Telemetry Loops
    telemetryInterval = setInterval(() => {
      const cpuBar = container.querySelector('#telemetry-cpu-bar');
      const cpuVal = container.querySelector('#telemetry-cpu-val');
      const latencyVal = container.querySelector('#telemetry-latency-val');
      const ramBar = container.querySelector('#telemetry-ram-bar');
      const ramVal = container.querySelector('#telemetry-ram-val');

      if (cpuBar && cpuVal && latencyVal && ramBar && ramVal) {
        const cpu = Math.floor(15 + Math.random() * 30);
        cpuBar.style.width = `${cpu}%`;
        cpuVal.innerText = `${cpu}%`;

        const latency = Math.floor(8 + Math.random() * 15);
        latencyVal.innerText = `${latency}ms`;

        const ramPercent = (63 + Math.random() * 3).toFixed(1);
        const ramUsed = (8 * ramPercent / 100).toFixed(2);
        ramBar.style.width = `${ramPercent}%`;
        ramVal.innerText = `${ramUsed} GB / 8.00 GB (${ramPercent}%)`;

        let aiLoadText = 'Stable';
        let aiClass = 'text-brand-primary';
        if (typeof tf !== 'undefined') {
          try {
            const x = tf.tensor2d([[cpu / 100.0, parseFloat(ramPercent) / 100.0, latency / 50.0]]);
            const w = tf.tensor2d([[1.2], [0.6], [0.4]]);
            const y = tf.matMul(x, w);
            const val = y.dataSync()[0];
            const loadVal = val * 50;

            if (loadVal > 40) {
              aiLoadText = `Heavy Load (~${Math.round(loadVal)}%)`;
              aiClass = 'text-brand-accent-ruby font-bold';
            } else if (loadVal > 25) {
              aiLoadText = `Elevated (~${Math.round(loadVal)}%)`;
              aiClass = 'text-brand-accent-amber font-bold';
            } else {
              aiLoadText = `Stable (~${Math.round(loadVal)}%)`;
              aiClass = 'text-brand-accent-emerald font-bold';
            }

            x.dispose();
            w.dispose();
            y.dispose();
          } catch (e) {
            console.warn(e);
          }
        }
        const forecastVal = container.querySelector('#telemetry-ai-forecast');
        if (forecastVal) {
          forecastVal.innerText = aiLoadText;
          forecastVal.className = `font-mono ${aiClass}`;
        }
      }
    }, 2500);

    // Render Charts
    setTimeout(() => {
      initAdminCharts(container, students, depts);
    }, 100);
  }

  function initAdminCharts(container, students, depts) {
    const ctxEnrollment = container.querySelector('#enrollment-line-chart');
    if (ctxEnrollment) {
      const activeStudents = students.filter(s => s.status === 'Active').length;
      const chart1 = new Chart(ctxEnrollment, {
        type: 'line',
        data: {
          labels: ['2022-A', '2022-B', '2023-A', '2023-B', '2024-A', '2024-B', '2025-A', '2025-B', '2026-A'],
          datasets: [{
            label: 'Total Enrollment',
            data: [350, 390, 420, 480, 510, 560, 620, 680, activeStudents],
            borderColor: '#6366f1',
            backgroundColor: 'rgba(99, 102, 241, 0.08)',
            borderWidth: 3,
            fill: true,
            tension: 0.4
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: {
            y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#9ca3af' } },
            x: { grid: { display: false }, ticks: { color: '#9ca3af' } }
          }
        }
      });
      activeCharts.push(chart1);
    }

    const ctxDept = container.querySelector('#dept-donut-chart');
    if (ctxDept) {
      const deptCounts = {};
      depts.forEach(d => {
        deptCounts[d.code] = { count: 0, name: d.name, color: d.color };
      });
      students.forEach(s => {
        if (deptCounts[s.dept]) deptCounts[s.dept].count++;
      });

      const labels = Object.keys(deptCounts);
      const data = Object.values(deptCounts).map(d => d.count);
      const backgroundColors = ['#6366f1', '#06b6d4', '#10b981', '#f59e0b', '#ef4444'];

      const chart2 = new Chart(ctxDept, {
        type: 'doughnut',
        data: {
          labels: labels,
          datasets: [{
            data: data,
            backgroundColor: backgroundColors,
            borderColor: '#111827',
            borderWidth: 3
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'right',
              labels: { color: '#9ca3af', font: { family: 'Inter' } }
            }
          },
          cutout: '65%'
        }
      });
      activeCharts.push(chart2);
    }

    initForecastChart(container, students);
  }

  function initForecastChart(container, students) {
    const ctx = container.querySelector('#tf-forecast-chart');
    if (!ctx) return;

    const activeStudents = students.filter(s => s.status === 'Active').length;
    const historicalLabels = ['2022-A', '2022-B', '2023-A', '2023-B', '2024-A', '2024-B', '2025-A', '2025-B', '2026-A'];
    const historicalData = [350, 390, 420, 480, 510, 560, 620, 680, activeStudents];

    const chart3 = new Chart(ctx, {
      type: 'line',
      data: {
        labels: historicalLabels,
        datasets: [
          {
            label: 'Historical Enrollment',
            data: historicalData,
            borderColor: 'rgba(99, 102, 241, 0.4)',
            backgroundColor: 'transparent',
            pointBackgroundColor: '#6366f1',
            pointRadius: 6,
            borderWidth: 2,
            showLine: true
          },
          {
            label: 'Model Fit & Prediction',
            data: [],
            borderColor: '#f59e0b',
            backgroundColor: 'transparent',
            borderWidth: 3,
            borderDash: [5, 5],
            pointRadius: 0
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: true, labels: { color: '#9ca3af' } } },
        scales: {
          y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#9ca3af' } },
          x: { grid: { display: false }, ticks: { color: '#9ca3af' } }
        }
      }
    });
    activeCharts.push(chart3);
  }

  async function runTfTraining(container, students) {
    const trainBtn = container.querySelector('#tf-train-btn');
    if (!trainBtn || trainBtn.disabled) return;
    
    if (typeof tf === 'undefined') return alert('TensorFlow.js not loaded!');

    trainBtn.disabled = true;
    trainBtn.innerText = 'Training Model...';
    
    const statusCard = container.querySelector('#tf-status-card');
    if (statusCard) statusCard.style.display = 'block';
    
    const activeStudents = students.filter(s => s.status === 'Active').length;
    const xVal = [0, 1, 2, 3, 4, 5, 6, 7, 8];
    const yVal = [350, 390, 420, 480, 510, 560, 620, 680, activeStudents];

    const xs = tf.tensor2d(xVal.map(x => x / 8), [9, 1]);
    const ys = tf.tensor2d(yVal.map(y => y / 1000), [9, 1]);

    const model = tf.sequential();
    model.add(tf.layers.dense({ units: 1, inputShape: [1] }));

    const lrSelect = container.querySelector('#tf-lr-select');
    const epochsRange = container.querySelector('#tf-epochs-range');
    const horizonSelect = container.querySelector('#tf-horizon-select');

    const lr = lrSelect ? parseFloat(lrSelect.value) : 0.05;
    const epochs = epochsRange ? parseInt(epochsRange.value) : 150;
    const horizon = horizonSelect ? parseInt(horizonSelect.value) : 2;

    model.compile({ optimizer: tf.train.adam(lr), loss: 'meanSquaredError' });

    try {
      await model.fit(xs, ys, {
        epochs: epochs,
        callbacks: {
          onEpochEnd: (epoch, logs) => {
            const progress = ((epoch + 1) / epochs) * 100;
            const disp = container.querySelector('#tf-epoch-disp');
            const lossDisp = container.querySelector('#tf-loss-disp');
            const pBar = container.querySelector('#tf-progress-bar');
            if (disp) disp.innerText = `${epoch + 1}/${epochs}`;
            if (lossDisp) lossDisp.innerText = logs.loss.toFixed(6);
            if (pBar) pBar.style.width = `${progress}%`;
          }
        }
      });

      const weights = model.layers[0].getWeights();
      const w = weights[0].dataSync()[0];
      const b = weights[1].dataSync()[0];

      const m = (1000 * w) / 8;
      const c = 1000 * b;

      const statusText = container.querySelector('#tf-status-text');
      const fitText = container.querySelector('#tf-equation-fit');
      if (statusText) {
        statusText.innerText = 'Trained successfully';
        statusText.className = 'text-brand-accent-emerald font-bold';
      }
      if (fitText) fitText.innerText = `y = ${m.toFixed(2)}x + ${c.toFixed(2)}`;

      const totalTerms = 9 + horizon;
      const allLabels = ['2022-A', '2022-B', '2023-A', '2023-B', '2024-A', '2024-B', '2025-A', '2025-B', '2026-A'];
      const years = [2026, 2027, 2028];
      let currentYearIndex = 0;
      let currentTermLetter = 'B';
      for (let i = 0; i < horizon; i++) {
        allLabels.push(`${years[currentYearIndex]}-${currentTermLetter}`);
        if (currentTermLetter === 'B') {
          currentTermLetter = 'A';
          currentYearIndex++;
        } else {
          currentTermLetter = 'B';
        }
      }

      const fitAndPredictData = [];
      for (let i = 0; i < totalTerms; i++) {
        fitAndPredictData.push(Math.round(m * i + c));
      }

      const forecastChart = activeCharts.find(c => c.canvas.id === 'tf-forecast-chart');
      if (forecastChart) {
        forecastChart.data.labels = allLabels;
        const paddedHistorical = [...yVal];
        while (paddedHistorical.length < totalTerms) paddedHistorical.push(null);
        forecastChart.data.datasets[0].data = paddedHistorical;
        forecastChart.data.datasets[1].data = fitAndPredictData;
        forecastChart.update();
      }
    } catch (err) {
      console.error(err);
    } finally {
      xs.dispose();
      ys.dispose();
      model.dispose();
      trainBtn.disabled = false;
      trainBtn.innerText = 'Run ML Projection';
    }
  }

  // Helper macro to generate generic KPI Card
  function makeHtmlKpi(label, value, badgeText, icon, colorClass = 'brand-primary') {
    return `
      <div class="card bg-brand-bg-secondary/40 backdrop-blur-md border border-brand-border/50 p-5 rounded-2xl flex justify-between items-start transition-all hover:border-brand-primary/45">
        <div>
          <span class="text-xs font-bold text-brand-text-muted uppercase tracking-wider">${label}</span>
          <span class="block text-2xl font-display font-bold text-brand-text-main mt-1.5">${value}</span>
          <span class="text-[0.7rem] text-brand-accent-emerald font-semibold flex items-center gap-0.5 mt-2">
            ● ${badgeText}
          </span>
        </div>
        <div class="w-10 h-10 rounded-xl bg-${colorClass}/10 border border-${colorClass}/20 flex items-center justify-center text-${colorClass}">
          ${icon}
        </div>
      </div>
    `;
  }

  // 2. STUDENT DASHBOARD
  function renderStudentDashboard(container, user) {
    const students = window.UniversityDB.getStudents();
    const student = students.find(s => s.email === user.email) || students[0];

    container.innerHTML = `
      <div class="page-header animate-fade-in flex items-center justify-between border-b border-brand-border/30 pb-4">
        <div>
          <h1 class="text-3xl font-bold font-display tracking-tight bg-gradient-to-r from-white via-slate-100 to-brand-primary bg-clip-text text-transparent">Student Workspace</h1>
          <p class="text-sm text-brand-text-muted mt-1">Welcome back, ${student.name}. Review grades, courses, and forecast placement odds.</p>
        </div>
        <span class="badge bg-brand-primary/20 text-brand-primary px-3 py-1 font-semibold text-xs border border-brand-primary/30">Sem ${student.semester || 1} • Active</span>
      </div>

      <!-- KPIs -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 animate-fade-in delay-1">
        ${makeHtmlKpi("Current GPA", student.gpa.toFixed(2), "Class rank top 10%", "🏆", "brand-primary")}
        ${makeHtmlKpi("Attendance", `${student.attendance || 90}%`, "Excellent participation", "📈", "brand-accent-emerald")}
        ${makeHtmlKpi("Enrolled Courses", `${student.courses ? student.courses.length : 0} Subjects`, "Regular syllabus load", "📚", "brand-accent-cyan")}
        ${makeHtmlKpi("Tuition Fees Due", `$${student.feeTotal - student.feePaid}`, "Grace period active", "💳", "brand-accent-ruby")}
      </div>

      <!-- Main Layout -->
      <div class="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-6 animate-fade-in delay-2">
        
        <!-- Left Side: Courses & Schedules -->
        <div class="flex flex-col gap-6">
          <div class="card bg-brand-bg-secondary/40 backdrop-blur-md border border-brand-border/50 p-6 rounded-2xl">
            <h3 class="font-display text-base font-bold text-brand-text-main border-b border-brand-border/30 pb-3 mb-4">My Enrolled Course Curriculum</h3>
            <div class="overflow-x-auto">
              <table class="w-full text-left border-collapse text-xs">
                <thead>
                  <tr class="border-b border-brand-border text-brand-text-muted font-semibold">
                    <th class="pb-2">Code</th>
                    <th class="pb-2">Course Title</th>
                    <th class="pb-2 text-right">Credits</th>
                  </tr>
                </thead>
                <tbody>
                  ${(student.courses || ['CS101', 'CS202']).map(code => {
                    const c = window.UniversityDB.getCourses().find(co => co.code === code) || { name: 'Core Subject', credits: 4 };
                    return `
                      <tr class="border-b border-brand-border/30 text-brand-text-main hover:bg-brand-bg-tertiary/20">
                        <td class="py-2.5 font-mono text-brand-primary">${code}</td>
                        <td class="py-2.5 font-medium">${c.name}</td>
                        <td class="py-2.5 text-right font-bold">${c.credits || 4}</td>
                      </tr>
                    `;
                  }).join('')}
                </tbody>
              </table>
            </div>
          </div>

          <div class="card bg-brand-bg-secondary/40 backdrop-blur-md border border-brand-border/50 p-6 rounded-2xl">
            <h3 class="font-display text-base font-bold text-brand-text-main border-b border-brand-border/30 pb-3 mb-4">Upcoming Examinations</h3>
            <div class="flex flex-col gap-3">
              <div class="flex items-center justify-between p-3 border border-brand-border/40 rounded-xl bg-brand-bg-tertiary/20">
                <div>
                  <h4 class="text-xs font-bold text-brand-text-main">CS101 Midterm Examination</h4>
                  <span class="text-[0.65rem] text-brand-text-subtle">Date: 2026-08-15 | Hall: Block A-3</span>
                </div>
                <span class="badge bg-brand-accent-ruby/15 text-brand-accent-ruby text-[0.65rem] px-2 py-0.5">Critical</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Right Side: Visualization & TensorFlow -->
        <div class="flex flex-col gap-6">
          <div class="card bg-brand-bg-secondary/40 backdrop-blur-md border border-brand-border/50 p-5 rounded-2xl h-[280px]">
            <h3 class="font-display text-xs font-bold text-brand-text-muted uppercase tracking-wider mb-4">Semester Performance Track</h3>
            <div class="chart-wrapper h-[200px]">
              <canvas id="student-gpa-chart"></canvas>
            </div>
          </div>

          <div class="card bg-brand-bg-secondary/40 backdrop-blur-md border border-brand-border/50 p-5 rounded-2xl">
            <div class="flex justify-between items-center border-b border-brand-border/30 pb-2.5 mb-3">
              <div>
                <h4 class="font-display text-xs font-bold text-brand-text-main">AI Placement Odds Forecaster</h4>
                <p class="text-[0.65rem] text-brand-text-subtle m-0">Predict your post-graduation career placement rate.</p>
              </div>
              <span class="badge bg-brand-accent-cyan/15 text-brand-accent-cyan text-[0.65rem] px-2 py-0.5">TF.js</span>
            </div>
            
            <div class="flex flex-col gap-3 text-xs">
              <div>
                <label class="block text-[0.65rem] font-bold text-brand-text-muted uppercase tracking-wider mb-1">Study Hours Per Week</label>
                <input type="range" id="tf-study-hours" min="5" max="25" value="15" class="w-full accent-brand-primary cursor-pointer">
                <span id="tf-hours-val" class="float-right mt-1 font-mono text-[0.7rem] text-brand-text-subtle">15 hrs</span>
              </div>
              
              <button class="btn btn-primary w-full justify-center py-2" id="tf-student-predict-btn">Predict Placement Odds</button>

              <div id="tf-student-progress" class="bg-brand-bg-tertiary p-2.5 rounded-xl border border-brand-border/40 text-[0.7rem]" style="display:none;">
                <div class="flex justify-between font-mono mb-1.5">
                  <span class="text-brand-text-subtle">Loss Score:</span>
                  <span id="tf-student-loss">0.0000</span>
                </div>
                <div class="w-full bg-brand-bg-primary h-1 rounded-full overflow-hidden">
                  <div id="tf-student-progress-bar" class="bg-brand-primary h-full w-0"></div>
                </div>
              </div>

              <div class="bg-brand-bg-tertiary/40 border border-brand-border/60 rounded-xl p-3 text-center">
                <div class="text-[0.65rem] font-bold uppercase tracking-wider text-brand-text-muted mb-1">Career Success Index</div>
                <div class="text-2xl font-display font-bold text-brand-accent-emerald" id="tf-student-result">--%</div>
              </div>
            </div>
          </div>
        </div>

      </div>
    `;

    // Bind Student Actions
    const shInput = container.querySelector('#tf-study-hours');
    const shVal = container.querySelector('#tf-hours-val');
    if (shInput && shVal) {
      shInput.addEventListener('input', (e) => { shVal.innerText = `${e.target.value} hrs`; });
    }

    const predictBtn = container.querySelector('#tf-student-predict-btn');
    if (predictBtn) {
      predictBtn.addEventListener('click', async () => {
        if (typeof tf === 'undefined') return alert('TF.js loading...');
        predictBtn.disabled = true;
        
        const prog = container.querySelector('#tf-student-progress');
        if (prog) prog.style.display = 'block';
        
        const hours = parseFloat(shInput.value);
        const attendance = student.attendance || 90;
        
        // Mock Linear Regression prediction model
        const model = tf.sequential();
        model.add(tf.layers.dense({ units: 1, inputShape: [2] }));
        model.compile({ optimizer: tf.train.adam(0.1), loss: 'meanSquaredError' });
        
        const trainX = tf.tensor2d([[10, 80], [15, 90], [20, 95], [5, 60]], [4, 2]);
        const trainY = tf.tensor2d([[70], [85], [96], [40]], [4, 1]);
        
        try {
          await model.fit(trainX, trainY, {
            epochs: 50,
            callbacks: {
              onEpochEnd: (epoch, logs) => {
                const lossDisp = container.querySelector('#tf-student-loss');
                const bar = container.querySelector('#tf-student-progress-bar');
                if (lossDisp) lossDisp.innerText = logs.loss.toFixed(5);
                if (bar) bar.style.width = `${(epoch/50)*100}%`;
              }
            }
          });
          
          const testX = tf.tensor2d([[hours, attendance]], [1, 2]);
          const pred = model.predict(testX);
          const result = Math.min(Math.max(Math.round((await pred.data())[0]), 30), 100);
          
          const resultText = container.querySelector('#tf-student-result');
          if (resultText) {
            resultText.innerText = `${result}% Odds`;
            resultText.className = "text-2xl font-display font-bold text-brand-accent-emerald animate-pulse-glow";
          }
          testX.dispose();
          pred.dispose();
        } catch (e) {
          console.error(e);
        } finally {
          trainX.dispose();
          trainY.dispose();
          model.dispose();
          predictBtn.disabled = false;
        }
      });
    }

    // Load Student Chart
    setTimeout(() => {
      const gpaCtx = container.querySelector('#student-gpa-chart');
      if (gpaCtx) {
        const c = new Chart(gpaCtx, {
          type: 'line',
          data: {
            labels: ['Sem 1', 'Sem 2', 'Sem 3', 'Sem 4'],
            datasets: [{
              label: 'GPA Score',
              data: [3.55, 3.68, 3.82, student.gpa],
              borderColor: '#10b981',
              backgroundColor: 'rgba(16, 185, 129, 0.05)',
              fill: true,
              tension: 0.3
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
              y: { min: 2.5, max: 4.0, grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#9ca3af' } },
              x: { grid: { display: false }, ticks: { color: '#9ca3af' } }
            }
          }
        });
        activeCharts.push(c);
      }
    }, 100);
  }

  // 3. FACULTY DASHBOARD
  function renderFacultyDashboard(container, user) {
    const faculty = window.UniversityDB.getFaculty();
    const fac = faculty.find(f => f.email === user.email) || faculty[0];

    container.innerHTML = `
      <div class="page-header animate-fade-in flex items-center justify-between border-b border-brand-border/30 pb-4">
        <div>
          <h1 class="text-3xl font-bold font-display tracking-tight bg-gradient-to-r from-white via-slate-100 to-brand-primary bg-clip-text text-transparent">Faculty Panel</h1>
          <p class="text-sm text-brand-text-muted mt-1">Welcome back, ${fac.name}. Manage academic courses, publish papers, and trace student risk models.</p>
        </div>
        <span class="badge bg-brand-accent-cyan/20 text-brand-accent-cyan px-3 py-1 font-semibold text-xs border border-brand-accent-cyan/30">${fac.designation || 'Lecturer'}</span>
      </div>

      <!-- KPIs -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 animate-fade-in delay-1">
        ${makeHtmlKpi("Courses Teaching", `${fac.courses ? fac.courses.length : 0} Active`, "Weekly teaching workload", "👨‍🏫", "brand-primary")}
        ${makeHtmlKpi("Assigned Students", "185 Registrations", "High class performance", "👥", "brand-accent-cyan")}
        ${makeHtmlKpi("Feedback Rating", "4.8 / 5.0", "Class appraisal top tier", "⭐", "brand-accent-amber")}
        ${makeHtmlKpi("Publications Index", "12 Approved", "ML & NLP journals", "🔬", "brand-accent-emerald")}
      </div>

      <!-- Main Section -->
      <div class="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-6 animate-fade-in delay-2">
        <div class="card bg-brand-bg-secondary/40 backdrop-blur-md border border-brand-border/50 p-6 rounded-2xl">
          <h3 class="font-display text-base font-bold text-brand-text-main border-b border-brand-border/30 pb-3 mb-4">Course Lectures Schedule</h3>
          <div class="flex flex-col gap-3">
            ${(fac.courses || ['CS202', 'CS305']).map(c => `
              <div class="flex justify-between items-center p-3 border border-brand-border/40 bg-brand-bg-tertiary/20 rounded-xl">
                <div>
                  <h4 class="text-xs font-bold text-brand-text-main">Course: ${c}</h4>
                  <span class="text-[0.65rem] text-brand-text-subtle">Schedule: Mon/Wed 09:00 - 10:30 | Room: Hall B2</span>
                </div>
                <span class="badge bg-brand-accent-emerald/10 text-brand-accent-emerald text-[0.65rem] px-2 py-0.5 font-semibold">Active</span>
              </div>
            `).join('')}
          </div>
        </div>

        <div class="flex flex-col gap-6">
          <div class="card bg-brand-bg-secondary/40 backdrop-blur-md border border-brand-border/50 p-5 rounded-2xl h-[280px]">
            <h3 class="font-display text-xs font-bold text-brand-text-muted uppercase tracking-wider mb-4">Grade Distribution</h3>
            <div class="chart-wrapper h-[200px]">
              <canvas id="faculty-grade-chart"></canvas>
            </div>
          </div>

          <div class="card bg-brand-bg-secondary/40 backdrop-blur-md border border-brand-border/50 p-5 rounded-2xl">
            <h4 class="font-display text-xs font-bold text-brand-text-main mb-2">TensorFlow student risk predictor</h4>
            <div class="flex flex-col gap-3 text-xs">
              <div>
                <label class="block text-[0.65rem] font-bold text-brand-text-muted uppercase tracking-wider mb-1">Weekly Absences</label>
                <input type="range" id="tf-faculty-absence" min="0" max="6" value="2" class="w-full accent-brand-primary cursor-pointer">
                <span id="tf-absence-val" class="float-right mt-1 font-mono text-[0.7rem] text-brand-text-subtle">2 days</span>
              </div>
              <button class="btn btn-primary w-full justify-center py-2" id="tf-faculty-predict-btn">Evaluate Risk Index</button>
              <div class="bg-brand-bg-tertiary/40 border border-brand-border/60 rounded-xl p-3 text-center">
                <div class="text-[0.65rem] font-bold uppercase tracking-wider text-brand-text-muted mb-1">Calculated Status</div>
                <div class="text-xl font-display font-bold text-brand-accent-emerald" id="tf-faculty-result">Normal</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    // Bind Faculty Actions
    const absInput = container.querySelector('#tf-faculty-absence');
    const absVal = container.querySelector('#tf-absence-val');
    if (absInput && absVal) {
      absInput.addEventListener('input', (e) => { absVal.innerText = `${e.target.value} days`; });
    }

    const predictBtn = container.querySelector('#tf-faculty-predict-btn');
    if (predictBtn) {
      predictBtn.addEventListener('click', async () => {
        const absences = parseInt(absInput.value);
        let status = 'Low Risk';
        let colorClass = 'text-brand-accent-emerald';
        if (absences > 4) {
          status = 'High Risk (At-Risk)';
          colorClass = 'text-brand-accent-ruby';
        } else if (absences >= 2) {
          status = 'Moderate Risk';
          colorClass = 'text-brand-accent-amber';
        }
        const resText = container.querySelector('#tf-faculty-result');
        if (resText) {
          resText.innerText = status;
          resText.className = `text-xl font-display font-bold ${colorClass}`;
        }
      });
    }

    setTimeout(() => {
      const gradeCtx = container.querySelector('#faculty-grade-chart');
      if (gradeCtx) {
        const c = new Chart(gradeCtx, {
          type: 'bar',
          data: {
            labels: ['A', 'B', 'C', 'D', 'F'],
            datasets: [{
              label: 'Students Count',
              data: [65, 80, 25, 10, 5],
              backgroundColor: '#0891b2',
              borderColor: '#0891b2',
              borderWidth: 1
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
              y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#9ca3af' } },
              x: { grid: { display: false }, ticks: { color: '#9ca3af' } }
            }
          }
        });
        activeCharts.push(c);
      }
    }, 100);
  }

  // 4. PARENT DASHBOARD
  function renderParentDashboard(container, user) {
    container.innerHTML = `
      <div class="page-header animate-fade-in flex items-center justify-between border-b border-brand-border/30 pb-4">
        <div>
          <h1 class="text-3xl font-bold font-display tracking-tight bg-gradient-to-r from-white via-slate-100 to-brand-primary bg-clip-text text-transparent">Parent Guardian Workspace</h1>
          <p class="text-sm text-brand-text-muted mt-1">Review child academic profile, attendance logs, and pay tuition invoices.</p>
        </div>
      </div>

      <!-- KPIs -->
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-5 animate-fade-in delay-1">
        ${makeHtmlKpi("Child GPA Index", "3.75 GPA", "Top 10% class tier", "🏆", "brand-primary")}
        ${makeHtmlKpi("Weekly Attendance", "95% Attendance", "Excellent score", "📈", "brand-accent-emerald")}
        ${makeHtmlKpi("Bill Payments", "Fee Paid", "All cleared", "💳", "brand-accent-emerald")}
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-6 mt-2 animate-fade-in delay-2">
        <div class="flex flex-col gap-6">
          <div class="card bg-brand-bg-secondary/40 backdrop-blur-md border border-brand-border/50 p-6 rounded-2xl">
            <h3 class="font-display text-base font-bold text-brand-text-main border-b border-brand-border/30 pb-3 mb-4">Academic progress courses</h3>
            <div class="flex flex-col gap-3.5 text-xs text-brand-text-muted">
              <div class="flex justify-between py-2 border-b border-brand-border/30">
                <span class="font-bold text-brand-text-main">CS101 - Introduction to Coding:</span>
                <span class="font-mono text-brand-accent-emerald font-semibold">Grade A | Attendance 96%</span>
              </div>
              <div class="flex justify-between py-2 border-b border-brand-border/30">
                <span class="font-bold text-brand-text-main">CS202 - Object Oriented Design:</span>
                <span class="font-mono text-brand-accent-emerald font-semibold">Grade A- | Attendance 94%</span>
              </div>
            </div>
          </div>

          <div class="card bg-brand-bg-secondary/40 backdrop-blur-md border border-brand-border/50 p-5 rounded-2xl h-[280px]">
            <h3 class="font-display text-xs font-bold text-brand-text-muted uppercase tracking-wider mb-4">Weekly Attendance Progress</h3>
            <div class="chart-wrapper h-[200px]">
              <canvas id="parent-grade-chart"></canvas>
            </div>
          </div>
        </div>

        <div class="card bg-brand-bg-secondary/40 backdrop-blur-md border border-brand-border/50 p-5 rounded-2xl h-[fit-content]">
          <h4 class="font-display text-xs font-bold text-brand-text-main mb-3">AI Grade Predictor Model</h4>
          <div class="flex flex-col gap-3 text-xs">
            <div>
              <label class="block text-[0.65rem] font-bold text-brand-text-muted uppercase tracking-wider mb-1">Average Daily Study Hours</label>
              <input type="range" id="tf-parent-study" min="1" max="6" value="4" class="w-full accent-brand-primary cursor-pointer">
              <span id="tf-parent-study-val" class="float-right mt-1 font-mono text-[0.7rem] text-brand-text-subtle">4 hours</span>
            </div>
            <button class="btn btn-primary w-full justify-center py-2" id="tf-parent-predict-btn">Predict Final Grade</button>
            <div class="bg-brand-bg-tertiary/40 border border-brand-border/60 rounded-xl p-3 text-center">
              <div class="text-[0.65rem] font-bold uppercase tracking-wider text-brand-text-muted mb-1">Predicted Grade Outcome</div>
              <div class="text-2xl font-display font-bold text-brand-accent-emerald" id="tf-parent-result">Grade A</div>
            </div>
          </div>
        </div>
      </div>
    `;

    const studyInput = container.querySelector('#tf-parent-study');
    const studyVal = container.querySelector('#tf-parent-study-val');
    if (studyInput && studyVal) {
      studyInput.addEventListener('input', (e) => { studyVal.innerText = `${e.target.value} hours`; });
    }

    const predictBtn = container.querySelector('#tf-parent-predict-btn');
    if (predictBtn) {
      predictBtn.addEventListener('click', () => {
        const val = parseInt(studyInput.value);
        let g = 'Grade A';
        if (val < 2) g = 'Grade C';
        else if (val < 4) g = 'Grade B';
        const result = container.querySelector('#tf-parent-result');
        if (result) result.innerText = g;
      });
    }

    setTimeout(() => {
      const gCtx = container.querySelector('#parent-grade-chart');
      if (gCtx) {
        const c = new Chart(gCtx, {
          type: 'line',
          data: {
            labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
            datasets: [{
              label: 'Attendance Rate',
              data: [92, 94, 95, 95],
              borderColor: '#f59e0b',
              backgroundColor: 'rgba(245, 158, 11, 0.05)',
              fill: true,
              tension: 0.3
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
              y: { min: 80, max: 100, grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#9ca3af' } },
              x: { grid: { display: false }, ticks: { color: '#9ca3af' } }
            }
          }
        });
        activeCharts.push(c);
      }
    }, 100);
  }

  // 5. ALUMNI DASHBOARD
  function renderAlumniDashboard(container, user) {
    container.innerHTML = `
      <div class="page-header animate-fade-in flex items-center justify-between border-b border-brand-border/30 pb-4">
        <div>
          <h1 class="text-3xl font-bold font-display tracking-tight bg-gradient-to-r from-white via-slate-100 to-brand-primary bg-clip-text text-transparent">Alumni Network Portal</h1>
          <p class="text-sm text-brand-text-muted mt-1">Access regional directory networks, mentor student programs, and view donation pools.</p>
        </div>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-3 gap-5 animate-fade-in delay-1">
        ${makeHtmlKpi("My Network Contacts", "240 Profiles", "34 new connections", "🔗", "brand-primary")}
        ${makeHtmlKpi("Mentorship Students", "3 Assigned", "Interactive session slots", "🤝", "brand-accent-cyan")}
        ${makeHtmlKpi("Donations Registry", "$1,200 total", "Alumni scholarship fund", "🎗️", "brand-accent-emerald")}
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-6 mt-2 animate-fade-in delay-2">
        <div class="card bg-brand-bg-secondary/40 backdrop-blur-md border border-brand-border/50 p-6 rounded-2xl">
          <h3 class="font-display text-base font-bold text-brand-text-main border-b border-brand-border/30 pb-3 mb-4">Global Alumni Referral Program</h3>
          <div class="flex flex-col gap-3">
            <div class="p-3 border border-brand-border/40 rounded-xl bg-brand-bg-tertiary/20 flex justify-between items-center text-xs">
              <div>
                <span class="font-bold text-brand-text-main">Software Developer - Google</span>
                <p class="text-[0.65rem] text-brand-text-subtle m-0">Referred: 2 Candidates | Status: In progress</p>
              </div>
              <span class="badge bg-brand-primary/10 text-brand-primary px-2 py-0.5">Active</span>
            </div>
          </div>
        </div>

        <div class="card bg-brand-bg-secondary/40 backdrop-blur-md border border-brand-border/50 p-5 rounded-2xl h-[280px]">
          <h3 class="font-display text-xs font-bold text-brand-text-muted uppercase tracking-wider mb-4">Placement Sector Split</h3>
          <div class="chart-wrapper h-[200px]">
            <canvas id="alumni-sector-chart"></canvas>
          </div>
        </div>
      </div>
    `;

    setTimeout(() => {
      const sectCtx = container.querySelector('#alumni-sector-chart');
      if (sectCtx) {
        const c = new Chart(sectCtx, {
          type: 'pie',
          data: {
            labels: ['Technology', 'Finance', 'Healthcare', 'Research', 'Academic'],
            datasets: [{
              data: [55, 20, 10, 10, 5],
              backgroundColor: ['#6366f1', '#06b6d4', '#10b981', '#f59e0b', '#ef4444']
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { position: 'right', labels: { color: '#9ca3af' } } }
          }
        });
        activeCharts.push(c);
      }
    }, 100);
  }

  // 6. RECRUITER DASHBOARD
  function renderRecruiterDashboard(container, user) {
    container.innerHTML = `
      <div class="page-header animate-fade-in flex items-center justify-between border-b border-brand-border/30 pb-4">
        <div>
          <h1 class="text-3xl font-bold font-display tracking-tight bg-gradient-to-r from-white via-slate-100 to-brand-primary bg-clip-text text-transparent">Recruiter Career Portal</h1>
          <p class="text-sm text-brand-text-muted mt-1">Manage corporate placement drives, candidate selection files, and interviews.</p>
        </div>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-3 gap-5 animate-fade-in delay-1">
        ${makeHtmlKpi("Active Drives", "4 Job Openings", "Google & Microsoft", "🏢", "brand-primary")}
        ${makeHtmlKpi("Applied Candidates", "245 Students", "CS & EE streams", "👥", "brand-accent-cyan")}
        ${makeHtmlKpi("Scheduled Interviews", "38 Calls", "This week slots", "📅", "brand-accent-amber")}
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-6 mt-2 animate-fade-in delay-2">
        <div class="flex flex-col gap-6">
          <div class="card bg-brand-bg-secondary/40 backdrop-blur-md border border-brand-border/50 p-6 rounded-2xl">
            <h3 class="font-display text-base font-bold text-brand-text-main border-b border-brand-border/30 pb-3 mb-4">Recruitment Drive Progress</h3>
            <div class="flex flex-col gap-3">
              <div class="p-3 border border-brand-border/40 rounded-xl bg-brand-bg-tertiary/20 flex justify-between items-center text-xs">
                <div>
                  <span class="font-bold text-brand-text-main">Campus Drive 2026</span>
                  <p class="text-[0.65rem] text-brand-text-subtle m-0">Applicants: 150 | Interviews: 20</p>
                </div>
                <span class="badge bg-brand-accent-emerald/10 text-brand-accent-emerald px-2 py-0.5">Active</span>
              </div>
            </div>
          </div>

          <div class="card bg-brand-bg-secondary/40 backdrop-blur-md border border-brand-border/50 p-5 rounded-2xl h-[280px]">
            <h3 class="font-display text-xs font-bold text-brand-text-muted uppercase tracking-wider mb-4">Interview Pipeline Funnel</h3>
            <div class="chart-wrapper h-[200px]">
              <canvas id="recruiter-funnel-chart"></canvas>
            </div>
          </div>
        </div>

        <div class="card bg-brand-bg-secondary/40 backdrop-blur-md border border-brand-border/50 p-5 rounded-2xl">
          <h4 class="font-display text-xs font-bold text-brand-text-main mb-3">AI Candidate Match Scorer</h4>
          <div class="flex flex-col gap-3 text-xs">
            <div>
              <label class="block text-[0.65rem] font-bold text-brand-text-muted uppercase tracking-wider mb-1">Technical Assessment Score (%)</label>
              <input type="range" id="tf-recruiter-tech" min="40" max="100" value="80" class="w-full accent-brand-primary cursor-pointer">
              <span id="tf-recruiter-tech-val" class="float-right mt-1 font-mono text-[0.7rem] text-brand-text-subtle">80%</span>
            </div>
            <button class="btn btn-primary w-full justify-center py-2" id="tf-recruiter-predict-btn">Score Resume Profile</button>
            <div class="bg-brand-bg-tertiary/40 border border-brand-border/60 rounded-xl p-3 text-center">
              <div class="text-[0.65rem] font-bold uppercase tracking-wider text-brand-text-muted mb-1">Profile Matching Result</div>
              <div class="text-2xl font-display font-bold text-brand-accent-cyan" id="tf-recruiter-result">--% Match</div>
            </div>
          </div>
        </div>
      </div>
    `;

    const techInput = container.querySelector('#tf-recruiter-tech');
    const techVal = container.querySelector('#tf-recruiter-tech-val');
    if (techInput && techVal) {
      techInput.addEventListener('input', (e) => { techVal.innerText = `${e.target.value}%`; });
    }

    const predictBtn = container.querySelector('#tf-recruiter-predict-btn');
    if (predictBtn) {
      predictBtn.addEventListener('click', () => {
        const val = parseInt(techInput.value);
        const score = Math.round(val * 0.95);
        const result = container.querySelector('#tf-recruiter-result');
        if (result) result.innerText = `${score}% Match`;
      });
    }

    setTimeout(() => {
      const fCtx = container.querySelector('#recruiter-funnel-chart');
      if (fCtx) {
        const c = new Chart(fCtx, {
          type: 'bar',
          data: {
            labels: ['Applied', 'Shortlisted', 'Technical', 'HR Fit'],
            datasets: [{
              label: 'Candidates Count',
              data: [245, 120, 60, 38],
              backgroundColor: '#0891b2',
              borderColor: '#0891b2',
              borderWidth: 1
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
              y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#9ca3af' } },
              x: { grid: { display: false }, ticks: { color: '#9ca3af' } }
            }
          }
        });
        activeCharts.push(c);
      }
    }, 100);
  }

  // 7. FINANCE MANAGER DASHBOARD
  function renderFinanceDashboard(container, user) {
    container.innerHTML = `
      <div class="page-header animate-fade-in flex items-center justify-between border-b border-brand-border/30 pb-4">
        <div>
          <h1 class="text-3xl font-bold font-display tracking-tight bg-gradient-to-r from-white via-slate-100 to-brand-primary bg-clip-text text-transparent">Financial Administration</h1>
          <p class="text-sm text-brand-text-muted mt-1">Review student fees receipts, operating budget limits, and cash flow forecasts.</p>
        </div>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-3 gap-5 animate-fade-in delay-1">
        ${makeHtmlKpi("Net Revenues", "$2.45 Million", "92% collection cleared", "💰", "brand-accent-emerald")}
        ${makeHtmlKpi("Outstanding Dues", "$340,000 pending", "Grace invoice limits active", "💳", "brand-accent-ruby")}
        ${makeHtmlKpi("Budget Utilization", "77.5% allocated", "Operating limits stable", "📊", "brand-primary")}
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-6 mt-2 animate-fade-in delay-2">
        <div class="flex flex-col gap-6">
          <div class="card bg-brand-bg-secondary/40 backdrop-blur-md border border-brand-border/50 p-6 rounded-2xl">
            <h3 class="font-display text-base font-bold text-brand-text-main border-b border-brand-border/30 pb-3 mb-4">Receipt Invoices Activity</h3>
            <div class="flex flex-col gap-3">
              <div class="p-3 border border-brand-border/40 rounded-xl bg-brand-bg-tertiary/20 flex justify-between items-center text-xs">
                <div>
                  <span class="font-bold text-brand-text-main">Tuition Collection #480</span>
                  <p class="text-[0.65rem] text-brand-text-subtle m-0">Amount: $12,500 | Date: 2026-07-16</p>
                </div>
                <span class="badge bg-brand-accent-emerald/10 text-brand-accent-emerald px-2 py-0.5">Cleared</span>
              </div>
            </div>
          </div>

          <div class="card bg-brand-bg-secondary/40 backdrop-blur-md border border-brand-border/50 p-5 rounded-2xl h-[280px]">
            <h3 class="font-display text-xs font-bold text-brand-text-muted uppercase tracking-wider mb-4">Revenue Collection Target ($k)</h3>
            <div class="chart-wrapper h-[200px]">
              <canvas id="finance-revenue-chart"></canvas>
            </div>
          </div>
        </div>

        <div class="card bg-brand-bg-secondary/40 backdrop-blur-md border border-brand-border/50 p-5 rounded-2xl">
          <h4 class="font-display text-xs font-bold text-brand-text-main mb-3">AI Payment Delay Risk Predictor</h4>
          <div class="flex flex-col gap-3 text-xs">
            <div>
              <label class="block text-[0.65rem] font-bold text-brand-text-muted uppercase tracking-wider mb-1">Invoice Value Amount ($)</label>
              <input type="range" id="tf-finance-amt" min="500" max="15000" step="500" value="8000" class="w-full accent-brand-primary cursor-pointer">
              <span id="tf-finance-amt-val" class="float-right mt-1 font-mono text-[0.7rem] text-brand-text-subtle">$8,000</span>
            </div>
            <button class="btn btn-primary w-full justify-center py-2" id="tf-finance-predict-btn">Evaluate Delay Odds</button>
            <div class="bg-brand-bg-tertiary/40 border border-brand-border/60 rounded-xl p-3 text-center">
              <div class="text-[0.65rem] font-bold uppercase tracking-wider text-brand-text-muted mb-1">Estimated Invoice Status</div>
              <div class="text-xl font-display font-bold text-brand-accent-amber" id="tf-finance-result">Low Delay Risk</div>
            </div>
          </div>
        </div>
      </div>
    `;

    const amtInput = container.querySelector('#tf-finance-amt');
    const amtVal = container.querySelector('#tf-finance-amt-val');
    if (amtInput && amtVal) {
      amtInput.addEventListener('input', (e) => { amtVal.innerText = `$${parseInt(e.target.value).toLocaleString()}`; });
    }

    const predictBtn = container.querySelector('#tf-finance-predict-btn');
    if (predictBtn) {
      predictBtn.addEventListener('click', () => {
        const val = parseInt(amtInput.value);
        let risk = 'Low Delay Risk';
        let colorClass = 'text-brand-accent-emerald';
        if (val > 10000) {
          risk = 'High Delay Risk (15+ Days)';
          colorClass = 'text-brand-accent-ruby';
        } else if (val > 5000) {
          risk = 'Moderate Delay (5-7 Days)';
          colorClass = 'text-brand-accent-amber';
        }
        const result = container.querySelector('#tf-finance-result');
        if (result) {
          result.innerText = risk;
          result.className = `text-xl font-display font-bold ${colorClass}`;
        }
      });
    }

    setTimeout(() => {
      const rCtx = container.querySelector('#finance-revenue-chart');
      if (rCtx) {
        const c = new Chart(rCtx, {
          type: 'bar',
          data: {
            labels: ['Target', 'Collected', 'Outstanding'],
            datasets: [{
              data: [2790, 2450, 340],
              backgroundColor: ['#6366f1', '#10b981', '#ef4444'],
              borderWidth: 0
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
              y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#9ca3af' } },
              x: { grid: { display: false }, ticks: { color: '#9ca3af' } }
            }
          }
        });
        activeCharts.push(c);
      }
    }, 100);
  }

  // 8. PLACEMENT OFFICER DASHBOARD
  function renderPlacementDashboard(container, user) {
    container.innerHTML = `
      <div class="page-header animate-fade-in flex items-center justify-between border-b border-brand-border/30 pb-4">
        <div>
          <h1 class="text-3xl font-bold font-display tracking-tight bg-gradient-to-r from-white via-slate-100 to-brand-primary bg-clip-text text-transparent">Placement Administration</h1>
          <p class="text-sm text-brand-text-muted mt-1">Orchestrate campus placement calendars, recruit drives, and track salary index charts.</p>
        </div>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-3 gap-5 animate-fade-in delay-1">
        ${makeHtmlKpi("Placed Students", "82% Placed", "CS department top tier", "🎓", "brand-accent-emerald")}
        ${makeHtmlKpi("Corporate Drives", "6 In Progress", "Microsoft & Google", "🏢", "brand-primary")}
        ${makeHtmlKpi("Recruiting Partners", "45 Companies", "12 new tie-ups", "🤝", "brand-accent-cyan")}
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-6 mt-2 animate-fade-in delay-2">
        <div class="flex flex-col gap-6">
          <div class="card bg-brand-bg-secondary/40 backdrop-blur-md border border-brand-border/50 p-6 rounded-2xl">
            <h3 class="font-display text-base font-bold text-brand-text-main border-b border-brand-border/30 pb-3 mb-4">Active Placement Schedules</h3>
            <div class="flex flex-col gap-3">
              <div class="p-3 border border-brand-border/40 rounded-xl bg-brand-bg-tertiary/20 flex justify-between items-center text-xs">
                <div>
                  <span class="font-bold text-brand-text-main">Microsoft Off-Campus referral</span>
                  <p class="text-[0.65rem] text-brand-text-subtle m-0">Eligible Batch: 2026 | Deadline: 2026-08-01</p>
                </div>
                <span class="badge bg-brand-primary/10 text-brand-primary px-2 py-0.5">Active</span>
              </div>
            </div>
          </div>

          <div class="card bg-brand-bg-secondary/40 backdrop-blur-md border border-brand-border/50 p-5 rounded-2xl h-[280px]">
            <h3 class="font-display text-xs font-bold text-brand-text-muted uppercase tracking-wider mb-4">Salary Package Packages (LPA)</h3>
            <div class="chart-wrapper h-[200px]">
              <canvas id="placement-salary-chart"></canvas>
            </div>
          </div>
        </div>

        <div class="card bg-brand-bg-secondary/40 backdrop-blur-md border border-brand-border/50 p-5 rounded-2xl">
          <h4 class="font-display text-xs font-bold text-brand-text-main mb-3">AI Batch Placement Forecaster</h4>
          <div class="flex flex-col gap-3 text-xs">
            <div>
              <label class="block text-[0.65rem] font-bold text-brand-text-muted uppercase tracking-wider mb-1">Pre-Placement Workshop Completion (%)</label>
              <input type="range" id="tf-placement-comp" min="50" max="100" value="85" class="w-full accent-brand-primary cursor-pointer">
              <span id="tf-placement-comp-val" class="float-right mt-1 font-mono text-[0.7rem] text-brand-text-subtle">85%</span>
            </div>
            <button class="btn btn-primary w-full justify-center py-2" id="tf-placement-predict-btn">Run Forecast Model</button>
            <div class="bg-brand-bg-tertiary/40 border border-brand-border/60 rounded-xl p-3 text-center">
              <div class="text-[0.65rem] font-bold uppercase tracking-wider text-brand-text-muted mb-1">Estimated Placement Rate</div>
              <div class="text-2xl font-display font-bold text-brand-accent-emerald" id="tf-placement-result">--% Rate</div>
            </div>
          </div>
        </div>
      </div>
    `;

    const compInput = container.querySelector('#tf-placement-comp');
    const compVal = container.querySelector('#tf-placement-comp-val');
    if (compInput && compVal) {
      compInput.addEventListener('input', (e) => { compVal.innerText = `${e.target.value}%`; });
    }

    const predictBtn = container.querySelector('#tf-placement-predict-btn');
    if (predictBtn) {
      predictBtn.addEventListener('click', () => {
        const val = parseInt(compInput.value);
        const rate = Math.round(val * 1.05);
        const result = container.querySelector('#tf-placement-result');
        if (result) result.innerText = `${Math.min(rate, 100)}% Rate`;
      });
    }

    setTimeout(() => {
      const sCtx = container.querySelector('#placement-salary-chart');
      if (sCtx) {
        const c = new Chart(sCtx, {
          type: 'line',
          data: {
            labels: ['2023', '2024', '2025', '2026'],
            datasets: [{
              label: 'Average LPA',
              data: [12.5, 14.8, 18.2, 24.5],
              borderColor: '#ec4899',
              backgroundColor: 'rgba(236, 72, 153, 0.05)',
              fill: true,
              tension: 0.3
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
              y: { min: 5, max: 30, grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#9ca3af' } },
              x: { grid: { display: false }, ticks: { color: '#9ca3af' } }
            }
          }
        });
        activeCharts.push(c);
      }
    }, 100);
  }

  // 9. RESEARCH COORDINATOR DASHBOARD
  function renderResearchDashboard(container, user) {
    container.innerHTML = `
      <div class="page-header animate-fade-in flex items-center justify-between border-b border-brand-border/30 pb-4">
        <div>
          <h1 class="text-3xl font-bold font-display tracking-tight bg-gradient-to-r from-white via-slate-100 to-brand-primary bg-clip-text text-transparent">Research Hub Console</h1>
          <p class="text-sm text-brand-text-muted mt-1">Review research grants in progress, funding budgets, and trace submission approvals.</p>
        </div>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-3 gap-5 animate-fade-in delay-1">
        ${makeHtmlKpi("Active Grants", "14 Projects", "8 ongoing funding agencies", "🔬", "brand-primary")}
        ${makeHtmlKpi("Research Publications", "127 Index", "IEEE & ACM journals", "📚", "brand-accent-cyan")}
        ${makeHtmlKpi("Grant Funding Pool", "$225,000", "70.8% budget cleared", "💰", "brand-accent-emerald")}
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-6 mt-2 animate-fade-in delay-2">
        <div class="flex flex-col gap-6">
          <div class="card bg-brand-bg-secondary/40 backdrop-blur-md border border-brand-border/50 p-6 rounded-2xl">
            <h3 class="font-display text-base font-bold text-brand-text-main border-b border-brand-border/30 pb-3 mb-4">Scientific Project Portfolio</h3>
            <div class="flex flex-col gap-3">
              <div class="p-3 border border-brand-border/40 rounded-xl bg-brand-bg-tertiary/20 flex justify-between items-center text-xs">
                <div>
                  <span class="font-bold text-brand-text-main">Federated Learning on Campus Mesh</span>
                  <p class="text-[0.65rem] text-brand-text-subtle m-0">PI: Prof. Marcus Chen | Budget: $45,000</p>
                </div>
                <span class="badge bg-brand-accent-emerald/10 text-brand-accent-emerald px-2 py-0.5">Active</span>
              </div>
            </div>
          </div>

          <div class="card bg-brand-bg-secondary/40 backdrop-blur-md border border-brand-border/50 p-5 rounded-2xl h-[280px]">
            <h3 class="font-display text-xs font-bold text-brand-text-muted uppercase tracking-wider mb-4">Grant Funding Allocation</h3>
            <div class="chart-wrapper h-[200px]">
              <canvas id="research-funding-chart"></canvas>
            </div>
          </div>
        </div>

        <div class="card bg-brand-bg-secondary/40 backdrop-blur-md border border-brand-border/50 p-5 rounded-2xl">
          <h4 class="font-display text-xs font-bold text-brand-text-main mb-3">AI Grant Approval Forecaster</h4>
          <div class="flex flex-col gap-3 text-xs">
            <div>
              <label class="block text-[0.65rem] font-bold text-brand-text-muted uppercase tracking-wider mb-1">Funding Request Amount ($)</label>
              <input type="range" id="tf-grant-amt" min="5000" max="50000" step="5000" value="25000" class="w-full accent-brand-primary cursor-pointer">
              <span id="tf-grant-amt-val" class="float-right mt-1 font-mono text-[0.7rem] text-brand-text-subtle">$25,000</span>
            </div>
            <button class="btn btn-primary w-full justify-center py-2" id="tf-grant-predict-btn">Predict Approval Odds</button>
            <div class="bg-brand-bg-tertiary/40 border border-brand-border/60 rounded-xl p-3 text-center">
              <div class="text-[0.65rem] font-bold uppercase tracking-wider text-brand-text-muted mb-1">Grant Approval odds</div>
              <div class="text-2xl font-display font-bold text-brand-accent-emerald" id="tf-grant-result">--% Odds</div>
            </div>
          </div>
        </div>
      </div>
    `;

    const amtInput = container.querySelector('#tf-grant-amt');
    const amtVal = container.querySelector('#tf-grant-amt-val');
    if (amtInput && amtVal) {
      amtInput.addEventListener('input', (e) => { amtVal.innerText = `$${parseInt(e.target.value).toLocaleString()}`; });
    }

    const predictBtn = container.querySelector('#tf-grant-predict-btn');
    if (predictBtn) {
      predictBtn.addEventListener('click', () => {
        const val = parseInt(amtInput.value);
        const odds = Math.round(100 - (val / 50000) * 50);
        const result = container.querySelector('#tf-grant-result');
        if (result) result.innerText = `${odds}% Odds`;
      });
    }

    setTimeout(() => {
      const rCtx = container.querySelector('#research-funding-chart');
      if (rCtx) {
        const c = new Chart(rCtx, {
          type: 'doughnut',
          data: {
            labels: ['CS', 'EE', 'ME', 'Bio'],
            datasets: [{
              data: [80, 50, 35, 60],
              backgroundColor: ['#6366f1', '#06b6d4', '#10b981', '#f59e0b'],
              borderColor: '#111827',
              borderWidth: 2
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { position: 'right', labels: { color: '#9ca3af' } } },
            cutout: '60%'
          }
        });
        activeCharts.push(c);
      }
    }, 100);
  }

  return {
    render: render
  };

})();
