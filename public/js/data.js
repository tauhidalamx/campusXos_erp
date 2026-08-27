// University ERP Mock Database — Expanded Full Model
window.UniversityDB = (function() {

  const DEPARTMENTS = [
  {
    "code": "CS",
    "name": "Computer Science & Engineering",
    "hod": "Dr. Rajesh Sharma",
    "facultyCount": 7,
    "studentCount": 10,
    "budget": 450000,
    "color": "var(--primary)"
  },
  {
    "code": "EE",
    "name": "Electrical & Electronics Engineering",
    "hod": "Dr. Tariq Ansari",
    "facultyCount": 7,
    "studentCount": 7,
    "budget": 380000,
    "color": "var(--accent-cyan)"
  },
  {
    "code": "ME",
    "name": "Mechanical Engineering",
    "hod": "Dr. Sunita Verma",
    "facultyCount": 5,
    "studentCount": 7,
    "budget": 320000,
    "color": "var(--accent-amber)"
  },
  {
    "code": "BI",
    "name": "Bioinformatics & Genetics",
    "hod": "Dr. Kabir Qureshi",
    "facultyCount": 4,
    "studentCount": 7,
    "budget": 280000,
    "color": "var(--accent-emerald)"
  },
  {
    "code": "BA",
    "name": "Business Administration",
    "hod": "Dr. Harleen Kaur",
    "facultyCount": 4,
    "studentCount": 6,
    "budget": 300000,
    "color": "var(--accent-ruby)"
  }
];

  const FACULTY = [
  {
    "id": "FAC001",
    "name": "Dr. Rajesh Sharma",
    "email": "rajesh.sharma@modeluni.edu",
    "dept": "CS",
    "designation": "Professor",
    "workload": 12,
    "courses": [
      "CS101",
      "CS302"
    ],
    "avatar": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150"
  },
  {
    "id": "FAC002",
    "name": "Dr. Tariq Ansari",
    "email": "tariq.ansari@modeluni.edu",
    "dept": "EE",
    "designation": "Professor",
    "workload": 15,
    "courses": [
      "EE201",
      "EE405"
    ],
    "avatar": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150"
  },
  {
    "id": "FAC003",
    "name": "Dr. Sunita Verma",
    "email": "sunita.verma@modeluni.edu",
    "dept": "ME",
    "designation": "Professor",
    "workload": 9,
    "courses": [
      "ME102"
    ],
    "avatar": "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150"
  },
  {
    "id": "FAC004",
    "name": "Dr. Kabir Qureshi",
    "email": "kabir.qureshi@modeluni.edu",
    "dept": "BI",
    "designation": "Associate Professor",
    "workload": 12,
    "courses": [
      "BI101",
      "BI304"
    ],
    "avatar": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150"
  },
  {
    "id": "FAC005",
    "name": "Dr. Harleen Kaur",
    "email": "harleen.kaur@modeluni.edu",
    "dept": "BA",
    "designation": "Professor",
    "workload": 15,
    "courses": [
      "BA201",
      "BA410"
    ],
    "avatar": "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150"
  },
  {
    "id": "FAC006",
    "name": "Prof. Ramesh Shastri",
    "email": "ramesh.shastri@modeluni.edu",
    "dept": "CS",
    "designation": "Assistant Professor",
    "workload": 18,
    "courses": [
      "CS202",
      "CS401"
    ],
    "avatar": "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150"
  },
  {
    "id": "FAC007",
    "name": "Dr. Fatima Khan",
    "email": "fatima.khan@modeluni.edu",
    "dept": "CS",
    "designation": "Associate Professor",
    "workload": 12,
    "courses": [
      "CS305"
    ],
    "avatar": "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150"
  },
  {
    "id": "FAC008",
    "name": "Prof. Gurpreet Singh",
    "email": "gurpreet.singh@modeluni.edu",
    "dept": "EE",
    "designation": "Assistant Professor",
    "workload": 15,
    "courses": [
      "EE101",
      "EE302"
    ],
    "avatar": "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150"
  },
  {
    "id": "FAC009",
    "name": "Dr. Rohan D'Souza",
    "email": "rohan.dsouza@modeluni.edu",
    "dept": "EE",
    "designation": "Professor",
    "workload": 6,
    "courses": [
      "EE305"
    ],
    "avatar": "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150"
  },
  {
    "id": "FAC010",
    "name": "Dr. Ananya Mukherjee",
    "email": "ananya.mukherjee@modeluni.edu",
    "dept": "CS",
    "designation": "Professor",
    "workload": 8,
    "courses": [
      "CS101"
    ],
    "avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150"
  },
  {
    "id": "FAC011",
    "name": "Dr. Syed Zaid Ali",
    "email": "zaid.ali@modeluni.edu",
    "dept": "EE",
    "designation": "Associate Professor",
    "workload": 13,
    "courses": [
      "EE101"
    ],
    "avatar": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150"
  },
  {
    "id": "FAC012",
    "name": "Dr. Sneha Fernandes",
    "email": "sneha.fernandes@modeluni.edu",
    "dept": "ME",
    "designation": "Assistant Professor",
    "workload": 16,
    "courses": [
      "ME102"
    ],
    "avatar": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150"
  },
  {
    "id": "FAC013",
    "name": "Dr. Vikramaditya Reddy",
    "email": "vikram.reddy@modeluni.edu",
    "dept": "BI",
    "designation": "Professor",
    "workload": 10,
    "courses": [
      "BI101"
    ],
    "avatar": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150"
  },
  {
    "id": "FAC014",
    "name": "Dr. Ayesha Siddiqui",
    "email": "ayesha.siddiqui@modeluni.edu",
    "dept": "BA",
    "designation": "Associate Professor",
    "workload": 12,
    "courses": [
      "BA201"
    ],
    "avatar": "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150"
  },
  {
    "id": "FAC015",
    "name": "Dr. Siddharth Jain",
    "email": "siddharth.jain@modeluni.edu",
    "dept": "CS",
    "designation": "Assistant Professor",
    "workload": 10,
    "courses": [
      "CS101"
    ],
    "avatar": "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150"
  },
  {
    "id": "FAC016",
    "name": "Dr. Jaspreet Kaur",
    "email": "jaspreet.kaur@modeluni.edu",
    "dept": "EE",
    "designation": "Professor",
    "workload": 18,
    "courses": [
      "EE101"
    ],
    "avatar": "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150"
  },
  {
    "id": "FAC017",
    "name": "Dr. Priya Nair",
    "email": "priya.nair@modeluni.edu",
    "dept": "ME",
    "designation": "Associate Professor",
    "workload": 13,
    "courses": [
      "ME102"
    ],
    "avatar": "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150"
  },
  {
    "id": "FAC018",
    "name": "Dr. Mohammad Imran",
    "email": "mohammad.imran@modeluni.edu",
    "dept": "BI",
    "designation": "Assistant Professor",
    "workload": 13,
    "courses": [
      "BI101"
    ],
    "avatar": "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150"
  },
  {
    "id": "FAC019",
    "name": "Dr. Deepa Iyer",
    "email": "deepa.iyer@modeluni.edu",
    "dept": "BA",
    "designation": "Professor",
    "workload": 10,
    "courses": [
      "BA201"
    ],
    "avatar": "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150"
  },
  {
    "id": "FAC020",
    "name": "Dr. Manpreet Singh",
    "email": "manpreet.singh@modeluni.edu",
    "dept": "CS",
    "designation": "Associate Professor",
    "workload": 9,
    "courses": [
      "CS101"
    ],
    "avatar": "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150"
  },
  {
    "id": "FAC021",
    "name": "Dr. Sameer Ahmed",
    "email": "sameer.ahmed@modeluni.edu",
    "dept": "EE",
    "designation": "Assistant Professor",
    "workload": 16,
    "courses": [
      "EE101"
    ],
    "avatar": "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150"
  },
  {
    "id": "FAC022",
    "name": "Dr. Kavita Bose",
    "email": "kavita.bose@modeluni.edu",
    "dept": "ME",
    "designation": "Professor",
    "workload": 17,
    "courses": [
      "ME102"
    ],
    "avatar": "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=150"
  },
  {
    "id": "FAC023",
    "name": "Dr. Amitav Ghosh",
    "email": "amitav.ghosh@modeluni.edu",
    "dept": "BI",
    "designation": "Associate Professor",
    "workload": 12,
    "courses": [
      "BI101"
    ],
    "avatar": "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150"
  },
  {
    "id": "FAC024",
    "name": "Dr. Zubin Mehta",
    "email": "zubin.mehta@modeluni.edu",
    "dept": "BA",
    "designation": "Assistant Professor",
    "workload": 10,
    "courses": [
      "BA201"
    ],
    "avatar": "https://images.unsplash.com/photo-1542909168-82c3e7fdca5c?w=150"
  },
  {
    "id": "FAC025",
    "name": "Dr. Arvind Swaminathan",
    "email": "arvind.swaminathan@modeluni.edu",
    "dept": "CS",
    "designation": "Professor",
    "workload": 10,
    "courses": [
      "CS101"
    ],
    "avatar": "https://images.unsplash.com/photo-1527983359383-4758693f760c?w=150"
  },
  {
    "id": "FAC026",
    "name": "Dr. Zainab Begum",
    "email": "zainab.begum@modeluni.edu",
    "dept": "EE",
    "designation": "Associate Professor",
    "workload": 10,
    "courses": [
      "EE101"
    ],
    "avatar": "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=150"
  },
  {
    "id": "FAC027",
    "name": "Dr. Kevin Thomas",
    "email": "kevin.thomas@modeluni.edu",
    "dept": "ME",
    "designation": "Assistant Professor",
    "workload": 11,
    "courses": [
      "ME102"
    ],
    "avatar": "https://images.unsplash.com/photo-1554151228-14d9def656e4?w=150"
  }
];

  const COURSES = [
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

  const STUDENTS = [
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
    "courses": [
      "CS202",
      "CS302",
      "CS305"
    ],
    "dob": "2004-03-15",
    "gender": "Male",
    "phone": "+91-98765-01001",
    "bloodGroup": "O+",
    "nationality": "Indian",
    "address": "14 Park Street, New Delhi, 110001",
    "guardianName": "Rajesh Sharma",
    "guardianPhone": "+91-98765-01002",
    "guardianRelation": "Father",
    "admissionDate": "2023-08-20",
    "enrollmentType": "Regular",
    "hostel": "Block A - Room 204",
    "scholarship": "Merit Scholarship (40%)",
    "category": "General",
    "aadhar": "9876-5432-1001",
    "previousSchool": "Delhi Public School"
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
    "courses": [
      "CS101",
      "CS202",
      "CS305"
    ],
    "dob": "2005-07-22",
    "gender": "Female",
    "phone": "+91-98765-01003",
    "bloodGroup": "A+",
    "nationality": "Indian",
    "address": "88 Jubilee Hills, Hyderabad, TS 500033",
    "guardianName": "Tariq Zohra",
    "guardianPhone": "+91-98765-01004",
    "guardianRelation": "Father",
    "admissionDate": "2024-08-18",
    "enrollmentType": "Regular",
    "hostel": "Block B - Room 112",
    "scholarship": "Dean's List Scholarship (60%)",
    "category": "General",
    "aadhar": "9876-5432-1002",
    "previousSchool": "Hyderabad International School"
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
    "courses": [
      "CS202",
      "CS302",
      "CS401"
    ],
    "dob": "2004-01-10",
    "gender": "Male",
    "phone": "+91-98765-01005",
    "bloodGroup": "B+",
    "nationality": "Indian",
    "address": "22 Mall Road, Amritsar, PB 143001",
    "guardianName": "Gurpreet Singh",
    "guardianPhone": "+91-98765-01006",
    "guardianRelation": "Father",
    "admissionDate": "2023-08-20",
    "enrollmentType": "Regular",
    "hostel": "Day Scholar",
    "scholarship": "None",
    "category": "General",
    "aadhar": "9876-5432-1003",
    "previousSchool": "Amritsar High School"
  },
  {
    "id": "STU004",
    "name": "Ananya Patel",
    "email": "ananya.patel@modeluni.edu",
    "dept": "BI",
    "gpa": 3.68,
    "semester": 2,
    "status": "Active",
    "feePaid": 4000,
    "feeTotal": 4000,
    "avatar": "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150",
    "attendance": 94,
    "courses": [
      "BI101",
      "CS101"
    ],
    "dob": "2006-11-05",
    "gender": "Female",
    "phone": "+91-98765-01007",
    "bloodGroup": "AB+",
    "nationality": "Indian",
    "address": "14 CG Road, Ahmedabad, GJ 380009",
    "guardianName": "Vikram Patel",
    "guardianPhone": "+91-98765-01008",
    "guardianRelation": "Father",
    "admissionDate": "2025-08-15",
    "enrollmentType": "Regular",
    "hostel": "Block C - Room 305",
    "scholarship": "Sports Scholarship (25%)",
    "category": "General",
    "aadhar": "9876-5432-1004",
    "previousSchool": "Ahmedabad Public School"
  },
  {
    "id": "STU005",
    "name": "Mohammad Bilal",
    "email": "mohammad.bilal@modeluni.edu",
    "dept": "EE",
    "gpa": 2.95,
    "semester": 4,
    "status": "Active",
    "feePaid": 4200,
    "feeTotal": 4200,
    "avatar": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150",
    "attendance": 78,
    "courses": [
      "EE201",
      "EE302"
    ],
    "dob": "2005-05-28",
    "gender": "Male",
    "phone": "+91-98765-01009",
    "bloodGroup": "O-",
    "nationality": "Indian",
    "address": "56 MG Road, Lucknow, UP 226001",
    "guardianName": "Shahid Bilal",
    "guardianPhone": "+91-98765-01010",
    "guardianRelation": "Father",
    "admissionDate": "2024-08-18",
    "enrollmentType": "Lateral Entry",
    "hostel": "Block A - Room 310",
    "scholarship": "Need-Based Aid (30%)",
    "category": "OBC",
    "aadhar": "9876-5432-1005",
    "previousSchool": "LA Technical Institute"
  },
  {
    "id": "STU006",
    "name": "Priya Sharma",
    "email": "priya.sharma@modeluni.edu",
    "dept": "CS",
    "gpa": 3.75,
    "semester": 8,
    "status": "Active",
    "feePaid": 4500,
    "feeTotal": 4500,
    "avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
    "attendance": 90,
    "courses": [
      "CS302",
      "CS401"
    ],
    "dob": "2003-09-14",
    "gender": "Female",
    "phone": "+91-98765-43210",
    "bloodGroup": "A-",
    "nationality": "Indian-American",
    "address": "12 MG Road, Indore, MP 452001, India",
    "guardianName": "Rajesh Patel",
    "guardianPhone": "+91-98765-43211",
    "guardianRelation": "Father",
    "admissionDate": "2022-08-22",
    "enrollmentType": "Regular",
    "hostel": "Block B - Room 401",
    "scholarship": "Merit Scholarship (50%)",
    "category": "General",
    "aadhar": "9876-5432-1006",
    "previousSchool": "Delhi Public School, Indore"
  },
  {
    "id": "STU007",
    "name": "Rohan D'Silva",
    "email": "rohan.dsilva@modeluni.edu",
    "dept": "ME",
    "gpa": 3.12,
    "semester": 6,
    "status": "Active",
    "feePaid": 1500,
    "feeTotal": 4200,
    "avatar": "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150",
    "attendance": 81,
    "courses": [
      "ME102",
      "EE101"
    ],
    "dob": "2004-06-30",
    "gender": "Male",
    "phone": "+1-555-0701",
    "bloodGroup": "B-",
    "nationality": "American",
    "address": "789 Industrial Ave, Detroit, MI 48201",
    "guardianName": "Henry Brody",
    "guardianPhone": "+1-555-0702",
    "guardianRelation": "Father",
    "admissionDate": "2023-08-20",
    "enrollmentType": "Regular",
    "hostel": "Day Scholar",
    "scholarship": "None",
    "category": "General",
    "aadhar": "9876-5432-1007",
    "previousSchool": "Detroit Cass Technical HS"
  },
  {
    "id": "STU008",
    "name": "Sara Ali",
    "email": "sara.ali@modeluni.edu",
    "dept": "BA",
    "gpa": 3.9,
    "semester": 4,
    "status": "Active",
    "feePaid": 3800,
    "feeTotal": 3800,
    "avatar": "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150",
    "attendance": 96,
    "courses": [
      "BA201",
      "CS101"
    ],
    "dob": "2005-12-02",
    "gender": "Female",
    "phone": "+7-495-555-0801",
    "bloodGroup": "O+",
    "nationality": "Russian-American",
    "address": "34 Broadway, New York, NY 10006",
    "guardianName": "Viktor Rostov",
    "guardianPhone": "+7-495-555-0802",
    "guardianRelation": "Father",
    "admissionDate": "2024-08-18",
    "enrollmentType": "Regular",
    "hostel": "Block C - Room 201",
    "scholarship": "International Student Grant (35%)",
    "category": "International",
    "aadhar": "N/A",
    "previousSchool": "Moscow International Academy"
  },
  {
    "id": "STU009",
    "name": "Devendra Verma",
    "email": "devendra.verma@modeluni.edu",
    "dept": "EE",
    "gpa": 3.54,
    "semester": 8,
    "status": "Active",
    "feePaid": 4200,
    "feeTotal": 4200,
    "avatar": "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150",
    "attendance": 89,
    "courses": [
      "EE302",
      "EE305"
    ],
    "dob": "2003-04-18",
    "gender": "Male",
    "phone": "+1-555-0901",
    "bloodGroup": "AB-",
    "nationality": "American",
    "address": "567 Tech Park, Seattle, WA 98101",
    "guardianName": "Susan Miller",
    "guardianPhone": "+1-555-0902",
    "guardianRelation": "Mother",
    "admissionDate": "2022-08-22",
    "enrollmentType": "Regular",
    "hostel": "Block A - Room 108",
    "scholarship": "Research Assistantship",
    "category": "General",
    "aadhar": "9876-5432-1009",
    "previousSchool": "Seattle STEM Academy"
  },
  {
    "id": "STU010",
    "name": "Simran Kaur",
    "email": "simran.kaur@modeluni.edu",
    "dept": "BI",
    "gpa": 3.61,
    "semester": 6,
    "status": "On Leave",
    "feePaid": 2000,
    "feeTotal": 4000,
    "avatar": "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150",
    "attendance": 0,
    "courses": [],
    "dob": "2004-08-09",
    "gender": "Female",
    "phone": "+380-44-555-1001",
    "bloodGroup": "A+",
    "nationality": "Ukrainian-American",
    "address": "12 Cherry Blossom Rd, Chicago, IL 60601",
    "guardianName": "Oleg Petrov",
    "guardianPhone": "+380-44-555-1002",
    "guardianRelation": "Father",
    "admissionDate": "2023-08-20",
    "enrollmentType": "Regular",
    "hostel": "Block B - Room 305",
    "scholarship": "Refugee Educational Grant (100%)",
    "category": "International",
    "aadhar": "N/A",
    "previousSchool": "Kyiv National Lyceum"
  },
  {
    "id": "STU011",
    "name": "Zaid Khan",
    "email": "zaid.khan@modeluni.edu",
    "dept": "CS",
    "gpa": 2.8,
    "semester": 2,
    "status": "Active",
    "feePaid": 0,
    "feeTotal": 4500,
    "avatar": "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150",
    "attendance": 72,
    "courses": [
      "CS101",
      "EE101"
    ],
    "dob": "2006-02-14",
    "gender": "Male",
    "phone": "+1-555-1101",
    "bloodGroup": "B+",
    "nationality": "American",
    "address": "910 College Ave, Atlanta, GA 30303",
    "guardianName": "Patricia Cole",
    "guardianPhone": "+1-555-1102",
    "guardianRelation": "Mother",
    "admissionDate": "2025-08-15",
    "enrollmentType": "Regular",
    "hostel": "Block A - Room 415",
    "scholarship": "None",
    "category": "SC",
    "aadhar": "9876-5432-1011",
    "previousSchool": "Atlanta Academy of Sciences"
  },
  {
    "id": "STU012",
    "name": "Ravi Kumar",
    "email": "ravi.kumar@modeluni.edu",
    "dept": "ME",
    "gpa": 3.4,
    "semester": 4,
    "status": "Active",
    "feePaid": 4200,
    "feeTotal": 4200,
    "avatar": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
    "attendance": 88,
    "courses": [
      "ME102"
    ],
    "dob": "2005-10-25",
    "gender": "Male",
    "phone": "+91-91234-56789",
    "bloodGroup": "O+",
    "nationality": "Indian",
    "address": "45 Rajpath Nagar, New Delhi 110001, India",
    "guardianName": "Suresh Kumar",
    "guardianPhone": "+91-91234-56780",
    "guardianRelation": "Father",
    "admissionDate": "2024-08-18",
    "enrollmentType": "Regular",
    "hostel": "Block C - Room 102",
    "scholarship": "Government Merit Scholarship (45%)",
    "category": "OBC",
    "aadhar": "1234-5678-9012",
    "previousSchool": "Kendriya Vidyalaya, Delhi"
  },
  {
    "id": "STU013",
    "name": "Diya Menon",
    "email": "diya.menon@modeluni.edu",
    "dept": "CS",
    "gpa": 2.66,
    "semester": 7,
    "status": "Active",
    "feePaid": 3336,
    "feeTotal": 4500,
    "avatar": "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150",
    "attendance": 96,
    "courses": [
      "CS101",
      "CS202"
    ],
    "dob": "2004-09-03",
    "gender": "Female",
    "phone": "+1-555-5851",
    "bloodGroup": "A+",
    "nationality": "American",
    "address": "217 Main Street, Boston, MA 02110",
    "guardianName": "Mr. Lin",
    "guardianPhone": "+1-555-5181",
    "guardianRelation": "Father",
    "admissionDate": "2021-08-20",
    "enrollmentType": "Regular",
    "hostel": "Day Scholar",
    "scholarship": "Merit Scholarship (50%)",
    "category": "General",
    "aadhar": "3101-1110-0013",
    "previousSchool": "Boston Academy of Sciences"
  },
  {
    "id": "STU014",
    "name": "Rahul Deshmukh",
    "email": "rahul.deshmukh@modeluni.edu",
    "dept": "EE",
    "gpa": 3.68,
    "semester": 5,
    "status": "Active",
    "feePaid": 3923,
    "feeTotal": 4500,
    "avatar": "https://images.unsplash.com/photo-1504257404764-b2b1d311277a?w=150",
    "attendance": 91,
    "courses": [
      "EE101",
      "EE201"
    ],
    "dob": "2005-05-11",
    "gender": "Male",
    "phone": "+1-555-3404",
    "bloodGroup": "A-",
    "nationality": "Indian",
    "address": "416 Oak Avenue, Seattle, WA 02111",
    "guardianName": "Mr. Patterson",
    "guardianPhone": "+1-555-4274",
    "guardianRelation": "Father",
    "admissionDate": "2022-08-20",
    "enrollmentType": "Regular",
    "hostel": "Day Scholar",
    "scholarship": "None",
    "category": "General",
    "aadhar": "2419-5084-0014",
    "previousSchool": "Seattle Academy of Sciences"
  },
  {
    "id": "STU015",
    "name": "Aisha Sheikh",
    "email": "aisha.sheikh@modeluni.edu",
    "dept": "ME",
    "gpa": 2.6,
    "semester": 8,
    "status": "Active",
    "feePaid": 3365,
    "feeTotal": 4500,
    "avatar": "https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=150",
    "attendance": 77,
    "courses": [
      "ME102"
    ],
    "dob": "2004-12-13",
    "gender": "Female",
    "phone": "+1-555-7314",
    "bloodGroup": "B+",
    "nationality": "Canadian",
    "address": "268 Maple Road, Chicago, IL 02112",
    "guardianName": "Mr. Henderson",
    "guardianPhone": "+1-555-9958",
    "guardianRelation": "Father",
    "admissionDate": "2021-08-20",
    "enrollmentType": "Regular",
    "hostel": "Block C - Room 102",
    "scholarship": "None",
    "category": "General",
    "aadhar": "4594-4950-0015",
    "previousSchool": "Chicago Academy of Sciences"
  },
  {
    "id": "STU016",
    "name": "Ishaan Malhotra",
    "email": "ishaan.malhotra@modeluni.edu",
    "dept": "BI",
    "gpa": 3.72,
    "semester": 7,
    "status": "Active",
    "feePaid": 2243,
    "feeTotal": 4500,
    "avatar": "https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=150",
    "attendance": 75,
    "courses": [
      "BI101",
      "BI304"
    ],
    "dob": "2004-02-18",
    "gender": "Male",
    "phone": "+1-555-4422",
    "bloodGroup": "B-",
    "nationality": "British",
    "address": "324 Pine Lane, Austin, TX 02113",
    "guardianName": "Mr. Brooks",
    "guardianPhone": "+1-555-5690",
    "guardianRelation": "Father",
    "admissionDate": "2021-08-20",
    "enrollmentType": "Regular",
    "hostel": "Day Scholar",
    "scholarship": "None",
    "category": "SC",
    "aadhar": "4137-7914-0016",
    "previousSchool": "Austin Academy of Sciences"
  },
  {
    "id": "STU017",
    "name": "Meera Joshi",
    "email": "meera.joshi@modeluni.edu",
    "dept": "BA",
    "gpa": 3.87,
    "semester": 4,
    "status": "Active",
    "feePaid": 3102,
    "feeTotal": 4500,
    "avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
    "attendance": 98,
    "courses": [
      "BA201"
    ],
    "dob": "2006-06-28",
    "gender": "Female",
    "phone": "+1-555-3880",
    "bloodGroup": "AB+",
    "nationality": "French",
    "address": "814 Elm Boulevard, San Francisco, CA 02114",
    "guardianName": "Mr. Abbott",
    "guardianPhone": "+1-555-7683",
    "guardianRelation": "Father",
    "admissionDate": "2023-08-20",
    "enrollmentType": "Regular",
    "hostel": "Day Scholar",
    "scholarship": "None",
    "category": "General",
    "aadhar": "5781-3766-0017",
    "previousSchool": "San Francisco Academy of Sciences"
  },
  {
    "id": "STU018",
    "name": "Amanpreet Singh",
    "email": "amanpreet.singh@modeluni.edu",
    "dept": "CS",
    "gpa": 3.17,
    "semester": 5,
    "status": "Active",
    "feePaid": 3631,
    "feeTotal": 4500,
    "avatar": "https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?w=150",
    "attendance": 76,
    "courses": [
      "CS101",
      "CS202"
    ],
    "dob": "2005-06-13",
    "gender": "Male",
    "phone": "+1-555-1085",
    "bloodGroup": "AB-",
    "nationality": "Australian",
    "address": "730 Broadway, New York, NY 02115",
    "guardianName": "Mrs. Diggory",
    "guardianPhone": "+1-555-5022",
    "guardianRelation": "Mother",
    "admissionDate": "2022-08-20",
    "enrollmentType": "Regular",
    "hostel": "Day Scholar",
    "scholarship": "None",
    "category": "OBC",
    "aadhar": "2126-4854-0018",
    "previousSchool": "New York Academy of Sciences"
  },
  {
    "id": "STU019",
    "name": "Sana Malik",
    "email": "sana.malik@modeluni.edu",
    "dept": "EE",
    "gpa": 2.87,
    "semester": 3,
    "status": "Active",
    "feePaid": 3776,
    "feeTotal": 4500,
    "avatar": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150",
    "attendance": 99,
    "courses": [
      "EE101",
      "EE201"
    ],
    "dob": "2006-01-14",
    "gender": "Female",
    "phone": "+1-555-8394",
    "bloodGroup": "O+",
    "nationality": "American",
    "address": "579 Cedar Court, Denver, CO 02116",
    "guardianName": "Mrs. Lovegood",
    "guardianPhone": "+1-555-4602",
    "guardianRelation": "Mother",
    "admissionDate": "2023-08-20",
    "enrollmentType": "Regular",
    "hostel": "Block A - Room 106",
    "scholarship": "None",
    "category": "General",
    "aadhar": "4525-1686-0019",
    "previousSchool": "Denver Academy of Sciences"
  },
  {
    "id": "STU020",
    "name": "Arjun Kapoor",
    "email": "arjun.kapoor@modeluni.edu",
    "dept": "ME",
    "gpa": 2.88,
    "semester": 4,
    "status": "Active",
    "feePaid": 2785,
    "feeTotal": 4500,
    "avatar": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
    "attendance": 91,
    "courses": [
      "ME102"
    ],
    "dob": "2006-03-08",
    "gender": "Male",
    "phone": "+1-555-9902",
    "bloodGroup": "O-",
    "nationality": "Indian",
    "address": "276 Main Street, Boston, MA 02117",
    "guardianName": "Mr. Potter",
    "guardianPhone": "+1-555-5627",
    "guardianRelation": "Father",
    "admissionDate": "2023-08-20",
    "enrollmentType": "Regular",
    "hostel": "Day Scholar",
    "scholarship": "None",
    "category": "General",
    "aadhar": "4223-3001-0020",
    "previousSchool": "Boston Academy of Sciences"
  },
  {
    "id": "STU021",
    "name": "Riya Sen",
    "email": "riya.sen@modeluni.edu",
    "dept": "BI",
    "gpa": 3.93,
    "semester": 6,
    "status": "Active",
    "feePaid": 3473,
    "feeTotal": 4500,
    "avatar": "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150",
    "attendance": 88,
    "courses": [
      "BI101",
      "BI304"
    ],
    "dob": "2005-06-11",
    "gender": "Female",
    "phone": "+1-555-3639",
    "bloodGroup": "A+",
    "nationality": "Canadian",
    "address": "450 Oak Avenue, Seattle, WA 02118",
    "guardianName": "Mrs. Granger",
    "guardianPhone": "+1-555-4863",
    "guardianRelation": "Mother",
    "admissionDate": "2022-08-20",
    "enrollmentType": "Regular",
    "hostel": "Block C - Room 108",
    "scholarship": "None",
    "category": "General",
    "aadhar": "1977-7561-0021",
    "previousSchool": "Seattle Academy of Sciences"
  },
  {
    "id": "STU022",
    "name": "Hamza Raza",
    "email": "hamza.raza@modeluni.edu",
    "dept": "BA",
    "gpa": 3.03,
    "semester": 5,
    "status": "Active",
    "feePaid": 2479,
    "feeTotal": 4500,
    "avatar": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150",
    "attendance": 97,
    "courses": [
      "BA201"
    ],
    "dob": "2005-11-28",
    "gender": "Male",
    "phone": "+1-555-8150",
    "bloodGroup": "A-",
    "nationality": "British",
    "address": "309 Maple Road, Chicago, IL 02119",
    "guardianName": "Mr. Weasley",
    "guardianPhone": "+1-555-2775",
    "guardianRelation": "Father",
    "admissionDate": "2022-08-20",
    "enrollmentType": "Regular",
    "hostel": "Day Scholar",
    "scholarship": "None",
    "category": "OBC",
    "aadhar": "8311-9862-0022",
    "previousSchool": "Chicago Academy of Sciences"
  },
  {
    "id": "STU023",
    "name": "Nikhil Pillai",
    "email": "nikhil.pillai@modeluni.edu",
    "dept": "CS",
    "gpa": 3.51,
    "semester": 8,
    "status": "Active",
    "feePaid": 2307,
    "feeTotal": 4500,
    "avatar": "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150",
    "attendance": 92,
    "courses": [
      "CS101",
      "CS202"
    ],
    "dob": "2004-12-28",
    "gender": "Male",
    "phone": "+1-555-2172",
    "bloodGroup": "B+",
    "nationality": "French",
    "address": "432 Pine Lane, Austin, TX 02120",
    "guardianName": "Mrs. Longbottom",
    "guardianPhone": "+1-555-5885",
    "guardianRelation": "Mother",
    "admissionDate": "2021-08-20",
    "enrollmentType": "Regular",
    "hostel": "Day Scholar",
    "scholarship": "None",
    "category": "General",
    "aadhar": "2405-8137-0023",
    "previousSchool": "Austin Academy of Sciences"
  },
  {
    "id": "STU024",
    "name": "Gurleen Kaur",
    "email": "gurleen.kaur@modeluni.edu",
    "dept": "EE",
    "gpa": 3.01,
    "semester": 6,
    "status": "Active",
    "feePaid": 3036,
    "feeTotal": 4500,
    "avatar": "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150",
    "attendance": 99,
    "courses": [
      "EE101",
      "EE201"
    ],
    "dob": "2005-07-13",
    "gender": "Female",
    "phone": "+1-555-6735",
    "bloodGroup": "B-",
    "nationality": "Australian",
    "address": "943 Elm Boulevard, San Francisco, CA 02121",
    "guardianName": "Mrs. Weasley",
    "guardianPhone": "+1-555-5140",
    "guardianRelation": "Mother",
    "admissionDate": "2022-08-20",
    "enrollmentType": "Regular",
    "hostel": "Block C - Room 111",
    "scholarship": "None",
    "category": "General",
    "aadhar": "2361-6146-0024",
    "previousSchool": "San Francisco Academy of Sciences"
  },
  {
    "id": "STU025",
    "name": "Siddharth Shah",
    "email": "siddharth.shah@modeluni.edu",
    "dept": "ME",
    "gpa": 3.08,
    "semester": 2,
    "status": "Active",
    "feePaid": 4040,
    "feeTotal": 4500,
    "avatar": "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150",
    "attendance": 87,
    "courses": [
      "ME102"
    ],
    "dob": "2007-08-15",
    "gender": "Male",
    "phone": "+1-555-1512",
    "bloodGroup": "AB+",
    "nationality": "American",
    "address": "667 Broadway, New York, NY 02122",
    "guardianName": "Mr. Malfoy",
    "guardianPhone": "+1-555-2368",
    "guardianRelation": "Father",
    "admissionDate": "2024-08-20",
    "enrollmentType": "Regular",
    "hostel": "Block A - Room 112",
    "scholarship": "Merit Scholarship (50%)",
    "category": "OBC",
    "aadhar": "2919-1445-0025",
    "previousSchool": "New York Academy of Sciences"
  },
  {
    "id": "STU026",
    "name": "Zoya Akhtar",
    "email": "zoya.akhtar@modeluni.edu",
    "dept": "BI",
    "gpa": 3.3,
    "semester": 1,
    "status": "Active",
    "feePaid": 3615,
    "feeTotal": 4500,
    "avatar": "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150",
    "attendance": 84,
    "courses": [
      "BI101",
      "BI304"
    ],
    "dob": "2007-06-11",
    "gender": "Female",
    "phone": "+1-555-4427",
    "bloodGroup": "AB-",
    "nationality": "Indian",
    "address": "861 Cedar Court, Denver, CO 02123",
    "guardianName": "Mr. Chang",
    "guardianPhone": "+1-555-9231",
    "guardianRelation": "Father",
    "admissionDate": "2024-08-20",
    "enrollmentType": "Regular",
    "hostel": "Block B - Room 113",
    "scholarship": "None",
    "category": "General",
    "aadhar": "7596-3346-0026",
    "previousSchool": "Denver Academy of Sciences"
  },
  {
    "id": "STU027",
    "name": "Chris Mathew",
    "email": "chris.mathew@modeluni.edu",
    "dept": "BA",
    "gpa": 3.2,
    "semester": 6,
    "status": "Active",
    "feePaid": 4199,
    "feeTotal": 4500,
    "avatar": "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150",
    "attendance": 83,
    "courses": [
      "BA201"
    ],
    "dob": "2005-11-27",
    "gender": "Female",
    "phone": "+1-555-5062",
    "bloodGroup": "O+",
    "nationality": "Canadian",
    "address": "532 Main Street, Boston, MA 02124",
    "guardianName": "Mr. Delacour",
    "guardianPhone": "+1-555-1224",
    "guardianRelation": "Father",
    "admissionDate": "2022-08-20",
    "enrollmentType": "Regular",
    "hostel": "Block C - Room 114",
    "scholarship": "None",
    "category": "General",
    "aadhar": "5932-4649-0027",
    "previousSchool": "Boston Academy of Sciences"
  },
  {
    "id": "STU028",
    "name": "Vikram Singh",
    "email": "vikram.singh@modeluni.edu",
    "dept": "CS",
    "gpa": 3.38,
    "semester": 5,
    "status": "Active",
    "feePaid": 2324,
    "feeTotal": 4500,
    "avatar": "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150",
    "attendance": 95,
    "courses": [
      "CS101",
      "CS202"
    ],
    "dob": "2005-10-28",
    "gender": "Male",
    "phone": "+1-555-4896",
    "bloodGroup": "O-",
    "nationality": "British",
    "address": "179 Oak Avenue, Seattle, WA 02125",
    "guardianName": "Mrs. Krum",
    "guardianPhone": "+1-555-9836",
    "guardianRelation": "Mother",
    "admissionDate": "2022-08-20",
    "enrollmentType": "Regular",
    "hostel": "Block A - Room 115",
    "scholarship": "Merit Scholarship (20%)",
    "category": "OBC",
    "aadhar": "4640-3975-0028",
    "previousSchool": "Seattle Academy of Sciences"
  },
  {
    "id": "STU029",
    "name": "Parth Aggarwal",
    "email": "parth.aggarwal@modeluni.edu",
    "dept": "EE",
    "gpa": 2.96,
    "semester": 1,
    "status": "Active",
    "feePaid": 4324,
    "feeTotal": 4500,
    "avatar": "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150",
    "attendance": 91,
    "courses": [
      "EE101",
      "EE201"
    ],
    "dob": "2007-12-21",
    "gender": "Male",
    "phone": "+1-555-8654",
    "bloodGroup": "A+",
    "nationality": "French",
    "address": "231 Maple Road, Chicago, IL 02126",
    "guardianName": "Mrs. Parker",
    "guardianPhone": "+1-555-1509",
    "guardianRelation": "Mother",
    "admissionDate": "2024-08-20",
    "enrollmentType": "Regular",
    "hostel": "Block B - Room 116",
    "scholarship": "None",
    "category": "General",
    "aadhar": "4856-7579-0029",
    "previousSchool": "Chicago Academy of Sciences"
  },
  {
    "id": "STU030",
    "name": "Kavya Reddy",
    "email": "kavya.reddy@modeluni.edu",
    "dept": "ME",
    "gpa": 3.14,
    "semester": 7,
    "status": "Active",
    "feePaid": 3562,
    "feeTotal": 4500,
    "avatar": "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=150",
    "attendance": 87,
    "courses": [
      "ME102"
    ],
    "dob": "2004-10-23",
    "gender": "Female",
    "phone": "+1-555-3418",
    "bloodGroup": "A-",
    "nationality": "Australian",
    "address": "293 Pine Lane, Austin, TX 02127",
    "guardianName": "Mr. Stacy",
    "guardianPhone": "+1-555-3090",
    "guardianRelation": "Father",
    "admissionDate": "2021-08-20",
    "enrollmentType": "Regular",
    "hostel": "Block C - Room 117",
    "scholarship": "None",
    "category": "General",
    "aadhar": "6611-2078-0030",
    "previousSchool": "Austin Academy of Sciences"
  },
  {
    "id": "STU031",
    "name": "Mustafa Hussain",
    "email": "mustafa.hussain@modeluni.edu",
    "dept": "BI",
    "gpa": 2.69,
    "semester": 5,
    "status": "Active",
    "feePaid": 2972,
    "feeTotal": 4500,
    "avatar": "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150",
    "attendance": 85,
    "courses": [
      "BI101",
      "BI304"
    ],
    "dob": "2005-12-01",
    "gender": "Male",
    "phone": "+1-555-1874",
    "bloodGroup": "B+",
    "nationality": "American",
    "address": "337 Elm Boulevard, San Francisco, CA 02128",
    "guardianName": "Mr. Morales",
    "guardianPhone": "+1-555-8613",
    "guardianRelation": "Father",
    "admissionDate": "2022-08-20",
    "enrollmentType": "Regular",
    "hostel": "Day Scholar",
    "scholarship": "None",
    "category": "General",
    "aadhar": "8117-4452-0031",
    "previousSchool": "San Francisco Academy of Sciences"
  },
  {
    "id": "STU032",
    "name": "Karan Mehta",
    "email": "karan.mehta@modeluni.edu",
    "dept": "BA",
    "gpa": 3.08,
    "semester": 1,
    "status": "Active",
    "feePaid": 2681,
    "feeTotal": 4500,
    "avatar": "https://images.unsplash.com/photo-1542909168-82c3e7fdca5c?w=150",
    "attendance": 92,
    "courses": [
      "BA201"
    ],
    "dob": "2007-03-02",
    "gender": "Male",
    "phone": "+1-555-7309",
    "bloodGroup": "B-",
    "nationality": "Indian",
    "address": "783 Broadway, New York, NY 02129",
    "guardianName": "Mrs. Kent",
    "guardianPhone": "+1-555-8842",
    "guardianRelation": "Mother",
    "admissionDate": "2024-08-20",
    "enrollmentType": "Regular",
    "hostel": "Day Scholar",
    "scholarship": "Merit Scholarship (20%)",
    "category": "General",
    "aadhar": "7915-9888-0032",
    "previousSchool": "New York Academy of Sciences"
  },
  {
    "id": "STU033",
    "name": "Aditya Roy",
    "email": "aditya.roy@modeluni.edu",
    "dept": "CS",
    "gpa": 3.29,
    "semester": 6,
    "status": "Active",
    "feePaid": 2537,
    "feeTotal": 4500,
    "avatar": "https://images.unsplash.com/photo-1527983359383-4758693f760c?w=150",
    "attendance": 85,
    "courses": [
      "CS101",
      "CS202"
    ],
    "dob": "2005-08-17",
    "gender": "Male",
    "phone": "+1-555-3450",
    "bloodGroup": "AB+",
    "nationality": "Canadian",
    "address": "711 Cedar Court, Denver, CO 02130",
    "guardianName": "Mrs. Wayne",
    "guardianPhone": "+1-555-5381",
    "guardianRelation": "Mother",
    "admissionDate": "2022-08-20",
    "enrollmentType": "Regular",
    "hostel": "Block C - Room 120",
    "scholarship": "None",
    "category": "General",
    "aadhar": "7480-7992-0033",
    "previousSchool": "Denver Academy of Sciences"
  },
  {
    "id": "STU034",
    "name": "Divya Nair",
    "email": "divya.nair@modeluni.edu",
    "dept": "EE",
    "gpa": 3.15,
    "semester": 3,
    "status": "Active",
    "feePaid": 2360,
    "feeTotal": 4500,
    "avatar": "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=150",
    "attendance": 86,
    "courses": [
      "EE101",
      "EE201"
    ],
    "dob": "2006-10-27",
    "gender": "Female",
    "phone": "+1-555-8452",
    "bloodGroup": "AB-",
    "nationality": "British",
    "address": "665 Main Street, Boston, MA 02131",
    "guardianName": "Mr. Prince",
    "guardianPhone": "+1-555-1046",
    "guardianRelation": "Father",
    "admissionDate": "2023-08-20",
    "enrollmentType": "Regular",
    "hostel": "Block A - Room 121",
    "scholarship": "None",
    "category": "OBC",
    "aadhar": "5946-2779-0034",
    "previousSchool": "Boston Academy of Sciences"
  },
  {
    "id": "STU035",
    "name": "Tanmay Bhat",
    "email": "tanmay.bhat@modeluni.edu",
    "dept": "ME",
    "gpa": 3.17,
    "semester": 2,
    "status": "Active",
    "feePaid": 2354,
    "feeTotal": 4500,
    "avatar": "https://images.unsplash.com/photo-1504257404764-b2b1d311277a?w=150",
    "attendance": 83,
    "courses": [
      "ME102"
    ],
    "dob": "2007-12-22",
    "gender": "Male",
    "phone": "+1-555-7227",
    "bloodGroup": "O+",
    "nationality": "French",
    "address": "755 Oak Avenue, Seattle, WA 02132",
    "guardianName": "Mrs. Stark",
    "guardianPhone": "+1-555-5155",
    "guardianRelation": "Mother",
    "admissionDate": "2024-08-20",
    "enrollmentType": "Regular",
    "hostel": "Block B - Room 122",
    "scholarship": "None",
    "category": "General",
    "aadhar": "2966-7655-0035",
    "previousSchool": "Seattle Academy of Sciences"
  },
  {
    "id": "STU036",
    "name": "Shivam Tripathi",
    "email": "shivam.tripathi@modeluni.edu",
    "dept": "BI",
    "gpa": 2.77,
    "semester": 7,
    "status": "Active",
    "feePaid": 2891,
    "feeTotal": 4500,
    "avatar": "https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=150",
    "attendance": 97,
    "courses": [
      "BI101",
      "BI304"
    ],
    "dob": "2004-12-25",
    "gender": "Male",
    "phone": "+1-555-4244",
    "bloodGroup": "O-",
    "nationality": "Australian",
    "address": "396 Maple Road, Chicago, IL 02133",
    "guardianName": "Mrs. Rogers",
    "guardianPhone": "+1-555-6049",
    "guardianRelation": "Mother",
    "admissionDate": "2021-08-20",
    "enrollmentType": "Regular",
    "hostel": "Day Scholar",
    "scholarship": "None",
    "category": "General",
    "aadhar": "8640-4318-0036",
    "previousSchool": "Chicago Academy of Sciences"
  },
  {
    "id": "STU037",
    "name": "Nida Fatima",
    "email": "nida.fatima@modeluni.edu",
    "dept": "BA",
    "gpa": 2.99,
    "semester": 6,
    "status": "Active",
    "feePaid": 3979,
    "feeTotal": 4500,
    "avatar": "https://images.unsplash.com/photo-1554151228-14d9def656e4?w=150",
    "attendance": 91,
    "courses": [
      "BA201"
    ],
    "dob": "2005-10-08",
    "gender": "Female",
    "phone": "+1-555-6581",
    "bloodGroup": "A+",
    "nationality": "American",
    "address": "834 Pine Lane, Austin, TX 02134",
    "guardianName": "Mrs. Romanoff",
    "guardianPhone": "+1-555-4533",
    "guardianRelation": "Mother",
    "admissionDate": "2022-08-20",
    "enrollmentType": "Regular",
    "hostel": "Day Scholar",
    "scholarship": "Merit Scholarship (40%)",
    "category": "General",
    "aadhar": "6282-3418-0037",
    "previousSchool": "Austin Academy of Sciences"
  },
  {
    "id": "STU038",
    "name": "Ananya Patel",
    "email": "student@campusx.edu",
    "dept": "CS",
    "gpa": 3.75,
    "semester": 4,
    "status": "Active",
    "feePaid": 3500,
    "feeTotal": 4500,
    "avatar": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150",
    "attendance": 95,
    "courses": [
      "CS101",
      "CS202"
    ],
    "dob": "2006-04-12",
    "gender": "Female",
    "phone": "+1-555-0381",
    "bloodGroup": "AB-",
    "nationality": "Japanese-American",
    "address": "402 Maple Court, Austin, TX 78759",
    "guardianName": "Kenji Nakamura",
    "guardianPhone": "+1-555-0382",
    "guardianRelation": "Father",
    "admissionDate": "2024-08-20",
    "enrollmentType": "Regular",
    "hostel": "Block B - Room 304",
    "scholarship": "None",
    "category": "General",
    "aadhar": "1234-5678-9012",
    "previousSchool": "Austin High School"
  }
];

  const TRANSACTIONS = [
  {
    "txId": "TXN8972",
    "studentId": "STU001",
    "studentName": "Alex Rivera",
    "amount": 4500,
    "date": "2026-05-15",
    "status": "Paid",
    "method": "Stripe"
  },
  {
    "txId": "TXN8973",
    "studentId": "STU002",
    "studentName": "Zoe Chen",
    "amount": 4500,
    "date": "2026-05-16",
    "status": "Paid",
    "method": "Bank Transfer"
  },
  {
    "txId": "TXN8974",
    "studentId": "STU005",
    "studentName": "Carlos Mendez",
    "amount": 4200,
    "date": "2026-05-18",
    "status": "Paid",
    "method": "Credit Card"
  },
  {
    "txId": "TXN8975",
    "studentId": "STU003",
    "studentName": "Liam Sterling",
    "amount": 3000,
    "date": "2026-05-20",
    "status": "Paid",
    "method": "Stripe"
  },
  {
    "txId": "TXN8976",
    "studentId": "STU008",
    "studentName": "Elena Rostova",
    "amount": 3800,
    "date": "2026-05-22",
    "status": "Paid",
    "method": "PayPal"
  },
  {
    "txId": "TXN8977",
    "studentId": "STU007",
    "studentName": "Marcus Brody",
    "amount": 1500,
    "date": "2026-05-23",
    "status": "Paid",
    "method": "Stripe"
  },
  {
    "txId": "TXN8978",
    "studentId": "STU004",
    "studentName": "Emily Watson",
    "amount": 4000,
    "date": "2026-05-25",
    "status": "Paid",
    "method": "Credit Card"
  }
];

  const EXAMS = [
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

  const ANNOUNCEMENTS = [
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

  const RECENT_ACTIVITIES = [
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

  // Helper getters to manipulate simulated DB with localStorage persistence and API sync
  function getPersistent(key, defaultData) {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        var stored = window.localStorage.getItem('campusx_db_' + key);
        if (stored) {
          return JSON.parse(stored);
        }
      }
    } catch (e) {}
    return defaultData;
  }

  function savePersistent(key, data) {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem('campusx_db_' + key, JSON.stringify(data));
        if (typeof fetch !== 'undefined') {
          fetch('/api/db/sync', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ key: key, data: data })
          }).catch(function() {});
        }
      }
    } catch (e) {}
  }

  if (typeof window !== 'undefined' && typeof fetch !== 'undefined') {
    fetch('/api/db/sync')
      .then(function(res) { return res.json(); })
      .then(function(res) {
        if (res && res.success && res.data && Array.isArray(res.data.kv_store)) {
          res.data.kv_store.forEach(function(item) {
            try {
              if (item.key && item.value && window.localStorage) {
                window.localStorage.setItem('campusx_db_' + item.key, typeof item.value === 'string' ? item.value : JSON.stringify(item.value));
              }
            } catch (e) {}
          });
        }
      })
      .catch(function() {});
  }

  return {
    getDepartments: () => getPersistent('departments', DEPARTMENTS),
    getFaculty: () => getPersistent('faculty', FACULTY),
    getCourses: () => getPersistent('courses', COURSES),
    getStudents: () => getPersistent('students', STUDENTS),
    getTransactions: () => getPersistent('transactions', TRANSACTIONS),
    getExams: () => getPersistent('exams', EXAMS),
    getAnnouncements: () => getPersistent('announcements', ANNOUNCEMENTS),
    getActivities: () => RECENT_ACTIVITIES,

    // DB Modifiers with Persistent Storage
    addStudent: (stu) => {
      const current = getPersistent('students', STUDENTS);
      current.push(stu);
      savePersistent('students', current);
    },
    updateStudent: (id, updatedData) => {
      const current = getPersistent('students', STUDENTS);
      const idx = current.findIndex(s => s.id === id);
      if (idx !== -1) {
        current[idx] = { ...current[idx], ...updatedData };
        savePersistent('students', current);
      }
    },
    deleteStudent: (id) => {
      const current = getPersistent('students', STUDENTS);
      const idx = current.findIndex(s => s.id === id);
      if (idx !== -1) {
        current.splice(idx, 1);
        savePersistent('students', current);
        return true;
      }
      return false;
    },
    addFaculty: (fac) => {
      const current = getPersistent('faculty', FACULTY);
      current.push(fac);
      savePersistent('faculty', current);
    },
    addTransaction: (tx) => {
      const current = getPersistent('transactions', TRANSACTIONS);
      current.unshift(tx);
      savePersistent('transactions', current);
    },
    addAnnouncement: (ann) => {
      const current = getPersistent('announcements', ANNOUNCEMENTS);
      current.unshift(ann);
      savePersistent('announcements', current);
    },
    
    // AI Database Health & Profile Integrity Classifier
    runIntegrityPrediction: async function() {
      if (typeof tf === 'undefined') return [];
      var students = this.getStudents();
      if (students.length === 0) return [];
      
      try {
        var xData = students.map(s => [
          s.gpa / 4.0,
          s.attendance / 100.0,
          (s.feePaid || 0) / (s.feeTotal || 5000)
        ]);

        var xs = tf.tensor2d(xData, [students.length, 3]);

        var model = tf.sequential();
        model.add(tf.layers.dense({ units: 2, activation: 'relu', inputShape: [3] }));
        model.add(tf.layers.dense({ units: 3, activation: 'sigmoid' }));
        model.compile({ optimizer: tf.train.adam(0.1), loss: 'meanSquaredError' });

        await model.fit(xs, xs, { epochs: 15, verbose: 0 });

        var predicted = model.predict(xs);
        var predData = await predicted.data();

        var anomalies = [];
        for (let i = 0; i < students.length; i++) {
          var orig = xData[i];
          var pred = [predData[i*3], predData[i*3+1], predData[i*3+2]];
          var error = Math.sqrt(
            Math.pow(orig[0] - pred[0], 2) +
            Math.pow(orig[1] - pred[1], 2) +
            Math.pow(orig[2] - pred[2], 2)
          );
          
          var isAnomaly = error > 0.45;
          
          if (students[i].status === 'Graduated' && students[i].feePaid < students[i].feeTotal * 0.95) {
            isAnomaly = true;
            error += 0.5;
          }
          if (students[i].attendance > 95 && students[i].gpa < 1.0) {
            isAnomaly = true;
            error += 0.3;
          }

          if (isAnomaly) {
            anomalies.push({
              studentId: students[i].id,
              name: students[i].name,
              errorScore: error.toFixed(4),
              reason: students[i].status === 'Graduated' && students[i].feePaid < students[i].feeTotal * 0.95 ? 
                'Graduated status with unpaid balance' : 
                (students[i].attendance > 95 && students[i].gpa < 1.0 ? 'Critical performance discrepancy' : 'Profile anomaly pattern detected')
            });
          }
        }

        xs.dispose();
        predicted.dispose();
        model.dispose();

        return anomalies;
      } catch (err) {
        console.error('Integrity predictor failed:', err);
        return [];
      }
    }
  };

})();
