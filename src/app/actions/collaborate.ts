
'use server';

import { z } from 'zod';
import { addDoc, collection, getDocs, orderBy, query, serverTimestamp, where, doc, updateDoc, arrayUnion, arrayRemove, getDoc } from 'firebase/firestore';
import { firestoreDb, firebaseAuth } from '@/lib/firebase';
import { CollaborationPostSchema } from '@/lib/schemas';
import { revalidatePath } from 'next/cache';
import { headers } from 'next/headers';
import { Auth, getAuth } from "firebase/auth";
import { initializeApp, getApp, getApps } from "firebase/app";

// This is a temporary workaround for a bug in Next.js
// where server actions don't have access to the auth state
async function getAuthOrThrow() {
  if (firebaseAuth) {
    return firebaseAuth;
  }
  const headerList = headers();
  const session = headerList.get("x-firebase-session");
  if (session) {
    const app = getApps().length > 0 ? getApp() : initializeApp({});
    const auth = getAuth(app);
    try {
        const userCredential = await auth.signInWithCustomToken(session);
        return auth;
    } catch(e) {
        console.error(e);
        const newAuth = getAuth(getApp());
        await newAuth.updateCurrentUser(JSON.parse(session));
        return newAuth;
    }
  }
  return null;
}


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
    const auth = await getAuthOrThrow();

    if (!firestoreDb || !auth?.currentUser) {
        return { success: false, message: 'Authentication or Database not configured.' };
    }

    const validatedFields = CollaborationPostSchema.safeParse(values);

    if (!validatedFields.success) {
        return { success: false, message: 'Invalid form data.' };
    }

    const { uid, displayName, photoURL } = auth.currentUser;

    try {
        await addDoc(collection(firestoreDb, 'collaborations'), {
            ...validatedFields.data,
            authorId: uid,
            authorName: displayName || 'Anonymous',
            authorAvatar: photoURL || '',
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
    const auth = await getAuthOrThrow();

    if (!firestoreDb || !auth?.currentUser) {
        return { success: false, message: 'You must be logged in to express interest.' };
    }

    const userId = auth.currentUser.uid;
    const postRef = doc(firestoreDb, 'collaborations', postId);

    try {
        const postSnap = await getDoc(postRef);
        if (!postSnap.exists()) {
            return { success: false, message: 'Post not found.' };
        }

        const postData = postSnap.data();
        const interestedUsers = postData.interestedUsers || [];

        if (interestedUsers.includes(userId)) {
            await updateDoc(postRef, {
                interestedUsers: arrayRemove(userId)
            });
        } else {
            await updateDoc(postRef, {
                interestedUsers: arrayUnion(userId)
            });
        }
        revalidatePath('/collaborate');
        return { success: true, message: 'Interest updated.' };
    } catch (error) {
        console.error('Error toggling interest:', error);
        return { success: false, message: 'Failed to update interest.' };
    }
}

export async function reportPost(postId: string, reason: string) {
    const auth = await getAuthOrThrow();
    if (!firestoreDb || !auth?.currentUser) {
        return { success: false, message: 'You must be logged in to report a post.' };
    }

    const { uid, email } = auth.currentUser;

    try {
        await addDoc(collection(firestoreDb, 'reports'), {
            itemId: postId,
            itemType: 'Collaboration Post',
            reportedBy: email || uid,
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
