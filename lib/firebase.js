import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signInWithPopup, 
  signInWithPhoneNumber,
  RecaptchaVerifier,
  GoogleAuthProvider, 
  OAuthProvider,
  signOut,
  onAuthStateChanged 
} from 'firebase/auth';
import { 
  getFirestore, 
  initializeFirestore, 
  persistentLocalCache, 
  persistentMultipleTabManager,
  doc, 
  setDoc, 
  getDoc, 
  getDocs,
  collection, 
  addDoc, 
  serverTimestamp 
} from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAnalytics, isSupported } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyAUuTHvmWKSC_XRalJs1dpHGNl1Oce7r8w",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "campusx-os-erp.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "campusx-os-erp",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "campusx-os-erp.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "250193430959",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:250193430959:web:08a3f06e57e6282c3dc75a"
};

// Check if valid Firebase configuration is present
export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey && 
  firebaseConfig.projectId
);

let app = null;
let auth = null;
let db = null;
let storage = null;
let googleProvider = null;
let microsoftProvider = null;
let analytics = null;

if (typeof window !== 'undefined' || typeof process !== 'undefined') {
  try {
    if (isFirebaseConfigured) {
      app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
      auth = getAuth(app);
      
      // Initialize Firestore with high-performance multi-tab offline persistence
      try {
        if (typeof window !== 'undefined') {
          db = initializeFirestore(app, {
            localCache: persistentLocalCache({
              tabManager: persistentMultipleTabManager()
            })
          });
        } else {
          db = getFirestore(app);
        }
      } catch (cacheErr) {
        db = getFirestore(app);
      }

      storage = getStorage(app);
      googleProvider = new GoogleAuthProvider();
      googleProvider.setCustomParameters({ prompt: 'select_account' });
      microsoftProvider = new OAuthProvider('microsoft.com');
      microsoftProvider.setCustomParameters({ prompt: 'select_account' });

      if (typeof window !== 'undefined') {
        isSupported().then(supported => {
          if (supported && app) {
            analytics = getAnalytics(app);
          }
        }).catch(() => {});
      }
    }
  } catch (err) {
    console.warn('Firebase client initialization note:', err.message);
  }
}

// Ultra-fast timeout wrapper to prevent UI hanging on slow network or Firebase latency
export async function withTimeout(promise, ms = 2000, fallbackVal = null) {
  let timer;
  const timeoutPromise = new Promise((resolve) => {
    timer = setTimeout(() => resolve(fallbackVal), ms);
  });
  try {
    const res = await Promise.race([promise, timeoutPromise]);
    clearTimeout(timer);
    return res;
  } catch (e) {
    clearTimeout(timer);
    return fallbackVal;
  }
}

// Fast non-blocking Firestore getters
export async function fastGetDoc(docRef, timeoutMs = 1500) {
  return withTimeout(getDoc(docRef), timeoutMs, null);
}

export async function fastGetDocs(queryRef, timeoutMs = 1500) {
  return withTimeout(getDocs(queryRef), timeoutMs, null);
}

export async function fastSetDoc(docRef, data, options = {}, timeoutMs = 1500) {
  const setPromise = setDoc(docRef, data, options);
  return withTimeout(setPromise, timeoutMs, true);
}

export async function fastAddDoc(colRef, data, timeoutMs = 1500) {
  return withTimeout(addDoc(colRef, data), timeoutMs, null);
}

export { 
  app, 
  auth, 
  db, 
  storage, 
  analytics,
  getAnalytics,
  googleProvider,
  microsoftProvider,
  OAuthProvider,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signInWithPhoneNumber,
  RecaptchaVerifier,
  signOut,
  onAuthStateChanged,
  doc,
  setDoc,
  getDoc,
  getDocs,
  collection,
  addDoc,
  serverTimestamp
};
