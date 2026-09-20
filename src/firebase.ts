import { initializeApp } from 'firebase/app';
import { getFirestore, doc, onSnapshot, setDoc } from 'firebase/firestore';
import { TripData } from './types';
import firebaseConfig from '../firebase-applet-config.json';

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

const TRIP_DOC_ID = 'current_trip';

export const subscribeToTripData = (callback: (data: TripData | null) => void) => {
  const tripRef = doc(db, 'trips', TRIP_DOC_ID);
  return onSnapshot(
    tripRef,
    (snapshot) => {
      if (snapshot.exists()) {
        callback(snapshot.data() as TripData);
      } else {
        callback(null);
      }
    },
    (error) => {
      console.warn('Firebase sync warning:', error);
    }
  );
};

export const saveTripDataToCloud = async (tripData: TripData) => {
  try {
    const tripRef = doc(db, 'trips', TRIP_DOC_ID);
    await setDoc(tripRef, tripData, { merge: true });
    return true;
  } catch (error) {
    console.error('Error saving trip data to Firebase:', error);
    throw error;
  }
};