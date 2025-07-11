
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
        console.warn("Firestore is not available. Serving empty array.");
        return [];
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
        console.warn("Could not connect to Firestore to get collaborations. Serving empty array. Error:", error);
        return [];
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
        authorName: user.email,
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
