
'use server';

import { collection, getDocs, orderBy, query, doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { revalidatePath } from 'next/cache';

export async function getReports() {
    if (!db) return [];

    try {
        const reportsRef = collection(db, 'reports');
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
    } catch (error) {
        console.error('Error fetching reports:', error);
        return [];
    }
}

export async function updateReportStatus(reportId: string, status: 'Resolved' | 'Dismissed') {
    if (!db) {
        return { success: false, message: 'Database not configured.' };
    }

    try {
        const reportRef = doc(db, 'reports', reportId);
        await updateDoc(reportRef, { status });
        revalidatePath('/admin');
        return { success: true, message: 'Report status updated.' };
    } catch (error) {
        console.error('Error updating report status:', error);
        return { success: false, message: 'Failed to update report status.' };
    }
}
