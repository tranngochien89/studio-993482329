'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { automateCandidateNotifications } from '@/ai/flows/automate-candidate-notifications';
import { Loader2 } from 'lucide-react';
import type { Candidate, Job } from '@/lib/types';

type NotificationType = 'interviewInvite' | 'offer' | 'rejectionNotice';

const notificationConfig = {
    interviewInvite: {
        title: "Gửi lời mời phỏng vấn",
        description: "Lên lịch và gửi lời mời phỏng vấn cho ứng viên.",
    },
    offer: {
        title: "Gửi thư mời nhận việc (Offer)",
        description: "Gửi thư mời nhận việc chính thức đến ứng viên.",
    },
    rejectionNotice: {
        title: "Gửi thư từ chối",
        description: "Soạn và gửi thư từ chối cho ứng viên.",
    }
}

type SendNotificationDialogProps = {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  candidate: Candidate | null;
  job: Job | null;
  notificationType: NotificationType | null;
};

export function SendNotificationDialog({ isOpen, setIsOpen, candidate, job, notificationType }: SendNotificationDialogProps) {
  const [isSending, setIsSending] = useState(false);
  const [interviewDateTime, setInterviewDateTime] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen) {
      setInterviewDateTime('');
      setRejectionReason('Cảm ơn bạn đã dành thời gian tham gia phỏng vấn. Rất tiếc ở thời điểm hiện tại, chúng tôi đã quyết định lựa chọn ứng viên khác phù hợp hơn với vị trí này.');
    }
  }, [isOpen]);

  const handleSendNotification = async () => {
    if (!candidate || !job || !notificationType) return;

    setIsSending(true);
    try {
      const result = await automateCandidateNotifications({
        candidateName: candidate.name,
        candidateEmail: candidate.email,
        jobTitle: job.title,
        stage: candidate.stage,
        notificationType: notificationType,
        companyName: 'HR Central', // Replace with dynamic company name if available
        hiringManagerName: 'Bộ phận Tuyển dụng', // Replace with dynamic manager name
        ...(notificationType === 'interviewInvite' && { interviewDateTime }),
        ...(notificationType === 'rejectionNotice' && { rejectionReason }),
      });

      if (result.success) {
        toast({
          title: "Gửi thông báo thành công",
          description: result.message,
        });
      } else {
        throw new Error(result.message);
      }
      setIsOpen(false);
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: "Lỗi gửi thông báo",
        description: error.message || "Đã có lỗi xảy ra. Vui lòng thử lại.",
      });
    } finally {
      setIsSending(false);
    }
  };

  const config = notificationType ? notificationConfig[notificationType] : null;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>{config?.title}</DialogTitle>
          <DialogDescription>
            {config?.description}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="candidate-name" className="text-right">
              Ứng viên
            </Label>
            <Input id="candidate-name" value={candidate?.name || ''} readOnly className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="job-title" className="text-right">
              Vị trí
            </Label>
            <Input id="job-title" value={job?.title || ''} readOnly className="col-span-3" />
          </div>
          
          {notificationType === 'interviewInvite' && (
            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="interview-time" className="text-right">
                    Thời gian
                </Label>
                <Input 
                    id="interview-time" 
                    type="datetime-local" 
                    className="col-span-3"
                    value={interviewDateTime}
                    onChange={(e) => setInterviewDateTime(e.target.value)}
                />
            </div>
          )}

          {notificationType === 'rejectionNotice' && (
            <div className="grid grid-cols-4 items-start gap-4">
                <Label htmlFor="rejection-reason" className="text-right pt-2">
                    Lý do từ chối
                </Label>
                <Textarea 
                    id="rejection-reason" 
                    className="col-span-3"
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    rows={4}
                />
            </div>
          )}
        </div>
        <DialogFooter>
          <Button onClick={handleSendNotification} disabled={isSending}>
            {isSending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isSending ? 'Đang gửi...' : 'Gửi thông báo'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
