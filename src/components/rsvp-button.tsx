
"use client";

import { useTransition } from 'react';
import { Button } from './ui/button';
import { toggleRsvp } from '@/app/actions/events';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

interface RsvpButtonProps {
    eventId: string;
    rsvps: string[];
}

export function RsvpButton({ eventId, rsvps }: RsvpButtonProps) {
    const { toast } = useToast();
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    
    // Auth is disabled
    const mockUserId = 'guest-user';
    const isRsvpd = rsvps?.includes(mockUserId);

    const handleRsvp = () => {
        startTransition(async () => {
            try {
                const result = await toggleRsvp(eventId);
                if (result.success) {
                    toast({
                        title: 'Success',
                        description: result.isRsvpd ? 'You have successfully RSVP\'d!' : "You have successfully un-RSVP'd.",
                    });
                    // Manually trigger a re-render by refreshing the page data
                    router.refresh();
                } else {
                     toast({
                        title: 'Error',
                        description: result.message,
                        variant: 'destructive',
                    });
                }
            } catch (error) {
                toast({
                    title: 'Error',
                    description: (error as Error).message || "An unexpected error occurred.",
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
