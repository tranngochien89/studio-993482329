'use client';

import React, { useState, useMemo } from 'react';
import type { Candidate, CandidateStage, Job } from '@/lib/types';
import { STAGES } from '@/lib/types';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import CandidateCard from './candidate-card';
import { automateCandidateNotifications } from '@/ai/flows/automate-candidate-notifications';
import { useToast } from '@/hooks/use-toast';
import { SendNotificationDialog } from './send-notification-dialog';

type KanbanBoardProps = {
  initialCandidates: Candidate[];
  job: Job;
};

export default function KanbanBoard({ initialCandidates, job }: KanbanBoardProps) {
  const [candidates, setCandidates] = useState<Candidate[]>(initialCandidates);
  const [draggedCandidateId, setDraggedCandidateId] = useState<string | null>(null);
  const [notificationState, setNotificationState] = useState<{ open: boolean; candidate: Candidate | null; job: Job | null; type: 'interviewInvite' | 'offer' | 'rejectionNotice' | null }>({ open: false, candidate: null, job: null, type: null });

  const { toast } = useToast();

  const columns = useMemo(() => {
    const grouped: Record<CandidateStage, Candidate[]> = STAGES.reduce((acc, stage) => {
      acc[stage] = [];
      return acc;
    }, {} as Record<CandidateStage, Candidate[]>);

    candidates.forEach((candidate) => {
      if (grouped[candidate.stage]) {
        grouped[candidate.stage].push(candidate);
      }
    });
    return grouped;
  }, [candidates]);

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, candidate: Candidate) => {
    setDraggedCandidateId(candidate.id);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, newStage: CandidateStage) => {
    e.preventDefault();
    if (!draggedCandidateId) return;

    const candidateToMove = candidates.find((c) => c.id === draggedCandidateId);
    if (candidateToMove && candidateToMove.stage !== newStage) {
      setCandidates((prev) =>
        prev.map((c) => (c.id === draggedCandidateId ? { ...c, stage: newStage } : c))
      );
      toast({
        title: "Cập nhật trạng thái",
        description: `Đã chuyển ${candidateToMove.name} sang giai đoạn ${newStage}.`,
      });
      // Optionally trigger notification dialog here
    }
    setDraggedCandidateId(null);
  };
  
  const handleOpenNotificationDialog = (candidate: Candidate, job: Job, type: 'interviewInvite' | 'offer' | 'rejectionNotice') => {
    setNotificationState({ open: true, candidate, job, type });
  };
  
  const handleReject = (candidate: Candidate, job: Job) => {
    handleOpenNotificationDialog(candidate, job, 'rejectionNotice');
  }

  return (
    <>
      <div className="flex-1 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6 items-start">
        {STAGES.map((stage) => (
          <div key={stage} onDragOver={handleDragOver} onDrop={(e) => handleDrop(e, stage)}>
            <Card className="bg-muted/50 h-full">
              <CardHeader className="px-4 py-3 border-b">
                <CardTitle className="flex items-center justify-between text-base font-semibold">
                  <span>{stage}</span>
                  <Badge variant="secondary" className="rounded-full">
                    {columns[stage].length}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-2 min-h-[200px]">
                {columns[stage].map((candidate) => (
                  <div key={candidate.id} onDragStart={(e) => handleDragStart(e, candidate)}>
                    <CandidateCard 
                      candidate={candidate}
                      job={job}
                      onSendNotification={(c, j, type) => handleOpenNotificationDialog(c, j, type)}
                      onReject={handleReject}
                    />
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        ))}
      </div>
      <SendNotificationDialog 
        isOpen={notificationState.open}
        setIsOpen={(open) => setNotificationState(prev => ({ ...prev, open }))}
        candidate={notificationState.candidate}
        job={notificationState.job}
        notificationType={notificationState.type}
      />
    </>
  );
}
