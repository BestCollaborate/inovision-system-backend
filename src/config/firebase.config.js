import { initializeApp, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import { loadEnvConfig } from '../utils/env.utils.js';

function initializeFirebase() {
  try {
    const serviceAccount = loadEnvConfig();
    
    // Initialize Firebase app with explicit app name
    const app = initializeApp({
      credential: cert(serviceAccount),
      projectId: serviceAccount.project_id,
      databaseURL: `https://${serviceAccount.project_id}.firebaseio.com`
    }, serviceAccount.project_id);

    // Initialize services
    const auth = getAuth(app);
    const db = getFirestore(app);

    console.log('\x1b[32m%s\x1b[0m', '✓ Firebase initialized successfully');
    return { auth, db };
  } catch (error) {
    console.error('\x1b[31m%s\x1b[0m', 'Firebase initialization failed:', error.message);
    throw new Error(`Firebase initialization failed: ${error.message}`);
  }
}

const { auth, db } = initializeFirebase();
export { auth, db };