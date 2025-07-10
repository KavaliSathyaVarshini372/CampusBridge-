
import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDQ7Ib_eVJXviBskekBnGJVhYFZ6f72lKs",
  authDomain: "campusbridge-e24a7.firebaseapp.com",
  projectId: "campusbridge-e24a7",
  storageBucket: "campusbridge-e24a7.firebasestorage.app",
  messagingSenderId: "29197667820",
  appId: "1:29197667820:web:e94abdfeb80f443a14c4c9",
};

export const isFirebaseEnabled = !!(firebaseConfig.apiKey && firebaseConfig.apiKey !== "YOUR_API_KEY_HERE");

let firebaseApp: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;

// Singleton pattern to initialize Firebase
export function initializeFirebase() {
    if (isFirebaseEnabled && !getApps().length) {
        firebaseApp = initializeApp(firebaseConfig);
        auth = getAuth(firebaseApp);
        db = getFirestore(firebaseApp);
    } else if (isFirebaseEnabled && getApps().length) {
        firebaseApp = getApp();
        auth = getAuth(firebaseApp);
        db = getFirestore(firebaseApp);
    }
    return { firebaseApp, auth, db };
}
