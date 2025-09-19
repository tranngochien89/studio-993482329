
import AppHeader from '@/components/layout/header';
import { JOBS, CANDIDATES } from '@/lib/data';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, PlusCircle } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { CreateJobDialog } from '@/components/jobs/create-job-dialog';
import { cn } from '@/lib/utils';
import Link from 'next/link';

const statusColors: { [key: string]: string } = {
  Open: 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-700/50',
  Pending: 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-300 dark:border-yellow-700/50',
  Closed: 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-700/50',
  Extended: 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-700/50',
};


export default function JobsPage() {
  const jobs = JOBS;

  const getCandidateCount = (jobId: string) => {
    return CANDIDATES.filter(c => c.jobId === jobId).length;
  };

  return (
    <div className="flex flex-col h-full">
      <AppHeader title="Quản lý việc làm" />
      <main className="flex-1 p-4 md:p-6">
        <div className="flex items-center mb-6">
          <h2 className="text-2xl font-semibold">Danh sách việc làm</h2>
          <div className="ml-auto">
            <CreateJobDialog>
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                Tạo vị trí mới
              </Button>
            </CreateJobDialog>
          </div>
        </div>
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[40%]">Tên vị trí</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Ứng viên</TableHead>
                <TableHead>Hạn nộp</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {jobs.map((job) => (
                <TableRow key={job.id}>
                  <TableCell className="font-medium">
                    <Link href={`/jobs/${job.id}`} className="hover:underline text-primary">
                        {job.title}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <Badge className={cn(statusColors[job.status])}>
                      {job.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{getCandidateCount(job.id)}</TableCell>
                  <TableCell>{job.deadline}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Mở menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Thao tác</DropdownMenuLabel>
                        <DropdownMenuItem>Chỉnh sửa</DropdownMenuItem>
                        <DropdownMenuItem>Xem ứng viên</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive">
                          Xóa
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </main>
    </div>
  );
}
