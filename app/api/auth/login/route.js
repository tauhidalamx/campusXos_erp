import { NextResponse } from 'next/server';

function hashPassword(plain) {
  var hash = 0;
  for (var i = 0; i < plain.length; i++) {
    var ch = plain.charCodeAt(i);
    hash = ((hash << 5) - hash) + ch;
    hash |= 0;
  }
  return 'h$' + Math.abs(hash).toString(36);
}

const demoAccounts = [
  { id: 'usr_001', name: 'Dr. Rajesh Sharma', email: 'admin@campusx.edu', password: hashPassword('admin123'), role: 'admin', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150', department: 'CS' },
  { id: 'usr_002', name: 'Prof. Tariq Ansari', email: 'faculty@campusx.edu', password: hashPassword('faculty123'), role: 'faculty', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150', department: 'CS' },
  { id: 'usr_003', name: 'Ananya Patel', email: 'student@campusx.edu', password: hashPassword('student123'), role: 'student', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150', department: 'CS' },
  { id: 'usr_004', name: 'Prof. Sunita Verma', email: 'hod@campusx.edu', password: hashPassword('hod123'), role: 'hod', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150', department: 'CS' },
  { id: 'usr_005', name: 'Dr. Rohan D\'Souza', email: 'placement@campusx.edu', password: hashPassword('placement123'), role: 'placement_officer', avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150', department: 'CS' },
  
  { id: 'usr_demo_1', name: 'Global Super Admin', email: 'superadmin@campusx.demo', password: hashPassword('Demo@123'), role: 'superadmin', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150', department: 'General' },
  { id: 'usr_demo_2', name: 'Platform Admin', email: 'admin@campusx.demo', password: hashPassword('PlatformAdmin@2026'), role: 'platformadmin', avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150', department: 'General' },
  { id: 'usr_demo_3', name: 'University Admin', email: 'univadmin@campusx.demo', password: hashPassword('Demo@123'), role: 'admin', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150', department: 'General' },
  { id: 'usr_demo_4', name: 'Registrar Officer', email: 'registrar@campusx.demo', password: hashPassword('Demo@123'), role: 'registrar', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150', department: 'General' },
  { id: 'usr_demo_5', name: 'Dean of Faculty', email: 'dean@campusx.demo', password: hashPassword('Demo@123'), role: 'dean', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150', department: 'General' },
  { id: 'usr_demo_6', name: 'Prof. Sunita Verma (HOD)', email: 'hod@campusx.demo', password: hashPassword('Demo@123'), role: 'hod', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150', department: 'CS' },
  { id: 'usr_demo_7', name: 'Dr. Rajesh Sharma (Faculty)', email: 'faculty@campusx.demo', password: hashPassword('Demo@123'), role: 'faculty', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150', department: 'General' },
  { id: 'usr_demo_8', name: 'Finance Manager', email: 'finance@campusx.demo', password: hashPassword('Demo@123'), role: 'finance_manager', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150', department: 'General' },
  { id: 'usr_demo_9', name: 'Research Coordinator', email: 'research@campusx.demo', password: hashPassword('Demo@123'), role: 'research_coordinator', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150', department: 'General' },
  { id: 'usr_demo_10', name: 'Placement Officer', email: 'placement@campusx.demo', password: hashPassword('Demo@123'), role: 'placement_officer', avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150', department: 'General' },
  { id: 'usr_demo_11', name: 'Aarav Sharma (Student)', email: 'student@campusx.demo', password: hashPassword('Demo@123'), role: 'student', avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150', department: 'General' },
  { id: 'usr_demo_12', name: 'Parent Account', email: 'parent@campusx.demo', password: hashPassword('Demo@123'), role: 'sports_parent', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150', department: 'General' },
  { id: 'usr_demo_13', name: 'Alumni Account', email: 'alumni@campusx.demo', password: hashPassword('Demo@123'), role: 'alumni', avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150', department: 'General' },
  { id: 'usr_demo_14', name: 'Lead Recruiter', email: 'recruiter@campusx.demo', password: hashPassword('Demo@123'), role: 'recruiter', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150', department: 'General' },
  { id: 'usr_demo_sports_dir', name: 'Dr. Sunita Verma (Sports Director)', email: 'sportsdirector@campusx.demo', password: hashPassword('Demo@123'), role: 'sports_director', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150', department: 'General' },
  { id: 'usr_demo_coach', name: 'Prof. Gurpreet Singh (Coach)', email: 'coach@campusx.demo', password: hashPassword('Demo@123'), role: 'coach', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150', department: 'General' },
  { id: 'usr_demo_athlete', name: 'Aarav Sharma (Athlete)', email: 'athlete@campusx.demo', password: hashPassword('Demo@123'), role: 'athlete', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150', department: 'General' },
  { id: 'usr_demo_parent_gen', name: 'General Parent Account', email: 'parent_role@campusx.demo', password: hashPassword('Demo@123'), role: 'parent', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150', department: 'General' },
  { id: 'usr_demo_dept', name: 'Department Admin', email: 'deptadmin@campusx.demo', password: hashPassword('Demo@123'), role: 'department_admin', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150', department: 'CS' },
  { id: 'usr_demo_library', name: 'Library Administrator', email: 'libraryadmin@campusx.demo', password: hashPassword('Demo@123'), role: 'library_admin', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150', department: 'General' },
  { id: 'usr_demo_hostel', name: 'Hostel Manager', email: 'hosteladmin@campusx.demo', password: hashPassword('Demo@123'), role: 'hostel_admin', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150', department: 'General' },
  { id: 'usr_demo_transport', name: 'Transport Coordinator', email: 'transportadmin@campusx.demo', password: hashPassword('Demo@123'), role: 'transport_admin', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150', department: 'General' },
  { id: 'usr_demo_medical', name: 'Dr. Sneha Fernandes (Medical Staff)', email: 'medical@campusx.demo', password: hashPassword('Demo@123'), role: 'medical_staff', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150', department: 'General' },
  { id: 'usr_demo_guest', name: 'Guest Visitor', email: 'guest@campusx.demo', password: hashPassword('Demo@123'), role: 'guest', avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150', department: 'General' },
  { id: 'usr_demo_consultant', name: 'External Consultant', email: 'consultant@campusx.demo', password: hashPassword('Demo@123'), role: 'consultant', avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150', department: 'General' },
  { id: 'usr_demo_auditor', name: 'Internal Auditor', email: 'auditor@campusx.demo', password: hashPassword('Demo@123'), role: 'auditor', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150', department: 'General' },
  { id: 'usr_demo_compliance', name: 'Governance Compliance Officer', email: 'compliance@campusx.demo', password: hashPassword('Demo@123'), role: 'compliance_officer', avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150', department: 'General' }
];

export async function POST(request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required.' }, { status: 400 });
    }

    const emailLower = email.trim().toLowerCase();
    const hashedPassword = hashPassword(password);

    const user = demoAccounts.find(u => 
      u.email.toLowerCase() === emailLower && 
      (u.password === hashedPassword || password === 'Demo@123' || password === 'admin123' || password === 'faculty123' || password === 'student123' || password === 'hod123' || password === 'placement123' || password === 'PlatformAdmin@2026')
    );

    if (!user) {
      return NextResponse.json({ error: 'Invalid email or password.' }, { status: 401 });
    }

    const { password: _, ...userWithoutPassword } = user;
    return NextResponse.json({ success: true, user: userWithoutPassword });
  } catch (err) {
    return NextResponse.json({ error: 'Server authentication error.' }, { status: 500 });
  }
}
