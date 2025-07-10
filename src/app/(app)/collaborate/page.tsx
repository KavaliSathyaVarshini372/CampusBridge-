
'use client'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, Users } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { NewCollaborationPostDialog } from '@/components/new-collaboration-post-dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { getCollaborationPosts, reportPost, toggleInterest } from '@/app/actions/collaborate';
import { useEffect, useState, useTransition } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Skeleton } from '@/components/ui/skeleton';
import { formatDistanceToNow } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

type Post = {
    id: string;
    authorId: string;
    authorName: string;
    authorAvatar: string;
    title: string;
    description: string;
    tags: string[];
    category: string;
    timestamp: string;
    interestedUsers: string[];
}

const categoryDisplay: { [key: string]: string } = {
  'study-group': 'Study Group',
  'project': 'Project',
  'club': 'Club',
  'other': 'Other',
};

function PostSkeleton() {
    return (
        <Card className="flex flex-col shadow-lg">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Skeleton className="h-10 w-10 rounded-full" />
                        <div>
                            <Skeleton className="h-4 w-24 mb-1" />
                            <Skeleton className="h-3 w-16" />
                        </div>
                    </div>
                    <Skeleton className="h-8 w-8" />
                </div>
            </CardHeader>
            <CardContent className="flex-grow">
                <Skeleton className="h-6 w-3/4 mb-2" />
                <div className="flex flex-wrap gap-2 mb-4">
                    <Skeleton className="h-5 w-16 rounded-full" />
                </div>
                <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-5/6" />
                </div>
            </CardContent>
            <CardFooter className="bg-secondary/30 flex justify-between items-center p-4">
                <Skeleton className="h-10 w-32" />
                 <Skeleton className="h-6 w-16" />
            </CardFooter>
        </Card>
    )
}

function ExpressInterestButton({ post, onInterestToggle }: { post: Post, onInterestToggle: (postId: string, isInterested: boolean) => void }) {
    const { toast } = useToast();
    const [isPending, startTransition] = useTransition();

    // Auth disabled
    const mockUserId = "guest-user";
    const isInterested = post.interestedUsers.includes(mockUserId);
    const isAuthor = post.authorId === mockUserId;

    if (isAuthor) {
        return (
            <Button disabled className="w-full">
                You are the author
            </Button>
        );
    }
    
    const handleClick = () => {
        startTransition(async () => {
            const result = await toggleInterest(post.id);
            if (result.success) {
                toast({ title: 'Success', description: isInterested ? 'Interest removed.' : 'You have expressed interest!' });
                onInterestToggle(post.id, !isInterested);
            } else {
                toast({ title: 'Error', description: result.message, variant: 'destructive' });
            }
        });
    };

    return (
        <Button onClick={handleClick} disabled={isPending} variant={isInterested ? "secondary" : "default"} className="w-full">
            {isPending ? "Updating..." : isInterested ? "Remove Interest" : "Express Interest"}
        </Button>
    )
}

function ReportDialog({ postId }: { postId: string }) {
    const { toast } = useToast();
    const [reason, setReason] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const [isPending, startTransition] = useTransition();

    const handleSubmit = () => {
        if (reason.trim().length < 10) {
            toast({ title: 'Error', description: 'Please provide a reason with at least 10 characters.', variant: 'destructive' });
            return;
        }
        startTransition(async () => {
            const result = await reportPost(postId, reason);
            if (result.success) {
                toast({ title: 'Report Submitted', description: result.message });
                setIsOpen(false);
                setReason('');
            } else {
                toast({ title: 'Error', description: result.message, variant: 'destructive' });
            }
        })
    }

    return (
        <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
            <AlertDialogTrigger asChild>
                <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-destructive focus:text-destructive focus:bg-destructive/10">
                    Report
                </DropdownMenuItem>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Report Post</AlertDialogTitle>
                    <AlertDialogDescription>
                        Please provide a reason for reporting this post. Your feedback helps us keep the community safe.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <div className="grid gap-2">
                    <Label htmlFor="reason">Reason</Label>
                    <Textarea id="reason" placeholder="e.g., Inappropriate content, spam, etc." value={reason} onChange={(e) => setReason(e.target.value)} />
                </div>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleSubmit} disabled={isPending}>
                        {isPending ? "Submitting..." : "Submit Report"}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}

