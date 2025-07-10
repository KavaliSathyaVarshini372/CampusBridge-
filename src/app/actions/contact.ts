'use server';

import { z } from 'zod';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { getFirebaseDb } from '@/lib/firebase';
import { ContactFormSchema } from '@/lib/schemas';

export async function saveContactInquiry(values: z.infer<typeof ContactFormSchema>) {
  const db = getFirebaseDb();
  if (!db) {
    return { success: false, message: 'Database not configured.' };
  }

  const validatedFields = ContactFormSchema.safeParse(values);

  if (!validatedFields.success) {
    return { success: false, message: 'Invalid form data.' };
  }

  try {
    await addDoc(collection(db, 'inquiries'), {
      ...validatedFields.data,
      timestamp: serverTimestamp(),
    });
    return { success: true, message: 'Your message has been sent!' };
  } catch (error) {
    console.error('Error saving inquiry:', error);
    return { success: false, message: 'Failed to send message.' };
  }
}
