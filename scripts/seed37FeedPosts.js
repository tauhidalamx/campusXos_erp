const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const { adminDb } = require('../lib/firebaseAdmin');

const dbPath = path.resolve(__dirname, '../database.sqlite');
const db = new sqlite3.Database(dbPath);

const demoUsers = [
  { id: 'usr_001', name: 'Dr. Raymond Park', email: 'raymond.park@campusx.edu', password: 'password123', role: 'faculty', department: 'Computer Science', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150' },
  { id: 'usr_002', name: 'Dr. Evelyn Sterling', email: 'evelyn.sterling@campusx.edu', password: 'password123', role: 'faculty', department: 'Physics & Quantum Lab', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150' },
  { id: 'usr_003', name: 'Prof. Alan Turing', email: 'alan.turing@campusx.edu', password: 'password123', role: 'faculty', department: 'AI Research Group', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150' },
  { id: 'usr_004', name: 'Dr. Marcus Chen', email: 'marcus.chen@campusx.edu', password: 'password123', role: 'faculty', department: 'Robotics & Automation', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150' },
  { id: 'usr_005', name: 'Carlos Mendez', email: 'carlos.mendez@campusx.edu', password: 'password123', role: 'student', department: 'Electrical Eng', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150' },
  { id: 'usr_006', name: 'Aria Nakamura', email: 'aria.nakamura@campusx.edu', password: 'password123', role: 'student', department: 'Computer Science', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150' },
  { id: 'usr_007', name: 'Alex Rivera', email: 'alex.rivera@campusx.edu', password: 'password123', role: 'student', department: 'Computer Science', avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150' },
  { id: 'usr_008', name: 'Sarah Jenkins', email: 'sarah.jenkins@campusx.edu', password: 'password123', role: 'admin', department: 'Registrar & Student Affairs', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150' },
  { id: 'usr_009', name: 'Maya Lin', email: 'maya.lin@campusx.edu', password: 'password123', role: 'student', department: 'Biotechnology', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150' },
  { id: 'usr_010', name: 'Viktor Vance', email: 'viktor.vance@campusx.edu', password: 'password123', role: 'student', department: 'Mechanical Eng', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150' },
  { id: 'usr_011', name: 'Sophia Rodriguez', email: 'sophia.rodriguez@campusx.edu', password: 'password123', role: 'student', department: 'Architecture & Design', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150' },
  { id: 'usr_012', name: 'Prof. David Karger', email: 'david.karger@campusx.edu', password: 'password123', role: 'faculty', department: 'Data Science', avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150' }
];

const feedPosts = [
  // 1. RESEARCH
  {
    id: 'post_res_01',
    user_id: 'usr_002',
    category: 'research',
    type: 'image',
    media_url: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=1200',
    content: '🔬 **Quantum Qubit Error Mitigation Breakthrough**:\nOur team at the Quantum Computing Laboratory has successfully demonstrated a 40% reduction in decoherence noise utilizing tensor-network topological braiding. Full pre-print paper is open for academic peer review.',
    created_at: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    likes_count: 89,
    comments: [
      { user_id: 'usr_003', content: 'Incredible work Evelyn! The tensor fidelity metrics look remarkably tight.' },
      { user_id: 'usr_007', content: 'Can we access the raw simulation dataset on the campus ERP cluster?' }
    ]
  },
  {
    id: 'post_res_02',
    user_id: 'usr_003',
    category: 'research',
    type: 'image',
    media_url: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=1200',
    content: '🧠 **Neuromorphic Vision Architecture**:\nPublished our latest architecture on spike-timing-dependent plasticity (STDP) for real-time edge processing. Processing latency dropped to 1.8ms at 0.4 Watts power envelope.',
    created_at: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
    likes_count: 114,
    comments: [
      { user_id: 'usr_004', content: 'We should integrate this directly with our drone navigation controllers.' }
    ]
  },
  {
    id: 'post_res_03',
    user_id: 'usr_004',
    category: 'research',
    type: 'image',
    media_url: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=1200',
    content: '🤖 **Autonomous Quadruped Terrain Adaptation**:\nField tests completed in rugged campus terrain. The RL locomotion policy adapted instantly to gravel, ice, and 35-degree inclines without hand-crafted gait transitions.',
    created_at: new Date(Date.now() - 1000 * 60 * 360).toISOString(),
    likes_count: 142,
    comments: [
      { user_id: 'usr_005', content: 'Watching the live tests at the East Quad was mindblowing!' },
      { user_id: 'usr_006', content: 'The balance recovery algorithm is ultra-fast.' }
    ]
  },
  {
    id: 'post_res_04',
    user_id: 'usr_009',
    category: 'research',
    type: 'image',
    media_url: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=1200',
    content: '🧬 **CRISPR-Cas12 Targeted Nanobiosensors**:\nOur biotech cohort just published our findings on rapid electrochemical pathogen detection with femtomolar sensitivity in 12 minutes.',
    created_at: new Date(Date.now() - 1000 * 60 * 600).toISOString(),
    likes_count: 76,
    comments: [
      { user_id: 'usr_002', content: 'Brilliant interdisciplinary application of chemical sensing.' }
    ]
  },
  {
    id: 'post_res_05',
    user_id: 'usr_012',
    category: 'research',
    type: 'image',
    media_url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200',
    content: '📊 **Federated Learning over Distributed Healthcare Records**:\nZero-knowledge proofs combined with differential privacy ensure HIPAA-compliant model convergence across 8 medical nodes with 98.4% diagnostic accuracy.',
    created_at: new Date(Date.now() - 1000 * 60 * 900).toISOString(),
    likes_count: 95,
    comments: [
      { user_id: 'usr_001', content: 'Keynote presentation scheduled for the annual symposium.' }
    ]
  },
  {
    id: 'post_res_06',
    user_id: 'usr_010',
    category: 'research',
    type: 'image',
    media_url: 'https://images.unsplash.com/photo-1509390874185-03291a388169?w=1200',
    content: '⚡ **Perovskite-Silicon Tandem Solar Cells**:\nAchieved a certified 31.2% power conversion efficiency in the cleanroom laboratory tests today! Next step: environmental thermal cycling.',
    created_at: new Date(Date.now() - 1000 * 60 * 1200).toISOString(),
    likes_count: 68,
    comments: []
  },

  // 2. CAMPUS UPDATES
  {
    id: 'post_cam_01',
    user_id: 'usr_008',
    category: 'campus',
    type: 'image',
    media_url: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1200',
    content: '🏛️ **Campus Central Library 24/7 Access for Finals Week**:\nStarting tonight, all study wings, silent research pods, and high-performance computing labs will remain open 24/7 with complimentary coffee stations at the atrium.',
    created_at: new Date(Date.now() - 1000 * 60 * 50).toISOString(),
    likes_count: 230,
    comments: [
      { user_id: 'usr_006', content: 'Lifesaver! Booking room 402 for our CS algorithms group.' },
      { user_id: 'usr_007', content: 'Huge thanks to student council for coordinating this!' }
    ]
  },
  {
    id: 'post_cam_02',
    user_id: 'usr_001',
    category: 'campus',
    type: 'image',
    media_url: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=1200',
    content: '🚀 **CampusX Innovation Hub & MakerSpace Inauguration**:\nThe new 15,000 sq ft Makerspace featuring 5-axis CNCs, metal 3D printers, VR suites, and quantum dev kits is officially open to all enrolled students!',
    created_at: new Date(Date.now() - 1000 * 60 * 240).toISOString(),
    likes_count: 188,
    comments: [
      { user_id: 'usr_010', content: 'The CNC tooling specs are top notch. Booking training sessions now.' }
    ]
  },
  {
    id: 'post_cam_03',
    user_id: 'usr_008',
    category: 'campus',
    type: 'image',
    media_url: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1200',
    content: '🎓 **Commencement 2026 Keynote Announcement**:\nWe are honored to announce that Dr. Fei-Fei Li will deliver the 2026 University Commencement Address on June 14th at the Grand Amphitheater.',
    created_at: new Date(Date.now() - 1000 * 60 * 720).toISOString(),
    likes_count: 310,
    comments: [
      { user_id: 'usr_003', content: 'An extraordinary pioneer. Looking forward to welcoming her to campus.' }
    ]
  },
  {
    id: 'post_cam_04',
    user_id: 'usr_005',
    category: 'campus',
    type: 'image',
    media_url: 'https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?w=1200',
    content: '🌿 **Campus Sustainability Solar Canopy Phase 2 Complete**:\nAll north parking facilities and walkways now generate 1.2 Megawatts of clean solar energy, feeding directly into the campus microgrid ledger.',
    created_at: new Date(Date.now() - 1000 * 60 * 1100).toISOString(),
    likes_count: 125,
    comments: []
  },
  {
    id: 'post_cam_05',
    user_id: 'usr_008',
    category: 'campus',
    type: 'image',
    media_url: 'https://images.unsplash.com/photo-1519452575417-564c1401ecc0?w=1200',
    content: '📶 **Campus-Wide Wi-Fi 7 Deployment Completed**:\nAverage campus throughput is now measured at 2.4 Gbps with sub-5ms latency across all academic blocks, hostels, and sports grounds.',
    created_at: new Date(Date.now() - 1000 * 60 * 1400).toISOString(),
    likes_count: 175,
    comments: [
      { user_id: 'usr_007', content: 'Tested in CS Lab 3 — downloads are instant!' }
    ]
  },
  {
    id: 'post_cam_06',
    user_id: 'usr_005',
    category: 'campus',
    type: 'image',
    media_url: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1200',
    content: '🎉 **Annual Cultural & Tech Gala "Pulse 2026" Schedule Released**:\nFeaturing 48 hackathons, drone racing championships, live orchestra, and inter-university esports tournaments from Oct 12-15.',
    created_at: new Date(Date.now() - 1000 * 60 * 1800).toISOString(),
    likes_count: 260,
    comments: [
      { user_id: 'usr_006', content: 'Our design team has finished the holographic stage banners!' }
    ]
  },

  // 3. STUDENT LIFE & PROJECTS
  {
    id: 'post_stu_01',
    user_id: 'usr_006',
    category: 'student',
    type: 'image',
    media_url: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200',
    content: '💻 **Open-Source CampusX Core v3.0 PR Merged!**:\nJust merged 4,200 lines of rust-based WebAssembly modules for real-time ledger consensus. Fast state hydration is now down to 0ms!',
    created_at: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    likes_count: 195,
    comments: [
      { user_id: 'usr_007', content: 'Huge PR! The benchmarks on the testnet are looking unreal.' },
      { user_id: 'usr_001', content: 'Outstanding architectural engineering, Aria.' }
    ]
  },
  {
    id: 'post_stu_02',
    user_id: 'usr_007',
    category: 'student',
    type: 'image',
    media_url: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=1200',
    content: '🌙 **3:00 AM Hackathon Coding Sprint**:\nBuilding an AI-driven academic course optimizer that personalizes semester schedules based on cognitive load and sleep chronotype. Pizza boxes everywhere!',
    created_at: new Date(Date.now() - 1000 * 60 * 150).toISOString(),
    likes_count: 167,
    comments: [
      { user_id: 'usr_005', content: 'Save me a slice, heading over to lab 2 now!' }
    ]
  },
  {
    id: 'post_stu_03',
    user_id: 'usr_011',
    category: 'student',
    type: 'image',
    media_url: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=1200',
    content: '📐 **Architecture Capstone: Biophilic Smart Library Concept**:\nRenderings completed for our solar-kinetic pavilion featuring natural ventilation wind chimneys and living moss bio-walls.',
    created_at: new Date(Date.now() - 1000 * 60 * 420).toISOString(),
    likes_count: 140,
    comments: [
      { user_id: 'usr_009', content: 'The integration with sustainable air filtration is gorgeous.' }
    ]
  },
  {
    id: 'post_stu_04',
    user_id: 'usr_010',
    category: 'student',
    type: 'image',
    media_url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=1200',
    content: '🏎️ **Formula Student Electric Racer Chassis Dyno Test**:\nCarbon fiber monocoque passed torsional stiffness validation at 3,200 Nm/deg. 0-100 km/h simulation predicts 2.1 seconds!',
    created_at: new Date(Date.now() - 1000 * 60 * 850).toISOString(),
    likes_count: 220,
    comments: [
      { user_id: 'usr_004', content: 'Exceptional FEA simulation and composite layup quality.' }
    ]
  },
  {
    id: 'post_stu_05',
    user_id: 'usr_005',
    category: 'student',
    type: 'image',
    media_url: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1200',
    content: '📡 **Satellite Ground Station First Contact Success**:\nSuccessfully downlinked telemetry from NOAA-20 weather satellite using our student-built motorized Yagi-Uda antenna array on the Science Block roof.',
    created_at: new Date(Date.now() - 1000 * 60 * 1300).toISOString(),
    likes_count: 178,
    comments: []
  },
  {
    id: 'post_stu_06',
    user_id: 'usr_006',
    category: 'student',
    type: 'image',
    media_url: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=1200',
    content: '🎨 **CampusX Connect UI/UX Design System v2.4**:\nDesigned 80+ obsidian/emerald micro-components with 120 FPS Framer Motion interactions and full WCAG AAA contrast ratio compliance.',
    created_at: new Date(Date.now() - 1000 * 60 * 1600).toISOString(),
    likes_count: 154,
    comments: [
      { user_id: 'usr_007', content: 'The dark mode color palette is pure perfection.' }
    ]
  },

  // 4. FACULTY ANNOUNCEMENTS
  {
    id: 'post_fac_01',
    user_id: 'usr_001',
    category: 'faculty',
    type: 'image',
    media_url: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=1200',
    content: '📢 **CS301 Distributed Systems Project Rubric Posted**:\nPlease review the consensus benchmark criteria on the course ledger before Friday. All raft election edge cases must pass 10,000 chaos tests.',
    created_at: new Date(Date.now() - 1000 * 60 * 110).toISOString(),
    likes_count: 82,
    comments: [
      { user_id: 'usr_006', content: 'Confirmed. Our group is testing network partitions with Jepsen.' }
    ]
  },
  {
    id: 'post_fac_02',
    user_id: 'usr_003',
    category: 'faculty',
    type: 'image',
    media_url: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=1200',
    content: '🎓 **Paid Graduate Research Assistant Positions (Fall 2026)**:\nOpening 3 fully funded RA positions for foundational LLM alignment and interpretability research. Prerequisites: PyTorch, transformer architectures, and linear algebra.',
    created_at: new Date(Date.now() - 1000 * 60 * 320).toISOString(),
    likes_count: 245,
    comments: [
      { user_id: 'usr_007', content: 'Submitted application and GitHub portfolio to your office portal, Professor.' }
    ]
  },
  {
    id: 'post_fac_03',
    user_id: 'usr_004',
    category: 'faculty',
    type: 'image',
    media_url: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?w=1200',
    content: '🤖 **Robotics Lab Open House & Demo Day**:\nJoin us this Thursday at 4 PM in Engineering Hall B. We will be demonstrating our bipedal humanoid walking balance and micro-drone swarm formation control.',
    created_at: new Date(Date.now() - 1000 * 60 * 640).toISOString(),
    likes_count: 130,
    comments: []
  },
  {
    id: 'post_fac_04',
    user_id: 'usr_002',
    category: 'faculty',
    type: 'image',
    media_url: 'https://images.unsplash.com/photo-1507668077129-56e32842fceb?w=1200',
    content: '📚 **Guest Lecture: Quantum Cryptography & Post-Quantum TLS**:\nDelighted to host Dr. Peter Shor virtually next Tuesday at 10 AM EST. Zoom and Live VR streaming links are posted on the ERP events calendar.',
    created_at: new Date(Date.now() - 1000 * 60 * 980).toISOString(),
    likes_count: 190,
    comments: [
      { user_id: 'usr_005', content: 'A true legend! Definitely attending.' }
    ]
  },
  {
    id: 'post_fac_05',
    user_id: 'usr_012',
    category: 'faculty',
    type: 'image',
    media_url: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1200',
    content: '💡 **Academic Advisory Hours Extended for Midterm Advising**:\nWalk-in hours available every day between 2:00 PM - 5:00 PM in Faculty Wing B, Room 318. Feel free to discuss project ideas and elective choices.',
    created_at: new Date(Date.now() - 1000 * 60 * 1500).toISOString(),
    likes_count: 64,
    comments: []
  },

  // 5. PLACEMENTS & CAREERS
  {
    id: 'post_plc_01',
    user_id: 'usr_008',
    category: 'placement',
    type: 'image',
    media_url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200',
    content: '💼 **Google & DeepMind On-Campus Recruitment Drive 2026**:\nCampus hiring drive for Software Engineer (L3/L4), AI Research Scientist, and Systems Performance Engineer roles is officially live. Eligibility: 2026 and 2027 graduating cohorts.',
    created_at: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
    likes_count: 340,
    comments: [
      { user_id: 'usr_006', content: 'Applied through the ERP Placement Portal!' },
      { user_id: 'usr_007', content: 'Good luck everyone!' }
    ]
  },
  {
    id: 'post_plc_02',
    user_id: 'usr_008',
    category: 'placement',
    type: 'image',
    media_url: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=1200',
    content: '📈 **2026 Placement Milestone: 94.2% Placement Rate**:\nMedian starting compensation crossed $148,000 with 112 Fortune 500 tech companies and research labs recruiting from our campus this cycle.',
    created_at: new Date(Date.now() - 1000 * 60 * 280).toISOString(),
    likes_count: 420,
    comments: [
      { user_id: 'usr_001', content: 'A testament to the rigorous practical caliber of our students.' }
    ]
  },
  {
    id: 'post_plc_03',
    user_id: 'usr_008',
    category: 'placement',
    type: 'image',
    media_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=1200',
    content: '🎯 **Mock Technical Coding & System Design Interviews**:\n12 Silicon Valley alumni are hosting 1-on-1 mock behavioral & technical interview sessions this weekend. Slots are available on the Career Matrix.',
    created_at: new Date(Date.now() - 1000 * 60 * 560).toISOString(),
    likes_count: 180,
    comments: [
      { user_id: 'usr_005', content: 'Booked slot with Stripe engineering manager!' }
    ]
  },
  {
    id: 'post_plc_04',
    user_id: 'usr_008',
    category: 'placement',
    type: 'image',
    media_url: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=1200',
    content: '🚀 **Stripe & OpenAI Summer 2026 Internships Final Selection**:\nCongratulations to the 18 students selected for the incoming summer cohort in San Francisco and Seattle!',
    created_at: new Date(Date.now() - 1000 * 60 * 920).toISOString(),
    likes_count: 295,
    comments: [
      { user_id: 'usr_006', content: 'Huge congrats Aria and Alex!' }
    ]
  },
  {
    id: 'post_plc_05',
    user_id: 'usr_008',
    category: 'placement',
    type: 'image',
    media_url: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1200',
    content: '📝 **Resume & Portfolio Review Workshop with Top Tech Recruiters**:\nBring your GitHub, live web apps, and LaTeX resumes to the Auditorium this Friday at 3 PM for line-by-line feedback.',
    created_at: new Date(Date.now() - 1000 * 60 * 1350).toISOString(),
    likes_count: 115,
    comments: []
  },

  // 6. CLUBS & SOCIETIES
  {
    id: 'post_clb_01',
    user_id: 'usr_007',
    category: 'club',
    type: 'image',
    media_url: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=1200',
    content: '⛓️ **CampusX Blockchain Club: EVM Rollup Validator Online**:\nWe just launched our student-run layer-2 validator testnet node on campus server hardware. Zero-gas microtransactions are active for all student apps!',
    created_at: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
    likes_count: 155,
    comments: [
      { user_id: 'usr_006', content: 'Connected our campus identity smart contract to it!' }
    ]
  },
  {
    id: 'post_clb_02',
    user_id: 'usr_009',
    category: 'club',
    type: 'image',
    media_url: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?w=1200',
    content: '🔭 **Astronomy Club: Deep Space Astrophotography Night**:\nCaptured the Andromeda Galaxy (M31) at 120-second exposure intervals using the campus 14-inch Schmidt-Cassegrain telescope. Stargazing session this Friday at 9 PM!',
    created_at: new Date(Date.now() - 1000 * 60 * 380).toISOString(),
    likes_count: 210,
    comments: [
      { user_id: 'usr_002', content: 'The spiral arm resolution in that image is breathtaking!' }
    ]
  },
  {
    id: 'post_clb_03',
    user_id: 'usr_005',
    category: 'club',
    type: 'image',
    media_url: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1200',
    content: '🎮 **Esports & Game Development Club: Unreal Engine 5 VR Showcase**:\nTesting our student-developed cyberpunk VR campus simulation in the main hall. Haptic feedback gloves and 8K headsets ready for trial!',
    created_at: new Date(Date.now() - 1000 * 60 * 760).toISOString(),
    likes_count: 168,
    comments: []
  },
  {
    id: 'post_clb_04',
    user_id: 'usr_011',
    category: 'club',
    type: 'image',
    media_url: 'https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=1200',
    content: '📸 **Annual Campus Photography Exhibition: "Moments in Motion"**:\nOver 140 student prints displayed in the Student Union Gallery. Come cast your vote for the People\'s Choice Award before Sunday.',
    created_at: new Date(Date.now() - 1000 * 60 * 1150).toISOString(),
    likes_count: 135,
    comments: []
  },
  {
    id: 'post_clb_05',
    user_id: 'usr_006',
    category: 'club',
    type: 'image',
    media_url: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=1200',
    content: '🎵 **University Symphony & Jazz Ensemble Fall Showcase**:\nJoin us at the Concert Hall this Saturday evening. Performing compositions by Bach, Hans Zimmer, and student original arrangements.',
    created_at: new Date(Date.now() - 1000 * 60 * 1650).toISOString(),
    likes_count: 142,
    comments: []
  },

  // 7. ACHIEVEMENTS & TROPHIES
  {
    id: 'post_ach_01',
    user_id: 'usr_006',
    category: 'achievement',
    type: 'image',
    media_url: 'https://images.unsplash.com/photo-1578269174936-2709b6aeb913?w=1200',
    content: '🏆 **1st Place Champions: National Smart University AI Hackathon 2026**:\nOur team "CampusX Matrix" took 1st place out of 450 universities across the nation with our zero-latency decentralized ERP ledger! $50,000 grand prize secured!',
    created_at: new Date(Date.now() - 1000 * 60 * 20).toISOString(),
    likes_count: 512,
    comments: [
      { user_id: 'usr_001', content: 'Phenomenal victory! We are immensely proud of your team.' },
      { user_id: 'usr_003', content: 'Hard work and technical precision always win. Well deserved!' },
      { user_id: 'usr_005', content: 'CampusX on top!! 🔥🏆' }
    ]
  },
  {
    id: 'post_ach_02',
    user_id: 'usr_004',
    category: 'achievement',
    type: 'image',
    media_url: 'https://images.unsplash.com/photo-1567427017947-545c5f8d16ad?w=1200',
    content: '🥇 **World RoboCup Rescue Champions in Tokyo, Japan**:\nOur autonomous search-and-rescue rover team won Gold in Tokyo today after clearing all multi-story obstacle mazes with zero operator intervention!',
    created_at: new Date(Date.now() - 1000 * 60 * 210).toISOString(),
    likes_count: 480,
    comments: [
      { user_id: 'usr_010', content: 'The vision SLAM algorithm held up under zero lighting!' }
    ]
  },
  {
    id: 'post_ach_03',
    user_id: 'usr_007',
    category: 'achievement',
    type: 'image',
    media_url: 'https://images.unsplash.com/photo-1519834785169-98be25ec3f84?w=1200',
    content: '🚀 **Student AI Startup Raises $500,000 Seed Funding**:\nOur campus incubator project "NeuroMesh" has officially closed seed financing led by Y Combinator and Khosla Ventures. Proud to build right here on campus!',
    created_at: new Date(Date.now() - 1000 * 60 * 490).toISOString(),
    likes_count: 390,
    comments: [
      { user_id: 'usr_008', content: 'Incredible milestone! Congratulations Alex and team!' }
    ]
  },
  {
    id: 'post_ach_04',
    user_id: 'usr_002',
    category: 'achievement',
    type: 'image',
    media_url: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1200',
    content: '🎖️ **IEEE Best Paper Award 2026 in Quantum Information Processing**:\nHonored to receive the Best Paper accolade at IEEE QIP 2026 for our collaborative work on topological stabilizer codes with student co-authors!',
    created_at: new Date(Date.now() - 1000 * 60 * 880).toISOString(),
    likes_count: 365,
    comments: [
      { user_id: 'usr_003', content: 'Richly deserved recognition, Evelyn!' }
    ]
  }
];

async function seedPosts() {
  console.log('🌱 Seeding 37 Rich Feed Posts and Demo Users into SQLite and Firebase...');

  db.serialize(async () => {
    // 1. Insert Demo Users
    const insertUserStmt = db.prepare(`
      INSERT OR REPLACE INTO users (id, name, email, password, role, department, avatar, password_changed)
      VALUES (?, ?, ?, ?, ?, ?, ?, 1)
    `);

    for (const u of demoUsers) {
      insertUserStmt.run([u.id, u.name, u.email, u.password, u.role, u.department, u.avatar]);
      if (adminDb) {
        adminDb.collection('users').doc(u.id).set({
          id: u.id,
          name: u.name,
          email: u.email,
          role: u.role,
          department: u.department,
          avatar: u.avatar
        }, { merge: true }).catch(() => {});
      }
    }
    insertUserStmt.finalize();

    // 2. Insert Posts
    const insertPostStmt = db.prepare(`
      INSERT OR REPLACE INTO posts (id, user_id, type, content, media_url, pdf_url, category, created_at, likes_count)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const insertCommentStmt = db.prepare(`
      INSERT OR REPLACE INTO comments (id, post_id, user_id, content, created_at)
      VALUES (?, ?, ?, ?, ?)
    `);

    const insertLikeStmt = db.prepare(`
      INSERT OR REPLACE INTO likes (id, post_id, user_id)
      VALUES (?, ?, ?)
    `);

    for (let i = 0; i < feedPosts.length; i++) {
      const p = feedPosts[i];
      insertPostStmt.run([
        p.id,
        p.user_id,
        p.type || 'image',
        p.content,
        p.media_url || null,
        p.pdf_url || null,
        p.category || 'campus',
        p.created_at,
        p.likes_count || 0
      ]);

      // Comments
      if (p.comments && p.comments.length > 0) {
        p.comments.forEach((c, cIdx) => {
          const commentId = `comm_${p.id}_${cIdx}`;
          const cTime = new Date(Date.now() - 1000 * 60 * (10 + cIdx * 5)).toISOString();
          insertCommentStmt.run([commentId, p.id, c.user_id, c.content, cTime]);

          if (adminDb) {
            adminDb.collection('posts').doc(p.id).collection('comments').doc(commentId).set({
              id: commentId,
              user_id: c.user_id,
              content: c.content,
              created_at: cTime
            }, { merge: true }).catch(() => {});
          }
        });
      }

      // Likes
      const likerIds = ['usr_001', 'usr_002', 'usr_003', 'usr_005', 'usr_006', 'usr_007', 'usr_008', 'usr_009', 'usr_010', 'usr_011'].slice(0, Math.min(6, (p.likes_count % 10) + 1));
      likerIds.forEach(lId => {
        const likeId = `like_${p.id}_${lId}`;
        insertLikeStmt.run([likeId, p.id, lId]);
        if (adminDb) {
          adminDb.collection('posts').doc(p.id).collection('likes').doc(lId).set({ user_id: lId }).catch(() => {});
        }
      });

      // Firebase Admin Dual-Write
      if (adminDb) {
        adminDb.collection('posts').doc(p.id).set({
          id: p.id,
          user_id: p.user_id,
          type: p.type || 'image',
          content: p.content,
          media_url: p.media_url || null,
          category: p.category || 'campus',
          created_at: p.created_at,
          likes_count: p.likes_count || 0,
          likes: likerIds
        }, { merge: true }).catch(() => {});
      }
    }

    insertPostStmt.finalize();
    insertCommentStmt.finalize();
    insertLikeStmt.finalize();

    console.log(`✅ Successfully seeded ${feedPosts.length} posts with images, categories, comments, and likes!`);
    db.close();
  });
}

seedPosts();
