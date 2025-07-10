
'use server';

import { z } from 'zod';
import { addDoc, collection, getDocs, orderBy, query, serverTimestamp, where, doc, updateDoc, arrayUnion, arrayRemove, getDoc } from 'firebase/firestore';
import { firestoreDb } from '@/lib/firebase';
import { CollaborationPostSchema } from '@/lib/schemas';
import { revalidatePath } from 'next/cache';

export async function getCollaborationPosts(category?: string) {
    if (!firestoreDb) {
        console.log("Db not available");
        return [];
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
    } catch (error) {
        console.error('Error fetching collaboration posts:', error);
        return [];
    }
}


export async function createCollaborationPost(values: z.infer<typeof CollaborationPostSchema>) {
    if (!firestoreDb) {
        return { success: false, message: 'Database not configured.' };
    }

    const validatedFields = CollaborationPostSchema.safeParse(values);

    if (!validatedFields.success) {
        return { success: false, message: 'Invalid form data.' };
    }

    // Auth is disabled
    const mockUser = {
        uid: 'guest-user',
        displayName: 'Guest User',
        photoURL: '',
    };

    try {
        await addDoc(collection(firestoreDb, 'collaborations'), {
            ...validatedFields.data,
            authorId: mockUser.uid,
            authorName: mockUser.displayName,
            authorAvatar: mockUser.photoURL,
            timestamp: serverTimestamp(),
            interestedUsers: [],
        });

        revalidatePath('/collaborate');
        return { success: true, message: 'Post created successfully!' };
    } catch (error) {
        console.error('Error creating post:', error);
        return { success: false, message: 'Failed to create post.' };
    }
}

export async function toggleInterest(postId: string) {
    // Auth is disabled
    console.log(`Interest toggled for post ${postId}. Auth is disabled.`);
    return { success: true, message: 'Interest updated (simulation).' };
}

export async function reportPost(postId: string, reason: string) {
    if (!firestoreDb) {
        return { success: false, message: 'Database not configured.' };
    }

     // Auth is disabled
    const mockUser = {
        uid: 'guest-user',
        email: 'guest@example.com',
    };

    try {
        await addDoc(collection(firestoreDb, 'reports'), {
            itemId: postId,
            itemType: 'Collaboration Post',
            reportedBy: mockUser.email,
            reason: reason,
            status: 'Pending',
            date: new Date().toISOString(),
        });
        return { success: true, message: 'Post reported successfully. Our team will review it.' };
    } catch (error) {
        console.error('Error reporting post:', error);
        return { success: false, message: 'Failed to report post.' };
    }
}
