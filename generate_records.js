const fs = require('fs');
const path = require('path');

// 1. Helper to hash password matching the client-side implementation
function _hashPassword(plain) {
  var hash = 0;
  for (var i = 0; i < plain.length; i++) {
    var ch = plain.charCodeAt(i);
    hash = ((hash << 5) - hash) + ch;
    hash |= 0; // Convert to 32-bit integer
  }
  return 'h$' + Math.abs(hash).toString(36);
}

// 2. Load UniversityDB by mocking global window object
global.window = {};
const dataPath = path.join(__dirname, 'js', 'data.js');
if (!fs.existsSync(dataPath)) {
  console.error("Error: Could not find js/data.js");
  process.exit(1);
}
require(dataPath);

const faculty = global.window.UniversityDB.getFaculty();
const students = global.window.UniversityDB.getStudents();

// 3. Generate Accounts
const defaultAccounts = [
  {
    "id": "usr_001",
    "name": "Dr. Rajesh Sharma",
    "email": "admin@campusx.edu",
    "password": _hashPassword("admin123"),
    "role": "admin",
    "avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
    "createdAt": "2024-01-01T00:00:00.000Z"
  },
  {
    "id": "usr_002",
    "name": "Prof. Tariq Ansari",
    "email": "faculty@campusx.edu",
    "password": _hashPassword("faculty123"),
    "role": "faculty",
    "avatar": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
    "createdAt": "2024-01-15T00:00:00.000Z"
  },
  {
    "id": "usr_003",
    "name": "Ananya Patel",
    "email": "student@campusx.edu",
    "password": _hashPassword("student123"),
    "role": "student",
    "avatar": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150",
    "createdAt": "2024-02-01T00:00:00.000Z"
  },
  {
    "id": "usr_004",
    "name": "Prof. Sunita Verma",
    "email": "hod@campusx.edu",
    "password": _hashPassword("hod123"),
    "role": "hod",
    "avatar": "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150",
    "createdAt": "2024-01-20T00:00:00.000Z"
  }
];

const facultyRegistry = [];
const studentRegistry = [];

// Process Faculty
faculty.forEach(f => {
  const parts = f.name.split(' ');
  const lastName = parts[parts.length - 1];
  const pass = `${lastName}@${f.id}`;
  facultyRegistry.push({
    id: f.id,
    name: f.name,
    email: f.email,
    password: pass,
    plainPassword: pass
  });
  defaultAccounts.push({
    id: f.id,
    name: f.name,
    email: f.email,
    password: _hashPassword(pass),
    role: "faculty",
    avatar: f.avatar || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
    createdAt: "2024-01-15T00:00:00.000Z"
  });
});

// Process Students
students.forEach(s => {
  const firstName = s.name.split(' ')[0];
  const pass = `${firstName}@${s.id}`;
  studentRegistry.push({
    id: s.id,
    name: s.name,
    email: s.email,
    password: pass,
    plainPassword: pass
  });
  defaultAccounts.push({
    id: s.id,
    name: s.name,
    email: s.email,
    password: _hashPassword(pass),
    role: "student",
    avatar: s.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
    createdAt: "2024-02-01T00:00:00.000Z"
  });
});

// 4. Generate authentication.txt content
let txtContent = `================================================================================
CAMPUSX UNIVERSITY ERP - AUTHENTICATION REGISTRY
================================================================================

This file contains the email (user ID) and password credentials for all accounts 
pre-registered in the CampusX University ERP platform.

--------------------------------------------------------------------------------
1. DEFAULT DEMO ACCOUNTS
--------------------------------------------------------------------------------
Role: Administrator
Name: Dr. Rajesh Sharma
User ID (Email): admin@campusx.edu
Password: admin123

Role: Faculty Member
Name: Prof. Tariq Ansari
User ID (Email): faculty@campusx.edu
Password: faculty123

Role: HOD (Department Head)
Name: Prof. Sunita Verma
User ID (Email): hod@campusx.edu
Password: hod123

Role: Placement Officer (TPO)
Name: Dr. Rohan D'Souza
User ID (Email): placement@campusx.edu
Password: placement123

Role: Student
Name: Ananya Patel
User ID (Email): student@campusx.edu
Password: student123


--------------------------------------------------------------------------------
1b. ENTERPRISE ROLE-BASED DEMO ACCOUNTS
--------------------------------------------------------------------------------
Role: Global Super Admin
Name: Global Super Admin
User ID (Email): superadmin@campusx.demo
Password: Demo@123

Role: Platform Admin
Name: Platform Admin
User ID (Email): platformadmin@campusx.demo
Password: Demo@123

Role: University Admin
Name: University Admin
User ID (Email): admin@campusx.demo
Password: Demo@123

Role: Registrar
Name: Registrar Officer
User ID (Email): registrar@campusx.demo
Password: Demo@123

Role: Dean
Name: Dean of Faculty
User ID (Email): dean@campusx.demo
Password: Demo@123

Role: HOD (Department Head)
Name: Prof. Sunita Verma (HOD)
User ID (Email): hod@campusx.demo
Password: Demo@123

Role: Faculty Member
Name: Dr. Rajesh Sharma (Faculty)
User ID (Email): faculty@campusx.demo
Password: Demo@123

Role: Finance Manager
Name: Finance Manager
User ID (Email): finance@campusx.demo
Password: Demo@123

Role: Research Coordinator
Name: Research Coordinator
User ID (Email): research@campusx.demo
Password: Demo@123

Role: Placement Officer
Name: Placement Officer
User ID (Email): placement@campusx.demo
Password: Demo@123

Role: Student
Name: Aarav Sharma (Student)
User ID (Email): student@campusx.demo
Password: Demo@123

Role: Parent
Name: Parent Account
User ID (Email): parent@campusx.demo
Password: Demo@123

Role: Alumni
Name: Alumni Account
User ID (Email): alumni@campusx.demo
Password: Demo@123

Role: Recruiter
Name: Lead Recruiter
User ID (Email): recruiter@campusx.demo
Password: Demo@123

`;

