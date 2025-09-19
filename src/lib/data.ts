import type { Job, Candidate } from './types';

// Mock data
export const CANDIDATES: Candidate[] = [
  { id: 'c1', name: 'An Nguyen', email: 'an.nguyen@example.com', avatar: 'https://picsum.photos/seed/1/40/40', skills: ['React', 'Node.js', 'TypeScript'], experience: '5 years of experience in full-stack development.', stage: 'Applied', appliedDate: '2024-07-20', jobId: 'j1' },
  { id: 'c2', name: 'Binh Tran', email: 'binh.tran@example.com', avatar: 'https://picsum.photos/seed/2/40/40', skills: ['Python', 'Django', 'PostgreSQL'], experience: '3 years of experience as a backend developer.', stage: 'Screening', appliedDate: '2024-07-18', jobId: 'j1' },
  { id: 'c3', name: 'Chi Le', email: 'chi.le@example.com', avatar: 'https://picsum.photos/seed/3/40/40', skills: ['Vue.js', 'Firebase', 'UX/UI'], experience: '4 years of experience in frontend development.', stage: 'Interview 1', appliedDate: '2024-07-19', jobId: 'j1' },
  { id: 'c4', name: 'Dung Pham', email: 'dung.pham@example.com', avatar: 'https://picsum.photos/seed/4/40/40', skills: ['Java', 'Spring Boot', 'AWS'], experience: '7 years of experience in enterprise software.', stage: 'Applied', appliedDate: '2024-07-21', jobId: 'j2' },
  { id: 'c5', name: 'Em Hoang', email: 'em.hoang@example.com', avatar: 'https://picsum.photos/seed/5/40/40', skills: ['React Native', 'GraphQL'], experience: '2 years of mobile development.', stage: 'Screening', appliedDate: '2024-07-22', jobId: 'j2' },
  { id: 'c6', name: 'Giang Vo', email: 'giang.vo@example.com', avatar: 'https://picsum.photos/seed/6/40/40', skills: ['Angular', 'RxJS', 'NgRx'], experience: '6 years with enterprise Angular projects.', stage: 'Offer', appliedDate: '2024-07-15', jobId: 'j3' },
  { id: 'c7', name: 'Hieu Dinh', email: 'hieu.dinh@example.com', avatar: 'https://picsum.photos/seed/7/40/40', skills: ['DevOps', 'Kubernetes', 'Terraform'], experience: '8 years in cloud infrastructure and DevOps.', stage: 'Onboarding', appliedDate: '2024-06-30', jobId: 'j4' },
  { id: 'c8', name: 'Khanh Mai', email: 'khanh.mai@example.com', avatar: 'https://picsum.photos/seed/8/40/40', skills: ['Product Management', 'Agile', 'JIRA'], experience: '10 years leading product teams.', stage: 'Interview 2', appliedDate: '2024-07-10', jobId: 'j1' },
];

export const JOBS: Job[] = [
  {
    id: 'j1',
    title: 'Senior Frontend Engineer',
    description: 'We are looking for a seasoned frontend engineer to build beautiful and performant user interfaces.',
    skills: ['React', 'TypeScript', 'Next.js'],
    salary: '120,000 - 150,000 USD',
    location: 'Remote',
    deadline: '2024-08-15',
    status: 'Open',
  },
  {
    id: 'j2',
    title: 'Backend Developer (Java)',
    description: 'Seeking a backend developer with experience in Java and Spring ecosystem to work on our core services.',
    skills: ['Java', 'Spring Boot', 'Microservices'],
    salary: '100,000 - 130,000 USD',
    location: 'Ho Chi Minh City',
    deadline: '2024-08-20',
    status: 'Open',
  },
  {
    id: 'j3',
    title: 'UX/UI Designer',
    description: 'Creative UX/UI designer needed to shape our user experience and create intuitive workflows.',
    skills: ['Figma', 'Sketch', 'User Research'],
    salary: '80,000 - 110,000 USD',
    location: 'Hanoi',
    deadline: '2024-08-10',
    status: 'Closed',
  },
  {
    id: 'j4',
    title: 'DevOps Engineer',
    description: 'Manage our growing infrastructure and deployment pipelines to ensure reliability and scalability.',
    skills: ['AWS', 'Kubernetes', 'CI/CD'],
    salary: '130,000 - 160,000 USD',
    location: 'Remote',
    deadline: '2024-07-30',
    status: 'Pending',
  },
];

export const getCandidatesByJobId = (jobId: string) => CANDIDATES.filter(c => c.jobId === jobId);
