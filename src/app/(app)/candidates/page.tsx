
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import AppHeader from '@/components/layout/header';
import AppSidebar from '@/components/layout/sidebar';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MoreHorizontal, Search, Eye } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import type { Candidate } from '@/lib/types';
import { format } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';
import { useDebounce } from '@/hooks/use-debounce';

const stageColors: { [key: string]: string } = {
  Applied: 'bg-blue-100 text-blue-800 border-blue-200',
  Screening: 'bg-purple-100 text-purple-800 border-purple-200',
  'Interview 1': 'bg-yellow-100 text-yellow-800 border-yellow-200',
  'Interview 2': 'bg-orange-100 text-orange-800 border-orange-200',
  Offer: 'bg-green-100 text-green-800 border-green-200',
  Onboarding: 'bg-teal-100 text-teal-800 border-teal-200',
};


export default function CandidatesPage() {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const { toast } = useToast();

  const fetchCandidates = useCallback(async () => {
    setIsLoading(true);
    try {
      const query = new URLSearchParams({ search: debouncedSearchTerm }).toString();
      const response = await fetch(`/api/candidates?${query}`);
      if (!response.ok) {
        throw new Error('Failed to fetch candidates');
      }
      const { data } = await response.json();
      setCandidates(data);
    } catch (e: any) {
      setError(e.message);
      toast({
        variant: 'destructive',
        title: 'Lỗi',
        description: 'Không thể tải danh sách ứng viên.',
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast, debouncedSearchTerm]);

  useEffect(() => {
    fetchCandidates();
  }, [fetchCandidates]);

  return (
    <div className="w-full">
      <AppSidebar />
      <div className="flex flex-col w-full">
        <AppHeader title="Quản lý Ứng viên" />
        <main className="flex-1 p-4 md:p-6">
          <div className="flex items-center mb-6 gap-4">
            <h2 className="text-2xl font-semibold">Tất cả ứng viên</h2>
            <div className="relative ml-auto flex-1 md:grow-0">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                    type="search"
                    placeholder="Tìm kiếm theo tên, kỹ năng..."
                    className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[320px]"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
          </div>
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[30%]">Thông tin ứng viên</TableHead>
                  <TableHead>Vị trí ứng tuyển</TableHead>
                  <TableHead>Kỹ năng</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead>Ngày nộp</TableHead>
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                    Array.from({length: 8}).map((_, i) => (
                        <TableRow key={i}>
                            <TableCell>
                                <div className="flex items-center gap-3">
                                    <Skeleton className="h-10 w-10 rounded-full" />
                                    <div className="space-y-1">
                                        <Skeleton className="h-4 w-32" />
                                        <Skeleton className="h-3 w-40" />
                                    </div>
                                </div>
                            </TableCell>
                            <TableCell><Skeleton className="h-4 w-40" /></TableCell>
                            <TableCell><Skeleton className="h-4 w-48" /></TableCell>
                            <TableCell><Skeleton className="h-5 w-24 rounded-full" /></TableCell>
                            <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                            <TableCell className="text-right"><Skeleton className="h-8 w-8 ml-auto" /></TableCell>
                        </TableRow>
                    ))
                ) : error ? (
                    <TableRow>
                        <TableCell colSpan={6} className="text-center text-destructive">{error}</TableCell>
                    </TableRow>
                ) : candidates.map((candidate) => (
                  <TableRow key={candidate.id}>
                    <TableCell>
                        <div className="flex items-center gap-3">
                            <Avatar>
                                <AvatarImage src={candidate.avatar} alt={candidate.name} />
                                <AvatarFallback>{candidate.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                                <p className="font-medium">{candidate.name}</p>
                                <p className="text-sm text-muted-foreground">{candidate.email}</p>
                            </div>
                        </div>
                    </TableCell>
                    <TableCell>
                      <Link href={`/jobs/${candidate.jobId}`} className="hover:underline text-primary">
                          {candidate.jobTitle}
                      </Link>
                    </TableCell>
                    <TableCell>
                        <div className="flex flex-wrap gap-1">
                            {candidate.skills.slice(0,3).map(skill => (
                                <Badge key={skill} variant="secondary">{skill}</Badge>
                            ))}
                        </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={stageColors[candidate.stage] || 'bg-gray-100 text-gray-800'}>
                        {candidate.stage}
                      </Badge>
                    </TableCell>
                    <TableCell>{format(new Date(candidate.appliedDate), 'dd/MM/yyyy')}</TableCell>
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
                          <DropdownMenuItem asChild>
                             <Link href={`/jobs/${candidate.jobId}`}><Eye className="mr-2" /> Xem trong job</Link>
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
    </div>
  );
}
