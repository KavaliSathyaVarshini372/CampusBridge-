
"use client";

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Calendar, Users, Newspaper, Mountain, ArrowRight } from 'lucide-react';
import Link from 'next/link';

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

const featureCards = [
  {
    icon: <Calendar className="w-8 h-8 text-primary" />,
    title: "Events",
    description: "Stay updated with the latest campus happenings, from tech talks to cultural festivals.",
  },
  {
    icon: <Users className="w-8 h-8 text-primary" />,
    title: "Collaborate",
    description: "Find project partners, study groups, or new friends for your next big idea.",
  },
  {
    icon: <Newspaper className="w-8 h-8 text-primary" />,
    title: "Blog",
    description: "Read engaging summaries and insights from past events, powered by AI.",
  }
];

export default function Home() {
  const [showWelcome, setShowWelcome] = useState(false);

  useEffect(() => {
    const welcomeShown = localStorage.getItem('welcomeShown');
    if (!welcomeShown) {
      const timer = setTimeout(() => {
        setShowWelcome(true);
        localStorage.setItem('welcomeShown', 'true');
      }, 1000);
      return () => clearTimeout(timer);
    }
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
           {/* Floating Icons */}
          <FloatingIcon icon={<Calendar className="w-6 h-6 text-primary" />} className="top-[15%] left-[10%] hidden lg:block" delay={0} />
          <FloatingIcon icon={<Users className="w-6 h-6 text-accent" />} className="top-[20%] right-[15%] hidden lg:block" delay={0.5} />
          <FloatingIcon icon={<Newspaper className="w-6 h-6 text-primary" />} className="bottom-[25%] left-[20%] hidden lg:block" delay={1} />
          <FloatingIcon icon={<Mountain className="w-6 h-6 text-accent" />} className="bottom-[20%] right-[25%] hidden lg:block" delay={1.5} />
        </section>

        {/* Features Section */}
        <section className="w-full py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tight">Everything You Need in One Place</h2>
              <p className="text-muted-foreground mt-2">Simplify your student life with our integrated platform.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {featureCards.map((feature, index) => (
                 <motion.div
                    key={feature.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.2 }}
                  >
                    <Card className="text-center shadow-lg hover:shadow-xl transition-shadow h-full">
                      <CardHeader>
                        <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit">
                          {feature.icon}
                        </div>
                        <CardTitle className="mt-4">{feature.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground">{feature.description}</p>
                      </CardContent>
                    </Card>
                 </motion.div>
              ))}
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="w-full py-16 md:py-24 bg-secondary/30">
           <div className="container mx-auto text-center px-4">
             <h2 className="text-3xl font-bold tracking-tight">Ready to Dive In?</h2>
             <p className="max-w-[600px] mx-auto mt-4 text-muted-foreground md:text-lg">
               Create an account or sign in to unlock the full potential of your campus community.
             </p>
             <Button asChild size="lg" className="mt-8">
                <Link href="/login">
                  Join Now
                </Link>
              </Button>
           </div>
        </section>
      </main>

    </div>
  );
}
