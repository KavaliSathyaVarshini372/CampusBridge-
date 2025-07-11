
"use client";

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Calendar, Users, Newspaper, Mountain, ArrowRight, Clock, MapPin } from 'lucide-react';
import Link from 'next/link';
import { getEvents } from './actions/events';
import { getCollaborationPosts } from './actions/collaborate';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';

type Event = { id: string; title: string; date: string; time: string; location: string; description: string; image: string; aiHint: string; rsvps: string[]; };
type Post = { id: string; title: string; description: string; category: string; interestedUsers: string[]; };
type BlogPost = { slug: string; title: string; date: string; summary: string; };

const FloatingIcon = ({ icon, className, delay }: { icon: React.ReactNode, className: string, delay: number }) => (
  <motion.div
    className={`absolute p-2 bg-background rounded-full shadow-lg ${className}`}
    initial={{ y: 0, opacity: 0, scale: 0 }}
    animate={{ y: [0, -20, 0], opacity: 1, scale: 1 }}
    transition={{ duration: 4, repeat: Infinity, repeatType: 'mirror', delay }}
  >
    {icon}
  </motion.div>
);

const blogPosts = [
  { slug: 'fall-hackathon-2023', title: 'Fall Hackathon 2023', date: 'September 15-17, 2023', summary: 'A 3-day coding marathon where students built amazing projects from scratch.' },
  { slug: 'career-fair-2023', title: 'Annual Career Fair 2023', date: 'October 5, 2023', summary: 'Connecting students with top companies for internships and full-time opportunities.' },
  { slug: 'founders-talk-series', title: 'Founder\'s Talk: Journey of a Unicorn', date: 'October 20, 2023', summary: 'An inspiring talk by a successful alum who built a billion-dollar company.' },
];

const categoryDisplay: { [key: string]: string } = { 'study-group': 'Study Group', 'project': 'Project', 'club': 'Club', 'other': 'Other' };

const MotionCard = motion(Card);

function LoginToContinueButton({ children }: { children: React.ReactNode }) {
    const { user, loading } = useAuth();
    const router = useRouter();

    if (loading) return <Button disabled className="w-full">Loading...</Button>;
    if (!user) return <Button onClick={() => router.push('/login')} className="w-full">{children}</Button>;
    
    return <Button className="w-full">{children}</Button>;
}

