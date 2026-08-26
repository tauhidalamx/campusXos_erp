// Finance & Fees Module with Manual Payment Integration
window.financeView = (function() {
  
  let revenueForecastChart = null;
  let currentActiveTab = 'verification'; // 'verification', 'ledger', 'forecast'

  // Fee categories lookup
  const FEE_CATEGORIES = {
    'TUITION': { label: 'Tuition Fee', amount: 4500 },
    'HOSTEL_FEE': { label: 'Hostel Fee', amount: 1500 },
    'MESS_FEE': { label: 'Mess Fee', amount: 800 },
    'TRANSPORT_FEE': { label: 'Transport Fee', amount: 400 },
    'EXAM_FEE': { label: 'Examination Fee', amount: 150 },
    'LIBRARY_FINE': { label: 'Library Fine / Dues', amount: 25 },
    'SPORTS_FEE': { label: 'Sports & Athletics', amount: 100 },
    'OTHER_FEE': { label: 'Other Activity Fees', amount: 50 }
  };

  async function render(container) {
    const currentUser = window.AuthSystem && window.AuthSystem.getCurrentUser();
    const isStudent = currentUser && currentUser.role === 'student';

    if (isStudent) {
      renderStudentFinance(container, currentUser);
      return;
    }

    // Render Admin Finance Workspace
    renderAdminFinance(container, currentUser);
  }

  // ────────────────────────────────────────────────────────────────────────
  // ADMIN WORKSPACE
  // ────────────────────────────────────────────────────────────────────────
  
  async function renderAdminFinance(container, currentUser) {
    container.innerHTML = `
      <div class="page-header animate-fade-in flex items-center justify-between border-b border-brand-border/30 pb-4 mb-6">
        <div>
          <h1 class="text-3xl font-bold font-display tracking-tight bg-gradient-to-r from-white via-slate-100 to-brand-primary bg-clip-text text-transparent">Finance & Treasury Desk</h1>
          <p class="text-sm text-brand-text-muted mt-1">Audit student fees, configure payment gateway bank/QR configs, and verify manual deposits.</p>
        </div>
        <button class="btn btn-primary" id="btn-collect-payment">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="20" height="16" rx="2" ry="2"/><line x1="12" y1="1" x2="12" y2="23"/><line x1="2" y1="10" x2="22" y2="10"/></svg>
          <span>Record Offline Payment</span>
        </button>
      </div>

      <!-- Financial KPI Metrics -->
      <div class="kpi-grid animate-fade-in delay-1" id="admin-kpi-widgets">
        <div class="card kpi-card bg-brand-bg-secondary/40 backdrop-blur-md border border-brand-border/50 p-6 rounded-2xl flex justify-between items-start transition-all duration-300">
          <div class="kpi-details">
            <span class="kpi-label text-xs font-bold text-brand-text-muted uppercase tracking-wider">Total Revenue</span>
            <span class="kpi-value text-3xl font-display font-bold text-brand-text-main mt-2 leading-none" id="kpi-total-revenue">$0</span>
            <span class="kpi-growth flex items-center gap-1 text-xs text-brand-accent-emerald font-semibold mt-2.5">Reconciled Collections</span>
          </div>
          <div class="kpi-icon w-12 h-12 rounded-xl flex items-center justify-center bg-brand-bg-tertiary/60 border border-brand-border text-brand-accent-emerald">
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
          </div>
        </div>

        <div class="card kpi-card bg-brand-bg-secondary/40 backdrop-blur-md border border-brand-border/50 p-6 rounded-2xl flex justify-between items-start transition-all duration-300">
          <div class="kpi-details">
            <span class="kpi-label text-xs font-bold text-brand-text-muted uppercase tracking-wider">Today's Collection</span>
            <span class="kpi-value text-3xl font-display font-bold text-brand-text-main mt-2 leading-none" id="kpi-today-revenue">$0</span>
            <span class="kpi-growth flex items-center gap-1 text-xs text-brand-accent-cyan font-semibold mt-2.5">Current Ledger Day</span>
          </div>
          <div class="kpi-icon w-12 h-12 rounded-xl flex items-center justify-center bg-brand-bg-tertiary/60 border border-brand-border text-brand-accent-cyan">
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
          </div>
        </div>

        <div class="card kpi-card bg-brand-bg-secondary/40 backdrop-blur-md border border-brand-border/50 p-6 rounded-2xl flex justify-between items-start transition-all duration-300">
          <div class="kpi-details">
            <span class="kpi-label text-xs font-bold text-brand-text-muted uppercase tracking-wider">Pending Deposits</span>
            <span class="kpi-value text-3xl font-display font-bold text-brand-text-main mt-2 leading-none" id="kpi-pending-deposits">0 Txns</span>
            <span class="kpi-growth flex items-center gap-1 text-xs text-brand-accent-amber font-semibold mt-2.5">Verification Desk</span>
          </div>
          <div class="kpi-icon w-12 h-12 rounded-xl flex items-center justify-center bg-brand-bg-tertiary/60 border border-brand-border text-brand-accent-amber">
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
          </div>
        </div>
      </div>

      <!-- Workspace Tab Bar -->
      <div class="flex gap-4 border-b border-brand-border/30 my-6 animate-fade-in delay-2">
        <button class="tab-btn px-4 py-2 text-sm font-semibold border-b-2 border-brand-primary text-brand-text-main cursor-pointer" id="tab-btn-verification">
          Verification Desk
        </button>
        <button class="tab-btn px-4 py-2 text-sm font-semibold border-b-2 border-transparent text-brand-text-muted hover:text-brand-text-main cursor-pointer" id="tab-btn-ledger">
          Accounts & Ledgers
        </button>
        <button class="tab-btn px-4 py-2 text-sm font-semibold border-b-2 border-transparent text-brand-text-muted hover:text-brand-text-main cursor-pointer" id="tab-btn-forecast">
          AI Projection Curve
        </button>
      </div>

      <!-- Tab Content Area -->
      <div id="admin-tab-content" class="animate-fade-in delay-2">
        <!-- Verification Desk Content -->
        <div id="tab-content-verification" class="tab-pane flex flex-col gap-6">
          <div class="card bg-brand-bg-secondary/40 backdrop-blur-md border border-brand-border/50 p-6 rounded-2xl">
            <div class="flex justify-between items-center mb-4">
              <h3 class="font-display text-lg font-bold text-brand-text-main">Manual Payment Submission Registry</h3>
              <span class="badge bg-brand-accent-amber/10 border-brand-accent-amber/20 text-brand-accent-amber font-semibold text-xs py-1 px-3" id="pending-count-badge">0 Pending</span>
            </div>
            <div class="table-container border border-brand-border/50 max-h-[420px] overflow-y-auto">
              <table>
                <thead>
                  <tr>
                    <th class="p-4">Student ID</th>
                    <th class="p-4">Category</th>
                    <th class="p-4">Semester</th>
                    <th class="p-4">Amount</th>
                    <th class="p-4">Gateway</th>
                    <th class="p-4">Reference / UTR</th>
                    <th class="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody id="finance-pending-body">
                  <tr>
                    <td colspan="7" class="text-center text-brand-text-muted p-8">Loading pending verification deposits...</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- Ledger & Accounts Content -->
        <div id="tab-content-ledger" class="tab-pane hidden grid grid-cols-1 lg:grid-cols-[1.3fr_1fr] gap-6">
          <!-- Student Balances Ledger -->
          <div class="card bg-brand-bg-secondary/40 backdrop-blur-md border border-brand-border/50 p-6 rounded-2xl">
            <h3 class="mb-4 font-display text-lg font-bold text-brand-text-main">Student Dues Ledger</h3>
            <div class="table-container max-h-[420px] overflow-y-auto border border-brand-border/50">
              <table>
                <thead>
                  <tr>
                    <th class="p-4">Student ID</th>
                    <th class="p-4">Name</th>
                    <th class="p-4">Semester</th>
                    <th class="p-4">Fee Paid</th>
                    <th class="p-4">Outstanding</th>
                    <th class="p-4">Status</th>
                  </tr>
                </thead>
                <tbody id="finance-balances-body">
                  <!-- Loaded dynamically -->
                </tbody>
              </table>
            </div>
          </div>

          <!-- Recent Transactions Audit -->
          <div class="card bg-brand-bg-secondary/40 backdrop-blur-md border border-brand-border/50 p-6 rounded-2xl">
            <h3 class="mb-4 font-display text-lg font-bold text-brand-text-main">Reconciled Cash/Online Audits</h3>
            <div class="flex flex-col gap-3.5 max-h-[420px] overflow-y-auto pr-1" id="finance-approved-list">
              <!-- Loaded dynamically -->
            </div>
          </div>
        </div>

        <!-- AI Forecast Content -->
        <div id="tab-content-forecast" class="tab-pane hidden card bg-brand-bg-secondary/40 backdrop-blur-md border border-brand-border/50 p-6 rounded-2xl">
          <div class="flex justify-between items-center border-b border-brand-border/30 pb-4 mb-5">
            <div>
              <h3 class="font-display flex items-center gap-2 m-0 text-lg font-bold text-brand-text-main">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="var(--color-brand-accent-emerald)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                AI Revenue & Collections Forecasting
              </h3>
              <p class="text-[0.85rem] text-brand-text-muted mt-1 m-0">Regression modeling on historical collections registry using TensorFlow.js optimizer weights.</p>
            </div>
            <span class="badge bg-brand-accent-emerald/10 border-brand-accent-emerald/20 text-brand-accent-emerald font-semibold text-xs py-1 px-3">TensorFlow.js Engine</span>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-[300px_1fr] gap-8">
            <!-- Controls Panel -->
            <div class="flex flex-col gap-5 border-r border-brand-border/30 pr-8 max-md:border-r-0 max-md:pr-0">
              <div>
                <label class="block text-xs font-semibold text-brand-text-muted uppercase tracking-wider mb-2 pl-0.5">Optimizer Learning Rate</label>
                <select id="tf-finance-lr" class="w-full bg-brand-bg-secondary border border-brand-border text-brand-text-main p-2 rounded-lg outline-none">
                  <option value="0.01">0.01 (Slow & Stable)</option>
                  <option value="0.05" selected>0.05 (Default)</option>
                  <option value="0.1">0.10 (Fast)</option>
                </select>
              </div>

              <div>
                <label class="block text-xs font-semibold text-brand-text-muted uppercase tracking-wider mb-2 pl-0.5">Training Epochs</label>
                <input type="range" id="tf-finance-epochs" min="50" max="300" step="50" value="150" class="w-full accent-brand-accent-emerald cursor-pointer">
                <span id="tf-finance-epochs-val" class="text-[0.8rem] text-brand-text-muted float-right mt-1 font-mono">150 epochs</span>
              </div>

              <div>
                <label class="block text-xs font-semibold text-brand-text-muted uppercase tracking-wider mb-2 pl-0.5">Forecast Horizon</label>
                <select id="tf-finance-horizon" class="w-full bg-brand-bg-secondary border border-brand-border text-brand-text-main p-2 rounded-lg outline-none">
                  <option value="1">1 Term (2026-B)</option>
                  <option value="2" selected>2 Terms (2026-B & 2027-A)</option>
                  <option value="3">3 Terms (Up to 2027-B)</option>
                </select>
              </div>

              <button class="btn btn-primary w-full justify-center flex items-center gap-2" id="tf-finance-train-btn" style="background-color: var(--color-brand-accent-emerald); box-shadow: 0 4px 14px rgba(16, 185, 129, 0.25);">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                <span>Run Revenue Projection</span>
              </button>

              <!-- Live Status -->
              <div id="tf-finance-status-card" class="bg-brand-bg-tertiary p-3 rounded-lg border border-brand-border/40" style="display:none;">
                <div class="flex justify-between text-[0.8rem] mb-1.5">
                  <span class="text-brand-text-subtle">Epoch:</span>
                  <span id="tf-finance-epoch-disp" class="font-semibold text-brand-text-main font-mono">0/150</span>
                </div>
                <div class="flex justify-between text-[0.8rem] mb-3">
                  <span class="text-brand-text-subtle">Training Loss:</span>
                  <span id="tf-finance-loss-disp" class="font-mono text-brand-accent-amber">0.0000</span>
                </div>
                <!-- Progress Bar -->
                <div class="bg-brand-bg-primary rounded-full h-1.5 overflow-hidden w-full">
                  <div id="tf-finance-progress-bar" class="bg-brand-accent-emerald h-full w-0 transition-[width] duration-100"></div>
                </div>
              </div>
              
              <div id="tf-finance-metrics-card" class="bg-brand-bg-tertiary p-3 rounded-lg border border-brand-border/40 text-[0.825rem] leading-normal flex flex-col gap-1.5">
                <div class="text-brand-text-main font-bold">Projection Diagnostics:</div>
                <div>Status: <span id="tf-finance-status-text" class="text-brand-accent-cyan font-bold uppercase">Untrained</span></div>
                <div>Gradient Fit: <span id="tf-finance-equation-fit" class="text-brand-text-muted font-mono">y = mx + c</span></div>
              </div>
            </div>

            <!-- Forecast Chart -->
            <div class="flex flex-col h-[350px]">
              <div class="flex justify-between mb-3 items-center">
                <h4 class="text-sm font-semibold text-brand-text-main m-0">Revenue Projection Curve</h4>
                <span id="tf-finance-projection-hint" class="text-[0.75rem] text-brand-text-muted">Historical fee revenues vs Model Fit</span>
              </div>
              <div class="chart-wrapper flex-1">
                <canvas id="tf-finance-forecast-chart"></canvas>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    // Bind Offline recording button
    const recordBtn = container.querySelector('#btn-collect-payment');
    if (recordBtn) recordBtn.addEventListener('click', openPaymentModal);

    // Bind Tab Switching
    setupTabSwitching(container);

    // Fetch and populate backend manual payment statistics
    await loadAdminTreasuryData(container);
  }

  function setupTabSwitching(container) {
    const tabs = {
      'verification': { button: container.querySelector('#tab-btn-verification'), pane: container.querySelector('#tab-content-verification') },
      'ledger': { button: container.querySelector('#tab-btn-ledger'), pane: container.querySelector('#tab-content-ledger') },
      'forecast': { button: container.querySelector('#tab-btn-forecast'), pane: container.querySelector('#tab-content-forecast') }
    };

    Object.keys(tabs).forEach(tabKey => {
      const tab = tabs[tabKey];
      if (!tab.button) return;
      tab.button.addEventListener('click', () => {
        // Deactivate all
        Object.keys(tabs).forEach(k => {
          tabs[k].button.classList.remove('border-brand-primary', 'text-brand-text-main');
          tabs[k].button.classList.add('border-transparent', 'text-brand-text-muted');
          tabs[k].pane.classList.add('hidden');
        });

        // Activate selected
        tab.button.classList.add('border-brand-primary', 'text-brand-text-main');
        tab.button.classList.remove('border-transparent', 'text-brand-text-muted');
        tab.pane.classList.remove('hidden');
        currentActiveTab = tabKey;

        // Render TF Chart if activated
        if (tabKey === 'forecast') {
          const collectedVal = parseInt(container.querySelector('#kpi-total-revenue').innerText.replace(/[^0-9]/g, '')) || 85000;
          setTimeout(() => {
            initRevenueForecastChart(container, collectedVal);
          }, 100);
        }
      });
    });

    // Bind slider change
    const epochsRange = container.querySelector('#tf-finance-epochs');
    const epochsVal = container.querySelector('#tf-finance-epochs-val');
    if (epochsRange && epochsVal) {
      epochsRange.addEventListener('input', (e) => {
        epochsVal.innerText = `${e.target.value} epochs`;
      });
    }

    // Bind Train Button
    const trainBtn = container.querySelector('#tf-finance-train-btn');
    if (trainBtn) {
      trainBtn.addEventListener('click', () => {
        const collectedVal = parseInt(container.querySelector('#kpi-total-revenue').innerText.replace(/[^0-9]/g, '')) || 85000;
        runRevenueTfTraining(container, collectedVal);
      });
    }
  }

  async function loadAdminTreasuryData(container) {
    try {
      // 1. Fetch dashboard stats
      const statsRes = await fetch('/api/payments/dashboard');
      const dashboard = await statsRes.json();
      
      const stats = dashboard.stats || {};
      
      // Update KPIs
      const revEl = container.querySelector('#kpi-total-revenue');
      const todayEl = container.querySelector('#kpi-today-revenue');
      const pendingEl = container.querySelector('#kpi-pending-deposits');
      const pendingBadge = container.querySelector('#pending-count-badge');

      if (revEl) revEl.innerText = `$${(stats.totalRevenue || 0).toLocaleString()}`;
      if (todayEl) todayEl.innerText = `$${(stats.todayCollection || 0).toLocaleString()}`;
      if (pendingEl) pendingEl.innerText = `${stats.verificationPending || 0} Txns`;
      if (pendingBadge) pendingBadge.innerText = `${stats.verificationPending || 0} Pending`;

      // 2. Fetch payments list
      const payRes = await fetch('/api/payments');
      const allPayments = await payRes.json();

      // Filter and populate pending table
      const pendingPayments = allPayments.filter(p => p.status === 'VERIFICATION_PENDING');
      const pendingBody = container.querySelector('#finance-pending-body');
      
      if (pendingBody) {
        if (pendingPayments.length === 0) {
          pendingBody.innerHTML = `
            <tr>
              <td colspan="7" class="text-center text-brand-text-muted p-8">No pending payments for manual verification.</td>
            </tr>
          `;
        } else {
          pendingBody.innerHTML = pendingPayments.map(p => `
            <tr class="hover:bg-white/[0.02] cursor-pointer transition-colors duration-150" data-payment-id="${p.id}">
              <td class="p-4"><code>${p.student_id}</code></td>
              <td class="p-4 font-semibold text-brand-text-main">${FEE_CATEGORIES[p.fee_type]?.label || p.fee_type}</td>
              <td class="p-4 text-brand-accent-cyan font-semibold font-mono">$${(p.amount || 0).toLocaleString()}</td>
              <td class="p-4"><span class="badge bg-white/[0.06] border-white/[0.1] text-brand-text-main">${p.payment_method}</span></td>
              <td class="p-4"><code class="text-brand-text-muted">${p.utr_number || p.transaction_id || 'N/A'}</code></td>
              <td class="p-4 text-brand-text-muted text-xs">${(p.payment_date || p.created_at).substring(0, 10)}</td>
              <td class="p-4 text-right">
                <button class="btn btn-secondary py-1 px-3 text-xs font-semibold btn-review-verification" data-id="${p.id}">Review Proof</button>
              </td>
            </tr>
          `).join('');

          // Bind review clicks
          pendingBody.querySelectorAll('.btn-review-verification').forEach(btn => {
            btn.addEventListener('click', (e) => {
              e.stopPropagation();
              const pid = btn.getAttribute('data-id');
              const payment = pendingPayments.find(x => x.id === pid);
              if (payment) openVerifyModal(container, payment);
            });
          });

          // Bind row clicks
          pendingBody.querySelectorAll('tr[data-payment-id]').forEach(row => {
            row.addEventListener('click', () => {
              const pid = row.getAttribute('data-payment-id');
              const payment = pendingPayments.find(x => x.id === pid);
              if (payment) openVerifyModal(container, payment);
            });
          });
        }
      }

      // Populate balances ledger
      const students = window.UniversityDB.getStudents() || [];
      const balancesBody = container.querySelector('#finance-balances-body');
      
      if (balancesBody) {
        balancesBody.innerHTML = students.map(s => {
          // Calculate student paid amount from real database payments
          const studentPayments = allPayments.filter(p => p.student_id === s.id && (p.status === 'APPROVED' || p.status === 'VERIFIED'));
          const totalPaid = studentPayments.reduce((acc, curr) => acc + curr.amount, 0);
          const outstanding = Math.max((s.feeTotal || 4500) - totalPaid, 0);
          
          let statusHtml = '<span class="badge badge-success">Paid</span>';
          if (outstanding > 2500) {
            statusHtml = '<span class="badge badge-danger">Delinquent</span>';
          } else if (outstanding > 0) {
            statusHtml = '<span class="badge badge-warning">Partial</span>';
          }

          return `
            <tr>
              <td class="p-4"><code>${s.id}</code></td>
              <td class="p-4 font-semibold text-brand-text-main">${s.name}</td>
              <td class="p-4 text-xs text-brand-text-muted">Semester ${s.semester || 4}</td>
              <td class="p-4 font-mono text-brand-accent-emerald font-semibold">$${totalPaid.toLocaleString()}</td>
              <td class="p-4 font-mono text-brand-accent-ruby font-semibold">$${outstanding.toLocaleString()}</td>
              <td class="p-4">${statusHtml}</td>
            </tr>
          `;
        }).join('');
      }

      // Populate approved transactions audit
      const approvedPayments = allPayments.filter(p => p.status === 'APPROVED' || p.status === 'VERIFIED');
      const approvedList = container.querySelector('#finance-approved-list');
      if (approvedList) {
        if (approvedPayments.length === 0) {
          approvedList.innerHTML = `
            <div class="text-center py-6 text-brand-text-muted text-xs">No approved transactions.</div>
          `;
        } else {
          approvedList.innerHTML = approvedPayments.slice(0, 15).map(txn => `
            <div class="p-3.5 border border-brand-border/60 rounded-xl bg-brand-bg-tertiary/40 flex justify-between items-center transition-all duration-200 hover:translate-x-1">
              <div>
                <strong class="text-brand-accent-emerald text-sm font-bold">+$${(txn.amount || 0).toLocaleString()}</strong>
                <div class="text-xs text-brand-text-main font-medium mt-1">${txn.student_id} — ${FEE_CATEGORIES[txn.fee_type]?.label || txn.fee_type}</div>
                <span class="text-[0.7rem] text-brand-text-subtle mt-0.5 block">${(txn.payment_date || txn.created_at).substring(0, 10)} via ${txn.payment_method}</span>
              </div>
              <code class="text-[0.7rem] bg-white/[0.04] px-2 py-1 rounded font-mono text-brand-text-muted">${txn.utr_number || txn.transaction_id || 'N/A'}</code>
            </div>
          `).join('');
        }
      }

    } catch (err) {
      console.error('Failed to load admin treasury details:', err);
    }
  }

  function openVerifyModal(container, payment) {
    const title = `Verification Review — ${payment.id}`;
    const screenshotUrl = payment.screenshot_path || '';

    const bodyHTML = `
      <div class="flex flex-col gap-4 font-sans text-brand-text-main">
        <div class="grid grid-cols-2 gap-4 text-xs border-b border-brand-border/30 pb-3">
          <div>
            <span class="text-brand-text-muted block">Student ID</span>
            <strong class="text-brand-text-main text-sm">${payment.student_id}</strong>
          </div>
          <div>
            <span class="text-brand-text-muted block">Fee Category</span>
            <strong class="text-brand-text-main text-sm">${FEE_CATEGORIES[payment.fee_type]?.label || payment.fee_type}</strong>
          </div>
          <div>
            <span class="text-brand-text-muted block">Amount Paid</span>
            <strong class="text-brand-accent-cyan text-sm font-mono">$${(payment.amount || 0).toLocaleString()}</strong>
          </div>
          <div>
            <span class="text-brand-text-muted block">Semester</span>
            <strong class="text-brand-text-main text-sm">${payment.semester}</strong>
          </div>
          <div>
            <span class="text-brand-text-muted block">Payment Method</span>
            <strong class="text-brand-text-main text-sm">${payment.payment_method}</strong>
          </div>
          <div>
            <span class="text-brand-text-muted block">Transfer Date</span>
            <strong class="text-brand-text-main text-sm">${(payment.payment_date || '').substring(0, 10)}</strong>
          </div>
        </div>

        <div class="grid grid-cols-1 gap-2 text-xs">
          <div>
            <span class="text-brand-text-muted">UTR / Reference Number:</span>
            <code class="text-brand-accent-emerald font-bold font-mono text-xs ml-1">${payment.utr_number || 'N/A'}</code>
          </div>
          <div>
            <span class="text-brand-text-muted">Transaction ID:</span>
            <code class="text-brand-accent-emerald font-bold font-mono text-xs ml-1">${payment.transaction_id || 'N/A'}</code>
          </div>
          ${payment.bank_name ? `
            <div>
              <span class="text-brand-text-muted">Bank Name:</span>
              <strong class="text-brand-text-main ml-1">${payment.bank_name}</strong>
            </div>
            <div>
              <span class="text-brand-text-muted">Account Number:</span>
              <strong class="text-brand-text-main ml-1 font-mono">${payment.account_number || 'N/A'}</strong>
            </div>
          ` : ''}
          <div>
            <span class="text-brand-text-muted">Student Remarks:</span>
            <span class="text-brand-text-main block bg-brand-bg-tertiary p-2 rounded border border-brand-border/30 mt-1 italic">${payment.remarks || 'None'}</span>
          </div>
        </div>

        <div class="border border-brand-border/40 rounded-xl overflow-hidden bg-brand-bg-tertiary/60 p-2 text-center">
          <span class="text-[10px] font-bold text-brand-text-muted uppercase tracking-wider block mb-1">Receipt Proof Screenshot</span>
          ${screenshotUrl ? `
            <a href="${screenshotUrl}" target="_blank" title="Click to view full image">
              <img src="${screenshotUrl}" class="max-h-[220px] max-w-full object-contain rounded border border-brand-border/40 mx-auto" />
            </a>
          ` : `
            <div class="p-8 text-brand-text-muted font-mono text-xs">No screenshot proof uploaded for this transaction.</div>
          `}
        </div>

        <div class="flex flex-col gap-2 mt-2" id="modal-action-wrapper">
          <!-- Textarea for reject reason -->
          <div class="hidden flex flex-col gap-1.5" id="reject-reason-container">
            <label class="text-[10px] text-brand-accent-ruby font-bold uppercase">Specify Rejection/Flag Reason:</label>
            <textarea id="reject-reason-input" class="form-control text-xs bg-brand-bg-secondary w-full" rows="2" placeholder="e.g. Screenshot mismatch, UTR not visible. Please upload correct receipt."></textarea>
          </div>
        </div>
      </div>
    `;

    const footerHTML = `
      <div class="flex gap-2 justify-end w-full" id="modal-footer-buttons">
        <button class="btn btn-secondary text-xs" onclick="window.App.closeModal()">Close</button>
        <button class="btn btn-danger text-xs" id="btn-modal-reject">Reject Slip</button>
        <button class="btn btn-primary text-xs" id="btn-modal-approve" style="background-color: var(--color-brand-accent-emerald); border-color: var(--color-brand-accent-emerald);">Approve & Log</button>
      </div>
    `;

    window.App.showModal(title, bodyHTML, footerHTML);

    const modalContainer = document.getElementById('modal-action-wrapper').parentElement;
    const approveBtn = document.getElementById('btn-modal-approve');
    const rejectBtn = document.getElementById('btn-modal-reject');
    const rejectReasonContainer = document.getElementById('reject-reason-container');
    const rejectReasonInput = document.getElementById('reject-reason-input');

    approveBtn.addEventListener('click', async () => {
      approveBtn.disabled = true;
      approveBtn.innerText = 'Processing...';
      try {
        const res = await fetch('/api/payments/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            payment_id: payment.id,
            admin_id: currentUser?.id || 'USR_DEAN',
            remarks: 'Manually verified via treasury dashboard'
          })
        });
        const result = await res.json();
        if (result.success) {
          alert('✅ Payment verified & approved! Ledger updated and notification dispatched.');
          window.App.closeModal();
          loadAdminTreasuryData(container);
        } else {
          alert('Failed to approve payment: ' + (result.error || 'Unknown Error'));
          approveBtn.disabled = false;
          approveBtn.innerText = 'Approve & Log';
        }
      } catch (err) {
        console.error('Error verifying payment:', err);
        alert('Server connection error.');
        approveBtn.disabled = false;
        approveBtn.innerText = 'Approve & Log';
      }
    });

    rejectBtn.addEventListener('click', async () => {
      if (rejectReasonContainer.classList.contains('hidden')) {
        rejectReasonContainer.classList.remove('hidden');
        rejectBtn.innerText = 'Confirm Rejection';
        return;
      }

      const reason = rejectReasonInput.value.trim();
      if (!reason) {
        alert('Please specify a rejection reason.');
        return;
      }

      rejectBtn.disabled = true;
      rejectBtn.innerText = 'Rejecting...';

      try {
        const res = await fetch('/api/payments/reject', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            payment_id: payment.id,
            admin_id: currentUser?.id || 'USR_DEAN',
            rejection_reason: reason
          })
        });
        const result = await res.json();
        if (result.success) {
          alert('❌ Payment flagged as rejected. Notification sent to student.');
          window.App.closeModal();
          loadAdminTreasuryData(container);
        } else {
          alert('Failed to reject payment: ' + (result.error || 'Unknown Error'));
          rejectBtn.disabled = false;
          rejectBtn.innerText = 'Confirm Rejection';
        }
      } catch (err) {
        console.error('Error rejecting payment:', err);
        alert('Server connection error.');
        rejectBtn.disabled = false;
        rejectBtn.innerText = 'Confirm Rejection';
      }
    });
  }

  // ────────────────────────────────────────────────────────────────────────
  // STUDENT WORKSPACE
  // ────────────────────────────────────────────────────────────────────────

  async function renderStudentFinance(container, currentUser) {
    const students = window.UniversityDB.getStudents();
    let student = students.find(s => s.email === currentUser.email || s.name === currentUser.name) || students[0];

    container.innerHTML = `
      <div class="page-header animate-fade-in flex items-center justify-between border-b border-brand-border/30 pb-4 mb-6">
        <div>
          <h1 class="text-3xl font-bold font-display tracking-tight bg-gradient-to-r from-white via-slate-100 to-brand-primary bg-clip-text text-transparent">Student Statement</h1>
          <p class="text-sm text-brand-text-muted mt-1">Verify outstanding tuition balances, audit history logs, and upload payment deposit slips.</p>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6 animate-fade-in delay-1">
        <!-- Personal Info & Dues Summary -->
        <div class="card bg-brand-bg-secondary/40 backdrop-blur-md border border-brand-border/50 p-6 rounded-2xl flex flex-col gap-5">
          <div class="flex items-center gap-4 border-b border-brand-border/30 pb-4">
            <img src="${student.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'}" class="w-16 h-16 rounded-full object-cover border border-brand-border/60">
            <div>
              <h3 class="m-0 font-display text-lg font-bold text-brand-text-main" id="stu-info-name">${student.name}</h3>
              <span class="text-xs text-brand-text-muted">Student ID: <code id="stu-info-id">${student.id}</code> | Dept: ${student.dept}</span>
            </div>
          </div>
          
          <div class="flex flex-col gap-3.5 text-xs">
            <div class="flex justify-between">
              <span class="text-brand-text-muted font-medium">Registration Semester:</span>
              <strong class="text-brand-text-main">Semester ${student.semester || 4}</strong>
            </div>
            <div class="flex justify-between">
              <span class="text-brand-text-muted font-medium">Academic Scholarship:</span>
              <strong class="text-brand-accent-cyan" id="stu-scholarship-txt">Checking scholarships...</strong>
            </div>
            <div class="flex justify-between border-t border-brand-border/30 pt-3">
              <span class="text-brand-text-muted font-medium">Selected Fee Cost:</span>
              <strong class="text-brand-text-main font-mono" id="stu-fee-amount">$0</strong>
            </div>
            <div class="flex justify-between">
              <span class="text-brand-text-muted font-medium text-brand-accent-emerald">Concession Discount:</span>
              <strong class="text-brand-accent-emerald font-mono" id="stu-discount-amount">-$0</strong>
            </div>
            <div class="flex justify-between">
              <span class="text-brand-text-muted font-medium text-brand-accent-cyan">Net Payable Amount:</span>
              <strong class="text-brand-accent-cyan font-mono" id="stu-net-payable">$0</strong>
            </div>
            <div class="flex justify-between border-t border-brand-border/30 pt-3">
              <span class="text-brand-text-muted font-medium text-brand-accent-emerald">Total Approved Dues Paid:</span>
              <strong class="text-brand-accent-emerald font-mono" id="stu-total-paid">$0</strong>
            </div>
            <div class="flex justify-between">
              <span class="text-brand-text-muted font-medium text-brand-accent-ruby">Total Outstanding Balance:</span>
              <strong class="text-brand-accent-ruby font-mono" id="stu-outstanding-total">$0</strong>
            </div>
          </div>

          <!-- Progress bar -->
          <div class="mt-2">
            <div class="flex justify-between text-xs font-semibold mb-1.5">
              <span class="text-brand-text-muted uppercase tracking-wider">Tuition Clearance Progress</span>
              <span class="text-brand-text-main font-mono" id="stu-clearance-pct">0.0%</span>
            </div>
            <div class="bg-brand-bg-primary h-2 rounded-full overflow-hidden w-full border border-brand-border/40">
              <div class="bg-gradient-to-r from-brand-accent-emerald to-brand-primary h-full rounded-full" id="stu-clearance-bar" style="width: 0%"></div>
            </div>
          </div>
        </div>

        <!-- Manual Payment Gateway Uploader -->
        <div class="card bg-brand-bg-secondary/40 backdrop-blur-md border border-brand-border/50 p-6 rounded-2xl">
          <h3 class="mb-3 font-display text-base font-bold m-0 border-b border-brand-border/30 pb-2 text-brand-text-main">Manual Payment Submission Uploader</h3>
          
          <form id="student-payment-upload-form" class="flex flex-col gap-3">
            <div class="grid grid-cols-2 gap-3">
              <div class="form-group">
                <label class="form-label text-[10px] font-bold text-brand-text-muted uppercase tracking-wider pl-1">Fee Category</label>
                <select id="stu-pay-fee-type" class="form-control mt-1 w-full text-xs">
                  ${Object.keys(FEE_CATEGORIES).map(k => `
                    <option value="${k}">${FEE_CATEGORIES[k].label} ($${FEE_CATEGORIES[k].amount})</option>
                  `).join('')}
                </select>
              </div>
              <div class="form-group">
                <label class="form-label text-[10px] font-bold text-brand-text-muted uppercase tracking-wider pl-1">Net Amount to Pay</label>
                <input type="number" id="stu-pay-amount" class="form-control mt-1 w-full text-xs" readonly>
              </div>
            </div>

            <div class="grid grid-cols-2 gap-3">
              <div class="form-group">
                <label class="form-label text-[10px] font-bold text-brand-text-muted uppercase tracking-wider pl-1">Payment Method</label>
                <select id="stu-pay-method" class="form-control mt-1 w-full text-xs">
                  <option value="UPI">UPI Direct Transfer</option>
                  <option value="BANK_TRANSFER">Bank Direct (IMPS/NEFT)</option>
                  <option value="CASH">Cash Deposit</option>
                  <option value="CHEQUE">Cheque Payment</option>
                </select>
              </div>
              <div class="form-group">
                <label class="form-label text-[10px] font-bold text-brand-text-muted uppercase tracking-wider pl-1">Payment Date</label>
                <input type="date" id="stu-pay-date" class="form-control mt-1 w-full text-xs" required>
              </div>
            </div>

            <!-- Dynamic Payment Gateway Destination Info -->
            <div class="p-3 border border-brand-border/40 rounded-xl bg-brand-bg-tertiary/40 text-xs flex flex-col gap-2" id="payment-destination-info">
              <!-- Filled by JS -->
            </div>

            <div class="grid grid-cols-2 gap-3">
              <div class="form-group">
                <label class="form-label text-[10px] font-bold text-brand-text-muted uppercase tracking-wider pl-1">UTR / Ref Number</label>
                <input type="text" id="stu-pay-utr" class="form-control mt-1 w-full text-xs" placeholder="e.g. 12-digit UTR bank code" required>
              </div>
              <div class="form-group">
                <label class="form-label text-[10px] font-bold text-brand-text-muted uppercase tracking-wider pl-1">Transaction ID</label>
                <input type="text" id="stu-pay-txid" class="form-control mt-1 w-full text-xs" placeholder="e.g. TXN9876543">
              </div>
            </div>

            <div class="grid grid-cols-2 gap-3" id="bank-input-fields">
              <div class="form-group">
                <label class="form-label text-[10px] font-bold text-brand-text-muted uppercase tracking-wider pl-1">Your Bank Name</label>
                <input type="text" id="stu-pay-bank" class="form-control mt-1 w-full text-xs" placeholder="e.g. HDFC Bank">
              </div>
              <div class="form-group">
                <label class="form-label text-[10px] font-bold text-brand-text-muted uppercase tracking-wider pl-1">Your Account Number</label>
                <input type="text" id="stu-pay-acc" class="form-control mt-1 w-full text-xs" placeholder="e.g. XXXXXX1234">
              </div>
            </div>

            <div class="form-group">
              <label class="form-label text-[10px] font-bold text-brand-text-muted uppercase tracking-wider pl-1">Upload Receipt Screenshot (PNG/JPG)</label>
              <input type="file" id="stu-pay-proof" class="form-control mt-1 w-full text-xs" accept="image/*" required>
            </div>

            <div class="form-group">
              <label class="form-label text-[10px] font-bold text-brand-text-muted uppercase tracking-wider pl-1">Student Remarks</label>
              <input type="text" id="stu-pay-remarks" class="form-control mt-1 w-full text-xs" placeholder="Any optional remarks">
            </div>

            <button type="submit" class="btn btn-primary w-full justify-center flex items-center gap-2 mt-1" id="btn-stu-pay">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="20" height="16" rx="2" ry="2"/><line x1="12" y1="1" x2="12" y2="23"/><line x1="2" y1="10" x2="22" y2="10"/></svg>
              <span>Submit Payment Proof</span>
            </button>
          </form>
        </div>
      </div>

      <!-- AI Tuition Default Risk Estimator -->
      <div class="card bg-brand-bg-secondary/40 backdrop-blur-md border border-brand-border/50 p-6 rounded-2xl mt-6 animate-fade-in delay-2">
        <div class="flex items-center justify-between mb-3 pb-2 border-b border-brand-border/30">
          <div class="flex items-center gap-2">
            <span class="w-2.5 h-2.5 rounded-full bg-brand-accent-amber animate-pulse"></span>
            <span class="text-xs font-bold uppercase tracking-wider text-brand-text-main font-display">AI Tuition Default Risk</span>
          </div>
          <span class="badge text-[0.65rem] py-0.5 px-2 font-mono bg-brand-accent-emerald/20 text-brand-accent-emerald animate-fade-in" id="finance-ai-delay-status">Low Risk</span>
        </div>
        <div class="grid grid-cols-2 gap-3 text-xs text-brand-text-muted">
          <div>
            <span class="text-[0.7rem] text-brand-text-subtle">Predicted Delay Probability:</span>
            <div class="font-bold text-brand-text-main font-mono text-sm mt-0.5 animate-fade-in" id="finance-ai-delay-pct">Calculating...</div>
          </div>
          <div>
            <span class="text-[0.7rem] text-brand-text-subtle">Projected Clearance Date:</span>
            <div class="font-bold text-brand-text-main font-mono text-sm mt-0.5 animate-fade-in" id="finance-ai-clearance-date">Semester end</div>
          </div>
        </div>
      </div>

      <!-- Transaction History / Submission Ledger -->
      <div class="card bg-brand-bg-secondary/40 backdrop-blur-md border border-brand-border/50 p-6 rounded-2xl mt-6 animate-fade-in delay-2">
        <h3 class="mb-4 font-display text-base font-bold m-0 border-b border-brand-border/30 pb-3 text-brand-text-main">Manual Transactions History Ledger</h3>
        
        <div class="flex flex-col gap-3.5 max-h-[350px] overflow-y-auto pr-1" id="stu-payments-ledger">
          <div class="text-center py-6 text-brand-text-muted text-xs">Loading transaction logs...</div>
        </div>
      </div>
    `;

    // Initialize Student date input to today
    const dateInput = container.querySelector('#stu-pay-date');
    if (dateInput) {
      dateInput.value = new Date().toISOString().split('T')[0];
    }

    // Set up dynamic layout behaviors
    setupStudentFormBehaviors(container, student);

    // Load actual student payment statistics and list
    await loadStudentTreasuryData(container, student);
  }

  function setupStudentFormBehaviors(container, student) {
    const feeTypeSelect = container.querySelector('#stu-pay-fee-type');
    const amountInput = container.querySelector('#stu-pay-amount');
    const methodSelect = container.querySelector('#stu-pay-method');
    const destinationInfo = container.querySelector('#payment-destination-info');
    const bankFields = container.querySelector('#bank-input-fields');

    // 1. Fee change updates net amount
    const updatePayableAmount = async () => {
      const category = feeTypeSelect.value;
      const baseAmount = FEE_CATEGORIES[category].amount;
      
      // Fetch actual scholarships from server
      let discount = 0;
      try {
        const res = await fetch(`/api/scholarships?student_id=${student.id}`);
        const scholarships = await res.json();
        const active = scholarships.find(s => s.status === 'ACTIVE');
        if (active) {
          if (category === 'TUITION') {
            discount = active.discount_percentage > 0 
              ? baseAmount * (active.discount_percentage / 100) 
              : active.amount;
          }
        }
      } catch (err) {
        console.error('Error fetching scholarships:', err);
      }

      const netPayable = Math.max(baseAmount - discount, 0);
      amountInput.value = netPayable;
      container.querySelector('#stu-fee-amount').innerText = `$${baseAmount}`;
      container.querySelector('#stu-discount-amount').innerText = `-$${discount}`;
      container.querySelector('#stu-net-payable').innerText = `$${netPayable}`;
    };

    feeTypeSelect.addEventListener('change', updatePayableAmount);
    updatePayableAmount();

    // 2. Method select toggles bank details vs QR and uploader fields
    const updateDestinationInfo = async () => {
      const method = methodSelect.value;

      if (method === 'UPI') {
        bankFields.classList.add('hidden');
        destinationInfo.innerHTML = `
          <strong class="text-brand-text-main block font-sans text-xs">University Central UPI QR Codes:</strong>
          <div class="flex items-center gap-4 mt-1.5">
            <svg viewBox="0 0 24 24" width="38" height="38" class="text-brand-primary" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><rect x="7" y="7" width="3" height="3"/><rect x="14" y="7" width="3" height="3"/><rect x="7" y="14" width="3" height="3"/><rect x="14" y="14" width="3" height="3"/></svg>
            <div>
              <span class="text-brand-text-main block font-mono font-bold text-xs">campusx.collection@axisbank</span>
              <span class="text-[10px] text-brand-text-muted">Scan the QR code from any standard UPI app (GPay, PhonePe, Paytm).</span>
            </div>
          </div>
        `;
      } else if (method === 'BANK_TRANSFER') {
        bankFields.classList.remove('hidden');
        destinationInfo.innerHTML = `
          <strong class="text-brand-text-main block font-sans text-xs">Central Treasury Settlement Bank Account:</strong>
          <div class="grid grid-cols-2 gap-2 text-[10px] mt-1 text-brand-text-muted">
            <div>Account Name: <strong class="text-brand-text-main font-mono">CAMPUSX UNIVERSITY OPERATING A/C</strong></div>
            <div>Bank: <strong class="text-brand-text-main">AXIS BANK LTD</strong></div>
            <div>Account No: <strong class="text-brand-text-main font-mono">924020058291032</strong></div>
            <div>IFSC Code: <strong class="text-brand-text-main font-mono">UTIB0001092</strong></div>
            <div>Branch: <strong class="text-brand-text-main font-mono">CAMPUS ROAD EAST</strong></div>
            <div>Swift: <strong class="text-brand-text-main font-mono">AXISINBB109</strong></div>
          </div>
        `;
      } else {
        bankFields.classList.add('hidden');
        destinationInfo.innerHTML = `
          <strong class="text-brand-text-main block font-sans text-xs">Offline Operations Settlement Details:</strong>
          <span class="text-[10px] text-brand-text-muted mt-1 block">Please deposit cheque/cash directly to the Treasury Counter, Admin Block Wing B. Save the physically signed counter-foil/challan receipt and upload it.</span>
        `;
      }
    };

    methodSelect.addEventListener('change', updateDestinationInfo);
    updateDestinationInfo();

    // 3. Form submission
    const form = container.querySelector('#student-payment-upload-form');
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const submitBtn = container.querySelector('#btn-stu-pay');
      submitBtn.disabled = true;
      submitBtn.innerText = 'Uploading Proof...';

      const fileInput = container.querySelector('#stu-pay-proof');
      const utr = container.querySelector('#stu-pay-utr').value.trim();
      const txid = container.querySelector('#stu-pay-txid').value.trim();
      const date = container.querySelector('#stu-pay-date').value;
      const remarks = container.querySelector('#stu-pay-remarks').value.trim();
      const bank = container.querySelector('#stu-pay-bank').value.trim();
      const acc = container.querySelector('#stu-pay-acc').value.trim();

      if (!fileInput.files || !fileInput.files[0]) {
        alert('Please attach a receipt screenshot proof.');
        submitBtn.disabled = false;
        submitBtn.innerText = 'Submit Payment Proof';
        return;
      }

      try {
        // Initialize payment metadata
        const initRes = await fetch('/api/payments/create', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            student_id: student.id,
            fee_type: feeTypeSelect.value,
            semester: 'Spring 2026',
            amount: parseFloat(amountInput.value),
            payment_method: methodSelect.value,
            installment_id: feeTypeSelect.value === 'TUITION' ? 'inst_1' : ''
          })
        });
        const initData = await initRes.json();

        if (!initData.success) {
          alert('Failed to initialize payment request.');
          submitBtn.disabled = false;
          submitBtn.innerText = 'Submit Payment Proof';
          return;
        }

        const payment_id = initData.payment_id;

        // Upload screenshot via FormData
        const fd = new FormData();
        fd.append('payment_id', payment_id);
        fd.append('student_id', student.id);
        fd.append('fee_type', feeTypeSelect.value);
        fd.append('semester', 'Spring 2026');
        fd.append('amount', parseFloat(amountInput.value));
        fd.append('payment_method', methodSelect.value);
        fd.append('transaction_id', txid);
        fd.append('utr_number', utr);
        fd.append('reference_number', utr || txid);
        fd.append('bank_name', bank);
        fd.append('account_number', acc);
        fd.append('remarks', remarks);
        fd.append('payment_date', date);
        fd.append('proof', fileInput.files[0]);

        const uploadRes = await fetch('/api/payments/upload-proof', {
          method: 'POST',
          body: fd
        });
        const uploadData = await uploadRes.json();

        if (uploadData.success) {
          alert('✅ Payment proof submitted successfully! Awaiting manual verification from the finance registry.');
          form.reset();
          updatePayableAmount();
          updateDestinationInfo();
          loadStudentTreasuryData(container, student);
        } else {
          alert('Failed to upload payment proof screenshot: ' + (uploadData.error || 'Unknown Error'));
        }

      } catch (err) {
        console.error('Error submitting student manual payment:', err);
        alert('Server connection error during payment proof submission.');
      } finally {
        submitBtn.disabled = false;
        submitBtn.innerText = 'Submit Payment Proof';
      }
    });
  }

  async function loadStudentTreasuryData(container, student) {
    try {
      // 1. Fetch scholarships
      const scholRes = await fetch(`/api/scholarships?student_id=${student.id}`);
      const scholarships = await scholRes.json();
      const activeSchol = scholarships.find(s => s.status === 'ACTIVE');
      const scholText = activeSchol 
        ? `${activeSchol.name} (${activeSchol.discount_percentage > 0 ? activeSchol.discount_percentage + '%' : '$' + activeSchol.amount})`
        : 'None';
      
      const scholEl = container.querySelector('#stu-scholarship-txt');
      if (scholEl) scholEl.innerText = scholText;

      // 2. Fetch student's real payments
      const payRes = await fetch(`/api/payments?student_id=${student.id}`);
      const paymentsList = await payRes.json();

      // Aggregate dues paid (APPROVED / VERIFIED statuses)
      const approvedPayments = paymentsList.filter(p => p.status === 'APPROVED' || p.status === 'VERIFIED');
      const totalPaid = approvedPayments.reduce((acc, curr) => acc + curr.amount, 0);

      // Base fee total is student.feeTotal
      const feeTotal = student.feeTotal || 4500;
      const outstanding = Math.max(feeTotal - totalPaid, 0);
      const fillPercentage = Math.min((totalPaid / feeTotal) * 100, 100);

      // Update student UI stats
      const paidEl = container.querySelector('#stu-total-paid');
      const outstandingEl = container.querySelector('#stu-outstanding-total');
      const pctEl = container.querySelector('#stu-clearance-pct');
      const barEl = container.querySelector('#stu-clearance-bar');

      if (paidEl) paidEl.innerText = `$${totalPaid.toLocaleString()}`;
      if (outstandingEl) outstandingEl.innerText = `$${outstanding.toLocaleString()}`;
      if (pctEl) pctEl.innerText = `${fillPercentage.toFixed(1)}%`;
      if (barEl) barEl.style.width = `${fillPercentage}%`;

      // 3. Populate student statement ledger list
      const ledger = container.querySelector('#stu-payments-ledger');
      if (ledger) {
        if (paymentsList.length === 0) {
          ledger.innerHTML = `
            <div class="text-center py-6 text-brand-text-muted text-xs">No prior manual transaction log files found.</div>
          `;
        } else {
          ledger.innerHTML = paymentsList.map(p => {
            let statusBadge = '<span class="badge badge-warning text-[10px]">Pending</span>';
            if (p.status === 'APPROVED' || p.status === 'VERIFIED') {
              statusBadge = '<span class="badge badge-success text-[10px]">Verified</span>';
            } else if (p.status === 'REJECTED') {
              statusBadge = '<span class="badge badge-danger text-[10px]" title="' + (p.rejection_reason || '') + '">Rejected</span>';
            }

            const canPrint = p.status === 'APPROVED' || p.status === 'VERIFIED';
            
            return `
              <div class="p-3.5 border border-brand-border/60 rounded-xl bg-brand-bg-tertiary/40 flex justify-between items-center transition-all duration-200">
                <div>
                  <div class="flex items-center gap-2">
                    <strong class="text-brand-accent-emerald text-sm font-bold">+$${(p.amount || 0).toLocaleString()}</strong>
                    <span class="text-xs text-brand-text-main font-medium">${FEE_CATEGORIES[p.fee_type]?.label || p.fee_type}</span>
                  </div>
                  <span class="text-[0.7rem] text-brand-text-muted mt-1 block">Uploaded: ${(p.payment_date || p.created_at).substring(0, 10)} via ${p.payment_method}</span>
                  ${p.rejection_reason ? `<span class="text-[10px] text-brand-accent-ruby font-semibold mt-0.5 block">Reason: ${p.rejection_reason}</span>` : ''}
                </div>
                <div class="flex items-center gap-3">
                  <code class="text-[0.7rem] bg-white/[0.04] px-2 py-1 rounded font-mono text-brand-text-muted" title="UTR Reference">${p.utr_number || p.transaction_id || 'N/A'}</code>
                  ${statusBadge}
                  ${canPrint ? `
                    <button class="btn btn-secondary py-1 px-2.5 text-[10px] font-bold btn-print-receipt" data-id="${p.id}">
                      <svg viewBox="0 0 24 24" width="10" height="10" class="mr-1 inline-block" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>Print Receipt
                    </button>
                  ` : ''}
                </div>
              </div>
            `;
          }).join('');

          // Bind receipt print buttons
          ledger.querySelectorAll('.btn-print-receipt').forEach(btn => {
            btn.addEventListener('click', (e) => {
              e.stopPropagation();
              const pid = btn.getAttribute('data-id');
              const payment = paymentsList.find(x => x.id === pid);
              if (payment) openReceiptModal(payment);
            });
          });
        }
      }

      // Run local TensorFlow.js delay predictor
      runFinanceTfInference(student, outstanding);

    } catch (err) {
      console.error('Error fetching student statement registries:', err);
    }
  }

  function openReceiptModal(payment) {
    const title = 'CampusX University Fee Payment Receipt';
    const bodyHTML = `
      <div class="p-4 bg-white text-slate-800 rounded-xl font-sans" id="printable-receipt-card" style="box-shadow: 0 4px 20px rgba(0,0,0,0.15)">
        <div class="text-center border-b-2 border-slate-200 pb-3 mb-3">
          <h2 class="text-lg font-bold uppercase tracking-tight text-slate-900">CAMPUSX UNIVERSITY OPERATING REGISTRY</h2>
          <span class="text-[10px] text-slate-500 uppercase tracking-widest block mt-0.5">Official Fee Acknowledgment Receipt</span>
          <span class="text-[10px] font-mono text-slate-400 mt-0.5 block">Receipt Ref: RC-${payment.id.toUpperCase()}</span>
        </div>

        <div class="grid grid-cols-2 gap-x-4 gap-y-1.5 text-[11px] mb-3">
          <div><span class="text-slate-500 font-semibold">Student ID:</span> <span class="font-mono font-bold text-slate-900">${payment.student_id}</span></div>
          <div><span class="text-slate-500 font-semibold">Semester:</span> <strong class="text-slate-900">${payment.semester}</strong></div>
          <div><span class="text-slate-500 font-semibold">Fee Category:</span> <strong class="text-slate-900">${FEE_CATEGORIES[payment.fee_type]?.label || payment.fee_type}</strong></div>
          <div><span class="text-slate-500 font-semibold">Date Settled:</span> <span class="text-slate-900">${(payment.payment_date || '').substring(0, 10)}</span></div>
          <div><span class="text-slate-500 font-semibold">UTR Reference:</span> <code class="font-mono text-slate-900 bg-slate-100 px-1 rounded">${payment.utr_number || 'N/A'}</code></div>
          <div><span class="text-slate-500 font-semibold">Payment Mode:</span> <strong class="text-slate-900 uppercase text-[10px] bg-slate-100 py-0.5 px-1.5 rounded">${payment.payment_method}</strong></div>
        </div>

        <div class="border-t border-b border-slate-200 py-2.5 mb-3 bg-slate-50 px-2 flex justify-between items-center">
          <span class="text-xs font-bold uppercase text-slate-700">Total Net Amount Cleared:</span>
          <span class="text-base font-bold font-mono text-emerald-600">$${(payment.amount || 0).toLocaleString()}.00</span>
        </div>

        <div class="flex justify-between items-end mt-4">
          <div class="flex flex-col gap-0.5">
            <span class="text-[9px] text-slate-400 font-mono">DigiStamp Security Code:</span>
            <code class="text-[9px] font-mono text-slate-600">${btoa(payment.id).substr(0, 12)}</code>
            <span class="text-[9px] text-emerald-600 font-bold flex items-center gap-0.5 mt-0.5">
              <svg viewBox="0 0 24 24" width="10" height="10" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" class="inline"><polyline points="20 6 9 17 4 12"/></svg>
              Digitally Verified Registry
            </span>
          </div>
          <div class="text-right flex flex-col items-center">
            <svg viewBox="0 0 24 24" width="28" height="28" class="text-slate-400" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            <span class="text-[8px] text-slate-400 mt-1 uppercase">Treasury Seal</span>
          </div>
        </div>
      </div>
    `;

    const footerHTML = `
      <div class="flex gap-2 justify-end w-full">
        <button class="btn btn-secondary text-xs" onclick="window.App.closeModal()">Close</button>
        <button class="btn btn-primary text-xs" id="btn-print-receipt-card" style="background-color: var(--color-brand-accent-emerald); border-color: var(--color-brand-accent-emerald);">
          <svg viewBox="0 0 24 24" width="12" height="12" class="mr-1 inline-block" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>
          Print Receipt PDF
        </button>
      </div>
    `;

    window.App.showModal(title, bodyHTML, footerHTML);

    document.getElementById('btn-print-receipt-card').addEventListener('click', () => {
      const receiptCard = document.getElementById('printable-receipt-card');
      if (!receiptCard) return;

      const printWindow = window.open('', '_blank', 'width=800,height=600');
      printWindow.document.write(`
        <html>
          <head>
            <title>CAMPUSX ERP - Fee Receipt</title>
            <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
            <style>
              body { font-family: sans-serif; background-color: #f3f4f6; padding: 2rem; display: flex; justify-content: center; }
            </style>
          </head>
          <body>
            <div class="w-full max-w-md">
              ${receiptCard.innerHTML}
            </div>
            <script>
              window.onload = function() {
                window.print();
                setTimeout(function() { window.close(); }, 500);
              };
            </script>
          </body>
        </html>
      `);
      printWindow.document.close();
    });
  }

  // ────────────────────────────────────────────────────────────────────────
  // ADMIN OFFLINE LOG PAYMENT MODAL
  // ────────────────────────────────────────────────────────────────────────

  function openPaymentModal() {
    const students = window.UniversityDB.getStudents();
    const stuOptions = students.map(s => `<option value="${s.id}">${s.name} (${s.id})</option>`).join('');

    const bodyHTML = `
      <form id="record-payment-form" class="font-sans text-brand-text-main text-xs flex flex-col gap-3">
        <div class="form-group">
          <label class="form-label text-xs font-bold text-brand-text-muted uppercase">Select Student Account</label>
          <select class="form-control mt-1 w-full text-xs" id="pay-student-select">
            ${stuOptions}
          </select>
        </div>
        <div class="grid grid-cols-2 gap-3">
          <div class="form-group">
            <label class="form-label text-xs font-bold text-brand-text-muted uppercase">Amount ($)</label>
            <input type="number" class="form-control mt-1 w-full text-xs" id="pay-amount" min="1" max="10000" value="1000" required>
          </div>
          <div class="form-group">
            <label class="form-label text-xs font-bold text-brand-text-muted uppercase">Payment Mode / Gateway</label>
            <select class="form-control mt-1 w-full text-xs" id="pay-method">
              <option value="CASH">Cash Deposit</option>
              <option value="BANK_TRANSFER">Bank Transfer (NEFT/RTGS)</option>
              <option value="CHEQUE">Cheque Payment</option>
              <option value="SCHOLARSHIP">Scholarship Voucher</option>
            </select>
          </div>
        </div>
        <div class="grid grid-cols-2 gap-3">
          <div class="form-group">
            <label class="form-label text-xs font-bold text-brand-text-muted uppercase">UTR / Reference No</label>
            <input type="text" class="form-control mt-1 w-full text-xs" id="pay-utr" placeholder="e.g. UTR12345678" required>
          </div>
          <div class="form-group">
            <label class="form-label text-xs font-bold text-brand-text-muted uppercase">Transaction Date</label>
            <input type="date" class="form-control mt-1 w-full text-xs" id="pay-date" required>
          </div>
        </div>
        <div class="form-group">
          <label class="form-label text-xs font-bold text-brand-text-muted uppercase">Fee Type Category</label>
          <select id="pay-fee-type" class="form-control mt-1 w-full text-xs">
            ${Object.keys(FEE_CATEGORIES).map(k => `
              <option value="${k}">${FEE_CATEGORIES[k].label}</option>
            `).join('')}
          </select>
        </div>
        <div class="form-group">
          <label class="form-label text-xs font-bold text-brand-text-muted uppercase">Audit Remarks</label>
          <input type="text" class="form-control mt-1 w-full text-xs" id="pay-remarks" placeholder="Receipt logged manually via admin Treasury counter">
        </div>
      </form>
    `;

    const footerHTML = `
      <div class="flex gap-2 justify-end w-full">
        <button class="btn btn-secondary text-xs" onclick="window.App.closeModal()">Cancel</button>
        <button class="btn btn-primary text-xs" id="btn-submit-payment" style="background-color: var(--color-brand-accent-emerald); border-color: var(--color-brand-accent-emerald);">Record Transaction</button>
      </div>
    `;

    window.App.showModal('Record Offline Cash/Cheque Payment Receipt', bodyHTML, footerHTML);

    const dateField = document.getElementById('pay-date');
    if (dateField) dateField.value = new Date().toISOString().split('T')[0];

    document.getElementById('btn-submit-payment').addEventListener('click', async () => {
      const studentId = document.getElementById('pay-student-select').value;
      const amount = parseInt(document.getElementById('pay-amount').value);
      const method = document.getElementById('pay-method').value;
      const utr = document.getElementById('pay-utr').value.trim();
      const date = document.getElementById('pay-date').value;
      const feeType = document.getElementById('pay-fee-type').value;
      const remarks = document.getElementById('pay-remarks').value.trim();

      if (isNaN(amount) || amount <= 0) {
        alert("Please enter a valid billing transaction amount.");
        return;
      }
      if (!utr) {
        alert("UTR/Reference Number is required.");
        return;
      }

      const submitBtn = document.getElementById('btn-submit-payment');
      submitBtn.disabled = true;
      submitBtn.innerText = 'Submitting...';

      try {
        // Initialize payment metadata
        const initRes = await fetch('/api/payments/create', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            student_id: studentId,
            fee_type: feeType,
            semester: 'Spring 2026',
            amount: parseFloat(amount),
            payment_method: method,
            installment_id: feeType === 'TUITION' ? 'inst_1' : ''
          })
        });
        const initData = await initRes.json();

        if (!initData.success) {
          alert('Failed to initialize payment request.');
          submitBtn.disabled = false;
          submitBtn.innerText = 'Record Transaction';
          return;
        }

        const payment_id = initData.payment_id;

        // Upload screenshot metadata (none for offline logs, but logs transaction details)
        const fd = new FormData();
        fd.append('payment_id', payment_id);
        fd.append('student_id', studentId);
        fd.append('fee_type', feeType);
        fd.append('semester', 'Spring 2026');
        fd.append('amount', parseFloat(amount));
        fd.append('payment_method', method);
        fd.append('transaction_id', 'OFF_' + Math.random().toString(36).substr(2, 9).toUpperCase());
        fd.append('utr_number', utr);
        fd.append('reference_number', utr);
        fd.append('bank_name', 'CASH/TREASURY COUNTER');
        fd.append('account_number', 'N/A');
        fd.append('remarks', remarks || 'Logged offline via Admin Treasury Desk');
        fd.append('payment_date', date);

        const uploadRes = await fetch('/api/payments/upload-proof', {
          method: 'POST',
          body: fd
        });
        const uploadData = await uploadRes.json();

        if (uploadData.success) {
          // Immediately auto-verify this since admin created it offline
          const adminUser = window.AuthSystem && window.AuthSystem.getCurrentUser();
          const verifyRes = await fetch('/api/payments/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              payment_id: payment_id,
              admin_id: adminUser?.id || 'USR_DEAN',
              remarks: 'Logged offline via Admin Treasury Desk'
            })
          });
          const verifyData = await verifyRes.json();

          if (verifyData.success) {
            alert(`✅ Offline Payment of $${amount} logged and verified successfully!`);
            window.App.closeModal();
            // Reload page view to update all widgets
            window.App.loadView('finance');
          } else {
            alert('Payment recorded in pending queue but auto-verification failed.');
            window.App.closeModal();
            window.App.loadView('finance');
          }
        } else {
          alert('Failed to log payment transaction details: ' + (uploadData.error || 'Unknown Error'));
          submitBtn.disabled = false;
          submitBtn.innerText = 'Record Transaction';
        }

      } catch (err) {
        console.error('Error recording admin payment:', err);
        alert('Server connection error.');
        submitBtn.disabled = false;
        submitBtn.innerText = 'Record Transaction';
      }
    });
  }

  // ────────────────────────────────────────────────────────────────────────
  // TENSORFLOW.JS ANALYTICS ENGINE
  // ────────────────────────────────────────────────────────────────────────

  function initRevenueForecastChart(container, collected) {
    const ctx = container.querySelector('#tf-finance-forecast-chart');
    if (!ctx) return;
    
    if (revenueForecastChart) revenueForecastChart.destroy();

    const historicalLabels = ['2022-A', '2022-B', '2023-A', '2023-B', '2024-A', '2024-B', '2025-A', '2025-B', '2026-A'];
    const historicalData = [65000, 72000, 78000, 85000, 92000, 102000, 108000, 118000, collected];

    revenueForecastChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: historicalLabels,
        datasets: [
          {
            label: 'Historical Revenue ($)',
            data: historicalData,
            borderColor: 'rgba(16, 185, 129, 0.4)',
            backgroundColor: 'transparent',
            pointBackgroundColor: '#10b981',
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
        plugins: {
          legend: {
            display: true,
            labels: { color: '#475569' }
          }
        },
        scales: {
          y: {
            grid: { color: 'rgba(0, 0, 0, 0.06)' },
            ticks: { color: '#475569' }
          },
          x: {
            grid: { display: false },
            ticks: { color: '#475569' }
          }
        }
      }
    });
  }

  async function runRevenueTfTraining(container, collected) {
    const trainBtn = container.querySelector('#tf-finance-train-btn');
    if (!trainBtn || trainBtn.disabled) return;

    if (typeof tf === 'undefined') {
      alert('TensorFlow.js is currently loading or unavailable. Please check your internet connection.');
      return;
    }

    trainBtn.disabled = true;
    trainBtn.innerText = 'Training Model...';

    const statusCard = container.querySelector('#tf-finance-status-card');
    if (statusCard) statusCard.style.display = 'block';

    const xVal = [0, 1, 2, 3, 4, 5, 6, 7, 8];
    const yVal = [65000, 72000, 78000, 85000, 92000, 102000, 108000, 118000, collected];

    // Normalize: X / 8, Y / 150000
    const xs = tf.tensor2d(xVal.map(x => x / 8), [9, 1]);
    const ys = tf.tensor2d(yVal.map(y => y / 150000), [9, 1]);

    const model = tf.sequential();
    model.add(tf.layers.dense({ units: 1, inputShape: [1] }));

    const lrSelect = container.querySelector('#tf-finance-lr');
    const epochsRange = container.querySelector('#tf-finance-epochs');
    const horizonSelect = container.querySelector('#tf-finance-horizon');

    const lr = lrSelect ? parseFloat(lrSelect.value) : 0.05;
    const epochs = epochsRange ? parseInt(epochsRange.value) : 150;
    const horizon = horizonSelect ? parseInt(horizonSelect.value) : 2;

    model.compile({
      optimizer: tf.train.adam(lr),
      loss: 'meanSquaredError'
    });

    try {
      await model.fit(xs, ys, {
        epochs: epochs,
        callbacks: {
          onEpochEnd: (epoch, logs) => {
            const progress = ((epoch + 1) / epochs) * 100;
            const disp = container.querySelector('#tf-finance-epoch-disp');
            const lossDisp = container.querySelector('#tf-finance-loss-disp');
            const pBar = container.querySelector('#tf-finance-progress-bar');
            if (disp) disp.innerText = `${epoch + 1}/${epochs}`;
            if (lossDisp) lossDisp.innerText = logs.loss.toFixed(6);
            if (pBar) pBar.style.width = `${progress}%`;
          }
        }
      });

      // Get weights
      const weights = model.layers[0].getWeights();
      const w = weights[0].dataSync()[0];
      const b = weights[1].dataSync()[0];

      // De-normalize: y = (150000 * w / 8) * x + 150000 * b
      const m = (150000 * w) / 8;
      const c = 150000 * b;

      // Update metrics panel
      const statusText = container.querySelector('#tf-finance-status-text');
      const fitText = container.querySelector('#tf-finance-equation-fit');
      if (statusText) {
        statusText.innerText = 'Trained successfully';
        statusText.className = 'text-brand-accent-emerald font-bold';
      }
      if (fitText) fitText.innerText = `y = ${m.toFixed(2)}x + ${c.toFixed(2)}`;

      // Generate projection data
      const totalTerms = 9 + horizon; // 9 historical terms + horizon
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
        const val = m * i + c;
        fitAndPredictData.push(Math.round(val));
      }

      // Update forecast chart
      revenueForecastChart.data.labels = allLabels;
      
      // Update historical data padding
      const paddedHistorical = [...yVal];
      while (paddedHistorical.length < totalTerms) {
        paddedHistorical.push(null);
      }
      revenueForecastChart.data.datasets[0].data = paddedHistorical;

      // Update fit and predict dataset
      revenueForecastChart.data.datasets[1].data = fitAndPredictData;
      revenueForecastChart.update();

    } catch (err) {
      console.error('Error during TensorFlow training:', err);
      alert('Error during TensorFlow training: ' + err.message);
    } finally {
      // Clean up tensors
      xs.dispose();
      ys.dispose();
      model.dispose();

      if (trainBtn) {
        trainBtn.disabled = false;
        trainBtn.innerText = 'Run Revenue Projection';
      }
    }
  }

  async function runFinanceTfInference(student, outstanding) {
    if (typeof tf === 'undefined') {
      const el = document.getElementById('finance-ai-delay-pct');
      if (el) el.textContent = 'TF Unavailable';
      return;
    }
    try {
      const inputVal = [outstanding / (student.feeTotal || 5000), student.gpa / 4.0, student.attendance / 100.0];

      const model = tf.sequential();
      model.add(tf.layers.dense({ units: 3, activation: 'tanh', inputShape: [3] }));
      model.add(tf.layers.dense({ units: 1, activation: 'sigmoid' }));

      const w1 = tf.tensor2d([
        [1.5],
        [-0.5],
        [-0.8]
      ]);
      const b1 = tf.tensor1d([0.1]);
      model.layers[1].setWeights([w1, b1]);

      const inputTensor = tf.tensor2d([inputVal], [1, 3]);
      const outputTensor = model.predict(inputTensor);
      const outputVal = (await outputTensor.data())[0];

      inputTensor.dispose();
      outputTensor.dispose();
      w1.dispose();
      b1.dispose();
      model.dispose();

      var delayProb = outputVal;
      if (outstanding === 0) {
        delayProb = 0.0;
      }

      const pctEl = document.getElementById('finance-ai-delay-pct');
      const statusEl = document.getElementById('finance-ai-delay-status');
      const dateEl = document.getElementById('finance-ai-clearance-date');

      if (pctEl) pctEl.textContent = (delayProb * 100).toFixed(1) + '%';
      if (statusEl) {
        if (delayProb > 0.4) {
          statusEl.textContent = 'Elevated Default Risk';
          statusEl.className = 'badge text-[0.65rem] py-0.5 px-2 font-mono bg-brand-accent-ruby/20 text-brand-accent-ruby';
          if (dateEl) dateEl.textContent = 'Delayed (> 30 days)';
        } else if (delayProb > 0.1) {
          statusEl.textContent = 'Grace Period Predict';
          statusEl.className = 'badge text-[0.65rem] py-0.5 px-2 font-mono bg-brand-accent-amber/20 text-brand-accent-amber';
          if (dateEl) dateEl.textContent = 'Within 15 days';
        } else {
          statusEl.textContent = 'Low Risk Statement';
          statusEl.className = 'badge text-[0.65rem] py-0.5 px-2 font-mono bg-brand-accent-emerald/20 text-brand-accent-emerald';
          if (dateEl) dateEl.textContent = 'On time';
        }
      }
    } catch (err) {
      console.error('TF Student finance inference failed:', err);
    }
  }

  return {
    render: render,
    openPaymentModal: openPaymentModal
  };

})();
