'use server';

import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { db } from '@/lib/firebase';

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
