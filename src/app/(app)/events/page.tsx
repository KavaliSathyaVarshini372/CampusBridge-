import Image from 'next/image';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, MapPin } from 'lucide-react';

const events = [
  {
    title: 'Annual Tech Summit 2024',
    description: 'Join us for a day of tech talks, workshops, and networking with industry leaders.',
    date: 'October 26, 2024',
    time: '9:00 AM - 5:00 PM',
    location: 'Grand Auditorium',
    image: 'https://placehold.co/600x400.png',
    aiHint: 'conference technology',
  },
  {
    title: 'Startup Pitch Night',
    description: 'Watch the brightest student entrepreneurs pitch their ideas to a panel of venture capitalists.',
    date: 'November 12, 2024',
    time: '6:00 PM - 9:00 PM',
    location: 'Innovation Hub',
    image: 'https://placehold.co/600x400.png',
    aiHint: 'startup pitch',
  },
  {
    title: 'Art & Music Festival',
    description: 'Experience a vibrant celebration of creativity with live music, art installations, and food stalls.',
    date: 'November 22, 2024',
    time: '2:00 PM - 11:00 PM',
    location: 'University Lawn',
    image: 'https://placehold.co/600x400.png',
    aiHint: 'music festival',
  },
];

export default function EventsPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Upcoming Events</h1>
        <p className="text-muted-foreground">Discover what's happening on campus.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {events.map((event) => (
          <Card key={event.title} className="flex flex-col overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader className="p-0">
              <div className="aspect-w-16 aspect-h-9">
                <Image src={event.image} alt={event.title} width={600} height={400} className="rounded-t-lg object-cover w-full h-full" data-ai-hint={event.aiHint} />
              </div>
            </CardHeader>
            <CardContent className="flex-grow p-6">
              <CardTitle className="text-xl mb-2">{event.title}</CardTitle>
              
              <div className="mt-4 space-y-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-primary" />
                  <span>{event.date}</span>
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
            <CardFooter className="flex justify-between bg-secondary/30 p-4">
              <Button>RSVP</Button>
              <Button variant="outline">Add to Calendar</Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
