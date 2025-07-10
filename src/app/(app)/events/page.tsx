
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Clock, MapPin, Users } from 'lucide-react';
import { getEvents } from '@/app/actions/events';
import { RsvpButton } from '@/components/rsvp-button';

export const revalidate = 0; // Revalidate this page on every request

export default async function EventsPage() {
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
