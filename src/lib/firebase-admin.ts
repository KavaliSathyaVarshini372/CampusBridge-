import admin from "firebase-admin";

const initializeAdmin = () => {
  if (!admin.apps.length) {
    try {
      const serviceAccount = {
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: (process.env.FIREBASE_PRIVATE_KEY || "").replace(
          /\\n/g,
          "\n"
        ),
      };

      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
      console.log("Firebase Admin SDK initialized on-demand.");
    } catch (error: any) {
      console.error("Firebase Admin SDK initialization error:", error.message);
      throw new Error("Failed to initialize Firebase Admin SDK.");
    }
  }
  return admin;
};

export const getFirestore = () => initializeAdmin().firestore();
export const getAuth = () => initializeAdmin().auth();