facultyRegistry.forEach(fac => {
  txtContent += `ID: ${fac.id}
Name: ${fac.name}
User ID (Email): ${fac.email}
Password: ${fac.password}
--------------------------------------------------\n`;
});

txtContent += `\n--------------------------------------------------------------------------------
3. STUDENT ACCOUNTS (Total: ${studentRegistry.length})
--------------------------------------------------------------------------------
`;

studentRegistry.forEach(stu => {
  txtContent += `ID: ${stu.id}
Name: ${stu.name}
User ID (Email): ${stu.email}
Password: ${stu.password}
--------------------------------------------------\n`;
});

// Save authentication.txt
const authTxtPath = path.join(__dirname, 'authentication.txt');
fs.writeFileSync(authTxtPath, txtContent, 'utf8');
console.log(`Successfully generated and saved ${authTxtPath}`);

// 5. Update js/auth.js
const authJsPath = path.join(__dirname, 'js', 'auth.js');
if (fs.existsSync(authJsPath)) {
  let authJsContent = fs.readFileSync(authJsPath, 'utf8');
  
  // Locate the DEFAULT_ACCOUNTS declaration block
  const startMarker = '  const DEFAULT_ACCOUNTS = [';
  const startIndex = authJsContent.indexOf(startMarker);
  
  if (startIndex !== -1) {
    const endMatch = authJsContent.substring(startIndex).match(/\r?\n\s*\];/);
    if (endMatch) {
      const endIndex = startIndex + endMatch.index + endMatch[0].length;
      
      // Generate formatted JSON
      const accountsJson = JSON.stringify(defaultAccounts, null, 2);
      
      // Indent each line of the JSON to match formatting
      const indentedJson = accountsJson
        .split('\n')
        .map((line, idx) => {
          if (idx === 0) return line;
          return '  ' + line;
        })
        .join('\n');
        
      const newContent = authJsContent.substring(0, startIndex + '  const DEFAULT_ACCOUNTS = '.length) +
                         indentedJson +
                         ';' +
                         authJsContent.substring(endIndex);
                         
      fs.writeFileSync(authJsPath, newContent, 'utf8');
      console.log(`Successfully updated ${authJsPath} with ${defaultAccounts.length} accounts.`);
    } else {
      console.error("Warning: Could not find matching closing array marker in js/auth.js");
    }
  } else {
    console.error("Warning: Could not find DEFAULT_ACCOUNTS array declaration in js/auth.js");
  }
} else {
  console.error("Error: Could not find js/auth.js to update.");
}

