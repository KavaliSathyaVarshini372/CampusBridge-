
'use server';

import { z } from 'zod';
import { CollaborationPostSchema } from '@/lib/schemas';
import { revalidatePath } from 'next/cache';
import { addReport } from './admin';
import { firestoreDb } from '@/lib/firebase';
import { collection, getDocs, addDoc, doc, updateDoc, arrayUnion, arrayRemove, query, where, serverTimestamp, orderBy, getDoc } from 'firebase/firestore';
import { getAuthenticatedUser } from '@/lib/auth';

if (!firestoreDb) {
    throw new Error("Firestore is not initialized.");
}

const postsCollection = collection(firestoreDb, 'collaborations');

export async function getCollaborationPosts(category?: string) {
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
}

export async function createCollaborationPost(values: z.infer<typeof CollaborationPostSchema>) {
    const validatedFields = CollaborationPostSchema.safeParse(values);
    if (!validatedFields.success) {
        return { success: false, message: 'Invalid form data.' };
    }
    
    const user = await getAuthenticatedUser();
    if (!user) {
        return { success: false, message: 'You must be logged in to create a post.' };
    }

    const newPost = {
        authorId: user.uid,
        authorName: user.email, // Or a display name if available
        authorAvatar: `https://placehold.co/40x40.png`,
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

    const postDocRef = doc(firestoreDb, 'collaborations', postId);
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
    const post = await getDoc(doc(firestoreDb, 'collaborations', postId));
    if (!post.exists()) {
        return { success: false, message: 'Post not found.' };
    }
    return addReport(postId, 'Collaboration Post', reason);
}
