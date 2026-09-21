import { initializeApp } from 'firebase/app';
import { getFirestore, doc, onSnapshot, setDoc } from 'firebase/firestore';
import { TripData } from './types';
import firebaseConfig from '../firebase-applet-config.json';
import { INITIAL_TRIP_DATA as initialTripData } from './data/initialData';

let db: any = null;
try {
  if (firebaseConfig && firebaseConfig.projectId && !firebaseConfig.apiKey.includes('DummyKey')) {
    const app = initializeApp(firebaseConfig);
    db = getFirestore(app);
  } else {
    console.warn('Firebase offline mode active');
  }
} catch (e) {
  console.warn('Firebase safe fallback:', e);
}

export { db };

const TRIP_DOC_ID = 'current_trip';

let isInitialized = false;

export const subscribeToTripData = (callback: (data: TripData | null) => void) => {
  if (!db) return () => {};

  try {
    const tripRef = doc(db, 'trips', TRIP_DOC_ID);
    return onSnapshot(
      tripRef,
      (snapshot) => {
        if (snapshot.exists()) {
          callback(snapshot.data() as TripData);
        } else {
          callback(null);
          if (!isInitialized) {
            isInitialized = true;
            saveTripDataToCloud(initialTripData).catch(() => {});
          }
        }
      },
      (error) => {
        console.warn('Firebase sync warning:', error);
      }
    );
  } catch (err) {
    return () => {};
  }
};

export const saveTripDataToCloud = async (tripData: TripData) => {
  if (!db) return false;
  try {
    const tripRef = doc(db, 'trips', TRIP_DOC_ID);
    await setDoc(tripRef, tripData, { merge: true });
    return true;
  } catch (error) {
    console.error('Error saving trip data to Firebase:', error);
    throw error;
  }
};