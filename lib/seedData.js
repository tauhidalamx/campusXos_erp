// lib/seedData.js - High-speed static seed data & synchronous cache accessor

export const DEPARTMENTS = [
  {
    "code": "CS",
    "name": "Computer Science & Engineering",
    "hod": "Dr. Rajesh Sharma",
    "facultyCount": 7,
    "studentCount": 10,
    "budget": 450000,
    "color": "#4F46E5"
  },
  {
    "code": "EE",
    "name": "Electrical & Electronics Engineering",
    "hod": "Dr. Tariq Ansari",
    "facultyCount": 7,
    "studentCount": 7,
    "budget": 380000,
    "color": "#06B6D4"
  },
  {
    "code": "ME",
    "name": "Mechanical Engineering",
    "hod": "Dr. Sunita Verma",
    "facultyCount": 5,
    "studentCount": 7,
    "budget": 320000,
    "color": "#F59E0B"
  },
  {
    "code": "BI",
    "name": "Bioinformatics & Genetics",
    "hod": "Dr. Kabir Qureshi",
    "facultyCount": 4,
    "studentCount": 7,
    "budget": 280000,
    "color": "#10B981"
  },
  {
    "code": "BA",
    "name": "Business Administration",
    "hod": "Dr. Harleen Kaur",
    "facultyCount": 4,
    "studentCount": 6,
    "budget": 300000,
    "color": "#EC4899"
  }
];