// 6. Update database.sqlite
const sqlite3 = require('sqlite3').verbose();
const dbPath = path.join(__dirname, 'database.sqlite');
if (fs.existsSync(dbPath)) {
  const db = new sqlite3.Database(dbPath);
  db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      role TEXT NOT NULL,
      avatar TEXT,
      department TEXT,
      password_changed INTEGER DEFAULT 0
    )`);

    const stmt = db.prepare(`INSERT OR REPLACE INTO users (id, name, email, password, role, avatar, department, password_changed) VALUES (?, ?, ?, ?, ?, ?, ?, 0)`);
    
    // Insert defaultAccounts
    defaultAccounts.forEach(acc => {
      stmt.run(acc.id, acc.name, acc.email, acc.password, acc.role, acc.avatar || '', acc.dept || 'General');
    });

    // Insert Enterprise Demo Accounts
    const demoAccounts = [
      { id: 'usr_demo_1', name: 'Global Super Admin', email: 'superadmin@campusx.demo', password: _hashPassword('Demo@123'), role: 'superadmin' },
      { id: 'usr_demo_2', name: 'Platform Admin', email: 'admin@campusx.demo', password: _hashPassword('Demo@123'), role: 'platformadmin' },
      { id: 'usr_demo_3', name: 'University Admin', email: 'univadmin@campusx.demo', password: _hashPassword('Demo@123'), role: 'admin' },
      { id: 'usr_demo_4', name: 'Registrar Officer', email: 'registrar@campusx.demo', password: _hashPassword('Demo@123'), role: 'registrar' },
      { id: 'usr_demo_5', name: 'Dean of Faculty', email: 'dean@campusx.demo', password: _hashPassword('Demo@123'), role: 'dean' },
      { id: 'usr_demo_6', name: 'Prof. Sunita Verma (HOD)', email: 'hod@campusx.demo', password: _hashPassword('Demo@123'), role: 'hod' },
      { id: 'usr_demo_7', name: 'Dr. Rajesh Sharma (Faculty)', email: 'faculty@campusx.demo', password: _hashPassword('Demo@123'), role: 'faculty' },
      { id: 'usr_demo_8', name: 'Finance Manager', email: 'finance@campusx.demo', password: _hashPassword('Demo@123'), role: 'finance_manager' },
      { id: 'usr_demo_9', name: 'Research Coordinator', email: 'research@campusx.demo', password: _hashPassword('Demo@123'), role: 'research_coordinator' },
      { id: 'usr_demo_10', name: 'Placement Officer', email: 'placement@campusx.demo', password: _hashPassword('Demo@123'), role: 'placement_officer' },
      { id: 'usr_demo_11', name: 'Aarav Sharma (Student)', email: 'student@campusx.demo', password: _hashPassword('Demo@123'), role: 'student' },
      { id: 'usr_demo_12', name: 'Parent Account', email: 'parent@campusx.demo', password: _hashPassword('Demo@123'), role: 'sports_parent' },
      { id: 'usr_demo_13', name: 'Alumni Account', email: 'alumni@campusx.demo', password: _hashPassword('Demo@123'), role: 'alumni' },
      { id: 'usr_demo_14', name: 'Lead Recruiter', email: 'recruiter@campusx.demo', password: _hashPassword('Demo@123'), role: 'recruiter' },
      { id: 'usr_demo_sports_dir', name: 'Dr. Sunita Verma (Sports Director)', email: 'sportsdirector@campusx.demo', password: _hashPassword('Demo@123'), role: 'sports_director' },
      { id: 'usr_demo_coach', name: 'Prof. Gurpreet Singh (Coach)', email: 'coach@campusx.demo', password: _hashPassword('Demo@123'), role: 'coach' },
      { id: 'usr_demo_athlete', name: 'Aarav Sharma (Athlete)', email: 'athlete@campusx.demo', password: _hashPassword('Demo@123'), role: 'athlete' },
      { id: 'usr_demo_parent_gen', name: 'General Parent Account', email: 'parent_role@campusx.demo', password: _hashPassword('Demo@123'), role: 'parent' },
      { id: 'usr_demo_dept', name: 'Department Admin', email: 'deptadmin@campusx.demo', password: _hashPassword('Demo@123'), role: 'department_admin' },
      { id: 'usr_demo_library', name: 'Library Administrator', email: 'libraryadmin@campusx.demo', password: _hashPassword('Demo@123'), role: 'library_admin' },
      { id: 'usr_demo_hostel', name: 'Hostel Manager', email: 'hosteladmin@campusx.demo', password: _hashPassword('Demo@123'), role: 'hostel_admin' },
      { id: 'usr_demo_transport', name: 'Transport Coordinator', email: 'transportadmin@campusx.demo', password: _hashPassword('Demo@123'), role: 'transport_admin' },
      { id: 'usr_demo_medical', name: 'Dr. Sneha Fernandes (Medical Staff)', email: 'medical@campusx.demo', password: _hashPassword('Demo@123'), role: 'medical_staff' },
      { id: 'usr_demo_guest', name: 'Guest Visitor', email: 'guest@campusx.demo', password: _hashPassword('Demo@123'), role: 'guest' },
      { id: 'usr_demo_consultant', name: 'External Consultant', email: 'consultant@campusx.demo', password: _hashPassword('Demo@123'), role: 'consultant' },
      { id: 'usr_demo_auditor', name: 'Internal Auditor', email: 'auditor@campusx.demo', password: _hashPassword('Demo@123'), role: 'auditor' },
      { id: 'usr_demo_compliance', name: 'Governance Compliance Officer', email: 'compliance@campusx.demo', password: _hashPassword('Demo@123'), role: 'compliance_officer' },
      { id: 'usr_demo_coordinator', name: 'Dr. Ayesha Siddiqui (Coordinator)', email: 'coordinator@campusx.demo', password: _hashPassword('Demo@123'), role: 'course_coordinator' },
      { id: 'usr_demo_coe', name: 'Dr. Kabir Qureshi (COE)', email: 'coe@campusx.demo', password: _hashPassword('Demo@123'), role: 'controller_of_examination' },
      { id: 'usr_demo_market_admin', name: 'Dr. Sunita Verma (Market Admin)', email: 'marketadmin@campusx.demo', password: _hashPassword('Demo@123'), role: 'market_admin' },
      { id: 'usr_demo_analyst', name: 'Prof. Ramesh Shastri (Analyst)', email: 'analyst@campusx.demo', password: _hashPassword('Demo@123'), role: 'research_analyst' }
    ];

    demoAccounts.forEach(demo => {
      stmt.run(demo.id, demo.name, demo.email, demo.password, demo.role, 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150', 'General');
    });

    stmt.finalize();
    console.log('Successfully updated database.sqlite users table with all accounts.');
    db.close();
  });
}

