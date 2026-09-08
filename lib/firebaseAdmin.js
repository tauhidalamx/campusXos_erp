const admin = require('firebase-admin');
const { getAuth } = require('firebase-admin/auth');
const { getFirestore } = require('firebase-admin/firestore');
const { getStorage } = require('firebase-admin/storage');
const path = require('path');
const fs = require('fs');

const serviceAccountPath = path.resolve(__dirname, '../campusx-os-erp-firebase-adminsdk-fbsvc-a2678d5b27.json');

let app = null;

if (!admin.getApps().length) {
  try {
    let serviceAccount = null;
    if (fs.existsSync(serviceAccountPath)) {
      try {
        serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));
      } catch (e) {}
    } else if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
      try {
        serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
      } catch (e) {}
    }

    if (serviceAccount) {
      app = admin.initializeApp({
        credential: admin.cert(serviceAccount),
        projectId: serviceAccount.project_id || 'campusx-os-erp',
        storageBucket: `${serviceAccount.project_id || 'campusx-os-erp'}.appspot.com`
      });
      console.log('✅ Firebase Admin SDK initialized for project:', serviceAccount.project_id);
    } else {
      app = admin.initializeApp({
        projectId: 'campusx-os-erp'
      });
    }
  } catch (error) {
    console.error('⚠️ Failed to initialize Firebase Admin SDK:', error.message);
  }
} else {
  app = admin.getApp();
}

const adminAuth = app ? getAuth(app) : null;
const adminDb = app ? getFirestore(app) : null;
const adminStorage = app ? getStorage(app) : null;

module.exports = {
  admin,
  app,
  adminAuth,
  adminDb,
  adminStorage
};
