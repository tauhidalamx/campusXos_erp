// Blockchain & Web3 Module — Certificate Verification, Credential Wallet, On-Chain Ledger
window.blockchainView = (function() {

  // ─── SIMULATED BLOCKCHAIN STATE ──────────────────────────────────
  const CHAIN = [];
  const CERTIFICATES = [];
  const WALLETS = {};

  // Generate a pseudo-random hash
  function generateHash(input) {
    let hash = 0;
    const str = input + Date.now() + Math.random();
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash |= 0;
    }
    return '0x' + Math.abs(hash).toString(16).padStart(16, '0') +
      Math.floor(Math.random() * 0xFFFFFFFF).toString(16).padStart(8, '0') +
      Math.floor(Math.random() * 0xFFFFFFFF).toString(16).padStart(8, '0');
  }

  // Initialize genesis block and seed data
  function initChain() {
    if (CHAIN.length > 0) return;

    // Genesis Block
    CHAIN.push({
      index: 0,
      timestamp: '2026-01-01T00:00:00Z',
      type: 'GENESIS',
      data: { message: 'CampusX University Blockchain Genesis Block' },
      hash: '0x0000000000000000000000000000000000000000',
      prevHash: '0x0000000000000000000000000000000000000000',
      nonce: 0,
      gasUsed: 0
    });

    // Seed certificate blocks
    const students = window.UniversityDB.getStudents();
    const seedCerts = [
      { studentId: 'STU001', studentName: 'Alex Rivera', type: 'Course Completion', course: 'CS101 - Intro to Programming', grade: 'A', issueDate: '2026-01-15' },
      { studentId: 'STU002', studentName: 'Zoe Chen', type: 'Course Completion', course: 'CS202 - Data Structures', grade: 'A+', issueDate: '2026-02-20' },
      { studentId: 'STU006', studentName: 'Sophia Patel', type: 'Degree Certificate', course: 'B.Tech Computer Science', grade: 'First Class with Distinction', issueDate: '2026-03-01' },
      { studentId: 'STU009', studentName: 'Devon Miller', type: 'Course Completion', course: 'EE302 - Microprocessors', grade: 'A', issueDate: '2026-03-10' },
      { studentId: 'STU008', studentName: 'Elena Rostova', type: 'Merit Certificate', course: 'BA201 - Organizational Behavior', grade: 'University Gold Medal', issueDate: '2026-04-05' },
      { studentId: 'STU004', studentName: 'Emily Watson', type: 'Course Completion', course: 'BI101 - Biotechnology Fundamentals', grade: 'B+', issueDate: '2026-04-18' },
    ];

    seedCerts.forEach((cert, i) => {
      const certHash = generateHash(cert.studentId + cert.course);
      const block = {
        index: CHAIN.length,
        timestamp: cert.issueDate + 'T10:00:00Z',
        type: 'CERT_ISSUE',
        data: cert,
        hash: certHash,
        prevHash: CHAIN[CHAIN.length - 1].hash,
        nonce: Math.floor(Math.random() * 99999),
        gasUsed: Math.floor(21000 + Math.random() * 50000)
      };
      CHAIN.push(block);

      cert.blockIndex = block.index;
      cert.txHash = certHash;
      cert.verified = true;
      CERTIFICATES.push(cert);
    });

    // Seed fee payment blocks
    const txns = window.UniversityDB.getTransactions();
    txns.forEach(tx => {
      const txHash = generateHash(tx.txId + tx.studentId);
      CHAIN.push({
        index: CHAIN.length,
        timestamp: tx.date + 'T12:00:00Z',
        type: 'FEE_PAYMENT',
        data: { txId: tx.txId, studentId: tx.studentId, studentName: tx.studentName, amount: tx.amount, method: tx.method },
        hash: txHash,
        prevHash: CHAIN[CHAIN.length - 1].hash,
        nonce: Math.floor(Math.random() * 99999),
        gasUsed: Math.floor(21000 + Math.random() * 30000)
      });
    });

    // Seed wallets
    students.forEach(s => {
      WALLETS[s.id] = {
        address: generateHash(s.id + s.name).slice(0, 42),
        balance: parseFloat((Math.random() * 2.5 + 0.01).toFixed(4)),
        network: 'CampusX EduChain (Testnet)',
        certificates: CERTIFICATES.filter(c => c.studentId === s.id).length
      };
    });
  }

  // ─── MAIN RENDER ─────────────────────────────────────────────────
  let chainChart = null;

  function render(container) {
    initChain();

    const totalBlocks = CHAIN.length;
    const totalCerts = CERTIFICATES.length;
    const totalGasUsed = CHAIN.reduce((a, b) => a + (b.gasUsed || 0), 0);
    const uniqueWallets = Object.keys(WALLETS).length;

    container.innerHTML = `
      <div class="page-header animate-fade-in">
        <div>
          <h1>Blockchain & Web3 Hub</h1>
          <p>Decentralized credential verification, digital certificate minting, on-chain ledger, and student wallet management.</p>
        </div>
        <div class="flex gap-2">
          <button class="btn btn-secondary btn-sm" id="btn-verify-cert">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 12l2 2 4-4"/><circle cx="12" cy="12" r="10"/></svg>
            Verify Certificate
          </button>
          <button class="btn btn-primary btn-sm" id="btn-mint-cert">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
            Mint Certificate NFT
          </button>
        </div>
      </div>

      <!-- Chain KPI Summary -->
      <div class="kpi-grid animate-fade-in delay-1 mt-6">
        <div class="card kpi-card">
          <div class="kpi-details">
            <span class="kpi-label">Chain Height</span>
            <span class="kpi-value text-brand-primary">#${totalBlocks}</span>
            <span class="kpi-growth text-brand-accent-emerald">Live • Synced</span>
          </div>
          <div class="kpi-icon text-brand-primary">
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
          </div>
        </div>
        <div class="card kpi-card">
          <div class="kpi-details">
            <span class="kpi-label">Certificates Issued</span>
            <span class="kpi-value text-brand-accent-emerald">${totalCerts}</span>
            <span class="kpi-growth text-brand-accent-cyan">Immutable Credentials</span>
          </div>
          <div class="kpi-icon text-brand-accent-emerald">
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
          </div>
        </div>
        <div class="card kpi-card">
          <div class="kpi-details">
            <span class="kpi-label">Gas Consumed</span>
            <span class="kpi-value text-brand-accent-amber">${(totalGasUsed / 1000).toFixed(1)}K</span>
            <span class="kpi-growth text-brand-accent-amber">Cumulative Wei</span>
          </div>
          <div class="kpi-icon text-brand-accent-amber">
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
          </div>
        </div>
        <div class="card kpi-card">
          <div class="kpi-details">
            <span class="kpi-label">Active Wallets</span>
            <span class="kpi-value text-brand-accent-cyan">${uniqueWallets}</span>
            <span class="kpi-growth text-brand-accent-emerald">EduChain Testnet</span>
          </div>
          <div class="kpi-icon text-brand-accent-cyan">
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M22 10H18a2 2 0 100 4h4"/></svg>
          </div>
        </div>
      </div>

      <!-- Two Column: Chain Activity Chart + Certificates -->
      <div class="grid-2 animate-fade-in delay-2 mt-6">

        <!-- Block Activity Chart -->
        <div class="card">
          <h3 class="mb-4 font-display text-lg font-semibold">Block Activity Timeline</h3>
          <div class="chart-wrapper h-[220px]">
            <canvas id="chain-activity-chart"></canvas>
          </div>
        </div>

        <!-- Issued Certificates List -->
        <div class="card">
          <div class="flex justify-between items-center mb-4">
            <h3 class="font-display text-lg font-semibold">Minted Credential NFTs</h3>
            <span class="badge badge-success">${totalCerts} On-Chain</span>
          </div>
          <div class="flex flex-col gap-3 max-h-[280px] overflow-y-auto pr-1" id="cert-list-container">
            ${CERTIFICATES.map(cert => `
              <div class="p-3 border border-brand-border rounded-xl bg-brand-bg-tertiary flex justify-between items-center gap-3 transition-all duration-200 hover:translate-x-1 hover:border-brand-accent-cyan/30">
                <div class="flex-1 min-w-0">
                  <div class="flex items-center gap-2 mb-1">
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="${cert.type === 'Degree Certificate' ? 'var(--color-brand-accent-amber)' : (cert.type === 'Merit Certificate' ? 'var(--color-brand-accent-ruby)' : 'var(--color-brand-accent-emerald)')}" stroke-width="2"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                    <strong class="text-sm">${cert.studentName}</strong>
                    <span class="badge text-[0.65rem] bg-brand-primary/10 text-brand-primary">${cert.type}</span>
                  </div>
                  <div class="text-xs text-brand-text-muted">${cert.course}</div>
                  <code class="text-[0.65rem] text-brand-text-subtle break-all">${cert.txHash.slice(0, 30)}...</code>
                </div>
                <div class="text-right shrink-0">
                  <span class="badge badge-success" style="font-size:0.7rem;">✓ Verified</span>
                  <div class="text-[0.7rem] text-brand-text-subtle mt-1">Block #${cert.blockIndex}</div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>

      <!-- Two Column: Block Explorer + Student Wallets -->
      <div class="grid-2 animate-fade-in delay-3 mt-6">

        <!-- Block Explorer -->
        <div class="card">
          <h3 class="mb-4 font-display text-lg font-semibold">Block Explorer — On-Chain Ledger</h3>
          <div class="max-h-[380px] overflow-y-auto pr-1">
            <table class="w-full border-collapse">
              <thead>
                <tr>
                  <th class="p-2.5 text-[0.75rem]">Block</th>
                  <th class="p-2.5 text-[0.75rem]">Type</th>
                  <th class="p-2.5 text-[0.75rem]">Hash</th>
                  <th class="p-2.5 text-[0.75rem]">Gas</th>
                  <th class="p-2.5 text-[0.75rem]">Nonce</th>
                </tr>
              </thead>
              <tbody>
                ${CHAIN.slice().reverse().map(block => {
                  let typeColor = 'var(--text-muted)';
                  let typeBadge = 'badge-info';
                  if (block.type === 'CERT_ISSUE') { typeColor = 'var(--accent-emerald)'; typeBadge = 'badge-success'; }
                  else if (block.type === 'FEE_PAYMENT') { typeColor = 'var(--accent-amber)'; typeBadge = 'badge-warning'; }
                  else if (block.type === 'GENESIS') { typeColor = 'var(--primary)'; typeBadge = 'badge-info'; }

                  return `
                    <tr class="block-row border-b border-brand-border cursor-pointer hover:bg-white/[0.02] transition-colors" data-idx="${block.index}">
                      <td class="p-2.5 font-bold text-brand-primary text-sm">#${block.index}</td>
                      <td class="p-2.5"><span class="badge ${typeBadge} text-[0.7rem]">${block.type.replace('_', ' ')}</span></td>
                      <td class="p-2.5"><code class="text-[0.7rem] text-brand-text-muted">${block.hash.slice(0, 18)}...</code></td>
                      <td class="p-2.5 text-xs text-brand-text-muted">${(block.gasUsed || 0).toLocaleString()}</td>
                      <td class="p-2.5 text-xs text-brand-text-subtle">${block.nonce}</td>
                    </tr>
                  `;
                }).join('')}
              </tbody>
            </table>
          </div>
        </div>

        <!-- Student Wallets -->
        <div class="card">
          <h3 class="mb-4 font-display text-lg font-semibold">Student Credential Wallets</h3>
          <p class="text-brand-text-muted text-xs mb-4">CampusX EduChain Testnet — Each student receives a decentralized identity wallet upon enrollment.</p>
          <div class="flex flex-col gap-3 max-h-[330px] overflow-y-auto pr-1">
            ${window.UniversityDB.getStudents().map(stu => {
              const w = WALLETS[stu.id];
              if (!w) return '';
              return `
                <div class="p-3 border border-brand-border rounded-xl bg-brand-bg-tertiary flex justify-between items-center transition-all duration-200 hover:bg-white/[0.02]">
                  <div class="flex items-center gap-3 min-w-0 flex-1">
                    <img src="${stu.avatar}" class="w-8 h-8 rounded-full object-cover border border-brand-border shrink-0">
                    <div class="min-w-0">
                      <strong class="text-sm">${stu.name}</strong>
                      <code class="block text-[0.65rem] text-brand-text-subtle break-all">${w.address}</code>
                    </div>
                  </div>
                  <div class="text-right shrink-0 ml-3">
                    <div class="font-bold text-brand-accent-cyan text-sm">${w.balance} ETH</div>
                    <span class="text-[0.7rem] text-brand-text-subtle">${w.certificates} cert(s)</span>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>
      </div>

      <!-- Smart Contract Simulation -->
      <div class="card animate-fade-in delay-4 mt-6">
        <h3 class="mb-2 font-display text-lg font-semibold">Smart Contract — Fee Payment Gateway</h3>
        <p class="text-brand-text-muted text-xs mb-5">Execute a simulated on-chain fee transaction through the CampusX University smart contract.</p>
        <div class="grid grid-cols-1 md:grid-cols-[1fr_1fr_1fr_auto] gap-4 items-end">
          <div class="form-group mb-0">
            <label class="form-label">Student Wallet</label>
            <select class="form-control" id="sc-student-select">
              ${window.UniversityDB.getStudents().map(s => `<option value="${s.id}">${s.name} (${s.id})</option>`).join('')}
            </select>
          </div>
          <div class="form-group mb-0">
            <label class="form-label">Amount (ETH)</label>
            <input type="number" class="form-control" id="sc-amount" value="0.5" min="0.01" max="10" step="0.01">
          </div>
          <div class="form-group mb-0">
            <label class="form-label">Gas Limit</label>
            <input type="number" class="form-control" id="sc-gas" value="21000" min="21000" max="100000">
          </div>
          <button class="btn btn-primary h-[42px]" id="btn-execute-sc">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
            Execute
          </button>
        </div>
        <div id="sc-receipt" class="mt-4"></div>
      </div>
    `;

    // ─── EVENT BINDINGS ────────────────────────────────────────────
    document.getElementById('btn-mint-cert').addEventListener('click', openMintModal);
    document.getElementById('btn-verify-cert').addEventListener('click', openVerifyModal);
    document.getElementById('btn-execute-sc').addEventListener('click', executeSmartContract);

    // Block row click → detail modal
    container.querySelectorAll('.block-row').forEach(row => {
      row.addEventListener('click', () => {
        const idx = parseInt(row.getAttribute('data-idx'));
        openBlockDetailModal(idx);
      });
    });

    // Render chart
    setTimeout(() => renderChainChart(), 100);
  }

  // ─── CHAIN ACTIVITY CHART ───────────────────────────────────────
  function renderChainChart() {
    const ctx = document.getElementById('chain-activity-chart');
    if (!ctx) return;
    if (chainChart) chainChart.destroy();

    // Group blocks by type
    const certBlocks = CHAIN.filter(b => b.type === 'CERT_ISSUE').length;
    const feeBlocks = CHAIN.filter(b => b.type === 'FEE_PAYMENT').length;
    const otherBlocks = CHAIN.filter(b => b.type === 'GENESIS').length;

    // Monthly gas consumption simulation
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    const gasData = [12000, 28000, 45000, 38000, 62000, 54000];

    chainChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: months,
        datasets: [
          {
            label: 'Gas Used (Wei)',
            data: gasData,
            backgroundColor: 'rgba(99, 102, 241, 0.6)',
            borderColor: '#6366f1',
            borderWidth: 1,
            borderRadius: 6
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false }
        },
        scales: {
          y: {
            grid: { color: 'rgba(0,0,0,0.06)' },
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

  // ─── BLOCK DETAIL MODAL ──────────────────────────────────────────
  function openBlockDetailModal(idx) {
    const block = CHAIN.find(b => b.index === idx);
    if (!block) return;

    const dataStr = JSON.stringify(block.data, null, 2);

    const bodyHTML = `
      <div class="grid grid-cols-2 gap-3 md:gap-x-6 text-sm mb-5">
        <div><span class="text-brand-text-muted">Block Index:</span> <strong class="text-brand-primary">#${block.index}</strong></div>
        <div><span class="text-brand-text-muted">Block Type:</span> <strong>${block.type}</strong></div>
        <div><span class="text-brand-text-muted">Timestamp:</span> <strong>${block.timestamp}</strong></div>
        <div><span class="text-brand-text-muted">Nonce:</span> <strong>${block.nonce}</strong></div>
        <div><span class="text-brand-text-muted">Gas Used:</span> <strong>${(block.gasUsed || 0).toLocaleString()} Wei</strong></div>
        <div><span class="text-brand-text-muted">Status:</span> <span class="badge badge-success">Confirmed</span></div>
      </div>
      <div class="mb-4">
        <span class="text-brand-text-muted text-xs">Block Hash:</span>
        <code class="block mt-1 p-2.5 bg-brand-bg-tertiary rounded-lg text-xs break-all text-brand-accent-cyan">${block.hash}</code>
      </div>
      <div class="mb-4">
        <span class="text-brand-text-muted text-xs">Previous Hash:</span>
        <code class="block mt-1 p-2.5 bg-brand-bg-tertiary rounded-lg text-xs break-all text-brand-text-subtle">${block.prevHash}</code>
      </div>
      <div>
        <span class="text-brand-text-muted text-xs">Block Data Payload:</span>
        <pre class="mt-1 p-3 bg-brand-bg-tertiary rounded-lg text-xs text-brand-accent-emerald overflow-x-auto whitespace-pre-wrap">${dataStr}</pre>
      </div>
    `;

    window.App.showModal('Block Inspector — #' + block.index, bodyHTML, '<button class="btn btn-secondary" onclick="window.App.closeModal()">Close</button>');
  }

  // ─── MINT CERTIFICATE MODAL ──────────────────────────────────────
  function openMintModal() {
    const students = window.UniversityDB.getStudents();
    const courses = window.UniversityDB.getCourses();

    const stuOpts = students.map(s => `<option value="${s.id}">${s.name} (${s.id})</option>`).join('');
    const courseOpts = courses.map(c => `<option value="${c.code} - ${c.title}">${c.code} - ${c.title}</option>`).join('');

    const bodyHTML = `
      <p class="text-brand-text-muted text-sm mb-5">Mint a new verifiable credential NFT to the CampusX EduChain. This certificate becomes permanently immutable once confirmed.</p>
      <div class="form-group">
        <label class="form-label">Student</label>
        <select class="form-control" id="mint-student">${stuOpts}</select>
      </div>
      <div class="grid-2">
        <div class="form-group">
          <label class="form-label">Certificate Type</label>
          <select class="form-control" id="mint-type">
            <option>Course Completion</option>
            <option>Degree Certificate</option>
            <option>Merit Certificate</option>
            <option>Research Publication</option>
            <option>Internship Certificate</option>
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">Grade / Honor</label>
          <select class="form-control" id="mint-grade">
            <option>A+</option><option>A</option><option>B+</option><option>B</option><option>C</option>
            <option>First Class with Distinction</option><option>University Gold Medal</option><option>Pass</option>
          </select>
        </div>
      </div>
      <div class="form-group">
        <label class="form-label">Course / Program</label>
        <select class="form-control" id="mint-course">${courseOpts}</select>
      </div>
    `;

    const footerHTML = `
      <button class="btn btn-secondary" onclick="window.App.closeModal()">Cancel</button>
      <button class="btn btn-primary" id="btn-confirm-mint">
        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
        Mint to Chain
      </button>
    `;

    window.App.showModal('Mint Credential NFT', bodyHTML, footerHTML);

    document.getElementById('btn-confirm-mint').addEventListener('click', () => {
      const studentId = document.getElementById('mint-student').value;
      const stu = students.find(s => s.id === studentId);
      const certType = document.getElementById('mint-type').value;
      const grade = document.getElementById('mint-grade').value;
      const course = document.getElementById('mint-course').value;

      if (!stu) return;

      const cert = {
        studentId: stu.id,
        studentName: stu.name,
        type: certType,
        course: course,
        grade: grade,
        issueDate: new Date().toISOString().split('T')[0]
      };

      const txHash = generateHash(stu.id + course + Date.now());
      const block = {
        index: CHAIN.length,
        timestamp: new Date().toISOString(),
        type: 'CERT_ISSUE',
        data: cert,
        hash: txHash,
        prevHash: CHAIN[CHAIN.length - 1].hash,
        nonce: Math.floor(Math.random() * 99999),
        gasUsed: Math.floor(21000 + Math.random() * 50000)
      };
      CHAIN.push(block);

      cert.blockIndex = block.index;
      cert.txHash = txHash;
      cert.verified = true;
      CERTIFICATES.push(cert);

      // Update wallet
      if (WALLETS[stu.id]) {
        WALLETS[stu.id].certificates++;
      }

      window.App.closeModal();
      alert(`✅ Certificate NFT minted successfully!\n\nStudent: ${stu.name}\nType: ${certType}\nBlock: #${block.index}\nTx Hash: ${txHash.slice(0, 32)}...`);

      // Re-render
      const viewContainer = document.querySelector('.page-transition');
      if (viewContainer) render(viewContainer);
    });
  }

  // ─── VERIFY CERTIFICATE MODAL ────────────────────────────────────
  function openVerifyModal() {
    const bodyHTML = `
      <p class="text-brand-text-muted text-sm mb-5">Enter a transaction hash or student ID to verify the authenticity of a certificate on the CampusX EduChain.</p>
      <div class="form-group">
        <label class="form-label">Transaction Hash or Student ID</label>
        <input type="text" class="form-control" id="verify-input" placeholder="e.g. 0x... or STU001">
      </div>
      <div id="verify-result" class="mt-4"></div>
    `;

    const footerHTML = `
      <button class="btn btn-secondary" onclick="window.App.closeModal()">Close</button>
      <button class="btn btn-primary" id="btn-run-verify">
        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 12l2 2 4-4"/><circle cx="12" cy="12" r="10"/></svg>
        Verify On-Chain
      </button>
    `;

    window.App.showModal('Verify Certificate Authenticity', bodyHTML, footerHTML);

    document.getElementById('btn-run-verify').addEventListener('click', () => {
      const input = document.getElementById('verify-input').value.trim();
      const resultDiv = document.getElementById('verify-result');
      if (!input) {
        resultDiv.innerHTML = '<p class="text-brand-accent-ruby">Please enter a hash or student ID.</p>';
        return;
      }

      // Search by hash or student ID
      let found = CERTIFICATES.filter(c =>
        c.txHash.toLowerCase().includes(input.toLowerCase()) ||
        c.studentId.toUpperCase() === input.toUpperCase()
      );

      if (found.length === 0) {
        resultDiv.innerHTML = `
          <div class="p-4 border border-brand-accent-ruby/30 rounded-xl bg-brand-accent-ruby/5">
            <div class="flex items-center gap-2 mb-2">
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="var(--color-brand-accent-ruby)" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
              <strong class="text-brand-accent-ruby">Not Found</strong>
            </div>
            <p class="text-xs text-brand-text-muted">No matching certificates found on the CampusX EduChain for this query. The credential may be invalid or not yet minted.</p>
          </div>
        `;
        return;
      }

      resultDiv.innerHTML = found.map(cert => `
        <div class="p-4 border border-brand-accent-emerald/30 rounded-xl bg-brand-accent-emerald/5 mb-3">
          <div class="flex items-center gap-2 mb-2">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="var(--color-brand-accent-emerald)" stroke-width="2"><path d="M9 12l2 2 4-4"/><circle cx="12" cy="12" r="10"/></svg>
            <strong class="text-brand-accent-emerald">✓ Verified on Blockchain</strong>
          </div>
          <div class="grid grid-cols-2 gap-2 text-xs">
            <div><span class="text-brand-text-muted">Student:</span> <strong>${cert.studentName}</strong></div>
            <div><span class="text-brand-text-muted">Type:</span> <strong>${cert.type}</strong></div>
            <div><span class="text-brand-text-muted">Course:</span> <strong>${cert.course}</strong></div>
            <div><span class="text-brand-text-muted">Grade:</span> <strong>${cert.grade}</strong></div>
            <div><span class="text-brand-text-muted">Issue Date:</span> <strong>${cert.issueDate}</strong></div>
            <div><span class="text-brand-text-muted">Block:</span> <strong class="text-brand-primary">#${cert.blockIndex}</strong></div>
          </div>
          <code class="block mt-2.5 text-[0.7rem] text-brand-accent-cyan break-all">${cert.txHash}</code>
        </div>
      `).join('');
    });
  }

  // ─── SMART CONTRACT EXECUTION ────────────────────────────────────
  function executeSmartContract() {
    const studentId = document.getElementById('sc-student-select').value;
    const amount = parseFloat(document.getElementById('sc-amount').value);
    const gas = parseInt(document.getElementById('sc-gas').value);
    const receiptDiv = document.getElementById('sc-receipt');

    const stu = window.UniversityDB.getStudents().find(s => s.id === studentId);
    if (!stu || isNaN(amount) || amount <= 0) {
      receiptDiv.innerHTML = '<p class="text-brand-accent-ruby">Invalid transaction parameters.</p>';
      return;
    }

    // Show loading state
    receiptDiv.innerHTML = `
      <div class="p-4 border border-brand-border rounded-xl bg-brand-bg-tertiary text-center">
        <div class="animate-pulse-glow inline-block w-3 h-3 rounded-full bg-brand-primary mr-2"></div>
        <span class="text-brand-text-muted">Broadcasting transaction to EduChain network...</span>
      </div>
    `;

    // Simulate mining delay
    setTimeout(() => {
      const txHash = generateHash(studentId + amount + Date.now());
      const usdEquiv = (amount * 3800).toFixed(2); // Simulated ETH price

      const block = {
        index: CHAIN.length,
        timestamp: new Date().toISOString(),
        type: 'FEE_PAYMENT',
        data: {
          txId: 'SC-' + Math.floor(1000 + Math.random() * 9000),
          studentId: studentId,
          studentName: stu.name,
          amount: amount + ' ETH',
          usdEquivalent: '$' + usdEquiv,
          method: 'Smart Contract'
        },
        hash: txHash,
        prevHash: CHAIN[CHAIN.length - 1].hash,
        nonce: Math.floor(Math.random() * 99999),
        gasUsed: gas
      };
      CHAIN.push(block);

      // Update student fee
      const feeUsd = Math.min(stu.feeTotal, stu.feePaid + parseInt(usdEquiv));
      window.UniversityDB.updateStudent(studentId, { feePaid: feeUsd });

      // Deduct wallet balance
      if (WALLETS[studentId]) {
        WALLETS[studentId].balance = Math.max(0, parseFloat((WALLETS[studentId].balance - amount).toFixed(4)));
      }

      receiptDiv.innerHTML = `
        <div class="p-5 border border-brand-accent-emerald/30 rounded-xl bg-brand-accent-emerald/5">
          <div class="flex items-center gap-2 mb-4">
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="var(--color-brand-accent-emerald)" stroke-width="2"><path d="M9 12l2 2 4-4"/><circle cx="12" cy="12" r="10"/></svg>
            <strong class="text-brand-accent-emerald text-base font-semibold">Transaction Confirmed ✓</strong>
          </div>
          <div class="grid grid-cols-2 gap-2 text-sm">
            <div><span class="text-brand-text-muted">From:</span> <strong>${stu.name}</strong></div>
            <div><span class="text-brand-text-muted">To:</span> <strong>CampusX University Treasury</strong></div>
            <div><span class="text-brand-text-muted">Amount:</span> <strong class="text-brand-accent-cyan">${amount} ETH</strong> <span class="text-brand-text-subtle">(~$${usdEquiv})</span></div>
            <div><span class="text-brand-text-muted">Gas Used:</span> <strong>${gas.toLocaleString()} Wei</strong></div>
            <div><span class="text-brand-text-muted">Block:</span> <strong class="text-brand-primary">#${block.index}</strong></div>
            <div><span class="text-brand-text-muted">Status:</span> <span class="badge badge-success">Finalized</span></div>
          </div>
          <code class="block mt-3 p-2.5 bg-brand-bg-primary rounded-lg text-[0.7rem] break-all text-brand-accent-cyan">TX: ${txHash}</code>
        </div>
      `;
    }, 1500);
  }

  return {
    render: render,
    openMintModal: openMintModal
  };

})();
