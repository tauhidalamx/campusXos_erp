/* ========================================================================
   CampusX University ERP — Authentication System
   Handles registration, login, session management, and validation
   ======================================================================== */

window.AuthSystem = (function () {
  'use strict';

  // ── Storage Keys ──
  const USERS_KEY = 'campusx_erp_users';
  const SESSION_KEY = 'campusx_erp_session';

  // ── Default Accounts ──
  const DEFAULT_ACCOUNTS = [
    {
      "id": "usr_001",
      "name": "Dr. Rajesh Sharma",
      "email": "admin@campusx.edu",
      "password": "h$g10hvh",
      "role": "admin",
      "avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
      "createdAt": "2024-01-01T00:00:00.000Z"
    },
    {
      "id": "usr_002",
      "name": "Prof. Tariq Ansari",
      "email": "faculty@campusx.edu",
      "password": "h$rwy182",
      "role": "faculty",
      "avatar": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
      "createdAt": "2024-01-15T00:00:00.000Z"
    },
    {
      "id": "usr_003",
      "name": "Ananya Patel",
      "email": "student@campusx.edu",
      "password": "h$h2pckp",
      "role": "student",
      "avatar": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150",
      "createdAt": "2024-02-01T00:00:00.000Z"
    },
    {
      "id": "usr_004",
      "name": "Prof. Sunita Verma",
      "email": "hod@campusx.edu",
      "password": "h$k1lauj",
      "role": "hod",
      "avatar": "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150",
      "createdAt": "2024-01-20T00:00:00.000Z"
    },
    {
      "id": "FAC001",
      "name": "Dr. Rajesh Sharma",
      "email": "rajesh.sharma@modeluni.edu",
      "password": "h$ahtk4x",
      "role": "faculty",
      "avatar": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150",
      "createdAt": "2024-01-15T00:00:00.000Z"
    },
    {
      "id": "FAC002",
      "name": "Dr. Tariq Ansari",
      "email": "tariq.ansari@modeluni.edu",
      "password": "h$oryr2g",
      "role": "faculty",
      "avatar": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
      "createdAt": "2024-01-15T00:00:00.000Z"
    },
    {
      "id": "FAC003",
      "name": "Dr. Sunita Verma",
      "email": "sunita.verma@modeluni.edu",
      "password": "h$luvql0",
      "role": "faculty",
      "avatar": "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150",
      "createdAt": "2024-01-15T00:00:00.000Z"
    },
    {
      "id": "FAC004",
      "name": "Dr. Kabir Qureshi",
      "email": "kabir.qureshi@modeluni.edu",
      "password": "h$579re9",
      "role": "faculty",
      "avatar": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150",
      "createdAt": "2024-01-15T00:00:00.000Z"
    },
    {
      "id": "FAC005",
      "name": "Dr. Harleen Kaur",
      "email": "harleen.kaur@modeluni.edu",
      "password": "h$6cvk2u",
      "role": "faculty",
      "avatar": "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150",
      "createdAt": "2024-01-15T00:00:00.000Z"
    },
    {
      "id": "FAC006",
      "name": "Prof. Ramesh Shastri",
      "email": "ramesh.shastri@modeluni.edu",
      "password": "h$31v5xy",
      "role": "faculty",
      "avatar": "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150",
      "createdAt": "2024-01-15T00:00:00.000Z"
    },
    {
      "id": "FAC007",
      "name": "Dr. Fatima Khan",
      "email": "fatima.khan@modeluni.edu",
      "password": "h$r96w2t",
      "role": "faculty",
      "avatar": "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150",
      "createdAt": "2024-01-15T00:00:00.000Z"
    },
    {
      "id": "FAC008",
      "name": "Prof. Gurpreet Singh",
      "email": "gurpreet.singh@modeluni.edu",
      "password": "h$6kh593",
      "role": "faculty",
      "avatar": "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150",
      "createdAt": "2024-01-15T00:00:00.000Z"
    },
    {
      "id": "FAC009",
      "name": "Dr. Rohan D'Souza",
      "email": "rohan.dsouza@modeluni.edu",
      "password": "h$h8x5v0",
      "role": "faculty",
      "avatar": "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150",
      "createdAt": "2024-01-15T00:00:00.000Z"
    },
    {
      "id": "FAC010",
      "name": "Dr. Ananya Mukherjee",
      "email": "ananya.mukherjee@modeluni.edu",
      "password": "h$7s0g0h",
      "role": "faculty",
      "avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
      "createdAt": "2024-01-15T00:00:00.000Z"
    },
    {
      "id": "FAC011",
      "name": "Dr. Syed Zaid Ali",
      "email": "zaid.ali@modeluni.edu",
      "password": "h$7vupp2",
      "role": "faculty",
      "avatar": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
      "createdAt": "2024-01-15T00:00:00.000Z"
    },
    {
      "id": "FAC012",
      "name": "Dr. Sneha Fernandes",
      "email": "sneha.fernandes@modeluni.edu",
      "password": "h$r3ccgv",
      "role": "faculty",
      "avatar": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150",
      "createdAt": "2024-01-15T00:00:00.000Z"
    },
    {
      "id": "FAC013",
      "name": "Dr. Vikramaditya Reddy",
      "email": "vikram.reddy@modeluni.edu",
      "password": "h$p5vb50",
      "role": "faculty",
      "avatar": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150",
      "createdAt": "2024-01-15T00:00:00.000Z"
    },
    {
      "id": "FAC014",
      "name": "Dr. Ayesha Siddiqui",
      "email": "ayesha.siddiqui@modeluni.edu",
      "password": "h$5hcz47",
      "role": "faculty",
      "avatar": "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150",
      "createdAt": "2024-01-15T00:00:00.000Z"
    },
    {
      "id": "FAC015",
      "name": "Dr. Siddharth Jain",
      "email": "siddharth.jain@modeluni.edu",
      "password": "h$hcmi6o",
      "role": "faculty",
      "avatar": "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150",
      "createdAt": "2024-01-15T00:00:00.000Z"
    },
    {
      "id": "FAC016",
      "name": "Dr. Jaspreet Kaur",
      "email": "jaspreet.kaur@modeluni.edu",
      "password": "h$6cvk1y",
      "role": "faculty",
      "avatar": "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150",
      "createdAt": "2024-01-15T00:00:00.000Z"
    },
    {
      "id": "FAC017",
      "name": "Dr. Priya Nair",
      "email": "priya.nair@modeluni.edu",
      "password": "h$kxk83y",
      "role": "faculty",
      "avatar": "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150",
      "createdAt": "2024-01-15T00:00:00.000Z"
    },
    {
      "id": "FAC018",
      "name": "Dr. Mohammad Imran",
      "email": "mohammad.imran@modeluni.edu",
      "password": "h$7gefik",
      "role": "faculty",
      "avatar": "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150",
      "createdAt": "2024-01-15T00:00:00.000Z"
    },
    {
      "id": "FAC019",
      "name": "Dr. Deepa Iyer",
      "email": "deepa.iyer@modeluni.edu",
      "password": "h$r5z2tv",
      "role": "faculty",
      "avatar": "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150",
      "createdAt": "2024-01-15T00:00:00.000Z"
    },
    {
      "id": "FAC020",
      "name": "Dr. Manpreet Singh",
      "email": "manpreet.singh@modeluni.edu",
      "password": "h$6kh5al",
      "role": "faculty",
      "avatar": "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150",
      "createdAt": "2024-01-15T00:00:00.000Z"
    },
    {
      "id": "FAC021",
      "name": "Dr. Sameer Ahmed",
      "email": "sameer.ahmed@modeluni.edu",
      "password": "h$gmtsea",
      "role": "faculty",
      "avatar": "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150",
      "createdAt": "2024-01-15T00:00:00.000Z"
    },
    {
      "id": "FAC022",
      "name": "Dr. Kavita Bose",
      "email": "kavita.bose@modeluni.edu",
      "password": "h$s9x0gn",
      "role": "faculty",
      "avatar": "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=150",
      "createdAt": "2024-01-15T00:00:00.000Z"
    },
    {
      "id": "FAC023",
      "name": "Dr. Amitav Ghosh",
      "email": "amitav.ghosh@modeluni.edu",
      "password": "h$3vbt3a",
      "role": "faculty",
      "avatar": "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150",
      "createdAt": "2024-01-15T00:00:00.000Z"
    },
    {
      "id": "FAC024",
      "name": "Dr. Zubin Mehta",
      "email": "zubin.mehta@modeluni.edu",
      "password": "h$w1cusz",
      "role": "faculty",
      "avatar": "https://images.unsplash.com/photo-1542909168-82c3e7fdca5c?w=150",
      "createdAt": "2024-01-15T00:00:00.000Z"
    },
    {
      "id": "FAC025",
      "name": "Dr. Arvind Swaminathan",
      "email": "arvind.swaminathan@modeluni.edu",
      "password": "h$g785su",
      "role": "faculty",
      "avatar": "https://images.unsplash.com/photo-1527983359383-4758693f760c?w=150",
      "createdAt": "2024-01-15T00:00:00.000Z"
    },
    {
      "id": "FAC026",
      "name": "Dr. Zainab Begum",
      "email": "zainab.begum@modeluni.edu",
      "password": "h$ket1gw",
      "role": "faculty",
      "avatar": "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=150",
      "createdAt": "2024-01-15T00:00:00.000Z"
    },
    {
      "id": "FAC027",
      "name": "Dr. Kevin Thomas",
      "email": "kevin.thomas@modeluni.edu",
      "password": "h$yuqm6v",
      "role": "faculty",
      "avatar": "https://images.unsplash.com/photo-1554151228-14d9def656e4?w=150",
      "createdAt": "2024-01-15T00:00:00.000Z"
    },
    {
      "id": "STU001",
      "name": "Aarav Sharma",
      "email": "aarav.sharma@modeluni.edu",
      "password": "h$viwwm",
      "role": "student",
      "avatar": "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150",
      "createdAt": "2024-02-01T00:00:00.000Z"
    },
    {
      "id": "STU002",
      "name": "Fatima Zohra",
      "email": "fatima.zohra@modeluni.edu",
      "password": "h$5wxkca",
      "role": "student",
      "avatar": "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150",
      "createdAt": "2024-02-01T00:00:00.000Z"
    },
    {
      "id": "STU003",
      "name": "Jaspreet Singh",
      "email": "jaspreet.singh@modeluni.edu",
      "password": "h$809gqx",
      "role": "student",
      "avatar": "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150",
      "createdAt": "2024-02-01T00:00:00.000Z"
    },
    {
      "id": "STU004",
      "name": "Ananya Patel",
      "email": "ananya.patel@modeluni.edu",
      "password": "h$yj2oke",
      "role": "student",
      "avatar": "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150",
      "createdAt": "2024-02-01T00:00:00.000Z"
    },
    {
      "id": "STU005",
      "name": "Mohammad Bilal",
      "email": "mohammad.bilal@modeluni.edu",
      "password": "h$it6el9",
      "role": "student",
      "avatar": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150",
      "createdAt": "2024-02-01T00:00:00.000Z"
    },
    {
      "id": "STU006",
      "name": "Priya Sharma",
      "email": "priya.sharma@modeluni.edu",
      "password": "h$a0qhwz",
      "role": "student",
      "avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
      "createdAt": "2024-02-01T00:00:00.000Z"
    },
    {
      "id": "STU007",
      "name": "Rohan D'Silva",
      "email": "rohan.dsilva@modeluni.edu",
      "password": "h$8q3os5",
      "role": "student",
      "avatar": "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150",
      "createdAt": "2024-02-01T00:00:00.000Z"
    },
    {
      "id": "STU008",
      "name": "Sara Ali",
      "email": "sara.ali@modeluni.edu",
      "password": "h$1bcduv",
      "role": "student",
      "avatar": "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150",
      "createdAt": "2024-02-01T00:00:00.000Z"
    },
    {
      "id": "STU009",
      "name": "Devendra Verma",
      "email": "devendra.verma@modeluni.edu",
      "password": "h$wqswts",
      "role": "student",
      "avatar": "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150",
      "createdAt": "2024-02-01T00:00:00.000Z"
    },
    {
      "id": "STU010",
      "name": "Simran Kaur",
      "email": "simran.kaur@modeluni.edu",
      "password": "h$jpz3sj",
      "role": "student",
      "avatar": "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150",
      "createdAt": "2024-02-01T00:00:00.000Z"
    },
    {
      "id": "STU011",
      "name": "Zaid Khan",
      "email": "zaid.khan@modeluni.edu",
      "password": "h$6pzkey",
      "role": "student",
      "avatar": "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150",
      "createdAt": "2024-02-01T00:00:00.000Z"
    },
    {
      "id": "STU012",
      "name": "Ravi Kumar",
      "email": "ravi.kumar@modeluni.edu",
      "password": "h$h479",
      "role": "student",
      "avatar": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
      "createdAt": "2024-02-01T00:00:00.000Z"
    },
    {
      "id": "STU013",
      "name": "Diya Menon",
      "email": "diya.menon@modeluni.edu",
      "password": "h$18w3rj",
      "role": "student",
      "avatar": "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150",
      "createdAt": "2024-02-01T00:00:00.000Z"
    },
    {
      "id": "STU014",
      "name": "Rahul Deshmukh",
      "email": "rahul.deshmukh@modeluni.edu",
      "password": "h$z2895d",
      "role": "student",
      "avatar": "https://images.unsplash.com/photo-1504257404764-b2b1d311277a?w=150",
      "createdAt": "2024-02-01T00:00:00.000Z"
    },
    {
      "id": "STU015",
      "name": "Aisha Sheikh",
      "email": "aisha.sheikh@modeluni.edu",
      "password": "h$atgfmk",
      "role": "student",
      "avatar": "https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=150",
      "createdAt": "2024-02-01T00:00:00.000Z"
    },
    {
      "id": "STU016",
      "name": "Ishaan Malhotra",
      "email": "ishaan.malhotra@modeluni.edu",
      "password": "h$9b66s1",
      "role": "student",
      "avatar": "https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=150",
      "createdAt": "2024-02-01T00:00:00.000Z"
    },
    {
      "id": "STU017",
      "name": "Meera Joshi",
      "email": "meera.joshi@modeluni.edu",
      "password": "h$r2waoq",
      "role": "student",
      "avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
      "createdAt": "2024-02-01T00:00:00.000Z"
    },
    {
      "id": "STU018",
      "name": "Amanpreet Singh",
      "email": "amanpreet.singh@modeluni.edu",
      "password": "h$xb0oa",
      "role": "student",
      "avatar": "https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?w=150",
      "createdAt": "2024-02-01T00:00:00.000Z"
    },
    {
      "id": "STU019",
      "name": "Sana Malik",
      "email": "sana.malik@modeluni.edu",
      "password": "h$l6fmwt",
      "role": "student",
      "avatar": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150",
      "createdAt": "2024-02-01T00:00:00.000Z"
    },
    {
      "id": "STU020",
      "name": "Arjun Kapoor",
      "email": "arjun.kapoor@modeluni.edu",
      "password": "h$s79yns",
      "role": "student",
      "avatar": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
      "createdAt": "2024-02-01T00:00:00.000Z"
    },
    {
      "id": "STU021",
      "name": "Riya Sen",
      "email": "riya.sen@modeluni.edu",
      "password": "h$8vrkik",
      "role": "student",
      "avatar": "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150",
      "createdAt": "2024-02-01T00:00:00.000Z"
    },
    {
      "id": "STU022",
      "name": "Hamza Raza",
      "email": "hamza.raza@modeluni.edu",
      "password": "h$t2q4gx",
      "role": "student",
      "avatar": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150",
      "createdAt": "2024-02-01T00:00:00.000Z"
    },
    {
      "id": "STU023",
      "name": "Nikhil Pillai",
      "email": "nikhil.pillai@modeluni.edu",
      "password": "h$ist7mm",
      "role": "student",
      "avatar": "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150",
      "createdAt": "2024-02-01T00:00:00.000Z"
    },
    {
      "id": "STU024",
      "name": "Gurleen Kaur",
      "email": "gurleen.kaur@modeluni.edu",
      "password": "h$e2974o",
      "role": "student",
      "avatar": "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150",
      "createdAt": "2024-02-01T00:00:00.000Z"
    },
    {
      "id": "STU025",
      "name": "Siddharth Shah",
      "email": "siddharth.shah@modeluni.edu",
      "password": "h$7gt2oo",
      "role": "student",
      "avatar": "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150",
      "createdAt": "2024-02-01T00:00:00.000Z"
    },
    {
      "id": "STU026",
      "name": "Zoya Akhtar",
      "email": "zoya.akhtar@modeluni.edu",
      "password": "h$z9ran1",
      "role": "student",
      "avatar": "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150",
      "createdAt": "2024-02-01T00:00:00.000Z"
    },
    {
      "id": "STU027",
      "name": "Chris Mathew",
      "email": "chris.mathew@modeluni.edu",
      "password": "h$v9r8s6",
      "role": "student",
      "avatar": "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150",
      "createdAt": "2024-02-01T00:00:00.000Z"
    },
    {
      "id": "STU028",
      "name": "Vikram Singh",
      "email": "vikram.singh@modeluni.edu",
      "password": "h$z93jr8",
      "role": "student",
      "avatar": "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150",
      "createdAt": "2024-02-01T00:00:00.000Z"
    },
    {
      "id": "STU029",
      "name": "Parth Aggarwal",
      "email": "parth.aggarwal@modeluni.edu",
      "password": "h$f6329e",
      "role": "student",
      "avatar": "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150",
      "createdAt": "2024-02-01T00:00:00.000Z"
    },
    {
      "id": "STU030",
      "name": "Kavya Reddy",
      "email": "kavya.reddy@modeluni.edu",
      "password": "h$ywpj7z",
      "role": "student",
      "avatar": "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=150",
      "createdAt": "2024-02-01T00:00:00.000Z"
    },
    {
      "id": "STU031",
      "name": "Mustafa Hussain",
      "email": "mustafa.hussain@modeluni.edu",
      "password": "h$o0yf5l",
      "role": "student",
      "avatar": "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150",
      "createdAt": "2024-02-01T00:00:00.000Z"
    },
    {
      "id": "STU032",
      "name": "Karan Mehta",
      "email": "karan.mehta@modeluni.edu",
      "password": "h$4qe71u",
      "role": "student",
      "avatar": "https://images.unsplash.com/photo-1542909168-82c3e7fdca5c?w=150",
      "createdAt": "2024-02-01T00:00:00.000Z"
    },
    {
      "id": "STU033",
      "name": "Aditya Roy",
      "email": "aditya.roy@modeluni.edu",
      "password": "h$uyz35m",
      "role": "student",
      "avatar": "https://images.unsplash.com/photo-1527983359383-4758693f760c?w=150",
      "createdAt": "2024-02-01T00:00:00.000Z"
    },
    {
      "id": "STU034",
      "name": "Divya Nair",
      "email": "divya.nair@modeluni.edu",
      "password": "h$3h3dp8",
      "role": "student",
      "avatar": "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=150",
      "createdAt": "2024-02-01T00:00:00.000Z"
    },
    {
      "id": "STU035",
      "name": "Tanmay Bhat",
      "email": "tanmay.bhat@modeluni.edu",
      "password": "h$h90uwq",
      "role": "student",
      "avatar": "https://images.unsplash.com/photo-1504257404764-b2b1d311277a?w=150",
      "createdAt": "2024-02-01T00:00:00.000Z"
    },
    {
      "id": "STU036",
      "name": "Shivam Tripathi",
      "email": "shivam.tripathi@modeluni.edu",
      "password": "h$nltmy9",
      "role": "student",
      "avatar": "https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=150",
      "createdAt": "2024-02-01T00:00:00.000Z"
    },
    {
      "id": "STU037",
      "name": "Nida Fatima",
      "email": "nida.fatima@modeluni.edu",
      "password": "h$puoyfs",
      "role": "student",
      "avatar": "https://images.unsplash.com/photo-1554151228-14d9def656e4?w=150",
      "createdAt": "2024-02-01T00:00:00.000Z"
    },
    {
      "id": "STU038",
      "name": "Ananya Patel",
      "email": "student@campusx.edu",
      "password": "h$yj2on3",
      "role": "student",
      "avatar": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150",
      "createdAt": "2024-02-01T00:00:00.000Z"
    }
  ];

  // ── Initialize default users if not present ──
  function _initDefaults() {
    const existing = localStorage.getItem(USERS_KEY);
    if (!existing) {
      localStorage.setItem(USERS_KEY, JSON.stringify(DEFAULT_ACCOUNTS));
    } else {
      // Ensure default accounts always exist (in case storage was partially cleared)
      const users = JSON.parse(existing);
      let modified = false;
      DEFAULT_ACCOUNTS.forEach(function (def) {
        var foundIndex = users.findIndex(function (u) { return u.email === def.email; });
        if (foundIndex === -1) {
          users.push(def);
          modified = true;
        } else if (users[foundIndex].password !== def.password) {
          users[foundIndex].password = def.password;
          modified = true;
        }
      });
      if (modified) {
        localStorage.setItem(USERS_KEY, JSON.stringify(users));
      }
    }
  }

  // ── Internal Helpers ──

  /** Simple deterministic hash (NOT cryptographic – demo only) */
  function _hashPassword(plain) {
    var hash = 0;
    for (var i = 0; i < plain.length; i++) {
      var ch = plain.charCodeAt(i);
      hash = ((hash << 5) - hash) + ch;
      hash |= 0; // Convert to 32-bit integer
    }
    return 'h$' + Math.abs(hash).toString(36);
  }

  function _getUsers() {
    try {
      return JSON.parse(localStorage.getItem(USERS_KEY)) || [];
    } catch (e) {
      return [];
    }
  }

  function _saveUsers(users) {
    try {
      localStorage.setItem(USERS_KEY, JSON.stringify(users));
      if (typeof fetch !== 'undefined') {
        fetch('/api/db/sync', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ key: 'users_db', data: users })
        }).catch(function() {});
      }
    } catch (e) {}
  }

  if (typeof window !== 'undefined' && typeof fetch !== 'undefined') {
    fetch('/api/db/sync?key=users_db')
      .then(function(res) { return res.json(); })
      .then(function(res) {
        if (res && res.success && res.data && Array.isArray(res.data)) {
          try {
            var existing = _getUsers();
            res.data.forEach(function(u) {
              var idx = existing.findIndex(function(ex) { return ex.email === u.email; });
              if (idx === -1) {
                existing.push(u);
              }
            });
            localStorage.setItem(USERS_KEY, JSON.stringify(existing));
          } catch(e) {}
        }
      })
      .catch(function() {});
  }

  function _generateId() {
    return 'usr_' + Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
  }

  // ── Validation Helpers ──

  function validateEmail(email) {
    if (!email || typeof email !== 'string') return { valid: false, message: 'Email is required.' };
    email = email.trim();
    var re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!re.test(email)) return { valid: false, message: 'Please enter a valid email address.' };
    return { valid: true, message: '' };
  }

  function validateRequired(value, fieldName) {
    if (!value || (typeof value === 'string' && value.trim().length === 0)) {
      return { valid: false, message: (fieldName || 'This field') + ' is required.' };
    }
    return { valid: true, message: '' };
  }

  function validatePasswordMatch(password, confirm) {
    if (password !== confirm) {
      return { valid: false, message: 'Passwords do not match.' };
    }
    return { valid: true, message: '' };
  }

  /**
   * Password strength checker.
   * Returns { level: 'weak' | 'medium' | 'strong', score: 0-5 }
   */
  function checkPasswordStrength(password) {
    if (!password) return { level: 'weak', score: 0 };

    var score = 0;
    if (password.length >= 6)  score++;
    if (password.length >= 10) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    var level = 'weak';
    if (score >= 4) level = 'strong';
    else if (score >= 2) level = 'medium';

    return { level: level, score: score };
  }

  // ── Core Auth Functions ──

  /**
   * Register a new user.
   * @returns {{ success: boolean, message: string, user?: object }}
   */
  function register(name, email, password, role) {
    // Validate required
    var nameCheck = validateRequired(name, 'Full name');
    if (!nameCheck.valid) return { success: false, message: nameCheck.message };

    var emailCheck = validateEmail(email);
    if (!emailCheck.valid) return { success: false, message: emailCheck.message };

    if (!password || password.length < 6) {
      return { success: false, message: 'Password must be at least 6 characters.' };
    }

    var validRoles = ['student', 'faculty', 'admin', 'hod'];
    if (validRoles.indexOf(role) === -1) {
      return { success: false, message: 'Please select a valid role.' };
    }

    var users = _getUsers();
    var emailLower = email.trim().toLowerCase();

    // Check uniqueness
    var exists = users.find(function (u) { return u.email.toLowerCase() === emailLower; });
    if (exists) {
      return { success: false, message: 'An account with this email already exists.' };
    }

    var newUser = {
      id: _generateId(),
      name: name.trim(),
      email: emailLower,
      password: _hashPassword(password),
      role: role,
      avatar: '',
      createdAt: new Date().toISOString()
    };

    users.push(newUser);
    _saveUsers(users);

    // Return user without password
    var safeUser = Object.assign({}, newUser);
    delete safeUser.password;
    return { success: true, message: 'Account created successfully!', user: safeUser };
  }

  /**
   * Login with email and password.
   * @returns {{ success: boolean, message: string, user?: object }}
   */
  function login(email, password) {
    var emailCheck = validateEmail(email);
    if (!emailCheck.valid) return { success: false, message: emailCheck.message };

    if (!password) return { success: false, message: 'Password is required.' };

    var users = _getUsers();
    var emailLower = email.trim().toLowerCase();
    var hashedInput = _hashPassword(password);

    var user = users.find(function (u) {
      return u.email.toLowerCase() === emailLower && u.password === hashedInput;
    });

    if (!user) {
      return { success: false, message: 'Invalid email or password. Please try again.' };
    }

    // Create session
    var sessionData = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
      loginAt: new Date().toISOString()
    };

    sessionStorage.setItem(SESSION_KEY, JSON.stringify(sessionData));
    resetFailure();

    return { success: true, message: 'Login successful!', user: sessionData };
  }

  /**
   * Logout the current user.
   */
  function logout() {
    sessionStorage.removeItem(SESSION_KEY);
    window.location.href = 'auth.html';
  }

  /**
   * Check if a user is currently logged in.
   */
  function isLoggedIn() {
    try {
      var session = sessionStorage.getItem(SESSION_KEY);
      if (!session) return false;
      var data = JSON.parse(session);
      return !!(data && data.id && data.email);
    } catch (e) {
      return false;
    }
  }

  /**
   * Get the currently logged-in user's data.
   * @returns {object|null}
   */
  function getCurrentUser() {
    try {
      var session = sessionStorage.getItem(SESSION_KEY);
      if (!session) return null;
      return JSON.parse(session);
    } catch (e) {
      return null;
    }
  }

  // ── TensorFlow Anomaly Detection Logic ──
  var failureCount = 0;
  var tfModel = null;

  async function initTfModel() {
    if (typeof tf === 'undefined') return;
    try {
      tfModel = tf.sequential();
      tfModel.add(tf.layers.dense({ units: 4, activation: 'relu', inputShape: [4] }));
      tfModel.add(tf.layers.dense({ units: 1, activation: 'sigmoid' }));
      tfModel.compile({
        optimizer: tf.train.adam(0.1),
        loss: 'binaryCrossentropy'
      });
    } catch (err) {
      console.warn('TF.js init failed or was bypassed:', err);
    }
  }

  async function trainAnomalyModel() {
    if (typeof tf === 'undefined' || !tfModel) return;
    try {
      var hour = new Date().getHours();
      // Mock inputs: [emailLen, passLen, failStreak, hourOfDay]
      var trainX = tf.tensor2d([
        [15/50, 10/50, 0, 10/24],
        [18/50, 12/50, 0, 14/24],
        [20/50, 8/50, 0, 16/24],
        [5/50, 2/50, 3/5, 3/24],
        [8/50, 3/50, 4/5, 1/24],
        [10/50, 4/50, Math.min(failureCount/5, 1), hour/24]
      ], [6, 4]);
      var trainY = tf.tensor2d([
        [0], [0], [0], [1], [1], [failureCount >= 2 ? 1 : 0]
      ], [6, 1]);
      await tfModel.fit(trainX, trainY, { epochs: 10, verbose: 0 });
      trainX.dispose();
      trainY.dispose();
    } catch (err) {
      console.error('TF Anomaly training failed:', err);
    }
  }

  async function calculateLoginThreat(email, password) {
    if (typeof tf === 'undefined') return 0.01;
    try {
      if (!tfModel) {
        await initTfModel();
      }
      var emailLen = (email || '').length;
      var passLen = (password || '').length;
      var hour = new Date().getHours();

      var inputTensor = tf.tensor2d([
        [Math.min(emailLen / 50, 1), Math.min(passLen / 50, 1), Math.min(failureCount / 5, 1), hour / 24]
      ], [1, 4]);

      var output = tfModel.predict(inputTensor);
      var prob = (await output.data())[0];
      inputTensor.dispose();
      output.dispose();
      return prob;
    } catch (err) {
      return 0.01;
    }
  }

  function recordFailure() {
    failureCount++;
    if (tfModel) {
      trainAnomalyModel();
    }
  }

  function resetFailure() {
    failureCount = 0;
  }

  function getFailureCount() {
    return failureCount;
  }

  // ── Initialize on load ──
  _initDefaults();
  setTimeout(initTfModel, 500);

  // ── Public API ──
  return {
    register: register,
    login: function(email, password) {
      var res = login(email, password);
      if (!res.success) {
        recordFailure();
      }
      return res;
    },
    logout: logout,
    isLoggedIn: isLoggedIn,
    getCurrentUser: getCurrentUser,
    checkPasswordStrength: checkPasswordStrength,
    validateEmail: validateEmail,
    validateRequired: validateRequired,
    validatePasswordMatch: validatePasswordMatch,
    calculateLoginThreat: calculateLoginThreat,
    getFailureCount: getFailureCount
  };

})();
