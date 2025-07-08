import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal } from "lucide-react"

const reports = [
  { id: '1', itemType: 'Collaboration Post', reportedBy: 'user123@example.com', reason: 'Spam', date: '2024-05-20', status: 'Pending' },
  { id: '2', itemType: 'User Profile', reportedBy: 'user456@example.com', reason: 'Inappropriate Content', date: '2024-05-19', status: 'Pending' },
  { id: '3', itemType: 'Event Comment', reportedBy: 'user789@example.com', reason: 'Harassment', date: '2024-05-18', status: 'Resolved' },
];

export default function AdminPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground">Oversee and manage platform activity.</p>
      </div>
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Abuse Reports</CardTitle>
          <CardDescription>
            Manage user-submitted reports of inappropriate content or behavior.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Item Type</TableHead>
                <TableHead className="hidden sm:table-cell">Reported By</TableHead>
                <TableHead>Reason</TableHead>
                <TableHead className="hidden md:table-cell">Status</TableHead>
                <TableHead className="hidden lg:table-cell">Date</TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reports.map((report) => (
                <TableRow key={report.id}>
                  <TableCell className="font-medium">{report.itemType}</TableCell>
                  <TableCell className="hidden sm:table-cell">{report.reportedBy}</TableCell>
                  <TableCell>{report.reason}</TableCell>
                  <TableCell className="hidden md:table-cell">
                    <Badge variant={report.status === 'Pending' ? 'destructive' : 'secondary'}>
                      {report.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">{report.date}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button aria-haspopup="true" size="icon" variant="ghost">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Toggle menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem>View Item</DropdownMenuItem>
                        <DropdownMenuItem>Dismiss Report</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive focus:text-destructive focus:bg-destructive/10">
                          Ban User
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
