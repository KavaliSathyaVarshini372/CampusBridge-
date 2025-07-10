
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

let app: FirebaseApp;
let auth: Auth;
let db: Firestore;

if (isFirebaseEnabled) {
  if (!getApps().length) {
    app = initializeApp(firebaseConfig);
  } else {
    app = getApp();
  }
  auth = getAuth(app);
  db = getFirestore(app);
} else {
  console.warn("Firebase configuration is missing or uses placeholder values. Firebase features will be disabled.");
}

// These exports are now safe because they are guarded by the isFirebaseEnabled check.
// If Firebase is disabled, they will be undefined, and the app's logic (in useAuth and server actions) handles this case.
// @ts-ignore
export const firebaseApp: FirebaseApp = app;
// @ts-ignore
export const firebaseAuth: Auth = auth;
// @ts-ignore
export const firestoreDb: Firestore = db;

// This function is for client-side components to safely get the auth instance.
export function initializeFirebase() {
  if (!isFirebaseEnabled) {
    throw new Error("Firebase is not enabled. Please check your configuration.");
  }
  // The app is already initialized above, so we can just return the auth instance.
  return auth;
}
