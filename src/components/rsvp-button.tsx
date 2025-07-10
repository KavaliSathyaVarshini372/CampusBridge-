
"use client";

import { useTransition } from 'react';
import { Button } from './ui/button';
import { toggleRsvp } from '@/app/actions/events';
import { useToast } from '@/hooks/use-toast';

interface RsvpButtonProps {
    eventId: string;
    rsvps: string[];
}

export function RsvpButton({ eventId, rsvps }: RsvpButtonProps) {
    const { toast } = useToast();
    const [isPending, startTransition] = useTransition();
    
    // Auth is disabled
    const mockUserId = 'guest-user';
    const isRsvpd = rsvps?.includes(mockUserId);

    const handleRsvp = () => {
        startTransition(async () => {
            try {
                await toggleRsvp(eventId);
                toast({
                    title: 'Success',
                    description: isRsvpd ? "You have successfully un-RSVP'd (simulation)." : 'You have successfully RSVP\'d! (simulation)',
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
