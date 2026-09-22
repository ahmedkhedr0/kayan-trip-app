// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getAnalytics, isSupported } from 'firebase/analytics';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDgKglhHSOhcNekyGUmdp3zPxBrXOgSMs0",
  authDomain: "kayan-trip.firebaseapp.com",
  projectId: "kayan-trip",
  storageBucket: "kayan-trip.firebasestorage.app",
  messagingSenderId: "5790659189",
  appId: "1:5790659189:web:57fcdbb5dc21e16767be3c",
  measurementId: "G-13RRY86Z78"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Firestore — this is what every component imports as `db`
export const db = getFirestore(app);

// Auth — used by AdminModal for real admin sign-in (replaces the old hardcoded PIN)
export const auth = getAuth(app);

// Analytics only works in the browser (not during a server-side build step),
// and isSupported() also guards against browsers that block it.
export let analytics: ReturnType<typeof getAnalytics> | undefined;
if (typeof window !== 'undefined') {
  isSupported()
    .then((supported) => {
      if (supported) {
        analytics = getAnalytics(app);
      }
    })
    .catch(() => {
      // ignore — analytics is non-essential
    });
}

export default app;
