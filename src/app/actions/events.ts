
'use server';

import { arrayRemove, arrayUnion, collection, doc, getDocs, orderBy, query, updateDoc, getDoc } from 'firebase/firestore';
import { firestoreDb, firebaseAuth } from '@/lib/firebase';
import { revalidatePath } from 'next/cache';
import { headers } from "next/headers";
import { initializeApp, getApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";

// This is a temporary workaround for a bug in Next.js
// where server actions don't have access to the auth state
async function getAuthOrThrow() {
  if (firebaseAuth) {
    return firebaseAuth;
  }
  const headerList = headers();
  const session = headerList.get("x-firebase-session");
  if (session) {
    // Because firebase is already initialized in firebase.ts, we can just get the app
    const app = getApps()[0];
    const auth = getAuth(app);
    try {
        await auth.signInWithCustomToken(session);
        return auth;
    } catch(e) {
        console.error("Error signing in with custom token in server action:", e);
        // Fallback for some environments
        const newAuth = getAuth(app);
        await newAuth.updateCurrentUser(JSON.parse(session));
        return newAuth;
    }
  }
  return null;
}

export async function getEvents() {
    if (!firestoreDb) return [];

    try {
        const eventsRef = collection(firestoreDb, 'events');
        const q = query(eventsRef, orderBy('date', 'asc'));
        const querySnapshot = await getDocs(q);
        const events = querySnapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                ...data,
                date: data.date,
            };
        });
        return events;
    } catch (error) {
        console.error('Error fetching events:', error);
        return [];
    }
}

export async function toggleRsvp(eventId: string) {
    const auth = await getAuthOrThrow();

    if (!firestoreDb || !auth?.currentUser) {
        throw new Error('User is not authenticated or DB is not available.');
    }

    const userId = auth.currentUser.uid;
    const eventRef = doc(firestoreDb, 'events', eventId);

    try {
        const eventSnap = await getDoc(eventRef);
        if (!eventSnap.exists()) {
            throw new Error("Event not found");
        }
        const eventData = eventSnap.data();
        const rsvps = eventData.rsvps || [];
        
        if (rsvps.includes(userId)) {
            await updateDoc(eventRef, {
                rsvps: arrayRemove(userId)
            });
        } else {
            await updateDoc(eventRef, {
                rsvps: arrayUnion(userId)
            });
        }
        revalidatePath('/events');
    } catch (error) {
        console.error('Error toggling RSVP:', error);
        throw new Error('Failed to update RSVP status.');
    }
}
