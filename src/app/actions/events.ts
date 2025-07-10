
'use server';

import { revalidatePath } from 'next/cache';
import { firestoreDb } from '@/lib/firebase';
import { collection, getDocs, doc, updateDoc, arrayUnion, arrayRemove, getDoc, query, orderBy } from 'firebase/firestore';
import { getAuthenticatedUser } from '@/lib/auth';

if (!firestoreDb) {
    throw new Error("Firestore is not initialized.");
}

const eventsCollection = collection(firestoreDb, 'events');

export async function getEvents() {
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
}


export async function toggleRsvp(eventId: string) {
    const user = await getAuthenticatedUser();
    if (!user) {
        return { success: false, message: "You must be logged in to RSVP" };
    }

    const eventDocRef = doc(firestoreDb, 'events', eventId);
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
