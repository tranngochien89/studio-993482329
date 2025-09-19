import type { Candidate, Job } from '@/lib/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Mail, XCircle, MoreVertical } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

type CandidateCardProps = {
  candidate: Candidate;
  job: Job;
  onSendNotification: (candidate: Candidate, job: Job, type: 'interviewInvite' | 'offer') => void;
  onReject: (candidate: Candidate, job: Job) => void;
};

export default function CandidateCard({ candidate, job, onSendNotification, onReject }: CandidateCardProps) {
  return (
    <Card
      className="mb-4 bg-card hover:shadow-md transition-shadow"
      draggable
    >
      <CardHeader className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10 border">
              <AvatarImage src={candidate.avatar} alt={candidate.name} data-ai-hint="person portrait" />
              <AvatarFallback>{candidate.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold">{candidate.name}</p>
              <p className="text-xs text-muted-foreground">{candidate.email}</p>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onSendNotification(candidate, job, 'interviewInvite')}>
                <Mail className="mr-2 h-4 w-4" />
                <span>Gửi lời mời phỏng vấn</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onSendNotification(candidate, job, 'offer')}>
                 <Mail className="mr-2 h-4 w-4" />
                <span>Gửi offer</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="text-destructive" onClick={() => onReject(candidate, job)}>
                <XCircle className="mr-2 h-4 w-4" />
                <span>Từ chối ứng viên</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{candidate.experience}</p>
        <div className="flex flex-wrap gap-1">
          {candidate.skills.slice(0, 3).map((skill) => (
            <Badge key={skill} variant="secondary">
              {skill}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
