import { z } from 'zod';

export const ContactFormSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});
export type ContactFormValues = z.infer<typeof ContactFormSchema>;

export const CollaborationPostSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  category: z.enum(['study-group', 'project', 'club', 'other'], {
    required_error: "You need to select a category.",
  }),
  description: z.string().min(20, 'Description must be at least 20 characters'),
});
export type CollaborationPostValues = z.infer<typeof CollaborationPostSchema>;
