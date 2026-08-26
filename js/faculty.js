// Faculty Directory Module
window.facultyView = (function() {
  
  function render(container) {
    container.innerHTML = `
      <div class="page-header animate-fade-in flex items-center justify-between border-b border-brand-border/30 pb-4 mb-6">
        <div>
          <h1 class="text-3xl font-bold font-display tracking-tight bg-gradient-to-r from-white via-slate-100 to-brand-primary bg-clip-text text-transparent">Faculty Directory</h1>
          <p class="text-sm text-brand-text-muted mt-1">Manage credentials, departments, research specializations, and academic teaching workloads.</p>
        </div>
        <button class="btn btn-primary" id="btn-add-faculty">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="11" x2="22" y2="11"/><line x1="19" y1="8" x2="19" y2="14"/></svg>
          <span>Enroll Faculty</span>
        </button>
      </div>

      <!-- Search Controls -->
      <div class="card animate-fade-in delay-1 bg-brand-bg-secondary/40 backdrop-blur-md border border-brand-border/50 p-6 rounded-2xl mb-6">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <div class="form-group mb-0 md:col-span-2">
            <label class="form-label text-xs font-bold text-brand-text-muted uppercase tracking-wider pl-1">Search Faculty Directory</label>
            <input type="text" class="form-control mt-1 w-full" placeholder="Search by name, email, or department" id="faculty-search">
          </div>
          <div class="form-group mb-0">
            <label class="form-label text-xs font-bold text-brand-text-muted uppercase tracking-wider pl-1">Department</label>
            <select class="form-control mt-1 w-full" id="faculty-dept-filter">
              <option value="ALL">All Departments</option>
              <option value="CS">Computer Science</option>
              <option value="EE">Electrical Engineering</option>
              <option value="ME">Mechanical Engineering</option>
              <option value="BI">Bioinformatics</option>
              <option value="BA">Business Administration</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Faculty Workload Chart & Visual Overview -->
      <div class="card animate-fade-in delay-2 bg-brand-bg-secondary/40 backdrop-blur-md border border-brand-border/50 p-6 rounded-2xl mb-6">
        <h3 class="mb-2 font-display text-lg font-bold text-brand-text-main">Workload Management Dashboard</h3>
        <p class="text-brand-text-muted mb-5 text-[0.85rem]">Maximum weekly teaching limit: 18 hours. Values over 15 hours represent heavy workload.</p>
        <div class="chart-wrapper h-[200px]">
          <canvas id="faculty-workload-chart"></canvas>
        </div>
      </div>

      <!-- Faculty Directory Grid -->
      <div class="grid-3 animate-fade-in delay-3 mt-6" id="faculty-cards-container">
        <!-- Loaded dynamically -->
      </div>
    `;

    document.getElementById('faculty-search').addEventListener('input', applySearch);
    document.getElementById('faculty-dept-filter').addEventListener('change', applySearch);
    document.getElementById('btn-add-faculty').addEventListener('click', openAddFacultyModal);

    applySearch();
  }

  function applySearch() {
    const searchVal = document.getElementById('faculty-search').value.toLowerCase().trim();
    const deptVal = document.getElementById('faculty-dept-filter').value;

    const faculty = window.UniversityDB.getFaculty();
    const filtered = faculty.filter(f => {
      const matchSearch = f.name.toLowerCase().includes(searchVal) || f.email.toLowerCase().includes(searchVal) || f.id.toLowerCase().includes(searchVal);
      const matchDept = deptVal === 'ALL' || f.dept === deptVal;
      return matchSearch && matchDept;
    });

    populateCards(filtered);
    renderWorkloadChart(filtered);
  }

  function populateCards(data) {
    const container = document.getElementById('faculty-cards-container');
    if (!container) return;

    if (data.length === 0) {
      container.innerHTML = `
        <div class="card col-span-full text-center text-brand-text-muted p-8">
          No matching faculty listings found in database.
        </div>
      `;
      return;
    }

    container.innerHTML = data.map(fac => {
      let loadPercent = Math.min((fac.workload / 18) * 100, 100);
      let barColor = 'var(--color-brand-primary)';
      if (fac.workload > 15) barColor = 'var(--color-brand-accent-ruby)';
      else if (fac.workload > 12) barColor = 'var(--color-brand-accent-amber)';
      else barColor = 'var(--color-brand-accent-emerald)';

      // Calculate faculty teaching courses and corresponding average student attendance
      const coursesTaught = window.UniversityDB.getCourses().filter(c => c.facultyId === fac.id);
      const students = window.UniversityDB.getStudents();
      let totalAttendance = 0;
      let count = 0;

      coursesTaught.forEach(c => {
        let enrolled = students.filter(s => s.courses.includes(c.code));
        if (enrolled.length === 0) enrolled = students.filter(s => s.dept === c.dept);
        enrolled.forEach(s => {
          totalAttendance += (s.attendance || 0);
          count++;
        });
      });

      const avgClassAttend = count > 0 ? Math.round(totalAttendance / count) : 90;

      return `
        <div class="card flex flex-col gap-4">
          <div class="flex gap-4 items-center">
            <img src="${fac.avatar}" class="w-13 h-13 rounded-full object-cover border border-brand-border">
            <div>
              <h4 class="m-0 font-display text-base font-semibold">${fac.name}</h4>
              <span class="text-[0.75rem] text-brand-text-muted font-medium">${fac.designation} (${fac.dept})</span>
            </div>
          </div>
          
          <div class="text-[0.85rem] text-brand-text-muted">
            <div><strong>Email:</strong> ${fac.email}</div>
            <div><strong>ID:</strong> <code>${fac.id}</code></div>
            <div><strong>Class Attendance:</strong> <span class="font-bold ${avgClassAttend < 75 ? 'text-brand-accent-ruby' : (avgClassAttend < 85 ? 'text-brand-accent-amber' : 'text-brand-accent-emerald')}">${avgClassAttend}%</span></div>
          </div>

          <!-- Workload Progress bar -->
          <div>
            <div class="flex justify-between text-[0.8rem] mb-1">
              <span>Workload Assigned</span>
              <strong>${fac.workload} hrs / wk</strong>
            </div>
            <div class="h-1.5 bg-brand-bg-tertiary rounded-full overflow-hidden">
              <div class="h-full" style="width: ${loadPercent}%; background-color: ${barColor};"></div>
            </div>
          </div>

          <div class="flex gap-2 mt-auto">
            <button class="btn btn-secondary btn-sm assign-class-btn flex-1" data-id="${fac.id}">Class Workload</button>
            <button class="btn btn-secondary btn-sm" onclick="alert('Viewing publications...')">Research</button>
          </div>
        </div>
      `;
    }).join('');

    // Bind workload buttons
    container.querySelectorAll('.assign-class-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        openAssignClassModal(id);
      });
    });
  }

  let workloadChartObj = null;

  function renderWorkloadChart(facList) {
    const ctx = document.getElementById('faculty-workload-chart');
    if (!ctx) return;

    if (workloadChartObj) workloadChartObj.destroy();

    const labels = facList.map(f => f.name.split(' ').slice(1).join(' ')); // Use last names for neatness
    const workloadData = facList.map(f => f.workload);
    const colors = facList.map(f => f.workload > 15 ? '#f43f5e' : (f.workload > 12 ? '#f59e0b' : '#10b981'));

    workloadChartObj = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Weekly teaching hours',
          data: workloadData,
          backgroundColor: colors,
          borderColor: 'rgba(0, 0, 0, 0.05)',
          borderWidth: 1,
          borderRadius: 4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false }
        },
        scales: {
          y: {
            grid: { color: 'rgba(0, 0, 0, 0.06)' },
            ticks: { color: '#475569' },
            max: 20
          },
          x: {
            grid: { display: false },
            ticks: { color: '#475569' }
          }
        }
      }
    });
  }

  function openAssignClassModal(facId) {
    const facultyList = window.UniversityDB.getFaculty();
    const fac = facultyList.find(f => f.id === facId);
    if (!fac) return;

    const bodyHTML = `
      <p class="mb-4 text-brand-text-muted">Adjust workload allocations and curriculum credits assignment for <strong>${fac.name}</strong>.</p>
      <div class="form-group">
        <label class="form-label">Current Weekly Lecture Workload (Hours)</label>
        <input type="number" class="form-control" id="mod-fac-workload" value="${fac.workload}" min="0" max="24">
      </div>
      
      <h4 class="mt-5 mb-3 text-base font-semibold">Assigned Course Catalog</h4>
      <ul class="pl-5 text-brand-text-main list-disc mb-4">
        ${fac.courses.map(code => {
          const c = window.UniversityDB.getCourses().find(course => course.code === code);
          return `<li><code>${code}</code> - ${c ? c.title : 'Research Project'}</li>`;
        }).join('')}
      </ul>

      <!-- AI Workload & Satisfaction Optimizer -->
      <div class="card mt-4 p-4 bg-brand-bg-tertiary border border-brand-border">
        <div class="flex items-center justify-between mb-3 pb-2 border-b border-brand-border/40">
          <div class="flex items-center gap-2">
            <span class="w-2.5 h-2.5 rounded-full bg-brand-accent-amber animate-pulse"></span>
            <span class="text-xs font-bold uppercase tracking-wider text-brand-text-main font-display">AI Workload Predictor</span>
          </div>
          <span class="badge text-[0.65rem] py-0.5 px-2 font-mono bg-brand-accent-emerald/20 text-brand-accent-emerald" id="fac-ai-status">Optimal</span>
        </div>
        <div class="grid grid-cols-2 gap-3 text-xs text-brand-text-muted">
          <div>
            <span class="text-[0.7rem] text-brand-text-subtle">Predicted Student Rating:</span>
            <div class="font-bold text-brand-text-main font-mono text-sm mt-0.5" id="fac-ai-rating">Calculating...</div>
          </div>
          <div>
            <span class="text-[0.7rem] text-brand-text-subtle">Optimal Load Recommendation:</span>
            <div class="font-bold text-brand-text-main font-mono text-sm mt-0.5" id="fac-ai-recommend">12 hrs/wk</div>
          </div>
        </div>
      </div>
    `;

    const footerHTML = `
      <button class="btn btn-secondary" onclick="window.App.closeModal()">Cancel</button>
      <button class="btn btn-primary" id="btn-save-workload">Save Changes</button>
    `;

    window.App.showModal('Modify Academic Workload', bodyHTML, footerHTML);

    const inputField = document.getElementById('mod-fac-workload');
    if (inputField) {
      inputField.addEventListener('input', (e) => {
        const val = parseInt(e.target.value) || 0;
        runFacultyTfOptimizer(fac, val);
      });
    }

    runFacultyTfOptimizer(fac, fac.workload);

    document.getElementById('btn-save-workload').addEventListener('click', () => {
      const load = parseInt(document.getElementById('mod-fac-workload').value);
      if (!isNaN(load) && load >= 0 && load <= 24) {
        fac.workload = load;
        window.App.closeModal();
        alert("Workload parameters updated successfully!");
        applySearch();
      } else {
        alert("Please enter a valid workload hours number.");
      }
    });
  }

  async function runFacultyTfOptimizer(fac, currentLoadValue) {
    if (typeof tf === 'undefined') {
      const rating = document.getElementById('fac-ai-rating');
      if (rating) rating.textContent = 'TF Unavailable';
      return;
    }
    try {
      const isProf = fac.designation === 'Professor' ? 1.0 : 0.5;
      const inputVal = [currentLoadValue / 18.0, fac.courses.length / 5.0, isProf];

      const model = tf.sequential();
      model.add(tf.layers.dense({ units: 3, activation: 'tanh', inputShape: [3] }));
      model.add(tf.layers.dense({ units: 1 }));

      const w1 = tf.tensor2d([
        [-1.2],
        [-0.4],
        [0.8]
      ]);
      const b1 = tf.tensor1d([0.8]);
      model.layers[1].setWeights([w1, b1]);

      const inputTensor = tf.tensor2d([inputVal], [1, 3]);
      const outputTensor = model.predict(inputTensor);
      const outputVal = (await outputTensor.data())[0];

      var predictedRating = Math.max(1.0, Math.min(5.0, 1.0 + outputVal * 4.0));
      
      if (currentLoadValue > 16) {
        predictedRating = Math.max(1.0, Math.min(predictedRating, 3.2));
      } else if (currentLoadValue >= 10 && currentLoadValue <= 14) {
        predictedRating = Math.min(5.0, predictedRating + 0.5);
      }

      inputTensor.dispose();
      outputTensor.dispose();
      w1.dispose();
      b1.dispose();
      model.dispose();

      const ratingEl = document.getElementById('fac-ai-rating');
      const statusEl = document.getElementById('fac-ai-status');
      const recEl = document.getElementById('fac-ai-recommend');

      if (ratingEl) ratingEl.textContent = predictedRating.toFixed(2) + ' / 5.0';
      if (statusEl) {
        if (currentLoadValue > 15) {
          statusEl.textContent = 'Heavy Overload';
          statusEl.className = 'badge text-[0.65rem] py-0.5 px-2 font-mono bg-brand-accent-ruby/20 text-brand-accent-ruby';
        } else if (currentLoadValue < 6) {
          statusEl.textContent = 'Under-utilized';
          statusEl.className = 'badge text-[0.65rem] py-0.5 px-2 font-mono bg-brand-accent-cyan/20 text-brand-accent-cyan';
        } else {
          statusEl.textContent = 'Optimal Load';
          statusEl.className = 'badge text-[0.65rem] py-0.5 px-2 font-mono bg-brand-accent-emerald/20 text-brand-accent-emerald';
        }
      }
      if (recEl) {
        recEl.textContent = fac.designation === 'Professor' ? '12 hrs / wk' : '15 hrs / wk';
      }
    } catch (err) {
      console.error('TF Faculty optimizer failed:', err);
    }
  }

  function openAddFacultyModal() {
    const bodyHTML = `
      <form id="add-faculty-form" class="max-h-[60vh] overflow-y-auto pr-2">
        <div class="form-group">
          <label class="form-label">Full Name *</label>
          <input type="text" class="form-control" id="add-fac-name" required placeholder="e.g. Dr. Ada Lovelace">
        </div>
        <div class="form-group">
          <label class="form-label">Email Address *</label>
          <input type="email" class="form-control" id="add-fac-email" required placeholder="e.g. ada@modeluni.edu">
        </div>
        <div class="grid-2">
          <div class="form-group">
            <label class="form-label">Department *</label>
            <select class="form-control" id="add-fac-dept">
              <option value="CS">Computer Science</option>
              <option value="EE">Electrical Engineering</option>
              <option value="ME">Mechanical Engineering</option>
              <option value="BI">Bioinformatics</option>
              <option value="BA">Business Administration</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Designation *</label>
            <select class="form-control" id="add-fac-designation">
              <option>Professor</option>
              <option>Associate Professor</option>
              <option>Assistant Professor</option>
              <option>Lecturer</option>
              <option>Research Fellow</option>
            </select>
          </div>
        </div>
        <div class="grid-2">
          <div class="form-group">
            <label class="form-label">Initial Workload (Hours/Week)</label>
            <input type="number" class="form-control" id="add-fac-workload" min="0" max="24" value="12">
          </div>
          <div class="form-group">
            <label class="form-label">Phone Number</label>
            <input type="text" class="form-control" id="add-fac-phone" placeholder="+1-555-0199">
          </div>
        </div>
        <div class="grid-2">
          <div class="form-group">
            <label class="form-label">Date of Joining</label>
            <input type="date" class="form-control" id="add-fac-joining" value="2026-06-09">
          </div>
          <div class="form-group">
            <label class="form-label">Profile Image URL</label>
            <input type="text" class="form-control" id="add-fac-avatar" value="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150">
          </div>
        </div>
        <div class="form-group">
          <label class="form-label">Academic Biography & Research Brief</label>
          <textarea class="form-control" id="add-fac-bio" rows="3" placeholder="Brief details about academic background and research focus areas..."></textarea>
        </div>
      </form>
    `;

    const footerHTML = `
      <button class="btn btn-secondary" onclick="window.App.closeModal()">Cancel</button>
      <button class="btn btn-primary" id="btn-submit-faculty">Add Member</button>
    `;

    window.App.showModal('Add Faculty Member', bodyHTML, footerHTML);

    document.getElementById('btn-submit-faculty').addEventListener('click', () => {
      const name = document.getElementById('add-fac-name').value.trim();
      const email = document.getElementById('add-fac-email').value.trim();
      const dept = document.getElementById('add-fac-dept').value;
      const designation = document.getElementById('add-fac-designation').value;
      const workload = parseInt(document.getElementById('add-fac-workload').value) || 12;
      const phone = document.getElementById('add-fac-phone').value.trim();
      const joining = document.getElementById('add-fac-joining').value;
      const avatar = document.getElementById('add-fac-avatar').value.trim();
      const bio = document.getElementById('add-fac-bio').value.trim();

      if (!name || !email) {
        alert("Please enter both name and email.");
        return;
      }

      const facultyList = window.UniversityDB.getFaculty();
      const newId = 'FAC' + String(facultyList.length + 1).padStart(3, '0');

      const newFac = {
        id: newId,
        name: name,
        email: email,
        dept: dept,
        designation: designation,
        workload: workload,
        courses: [],
        avatar: avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
        phone: phone,
        joiningDate: joining,
        bio: bio
      };

      facultyList.push(newFac);
      window.App.closeModal();
      alert(`Faculty member ${name} enrolled with ID ${newId}`);
      applySearch();
    });
  }

  return {
    render: render,
    applySearch: applySearch,
    openAssignClassModal: openAssignClassModal
  };

})();
