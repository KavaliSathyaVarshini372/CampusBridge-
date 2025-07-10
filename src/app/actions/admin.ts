
'use server';

import { revalidatePath } from 'next/cache';

const MOCK_REPORTS = [
    {
        id: 'rep-1',
        itemType: 'Collaboration Post',
        reportedBy: 'Guest User',
        reason: 'This is spam.',
        date: new Date(Date.now() - 86400000 * 2).toISOString(),
        status: 'Pending',
        itemId: 'cl-2',
    },
    {
        id: 'rep-2',
        itemType: 'User Profile',
        reportedBy: 'Another User',
        reason: 'Inappropriate profile picture.',
        date: new Date(Date.now() - 86400000 * 3).toISOString(),
        status: 'Resolved',
        itemId: 'user-3',
    }
];

// This is an in-memory store. Data will reset on server restart.
let reportsStore = [...MOCK_REPORTS];

export async function getReports() {
    // We return a sorted copy to simulate a real database query
    return [...reportsStore].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export async function addReport(itemId: string, itemType: string, reason: string) {
    const newReport = {
        id: `rep-${Date.now()}`,
        itemType,
        reportedBy: 'Guest User', // Auth is disabled
        reason,
        date: new Date().toISOString(),
        status: 'Pending',
        itemId,
    };
    reportsStore.unshift(newReport); // Add to the beginning of the array
    revalidatePath('/admin');
    revalidatePath('/collaborate');
    return { success: true, message: 'Report submitted successfully. Our team will review it.' };
}

export async function updateReportStatus(reportId: string, status: 'Resolved' | 'Dismissed') {
    const reportIndex = reportsStore.findIndex(r => r.id === reportId);
    if (reportIndex !== -1) {
        reportsStore[reportIndex].status = status;
        revalidatePath('/admin');
        return { success: true, message: `Report status updated to ${status}.` };
    }
    return { success: false, message: 'Report not found.' };
}
