import Link from 'next/link';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

const pastEvents = [
  {
    slug: 'fall-hackathon-2023',
    title: 'Fall Hackathon 2023',
    date: 'September 15-17, 2023',
    summary: 'A 3-day coding marathon where students built amazing projects from scratch.'
  },
  {
    slug: 'career-fair-2023',
    title: 'Annual Career Fair 2023',
    date: 'October 5, 2023',
    summary: 'Connecting students with top companies for internships and full-time opportunities.'
  },
  {
    slug: 'founders-talk-series',
    title: 'Founder\'s Talk: Journey of a Unicorn',
    date: 'October 20, 2023',
    summary: 'An inspiring talk by a successful alum who built a billion-dollar company.'
  },
];

export default function BlogPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Event Blog</h1>
        <p className="text-muted-foreground">Generate AI-powered summaries for past events.</p>
      </div>
      <div className="space-y-6">
        {pastEvents.map((event) => (
          <Card key={event.slug} className="shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader>
              <CardTitle>{event.title}</CardTitle>
              <CardDescription>{event.date}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{event.summary}</p>
            </CardContent>
            <CardFooter>
              <Button asChild variant="secondary">
                <Link href={`/blog/${event.slug}`}>
                  Generate Summary <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
