/**
 * CampusX OS ERP — Standalone Disaster Recovery Exporter CLI
 * 
 * Exports all database records from SQLite to a standalone JSON backup file.
 * Run anytime: node scripts/exportDisasterRecoveryBackup.js
 */

const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const dbPath = path.resolve(__dirname, '../database.sqlite');
const backupDir = path.resolve(__dirname, '../backups');

if (!fs.existsSync(backupDir)) {
  fs.mkdirSync(backupDir, { recursive: true });
}

const db = new sqlite3.Database(dbPath, async (err) => {
  if (err) {
    console.error('❌ Failed to connect to SQLite database:', err.message);
    process.exit(1);
  }

  console.log('📦 Connected to SQLite database:', dbPath);

  const queryTable = (sql) => {
    return new Promise((resolve) => {
      db.all(sql, [], (err, rows) => {
        resolve(rows || []);
      });
    });
  };

  try {
    const users = await queryTable('SELECT * FROM users');
    const posts = await queryTable('SELECT * FROM posts');
    const comments = await queryTable('SELECT * FROM comments');
    const likes = await queryTable('SELECT * FROM likes');
    const tasks = await queryTable('SELECT * FROM tasks');
    const polls = await queryTable('SELECT * FROM polls');
    const poll_options = await queryTable('SELECT * FROM poll_options');
    const poll_votes = await queryTable('SELECT * FROM poll_votes');
    const kv_store = await queryTable('SELECT * FROM kv_store');

    const timestamp = new Date().toISOString();
    const backupFilename = `campusx_full_backup_${Date.now()}.json`;
    const backupFilePath = path.join(backupDir, backupFilename);
    const latestFilePath = path.join(backupDir, 'campusx_full_backup_latest.json');

    const backupPayload = {
      metadata: {
        version: '2.0.0',
        system: 'CampusX University OS ERP',
        exportedAt: timestamp,
        recordsSummary: {
          users: users.length,
          posts: posts.length,
          comments: comments.length,
          likes: likes.length,
          tasks: tasks.length,
          polls: polls.length,
          poll_options: poll_options.length,
          poll_votes: poll_votes.length,
          kv_store: kv_store.length
        }
      },
      data: {
        users,
        posts,
        comments,
        likes,
        tasks,
        polls,
        poll_options,
        poll_votes,
        kv_store
      }
    };

    fs.writeFileSync(backupFilePath, JSON.stringify(backupPayload, null, 2), 'utf8');
    fs.writeFileSync(latestFilePath, JSON.stringify(backupPayload, null, 2), 'utf8');

    console.log('✅ Disaster recovery backup exported successfully:');
    console.log(`   - Path: ${backupFilePath}`);
    console.log(`   - Latest Link: ${latestFilePath}`);
    console.log(`   - Summary: ${users.length} users, ${posts.length} posts, ${tasks.length} tasks, ${polls.length} polls`);

    db.close();
    process.exit(0);
  } catch (exportErr) {
    console.error('❌ Export failed:', exportErr.message);
    db.close();
    process.exit(1);
  }
});
