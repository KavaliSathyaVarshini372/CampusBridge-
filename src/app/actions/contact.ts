
'use server';

import { z } from 'zod';
import { ContactFormSchema } from '@/lib/schemas';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export async function saveContactInquiry(values: z.infer<typeof ContactFormSchema>) {
  if (!db) {
    return { success: false, message: 'Database service is not available.' };
  }

  const validatedFields = ContactFormSchema.safeParse(values);

  if (!validatedFields.success) {
    return { success: false, message: 'Invalid form data.' };
  }

  try {
    const inquiriesCollection = collection(db, 'inquiries');
    await addDoc(inquiriesCollection, {
      ...validatedFields.data,
      timestamp: serverTimestamp(),
    });

    return { success: true, message: 'Your message has been sent successfully!' };
  } catch (error) {
    console.error("Error saving inquiry:", error);
    return { success: false, message: 'An unexpected error occurred.' };
  }
}
