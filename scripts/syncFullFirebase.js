const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');
const { admin, adminAuth, adminDb } = require('../lib/firebaseAdmin');

const dbPath = path.resolve(__dirname, '../database.sqlite');
const backupPath = path.resolve(__dirname, '../database_backup.json');

async function syncAllToFirebase() {
  console.log('🚀 Starting Full CampusX Ecosystem Firebase Sync...');
  console.log('====================================================');

  if (!adminDb) {
    console.error('❌ Firebase Admin DB not initialized. Please check credentials.');
    process.exit(1);
  }

  const db = new sqlite3.Database(dbPath);

  const queryAll = (sql) => new Promise((resolve) => {
    db.all(sql, [], (err, rows) => {
      if (err) resolve([]);
      else resolve(rows || []);
    });
  });

  const stats = {};

  // Generic collection syncer using Firestore batch writes
  async function syncCollection(collectionName, items, idField = 'id') {
    if (!items || items.length === 0) {
      console.log(`ℹ Collection [${collectionName}]: 0 records.`);
      return;
    }

    console.log(`⏳ Syncing [${collectionName}] (${items.length} records)...`);
    let batch = adminDb.batch();
    let count = 0;
    let batchCount = 0;

    for (const item of items) {
      const docId = String(item[idField] || ('doc_' + Date.now().toString(36) + Math.random().toString(36).substring(2, 6)));
      const docRef = adminDb.collection(collectionName).doc(docId);
      
      const cleanData = {};
      for (const [k, v] of Object.entries(item)) {
        if (v !== undefined) {
          cleanData[k] = v;
        }
      }
      cleanData.syncedAt = new Date().toISOString();

      batch.set(docRef, cleanData, { merge: true });
      count++;
      batchCount++;

      if (batchCount >= 450) {
        await batch.commit();
        batch = adminDb.batch();
        batchCount = 0;
      }
    }

    if (batchCount > 0) {
      await batch.commit();
    }

    stats[collectionName] = count;
    console.log(`✅ Collection [${collectionName}]: ${count} records synced.`);
  }

  try {
    // 1. Users Firestore Sync
    console.log('\n--- 1. Syncing Users Collection ---');
    const users = await queryAll(`SELECT * FROM users`);
    await syncCollection('users', users, 'id');

    // 2. Posts, Comments, Likes
    console.log('\n--- 2. Syncing Social Feed, Comments & Reactions ---');
    const posts = await queryAll(`SELECT * FROM posts`);
    await syncCollection('posts', posts, 'id');

    const comments = await queryAll(`SELECT * FROM comments`);
    await syncCollection('comments', comments, 'id');

    const likes = await queryAll(`SELECT * FROM likes`);
    await syncCollection('likes', likes, 'id');

    // 3. Tasks & Polls
    console.log('\n--- 3. Syncing Task Board & Campus Polls ---');
    const tasks = await queryAll(`SELECT * FROM tasks`);
    await syncCollection('tasks', tasks, 'id');

    const polls = await queryAll(`SELECT * FROM polls`);
    await syncCollection('polls', polls, 'id');

    // 4. Academic, Attendance & Registrations
    console.log('\n--- 4. Syncing Academic, Attendance & Course Matrices ---');
    const attendance = await queryAll(`SELECT * FROM attendance`);
    await syncCollection('attendance', attendance, 'id');

    const courseOfferings = await queryAll(`SELECT * FROM course_offerings`);
    await syncCollection('course_offerings', courseOfferings, 'id');

    const courseRegistrations = await queryAll(`SELECT * FROM course_registrations`);
    await syncCollection('course_registrations', courseRegistrations, 'id');

    const studentRegistrations = await queryAll(`SELECT * FROM student_registrations`);
    await syncCollection('student_registrations', studentRegistrations, 'id');

    const facultyAllocations = await queryAll(`SELECT * FROM faculty_allocations`);
    await syncCollection('faculty_allocations', facultyAllocations, 'id');

    const timetables = await queryAll(`SELECT * FROM timetables`);
    await syncCollection('timetables', timetables, 'id');

    // 5. Finance, Payments & Clearances
    console.log('\n--- 5. Syncing Finance, Payments & Ledgers ---');
    const payments = await queryAll(`SELECT * FROM payments`);
    await syncCollection('payments', payments, 'id');

    const feeClearances = await queryAll(`SELECT * FROM fee_clearances`);
    await syncCollection('fee_clearances', feeClearances, 'id');

    const installments = await queryAll(`SELECT * FROM installments`);
    await syncCollection('installments', installments, 'id');

    const refunds = await queryAll(`SELECT * FROM refunds`);
    await syncCollection('refunds', refunds, 'id');

    // 6. Sports & Athletics
    console.log('\n--- 6. Syncing Sports & Athletics ---');
    const sportsAthletes = await queryAll(`SELECT * FROM sports_athletes`);
    await syncCollection('sports_athletes', sportsAthletes, 'id');

    const sportsTeams = await queryAll(`SELECT * FROM sports_teams`);
    await syncCollection('sports_teams', sportsTeams, 'id');

    const sportsMatches = await queryAll(`SELECT * FROM sports_matches`);
    await syncCollection('sports_matches', sportsMatches, 'id');

    const sportsFacilities = await queryAll(`SELECT * FROM sports_facilities`);
    await syncCollection('sports_facilities', sportsFacilities, 'id');

    // 7. Operations & KV Store
    console.log('\n--- 7. Syncing Operations, SOC & System Store ---');
    const socIncidents = await queryAll(`SELECT * FROM soc_incidents`);
    await syncCollection('soc_incidents', socIncidents, 'id');

    const compliancePolicies = await queryAll(`SELECT * FROM compliance_policies`);
    await syncCollection('compliance_policies', compliancePolicies, 'id');

    const procurementOrders = await queryAll(`SELECT * FROM procurement_orders`);
    await syncCollection('procurement_orders', procurementOrders, 'id');

    const kvStore = await queryAll(`SELECT * FROM kv_store`);
    await syncCollection('kv_store', kvStore, 'key');

    // 8. Snapshot Store
    if (fs.existsSync(backupPath)) {
      console.log('\n--- 8. Syncing Persistent Snapshot Store ---');
      try {
        const backupRaw = fs.readFileSync(backupPath, 'utf8');
        const backupData = JSON.parse(backupRaw);
        await adminDb.collection('system_snapshots').doc('latest').set({
          ...backupData,
          uploadedAt: new Date().toISOString()
        }, { merge: true });
        console.log('✅ System Snapshot backed up to Firestore [system_snapshots/latest].');
        stats['system_snapshots'] = 1;
      } catch (bErr) {
        console.warn('Snapshot backup note:', bErr.message);
      }
    }

    // 9. Firebase Auth Bulk Sync
    if (adminAuth && users.length > 0) {
      console.log('\n--- 9. Provisioning Users into Firebase Auth ---');
      const authRecords = users
        .filter(u => u.email && u.email.includes('@'))
        .map(u => ({
          uid: u.id,
          email: u.email.trim().toLowerCase(),
          displayName: u.name || u.email.split('@')[0],
          photoURL: u.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
          customClaims: {
            role: u.role || 'student',
            dept: u.department || 'CampusX',
            customId: u.id
          }
        }));

      try {
        const importResults = await adminAuth.importUsers(authRecords);
        stats['firebase_auth_imported'] = importResults.successCount;
        console.log(`✅ Firebase Authentication: ${importResults.successCount} accounts imported.`);
      } catch (authErr) {
        console.warn('Firebase Auth bulk note:', authErr.message);
      }
    }

    console.log('\n====================================================');
    console.log('🎉 FULL FIREBASE ECOSYSTEM SYNCHRONIZATION COMPLETE!');
    console.log('Summary Statistics:', JSON.stringify(stats, null, 2));
    console.log('====================================================');

  } catch (err) {
    console.error('❌ Sync Error:', err);
  } finally {
    db.close();
    process.exit(0);
  }
}

syncAllToFirebase();
