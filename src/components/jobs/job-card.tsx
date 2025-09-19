import Link from 'next/link';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { Job } from '@/lib/types';
import { getCandidatesByJobId } from '@/lib/data';
import { MapPin, Users, Calendar, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

type JobCardProps = {
  job: Job;
};

const statusColors = {
  Open: 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-700/50',
  Pending: 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-300 dark:border-yellow-700/50',
  Closed: 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-700/50',
  Extended: 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-700/50',
};

export default function JobCard({ job }: JobCardProps) {
  const candidates = getCandidatesByJobId(job.id);

  return (
    <Card className="flex flex-col h-full hover:shadow-lg transition-shadow duration-300">
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl font-bold">{job.title}</CardTitle>
          <Badge className={cn(statusColors[job.status])}>{job.status}</Badge>
        </div>
        <CardDescription className="line-clamp-2 pt-2">{job.description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow space-y-3">
        <div className="flex items-center text-sm text-muted-foreground">
          <MapPin className="mr-2 h-4 w-4 text-accent" />
          <span>{job.location}</span>
        </div>
        <div className="flex items-center text-sm text-muted-foreground">
          <Users className="mr-2 h-4 w-4 text-accent" />
          <span>{candidates.length} ứng viên</span>
        </div>
        <div className="flex items-center text-sm text-muted-foreground">
          <Calendar className="mr-2 h-4 w-4 text-accent" />
          <span>Hạn nộp: {job.deadline}</span>
        </div>
      </CardContent>
      <CardFooter>
        <Button asChild variant="ghost" className="w-full justify-start text-primary hover:text-primary">
          <Link href={`/jobs/${job.id}`}>
            Quản lý ứng viên <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
