import { initializeApp, getApps } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const apiKey = import.meta.env.VITE_FIREBASE_API_KEY;
const projectId = import.meta.env.VITE_FIREBASE_PROJECT_ID;

const isPlaceholder = (val) =>
  !val ||
  val.includes('SUA_API_KEY') ||
  val.includes('SEU_PROJECT_ID') ||
  val.includes('SEU_PROJETO') ||
  val.includes('YOUR_API_KEY');

export const hasFirebaseConfig = Boolean(
  apiKey && projectId && !isPlaceholder(apiKey) && !isPlaceholder(projectId)
);

let db = null;
if (hasFirebaseConfig) {
  try {
    const firebaseConfig = {
      apiKey,
      authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
      projectId,
      storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
      appId: import.meta.env.VITE_FIREBASE_APP_ID,
    };
    const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
    db = getFirestore(app);
  } catch (e) {
    console.warn('Firebase init warning, falling back to LocalStorage:', e);
  }
}

export { db };


