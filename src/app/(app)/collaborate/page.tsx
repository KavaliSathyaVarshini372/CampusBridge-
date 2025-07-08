import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, PlusCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { NewCollaborationPostDialog } from '@/components/new-collaboration-post-dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const posts = [
  {
    id: '1',
    author: 'Alice Johnson',
    avatar: 'https://placehold.co/40x40.png',
    title: 'Looking for a study group for Advanced Algorithms',
    description: 'I\'m looking for a few dedicated students to form a study group for the final exams. We would meet twice a week. Topics to cover include dynamic programming, graph algorithms, and NP-completeness.',
    tags: ['Study Group', 'Computer Science'],
    timestamp: '2 hours ago',
  },
  {
    id: '2',
    author: 'Bob Williams',
    avatar: 'https://placehold.co/40x40.png',
    title: 'Project Partner for Mobile App Development',
    description: 'I have an idea for a campus utility app and need a partner with experience in React Native and Firebase. Let\'s build something cool together!',
    tags: ['Project', 'Mobile App'],
    timestamp: '5 hours ago',
  },
  {
    id: '3',
    author: 'Charlie Brown',
    avatar: 'https://placehold.co/40x40.png',
    title: 'Join the new Hiking Club!',
    description: 'We are starting a new hiking club and looking for founding members. If you love nature and adventure, join us for our first meeting this weekend.',
    tags: ['Club', 'Outdoors'],
    timestamp: '1 day ago',
  },
];

export default function CollaboratePage() {
  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Collaboration Portal</h1>
          <p className="text-muted-foreground">Find partners for your next big idea.</p>
        </div>
        <NewCollaborationPostDialog />
      </div>

      <div className="flex items-center gap-4 mb-8">
        <Select>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by interest" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="study">Study Group</SelectItem>
            <SelectItem value="project">Project</SelectItem>
            <SelectItem value="club">Club</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {posts.map((post) => (
          <Card key={post.id} className="flex flex-col shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Avatar>
                    <AvatarImage src={post.avatar} alt={post.author} data-ai-hint="person face" />
                    <AvatarFallback>{post.author.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold">{post.author}</p>
                    <p className="text-sm text-muted-foreground">{post.timestamp}</p>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem>View Profile</DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive focus:text-destructive focus:bg-destructive/10">Report</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            <CardContent className="flex-grow">
              <CardTitle className="text-lg mb-2">{post.title}</CardTitle>
              <div className="flex flex-wrap gap-2 mb-4">
                {post.tags.map((tag) => (
                  <Badge key={tag} variant="secondary">{tag}</Badge>
                ))}
              </div>
              <CardDescription>{post.description}</CardDescription>
            </CardContent>
            <CardFooter className="bg-secondary/30">
              <Button className="w-full">Express Interest</Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
