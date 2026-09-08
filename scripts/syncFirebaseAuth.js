const fs = require('fs');
const path = require('path');
const { admin, adminAuth, adminDb } = require('../lib/firebaseAdmin');

function parseAuthenticationFile(filePath) {
  if (!fs.existsSync(filePath)) {
    console.error('File not found:', filePath);
    return [];
  }

  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');
  const users = [];

  let current = {};

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    if (line.startsWith('Role:')) {
      current.role = line.replace('Role:', '').trim().toLowerCase().replace(/\s+/g, '_');
    } else if (line.startsWith('Name:')) {
      current.name = line.replace('Name:', '').trim();
    } else if (line.startsWith('User ID (Email):') || line.startsWith('Email:')) {
      current.email = line.split(':')[1].trim();
    } else if (line.startsWith('Password:')) {
      current.password = line.replace('Password:', '').trim();
    } else if (line.startsWith('ID:')) {
      current.id = line.replace('ID:', '').trim();
    } else if (line.startsWith('Department:') || line.startsWith('Dept:')) {
      current.dept = line.split(':')[1].trim();
    }

    // Delimiter or next record
    if (line.startsWith('----------------') || line.startsWith('================') || line === '') {
      if (current.email && current.password) {
        // Normalize role
        if (!current.role) {
          if (current.id && current.id.startsWith('FAC')) current.role = 'faculty';
          else if (current.id && current.id.startsWith('STU')) current.role = 'student';
          else current.role = 'student';
        }
        
        if (!current.name) {
          current.name = current.email.split('@')[0];
        }

        if (!current.id) {
          current.id = 'usr_' + current.email.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();
        }

        // Avatar placeholder based on role
        if (!current.avatar) {
          const avatarIndex = (users.length % 8) + 1;
          const avatars = [
            'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
            'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
            'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
            'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
            'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
            'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
            'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150',
            'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150'
          ];
          current.avatar = avatars[avatarIndex - 1];
        }

        users.push({ ...current });
        current = {};
      }
    }
  }

  // Add any trailing record
  if (current.email && current.password) {
    if (!current.role) current.role = 'student';
    if (!current.name) current.name = current.email.split('@')[0];
    if (!current.id) current.id = 'usr_' + current.email.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();
    users.push({ ...current });
  }

  // Deduplicate by email
  const uniqueUsers = [];
  const seenEmails = new Set();
  for (const u of users) {
    if (!seenEmails.has(u.email.toLowerCase())) {
      seenEmails.add(u.email.toLowerCase());
      uniqueUsers.push(u);
    }
  }

  return uniqueUsers;
}

async function syncToFirebase() {
  const authFilePath = path.resolve(__dirname, '../authentication.txt');
  console.log('📂 Parsing accounts from:', authFilePath);

  const usersToSync = parseAuthenticationFile(authFilePath);
  console.log(`🔍 Extracted ${usersToSync.length} unique user accounts from authentication.txt.`);

  if (!adminAuth && !adminDb) {
    console.error('❌ Firebase Admin is not initialized.');
    return;
  }

  let authSynced = 0;
  let firestoreSynced = 0;
  let skippedAuth = 0;

  for (const u of usersToSync) {
    // 1. Sync to Firebase Authentication
    if (adminAuth) {
      try {
        let firebaseUser;
        try {
          firebaseUser = await adminAuth.getUserByEmail(u.email);
          // Update password and display name
          await adminAuth.updateUser(firebaseUser.uid, {
            password: u.password.length >= 6 ? u.password : `${u.password}123`,
            displayName: u.name,
            photoURL: u.avatar
          });
          // Set custom user claims for RBAC
          await adminAuth.setCustomUserClaims(firebaseUser.uid, {
            role: u.role,
            dept: u.dept || 'CampusX',
            customId: u.id
          });
        } catch (err) {
          if (err.code === 'auth/user-not-found') {
            firebaseUser = await adminAuth.createUser({
              email: u.email,
              password: u.password.length >= 6 ? u.password : `${u.password}123`,
              displayName: u.name,
              photoURL: u.avatar
            });
            await adminAuth.setCustomUserClaims(firebaseUser.uid, {
              role: u.role,
              dept: u.dept || 'CampusX',
              customId: u.id
            });
          } else {
            throw err;
          }
        }
        authSynced++;
      } catch (err) {
        skippedAuth++;
        console.warn(`⚠️ Auth sync skipped for ${u.email}:`, err.message);
      }
    }

    // 2. Sync to Firestore 'users' collection
    if (adminDb) {
      try {
        const userDocRef = adminDb.collection('users').doc(u.id || u.email);
        await userDocRef.set({
          id: u.id,
          name: u.name,
          email: u.email,
          role: u.role,
          dept: u.dept || 'CampusX University',
          avatar: u.avatar,
          updated_at: new Date().toISOString()
        }, { merge: true });
        firestoreSynced++;
      } catch (err) {
        console.warn(`⚠️ Firestore sync error for ${u.email}:`, err.message);
      }
    }
  }

  console.log('====================================================');
  console.log('🎉 FIREBASE SYNCHRONIZATION SUMMARY');
  console.log('====================================================');
  console.log(`- Total Accounts in Registry: ${usersToSync.length}`);
  console.log(`- Firebase Auth Synced:       ${authSynced}`);
  console.log(`- Firestore Users Synced:     ${firestoreSynced}`);
  if (skippedAuth > 0) {
    console.log(`- Auth Errors/Skipped:        ${skippedAuth}`);
  }
  console.log('====================================================');

  return { total: usersToSync.length, authSynced, firestoreSynced };
}

if (require.main === module) {
  syncToFirebase().then(() => {
    process.exit(0);
  }).catch((err) => {
    console.error('Fatal sync error:', err);
    process.exit(1);
  });
}

module.exports = {
  parseAuthenticationFile,
  syncToFirebase
};