export const FACULTY = [
  {
    "id": "FAC001",
    "name": "Dr. Rajesh Sharma",
    "email": "rajesh.sharma@modeluni.edu",
    "dept": "CS",
    "designation": "Professor",
    "workload": 12,
    "courses": ["CS101", "CS302"],
    "avatar": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150"
  },
  {
    "id": "FAC002",
    "name": "Dr. Tariq Ansari",
    "email": "tariq.ansari@modeluni.edu",
    "dept": "EE",
    "designation": "Professor",
    "workload": 15,
    "courses": ["EE201", "EE405"],
    "avatar": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150"
  },
  {
    "id": "FAC003",
    "name": "Dr. Sunita Verma",
    "email": "sunita.verma@modeluni.edu",
    "dept": "ME",
    "designation": "Professor",
    "workload": 9,
    "courses": ["ME102"],
    "avatar": "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150"
  },
  {
    "id": "FAC004",
    "name": "Dr. Kabir Qureshi",
    "email": "kabir.qureshi@modeluni.edu",
    "dept": "BI",
    "designation": "Associate Professor",
    "workload": 12,
    "courses": ["BI101", "BI304"],
    "avatar": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150"
  },
  {
    "id": "FAC005",
    "name": "Dr. Harleen Kaur",
    "email": "harleen.kaur@modeluni.edu",
    "dept": "BA",
    "designation": "Professor",
    "workload": 15,
    "courses": ["BA201", "BA410"],
    "avatar": "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150"
  },
  {
    "id": "FAC006",
    "name": "Prof. Ramesh Shastri",
    "email": "ramesh.shastri@modeluni.edu",
    "dept": "CS",
    "designation": "Assistant Professor",
    "workload": 18,
    "courses": ["CS202", "CS401"],
    "avatar": "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150"
  },
  {
    "id": "FAC007",
    "name": "Dr. Fatima Khan",
    "email": "fatima.khan@modeluni.edu",
    "dept": "CS",
    "designation": "Associate Professor",
    "workload": 12,
    "courses": ["CS305"],
    "avatar": "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150"
  },
  {
    "id": "FAC008",
    "name": "Prof. Gurpreet Singh",
    "email": "gurpreet.singh@modeluni.edu",
    "dept": "EE",
    "designation": "Assistant Professor",
    "workload": 15,
    "courses": ["EE101", "EE302"],
    "avatar": "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150"
  },
  {
    "id": "FAC009",
    "name": "Dr. Rohan D'Souza",
    "email": "rohan.dsouza@modeluni.edu",
    "dept": "EE",
    "designation": "Professor",
    "workload": 6,
    "courses": ["EE305"],
    "avatar": "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150"
  },
  {
    "id": "FAC010",
    "name": "Dr. Ananya Mukherjee",
    "email": "ananya.mukherjee@modeluni.edu",
    "dept": "CS",
    "designation": "Professor",
    "workload": 8,
    "courses": ["CS101"],
    "avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150"
  },
  {
    "id": "FAC011",
    "name": "Dr. Syed Zaid Ali",
    "email": "zaid.ali@modeluni.edu",
    "dept": "EE",
    "designation": "Associate Professor",
    "workload": 13,
    "courses": ["EE101"],
    "avatar": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150"
  },
  {
    "id": "FAC012",
    "name": "Dr. Sneha Fernandes",
    "email": "sneha.fernandes@modeluni.edu",
    "dept": "ME",
    "designation": "Assistant Professor",
    "workload": 16,
    "courses": ["ME102"],
    "avatar": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150"
  },
  {
    "id": "FAC013",
    "name": "Dr. Vikramaditya Reddy",
    "email": "vikram.reddy@modeluni.edu",
    "dept": "BI",
    "designation": "Professor",
    "workload": 10,
    "courses": ["BI101"],
    "avatar": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150"
  },
  {
    "id": "FAC014",
    "name": "Dr. Ayesha Siddiqui",
    "email": "ayesha.siddiqui@modeluni.edu",
    "dept": "BA",
    "designation": "Associate Professor",
    "workload": 12,
    "courses": ["BA201"],
    "avatar": "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150"
  },
  {
    "id": "FAC015",
    "name": "Dr. Siddharth Jain",
    "email": "siddharth.jain@modeluni.edu",
    "dept": "CS",
    "designation": "Assistant Professor",
    "workload": 10,
    "courses": ["CS101"],
    "avatar": "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150"
  },
  {
    "id": "FAC016",
    "name": "Dr. Jaspreet Kaur",
    "email": "jaspreet.kaur@modeluni.edu",
    "dept": "EE",
    "designation": "Professor",
    "workload": 18,
    "courses": ["EE101"],
    "avatar": "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150"
  },
  {
    "id": "FAC017",
    "name": "Dr. Priya Nair",
    "email": "priya.nair@modeluni.edu",
    "dept": "ME",
    "designation": "Associate Professor",
    "workload": 13,
    "courses": ["ME102"],
    "avatar": "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150"
  },
  {
    "id": "FAC018",
    "name": "Dr. Mohammad Imran",
    "email": "mohammad.imran@modeluni.edu",
    "dept": "BI",
    "designation": "Assistant Professor",
    "workload": 13,
    "courses": ["BI101"],
    "avatar": "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150"
  },
  {
    "id": "FAC019",
    "name": "Dr. Deepa Iyer",
    "email": "deepa.iyer@modeluni.edu",
    "dept": "BA",
    "designation": "Professor",
    "workload": 10,
    "courses": ["BA201"],
    "avatar": "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150"
  },
  {
    "id": "FAC020",
    "name": "Dr. Manpreet Singh",
    "email": "manpreet.singh@modeluni.edu",
    "dept": "CS",
    "designation": "Associate Professor",
    "workload": 9,
    "courses": ["CS101"],
    "avatar": "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150"
  },
  {
    "id": "FAC021",
    "name": "Dr. Sameer Ahmed",
    "email": "sameer.ahmed@modeluni.edu",
    "dept": "EE",
    "designation": "Assistant Professor",
    "workload": 16,
    "courses": ["EE101"],
    "avatar": "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150"
  },
  {
    "id": "FAC022",
    "name": "Dr. Kavita Bose",
    "email": "kavita.bose@modeluni.edu",
    "dept": "ME",
    "designation": "Professor",
    "workload": 17,
    "courses": ["ME102"],
    "avatar": "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=150"
  },
  {
    "id": "FAC023",
    "name": "Dr. Amitav Ghosh",
    "email": "amitav.ghosh@modeluni.edu",
    "dept": "BI",
    "designation": "Associate Professor",
    "workload": 12,
    "courses": ["BI101"],
    "avatar": "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150"
  },
  {
    "id": "FAC024",
    "name": "Dr. Zubin Mehta",
    "email": "zubin.mehta@modeluni.edu",
    "dept": "BA",
    "designation": "Assistant Professor",
    "workload": 10,
    "courses": ["BA201"],
    "avatar": "https://images.unsplash.com/photo-1542909168-82c3e7fdca5c?w=150"
  },
  {
    "id": "FAC025",
    "name": "Dr. Arvind Swaminathan",
    "email": "arvind.swaminathan@modeluni.edu",
    "dept": "CS",
    "designation": "Professor",
    "workload": 10,
    "courses": ["CS101"],
    "avatar": "https://images.unsplash.com/photo-1527983359383-4758693f760c?w=150"
  },
  {
    "id": "FAC026",
    "name": "Dr. Zainab Begum",
    "email": "zainab.begum@modeluni.edu",
    "dept": "EE",
    "designation": "Associate Professor",
    "workload": 10,
    "courses": ["EE101"],
    "avatar": "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=150"
  },
  {
    "id": "FAC027",
    "name": "Dr. Kevin Thomas",
    "email": "kevin.thomas@modeluni.edu",
    "dept": "ME",
    "designation": "Assistant Professor",
    "workload": 11,
    "courses": ["ME102"],
    "avatar": "https://images.unsplash.com/photo-1554151228-14d9def656e4?w=150"
  }
];

