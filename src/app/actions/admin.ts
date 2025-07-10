
'use server';

import { revalidatePath } from 'next/cache';
import { getFirebase } from '@/lib/firebase';
import { collection, getDocs, addDoc, doc, updateDoc, serverTimestamp, query, orderBy, getDoc } from 'firebase/firestore';
import { getAuthenticatedUser } from '@/lib/auth';

const getDb = () => {
    const { db } = getFirebase();
    if (!db) {
        throw new Error("Firestore is not initialized.");
    }
    return db;
}

export async function getReports() {
    try {
        const db = getDb();
        const reportsCollection = collection(db, 'reports');
        const q = query(reportsCollection, orderBy('date', 'desc'));
        const reportSnapshot = await getDocs(q);
        const reports = reportSnapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                itemType: data.itemType,
                reportedBy: data.reportedBy,
                reason: data.reason,
                date: data.date.toDate().toISOString(),
                status: data.status,
                itemId: data.itemId
            }
        });
        return reports;
    } catch(error) {
        console.warn("Could not connect to Firestore to get reports. Serving empty array. Error:", error);
        return [];
    }
}

export async function addReport(itemId: string, itemType: string, reason: string) {
    const user = await getAuthenticatedUser();
    if (!user) {
        return { success: false, message: 'You must be logged in to report a post.' };
    }

    const db = getDb();
    const postDocRef = doc(db, 'collaborations', itemId);
    const postDoc = await getDoc(postDocRef);

    if (!postDoc.exists()) {
        return { success: false, message: 'The post you are trying to report does not exist.' };
    }
    
    const newReport = {
        itemType,
        reportedBy: user.email,
        reason,
        date: serverTimestamp(),
        status: 'Pending',
        itemId,
    };
    await addDoc(collection(db, 'reports'), newReport);
    revalidatePath('/admin');
    return { success: true, message: 'Report submitted successfully. Our team will review it.' };
}

export async function updateReportStatus(reportId: string, status: 'Resolved' | 'Dismissed') {
    const user = await getAuthenticatedUser();
    if (user?.email !== 'admin@example.com') {
         return { success: false, message: 'You do not have permission to perform this action.' };
    }

    const db = getDb();
    const reportDoc = doc(db, 'reports', reportId);
    await updateDoc(reportDoc, { status });
    revalidatePath('/admin');
    return { success: true, message: `Report status updated to ${status}.` };
}
