import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

export const firebaseConfig = {
  apiKey: "AIzaSyCf8dqGnLfzNLXo0Vs1M-yEaQaVtpxKNLw",
  authDomain: "kayan-events.firebaseapp.com",
  projectId: "kayan-events",
  storageBucket: "kayan-events.firebasestorage.app",
  messagingSenderId: "226655667781",
  appId: "1:226655667781:web:33824e334b6ad5afc0052c",
  measurementId: "G-RCMVVNZSD8"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);
export const db = getFirestore(app);