export const COURSES = [
  {
    "code": "CS101",
    "title": "Introduction to Programming",
    "dept": "CS",
    "credits": 4,
    "facultyId": "FAC001",
    "maxEnrollment": 120,
    "enrolledCount": 110,
    "status": "Active"
  },
  {
    "code": "CS202",
    "title": "Data Structures & Algorithms",
    "dept": "CS",
    "credits": 4,
    "facultyId": "FAC006",
    "maxEnrollment": 80,
    "enrolledCount": 78,
    "status": "Active"
  },
  {
    "code": "CS302",
    "title": "Database Management Systems",
    "dept": "CS",
    "credits": 3,
    "facultyId": "FAC001",
    "maxEnrollment": 90,
    "enrolledCount": 88,
    "status": "Active"
  },
  {
    "code": "CS305",
    "title": "Software Engineering",
    "dept": "CS",
    "credits": 3,
    "facultyId": "FAC007",
    "maxEnrollment": 80,
    "enrolledCount": 75,
    "status": "Active"
  },
  {
    "code": "CS401",
    "title": "Artificial Intelligence & ML",
    "dept": "CS",
    "credits": 4,
    "facultyId": "FAC006",
    "maxEnrollment": 50,
    "enrolledCount": 49,
    "status": "Active"
  },
  {
    "code": "EE101",
    "title": "Basic Electrical Sciences",
    "dept": "EE",
    "credits": 3,
    "facultyId": "FAC008",
    "maxEnrollment": 100,
    "enrolledCount": 92,
    "status": "Active"
  },
  {
    "code": "EE201",
    "title": "Signals and Systems",
    "dept": "EE",
    "credits": 4,
    "facultyId": "FAC002",
    "maxEnrollment": 80,
    "enrolledCount": 65,
    "status": "Active"
  },
  {
    "code": "EE302",
    "title": "Microprocessors & Embedded Systems",
    "dept": "EE",
    "credits": 4,
    "facultyId": "FAC008",
    "maxEnrollment": 75,
    "enrolledCount": 72,
    "status": "Active"
  },
  {
    "code": "EE305",
    "title": "Electromagnetics & Quantum Physics",
    "dept": "EE",
    "credits": 3,
    "facultyId": "FAC009",
    "maxEnrollment": 60,
    "enrolledCount": 45,
    "status": "Active"
  },
  {
    "code": "ME102",
    "title": "Engineering Thermodynamics",
    "dept": "ME",
    "credits": 4,
    "facultyId": "FAC003",
    "maxEnrollment": 90,
    "enrolledCount": 82,
    "status": "Active"
  },
  {
    "code": "BI101",
    "title": "Fundamentals of Biotechnology",
    "dept": "BI",
    "credits": 3,
    "facultyId": "FAC004",
    "maxEnrollment": 80,
    "enrolledCount": 68,
    "status": "Active"
  },
  {
    "code": "BI304",
    "title": "Genomics & Proteomics",
    "dept": "BI",
    "credits": 4,
    "facultyId": "FAC004",
    "maxEnrollment": 40,
    "enrolledCount": 38,
    "status": "Active"
  },
  {
    "code": "BA201",
    "title": "Organizational Behavior",
    "dept": "BA",
    "credits": 3,
    "facultyId": "FAC005",
    "maxEnrollment": 100,
    "enrolledCount": 95,
    "status": "Active"
  }
];

