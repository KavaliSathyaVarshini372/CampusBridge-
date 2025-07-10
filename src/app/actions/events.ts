
'use server';

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
      rsvps: ['guest-user'],
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

// This is an in-memory store. Data will reset on server restart.
let eventsStore = [...MOCK_EVENTS];

export async function getEvents() {
    return [...eventsStore].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
}

export async function toggleRsvp(eventId: string) {
    const event = eventsStore.find(e => e.id === eventId);
    if (!event) {
        return { success: false, message: "Event not found" };
    }

    const mockUserId = 'guest-user'; // Auth is disabled
    const isRsvpd = event.rsvps.includes(mockUserId);

    if (isRsvpd) {
        event.rsvps = event.rsvps.filter(id => id !== mockUserId);
    } else {
        event.rsvps.push(mockUserId);
    }
    
    revalidatePath('/events');
    return { success: true, isRsvpd: !isRsvpd };
}