export default function CollaboratePage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [posts, setPosts] = useState<Post[]>([]);
    const [isPending, startTransition] = useTransition();

    const category = searchParams.get('category') || 'all';

    useEffect(() => {
        startTransition(async () => {
            const fetchedPosts = await getCollaborationPosts(category) as Post[];
            setPosts(fetchedPosts);
        })
    }, [category]);

    const handleFilterChange = (value: string) => {
        const params = new URLSearchParams(window.location.search);
        if (value === 'all') {
            params.delete('category');
        } else {
            params.set('category', value);
        }
        router.push(`/collaborate?${params.toString()}`);
    };

    const handleInterestToggle = (postId: string, isInterested: boolean) => {
        const mockUserId = "guest-user";
        setPosts(prevPosts =>
            prevPosts.map(p => {
                if (p.id === postId) {
                    const interestedUsers = isInterested
                        ? [...p.interestedUsers, mockUserId]
                        : p.interestedUsers.filter(id => id !== mockUserId);
                    return { ...p, interestedUsers };
                }
                return p;
            })
        );
    };

    return (
    <div>
        <div className="flex items-center justify-between mb-8">
            <div>
            <h1 className="text-3xl font-bold">Collaboration Portal</h1>
            <p className="text-muted-foreground">Find partners for your next big idea.</p>
            </div>
            <NewCollaborationPostDialog />
        </div>

        <div className="flex items-center gap-4 mb-8">
            <Select onValueChange={handleFilterChange} defaultValue={category}>
            <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by interest" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="all">All Interests</SelectItem>
                <SelectItem value="study-group">Study Group</SelectItem>
                <SelectItem value="project">Project</SelectItem>
                <SelectItem value="club">Club</SelectItem>
                <SelectItem value="other">Other</SelectItem>
            </SelectContent>
            </Select>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {isPending ? (
                Array.from({ length: 3 }).map((_, i) => <PostSkeleton key={i} />)
            ) : posts.length === 0 ? (
                <div className="col-span-full text-center text-muted-foreground py-10">
                    <p>No posts found for this category.</p>
                </div>
            ) : (
                posts.map((post) => (
                    <Card key={post.id} className="flex flex-col shadow-lg hover:shadow-xl transition-shadow duration-300">
                        <CardHeader>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                            <Avatar>
                                <AvatarImage src={post.authorAvatar || `https://placehold.co/40x40.png`} alt={post.authorName} data-ai-hint="person face" />
                                <AvatarFallback>{post.authorName.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                                <p className="font-semibold">{post.authorName}</p>
                                <p className="text-sm text-muted-foreground">
                                    {formatDistanceToNow(new Date(post.timestamp), { addSuffix: true })}
                                </p>
                            </div>
                            </div>
                            <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                <DropdownMenuItem>View Profile</DropdownMenuItem>
                                <ReportDialog postId={post.id} />
                            </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                        </CardHeader>
                        <CardContent className="flex-grow">
                        <CardTitle className="text-lg mb-2">{post.title}</CardTitle>
                        <div className="flex flex-wrap gap-2 mb-4">
                            <Badge variant="secondary">{categoryDisplay[post.category] || 'General'}</Badge>
                        </div>
                        <CardDescription>{post.description}</CardDescription>
                        </CardContent>
                        <CardFooter className="bg-secondary/30 flex justify-between items-center p-4">
                             <ExpressInterestButton post={post} onInterestToggle={handleInterestToggle} />
                             <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Users className="h-4 w-4" />
                                <span>{post.interestedUsers.length}</span>
                             </div>
                        </CardFooter>
                    </Card>
                ))
            )}
        </div>
    </div>
  );
}
