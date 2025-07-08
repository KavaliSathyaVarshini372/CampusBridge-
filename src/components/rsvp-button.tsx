"use client";

import { useTransition } from 'react';
import { Button } from './ui/button';
import { toggleRsvp } from '@/app/actions/events';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/use-auth';

interface RsvpButtonProps {
    eventId: string;
    rsvps: string[];
}

export function RsvpButton({ eventId, rsvps }: RsvpButtonProps) {
    const { user } = useAuth();
    const { toast } = useToast();
    const [isPending, startTransition] = useTransition();
    
    if (!user) return null;

    const isRsvpd = rsvps?.includes(user.uid);

    const handleRsvp = () => {
        startTransition(async () => {
            try {
                await toggleRsvp(eventId);
                toast({
                    title: 'Success',
                    description: isRsvpd ? "You have successfully un-RSVP'd." : 'You have successfully RSVP\'d!',
                });
            } catch (error) {
                toast({
                    title: 'Error',
                    description: (error as Error).message,
                    variant: 'destructive',
                });
            }
        });
    };

    return (
        <Button onClick={handleRsvp} disabled={isPending} variant={isRsvpd ? "secondary" : "default"}>
            {isPending ? 'Updating...' : isRsvpd ? 'Cancel RSVP' : 'RSVP'}
        </Button>
    );
}
