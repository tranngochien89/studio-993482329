import AppHeader from '@/components/layout/header';
import { JOBS, getCandidatesByJobId } from '@/lib/data';
import KanbanBoard from '@/components/candidates/kanban-board';
import { notFound } from 'next/navigation';
import { AddCandidateDialog } from '@/components/candidates/add-candidate-dialog';
import { Button } from '@/components/ui/button';
import { UserPlus } from 'lucide-react';
import AppSidebar from '@/components/layout/sidebar';

export default function JobDetailPage({ params }: { params: { id: string } }) {
  const job = JOBS.find((j) => j.id === params.id);

  if (!job) {
    notFound();
  }

  const candidates = getCandidatesByJobId(job.id);

  return (
    <>
    <AppSidebar />
    <div className="flex flex-col h-full">
      <AppHeader title={job.title} />
      <div className="flex justify-end p-4 md:p-6 border-b">
          <AddCandidateDialog job={job}>
            <Button>
              <UserPlus className="mr-2 h-4 w-4" />
              Thêm ứng viên
            </Button>
          </AddCandidateDialog>
      </div>
      <main className="flex-1 overflow-x-auto p-4 md:p-6">
        <KanbanBoard initialCandidates={candidates} job={job} />
      </main>
    </div>
    </>
  );
}
