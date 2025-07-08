"use client";

import { useState } from 'react';
import { summarizeEventBlogPost } from '@/ai/flows/summarize-event-blog-post';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Sparkles } from 'lucide-react';
import { Skeleton } from './ui/skeleton';

export function BlogSummaryGenerator({ eventDetails }: { eventDetails: string }) {
  const [summary, setSummary] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async () => {
    setIsLoading(true);
    setSummary('');
    try {
      const result = await summarizeEventBlogPost({ eventDetails });
      setSummary(result.summary);
    } catch (error) {
      console.error('Error generating summary:', error);
      toast({
        title: 'Error',
        description: 'Failed to generate summary. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle>AI-Generated Summary</CardTitle>
        <CardDescription>Click the button to generate a blog-style summary.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <Button onClick={handleSubmit} disabled={isLoading} variant="default">
            <Sparkles className="mr-2 h-4 w-4" />
            {isLoading ? 'Generating...' : 'Generate with AI'}
          </Button>
        </div>
        {isLoading && (
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        )}
        {summary && (
          <div className="prose prose-sm dark:prose-invert max-w-none p-4 bg-secondary rounded-lg border">
            <p>{summary}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
