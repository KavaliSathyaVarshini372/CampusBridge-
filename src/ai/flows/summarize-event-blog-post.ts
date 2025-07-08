'use server';
/**
 * @fileOverview A flow that generates summaries of past events for blog posts.
 *
 * - summarizeEventBlogPost - A function that handles the event summary generation process.
 * - SummarizeEventBlogPostInput - The input type for the summarizeEventBlogPost function.
 * - SummarizeEventBlogPostOutput - The return type for the summarizeEventBlogPost function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeEventBlogPostInputSchema = z.object({
  eventDetails: z.string().describe('Detailed description of the event.'),
});
export type SummarizeEventBlogPostInput = z.infer<typeof SummarizeEventBlogPostInputSchema>;

const SummarizeEventBlogPostOutputSchema = z.object({
  summary: z.string().describe('A concise summary of the event for a blog post.'),
});
export type SummarizeEventBlogPostOutput = z.infer<typeof SummarizeEventBlogPostOutputSchema>;

export async function summarizeEventBlogPost(input: SummarizeEventBlogPostInput): Promise<SummarizeEventBlogPostOutput> {
  return summarizeEventBlogPostFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeEventBlogPostPrompt',
  input: {schema: SummarizeEventBlogPostInputSchema},
  output: {schema: SummarizeEventBlogPostOutputSchema},
  prompt: `You are an expert blog writer specializing in creating engaging summaries of past events.

You will use the provided event details to generate a concise and captivating summary suitable for a blog post.

Event Details: {{{eventDetails}}}`,
});

const summarizeEventBlogPostFlow = ai.defineFlow(
  {
    name: 'summarizeEventBlogPostFlow',
    inputSchema: SummarizeEventBlogPostInputSchema,
    outputSchema: SummarizeEventBlogPostOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
