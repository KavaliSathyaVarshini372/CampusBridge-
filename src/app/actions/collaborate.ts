
'use server';

import { z } from 'zod';
import { CollaborationPostSchema } from '@/lib/schemas';
import { revalidatePath } from 'next/cache';
import { addReport } from './admin';
import { getFirebase } from '@/lib/firebase';
import { collection, getDocs, addDoc, doc, updateDoc, arrayUnion, arrayRemove, query, where, serverTimestamp, orderBy, getDoc } from 'firebase/firestore';
import { getAuthenticatedUser } from '@/lib/auth';

const getDb = () => {
    const { db } = getFirebase();
    if (!db) {
        throw new Error("Firestore is not initialized.");
    }
    return db;
}

const getPostsCollection = () => {
    const db = getDb();
    return collection(db, 'collaborations');
}

export async function getCollaborationPosts(category?: string) {
    try {
        const postsCollection = getPostsCollection();
        let q;
        if (category && category !== 'all') {
            q = query(postsCollection, where('category', '==', category), orderBy('timestamp', 'desc'));
        } else {
            q = query(postsCollection, orderBy('timestamp', 'desc'));
        }

        const postSnapshot = await getDocs(q);
        const posts = postSnapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                authorId: data.authorId,
                authorName: data.authorName,
                authorAvatar: data.authorAvatar,
                title: data.title,
                description: data.description,
                tags: data.tags || [],
                category: data.category,
                timestamp: data.timestamp.toDate().toISOString(),
                interestedUsers: data.interestedUsers || [],
            };
        });
        return posts;
    } catch(error) {
        console.warn("Could not connect to Firestore. Serving mock data. Error:", error);
        return [
            { id: '1', authorId: 'mock1', authorName: 'Dr. Evelyn Reed', authorAvatar: `https://placehold.co/40x40.png`, title: 'AI in Healthcare Study Group', description: 'Seeking motivated students to explore the latest advancements in medical AI. We will review papers, discuss ethics, and work on a small-scale project.', tags: ['AI', 'Healthcare'], category: 'study-group', timestamp: new Date(Date.now() - 86400000).toISOString(), interestedUsers: ['a','b','c'] },
            { id: '2', authorId: 'mock2', authorName: 'Campus Green Initiative', authorAvatar: `https://placehold.co/40x40.png`, title: 'Recycling Program Volunteers', description: 'Join us in making our campus more sustainable! We need volunteers to help with our weekly recycling drives and awareness campaigns.', tags: ['Environment', 'Volunteer'], category: 'club', timestamp: new Date(Date.now() - 172800000).toISOString(), interestedUsers: ['d'] },
            { id: '3', authorId: 'mock3', authorName: 'CS Department', authorAvatar: `https://placehold.co/40x40.png`, title: 'Hackathon Planning Committee', description: 'Looking for creative minds to help organize the annual Fall Hackathon. Roles available in logistics, marketing, and sponsorship outreach.', tags: ['Events', 'Tech'], category: 'project', timestamp: new Date(Date.now() - 259200000).toISOString(), interestedUsers: [] },
        ];
    }
}

export async function createCollaborationPost(values: z.infer<typeof CollaborationPostSchema>) {
    const validatedFields = CollaborationPostSchema.safeParse(values);
    if (!validatedFields.success) {
        return { success: false, message: 'Invalid form data.' };
    }
    
    const user = await getAuthenticatedUser();
    if (user?.email !== 'admin@example.com') {
        return { success: false, message: 'You do not have permission to create a post.' };
    }

    const postsCollection = getPostsCollection();
    const newPost = {
        authorId: user.uid,
        authorName: user.displayName || user.email,
        authorAvatar: user.photoURL || `https://placehold.co/40x40.png`,
        title: validatedFields.data.title,
        description: validatedFields.data.description,
        tags: [],
        category: validatedFields.data.category,
        timestamp: serverTimestamp(),
        interestedUsers: [],
    };

    await addDoc(postsCollection, newPost);
    revalidatePath('/collaborate');
    return { success: true, message: 'Post created successfully!' };
}

export async function toggleInterest(postId: string) {
    const user = await getAuthenticatedUser();
    if (!user) {
        return { success: false, message: 'You must be logged in to express interest.' };
    }

    const db = getDb();
    const postDocRef = doc(db, 'collaborations', postId);
    const postDoc = await getDoc(postDocRef);
    if (!postDoc.exists()) {
        return { success: false, message: 'Post not found.' };
    }

    const isInterested = postDoc.data().interestedUsers?.includes(user.uid);
    
    await updateDoc(postDocRef, {
        interestedUsers: isInterested ? arrayRemove(user.uid) : arrayUnion(user.uid)
    });
    
    revalidatePath('/collaborate');
    return { success: true, message: 'Interest updated.' };
}

export async function reportPost(postId: string, reason: string) {
    const db = getDb();
    const post = await getDoc(doc(db, 'collaborations', postId));
    if (!post.exists()) {
        return { success: false, message: 'Post not found.' };
    }
    return addReport(postId, 'Collaboration Post', reason);
}
