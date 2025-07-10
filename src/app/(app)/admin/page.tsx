
'use client';

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
import { getReports, updateReportStatus } from "@/app/actions/admin"
import { useEffect, useState, useTransition } from "react";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

type Report = {
    id: string;
    itemType: string;
    reportedBy: string;
    reason: string;
    date: string;
    status: string;
}

export default function AdminPage() {
    const [reports, setReports] = useState<Report[]>([]);
    const [isPending, startTransition] = useTransition();
    const { toast } = useToast();

    useEffect(() => {
        startTransition(async () => {
            const fetchedReports = await getReports() as Report[];
            setReports(fetchedReports);
        });
    }, []);

    const handleUpdateStatus = async (reportId: string, status: 'Resolved' | 'Dismissed') => {
        const result = await updateReportStatus(reportId, status);
        if (result.success) {
            toast({ title: "Success", description: `Report status updated to ${status}.` });
            setReports(prevReports => prevReports.map(r => r.id === reportId ? { ...r, status } : r));
        } else {
            toast({ title: "Error", description: result.message, variant: 'destructive' });
        }
    };

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
              {isPending ? (
                <TableRow>
                    <TableCell colSpan={6}>
                        <div className="space-y-2">
                           <Skeleton className="h-8 w-full" />
                           <Skeleton className="h-8 w-full" />
                           <Skeleton className="h-8 w-full" />
                        </div>
                    </TableCell>
                </TableRow>
              ) : reports.length === 0 ? (
                <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                        No reports found.
                    </TableCell>
                </TableRow>
              ) : reports.map((report) => (
                <TableRow key={report.id}>
                  <TableCell className="font-medium">{report.itemType}</TableCell>
                  <TableCell className="hidden sm:table-cell">{report.reportedBy}</TableCell>
                  <TableCell>{report.reason}</TableCell>
                  <TableCell className="hidden md:table-cell">
                    <Badge variant={report.status === 'Pending' ? 'destructive' : report.status === 'Resolved' ? 'default' : 'secondary'}>
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
                        <DropdownMenuItem onSelect={() => handleUpdateStatus(report.id, 'Resolved')}>Mark as Resolved</DropdownMenuItem>
                        <DropdownMenuItem onSelect={() => handleUpdateStatus(report.id, 'Dismissed')}>Dismiss Report</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive focus:text-destructive focus:bg-destructive/10">
                          Ban User (Not implemented)
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
