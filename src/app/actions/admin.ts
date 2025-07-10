
'use server';

import { collection, getDocs, orderBy, query, doc, updateDoc } from 'firebase/firestore';
import { firestoreDb } from '@/lib/firebase';
import { revalidatePath } from 'next/cache';

export async function getReports() {
    if (!firestoreDb) {
        console.log("Firestore not configured. Returning empty array for reports.");
        return [];
    }

    try {
        const reportsRef = collection(firestoreDb, 'reports');
        const q = query(reportsRef, orderBy('date', 'desc'));
        const querySnapshot = await getDocs(q);
        const reports = querySnapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                ...data,
                date: data.date,
            };
        });
        return reports;
    } catch (error: any) {
        console.error('Error fetching reports:', error.message);
        if (error.code === 'permission-denied' || error.code === 'unauthenticated') {
            console.warn("Firestore permission denied for reports. This is expected if not logged in as an admin. Returning empty array.");
        }
        return [];
    }
}

export async function updateReportStatus(reportId: string, status: 'Resolved' | 'Dismissed') {
    // Auth is disabled
    console.log(`Report status updated for ${reportId}. Auth is disabled.`);
    return { success: true, message: 'Report status updated (simulation).' };
}
