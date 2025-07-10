
'use server';

import { z } from 'zod';
import { ContactFormSchema } from '@/lib/schemas';
import { revalidatePath } from 'next/cache';

// This is an in-memory store. Data will reset on server restart.
let inquiriesStore: any[] = [];

export async function saveContactInquiry(values: z.infer<typeof ContactFormSchema>) {
  const validatedFields = ContactFormSchema.safeParse(values);

  if (!validatedFields.success) {
    return { success: false, message: 'Invalid form data.' };
  }

  const newInquiry = {
    id: `inq-${Date.now()}`,
    ...validatedFields.data,
    timestamp: new Date().toISOString(),
  };

  inquiriesStore.unshift(newInquiry);
  console.log("New inquiry added. Current inquiries:", inquiriesStore);
  
  return { success: true, message: 'Your message has been sent successfully!' };
}