export const STUDENTS = [
  {
    "id": "STU001",
    "name": "Aarav Sharma",
    "email": "aarav.sharma@modeluni.edu",
    "dept": "CS",
    "gpa": 3.82,
    "semester": 6,
    "status": "Active",
    "feePaid": 4500,
    "feeTotal": 4500,
    "avatar": "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150",
    "attendance": 92,
    "courses": ["CS202", "CS302", "CS305"],
    "dob": "2004-03-15",
    "gender": "Male",
    "phone": "+91-98765-01001",
    "guardianName": "Rajesh Sharma",
    "guardianPhone": "+91-98765-01002",
    "admissionDate": "2023-08-20"
  },
  {
    "id": "STU002",
    "name": "Fatima Zohra",
    "email": "fatima.zohra@modeluni.edu",
    "dept": "CS",
    "gpa": 3.95,
    "semester": 4,
    "status": "Active",
    "feePaid": 4500,
    "feeTotal": 4500,
    "avatar": "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150",
    "attendance": 98,
    "courses": ["CS101", "CS202", "CS305"],
    "dob": "2005-07-22",
    "gender": "Female",
    "phone": "+91-98765-01003",
    "guardianName": "Tariq Zohra",
    "guardianPhone": "+91-98765-01004",
    "admissionDate": "2024-08-18"
  },
  {
    "id": "STU003",
    "name": "Jaspreet Singh",
    "email": "jaspreet.singh@modeluni.edu",
    "dept": "CS",
    "gpa": 3.45,
    "semester": 6,
    "status": "Active",
    "feePaid": 3000,
    "feeTotal": 4500,
    "avatar": "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150",
    "attendance": 85,
    "courses": ["CS202", "CS401"],
    "dob": "2004-01-10",
    "gender": "Male",
    "phone": "+91-98765-01005",
    "guardianName": "Gurvinder Singh",
    "guardianPhone": "+91-98765-01006",
    "admissionDate": "2023-08-20"
  },
  {
    "id": "STU004",
    "name": "Elena Rostova",
    "email": "elena.rostova@modeluni.edu",
    "dept": "CS",
    "gpa": 3.78,
    "semester": 8,
    "status": "Active",
    "feePaid": 4500,
    "feeTotal": 4500,
    "avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
    "attendance": 91,
    "courses": ["CS401", "CS305"],
    "dob": "2003-11-05",
    "gender": "Female",
    "phone": "+91-98765-01007",
    "guardianName": "Ivan Rostova",
    "guardianPhone": "+91-98765-01008",
    "admissionDate": "2022-08-15"
  },
  {
    "id": "STU005",
    "name": "Marcus Brody",
    "email": "marcus.brody@modeluni.edu",
    "dept": "EE",
    "gpa": 3.65,
    "semester": 4,
    "status": "Active",
    "feePaid": 4200,
    "feeTotal": 4200,
    "avatar": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150",
    "attendance": 89,
    "courses": ["EE201", "EE302"],
    "dob": "2005-02-14",
    "gender": "Male",
    "phone": "+91-98765-01009",
    "guardianName": "Harold Brody",
    "guardianPhone": "+91-98765-01010",
    "admissionDate": "2024-08-18"
  },
  {
    "id": "STU006",
    "name": "Ananya Patel",
    "email": "ananya.patel@modeluni.edu",
    "dept": "EE",
    "gpa": 3.91,
    "semester": 6,
    "status": "Active",
    "feePaid": 4200,
    "feeTotal": 4200,
    "avatar": "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150",
    "attendance": 96,
    "courses": ["EE302", "EE305"],
    "dob": "2004-09-19",
    "gender": "Female",
    "phone": "+91-98765-01011",
    "guardianName": "Suresh Patel",
    "guardianPhone": "+91-98765-01012",
    "admissionDate": "2023-08-20"
  },
  {
    "id": "STU007",
    "name": "Devendra Verma",
    "email": "devendra.verma@modeluni.edu",
    "dept": "ME",
    "gpa": 3.52,
    "semester": 2,
    "status": "Active",
    "feePaid": 4000,
    "feeTotal": 4000,
    "avatar": "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150",
    "attendance": 88,
    "courses": ["ME102"],
    "dob": "2006-05-12",
    "gender": "Male",
    "phone": "+91-98765-01013",
    "guardianName": "Sunita Verma",
    "guardianPhone": "+91-98765-01014",
    "admissionDate": "2025-08-20"
  },
  {
    "id": "STU008",
    "name": "Zoya Akhtar",
    "email": "zoya.akhtar@modeluni.edu",
    "dept": "BI",
    "gpa": 3.88,
    "semester": 4,
    "status": "Active",
    "feePaid": 3800,
    "feeTotal": 3800,
    "avatar": "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150",
    "attendance": 94,
    "courses": ["BI101", "BI304"],
    "dob": "2005-04-18",
    "gender": "Female",
    "phone": "+91-98765-01015",
    "guardianName": "Javed Akhtar",
    "guardianPhone": "+91-98765-01016",
    "admissionDate": "2024-08-18"
  },
  {
    "id": "STU009",
    "name": "Karan Malhotra",
    "email": "karan.malhotra@modeluni.edu",
    "dept": "BA",
    "gpa": 3.71,
    "semester": 4,
    "status": "Active",
    "feePaid": 4500,
    "feeTotal": 4500,
    "avatar": "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150",
    "attendance": 90,
    "courses": ["BA201"],
    "dob": "2005-08-30",
    "gender": "Male",
    "phone": "+91-98765-01017",
    "guardianName": "Yash Malhotra",
    "guardianPhone": "+91-98765-01018",
    "admissionDate": "2024-08-18"
  }
];

