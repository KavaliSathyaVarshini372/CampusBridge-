import Image from 'next/image';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, MapPin, Users } from 'lucide-react';
import { getEvents } from '@/app/actions/events';
import { RsvpButton } from '@/components/rsvp-button';

async function seedEvents() {
    const { db } = await import('@/lib/firebase');
    if (!db) return;
    const { collection, getDocs, addDoc } = await import('firebase/firestore');

    const eventsCollection = collection(db, 'events');
    const snapshot = await getDocs(eventsCollection);
    if (snapshot.empty) {
        console.log("Seeding events...");
        const eventsToSeed = [
            {
                title: 'Annual Tech Summit 2024',
                description: 'Join us for a day of tech talks, workshops, and networking with industry leaders.',
                date: '2024-10-26',
                time: '9:00 AM - 5:00 PM',
                location: 'Grand Auditorium',
                image: 'https://placehold.co/600x400.png',
                aiHint: 'conference technology',
                rsvps: [],
            },
            {
                title: 'Startup Pitch Night',
                description: 'Watch the brightest student entrepreneurs pitch their ideas to a panel of venture capitalists.',
                date: '2024-11-12',
                time: '6:00 PM - 9:00 PM',
                location: 'Innovation Hub',
                image: 'https://placehold.co/600x400.png',
                aiHint: 'startup pitch',
                rsvps: [],
            },
            {
                title: 'Art & Music Festival',
                description: 'Experience a vibrant celebration of creativity with live music, art installations, and food stalls.',
                date: '2024-11-22',
                time: '2:00 PM - 11:00 PM',
                location: 'University Lawn',
                image: 'https://placehold.co/600x400.png',
                aiHint: 'music festival',
                rsvps: [],
            },
        ];
        for (const event of eventsToSeed) {
            await addDoc(eventsCollection, event);
        }
    }
}

export default async function EventsPage() {
    await seedEvents(); 
    const events = await getEvents() as any[];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Upcoming Events</h1>
        <p className="text-muted-foreground">Discover what's happening on campus.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {events.length === 0 && (
            <p className="text-muted-foreground col-span-full text-center">No upcoming events. Check back soon!</p>
        )}
        {events.map((event) => (
          <Card key={event.id} className="flex flex-col overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader className="p-0">
              <div className="relative aspect-video">
                <Image src={event.image} alt={event.title} fill className="rounded-t-lg object-cover" data-ai-hint={event.aiHint} />
              </div>
            </CardHeader>
            <CardContent className="flex-grow p-6">
              <CardTitle className="text-xl mb-2">{event.title}</CardTitle>
              
              <div className="mt-4 space-y-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-primary" />
                  <span>{new Date(event.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' })}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-primary" />
                  <span>{event.time}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-primary" />
                  <span>{event.location}</span>
                </div>
              </div>
              <CardDescription className='mt-4'>{event.description}</CardDescription>
            </CardContent>
            <CardFooter className="flex justify-between items-center bg-secondary/30 p-4">
               <RsvpButton eventId={event.id} rsvps={event.rsvps} />
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Users className="h-4 w-4" />
                <span>{event.rsvps?.length || 0} attending</span>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
