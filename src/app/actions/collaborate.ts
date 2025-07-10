
'use server';

import { z } from 'zod';
import { addDoc, collection, getDocs, orderBy, query, serverTimestamp, where, doc, updateDoc, arrayUnion, arrayRemove, getDoc } from 'firebase/firestore';
import { firestoreDb } from '@/lib/firebase';
import { CollaborationPostSchema } from '@/lib/schemas';
import { revalidatePath } from 'next/cache';

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

export async function getCollaborationPosts(category?: string) {
    if (!firestoreDb) {
        console.log("Firestore not configured. Returning mock collaboration posts.");
        const filteredPosts = category && category !== 'all' ? MOCK_COLLABORATION_POSTS.filter(p => p.category === category) : MOCK_COLLABORATION_POSTS;
        return filteredPosts;
    }

    try {
        const postsRef = collection(firestoreDb, 'collaborations');
        let q;

        if (category && category !== 'all') {
            q = query(postsRef, where('category', '==', category), orderBy('timestamp', 'desc'));
        } else {
            q = query(postsRef, orderBy('timestamp', 'desc'));
        }

        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            console.log("No collaboration posts in Firestore. Returning mock posts.");
            const filteredPosts = category && category !== 'all' ? MOCK_COLLABORATION_POSTS.filter(p => p.category === category) : MOCK_COLLABORATION_POSTS;
            return filteredPosts;
        }

        const posts = querySnapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                ...data,
                timestamp: data.timestamp?.toDate().toISOString() || new Date().toISOString(),
                interestedUsers: data.interestedUsers || [],
            };
        });
        return posts;
    } catch (error: any) {
        console.error('Error fetching collaboration posts:', error.message);
        if (error.code === 'permission-denied' || error.code === 'unauthenticated') {
            console.log("Firestore permission denied. Returning mock data as a fallback.");
            const filteredPosts = category && category !== 'all' ? MOCK_COLLABORATION_POSTS.filter(p => p.category === category) : MOCK_COLLABORATION_POSTS;
            return filteredPosts;
        }
        return [];
    }
}


export async function createCollaborationPost(values: z.infer<typeof CollaborationPostSchema>) {
    // Auth is disabled
    console.log("Post creation simulated. Auth is disabled.");
    return { success: true, message: 'Post created successfully! (Simulation)' };
}

export async function toggleInterest(postId: string) {
    // Auth is disabled
    console.log(`Interest toggled for post ${postId}. Auth is disabled.`);
    return { success: true, message: 'Interest updated (simulation).' };
}

export async function reportPost(postId: string, reason: string) {
    // Auth is disabled
    console.log(`Report submitted for post ${postId}. Auth is disabled.`);
    return { success: true, message: 'Post reported successfully. Our team will review it. (Simulation)' };
}