export const TRANSACTIONS = [
  {
    "txId": "TXN8971",
    "studentId": "STU001",
    "studentName": "Aarav Sharma",
    "amount": 4500,
    "date": "2026-05-10",
    "status": "Paid",
    "method": "Credit Card"
  },
  {
    "txId": "TXN8972",
    "studentId": "STU002",
    "studentName": "Fatima Zohra",
    "amount": 4500,
    "date": "2026-05-12",
    "status": "Paid",
    "method": "Net Banking"
  },
  {
    "txId": "TXN8973",
    "studentId": "STU003",
    "studentName": "Jaspreet Singh",
    "amount": 3000,
    "date": "2026-05-15",
    "status": "Partial",
    "method": "UPI"
  },
  {
    "txId": "TXN8974",
    "studentId": "STU006",
    "studentName": "Ananya Patel",
    "amount": 4200,
    "date": "2026-05-18",
    "status": "Paid",
    "method": "UPI"
  },
  {
    "txId": "TXN8975",
    "studentId": "STU005",
    "studentName": "Devendra Verma",
    "amount": 4000,
    "date": "2026-05-20",
    "status": "Paid",
    "method": "Debit Card"
  }
];

export const EXAMS = [
  {
    "code": "CS101",
    "name": "Intro Programming Mid-Term",
    "date": "2026-06-12",
    "time": "10:00 AM",
    "venue": "Hall A"
  },
  {
    "code": "CS202",
    "name": "Data Structures Final",
    "date": "2026-06-15",
    "time": "02:00 PM",
    "venue": "Lab 3"
  },
  {
    "code": "EE201",
    "name": "Signals and Systems Exam",
    "date": "2026-06-16",
    "time": "09:00 AM",
    "venue": "Hall B"
  },
  {
    "code": "BA201",
    "name": "Org Behavior Presentation",
    "date": "2026-06-18",
    "time": "11:00 AM",
    "venue": "Seminar Room"
  },
  {
    "code": "ME102",
    "name": "Thermodynamics Exam",
    "date": "2026-06-20",
    "time": "02:00 PM",
    "venue": "Hall C"
  }
];

export const ANNOUNCEMENTS = [
  {
    "id": 1,
    "title": "Summer Semester Enrollment Open",
    "content": "Enrollment for the summer crash courses will remain open until June 15th. Apply via academic cell.",
    "date": "2026-06-08",
    "tag": "Academic",
    "color": "var(--primary)"
  },
  {
    "id": 2,
    "title": "Annual Cultural Fest: Nebula 2026",
    "content": "Nebula cultural festival planning begins this Friday. Interested volunteers contact Student Union representatives.",
    "date": "2026-06-06",
    "tag": "Event",
    "color": "var(--accent-emerald)"
  },
  {
    "id": 3,
    "title": "Network Maintenance Downtime",
    "content": "The primary campus server rack and Wi-Fi system will undergo maintenance on Saturday, 12:00 AM to 04:00 AM.",
    "date": "2026-06-05",
    "tag": "System",
    "color": "var(--accent-ruby)"
  }
];

export const RECENT_ACTIVITIES = [
  {
    "text": "Admission registry updated for Fall 2026 intake.",
    "time": "2 hours ago"
  },
  {
    "text": "Prof. Turing posted attendance record for CS202.",
    "time": "4 hours ago"
  },
  {
    "text": "Student STU011 fee collection status flagged pending.",
    "time": "1 day ago"
  },
  {
    "text": "Dr. Sterling approved grade change sheet for CS302.",
    "time": "2 days ago"
  }
];

// Helper to get persistent local data with instant synchronous fallback
export function getPersistentData(key, fallback) {
  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      const stored = window.localStorage.getItem('campusx_db_' + key);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {}
  }
  return fallback;
}

// Helper to save persistent local data and dispatch custom event
export function savePersistentData(key, data) {
  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      window.localStorage.setItem('campusx_db_' + key, JSON.stringify(data));
      window.dispatchEvent(new CustomEvent('campusx_db_sync_event', { detail: { key, data } }));
    } catch (e) {}
  }
}
