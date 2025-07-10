
'use server';

import { z } from 'zod';
import { CollaborationPostSchema } from '@/lib/schemas';
import { revalidatePath } from 'next/cache';
import { addReport } from './admin';

const MOCK_COLLABORATION_POSTS = [
    {
        id: 'cl-1',
        authorId: 'user-1',
        authorName: 'Alice Johnson',
        authorAvatar: `https://placehold.co/40x40.png`,
        title: 'Looking for a study group for Quantum Physics',
        description: 'This class is tough! Looking for a few people to meet twice a week to go over lectures and problem sets. We can meet at the library or online.',
        tags: ['physics', 'study'],
        category: 'study-group',
        timestamp: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
        interestedUsers: [],
    },
    {
        id: 'cl-2',
        authorId: 'user-2',
        authorName: 'Bob Williams',
        authorAvatar: `https://placehold.co/40x40.png`,
        title: 'Frontend Developer for a Hackathon Project',
        description: 'I have a great idea for a mobile app to help students find free food on campus. I need a React Native developer to help me build the frontend. The hackathon is next month!',
        tags: ['hackathon', 'mobile-dev', 'react'],
        category: 'project',
        timestamp: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
        interestedUsers: ['guest-user'],
    },
    {
        id: 'cl-3',
        authorId: 'user-3',
        authorName: 'Charlie Brown',
        authorAvatar: `https://placehold.co/40x40.png`,
        title: 'Starting a Board Game Club!',
        description: 'Want to de-stress and play some board games? I\'m starting a new club for casual board game enthusiasts. All skill levels welcome. First meeting next Friday!',
        tags: ['club', 'social', 'games'],
        category: 'club',
        timestamp: new Date(Date.now() - 259200000).toISOString(), // 3 days ago
        interestedUsers: [],
    },
];

// This is an in-memory store. Data will reset on server restart.
let postsStore = [...MOCK_COLLABORATION_POSTS];


export async function getCollaborationPosts(category?: string) {
    const filteredPosts = category && category !== 'all' 
        ? postsStore.filter(p => p.category === category) 
        : postsStore;
    
    // We return a sorted copy to simulate a real database query
    return [...filteredPosts].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
}


export async function createCollaborationPost(values: z.infer<typeof CollaborationPostSchema>) {
    const validatedFields = CollaborationPostSchema.safeParse(values);

    if (!validatedFields.success) {
        return { success: false, message: 'Invalid form data.' };
    }

    const newPost = {
        id: `cl-${Date.now()}`,
        authorId: 'guest-user', // Auth is disabled
        authorName: 'Guest User',
        authorAvatar: 'https://placehold.co/40x40.png',
        title: validatedFields.data.title,
        description: validatedFields.data.description,
        tags: [],
        category: validatedFields.data.category,
        timestamp: new Date().toISOString(),
        interestedUsers: [],
    };

    postsStore.unshift(newPost); // Add to the beginning of the array
    revalidatePath('/collaborate');
    return { success: true, message: 'Post created successfully!' };
}

export async function toggleInterest(postId: string) {
    const post = postsStore.find(p => p.id === postId);
    if (!post) {
        return { success: false, message: 'Post not found.' };
    }

    const mockUserId = "guest-user"; // Auth is disabled
    const isInterested = post.interestedUsers.includes(mockUserId);

    if (isInterested) {
        post.interestedUsers = post.interestedUsers.filter(id => id !== mockUserId);
    } else {
        post.interestedUsers.push(mockUserId);
    }
    
    revalidatePath('/collaborate');
    return { success: true, message: 'Interest updated.' };
}

export async function reportPost(postId: string, reason: string) {
    const post = postsStore.find(p => p.id === postId);
    if (!post) {
        return { success: false, message: 'Post not found.' };
    }
    return addReport(postId, 'Collaboration Post', reason);
}
