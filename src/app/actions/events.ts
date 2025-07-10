
'use server';

import { revalidatePath } from 'next/cache';
import { getFirebase } from '@/lib/firebase';
import { collection, getDocs, doc, updateDoc, arrayUnion, arrayRemove, getDoc, query, orderBy } from 'firebase/firestore';
import { getAuthenticatedUser } from '@/lib/auth';

const getDb = () => {
    const { db } = getFirebase();
    if (!db) {
        throw new Error("Firestore is not initialized.");
    }
    return db;
}

const getEventsCollection = () => {
    const db = getDb();
    return collection(db, 'events');
}

export async function getEvents() {
    try {
        const eventsCollection = getEventsCollection();
        const q = query(eventsCollection, orderBy('date', 'asc'));
        const eventSnapshot = await getDocs(q);
        const events = eventSnapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                title: data.title,
                date: data.date.toDate().toISOString(),
                time: data.time,
                location: data.location,
                description: data.description,
                image: data.image,
                aiHint: data.aiHint,
                rsvps: data.rsvps || [],
            };
        });
        return events;
    } catch (error) {
        console.warn("Could not connect to Firestore. Serving mock data. Error:", error);
        // Return mock data if Firestore is not accessible
        return [
            { id: '1', title: 'Tech Summit 2024', date: new Date(Date.now() + 86400000 * 7).toISOString(), time: '9:00 AM - 5:00 PM', location: 'Grand Hall', description: 'A full day of talks and workshops from industry leaders in AI, cloud computing, and more.', image: 'https://placehold.co/600x400.png', aiHint: 'technology conference', rsvps: [] },
            { id: '2', title: 'Campus Movie Night: Sci-Fi Classics', date: new Date(Date.now() + 86400000 * 10).toISOString(), time: '7:00 PM', location: 'Central Quad', description: 'Join us for a free outdoor screening of timeless sci-fi movies. Popcorn will be provided!', image: 'https://placehold.co/600x400.png', aiHint: 'outdoor cinema', rsvps: [] },
            { id: '3', title: 'Career Fair', date: new Date(Date.now() + 86400000 * 14).toISOString(), time: '10:00 AM - 3:00 PM', location: 'University Gymnasium', description: 'Connect with over 50 top employers from various industries. Bring your resume!', image: 'https://placehold.co/600x400.png', aiHint: 'job fair', rsvps: [] },
        ];
    }
}


export async function toggleRsvp(eventId: string) {
    const user = await getAuthenticatedUser();
    if (!user) {
        return { success: false, message: "You must be logged in to RSVP" };
    }

    const db = getDb();
    const eventDocRef = doc(db, 'events', eventId);
    const eventDoc = await getDoc(eventDocRef);

    if (!eventDoc.exists()) {
        return { success: false, message: "Event not found" };
    }
    
    const isRsvpd = eventDoc.data().rsvps?.includes(user.uid);
    
    await updateDoc(eventDocRef, {
        rsvps: isRsvpd ? arrayRemove(user.uid) : arrayUnion(user.uid)
    });
    
    revalidatePath('/events');
    return { success: true, isRsvpd: !isRsvpd };
}
