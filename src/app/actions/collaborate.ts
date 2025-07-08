'use server';

import { z } from 'zod';
import { addDoc, collection, getDocs, orderBy, query, serverTimestamp, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { CollaborationPostSchema } from '@/lib/schemas';
import { auth } from '@/lib/firebase';
import { revalidatePath } from 'next/cache';

export async function getCollaborationPosts(category?: string) {
    if (!db) {
        console.log("Db not available");
        return [];
    }

    try {
        const postsRef = collection(db, 'collaborations');
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
                // Convert Firestore Timestamp to a serializable format
                timestamp: data.timestamp?.toDate().toISOString() || new Date().toISOString(),
            };
        });
        return posts;
    } catch (error) {
        console.error('Error fetching collaboration posts:', error);
        return [];
    }
}


export async function createCollaborationPost(values: z.infer<typeof CollaborationPostSchema>) {
    if (!db || !auth?.currentUser) {
        return { success: false, message: 'Authentication or Database not configured.' };
    }

    const validatedFields = CollaborationPostSchema.safeParse(values);

    if (!validatedFields.success) {
        return { success: false, message: 'Invalid form data.' };
    }

    const { uid, displayName, photoURL } = auth.currentUser;

    try {
        await addDoc(collection(db, 'collaborations'), {
            ...validatedFields.data,
            authorId: uid,
            authorName: displayName || 'Anonymous',
            authorAvatar: photoURL || '',
            timestamp: serverTimestamp(),
        });

        revalidatePath('/collaborate');
        return { success: true, message: 'Post created successfully!' };
    } catch (error) {
        console.error('Error creating post:', error);
        return { success: false, message: 'Failed to create post.' };
    }
}
