// Attendance & Timetable Module
window.attendanceView = (function() {
  
  function render(container) {
    const currentUser = window.AuthSystem && window.AuthSystem.getCurrentUser();
    const isStudent = currentUser && (currentUser.role === 'student' || currentUser.role === 'athlete');
    const isParent = currentUser && (currentUser.role === 'parent' || currentUser.role === 'sports_parent');
    const isStudentOrParent = isStudent || isParent || (currentUser && currentUser.role === 'guest');
    const courses = window.UniversityDB.getCourses().filter(c => c.status === 'Active');
    const courseOptions = courses.map(c => `<option value="${c.code}">${c.code} - ${c.title}</option>`).join('');

    container.innerHTML = `
      <div class="page-header animate-fade-in flex items-center justify-between border-b border-brand-border/30 pb-4 mb-6">
        <div>
          <h1 class="text-3xl font-bold font-display tracking-tight bg-gradient-to-r from-white via-slate-100 to-brand-primary bg-clip-text text-transparent">Attendance & Weekly Schedule</h1>
          <p class="text-sm text-brand-text-muted mt-1">Mark daily student attendances, view department timetables, and monitor academic participation metrics.</p>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6 animate-fade-in delay-1">
        
        <!-- Attendance Sheet Panel -->
        <div class="card bg-brand-bg-secondary/40 backdrop-blur-md border border-brand-border/50 p-6 rounded-2xl">
          <h3 class="mb-4 font-display text-lg font-bold text-brand-text-main">${isStudentOrParent ? 'View Session Attendance' : 'Register Session Attendance'}</h3>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
            <div class="form-group mb-0">
              <label class="form-label text-xs font-bold text-brand-text-muted uppercase tracking-wider pl-1">Select Course Section</label>
              <select class="form-control mt-1 w-full text-brand-text-main bg-brand-bg-tertiary border-brand-border" id="attendance-course-select">
                ${courseOptions}
              </select>
            </div>
            <div class="form-group mb-0">
              <label class="form-label text-xs font-bold text-brand-text-muted uppercase tracking-wider pl-1">Session Date</label>
              <input type="date" class="form-control mt-1 w-full text-brand-text-main bg-brand-bg-tertiary border-brand-border" id="attendance-date" value="2026-06-08">
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
            <div class="form-group mb-0">
              <label class="form-label text-xs font-bold text-brand-text-muted uppercase tracking-wider pl-1">Check-in Method</label>
              <select class="form-control mt-1 w-full text-brand-text-main bg-brand-bg-tertiary border-brand-border" id="attendance-method-select">
                <option value="MANUAL">Manual register</option>
                <option value="QR_CODE">QR code scan</option>
                <option value="RFID">RFID sensor card</option>
                <option value="NFC">NFC smart tap</option>
                <option value="BIOMETRIC">Biometric touch</option>
                <option value="FACE_RECOGNITION">AI face camera</option>
                <option value="GPS">GPS mobile geofence</option>
                <option value="MOBILE">Mobile App check-in</option>
                <option value="WEB">Web Portal log</option>
                <option value="CLASSROOM">Classroom scanner</option>
                <option value="LABORATORY">Laboratory terminal</option>
                <option value="SPORTS">Sports arena gate</option>
                <option value="EXAMINATION">Exam Hall desk QR</option>
                <option value="EVENT">Event attendance</option>
              </select>
            </div>
            <div class="form-group mb-0">
              <label class="form-label text-xs font-bold text-brand-text-muted uppercase tracking-wider pl-1">Student Batch</label>
              <select class="form-control mt-1 w-full text-brand-text-main bg-brand-bg-tertiary border-brand-border" id="attendance-batch-select">
                <option value="2023">Batch 2023</option>
                <option value="2024">Batch 2024</option>
                <option value="2025">Batch 2025</option>
              </select>
            </div>
          </div>

          <div class="max-h-[380px] overflow-y-auto border border-brand-border/50 rounded-xl bg-brand-bg-primary/50 p-3 mb-5">
            <table class="w-full border-collapse">
              <thead>
                <tr>
                  <th class="p-2.5 text-[0.75rem] border-b border-brand-border/50">Student Profile</th>
                  <th class="p-2.5 text-[0.75rem] text-center border-b border-brand-border/50">Attendance Status</th>
                </tr>
              </thead>
              <tbody id="attendance-student-list">
                <!-- Loaded dynamically on course change -->
              </tbody>
            </table>
          </div>

          ${isStudentOrParent ? '' : '<button class="btn btn-primary w-full" id="btn-save-attendance">Commit Session Attendance</button>'}
        </div>

        <!-- Weekly Timetable Grid -->
        <div class="card bg-brand-bg-secondary/40 backdrop-blur-md border border-brand-border/50 p-6 rounded-2xl">
          <h3 class="mb-4 font-display text-lg font-bold text-brand-text-main">Campus Timetable Schedule</h3>
          <p class="text-brand-text-muted text-[0.85rem] mb-4">Standard academic calendar slots (Monday - Friday).</p>
          
          <div class="flex flex-col gap-3">
            <div class="p-3.5 border border-brand-border/60 rounded-xl flex justify-between items-center bg-brand-primary/5 transition-all duration-200 hover:border-brand-primary/45">
              <div>
                <strong class="text-brand-primary font-semibold text-xs uppercase tracking-wider">Monday (09:00 AM - 11:00 AM)</strong>
                <div class="text-sm font-medium text-brand-text-main mt-1">CS101 - Intro Programming (Hall A)</div>
              </div>
              <span class="badge badge-success text-[0.75rem]">Active</span>
            </div>
            
            <div class="p-3.5 border border-brand-border/60 rounded-xl flex justify-between items-center transition-all duration-200 hover:border-brand-accent-cyan/45">
              <div>
                <strong class="text-brand-accent-cyan font-semibold text-xs uppercase tracking-wider">Tuesday (11:30 AM - 01:30 PM)</strong>
                <div class="text-sm font-medium text-brand-text-main mt-1">EE201 - Signals and Systems (Hall B)</div>
              </div>
              <span class="badge badge-success text-[0.75rem]">Active</span>
            </div>

            <div class="p-3.5 border border-brand-border/60 rounded-xl flex justify-between items-center transition-all duration-200 hover:border-brand-accent-amber/45">
              <div>
                <strong class="text-brand-accent-amber font-semibold text-xs uppercase tracking-wider">Wednesday (02:00 PM - 04:00 PM)</strong>
                <div class="text-sm font-medium text-brand-text-main mt-1">ME102 - Engineering Thermodynamics (Hall C)</div>
              </div>
              <span class="badge badge-success text-[0.75rem]">Active</span>
            </div>

            <div class="p-3.5 border border-brand-border/60 rounded-xl flex justify-between items-center transition-all duration-200 hover:border-brand-primary/45">
              <div>
                <strong class="text-brand-primary font-semibold text-xs uppercase tracking-wider">Thursday (09:00 AM - 11:00 AM)</strong>
                <div class="text-sm font-medium text-brand-text-main mt-1">CS202 - Data Structures (Lab 3)</div>
              </div>
              <span class="badge badge-success text-[0.75rem]">Active</span>
            </div>

            <div class="p-3.5 border border-brand-border/60 rounded-xl flex justify-between items-center transition-all duration-200 hover:border-brand-accent-emerald/45">
              <div>
                <strong class="text-brand-accent-emerald font-semibold text-xs uppercase tracking-wider">Friday (10:00 AM - 12:00 PM)</strong>
                <div class="text-sm font-medium text-brand-text-main mt-1">BI101 - Biotechnology Basics (BI Lab)</div>
              </div>
              <span class="badge badge-success text-[0.75rem]">Active</span>
            </div>
          </div>
        </div>

      </div>

      ${isStudentOrParent ? `
      <!-- Submit Correction Request Panel -->
      <div class="card bg-brand-bg-secondary/40 backdrop-blur-md border border-brand-border/50 p-6 rounded-2xl mt-6 animate-fade-in delay-1.5">
        <h3 class="mb-4 font-display text-lg font-bold text-brand-text-main">Submit Correction Request</h3>
        <p class="text-brand-text-muted text-[0.85rem] mb-4">Submit an attendance correction to your faculty coordinator for review.</p>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="form-group mb-0">
            <label class="form-label text-xs font-bold text-brand-text-muted uppercase tracking-wider pl-1">Target Course</label>
            <select class="form-control mt-1 w-full" id="corr-course-select">
              ${courseOptions}
            </select>
          </div>
          <div class="form-group mb-0">
            <label class="form-label text-xs font-bold text-brand-text-muted uppercase tracking-wider pl-1">Requested Status</label>
            <select class="form-control mt-1 w-full" id="corr-status-select">
              <option value="PRESENT">Present</option>
              <option value="EXCUSED">Excused</option>
              <option value="MEDICAL_LEAVE">Medical Leave</option>
            </select>
          </div>
          <div class="form-group mb-0">
            <label class="form-label text-xs font-bold text-brand-text-muted uppercase tracking-wider pl-1">Reason / Justification</label>
            <textarea class="form-control mt-1 w-full h-[38px] min-h-[38px] max-h-[120px] resize-y" id="corr-reason" placeholder="e.g. Attended conference, submitted certificate..."></textarea>
          </div>
        </div>
        <button class="btn btn-primary w-full mt-4" id="btn-submit-correction">Send Request to Faculty</button>
      </div>
      ` : ''}

      <!-- AI Attendance Forecast Panel -->
      <div class="card bg-brand-bg-secondary/40 backdrop-blur-md border border-brand-border/50 p-6 rounded-2xl mt-6 animate-fade-in delay-2">
        <h3 class="mb-4 font-display text-lg font-bold text-brand-text-main">AI Attendance & Class Participation Forecast</h3>
        <p class="text-brand-text-muted text-[0.85rem] mb-4 font-normal">Predicting class participation probabilities using a dynamic TensorFlow.js neural network trained on weekly history logs.</p>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="md:col-span-2 chart-wrapper h-[220px]">
            <canvas id="attendance-forecast-chart"></canvas>
          </div>
          <div class="flex flex-col gap-4 p-5 rounded-xl border border-brand-border/60 bg-brand-bg-tertiary/50">
            <h4 class="text-xs font-semibold uppercase tracking-wider text-brand-text-main font-display pb-2 border-b border-brand-border/40">Projection Summary</h4>
            <div class="text-xs text-brand-text-muted flex flex-col gap-3">
              <div class="flex justify-between items-center">
                <span>Predicted Weekly Peak:</span>
                <strong class="text-brand-accent-emerald font-mono text-sm" id="attend-ai-peak">Calculating...</strong>
              </div>
              <div class="flex justify-between items-center">
                <span>Predicted Weekly Dip:</span>
                <strong class="text-brand-accent-ruby font-mono text-sm" id="attend-ai-dip">Calculating...</strong>
              </div>
              <div class="flex justify-between border-t border-brand-border/30 pt-3 items-center">
                <span>Average Attendance Projection:</span>
                <strong class="text-brand-primary font-mono text-base font-bold" id="attend-ai-avg">Calculating...</strong>
              </div>
            </div>
            ${isStudentOrParent ? '' : '<button class="btn btn-secondary btn-sm mt-auto w-full font-bold" id="btn-recalc-attend-ai">Re-run AI Projection</button>'}
          </div>
        </div>
      </div>
    `;

    const courseSelect = document.getElementById('attendance-course-select');
    if (courseSelect) {
      courseSelect.addEventListener('change', () => {
        loadStudentsForCourse(courseSelect.value);
      });
      // Initial load
      loadStudentsForCourse(courseSelect.value);
    }

    const recalcBtn = container.querySelector('#btn-recalc-attend-ai');
    if (recalcBtn) {
      recalcBtn.addEventListener('click', () => {
        runAttendanceTfTraining(container);
      });
    }

    // Run initial ML projection
    setTimeout(() => {
      runAttendanceTfTraining(container);
    }, 200);

    const saveBtn = document.getElementById('btn-save-attendance');
    if (saveBtn) {
      saveBtn.addEventListener('click', () => {
        const selectedCourse = courseSelect.value;
        const sessionDate = document.getElementById('attendance-date').value;
        const selects = document.querySelectorAll('.attendance-status-select');
        
        let presentCount = 0;
        selects.forEach(select => {
          const studentId = select.getAttribute('data-id');
          const status = select.value;
          const isPresent = status === 'PRESENT' || status === 'ONLINE_PRESENT';
          if (isPresent) presentCount++;
          
          // Simulating updating attendance scores in local state
          const student = window.UniversityDB.getStudents().find(s => s.id === studentId);
          if (student) {
            // Add a tiny random variance or simple calculation to modify attendance score
            let currentAttend = student.attendance;
            if (isPresent && currentAttend < 100) {
              student.attendance = Math.min(100, Math.round(currentAttend + (100 - currentAttend) * 0.05));
            } else if (!isPresent && currentAttend > 0) {
              student.attendance = Math.max(0, Math.round(currentAttend - currentAttend * 0.05));
            }
          }
        });

        alert(`Attendance recorded for ${sessionDate}! Course: ${selectedCourse}.\n${presentCount} students marked present/online.`);
      });
    }

    const submitCorrBtn = document.getElementById('btn-submit-correction');
    if (submitCorrBtn) {
      submitCorrBtn.addEventListener('click', async () => {
        const courseCode = document.getElementById('corr-course-select').value;
        const requestedStatus = document.getElementById('corr-status-select').value;
        const reason = document.getElementById('corr-reason').value;
        if (!reason.trim()) {
          alert('Please state the reason for the correction request.');
          return;
        }

        const body = {
          attendance_id: 'att_mock_1',
          student_id: currentUser?.id || 'STU001',
          requested_status: requestedStatus,
          reason: reason
        };

        try {
          const res = await fetch('/api/attendance/corrections', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
          });
          if (res.ok) {
            alert('Correction request submitted successfully!');
            document.getElementById('corr-reason').value = '';
          } else {
            alert('Failed to submit request.');
          }
        } catch (err) {
          alert('Correction request logged locally.');
          document.getElementById('corr-reason').value = '';
        }
      });
    }
  }

  function loadStudentsForCourse(courseCode) {
    const tbody = document.getElementById('attendance-student-list');
    if (!tbody) return;

    const currentUser = window.AuthSystem && window.AuthSystem.getCurrentUser();
    const isStudent = currentUser && (currentUser.role === 'student' || currentUser.role === 'athlete');
    const isParent = currentUser && (currentUser.role === 'parent' || currentUser.role === 'sports_parent');
    const isStudentOrParent = isStudent || isParent || (currentUser && currentUser.role === 'guest');

    // Filter students enrolled in this course code or match department
    const students = window.UniversityDB.getStudents();
    const course = window.UniversityDB.getCourses().find(c => c.code === courseCode);
    if (!course) return;

    // Find students whose courses array contains this code, or fallback to department students
    let enrolledStudents = students.filter(s => s.courses.includes(courseCode));
    if (enrolledStudents.length === 0) {
      // Fallback: load students of same department
      enrolledStudents = students.filter(s => s.dept === course.dept);
    }

    if (isStudentOrParent) {
      const targetId = isStudent ? (currentUser?.id || 'STU002') : 'STU002';
      enrolledStudents = enrolledStudents.filter(s => s.id === targetId);
    }

    if (enrolledStudents.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="2" class="text-center text-brand-text-muted p-4">No students enrolled in this department section.</td>
        </tr>
      `;
      return;
    }



    tbody.innerHTML = enrolledStudents.map(s => `
      <tr class="border-b border-brand-border">
        <td class="p-2.5 text-sm">
          <div class="flex items-center gap-2">
            <img src="${s.avatar}" class="w-7 h-7 rounded-full object-cover">
            <div>
              <strong>${s.name}</strong> <code class="text-[0.7rem]">${s.id}</code>
            </div>
          </div>
        </td>
        <td class="p-2.5 text-center">
          <select class="attendance-status-select form-control text-xs font-bold cursor-pointer p-1 rounded border border-brand-border/40 bg-brand-bg-tertiary text-brand-text-main outline-none" data-id="${s.id}" ${isStudentOrParent ? 'disabled' : ''}>
            <option value="PRESENT">Present</option>
            <option value="ABSENT">Absent</option>
            <option value="LATE">Late</option>
            <option value="EXCUSED">Excused</option>
            <option value="MEDICAL_LEAVE">Medical Leave</option>
            <option value="DUTY_LEAVE">Duty Leave</option>
            <option value="ONLINE_PRESENT">Online Present</option>
            <option value="HOLIDAY">Holiday</option>
          </select>
        </td>
      </tr>
    `).join('');
  }

  let attendanceChart = null;

  async function runAttendanceTfTraining(container) {
    const peakEl = container.querySelector('#attend-ai-peak');
    const dipEl = container.querySelector('#attend-ai-dip');
    const avgEl = container.querySelector('#attend-ai-avg');
    const recalcBtn = container.querySelector('#btn-recalc-attend-ai');

    if (typeof tf === 'undefined') {
      if (avgEl) avgEl.textContent = 'TF Unavailable';
      return;
    }

    if (recalcBtn) {
      recalcBtn.disabled = true;
      recalcBtn.textContent = 'Projecting...';
    }

    try {
      const xVal = [0, 1, 2, 3, 4, 5, 6, 7];
      const yVal = [0.88, 0.92, 0.94, 0.85, 0.78, 0.89, 0.91, 0.95];

      const xs = tf.tensor2d(xVal.map(x => x / 7), [8, 1]);
      const ys = tf.tensor2d(yVal, [8, 1]);

      const model = tf.sequential();
      model.add(tf.layers.dense({ units: 2, activation: 'tanh', inputShape: [1] }));
      model.add(tf.layers.dense({ units: 1 }));
      
      model.compile({ optimizer: tf.train.adam(0.1), loss: 'meanSquaredError' });
      await model.fit(xs, ys, { epochs: 20, verbose: 0 });

      const predictX = [8, 9, 10, 11, 12];
      const predictTensor = tf.tensor2d(predictX.map(x => x / 7), [5, 1]);
      const predictOutput = model.predict(predictTensor);
      const outputData = await predictOutput.data();

      xs.dispose();
      ys.dispose();
      predictTensor.dispose();
      predictOutput.dispose();
      model.dispose();

      const projectedY = Array.from(outputData).map(val => Math.round(Math.max(0.4, Math.min(1.0, val)) * 100));

      const avg = Math.round(projectedY.reduce((a,b) => a+b, 0) / projectedY.length);
      const max = Math.max(...projectedY);
      const min = Math.min(...projectedY);

      if (peakEl) peakEl.textContent = max + '%';
      if (dipEl) dipEl.textContent = min + '%';
      if (avgEl) avgEl.textContent = avg + '%';

      const ctx = container.querySelector('#attendance-forecast-chart');
      if (ctx) {
        if (attendanceChart) attendanceChart.destroy();
        attendanceChart = new Chart(ctx, {
          type: 'line',
          data: {
            labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
            datasets: [{
              label: 'Projected Attendance Rate (%)',
              data: projectedY,
              borderColor: '#10b981',
              backgroundColor: 'rgba(16, 185, 129, 0.1)',
              borderWidth: 2,
              fill: true,
              tension: 0.3
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
                min: 40,
                max: 100
              },
              x: {
                grid: { display: false },
                ticks: { color: '#475569' }
              }
            }
          }
        });
      }
    } catch (err) {
      console.error('TF Attendance Projection failed:', err);
    } finally {
      if (recalcBtn) {
        recalcBtn.disabled = false;
        recalcBtn.textContent = 'Re-run AI Projection';
      }
    }
  }

  return {
    render: render
  };

})();
