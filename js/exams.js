// Exams & Grades Module
window.examsView = (function() {
  
  function render(container) {
    const exams = window.UniversityDB.getExams();
    const students = window.UniversityDB.getStudents();
    const courses = window.UniversityDB.getCourses();

    container.innerHTML = `
      <div class="page-header animate-fade-in flex items-center justify-between border-b border-brand-border/30 pb-4 mb-6">
        <div>
          <h1 class="text-3xl font-bold font-display tracking-tight bg-gradient-to-r from-white via-slate-100 to-brand-primary bg-clip-text text-transparent">Exams & Academic Grading</h1>
          <p class="text-sm text-brand-text-muted mt-1">Schedule term exams, verify student transcripts, compute GPAs, and input course evaluations.</p>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6 animate-fade-in delay-1">
        
        <!-- Exam Schedules list -->
        <div class="card bg-brand-bg-secondary/40 backdrop-blur-md border border-brand-border/50 p-6 rounded-2xl">
          <h3 class="mb-4 font-display text-lg font-bold text-brand-text-main">Upcoming Examinations</h3>
          <div class="flex flex-col gap-3">
            ${exams.map(ex => {
              const c = courses.find(course => course.code === ex.code);
              return `
                <div class="p-4 border border-brand-border/60 rounded-xl bg-brand-bg-tertiary/40 flex justify-between items-center transition-all duration-200 hover:translate-x-1 hover:border-brand-primary/30 hover:bg-brand-primary/5">
                  <div>
                    <code class="text-brand-primary font-bold text-sm uppercase tracking-wider">${ex.code}</code>
                    <h4 class="mt-1 mb-1 font-display font-medium text-brand-text-main">${ex.name}</h4>
                    <span class="text-xs text-brand-text-muted font-medium">${ex.date} @ ${ex.time}</span>
                  </div>
                  <div class="text-right">
                    <span class="badge badge-info text-[0.75rem] font-semibold">${ex.venue}</span>
                    <div class="text-[0.75rem] text-brand-text-subtle font-mono mt-1">${c ? c.credits : 3} Credits</div>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>

        <!-- Transcript Workspace Panel -->
        <div class="card bg-brand-bg-secondary/40 backdrop-blur-md border border-brand-border/50 p-6 rounded-2xl">
          <h3 class="mb-4 font-display text-lg font-bold text-brand-text-main">Official Transcript Workspace</h3>
          <p class="text-brand-text-muted text-xs mb-5">Select a student record below to query their official term grade ledger.</p>
          
          <div class="form-group">
            <label class="form-label text-xs font-bold text-brand-text-muted uppercase tracking-wider pl-1">Search Student Profile</label>
            <select class="form-control mt-1 w-full" id="transcript-student-select">
              ${students.map(s => `<option value="${s.id}">${s.id} - ${s.name} (${s.dept})</option>`).join('')}
            </select>
          </div>

          <div id="transcript-sheet-body" class="p-5 border border-dashed border-brand-border/60 rounded-xl bg-white/[0.01] mt-5">
            <!-- Loaded dynamically on select -->
          </div>
        </div>

      </div>

      <!-- Quick Grade Entry System Card -->
      <div class="card bg-brand-bg-secondary/40 backdrop-blur-md border border-brand-border/50 p-6 rounded-2xl animate-fade-in delay-2 mt-6">
        <h3 class="mb-2 font-display text-lg font-semibold text-brand-text-main">Interactive Term Grade Entry</h3>
        <p class="text-brand-text-muted text-sm mb-5 font-normal">Input raw assessment scores (0-100) to update on-chain and off-chain student registries.</p>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
          <div class="form-group mb-0">
            <label class="form-label text-xs font-bold text-brand-text-muted uppercase tracking-wider pl-1">Subject Code</label>
            <select class="form-control mt-1 w-full" id="grade-course-select">
              ${courses.map(c => `<option value="${c.code}">${c.code} - ${c.title}</option>`).join('')}
            </select>
          </div>
          <div class="form-group mb-0">
            <label class="form-label text-xs font-bold text-brand-text-muted uppercase tracking-wider pl-1">Selected Student</label>
            <select class="form-control mt-1 w-full" id="grade-student-select">
              ${students.map(s => `<option value="${s.id}">${s.name}</option>`).join('')}
            </select>
          </div>
          <div class="form-group mb-0 flex flex-row gap-3">
            <div class="flex-1">
              <label class="form-label text-xs font-bold text-brand-text-muted uppercase tracking-wider pl-1">Term Score</label>
              <input type="number" class="form-control mt-1 w-full" id="grade-score" min="0" max="100" value="85">
            </div>
            <button class="btn btn-primary h-[42px] px-6 shrink-0" id="btn-submit-grade">Submit Grade</button>
          </div>
        </div>
      </div>
    `;

    const transSelect = document.getElementById('transcript-student-select');
    if (transSelect) {
      transSelect.addEventListener('change', () => {
        generateTranscriptView(transSelect.value);
      });
      // Initial load
      generateTranscriptView(transSelect.value);
    }

    document.getElementById('btn-submit-grade').addEventListener('click', () => {
      const courseCode = document.getElementById('grade-course-select').value;
      const studentId = document.getElementById('grade-student-select').value;
      const score = parseInt(document.getElementById('grade-score').value);

      if (isNaN(score) || score < 0 || score > 100) {
        alert("Please enter a valid final assessment score between 0 and 100.");
        return;
      }

      // Convert score to grade points
      let grade = 'F';
      let gpaDelta = 0.0;
      if (score >= 90) { grade = 'A+'; gpaDelta = 4.0; }
      else if (score >= 80) { grade = 'A'; gpaDelta = 3.7; }
      else if (score >= 70) { grade = 'B'; gpaDelta = 3.0; }
      else if (score >= 60) { grade = 'C'; gpaDelta = 2.0; }
      else if (score >= 50) { grade = 'D'; gpaDelta = 1.0; }

      // Update student grade simulator
      const stu = window.UniversityDB.getStudents().find(s => s.id === studentId);
      if (stu) {
        // Adjust GPA slightly towards the new grade
        stu.gpa = Math.min(4.0, parseFloat(((stu.gpa * 0.8) + (gpaDelta * 0.2)).toFixed(2)));
        alert(`Grade updated for ${stu.name}!\nCourse: ${courseCode} | Score: ${score}% | Grade: ${grade}.\nNew cumulative GPA computed: ${stu.gpa}`);
        
        // Refresh transcript views if the same student was selected
        if (transSelect.value === studentId) {
          generateTranscriptView(studentId);
        }
      }
    });
  }

  function generateTranscriptView(studentId) {
    const container = document.getElementById('transcript-sheet-body');
    if (!container) return;

    const stu = window.UniversityDB.getStudents().find(s => s.id === studentId);
    if (!stu) {
      container.innerHTML = `<span class="text-brand-text-muted">Select a valid student profile ID.</span>`;
      return;
    }

    // Mock academic course grades
    const grades = [
      { code: stu.courses[0] || 'CS101', title: 'Intro Programming', grade: 'A', credits: 4 },
      { code: stu.courses[1] || 'CS302', title: 'Database Systems', grade: 'A+', credits: 3 },
      { code: stu.courses[2] || 'CS305', title: 'Software Engineering', grade: 'B', credits: 3 }
    ];

    container.innerHTML = `
      <div class="flex justify-between items-center mb-4 pb-2 border-b border-brand-border/30">
        <span class="font-bold font-display text-base text-brand-text-main">${stu.name}</span>
        <code class="text-xs bg-brand-primary/10 border border-brand-primary/20 text-brand-primary font-bold px-2 py-0.5 rounded">CGPA: ${stu.gpa.toFixed(2)}</code>
      </div>
      <table class="w-full border-collapse text-[0.825rem]">
        <thead>
          <tr class="border-b border-brand-border/60">
            <th class="py-2 px-0 text-left text-brand-text-muted bg-transparent border-b-0 uppercase tracking-wider text-[10px]">Subject Stream</th>
            <th class="py-2 px-0 text-center text-brand-text-muted bg-transparent border-b-0 uppercase tracking-wider text-[10px]">Credits</th>
            <th class="py-2 px-0 text-right text-brand-text-muted bg-transparent border-b-0 uppercase tracking-wider text-[10px]">Grade</th>
          </tr>
        </thead>
        <tbody>
          ${grades.map(g => `
            <tr class="border-b border-dashed border-brand-border/40 hover:bg-white/[0.01]">
              <td class="py-2.5 px-0 border-b-0 font-medium text-brand-text-main"><code>${g.code}</code> - ${g.title}</td>
              <td class="py-2.5 px-0 text-center border-b-0 text-brand-text-muted font-mono">${g.credits}</td>
              <td class="py-2.5 px-0 text-right font-bold text-brand-primary border-b-0">${g.grade}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
      <div class="mt-4 text-right">
        <button class="btn btn-secondary btn-sm font-semibold" onclick="alert('Sending digital transcript via Secure email...')">Email Transcript PDF</button>
      </div>

      <!-- AI Grade Outcome Predictor -->
      <div class="card mt-5 p-4 bg-brand-bg-tertiary border border-brand-border/60">
        <div class="flex items-center justify-between mb-3 pb-2 border-b border-brand-border/40">
          <div class="flex items-center gap-2">
            <span class="w-2.5 h-2.5 rounded-full bg-brand-accent-cyan animate-pulse"></span>
            <span class="text-xs font-bold uppercase tracking-wider text-brand-text-main font-display">AI Grade Predictor</span>
          </div>
          <span class="badge text-[0.65rem] py-0.5 px-2 font-mono bg-brand-accent-emerald/20 text-brand-accent-emerald" id="exam-ai-outcome-status">Calculating...</span>
        </div>
        <div class="grid grid-cols-2 gap-3 text-xs text-brand-text-muted">
          <div>
            <span class="text-[0.7rem] text-brand-text-subtle">Predicted Final Grade:</span>
            <div class="font-bold text-brand-text-main font-mono text-sm mt-0.5" id="exam-ai-grade">Calculating...</div>
          </div>
          <div>
            <span class="text-[0.7rem] text-brand-text-subtle">Graduation Fail Probability:</span>
            <div class="font-bold text-brand-text-main font-mono text-sm mt-0.5" id="exam-ai-fail-pct">Calculating...</div>
          </div>
        </div>
      </div>
    `;
    runExamTfInference(stu);
  }

  async function runExamTfInference(stu) {
    if (typeof tf === 'undefined') {
      const el = document.getElementById('exam-ai-grade');
      if (el) el.textContent = 'TF Unavailable';
      return;
    }
    try {
      const inputVal = [stu.gpa / 4.0, stu.attendance / 100.0, stu.semester / 8.0];
      const model = tf.sequential();
      model.add(tf.layers.dense({ units: 3, activation: 'sigmoid', inputShape: [3] }));
      model.add(tf.layers.dense({ units: 2 }));

      const w1 = tf.tensor2d([
        [2.0, 1.5],
        [1.5, 2.0],
        [-0.5, -0.2]
      ]);
      const b1 = tf.tensor1d([0.5, 0.2]);
      model.layers[1].setWeights([w1, b1]);

      const inputTensor = tf.tensor2d([inputVal], [1, 3]);
      const outputTensor = model.predict(inputTensor);
      const outputVal = await outputTensor.data();

      const passScore = outputVal[0];
      const gradeScore = outputVal[1];

      var failProb = Math.max(0.01, Math.min(0.99, 1.0 - (1.0 / (1.0 + Math.exp(-passScore)))));
      var gradeIndex = Math.max(0, Math.min(4, Math.floor(gradeScore * 5)));
      const gradeBands = ['F', 'C', 'B', 'A', 'A+'];
      var predictedGrade = gradeBands[gradeIndex];

      if (stu.gpa < 2.0) {
        predictedGrade = 'D';
        failProb = Math.max(failProb, 0.45);
      }
      if (stu.attendance < 65) {
        predictedGrade = 'F';
        failProb = Math.max(failProb, 0.85);
      }
      if (stu.gpa >= 3.7) {
        predictedGrade = 'A+';
        failProb = 0.01;
      }

      inputTensor.dispose();
      outputTensor.dispose();
      w1.dispose();
      b1.dispose();
      model.dispose();

      const gradeEl = document.getElementById('exam-ai-grade');
      const failEl = document.getElementById('exam-ai-fail-pct');
      const statusEl = document.getElementById('exam-ai-outcome-status');

      if (gradeEl) gradeEl.textContent = predictedGrade;
      if (failEl) failEl.textContent = (failProb * 100).toFixed(1) + '%';
      if (statusEl) {
        if (failProb > 0.4) {
          statusEl.textContent = 'High Academic Risk';
          statusEl.className = 'badge text-[0.65rem] py-0.5 px-2 font-mono bg-brand-accent-ruby/20 text-brand-accent-ruby';
        } else if (failProb > 0.1) {
          statusEl.textContent = 'Passing (Review Required)';
          statusEl.className = 'badge text-[0.65rem] py-0.5 px-2 font-mono bg-brand-accent-amber/20 text-brand-accent-amber';
        } else {
          statusEl.textContent = 'Excellent Standing';
          statusEl.className = 'badge text-[0.65rem] py-0.5 px-2 font-mono bg-brand-accent-emerald/20 text-brand-accent-emerald';
        }
      }
    } catch (err) {
      console.error('TF Exam inference failed:', err);
    }
  }

  return {
    render: render
  };

})();
