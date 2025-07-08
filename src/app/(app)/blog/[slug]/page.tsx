import { BlogSummaryGenerator } from '@/components/blog-summary-generator';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const MOCK_EVENT_DETAILS: { [key: string]: string } = {
  'fall-hackathon-2023': "The Fall Hackathon 2023 was a massive success, with over 200 participants. The event spanned three days, from September 15th to 17th. We had workshops on AI, web development, and mobile app creation. The winning project was 'CampusNav', an indoor navigation app for the university. Keynote speakers included developers from Google and Microsoft. Sponsors provided over $10,000 in prizes. The atmosphere was electric, with students coding through the night, fueled by pizza and energy drinks.",
  'career-fair-2023': "The Annual Career Fair on October 5, 2023, saw participation from over 50 top companies, including Amazon, Deloitte, and Goldman Sachs. Thousands of students attended, seeking internships and job opportunities. There were resume review workshops and mock interview sessions. Many students secured on-the-spot interviews. The event was a bridge between academia and industry, proving highly beneficial for the student community.",
  'founders-talk-series': "On October 20, 2023, we hosted an inspiring talk by Jane Doe, founder of 'InnovateU', a tech unicorn. She shared her entrepreneurial journey, the challenges she faced, and her vision for the future. The Q&A session was particularly engaging, with students asking insightful questions about startup culture, funding, and work-life balance. The event was a sell-out, with standing room only.",
};

export default function BlogDetailPage({ params }: { params: { slug: string } }) {
  const eventDetails = MOCK_EVENT_DETAILS[params.slug] || "No details found for this event.";
  const eventTitle = params.slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">{eventTitle}</h1>
        <p className="text-muted-foreground">AI Blog Post Generation</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Event Details</CardTitle>
            <CardDescription>This information will be used to generate the summary.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm leading-relaxed text-muted-foreground">{eventDetails}</p>
          </CardContent>
        </Card>

        <BlogSummaryGenerator eventDetails={eventDetails} />
      </div>
    </div>
  );
}
