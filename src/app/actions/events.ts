
'use server';

import { arrayRemove, arrayUnion, collection, doc, getDocs, orderBy, query, updateDoc, getDoc } from 'firebase/firestore';
import { firestoreDb } from '@/lib/firebase';
import { revalidatePath } from 'next/cache';

const MOCK_EVENTS = [
    {
      id: '1',
      title: 'Annual Tech Summit',
      date: '2024-10-26T10:00:00Z',
      time: '10:00 AM - 5:00 PM',
      location: 'Main Auditorium',
      description: 'Join us for a day of insightful talks and workshops from industry leaders in technology.',
      image: 'https://placehold.co/600x400.png',
      aiHint: 'tech conference',
      rsvps: [],
    },
    {
      id: '2',
      title: 'Fall Career Fair',
      date: '2024-11-15T09:00:00Z',
      time: '9:00 AM - 4:00 PM',
      location: 'University Gymnasium',
      description: 'Connect with top employers from various industries. Bring your resume!',
      image: 'https://placehold.co/600x400.png',
      aiHint: 'career fair',
      rsvps: [],
    },
    {
      id: '3',
      title: 'Hackathon 2024',
      date: '2024-11-22T18:00:00Z',
      time: '6:00 PM (Fri) - 6:00 PM (Sun)',
      location: 'Engineering Building',
      description: 'A 48-hour coding marathon. Build something amazing and win prizes!',
      image: 'https://placehold.co/600x400.png',
      aiHint: 'students coding',
      rsvps: [],
    },
];

export async function getEvents() {
    if (!firestoreDb) return MOCK_EVENTS;

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
        
        // If there are no events in Firestore, return mock data.
        if (events.length === 0) {
            return MOCK_EVENTS;
        }

        return events;
    } catch (error: any) {
        console.error('Error fetching events:', error);
        // If there's a permission error, return mock data as a fallback.
        if (error.code === 'permission-denied') {
            console.log("Firestore permission denied. Returning mock data.");
            return MOCK_EVENTS;
        }
        return [];
    }
}

export async function toggleRsvp(eventId: string) {
    // Auth is disabled
    console.log(`RSVP toggled for event ${eventId}. Auth is disabled.`);
    return;


    // const auth = await getAuthOrThrow();

    // if (!firestoreDb || !auth?.currentUser) {
    //     throw new Error('User is not authenticated or DB is not available.');
    // }

    // const userId = auth.currentUser.uid;
    // const eventRef = doc(firestoreDb, 'events', eventId);

    // try {
    //     const eventSnap = await getDoc(eventRef);
    //     if (!eventSnap.exists()) {
    //         throw new Error("Event not found");
    //     }
    //     const eventData = eventSnap.data();
    //     const rsvps = eventData.rsvps || [];
        
    //     if (rsvps.includes(userId)) {
    //         await updateDoc(eventRef, {
    //             rsvps: arrayRemove(userId)
    //         });
    //     } else {
    //         await updateDoc(eventRef, {
    //             rsvps: arrayUnion(userId)
    //         });
    //     }
    //     revalidatePath('/events');
    // } catch (error) {
    //     console.error('Error toggling RSVP:', error);
    //     throw new Error('Failed to update RSVP status.');
    // }
}
