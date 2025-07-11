import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";

const firebaseConfig = {
  // apiKey: "AIzaSyDQ7Ib_eVJXviBskekBnGJVhYFZ6f72lKs",
  // authDomain: "campusbridge-e24a7.firebaseapp.com",
  // projectId: "campusbridge-e24a7",
  // storageBucket: "campusbridge-e24a7.firebasestorage.app",
  // messagingSenderId: "29197667820",
  // appId: "1:29197667820:web:e94abdfeb80f443a14c4c9",
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

export const isFirebaseEnabled = !!(firebaseConfig.apiKey && firebaseConfig.apiKey !== "AIzaSyDQ7Ib_eVJXviBskekBnGJVhYFZ6f72lKs");

// Singleton instances
let app: FirebaseApp;
let auth: Auth;
let db: Firestore;

function initializeFirebase() {
  if (!isFirebaseEnabled) {
    // Return nulls or handle the disabled case as needed
    return { app: null, auth: null, db: null };
  }

  if (!getApps().length) {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
  } else {
    app = getApp();
    auth = getAuth(app);
    db = getFirestore(app);
  }
  return { app, auth, db };
}

// Export a single function to get the initialized services
export function getFirebase() {
    // This will initialize the app if it's not already initialized
    // and return the existing instances if it is.
    return initializeFirebase();
}
