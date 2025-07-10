
import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

export const isFirebaseEnabled = !!firebaseConfig.apiKey && firebaseConfig.apiKey !== 'YOUR_API_KEY_HERE';

function getFirebaseApp(): FirebaseApp | null {
    if (!isFirebaseEnabled) {
        console.warn("Firebase configuration is missing or uses placeholder values in .env.local. Firebase features will be disabled.");
        return null;
    }
    return getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
}

export function getFirebaseAuth(): Auth | null {
    const app = getFirebaseApp();
    return app ? getAuth(app) : null;
}

export function getFirebaseDb(): Firestore | null {
    const app = getFirebaseApp();
    return app ? getFirestore(app) : null;
}