export default function Home() {
  const [showWelcome, setShowWelcome] = useState(false);
  const [events, setEvents] = useState<Event[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    const welcomeShown = localStorage.getItem('welcomeShown');
    if (!welcomeShown) {
      const timer = setTimeout(() => {
        setShowWelcome(true);
        localStorage.setItem('welcomeShown', 'true');
      }, 1000);
      return () => clearTimeout(timer);
    }
    
    async function fetchData() {
        const [eventData, postData] = await Promise.all([
            getEvents(),
            getCollaborationPosts('all')
        ]);
        setEvents(eventData.slice(0, 3) as Event[]);
        setPosts(postData.slice(0, 3) as Post[]);
    }
    fetchData();

  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Dialog open={showWelcome} onOpenChange={setShowWelcome}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-2xl">Welcome to CampusBridge+!</DialogTitle>
            <DialogDescription className="pt-2">
              Your new all-in-one platform to connect with campus life. Discover events, collaborate on projects, and stay in the loop. Enjoy your stay!
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-20 md:py-32 lg:py-40 bg-secondary/30 relative overflow-hidden">
          <div className="container mx-auto text-center px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-4xl md:text-6xl font-bold tracking-tighter">Connect, Collaborate, Create.</h1>
              <p className="max-w-[600px] mx-auto mt-4 text-muted-foreground md:text-xl">
                CampusBridge+ is your central hub for university life. Discover events, find project partners, and build your community.
              </p>
              <Button asChild size="lg" className="mt-8">
                <Link href="/login">
                  Get Started <ArrowRight className="ml-2" />
                </Link>
              </Button>
            </motion.div>
          </div>
          <FloatingIcon icon={<Calendar className="w-6 h-6 text-primary" />} className="top-[15%] left-[10%] hidden lg:block" delay={0} />
          <FloatingIcon icon={<Users className="w-6 h-6 text-accent" />} className="top-[20%] right-[15%] hidden lg:block" delay={0.5} />
          <FloatingIcon icon={<Newspaper className="w-6 h-6 text-primary" />} className="bottom-[25%] left-[20%] hidden lg:block" delay={1} />
          <FloatingIcon icon={<Mountain className="w-6 h-6 text-accent" />} className="bottom-[20%] right-[25%] hidden lg:block" delay={1.5} />
        </section>

        {/* Events Section */}
        <section className="w-full py-16 md:py-24">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold tracking-tight">Upcoming Events</h2>
                    <p className="text-muted-foreground mt-2">Don't miss out on what's happening on campus.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {events.map((event, index) => (
                        <motion.div key={event.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: index * 0.1 }}>
                           <MotionCard whileHover={{ y: -5, rotate: 1, scale: 1.03 }} transition={{ type: 'spring', stiffness: 300 }} className="flex flex-col overflow-hidden shadow-lg h-full">
                                <CardHeader className="p-0">
                                    <div className="relative aspect-video">
                                        <Image src={event.image} alt={event.title} fill className="rounded-t-lg object-cover" data-ai-hint={event.aiHint} />
                                    </div>
                                </CardHeader>
                                <CardContent className="flex-grow p-6">
                                    <CardTitle className="text-xl mb-2">{event.title}</CardTitle>
                                    <div className="mt-4 space-y-2 text-sm text-muted-foreground">
                                        <div className="flex items-center gap-2"><Calendar className="h-4 w-4 text-primary" /><span>{new Date(event.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' })}</span></div>
                                        <div className="flex items-center gap-2"><Clock className="h-4 w-4 text-primary" /><span>{event.time}</span></div>
                                        <div className="flex items-center gap-2"><MapPin className="h-4 w-4 text-primary" /><span>{event.location}</span></div>
                                    </div>
                                </CardContent>
                                <CardFooter className="bg-secondary/30 p-4 mt-auto">
                                    <LoginToContinueButton>RSVP Now</LoginToContinueButton>
                                </CardFooter>
                            </MotionCard>
                        </motion.div>
                    ))}
                </div>
                 <div className="text-center mt-12">
                    <Button variant="outline" asChild>
                        <Link href="/login">View All Events <ArrowRight className="ml-2 h-4 w-4" /></Link>
                    </Button>
                </div>
            </div>
        </section>

        {/* Collaboration Section */}
        <section className="w-full py-16 md:py-24 bg-secondary/30">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold tracking-tight">Find Your Crew</h2>
                    <p className="text-muted-foreground mt-2">Connect with peers for projects, study groups, and more.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {posts.map((post, index) => (
                        <motion.div key={post.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: index * 0.1 }}>
                           <MotionCard whileHover={{ y: -5, rotate: -1, scale: 1.03 }} transition={{ type: 'spring', stiffness: 300 }} className="flex flex-col shadow-lg h-full">
                                <CardHeader>
                                    <CardTitle className="text-lg">{post.title}</CardTitle>
                                    <Badge variant="secondary" className="w-fit">{categoryDisplay[post.category] || 'General'}</Badge>
                                </CardHeader>
                                <CardContent className="flex-grow">
                                    <p className="text-muted-foreground line-clamp-3">{post.description}</p>
                                </CardContent>
                                <CardFooter className="bg-background mt-auto p-4">
                                     <LoginToContinueButton>Express Interest</LoginToContinueButton>
                                </CardFooter>
                            </MotionCard>
                        </motion.div>
                    ))}
                </div>
                 <div className="text-center mt-12">
                    <Button variant="outline" asChild>
                        <Link href="/login">Explore Collaborations <ArrowRight className="ml-2 h-4 w-4" /></Link>
                    </Button>
                </div>
            </div>
        </section>

        {/* Blog Section */}
        <section className="w-full py-16 md:py-24">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold tracking-tight">From the Blog</h2>
                    <p className="text-muted-foreground mt-2">Catch up on event highlights and campus stories.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {blogPosts.map((post, index) => (
                     <motion.div
                        key={post.slug}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                      >
                        <MotionCard whileHover={{ y: -5, rotate: 1, scale: 1.03 }} transition={{ type: 'spring', stiffness: 300 }} className="text-left shadow-lg h-full flex flex-col">
                          <CardHeader>
                            <CardTitle>{post.title}</CardTitle>
                            <CardDescription>{post.date}</CardDescription>
                          </CardHeader>
                          <CardContent className="flex-grow">
                            <p className="text-muted-foreground">{post.summary}</p>
                          </CardContent>
                          <CardFooter>
                             <Button asChild variant="secondary" className="w-full">
                                <Link href="/login">Read More <ArrowRight className="ml-2 h-4 w-4" /></Link>
                             </Button>
                          </CardFooter>
                        </MotionCard>
                     </motion.div>
                  ))}
                </div>
            </div>
        </section>

      </main>
    </div>
  );
}
