import { NextRequest, NextResponse } from 'next/server';
import { CANDIDATES, JOBS } from '@/lib/data';
import type { Candidate } from '@/lib/types';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const searchTerm = searchParams.get('search')?.toLowerCase() || '';

  const candidatesWithJobTitles = CANDIDATES.map(candidate => {
    const job = JOBS.find(j => j.id === candidate.jobId);
    return {
      ...candidate,
      jobTitle: job?.title || 'Unknown Job'
    };
  });

  let filteredCandidates: Candidate[] = candidatesWithJobTitles;

  if (searchTerm) {
    filteredCandidates = filteredCandidates.filter(candidate => 
      candidate.name.toLowerCase().includes(searchTerm) ||
      candidate.email.toLowerCase().includes(searchTerm) ||
      candidate.skills.some(skill => skill.toLowerCase().includes(searchTerm)) ||
      (candidate.jobTitle && candidate.jobTitle.toLowerCase().includes(searchTerm))
    );
  }
  
  // Sort by applied date descending
  filteredCandidates.sort((a, b) => new Date(b.appliedDate).getTime() - new Date(a.appliedDate).getTime());

  return NextResponse.json({
    data: filteredCandidates,
    meta: {
      total: filteredCandidates.length,
    },
    error: null,
  });
}
