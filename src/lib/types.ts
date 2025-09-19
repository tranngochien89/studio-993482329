export type Job = {
  id: string;
  title: string;
  description: string;
  skills: string[];
  salary?: string;
  location: string;
  deadline: string;
  status: 'Open' | 'Extended' | 'Pending' | 'Closed';
  postedDate: string;
  numberOfApplicants?: number;
};

export type Candidate = {
  id: string;
  name: string;
  email: string;
  avatar: string;
  skills: string[];
  experience: string; // summary
  stage: CandidateStage;
  appliedDate: string;
  jobId: string;
  jobTitle?: string;
};

export type CandidateStage = 'Applied' | 'Screening' | 'Interview 1' | 'Interview 2' | 'Offer' | 'Onboarding';

export const STAGES: CandidateStage[] = [
  'Applied',
  'Screening',
  'Interview 1',
  'Interview 2',
  'Offer',
  'Onboarding',
];
