
'use server';

import { z } from 'zod';
import { CollaborationPostSchema } from '@/lib/schemas';
import { revalidatePath } from 'next/cache';
import { addReport } from './admin';
import { db } from '@/lib/firebase';
import { collection, getDocs, addDoc, doc, updateDoc, arrayUnion, arrayRemove, query, where, serverTimestamp, orderBy, getDoc } from 'firebase/firestore';
import { getAuthenticatedUser } from '@/lib/auth';

export async function getCollaborationPosts(category?: string) {
    if (!db) {
        console.warn("Firestore is not available. Serving mock data.");
        const mockPosts = [
            { id: '1', title: 'AI Study Group', description: 'Looking for students interested in studying deep learning and NLP. We will meet weekly to discuss papers and work on projects.', category: 'study-group', interestedUsers: [], authorId: '', authorName: 'Admin', authorAvatar: '', timestamp: new Date().toISOString() },
            { id: '2', title: 'Campus Navigation App', description: 'Seeking developers and designers to build an app to help new students navigate the campus. React Native experience is a plus!', category: 'project', interestedUsers: [], authorId: '', authorName: 'Admin', authorAvatar: '', timestamp: new Date().toISOString() },
            { id: '3', title: 'Chess Club Recruitment', description: 'The university chess club is looking for new members of all skill levels. Join us for casual games and tournaments.', category: 'club', interestedUsers: [], authorId: '', authorName: 'Admin', authorAvatar: '', timestamp: new Date().toISOString() },
        ];
        if (category && category !== 'all') {
            return mockPosts.filter(p => p.category === category);
        }
        return mockPosts;
    }
    try {
        const postsCollection = collection(db, 'collaborations');
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
        console.warn("Could not connect to Firestore to get collaborations. Serving mock data. Error:", error);
        const mockPosts = [
            { id: '1', title: 'AI Study Group', description: 'Looking for students interested in studying deep learning and NLP. We will meet weekly to discuss papers and work on projects.', category: 'study-group', interestedUsers: [], authorId: '', authorName: 'Admin', authorAvatar: '', timestamp: new Date().toISOString() },
            { id: '2', title: 'Campus Navigation App', description: 'Seeking developers and designers to build an app to help new students navigate the campus. React Native experience is a plus!', category: 'project', interestedUsers: [], authorId: '', authorName: 'Admin', authorAvatar: '', timestamp: new Date().toISOString() },
            { id: '3', title: 'Chess Club Recruitment', description: 'The university chess club is looking for new members of all skill levels. Join us for casual games and tournaments.', category: 'club', interestedUsers: [], authorId: '', authorName: 'Admin', authorAvatar: '', timestamp: new Date().toISOString() },
        ];
        if (category && category !== 'all') {
            return mockPosts.filter(p => p.category === category);
        }
        return mockPosts;
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
    
    if (!db) {
        return { success: false, message: 'Database service is not available.' };
    }

    const postsCollection = collection(db, 'collaborations');
    const newPost = {
        authorId: user.uid,
        authorName: user.displayName,
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
    
    if (!db) {
        return { success: false, message: 'Database service is not available.' };
    }

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
    if (!db) {
        return { success: false, message: 'Database service is not available.' };
    }
    const post = await getDoc(doc(db, 'collaborations', postId));
    if (!post.exists()) {
        return { success: false, message: 'Post not found.' };
    }
    return addReport(postId, 'Collaboration Post', reason);
}
