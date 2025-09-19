import AppHeader from '@/components/layout/header';
import JobCard from '@/components/jobs/job-card';
import { JOBS } from '@/lib/data';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { PlusCircle, Search } from 'lucide-react';
import { CreateJobDialog } from '@/components/jobs/create-job-dialog';

export default function DashboardPage() {
  const jobs = JOBS;

  return (
    <div className="flex flex-col h-full">
      <AppHeader title="Bảng điều khiển" />
      <main className="flex-1 p-4 md:p-6">
        <div className="flex flex-col sm:flex-row items-center gap-4 mb-6">
          <div className="relative flex-1 w-full sm:max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Tìm kiếm vị trí..."
              className="pl-10"
            />
          </div>
          <Select>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Lọc theo trạng thái" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả trạng thái</SelectItem>
              <SelectItem value="Open">Mở</SelectItem>
              <SelectItem value="Pending">Chờ duyệt</SelectItem>
              <SelectItem value="Closed">Đóng</SelectItem>
            </SelectContent>
          </Select>
          <div className="ml-auto flex items-center gap-2">
            <CreateJobDialog>
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                Tạo vị trí mới
              </Button>
            </CreateJobDialog>
          </div>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {jobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      </main>
    </div>
  );
}
