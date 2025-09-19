'use client';

import React, { useState, useEffect, useCallback } from 'react';
import AppHeader from '@/components/layout/header';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button, buttonVariants } from '@/components/ui/button';
import { MoreHorizontal, PlusCircle, Trash2, Edit, Eye } from 'lucide-react';
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
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import type { Job } from '@/lib/types';
import { format } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';
import AppSidebar from '@/components/layout/sidebar';

const statusColors: { [key: string]: string } = {
  Open: 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-700/50',
  Pending: 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-300 dark:border-yellow-700/50',
  Closed: 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-700/50',
  Extended: 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-700/50',
};


export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const [jobToDelete, setJobToDelete] = useState<Job | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [jobToEdit, setJobToEdit] = useState<Job | null>(null);

  const fetchJobs = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/jobs');
      if (!response.ok) {
        throw new Error('Failed to fetch jobs');
      }
      const { data } = await response.json();
      setJobs(data);
    } catch (e: any) {
      setError(e.message);
      toast({
        variant: 'destructive',
        title: 'Lỗi',
        description: 'Không thể tải danh sách công việc.',
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  const handleDeleteJob = async () => {
    if (!jobToDelete) return;

    try {
      const response = await fetch(`/api/jobs/${jobToDelete.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete job');
      }
      
      toast({
        title: 'Thành công',
        description: `Công việc "${jobToDelete.title}" đã được xóa.`,
      });
      fetchJobs(); // Refresh the list
    } catch (error) {
       toast({
        variant: 'destructive',
        title: 'Lỗi',
        description: 'Không thể xóa công việc. Vui lòng thử lại.',
      });
    } finally {
      setJobToDelete(null);
    }
  };
  
  const handleJobCreated = () => {
    fetchJobs();
    setIsCreateDialogOpen(false);
  }

  const handleJobUpdated = () => {
    fetchJobs();
    setJobToEdit(null);
    setIsCreateDialogOpen(false);
  }

  const openEditDialog = (job: Job) => {
    setJobToEdit(job);
    setIsCreateDialogOpen(true);
  }

  const openCreateDialog = () => {
    setJobToEdit(null);
    setIsCreateDialogOpen(true);
  }

  return (
    <div className="w-full">
      <AppSidebar />
      <div className="flex flex-col w-full">
        <AppHeader title="Quản lý việc làm" />
        <main className="flex-1 p-4 md:p-6">
          <div className="flex items-center mb-6">
            <h2 className="text-2xl font-semibold">Danh sách việc làm</h2>
            <div className="ml-auto">
                <Button onClick={openCreateDialog}>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Tạo vị trí mới
                </Button>
            </div>
          </div>
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[35%]">Tên vị trí</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead>Ứng viên</TableHead>
                  <TableHead>Hạn nộp</TableHead>
                  <TableHead>Ngày đăng</TableHead>
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                    Array.from({length: 5}).map((_, i) => (
                        <TableRow key={i}>
                            <TableCell><Skeleton className="h-5 w-3/4" /></TableCell>
                            <TableCell><Skeleton className="h-5 w-20" /></TableCell>
                            <TableCell><Skeleton className="h-5 w-10" /></TableCell>
                            <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                            <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                            <TableCell className="text-right"><Skeleton className="h-8 w-8 ml-auto" /></TableCell>
                        </TableRow>
                    ))
                ) : error ? (
                    <TableRow>
                        <TableCell colSpan={6} className="text-center text-destructive">{error}</TableCell>
                    </TableRow>
                ) : jobs.map((job) => (
                  <TableRow key={job.id}>
                    <TableCell className="font-medium">
                      <Link href={`/jobs/${job.id}`} className="hover:underline text-primary">
                          {job.title}
                      </Link>
                      <p className="text-xs text-muted-foreground">{job.location}</p>
                    </TableCell>
                    <TableCell>
                      <Badge className={cn(statusColors[job.status])}>
                        {job.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{job.numberOfApplicants || 0}</TableCell>
                    <TableCell>{format(new Date(job.deadline), 'dd/MM/yyyy')}</TableCell>
                    <TableCell>{format(new Date(job.postedDate), 'dd/MM/yyyy')}</TableCell>
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
                          <DropdownMenuItem onClick={() => openEditDialog(job)}>
                            <Edit className="mr-2"/> Chỉnh sửa
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link href={`/jobs/${job.id}`}><Eye className="mr-2" /> Xem ứng viên</Link>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive" onClick={() => setJobToDelete(job)}>
                            <Trash2 className="mr-2"/> Xóa
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

      <CreateJobDialog 
        isOpen={isCreateDialogOpen} 
        setIsOpen={setIsCreateDialogOpen}
        onJobCreated={handleJobCreated}
        onJobUpdated={handleJobUpdated}
        jobToEdit={jobToEdit}
      />
      
      <AlertDialog open={!!jobToDelete} onOpenChange={(open) => !open && setJobToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Bạn có chắc chắn muốn xóa?</AlertDialogTitle>
            <AlertDialogDescription>
              Hành động này không thể hoàn tác. Công việc "{jobToDelete?.title}" sẽ bị xóa vĩnh viễn.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteJob} className={buttonVariants({ variant: "destructive" })}>Xóa</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
